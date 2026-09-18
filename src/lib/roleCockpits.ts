/**
 * COCKPITS PAR RÔLE — source unique
 *
 * Rebranche trois pièces qui existaient séparément et n'étaient reliées à rien :
 *  1. `UNIVERSAL_ROLES` (bidirectionalAlignmentEngine) : qui parle, et ce qu'il vient faire ;
 *  2. `INITIAL_TIMELINE_ITEMS.visibility` (timelineTheaterEngine) : ce que chaque rôle a le droit de voir ;
 *  3. `public/audio/*.wav` : un vrai morceau par moment.
 *
 * Règle d'or : la timeline est UNE seule. Chaque rôle en voit une projection
 * filtrée par `visibility`. Rien n'est dupliqué, rien n'est inventé.
 */

import { UNIVERSAL_ROLES, type UniversalRoleType } from './bidirectionalAlignmentEngine';
import {
  INITIAL_TIMELINE_ITEMS,
  type TimelineTrackItem,
  type ViewerPerspective,
} from './timelineTheaterEngine';

export interface CockpitNotification {
  label: string;
  kind: 'ok' | 'warn' | 'info';
}

export interface CockpitTrack {
  title: string;
  subtitle: string;
  cover: string;
  /** Fichier servi depuis `public/audio/` — lecture réelle, pas une illustration. */
  src: string;
}

export interface RoleCockpit {
  /** À quelle projection de la timeline ce rôle a droit. */
  perspective: ViewerPerspective;
  /** Le moment sur lequel ce rôle ouvre son écran. */
  focusMomentId: string;
  heroImage: string;
  notifications: CockpitNotification[];
  track: CockpitTrack;
}

const MOMENTS: TimelineTrackItem[] = INITIAL_TIMELINE_ITEMS.filter((m) => m.mode === 'jour-j');

export const ROLE_COCKPITS: Record<UniversalRoleType, RoleCockpit> = {
  couple: {
    perspective: 'couple',
    focusMomentId: 'jj-2',
    heroImage: '/images/chateau-terrasse-champagne.jpg',
    notifications: [
      { label: 'RSVP · 84 / 92 réponses', kind: 'ok' },
      { label: 'Conducteur traiteur validé', kind: 'ok' },
      { label: '2 devis en attente de signature', kind: 'warn' },
    ],
    track: {
      title: 'Entrée des mariés',
      subtitle: 'Le morceau que vous avez choisi',
      cover: '/images/alliances.jpg',
      src: '/audio/entree-cant-stop.wav',
    },
  },
  guest: {
    perspective: 'guest',
    focusMomentId: 'jj-3',
    heroImage: '/images/chateau-bengale-bal.jpg',
    notifications: [
      { label: 'Votre table : n° 7', kind: 'info' },
      { label: 'Navette depuis Aix · 14h00', kind: 'info' },
      { label: 'Album partagé ouvert', kind: 'ok' },
    ],
    track: {
      title: 'Cocktail & golden hour',
      subtitle: 'Ce qui vous attend à 17h30',
      cover: '/images/champagne.jpg',
      src: '/audio/cocktail-valerie.wav',
    },
  },
  temoin: {
    perspective: 'vendor',
    focusMomentId: 'jj-4',
    heroImage: '/images/danse.jpg',
    notifications: [
      { label: 'Discours : 4 min réservées à 20h45', kind: 'ok' },
      { label: 'Surprise calée avec le DJ', kind: 'ok' },
      { label: 'Canal privé — masqué aux mariés', kind: 'warn' },
    ],
    track: {
      title: 'Dîner & toasts',
      subtitle: 'Le moment de votre discours',
      cover: '/images/table-noir.jpg',
      src: '/audio/diner-sinatra.wav',
    },
  },
  officiant: {
    perspective: 'vendor',
    focusMomentId: 'jj-2',
    heroImage: '/images/bouquet.jpg',
    notifications: [
      { label: 'Texte des vœux reçu', kind: 'ok' },
      { label: 'Musique d’entrée validée', kind: 'ok' },
      { label: 'Répétition 15h30 · salon', kind: 'info' },
    ],
    track: {
      title: 'Cérémonie',
      subtitle: 'Entrée, lectures, alliances',
      cover: '/images/alliances.jpg',
      src: '/audio/ceremonie-elvis.wav',
    },
  },
  traiteur: {
    perspective: 'vendor',
    focusMomentId: 'jj-4',
    heroImage: '/images/table-noir.jpg',
    notifications: [
      { label: 'Envoi des plats calé sur le DJ', kind: 'ok' },
      { label: '3 régimes à couvrir · 1 sans gluten', kind: 'warn' },
      { label: 'Cuisine mobile · branchement 16A', kind: 'info' },
    ],
    track: {
      title: 'Pièce montée',
      subtitle: 'Sortie salle, calée au minuteur',
      cover: '/images/champagne.jpg',
      src: '/audio/gateau-coldplay.wav',
    },
  },
  dj_sax: {
    perspective: 'vendor',
    focusMomentId: 'jj-5',
    heroImage: '/images/club-amour.jpg',
    notifications: [
      { label: 'Micro HF · test à 17h00', kind: 'ok' },
      { label: 'Golden hour · 18h12', kind: 'info' },
      { label: 'Set 3h30 + rappel négocié', kind: 'ok' },
    ],
    track: {
      title: 'Ouverture du bal',
      subtitle: '125 BPM · montée progressive',
      cover: '/images/danse.jpg',
      src: '/audio/dancefloor-whitney.wav',
    },
  },
  photo: {
    perspective: 'vendor',
    focusMomentId: 'jj-1',
    heroImage: '/images/noir-blanc-entree.jpg',
    notifications: [
      { label: 'Golden hour · 18h12 → 18h40', kind: 'info' },
      { label: 'Photos de groupe après la cérémonie', kind: 'ok' },
      { label: 'Galeries livrées à J+21', kind: 'info' },
    ],
    track: {
      title: 'Fin de soirée',
      subtitle: 'Dernières images avant le départ',
      cover: '/images/foret-noire.jpg',
      src: '/audio/closing-m83.wav',
    },
  },
};

export interface RoleMoment {
  moment: TimelineTrackItem;
  /** Vrai si ce rôle n'a pas le droit de voir ce moment. */
  locked: boolean;
}

/** La timeline filtrée d'un rôle : le même jour pour tous, chaque ligne à sa place. */
export function momentsForRole(role: UniversalRoleType): RoleMoment[] {
  const cockpit = ROLE_COCKPITS[role];
  return MOMENTS.map((moment) => ({
    moment,
    locked: !moment.visibility.includes(cockpit.perspective),
  }));
}

export { UNIVERSAL_ROLES, MOMENTS };
