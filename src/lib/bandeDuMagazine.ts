import { useEffect, useState } from 'react';
import { CHAPITRES } from './chapitres';
import { MAGAZINES, jourDuChapitre, magazineDeLaDate, niveauxDuJour } from './semaines';
import { visuelDeLaCouverture, visuelDuChapitre } from './visuelsDuMagazine';

/**
 * LA BANDE DU BAS — CE QUE LA BARRE MONTRE POUR NAVIGUER
 *
 * L'application se tient sur **un seul écran** : le visuel, plein cadre, et une
 * barre qui ne bouge jamais. Cette barre a besoin de deux choses pour faire son
 * travail de navigation :
 *
 * - **la timeline** — les 54 semaines de l'année, alignées, pour sauter d'un
 *   magazine à l'autre sans quitter le visuel ;
 * - **les visuels** — la couverture de la semaine et ses **sept chapitres**,
 *   en vignettes, pour entrer dans le chapitre qu'on veut voir.
 *
 * C'est la page qui les lui donne (`publierBande`), comme elle lui donne ses
 * repères : la barre ne devine rien, elle affiche ce qu'on lui confie. Le même
 * patron d'événement que la capsule — un seul bus, monté une fois, écouté
 * partout.
 */

const EVENEMENT = 'supermariage:bande-du-magazine';

/** Une semaine de la règle : son numéro, son titre, sa couverture si elle est livrée. */
export interface SemaineDeLaBande {
  numero: number;
  titre: string;
  url: string | null;
}

/** Un visuel de la bande : la couverture de la semaine, ou l'un de ses sept chapitres. */
export interface VisuelDeLaBande {
  /** 0 pour la couverture de la semaine, 1 à 7 pour les chapitres. */
  chapitre: number;
  label: string;
  url: string | null;
  /** La couleur du repli, quand l'image n'est pas encore livrée. */
  fond: string;
  actif: boolean;
}

export interface BandeDuMagazine {
  /** Le magazine ouvert : « Magazine 38 ». */
  magazine: string;
  /** Son numéro, 1 à 54 — le cran allumé de la règle. */
  semaine: number;
  titreDuMagazine: string;
  /** Le chapitre où la date entre, 1 à 7. */
  chapitre: number;
  /** Le jour, tel qu'il s'écrit dans la barre. */
  jour: string;
  /** Les 54 semaines de l'année — la timeline du bas. */
  semaines: SemaineDeLaBande[];
  /** La couverture + les sept chapitres de la semaine ouverte. */
  visuels: VisuelDeLaBande[];
  /** Ouvrir un magazine (sa semaine). */
  ouvrirSemaine: (numero: number) => void;
  /** Ouvrir un visuel : 0 la couverture, 1 à 7 le chapitre. */
  ouvrirVisuel: (chapitre: number) => void;
}

/**
 * **LA BANDE D'UNE DATE** — la même pour tout le monde.
 *
 * Elle se construit à partir de la source unique (`semaines.ts`) et de la
 * bibliothèque (`visuelsDuMagazine.ts`) : les 54 semaines de la règle avec leur
 * couverture quand elle est livrée, puis la couverture de la semaine ouverte et
 * ses sept chapitres, le chapitre du jour allumé. Les gestes, eux, viennent de
 * la page — c'est elle qui sait ouvrir un jour.
 */
export function bandeDuMagazineDeLaDate(
  date: Date,
  gestes: { ouvrirSemaine: (numero: number) => void; ouvrirVisuel: (chapitre: number) => void },
): BandeDuMagazine {
  const niveaux = niveauxDuJour(date);
  const magazine = magazineDeLaDate(date);
  const numero = magazine.numero;
  const fond = magazine.palette.fond;

  return {
    magazine: niveaux.magazine,
    semaine: numero,
    titreDuMagazine: magazine.titre,
    chapitre: niveaux.numeroDeChapitre,
    jour: niveaux.date,
    semaines: MAGAZINES.map((m) => ({
      numero: m.numero,
      titre: m.titre,
      url: visuelDeLaCouverture(m.numero).url,
    })),
    visuels: [
      {
        chapitre: 0,
        label: 'la couverture',
        url: visuelDeLaCouverture(numero).url,
        fond,
        actif: false,
      },
      ...CHAPITRES.map((c) => ({
        chapitre: c.numero,
        label: c.titre,
        url: visuelDuChapitre(numero, c.numero).url,
        fond,
        actif: c.numero === niveaux.numeroDeChapitre,
      })),
    ],
    ouvrirSemaine: gestes.ouvrirSemaine,
    ouvrirVisuel: gestes.ouvrirVisuel,
  };
}

/** Le premier jour d'un magazine : là où l'on ouvre une semaine de la règle. */
export function premierJourDuMagazine(numero: number, annee: number): Date {
  return jourDuChapitre(numero, 1, annee);
}

let bande: BandeDuMagazine | null = null;

/** La page publie sa bande ; `null` la retire (le dock reprend sa forme simple). */
export function publierBande(valeurs: BandeDuMagazine | null): void {
  bande = valeurs;
  prevenir();
}

export function bandeDuMagazine(): BandeDuMagazine | null {
  return bande;
}

export function useBandeDuMagazine(): BandeDuMagazine | null {
  const [etat, setEtat] = useState<BandeDuMagazine | null>(bande);
  useEffect(() => {
    const surChangement = () => setEtat(bande);
    window.addEventListener(EVENEMENT, surChangement);
    return () => window.removeEventListener(EVENEMENT, surChangement);
  }, []);
  return etat;
}

function prevenir(): void {
  try {
    window.dispatchEvent(new Event(EVENEMENT));
  } catch {
    /* pas de fenêtre : personne à prévenir */
  }
}
