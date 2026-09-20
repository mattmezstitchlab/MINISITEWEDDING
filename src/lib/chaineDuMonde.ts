/**
 * LA CHAÎNE DU MONDE — DE LA CARTE AU CONTENU
 *
 * Tout se tient dans cet ordre, et **rien n'a été ajouté** : chaque maillon
 * existait déjà, c'est leur enchaînement qui donne le système.
 *
 * ```
 * CARTE → PERSONNE → RÔLE → MARIAGE → JOUR → MOMENT → HEURE → CONTENU
 * ```
 *
 * - la **carte** dit qui l'on est (le jeu de 54, une carte = une personne) ;
 * - le **rôle** dit ce qu'on fait (les rôles du jour J) ;
 * - le **mariage** est l'événement, et il a **un jour** ;
 * - ce jour a **six temps**, chacun **des heures**, et chaque heure **une page**.
 *
 * C'est ce qui permet à la timeline d'être la colonne vertébrale : elle remonte
 * la chaîne dans l'autre sens — du contenu à la personne.
 */

export interface Maillon {
  id: string;
  nom: string;
  /** La question à laquelle ce maillon répond. */
  question: string;
  /** Où ça vit, dans le code — un maillon qu'on ne sait pas montrer n'existe pas. */
  ou: string;
  /** Combien il y en a, quand c'est un nombre fixe. */
  combien: number | null;
  /** L'unité, au pluriel. */
  unite: string;
}

export const CHAINE: Maillon[] = [
  {
    id: 'carte',
    nom: 'La carte',
    question: 'Qui est cette personne ?',
    ou: 'le jeu de 54 (chaque personne a sa carte)',
    combien: 54,
    unite: 'cartes',
  },
  {
    id: 'personne',
    nom: 'La personne',
    question: 'Qui agit ?',
    ou: 'la carte d’une personne, et rien d’autre : une carte, une personne',
    combien: null,
    unite: 'personnes',
  },
  {
    id: 'role',
    nom: 'Le rôle',
    question: 'Qu’est-ce qu’elle fait, ce jour-là ?',
    ou: 'les rôles du jour J (Prestataire, Témoin, Invité…)',
    combien: null,
    unite: 'rôles',
  },
  {
    id: 'mariage',
    nom: 'Le mariage',
    question: 'Quel jour, et où ?',
    ou: 'l’événement : sa date, son lieu, ses gens',
    combien: null,
    unite: 'mariages',
  },
  {
    id: 'jour',
    nom: 'Le jour',
    question: 'Quel jour de l’année ?',
    ou: 'les 365 couvertures, une par jour',
    combien: 365,
    unite: 'jours',
  },
  {
    id: 'moment',
    nom: 'Le moment',
    question: 'À quel moment du jour ?',
    ou: 'les six temps du jour (la nuit, l’aube, le matin, le midi, l’après-midi, le soir)',
    combien: 6,
    unite: 'temps',
  },
  {
    id: 'heure',
    nom: 'L’heure',
    question: 'À quelle heure ?',
    ou: 'vingt-quatre heures, une page chacune',
    combien: 24,
    unite: 'heures',
  },
  {
    id: 'contenu',
    nom: 'Le contenu',
    question: 'Que s’y passe-t-il ?',
    ou: 'la page de l’heure : sa rubrique, son titre, son texte, et ce qui l’a décidée',
    combien: null,
    unite: 'pages',
  },
];

/** La chaîne, écrite d'un trait : « CARTE → PERSONNE → … ». */
export const CHAINE_LIGNE = CHAINE.map((m) => m.nom.toUpperCase()).join(' → ');

/** Ce que la chaîne garantit, en une phrase — c'est la promesse du site. */
export const CHAINE_PROMESSE =
  'Chacun a sa carte, donc sa personne ; chaque personne a son rôle, donc son mariage ; chaque mariage a son jour, donc ses moments, ses heures et leur contenu.';

/** Un maillon se retrouve par son identifiant. */
export function maillon(id: string): Maillon | null {
  return CHAINE.find((m) => m.id === id) ?? null;
}
