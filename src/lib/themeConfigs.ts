import type { WeddingStyle } from './weddingStyles';

export interface ThemePackage {
  id: string;
  name: string;
  price: string;
  priceNote?: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  accent?: string;
}

export interface ThemeModuleConfig {
  sections: { key: string; title: string; visible: boolean }[];
  programme: { time: string; title: string; description: string; place: string; icon?: string }[];
  infos: { category: string; title: string; detail: string; event_time: string; link_label: string }[];
  rsvpEvents: { name: string; description: string }[];
  gifts: { gift_type: string; title: string; description: string; goal_amount: number }[];
  packages: ThemePackage[];
  faq: { question: string; answer: string }[];
  editorial: {
    hero_subtitle: string;
    story_title: string;
    story_text: (p1: string, p2: string) => string;
    announcement: string;
    typography: string;
    button_style: string;
    shape: string;
    layout: string;
    animation_level: string;
  };
}

/**
 * Pour chaque univers, les outils qui respectent le thème.
 * Idée : on ne change pas juste l'image, on change le vocabulaire,
 * les modules, le ton éditorial, et on propose des packages tarifés
 * qui ont du sens dans l'univers.
 */
export const THEME_CONFIGS: Record<string, ThemeModuleConfig> = {
  'noir-blanc': {
    editorial: {
      hero_subtitle: 'HAUTE COUTURE. NOIR & BLANC.',
      story_title: 'L’élégance d’une ligne pure',
      story_text: (p1, p2) => `${p1} et ${p2} ont choisi l’essentiel. Pas d’artifice ni de couleurs fugaces : la puissance du noir et blanc, l’éclat de la lumière naturelle et la beauté brute de leurs proches réunis.`,
      announcement: 'Dress code : Black Tie ou Monochrome chic. Smoking noir ou blanc.',
      typography: 'editorial',
      button_style: 'square',
      shape: 'sharp',
      layout: 'magazine',
      animation_level: 'calme',
    },
    sections: [
      { key: 'hero', title: 'BLACK & WHITE', visible: true },
      { key: 'histoire', title: 'Édito', visible: true },
      { key: 'programme', title: 'Programme', visible: true },
      { key: 'lieux', title: 'Lieux', visible: true },
      { key: 'infos', title: 'Infos', visible: true },
      { key: 'rsvp', title: 'Réponse', visible: true },
      { key: 'packages', title: 'Packages', visible: true },
      { key: 'cagnotte', title: 'Voyage', visible: true },
      { key: 'galerie', title: 'Portfolio N&B', visible: true },
      { key: 'faq', title: 'Questions', visible: true },
      { key: 'contact', title: 'Contact', visible: true },
      { key: 'footer', title: '', visible: true },
    ],
    programme: [
      { time: '15:30', title: 'Arrivée des invités', description: 'Accueil au salon avec coupe de champagne.', place: 'Salon d’honneur', icon: 'glass' },
      { time: '16:30', title: 'Cérémonie solennelle', description: 'Échange des vœux et alliances dans la lumière de fin de journée.', place: 'Galerie principale', icon: 'heart' },
      { time: '18:00', title: 'Cocktail & Portraits', description: 'Séance photo argentique noir et blanc pour chaque invité.', place: 'Cour intérieure', icon: 'camera' },
      { time: '20:00', title: 'Dîner de gala', description: 'Table linéaire, vaisselle noire et bougies blanches.', place: 'Grande salle', icon: 'table' },
      { time: '23:00', title: 'Soirée dansante', description: 'Première danse sous projecteur zénithal puis fête.', place: 'Piste de bal', icon: 'music' },
    ],
    infos: [
      { category: 'Dress code', title: 'Black & White strict', detail: 'Noir profond, blanc pur ou ivoire. Silhouette moderne et sobre.', event_time: '', link_label: '' },
      { category: 'Photographie', title: 'Portraits offerts', detail: 'Un photographe argentique tire le portrait de chaque couple invité.', event_time: '', link_label: '' },
      { category: 'Accès', title: 'Valet à l’entrée', detail: 'Service voiturier disponible dès 15h00.', event_time: '', link_label: 'Itinéraire' },
      { category: 'Enfants', title: 'Soirée adultes', detail: 'Nous souhaitons offrir à chacun une soirée de détente absolue.', event_time: '', link_label: '' },
    ],
    rsvpEvents: [
      { name: 'Cérémonie & Cocktail', description: 'Dès 15h30' },
      { name: 'Dîner de gala', description: '20h00' },
      { name: 'Brunch du lendemain', description: '12h00 le dimanche' },
    ],
    gifts: [
      { gift_type: 'Voyage', title: 'Lune de miel à Kyoto', description: 'Architecture épurée, jardins zen et sérénité.', goal_amount: 5000 },
      { gift_type: 'Art', title: 'Tirage argentique grand format', description: 'Une œuvre pour notre intérieur.', goal_amount: 1500 },
    ],
    packages: [
      { id: 'bw-minimal', name: 'Édition Solo', price: '2 400€', description: 'Le site complet en noir et blanc haute couture', features: ['Mini-site responsive', 'RSVP & gestion des invités', 'Galerie photo HD', 'Export QR code'], cta: 'Sélectionner' },
      { id: 'bw-signature', name: 'Signature Éditoriale', price: '4 800€', priceNote: 'Recommandé', description: 'Design sur-mesure et typographie personnalisée', features: ['Domaine personnalisé', 'Envoi d’invitations SMS/Email', 'Tirage papier du livre d’or', 'Support dédié J-7'], cta: 'Sélectionner', popular: true },
    ],
    faq: [
      { question: 'Pourquoi un thème Noir & Blanc ?', answer: 'C’est l’assurance d’une élégance indémodable, qui sublime toutes les photos sans saturer l’œil.' },
      { question: 'Peut-on ajouter une pointe de couleur ?', answer: 'Absolument, vous pourrez définir une nuance dorée ou argentée si vous le souhaitez.' },
    ],
  },

  'chateau-moderne': {
    editorial: {
      hero_subtitle: 'PIERRE BLONDE. ÉLÉGANCE FRANÇAISE.',
      story_title: 'Un domaine à notre image',
      story_text: (p1, p2) => `Sous les voûtes de pierre et les tilleuls centenaires, ${p1} et ${p2} célèbrent leur amour. Le charme de l’architecture historique revisité avec l’épure et la lumière d’aujourd’hui.`,
      announcement: 'Nous vous donnons rendez-vous au Domaine pour deux jours de célébration.',
      typography: 'serif',
      button_style: 'soft',
      shape: 'round',
      layout: 'magazine',
      animation_level: 'fluide',
    },
    sections: [
      { key: 'hero', title: 'CHÂTEAU MODERNE', visible: true },
      { key: 'histoire', title: 'Notre histoire', visible: true },
      { key: 'programme', title: 'Programme Jour J', visible: true },
      { key: 'lieux', title: 'Le Domaine', visible: true },
      { key: 'infos', title: 'Infos pratiques', visible: true },
      { key: 'rsvp', title: 'RSVP', visible: true },
      { key: 'packages', title: 'Formules', visible: true },
      { key: 'cagnotte', title: 'Cagnotte des mariés', visible: true },
      { key: 'galerie', title: 'Galerie', visible: true },
      { key: 'faq', title: 'FAQ', visible: true },
      { key: 'contact', title: 'Nous contacter', visible: true },
      { key: 'footer', title: '', visible: true },
    ],
    programme: [
      { time: '14:30', title: 'Accueil des invités', description: 'Rafraîchissements sous les tilleuls.', place: 'L’Orangerie', icon: 'sun' },
      { time: '15:30', title: 'Cérémonie laïque', description: 'Au cœur du parc historique.', place: 'Parc du Château', icon: 'heart' },
      { time: '17:30', title: 'Cocktail & Champagne', description: 'Musique live et ateliers gastronomiques.', place: 'Terrasse haute', icon: 'glass' },
      { time: '20:00', title: 'Dîner sous la verrière', description: 'Menu de saison orchestré par le chef du domaine.', place: 'Grande Verrière', icon: 'table' },
      { time: '23:30', title: 'Ouverture du bal', description: 'Célébration jusqu’au bout de la nuit.', place: 'Salle des gardes', icon: 'music' },
    ],
    infos: [
      { category: 'Hébergement', title: 'Chambres sur place', detail: 'Chambres d’hôtes et gîtes partenaires à 5 minutes avec navettes.', event_time: '', link_label: 'Voir la liste' },
      { category: 'Dress code', title: 'Élégant & Champêtre', detail: 'Matières fluides, teintes poudrées ou naturelles. Talons épais conseillés pour la pelouse.', event_time: '', link_label: '' },
      { category: 'Parking', title: 'Parking sécurisé', detail: '100 places gratuites surveillées à l’entrée du domaine.', event_time: '', link_label: 'Plan d’accès' },
    ],
    rsvpEvents: [
      { name: 'Cérémonie & Soirée', description: 'Samedi dès 14h30' },
      { name: 'Brunch du dimanche', description: 'Dimanche de 11h30 à 16h' },
    ],
    gifts: [
      { gift_type: 'Voyage', title: 'Périple en Italie', description: 'Florence, la côte amalfitaine et Capri.', goal_amount: 4500 },
      { gift_type: 'Maison', title: 'Cave à vins de garde', description: 'Pour marquer les grandes dates à venir.', goal_amount: 1800 },
    ],
    packages: [
      { id: 'chateau-essentiel', name: 'Domaine Pur', price: '2 800€', description: 'Le mini-site sublimant votre château', features: ['Carte interactive du domaine', 'Module hébergements', 'RSVP enrichi', 'Programme détaillé'], cta: 'Choisir' },
      { id: 'chateau-prestige', name: 'Grand Cru', price: '5 200€', priceNote: 'Le favori', description: 'Expérience complète incluant le brunch', features: ['Navettes & coordination temps réel', 'Livre d’or numérique avec audio', 'SMS récapitulatif invités', 'Galerie photo post-mariage'], cta: 'Choisir', popular: true },
    ],
    faq: [
      { question: 'Le domaine est-il accessible aux personnes à mobilité réduite ?', answer: 'Oui, des rampes et accès de plain-pied sont prévus pour toutes les salles principales.' },
    ],
  },

  'minimalist-warm': {
    editorial: {
      hero_subtitle: 'LIN NATUREL. DOUCEUR SABLE.',
      story_title: 'La beauté des choses simples',
      story_text: (p1, p2) => `Quelques mots doux, un horizon chaleureux et l’essentiel auprès de ceux qu’on aime. ${p1} et ${p2} vous accueillent dans une parenthèse lumineuse et feutrée.`,
      announcement: 'Rendez-vous sous la douce lumière de fin d’été pour sceller nos vœux.',
      typography: 'sans',
      button_style: 'pill',
      shape: 'round',
      layout: 'minimal',
      animation_level: 'calme',
    },
    sections: [
      { key: 'hero', title: 'MINIMAL LIN', visible: true },
      { key: 'histoire', title: 'Mots doux', visible: true },
      { key: 'programme', title: 'Déroulé', visible: true },
      { key: 'lieux', title: 'Le Lieu', visible: true },
      { key: 'infos', title: 'Détails', visible: true },
      { key: 'rsvp', title: 'Confirmer', visible: true },
      { key: 'packages', title: 'Formules', visible: true },
      { key: 'cagnotte', title: 'Projet à deux', visible: true },
      { key: 'galerie', title: 'Instants', visible: true },
      { key: 'faq', title: 'Questions', visible: true },
      { key: 'contact', title: 'Écrire', visible: true },
      { key: 'footer', title: '', visible: true },
    ],
    programme: [
      { time: '16:00', title: 'Retrouvailles', description: 'Boissons fraîches et embrassades sous la tonnelle.', place: 'La cour', icon: 'sun' },
      { time: '17:00', title: 'L’union', description: 'Quelques vœux écrits à la main et nos alliances échangées.', place: 'L’arche de lin', icon: 'heart' },
      { time: '18:30', title: 'Dîner partagé', description: 'Plats gourmands de saison à partager en toute simplicité.', place: 'La grande table', icon: 'table' },
    ],
    infos: [
      { category: 'Ambiance', title: 'Matières douces', detail: 'Lin, coton, teintes terre cuite et beige chaud.', event_time: '', link_label: '' },
    ],
    rsvpEvents: [
      { name: 'La journée entière', description: 'Dès 16h00' },
    ],
    gifts: [
      { gift_type: 'Maison', title: 'Rénovation de notre atelier', description: 'Créer notre nid chaleureux.', goal_amount: 3000 },
    ],
    packages: [
      { id: 'lin-essentiel', name: 'Épure', price: '1 900€', description: 'Simplicité et chaleur', features: ['Site épuré', 'RSVP simplifié', 'Galerie souvenir'], cta: 'Choisir' },
    ],
    faq: [
      { question: 'Quel est l’esprit de ce thème ?', answer: 'Une atmosphère calme, chaleureuse et lumineuse, idéale pour des mariages intimes ou champêtres chics.' },
    ],
  },

  'rooftop-paris': {
    editorial: {
      hero_subtitle: 'SKYLINE. COCKTAILS. MINUIT.',
      story_title: 'Prendre de la hauteur',
      story_text: (p1, p2) => `Paris à leurs pieds, la lumière dorée sur les zincs des toits et le son d’un saxophone au crépuscule. ${p1} et ${p2} vous convient à une fête moderne, perchée au-dessus de la ville.`,
      announcement: 'Coucher de soleil, cocktails signatures et vue à 360°.',
      typography: 'modern',
      button_style: 'pill',
      shape: 'round',
      layout: 'immersif',
      animation_level: 'fluide',
    },
    sections: [
      { key: 'hero', title: 'ROOFTOP CHIC', visible: true },
      { key: 'histoire', title: 'Notre rencontre', visible: true },
      { key: 'programme', title: 'Timing', visible: true },
      { key: 'lieux', title: 'Le Rooftop', visible: true },
      { key: 'infos', title: 'Infos pratiques', visible: true },
      { key: 'rsvp', title: 'Guestlist', visible: true },
      { key: 'packages', title: 'Formules', visible: true },
      { key: 'cagnotte', title: 'Cagnotte', visible: true },
      { key: 'galerie', title: 'Galerie', visible: true },
      { key: 'faq', title: 'FAQ', visible: true },
      { key: 'contact', title: 'Contact', visible: true },
      { key: 'footer', title: '', visible: true },
    ],
    programme: [
      { time: '18:00', title: 'Ascension & Accueil', description: 'Verre de bienvenue et découverte de la vue panoramique.', place: 'Terrasse Sud', icon: 'glass' },
      { time: '19:00', title: 'Vœux au soleil couchant', description: 'Golden hour sur la skyline.', place: 'L’Oasis', icon: 'sunset' },
      { time: '20:30', title: 'Cocktail dînatoire', description: 'Bouchées raffinées, bars à thèmes et live band.', place: 'Lounge intérieur & extérieur', icon: 'table' },
      { time: '23:00', title: 'Club au sommet', description: 'DJ set et fête sous les étoiles jusqu’à 04h00.', place: 'Club room', icon: 'music' },
    ],
    infos: [
      { category: 'Dress code', title: 'Cocktail Chic', detail: 'Costumes bien coupés, robes de cocktail, touches métallisées ou satin.', event_time: '', link_label: '' },
      { category: 'Accès', title: 'Ascenseur privé', detail: 'Hôte d’accueil au rez-de-chaussée pour vous guider.', event_time: '', link_label: '' },
    ],
    rsvpEvents: [
      { name: 'Sunset & Cocktail dînatoire', description: '18h00' },
      { name: 'After clubbing', description: 'Dès 23h00' },
    ],
    gifts: [
      { gift_type: 'Voyage', title: 'Road trip en Californie', description: 'De San Francisco à Big Sur.', goal_amount: 4000 },
    ],
    packages: [
      { id: 'rooftop-signature', name: 'Skyline', price: '3 200€', description: 'L’élégance urbaine', features: ['Design immersif', 'Compte à rebours coucher de soleil', 'Gestion des entrées guestlist'], cta: 'Choisir' },
    ],
    faq: [
      { question: 'En cas de pluie ?', answer: 'Le rooftop dispose d’une verrière couverte chauffée panoramique.' },
    ],
  },

  'garden-party': {
    editorial: {
      hero_subtitle: 'SOUS LES FEUILLAGES. BOTANIQUE.',
      story_title: 'Un jardin d’été',
      story_text: (p1, p2) => `Entre les rosiers anciens, les herbes folles et le murmure de la fontaine, ${p1} et ${p2} réunissent ceux qu’ils aiment pour une fête bucolique et vibrante de vie.`,
      announcement: 'Chapeaux de paille, sourires et verres tintants sous le grand chêne.',
      typography: 'serif',
      button_style: 'soft',
      shape: 'round',
      layout: 'galerie',
      animation_level: 'fluide',
    },
    sections: [
      { key: 'hero', title: 'GARDEN BOTANICA', visible: true },
      { key: 'histoire', title: 'Notre jardin', visible: true },
      { key: 'programme', title: 'La journée', visible: true },
      { key: 'lieux', title: 'Le Jardin', visible: true },
      { key: 'infos', title: 'Détails pratiques', visible: true },
      { key: 'rsvp', title: 'Je viens', visible: true },
      { key: 'packages', title: 'Packages', visible: true },
      { key: 'cagnotte', title: 'Cagnotte', visible: true },
      { key: 'galerie', title: 'Photos', visible: true },
      { key: 'faq', title: 'FAQ', visible: true },
      { key: 'contact', title: 'Contact', visible: true },
      { key: 'footer', title: '', visible: true },
    ],
    programme: [
      { time: '14:00', title: 'Rendez-vous au verger', description: 'Limonade maison et ombre fraîche.', place: 'Le verger', icon: 'sun' },
      { time: '15:00', title: 'Cérémonie sous le grand chêne', description: 'Vœux bercés par le vent dans les feuilles.', place: 'Le grand chêne', icon: 'heart' },
      { time: '17:00', title: 'Jeux champêtres & Apéritif', description: 'Pétanque, croquet et dégustations locales.', place: 'Pelouse centrale', icon: 'glass' },
      { time: '19:30', title: 'Banquet champêtre', description: 'Grande tablée guinguette éclairée de lampions.', place: 'Allée des rosiers', icon: 'table' },
    ],
    infos: [
      { category: 'Dress code', title: 'Romantique champêtre', detail: 'Robes à motifs floraux, costumes en lin pastel, souliers confortables pour l’herbe.', event_time: '', link_label: '' },
    ],
    rsvpEvents: [
      { name: 'Cérémonie & Banquet', description: 'Dès 14h00' },
    ],
    gifts: [
      { gift_type: 'Projet', title: 'Création de notre jardin', description: 'Arbres fruitiers et plantes vivaces.', goal_amount: 2200 },
    ],
    packages: [
      { id: 'garden-charm', name: 'Bucolique', price: '2 100€', description: 'Le mini-site champêtre chic', features: ['Palette végétale personnalisée', 'Programme avec météo en direct', 'Module hébergements ruraux'], cta: 'Choisir' },
    ],
    faq: [
      { question: 'Peut-on prévoir des jeux pour enfants ?', answer: 'Oui, une grande zone de jeux en bois sécurisée est aménagée dans le pré attenant.' },
    ],
  },

  brutal: {
    editorial: {
      hero_subtitle: 'BÉTON. LUMIÈRE. OUI.',
      story_title: 'On a enlevé le décor',
      story_text: (p1, p2) => `${p1} et ${p2} ne voulaient pas de château. Ils voulaient du vide, du brut, une lumière qui coupe le béton à 16h. Pas de fleurs, pas de rubans. Juste un cercle, deux personnes, et le son de leurs pas dans un bunker berlinois.`,
      announcement: 'Tenue : total black. Pas de talons, sol en béton. Venez brut.',
      typography: 'sans',
      button_style: 'square',
      shape: 'sharp',
      layout: 'minimal',
      animation_level: 'calme',
    },
    sections: [
      { key: 'hero', title: 'BÉTON BRUT', visible: true },
      { key: 'histoire', title: 'Manifeste', visible: true },
      { key: 'programme', title: 'Déroulé — Béton', visible: true },
      { key: 'lieux', title: 'Bunker + Cour', visible: true },
      { key: 'infos', title: 'Infos brutes', visible: true },
      { key: 'rsvp', title: 'Présence — Brut', visible: true },
      { key: 'packages', title: 'Packages — Béton', visible: true },
      { key: 'cagnotte', title: 'Cagnotte — Béton', visible: true },
      { key: 'galerie', title: 'Archive', visible: true },
      { key: 'faq', title: 'FAQ — Brut', visible: true },
      { key: 'contact', title: 'Signal', visible: true },
      { key: 'footer', title: '', visible: true },
    ],
    programme: [
      { time: '15:00', title: 'Arrivée — Lumière zénithale', description: 'Le béton est froid, la lumière est dure. Entrez sans bruit.', place: 'Bunker — entrée nord', icon: 'sun' },
      { time: '16:00', title: 'Cérémonie — Cercle de béton', description: 'Pas d’arche fleurie. Un cercle tracé à la craie. Deux oui.', place: 'Bunker — nef', icon: 'circle' },
      { time: '17:00', title: 'Cocktail — Eau + Pain', description: 'Eau fraîche, pain chaud, silence.', place: 'Cour béton', icon: 'droplet' },
      { time: '19:00', title: 'Dîner — Table brute', description: 'Table en contreplaqué, assiettes blanches, rien d’autre.', place: 'Bunker — table longue', icon: 'table' },
      { time: '21:00', title: 'Son — 1 track, 30 min', description: 'Un seul morceau en boucle. Dansez ou écoutez.', place: 'Bunker — son', icon: 'music' },
    ],
    infos: [
      { category: 'Accès', title: 'Métro + marche', detail: 'Pas de parking. Métro ligne 7, 12 min à pied dans une zone industrielle.', event_time: '', link_label: 'Itinéraire brut' },
      { category: 'Dress code', title: 'Total black', detail: 'Noir. Pas de motif, pas de couleur. Matière brute uniquement.', event_time: '', link_label: '' },
      { category: 'Son', title: 'Bouchons fournis', detail: 'Le béton résonne. Bouchons à l’entrée si vous préférez le silence.', event_time: '', link_label: '' },
      { category: 'Photo', title: 'Pas de photographe', detail: 'Un seul photographe argentique, pas de flash. Le reste est interdit.', event_time: '', link_label: '' },
    ],
    rsvpEvents: [
      { name: 'Cérémonie béton', description: '16:00 — cercle' },
      { name: 'Dîner brut', description: '19:00 — table longue' },
      { name: 'Son — 30 min', description: '21:00 — 1 track' },
    ],
    gifts: [
      { gift_type: 'Béton', title: 'Voyage — Islande', description: 'Béton naturel : falaises, lave, rien.', goal_amount: 4000 },
      { gift_type: 'Studio', title: 'Studio — table en béton', description: 'On coule notre table nous-mêmes.', goal_amount: 1200 },
    ],
    packages: [
      { id: 'brut-essentiel', name: 'Essentiel', price: '2 900€', description: 'Le vide. La lumière. Le oui.', features: ['Bunker 4h', 'Lumière zénithale', 'Son brut', 'Archive photo argentique'], cta: 'Choisir Essentiel' },
      { id: 'brut-integral', name: 'Intégral', price: '5 900€', priceNote: 'Le plus demandé', description: 'Béton + cour + dîner brut', features: ['Bunker + cour 8h', 'Table contreplaqué 40 pers', 'Pain + eau + vin nature', 'Son + lumière architecturale'], cta: 'Choisir Intégral', popular: true },
      { id: 'brut-legende', name: 'Légende', price: '9 900€', description: 'On coule le lieu nous-mêmes.', features: ['Lieu brut sur-mesure', 'Scénographie béton', 'Dîner 80 pers', 'Film 16mm'], cta: 'Choisir Légende' },
    ],
    faq: [
      { question: 'Pourquoi béton ?', answer: 'Parce que le château a déjà été fait 10 000 fois. Le béton, jamais.' },
      { question: 'Il va faire froid ?', answer: 'Oui. Prévoyez un pull noir. On fournit des couvertures en laine brute.' },
      { question: 'On peut mettre des fleurs ?', answer: 'Une seule tige blanche. Pas plus.' },
    ],
  },

  club: {
    editorial: {
      hero_subtitle: 'GUESTLIST ONLY. 02h17.',
      story_title: 'On s’est rencontrés sous un stroboscope',
      story_text: (p1, p2) => `${p1} a vu ${p2} à 2h17 sous un stroboscope rose. Pas de dîner aux chandelles, pas de demande à genoux. Juste un flyer, de la fumée, et un oui crié dans le bruit. Leur mariage commence quand les autres se couchent.`,
      announcement: 'Pas de cérémonie à 14h. On se dit oui à 2h17. Tenue : club kid, paillettes, cuir.',
      typography: 'modern',
      button_style: 'pill',
      shape: 'round',
      layout: 'immersif',
      animation_level: 'spectaculaire',
    },
    sections: [
      { key: 'hero', title: 'CLUB AMOUR', visible: true },
      { key: 'histoire', title: 'Flyer', visible: true },
      { key: 'programme', title: 'Line-up', visible: true },
      { key: 'lieux', title: 'Entrée + Vestiaire', visible: true },
      { key: 'infos', title: 'Dress code', visible: true },
      { key: 'rsvp', title: 'Guestlist', visible: true },
      { key: 'packages', title: 'Tickets', visible: true },
      { key: 'cagnotte', title: 'Bar tab', visible: true },
      { key: 'galerie', title: 'After', visible: true },
      { key: 'faq', title: 'FAQ — Club', visible: true },
      { key: 'contact', title: 'Hotline', visible: true },
      { key: 'footer', title: '', visible: true },
    ],
    programme: [
      { time: '23:00', title: 'Warm-up — fumée', description: 'Fumée, lumière rose, premier verre. Le club s’ouvre.', place: 'Club — entrée', icon: 'smoke' },
      { time: '00:30', title: 'Cérémonie — stroboscope', description: 'Stroboscope, 2 minutes de silence, puis oui.', place: 'Club — dancefloor', icon: 'zap' },
      { time: '01:00', title: 'First dance — techno 128 BPM', description: 'Pas de valse. Un track à 128 BPM, 6 minutes.', place: 'Club — booth', icon: 'music' },
      { time: '02:17', title: 'Oui — 02h17', description: 'L’heure exacte où on s’est rencontrés. On recommence.', place: 'Club — milieu du dancefloor', icon: 'heart' },
      { time: '03:00', title: 'Rave — jusqu’au jour', description: 'Jusqu’à ce que la lumière du jour coupe le néon.', place: 'Club — partout', icon: 'sunrise' },
    ],
    infos: [
      { category: 'Dress code', title: 'Club kid', detail: 'Paillettes, cuir, vinyle, pas de robe longue. Si vous brillez, vous rentrez.', event_time: '', link_label: '' },
      { category: 'Photo', title: 'No flash, no phone', detail: 'On confisque les téléphones à l’entrée. Photographe argentique uniquement.', event_time: '', link_label: '' },
      { category: 'Accès', title: 'Mot de passe à l’entrée', detail: 'Mot de passe envoyé la veille à 23h par SMS.', event_time: '', link_label: '' },
      { category: 'Bar', title: 'Bar tab — 1 ticket = 1 verre', detail: 'Pas de champagne. Vodka, bière, eau.', event_time: '', link_label: '' },
    ],
    rsvpEvents: [
      { name: 'Guestlist — cérémonie', description: '00:30 — stroboscope' },
      { name: 'Guestlist — rave', description: '03:00 — jusqu’au jour' },
      { name: 'After — 07:00', description: 'Petit dej au kebab du coin' },
    ],
    gifts: [
      { gift_type: 'Platine', title: 'Platine + vinyles', description: 'Pour rejouer le 02h17 chez nous.', goal_amount: 800 },
      { gift_type: 'Bar tab', title: 'Bar tab lune de miel', description: 'Berlin, 3 nuits, que des clubs.', goal_amount: 1500 },
    ],
    packages: [
      { id: 'club-guestlist', name: 'Guestlist', price: '1 900€', description: 'Entrée + cérémonie stroboscope', features: ['Club 4h (23h-03h)', 'Fumée + stroboscope', 'DJ 1', 'Vestiaire'], cta: 'Prendre Guestlist' },
      { id: 'club-allnighter', name: 'All-Nighter', price: '4 500€', priceNote: 'Best-seller', description: 'Jusqu’au jour', features: ['Club 23h-07h', 'Line-up 2 DJs', 'Bar tab 40 pers', 'Photo argentique'], cta: 'Prendre All-Nighter', popular: true },
      { id: 'club-legende', name: 'Légende', price: '8 900€', description: 'On privatise le Berghain (presque)', features: ['Club 20h-10h', 'Line-up 4 DJs + live', 'Scéno fumée + laser', 'Film 16mm + after kebab'], cta: 'Prendre Légende' },
    ],
    faq: [
      { question: 'On doit vraiment venir à 23h ?', answer: 'Oui. Le mariage commence à 23h. Si vous arrivez à 14h, vous serez seuls.' },
      { question: 'On peut venir en robe longue ?', answer: 'Non. Club kid ou rien. La robe longue reste au placard.' },
      { question: 'Il y a un plan de table ?', answer: 'Non. Il y a un dancefloor.' },
    ],
  },

  desert: {
    editorial: {
      hero_subtitle: 'VEGAS, 38°C, PISCINE VIDE.',
      story_title: 'On a fui le château',
      story_text: (p1, p2) => `${p1} et ${p2} ont pris une voiture à Vegas, roulé 2h, trouvé un motel vide avec une piscine turquoise vide. Il faisait 38°C. Ils se sont dit oui là, entre deux néons qui buzzent. Pas de traiteur, pas de fleuriste. Juste le désert.`,
      announcement: 'Motel, piscine vide, 38°C. Tenue : vintage 70s, bottes, lunettes.',
      typography: 'serif',
      button_style: 'soft',
      shape: 'soft',
      layout: 'magazine',
      animation_level: 'fluide',
    },
    sections: [
      { key: 'hero', title: 'DESERT MOTEL', visible: true },
      { key: 'histoire', title: 'Road-book', visible: true },
      { key: 'programme', title: 'Road-trip', visible: true },
      { key: 'lieux', title: 'Motel + Piscine', visible: true },
      { key: 'infos', title: 'Canicule', visible: true },
      { key: 'rsvp', title: 'Roadlist', visible: true },
      { key: 'packages', title: 'Packages — Desert', visible: true },
      { key: 'cagnotte', title: 'Essence + Motel', visible: true },
      { key: 'galerie', title: 'Polaroids', visible: true },
      { key: 'faq', title: 'FAQ — Desert', visible: true },
      { key: 'contact', title: 'CB Radio', visible: true },
      { key: 'footer', title: '', visible: true },
    ],
    programme: [
      { time: '16:00', title: 'Arrivée — Check-in', description: 'Clé du motel, chambre 7, ventilateur qui grince.', place: 'Motel — réception', icon: 'key' },
      { time: '17:30', title: 'Cérémonie — Piscine vide', description: 'Piscine vide, deux chaises, un oui qui résonne.', place: 'Motel — piscine', icon: 'droplet' },
      { time: '19:00', title: 'Cocktail — Parking', description: 'Bières fraîches dans une glacière, coucher de soleil sur le désert.', place: 'Motel — parking', icon: 'sunset' },
      { time: '20:30', title: 'Dîner — Neon', description: 'Table sous le néon MOTEL, tacos, rien d’autre.', place: 'Motel — néon', icon: 'utensils' },
      { time: '22:00', title: 'Nuit — 38°C', description: 'On dort fenêtres ouvertes, le désert entre.', place: 'Motel — chambre 7', icon: 'moon' },
    ],
    infos: [
      { category: 'Chaleur', title: '38°C, pas d’ombre', detail: 'Chapeau, crème, eau. Pas de talons, sable partout.', event_time: '', link_label: '' },
      { category: 'Accès', title: 'Voiture obligatoire', detail: '2h de Vegas, pas de taxi. On organise des convois.', event_time: '', link_label: 'Convoi' },
      { category: 'Dress code', title: 'Vintage 70s', detail: 'Lunettes, bottes, robe qui vole dans le vent du désert.', event_time: '', link_label: '' },
      { category: 'Dormir', title: 'Motel — 7 chambres', detail: '7 chambres, ventilateur, pas de clim. Premier arrivé, premier servi.', event_time: '', link_label: '' },
    ],
    rsvpEvents: [
      { name: 'Cérémonie piscine vide', description: '17:30 — motel' },
      { name: 'Dîner néon', description: '20:30 — tacos' },
      { name: 'Nuit 38°C', description: '22:00 — chambre 7' },
    ],
    gifts: [
      { gift_type: 'Essence', title: 'Essence — road-trip', description: 'Vegas → Joshua Tree → Motel', goal_amount: 600 },
      { gift_type: 'Motel', title: 'Motel — 3 nuits', description: 'On reste après, fenêtres ouvertes.', goal_amount: 450 },
    ],
    packages: [
      { id: 'desert-essentiel', name: 'Essentiel', price: '2 200€', description: 'Motel 1 nuit, piscine vide', features: ['Motel 7 chambres 1 nuit', 'Cérémonie piscine vide', 'Tacos + bières', 'Polaroids'], cta: 'Choisir Essentiel' },
      { id: 'desert-roadtrip', name: 'Road-trip', price: '4 900€', priceNote: 'Le plus demandé', description: '2 nuits + convoi', features: ['Motel 2 nuits', 'Convoi depuis Vegas', 'Dîner néon 40 pers', 'Film Super 8'], cta: 'Choisir Road-trip', popular: true },
      { id: 'desert-legende', name: 'Légende', price: '8 500€', description: 'On achète le motel (presque)', features: ['Motel 3 nuits privatisé', 'Enseigne LOVE néon', 'Dîner 80 pers + bar', 'Road-movie'], cta: 'Choisir Légende' },
    ],
    faq: [
      { question: 'Il fait vraiment 38°C ?', answer: 'Oui. C’est le concept. On transpire, on s’en souvient.' },
      { question: 'On dort où ?', answer: 'Motel, 7 chambres. Sinon tente dans le désert, c’est encore mieux.' },
      { question: 'C’est loin ?', answer: '2h de Vegas. C’est loin. C’est pour ça que c’est bien.' },
    ],
  },

  cosmic: {
    editorial: {
      hero_subtitle: 'VERRE LIQUIDE. ORBITE. 0G.',
      story_title: 'On s’est rencontrés dans une fenêtre',
      story_text: (p1, p2) => `${p1} et ${p2} ne voulaient pas de papier. Ils voulaient du verre qui flotte, du chrome liquide, une invitation qui n’existe que si tu as un casque. Leur mariage est en orbite, pas à Chantilly.`,
      announcement: 'Tenue : silver, chrome, verre. Pas de coton, que du métal liquide.',
      typography: 'spatial',
      button_style: 'pill',
      shape: 'round',
      layout: 'immersif',
      animation_level: 'spectaculaire',
    },
    sections: [
      { key: 'hero', title: 'COSMIC', visible: true },
      { key: 'histoire', title: 'Orbite', visible: true },
      { key: 'programme', title: 'Mission', visible: true },
      { key: 'lieux', title: 'Station', visible: true },
      { key: 'infos', title: '0G', visible: true },
      { key: 'rsvp', title: 'Embarquement', visible: true },
      { key: 'packages', title: 'Missions', visible: true },
      { key: 'cagnotte', title: 'Carburant', visible: true },
      { key: 'galerie', title: 'Rendu', visible: true },
      { key: 'faq', title: 'FAQ — 0G', visible: true },
      { key: 'contact', title: 'Signal', visible: true },
      { key: 'footer', title: '', visible: true },
    ],
    programme: [
      { time: '14:00', title: 'Embarquement — sas', description: 'Sas, combinaison silver, check 0G.', place: 'Station — sas', icon: 'rocket' },
      { time: '15:00', title: 'Cérémonie — verre liquide', description: 'Verre qui flotte, anneaux en lévitation, oui en apesanteur.', place: 'Station — dôme', icon: 'orbit' },
      { time: '16:30', title: 'Cocktail — chrome', description: 'Cocktail silver, bulles qui flottent.', place: 'Station — bar chrome', icon: 'flask' },
      { time: '19:00', title: 'Dîner — table miroir', description: 'Table miroir infinie, lumière douce.', place: 'Station — table', icon: 'table' },
      { time: '21:00', title: 'Danse — 0G', description: 'On danse en flottant, 10 minutes, puis on retombe.', place: 'Station — 0G', icon: 'music' },
    ],
    infos: [
      { category: 'Tenue', title: 'Silver only', detail: 'Chrome, silver, verre. Pas de coton, pas de lin. Que du métal liquide.', event_time: '', link_label: '' },
      { category: 'Accès', title: 'Casque conseillé', detail: 'Invitation en spatial video. Sans casque, vous voyez un QR code.', event_time: '', link_label: '' },
      { category: 'Photo', title: 'Pas de flash, que du chrome', detail: 'Lumière douce, reflets infinis. Photographe avec filtre polarisant.', event_time: '', link_label: '' },
      { category: 'Cadeau', title: 'Pas de fleurs, du carburant', detail: 'On part en lune de miel en orbite (presque).', event_time: '', link_label: '' },
    ],
    rsvpEvents: [
      { name: 'Embarquement', description: '14:00 — sas' },
      { name: 'Cérémonie 0G', description: '15:00 — verre liquide' },
      { name: 'Dîner miroir', description: '19:00 — table infinie' },
    ],
    gifts: [
      { gift_type: 'Carburant', title: 'Carburant — orbite', description: 'Pour rester en lévitation 3 jours de plus.', goal_amount: 3000 },
      { gift_type: 'Chrome', title: 'Table chrome', description: 'Table miroir infinie pour notre appart.', goal_amount: 2000 },
    ],
    packages: [
      { id: 'cosmic-essentiel', name: 'Essentiel', price: '3 900€', description: 'Station 4h, 0G 10 min', features: ['Station 4h', 'Cérémonie verre liquide', 'Bar chrome', 'Rendu 3D'], cta: 'Choisir Essentiel' },
      { id: 'cosmic-orbite', name: 'Orbite', price: '7 500€', priceNote: 'Le plus futur', description: 'Journée complète en orbite', features: ['Station 8h', 'Dîner miroir 40 pers', '0G 30 min', 'Film spatial'], cta: 'Choisir Orbite', popular: true },
      { id: 'cosmic-legende', name: 'Légende', price: '15 000€', description: 'On va vraiment en orbite (presque)', features: ['Station 12h + nuit', 'Scéno chrome totale', 'Dîner 80 pers', 'Lune de miel orbite'], cta: 'Choisir Légende' },
    ],
    faq: [
      { question: 'Il faut un casque Vision Pro ?', answer: 'Conseillé, pas obligatoire. Sans casque, vous avez la version 2D, mais avec casque, vous flottez.' },
      { question: 'On flotte vraiment ?', answer: '10 minutes en 0G, oui. Harnais, pas de panique.' },
      { question: 'On peut venir en coton ?', answer: 'Non. Silver only. Le coton absorbe la lumière, le chrome la reflète.' },
    ],
  },

  punk: {
    editorial: {
      hero_subtitle: 'ZINE. AGRAFES. 0€.',
      story_title: 'On a photocopié notre mariage',
      story_text: (p1, p2) => `${p1} et ${p2} ont fait leur faire-part à la photocopieuse du bureau à 19h. 50 exemplaires, agrafés de travers, typo rançon. Coût : 0€. Leur mariage coûte 0€ aussi. C’est un manifeste : le mariage n’a pas besoin de 30k.`,
      announcement: 'Tenue : ce que tu as déjà. Pas d’achat. Épingle à nourrice si tu veux.',
      typography: 'sans',
      button_style: 'square',
      shape: 'sharp',
      layout: 'minimal',
      animation_level: 'calme',
    },
    sections: [
      { key: 'hero', title: 'PUNK PAPIER', visible: true },
      { key: 'histoire', title: 'Zine', visible: true },
      { key: 'programme', title: 'Tract', visible: true },
      { key: 'lieux', title: 'Squat + Cour', visible: true },
      { key: 'infos', title: 'DIY', visible: true },
      { key: 'rsvp', title: 'Présence — zine', visible: true },
      { key: 'packages', title: 'Prix libre', visible: true },
      { key: 'cagnotte', title: 'Caisse — prix libre', visible: true },
      { key: 'galerie', title: 'Photocopies', visible: true },
      { key: 'faq', title: 'FAQ — Punk', visible: true },
      { key: 'contact', title: 'Tel du squat', visible: true },
      { key: 'footer', title: '', visible: true },
    ],
    programme: [
      { time: '14:00', title: 'Arrivée — bière chaude', description: 'Bière chaude, pas de verre, canette.', place: 'Squat — cour', icon: 'beer' },
      { time: '15:00', title: 'Cérémonie — cercle de scotch', description: 'Cercle au scotch par terre, deux oui, applaudissements.', place: 'Squat — salle', icon: 'tape' },
      { time: '16:00', title: 'Cocktail — photocopies', description: 'On photocopie les photos du jour, on les agrafe.', place: 'Squat — photocopieuse', icon: 'copy' },
      { time: '18:00', title: 'Dîner — auberge espagnole', description: 'Chacun amène un plat. Pas de traiteur.', place: 'Squat — table longue', icon: 'pot' },
      { time: '20:00', title: 'Concert — 2 morceaux', description: 'Deux morceaux, batterie cassée, fin.', place: 'Squat — scène', icon: 'music' },
    ],
    infos: [
      { category: 'Prix', title: 'Prix libre', detail: 'Pas de prix. Tu donnes ce que tu veux, ou rien.', event_time: '', link_label: '' },
      { category: 'Dress code', title: 'Ce que tu as', detail: 'Pas d’achat. Ce que tu as déjà, épingle à nourrice si tu veux.', event_time: '', link_label: '' },
      { category: 'Accès', title: 'Squat — adresse le jour J', detail: 'Adresse envoyée le matin à 10h, pas avant.', event_time: '', link_label: '' },
      { category: 'Cadeau', title: 'Pas de cadeau, du temps', detail: 'Viens aider à ranger, c’est le plus beau cadeau.', event_time: '', link_label: '' },
    ],
    rsvpEvents: [
      { name: 'Cérémonie scotch', description: '15:00 — cercle' },
      { name: 'Dîner auberge', description: '18:00 — amène un plat' },
      { name: 'Concert 2 morceaux', description: '20:00 — batterie cassée' },
    ],
    gifts: [
      { gift_type: 'Temps', title: 'Temps — aide', description: 'Viens monter/démonter, c’est notre lune de miel.', goal_amount: 0 },
      { gift_type: 'Papier', title: 'Papier — photocopies', description: 'Ramette + agrafes pour le zine du lendemain.', goal_amount: 50 },
    ],
    packages: [
      { id: 'punk-gratuit', name: 'Gratuit', price: '0€', description: 'On a tout déjà', features: ['Squat 4h', 'Photocopieuse', 'Bière chaude', 'Zine'], cta: 'Choisir Gratuit', popular: true },
      { id: 'punk-prixlibre', name: 'Prix libre', price: 'Prix libre', description: 'Tu donnes ce que tu veux', features: ['Squat 8h', 'Auberge espagnole', 'Concert 2 morceaux', 'Zine + archive'], cta: 'Choisir Prix libre' },
      { id: 'punk-legende', name: 'Légende', price: '500€ max', description: 'On ne dépasse pas 500€, c’est le manifeste', features: ['Squat 12h', 'Dîner 80 pers auberge', 'Film Super 8', 'Zine relié'], cta: 'Choisir Légende' },
    ],
    faq: [
      { question: 'Ça coûte vraiment 0€ ?', answer: 'Oui. On a tout récupéré. Le plus cher c’est les agrafes.' },
      { question: 'On doit amener un plat ?', answer: 'Oui. Auberge espagnole. Si tu amènes rien, tu fais la vaisselle.' },
      { question: 'C’est un vrai mariage ?', answer: 'Plus vrai que les autres. On s’est dit oui, pas acheté un château.' },
    ],
  },

  'foret-noire': {
    editorial: {
      hero_subtitle: 'MOUSSE. RITUEL. 05h12.',
      story_title: 'On s’est perdus dans la forêt',
      story_text: (p1, p2) => `${p1} et ${p2} se sont perdus dans une forêt noire à 5h12 du matin. Brume, mousse, champignons. Ils ont fait un cercle de pierres, allumé un feu, et se sont dit oui sans témoin. Leur mariage est un rituel, pas une garden party.`,
      announcement: 'Forêt profonde, 5h12, brume. Tenue : velours vert, bottes, couronne de champignons.',
      typography: 'serif',
      button_style: 'soft',
      shape: 'soft',
      layout: 'immersif',
      animation_level: 'fluide',
    },
    sections: [
      { key: 'hero', title: 'FORÊT NOIRE', visible: true },
      { key: 'histoire', title: 'Rituel', visible: true },
      { key: 'programme', title: 'Rituel — déroulé', visible: true },
      { key: 'lieux', title: 'Clairière + Feu', visible: true },
      { key: 'infos', title: 'Mousse', visible: true },
      { key: 'rsvp', title: 'Cercle', visible: true },
      { key: 'packages', title: 'Rituels', visible: true },
      { key: 'cagnotte', title: 'Forêt', visible: true },
      { key: 'galerie', title: 'Brume', visible: true },
      { key: 'faq', title: 'FAQ — Forêt', visible: true },
      { key: 'contact', title: 'Corbeau', visible: true },
      { key: 'footer', title: '', visible: true },
    ],
    programme: [
      { time: '05:12', title: 'Arrivée — brume', description: 'Forêt noire, brume, frontales éteintes. On se trouve au son.', place: 'Forêt — entrée', icon: 'moon' },
      { time: '05:30', title: 'Cérémonie — cercle de pierres', description: 'Cercle de pierres, feu, deux oui dans la brume.', place: 'Forêt — clairière', icon: 'flame' },
      { time: '06:30', title: 'Cocktail — champignons', description: 'Thé aux champignons, pain noir, fromage.', place: 'Forêt — feu', icon: 'mushroom' },
      { time: '08:00', title: 'Dîner — table mousse', description: 'Table en bois brut, mousse, pas de nappe.', place: 'Forêt — table longue', icon: 'table' },
      { time: '10:00', title: 'Fin — on se perd', description: 'On se perd à nouveau, chacun son chemin.', place: 'Forêt — partout', icon: 'footprints' },
    ],
    infos: [
      { category: 'Accès', title: 'Forêt — pas d’adresse', detail: 'Coordonnées GPS envoyées la veille, pas d’adresse postale.', event_time: '', link_label: '' },
      { category: 'Dress code', title: 'Velours vert + bottes', detail: 'Velours vert, bottes, couronne de champignons si tu veux. Pas de talons, boue.', event_time: '', link_label: '' },
      { category: 'Météo', title: 'Brume garantie', detail: 'On a choisi le jour le plus brumeux de l’année. Prévoyez un pull laine.', event_time: '', link_label: '' },
      { category: 'Photo', title: 'Pas de flash, que de la brume', detail: 'Photographe avec pellicule haute sensibilité, pas de flash, que de la brume.', event_time: '', link_label: '' },
    ],
    rsvpEvents: [
      { name: 'Rituel 05h12', description: '05:12 — brume' },
      { name: 'Thé champignons', description: '06:30 — feu' },
      { name: 'Table mousse', description: '08:00 — bois brut' },
    ],
    gifts: [
      { gift_type: 'Forêt', title: 'Forêt — cabane', description: 'On construit une cabane dans la forêt, pas de maison.', goal_amount: 2000 },
      { gift_type: 'Champignons', title: 'Champignons — séchage', description: 'Séchoir à champignons pour l’hiver.', goal_amount: 300 },
    ],
    packages: [
      { id: 'foret-essentiel', name: 'Essentiel', price: '2 500€', description: 'Clairière + feu 4h', features: ['Forêt 4h (05h-09h)', 'Cercle pierres + feu', 'Thé champignons', 'Photo brume'], cta: 'Choisir Essentiel' },
      { id: 'foret-rituel', name: 'Rituel', price: '5 500€', priceNote: 'Le plus païen', description: 'Journée complète en forêt', features: ['Forêt 05h-14h', 'Table mousse 40 pers', 'Rituel + conte', 'Film 16mm brume'], cta: 'Choisir Rituel', popular: true },
      { id: 'foret-legende', name: 'Légende', price: '9 500€', description: 'On dort en forêt', features: ['Forêt 24h + nuit', 'Cabane + feu', 'Dîner 80 pers feu', 'Nuit en forêt'], cta: 'Choisir Légende' },
    ],
    faq: [
      { question: 'Il fait nuit à 5h12 ?', answer: 'Oui. C’est le concept. Frontale éteinte, on se trouve au son.' },
      { question: 'On va se salir ?', answer: 'Oui. Boue, mousse, c’est le but. Pas de robe blanche.' },
      { question: 'C’est dangereux ?', answer: 'Non. On connaît la forêt par cœur. Mais on se perd quand même un peu.' },
    ],
  },

  cinema: {
    editorial: {
      hero_subtitle: 'RIDEAU ROUGE. 35MM. PREMIÈRE.',
      story_title: 'On s’est rencontrés au cinéma',
      story_text: (p1, p2) => `${p1} et ${p2} se sont rencontrés au cinéma, rang G, place 12 et 13. Film nul, mais ils ne l’ont pas vu. Leur mariage est une première : ticket, rideau rouge, générique. Les invités sont le public, pas des invités.`,
      announcement: 'Tenue : black tie, mais venez comme vous êtes. Première à 19h, tapis rouge à 18h30.',
      typography: 'editorial',
      button_style: 'soft',
      shape: 'soft',
      layout: 'magazine',
      animation_level: 'fluide',
    },
    sections: [
      { key: 'hero', title: 'CINÉMA', visible: true },
      { key: 'histoire', title: 'Générique', visible: true },
      { key: 'programme', title: 'Séance', visible: true },
      { key: 'lieux', title: 'Salle + Écran', visible: true },
      { key: 'infos', title: 'Ticket', visible: true },
      { key: 'rsvp', title: 'Billet', visible: true },
      { key: 'packages', title: 'Séances', visible: true },
      { key: 'cagnotte', title: 'Bobine', visible: true },
      { key: 'galerie', title: '35mm', visible: true },
      { key: 'faq', title: 'FAQ — Cinéma', visible: true },
      { key: 'contact', title: 'Ouvreur', visible: true },
      { key: 'footer', title: '', visible: true },
    ],
    programme: [
      { time: '18:30', title: 'Tapis rouge — flash', description: 'Tapis rouge, flash, pas de paparazzi, juste vos amis.', place: 'Cinéma — entrée', icon: 'camera' },
      { time: '19:00', title: 'Première — rideau rouge', description: 'Rideau rouge, lumière qui s’éteint, deux oui sur scène.', place: 'Cinéma — scène', icon: 'film' },
      { time: '19:30', title: 'Film — 12 min', description: 'Film de 12 minutes, votre histoire, 35mm.', place: 'Cinéma — écran', icon: 'play' },
      { time: '20:00', title: 'Entracte — champagne', description: 'Champagne, pop-corn, entracte 20 min.', place: 'Cinéma — hall', icon: 'popcorn' },
      { time: '20:30', title: 'Bal — générique', description: 'Générique qui défile, noms des invités, danse.', place: 'Cinéma — scène', icon: 'music' },
    ],
    infos: [
      { category: 'Ticket', title: 'Billet — place numérotée', detail: 'Billet avec place numérotée, rang G si vous arrivez tôt.', event_time: '', link_label: 'Mon billet' },
      { category: 'Dress code', title: 'Black tie + pop-corn', detail: 'Black tie, mais vous pouvez enlever les chaussures pendant le film.', event_time: '', link_label: '' },
      { category: 'Accès', title: 'Cinéma — 19h, pas 19h05', detail: 'Le film commence à 19h pile, pas de pub, pas de bande-annonce.', event_time: '', link_label: '' },
      { category: 'Photo', title: 'Pas de téléphone, que du 35mm', detail: 'Téléphones éteints pendant la séance, comme au cinéma.', event_time: '', link_label: '' },
    ],
    rsvpEvents: [
      { name: 'Première — 19h', description: '19:00 — rideau rouge' },
      { name: 'Film — 19h30', description: '12 min — 35mm' },
      { name: 'Bal — générique', description: '20:30 — scène' },
    ],
    gifts: [
      { gift_type: 'Bobine', title: 'Bobine — lune de miel', description: 'Tour des cinémas abandonnés en Italie.', goal_amount: 2500 },
      { gift_type: 'Projecteur', title: 'Projecteur 16mm', description: 'Pour projeter le film chez nous.', goal_amount: 1200 },
    ],
    packages: [
      { id: 'cinema-seance', name: 'Séance', price: '3 200€', description: 'Salle 100 places 4h', features: ['Cinéma 100 places 4h', 'Rideau rouge + ticket', 'Film 12 min 35mm', 'Champagne + pop-corn'], cta: 'Choisir Séance' },
      { id: 'cinema-premiere', name: 'Première', price: '6 500€', priceNote: 'Tapis rouge', description: 'Soirée complète cinéma', features: ['Cinéma 200 places 6h', 'Tapis rouge + flash', 'Dîner 40 pers + bar', 'Film + générique invités'], cta: 'Choisir Première', popular: true },
      { id: 'cinema-legende', name: 'Légende', price: '12 000€', description: 'On achète le cinéma (presque)', features: ['Cinéma 300 places 10h', 'Scéno complète + néon', 'Dîner 80 pers + after', 'Film 35mm + archive'], cta: 'Choisir Légende' },
    ],
    faq: [
      { question: 'On doit vraiment éteindre son téléphone ?', answer: 'Oui. Comme au cinéma. Pas de téléphone pendant la séance, c’est le concept.' },
      { question: 'Il y a un entracte ?', answer: 'Oui, 20 min, champagne + pop-corn. Comme au cinéma des années 70.' },
      { question: 'On voit le film de votre histoire ?', answer: 'Oui, 12 min, 35mm. On l’a tourné en Super 8 l’été dernier.' },
    ],
  },

  brocante: {
    editorial: {
      hero_subtitle: 'CHAISES DÉPAREILLÉES. MAXIMALISME.',
      story_title: 'On a tout chiné',
      story_text: (p1, p2) => `${p1} et ${p2} ont chiné leur mariage pendant 2 ans. 28 chaises différentes, assiettes de mamie, nappes mélangées, fleurs en bocaux de confiture. Pas de table parfaite Pinterest, une table vivante. Chaque objet a une histoire, comme eux.`,
      announcement: 'Tenue : ce que tu aimes, pas ce qui est à la mode. Si tu as une chemise à fleurs, mets-la.',
      typography: 'serif',
      button_style: 'soft',
      shape: 'round',
      layout: 'galerie',
      animation_level: 'fluide',
    },
    sections: [
      { key: 'hero', title: 'BROCANTE CLUB', visible: true },
      { key: 'histoire', title: 'Chiné', visible: true },
      { key: 'programme', title: 'Marché', visible: true },
      { key: 'lieux', title: 'Grange + Cour', visible: true },
      { key: 'infos', title: 'Chiner', visible: true },
      { key: 'rsvp', title: 'Inventaire', visible: true },
      { key: 'packages', title: 'Brocantes', visible: true },
      { key: 'cagnotte', title: 'Brocante', visible: true },
      { key: 'galerie', title: 'Collection', visible: true },
      { key: 'faq', title: 'FAQ — Brocante', visible: true },
      { key: 'contact', title: 'Brocanteur', visible: true },
      { key: 'footer', title: '', visible: true },
    ],
    programme: [
      { time: '14:00', title: 'Marché — installation', description: 'On installe les chaises dépareillées, les nappes mélangées.', place: 'Grange — cour', icon: 'hammer' },
      { time: '15:30', title: 'Cérémonie — entre deux armoires', description: 'Cérémonie entre une armoire et un frigo SMEG, deux oui.', place: 'Grange — nef', icon: 'heart' },
      { time: '16:30', title: 'Chine — 1h', description: '1h pour chiner dans la grange, chaque invité repart avec un objet.', place: 'Grange — brocante', icon: 'search' },
      { time: '18:30', title: 'Dîner — table vivante', description: 'Table vivante, 28 chaises différentes, 0 chaise pareille.', place: 'Grange — table longue', icon: 'table' },
      { time: '21:00', title: 'Bal — vinyle', description: 'Vinyles chinés, pas de DJ, chacun passe un disque.', place: 'Grange — platine', icon: 'disc' },
    ],
    infos: [
      { category: 'Chaises', title: '28 chaises, 0 pareille', detail: '28 chaises chinées, toutes différentes. Choisissez la vôtre en arrivant.', event_time: '', link_label: '' },
      { category: 'Dress code', title: 'Ce que tu aimes', detail: 'Pas de dress code, pas de couleur. Mets ce que tu aimes, vraiment.', event_time: '', link_label: '' },
      { category: 'Cadeau', title: 'Pas de cadeau, une histoire', detail: 'Racontez-nous une histoire d’objet chiné, c’est notre cadeau.', event_time: '', link_label: '' },
      { category: 'Accès', title: 'Grange — pas de parking', detail: 'Grange, pas de parking, vélo ou covoit. On prête des vélos.', event_time: '', link_label: '' },
    ],
    rsvpEvents: [
      { name: 'Cérémonie armoires', description: '15:30 — grange' },
      { name: 'Chine 1h', description: '16:30 — repars avec un objet' },
      { name: 'Dîner table vivante', description: '18:30 — 28 chaises' },
    ],
    gifts: [
      { gift_type: 'Chaise', title: 'Chaise 29 — la nôtre', description: 'On chine notre 29e chaise, la nôtre, pour notre appart.', goal_amount: 200 },
      { gift_type: 'Voyage', title: 'Voyage — brocantes', description: 'Tour des brocantes d’Italie, 2 semaines, camion.', goal_amount: 1800 },
    ],
    packages: [
      { id: 'brocante-marche', name: 'Marché', price: '2 800€', description: 'Grange + 28 chaises 6h', features: ['Grange 6h', '28 chaises dépareillées', 'Table vivante 40 pers', 'Chine 1h'], cta: 'Choisir Marché' },
      { id: 'brocante-collection', name: 'Collection', price: '5 500€', priceNote: 'Le plus chiné', description: 'Grange + collection complète', features: ['Grange 10h', 'Collection 100 objets', 'Dîner 40 pers + bar', 'Vinyles + platine'], cta: 'Choisir Collection', popular: true },
      { id: 'brocante-legende', name: 'Légende', price: '9 500€', description: 'On vide la brocante', features: ['Grange 14h + nuit', 'Brocante entière', 'Dîner 80 pers + after', 'Film + archive'], cta: 'Choisir Légende' },
    ],
    faq: [
      { question: 'On doit vraiment chiner ?', answer: 'Oui, 1h, et vous repartez avec un objet. C’est le concept, pas une animation.' },
      { question: 'Les chaises sont confortables ?', answer: 'Non, toutes différentes, certaines bancales. C’est le charme.' },
      { question: 'On peut venir en blanc ?', answer: 'Non, pas de blanc. Couleur, motif, fleur, ce que tu veux, mais pas blanc.' },
    ],
  },

  supermarche: {
    editorial: {
      hero_subtitle: 'RAYON 7. NÉONS. CADDIE.',
      story_title: 'On s’est dit oui entre les céréales',
      story_text: (p1, p2) => `${p1} et ${p2} font leurs courses au même supermarché depuis 3 ans, rayon 7, entre les céréales et les surgelés. Un soir à 22h, supermarché vide, néons qui buzzent, ils se sont dit oui entre deux caddies. Leur mariage est là, rayon 7.`,
      announcement: 'Supermarché vide à 22h, néons, caddie. Tenue : supermarché chic, pas de talons, sol lisse.',
      typography: 'sans',
      button_style: 'square',
      shape: 'sharp',
      layout: 'minimal',
      animation_level: 'calme',
    },
    sections: [
      { key: 'hero', title: 'SUPERMARCHÉ 22H', visible: true },
      { key: 'histoire', title: 'Ticket', visible: true },
      { key: 'programme', title: 'Rayons', visible: true },
      { key: 'lieux', title: 'Rayon 7', visible: true },
      { key: 'infos', title: 'Caddie', visible: true },
      { key: 'rsvp', title: 'Liste de courses', visible: true },
      { key: 'packages', title: 'Tickets de caisse', visible: true },
      { key: 'cagnotte', title: 'Caisse', visible: true },
      { key: 'galerie', title: 'Surveillance', visible: true },
      { key: 'faq', title: 'FAQ — Supermarché', visible: true },
      { key: 'contact', title: 'Caisse 3', visible: true },
      { key: 'footer', title: '', visible: true },
    ],
    programme: [
      { time: '22:00', title: 'Ouverture — néons', description: 'Supermarché vide, néons qui buzzent, caddies alignés.', place: 'Supermarché — entrée', icon: 'shopping-cart' },
      { time: '22:17', title: 'Cérémonie — rayon 7', description: 'Rayon 7, entre céréales et surgelés, deux oui, un caddie.', place: 'Supermarché — rayon 7', icon: 'heart' },
      { time: '22:30', title: 'Cocktail — surgelés', description: 'Cocktail dans le rayon surgelés, -18°C, vite.', place: 'Supermarché — surgelés', icon: 'snowflake' },
      { time: '23:00', title: 'Dîner — caisse 3', description: 'Dîner sur le tapis de caisse 3, tapis qui tourne.', place: 'Supermarché — caisse 3', icon: 'table' },
      { time: '23:30', title: 'Bal — parking', description: 'Bal sur le parking vide, néon SUPERMARCHÉ au fond.', place: 'Supermarché — parking', icon: 'music' },
    ],
    infos: [
      { category: 'Accès', title: 'Supermarché — 22h pile', detail: 'Supermarché fermé au public à 22h, ouvert pour nous. Pas avant.', event_time: '', link_label: '' },
      { category: 'Dress code', title: 'Supermarché chic', detail: 'Pas de talons, sol lisse. Caddie fourni si tu veux.', event_time: '', link_label: '' },
      { category: 'Température', title: '-18°C au rayon surgelés', detail: 'Cocktail au rayon surgelés, 5 min max, manteau fourni.', event_time: '', link_label: '' },
      { category: 'Cadeau', title: 'Pas de cadeau, une course', detail: 'Fais tes courses pendant le cocktail, c’est notre cadeau.', event_time: '', link_label: '' },
    ],
    rsvpEvents: [
      { name: 'Cérémonie rayon 7', description: '22:17 — céréales' },
      { name: 'Cocktail surgelés', description: '22:30 — -18°C' },
      { name: 'Dîner caisse 3', description: '23:00 — tapis qui tourne' },
    ],
    gifts: [
      { gift_type: 'Caddie', title: 'Caddie — 1 an de courses', description: '1 an de courses au supermarché du mariage.', goal_amount: 2400 },
      { gift_type: 'Néon', title: 'Néon — SUPERMARCHÉ', description: 'On récupère le néon SUPERMARCHÉ du lieu.', goal_amount: 800 },
    ],
    packages: [
      { id: 'super-essentiel', name: 'Essentiel', price: '1 500€', description: 'Supermarché 2h, rayon 7', features: ['Supermarché 22h-00h', 'Rayon 7 + caisse 3', 'Caddies + néons', 'Photo surveillance'], cta: 'Choisir Essentiel' },
      { id: 'super-caddie', name: 'Caddie', price: '3 900€', priceNote: 'Le plus iconique', description: 'Soirée complète supermarché', features: ['Supermarché 22h-02h', 'Rayons + parking + surgelés', 'Dîner 40 pers caisse 3', 'Film caméra surveillance'], cta: 'Choisir Caddie', popular: true },
      { id: 'super-legende', name: 'Légende', price: '7 500€', description: 'On achète le supermarché (presque)', features: ['Supermarché 22h-06h', 'Tout le magasin', 'Dîner 80 pers + after parking', 'Néon + archive'], cta: 'Choisir Légende' },
    ],
    faq: [
      { question: 'C’est vraiment dans un supermarché ?', answer: 'Oui, vrai supermarché, 22h, fermé au public, ouvert pour nous.' },
      { question: 'On peut faire ses courses ?', answer: 'Oui, pendant le cocktail, c’est même conseillé. C’est notre cadeau.' },
      { question: 'Il fait froid au rayon surgelés ?', answer: 'Oui, -18°C, 5 min max, manteau fourni. C’est le concept.' },
    ],
  },

  laverie: {
    editorial: {
      hero_subtitle: 'TAMBOUR 7. MOUSSE. PASTEL.',
      story_title: 'On s’est rencontrés à la laverie',
      story_text: (p1, p2) => `${p1} et ${p2} se sont rencontrés à la laverie, tambour 7, 19h32. Leurs chaussettes se sont mélangées, ils ont parlé 2h, le linge a tourné 3 fois. Leur mariage est là, tambour 7, mousse, pastel.`,
      announcement: 'Laverie automatique, néons pastel, hublots qui tournent. Tenue : pastel délavé, chaussettes dépareillées.',
      typography: 'sans',
      button_style: 'soft',
      shape: 'round',
      layout: 'magazine',
      animation_level: 'fluide',
    },
    sections: [
      { key: 'hero', title: 'LAVERIE CLUB', visible: true },
      { key: 'histoire', title: 'Tambour 7', visible: true },
      { key: 'programme', title: 'Cycles', visible: true },
      { key: 'lieux', title: 'Hublots', visible: true },
      { key: 'infos', title: 'Lessive', visible: true },
      { key: 'rsvp', title: 'Tour de linge', visible: true },
      { key: 'packages', title: 'Cycles', visible: true },
      { key: 'cagnotte', title: 'Monnayeur', visible: true },
      { key: 'galerie', title: 'Mousse', visible: true },
      { key: 'faq', title: 'FAQ — Laverie', visible: true },
      { key: 'contact', title: 'Laverie', visible: true },
      { key: 'footer', title: '', visible: true },
    ],
    programme: [
      { time: '19:32', title: 'Arrivée — tambour 7', description: 'Laverie, tambour 7 qui tourne, chaussettes qui se mélangent.', place: 'Laverie — tambour 7', icon: 'washer' },
      { time: '20:00', title: 'Cérémonie — mousse', description: 'Mousse, bulles, deux oui, hublots qui tournent.', place: 'Laverie — mousse', icon: 'bubbles' },
      { time: '20:30', title: 'Cocktail — adoucissant', description: 'Cocktail qui sent l’adoucissant, serviettes chaudes.', place: 'Laverie — table pliante', icon: 'droplet' },
      { time: '21:30', title: 'Dîner — table pliante', description: 'Table pliante de laverie, 20 chaises pliantes, dîner.', place: 'Laverie — table', icon: 'table' },
      { time: '22:30', title: 'Bal — essorage', description: 'Essorage 1200 tours, on danse, le sol vibre.', place: 'Laverie — essorage', icon: 'music' },
    ],
    infos: [
      { category: 'Accès', title: 'Laverie — 19h32 pile', detail: 'Laverie ouverte, clients normaux + nous. Pas privatisée, c’est le concept.', event_time: '', link_label: '' },
      { category: 'Dress code', title: 'Pastel délavé', detail: 'Pastel délavé, chaussettes dépareillées, pas de blanc, blanc = lessive.', event_time: '', link_label: '' },
      { category: 'Lessive', title: 'Apportez votre linge', detail: 'Apportez votre linge sale, on le lave pendant la cérémonie. Vrai.', event_time: '', link_label: '' },
      { category: 'Température', title: 'Chaud + humide', detail: 'Laverie, chaud, humide, odeur d’adoucissant. C’est le concept.', event_time: '', link_label: '' },
    ],
    rsvpEvents: [
      { name: 'Cérémonie mousse', description: '20:00 — tambour 7' },
      { name: 'Dîner table pliante', description: '21:30 — 20 chaises' },
      { name: 'Bal essorage', description: '22:30 — 1200 tours' },
    ],
    gifts: [
      { gift_type: 'Linge', title: 'Linge — 1 an', description: '1 an de laverie, tambour 7, pour nous deux.', goal_amount: 600 },
      { gift_type: 'Machine', title: 'Machine — séchage', description: 'Séchoir pour notre appart, pas de laverie.', goal_amount: 400 },
    ],
    packages: [
      { id: 'laverie-essentiel', name: 'Essentiel', price: '1 200€', description: 'Laverie 2h, tambour 7', features: ['Laverie 19h-21h', 'Tambour 7 + mousse', 'Serviettes chaudes', 'Photo hublots'], cta: 'Choisir Essentiel' },
      { id: 'laverie-cycle', name: 'Cycle complet', price: '3 200€', priceNote: 'Le plus tendre', description: 'Soirée complète laverie', features: ['Laverie 19h-23h', 'Cycles + table pliante', 'Dîner 20 pers + lessive', 'Film hublots'], cta: 'Choisir Cycle', popular: true },
      { id: 'laverie-legende', name: 'Légende', price: '6 500€', description: 'On rachète la laverie (presque)', features: ['Laverie 19h-02h', 'Toute la laverie', 'Dîner 40 pers + after', 'Néon + archive mousse'], cta: 'Choisir Légende' },
    ],
    faq: [
      { question: 'C’est une vraie laverie ?', answer: 'Oui, vraie laverie, ouverte, clients normaux. On est au milieu, c’est le concept.' },
      { question: 'On doit apporter son linge ?', answer: 'Oui, apportez votre linge sale, on le lave pendant la cérémonie. Vrai, pas une blague.' },
      { question: 'Ça sent l’adoucissant ?', answer: 'Oui, très fort. C’est le concept. On aime l’odeur d’adoucissant.' },
    ],
  },
};

export function getThemeConfig(styleId: string): ThemeModuleConfig | null {
  return THEME_CONFIGS[styleId] ?? null;
}

export function getThemePackages(styleId: string): ThemePackage[] {
  return THEME_CONFIGS[styleId]?.packages ?? [];
}
