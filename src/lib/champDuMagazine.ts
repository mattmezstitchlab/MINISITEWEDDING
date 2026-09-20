/**
 * LE CHAMP DU MAGAZINE — LA SEULE QUESTION DE LA PREMIÈRE VUE
 *
 * « Paul & Emma » → `['Paul', 'Emma']`. On accepte ce que les gens écrivent
 * vraiment : l'esperluette, le « et », le « + », la virgule, le point médian, le
 * slash. Un seul prénom passe aussi : **la suite posera la question manquante
 * plutôt que d'inventer un second prénom**.
 */

/** Les séparateurs qu'on accepte entre deux prénoms, tels qu'on les écrit. */
export const SEPARATEURS_PRENOMS = /\s*(?:&|＋|\+|,|;|\/|·| et )\s*/i;

export function prenomsDuChamp(valeur: string): [string, string] {
  const morceaux = valeur
    .split(SEPARATEURS_PRENOMS)
    .map((m) => m.trim())
    .filter((m) => m.length > 0);
  return [morceaux[0] ?? '', morceaux[1] ?? ''];
}
