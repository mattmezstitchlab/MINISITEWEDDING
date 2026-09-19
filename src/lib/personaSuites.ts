import { ALL_ARTICLES, type Article } from './magazine';
import { SHOP_PRODUCTS, type ShopProduct } from './shopData';
import { personnageParId, type Personnage } from './personas';

/**
 * LA SUITE D'UN RÔLE — SON SHOP, SON MAGAZINE
 *
 * « Chaque rôle a sa version du Shop, et son magazine. » On ne mélange rien : le
 * photographe ne voit pas la vaisselle, l'invité ne voit pas la sono. C'est ce
 * qui remplace les filtres — le filtre, c'est le rôle qu'on a choisi, et les
 * catégories restent à portée pour affiner ce qu'on regarde.
 *
 * Rien n'est ressaisi : les pièces viennent du catalogue du shop, les articles du
 * magazine du site. On dit seulement **ce qui concerne un rôle**, et pourquoi.
 */

/** Les catégories du shop qui concernent un rôle. Vide = tout le shop. */
const CATEGORIES: Record<string, string[]> = {
  maries: [],
  invites: ['tenues', 'papeterie', 'insolite'],
  temoin: ['papeterie', 'insolite'],
  officiant: ['papeterie', 'deco'],
  traiteur: ['reception', 'mobilier'],
  mixologue: ['reception', 'lumiere'],
  patissier: ['reception', 'insolite'],
  dj: ['lumiere', 'mobilier'],
  saxophoniste: ['lumiere', 'insolite'],
  light_designer: ['lumiere'],
  photographe: ['deco', 'insolite'],
  videaste: ['lumiere', 'insolite'],
  fleuriste: ['deco'],
  navette_chauffeur: ['mobilier', 'insolite'],
  wedding_planner: ['papeterie', 'mobilier'],
  notaire_juriste: ['papeterie'],
  concierge_voyage: ['tenues', 'insolite'],
};

/**
 * Les mots qui rattachent un article à un rôle. Le magazine se cherche par ce
 * qu'il raconte : un conseil sur la lumière intéresse le DJ et le photographe.
 */
const MOTS: Record<string, string[]> = {
  maries: [],
  invites: ['invité', 'invités', 'rsvp', 'faire-part', 'tenue', 'dress code'],
  temoin: ['témoin', 'discours', 'faire-part'],
  officiant: ['cérémonie', 'officiant', 'vœux', 'rituel'],
  traiteur: ['menu', 'repas', 'dîner', 'traiteur', 'banquet', 'cocktail'],
  mixologue: ['cocktail', 'bar', 'champagne', 'boisson'],
  patissier: ['gâteau', 'dessert', 'sweet table', 'pièce montée'],
  dj: ['dj', 'piste', 'dancefloor', 'soirée', 'son'],
  saxophoniste: ['musique', 'live', 'groupe', 'concert', 'saxophone'],
  light_designer: ['lumière', 'lumière', 'éclairage', 'mapp'],
  photographe: ['photo', 'photographe', 'portrait', 'images', 'lumière'],
  videaste: ['vidéo', 'film', 'rush', 'images'],
  fleuriste: ['fleur', 'bouquet', 'végétal', 'floral', 'arche'],
  navette_chauffeur: ['transport', 'navette', 'voiture', 'trajet'],
  wedding_planner: ['planning', 'organisation', 'coordination', 'timeline'],
  notaire_juriste: ['contrat', 'papiers', 'légal', 'acte'],
  concierge_voyage: ['voyage', 'lune de miel', 'hôtel', 'destination'],
};

/** Une phrase, courte, dite au nom du rôle : le Shop de qui, et pourquoi. */
const PHRASES_SHOP: Record<string, string> = {
  maries: 'Tout ce qu’il faut, sans rien acheter pour une seule journée.',
  invites: 'De quoi arriver juste : la tenue, la papeterie, l’objet qui fait parler.',
  temoin: 'Ce qui se prépare, ce qui se dit, et ce qui se garde.',
  officiant: 'Papeterie, déco de cérémonie, et de quoi tenir les textes.',
  traiteur: 'La table, le linge, le service — ce qui sert à nourrir.',
  mixologue: 'Le bar, la verrerie, la lumière du comptoir.',
  patissier: 'La table sucrée, et ses accessoires.',
  dj: 'La lumière, la sono, la piste : de quoi tenir la nuit.',
  saxophoniste: 'Un peu de lumière, et de quoi se voir sur scène.',
  light_designer: 'Tout ce qui éclaire — du guirlande au projecteur.',
  photographe: 'Décor, lumière, objets : ce qui fait une belle image.',
  videaste: 'La lumière et la scène, ce que la caméra regarde.',
  fleuriste: 'Décor, contenants, végétal : de quoi composer.',
  navette_chauffeur: 'Mobilier et objets de trajet, pour accueillir.',
  wedding_planner: 'Papeterie, planning, mobilier : de quoi organiser.',
  notaire_juriste: 'Les papiers, les faire-part, les pièces à garder.',
  concierge_voyage: 'Tenues et objets : ce qui part avec les mariés.',
};

/** Ce que le rôle dit de son Shop, en une ligne. */
export function phraseShopDuRole(id: string): string {
  return PHRASES_SHOP[id] ?? 'Ce qui concerne ce rôle.';
}

/** Les catégories du Shop d'un rôle : celles qui le concernent. */
export function categoriesDuRole(id: string): string[] {
  return CATEGORIES[id] ?? [];
}

/**
 * Les pièces du Shop d'un rôle. Les mariés — et les rôles sans catégorie
 * propre — voient tout le catalogue : c'est leur mariage, après tout.
 */
export function piecesPourRole(id: string): ShopProduct[] {
  const categories = categoriesDuRole(id);
  if (categories.length === 0) return SHOP_PRODUCTS;
  return SHOP_PRODUCTS.filter((p) => categories.includes(p.category));
}

/** Un article parle-t-il de ce rôle ? On lit le titre, le chapô et le corps. */
function parleDuRole(article: Article, mots: string[]): boolean {
  if (mots.length === 0) return true;
  // Le titre et le chapô disent de quoi l'article parle ; le corps, lui, cite
  // tout le monde — on ne le lit pas pour ranger un article.
  const texte = `${article.title} ${article.intro} ${article.kicker}`.toLowerCase();
  return mots.some((mot) => texte.includes(mot));
}

/**
 * Les articles du Magazine d'un rôle : ceux qui parlent de lui. S'il n'y en a
 * pas — c'est rare —, le rôle reçoit les guides, plutôt que rien.
 */
export function articlesPourRole(id: string): Article[] {
  const mots = MOTS[id] ?? [];
  const siens = ALL_ARTICLES.filter((a: Article) => parleDuRole(a, mots));
  if (siens.length > 0) return siens;
  const guides = ALL_ARTICLES.filter((a: Article) => a.category === 'guide');
  return guides.length > 0 ? guides : ALL_ARTICLES;
}

/** Le rôle visé par une adresse `?role=…`, s'il existe. */
export function roleDuneAdresse(valeur: string | null): Personnage | undefined {
  return valeur ? personnageParId(valeur) : undefined;
}
