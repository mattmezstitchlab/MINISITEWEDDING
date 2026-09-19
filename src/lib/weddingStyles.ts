export interface HumanMissionRequirement {
  role: string;
  mission: string;
  essentialSkill: string;
}

export interface WeddingStyle {
  id: string;
  name: string;
  tagline: string;
  category?: 'minimal' | 'nature' | 'urbain' | 'concept' | 'sauvage' | 'classique';
  ink: string;
  muted: string;
  accent: string;
  dark: boolean;
  image: string;
  /** Dégradé neutre de secours */
  aura: [string, string, string];
  manifesto?: string;
  synopsis?: string;
  /** Besoins humains et prestataires concrets pour rendre ce mariage possible */
  humanMissions: HumanMissionRequirement[];
  /** Suggestions d'univers complémentaires ou connexes */
  complementaryStyleIds: string[];
  /** Outil ou fiche prestataire synchronisée */
  vendorToolkit: {
    title: string;
    description: string;
    badge: string;
  };
}

export interface ThemeCategory {
  id: string;
  label: string;
  description: string;
}

export const THEME_CATEGORIES: ThemeCategory[] = [
  { id: 'all', label: 'Tous les univers & missions', description: 'Explorez tous les styles et leurs équipes humaines' },
  { id: 'imprevu', label: '⚡ Last Minute & Plan B', description: 'Mariages spontanés, alertes secours et plans B héroïques' },
  { id: 'divorce', label: '🖤 Fête de Divorce & Renaissance', description: 'Dé-mariage joyeux, grand feu de joie et banquet de libération' },
  { id: 'minimal', label: 'Minimal & Haute Couture', description: 'Noir & blanc, géométrie pure et élégance spatiale' },
  { id: 'nature', label: 'Grands Domaines & Végétal', description: 'Châteaux revisités, forêts sacrées et banquets sous les arbres' },
  { id: 'urbain', label: 'Nocturne & Fête 02h17', description: 'Rooftops, clubs secrets, néons et sound system' },
  { id: 'concept', label: 'Radical & Insolite', description: 'Bunkers de béton, supermarché 22h, motel désert et fanzines' },
  { id: 'sauvage', label: 'Sauvage & Éphémère', description: 'Falaises bretonnes, feux d’asado en clairière, road-trip motel' },
  { id: 'classique', label: 'Traditionnel & Famille', description: 'Église, banquet, orchestre : le classique exécuté à la perfection' },
];

export const WEDDING_STYLES: WeddingStyle[] = [
  {
    id: 'noir-blanc',
    name: 'Black & White',
    tagline: 'Haute couture. Pureté absolue.',
    category: 'minimal',
    manifesto: 'L’élégance ultime en noir et blanc. Typographie serif acérée, contrastes purs, mise en page magazine sans artifice.',
    synopsis: 'Esthétique éditoriale à la Vogue. Noir profond, blanc pur, aucune couleur superflue. La lumière et vos photos font toute la scénographie.',
    ink: '#111111',
    muted: '#777777',
    accent: '#111111',
    dark: false,
    image: '/images/noir-blanc.jpg',
    aura: ['#FFFFFF', '#EAEAEA', '#CCCCCC'],
    humanMissions: [
      { role: 'Photographe Mode / Studio', mission: 'Portraits posés noir & blanc grand format, lumière flash parapluie', essentialSkill: 'Mise en scène éditoriale' },
      { role: 'Créateur / Tailoring Couture', mission: 'Smoking architectural et robe graphique sans dentelle', essentialSkill: 'Coupe haute précision' },
      { role: 'Scénographe Minimaliste', mission: 'Architecture de table monochrome, chandeliers laqués noirs', essentialSkill: 'Zéro parasite visuel' },
    ],
    complementaryStyleIds: ['brutal', 'cinema', 'chateau-moderne'],
    vendorToolkit: {
      title: 'Studio Portrait & Lookbook VIP',
      description: 'Collecte instantanée des portraits noir & blanc des invités avec galerie presse privée.',
      badge: 'Direction Éditoriale',
    },
  },
  {
    id: 'chateau-moderne',
    name: 'Château Moderne',
    tagline: 'Pierre de taille. Esprit français.',
    category: 'nature',
    manifesto: 'Le romantisme des grands domaines revisité avec la clarté du design contemporain. Dorures feutrées et pierre blonde.',
    synopsis: 'Élégance intemporelle. Allées bordées d’arbres, champagne à la coupe, cour pavée et typographie impériale sublimée de verre poli.',
    ink: '#1F1E1B',
    muted: '#8C857B',
    accent: '#C5A059',
    dark: false,
    image: '/images/chateau.jpg',
    aura: ['#F7F4EE', '#ECE5D8', '#DDD2BF'],
    humanMissions: [
      { role: 'Traiteur Haute Gastronomie', mission: 'Menu gastronomique à l’assiette et accords mets-vins de terroir', essentialSkill: 'Service au guéridon' },
      { role: 'Régisseur Général du Domaine', mission: 'Gestion des flux cour pavée, tentes stretch et logistique navettes', essentialSkill: 'Coordination domaine historique' },
      { role: 'Artisan Fleuriste Classique Revisité', mission: 'Compositions vaporeuses, feuillages nobles et vases d’albâtre', essentialSkill: 'Respect de la pierre blonde' },
    ],
    complementaryStyleIds: ['garden-party', 'noir-blanc', 'minimalist-warm'],
    vendorToolkit: {
      title: 'Gestionnaire de Domaine & Dégustation',
      description: 'Accords mets-vins interactifs et plan de table dynamique multi-salons.',
      badge: 'Haute Logistique',
    },
  },
  {
    id: 'brutal',
    name: 'Béton Brut',
    tagline: 'Anti-château. Chapelle de béton.',
    category: 'concept',
    manifesto: 'Pas de fleurs. De la lumière qui coupe le béton. Un oui dans un bunker berlinois ou une architecture brute.',
    synopsis: 'Mariage brutaliste : béton banché, lumière zénithale, une seule tige blanche. Le luxe c’est le vide. Très Berlin, très fashion, zéro pivoine.',
    ink: '#F5F5F0',
    muted: '#A8A8A3',
    accent: '#FF4D00',
    dark: true,
    image: '/images/brutal.jpg',
    aura: ['#2A2A2A', '#3A3A3A', '#1A1A1A'],
    humanMissions: [
      { role: 'Light Designer Architectural', mission: 'Découpe laser et projecteurs rasants pour faire vibrer le béton brut', essentialSkill: 'Éclairage d’architecture industrielle' },
      { role: 'Céramiste & Designer Mobilier', mission: 'Bancs en béton coulé et vaisselle noire brute non émaillée', essentialSkill: 'Matières minérales pures' },
      { role: 'Chef Cuiseur / Street-Gourmet', mission: 'Bouchées monochromes et feu vif sans nappage', essentialSkill: 'Design culinaire radical' },
    ],
    complementaryStyleIds: ['club', 'supermarche', 'punk'],
    vendorToolkit: {
      title: 'Console Régie & Puissance Chantier',
      description: 'Fiche d’implantation électrique, sécurité des sols friches et plan son immersif.',
      badge: 'Régie Technique',
    },
  },
  {
    id: 'club',
    name: 'Club Amour',
    tagline: '02h17. Stroboscope. Oui.',
    category: 'urbain',
    manifesto: 'Le mariage commence quand les autres se couchent. Flyer, fumée, techno, baiser sous le néon.',
    synopsis: 'After de mariage devenu mariage. Invitation = flyer rave, dress code = club kid, first dance à 2h17 sous stroboscope magenta.',
    ink: '#FFE6F7',
    muted: '#B08BA3',
    accent: '#FF00E5',
    dark: true,
    image: '/images/club-amour.jpg',
    aura: ['#1A0A1A', '#2D0A2D', '#0F0A1F'],
    humanMissions: [
      { role: 'DJ Résident Clubbing / Sound Engineer', mission: 'Set vinyle puis live techno/house jusqu’au petit matin', essentialSkill: 'Gestion du dancefloor sans temps mort' },
      { role: 'Scénographe Néons & Machines à Fumée', mission: 'Tunnel de néons roses et fumée lourde pour l’entrée des mariés', essentialSkill: 'Régie club et sécurité laser' },
      { role: 'Barista & Mixologue Nocturne', mission: 'Cocktails énergisants artisanaux et shots signatures', essentialSkill: 'Cocktails servis au rythme du beat' },
    ],
    complementaryStyleIds: ['rooftop-paris', 'supermarche', 'brutal'],
    vendorToolkit: {
      title: 'Live Tracklist & Vote Invités',
      description: 'Playlist participative filtrée en direct pour le DJ avec jauge d’énergie de la foule.',
      badge: 'Dancefloor Live',
    },
  },
  {
    id: 'desert',
    name: 'Desert Motel',
    tagline: 'Vegas, 38°C, piscine vide',
    category: 'sauvage',
    manifesto: 'Elopement Americana. Un motel, une piscine turquoise vide, deux bagues qui brûlent au soleil.',
    synopsis: 'Road-trip love. Motel 70s, piscine vide, enseigne néon LOVE. Robe vintage, bottes, chaleur qui tremble. Très Wes Anderson.',
    ink: '#2B1B0E',
    muted: '#9B8B7A',
    accent: '#FFB61E',
    dark: false,
    image: '/images/desert-motel.jpg',
    aura: ['#F5E6D0', '#FFE9B0', '#E8D5B0'],
    humanMissions: [
      { role: 'Cinéaste Super 8 Authentique', mission: 'Filmage sur pellicule 8mm réelle avec grain chaud et projecteur d’époque', essentialSkill: 'Prise de vue argentique vintage' },
      { role: 'Agence Elopement / Guide Désert', mission: 'Réservation de motels rétro et autorisations parcs naturels sauvages', essentialSkill: 'Logistique hors des sentiers battus' },
      { role: 'Chineur Mobilier Mid-Century', mission: 'Chaises en rotin 70s, verres fumés et glacières rétro', essentialSkill: 'Direction artistique chinée' },
    ],
    complementaryStyleIds: ['cinema', 'brocante', 'punk'],
    vendorToolkit: {
      title: 'Carnet Road-Trip & Cagnotte Étape',
      description: 'Liaison directe des étapes du voyage aux contributions de la cagnotte des invités.',
      badge: 'Elopement GPS',
    },
  },
  {
    id: 'garden-party',
    name: 'Garden Botanica',
    tagline: 'Sous les feuillages. Poésie végétale.',
    category: 'nature',
    manifesto: 'L’esprit d’une serre anglaise et d’un déjeuner d’été sous les saules. Lumière tamisée par les feuilles et fraîcheur aromatique.',
    synopsis: 'Nature vivante et lumineuse. Grandes tables en bois patiné, verrerie étincelante et fleurs des champs en fête champêtre soignée.',
    ink: '#152419',
    muted: '#6E8573',
    accent: '#2F6F4E',
    dark: false,
    image: '/images/garden.jpg',
    aura: ['#EDF6EE', '#DFEEDE', '#C9E2C8'],
    humanMissions: [
      { role: 'Botaniste & Paysagiste Éphémère', mission: 'Arches végétales vivantes non coupées et herbes aromatiques à table', essentialSkill: 'Art floral éco-responsable' },
      { role: 'Menuisier Tables Banquets', mission: 'Grandes tablées en chêne massif brut sans nappe', essentialSkill: 'Fabrication bois patiné' },
      { role: 'Traiteur Champêtre Bio-local', mission: 'Buffet de récolte, pains au levain naturel et fromages fermiers', essentialSkill: 'Circuit court zéro kilomètre' },
    ],
    complementaryStyleIds: ['chateau-moderne', 'foret-noire', 'brocante'],
    vendorToolkit: {
      title: 'Plan Botanique & Allergies Végétales',
      description: 'Cartographie des variétés végétales et suivi en direct des régimes véganes/allergènes.',
      badge: 'Botanique Vivante',
    },
  },
  {
    id: 'supermarche',
    name: 'Supermarché 22h',
    tagline: 'Rayon 7, néons, caddie',
    category: 'concept',
    manifesto: 'On se dit oui entre les céréales et le rayon surgelés. Néons, caddie, amour en libre-service.',
    synopsis: 'Le plus anti-lieu du monde. Supermarché privatisé à 22h, néons qui grésillent, baiser entre deux rayons. Décor pop et surréaliste.',
    ink: '#E8FFE8',
    muted: '#8BA38B',
    accent: '#00FF88',
    dark: true,
    image: '/images/supermarche.jpg',
    aura: ['#0A1A0A', '#1A2A1A', '#0F1F0F'],
    humanMissions: [
      { role: 'Régisseur Négociateur Espaces Publics', mission: 'Privatisation nocturne d’enseignes et gestion des assurances décalées', essentialSkill: 'Accès lieux insolites déclassés' },
      { role: 'Photographe Pop-Flash 90s', mission: 'Prises de vue colorées au flash cobra avec chariots et packagings rétro', essentialSkill: 'Esthétique mode pop-art' },
      { role: 'Chef Tapas & Finger Food Étoilé', mission: 'Bouchées de haute volée servies dans des barquettes design réutilisables', essentialSkill: 'Détournement gastronomique' },
    ],
    complementaryStyleIds: ['laverie', 'club', 'punk'],
    vendorToolkit: {
      title: 'Pass Sécurité & Autorisation Décalée',
      description: 'Accords contractuels et règles de privatisation des lieux insolites urbains.',
      badge: 'Insolite Hors-Cadre',
    },
  },
  {
    id: 'laverie',
    name: 'Laverie Club',
    tagline: 'Tambour 7, mousse, pastel',
    category: 'concept',
    manifesto: 'Tambours qui tournent, pastel délavé, bulles. Mariage en laverie, le plus tendre des endroits banals.',
    synopsis: 'Laverie automatique rétro, néons pastel, hublots qui tournent, couple assis sur les machines. Intime, pop et ultra photogénique.',
    ink: '#1A1A2A',
    muted: '#8B8B9B',
    accent: '#8B9BFF',
    dark: false,
    image: '/images/laverie.jpg',
    aura: ['#E8E8FF', '#F0F0FF', '#E0E0FF'],
    humanMissions: [
      { role: 'Styliste Pastel & Vintage', mission: 'Robes courtes structurées et costumes légers aux tons poudrés', essentialSkill: 'Vestiaire rétro-chic' },
      { role: 'Mixologue Bar à Bulles', mission: 'Champagnes pétillants naturels et mocktails effervescents servies au flacon', essentialSkill: 'Mixologie pétillante' },
      { role: 'Vidéaste Clip Musique', mission: 'Captation vidéo au rendu clip VHS ou caméra DV 2000', essentialSkill: 'Montage dynamique nostalgique' },
    ],
    complementaryStyleIds: ['supermarche', 'punk', 'desert'],
    vendorToolkit: {
      title: 'Micro-Événement & Planning Express',
      description: 'Minutage condensé pour mariages intimes et shooting haute intensité.',
      badge: 'Intime & Décalé',
    },
  },
  {
    id: 'foret-noire',
    name: 'Forêt Noire',
    tagline: 'Mousse, rituel, champignons',
    category: 'sauvage',
    manifesto: 'Pas garden party. Forêt profonde, brume, velours vert, champignons. Mariage païen et organique.',
    synopsis: 'Witchy, païen, mousse. Forêt dense, velours émeraude, couronne de baies et feu de camp. Un rituel sacré au milieu des arbres centenaires.',
    ink: '#E8E6D9',
    muted: '#8B8A7A',
    accent: '#2D4A22',
    dark: true,
    image: '/images/foret-noire.jpg',
    aura: ['#1A2A1A', '#2A3A2A', '#0F1A0F'],
    humanMissions: [
      { role: 'Célébrant de Rituels Laïques & Païens', mission: 'Handfasting (ruban celtique), bénédiction des 4 éléments, vœux silencieux', essentialSkill: 'Maîtrise des rituels ancestraux' },
      { role: 'Chef Banquets Feu de Camp', mission: 'Cuisson lente à la braise, champignons sauvages rôtis et pain cuit sur pierre', essentialSkill: 'Cuisine primitive en sous-bois' },
      { role: 'Acousticien Sons Sylvestres', mission: 'Sonorisation discrète sans fil intégrée dans les troncs d’arbres', essentialSkill: 'Intégration acoustique invisible' },
    ],
    complementaryStyleIds: ['garden-party', 'chateau-moderne', 'brocante'],
    vendorToolkit: {
      title: 'Guide d’Accès Sentier & Fiche Sécurité Feu',
      description: 'Point GPS précis en sous-bois, consignes de protection de la forêt et météo brume.',
      badge: 'Bivouac Sauvage',
    },
  },
  {
    id: 'cinema',
    name: 'Cinéma',
    tagline: 'Rideau rouge. 35mm. Première.',
    category: 'concept',
    manifesto: 'Votre mariage est une première de film. Ticket d’entrée, rideau rouge, générique. Les invités sont le public.',
    synopsis: 'Mariage = première de festival de film. Ticket perforé d’invitation, rideau rouge lourd, générique projeté sur écran géant.',
    ink: '#F5F1E8',
    muted: '#9B958B',
    accent: '#C80000',
    dark: true,
    image: '/images/cinema.jpg',
    aura: ['#1A0A0A', '#2A0A0A', '#0F0A0A'],
    humanMissions: [
      { role: 'Projectionniste & Régisseur Écran', mission: 'Projection du film d’ouverture des mariés sur toile 35mm cinéma', essentialSkill: 'Régie salle de projection' },
      { role: 'Ouvreur / Hôte de Cérémonie en Livrée', mission: 'Accueil des invités avec cartons perforés et programmes de salle', essentialSkill: 'Mise en scène théâtrale' },
      { role: 'Quatuor à Cordes Cinématographique', mission: 'Interprétation en direct des thèmes de Morricone, Zimmer et Rota', essentialSkill: 'Arrangements symphoniques live' },
    ],
    complementaryStyleIds: ['noir-blanc', 'desert', 'chateau-moderne'],
    vendorToolkit: {
      title: 'Conducteur Minute & Régie Projection',
      description: 'Top départs minutés pour le noir salle, la levée de rideau et l’entrée sous le faisceau.',
      badge: 'Scène & Écran',
    },
  },
  {
    id: 'rooftop-paris',
    name: 'Rooftop Chic',
    tagline: 'Golden hour. Toits de Paris.',
    category: 'urbain',
    manifesto: 'L’énergie des grandes villes au coucher du soleil. Cocktails signatures, skyline scintillante et glamour contemporain.',
    synopsis: 'Mariage au sommet. Vue panoramique sur la ville, coupe de champagne au crépuscule et piste de danse sous les étoiles.',
    ink: '#14151B',
    muted: '#7E8294',
    accent: '#E65C00',
    dark: false,
    image: '/images/last-minute.jpg',
    aura: ['#FFF0E6', '#FBE5D6', '#EAD0BE'],
    humanMissions: [
      { role: 'Mixologue Signature Golden Hour', mission: 'Bar panoramique avec créations de cocktails aux teintes orangées du crépuscule', essentialSkill: 'Service cocktails en terrasse' },
      { role: 'Saxophoniste Deep House Live', mission: 'Improvisation live au saxo sur set électro-chill au coucher du soleil', essentialSkill: 'Performance instrumentale urbaine' },
      { role: 'Régisseur Ascenseurs & Flux Rooftop', mission: 'Gestion exclusive de la montée des invités et coupes-vent invisibles', essentialSkill: 'Logistique en altitude' },
    ],
    complementaryStyleIds: ['club', 'noir-blanc', 'chateau-moderne'],
    vendorToolkit: {
      title: 'Plan de Terrasse & Météo Crépuscule',
      description: 'Calcul automatique de l’heure exacte du golden hour pour les toasts et l’ouverture du bar.',
      badge: 'Skyline Urbaine',
    },
  },
  {
    id: 'punk',
    name: 'Punk Papier',
    tagline: 'Zine, agrafes, photocopieuse',
    category: 'concept',
    manifesto: 'Anti-luxe. Faire-part photocopié à 50 exemplaires, typo rançon, épingle à nourrice. Coût : 0€.',
    synopsis: 'DIY or die. Fanzine, Xerox, collage, scotch. Le mariage le plus punk et le plus libre : un manifeste d’amour authentique.',
    ink: '#0A0A0A',
    muted: '#8A8A8A',
    accent: '#FF1A1A',
    dark: false,
    image: '/images/punk-papier.jpg',
    aura: ['#FFFFFF', '#F5F5F5', '#EAEAEA'],
    humanMissions: [
      { role: 'Imprimeur Riso / Fanzineur Live', mission: 'Photocopiage en direct des messages des invités pour relier un livre d’or zine', essentialSkill: 'Micro-édition artisanale' },
      { role: 'Groupe Garage Rock / Post-Punk', mission: 'Concert live brut de 45 minutes sans artifices dans un hangar ou cave', essentialSkill: 'Énergie brute sans playbacks' },
      { role: 'Tireur de Bières Artisanales Locales', mission: 'Fûts de micro-brasseries indépendantes servis directement au gobelet inox', essentialSkill: 'Circuits courts alternatifs' },
    ],
    complementaryStyleIds: ['brutal', 'brocante', 'supermarche'],
    vendorToolkit: {
      title: 'Zine Builder & Presse DIY',
      description: 'Mise en page instantanée des textes des mariés au format fanzine A5 prêt à imprimer.',
      badge: 'DIY Sans Concession',
    },
  },
  {
    id: 'brocante',
    name: 'Brocante Club',
    tagline: 'Chaises dépareillées. Maximalisme.',
    category: 'concept',
    manifesto: 'Anti-Pinterest parfait. 28 chaises différentes, assiettes de mamie, fleurs en bocaux. Seconde main, joie.',
    synopsis: 'Maximalisme joyeux. Chaque chaise différente, assiettes chinées, nappes mélangées, fleurs en pots de confiture. Durable et chaleureux.',
    ink: '#2A1F1A',
    muted: '#9B8E84',
    accent: '#FF6B2B',
    dark: false,
    image: '/images/brocante.jpg',
    aura: ['#F5EDE0', '#FFF5E0', '#E8DDD0'],
    humanMissions: [
      { role: 'Chineur Professionnel & Loueur Vintage', mission: 'Rassemblement de 100 assiettes anciennes dépareillées et chandeliers chinés', essentialSkill: 'Curation d’objets vintage de brocante' },
      { role: 'Traiteur Banquet Convivial à Partager', mission: 'Plats familiaux au centre de table, grandes terrines et pains géants', essentialSkill: 'Cuisine du partage' },
      { role: 'Accordéoniste Contemporain / Jazz Manouche', mission: 'Swing festif acoustique au milieu des tables sans scène', essentialSkill: 'Ambiance guinguette moderne' },
    ],
    complementaryStyleIds: ['garden-party', 'desert', 'foret-noire'],
    vendorToolkit: {
      title: 'Inventaire de Vaisselle & Mobilier Chiné',
      description: 'Registre photographique des pièces anciennes louées avec guide de restitution.',
      badge: 'Éco-Chic & Vintage',
    },
  },
  {
    id: 'cosmic',
    name: 'Cosmic',
    tagline: 'Verre liquide. Orbite.',
    category: 'concept',
    manifesto: 'Premier mariage en visionOS. Chrome liquide, verre qui flotte, invitation en spatial video.',
    synopsis: 'Mariage spatial. Verre liquide, chrome miroir, typographie qui flotte. Le site est une fenêtre visionOS, pas une carte.',
    ink: '#0E0E1A',
    muted: '#8B8DAF',
    accent: '#7A5CFF',
    dark: false,
    image: '/images/cosmic.jpg',
    aura: ['#E6E8FF', '#F0F0FF', '#D8D8FF'],
    humanMissions: [
      { role: 'Vidéaste Spatial / Apple Vision Pro', mission: 'Captation en vidéo spatiale 3D stéréoscopique pour revivre le mariage en immersion', essentialSkill: 'Tournage et encodage spatial' },
      { role: 'Scénographe Miroir & Chrome', mission: 'Tables miroitantes reflétant le ciel nocturne et suspensions transparentes', essentialSkill: 'Structures optiques et miroirs' },
      { role: 'Sound Designer Synthwave / Ambient', mission: 'Nappes de synthétiseurs analogiques planantes pendant la cérémonie', essentialSkill: 'Création sonore atmosphérique' },
    ],
    complementaryStyleIds: ['club', 'brutal', 'desert'],
    vendorToolkit: {
      title: 'Fichier Spatial Video & Réalité Mixte',
      description: 'Lien direct vers les flux 3D et invitation spatiale compatible casques de réalité mixte.',
      badge: 'Next-Gen Spatiale',
    },
  },
  {
    id: 'co-mariage',
    name: 'Co-Mariage Festival',
    tagline: 'Deux couples. Une scène. Un festival.',
    category: 'concept',
    manifesto: 'Pourquoi célébrer séparément ? Deux couples d’amis fusionnent leur Jour J pour une fête monumentale, mutualisent la scène et invitent leurs mondes à fusionner.',
    synopsis: 'L’alliance de deux mariages. Scène double, domaine d’exception partagé, double entrée des mariés et fête festival jusqu’à l’aube.',
    ink: '#0F172A',
    muted: '#64748B',
    accent: '#10B981',
    dark: false,
    image: '/images/danse.jpg',
    aura: ['#ECFDF5', '#D1FAE5', '#A7F3D0'],
    humanMissions: [
      { role: 'Coordinateur Festival Multi-Mariés', mission: 'Orchestration fluide des deux cérémonies et gestion du domaine partagé', essentialSkill: 'Régie festival & logistique double' },
      { role: 'Sound Designer & Scène Double', mission: 'Scénographie musicale commune et transition continue sans temps mort', essentialSkill: 'Régie concert & live sets' },
      { role: 'Collectif Chefs Traiteurs / Food Market', mission: 'Grands banquets festifs et corners culinaires déambulatoires', essentialSkill: 'Banquet festival XXL' },
    ],
    complementaryStyleIds: ['club', 'chateau-moderne', 'garden-party'],
    vendorToolkit: {
      title: 'Planning Festival & Budget Mutualisé',
      description: 'Partage en direct des frais de scène, du domaine et répartition des invités des deux couples.',
      badge: 'Festival Partagé',
    },
  },
  {
    id: 'abyssal',
    name: 'Dôme Abyssal',
    tagline: 'Sous l’océan. Bleu profond. Silence.',
    category: 'concept',
    manifesto: 'Le mariage le plus secret du monde. Se dire oui à 15 mètres sous la surface dans un dôme sous-marin vitré, entouré de bioluminescence.',
    synopsis: 'L’impossible rendu possible. Observatoire sous-marin privatisé, faune abyssale illuminée, dîner iodé d’exception et silence absolu des profondeurs.',
    ink: '#E0F2FE',
    muted: '#7DD3FC',
    accent: '#0284C7',
    dark: true,
    image: '/images/submarine-vows.jpg',
    aura: ['#0C4A6E', '#0369A1', '#082F49'],
    humanMissions: [
      { role: 'Ingénieur Plongée & Sécurité Subaquatique', mission: 'Accompagnement pressurisation, transferts navette sous-marine', essentialSkill: 'Sécurité maritime extrême' },
      { role: 'Light Designer Caustique & Faune Marine', mission: 'Projecteurs basse fréquence respectueux de la faune bioluminescente', essentialSkill: 'Éclairage subaquatique doux' },
      { role: 'Chef Gastronome Iodé d’Immersion', mission: 'Menu gastronomique marin d’algues fraîches, coquillages et accords minéraux', essentialSkill: 'Haute cuisine marine' },
    ],
    complementaryStyleIds: ['cosmic', 'noir-blanc', 'brutal'],
    vendorToolkit: {
      title: 'Fiche Accès Submersible & Barométrie',
      description: 'Protocole de descente, fiches médicales et synchronisation des flux sous-marins.',
      badge: 'Immersion Profonde',
    },
  },
  {
    id: 'orient-express',
    name: 'Train de Nuit Impérial',
    tagline: 'Paris-Venise. 100 km/h. Vœux en mouvement.',
    category: 'sauvage',
    manifesto: 'Le mariage qui traverse les frontières. Un train historique entièrement affrété filant à travers les Alpes dans la nuit.',
    synopsis: 'Le voyage d’une vie. Boiseries acajou 1920, lampes en laiton qui tremblent doucement, dîner étoilé en voiture-restaurant et réveil face aux Dolomites.',
    ink: '#FEF3C7',
    muted: '#D97706',
    accent: '#B45309',
    dark: true,
    image: '/images/train-vows.jpg',
    aura: ['#451A03', '#78350F', '#1C1917'],
    humanMissions: [
      { role: 'Affréteur Ferroviaire & Sillon Privé', mission: 'Coordination horaires SNCF/ÖBB, réservation du train complet et arrêts privés', essentialSkill: 'Logistique ferroviaire de prestige' },
      { role: 'Pianiste Voie Étroite / Jazz Mobile', mission: 'Piano quart-de-queue calé dans la voiture-bar pour swing nocturne en marche', essentialSkill: 'Acoustique en mouvement' },
      { role: 'Chef Étoilé en Voiture Restaurant', mission: 'Service gastronomique au rythme du rail dans un espace cuisine millimétré', essentialSkill: 'Cuisine d’exception embarquée' },
    ],
    complementaryStyleIds: ['chateau-moderne', 'noir-blanc', 'cinema'],
    vendorToolkit: {
      title: 'Conducteur de Ligne & Horaires Gares',
      description: 'Feuille de route minutée des passages de frontières, arrêts embrassements et cabines couchette.',
      badge: 'Grand Voyage',
    },
  },
  {
    id: 'phare-atlantique',
    name: 'Le Phare Isolé',
    tagline: 'Vents d’Ouest. Tempête. Oui absolu.',
    category: 'sauvage',
    manifesto: 'Pour ceux qui ne veulent personne d’autre que l’océan. Se marier en haut d’un phare de granit battu par les lames, seuls au monde.',
    synopsis: 'L’extrême pureté sauvage. Un phare en mer privatisé, les embruns salés, le faisceau lumineux tournant qui balaye l’horizon à la tombée de la nuit.',
    ink: '#F8FAFC',
    muted: '#94A3B8',
    accent: '#0EA5E9',
    dark: true,
    image: '/images/phare-vows.jpg',
    aura: ['#0F172A', '#1E293B', '#0284C7'],
    humanMissions: [
      { role: 'Pilote Canot Tout Temps & Hélitreuillage', mission: 'Transfert des mariés et intimes par mer agitée ou treuillage sur la plateforme', essentialSkill: 'Navigation hauturière extrême' },
      { role: 'Gardien de Phare Hôte & Histoire', mission: 'Ouverture de la lanterne historique et manœuvre du faisceau', essentialSkill: 'Connaissance du monument en mer' },
      { role: 'Traiteur Bivouac Étoilé Iodé', mission: 'Fruits de mer de haute mer ouverts minute, beurre de baratte et whisky tourbé', essentialSkill: 'Autonomie insulaire totale' },
    ],
    complementaryStyleIds: ['desert', 'foret-noire', 'brutal'],
    vendorToolkit: {
      title: 'Météo Houle & Marées Astronomiques',
      description: 'Calcul temps réel du coefficient de marée et créneau météo de passage de la vedette.',
      badge: 'Bout du Monde',
    },
  },
  {
    id: 'last-minute',
    name: 'Mariage Improvisé · 48H',
    tagline: 'Coup de tête. 48h chrono. Plan B héroïque.',
    category: 'concept',
    manifesto: 'Pourquoi attendre deux ans ? Deux billets de train, une place publique, des potes prévenus par SMS à 14h, des fleurs chopées au vol et un banquet improvisé sur le pouce.',
    synopsis: 'L’amour spontané radical. Mariage éclair ou sauvetage de plan B en 48h. L’écosystème VOWS mobilise instantanément les prestataires disponibles à proximité.',
    ink: '#0F172A',
    muted: '#64748B',
    accent: '#F59E0B',
    dark: false,
    image: '/images/couple-paris.jpg',
    aura: ['#FEF3C7', '#FDE68A', '#F59E0B'],
    humanMissions: [
      { role: 'Régisseur Urgence Plan B / 48H', mission: 'Dégoter un spot d’exception disponible le soir-même et régler les assurances', essentialSkill: 'Réseau d’accès instantané' },
      { role: 'Photographe Sniper Spontané', mission: 'Reportage live sans poses figées, lumière disponible et argentique rapide', essentialSkill: 'Prise de vue instinctive' },
      { role: 'Traiteur Pop-Up / Chef Guérilla', mission: 'Banquets de rue, pizzas napolitaines au four mobile ou bar à huîtres express', essentialSkill: 'Cuisine mobile zéro délai' },
    ],
    complementaryStyleIds: ['punk', 'supermarche', 'rooftop-paris'],
    vendorToolkit: {
      title: 'Radar de Secours & Dispatch Express',
      description: 'Alerte instantanée sur le réseau des prestataires locaux géolocalisés disponibles sous 48h.',
      badge: 'Urgence & Coup d’Éclat',
    },
  },
  {
    id: 'divorce-party',
    name: 'Fête de Divorce & Dé-Mariage',
    tagline: 'Bagues au feu. Champagne sabré. Liberté absolue.',
    category: 'concept',
    manifesto: 'Si on célèbre le début, pourquoi ne pas fêter dignement la fin ? Enterrement joyeux de la vie conjugale, grand feu de camp rituel, découpe du gâteau noir "Officiellement Libre" et nuit de fête sans rancœur.',
    synopsis: 'La célébration de la renaissance. Un mini-site pour convier ses vrais amis, cagnotte pour le nouvel appartement ou le voyage en solo, playlist libératrice et avocat invité d’honneur.',
    ink: '#FFFFFF',
    muted: '#94A3B8',
    accent: '#EF4444',
    dark: true,
    image: '/images/table-noir.jpg',
    aura: ['#18181B', '#27272A', '#09090B'],
    humanMissions: [
      { role: 'Maître de Cérémonie de Rupture', mission: 'Discours libérateur avec autodérision, cérémonie d’extinction des alliances', essentialSkill: 'Éloquence décomplexée & humour noir' },
      { role: 'Pâtissier Gâteau Noir Dé-Mariage', mission: 'Wedding cake monochrome inversé avec figurine solitaire victorieuse', essentialSkill: 'Sculpture pâtissière satirique' },
      { role: 'DJ Set "Liberté & Renaissance"', mission: 'Playlist hymnes d’indépendance (Fleetwood Mac, Gloria Gaynor, Daft Punk)', essentialSkill: 'Montée en puissance thérapeutique' },
    ],
    complementaryStyleIds: ['club', 'punk', 'brutal'],
    vendorToolkit: {
      title: 'Pacte de Séparation Festif & Cagnotte Solo',
      description: 'Cagnotte participative pour le nouveau départ et répartition amiable des souvenirs.',
      badge: 'Renaissance Joyeuse',
    },
  },
  {
    id: 'traditionnel',
    name: 'Traditionnel Élégant',
    tagline: 'Église, banquet, orchestre. Le classique parfait.',
    category: 'classique',
    manifesto: 'Le mariage tel qu’on se le raconte depuis toujours, mais exécuté sans une fausse note : messe à l’église, cortège, banquet assis, orchestre et brunch du lendemain.',
    synopsis: 'Rien d’insolite, tout est soigné. Dragées, livret de messe, plan de table calligraphié, pièce montée, ouverture de bal et animateur : la liste complète, tenue par une cheffe d’orchestre.',
    ink: '#1B1B1F',
    muted: '#8A8378',
    accent: '#B08D57',
    dark: false,
    image: '/images/traditionnel.jpg',
    aura: ['#FBF7F0', '#F0E6D6', '#DEC9A8'],
    humanMissions: [
      { role: 'Wedding Planner Cérémonie & Réception', mission: 'Orchestration complète : église, cortège, banquet, brunch du lendemain', essentialSkill: 'Chef d’orchestre du jour J' },
      { role: 'Traiteur Banquet Traditionnel', mission: 'Repas assis cinq services, service à l’assiette et pièce montée', essentialSkill: 'Service à la française' },
      { role: 'Orchestre de Bal & Animateur', mission: 'Ouverture de bal, variété française et dancefloor jusqu’à 04h00', essentialSkill: 'Tenir une piste toute la nuit' },
    ],
    complementaryStyleIds: ['chateau-moderne', 'garden-party', 'corse'],
    vendorToolkit: {
      title: 'Carnet de Cérémonie Complet',
      description: 'Livret de messe, plans de table, ordre du cortège et coordination des prestataires en un seul carnet.',
      badge: 'Classique Sans Fausse Note',
    },
  },
  {
    id: 'corse',
    name: 'Corse Sauvage',
    tagline: 'Maquis, pierre sèche, chants polyphoniques.',
    category: 'sauvage',
    manifesto: 'Une bergerie de pierre sur la crête, le maquis pour tout décor, et des chants polyphoniques qui montent du vallon quand le soleil descend.',
    synopsis: 'Mariage dans l’île : longues tables de bois, cochon de lait à la broche, vin de Patrimonio et baignade au petit matin. Personne n’est reparti avant le lendemain.',
    ink: '#F6F2E9',
    muted: '#B9AE97',
    accent: '#7C8A5A',
    dark: true,
    image: '/images/corse.jpg',
    aura: ['#3A3B32', '#2A2B24', '#1B1C17'],
    humanMissions: [
      { role: 'Berger Hôte & Cuisinier au Feu', mission: 'Cochon de lait à la broche, fromages de brebis et repas servi sur la crête', essentialSkill: 'Cuisine au feu de bois' },
      { role: 'Groupe Polyphonique Corse', mission: 'Chants traditionnels pendant la cérémonie et au coucher du soleil', essentialSkill: 'Polyphonie à trois voix' },
      { role: 'Guide Randonnée & Baignade', mission: 'Accès au site par le sentier, baignade du lendemain en calanque', essentialSkill: 'Connaissance des sentiers' },
    ],
    complementaryStyleIds: ['garden-party', 'phare-atlantique', 'reunion'],
    vendorToolkit: {
      title: 'Carnet de la Crête',
      description: 'Sentiers, horaires de navette par le col, météo du maquis et plan des tables de pierre.',
      badge: 'Île & Feu de Bois',
    },
  },
  {
    id: 'reunion',
    name: 'La Réunion Créole',
    tagline: 'Varangue, frangipanier, maloya.',
    category: 'nature',
    manifesto: 'Une varangue créole ouverte sur les palmiers, des carrys parfumés et un maloya qui fait lever tout le monde à la fin du repas.',
    synopsis: 'Mariage tropical : accueil au rougail, table sous les frangipaniers, séga et maloya en soirée, et la mer à dix minutes. Le lendemain, tout le monde se baigne.',
    ink: '#1E2422',
    muted: '#87897E',
    accent: '#E07A5F',
    dark: false,
    image: '/images/reunion.jpg',
    aura: ['#FFF6EC', '#FBE3CE', '#F0C8A8'],
    humanMissions: [
      { role: 'Chef Créole Marmite & Carry', mission: 'Carry boucané, rougail saucisse et cari de poisson servi sous la varangue', essentialSkill: 'Maîtrise des épices créoles' },
      { role: 'Groupe Séga & Maloya', mission: 'Concert live de la fin du repas jusqu’à l’aube, roulèr et kayanm', essentialSkill: 'Faire danser tout le monde' },
      { role: 'Fleuriste Tropical & Décoration', mission: 'Frangipaniers, aloès et vaisselle de terre cuite sur les longues tables', essentialSkill: 'Compositions tropicales' },
    ],
    complementaryStyleIds: ['garden-party', 'corse', 'club'],
    vendorToolkit: {
      title: 'Carnet Créole',
      description: 'Menus des carrys, plannings des groupes, rotation des navettes et plan des varangues.',
      badge: 'Île Intense',
    },
  },
  {
    id: 'new-york',
    name: 'New York Skyline',
    tagline: 'Brooklyn, taxi jaune, skyline.',
    category: 'urbain',
    manifesto: 'Un rooftop à Brooklyn, la skyline pour mur de fond, des lumières accrochées entre deux réservoirs d’eau et un dîner qui commence quand le soleil descend sur Manhattan.',
    synopsis: 'Mariage américain : limousine jaune, discours au micro, dîner sur les toits et brunch le lendemain dans un diner. Le rythme de la ville fait la musique.',
    ink: '#111827',
    muted: '#7C8598',
    accent: '#F4B942',
    dark: false,
    image: '/images/new-york.jpg',
    aura: ['#F4F6FB', '#E2E8F4', '#C9D4E8'],
    humanMissions: [
      { role: 'Wedding Planner New-Yorkais', mission: 'Permis de rooftop, coordination des prestataires et timing à l’américaine', essentialSkill: 'Exécution au quart d’heure' },
      { role: 'Chef & Bar à Cocktails', mission: 'Dîner sur le toit, bar à cocktails et food truck de fin de soirée', essentialSkill: 'Cuisine de rooftop' },
      { role: 'Saxophoniste & DJ Set', mission: 'Cocktail au saxophone live, puis set jusqu’à la fermeture du lieu', essentialSkill: 'Ambiance new-yorkaise' },
    ],
    complementaryStyleIds: ['rooftop-paris', 'club', 'vegas'],
    vendorToolkit: {
      title: 'Carnet Manhattan',
      description: 'Autorisations de rooftop, plan des ascenseurs, rotation des navettes et adresses du brunch.',
      badge: 'Rythme New-Yorkais',
    },
  },
  {
    id: 'vegas',
    name: 'Las Vegas',
    tagline: 'Chapelle rose, Elvis, limousine.',
    category: 'concept',
    manifesto: 'Une chapelle en néon rose à 22h00, Elvis qui vous marie sous une arche de fleurs en plastique, et une limousine pour repartir. C’est assumé, c’est joyeux.',
    synopsis: 'Le mariage le plus rapide du monde, version festive : cérémonie de trente minutes, champagne au strip, buffet nocturne et machine à sous pour le gâteau.',
    ink: '#FFF5F8',
    muted: '#C9A5B4',
    accent: '#FF4D8D',
    dark: true,
    image: '/images/vegas.jpg',
    aura: ['#2A1220', '#1D0C17', '#12070E'],
    humanMissions: [
      { role: 'Elvis Officiant & Maître de Cérémonie', mission: 'Cérémonie en vingt minutes, mimiques, et photos sous les néons', essentialSkill: 'Showmanship absolu' },
      { role: 'Photographe Néon', mission: 'Portraits de nuit sous les enseignes, tirages sépia instantanés', essentialSkill: 'Lumière artificielle intense' },
      { role: 'Chauffeur de Limousine', mission: 'Fontaine de champagne, chauffeur du strip aux motels du désert', essentialSkill: 'Conduite de nuit sur le Strip' },
    ],
    complementaryStyleIds: ['desert', 'club', 'new-york'],
    vendorToolkit: {
      title: 'Chapelle Éclair',
      description: 'Créneaux de chapelle, licence express, contrat en vingt minutes et galerie envoyée le soir même.',
      badge: 'Express & Festif',
    },
  },
];

export function getDirectionArtistiqueImage(styleId: string): string {
  const mapping: Record<string, string> = {
    'noir-blanc': '/images/da-noir-blanc.jpg',
    'desert': '/images/da-desert.jpg',
    'brutal': '/images/da-brutal.jpg',
    'chateau-moderne': '/images/da-chateau.jpg',
    'club': '/images/da-club.jpg',
    'garden-party': '/images/da-garden.jpg',
    'supermarche': '/images/da-supermarche.jpg',
    'foret-noire': '/images/da-foret.jpg',
    'rooftop-paris': '/images/da-rooftop.jpg',
    'minimalist-warm': '/images/da-minimal-lin.jpg',
    'abyssal': '/images/da-abyssal.jpg',
    'orient-express': '/images/da-train.jpg',
    'phare-atlantique': '/images/da-phare.jpg',
  };
  const direct: Record<string, string> = {
    traditionnel: '/images/traditionnel.jpg',
    corse: '/images/corse.jpg',
    reunion: '/images/reunion.jpg',
    'new-york': '/images/new-york.jpg',
    vegas: '/images/vegas.jpg',
  };
  return mapping[styleId] || direct[styleId] || '/images/table-noir.jpg';
}

export function styleById(id: string): WeddingStyle {
  return WEDDING_STYLES.find((s) => s.id === id) ?? WEDDING_STYLES[0];
}

export function getComplementaryStyles(currentStyle: WeddingStyle): WeddingStyle[] {
  return currentStyle.complementaryStyleIds
    .map((id) => WEDDING_STYLES.find((s) => s.id === id))
    .filter((s): s is WeddingStyle => Boolean(s));
}

export interface TypoOption { id: string; name: string; hint: string; heading: string; body: string; weight: number; }

export const TYPO_OPTIONS: TypoOption[] = [
  { id: 'spatial', name: 'Spatial', hint: 'SF, net et lumineux', heading: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", system-ui, sans-serif', body: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", system-ui, sans-serif', weight: 620 },
  { id: 'sans', name: 'Sans Serif', hint: 'Contemporain, resserré', heading: 'Inter, system-ui, sans-serif', body: 'Inter, system-ui, sans-serif', weight: 600 },
  { id: 'editorial', name: 'Editorial', hint: 'Magazine haut de gamme', heading: 'Fraunces, Georgia, serif', body: 'Inter, system-ui, sans-serif', weight: 350 },
  { id: 'serif', name: 'Serif', hint: 'Classique et littéraire', heading: '"Cormorant Garamond", Georgia, serif', body: 'Inter, system-ui, sans-serif', weight: 400 },
  { id: 'modern', name: 'Modern', hint: 'Géométrique et affirmé', heading: 'Manrope, system-ui, sans-serif', body: 'Manrope, system-ui, sans-serif', weight: 650 },
];

export function fontsFor(typoId: string): { heading: string; body: string; weight: number } {
  const found = TYPO_OPTIONS.find((t) => t.id === typoId) ?? TYPO_OPTIONS[0];
  return { heading: found.heading, body: found.body, weight: found.weight };
}

export const ACCENT_PRESETS = [
  '#FF4D00',
  '#FF00E5',
  '#FFB61E',
  '#7A5CFF',
  '#FF1A1A',
  '#2D4A22',
  '#C80000',
  '#FF6B2B',
  '#00FF88',
  '#8B9BFF',
];

export const BUTTON_OPTIONS = [
  { id: 'pill', name: 'Capsule', desc: 'Signature visionOS' },
  { id: 'soft', name: 'Doux', desc: 'Coins légèrement arrondis' },
  { id: 'square', name: 'Franc', desc: 'Angles nets, affirmé' },
];

export const SHAPE_OPTIONS = [
  { id: 'soft', name: 'Continue', desc: 'Courbure visionOS' },
  { id: 'sharp', name: 'Franche', desc: 'Angles nets' },
  { id: 'round', name: 'Généreuse', desc: 'Très enveloppante' },
];

export const LAYOUT_OPTIONS = [
  { id: 'minimal', name: 'Minimal', desc: 'Air et simplicité' },
  { id: 'magazine', name: 'Magazine', desc: 'Grilles éditoriales' },
  { id: 'immersif', name: 'Immersif', desc: 'Images plein écran' },
  { id: 'galerie', name: 'Galerie', desc: 'La photo avant tout' },
];

export const ANIMATION_OPTIONS = [
  { id: 'calme', name: 'Calme', desc: 'Transitions discrètes' },
  { id: 'fluide', name: 'Fluide', desc: 'L’équilibre parfait' },
  { id: 'spectaculaire', name: 'Spectaculaire', desc: 'Révélations amples' },
];

export const MEDIA_CATEGORIES = [
  'Couple', 'Alliances', 'Cérémonie', 'Bouquet', 'Table', 'Décoration',
  'Château', 'Nature', 'Danse', 'Champagne', 'Textures',
  'Béton', 'Club', 'Desert', 'Cosmic', 'Punk', 'Forêt', 'Cinéma', 'Brocante', 'Supermarché', 'Laverie',
];

export const MEDIA_COLLECTIONS = [
  'Béton Brut', 'Club Amour', 'Desert Motel', 'Cosmic',
  'Punk Papier', 'Forêt Noire', 'Cinéma', 'Brocante Club',
  'Supermarché 22h', 'Laverie Club',
];

export const PHASES = [
  { id: 'avant', name: 'Avant', desc: 'RSVP, organisation, programme' },
  { id: 'pendant', name: 'Pendant', desc: 'Jour J, itinéraires, contacts' },
  { id: 'apres', name: 'Après', desc: 'Photos, souvenirs, remerciements' },
];

export function buttonRadius(buttonStyle: string): string {
  if (buttonStyle === 'square') return '6px';
  if (buttonStyle === 'soft') return '14px';
  return '999px';
}

export function cardRadius(shape: string): string {
  if (shape === 'sharp') return '4px';
  if (shape === 'round') return '34px';
  return '22px';
}

export function envVars(theme: WeddingStyle, accent: string): Record<string, string> {
  return { '--vp-accent': accent || theme.accent };
}
