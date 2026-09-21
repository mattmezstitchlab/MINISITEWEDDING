import { lesOpérationsDuCode, lesOpérationsEnCode, type LOpération } from './lesOpérations';
import { estUnMarker } from './lesMarkers';

/* LE CODE DU TICKET — TOUT DEDANS, RIEN À PRÉPARER
 *
 * « Ou alors implémenter un code puissant, méga balèze, tout ce qu'on peut
 * mettre. »
 *
 * Le ticket n'a pas de compte derrière lui : **il est son propre code**. Une
 * seule ligne de texte porte le mariage, les lignes prises, la couleur du
 * marker, la face qu'on regarde, si c'est payé, et **les opérations** — celles
 * qu'on a créées avec le +, avec leurs prix, leurs destinataires et leurs notes.
 * Qui reçoit ce code a reçu le ticket : de son côté, c'est sa facture ; une fois
 * payé, c'est son reçu. Rien à préparer, rien à retrouver.
 *
 * La forme — les quatre morceaux sont séparés par un point, les champs par un
 * deux-points, parce qu'un code doit tenir dans une adresse, dans un QR, ou sur
 * un coin de nappe :
 *
 *   SM1.NUB-139.marker-vert.3lignes.payé…           (rien)
 *   SM1.NUB-139.jaune.coches-a,b,c.client.ope-…     (tout)
 */

/** La version du code : ce qui permet de le relire dans dix ans. */
export const VERSION_DU_CODE = 'SM1';

export interface ÉtatDuCode {
  /** Le code du mariage — la signature. */
  code: string;
  /** Les lignes prises, dans l'ordre où elles sont posées. */
  coches: string[];
  /** La couleur qui surligne le papier. */
  marker: string;
  /** La face qu'on regarde. */
  face: string;
  payé: boolean;
  /** Les opérations, déjà écrites ou reçues. */
  opérations: LOpération[];
}

/**
 * **Le code complet** : tout le ticket en une ligne. Un champ vide ne s'écrit
 * pas — un code juste se lit mieux (et se dit au téléphone).
 */
export function leCodeDuTicket(état: ÉtatDuCode): string {
  const morceaux: string[] = [VERSION_DU_CODE, état.code];
  if (état.coches.length) morceaux.push(`c=${état.coches.join(',')}`);
  if (état.marker) morceaux.push(`m=${état.marker}`);
  if (état.face && état.face !== 'emetteur') morceaux.push(`v=${état.face}`);
  if (état.payé) morceaux.push('p=1');
  if (état.opérations.length) morceaux.push(`o=${lesOpérationsEnCode(état.opérations)}`);
  return morceaux.join('.');
}

/** **Le code relu** : ce qu'il dit, ou rien s'il n'est pas de nous. */
export function lÉtatDuCode(texte: string): ÉtatDuCode | null {
  const morceaux = (texte ?? '').split('.');
  if (morceaux[0] !== VERSION_DU_CODE) return null;
  const [, code = '', ...reste] = morceaux;
  if (!code) return null;

  const état: ÉtatDuCode = { code, coches: [], marker: '', face: 'emetteur', payé: false, opérations: [] };
  for (const morceau of reste) {
    const [clé, valeur = ''] = morceau.split('=');
    if (clé === 'c') état.coches = valeur ? valeur.split(',').filter(Boolean) : [];
    else if (clé === 'm' && estUnMarker(valeur)) état.marker = valeur;
    else if (clé === 'v' && (valeur === 'client' || valeur === 'emetteur')) état.face = valeur;
    else if (clé === 'p') état.payé = valeur === '1';
    else if (clé === 'o') état.opérations = lesOpérationsDuCode(valeur);
  }
  return état;
}

/** Le code tient-il dans l'adresse ? Au-delà, il faudra le raccourcir. */
export const LE_CODE_TIENT_LONGUEUR = 1200;
