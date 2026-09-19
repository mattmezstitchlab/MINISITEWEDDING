import { useCallback, useState } from 'react';
import { useComptoir } from './terminalLive';

/**
 * LES AVIS DU PUBLIC
 *
 * Chaque carte vivante porte un cœur et son nombre : la température statistique
 * de la page. Le nombre, lui, n'est pas local — il passe par le comptoir
 * partagé (`wedding_live`), comme les prises et les demandes : tout le monde
 * additionne au même endroit, sans compte ni nom.
 *
 * Ce qui reste sur l'appareil, c'est seulement « j'ai déjà aimé celle-ci » : on
 * ne vote pas deux fois depuis le même navigateur, et le cœur reste plein.
 */

const CLE = 'vows:avis';

/** Les sujets que ce navigateur a aimés. */
export function clesAimees(): string[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const brut = localStorage.getItem(CLE);
    if (!brut) return [];
    const cles = JSON.parse(brut) as unknown;
    return Array.isArray(cles) ? cles.filter((c): c is string => typeof c === 'string') : [];
  } catch {
    return [];
  }
}

export function aDejaAime(cle: string): boolean {
  return clesAimees().includes(cle);
}

function noterSurLApareil(cle: string, aime: boolean): string[] {
  const cles = clesAimees().filter((c) => c !== cle);
  const suivantes = aime ? [...cles, cle] : cles;
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(CLE, JSON.stringify(suivantes));
  } catch {
    /* sans stockage, le cœur reste local au rendu */
  }
  return suivantes;
}

export interface Avis {
  /** Le nombre de cœurs d'un sujet, tel que le comptoir le dit. */
  compte: (cle: string) => number;
  /** Vrai si ce navigateur a déjà aimé ce sujet. */
  aime: (cle: string) => boolean;
  /** Un cœur de plus, ou de moins : l'état part au comptoir, le compteur suit. */
  basculer: (cle: string) => void;
}

/**
 * Les avis d'un univers : les compteurs viennent du comptoir partagé, mon vote
 * de cet appareil. On additionne toujours le mien en local, pour que le chiffre
 * bouge sous le doigt avant que le serveur n'ait répondu.
 */
export function useAvis(styleId: string): Avis {
  const { etat, geste } = useComptoir(styleId);
  const [lesMiens, setLesMiens] = useState<string[]>(() => clesAimees());

  const aime = useCallback((cle: string) => lesMiens.includes(cle), [lesMiens]);
  const compte = useCallback(
    (cle: string) => Math.max(0, etat.avis?.[cle] ?? 0),
    [etat.avis],
  );

  const basculer = useCallback(
    (cle: string) => {
      const dejaAime = lesMiens.includes(cle);
      setLesMiens(noterSurLApareil(cle, !dejaAime));
      geste({ type: 'aimer', cle, sens: dejaAime ? 'moins' : 'plus' });
    },
    [geste, lesMiens],
  );

  return { compte, aime, basculer };
}
