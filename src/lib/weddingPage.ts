import type { Article, Package, Rayon } from './superMariage';
import { CONVIVES, MAGASIN, PRIX_PAR_DOMAINE, euros } from './superMariage';
import { metiersParDomaine } from './weddingVendors';
import { signatureFor } from './themeSignatures';
import { getScenesForStyle } from './themeTimelineScenarios';
import { contentFor } from './universeContent';
import { styleById } from './weddingStyles';
import type { WeddingStyle } from './weddingStyles';
import { THEME_CONFIGS } from './themeConfigs';

/**
 * LA PAGE DE CHAQUE UNIVERS
 *
 * Chaque univers reçoit sa page entière — la même que le Supermarché 22H :
 * l'article, le programme, la playlist, les métiers, le récap en ticket, les
 * autres univers. Ce qui change d'un univers à l'autre n'est pas la page, c'est
 * son magasin : son enseigne, ses rayons, ses tarifs et sa caisse.
 *
 * Tout est dérivé du contenu de l'univers — jamais inventé : les articles du
 * récap sont ses horaires, ses trois métiers, ses petits suppléments et son
 * menu, et les prix suivent la gamme du domaine et le nombre de convives.
 */

/** Le geste d'un univers, s'il en a un : le Supermarché 22H et l'univers vierge
 *  n'en portent pas — leur nom n'est pas un geste, on n'en affiche donc aucun. */
export function gesteDe(styleId: string): string {
  return signatureFor(styleId)?.nom ?? '';
}

/** Le style typographique de la page, selon la nature de l'univers. */
export type Registre = 'magasin' | 'table' | 'billet';

export interface Enseigne {
  /** Le nom du magasin, en haut du ticket. */
  nom: string;
  /** La promesse, sous le nom. */
  slogan: string;
  /** Le rayon, en majuscules. */
  rayon: string;
  /** La caisse affichée. */
  caisse: string;
  ville: string;
}

export interface RayonUnivers extends Rayon {
  emoji: string;
}

export interface MagasinUnivers extends Enseigne {
  styleId: string;
  /** Le préfixe des numéros de ticket : il change à chaque univers. */
  prefixe: string;
  /** Le nom du service, sur la ligne de la formule. */
  service: string;
  rayons: RayonUnivers[];
  articles: Article[];
  packages: Package[];
  /** Les rayons ouverts d'entrée. */
  panierDeDepart: string[];
  /** Le registre typographique de la page. */
  registre: Registre;
  /** La couleur d'encre du papier, pour les pages sombres. */
  accent: string;
}

/* —————————————————————— les petites phrases par domaine —————————————————————— */

const DETAIL_PAR_DOMAINE: Record<string, (metier: string) => string> = {
  chef: (m) => `Le repas du jour J, tenu par un métier — ${m}.`,
  patissier: (m) => `La pièce montée, la découpe, les parts — ${m}.`,
  photographe: () => 'Les images de la journée, du premier regard au dernier tour de piste.',
  musicien: (m) => `La musique live du jour J, avec ${m}.`,
  dj: (m) => `Les platines et le dancefloor, tenus par ${m}.`,
  fleuriste: (m) => `Les fleurs, les arches et les tables — ${m}.`,
  officiant: (m) => `La cérémonie, tenue et portée — ${m}.`,
  mixologue: (m) => `Le bar, les cocktails et les toasts — ${m}.`,
  createur: (m) => `Les tenues et les matières — ${m}.`,
  artisan: (m) => `Le décor et le mobilier, faits main — ${m}.`,
  regisseur: (m) => `La logistique et le lieu, sans accroc — ${m}.`,
  polyvalent: (m) => `Le coup de main, au bon moment — ${m}.`,
};

/** Le domaine d'un métier : c'est lui qui donne le tarif et la phrase. */
function domaineDuMetier(role: string): string {
  const domaine = metiersParDomaine().find((d) => d.metiers.some((m) => m.role === role));
  return domaine?.key ?? 'polyvalent';
}

/** Les petits suppléments : leurs mots changent, la forme reste. */
const PLUS_PAR_REGISTRE: Record<Registre, Array<{ id: string; label: string; detail: (style: WeddingStyle) => string; prix: number; quantite?: number }>> = {
  magasin: [
    { id: 'caddie', label: 'Caddie gravé à vos prénoms', detail: () => 'Deux caddies, gravure au laser, à emporter après la cérémonie.', prix: 90 },
    { id: 'enseigne', label: 'L’enseigne lumineuse du lieu', detail: (s) => `Le nom de ${s.name}, monté et livré chez vous.`, prix: 340 },
    { id: 'camera', label: 'Caméra + film de la soirée', detail: () => 'Le film du jour J, vu depuis le lieu.', prix: 1200 },
    { id: 'couvertures', label: 'Couvertures pour les invités', detail: () => 'Le cocktail dehors, cinq minutes, tout le monde couvert.', prix: 3, quantite: CONVIVES },
    { id: 'navette', label: 'Navette invités', detail: () => 'Aller-retour en car, deux départs, un seul retour à 4h.', prix: 350 },
    { id: 'feu', label: 'Feu d’artifice du soir', detail: () => 'Quatre minutes, tirées du toit.', prix: 1500 },
    { id: 'brunch', label: 'Brunch du lendemain', detail: () => 'Viennoiseries, jus, à 11h, dans le lieu vide.', prix: 22, quantite: CONVIVES },
  ],
  table: [
    { id: 'vaisselle', label: 'Vaisselle de la maison', detail: () => 'Assiettes, verres et couverts choisis un par un.', prix: 180 },
    { id: 'nappe', label: 'Nappe brodée à vos prénoms', detail: () => 'Broderie à la main, à garder après la soirée.', prix: 240 },
    { id: 'cadeaux', label: 'Cadeaux d’invités', detail: () => 'Le présent de table, emballé, posé à chaque place.', prix: 14, quantite: CONVIVES },
    { id: 'gouter', label: 'Goûter des enfants', detail: () => 'Une table à part, pour que les parents respirent.', prix: 12, quantite: Math.round(CONVIVES * 0.2) },
    { id: 'vin', label: 'Bouteilles de la maison', detail: () => 'Le vin du repas, choisi avec le chef.', prix: 28, quantite: Math.round(CONVIVES / 4) },
    { id: 'brunch', label: 'Déjeuner du lendemain', detail: () => 'Ce qui reste, resservi à midi, dehors.', prix: 22, quantite: CONVIVES },
  ],
  billet: [
    { id: 'bracelet', label: 'Bracelets d’entrée', detail: () => 'Un bracelet par invité, numéroté, à garder.', prix: 4, quantite: CONVIVES },
    { id: 'affiche', label: 'Affiche de la soirée', detail: (s) => `L’affiche de ${s.name}, imprimée et numérotée.`, prix: 120 },
    { id: 'camera', label: 'Caméra + film de la soirée', detail: () => 'Le film du jour J, monté, avec le son d’ambiance.', prix: 1200 },
    { id: 'navette', label: 'Navette de nuit', detail: () => 'Deux départs, un retour à 4h, pour ceux qui tiennent.', prix: 350 },
    { id: 'feu', label: 'Feu d’artifice de clôture', detail: () => 'Quatre minutes, à la fin du dernier morceau.', prix: 1500 },
    { id: 'brunch', label: 'Brunch du lendemain', detail: () => 'À 11h, dans le lieu vide, café et viennoiseries.', prix: 22, quantite: CONVIVES },
  ],
};

/* ————————————————————————————— les registres ————————————————————————————— */

/**
 * Trois registres, choisis univers par univers : le magasin (on fait ses
 * courses), la table (on passe à table), le billet (on prend un billet pour la
 * soirée). Ils changent le papier, la typographie et les petits suppléments.
 */
const REGISTRES: Record<string, Registre> = {
  /* La table : on sert, on goûte, on reste. */
  traditionnel: 'table',
  corse: 'table',
  reunion: 'table',
  'chateau-moderne': 'table',
  'garden-party': 'table',
  'foret-noire': 'table',
  'phare-atlantique': 'table',
  brocante: 'table',
  'co-mariage': 'table',
  /* Le billet : on entre, on danse, on sort au petit matin. */
  vegas: 'billet',
  club: 'billet',
  punk: 'billet',
  cinema: 'billet',
  'last-minute': 'billet',
  'new-york': 'billet',
  'rooftop-paris': 'billet',
  cosmic: 'billet',
  abyssal: 'billet',
  'orient-express': 'billet',
  desert: 'billet',
  laverie: 'billet',
  brutal: 'billet',
  'noir-blanc': 'billet',
  vierge: 'billet',
  /* Le magasin : le Supermarché 22H, et lui seul. */
  supermarche: 'magasin',
};

function registreDe(id: string): Registre {
  return REGISTRES[id] ?? 'magasin';
}

/** L'enseigne de chaque univers : le nom du magasin, écrit dans sa langue. */
function enseigneDe(style: WeddingStyle, signature: string): Enseigne {
  /* Le Supermarché 22H garde l'enseigne de son magasin : c'est lui qui a inventé
     le ticket, ses rayons et sa caisse 3 (voir `superMariage.ts`). */
  if (style.id === 'supermarche') {
    return {
      nom: MAGASIN.nom,
      slogan: MAGASIN.slogan,
      rayon: MAGASIN.rayon,
      caisse: MAGASIN.caisse,
      ville: MAGASIN.ville,
    };
  }

  const nom = style.name.toUpperCase();
  const enseigne = (signature || style.tagline).toUpperCase();
  const mot = (style.tagline || style.name).split(/[,·—]/)[0]!.trim();
  const caisse = registreDe(style.id) === 'billet' ? 'CONTRÔLE' : 'CAISSE 1';
  const rayon = `RAYON 1 · ${enseigne}`;
  const contenu = contentFor(style);
  return {
    nom,
    slogan: mot,
    rayon,
    caisse,
    ville: `${contenu.couple.venue} · ${contenu.couple.city}`,
  };
}

/* ————————————————————————— le magasin d'un univers ————————————————————————— */

const cache = new Map<string, MagasinUnivers>();

export function magasinFor(styleId: string): MagasinUnivers {
  const memo = cache.get(styleId);
  if (memo) return memo;

  const style = styleById(styleId);
  const contenu = contentFor(style);
  const signature = gesteDe(styleId);
  const registre = registreDe(styleId);
  const enseigne = enseigneDe(style, signature);
  /* Le préfixe du ticket vient de l'identifiant de l'univers : il est court, sans
     accent, et deux univers ne portent jamais le même numéro. */
  const prefixe = styleId
    .normalize('NFD')
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase()
    .slice(0, 3)
    .padEnd(3, 'X');

  /* Le rayon des horaires : les moments du jour J, à l'heure près. */
  const moments = getScenesForStyle(styleId);
  const rayonHoraires: Article[] = moments.map((moment, i) => ({
    id: `horaire-${moment.time}`,
    label: `${moment.time} · ${moment.title}`,
    detail: [moment.narrativeScript, moment.ambianceDetail].filter(Boolean).join(' — '),
    prix: [350, 900, 1200, 1500, 2400][i] ?? 500,
  }));

  /* Le rayon des métiers : les trois métiers de cet univers, à leur tarif. Un
     univers vierge n'impose aucun métier : il prend alors ceux de ses voisins,
     et le rayon le dit. */
  const domaines = metiersParDomaine();
  const metiersDe = (id: string) => {
    const vus = new Set<string>();
    const sortie: Array<{ role: string; short: string }> = [];
    for (const domaine of domaines) {
      for (const metier of domaine.metiers) {
        if (!metier.universes.some((u) => u.id === id)) continue;
        if (vus.has(metier.role)) continue;
        vus.add(metier.role);
        sortie.push({ role: metier.role, short: metier.short });
      }
    }
    return sortie.slice(0, 3);
  };

  let rolesDeLUnivers = metiersDe(styleId);
  const voisinDeSecours = style.complementaryStyleIds.find((id) => metiersDe(id).length > 0);
  const metiersVoisins = rolesDeLUnivers.length === 0 && voisinDeSecours ? metiersDe(voisinDeSecours) : [];
  if (metiersVoisins.length > 0) rolesDeLUnivers = metiersVoisins;

  const rayonMetiers: RayonUnivers = {
    key: 'rayon-metiers',
    label: 'Rayon Métiers',
    sousTitre: metiersVoisins.length > 0
      ? `Cet univers n’impose rien : voici les trois métiers de ${styleById(voisinDeSecours!).name}.`
      : `Les trois métiers qui font tourner ${style.name}.`,
    emoji: '🛠',
    articles: rolesDeLUnivers.map((metier, i) => {
      const domaine = domaineDuMetier(metier.role);
      const prix = PRIX_PAR_DOMAINE[domaine] ?? PRIX_PAR_DOMAINE.polyvalent;
      const phrase = DETAIL_PAR_DOMAINE[domaine]?.(metier.short) ?? `Le métier du jour J — ${metier.short}.`;
      return {
        id: `metier-${metier.role}`,
        label: metier.short,
        detail: phrase,
        // Trois gammes dans le rayon : le premier métier est le plus installé.
        prix: Math.round((prix * (1.15 - i * 0.1)) / 10) * 10,
        univers: style.name,
      };
    }),
  };

  /* Le rayon de la table : le service et les plats de l'univers. */
  const rayonTable: RayonUnivers = {
    key: 'rayon-table',
    label: 'Rayon Table',
    sousTitre: contenu.menu.service,
    emoji: registre === 'billet' ? '🧁' : '🍽',
    articles: contenu.menu.items.slice(0, 3).map((plat, i) => ({
      id: `table-${i + 1}`,
      label: plat,
      detail: contenu.menu.service,
      prix: [28, 14, 9][i] ?? 15,
      quantite: CONVIVES,
    })),
  };

  /* Le rayon des petits prix : selon le registre de l'univers. */
  const rayonPlus: RayonUnivers = {
    key: 'rayon-plus',
    label: 'Rayon Petits prix',
    sousTitre: 'Ce qui ne change pas le mariage, mais qui se raconte.',
    emoji: '✨',
    articles: (PLUS_PAR_REGISTRE[registre] ?? PLUS_PAR_REGISTRE.billet).map((article) => ({
      id: `plus-${article.id}`,
      label: article.label,
      detail: article.detail(style),
      prix: article.prix,
      ...(article.quantite ? { quantite: article.quantite } : {}),
    })),
  };

  const rayons: RayonUnivers[] = [
    { key: 'rayon-moments', label: 'Rayon Horaires', sousTitre: 'Le programme du jour J, à l’heure près.', emoji: '🕰', articles: rayonHoraires },
    rayonMetiers,
    rayonTable,
    rayonPlus,
  ];

  const articles = rayons.flatMap((r) => r.articles);

  /* Le menu : les mots de l'univers, servi en trois formules — et offert :
     c'est la carte de fidélité, le rabais de 10 % sur la main-d'œuvre. */
  const extraits = contenu.menu.items.slice(3, 6);
  const formule = (n: number, nom: string, mots: string, prix: number): Package => ({
    id: `menu-${n}`,
    name: nom,
    prix,
    description: mots,
    features: contenu.menu.items.slice(0, 2 + n),
  });
  const packages: Package[] = [
    formule(0, 'Complet', `${contenu.menu.service} — le repas entier, du premier plat au café, pour ${CONVIVES} convives.`, 0),
    formule(1, 'Plus', `${contenu.menu.service}, augmenté — ${extraits[0] ?? 'un plat de plus'}, et le service en salle.`, 0),
    formule(2, 'Grand', `Tout : ${contenu.menu.items.slice(0, 3).join(' · ')}.`, 0),
  ];

  /* Le panier de départ : leurs trois moments forts, leur premier métier, la table. */
  const panierDeDepart = [
    ...rayonHoraires.slice(0, 3).map((a) => a.id),
    ...(rayonMetiers.articles[0] ? [rayonMetiers.articles[0].id] : []),
    ...(rayonTable.articles[0] ? [rayonTable.articles[0].id] : []),
  ].slice(0, 6);

  const magasin: MagasinUnivers = {
    ...enseigne,
    styleId,
    prefixe,
    service: contenu.menu.service,
    rayons,
    articles,
    packages,
    panierDeDepart,
    registre,
    accent: style.accent,
  };
  cache.set(styleId, magasin);
  return magasin;
}

/* ————————————————————————— la page, en données ————————————————————————— */

export interface PageUnivers {
  styleId: string;
  style: WeddingStyle;
  magasin: MagasinUnivers;
  signature: string;
  registre: Registre;
  /** L'article de magazine : les mots de l'univers, sa formule d'ouverture. */
  magazine: { surtitre: string; titre: string; annonce: string; texte: (noms: string) => string };
  /** La phrase de la lettrine : la première lettre du premier prénom. */
  lettrineDe: (noms: string) => string;
}

/**
 * Le texte de l'article, quand l'univers n'a pas de config magazine : il est
 * composé de ses propres mots — sa ville, son décor, son service, ses couleurs.
 * La phrase est la même pour tous, le contenu ne l'est pas.
 */
function texteDepuisLeContenu(style: WeddingStyle, signature: string): (noms: string) => string {
  const contenu = contentFor(style);
  return (noms) =>
    `${noms} ont choisi un mariage qui n’existe qu’ici. À ${contenu.couple.city}, ${contenu.couple.season.toLowerCase()}, ` +
    `la journée se tient à ${contenu.couple.venue} — ${contenu.hero.subtitle.toLowerCase()} ` +
    `Tout est prévu à l’heure près : ${contenu.couple.guests} convives, un service pensé pour eux, et un geste qui ne se répète pas — ` +
    `${signature.toLowerCase()}, la marque de cet univers. Le programme, la musique et les métiers de la journée sont déjà là, sur cette page. ` +
    `Dress code : ${contenu.couple.dressCode.toLowerCase()}. ${contenu.rsvp.invitation}.`;
}

export function pageFor(styleId: string): PageUnivers {
  const style = styleById(styleId);
  const signature = gesteDe(styleId);
  const config = THEME_CONFIGS[styleId];

  const magazine = config
    ? {
      surtitre: config.editorial.announcement,
      titre: config.editorial.story_title,
      annonce: config.editorial.hero_subtitle,
      texte: (noms: string) => {
        const [a, b] = noms.split(' & ');
        return config.editorial.story_text(a ?? 'Ils', b ?? 'eux');
      },
    }
    : {
      surtitre: style.tagline,
      titre: `Un mariage signé ${style.name}`,
      annonce: contentFor(style).hero.subtitle,
      texte: (noms: string) => {
        const [a, b] = noms.split(' & ');
        return texteDepuisLeContenu(style, signature)([a ?? 'Ils', b ?? 'eux'].join(' & '));
      },
    };

  return {
    styleId,
    style,
    magasin: magasinFor(styleId),
    signature,
    registre: magasinFor(styleId).registre,
    magazine,
    lettrineDe: (noms: string) => noms.trim().slice(0, 1).toUpperCase() || 'I',
  };
}

/** Le prix le plus bas du rayon : la pastille « à partir de », sur les cartes. */
export function aPartirDe(styleId: string): string {
  const magasin = magasinFor(styleId);
  const bas = magasin.articles.reduce((n, a) => Math.min(n, a.prix * (a.quantite ?? 1)), Number.POSITIVE_INFINITY);
  return euros(Number.isFinite(bas) ? bas : 0);
}

/** Toutes les pages, pour la liste des univers. */
export function toutesLesPages(styleIds: string[]): PageUnivers[] {
  return styleIds.map((id) => pageFor(id));
}
