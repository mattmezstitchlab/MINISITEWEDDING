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
    agencySubtitle: 'Coordination Jour J & Logistique Horlogère',
    tagline: 'L’élégance de la précision brute, sans superflu.',
    description: 'Une scénographie minimaliste et percutante pensée pour une journée millimétrée. Flash direct, typographie brute neo-grotesque, rétroplanning minute par minute et RSVP express en 2 clics.',
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
      'Rétroplanning minute par minute en direct',
      'Carte d’accès & points de repère instantanés',
      'RSVP express en 2 clics avec bouton interactif',
      'Design épuré noir & blanc photo-journalisme flash direct',
    ],
    aiPrompt: 'Editorial photography of a modern chic bride and groom at dusk on an architectural rooftop in Paris, flash direct photography, high contrast black and white cinematic grain, 35mm film style, minimal sleek dress, aesthetic candid luxury, 16:9 aspect ratio',
  },
  {
    id: 'irreverence',
    number: '02',
    name: 'Irrévérence',
    agencySubtitle: 'Direction Artistique & Scénographie Subversive',
    tagline: 'L’art du chic affûté qui bouscule les codes bourgeois.',
    description: 'Un mini-site haute tension créative qui fait sensation. Chrome poli, rouge carmin vibrant, moodboard de style pour les invités, playlist audio immersive et formulaire RSVP décomplexé.',
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
      'Dress code subversif détaillé (Interdictions & Inspirations)',
      'Moodboard visuel interactif pour les invités',
      'Lecteur audio playlist & ambiance sonore du mariage',
      'RSVP stylisé avec sélection de cocktails signature',
    ],
    aiPrompt: 'Avant-garde luxury wedding couple in a brutalist concrete gallery in Berlin, dramatic architectural lighting, silver chrome accents, vibrant strawberry red floral installations, chic edgy aesthetic, high fashion editorial, vogue style, 16:9 aspect ratio',
  },
  {
    id: 'anomalie',
    number: '03',
    name: 'Maison Anomalie',
    agencySubtitle: 'Organisation Partielle & Scénographie Poétique',
    tagline: 'Le surréalisme délicat au service de votre imaginaire.',
    description: 'Une parenthèse onirique et enchantée. Conte décalé des mariés rédigé comme une fable contemporaine, hébergements insolites géolocalisés et RSVP aux questions surréalistes.',
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
      'Conte décalé et poétique sur la rencontre du couple',
      'Guide des hébergements insolites (Cabanes, dômes étoilés)',
      'RSVP surréaliste (Choix de dons de fées et sortilèges)',
      'Palette vaporeuse bleu ciel, rose poudré et or stellaire',
    ],
    aiPrompt: 'Surrealistic poetic wedding celebration in a whimsical French chateau glasshouse garden, pastel sky blue and blush pink roses, floating golden crystal mirrors, dreamlike ethereal lighting, romantic magical editorial, Annie Leibovitz mood, 16:9 aspect ratio',
  },
  {
    id: 'desordre',
    number: '04',
    name: 'Maison Désordre',
    agencySubtitle: 'Organisation Complète & Scénographie Baroque Contemporaine',
    tagline: 'L’opulence d’un banquet sans fin. Le luxe de la démesure.',
    description: 'La grande sculpture de l’événement sur 24 heures non-stop. Banquets vénitiens à perte de vue, conciergerie privée avec transferts en bateaux et retouches coutures, RSVP gastronomique 7 services.',
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
      'Programme d’une journée entière (24h de l’aube au petit matin)',
      'Guide du palais vénitien & conciergerie privée d’urgence',
      'RSVP gastronomique 7 services & sélection des accords',
      'Ambiance velours sombre, bougies d’église et dionysiaque moderne',
    ],
    aiPrompt: 'Opulent modern baroque wedding banquet in a grand Venetian palazzo, 60-meter candlelit banquet table covered with dark red velvet, oversized cascading floral sculptures, crystalline Murano chandeliers, glamorous guests, dark romantic drama, Paolo Sorrentino aesthetic, 16:9 aspect ratio',
  },
  {
    id: 'orbite',
    number: '05',
    name: 'Orbite & Incartade',
    agencySubtitle: 'Haute Couture / Événement Immersif Multi-Jours',
    tagline: 'Une célébration clandestine en trois actes sous les étoiles.',
    description: 'Le sommet de l’expérience personnalisée confidentielle. Scénarisation sur 3 jours (Actes I, II et III), conciergerie VIP avec chauffeurs privés et fitting haute couture, espace privé sécurisé par mot de passe.',
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
      'Triptyque en 3 actes (Vendredi, Samedi & Dimanche)',
      'Services conciergerie VIP (Berlines privées, fitting)',
      'Espace privé invités protégé par code d’accès secret',
      'Scénographie immersive nocturne dans les arènes antiques',
    ],
    aiPrompt: 'Monumental haute couture night wedding ceremony inside an ancient Roman amphitheater in southern France, 2000 tall beeswax church candles, mystical atmospheric fog, dramatic moonlit shadows, mysterious aristocratic elegance, black tie and ethereal bridal couture, cinematic lighting, 16:9 aspect ratio',
  },
];
