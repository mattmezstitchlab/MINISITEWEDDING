import {
  BookOpen, CalendarClock, CreditCard, Images, Layers, ListOrdered, Music2, Package,
  Radar, ScrollText, ShoppingBag, Sparkles, Stamp, Store, Tag, Users, Wand2,
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
  { id: 'univers', label: 'Les univers', icone: Sparkles, ancre: 'univers-hero', aide: 'Le second hero : un univers en grand, et ses cartes dessous.' },
  { id: 'manifeste', label: 'Le manifeste', icone: ScrollText, ancre: 'manifeste', aide: 'Le concept, en trois paragraphes — juste sous le hero.' },
  { id: 'editeur', label: 'Super Éditeur', icone: Wand2, ancre: 'editeur', aide: 'La même page sur un ordinateur, une tablette et un téléphone.' },
  { id: 'shop', label: 'Faire ses courses', icone: ShoppingBag, ancre: 'supermarriage', aide: 'SUPER SHOP et son ticket de caisse : on coche, le total suit.' },
  { id: 'playlist', label: 'La playlist', icone: Music2, ancre: 'bande-son', aide: 'Les morceaux du moment, et ceux que les invités proposent.' },
];

/** SUPER RIPPLE : ce qu'on vient y chercher. */
export const NAV_RIPPLE: ActionNav[] = [
  { id: 'point-zero', label: 'Le point zéro', icone: Radar, ancre: 'point-zero', aide: 'Une saisie au centre du cadran, et tout se répercute.' },
  { id: 'fabrique', label: 'La fabrique', icone: Stamp, ancre: 'fabrique', aide: 'Les objets qu’on prépare ici, et leurs repères.' },
  { id: 'axes', label: 'Votre situation', icone: CreditCard, ancre: 'axe-statut', aide: 'Ce qui se coche, et ce que ça ouvre.' },
  { id: 'documents', label: 'Les documents', icone: ScrollText, ancre: 'documents', aide: 'Ce qui existe vraiment : qui demande, au nom de qui, quoi réunir.' },
];

/** La page de l'éditeur : ce qu'on vient y faire. */
export const NAV_PARAMETRES: ActionNav[] = [
  { id: 'mini-site', label: 'Le mini-site', icone: Wand2, ancre: 'mini-site', aide: 'L’éditeur : la page section par section.' },
  { id: 'univers', label: 'Les univers', icone: Sparkles, to: '/', aide: 'Retour aux univers, sur leurs couvertures.' },
  { id: 'shop', label: 'Faire ses courses', icone: ShoppingBag, to: '/shop', aide: 'Le catalogue, par catégories — et ce qui concerne un rôle.' },
];

export const NAV_UNIVERS: ActionNav[] = [
  { id: 'article', label: 'L’article', icone: BookOpen, ancre: 'article', aide: 'L’article de magazine de cet univers, entier.' },
  { id: 'programme', label: 'Le programme', icone: CalendarClock, ancre: 'programme', aide: 'La journée de cet univers, heure par heure.' },
  { id: 'fidelite', label: 'La carte de fidélité', icone: CreditCard, ancre: 'carte-fidelite', aide: 'La carte du lieu, et ce qu’elle offre le jour J.' },
  { id: 'creer', label: 'Créer ma carte', icone: Wand2, to: '/creer', aide: 'Cinq questions, et votre carte existe.' },
];

export const NAV_METIER: ActionNav[] = [
  { id: 'playlist', label: 'La playlist', icone: Music2, ancre: 'playlist', aide: 'Les morceaux que ce métier met au moment juste.' },
  { id: 'ticket', label: 'Le ticket', icone: ScrollText, ancre: 'ticket', aide: 'Ce qu’on coche, et ce que le ticket calcule.' },
  { id: 'prestataires', label: 'Tous les métiers', icone: Users, to: '/prestataire', aide: 'L’espace des prestataires, tous métiers confondus.' },
];

export const NAV_MAGAZINE: ActionNav[] = [
  { id: 'chapitres', label: 'Les sept chapitres', icone: Layers, ancre: 'chapitres', aide: 'Le magazine de la semaine, ses sept univers, et le chapitre où l’on est.' },
  { id: 'saisons', label: 'Les quatre saisons', icone: CalendarClock, ancre: 'saisons', aide: 'Quatre couvertures de base : un fond uni, une création sur l’amour de la saison.' },
  { id: 'numero', label: 'Le numéro du moment', icone: BookOpen, ancre: 'numero', aide: 'L’édition de la semaine : huit rubriques, toujours les mêmes.' },
  { id: 'articles', label: 'Les articles', icone: ListOrdered, ancre: 'articles', aide: 'Les articles de l’édition ouverte, sous sa couverture.' },
  { id: 'shop', label: 'Faire ses courses', icone: ShoppingBag, to: '/shop', aide: 'Le catalogue, par catégories — et ce qui concerne un rôle.' },
];

export const NAV_ARTICLE: ActionNav[] = [
  { id: 'lire', label: 'Lire l’article', icone: BookOpen, ancre: 'article', aide: 'Le texte commence ici : on y va directement.' },
  { id: 'moments', label: 'Les moments', icone: Images, ancre: 'moments', aide: 'Les moments du jour J, en cartes, avec leur musique.' },
  { id: 'tous', label: 'Tous les articles', icone: ListOrdered, to: '/magazine', aide: 'La revue entière, par couvertures.' },
];

export const NAV_SHOP: ActionNav[] = [
  { id: 'pieces', label: 'Les pièces', icone: Package, ancre: 'pieces', aide: 'Ce que ce rôle a vraiment besoin d’avoir.' },
  { id: 'modes', label: 'Louer, acheter, prêter', icone: Tag, ancre: 'modes', aide: 'Les quatre façons de faire, et ce qu’elles changent au total.' },
  { id: 'magazine', label: 'Le magazine', icone: BookOpen, to: '/magazine', aide: 'La revue AIME MAGAZINE, édition par édition.' },
];

export const NAV_PRODUIT: ActionNav[] = [
  { id: 'details', label: 'Les détails', icone: ScrollText, ancre: 'details', aide: 'Ce que la pièce comprend, et à quoi elle sert le jour J.' },
  { id: 'similaires', label: 'Dans le même univers', icone: Store, ancre: 'similaires', aide: 'Ce qui irait avec, dans le même univers.' },
  { id: 'shop', label: 'Faire ses courses', icone: ShoppingBag, to: '/shop', aide: 'Le catalogue, par catégories — et ce qui concerne un rôle.' },
];

export const NAV_PRESTATAIRE: ActionNav[] = [
  { id: 'editeur', label: 'Le mini-site', icone: Wand2, ancre: 'editeur', aide: 'Votre page de prestataire, telle qu’on la voit.' },
  { id: 'metiers', label: 'Tous les métiers', icone: Users, to: '/prestataire', aide: 'L’espace des prestataires, tous métiers confondus.' },
];
