/* LE VERSO DU SITE — L'ENVERS DU DÉCOR
 *
 * Le recto, c'est ce qu'on regarde : des images, du temps, du texte. Le
 * **verso**, c'est ce qui tient : les règles du système, les sources, les
 * ouvertures, et surtout **les liaisons** — tout ce qui peut être déplacé pour
 * être bord à bord, et ce que deux cases produisent quand elles se touchent.
 *
 * Trois idées, et rien de plus :
 *
 * 1. **Les réglages.** Le design system, écrit une fois : l'échelle, la densité,
 *    la taille d'une case, la séparation d'un pixel, les familles, les modules,
 *    les sources, la typographie, les palettes des cinquante-quatre magazines.
 * 2. **Les ports.** Chaque case a un module, une source, une ouverture. C'est
 *    par là qu'elle peut se lier.
 * 3. **Les liaisons.** Deux modules qui vont ensemble — une image et un texte
 *    font une page, une date et un formulaire font un billet — sont **des
 *    possibilités** : le verso les dessine. Quand on les pose bord à bord, la
 *    liaison est **faite**, et le verso dit ce qu'elle produit.
 */

import { colonnesDeLaGrille } from './echelleDeLaGrille';
import { MAGAZINES } from './semaines';
import type { CaseDuMonde, ModuleDeCase, Monde } from './grilleDuMonde';

/* ——————————————————— LES RÉGLAGES DU DESIGN SYSTEM ——————————————————— */

export interface Reglage {
  id: string;
  nom: string;
  valeur: string;
  note: string;
}

/** **Le design system, en clair.** Ce qui décide de tout, à l'écran. */
export const RÉGLAGES_DU_SYSTÈME: Reglage[] = [
  { id: 'case', nom: 'LA CASE', valeur: '128 px', note: 'un carré, à l’échelle 1 — jamais une carte' },
  { id: 'echelle', nom: 'L’ÉCHELLE', valeur: '0.42 · 0.62 · 0.86 · 1.2 · 1.7', note: 'cinq crans, du monde au contenu' },
  { id: 'densite', nom: 'LA DENSITÉ', valeur: '1 → 5', note: 'c’est la taille réelle qui décide de ce qu’une case dit' },
  { id: 'separation', nom: 'LA SÉPARATION', valeur: '1 px', note: 'bord à bord : aucune ombre, aucun arrondi, aucun conteneur' },
  { id: 'remplissage', nom: 'LE REMPLISSAGE', valeur: '× 1 → 4', note: 'un petit monde remplit l’écran de lui-même' },
  { id: 'familles', nom: 'LES FAMILLES', valeur: 'public · invités · famille · privé', note: 'une marque minuscule, et rien pour le public' },
  { id: 'modules', nom: 'LES MODULES', valeur: '18', note: 'image, texte, vidéo, audio, article, produit, personne, lieu…' },
  { id: 'typo', nom: 'LA TYPOGRAPHIE', valeur: 'un titre + une ligne + un détail', note: 'jamais une phrase pour expliquer l’écran' },
  { id: 'couleur', nom: 'LA COULEUR', valeur: '54 palettes', note: 'la couleur d’une case est celle de son magazine, jamais inventée' },
  { id: 'ouverture', nom: 'L’OUVERTURE', valeur: 'une porte par case', note: 'une case qui contient quelque chose ouvre un monde' },
];

/** Les palettes de la collection : les cinquante-quatre couples de couleurs. */
export const PALETTES_DU_SYSTÈME = MAGAZINES.map((magazine) => ({
  numero: magazine.numero,
  titre: magazine.titre,
  fond: magazine.palette.fond,
  accent: magazine.palette.accent,
  saison: magazine.saison.nom,
}));

/* ——————————————————————————— LES PORTS ——————————————————————————— */

/** Ce par quoi une case peut se lier : son module. */
export interface Port {
  /** Le module du port. */
  module: ModuleDeCase;
  /** Ce que la case donne — son contenu. */
  donne: string;
  /** Ce qu'elle attend en face. */
  attend: ModuleDeCase[];
}

/** **Les ports d'une case** : son module, ce qu'elle donne, ce qu'elle attend. */
export function portsDuneCase(kase: CaseDuMonde): Port {
  const donne =
    kase.detail?.[0]?.valeur ?? kase.sousTitre ?? kase.surTitre ?? kase.titre;
  return {
    module: kase.module,
    donne,
    attend: LIAISONS_POSSIBLES.filter((l) => l.a === kase.module || l.b === kase.module).map((l) =>
      l.a === kase.module ? l.b : l.a,
    ),
  };
}

/* ————————————————————————— LES LIAISONS ————————————————————————— */

/** **Ce que deux modules produisent** quand ils se touchent. */
export interface LiaisonPossible {
  a: ModuleDeCase;
  b: ModuleDeCase;
  /** Ce qui naît de la rencontre : « une page », « un billet », « un plan ». */
  produit: string;
}

/**
 * Le tableau des liaisons. Il est court, et c'est volontaire : ce sont les
 * rencontres qui ont un sens éditorial, pas toutes celles qui sont possibles.
 */
export const LIAISONS_POSSIBLES: LiaisonPossible[] = [
  { a: 'image', b: 'texte', produit: 'une page' },
  { a: 'image', b: 'image', produit: 'une double page' },
  { a: 'image', b: 'galerie', produit: 'un portfolio' },
  { a: 'image', b: 'article', produit: 'une ouverture' },
  { a: 'image', b: 'audio', produit: 'un clip' },
  { a: 'texte', b: 'texte', produit: 'un chapitre' },
  { a: 'texte', b: 'personne', produit: 'un portrait' },
  { a: 'date', b: 'formulaire', produit: 'un billet' },
  { a: 'date', b: 'lieu', produit: 'un itinéraire' },
  { a: 'date', b: 'meteo', produit: 'un plan B' },
  { a: 'lieu', b: 'carte', produit: 'un plan' },
  { a: 'produit', b: 'prix', produit: 'une caisse' },
  { a: 'audio', b: 'player', produit: 'une écoute' },
  { a: 'galerie', b: 'video', produit: 'un film' },
  { a: 'document', b: 'formulaire', produit: 'un dossier' },
  { a: 'carte', b: 'personne', produit: 'une invitation' },
  { a: 'lien', b: 'bouton', produit: 'un passage' },
  { a: 'prix', b: 'date', produit: 'une disponibilité' },
];

/** La liaison entre deux cases, s'il y en a une. */
export function liaisonEntre(a: CaseDuMonde, b: CaseDuMonde): LiaisonPossible | null {
  if (a.id === b.id) return null;
  return (
    LIAISONS_POSSIBLES.find(
      (l) => (l.a === a.module && l.b === b.module) || (l.a === b.module && l.b === a.module),
    ) ?? null
  );
}

/** Une liaison dessinée dans le verso : deux cases, et ce qu'elles produisent. */
export interface Liaison {
  de: string;
  vers: string;
  produit: string;
  /** Vraie quand les deux cases ont été posées bord à bord. */
  faite: boolean;
}

/** Un emplacement dans la grille du verso. */
export interface Emplacement {
  c: number;
  l: number;
}

/** **Où chaque case se trouve** : sa place posée, ou son rang dans le monde. */
export function emplacementsDuMonde(
  monde: Monde,
  places: Record<string, Emplacement> = {},
  colonnes = 0,
): Record<string, Emplacement> {
  const large = Math.max(1, colonnes || Math.ceil(Math.sqrt(monde.cases.length)) || 1);
  const table: Record<string, Emplacement> = {};
  monde.cases.forEach((kase, i) => {
    table[kase.id] = places[kase.id] ?? { c: i % large, l: Math.floor(i / large) };
  });
  return table;
}

/** **Les colonnes du monde** : celles qui remplissent l'écran, étendues par les cases posées. */
export function colonnesDuMonde(
  nombreDeCases: number,
  places: Record<string, Emplacement> = {},
  largeurEcran = 1280,
  hauteurEcran = 820,
): number {
  const posee = Object.values(places).reduce((m, p) => Math.max(m, p.c + 1), 0);
  return Math.max(colonnesDeLaGrille(nombreDeCases, largeurEcran, hauteurEcran), posee);
}

/** Deux cases sont-elles **bord à bord** ? Côte à côte, ou l'une sur l'autre. */
export function sontVoisines(a: Emplacement, b: Emplacement): boolean {
  const dc = Math.abs(a.c - b.c);
  const dl = Math.abs(a.l - b.l);
  return (dc === 1 && dl === 0) || (dc === 0 && dl === 1);
}

/**
 * **Toutes les liaisons d'un monde.** Celles qui sont possibles sont dessinées
 * en clair ; celles qui sont faites — les deux cases bord à bord — passent au
 * vert et disent ce qu'elles produisent.
 */
/** Le cache des liaisons : un monde et une disposition, une fois, et pas à chaque image. */
const liaisonsEnCache = new Map<string, Liaison[]>();
const MÉMOIRE_DES_LIAISONS = 64;

function cleDesLiaisons(monde: Monde, places: Record<string, Emplacement>, colonnes: number): string {
  const posees = Object.keys(places)
    .sort()
    .map((id) => `${id}:${places[id]!.c},${places[id]!.l}`)
    .join(';');
  return `${monde.id}|${monde.cases.length}|${colonnes}|${posees}`;
}

export function liaisonsDuMonde(
  monde: Monde,
  places: Record<string, Emplacement> = {},
  colonnes = 0,
): Liaison[] {
  const cle = cleDesLiaisons(monde, places, colonnes);
  const sues = liaisonsEnCache.get(cle);
  if (sues) return sues;
  const emplacements = emplacementsDuMonde(monde, places, colonnes);
  const liaisons: Liaison[] = [];
  const cases = monde.cases;
  for (let i = 0; i < cases.length; i += 1) {
    for (let j = i + 1; j < cases.length; j += 1) {
      const a = cases[i]!;
      const b = cases[j]!;
      const possible = liaisonEntre(a, b);
      if (!possible) continue;
      const bord = sontVoisines(emplacements[a.id]!, emplacements[b.id]!);
      liaisons.push({ de: a.id, vers: b.id, produit: possible.produit, faite: bord });
    }
  }
  if (liaisonsEnCache.size >= MÉMOIRE_DES_LIAISONS) {
    const plusAncienne = liaisonsEnCache.keys().next().value;
    if (plusAncienne) liaisonsEnCache.delete(plusAncienne);
  }
  liaisonsEnCache.set(cle, liaisons);
  return liaisons;
}

/** **Ce qui est connecté, pour de bon** : les liaisons faites, dans l'ordre. */
export function connexionsDuMonde(
  monde: Monde,
  places: Record<string, Emplacement> = {},
  colonnes = 0,
): Liaison[] {
  return liaisonsDuMonde(monde, places, colonnes).filter((l) => l.faite);
}

/** Ce que le monde produit, une fois ses cases reliées : la chaîne des mots. */
export function chaineDuMonde(liaisons: Liaison[]): string[] {
  const vus: string[] = [];
  liaisons.forEach((l) => {
    if (l.faite && !vus.includes(l.produit)) vus.push(l.produit);
  });
  return vus;
}

/* ——————————————————————— LE VERSO D'UNE CASE ——————————————————————— */

/** Ce qu'une case montre d'elle-même quand on retourne le décor. */
export interface FaceTechnique {
  id: string;
  module: ModuleDeCase;
  /** D'où vient la donnée : le nom de la collection, en clair. */
  source: string;
  ouverture: string | null;
  famille: string;
  /** Le nombre de liaisons possibles dans le monde où elle se trouve. */
  liaisons: number;
}

/** La source d'une case, déduite de son identifiant — la collection qui la porte. */
export function sourceDuneCase(kase: CaseDuMonde): string {
  const id = kase.id;
  if (/^jour-|^annee|^porte-jour/.test(id)) return 'semaines · saintsDuJour';
  if (/^univers-/.test(id)) return 'semaines · jourDuMagazine';
  if (/^heure-/.test(id)) return 'lumiereDuJour · l’édition';
  if (/^magazine-|^chapitre-/.test(id)) return 'semaines';
  if (/^article-|^section-|^voisin-/.test(id)) return 'magazine';
  if (/^piste-/.test(id)) return 'playlistDeLAnnee';
  if (/^produit-|^objet|^prix/.test(id)) return 'shopData';
  if (/^metier-/.test(id)) return 'metierPage · personas';
  if (/^personne-/.test(id)) return 'personas';
  if (/^image-/.test(id)) return 'bibliothequeMagazine';
  if (/^rubrique-|^page-/.test(id)) return 'l’édition du jour';
  if (/^bloc-|^module-/.test(id)) return 'la composition';
  return 'la grille du monde';
}

/** **La face technique d'une case** : ce que le verso écrit dessus. */
export function faceTechnique(kase: CaseDuMonde, liaisons: number): FaceTechnique {
  return {
    id: kase.id,
    module: kase.module,
    source: sourceDuneCase(kase),
    ouverture: kase.ouvre ?? null,
    famille: kase.famille,
    liaisons,
  };
}

/** Combien de liaisons possibles une case a, dans un monde donné. */
export function liaisonsDuneCase(kase: CaseDuMonde, monde: Monde): number {
  return monde.cases.filter((autre) => liaisonEntre(kase, autre)).length;
}

/* ——————————————————— LES LIAISONS D'UNE COMPOSITION ——————————————————— */

/**
 * **Ce qu'une composition produit**, bloc après bloc : les mots des liaisons
 * faites entre voisins, dans l'ordre où ils ont été posés.
 */
export function chaineDeLaComposition(modules: ModuleDeCase[]): string[] {
  const mots: string[] = [];
  for (let i = 0; i + 1 < modules.length; i += 1) {
    const couple = LIAISONS_POSSIBLES.find(
      (l) =>
        (l.a === modules[i] && l.b === modules[i + 1]) || (l.a === modules[i + 1] && l.b === modules[i]),
    );
    if (couple) mots.push(couple.produit);
  }
  return mots;
}

/** Les modules qu'une case peut appeler autour d'elle : sa liste d'attente. */
export function modulesAttendus(module: ModuleDeCase): ModuleDeCase[] {
  const attendus = LIAISONS_POSSIBLES.filter((l) => l.a === module || l.b === module).map((l) =>
    l.a === module ? l.b : l.a,
  );
  return [...new Set(attendus)];
}
