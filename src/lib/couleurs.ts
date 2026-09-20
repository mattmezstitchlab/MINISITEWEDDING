/**
 * LES COULEURS — ASSOMBRIR UNE SAISON SANS LA PERDRE
 *
 * Une seule fonction, et elle sert à une chose précise : **les temps clos**. Le
 * carême, l'avent et l'avant-carême ne sont pas noirs — ils sont la **couleur de
 * leur saison, assombrie**. La nuance reste reconnaissable, la lumière tombe.
 *
 * Le noir, lui, reste réservé à trois cas rares et signifiants (le joker, le
 * dimanche, les portes de l'année) : c'est une décision éditoriale, pas un
 * réglage. Cette fonction n'existe donc que pour **ne pas** y aller.
 */

/** Les trois canaux d'une couleur `#RRGGBB`, ou `null` si ce n'est pas lisible. */
export function canaux(hex: string): [number, number, number] | null {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1]!, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** La couleur écrite en `#rrggbb`, toujours en minuscules. */
export function enHex(rouge: number, vert: number, bleu: number): string {
  const borne = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${[rouge, vert, bleu].map((v) => borne(v).toString(16).padStart(2, '0')).join('')}`;
}

/**
 * La même couleur, plus dense. `taux` va de 0 (inchangée) à 1 (noire) ; **il est
 * borné à 0,75** : au-delà, la saison ne se reconnaît plus, et c'est exactement
 * ce qu'on ne veut pas.
 */
export function assombrir(hex: string, taux: number): string {
  const c = canaux(hex);
  if (!c) return hex;
  const t = Math.max(0, Math.min(0.75, taux));
  return enHex(c[0] * (1 - t), c[1] * (1 - t), c[2] * (1 - t));
}

/** La densité d'un temps clos — la même pour toutes les saisons. */
export const TAUX_TEMPS_CLOS = 0.4;
