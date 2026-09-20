import { useEffect, useState } from 'react';

/**
 * LA CAPSULE DE COMMANDE — CE QUE LE DOCK PILOTE
 *
 * Le dock du bas n'est plus un porte-outils : c'est **une capsule de commande**.
 * Elle pilote deux choses, et toute la page les écoute :
 *
 * - **le moment du jour** — les cinq pictos (l'aube, le matin, le midi,
 *   l'après-midi, le soir) : la couverture du hero s'éclaire à ce moment ;
 * - **la timeline** — le picto du milieu : la languette sort en bas, et l'année
 *   entière se feuillette en couverture, des saisons aux jours.
 *
 * Le dock écrit ici, la page lit ici — monté une fois, écouté partout, comme la
 * nav verticale et les flèches de la bande.
 */

const EVENEMENT = 'supermariage:capsule-commande';

/** Les cinq moments que la capsule commande — la nuit garde son dessin. */
export const MOMENTS_DE_LA_CAPSULE = ['aube', 'matin', 'midi', 'apres-midi', 'soir'];

/**
 * **L'HEURE DE CHAQUE MOMENT** — le pont entre la capsule et le cadran.
 *
 * C'est ce tableau qui fait qu'un clic sur « le soir » dans le dock **pose
 * l'aiguille à 20 h** sur la couverture : la capsule n'est pas un filtre, c'est
 * une commande de temps. Les heures sont celles des parts du jour
 * (`moments.ts`) : l'aube ouvre à 5 h, le soir tient jusqu'à 23 h.
 */
export const HEURE_DES_MOMENTS: Record<string, number> = {
  aube: 6,
  matin: 9,
  midi: 12,
  'apres-midi': 15,
  soir: 20,
};

let momentActif: string | null = null;
let timelineOuverte = false;

/** Les repères publiés par la page : quel magazine, quel chapitre. */
export interface ReperesDeLaCapsule {
  /** « Magazine 38 ». */
  magazine: string;
  /** « Chapitre 05 — La Fête ». */
  chapitre: string;
  /** Le numéro du chapitre, 1 à 7 — pour la boussole du dock. */
  numeroDeChapitre: number;
  /** Le titre du jour, tel qu'il s'affiche. */
  jour: string;
}

let reperes: ReperesDeLaCapsule | null = null;

/** Choisir un moment (ou le retirer : `null` rend la couverture au jour entier). */
export function choisirMoment(id: string | null): void {
  momentActif = id;
  prevenir();
}

export function momentDeLaCapsule(): string | null {
  return momentActif;
}

export function useMomentDeLaCapsule(): string | null {
  const [etat, setEtat] = useState<string | null>(momentActif);
  useEffect(() => {
    const surChangement = () => setEtat(momentActif);
    window.addEventListener(EVENEMENT, surChangement);
    return () => window.removeEventListener(EVENEMENT, surChangement);
  }, []);
  return etat;
}

/**
 * **L'HEURE QU'ON REGARDE** : celle du moment choisi, ou l'heure réelle.
 *
 * Le cadran et la couverture lisent ici — jamais ailleurs. Sans moment choisi,
 * l'horloge tourne pour de vrai (on la rafraîchit toutes les minutes).
 */
export function heureDeLaCapsule(date: Date = new Date()): number {
  if (momentActif && HEURE_DES_MOMENTS[momentActif] !== undefined) return HEURE_DES_MOMENTS[momentActif]!;
  return date.getHours() + date.getMinutes() / 60;
}

/** L'heure, et le nom du moment, en un objet — ce que lit le cadran. */
export interface TempsDeLaCapsule {
  /** L'heure, 0 à 24, fractions comprises. */
  heure: number;
  /** Le moment choisi, ou `null` quand c'est l'heure réelle. */
  moment: string | null;
  /** « 20 h 30 », « 12 h », écrit comme on le dit. */
  etiquette: string;
  /** Vrai quand l'heure vient de la capsule, faux quand c'est l'horloge. */
  pilote: boolean;
}

/** Le temps de la capsule, pour le cadran : l'heure, le moment, et le mot juste. */
export function tempsDeLaCapsule(date: Date = new Date()): TempsDeLaCapsule {
  const heure = heureDeLaCapsule(date);
  const entiere = Math.floor(heure);
  const minutes = Math.round((heure - entiere) * 60);
  return {
    heure,
    moment: momentActif,
    etiquette: minutes === 0 ? `${entiere} h` : `${entiere} h ${String(minutes).padStart(2, '0')}`,
    pilote: momentActif !== null && HEURE_DES_MOMENTS[momentActif] !== undefined,
  };
}

/**
 * **Le temps de la capsule, écouté.** Le composant se met à jour quand le dock
 * change de moment — et, si personne n'a choisi de moment, l'horloge avance
 * toute seule : le cadran est une vraie horloge.
 */
export function useTempsDeLaCapsule(): TempsDeLaCapsule {
  const [temps, setTemps] = useState<TempsDeLaCapsule>(() => tempsDeLaCapsule());
  useEffect(() => {
    const surChangement = () => setTemps(tempsDeLaCapsule());
    window.addEventListener(EVENEMENT, surChangement);
    const horloge = window.setInterval(surChangement, 60_000);
    return () => {
      window.removeEventListener(EVENEMENT, surChangement);
      window.clearInterval(horloge);
    };
  }, []);
  return temps;
}

/**
 * **PUBLIER LES REPÈRES** — la page du magazine dit au dock ce qu'on regarde
 * (le magazine, le chapitre, le jour). Le dock l'affiche : la capsule temporelle
 * et la couverture parlent alors du même moment.
 */
export function publierReperes(valeurs: ReperesDeLaCapsule | null): void {
  reperes = valeurs;
  prevenir();
}

export function reperesDeLaCapsule(): ReperesDeLaCapsule | null {
  return reperes;
}

export function useReperesDeLaCapsule(): ReperesDeLaCapsule | null {
  const [etat, setEtat] = useState<ReperesDeLaCapsule | null>(reperes);
  useEffect(() => {
    const surChangement = () => setEtat(reperes);
    window.addEventListener(EVENEMENT, surChangement);
    return () => window.removeEventListener(EVENEMENT, surChangement);
  }, []);
  return etat;
}

/** Ouvrir ou fermer la languette de la timeline. */
export function basculerTimeline(ouverte?: boolean): void {
  timelineOuverte = ouverte ?? !timelineOuverte;
  prevenir();
}

export function timelineEstOuverte(): boolean {
  return timelineOuverte;
}

export function useTimelineOuverte(): boolean {
  const [etat, setEtat] = useState<boolean>(timelineOuverte);
  useEffect(() => {
    const surChangement = () => setEtat(timelineOuverte);
    window.addEventListener(EVENEMENT, surChangement);
    return () => window.removeEventListener(EVENEMENT, surChangement);
  }, []);
  return etat;
}

function prevenir(): void {
  try {
    window.dispatchEvent(new Event(EVENEMENT));
  } catch {
    /* pas de fenêtre : personne à prévenir */
  }
}
