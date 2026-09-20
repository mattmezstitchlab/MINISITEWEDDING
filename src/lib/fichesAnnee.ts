/**
 * LES 365 FICHES DE L'ANNÉE — TOUT CE QU'ON SAIT D'UN JOUR, ET RIEN DE PLUS
 *
 * Une seule fonction compose la fiche de **n'importe quel jour de l'année** :
 * ce que le calendrier donne (la fête), ce que la tradition donne (le métier et
 * ses portes), ce que les dictionnaires donnent (le sens du prénom), ce que le
 * magazine sait calculer (la saison, la couleur, la carte, la semaine, le
 * chiffre, le ciel, la lune), et — quand elle existe — **la fiche documentée**
 * du profil éditorial, avec ses ponts, son casting et ses idées.
 *
 * ## Trois états, et ils sont dits
 *
 * - `prete` — la journée a sa fiche documentée : origine, époque, lieu, métier,
 *   savoir-faire, culture, signification, ponts, casting. Son prompt maître
 *   s'écrit tout seul.
 * - `amorcee` — on sait le sens du prénom, et souvent le métier par la
 *   tradition : la journée a **une porte**, mais pas encore son histoire. C'est
 *   la réserve de travail, et elle est déjà utile : le 3 février, on sait que
 *   Blaise est le patron des meuniers, donc que le jour ouvre **le pain**.
 * - `a-documenter` — le jour n'a que son nom, sa saison et sa lumière. Rien
 *   n'est inventé pour le remplir, et la fiche dit exactement ce qui manque.
 *
 * ## La règle
 *
 * **On n'illustre pas ce qu'on n'a pas documenté, et on n'écrit pas ce qu'on ne
 * sait pas.** Un champ vide reste vide, et il est nommé.
 */

import { MOIS } from './calendrier';
import { couvertureDuJour } from './couvertureDuJour';
import { cleDuJour, PROFILS, type Casting, type Fiche, type Pont } from './profilsEditoriaux';
import { PATRONAGES, patronagesDe, portesDuJour, type Patronage } from './patronages';
import { significationDe } from './prenoms';
import { clesDuJour, meteoDuJour } from './jourDuMagazine';
import { jourNomme } from './saintsDuJour';

export type EtatFicheAnnee = 'prete' | 'amorcee' | 'a-documenter';

/**
 * **CE QU'EST LA JOURNÉE.**
 *
 * - `personne` — un prénom : sa fiche se documente comme une biographie.
 * - `fete` — un jour de fête (la Toussaint, l'Assomption, les armistices) : sa
 *   fiche est **un texte**, pas un prénom, et elle ne se documente pas de la
 *   même façon. Ce n'est pas un manque : c'est une autre nature.
 * - `joker` — le jour de trop, qui n'appartient à aucune semaine.
 */
export type CategorieDuJour = 'personne' | 'fete' | 'joker';

export interface FicheDeLAnnee {
  /** `MM-JJ`. */
  jour: string;
  dateLongue: string;
  /** Le nom du calendrier : « Matthieu », « Jour de l’An ». */
  fete: string;
  /** Le personnage qui ouvre le jour : le profil s'il existe, sinon la fête. */
  personnage: string;
  /** La légende du personnage, quand ce n'est pas la fête elle-même. */
  enCeJourDe: string | null;

  /* — ce que le magazine calcule — */
  saison: { nom: string; symbole: string; fond: string };
  fond: string;
  dense: boolean;
  pasCommeLesAutres: boolean;
  raison: string;
  carte: string;
  semaine: number;
  numero: number;
  ciel: string;
  lune: string;
  chiffre: number;

  /* — ce que les sources donnent — */
  signification: string | null;
  metiers: string[];
  portes: string[];
  patronages: Patronage[];

  /* — ce que la fiche documentée donne, quand elle existe — */
  historique: Fiche | null;
  ponts: Pont[];
  casting: Casting | null;
  inspirations: string[];
  source: string | null;

  /** Ce qu'est la journée : une personne, une fête, ou le joker. */
  categorie: CategorieDuJour;
  etat: EtatFicheAnnee;
  /** Ce qui manque, nommé — jamais un vide silencieux. */
  manquant: string[];
}

const CHAMPS_HISTORIQUES = 'origine, époque, lieu, métier, savoir-faire, culture';

export function ficheDuJour(date: Date): FicheDeLAnnee {
  const jour = cleDuJour(date);
  const couverture = couvertureDuJour(date);
  const profil = PROFILS[jour] ?? null;
  const etat = etatDuJour(date);

  /* Le personnage : le profil s'il existe, sinon la fête du calendrier. */
  const personnage = profil?.personnage ?? couverture.nom;
  const memeNom = personnage.toLowerCase() === couverture.nom.toLowerCase();

  const patronages: Patronage[] = profil ? patronagesDe(profil.personnage) : patronagesDe(couverture.nom);
  const sens = profil?.signification ?? significationDe(profil?.personnage ?? couverture.nom);

  const manquant: string[] = [];
  if (!profil) {
    manquant.push(`la fiche documentée : ${CHAMPS_HISTORIQUES}`);
    manquant.push('les ponts vers le mariage');
  } else {
    if (!profil.signification) manquant.push('la signification du prénom');
    if (!profil.casting) manquant.push('la direction de casting');
    if (!profil.inspirations || profil.inspirations.length === 0) manquant.push('les inspirations');
  }
  if (patronages.length === 0) manquant.push('le métier, quand la tradition le donne');

  return {
    jour,
    dateLongue: couverture.dateLongue,
    fete: couverture.nom,
    personnage,
    enCeJourDe: profil && !memeNom ? couverture.titre === profil.personnage ? `en ce jour de ${couverture.nom}` : null : null,

    saison: { nom: couverture.saison.nom, symbole: couverture.saison.symbole, fond: couverture.saison.fond },
    fond: couverture.fond,
    dense: couverture.dense,
    pasCommeLesAutres: couverture.pasCommeLesAutres,
    raison: couverture.raison,
    carte: couverture.figure,
    semaine: couverture.semaine,
    numero: couverture.numero,
    ciel: meteoDuJour(date).ciel,
    lune: `${clesDuJour(date).lune.nom}, jour ${clesDuJour(date).lune.jour}`,
    chiffre: clesDuJour(date).chiffre.nombre,

    signification: sens,
    metiers: patronages.map((p) => p.metier),
    portes: portesDuJour(profil?.personnage ?? couverture.nom),
    patronages,

    historique: profil?.fiche ?? null,
    ponts: profil?.ponts ?? [],
    casting: profil?.casting ?? null,
    inspirations: profil?.inspirations ?? [],
    source: profil?.source ?? null,

    categorie: categorieDuJour(date),
    etat,
    manquant,
  };
}

/** La nature d'un jour : calculée du calendrier, jamais devinée. */
export function categorieDuJour(date: Date): CategorieDuJour {
  const j = jourNomme(date);
  if (!j) return 'joker';
  return j.genre === 'fete' ? 'fete' : 'personne';
}

/** L'état d'un jour — calculé, jamais deviné. */
export function etatDuJour(date: Date): EtatFicheAnnee {
  const profil = PROFILS[cleDuJour(date)];
  if (profil && profil.casting && profil.signification && profil.inspirations?.length) return 'prete';
  const couverture = couvertureDuJour(date);
  const nom = profil?.personnage ?? couverture.nom;
  if (significationDe(nom) || patronagesDe(nom).length > 0) return 'amorcee';
  return 'a-documenter';
}

/** Les 365 fiches d'une année, dans l'ordre. */
export function fichesDeLAnnee(annee: number): FicheDeLAnnee[] {
  const fiches: FicheDeLAnnee[] = [];
  for (let mois = 1; mois <= 12; mois += 1) {
    const dernier = new Date(annee, mois, 0).getDate();
    for (let quantieme = 1; quantieme <= dernier; quantieme += 1) {
      fiches.push(ficheDuJour(new Date(annee, mois - 1, quantieme)));
    }
  }
  return fiches;
}

export interface EtatDeLAnnee {
  jours: number;
  pretes: number;
  amorcees: number;
  aDocumenter: number;
  avecEtymologie: number;
  avecMetier: number;
  portes: number;
  /** Les journées qui sont des fêtes, et non des personnes. */
  fetes: number;
  parMois: Array<{ mois: number; nom: string; pretes: number; amorcees: number; aDocumenter: number; jours: number }>;
}

/** Le tableau de bord de l'année : ce qui est prêt, ce qui attend. */
export function etatDeLAnnee(annee: number): EtatDeLAnnee {
  const fiches = fichesDeLAnnee(annee);
  const compte = (e: EtatFicheAnnee) => fiches.filter((f) => f.etat === e).length;
  return {
    jours: fiches.length,
    pretes: compte('prete'),
    amorcees: compte('amorcee'),
    aDocumenter: compte('a-documenter'),
    avecEtymologie: fiches.filter((f) => f.signification).length,
    avecMetier: fiches.filter((f) => f.metiers.length > 0).length,
    portes: new Set(fiches.flatMap((f) => f.portes)).size,
    fetes: fiches.filter((f) => f.categorie === 'fete').length,
    parMois: MOIS.map((m) => {
      const duMois = fiches.filter((f) => Number(f.jour.slice(0, 2)) === m.numero);
      return {
        mois: m.numero,
        nom: m.nom,
        pretes: duMois.filter((f) => f.etat === 'prete').length,
        amorcees: duMois.filter((f) => f.etat === 'amorcee').length,
        aDocumenter: duMois.filter((f) => f.etat === 'a-documenter').length,
        jours: duMois.length,
      };
    }),
  };
}

/** Les journées qui ont déjà une porte : métier documenté, ou ponts écrits. */
export function joursAvecPorte(annee: number): FicheDeLAnnee[] {
  return fichesDeLAnnee(annee).filter((f) => f.portes.length > 0 || f.ponts.length > 0);
}

/** La couche des métiers, telle qu'elle est transmise — pour les documents. */
export const METIERS_TRANSMIS = PATRONAGES;
