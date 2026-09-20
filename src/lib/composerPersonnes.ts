import { ficheDuJour } from './fichesAnnee';

/**
 * LE COMPOSEUR — DES PERSONNES, PUIS CE QUI DEVIENT POSSIBLE
 *
 * Le champ de l'accueil ne demande plus « vos prénoms » d'un bloc : il se
 * remplit **personne par personne**, comme on écrit une phrase. Une personne,
 * c'est trois choses et pas une de plus — **son prénom, sa date de naissance, sa
 * ville de naissance** — et le **+** ne s'allume qu'une fois les trois écrites.
 *
 * Et c'est **après** avoir rempli qu'on voit ce qui est possible :
 *
 * - à une personne, on peut être **témoin**, **prestataire** ;
 * - **à deux personnes, « Nous sommes des futurs mariés »** — et le magazine se
 *   compose à deux ;
 * - à trois, la famille.
 *
 * Les mêmes règles que partout : **on ne déduit rien** (un prénom ne dit pas un
 * rôle), **ce qui est grisé dit pourquoi**, et **la date de naissance donne le
 * jour de naissance** — donc **le magazine de ce jour-là**, parmi les 365 : c'est
 * la seule chose qu'on s'autorise à rendre en retour, parce qu'elle existe déjà.
 */

export interface PersonneComposee {
  /** Un identifiant local, pour pouvoir retirer une personne de la liste. */
  id: string;
  prenom: string;
  /** La date de naissance, `AAAA-MM-JJ`, ou ''. */
  naissance: string;
  ville: string;
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
  titre: string;
  /** Ce que ça ouvre, en une ligne — on dit toujours pourquoi. */
  explication: string;
  /** À partir de combien de personnes on peut le choisir. */
  des: number;
  /** Le rôle que ça donne au magazine (une carte du hero). */
  roleId?: string;
  /** Vrai pour les informations essentielles, qui ne sont pas des rôles. */
  essentielle?: boolean;
}

/**
 * **CE QUI DEVIENT POSSIBLE.** La liste se met à jour toute seule : on ne montre
 * jamais une proposition qu'on ne peut pas prendre — et une proposition encore
 * fermée **dit à partir de quand elle s'ouvre**.
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
    id: 'temoin',
    titre: 'Je suis témoin',
    explication: 'Un rôle, une place, et ce que vous avez à faire.',
    des: 1,
    roleId: 'temoin',
  },
  {
    id: 'prestataire',
    titre: 'Je suis prestataire',
    explication: 'Votre métier, vos moments, votre page.',
    des: 1,
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
    id: 'famille',
    titre: 'Nous venons en famille',
    explication: 'Plusieurs personnes, la même table.',
    des: 3,
    roleId: 'famille',
  },
];

/** Ce qu'on peut choisir avec ce nombre de personnes — dans l'ordre. */
export function propositionsPossibles(nombre: number): Proposition[] {
  return PROPOSITIONS.filter((p) => nombre >= p.des);
}

/** Ce qui reste fermé, et à partir de quand ça s'ouvre. */
export function propositionsFermees(nombre: number): Proposition[] {
  return PROPOSITIONS.filter((p) => nombre < p.des);
}

/** « à partir de deux personnes », pour les lignes grisées du menu. */
export function motDeLaCondition(proposition: Proposition): string {
  const mots = ['', 'une personne', 'deux personnes', 'trois personnes', 'quatre personnes'];
  return `à partir de ${mots[proposition.des] ?? `${proposition.des} personnes`}`;
}

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

/** « Paul, né le 12.06.1990 à Provins » — et « née » quand on sait que c'est elle. */
export function phraseDePersonne(p: PersonneComposee): string {
  const jour = dateCourte(p.naissance);
  const morceaux = [p.prenom.trim() || 'Sans prénom'];
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

/* —————————————————— PASSER LA LISTE À LA COMPOSITION —————————————————— */

/**
 * La liste voyage dans l'adresse : `Paul,1990-06-12,Provins;Emma,…`. Trois
 * champs, deux séparateurs comme partout, et les points-virgules sont retirés
 * des valeurs pour ne pas casser la liste.
 */
export function encoderPersonnes(personnes: PersonneComposee[]): string {
  return personnes
    .map((p) => [p.prenom, p.naissance, p.ville].map((v) => v.replace(/[;|,]/g, ' ').trim()).join(','))
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
    }));
}
