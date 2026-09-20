/**
 * LES SEPT CHAPITRES — LA STRUCTURE ÉDITORIALE D'AIME MAGAZINE
 *
 * Le modèle a changé, et il tient en une ligne :
 *
 * ```
 * 365 jours → 54 semaines → 54 magazines → 7 chapitres par magazine
 * ```
 *
 * Une date ne commande plus un magazine à elle seule : elle **entre** dans un
 * magazine hebdomadaire et ouvre **l'un de ses sept chapitres**. Les sept
 * chapitres sont **toujours les mêmes, dans le même ordre** — c'est ce qui fait
 * qu'AIME MAGAZINE est un magazine, et non une suite d'images. Ce qui change
 * d'une semaine à l'autre, c'est **le traitement** : la lumière, la matière, le
 * pays, le geste (voir `directionsDuMagazine.ts`).
 *
 * Les noms de fichiers se déduisent d'ici, et de nulle part ailleurs :
 * `01-amoureux.jpg`, `02-style.jpg`, … `07-souvenirs.jpg`.
 */

export interface Chapitre {
  /** 1 à 7 — la position dans le magazine. */
  numero: number;
  /** L'identifiant, sans accent ni espace : `amoureux`. */
  id: string;
  /** Le préfixe du fichier, tel qu'il doit être nommé sur le disque. */
  fichier: string;
  /** Le titre écrit tel quel. */
  titre: string;
  /** Le titre court, pour les pastilles. */
  court: string;
  /** Ce que le chapitre couvre, en une phrase — le territoire éditorial. */
  territoire: string;
  /** Les sujets qu'on y met, en clair. */
  sujets: string[];
  /** Ce que l'image du chapitre doit montrer : le brief, identique chaque semaine. */
  brief: string;
  /**
   * Le pont vers le mariage — ce que le chapitre doit toujours pouvoir
   * ramener. Le mariage est le territoire ; le chapitre est l'entrée.
   */
  pontMariage: string;
}

export const CHAPITRES: Chapitre[] = [
  {
    numero: 1,
    id: 'amoureux',
    fichier: '01-amoureux.jpg',
    titre: 'Les Amoureux',
    court: 'Amoureux',
    territoire: 'Couple, rencontre, engagement, famille, émotions, relations humaines.',
    sujets: ['le couple', 'la rencontre', 'l’engagement', 'la famille', 'les émotions', 'les liens'],
    brief:
      'un geste de couple ou de famille : deux personnes qui se cherchent, se retrouvent ou se tiennent — jamais une pose de mariés, jamais un visage qui regarde l’objectif',
    pontMariage:
      'le mariage commence ici : une rencontre, une décision, deux familles qui se rencontrent — avant toute décoration',
  },
  {
    numero: 2,
    id: 'style',
    fichier: '02-style.jpg',
    titre: 'Le Style',
    court: 'Style',
    territoire: 'Robe, costume, beauté, coiffure, bijoux, accessoires, fleurs, mode.',
    sujets: ['la robe', 'le costume', 'la matière', 'le bijou', 'la fleur portée', 'la coiffure'],
    brief:
      'une matière ou une pièce portée, cadrée serré : le tissu, la coupe, la main, le bijou — le vêtement avant la personne, jamais un essayage de boutique',
    pontMariage:
      'ce qu’on porte le jour du mariage se choisit des mois avant : ici on regarde la matière, la coupe et la lumière, pas la tenue complète',
  },
  {
    numero: 3,
    id: 'lieux',
    fichier: '03-lieux.jpg',
    titre: 'Les Lieux',
    court: 'Lieux',
    territoire: 'Châteaux, maisons, hôtels, villes, campagnes, plages, architectures, destinations.',
    sujets: ['le château', 'la maison', 'l’hôtel', 'la ville', 'la campagne', 'la côte'],
    brief:
      'une architecture ou un paysage vide, cadré large : la lumière qui décide, l’échelle humaine par un détail — une chaise, une porte, un escalier — jamais une façade de carte postale',
    pontMariage:
      'on se marie quelque part : un lieu vide dit mieux qu’une salle remplie ce qu’une journée peut y devenir',
  },
  {
    numero: 4,
    id: 'recevoir',
    fichier: '04-recevoir.jpg',
    titre: 'L’Art de recevoir',
    court: 'Recevoir',
    territoire: 'Tables, gastronomie, pâtisserie, fleurs, décoration, objets, art de la table.',
    sujets: ['la table', 'le plat', 'le dessert', 'les fleurs', 'la vaisselle', 'les objets'],
    brief:
      'une table ou un plat, cadré serré : la matière, la vaisselle dépareillée, le geste de service — de la vraie nourriture, jamais un buffet décoratif',
    pontMariage:
      'le repas est le seul moment dont tout le monde se souvient : on regarde la table, pas la salle',
  },
  {
    numero: 5,
    id: 'fete',
    fichier: '05-fete.jpg',
    titre: 'La Fête',
    court: 'Fête',
    territoire: 'Musique, danse, DJ, scène, lumière, cocktails, nuit, spectacle.',
    sujets: ['la musique', 'la danse', 'la scène', 'les lumières', 'les cocktails', 'la nuit'],
    brief:
      'un moment de nuit : lumière crue ou fumerolle, mouvement capté court, instrument, piste ou bar — la fête en train de se faire, jamais une pose de groupe',
    pontMariage:
      'la soirée est le cœur battant de la journée : ce qui reste quand le protocole est fini',
  },
  {
    numero: 6,
    id: 'monde',
    fichier: '06-monde.jpg',
    titre: 'Le Monde',
    court: 'Monde',
    territoire: 'Cultures, traditions, voyages, patrimoine, peuples, cérémonies, mariages internationaux.',
    sujets: ['la culture', 'la tradition', 'le voyage', 'le patrimoine', 'les peuples', 'les cérémonies'],
    brief:
      'une culture ou une tradition en situation : un geste rituel, un costume porté, un artisanat, un marché — documenté et respectueux, jamais exotisé',
    pontMariage:
      'un mariage parle toujours d’un endroit et d’une famille : ici, ce que les peuples font, et ce qu’on peut en apprendre',
  },
  {
    numero: 7,
    id: 'souvenirs',
    fichier: '07-souvenirs.jpg',
    titre: 'Les Souvenirs',
    court: 'Souvenirs',
    territoire: 'Photographie, vidéo, albums, lettres, objets, archives, transmission, mémoire.',
    sujets: ['la photographie', 'le film', 'l’album', 'les lettres', 'les objets', 'la transmission'],
    brief:
      'une archive en train de se faire : tirages, négatifs, carnet écrit, objet transmis, boîte ouverte — la trace, pas la mise en scène de la trace',
    pontMariage:
      'ce qui traverse les générations : une photo, une lettre, un objet qu’on donne le jour du mariage',
  },
];

/** Les sept chapitres, dans l'ordre — la seule façon de les parcourir. */
export const NUMEROS_DE_CHAPITRE = CHAPITRES.map((c) => c.numero);

/** Le chapitre d'un numéro (1 à 7), ou `null` s'il n'existe pas. */
export function chapitreParNumero(numero: number): Chapitre | null {
  return CHAPITRES.find((c) => c.numero === numero) ?? null;
}

/** Le chapitre d'un identifiant (`amoureux`, `style`, …). */
export function chapitreParId(id: string): Chapitre | null {
  return CHAPITRES.find((c) => c.id === id) ?? null;
}

/** Le chapitre d'un nom de fichier (`04-recevoir.jpg`). */
export function chapitreParFichier(fichier: string): Chapitre | null {
  return CHAPITRES.find((c) => c.fichier === fichier) ?? null;
}

/**
 * Le chapitre d'une position dans la semaine : **1 → 01 Les Amoureux**, 7 → 07
 * Les Souvenirs. La position est bornée : un jour de trop (les jokers) retombe
 * toujours sur un chapitre valide.
 */
export function chapitreDeLaPosition(position: number): Chapitre {
  const n = Math.min(7, Math.max(1, Math.round(position)));
  return CHAPITRES[n - 1]!;
}

/** Le chapitre suivant, dans l'ordre — et le premier après le septième. */
export function chapitreSuivant(numero: number): Chapitre {
  return CHAPITRES[numero % 7]!;
}

/** Le chapitre précédent — et le septième avant le premier. */
export function chapitrePrecedent(numero: number): Chapitre {
  return CHAPITRES[(numero + 5) % 7]!;
}
