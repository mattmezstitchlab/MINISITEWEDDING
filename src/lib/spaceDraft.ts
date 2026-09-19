import { CalendarDays, Heart, MapPin, Sparkles } from 'lucide-react';

/**
 * L'ESPACE EN COURS DE CRÉATION
 *
 * Les quatre étapes du hero et ce qu'elles recueillent. Le brouillon vit ici
 * pour que le formulaire, le hero et le téléphone parlent du même objet.
 */

export interface SpaceDraft {
  partner1: string;
  partner2: string;
  date: string;
  venue: string;
  city: string;
  styleId: string | null;
}

export const EMPTY_DRAFT: SpaceDraft = {
  partner1: '',
  partner2: '',
  date: '',
  venue: '',
  city: '',
  styleId: null,
};

/** Les univers proposés d'entrée de jeu — les autres restent dans le menu. */
export const QUICK_STYLES = ['traditionnel', 'chateau-moderne', 'corse', 'new-york', 'vegas', 'noir-blanc'];

export const STEPS = [
  { id: 'names', title: 'Vos prénoms', hint: 'Ils apparaîtront sur l’invitation', icon: Heart },
  { id: 'date', title: 'La date', hint: 'Le compte à rebours se lance aussitôt', icon: CalendarDays },
  { id: 'place', title: 'Le lieu', hint: 'Le lieu et la ville, même provisoires', icon: MapPin },
  { id: 'style', title: 'L’univers', hint: 'L’ambiance qui portera toute la page', icon: Sparkles },
] as const;
