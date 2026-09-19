import {
  Cake, Camera, Car, Clapperboard, ClipboardList, Disc3, Feather, Flower2, HeartHandshake,
  Lightbulb, Music, Plane, ScrollText, Star, Ticket, UtensilsCrossed, Wine,
} from 'lucide-react';
import type { PictoPersonnage } from '../lib/personas';

/**
 * LE PICTO D'UN PERSONNAGE
 *
 * Les personnages se dessinent au trait, dans la charte du site — jamais en
 * emoji : un picto tient dans la typo et les couleurs, à toutes les tailles.
 * Chaque rôle a le sien, et le nom du picto vient de `personas`.
 */

const PICTOS: Record<PictoPersonnage, typeof Cake> = {
  coeur: HeartHandshake,
  etoile: Star,
  billet: Ticket,
  parchemin: ScrollText,
  fourchette: UtensilsCrossed,
  verre: Wine,
  gateau: Cake,
  disque: Disc3,
  musique: Music,
  camera: Camera,
  film: Clapperboard,
  ampoule: Lightbulb,
  fleur: Flower2,
  volant: Car,
  plume: Feather,
  valise: Plane,
  agenda: ClipboardList,
};

export default function PictoPersonnage({ picto, size = 22 }: { picto: PictoPersonnage; size?: number }) {
  const Icone = PICTOS[picto] ?? Star;
  return <Icone size={size} aria-hidden="true" />;
}
