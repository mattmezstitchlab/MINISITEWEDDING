import { FULL_ROLES_TAXONOMY } from './weddingTaxonomy';

/**
 * LES RÔLES DU MARIAGE, CÔTÉ NAVIGATEUR
 *
 * La taxonomie complète, rangée par famille, et les deux lectures dont les
 * écrans ont besoin : le nom du rôle, et l'écran de téléphone qui lui
 * correspond. Aucun univers ici : il ne se choisit plus à la création, il se
 * découvre sur le mini-site et se change dans l'éditeur.
 */

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
/**
 * Les rôles qui préparent ou racontent le mariage : les mariés, ceux qui le
 * seront, et toutes leurs variantes — seul, seule, à deux, à deux femmes, à deux
 * hommes. **Une carte peut porter deux personnes.**
 */
const ROLES_DES_MARIES = [
  'maries',
  'marie',
  'mariee',
  'mariees',
  'maries_e',
  'futur_marie',
  'future_mariee',
  'futurs_maries',
  'futures_mariees',
  'futurs_maries_e',
];

/** Les rôles qu'on vit depuis l'invitation : les invités, la famille, les témoins. */
const ROLES_DES_INVITES = ['temoin', 'invites', 'famille'];

export function roleToScreen(roleId: string | null): 'invite' | 'maries' | 'prestataire' {
  if (!roleId) return 'invite';
  if (ROLES_DES_MARIES.includes(roleId)) return 'maries';
  if (ROLES_DES_INVITES.includes(roleId)) return 'invite';
  return 'prestataire';
}

/** Est-ce un rôle de protagoniste ? Les mariés saisissent deux prénoms. */
export function isCoupleRole(roleId: string | null): boolean {
  return roleId === null || ROLES_DES_MARIES.includes(roleId);
}
