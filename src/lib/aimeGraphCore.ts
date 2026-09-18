/**
 * AIME UNIVERSAL GRAPH SCHEMA (Système Nerveux Universel)
 *
 * Principes Fondamentaux :
 * 1. Zéro duplication : une entité (Personne, Lieu, Média, Document) n'existe qu'une seule fois.
 * 2. Tout est graphe : Identité <-> Relation <-> Univers <-> WorldProject <-> Timeline.
 * 3. Matrice de permissions fine sur la DONNÉE et la RELATION (pas juste la page).
 * 4. Sources de vérité explicites : source, contextuelle, calculée, proposée, validée.
 */

export type AccessLevel =
  | 'PRIVE'       // Visible uniquement par son propriétaire
  | 'PARTAGE'     // Visible par des identités spécifiques
  | 'PROJET'      // Visible dans le contexte d'un WorldProject
  | 'EQUIPE'      // Visible par les prestataires/membres autorisés
  | 'PUBLIC'      // Visible publiquement
  | 'TEMPORAIRE'; // Accès restreint dans le temps

export type AccessStatus =
  | 'DEMANDE'
  | 'APPROUVE'
  | 'REFUSE'
  | 'REVOKE'
  | 'A_CONFIRMER';

export type DataSourceType =
  | 'SOURCE_ORIGINE' // Donnée canonique du profil propriétaire
  | 'CONTEXTUELLE'   // Valeur propre au projet (ex: téléphone dédié Jour J)
  | 'PROPOSEE'       // Suggestion par un tiers en attente de validation
  | 'CALCULEE';      // Déduite par le graphe (ex: heure fin = heure début + durée)

export interface DataFieldPermission<T = any> {
  key: string;
  label: string;
  value: T;
  sourceType: DataSourceType;
  sourceOwnerId: string;
  sourceOwnerName: string;
  accessLevel: AccessLevel;
  status: AccessStatus;
  allowedRoleIds?: string[];
  lastModified: string;
  history?: { date: string; author: string; previousValue: any }[];
}

export interface UniversalIdentity {
  id: string; // Ex: 'id-sarah', 'id-mattmez'
  canonicalName: string;
  email: string;
  avatar: string;
  isProfessional: boolean;
  phonePersonal: string;
  bio: string;
  homeCity: string;
  countryCode: string;
  createdAt: string;

  // Profil Professionnel (si applicable)
  professionalProfile?: {
    trade: string; // Ex: 'Saxophoniste Live & Acoustique'
    companyName: string;
    proEmail: string;
    proPhone: string;
    riderAcoustique: string;
    tarifBase: string;
    disponibilites: string[];
    portfolioMedias: string[];
  };

  // Préférences & Paramètres
  settings: {
    notifications: boolean;
    autoSyncTimeline: boolean;
    allowDirectProjectInvite: boolean;
    secretChannelEnabled: boolean;
  };
}

export type UniverseType =
  | 'MARIAGE'
  | 'FAMILLE'
  | 'VOYAGE'
  | 'PASSION'
  | 'PROFESSIONNEL'
  | 'ASSOCIATION'
  | 'EVENEMENT'
  | 'PROJET_PERSO';

export interface WorldProject {
  id: string; // Ex: 'proj-sarah-gabriel-2026'
  universe: UniverseType;
  title: string;
  tagline: string;
  coverImage: string;
  ownerId: string; // Propriétaire du projet
  date: string;
  locationId: string;
  locationName: string;
  locationAddress: string;
  
  // Relations liant ce projet aux Identités
  relations: ProjectRelation[];

  // Timeline reliée bidirectionnellement aux données
  timelineEvents: TimelineGraphEvent[];
}

export interface ProjectRelation {
  id: string; // Ex: 'rel-sarah-mattmez'
  projectId: string;
  identityId: string; // Pointe vers l'Identité unique
  roleInProject: string; // Ex: 'Saxophoniste Live', 'Mariée', 'Témoin', 'Traiteur'
  roleCategory: 'protagoniste' | 'prestataire' | 'invite' | 'coordinateur';
  status: AccessStatus; // 'APPROUVE', 'A_CONFIRMER', etc.
  assignedTimeSlot?: string;
  
  // Matrice de permissions sur cette relation
  permissions: {
    canViewTimeline: boolean;
    canEditTimeline: boolean;
    canViewFinances: boolean;
    canViewSecretChannel: boolean;
    canContactOtherVendors: boolean;
    syncBidirectional: boolean;
  };

  // Données contextuelles propres à cette relation
  contextualData: {
    cachetScelle?: string;
    specialInstructions?: string;
    assignedZone?: string;
  };
}

export interface TimelineGraphEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  primaryRoleId: string; // Rôle pilote
  assignedIdentityId?: string; // Lien direct avec l'identité (ex: Matt Mez)
  dataSourceField?: string; // Nom de la donnée liée (ex: 'mattmez.riderAcoustique')
  accessLevel: AccessLevel;
  secretToMaries: boolean;
  status: 'SYNCHRONISE' | 'MODIFIE_LOCALEMENT' | 'A_CONFIRMER';
  thumbnail: string;
}

export interface ExternalConnector {
  id: string;
  name: string;
  type: 'CALENDRIER' | 'EMAIL' | 'PAIEMENT' | 'AUDIO' | 'STOCKAGE' | 'DMX_SON';
  icon: string;
  connected: boolean;
  targetIdentityId?: string;
  targetProjectId?: string;
  lastSync: string;
  permissionsScope: string[];
}
