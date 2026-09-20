import { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';

/**
 * LA NAV VERTICALE D'UNE PAGE
 *
 * À droite de l'écran, une capsule verticale : le Shop, le Magazine, puis **ce
 * que la page propose** — son article, son programme, sa playlist, ses pièces.
 * Chaque page a la sienne, et le contenu change avec elle.
 *
 * La page enregistre ses actions, la capsule les affiche : c'est le même
 * principe que les flèches de la bande — le composant est monté une seule fois
 * (`SiteChrome`), les pages lui disent quoi montrer.
 */

export interface ActionNav {
  /** L'identifiant de l'action dans la page. */
  id: string;
  /** Le mot affiché au survol. */
  label: string;
  icone: LucideIcon;
  /** L'ancre à rejoindre dans la page, si l'action descend vers une section. */
  ancre?: string;
  /** La page à ouvrir, si l'action sort de la page. */
  to?: string;
  /**
   * **Ce que ça fait, en une phrase** — ce que dit le clic droit. On ne devine
   * pas : la capsule explique, et l'explication est la même partout.
   */
  aide?: string;
}

let actions: ActionNav[] | null = null;
const EVENEMENT = 'supermariage:nav-verticale';

/** La page pose ses actions — et retire celles de la précédente. */
export function enregistrerNavVerticale(suivantes: ActionNav[] | null): void {
  actions = suivantes;
  try {
    window.dispatchEvent(new Event(EVENEMENT));
  } catch {
    /* pas de fenêtre : personne à prévenir */
  }
}

/** La capsule lit les actions de la page, et les suit quand elles changent. */
export function useNavVerticale(): ActionNav[] {
  const [etat, setEtat] = useState<ActionNav[]>(() => actions ?? []);

  useEffect(() => {
    const surChangement = () => setEtat(actions ?? []);
    window.addEventListener(EVENEMENT, surChangement);
    surChangement();
    return () => window.removeEventListener(EVENEMENT, surChangement);
  }, []);

  return etat;
}

/* ——————————————— LES GESTES — LES MÊMES SUR TOUTE LA CAPSULE ——————————————— */

/**
 * Les gestes de la capsule, écrits une fois pour tout le site : c'est ce qui la
 * rend **universelle**. On apprend un geste ici, il marche ailleurs — sur une
 * autre page, un autre rôle, un autre métier.
 */
export const GESTES_UNIVERSELS: Array<{ geste: string; fait: string }> = [
  { geste: 'Survoler', fait: 'Le nom de l’action s’écrit, à gauche du picto' },
  { geste: 'Cliquer', fait: 'On descend à la section, ou l’on ouvre la page' },
  { geste: 'Clic droit', fait: 'Ce que ça fait, et pourquoi — sans quitter la page' },
  { geste: 'Appui long', fait: 'La même chose, sur téléphone' },
  { geste: 'Échap', fait: 'On ferme ce qui s’est ouvert' },
  { geste: 'Molette', fait: 'La page descend — la capsule reste à sa place' },
];
