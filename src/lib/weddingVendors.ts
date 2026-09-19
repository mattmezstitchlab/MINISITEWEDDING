/**
 * LES PRESTATAIRES ASSOCIÉS À CHAQUE UNIVERS
 *
 * Chaque univers du catalogue dit déjà quels métiers il mobilise
 * (`humanMissions`). Ici, ces métiers deviennent des personnes : un portrait,
 * un nom, et ce qu'elles apportent. C'est ce qui s'affiche dans les cartes —
 * une carte par personne, une seule information : le métier.
 *
 * Les portraits vivent dans `public/images/prestataires/`.
 */

import type { WeddingStyle } from './weddingStyles';
import { contentFor } from './universeContent';

export interface Vendor {
  /** Le métier tel qu'il s'affiche sur la carte. */
  trade: string;
  /** Le métier complet, tel que décrit par l'univers. */
  role: string;
  name: string;
  /** Ce que ce prestataire apporte, en une ligne. */
  specialty: string;
  portrait: string;
  /** Où ce prestataire intervient : la ville du mariage de son univers. */
  location: string;
  /** L'univers dont ce métier vient — porté par le lien « Revendiquer ». */
  styleId: string;
  styleName: string;
  accent: string;
}

/**
 * Les familles de métiers. Le premier mot-clé trouvé dans le rôle décide du
 * portrait et de la promesse : inutile d'écrire une fiche pour chaque intitulé.
 */
export const FAMILIES: Array<{ key: string; keywords: string[]; portraits: string[]; specialty: string; names: string[] }> = [
  {
    key: 'photographe',
    keywords: ['photograph', 'photo', 'vidéaste', 'videaste', 'video', 'cinéaste', 'cineaste', 'cinéma', 'cinema', 'film', 'super 8', 'clip', 'image', 'caméra', 'camera'],
    portraits: ['/images/prestataires/photographe.jpg', '/images/prestataires/technicien.jpg', '/images/prestataires/scenographe.jpg'],
    specialty: 'Reportage, tirages et retouches',
    names: ['Camille Rousseau', 'Élodie Fontaine'],
  },
  {
    key: 'patissier',
    keywords: ['pâtissier', 'patissier', 'pâtiss', 'patiss', 'gâteau', 'gateau', 'boulanger', 'brunch'],
    portraits: ['/images/prestataires/patissier.jpg', '/images/prestataires/fleuriste.jpg', '/images/prestataires/chef.jpg'],
    specialty: 'Pièce montée, gâteaux et desserts',
    names: ['Chloé Marchand', 'Aurore Petit'],
  },
  {
    key: 'chef',
    keywords: ['traiteur', 'chef', 'cuisine', 'gastronom', 'menu', 'tapas', 'food'],
    portraits: ['/images/prestataires/chef.jpg', '/images/prestataires/patissier.jpg', '/images/prestataires/artisan.jpg'],
    specialty: 'Menus dégustés en amont, service au minuteur',
    names: ['Julien Mercier', 'Thomas Béranger'],
  },
  {
    key: 'musicien',
    keywords: ['saxophon', 'pianist', 'piano', 'guitar', 'groupe', 'orchestre', 'quatuor', 'cordes', 'ensemble', 'accordéon', 'accordeon', 'violon', 'chanteu', 'chorale', 'live'],
    portraits: ['/images/prestataires/musicien.jpg', '/images/prestataires/musicienne.jpg', '/images/prestataires/dj.jpg'],
    specialty: 'Musiciens en direct, du cocktail au dessert',
    names: ['Samuel Diop', 'Lucie Ferrand'],
  },
  {
    key: 'dj',
    keywords: ['dj', 'sound', 'sono', 'son', 'musique', 'bpm', 'playlist', 'barista'],
    portraits: ['/images/prestataires/dj.jpg', '/images/prestataires/musicien.jpg', '/images/prestataires/technicien.jpg'],
    specialty: 'Set sur mesure, régie et micro HF',
    names: ['Marco Vidal', 'Sofiane Keïta'],
  },
  {
    key: 'fleuriste',
    keywords: ['fleur', 'botan', 'paysag', 'jardin', 'plant'],
    portraits: ['/images/prestataires/fleuriste.jpg', '/images/prestataires/patissier.jpg', '/images/prestataires/scenographe.jpg'],
    specialty: 'Compositions de saison, montées sur place',
    names: ['Anna Delaunay', 'Claire Vasseur'],
  },
  {
    key: 'officiant',
    keywords: ['officiant', 'célébrant', 'celebrant', 'maire', 'prêtre', 'pretre', 'coordination', 'coordinateur', 'protocole', 'cérémonie', 'ceremonie', 'maître', 'maitre', 'hôte', 'hote', 'ouvreur', 'accueil', 'placier', 'guide'],
    portraits: ['/images/prestataires/officiant.jpg', '/images/prestataires/hote.jpg', '/images/prestataires/createur.jpg'],
    specialty: 'Tient le déroulé, de la première heure au départ',
    names: ['Olivier Blanchard', 'Hugo Lemaitre'],
  },
  {
    key: 'mixologue',
    keywords: ['mixolog', 'cocktail', 'bar', 'bulle', 'champagne', 'bière', 'biere'],
    portraits: ['/images/prestataires/mixologue.jpg', '/images/prestataires/dj.jpg', '/images/prestataires/hote.jpg'],
    specialty: 'Cartes de cocktails et service continu',
    names: ['Jeanne Aubert', 'Léa Nguyen'],
  },
  {
    key: 'artisan',
    keywords: ['imprimeur', 'imprim', 'riso', 'sérigraph', 'serigraph', 'artisan', 'menuis', 'ébénis', 'eben', 'forge', 'verrier', 'tapiss', 'brodeu', 'potier'],
    portraits: ['/images/prestataires/artisan.jpg', '/images/prestataires/scenographe.jpg', '/images/prestataires/hote.jpg'],
    specialty: 'Fait main, sur mesure et sur place',
    names: ['Paul Vannier', 'Rémi Lacoste'],
  },
  {
    key: 'createur',
    keywords: ['styliste', 'créateur', 'createur', 'couture', 'tailor', 'mode', 'scénographe', 'scenographe', 'designer', 'céramiste', 'ceramiste', 'chineur', 'loueur', 'décor'],
    portraits: ['/images/prestataires/createur.jpg', '/images/prestataires/scenographe.jpg', '/images/prestataires/artisan.jpg'],
    specialty: 'Pièces uniques, dessinées pour l’occasion',
    names: ['Manon Lefèvre', 'Inès Kaplan'],
  },
  {
    key: 'regisseur',
    keywords: ['light', 'lumière', 'lumiere', 'technique', 'scène', 'scene', 'néon', 'neon', 'fumée', 'fumee', 'sécurité', 'securite', 'transport', 'régisseur', 'regisseur', 'pilote', 'gardien', 'canot', 'hameçon', 'logistique', 'installation'],
    portraits: ['/images/prestataires/regisseur.jpg', '/images/prestataires/technicien.jpg', '/images/prestataires/officiant.jpg'],
    specialty: 'Lumières, machines et installation',
    names: ['Bastien Roux', 'Karim Haddad'],
  },
];

/** Aucun mot-clé reconnu : un portrait neutre et une promesse honnête. */
const FALLBACK = {
  key: 'polyvalent',
  portraits: [
    '/images/prestataires/hote.jpg',
    '/images/prestataires/officiant.jpg',
    '/images/prestataires/scenographe.jpg',
    '/images/prestataires/technicien.jpg',
    '/images/prestataires/createur.jpg',
    '/images/prestataires/artisan.jpg',
    '/images/prestataires/regisseur.jpg',
  ],
  specialty: 'Intervient sur ce type d’univers',
  names: ['Alice Moreau', 'Sarah Delcourt'],
};

/** Tous les portraits disponibles, pour ne jamais montrer deux fois le même visage. */
export const ALL_PORTRAITS = [
  '/images/prestataires/hote.jpg',
  '/images/prestataires/technicien.jpg',
  '/images/prestataires/scenographe.jpg',
  '/images/prestataires/musicienne.jpg',
  '/images/prestataires/photographe.jpg',
  '/images/prestataires/chef.jpg',
  '/images/prestataires/dj.jpg',
  '/images/prestataires/fleuriste.jpg',
  '/images/prestataires/officiant.jpg',
  '/images/prestataires/mixologue.jpg',
  '/images/prestataires/createur.jpg',
  '/images/prestataires/regisseur.jpg',
  '/images/prestataires/patissier.jpg',
  '/images/prestataires/musicien.jpg',
  '/images/prestataires/artisan.jpg',
];

/** Quand une famille n'a plus de nom libre, on puise ici. */
const SECOND_POOL = [
  'Maya Cherif',
  'Léon Dubois',
  'Noémie Perrin',
  'Gabriel Azzouz',
  'Antoine Rivet',
  'Salomé Weber',
];

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
  return role.split('/')[0].split('&')[0].trim();
}

/**
 * Les prestataires d'une série d'univers, un par métier.
 *
 * Le nom et le portrait sont garantis uniques sur tout l'ensemble affiché :
 * deux personnes ne peuvent pas partager le même visage ni le même nom.
 */
export function vendorsForStyles(styles: WeddingStyle[]): Vendor[] {
  const takenNames: string[] = [];
  const takenPortraits: string[] = [];
  const vendors: Vendor[] = [];

  for (const style of styles) {
    const lieu = contentFor(style).couple.city;

    for (const mission of (style.humanMissions ?? []).slice(0, 3)) {
      const haystack = normalize(mission.role);
      const family = FAMILIES.find((f) => f.keywords.some((k) => haystack.includes(k))) ?? FALLBACK;

      // Le nom : la famille d'abord, puis une réserve, puis un suffixe.
      const start = hash(mission.role) % family.names.length;
      const ordered = [...family.names.slice(start), ...family.names.slice(0, start)];
      const name =
        ordered.find((c) => !takenNames.includes(c)) ??
        SECOND_POOL.find((c) => !takenNames.includes(c)) ??
        `${ordered[0]} ${takenNames.length}`;
      takenNames.push(name);

      // Le portrait : un visage qui colle au métier, et qui n'est pas déjà pris.
      const portrait =
        family.portraits.find((p) => !takenPortraits.includes(p)) ??
        ALL_PORTRAITS.find((p) => !takenPortraits.includes(p)) ??
        family.portraits[0];
      takenPortraits.push(portrait);

      vendors.push({
        trade: shortTrade(mission.role),
        role: mission.role,
        name,
        specialty: family.specialty,
        portrait,
        location: lieu,
        styleId: style.id,
        styleName: style.name,
        accent: style.accent,
      });
    }
  }

  return vendors;
}

/** Les prestataires d'un seul univers. */
export function vendorsFor(style: WeddingStyle): Vendor[] {
  return vendorsForStyles([style]);
}
