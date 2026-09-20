import { useEffect, useState } from 'react';
import type { Cible } from './journal';
import { enregistrerGeste } from './temps';

/**
 * LE CHIFFRE — LA TRADITION, SA RÈGLE, ET SES LIMITES
 *
 * Le site calcule déjà **un chiffre pour le jour** (`clesDuJour`). Ici, c'est le
 * même geste, mais pour **une personne** : sa date de naissance et son nom
 * donnent un nombre, et ce nombre se propage — sa carte, son profil, son hero,
 * la constellation du mariage.
 *
 * **Trois règles, non négociables, écrites ici pour être tenues :**
 *
 *  1. **Le chiffre dit sa règle.** Système pythagoricien, alphabet latin,
 *     accents retirés, **nom de naissance**, méthode dite, nombres maîtres non
 *     réduits. `laRegle()` rend ça en clair, et l'affichage le montre sur un
 *     clic. Personne ne pourra dire qu'on a fait semblant.
 *  2. **Le chiffre ne juge personne.** Pas de compatibilité, pas de dette, pas
 *     de hiérarchie, pas de prédiction. **Neuf mots, les mêmes pour tout le
 *     monde** — et pour les maîtres, la même phrase : *ce n'est pas mieux.*
 *  3. **Il est facultatif, et privé par défaut.** La date de naissance n'est
 *     demandée que si la personne veut bien la donner, et elle reste `prive`
 *     tant qu'elle n'a pas choisi autre chose.
 *
 * Ce module ne connaît ni React ni le réseau : il calcule, et il dit comment.
 * Le stockage (petit, facultatif) est à la fin.
 */

/* ————————————————————————— LE SYSTÈME, ET CE QU'ON DIT DE LUI ————————————————————————— */

/** Le seul système employé. L'autre — chaldéen — va de 1 à 8 : on ne mélange pas. */
export const SYSTEME = 'pythagoricien';

export const ALPHABET = 'l’alphabet latin, sans accents';

export type Methode = 'par-composant' | 'globale';

/**
 * **La méthode de référence.** Le jour, le mois et l'année sont réduits
 * **séparément**, puis additionnés : c'est la méthode qui laisse voir les
 * nombres maîtres au passage (un 29 donne 11, et l'on garde le 11).
 */
export const METHODE_PAR_DEFAUT: Methode = 'par-composant';

/** Les nombres maîtres : jamais réduits. */
export const MAITRES = [11, 22, 33] as const;

export function estMaitre(n: number): boolean {
  return (MAITRES as readonly number[]).includes(n);
}

/** La règle, en clair — ce que l'affichage montre quand on clique sur le chiffre. */
export function laRegle(): string[] {
  return [
    `Système ${SYSTEME} : A=1, B=2, … I=9, puis on recommence (J=1).`,
    `${ALPHABET} : É=E, Ç=C, Ü=U, et les ligatures se séparent (Œ=OE).`,
    'Le nom employé est le nom de naissance — celui qui ne change pas.',
    `Méthode ${METHODE_PAR_DEFAUT === 'par-composant' ? 'par composant' : 'globale'} : jour, mois et année sont réduits séparément, puis additionnés.`,
    'Les nombres 11, 22 et 33 ne sont pas réduits — et ils ne valent pas mieux que 2, 4 et 6 : ce sont les mêmes, avec leur moitié visible.',
    'Un repère symbolique : ni un diagnostic, ni une prédiction, ni un jugement.',
  ];
}

/* ————————————————————————— LES LETTRES ————————————————————————— */

/** La valeur d'une lettre, dans le système pythagoricien. */
export function valeurDeLettre(lettre: string): number {
  const l = sansAccents(lettre).replace(/[^A-Z]/g, '');
  if (!l) return 0;
  const i = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(l[0]!);
  return i < 0 ? 0 : (i % 9) + 1;
}

/** « Élodie » → « ELODIE » : accents retirés, ligatures séparées, majuscules. */
export function sansAccents(texte: string): string {
  return (texte ?? '')
    .replace(/œ/gi, 'OE')
    .replace(/æ/gi, 'AE')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

/** Les lettres d'un mot : les lettres seules, accents retirés. */
export function lettresDe(texte: string): string[] {
  return sansAccents(texte).replace(/[^A-Z]/g, '').split('');
}

/**
 * **Le Y : voyelle ou consonne ?** Il sonne « i » presque partout — il compte
 * donc comme **voyelle**, sauf quand il ouvre le mot devant une voyelle
 * (« Yves », « Yann ») : là, il sonne consonne. La règle est écrite, donc elle
 * est discutable — et c'est exactement ce qu'on veut.
 */
export function estVoyelle(lettre: string, rang: number, mot: string): boolean {
  const l = sansAccents(lettre)[0] ?? '';
  if ('AEIOU'.includes(l)) return true;
  if (l !== 'Y') return false;
  const suivant = sansAccents(mot)[rang + 1] ?? '';
  return !(rang === 0 && 'AEIOUY'.includes(suivant));
}

export function voyellesDe(texte: string): string[] {
  const mot = sansAccents(texte).replace(/[^A-Z]/g, '');
  return mot.split('').filter((l, i) => estVoyelle(l, i, mot));
}

export function consonnesDe(texte: string): string[] {
  const mot = sansAccents(texte).replace(/[^A-Z]/g, '');
  return mot.split('').filter((l, i) => !estVoyelle(l, i, mot));
}

/* ————————————————————————— LA RÉDUCTION ————————————————————————— */

/** Un calcul, et **ses étapes** : ce que l'affichage déplie. */
export interface Detail {
  nombre: number;
  maitre: boolean;
  /** Un maître est passé en chemin : la méthode par composant le laisse voir. */
  maitreEnChemin: boolean;
  /** Le calcul, dans l'ordre — montré tel quel. */
  pas: string[];
}

/**
 * La réduction théosophique : on additionne les chiffres jusqu'à un seul —
 * **sauf** si l'on tombe sur 11, 22 ou 33, qui restent.
 */
export function reduire(n: number, garderMaitres = true): number {
  let courant = Math.abs(Math.trunc(n));
  while (courant > 9) {
    if (garderMaitres && estMaitre(courant)) return courant;
    courant = String(courant)
      .split('')
      .reduce((somme, c) => somme + Number(c), 0);
  }
  return courant;
}

/** La somme des chiffres d'un nombre, sans réduire — l'étape intermédiaire. */
export function sommeDesChiffres(n: number): number {
  return String(Math.abs(Math.trunc(n)))
    .split('')
    .reduce((somme, c) => somme + Number(c), 0);
}

function sommeDesLettres(lettres: string[]): { total: number; pas: string[] } {
  const valeurs = lettres.map((l) => valeurDeLettre(l));
  const total = valeurs.reduce((a, b) => a + b, 0);
  const pas =
    lettres.length > 0
      ? [`${lettres.join('')} : ${lettres.map((l, i) => `${l}=${valeurs[i]}`).join(' + ')}`, `${valeurs.join(' + ')} = ${total}`]
      : [];
  return { total, pas };
}

function reduireAvecPas(n: number, pas: string[]): Detail {
  let courant = Math.abs(Math.trunc(n));
  let maitreEnChemin = false;
  while (courant > 9) {
    if (estMaitre(courant)) {
      maitreEnChemin = true;
      pas.push(`${courant} est un nombre maître : il n’est pas réduit.`);
      break;
    }
    const suivant = sommeDesChiffres(courant);
    pas.push(`${courant} → ${String(courant).split('').join(' + ')} = ${suivant}`);
    courant = suivant;
  }
  return { nombre: courant, maitre: estMaitre(courant), maitreEnChemin, pas };
}

/* ————————————————————————— LES NOMBRES D'UN NOM ————————————————————————— */

/** Le nombre d'expression : **toutes** les lettres du nom. */
export function chiffreDuNom(nom: string): Detail {
  const lettres = lettresDe(nom);
  const { total, pas } = sommeDesLettres(lettres);
  return reduireAvecPas(total, pas);
}

/** Le nombre intime : **les voyelles** — ce que la personne veut, au fond. */
export function chiffreIntime(nom: string): Detail {
  const { total, pas } = sommeDesLettres(voyellesDe(nom));
  pas.unshift('Les voyelles du nom :');
  return reduireAvecPas(total, pas);
}

/** Le nombre de personnalité : **les consonnes** — ce qu'on voit d'abord. */
export function chiffreDePersonnalite(nom: string): Detail {
  const { total, pas } = sommeDesLettres(consonnesDe(nom));
  pas.unshift('Les consonnes du nom :');
  return reduireAvecPas(total, pas);
}

/* ————————————————————————— LA DATE ————————————————————————— */

/** « 1992-06-14 » ou « 14/06/1992 » → jour, mois, année. `null` si illisible. */
export function lireDate(texte: string): { jour: number; mois: number; annee: number } | null {
  const t = (texte ?? '').trim();
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  const fr = /^(\d{2})[/.](\d{2})[/.](\d{4})$/.exec(t);
  const jour = iso ? Number(iso[3]) : fr ? Number(fr[1]) : 0;
  const mois = iso ? Number(iso[2]) : fr ? Number(fr[2]) : 0;
  const annee = iso ? Number(iso[1]) : fr ? Number(fr[3]) : 0;
  if (!jour || !mois || !annee || mois > 12 || jour > 31 || annee < 1800 || annee > 2200) return null;
  return { jour, mois, annee };
}

/**
 * **Le chemin de vie** — la date de naissance complète. Il ne change jamais.
 * Les deux méthodes existent, et elles ne donnent pas toujours le même résultat :
 * on dit laquelle on emploie (`METHODE_PAR_DEFAUT`).
 */
export function cheminDeVie(naissance: string, methode: Methode = METHODE_PAR_DEFAUT): Detail | null {
  const d = lireDate(naissance);
  if (!d) return null;

  if (methode === 'globale') {
    const chiffres = `${String(d.jour).padStart(2, '0')}${String(d.mois).padStart(2, '0')}${d.annee}`.split('').map(Number);
    const total = chiffres.reduce((a, b) => a + b, 0);
    const dedans: string[] = [];
    const detail = reduireAvecPas(total, dedans);
    return { ...detail, pas: [`La date entière : ${chiffres.join(' + ')} = ${total}${dedans.length ? ` — ${dedans.join(' · ')}` : ''}`] };
  }

  /**
   * La méthode de référence : chaque composant est réduit **chez lui**, puis les
   * trois se rejoignent. C'est celle qui laisse voir un maître au passage
   * (un 29 donne 11, et l'on garde le 11).
   */
  const pas: string[] = [];
  /** Une ligne par composant : ce qu'on a additionné, et ce que ça a donné. */
  const ligne = (titre: string, depart: number, d: Detail, avant: string[] = []) => {
    const corps = [...avant, ...d.pas];
    pas.push(`${titre} : ${corps.length ? corps.join(' · ') : String(depart)}`);
  };

  const dedansJour: string[] = [];
  const jour = reduireAvecPas(d.jour, dedansJour);
  ligne('Le jour', d.jour, jour, []);

  const dedansMois: string[] = [];
  const mois = reduireAvecPas(d.mois, dedansMois);
  ligne('Le mois', d.mois, mois, []);

  const sommeAnnee = sommeDesChiffres(d.annee);
  const dedansAnnee: string[] = [];
  const annee = reduireAvecPas(sommeAnnee, dedansAnnee);
  const avantAnnee =
    d.annee === sommeAnnee ? [] : [`${d.annee} → ${String(d.annee).split('').join(' + ')} = ${sommeAnnee}`];
  ligne('L’année', d.annee, annee, avantAnnee);

  const total = jour.nombre + mois.nombre + annee.nombre;
  const ensemble: string[] = [];
  const detail = reduireAvecPas(total, ensemble);
  pas.push(`Ensemble : ${jour.nombre} + ${mois.nombre} + ${annee.nombre} = ${total}${ensemble.length ? ` — ${ensemble.join(' · ')}` : ''}`);
  return { ...detail, pas, maitreEnChemin: detail.maitreEnChemin || jour.maitre || mois.maitre || annee.maitre };
}

/**
 * **L'année personnelle** — la seule qui bouge : le jour et le mois de naissance,
 * plus l'année en cours. C'est le chiffre de l'année, pas celui de la personne.
 */
export function anneePersonnelle(naissance: string, annee: number): number | null {
  const d = lireDate(naissance);
  if (!d) return null;
  const total = reduire(d.jour) + reduire(d.mois) + reduire(sommeDesChiffres(annee));
  return reduire(total);
}

/**
 * **Le chiffre du mariage** — la même somme, à l'échelle d'un jour : ce n'est
 * pas un horoscope, c'est un repère pour une date, comme le chiffre du jour du
 * magazine.
 */
export function chiffreDUneDate(date: Date | string): number {
  const d = typeof date === 'string' ? lireDate(date) : { jour: date.getDate(), mois: date.getMonth() + 1, annee: date.getFullYear() };
  if (!d) return 0;
  return reduire(reduire(d.jour) + reduire(d.mois) + reduire(sommeDesChiffres(d.annee)));
}

/**
 * **Le chiffre à deux** — et rien de plus. On ne dit jamais « vous êtes
 * compatibles » : on montre **les deux chiffres**, et leur somme **seulement si
 * les deux personnes l'ont donné**. Sans les deux dates, il n'y a pas de somme.
 */
export interface ChiffreAdeux {
  premier: number | null;
  second: number | null;
  ensemble: number | null;
}

export function chiffreAdeux(
  premiere: string | null | undefined,
  seconde: string | null | undefined,
): ChiffreAdeux {
  const a = premiere ? cheminDeVie(premiere) : null;
  const b = seconde ? cheminDeVie(seconde) : null;
  const ensemble = a && b ? reduire(a.nombre + b.nombre) : null;
  return { premier: a?.nombre ?? null, second: b?.nombre ?? null, ensemble };
}

/* ————————————————————————— LES MOTS ————————————————————————— */

export interface MotDuChiffre {
  nombre: number;
  nom: string;
  mots: string;
}

/**
 * **Les mots.** Neuf familles, les mêmes pour tout le monde — et pour les
 * maîtres, la même phrase : *ce n'est pas mieux.* Aucun mot ne dit qui l'on est :
 * ils disent **dans quelle famille on se reconnaît**, et c'est la personne qui
 * tranche.
 */
export const MOTS: Record<number, MotDuChiffre> = {
  1: { nombre: 1, nom: 'Un', mots: 'ce qui commence, et ce qui se décide seul' },
  2: { nombre: 2, nom: 'Deux', mots: 'le duo, l’accord, ce qui se fait à deux' },
  3: { nombre: 3, nom: 'Trois', mots: 'ce qui s’élargit, se dit, se partage' },
  4: { nombre: 4, nom: 'Quatre', mots: 'ce qui se construit, et qui tient' },
  5: { nombre: 5, nom: 'Cinq', mots: 'le mouvement, les départs, ce qui arrive' },
  6: { nombre: 6, nom: 'Six', mots: 'le soin, la table, ce qu’on donne aux siens' },
  7: { nombre: 7, nom: 'Sept', mots: 'la recherche, le silence, ce qui demande du temps' },
  8: { nombre: 8, nom: 'Huit', mots: 'l’ordre, le travail, ce qui se règle proprement' },
  9: { nombre: 9, nom: 'Neuf', mots: 'ce qui se transmet, et ce qu’on peut lâcher' },
  11: { nombre: 11, nom: 'Onze', mots: 'le regard porté plus loin — et ce n’est pas mieux que deux : c’est le même, avec ses deux chiffres visibles' },
  22: { nombre: 22, nom: 'Vingt-deux', mots: 'ce qui se bâtit à plusieurs — et ce n’est pas mieux que quatre : c’est le même, avec ses deux chiffres visibles' },
  33: { nombre: 33, nom: 'Trente-trois', mots: 'ce qui se donne largement — et ce n’est pas mieux que six : c’est le même, avec ses deux chiffres visibles' },
};

/** Les mots d'un nombre, ou `null` : aucun nombre n'invente son sens. */
export function motsDuChiffre(n: number): MotDuChiffre | null {
  return MOTS[n] ?? null;
}

/* ————————————————————————— TOUT ENSEMBLE ————————————————————————— */

export interface ChiffresDeLaPersonne {
  chemin: Detail | null;
  expression: Detail;
  intime: Detail;
  personnalite: Detail;
  /** Les quatre nombres sont d'accord : c'est rare, et ça se dit sans flatterie. */
  accord: boolean;
}

/**
 * Les quatre nombres d'une personne. **Le prénom et le nom sont facultatifs**
 * comme la date : ce qui manque ne s'invente pas, et ce qui est donné se calcule
 * avec la règle écrite plus haut.
 */
export function chiffresDeLaPersonne(
  prenom: string,
  nom: string,
  naissance: string,
): ChiffresDeLaPersonne {
  const complet = [prenom, nom].filter(Boolean).join(' ');
  const expression = chiffreDuNom(complet);
  const intime = chiffreIntime(complet);
  const personnalite = chiffreDePersonnalite(complet);
  const chemin = naissance ? cheminDeVie(naissance) : null;
  const nombres = [chemin?.nombre, expression.nombre, intime.nombre, personnalite.nombre].filter(
    (n): n is number => typeof n === 'number' && n > 0,
  );
  return { chemin, expression, intime, personnalite, accord: nombres.length > 1 && new Set(nombres).size === 1 };
}

/* ————————————————————————— QUI LE VOIT — LES TROIS CIBLES, LES MÊMES QUE LE JOURNAL ————————————————————————— */

/**
 * Les trois cibles de confidentialité, dans la langue du chiffre. Ce sont
 * **exactement** les trois du journal (`public`, `cercle`, `prive`) : une seule
 * grammaire de confidentialité pour tout le site.
 */
export const CONFIDENTIALITE_CHIFFRE: Array<{ id: Cible; nom: string; qui: string }> = [
  { id: 'public', nom: 'Public', qui: 'tout le monde le voit, sur votre profil' },
  { id: 'cercle', nom: 'Le cercle', qui: 'ceux qui sont alignés avec vous' },
  { id: 'prive', nom: 'Privé', qui: 'vous seul — c’est le défaut, et il ne change pas tout seul' },
];

/* ————————————————————————— LE STOCKAGE — FACULTATIF, PRIVÉ ————————————————————————— */

const CLE = 'vows:chiffre';
const EVENEMENT = 'vows:chiffre-change';

export interface Naissance {
  /** Le prénom que la personne veut voir employer. */
  prenom: string;
  /** Le nom de naissance — celui qui ne change pas. */
  nomDeNaissance: string;
  /** « 1992-06-14 ». Facultatif : sans elle, il n'y a pas de chemin de vie. */
  date: string;
  /** **Privé par défaut** : la règle, et elle ne change pas toute seule. */
  cible: Cible;
}

export function chargerChiffre(): Naissance | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const brut = localStorage.getItem(CLE);
    if (!brut) return null;
    const lu = JSON.parse(brut) as Partial<Naissance>;
    if (!lu || typeof lu !== 'object') return null;
    return {
      prenom: String(lu.prenom ?? ''),
      nomDeNaissance: String(lu.nomDeNaissance ?? ''),
      date: String(lu.date ?? ''),
      cible: lu.cible === 'public' || lu.cible === 'cercle' ? lu.cible : 'prive',
    };
  } catch {
    return null;
  }
}

export function enregistrerChiffre(naissance: Naissance): Naissance | null {
  const propre: Naissance = {
    prenom: naissance.prenom.trim(),
    nomDeNaissance: naissance.nomDeNaissance.trim(),
    date: naissance.date.trim(),
    cible: naissance.cible === 'public' || naissance.cible === 'cercle' ? naissance.cible : 'prive',
  };
  // Rien de donné, rien de gardé : la case vide n'est pas une donnée.
  const vide = !propre.prenom && !propre.nomDeNaissance && !propre.date;
  try {
    if (typeof localStorage !== 'undefined') {
      if (vide) localStorage.removeItem(CLE);
      else localStorage.setItem(CLE, JSON.stringify(propre));
      window.dispatchEvent(new Event(EVENEMENT));
    }
  } catch {
    /* pas de fenêtre : rien à garder */
  }
  if (!vide) {
    // **Le temps commun** : le chiffre posé est un geste — et il dit seulement
    // qu'il a été posé, jamais le nombre : le temps n'est pas un registre d'état civil.
    enregistrerGeste({
      type: 'chiffre',
      titre: 'Chiffre posé',
      detail: propre.date ? 'avec la date de naissance' : 'sans la date de naissance',
      qui: propre.prenom || undefined,
    });
  }
  return vide ? null : propre;
}

export function effacerChiffre(): void {
  if (chargerChiffre()) enregistrerGeste({ type: 'chiffre', titre: 'Chiffre effacé' });
  try {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(CLE);
    window.dispatchEvent(new Event(EVENEMENT));
  } catch {
    /* pas de fenêtre : rien à effacer */
  }
}

/** Le chiffre vivant : la personne le pose, le change, l'efface — et il suit. */
export function useChiffre(): Naissance | null {
  const [naissance, setNaissance] = useState<Naissance | null>(() => chargerChiffre());

  useEffect(() => {
    const surChangement = () => setNaissance(chargerChiffre());
    window.addEventListener(EVENEMENT, surChangement);
    return () => window.removeEventListener(EVENEMENT, surChangement);
  }, []);

  return naissance;
}
