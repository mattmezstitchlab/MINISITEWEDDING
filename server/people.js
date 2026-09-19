import supabase from './db-client.js';
import { isPublished, membershipsOf, ownerPersonId, ownerSiteId } from './auth.js';

/**
 * LES RÈGLES DE LA CARTE
 *
 * Ce fichier porte les seules décisions qui comptent : **qui voit quoi**.
 * Elles s'appliquent côté serveur, au moment de la réponse — jamais dans le
 * navigateur, où cacher un bouton n'a jamais empêché personne de lire une
 * donnée. Le miroir navigateur existe dans `src/lib/personRules.ts` : les deux
 * doivent dire exactement la même chose.
 *
 * Trois niveaux de visibilité pour les coordonnées (`contact_visibility`) :
 *   `maries`       — les mariés du mariage où la carte est lue.
 *   `participants` — n'importe quel membre de ce mariage.
 *   `carte`        — quiconque voit la carte.
 *
 * Deux informations sont **toujours** restreintes : l'IBAN et les pièces
 * (devis, contrat, facture, assurance). Elles ne sortent que pour la personne
 * elle-même, ou pour les mariés du mariage concerné.
 */

/** Colonnes qu'un client a le droit d'écrire. Rien d'autre n'est accepté. */
export const PERSON_FIELDS = [
  'first_name',
  'last_name',
  'photo',
  'home_city',
  'trade',
  'bio',
  'email',
  'phone',
  'website',
  'social',
  'contact_visibility',
  'card',
];

export const CONTACT_LEVELS = ['maries', 'participants', 'carte'];

/** Les champs du verso qui ne sortent jamais publiquement. */
export const PRIVATE_CARD_KEYS = ['iban', 'documents'];

/** Un rôle est une clé libre, mais propre : la taxonomie reste extensible. */
export function isValidRoleId(roleId) {
  return typeof roleId === 'string' && /^[a-z0-9_]{1,40}$/.test(roleId);
}

const LIMITES = { texte: 200, bio: 400, photo: 400000 };

/**
 * Nettoie ce qu'un client envoie. On ne devine rien, on ne complète rien :
 * les champs inconnus sont ignorés, les chaînes trop longues sont coupées.
 */
export function cleanPersonPatch(payload = {}) {
  const propre = {};
  for (const champ of PERSON_FIELDS) {
    if (!(champ in payload)) continue;
    const valeur = payload[champ];
    if (champ === 'card') {
      propre.card = valeur && typeof valeur === 'object' && !Array.isArray(valeur) ? valeur : {};
      continue;
    }
    if (champ === 'contact_visibility') {
      propre.contact_visibility = CONTACT_LEVELS.includes(valeur) ? valeur : 'participants';
      continue;
    }
    if (typeof valeur !== 'string') continue;
    const max = champ === 'bio' ? LIMITES.bio : champ === 'photo' ? LIMITES.photo : LIMITES.texte;
    propre[champ] = valeur.slice(0, max);
  }
  return propre;
}

/** Le mariage visé par une requête : par identifiant, ou par slug public. */
export async function resolveSiteId({ site_id, slug } = {}) {
  if (site_id) {
    const n = Number(site_id);
    return Number.isFinite(n) && n > 0 ? n : null;
  }
  if (!slug) return null;
  const { data, error } = await supabase.from('wedding_sites').select('id').eq('slug', String(slug)).maybeSingle();
  if (error || !data) return null;
  return Number(data.id);
}

/**
 * Peut-on lire ce mariage ? Un mariage publié est ouvert ; un brouillon ne
 * l’est que pour ses mariés (clé d’édition) et pour les personnes qui l’ont
 * déjà rejoint. Sinon : introuvable — on ne confirme pas l’existence d’un
 * brouillon à un inconnu.
 */
export async function canReadSite(req, viewer, siteId) {
  if (!siteId) return false;
  if (await isPublished(siteId)) return true;
  if (viewer.personId && viewer.memberships.some((m) => Number(m.site_id) === Number(siteId))) return true;
  try {
    return (await ownerSiteId(req)) === Number(siteId);
  } catch {
    return false;
  }
}

/** Qui lit : l’appelant et ses mariages. Une requête, une vérité. */
export async function viewerFor(req) {
  const personId = await ownerPersonId(req);
  const memberships = await membershipsOf(personId);
  return { personId, memberships };
}

function estSoiMeme(viewer, person) {
  return Boolean(viewer.personId) && Number(viewer.personId) === Number(person.id);
}

function appartenance(viewer, siteId) {
  if (!siteId) return null;
  return viewer.memberships.find((m) => Number(m.site_id) === Number(siteId)) ?? null;
}

export function canSeeContacts(viewer, person, siteId) {
  if (estSoiMeme(viewer, person)) return true;
  if (person.contact_visibility === 'carte') return true;

  const membre = appartenance(viewer, siteId);
  if (!membre) return false;
  if (person.contact_visibility === 'participants') return true;
  return membre.role_id === 'maries';
}

/** L’IBAN et les pièces : la personne, ou les mariés du mariage concerné. */
export function canSeePrivate(viewer, person, siteId) {
  if (estSoiMeme(viewer, person)) return true;
  const membre = appartenance(viewer, siteId);
  return Boolean(membre && membre.role_id === 'maries');
}

/**
 * La carte telle qu’elle sort du serveur. Les champs masqués ne sont pas
 * remplacés par un faux contenu : ils sont vides, et `redacted` dit pourquoi —
 * c’est ce qui permet à l’écran d’écrire « coordonnées réservées aux mariés »
 * sans jamais avoir reçu la donnée.
 */
export function redactPerson(person, viewer, siteId = null) {
  const contacts = canSeeContacts(viewer, person, siteId);
  const prive = canSeePrivate(viewer, person, siteId);

  const card = { ...(person.card && typeof person.card === 'object' ? person.card : {}) };
  if (!prive) for (const cle of PRIVATE_CARD_KEYS) delete card[cle];

  return {
    id: Number(person.id),
    first_name: person.first_name || '',
    last_name: person.last_name || '',
    photo: person.photo || '',
    home_city: person.home_city || '',
    trade: person.trade || '',
    bio: person.bio || '',
    email: contacts ? person.email || '' : '',
    phone: contacts ? person.phone || '' : '',
    website: contacts ? person.website || '' : '',
    social: contacts ? person.social || '' : '',
    contact_visibility: CONTACT_LEVELS.includes(person.contact_visibility)
      ? person.contact_visibility
      : 'participants',
    card,
    redacted: { contacts: !contacts, prive: !prive },
  };
}

/** La carte de quelqu’un d’autre, telle qu’elle apparaît dans un mariage. */
export function redactMemberRow(member, person, viewer, siteId) {
  return {
    id: Number(member.id),
    site_id: Number(member.site_id),
    person_id: Number(member.person_id),
    role_id: member.role_id || '',
    status: member.status || 'confirme',
    joined_at: member.joined_at || null,
    person: person ? redactPerson(person, viewer, siteId ?? member.site_id) : null,
  };
}
