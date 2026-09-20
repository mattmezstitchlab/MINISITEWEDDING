import {
  PAS_DE_TEMPS, carteDuNumero, pasDeTempsDeLaSemaine, phaseDeLune, saisonDeLaSemaine,
  semaineDeLAnnee, type CarteDeSemaine, type Saison,
} from './jeuDeCartes';
import { composerEdition, type Edition, type OptionsEdition } from './aimeMoteur';
import { jokerDuJour, jourNomme, type JourNomme } from './saintsDuJour';

/**
 * LE JOUR DU MAGAZINE — UN JOUR, UNE COUVERTURE, UNE ÉDITION
 *
 * Le magazine n'a pas seulement une semaine : il a **un jour**. Chaque jour de
 * l'année a **sa couverture** (364 prénoms du calendrier, plus les deux jokers),
 * **sa carte** (celle de sa semaine, dans le jeu de 54), **son studio** (fond
 * blanc, parfois fond noir), **sa météo** — la moyenne du passé, pas une
 * prévision — et **ses clés** : la lune, les portes du soleil, l'interstice des
 * deux années, le chiffre du jour, et le treizième signe.
 *
 * **Rien d'aléatoire d'un affichage à l'autre** : tout se déduit de la date par
 * une signature stable. Le jour qu'on relit est le jour qu'on a lu.
 *
 * **Ce qui est une croyance, et ce qui est une mesure.** La météo est une
 * **moyenne** (normales françaises, voir plus bas) ; la lune est un calcul
 * astronomique ; le chiffre, l'interstice et le signe caché sont des **lectures
 * symboliques** — on les donne comme telles, jamais comme des faits. C'est la
 * même règle que pour la symétrie du jeu de cartes : une histoire, et on le dit.
 */

/* ————————————————————————— LES SEPT JOURS ————————————————————————— */

/** Les sept jours de la semaine : chacun a son rôle dans un mariage. */
export const JOURS_DE_LA_SEMAINE = [
  { nom: 'lundi', sens: 'on ouvre — les listes, les appels, ce qui commence' },
  { nom: 'mardi', sens: 'on annonce — ce qui se dit, et à qui' },
  { nom: 'mercredi', sens: 'on écrit — les mots, les papiers, les signatures' },
  { nom: 'jeudi', sens: 'on visite — les lieux, les gens, les essais' },
  { nom: 'vendredi', sens: 'on rassemble — ceux qui viennent de loin' },
  { nom: 'samedi', sens: 'on dresse — la table, la lumière, la scène' },
  { nom: 'dimanche', sens: 'on célèbre — et le lendemain existe' },
] as const;

/* ————————————————————————— LA MÉTÉO DU PASSÉ ————————————————————————— */

/**
 * Les **normales** françaises (période 1991-2020, référence Paris-Montsouris,
 * Météo-France) : le minimum et le maximum moyens, les jours de pluie et les
 * heures de soleil, mois par mois. Ce sont **des moyennes du passé** — ce
 * qu'il a fait, en gros, ces trente dernières années — et non une prévision.
 */
const NORMALES: Array<{ min: number; max: number; pluie: number; soleil: number }> = [
  { min: 2.7, max: 7.2, pluie: 10, soleil: 2.0 },  // janvier
  { min: 2.8, max: 8.3, pluie: 9, soleil: 3.0 },   // février
  { min: 4.7, max: 12.2, pluie: 10, soleil: 4.0 }, // mars
  { min: 6.6, max: 15.6, pluie: 9, soleil: 5.5 },  // avril
  { min: 10.2, max: 19.6, pluie: 10, soleil: 6.5 },// mai
  { min: 13.1, max: 22.7, pluie: 8, soleil: 7.0 }, // juin
  { min: 15.2, max: 25.2, pluie: 8, soleil: 7.5 }, // juillet
  { min: 14.9, max: 25.0, pluie: 7, soleil: 7.0 }, // août
  { min: 11.9, max: 21.1, pluie: 8, soleil: 6.0 }, // septembre
  { min: 9.1, max: 16.3, pluie: 10, soleil: 4.0 }, // octobre
  { min: 5.6, max: 10.8, pluie: 10, soleil: 2.5 }, // novembre
  { min: 3.2, max: 7.5, pluie: 11, soleil: 1.8 },  // décembre
];

export interface Meteo {
  min: number;
  max: number;
  /** Ce qu'on voit : grand soleil, ciel voilé, pluie, giboulées, chaleur, gel. */
  ciel: string;
  /** Ce que ça change pour un mariage. */
  phrase: string;
  /** Le résumé, en une ligne, tel qu'il s'écrit dans l'édition. */
  resume: string;
}

/** Une signature stable : la même date donne toujours le même ciel. */
function signature(date: Date): number {
  let h = 2166136261;
  const graine = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  for (let i = 0; i < graine.length; i += 1) {
    h ^= graine.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Le jour de l'année, 1 à 366. */
export function jourDeLAnnee(date: Date): number {
  const debut = new Date(date.getFullYear(), 0, 1);
  return Math.floor((date.getTime() - debut.getTime()) / 86400000) + 1;
}

/** **La météo du jour** : les moyennes du passé, lissées, jour après jour. */
export function meteoDuJour(date: Date): Meteo {
  const mois = date.getMonth();
  const avant = NORMALES[(mois + 11) % 12]!;
  const ici = NORMALES[mois]!;
  const apres = NORMALES[(mois + 1) % 12]!;
  const joursDansLeMois = new Date(date.getFullYear(), mois + 1, 0).getDate();
  // On glisse d'un mois à l'autre : le 1er tient compte du mois d'avant, le
  // dernier du mois d'après — la courbe de l'année ne fait pas de marche.
  const t = (date.getDate() - 0.5) / joursDansLeMois;
  const min = ici.min * (1 - Math.abs(t - 0.5) * 0.4) + (t < 0.5 ? avant.min : apres.min) * (Math.abs(t - 0.5) * 0.4);
  const max = ici.max * (1 - Math.abs(t - 0.5) * 0.35) + (t < 0.5 ? avant.max : apres.max) * (Math.abs(t - 0.5) * 0.35);
  // Un écart jour après jour, toujours le même pour une date donnée.
  const ecart = ((signature(date) % 41) - 20) / 10; // −2,0 à +2,0 °C
  const tMin = Math.round((min + ecart * 0.6) * 10) / 10;
  const tMax = Math.round((max + ecart) * 10) / 10;
  const pluie = ici.pluie / joursDansLeMois;

  const tirage = (signature(date) >> 3) % 100;
  const ciel =
    tMax >= 28 ? 'chaleur'
      : tMax <= 3 ? 'gel'
        : tirage < pluie * 100 ? (mois >= 2 && mois <= 4 ? 'giboulées' : 'pluie')
          : tirage < pluie * 100 + 22 ? 'ciel voilé'
            : tirage < pluie * 100 + 32 ? 'gris'
              : 'grand soleil';

  const phrase: Record<string, string> = {
    chaleur: 'Au-dessus de 28 °C : de l’eau, de l’ombre, et la cérémonie à la fraîche.',
    gel: 'Sous 3 °C : on compte les couvertures, les braseros, et les mains gantées.',
    pluie: 'Il pleut en moyenne ce jour-là : le plan B doit être écrit, pas décidé sur place.',
    giboulées: 'Ciel de giboulées : soleil et averse dans la même heure — deux plans, pas un.',
    'ciel voilé': 'Ciel voilé : la plus belle lumière pour les portraits, et pas d’ombre dure.',
    gris: 'Ciel gris : la lumière est douce, les couleurs tiennent, les photos pardonnent.',
    'grand soleil': 'Grand soleil : les ombres sont dures à midi, la cérémonie se place en fin de journée.',
  };

  return {
    min: tMin,
    max: tMax,
    ciel,
    phrase: phrase[ciel] ?? '',
    resume: `${Math.round(tMin)} °C le matin, ${Math.round(tMax)} °C l’après-midi, ${ciel}`,
  };
}

/* ————————————————————————— LES CLÉS DU JOUR ————————————————————————— */

export interface Cles {
  /** La lune, calculée. */
  lune: { nom: string; jour: number };
  /** Les quatre portes de l'année : solstices et équinoxes. */
  porte: string | null;
  /** Les douze jours entre les deux années. */
  interstice: boolean;
  /** La lecture numérique du jour, de 1 à 9. */
  chiffre: { nombre: number; sens: string };
  /** Le treizième signe — celui qu'on a retiré. */
  signeCache: { nom: string; periode: string; sens: string } | null;
}

const SENS_DES_CHIFFRES: Record<number, string> = {
  1: 'un — ce qui commence, et ce qui se décide seul',
  2: 'deux — le duo, l’accord, ce qui se dit à deux',
  3: 'trois — la famille, les témoins, ce qui s’élargit',
  4: 'quatre — le lieu, la maison, ce qu’on construit',
  5: 'cinq — le mouvement, les voyages, les invités qui viennent de loin',
  6: 'six — le soin, la table, ce qu’on donne aux autres',
  7: 'sept — l’épreuve et le silence, ce qui demande du temps',
  8: 'huit — le travail, l’ordre, ce qui se règle proprement',
  9: 'neuf — ce qui se termine bien, et ce qu’on peut lâcher',
};

/** La lune, les portes du soleil, l'interstice, le chiffre et le signe caché. */
export function clesDuJour(date: Date): Cles {
  const mois = date.getMonth() + 1;
  const jour = date.getDate();

  const portes: Array<[number, number, string]> = [
    [3, 20, 'l’équinoxe de printemps — la nuit et le jour se valent'],
    [6, 21, 'le solstice d’été — le jour le plus long'],
    [9, 22, 'l’équinoxe d’automne — la nuit reprend le dessus'],
    [12, 21, 'le solstice d’hiver — la nuit la plus longue'],
  ];
  const porte = portes.find(([m, j]) => m === mois && Math.abs(j - jour) <= 1)?.[2] ?? null;

  const interstice = (mois === 12 && jour >= 26) || (mois === 1 && jour <= 5);

  const somme = String(jour + mois).split('').reduce((n, c) => n + Number(c), 0);
  const chiffre = ((somme - 1) % 9) + 1;

  // Le treizième signe : le Serpentaire, entre le Scorpion et le Sagittaire —
  // celui que les signes ont retiré pour n'en garder que douze, et que la
  // tradition relie à la guérison.
  const serpentaire = (mois === 11 && jour >= 30) || (mois === 12 && jour <= 17);
  const signeCache = serpentaire
    ? {
      nom: 'Le Serpentaire',
      periode: 'du 30 novembre au 17 décembre',
      sens: 'le treizième signe — celui qu’on a retiré des douze ; on le garde ici pour ce qu’il dit : guérir, tenir le serpent sans être mordu.',
    }
    : null;

  return {
    lune: phaseDeLune(date),
    porte,
    interstice,
    chiffre: { nombre: chiffre, sens: SENS_DES_CHIFFRES[chiffre] ?? '' },
    signeCache,
  };
}

/* ————————————————————————— LE STUDIO ————————————————————————— */

export interface StudioDuJour {
  /** `blanc` un jour ordinaire, `dense` un temps clos, `noir` les trois cas rares. */
  fond: 'blanc' | 'dense' | 'noir';
  /** Pourquoi ce fond-là. */
  raison: string;
  /** Vrai quand le temps est clos : la couleur de la saison, assombrie. */
  dense: boolean;
  /** La pose, l'attribut et la lumière : trois tirages stables. */
  pose: string;
  attribut: string;
  lumiere: string;
  /** La graine du portrait : deux jours n'ont jamais le même. */
  graine: number;
}

const POSES = [
  'de face, les épaules basses',
  'de trois-quarts, le regard vers la lumière',
  'de profil, le menton haut',
  'assise, les mains sur les genoux',
  'debout, les bras croisés',
  'de dos, la tête tournée',
  'en marche, prise au milieu du pas',
  'accoudée, le poids sur un côté',
] as const;

const ATTRIBUTS = [
  'un bouquet serré',
  'un livre ouvert',
  'un outil à la main',
  'un voile léger',
  'les mains vides, ouvertes',
  'une coupe',
  'une chaise, et rien d’autre',
  'de la lumière, tout simplement',
] as const;

/**
 * **Le studio** : le portrait du jour. Fond **blanc** le plus souvent, comme
 * dans un vrai studio ; fond **noir** pour les jours qui ne sont pas des jours
 * comme les autres — les dimanches, les temps clos, les portes de l'année, et
 * les deux jokers. C'est là que la lumière change de côté.
 */
export function studioDuJour(date: Date): StudioDuJour {
  const graine = signature(date);
  const mois = date.getMonth() + 1;
  const jour = date.getDate();
  const dimanche = date.getDay() === 0;
  const joker = jokerDuJour(date) !== null;
  const pas = pasDeTempsDeLaSemaine(semaineDeLAnnee(date));
  const tempsClos = /carême|avent/i.test(pas.nom);
  const porte = clesDuJour(date).porte !== null;

  /* LE NOIR EST RARE, ET IL VEUT DIRE QUELQUE CHOSE. Trois cas seulement : le
     joker (un jour qui n'appartient à aucune semaine), le dimanche (on célèbre,
     la lumière tombe de côté) et les portes de l'année (la lumière change). */
  const noir = joker || dimanche || porte;
  /* UN TEMPS CLOS N'EST PAS NOIR : il assombrit la couleur de sa saison. Le
     carême, l'avent et l'avant-carême gardent donc leur couleur — plus dense,
     plus sourde — au lieu de disparaître dans le noir. */
  const dense = tempsClos && !noir;
  const raison = joker
    ? 'un joker : le jour n’appartient à aucune semaine'
    : dimanche
      ? 'un dimanche : on célèbre, la lumière tombe de côté'
      : porte
        ? 'une porte de l’année : la lumière change'
        : tempsClos
          ? `un temps clos : ${pas.nom.toLowerCase()}`
          : 'un jour ordinaire : fond blanc, lumière douce';

  void mois;
  void jour;

  return {
    fond: noir ? 'noir' : dense ? 'dense' : 'blanc',
    raison,
    dense,
    pose: POSES[graine % POSES.length]!,
    attribut: ATTRIBUTS[(graine >> 4) % ATTRIBUTS.length]!,
    lumiere: noir
      ? 'une lumière dure, un seul côté'
      : dense
        ? 'une lumière serrée, un fond de saison assombri'
        : 'une lumière douce, deux sources',
    graine,
  };
}

/* ————————————————————————— LE SUPER SAINT DU JOUR ————————————————————————— */

/**
 * **LE SUPER SAINT** — l'architecte du magazine du jour.
 *
 * Chaque jour a son prénom : c'est lui l'architecte. **AGENT SAINT-MATTHIEU**,
 * par exemple. Ce n'est pas un personnage de plus : c'est **celui qui compose**,
 * qui regarde le temps qu'il fait, la lune, le soleil, l'interstice, l'ombre et
 * la lumière — et qui **décide quels SUPER HÉROS travailleront ce jour-là**.
 *
 * Il ne les choisit pas au hasard : la lune donne le rythme, la météo donne le
 * risque, la saison donne la matière, le jour de la semaine donne le geste. Le
 * magazine qui en sort n'est jamais le même, et il est **toujours justifié** :
 * chaque page dit ce qui l'a décidée.
 */
export interface SuperSaint {
  /** Le nom de l'agent : « AGENT SAINT-MATTHIEU ». */
  nom: string;
  /** Ce qu'il regarde en premier, ce jour-là. */
  regard: string;
  /** Les héros qu'il met au travail, dans l'ordre. */
  heros: string[];
  /** Pourquoi eux, aujourd'hui. */
  pourquoi: string;
}

/** Les héros disponibles : leurs noms, tels qu'ils se disent. */
const HEROS: Array<{ nom: string; quand: string[]; quoi: string }> = [
  { nom: 'LA MÉTÉO', quand: ['pluie', 'giboulées', 'gel'], quoi: 'elle tient le plan B, et l’ordre des choses' },
  { nom: 'LE CŒUR', quand: ['grand soleil', 'chaleur'], quoi: 'il vérifie que personne n’oublie personne' },
  { nom: 'LA SANTÉ', quand: ['chaleur', 'gel'], quoi: 'eau, ombre, couvertures, traitements' },
  { nom: 'LE CHRONOMÈTRE', quand: ['samedi', 'dimanche'], quoi: 'les heures du jour J, à la minute' },
  { nom: 'LE SEMEUR', quand: ['printemps'], quoi: 'ce qui se plante maintenant pour dans six mois' },
  { nom: 'L’INTENDANT', quand: ['été'], quoi: 'la logistique des longs jours' },
  { nom: 'L’ARCHIVISTE', quand: ['automne'], quoi: 'ce qu’on garde, ce qu’on relira' },
  { nom: 'LE VEILLEUR', quand: ['hiver'], quoi: 'l’intime, les petits comités' },
  { nom: 'LA BOUSSOLE', quand: ['porte', 'interstice'], quoi: 'où l’on va, et par où l’on passe' },
  { nom: 'LE PASSEUR DE LIEN', quand: ['lundi', 'mardi'], quoi: 'les annonces, les appels, les listes' },
  { nom: 'L’ÉCHO', quand: ['mercredi', 'jeudi'], quoi: 'ce qui se dit, et à qui on le dit' },
  { nom: 'LE TÉMOIN', quand: ['vendredi'], quoi: 'la parole donnée devant les autres' },
  { nom: 'LA BALANCE', quand: ['chiffre'], quoi: 'l’équilibre entre les deux familles' },
  { nom: 'L’ORFÈVRE', quand: ['signe'], quoi: 'ce qui se garde et se transmet' },
];

/** Le super saint d'un jour : son nom, son regard, ses héros. */
export function superSaintDuJour(date: Date): SuperSaint {
  const nomme = jourNomme(date);
  const joker = jokerDuJour(date);
  const meteo = meteoDuJour(date);
  const cles = clesDuJour(date);
  const jour = JOURS_DE_LA_SEMAINE[(date.getDay() + 6) % 7]!;
  const pas = pasDeTempsDeLaSemaine(semaineDeLAnnee(date));

  const brut = nomme?.nom ?? joker?.saint ?? '';
  const nom = brut ? `AGENT SAINT-${brut.toUpperCase().replace(/^(SAINTE?|SAINT-)/, '')}` : 'AGENT DU JOUR DE TROP';

  const indices = [
    meteo.ciel,
    jour.nom,
    cles.porte ? 'porte' : '',
    cles.interstice ? 'interstice' : '',
    cles.signeCache ? 'signe' : '',
    `chiffre-${cles.chiffre.nombre}`,
  ].filter(Boolean);

  // On note chaque héros : combien de ce que le jour apporte lui parle. Le
  // classement est stable — à égalité, l'ordre du catalogue décide — et il y a
  // toujours du monde au travail : un jour sans héros ne serait pas un jour.
  const notes = HEROS.map((h, i) => {
    let note = indices.filter((q) => h.quand.includes(q)).length;
    if (h.quand.includes(saisonDeLaSemaine(semaineDeLAnnee(date)).id)) note += 1;
    if (h.quand.includes(jour.nom)) note += 1;
    return { h, note, i };
  });
  const liste = notes
    .slice()
    .sort((a, b) => b.note - a.note || a.i - b.i)
    .slice(0, 4)
    .map((n) => n.h);

  return {
    nom,
    regard: `${meteo.ciel}, la lune ${cles.lune.nom}, ${jour.nom} — et ${pas.nom.toLowerCase()}`,
    heros: liste.map((h) => h.nom),
    pourquoi: liste.map((h) => `${h.nom} : ${h.quoi}`).join(' · '),
  };
}

/* ————————————————————————— LE FIL ROUGE, ET L'ACTION PARFAITE ————————————————————————— */

/**
 * **LE FIL ROUGE** — ce qui relie les jours entre eux.
 *
 * Il vient de l'histoire japonaise du fil rouge du destin : le fil qui relie deux
 * personnes, et qu'on ne voit pas. Ici, il relie **les jours** — et chaque jour,
 * il y a **une action parfaite** : une seule, celle qui compte aujourd'hui, et qui
 * n'a pas de prix. « Le Chemin » se lit ainsi : jour après jour, le fil se
 * déroule, et l'on n'a jamais qu'une chose à faire.
 */
export function filRougeDuJour(date: Date): { fil: string; actionParfaite: string } {
  const nom = jourNomme(date)?.nom ?? '';
  const jour = JOURS_DE_LA_SEMAINE[(date.getDay() + 6) % 7]!;
  const meteo = meteoDuJour(date);
  const cles = clesDuJour(date);
  const saison = saisonDeLaSemaine(semaineDeLAnnee(date));

  const actions: Record<string, string> = {
    lundi: 'ouvrir une chose : une liste, un appel, une porte',
    mardi: 'dire une chose à quelqu’un, aujourd’hui, et pas « plus tard »',
    mercredi: 'écrire une chose : un mot, un papier, une date',
    jeudi: 'voir une chose de ses yeux : un lieu, une personne, un essai',
    vendredi: 'rassembler deux personnes qui ne se connaissent pas encore',
    samedi: 'dresser une chose : une table, une lumière, un plan',
    dimanche: 'ne rien faire, et le faire bien',
  };

  return {
    fil: `Le fil du jour passe par ${nom || 'le jour de trop'} : ${jour.sens}. ${meteo.phrase} ` +
      `La lune est ${cles.lune.nom}, le chiffre est le ${cles.chiffre.nombre} — et la saison, ${saison.nom.toLowerCase()}, ${saison.sens.toLowerCase()}.`,
    actionParfaite: actions[jour.nom] ?? 'tenir le fil',
  };
}

/* ————————————————————————— LE JOUR, EN ENTIER ————————————————————————— */

export interface JourDuMagazine {
  date: Date;
  /** Le rang dans l'année, 1 à 366. */
  ordinal: number;
  /** Le prénom du jour, ou `null` les deux jours jokers. */
  nomme: JourNomme | null;
  /** Le nom à écrire : le prénom, ou « le jour de trop ». */
  nom: string;
  /** Le joker, quand c'en est un. */
  joker: { numero: number; nom: string; saint: string | null } | null;
  carte: CarteDeSemaine;
  saison: Saison;
  semaine: number;
  /** Le jour de la semaine, et son rôle. */
  jourSemaine: { nom: string; sens: string };
  /** La couverture : 1 à 364 pour les jours nommés, 53 ou 54 pour les jokers. */
  numeroDeCouverture: number;
  meteo: Meteo;
  cles: Cles;
  studio: StudioDuJour;
  /** L'édition du jour : vingt-quatre pages, une par heure. */
  edition: Edition;
  /** Le super saint du jour : l'architecte, et les héros qu'il met au travail. */
  superSaint: SuperSaint;
}

/** L'édition d'un jour : les huit rubriques, et la première dit le temps qu'il fait. */
export function editionDuJour(date: Date, options: OptionsEdition = {}): Edition {
  const semaine = semaineDeLAnnee(date);
  const edition = composerEdition({ ...options, numero: semaine });
  const nomme = jourNomme(date);
  const joker = jokerDuJour(date);
  const meteo = meteoDuJour(date);
  const cles = clesDuJour(date);
  const jour = JOURS_DE_LA_SEMAINE[(date.getDay() + 6) % 7]!;
  const nom = nomme?.nom ?? joker?.nom ?? '';

  const titreDuJour = nomme
    ? nomme.genre === 'fete' ? nomme.nom : `${nomme.genre === 'sainte' ? 'Sainte' : 'Saint'} ${nomme.nom}`
    : `Le ${joker?.nom ?? 'jour'}`;

  const pages = edition.pages.map((page) => {
    if (page.rubrique === 'Le temps' && page.heure === 0) {
      return {
        ...page,
        titre: `${titreDuJour} — ${page.titre}`,
        texte:
          `Aujourd’hui, ${jour.nom} : ${jour.sens}. Les moyennes du passé pour ce jour : ${meteo.resume}. ` +
          `${meteo.phrase} La lune est ${cles.lune.nom} (jour ${cles.lune.jour} de la lunaison).` +
          (cles.porte ? ` Et c’est ${cles.porte}.` : '') +
          (cles.interstice ? ' Nous sommes dans l’interstice : les jours entre les deux années, où rien n’est encore décidé.' : ''),
        source: `${nom ? `${nom} · ` : ''}Jour ${jourDeLAnnee(date)} · moyennes du passé`,
      };
    }
    if (page.rubrique === 'Le passage' && page.heure === 11) {
      return {
        ...page,
        titre: page.titre,
        texte:
          `${page.texte} Le chiffre du jour est le ${cles.chiffre.nombre} : ${cles.chiffre.sens}.` +
          (cles.signeCache ? ` Le soleil est dans ${cles.signeCache.nom} — ${cles.signeCache.sens}` : ''),
        source: `${page.source} · chiffre du jour`,
      };
    }
    return page;
  });

  return {
    ...edition,
    titre: `${edition.titre} · le jour ${jourDeLAnnee(date)}`,
    sousTitre: nom ? `${titreDuJour} — ${edition.sousTitre}` : edition.sousTitre,
    pages,
  };
}

/** **Le jour du magazine** : tout ce qu'un jour porte, en un objet. */
export function jourDuMagazine(date: Date, options: OptionsEdition = {}): JourDuMagazine {
  const semaine = semaineDeLAnnee(date);
  const carte = carteDuNumero(semaine);
  const nomme = jourNomme(date);
  const joker = jokerDuJour(date);

  return {
    date,
    ordinal: jourDeLAnnee(date),
    nomme,
    nom: nomme?.nom ?? joker?.saint ?? joker?.nom ?? '',
    joker: joker ? { numero: joker.numero, nom: joker.nom, saint: joker.saint } : null,
    carte,
    saison: saisonDeLaSemaine(semaine),
    semaine,
    jourSemaine: JOURS_DE_LA_SEMAINE[(date.getDay() + 6) % 7]!,
    numeroDeCouverture: joker ? joker.numero : (nomme?.ordinal ?? 1),
    meteo: meteoDuJour(date),
    cles: clesDuJour(date),
    studio: studioDuJour(date),
    superSaint: superSaintDuJour(date),
    edition: editionDuJour(date, options),
  };
}

/** Les jours qui suivent, dans l'ordre : c'est le flux qu'on fait glisser. */
export function joursAutour(date: Date, combien = 7, pas = 1): Date[] {
  return Array.from({ length: combien }, (_, i) => {
    const d = new Date(date);
    d.setDate(d.getDate() + i * pas);
    return d;
  });
}

/** Les quatre saisons du calendrier, avec la date de leur premier jour. */
export function lesQuatrePortes(): Array<{ nom: string; date: string }> {
  void PAS_DE_TEMPS;
  return [
    { nom: 'Printemps', date: '20 mars' },
    { nom: 'Été', date: '21 juin' },
    { nom: 'Automne', date: '22 septembre' },
    { nom: 'Hiver', date: '21 décembre' },
  ];
}
