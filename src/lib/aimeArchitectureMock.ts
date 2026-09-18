import type {
  UniversalIdentity,
  WorldProject,
  ContextualRelation,
  TimelineGraphNode,
  ProposalItem,
  CascadeImpact,
} from './aimeArchitectureCore';

/**
 * 1. IDENTITÉS CANONIQUES UNIQUES (Zéro duplication)
 */

// Sarah (Propriétaire de plusieurs projets : Mariage 2026, Voyage Japon 2027)
export const CANONICAL_SARAH: UniversalIdentity = {
  id: 'usr-sarah',
  canonicalName: 'Sarah Alvès',
  email: 'sarah.alves@example.com',
  avatar: '/images/couple-paris.jpg',
  bio: 'Architecte d’intérieur, passionnée de scénographie minimale & de musique contemporaine.',
  homeCity: 'Paris',
  country: 'France',
  createdAt: '2026-01-15',
  activeUniverses: ['MARIAGE', 'VOYAGE', 'PASSION'],
  settings: {
    notifications: true,
    autoSyncTimeline: true,
    allowDirectProjectInvite: true,
    secretChannelIsolation: true,
  },
};

// Matt Mez (Présent dans : Profession, Musique, Mariage Sarah comme Saxo, Festival comme Artiste)
export const CANONICAL_MATTMEZ: UniversalIdentity = {
  id: 'usr-mattmez',
  canonicalName: 'Matt Mez',
  email: 'contact@mattmez-sax.com',
  avatar: '/images/mariage-black-tie-minimaliste.jpg',
  bio: 'Saxophoniste Live international. Sets Deep House & Acoustique pour réceptions d’exception.',
  homeCity: 'Bordeaux / Paris',
  country: 'France',
  createdAt: '2025-06-20',
  activeUniverses: ['PROFESSION', 'PASSION', 'MARIAGE', 'EVENEMENT'],
  professionalProfile: {
    trade: 'Saxophoniste Live & Acoustique',
    companyName: 'Mez Production Studio',
    proEmail: 'booking@mattmez-sax.com',
    proPhone: '+33 6 99 88 77 66',
    riderAcoustique: 'Système micro sans fil Shure HF (portée 80m). Retour oreillettes IEM stéréo.',
    tarifBase: '1 800 € net',
    portfolioMedias: ['/images/mariage-black-tie-minimaliste.jpg'],
  },
  settings: {
    notifications: true,
    autoSyncTimeline: true,
    allowDirectProjectInvite: true,
    secretChannelIsolation: true,
  },
};

// Lucas (Témoin dans le mariage de Sarah, mais Co-voyageur dans son Voyage au Japon !)
export const CANONICAL_LUCAS: UniversalIdentity = {
  id: 'usr-lucas',
  canonicalName: 'Lucas Bernard',
  email: 'lucas.b@example.com',
  avatar: '/images/mariage-white-editorial.jpg',
  bio: 'Ami proche d’enfance, photographe voyage & passionné de design.',
  homeCity: 'Lyon',
  country: 'France',
  createdAt: '2026-02-01',
  activeUniverses: ['MARIAGE', 'VOYAGE', 'FAMILLE'],
  settings: {
    notifications: true,
    autoSyncTimeline: true,
    allowDirectProjectInvite: true,
    secretChannelIsolation: true,
  },
};

/**
 * 2. WORLDPROJECT 1 : Le Mariage (Univers MARIAGE)
 */
export const PROJECT_MARIAGE_SARAH: WorldProject = {
  id: 'prj-mariage-sarah-2026',
  universe: 'MARIAGE',
  title: 'Sarah & Gabriel · Célébration Contemporaine',
  tagline: 'Élégance minérale, acoustique live & dîner sous les tilleuls',
  coverImage: '/images/chateau-tilleuls.jpg',
  ownerIdentityId: 'usr-sarah',
  date: '2026-10-18',
  locationName: 'Château des Tilleuls',
  locationAddress: 'Route de Valbonne, 06560 Valbonne',
  city: 'Valbonne',
  country: 'France',
  relations: [
    {
      id: 'rel-mariage-sarah',
      projectId: 'prj-mariage-sarah-2026',
      projectUniverse: 'MARIAGE',
      projectTitle: 'Mariage Sarah & Gabriel',
      identityId: 'usr-sarah',
      identityName: 'Sarah Alvès',
      identityAvatar: '/images/couple-paris.jpg',
      contextualRole: 'Mariée & Propriétaire',
      roleCategory: 'organisateur',
      permissions: {
        readTimeline: true,
        writeTimeline: true,
        readFinances: true,
        readSecretChannel: false, // Canal secret des témoins masqué aux mariés
        proposeChanges: true,
        syncBidirectional: true,
      },
      sharedDataKeys: ['Programme public', 'Lieu', 'Contacts prestataires', 'Menus'],
      restrictedDataKeys: ['Surprises & discours des témoins'],
      status: 'ACTIF',
      connectedSince: '2026-01-20',
    },
    {
      id: 'rel-mariage-mattmez',
      projectId: 'prj-mariage-sarah-2026',
      projectUniverse: 'MARIAGE',
      projectTitle: 'Mariage Sarah & Gabriel',
      identityId: 'usr-mattmez',
      identityName: 'Matt Mez',
      identityAvatar: '/images/mariage-black-tie-minimaliste.jpg',
      contextualRole: 'Saxophoniste Live (Sunset Cocktail)',
      roleCategory: 'prestataire',
      permissions: {
        readTimeline: true,
        writeTimeline: false, // Ne peut pas déplacer la messe
        readFinances: false, // Devis globaux masqués
        readSecretChannel: false,
        proposeChanges: true, // Peut proposer un ajustement d'horaire ou de balance
        syncBidirectional: true,
      },
      sharedDataKeys: ['Rider Son', 'Créneau 17:30', 'Lieu Cocktail', 'Contact DJ'],
      restrictedDataKeys: ['Budget total mariage', 'Notes intimes', 'Canal témoins'],
      status: 'ACTIF',
      connectedSince: '2026-03-12',
    },
    {
      id: 'rel-mariage-lucas',
      projectId: 'prj-mariage-sarah-2026',
      projectUniverse: 'MARIAGE',
      projectTitle: 'Mariage Sarah & Gabriel',
      identityId: 'usr-lucas',
      identityName: 'Lucas Bernard',
      identityAvatar: '/images/mariage-white-editorial.jpg',
      contextualRole: 'Témoin d’Honneur & Maître des Surprises',
      roleCategory: 'invite',
      permissions: {
        readTimeline: true,
        writeTimeline: false,
        readFinances: false,
        readSecretChannel: true, // Accès secret exclusif
        proposeChanges: true,
        syncBidirectional: true,
      },
      sharedDataKeys: ['Programme complet', 'Canal secret', 'Contact DJ pour projection'],
      restrictedDataKeys: ['Devis financiers des mariés'],
      status: 'ACTIF',
      connectedSince: '2026-02-05',
    },
  ],
  timelineNodes: [
    {
      id: 'node-1',
      time: '16:00',
      title: 'Cérémonie Laïque sous l’Arche Minérale',
      locationName: 'Parc des Tilleuls',
      projectId: 'prj-mariage-sarah-2026',
      accessLevel: 'PUBLIC',
      secretToOwners: false,
      dataSourceKey: 'prj-mariage-sarah-2026.ceremonie',
      syncState: 'EN_DIRECT',
    },
    {
      id: 'node-2',
      time: '17:30',
      title: 'Performance Acoustique & Sunset Live',
      locationName: 'Terrasse Ouest (Belvédère)',
      projectId: 'prj-mariage-sarah-2026',
      primaryRelationId: 'rel-mariage-mattmez',
      assignedIdentityId: 'usr-mattmez',
      assignedIdentityName: 'Matt Mez',
      accessLevel: 'PUBLIC',
      secretToOwners: false,
      dataSourceKey: 'usr-mattmez.riderAcoustique',
      syncState: 'EN_DIRECT',
    },
    {
      id: 'node-3',
      time: '20:00',
      title: 'Banquet Gastronomique Éclairé aux Chandelles',
      locationName: 'Orangerie de Pierre',
      projectId: 'prj-mariage-sarah-2026',
      accessLevel: 'PARTAGE',
      secretToOwners: false,
      dataSourceKey: 'prj-mariage-sarah-2026.diner',
      syncState: 'EN_DIRECT',
    },
    {
      id: 'node-4',
      time: '21:45',
      title: 'Projection Vidéo Secrète & Flashmob Témoins',
      locationName: 'Orangerie',
      projectId: 'prj-mariage-sarah-2026',
      primaryRelationId: 'rel-mariage-lucas',
      assignedIdentityId: 'usr-lucas',
      assignedIdentityName: 'Lucas Bernard',
      accessLevel: 'SECRET', // SYSTÈME IMMUNITAIRE : MASQUÉ AUX MARIÉS
      secretToOwners: true,
      dataSourceKey: 'rel-mariage-lucas.secretVideo',
      syncState: 'EN_DIRECT',
    },
  ],
  pendingProposals: [
    {
      id: 'prop-matt-arrival',
      projectId: 'prj-mariage-sarah-2026',
      authorIdentityId: 'usr-mattmez',
      authorName: 'Matt Mez',
      authorAvatar: '/images/mariage-black-tie-minimaliste.jpg',
      targetFieldKey: 'timelineNodes.node-2.time',
      targetFieldLabel: 'Heure de balance acoustique & arrivée',
      oldValue: '17:30 (Live direct)',
      proposedValue: '16:45 (Balance 45 min avant cocktail)',
      impactSummary: 'Permet un check HF silencieux avant que les invités n’arrivent sur la terrasse.',
      status: 'PROPOSE',
      createdAt: '2026-09-18 10:14',
    },
  ],
};

/**
 * 3. WORLDPROJECT 2 : Le Voyage au Japon (Univers VOYAGE)
 * Démontre la réutilisation pure des identités SANS aucune duplication !
 */
export const PROJECT_VOYAGE_JAPON: WorldProject = {
  id: 'prj-voyage-kyoto-2027',
  universe: 'VOYAGE',
  title: 'Immersion Kyoto & Mont Fuji 2027',
  tagline: 'Jardins zen moussus, rituel du thé, architecture wabi-sabi',
  coverImage: '/images/mariage-white-editorial.jpg',
  ownerIdentityId: 'usr-sarah',
  date: '2027-04-12',
  locationName: 'Ryokan Gion & Mont Fuji',
  locationAddress: 'Higashiyama-ku, Kyoto 605-0074',
  city: 'Kyoto',
  country: 'Japon',
  relations: [
    {
      id: 'rel-voyage-sarah',
      projectId: 'prj-voyage-kyoto-2027',
      projectUniverse: 'VOYAGE',
      projectTitle: 'Immersion Kyoto 2027',
      identityId: 'usr-sarah',
      identityName: 'Sarah Alvès',
      identityAvatar: '/images/couple-paris.jpg',
      contextualRole: 'Organisatrice de l’Expédition',
      roleCategory: 'organisateur',
      permissions: {
        readTimeline: true,
        writeTimeline: true,
        readFinances: true,
        readSecretChannel: true,
        proposeChanges: true,
        syncBidirectional: true,
      },
      sharedDataKeys: ['Billets d’avion', 'Itinéraire temples', 'Réservations Ryokan'],
      restrictedDataKeys: [],
      status: 'ACTIF',
      connectedSince: '2026-11-02',
    },
    {
      id: 'rel-voyage-lucas',
      projectId: 'prj-voyage-kyoto-2027',
      projectUniverse: 'VOYAGE',
      projectTitle: 'Immersion Kyoto 2027',
      identityId: 'usr-lucas', // MÊME IDENTITÉ CANONIQUE QUE LE TÉMOIN DU MARIAGE !
      identityName: 'Lucas Bernard',
      identityAvatar: '/images/mariage-white-editorial.jpg',
      contextualRole: 'Co-voyageur & Reporter Photo', // Rôle complètement différent !
      roleCategory: 'collaborateur',
      permissions: {
        readTimeline: true,
        writeTimeline: true,
        readFinances: true, // Ici le budget voyage est partagé !
        readSecretChannel: true,
        proposeChanges: true,
        syncBidirectional: true,
      },
      sharedDataKeys: ['Itinéraire', 'Plan de vol', 'Budget partagé'],
      restrictedDataKeys: [],
      status: 'ACTIF',
      connectedSince: '2026-11-04',
    },
  ],
  timelineNodes: [
    {
      id: 'node-kyoto-1',
      time: '09:00',
      title: 'Méditation & Marche dans la Bambouseraie d’Arashiyama',
      locationName: 'Kyoto Ouest',
      projectId: 'prj-voyage-kyoto-2027',
      accessLevel: 'PUBLIC',
      secretToOwners: false,
      dataSourceKey: 'prj-voyage-kyoto-2027.arashiyama',
      syncState: 'EN_DIRECT',
    },
    {
      id: 'node-kyoto-2',
      time: '14:30',
      title: 'Session Photo Argentique & Cérémonie du Thé Uji',
      locationName: 'Maison de thé Uji',
      projectId: 'prj-voyage-kyoto-2027',
      primaryRelationId: 'rel-voyage-lucas',
      assignedIdentityId: 'usr-lucas',
      assignedIdentityName: 'Lucas Bernard',
      accessLevel: 'PARTAGE',
      secretToOwners: false,
      dataSourceKey: 'usr-lucas.photoPlan',
      syncState: 'EN_DIRECT',
    },
  ],
  pendingProposals: [],
};

/**
 * 4. CASCADE D'IMPACTS PRÉ-CALCULÉE LORS DU CHANGEMENT DE LIEU DU MARIAGE
 */
export const MOCK_CASCADE_IMPACTS: CascadeImpact[] = [
  {
    id: 'casc-1',
    label: 'Adresse & Localisation GPS',
    targetEntity: 'Fiche Pratique & Carte Invités',
    affectedIdentityName: 'Invités & Famille (92 personnes)',
    reason: 'Nouvelle adresse géographique nécessite la mise à jour des trajets Waze/Google Maps.',
    impactLevel: 'MAJEUR',
    proposedAction: 'Remplacer l’URL GPS dans le mini-site invité',
  },
  {
    id: 'casc-2',
    label: 'Créneau & Temps de Trajet Traiteur',
    targetEntity: 'Conducteur de Cuisine & Brigade',
    affectedIdentityName: 'Chef Traiteur & Salle',
    reason: 'Le nouvel office traiteur dispose d’une puissance électrique différente (32A au lieu de 63A).',
    impactLevel: 'CRITIQUE',
    proposedAction: 'Alerter le régisseur traiteur pour recalculer les départs de camion réfrigéré',
  },
  {
    id: 'casc-3',
    label: 'Emplacement Acoustique & Rider Saxo',
    targetEntity: 'Set Live 17h30',
    affectedIdentityName: 'Matt Mez',
    reason: 'La nouvelle terrasse est orientée plein Sud au lieu d’Ouest : la réverbération acoustique change.',
    impactLevel: 'MINEUR',
    proposedAction: 'Proposer à Matt Mez un nouveau point de balance acoustique sur le Belvédère',
  },
  {
    id: 'casc-4',
    label: 'Rotations des Navettes Hôtels',
    targetEntity: 'Logistique Retours Nuit',
    affectedIdentityName: 'Chauffeurs VTC & Navettes',
    reason: 'Distance accrue de 7 km par rapport aux hôtels partenaires de Valbonne.',
    impactLevel: 'MAJEUR',
    proposedAction: 'Ajuster les rotations minibus toutes les 45 min au lieu de 30 min',
  },
  {
    id: 'casc-5',
    label: 'Heure de Coucher de Soleil (Golden Hour)',
    targetEntity: 'Shooting Couple 35mm',
    affectedIdentityName: 'Photographe Éditorial',
    reason: 'Dégagement sur l’horizon modifié par les collines environnantes.',
    impactLevel: 'MINEUR',
    proposedAction: 'Recaler le créneau photo à 19h30 au lieu de 19h45',
  },
];
