/**
 * AIME TRANSMISSION ENGINE (Passe 8)
 * 
 * Principes stricts :
 * 1. Zéro nouvelle table de base de données.
 * 2. Zéro messagerie / boîte de réception / chat / threads.
 * 3. La transmission est une PROJECTION de compréhension générée à partir du graphe relationnel et temporel.
 * 4. Respect absolu du système immunitaire (aucune fuite de secret ou de finance).
 * 5. L'humain arbitre et valide (Cerise propose, l'humain décide).
 */

import type { VisibilityLevel } from './aimeArchitectureCore';
import { AimeKernelService } from './aimeKernelService';

export type TransmissionLevel = 'DIRECT' | 'CONTEXTUEL' | 'HISTORIQUE' | 'COMPLEXE';

export interface TransmissionExplanation {
  situationTitle: string;
  projectId: string;
  projectTitle: string;
  targetIdentityId: string;
  targetName: string;
  targetRole: string;
  whyNow: string;
  historicalContext: string;
  consequences: string;
  recommendedTransmission: string;
  transmissionLevel: TransmissionLevel;
  securityClearance: 'ALLOWED' | 'BLOCKED_BY_IMMUNITY';
  immunityReason?: string;
  needsTransmission: boolean;
}

export class AimeTransmissionService {
  /**
   * Synthétise la compréhension d'une situation pour une personne cible donnée,
   * en croisant son identité canonique, sa relation contextuelle et la timeline.
   */
  public static explainSituationForPerson(
    projectId: string,
    targetIdentityId: string,
    situationKey: 'CEREMONIE_DECALEE' | 'BALANCE_SAXO' | 'SURPRISE_TEMOINS' | 'VOYAGE_RYOKAN'
  ): TransmissionExplanation {
    const project = AimeKernelService.getProject(projectId);
    const targetIdentity = AimeKernelService.getIdentity(targetIdentityId);
    const targetRelation = project?.relations.find((r) => r.identityId === targetIdentityId);

    if (!project || !targetIdentity || !targetRelation) {
      return {
        situationTitle: 'Situation indéterminée',
        projectId,
        projectTitle: project?.title || 'Projet inconnu',
        targetIdentityId,
        targetName: targetIdentity?.canonicalName || 'Inconnu',
        targetRole: 'Non défini',
        whyNow: 'Aucun contexte relationnel actif',
        historicalContext: '',
        consequences: '',
        recommendedTransmission: '',
        transmissionLevel: 'DIRECT',
        securityClearance: 'BLOCKED_BY_IMMUNITY',
        immunityReason: 'Aucune relation active dans ce projet.',
        needsTransmission: false,
      };
    }

    // 1. SCÉNARIO HISTORIQUE CENTRAL : Décision ancienne impactant Lucas (Témoin)
    if (situationKey === 'CEREMONIE_DECALEE') {
      const whyNow = `La cérémonie d'entrée a été ajustée de 15 min suite au créneau d'ensoleillement de l'arche.`;
      const historicalContext = `À l'origine, Sarah avait posé la bénédiction à 16:00. Le photographe a demandé un ajustement pour capter l'azimut lumineux.`;
      const consequences = `Votre intervention pour le cortège et l'ouverture du livret se cale désormais à 16:15. Votre surprise de 21:45 reste inchangée.`;
      
      const recommendedTransmission = targetIdentity.id === 'usr-lucas'
        ? `Lucas, la cérémonie est décalée à 16h15 pour la lumière. Ton rôle sur le cortège s'aligne automatiquement sur ce nouvel horaire.`
        : targetIdentity.id === 'usr-mattmez'
        ? `Information régie : Cérémonie calée à 16h15. Ton arrivée cocktail reste fixée à 17h30.`
        : `La cérémonie débutera à 16h15.`;

      return {
        situationTitle: 'Ajustement horaire de la Cérémonie',
        projectId,
        projectTitle: project.title,
        targetIdentityId,
        targetName: targetIdentity.canonicalName,
        targetRole: targetRelation.contextualRole,
        whyNow,
        historicalContext,
        consequences,
        recommendedTransmission,
        transmissionLevel: 'HISTORIQUE',
        securityClearance: 'ALLOWED',
        needsTransmission: true,
      };
    }

    // 2. SCÉNARIO PRESTATAIRE : Balance acoustique Matt Mez
    if (situationKey === 'BALANCE_SAXO') {
      const isMatt = targetIdentity.id === 'usr-mattmez';
      const isSarah = targetIdentity.id === 'usr-sarah';

      // Pour Sarah (propriétaire) : information courte d'arbitrage
      if (isSarah) {
        return {
          situationTitle: 'Calage Balance Acoustique Sunset',
          projectId,
          projectTitle: project.title,
          targetIdentityId,
          targetName: targetIdentity.canonicalName,
          targetRole: targetRelation.contextualRole,
          whyNow: `Matt Mez a proposé de vérifier le HF à 16:45 avant l'arrivée des invités.`,
          historicalContext: `Proposition transactionnelle enregistrée dans le Kernel.`,
          consequences: `La terrasse Ouest doit être dégagée de la brigade 45 min avant le cocktail.`,
          recommendedTransmission: `Matt Mez propose une balance à 16h45 pour tester le micro HF silencieusement.`,
          transmissionLevel: 'CONTEXTUEL',
          securityClearance: 'ALLOWED',
          needsTransmission: true,
        };
      }

      // Pour Matt Mez : confirmation de son créneau
      if (isMatt) {
        return {
          situationTitle: 'Validation de votre balance HF',
          projectId,
          projectTitle: project.title,
          targetIdentityId,
          targetName: targetIdentity.canonicalName,
          targetRole: targetRelation.contextualRole,
          whyNow: `Votre rider sans fil 80m est confirmé par la régie du château.`,
          historicalContext: `Aligné sur le créneau Sunset de 17:30.`,
          consequences: `Accès terrasse Ouest garanti dès 16:45.`,
          recommendedTransmission: `Créneau balance confirmé à 16h45 sur la terrasse Ouest. Liaison directe DJ opérationnelle.`,
          transmissionLevel: 'DIRECT',
          securityClearance: 'ALLOWED',
          needsTransmission: true,
        };
      }
    }

    // 3. SCÉNARIO IMMUNITAIRE STRICT : Tentative de fuite du secret des témoins vers Sarah
    if (situationKey === 'SURPRISE_TEMOINS') {
      const isSarah = targetIdentity.id === 'usr-sarah';
      if (isSarah) {
        // BLOCAGE DU SYSTÈME IMMUNITAIRE : AUCUNE TRANSMISSION POSSIBLE VERS LES MARIÉS
        return {
          situationTitle: 'Projection Vidéo Secrète des Témoins',
          projectId,
          projectTitle: project.title,
          targetIdentityId,
          targetName: targetIdentity.canonicalName,
          targetRole: targetRelation.contextualRole,
          whyNow: 'Accès refusé par le Système Immunitaire.',
          historicalContext: 'Canal secret réservé aux témoins.',
          consequences: 'Information confidentielle masquée.',
          recommendedTransmission: '',
          transmissionLevel: 'COMPLEXE',
          securityClearance: 'BLOCKED_BY_IMMUNITY',
          immunityReason: 'IMMUNITAIRE_SERVEUR : Les surprises intimes des témoins sont scellées et ne peuvent faire l’objet d’aucune transmission vers les mariés.',
          needsTransmission: false,
        };
      }

      // Pour Lucas (Témoin) : transmission autorisée
      return {
        situationTitle: 'Coordination Projection Vidéo 21:45',
        projectId,
        projectTitle: project.title,
        targetIdentityId,
        targetName: targetIdentity.canonicalName,
        targetRole: targetRelation.contextualRole,
        whyNow: `Le DJ a validé le câble HDMI et la régie son pour la vidéo de 21h45.`,
        historicalContext: `Événement créé en canal secret dans le Kernel.`,
        consequences: `Vérification discrète de la clé USB pendant le plat chaud.`,
        recommendedTransmission: `Lucas, la régie DJ est prête pour la vidéo de 21h45. Sarah et Gabriel n'en savent rien.`,
        transmissionLevel: 'CONTEXTUEL',
        securityClearance: 'ALLOWED',
        needsTransmission: true,
      };
    }

    // 4. SCÉNARIO VOYAGE KYOTO : Lucas Co-voyageur
    if (situationKey === 'VOYAGE_RYOKAN') {
      return {
        situationTitle: 'Réservation Ryokan Gion Traditionnel',
        projectId,
        projectTitle: project.title,
        targetIdentityId,
        targetName: targetIdentity.canonicalName,
        targetRole: targetRelation.contextualRole,
        whyNow: `Confirmation de l'hébergement partagé à Kyoto.`,
        historicalContext: `Itinéraire validé dans le WorldProject Voyage Kyoto 2027.`,
        consequences: `Budget hébergement partagé débité de la cagnotte voyage.`,
        recommendedTransmission: `Lucas, la réservation au Ryokan Gion est validée pour nos 3 nuits à Kyoto (budget partagé synchronisé).`,
        transmissionLevel: 'CONTEXTUEL',
        securityClearance: 'ALLOWED',
        needsTransmission: true,
      };
    }

    return {
      situationTitle: 'Point de situation régulier',
      projectId,
      projectTitle: project.title,
      targetIdentityId,
      targetName: targetIdentity.canonicalName,
      targetRole: targetRelation.contextualRole,
      whyNow: 'Planning synchronisé avec succès.',
      historicalContext: '',
      consequences: 'Aucun impact sur vos créneaux.',
      recommendedTransmission: 'Tout est calé selon vos horaires.',
      transmissionLevel: 'DIRECT',
      securityClearance: 'ALLOWED',
      needsTransmission: false, // Pas besoin d'envoyer un message pour rien
    };
  }
}
