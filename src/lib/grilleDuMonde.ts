/* LE MONDE EN CASES — LA GRILLE COMME SEUL LANGAGE
 *
 * Il n'y a plus de pages : il y a **un espace de cases reliées**. Une case est
 * un objet navigable — un jour, une heure, un article, une photo, un morceau,
 * un lieu, une personne, un produit, un document — et toute case qui contient
 * quelque chose **ouvre un autre monde**. Le même moteur sert partout : le
 * calendrier, la musique, la boutique, les métiers, les gens.
 *
 * ```
 * 365 JOURS → LE JOUR (8 univers) → L'UNIVERS → LE CONTENU → LE DÉTAIL
 * ```
 *
 * Deux règles tiennent le fichier :
 *
 * 1. **Une seule source par donnée.** Rien n'est réécrit ici : les jours
 *    viennent de `semaines`, `saintsDuJour` et `jourDuMagazine`, les articles de
 *    `magazine`, la musique de `playlistDeLAnnee`, la boutique de `shopData`,
 *    les personnes de `personas`, les métiers de `metierPage`. Ce fichier ne
 *    fait que **découper le monde en cases**.
 * 2. **Aucune image n'est inventée ni empruntée.** On passe par le résolveur
 *    unique (`visuelsDuMagazine`) : s'il n'y a pas d'image, la case porte la
 *    couleur du magazine, et le dessin prend le relais dans la grille.
 */

import { HEURES, RUBRIQUES } from './aimeMoteur';
import { VISUELS_DU_MAGAZINE } from './bibliothequeMagazine';
import {
  ajustementDeRemplissage,
  colonnesDeLaGrille,
  densiteDeLaTaille,
  tailleDeLaCase,
} from './echelleDeLaGrille';
import { MOIS_LONGS } from './calendrier';
import { jourDuMagazine, meteoDuJour } from './jourDuMagazine';
import { lumiereDeLHeure } from './lumiereDuJour';
import { ALL_ARTICLES, relatedArticles } from './magazine';
import { pageMetier, slugDeRole, tousLesMetiers } from './metierPage';
import { PERSONNAGES, personnageParId, porteurDuDomaine } from './personas';
import { playlistDeLAnnee } from './playlistDeLAnnee';
import { jourNomme } from './saintsDuJour';
import {
  MAGAZINES,
  NOMBRE_DE_MAGAZINES,
  chapitreDeLaDate,
  magazineDeLaDate,
  niveauxDuJour,
} from './semaines';
import { SHOP_CATEGORIES, SHOP_PRODUCTS, productBySlug, similarProducts } from './shopData';
import { visuelDeLaCouverture, visuelDuChapitre, visuelsDuJour } from './visuelsDuMagazine';

/* ————————————————————————— À QUI LA CASE EST OUVERTE ————————————————————————— */

/** Le niveau d'ouverture d'une case — la grille dit aussi les droits. */
export type Famille = 'public' | 'invites' | 'famille' | 'prive';

/** Les quatre familles, et la marque qu'elles portent dans la grille. */
export const FAMILLES: Array<{ id: Famille; mot: string; marque: string }> = [
  { id: 'public', mot: 'public', marque: '○' },
  { id: 'invites', mot: 'invités', marque: '◔' },
  { id: 'famille', mot: 'famille', marque: '♥' },
  { id: 'prive', mot: 'privé', marque: '●' },
];

/* ——————————————————————————— CE QU'UNE CASE PORTE ——————————————————————————— */

/** Les modules universels : ce qu'une case peut contenir, et montrer. */
export type ModuleDeCase =
  | 'image'
  | 'texte'
  | 'video'
  | 'audio'
  | 'article'
  | 'produit'
  | 'personne'
  | 'lieu'
  | 'date'
  | 'meteo'
  | 'carte'
  | 'document'
  | 'galerie'
  | 'player'
  | 'prix'
  | 'bouton'
  | 'lien'
  | 'formulaire';

/** Tous les modules, dans l'ordre où on les cite. */
export const MODULES: ModuleDeCase[] = [
  'image', 'texte', 'video', 'audio', 'article', 'produit', 'personne', 'lieu',
  'date', 'meteo', 'carte', 'document', 'galerie', 'player', 'prix', 'bouton',
  'lien', 'formulaire',
];

/**
 * **UNE CASE.** Elle n'est jamais une carte : c'est une porte. Elle sait ce
 * qu'elle montre à chaque densité — une image, une date, un titre, un détail —
 * et elle sait ce qu'elle ouvre.
 */
export interface CaseDuMonde {
  /** Stable et unique dans son monde : `jour-09-20`, `heure-16`, `piste-12`. */
  id: string;
  /** Le titre : deux mots au plus. */
  titre: string;
  /** Ce qui s'écrit au-dessus — une date, une heure, un numéro. */
  surTitre?: string;
  /** Un seul niveau sous le titre — celui des densités fortes. */
  sousTitre?: string;
  /** Le détail, en lignes courtes : seulement à la densité maximale. */
  detail?: Array<{ label: string; valeur: string }>;
  /** L'image, quand elle est livrée. Sinon la couleur porte la case. */
  image?: string | null;
  /** La couleur de la case : le fond éditorial de son magazine. */
  couleur: string;
  /** L'encre du texte posé sur la case. */
  encre?: string;
  /** Le module principal de la case. */
  module: ModuleDeCase;
  /** À qui elle est ouverte. */
  famille: Famille;
  /** L'identifiant du monde qu'elle ouvre, quand c'est une porte. */
  ouvre?: string;
  /** L'adresse d'un objet du site, quand la case est un lien. */
  href?: string;
}

/** **UN MONDE** : les cases d'un même niveau, et ce qu'elles disent ensemble. */
export interface Monde {
  id: string;
  /** Le titre du monde, écrit court : « L'ANNÉE », « LE JOUR ». */
  titre: string;
  /** Ce qu'il contient, en une ligne. */
  sous: string;
  /** Le mot de la grille : ce qu'on parcourt ici. */
  quoi: string;
  cases: CaseDuMonde[];
}

/* ——————————————————————————————— LES OUTILS ——————————————————————————————— */

const ENCRE_SOMBRE = '#0B0C12';
const ENCRE_CLAIRE = '#F4F5FB';

/** Les deux couleurs d'un magazine — jamais inventées. */
function teinte(numero: number): { fond: string; accent: string } {
  const magazine = MAGAZINES[Math.min(NOMBRE_DE_MAGAZINES, Math.max(1, numero)) - 1]!;
  return magazine.palette;
}

/** `MM-JJ` — la clé d'un jour, celle de l'adresse. */
export function cleDuJour(date: Date): string {
  return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/** Le jour d'une clé `MM-JJ`, dans l'année qu'on regarde. */
export function jourDeLaCle(cle: string, annee: number): Date | null {
  const [mois, quantieme] = cle.split('-').map((n) => Number.parseInt(n, 10));
  if (!mois || !quantieme || mois < 1 || mois > 12 || quantieme < 1 || quantieme > 31) return null;
  return new Date(annee, mois - 1, quantieme);
}

/** `20 SEPT.` — la date comme une case la dit. */
function dateCourte(date: Date): string {
  return `${date.getDate()} ${MOIS_LONGS[date.getMonth()]!.slice(0, 4).toUpperCase()}.`;
}

/** Ce que la date porte déjà : le magazine, le chapitre, la saison, la météo. */
function etatDuJour(date: Date) {
  const niveaux = niveauxDuJour(date);
  const magazine = magazineDeLaDate(date);
  const chapitre = chapitreDeLaDate(date);
  const nomme = jourNomme(date);
  return {
    niveaux,
    magazine,
    chapitre,
    nomDuJour: nomme?.nom ?? 'LE JOUR DE TROP',
    couleurs: magazine.palette,
  };
}

/** L'image d'un jour : son chapitre d'abord, sa couverture ensuite, sinon rien. */
function imageDuJour(date: Date): string | null {
  const visuels = visuelsDuJour(date);
  return visuels.imageDuChapitre.url ?? visuels.couverture.url ?? null;
}

/** La case d'un jour de l'année — la première porte de tout le système. */
export function caseDUnJour(date: Date): CaseDuMonde {
  const etat = etatDuJour(date);
  const meteo = meteoDuJour(date);
  return {
    id: `jour-${cleDuJour(date)}`,
    surTitre: `${dateCourte(date)} ${date.getFullYear()}`.trim(),
    titre: etat.nomDuJour.toUpperCase(),
    sousTitre: `${etat.magazine.titre} · ${etat.chapitre.chapitre.titre}`,
    detail: [
      { label: 'MAGAZINE', valeur: String(etat.magazine.numero) },
      { label: 'CHAPITRE', valeur: `${String(etat.chapitre.numero).padStart(2, '0')} · ${etat.chapitre.chapitre.titre}` },
      { label: 'SAISON', valeur: etat.magazine.saison.nom },
      { label: 'MÉTÉO', valeur: meteo.resume },
    ],
    image: imageDuJour(date),
    couleur: etat.couleurs.fond,
    encre: ENCRE_SOMBRE,
    module: 'date',
    famille: 'public',
    ouvre: `jour-${cleDuJour(date)}`,
  };
}

/* ————————————————————————— LES HUIT UNIVERS DU JOUR ————————————————————————— */

/**
 * Les huit univers d'un jour, dans l'ordre. Chacun est adossé à un chapitre du
 * magazine — c'est ce qui lui donne son image, sa couleur et sa cohérence.
 */
export const UNIVERS_DU_JOUR: Array<{
  cle: string;
  titre: string;
  module: ModuleDeCase;
  chapitre: number;
  quoi: string;
}> = [
  { cle: 'histoire', titre: 'HISTOIRE', module: 'texte', chapitre: 7, quoi: 'ce que le jour raconte' },
  { cle: 'voyage', titre: 'VOYAGE', module: 'lieu', chapitre: 6, quoi: 'où cela nous emmène' },
  { cle: 'meteo', titre: 'MÉTÉO', module: 'meteo', chapitre: 5, quoi: 'le ciel et la lumière' },
  { cle: 'mariage', titre: 'MARIAGE', module: 'date', chapitre: 1, quoi: 'les sept chapitres de la semaine' },
  { cle: 'musique', titre: 'MUSIQUE', module: 'audio', chapitre: 5, quoi: 'ce qui se danse ce jour-là' },
  { cle: 'lieux', titre: 'LIEUX', module: 'lieu', chapitre: 3, quoi: 'les destinations du magazine' },
  { cle: 'people', titre: 'PEOPLE', module: 'personne', chapitre: 2, quoi: 'ceux qui font le mariage' },
  { cle: 'evenements', titre: 'ÉVÉNEMENTS', module: 'carte', chapitre: 4, quoi: 'les huit rubriques du jour' },
];

/** L'univers d'une clé, ou `null`. */
export function universDeLaCle(cle: string) {
  return UNIVERS_DU_JOUR.find((u) => u.cle === cle) ?? null;
}

/* ——————————————————————————— LE JOURNAL DES CASES ——————————————————————————— */

/** Une case simple : on ne remplit que ce qu'on sait. */
function caseSimple(
  id: string,
  titre: string,
  module: ModuleDeCase,
  couleur: string,
  reste: Partial<CaseDuMonde> = {},
): CaseDuMonde {
  return { id, titre, module, couleur, encre: ENCRE_CLAIRE, famille: 'public', ...reste };
}

/* ————————————————————————————— L'OUVERTURE ————————————————————————————— */

/**
 * **L'ouverture** : les grandes portes du monde. On arrive devant tout le
 * contenu — les 365 jours, les 54 magazines, les articles, la musique, la
 * boutique, les métiers, les gens — et l'on entre par où l'on veut.
 */
export function mondeDOuverture(date: Date = new Date()): Monde {
  const etat = etatDuJour(date);
  const couverture = visuelDeLaCouverture(etat.magazine.numero).url;
  const image = (numero: number, chapitre?: number) =>
    chapitre ? (visuelDuChapitre(numero, chapitre).url ?? visuelDeLaCouverture(numero).url) : visuelDeLaCouverture(numero).url;

  return {
    id: 'monde',
    titre: 'LE MONDE',
    sous: 'tout le contenu, en cases',
    quoi: 'les portes',
    cases: [
      caseSimple('porte-annee', 'L’ANNÉE', 'date', teinte(38).fond, {
        surTitre: '365 JOURS',
        sousTitre: 'un jour, un magazine, sept chapitres',
        image: couverture,
        ouvre: 'annee',
        detail: [{ label: 'CASES', valeur: '365' }, { label: 'FORMATION', valeur: 'un jour par case' }],
      }),
      caseSimple('porte-magazines', 'LES 54', 'image', teinte(12).fond, {
        surTitre: 'LA COLLECTION',
        sousTitre: 'cinquante-quatre magazines, sept chapitres chacun',
        image: visuelDeLaCouverture(12).url,
        ouvre: 'magazines',
        detail: [{ label: 'MAGAZINES', valeur: '54' }, { label: 'CHAPITRES', valeur: '378' }],
      }),
      caseSimple('porte-jour', etat.niveaux.date.toUpperCase(), 'date', etat.couleurs.fond, {
        surTitre: 'LE JOUR',
        sousTitre: `${etat.magazine.titre} · ${etat.chapitre.chapitre.titre}`,
        image: imageDuJour(date),
        ouvre: `jour-${cleDuJour(date)}`,
        detail: [
          { label: 'MAGAZINE', valeur: etat.magazine.etiquette },
          { label: 'CHAPITRE', valeur: etat.chapitre.titreComplet },
        ],
      }),
      caseSimple('porte-heures', 'LES 24 HEURES', 'image', teinte(20).fond, {
        surTitre: 'LA JOURNÉE',
        sousTitre: 'de minuit à vingt-trois heures, la même image',
        image: imageDuJour(date),
        ouvre: 'heures',
      }),
      caseSimple('porte-articles', 'LES ARTICLES', 'article', teinte(4).fond, {
        surTitre: 'LA RÉDACTION',
        sousTitre: `${ALL_ARTICLES.length} articles, à lire`,
        image: ALL_ARTICLES[0]?.cover ?? null,
        ouvre: 'articles',
      }),
      caseSimple('porte-musique', 'LA MUSIQUE', 'audio', teinte(26).fond, {
        surTitre: 'LA PLAYLIST',
        sousTitre: 'trois cent soixante-cinq morceaux',
        image: image(26, 5),
        ouvre: 'musique',
      }),
      caseSimple('porte-boutique', 'LA BOUTIQUE', 'produit', teinte(30).fond, {
        surTitre: 'LE SHOP',
        sousTitre: `${SHOP_PRODUCTS.length} objets, à louer ou à garder`,
        image: SHOP_PRODUCTS[0]?.image ?? null,
        ouvre: 'boutique',
      }),
      caseSimple('porte-metiers', 'LES MÉTIERS', 'personne', teinte(40).fond, {
        surTitre: 'LES PROFESSIONNELS',
        sousTitre: 'ceux qui tiennent le jour J',
        image: porteurDuDomaine('photo')?.image ?? null,
        ouvre: 'metiers',
      }),
      caseSimple('porte-personnes', 'LES GENS', 'personne', teinte(9).fond, {
        surTitre: 'LES RÔLES',
        sousTitre: 'les mariés, les témoins, la famille, les invités',
        image: PERSONNAGES[0]?.image ?? null,
        ouvre: 'personnes',
      }),
      caseSimple('porte-galerie', 'LES IMAGES', 'galerie', teinte(44).fond, {
        surTitre: 'LA GALERIE',
        sousTitre: 'tout ce qui est livré, image par image',
        image: image(44),
        ouvre: 'galerie',
      }),
    ],
  };
}

/* ————————————————————————————— L'ANNÉE ————————————————————————————— */

/**
 * **Les 365 jours.** Chaque case est un jour, et chaque jour ouvre son monde.
 * C'est la vue d'ensemble : images principalement, dates quand on s'approche.
 */
export function mondeDeLAnnee(date: Date = new Date()): Monde {
  const annee = date.getFullYear();
  const cases: CaseDuMonde[] = [];
  const curseur = new Date(annee, 0, 1);
  while (curseur.getFullYear() === annee) {
    cases.push(caseDUnJour(new Date(curseur)));
    curseur.setDate(curseur.getDate() + 1);
  }
  return {
    id: 'annee',
    titre: 'L’ANNÉE',
    sous: `${cases.length} jours`,
    quoi: 'un jour par case',
    cases,
  };
}

/* —————————————————————————————— LE JOUR —————————————————————————————— */

/**
 * **Le jour** : ses huit univers, et la porte des vingt-quatre heures. C'est le
 * deuxième niveau du zoom — on est entré dans une case, et elle contient un
 * monde.
 */
export function mondeDuJour(date: Date = new Date()): Monde {
  const etat = etatDuJour(date);
  const cadre = etat.magazine.numero;

  const cases = UNIVERS_DU_JOUR.map((univers) => {
    const chapitre = MAGAZINES[cadre - 1]!.chapitres[univers.chapitre - 1]!;
    const image = visuelDuChapitre(cadre, univers.chapitre).url ?? visuelDeLaCouverture(cadre).url;
    return caseSimple(`univers-${univers.cle}`, univers.titre, univers.module, teinte(cadre).fond, {
      surTitre: univers.quoi.toUpperCase(),
      sousTitre: chapitre.sujet,
      image,
      ouvre: `univers-${univers.cle}`,
      detail: [
        { label: 'CHAPITRE', valeur: chapitre.titreComplet },
        { label: 'SUJET', valeur: chapitre.sujet },
      ],
    });
  });

  cases.push(
    caseSimple('porte-heures-du-jour', 'LES 24 HEURES', 'image', teinte(cadre).accent, {
      surTitre: 'LA JOURNÉE',
      sousTitre: 'l’heure par l’heure, et la lumière qui descend',
      image: imageDuJour(date),
      encre: ENCRE_SOMBRE,
      ouvre: 'heures',
    }),
  );

  return {
    id: `jour-${cleDuJour(date)}`,
    titre: etat.niveaux.date.toUpperCase(),
    sous: `${etat.magazine.titre} · ${etat.chapitre.chapitre.titre}`,
    quoi: 'les univers du jour',
    cases,
  };
}

/* ——————————————————————————— L'UNIVERS D'UN JOUR ——————————————————————————— */

/**
 * **Un univers**, pour un jour : ce qu'il contient vraiment. Tout vient des
 * données du site — le fil rouge du jour, sa météo, ses morceaux, ses lieux,
 * ses gens, ses rubriques.
 */
export function mondeDUnUnivers(cle: string, date: Date = new Date()): Monde {
  const etat = etatDuJour(date);
  const univers = universDeLaCle(cle) ?? UNIVERS_DU_JOUR[0]!;
  const cadre = etat.magazine.numero;
  const fond = teinte(cadre).fond;
  const jour = jourDuMagazine(date);

  const cases: CaseDuMonde[] = [];

  if (univers.cle === 'histoire') {
    cases.push(
      caseSimple('fil-rouge', 'LE FIL ROUGE', 'texte', fond, {
        surTitre: 'CE QUI RELIE LA JOURNÉE',
        sousTitre: jour.superSaint.regard,
        detail: [{ label: 'LE FIL', valeur: jour.superSaint.pourquoi }],
      }),
      caseSimple('super-saint', jour.superSaint.nom, 'personne', teinte(7).fond, {
        surTitre: 'L’ARCHITECTE DU JOUR',
        sousTitre: jour.superSaint.pourquoi,
      }),
      caseSimple('lune', jour.cles.lune.nom.toUpperCase(), 'meteo', teinte(2).fond, {
        surTitre: 'LA LUNE',
        sousTitre: `jour ${jour.cles.lune.jour}`,
      }),
      caseSimple('chiffre', `LE ${jour.cles.chiffre.nombre}`, 'texte', teinte(11).fond, {
        surTitre: 'LE CHIFFRE DU JOUR',
        sousTitre: jour.cles.chiffre.sens,
      }),
    );
    if (jour.cles.porte) {
      cases.push(caseSimple('porte-du-soleil', 'LA PORTE', 'date', teinte(16).fond, { surTitre: 'LE SEUIL', sousTitre: jour.cles.porte }));
    }
    if (jour.cles.signeCache) {
      cases.push(
        caseSimple('signe-cache', jour.cles.signeCache.nom.toUpperCase(), 'texte', teinte(33).fond, {
          surTitre: 'LE SIGNE RETIRÉ',
          sousTitre: jour.cles.signeCache.sens,
        }),
      );
    }
    jour.superSaint.heros.slice(0, 3).forEach((heros, i) => {
      cases.push(caseSimple(`heros-${i + 1}`, heros, 'personne', teinte(18 + i * 6).fond, { surTitre: 'MIS AU TRAVAIL' }));
    });
  }

  if (univers.cle === 'voyage' || univers.cle === 'lieux') {
    const autour = Array.from({ length: 8 }, (_, i) => ((cadre - 1 + i * 5) % NOMBRE_DE_MAGAZINES) + 1);
    autour.forEach((numero) => {
      const magazine = MAGAZINES[numero - 1]!;
      cases.push(
        caseSimple(`destination-${numero}`, magazine.titre.toUpperCase(), 'lieu', magazine.palette.fond, {
          surTitre: `SEMAINE ${numero}`,
          sousTitre: magazine.terroir,
          image: visuelDeLaCouverture(numero).url,
          encre: ENCRE_SOMBRE,
          ouvre: `magazine-${numero}`,
          detail: [
            { label: 'STYLE', valeur: magazine.style },
            { label: 'SAISON', valeur: magazine.saison.nom },
          ],
        }),
      );
    });
  }

  if (univers.cle === 'meteo') {
    const meteo = meteoDuJour(date);
    cases.push(
      caseSimple('ciel', meteo.ciel.toUpperCase(), 'meteo', fond, {
        surTitre: 'LE CIEL',
        sousTitre: meteo.resume,
      }),
      caseSimple('degres', `${meteo.min}° / ${meteo.max}°`, 'meteo', teinte(14).fond, { surTitre: 'LES DEGRÉS' }),
      caseSimple('ce-que-ca-change', 'CE QUE ÇA CHANGE', 'texte', teinte(22).fond, { surTitre: 'LE PLAN B', sousTitre: meteo.phrase }),
    );
    [6, 9, 12, 15, 18, 21].forEach((heure) => {
      const lumiere = lumiereDeLHeure(heure);
      cases.push(
        caseSimple(`lumiere-${heure}`, `${String(heure).padStart(2, '0')}:00`, 'image', fond, {
          surTitre: lumiere.mot ?? 'LA LUMIÈRE',
          sousTitre: `clarté ${Math.round(lumiere.clarte * 100)} %`,
          image: imageDuJour(date),
          encre: ENCRE_CLAIRE,
          ouvre: `heure-${heure}`,
        }),
      );
    });
  }

  if (univers.cle === 'mariage') {
    MAGAZINES[cadre - 1]!.chapitres.forEach((chapitre) => {
      cases.push(
        caseSimple(`chapitre-${cadre}-${chapitre.numero}`, chapitre.chapitre.titre.toUpperCase(), 'image', teinte(cadre).fond, {
          surTitre: `CHAPITRE ${String(chapitre.numero).padStart(2, '0')}`,
          sousTitre: chapitre.sujet,
          image: visuelDuChapitre(cadre, chapitre.numero).url ?? visuelDeLaCouverture(cadre).url,
          ouvre: `chapitre-${cadre}-${chapitre.numero}`,
          detail: [{ label: 'PONT', valeur: chapitre.pontMariage }],
        }),
      );
    });
  }

  if (univers.cle === 'musique') {
    const pistes = playlistDeLAnnee(date.getFullYear());
    const index = pistes.findIndex((p) => p.jour === cleDuJour(date));
    const autour = Array.from({ length: 8 }, (_, i) => pistes[(index + i * 3 + pistes.length) % pistes.length]!)
      .filter(Boolean);
    autour.forEach((piste) => {
      const rang = pistes.indexOf(piste) + 1;
      cases.push(
        caseSimple(`piste-${rang}`, piste.title.toUpperCase(), 'audio', teinte(((rang - 1) % NOMBRE_DE_MAGAZINES) + 1).fond, {
          surTitre: piste.artist,
          sousTitre: motDePhase(piste.phase),
          ouvre: `piste-${rang}`,
          detail: [
            { label: 'PHASE', valeur: motDePhase(piste.phase) },
            { label: 'JOUR', valeur: piste.jour },
          ],
        }),
      );
    });
  }

  if (univers.cle === 'people') {
    PERSONNAGES.slice(0, 12).forEach((personne) => {
      cases.push(
        caseSimple(`personne-${personne.id}`, personne.nom, 'personne', teinte(cadre).fond, {
          surTitre: personne.famille.toUpperCase(),
          sousTitre: personne.phrase,
          image: personne.image,
          ouvre: `personne-${personne.id}`,
        }),
      );
    });
  }

  if (univers.cle === 'evenements') {
    const pages = jour.edition.pages;
    RUBRIQUES.forEach((rubrique, i) => {
      const page = pages.find((p) => p.rubrique === rubrique);
      cases.push(
        caseSimple(`rubrique-${i + 1}`, rubrique.toUpperCase(), 'carte', teinte(3 + i * 6).fond, {
          surTitre: page ? `${String(page.heure).padStart(2, '0')}:00` : 'L’ÉDITION',
          sousTitre: page?.titre,
          image: imageDuJour(date),
          ouvre: `rubrique-${i + 1}`,
        }),
      );
    });
  }

  return {
    id: `univers-${univers.cle}`,
    titre: univers.titre,
    sous: `${etat.niveaux.date} · ${univers.quoi}`,
    quoi: univers.quoi,
    cases,
  };
}

/* ——————————————————————————— LES 24 HEURES ——————————————————————————— */

/** **Une journée en vingt-quatre cases** : la même image, vingt-quatre lumières. */
export function mondeDesHeures(date: Date = new Date()): Monde {
  const cadre = magazineDeLaDate(date).numero;
  const image = imageDuJour(date);
  const cases: CaseDuMonde[] = Array.from({ length: 24 }, (_, heure) => {
    const lumiere = lumiereDeLHeure(heure);
    return caseSimple(`heure-${heure}`, nomDeLHeure(heure), 'image', teinte(cadre).fond, {
      surTitre: `${String(heure).padStart(2, '0')}:00`,
      sousTitre: lumiere.mot ?? momentDeLHeure(heure),
      image,
      encre: lumiere.clarte < 0.55 ? ENCRE_CLAIRE : ENCRE_SOMBRE,
      ouvre: `heure-${heure}`,
      detail: [
        { label: 'LUMIÈRE', valeur: lumiere.mot ?? 'la lumière ordinaire' },
        { label: 'CLARTÉ', valeur: `${Math.round(lumiere.clarte * 100)} %` },
      ],
    });
  });
  return { id: 'heures', titre: 'LES 24 HEURES', sous: `${date.getDate()} ${MOIS_LONGS[date.getMonth()]}`, quoi: 'une heure par case', cases };
}

/** Le nom d'une heure, tel qu'il s'écrit dans la journée — jamais réécrit ici. */
function nomDeLHeure(heure: number): string {
  return (HEURES[((heure % 24) + 24) % 24]?.nom ?? `${heure} heures`).toUpperCase();
}

/** Le moment d'une heure : ce que la journée y fait. */
function momentDeLHeure(heure: number): string {
  return HEURES[((heure % 24) + 24) % 24]?.moment ?? 'l’heure';
}

/**
 * **La page d'une heure** : ses modules. On est au dernier niveau — la case
 * n'ouvre plus un monde, elle étale son contenu.
 */
export function mondeDUneHeure(heure: number, date: Date = new Date()): Monde {
  const jour = jourDuMagazine(date);
  const page = jour.edition.pages[((heure % 24) + 24) % 24]!;
  const cadre = magazineDeLaDate(date).numero;
  const image = imageDuJour(date);
  const lumiere = lumiereDeLHeure(heure);
  const pistes = playlistDeLAnnee(date.getFullYear());
  const piste = pistes[heuristiqueDeLaPiste(date, heure, pistes.length) - 1] ?? pistes[0]!;
  const produit = SHOP_PRODUCTS[(heure * 7) % SHOP_PRODUCTS.length]!;

  return {
    id: `heure-${heure}`,
    titre: nomDeLHeure(heure),
    sous: `${String(heure).padStart(2, '0')}:00 · ${page.rubrique}`,
    quoi: 'les modules de la page',
    cases: [
      caseSimple('module-image', (lumiere.mot ?? page.nomDeLHeure).toUpperCase(), 'image', teinte(cadre).fond, {
        surTitre: `${String(heure).padStart(2, '0')}:00`,
        sousTitre: lumiere.mot ? `clarté ${Math.round(lumiere.clarte * 100)} %` : page.lumiere,
        detail: [{ label: 'MOMENT', valeur: momentDeLHeure(heure) }],
        image,
      }),
      caseSimple('module-texte', page.titre.toUpperCase(), 'texte', teinte(cadre).accent, {
        surTitre: page.rubrique.toUpperCase(),
        sousTitre: page.texte,
        encre: ENCRE_SOMBRE,
        detail: [{ label: 'SOURCE', valeur: page.source }],
      }),
      caseSimple('module-musique', piste.title.toUpperCase(), 'audio', teinte(26).fond, {
        surTitre: 'LA MUSIQUE',
        sousTitre: `${piste.artist} · ${motDePhase(piste.phase)}`,
        ouvre: `piste-${pistes.indexOf(piste) + 1}`,
      }),
      caseSimple('module-produit', produit.name.toUpperCase(), 'produit', teinte(30).fond, {
        surTitre: 'L’OBJET',
        sousTitre: `${produit.price} ${produit.unit}`,
        image: produit.image,
        ouvre: `produit-${produit.slug}`,
      }),
      caseSimple('module-carte', 'LA CARTE POSTALE', 'carte', teinte(21).fond, {
        surTitre: 'À ENVOYER',
        sousTitre: etatDuJour(date).niveaux.dateLongue,
        image,
      }),
      caseSimple('module-formulaire', 'RSVP', 'formulaire', teinte(35).fond, {
        surTitre: 'RÉPONDRE',
        sousTitre: 'dire oui, dire non, dire combien',
      }),
      caseSimple('module-lien', 'LA SUITE', 'lien', teinte(44).fond, {
        surTitre: 'LA PAGE SUIVANTE',
        sousTitre: 'entrer dans le magazine de la semaine',
        href: '/magazine',
      }),
    ],
  };
}

/** Un rang de piste stable pour une heure donnée — la même page, le même son. */
function heuristiqueDeLaPiste(date: Date, heure: number, total: number): number {
  const jour = jourDuMagazine(date).ordinal;
  return ((jour * 24 + heure) % total) + 1;
}

/* ————————————————————— LES MONDES D'UN OBJET (DÉTAIL) ————————————————————— */

/** Les sept chapitres d'un magazine, sa couverture, et ses voisins. */
export function mondeDUnMagazine(numero: number, date: Date = new Date()): Monde {
  const cetteSemaine = magazineDeLaDate(date).numero;
  const magazine = MAGAZINES[Math.min(NOMBRE_DE_MAGAZINES, Math.max(1, numero)) - 1]!;
  const cases: CaseDuMonde[] = [
    caseSimple('couverture', magazine.titre.toUpperCase(), 'image', magazine.palette.fond, {
      surTitre: 'LA COUVERTURE',
      sousTitre: magazine.resume,
      image: visuelDeLaCouverture(numero).url,
      encre: ENCRE_SOMBRE,
      detail: [
        { label: 'STYLE', valeur: magazine.style },
        { label: 'LUMIÈRE', valeur: magazine.lumiere },
        { label: 'CETTE SEMAINE', valeur: numero === cetteSemaine ? 'oui' : 'non' },
      ],
    }),
  ];
  magazine.chapitres.forEach((chapitre) => {
    cases.push(
      caseSimple(`chapitre-${numero}-${chapitre.numero}`, chapitre.chapitre.titre.toUpperCase(), 'image', magazine.palette.fond, {
        surTitre: `CHAPITRE ${String(chapitre.numero).padStart(2, '0')}`,
        sousTitre: chapitre.sujet,
        image: visuelDuChapitre(numero, chapitre.numero).url ?? visuelDeLaCouverture(numero).url,
        encre: ENCRE_SOMBRE,
        ouvre: `chapitre-${numero}-${chapitre.numero}`,
      }),
    );
  });
  [-1, 1].forEach((pas) => {
    const voisin = ((numero - 1 + pas + NOMBRE_DE_MAGAZINES) % NOMBRE_DE_MAGAZINES) + 1;
    cases.push(
      caseSimple(`magazine-${voisin}`, MAGAZINES[voisin - 1]!.titre.toUpperCase(), 'image', MAGAZINES[voisin - 1]!.palette.fond, {
        surTitre: pas < 0 ? 'LE PRÉCÉDENT' : 'LE SUIVANT',
        sousTitre: MAGAZINES[voisin - 1]!.style,
        image: visuelDeLaCouverture(voisin).url,
        encre: ENCRE_SOMBRE,
        ouvre: `magazine-${voisin}`,
      }),
    );
  });
  return { id: `magazine-${numero}`, titre: magazine.titre.toUpperCase(), sous: `magazine ${numero} · ${magazine.saison.nom}`, quoi: 'les chapitres', cases };
}

/** Un chapitre d'un magazine : son image, son sujet, et ce qu'il appelle. */
export function mondeDUnChapitre(numero: number, chapitre: number, date: Date = new Date()): Monde {
  const chapitreDuJour = chapitreDeLaDate(date);
  const magazine = MAGAZINES[Math.min(NOMBRE_DE_MAGAZINES, Math.max(1, numero)) - 1]!;
  const c = magazine.chapitres[Math.min(7, Math.max(1, chapitre)) - 1]!;
  const visuel = visuelDuChapitre(numero, chapitre);
  const cases: CaseDuMonde[] = [
    caseSimple('image-du-chapitre', c.sujet.toUpperCase(), 'image', magazine.palette.fond, {
      surTitre: c.titreComplet.toUpperCase(),
      sousTitre: visuel.raison,
      image: visuel.url ?? visuelDeLaCouverture(numero).url,
      encre: ENCRE_SOMBRE,
      detail: [{ label: 'BRIEF', valeur: c.brief }],
    }),
    caseSimple('pont-mariage', 'LE PONT', 'texte', magazine.palette.accent, {
      surTitre: 'VERS LE MARIAGE',
      sousTitre: c.pontMariage,
      encre: ENCRE_SOMBRE,
    }),
    caseSimple('photo-du-jour', 'LA PHOTOGRAPHIE', 'galerie', magazine.palette.fond, {
      surTitre: 'CE QU’ON REGARDE',
      sousTitre: magazine.matiere,
      image: visuel.url,
      encre: ENCRE_SOMBRE,
    }),
    caseSimple('aujourd-hui', `CHAPITRE ${String(chapitreDuJour.numero).padStart(2, '0')}`, 'date', magazine.palette.accent, {
      surTitre: 'AUJOURD’HUI',
      sousTitre:
        numero === magazineDeLaDate(date).numero && chapitre === chapitreDuJour.numero
          ? 'c’est le chapitre du jour'
          : `ce jour-là, c’est ${chapitreDuJour.chapitre.titre}`,
      encre: ENCRE_SOMBRE,
      ouvre: `chapitre-${magazineDeLaDate(date).numero}-${chapitreDuJour.numero}`,
    }),
  ];
  if (chapitre > 1) {
    cases.push(
      caseSimple(`chapitre-${numero}-${chapitre - 1}`, magazine.chapitres[chapitre - 2]!.chapitre.titre.toUpperCase(), 'image', magazine.palette.fond, {
        surTitre: 'LE CHAPITRE D’AVANT',
        sousTitre: magazine.chapitres[chapitre - 2]!.sujet,
        image: visuelDuChapitre(numero, chapitre - 1).url ?? null,
        encre: ENCRE_SOMBRE,
        ouvre: `chapitre-${numero}-${chapitre - 1}`,
      }),
    );
  }
  if (chapitre < 7) {
    cases.push(
      caseSimple(`chapitre-${numero}-${chapitre + 1}`, magazine.chapitres[chapitre]!.chapitre.titre.toUpperCase(), 'image', magazine.palette.fond, {
        surTitre: 'LE CHAPITRE D’APRÈS',
        sousTitre: magazine.chapitres[chapitre]!.sujet,
        image: visuelDuChapitre(numero, chapitre + 1).url ?? null,
        encre: ENCRE_SOMBRE,
        ouvre: `chapitre-${numero}-${chapitre + 1}`,
      }),
    );
  }
  return { id: `chapitre-${numero}-${chapitre}`, titre: c.chapitre.titre.toUpperCase(), sous: `magazine ${numero} · chapitre ${String(chapitre).padStart(2, '0')}`, quoi: 'le chapitre', cases };
}

/* ———————————————————————————— LES ARTICLES ———————————————————————————— */

/** **Tous les articles** de la rédaction, une case chacun. */
export function mondeDesArticles(): Monde {
  return {
    id: 'articles',
    titre: 'LES ARTICLES',
    sous: `${ALL_ARTICLES.length} textes`,
    quoi: 'un article par case',
    cases: ALL_ARTICLES.map((article, i) =>
      caseSimple(`article-${article.slug}`, article.title.toUpperCase(), 'article', teinte(3 + (i % 30)).fond, {
        surTitre: article.category === 'univers' ? 'UNIVERS' : article.category === 'guide' ? 'GUIDE' : 'INSOLITE',
        sousTitre: `${article.readingMinutes} min · ${article.kicker}`,
        image: article.cover,
        encre: ENCRE_SOMBRE,
        ouvre: `article-${article.slug}`,
        href: `/magazine/${article.slug}`,
        detail: article.essentiel.map((e) => ({ label: e.label.toUpperCase(), valeur: e.value })),
      }),
    ),
  };
}

/** **Un article** : sa couverture, son essentiel, ses sections, ses voisins. */
export function mondeDUnArticle(slug: string): Monde {
  const article = ALL_ARTICLES.find((a) => a.slug === slug) ?? ALL_ARTICLES[0]!;
  const cases: CaseDuMonde[] = [
    caseSimple('couverture', article.title.toUpperCase(), 'article', teinte(5).fond, {
      surTitre: article.kicker.toUpperCase(),
      sousTitre: `${article.readingMinutes} min de lecture`,
      image: article.cover,
      encre: ENCRE_SOMBRE,
      detail: article.essentiel.map((e) => ({ label: e.label.toUpperCase(), valeur: e.value })),
    }),
  ];
  article.sections.slice(0, 8).forEach((section, i) => {
    cases.push(
      caseSimple(`section-${i + 1}`, section.heading.toUpperCase(), 'texte', teinte(8 + i * 4).fond, {
        surTitre: `PAGE ${i + 1}`,
        sousTitre: section.body[0]?.replace(/\*\*/g, '').slice(0, 140),
        detail: section.body.slice(0, 2).map((p, j) => ({ label: `¶ ${j + 1}`, valeur: p.replace(/\*\*/g, '').slice(0, 160) })),
      }),
    );
  });
  relatedArticles(article, 3).forEach((voisin, i) => {
    cases.push(
      caseSimple(`voisin-${i + 1}`, voisin.title.toUpperCase(), 'article', teinte(20 + i * 7).fond, {
        surTitre: 'À LIRE AUSSI',
        sousTitre: voisin.kicker,
        image: voisin.cover,
        encre: ENCRE_SOMBRE,
        ouvre: `article-${voisin.slug}`,
        href: `/magazine/${voisin.slug}`,
      }),
    );
  });
  return { id: `article-${article.slug}`, titre: article.title.toUpperCase(), sous: article.kicker, quoi: 'les pages de l’article', cases };
}

/* ————————————————————————————— LA MUSIQUE ————————————————————————————— */

/** Les neuf phases de la soirée, et leur mot. */
export const MOTS_DE_PHASE: Record<string, string> = {
  prelude_ceremonie: 'PRÉLUDE',
  cocktail: 'COCKTAIL',
  entree_maries: 'ENTRÉE DES MARIÉS',
  diner_toasts: 'DÎNER',
  gateau: 'GÂTEAU',
  premiere_danse: 'PREMIÈRE DANSE',
  dancefloor_classics: 'PISTE',
  dancefloor_peak: 'PISTE — LA POINTE',
  closing: 'FIN DE NUIT',
};

/** Le mot d'une phase, sans surprise. */
export function motDePhase(phase: string): string {
  return MOTS_DE_PHASE[phase] ?? 'LA PLAYLIST';
}

/** **Les 365 morceaux de l'année**, un par jour. */
export function mondeDeLaMusique(date: Date = new Date()): Monde {
  const pistes = playlistDeLAnnee(date.getFullYear());
  return {
    id: 'musique',
    titre: 'LA MUSIQUE',
    sous: `${pistes.length} morceaux`,
    quoi: 'un morceau par jour',
    cases: pistes.map((piste, i) =>
      caseSimple(`piste-${i + 1}`, piste.title.toUpperCase(), 'audio', teinte(((i * 3) % NOMBRE_DE_MAGAZINES) + 1).fond, {
        surTitre: piste.artist,
        sousTitre: motDePhase(piste.phase),
        ouvre: `piste-${i + 1}`,
        detail: [{ label: 'PHASE', valeur: motDePhase(piste.phase) }, { label: 'JOUR', valeur: piste.jour }],
      }),
    ),
  };
}

/** **Un morceau** : sa pochette, l'écoute, l'artiste, la phase, la playlist, l'achat. */
export function mondeDUnePiste(rang: number, date: Date = new Date()): Monde {
  const pistes = playlistDeLAnnee(date.getFullYear());
  const index = Math.min(pistes.length, Math.max(1, rang)) - 1;
  const piste = pistes[index]!;
  const produit = SHOP_PRODUCTS.find((p) => /dj|son|musique|enceinte/i.test(`${p.name} ${p.category}`)) ?? SHOP_PRODUCTS[0]!;
  const cases: CaseDuMonde[] = [
    caseSimple('pochette', piste.title.toUpperCase(), 'audio', teinte(((index * 5) % NOMBRE_DE_MAGAZINES) + 1).fond, {
      surTitre: piste.artist,
      sousTitre: motDePhase(piste.phase),
      ouvre: `piste-${rang}`,
    }),
    caseSimple('ecouter', 'ÉCOUTER', 'player', teinte(9).fond, {
      surTitre: 'LE MORCEAU',
      sousTitre: `${piste.artist} — ${piste.title}`,
      image: visuelDeLaCouverture(((index * 7) % NOMBRE_DE_MAGAZINES) + 1).url,
      encre: ENCRE_SOMBRE,
    }),
    caseSimple('artiste', piste.artist.toUpperCase(), 'personne', teinte(31).fond, {
      surTitre: 'L’ARTISTE',
      sousTitre: motDePhase(piste.phase),
    }),
    caseSimple('phase', motDePhase(piste.phase), 'texte', teinte(17).fond, {
      surTitre: 'LE MOMENT DE LA SOIRÉE',
      sousTitre: `jour ${piste.jour}`,
    }),
    caseSimple('playlist', 'LA PLAYLIST', 'audio', teinte(42).fond, {
      surTitre: 'TOUTE L’ANNÉE',
      sousTitre: `${pistes.length} morceaux, un par jour`,
      ouvre: 'musique',
    }),
    caseSimple('acheter', produit.name.toUpperCase(), 'produit', teinte(36).fond, {
      surTitre: 'POUR L’ÉCOUTER',
      sousTitre: `${produit.price} ${produit.unit}`,
      image: produit.image,
      ouvre: `produit-${produit.slug}`,
    }),
  ];
  [-2, 2].forEach((pas) => {
    const voisin = (index + pas + pistes.length) % pistes.length;
    cases.push(
      caseSimple(`piste-${voisin + 1}`, pistes[voisin]!.title.toUpperCase(), 'audio', teinte(((voisin * 3) % NOMBRE_DE_MAGAZINES) + 1).fond, {
        surTitre: pas < 0 ? 'JUSTE AVANT' : 'JUSTE APRÈS',
        sousTitre: pistes[voisin]!.artist,
        ouvre: `piste-${voisin + 1}`,
      }),
    );
  });
  return { id: `piste-${rang}`, titre: piste.title.toUpperCase(), sous: piste.artist, quoi: 'le morceau', cases };
}

/* ————————————————————————————— LA BOUTIQUE ————————————————————————————— */

/** **Les objets de la boutique**, un par case, avec leur prix. */
export function mondeDeLaBoutique(): Monde {
  return {
    id: 'boutique',
    titre: 'LA BOUTIQUE',
    sous: `${SHOP_PRODUCTS.length} objets`,
    quoi: 'un objet par case',
    cases: SHOP_PRODUCTS.map((produit, i) =>
      caseSimple(`produit-${produit.slug}`, produit.name.toUpperCase(), 'produit', teinte(2 + (i % 40)).fond, {
        surTitre: produit.price,
        sousTitre: `${produit.unit} · ${produit.mode}`,
        image: produit.image,
        encre: ENCRE_SOMBRE,
        ouvre: `produit-${produit.slug}`,
        detail: produit.specs.map((s) => ({ label: s.label.toUpperCase(), valeur: s.value })),
      }),
    ),
  };
}

/** **Un objet** : son image, son prix, ce qu'il comprend, ses voisins, la caisse. */
export function mondeDUnProduit(slug: string): Monde {
  const produit = productBySlug(slug) ?? SHOP_PRODUCTS[0]!;
  const categorie = SHOP_CATEGORIES.find((c) => c.id === produit.category);
  const cases: CaseDuMonde[] = [
    caseSimple('objet', produit.name.toUpperCase(), 'produit', teinte(6).fond, {
      surTitre: categorie?.label.toUpperCase() ?? 'LA BOUTIQUE',
      sousTitre: produit.tagline,
      image: produit.image,
      encre: ENCRE_SOMBRE,
      detail: produit.specs.map((s) => ({ label: s.label.toUpperCase(), valeur: s.value })),
    }),
    caseSimple('prix', produit.price, 'prix', teinte(3).fond, {
      surTitre: 'LE PRIX',
      sousTitre: produit.unit,
      detail: [{ label: 'MODE', valeur: produit.mode }],
    }),
    caseSimple('comprend', 'CE QUI EST COMPRIS', 'document', teinte(28).fond, {
      surTitre: 'LA LISTE',
      sousTitre: produit.includes.slice(0, 3).join(' · '),
      detail: produit.includes.slice(0, 6).map((l, i) => ({ label: `${i + 1}`, valeur: l })),
    }),
    caseSimple('caisse', 'LE TICKET', 'carte', teinte(22).fond, {
      surTitre: 'LA CAISSE',
      sousTitre: `${produit.name} — ${produit.price} ${produit.unit}`,
      detail: produit.includes.slice(0, 4).map((l, i) => ({ label: `LIGNE ${i + 1}`, valeur: l })),
    }),
  ];
  similarProducts(produit, 4).forEach((voisin, i) => {
    cases.push(
      caseSimple(`produit-${voisin.slug}`, voisin.name.toUpperCase(), 'produit', teinte(12 + i * 8).fond, {
        surTitre: 'DANS LA MÊME ALLÉE',
        sousTitre: `${voisin.price} ${voisin.unit}`,
        image: voisin.image,
        encre: ENCRE_SOMBRE,
        ouvre: `produit-${voisin.slug}`,
      }),
    );
  });
  return { id: `produit-${produit.slug}`, titre: produit.name.toUpperCase(), sous: produit.tagline, quoi: 'l’objet', cases };
}

/* ————————————————————————— LES MÉTIERS ET LES GENS ————————————————————————— */

/** **Les métiers du mariage**, chacun avec son porteur. */
export function mondeDesMetiers(): Monde {
  const metiers = tousLesMetiers();
  return {
    id: 'metiers',
    titre: 'LES MÉTIERS',
    sous: `${metiers.length} métiers`,
    quoi: 'un métier par case',
    cases: metiers.map((metier, i) =>
      caseSimple(`metier-${slugDeRole(metier.role)}`, metier.role.toUpperCase(), 'personne', teinte(4 + (i % 44)).fond, {
        surTitre: metier.label.toUpperCase(),
        sousTitre: metier.short,
        image: porteurDuDomaine(metier.key)?.image ?? null,
        encre: ENCRE_SOMBRE,
        ouvre: `metier-${slugDeRole(metier.role)}`,
      }),
    ),
  };
}

/** **Un métier** : qui il est, sa mission, ses modules, son prix, son contact. */
export function mondeDUnMetier(slug: string): Monde {
  const premier = tousLesMetiers()[0]!;
  const metier = pageMetier(slug) ?? pageMetier(slugDeRole(premier.role))!;
  const porteur = porteurDuDomaine(metier.domaine.key);
  const cases: CaseDuMonde[] = [
    caseSimple('portrait', (porteur?.nom ?? metier.role).toUpperCase(), 'personne', teinte(8).fond, {
      surTitre: metier.domaine.label.toUpperCase(),
      sousTitre: metier.recit.annonce,
      image: porteur?.image ?? null,
      encre: ENCRE_SOMBRE,
    }),
    caseSimple('mission', 'LA MISSION', 'texte', teinte(24).fond, {
      surTitre: 'CE QU’IL TIENT',
      sousTitre: metier.mission?.mission ?? metier.recit.texte.slice(0, 160),
      detail: metier.mission ? [{ label: 'RÔLE', valeur: metier.mission.role }, { label: 'GESTE', valeur: metier.mission.essentialSkill }] : undefined,
    }),
    caseSimple('langue', 'SA LANGUE', 'document', teinte(37).fond, {
      surTitre: `${metier.modules.length} MODULES`,
      sousTitre: metier.modules.slice(0, 3).map((m) => m.nav).join(' · '),
      detail: metier.modules.slice(0, 6).map((m) => ({ label: m.nav.toUpperCase(), valeur: m.titre })),
    }),
    caseSimple('prix', `${metier.prix} €`, 'prix', teinte(2).fond, {
      surTitre: 'SON PRIX',
      sousTitre: metier.rayon?.label ?? 'le ticket du mariage',
    }),
    caseSimple('contact', 'LE CONTACTER', 'formulaire', teinte(41).fond, {
      surTitre: 'DISPONIBILITÉ',
      sousTitre: 'dire la date, le lieu, et ce qu’on cherche',
    }),
  ];
  metier.scenes.slice(0, 4).forEach((scene, i) => {
    cases.push(
      caseSimple(`scene-${i + 1}`, scene.title.toUpperCase(), 'date', teinte(13 + i * 9).fond, {
        surTitre: scene.time || 'LE JOUR J',
        sousTitre: scene.ambianceDetail,
        image: scene.image || null,
        encre: ENCRE_SOMBRE,
        detail: [{ label: 'SCÉNARIO', valeur: scene.narrativeScript.slice(0, 160) }],
      }),
    );
  });
  return { id: `metier-${metier.slug}`, titre: metier.role.toUpperCase(), sous: metier.domaine.label, quoi: 'le métier', cases };
}

/** **Les rôles du mariage** : les gens, leurs visages, leurs entrées. */
export function mondeDesPersonnes(): Monde {
  return {
    id: 'personnes',
    titre: 'LES GENS',
    sous: `${PERSONNAGES.length} rôles`,
    quoi: 'un rôle par case',
    cases: PERSONNAGES.map((personne, i) =>
      caseSimple(`personne-${personne.id}`, personne.nom, 'personne', teinte(5 + (i % 46)).fond, {
        surTitre: personne.famille.toUpperCase(),
        sousTitre: personne.phrase,
        image: personne.image,
        encre: ENCRE_SOMBRE,
        ouvre: `personne-${personne.id}`,
      }),
    ),
  };
}

/** **Une personne** : son portrait, ses entrées, son espace. */
export function mondeDUnePersonne(id: string): Monde {
  const personne = personnageParId(id) ?? PERSONNAGES[0]!;
  const cases: CaseDuMonde[] = [
    caseSimple('portrait', personne.nom, 'personne', teinte(10).fond, {
      surTitre: personne.titre.toUpperCase(),
      sousTitre: personne.phrase,
      image: personne.image,
      encre: ENCRE_SOMBRE,
    }),
    caseSimple('entrees', 'SON ESPACE', 'document', teinte(29).fond, {
      surTitre: 'CE QU’IL CONTIENT',
      sousTitre: personne.entrees.slice(0, 4).join(' · '),
      detail: personne.entrees.map((e, i) => ({ label: `${i + 1}`, valeur: e })),
    }),
    caseSimple('rsvp', 'RSVP', 'formulaire', teinte(35).fond, {
      surTitre: 'RÉPONDRE',
      sousTitre: 'présent, absent, et combien',
    }),
    caseSimple('carte', 'LA CARTE', 'carte', teinte(19).fond, { surTitre: 'SON INVITATION', image: personne.image }),
  ];
  return { id: `personne-${personne.id}`, titre: personne.nom, sous: personne.titre, quoi: 'la personne', cases };
}

/* ——————————————————————————— LA GALERIE, LE TEXTE ——————————————————————————— */

/** **Ce qui est livré**, image par image : la galerie ne montre rien d'autre. */
export function mondeDeLaGalerie(date: Date = new Date()): Monde {
  const cetteSemaine = magazineDeLaDate(date).numero;
  const cases: CaseDuMonde[] = [];
  Object.entries(VISUELS_DU_MAGAZINE)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([dossier, fichiers]) => {
      const numero = Number.parseInt(dossier.replace(/\D/g, ''), 10) || 1;
      fichiers.forEach((fichier, i) => {
        const nom = fichier.split('/').pop() ?? fichier;
        cases.push(
          caseSimple(`image-${dossier}-${i}`, nom.replace(/\.jpe?g$/i, '').toUpperCase(), 'image', teinte(numero).fond, {
            surTitre: `SEMAINE ${String(numero).padStart(2, '0')}`,
            sousTitre: numero === cetteSemaine ? 'cette semaine' : dossier,
            image: fichier,
            encre: ENCRE_SOMBRE,
          }),
        );
      });
    });
  return { id: 'galerie', titre: 'LES IMAGES', sous: `${cases.length} images livrées`, quoi: 'une image par case', cases };
}

/** Les huit rubriques d'un jour : trois pages chacune. */
export function mondeDUneRubrique(position: number, date: Date = new Date()): Monde {
  const jour = jourDuMagazine(date);
  const rubrique = RUBRIQUES[Math.min(RUBRIQUES.length, Math.max(1, position)) - 1]!;
  const pages = jour.edition.pages.filter((p) => p.rubrique === rubrique);
  const cadre = magazineDeLaMagazine(date);
  return {
    id: `rubrique-${position}`,
    titre: rubrique.toUpperCase(),
    sous: `${pages.length} pages · ${niveauxDuJour(date).date}`,
    quoi: 'les pages de la rubrique',
    cases: pages.map((page, i) =>
      caseSimple(`page-${page.heure}`, page.titre.toUpperCase(), 'article', teinte(cadre + i * 7).fond, {
        surTitre: `${String(page.heure).padStart(2, '0')}:00`,
        sousTitre: page.source,
        image: imageDuJour(date),
        encre: ENCRE_SOMBRE,
        ouvre: `heure-${page.heure}`,
      }),
    ),
  };
}

/** Le numéro du magazine d'un jour, sans détour. */
function magazineDeLaMagazine(date: Date): number {
  return magazineDeLaDate(date).numero;
}

/* ——————————————————————— LE RÉSOLVEUR : UN ID → UN MONDE ——————————————————————— */

/**
 * **Le seul point d'entrée.** Une adresse, un identifiant de monde, et la
 * grille sait quoi montrer. Un identifiant inconnu ne casse rien : on revient à
 * l'ouverture.
 */
export function mondeDeLId(id: string | null | undefined, date: Date = new Date()): Monde {
  if (!id) return mondeDOuverture(date);

  if (id === 'monde') return mondeDOuverture(date);
  if (id === 'annee') return mondeDeLAnnee(date);
  if (id === 'magazines') return mondeDesMagazines(date);
  if (id === 'heures') return mondeDesHeures(date);
  if (id === 'articles') return mondeDesArticles();
  if (id === 'musique') return mondeDeLaMusique(date);
  if (id === 'boutique') return mondeDeLaBoutique();
  if (id === 'metiers') return mondeDesMetiers();
  if (id === 'personnes') return mondeDesPersonnes();
  if (id === 'galerie') return mondeDeLaGalerie(date);

  const jour = /^jour-(\d{2})-(\d{2})$/.exec(id);
  if (jour) {
    const date2 = jourDeLaCle(`${jour[1]}-${jour[2]}`, date.getFullYear());
    return date2 ? mondeDuJour(date2) : mondeDOuverture(date);
  }

  const univers = /^univers-([a-z]+)$/.exec(id);
  if (univers) return mondeDUnUnivers(univers[1]!, date);

  const heure = /^heure-(\d{1,2})$/.exec(id);
  if (heure) return mondeDUneHeure(Number.parseInt(heure[1]!, 10), date);

  const magazine = /^magazine-(\d{1,2})$/.exec(id);
  if (magazine) return mondeDUnMagazine(Number.parseInt(magazine[1]!, 10), date);

  const chapitre = /^chapitre-(\d{1,2})-(\d)$/.exec(id);
  if (chapitre) return mondeDUnChapitre(Number.parseInt(chapitre[1]!, 10), Number.parseInt(chapitre[2]!, 10), date);

  const article = /^article-(.+)$/.exec(id);
  if (article) return mondeDUnArticle(article[1]!);

  const piste = /^piste-(\d{1,3})$/.exec(id);
  if (piste) return mondeDUnePiste(Number.parseInt(piste[1]!, 10), date);

  const produit = /^produit-(.+)$/.exec(id);
  if (produit) return mondeDUnProduit(produit[1]!);

  const metier = /^metier-(.+)$/.exec(id);
  if (metier) return mondeDUnMetier(metier[1]!);

  const personne = /^personne-(.+)$/.exec(id);
  if (personne) return mondeDUnePersonne(personne[1]!);

  const rubrique = /^rubrique-(\d)$/.exec(id);
  if (rubrique) return mondeDUneRubrique(Number.parseInt(rubrique[1]!, 10), date);

  return mondeDOuverture(date);
}

/**
 * **Un petit cache de mondes.** Construire l'année demande de parcourir 365
 * jours : ce n'est pas quelque chose qu'on refait à chaque image de la grille.
 * Le cache est volontairement court — les mondes sont légers, et les clés
 * portent tout ce qui les définit.
 */
const CACHE_DES_MONDES = new Map<string, Monde>();

/** Un monde déjà construit ne se reconstruit pas. */
export function mondeEnCache(cle: string, fabrique: () => Monde): Monde {
  const trouve = CACHE_DES_MONDES.get(cle);
  if (trouve) return trouve;
  const monde = fabrique();
  if (CACHE_DES_MONDES.size > 32) CACHE_DES_MONDES.clear();
  CACHE_DES_MONDES.set(cle, monde);
  return monde;
}

/** Les 54 couvertures, dans l'ordre de la collection. */
export function mondeDesMagazines(date: Date = new Date()): Monde {
  const cetteSemaine = magazineDeLaDate(date).numero;
  return {
    id: 'magazines',
    titre: 'LES 54 MAGAZINES',
    sous: 'un an de couvertures',
    quoi: 'un magazine par case',
    cases: MAGAZINES.map((magazine) =>
      caseSimple(`magazine-${magazine.numero}`, magazine.titre.toUpperCase(), 'image', magazine.palette.fond, {
        surTitre: magazine.joker ? 'HORS CALENDRIER' : `SEMAINE ${magazine.semaine}`,
        sousTitre: `${magazine.saison.nom} · ${magazine.style}`,
        image: visuelDeLaCouverture(magazine.numero).url,
        encre: ENCRE_SOMBRE,
        ouvre: `magazine-${magazine.numero}`,
        detail: [
          { label: 'SAISON', valeur: magazine.saison.nom },
          { label: 'CETTE SEMAINE', valeur: magazine.numero === cetteSemaine ? 'oui' : 'non' },
          { label: 'MOTIF', valeur: magazine.motif },
        ],
      }),
    ),
  };
}

/* ————————————————————————— LA COMPOSITION D'UN SITE ————————————————————————— */

/**
 * **Les modules qu'on peut poser dans un mini-site.** C'est le même vocabulaire
 * que les cases : un invité, un professionnel et un marié composent avec les
 * mêmes pièces.
 */
export const MODULES_DE_COMPOSITION: Array<{ id: string; mot: string; module: ModuleDeCase }> = [
  { id: 'photo', mot: 'PHOTO', module: 'image' },
  { id: 'date', mot: 'DATE', module: 'date' },
  { id: 'lieu', mot: 'LIEU', module: 'lieu' },
  { id: 'plan', mot: 'PLAN', module: 'carte' },
  { id: 'horaires', mot: 'HORAIRES', module: 'date' },
  { id: 'meteo', mot: 'MÉTÉO', module: 'meteo' },
  { id: 'musique', mot: 'MUSIQUE', module: 'audio' },
  { id: 'rsvp', mot: 'RSVP', module: 'formulaire' },
  { id: 'hebergement', mot: 'HÉBERGEMENT', module: 'lieu' },
  { id: 'transport', mot: 'TRANSPORT', module: 'carte' },
  { id: 'itineraire', mot: 'ITINÉRAIRE', module: 'carte' },
  { id: 'galerie', mot: 'GALERIE', module: 'galerie' },
  { id: 'contact', mot: 'CONTACT', module: 'formulaire' },
  { id: 'portfolio', mot: 'PORTFOLIO', module: 'galerie' },
  { id: 'tarifs', mot: 'TARIFS', module: 'prix' },
  { id: 'disponibilite', mot: 'DISPONIBILITÉ', module: 'formulaire' },
  { id: 'services', mot: 'SERVICES', module: 'texte' },
  { id: 'videos', mot: 'VIDÉOS', module: 'video' },
  { id: 'zone', mot: 'ZONE', module: 'carte' },
  { id: 'logo', mot: 'LOGO', module: 'image' },
  { id: 'portrait', mot: 'PORTRAIT', module: 'personne' },
];

/** Ce qu'un invité demande, dans l'ordre où il le demande. */
export const MINI_SITE_INVITE: string[] = [
  'photo', 'date', 'lieu', 'itineraire', 'horaires', 'rsvp', 'hebergement', 'transport', 'meteo', 'musique', 'galerie',
];

/** Ce qu'un professionnel montre, dans l'ordre où on le regarde. */
export const MINI_SITE_PRESTATAIRE: string[] = [
  'logo', 'portrait', 'portfolio', 'videos', 'services', 'disponibilite', 'zone', 'tarifs', 'contact',
];

/** Un bloc posé dans un mini-site : un module, et le mot qu'il porte. */
export interface BlocDeMiniSite {
  id: string;
  mot: string;
  module: ModuleDeCase;
  famille: Famille;
  /** Le titre repris d'une case, quand le bloc vient de la grille. */
  titre?: string;
  couleur: string;
}

/** Le module de composition d'un identifiant, ou `null`. */
export function moduleDeComposition(id: string) {
  return MODULES_DE_COMPOSITION.find((m) => m.id === id) ?? null;
}

/**
 * **Composer** : on prend des modules — et, si l'on veut, des cases choisies
 * dans la grille — et l'on obtient les blocs d'un mini-site, dans l'ordre où ils
 * ont été posés. Rien de plus : déplacer un bloc, c'est déplacer son rang.
 */
export function composerLeMiniSite(
  modules: string[],
  cases: CaseDuMonde[] = [],
  familles: Record<string, Famille> = {},
): BlocDeMiniSite[] {
  const blocs: BlocDeMiniSite[] = [];
  const vues = new Set<string>();
  cases.forEach((c) => {
    if (vues.has(c.id)) return;
    vues.add(c.id);
    blocs.push({
      id: c.id,
      mot: c.titre,
      module: c.module,
      famille: familles[c.id] ?? c.famille,
      titre: c.sousTitre,
      couleur: c.couleur,
    });
  });
  modules.forEach((id) => {
    const module = moduleDeComposition(id);
    if (!module) return;
    blocs.push({ id: `module-${module.id}`, mot: module.mot, module: module.module, famille: 'public', couleur: teinte(24).fond });
  });
  return blocs;
}

/** **Le mini-site**, tel qu'il se parcourt : une case par bloc posé. */
export function mondeDuMiniSite(blocs: BlocDeMiniSite[], titre = 'MON MINI-SITE'): Monde {
  return {
    id: 'mini-site',
    titre,
    sous: `${blocs.length} blocs`,
    quoi: 'les blocs composés',
    cases: blocs.map((bloc, i) =>
      caseSimple(`bloc-${i + 1}-${bloc.id}`, bloc.mot.toUpperCase(), bloc.module, bloc.couleur, {
        surTitre: `BLOC ${String(i + 1).padStart(2, '0')}`,
        sousTitre: bloc.titre,
        encre: ENCRE_CLAIRE,
        famille: bloc.famille,
        detail: [{ label: 'MODULE', valeur: bloc.module }, { label: 'OUVERTURE', valeur: bloc.famille }],
      }),
    ),
  };
}

/**
 * **La densité d'un monde** : ce que ses cases ont le droit de dire sur un écran
 * donné, à une échelle donnée. C'est la même règle que dans la grille — elle est
 * écrite ici pour qu'on puisse la lire sans navigateur.
 */
export function densiteDuMonde(monde: Monde, echelle: number, largeur = 1280, hauteur = 820): number {
  const colonnes = colonnesDeLaGrille(monde.cases.length, largeur, hauteur);
  const lignes = Math.max(1, Math.ceil(monde.cases.length / colonnes));
  const taille = Math.round(tailleDeLaCase(echelle) * ajustementDeRemplissage(colonnes, lignes, largeur, hauteur));
  return densiteDeLaTaille(taille);
}

/* ——————————————————— RETROUVER UNE CASE PAR SON IDENTIFIANT ——————————————————— */

/**
 * **Une case, par son identifiant.** Le monde en compte des milliers : on ne
 * les construit pas toutes pour en retrouver une. Chaque famille sait où
 * chercher — et si l'identifiant est un module de composition, ce n'est pas une
 * case : la composition le prendra tel quel.
 */
export function caseParId(id: string, date: Date = new Date()): CaseDuMonde | null {
  const famille = memeFamille(id);
  const monde = mondeEnCache(`${famille}|${date.getFullYear()}`, () => mondeDeLId(famille, date));
  const trouvee = monde.cases.find((c) => c.id === id);
  if (trouvee) return trouvee;
  // Certains identifiants nomment un **monde**, pas une case : la porte suffit.
  const cible = mondeDeLId(id, date);
  if (cible.id === id) {
    return {
      id,
      titre: cible.titre,
      surTitre: 'UNE PORTE',
      sousTitre: cible.sous,
      couleur: teinte(24).fond,
      encre: ENCRE_CLAIRE,
      module: 'lien',
      famille: 'public',
      ouvre: id,
    };
  }
  return null;
}

/** La famille d'un identifiant : le monde où il faut aller le chercher. */
function memeFamille(id: string): string {
  // Un jour est **une case de l'année**, et l'adresse de son propre monde.
  if (/^jour-\d{2}-\d{2}$/.test(id)) return 'annee';
  if (id.startsWith('univers-')) return id;
  if (id.startsWith('heure-')) return 'heures';
  if (id.startsWith('article-')) return 'articles';
  if (id.startsWith('piste-')) return 'musique';
  if (id.startsWith('produit-')) return 'boutique';
  if (id.startsWith('metier-')) return 'metiers';
  if (id.startsWith('personne-')) return 'personnes';
  if (id.startsWith('magazine-')) return 'magazines';
  if (id.startsWith('image-')) return 'galerie';
  if (id.startsWith('rubrique-')) return id;
  if (id.startsWith('chapitre-')) return id;
  return 'monde';
}

/** **Les cases d'une adresse** : celles qu'on retrouve, dans l'ordre demandé. */
export function casesParIds(ids: string[], date: Date = new Date()): CaseDuMonde[] {
  const trouves: CaseDuMonde[] = [];
  ids.forEach((id) => {
    const kase = caseParId(id, date);
    if (kase && !trouves.some((c) => c.id === kase.id)) trouves.push(kase);
  });
  return trouves;
}

/* ——————————————————————————— LES NŒUDS DU MONDE ——————————————————————————— */

/**
 * **Tout ce qui existe est une case.** Ce tableau est la carte du monde : il
 * sert aux tests, et il sert à vérifier qu'aucune collection du site n'est
 * restée sans grille.
 */
export const NŒUDS_DU_MONDE: Array<{ id: string; titre: string; source: string }> = [
  { id: 'annee', titre: 'L’ANNÉE', source: 'semaines · saintsDuJour · visuelsDuMagazine' },
  { id: 'jour-09-20', titre: 'LE JOUR', source: 'semaines · jourDuMagazine' },
  { id: 'heures', titre: 'LES 24 HEURES', source: 'lumiereDuJour · edition' },
  { id: 'magazines', titre: 'LES 54 MAGAZINES', source: 'semaines' },
  { id: 'articles', titre: 'LES ARTICLES', source: 'magazine' },
  { id: 'musique', titre: 'LA MUSIQUE', source: 'playlistDeLAnnee' },
  { id: 'boutique', titre: 'LA BOUTIQUE', source: 'shopData' },
  { id: 'metiers', titre: 'LES MÉTIERS', source: 'metierPage · personas' },
  { id: 'personnes', titre: 'LES GENS', source: 'personas' },
  { id: 'galerie', titre: 'LES IMAGES', source: 'bibliothequeMagazine' },
  { id: 'univers-musique', titre: 'UN UNIVERS', source: 'univers · chapitres · playlist' },
  { id: 'heure-18', titre: 'UNE HEURE', source: 'edition · playlistDeLAnnee · shopData' },
  { id: 'magazine-38', titre: 'UN MAGAZINE', source: 'semaines · chapitres' },
  { id: 'produit-cadre-dore', titre: 'UN OBJET', source: 'shopData' },
];
