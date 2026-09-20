import { WEDDING_STYLES, type WeddingStyle } from './weddingStyles';
import { PERSONNAGES, type Personnage } from './personas';
import { DOCUMENTS, type DocumentPossible } from './superFooter';
import { CATALOGUE } from './weddingPlaylist';
import {
  JEU_DE_54, SAISONS, bornesDeLaSemaine, carteDuNumero, pasDeTempsDeLaSemaine, phaseDeLune,
  semaineDeLAnnee, type CarteDeSemaine, type Saison,
} from './jeuDeCartes';

/**
 * LE MOTEUR — LE NUMÉRO DE LA SEMAINE
 *
 * AIME MAGAZINE a **54 numéros** : les 52 semaines et les deux jokers. Chaque
 * numéro est une édition, et **la composition de l'édition dépend de vous** :
 *
 * - la **semaine** — ce que les gens faisaient à cette période, et la lune ;
 * - la **carte** — sa couleur, sa figure, son sens ;
 * - **votre rôle** — ce que vous avez à faire, et ceux avec qui vous le faites ;
 * - **vos coches** (SUPER FOOTER) — les papiers qui vous concernent ;
 * - **votre univers** — le lieu de la journée ;
 * - et le **temps** : la même semaine se relit **au passé** (l'an dernier, la
 *   même semaine) et **au futur** (l'an prochain).
 *
 * Rien n'est tiré au hasard au sens d'arbitraire : tout est **signé** par vos
 * choix. Changez une coche, changez de rôle, de semaine ou d'univers : l'édition
 * change. C'est la promesse des 54 : personne n'aura jamais le même numéro.
 *
 * **Le nombre de pages ne change jamais** (`PAGES_EDITION`), et le sommaire non
 * plus : huit rubriques, toujours les mêmes, dans le même ordre.
 */

export const PAGES_EDITION = 8;

/** Les huit rubriques, dans l'ordre — elles ne bougent pas. */
export const RUBRIQUES = [
  'Le temps',
  'La carte',
  'L’amour',
  'Le passage',
  'Les gens',
  'Vos papiers',
  'La musique',
  'L’archive',
] as const;

export type NomDeRubrique = (typeof RUBRIQUES)[number];

export interface PageEdition {
  rubrique: NomDeRubrique;
  titre: string;
  texte: string;
  /** Une signature courte : ce qui a décidé cette page. */
  source: string;
}

export interface OptionsEdition {
  /** La semaine voulue. Par défaut : celle d'aujourd'hui. */
  numero?: number;
  /** L'année de lecture. */
  annee?: number;
  /** Le rôle de la personne (son personnage). */
  roleId?: string;
  /** L'univers choisi. */
  styleId?: string;
  /** Les coches de SUPER FOOTER. */
  options?: string[];
  /** Passé, présent, futur : la même semaine, trois fois. */
  temps?: 'passe' | 'present' | 'futur';
}

export interface Edition {
  /** Le numéro : 1 à 54. */
  numero: number;
  carte: CarteDeSemaine;
  saison: Saison;
  /** Les dates couvertes. */
  du: Date;
  fin: Date;
  /** Le titre de l'édition, sur la couverture. */
  titre: string;
  sousTitre: string;
  temps: 'passe' | 'present' | 'futur';
  pages: PageEdition[];
}

/* ————————————————————————— SIGNER L'ÉDITION ————————————————————————— */

/**
 * Une signature stable : mêmes choix, même édition. On n'utilise pas de hasard
 * qui change à chaque affichage — un magazine qu'on relit doit se retrouver.
 */
function signer(graine: string): number {
  let h = 2166136261;
  for (let i = 0; i < graine.length; i += 1) {
    h ^= graine.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** On choisit dans une liste, sans jamais la vider ni sortir des bornes. */
function choisir<T>(liste: T[], graine: number, decalage = 0): T {
  return liste[(graine + decalage) % liste.length]!;
}

/** Deux choses différentes, tirées de la même liste. */
function choisirDeux<T>(liste: T[], graine: number): [T, T] {
  const un = choisir(liste, graine);
  const deux = choisir(liste, graine, 3);
  return [un, deux === un && liste.length > 1 ? liste[(liste.indexOf(un) + 1) % liste.length]! : deux];
}

/* ————————————————————————— COMPOSER L'ÉDITION ————————————————————————— */

/** Le rôle de la personne, ou les mariés. */
function roleDe(options: OptionsEdition): Personnage {
  return PERSONNAGES.find((p) => p.id === options.roleId) ?? PERSONNAGES[0]!;
}

/** L'univers de la personne, ou le premier du catalogue. */
function universDe(options: OptionsEdition): WeddingStyle {
  return WEDDING_STYLES.find((s) => s.id === options.styleId) ?? WEDDING_STYLES[0]!;
}

/** Les documents que les coches ouvrent, dans l'ordre du catalogue. */
function papiersDe(options: OptionsEdition): DocumentPossible[] {
  const coches = options.options ?? [];
  if (coches.length === 0) return [];
  return DOCUMENTS.filter((d) => d.ouvrePar.some((o) => coches.includes(o)));
}

/** Les métiers du jour J : les personnages qui ne sont pas des personnes. */
function metiers(): Personnage[] {
  const personnes = new Set(['maries', 'marie', 'mariee', 'mariees', 'maries_e', 'futur_marie', 'future_mariee', 'futurs_maries', 'futures_mariees', 'futurs_maries_e', 'famille', 'invites', 'temoin']);
  return PERSONNAGES.filter((p) => !personnes.has(p.id));
}

/**
 * **LA COMPOSITION** — le cœur du moteur.
 *
 * Même semaine, mêmes choix : même édition. Un rôle différent, une coche de plus,
 * un autre univers : tout le magazine se recompose — et c'est voulu, parce que
 * deux personnes ne vivent pas la même semaine de la même façon.
 */
export function composerEdition(options: OptionsEdition = {}): Edition {
  const aujourdHui = new Date();
  const annee = options.annee ?? aujourdHui.getFullYear();
  const numero = options.numero ?? semaineDeLAnnee(aujourdHui);
  const temps = options.temps ?? 'present';

  const carte = carteDuNumero(numero);
  const saison = carte.saison;
  const semaine = carte.semaine ?? 52;
  const pas = pasDeTempsDeLaSemaine(semaine);
  const [du, fin] = bornesDeLaSemaine(annee, semaine);
  const lune = phaseDeLune(du);

  const personne = roleDe(options);
  const univers = universDe(options);
  const papiers = papiersDe(options);

  const graine = signer(
    [numero, annee, temps, personne.id, univers.id, (options.options ?? []).slice().sort().join(',')].join('|'),
  );

  /** Ce que le temps fait aux mots : passé et futur se lisent à la même table. */
  const quand = temps === 'passe' ? `En ${annee - 1}` : temps === 'futur' ? `En ${annee + 1}` : 'Cette semaine';

  const pages: PageEdition[] = [
    {
      rubrique: 'Le temps',
      titre: pas.nom,
      texte:
        `${quand}, semaine ${semaine} — ${pas.dit} ${pas.sage}` +
        (temps === 'present' ? ` La lune est ${lune.nom} (jour ${lune.jour} de la lunaison).` : ''),
      source: `Semaine ${semaine} · ${pas.nom}`,
    },
    {
      rubrique: 'La carte',
      titre: `${carte.figure} de ${saison.couleur}`,
      texte:
        `${saison.symbole} ${saison.sens}. Cette semaine, la carte dit : ${carte.sens.toLowerCase()}. ` +
        `Sa hauteur est ${carte.ton}.`,
      source: `Numéro ${carte.numero}${carte.joker ? ' · joker' : ''}`,
    },
    {
      rubrique: 'L’amour',
      titre: `La création de la couverture — ${saison.nom}`,
      texte:
        `Un fond uni ${saison.nom.toLowerCase()}, et au centre une création digitale sur l’amour de saison : ` +
        `${saison.sens.toLowerCase()}. La couverture ne change pas de forme d’une semaine à l’autre — c’est le ` +
        `numéro, la carte et vous qui la faites bouger.`,
      source: `${saison.nom} · ${carte.nom}`,
    },
    {
      rubrique: 'Le passage',
      titre: `Ce que ${personne.nom} fait cette semaine`,
      texte:
        temps === 'futur'
          ? `Ce qu’il y aura à faire : ${personne.entrees.join(', ')}. ${pas.sage}`
          : `Les entrées de votre espace, dans l’ordre du jour : ${personne.entrees.join(', ')}. ${pas.sage}`,
      source: `${personne.nom} · ${pas.nom}`,
    },
    {
      rubrique: 'Les gens',
      titre: (() => {
        const [un, deux] = choisirDeux(metiers(), graine);
        return `${un.nom} et ${deux.nom}`;
      })(),
      texte: (() => {
        const [un, deux] = choisirDeux(metiers(), graine);
        return (
          `${un.nom} — ${un.phrase} Et ${deux.nom} — ${deux.phrase} ` +
          `Ils travaillent dans un mariage ${univers.name.toLowerCase()} : ${univers.tagline.toLowerCase()}`
        );
      })(),
      source: `Selon votre univers : ${univers.name}`,
    },
    {
      rubrique: 'Vos papiers',
      titre: papiers.length > 0 ? choisir(papiers, graine).nom : 'Rien à sortir cette semaine',
      texte: (() => {
        const doc = papiers.length > 0 ? choisir(papiers, graine) : null;
        if (!doc) {
          return (
            'Aucune coche dans SUPER FOOTER : le magazine ne sort aucun papier. Cochez votre situation, ' +
            'et cette page dira ce qui existe pour vous — qui le demande, au nom de qui, et quoi réunir.'
          );
        }
        return (
          `${doc.demandePar}. Établi au nom de : ${doc.auNomDe}. À réunir : ${doc.pieces.join(' · ')}. ` +
          `Source : ${doc.source}.`
        );
      })(),
      source: papiers.length > 0 ? 'D’après vos coches' : 'Aucune coche',
    },
    {
      rubrique: 'La musique',
      titre: (() => {
        const morceau = choisir(CATALOGUE, graine);
        return `${morceau.title} — ${morceau.artiste}`;
      })(),
      texte: (() => {
        const morceau = choisir(CATALOGUE, graine);
        return `${morceau.moment} · ${morceau.ambiance}. Le morceau que cette semaine propose, et les musiciens qui sauraient le rejouer.`;
      })(),
      source: 'Playlist collaborative',
    },
    {
      rubrique: 'L’archive',
      titre: (() => {
        const archive = choisir(WEDDING_STYLES, graine);
        return `${archive.name} — la même semaine, ${temps === 'futur' ? 'l’an prochain' : 'l’an dernier'}`;
      })(),
      texte: (() => {
        const archive = choisir(WEDDING_STYLES, graine);
        return (
          `${archive.tagline} C’est l’archive de la semaine : ce qu’un mariage de cette période-là a laissé, ` +
          `et ce qu’on en garde pour le vôtre.`
        );
      })(),
      source: 'Les univers du passé',
    },
  ];

  return {
    numero,
    carte,
    saison,
    du,
    fin,
    titre: `N° ${String(carte.numero).padStart(2, '0')} · ${saison.nom}`,
    sousTitre: `${carte.nom} — ${saison.sens}`,
    temps,
    pages,
  };
}

/* ————————————————————————— L'ANNÉE, EN UN COUP D'ŒIL ————————————————————————— */

/** **L'ÉDITION DU MOMENT** : celle de la semaine où l'on est. */
export function editionDuMoment(options: Omit<OptionsEdition, 'numero'> = {}): Edition {
  return composerEdition(options);
}

/** Les quatre couvertures de saison : le fond uni, la création, et le numéro du moment. */
export function lesQuatreSaisons(options: OptionsEdition = {}): Edition[] {
  return SAISONS.map((saison) => {
    const semaines = saisonSemaines(saison.id);
    const semaineDuMoment = semaineDeLAnnee(new Date());
    const choisie = semaines.includes(semaineDuMoment) ? semaineDuMoment : semaines[0]!;
    return composerEdition({ ...options, numero: choisie });
  });
}

function saisonSemaines(id: string): number[] {
  return JEU_DE_54.filter((c) => c.saison.id === id && c.semaine !== null).map((c) => c.semaine!);
}

/** Les numéros d'une saison, dans l'ordre de l'année. */
export function numerosDeLaSaison(id: string): CarteDeSemaine[] {
  return JEU_DE_54.filter((c) => c.saison.id === id && c.semaine !== null);
}

/** La même édition, relue au passé et au futur : les trois temps du miroir. */
export function troisTemps(options: OptionsEdition = {}): Edition[] {
  return (['passe', 'present', 'futur'] as const).map((temps) => composerEdition({ ...options, temps }));
}
