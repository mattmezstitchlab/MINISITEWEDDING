export interface PackageData {
  id: 'fugace' | 'irreverence' | 'anomalie' | 'desordre' | 'orbite';
  number: string;
  name: string;
  agencySubtitle: string;
  tagline: string;
  description: string;
  priceFrom: string;
  heroImage: string;
  colors: { name: string; hex: string; desc: string }[];
  typography: {
    titles: string;
    body: string;
    notes: string;
  };
  features: string[];
  aiPrompt: string;
}

export const PACKAGES_DATA: PackageData[] = [
  {
    id: 'fugace',
    number: '01',
    name: 'Fugace Studio',
    agencySubtitle: 'Coordination Jour J & Live Content Backstage',
    tagline: 'L’urgence de l’instant, captation spontanée, zéro filtre.',
    description: 'Une scénographie minimaliste et percutante pensée pour une cadence horlogère. Flash direct, typographie brute neo-grotesque, flux en direct style Stories/TikTok avec rushs 4K livrés sous 24h, et Capsule Temporelle participative pour uploader les fichiers bruts sans compression avant le verrouillage irréversible.',
    priceFrom: '3 500 €',
    heroImage: '/images/packages/fugace.jpg',
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
      'Nouveau module Live Content : flux Stories 9:16 capturé par le Wedding Content Creator',
      'Capsule Temporelle participative avec QR code & dropzone RAW/HEIC sans perte',
      'Compte à rebours dynamique avant verrouillage définitif de la capsule',
      'Rétroplanning Jour J minute par minute et RSVP express en 2 clics',
    ],
    aiPrompt: 'Editorial photography of a modern chic bride and groom at dusk on an architectural rooftop in Paris, flash direct photography, high contrast black and white cinematic grain, 35mm film style, minimal sleek dress, aesthetic candid luxury, 16:9 aspect ratio',
  },
  {
    id: 'irreverence',
    number: '02',
    name: 'Irrévérence',
    agencySubtitle: 'Direction Artistique & Guest Styling Subversif',
    tagline: 'Chic sans protocole, mode subversive, éditorial affûté.',
    description: 'Un mini-site haute tension créative qui fait sensation. Chrome poli, rouge carmin vibrant, guide de style éditorial interactif avec nuancier imposé (couleurs encouragées vs proscrites), lookbook de silhouettes et service Conciergerie Style pour faire valider sa tenue par la Direction Artistique.',
    priceFrom: '6 800 €',
    heroImage: '/images/packages/irreverence.jpg',
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
      'Guide de style éditorial avec nuancier imposé (Couleurs autorisées vs formellement interdites)',
      'Lookbook interactif filtrable (Femme, Homme, Accessoires phares)',
      'Service Conciergerie Style : formulaire de validation de tenue par la DA',
      'Lecteur audio playlist et RSVP stylisé avec cocktail signature',
    ],
    aiPrompt: 'Avant-garde luxury wedding couple in a brutalist concrete gallery in Berlin, dramatic architectural lighting, silver chrome accents, vibrant strawberry red floral installations, chic edgy aesthetic, high fashion editorial, vogue style, 16:9 aspect ratio',
  },
  {
    id: 'anomalie',
    number: '03',
    name: 'Maison Anomalie',
    agencySubtitle: 'Design Sensoriel, Scénographie Immersive & Audio',
    tagline: 'Surréalisme poétique, expérience olfactive et sonore, immersion visuelle.',
    description: 'Une parenthèse onirique et enchantée. Signature sonore exclusive avec lecteur audio interactif et visualiseur d’ondes, carnet de voyage olfactif détaillant les 3 strates du parfum de scénographie du mariage, et carte des lieux secrets autour du château.',
    priceFrom: '8 500 €',
    heroImage: '/images/packages/anomalie.jpg',
    colors: [
      { name: 'Bleu Ciel Pastel', hex: '#38BDF8', desc: 'Ciel onirique et légèreté' },
      { name: 'Rose Poudré Vaporeux', hex: '#F472B6', desc: 'Poésie florale surréaliste' },
      { name: 'Ivoire Crème', hex: '#0C1222', desc: 'Nuit bleutée d’été profonde' },
    ],
    typography: {
      titles: 'Playfair Display / Cormorant Garamond (Poétique & Délicat)',
      body: 'Plus Jakarta Sans (Harmonie contemporaine)',
      notes: 'Italiques d’auteur pour le conte des mariés',
    },
    features: [
      'Lecteur audio personnalisé & signature sonore avec visualiseur de fréquences réactif',
      'Carnet olfactif de scénographie (Notes de tête, cœur et fond du parfum sur-mesure)',
      'Carte interactive poétique des lieux secrets avec anecdotes oniriques',
      'Conte décalé en trois fragments et RSVP sortilège dans le livre d’or',
    ],
    aiPrompt: 'Surrealistic poetic wedding celebration in a whimsical French chateau glasshouse garden, pastel sky blue and blush pink roses, floating golden crystal mirrors, dreamlike ethereal lighting, romantic magical editorial, Annie Leibovitz mood, 16:9 aspect ratio',
  },
  {
    id: 'desordre',
    number: '04',
    name: 'Maison Désordre',
    agencySubtitle: 'Architecture Globale, Multi-Day 2 Jours & Conciergerie Invités',
    tagline: 'Haute architecture du chaos, maîtrise logistique, effervescence maîtrisée.',
    description: 'La grande sculpture de l’événement sur deux jours ininterrompus (Grand Festin & Bal Vénitien // Recovery Brunch & Régate). Programme filtrable par événement et module de conciergerie à 3 étapes : réservation des canots Riva, des palais partenaires et personnalisation gastronomique du banquet 7 services.',
    priceFrom: '14 000 €',
    heroImage: '/images/packages/desordre.jpg',
    colors: [
      { name: 'Anthracite Palazzo', hex: '#18181B', desc: 'Fond minéral profond' },
      { name: 'Bordeaux Velours', hex: '#6B121C', desc: 'Teinte dionysiaque & banquet' },
      { name: 'Or Vénitien', hex: '#C5A059', desc: 'Lustres de Murano et dorures' },
    ],
    typography: {
      titles: 'Cinzel / Bodoni Moda (Impériale & Baroque)',
      body: 'Plus Jakarta Sans (Lisibilité noble)',
      notes: 'Capitales romaines patriciennes et chiffres classiques',
    },
    features: [
      'Gestion du programme sur 2 jours (Jour 1 Festin & Bal / Jour 2 Recovery Brunch & Régate)',
      'Filtres interactifs par catégorie d’événement (Cérémonie, Banquet, Fête, Détente)',
      'Conciergerie interactive à 3 étapes (Canots Riva privés, Palais partenaires, Festin 7 services)',
      'Génération d’un récapitulatif de dossier conciergerie VIP avec numéro de référence',
    ],
    aiPrompt: 'Opulent modern baroque wedding banquet in a grand Venetian palazzo, 60-meter candlelit banquet table covered with dark red velvet, oversized cascading floral sculptures, crystalline Murano chandeliers, glamorous guests, dark romantic drama, Paolo Sorrentino aesthetic, 16:9 aspect ratio',
  },
  {
    id: 'orbite',
    number: '05',
    name: 'Orbite & Incartade',
    agencySubtitle: 'Haute Couture, Immersif & Multi-Day 3+ Jours (Spatial Design 3D)',
    tagline: 'Expérience confidentielle VIP, club privé, scénarisation théâtrale.',
    description: 'Le sommet de l’expérience confidentielle. Accès sécurisé par code secret déverrouillant un VIP Pass glassmorphic nominatif, planning immersif sur 4 jours et plan spatial interactif des zones privatisées (Amphithéâtre antique, Crypte clubbing, Thermes et Héliport).',
    priceFrom: '22 000 €',
    heroImage: '/images/packages/orbite.jpg',
    colors: [
      { name: 'Noir Absolu', hex: '#000000', desc: 'Profondeur de la nuit et mystère' },
      { name: 'Or Astral', hex: '#C5A059', desc: 'Anneaux et lueurs de cierges' },
      { name: 'Gris Brume', hex: '#A1A1AA', desc: 'Subtilité et élégance feutrée' },
    ],
    typography: {
      titles: 'Cormorant Garamond / Cinzel (Haute Couture Mystique)',
      body: 'Plus Jakarta Sans (Ultra-raffinée)',
      notes: 'Composition théâtrale en trois actes romains',
    },
    features: [
      'Accès VIP sécurisé par code secret débloquant le Pass Nominatif Glassmorphic crypté',
      'Planning immersif détaillé sur 4 jours (Welcome Dinner, Main Event, Pool Party, After)',
      'Plan spatial interactif des zones privatisées avec protocoles d’accès par secteur',
      'Scénographie nocturne monumentale dans les arènes antiques et service conciergerie 24h/24',
    ],
    aiPrompt: 'Monumental haute couture night wedding ceremony inside an ancient Roman amphitheater in southern France, 2000 tall beeswax church candles, mystical atmospheric fog, dramatic moonlit shadows, mysterious aristocratic elegance, black tie and ethereal bridal couture, cinematic lighting, 16:9 aspect ratio',
  },
];
