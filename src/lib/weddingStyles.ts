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
  /** Dégradé neutre de secours quand une photo manque (aucune teinte colorée) */
  aura: [string, string, string];
}

export const WEDDING_STYLES: WeddingStyle[] = [
  {
    id: 'editorial', name: 'Atelier', tagline: 'Lumière froide, verre pur',
    description: 'Un espace clair et net : verre régulier, gris bleuté, profondeur douce.',
    bg: '#FFFFFF', surface: '#FBFBFD', ink: '#101322', muted: '#6A7086', accent: '#16171A', line: '#E4E6EB',
    dark: false, image: '/images/couple-paris.jpg',
    aura: ['#EDEEF1', '#F7F8FA', '#E4E6EB'],
  },
  {
    id: 'minimal', name: 'Minimal', tagline: 'Le silence est un matériau',
    description: 'Blanc absolu, verre ultra-fin, beaucoup d’air. Rien de plus.',
    bg: '#F7F8FA', surface: '#FFFFFF', ink: '#0E1015', muted: '#8A8D97', accent: '#2A2E3A', line: '#E7E9EF',
    dark: false, image: '/images/bouquet.jpg',
    aura: ['#F2F3F5', '#FFFFFF', '#ECEDEF'],
  },
  {
    id: 'romantique', name: 'Romantique', tagline: 'Aurore rose poudré',
    description: 'Halos tendres, verre teinté de rose, atmosphère délicate.',
    bg: '#FAF1F4', surface: '#FFF8FA', ink: '#2E2129', muted: '#9C8590', accent: '#D2748F', line: '#F0DDE4',
    dark: false, image: '/images/bouquet.jpg',
    aura: ['#F4F0F1', '#FBF8F9', '#EAE5E7'],
  },
  {
    id: 'nature', name: 'Nature', tagline: 'Garden wedding',
    description: 'Verts sauge, verre végétal, matière brute et lumière filtrée.',
    bg: '#F0F5F0', surface: '#F8FBF8', ink: '#1F2A20', muted: '#7E8C7C', accent: '#5C8264', line: '#DCE6DC',
    dark: false, image: '/images/garden.jpg',
    aura: ['#EFF1EE', '#F8FAF7', '#E6E9E4'],
  },
  {
    id: 'chic', name: 'Chic', tagline: 'Black tie, verre fumé',
    description: 'Environnement nocturne profond, halos dorés, verre sombre.',
    bg: '#0C0D14', surface: '#14161F', ink: '#F2F0EA', muted: '#9A9689', accent: '#D8B26A', line: '#262936',
    dark: true, image: '/images/table-noir.jpg',
    aura: ['#2A2B2F', '#1B1C1F', '#33343A'],
  },
  {
    id: 'mediterraneen', name: 'Méditerranéen', tagline: 'Soleil, mer, terracotta',
    description: 'Bleu profond, terre cuite, lumière du sud sur le verre.',
    bg: '#EFF4F7', surface: '#F8FBFD', ink: '#16262E', muted: '#7E8B93', accent: '#C1663E', line: '#DCE6EC',
    dark: false, image: '/images/terrasse.jpg',
    aura: ['#EEF1F3', '#F8FAFB', '#E5E9EC'],
  },
  {
    id: 'noir-blanc', name: 'Noir & Blanc', tagline: 'Intemporel absolu',
    description: 'Contraste franc, verre neutre, aucune couleur. Pur.',
    bg: '#F4F4F6', surface: '#FFFFFF', ink: '#0A0A0C', muted: '#83848A', accent: '#16171C', line: '#E2E2E6',
    dark: false, image: '/images/noir-blanc.jpg',
    aura: ['#EDEDEF', '#FAFAFA', '#E3E3E5'],
  },
  {
    id: 'modern-romance', name: 'Modern Romance', tagline: 'Audacieux et tendre',
    description: 'Baie profonde, halos violets, verre généreux et contemporain.',
    bg: '#F8F1F6', surface: '#FFF8FC', ink: '#28162A', muted: '#9B8296', accent: '#8E3C63', line: '#EEDCE8',
    dark: false, image: '/images/danse.jpg',
    aura: ['#F3F0F2', '#FBF9FA', '#E9E5E8'],
  },
];

export function styleById(id: string): WeddingStyle {
  return WEDDING_STYLES.find((s) => s.id === id) ?? WEDDING_STYLES[0];
}

export interface TypoOption { id: string; name: string; hint: string; heading: string; body: string; weight: number; }

export const TYPO_OPTIONS: TypoOption[] = [
  { id: 'spatial', name: 'Spatial', hint: 'SF, net et lumineux', heading: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", system-ui, sans-serif', body: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", system-ui, sans-serif', weight: 620 },
  { id: 'sans', name: 'Sans Serif', hint: 'Contemporain, resserré', heading: 'Inter, system-ui, sans-serif', body: 'Inter, system-ui, sans-serif', weight: 600 },
  { id: 'editorial', name: 'Editorial', hint: 'Magazine haut de gamme', heading: 'Fraunces, Georgia, serif', body: 'Inter, system-ui, sans-serif', weight: 350 },
  { id: 'serif', name: 'Serif', hint: 'Classique et littéraire', heading: '"Cormorant Garamond", Georgia, serif', body: 'Inter, system-ui, sans-serif', weight: 400 },
  { id: 'modern', name: 'Modern', hint: 'Géométrique et affirmé', heading: 'Manrope, system-ui, sans-serif', body: 'Manrope, system-ui, sans-serif', weight: 650 },
];

export function typoById(id: string): TypoOption {
  return TYPO_OPTIONS.find((t) => t.id === id) ?? TYPO_OPTIONS[0];
}

export function fontsFor(typoId: string): { heading: string; body: string; weight: number } {
  const found = typoById(typoId);
  return { heading: found.heading, body: found.body, weight: found.weight };
}

export const ACCENT_PRESETS = ['#16171A', '#5A5D66', '#8A8D96', '#5C8264', '#C1663E', '#D8B26A', '#D2748F', '#8E3C63'];

export const BUTTON_OPTIONS = [
  { id: 'pill', name: 'Capsule', desc: 'Signature visionOS' },
  { id: 'soft', name: 'Doux', desc: 'Coins légèrement arrondis' },
  { id: 'square', name: 'Franc', desc: 'Angles nets, affirmé' },
];

export const SHAPE_OPTIONS = [
  { id: 'soft', name: 'Continue', desc: 'Courbure visionOS' },
  { id: 'sharp', name: 'Franche', desc: 'Angles nets' },
  { id: 'round', name: 'Généreuse', desc: 'Très enveloppante' },
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
  if (buttonStyle === 'square') return '6px';
  if (buttonStyle === 'soft') return '14px';
  return '999px';
}

export function cardRadius(shape: string): string {
  if (shape === 'sharp') return '4px';
  if (shape === 'round') return '34px';
  return '22px';
}

/**
 * Variables CSS d’un site de mariage.
 *
 * Le fond reste blanc (ou graphite neutre pour un thème sombre) : aucune
 * teinte colorée n’est appliquée à l’environnement. Seule la couleur
 * d’accent — celle des contrôles — suit le mariage choisi.
 */
export function envVars(theme: WeddingStyle, accent: string): Record<string, string> {
  return { '--vp-accent': accent || theme.accent };
}
