import { JOURS_NOMMES, type JourNomme } from './saintsDuJour';
import { sansAccents } from './chiffre';

/**
 * CE QU'UN PRÉNOM DIT — ET CE QU'IL NE DIT PAS
 *
 * On écrit un prénom : on peut déjà savoir **si c'est un prénom de femme ou
 * d'homme**, et **quel jour de l'année porte ce prénom** (parmi les 364 journées
 * nommées). Deux sources, dans cet ordre, et c'est tout :
 *
 * 1. **le calendrier des 365** — la source de la maison. « Paul » est au 29 juin,
 *    et c'est un saint : masculin. « Emma » est un jour, et c'est une sainte :
 *    féminin. C'est la même table qui fait les couvertures, donc ça ne peut pas
 *    diverger.
 * 2. **la liste courte des prénoms courants** — pour ce que le calendrier ne
 *    porte pas (Chloé, Hugo, Jade, Nathan…).
 *
 * Et quand les deux se taisent — ou quand le prénom **se porte des deux façons**
 * (Camille, Claude, Maxime, Sacha…) — **on ne devine pas** : on demande. Le
 * prénom ne décide jamais du rôle, du métier ni de l'histoire de quelqu'un : il
 * dit son genre et son jour, rien de plus.
 */

export type GenrePrenom = 'masculin' | 'feminin';

/**
 * **La première source** : le calendrier, transformé en table de genres.
 *
 * Un jour peut porter **plusieurs prénoms** — « Pierre et Paul », « Côme et
 * Damien », « Marie-Madeleine ». On indexe donc **chaque mot**, en deux passes :
 * d'abord les jours à un seul prénom (les plus sûrs), puis les mots des jours
 * composés qui n'ont pas encore été vus. C'est ainsi que « Paul » trouve son
 * 29 juin sans qu'on écrive une ligne de plus.
 */
const MOTS_VIDES = new Set(['ET', 'DE', 'DU', 'DES', 'LA', 'LE', 'LES', 'EN', 'SAINT', 'SAINTE', 'NOTRE', 'DAME']);

export function motsDuNom(nom: string): string[] {
  return sansAccents(nom)
    .split(/[\s'’-]+/)
    .map((m) => m.trim())
    .filter((m) => m.length >= 3 && !MOTS_VIDES.has(m));
}

const GENRE_DU_CALENDRIER: Map<string, GenrePrenom> = new Map();
const JOUR_DU_CALENDRIER: Map<string, JourNomme> = new Map();

for (const j of JOURS_NOMMES) {
  if (j.genre === 'fete') continue; // une fête n'est pas un prénom
  // **Le premier mot est le nom du saint** : « Rose de Lima » donne Rose,
  // « Thérèse de l'Enfant Jésus » donne Thérèse, « Vincent de Paul » donne
  // Vincent — et **pas** Paul, qui n'est pas le nom de ce jour-là. On ne prend
  // jamais un mot de complément pour un prénom.
  const mot = motsDuNom(j.nom)[0];
  if (!mot) continue;
  if (!JOUR_DU_CALENDRIER.has(mot)) JOUR_DU_CALENDRIER.set(mot, j);
  if (!GENRE_DU_CALENDRIER.has(mot)) {
    GENRE_DU_CALENDRIER.set(mot, j.genre === 'sainte' ? 'feminin' : 'masculin');
  }
}

/** **La seconde source** : les prénoms courants que le calendrier ne porte pas. */
const PRENOMS_FEMININS = [
  'Chloé', 'Manon', 'Jade', 'Lina', 'Ambre', 'Rose', 'Anna', 'Mila', 'Julia', 'Zoé',
  'Eva', 'Léna', 'Lola', 'Romane', 'Clara', 'Maëlys', 'Margaux', 'Océane', 'Aurélie', 'Caroline',
  'Marion', 'Anaïs', 'Élise', 'Blanche', 'Berthe', 'Hortense', 'Iris', 'Jeanne', 'Lucile', 'Madeleine',
  'Noémie', 'Ombline', 'Quitterie', 'Salomé', 'Suzanne', 'Victoire', 'Yvonne', 'Thérèse', 'Marie-Madeleine', 'Jeanne-Françoise',
  'Rose de Lima', 'Aya', 'Nour', 'Ava', 'Lya', 'Elsa', 'Lilou', 'Maya', 'Amaya', 'Alba',
  'Romy', 'Héléna', 'Léonie', 'Apolline', 'Constance', 'Garance', 'Philippine', 'Aliénor', 'Bérénice', 'Clémence',
  'Faustine', 'Joséphine', 'Laure', 'Maëlle', 'Ninon', 'Roxane', 'Sixtine', 'Solène', 'Tessa', 'Valentine',
  'Zélie', 'Assia', 'Inaya', 'Kenza', 'Soraya', 'Yasmine', 'Naïma', 'Sonia', 'Leïla', 'Myriam',
  'Nicole', 'Patricia', 'Chantal', 'Corinne', 'Danielle', 'Éliane', 'Fabienne', 'Ghislaine', 'Josette', 'Laurence',
  'Michèle', 'Nadine', 'Pascale', 'Régine', 'Sylviane', 'Fanny', 'Gaëlle', 'Laura', 'Marine', 'Rachel',
  'Sarah', 'Ségolène', 'Tiphaine', 'Victoria', 'Wendy', 'Léona', 'Mélanie', 'Amandine', 'Charlène', 'Ophélie',
];

const PRENOMS_MASCULINS = [
  'Hugo', 'Nathan', 'Gabriel', 'Raphaël', 'Arthur', 'Ethan', 'Théo', 'Baptiste', 'Lucas', 'Enzo',
  'Noah', 'Tom', 'Timéo', 'Maël', 'Aaron', 'Adam', 'Fabien', 'Gaspard', 'Isaac', 'Joachim',
  'Octave', 'Simon', 'Ulysse', 'William', 'Xavier', 'Yann', 'Zacharie', 'Gustave', 'Ivan', 'Karim',
  'Lorenzo', 'Martin', 'Nino', 'Oscar', 'Pablo', 'Robin', 'Samuel', 'Tristan', 'Éloi', 'François',
  'Ignace', 'Julien', 'Sylvestre', 'Yanis', 'Rayan', 'Naïm', 'Soan', 'Léandro', 'Tiago', 'Matteo',
  'Lio', 'Elio', 'Milo', 'César', 'Aurélien', 'Bastien', 'Corentin', 'Édouard', 'Firmin', 'Gauthier',
  'Geoffroy', 'Loïc', 'Malo', 'Marceau', 'Noé', 'Nolan', 'Pacôme', 'Sébastien', 'Tanguy', 'Timothée',
  'Valentin', 'Virgile', 'Yohan', 'Amir', 'Bilal', 'Ilyes', 'Mehdi', 'Moussa', 'Idriss', 'Souleymane',
  'Paul', 'Patrick', 'Lionel', 'Régis', 'Mathieu', 'Florian', 'Léo', 'Liam', 'Evan', 'Nael',
  'Cyril', 'Franck', 'Grégory', 'Ludovic', 'Mickaël', 'Stéphane', 'Yohann', 'Alexandre', 'Guillaume', 'Jérôme',
  'Romain', 'Thomas', 'Benoît', 'Arnaud', 'Alexis', 'Baptiste', 'Cyprien', 'Émile', 'Henri', 'Laurent',
];

/**
 * **Les prénoms qui se portent des deux façons** : on ne choisit pas à la place
 * de la personne. Elle clique, ou elle laisse vide — et rien ne sera décidé pour
 * elle.
 */
const PRENOMS_MIXTES = [
  'Camille', 'Claude', 'Dominique', 'Maxime', 'Alix', 'Sacha', 'Sasha', 'Charlie',
  'Noa', 'Swann', 'Loan', 'Ange', 'Céleste', 'Éden', 'Andrea', 'Mika', 'Sam', 'Yannick',
  'Maé', 'Sohane', 'Ariel', 'Célian', 'Ely', 'Mahé', 'Noé',  'Camille',
];

const GENRE_DOCUMENTE: Map<string, GenrePrenom> = new Map([
  ...PRENOMS_FEMININS.map((n) => [sansAccents(n), 'feminin'] as const),
  ...PRENOMS_MASCULINS.map((n) => [sansAccents(n), 'masculin'] as const),
]);
const MIXTES: Set<string> = new Set(PRENOMS_MIXTES.map((n) => sansAccents(n)));

/** Le prénom réduit à ce qu'on peut comparer : son premier mot, sans accent. */
export function cleDuPrenom(prenom: string): string {
  return motsDuNom(prenom)[0] ?? '';
}

export interface LectureDuPrenom {
  /** Le genre lu — `null` quand on ne sait pas : on demandera. */
  genre: GenrePrenom | null;
  /** Vrai quand le prénom se porte des deux façons : on ne tranche pas. */
  mixte: boolean;
  /** D'où vient la lecture, pour pouvoir le dire. */
  source: 'le calendrier des 365' | 'les prénoms courants' | '';
  /** Le jour de l'année qui porte ce prénom, s'il existe. */
  jour: JourNomme | null;
}

/**
 * **On écrit un prénom, on lit ce qu'il dit** : son genre (ou rien), et son jour
 * dans l'année. Jamais plus.
 */
export function lectureDuPrenom(prenom: string): LectureDuPrenom {
  const cle = cleDuPrenom(prenom);
  if (cle.length === 0) return { genre: null, mixte: false, source: '', jour: null };

  if (MIXTES.has(cle)) {
    return { genre: null, mixte: true, source: '', jour: JOUR_DU_CALENDRIER.get(cle) ?? null };
  }
  const duCalendrier = GENRE_DU_CALENDRIER.get(cle);
  if (duCalendrier) {
    return {
      genre: duCalendrier,
      mixte: false,
      source: 'le calendrier des 365',
      jour: JOUR_DU_CALENDRIER.get(cle) ?? null,
    };
  }
  const documente = GENRE_DOCUMENTE.get(cle);
  if (documente) {
    return { genre: documente, mixte: false, source: 'les prénoms courants', jour: null };
  }
  return { genre: null, mixte: false, source: '', jour: null };
}

/** Raccourci : le genre seul, ou `null`. */
export function genreDuPrenom(prenom: string): GenrePrenom | null {
  return lectureDuPrenom(prenom).genre;
}

/** **Le jour du prénom** : le jour de l'année qui le porte, parmi les 364 nommés. */
export function jourDuPrenom(prenom: string): JourNomme | null {
  return lectureDuPrenom(prenom).jour;
}

/** « 29 juin » — le jour, écrit court. */
export function dateDuJourNomme(j: JourNomme): string {
  const mois = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
  ];
  return `${j.jour} ${mois[j.mois - 1]}`;
}

/** Combien de prénoms on sait lire : la couverture de la lecture, dite franchement. */
export const PRENOMS_LUS = GENRE_DU_CALENDRIER.size + GENRE_DOCUMENTE.size;
