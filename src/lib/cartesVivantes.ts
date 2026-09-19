import { ALL_STYLES, styleById, type WeddingStyle } from './weddingStyles';
import { getScenesForStyle } from './themeTimelineScenarios';
import { CATALOGUE, morceauxDeLaPlaylist, PLAYLIST_DEPART, type Morceau } from './weddingPlaylist';
import { badgeDUnivers } from './magazine';
import { SHOP_PRODUCTS, modeLabel, type ShopProduct } from './shopData';
import { metiersVoisins, pageMetier, slugDeRole, tousLesMetiers, type PageMetier } from './metierPage';

/**
 * LA CARTE VIVANTE — LA CARTE MULTIFONCTION, MULTICOUCHE
 *
 * Une seule carte sert partout : dans la bande du hero, sur un article, au
 * shop, chez un prestataire. Elle porte toujours les mêmes couches — un visuel,
 * un badge, un nom, une précision, **un média qu'on lance** et **un cœur qu'on
 * compte** — et c'est la page qui décide de ce qu'elle raconte : un univers, un
 * moment du Jour J, un produit, un métier.
 *
 * Ce fichier ne fait que la fabriquer : les données viennent des sources du
 * site (univers, programme, morceaux, catalogue du shop, métiers). Rien n'est
 * ressaisi, et une carte n'invente jamais un média qu'elle n'a pas.
 */

export interface MediaDeCarte {
  /** Le visuel — la première couche de la carte. */
  image: string;
  /** Le média animé du hero, quand le site en a un. */
  video?: string;
  /** L'extrait sonore : le morceau qui va avec la carte. */
  audio?: string;
  /** Ce que le média raconte, quand on le lance. */
  legende?: string;
}

export interface CarteVivante {
  /** L'identifiant de la carte dans la page. */
  id: string;
  /** La clé de l'avis : c'est elle qui compte les cœurs. */
  cle: string;
  titre: string;
  sousTitre?: string;
  /** La pastille du haut, sur la pochette : une heure, un mode, un domaine. */
  badge?: string;
  /** La ligne du bas de la pochette : l'univers où l'on est, en petit. */
  etiquette?: string;
  accent?: string;
  media: MediaDeCarte;
  /** La carte de la page où l'on est. */
  actif?: boolean;
  /** Où mène la carte, quand elle mène quelque part. */
  to?: string;
}

/* ————————————————————— le morceau qui va avec un moment ————————————————————— */

/** Les morceaux qui portent un extrait : eux seuls peuvent illustrer une carte. */
export function morceauxJouables(): Morceau[] {
  return CATALOGUE.filter((m) => Boolean(m.src));
}

/** Le premier morceau jouable d'un moment du mariage, dans l'ordre du catalogue. */
export function morceauDuMoment(phaseId: string): Morceau | undefined {
  const jouables = morceauxJouables();
  return jouables.find((m) => m.phase === phaseId) ?? jouables[0];
}

/**
 * Le morceau qui ouvre une carte d'univers : la playlist du site, et le premier
 * morceau qui a un extrait. Un univers donne sa teinte — c'est le Jour J qui
 * décide de ce qui s'écoute.
 */
export function morceauDUneUnivers(): Morceau | undefined {
  return morceauxDeLaPlaylist(PLAYLIST_DEPART)[0] ?? morceauDuMoment('cocktail');
}

/* ————————————————————————— les cartes des univers ————————————————————————— */

/**
 * Les univers, en cartes : le badge du magazine, le visuel, et un morceau. La
 * page donne le lien, parce qu'elle seule sait où mène un univers chez elle
 * (le montrer sur l'accueil, ouvrir son article, changer de page).
 */
export function cartesDesUnivers(lien: (style: WeddingStyle) => string | undefined, actifId?: string): CarteVivante[] {
  return ALL_STYLES.map((style) => {
    const track = morceauDUneUnivers();
    return {
      id: style.id,
      cle: `univers|${style.id}`,
      titre: style.name,
      sousTitre: style.tagline,
      etiquette: badgeDUnivers(style.id),
      badge: badgeDUnivers(style.id),
      accent: style.accent,
      media: {
        image: style.image,
        audio: track?.src,
        legende: track ? `« ${track.title} » — ${track.artiste}` : style.tagline,
      },
      actif: actifId === style.id,
      to: lien(style),
    };
  });
}

/* ——————————————————— les cartes des moments du Jour J ——————————————————— */

/**
 * Les moments d'un univers, en cartes : **l'heure sur la carte**, le titre du
 * moment, et le morceau qui l'accompagne. C'est la bande d'un article : on
 * descend le déroulé de la journée, et chaque carte est une carte vivante.
 */
export function cartesDesMoments(styleId: string): CarteVivante[] {
  const style = styleById(styleId);
  return getScenesForStyle(styleId).map((scene, i) => {
    const track = morceauDuMoment(phaseParMoment(scene.title, i));
    return {
      id: `${styleId}-${i}-${scene.time}`,
      cle: `moment|${styleId}|${scene.time}`,
      titre: scene.title,
      sousTitre: track ? `${track.title} · ${track.artiste}` : scene.ambianceDetail,
      badge: scene.time,
      etiquette: style.name,
      accent: style.accent,
      media: {
        image: scene.image || style.image,
        audio: track?.src,
        legende: scene.ambianceDetail,
      },
    };
  });
}

/** Les moments du catalogue, dans l'ordre de la journée. */
const PHASES_CONNUES = ['prelude_ceremonie', 'cocktail', 'diner_toasts', 'premiere_danse', 'dancefloor_classics'];

/** Le moment du catalogue auquel une scène correspond : son titre parle. */
function phaseParMoment(titre: string, index: number): string {
  const t = titre.toLowerCase();
  if (t.includes('cérémonie') || t.includes('messe') || t.includes('cortège') || t.includes('entrée')) return 'prelude_ceremonie';
  if (t.includes('cocktail') || t.includes('apéritif') || t.includes('vin')) return 'cocktail';
  if (t.includes('dîner') || t.includes('diner') || t.includes('table') || t.includes('banquet') || t.includes('repas')) return 'diner_toasts';
  if (t.includes('danse') || t.includes('ouverture') || t.includes('valse')) return 'premiere_danse';
  if (t.includes('bal') || t.includes('soir') || t.includes('nuit') || t.includes('piste') || t.includes('fête')) return 'dancefloor_classics';
  // Rien dans le titre : la scène prend son moment par sa place dans la journée.
  return PHASES_CONNUES[index % PHASES_CONNUES.length]!;
}

/* ———————————————————————— les cartes du catalogue ———————————————————————— */

/**
 * Les produits du shop, en cartes : le mode (location, achat…), le prix, et un
 * morceau du Jour J — le produit se regarde dans les conditions du mariage.
 */
export function cartesDesProduits(produits: ShopProduct[], accent = '#0B0C12'): CarteVivante[] {
  return produits.map((produit) => {
    const track = morceauDuMoment(phaseDuProduit(produit));
    return {
      id: produit.slug,
      cle: `produit|${produit.slug}`,
      titre: produit.name,
      sousTitre: `${produit.price} · ${produit.unit}`,
      badge: modeLabel(produit.mode),
      etiquette: 'Le Jour J',
      accent,
      media: {
        image: produit.image,
        audio: track?.src,
        legende: produit.tagline,
      },
      to: `/shop/${produit.slug}`,
    };
  });
}

/** Le moment où un produit se voit le mieux : l'ambiance qu'il annonce. */
function phaseDuProduit(produit: ShopProduct): string {
  const ambiance = produit.ambiances.join(' ').toLowerCase();
  if (ambiance.includes('cérémonie') || ambiance.includes('cortege') || ambiance.includes('cortège')) return 'prelude_ceremonie';
  if (ambiance.includes('dîner') || ambiance.includes('diner') || ambiance.includes('table')) return 'diner_toasts';
  if (ambiance.includes('danse') || ambiance.includes('club') || ambiance.includes('nuit')) return 'dancefloor_classics';
  if (ambiance.includes('cocktail') || ambiance.includes('extérieur') || ambiance.includes('exterieur')) return 'cocktail';
  return 'cocktail';
}

export const PRODUITS_POUR_BANDE = SHOP_PRODUCTS.filter((p) => p.featured).length >= 6
  ? SHOP_PRODUCTS.filter((p) => p.featured)
  : SHOP_PRODUCTS.slice(0, 12);

/* ———————————————————————— les cartes des métiers ———————————————————————— */

/**
 * Les métiers, en cartes : leur domaine en badge, leur univers, et leur mission
 * en précision. Le cœur vaut ici pour un avis — ce que le public en pense — et
 * le média est celui de leur univers, celui du Jour J.
 */
export function cartesDesMetiers(page: PageMetier, limite = 12): CarteVivante[] {
  const track = morceauDUneUnivers();
  return metiersVoisins(page, limite).map((voisin) => {
    const univers = styleById(voisin.styleId);
    return {
      id: voisin.slug,
      cle: `metier|${voisin.slug}`,
      titre: voisin.short,
      sousTitre: `Sur le mariage ${univers?.name ?? ''}`,
      badge: voisin.label,
      etiquette: univers?.name ?? '',
      accent: univers?.accent ?? '#0B0C12',
      media: {
        image: univers?.image ?? '',
        audio: track?.src,
        legende: `Le Jour J de ${voisin.short} — ${univers?.name ?? ''}`,
      },
      actif: voisin.slug === page.slug,
      to: `/metiers/${voisin.slug}`,
    };
  });
}

/** Le même bandeau, pour une page qui n'a que le rôle et l'univers. */
export function cartesDesMetiersDuRole(role: string, styleId: string, limite = 12): CarteVivante[] {
  const fiche = pageMetierDuRole(role);
  if (fiche) return cartesDesMetiers(fiche, limite);
  // Sans fiche à soi, l'espace prestataire montre les métiers de son univers.
  return cartesDesMetiersUnivers(styleId, limite);
}

/** Les métiers d'un univers, quand on n'a pas de page de métier sous la main. */
function cartesDesMetiersUnivers(styleId: string, limite: number): CarteVivante[] {
  const style = styleById(styleId);
  const track = morceauDUneUnivers();
  return (style.humanMissions ?? []).slice(0, limite).map((mission) => {
    const metier = tousLesMetiers().find((m) => m.role === mission.role);
    const univers = metier ? styleById(metier.universes[0]?.id ?? styleId) : style;
    return {
      id: metier ? slugDeRole(metier.role) : mission.role,
      cle: `metier|${metier ? slugDeRole(metier.role) : mission.role}`,
      titre: mission.role,
      sousTitre: mission.mission,
      badge: metier?.label ?? 'Métier',
      etiquette: univers?.name ?? style.name,
      accent: univers?.accent ?? style.accent,
      media: {
        image: univers?.image ?? style.image,
        audio: track?.src,
        legende: `${mission.role} — ${mission.mission}`,
      },
      to: metier ? `/metiers/${slugDeRole(metier.role)}` : undefined,
    };
  });
}

/** Retrouve la page d'un métier depuis son rôle. */
function pageMetierDuRole(role: string) {
  return pageMetier(slugDeRole(role));
}
