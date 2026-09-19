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
  /** Combien de personnes cette carte peut porter : une, deux, ou plus. */
  places: number;
}

interface Voix {
  nom: string;
  phrase: string;
  entrees: string[];
  picto: PictoPersonnage;
  /** Le rôle de la taxonomie dont ce personnage prend le visuel et la famille. */
  suit?: string;
  /** Le visuel, quand ce n'est pas celui du rôle suivi. */
  image?: string;
  /** Le titre de la carte, quand ce n'est pas celui du rôle suivi. */
  titre?: string;
  /** Combien de personnes la carte peut porter — 1 par défaut, 2 pour un duo. */
  places?: number;
}

/** Les entrées d'un couple : les mêmes pour les mariés et les futurs mariés. */
const ENTREES_MARIES = ['Invités', 'Planning', 'Lieu', 'Playlist', 'Photos'];

/** Les entrées d'un invité : la famille les a aussi. */
const ENTREES_INVITES = ['Invitation', 'Ma part', 'Playlist', 'Photos', 'Souvenirs'];

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
    entrees: ENTREES_MARIES,
    picto: 'coeur',
    places: 2,
  },

  /* ——— LES MARIÉS, ET CEUX QUI LE SERONT ———
   *
   * Le site sépare **ceux qui sont déjà passés par là** de **ceux qui préparent**
   * : les premiers racontent, les seconds cherchent. Et **une carte peut porter
   * une personne ou deux** : « SUPER MARIÉ » est à quelqu'un, « SUPER MARIÉS » à
   * deux. C'est la même journée, vue d'une tête ou de deux. */
  marie: {
    nom: 'SUPER MARIÉ',
    phrase: 'Je suis passé par là — je raconte ce qui compte vraiment.',
    entrees: ENTREES_MARIES,
    picto: 'coeur',
    suit: 'maries',
    image: '/images/alliances.jpg',
    titre: 'Marié',
    places: 1,
  },
  mariee: {
    nom: 'SUPER MARIÉE',
    phrase: 'Je suis passée par là — je raconte ce qui compte vraiment.',
    entrees: ENTREES_MARIES,
    picto: 'coeur',
    suit: 'maries',
    image: '/images/bouquet.jpg',
    titre: 'Mariée',
    places: 1,
  },
  mariees: {
    nom: 'SUPER MARIÉES',
    phrase: 'Nous sommes mariées — on raconte la journée à deux voix.',
    entrees: ENTREES_MARIES,
    picto: 'coeur',
    suit: 'maries',
    image: '/images/noir-blanc-entree.jpg',
    titre: 'Mariées',
    places: 2,
  },
  maries_e: {
    nom: 'SUPER MARIÉ·E·S',
    phrase: 'Nous sommes marié·e·s — deux versions de la même journée.',
    entrees: ENTREES_MARIES,
    picto: 'coeur',
    suit: 'maries',
    image: '/images/danse.jpg',
    titre: 'Marié·e·s',
    places: 2,
  },
  futur_marie: {
    nom: 'SUPER FUTUR MARIÉ',
    phrase: 'Je prépare le jour où je dirai oui.',
    entrees: ENTREES_MARIES,
    picto: 'coeur',
    suit: 'maries',
    image: '/images/hero-wedding.jpg',
    titre: 'Futur marié',
    places: 1,
  },
  future_mariee: {
    nom: 'SUPER FUTURE MARIÉE',
    phrase: 'Je prépare le jour où je dirai oui.',
    entrees: ENTREES_MARIES,
    picto: 'coeur',
    suit: 'maries',
    image: '/images/zero-contrainte-wedding.jpg',
    titre: 'Future mariée',
    places: 1,
  },
  futurs_maries: {
    nom: 'SUPER FUTURS MARIÉS',
    phrase: 'Nous préparons le jour où nous dirons oui.',
    entrees: ENTREES_MARIES,
    picto: 'coeur',
    suit: 'maries',
    image: '/images/phare-vows.jpg',
    titre: 'Futurs mariés',
    places: 2,
  },
  futures_mariees: {
    nom: 'SUPER FUTURES MARIÉES',
    phrase: 'Nous préparons le jour où nous dirons oui.',
    entrees: ENTREES_MARIES,
    picto: 'coeur',
    suit: 'maries',
    image: '/images/chateau-tilleuls.jpg',
    titre: 'Futures mariées',
    places: 2,
  },
  futurs_maries_e: {
    nom: 'SUPER FUTUR·E·S MARIÉ·E·S',
    phrase: 'Nous préparons le jour, à deux — et depuis deux histoires.',
    entrees: ENTREES_MARIES,
    picto: 'coeur',
    suit: 'maries',
    image: '/images/last-minute.jpg',
    titre: 'Futur·e·s marié·e·s',
    places: 2,
  },
  famille: {
    nom: 'SUPER FAMILLE',
    phrase: 'Je fais partie de la famille — je viens, j’aide, je suis là.',
    entrees: ENTREES_INVITES,
    picto: 'coeur',
    suit: 'invites',
    image: '/images/reunion.jpg',
    titre: 'Famille',
    places: 1,
  },
  invites: {
    nom: 'SUPER INVITÉ',
    phrase: 'Je réponds, je prends ma part, je vis le jour J.',
    entrees: ENTREES_INVITES,
    picto: 'billet',
    places: 1,
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

/** L'ordre du parcours : les personnes, puis les métiers du jour J. */
const ORDRE = [
  'maries',
  'marie',
  'mariee',
  'mariees',
  'maries_e',
  'futur_marie',
  'future_mariee',
  'futurs_maries',
  'futures_mariees',
  'futurs_maries_e',
  'famille',
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
  const voix = VOIX[id];
  if (!voix) return null;
  const role = FULL_ROLES_TAXONOMY.find((r) => r.id === (voix.suit ?? id));
  if (!role) return null;
  return {
    id,
    nom: voix.nom,
    titre: voix.titre ?? role.title,
    phrase: voix.phrase,
    entrees: voix.entrees,
    image: voix.image ?? role.heroImage,
    famille: role.categoryLabel,
    picto: voix.picto,
    places: voix.places ?? 1,
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

/* ————————————————————— LES TITRES DU GÉNÉRIQUE ————————————————————— */

/**
 * LE PREMIER NIVEAU : UN TITRE, PUIS LES CARTES
 *
 * L'accueil ne demande plus « qui êtes-vous ? » d'un bloc : il ouvre un
 * **titre** — une grande famille — et sous ce titre, **les cartes à choisir**.
 * « SUPER PRESTATAIRE » ouvre les domaines de métiers ; « SUPER MARIÉ(E) » et
 * « SUPER FUTUR MARIÉ(E) » ouvrent les variantes — un marié, une mariée, deux
 * mariés, deux mariées, un couple mixte ; « SUPER FAMILLE » et « SUPER TÉMOIN »
 * ouvrent les leurs. On ne demande pas qui on est : on le laisse se choisir, une
 * carte après l'autre.
 */
export interface TitreDuHero {
  id: string;
  /** Le nom écrit en grand : « SUPER PRESTATAIRE ». */
  nom: string;
  /** Ce que le titre regroupe, quand il faut en parler. */
  titre: string;
  image: string;
  picto: PictoPersonnage;
  /**
   * Vrai quand les cartes du titre sont des **domaines** de métiers : un clic
   * ouvre alors les métiers du domaine — le second niveau.
   */
  domaines?: boolean;
  /** Les cartes du premier niveau, quand ce sont des personnages. */
  cartes: string[];
}

export const TITRES: TitreDuHero[] = [
  {
    id: 'prestataire',
    nom: 'SUPER PRESTATAIRE',
    titre: 'Les prestataires',
    image: '/images/prestataires/chef.jpg',
    picto: 'fourchette',
    domaines: true,
    cartes: [],
  },
  {
    id: 'maries',
    nom: 'SUPER MARIÉ(E)',
    titre: 'Les mariés',
    image: '/images/couple-paris.jpg',
    picto: 'coeur',
    cartes: ['marie', 'mariee', 'maries', 'mariees', 'maries_e'],
  },
  {
    id: 'futurs',
    nom: 'SUPER FUTUR MARIÉ(E)',
    titre: 'Les futurs mariés',
    image: '/images/alliances.jpg',
    picto: 'coeur',
    cartes: ['futur_marie', 'future_mariee', 'futurs_maries', 'futures_mariees', 'futurs_maries_e'],
  },
  {
    id: 'famille',
    nom: 'SUPER FAMILLE',
    titre: 'La famille',
    image: '/images/reunion.jpg',
    picto: 'coeur',
    cartes: ['famille', 'invites'],
  },
  {
    id: 'temoin',
    nom: 'SUPER TÉMOIN',
    titre: 'Les témoins',
    image: '/images/noir-blanc.jpg',
    picto: 'etoile',
    cartes: ['temoin'],
  },
];

export function titreParId(id: string): TitreDuHero | undefined {
  return TITRES.find((t) => t.id === id);
}

/* ——————————————— LES DOMAINES DES PRESTATAIRES ——————————————— */

/**
 * LE SECOND NIVEAU : LES DOMAINES, PUIS LES MÉTIERS
 *
 * Un prestataire ne se choisit pas tout de suite : on ouvre **un domaine** —
 * « Réception & Bouche », « Image & Mémoire » — et l'on découvre les métiers qui
 * le font vivre. C'est là qu'on trouve ce qu'on n'était pas venu chercher.
 */
export interface DomainePrestataire {
  /** L'identifiant du domaine dans le hero. */
  key: string;
  label: string;
  /** Ce que le domaine ouvre : « 3 métiers ». */
  resume: string;
  image: string;
  /** Les métiers du domaine, par leur identifiant de personnage. */
  cartes: string[];
}

/** Les domaines du jour J, dans l'ordre de la journée. */
const DOMAINES_DU_JOUR: Array<{ key: string; label: string; cartes: string[] }> = [
  { key: 'reception', label: 'Réception & Bouche', cartes: ['traiteur', 'mixologue', 'patissier'] },
  { key: 'ceremonie', label: 'Cérémonie & Coordination', cartes: ['officiant'] },
  { key: 'musique', label: 'Musique & Live', cartes: ['dj', 'saxophoniste', 'light_designer'] },
  { key: 'image', label: 'Image & Mémoire', cartes: ['photographe', 'videaste'] },
  { key: 'style', label: 'Style & Scénographie', cartes: ['wedding_planner', 'fleuriste'] },
  { key: 'logistique', label: 'Logistique & Sécurité', cartes: ['navette_chauffeur'] },
  { key: 'transverse', label: 'Métiers Transverses', cartes: ['notaire_juriste', 'concierge_voyage'] },
];

export const DOMAINES_PRESTATAIRES: DomainePrestataire[] = DOMAINES_DU_JOUR.map((domaine) => {
  const gens = domaine.cartes
    .map((id) => PERSONNAGES.find((p) => p.id === id))
    .filter((p): p is Personnage => Boolean(p));
  return {
    ...domaine,
    resume: `${gens.length} métier${gens.length > 1 ? 's' : ''}`,
    image: gens[0]?.image ?? '/images/hero-wedding.jpg',
  };
});

export function domainePrestataire(key: string): DomainePrestataire | undefined {
  return DOMAINES_PRESTATAIRES.find((d) => d.key === key);
}

/** Le métier qui porte un domaine : le premier de ses gens. */
export function porteurDuDomaine(key: string): Personnage | undefined {
  const domaine = domainePrestataire(key);
  return domaine ? PERSONNAGES.find((p) => p.id === domaine.cartes[0]) : undefined;
}
