/**
 * LES 54 MAGAZINES — LE MAPPING ÉDITORIAL, EN UN SEUL ENDROIT
 *
 * C'est **la source de vérité** : une date n'ouvre plus une image, elle ouvre un
 * magazine hebdomadaire et **l'un de ses sept chapitres**.
 *
 * ```
 * DATE → NUMÉRO DE SEMAINE → MAGAZINE → CHAPITRE → ASSET
 * ```
 *
 * ## Le calendrier, tel qu'il est réellement
 *
 * Le site découpe l'année en **blocs de sept jours depuis le 1ᵉʳ janvier** (voir
 * `jeuDeCartes.ts`, §39) : semaine 1 = du 1ᵉʳ au 7 janvier, et ainsi de suite.
 * Ce n'est pas la norme ISO, et c'est volontaire : elle donnerait **53 semaines**
 * certaines années, alors que la collection en compte **54 — 52 semaines, plus
 * les deux jokers**. Une année ISO ferait donc une 55ᵉ couverture que nous
 * n'aurions pas. Aucun deuxième calendrier n'est introduit ici : `semaineDeLAnnee`
 * reste la seule règle, et elle est réutilisée telle quelle.
 *
 * ## Les 365 jours et les 54 semaines
 *
 * 52 × 7 = **364** jours couverts par les semaines réelles. Il reste **le 365ᵉ
 * jour** — le 31 décembre — qui n'entre dans aucune semaine : c'est **le joker
 * 53**. Et **le 366ᵉ**, le 29 février, est **le joker 54**. Ces deux jours ne
 * sont pas des faux jours : ils existent depuis toujours dans le jeu de 54. Ils
 * reçoivent **le chapitre de leur jour de semaine** (lundi → 01, dimanche → 07) :
 * une règle de transition, écrite ici et nulle part ailleurs, pour que la
 * navigation éditoriale ne s'interrompe jamais.
 *
 * ## Le chapitre d'une date
 *
 * Pour les 364 jours des semaines, le chapitre est **la position du jour dans sa
 * semaine** : jour 1 → chapitre 01 Les Amoureux, jour 7 → chapitre 07 Les
 * Souvenirs. Chaque magazine présente donc **ses sept chapitres, une fois
 * chacun, dans l'ordre** — et la même date donne toujours le même chapitre.
 */

import { CHAPITRES, chapitreDeLaPosition, type Chapitre } from './chapitres';
import { DIRECTIONS, directionDuNumero, type DirectionDuMagazine } from './directionsDuMagazine';
import { MOIS_LONGS } from './calendrier';
import {
  SAISONS,
  bornesDeLaSemaine,
  carteDuNumero,
  saisonDeLaSemaine,
  semaineDeLAnnee,
  type CarteDeSemaine,
  type Saison,
} from './jeuDeCartes';
import { jokerDuJour } from './saintsDuJour';

/** Le nombre de magazines de la collection : 52 semaines, et deux jours de trop. */
export const NOMBRE_DE_MAGAZINES = 54;

/** Le nombre d'images attendues : 54 couvertures, et 378 chapitres. */
export const IMAGES_ATTENDUES = NOMBRE_DE_MAGAZINES * 8;

/* ——————————————————————————— LES CHEMINS, SANS DISCUSSION ——————————————————————————— */

/** Le dossier d'une semaine : `semaine-38`. */
export function dossierDeLaSemaine(numero: number): string {
  return `semaine-${String(numero).padStart(2, '0')}`;
}

/** Le dossier servi : `/images/magazine/semaine-38`. */
export function racineDeLaSemaine(numero: number): string {
  return `/images/magazine/${dossierDeLaSemaine(numero)}`;
}

/** La couverture d'un magazine : `/images/magazine/semaine-38/cover.jpg`. */
export function cheminDeLaCouverture(numero: number): string {
  return `${racineDeLaSemaine(numero)}/cover.jpg`;
}

/** L'image d'un chapitre : `/images/magazine/semaine-38/04-recevoir.jpg`. */
export function cheminDuChapitre(numero: number, chapitre: number): string {
  const c = chapitreDeLaPosition(chapitre);
  return `${racineDeLaSemaine(numero)}/${c.fichier}`;
}

/* —————————————————————————— UN CHAPITRE, DANS UN MAGAZINE —————————————————————————— */

export interface ChapitreDuMagazine {
  /** 1 à 7 — le chapitre. */
  numero: number;
  /** Le chapitre lui-même : son titre, son territoire, son brief. */
  chapitre: Chapitre;
  /** Le titre complet, tel qu'il s'écrit : « Chapitre 04 — L'Art de recevoir ». */
  titreComplet: string;
  /** Ce que cette semaine-là met dans ce chapitre — écrit dans la direction. */
  sujet: string;
  /** Ce que l'image doit montrer, en une phrase : le brief du chapitre + le sujet. */
  brief: string;
  /** Le chemin attendu de l'image. */
  image: string;
  /** Ce que le chapitre raconte dans ce numéro, en une phrase. */
  description: string;
  /** Le pont vers le mariage, toujours tenu. */
  pontMariage: string;
}

/* ———————————————————————————————— UN MAGAZINE ———————————————————————————————— */

export interface Magazine {
  /** 1 à 54 : c'est le numéro, et c'est aussi le numéro de semaine. */
  numero: number;
  /** La semaine de l'année (1 à 52), ou `null` pour les deux jours de trop. */
  semaine: number | null;
  /** Vrai pour les jokers — les deux jours qui n'appartiennent à aucune semaine. */
  joker: boolean;
  /** La carte du jeu de 54 : la couleur, la figure, le sens. */
  carte: CarteDeSemaine;
  /** La saison du jeu : sa couleur de fond, son encre, son symbole. */
  saison: Saison;
  /** La direction artistique : style, matière, motif, lumière, palette. */
  direction: DirectionDuMagazine;
  /** Le titre du numéro : « Testament corse ». */
  titre: string;
  /** La famille visuelle : « Méditerranée insulaire, documentaire ». */
  style: string;
  /** L'ancrage : lieux, cultures, époques. */
  terroir: string;
  /** La matière du numéro — ce qui doit se sentir du regard. */
  matiere: string;
  /** Le motif qui revient dans les sept chapitres : la cohérence de la semaine. */
  motif: string;
  /** La lumière du numéro, dite comme on la décrit à un chef opérateur. */
  lumiere: string;
  /** Le fond éditorial et l'accent : les deux couleurs de la semaine. */
  palette: { fond: string; accent: string };
  /** Ce que doit montrer la couverture. */
  coverSujet: string;
  /** Le chemin attendu de la couverture. */
  cover: string;
  /** Les sept chapitres, dans l'ordre, chacun avec son sujet propre. */
  chapitres: ChapitreDuMagazine[];
  /** Le numéro, présenté comme il se lit partout : « Magazine 38 ». */
  etiquette: string;
  /** Une phrase qui présente la semaine entière. */
  resume: string;
}

/** **TOUS LES MAGAZINES**, dans l'ordre de la collection : 1 à 54. */
export const MAGAZINES: Magazine[] = Array.from({ length: NOMBRE_DE_MAGAZINES }, (_, i) => {
  const numero = i + 1;
  const carte = carteDuNumero(numero);
  const direction = directionDuNumero(numero);
  const semaine = carte.semaine;
  const saison = semaine === null ? carte.saison : saisonDeLaSemaine(semaine);
  const joker = carte.joker;

  const chapitres: ChapitreDuMagazine[] = CHAPITRES.map((chapitre) => {
    const sujet = direction.chapitres[chapitre.numero - 1] ?? chapitre.territoire;
    return {
      numero: chapitre.numero,
      chapitre,
      titreComplet: `Chapitre ${String(chapitre.numero).padStart(2, '0')} — ${chapitre.titre}`,
      sujet,
      brief: `${chapitre.brief} — ${sujet}.`,
      image: cheminDuChapitre(numero, chapitre.numero),
      description: `${sujet}. ${chapitre.territoire}`,
      pontMariage: chapitre.pontMariage,
    };
  });

  return {
    numero,
    semaine,
    joker,
    carte,
    saison,
    direction,
    titre: direction.titre,
    style: direction.style,
    terroir: direction.terroir,
    matiere: direction.matiere,
    motif: direction.motif,
    lumiere: direction.lumiere,
    palette: direction.palette,
    coverSujet: direction.coverSujet,
    cover: cheminDeLaCouverture(numero),
    chapitres,
    etiquette: `Magazine ${numero}`,
    resume: joker
      ? `${direction.titre} — ${direction.style}. ${direction.terroir}.`
      : `${direction.titre} — ${direction.style}. ${direction.terroir}, ${direction.lumiere}. Semaine ${semaine}, ${saison.nom.toLowerCase()}.`,
  };
});

/** Le magazine d'un numéro (1 à 54). On ne lève jamais : on retombe sur le premier. */
export function magazineParNumero(numero: number): Magazine {
  return MAGAZINES[numero - 1] ?? MAGAZINES[0]!;
}

/** Le magazine de la saison : celui du moment, dans cette couleur. */
export function magazinesDeLaSaison(saisonId: string): Magazine[] {
  return MAGAZINES.filter((m) => m.saison.id === saisonId);
}

/** Le chapitre d'un magazine, par son numéro (1 à 7). */
export function chapitreDuMagazine(numero: number, chapitre: number): ChapitreDuMagazine {
  return magazineParNumero(numero).chapitres[chapitreDeLaPosition(chapitre).numero - 1]!;
}

/* —————————————————————— DATE → SEMAINE → MAGAZINE → CHAPITRE —————————————————————— */

/**
 * **Le numéro de magazine d'une date.** C'est la première marche du mapping :
 * la semaine réelle (1 à 52), ou le joker (53 le 31 décembre, 54 le 29 février).
 */
export function numeroDeMagazine(date: Date): number {
  const joker = jokerDuJour(date);
  if (joker) return joker.numero;
  return Math.min(52, semaineDeLAnnee(date));
}

/**
 * **La position d'un jour dans son magazine** (1 à 7) — et c'est elle qui donne
 * le chapitre.
 *
 * - dans une semaine : le rang du jour dans le bloc (jour 1 → chapitre 01) ;
 * - les jours de trop : le rang du jour de la semaine (lundi → 01 … dimanche →
 *   07). C'est la transition, écrite ici, pour que les deux jokers aient eux
 *   aussi sept chapitres lisibles.
 */
export function positionDansLeMagazine(date: Date): number {
  if (jokerDuJour(date)) return ((date.getDay() + 6) % 7) + 1;
  const semaine = numeroDeMagazine(date);
  /* Le rang se compte depuis le **premier jour de la semaine**, celui que
     `bornesDeLaSemaine` donne : la même règle que le découpage de l'année, et le
     chapitre suit. On compare des **jours**, pas des instants : une date posée à
     midi et une borne à minuit donneraient sinon une demi-journée d'écart — et
     un chapitre faux (c'est arrivé : le 21 septembre sortait au chapitre 06). */
  const jour = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const [debut] = bornesDeLaSemaine(date.getFullYear(), semaine);
  const ecart = Math.round((jour.getTime() - debut.getTime()) / 86400000);
  return Math.min(7, Math.max(1, ecart + 1));
}

/** **`getMagazineForDate`** — le magazine d'une date, tout entier. */
export function magazineDeLaDate(date: Date): Magazine {
  return magazineParNumero(numeroDeMagazine(date));
}

/** **`getChapterForDate`** — le chapitre d'une date, dans son magazine. */
export function chapitreDeLaDate(date: Date): ChapitreDuMagazine {
  return chapitreDuMagazine(numeroDeMagazine(date), positionDansLeMagazine(date));
}

/** Le jour (1 à 7) qui ouvre un chapitre donné, dans un magazine donné. */
export function rangDuChapitre(date: Date): number {
  return positionDansLeMagazine(date);
}

/**
 * **LES TROIS NIVEAUX, EN UNE LIGNE CHACUN** — ce que le visiteur doit toujours
 * pouvoir lire : quel jour il regarde, dans quel magazine, à quel chapitre.
 */
export interface NiveauxDuJour {
  /** « 21 septembre » */
  date: string;
  /** « 21 septembre 2026 » */
  dateLongue: string;
  /** « Magazine 38 » */
  magazine: string;
  /** « Semaine 38 · Été » */
  semaine: string;
  /** « Chapitre 04 — L'Art de recevoir » */
  chapitre: string;
  /** « Les Lieux » / « L'Art de recevoir » : le titre nu du chapitre. */
  titreDuChapitre: string;
  /** Le numéro du chapitre, 1 à 7. */
  numeroDeChapitre: number;
  /** Le titre du numéro : « Septembre doré ». */
  titreDuMagazine: string;
  /** Vrai quand la date est l'un des deux jours de trop. */
  jourDeTrop: boolean;
}

/** Les trois niveaux d'une date — la même source que la navigation. */
export function niveauxDuJour(date: Date): NiveauxDuJour {
  const magazine = magazineDeLaDate(date);
  const chapitre = chapitreDeLaDate(date);
  return {
    date: `${date.getDate()} ${MOIS_LONGS[date.getMonth()]}`,
    dateLongue: `${date.getDate()} ${MOIS_LONGS[date.getMonth()]} ${date.getFullYear()}`,
    magazine: magazine.etiquette,
    semaine: magazine.joker ? 'Hors calendrier' : `Semaine ${magazine.semaine} · ${magazine.saison.nom}`,
    chapitre: chapitre.titreComplet,
    titreDuChapitre: chapitre.chapitre.titre,
    numeroDeChapitre: chapitre.numero,
    titreDuMagazine: magazine.titre,
    jourDeTrop: magazine.joker,
  };
}

/* —————————————————————————— LES JOURS D'UN MAGAZINE —————————————————————————— */

/**
 * Les sept jours d'un magazine, dans l'ordre des chapitres. Pour les deux jours
 * de trop, il n'y en a qu'un : le jour lui-même — et c'est exactement ce qu'ils
 * sont.
 */
export function joursDuMagazine(numero: number, annee: number): Date[] {
  const magazine = magazineParNumero(numero);
  if (magazine.numero === 54) return [new Date(annee, 1, 29, 12)];
  if (magazine.numero === 53 || magazine.joker) return [new Date(annee, 11, 31, 12)];
  const [debut] = bornesDeLaSemaine(annee, magazine.semaine!);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(debut);
    d.setDate(d.getDate() + i);
    d.setHours(12, 0, 0, 0);
    return d;
  });
}

/** Les bornes d'un magazine, en dates — du premier au dernier jour. */
export function bornesDuMagazine(numero: number, annee: number): [Date, Date] {
  const jours = joursDuMagazine(numero, annee);
  return [jours[0]!, jours[jours.length - 1]!];
}

/** Le jour qui ouvre un chapitre précis, dans un magazine précis. */
export function jourDuChapitre(numero: number, chapitre: number, annee: number): Date {
  const jours = joursDuMagazine(numero, annee);
  return jours[chapitreDeLaPosition(chapitre).numero - 1] ?? jours[0]!;
}

/** Le magazine suivant, dans l'ordre de l'année — et l'on boucle. */
export function magazineSuivant(numero: number): Magazine {
  return magazineParNumero(numero >= NOMBRE_DE_MAGAZINES ? 1 : numero + 1);
}

/** Le magazine précédent, dans l'ordre de l'année — et l'on boucle. */
export function magazinePrecedent(numero: number): Magazine {
  return magazineParNumero(numero <= 1 ? NOMBRE_DE_MAGAZINES : numero - 1);
}

/**
 * **Changer de chapitre sans changer de magazine** : c'est la navigation
 * éditoriale. On reste dans la même semaine, et l'on passe au jour voisin.
 */
export function voisinDuChapitre(date: Date, annee: number, pas: number): Date {
  const magazine = magazineDeLaDate(date);
  const position = positionDansLeMagazine(date);
  const cible = ((position - 1 + pas) % 7 + 7) % 7;
  return jourDuChapitre(magazine.numero, cible + 1, annee);
}

/** Le magazine de la date, avec ses sept chapitres — pour l'affichage. */
export function magazineAvecChapitres(date: Date): {
  magazine: Magazine;
  actif: ChapitreDuMagazine;
  position: number;
} {
  const magazine = magazineDeLaDate(date);
  const position = positionDansLeMagazine(date);
  return { magazine, actif: chapitreDuMagazine(magazine.numero, position), position };
}

/** Vrai quand la collection est complète : 54 magazines, 7 chapitres chacun. */
export const COLLECTION_COMPLETE =
  MAGAZINES.length === NOMBRE_DE_MAGAZINES &&
  MAGAZINES.every((m) => m.chapitres.length === 7) &&
  CHAPITRES.length === 7 &&
  DIRECTIONS.length === NOMBRE_DE_MAGAZINES;

/** Les quatre saisons, dans l'ordre de l'année, telles que la collection les suit. */
export const SAISONS_DE_LA_COLLECTION = SAISONS;
