import { styleById, type WeddingStyle } from './weddingStyles';
import {
  donneesMetier, modulesDuMetier,
  type MetierData, type MetierLigne, type MetierModule,
} from './vendorModules';
import {
  accesSurPlace, chiffresDuMariage, decorDuJour, jourDuMariage, regimesDeclares,
} from './vendorModules';

/**
 * LE BROUILLON DU PRESTATAIRE
 *
 * Un prestataire ouvre le même éditeur que les mariés, mais sa page ne raconte
 * pas la même chose : elle parle son métier. Son brouillon tient donc en deux
 * morceaux — ses modules (écrits dans la langue de son domaine) et son plan de
 * cachets quand il vit du spectacle.
 *
 * Le reste — le programme, les régimes, les accès, les chiffres, le décor — ne
 * lui appartient pas : il l'hérite du site des mariés et de l'univers choisi.
 * C'est ce partage qui relie les deux éditeurs : personne ne ressaisit rien, et
 * tout le monde lit la même vérité.
 */

export interface LigneDraft {
  label: string;
  valeur: string;
}

export interface ModuleDraft {
  id: string;
  /** Le mot du métier, tel qu'il s'affiche dans la nav du téléphone. */
  nav: string;
  eyebrow: string;
  titre: string;
  lignes: LigneDraft[];
  note?: string;
  cachets?: boolean;
}

/** Le plan de cachets d'un intermittent : ce qui se déclare, et ce qui compte. */
export interface CachetsPlan {
  cachets: number;
  heuresParCachet: number;
  declaration: string;
  droits: string;
  defraiement: string;
  /** Où en est-on des 507 heures, à la main — le calcul strict appartient à l'artiste. */
  heuresAcquises: number;
}

export interface VendorDraft {
  role: string;
  modules: ModuleDraft[];
  cachets: CachetsPlan;
}

/** Le seuil des intermittents du spectacle : 507 heures sur douze mois. */
export const HEURES_INTERMITTENCE = 507;

export const CACHETS_DEFAUT: CachetsPlan = {
  cachets: 2,
  heuresParCachet: 12,
  declaration: 'GUSO — le couple vous emploie en toute légalité',
  droits: 'SACEM / SPRE selon la salle et le répertoire',
  defraiement: 'Repas et trajet pris en charge',
  heuresAcquises: 0,
};

export const heuresCachets = (plan: CachetsPlan): number =>
  Math.round(plan.cachets * plan.heuresParCachet + plan.heuresAcquises);

export const avancementCachets = (plan: CachetsPlan): number =>
  Math.min(1, heuresCachets(plan) / HEURES_INTERMITTENCE);

/* ————————————————— le brouillon par défaut ————————————————— */

const versDraft = (module: MetierModule): ModuleDraft => ({
  id: module.id,
  nav: module.nav,
  eyebrow: module.eyebrow,
  titre: module.titre,
  lignes: module.lignes.map((l) => ({ ...l })),
  note: module.note,
  cachets: module.cachets,
});

export function draftParDefaut(style: WeddingStyle, role: string): VendorDraft {
  const data = donneesMetier(style, role);
  return {
    role,
    modules: modulesDuMetier(data).map(versDraft),
    cachets: { ...CACHETS_DEFAUT },
  };
}

/** Le brouillon d'un métier monté depuis son univers — pratique pour les aperçus. */
export function draftPour(styleId: string, role: string): VendorDraft {
  return draftParDefaut(styleById(styleId), role);
}

/* ————————————————— la mémoire du navigateur ————————————————— */

const CLE = (role: string) => `vows:vendor-draft:${role.toLowerCase()}`;

export function chargerDraft(role: string): VendorDraft | null {
  try {
    const brut = localStorage.getItem(CLE(role));
    if (!brut) return null;
    const parse = JSON.parse(brut) as Partial<VendorDraft>;
    if (!parse || !Array.isArray(parse.modules) || parse.modules.length === 0) return null;
    return {
      role: parse.role ?? role,
      modules: parse.modules as ModuleDraft[],
      cachets: { ...CACHETS_DEFAUT, ...(parse.cachets ?? {}) },
    };
  } catch {
    return null;
  }
}

export function enregistrerDraft(draft: VendorDraft): void {
  try {
    localStorage.setItem(CLE(draft.role), JSON.stringify(draft));
  } catch {
    // Stockage indisponible : le brouillon vit le temps de la visite.
  }
}

export function oublierDraft(role: string): void {
  try {
    localStorage.removeItem(CLE(role));
  } catch {
    // rien à oublier
  }
}

/* ————————————————— ce qui vient des mariés ————————————————— */

export interface Partage {
  id: string;
  titre: string;
  /** D'où vient l'information, en une phrase. */
  origine: string;
  lignes: MetierLigne[];
}

/**
 * Ce que le prestataire ne ressaisit jamais : le programme, les régimes, les
 * accès, les chiffres et le décor viennent du site des mariés et de l'univers
 * qu'ils ont choisi. Le même contenu alimente l'écran des invités, le cockpit
 * des mariés et la page du prestataire — une seule vérité, trois lectures.
 */
export function partageAvecLesMaries(data: MetierData): Partage[] {
  return [
    {
      id: 'programme',
      titre: 'Le jour J',
      origine: 'Le programme publié par les mariés sur leur mini-site',
      lignes: jourDuMariage(data),
    },
    {
      id: 'regimes',
      titre: 'Les régimes',
      origine: 'Les régimes déclarés sur le site, à couvrir le jour J',
      lignes: regimesDeclares(data),
    },
    {
      id: 'acces',
      titre: 'Accès & contacts',
      origine: 'La logistique écrite par les mariés, visible par leurs prestataires',
      lignes: accesSurPlace(data),
    },
    {
      id: 'chiffres',
      titre: 'Le mariage en chiffres',
      origine: 'Les compteurs du site : couverts, réponses, lieu, date',
      lignes: chiffresDuMariage(data),
    },
    {
      id: 'decor',
      titre: 'Le décor et la tenue',
      origine: `L’univers ${data.styleName} choisi par les mariés`,
      lignes: decorDuJour(data),
    },
  ];
}
