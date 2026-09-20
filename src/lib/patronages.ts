/**
 * LES SAINTS PATRONS — LE MÉTIER, ET LA PORTE QU'IL OUVRE
 *
 * C'est la deuxième couche qui couvre l'année : **la tradition attribue un
 * métier à un saint**, et un métier ouvre une porte du mariage. Là, le pont est
 * `directe` — ce n'est pas une association créative, c'est la transmission.
 *
 * ```
 * LE MÉTIER (documenté)  →  LE SAINT   →  LA PORTE DU MARIAGE
 * boulangers                 Honoré       le dessert
 * orfèvres                   Éloi         les alliances
 * photographes               Véronique    les images
 * ```
 *
 * ## Ce que cette liste est, et ce qu'elle n'est pas
 *
 * Elle vient de **la liste des saints patrons telle qu'elle est transmise**
 * (calendriers, missels, sites de référence) : on la cite, on ne l'invente pas.
 * Les attributions varient d'une liste à l'autre, et certaines sont multiples —
 * c'est dit. Ce qui n'y est pas **n'est pas rempli** : la fiche du jour le
 * marquera comme à documenter.
 *
 * Le métier ne remplace jamais la fiche : il **l'amorce**, et l'écrit en clair.
 */

export interface Patronage {
  /** Le métier, tel qu'on le dit. */
  metier: string;
  /** Le saint ou la sainte, écrit comme dans le calendrier du magazine. */
  saint: string;
  /** La porte du mariage que ce métier ouvre. */
  mot: string;
  /** Le texte du pont, prêt à s'écrire. */
  texte: string;
  /** Ce que ce métier apporte à un mariage, en une phrase. */
  apport: string;
}

/** `[métier, saint, porte, apport]`. */
const TABLE: Array<[string, string, string, string]> = [
  ['Les orfèvres et les bijoutiers', 'Éloi', 'Les alliances', 'l’or, la gravure, la bague qu’on garde toute une vie'],
  ['Les horlogers', 'Éloi', 'Les horaires', 'le minutage du jour : ce qui doit être fait à l’heure dite'],
  ['Les métallurgistes', 'Éloi', 'Les alliances', 'le métal travaillé, la fonderie, le poids'],
  ['Les plombiers', 'Éloi', 'Les lieux', 'l’eau, les installations, ce qui doit tenir'],
  ['Les cheminots', 'Éloi', 'Les transports', 'les trains, les arrivées de loin'],
  ['Les boulangers', 'Honoré', 'Le pain', 'le pain de la table, celui du matin, celui qui reste'],
  ['Les pâtissiers', 'Honoré', 'Le dessert', 'la pièce montée, le gâteau, la fin du repas'],
  ['Les photographes', 'Véronique', 'Les images', 'ce qui reste quand la journée est passée'],
  ['Les lingères', 'Véronique', 'Les tenues', 'le linge, le vêtement, ce qu’on enfile le matin'],
  ['Les musiciens', 'Cécile', 'La musique', 'la cérémonie, le bal, la sono'],
  ['Les chanteurs', 'Cécile', 'Le chant', 'la voix, l’entrée, l’émotion qu’on ne prévoit pas'],
  ['Les poètes', 'Cécile', 'Les discours', 'les mots écrits pour être dits à voix haute'],
  ['Les jardiniers', 'Fiacre', 'Les fleurs', 'le jardin, les fleurs, ce qui pousse autour'],
  ['Les jardiniers', 'Gertrude', 'Les fleurs', 'le jardin du printemps, les fleurs coupées le matin'],
  ['Les chauffeurs de taxi', 'Fiacre', 'Les transports', 'aller chercher les invités, les navettes, la nuit'],
  ['Les médecins', 'Luc', 'Les soins', 'la trousse du jour J, la chaleur, les pieds'],
  ['Les peintres', 'Luc', 'Le décor', 'l’art, le portrait, la couleur posée'],
  ['Les médecins', 'Côme', 'Les soins', 'soigner, et opérer sans se faire payer'],
  ['Les chirurgiens et les pharmaciens', 'Côme', 'La trousse', 'ce qu’il faut avoir sous la main, et rien de plus'],
  ['Les comptables', 'Matthieu', 'Le budget', 'les comptes, les devis, l’argent dit clairement'],
  ['Les menuisiers', 'Matthieu', 'Le mobilier', 'les tables, les bancs, ce qu’on fabrique'],
  ['Les parfumeurs', 'Matthieu', 'Les odeurs', 'ce que la salle sent, et ce qu’on en garde'],
  ['Les charpentiers', 'Joseph', 'La structure', 'la charpente, l’estrade, la chose qui tient'],
  ['Les cavaliers', 'Georges', 'Les chevaux', 'les chevaux, la calèche, l’arrivée'],
  ['Les chapeliers', 'Jacques', 'Les chapeaux', 'le chapeau, l’accessoire qui signe une silhouette'],
  ['Les chasseurs', 'Hubert', 'Le décor végétal', 'la forêt, la traque, le dehors'],
  ['Les forestiers', 'Hubert', 'Les arbres', 'les arbres du lieu, l’abri, la clairière'],
  ['Les cavaliers et les palefreniers', 'Hubert', 'Les animaux', 'ceux qui portent, qui tirent, qui accompagnent'],
  ['Les coiffeurs', 'Louis', 'La coiffure', 'la coiffure, le geste avant la cérémonie'],
  ['Les journalistes', 'François de Sales', 'Le récit', 'raconter : l’article, le souvenir écrit'],
  ['Les éducateurs', 'Jean-Baptiste de la Salle', 'Les enfants', 'les enfants du mariage, leur place, leur table'],
  ['Les mineurs', 'Barbe', 'La sécurité', 'les consignes, les extincteurs, la porte qui s’ouvre'],
  ['Les pompiers', 'Barbe', 'La sécurité', 'ce qui peut brûler, et ce qu’on éteint'],
  ['Les artificiers', 'Barbe', 'Le feu d’artifice', 'le bouquet final, la pyrotechnie, la flamme froide'],
  ['Les nourrices', 'Agathe', 'Les enfants', 'nourrir, porter, rassurer'],
  ['Les opticiens', 'Lucie', 'La lumière', 'ce qu’on voit, la lumière juste'],
  ['Les électriciens', 'Lucie', 'Les lumières', 'les lumières, la guirlande, ce qui s’allume'],
  ['Les gendarmes', 'Geneviève', 'La sécurité', 'veiller sur une ville, et sur une nuit'],
  ['Les meuniers', 'Blaise', 'Le pain', 'la farine, le grain, la meule'],
  ['Les brasseurs', 'Médard', 'Le bar', 'la bière, le bar, la fin de nuit'],
  ['Les hôteliers et les cabaretiers', 'Marthe', 'La réception', 'recevoir : écouter, nourrir, faire asseoir'],
  ['Les charcutiers', 'Antoine', 'Le repas', 'le repas, la table, ce qu’on sert'],
  ['Les bouchers', 'Nicolas', 'Le repas', 'le repas, la pièce, le service'],
  ['Les poissonniers', 'André', 'Le repas', 'la mer, le poisson, le repas du soir'],
  ['Les commerçants', 'Victorien', 'Le shop', 'ce qu’on achète, ce qu’on choisit'],
  ['Les informaticiens', 'Isidore', 'Le site', 'le site, ses pages, ce que les invités liront'],
  ['Les juristes', 'Rémi', 'Les papiers', 'ce qui est signé, ce qui est promis'],
  ['Les philosophes', 'Catherine', 'Les vœux', 'les mots que l’on choisit, et ce qu’ils engagent'],
  ['Les généalogistes', 'Catherine', 'Les familles', 'les familles, les noms, ce qui remonte'],
  ['Les laboureurs', 'Isidore', 'La terre', 'la terre, la saison, ce qui est planté'],
  ['Les chasseurs de tempêtes', 'Barbe', 'L’orage', 'ce qui menace dehors, le jour où l’on est dehors'],
  ['Les cavaliers de la Sainte-Barbe', 'Barbe', 'Les cavaliers', 'le feu qui va vite, et ceux qui le portent'],
];

export const PATRONAGES: Patronage[] = TABLE.map(([metier, saint, mot, apport]) => ({
  metier,
  saint,
  mot,
  apport,
  texte: `la tradition donne ${saint} pour patron : ${apport}.`,
}));

/** Les patronages d'un jour : on cherche par le nom du saint. */
export function patronagesDe(saint: string): Patronage[] {
  return PATRONAGES.filter((p) => p.saint.toLowerCase() === saint.toLowerCase());
}

/** Toutes les portes ouvertes par un jour, dédoublonnées, dans l'ordre. */
export function portesDuJour(saint: string): string[] {
  return [...new Set(patronagesDe(saint).map((p) => p.mot))];
}

/** Combien de jours du calendrier ont au moins un patronage — le compte de la couche. */
export const SAINTS_PATRONS = [...new Set(PATRONAGES.map((p) => p.saint))].sort();
