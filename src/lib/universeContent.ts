import type { WeddingStyle } from './weddingStyles';

/**
 * LE CONTENU RÉEL DE CHAQUE UNIVERS
 *
 * Ce que les téléphones montrent n'est pas une maquette : chaque univers a son
 * lieu, sa date, ses invités, sa cagnotte, ses régimes alimentaires et ses
 * informations pratiques. Les trois écrans — invité, mariés, prestataire —
 * lisent tous ce même contenu, chacun sous son angle.
 */

export interface UniverseFact {
  label: string;
  value: string;
}

export interface UniverseContent {
  /** Ce qui s'affiche dans le hero de cet univers. */
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
    facts: UniverseFact[];
  };
  couple: {
    names: string;
    /** Date du jour J, au format AAAA-MM-JJ. */
    date: string;
    countdown: string;
    venue: string;
    city: string;
    season: string;
    dressCode: string;
    guests: number;
  };
  rsvp: {
    confirmed: number;
    pending: number;
    /** La phrase que l'invité lit sous le bouton. */
    invitation: string;
  };
  cagnotte: {
    purpose: string;
    goal: number;
    raised: number;
    contributors: number;
    top: string;
  };
  menu: {
    service: string;
    items: string[];
  };
  allergens: UniverseFact[];
  infos: UniverseFact[];
  /** Ce que le prestataire doit retenir en arrivant. */
  vendor: {
    arrival: string;
    access: string;
    contact: string;
  };
}

export const UNIVERSE_CONTENT: Record<string, UniverseContent> = {
  'noir-blanc': {
    hero: {
      kicker: 'Univers · Minimal & Haute Couture',
      title: 'Le noir et blanc, tiré comme un magazine.',
      subtitle:
        'Aucune couleur : la lumière, le grain et la coupe font toute la scénographie. Chaque image est pensée pour être imprimée.',
      facts: [
        { label: 'Lieu', value: 'Atelier Turenne, Paris 3ᵉ' },
        { label: 'Invités', value: '48 personnes' },
        { label: 'Tenue', value: 'Noir total, blanc absolu' },
      ],
    },
    couple: { names: 'Sarah & Gabriel', date: '2027-06-12', countdown: 'J-267', venue: 'Atelier Turenne', city: 'Paris 3ᵉ', season: 'Juin', dressCode: 'Noir total ou blanc absolu', guests: 48 },
    rsvp: { confirmed: 41, pending: 7, invitation: 'Confirmez votre présence avant le 30 avril' },
    cagnotte: { purpose: 'Un tirage argentique 40 × 60 pour chaque foyer', goal: 3200, raised: 2180, contributors: 27, top: '380 €' },
    menu: { service: 'Dîner assis, service au guéridon', items: ['Tartare de Saint-Jacques, citron caviar', 'Filet de bœuf, jus corsé, pommes soufflées', 'Paris-Brest, praliné noisette'] },
    allergens: [{ label: 'Végétarien', value: '4 couverts' }, { label: 'Sans gluten', value: '2 couverts' }, { label: 'Fruits à coque', value: '3 couverts' }],
    infos: [{ label: 'Accès', value: 'Cour pavée, 12 rue de Turenne — code 4821' }, { label: 'Navette', value: '18h30, place de la République' }, { label: 'Hébergement', value: 'Hôtel du Marais, 8 min à pied' }],
    vendor: { arrival: 'Arrivée 14h00, briefing 14h30', access: 'Déchargement cour pavée, 12 rue de Turenne', contact: 'Sarah · 06 12 44 88 21' },
  },

  'chateau-moderne': {
    hero: {
      kicker: 'Univers · Grands Domaines & Végétal',
      title: 'La pierre blonde, éclairée comme un musée.',
      subtitle:
        'Un domaine du XVIIIᵉ remis à nu : mobilier contemporain, allées de tilleuls et champagne servi à la coupe au coucher du soleil.',
      facts: [
        { label: 'Lieu', value: 'Château de Villandry, Val de Loire' },
        { label: 'Invités', value: '120 personnes' },
        { label: 'Saison', value: 'Septembre, lumière basse' },
      ],
    },
    couple: { names: 'Camille & Antoine', date: '2027-09-04', countdown: 'J-351', venue: 'Château de Villandry', city: 'Val de Loire', season: 'Septembre', dressCode: 'Élégance française, tons pierre', guests: 120 },
    rsvp: { confirmed: 104, pending: 16, invitation: 'Merci de répondre avant le 15 juillet' },
    cagnotte: { purpose: 'Les vins du dîner, choisis avec le sommelier', goal: 5000, raised: 4120, contributors: 63, top: '500 €' },
    menu: { service: 'Dîner gastronomique, accords mets-vins', items: ['Langoustines rôties, beurre d’algues', 'Pigeon de Bresse, jus au poivre de Timut', 'Soufflé à la vanille de Tahiti'] },
    allergens: [{ label: 'Sans lactose', value: '5 couverts' }, { label: 'Pescatarien', value: '6 couverts' }, { label: 'Sans alcool', value: '9 couverts' }],
    infos: [{ label: 'Accès', value: 'Entrée sud, allée des Tilleuls — voiturier' }, { label: 'Navette', value: 'Tours centre 17h00 et 18h00' }, { label: 'Hébergement', value: 'Gîtes du domaine, réservés pour 24 personnes' }],
    vendor: { arrival: 'Arrivée 13h30, régie à l’orangerie', access: 'Portail de service, chemin de la Serre', contact: 'Antoine · 06 88 20 41 07' },
  },

  'brutal': {
    hero: {
      kicker: 'Univers · Radical & Insolite',
      title: 'Un oui qui résonne contre le béton.',
      subtitle:
        'Pas de fleurs. Des faisceaux rasants, une dalle coulée et une seule tige blanche. Le luxe, ici, c’est le vide.',
      facts: [
        { label: 'Lieu', value: 'Bunker de la Villette, Paris 19ᵉ' },
        { label: 'Invités', value: '80 personnes' },
        { label: 'Mise en lumière', value: 'Faisceaux sodium, 18 projecteurs' },
      ],
    },
    couple: { names: 'Léa & Noah', date: '2026-11-14', countdown: 'J-57', venue: 'Bunker de la Villette', city: 'Paris 19ᵉ', season: 'Novembre, nuit tôt', dressCode: 'Silhouettes noires, matières brutes', guests: 80 },
    rsvp: { confirmed: 71, pending: 9, invitation: 'Répondez avant le 20 octobre, le lieu est à jauge' },
    cagnotte: { purpose: 'Les bancs monolithes, coulés pour la soirée', goal: 2800, raised: 2540, contributors: 44, top: '300 €' },
    menu: { service: 'Buffet debout, street-gourmet', items: ['Pain au levain, beurre fumé', 'Bœuf braisé 12h, oignons brûlés', 'Tarte au chocolat 70 %, fleur de sel'] },
    allergens: [{ label: 'Végétarien', value: '7 couverts' }, { label: 'Sans gluten', value: '4 couverts' }, { label: 'Sans porc', value: '3 couverts' }],
    infos: [{ label: 'Accès', value: 'Porte 6, quai de la Gironde — badge obligatoire' }, { label: 'Navette', value: '19h00, métro Corentin Cariou' }, { label: 'Hébergement', value: 'Aucun sur place, dernier métro 01h15' }],
    vendor: { arrival: 'Arrivée 12h00, montage lumière dès 13h', access: 'Quai de la Gironde, porte 6 — véhicule autorisé', contact: 'Noah · 07 61 03 55 90' },
  },

  'club': {
    hero: {
      kicker: 'Univers · Nocturne & Fête 02h17',
      title: 'Le oui, à 02h17 exactement.',
      subtitle:
        'Stroboscope, basse à 128 BPM et fumée dense. On célèbre d’abord, on prononce ensuite — quand la piste est pleine.',
      facts: [
        { label: 'Lieu', value: 'Souterrain Bastille, Paris 11ᵉ' },
        { label: 'Invités', value: '150 personnes' },
        { label: 'Fin', value: '06h00, dernier morceau imposé' },
      ],
    },
    couple: { names: 'Maya & Théo', date: '2027-03-20', countdown: 'J-183', venue: 'Souterrain Bastille', city: 'Paris 11ᵉ', season: 'Mars', dressCode: 'Total look noir, talons autorisés', guests: 150 },
    rsvp: { confirmed: 138, pending: 12, invitation: 'Liste à jour au 15 mars — pas d’entrée sans réponse' },
    cagnotte: { purpose: 'Le sound system de la nuit, loué à la journée', goal: 4000, raised: 3680, contributors: 92, top: '400 €' },
    menu: { service: 'Restauration nocturne, service continu', items: ['Tacos de canard, sauce piquante maison', 'Frites à la truffe et parmesan', 'Bar à glaces à 04h00'] },
    allergens: [{ label: 'Végétalien', value: '11 couverts' }, { label: 'Sans gluten', value: '6 couverts' }, { label: 'Allergie arachide', value: '2 couverts' }],
    infos: [{ label: 'Accès', value: 'Escalier B, 44 rue de Lappe — vestiaire obligatoire' }, { label: 'Navette', value: 'Sortie 06h00, deux navettes vers Denfert' }, { label: 'Hébergement', value: 'Hôtel Voltaire, chambres jusqu’à 12h' }],
    vendor: { arrival: 'Arrivée 17h00, balance sono 18h30', access: 'Quai de livraison rue de Lappe, ascenseur 2 t', contact: 'Maya · 06 45 71 09 32'  },
  },

  'desert': {
    hero: {
      kicker: 'Univers · Sauvage & Éphémère',
      title: 'Vegas, 38 °C, piscine vide.',
      subtitle:
        'Un motel au bout de la route, des néons qui grésillent et un oui prononcé pieds nus sur le béton chaud.',
      facts: [
        { label: 'Lieu', value: 'Motel Route 66, Mojave' },
        { label: 'Invités', value: '32 personnes' },
        { label: 'Chaleur', value: '38 °C à 19h00' },
      ],
    },
    couple: { names: 'Inès & Malik', date: '2027-05-22', countdown: 'J-246', venue: 'Motel Route 66', city: 'Mojave', season: 'Mai, nuit sèche', dressCode: 'Lin, cuir, santiags', guests: 32 },
    rsvp: { confirmed: 29, pending: 3, invitation: 'Réponse avant le 1ᵉʳ avril — vols à bloquer tôt' },
    cagnotte: { purpose: 'La navette de nuit depuis Los Angeles', goal: 2400, raised: 1980, contributors: 19, top: '250 €' },
    menu: { service: 'Barbecue au feu de bois, à la tombée du jour', items: ['Côtes de bœuf, sel de fumée', 'Maïs grillé, beurre de chipotle', 'Tarte au citron vert, meringue brûlée'] },
    allergens: [{ label: 'Végétarien', value: '3 couverts' }, { label: 'Sans lactose', value: '2 couverts' }, { label: 'Sans porc', value: '4 couverts' }],
    infos: [{ label: 'Accès', value: 'Sortie 12, piste non goudronnée sur 3 km' }, { label: 'Navette', value: '19h00 depuis le parking du diner' }, { label: 'Hébergement', value: '12 chambres du motel, réparties à l’avance' }],
    vendor: { arrival: 'Arrivée 16h30, installation à l’ombre du auvent', access: 'Parking arrière, prises 32 A disponibles', contact: 'Inès · 07 82 15 63 40'  },
  },

  'garden-party': {
    hero: {
      kicker: 'Univers · Grands Domaines & Végétal',
      title: 'Sous les feuillages, à l’heure des oiseaux.',
      subtitle:
        'Un banquet sous les arbres, des tables longues en bois brut, des herbes folles et des guirlandes de rien du tout.',
      facts: [
        { label: 'Lieu', value: 'Potager du Hameau, Normandie' },
        { label: 'Invités', value: '95 personnes' },
        { label: 'Repas', value: 'Une seule grande table' },
      ],
    },
    couple: { names: 'Juliette & Basile', date: '2027-07-03', countdown: 'J-288', venue: 'Potager du Hameau', city: 'Normandie', season: 'Juillet, jour long', dressCode: 'Tons verts, tissus naturels', guests: 95 },
    rsvp: { confirmed: 88, pending: 7, invitation: 'Confirmez avant le 1ᵉʳ juin pour le plan de table' },
    cagnotte: { purpose: 'Les arbres plantés à votre nom dans le verger', goal: 3600, raised: 2900, contributors: 51, top: '400 €' },
    menu: { service: 'Banquet champêtre servi à table', items: ['Légumes du potager, huile d’herbes', 'Agneau de pré-salé, jus au thym', 'Pavlova aux fruits rouges de la ferme'] },
    allergens: [{ label: 'Végétarien', value: '9 couverts' }, { label: 'Végétalien', value: '3 couverts' }, { label: 'Sans gluten', value: '5 couverts' }],
    infos: [{ label: 'Accès', value: 'Chemin du Hameau, champ de stationnement fléché' }, { label: 'Navette', value: '16h30 depuis la gare de Bernay' }, { label: 'Hébergement', value: 'Tente dressée sur place, 20 lits — liste close' }],
    vendor: { arrival: 'Arrivée 11h00, montage des tables à 13h', access: 'Chemin rural, prudence si pluie', contact: 'Juliette · 06 33 90 27 88'  },
  },

  'supermarche': {
    hero: {
      kicker: 'Univers · Radical & Insolite',
      title: 'Rayon 7, néons, caddie.',
      subtitle:
        'Un supermarché après la fermeture, 22h00 précises. Les invités poussent un caddie, le oui se prononce entre deux rayons.',
      facts: [
        { label: 'Lieu', value: 'Supermarché Belleville, Paris 20ᵉ' },
        { label: 'Invités', value: '64 personnes' },
        { label: 'Horaire', value: '22h00 — après fermeture' },
      ],
    },
    couple: { names: 'Nora & Adam', date: '2027-02-06', countdown: 'J-141', venue: 'Supermarché Belleville', city: 'Paris 20ᵉ', season: 'Février', dressCode: 'Veste de survêtement et talons', guests: 64 },
    rsvp: { confirmed: 59, pending: 5, invitation: 'Réponse avant le 25 janvier — accès nominatif' },
    cagnotte: { purpose: 'Le rayon traiteur, entièrement privatisé', goal: 1800, raised: 1620, contributors: 38, top: '200 €' },
    menu: { service: 'Finger food, plateaux posés sur les gondoles', items: ['Tapas de chef sur plateau de caisse', 'Mini-burgers et frites en cornet', 'Chariot de glaces et bonbons, rayon 3'] },
    allergens: [{ label: 'Végétarien', value: '8 couverts' }, { label: 'Sans porc', value: '5 couverts' }, { label: 'Allergie fruits à coque', value: '2 couverts' }],
    infos: [{ label: 'Accès', value: 'Entrée de service, 22 rue de Belleville — badge' }, { label: 'Navette', value: '21h15, métro Jourdain' }, { label: 'Hébergement', value: 'Aucun — chacun repart après 02h00' }],
    vendor: { arrival: 'Arrivée 19h30, cadrage avant l’ouverture des caisses', access: 'Quai de livraison, camion autorisé 30 min', contact: 'Nora · 07 11 46 72 05'  },
  },

  'laverie': {
    hero: {
      kicker: 'Univers · Nocturne & Fête 02h17',
      title: 'Tambour 7, mousse, pastel.',
      subtitle:
        'Une laverie ouverte toute la nuit, des machines qui tournent et une playlist douce. On danse entre les paniers.',
      facts: [
        { label: 'Lieu', value: 'Laverie du Canal, Paris 10ᵉ' },
        { label: 'Invités', value: '45 personnes' },
        { label: 'Ambiance', value: 'Pastel, mousse, bulles' },
      ],
    },
    couple: { names: 'Chloé & Méline', date: '2027-04-17', countdown: 'J-211', venue: 'Laverie du Canal', city: 'Paris 10ᵉ', season: 'Avril', dressCode: 'Pastel et vintage, confort absolu', guests: 45 },
    rsvp: { confirmed: 42, pending: 3, invitation: 'Dites-nous avant le 5 avril si vous venez danser' },
    cagnotte: { purpose: 'Le bar à bulles, dix-huit magnums', goal: 1500, raised: 1290, contributors: 31, top: '150 €' },
    menu: { service: 'Bar à bulles et sweet table', items: ['Sablés à la rose, crème pétillante', 'Choux au yuzu', 'Bonbons acidulés à volonté'] },
    allergens: [{ label: 'Sans gluten', value: '3 couverts' }, { label: 'Sans lactose', value: '2 couverts' }, { label: 'Végétalien', value: '4 couverts' }],
    infos: [{ label: 'Accès', value: '32 quai de Jemmapes — la porte reste ouverte' }, { label: 'Navette', value: 'Aucune : navigation à pied conseillée' }, { label: 'Hébergement', value: 'Auberge du Canal, 6 lits réservés' }],
    vendor: { arrival: 'Arrivée 18h00, la laverie reste en service jusqu’à 20h', access: 'Quai de Jemmapes — zone piétonne, livraison à 17h', contact: 'Chloé · 06 74 38 51 19'  },
  },

  'foret-noire': {
    hero: {
      kicker: 'Univers · Radicaux & Rituels',
      title: 'La mousse étouffe les pas.',
      subtitle:
        'Une clairière, trente bougies, un rite qui ne ressemble à aucun autre. Le silence fait partie de la cérémonie.',
      facts: [
        { label: 'Lieu', value: 'Clairière du Haut-Jura' },
        { label: 'Invités', value: '26 personnes' },
        { label: 'Cérémonie', value: 'Rituel de la forêt, 40 minutes' },
      ],
    },
    couple: { names: 'Salomé & Vadim', date: '2026-10-03', countdown: 'J-15', venue: 'Clairière du Haut-Jura', city: 'Haut-Jura', season: 'Octobre, brume', dressCode: 'Manteaux longs, chaussures imperméables', guests: 26 },
    rsvp: { confirmed: 26, pending: 0, invitation: 'Complet — la clairière ne prend pas plus' },
    cagnotte: { purpose: 'Les lanternes et la cire, fondues sur place', goal: 900, raised: 900, contributors: 24, top: '80 €' },
    menu: { service: 'Repas de cueillette, servi en cocottes', items: ['Velouté de champignons des bois', 'Chevreuil mariné aux baies de genièvre', 'Clafoutis aux myrtilles sauvages'] },
    allergens: [{ label: 'Végétarien', value: '2 couverts' }, { label: 'Sans alcool', value: '3 couverts' }, { label: 'Sans gluten', value: '1 couvert' }],
    infos: [{ label: 'Accès', value: 'Route forestière fermée — rendez-vous au col à 15h00' }, { label: 'Navette', value: 'Deux 4 × 4, départs 14h30 et 15h00' }, { label: 'Hébergement', value: 'Refuge du col, 26 lits, sac de couchage conseillé' }],
    vendor: { arrival: 'Arrivée 12h00 au col, montée avec les 4 × 4', access: 'Piste carrossable jusqu’à la clairière, terrain meuble', contact: 'Salomé · 07 29 64 83 55'  },
  },

  'cinema': {
    hero: {
      kicker: 'Univers · Spectacle',
      title: 'Rideau rouge, 35 mm, première.',
      subtitle:
        'Une salle de cinéma louée pour la nuit. Le film, c’est le vôtre — projeté en ouverture avant que la salle ne se lève.',
      facts: [
        { label: 'Lieu', value: 'Cinéma Le Lumière, Lyon' },
        { label: 'Invités', value: '110 personnes' },
        { label: 'Ouverture', value: 'Projection du film du couple' },
      ],
    },
    couple: { names: 'Émilie & Rayan', date: '2027-01-16', countdown: 'J-120', venue: 'Cinéma Le Lumière', city: 'Lyon', season: 'Janvier', dressCode: 'Tenue de soirée, tapis rouge', guests: 110 },
    rsvp: { confirmed: 97, pending: 13, invitation: 'Réservez votre fauteuil avant le 5 janvier' },
    cagnotte: { purpose: 'La restauration du film tourné en Super 8', goal: 3000, raised: 2270, contributors: 58, top: '350 €' },
    menu: { service: 'Bar à popcorn salé-sucré et dîner au foyer', items: ['Popcorn au beurre noisette et caramel', 'Hot-dogs de chef, oignons confits', 'Bar à bonbons rétro et chocolats chauds'] },
    allergens: [{ label: 'Végétarien', value: '10 couverts' }, { label: 'Sans porc', value: '7 couverts' }, { label: 'Sans gluten', value: '4 couverts' }],
    infos: [{ label: 'Accès', value: 'Grandes portes, 8 rue de la Charité' }, { label: 'Navette', value: '19h30 depuis la gare Part-Dieu' }, { label: 'Hébergement', value: 'Hôtel des Terreaux, 15 chambres bloquées' }],
    vendor: { arrival: 'Arrivée 16h00, réglage machine 17h30', access: 'Cour arrière, porte de la cabine — 2 places', contact: 'Émilie · 06 57 12 39 74'  },
  },

  'rooftop-paris': {
    hero: {
      kicker: 'Univers · Nocturne & Fête 02h17',
      title: 'Golden hour, toits de Paris.',
      subtitle:
        'Une terrasse au septième étage, des toits à perte de vue et un dîner servi quand la lumière devient orange.',
      facts: [
        { label: 'Lieu', value: 'Terrasse du 7ᵉ, Paris 2ᵉ' },
        { label: 'Invités', value: '70 personnes' },
        { label: 'Créneau', value: '20h10 — coucher de soleil' },
      ],
    },
    couple: { names: 'Anaïs & Louis', date: '2027-06-26', countdown: 'J-281', venue: 'Terrasse du 7ᵉ étage', city: 'Paris 2ᵉ', season: 'Juin, golden hour', dressCode: 'Élégance d’été, chapeaux bienvenus', guests: 70 },
    rsvp: { confirmed: 64, pending: 6, invitation: 'Confirmez avant le 10 juin — la terrasse est à jauge' },
    cagnotte: { purpose: 'Les arrangements floraux, renouvelés à minuit', goal: 2600, raised: 2140, contributors: 41, top: '300 €' },
    menu: { service: 'Cocktail dînatoire, postes au bord de la terrasse', items: ['Tartares et ceviches préparés à la minute', 'Brochettes de légumes grillés et halloumi', 'Bar à cocktails, carte signature'] },
    allergens: [{ label: 'Pescatarien', value: '8 couverts' }, { label: 'Sans gluten', value: '3 couverts' }, { label: 'Sans alcool', value: '6 couverts' }],
    infos: [{ label: 'Accès', value: 'Ascenseur B jusqu’au 7ᵉ, pas de talon aiguille' }, { label: 'Navette', value: 'Aucune : Sentier ou Bourse, 4 min à pied' }, { label: 'Hébergement', value: 'Chambres de l’immeuble, 6 disponibles' }],
    vendor: { arrival: 'Arrivée 15h00, montage par l’ascenseur de service', access: 'Quai de livraison rue d’Aboukir, 20 min max', contact: 'Anaïs · 07 44 68 20 16'  },
  },

  'punk': {
    hero: {
      kicker: 'Univers · Radical & Insolite',
      title: 'Agrafes, photocopies, zine.',
      subtitle:
        'Faire-part risographiés, groupes de garage et bières artisanales. Le beau ici est brut, taché, vivant.',
      facts: [
        { label: 'Lieu', value: 'Atelier d’impression, Marseille' },
        { label: 'Invités', value: '130 personnes' },
        { label: 'Faire-part', value: 'Trois couleurs, tirées à 300 exemplaires' },
      ],
    },
    couple: { names: 'Sasha & Lou', date: '2027-05-08', countdown: 'J-232', venue: 'Atelier d’impression', city: 'Marseille', season: 'Mai, vent marin', dressCode: 'Ce que vous aimez, franchement', guests: 130 },
    rsvp: { confirmed: 112, pending: 18, invitation: 'Réponse avant le 20 avril, concert à programmer' },
    cagnotte: { purpose: 'Le tirage du fanzine de la soirée, 300 exemplaires', goal: 2000, raised: 1740, contributors: 76, top: '220 €' },
    menu: { service: 'Grillades et frites, service en continu', items: ['Frites fraîches, sauce maison', 'Brochettes marinées au piment', 'Bières artisanales d’un brasseur du quartier'] },
    allergens: [{ label: 'Végétarien', value: '14 couverts' }, { label: 'Sans porc', value: '9 couverts' }, { label: 'Sans gluten', value: '5 couverts' }],
    infos: [{ label: 'Accès', value: '12 rue de la République, rideau métallique levé à 18h' }, { label: 'Navette', value: 'Aucune : tram à 200 m' }, { label: 'Hébergement', value: 'Auberge de la Joliette, dortoir réservé' }],
    vendor: { arrival: 'Arrivée 14h00, balance du groupe à 17h', access: 'Rue étroite — décharger devant, puis garage à 300 m', contact: 'Sasha · 06 91 05 77 63'  },
  },

  'brocante': {
    hero: {
      kicker: 'Univers · Radical & Insolite',
      title: 'Chaises dépareillées, tant mieux.',
      subtitle:
        'Tout vient de brocantes et de dons : vaisselle, nappes, fauteuils. Le mélange des styles fait la décoration.',
      facts: [
        { label: 'Lieu', value: 'Halle de Wazemmes, Lille' },
        { label: 'Invités', value: '88 personnes' },
        { label: 'Table', value: '180 assiettes, toutes différentes' },
      ],
    },
    couple: { names: 'Margot & Étienne', date: '2027-04-03', countdown: 'J-197', venue: 'Halle de Wazemmes', city: 'Lille', season: 'Avril', dressCode: 'Vintage, friperie bienvenue', guests: 88 },
    rsvp: { confirmed: 80, pending: 8, invitation: 'Confirmez avant le 20 mars, on chine les assiettes' },
    cagnotte: { purpose: 'La vaisselle chinée, lavée et prêtée aux invités', goal: 1200, raised: 980, contributors: 47, top: '120 €' },
    menu: { service: 'Banquet convivial, plats à partager', items: ['Grande salade de lentilles et betterave', 'Poulet rôti au citron confit, pommes grenaille', 'Plateau de fromages du Nord'] },
    allergens: [{ label: 'Végétarien', value: '6 couverts' }, { label: 'Sans lactose', value: '4 couverts' }, { label: 'Sans alcool', value: '7 couverts' }],
    infos: [{ label: 'Accès', value: 'Marché de Wazemmes, entrée place Nouvelle-Aventure' }, { label: 'Navette', value: '18h45, métro Gambetta' }, { label: 'Hébergement', value: 'Chambres chez l’habitant, liste partagée' }],
    vendor: { arrival: 'Arrivée 13h00, dressage des tables à 15h', access: 'Déchargement place Nouvelle-Aventure, 15 min', contact: 'Margot · 07 63 22 84 09'  },
  },

  'cosmic': {
    hero: {
      kicker: 'Univers · Insolite',
      title: 'Verre liquide, orbite lente.',
      subtitle:
        'Miroirs, chromes et synthés : une scénographie de station spatiale, avec un sound designer aux manettes.',
      facts: [
        { label: 'Lieu', value: 'Dôme du Planetarium, Toulouse' },
        { label: 'Invités', value: '100 personnes' },
        { label: 'Son', value: 'Synthwave live, 90 minutes' },
      ],
    },
    couple: { names: 'Iris & Nael', date: '2027-10-09', countdown: 'J-386', venue: 'Dôme du Planetarium', city: 'Toulouse', season: 'Octobre', dressCode: 'Métalliques, argent, blanc froid', guests: 100 },
    rsvp: { confirmed: 89, pending: 11, invitation: 'Réponse avant le 20 septembre — projection nominative' },
    cagnotte: { purpose: 'La projection du ciel de votre nuit de rencontre', goal: 3500, raised: 2860, contributors: 62, top: '400 €' },
    menu: { service: 'Dîner sous le dôme, service à l’assiette', items: ['Œuf parfait, écume de champignons', 'Filet de bar, beurre blanc à l’agrumes', 'Dôme de chocolat, éclats de caramel'] },
    allergens: [{ label: 'Végétarien', value: '7 couverts' }, { label: 'Pescatarien', value: '5 couverts' }, { label: 'Sans gluten', value: '4 couverts' }],
    infos: [{ label: 'Accès', value: 'Allée Jules-Guesde, entrée astronomie' }, { label: 'Navette', value: '19h00 depuis la gare Matabiau' }, { label: 'Hébergement', value: 'Hôtel des Carmes, 20 chambres réservées' }],
    vendor: { arrival: 'Arrivée 14h00, calage de la projection à 17h', access: 'Quai de livraison côté jardin, camion autorisé', contact: 'Iris · 06 18 47 95 30'  },
  },

  'co-mariage': {
    hero: {
      kicker: 'Univers · Festival',
      title: 'Deux couples, une scène, un festival.',
      subtitle:
        'Deux cérémonies, une seule billetterie. Les équipes se partagent la scène, les mariés partagent les coûts.',
      facts: [
        { label: 'Lieu', value: 'Domaine de Gramont, Montpellier' },
        { label: 'Invités', value: '240 personnes' },
        { label: 'Scène', value: 'Deux cérémonies, un seul son' },
      ],
    },
    couple: { names: 'Lina & Sami · Bonnie & Clyde', date: '2027-09-18', countdown: 'J-365', venue: 'Domaine de Gramont', city: 'Montpellier', season: 'Septembre', dressCode: 'Tenue de festival chic', guests: 240 },
    rsvp: { confirmed: 211, pending: 29, invitation: 'Réponse avant le 1ᵉʳ septembre, deux listes séparées' },
    cagnotte: { purpose: 'La scène et le son, mutualisés entre les deux couples', goal: 8000, raised: 6350, contributors: 154, top: '600 €' },
    menu: { service: 'Food trucks et banquet à 19h30', items: ['Six food trucks, du libanais au japonais', 'Grand banquet de légumes du soleil', 'Bar à glaces et churros à 23h00'] },
    allergens: [{ label: 'Végétalien', value: '22 couverts' }, { label: 'Sans gluten', value: '13 couverts' }, { label: 'Sans porc', value: '18 couverts' }],
    infos: [{ label: 'Accès', value: 'Parking P2, navettes internes toutes les 10 minutes' }, { label: 'Navette', value: 'Trois départs depuis la gare Saint-Roch' }, { label: 'Hébergement', value: 'Camping du domaine, 60 emplacements' }],
    vendor: { arrival: 'Arrivée 10h00, montage plateau jusqu’à 15h', access: 'Entrée technique côté P2, badge festival', contact: 'Lina · 07 35 90 61 48'  },
  },

  'abyssal': {
    hero: {
      kicker: 'Univers · Sauvage & Éphémère',
      title: 'Sous l’océan, bleu profond, silence.',
      subtitle:
        'Un dîner dans une salle immergée : la lumière vient de l’eau, les poissons passent, personne ne parle fort.',
      facts: [
        { label: 'Lieu', value: 'Salle immergée, Brest' },
        { label: 'Invités', value: '40 personnes' },
        { label: 'Profondeur', value: '11 mètres sous la surface' },
      ],
    },
    couple: { names: 'Maëlle & Younès', date: '2027-02-27', countdown: 'J-162', venue: 'Salle immergée de l’Océanopolis', city: 'Brest', season: 'Février', dressCode: 'Bleus profonds, lainages fins', guests: 40 },
    rsvp: { confirmed: 37, pending: 3, invitation: 'Réponse avant le 5 février — protocole de sécurité' },
    cagnotte: { purpose: 'Le bateau qui vous emmène au large après le dîner', goal: 2200, raised: 1840, contributors: 28, top: '300 €' },
    menu: { service: 'Dîner iodé, cinq services', items: ['Huîtres, vinaigre d’échalote', 'Saint-Pierre en croûte de sel', 'Kouign-amann, caramel au beurre salé'] },
    allergens: [{ label: 'Allergie crustacés', value: '2 couverts' }, { label: 'Sans lactose', value: '3 couverts' }, { label: 'Sans alcool', value: '5 couverts' }],
    infos: [{ label: 'Accès', value: 'Port de plaisance, ponton 3 — 10 min à pied' }, { label: 'Navette', value: '18h30 depuis la gare de Brest' }, { label: 'Hébergement', value: 'Hôtel du port, 14 chambres' }],
    vendor: { arrival: 'Arrivée 15h00, accès salle encadré par un plongeur', access: 'Ponton 3, matériel débarqué à la main', contact: 'Maëlle · 06 82 14 07 92'  },
  },

  'orient-express': {
    hero: {
      kicker: 'Univers · Voyage',
      title: 'Paris-Venise, 100 km/h, vœux en mouvement.',
      subtitle:
        'Un wagon privé, du laiton, du velours. La cérémonie se fait pendant que l’Europe défile derrière la vitre.',
      facts: [
        { label: 'Lieu', value: 'Wagon privé, Paris → Venise' },
        { label: 'Invités', value: '52 personnes' },
        { label: 'Trajet', value: '14 heures de nuit' },
      ],
    },
    couple: { names: 'Béatrice & Hugo', date: '2027-11-06', countdown: 'J-414', venue: 'Wagon Impérial', city: 'Paris → Venise', season: 'Novembre', dressCode: 'Grande soirée, velours et soie', guests: 52 },
    rsvp: { confirmed: 49, pending: 3, invitation: 'Réponse avant le 1ᵉʳ octobre — billets nominatifs' },
    cagnotte: { purpose: 'Le wagon-bar et ses cognacs d’exception', goal: 4500, raised: 3400, contributors: 39, top: '500 €' },
    menu: { service: 'Dîner dressé en voiture, service au rythme du train', items: ['Caviar, blinis tièdes', 'Bœuf Wellington, sauce Périgueux', 'Chariot de fromages affinés, miel de châtaignier'] },
    allergens: [{ label: 'Sans alcool', value: '6 couverts' }, { label: 'Sans lactose', value: '2 couverts' }, { label: 'Végétarien', value: '4 couverts' }],
    infos: [{ label: 'Accès', value: 'Gare de l’Est, voie 4, embarquement 19h40' }, { label: 'Navette', value: 'Voitures de la gare à la voiture-bar' }, { label: 'Hébergement', value: 'Wagon-couchettes, 26 cabines — au bord du train' }],
    vendor: { arrival: 'Arrivée 17h00, chargement au quai avant embarquement', access: 'Gare de l’Est, accès véhicule sur dérogation', contact: 'Béatrice · 07 50 26 73 11'  },
  },

  'phare-atlantique': {
    hero: {
      kicker: 'Univers · Sauvage & Éphémère',
      title: 'Vents d’Ouest, tempête, oui absolu.',
      subtitle:
        'Un phare sur une île, douze invités, une seule nuit. Le bateau repart le lendemain matin, sans exception.',
      facts: [
        { label: 'Lieu', value: 'Phare de Kéréon, Bretagne' },
        { label: 'Invités', value: '12 personnes' },
        { label: 'Marée', value: 'Accès uniquement à marée basse' },
      ],
    },
    couple: { names: 'Gwenaëlle & Erwan', date: '2026-10-24', countdown: 'J-36', venue: 'Phare de Kéréon', city: 'Bretagne', season: 'Octobre, vents forts', dressCode: 'Cirés élégants, pulls de laine', guests: 12 },
    rsvp: { confirmed: 12, pending: 0, invitation: 'Complet — l’île ne prend pas plus de douze personnes' },
    cagnotte: { purpose: 'Les deux allers-retours en vedette', goal: 1400, raised: 1400, contributors: 11, top: '200 €' },
    menu: { service: 'Dîner de bivouac, un seul service', items: ['Soupe de poissons de roche, rouille', 'Homard grillé au beurre demi-sel', 'Far breton, pruneaux macérés'] },
    allergens: [{ label: 'Allergie crustacés', value: '1 couvert' }, { label: 'Sans alcool', value: '2 couverts' }, { label: 'Sans lactose', value: '1 couvert' }],
    infos: [{ label: 'Accès', value: 'Départ du port de Brest, 8h00 — marée oblige' }, { label: 'Navette', value: 'Vedette affrétée, deux rotations' }, { label: 'Hébergement', value: 'Le phare lui-même : 12 lits, rien d’autre' }],
    vendor: { arrival: 'Arrivée 7h15 au port, matériel en caisse étanche', access: 'Port de Brest, ponton des vedettes — pas de véhicule', contact: 'Gwenaëlle · 06 39 85 40 67'  },
  },

  'last-minute': {
    hero: {
      kicker: 'Univers · Radical & Insolite',
      title: '48 heures chrono, et c’est fait.',
      subtitle:
        'Un mariage monté en deux jours : la mairie, six amis, un dîner improvisé, la ville qui s’allume.',
      facts: [
        { label: 'Lieu', value: 'Décidé à 48 h du jour J' },
        { label: 'Invités', value: '18 personnes' },
        { label: 'Délai', value: 'Tout bouclé en 2 jours' },
      ],
    },
    couple: { names: 'Romy & Tom', date: '2026-09-27', countdown: 'J-8', venue: 'Mairie du 11ᵉ puis appartement', city: 'Paris 11ᵉ', season: 'Septembre', dressCode: 'Ce que vous portez ce jour-là', guests: 18 },
    rsvp: { confirmed: 18, pending: 0, invitation: 'Réponse en 12 heures, s’il vous plaît' },
    cagnotte: { purpose: 'Le dîner improvisé et le taxi de nuit', goal: 800, raised: 640, contributors: 14, top: '100 €' },
    menu: { service: 'Commandé le matin même, servi à 21h', items: ['Planches de charcuterie et fromages', 'Pâtes au citron, parmesan, poivre long', 'Gâteau acheté en bas de l’immeuble'] },
    allergens: [{ label: 'Végétarien', value: '3 couverts' }, { label: 'Sans porc', value: '2 couverts' }, { label: 'Sans lactose', value: '1 couvert' }],
    infos: [{ label: 'Accès', value: 'Mairie à 15h00, puis 24 rue Keller à 19h30' }, { label: 'Navette', value: 'Aucune — tout est à moins de 10 minutes' }, { label: 'Hébergement', value: 'Canapés de trois amis, réservés' }],
    vendor: { arrival: 'Appelé la veille, arrivée 17h00', access: 'Immeuble sans ascenseur, 4ᵉ étage, cour étroite', contact: 'Romy · 07 97 31 58 24'  },
  },

  traditionnel: {
    hero: {
      kicker: 'Univers · Traditionnel & Famille',
      title: 'Le mariage tel qu’on se le raconte depuis toujours.',
      subtitle:
        'Messe à l’église, cortège, banquet assis, orchestre et brunch du lendemain. Rien d’insolite — tout est tenu, à la minute.',
      facts: [
        { label: 'Lieu', value: 'Église Saint-Jean puis Manoir des Ormes' },
        { label: 'Invités', value: '180 personnes' },
        { label: 'Programme', value: 'Messe, banquet, bal jusqu’à 04h00' },
      ],
    },
    couple: { names: 'Claire & Thomas', date: '2027-06-19', countdown: 'J-274', venue: 'Église Saint-Jean & Manoir des Ormes', city: 'Touraine', season: 'Juin', dressCode: 'Tenue de cérémonie, chapeaux bienvenus', guests: 180 },
    rsvp: { confirmed: 164, pending: 16, invitation: 'Réponse avant le 15 mai, plan de table à valider' },
    cagnotte: { purpose: 'Le voyage de noces en Italie, offert par les familles', goal: 6000, raised: 5240, contributors: 118, top: '700 €' },
    menu: { service: 'Banquet assis, cinq services, service à l’assiette', items: ['Feuilleté de ris de veau, sauce suprême', 'Filet de bœuf, gratin dauphinois, jus au madère', 'Pièce montée à la nougatine et corbeille de dragées'] },
    allergens: [{ label: 'Végétarien', value: '6 couverts' }, { label: 'Sans gluten', value: '4 couverts' }, { label: 'Sans alcool', value: '12 couverts' }],
    infos: [{ label: 'Église', value: 'Messe à 15h00, 12 place de l’Église — parking fléché' }, { label: 'Navette', value: 'Deux bus de 17h00 et 17h20 vers le manoir' }, { label: 'Hébergement', value: 'Manoir et gîtes voisins, 40 lits réservés' }],
    vendor: { arrival: 'Arrivée 9h00 au manoir, mise en place jusqu’à 13h', access: 'Entrée de service, chemin des Ormes — véhicule autorisé', contact: 'Claire · 06 44 17 92 30' },
  },

  corse: {
    hero: {
      kicker: 'Univers · Sauvage & Éphémère',
      title: 'Le maquis pour tout décor.',
      subtitle:
        'Une bergerie de pierre sur la crête, des tables de bois, et des chants polyphoniques quand le soleil descend sur le golfe.',
      facts: [
        { label: 'Lieu', value: 'Bergerie de la Crête, Balagne' },
        { label: 'Invités', value: '70 personnes' },
        { label: 'Repas', value: 'Cochon de lait à la broche' },
      ],
    },
    couple: { names: 'Laetitia & Petru', date: '2027-05-29', countdown: 'J-253', venue: 'Bergerie de la Crête', city: 'Balagne, Corse', season: 'Mai, maquis en fleurs', dressCode: 'Lin clair, chaussures de marche', guests: 70 },
    rsvp: { confirmed: 66, pending: 4, invitation: 'Réponse avant le 1ᵉʳ mai — l’accès se prépare' },
    cagnotte: { purpose: 'Le vin de Patrimonio et les fromages de brebis', goal: 2400, raised: 2110, contributors: 52, top: '300 €' },
    menu: { service: 'Repas au feu de bois, servi sur la crête', items: ['Assiette de charcuterie corse, figatellu grillé', 'Cochon de lait à la broche, pommes de terre au maquis', 'Fiadone au brocciu et canistrelli'] },
    allergens: [{ label: 'Végétarien', value: '4 couverts' }, { label: 'Sans lactose', value: '3 couverts' }, { label: 'Sans porc', value: '5 couverts' }],
    infos: [{ label: 'Accès', value: 'Rendez-vous au col à 16h00, puis 25 min de sentier' }, { label: 'Navette', value: 'Quatre 4 × 4 depuis la place du village' }, { label: 'Hébergement', value: 'Bergerie et deux maisons du village, 30 lits' }],
    vendor: { arrival: 'Arrivée 10h00 au col, montage avec les 4 × 4', access: 'Piste carrossable jusqu’à la bergerie, terrain sec', contact: 'Petru · 06 78 21 55 42' },
  },

  reunion: {
    hero: {
      kicker: 'Univers · Île & Tropiques',
      title: 'La varangue ouverte sur les palmiers.',
      subtitle:
        'Un domaine créole, des carrys qui mijotent depuis le matin et un maloya qui fait lever tout le monde à la fin du repas.',
      facts: [
        { label: 'Lieu', value: 'Domaine de la Varangue, Saint-Paul' },
        { label: 'Invités', value: '140 personnes' },
        { label: 'Soirée', value: 'Séga et maloya live jusqu’à l’aube' },
      ],
    },
    couple: { names: 'Océane & Dimitri', date: '2027-08-14', countdown: 'J-330', venue: 'Domaine de la Varangue', city: 'Saint-Paul, La Réunion', season: 'Août, hiver austral', dressCode: 'Léger et coloré, tissus tropicaux', guests: 140 },
    rsvp: { confirmed: 128, pending: 12, invitation: 'Réponse avant le 20 juillet, le traiteur compte les marmites' },
    cagnotte: { purpose: 'Le rougail d’accueil et les épices du repas', goal: 3800, raised: 3190, contributors: 97, top: '450 €' },
    menu: { service: 'Repas créole, service au buffet sous la varangue', items: ['Rougail saucisse et grains, achards de légumes', 'Carry boucané, riz et lentilles de Cilaos', 'Ananas Victoria rôti, glace coco'] },
    allergens: [{ label: 'Végétarien', value: '16 couverts' }, { label: 'Sans porc', value: '11 couverts' }, { label: 'Sans gluten', value: '8 couverts' }],
    infos: [{ label: 'Accès', value: 'Route de Saint-Paul, entrée du domaine à 16h00' }, { label: 'Navette', value: 'Trois départs de Saint-Denis et de Saint-Gilles' }, { label: 'Hébergement', value: 'Bungalows du domaine, 45 lits, petit-déjeuner inclus' }],
    vendor: { arrival: 'Arrivée 11h00, les marmites démarrent à 13h', access: 'Cour du domaine, livraison côté cuisine', contact: 'Dimitri · 07 62 84 10 27' },
  },

  'new-york': {
    hero: {
      kicker: 'Univers · Urbain',
      title: 'La skyline pour mur de fond.',
      subtitle:
        'Un rooftop à Brooklyn, des lumières tendues entre deux réservoirs d’eau, et un dîner qui commence quand le soleil descend sur Manhattan.',
      facts: [
        { label: 'Lieu', value: 'Rooftop Williamsburg, Brooklyn' },
        { label: 'Invités', value: '110 personnes' },
        { label: 'Dîner', value: '18h30 — coucher de soleil sur Manhattan' },
      ],
    },
    couple: { names: 'Alix & Jordan', date: '2027-09-25', countdown: 'J-372', venue: 'Rooftop Williamsburg', city: 'Brooklyn, New York', season: 'Septembre, fin d’été', dressCode: 'Costume clair, robe courte', guests: 110 },
    rsvp: { confirmed: 96, pending: 14, invitation: 'Réponse avant le 5 septembre — le lieu ferme la liste' },
    cagnotte: { purpose: 'La limousine jaune et le brunch du lendemain', goal: 4200, raised: 3480, contributors: 74, top: '500 €' },
    menu: { service: 'Dîner sur le toit, bar à cocktails et food truck', items: ['Bar à huîtres, sauce mignonette', 'Côtes de bœuf, pommes de terre au fenouil', 'Cheesecake new-yorkais, cerises macérées'] },
    allergens: [{ label: 'Végétarien', value: '9 couverts' }, { label: 'Sans gluten', value: '6 couverts' }, { label: 'Sans alcool', value: '8 couverts' }],
    infos: [{ label: 'Accès', value: 'Ascenseur de service jusqu’au 12ᵉ, badge nominatif' }, { label: 'Navette', value: 'Deux vans depuis Manhattan, 17h00 et 17h30' }, { label: 'Hébergement', value: 'Hôtel Williamsburg, 30 chambres bloquées' }],
    vendor: { arrival: 'Arrivée 13h00, montage du toit jusqu’à 16h', access: 'Quai de livraison Kent Ave, 20 minutes maximum', contact: 'Jordan · 07 45 90 66 18' },
  },

  vegas: {
    hero: {
      kicker: 'Univers · Express & Festif',
      title: 'Chapelle rose, Elvis, limousine.',
      subtitle:
        'Une cérémonie de vingt minutes sous une arche de fleurs, du champagne au strip et un buffet nocturne jusqu’à trois heures.',
      facts: [
        { label: 'Lieu', value: 'Chapelle Neon Rose, Las Vegas' },
        { label: 'Invités', value: '40 personnes' },
        { label: 'Cérémonie', value: '22h00, vingt minutes, Elvis officie' },
      ],
    },
    couple: { names: 'Mélanie & Kevin', date: '2026-12-31', countdown: 'J-104', venue: 'Chapelle Neon Rose', city: 'Las Vegas', season: 'Décembre, nuit claire', dressCode: 'Blanc, paillettes, santiags bienvenus', guests: 40 },
    rsvp: { confirmed: 38, pending: 2, invitation: 'Réponse avant le 15 décembre — chapelle à créneau' },
    cagnotte: { purpose: 'La limousine, le champagne et le buffet de nuit', goal: 2000, raised: 1680, contributors: 33, top: '250 €' },
    menu: { service: 'Buffet nocturne et bar permanent', items: ['Sliders et ailes de poulet sauce miel', 'Frites au cheddar et jalapeños', 'Gâteau à étage rose, crème vanille'] },
    allergens: [{ label: 'Végétarien', value: '3 couverts' }, { label: 'Sans porc', value: '2 couverts' }, { label: 'Sans lactose', value: '1 couvert' }],
    infos: [{ label: 'Accès', value: 'Chapelle au 2100 Las Vegas Blvd, voiturier inclus' }, { label: 'Navette', value: 'Limousine depuis l’hôtel à 21h15' }, { label: 'Hébergement', value: 'Hôtel du Strip, 20 chambres au même étage' }],
    vendor: { arrival: 'Arrivée 19h30, répétition de la cérémonie à 20h', access: 'Parking arrière de la chapelle, emplacement réservé', contact: 'Kevin · 07 55 30 74 61' },
  },

};

/** Le contenu d'un univers, avec le contenu de Black & White en secours. */
export function contentFor(style: WeddingStyle): UniverseContent {
  return UNIVERSE_CONTENT[style.id] ?? UNIVERSE_CONTENT['noir-blanc'];
}

/** « 2 180 € » — les montants se lisent à la française. */
export function euros(amount: number): string {
  return `${amount.toLocaleString('fr-FR')} €`;
}
