import { CalendarDays, Heart, MapPin, UserRound, Sparkles } from 'lucide-react';
import { FULL_ROLES_TAXONOMY } from './weddingTaxonomy';

/**
 * L'ESPACE EN COURS DE CRÉATION
 *
 * Cinq étapes : qui vous êtes — d'après la taxonomie des rôles du site —, votre
 * nom, la date, le lieu, puis l'univers. Ce que l'on répond ici se retrouve
 * aussitôt dans le téléphone posé sous le hero.
 */

export interface SpaceDraft {
  /** Le rôle, pris dans FULL_ROLES_TAXONOMY. */
  roleId: string | null;
  partner1: string;
  partner2: string;
  date: string;
  venue: string;
  city: string;
  styleId: string | null;
}

export const EMPTY_DRAFT: SpaceDraft = {
  roleId: null,
  partner1: '',
  partner2: '',
  date: '',
  venue: '',
  city: '',
  styleId: null,
};

export const STEPS = [
  { id: 'role', title: 'Qui êtes-vous ?', hint: 'Chaque rôle voit le mariage à sa façon', icon: UserRound },
  { id: 'names', title: 'Votre nom', hint: 'Il apparaîtra sur l’invitation', icon: Heart },
  { id: 'date', title: 'La date', hint: 'Le compte à rebours se lance aussitôt', icon: CalendarDays },
  { id: 'place', title: 'Le lieu', hint: 'Le lieu et la ville, même provisoires', icon: MapPin },
  { id: 'style', title: 'L’univers', hint: 'Les 24 univers du catalogue', icon: Sparkles },
] as const;

/** Les rôles de la taxonomie, rangés par famille, protagonistes d'abord. */
export const ROLE_GROUPS = FULL_ROLES_TAXONOMY.reduce<Array<{ label: string; roles: typeof FULL_ROLES_TAXONOMY }>>(
  (groupes, role) => {
    const existant = groupes.find((g) => g.label === role.categoryLabel);
    if (existant) existant.roles.push(role);
    else groupes.push({ label: role.categoryLabel, roles: [role] });
    return groupes;
  },
  [],
);

/** Le nom du rôle, pour l'afficher dans le récapitulatif. */
export function roleTitle(roleId: string | null): string | null {
  return FULL_ROLES_TAXONOMY.find((r) => r.id === roleId)?.title ?? null;
}

/**
 * Quel écran du téléphone correspond à ce rôle : celui des mariés, celui des
 * invités, ou celui des prestataires missionnés.
 */
export function roleToScreen(roleId: string | null): 'invite' | 'maries' | 'prestataire' {
  if (!roleId) return 'invite';
  if (roleId === 'maries') return 'maries';
  if (roleId === 'temoin' || roleId === 'invites') return 'invite';
  return 'prestataire';
}

/** Est-ce un rôle de protagoniste ? Les mariés saisissent deux prénoms. */
export function isCoupleRole(roleId: string | null): boolean {
  return roleId === 'maries' || roleId === null;
}
