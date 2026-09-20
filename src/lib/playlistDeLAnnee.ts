import { GLOBAL_WEDDING_PLAYLIST_FULL, type WeddingDjTrack } from './weddingDjPlaylist';

/**
 * LA PLAYLIST DE L'ANNÉE — UN MORCEAU PAR JOUR
 *
 * Chaque jour de l'année porte déjà, dans son édition, une page « La musique » :
 * un morceau choisi dans le catalogue, toujours le même pour le même jour. Ici,
 * on rassemble **toute l'année** : 365 cartes, une par jour, chacune avec le
 * morceau de son jour — pour que la playlist de l'accueil ait déjà toutes les
 * cartes.
 *
 * Le choix est déterministe : le même jour donne toujours le même morceau, et la
 * carte porte la date du jour en guise d'horaire.
 */

function signer(graine: string): number {
  let h = 2166136261;
  for (let i = 0; i < graine.length; i += 1) {
    h ^= graine.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Le morceau d'un jour : toujours le même pour le même jour. */
export function morceauDuJour(date: Date): WeddingDjTrack {
  const jour = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return GLOBAL_WEDDING_PLAYLIST_FULL[signer(`${date.getFullYear()}|${jour}`) % GLOBAL_WEDDING_PLAYLIST_FULL.length]!;
}

export interface PisteDeLAnnee extends WeddingDjTrack {
  /** `MM-JJ` — le jour qui porte cette piste. */
  jour: string;
}

/** Les 365 cartes de l'année, dans l'ordre du calendrier. */
export function playlistDeLAnnee(annee: number): PisteDeLAnnee[] {
  const pistes: PisteDeLAnnee[] = [];
  for (let mois = 0; mois < 12; mois += 1) {
    const joursDuMois = new Date(annee, mois + 1, 0).getDate();
    for (let quantieme = 1; quantieme <= joursDuMois; quantieme += 1) {
      const date = new Date(annee, mois, quantieme);
      const base = morceauDuJour(date);
      const jour = `${String(mois + 1).padStart(2, '0')}-${String(quantieme).padStart(2, '0')}`;
      pistes.push({
        ...base,
        id: `${jour}|${base.id}`,
        jour,
        /** La date du jour, à la place de l'horaire : c'est elle, le repère. */
        suggestedTime: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      });
    }
  }
  return pistes;
}

/** Les comptes, dits franchement. */
export const PISTES_DE_LANNEE = 365;
