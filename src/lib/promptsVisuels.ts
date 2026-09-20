/**
 * LES PROMPTS VISUELS — LA MÊME COLLECTION, POUR LES 365 JOURS
 *
 * Chaque jour a un personnage (§48), chaque personnage a sa fiche, et chaque
 * fiche donne **un prompt maître** : la direction artistique n'est pas réinventée
 * à chaque image, elle est **écrite une fois** et se décline.
 *
 * ```
 * IDENTITÉ              ce qui est documenté — la date, le nom, l'origine,
 *                       l'époque, la signification, les éléments historiques
 * INTERPRÉTATION        le personnage contemporain, sa traduction moderne,
 *                       son métier, son savoir-faire, son pont vers le mariage
 * DIRECTION ARTISTIQUE  la collection : photographie éditoriale, casting,
 *                       stylisme, cinéma, aucun kitsch religieux
 * IDENTITÉ DU JOUR      la date, le personnage, la fête, la saison, sa couleur,
 *                       et la lumière du moment
 * ```
 *
 * ## Cinq images pour une seule personne
 *
 * Une journée a **six temps** (§49) et **cinq images** : l'aube, le matin, le
 * midi, l'après-midi, le soir. La nuit garde son dessin et n'a pas de scène —
 * c'est la queue de la veille. Les cinq scènes racontent **le même personnage** :
 * même visage, même silhouette, même garde-robe ; ce qui change, c'est **la
 * lumière, la posture, le décor, l'énergie, la narration**.
 *
 * ## Ce que la collection ne fait jamais
 *
 * Le prompt d'identité **ne contient que du documenté**. Ce qui est créé
 * (le casting, le stylisme, la mise en scène) vit dans l'interprétation, et il
 * est signé comme tel — c'est la dixième règle de la charte, appliquée à l'image.
 * Un jour sans fiche n'a **pas** de prompt maître : il a une liste de ce qui
 * manque. On n'illustre pas ce qu'on n'a pas documenté.
 */

import { MOIS } from './calendrier';
import { PROFILS, cleDuJour, type Profil } from './profilsEditoriaux';
import { PARTS, partParId } from './moments';

/* ————————————————————— LA DIRECTION ARTISTIQUE DE LA COLLECTION ————————————————————— */

export const DIRECTION_ARTISTIQUE: string[] = [
  'photographie éditoriale de mode, pas une illustration',
  'une véritable direction de casting : un visage, un âge, une silhouette tenus',
  'stylisme contemporain, matières nobles, coupes nettes',
  'mise en scène cinématographique, une intention par image',
  'composition très haut de gamme, le sujet respirant dans le cadre',
  'l’esthétique d’un magazine international, pas d’un catalogue',
  'fond et lumière maîtrisés : une source décidée, une ombre assumée',
  'aucun kitsch religieux, aucune icône, aucune auréole, aucun vitrail',
  'aucune représentation générique : pas de silhouette anonyme, pas de foule',
  'pas d’illustration, pas de cartoon, pas de rendu 3D lisse',
  'pas de cliché touristique : le lieu se reconnaît à sa matière, pas à sa carte postale',
];

export const INTERDITS_VISUELS: string[] = [
  'texte dans l’image, logo, filigrane',
  'auréole, nimbe, cierge, statue, vitrail, calice, crucifix',
  'sourire publicitaire, pose de catalogue',
  'décor de carte postale, monument reconnaissable au premier plan',
  'surcroît de détails : une intention par image, le reste est vide',
];

/** Le cadre, la technique : la même pour toute la collection. */
export const CADRAGE = {
  format: 'portrait 5:7 — le format de la couverture',
  focale: '85 mm ou 50 mm, ouverture ouverte',
  plan: 'le personnage à mi-corps, souvent de trois-quarts',
  lumiere: 'une source principale, un fond travaillé, aucune lumière plate',
  matiere: 'grain fin, couleurs désaturées sauf la couleur de la saison',
} as const;

/* ————————————————————————— LES CINQ MOMENTS, EN IMAGES ————————————————————————— */

export interface MomentVisuel {
  /** L'identifiant du temps, dans `moments.ts`. */
  id: string;
  nom: string;
  /** Ce que la lumière fait, à ce moment-là. */
  lumiere: string;
  /** La posture du personnage. */
  posture: string;
  /** Le décor, et sa matière. */
  decor: string;
  /** L'énergie de l'image, en un mot. */
  energie: string;
  /** Ce que le stylisme devient à ce moment-là. */
  stylisme: string;
  /** Ce que l'image raconte — c'est la narration qui fait la continuité. */
  narration: string;
}

export const MOMENTS_VISUELS: MomentVisuel[] = [
  {
    id: 'aube',
    nom: 'L’aube',
    lumiere: 'lumière froide et rasante, le bleu d’avant le jour, une longue ombre',
    posture: 'debout, immobile, le regard direct, les mains visibles',
    decor: 'un lieu vide, encore en désordre : chaises empilées, nappe non posée, brume basse',
    energie: 'le calme absolu',
    stylisme: 'la garde-robe de base, rien d’ajouté, quelques plis vrais',
    narration: 'le personnage est seul, avant que la journée n’existe',
  },
  {
    id: 'matin',
    nom: 'Le matin',
    lumiere: 'lumière claire et franche, deux sources, des blancs tenus',
    posture: 'en mouvement, le corps pris dans une action, le regard qui ne cherche pas l’objectif',
    decor: 'une architecture contemporaine : béton, verre, escalier, très peu de mobilier',
    energie: 'la mise en place',
    stylisme: 'la garde-robe portée, une manche relevée, un tablier, un outil à la main',
    narration: 'le personnage travaille : c’est le moment où le savoir-faire se voit',
  },
  {
    id: 'midi',
    nom: 'Le midi',
    lumiere: 'lumière de studio, dure et graphique, une ombre nette posée au sol',
    posture: 'face caméra, épaules basses, une seule main dans le cadre',
    decor: 'un fond plein, coloré par la saison, aucun décor identifiable',
    energie: 'la pleine puissance',
    stylisme: 'la pièce maîtresse : une seule couleur forte, une seule matière',
    narration: 'le portrait : c’est l’image où le personnage est le plus lui-même',
  },
  {
    id: 'apres-midi',
    nom: 'L’après-midi',
    lumiere: 'lumière qui penche, un côté chaud un côté froid, un rai qui traverse',
    posture: 'de trois-quarts, le regard hors cadre, une main qui touche une matière',
    decor: 'le décor de son histoire, transposé aujourd’hui : sa matière, son objet, son geste',
    energie: 'la bascule',
    stylisme: 'une pièce héritée portée avec du contemporain, l’écart est visible',
    narration: 'le personnage rencontre le monde : c’est l’image du pont, celle qui mène au mariage',
  },
  {
    id: 'soir',
    nom: 'Le soir',
    lumiere: 'golden hour puis nuit : une source chaude, un fond qui s’éteint, des noirs profonds',
    posture: 'assis ou appuyé, le corps détendu, le regard vers la lumière',
    decor: 'une table dressée, des bougies, un extérieur qui devient bleu, des invités hors champ',
    energie: 'la célébration intime',
    stylisme: 'la tenue de soirée, plus longue, plus fluide, la couleur de la saison en accent',
    narration: 'le personnage n’est plus seul : c’est l’image qui ouvre la soirée',
  },
];

export function momentVisuel(id: string): MomentVisuel | null {
  return MOMENTS_VISUELS.find((m) => m.id === id) ?? null;
}

/** Les cinq scènes d'un personnage : 365 × 5 = **1 825 images**. */
export const SCENES_PAR_PERSONNAGE = MOMENTS_VISUELS.length;

/** Ce que la nuit ne reçoit pas, et pourquoi. */
export const PAS_DIMAGE_LA_NUIT =
  'La nuit n’a pas de scène : c’est la queue de la veille, et la couverture y garde son dessin.';

/* ————————————————————————— LE PROMPT MAÎTRE ————————————————————————— */

export interface FicheDeProduction {
  /** `MM-JJ`. */
  jour: string;
  dateLongue: string;
  /** Les cinq blocs, dans l'ordre où ils se lisent. */
  identite: string[];
  interpretation: string[];
  directionArtistique: string[];
  identiteDuJour: string[];
  /** Le prompt maître, écrit d'un trait — prêt à coller. */
  prompt: string;
  /** La version courte, pour l'outil d'image (vocabulaire international). */
  promptTechnique: string;
  /** La direction de casting du personnage, stable sur les cinq scènes. */
  casting: string[];
  /** Ce qui manque pour que ce prompt soit complet. */
  manquant: string[];
}

const INTERDITS_LIGNE = `À éviter absolument : ${INTERDITS_VISUELS.join(' ; ')}.`;

/** Les couleurs de la saison, écrites pour un prompt. */
function saisonDuJour(date: Date, profil: Profil | null): { nom: string; couleur: string; symbole: string } {
  void profil;
  const mois = date.getMonth() + 1;
  const saison = mois >= 3 && mois <= 5 ? 'Printemps' : mois >= 6 && mois <= 8 ? 'Été' : mois >= 9 && mois <= 11 ? 'Automne' : 'Hiver';
  const fonds: Record<string, string> = { Printemps: 'vert tendre', Été: 'jaune chaud', Automne: 'terracotta', Hiver: 'bleu profond' };
  const symboles: Record<string, string> = { Printemps: '♥', Été: '♦', Automne: '♣', Hiver: '♠' };
  return { nom: saison, couleur: fonds[saison]!, symbole: symboles[saison]! };
}

/** Le visage du jour, écrit pour un prompt : lumière et couleur, jamais de contenu. */
function identiteDuJour(date: Date, profil: Profil | null, moment: MomentVisuel | null): string[] {
  const s = saisonDuJour(date, profil);
  const jour = moment
    ? `${moment.nom} — ${moment.lumiere}`
    : 'le prompt maître : les cinq scènes s’ajoutent ensuite, une par moment';
  return [
    `Date : ${date.getDate()} ${MOIS[date.getMonth()]!.nom} ${date.getFullYear()}.`,
    `Personnage : ${profil?.personnage ?? 'à documenter'}.`,
    `Fête : ${profil?.fete ?? '—'}.`,
    `Saison : ${s.nom} ${s.symbole} — ${s.couleur}.`,
    `Moment : ${jour}.`,
  ];
}

/** Le nom court d'un niveau, pour une ligne de prompt : « directe », « culturelle »… */
const MOTS_DE_NIVEAU: Record<string, string> = {
  directe: 'directe',
  culturelle: 'culturelle',
  editoriale: 'éditoriale',
  inspiration: 'inspiration',
};

/** Les ponts, tels qu'ils s'écrivent dans un prompt : chacun avec son niveau. */
function pontsPourLePrompt(profil: Profil): string[] {
  return profil.ponts.map(
    (p) => `Pont vers le mariage (${MOTS_DE_NIVEAU[p.niveau] ?? p.niveau}) — ${p.mot} : ${p.texte}`,
  );
}

/** Deux textes disent la même chose quand la ponctuation et la casse ne comptent pas. */
function memeTexte(a: string, b: string): boolean {
  const net = (t: string) => t.toLowerCase().replace(/[.;,:!?\s«»"']+/g, ' ').trim();
  return net(a) === net(b);
}

/** Une phrase prête à s'écrire : un seul point, à la fin. */
function phrase(texte: string | undefined, defaut = 'à documenter'): string {
  const t = (texte ?? defaut).trim().replace(/[.;\s]+$/, '');
  return `${t}.`;
}

/**
 * **LE PROMPT MAÎTRE D'UN PERSONNAGE.**
 *
 * Sans moment : c'est le prompt de référence, celui qui définit qui est le
 * personnage. Les cinq moments s'y ajoutent ensuite.
 */
export function promptMaitre(profil: Profil, date: Date): FicheDeProduction {
  const identite = [
    `Date : ${date.getDate()} ${MOIS[date.getMonth()]!.nom}.`,
    `Personnage : ${profil.personnage}${
      profil.fete && profil.fete.replace(/^(Saint|Sainte) /, '') !== profil.personnage ? ` — en ce jour de ${profil.fete}` : ''
    }.`,
    `Origine : ${profil.fiche.origine}.`,
    `Époque : ${profil.fiche.epoque}.`,
    `Lieu : ${profil.fiche.lieu}.`,
    `Métier : ${profil.fiche.metier}.`,
    `Invention, savoir-faire : ${profil.fiche.savoirFaire}.`,
    `Culture : ${profil.fiche.culture}.`,
    `Signification : ${phrase(profil.signification)}`,
    `Source : ${profil.source}.`,
  ];

  const interpretation = [
    `Le personnage contemporain : ${profil.casting?.age ?? 'à documenter'}, ${profil.casting?.silhouette ?? 'à documenter'}.`,
    ...(profil.casting?.signes ?? []).map((s) => `Signe tenu : ${s}.`),
    `Garde-robe : ${profil.casting?.gardeRobe ?? 'à documenter'}.`,
    ...pontsPourLePrompt(profil),
    /* Les inspirations qui portent déjà un pont ne se répètent pas : une idée se
       dit une fois. Celles qui restent sont les mises en scène sans pont. */
    ...(profil.inspirations ?? [])
      .filter((i) => !profil.ponts.some((pont) => memeTexte(pont.texte, i)))
      .map((i) => `Inspiration de mise en scène (création assumée) : ${phrase(i)}`),
  ];

  const manquant: string[] = [];
  if (!profil.signification) manquant.push('la signification du prénom');
  if (!profil.casting) manquant.push('la direction de casting');
  if (!profil.inspirations || profil.inspirations.length === 0) manquant.push('les inspirations');

  const casting = profil.casting
    ? [
        `Silhouette : ${profil.casting.silhouette}.`,
        `Âge : ${profil.casting.age}.`,
        `Garde-robe : ${profil.casting.gardeRobe}.`,
        `Signes tenus sur les cinq scènes : ${profil.casting.signes.join(', ')}.`,
        'Ces éléments ne changent pas d’une scène à l’autre : c’est ce qui fait qu’on reconnaît la personne.',
      ]
    : [];

  const identiteJour = identiteDuJour(date, profil, null);
  const prompt = [
    `COUVERTURE AIME MAGAZINE — ${profil.personnage.toUpperCase()}`,
    '',
    'IDENTITÉ',
    ...identite.map((l) => `· ${l}`),
    '',
    'INTERPRÉTATION',
    ...interpretation.map((l) => `· ${l}`),
    '',
    'DIRECTION ARTISTIQUE',
    ...DIRECTION_ARTISTIQUE.map((l) => `· ${l}`),
    `· ${INTERDITS_LIGNE}`,
    `· Cadre : ${CADRAGE.format}, ${CADRAGE.focale}, ${CADRAGE.plan}, ${CADRAGE.lumiere}, ${CADRAGE.matiere}.`,
    '',
    'IDENTITÉ DU JOUR',
    ...identiteJour.map((l) => `· ${l}`),
  ].join('\n');

  const s = saisonDuJour(date, profil);
  const promptTechnique = [
    'editorial fashion photograph, cinematic, film grain, 85mm, mid-body portrait',
    `subject: contemporary reinterpretation of ${profil.personnage}, ${profil.casting?.age ?? ''} ${profil.casting?.silhouette ?? ''}`.trim(),
    `context: ${profil.fiche.metier.toLowerCase()}, ${profil.fiche.savoirFaire.toLowerCase()}`,
    `palette: ${s.couleur} accent, desaturated, one key light`,
    'no religious iconography, no halo, no stained glass, no text, no logo, no crowd, no postcard landmark, no cartoon',
  ].join(' — ');

  return {
    jour: profil.jour,
    dateLongue: `${date.getDate()} ${MOIS[date.getMonth()]!.nom} ${date.getFullYear()}`,
    identite,
    interpretation,
    directionArtistique: [...DIRECTION_ARTISTIQUE, INTERDITS_LIGNE, `Cadre : ${CADRAGE.format}, ${CADRAGE.focale}, ${CADRAGE.plan}.`],
    identiteDuJour: identiteJour,
    prompt,
    promptTechnique,
    casting,
    manquant,
  };
}

/**
 * **LES CINQ SCÈNES D'UN PERSONNAGE** — le même, cinq fois.
 *
 * Le prompt maître ne change pas : ce qui s'ajoute, c'est le moment — sa
 * lumière, sa posture, son décor, son énergie, sa narration.
 */
export function scenesDuPersonnage(profil: Profil, date: Date): Array<{ moment: MomentVisuel; texte: string }> {
  const base = promptMaitre(profil, date);
  return MOMENTS_VISUELS.map((moment) => {
    const texte = [
      base.prompt,
      ...(base.casting.length ? ['', 'DIRECTION DE CASTING', ...base.casting] : []),
      '',
      `MOMENT — ${moment.nom.toUpperCase()}`,
      `· Lumière : ${moment.lumiere}.`,
      `· Posture : ${moment.posture}.`,
      `· Décor : ${moment.decor}.`,
      `· Énergie : ${moment.energie}.`,
      `· Stylisme : ${moment.stylisme}.`,
      `· Narration : ${moment.narration}.`,
    ].join('\n');
    return { moment, texte };
  });
}

/* ————————————————————————— L'ANNÉE, PRÊTE À PRODUIRE ————————————————————————— */

export type EtatFiche = 'complete' | 'a-documenter';

export interface EntreeDeLAnnee {
  jour: string;
  mois: number;
  quantieme: number;
  personnage: string;
  etat: EtatFiche;
  /** Ce qui manque, quand la fiche n'est pas documentée. */
  manquant: string[];
  /** Le prompt, quand il existe. */
  prompt: string | null;
}

/** Le calendrier entier d'un mois, avec l'état de chaque fiche. */
export function entreesDuMois(annee: number, mois: number): EntreeDeLAnnee[] {
  const dernier = new Date(annee, mois, 0).getDate();
  const entrees: EntreeDeLAnnee[] = [];
  for (let q = 1; q <= dernier; q += 1) {
    const date = new Date(annee, mois - 1, q);
    const cle = cleDuJour(date);
    const profil = PROFILS[cle] ?? null;
    const fiche = profil ? promptMaitre(profil, date) : null;
    entrees.push({
      jour: cle,
      mois,
      quantieme: q,
      personnage: profil?.personnage ?? '',
      etat: profil && fiche && fiche.manquant.length === 0 ? 'complete' : 'a-documenter',
      manquant: profil
        ? (fiche?.manquant ?? [])
        : ['la fiche du personnage : origine, époque, lieu, métier, savoir-faire, culture', 'les ponts vers le mariage', 'la direction de casting'],
      prompt: profil ? (fiche?.prompt ?? null) : null,
    });
  }
  return entrees;
}

/** L'année entière : **365 entrées**, dont celles qui sont prêtes. */
export function entreesDeLAnnee(annee: number): EntreeDeLAnnee[] {
  const entrees: EntreeDeLAnnee[] = [];
  for (let mois = 1; mois <= 12; mois += 1) entrees.push(...entreesDuMois(annee, mois));
  return entrees;
}

/** Combien de fiches sont prêtes, combien attendent — le tableau de production. */
export function etatDeLaSerie(annee: number): {
  jours: number;
  pretes: number;
  aDocumenter: number;
  scenes: number;
  parMois: Array<{ mois: number; nom: string; pretes: number; jours: number }>;
} {
  const entrees = entreesDeLAnnee(annee);
  const pretes = entrees.filter((e) => e.etat === 'complete').length;
  return {
    jours: entrees.length,
    pretes,
    aDocumenter: entrees.length - pretes,
    /** Les scènes ne se comptent que là où le prompt existe : on n'invente pas. */
    scenes: pretes * SCENES_PAR_PERSONNAGE,
    parMois: MOIS.map((m) => {
      const duMois = entrees.filter((e) => e.mois === m.numero);
      return { mois: m.numero, nom: m.nom, pretes: duMois.filter((e) => e.etat === 'complete').length, jours: duMois.length };
    }),
  };
}

/** Le temps du jour, retrouvé par son identifiant — réexporté pour la production. */
export { partParId, PARTS };
