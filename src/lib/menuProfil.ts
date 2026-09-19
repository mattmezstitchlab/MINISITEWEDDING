import { DOMAINES_PRESTATAIRES, PERSONNAGES, TITRES, type Personnage, type TitreDuHero } from './personas';

/**
 * LE MENU DU PROFIL — CE QU'IL PROPOSE, ET OÙ CELA MÈNE
 *
 * Une seule entrée en haut à droite du site : **le profil**. Elle ouvre le menu
 * du site — celui de la personne, pas du produit — et c'est par lui qu'on
 * **choisit son rôle**, qu'on regarde le site **en tant que quelqu'un d'autre**,
 * et qu'on retrouve les pages de toujours.
 *
 * Les libellés et les destinations vivent ici, à part du composant : c'est de la
 * donnée, on la lit, on la teste, et on la change sans toucher au rendu.
 */

/** Une entrée du menu : un mot, un picto, et une page du site — jamais le vide. */
export interface ItemDeMenu {
  label: string;
  /** Le nom du picto, choisi dans la charte par le composant. */
  icone: string;
  to: string;
  /** Le raccourci affiché à droite, quand il y en a un. */
  raccourci?: string;
  /** La pastille, quand quelque chose attend. */
  badge?: string;
  /** Une flèche : l'entrée ouvre autre chose. */
  fleche?: boolean;
}

/** Les entrées de la personne : son profil, ce qu'elle reçoit, ses réglages. */
export const MENU_PROFIL: ItemDeMenu[] = [
  { label: 'Profil', icone: 'profil', to: '/carte' },
  { label: 'Boîte de réception', icone: 'boite', to: '/le-mariage', badge: '1' },
  { label: 'Paramètres', icone: 'reglages', to: '/creer', raccourci: '⌘ .' },
  { label: 'Apparence', icone: 'apparence', to: '/carte' },
];

/** Les entrées du site : de l'aide, de la lecture, la communauté, et les apps. */
export const AIDE_PROFIL: ItemDeMenu[] = [
  { label: 'Assistance', icone: 'aide', to: '/magazine', fleche: true },
  { label: 'Documentation', icone: 'doc', to: '/supermarriage', fleche: true },
  { label: 'Communauté', icone: 'communaute', to: '/prestataire' },
  { label: 'Télécharger les applications', icone: 'telecharger', to: '/supermarriage' },
  { label: 'Accueil', icone: 'accueil', to: '/' },
];

/** L'entrée qui fait sortir : on repose le rôle, et l'on revient au début. */
export const SORTIE_PROFIL: ItemDeMenu = { label: 'Se déconnecter', icone: 'sortie', to: '/' };

/**
 * « VOIR EN TANT QUE » — LES RÔLES, RANGÉS PAR TITRE
 *
 * Sous chaque titre du générique, ses cartes : c'est la liste complète des rôles
 * du site. On en prend un, et **le site devient le sien** — son dock, son shop,
 * son magazine. On ne voit jamais les informations de personne : on voit son
 * écran.
 */
export function rolesDuMenu(): Array<{ titre: TitreDuHero; roles: Personnage[] }> {
  return TITRES.map((titre) => {
    const ids = titre.domaines ? DOMAINES_PRESTATAIRES.flatMap((d) => d.cartes) : titre.cartes;
    return {
      titre,
      roles: ids.map((id) => PERSONNAGES.find((p) => p.id === id)).filter((p): p is Personnage => Boolean(p)),
    };
  });
}
