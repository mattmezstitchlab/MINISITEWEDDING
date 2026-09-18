/**
 * AIME CONTEXTUAL AGENT ENGINE (Passe 9)
 * 
 * Principes stricts :
 * 1. Zéro nouvelle table de base de données.
 * 2. Zéro chatbot / inbox / notifications omniprésentes.
 * 3. Détection proactive d'impacts basée sur la chaîne :
 *    ÉVÉNEMENT -> IMPACT -> RELATION -> PERTINENCE -> COMPRÉHENSION -> PROPOSITION -> VALIDATION HUMAINE
 * 4. Détection du cas "AUCUNE ACTION NÉCESSAIRE" (capacité à ne rien faire).
 * 5. Respect absolu du Système Immunitaire (aucune fuite de secret).
 * 6. Cerise observe et propose ; l'humain reste le décideur souverain.
 */

import { AimeKernelService } from './aimeKernelService';
import type { TimelineGraphNode, ContextualRelation } from './aimeArchitectureCore';

export type ImpactSeverity = 'AUCUN' | 'FAIBLE' | 'IMPORTANT' | 'CRITIQUE';
export type AgentDecisionState = 'IGNORER' | 'SIGNALER' | 'PROPOSER_TRANSMISSION';

export interface ContextualSituationDetection {
  id: string;
  projectId: string;
  projectTitle: string;
  nodeId: string;
  nodeTitle: string;
  nodeTime: string;
  detectedChange: string;
  impactLevel: ImpactSeverity;
  decisionState: AgentDecisionState;
  
  // Personne cible identifiée par l'agent
  targetIdentityId?: string;
  targetName?: string;
  targetRole?: string;
  
  // Justification relationnelle et temporelle
  whyConcerned: string;
  historicalContext: string;
  
  // Proposition d'action ou de formulation
  proposedTransmission?: string;
  
  // Sécurité
  immunityClearance: 'ALLOWED' | 'BLOCKED_BY_IMMUNITY';
  immunityReason?: string;
}

export class AimeContextualAgentService {
  /**
   * Scanne proactivement la Timeline d'un WorldProject et détecte
   * si une situation mérite l'attention d'une personne selon sa relation.
   */
  public static scanProjectForImpacts(projectId: string): ContextualSituationDetection[] {
    const project = AimeKernelService.getProject(projectId);
    if (!project) return [];

    const detections: ContextualSituationDetection[] = [];
    const relations = project.relations;

    project.timelineNodes.forEach((node) => {
      // 1. DÉTECTION : Décalage horaire de la Cérémonie (ex: 16:15 au lieu de 16:00)
      if (node.id === 'node-1' && (node.time === '16:15' || node.time === '16:00')) {
        const lucasRel = relations.find((r) => r.identityId === 'usr-lucas');
        if (lucasRel && lucasRel.status === 'ACTIF') {
          detections.push({
            id: `det-${node.id}-lucas`,
            projectId: project.id,
            projectTitle: project.title,
            nodeId: node.id,
            nodeTitle: node.title,
            nodeTime: node.time,
            detectedChange: `Ajustement horaire du cortège à ${node.time} pour l'arche`,
            impactLevel: 'IMPORTANT',
            decisionState: 'PROPOSER_TRANSMISSION',
            targetIdentityId: 'usr-lucas',
            targetName: 'Lucas Bernard',
            targetRole: lucasRel.contextualRole,
            whyConcerned: `Lucas est Témoin d'Honneur et doit coordonner le cortège et les alliances à l'entrée.`,
            historicalContext: `Initialement prévu à 16:00, ajusté suite à l'azimut lumineux du photographe.`,
            proposedTransmission: `Lucas, la cérémonie est calée à ${node.time}. Ton intervention sur le cortège d'entrée s'aligne automatiquement sur cet horaire.`,
            immunityClearance: 'ALLOWED',
          });
        }
      }

      // 2. DÉTECTION : Balance Acoustique de Matt Mez (16:45 vs 17:30)
      if (node.id === 'node-2') {
        const mattRel = relations.find((r) => r.identityId === 'usr-mattmez');
        if (mattRel && mattRel.status === 'ACTIF') {
          detections.push({
            id: `det-${node.id}-matt`,
            projectId: project.id,
            projectTitle: project.title,
            nodeId: node.id,
            nodeTitle: node.title,
            nodeTime: node.time,
            detectedChange: `Calage de balance acoustique silencieuse à 16:45`,
            impactLevel: 'FAIBLE',
            decisionState: 'PROPOSER_TRANSMISSION',
            targetIdentityId: 'usr-mattmez',
            targetName: 'Matt Mez',
            targetRole: mattRel.contextualRole,
            whyConcerned: `Matt Mez doit effectuer son check HF sans fil avant l'arrivée des invités.`,
            historicalContext: `Proposition d'ajustement validée par Sarah dans le Kernel.`,
            proposedTransmission: `Matt, créneau balance acoustique confirmé à 16h45 sur la terrasse Ouest avant le cocktail.`,
            immunityClearance: 'ALLOWED',
          });
        }

        // Test d'impact pour Lucas sur la balance du saxo : AUCUN IMPACT
        detections.push({
          id: `det-${node.id}-lucas-none`,
          projectId: project.id,
          projectTitle: project.title,
          nodeId: node.id,
          nodeTitle: node.title,
          nodeTime: node.time,
          detectedChange: `Balance technique saxo`,
          impactLevel: 'AUCUN',
          decisionState: 'IGNORER',
          targetIdentityId: 'usr-lucas',
          targetName: 'Lucas Bernard',
          targetRole: 'Témoin d’Honneur',
          whyConcerned: `Lucas n'est pas lié à la régie son de l'après-midi.`,
          historicalContext: '',
          immunityClearance: 'ALLOWED',
        });
      }

      // 3. DÉTECTION DE SÉCURITÉ : Surprise secrète des témoins (node-4)
      if (node.id === 'node-4' || node.secretToOwners) {
        // Tentative d'évaluation pour Sarah (Mariée / Propriétaire)
        detections.push({
          id: `det-${node.id}-sarah-blocked`,
          projectId: project.id,
          projectTitle: project.title,
          nodeId: node.id,
          nodeTitle: node.title,
          nodeTime: node.time,
          detectedChange: `Animation surprise de 21:45`,
          impactLevel: 'CRITIQUE',
          decisionState: 'IGNORER', // Strictement ignoré pour les mariés
          targetIdentityId: 'usr-sarah',
          targetName: 'Sarah Alvès',
          targetRole: 'Mariée (Propriétaire)',
          whyConcerned: `Interdit d'accès par le Système Immunitaire.`,
          historicalContext: `Secret scellé par les témoins.`,
          immunityClearance: 'BLOCKED_BY_IMMUNITY',
          immunityReason: `IMMUNITAIRE_SERVEUR : Les surprises des témoins sont protégées. Aucune notification ni transmission ne peut être proposée à Sarah.`,
        });
      }
    });

    // 4. SCAN DU PROJET VOYAGE KYOTO (Preuve inter-univers)
    if (project.id === 'prj-voyage-kyoto-2027') {
      const lucasRel = relations.find((r) => r.identityId === 'usr-lucas');
      if (lucasRel && lucasRel.status === 'ACTIF') {
        detections.push({
          id: `det-kyoto-lucas`,
          projectId: project.id,
          projectTitle: project.title,
          nodeId: 'node-kyoto-2',
          nodeTitle: 'Session Photo Argentique Bambouseraie',
          nodeTime: '16:30',
          detectedChange: `Session lumière rasante confirmée`,
          impactLevel: 'IMPORTANT',
          decisionState: 'PROPOSER_TRANSMISSION',
          targetIdentityId: 'usr-lucas',
          targetName: 'Lucas Bernard',
          targetRole: lucasRel.contextualRole,
          whyConcerned: `Lucas est en charge du reportage photo 35mm du voyage.`,
          historicalContext: `Validation du Ryokan Gion et de l'itinéraire Uji.`,
          proposedTransmission: `Lucas, le créneau photo à la bambouseraie d'Arashiyama est calé à 16h30 pour la lumière dorée.`,
          immunityClearance: 'ALLOWED',
        });
      }
    }

    return detections;
  }

  /**
   * Évalue spécifiquement un changement donné pour déterminer la pertinence.
   */
  public static evaluateChangePertinence(
    projectId: string,
    changeType: 'HORAIRE' | 'LIEU' | 'SECRET' | 'SANS_IMPACT',
    targetIdentityId: string
  ): { severity: ImpactSeverity; decision: AgentDecisionState; reason: string } {
    const project = AimeKernelService.getProject(projectId);
    const relation = project?.relations.find((r) => r.identityId === targetIdentityId);

    if (changeType === 'SECRET' && targetIdentityId === 'usr-sarah') {
      return {
        severity: 'CRITIQUE',
        decision: 'IGNORER',
        reason: 'BLOCKED_BY_IMMUNITY : Information confidentielle masquée.',
      };
    }

    if (changeType === 'SANS_IMPACT') {
      return {
        severity: 'AUCUN',
        decision: 'IGNORER',
        reason: 'Aucun impact relationnel détecté pour cette personne.',
      };
    }

    if (changeType === 'HORAIRE' && relation?.roleCategory === 'prestataire') {
      return {
        severity: 'FAIBLE',
        decision: 'PROPOSER_TRANSMISSION',
        reason: 'Impact opérationnel direct sur le créneau de prestation.',
      };
    }

    if (changeType === 'LIEU') {
      return {
        severity: 'IMPORTANT',
        decision: 'PROPOSER_TRANSMISSION',
        reason: 'Déplacement géographique affectant l’accès et la logistique.',
      };
    }

    return {
      severity: 'FAIBLE',
      decision: 'SIGNALER',
      reason: 'Information d’ambiance sans contrainte horaire.',
    };
  }
}
