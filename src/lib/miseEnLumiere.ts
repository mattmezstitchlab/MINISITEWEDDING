import { JOURS_NOMMES, jourNomme } from './saintsDuJour';

/**
 * LA MISE EN LUMIÈRE — CE QU'ON GAGNE À SE MONTRER
 *
 * Le magazine ne demande rien : il **rend** ce qu'on lui donne. Plus le profil
 * est complet, plus on est **vu** — par les autres, par les magazines des autres,
 * et par les gens qui, le même jour, fêtent le même prénom **à l'autre bout du
 * monde**. C'est un système de niveaux, comme celui d'une page : il n'humilie
 * personne, il **élève** — on monte en donnant, pas en prenant.
 *
 * **Le jour de votre fête, la couverture est la vôtre.** Le calendrier a 364
 * prénoms : le vôtre est l'un d'eux. Ce jour-là, votre portrait de studio peut
 * passer en couverture, avec **les personnes alignées autour de vous** selon vos
 * informations — et le même jour, ailleurs, d'autres fêtent le même prénom : vous
 * êtes alignés sans le savoir.
 *
 * Et le portrait de studio n'est pas un détail : **il doit tenir la charte**
 * (`src/lib/charte.ts`) — c'est la condition pour entrer dans une page où des
 * inconnus se suivent.
 */

export interface Profil {
  prenom: string;
  /** Le jour de sa fête. Sans elle, on le déduit du prénom. */
  fete?: { mois: number; jour: number } | null;
  /** La date du mariage ou de l'événement, en clair (ISO ou « 2027-06-12 »). */
  date?: string | null;
  /** Le lieu, tel qu'on l'écrit : ville, pays. */
  lieu?: string | null;
  /** Le personnage choisi (rôle) et l'univers aimé. */
  roleId?: string | null;
  styleId?: string | null;
  /** Le portrait de studio : envoyé, et conforme à la charte. */
  photoStudio?: boolean;
  photoConforme?: boolean;
  /** Ce qu'on a donné au magazine : des inédits, une playlist, des documents. */
  inedits?: number;
  playlist?: number;
  documents?: number;
}

export interface Palier {
  n: number;
  nom: string;
  /** Ce qu'on voit de vous quand vous êtes à ce palier. */
  ceQuOnVoit: string;
  /** Ce que ça ouvre. */
  debloque: string;
}

/** Les six paliers. On ne saute pas : on monte. */
export const PALIERS: Palier[] = [
  { n: 1, nom: 'le prénom', ceQuOnVoit: 'votre prénom, et le jour de votre fête', debloque: 'entrer dans l’annuaire des jours — vous existez dans l’année' },
  { n: 2, nom: 'le portrait', ceQuOnVoit: 'votre portrait de studio, conforme à la charte', debloque: 'être montrable : on peut vous mettre en couverture' },
  { n: 3, nom: 'la date', ceQuOnVoit: 'votre date', debloque: 'le magazine s’aligne sur votre jour, et vos pages changent avec lui' },
  { n: 4, nom: 'le lieu', ceQuOnVoit: 'votre lieu', debloque: 'les propositions à proximité, et les gens du même coin' },
  { n: 5, nom: 'le rôle et l’univers', ceQuOnVoit: 'ce que vous êtes, et ce que vous aimez', debloque: 'apparaître dans les magazines des autres, à votre place' },
  { n: 6, nom: 'la mise en lumière', ceQuOnVoit: 'vous, en couverture, avec ceux qui vous entourent', debloque: 'le jour de votre fête : la couverture est la vôtre — et l’alignement continue ailleurs' },
];

export interface Lumiere {
  /** Les points : ce qui est donné, et ce qui manque. */
  points: number;
  sur: number;
  palier: Palier;
  /** Ce qui manque pour monter d'un cran. */
  pourMonter: string[];
  /** Le jour de sa fête, déduit du prénom quand il n'est pas donné. */
  fete: { mois: number; jour: number } | null;
  /** Est-ce ce jour-là ? La couverture est la sienne. */
  enCouvertureAujourdHui: boolean;
  /** Combien de jours, dans l'année, portent son prénom. */
  joursQuiPortentSonNom: number;
  /** Les opportunités que la mise en lumière ouvre. */
  opportunites: string[];
}

/** On compare les prénoms sans accents ni casse : « Élodie » et « elodie », c'est le même jour. */
function sansAccents(texte: string): string {
  return texte.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

/** La fête d'un prénom : le jour du calendrier qui porte ce nom. */
export function feteDuPrenom(prenom: string): { mois: number; jour: number } | null {
  const cherche = sansAccents(prenom);
  const trouve = JOURS_NOMMES.find((j) => sansAccents(j.nom) === cherche);
  return trouve ? { mois: trouve.mois, jour: trouve.jour } : null;
}

/** Tous les jours d'un prénom — il peut y en avoir plusieurs dans l'année. */
export function joursDuPrenom(prenom: string): Array<{ mois: number; jour: number }> {
  const cherche = sansAccents(prenom);
  return JOURS_NOMMES.filter((j) => sansAccents(j.nom) === cherche).map((j) => ({ mois: j.mois, jour: j.jour }));
}

/** **La mise en lumière d'un profil** : son palier, ce qui manque, et ce que ça ouvre. */
export function miseEnLumiere(profil: Profil, date?: Date): Lumiere {
  const fete = profil.fete ?? feteDuPrenom(profil.prenom);
  const jours = joursDuPrenom(profil.prenom);

  const points = [
    Boolean(profil.prenom.trim()),
    Boolean(profil.photoStudio),
    Boolean(profil.photoConforme),
    Boolean(profil.date),
    Boolean(profil.lieu),
    Boolean(profil.roleId),
    Boolean(profil.styleId),
    (profil.inedits ?? 0) > 0,
    (profil.playlist ?? 0) > 0,
    (profil.documents ?? 0) > 0,
  ].filter(Boolean).length;

  // On monte marche par marche, et **le portrait conforme à la charte est la
  // première marche** : sans lui, on n'est pas montrable, donc on ne monte pas.
  // C'est la règle du magazine — celui qui veut paraître donne de quoi paraître.
  const portraitConforme = Boolean(profil.photoStudio && profil.photoConforme);
  let cran = portraitConforme ? 2 : 1;
  if (cran >= 2 && profil.date) cran = 3;
  if (cran >= 3 && profil.lieu) cran = 4;
  if (cran >= 4 && profil.roleId && profil.styleId) cran = 5;
  if (cran >= 5 && portraitConforme) cran = 6;
  const palier = PALIERS[cran - 1]!;

  const manques: string[] = [];
  if (!profil.photoStudio) manques.push('un portrait de studio');
  else if (!profil.photoConforme) manques.push('la conformité du portrait à la charte');
  if (!profil.date) manques.push('la date de votre événement');
  if (!profil.lieu) manques.push('le lieu, écrit simplement');
  if (!profil.roleId) manques.push('votre rôle dans la journée');
  if (!profil.styleId) manques.push('l’univers qui vous ressemble');
  if ((profil.inedits ?? 0) === 0) manques.push('un inédit : une photo, un mot, un morceau');

  const enCouvertureAujourdHui = Boolean(
    date && fete && jourNomme(date) && sansAccents(jourNomme(date)!.nom) === sansAccents(profil.prenom),
  );

  const opportunites = [
    'être visible par les autres, et par leurs magazines',
    'recevoir des propositions quand la date et le lieu se répondent',
    'être repris par les gens du même jour, ailleurs',
  ];
  if (palier.n >= 4) opportunites.push('apparaître dans les propositions à proximité de votre lieu');
  if (palier.n >= 5) opportunites.push('entrer dans la composition des magazines du jour, à côté des autres rôles');
  if (palier.n >= 6) opportunites.push('passer en couverture le jour de votre fête, avec ceux qui vous entourent');

  return {
    points,
    sur: 10,
    palier,
    pourMonter: manques.slice(0, 2),
    fete,
    enCouvertureAujourdHui,
    joursQuiPortentSonNom: jours.length,
    opportunites,
  };
}

/** Un profil vide : « vous », avant que vous n'ayez rien donné. */
export function profilDeBase(prenom = 'Vous'): Profil {
  return {
    prenom,
    fete: null,
    date: null,
    lieu: null,
    roleId: null,
    styleId: null,
    photoStudio: false,
    photoConforme: false,
    inedits: 0,
    playlist: 0,
    documents: 0,
  };
}

/**
 * **Les gens alignés autour de vous.** Le jour de votre fête, les magazines se
 * composent : ceux qui portent le même prénom, ceux qui sont du même jour, ceux
 * du même lieu — et, plus loin, les mêmes prénoms fêtés à l'autre bout du monde.
 */
export function alignesAutour(profil: Profil, autres: Profil[]): Profil[] {
  const cherche = sansAccents(profil.prenom);
  return autres.filter((a) => sansAccents(a.prenom) === cherche || (a.lieu && a.lieu === profil.lieu));
}
