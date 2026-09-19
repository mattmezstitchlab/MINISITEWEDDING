/**
 * LES SIGNATURES D'UNIVERS
 *
 * Chaque univers a un geste que les autres n'ont pas. Le Supermarché 22H a son
 * ticket de caisse ; Las Vegas a sa chapelle rose et ses néons ; la laverie a
 * son hublot ; New York a son plan de ligne. Ce fichier dit, pour chaque
 * univers, quelle est cette signature — sa couleur de fond, son accent, son
 * geste, et le module qui le raconte.
 *
 * Le mini-site applique la signature : le fond change, l'accent passe au néon,
 * et le module s'affiche juste sous le hero. Rien n'est décoratif : les lignes
 * du module viennent des scènes, des informations et du programme de l'univers.
 */

import { getScenesForStyle } from './themeTimelineScenarios';
import { contentFor } from './universeContent';
import { styleById } from './weddingStyles';

import type { CSSProperties } from 'react';

export type SignatureKind =
  | 'enseigne'
  | 'affiche'
  | 'faire-part'
  | 'etiquettes'
  | 'ligne'
  | 'plan'
  | 'hublot'
  | 'maree';

export interface SignatureLigne {
  label: string;
  valeur: string;
}

export interface SignatureModuleData {
  eyebrow: string;
  titre: string;
  lignes: SignatureLigne[];
  note: string;
}

export interface ThemeSignature {
  kind: SignatureKind;
  /** Le nom du geste, tel qu'il s'annonce sur l'accueil et dans le défilé. */
  nom: string;
  /** Une phrase, pour dire l'originalité en un souffle. */
  phrase: string;
  fond: string;
  encre: string;
  accent: string;
  /** Les titres s'allument : le geste du néon. */
  lueur: boolean;
  module: SignatureModuleData;
}

/**
 * Le fond et l'encre de la signature, prêts pour le conteneur du mini-site :
 * le thème repeint la page, et l'accent passe au néon quand il y en a un.
 */
export function signatureStyle(signature?: ThemeSignature): CSSProperties | undefined {
  if (!signature) return undefined;
  return {
    background: signature.fond,
    color: signature.encre,
    '--vp-accent': signature.accent,
    '--vp-ink': signature.encre,
  } as CSSProperties;
}

/** Les trois premiers temps de l'univers, en lignes de module. */
function temps(styleId: string): SignatureLigne[] {
  return getScenesForStyle(styleId)
    .slice(0, 3)
    .map((s) => ({ label: s.time, valeur: s.title }));
}

/** Un fait du contenu de l'univers — lieu, saison, tenue. */
function fait(styleId: string, champ: 'venue' | 'season' | 'dressCode' | 'city'): SignatureLigne {
  const couple = contentFor(styleById(styleId)).couple;
  const labels: Record<string, string> = {
    venue: 'Lieu', season: 'Saison', dressCode: 'Tenue', city: 'Ville',
  };
  return { label: labels[champ], valeur: couple[champ] };
}

const FIXES: Record<string, ThemeSignature> = {
  traditionnel: {
    kind: 'faire-part',
    nom: 'Faire-part & livret de messe',
    phrase: 'Le carton ivoire, les cinq services, l’ouverture de bal : tout est écrit comme autrefois.',
    fond: '#FBF7EF', encre: '#23201B', accent: '#B08D57', lueur: false,
    module: {
      eyebrow: 'Le faire-part',
      titre: 'Église, banquet, cortège',
      lignes: [
        { label: 'Cérémonie', valeur: temps('traditionnel')[0]?.valeur ?? 'Onze heures, à l’église' },
        fait('traditionnel', 'venue'),
        { label: 'Bal', valeur: 'Ouverture de bal, puis dancefloor jusqu’à 4h00' },
      ],
      note: 'Le livret de messe, imprimé, est déjà dans votre poche.',
    },
  },

  corse: {
    kind: 'faire-part',
    nom: 'Chants & bergerie',
    phrase: 'Trois voix, un cochon de lait à la broche, et la montagne qui écoute.',
    fond: '#F7F3EA', encre: '#2A2620', accent: '#7C6A4A', lueur: false,
    module: {
      eyebrow: 'La polyphonie',
      titre: 'Bassu, seconda, terza',
      lignes: [
        { label: 'Première voix', valeur: 'Le chant ouvre au coucher du soleil' },
        { label: 'Réponse', valeur: 'Deux voix montent du fond de la salle' },
        { label: 'Repas', valeur: 'Broche au feu de bois, fromages de brebis' },
      ],
      note: 'Chaque chant a son heure, et chaque heure a sa voix.',
    },
  },

  'chateau-moderne': {
    kind: 'faire-part',
    nom: 'Invitation gravée',
    phrase: 'Une invitation gravée, un domaine, et un régisseur qui tient la minute.',
    fond: '#F8F8F6', encre: '#1E1F22', accent: '#8C7A5B', lueur: false,
    module: {
      eyebrow: 'L’invitation',
      titre: 'Le domaine, pièce par pièce',
      lignes: [
        fait('chateau-moderne', 'venue'),
        { label: 'Cérémonie', valeur: temps('chateau-moderne')[0]?.valeur ?? 'Sous les tilleuls' },
        { label: 'Dîner', valeur: 'Haute gastronomie, service à l’assiette' },
      ],
      note: 'Carton gravé, encre à chaud, rien qui brille.',
    },
  },

  reunion: {
    kind: 'etiquettes',
    nom: 'Marché créole',
    phrase: 'Des étiquettes comme au marché : carry, marmite, séga — et le nom de chacun dessus.',
    fond: '#FFF8EC', encre: '#2B241C', accent: '#D2691E', lueur: false,
    module: {
      eyebrow: 'Les étiquettes du jour',
      titre: 'Ce qui mijote',
      lignes: [
        { label: 'Marmite', valeur: 'Carry de poulet, cuisiné la veille' },
        { label: 'Tablée', valeur: 'Grande tablée, à partager, sans plan de table' },
        { label: 'Bal', valeur: 'Séga et maloya, jusqu’au bout de la nuit' },
      ],
      note: 'Écrites à la main, posées sur les plats, en créole et en français.',
    },
  },

  brocante: {
    kind: 'etiquettes',
    nom: 'Étiquettes & prix barrés',
    phrase: 'Chaque objet de la table a son étiquette, son prix, et l’histoire qui va avec.',
    fond: '#FAF6EE', encre: '#2A2418', accent: '#B4472B', lueur: false,
    module: {
      eyebrow: 'Les étiquettes',
      titre: 'Chiné, négocié, gardé',
      lignes: [
        { label: 'Lot n°1', valeur: 'Vaisselle dépareillée — 24 pièces' },
        { label: 'Lot n°2', valeur: 'Chaises de ferme, réparées' },
        { label: 'Lot n°3', valeur: 'Nappes brodées, taches d’origine' },
      ],
      note: 'Prix barré, prix du cœur : les invités repartent avec une pièce.',
    },
  },

  'garden-party': {
    kind: 'etiquettes',
    nom: 'Herbier',
    phrase: 'Le menu pousse sur place : chaque plat porte son étiquette botanique.',
    fond: '#F4F8F1', encre: '#22271F', accent: '#4F7A3A', lueur: false,
    module: {
      eyebrow: 'L’herbier',
      titre: 'Ce qui pousse ce jour-là',
      lignes: [
        { label: 'Feuillage', valeur: 'Branches coupées le matin même' },
        { label: 'Cueillette', valeur: 'Herbes du jardin, cueillies par les invités' },
        { label: 'Table', valeur: 'Grande tablée sous les arbres' },
      ],
      note: 'Étiquettes piquées dans les pots, écrites au crayon.',
    },
  },

  'new-york': {
    kind: 'ligne',
    nom: 'Plan de ligne',
    phrase: 'La journée est une ligne de métro : les stations sont les horaires.',
    fond: '#F7F7F5', encre: '#1B1B1F', accent: '#F2A900', lueur: false,
    module: {
      eyebrow: 'Line 7 · Uptown',
      titre: 'Votre ligne du jour',
      lignes: temps('new-york'),
      note: 'Une station par moment, et rien à rater : le dernier train attend.',
    },
  },

  'orient-express': {
    kind: 'ligne',
    nom: 'Voie & wagons',
    phrase: 'Un sillon privé, des wagons nommés, et le dîner qui avance en même temps que le train.',
    fond: '#F6F1E7', encre: '#231E18', accent: '#7B5E3B', lueur: false,
    module: {
      eyebrow: 'Voiture 3 · Sillon privé',
      titre: 'Le convoi du jour',
      lignes: [
        { label: 'Départ', valeur: temps('orient-express')[0]?.valeur ?? 'Départ quai 3' },
        { label: 'Dîner', valeur: 'Service en voiture restaurant, à 140 km/h' },
        { label: 'Arrivée', valeur: temps('orient-express')[2]?.valeur ?? 'Arrivée de nuit' },
      ],
      note: 'Billet nominatif, voiture indiquée, places numérotées.',
    },
  },

  vegas: {
    kind: 'enseigne',
    nom: 'Chapelle rose & néon',
    phrase: 'Une chapelle rose, des néons, Elvis comme officiant — et le mariage en 20 minutes.',
    fond: '#FFE3F1', encre: '#2B0E20', accent: '#FF2E93', lueur: true,
    module: {
      eyebrow: 'Drive-in chapel · ouvert 24h',
      titre: 'La chapelle rose',
      lignes: [
        { label: 'Cérémonie', valeur: temps('vegas')[0]?.valeur ?? 'Vingt minutes, montre en main' },
        { label: 'Officiant', valeur: 'Elvis, en combinaison blanche' },
        { label: 'Suite', valeur: 'Photos néon, limousine, retour au casino' },
      ],
      note: 'Le néon s’allume quand vous dites oui.',
    },
  },

  club: {
    kind: 'enseigne',
    nom: 'Line-up & strobes',
    phrase: 'Une affiche de club : le line-up, l’heure de chaque set, la fermeture au petit matin.',
    fond: '#0C0C12', encre: '#F3F1FF', accent: '#39FFB0', lueur: true,
    module: {
      eyebrow: 'Résident · toute la nuit',
      titre: 'Le line-up',
      lignes: temps('club'),
      note: 'Portes 23h, fermeture quand la dernière platine s’arrête.',
    },
  },

  'rooftop-paris': {
    kind: 'enseigne',
    nom: 'Golden hour',
    phrase: 'Le toit, le coucher de soleil, le bar à bulles : une heure d’or et des néons bleus.',
    fond: '#FDF1E3', encre: '#2C2018', accent: '#FF7A45', lueur: true,
    module: {
      eyebrow: 'Golden hour · 20h40',
      titre: 'Le toit, avant la nuit',
      lignes: [
        { label: 'Montée', valeur: 'Ascenseur de service, par groupes de huit' },
        { label: 'Bar', valeur: 'Signature golden hour, verre à la main' },
        { label: 'Vue', valeur: 'Paris, plein ouest, sans filtre' },
      ],
      note: 'Vingt minutes de lumière parfaite — tout le reste est en néon.',
    },
  },

  'last-minute': {
    kind: 'enseigne',
    nom: 'Dernière minute',
    phrase: 'Tout est décidé en 48h : le programme s’affiche comme un flash info.',
    fond: '#FFF6E5', encre: '#231A0C', accent: '#E63946', lueur: true,
    module: {
      eyebrow: 'Flash · J-1',
      titre: 'Le plan de la dernière minute',
      lignes: [
        { label: 'H-48', valeur: 'Lieu trouvé, prestataires appelés' },
        { label: 'H-24', valeur: 'Menus validés au téléphone' },
        { label: 'H-2', valeur: 'Chaises posées, néons branchés' },
      ],
      note: 'Rien n’est improvisé : tout est décidé vite.',
    },
  },

  cinema: {
    kind: 'affiche',
    nom: 'Séance & affiche',
    phrase: 'Le mariage est une séance : affiche, horaires, place numérotée, générique à la fin.',
    fond: '#F5F0E6', encre: '#1A1A1A', accent: '#C1121F', lueur: false,
    module: {
      eyebrow: 'Séance unique · salle 1',
      titre: 'Le film du jour',
      lignes: [
        { label: 'Ouverture', valeur: temps('cinema')[0]?.valeur ?? 'Ouverture des portes' },
        { label: 'Projection', valeur: 'Le film de leurs dix ans, 22 minutes' },
        { label: 'Générique', valeur: 'Crédits au générique de fin, sur grand écran' },
      ],
      note: 'Affiche imprimée, sérigraphiée, numérotée.',
    },
  },

  punk: {
    kind: 'affiche',
    nom: 'Affiche photocopiée',
    phrase: 'Une affiche scotchée sur les murs : trois groupes, un prix, pas de placement.',
    fond: '#F2F2EF', encre: '#141414', accent: '#D91E36', lueur: false,
    module: {
      eyebrow: 'Ce soir · entrée 5 €',
      titre: 'Trois groupes, un seul set',
      lignes: [
        { label: 'Ouverture', valeur: temps('punk')[0]?.valeur ?? 'Premier groupe, porte ouverte' },
        { label: 'Milieu', valeur: 'Deuxième groupe, ça commence à pousser' },
        { label: 'Tête d’affiche', valeur: 'Le groupe de leurs vingt ans' },
      ],
      note: 'Photocopié, scotché, arraché le lendemain.',
    },
  },

  'co-mariage': {
    kind: 'affiche',
    nom: 'Festival',
    phrase: 'Plusieurs mariages, deux scènes, un pass : le programme d’un festival.',
    fond: '#FDF6E9', encre: '#20180C', accent: '#3D7BFF', lueur: false,
    module: {
      eyebrow: 'Pass 3 jours · scène A & B',
      titre: 'Le programme du festival',
      lignes: [
        { label: 'Scène A', valeur: 'Les cérémonies, en continu' },
        { label: 'Scène B', valeur: 'Les premiers danses, une par heure' },
        { label: 'Food market', valeur: 'Six chefs, un seul service' },
      ],
      note: 'Un pass, un bracelet, tous les mariages.',
    },
  },

  'noir-blanc': {
    kind: 'affiche',
    nom: 'Couverture de magazine',
    phrase: 'Tout est noir et blanc : une couverture, un sommaire, aucune couleur parasite.',
    fond: '#FFFFFF', encre: '#0B0B0B', accent: '#111111', lueur: false,
    module: {
      eyebrow: 'Numéro spécial · 100 pages',
      titre: 'Le sommaire',
      lignes: [
        { label: 'p. 12', valeur: 'Cérémonie — lumière naturelle' },
        { label: 'p. 38', valeur: 'Dîner — service à l’assiette' },
        { label: 'p. 74', valeur: 'Bal — black tie obligatoire' },
      ],
      note: 'Couverture imprimée au coup par coup, un exemplaire par invité.',
    },
  },

  brutal: {
    kind: 'plan',
    nom: 'Plan d’architecte',
    phrase: 'Du béton, des cotes exactes : le plan du lieu suffit à tout comprendre.',
    fond: '#F2F1EE', encre: '#191A1C', accent: '#FF4D00', lueur: false,
    module: {
      eyebrow: 'Plan d’implantation · échelle 1:100',
      titre: 'Le plan du jour',
      lignes: [
        { label: 'Zone A', valeur: 'Cérémonie — béton brut, 80 places' },
        { label: 'Zone B', valeur: 'Dîner — tables longues, 1 × 14 m' },
        { label: 'Cote', valeur: 'Scène à 6,20 m du bar' },
      ],
      note: 'Aucun ornement : la matière est le décor.',
    },
  },

  'foret-noire': {
    kind: 'plan',
    nom: 'Sentier & rituels',
    phrase: 'Un sentier balisé, des rituels numérotés, et le feu qui sert de repère.',
    fond: '#EFF2EC', encre: '#1C211A', accent: '#3F5D3A', lueur: false,
    module: {
      eyebrow: 'Sentier balisé · 9 étapes',
      titre: 'Les rituels',
      lignes: [
        { label: 'Étape 1', valeur: 'Entrée du sentier, à la lanterne' },
        { label: 'Étape 4', valeur: 'Le cercle de pierres, vœux échangés' },
        { label: 'Étape 9', valeur: 'Le feu, ouvert par les anciens' },
      ],
      note: 'Balises en bois, numérotées — on suit le sentier, on ne le cherche pas.',
    },
  },

  abyssal: {
    kind: 'hublot',
    nom: 'Hublot & paliers',
    phrase: 'On descend par paliers : hublot, pression, bioluminescence, remontée au dessert.',
    fond: '#EAF3F7', encre: '#0E1B26', accent: '#0A84FF', lueur: false,
    module: {
      eyebrow: 'Palier -12 m · hublot ouvert',
      titre: 'Les paliers de la descente',
      lignes: [
        { label: '-3 m', valeur: 'Mise à l’eau, gilets et lampes' },
        { label: '-12 m', valeur: 'Cérémonie devant le hublot' },
        { label: '-30 m', valeur: 'Dîner sous les méduses, lumière froide' },
      ],
      note: 'Remontée lente : une heure de palier pour tout raconter.',
    },
  },

  laverie: {
    kind: 'hublot',
    nom: 'Tambour 7',
    phrase: 'Une laverie, du pastel, des hublots qui tournent : chaque cycle est un moment de la soirée.',
    fond: '#EFF4F6', encre: '#182029', accent: '#5BA3C7', lueur: false,
    module: {
      eyebrow: 'Cycle 3 · essorage 1200 tours',
      titre: 'Les cycles de la soirée',
      lignes: [
        { label: 'Lavage', valeur: temps('laverie')[0]?.valeur ?? 'On arrive, le linge tourne' },
        { label: 'Adoucissant', valeur: 'Le cocktail, serviettes chaudes' },
        { label: 'Essorage', valeur: 'Bal sur sol qui vibre, 1200 tours' },
      ],
      note: 'Apportez votre linge sale : on le lave pendant la cérémonie.',
    },
  },

  cosmic: {
    kind: 'hublot',
    nom: 'Orbite',
    phrase: 'Le mariage vu depuis l’orbite : une trajectoire, des fenêtres de tir, un retour.',
    fond: '#0E1030', encre: '#EAEBFF', accent: '#8B7CFF', lueur: true,
    module: {
      eyebrow: 'Orbite basse · fenêtre de tir 22h12',
      titre: 'La trajectoire',
      lignes: [
        { label: 'Lancement', valeur: temps('cosmic')[0]?.valeur ?? 'Décollage à l’heure exacte' },
        { label: 'Apogée', valeur: 'Vœux échangés, plein cadre sur la Terre' },
        { label: 'Retour', valeur: 'Brunch du lendemain, gravité retrouvée' },
      ],
      note: 'Tout est calculé, rien n’est laissé au hasard.',
    },
  },

  'phare-atlantique': {
    kind: 'maree',
    nom: 'Marées & horaires',
    phrase: 'Tout se règle sur la marée : on monte au phare à marée basse, on dîne à marée haute.',
    fond: '#EDF5F6', encre: '#152025', accent: '#0F6E7A', lueur: false,
    module: {
      eyebrow: 'Marée · coefficient 105',
      titre: 'Les horaires du phare',
      lignes: [
        { label: 'Marée basse', valeur: temps('phare-atlantique')[0]?.valeur ?? 'On monte au phare à pied' },
        { label: 'Étale', valeur: 'Cérémonie au sommet, vue sur l’Atlantique' },
        { label: 'Marée haute', valeur: 'Dîner pendant que l’eau remonte' },
      ],
      note: 'Le phare ne s’allume qu’à la nuit : c’est le signal du bal.',
    },
  },

  desert: {
    kind: 'maree',
    nom: 'Horizon & caravane',
    phrase: 'Une caravane, un horizon, et la lumière qui change à chaque étape.',
    fond: '#FCF3E4', encre: '#2A2118', accent: '#C8791F', lueur: false,
    module: {
      eyebrow: 'Étape 2 · plein est',
      titre: 'Les étapes de la caravane',
      lignes: [
        { label: 'Départ', valeur: temps('desert')[0]?.valeur ?? 'Départ à l’aube, à froid' },
        { label: 'Halte', valeur: 'Thé, ombre portée, Super 8 tourne' },
        { label: 'Nuit', valeur: 'Dîner à la lanterne, ciel sans limite' },
      ],
      note: 'Rien à l’horizon pendant des kilomètres : c’est le décor.',
    },
  },
};

/**
 * La signature d'un univers. Le Supermarché 22H n'en a pas ici : son mini-site
 * entier est déjà un ticket de caisse (voir `themes/SupermarcheTicket.tsx`), et
 * l'univers vierge est justement celui qui n'a aucun geste — c'est sa promesse.
 */
export function signatureFor(styleId: string): ThemeSignature | undefined {
  return FIXES[styleId];
}

/** Le nom du geste, ou celui de l'univers quand il n'en a pas. */
export function signatureLabel(styleId: string): string {
  return FIXES[styleId]?.nom ?? styleById(styleId).name;
}

/** Toutes les signatures, pour la galerie. */
export const SIGNATURES = FIXES;

/** Les univers qui ont une signature, dans l'ordre du catalogue. */
export function universAvecSignature(): Array<{ id: string; nom: string; signature: ThemeSignature }> {
  return Object.keys(FIXES).map((id) => ({ id, nom: styleById(id).name, signature: FIXES[id] }));
}
