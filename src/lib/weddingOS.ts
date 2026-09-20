import { useEffect, useState } from 'react';

/**
 * WEDDING OS — LE STUDIO DU CONCEPT, EN UN BLOC
 *
 * Une seule source pour régler et indiquer : tout ce que le bloc décide ici
 * se voit dans son écran, et se répercute dans le magazine. Les champs ne
 * sont pas posés d'avance : ils **se déplient** selon le picto qu'on touche.
 * Des curseurs, une palette avec pipette, un aperçu Bureau / iPad / Mobile —
 * le bloc est à lui seul un véritable studio.
 */

export type AppareilOS = 'bureau' | 'ipad' | 'mobile';

export interface ReglagesOS {
  theme: 'clair' | 'sombre';
  appareil: AppareilOS;
  /** La taille du titre de la couverture, en pixels. */
  tailleTitre: number;
  /** L'arrondi des cartes, en pixels. */
  arrondi: number;
  /** L'espace entre les blocs, en pixels. */
  espace: number;
  couleurAccent: string;
  couleurFond: string;
  police: 'editoriale' | 'moderne';
  /** Le morceau choisi dans l'onglet musiques. */
  musique: string | null;
  /** Le visuel choisi dans l'onglet visuels. */
  visuel: string | null;
  /** La saison regardée dans l'onglet timeline. */
  saison: string | null;
  /** La forme de l'objet unique, dans l'onglet objets. */
  objet: string;
  /** Les réglages qu'on garde : ils deviennent la règle du site. */
  garder: string[];
  /** Accessibilité. */
  grosTextes: boolean;
  contraste: boolean;
  sansAnimations: boolean;
}

const EVENEMENT = 'supermariage:wedding-os';

let reglages: ReglagesOS = {
  theme: 'clair',
  appareil: 'bureau',
  tailleTitre: 34,
  arrondi: 14,
  espace: 14,
  couleurAccent: '#B8574A',
  couleurFond: '#FFFEF7',
  police: 'editoriale',
  musique: null,
  visuel: null,
  saison: null,
  objet: 'recu',
  garder: [],
  grosTextes: false,
  contraste: false,
  sansAnimations: false,
};

export function reglerOS(partiel: Partial<ReglagesOS>): void {
  reglages = { ...reglages, ...partiel };
  try {
    window.dispatchEvent(new Event(EVENEMENT));
  } catch {
    /* pas de fenêtre */
  }
}

export function basculerGarderOS(id: string): void {
  const garder = reglages.garder.includes(id)
    ? reglages.garder.filter((g) => g !== id)
    : [...reglages.garder, id];
  reglerOS({ garder });
}

export function lesReglagesOS(): ReglagesOS {
  return reglages;
}

export function useReglagesOS(): ReglagesOS {
  const [etat, setEtat] = useState<ReglagesOS>(reglages);
  useEffect(() => {
    const surChangement = () => setEtat(reglages);
    window.addEventListener(EVENEMENT, surChangement);
    return () => window.removeEventListener(EVENEMENT, surChangement);
  }, []);
  return etat;
}

/** Les réglages qu'on peut décider de garder. */
export const GARDABLES_OS: Array<{ id: string; label: string }> = [
  { id: 'titre', label: 'La taille du titre' },
  { id: 'couleurs', label: 'Les couleurs' },
  { id: 'arrondi', label: 'L’arrondi' },
  { id: 'espace', label: 'L’espace' },
  { id: 'musique', label: 'La musique' },
];

/** La palette du studio : les saisons, plus les neutres. */
export const PALETTE_OS: Array<{ nom: string; hex: string }> = [
  { nom: 'Printemps', hex: '#7FB77E' },
  { nom: 'Été', hex: '#E9B44C' },
  { nom: 'Automne', hex: '#B8574A' },
  { nom: 'Hiver', hex: '#3E5C76' },
  { nom: 'Encre', hex: '#0B0C12' },
  { nom: 'Papier', hex: '#FFFEF7' },
];

/* ——— LE CONTRASTE, COMME UN VRAI DESIGN SYSTEM ——— */

function canal(v: number): number {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const h = hex.replace('#', '');
  const plein = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const r = parseInt(plein.slice(0, 2), 16);
  const g = parseInt(plein.slice(2, 4), 16);
  const b = parseInt(plein.slice(4, 6), 16);
  if ([r, g, b].some(Number.isNaN)) return 1;
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

/** Le ratio de contraste WCAG entre deux couleurs, et son verdict. */
export function contrasteWCAG(a: string, b: string): { ratio: string; badge: 'AAA' | 'AA' | 'à revoir' } {
  const la = luminance(a);
  const lb = luminance(b);
  const ratio = (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  const arrondi = Math.round(ratio * 100) / 100;
  return {
    ratio: arrondi.toFixed(2),
    badge: ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'à revoir',
  };
}

/** Les morceaux du studio : les fichiers audio qui existent déjà. */
export const MORCEAUX_OS: Array<{ id: string; nom: string; fichier: string }> = [
  { id: 'ceremonie', nom: 'La cérémonie', fichier: '/audio/ceremonie-elvis.wav' },
  { id: 'cocktail', nom: 'Le cocktail', fichier: '/audio/cocktail-kungs.wav' },
  { id: 'diner', nom: 'Le dîner', fichier: '/audio/diner-sinatra.wav' },
  { id: 'danse', nom: 'L’ouverture du bal', fichier: '/audio/danse-perfect.wav' },
  { id: 'club', nom: 'Le club', fichier: '/audio/club-daftpunk.wav' },
  { id: 'final', nom: 'La dernière danse', fichier: '/audio/soul-at-last.wav' },
];

/** Les visuels du studio : les saisons en images. */
export const VISUELS_OS: Array<{ id: string; nom: string; fichier: string }> = [
  { id: 'printemps', nom: 'Printemps', fichier: '/images/aime/printemps.jpg' },
  { id: 'ete', nom: 'Été', fichier: '/images/aime/ete.jpg' },
  { id: 'automne', nom: 'Automne', fichier: '/images/aime/automne.jpg' },
  { id: 'hiver', nom: 'Hiver', fichier: '/images/aime/hiver.jpg' },
];
