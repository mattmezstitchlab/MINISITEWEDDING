import { useEffect, useState } from 'react';

/**
 * LE TEMPS COMMUN — UN SEUL JOURNAL DU TEMPS
 *
 * Chaque brique du site datait ses choses dans son coin : la sélection avait son
 * `choisiLe`, les annonces leur `quand`, les documents leur `savedAt`… Personne
 * ne parlait à personne. Ici, **tous les gestes du site écrivent au même
 * endroit**, une ligne chacun : **qui, quoi, quand, où**. C'est ce qui rend
 * possible tout le reste — le cadran de l'année, la couture du journal, la
 * constellation, LE MONDE AIME.
 *
 * Trois principes :
 *  1. **Une ligne, un geste.** Rien d'inventé : ce que la personne a fait, à
 *     l'heure où elle l'a fait.
 *  2. **La source est toujours dite** (règle `source-dite`) : chaque famille de
 *     geste a son mot, et l'affichage le montre.
 *  3. **Le temps est relisible** : on ne réécrit pas une ligne, on en ajoute une
 *     — c'est ce qui permet de **rejouer** un jour, un mois, une année.
 */

/* ————————————————————————— LES FAMILLES DE GESTES ————————————————————————— */

export type TypeDeGeste =
  | 'selection'
  | 'chiffre'
  | 'journal'
  | 'document'
  | 'annonce'
  | 'avis'
  | 'magazine'
  | 'carte';

export interface RegleDeGeste {
  id: TypeDeGeste;
  /** Le mot affiché, tel quel. */
  nom: string;
  /** Ce que ce geste veut dire, en une phrase. */
  sens: string;
}

/** Les familles, et ce qu'elles disent. **Une seule table** : on l'ajoute, on la lit, on la teste. */
export const GESTES: RegleDeGeste[] = [
  { id: 'selection', nom: 'Une carte retenue', sens: 'elle entre dans le hero de la personne, à sa place' },
  { id: 'chiffre', nom: 'Le chiffre', sens: 'le repère symbolique, posé ou effacé par la personne' },
  { id: 'journal', nom: 'Le journal', sens: 'une page du journal écrite' },
  { id: 'document', nom: 'Un document', sens: 'un document validé, ou demandé' },
  { id: 'annonce', nom: 'Une annonce', sens: 'ce qui attend dans la fente' },
  { id: 'avis', nom: 'Un avis', sens: 'un cœur posé sur une carte' },
  { id: 'magazine', nom: 'Le magazine', sens: 'une page du magazine ouverte, un numéro lu' },
  { id: 'carte', nom: 'La carte', sens: 'la carte complétée, ou publiée' },
];

export function regleDuGeste(type: TypeDeGeste): RegleDeGeste | null {
  return GESTES.find((g) => g.id === type) ?? null;
}

/* ————————————————————————— UNE LIGNE ————————————————————————— */

export interface Ligne {
  id: string;
  /** L'instant, en clair : ISO. */
  quand: string;
  type: TypeDeGeste;
  /** Ce qui s'est passé, écrit court. */
  titre: string;
  /** Le détail, quand il y en a un. */
  detail?: string;
  /** Où — une ville, un univers, une page. */
  ou?: string;
  /** Qui — le prénom, quand il est connu. */
  qui?: string;
}

const CLE = 'vows:temps';
const EVENEMENT = 'vows:temps-change';

/** Le temps ne grossit pas sans fin : on garde les deux mille derniers gestes. */
export const LIGNES_MAX = 2000;

export function chargerTemps(): Ligne[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const brut = localStorage.getItem(CLE);
    const lu = brut ? (JSON.parse(brut) as Ligne[]) : [];
    if (!Array.isArray(lu)) return [];
    return lu.filter((l) => l && typeof l.quand === 'string' && typeof l.titre === 'string' && Boolean(regleDuGeste(l.type)));
  } catch {
    return [];
  }
}

function ecrire(lignes: Ligne[]): Ligne[] {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(CLE, JSON.stringify(lignes.slice(0, LIGNES_MAX)));
      window.dispatchEvent(new Event(EVENEMENT));
    }
  } catch {
    /* pas de fenêtre : la ligne reste dans l'état du composant */
  }
  return lignes;
}

/**
 * **Écrire au temps.** Le geste se pose en tête, daté à l'instant. On ne modifie
 * jamais une ligne : on en ajoute une.
 */
export function enregistrerGeste(geste: Omit<Ligne, 'id' | 'quand'> & { quand?: string }): Ligne {
  const complete: Ligne = {
    ...geste,
    id: `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    quand: geste.quand ?? new Date().toISOString(),
  };
  ecrire([complete, ...chargerTemps()]);
  return complete;
}

/** Le temps vivant : il suit les gestes, où qu'ils soient posés. */
export function useTemps(): Ligne[] {
  const [lignes, setLignes] = useState<Ligne[]>(() => chargerTemps());

  useEffect(() => {
    const surChangement = () => setLignes(chargerTemps());
    window.addEventListener(EVENEMENT, surChangement);
    return () => window.removeEventListener(EVENEMENT, surChangement);
  }, []);

  return lignes;
}

export function effacerTemps(): void {
  try {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(CLE);
    window.dispatchEvent(new Event(EVENEMENT));
  } catch {
    /* pas de fenêtre : rien à effacer */
  }
}

/* ————————————————————————— LIRE LE TEMPS ————————————————————————— */

function memeJour(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Les lignes d'un jour — aujourd'hui par défaut. */
export function lignesDuJour(lignes: Ligne[], jour: Date = new Date()): Ligne[] {
  return lignes.filter((l) => memeJour(new Date(l.quand), jour));
}

/** Les lignes d'une année. */
export function lignesDeLAnnee(lignes: Ligne[], annee: number): Ligne[] {
  return lignes.filter((l) => new Date(l.quand).getFullYear() === annee);
}

/**
 * **L'année en douze parts** : ce que le cadran dessinera. Chaque mois compte ses
 * gestes — c'est la première lecture d'une année, avant le dessin.
 */
export function moisDeLAnnee(lignes: Ligne[], annee: number): Array<{ mois: number; nom: string; gestes: number }> {
  const noms = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
  ];
  return noms.map((nom, i) => ({
    mois: i + 1,
    nom,
    gestes: lignesDeLAnnee(lignes, annee).filter((l) => new Date(l.quand).getMonth() === i).length,
  }));
}

/** Les années où quelque chose s'est passé, de la plus récente à la plus ancienne. */
export function anneesDuTemps(lignes: Ligne[]): number[] {
  return Array.from(new Set(lignes.map((l) => new Date(l.quand).getFullYear()))).sort((a, b) => b - a);
}

/** Ce que le temps dit de lui-même : le total, la première ligne, la famille la plus active. */
export function resumeDuTemps(lignes: Ligne[]): {
  total: number;
  premier: Ligne | null;
  derniere: Ligne | null;
  famille: RegleDeGeste | null;
} {
  if (lignes.length === 0) return { total: 0, premier: null, derniere: null, famille: null };
  const trie = [...lignes].sort((a, b) => a.quand.localeCompare(b.quand));
  const compte = new Map<TypeDeGeste, number>();
  for (const l of lignes) compte.set(l.type, (compte.get(l.type) ?? 0) + 1);
  const [type] = Array.from(compte.entries()).sort((a, b) => b[1] - a[1])[0] ?? [];
  return {
    total: lignes.length,
    premier: trie[0] ?? null,
    derniere: trie[trie.length - 1] ?? null,
    famille: type ? regleDuGeste(type) : null,
  };
}

/** L'heure écrite court : « 14 h 05 ». */
export function heureCourte(quand: string): string {
  const d = new Date(quand);
  return `${d.getHours()} h ${String(d.getMinutes()).padStart(2, '0')}`;
}

/** La date écrite : « 20 septembre 2026 ». */
export function dateDUneLigne(quand: string): string {
  return new Date(quand).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Le jour écrit court : « 20.09 » — pour une bande. */
export function jourCourt(quand: string): string {
  const d = new Date(quand);
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;
}
