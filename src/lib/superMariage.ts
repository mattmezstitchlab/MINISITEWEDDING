import { THEME_CONFIGS } from './themeConfigs';
import { contentFor } from './universeContent';
import { styleById } from './weddingStyles';
import { metiersParDomaine } from './weddingVendors';

/**
 * SUPERMARIAGE — LE MAGASIN
 *
 * Faire son mariage comme on fait ses courses : on coche des horaires, on
 * prend des métiers, on ajoute des petits suppléments, on choisit un menu — et
 * on passe à la caisse. Le ticket de caisse n'est pas une image : c'est le
 * calcul exact de ce qui a été coché, ligne par ligne.
 *
 * Rien n'est inventé côté mariage : les horaires sont ceux du programme du
 * Supermarché 22H, les métiers sont ceux des univers et le nombre de convives
 * vient du contenu. Seuls les prix sont indicatifs — et c'est écrit sur le
 * ticket.
 */

export interface Article {
  id: string;
  label: string;
  detail: string;
  /** Prix unitaire, en euros. */
  prix: number;
  /** Nombre d'unités : une par personne pour ce qui se compte par invité. */
  quantite?: number;
  /** L'univers d'où vient ce métier, quand il vient d'un univers. */
  univers?: string;
  /** Venu du rayon 7 lui-même : il est en promotion. */
  promo?: boolean;
}

export interface Rayon {
  key: string;
  label: string;
  sousTitre: string;
  articles: Article[];
}

export interface Package {
  id: string;
  name: string;
  prix: number;
  description: string;
  features: string[];
  popular?: boolean;
}

const CONFIG = THEME_CONFIGS.supermarche;
const CONTENU = contentFor(styleById('supermarche'));

/** Le magasin : son nom, son rayon, sa caisse. */
export const MAGASIN = {
  nom: 'VOWS SUPERMARIAGE',
  rayon: 'RAYON 7 · TOUT POUR LE JOUR J',
  ville: `${CONTENU.couple.venue} · ${CONTENU.couple.city}`,
  caisse: 'CAISSE 3',
  slogan: 'Ouvert quand tout est fermé',
};

/** Le couple qui passe à la caisse — celui du Supermarché 22H. */
export const TICKET_COUPLE = {
  noms: CONTENU.couple.names,
  date: CONTENU.couple.date,
  venue: CONTENU.couple.venue,
  convives: CONTENU.couple.guests,
};

/** Le nombre de convives : c'est lui qui fait les quantités par personne. */
export const CONVIVES = CONTENU.couple.guests;

/**
 * Les tarifs par domaine — indicatifs, en euros. Ils servent à composer le
 * ticket, pas à facturer quoi que ce soit.
 */
export const PRIX_PAR_DOMAINE: Record<string, number> = {
  chef: 4500,
  patissier: 900,
  photographe: 1800,
  musicien: 1400,
  dj: 1100,
  fleuriste: 800,
  officiant: 700,
  mixologue: 900,
  createur: 1600,
  artisan: 600,
  regisseur: 1200,
  polyvalent: 500,
};

/** Le prix d'un horaire, rayon par rayon : plus la nuit avance, plus ça coûte. */
const PRIX_HORAIRES = [350, 900, 1200, 2400, 1500];

/* —————————————————————————— rayon 1 : les horaires —————————————————————————— */

const RAYON_HORAIRES: Article[] = CONFIG.programme.map((creneau, i) => ({
  id: `horaire-${creneau.time}`,
  label: `${creneau.time} · ${creneau.title}`,
  detail: `${creneau.description} — ${creneau.place}`,
  prix: PRIX_HORAIRES[i] ?? 500,
}));

/* ———————————————————————— rayons 2..N : les métiers ———————————————————————— */

/**
 * Les métiers de chaque domaine, trois par rayon, ceux du Supermarché 22H en
 * tête — ce sont les vendeurs de la maison, ils sont en promotion.
 */
const RAYONS_METIERS: Rayon[] = metiersParDomaine().map((domaine) => {
  const metiers = [...domaine.metiers].sort((a, b) => {
    const a7 = a.universes.some((u) => u.id === 'supermarche') ? 0 : 1;
    const b7 = b.universes.some((u) => u.id === 'supermarche') ? 0 : 1;
    return a7 - b7;
  });

  const prix = PRIX_PAR_DOMAINE[domaine.key] ?? PRIX_PAR_DOMAINE.polyvalent;

  return {
    key: `rayon-${domaine.key}`,
    label: `Rayon ${domaine.label}`,
    sousTitre: domaine.description,
    articles: metiers.slice(0, 3).map((metier, i) => {
      const maison = metier.universes.find((u) => u.id === 'supermarche');
      const univers = maison ?? metier.universes[0];
      return {
        id: `metier-${metier.role}`,
        label: metier.short,
        detail: metier.role,
        // Trois gammes par rayon : le premier métier est le plus cher.
        prix: Math.round((prix * (1.15 - i * 0.1)) / 10) * 10,
        univers: univers?.name,
        promo: Boolean(maison),
      };
    }),
  };
});

/* ———————————————————————— le rayon des petits prix ———————————————————————— */

const RAYON_SUPPLEMENTS: Article[] = [
  {
    id: 'sup-caddie',
    label: 'Caddie gravé à vos prénoms',
    detail: 'Deux caddies, gravure au laser, à emporter après la cérémonie.',
    prix: 90,
  },
  {
    id: 'sup-neon',
    label: 'Néon « SUPERMARCHÉ »',
    detail: 'Le néon du magasin, démonté et livré chez vous.',
    prix: 340,
  },
  {
    id: 'sup-camera',
    label: 'Caméra de surveillance + film',
    detail: 'Le film de la soirée, vu par la caméra du rayon 7.',
    prix: 1200,
  },
  {
    id: 'sup-manteaux',
    label: 'Manteaux polaires -18 °C',
    detail: 'Le cocktail au rayon surgelés, cinq minutes, tout le monde couvert.',
    prix: 3,
    quantite: CONVIVES,
  },
  {
    id: 'sup-tapis',
    label: 'Tapis de caisse roulant',
    detail: 'Le dîner servi sur le tapis de la caisse 3, qui tourne lentement.',
    prix: 250,
  },
  {
    id: 'sup-prixchoc',
    label: 'Panneau « PRIX CHOC » à vos prénoms',
    detail: 'Fabriqué pour la soirée, cartonné, jaune fluo.',
    prix: 60,
  },
  {
    id: 'sup-photobooth',
    label: 'Photobooth caisse automatique',
    detail: 'Un photobooth déguisé en caisse de supermarché.',
    prix: 480,
  },
  {
    id: 'sup-navette',
    label: 'Navette invités',
    detail: 'Aller-retour en car, deux départs, un seul retour à 4h.',
    prix: 350,
  },
  {
    id: 'sup-feu',
    label: 'Feu d’artifice sur le parking',
    detail: 'Quatre minutes, tiré du toit du magasin.',
    prix: 1500,
  },
  {
    id: 'sup-brunch',
    label: 'Brunch du lendemain',
    detail: 'Rayon frais, viennoiseries, jus, à 11h dans le magasin vide.',
    prix: 22,
    quantite: CONVIVES,
  },
];

export const RAYONS: Rayon[] = [
  {
    key: 'rayon-horaires',
    label: 'Rayon Horaires',
    sousTitre: 'Le programme du jour J, à l’heure près.',
    articles: RAYON_HORAIRES,
  },
  ...RAYONS_METIERS,
  {
    key: 'rayon-supplements',
    label: 'Rayon Petits prix',
    sousTitre: 'Ce qui ne change pas le mariage mais qui se raconte.',
    articles: RAYON_SUPPLEMENTS,
  },
];

/** Le menu du magasin : trois formules, comme trois chariots déjà remplis. */
export const PACKAGES: Package[] = CONFIG.packages.map((pkg) => ({
  id: pkg.id,
  name: pkg.name,
  prix: Number(pkg.price.replace(/[^\d]/g, '')) || 0,
  description: pkg.description,
  features: pkg.features,
  popular: pkg.popular,
}));

/** Les rayons ouverts d'entrée : les trois horaires forts et un traiteur. */
export const PANIER_DEPART: string[] = [
  'horaire-22:17',
  'horaire-22:30',
  'horaire-23:00',
  RAYONS_METIERS[0]?.articles[0]?.id ?? '',
].filter(Boolean);

/** Tous les articles du magasin, à plat. */
export const ARTICLES: Article[] = RAYONS.flatMap((rayon) => rayon.articles);

export function articleParId(id: string): Article | undefined {
  return ARTICLES.find((a) => a.id === id);
}

export function packageParId(id: string | null | undefined): Package | undefined {
  return PACKAGES.find((p) => p.id === id);
}

/* ————————————————————————— la caisse ————————————————————————— */

export const euros = (n: number): string =>
  `${n.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €`;

/** Le prix d'une ligne : l'unité multipliée par les têtes. */
export function prixDeLArticle(article: Article): number {
  return article.prix * (article.quantite ?? 1);
}

/**
 * Ce qui est dans le caddie, mis à plat : horaires d'abord, puis les rayons.
 * Le catalogue est un paramètre : le Supermarché passe le sien, et chaque
 * univers passe le sien — la caisse ne change pas de code pour autant.
 */
export function articlesDuPanier(selection: string[], articles: Article[] = ARTICLES): Article[] {
  const choisis = new Set(selection);
  return articles.filter((a) => choisis.has(a.id));
}

export function sousTotal(selection: string[], articles: Article[] = ARTICLES): number {
  return articlesDuPanier(selection, articles).reduce((n, a) => n + prixDeLArticle(a), 0);
}

/** La carte de fidélité : un menu choisi, et la main-d’œuvre passe à -10 %. */
export const TAUX_FIDELITE = 0.1;

export function remiseFidelite(sous: number, packageId?: string | null): number {
  return packageId ? Math.round(sous * TAUX_FIDELITE) : 0;
}

/** La TVA est incluse : on ne l'ajoute pas, on la montre. */
export const TVA = 0.2;

export function tvaIncluse(total: number): number {
  return Math.round(total - total / (1 + TVA));
}

export interface LigneTicket {
  id: string;
  label: string;
  detail?: string;
  quantite: number;
  prixUnitaire: number;
  total: number;
  promo?: boolean;
}

/** Une ligne par article coché, plus le menu s'il y en a un. */
export function lignesDuTicket(
  selection: string[],
  packageId?: string | null,
  articles: Article[] = ARTICLES,
  packages: Package[] = PACKAGES,
): LigneTicket[] {
  const lignes: LigneTicket[] = articlesDuPanier(selection, articles).map((a) => ({
    id: a.id,
    label: a.label,
    detail: a.promo ? `Promo rayon 7 · ${a.detail}` : a.detail,
    quantite: a.quantite ?? 1,
    prixUnitaire: a.prix,
    total: prixDeLArticle(a),
    promo: a.promo,
  }));

  const menu = packages.find((m) => m.id === packageId);
  if (menu) {
    lignes.push({
      id: `menu-${menu.id}`,
      label: `Menu ${menu.name}`,
      detail: menu.description,
      quantite: 1,
      prixUnitaire: menu.prix,
      total: menu.prix,
    });
  }

  return lignes;
}

export interface TotalCaisse {
  sousTotal: number;
  remise: number;
  tva: number;
  total: number;
  articles: number;
}

/** Le calcul complet d'un panier : ce que la caisse affiche, et ce que le ticket imprime. */
export function totalCaisse(
  selection: string[],
  packageId?: string | null,
  articles: Article[] = ARTICLES,
  packages: Package[] = PACKAGES,
): TotalCaisse {
  const lignes = lignesDuTicket(selection, packageId, articles, packages);
  const sous = lignes.reduce((n, l) => n + l.total, 0);
  const remise = remiseFidelite(sous, packageId);
  const total = sous - remise;
  return {
    sousTotal: sous,
    remise,
    tva: tvaIncluse(total),
    total,
    articles: lignes.length,
  };
}

/**
 * Le numéro du ticket : il ne change pas d'un rendu à l'autre, il est dérivé de
 * ce qui a été coché. Deux tickets différents ne portent jamais le même numéro.
 */
export function numeroDeTicket(selection: string[], packageId?: string | null, prefixe = 'SM'): string {
  const cle = [...selection, packageId ?? ''].sort().join('|');
  let h = 0;
  for (let i = 0; i < cle.length; i += 1) h = (h * 31 + cle.charCodeAt(i)) % 1_000_000;
  const lettres = h.toString(36).toUpperCase().padStart(4, '0').slice(-4);
  return `${prefixe}-${String(selection.length).padStart(2, '0')}-${lettres}`;
}

/** Les barres du code-barres : déterministes, elles lisent le numéro du ticket. */
export function barresTicket(numero: string): number[] {
  return numero.split('').map((c) => (c.charCodeAt(0) % 3) + 1);
}
