import { apiGet } from './http';
import type { Person, WeddingSite } from './types';

/**
 * LA PAGE D'UNE PERSONNE
 *
 * La carte universelle — celle que le formulaire fabrique — ouvre une page :
 * une couverture (l'univers du mariage où la carte a été prise), le **timbre**
 * de la personne en guise de photo de profil, son rôle, ses mariages, et sa
 * carte en entier.
 *
 * L'adresse se lit et se partage : `/profil/12-clara-mez`. Le nombre suffit à
 * retrouver la personne ; les mots, à comprendre de qui l'on parle.
 */

/** Le morceau de site d'une personne : ce que la page a besoin de montrer. */
export interface MariageDeProfil {
  id: number;
  site_id: number;
  role_id: string;
  joined_at: string | null;
  site: Pick<
    WeddingSite,
    'id' | 'slug' | 'partner1' | 'partner2' | 'wedding_date' | 'venue' | 'city' | 'style'
  > | null;
}

/** La même réponse, vue de la page : la carte et ses mariages publiés. */
export interface Profil {
  person: Person;
  memberships: MariageDeProfil[];
}

/** Le nom d'une personne, tel qu'on l'écrit. */
export function nomDePersonne(person: Pick<Person, 'first_name' | 'last_name'>): string {
  return [person.first_name, person.last_name].filter(Boolean).join(' ').trim();
}

/** « Clara Mez » → « clara-mez », les accents en moins. */
export function morceauxDeNom(nom: string): string {
  return nom
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** L'adresse de la page d'une personne : son numéro, puis son nom. */
export function slugDePersonne(person: Pick<Person, 'id' | 'first_name' | 'last_name' | 'trade'>): string {
  const nom = morceauxDeNom(nomDePersonne(person)) || morceauxDeNom(person.trade || '') || 'carte';
  return `${person.id}-${nom}`;
}

/** Ce qu'une adresse contient : le numéro suffit, les mots aident à la lire. */
export function idDeProfil(slug: string): number | null {
  const trouve = /^(\d+)/.exec(slug.trim());
  if (!trouve) return null;
  const id = Number(trouve[1]);
  return Number.isFinite(id) && id > 0 ? id : null;
}

/** Charger une page de profil : la carte, et les mariages publiés où elle vit. */
export async function chargerProfil(id: number): Promise<Profil | null> {
  try {
    const res = await apiGet<{ person: Person; memberships?: MariageDeProfil[] }>(`/api/people?id=${id}`);
    if (!res?.person) return null;
    return { person: res.person, memberships: res.memberships ?? [] };
  } catch {
    return null;
  }
}
