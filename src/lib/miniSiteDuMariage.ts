import { CATÉGORIES_DU_TICKET, LIGNES_DU_TICKET, catégorieDeLaLigne } from './categoriesDuTicket';

/* LA MACHINE À MINI-SITES
 *
 * « La machine avec le visuel est mieux : tu saurais en faire une machine à
 * faire des mini-sites de mariage ? »
 *
 * Voilà la même machine : **ce qu'elle fabrique n'est plus seulement un ticket,
 * c'est le site que les mariés envoient à leurs invités.** Le ticket reste ce
 * qu'on coche ; le mini-site, c'est ce qu'on partage.
 *
 * Une seule règle, et elle tient tout : **ce qui est coché est ce qui
 * s'affiche.** Chaque bloc du mini-site est allumé par les lignes qui le
 * nourrissent — un métier coché allume « les gens », un menu coché allume « le
 * dîner », une ligne de site allume « les blocs du site ». Trois blocs sont
 * toujours là, sinon il n'y a pas de mariage : la couverture, le voyage, le
 * ticket.
 *
 *   on coche                la machine compose        le site des invités
 *   horaire-22:00      →    LE PROGRAMME         →   ?code=A7K-241&site=1
 *   metier-Chef…            LES GENS            →   &coches=…&reve=…
 *   menu-super-caddie       LE DÎNER
 *
 * Rien n'est stocké : le mini-site se recalcule à partir de ce qui est coché.
 * Deux couples qui cochent la même chose obtiennent le même site.
 */

/** La catégorie de chaque ligne, calculée une fois, jamais dans une boucle. */
const CATÉGORIE_DE_LA_LIGNE = new Map(
  LIGNES_DU_TICKET.map((l) => [l.id, catégorieDeLaLigne(l.id)?.id ?? ''] as const),
);

/** **Les rayons de métiers** : ceux dont toutes les lignes sont des métiers. */
const RAYONS_DE_MÉTIERS = CATÉGORIES_DU_TICKET.filter(
  (c) => c.lignes.length > 0 && c.lignes.every((l) => l.id.startsWith('metier-')),
).map((c) => c.id);

/** Les trois menus du magasin. */
const MENUS = CATÉGORIES_DU_TICKET.filter((c) => c.id.startsWith('menu-')).map((c) => c.id);

/** Toutes les catégories — pour le bloc du ticket, qui prend tout. */
const TOUTES = CATÉGORIES_DU_TICKET.map((c) => c.id);

export interface BlocDuMiniSite {
  id: string;
  /** Le mot du bloc, tel qu'il s'affiche. */
  mot: string;
  /** Ce qu'il contient, en une ligne. */
  sous: string;
  /** **Ce qui l'allume** : les catégories du ticket. Vide = toujours allumé. */
  catégories: string[];
  /** Toujours allumé, même si l'on n'a rien coché : sans lui, pas de mariage. */
  toujours?: boolean;
  /** L'image qui porte le bloc sur le site. */
  image: string;
}

/**
 * **Les blocs d'un mini-site de mariage**, dans l'ordre où un invité les lit :
 * la couverture, le jour, les gens, le dîner, le spectacle, le site, les
 * documents, le voyage, le ticket.
 */
export const BLOCS_DU_MINI_SITE: BlocDuMiniSite[] = [
  {
    id: 'couverture',
    mot: 'LA COUVERTURE',
    sous: 'l’image du jour, vos noms, la date',
    catégories: [],
    toujours: true,
    image: '/images/last-minute.jpg',
  },
  {
    id: 'programme',
    mot: 'LE PROGRAMME',
    sous: 'les horaires, à l’heure près',
    catégories: ['rayon-horaires'],
    image: '/images/supermarche.jpg',
  },
  {
    id: 'gens',
    mot: 'LES GENS',
    sous: 'les métiers du jour, chacun sa place',
    catégories: RAYONS_DE_MÉTIERS,
    image: '/images/reunion.jpg',
  },
  {
    id: 'diner',
    mot: 'LE DÎNER',
    sous: 'le menu, et ce qu’on sert',
    catégories: MENUS,
    image: '/images/chateau-terrasse-champagne.jpg',
  },
  {
    id: 'petits-prix',
    mot: 'LES PETITS PRIX',
    sous: 'ce qui ne change pas le mariage mais qui se raconte',
    catégories: ['rayon-supplements'],
    image: '/images/brocante.jpg',
  },
  {
    id: 'site',
    mot: 'LES BLOCS DU SITE',
    sous: 'ce qui s’affiche pour les invités',
    catégories: ['site'],
    image: '/images/couple-paris.jpg',
  },
  {
    id: 'documents',
    mot: 'LES DOCUMENTS',
    sous: 'ce qu’on demande, ce qu’on emporte',
    catégories: ['documents'],
    image: '/images/punk-papier.jpg',
  },
  {
    id: 'voyage',
    mot: 'LE VOYAGE',
    sous: 'le rêve, et ce qu’il reste à financer',
    catégories: [],
    toujours: true,
    image: '/images/desert-star-dance.jpg',
  },
  {
    id: 'ticket',
    mot: 'LE TICKET',
    sous: 'le récapitulatif, ligne à ligne',
    catégories: TOUTES,
    toujours: true,
    image: '/images/supermarche.jpg',
  },
];

export interface BlocAllumé extends BlocDuMiniSite {
  /** Combien de lignes du ticket nourrissent ce bloc. */
  compte: number;
}

export interface MiniSite {
  /** **Les blocs qui s'affichent**, dans l'ordre — pas ceux qu'on a laissés. */
  blocs: BlocAllumé[];
  /** Combien de blocs s'affichent, et combien la machine en connaît. */
  allumés: number;
  total: number;
  /** **L'adresse qu'on lit** sur l'écran de la machine : la signature du site. */
  adresse: string;
  /** **Le lien qu'on envoie** : le code, le site, et tout ce qui est coché —
   *  sans quoi l'invité ouvrirait un site vide. */
  lien: string;
  /** Vrai quand tout ce que la machine sait faire est allumé. */
  complet: boolean;
}

/** **Ce que les mariés envoient à leurs invités** : l'adresse du site composé. */
export function adresseDuMiniSite(code: string): string {
  return `?code=${encodeURIComponent(code)}&site=1`;
}

/**
 * **Le lien complet** : le code, le site, les lignes cochées — et le rêve
 * quand les mariés l'ont décrit. C'est ce lien-là qui part ; l'adresse courte,
 * elle, reste ce qu'on lit sur l'écran de la machine.
 */
export function lienDuMiniSite(code: string, cochées: string[], rêve = ''): string {
  const suite = new URLSearchParams();
  suite.set('code', code);
  suite.set('site', '1');
  if (cochées.length > 0) suite.set('coches', cochées.join(','));
  if (rêve.trim()) suite.set('reve', rêve);
  return `?${suite.toString()}`;
}

/**
 * **La machine compose le mini-site.** Elle prend ce qui est coché, allume les
 * blocs qui vont avec, et rend l'adresse. Elle ne demande rien d'autre : le
 * mini-site d'un mariage, c'est son ticket, montré aux invités.
 *
 * (`grilleDuMonde.composerLeMiniSite` compose, lui, la **grille** d'un espace
 * — un autre métier, un autre nom : ici on compose le site, pas la grille.)
 */
export function composerLeMiniSiteDeMariage(code: string, cochées: string[], rêve = ''): MiniSite {
  const prises = new Set(cochées);
  const lignes = LIGNES_DU_TICKET.filter((l) => prises.has(l.id)).map((l) => CATÉGORIE_DE_LA_LIGNE.get(l.id) ?? '');

  const blocs: BlocAllumé[] = BLOCS_DU_MINI_SITE.map((bloc) => ({
    ...bloc,
    compte: bloc.catégories.length === 0 ? 0 : lignes.filter((catégorie) => bloc.catégories.includes(catégorie)).length,
  })).filter((bloc) => bloc.toujours === true || bloc.compte > 0);

  return {
    blocs,
    allumés: blocs.length,
    total: BLOCS_DU_MINI_SITE.length,
    adresse: adresseDuMiniSite(code),
    lien: lienDuMiniSite(code, cochées, rêve),
    complet: blocs.length === BLOCS_DU_MINI_SITE.length,
  };
}
