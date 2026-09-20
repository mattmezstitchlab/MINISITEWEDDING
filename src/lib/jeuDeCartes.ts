/**
 * LE JEU DE 54 — LE CALENDRIER D'AIME MAGAZINE
 *
 * Il y a une histoire que personne ne raconte deux fois de la même façon : le jeu
 * de cartes serait un calendrier. On compte **52 cartes comme les 52 semaines**,
 * **4 couleurs comme les 4 saisons**, **13 cartes par couleur comme les 13
 * semaines de chaque saison**, **12 figures comme les 12 mois** — et, en
 * additionnant les points, **364, plus les jokers, qui font les 365 ou 366 jours
 * de l'année**. Ce n'est pas une preuve : c'est une **symétrie**, et elle est
 * belle. (Voir `docs/noyau-reseau.md` §39 pour les sources.)
 *
 * Alors on s'en sert : **54 numéros** — les 52 semaines, et les **deux jokers**,
 * qui sont le jour de trop, celui où tout peut arriver (le 365ᵉ jour, et celui
 * des années bissextiles). Chaque semaine a **sa carte**, donc **sa couleur, sa
 * figure et son sens** : c'est le numéro d'AIME MAGAZINE.
 *
 * Et parce qu'un mariage ne se décide pas hors du temps, chaque semaine porte
 * aussi **son pas-de-temps** : ce que les gens faisaient autrefois à cette
 * période-là de l'année. Les temps clos, le mois de mai, les moissons, la lune.
 */

/* —————————————————————————— LES QUATRE SAISONS —————————————————————————— */

export interface Saison {
  id: 'printemps' | 'ete' | 'automne' | 'hiver';
  nom: string;
  /** La couleur du jeu de cartes : chaque saison a la sienne. */
  couleur: 'coeur' | 'carreau' | 'trefle' | 'pique';
  symbole: string;
  /** Le sens qu'on lui donne ici — pour un mariage. */
  sens: string;
  /** Le fond uni de la couverture. */
  fond: string;
  /** La couleur du texte, sur ce fond. */
  encre: string;
  /** La création digitale posée au centre. */
  visuel: string;
  /** Les semaines de la saison. */
  semaines: [number, number];
}

export const SAISONS: Saison[] = [
  {
    id: 'printemps',
    nom: 'Printemps',
    couleur: 'coeur',
    symbole: '♥',
    sens: 'Ce qui commence : la promesse, les fleurs, le oui',
    fond: '#7FB77E',
    encre: '#0F2A14',
    visuel: '/images/aime/printemps.jpg',
    semaines: [13, 25],
  },
  {
    id: 'ete',
    nom: 'Été',
    couleur: 'carreau',
    symbole: '♦',
    sens: 'Ce qui se montre : la lumière, la table, les longs jours',
    fond: '#E9B44C',
    encre: '#2B1D05',
    visuel: '/images/aime/ete.jpg',
    semaines: [26, 38],
  },
  {
    id: 'automne',
    nom: 'Automne',
    couleur: 'trefle',
    symbole: '♣',
    sens: 'Ce qui se récolte : la fin des travaux, la maison, le feu',
    fond: '#B8574A',
    encre: '#2A0E09',
    visuel: '/images/aime/automne.jpg',
    semaines: [39, 51],
  },
  {
    id: 'hiver',
    nom: 'Hiver',
    couleur: 'pique',
    symbole: '♠',
    sens: 'Ce qui tient : le creux de l’année, l’intime, l’attente',
    fond: '#16233F',
    encre: '#EAF0FF',
    visuel: '/images/aime/hiver.jpg',
    semaines: [52, 12],
  },
];

/**
 * Les semaines d'une saison, dans l'ordre **de l'année** (l'hiver à cheval sur
 * deux années se lit 52 puis 1 à 12).
 */
export function semainesDeLaSaison(saison: Saison): number[] {
  const [debut, fin] = saison.semaines;
  if (debut <= fin) return Array.from({ length: fin - debut + 1 }, (_, i) => debut + i);
  return [...Array.from({ length: 53 - debut }, (_, i) => debut + i), ...Array.from({ length: fin }, (_, i) => i + 1)];
}

/** La saison d'une semaine de l'année (1 à 52). */
export function saisonDeLaSemaine(semaine: number): Saison {
  return SAISONS.find((s) => semainesDeLaSaison(s).includes(semaine)) ?? SAISONS[0]!;
}

/* ———————————————————————————— LES 54 NUMÉROS ———————————————————————————— */

/** Les treize cartes d'une couleur : leur nom, et ce qu'elles disent. */
const FIGURES: Array<{ nom: string; sens: string }> = [
  { nom: 'As', sens: 'Le commencement — une décision se prend' },
  { nom: '2', sens: 'Le duo — deux personnes, une seule journée' },
  { nom: '3', sens: 'La famille — ceux qui viennent de loin' },
  { nom: '4', sens: 'Le lieu — on arrête un endroit' },
  { nom: '5', sens: 'Les témoins — la parole donnée devant les autres' },
  { nom: '6', sens: 'Le voyage — ce qui se prépare au loin' },
  { nom: '7', sens: 'L’épreuve — ce qui ne se règle pas tout seul' },
  { nom: '8', sens: 'Le travail — les mains qui feront la journée' },
  { nom: '9', sens: 'La table — le repas, et ceux qu’on y met' },
  { nom: '10', sens: 'La fête — ce qu’on laissera aller' },
  { nom: 'Valet', sens: 'L’annonce — ce qui se dit, et à qui' },
  { nom: 'Dame', sens: 'La maison — ce qu’on installe, et pour durer' },
  { nom: 'Roi', sens: 'L’engagement — ce qui est promis, et tenu' },
];

export const HAUTEURS: Record<number, string> = {
  1: 'la plus haute — l’année entière tient dans cette semaine',
  2: 'haute — les décisions se prennent proprement',
  3: 'haute — et elles se tiennent',
  4: 'pleine — le lieu se décide',
  5: 'pleine — la parole se donne',
  6: 'pleine — le monde s’ouvre',
  7: 'basse — c’est la semaine des choses qu’on remet',
  8: 'pleine — le travail avance',
  9: 'haute — la table se remplit',
  10: 'haute — la fête se prépare',
  11: 'haute — les annonces partent',
  12: 'haute — la maison prend forme',
  13: 'la plus haute de la saison — une saison se referme',
};

export interface CarteDeSemaine {
  /** Le numéro d'AIME MAGAZINE : 1 à 54. */
  numero: number;
  /** La semaine de l'année, quand ce n'est pas un joker. */
  semaine: number | null;
  saison: Saison;
  figure: string;
  /** Le nom complet : « Reine de cœur ». */
  nom: string;
  /** Ce que la carte dit de la semaine. */
  sens: string;
  /** La hauteur de la carte dans sa couleur : 1 à 13. */
  hauteur: number;
  /** Vrai pour les deux jokers : les jours de trop. */
  joker: boolean;
  /** La hauteur de la carte dans sa couleur, dite en un mot. */
  ton: string;
  /** Un mot qui ne change jamais de couleur : le fond de la couverture. */
  fond: string;
  encre: string;
}

/** Les treize cartes d'une saison, dans l'ordre du calendrier. */
function cartesDeLaSaison(saison: Saison): CarteDeSemaine[] {
  return semainesDeLaSaison(saison).map((semaine, i) => {
    const hauteur = i + 1;
    const figure = FIGURES[i]!;
    return {
      numero: semaine,
      semaine,
      saison,
      figure: figure.nom,
      nom: `${figure.nom} de ${saison.couleur}`,
      sens: figure.sens,
      hauteur,
      ton: HAUTEURS[hauteur] ?? 'pleine',
      joker: false,
      fond: saison.fond,
      encre: saison.encre,
    };
  });
}

/**
 * Les deux jokers — les jours de trop. Le 365ᵉ jour de l'année, et celui des
 * années bissextiles : deux numéros qui n'appartiennent à aucune semaine, et
 * c'est très bien : on y met **ce qui peut arriver**.
 */
const JOKERS: CarteDeSemaine[] = [
  {
    numero: 53,
    semaine: null,
    saison: SAISONS[3]!,
    figure: 'Joker',
    nom: 'Joker — le jour de trop',
    sens: 'Le 365ᵉ jour : celui qui n’était pas prévu, et qui sauve l’année',
    hauteur: 14,
    ton: 'hors calendrier — deux jours qui n’existent pas dans le jeu',
    joker: true,
    fond: '#1B1B1F',
    encre: '#F6F1E7',
  },
  {
    numero: 54,
    semaine: null,
    saison: SAISONS[3]!,
    figure: 'Joker',
    nom: 'Joker — le jour bissextile',
    sens: 'Le 366ᵉ jour : tous les quatre ans, une journée qui n’existe pas ailleurs',
    hauteur: 14,
    ton: 'hors calendrier — deux jours qui n’existent pas dans le jeu',
    joker: true,
    fond: '#3A2A44',
    encre: '#F6F1E7',
  },
];

/** **LES 54 CARTES, DANS L'ORDRE DE L'ANNÉE.** */
export const JEU_DE_54: CarteDeSemaine[] = [
  ...SAISONS.flatMap(cartesDeLaSaison).sort((a, b) => a.numero - b.numero),
  ...JOKERS,
];

export function carteDuNumero(numero: number): CarteDeSemaine {
  return JEU_DE_54.find((c) => c.numero === numero) ?? JEU_DE_54[0]!;
}

/* ———————————————————————— LE PAS-DE-TEMPS — CE QU'ON FAISAIT ———————————————————————— */

/**
 * Ce que les gens faisaient, à cette période-là. Ce sont des **usages
 * documentés** : les temps clos de l'Avent et du carême, le mois de mai et son
 * proverbe, les moissons, le mois des morts, la lune. On ne l'impose pas : on
 * raconte, et l'on en tire un conseil.
 */
export interface PasDeTemps {
  /** Les semaines couvertes, bornes comprises. */
  du: number;
  au: number;
  nom: string;
  /** Ce qu'on disait, autrefois. */
  dit: string;
  /** Ce qu'on en fait aujourd'hui. */
  sage: string;
}

export const PAS_DE_TEMPS: PasDeTemps[] = [
  {
    du: 1, au: 2, nom: 'Le creux de janvier',
    dit: 'Janvier était le mois le plus délaissé de l’année : on ne se mariait pas dans le froid, ni au début d’un hiver.',
    sage: 'C’est la semaine des devis : les lieux et les métiers sont libres, et les prix se discutent.',
  },
  {
    du: 3, au: 5, nom: 'Le temps des annonces',
    dit: 'On annonçait les fiançailles à la famille avant de fixer quoi que ce soit — la nouvelle passait de maison en maison.',
    sage: 'Annoncez la date : c’est le moment où l’on réserve au meilleur prix.',
  },
  {
    du: 6, au: 8, nom: 'Avant le carême',
    dit: 'Sous l’Ancien Régime, on se mariait juste avant le carême : ensuite, quarante-six jours sans fête, et donc sans noce.',
    sage: 'Si vous visez un mariage d’hiver, c’est la dernière fenêtre confortable de la saison.',
  },
  {
    du: 9, au: 13, nom: 'Le carême',
    dit: 'Le carême était un temps prohibé : aucune célébration, aucun banquet — l’Église fermait la porte aux noces.',
    sage: 'Période idéale pour tout préparer sans pression : c’est le calme avant la saison.',
  },
  {
    du: 14, au: 17, nom: 'La saison s’ouvre',
    dit: 'Avril fut longtemps le mois préféré des mariages, avant que juin ne prenne sa place.',
    sage: 'Les samedis d’avril partent vite : décidez tôt, la météo vous pardonnera.',
  },
  {
    du: 18, au: 21, nom: 'Le mois de mai',
    dit: '« Noce de mai, noce de mort » : on évitait mai, mois de Marie, et les Romains déjà n’y mariaient personne.',
    sage: 'Rien n’interdit mai : dites-le à ceux qui s’inquiètent, et prenez le samedi que vous voulez.',
  },
  {
    du: 22, au: 26, nom: 'La haute saison',
    dit: 'Juin est devenu le mois des mariages : les jours sont longs, les vacances approchent, les familles viennent.',
    sage: 'Tout est cher et tout est beau : réservez les métiers dix mois avant.',
  },
  {
    du: 27, au: 31, nom: 'Les grandes chaleurs',
    dit: 'On mariait en été ce qu’on n’avait pas pu faire au printemps : les récoltes attendaient, les cousins étaient là.',
    sage: 'Pensez l’ombre, l’eau et les horaires — la journée se joue avant seize heures.',
  },
  {
    du: 32, au: 35, nom: 'Le plein été',
    dit: 'Août était le mois des villages : les mariages duraient plusieurs jours, on dormait sur place.',
    sage: 'Faites simple et frais : c’est la semaine où l’on se souvient du repas, jamais du décor.',
  },
  {
    du: 36, au: 39, nom: 'Les moissons finies',
    dit: 'À la campagne, on attendait la fin des moissons : on ne mariait personne pendant les travaux.',
    sage: 'Septembre offre la lumière la plus belle de l’année, et des prix qui redescendent.',
  },
  {
    du: 40, au: 43, nom: 'L’arrière-saison',
    dit: 'L’automne était la saison des mariages de village : les granges étaient libres, le vin était fait.',
    sage: 'Le mois des feuilles : prévoyez de quoi tenir la soirée au chaud, dehors.',
  },
  {
    du: 44, au: 47, nom: 'Le mois des morts',
    dit: 'Novembre était évité — un interdit tardif, venu de la Toussaint plus que de l’Église.',
    sage: 'Mois tranquille et souvent gris : parfait pour un mariage à la bougie, et pour les petits budgets.',
  },
  {
    du: 48, au: 52, nom: 'L’Avent',
    dit: 'L’Avent était le grand temps clos : du quatrième dimanche avant Noël jusqu’au 24, pas de noces.',
    sage: 'Décembre se marie pourtant très bien : pensez lumières, et prévenez les invités tôt.',
  },
];

export function pasDeTempsDeLaSemaine(semaine: number): PasDeTemps {
  return PAS_DE_TEMPS.find((p) => semaine >= p.du && semaine <= p.au) ?? PAS_DE_TEMPS[0]!;
}

/* ————————————————————————— LA LUNE, ET LA SEMAINE ————————————————————————— */

/** Les huit quarts de la lunaison, dans l'ordre. */
const LUNES = ['nouvelle lune', 'premier croissant', 'premier quartier', 'lune montante', 'pleine lune', 'lune descendante', 'dernier quartier', 'dernier croissant'];

/**
 * La phase de lune, approchée : on compte depuis une nouvelle lune connue
 * (6 janvier 2000, 18 h 14 UTC) sur un cycle synodique de 29,530 588 jours.
 */
export function phaseDeLune(date: Date): { nom: string; jour: number } {
  const NOUVELLE_LUNE = Date.UTC(2000, 0, 6, 18, 14);
  const CYCLE = 29.530588 * 24 * 3600 * 1000;
  const depuis = ((date.getTime() - NOUVELLE_LUNE) % CYCLE + CYCLE) % CYCLE;
  const jour = Math.floor(depuis / (24 * 3600 * 1000)) + 1;
  const huit = Math.floor((depuis / CYCLE) * 8) % 8;
  return { nom: LUNES[huit]!, jour };
}

/** Le numéro de la semaine de l'année : 1 à 52 (la 53 s'ajoute aux jokers). */
export function semaineDeLAnnee(date: Date): number {
  const debut = new Date(date.getFullYear(), 0, 1);
  const jours = Math.floor((date.getTime() - debut.getTime()) / (24 * 3600 * 1000));
  return Math.min(52, Math.floor(jours / 7) + 1);
}

/** Les bornes de la semaine de l'année, en dates. */
export function bornesDeLaSemaine(annee: number, semaine: number): [Date, Date] {
  const debut = new Date(annee, 0, 1 + (semaine - 1) * 7);
  const fin = new Date(debut.getTime() + 6 * 24 * 3600 * 1000);
  return [debut, fin];
}
