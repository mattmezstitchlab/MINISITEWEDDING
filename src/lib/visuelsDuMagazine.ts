/**
 * QUELLE IMAGE POUR QUEL JOUR — LA CASCADE, ET RIEN QU'UNE CASCADE
 *
 * Une seule fonction répond à la question « quelle image s'affiche ici ? », et
 * elle répond **toujours dans le même ordre** :
 *
 * ```
 * 1. l'image du chapitre        semaine-38/04-recevoir.jpg    ← ce qu'on veut
 * 2. la couverture du magazine  semaine-38/cover.jpg          ← l'identité partagée
 * 3. le visuel du jour         09-21/couverture.jpg           ← transition
 * 4. le dessin                  le cadran, le fond de la saison
 * ```
 *
 * Trois règles, non négociables :
 *
 * - **jamais l'image d'une autre semaine** : une absence reste une absence,
 *   même si la semaine voisine est complète ;
 * - **jamais une page cassée** : si rien n'est livré, le dessin de
 *   `CouvertureJour` tient, avec la couleur de la saison et la palette du
 *   magazine ;
 * - **toujours détectable** : chaque réponse porte son `origine`, et se dit en
 *   clair dans `raison` — on peut donc savoir, à l'écran comme dans les tests,
 *   ce qui manque.
 */

import { CHAPITRES } from './chapitres';
import { cheminDuVisuel, visuelLivre } from './bibliothequeMagazine';
import { photoDuPlan } from './photosDuMagazine';
import {
  chapitreDeLaDate,
  magazineDeLaDate,
  numeroDeMagazine,
  positionDansLeMagazine,
  type ChapitreDuMagazine,
  type Magazine,
} from './semaines';

/** D'où vient l'image qu'on affiche. */
export type OrigineDuVisuel = 'chapitre' | 'couverture-semaine' | 'jour' | 'dessin';

export interface Visuel {
  /** L'adresse de l'image, ou `null` quand le dessin prend le relais. */
  url: string | null;
  origine: OrigineDuVisuel;
  /** Le nom du fichier attendu : `cover.jpg`, `04-recevoir.jpg`. */
  slot: string;
  /** Le numéro du magazine concerné. */
  magazine: number;
  /** Le dossier du jour (`09-21`), quand la question part d'une date. */
  jour?: string;
  /** Pourquoi c'est cette image — en clair, pour l'écran comme pour les tests. */
  raison: string;
}

/** Le nom de fichier de la couverture d'un magazine. */
export const SLOT_COUVERTURE = 'cover.jpg';

/** Le nom de fichier d'un chapitre : `04-recevoir.jpg`. */
export function slotDuChapitre(chapitre: number): string {
  return CHAPITRES[Math.min(7, Math.max(1, chapitre)) - 1]!.fichier;
}

/** `MM-JJ` d'une date — le dossier des anciens visuels par jour. */
export function jourDuDossier(date: Date): string {
  return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * **La couverture d'un magazine.** On ne cherche pas celle d'un jour : la
 * couverture appartient à la semaine. Tant qu'elle n'est pas livrée, le dessin
 * tient la place — avec le fond de la saison.
 */
export function visuelDeLaCouverture(numero: number): Visuel {
  const slot = SLOT_COUVERTURE;
  if (visuelLivre(numero, slot)) {
    return {
      url: cheminDuVisuel(numero, slot),
      origine: 'couverture-semaine',
      slot,
      magazine: numero,
      raison: `La couverture du magazine ${numero} est livrée.`,
    };
  }
  return {
    url: null,
    origine: 'dessin',
    slot,
    magazine: numero,
    raison: `La couverture du magazine ${numero} n'est pas encore livrée : le dessin tient la place.`,
  };
}

/**
 * **L'image d'un chapitre.** On cherche d'abord le chapitre lui-même ; s'il
 * manque, la couverture du magazine prend le relais — c'est la même identité de
 * semaine, donc jamais une erreur. Sinon, le dessin.
 */
export function visuelDuChapitre(numero: number, chapitre: number): Visuel {
  const slot = slotDuChapitre(chapitre);
  if (visuelLivre(numero, slot)) {
    return {
      url: cheminDuVisuel(numero, slot),
      origine: 'chapitre',
      slot,
      magazine: numero,
      raison: `Le chapitre ${String(chapitre).padStart(2, '0')} du magazine ${numero} est livré.`,
    };
  }
  const couverture = visuelDeLaCouverture(numero);
  if (couverture.url) {
    return {
      ...couverture,
      origine: 'couverture-semaine',
      raison: `Le chapitre ${String(chapitre).padStart(2, '0')} du magazine ${numero} n'est pas livré : la couverture de la semaine tient le chapitre, comme les six autres.`,
    };
  }
  return {
    url: null,
    origine: 'dessin',
    slot,
    magazine: numero,
    raison: `Ni le chapitre ${String(chapitre).padStart(2, '0')} ni la couverture du magazine ${numero} ne sont livrés : le dessin tient la place.`,
  };
}

/**
 * **Tout ce qu'un jour affiche** : son magazine, son chapitre, la couverture de
 * la semaine, et l'image de son chapitre — chacune avec sa provenance.
 */
export interface VisuelsDuJour {
  magazine: Magazine;
  chapitre: ChapitreDuMagazine;
  /** Le jour dans le magazine : 1 à 7. */
  position: number;
  /** Le dossier `MM-JJ` — utile pour les anciens visuels par jour. */
  jour: string;
  /** La couverture : celle de la semaine. */
  couverture: Visuel;
  /** L'image du chapitre que ce jour ouvre. */
  imageDuChapitre: Visuel;
}

/** Les visuels d'un jour — la réponse complète, avec ses replis. */
export function visuelsDuJour(date: Date): VisuelsDuJour {
  const magazine = magazineDeLaDate(date);
  const chapitre = chapitreDeLaDate(date);
  const jour = jourDuDossier(date);
  const couverture = visuelDeLaCouverture(magazine.numero);
  const imageDuChapitre = visuelDuChapitre(magazine.numero, chapitre.numero);

  /* Le troisième rang de la cascade : les anciens visuels par jour. Ils ne
     concernent que **ce jour-là** — jamais une autre semaine : c'est
     exactement la règle qu'on veut tenir pendant la transition. */
  const ancien = photoDuPlan(jour, 'couverture');
  const couvertureFinale: Visuel =
    couverture.url === null && ancien
      ? {
          url: ancien,
          origine: 'jour',
          slot: SLOT_COUVERTURE,
          magazine: magazine.numero,
          jour,
          raison: `La semaine ${magazine.numero} n'a pas encore de couverture : le visuel livré pour le ${jour} tient la place, en attendant.`,
        }
      : { ...couverture, jour };

  return {
    magazine,
    chapitre,
    position: positionDansLeMagazine(date),
    jour,
    couverture: couvertureFinale,
    imageDuChapitre: { ...imageDuChapitre, jour },
  };
}

/** Combien d'images manquent, et pour quel numéro : de quoi piloter la production. */
export function manquesDeLaCollection(): Array<{ magazine: number; slot: string }> {
  const manques: Array<{ magazine: number; slot: string }> = [];
  for (let numero = 1; numero <= 54; numero += 1) {
    if (!visuelLivre(numero, SLOT_COUVERTURE)) manques.push({ magazine: numero, slot: SLOT_COUVERTURE });
    for (const chapitre of CHAPITRES) {
      if (!visuelLivre(numero, chapitre.fichier)) manques.push({ magazine: numero, slot: chapitre.fichier });
    }
  }
  return manques;
}

/** Les anciens dossiers par jour encore lus, pour les identifier et les remapper. */
export function anciensVisuels(): Array<{ jour: string; visuel: string; remap: string }> {
  const remaps: Array<{ jour: string; visuel: string; remap: string }> = [];
  for (let mois = 1; mois <= 12; mois += 1) {
    const joursDuMois = new Date(2026, mois, 0).getDate();
    for (let quantieme = 1; quantieme <= joursDuMois; quantieme += 1) {
      const date = new Date(2026, mois - 1, quantieme, 12);
      const jour = jourDuDossier(date);
      const ancien = photoDuPlan(jour, 'couverture');
      if (!ancien) continue;
      const magazine = numeroDeMagazine(date);
      const chapitre = positionDansLeMagazine(date);
      remaps.push({
        jour,
        visuel: ancien,
        remap: `${cheminDuVisuel(magazine, SLOT_COUVERTURE)} (couverture) et ${cheminDuVisuel(magazine, slotDuChapitre(chapitre))} (chapitre)`,
      });
    }
  }
  return remaps;
}
