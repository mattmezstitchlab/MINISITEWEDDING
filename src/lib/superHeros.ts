import type { Personnage } from './personas';

/**
 * LES SUPER HÉROS — VINGT SPÉCIALISTES, CHACUN SA PART
 *
 * Ce ne sont pas des fonctions, ce sont des **métiers de l'ombre** : chacun
 * surveille une chose, la comprend, et la signale. Le point d'état s'allume à
 * leur appel, la fente sort le ticket, et l'on n'a rien à chercher.
 *
 * Ils ne décident pas à la place des gens. Ils **voient** ce que personne ne
 * regarde : une pièce qui manque, une date qui approche, un droit qu'on ignore,
 * un métier qui ferait exactement ce qu'il faut. C'est de là que naissent les
 * **SUPER MATCH** : un mariage n'est pas un dossier, c'est une rencontre entre
 * des personnes, des lieux, des métiers et des moments.
 */

export interface SuperHeros {
  id: string;
  /** Le nom de code. */
  nom: string;
  /** Sa spécialité, en une ligne. */
  specialite: string;
  /** Ce qu'il surveille. */
  surveille: string;
  /** Ce qu'il fait quand il voit quelque chose. */
  pouvoir: string;
  /** La couleur de son ticket, dans l'échelle des paliers (1 à 6). */
  palier: number;
}

export const SUPER_HEROS: SuperHeros[] = [
  {
    id: 'archiviste',
    nom: 'L’ARCHIVISTE',
    specialite: 'Les documents et les pièces à réunir',
    surveille: 'Ce qui manque, ce qui expire, ce qui n’est pas au bon nom',
    pouvoir: 'Ouvre un ticket « pièce manquante », et rappelle la source officielle',
    palier: 3,
  },
  {
    id: 'temoin',
    nom: 'LE TÉMOIN',
    specialite: 'Les droits et les traces',
    surveille: 'Ce qui a été lu, refusé, accepté — et quand',
    pouvoir: 'Horodate chaque choix, et le dit : « vous n’étiez pas obligé d’ouvrir »',
    palier: 2,
  },
  {
    id: 'balance',
    nom: 'LA BALANCE',
    specialite: 'Les négociations',
    surveille: 'Les allers-retours entre deux personnes, les accords tacites',
    pouvoir: 'Garde la négociation écrite sur le ticket, et marque ce qui a été accordé',
    palier: 4,
  },
  {
    id: 'chronometre',
    nom: 'LE CHRONOMÈTRE',
    specialite: 'Le planning du jour J',
    surveille: 'Les durées réelles, les temps de trajet, les retards possibles',
    pouvoir: 'Décale une heure, prévient les métiers concernés',
    palier: 3,
  },
  {
    id: 'boussole',
    nom: 'LA BOUSSOLE',
    specialite: 'Les frontières et les voyages',
    surveille: 'Visas, invitations, expatriation, retours',
    pouvoir: 'Assemble le dossier de voyage, et dit quels pays demandent quoi',
    palier: 5,
  },
  {
    id: 'metronome',
    nom: 'LE MÉTRONOME',
    specialite: 'La musique et les moments',
    surveille: 'L’énergie qui monte, les silences, les morceaux qui vont ensemble',
    pouvoir: 'Suggère des musiciens et des groupes qui rejouent — jamais la copie des originaux',
    palier: 2,
  },
  {
    id: 'coeur',
    nom: 'LE CŒUR',
    specialite: 'Les affinités',
    surveille: 'Ce que les gens regardent, aiment, choisissent — jamais leurs secrets',
    pouvoir: 'Rapproche les profils, et propose les SUPER MATCH',
    palier: 3,
  },
  {
    id: 'echo',
    nom: 'L’ÉCHO',
    specialite: 'Les invités',
    surveille: 'Qui a répondu, qui vient, qui a un régime particulier',
    pouvoir: 'Relance avec tact, et tient la liste vivante',
    palier: 2,
  },
  {
    id: 'memoire',
    nom: 'LA MÉMOIRE',
    specialite: 'Les photos et les films',
    surveille: 'Les moments couverts, ceux qui manquent, les visages',
    pouvoir: 'Regroupe les images par moment, et dit ce qu’on n’a pas photographié',
    palier: 2,
  },
  {
    id: 'intendant',
    nom: 'L’INTENDANT',
    specialite: 'Les prestataires',
    surveille: 'Ce qui est réservé, ce qui reste à confirmer, les doublons',
    pouvoir: 'Compose le plateau, et signale ce qui ne tient pas debout',
    palier: 3,
  },
  {
    id: 'chiffreur',
    nom: 'LE CHIFFREUR',
    specialite: 'Les budgets',
    surveille: 'Les écarts entre le prévu et le devis, les totaux du ticket',
    pouvoir: 'Montre la ligne qui dérape, avant qu’elle ne dérape',
    palier: 4,
  },
  {
    id: 'veilleur',
    nom: 'LE VEILLEUR',
    specialite: 'Les alertes juridiques',
    surveille: 'Ce qui change dans les règles, les délais, les obligations',
    pouvoir: 'Prévient, cite la source, et dit : « à faire valider »',
    palier: 5,
  },
  {
    id: 'passeur',
    nom: 'LE PASSEUR',
    specialite: 'Le passé, le présent, le futur',
    surveille: 'Ceux qui l’ont vécu, ceux qui le préparent, ceux qui l’imaginent',
    pouvoir: 'Fait parler les anciens mariés aux futurs — conseils de vrais gens',
    palier: 1,
  },
  {
    id: 'souffleur',
    nom: 'LE SOUFFLEUR',
    specialite: 'Les mots',
    surveille: 'Les discours, les vœux, les remerciements',
    pouvoir: 'Propose des mots, jamais des phrases toutes faites',
    palier: 2,
  },
  {
    id: 'orfevre',
    nom: 'L’ORFÈVRE',
    specialite: 'Les détails rares',
    surveille: 'Ce qui n’existe presque nulle part : artisans, métiers oubliés',
    pouvoir: 'Va chercher la personne qui sait faire, et personne d’autre',
    palier: 3,
  },
  {
    id: 'semeur',
    nom: 'LE SEMEUR',
    specialite: 'L’écologie et la sobriété',
    surveille: 'Ce qui se jette, ce qui se loue, ce qui se prête, ce qui se donne',
    pouvoir: 'Propose l’occasion avant l’achat, et compte ce qu’on économise',
    palier: 1,
  },
  {
    id: 'concierge',
    nom: 'LE CONCIERGE',
    specialite: 'Accueillir',
    surveille: 'Les arrivées, les nuits, les transferts, les langues',
    pouvoir: 'Prépare l’accueil de chacun, et prévient ceux qui hébergent',
    palier: 2,
  },
  {
    id: 'cartographe',
    nom: 'LE CARTOGRAPHE',
    specialite: 'Les univers et les lieux',
    surveille: 'Ce qui existe près de chez vous, et ce qui existe ailleurs',
    pouvoir: 'Ouvre un univers entier, avec ses métiers et ses habitudes',
    palier: 1,
  },
  {
    id: 'gardien',
    nom: 'LE GARDIEN',
    specialite: 'Le cloisonnement',
    surveille: 'Qui voit quoi — et qui ne doit jamais voir',
    pouvoir: 'Refuse un accès, et le dit sans détour',
    palier: 6,
  },
  {
    id: 'passeur_de_lien',
    nom: 'LE PASSEUR DE LIEN',
    specialite: 'Les deux mondes',
    surveille: 'Ce qui manque d’un côté et existe de l’autre',
    pouvoir: 'Fait le pont : une demande ici devient une annonce là',
    palier: 3,
  },
];

/** Les héros qui surveillent un palier donné, du plus grave au plus calme. */
export function herosDuPalier(palier: number): SuperHeros[] {
  return SUPER_HEROS.filter((h) => h.palier === palier);
}

/** Le héros qui porte une spécialité, quand on la nomme. */
export function herosParId(id: string): SuperHeros | undefined {
  return SUPER_HEROS.find((h) => h.id === id);
}

/**
 * **LE SUPER MATCH** — ce qui se cherche, et qui se trouve.
 *
 * Un mariage n'est pas un dossier : c'est une rencontre. On met en face ce qu'une
 * personne apporte (sa carte, son univers, ses envies) et ce qu'une autre
 * attend — et le match ne se fait pas sur un score, mais sur des **raisons**,
 * que l'on peut lire.
 */
export interface SuperMatch {
  /** Qui propose. */
  par: string;
  /** Qui est proposé. */
  a: Personnage;
  /** Pourquoi, en une phrase lisible. */
  parceque: string;
  /** Sur quoi l'on s'appuie : une carte, un univers, un métier, un moment. */
  sur: string;
}
