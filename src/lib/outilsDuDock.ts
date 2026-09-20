import {
  CalendarDays, Camera, Clapperboard, Lightbulb, MapPin, MessageCircle, Music2,
  ScrollText, Sparkles, Users, UtensilsCrossed, type LucideIcon,
} from 'lucide-react';

/**
 * LES OUTILS DU DOCK — CE QU'ILS DISENT, ET OÙ ILS MÈNENT
 *
 * Le dock du bas porte les outils du personnage : le planning, la playlist, la
 * galerie, les convives… Chaque outil dit ce qu'il fait par son nom, et **mène
 * à la page qui porte réellement le sujet** — jamais une page qui n'existe pas,
 * jamais une ancre absente. Les routes sont écrites ici, une fois, et le dock
 * les suit : si un outil n'a pas de page, c'est ici qu'on le décide.
 */

/** Les mots d'un outil qui disent à quoi il sert : le picto suit. */
const PICTOS: Array<[RegExp, LucideIcon]> = [
  [/playlist|setlist|demande|régie|son\b|musique/i, Music2],
  [/photo|galerie|rush|film/i, Camera],
  [/planning|horaire|date|alerte|agenda/i, CalendarDays],
  [/invité|convive|équipe|part|famille|témoin/i, Users],
  [/menu|gâteau|dessert|service|carte\b/i, UtensilsCrossed],
  [/lieu|scène|piste|bar|stock|installation|trajet|nuit|voyage|livraison/i, MapPin],
  [/contact|texte|discours|message/i, MessageCircle],
  [/lumière|projecteur|éclairage/i, Lightbulb],
  [/contrat|pièce|document|papier/i, ScrollText],
  [/moment|souvenir|cérémonie/i, Clapperboard],
];

/** Le picto d'un outil : il vient de ce qu'il fait, jamais du hasard. */
export function iconeOutil(label: string): LucideIcon {
  return PICTOS.find(([motif]) => motif.test(label))?.[1] ?? Sparkles;
}

/**
 * Où mène un outil : **la page qui porte le sujet, réellement**.
 *
 * - les personnes (invités, convives, famille) → la carte, qui les porte ;
 * - la musique → la page de l'univers, à sa playlist ;
 * - le planning → la page de l'univers, à son programme heure par heure ;
 * - le lieu → la page de l'univers, entière ;
 * - les photos → la carte : c'est là qu'on les pose ;
 * - les papiers → l'espace prestataire ;
 * - la table et le service → le shop, filtré par le rôle ;
 * - l'invitation, la part, les souvenirs → la carte.
 */
export function routeOutil(label: string, styleId: string, roleId: string): string {
  const t = label.toLowerCase();
  if (/invitation|ma part|souvenir/.test(t)) return '/carte';
  if (/invité|convive|équipe|famille|témoin/.test(t)) return '/carte';
  if (/playlist|setlist|demande|régie|son\b|musique/.test(t)) return `/le-mariage/${styleId}#playlist`;
  if (/photo|galerie|rush|film/.test(t)) return '/carte';
  if (/planning|horaire|date|alerte|agenda/.test(t)) return `/le-mariage/${styleId}#programme`;
  if (/contrat|pièce|document|papier/.test(t)) return '/prestataire';
  if (/menu|gâteau|dessert|service|bar|stock|carte\b/.test(t)) return `/shop?role=${roleId}`;
  if (/lieu|scène|piste|installation|trajet|nuit|voyage|livraison/.test(t)) return `/le-mariage/${styleId}`;
  if (/moment|cérémonie/.test(t)) return `/le-mariage/${styleId}`;
  return `/le-mariage/${styleId}`;
}
