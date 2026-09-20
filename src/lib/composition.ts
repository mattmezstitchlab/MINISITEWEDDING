import { PAGES_EDITION, RUBRIQUES, composerEdition, type Edition } from './aimeMoteur';
import { semaineDeLAnnee } from './jeuDeCartes';
import { couvertureDuJour, type CouvertureJour } from './couvertureDuJour';
import { ficheDuJour, type FicheDeLAnnee } from './fichesAnnee';

/**
 * LE MAGAZINE COMPOSÉ — CE QUI SORT DU CHAMP DE L'ACCUEIL
 *
 * Deux prénoms et une date, et **le magazine se compose** : le numéro de la
 * semaine, sa carte, sa saison, sa couverture, la fiche du jour — et **ses
 * vingt-quatre pages**, une par heure, les huit rubriques qui font trois fois le
 * tour de la journée (le moteur fait le travail, ici on ne fait que l'assembler).
 *
 * Trois règles, les mêmes que partout :
 *
 * 1. **Rien n'est inventé.** Sans date, c'est aujourd'hui ; sans prénoms, c'est
 *    le magazine du jour. On ne déduit jamais un prénom, ni un métier, ni une
 *    histoire d'un nom.
 * 2. **On ne garde que la réponse.** Ce qu'on écrit dans la mémoire du site,
 *    c'est ce que la personne a donné — jamais le magazine calculé : il se
 *    recompose à l'identique à la lecture, et il ne peut donc pas vieillir.
 * 3. **Le nombre de pages ne bouge pas** : `PAGES_EDITION` = 24, et les rubriques
 *    ne changent ni de nom ni d'ordre.
 */

export interface MagazineCompose {
  /** Les deux prénoms donnés — vides si l'on n'a rien répondu. */
  prenoms: [string, string];
  /** `AAAA-MM-JJ`, ou '' quand la date n'a pas été donnée. */
  date: string;
  dateDonnee: boolean;
  /** Le numéro de la semaine, ses pages composées. */
  edition: Edition;
  /** La couverture du jour : la même que le kiosque des 365. */
  couverture: CouvertureJour;
  /** La fiche du jour : la fête, le personnage, le sens du prénom. */
  fiche: FicheDeLAnnee;
}

export const CLE_DU_MAGAZINE = 'aime.magazine.compose';

/** La mémoire du navigateur, sans jamais faire tomber la page (mode privé). */
function memoire(): Storage | null {
  try {
    return (globalThis as { localStorage?: Storage }).localStorage ?? null;
  } catch {
    return null;
  }
}

/** `2027-06-12` → le 12 juin 2027 **à midi local** (jamais décalé d'un jour). */
export function jourDuMagazine(date: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
  if (!m) return new Date();
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12);
}

/** Le magazine de deux prénoms et d'une date — la composition entière. */
export function composerLeMagazine(prenoms: [string, string], date = ''): MagazineCompose {
  const jour = jourDuMagazine(date);
  return {
    prenoms,
    date: date.trim(),
    dateDonnee: date.trim().length > 0,
    edition: composerEdition({ numero: semaineDeLAnnee(jour), annee: jour.getFullYear() }),
    couverture: couvertureDuJour(jour),
    fiche: ficheDuJour(jour),
  };
}

/** Ce qu'on lit sous la couverture : « Paul & Emma · 12 juin 2027 ». */
export function phraseDuMagazine(m: MagazineCompose): string {
  const noms = [m.prenoms[0], m.prenoms[1]].filter((n) => n.length > 0).join(' & ');
  if (noms && m.dateDonnee) return `${noms} · ${m.fiche.dateLongue}`;
  if (noms) return `${noms} · le magazine du jour`;
  return `Le magazine du ${m.fiche.dateLongue}`;
}

/** On n'écrit que la réponse : le magazine, lui, se recompose. */
export function enregistrerMagazine(m: MagazineCompose): void {
  const m2 = memoire();
  if (!m2) return;
  try {
    m2.setItem(CLE_DU_MAGAZINE, JSON.stringify({ prenoms: m.prenoms, date: m.date }));
  } catch {
    /* mémoire pleine : le magazine reste à l'écran, il ne se retient pas */
  }
}

/** Le magazine déjà composé sur cet appareil, s'il y en a un. */
export function magazineCompose(): MagazineCompose | null {
  const m2 = memoire();
  if (!m2) return null;
  try {
    const brut = m2.getItem(CLE_DU_MAGAZINE);
    if (!brut) return null;
    const garde = JSON.parse(brut) as { prenoms?: unknown; date?: unknown };
    const prenoms = Array.isArray(garde.prenoms) ? garde.prenoms : [];
    const date = typeof garde.date === 'string' ? garde.date : '';
    return composerLeMagazine(
      [typeof prenoms[0] === 'string' ? prenoms[0] : '', typeof prenoms[1] === 'string' ? prenoms[1] : ''],
      date,
    );
  } catch {
    return null;
  }
}

export function effacerMagazine(): void {
  const m2 = memoire();
  if (!m2) return;
  try {
    m2.removeItem(CLE_DU_MAGAZINE);
  } catch {
    /* rien à effacer */
  }
}

/** Les huit rubriques, pour la composition à l'écran : elles ne bougent pas. */
export { RUBRIQUES, PAGES_EDITION };
