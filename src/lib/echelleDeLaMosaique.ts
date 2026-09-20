/**
 * L'ÉCHELLE DE LA MOSAÏQUE — QUATRE CRANS, ET CE QU'ILS OUVRENT
 *
 * Le zoom de la mosaïque n'est pas un facteur : c'est un **cran**, et chaque
 * cran ouvre une rangée de plus, en agrandissant les vignettes.
 *
 * | cran | la taille des vignettes | les rangées ouvertes |
 * | --- | --- | --- |
 * | 1 | 58 px | l'année |
 * | 2 | 78 px | l'année, la semaine |
 * | 3 | 106 px | l'année, la semaine, la journée |
 * | 4 | 136 px | tout, jusqu'aux pages et aux articles |
 *
 * `ZOOM OUT → LE MONDE. ZOOM IN → LA JOURNÉE. ZOOM PLUS → LA PAGE. ZOOM PLUS →
 * L'ARTICLE.` La taille voulue est ensuite bornée par la hauteur de la fenêtre :
 * quatre rangées ne doivent jamais manger la scène.
 */
export const TAILLES_DE_LA_MOSAIQUE = [58, 78, 106, 136];

/** La taille voulue d'une vignette, pour un cran de 1 à 4. */
export function tailleVoulue(niveau: number): number {
  return TAILLES_DE_LA_MOSAIQUE[Math.min(3, Math.max(0, niveau - 1))]!;
}
