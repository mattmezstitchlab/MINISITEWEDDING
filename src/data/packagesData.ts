export interface PackageData {
  id:
    | 'fugace'
    | 'brut-epure'
    | 'irreverence'
    | 'nocturne-volcan'
    | 'anomalie'
    | 'ciel-oublie'
    | 'solstice-hiver'
    | 'theatre-mirage'
    | 'desordre'
    | 'nomade-horizon'
    | 'archipel-secret'
    | 'orbite';
  number: string;
  name: string;
  agencySubtitle: string;
  tagline: string;
  description: string;
  priceFrom: string;
  priceRaw: number;
  heroImage: string;
  category: 'Coordination & Elopement' | 'Design & Scénographie' | 'Organisation Globale' | 'Haute Couture & Immersion';
  duration: string;
  guestCount: string;
  colors: { name: string; hex: string; desc: string }[];
  typography: {
    titles: string;
    body: string;
    notes: string;
  };
  features: string[];
  deliverables: string[];
  aiPrompt: string;
}

export const PACKAGES_DATA: PackageData[] = [
  {
    id: 'fugace',
    number: '01',
    name: 'Fugace Studio',
    agencySubtitle: 'Coordination Jour J & Live Content',
    tagline: 'L’urgence de l’instant, captation spontanée, zéro filtre.',
    description: 'Une scénographie minimaliste et percutante pensée pour une cadence horlogère. Flash direct, typographie brute neo-grotesque, flux en direct style Stories/TikTok avec rushs 4K livrés sous 24h, et Capsule Temporelle participative pour uploader les fichiers bruts sans compression avant le verrouillage.',
    priceFrom: '2 800 €',
    priceRaw: 2800,
    heroImage: '/images/packages/fugace.jpg',
    category: 'Coordination & Elopement',
    duration: 'Jour J (14h de présence)',
    guestCount: '30 à 150 convives',
    colors: [
      { name: 'Noir Carbone', hex: '#0B0B0C', desc: 'Fond principal & contrastes' },
      { name: 'Blanc Pur', hex: '#FFFFFF', desc: 'Textes & typographie flash' },
      { name: 'Gris Métal', hex: '#71717A', desc: 'Bordures architecturales & repères' },
    ],
    typography: {
      titles: 'Syne / JetBrains Mono (Brutalist Modern)',
      body: 'Plus Jakarta Sans (Ultra lisible)',
      notes: 'Monospace horloger pour les horaires et le rétroplanning',
    },
    features: [
      'Live Content Feed (Stories/TikTok 24h en continu)',
      'Capsule temporelle participative avec QR Code pour upload RAW sans perte',
      'Compte à rebours dynamique avant verrouillage de la capsule',
      'Rétroplanning minute par minute et RSVP express en 2 clics',
    ],
    deliverables: ['Feuille de route horlogère', '1 Content Creator dédié', 'Disque d’or des rushs 4K'],
    aiPrompt: 'Editorial photography of a modern chic bride and groom at dusk on an architectural rooftop in Paris, flash direct photography, high contrast black and white cinematic grain, 35mm film style, minimal sleek dress, aesthetic candid luxury, 16:9 aspect ratio',
  },
  {
    id: 'brut-epure',
    number: '02',
    name: 'Brut & Épure',
    agencySubtitle: 'Elopement Sauvage & Intimité Minérale',
    tagline: 'L’épure absolue de deux âmes face à l’immensité de la terre.',
    description: 'Une célébration intime pensée comme une communion brute avec les éléments. Tons pierre, beige désertique et vert sauge, mise en valeur de la roche vivante, carte interactive du lieu secret et récit poétique de la cérémonie.',
    priceFrom: '3 600 €',
    priceRaw: 3600,
    heroImage: '/images/packages/brut-epure.jpg',
    category: 'Coordination & Elopement',
    duration: '1 Journée d’Évasion',
    guestCount: '2 à 20 convives',
    colors: [
      { name: 'Pierre Vivante', hex: '#E5E0D8', desc: 'Fond minéral calcaire' },
      { name: 'Vert Sauge Fumé', hex: '#606C5D', desc: 'Accents botaniques sauvages' },
      { name: 'Terre d’Ombre', hex: '#2C2B29', desc: 'Typographie contrastée' },
    ],
    typography: {
      titles: 'Cormorant Garamond / DM Sans',
      body: 'Plus Jakarta Sans',
      notes: 'Élégance minérale, aération maximale',
    },
    features: [
      'Carte interactive topographique du lieu secret d’Elopement',
      'Récit poétique de la cérémonie intime et serments personnalisés',
      'Carnet géologique & botanique de la faune locale',
      'Mini-site intime avec streaming privé haute définition pour les proches distants',
    ],
    deliverables: ['Scénographie nomade sur site', 'Rituel intime sur-mesure', 'Livre d’art relié cuir'],
    aiPrompt: 'Cinematic editorial photography of an intimate wild elopement on windswept volcanic cliff coast, minimalistic styling, earthy stone tones, sage green botanicals, sheer raw silk dress, organic pure luxury, atmospheric mist, Vogue editorial, 16:9 aspect ratio',
  },
  {
    id: 'irreverence',
    number: '03',
    name: 'Irrévérence',
    agencySubtitle: 'Direction Artistique & Scénographie Subversive',
    tagline: 'Chic sans protocole, mode subversive, éditorial affûté.',
    description: 'Un mini-site haute tension créative qui fait sensation. Chrome poli, rouge carmin vibrant, guide de style éditorial interactif avec nuancier imposé, lookbook de silhouettes et service Conciergerie Style pour faire valider sa tenue par la Direction Artistique.',
    priceFrom: '4 500 €',
    priceRaw: 4500,
    heroImage: '/images/packages/irreverence.jpg',
    category: 'Design & Scénographie',
    duration: 'Scénographie & Soirée',
    guestCount: '50 à 200 convives',
    colors: [
      { name: 'Rouge Carmin', hex: '#E11D48', desc: 'Accent vibrant & provocation chic' },
      { name: 'Fond Sombre Chrome', hex: '#0F0F11', desc: 'Écrin moderne nocturne' },
      { name: 'Argent & Chrome', hex: '#E4E4E7', desc: 'Reflets et bordures métalliques' },
    ],
    typography: {
      titles: 'Italiana & Syne (Chic Acéré Fashion)',
      body: 'Plus Jakarta Sans (Moderne et fluide)',
      notes: 'Titres condensés et lettrage haute couture',
    },
    features: [
      'Lookbook / Dress-code interactif avec nuancier strict imposé',
      'Service Conciergerie Style : validation des tenues des invités par la DA',
      'Lecteur audio playlist avant-gardiste intégrée',
      'RSVP stylisé avec sélection des cocktails de nuit',
    ],
    deliverables: ['Direction artistique globale', 'Design scénographique 3D', 'Coordination stylisme invités'],
    aiPrompt: 'Avant-garde luxury wedding couple in a brutalist concrete gallery in Berlin, dramatic architectural lighting, silver chrome accents, vibrant strawberry red floral installations, chic edgy aesthetic, high fashion editorial, vogue style, 16:9 aspect ratio',
  },
  {
    id: 'nocturne-volcan',
    number: '04',
    name: 'Nocturne & Volcan',
    agencySubtitle: 'Party Focus, Nuit Sauvage & Scénographie Sonore',
    tagline: 'Quand la fête devient une transe élégante sous les néons.',
    description: 'Une immersion dans la nuit contemporaine. Néo-brutaliste sombre, violet profond, néons tamisés et noir mat. Lecteur audio de la curation DJ, carte des cocktails de mixologie et timeline immersive de l’after-party.',
    priceFrom: '5 200 €',
    priceRaw: 5200,
    heroImage: '/images/packages/nocturne-volcan.jpg',
    category: 'Design & Scénographie',
    duration: 'Nuit & After (18h — 07h)',
    guestCount: '80 à 300 convives',
    colors: [
      { name: 'Violet Profond', hex: '#581C87', desc: 'Atmosphère néon club' },
      { name: 'Noir Lave', hex: '#09080D', desc: 'Minéral brut nocturne' },
      { name: 'Ambre Incandescent', hex: '#F59E0B', desc: 'Lueur de braise & cocktails' },
    ],
    typography: {
      titles: 'Syne & JetBrains Mono',
      body: 'Plus Jakarta Sans',
      notes: 'Esthétique club underground de luxe',
    },
    features: [
      'Lecteur audio immersif de la curation DJ exclusive',
      'Carte interactive des cocktails de mixologie moléculaire',
      'Timeline dynamique de l’after-party jusqu’à l’aube',
      'Gestion des navettes de nuit et consigne vestiaire VIP',
    ],
    deliverables: ['Scénographie lumière & néons', 'Bar mixologie sur-mesure', 'DJ set curation exclusive'],
    aiPrompt: 'High-end night wedding after-party in a brutalist lava stone venue, deep violet ambient light, moody neon glows, sleek black matte cocktail bar, stylish party guests dancing in chic evening wear, dramatic cinematic lighting, 16:9 aspect ratio',
  },
  {
    id: 'anomalie',
    number: '05',
    name: 'Maison Anomalie',
    agencySubtitle: 'Organisation Partielle & Surréalisme Poétique',
    tagline: 'Le surréalisme poétique au service de votre imaginaire.',
    description: 'Une parenthèse onirique et enchantée. Signature sonore exclusive avec lecteur audio interactif et visualiseur d’ondes, carnet de voyage olfactif détaillant les 3 strates du parfum de scénographie du mariage, et carte des lieux secrets autour du château.',
    priceFrom: '6 500 €',
    priceRaw: 6500,
    heroImage: '/images/packages/anomalie.jpg',
    category: 'Design & Scénographie',
    duration: 'Jour J & Scénographie complète',
    guestCount: '60 à 180 convives',
    colors: [
      { name: 'Bleu Ciel Pastel', hex: '#38BDF8', desc: 'Ciel onirique et légèreté' },
      { name: 'Rose Poudré Vaporeux', hex: '#F472B6', desc: 'Poésie florale surréaliste' },
      { name: 'Ivoire Crème', hex: '#0C1222', desc: 'Nuit bleutée d’été profonde' },
    ],
    typography: {
      titles: 'Playfair Display / Cormorant Garamond',
      body: 'Plus Jakarta Sans',
      notes: 'Italiques d’auteur pour le conte des mariés',
    },
    features: [
      'Lecteur audio floating (signature sonore du mariage)',
      'Questionnaire invités poétique avec dons invisibles',
      'Carnet olfactif de scénographie en 3 strates',
      'Carte interactive des lieux secrets autour de la cérémonie',
    ],
    deliverables: ['Mise en scène verrière/château', 'Signature olfactive diffusée', 'Régie jour J'],
    aiPrompt: 'Surrealistic poetic wedding celebration in a whimsical French chateau glasshouse garden, pastel sky blue and blush pink roses, floating golden crystal mirrors, dreamlike ethereal lighting, romantic magical editorial, Annie Leibovitz mood, 16:9 aspect ratio',
  },
  {
    id: 'ciel-oublie',
    number: '06',
    name: 'Ciel Oublié',
    agencySubtitle: 'Éco-Luxe & Sourcing Botanique Pur',
    tagline: 'L’harmonie contemporaine du luxe conscient et régénératif.',
    description: 'Une célébration qui honore la nature sans aucun compromis esthétique. Botanique contemporain, vert forêt profond, texture papier recyclé, compteur d’empreinte carbone neutre et charte éco-responsable intégrée.',
    priceFrom: '7 400 €',
    priceRaw: 7400,
    heroImage: '/images/packages/ciel-oublie.jpg',
    category: 'Organisation Globale',
    duration: 'Journée & Soirée Régénérative',
    guestCount: '40 à 140 convives',
    colors: [
      { name: 'Vert Forêt Sauvage', hex: '#1C3F2D', desc: 'Végétation locale et ombrages' },
      { name: 'Papier Chiffon', hex: '#F3EFE6', desc: 'Textures naturelles et lin brut' },
      { name: 'Argile Douce', hex: '#A3704C', desc: 'Terre cuite et poteries' },
    ],
    typography: {
      titles: 'Cinzel Decorative / DM Sans',
      body: 'Plus Jakarta Sans',
      notes: 'Éditorial épuré et respectueux du vivant',
    },
    features: [
      'Compteur d’empreinte carbone interactif compensée à 100%',
      'Charte éco-responsable (revalorisation florale, traiteur zéro km, zéro plastique)',
      'Menu végétal gastronomique et fiches producteurs locaux',
      'RSVP avec proposition de covoiturage et train privilégié',
    ],
    deliverables: ['Bilan carbone certifié', 'Scénographie 100% fleurs de saison locales', 'Dons écologiques reversés'],
    aiPrompt: 'Contemporary botanical eco-luxury greenhouse wedding dinner, reclaimed raw timber tables, lush wild forest greenery, natural stone architecture, recycled paper menu cards, soft filtered natural morning sunlight, refined architectural elegance, 16:9 aspect ratio',
  },
  {
    id: 'solstice-hiver',
    number: '07',
    name: 'Solstice d’Hiver',
    agencySubtitle: 'Mariage Hors-Saison & Warm Luxury Cosy',
    tagline: 'La chaleur des flammes dans la pureté de la saison blanche.',
    description: 'Le charme envoûtant du grand froid sublimé par le grand luxe réconfortant. Bordeaux riche, ambre, velours, calligraphie moderne, guide des animations intérieures cosy (bar à vins rares, feu de bois) et planning adapté à la lumière dorée d’hiver.',
    priceFrom: '7 900 €',
    priceRaw: 7900,
    heroImage: '/images/packages/solstice-hiver.jpg',
    category: 'Design & Scénographie',
    duration: 'Journée d’Hiver & Nuit de Fête',
    guestCount: '50 à 160 convives',
    colors: [
      { name: 'Bordeaux Velours', hex: '#58111A', desc: 'Chaleur opulente d’hiver' },
      { name: 'Ambre Doré', hex: '#D97706', desc: 'Flammes de cheminée' },
      { name: 'Ivoire Neige', hex: '#FAF7F2', desc: 'Pureté des paysages d’hiver' },
    ],
    typography: {
      titles: 'Playfair Display / Bodoni Moda',
      body: 'Plus Jakarta Sans',
      notes: 'Calligraphie feutrée et chaleureuse',
    },
    features: [
      'Guide des animations intérieures cosy (bar à vins rares, feu de cheminée, chocolat grand cru)',
      'Planning lumière d’hiver adapté à la clarté courte (Golden hour 15h30)',
      'Guide vestimentaire grand froid chic (étoles en cachemire, velours)',
      'Module météo hivernale et itinéraires déneigés en temps réel',
    ],
    deliverables: ['Scénographie 1000 bougies', 'Salon cigar & whisky rare', 'Vestiaire chauffé avec étoles'],
    aiPrompt: 'Warm luxury winter wedding inside an ancient stone lodge with glowing roaring fireplace, rich burgundy velvet drapes, warm amber candle flames, snowy pines outside panoramic glass windows, intimate modern calligraphy setting, 16:9 aspect ratio',
  },
  {
    id: 'theatre-mirage',
    number: '08',
    name: 'Théâtre & Mirage',
    agencySubtitle: 'Art Spacieux, Scène Vivante & Performers',
    tagline: 'L’émotion d’une pièce de théâtre où chaque invité devient spectateur privilégié.',
    description: 'Une célébration spectaculaire mêlant arts vivants, scénographie en miroir et performances impromptues. Noir profond, or brossé, typographies à empattements, galerie vidéo des artistes et fiches des installations 3D vivantes.',
    priceFrom: '8 900 €',
    priceRaw: 8900,
    heroImage: '/images/packages/theatre-mirage.jpg',
    category: 'Design & Scénographie',
    duration: 'Création Événementielle 24h',
    guestCount: '70 à 250 convives',
    colors: [
      { name: 'Noir Scénique', hex: '#0B0A0E', desc: 'Fond obscur de salle d’opéra' },
      { name: 'Or Brossé Impérial', hex: '#D4AF37', desc: 'Dorures théâtrales et miroirs' },
      { name: 'Rouge Écarlate', hex: '#991B1B', desc: 'Rideaux de scène & rideau de fer' },
    ],
    typography: {
      titles: 'Cinzel / Italiana',
      body: 'Plus Jakarta Sans',
      notes: 'Mise en scène dramaturgique',
    },
    features: [
      'Galerie vidéo des artistes et performers (acrobates, chanteurs lyriques, danseurs contemporains)',
      'Fiches interactives des installations 3D et miroirs vivants',
      'Programme de la représentation découpé en actes',
      'Plan de la salle et attribution des loges privées',
    ],
    deliverables: ['Régie technique son & lumière de théâtre', 'Casting des 8 artistes', 'Scénographie des miroirs'],
    aiPrompt: 'Dramatic theatrical wedding banquet inside a mirrored baroque art gallery, acrobatic performers suspended in air, deep black and brushed gold sculptural installations, avant-garde couture gown, opera house atmosphere, 16:9 aspect ratio',
  },
  {
    id: 'desordre',
    number: '09',
    name: 'Maison Désordre',
    agencySubtitle: 'Organisation Complète 2 Jours & Haute Architecture',
    tagline: 'Haute architecture du chaos, maîtrise logistique, effervescence maîtrisée.',
    description: 'La grande sculpture de l’événement sur deux jours ininterrompus (Grand Festin & Bal Vénitien // Recovery Brunch & Régate). Programme filtrable par événement et module de conciergerie à 3 étapes : réservation des canots Riva, des palais partenaires et personnalisation gastronomique du banquet 7 services.',
    priceFrom: '9 800 €',
    priceRaw: 9800,
    heroImage: '/images/packages/desordre.jpg',
    category: 'Organisation Globale',
    duration: 'Multi-Day 2 Jours (Jour J & Recovery)',
    guestCount: '80 à 220 convives',
    colors: [
      { name: 'Anthracite Palazzo', hex: '#18181B', desc: 'Fond minéral profond' },
      { name: 'Bordeaux Velours', hex: '#6B121C', desc: 'Teinte dionysiaque & banquet' },
      { name: 'Or Vénitien', hex: '#C5A059', desc: 'Lustres de Murano et dorures' },
    ],
    typography: {
      titles: 'Cinzel / Bodoni Moda',
      body: 'Plus Jakarta Sans',
      notes: 'Capitales romaines patriciennes et chiffres classiques',
    },
    features: [
      'Navigation Multi-day 2 jours (Jour J & Recovery Brunch)',
      'Conciergerie logistique interactive (bateaux-taxis, hébergements)',
      'RSVP gastronomique 7 services & sélection des accords',
      'Guide du lieu et suivi personnalisé des invités',
    ],
    deliverables: ['Organisation de A à Z sur 2 jours', 'Coordination de 25 prestataires', 'Conciergerie dédiée'],
    aiPrompt: 'Opulent modern baroque wedding banquet in a grand Venetian palazzo, 60-meter candlelit banquet table covered with dark red velvet, oversized cascading floral sculptures, crystalline Murano chandeliers, glamorous guests, dark romantic drama, Paolo Sorrentino aesthetic, 16:9 aspect ratio',
  },
  {
    id: 'nomade-horizon',
    number: '10',
    name: 'Nomade & Horizon',
    agencySubtitle: 'Destination Wedding Europe (Méditerranée ou Alpes)',
    tagline: 'L’art du voyage partagé sous le soleil ou les cimes d’Europe.',
    description: 'Une parenthèse dépaysante pour emmener vos proches au bout du monde. Solaire méditerranéen ou chic alpin, terracotta, blanc azur, visuels grand angle. Travel Guide complet (vols, hébergements, transferts) et carte d’exploration locale avec carnet d’adresses secrètes.',
    priceFrom: '11 500 €',
    priceRaw: 11500,
    heroImage: '/images/packages/nomade-horizon.jpg',
    category: 'Organisation Globale',
    duration: '3 Jours / Destination Wedding',
    guestCount: '40 à 120 convives',
    colors: [
      { name: 'Terracotta Solaire', hex: '#C2593F', desc: 'Terre cuite méditerranéenne' },
      { name: 'Blanc Azur Calcaire', hex: '#FAF9F6', desc: 'Lumière éclatante des falaises' },
      { name: 'Bleu Mer Lointaine', hex: '#0F3A5D', desc: 'Profondeur marine' },
    ],
    typography: {
      titles: 'Italiana / DM Sans',
      body: 'Plus Jakarta Sans',
      notes: 'Légèreté solaire et chic nomade',
    },
    features: [
      'Travel Guide complet pour les invités (vols conseillés, hébergements, transferts)',
      'Carte d’exploration locale des calanques et adresses secrètes',
      'Programme sur 3 jours (Welcome Paëlla/Aperitivo, Jour J, Beach Club Brunch)',
      'Service conciergerie bagages et liaisons privées',
    ],
    deliverables: ['Coordination logistique internationale', 'Régisseurs bilingues sur place', 'Carnet de voyage physique'],
    aiPrompt: 'Mediterranean chic destination wedding on a sun-drenched clifftop in Mallorca, panoramic azure sea view, terracotta pottery, warm limestone colonnade, minimalist white linen tablecloth, sunlit effortless luxury, 16:9 aspect ratio',
  },
  {
    id: 'archipel-secret',
    number: '11',
    name: 'Archipel Secret',
    agencySubtitle: 'Lieux Inédits, Espaces Éphémères & Pop-Up Architecture',
    tagline: 'Bâtir un palais éphémère là où nul ne s’était jamais marié.',
    description: 'Pour ceux qui refusent les lieux traditionnels. Industrial-chic, structures brutes, béton poli, acier brossé et compositions florales sculpturales. Plan 3D des zones éphémères aménagées (verrière démontable, sanitaires de luxe, cuisine autonome) et consignes d’accès sécurisées.',
    priceFrom: '13 000 €',
    priceRaw: 13000,
    heroImage: '/images/packages/archipel-secret.jpg',
    category: 'Haute Couture & Immersion',
    duration: 'Création architecturale éphémère',
    guestCount: '60 à 200 convives',
    colors: [
      { name: 'Acier Galvanisé', hex: '#64748B', desc: 'Structure architecturale contemporaine' },
      { name: 'Béton Brut', hex: '#27272A', desc: 'Minéralité industrielle' },
      { name: 'Ocre Flamboyant', hex: '#D97706', desc: 'Contraste floral architectural' },
    ],
    typography: {
      titles: 'Syne / JetBrains Mono',
      body: 'Plus Jakarta Sans',
      notes: 'Architecture pure et rigueur technique',
    },
    features: [
      'Plan 3D & schéma technique des zones éphémères aménagées de toutes pièces',
      'Consignes d’accès sécurisées et coordonnées GPS secrètes',
      'Audit logistique complet (autonomie énergétique, eau, tentes de verre)',
      'RSVP avec badge d’accès individuel inviolable',
    ],
    deliverables: ['Permis et conformités réglementaires', 'Montage architectural complet', 'Génie technique autonome'],
    aiPrompt: 'Industrial chic architectural wedding setup on a secluded private island dock, polished raw concrete and brushed steel structures, sculptural tropical floral installations, dramatic sunset over water, editorial luxury, 16:9 aspect ratio',
  },
  {
    id: 'orbite',
    number: '12',
    name: 'Orbite & Incartade',
    agencySubtitle: 'Haute Couture, Immersif & Multi-Day 3+ Jours',
    tagline: 'L’apogée de l’architecture d’expérience confidentielle.',
    description: 'Le sommet de l’expérience personnalisée confidentielle. Dark mode VIP ultra-exclusif, glassmorphism, or brossé, animations au scroll. Portail d’accès sécurisé par Pass VIP / Code secret, planning immersif 3 à 4 jours et spatial design 3D interactif des zones privatisées.',
    priceFrom: 'Dès 16 000 €',
    priceRaw: 16000,
    heroImage: '/images/packages/orbite.jpg',
    category: 'Haute Couture & Immersion',
    duration: '3 à 4 Jours Privatisés',
    guestCount: '50 à 150 convives VIP',
    colors: [
      { name: 'Noir Absolu', hex: '#000000', desc: 'Profondeur de la nuit et mystère' },
      { name: 'Or Astral', hex: '#C5A059', desc: 'Anneaux et lueurs de cierges' },
      { name: 'Gris Brume', hex: '#A1A1AA', desc: 'Subtilité et élégance feutrée' },
    ],
    typography: {
      titles: 'Cormorant Garamond / Cinzel',
      body: 'Plus Jakarta Sans',
      notes: 'Composition théâtrale en trois actes romains',
    },
    features: [
      'Portail d’accès sécurisé par Pass VIP / Code unique par invité',
      'Planning immersif sur 4 jours (Welcome Dinner, Main Event, Pool Party, After)',
      'Aperçu 3D / Plan spatial interactif des zones privatisées',
      'Conciergerie VIP dédiée avec berlines privées et fitting couture',
    ],
    deliverables: ['Scénarisation intégrale en 4 actes', 'Régie VIP 24h/24', 'Livre d’art relié à la feuille d’or'],
    aiPrompt: 'Monumental haute couture night wedding ceremony inside an ancient Roman amphitheater in southern France, 2000 tall beeswax church candles, mystical atmospheric fog, dramatic moonlit shadows, mysterious aristocratic elegance, black tie and ethereal bridal couture, cinematic lighting, 16:9 aspect ratio',
  },
];
