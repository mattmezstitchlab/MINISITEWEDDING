import supabase from '../server/db-client.js';
import { createToken, hashToken, ownerPersonId, membershipsOf } from '../server/auth.js';
import { respondError } from '../server/errors.js';
import { cleanPersonPatch, publicMembershipsOf, redactPerson, resolveSiteId, canReadSite, viewerFor } from '../server/people.js';

/**
 * LES CARTES
 *
 *   POST  /api/people                 -> crée une personne et sa clé (une fois)
 *   GET   /api/people                 -> ma carte, complète (clé personnelle)
 *   GET   /api/people?id=…            -> une carte (et ses mariages publiés), filtrée
 *   GET   /api/people?slug=…          -> les cartes des membres d’un mariage
 *   PUT   /api/people                 -> met à jour sa carte (clé personnelle)
 *
 * Écrit à la main, comme `api/wedding-sites.js` : la création rend une clé, la
 * lecture dépend d’un secret, et la liste dépend du mariage — trois choses qui
 * ne rentrent pas dans le moule de `crud()`.
 *
 * Aucune donnée n’est inventée : une carte vide sort vide, et un champ masqué
 * sort vide plutôt que bricolé.
 */

const MAX_PHOTO = 400000; // ~300 Ko une fois décodée, la carte est déjà réduite côté navigateur

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

function baseHeaders(res, methods) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', `${methods}, OPTIONS`);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-site-token, x-person-token');
}

/** Créer sa carte : seul point d’entrée, et le seul qui renvoie la clé. */
async function creer(req, res) {
  const propre = cleanPersonPatch(parseBody(req));
  if (!propre.first_name || !propre.first_name.trim()) {
    return res.status(400).json({ error: 'Le prénom est requis pour créer une carte' });
  }
  if (typeof propre.photo === 'string' && propre.photo.length > MAX_PHOTO) {
    return res.status(413).json({ error: 'Photo trop lourde' });
  }

  const { data: person, error } = await supabase.from('people').insert(propre).select().single();
  if (error) throw error;

  const token = createToken();
  const { error: secretError } = await supabase
    .from('person_secrets')
    .insert({ person_id: person.id, key_hash: hashToken(token) });

  if (secretError) {
    // Sans clé, la carte serait inadministrable : on ne la laisse pas orpheline.
    try {
      await supabase.from('people').delete().eq('id', person.id);
    } catch (nettoyage) {
      console.error('Cleanup after person secret insert failed:', nettoyage);
    }
    throw secretError;
  }

  const viewer = { personId: Number(person.id), memberships: [] };
  return res.status(201).json({ person: redactPerson(person, viewer), person_token: token });
}

async function modifier(req, res) {
  const personId = await ownerPersonId(req);
  if (!personId) return res.status(403).json({ error: 'Clé personnelle requise' });

  const patch = cleanPersonPatch(parseBody(req));
  if (Object.keys(patch).length === 0) {
    return res.status(400).json({ error: 'Aucun champ reconnu à modifier' });
  }
  const trop = typeof patch.photo === 'string' && patch.photo.length > MAX_PHOTO;
  if (trop) return res.status(413).json({ error: 'Photo trop lourde' });

  patch.updated_at = new Date().toISOString();

  const { data, error } = await supabase.from('people').update(patch).eq('id', personId).select().single();
  if (error) throw error;
  if (!data) return res.status(404).json({ error: 'Introuvable' });

  const memberships = await membershipsOf(personId);
  return res.status(200).json({ person: redactPerson(data, { personId, memberships }) });
}

async function lire(req, res) {
  const { id, site_id: siteParam, slug } = req.query || {};
  const viewer = await viewerFor(req);

  // Sans cible : ma carte, et rien d’autre.
  if (!id && !siteParam && !slug) {
    if (!viewer.personId) return res.status(400).json({ error: 'id, site_id ou slug requis' });
    const { data, error } = await supabase.from('people').select('*').eq('id', viewer.personId).maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Introuvable' });
    return res.status(200).json({ person: redactPerson(data, viewer) });
  }

  const siteId = await resolveSiteId({ site_id: siteParam, slug });

  // Une carte précise : la permission dépend du mariage dans lequel on la lit.
  // Lue seule, elle porte aussi les mariages publiés où cette carte a sa place :
  // c'est ce qui fait une page de profil — un rôle, un univers.
  if (id) {
    const { data, error } = await supabase.from('people').select('*').eq('id', Number(id)).maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Introuvable' });
    const memberships = siteId ? [] : await publicMembershipsOf(Number(id));
    return res.status(200).json({ person: redactPerson(data, viewer, siteId), memberships });
  }

  if (!siteId) return res.status(404).json({ error: 'Introuvable' });
  if (!(await canReadSite(req, viewer, siteId))) {
    return res.status(404).json({ error: 'Introuvable' });
  }

  const { data: membres, error: erreurMembres } = await supabase
    .from('wedding_members')
    .select('person_id, joined_at')
    .eq('site_id', siteId);
  if (erreurMembres) throw erreurMembres;

  const ids = (membres || []).map((m) => Number(m.person_id)).filter((n) => Number.isFinite(n));
  if (ids.length === 0) return res.status(200).json({ people: [] });

  const { data: gens, error: erreurGens } = await supabase.from('people').select('*').in('id', ids);
  if (erreurGens) throw erreurGens;

  const parId = new Map((gens || []).map((p) => [Number(p.id), p]));
  const people = ids
    .map((personId) => parId.get(personId))
    .filter(Boolean)
    .map((person) => redactPerson(person, viewer, siteId));

  return res.status(200).json({ people });
}

export default async function handler(req, res) {
  baseHeaders(res, 'GET, POST, PUT');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!['GET', 'POST', 'PUT'].includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (req.method === 'POST') return await creer(req, res);
    if (req.method === 'PUT') return await modifier(req, res);
    return await lire(req, res);
  } catch (err) {
    return respondError(res, err, 'people');
  }
}
