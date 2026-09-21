import {
  TIMELINE_TOTAL_MINUTES,
  type TimelineTrackItem,
} from './timelineTheaterEngine';
import { MAGAZINES, NOMBRE_DE_MAGAZINES, joursDuMagazine, magazineDeLaDate } from './semaines';
import { CHAPITRES } from './chapitres';
import { MOIS_LONGS } from './calendrier';
import { visuelDeLaCouverture } from './visuelsDuMagazine';

/**
 * L'ATELIER DE L'ANNÉE — LES 54 MAGAZINES SUR LA BANDE
 *
 * L'atelier timeline (`TimelineTheaterStudio`) est le moteur temporel du site :
 * une règle, des blocs qu'on déplace, un inspecteur, une tête de lecture. Il
 * servait **le jour J**, de six heures du matin à quatre heures du lendemain.
 *
 * Ici, on lui donne **une autre source** : l'année. Chaque bloc est un
 * magazine — sa semaine, son titre, son style, sa palette, ses **sept
 * chapitres** — et la bande se lit du 1ᵉʳ janvier au 31 décembre. La tête de
 * lecture, elle, se pose sur **la semaine où l'on est**.
 *
 * Rien n'est inventé : les dates viennent de `joursDuMagazine()`, les titres de
 * `semaines.ts`, et les images de la bibliothèque. Un magazine dont la
 * couverture n'est pas livrée garde son bloc — c'est le point de la cascade.
 */

/** La largeur d'un magazine sur la bande : un cinquante-quatrième de l'année. */
export const PAS_DU_MAGAZINE = TIMELINE_TOTAL_MINUTES / NOMBRE_DE_MAGAZINES;

/** Une date courte, comme on l'écrit dans un sommaire : « 17 sept. ». */
function dateCourte(date: Date): string {
  return `${date.getDate()} ${MOIS_LONGS[date.getMonth()]!.slice(0, 4)}.`;
}

/** Les blocs de la collection : un par magazine, dans l'ordre de l'année. */
export function blocsDeLaCollection(annee = new Date().getFullYear()): TimelineTrackItem[] {
  return MAGAZINES.map((magazine, i) => {
    const jours = joursDuMagazine(magazine.numero, annee);
    const debut = jours[0]!;
    const fin = jours[jours.length - 1]!;
    const visuel = visuelDeLaCouverture(magazine.numero);
    const periode = magazine.joker
      ? dateCourte(debut)
      : `${dateCourte(debut)} – ${dateCourte(fin)}`;

    return {
      id: `magazine-${magazine.numero}`,
      mode: 'calendar' as const,
      chapter: magazine.joker ? 'Hors calendrier' : `Semaine ${magazine.semaine} · ${magazine.saison.nom}`,
      title: `${String(magazine.numero).padStart(2, '0')} · ${magazine.titre}`,
      subtitle: magazine.style,
      startTime: periode,
      durationMinutes: PAS_DU_MAGAZINE,
      startMinuteOfDay: i * PAS_DU_MAGAZINE,
      colorAccent: magazine.palette.accent,
      category: 'milestone' as const,
      mediaUrl: visuel.url ?? undefined,
      mediaType: 'image' as const,
      description: magazine.resume,
      mesure: '7 chapitres',
      sousTitres: CHAPITRES.map((c) => c.titre),
      docBadge: `${magazine.numero} / ${NOMBRE_DE_MAGAZINES}`,
      visibility: ['guest', 'couple', 'vendor'] as const,
      attachedDocs: [],
      isLocked: false,
    } as TimelineTrackItem;
  });
}

/** Les graduations de la règle : une par magazine, avec sa date de début. */
export function graduationsDeLaCollection(annee = new Date().getFullYear()): Array<{ label: string; sous?: string }> {
  return MAGAZINES.map((magazine) => {
    const [debut] = joursDuMagazine(magazine.numero, annee);
    return {
      label: String(magazine.numero).padStart(2, '0'),
      sous: magazine.joker ? 'hors calendrier' : dateCourte(debut!),
    };
  });
}

/**
 * Où poser la tête de lecture : **la semaine où l'on est**, en minutes.
 *
 * On ne devine pas l'index en divisant le jour de l'année par sept — les jokers
 * et les semaines qui débordent fausseraient le calcul. On demande le magazine
 * de la date à la source unique (`semaines.ts`), et sa place sur la bande en
 * découle.
 */
export function teteSurLaSemaineCourante(date = new Date()): number {
  const index = Math.min(NOMBRE_DE_MAGAZINES - 1, Math.max(0, magazineDeLaDate(date).numero - 1));
  return index * PAS_DU_MAGAZINE;
}

/** Le chemin d'un magazine, pour l'ouvrir depuis l'atelier : `?jour=09-17`. */
export function adresseDuMagazine(numero: number, annee = new Date().getFullYear()): string {
  const [debut] = joursDuMagazine(numero, annee);
  const mois = String(debut!.getMonth() + 1).padStart(2, '0');
  const quantieme = String(debut!.getDate()).padStart(2, '0');
  return `/magazine?jour=${mois}-${quantieme}`;
}
