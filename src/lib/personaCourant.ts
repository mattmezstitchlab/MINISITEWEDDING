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
/** L'événement du survol : on regarde un rôle, sans l'avoir choisi. */
const EVENEMENT_SURVOL = 'supermariage:persona-survol';
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

/* ————————————————— le rôle qu'on regarde, sans l'avoir choisi ————————————————— */

/**
 * Le rôle survolé dans la bande : le nom du site se transforme en « SUPER … »,
 * et les deux portes du site (le Shop, le Magazine) deviennent les siennes. On
 * ne mélange rien — on regarde ce que ce rôle verrait.
 */
/** Le dernier rôle survolé : un composant monté après le survol le retrouve. */
let survolee: string | null = null;

export function definirPersonaSurvolee(id: string | null): void {
  survolee = id && personnageParId(id) ? id : null;
  try {
    window.dispatchEvent(new CustomEvent(EVENEMENT_SURVOL, { detail: id }));
  } catch {
    /* pas de fenêtre : personne à prévenir */
  }
}

/** Le rôle survolé, tel qu'un composant le voit (null quand on ne survole rien). */
export function usePersonaSurvolee(): Personnage | null {
  const [id, setId] = useState<string | null>(survolee);

  useEffect(() => {
    const surSurvol = (e: Event) => {
      const detail = (e as CustomEvent<string | null>).detail;
      setId(detail && personnageParId(detail) ? detail : null);
    };
    window.addEventListener(EVENEMENT_SURVOL, surSurvol);
    return () => window.removeEventListener(EVENEMENT_SURVOL, surSurvol);
  }, []);

  return id ? personnageParId(id) ?? null : null;
}

/* ————————————— les flèches de la bande, posées à côté du dock ————————————— */

/**
 * La bande du hero se mène à deux endroits : dans la bande elle-même, et par
 * les deux flèches posées de chaque côté du dock. La page enregistre ses deux
 * gestes, le dock les appelle — et les flèches n'apparaissent que quand ils
 * existent (sur une page qui ne montre pas de bande, il n'y a rien à mener).
 */
export interface ControlesBande {
  precedent: () => void;
  suivant: () => void;
}

let controles: ControlesBande | null = null;
const EVENEMENT_CONTROLES = 'supermariage:bande-controles';

/** La page pose ses deux gestes. */
export function enregistrerControlesBande(suivants: ControlesBande | null): void {
  controles = suivants;
  try {
    window.dispatchEvent(new Event(EVENEMENT_CONTROLES));
  } catch {
    /* pas de fenêtre : personne à prévenir */
  }
}

/** Le dock lit les deux gestes, et les suit quand ils changent. */
export function useControlesBande(): ControlesBande | null {
  const [etat, setEtat] = useState<ControlesBande | null>(controles);

  useEffect(() => {
    const surChangement = () => setEtat(controles);
    window.addEventListener(EVENEMENT_CONTROLES, surChangement);
    return () => window.removeEventListener(EVENEMENT_CONTROLES, surChangement);
  }, []);

  return etat;
}
