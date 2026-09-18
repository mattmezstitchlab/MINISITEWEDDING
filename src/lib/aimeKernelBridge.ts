/**
 * AIME UNIVERSAL KERNEL BRIDGE (PASSE 5 - LE GRAND RACCORDEMENT)
 * 
 * Cette passerelle unifie les deux mondes :
 * 1. Ancien format `PublicSiteData` (utilisé par l'Éditeur et les sections du mini-site).
 * 2. Source de Vérité Canonique du Kernel AIME (`aime_world_projects`, `aime_identities`, `aime_contextual_relations`, `aime_timeline_nodes`).
 * 
 * RÈGLE D'OR :
 * Le mini-site mariage n'est PLUS une base de données séparée.
 * C'est une PROJECTION du WorldProject "prj-mariage-sarah-2026" sur le Kernel AIME.
 */

import type { PublicSiteData, ProgrammeEvent, RsvpResponse } from './types';
import { AimeKernelService } from './aimeKernelService';

export class AimeKernelBridge {
  private static readonly MARIAGE_PROJECT_ID = 'prj-mariage-sarah-2026';

  /**
   * CANONICAL LOCK : Écriture depuis l'éditeur vers le WorldProject Kernel
   * Empêche toute divergence entre l'Éditeur et le Kernel AIME.
   */
  public static updateWorldProjectFromEditor(patch: {
    venue?: string;
    city?: string;
    wedding_date?: string;
    tagline?: string;
    coverImage?: string;
  }): void {
    const project = AimeKernelService.getProject(this.MARIAGE_PROJECT_ID);
    if (!project) return;

    if (patch.venue) project.locationName = patch.venue;
    if (patch.city) project.city = patch.city;
    if (patch.wedding_date) project.date = patch.wedding_date;
    if (patch.tagline) project.tagline = patch.tagline;
    if (patch.coverImage) project.coverImage = patch.coverImage;

    // Enregistrement persistant immédiat dans le Kernel
    AimeKernelService.saveDirectStore();
  }

  /**
   * PROJECTION UNIFIÉE :
   * Génère le `PublicSiteData` directement depuis le WorldProject et ses relations dans le Kernel.
   */
  public static projectWorldProjectToSiteData(baseSiteData: PublicSiteData): PublicSiteData {
    const project = AimeKernelService.getProject(this.MARIAGE_PROJECT_ID);
    if (!project) return baseSiteData;

    const owner = AimeKernelService.getIdentity(project.ownerIdentityId);
    const relations = AimeKernelService.getProjectRelations(this.MARIAGE_PROJECT_ID);

    // 1. Projection de l'identité et du lieu canonique
    const projectedSite = {
      ...baseSiteData.site,
      partner1: owner ? owner.canonicalName.split(' ')[0] : baseSiteData.site.partner1,
      partner2: 'Gabriel',
      wedding_date: project.date,
      venue: project.locationName,
      city: project.city,
      hero_title: `${owner ? owner.canonicalName.split(' ')[0] : 'Sarah'} & Gabriel`,
      hero_subtitle: project.tagline,
      hero_photo: project.coverImage,
    };

    // 2. Projection de la Timeline (Système Nerveux) -> Programme du mini-site
    const projectedProgramme: ProgrammeEvent[] = project.timelineNodes
      .filter((node) => node.accessLevel === 'PUBLIC' || node.accessLevel === 'PARTAGE') // Filtrage immunitaire
      .map((node, index) => {
        let desc = node.locationName ? `Lieu : ${node.locationName}` : '';
        if (node.assignedIdentityName) {
          desc += ` · Orchestré par ${node.assignedIdentityName}`;
        }

        return {
          id: index + 1,
          site_id: baseSiteData.site.id,
          event_time: node.time,
          title: node.title,
          description: desc,
          place: node.locationName,
          icon: node.title.toLowerCase().includes('cocktail') ? 'glass' : 'clock',
          position: index,
        };
      });

    return {
      ...baseSiteData,
      site: projectedSite,
      programme: projectedProgramme.length > 0 ? projectedProgramme : baseSiteData.programme,
    };
  }

  /**
   * RACCORDEMENT DU RSVP -> ContextualRelation
   * Lorsqu'un invité soumet son RSVP sur le site public,
   * le système recherche son identité ou crée une relation contextuelle rattachée au WorldProject.
   */
  public static recordRsvpToKernel(response: {
    firstName: string;
    lastName: string;
    email: string;
    attending: boolean;
    allergies?: string;
  }): void {
    const fullName = `${response.firstName} ${response.lastName}`.trim();
    const allIdentities = AimeKernelService.getAllIdentities();
    
    // 1. Recherche si l'identité canonique existe déjà par email (Zéro duplication)
    let identity = allIdentities.find((i) => i.email.toLowerCase() === response.email.toLowerCase());

    if (!identity) {
      // Si inexistante : on enregistre l'identité canonique unique
      const newId = `usr-${response.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      identity = AimeKernelService.updateCanonicalIdentity(newId, {
        id: newId,
        canonicalName: fullName,
        email: response.email,
        avatar: '/images/champagne.jpg',
        bio: `Invité au mariage · Allergies : ${response.allergies || 'Aucune'}`,
        homeCity: 'France',
        country: 'France',
        createdAt: new Date().toISOString(),
        activeUniverses: ['MARIAGE'],
        settings: {
          notifications: true,
          autoSyncTimeline: false,
          allowDirectProjectInvite: true,
          secretChannelIsolation: true,
        },
      });
    }

    // 2. Création ou mise à jour de la relation contextuelle dans le WorldProject
    AimeKernelService.createRelation(
      this.MARIAGE_PROJECT_ID,
      identity.id,
      response.attending ? 'Invité Confirmé (RSVP Oui)' : 'Invité Décliné (RSVP Non)',
      'invite',
      identity.id
    );
  }

  /**
   * TEST AUTOMATISÉ : CANONICAL DATA CONSISTENCY CHECK
   * Vérifie l'absence absolue de duplications et la cohérence des références.
   */
  public static runCanonicalConsistencyCheck(): {
    passed: boolean;
    errors: string[];
    warnings: string[];
    stats: {
      identitiesCount: number;
      projectsCount: number;
      relationsCount: number;
      timelineNodesCount: number;
    };
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    const identities = AimeKernelService.getAllIdentities();
    const projects = AimeKernelService.getAllProjects();

    // 1. Vérification unicité des identités
    const idSet = new Set<string>();
    const emailSet = new Set<string>();
    identities.forEach((usr) => {
      if (idSet.has(usr.id)) {
        errors.push(`Identité dupliquée détectée : ID ${usr.id}`);
      }
      idSet.add(usr.id);

      if (emailSet.has(usr.email.toLowerCase())) {
        errors.push(`Email dupliqué pour plusieurs identités : ${usr.email}`);
      }
      emailSet.add(usr.email.toLowerCase());
    });

    // 2. Vérification des relations
    let totalRelations = 0;
    let totalNodes = 0;

    projects.forEach((prj) => {
      const relSet = new Set<string>();
      prj.relations.forEach((rel) => {
        totalRelations++;
        // Clé étrangère valide
        if (!idSet.has(rel.identityId)) {
          errors.push(`Relation orpheline : identityId ${rel.identityId} introuvable dans les identités`);
        }
        // Unicité par projet
        if (relSet.has(rel.identityId)) {
          errors.push(`Double relation interdite : ${rel.identityName} liée deux fois au projet ${prj.id}`);
        }
        relSet.add(rel.identityId);
      });

      // 3. Vérification des Timeline Nodes
      prj.timelineNodes.forEach((node) => {
        totalNodes++;
        if (node.assignedIdentityId && !idSet.has(node.assignedIdentityId)) {
          errors.push(`Nœud timeline orphelin : assigné à une identité inconnue ${node.assignedIdentityId}`);
        }
      });
    });

    return {
      passed: errors.length === 0,
      errors,
      warnings,
      stats: {
        identitiesCount: identities.length,
        projectsCount: projects.length,
        relationsCount: totalRelations,
        timelineNodesCount: totalNodes,
      },
    };
  }
}
