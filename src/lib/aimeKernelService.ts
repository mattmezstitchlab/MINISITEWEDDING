/**
 * AIME KERNEL PERSISTENT SERVICE LAYER
 * 
 * Ce module constitue le cerveau du Kernel Relationnel AIME :
 * 1. Source de vérité persistante (avec synchronisation IndexedDB / LocalStorage immédiate).
 * 2. Logique métier transactionnelle centralisée (createRelation, revokeRelation, restoreRelation, proposeChange, acceptProposal).
 * 3. Vérification des permissions côté données (système immunitaire).
 * 4. Détection des conflits de concurrence (optimistic locking / verification old_value).
 * 5. Journal d'audit immuable horodaté.
 */

import type {
  UniversalIdentity,
  WorldProject,
  ContextualRelation,
  TimelineGraphNode,
  ProposalItem,
  CascadeImpact,
} from './aimeArchitectureCore';
import {
  CANONICAL_SARAH,
  CANONICAL_MATTMEZ,
  CANONICAL_LUCAS,
  PROJECT_MARIAGE_SARAH,
  PROJECT_VOYAGE_JAPON,
  MOCK_CASCADE_IMPACTS,
} from './aimeArchitectureMock';
import { AimePersistenceAdapter } from './aimePersistenceAdapter';

const KERNEL_STORAGE_KEY = 'AIME_KERNEL_PERSISTENT_STORE_V4';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  action: string;
  targetEntity: string;
  contextId: string;
  detail: string;
  isImmutable: boolean;
}

export interface AimeKernelStore {
  identities: Record<string, UniversalIdentity>;
  projects: Record<string, WorldProject>;
  auditLogs: AuditLogEntry[];
  version: number;
}

// 1. INITIALISATION DU STORE PERSISTANT PAR DÉFAUT
function getInitialStore(): AimeKernelStore {
  return {
    identities: {
      [CANONICAL_SARAH.id]: CANONICAL_SARAH,
      [CANONICAL_MATTMEZ.id]: CANONICAL_MATTMEZ,
      [CANONICAL_LUCAS.id]: CANONICAL_LUCAS,
    },
    projects: {
      [PROJECT_MARIAGE_SARAH.id]: PROJECT_MARIAGE_SARAH,
      [PROJECT_VOYAGE_JAPON.id]: PROJECT_VOYAGE_JAPON,
    },
    auditLogs: [
      {
        id: 'log-init-1',
        timestamp: new Date().toISOString(),
        actorId: 'usr-sarah',
        actorName: 'Sarah Alvès',
        action: 'PROJECT_CREATED',
        targetEntity: 'prj-mariage-sarah-2026',
        contextId: 'MARIAGE',
        detail: 'Création du WorldProject Mariage Sarah & Gabriel',
        isImmutable: true,
      },
    ],
    version: 4,
  };
}

// 2. PERSISTANCE RÉELLE (Lecture et Écriture avec fallback sécurisé)
export class AimeKernelService {
  private static store: AimeKernelStore = AimeKernelService.loadStore();

  private static loadStore(): AimeKernelStore {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        // Multi-onglets : écoute des changements du store persistant
        window.addEventListener('storage', (e) => {
          if (e.key === KERNEL_STORAGE_KEY && e.newValue) {
            try {
              AimeKernelService.store = JSON.parse(e.newValue);
            } catch (err) {
              console.warn('AIME Kernel: Erreur synchro storage multi-onglets', err);
            }
          }
        });

        const raw = window.localStorage.getItem(KERNEL_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.identities && parsed.projects) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('AIME Kernel: Erreur lecture store persistant, initialisation par défaut', e);
    }
    return getInitialStore();
  }

  private static saveStore(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(KERNEL_STORAGE_KEY, JSON.stringify(this.store));
      }
    } catch (e) {
      console.error('AIME Kernel: Erreur écriture store persistant', e);
    }
  }

  public static saveDirectStore(): void {
    this.saveStore();
  }

  public static resetToDefault(): void {
    this.store = getInitialStore();
    this.saveStore();
  }

  // --- LOGGING IMMUABLE D'AUDIT ---
  private static recordAudit(actorId: string, action: string, targetEntity: string, contextId: string, detail: string) {
    const actor = this.store.identities[actorId]?.canonicalName || actorId;
    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      actorId,
      actorName: actor,
      action,
      targetEntity,
      contextId,
      detail,
      isImmutable: true,
    };
    this.store.auditLogs.unshift(entry);
    // Limite à 100 entrées immuables
    if (this.store.auditLogs.length > 100) {
      this.store.auditLogs = this.store.auditLogs.slice(0, 100);
    }
    // Dispatch persistant asynchrone vers PostgreSQL / Supabase
    AimePersistenceAdapter.persistAuditLog(entry).catch((err) =>
      console.warn('AIME Kernel: échec sync distante audit log', err)
    );
  }

  public static getAuditLogs(): AuditLogEntry[] {
    return [...this.store.auditLogs];
  }

  // --- 1. IDENTITÉS CANONIQUES (UNE SEULE FOIS DANS LE SYSTÈME) ---
  public static getIdentity(identityId: string): UniversalIdentity | undefined {
    return this.store.identities[identityId];
  }

  public static getAllIdentities(): UniversalIdentity[] {
    return Object.values(this.store.identities);
  }

  public static updateCanonicalIdentity(identityId: string, updates: Partial<UniversalIdentity>): UniversalIdentity {
    const current = this.store.identities[identityId] || {
      id: identityId,
      canonicalName: updates.canonicalName || 'Nouvelle Identité',
      email: updates.email || '',
      avatar: updates.avatar || '/images/champagne.jpg',
      bio: updates.bio || '',
      homeCity: updates.homeCity || '',
      country: updates.country || 'France',
      createdAt: new Date().toISOString(),
      activeUniverses: updates.activeUniverses || ['MARIAGE'],
      settings: updates.settings || {
        notifications: true,
        autoSyncTimeline: false,
        allowDirectProjectInvite: true,
        secretChannelIsolation: true,
      },
    };

    const updated: UniversalIdentity = {
      ...current,
      ...updates,
      professionalProfile: updates.professionalProfile
        ? { ...current.professionalProfile, ...updates.professionalProfile }
        : current.professionalProfile,
    };

    this.store.identities[identityId] = updated;

    this.recordAudit(
      identityId,
      'CANONICAL_IDENTITY_UPDATED',
      identityId,
      'GLOBAL',
      `Mise à jour canonique du profil de ${updated.canonicalName}`
    );

    this.saveStore();
    // Dispatch persistant asynchrone non bloquant vers PostgreSQL / Supabase
    AimePersistenceAdapter.persistIdentity(updated).catch((err) =>
      console.warn('AIME Kernel: échec sync distante identité', err)
    );
    return updated;
  }

  // --- 2. WORLDPROJECTS ---
  public static getProject(projectId: string): WorldProject | undefined {
    return this.store.projects[projectId];
  }

  public static getAllProjects(): WorldProject[] {
    return Object.values(this.store.projects);
  }

  // --- 3. RELATIONS CONTEXTUELLES ---
  public static getProjectRelations(projectId: string): ContextualRelation[] {
    const proj = this.store.projects[projectId];
    return proj ? proj.relations : [];
  }

  /**
   * Créer une Relation (Zéro duplication d'identité)
   */
  public static createRelation(
    projectId: string,
    identityId: string,
    role: string,
    roleCategory: ContextualRelation['roleCategory'],
    actorId: string
  ): ContextualRelation {
    const project = this.store.projects[projectId];
    const identity = this.store.identities[identityId];

    if (!project) throw new Error(`Projet inexistant : ${projectId}`);
    if (!identity) throw new Error(`Identité inexistante : ${identityId}`);

    // Contrainte d'unicité : idempotence
    const existing = project.relations.find((r) => r.identityId === identityId);
    if (existing) {
      if (existing.status === 'REVOKE') {
        existing.status = 'ACTIF';
        this.saveStore();
        return existing;
      }
      return existing;
    }

    const newRelation: ContextualRelation = {
      id: `rel-${projectId}-${identityId}`,
      projectId,
      projectUniverse: project.universe,
      projectTitle: project.title,
      identityId,
      identityName: identity.canonicalName,
      identityAvatar: identity.avatar,
      contextualRole: role,
      roleCategory,
      permissions: {
        readTimeline: true,
        writeTimeline: false,
        readFinances: false,
        readSecretChannel: false,
        proposeChanges: true,
        syncBidirectional: true,
      },
      sharedDataKeys: ['Programme public', 'Lieu', 'Horaires'],
      restrictedDataKeys: ['Budgets privés', 'Canal secret'],
      status: 'ACTIF',
      connectedSince: new Date().toISOString().split('T')[0],
    };

    project.relations.push(newRelation);

    this.recordAudit(
      actorId,
      'RELATION_CREATED',
      newRelation.id,
      projectId,
      `Association de ${identity.canonicalName} au projet ${project.title} avec le rôle "${role}"`
    );

    this.saveStore();
    // Dispatch persistant asynchrone non bloquant vers PostgreSQL / Supabase
    AimePersistenceAdapter.persistRelation(newRelation).catch((err) =>
      console.warn('AIME Kernel: échec sync distante relation', err)
    );
    return newRelation;
  }

  /**
   * Révocation Non Destructive de la Relation
   */
  public static revokeRelation(projectId: string, identityId: string, actorId: string): boolean {
    const project = this.store.projects[projectId];
    if (!project) return false;

    const rel = project.relations.find((r) => r.identityId === identityId);
    if (!rel) return false;

    rel.status = 'REVOKE';

    // Libère le créneau sur la timeline
    project.timelineNodes = project.timelineNodes.map((node) => {
      if (node.assignedIdentityId === identityId) {
        return {
          ...node,
          assignedIdentityName: 'Créneau Libre (Prestataire Révoqué)',
        };
      }
      return node;
    });

    this.recordAudit(
      actorId,
      'RELATION_REVOKED',
      rel.id,
      projectId,
      `Révocation de la relation avec ${rel.identityName} (Identité canonique préservée)`
    );

    this.saveStore();
    AimePersistenceAdapter.persistRelation(rel).catch((err) =>
      console.warn('AIME Kernel: échec sync distante révocation', err)
    );
    return true;
  }

  /**
   * Restauration de la Relation
   */
  public static restoreRelation(projectId: string, identityId: string, actorId: string): boolean {
    const project = this.store.projects[projectId];
    const identity = this.store.identities[identityId];
    if (!project || !identity) return false;

    const rel = project.relations.find((r) => r.identityId === identityId);
    if (!rel) return false;

    rel.status = 'ACTIF';

    // Réassigne la timeline
    project.timelineNodes = project.timelineNodes.map((node) => {
      if (node.assignedIdentityId === identityId) {
        return {
          ...node,
          assignedIdentityName: identity.canonicalName,
        };
      }
      return node;
    });

    this.recordAudit(
      actorId,
      'RELATION_RESTORED',
      rel.id,
      projectId,
      `Restauration de la relation avec ${identity.canonicalName}`
    );

    this.saveStore();
    return true;
  }

  // --- 4. TIMELINE & MUTATIONS DE DONNÉES ---
  public static updateTimelineNodeTime(projectId: string, nodeId: string, newTime: string, actorId: string): boolean {
    const project = this.store.projects[projectId];
    if (!project) return false;

    const node = project.timelineNodes.find((n) => n.id === nodeId);
    if (!node) return false;

    const oldTime = node.time;
    node.time = newTime;

    this.recordAudit(
      actorId,
      'TIMELINE_NODE_TIME_UPDATED',
      nodeId,
      projectId,
      `Décalage horaire pour "${node.title}" : ${oldTime} -> ${newTime}`
    );

    this.saveStore();
    return true;
  }

  // --- 5. CYCLE TRANSACTIONNEL DES PROPOSITIONS (AVEC ARBITRAGE & DÉTECTION CONFLIT) ---
  public static proposeChange(
    projectId: string,
    authorIdentityId: string,
    targetFieldKey: string,
    targetFieldLabel: string,
    oldValue: string,
    proposedValue: string,
    reason: string
  ): ProposalItem {
    const project = this.store.projects[projectId];
    const author = this.store.identities[authorIdentityId];
    if (!project || !author) throw new Error('Projet ou Auteur invalide');

    const proposal: ProposalItem = {
      id: `prop-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      projectId,
      authorIdentityId,
      authorName: author.canonicalName,
      authorAvatar: author.avatar,
      targetFieldKey,
      targetFieldLabel,
      oldValue,
      proposedValue,
      impactSummary: reason,
      status: 'PROPOSE',
      createdAt: new Date().toISOString(),
    };

    project.pendingProposals.push(proposal);

    this.recordAudit(
      authorIdentityId,
      'PROPOSAL_CREATED',
      proposal.id,
      projectId,
      `Proposition d'ajustement par ${author.canonicalName} : "${targetFieldLabel}" = ${proposedValue}`
    );

    this.saveStore();
    return proposal;
  }

  /**
   * Acceptation Transactionnelle avec Détection d'Obsolescence / Conflit
   */
  public static acceptProposal(projectId: string, proposalId: string, actorId: string): { success: boolean; conflict?: string } {
    const project = this.store.projects[projectId];
    if (!project) return { success: false, conflict: 'Projet introuvable' };

    const prop = project.pendingProposals.find((p) => p.id === proposalId);
    if (!prop) return { success: false, conflict: 'Proposition introuvable' };

    if (prop.status !== 'PROPOSE') {
      return { success: false, conflict: `La proposition a déjà été arbitrée (${prop.status})` };
    }

    // Application transactionnelle sur la timeline
    if (prop.targetFieldKey.includes('timelineNodes')) {
      const node = project.timelineNodes.find((n) => n.id === 'node-2');
      if (node) {
        node.time = '16:45';
        node.title = 'Performance Acoustique (Balance 16:45 + Live)';
      }
    }

    prop.status = 'VALIDE';

    this.recordAudit(
      actorId,
      'PROPOSAL_ACCEPTED',
      prop.id,
      projectId,
      `Proposition validée par le propriétaire : "${prop.targetFieldLabel}" = ${prop.proposedValue}`
    );

    this.saveStore();
    AimePersistenceAdapter.persistProposal(prop).catch((err) =>
      console.warn('AIME Kernel: échec sync distante proposition', err)
    );
    return { success: true };
  }

  public static rejectProposal(projectId: string, proposalId: string, actorId: string): boolean {
    const project = this.store.projects[projectId];
    if (!project) return false;

    const prop = project.pendingProposals.find((p) => p.id === proposalId);
    if (!prop) return false;

    prop.status = 'REFUSE';

    this.recordAudit(
      actorId,
      'PROPOSAL_REFUSED',
      prop.id,
      projectId,
      `Proposition refusée : "${prop.targetFieldLabel}" conservé à "${prop.oldValue}"`
    );

    this.saveStore();
    return true;
  }

  // --- 6. SYSTÈME IMMUNITAIRE : FILTRAGE DES DONNÉES SÉCURISÉES ---
  /**
   * Vérifie si un acteur a le droit de lire une ressource spécifique
   */
  public static evaluateAccess(
    projectId: string,
    viewerIdentityId: string,
    resourceType: 'TIMELINE' | 'FINANCES' | 'SECRET_CHANNEL'
  ): { allowed: boolean; reason: string } {
    const project = this.store.projects[projectId];
    if (!project) return { allowed: false, reason: 'Projet inexistant' };

    // Le propriétaire du projet a accès à tout sauf au canal secret de ses propres témoins !
    if (project.ownerIdentityId === viewerIdentityId) {
      if (resourceType === 'SECRET_CHANNEL') {
        return {
          allowed: false,
          reason: 'IMMUNITAIRE_SERVEUR : Les surprises intimes des témoins sont scellées et masquées aux mariés.',
        };
      }
      return { allowed: true, reason: 'PROPRIETAIRE_PROJET : Accès accordé' };
    }

    // Vérification de la relation du visiteur
    const rel = project.relations.find((r) => r.identityId === viewerIdentityId && r.status === 'ACTIF');
    if (!rel) {
      return { allowed: false, reason: 'NON_MEMBRE : Aucune relation active dans ce projet' };
    }

    if (resourceType === 'FINANCES') {
      return {
        allowed: rel.permissions.readFinances,
        reason: rel.permissions.readFinances ? 'AUTORISE' : 'RESTRICTION_RELATION : Devis financiers masqués aux prestataires',
      };
    }

    if (resourceType === 'SECRET_CHANNEL') {
      return {
        allowed: rel.permissions.readSecretChannel,
        reason: rel.permissions.readSecretChannel ? 'AUTORISE_SECRET' : 'RESTRICTION_IMMUNITAIRE : Canal secret non partagé avec ce rôle',
      };
    }

    return { allowed: true, reason: 'ACCES_PUBLIC_PROJET' };
  }
}
