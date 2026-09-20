/**
 * LES SIX TEMPS DU JOUR — LE VISAGE QUI CHANGE AVEC L'HEURE
 *
 * L'édition a **vingt-quatre pages, une par heure** (§46). Mais une journée ne
 * se lit pas heure par heure : elle se lit en **temps**. Six ici — cinq pour le
 * jour, et la nuit, qui est la queue de la veille :
 *
 * ```
 * LA NUIT       0 h → 4 h    ce qui se dit à voix basse
 * L'AUBE        5 h → 7 h    la lumière qui monte, le lieu qui se découvre
 * LE MATIN      8 h → 11 h   on dresse, on répète, on s'habille
 * LE MIDI      12 h → 13 h   le plein jour, le dernier moment tranquille
 * L'APRÈS-MIDI 14 h → 17 h   la cérémonie, les vœux, le verre
 * LE SOIR      18 h → 23 h   la golden hour, la table, la piste
 * ```
 *
 * La couverture du jour ne change pas de dessin pour autant : elle **s'éclaire
 * autrement**. Le cadran des vingt-quatre heures garde ses branches, et ce sont
 * celles du temps qu'on regarde qui s'allument. Le même jour, six lumières —
 * c'est la règle de la charte tenue autrement : *la création est au centre, rien
 * ne passe dessus*, mais elle se lit à l'heure qu'il est.
 *
 * ## La règle éditoriale, en trois questions
 *
 * - **QUI** — le personnage du jour ouvre le numéro (§48).
 * - **QUAND** — le temps et l'heure donnent la lumière.
 * - **QUOI** — ce qui se passe vraiment : ce que la page de l'heure raconte.
 */

export interface PartDuJour {
  id: string;
  nom: string;
  /** La première heure, incluse. */
  de: number;
  /** La dernière heure, incluse. */
  a: number;
  /** La lumière qui domine, reprise des heures de l'édition. */
  lumiere: string;
  /** Ce que c'est, en une phrase. */
  phrase: string;
}

export const PARTS: PartDuJour[] = [
  {
    id: 'nuit',
    nom: 'La nuit',
    de: 0,
    a: 4,
    lumiere: 'la nuit pleine',
    phrase: 'ce qui se dit à voix basse, ceux qui restent, et ceux qui travaillent',
  },
  {
    id: 'aube',
    nom: 'L’aube',
    de: 5,
    a: 7,
    lumiere: 'l’aube, puis le lever',
    phrase: 'la lumière qui monte, le lieu qui se découvre, le premier café',
  },
  {
    id: 'matin',
    nom: 'Le matin',
    de: 8,
    a: 11,
    lumiere: 'le matin clair',
    phrase: 'on dresse, on répète, on vérifie, et on s’habille',
  },
  {
    id: 'midi',
    nom: 'Le midi',
    de: 12,
    a: 13,
    lumiere: 'le plein jour',
    phrase: 'le plein jour, et le dernier moment tranquille',
  },
  {
    id: 'apres-midi',
    nom: 'L’après-midi',
    de: 14,
    a: 17,
    lumiere: 'le début, puis la fin d’après-midi',
    phrase: 'la cérémonie, les vœux, les signatures, le verre',
  },
  {
    id: 'soir',
    nom: 'Le soir',
    de: 18,
    a: 23,
    lumiere: 'la golden hour, le crépuscule, la soirée',
    phrase: 'la plus belle lumière, la table, les discours, la piste',
  },
];

/** Les heures d'un temps : la nuit en compte cinq, les autres quatre. */
export function heuresDeLaPart(part: PartDuJour): number[] {
  const heures: number[] = [];
  for (let h = part.de; h <= part.a; h += 1) heures.push(h);
  return heures;
}

export function partParId(id: string): PartDuJour | null {
  return PARTS.find((p) => p.id === id) ?? null;
}

/** Le temps d'une heure : 0 à 23. Une heure hors bornes retombe sur la nuit. */
export function partDeLHeure(heure: number): PartDuJour {
  return PARTS.find((p) => heure >= p.de && heure <= p.a) ?? PARTS[0]!;
}

/** Le temps qu'il est, maintenant. */
export function partActuelle(date: Date = new Date()): PartDuJour {
  return partDeLHeure(date.getHours());
}

/** Les trois questions, dans l'ordre où elles se posent. */
export const REGLE_EDITORIALE: Array<{ cle: string; question: string; sens: string }> = [
  { cle: 'QUI', question: 'Qui ouvre le numéro ?', sens: 'le personnage du jour — sa fiche, ses ponts (voir le profil).' },
  { cle: 'QUAND', question: 'À quel moment du jour ?', sens: 'le temps et l’heure donnent la lumière de la couverture.' },
  { cle: 'QUOI', question: 'Que s’y passe-t-il ?', sens: 'ce que la page de cette heure raconte — jamais une généralité.' },
];

/** L'heure écrite comme on la dit : « 5 h », « 17 h ». */
export function heureCourte(heure: number): string {
  return `${heure} h`;
}

/** Les bornes d'un temps, écrites : « 5 h → 7 h ». */
export function bornesDeLaPart(part: PartDuJour): string {
  return `${heureCourte(part.de)} → ${heureCourte(part.a)}`;
}
