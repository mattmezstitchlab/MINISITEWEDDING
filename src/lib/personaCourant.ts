import { useEffect, useState } from 'react';
import { PERSONNAGES, personnageParId, type Personnage } from './personas';

/**
 * LE PERSONNAGE COURANT
 *
 * « Qui êtes-vous dans ce mariage ? » — la réponse est retenue pour la visite,
 * et **tout le site s'y accorde** : le dock du bas montre les outils de ce
 * personnage, et ils changent quand le hero passe au suivant. C'est la
 * démonstration : les outils suivent le rôle.
 *
 * Le repère vit dans le navigateur, et un petit événement le propage : le hero
 * écrit, le dock écoute — sans que l'un connaisse l'autre.
 */

const CLE = 'supermariage:persona';
/** L'événement qui prévient le site qu'on a changé de personnage. */
const EVENEMENT = 'supermariage:persona-change';
/** Le personnage par défaut : celui du milieu, les mariés. */
const DEFAUT = 'maries';

/** Le personnage retenu, ou les mariés. */
export function personaCourant(): string {
  try {
    if (typeof localStorage === 'undefined') return DEFAUT;
    const id = localStorage.getItem(CLE);
    return id && personnageParId(id) ? id : DEFAUT;
  } catch {
    return DEFAUT;
  }
}

/** On retient le personnage, et on le dit à tout le site. */
export function definirPersonaCourant(id: string): void {
  if (!personnageParId(id)) return;
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(CLE, id);
  } catch {
    /* sans stockage, le choix ne survit pas : le dock gardera le défaut */
  }
  try {
    window.dispatchEvent(new CustomEvent(EVENEMENT, { detail: id }));
  } catch {
    /* pas de fenêtre : rien à prévenir */
  }
}

/** Le personnage courant, tel qu'un composant le voit. */
export function usePersonaCourante(): Personnage {
  const [id, setId] = useState(() => personaCourant());

  useEffect(() => {
    const surChangement = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      setId(detail && personnageParId(detail) ? detail : personaCourant());
    };
    window.addEventListener(EVENEMENT, surChangement);
    return () => window.removeEventListener(EVENEMENT, surChangement);
  }, []);

  return personnageParId(id) ?? PERSONNAGES[0]!;
}
