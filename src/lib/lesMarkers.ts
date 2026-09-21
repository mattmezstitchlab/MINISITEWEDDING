/* LE MARKER — LA COULEUR DU FLUO, CHOISIE PAR CELUI QUI COCHE
 *
 * « Et pourquoi pas choisir sa couleur de marker ? » C'est le seul réglage qui
 * touche le papier : **la couleur du surlignage**. Ce qui est coché passe au
 * marker, les chiffres du rêve aussi, et le papier prend la teinte de la main
 * qui l'a rempli.
 *
 * Un marker, c'est une couleur et un mot. Il n'y a rien d'autre à régler, et
 * c'est voulu : l'appli est un ticket, le ticket est le système, le marker est
 * la seule fantaisie.
 *
 * La couleur choisie vit **dans l'adresse** (`?marker=vert`) : le lien envoyé
 * arrive avec le bon marker, et le ticket est exactement celui qu'on a rempli.
 */

export interface Marker {
  id: string;
  /** Le mot imprimé sous la pastille. */
  mot: string;
  /** La couleur de l'encre — c'est elle qui devient `--vp-fluo`. */
  couleur: string;
  /** Comment on le décrit, en un mot. */
  sous: string;
}

/** **Six markers, et c'est tout.** Du fluo de caisse au violet de bureau. */
export const LES_MARKERS: Marker[] = [
  { id: 'jaune', mot: 'JAUNE', couleur: '#f2ff42', sous: 'le fluo de caisse' },
  { id: 'vert', mot: 'VERT', couleur: '#9bff9b', sous: 'menthe' },
  { id: 'rose', mot: 'ROSE', couleur: '#ffa8d5', sous: 'bonbon' },
  { id: 'orange', mot: 'ORANGE', couleur: '#ffc061', sous: 'ambre' },
  { id: 'bleu', mot: 'BLEU', couleur: '#a5dcff', sous: 'ciel' },
  { id: 'violet', mot: 'VIOLET', couleur: '#d6b4ff', sous: 'lavande' },
];

/** **Le marker par défaut** : le jaune fluo, celui de la caisse. */
export const MARKER_PAR_DÉFAUT = 'jaune';

/** La couleur du flou quand rien n'est choisi — c'est celle de la feuille de style. */
export const COULEUR_DU_MARKER_PAR_DÉFAUT = LES_MARKERS[0]!.couleur;

/** Un marker, par son identifiant — et jamais rien : on retombe sur le défaut. */
export function markerParId(id: string | null | undefined): Marker {
  return LES_MARKERS.find((m) => m.id === id) ?? LES_MARKERS.find((m) => m.id === MARKER_PAR_DÉFAUT)!;
}

/** **Est-ce un marker ?** Ce qui vient de l'adresse n'est jamais cru sur parole. */
export function estUnMarker(id: string | null | undefined): boolean {
  return LES_MARKERS.some((m) => m.id === id);
}

/**
 * **Le marker dans l'adresse.** Il s'ajoute au lien du ticket — comme le caddie
 * et le code : `?code=…&coches=…&marker=vert`.
 */
export function adresseAvecMarker(url: string, id: string): string {
  const [chemin, requête = ''] = url.split('?');
  const suite = new URLSearchParams(requête);
  if (id === MARKER_PAR_DÉFAUT) suite.delete('marker');
  else suite.set('marker', id);
  const texte = suite.toString();
  return texte ? `${chemin}?${texte}` : (chemin ?? '');
}
