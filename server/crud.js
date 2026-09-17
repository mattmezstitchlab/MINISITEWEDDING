import supabase from './db-client.js';
import { ownerSiteId, isPublished, rowSiteId, unauthorized } from './auth.js';

/**
 * Fabrique de handlers CRUD.
 *
 * Les tables enfants du projet partagent exactement la même forme d’API :
 *   GET    ?site_id=…            -> liste triée
 *   POST   body { site_id, … }   -> création
 *   PUT    body { id, …patch }   -> mise à jour
 *   DELETE body { id }           -> suppression
 *
 * Chaque endpoint déclare sa table, ses particularités de tri/filtres et son
 * niveau d’autorisation. `api/wedding-sites.js` est le seul écrit à la main :
 * la résolution par slug et la règle « publié ou propriétaire » sur le site
 * lui-même ne rentrent pas dans ce moule.
 *
 * @param {object} options
 * @param {string} options.table       Table Supabase ciblée.
 * @param {string} [options.label]     Nom utilisé dans les logs d’erreur.
 * @param {string} [options.order]     Colonne de tri (défaut : `position`).
 * @param {'asc'|'desc'} [options.direction] Sens du tri (défaut : `asc`).
 * @param {number} [options.limit]     Nombre maximal de lignes retournées.
 * @param {string[]} [options.filters] Paramètres de querystring filtrant avec `eq()`.
 * @param {Array<'GET'|'POST'|'PUT'|'DELETE'>} [options.methods] Verbes autorisés.
 * @param {'public'|'published-or-owner'|'owner'} [options.read]
 *        `public` : ouvert. `published-or-owner` : site publié ou clé d’édition.
 *        `owner` : clé d’édition du site uniquement (données personnelles).
 * @param {'public'|'owner'|'any-owner'|Record<string,string>} [options.write]
 *        `owner` : clé du site concerné. `any-owner` : une clé valide suffit
 *        (ressources partagées, sans `site_id`).
 * @returns {(req: any, res: any) => Promise<any>} Handler serverless.
 */
export function crud(options) {
  const {
    table,
    label = table,
    order = 'position',
    direction = 'asc',
    limit,
    filters = ['site_id'],
    methods = ['GET', 'POST', 'PUT', 'DELETE'],
    read = 'public',
    write = 'public',
  } = options;

  const writeMode = (method) => (typeof write === 'string' ? write : write[method] || 'owner');

  /** Autorise une lecture de liste. Retourne une réponse d’erreur, ou null. */
  async function authorizeRead(req, res, siteId) {
    if (read === 'public') return null;
    if (!siteId) return res.status(400).json({ error: 'site_id requis' });
    const owner = await ownerSiteId(req);
    if (owner === siteId) return null;
    if (read === 'published-or-owner' && (await isPublished(siteId))) return null;
    return unauthorized(res, owner ? 'Clé d’édition d’un autre site' : 'Clé d’édition requise');
  }

  /** Autorise une écriture. `rowId` est renseigné pour PUT/DELETE. */
  async function authorizeWrite(req, res, method, rowId) {
    const mode = writeMode(method);
    if (mode === 'public') return null;
    const owner = await ownerSiteId(req);
    if (!owner) return unauthorized(res, 'Clé d’édition requise');
    if (mode === 'any-owner') return null;
    const siteId = rowId ? await rowSiteId(table, rowId) : Number(req.body?.site_id) || null;
    if (!siteId) return res.status(rowId ? 404 : 400).json({ error: rowId ? 'Ligne introuvable' : 'site_id requis' });
    if (siteId !== owner) return unauthorized(res, 'Clé d’édition d’un autre site');
    return null;
  }

  return async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', [...methods, 'OPTIONS'].join(', '));
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-site-token');
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (!methods.includes(req.method)) return res.status(405).json({ error: 'Method not allowed' });

    try {
      const query = req.query || {};

      if (req.method === 'GET') {
        const siteId = Number(query.site_id) || null;
        const denied = await authorizeRead(req, res, siteId);
        if (denied) return denied;

        let q = supabase.from(table).select('*');
        for (const filter of filters) {
          if (query[filter]) q = q.eq(filter, query[filter]);
        }
        q = q.order(order, { ascending: direction !== 'desc' });
        if (limit) q = q.limit(limit);
        const { data, error } = await q;
        if (error) throw error;
        return res.status(200).json(data);
      }

      if (req.method === 'POST') {
        const denied = await authorizeWrite(req, res, 'POST', null);
        if (denied) return denied;
        const { data, error } = await supabase.from(table).insert(req.body).select().single();
        if (error) throw error;
        return res.status(201).json(data);
      }

      if (req.method === 'PUT') {
        const { id, ...patch } = req.body || {};
        if (!id) return res.status(400).json({ error: 'id requis' });
        const denied = await authorizeWrite(req, res, 'PUT', id);
        if (denied) return denied;
        const { data, error } = await supabase.from(table).update(patch).eq('id', id).select().single();
        if (error) throw error;
        return res.status(200).json(data);
      }

      // DELETE
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id requis' });
      const denied = await authorizeWrite(req, res, 'DELETE', id);
      if (denied) return denied;
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error(`API ${label} error:`, err);
      return res.status(500).json({ error: err.message });
    }
  };
}
