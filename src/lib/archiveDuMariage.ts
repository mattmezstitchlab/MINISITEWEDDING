import { DJ_CHRONOLOGICAL_PHASES, GLOBAL_WEDDING_PLAYLIST_FULL } from './weddingDjPlaylist';

/* L'ARCHIVE DU MARIAGE — LE PAPIER, ÉTALÉ
 *
 * La référence du 21 septembre 2026 est une **archive de papier** : un fond noir,
 * des objets posés en vrac — un ticket, un polaroïd, une carte postale, un
 * timbre, un sticker, une note — et, au milieu, un titre sérif immense posé
 * **par-dessus le désordre**. Puis des bandes d'images, légendées comme des
 * pièces d'archive (« Nom, Lieu / 1998 »).
 *
 * On ne prend pas leur marque, ni leurs mots, ni leurs objets à eux : on prend
 * **la composition** — et on la remplit avec notre papier, qui est déjà tout
 * ça : le ticket de caisse, la carte postale, le timbre, le sticker, le
 * polaroïd du jour, la bande de la musique. C'est la même matière que la
 * machine imprime, simplement **étalée sur la table**.
 *
 * Tout est déterministe : une même journée donne toujours le même collage.
 */

/* —————————————————————————— LA MUSIQUE DE LA NUIT —————————————————————————— */

export interface MomentDeLaNuit {
  id: string;
  /** Le moment, en un mot : `CÉRÉMONIE`, `COCKTAIL`… */
  mot: string;
  /** Son heure, quand le plan la donne : `16:00`. */
  heure: string;
  /** Les morceaux de ce moment. */
  pistes: typeof GLOBAL_WEDDING_PLAYLIST_FULL;
}

/**
 * **Les neuf moments de la nuit**, du premier au dernier : c'est le plan du DJ,
 * déroulé. Le désert, la cérémonie, le dîner, la pièce montée, le bal — ce que
 * la bande de papier porte dans le collage, et ce que le ticket imprime.
 */
export const MOMENTS_DE_LA_NUIT: MomentDeLaNuit[] = DJ_CHRONOLOGICAL_PHASES.filter((p) => p.id !== 'all').map(
  (phase) => {
    const horaire = phase.label.match(/\((\d{1,2})h(\d{2})\)/);
    return {
      id: phase.id,
      mot: phase.label.replace(/^\d+\.\s*/, '').replace(/\s*\([^)]*\)\s*$/, '').toUpperCase(),
      heure: horaire ? `${horaire[1]}:${horaire[2]}` : '',
      pistes: GLOBAL_WEDDING_PLAYLIST_FULL.filter((t) => t.phase === phase.id),
    };
  },
);

/* ———————————————————— LE PAPIER ÉTALÉ SUR LA COUVERTURE ———————————————————— */

export type GenreDePapier = 'ticket' | 'photo' | 'carte' | 'timbre' | 'sticker' | 'note' | 'bande' | 'code';

export interface PapierÉtalé {
  id: string;
  genre: GenreDePapier;
  /** **Ce qui est écrit dessus**, en un mot ou deux. */
  mot: string;
  /** La ligne du dessous, quand il y en a une. */
  sous?: string;
  /** L'image, pour les papiers qui en portent une. */
  image?: string;
  /** Ce qu'il ouvre quand on clique : une bande de la page, ou le mini-site. */
  vers?: string;
  /** Où il tombe, en pour cent de la bande : `x`, `y`, et son inclinaison. */
  x: number;
  y: number;
  tour: number;
  /** Sa largeur, en pour cent de la bande. */
  largeur: number;
}

/**
 * **Le collage de la couverture** : huit papiers, posés de travers, autour du
 * titre. Ce ne sont pas des décorations — chacun dit quelque chose du mariage,
 * et chacun **ouvre ce qu'il annonce** quand on clique dessus :
 *
 * - le **ticket** (le reçu du mariage) mène au ticket plein écran ;
 * - le **polaroïd** du jour mène au visuel du jour ;
 * - la **carte postale** mène au voyage ;
 * - la **bande de la musique** mène au plan de la nuit ;
 * - le **timbre**, le **sticker**, la **note** des objets et le **code** disent
 *   la matière, sans mener ailleurs : ils sont l'archive elle-même.
 */
export function papiersDeLaCouverture(visuelDuJour: string | null, code: string): PapierÉtalé[] {
  return [
    {
      id: 'timbre',
      genre: 'timbre',
      mot: 'TIMBRE',
      sous: 'ce qui affranchit',
      x: 6,
      y: 5,
      tour: -9,
      largeur: 17,
    },
    {
      id: 'note-objets',
      genre: 'note',
      mot: 'TAMPON · TIMBRE · CARTE',
      sous: 'sept objets, sept marques',
      vers: '#l-appareil',
      x: 27,
      y: 2,
      tour: 5,
      largeur: 26,
    },
    ...(visuelDuJour
      ? [
          {
            id: 'polaroïd-du-jour',
            genre: 'photo' as GenreDePapier,
            mot: 'LE JOUR',
            sous: 'le mariage, tel qu’il est',
            image: visuelDuJour,
            vers: '#le-visuel',
            x: 60,
            y: 2,
            tour: 3,
            largeur: 27,
          },
        ]
      : []),
    {
      id: 'carte-postale',
      genre: 'carte',
      mot: 'CARTE POSTALE',
      sous: 'le voyage, écrit le jour même',
      image: '/images/desert-star-dance.jpg',
      vers: '#l-appareil',
      x: 84,
      y: 8,
      tour: -7,
      largeur: 23,
    },
    {
      id: 'ticket-du-mariage',
      genre: 'ticket',
      mot: 'LE TICKET',
      sous: code,
      vers: '#le-ticket-plein',
      x: 5,
      y: 55,
      tour: -4,
      largeur: 25,
    },
    {
      id: 'bande-musique',
      genre: 'bande',
      mot: 'LA NUIT, EN MUSIQUE',
      sous: 'neuf moments, seize morceaux',
      vers: '#le-ticket-plein',
      x: 36,
      y: 68,
      tour: 2.5,
      largeur: 40,
    },
    {
      id: 'sticker-fluo',
      genre: 'sticker',
      mot: 'PAYÉ',
      sous: 'et bon voyage',
      x: 84,
      y: 52,
      tour: 11,
      largeur: 14,
    },
    {
      id: 'code-du-mariage',
      genre: 'code',
      mot: code,
      sous: 'le code du mariage',
      x: 78,
      y: 80,
      tour: -6,
      largeur: 25,
    },
  ];
}

/* —————————————————— LES POLAROÏDS : LES DÉCORS DE LA SEMAINE —————————————————— */

export interface Polaroïd {
  id: string;
  /** L'image, ou `null` quand la bibliothèque n'a pas encore livré la pièce. */
  image: string | null;
  /** La première ligne de la légende, comme un nom de lieu. */
  lieu: string;
  /** La seconde : l'année, la semaine, le repère. */
  repere: string;
  /** L'inclinaison du polaroïd : deux voisins ne penchent jamais du même côté. */
  tour: number;
}

/** Les légendes des polaroïds tiennent en deux lignes, comme une archive. */
export function legendeDuPolaroïd(lieu: string, repere: string): string {
  return `${lieu} / ${repere}`;
}
