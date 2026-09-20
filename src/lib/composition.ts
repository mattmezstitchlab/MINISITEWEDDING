import { PAGES_EDITION, RUBRIQUES, composerEdition, type Edition } from './aimeMoteur';
import { semaineDeLAnnee } from './jeuDeCartes';
import { couvertureDuJour, type CouvertureJour } from './couvertureDuJour';
import { ficheDuJour, type FicheDeLAnnee } from './fichesAnnee';
import { decoderPersonnes, type PersonneComposee, type ReponseDuMagazine } from './composerPersonnes';

/**
 * LE MAGAZINE COMPOSÉ — CE QUI SORT DU COMPOSEUR DE L'ACCUEIL
 *
 * Des personnes, une date, un rôle — et **le magazine se compose** : le numéro de
 * la semaine, sa carte, sa saison, sa couverture, la fiche du jour, et **ses
 * vingt-quatre pages**, une par heure, les huit rubriques qui font trois fois le
 * tour de la journée. Le moteur fait le travail ; ici on l'assemble.
 *
 * Trois règles, les mêmes que partout :
 *
 * 1. **Rien n'est inventé.** Sans date, c'est aujourd'hui ; sans personne, c'est
 *    le magazine du jour. On ne déduit jamais un prénom, ni un métier, ni une
 *    histoire — et le rôle ne se choisit que dans le menu, pas dans un prénom.
 * 2. **On ne garde que la réponse.** Ce qu'on écrit dans la mémoire du site, ce
 *    sont les personnes, la date et le rôle — jamais le magazine calculé : il se
 *    recompose à l'identique à la lecture, et il ne peut donc pas vieillir.
 * 3. **Le nombre de pages ne bouge pas** : `PAGES_EDITION` = 24, et les rubriques
 *    ne changent ni de nom ni d'ordre.
 */

export interface MagazineCompose {
  /** Les personnes données, dans l'ordre où elles ont été écrites. */
  personnes: PersonneComposee[];
  /** Les deux premiers prénoms — ce qui s'écrit sur la couverture. */
  prenoms: [string, string];
  /** `AAAA-MM-JJ` de la date du mariage, ou ''. */
  date: string;
  dateDonnee: boolean;
  /** Le rôle choisi dans le menu (une carte du hero), ou ''. */
  roleId: string;
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

/** Le magazine d'une réponse — des personnes, une date, un rôle. */
export function composerLeMagazine(reponse: ReponseDuMagazine): MagazineCompose {
  const personnes = reponse.personnes;
  const date = reponse.date ?? '';
  const roleId = reponse.roleId ?? '';
  const jour = jourDuMagazine(date);
  return {
    personnes,
    prenoms: [personnes[0]?.prenom ?? '', personnes[1]?.prenom ?? ''],
    date,
    dateDonnee: date.trim().length > 0,
    roleId,
    edition: composerEdition({
      numero: semaineDeLAnnee(jour),
      annee: jour.getFullYear(),
      ...(roleId ? { roleId } : {}),
    }),
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
    m2.setItem(
      CLE_DU_MAGAZINE,
      JSON.stringify({
        personnes: m.personnes.map((p) => ({
          prenom: p.prenom,
          naissance: p.naissance,
          ville: p.ville,
          genre: p.genre,
        })),
        date: m.date,
        roleId: m.roleId,
      }),
    );
  } catch {
    /* mémoire pleine : le magazine reste à l'écran, il ne se retient pas */
  }
}

/** La réponse déjà donnée sur cet appareil, s'il y en a une. */
export function reponseEnregistree(): ReponseDuMagazine | null {
  const m2 = memoire();
  if (!m2) return null;
  try {
    const brut = m2.getItem(CLE_DU_MAGAZINE);
    if (!brut) return null;
    const garde = JSON.parse(brut) as {
      personnes?: unknown;
      date?: unknown;
      roleId?: unknown;
    };
    const personnes = Array.isArray(garde.personnes)
      ? decoderPersonnes(
          garde.personnes
            .map((p) => {
              const q = (p ?? {}) as { prenom?: unknown; naissance?: unknown; ville?: unknown; genre?: unknown };
              return [q.prenom, q.naissance, q.ville, q.genre]
                .map((v) => (typeof v === 'string' ? v : ''))
                .join(',');
            })
            .join(';'),
        )
      : [];
    return {
      personnes,
      date: typeof garde.date === 'string' ? garde.date : '',
      roleId: typeof garde.roleId === 'string' ? garde.roleId : '',
    };
  } catch {
    return null;
  }
}

/** Le magazine déjà composé sur cet appareil, s'il y en a un. */
export function magazineCompose(): MagazineCompose | null {
  const reponse = reponseEnregistree();
  return reponse ? composerLeMagazine(reponse) : null;
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
