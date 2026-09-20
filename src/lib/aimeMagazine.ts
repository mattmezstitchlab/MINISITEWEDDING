import { ALL_ARTICLES, INSOLITE_ARTICLES, UNIVERSE_ARTICLES, type Article } from './magazine';

/**
 * AIME MAGAZINE — LA REVUE
 *
 * Le magazine du site ne se range plus par filtres : il se range par **éditions**.
 * Une édition, c'est **un thème**, et sous ce thème les articles qui le portent —
 * comme un vrai magazine qu'on feuillette. La couverture dit la marque (AIME
 * MAGAZINE, déposée à l'INPI), le thème, et **les titres à la une**, écrits en bas
 * de la photo, exactement comme sur un kiosque.
 *
 * **Un thème, ou plusieurs autour d'un même sujet** : une édition peut rassembler
 * les univers, une autre la lumière et l'image, une autre encore la table, la
 * nuit, les métiers. Les éditions sont **calculées à partir des vrais articles**
 * (mots-clés lus sur le titre, le chapô et la signature) et une édition qui ne
 * rassemblerait pas au moins deux articles n'existe pas : jamais de couverture
 * vide.
 */

/** La marque déposée. */
export const MARQUE_MAGAZINE = 'AIME MAGAZINE';

export interface CouvertureMagazine {
  id: string;
  /** Le numéro de l'édition : « 01 ». */
  numero: string;
  /** La marque, écrite en haut de la couverture. */
  marque: string;
  /** Le thème de l'édition. */
  theme: string;
  /** Ce que l'édition rassemble, en une ligne. */
  sousTitre: string;
  /** Le visuel de couverture — celui de son premier article. */
  visuel: string;
  /** La couleur de l'édition. */
  accent: string;
  /** Les titres écrits sur la couverture, en bas. */
  aLaUne: string[];
  /** Les articles de l'édition. */
  articles: Article[];
}

interface Regle {
  id: string;
  theme: string;
  sousTitre: string;
  accent: string;
  /** Ce qui entre dans l'édition. */
  prend: (article: Article) => boolean;
  /** Les mots du thème, quand c'est un thème — ils servent à ordonner. */
  mots?: string[];
}

/** Le texte dans lequel on lit un mot : le titre, le chapô, la signature. */
function texteDe(article: Article): string {
  return `${article.title} ${article.intro} ${article.kicker}`.toLowerCase();
}

const contient = (mots: string[]) => (article: Article) => mots.some((mot) => texteDe(article).includes(mot));

/**
 * **OÙ LE MOT APPARAÎT** — un titre vaut mieux qu'une signature, une signature
 * mieux qu'un chapô. C'est ce qui met en avant l'article qui traite vraiment le
 * sujet, plutôt que celui qui le croise.
 */
const OU_TITRE = 0;
const OU_KICKER = 1;
const OU_INTRO = 2;
const OU_JAMAIS = 3;

function ouEstLeMot(article: Article, mots: string[]): number {
  const titre = article.title.toLowerCase();
  const kicker = article.kicker.toLowerCase();
  const intro = article.intro.toLowerCase();
  if (mots.some((mot) => titre.includes(mot))) return OU_TITRE;
  if (mots.some((mot) => kicker.includes(mot))) return OU_KICKER;
  if (mots.some((mot) => intro.includes(mot))) return OU_INTRO;
  return OU_JAMAIS;
}

/**
 * LES ÉDITIONS — l'ordre est celui du kiosque. Les trois premières familles sont
 * données (par catégorie), les autres se lisent dans les articles.
 */
/** Les mots de chaque thème, écrits une fois : ils ouvrent l'édition et l'ordonnent. */
const MOTS_JOUR_J = ['heure', 'programme', 'déroulé', 'minut', 'timing', 'chrono', 'après', 'aube', '22h', '23h'];
const MOTS_LUMIERE = ['photo', 'lumière', 'portrait', '35mm', '35 mm', 'image', 'caméra', 'pellicule', 'film', 'prise de vue'];
const MOTS_TABLE = ['repas', 'menu', 'dîner', 'gâteau', 'cocktail', 'bar', 'vin', 'champagne', 'buffet', 'allerg', 'dessert'];
const MOTS_VEGETAL = ['fleur', 'bouquet', 'végétal', 'jardin', 'feuillage', 'arche', 'plante'];
const MOTS_METIERS = ['métier', 'prestataire', 'traiteur', 'dj', 'fleuriste', 'photographe', 'planner', 'chauffeur', 'régie'];
const MOTS_NUIT = ['nuit', 'danse', 'piste', 'minuit', 'dernière', 'bal'];

const REGLES: Regle[] = [
  {
    id: 'univers',
    theme: 'Les univers, racontés',
    sousTitre: 'Un mariage par univers : le lieu, la journée, les métiers',
    accent: '#0B0C12',
    prend: (a) => a.category === 'univers',
  },
  {
    id: 'jour-j',
    theme: 'Le jour J, heure par heure',
    sousTitre: 'Les heures, les moments, et ce qui ne s’improvise pas',
    accent: '#B45309',
    prend: contient(MOTS_JOUR_J),
    mots: MOTS_JOUR_J,
  },
  {
    id: 'lumiere',
    theme: 'Lumière & Image',
    sousTitre: 'Ce qui reste : la photographie, le film, la lumière du soir',
    accent: '#1D4ED8',
    prend: contient(MOTS_LUMIERE),
    mots: MOTS_LUMIERE,
  },
  {
    id: 'table',
    theme: 'La table',
    sousTitre: 'Le repas, le bar, le dessert — ce dont on se souvient',
    accent: '#9F1239',
    prend: contient(MOTS_TABLE),
    mots: MOTS_TABLE,
  },
  {
    id: 'vegetal',
    theme: 'Végétal & Fleurs',
    sousTitre: 'Les fleurs, les feuillages, les jardins qui tiennent une journée',
    accent: '#15803D',
    prend: contient(MOTS_VEGETAL),
    mots: MOTS_VEGETAL,
  },
  {
    id: 'metiers',
    theme: 'Les métiers du jour J',
    sousTitre: 'Qui fait quoi, et à quelle heure on les appelle',
    accent: '#4C1D95',
    prend: contient(MOTS_METIERS),
    mots: MOTS_METIERS,
  },
  {
    id: 'nuit',
    theme: 'La nuit',
    sousTitre: 'La piste, la dernière danse, et le petit matin',
    accent: '#111827',
    prend: contient(MOTS_NUIT),
    mots: MOTS_NUIT,
  },
  {
    id: 'guides',
    theme: 'Ce qu’on oublie toujours',
    sousTitre: 'Rétroplanning, budget, cagnotte, réponses, régimes',
    accent: '#0F766E',
    prend: (a) => a.category === 'guide',
  },
  {
    id: 'insolite',
    theme: 'Insolite',
    sousTitre: 'Ce qui sort du cadre, et qui marche quand même',
    accent: '#C2410C',
    prend: (a) => a.category === 'insolite',
  },
];

/** Trois titres sur la couverture : ceux qu'on lit au kiosque. */
const TITRES_EN_COUVERTURE = 3;

/**
 * Dans une édition de thème, **les articles qui traitent le sujet frontalement**
 * passent devant (les guides, l'insolite) ; les univers suivent, parce qu'ils
 * parlent de tout à la fois. L'édition des univers, elle, garde l'ordre du
 * catalogue.
 */
function ordonner(articles: Article[], regle: Regle): Article[] {
  if (!regle.mots) return articles;
  const mots = regle.mots;
  const poids = (a: Article) => ouEstLeMot(a, mots) * 2 + (a.category === 'univers' ? 1 : 0);
  return [...articles].sort((a, b) => poids(a) - poids(b) || a.title.localeCompare(b.title, 'fr'));
}

export const COUVERTURES: CouvertureMagazine[] = REGLES.map((regle) => {
  const articles = ordonner(ALL_ARTICLES.filter(regle.prend), regle);
  return { regle, articles };
})
  .filter(({ articles }) => articles.length >= 2)
  .map(({ regle, articles }, i) => ({
    id: regle.id,
    numero: String(i + 1).padStart(2, '0'),
    marque: MARQUE_MAGAZINE,
    theme: regle.theme,
    sousTitre: regle.sousTitre,
    visuel: articles[0]!.cover,
    accent: regle.accent,
    aLaUne: articles.slice(0, TITRES_EN_COUVERTURE).map((a) => a.title),
    articles,
  }));

export function couvertureParId(id: string): CouvertureMagazine | undefined {
  return COUVERTURES.find((c) => c.id === id);
}

/** L'édition d'un article : celle qui le porte, ou la première. */
export function couvertureDArticle(slug: string): CouvertureMagazine | undefined {
  return COUVERTURES.find((c) => c.articles.some((a) => a.slug === slug)) ?? COUVERTURES[0];
}

/** Combien d'articles la revue couvre, éditions et doublons compris. */
export function articlesDeLaRevue(): number {
  return UNIVERSE_ARTICLES.length + INSOLITE_ARTICLES.length + ALL_ARTICLES.filter((a) => a.category === 'guide').length;
}
