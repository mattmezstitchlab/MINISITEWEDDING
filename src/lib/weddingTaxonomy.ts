/**
 * TAXONOMIE GLOBALE & ÉCOSYSTÈME MULTI-DIMENSIONS
 * Contient :
 * 1. La taxonomie exhaustive des rôles et métiers (protagonistes, bouche, musique, image, style, logistique, métiers transverses)
 * 2. Les Destinations & Pays du Monde (codes culturels, rituels spécifiques)
 * 3. Les Connecteurs Système (Spotify, Stripe, Calendly, WhatsApp, Sonos/DMX, iCloud)
 */

export type RoleCategoryType =
  | 'protagonistes'
  | 'reception'
  | 'musique'
  | 'image'
  | 'style'
  | 'logistique'
  | 'transverse';

export interface FullTaxonomyRole {
  id: string;
  category: RoleCategoryType;
  categoryLabel: string;
  title: string;
  badge: string;
  heroImage: string;
  tagline: string;
  description: string;
  defaultTime: string;
  whatCanDo: string[];
  permissionsVisible: string;
  permissionsHidden: string;
  cockpitStats: { label: string; value: string }[];
  defaultSettings: {
    notifications: boolean;
    syncTimeline: boolean;
    secretChannel: boolean;
    autoAlerts: boolean;
  };
}

export interface WorldDestination {
  id: string;
  country: string;
  flag: string;
  region: string;
  image: string;
  tagline: string;
  culturalCodes: string[];
  recommendedAcoustics: string;
  sunsetTiming: string;
}

export interface EcosystemConnector {
  id: string;
  name: string;
  category: 'audio' | 'paiement' | 'synchro' | 'comm';
  icon: string;
  tagline: string;
  features: string[];
  connectedStatus: boolean;
}

// 1. TAXONOMIE EXHAUSTIVE DES RÔLES & MÉTIERS
export const FULL_ROLES_TAXONOMY: FullTaxonomyRole[] = [
  // --- PROTAGONISTES ---
  {
    id: 'maries',
    category: 'protagonistes',
    categoryLabel: 'Protagonistes',
    title: 'Les Mariés',
    badge: 'Cockpit Central',
    heroImage: '/images/couple-paris.jpg',
    tagline: 'Le cockpit central de votre célébration',
    description: 'Posez vos repères sur la journée, scellez vos devis et laissez l’orchestration s’aligner sur vos vœux.',
    defaultTime: '16:00',
    whatCanDo: [
      'Pose les repères officiels sur la timeline',
      'Valide les devis et contrats scellés en 1 clic',
      'Suit en direct les confirmations de présence (RSVP)',
    ],
    permissionsVisible: 'Cockpit 100% : devis, contrats, contacts prestataires, invitations.',
    permissionsHidden: 'Masqué : les surprises & animations secrètes préparées par les témoins.',
    cockpitStats: [
      { label: 'RSVP reçus', value: '84 / 92' },
      { label: 'Équipe calée', value: '100%' },
    ],
    defaultSettings: { notifications: true, syncTimeline: true, secretChannel: false, autoAlerts: true },
  },
  {
    id: 'temoin',
    category: 'protagonistes',
    categoryLabel: 'Protagonistes',
    title: 'Témoins d’Honneur',
    badge: 'Canal Secret',
    heroImage: '/images/mariage-white-editorial.jpg',
    tagline: 'L’espace secret masqué aux mariés',
    description: 'Planifiez vos discours, vidéos projecteur et animations avec le DJ sans que les mariés ne découvrent la surprise.',
    defaultTime: '21:00',
    whatCanDo: [
      'Canal secret 100% invisible pour les mariés',
      'Calage direct des animations avec le DJ et la régie',
      'Coordination du cortège et des alliances',
    ],
    permissionsVisible: 'Timeline complète + canal secret témoins + contact direct DJ.',
    permissionsHidden: 'Masqué : devis financiers et factures des mariés.',
    cockpitStats: [
      { label: 'Surprises calées', value: '3' },
      { label: 'Statut DJ', value: 'Synchronisé' },
    ],
    defaultSettings: { notifications: true, syncTimeline: true, secretChannel: true, autoAlerts: true },
  },
  {
    id: 'officiant',
    category: 'protagonistes',
    categoryLabel: 'Protagonistes',
    title: 'Célébrant / Officiant',
    badge: 'Rituel & Textes',
    heroImage: '/images/mariage-chapelle-brutaliste.jpg',
    tagline: 'Le déroulé solennel de la cérémonie',
    description: 'Partagez le livret de messe, le rituel d’alliances et le minutage de l’entrée avec les mariés et les musiciens.',
    defaultTime: '16:00',
    whatCanDo: [
      'Intègre le texte des vœux et le rituel d’alliances',
      'Minutage précis de l’entrée et de la sortie sous pétales',
      'Partage le livret de cérémonie avec les invités',
    ],
    permissionsVisible: 'Créneau cérémonie + musiques d’entrée + livret de vœux.',
    permissionsHidden: 'Masqué : devis traiteur, logistique de nuit et plans de table.',
    cockpitStats: [
      { label: 'Durée cérémonie', value: '45 min' },
      { label: 'Musiques calées', value: 'Entrée / Alliances / Sortie' },
    ],
    defaultSettings: { notifications: true, syncTimeline: true, secretChannel: false, autoAlerts: false },
  },
  {
    id: 'invites',
    category: 'protagonistes',
    categoryLabel: 'Protagonistes',
    title: 'Invités & Famille',
    badge: 'Émotion & Accès',
    heroImage: '/images/champagne.jpg',
    tagline: 'L’invitation élégante & le déroulé du Jour J',
    description: 'Accédez au plan d’accès, confirmez votre présence, signalez vos allergies et téléchargez vos photos.',
    defaultTime: '17:30',
    whatCanDo: [
      'Confirmation RSVP et régimes alimentaires en 1 clic',
      'Accès au programme public et coordonnées GPS du domaine',
      'Dépôt de photos dans l’album live partagé',
    ],
    permissionsVisible: 'Programme public, mot des mariés, cagnotte et album partagé.',
    permissionsHidden: 'Masqué : fiches techniques, devis prestataires et canal témoins.',
    cockpitStats: [
      { label: 'Présence', value: 'Confirmée' },
      { label: 'Table attribuée', value: 'N° 04 (L’Orangerie)' },
    ],
    defaultSettings: { notifications: true, syncTimeline: false, secretChannel: false, autoAlerts: false },
  },

  // --- RÉCEPTION & BOUCHE ---
  {
    id: 'traiteur',
    category: 'reception',
    categoryLabel: 'Réception & Bouche',
    title: 'Chef Traiteur & Salle',
    badge: 'Conducteur Service',
    heroImage: '/images/table-noir.jpg',
    tagline: 'Le conducteur du banquet à la seconde',
    description: 'Coordonnez l’envoi des plats chauds directement avec le DJ pour ne jamais refroidir une assiette ni couper un discours.',
    defaultTime: '19:30',
    whatCanDo: [
      'Synchronise l’envoi des plats chauds à la seconde avec le DJ',
      'Consulte la liste certifiée des régimes et allergies',
      'Accède au plan de table dynamique et effectifs brigade',
    ],
    permissionsVisible: 'Horaires du dîner + fiches allergènes + contrat traiteur scellé.',
    permissionsHidden: 'Masqué : vœux intimes et surprises secrètes des témoins.',
    cockpitStats: [
      { label: 'Couverts assis', value: '110' },
      { label: 'Régimes spéciaux', value: '8 identifiés' },
    ],
    defaultSettings: { notifications: true, syncTimeline: true, secretChannel: false, autoAlerts: true },
  },
  {
    id: 'mixologue',
    category: 'reception',
    categoryLabel: 'Réception & Bouche',
    title: 'Bar à Cocktails / Mixologue',
    badge: 'Signature Drinks',
    heroImage: '/images/terrasse.jpg',
    tagline: 'Création des élixirs sur-mesure & Ice design',
    description: 'Paramétrez les recettes des cocktails signature des mariés et le stock de glaçons sculptés pour le cocktail.',
    defaultTime: '18:00',
    whatCanDo: [
      'Affiche la carte des 3 cocktails signature approuvés',
      'Gestion des flux glaçons et verres cocktail cristal',
      'Enclenche le cocktail flare et pyrotechnie bar',
    ],
    permissionsVisible: 'Jauge invités cocktail + recettes validées + créneau bar.',
    permissionsHidden: 'Masqué : budget total mariage et musique cérémonie.',
    cockpitStats: [
      { label: 'Cocktails signature', value: '3 créations' },
      { label: 'Stock glaces', value: '120 kg ciselé' },
    ],
    defaultSettings: { notifications: false, syncTimeline: true, secretChannel: false, autoAlerts: false },
  },
  {
    id: 'patissier',
    category: 'reception',
    categoryLabel: 'Réception & Bouche',
    title: 'Cake Designer / Pièce Montée',
    badge: 'Découpe & Éclat',
    heroImage: '/images/danse.jpg',
    tagline: 'L’arrivée théâtrale du gâteau et des fontaines lumineuses',
    description: 'Scellez l’heure précise de sortie de chambre froide et le calage avec la musique d’entrée de gâteau.',
    defaultTime: '23:30',
    whatCanDo: [
      'Alerte frigo et protocole température du gâteau',
      'Top départ découpe coordonné avec le son DJ et fontaines',
      'Fiche découpe brigade pour service express',
    ],
    permissionsVisible: 'Horaire arrivée gâteau + choix musical d’entrée + allergènes.',
    permissionsHidden: 'Masqué : cérémonies et cocktails.',
    cockpitStats: [
      { label: 'Étages', value: '4 (Texture lin brut)' },
      { label: 'Sortie chambre froide', value: '23:15' },
    ],
    defaultSettings: { notifications: true, syncTimeline: true, secretChannel: false, autoAlerts: true },
  },

  // --- MUSIQUE & NUIT ---
  {
    id: 'dj',
    category: 'musique',
    categoryLabel: 'Musique & Live',
    title: 'DJ Résident & Sound Engineer',
    badge: 'Master Nuit',
    heroImage: '/images/mariage-techno-berlinois.jpg',
    tagline: 'La conduite sonore, l’ouverture du bal et le peak time club',
    description: 'Recevez la playlist sacrée des mariés, la liste noire des morceaux bannis et les signaux des témoins pour lancer les micros.',
    defaultTime: '22:30',
    whatCanDo: [
      'Réceptionne les playlists Spotify / Apple Music scellées',
      'Consulte la blacklist stricte des morceaux interdits',
      'Gère les micros HF discours et coordonne l’entrée des plats',
    ],
    permissionsVisible: 'Toute la musique + canal témoins + régie son + timing traiteur.',
    permissionsHidden: 'Masqué : devis des fleuristes et traiteurs.',
    cockpitStats: [
      { label: 'Morceaux clés', value: '12 calés' },
      { label: 'Blacklist', value: '6 bannis' },
    ],
    defaultSettings: { notifications: true, syncTimeline: true, secretChannel: true, autoAlerts: true },
  },
  {
    id: 'saxophoniste',
    category: 'musique',
    categoryLabel: 'Musique & Live',
    title: 'Saxophoniste Live',
    badge: 'Régie Sonore',
    heroImage: '/images/mariage-black-tie-minimaliste.jpg',
    tagline: 'La régie sonore et acoustique du Jour J',
    description: 'Scellez votre heure de balance, testez votre micro HF sans fil et accordez votre set deep house avec le coucher du soleil.',
    defaultTime: '17:30',
    whatCanDo: [
      'Scelle son heure de balance acoustique et test HF',
      'Accorde son set deep house avec le coucher du soleil',
      'Fiche technique son directement intégrée au créneau',
    ],
    permissionsVisible: 'Créneau cocktail/soirée + rider son + contact régisseur.',
    permissionsHidden: 'Masqué : budgets des autres prestataires et menus.',
    cockpitStats: [
      { label: 'Créneau Live', value: '17h30 (Golden Hour)' },
      { label: 'Test HF', value: 'Portée 80m Validée' },
    ],
    defaultSettings: { notifications: true, syncTimeline: true, secretChannel: false, autoAlerts: true },
  },
  {
    id: 'light_designer',
    category: 'musique',
    categoryLabel: 'Musique & Live',
    title: 'Light Designer & FX Lasers',
    badge: 'Mise en Lumière',
    heroImage: '/images/club-strobe-kiss.jpg',
    tagline: 'La scénographie lumineuse DMX & machines à fumée lourde',
    description: 'Programmez les ambiances architecturales du dîner et les stroboscopes synchronisés sur l’ouverture de bal.',
    defaultTime: '22:00',
    whatCanDo: [
      'Pilotage DMX des projecteurs wash et lasers',
      'Déclenchement fumée lourde première danse sur nuage',
      'Gestion de l’extinction progressive des lustres pour le gâteau',
    ],
    permissionsVisible: 'Régie technique + plan d’implantation électrique + cues DJ.',
    permissionsHidden: 'Masqué : listes d’invités personnelles.',
    cockpitStats: [
      { label: 'Projecteurs DMX', value: '24 asservis' },
      { label: 'Fumée lourde', value: 'Prête 23:40' },
    ],
    defaultSettings: { notifications: false, syncTimeline: true, secretChannel: false, autoAlerts: false },
  },

  // --- IMAGE & MÉMOIRE ---
  {
    id: 'photographe',
    category: 'image',
    categoryLabel: 'Image & Mémoire',
    title: 'Photographe Éditorial & 35mm',
    badge: 'Planning Lumière',
    heroImage: '/images/submarine-vows.jpg',
    tagline: 'Chasse à la Golden Hour et portraits argentiques',
    description: 'Suivez le créneau optimal d’ensoleillement et cochez la liste des photos de famille obligatoires.',
    defaultTime: '14:30',
    whatCanDo: [
      'Alerte Golden Hour basée sur l’azimut solaire du domaine',
      'Checklist interactive des 15 photos de famille imposées',
      'Liaison directe avec le coordinateur pour libérer les mariés',
    ],
    permissionsVisible: 'Lieux du domaine + liste famille VIP + horaires dorés.',
    permissionsHidden: 'Masqué : devis financiers et factures traiteur.',
    cockpitStats: [
      { label: 'Golden Hour', value: '19:42 - 20:15' },
      { label: 'Pellicules 35mm', value: '8 rouleaux' },
    ],
    defaultSettings: { notifications: true, syncTimeline: true, secretChannel: false, autoAlerts: true },
  },
  {
    id: 'videaste',
    category: 'image',
    categoryLabel: 'Image & Mémoire',
    title: 'Cinéaste Drone & Rushes 4K',
    badge: 'Film Cinéma',
    heroImage: '/images/desert-pool-vows.jpg',
    tagline: 'Prises de vue aériennes et son direct des vœux',
    description: 'Planifiez vos autorisations de vol drone et enregistrez la prise de son cravate des discours.',
    defaultTime: '15:00',
    whatCanDo: [
      'Vérification météo vent pour survol drone du château',
      'Enregistrement son HF 32-bit float sur les mariés',
      'Remise du teaser vidéo 60s sous 48h',
    ],
    permissionsVisible: 'Accès espaces extérieurs + repérages son cérémonie.',
    permissionsHidden: 'Masqué : plans de table et factures.',
    cockpitStats: [
      { label: 'Batteries drone', value: '6 chargées' },
      { label: 'Micro cravate', value: 'Sync 32-bit' },
    ],
    defaultSettings: { notifications: false, syncTimeline: true, secretChannel: false, autoAlerts: false },
  },

  // --- STYLE & SCÉNOGRAPHIE ---
  {
    id: 'wedding_planner',
    category: 'style',
    categoryLabel: 'Style & Scénographie',
    title: 'Wedding Planner / Régisseur',
    badge: 'Superviseur Général',
    heroImage: '/images/mariage-chateau-contemporain.jpg',
    tagline: 'Le chef d’orchestre invisible de la journée',
    description: 'Supervisez tous les métiers, arbitrez les aléas météo et assurez la fluidité absolue sans stresser les mariés.',
    defaultTime: '08:00',
    whatCanDo: [
      'Contrôle total et ajustement instantané des retards timeline',
      'Activation du Plan B pluie en un glissement de bouton',
      'Communication bidirectionnelle avec tous les prestataires',
    ],
    permissionsVisible: 'Vision absolue 100% : prestataires, devis, timing, invités.',
    permissionsHidden: 'Aucun masque : superviseur en chef.',
    cockpitStats: [
      { label: 'Prestataires connectés', value: '14 / 14' },
      { label: 'Météo Plan A', value: 'Confirmé Soleil' },
    ],
    defaultSettings: { notifications: true, syncTimeline: true, secretChannel: true, autoAlerts: true },
  },
  {
    id: 'fleuriste',
    category: 'style',
    categoryLabel: 'Style & Scénographie',
    title: 'Designer Floral & Végétal',
    badge: 'Scénographie Florale',
    heroImage: '/images/chateau-tilleuls.jpg',
    tagline: 'L’installation de l’arche, des centres de table et du bouquet',
    description: 'Validez l’hydratation des fleurs selon la température et coordonnez le transfert de l’arche vers la table d’honneur.',
    defaultTime: '11:00',
    whatCanDo: [
      'Suivi de livraison fleurs fraîches et protocole fraîcheur',
      'Transfert scénographique des compositions cérémonie vers la salle',
      'Remise solennelle du bouquet de la mariée et boutonnières',
    ],
    permissionsVisible: 'Plans de table + horaires d’accès domaine pour montage.',
    permissionsHidden: 'Masqué : playlist DJ et devis d’autres corps d’état.',
    cockpitStats: [
      { label: 'Tiges montées', value: '1 200' },
      { label: 'Arche installée', value: 'Validée 14:00' },
    ],
    defaultSettings: { notifications: true, syncTimeline: true, secretChannel: false, autoAlerts: false },
  },

  // --- LOGISTIQUE & SÉCURITÉ ---
  {
    id: 'navette_chauffeur',
    category: 'logistique',
    categoryLabel: 'Logistique & Sécurité',
    title: 'Chauffeurs VTC & Navettes Nuit',
    badge: 'Retour Sécurisé',
    heroImage: '/images/train-vows.jpg',
    tagline: 'Rapatriement des invités vers les hôtels partenaires',
    description: 'Suivez les rotations des minibus et évitez toute prise de risque sur la route à la sortie du club.',
    defaultTime: '02:00',
    whatCanDo: [
      'Rotations en boucle toutes les 30 min vers les hébergements',
      'Localisation GPS en direct du van pour les invités',
      'Appel d’urgence régie en cas de passager oublié',
    ],
    permissionsVisible: 'Liste des hébergements + plan d’accès parking navettes.',
    permissionsHidden: 'Masqué : vie privée et contrats.',
    cockpitStats: [
      { label: 'Capacité van', value: '3 vans de 8 places' },
      { label: 'Dernière navette', value: '05:30' },
    ],
    defaultSettings: { notifications: true, syncTimeline: true, secretChannel: false, autoAlerts: true },
  },

  // --- MÉTIERS TRANSVERSES (HORS MARIAGE / MONDE EXTÉRIEUR) ---
  {
    id: 'notaire_juriste',
    category: 'transverse',
    categoryLabel: 'Métiers Transverses',
    title: 'Notaire & Juriste d’État',
    badge: 'Contrat & Régime',
    heroImage: '/images/brutal-bunker-vows.jpg',
    tagline: 'La certification légale du contrat de mariage',
    description: 'Déposez le certificat de séparation de biens ou communauté scellé par acte authentique.',
    defaultTime: '11:00',
    whatCanDo: [
      'Génération du certificat notarié scellé pour la mairie',
      'Conseil sur la clause d’attribution intégrale',
      'Archivage crypté du contrat patrimonial',
    ],
    permissionsVisible: 'Identités légales et attestation d’acte.',
    permissionsHidden: 'Masqué : fête, menus et musique.',
    cockpitStats: [
      { label: 'Régime', value: 'Séparation de biens' },
      { label: 'Certificat', value: 'Déposé Mairie' },
    ],
    defaultSettings: { notifications: false, syncTimeline: false, secretChannel: false, autoAlerts: false },
  },
  {
    id: 'concierge_voyage',
    category: 'transverse',
    categoryLabel: 'Métiers Transverses',
    title: 'Concierge Voyage & Lune de Miel',
    badge: 'Parenthèse Ailleurs',
    heroImage: '/images/submarine-vows.jpg',
    tagline: 'L’envol immédiat le lendemain du mariage',
    description: 'Synchronisez les billets d’avion, check-in express et réservations secrètes pour votre voyage de noces.',
    defaultTime: '12:00',
    whatCanDo: [
      'Surveillance statut des vols et transferts aéroport',
      'Activation du pass coupe-file salon d’embarquement',
      'Fiche itinéraire secrète révélée après la fête',
    ],
    permissionsVisible: 'Passeports, billets d’avion, réservations hôtelières.',
    permissionsHidden: 'Masqué : prestataires du jour J.',
    cockpitStats: [
      { label: 'Destination', value: 'Kyoto / Polynésie' },
      { label: 'Départ', value: 'J+2 09:15' },
    ],
    defaultSettings: { notifications: true, syncTimeline: false, secretChannel: false, autoAlerts: true },
  },
];

// 2. DESTINATIONS & PAYS DU MONDE
export const WORLD_DESTINATIONS: WorldDestination[] = [
  {
    id: 'france-provence',
    country: 'France',
    flag: '🇫🇷',
    region: 'Provence & Luberon',
    image: '/images/chateau-tilleuls.jpg',
    tagline: 'Châteaux de pierre calcaire, lavandes et dîner sous les tilleuls',
    culturalCodes: ['Lenteur méridionale', 'Vins de domaine réputés', 'Pétanque au coucher du soleil'],
    recommendedAcoustics: 'Guitare manouche, voix acoustique, deep house légère',
    sunsetTiming: '21:18 (Juin/Juillet)',
  },
  {
    id: 'italie-toscane',
    country: 'Italie',
    flag: '🇮🇹',
    region: 'Toscane & Lac de Côme',
    image: '/images/table-noir.jpg',
    tagline: 'Villas Renaissance, cyprès centenaires et banquet d’antipasti',
    culturalCodes: ['Grande table infinie', 'Caffè espresso de minuit', 'Pâtes fraîches en live show'],
    recommendedAcoustics: 'Trio cordes classique, mandoline moderne, italo disco',
    sunsetTiming: '20:55',
  },
  {
    id: 'maroc-marrakech',
    country: 'Maroc',
    flag: '🇲🇦',
    region: 'Marrakech & Désert d’Agafay',
    image: '/images/desert-pool-vows.jpg',
    tagline: 'Palais riad aux lanternes, thé à la menthe et fête sous les étoiles',
    culturalCodes: ['Arrivée en Amariya', 'Troupe Gnaoua en transe', 'Feu de camp sous les tentes nomades'],
    recommendedAcoustics: 'Percussions orientales live mixées avec beats électro',
    sunsetTiming: '20:20',
  },
  {
    id: 'japon-kyoto',
    country: 'Japon',
    flag: '🇯🇵',
    region: 'Kyoto & Mont Fuji',
    image: '/images/mariage-white-editorial.jpg',
    tagline: 'Minimalisme zen, jardins moussus et rituel du saké San-san-kudo',
    culturalCodes: ['Purification par l’eau', 'Échange des 3 coupes de saké', 'Esthétique Wabi-Sabi épurée'],
    recommendedAcoustics: 'Koto et flûte Shakuhachi, ambiance ambient néo-classique',
    sunsetTiming: '19:10',
  },
  {
    id: 'usa-californie',
    country: 'États-Unis',
    flag: '🇺🇸',
    region: 'Big Sur & Palm Springs',
    image: '/images/couple-paris.jpg',
    tagline: 'Falaises océaniques, architecture moderniste et golden hour sauvage',
    culturalCodes: ['Cocktails mezcal fumé', 'First look intimiste à l’aube', 'Robe de mariée haute couture fluide'],
    recommendedAcoustics: 'Indie folk californien, saxophone live coucher de soleil',
    sunsetTiming: '20:05',
  },
];

// 3. CONNECTEURS SYSTÈME & INTÉGRATIONS
export const ECOSYSTEM_CONNECTORS: EcosystemConnector[] = [
  {
    id: 'spotify',
    name: 'Spotify & Apple Music',
    category: 'audio',
    icon: '🎵',
    tagline: 'Synchronisation instantanée des playlists et de la blacklist',
    features: ['Import direct des playlists mariés', 'Blacklist automatique des morceaux exclus', 'Synchronisation avec le contrôleur du DJ'],
    connectedStatus: true,
  },
  {
    id: 'stripe',
    name: 'Stripe Direct Pay',
    category: 'paiement',
    icon: '💳',
    tagline: 'Cagnotte des mariés & acomptes prestataires scellés',
    features: ['Virements instantanés SEPA / CB', 'Zéro commission cachée sur la cagnotte', 'Acomptes scellés débloqués sur validation'],
    connectedStatus: true,
  },
  {
    id: 'dmx_sonos',
    name: 'Régie DMX & Sound Control',
    category: 'audio',
    icon: '🎛️',
    tagline: 'Pilotage des lumières de salle et enceintes multi-zones',
    features: ['Tamisé automatique des lustres pour le gâteau', 'Volume sonore limité aux normes préfectorales', 'Déclencheur pyrotechnie sans fil'],
    connectedStatus: false,
  },
  {
    id: 'whatsapp_sms',
    name: 'WhatsApp & SMS Flash',
    category: 'comm',
    icon: '💬',
    tagline: 'Alertes discrètes prestataires & messages clés aux invités',
    features: ['Alerte navette retour de nuit par SMS', 'Canal régie discret sans notification sonore', 'Envoi du lien d’accès GPS automatique'],
    connectedStatus: true,
  },
  {
    id: 'icloud_drive',
    name: 'iCloud & Drive Cloud Storage',
    category: 'synchro',
    icon: '☁️',
    tagline: 'Stockage des rushes 4K, photos brutes et contrats légaux',
    features: ['Upload automatique des photos invités en direct', 'Coffre-fort chiffré des contrats de mariage', 'Exportation 1-clic pour le labo photo'],
    connectedStatus: true,
  },
];

// --- COMPATIBILITÉ RÉTROACTIVE POUR LE STUDIO & LA TIMELINE ---
export type WeddingTaxonomyRole = string;

export interface TaxonomyEntity {
  id: string;
  label: string;
  category: string;
  colorTag: string;
  thumbnail: string;
  defaultMomentTime: string;
  badgeAction: string;
}

export const WEDDING_TAXONOMY: Record<string, TaxonomyEntity> = FULL_ROLES_TAXONOMY.reduce((acc, role) => {
  acc[role.id] = {
    id: role.id,
    label: role.title,
    category: role.category,
    colorTag: '#0B0C12',
    thumbnail: role.heroImage,
    defaultMomentTime: role.defaultTime,
    badgeAction: role.badge,
  };
  return acc;
}, {} as Record<string, TaxonomyEntity>);

export function findTaxonomyRole(text: string): TaxonomyEntity {
  const t = text.toLowerCase();
  for (const role of FULL_ROLES_TAXONOMY) {
    if (t.includes(role.id) || t.includes(role.title.toLowerCase())) {
      return {
        id: role.id,
        label: role.title,
        category: role.category,
        colorTag: '#0B0C12',
        thumbnail: role.heroImage,
        defaultMomentTime: role.defaultTime,
        badgeAction: role.badge,
      };
    }
  }
  return {
    id: 'maries',
    label: 'Les Mariés',
    category: 'protagonistes',
    colorTag: '#0B0C12',
    thumbnail: '/images/couple-paris.jpg',
    defaultMomentTime: '16:00',
    badgeAction: 'Cockpit Central',
  };
}
