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

let momentActif: string | null = null;
let timelineOuverte = false;

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
