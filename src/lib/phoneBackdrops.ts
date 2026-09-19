import type { WeddingStyle } from './weddingStyles';

/**
 * LE FOND D'ÉCRAN DE CHAQUE UNIVERS
 *
 * Chaque téléphone prend l'atmosphère de son univers : un aplat floral pour les
 * mariages romantiques, un dessin botanique pour le végétal, une trame
 * graphique pour le minimal, un fond nocturne pour la nuit, un motif pop pour
 * les univers insolites. Le fond couvre tout l'écran, derrière le hero et les
 * modules — c'est ce qui fait ressortir chaque univers.
 */

const FONDS = {
  floral: '/images/fonds/fond-floral.jpg',
  botanique: '/images/fonds/fond-botanique.jpg',
  graphique: '/images/fonds/fond-graphique.jpg',
  abstrait: '/images/fonds/fond-abstrait.jpg',
  texture: '/images/fonds/fond-texture.jpg',
  nocturne: '/images/fonds/fond-nocturne.jpg',
  pop: '/images/fonds/fond-pop.jpg',
} as const;

export type FondId = keyof typeof FONDS;

/** Le fond choisi pour chaque univers, quand sa famille ne suffit pas. */
const PAR_UNIVERS: Record<string, FondId> = {
  traditionnel: 'floral',
  corse: 'texture',
  reunion: 'floral',
  'new-york': 'nocturne',
  vegas: 'pop',
  'noir-blanc': 'graphique',
  'chateau-moderne': 'botanique',
  brutal: 'graphique',
  club: 'nocturne',
  desert: 'texture',
  'garden-party': 'botanique',
  supermarche: 'pop',
  laverie: 'pop',
  'foret-noire': 'texture',
  cinema: 'nocturne',
  'rooftop-paris': 'nocturne',
  punk: 'pop',
  brocante: 'texture',
  cosmic: 'abstrait',
  'co-mariage': 'abstrait',
  abyssal: 'abstrait',
  'orient-express': 'texture',
  'phare-atlantique': 'botanique',
  'last-minute': 'abstrait',
};

/** Le repli, quand l'univers n'a pas de fond dédié : sa famille décide. */
const PAR_FAMILLE: Record<string, FondId> = {
  classique: 'floral',
  nature: 'botanique',
  minimal: 'graphique',
  urbain: 'nocturne',
  concept: 'abstrait',
  sauvage: 'texture',
};

export function fondPour(style: WeddingStyle): string {
  const id = PAR_UNIVERS[style.id] ?? (style.category ? PAR_FAMILLE[style.category] : undefined) ?? 'abstrait';
  return FONDS[id];
}
