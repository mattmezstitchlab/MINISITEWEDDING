import type {
  UniversalIdentity,
  WorldProject,
  ProjectRelation,
  TimelineGraphEvent,
  ExternalConnector,
} from './aimeGraphCore';

/**
 * 1. UTILISATEURS CANONIQUES EXISTANTS (Zéro duplication)
 */

// UTILISATRICE A : Sarah (La Mariée)
export const INITIAL_USER_SARAH: UniversalIdentity = {
  id: 'user-sarah',
  canonicalName: 'Sarah Alvès',
  email: 'sarah.alves@example.com',
  avatar: '/images/couple-paris.jpg',
  isProfessional: false,
  phonePersonal: '+33 6 12 34 56 78',
  bio: 'Architecte d’intérieur, passionnée de scénographie minimale & de musique contemporaine.',
  homeCity: 'Paris',
  countryCode: 'FR',
  createdAt: '2026-01-15',
  settings: {
    notifications: true,
    autoSyncTimeline: true,
    allowDirectProjectInvite: true,
    secretChannelEnabled: false, // Elle ne doit pas voir les secrets de ses témoins !
  },
};

// UTILISATEUR B : Matt Mez (Le Saxophoniste Prestataire)
// Il a son identité globale, son profil pro, ses disponibilités et son rider
export const INITIAL_USER_MATTMEZ: UniversalIdentity = {
  id: 'user-mattmez',
  canonicalName: 'Matt Mez',
  email: 'contact@mattmez-sax.com',
  avatar: '/images/noir-blanc.jpg',
  isProfessional: true,
  phonePersonal: '+33 6 88 99 00 11',
  bio: 'Saxophoniste Live international. Sets Deep House & Acoustique pour réceptions d’exception.',
  homeCity: 'Bordeaux / Paris',
  countryCode: 'FR',
  createdAt: '2025-06-20',
  professionalProfile: {
    trade: 'Saxophoniste Live & Acoustique',
    companyName: 'Mez Production Studio',
    proEmail: 'booking@mattmez-sax.com',
    proPhone: '+33 6 99 88 77 66',
    riderAcoustique: 'Système micro sans fil Shure HF (portée 80m). Retour oreillettes IEM stéréo.',
    tarifBase: '1 800 € net',
    disponibilites: ['2026-10-18 (Confirmé)', '2026-10-24 (Libre)'],
    portfolioMedias: ['/images/noir-blanc.jpg'],
  },
  settings: {
    notifications: true,
    autoSyncTimeline: true,
    allowDirectProjectInvite: true,
    secretChannelEnabled: true,
  },
};

// Autres identités préexistantes
export const INITIAL_USER_GABRIEL: UniversalIdentity = {
  id: 'user-gabriel',
  canonicalName: 'Gabriel Vaneck',
  email: 'gabriel.vaneck@example.com',
  avatar: '/images/chateau.jpg',
  isProfessional: false,
  phonePersonal: '+33 6 22 33 44 55',
  bio: 'Designer mobilier & co-fondateur studio.',
  homeCity: 'Paris',
  countryCode: 'FR',
  createdAt: '2026-01-16',
  settings: {
    notifications: true,
    autoSyncTimeline: true,
    allowDirectProjectInvite: true,
    secretChannelEnabled: false,
  },
};

export const INITIAL_USER_LUCAS_TEMOIN: UniversalIdentity = {
  id: 'user-lucas',
  canonicalName: 'Lucas Bernard (Témoin)',
  email: 'lucas.b@example.com',
  avatar: '/images/noir-blanc.jpg',
  isProfessional: false,
  phonePersonal: '+33 6 55 44 33 22',
  bio: 'Ami d’enfance de Sarah. Responsable du canal secret des témoins.',
  homeCity: 'Lyon',
  countryCode: 'FR',
  createdAt: '2026-02-01',
  settings: {
    notifications: true,
    autoSyncTimeline: true,
    allowDirectProjectInvite: true,
    secretChannelEnabled: true,
  },
};

/**
 * 2. WORLDPROJECT INITIAL : Le Mariage de Sarah & Gabriel
 */
export const INITIAL_MARIAGE_PROJECT: WorldProject = {
  id: 'proj-sarah-gabriel-2026',
  universe: 'MARIAGE',
  title: 'Sarah & Gabriel · Célébration Contemporaine',
  tagline: 'Élégance minérale, acoustique live & dîner sous les tilleuls',
  coverImage: '/images/chateau-tilleuls.jpg',
  ownerId: 'user-sarah',
  date: '2026-10-18',
  locationId: 'loc-chateau-tilleuls',
  locationName: 'Château des Tilleuls',
  locationAddress: 'Route de Valbonne, 06560 Valbonne (Provence)',
  relations: [
    {
      id: 'rel-sarah',
      projectId: 'proj-sarah-gabriel-2026',
      identityId: 'user-sarah',
      roleInProject: 'Mariée (Pilote)',
      roleCategory: 'protagoniste',
      status: 'APPROUVE',
      assignedTimeSlot: 'Journée entière',
      permissions: {
        canViewTimeline: true,
        canEditTimeline: true,
        canViewFinances: true,
        canViewSecretChannel: false, // Canal secret masqué aux mariés
        canContactOtherVendors: true,
        syncBidirectional: true,
      },
      contextualData: {
        assignedZone: 'Suite Principale',
      },
    },
    {
      id: 'rel-gabriel',
      projectId: 'proj-sarah-gabriel-2026',
      identityId: 'user-gabriel',
      roleInProject: 'Marié',
      roleCategory: 'protagoniste',
      status: 'APPROUVE',
      assignedTimeSlot: 'Journée entière',
      permissions: {
        canViewTimeline: true,
        canEditTimeline: true,
        canViewFinances: true,
        canViewSecretChannel: false,
        canContactOtherVendors: true,
        syncBidirectional: true,
      },
      contextualData: {
        assignedZone: 'Pavillon Est',
      },
    },
    {
      id: 'rel-lucas',
      projectId: 'proj-sarah-gabriel-2026',
      identityId: 'user-lucas',
      roleInProject: 'Témoin d’Honneur',
      roleCategory: 'coordinateur',
      status: 'APPROUVE',
      assignedTimeSlot: '16:00 - 04:00',
      permissions: {
        canViewTimeline: true,
        canEditTimeline: false,
        canViewFinances: false, // Devis mariés masqués
        canViewSecretChannel: true, // Accès total au canal secret des animations
        canContactOtherVendors: true,
        syncBidirectional: true,
      },
      contextualData: {
        specialInstructions: 'Coordonner la projection vidéo surprise à 21h45 avec le DJ.',
      },
    },
  ],
  timelineEvents: [
    {
      id: 'evt-1',
      time: '16:00',
      title: 'Cérémonie Laïque sous l’Arche Minérale',
      description: 'Échange solennel des vœux et alliances.',
      location: 'Parc des Tilleuls',
      primaryRoleId: 'officiant',
      accessLevel: 'PUBLIC',
      secretToMaries: false,
      status: 'SYNCHRONISE',
      thumbnail: '/images/brutal.jpg',
    },
    {
      id: 'evt-2',
      time: '17:30',
      title: 'Cocktail Signature & Golden Hour Live',
      description: 'Vins de domaine, bar à cocktails et performance acoustique.',
      location: 'Terrasse Ouest',
      primaryRoleId: 'saxophoniste',
      assignedIdentityId: undefined, // Pas encore attribué avant ajout de Matt Mez !
      accessLevel: 'PUBLIC',
      secretToMaries: false,
      status: 'SYNCHRONISE',
      thumbnail: '/images/noir-blanc.jpg',
    },
    {
      id: 'evt-3',
      time: '20:00',
      title: 'Dîner Gastronomique Éclairé aux Chandelles',
      description: 'Banquet de saison en 4 temps coordonné à la seconde.',
      location: 'Orangerie de Pierre',
      primaryRoleId: 'traiteur',
      accessLevel: 'PROJET',
      secretToMaries: false,
      status: 'SYNCHRONISE',
      thumbnail: '/images/table-noir.jpg',
    },
    {
      id: 'evt-4',
      time: '21:45',
      title: 'Surprise Témoins : Projection & Flashmob',
      description: 'Court-métrage secret préparé pour Sarah & Gabriel.',
      location: 'Orangerie',
      primaryRoleId: 'temoin',
      accessLevel: 'EQUIPE',
      secretToMaries: true, // MASQUÉ AUX MARIÉS DANS LE SYSTÈME IMMUNITAIRE
      status: 'SYNCHRONISE',
      thumbnail: '/images/noir-blanc.jpg',
    },
  ],
};

/**
 * 3. CONNECTEURS INITIAUX
 */
export const INITIAL_CONNECTORS: ExternalConnector[] = [
  {
    id: 'conn-spotify',
    name: 'Spotify & Apple Music',
    type: 'AUDIO',
    icon: '🎵',
    connected: true,
    lastSync: 'Il y a 10 min',
    permissionsScope: ['Lecture playlists mariés', 'Export blacklist vers régie DJ'],
  },
  {
    id: 'conn-stripe',
    name: 'Stripe Direct Pay',
    type: 'PAIEMENT',
    icon: '💳',
    connected: true,
    lastSync: 'En direct',
    permissionsScope: ['Acomptes prestataires scellés', 'Cagnotte mariage sécurisée'],
  },
  {
    id: 'conn-gcal',
    name: 'Google Calendar / Outlook',
    type: 'CALENDRIER',
    icon: '📅',
    connected: false,
    lastSync: 'Non synchronisé',
    permissionsScope: ['Synchro créneaux horaires', 'Blocage automatique agenda'],
  },
  {
    id: 'conn-dmx',
    name: 'Régie DMX & Sound Control',
    type: 'DMX_SON',
    icon: '🎛️',
    connected: false,
    lastSync: 'Prêt pour le Jour J',
    permissionsScope: ['Pilotage de l’ambiance lumineuse', 'Cues de découpe du gâteau'],
  },
];
