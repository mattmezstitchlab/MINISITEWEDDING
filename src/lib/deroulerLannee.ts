import { MOIS } from './calendrier';
import { couvertureDuJour, type CouvertureJour } from './couvertureDuJour';
import { bornesDeLaSemaine, JEU_DE_54, SAISONS, type Saison } from './jeuDeCartes';

/**
 * DÉROULER L'ANNÉE — LA TIMELINE EN COUVERTURES
 *
 * La timeline se déplie comme une molette : **les quatre saisons d'abord**, puis
 * une saison se déplie **en mois**, un mois **en semaines**, une semaine **en
 * jours** — et le jour ouvre le magazine, où les heures et les minutes prennent
 * le relais. Chaque niveau rend ses couvertures : la timeline est une bande
 * horizontale de visuels, pas une liste.
 */

export interface JourDeLaTimeline {
  /** `MM-JJ`. */
  jour: string;
  date: Date;
  nom: string;
  couverture: CouvertureJour;
}

/** Les quatre saisons, dans l'ordre de l'année. */
export function saisonsDeLaTimeline(): Saison[] {
  return SAISONS;
}

/** Les mois d'une saison : le calendrier, pas l'approximation. */
export const MOIS_DES_SAISONS: Record<string, number[]> = {
  printemps: [3, 4, 5],
  ete: [6, 7, 8],
  automne: [9, 10, 11],
  hiver: [12, 1, 2],
};

export function moisDeLaSaison(saisonId: string): Array<{ numero: number; nom: string }> {
  return MOIS.filter((m) => (MOIS_DES_SAISONS[saisonId] ?? []).includes(m.numero));
}

/** Les semaines qui touchent un mois, dans l'ordre. */
export function semainesDuMois(annee: number, mois: number): number[] {
  const semaines = new Set<number>();
  for (const carte of JEU_DE_54) {
    if (carte.semaine === null) continue;
    const [debut, fin] = bornesDeLaSemaine(annee, carte.semaine);
    const dansLeMois = (d: Date) => d.getMonth() + 1 === mois;
    if (dansLeMois(debut) || dansLeMois(fin)) semaines.add(carte.semaine);
  }
  return [...semaines].sort((a, b) => a - b);
}

/** Les sept jours d'une semaine, en couvertures. */
export function joursDeLaSemaine(annee: number, semaine: number): JourDeLaTimeline[] {
  const [debut] = bornesDeLaSemaine(annee, semaine);
  const jours: JourDeLaTimeline[] = [];
  for (let i = 0; i < 7; i += 1) {
    const date = new Date(debut.getTime() + i * 24 * 3600 * 1000);
    if (date.getFullYear() !== annee) continue;
    const couverture = couvertureDuJour(date);
    jours.push({
      jour: `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
      date,
      nom: couverture.nom,
      couverture,
    });
  }
  return jours;
}

/** Chercher un jour par son nom : la molette a sa recherche. */
export function chercherUnJour(annee: number, requete: string): JourDeLaTimeline[] {
  const q = requete.trim().toLowerCase();
  if (q.length < 2) return [];
  const jours: JourDeLaTimeline[] = [];
  for (let mois = 0; mois < 12; mois += 1) {
    const nb = new Date(annee, mois + 1, 0).getDate();
    for (let quantieme = 1; quantieme <= nb; quantieme += 1) {
      const date = new Date(annee, mois, quantieme);
      const couverture = couvertureDuJour(date);
      if (couverture.nom.toLowerCase().includes(q)) {
        jours.push({
          jour: `${String(mois + 1).padStart(2, '0')}-${String(quantieme).padStart(2, '0')}`,
          date,
          nom: couverture.nom,
          couverture,
        });
      }
      if (jours.length >= 12) return jours;
    }
  }
  return jours;
}

/** L'angle d'un jour sur le cadran : 0 au 1ᵉʳ janvier, un tour en 365 jours. */
export function angleDuJour(date: Date): number {
  const debut = new Date(date.getFullYear(), 0, 1);
  const jours = Math.round((date.getTime() - debut.getTime()) / 86400000);
  const total = date.getFullYear() % 4 === 0 ? 366 : 365;
  return (jours / total) * 360;
}
