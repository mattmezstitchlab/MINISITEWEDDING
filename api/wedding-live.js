import supabase from '../server/db-client.js';
import { respondError } from '../server/errors.js';
import { appliquerGeste, invitesAuComptoir, normaliser } from '../server/live.js';

/**
 * LE COMPTOIR PARTAGÉ
 *
 *   GET  ?style_id=…            -> l'état du comptoir (le couple le lit en boucle)
 *   POST { style_id, geste }    -> un geste d'invité, appliqué et renvoyé
 *   PUT  { style_id, payload }  -> remise à zéro, pour les mariés
 *
 * La lecture est ouverte, comme le sont les pages : n'importe qui peut lire le
 * comptoir pourvu qu'il connaisse l'univers. Les écritures passent toutes par
 * `appliquerGeste`, qui ne sait faire que cinq choses et refuse le reste : on
 * ne peut pas prendre une ligne déjà prise, ni lâcher celle d'un autre, ni
 * compter deux fois le même reçu.
 *
 * Rien de personnel ici : des prénoms d'invités, des articles et des morceaux.
 * Comme pour les réponses RSVP, si un jour il faut fermer, la clé d'édition du
 * site se branche sur `server/auth.js` sans toucher au front.
 */

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-site-token, x-person-token');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!['GET', 'POST', 'PUT'].includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = parseBody(req);
    const styleId = String((req.query?.style_id || body.style_id || '')).trim();
    if (!styleId) return res.status(400).json({ error: 'style_id requis' });

    const { data, error } = await supabase
      .from('wedding_live')
      .select('*')
      .eq('style_id', styleId)
      .maybeSingle();
    if (error) throw error;

    const courant = data ? normaliser(data.payload) : { prises: [], demandes: [], journal: [] };
    const enveloppe = (payload) => ({
      style_id: styleId,
      payload,
      updated_at: data?.updated_at ?? null,
      invites: invitesAuComptoir(payload),
    });

    if (req.method === 'GET') return res.status(200).json(enveloppe(courant));

    if (req.method === 'POST') {
      const suivant = appliquerGeste(courant, body.geste);
      // Le geste ne change rien : on renvoie l'état tel quel, sans écrire.
      if (!suivant) return res.status(200).json({ ...enveloppe(courant), applique: false });

      const updated_at = new Date().toISOString();
      if (!data) {
        const { error: insertError } = await supabase
          .from('wedding_live')
          .insert({ style_id: styleId, payload: suivant, updated_at });
        if (insertError) throw insertError;
      } else {
        const { error: updateError } = await supabase
          .from('wedding_live')
          .update({ payload: suivant, updated_at })
          .eq('style_id', styleId);
        if (updateError) throw updateError;
      }
      return res.status(200).json({ style_id: styleId, payload: suivant, updated_at, invites: invitesAuComptoir(suivant), applique: true });
    }

    /* PUT : on remet le comptoir à zéro, ou l'on pose un panier complet (les
       mariés, depuis leur page, quand ils valident une provision). */
    const payload = body.payload && typeof body.payload === 'object' ? normaliser(body.payload) : null;
    if (!payload) return res.status(400).json({ error: 'payload requis' });
    const updated_at = new Date().toISOString();

    if (!data) {
      const { error: insertError } = await supabase
        .from('wedding_live')
        .insert({ style_id: styleId, payload, updated_at });
      if (insertError) throw insertError;
    } else {
      const { error: updateError } = await supabase
        .from('wedding_live')
        .update({ payload, updated_at })
        .eq('style_id', styleId);
      if (updateError) throw updateError;
    }
    return res.status(200).json({ style_id: styleId, payload, updated_at, invites: invitesAuComptoir(payload), applique: true });
  } catch (error) {
    return respondError(res, error, 'wedding-live');
  }
}
