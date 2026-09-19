import {
  BookOpen, CalendarClock, CreditCard, Heart, Images, ListOrdered, Music2, Package,
  ScrollText, ShoppingBag, Sparkles, Store, Tag, Users, Wand2,
} from 'lucide-react';
import type { ActionNav } from './navVerticale';

/**
 * CE QUE CHAQUE PAGE PROPOSE, À DROITE DE L'ÉCRAN
 *
 * La capsule verticale n'est pas la même d'une page à l'autre : sur l'accueil
 * elle descend vers la carte, les univers et la playlist ; sur un univers, vers
 * son article, son programme et sa carte de fidélité ; sur un article, vers sa
 * lecture ; au shop, vers ses pièces. Les adresses (`ancre`) sont celles des
 * sections réelles des pages — la capsule ne mène jamais dans le vide.
 *
 * Le Shop et le Magazine, eux, sont toujours en haut de la capsule : ils ne sont
 * pas écrits ici.
 */

export const NAV_ACCUEIL: ActionNav[] = [
  { id: 'carte', label: 'La carte', icone: CreditCard, ancre: 'ecran' },
  { id: 'univers', label: 'Les univers', icone: Sparkles, ancre: 'univers' },
  { id: 'mariage', label: 'Le mariage', icone: Heart, ancre: 'site' },
  { id: 'playlist', label: 'La playlist', icone: Music2, ancre: 'bande-son' },
  { id: 'creer', label: 'Créer ma carte', icone: Wand2, to: '/creer' },
];

export const NAV_UNIVERS: ActionNav[] = [
  { id: 'article', label: 'L’article', icone: BookOpen, ancre: 'article' },
  { id: 'programme', label: 'Le programme', icone: CalendarClock, ancre: 'programme' },
  { id: 'fidelite', label: 'La carte de fidélité', icone: CreditCard, ancre: 'carte-fidelite' },
  { id: 'creer', label: 'Créer ma carte', icone: Wand2, to: '/creer' },
];

export const NAV_METIER: ActionNav[] = [
  { id: 'playlist', label: 'La playlist', icone: Music2, ancre: 'playlist' },
  { id: 'ticket', label: 'Le ticket', icone: ScrollText, ancre: 'ticket' },
  { id: 'prestataires', label: 'Tous les métiers', icone: Users, to: '/prestataire' },
];

export const NAV_MAGAZINE: ActionNav[] = [
  { id: 'articles', label: 'Les articles', icone: ListOrdered, ancre: 'articles' },
  { id: 'shop', label: 'Faire ses courses', icone: ShoppingBag, to: '/shop' },
];

export const NAV_ARTICLE: ActionNav[] = [
  { id: 'lire', label: 'Lire l’article', icone: BookOpen, ancre: 'article' },
  { id: 'moments', label: 'Les moments', icone: Images, ancre: 'moments' },
  { id: 'tous', label: 'Tous les articles', icone: ListOrdered, to: '/magazine' },
];

export const NAV_SHOP: ActionNav[] = [
  { id: 'pieces', label: 'Les pièces', icone: Package, ancre: 'pieces' },
  { id: 'modes', label: 'Louer, acheter, prêter', icone: Tag, ancre: 'modes' },
  { id: 'magazine', label: 'Le magazine', icone: BookOpen, to: '/magazine' },
];

export const NAV_PRODUIT: ActionNav[] = [
  { id: 'details', label: 'Les détails', icone: ScrollText, ancre: 'details' },
  { id: 'similaires', label: 'Dans le même univers', icone: Store, ancre: 'similaires' },
  { id: 'shop', label: 'Faire ses courses', icone: ShoppingBag, to: '/shop' },
];

export const NAV_PRESTATAIRE: ActionNav[] = [
  { id: 'editeur', label: 'Le mini-site', icone: Wand2, ancre: 'editeur' },
  { id: 'metiers', label: 'Tous les métiers', icone: Users, to: '/prestataire' },
];
