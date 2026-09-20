/**
 * LES VISUELS LIVRÉS — ENGENDRÉ PAR `npm run photos`
 *
 * Ce fichier est la liste de ce qui est **réellement arrivé** dans
 * `public/images/magazine/` : un dossier par jour (`MM-JJ`), et dedans les plans
 * livrés. **Ne pas l'écrire à la main** : on dépose les images, on lance la
 * commande, la liste se refait.
 *
 * Le site s'en sert pour **prendre la photo quand elle est là** — et laisser le
 * dessin quand elle n'y est pas. Un fichier absent ne casse donc jamais une page.
 */

export const PHOTOS_DU_MAGAZINE: Record<string, string[]> = {};

/** Le nombre de plans livrés, tous jours confondus. */
export const PHOTOS_LIVREES = 0;

/** Vrai quand ce plan a son image. */
export function photoLivree(jour: string, slot: string): boolean {
  return (PHOTOS_DU_MAGAZINE[jour] ?? []).includes(slot);
}

/** Le chemin du premier rang livré pour ce plan, ou `null`. */
export function photoDuPlan(jour: string, slot: string): string | null {
  if (!photoLivree(jour, slot)) return null;
  return `/images/magazine/${jour}/${slot}.jpg`;
}
