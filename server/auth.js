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

/**
 * Clé personnelle.
 *
 * Elle suit exactement le modèle de la clé d’édition : un jeton aléatoire,
 * stocké haché dans `person_secrets`, envoyé dans l’en-tête `x-person-token`.
 * La différence est ce qu’elle désigne : non plus un site, mais **une
 * personne** — et donc sa carte, sa disponibilité, son rôle dans chaque
 * mariage qu’elle rejoint.
 *
 * Le clair n’est renvoyé qu’une fois, à la création (`POST /api/people`).
 * Sans fournisseur d’email dans le projet, la clé ne peut pas être renvoyée :
 * elle est donc saisissable à la main sur l’écran « Ma carte », ce qui est
 * aussi la façon de retrouver sa carte sur un autre appareil.
 */
export const PERSON_HEADER = 'x-person-token';

/** Jeton aléatoire, 192 bits, alphabet URL-safe. */
export function createToken() {
  return randomBytes(24).toString('base64url');
}

export function hashToken(token) {
  return createHash('sha256').update(String(token)).digest('hex');
}

function headerValue(req, name) {
  const headers = req.headers || {};
  const casse = name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('-');
  const value = headers[name] || headers[casse];
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function headerToken(req) {
  return headerValue(req, TOKEN_HEADER);
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

/**
 * Identifiant de la personne dont l’appelant possède la clé, ou `null`.
 * Même contrat que `ownerSiteId` : une requête, une lecture.
 */
export async function ownerPersonId(req) {
  const token = headerValue(req, PERSON_HEADER);
  if (!token) return null;
  try {
    const { data, error } = await supabase
      .from('person_secrets')
      .select('person_id')
      .eq('key_hash', hashToken(token))
      .maybeSingle();
    if (error || !data) return null;
    return Number(data.person_id);
  } catch (e) {
    console.error('ownerPersonId error:', e);
    return null;
  }
}

/**
 * Les mariages d’une personne, avec le rôle qu’elle y tient. C’est la seule
 * source des permissions de lecture : un invité voit les mariages où il est
 * membre, et rien d’autre.
 */
export async function membershipsOf(personId) {
  if (!personId) return [];
  try {
    const { data, error } = await supabase
      .from('wedding_members')
      .select('id, site_id, role_id')
      .eq('person_id', personId);
    if (error || !data) return [];
    return data.map((row) => ({ id: Number(row.id), site_id: Number(row.site_id), role_id: String(row.role_id || '') }));
  } catch (e) {
    console.error('membershipsOf error:', e);
    return [];
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
