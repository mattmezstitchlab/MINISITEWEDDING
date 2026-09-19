import { styleById } from './weddingStyles';
import { contentFor } from './universeContent';

export interface VendorRoleCandidate {
  role: string;
  mission: string;
  status: 'filled' | 'open';
  compensationHint?: string;
}

export interface ThemeTimelineScene {
  time: string;
  title: string;
  narrativeScript: string;
  ambianceDetail: string;
  image: string;
  vendorRoles?: VendorRoleCandidate[];
}

export const THEME_TIMELINE_SCENARIOS: Record<string, ThemeTimelineScene[]> = {
  // 1. BLACK & WHITE (Éditorial, pur, haute couture)
  'noir-blanc': [
    {
      time: '16h00',
      title: 'L’Entrée Géométrique & Cérémonie',
      narrativeScript: 'Silence cathédrale. Sol laqué miroitant sous une verrière pure. Aucune fleur superflue : le couple avance au son d’un violoncelle dépouillé.',
      ambianceDetail: 'Smoking architectural, robe graphique sans dentelle, noir profond et blanc pur.',
      image: '/images/noir-blanc-entree.jpg',
      vendorRoles: [
        { role: 'Officiant Auteur', mission: 'Lecture minimaliste des vœux, sans protocole convenu', status: 'filled' },
        { role: 'Photographe Mode B&W', mission: 'Portraits posés au flash parapluie & architecture', status: 'filled' },
        { role: 'Violoncelliste Solo', mission: 'Prélude épuré Bach revisité en réverbération cathédrale', status: 'open', compensationHint: 'Prestation 2h' },
      ],
    },
    {
      time: '18h30',
      title: 'Cocktail & Tirages Argentiques Directs',
      narrativeScript: 'Pendant le service de champagne blanc de blancs, le photographe réalise le portrait argentique grand format de chaque couple d’invités.',
      ambianceDetail: 'Tirages séchés sur fil d’acier en direct, coupes en cristal taillé.',
      image: '/images/champagne.jpg',
      vendorRoles: [
        { role: 'Tireur Argentique Live', mission: 'Révélation et séchage des portraits sur fil tendu en direct', status: 'open', compensationHint: 'Atelier mobile 3h' },
        { role: 'Chef Sommelier Blanc de Blancs', mission: 'Service millésimé exclusif & verrerie cristalline', status: 'filled' },
      ],
    },
    {
      time: '20h30',
      title: 'Le Dîner Monochrome & Toasts',
      narrativeScript: 'Table continue de quarante mètres sans nappe, chandeliers laqués noirs et bougies blanches. Le service s’exécute avec une précision chorégraphiée.',
      ambianceDetail: 'Vaisselle céramique mate, accords mets-vins de prestige sans coupure.',
      image: '/images/table-noir.jpg',
      vendorRoles: [
        { role: 'Traiteur Haute Gastronomie', mission: '4 temps monochromes, vaisselle mate sans nappe', status: 'filled' },
        { role: 'Scénographe de Table', mission: 'Alignement au millimètre des 40 chandeliers', status: 'filled' },
      ],
    },
    {
      time: '23h30',
      title: 'Première Danse & Fête Zénithale',
      narrativeScript: 'Un projecteur unique découpe le cercle au centre de la salle obscure. Les mariés ouvrent le bal dans une intimité cinématographique pure.',
      ambianceDetail: 'Beats profonds, élégance nocturne et liberté absolue.',
      image: '/images/danse.jpg',
      vendorRoles: [
        { role: 'DJ Sound Designer Minimal', mission: 'Set house feutrée puis techno mélodique pointue', status: 'filled' },
        { role: 'Régisseur Faisceau Zénithal', mission: 'Poursuite découpe faisceau 4000K sans bavure', status: 'open', compensationHint: 'Régie nuit 23h-04h' },
      ],
    },
  ],

  // 2. DESERT MOTEL (Vegas rétro, piscine vide turquoise, Joshua Tree)
  'desert': [
    {
      time: '17h30',
      title: 'Vœux dans la Piscine Vide',
      narrativeScript: '38°C à Joshua Tree. Un vieux motel abandonné, deux chaises en rotin au fond d’une piscine carrelée turquoise. Un oui réverbéré au cœur du désert.',
      ambianceDetail: 'Chaleur qui tremble à l’horizon, robe vintage et bottes en cuir.',
      image: '/images/desert-pool-vows.jpg',
      vendorRoles: [
        { role: 'Cinéaste Super 8mm Réel', mission: 'Captation argentique pellicule Kodak 50D & projecteur vintage', status: 'open', compensationHint: 'Reportage journée + numérisation 4K' },
        { role: 'Guide Elopement Parc Désert', mission: 'Autorisations de tournage et accès piscine privatisée', status: 'filled' },
        { role: 'Chineur Fauteuils Rotin 70s', mission: 'Mobilier mid-century résistant aux fortes chaleurs', status: 'filled' },
      ],
    },
    {
      time: '20h00',
      title: 'Tacos & Bières sous le Néon Ambré',
      narrativeScript: 'L’enseigne MOTEL s’allume en jaune ambré. Pas de protocole : des glacières remplies de bières fraîches et des tacos croustillants servis sur le capot.',
      ambianceDetail: 'Coucher de soleil pourpre sur les cactus et son blues rétro crépitant.',
      image: '/images/desert-tacos-neon.jpg',
      vendorRoles: [
        { role: 'Food Truck Tacos Artisanal', mission: 'Al pastor au feu de bois, tortillas fraîches pressées minute', status: 'open', compensationHint: 'Service 60 personnes · Food truck vintage' },
        { role: 'Mixologue Bar Mezcal', mission: 'Cocktails fumés piment d’Espelette et agrumes sauvages', status: 'filled' },
      ],
    },
    {
      time: '22h30',
      title: 'Danse Rétro sous la Voûte Étoilée',
      narrativeScript: 'Un tourne-disque vintage branché sur batterie nomade, éclairé par les phares de la décapotable. Première danse solitaire sous la Voie Lactée.',
      ambianceDetail: 'Vent tiède du désert, ciel noir d’encre constellé d’étoiles.',
      image: '/images/desert-star-dance.jpg',
      vendorRoles: [
        { role: 'DJ Vinyle Nomade', mission: 'Platines vintage alimentées sur batterie, sélection funk/soul 70s', status: 'open', compensationHint: 'Set nocturne désert 22h-02h' },
        { role: 'Loueur Décapotable Vintage', mission: 'Fourniture Ford Mustang ou Cadillac convertible 1968', status: 'filled' },
      ],
    },
  ],

  // 3. BÉTON BRUT (Bunker, chapelle de béton, radical)
  'brutal': [
    {
      time: '16h30',
      title: 'Le Oui dans le Béton',
      narrativeScript: 'Pas d’arche de fleurs. Un cercle tracé à la craie sur la dalle d’un bunker industriel. Les pas résonnent contre le béton brut.',
      ambianceDetail: 'Lumière rasante qui coupe les arêtes du béton, zéro pivoine.',
      image: '/images/brutal-bunker-vows.jpg',
      vendorRoles: [
        { role: 'Light Designer Architectural', mission: 'Faisceaux rasants découpe béton et lasers sodium', status: 'open', compensationHint: 'Scénographie complète lieu brut' },
        { role: 'Céramiste Mobilier Béton', mission: 'Bancs monolithes coulés sur mesure', status: 'filled' },
      ],
    },
    {
      time: '19h00',
      title: 'Bouchées Brutes & Feu Vif',
      narrativeScript: 'Pas de petits fours sous cloche. Cuisson primitive au chalumeau et feu vif, servie directement sur des plateaux minéraux.',
      ambianceDetail: 'Textures fumées, verres droits sans pied, bières artisanales locales.',
      image: '/images/terrasse.jpg',
      vendorRoles: [
        { role: 'Chef Brasero / Chalumeau', mission: 'Cuisson live textures fumées et braises sans nappage', status: 'open', compensationHint: 'Animation culinaire live' },
      ],
    },
    {
      time: '22h00',
      title: 'Néons Sodium & Stroboscope',
      narrativeScript: 'Le bunker bascule dans la pénombre. Les lasers découpent la fumée lourde et la fête devient clubbing berlinois sans compromis.',
      ambianceDetail: 'Basses telluriques, tenues sombres et liberté absolue.',
      image: '/images/club-amour.jpg',
      vendorRoles: [
        { role: 'DJ Clubbing Berlinois', mission: 'Set 130 BPM progressif sur sound system Funktion-One', status: 'open', compensationHint: 'Set clubbing 22h-04h' },
      ],
    },
  ],

  // 4. CLUB AMOUR (Néons roses, rave, stroboscope 02h17)
  'club': [
    {
      time: '23h00',
      title: 'Ouverture des Portes à Minuit',
      narrativeScript: 'On se rassemble quand le monde s’endort : fumée, néon magenta et guestlist exclusive à l’entrée.',
      ambianceDetail: 'Dress code club kid, paillettes, cuir et vestiaire vintage.',
      image: '/images/club-amour.jpg',
      vendorRoles: [
        { role: 'Physionomiste Club', mission: 'Accueil personnalisé au tampon encreur ultraviolet', status: 'open', compensationHint: 'Accueil soirée 23h-01h' },
      ],
    },
    {
      time: '00h30',
      title: 'Échange des Vœux sous Stroboscope',
      narrativeScript: 'Deux minutes de silence total sur le dancefloor. Un baiser sous les flashs roses. Le oui le plus vibrant de la nuit.',
      ambianceDetail: 'Machine à fumée lourde et acclamations de rave.',
      image: '/images/club-strobe-kiss.jpg',
      vendorRoles: [
        { role: 'Régisseur Machine à Fumée Lourde', mission: 'Nappe de brouillard ras du sol à la seconde exacte', status: 'filled' },
      ],
    },
    {
      time: '02h17',
      title: 'Le Pic de Nuit 02h17',
      narrativeScript: 'L’heure symbolique où ils se sont rencontrés. Le track culte démarre, les confettis métallisés inondent la salle jusqu’au jour.',
      ambianceDetail: 'Énergie pure, shots signatures et after jusqu’au petit matin.',
      image: '/images/danse.jpg',
      vendorRoles: [
        { role: 'DJ Résident Nuit Blanche', mission: 'Transition hymne 02h17 et closing matinal', status: 'filled' },
      ],
    },
  ],

  // 5. CHÂTEAU MODERNE (Pierre blonde, élégance française)
  'chateau-moderne': [
    {
      time: '15h00',
      title: 'L’Allée des Tilleuls & Cérémonie en Cour d’Honneur',
      narrativeScript: 'Arrivée sous la pierre blonde du domaine. La clarté du design contemporain habille le classicisme à la française sans lourdeur.',
      ambianceDetail: 'Voilages blancs légers, parfum d’écorce et dorures feutrées.',
      image: '/images/chateau-tilleuls.jpg',
      vendorRoles: [
        { role: 'Quatuor à Cordes Contemporain', mission: 'Reprises réarrangées pop/classique sous les tilleuls', status: 'open', compensationHint: 'Cérémonie & accueil 2h' },
        { role: 'Régisseur Domaine Historique', mission: 'Gestion des flux cour pavée et tentes cristal', status: 'filled' },
      ],
    },
    {
      time: '18h00',
      title: 'Champagne en Terrasse Haute',
      narrativeScript: 'Coupes de champagne taillées en cristal sur la cour pavée pendant que les musiciens distillent un jazz feutré au coucher du soleil.',
      ambianceDetail: 'Ateliers de découpe et gougères tièdes au crépuscule.',
      image: '/images/chateau-terrasse-champagne.jpg',
      vendorRoles: [
        { role: 'Chef Traiteur Étoilé', mission: 'Bouchées haute gastronomie et service au plateau d’argent', status: 'filled' },
        { role: 'Trio Jazz Feutré', mission: 'Standard bebop et bossa nova au coucher du soleil', status: 'open', compensationHint: 'Cocktail 18h-20h' },
      ],
    },
    {
      time: '23h15',
      title: 'La Pièce Montée Spectaculaire & Bal',
      narrativeScript: 'Les feux de bengale crépitent sur les remparts à la seconde où le refrain musical explose, ouvrant la nuit dans le grand salon.',
      ambianceDetail: 'Chariot doré éclairé aux torches, champagne sabré et fête jusqu’à l’aube.',
      image: '/images/chateau-bengale-bal.jpg',
      vendorRoles: [
        { role: 'Artificier Pyrotechnique Certifié', mission: 'Cascades de bengale dorées synchronisées sur le refrain DJ', status: 'open', compensationHint: 'Tir pyrotechnique 23h15' },
        { role: 'Chef Pâtissier Haute Couture', mission: 'Pièce architecturale croquembouche moderne au chocolat fumé', status: 'filled' },
      ],
    },
  ],

  // 8. DÔME ABYSSAL
  'abyssal': [
    {
      time: '17h00',
      title: 'L’Immersion & Vœux Subaquatiques',
      narrativeScript: 'Descente silencieuse dans la coupole vitrée à 15 mètres de fond. L’océan s’obscurcit alors que les vœux sont prononcés au milieu des bancs de poissons argentés.',
      ambianceDetail: 'Lumière bleutée naturelle, réverbération caustique pure et tenues épurées.',
      image: '/images/submarine-vows.jpg',
      vendorRoles: [
        { role: 'Ingénieur Sécurité Subaquatique', mission: 'Coordination descente et pressurisation dôme', status: 'filled' },
        { role: 'Vidéaste Haute Sensibilité Abyssale', mission: 'Captation lumière naturelle sans projecteur violent', status: 'open', compensationHint: 'Reportage sous-marin spécialisé' },
      ],
    },
    {
      time: '20h30',
      title: 'Le Dîner Sous-Marin aux Chandelles d’Algues',
      narrativeScript: 'Table circulaire face aux grands fonds marins illuminés de douce bioluminescence. Champagne minéral et mets iodés rares.',
      ambianceDetail: 'Ambiance céleste sous-marine, calme souverain.',
      image: '/images/table-noir.jpg',
      vendorRoles: [
        { role: 'Chef Haute Cuisine Marine', mission: 'Menu 5 temps algues fraîches et ormeaux sauvages', status: 'open', compensationHint: 'Service d’exception 20 couverts' },
      ],
    },
  ],

  // 9. TRAIN DE NUIT IMPÉRIAL
  'orient-express': [
    {
      time: '18h30',
      title: 'Le Départ en Gare & Vœux en Mouvement',
      narrativeScript: 'Sifflet du train, la rame d’époque s’élance dans la nuit. Les mariés échangent leurs alliances dans la voiture-salon au rythme régulier des rails.',
      ambianceDetail: 'Boiseries acajou, reflets de laiton et paysages alpins qui défilent à 100 km/h.',
      image: '/images/train-vows.jpg',
      vendorRoles: [
        { role: 'Affréteur Ligne Ferroviaire Prestige', mission: 'Créneau circulation et privatisation rame complète', status: 'filled' },
        { role: 'Pianiste Voie Étroite', mission: 'Piano quart de queue dans la voiture-bar en mouvement', status: 'open', compensationHint: 'Prestation nuit complète' },
      ],
    },
    {
      time: '21h00',
      title: 'Dîner Étoilé au Rythme du Rail',
      narrativeScript: 'Argenterie scintillante, verres en cristal qui tintent doucement avec le dévers des virages. Toasts sous les lustres Art Déco.',
      ambianceDetail: 'Élégance suprême des grands voyages, velours et champagne millésimé.',
      image: '/images/champagne.jpg',
      vendorRoles: [
        { role: 'Chef Gastronome Rame Étoilée', mission: 'Menu gastronomique en cuisine étroite embarquée', status: 'filled' },
      ],
    },
  ],

  // 11. FÊTE DE DIVORCE & DÉ-MARIAGE (La Renaissance Joyeuse)
  // 12. MARIAGE IMPROVISÉ · 48H (Plan B héroïque)
  'last-minute': [
    {
      time: '14h00',
      title: 'L’Alerte 48H & Appel Général',
      narrativeScript: 'Décision prise un jeudi matin. Deux billets, SMS groupé envoyé aux proches, lieu d’exception dégoté par le régisseur d’urgence.',
      ambianceDetail: 'Énergie brute, spontanéité absolue, zéro protocole compassé.',
      image: '/images/couple-paris.jpg',
      vendorRoles: [
        { role: 'Régisseur Urgence Plan B / 48H', mission: 'Négociation du lieu minute et couverture logistique express', status: 'filled' },
      ],
    },
    {
      time: '18h00',
      title: 'Vœux Spontanés sur le Pouce',
      narrativeScript: 'Pas d’arche de fleurs : un banc public en pierre, une verrière ou un bar privatisé à la volée. Le oui le plus vibrant et imprévu de leur vie.',
      ambianceDetail: 'Fleurs glanées le matin au marché, rires complices et champagne frais.',
      image: '/images/champagne.jpg',
      vendorRoles: [
        { role: 'Photographe Sniper Spontané', mission: 'Reportage live argentique instinctif sans poses', status: 'open', compensationHint: 'Mission express 4h' },
      ],
    },
  ],
  'traditionnel': [
    {
      time: '15h00',
      title: 'La Messe et le Cortège',
      narrativeScript: 'Entrée au son de l’orgue, les familles debout dans l’allée centrale, puis la sortie sous une pluie de pétales sur le parvis.',
      ambianceDetail: 'Cierges, grand orgue et chemise de fleurs blanches sur le parvis.',
      image: '/images/traditionnel.jpg',
      vendorRoles: [
        { role: 'Wedding Planner Cérémonie & Réception', mission: 'Coordination église, cortège et transfert vers le manoir', status: 'filled' },
        { role: 'Organiste & Chorale', mission: 'Accompagnement musical de la messe', status: 'open', compensationHint: 'Prestation 2h sur place' },
      ],
    },
    {
      time: '19h30',
      title: 'Le Banquet Assis',
      narrativeScript: 'Cent quatre-vingts convives, cinq services, un plan de table calligraphié et un discours entre chaque plat.',
      ambianceDetail: 'Nappes longues, bougies hautes, service à l’assiette en cadence.',
      image: '/images/champagne.jpg',
      vendorRoles: [
        { role: 'Traiteur Banquet Traditionnel', mission: 'Repas assis cinq services et pièce montée', status: 'filled' },
        { role: 'Orchestre de Bal & Animateur', mission: 'Ouverture de bal et animation du dîner', status: 'open', compensationHint: 'Forfait soirée complète' },
      ],
    },
    {
      time: '11h00',
      title: 'Le Brunch du Lendemain',
      narrativeScript: 'Pain perdu, jus pressés et récits de la veille, sous les tilleuls du manoir, avant les au revoir.',
      ambianceDetail: 'Tables dépareillées, paniers de viennoiseries et café en continu.',
      image: '/images/chateau-tilleuls.jpg',
      vendorRoles: [
        { role: 'Brunch & Pâtissier du Lendemain', mission: 'Brunch servi sous les tilleuls jusqu’à 14h00', status: 'open', compensationHint: 'Service du matin' },
      ],
    },
  ],
  'corse': [
    {
      time: '17h30',
      title: 'Le Oui sur la Crête',
      narrativeScript: 'Un cercle de pierres sèches, la mer en contrebas, et les voix polyphoniques qui montent du vallon pendant les vœux.',
      ambianceDetail: 'Maquis en fleurs, vent d’ouest et lumière rasante sur les aiguilles.',
      image: '/images/corse.jpg',
      vendorRoles: [
        { role: 'Groupe Polyphonique Corse', mission: 'Chants pendant la cérémonie et au coucher du soleil', status: 'filled' },
      ],
    },
    {
      time: '20h00',
      title: 'Le Cochon de Lait',
      narrativeScript: 'La broche tourne depuis midi. On découpe sur la table de bois, on sert avec les pommes de terre au maquis et le vin de Patrimonio.',
      ambianceDetail: 'Feu de bois, lanterne tempête et longues tables sur la dalle de pierre.',
      image: '/images/danse.jpg',
      vendorRoles: [
        { role: 'Berger Hôte & Cuisinier au Feu', mission: 'Cochon de lait à la broche et fromages de brebis', status: 'filled' },
      ],
    },
    {
      time: '11h00',
      title: 'La Baignade du Lendemain',
      narrativeScript: 'Descente au sentier, baignade en calanque, café au feu et retour tranquille avant la chaleur.',
      ambianceDetail: 'Eau à 19 °C, galets blancs, personne n’avait prévu de maillot.',
      image: '/images/terrasse.jpg',
      vendorRoles: [
        { role: 'Guide Randonnée & Baignade', mission: 'Descente encadrée et baignade du lendemain', status: 'open', compensationHint: 'Demi-journée encadrée' },
      ],
    },
  ],
  'reunion': [
    {
      time: '16h00',
      title: 'L’Accueil au Rougail',
      narrativeScript: 'On arrive par la varangue, on goûte le rougail d’accueil et on se met à l’ombre des frangipaniers pendant que la famille s’installe.',
      ambianceDetail: 'Ti-punch, achards et serviettes humides pour la chaleur.',
      image: '/images/reunion.jpg',
      vendorRoles: [
        { role: 'Chef Créole Marmite & Carry', mission: 'Accueil, rougail et buffet créole', status: 'filled' },
      ],
    },
    {
      time: '21h00',
      title: 'Le Maloya',
      narrativeScript: 'Les tambours entrent après le dessert. Le roulèr donne le rythme, les invités forment le cercle et personne ne s’assoit plus.',
      ambianceDetail: 'Roulèr, kayanm et lumières basses sur le jardin tropical.',
      image: '/images/danse.jpg',
      vendorRoles: [
        { role: 'Groupe Séga & Maloya', mission: 'Concert live jusqu’à l’aube', status: 'filled' },
      ],
    },
    {
      time: '10h00',
      title: 'Le Lendemain à la Mer',
      narrativeScript: 'Petit-déjeuner sous les palmiers puis plage de l’Ermitage : la journée suit la marée, personne ne regarde l’heure.',
      ambianceDetail: 'Boules de coco, lagon tiède et sieste sous les filaos.',
      image: '/images/terrasse.jpg',
      vendorRoles: [
        { role: 'Fleuriste Tropical & Décoration', mission: 'Décor de plage et de varangue', status: 'open', compensationHint: 'Prestation deux jours' },
      ],
    },
  ],
  'new-york': [
    {
      time: '18h30',
      title: 'Le Dîner sur le Toit',
      narrativeScript: 'On monte par l’ascenseur de service, la skyline est déjà orange, les lumières s’allument entre les réservoirs d’eau au moment où l’on s’assoit.',
      ambianceDetail: 'Golden hour sur Manhattan, bar à huîtres et verres de champagne.',
      image: '/images/new-york.jpg',
      vendorRoles: [
        { role: 'Chef & Bar à Cocktails', mission: 'Dîner sur le toit et bar à cocktails', status: 'filled' },
        { role: 'Saxophoniste & DJ Set', mission: 'Cocktail au saxophone puis set jusqu’à la fermeture', status: 'filled' },
      ],
    },
    {
      time: '23h00',
      title: 'Le Food Truck',
      narrativeScript: 'Quand la ville baisse d’un ton, le camion s’installe dans la rue en bas et remonte les burgers par l’ascenseur.',
      ambianceDetail: 'Néons, papier kraft et musique qui ne s’arrête pas.',
      image: '/images/hero-wedding.jpg',
      vendorRoles: [
        { role: 'Food Truck de Nuit', mission: 'Service tardif depuis la rue', status: 'open', compensationHint: 'Service 2h' },
      ],
    },
    {
      time: '11h30',
      title: 'Le Brunch dans un Diner',
      narrativeScript: 'Banquettes rouges, pancakes et café sans fin : les adieux américains, avec les photos de la veille passées de main en main.',
      ambianceDetail: 'Juke-box, sirops d’érable et café en mug épais.',
      image: '/images/terrasse.jpg',
      vendorRoles: [
        { role: 'Diner Partenaire', mission: 'Brunch privatif du lendemain', status: 'open', compensationHint: 'Salle privatisée 3h' },
      ],
    },
  ],
  'vegas': [
    {
      time: '22h00',
      title: 'La Chapelle Néon',
      narrativeScript: 'Vingt minutes, une arche de fleurs, Elvis qui officie et la famille qui rit du début à la fin.',
      ambianceDetail: 'Néons roses, flashs et orgue d’un autre temps.',
      image: '/images/vegas.jpg',
      vendorRoles: [
        { role: 'Elvis Officiant & Maître de Cérémonie', mission: 'Cérémonie en vingt minutes sous les néons', status: 'filled' },
        { role: 'Photographe Néon', mission: 'Portraits de nuit et tirages sépia', status: 'filled' },
      ],
    },
    {
      time: '23h30',
      title: 'Champagne au Strip',
      narrativeScript: 'La limousine remonte le boulevard, on sabre une bouteille au-dessus du strip et les taxis jaunes klaxonnent au passage.',
      ambianceDetail: 'Enseignes géantes, vitres baissées, musique à fond.',
      image: '/images/champagne.jpg',
      vendorRoles: [
        { role: 'Chauffeur de Limousine', mission: 'Tour du Strip et champagne à bord', status: 'filled' },
      ],
    },
    {
      time: '01h30',
      title: 'Le Buffet de Nuit',
      narrativeScript: 'Retour au chapiteau, buffet nocturne, machine à sous pour tirer le gâteau et piste de danse jusqu’à trois heures.',
      ambianceDetail: 'Sliders, glace pilée et lumières roses jusqu’au bout de la nuit.',
      image: '/images/danse.jpg',
      vendorRoles: [
        { role: 'Buffet Nocturne & Bar', mission: 'Service de nuit et bar permanent', status: 'open', compensationHint: 'Service jusqu’à 03h' },
      ],
    },
  ],

};

/**
 * Les univers qui n'ont pas de scénario écrit reçoivent trois scènes tirées de
 * leur propre contenu : leur cérémonie, leur dîner et leur lendemain. Rien de
 * générique, et jamais les scènes d'un autre univers.
 */
function scenesDepuisLeContenu(styleId: string): ThemeTimelineScene[] {
  const style = styleById(styleId);
  const contenu = contentFor(style);
  const image = () => style.image;

  return [
    {
      time: '16h00',
      title: `La cérémonie · ${contenu.couple.venue}`,
      narrativeScript: contenu.hero.subtitle,
      ambianceDetail: contenu.couple.season,
      image: image(),
      vendorRoles: [{ role: style.humanMissions[0]?.role ?? 'Prestataire', mission: style.humanMissions[0]?.mission ?? '', status: 'open' }],
    },
    {
      time: '20h00',
      title: contenu.menu.service,
      narrativeScript: contenu.menu.items.join(' · '),
      ambianceDetail: `${contenu.couple.guests} invités · ${contenu.couple.dressCode}`,
      image: image(),
      vendorRoles: [{ role: style.humanMissions[1]?.role ?? 'Traiteur', mission: style.humanMissions[1]?.mission ?? '', status: 'filled' }],
    },
    {
      time: '11h00',
      title: 'Le lendemain',
      narrativeScript: contenu.infos.map((i) => `${i.label} : ${i.value}`).join(' · '),
      ambianceDetail: contenu.cagnotte.purpose,
      image: image(),
      vendorRoles: [{ role: style.humanMissions[2]?.role ?? 'Prestataire', mission: style.humanMissions[2]?.mission ?? '', status: 'open' }],
    },
  ];
}

export function getScenesForStyle(styleId: string): ThemeTimelineScene[] {
  return THEME_TIMELINE_SCENARIOS[styleId] ?? scenesDepuisLeContenu(styleId);
}
