import { WEDDING_STYLES } from './weddingStyles';
import { SHOP_PRODUCTS, imageDeRepli } from './shopData';
import { ALL_ARTICLES } from './magazine';
import { FAMILIES } from './weddingVendors';
import { MEDIA_SEED } from './mediaSeed';

/**
 * LA BIBLIOTHÈQUE DES VISUELS
 *
 * Toutes les images livrées avec le site, rangées par famille : les univers,
 * les ambiances, les métiers, le shop et le magazine. C'est cette
 * bibliothèque-là qui sert à changer un visuel dans un mini-site — aucune
 * n'est inventée, toutes existent sur le disque.
 */

export interface VisualAsset {
  url: string;
  title: string;
  /** Le visuel de secours, tant qu'un fichier n'a pas encore été livré. */
  repli?: string;
}

export interface VisualFamily {
  id: string;
  label: string;
  visuals: VisualAsset[];
}

/** Enlève les doublons en gardant l'ordre d'apparition. */
function dedoublonner(assets: VisualAsset[]): VisualAsset[] {
  const vus = new Set<string>();
  return assets.filter((asset) => {
    if (vus.has(asset.url)) return false;
    vus.add(asset.url);
    return true;
  });
}

const univers: VisualAsset[] = WEDDING_STYLES.map((style) => ({ url: style.image, title: style.name }));

const ambiances: VisualAsset[] = MEDIA_SEED.map((media) => ({ url: media.url, title: media.title }));

const metiers: VisualAsset[] = dedoublonner(
  FAMILIES.flatMap((famille) => famille.portraits.map((url) => ({ url, title: famille.specialty }))),
);

const shop: VisualAsset[] = dedoublonner(
  SHOP_PRODUCTS.map((produit) => ({
    url: produit.image,
    title: produit.name,
    repli: imageDeRepli(produit),
  })),
);

const magazine: VisualAsset[] = dedoublonner(
  ALL_ARTICLES.map((article) => ({ url: article.cover, title: article.title })),
);

export const VISUAL_FAMILIES: VisualFamily[] = [
  { id: 'univers', label: 'Univers', visuals: univers },
  { id: 'ambiances', label: 'Ambiances', visuals: ambiances },
  { id: 'metiers', label: 'Métiers', visuals: metiers },
  { id: 'shop', label: 'Shop', visuals: shop },
  { id: 'magazine', label: 'Magazine', visuals: magazine },
];

export const VISUAL_COUNT = VISUAL_FAMILIES.reduce((total, famille) => total + famille.visuals.length, 0);

/** Retrouve un visuel dans la bibliothèque. */
export function visualByUrl(url: string): VisualAsset | undefined {
  for (const famille of VISUAL_FAMILIES) {
    const trouve = famille.visuals.find((visual) => visual.url === url);
    if (trouve) return trouve;
  }
  return undefined;
}

/** Retrouve le titre d'un visuel, ou son nom de fichier. */
export function visualTitle(url: string): string {
  for (const famille of VISUAL_FAMILIES) {
    const trouve = famille.visuals.find((visual) => visual.url === url);
    if (trouve) return trouve.title;
  }
  return url.split('/').pop() ?? url;
}
