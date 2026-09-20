/**
 * LES 365 PROFILS ÉDITORIAUX — LA PORTE D'ENTRÉE DU JOUR
 *
 * Chaque jour a sa couverture. Chaque couverture a **une personne** : le saint
 * du calendrier, ou la figure documentée que la date appelle. Et cette personne
 * ouvre **une porte** : son origine, son époque, son lieu, son métier, son
 * savoir-faire, sa culture — puis **ses ponts vers le mariage**.
 *
 * ```
 * DATE → SAINT / PRÉNOM → PERSONNAGE → ORIGINE → ÉPOQUE → LIEU
 *      → MÉTIER → SAVOIR-FAIRE → CULTURE → MARIAGE
 * ```
 *
 * ## La règle stricte : rien ne se mélange
 *
 * Un fait se cite, une interprétation se signe. Chaque pont porte donc **son
 * niveau**, et il ne se lit jamais comme un fait :
 *
 * - `directe` — documentée : la personne est liée à la chose (un orfèvre, des
 *   alliances ; une photographe, la photographie).
 * - `culturelle` — documentée, mais plus large : un pays, une tradition (le
 *   jazz, l'Irlande, la Méditerranée).
 * - `editoriale` — une association créative, **assumée comme telle** (un
 *   percepteur qui devient apôtre : les comptes, la parole donnée).
 * - `inspiration` — une création : on imagine, on ne raconte pas.
 *
 * ## Ce que ces personnes ne sont pas
 *
 * Ce ne sont **pas des inscrits** : ce sont les personnages du magazine. Aucune
 * ligne de profil n'est une donnée de personne réelle qui se serait inscrite.
 * Ce qui n'est pas documenté n'est **pas** écrit : un jour sans fiche reste sans
 * fiche, et il le dit.
 */

import { jourNomme, jokerDuJour, type Genre } from './saintsDuJour';
import { MOIS } from './calendrier';

/** Les quatre niveaux de correspondance, du documenté au créé. */
export type Niveau = 'directe' | 'culturelle' | 'editoriale' | 'inspiration';

export interface NiveauDef {
  id: Niveau;
  nom: string;
  /** Ce que le niveau veut dire, en une phrase — affichée à côté du pont. */
  sens: string;
}

export const NIVEAUX: NiveauDef[] = [
  {
    id: 'directe',
    nom: 'Correspondance directe',
    sens: 'documentée : la personne est liée à la chose.',
  },
  {
    id: 'culturelle',
    nom: 'Correspondance culturelle',
    sens: 'documentée, mais plus large : un pays, une tradition.',
  },
  {
    id: 'editoriale',
    nom: 'Correspondance éditoriale',
    sens: 'une association créative, assumée comme telle.',
  },
  {
    id: 'inspiration',
    nom: 'Inspiration',
    sens: 'une création : on imagine, on ne raconte pas.',
  },
];

export function niveau(id: Niveau): NiveauDef {
  return NIVEAUX.find((n) => n.id === id)!;
}

/** La fiche : ce qui est documenté sur la personne. */
export interface Fiche {
  origine: string;
  epoque: string;
  lieu: string;
  metier: string;
  savoirFaire: string;
  culture: string;
}

/** Un pont vers le mariage — jamais un fait déguisé. */
export interface Pont {
  niveau: Niveau;
  /** Le mot du mariage par lequel on entre : « Les alliances ». */
  mot: string;
  texte: string;
  /** La page du site que la porte ouvre, quand il y en a une. */
  vers?: string;
}

/** La direction de casting : ce qui ne change pas d'une image à l'autre. */
export interface Casting {
  silhouette: string;
  age: string;
  gardeRobe: string;
  /** Les signes tenus sur les cinq scènes : c'est ce qui fait qu'on reconnaît. */
  signes: string[];
}

/** Ce qu'une fiche ajoute quand elle est complète : le sens, les idées, le casting. */
export interface Addenda {
  signification: string;
  inspirations: string[];
  casting: Casting;
}

export interface Profil {
  /** `MM-JJ`. */
  jour: string;
  /** Le nom porté par le profil : « Matthieu », « Adolphe Sax ». */
  personnage: string;
  /** La fête du calendrier, quand elle diffère du personnage. */
  fete?: string;
  genre?: Genre;
  fiche: Fiche;
  ponts: Pont[];
  /** Les mots de l'index : c'est par eux que la recherche entre. */
  mots: string[];
  /** D'où vient ce qui est écrit ici. */
  source: string;
  /** Ce que le prénom veut dire. Une étymologie se transmet ; elle se cite. */
  signification?: string;
  /** Les idées de mise en scène — des créations, assumées comme telles. */
  inspirations?: string[];
  /** La direction de casting : le même visage sur les cinq scènes. */
  casting?: Casting;
}

/** D'où viennent les étymologies : elles se transmettent, elles ne se prouvent pas toujours. */
export const SIGNIFICATION_SOURCE = 'les dictionnaires de prénoms courants — une étymologie se transmet, elle ne se prouve pas toujours';

/** L'avertissement : ces personnes ne sont pas des inscrits. */
export const AVERTISSEMENT_PROFILS =
  'Les 365 profils ne sont pas des inscrits : ce sont les personnages du magazine. Aucun n’est un utilisateur du site.';

/** La règle, telle qu'elle doit être dite. */
export const REGLE_DES_PROFILS =
  'Ce qui est documenté est cité ; ce qui est imaginé est signé. Les deux ne se mélangent jamais.';

const SRC_CAL = 'le calendrier des fêtes et prénoms du magazine';
const SRC_PATRONS = 'la liste des saints patrons, telle qu’elle est transmise (calendriers, missels, sites de référence)';

/** `[MM-JJ, personnage, fête, genre, fiche, ponts, mots, source]`. */
const BASE: Array<[string, string, string | null, Genre, Fiche, Pont[], string[], string]> = [
  [
    '02-14',
    'Valentin',
    'Valentin',
    'saint',
    {
      origine: 'Rome, prêtre et médecin selon la tradition',
      epoque: 'IIIᵉ siècle',
      lieu: 'Rome, Italie',
      metier: 'Prêtre',
      savoirFaire: 'Le soin, et le secret des choses dites',
      culture: 'La fête des amoureux, partout, le 14 février',
    },
    [
      { niveau: 'directe', mot: 'La demande', texte: 'la fête des amoureux : le jour où l’on demande.', vers: '/le-mariage' },
      { niveau: 'culturelle', mot: 'Les cœurs', texte: 'rouge, cœur, lettre glissée : tout un vocabulaire que le monde entier reconnaît.' },
      { niveau: 'inspiration', mot: 'Une idée de table', texte: 'des lettres cachetées à la cire, une par convive, à ouvrir au dessert.' },
    ],
    ['amour', 'amoureux', 'demande', 'fiancailles', 'rouge', 'lettre'],
    SRC_PATRONS,
  ],
  [
    '03-17',
    'Patrick',
    'Patrice',
    'saint',
    {
      origine: 'Grande-Bretagne, captif devenu évangélisateur',
      epoque: 'Vᵉ siècle',
      lieu: 'Irlande',
      metier: 'Évangélisateur, évêque',
      savoirFaire: 'Parler à un pays entier avec ce qu’il a sous la main',
      culture: 'La fête nationale irlandaise, le trèfle, la bière noire',
    },
    [
      { niveau: 'culturelle', mot: 'Le pays', texte: 'l’Irlande : cliff, château, abbaye en ruine, mariage à deux heures de tout.' },
      { niveau: 'editoriale', mot: 'La couleur', texte: 'un vert qui va avec tout, et qu’on ose rarement.' },
      { niveau: 'inspiration', mot: 'Une idée de cortège', texte: 'une cornemuse qui ouvre la marche jusqu’à la table.' },
    ],
    ['irlande', 'vert', 'trèfle', 'destination', 'chateau', 'voyage'],
    SRC_PATRONS,
  ],
  [
    '05-16',
    'Honoré',
    'Honoré',
    'saint',
    {
      origine: 'Gaule, évêque d’Amiens',
      epoque: 'VIᵉ siècle',
      lieu: 'Amiens, France',
      metier: 'Évêque',
      savoirFaire: 'Le pain, et ce qu’il faut de main pour le faire lever',
      culture: 'Patron des boulangers et des pâtissiers (tradition)',
    },
    [
      { niveau: 'directe', mot: 'Le gâteau', texte: 'le patron des pâtissiers : la pièce montée, la table, le dessert.', vers: '/shop' },
      { niveau: 'editoriale', mot: 'Le brunch', texte: 'le lendemain matin, quand il reste du monde et du pain.' },
      { niveau: 'inspiration', mot: 'Une idée de dessert', texte: 'une pâte feuilletée de mille feuilles, servie sur la table en escalier.' },
    ],
    ['pain', 'gateau', 'piece montee', 'patisserie', 'boulanger', 'dessert'],
    SRC_PATRONS,
  ],
  [
    '06-24',
    'Jean-Baptiste',
    'Jean-Baptiste',
    'fete',
    {
      origine: 'Judée, cousin et précurseur',
      epoque: 'Iᵉʳ siècle',
      lieu: 'Jourdain, Proche-Orient',
      metier: 'Prédicateur',
      savoirFaire: 'Baptiser, c’est-à-dire nommer devant tout le monde',
      culture: 'La Saint-Jean, les feux du solstice, les nuits les plus courtes',
    },
    [
      { niveau: 'culturelle', mot: 'Le feu', texte: 'les feux de la Saint-Jean : le solstice, la nuit dehors, la fête qui commence tard.' },
      { niveau: 'directe', mot: 'Le nom', texte: 'baptiser, c’est écrire un nom : le prénom, la faire-part, le livre d’or.' },
      { niveau: 'inspiration', mot: 'Une idée de lumière', texte: 'que tout baisse au moment du premier feu, et que la musique reprenne après.' },
    ],
    ['feu', 'solstice', 'ete', 'juin', 'nuit', 'bapteme'],
    SRC_CAL,
  ],
  [
    '07-12',
    'Véronique',
    'Olivier',
    'sainte',
    {
      origine: 'Jérusalem, selon la tradition',
      epoque: 'Iᵉʳ siècle',
      lieu: 'Jérusalem',
      metier: 'Femme du peuple',
      savoirFaire: 'Essuyer un visage, et en garder l’image',
      culture: 'Patronne des photographes (tradition)',
    },
    [
      { niveau: 'directe', mot: 'La photographie', texte: 'ce qu’elle garde, c’est une image : la photographe fait exactement ça.', vers: '/le-mariage' },
      { niveau: 'editoriale', mot: 'Le portrait', texte: 'un portrait, c’est un visage qu’on n’oublie pas : le studio du magazine est fondé là-dessus.' },
      { niveau: 'inspiration', mot: 'Une idée d’image', texte: 'une photo prise de dos, pendant la cérémonie, seulement des mains.' },
    ],
    ['photographe', 'photo', 'portrait', 'image', 'studio', 'visage'],
    SRC_PATRONS,
  ],
  [
    '07-29',
    'Marthe',
    'Marthe',
    'sainte',
    {
      origine: 'Béthanie, sœur de Lazare et de Marie',
      epoque: 'Iᵉʳ siècle',
      lieu: 'Béthanie, Proche-Orient',
      metier: 'Hôtesse',
      savoirFaire: 'Recevoir : écouter, nourrir, faire asseoir',
      culture: 'Patronne des hôteliers, des cabaretiers et des cuisiniers (tradition)',
    },
    [
      { niveau: 'directe', mot: 'La réception', texte: 'recevoir, c’est le métier de la maison : le lieu, le traiteur, le service.', vers: '/le-mariage' },
      { niveau: 'culturelle', mot: 'L’hospitalité', texte: 'les mariages de plusieurs jours, les maisons d’hôtes, les invités qui dorment sur place.' },
      { niveau: 'inspiration', mot: 'Une idée de plan', texte: 'une seule personne à l’accueil, qui connaît chaque nom.' },
    ],
    ['reception', 'traiteur', 'hotel', 'invites', 'table', 'hospitalite'],
    SRC_PATRONS,
  ],
  [
    '08-30',
    'Fiacre',
    'Fiacre',
    'saint',
    {
      origine: 'Irlande, ermite venu en Gaule',
      epoque: 'VIIᵉ siècle',
      lieu: 'Meaux, France',
      metier: 'Jardinier',
      savoirFaire: 'Faire pousser : le potager, le jardin, le clos',
      culture: 'Patron des jardiniers — et, par le fiacre, des chauffeurs de taxi (tradition)',
    },
    [
      { niveau: 'directe', mot: 'Les fleurs', texte: 'le patron des jardiniers : le fleuriste, le bouquet, la table.', vers: '/le-mariage' },
      { niveau: 'directe', mot: 'Le transport', texte: 'et le fiacre, d’où son nom : les taxis, la navette, les invités qu’on va chercher.' },
      { niveau: 'inspiration', mot: 'Une idée de jardin', texte: 'le dîner servi dans le potager, entre deux rangs.' },
    ],
    ['jardin', 'fleuriste', 'fleurs', 'potager', 'taxi', 'transport'],
    SRC_PATRONS,
  ],
  [
    '09-21',
    'Matthieu',
    'Matthieu',
    'saint',
    {
      origine: 'Galilée, percepteur d’impôts devenu apôtre et témoin',
      epoque: 'Iᵉʳ siècle',
      lieu: 'Capharnaüm, Galilée — Jérusalem',
      metier: 'Percepteur, puis écrivain',
      savoirFaire: 'Tenir des comptes, et raconter ce qu’il a vu',
      culture: 'Patron des comptables et des inspecteurs des impôts (tradition)',
    },
    [
      { niveau: 'directe', mot: 'La papeterie', texte: 'celui qui écrit : le faire-part, le menu, la calligraphie, le livre d’or.', vers: '/shop' },
      { niveau: 'editoriale', mot: 'Le discours', texte: 'il a témoigné : les vœux, le discours, la parole qu’on donne devant tout le monde.' },
      { niveau: 'culturelle', mot: 'La Méditerranée', texte: 'la rive d’où il vient : un mariage au soleil, l’huile, le citron, le blanc.' },
      { niveau: 'inspiration', mot: 'Une idée de photo', texte: 'un grand livre ouvert à la place du livre d’or, et chacun écrit debout.' },
    ],
    ['ecriture', 'papeterie', 'discours', 'voeux', 'comptes', 'budget', 'mediterranee', 'livre d or'],
    SRC_PATRONS,
  ],
  [
    '09-26',
    'Côme et Damien',
    'Côme',
    'saint',
    {
      origine: 'Cilicie, frères jumeaux, médecins',
      epoque: 'IIIᵉ siècle',
      lieu: 'Cilicie, Asie mineure',
      metier: 'Médecins',
      savoirFaire: 'Soigner, et opérer sans se faire payer',
      culture: 'Patrons des médecins, des chirurgiens et des pharmaciens (tradition)',
    },
    [
      { niveau: 'directe', mot: 'Les soins', texte: 'deux médecins : la trousse du jour J, les pieds, la chaleur, la pharmacie.', vers: '/le-mariage' },
      { niveau: 'editoriale', mot: 'La santé', texte: 'un mariage se prépare des mois : on prend soin des corps, comme on prend soin des plans.' },
      { niveau: 'inspiration', mot: 'Une idée de geste', texte: 'une personne nommée pour s’occuper des autres, le jour J, et d’eux seuls.' },
    ],
    ['sante', 'medecin', 'secours', 'pharmacie', 'soin'],
    SRC_PATRONS,
  ],
  [
    '10-18',
    'Luc',
    'Luc',
    'saint',
    {
      origine: 'Antioche, compagnon de voyage de Paul',
      epoque: 'Iᵉʳ siècle',
      lieu: 'Antioche — Grèce — Rome',
      metier: 'Médecin, et peintre selon la tradition',
      savoirFaire: 'Raconter une vie, et la dessiner',
      culture: 'Patron des médecins et des peintres (tradition)',
    },
    [
      { niveau: 'directe', mot: 'Le portrait', texte: 'le peintre : l’art, le décor, le portrait des invités.', vers: '/le-mariage' },
      { niveau: 'directe', mot: 'Le soin', texte: 'le médecin : la même entrée, par le corps.' },
      { niveau: 'culturelle', mot: 'Le récit', texte: 'écrire l’histoire de quelqu’un : ce que fait un livre d’or quand il est bien tenu.' },
    ],
    ['peintre', 'art', 'portrait', 'medecin', 'recit', 'decor'],
    SRC_PATRONS,
  ],
  [
    '11-06',
    'Adolphe Sax',
    'Bertille',
    'fete',
    {
      origine: 'Dinant, fils d’un facteur d’instruments réputé',
      epoque: 'XIXᵉ siècle — né en 1814, mort en 1894',
      lieu: 'Dinant, Belgique — Paris',
      metier: 'Facteur d’instruments, inventeur',
      savoirFaire: 'Fusionner la puissance des cuivres et la souplesse des bois — il dépose le brevet des saxophones en 1846',
      culture: 'Le jazz, la fanfare, la variété : tout ce qui se joue sur un saxophone',
    },
    [
      { niveau: 'directe', mot: 'La musique', texte: 'il a inventé l’instrument : le groupe, la fanfare, le sax qui entre par la fenêtre.', vers: '/le-mariage' },
      { niveau: 'culturelle', mot: 'Le jazz', texte: 'ce que son instrument a permis : la soul, le funk, la nuit qui ne s’arrête pas.' },
      { niveau: 'editoriale', mot: 'L’ouverture de bal', texte: 'un seul instrument qui prend la piste et lance tout le monde.' },
      { niveau: 'inspiration', mot: 'Une idée de scène', texte: 'le pavillon du sax rempli de fleurs, posé sur l’estrade à la fin.' },
    ],
    ['musique', 'saxophone', 'jazz', 'groupe', 'dj', 'orchestre', 'bal'],
    'les sources biographiques courantes (naissance à Dinant en 1814, brevet de 1846)',
  ],
  [
    '11-22',
    'Cécile',
    'Cécile',
    'sainte',
    {
      origine: 'Rome, fille d’une famille patricienne',
      epoque: 'IIIᵉ siècle',
      lieu: 'Rome, Italie',
      metier: 'Musicienne selon la tradition',
      savoirFaire: 'Chanter, et entendre une musique que personne d’autre n’entend',
      culture: 'Patronne des musiciens (tradition)',
    },
    [
      { niveau: 'directe', mot: 'La musique', texte: 'la patronne des musiciens : le groupe, le chant, la sono, la cérémonie.', vers: '/le-mariage' },
      { niveau: 'editoriale', mot: 'Le silence', texte: 'elle chante au milieu du bruit : le moment où la musique s’arrête et où l’on entend la salle.' },
      { niveau: 'inspiration', mot: 'Une idée de processions', texte: 'un chœur caché qui répond à voix basse, depuis le fond.' },
    ],
    ['musique', 'choeur', 'chant', 'ceremonie', 'sono', 'orchestre'],
    SRC_PATRONS,
  ],
  [
    '12-01',
    'Éloi',
    'Florence',
    'saint',
    {
      origine: 'Gaule, orfèvre, monétaire du roi, puis évêque',
      epoque: 'VIIᵉ siècle',
      lieu: 'Limoges — Paris — Noyon, France',
      metier: 'Orfèvre et monnayeur',
      savoirFaire: 'Travailler le métal précieux : fondre, battre, graver',
      culture: 'Patron des orfèvres, des bijoutiers, des horlogers (tradition)',
    },
    [
      { niveau: 'directe', mot: 'Les alliances', texte: 'un orfèvre : les alliances, l’or, la gravure du prénom et de la date.', vers: '/shop' },
      { niveau: 'directe', mot: 'Le temps', texte: 'et les horlogers : le mariage est une affaire d’heures, on le sait ici.' },
      { niveau: 'inspiration', mot: 'Une idée d’objet', texte: 'deux alliances coulées dans le même lingot, séparées ensuite.' },
    ],
    ['alliances', 'bijoux', 'orfevre', 'or', 'gravure', 'montre'],
    SRC_PATRONS,
  ],
  [
    '12-04',
    'Barbe',
    'Barbara',
    'sainte',
    {
      origine: 'Nicomédie, convertie et martyre',
      epoque: 'IIIᵉ siècle',
      lieu: 'Nicomédie, Asie mineure',
      metier: 'Selon la tradition, enfermée dans une tour par son père',
      savoirFaire: 'La tour, l’orage : ce qui protège et ce qui menace',
      culture: 'Patronne des mineurs, des pompiers et des artificiers (tradition)',
    },
    [
      { niveau: 'directe', mot: 'Le feu d’artifice', texte: 'les artificiers : le bouquet final, la pyrotechnie, la flamme froide.', vers: '/le-mariage' },
      { niveau: 'editoriale', mot: 'La sécurité', texte: 'mineurs et pompiers : les consignes, les extincteurs, la porte qui s’ouvre.' },
      { niveau: 'inspiration', mot: 'Une idée de fin', texte: 'qu’un seul feu dure plus longtemps, plutôt que dix plus courts.' },
    ],
    ['feu d artifice', 'pyrotechnie', 'securite', 'pompier', 'orage', 'militaire'],
    SRC_PATRONS,
  ],
  [
    '12-06',
    'Nicolas',
    'Nicolas',
    'saint',
    {
      origine: 'Lycie, évêque de Myre',
      epoque: 'IVᵉ siècle',
      lieu: 'Myre, Lycie',
      metier: 'Évêque',
      savoirFaire: 'Donner sans se montrer — la légende des trois bourses',
      culture: 'Patron des enfants et des marins ; l’ancêtre du Père Noël (tradition)',
    },
    [
      { niveau: 'culturelle', mot: 'Les enfants', texte: 'l’enfance au mariage : les enfants d’honneur, la table des cousins.' },
      { niveau: 'directe', mot: 'La mer', texte: 'les marins : un mariage au bord de l’eau, un bateau, les photos du large.' },
      { niveau: 'editoriale', mot: 'Le cadeau', texte: 'donner sans se montrer : les cadeaux d’invités, la lettre qu’on ne signe pas.' },
    ],
    ['enfants', 'noel', 'cadeau', 'marins', 'mer', 'invites'],
    SRC_PATRONS,
  ],
  [
    '12-25',
    'Noël',
    null,
    'fete',
    {
      origine: 'La fête la plus partagée du calendrier',
      epoque: 'Depuis le IVᵉ siècle',
      lieu: 'Le monde entier',
      metier: '—',
      savoirFaire: 'La table, la lumière, la maison ouverte',
      culture: 'La fête d’hiver, la famille, les cadeaux',
    },
    [
      { niveau: 'culturelle', mot: 'La table', texte: 'le repas d’hiver : ce que la famille porte, et ce qu’on garde d’elle.' },
      { niveau: 'editoriale', mot: 'Le calendrier', texte: 'le 25 décembre : on compte en jours fériés, donc on compte en dates — c’est le principe du magazine.' },
      { niveau: 'inspiration', mot: 'Une idée de déco', texte: 'des bougies par centaines, et rien d’autre.' },
    ],
    ['noel', 'hiver', 'table', 'famille', 'fete', 'bougies'],
    SRC_CAL,
  ],
];

/* ————————————————— LE SENS, LES IDÉES, LE CASTING ————————————————— */

/**
 * Ce que chaque fiche gagne quand on la prépare pour la production : **ce que le
 * prénom veut dire** (cité), **les idées de mise en scène** (des créations,
 * assumées comme telles) et **la direction de casting** — le visage, l'âge, la
 * garde-robe et les signes tenus sur les cinq scènes.
 *
 * Rien ici n'est présenté comme un fait : la signification vient des
 * dictionnaires de prénoms, et tout le reste est de la fabrication — c'est
 * écrit.
 */
export const ADDENDA: Record<string, Addenda> = {
  '02-14': {
    signification: 'du latin valens : « vigoureux, en bonne santé ».',
    inspirations: ['des lettres cachetées à la cire, une par convive, à ouvrir au dessert', 'une tablée éclairée par des bougies posées dans des verres'],
    casting: { silhouette: 'grand, mince, épaules larges', age: '35 ans', gardeRobe: 'costume de laine rouge sombre, chemise de lin ouverte', signes: ['un anneau d’or au doigt', 'des mains d’écriture'] },
  },
  '03-17': {
    signification: 'du latin patricius : « patricien », de la classe noble.',
    inspirations: ['une falaise irlandaise, le vent qui tient les vêtements', 'une cornemuse qui ouvre la marche jusqu’à la table'],
    casting: { silhouette: 'large, épais, l’allure de celui qui marche vite', age: '50 ans', gardeRobe: 'grosse laine verte, caban, bottes crottées', signes: ['un trèfle frais à la main', 'un bâton de marche'] },
  },
  '05-16': {
    signification: 'du latin honoratus : « honoré ».',
    inspirations: ['une pièce montée servie sur une table en escalier', 'une boulangerie de nuit, la porte du four ouverte'],
    casting: { silhouette: 'court, solide, les avant-bras larges', age: '55 ans', gardeRobe: 'tablier de toile écrue sur chemise blanche', signes: ['la farine sur l’avant-bras', 'un torchon sur l’épaule'] },
  },
  '06-24': {
    signification: 'de l’hébreu : « Dieu fait grâce » ; Baptiste, « celui qui baptise ».',
    inspirations: ['des feux de la Saint-Jean allumés sur trois collines', 'des torches qui s’allument l’une après l’autre, sans un mot'],
    casting: { silhouette: 'grand, sec, la peau tannée', age: '30 ans', gardeRobe: 'lin brut, ceinture de cuir, pieds nus', signes: ['de l’eau ruisselante sur les épaules', 'un bâton droit planté'] },
  },
  '07-12': {
    signification: 'du latin vera icon : « la vraie image » — le nom vient de la légende, pas l’inverse.',
    inspirations: ['un portrait tiré à la chambre, encore mouillé', 'le premier portrait de la journée, fait dans l’ombre'],
    casting: { silhouette: 'moyenne, le port très droit', age: '45 ans', gardeRobe: 'voile de lin blanc, appareil argentique en bandoulière', signes: ['un appareil moyen format', 'un linge plié dans la poche'] },
  },
  '07-29': {
    signification: 'de l’araméen : « dame, maîtresse de maison ».',
    inspirations: ['une maison d’hôtes où chaque nom est connu', 'un service fait à la main, plat par plat'],
    casting: { silhouette: 'solide, les mains vives', age: '45 ans', gardeRobe: 'tablier de cuisine sur une robe simple', signes: ['un trousseau de clés', 'des mains rougies par l’eau chaude'] },
  },
  '08-30': {
    signification: 'de l’irlandais Fiachra — le nom de l’ermite, avant de devenir le nom commun du fiacre.',
    inspirations: ['un dîner servi entre deux rangs de potager', 'des fleurs coupées le matin même, jamais piquées'],
    casting: { silhouette: 'voûté, les mains larges', age: '60 ans', gardeRobe: 'gilet de toile, chapeau de paille usé', signes: ['un panier de légumes', 'de la terre sous les ongles'] },
  },
  '09-21': {
    signification: 'de l’hébreu mattityahu : « don de Dieu » — le même sens que Théodore ou Dieudonné.',
    inspirations: ['un grand livre ouvert à la place du livre d’or, où chacun écrit debout', 'des pièces de monnaie qui deviennent des anneaux en tombant'],
    casting: { silhouette: 'longue, les épaules basses', age: '40 ans', gardeRobe: 'tailleur ivoire déstructuré, chemise ouverte', signes: ['un carnet et un stylo à encre', 'des lunettes fines', 'une bague à la main droite'] },
  },
  '09-26': {
    signification: 'Côme, du grec kosmos : « ordre, beauté » ; Damien, du grec : « celui qui dompte ».',
    inspirations: ['une infirmerie de campagne installée sous une tente', 'des pieds nus sur l’herbe, le soir, après la danse'],
    casting: { silhouette: 'deux frères, même taille, même carrure', age: '35 ans', gardeRobe: 'blouses de lin, manches roulées', signes: ['une trousse de soins en cuir', 'deux paires de mains identiques'] },
  },
  '10-18': {
    signification: 'du latin lux, ou du grec loukas : « lumière ».',
    inspirations: ['un portrait peint pendant le repas, en une seule pose', 'un chevalet planté au milieu des tables'],
    casting: { silhouette: 'large, assis, une jambe tendue', age: '50 ans', gardeRobe: 'gilet de travail taché de peinture, manches retroussées', signes: ['un pinceau derrière l’oreille', 'des doigts tachés'] },
  },
  '11-06': {
    signification: 'du germanique adal, « noble », et wolf, « loup ».',
    inspirations: ['le pavillon du sax rempli de fleurs, posé sur l’estrade', 'un mur de briques fendu par un saxophone qui pousse'],
    casting: { silhouette: 'trapue, le torse large', age: '40 ans', gardeRobe: 'gilet de velours bronze, chemise blanche, nœud défait', signes: ['un saxophone ténor tenu comme un objet familier', 'une moustache', 'des mains de fabricant'] },
  },
  '11-22': {
    signification: 'du latin caecus, « aveugle » — et le nom de la famille romaine des Caecilii.',
    inspirations: ['des cordes de harpe qui deviennent des rubans', 'des tuyaux d’orgue qui s’allument comme des bougies'],
    casting: { silhouette: 'fine, le cou long', age: '30 ans', gardeRobe: 'robe ivoire fluide, pieds nus, un ruban au poignet', signes: ['un ruban de soie', 'les yeux fermés sur une phrase chantée'] },
  },
  '12-01': {
    signification: 'du latin Eligius : « l’élu ».',
    inspirations: ['deux alliances coulées dans le même lingot, séparées ensuite', 'un établi en feu, l’or qui coule dans la lingotière'],
    casting: { silhouette: 'fort, les épaules hautes', age: '45 ans', gardeRobe: 'tablier de cuir d’orfèvre sur chemise sombre', signes: ['des alliances posées sur l’établi', 'un marteau fin', 'des lunettes de joaillier'] },
  },
  '12-04': {
    signification: 'du grec barbaros : « étrangère » — celle qui n’est pas d’ici.',
    inspirations: ['un bouquet final unique et très long, tiré depuis une barque', 'une tour de pierre éclairée de l’intérieur'],
    casting: { silhouette: 'droite, les cheveux très courts', age: '30 ans', gardeRobe: 'combinaison ignifugée bleu nuit, gants de cuir', signes: ['une lampe frontale', 'une mèche lente à la main'] },
  },
  '12-06': {
    signification: 'du grec nikê, « victoire », et laos, « peuple ».',
    inspirations: ['des cadeaux déposés sans un mot, dans le dos des invités', 'un port la nuit, les mâts qui sonnent'],
    casting: { silhouette: 'épaisse, la barbe longue', age: '60 ans', gardeRobe: 'manteau de laine rouge sombre, étole ancienne', signes: ['trois bourses de cuir', 'un bâton posé, jamais tenu'] },
  },
  '12-25': {
    signification: 'du latin natalis : « jour de naissance ».',
    inspirations: ['des bougies par centaines, et rien d’autre', 'une table qui déborde, dressée par quatre générations'],
    casting: { silhouette: 'une tablée plutôt qu’un corps : le personnage du 25 décembre est la maison', age: 'tous les âges, ensemble', gardeRobe: 'les pulls de tout le monde, mal assortis, assumés', signes: ['des bougies par centaines', 'une nappe de lin rouge'] },
  },
};

/** L'index du calendrier : `MM-JJ` → profil. */
export const PROFILS: Record<string, Profil> = Object.fromEntries(
  BASE.map(([jour, personnage, fete, genre, fiche, ponts, mots, source]) => [
    jour,
    {
      jour, personnage, fete: fete ?? undefined, genre, fiche, ponts, mots, source,
      signification: ADDENDA[jour]?.signification,
      inspirations: ADDENDA[jour]?.inspirations,
      casting: ADDENDA[jour]?.casting,
    } satisfies Profil,
  ]),
);

/** Les jours qui ont leur fiche, dans l'ordre de l'année. */
export const JOURS_DOCUMENTES: string[] = Object.keys(PROFILS).sort();

export function profilsDocumentes(): number {
  return JOURS_DOCUMENTES.length;
}

/** La clé `MM-JJ` d'une date. */
export function cleDuJour(date: Date): string {
  return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/** Le nom de la personne du jour : sa fiche si elle existe, sinon le calendrier. */
export function personnageDuJour(date: Date): string {
  const profil = PROFILS[cleDuJour(date)];
  if (profil) return profil.personnage;
  const j = jourNomme(date);
  if (j) return j.nom;
  const joker = jokerDuJour(date);
  return joker?.saint ?? joker?.nom ?? '';
}

export interface ProfilDuJour {
  date: Date;
  /** `MM-JJ`. */
  jour: string;
  /** La date écrite : « 21 septembre 2026 ». */
  dateLongue: string;
  personnage: string;
  /** Le profil, quand le jour a sa fiche. */
  profil: Profil | null;
  /** Vrai quand la fiche existe et est documentée. */
  documente: boolean;
  /** La phrase d'entrée : ce que le jour ouvre. */
  entree: string;
}

export function profilDuJour(date: Date): ProfilDuJour {
  const jour = cleDuJour(date);
  const profil = PROFILS[jour] ?? null;
  const dateLongue = `${date.getDate()} ${MOIS[date.getMonth()]!.nom} ${date.getFullYear()}`;
  const personnage = personnageDuJour(date);
  const entree = profil
    ? `Profil éditorial du ${date.getDate()} ${MOIS[date.getMonth()]!.nom} — ${profil.ponts.length} ponts vers le mariage.`
    : `Profil éditorial du ${date.getDate()} ${MOIS[date.getMonth()]!.nom} — sa fiche s’écrit : on ne l’invente pas.`;
  return { date, jour, dateLongue, personnage, profil, documente: profil !== null, entree };
}

/** Le genre de la fête du jour : ce que la fiche porte, sinon le calendrier. */
export function genreDuJour(date: Date): Genre | null {
  const profil = PROFILS[cleDuJour(date)];
  if (profil?.genre) return profil.genre;
  return jourNomme(date)?.genre ?? null;
}

/** Sans accent, sans majuscules : la forme sous laquelle tout se cherche. */
export function plat(texte: string): string {
  return texte
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/** Tout ce qu'un profil donne à lire — c'est là que la recherche entre. */
function texteDuProfil(p: Profil): string {
  return plat(
    [
      p.personnage,
      p.fete ?? '',
      p.fiche.origine,
      p.fiche.epoque,
      p.fiche.lieu,
      p.fiche.metier,
      p.fiche.savoirFaire,
      p.fiche.culture,
      p.mots.join(' '),
      p.ponts.map((pont) => `${pont.mot} ${pont.texte} ${niveau(pont.niveau).nom}`).join(' '),
    ].join(' '),
  );
}

/**
 * LA RECHERCHE — « mariage au Japon en octobre avec saxophone ».
 *
 * Tous les mots doivent se retrouver dans le profil : c'est ce qui empêche la
 * recherche d'inventer un résultat. Un profil trouvé ouvre sa fiche, ses ponts,
 * et la page du site que le pont désigne.
 */
export function chercherProfils(mots: string[]): Profil[] {
  const cherches = mots.map(plat).filter((m) => m.length > 1);
  if (cherches.length === 0) return [];
  return JOURS_DOCUMENTES.map((j) => PROFILS[j]!).filter((p) => {
    const texte = texteDuProfil(p);
    return cherches.every((m) => texte.includes(m));
  });
}

/** Les ponts d'un profil, groupés par niveau — pour l'affichage. */
export function pontsParNiveau(profil: Profil): Array<{ niveau: NiveauDef; ponts: Pont[] }> {
  return NIVEAUX.map((n) => ({ niveau: n, ponts: profil.ponts.filter((p) => p.niveau === n.id) })).filter(
    (groupe) => groupe.ponts.length > 0,
  );
}
