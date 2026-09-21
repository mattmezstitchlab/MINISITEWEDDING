import { CATÉGORIES_DU_TICKET } from './categoriesDuTicket';

/* LE TRI DU TICKET — LE MARIAGE D'UN CÔTÉ, L'ADMINISTRATIF DE L'AUTRE
 *
 * « Dans le grand ticket, y'a encore des choses pas besoin — administratif ou
 * juridique. Donc faut trier. »
 *
 * Le ticket de caisse d'un mariage ne doit porter **que le mariage** : les
 * heures, la musique, la table, les gens, les petits prix, le site, le voyage.
 * Le reste — les attestations, les contrats, les actes, les procurations, les
 * justificatifs — n'a rien à faire sur ce papier-là : c'est de
 * l'**administratif**, et ça a son propre ticket.
 *
 * ```
 *   la fête             22:00 — néons · l'accordéoniste · le menu · le néon
 *                       …et le voyage, et le site des invités
 *   l'administratif     attestation d'hébergement · lettre pour un visa ·
 *                       contrat de prestation · procuration · acte de mariage
 *                       → sur le ticket PAPIERS, et nulle part ailleurs
 * ```
 *
 * Rien n'est supprimé : les pièces restent dans le catalogue, elles changent
 * simplement de papier. C'est ce qui permet de les retrouver le jour où l'on en
 * a besoin — le visa du voyage, l'autorisation de diffusion, la procuration.
 */

/** **Ce qui n'a pas sa place sur le ticket du mariage.** */
export const LIGNES_ADMINISTRATIVES: string[] = CATÉGORIES_DU_TICKET.find((c) => c.id === 'documents')!.lignes.map(
  (l) => l.id,
);

/** Les mots de l'administratif, tels qu'ils s'impriment sur leur ticket. */
export const MOTS_ADMINISTRATIFS: Array<{ id: string; mot: string; sous: string }> = CATÉGORIES_DU_TICKET.find(
  (c) => c.id === 'documents',
)!.lignes.map((l) => ({ id: l.id, mot: l.label, sous: l.detail.split(' — ')[0] ?? '' }));

/** **La ligne va-t-elle sur le ticket du mariage ?** Non, si elle est administrative. */
export function estAdministrative(id: string): boolean {
  return LIGNES_ADMINISTRATIVES.includes(id);
}

/** Combien de lignes du mariage — celles qu'on imprime — et combien à part. */
export const COMBIEN_DE_LIGNES_DU_MARIAGE = CATÉGORIES_DU_TICKET.filter(
  (c) => c.id !== 'documents',
).reduce((somme, c) => somme + c.lignes.length, 0);
