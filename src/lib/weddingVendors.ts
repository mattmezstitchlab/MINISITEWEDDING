/**
 * LES PRESTATAIRES ASSOCIÉS À CHAQUE UNIVERS
 *
 * Chaque univers du catalogue dit déjà quels métiers il mobilise
 * (`humanMissions`). Ici, ces métiers deviennent des personnes : un portrait,
 * un nom, et ce qu'elles apportent. C'est ce qui s'affiche dans les cartes
 * d'univers — on ne montre plus une ambiance, on montre qui la réalise.
 *
 * Les portraits vivent dans `public/images/prestataires/`.
 */

import type { WeddingStyle } from './weddingStyles';

export interface Vendor {
  /** Le métier tel qu'il s'affiche sur la carte. */
  trade: string;
  /** Le métier complet, tel que décrit par l'univers. */
  role: string;
  name: string;
  /** Ce que ce prestataire apporte, en une ligne. */
  specialty: string;
  portrait: string;
  accent: string;
}

/**
 * Les familles de métiers. Le premier mot-clé trouvé dans le rôle décide du
 * portrait et de la promesse : inutile d'écrire une fiche pour chaque intitulé.
 */
const FAMILIES: Array<{ keywords: string[]; portrait: string; specialty: string; names: string[] }> = [
  {
    keywords: ['photograph', 'photo', 'videaste', 'video', 'ciné', 'cine', 'super 8', 'clip'],
    portrait: '/images/prestataires/photographe.jpg',
    specialty: 'Reportage, tirages et retouches',
    names: ['Camille Rousseau', 'Élodie Fontaine'],
  },
  {
    keywords: ['traiteur', 'chef', 'cuisine', 'gastronom', 'menu', 'tapas', 'food', 'brunch', 'pâtis', 'patis', 'boulanger'],
    portrait: '/images/prestataires/chef.jpg',
    specialty: 'Menus dégustés en amont, service au minuteur',
    names: ['Julien Mercier', 'Thomas Béranger'],
  },
  {
    keywords: ['dj', 'sound', 'son', 'musique', 'bpm', 'playlist', 'barista'],
    portrait: '/images/prestataires/dj.jpg',
    specialty: 'Set sur mesure, régie et micro HF',
    names: ['Marco Vidal', 'Sofiane Keïta'],
  },
  {
    keywords: ['fleur', 'botan', 'paysag', 'jardin', 'plant'],
    portrait: '/images/prestataires/fleuriste.jpg',
    specialty: 'Compositions de saison, montées sur place',
    names: ['Anna Delaunay', 'Claire Vasseur'],
  },
  {
    keywords: ['officiant', 'célébrant', 'celebrant', 'maire', 'prêtre', 'pretre', 'régisseur', 'regisseur', 'coordination', 'protocole'],
    portrait: '/images/prestataires/officiant.jpg',
    specialty: 'Tient le déroulé, de la première heure au départ',
    names: ['Olivier Blanchard', 'Hugo Lemaitre'],
  },
  {
    keywords: ['mixolog', 'cocktail', 'bar', 'bulle', 'champagne'],
    portrait: '/images/prestataires/mixologue.jpg',
    specialty: 'Cartes de cocktails et service continu',
    names: ['Jeanne Aubert', 'Léa Nguyen'],
  },
  {
    keywords: ['styliste', 'créateur', 'createur', 'couture', 'tailor', 'mode', 'scénographe', 'scenographe', 'designer', 'céramiste', 'ceramiste', 'menuisier', 'chineur'],
    portrait: '/images/prestataires/createur.jpg',
    specialty: 'Pièces uniques, dessinées pour l’occasion',
    names: ['Manon Lefèvre', 'Inès Kaplan'],
  },
  {
    keywords: ['light', 'lumière', 'lumiere', 'technique', 'scène', 'scene', 'néon', 'neon', 'fumée', 'fumee'],
    portrait: '/images/prestataires/regisseur.jpg',
    specialty: 'Lumières, machines et installation',
    names: ['Bastien Roux', 'Karim Haddad'],
  },
];

/** Aucun mot-clé reconnu : un portrait neutre et une promesse honnête. */
const FALLBACK = {
  portrait: '/images/prestataires/createur.jpg',
  specialty: 'Intervient sur ce type d’univers',
  names: ['Alice Moreau', 'Samuel Diop'],
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function hash(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) % 100000;
  return h;
}

/** « Photographe Mode / Studio » → « Photographe Mode ». */
function shortTrade(role: string): string {
  return role.split('/')[0].trim();
}

/**
 * Les prestataires d'un univers : les métiers que cet univers mobilise,
 * incarnés par des personnes.
 */
export function vendorsFor(style: WeddingStyle): Vendor[] {
  // Une personne ne peut pas tenir deux rôles sur la même carte : on garde la
  // trace des noms déjà attribués et on prend le suivant dans la famille.
  const taken: string[] = [];

  return (style.humanMissions ?? []).slice(0, 3).map((mission) => {
    const haystack = normalize(mission.role);
    const family = FAMILIES.find((f) => f.keywords.some((k) => haystack.includes(k))) ?? FALLBACK;

    const start = hash(mission.role) % family.names.length;
    const ordered = [...family.names.slice(start), ...family.names.slice(0, start)];
    const name =
      ordered.find((candidate) => !taken.includes(candidate)) ??
      SECOND_POOL.find((candidate) => !taken.includes(candidate)) ??
      `${family.names[0]} (2)`;
    taken.push(name);

    return {
      trade: shortTrade(mission.role),
      role: mission.role,
      name,
      specialty: family.specialty,
      portrait: family.portrait,
      accent: style.accent,
    };
  });
}

/** Quand une famille n'a plus de nom libre, on puise ici. */
const SECOND_POOL = [
  'Sarah Delcourt',
  'Antoine Rivet',
  'Maya Cherif',
  'Léon Dubois',
  'Noémie Perrin',
  'Gabriel Azzouz',
];
