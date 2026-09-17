import supabase from '../server/db-client.js';
import { createToken, hashToken } from '../server/auth.js';
import { respondError } from '../server/errors.js';

/**
 * Création d’un site et de sa clé d’édition.
 *
 * Seul point d’entrée pour créer un site : `POST /api/wedding-sites` n’existe
 * plus, afin qu’aucun site ne puisse naître sans clé — il serait sinon
 * inadministrable, ou pire, administrable par n’importe qui.
 *
 * Réponse : `{ site, edit_token }`. Le jeton en clair n’est renvoyé **qu’ici,
 * une seule fois** ; la base n’en conserve que l’empreinte SHA-256.
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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-site-token');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const payload = parseBody(req);
    if (!payload.slug || !payload.partner1 || !payload.partner2) {
      return res.status(400).json({ error: 'slug, partner1 et partner2 sont requis' });
    }

    // Nettoyage minimal pour éviter un insert qui explose à cause d'un type
    if (payload.wedding_date === '') delete payload.wedding_date;

    let site = null;
    let lastError = null;

    // Tentative avec retry sur collision de slug (très rare mais possible avec random)
    for (let attempt = 0; attempt < 3; attempt++) {
      const tryPayload = attempt === 0 ? payload : { ...payload, slug: `${payload.slug}-${Math.random().toString(36).slice(2, 4)}` };
      const { data, error } = await supabase.from('wedding_sites').insert(tryPayload).select().single();
      if (!error) {
        site = data;
        break;
      }
      lastError = error;
      // 23505 = unique violation Postgres
      const isSlugConflict = error.code === '23505' || (error.message && error.message.includes('slug'));
      if (!isSlugConflict) break;
    }

    if (!site) throw lastError || new Error('Impossible de créer le site');

    const token = createToken();
    const { error: secretError } = await supabase
      .from('site_secrets')
      .insert({ site_id: site.id, edit_token: hashToken(token) });

    if (secretError) {
      // Sans clé, le site serait inadministrable : on ne le laisse pas orphelin.
      try {
        await supabase.from('wedding_sites').delete().eq('id', site.id);
      } catch (cleanupErr) {
        console.error('Cleanup after secret insert failed:', cleanupErr);
      }
      throw secretError;
    }

    return res.status(201).json({ site, edit_token: token });
  } catch (err) {
    return respondError(res, err, 'create-site');
  }
}
