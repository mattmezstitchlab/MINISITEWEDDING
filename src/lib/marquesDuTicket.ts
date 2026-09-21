/* LES MARQUES DU TICKET — CE QUE CHAQUE PICTO TAMPONNE
 *
 * « On pourrait cliquer sur le picto tampon pour faire tampon “payé”. » Les
 * sept objets du Ripple ne sont pas décoratifs : chacun **tamponne le papier**
 * d'un mot, à l'encre, de travers. Le tampon, lui, fait passer le ticket à
 * `PAYÉ` — c'est le seul qui change l'état du papier.
 *
 * Le mot d'une marque est court, en capitales, et il est le même partout :
 * sur le papier, dans le mot du geste, et sur le sticker qui s'imprime en
 * dessous. Rien n'est inventé : les objets viennent de `ripple.ts`.
 */

export const MARQUES_DU_TICKET: Record<string, string> = {
  tampon: 'PAYÉ',
  'carte-postale': 'MERCI',
  'billet-avion': 'DÉPART',
  'ticket-caisse': 'REÇU',
  'ticket-spectacle': 'MA PLACE',
  timbre: 'AFFRANCHI',
  sticker: 'TOP',
};

/** Le mot d'une marque ; « PAYÉ » quand l'objet n'en a pas. */
export function marqueDuTampon(id: string): string {
  return MARQUES_DU_TICKET[id] ?? 'PAYÉ';
}
