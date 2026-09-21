/**
 * LA LUMIÈRE DES HEURES — CE QUE LA MOSAÏQUE RACONTE SANS UN MOT
 *
 * Une journée, c'est **vingt-quatre lumières**. La mosaïque s'en sert : la même
 * photographie, vingt-quatre fois, et pourtant vingt-quatre vignettes
 * différentes — on voit la nuit tomber en glissant le doigt.
 *
 * Chaque heure a donc sa clarté (le facteur appliqué à l'image) et son voile
 * (la couleur posée dessus, en lumière douce). Quelques heures portent un mot —
 * et seulement celles-là : `GOLDEN HOUR` se lit sur la vignette, `16` se
 * contente de son chiffre.
 */

export interface LumiereDeLHeure {
  /** Le facteur de clarté appliqué à l'image : 0,4 la nuit, 1,1 à midi. */
  clarte: number;
  /** La couleur du voile, en lumière douce. */
  voile: string | null;
  /** L'opacité du voile. */
  alpha: number;
  /** Le mot de la vignette, quand l'heure ouvre un moment. */
  mot?: string;
}

const MINUIT = { clarte: 0.42, voile: '#0A1020', alpha: 0.52 } as const;
const NUIT_TARDIVE = { clarte: 0.5, voile: '#121A33', alpha: 0.45 } as const;
const AVANT_AUBE = { clarte: 0.6, voile: '#1B2A48', alpha: 0.4 } as const;
const AUBE = { clarte: 0.78, voile: '#F0A46A', alpha: 0.2 } as const;
const MATIN = { clarte: 0.98, voile: '#FFE9C8', alpha: 0.1 } as const;
const PLEIN_JOUR = { clarte: 1.08, voile: '#FFF6E2', alpha: 0.12 } as const;
const APRES_MIDI = { clarte: 1, voile: '#FFD9A8', alpha: 0.12 } as const;
const GOLDEN = { clarte: 0.96, voile: '#FFB86B', alpha: 0.3 } as const;
const CREPUSCULE = { clarte: 0.72, voile: '#6A5C8C', alpha: 0.32 } as const;
const SOIREE = { clarte: 0.54, voile: '#1A2140', alpha: 0.42 } as const;

/** La lumière d'une heure, de 0 à 23. */
export function lumiereDeLHeure(heure: number): LumiereDeLHeure {
  const h = ((heure % 24) + 24) % 24;
  if (h === 0) return { ...MINUIT, mot: 'NUIT' };
  if (h <= 4) return MINUIT;
  if (h === 5) return AVANT_AUBE;
  if (h === 6) return { ...AUBE, mot: 'AUBE' };
  if (h === 7) return AUBE;
  if (h === 8) return { ...MATIN, mot: 'MATIN' };
  if (h <= 11) return MATIN;
  if (h === 12) return { ...PLEIN_JOUR, mot: 'MIDI' };
  if (h === 13) return PLEIN_JOUR;
  if (h === 14) return APRES_MIDI;
  if (h === 15) return { ...APRES_MIDI, mot: 'APRÈS-MIDI' };
  if (h <= 17) return APRES_MIDI;
  if (h === 18) return { ...GOLDEN, mot: 'GOLDEN HOUR' };
  if (h === 19) return GOLDEN;
  if (h === 20) return { ...CREPUSCULE, mot: 'CRÉPUSCULE' };
  if (h === 21) return CREPUSCULE;
  if (h === 22) return { ...SOIREE, mot: 'SOIRÉE' };
  return NUIT_TARDIVE;
}

/**
 * **LA COULEUR D'UNE HEURE**, pour les vignettes sans photographie : on part du
 * fond du magazine et on le porte vers la nuit, le jour, ou l'or du soir.
 */
export function teinteDeLHeure(heure: number, fond: string, accent: string): string {
  const l = lumiereDeLHeure(heure);
  const melange = l.clarte >= 1 ? melangeHex(fond, '#FFFFFF', (l.clarte - 1) * 1.6) : melangeHex(fond, '#080A10', 1 - l.clarte);
  return l.voile ? melangeHex(melange, l.voile, l.alpha * 0.6) : melangeHex(melange, accent, 0.05);
}

/** Deux couleurs mélangées : `taux` de la seconde dans la première. */
export function melangeHex(a: string, b: string, taux: number): string {
  const t = Math.min(1, Math.max(0, taux));
  const [r1, g1, b1] = composantes(a);
  const [r2, g2, b2] = composantes(b);
  const c = (x: number, y: number) => Math.round(x + (y - x) * t).toString(16).padStart(2, '0');
  return `#${c(r1, r2)}${c(g1, g2)}${c(b1, b2)}`;
}

function composantes(hex: string): [number, number, number] {
  const propre = hex.replace('#', '').slice(0, 6);
  const complet = propre.length === 3 ? propre.split('').map((c) => c + c).join('') : propre.padEnd(6, '0');
  return [
    parseInt(complet.slice(0, 2), 16),
    parseInt(complet.slice(2, 4), 16),
    parseInt(complet.slice(4, 6), 16),
  ];
}
