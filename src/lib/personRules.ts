import type { ContactVisibility } from './weddingCard';

/**
 * QUI VOIT QUOI — le miroir
 *
 * Ces règles sont celles de `server/people.js`. Elles existent ici parce que
 * l'application fonctionne aussi sans base distante, avec la base du
 * navigateur (`localApi.ts`) : les deux chemins doivent dire exactement la même
 * chose, sinon l'écran ment une fois sur deux.
 *
 * Ce fichier n'est **pas** une sécurité : la vraie décision est prise côté
 * serveur, avant l'envoi. Ici, on ne fait que reproduire le résultat pour
 * l'affichage — masquer, ou écrire « coordonnées réservées ».
 */

export interface Membership {
  id?: number;
  site_id: number;
  role_id: string;
}

export interface Viewer {
  personId: number | null;
  memberships: Membership[];
}

export const CONTACT_LEVELS: ContactVisibility[] = ['maries', 'participants', 'carte'];

/** Les champs du verso qui ne sortent jamais publiquement. */
const PRIVE = ['iban', 'documents'] as const;

export interface PersonRow {
  id: number;
  first_name: string;
  last_name: string;
  photo: string;
  home_city: string;
  trade: string;
  bio: string;
  email: string;
  phone: string;
  website: string;
  social: string;
  contact_visibility: string;
  card?: Record<string, unknown>;
  redacted?: { contacts: boolean; prive: boolean };
}

function estSoiMeme(viewer: Viewer, person: PersonRow): boolean {
  return Boolean(viewer.personId) && Number(viewer.personId) === Number(person.id);
}

function appartenance(viewer: Viewer, siteId: number | null): Membership | null {
  if (!siteId) return null;
  return viewer.memberships.find((m) => Number(m.site_id) === Number(siteId)) ?? null;
}

export function canSeeContacts(viewer: Viewer, person: PersonRow, siteId: number | null): boolean {
  if (estSoiMeme(viewer, person)) return true;
  if (person.contact_visibility === 'carte') return true;

  const membre = appartenance(viewer, siteId);
  if (!membre) return false;
  if (person.contact_visibility === 'participants') return true;
  return membre.role_id === 'maries';
}

/** L'IBAN et les pièces : la personne, ou les mariés du mariage concerné. */
export function canSeePrivate(viewer: Viewer, person: PersonRow, siteId: number | null): boolean {
  if (estSoiMeme(viewer, person)) return true;
  const membre = appartenance(viewer, siteId);
  return Boolean(membre && membre.role_id === 'maries');
}

/** Les champs qu'un client a le droit d'écrire, et leurs limites. */
export const PERSON_FIELDS = [
  'first_name', 'last_name', 'photo', 'home_city', 'trade', 'bio',
  'email', 'phone', 'website', 'social', 'contact_visibility', 'card',
] as const;

const LIMITES: Record<string, number> = { bio: 400, photo: 400000 };
const LIMITE_TEXTE = 200;

/** Un rôle est une clé libre, mais propre : la taxonomie reste extensible. */
export function isValidRoleId(roleId: unknown): roleId is string {
  return typeof roleId === 'string' && /^[a-z0-9_]{1,40}$/.test(roleId);
}

export function cleanPersonPatch(payload: Record<string, unknown> = {}): Record<string, unknown> {
  const propre: Record<string, unknown> = {};
  for (const champ of PERSON_FIELDS) {
    if (!(champ in payload)) continue;
    const valeur = payload[champ];
    if (champ === 'card') {
      propre.card = valeur && typeof valeur === 'object' && !Array.isArray(valeur) ? valeur : {};
      continue;
    }
    if (champ === 'contact_visibility') {
      propre.contact_visibility = CONTACT_LEVELS.includes(valeur as ContactVisibility) ? valeur : 'participants';
      continue;
    }
    if (typeof valeur !== 'string') continue;
    propre[champ] = valeur.slice(0, LIMITES[champ] ?? LIMITE_TEXTE);
  }
  return propre;
}

export function redactPerson(person: PersonRow, viewer: Viewer, siteId: number | null = null): PersonRow {
  const contacts = canSeeContacts(viewer, person, siteId);
  const prive = canSeePrivate(viewer, person, siteId);

  const card = { ...(person.card ?? {}) };
  if (!prive) for (const cle of PRIVE) delete card[cle];

  return {
    ...person,
    email: contacts ? person.email : '',
    phone: contacts ? person.phone : '',
    website: contacts ? person.website : '',
    social: contacts ? person.social : '',
    card,
    redacted: { contacts: !contacts, prive: !prive },
  };
}
