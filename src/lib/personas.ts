import { FULL_ROLES_TAXONOMY } from './weddingTaxonomy';

/**
 * LES PERSONNAGES — « QUI ÊTES-VOUS DANS CE MARIAGE ? »
 *
 * Le site ne commence plus par un formulaire, il commence par un personnage. Un
 * personnage, ici, c'est **un rôle de la taxonomie** : les mariés, un invité, un
 * témoin, un traiteur, un DJ, un fleuriste… Rien n'est inventé, rien n'est
 * ressaisi : le rôle est celui que le site connaît déjà, et c'est lui qui donne
 * l'écran, les droits et les modules.
 *
 * Ce fichier n'ajoute que ce qu'un personnage dit de lui-même, en une phrase, et
 * **les entrées de son espace** — ce qu'on voit de son métier sans voir ses
 * informations. C'est la démonstration : on regarde tous les rôles, on n'entre
 * qu'avec le sien.
 */

/** Le picto d'un personnage — le composant est choisi par son nom, dans la charte. */
export type PictoPersonnage =
  | 'coeur'
  | 'etoile'
  | 'billet'
  | 'parchemin'
  | 'fourchette'
  | 'verre'
  | 'gateau'
  | 'disque'
  | 'musique'
  | 'camera'
  | 'film'
  | 'ampoule'
  | 'fleur'
  | 'volant'
  | 'plume'
  | 'valise'
  | 'agenda';

export interface Personnage {
  /** L'identifiant du rôle, dans la taxonomie du site. */
  id: string;
  /** Le nom du personnage, écrit court : « SUPER MARIÉS ». */
  nom: string;
  /** Le titre du rôle dans la taxonomie : « Les Mariés ». */
  titre: string;
  /** Ce qu'il dit de lui-même, à la première personne, en une ligne. */
  phrase: string;
  /** Les entrées de son espace : c'est ça, la démonstration. */
  entrees: string[];
  /** Le visuel du hero. */
  image: string;
  /** La famille du rôle : Protagonistes, Musique & Live… */
  famille: string;
  picto: PictoPersonnage;
}

interface Voix {
  nom: string;
  phrase: string;
  entrees: string[];
  picto: PictoPersonnage;
}

/**
 * Ce que chaque rôle dit, et ce que son espace propose.
 *
 * L'ordre est celui du parcours : les mariés d'abord, puis les invités, puis les
 * métiers — donc l'ordre d'entrée dans la journée.
 */
const VOIX: Record<string, Voix> = {
  maries: {
    nom: 'SUPER MARIÉS',
    phrase: 'Je prépare le plus beau jour — les moments, les invités, les souvenirs.',
    entrees: ['Invités', 'Planning', 'Lieu', 'Playlist', 'Photos'],
    picto: 'coeur',
  },
  invites: {
    nom: 'SUPER INVITÉ',
    phrase: 'Je réponds, je prends ma part, je vis le jour J.',
    entrees: ['Invitation', 'Ma part', 'Playlist', 'Photos', 'Souvenirs'],
    picto: 'billet',
  },
  temoin: {
    nom: 'SUPER TÉMOIN',
    phrase: 'J’accompagne, et je prends la parole.',
    entrees: ['Discours', 'Moments', 'Invités', 'Photos'],
    picto: 'etoile',
  },
  officiant: {
    nom: 'SUPER OFFICIANT',
    phrase: 'Je conduis la cérémonie.',
    entrees: ['Cérémonie', 'Texte', 'Horaires', 'Contact'],
    picto: 'parchemin',
  },
  traiteur: {
    nom: 'SUPER TRAITEUR',
    phrase: 'Je nourris la journée, du cocktail au dessert.',
    entrees: ['Menu', 'Convives', 'Service', 'Horaires'],
    picto: 'fourchette',
  },
  mixologue: {
    nom: 'SUPER BARMAN',
    phrase: 'Je tiens le bar, du premier verre au dernier.',
    entrees: ['Cartes', 'Bar', 'Stocks', 'Horaires'],
    picto: 'verre',
  },
  patissier: {
    nom: 'SUPER PÂTISSIER',
    phrase: 'Je fais le gâteau, et ce qu’il y a autour.',
    entrees: ['Gâteau', 'Desserts', 'Moment', 'Livraison'],
    picto: 'gateau',
  },
  dj: {
    nom: 'SUPER DJ',
    phrase: 'Je fais danser jusqu’au bout de la nuit.',
    entrees: ['Playlist', 'Horaires', 'Régie', 'Demandes'],
    picto: 'disque',
  },
  saxophoniste: {
    nom: 'SUPER MUSICIEN',
    phrase: 'J’accompagne les émotions, du cocktail au coucher du soleil.',
    entrees: ['Horaires', 'Setlist', 'Installation', 'Contact'],
    picto: 'musique',
  },
  light_designer: {
    nom: 'SUPER LUMIÈRE',
    phrase: 'J’éclaire la scène, la table et la piste.',
    entrees: ['Plan lumière', 'Scène', 'Piste', 'Régie'],
    picto: 'ampoule',
  },
  photographe: {
    nom: 'SUPER PHOTOGRAPHE',
    phrase: 'Je documente les souvenirs du mariage.',
    entrees: ['Moments', 'Photos', 'Galerie', 'Livraison'],
    picto: 'camera',
  },
  videaste: {
    nom: 'SUPER VIDÉASTE',
    phrase: 'Je filme le jour comme il se vit.',
    entrees: ['Moments', 'Rushs', 'Film', 'Livraison'],
    picto: 'film',
  },
  fleuriste: {
    nom: 'SUPER FLEURISTE',
    phrase: 'J’habille les lieux, du bouquet aux tables.',
    entrees: ['Compositions', 'Lieux', 'Saison', 'Installation'],
    picto: 'fleur',
  },
  navette_chauffeur: {
    nom: 'SUPER CHAUFFEUR',
    phrase: 'Je conduis les invités, et les mariés.',
    entrees: ['Trajets', 'Horaires', 'Invités', 'Contact'],
    picto: 'volant',
  },
  wedding_planner: {
    nom: 'SUPER PLANNER',
    phrase: 'J’orchestre les heures et les équipes.',
    entrees: ['Planning', 'Équipes', 'Lieux', 'Alertes'],
    picto: 'agenda',
  },
  notaire_juriste: {
    nom: 'SUPER NOTAIRE',
    phrase: 'Je sécurise les papiers et les dates.',
    entrees: ['Contrats', 'Dates', 'Pièces', 'Contact'],
    picto: 'plume',
  },
  concierge_voyage: {
    nom: 'SUPER CONCIERGE',
    phrase: 'J’organise le voyage et les nuits.',
    entrees: ['Voyage', 'Nuits', 'Transferts', 'Contact'],
    picto: 'valise',
  },
};

/** L'ordre du parcours : les mariés, les invités, puis les métiers. */
const ORDRE = [
  'maries',
  'invites',
  'temoin',
  'officiant',
  'traiteur',
  'mixologue',
  'patissier',
  'dj',
  'saxophoniste',
  'photographe',
  'videaste',
  'light_designer',
  'fleuriste',
  'navette_chauffeur',
  'wedding_planner',
  'notaire_juriste',
  'concierge_voyage',
];

/**
 * Les personnages du site : **tous les rôles de la taxonomie**, dans l'ordre du
 * parcours. Un rôle sans voix écrite garde la sienne à défaut — jamais de trou.
 */
export const PERSONNAGES: Personnage[] = ORDRE.map((id) => {
  const role = FULL_ROLES_TAXONOMY.find((r) => r.id === id);
  const voix = VOIX[id];
  if (!role || !voix) return null;
  return {
    id,
    nom: voix.nom,
    titre: role.title,
    phrase: voix.phrase,
    entrees: voix.entrees,
    image: role.heroImage,
    famille: role.categoryLabel,
    picto: voix.picto,
  };
}).filter((p): p is Personnage => Boolean(p));

export function personnageParId(id: string): Personnage | undefined {
  return PERSONNAGES.find((p) => p.id === id);
}

/**
 * Ce que le hero montre : le visuel d'un personnage, et son nom. Le hero ne sait
 * rien des rôles, il ne fait que les traverser.
 */
export const VISUELS_DU_HERO = PERSONNAGES.map((p) => ({ id: p.id, image: p.image, nom: p.nom }));
