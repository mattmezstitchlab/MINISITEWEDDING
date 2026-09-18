/**
 * AIME UNIVERSAL RELATION GRAPH SYSTEM (Phase 2 Architecture)
 * 
 * Fondations strictes :
 * 1. ZÉRO DUPLICATION : Identité, Lieu, Média, Document existent 1 seule fois.
 * 2. MULTI-UNIVERS : Mariage, Voyage, Profession, Passion, Famille, Association, Événement, Projet.
 * 3. RÔLE CONTEXTUEL : attachée à la RELATION (pas à l'identité).
 * 4. PROPRIÉTÉ & SOURCE DE VÉRITÉ : chaque donnée a son propriétaire canonique.
 * 5. CYCLES DE PROPOSITION : PROPOSÉ -> VALIDÉ / REFUSÉ / EXPIRÉ (jamais d'écrasement silencieux).
 * 6. CASCADE D'IMPACTS CONTRÔLÉE : identifier les éléments affectés sans tout forcer automatiquement.
 * 7. SYSTÈME IMMUNITAIRE : PUBLIC, PARTAGÉ, PRIVÉ, SECRET.
 */

export type UniverseCategory =
  | 'MARIAGE'
  | 'VOYAGE'
  | 'PASSION'
  | 'PROFESSION'
  | 'FAMILLE'
  | 'ASSOCIATION'
  | 'EVENEMENT'
  | 'PROJET_PERSO';

export type VisibilityLevel = 'PUBLIC' | 'PARTAGE' | 'PRIVE' | 'SECRET';

export type ProposalStatus = 'PROPOSE' | 'VALIDE' | 'REFUSE' | 'EXPIRE';

export type SyncEngineState = 'EN_DIRECT' | 'EN_ATTENTE' | 'A_CONFIRMER' | 'REFUSE' | 'BLOQUE' | 'DECONNECTE';

export interface DataOwnershipRecord<T = any> {
  key: string;
  label: string;
  value: T;
  ownerIdentityId: string;
  ownerName: string;
  sourceContext: 'IDENTITE_CANONIQUE' | 'PROFIL_PRO' | 'WORLD_PROJECT' | 'RELATION';
  visibility: VisibilityLevel;
  lastModified: string;
  canEditRoleIds: string[];
}

export interface UniversalIdentity {
  id: string; // Ex: 'user-mattmez'
  canonicalName: string;
  email: string;
  avatar: string;
  bio: string;
  homeCity: string;
  country: string;
  createdAt: string;

  // Profil Professionnel canonique (indépendant de tout projet)
  professionalProfile?: {
    trade: string;
    companyName: string;
    proEmail: string;
    proPhone: string;
    riderAcoustique: string;
    tarifBase: string;
    portfolioMedias: string[];
  };

  // Les multiples Univers auxquels cette identité est connectée
  activeUniverses: UniverseCategory[];

  settings: {
    notifications: boolean;
    autoSyncTimeline: boolean;
    allowDirectProjectInvite: boolean;
    secretChannelIsolation: boolean;
  };
}

export interface ContextualRelation {
  id: string;
  projectId: string;
  projectUniverse: UniverseCategory;
  projectTitle: string;
  
  // Pointe vers l'identité unique canonique
  identityId: string;
  identityName: string;
  identityAvatar: string;

  // Rôle contextuel (n'est PAS une propriété fixe de la personne)
  contextualRole: string; // Ex: 'Prestataire Saxo' dans Mariage, mais 'Co-voyageur' dans Voyage Japon
  roleCategory: 'prestataire' | 'invite' | 'organisateur' | 'collaborateur' | 'famille';
  
  // Matrice de permissions fine sur CETTE relation précise
  permissions: {
    readTimeline: boolean;
    writeTimeline: boolean;
    readFinances: boolean;
    readSecretChannel: boolean;
    proposeChanges: boolean;
    syncBidirectional: boolean;
  };

  // Données partagées vs non partagées
  sharedDataKeys: string[];
  restrictedDataKeys: string[];

  status: 'ACTIF' | 'SUSPENDU' | 'A_CONFIRMER' | 'REVOKE';
  connectedSince: string;
}

export interface ProposalItem {
  id: string;
  projectId: string;
  authorIdentityId: string;
  authorName: string;
  authorAvatar: string;
  targetFieldKey: string;
  targetFieldLabel: string;
  oldValue: string;
  proposedValue: string;
  impactSummary: string;
  status: ProposalStatus;
  createdAt: string;
}

export interface CascadeImpact {
  id: string;
  label: string;
  targetEntity: string;
  affectedIdentityName: string;
  reason: string;
  impactLevel: 'CRITIQUE' | 'MAJEUR' | 'MINEUR';
  proposedAction: string;
}

export interface TimelineGraphNode {
  id: string;
  time: string;
  title: string;
  locationName: string;
  projectId: string;
  primaryRelationId?: string;
  assignedIdentityId?: string;
  assignedIdentityName?: string;
  accessLevel: VisibilityLevel;
  secretToOwners: boolean;
  dataSourceKey: string;
  syncState: SyncEngineState;
}

export interface WorldProject {
  id: string;
  universe: UniverseCategory;
  title: string;
  tagline: string;
  coverImage: string;
  ownerIdentityId: string;
  date: string;
  locationName: string;
  locationAddress: string;
  city: string;
  country: string;
  
  // Relations liant ce projet aux identités canoniques
  relations: ContextualRelation[];

  // Timeline : vue vivante et convergente du graphe
  timelineNodes: TimelineGraphNode[];

  // Propositions d'arbitrage
  pendingProposals: ProposalItem[];
}
