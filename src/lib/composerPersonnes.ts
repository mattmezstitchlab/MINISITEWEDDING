import { ficheDuJour } from './fichesAnnee';
import { genreDuPrenom, type GenrePrenom } from './genreDesPrenoms';

/**
 * LE COMPOSEUR — DES PERSONNES, PUIS CE QUI DEVIENT POSSIBLE
 *
 * Le champ de l'accueil ne demande pas « vos prénoms » d'un bloc : il se remplit
 * **personne par personne**. Une personne, c'est trois choses et pas une de plus —
 * **son prénom, sa date de naissance, sa ville de naissance** — et le **+** ne
 * s'allume qu'une fois les trois écrites.
 *
 * Mais **le prénom dit déjà quelque chose** : son **genre** (le calendrier des 365
 * d'abord, les prénoms courants ensuite, et **on demande** quand les deux se
 * taisent ou quand le prénom se porte des deux façons), et **le jour de l'année
 * qui le porte**. La date de naissance dit **l'âge**, et le jour où l'on est né —
 * donc **le magazine de ce jour-là**. La ville dit **d'où l'on vient**.
 *
 * Et c'est **après** avoir rempli que la liste des possibles se resserre : à une
 * personne on peut être **invité**, **témoin**, **prestataire**, **l'un des
 * mariés**, **venu avec ses parents** ; **à deux, « Nous sommes des futurs
 * mariés »** ; à trois, **un groupe** ou la famille. Un rôle ne se déduit **jamais**
 * d'un prénom : il se choisit, ou il reste vide.
 */

export interface PersonneComposee {
  /** Un identifiant local, pour pouvoir retirer une personne de la liste. */
  id: string;
  prenom: string;
  /** La date de naissance, `AAAA-MM-JJ`, ou ''. */
  naissance: string;
  ville: string;
  /** Le genre, lu au prénom ou dit par la personne — vide quand on ne sait pas. */
  genre: GenrePrenom | '';
}

/** Ce que le magazine peut retenir d'une réponse — jamais plus. */
export interface ReponseDuMagazine {
  personnes: PersonneComposee[];
  /** La date du mariage, ou ''. */
  date: string;
  /** Le rôle choisi dans le menu (une carte du hero), ou ''. */
  roleId: string;
}

export interface Proposition {
  id: string;
  /** Le titre, au masculin — la forme par défaut. */
  titre: string;
  /** Le titre au féminin, quand il change. */
  feminin?: string;
  /** Ce que ça ouvre, en une ligne — on dit toujours pourquoi. */
  explication: string;
  /** À partir de combien de personnes on peut le choisir. */
  des: number;
  /** Jusqu'à quel âge, quand la proposition est réservée aux plus jeunes. */
  ageMax?: number;
  /** Le rôle que ça donne au magazine (une carte du hero). */
  roleId?: string;
  /** Le rôle au féminin, quand il y en a un. */
  roleFeminin?: string;
  /** Vrai pour les informations essentielles, qui ne sont pas des rôles. */
  essentielle?: boolean;
}

/**
 * **CE QUI DEVIENT POSSIBLE.** La liste se met à jour toute seule avec ce qu'on
 * sait : le nombre de personnes, leur âge, leur genre. On ne montre jamais une
 * proposition qu'on ne peut pas prendre — et une proposition encore fermée **dit
 * à partir de quand elle s'ouvre**, ou **jusqu'à quel âge elle tient**.
 */
export const PROPOSITIONS: Proposition[] = [
  {
    id: 'date-du-mariage',
    titre: 'La date du mariage',
    explication: 'Sans elle, le magazine se compose au jour d’aujourd’hui.',
    des: 1,
    essentielle: true,
  },
  {
    id: 'lieu',
    titre: 'Le lieu',
    explication: 'Là où tout se passe : le château, la mairie, le jardin.',
    des: 1,
    essentielle: true,
  },
  {
    id: 'invite',
    titre: 'Je suis invité',
    feminin: 'Je suis invitée',
    explication: 'Une place, un programme, et ce qui vous concerne.',
    des: 1,
    roleId: 'invites',
  },
  {
    id: 'temoin',
    titre: 'Je suis témoin',
    explication: 'Un rôle, une place, et ce que vous avez à faire.',
    des: 1,
    roleId: 'temoin',
  },
  {
    id: 'marie',
    titre: 'Je suis l’un des mariés',
    feminin: 'Je suis l’une des mariées',
    explication: 'La journée est la vôtre : elle se lit heure par heure.',
    des: 1,
    roleId: 'marie',
    roleFeminin: 'mariee',
  },
  {
    id: 'prestataire',
    titre: 'Je suis prestataire',
    explication: 'Votre métier, vos moments, votre page.',
    des: 1,
  },
  {
    id: 'enfant',
    titre: 'Je viens avec mes parents',
    explication: 'On est là par eux — et on a sa place dans la journée.',
    des: 1,
    ageMax: 17,
    roleId: 'famille',
  },
  {
    id: 'futurs-maries',
    titre: 'Nous sommes des futurs mariés',
    explication: 'Deux personnes, un mariage à venir : le magazine se compose à deux.',
    des: 2,
    roleId: 'futurs_maries',
  },
  {
    id: 'deja-maries',
    titre: 'Nous sommes déjà mariés',
    explication: 'Deux personnes, un mariage passé : la même semaine, relue.',
    des: 2,
    roleId: 'maries',
  },
  {
    id: 'groupe',
    titre: 'Nous sommes un groupe',
    explication: 'Des amis, des collègues : une même table, une même page.',
    des: 3,
    roleId: 'invites',
  },
  {
    id: 'famille',
    titre: 'Nous venons en famille',
    explication: 'Plusieurs personnes, le même nom, la même journée.',
    des: 3,
    roleId: 'famille',
  },
];

/** Ce qu'on peut choisir avec ce qu'on sait — dans l'ordre. */
export function propositionsPossibles(nombre: number, age: number | null = null): Proposition[] {
  return PROPOSITIONS.filter((p) => nombre >= p.des && (p.ageMax === undefined || (age !== null && age <= p.ageMax)));
}

/** Ce qui reste fermé — parce qu'il manque des personnes, ou des années. */
export function propositionsFermees(nombre: number, age: number | null = null): Proposition[] {
  return PROPOSITIONS.filter((p) => !(nombre >= p.des && (p.ageMax === undefined || (age !== null && age <= p.ageMax))));
}

const MOTS_DU_NOMBRE = ['', 'une personne', 'deux personnes', 'trois personnes', 'quatre personnes'];

/** « à partir de deux personnes » — la condition d'une ligne grisée. */
export function motDeLaCondition(proposition: Proposition): string {
  return `à partir de ${MOTS_DU_NOMBRE[proposition.des] ?? `${proposition.des} personnes`}`;
}

/** **Pourquoi c'est fermé** : le nombre, ou l'âge — jamais autre chose. */
export function raisonDeLaFermeture(proposition: Proposition, nombre: number): string {
  if (nombre < proposition.des) return motDeLaCondition(proposition);
  if (proposition.ageMax !== undefined) return `jusqu’à ${proposition.ageMax} ans`;
  return '';
}

/** Le titre dans la langue de la personne : « Je suis invitée ». */
export function titreDeLaProposition(proposition: Proposition, genre: GenrePrenom | '' = ''): string {
  return genre === 'feminin' && proposition.feminin ? proposition.feminin : proposition.titre;
}

/** Le rôle que la proposition donne au magazine, au genre de la personne. */
export function roleDeLaProposition(proposition: Proposition, genre: GenrePrenom | '' = ''): string {
  if (genre === 'feminin' && proposition.roleFeminin) return proposition.roleFeminin;
  return proposition.roleId ?? '';
}

/* ——————————————————————— CE QU'UNE PERSONNE DONNE ——————————————————————— */

/** Les trois informations d'une personne : sans les trois, le + reste éteint. */
export function personneComplete(p: Pick<PersonneComposee, 'prenom' | 'naissance' | 'ville'>): boolean {
  return p.prenom.trim().length > 0 && lireDate(p.naissance) !== null && p.ville.trim().length > 0;
}

/** `AAAA-MM-JJ` → une vraie date (midi local), ou `null`. */
export function lireDate(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec((iso ?? '').trim());
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** « 12.06.1990 » — la date de naissance, écrite court. */
export function dateCourte(iso: string): string {
  const d = lireDate(iso);
  if (!d) return '';
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
}

/**
 * **L'âge**, au jour près : on ne dit pas « né en 1990 », on dit l'âge qu'on a
 * aujourd'hui — l'anniversaire passé ou non. C'est la seule chose que la date de
 * naissance ajoute, et elle est exacte.
 */
export function ageDePersonne(p: Pick<PersonneComposee, 'naissance'>, aujourdHui: Date = new Date()): number | null {
  const d = lireDate(p.naissance);
  if (!d) return null;
  let age = aujourdHui.getFullYear() - d.getFullYear();
  const mois = aujourdHui.getMonth() - d.getMonth();
  if (mois < 0 || (mois === 0 && aujourdHui.getDate() < d.getDate())) age -= 1;
  return age >= 0 && age < 130 ? age : null;
}

/** « 34 ans », ou rien. */
export function ageEcrit(p: Pick<PersonneComposee, 'naissance'>, aujourdHui: Date = new Date()): string {
  const age = ageDePersonne(p, aujourdHui);
  return age === null ? '' : `${age} ans`;
}

/** « Paul, né(e) le 12.06.1990 à Provins » — et son âge quand on le connaît. */
export function phraseDePersonne(p: PersonneComposee, aujourdHui: Date = new Date()): string {
  const jour = dateCourte(p.naissance);
  const age = ageEcrit(p, aujourdHui);
  const morceaux = [p.prenom.trim() || 'Sans prénom'];
  if (age) morceaux.push(age);
  if (jour) morceaux.push(`né(e) le ${jour}`);
  if (p.ville.trim()) morceaux.push(`à ${p.ville.trim()}`);
  return morceaux.join(' · ');
}

/**
 * **LE JOUR DE NAISSANCE A SON MAGAZINE.** Une date de naissance est un jour de
 * l'année, et l'année en a trois cent soixante-cinq : on peut donc dire, sans
 * rien inventer, **qui ouvre ce jour-là**. C'est tout ce que la date donne — et
 * c'est déjà beaucoup.
 */
export function jourDeNaissance(p: PersonneComposee): { personnage: string; fete: string; dateLongue: string } | null {
  const d = lireDate(p.naissance);
  if (!d) return null;
  const fiche = ficheDuJour(d);
  return { personnage: fiche.personnage, fete: fiche.fete, dateLongue: fiche.dateLongue };
}

/** Le genre d'une personne : ce qu'elle a dit, sinon ce que le prénom dit. */
export function genreDeLaPersonne(p: Pick<PersonneComposee, 'prenom' | 'genre'>): GenrePrenom | '' {
  return p.genre || genreDuPrenom(p.prenom) || '';
}

/** Le plus jeune de la liste — c'est lui qui ouvre (ou ferme) les propositions. */
export function ageLePlusJeune(personnes: PersonneComposee[], aujourdHui: Date = new Date()): number | null {
  const ages = personnes.map((p) => ageDePersonne(p, aujourdHui)).filter((a): a is number => a !== null);
  return ages.length > 0 ? Math.min(...ages) : null;
}

/* —————————————————— PASSER LA LISTE À LA COMPOSITION —————————————————— */

/**
 * La liste voyage dans l'adresse : `Paul,1990-06-12,Provins,masculin;Emma,…`.
 * Quatre champs, deux séparateurs comme partout, et les points-virgules, barres
 * et virgules sont retirés des valeurs pour ne pas casser la liste.
 */
export function encoderPersonnes(personnes: PersonneComposee[]): string {
  return personnes
    .map((p) =>
      [p.prenom, p.naissance, p.ville, p.genre]
        .map((v) => (v ?? '').replace(/[;|,]/g, ' ').trim())
        .join(','),
    )
    .join(';');
}

export function decoderPersonnes(texte: string): PersonneComposee[] {
  return texte
    .split(';')
    .map((bloc) => bloc.split(','))
    .filter((champs) => (champs[0] ?? '').trim().length > 0)
    .map((champs, i) => ({
      id: `p${i + 1}`,
      prenom: (champs[0] ?? '').trim(),
      naissance: (champs[1] ?? '').trim(),
      ville: (champs[2] ?? '').trim(),
      genre: champs[3] === 'feminin' || champs[3] === 'masculin' ? champs[3] : '',
    }));
}
