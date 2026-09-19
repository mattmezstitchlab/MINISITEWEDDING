import { useEffect, useState, useRef } from 'react';
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

/**
 * **Une bande par identifiant.** Un accueil peut en porter plusieurs — les rôles
 * dans le premier hero, les univers dans le second — et le dock mène **celle
 * qu'on regarde** : la dernière bande entrée à l'écran prend les flèches, les
 * autres se taisent. C'est le défilement de la page qui décide, pas un ordre
 * écrit à l'avance.
 */
const bandes = new Map<string, ControlesBande>();
let active: string | null = null;
const EVENEMENT_CONTROLES = 'supermariage:bande-controles';

function lireLaBandeActive(): ControlesBande | null {
  return active ? bandes.get(active) ?? null : null;
}

/** Une bande pose ses deux gestes, sous son identifiant. */
export function enregistrerControlesBande(suivants: ControlesBande | null, id = 'defaut'): void {
  if (suivants) {
    bandes.set(id, suivants);
    active = id;
  } else {
    bandes.delete(id);
    if (active === id) {
      // La bande qui mène s'en va : la dernière arrivée prend la place.
      const restantes = Array.from(bandes.keys());
      active = restantes.length > 0 ? restantes[restantes.length - 1]! : null;
    }
  }
  try {
    window.dispatchEvent(new Event(EVENEMENT_CONTROLES));
  } catch {
    /* pas de fenêtre : personne à prévenir */
  }
}

/** Le dock lit les deux gestes de la bande active, et les suit. */
export function useControlesBande(): ControlesBande | null {
  const [etat, setEtat] = useState<ControlesBande | null>(() => lireLaBandeActive());

  useEffect(() => {
    const surChangement = () => setEtat(lireLaBandeActive());
    window.addEventListener(EVENEMENT_CONTROLES, surChangement);
    surChangement();
    return () => window.removeEventListener(EVENEMENT_CONTROLES, surChangement);
  }, []);

  return etat;
}

/**
 * **LA BANDE QU'ON REGARDE** — la page pose ses deux gestes, et c'est l'écran
 * qui dit lesquels comptent : la bande enregistrée est celle qui est visible.
 * On descend vers les univers : leurs flèches prennent le dock, et celles des
 * rôles se retirent. On remonte : l'inverse.
 *
 * La fonction rendue se pose en `ref` sur l'élément qui porte la bande.
 */
export function useControlesDeBande(id: string, controles: ControlesBande): (el: HTMLElement | null) => void {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const dernier = useRef(controles);

  useEffect(() => {
    dernier.current = controles;
  });

  useEffect(() => {
    if (!element) return;
    // Sans observateur (rendu statique, vieux navigateur), la bande se pose.
    if (typeof IntersectionObserver === 'undefined') {
      enregistrerControlesBande(dernier.current, id);
      return () => enregistrerControlesBande(null, id);
    }
    const observateur = new IntersectionObserver(
      (entrees) => {
        const entree = entrees[0];
        if (entree?.isIntersecting) enregistrerControlesBande(dernier.current, id);
        else enregistrerControlesBande(null, id);
      },
      { threshold: [0.3] },
    );
    observateur.observe(element);
    return () => {
      observateur.disconnect();
      enregistrerControlesBande(null, id);
    };
  }, [element, id]);

  return setElement;
}
