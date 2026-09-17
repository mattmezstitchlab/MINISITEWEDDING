export interface WeddingStyle {
  id: string;
  name: string;
  tagline: string;
  ink: string;
  muted: string;
  accent: string;
  dark: boolean;
  image: string;
  /** Dégradé neutre de secours quand une photo manque */
  aura: [string, string, string];
  /** Petit manifeste pour la landing / l'onboarding */
  manifesto?: string;
  /** Synthèse pour la verticale immersive */
  synopsis?: string;
}

/**
 * Dix environnements qui cassent les codes du mariage : chacun a son image,
 * sa couleur d’accent et son vocabulaire.
 */
export const WEDDING_STYLES: WeddingStyle[] = [
  {
    id: 'brutal',
    name: 'Béton Brut',
    tagline: 'Anti-château. Chapelle de béton.',
    manifesto: 'Pas de fleurs. De la lumière qui coupe le béton. Un oui dans un bunker berlinois.',
    synopsis: 'Mariage brutaliste : béton brut, lumière zénithale, une seule tige blanche. Le luxe c’est le vide. Très Berlin, très fashion, zéro pivoine.',
    ink: '#F5F5F0',
    muted: '#A8A8A3',
    accent: '#FF4D00',
    dark: true,
    image: '/images/brutal.jpg',
    aura: ['#2A2A2A', '#3A3A3A', '#1A1A1A'],
  },
  {
    id: 'club',
    name: 'Club Amour',
    tagline: '02h17. Stroboscope. Oui.',
    manifesto: 'Le mariage commence quand les autres se couchent. Flyer, fumée, techno, baiser sous le néon.',
    synopsis: 'After de mariage devenu mariage. Invitation = flyer rave, dress code = club kid, first dance à 2h17 sous stroboscope magenta.',
    ink: '#FFE6F7',
    muted: '#B08BA3',
    accent: '#FF00E5',
    dark: true,
    image: '/images/club-amour.jpg',
    aura: ['#1A0A1A', '#2D0A2D', '#0F0A1F'],
  },
  {
    id: 'desert',
    name: 'Desert Motel',
    tagline: 'Vegas, 38°C, piscine vide',
    manifesto: 'Elopement Americana. Un motel, une piscine turquoise vide, deux bagues qui brûlent au soleil.',
    synopsis: 'Road-trip love. Motel 70s, piscine vide, enseigne néon LOVE. Robe vintage, bottes, chaleur qui tremble. Très Wes Anderson.',
    ink: '#2B1B0E',
    muted: '#9B8B7A',
    accent: '#FFB61E',
    dark: false,
    image: '/images/desert-motel.jpg',
    aura: ['#F5E6D0', '#FFE9B0', '#E8D5B0'],
  },
  {
    id: 'cosmic',
    name: 'Cosmic',
    tagline: 'Verre liquide. Orbite.',
    manifesto: 'Premier mariage en visionOS. Chrome liquide, verre qui flotte, invitation en spatial video.',
    synopsis: 'Mariage spatial. Verre liquide, chrome miroir, typographie qui flotte. Le site est une fenêtre visionOS, pas une carte.',
    ink: '#0E0E1A',
    muted: '#8B8DAF',
    accent: '#7A5CFF',
    dark: false,
    image: '/images/cosmic.jpg',
    aura: ['#E6E8FF', '#F0F0FF', '#D8D8FF'],
  },
  {
    id: 'punk',
    name: 'Punk Papier',
    tagline: 'Zine, agrafes, photocopieuse',
    manifesto: 'Anti-luxe. Faire-part photocopié à 50 exemplaires, typo rançon, épingle à nourrice. Coût : 0€.',
    synopsis: 'DIY or die. Fanzine, Xerox, collage, scotch. Le mariage le moins cher et le plus punk : un manifeste plutôt qu’une facture.',
    ink: '#0A0A0A',
    muted: '#8A8A8A',
    accent: '#FF1A1A',
    dark: false,
    image: '/images/punk-papier.jpg',
    aura: ['#FFFFFF', '#F5F5F5', '#EAEAEA'],
  },
  {
    id: 'foret-noire',
    name: 'Forêt Noire',
    tagline: 'Mousse, rituel, champignons',
    manifesto: 'Pas garden party. Forêt profonde, brume, velours vert, champignons. Mariage païen, folklore.',
    synopsis: 'Witchy, païen, mousse. Forêt noire, velours vert, couronne de champignons, brume. Pas un jardin anglais, un rituel.',
    ink: '#E8E6D9',
    muted: '#8B8A7A',
    accent: '#2D4A22',
    dark: true,
    image: '/images/foret-noire.jpg',
    aura: ['#1A2A1A', '#2A3A2A', '#0F1A0F'],
  },
  {
    id: 'cinema',
    name: 'Cinéma',
    tagline: 'Rideau rouge. 35mm. Première.',
    manifesto: 'Votre mariage est une première. Ticket, rideau rouge, générique. Les invités sont le public.',
    synopsis: 'Mariage = première de film. Ticket d’invitation, rideau rouge, générique du programme, first dance sur scène. Très Hollywood 70s.',
    ink: '#F5F1E8',
    muted: '#9B958B',
    accent: '#C80000',
    dark: true,
    image: '/images/cinema.jpg',
    aura: ['#1A0A0A', '#2A0A0A', '#0F0A0A'],
  },
  {
    id: 'brocante',
    name: 'Brocante Club',
    tagline: 'Chaises dépareillées. Maximalisme.',
    manifesto: 'Anti-Pinterest parfait. 28 chaises différentes, assiettes de mamie, fleurs en bocaux. Seconde main, joie.',
    synopsis: 'Maximalisme joyeux. Chaque chaise différente, assiettes chinées, nappes mélangées, fleurs en pots de confiture. Durable et kitsch.',
    ink: '#2A1F1A',
    muted: '#9B8E84',
    accent: '#FF6B2B',
    dark: false,
    image: '/images/brocante.jpg',
    aura: ['#F5EDE0', '#FFF5E0', '#E8DDD0'],
  },
  {
    id: 'supermarche',
    name: 'Supermarché 22h',
    tagline: 'Rayon 7, néons, caddie',
    manifesto: 'On se dit oui entre les céréales et le rayon surgelés. Néons, caddie, amour en libre-service.',
    synopsis: 'Le plus anti-lieu du monde. Supermarché vide à 22h, néons qui grésillent, baiser entre deux rayons. Photo iconique, décor déjà là.',
    ink: '#E8FFE8',
    muted: '#8BA38B',
    accent: '#00FF88',
    dark: true,
    image: '/images/supermarche.jpg',
    aura: ['#0A1A0A', '#1A2A1A', '#0F1F0F'],
  },
  {
    id: 'laverie',
    name: 'Laverie Club',
    tagline: 'Tambour 7, mousse, pastel',
    manifesto: 'Tambours qui tournent, pastel délavé, bulles. Mariage en laverie, le plus tendre des endroits banals.',
    synopsis: 'Laverie automatique, néons pastel, hublots qui tournent, couple assis sur les machines. Intime, surréaliste, ultra photogénique.',
    ink: '#1A1A2A',
    muted: '#8B8B9B',
    accent: '#8B9BFF',
    dark: false,
    image: '/images/laverie.jpg',
    aura: ['#E8E8FF', '#F0F0FF', '#E0E0FF'],
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

export function fontsFor(typoId: string): { heading: string; body: string; weight: number } {
  const found = TYPO_OPTIONS.find((t) => t.id === typoId) ?? TYPO_OPTIONS[0];
  return { heading: found.heading, body: found.body, weight: found.weight };
}

// 10 couleurs qui claquent — une par univers
export const ACCENT_PRESETS = [
  '#FF4D00', // brutal
  '#FF00E5', // club
  '#FFB61E', // desert
  '#7A5CFF', // cosmic
  '#FF1A1A', // punk
  '#2D4A22', // foret
  '#C80000', // cinema
  '#FF6B2B', // brocante
  '#00FF88', // supermarche
  '#8B9BFF', // laverie
];

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

export const MEDIA_CATEGORIES = [
  'Couple', 'Alliances', 'Cérémonie', 'Bouquet', 'Table', 'Décoration',
  'Château', 'Nature', 'Danse', 'Champagne', 'Textures',
  'Béton', 'Club', 'Desert', 'Cosmic', 'Punk', 'Forêt', 'Cinéma', 'Brocante', 'Supermarché', 'Laverie',
];

export const MEDIA_COLLECTIONS = [
  'Béton Brut', 'Club Amour', 'Desert Motel', 'Cosmic',
  'Punk Papier', 'Forêt Noire', 'Cinéma', 'Brocante Club',
  'Supermarché 22h', 'Laverie Club',
];

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

export function envVars(theme: WeddingStyle, accent: string): Record<string, string> {
  return { '--vp-accent': accent || theme.accent };
}
