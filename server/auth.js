import { createHash, randomBytes } from 'node:crypto';
import supabase from './db-client.js';

/**
 * Clés d’édition.
 *
 * Chaque site possède un jeton aléatoire, stocké **haché** (SHA-256) dans
 * `site_secrets`. Le clair n’est renvoyé qu’une seule fois, à la création
 * (`api/create-site.js`), puis conservé par le navigateur dans localStorage.
 *
 * Pourquoi ce modèle plutôt qu’un compte utilisateur : le projet n’a ni
 * fournisseur d’email ni OAuth configuré. Un mariage = deux personnes, un
 * jeton partagé suffit, et il ferme les deux trous réels (édition de n’importe
 * quel site par son id, lecture des réponses RSVP de tous les sites).
 *
 * Le client envoie le jeton dans l’en-tête `x-site-token`.
 */

export const TOKEN_HEADER = 'x-site-token';

/** Jeton aléatoire, 192 bits, alphabet URL-safe. */
export function createToken() {
  return randomBytes(24).toString('base64url');
}

export function hashToken(token) {
  return createHash('sha256').update(String(token)).digest('hex');
}

function headerToken(req) {
  const headers = req.headers || {};
  const value = headers[TOKEN_HEADER] || headers['X-Site-Token'];
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

/**
 * Identifiant du site dont l’appelant possède la clé, ou `null`.
 * Une requête = une lecture en base ; acceptable au volume d’un site de mariage.
 */
export async function ownerSiteId(req) {
  const token = headerToken(req);
  if (!token) return null;
  try {
    const { data, error } = await supabase
      .from('site_secrets')
      .select('site_id')
      .eq('edit_token', hashToken(token))
      .maybeSingle();
    if (error || !data) return null;
    return Number(data.site_id);
  } catch (e) {
    console.error('ownerSiteId error:', e);
    return null;
  }
}

export async function isPublished(siteId) {
  if (!siteId) return false;
  try {
    const { data, error } = await supabase
      .from('wedding_sites')
      .select('published')
      .eq('id', siteId)
      .maybeSingle();
    return Boolean(!error && data && data.published);
  } catch (e) {
    console.error('isPublished error:', e);
    return false;
  }
}

/** `site_id` d’une ligne, pour autoriser une mise à jour ou une suppression. */
export async function rowSiteId(table, rowId) {
  if (!rowId) return null;
  try {
    const { data, error } = await supabase.from(table).select('site_id').eq('id', rowId).maybeSingle();
    if (error || !data) return null;
    return Number(data.site_id);
  } catch (e) {
    console.error('rowSiteId error:', e);
    return null;
  }
}

export function unauthorized(res, message = 'Accès refusé') {
  return res.status(403).json({ error: message });
}
