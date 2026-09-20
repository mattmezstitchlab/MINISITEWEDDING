import { useEffect, useState } from 'react';
import { styleById, type WeddingStyle } from './weddingStyles';
import { cartesDesPersonas, cartesDesUnivers, type CarteVivante } from './cartesVivantes';
import { MANIFESTE } from './manifeste';

/**
 * LA SÉLECTION — LES CARTES CHOISIES SUR L'ACCUEIL, DANS L'ORDRE
 *
 * L'accueil ne demande pas qui on est : il pose des cartes, et on choisit. Ce
 * fichier garde **ces clics-là**, dans leur ordre, et rien d'autre. C'est la
 * matière première du hero d'une personne : **chaque carte sélectionnée entre
 * dans son hero, à sa place**, avec son visuel et sa carte vivante.
 *
 * Trois principes, tenus ici :
 *  1. **rien n'est ressaisi** — une carte choisie n'est qu'un identifiant et son
 *     ordre ; le visuel, le son et le titre viennent des sources du site ;
 *  2. **l'ordre est celui des clics** — et il ne bouge que si la personne le
 *     bouge (`deplacerCarte`) ;
 *  3. **le jeu de 54** — la sélection est un jeu de cartes : elle s'arrête à 54,
 *     comme un paquet.
 */

/** Ce qu'une carte choisie retient : de quoi la retrouver, et de quoi l'écrire. */
export interface CarteChoisie {
  /** L'identifiant de la carte dans sa source : un univers, ou un rôle. */
  id: string;
  /** D'où elle vient : les deux familles de cartes de l'accueil. */
  sorte: SorteDeCarte;
  /** Le titre au moment du clic — il ne change pas sous les pieds du hero. */
  titre: string;
  /** Quand elle a été choisie : c'est l'ordre des clics. */
  choisiLe: string;
}

export type SorteDeCarte = 'univers' | 'persona';

/** Un paquet, pas plus : la sélection est un jeu de 54 cartes. */
export const CARTES_MAX = 54;

const CLE = 'vows:selection';
const EVENEMENT = 'vows:selection-change';

/** La clé d'une carte choisie : sa sorte **et** son identifiant. */
export function cleDeCarteChoisie(carte: Pick<CarteChoisie, 'sorte' | 'id'>): string {
  return `${carte.sorte}|${carte.id}`;
}

export function chargerSelection(): CarteChoisie[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const brut = localStorage.getItem(CLE);
    const lu = brut ? (JSON.parse(brut) as CarteChoisie[]) : [];
    if (!Array.isArray(lu)) return [];
    return lu.filter((c) => c && typeof c.id === 'string' && (c.sorte === 'univers' || c.sorte === 'persona'));
  } catch {
    return [];
  }
}

function ecrire(selection: CarteChoisie[]): CarteChoisie[] {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(CLE, JSON.stringify(selection));
    window.dispatchEvent(new Event(EVENEMENT));
  } catch {
    /* pas de fenêtre : la sélection reste dans l'état du composant */
  }
  return selection;
}

/**
 * **Choisir une carte** : elle se range à la fin, une seule fois. Recliquer sur
 * une carte déjà choisie ne la déplace pas — l'ordre est celui du premier clic,
 * et c'est la personne qui le change, quand elle veut.
 */
export function choisirCarte(carte: Pick<CarteChoisie, 'id' | 'sorte' | 'titre'>): CarteChoisie[] {
  const actuelle = chargerSelection();
  if (actuelle.some((c) => cleDeCarteChoisie(c) === cleDeCarteChoisie(carte))) return actuelle;
  const suivante = [
    ...actuelle,
    { id: carte.id, sorte: carte.sorte, titre: carte.titre, choisiLe: new Date().toISOString() },
  ].slice(0, CARTES_MAX);
  return ecrire(suivante);
}

export function estChoisie(carte: Pick<CarteChoisie, 'id' | 'sorte'>): boolean {
  return chargerSelection().some((c) => cleDeCarteChoisie(c) === cleDeCarteChoisie(carte));
}

export function retirerCarte(carte: Pick<CarteChoisie, 'id' | 'sorte'>): CarteChoisie[] {
  const cle = cleDeCarteChoisie(carte);
  return ecrire(chargerSelection().filter((c) => cleDeCarteChoisie(c) !== cle));
}

/** Monter ou descendre une carte d'un cran : l'ordre du hero se règle à la main. */
export function deplacerCarte(carte: Pick<CarteChoisie, 'id' | 'sorte'>, pas: number): CarteChoisie[] {
  const actuelle = chargerSelection();
  const cle = cleDeCarteChoisie(carte);
  const i = actuelle.findIndex((c) => cleDeCarteChoisie(c) === cle);
  const j = i + pas;
  if (i < 0 || j < 0 || j >= actuelle.length) return actuelle;
  const suivante = [...actuelle];
  const [retiree] = suivante.splice(i, 1);
  if (!retiree) return actuelle;
  suivante.splice(j, 0, retiree);
  return ecrire(suivante);
}

export function viderSelection(): CarteChoisie[] {
  return ecrire([]);
}

/** La sélection vivante : elle suit le navigateur, et se relit au changement. */
export function useSelection(): CarteChoisie[] {
  const [selection, setSelection] = useState<CarteChoisie[]>(() => chargerSelection());

  useEffect(() => {
    const surChangement = () => setSelection(chargerSelection());
    window.addEventListener(EVENEMENT, surChangement);
    return () => window.removeEventListener(EVENEMENT, surChangement);
  }, []);

  return selection;
}

/* ————————————————————— DE LA CARTE CHOISIE À LA CARTE VIVANTE ————————————————————— */

/**
 * La carte vivante d'un choix : son visuel, son sous-titre, son son. Rien n'est
 * recopié — on redemande la carte aux sources, et on la marque comme active
 * quand c'est elle qui occupe le hero.
 */
export function carteVivanteDe(choix: Pick<CarteChoisie, 'id' | 'sorte'>, actifId?: string): CarteVivante | null {
  if (choix.sorte === 'univers') {
    const actif = actifId ?? choix.id;
    return cartesDesUnivers(() => undefined, actif).find((c) => c.id === choix.id) ?? null;
  }
  return cartesDesPersonas(actifId, [choix.id])[0] ?? null;
}

/** Une carte d'univers, seule : de quoi monter un hero même sans sélection. */
export function carteDUnUnivers(styleId: string): CarteVivante | null {
  return cartesDesUnivers(() => undefined, styleId).find((c) => c.id === styleId) ?? null;
}

/** **L'enchaînement** : les cartes choisies, dans l'ordre, prêtes pour le hero. */
export function enchainement(selection: CarteChoisie[] = chargerSelection(), actifId?: string): CarteVivante[] {
  return selection
    .map((choix) => carteVivanteDe(choix, actifId))
    .filter((carte): carte is CarteVivante => Boolean(carte));
}

/** Le repli : un hero existe toujours, même sans un seul clic. */
export function enchainementDeSecours(styleId?: string): CarteVivante[] {
  const connu = styleId ? carteDUnUnivers(styleId) : null;
  const premier = connu ?? cartesDesUnivers(() => undefined)[0];
  return premier ? [premier] : [];
}

/** Les visuels de l'enchaînement, tels que le hero les traverse. */
export function visuelsDeLEnchainement(cartes: CarteVivante[]): { id: string; image: string; nom: string }[] {
  return cartes.map((carte) => ({ id: carte.id, image: carte.media.image, nom: carte.titre }));
}

/* ————————————————————— CE QUE LA SÉLECTION DEVIENT SUR LA PAGE ————————————————————— */

export interface UniversChoisi {
  style: WeddingStyle;
  /** Toutes les cartes de cet univers, la sienne au milieu. */
  cartes: CarteVivante[];
  choisiLe: string;
}

/** L'adresse d'un univers : la même partout dans le site. */
export function adresseDeLUnivers(styleId: string): string {
  return `/le-mariage/${styleId}`;
}

/** Les univers retenus, dans l'ordre du premier clic, avec leurs cartes. */
export function universDeLaPersonne(selection: CarteChoisie[]): UniversChoisi[] {
  const vus = new Set<string>();
  const univers: UniversChoisi[] = [];
  for (const choix of selection) {
    if (choix.sorte !== 'univers' || vus.has(choix.id)) continue;
    const style = styleById(choix.id);
    if (!style) continue;
    vus.add(choix.id);
    univers.push({
      style,
      cartes: cartesDesUnivers(() => undefined, style.id),
      choisiLe: choix.choisiLe,
    });
  }
  return univers;
}

/** Les rôles retenus, dans l'ordre — leurs cartes, telles qu'à l'accueil. */
export function rolesDeLaPersonne(selection: CarteChoisie[]): CarteVivante[] {
  const vus = new Set<string>();
  const roles: CarteVivante[] = [];
  for (const choix of selection) {
    if (choix.sorte !== 'persona' || vus.has(choix.id)) continue;
    const carte = carteVivanteDe(choix);
    if (!carte) continue;
    vus.add(choix.id);
    roles.push(carte);
  }
  return roles;
}

/* ————————————————————————— LE MANIFESTE DE LA PERSONNE ————————————————————————— */

export interface FaitsDeLaPersonne {
  prenom: string;
  role?: string;
  ville?: string;
  univers?: string;
  date?: string;
}

export interface ManifesteDeLaPersonne {
  eyebrow: string;
  titre: string;
  paragraphes: string[];
  signature: string;
}

/**
 * **Le manifeste de la personne** — le même texte que l'accueil, mais vu de sa
 * place : sa porte, ses cartes retenues, et les trois temps. Tout est déjà
 * écrit : il n'y a rien à composer, seulement à nommer.
 */
export function manifesteDeLaPersonne(
  faits: FaitsDeLaPersonne,
  selection: CarteChoisie[] = [],
): ManifesteDeLaPersonne {
  const prenom = (faits.prenom ?? '').trim();
  if (!prenom) {
    return {
      eyebrow: MANIFESTE.eyebrow,
      titre: MANIFESTE.titre,
      paragraphes: [...MANIFESTE.paragraphes],
      signature: MANIFESTE.signature,
    };
  }

  const combien = selection.length;
  const retenues =
    combien === 0
      ? 'La sélection est encore vide : les cartes choisies sur l’accueil viendront se ranger ici, dans l’ordre du clic.'
      : `${prenom} a retenu ${combien} carte${combien > 1 ? 's' : ''} sur l’accueil : ${selection
          .map((c) => c.titre)
          .join(', ')}. Elles sont dans son hero, dans cet ordre — et l’ordre ne bouge que si elle le bouge.`;

  const reperes = [faits.role, faits.ville, faits.date].filter((r) => Boolean(r && r.trim())).join(' · ');

  return {
    eyebrow: 'Son manifeste',
    titre: `Tout le monde arrive par une porte : celle de ${prenom} s’appelle ${faits.role?.trim() || 'sa carte'}.`,
    paragraphes: [
      MANIFESTE.paragraphes[0]!,
      retenues,
      MANIFESTE.paragraphes[1]!,
      MANIFESTE.paragraphes[2]!,
    ],
    signature: reperes ? `${MANIFESTE.signature} — ${prenom} · ${reperes}` : `${MANIFESTE.signature} — ${prenom}`,
  };
}
