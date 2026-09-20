/**
 * L'INVENTAIRE DES VISUELS DU MAGAZINE — ENGENDRÉ PAR `npm run visuels`
 *
 * Ce fichier est la liste de ce qui est **réellement arrivé** dans
 * `public/images/magazine/` : un dossier par semaine (`semaine-01` …
 * `semaine-54`), et dedans `cover.jpg` plus les sept chapitres
 * (`01-amoureux.jpg`, `02-style.jpg`, …, `07-souvenirs.jpg`).
 *
 * **Ne pas l'écrire à la main** : on dépose les images, on lance la commande, la
 * liste se refait. Le site s'en sert pour **prendre la photo quand elle est
 * là** — et laisser le dessin quand elle n'y est pas. Un fichier absent ne casse
 * donc jamais une page.
 *
 * Convention de nommage — c'est elle qui rend la bibliothèque remplaçable sans
 * toucher au code :
 *
 * ```
 * public/images/magazine/
 *   semaine-01/
 *     cover.jpg            la couverture du magazine 1
 *     01-amoureux.jpg      les sept chapitres
 *     02-style.jpg
 *     03-lieux.jpg
 *     04-recevoir.jpg
 *     05-fete.jpg
 *     06-monde.jpg
 *     07-souvenirs.jpg
 *   semaine-02/…
 *   semaine-54/…
 * ```
 *
 * Les anciens dossiers par jour (`09-21/couverture.jpg`) restent lus : ils
 * servent de **repli de transition** au troisième rang, jamais d'image d'une
 * autre semaine (voir `visuelsDuMagazine.ts`).
 */

export const VISUELS_DU_MAGAZINE: Record<string, string[]> = {
  "semaine-01": [
    "cover.jpg",
    "02-style.jpg"
  ],
  "semaine-02": [
    "cover.jpg"
  ],
  "semaine-03": [
    "cover.jpg"
  ],
  "semaine-04": [
    "cover.jpg"
  ],
  "semaine-05": [
    "cover.jpg"
  ],
  "semaine-06": [
    "cover.jpg"
  ],
  "semaine-07": [
    "cover.jpg"
  ],
  "semaine-38": [
    "cover.jpg",
    "01-amoureux.jpg"
  ]
};

/** Le nombre de visuels livrés, toutes semaines confondues. */
export const VISUELS_LIVRES = 10;

/** Vrai quand ce visuel est arrivé pour cette semaine. */
export function visuelLivre(numero: number, slot: string): boolean {
  const dossier = `semaine-${String(numero).padStart(2, '0')}`;
  return (VISUELS_DU_MAGAZINE[dossier] ?? []).includes(slot);
}

/** Le chemin servi d'un visuel : `/images/magazine/semaine-38/cover.jpg`. */
export function cheminDuVisuel(numero: number, slot: string): string {
  const dossier = `semaine-${String(numero).padStart(2, '0')}`;
  return `/images/magazine/${dossier}/${slot}`;
}
