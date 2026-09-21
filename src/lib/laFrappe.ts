/* LA FRAPPE — LE TICKET S'ÉCRIT LETTRE PAR LETTRE
 *
 * « Et au début juste un champ de saisie avec un agent agentic, et tout se
 * saisit lettre par lettre pendant la génération. »
 *
 * Ce que l'agent décide ne tombe pas d'un coup sur le papier : **ça s'imprime**.
 * Une ligne à la fois, lettre à lettre — comme une caisse qui écrit. C'est ce
 * qui rend l'attente visible : on voit ce qui arrive, et l'on peut décider
 * pendant que ça arrive.
 *
 * Deux morceaux, et ils se testent :
 *
 * 1. **`ceQuiEstÉcrit`** — combien de lettres sont écrites à un pas donné ;
 * 2. **`unPasDeLaFrappe`** — ce qui se passe au pas suivant : une lettre de
 *    plus, ou bien **la ligne est finie** (`écrite`), elle entre sur le ticket
 *    et la suivante prend la main.
 */

/** La vitesse de la frappe : un pas, une lettre. */
export const LETTRES_PAR_PAS = 1;

/** Le temps d'un pas, en millisecondes — rapide, mais lisible. */
export const PAS_DE_LA_FRAPPE = 16;

/** **Ce qui est déjà écrit** d'un mot, au pas donné. */
export function ceQuiEstÉcrit(mot: string, pas: number): string {
  return mot.slice(0, Math.max(0, Math.min(mot.length, pas)));
}

/** **Combien de pas** pour écrire un mot entier — zéro s'il n'y a rien à écrire. */
export function pasPourÉcrire(mot: string): number {
  return Math.ceil(mot.length / LETTRES_PAR_PAS);
}

/** Le mot est-il écrit en entier ? */
export function estÉcrit(mot: string, pas: number): boolean {
  return pas >= pasPourÉcrire(mot);
}

/** Le mot du curseur : ce qui clignote au bout de la ligne en train de s'écrire. */
export const CURSEUR = '▌';

/* ————————————————— LA FILE ————————————————— */

/** Une ligne qui attend d'être écrite : son identifiant, et le mot à écrire. */
export interface LigneDeLaFile {
  id: string;
  mot: string;
}

/** Ce que le pas suivant a fait. */
export interface PasDeLaFrappe {
  /** La file, la ligne de tête étant celle qui s'écrit. */
  file: LigneDeLaFile[];
  /** La lettre où l'on en est, sur la ligne de tête. */
  pas: number;
  /** **La ligne qui vient d'être écrite en entier** — elle entre sur le ticket. */
  écrite: string | null;
}

/**
 * **Le pas suivant de la frappe.** Une lettre de plus ; et quand le mot est
 * entier, la ligne sort de la file (`écrite`) et la suivante commence à zéro.
 */
export function unPasDeLaFrappe(file: LigneDeLaFile[], pas: number): PasDeLaFrappe {
  const ligne = file[0];
  if (!ligne) return { file, pas: 0, écrite: null };
  if (pas + LETTRES_PAR_PAS < pasPourÉcrire(ligne.mot)) {
    return { file, pas: pas + LETTRES_PAR_PAS, écrite: null };
  }
  return { file: file.slice(1), pas: 0, écrite: ligne.id };
}

/**
 * **On met en file ce que l'agent a fait venir** — sans jamais deux fois la même
 * ligne : ni ce qui est déjà écrit sur le ticket, ni ce qui attend déjà.
 */
export function mettreEnFile(
  file: LigneDeLaFile[],
  prises: string[],
  lignes: { id: string; mot: string }[],
): LigneDeLaFile[] {
  const déjà = new Set([...prises, ...file.map((l) => l.id)]);
  return [...file, ...lignes.filter((l) => !déjà.has(l.id)).map((l) => ({ id: l.id, mot: l.mot }))];
}
