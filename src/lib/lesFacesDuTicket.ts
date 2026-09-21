/* LES DEUX FACES DU MÊME OBJET
 *
 * « Ça pourrait être un ticket évolutif : quelqu'un te paye, ça arrive sur le
 * ticket, et de son côté c'est rangé en facture et en reçu. Devis, pareil. Rien
 * à préparer — les clients se le procurent tout seuls. »
 *
 * Il n'y a donc pas deux documents à tenir : **un seul objet, deux faces**.
 * La face de l'émetteur, c'est le ticket (tout y est, notes privées comprises) ;
 * la face du client, c'est **sa** facture — puis **son** reçu, dès que c'est
 * payé. Ce qui change n'est pas le contenu, ce sont **les mots** — et ce qu'on
 * cache : le client ne voit ni les notes privées, ni la cagnotte du couple, ni
 * les papiers administratifs.
 */

export type FaceDuTicket = 'emetteur' | 'client';

export interface MotsDeLaFace {
  id: FaceDuTicket;
  mot: string;
  /** Ce qu'on dit du papier, une fois payé. */
  réglé: string;
  /** Ce qu'on dit du papier, tant qu'il ne l'est pas. */
  àRégler: string;
  /** La ligne qui dit qui l'a émis — sur la face du client seulement. */
  émis: string;
  /** La phrase du pied : ce que ce papier est, et à qui. */
  pied: string;
  /** Ce que cette face **ne montre pas**. */
  cache: string[];
}

export const LES_FACES: MotsDeLaFace[] = [
  {
    id: 'emetteur',
    mot: 'ÉMETTEUR',
    réglé: '✓ PAYÉ · MERCI',
    àRégler: 'À PAYER',
    émis: '',
    pied: 'Merci · et bon voyage',
    cache: [],
  },
  {
    id: 'client',
    mot: 'CLIENT',
    réglé: '✓ RÉGLÉ · REÇU',
    àRégler: 'À RÉGLER',
    émis: 'ÉMIS PAR SUPER MARIAGE · LE SPÉCIALISTE DU TICKET DE CAISSE',
    pied: 'Ce papier est le vôtre — rien à préparer',
    // Ce qui n'appartient qu'au couple : la cagnotte, le rêve, l'administratif,
    // et les notes qu'on s'écrit à soi-même.
    cache: ['voyage', 'administratif', 'notes-privées'],
  },
];

export const estUneFace = (id: string): boolean => LES_FACES.some((f) => f.id === id);

export const laFace = (id: string): MotsDeLaFace =>
  LES_FACES.find((f) => f.id === id) ?? LES_FACES[0]!;

/** **Ce que la face dit du titre** : le ticket, ou la facture devenue reçu. */
export function leTitreDuPapier(face: FaceDuTicket, payé: boolean): string {
  if (face === 'emetteur') return 'SUPER MARIAGE';
  return payé ? 'REÇU' : 'FACTURE';
}

/** Cette face montre-t-elle cette partie du papier ? */
export function laFaceMontre(face: FaceDuTicket, partie: string): boolean {
  return !laFace(face).cache.includes(partie);
}

/** Une note se montre-t-elle, **sur cette face** ? */
export function laNoteSeMontre(face: FaceDuTicket, privée: boolean): boolean {
  return !privée || face === 'emetteur';
}

/** L'autre face — celle qui se trouve de l'autre côté du même papier. */
export const lAutreFace = (face: FaceDuTicket): FaceDuTicket =>
  face === 'emetteur' ? 'client' : 'emetteur';
