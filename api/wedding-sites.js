import supabase from '../server/db-client.js';
import { ownerSiteId, unauthorized } from '../server/auth.js';
import { respondError } from '../server/errors.js';

/**
 * Le site lui-même. Écrit à la main plutôt qu’avec la fabrique `crud()` :
 * la résolution par slug et la règle « publié pour tous, brouillon pour le
 * propriétaire seul » ne s’expriment pas dans le moule des tables enfants.
 *
 * Pas de POST ici : la création passe par `api/create-site.js`, qui génère la
 * clé d’édition dans le même mouvement.
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-site-token, x-person-token');
  if (req.method === 'OPTIONS') return res.status(204).end();
  // POST volontairement absent : la création passe par `api/create-site.js`.
  if (!['GET', 'PUT', 'DELETE'].includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const owner = await ownerSiteId(req);

    if (req.method === 'GET') {
      const { slug, id } = req.query || {};
      if (!slug && !id) return res.status(400).json({ error: 'slug ou id requis' });

      // Par identifiant : l’éditeur, réservé au propriétaire.
      if (id) {
        if (owner !== Number(id)) return unauthorized(res, 'Clé d’édition requise');
        const { data, error } = await supabase.from('wedding_sites').select('*').eq('id', id).maybeSingle();
        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Introuvable' });
        return res.status(200).json(data);
      }

      // Par slug : le site public. Un brouillon reste invisible, sauf pour son propriétaire.
      const { data, error } = await supabase.from('wedding_sites').select('*').eq('slug', slug).maybeSingle();
      if (error) throw error;
      if (!data || (!data.published && owner !== Number(data.id))) {
        return res.status(404).json({ error: 'Introuvable' });
      }
      return res.status(200).json(data);
    }

    const body = parseBody(req);
    const { id, ...patch } = body || {};
    if (!id) return res.status(400).json({ error: 'id requis' });
    if (owner !== Number(id)) return unauthorized(res, 'Clé d’édition requise');

    if (req.method === 'PUT') {
      const { data, error } = await supabase.from('wedding_sites').update(patch).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { error } = await supabase.from('wedding_sites').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
  } catch (err) {
    return respondError(res, err, 'wedding-sites');
  }
}
