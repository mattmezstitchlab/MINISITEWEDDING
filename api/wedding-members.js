import supabase from '../server/db-client.js';
import { ownerPersonId } from '../server/auth.js';
import { respondError } from '../server/errors.js';
import { canReadSite, isValidRoleId, redactMemberRow, resolveSiteId, viewerFor } from '../server/people.js';

/**
 * LES PERSONNES DU MARIAGE
 *
 *   GET    /api/wedding-members?slug=…        -> les membres, cartes filtrées
 *   POST   /api/wedding-members               -> rejoindre (clé personnelle)
 *   DELETE /api/wedding-members?id=…          -> quitter (sa propre ligne)
 *
 * La règle : **rejoindre ne demande rien d’autre qu’une carte**. Pas de mot de
 * passe, pas d’invitation à valider — la clé personnelle dit qui vous êtes, le
 * mariage dit ce que vous y faites. Le rôle est une clé libre (`role_id`),
 * validée sur sa forme et non contre une liste : la taxonomie doit pouvoir
 * s’étendre sans déployer le serveur.
 */

const MEMBRES_MAX = 500;

function baseHeaders(res, methods) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', `${methods}, OPTIONS`);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-site-token, x-person-token');
}

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

/** Les personnes d’une liste de membres, en une requête. */
async function personnesDe(membres) {
  const ids = [...new Set(membres.map((m) => Number(m.person_id)).filter(Number.isFinite))];
  if (ids.length === 0) return new Map();
  const { data, error } = await supabase.from('people').select('*').in('id', ids);
  if (error) throw error;
  return new Map((data || []).map((p) => [Number(p.id), p]));
}

/** Sans mariage visé : les miens. C’est la clé personnelle qui les ouvre. */
async function mesMariages(res, viewer) {
  if (!viewer.personId) return res.status(400).json({ error: 'site_id ou slug requis' });

  const { data: membres, error } = await supabase
    .from('wedding_members')
    .select('*')
    .eq('person_id', viewer.personId)
    .order('joined_at', { ascending: true });
  if (error) throw error;

  const ids = [...new Set((membres || []).map((m) => Number(m.site_id)))];
  let sites = [];
  if (ids.length) {
    const { data, error: erreurSites } = await supabase
      .from('wedding_sites')
      .select('id, slug, partner1, partner2, wedding_date, city, venue, style, published')
      .in('id', ids);
    if (erreurSites) throw erreurSites;
    sites = data || [];
  }

  const memberships = (membres || []).map((m) => ({
    member: m,
    site: sites.find((s) => Number(s.id) === Number(m.site_id)) ?? null,
  }));

  return res.status(200).json({ memberships });
}

async function lire(req, res) {
  const { site_id: siteParam, slug } = req.query || {};
  const viewer = await viewerFor(req);
  if (!siteParam && !slug) return await mesMariages(res, viewer);

  const siteId = await resolveSiteId({ site_id: siteParam, slug });
  if (!siteId) return res.status(404).json({ error: 'Introuvable' });
  if (!(await canReadSite(req, viewer, siteId))) return res.status(404).json({ error: 'Introuvable' });

  const { data: membres, error } = await supabase
    .from('wedding_members')
    .select('*')
    .eq('site_id', siteId)
    .order('joined_at', { ascending: true })
    .limit(MEMBRES_MAX);
  if (error) throw error;

  const gens = await personnesDe(membres || []);
  const members = (membres || []).map((m) => redactMemberRow(m, gens.get(Number(m.person_id)), viewer, siteId));

  return res.status(200).json({
    members,
    count: members.length,
    moi: viewer.personId
      ? members.find((m) => Number(m.person_id) === Number(viewer.personId)) ?? null
      : null,
  });
}

async function rejoindre(req, res) {
  const personId = await ownerPersonId(req);
  if (!personId) return res.status(403).json({ error: 'Clé personnelle requise' });

  const payload = parseBody(req);
  const siteId = await resolveSiteId({ site_id: payload.site_id, slug: payload.slug });
  if (!siteId) return res.status(404).json({ error: 'Mariage introuvable' });
  if (!isValidRoleId(payload.role_id)) return res.status(400).json({ error: 'Rôle invalide' });

  const { data: existant, error: erreurLecture } = await supabase
    .from('wedding_members')
    .select('*')
    .eq('site_id', siteId)
    .eq('person_id', personId)
    .maybeSingle();
  if (erreurLecture) throw erreurLecture;

  if (existant) {
    // Rejoindre deux fois n’est pas une erreur : c’est la même place.
    if (existant.role_id !== payload.role_id) {
      const { data: maj, error: erreurMaj } = await supabase
        .from('wedding_members')
        .update({ role_id: payload.role_id, status: 'confirme' })
        .eq('id', existant.id)
        .select()
        .single();
      if (erreurMaj) throw erreurMaj;
      return res.status(200).json({ member: maj, deja: true });
    }
    return res.status(200).json({ member: existant, deja: true });
  }

  const { data: membre, error } = await supabase
    .from('wedding_members')
    .insert({ site_id: siteId, person_id: personId, role_id: payload.role_id, status: 'confirme' })
    .select()
    .single();
  if (error) throw error;

  const viewer = await viewerFor(req);
  const { data: person } = await supabase.from('people').select('*').eq('id', personId).maybeSingle();
  return res.status(201).json({ member: redactMemberRow(membre, person, viewer, siteId), deja: false });
}

async function quitter(req, res) {
  const personId = await ownerPersonId(req);
  if (!personId) return res.status(403).json({ error: 'Clé personnelle requise' });

  const id = Number((req.query || {}).id);
  if (!Number.isFinite(id) || id <= 0) return res.status(400).json({ error: 'id requis' });

  const { data: ligne, error: erreurLecture } = await supabase
    .from('wedding_members')
    .select('id, person_id')
    .eq('id', id)
    .maybeSingle();
  if (erreurLecture) throw erreurLecture;
  if (!ligne) return res.status(404).json({ error: 'Introuvable' });
  // On ne quitte que sa propre place.
  if (Number(ligne.person_id) !== Number(personId)) return res.status(403).json({ error: 'Accès refusé' });

  const { error } = await supabase.from('wedding_members').delete().eq('id', id);
  if (error) throw error;
  return res.status(200).json({ deleted: true });
}

export default async function handler(req, res) {
  baseHeaders(res, 'GET, POST, DELETE');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!['GET', 'POST', 'DELETE'].includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (req.method === 'POST') return await rejoindre(req, res);
    if (req.method === 'DELETE') return await quitter(req, res);
    return await lire(req, res);
  } catch (err) {
    return respondError(res, err, 'wedding-members');
  }
}
