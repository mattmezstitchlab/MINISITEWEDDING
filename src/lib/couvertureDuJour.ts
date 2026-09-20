import { jourNomme, jokerDuJour } from './saintsDuJour';
import { cleDuJour, plat, PROFILS } from './profilsEditoriaux';
import { MOIS, MOIS_LONGS } from './calendrier';
import { heuresDeLaPart, partActuelle, partDeLHeure, partParId, PARTS, type PartDuJour } from './moments';
import { assombrir, TAUX_TEMPS_CLOS } from './couleurs';
import { carteDuNumero, semaineDeLAnnee, type Saison } from './jeuDeCartes';
import { clesDuJour, jourDeLAnnee, meteoDuJour, studioDuJour } from './jourDuMagazine';

/**
 * LA COUVERTURE DE CHAQUE JOUR — LES 365
 *
 * Un mariage a une date ; le magazine, lui, a **tous les jours de l'année**. Ici
 * se compose la couverture de chaque jour : **le même dessin pour tous**, avec
 * ce que le jour apporte — sa saison (la couleur du jeu), son nom (celui du
 * calendrier), sa carte de la semaine, ses clés (la lune, les portes, le
 * chiffre), et **sa création centrale**, unique à ce jour et toujours la même
 * quand on y revient.
 *
 * Trois règles de la charte sont tenues ici, mécaniquement :
 *  - **fond uni** : une saison, une couleur, et elle vient du jeu ;
 *  - **la création est au centre, rien ne passe dessus** ;
 *  - **la marque en haut, le titre au centre, la date en bas**.
 *
 * La création centrale est un **cadran de vingt-quatre heures** : une branche par
 * heure de l'édition, dont la longueur est décidée par **l'ensoleillement moyen
 * du mois** (les moyennes du passé) et par la graine du jour. Le même jour donne
 * toujours le même dessin — un magazine qu'on relit se retrouve à l'identique.
 */

/* ————————————————————————— LA GRAINE ————————————————————————— */

/** FNV-1a : la même chaîne donne toujours le même nombre, partout, sans hasard. */
export function graine(texte: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < texte.length; i += 1) {
    h ^= texte.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** Un tirage stable dans [0, 1) : la graine, puis le rang. */
function tirage(g: number, rang: number): number {
  const melange = Math.imul(g ^ (rang + 0x9e3779b9), 0x85ebca6b) >>> 0;
  return ((melange ^ (melange >>> 15)) >>> 0) / 4294967296;
}

/* ————————————————————————— LA COUVERTURE ————————————————————————— */

export interface Branche {
  /** L'heure de l'édition : 0 à 23. */
  heure: number;
  /** Sa longueur, de 0 à 1 — c'est ce qui se dessine. */
  longueur: number;
  /** Une heure de lumière (lever, zénith, golden hour) : elle se dessine plus franchement. */
  eclatante: boolean;
}

export interface CouvertureJour {
  id: string;
  /** Le jour dans l'année : 1 à 366. */
  numero: number;
  /** Le jour dans le mois : 1 à 31. */
  quantieme: number;
  mois: number;
  annee: number;
  /** « 21 septembre 2026 », écrit comme on le dit. */
  dateLongue: string;
  /** Le nom du jour : « Saint Matthieu », « Adolphe Sax », ou « Le jour de trop ». */
  titre: string;
  /** La fête du calendrier, quand le personnage du jour est quelqu'un d'autre. */
  fete?: string;
  /** Le prénom nu, pour les listes : « Matthieu ». */
  nom: string;
  /** La grande famille : ce qui commence, le duo, ce qui se construit… */
  saison: Saison;
  /** La carte de la semaine : « Reine de cœur ». */
  figure: string;
  /** La semaine de l'année, et son numéro de magazine. */
  semaine: number;
  /** Le fond uni : la couleur de la saison, ou le noir les jours qui ne sont pas comme les autres. */
  fond: string;
  /** L'encre, calculée pour rester lisible sur ce fond. */
  encre: string;
  /** Vrai les trois jours rares : le joker, le dimanche, les portes de l'année. */
  pasCommeLesAutres: boolean;
  /** Vrai les temps clos : la couleur de la saison, assombrie. Ce n'est pas du noir. */
  dense: boolean;
  /** Pourquoi — dit en clair, comme partout ailleurs. */
  raison: string;
  /** Ce que le studio donnerait : fond blanc, assombri, ou noir. */
  studio: 'blanc' | 'dense' | 'noir';
  /** Le temps du jour qu'on regarde, quand la couverture s'éclaire à son heure. */
  part?: { id: string; nom: string; heures: number[] };
  /** Les clés du jour, en une ligne chacune. */
  cles: Array<{ label: string; valeur: string }>;
  /** Le cadran : vingt-quatre branches, une par heure. */
  branches: Branche[];
}

/** Les heures qui portent de la lumière : le dessin les marque. */
export const HEURES_DE_LUMIERE = [5, 6, 7, 12, 13, 18, 19, 20];

/** Le noir des jours qui ne sont pas comme les autres. */
export const FOND_NOIR = '#0B0B0F';

/** **La couverture d'un jour** : tout ce qu'il faut pour la dessiner, et rien de plus. */
export function couvertureDuJour(date: Date): CouvertureJour {
  const quantieme = date.getDate();
  const mois = date.getMonth();
  const semaine = semaineDeLAnnee(date);
  const carte = carteDuNumero(semaine);
  const nomme = jourNomme(date);
  const joker = jokerDuJour(date);
  const cles = clesDuJour(date);
  const meteo = meteoDuJour(date);
  const studio = studioDuJour(date);
  const numero = jourDeLAnnee(date);

  /** Le nom nu — « Matthieu », ou « Sylvestre » pour le jour de trop. */
  const nom = nomme?.nom ?? joker?.saint ?? joker?.nom ?? '';
  /** Ce que le calendrier donne au jour : « Saint Matthieu », « Sainte Bertille ». */
  const titreDuCalendrier = nomme
    ? nomme.genre === 'fete'
      ? nomme.nom
      : `${nomme.genre === 'sainte' ? 'Sainte' : 'Saint'} ${nomme.nom}`
    : joker?.saint
      ? `Le jour de trop — ${joker.saint}`
      : 'Le jour de trop';

  /* Le profil éditorial du jour mène le titre : le 6 novembre, le magazine est
     consacré à Adolphe Sax, et la Sainte Bertille reste écrite dessous — le
     calendrier ne se perd pas, il passe au second plan. */
  const profil = PROFILS[cleDuJour(date)];
  const personnage = profil?.personnage ?? '';
  const autrePersonnage = personnage.length > 0 && plat(personnage) !== plat(nom);
  const titre = autrePersonnage ? personnage : titreDuCalendrier;
  const fete = autrePersonnage ? titreDuCalendrier : undefined;

  const g = graine(`${numero}-${nom}-${mois + 1}`);
  const branches: Branche[] = Array.from({ length: 24 }, (_, heure) => ({
    heure,
    longueur: 0.28 + tirage(g, heure) * 0.72,
    eclatante: HEURES_DE_LUMIERE.includes(heure),
  }));

  const lignes: Array<{ label: string; valeur: string }> = [
    { label: 'Le ciel', valeur: meteo.ciel },
    { label: 'La lune', valeur: `${cles.lune.nom}, jour ${cles.lune.jour}` },
    { label: 'Le chiffre', valeur: String(cles.chiffre.nombre) },
  ];
  if (cles.porte) lignes.push({ label: 'La porte', valeur: 'solstice ou équinoxe — la nuit et le jour se valent' });
  if (cles.interstice) lignes.push({ label: 'L’interstice', valeur: 'les douze jours entre les deux années' });
  if (cles.signeCache) lignes.push({ label: 'Le signe caché', valeur: cles.signeCache.nom });

  return {
    id: `${date.getFullYear()}-${String(mois + 1).padStart(2, '0')}-${String(quantieme).padStart(2, '0')}`,
    numero,
    quantieme,
    mois: mois + 1,
    annee: date.getFullYear(),
    dateLongue: `${quantieme} ${MOIS_LONGS[mois]} ${date.getFullYear()}`,
    titre,
    fete,
    nom: nom || titre,
    saison: carte.saison,
    figure: carte.nom,
    semaine,
    /* Le fond : la couleur de la saison — assombrie quand le temps est clos, et
       noire seulement les trois jours rares (joker, dimanche, porte). */
    fond: studio.fond === 'noir' ? FOND_NOIR : studio.dense ? assombrir(carte.saison.fond, TAUX_TEMPS_CLOS) : carte.saison.fond,
    encre: studio.fond === 'noir' || studio.dense ? '#F3F1ED' : carte.saison.encre,
    pasCommeLesAutres: studio.fond === 'noir',
    dense: studio.dense,
    raison: studio.raison,
    studio: studio.fond,
    cles: lignes,
    branches,
  };
}

/** **Les 365 couvertures d'une année** — un an de magazine, dans l'ordre. */
export function couverturesDeLAnnee(annee: number): CouvertureJour[] {
  const jours: CouvertureJour[] = [];
  const curseur = new Date(annee, 0, 1);
  while (curseur.getFullYear() === annee) {
    jours.push(couvertureDuJour(new Date(curseur)));
    curseur.setDate(curseur.getDate() + 1);
  }
  return jours;
}

/**
 * **LA COUVERTURE À UNE HEURE DU JOUR** — le même dessin, une autre lumière.
 *
 * Le fond, le titre, la carte et la date ne bougent pas : ce sont **les branches
 * du cadran** qui s'allument. On regarde le même jour, à l'aube, à midi ou à
 * minuit — et c'est la même couverture, lue à une autre heure.
 */
export function couvertureDeLaPart(date: Date, partId: string): CouvertureJour {
  const base = couvertureDuJour(date);
  return couvertureDeLaPartSur(base, partParId(partId) ?? partActuelle(date));
}

/** La même chose, sur une couverture déjà composée — pour ne pas la refaire. */
export function couvertureDeLaPartSur(base: CouvertureJour, part: PartDuJour): CouvertureJour {
  const heures = heuresDeLaPart(part);
  const branches = base.branches.map((b) => ({ ...b, eclatante: heures.includes(b.heure) }));
  return { ...base, part: { id: part.id, nom: part.nom, heures }, branches };
}

/** Les six temps du jour, chacun avec sa couverture : le visage qui change. */
export function couverturesDesParts(date: Date): Array<{ part: PartDuJour; couverture: CouvertureJour }> {
  const base = couvertureDuJour(date);
  return PARTS.map((part) => ({ part, couverture: couvertureDeLaPartSur(base, part) }));
}

/** Le temps d'une heure, réexporté pour ceux qui n'ont que la couverture sous la main. */
export { partDeLHeure };

/** Les jours d'un mois, pour la galerie : on ne fabrique que ce qu'on regarde. */
export function couverturesDuMois(annee: number, mois: number): CouvertureJour[] {
  const jours: CouvertureJour[] = [];
  const dernier = new Date(annee, mois, 0).getDate();
  for (let jour = 1; jour <= dernier; jour += 1) jours.push(couvertureDuJour(new Date(annee, mois - 1, jour)));
  return jours;
}

export { MOIS };
