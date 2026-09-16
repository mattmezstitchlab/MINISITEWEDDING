export interface WeddingStyle {
  id: string;
  name: string;
  tagline: string;
  description: string;
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  accent: string;
  line: string;
  dark: boolean;
  image: string;
}

export const WEDDING_STYLES: WeddingStyle[] = [
  {
    id: 'editorial', name: 'Editorial', tagline: 'Comme un magazine de mode',
    description: 'Titres majestueux, grille magazine, photographie grand format.',
    bg: '#FAF7F2', surface: '#FFFFFF', ink: '#1B1B1B', muted: '#8A857C', accent: '#1B1B1B', line: '#E8E2D6',
    dark: false, image: '/images/couple-paris.jpg',
  },
  {
    id: 'minimal', name: 'Minimal', tagline: 'Le silence est un luxe',
    description: 'Blanc absolu, beaucoup d’air, typographie discrète.',
    bg: '#FFFFFF', surface: '#F7F7F5', ink: '#111111', muted: '#9A9A98', accent: '#111111', line: '#ECECEA',
    dark: false, image: '/images/bouquet.jpg',
  },
  {
    id: 'romantique', name: 'Romantique', tagline: 'Douceur rose poudré',
    description: 'Teintes tendres, serif délicat, atmosphère délicate.',
    bg: '#FDF6F3', surface: '#FFFFFF', ink: '#3E2E2E', muted: '#A68F8A', accent: '#B76E79', line: '#F0DDD6',
    dark: false, image: '/images/bouquet.jpg',
  },
  {
    id: 'nature', name: 'Nature', tagline: 'Garden wedding',
    description: 'Verts sauge, matières brutes, esprit bohème chic.',
    bg: '#F5F6F0', surface: '#FFFFFF', ink: '#2C3325', muted: '#8B917F', accent: '#5B6E4E', line: '#DFE2D2',
    dark: false, image: '/images/garden.jpg',
  },
  {
    id: 'chic', name: 'Chic', tagline: 'Black tie, bougies, doré',
    description: 'Noir profond, doré discret, élégance nocturne.',
    bg: '#121212', surface: '#1C1C1C', ink: '#F5F1E8', muted: '#9C958A', accent: '#C6A15B', line: '#2E2C28',
    dark: true, image: '/images/table-noir.jpg',
  },
  {
    id: 'mediterraneen', name: 'Méditerranéen', tagline: 'Soleil, mer, terracotta',
    description: 'Bleu profond, terre cuite, lumière du sud.',
    bg: '#F7F3E9', surface: '#FFFFFF', ink: '#22333B', muted: '#93876F', accent: '#C1663E', line: '#E5DAC2',
    dark: false, image: '/images/terrasse.jpg',
  },
  {
    id: 'noir-blanc', name: 'Noir & Blanc', tagline: 'Intemporel absolu',
    description: 'Photographie monochrome, contraste franc, pur.',
    bg: '#FFFFFF', surface: '#F4F4F4', ink: '#0A0A0A', muted: '#8B8B8B', accent: '#0A0A0A', line: '#E2E2E2',
    dark: false, image: '/images/noir-blanc.jpg',
  },
  {
    id: 'modern-romance', name: 'Modern Romance', tagline: 'Audacieux et tendre',
    description: 'Baie profonde, formes généreuses, esprit contemporain.',
    bg: '#FBF6F8', surface: '#FFFFFF', ink: '#331E28', muted: '#A78B96', accent: '#93354F', line: '#EEDDE3',
    dark: false, image: '/images/danse.jpg',
  },
];

export function styleById(id: string): WeddingStyle {
  return WEDDING_STYLES.find((s) => s.id === id) ?? WEDDING_STYLES[0];
}

export interface TypoOption { id: string; name: string; hint: string; heading: string; body: string; }

export const TYPO_OPTIONS: TypoOption[] = [
  { id: 'serif', name: 'Serif', hint: 'Classique et littéraire', heading: '"Cormorant Garamond", Georgia, serif', body: 'Inter, system-ui, sans-serif' },
  { id: 'sans', name: 'Sans Serif', hint: 'Net et contemporain', heading: 'Inter, system-ui, sans-serif', body: 'Inter, system-ui, sans-serif' },
  { id: 'editorial', name: 'Editorial', hint: 'Magazine haut de gamme', heading: 'Fraunces, Georgia, serif', body: 'Inter, system-ui, sans-serif' },
  { id: 'modern', name: 'Modern', hint: 'Géométrique et affirmé', heading: 'Manrope, system-ui, sans-serif', body: 'Manrope, system-ui, sans-serif' },
];

export function fontsFor(typoId: string): { heading: string; body: string } {
  const found = TYPO_OPTIONS.find((t) => t.id === typoId);
  if (found) return { heading: found.heading, body: found.body };
  return { heading: 'Fraunces, Georgia, serif', body: 'Inter, system-ui, sans-serif' };
}

export const ACCENT_PRESETS = ['#1B1B1B', '#8A6D4B', '#B76E79', '#5B6E4E', '#C6A15B', '#2E6E8E', '#C1663E', '#93354F'];

export const BUTTON_OPTIONS = [
  { id: 'pill', name: 'Arrondi', desc: 'Doux et accueillant' },
  { id: 'soft', name: 'Doux', desc: 'Coins légèrement arrondis' },
  { id: 'square', name: 'Franc', desc: 'Angles droits, affirmé' },
];

export const SHAPE_OPTIONS = [
  { id: 'soft', name: 'Douce', desc: 'Cartes arrondies' },
  { id: 'sharp', name: 'Franche', desc: 'Angles nets' },
  { id: 'round', name: 'Généreuse', desc: 'Très arrondie' },
];

export const LAYOUT_OPTIONS = [
  { id: 'minimal', name: 'Minimal', desc: 'Air et simplicité' },
  { id: 'magazine', name: 'Magazine', desc: 'Grilles éditoriales' },
  { id: 'immersif', name: 'Immersif', desc: 'Images plein écran' },
  { id: 'galerie', name: 'Galerie', desc: 'La photo avant tout' },
];

export const ANIMATION_OPTIONS = [
  { id: 'calme', name: 'Calme', desc: 'Transitions discrètes' },
  { id: 'fluide', name: 'Fluide', desc: 'L’équilibre parfait' },
  { id: 'spectaculaire', name: 'Spectaculaire', desc: 'Révélations amples' },
];

export const MEDIA_CATEGORIES = ['Couple', 'Alliances', 'Cérémonie', 'Fleurs', 'Bouquet', 'Table', 'Décoration', 'Château', 'Architecture', 'Nature', 'Danse', 'Gâteau', 'Champagne', 'Voyage', 'Détails', 'Textures'];

export const MEDIA_COLLECTIONS = ['Editorial Paris', "Côte d'Azur", 'Château', 'Garden Wedding', 'Black Tie', 'Modern Romance'];

export const PHASES = [
  { id: 'avant', name: 'Avant', desc: 'RSVP, organisation, programme' },
  { id: 'pendant', name: 'Pendant', desc: 'Jour J, itinéraires, contacts' },
  { id: 'apres', name: 'Après', desc: 'Photos, souvenirs, remerciements' },
];

export function buttonRadius(buttonStyle: string): string {
  if (buttonStyle === 'square') return '4px';
  if (buttonStyle === 'soft') return '12px';
  return '999px';
}

export function cardRadius(shape: string): string {
  if (shape === 'sharp') return '2px';
  if (shape === 'round') return '28px';
  return '16px';
}
