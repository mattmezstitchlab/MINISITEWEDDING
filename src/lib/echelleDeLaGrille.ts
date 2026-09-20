/**
 * L'ÉCHELLE DE LA GRILLE — CINQ DENSITÉS
 *
 * La grille ne change jamais d'interface : c'est **l'échelle** qui décide de ce
 * qu'une case montre. De loin, une image ; de près, la date ; plus près, le
 * titre ; puis le détail. Cinq crans, comme cinq pas vers la case.
 *
 * ```
 * 1  l'image seule          (le monde entier tient à l'écran)
 * 2  l'image et la date     (on commence à lire)
 * 3  et le titre            (on sait ce qu'on regarde)
 * 4  et le détail           (on sait de quoi il s'agit)
 * 5  le contenu entier      (la case s'ouvre)
 * ```
 */

/** Les cinq échelles, dans l'ordre : c'est le cran que l'on parcourt. */
export const ECHELLES_DE_LA_GRILLE = [0.42, 0.62, 0.86, 1.2, 1.7] as const;

/** La plus petite et la plus grande : on ne sort jamais de ces bornes. */
export const ECHELLE_MINIMALE = 0.24;
export const ECHELLE_MAXIMALE = 2.6;

/** La taille d'une case à l'échelle 1 — un carré, toujours. */
export const TAILLE_DE_LA_CASE = 128;

/** La taille d'une case à une échelle donnée. */
export function tailleDeLaCase(echelle: number): number {
  return Math.round(TAILLE_DE_LA_CASE * borner(echelle));
}

/** L'échelle du cran demandé (1 à 5). */
export function echelleDuCran(cran: number): number {
  const i = Math.min(ECHELLES_DE_LA_GRILLE.length, Math.max(1, Math.round(cran))) - 1;
  return ECHELLES_DE_LA_GRILLE[i]!;
}

/** Le cran le plus proche d'une échelle — ce que la réglette montre. */
export function cranDeLEchelle(echelle: number): number {
  let meilleur = 1;
  let ecart = Infinity;
  ECHELLES_DE_LA_GRILLE.forEach((valeur, i) => {
    const d = Math.abs(valeur - echelle);
    if (d < ecart) {
      ecart = d;
      meilleur = i + 1;
    }
  });
  return meilleur;
}

/**
 * **La densité** : ce que la case a le droit de dire, d'après **sa taille réelle
 * à l'écran**. C'est la seule règle honnête : une case de 54 pixels ne peut pas
 * porter un titre, une case de 300 pixels peut porter son détail. On ne regarde
 * donc jamais l'échelle en soi, mais les pixels qu'elle donne.
 */
export function densiteDeLaTaille(taille: number): number {
  if (taille < 64) return 1;
  if (taille < 96) return 2;
  if (taille < 132) return 3;
  if (taille < 190) return 4;
  return 5;
}

/**
 * **Le remplissage** : un petit monde — huit univers, un morceau — n'a pas à
 * flotter au milieu de l'écran. Tant que la grille ne couvre pas la surface, on
 * agrandit ses cases, sans jamais dépasser quatre fois la taille de base : une
 * grande vue d'ensemble reste une vue d'ensemble.
 */
export function ajustementDeRemplissage(colonnes: number, lignes: number, largeur: number, hauteur: number): number {
  if (colonnes <= 0 || lignes <= 0 || largeur <= 0 || hauteur <= 0) return 1;
  const parLargeur = largeur / (colonnes * TAILLE_DE_LA_CASE);
  const parHauteur = hauteur / (lignes * TAILLE_DE_LA_CASE);
  return Math.min(4, Math.max(1, Math.min(parLargeur, parHauteur)));
}

/** L'échelle, tenue entre ses bornes. */
export function borner(echelle: number): number {
  return Math.min(ECHELLE_MAXIMALE, Math.max(ECHELLE_MINIMALE, echelle));
}

/**
 * **Le nombre de colonnes** : la grille se donne la forme du monde qu'elle
 * porte et de l'écran qui la montre. Un monde de 365 cases sur un écran large
 * s'ouvre en large ; un monde de huit cases reste serré.
 */
export function colonnesDeLaGrille(nombreDeCases: number, largeur: number, hauteur: number): number {
  if (nombreDeCases <= 0) return 1;
  const rapport = hauteur > 0 && largeur > 0 ? largeur / hauteur : 1.6;
  const colonnes = Math.round(Math.sqrt(nombreDeCases * rapport));
  return Math.min(nombreDeCases, Math.max(3, colonnes));
}
