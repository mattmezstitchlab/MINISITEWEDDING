/**
 * BANDE ORIGINALE DU JOUR J
 *
 * Chaque moment du programme peut porter un morceau. Les fichiers sont réels :
 * ils vivent dans `public/audio/` et sont lus par la carte musicale — ce n'est
 * pas une illustration, c'est le son.
 *
 * Le rapprochement se fait sur les mots du moment (« cérémonie », « cocktail »,
 * « ouverture de bal »…) : n'importe quel mariage, dans n'importe quel univers,
 * trouve donc sa bande-son sans configuration.
 */

import type { ProgrammeEvent } from './types';

export interface Track {
  /** Titre annoncé sur la carte. */
  title: string;
  /** Ce qu'on entend, en une ligne. */
  subtitle: string;
  /** Fichier servi depuis `public/audio/`. */
  src: string;
  /** Visuel de la carte. */
  cover: string;
}

interface Entry {
  keys: string[];
  track: Track;
}

const LIBRARY: Entry[] = [
  {
    keys: ['entree', 'arrivee', 'accueil', 'installation', 'preparatif', 'habillage'],
    track: {
      title: 'L’arrivée des invités',
      subtitle: 'Une entrée qui met tout le monde à l’aise',
      src: '/audio/entree-cant-stop.wav',
      cover: '/images/terrasse.jpg',
    },
  },
  {
    keys: ['ceremonie', 'voeux', 'alliance', 'mairie', 'civil', 'laique', 'rituel', 'officiant'],
    track: {
      title: 'La cérémonie',
      subtitle: 'Le moment où l’on ne respire plus',
      src: '/audio/ceremonie-elvis.wav',
      cover: '/images/bouquet.jpg',
    },
  },
  {
    keys: ['cocktail', 'aperitif', 'champagne', 'vin d honneur', 'golden'],
    track: {
      title: 'Cocktail & golden hour',
      subtitle: 'Les verres, les retrouvailles, la lumière',
      src: '/audio/cocktail-valerie.wav',
      cover: '/images/champagne.jpg',
    },
  },
  {
    keys: ['dinatoire', 'cocktail dinatoire', 'saxo', 'jazz'],
    track: {
      title: 'Set live & dégustation',
      subtitle: 'Un saxophone au milieu des conversations',
      src: '/audio/cocktail-kungs.wav',
      cover: '/images/noir-blanc.jpg',
    },
  },
  {
    keys: ['diner', 'dinatoire', 'repas', 'banquet', 'discours', 'toast', 'table'],
    track: {
      title: 'Dîner & discours',
      subtitle: 'Le fond sonore qui laisse parler les voix',
      src: '/audio/diner-sinatra.wav',
      cover: '/images/table-noir.jpg',
    },
  },
  {
    keys: ['gateau', 'piece montee', 'dessert', 'patisserie'],
    track: {
      title: 'La pièce montée',
      subtitle: 'Tout le monde dehors ou debout',
      src: '/audio/gateau-coldplay.wav',
      cover: '/images/champagne.jpg',
    },
  },
  {
    keys: ['bal', 'danse', 'premiere danse', 'ouverture de bal', 'valse'],
    track: {
      title: 'Ouverture de bal',
      subtitle: 'Votre première danse, celle qu’on garde',
      src: '/audio/danse-perfect.wav',
      cover: '/images/danse.jpg',
    },
  },
  {
    keys: ['soiree', 'fete', 'dj', 'dancefloor', 'piste'],
    track: {
      title: 'La soirée',
      subtitle: 'La piste qui ne se vide plus',
      src: '/audio/dancefloor-whitney.wav',
      cover: '/images/club-amour.jpg',
    },
  },
  {
    keys: ['club', 'nuit', 'club', 'banger', 'electro'],
    track: {
      title: 'Fin de nuit',
      subtitle: 'Quand la salle devient un club',
      src: '/audio/club-daftpunk.wav',
      cover: '/images/club-strobe-kiss.jpg',
    },
  },
  {
    keys: ['brunch', 'lendemain', 'depart', 'au revoir', 'retour'],
    track: {
      title: 'Le lendemain',
      subtitle: 'Le dernier disque avant les adieux',
      src: '/audio/soul-at-last.wav',
      cover: '/images/garden.jpg',
    },
  },
  {
    keys: ['artifice', 'climax', 'fin de soiree', 'cloture'],
    track: {
      title: 'Le final',
      subtitle: 'La bande-son des images qu’on n’oubliera pas',
      src: '/audio/closing-m83.wav',
      cover: '/images/foret-noire.jpg',
    },
  },
];

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ');
}

/**
 * Le morceau qui correspond à un texte, ou `null` si le moment se vit en
 * silence. Un même mariage ne reçoit jamais deux fois le même morceau.
 */
export function trackForText(text: string, used: string[] = []): Track | null {
  const haystack = normalize(text);
  for (const entry of LIBRARY) {
    if (used.includes(entry.track.src)) continue;
    if (entry.keys.some((key) => haystack.includes(key))) return entry.track;
  }
  return null;
}

export function trackFor(event: ProgrammeEvent, used: string[] = []): Track | null {
  return trackForText(`${event.title} ${event.description ?? ''} ${event.place ?? ''}`, used);
}

/** Toute la bande-son d'un site, dans l'ordre du programme, sans doublon. */
export function soundtrackOf(programme: ProgrammeEvent[]): Map<number, Track> {
  const used: string[] = [];
  const map = new Map<number, Track>();
  for (const event of programme) {
    const track = trackFor(event, used);
    if (track) {
      used.push(track.src);
      map.set(event.id, track);
    }
  }
  return map;
}
