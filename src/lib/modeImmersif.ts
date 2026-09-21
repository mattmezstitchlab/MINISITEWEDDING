import { useEffect, useState } from 'react';

/**
 * **LE MODE IMMERSIF** — LA PAGE TIENT L'ÉCRAN
 *
 * Quand une page se déclare immersive, le site s'efface derrière elle : plus de
 * barre en haut, plus de colonne de navigation à droite, plus de dock en bas,
 * plus de pied. C'est ce que demande AIME MAGAZINE : **l'image occupe presque
 * tout l'écran, la mosaïque occupe toute la largeur en bas**, et rien d'autre ne
 * flotte au-dessus.
 *
 * Le même patron d'événement que la capsule : la page publie, le chrome écoute.
 */

const EVENEMENT = 'supermariage:mode-immersif';

let immersif = false;

export function publierImmersif(valeur: boolean): void {
  immersif = valeur;
  prevenir();
}

export function modeImmersif(): boolean {
  return immersif;
}

export function useModeImmersif(): boolean {
  const [etat, setEtat] = useState(immersif);
  useEffect(() => {
    const surChangement = () => setEtat(immersif);
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
