import { LIGNES_DU_TICKET } from './categoriesDuTicket';
import { PORTEFEUILLES, totauxDuTicket } from './portefeuille';
import { TICKET_COUPLE } from './superMariage';

/* LE CODE DU MARIAGE — ON N'ARRIVE PAS SUR LE SITE, ON ENTRE DEDANS
 *
 * Un mini-site de mariage se partage : il y a **un couple**, **une date**, **un
 * code**. On ne tombe donc pas sur la page par hasard — on arrive avec un code,
 * comme on ouvre un cadenas. C'est ce code qui ouvre tout le reste :
 *
 * ```
 *   A7K-241
 *   └┬┘ └┬┘
 *    │   └── les trois chiffres du jour J (241 jours avant le mariage)
 *    └────── les trois signes du couple : initiales, date, lieu — mêlés
 * ```
 *
 * Le code sert ensuite **partout** : c'est lui qui est imprimé sur le ticket,
 * repris sur les objets (le billet d'avion, la carte postale), et mis dans le
 * lien qu'on envoie aux invités. Un code = un mariage.
 */

/** Les trois signes d'un couple, et le nombre de lettres prises à chacun. */
const SIGNE = /[A-Z0-9]/g;

/**
 * **Le code d'un couple, écrit à partir de son mariage.** Trois signes pris aux
 * noms, puis trois chiffres pris aux jours qui restent. La fonction est
 * déterministe : le même mariage donne toujours le même code, sans rien stocker.
 */
export function codeDuMariage(graine: { noms: string; date: string; lieu?: string; venue?: string }): string {
  const lettres = `${graine.noms}${graine.lieu ?? graine.venue ?? ''}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .match(SIGNE)!;
  // Trois signes : le premier, puis deux pris au milieu de la chaîne.
  const signes = [lettres[0], lettres[Math.floor(lettres.length / 3)], lettres[Math.floor((lettres.length * 2) / 3)]];
  const début = new Date(`${graine.date}T12:00:00`).getTime();
  const reste = Math.max(
    0,
    Math.round((début - Date.now()) / (1000 * 60 * 60 * 24)),
  );
  const chiffres = String(reste % 1000).padStart(3, '0');
  return `${signes.join('')}-${chiffres}`;
}

/** Le code écrit proprement : majuscules, et le tiret toujours à sa place. */
export function codeDepuis(texte: string): string | null {
  const nu = texte
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
  if (nu.length !== 6) return null;
  const écrit = `${nu.slice(0, 3)}-${nu.slice(3)}`;
  return CODE.test(écrit) ? écrit : null;
}

/** La forme d'un code : trois signes, un tiret, trois chiffres. */
export const CODE = /^[A-Z0-9]{3}-\d{3}$/;

/** Le code est-il bon ? On ne vérifie pas *lequel* — un code bien formé ouvre. */
export function codeAccepté(texte: string): boolean {
  const code = codeDepuis(texte);
  return code !== null && CODE.test(code);
}

/* ————————————————————————— IL SORT SUR LE TICKET ————————————————————————— */

/**
 * **Le rêve, et ce qu'il coûte.** Le voyage de noces, écrit en clair : c'est
 * **la cible** — la raison pour laquelle on économise sur le mariage.
 */
export interface Rêve {
  id: string;
  mot: string;
  sous: string;
  /** Le lieu, tel qu'il s'écrit sur le billet. */
  lieu: string;
  /** Le prix pour deux : vols, nuits, voiture. */
  prix: number;
  /** Ce que le prix comprend — écrit au dos du billet. */
  comprend: string[];
}

/** Le rêve : le désert, la nuit, les étoiles. Un seul, pour l'instant. */
export const LE_RÊVE: Rêve = {
  id: 'joshua-tree',
  mot: 'JOSHUA TREE',
  sous: 'dormir sous les étoiles, à deux',
  lieu: 'JOSHUA TREE · CALIFORNIE',
  prix: 4320,
  comprend: ['deux vols aller-retour', 'six nuits dans le désert', 'une voiture, cheveux au vent'],
};

/**
 * **Le rêve, tel que les mariés le décrivent.** Leurs mots — « dormir sous les
 * étoiles, à deux » — deviennent le **titre de l'écran** et la **ligne du
 * voyage** sur le ticket. S'ils ne décrivent rien, on retombe sur le rêve de la
 * maison : il y a toujours une cible, sinon rien ne se met d'accord.
 *
 * Le prix ne change pas : c'est celui du rêve, et il se finance ligne à ligne.
 */
export function rêveDécrit(texte: string, base: Rêve = LE_RÊVE): Rêve {
  const propres = texte.replace(/\s+/g, ' ').trim();
  if (!propres) return base;
  return { ...base, mot: propres.toUpperCase().slice(0, 34).trim(), sous: propres };
}

/**
 * **Ce qu'on met de côté.** Une règle simple, et une seule : chaque ligne cochée
 * au mariage est une ligne qu'on paie moins cher que prévu — dix-huit lignes
 * valent un vol. On ne promet pas de miracles : la mise de côté ne dépasse
 * jamais ce que le ticket coûte.
 */
export const ÉCONOMIE_PAR_LIGNE = 180;

export interface BudgetDuRêve {
  /** Ce que le mariage coûte, au total. */
  mariage: number;
  /** Ce qui est déjà mis de côté, ligne après ligne. */
  misDeCôté: number;
  /** Ce qu'il reste à financer pour le voyage. */
  reste: number;
  /** Où l'on en est du rêve, de zéro à un. */
  part: number;
  /** Vrai quand le rêve est payé. */
  payé: boolean;
}

/** **Le budget du rêve**, calculé à partir du ticket — jamais saisi à la main. */
export function budgetDuRêve(cochées: string[], rêve: Rêve = LE_RÊVE): BudgetDuRêve {
  const mariage = totauxDuTicket(LIGNES_DU_TICKET.filter((l) => cochées.includes(l.id))).total;
  const misDeCôté = Math.min(rêve.prix, cochées.length * ÉCONOMIE_PAR_LIGNE);
  const reste = Math.max(0, rêve.prix - misDeCôté);
  return {
    mariage,
    misDeCôté,
    reste,
    part: rêve.prix > 0 ? Math.min(1, misDeCôté / rêve.prix) : 0,
    payé: reste === 0,
  };
}

/* —————————————————— LES OBJETS IMPRIMÉS SUR LE TICKET —————————————————— */

/**
 * **Les objets que le ticket imprime.** Les boutons ronds de la machine ne sont
 * pas des décorations : chacun laisse une **ligne de code** sur le papier. Le
 * billet d'avion et la carte postale sont les deux qui portent le rêve.
 */
export const OBJETS_IMPRIMÉS: Array<{ id: string; mot: string; sigle: string; cible?: boolean }> = [
  { id: 'billet-avion', mot: 'BILLET D’AVION · JOSHUA TREE', sigle: 'AV', cible: true },
  { id: 'carte-postale', mot: 'CARTE POSTALE · À ENVOYER', sigle: 'CP', cible: true },
  { id: 'tampon', mot: 'TAMPON · L’ENCRE DU JOUR', sigle: 'TA' },
  { id: 'timbre', mot: 'TIMBRE · CE QUI AFFRANCHIT', sigle: 'TI' },
  { id: 'ticket-spectacle', mot: 'TICKET SPECTACLE · VOTRE PLACE', sigle: 'SP' },
  { id: 'sticker', mot: 'STICKER · LE REPÈRE', sigle: 'ST' },
];

/** **La ligne d'un objet sur le ticket** : son code, son mot, et son signe. */
export function ligneImprimée(code: string, objet: (typeof OBJETS_IMPRIMÉS)[number]): string {
  return `${code}-${objet.sigle} · ${objet.mot}`;
}

/* ————————————————————————— LES STICKERS CARRÉS ————————————————————————— */

/**
 * **Les stickers.** Chaque objet posé, chaque porte ouverte tire son carré
 * coloré — la couleur est celle d'un magazine, jamais une couleur de marque. Ils
 * s'impriment sous le ticket : c'est ce qui se colle ensuite sur le cahier.
 */
export interface Sticker {
  cle: string;
  /** Le mot, écrit dans le carré. */
  mot: string;
  /** La couleur du carré — celle d'un magazine de la collection. */
  couleur: string;
  /** L'encre qui se lit sur cette couleur. */
  encre: string;
}

/** Les huit couleurs d'encre des stickers, prises dans la collection. */
export const COULEURS_DES_STICKERS = ['#C98A3E', '#3E6B63', '#7A4E6B', '#B0483F', '#4A6FA5', '#6B7A4A', '#8A5A3E', '#3E4B5A'];

/** Un sticker, tiré d'un mot et d'un rang : même mot, même couleur. */
export function stickerDe(mot: string, rang: number): Sticker {
  const couleur = COULEURS_DES_STICKERS[rang % COULEURS_DES_STICKERS.length]!;
  return { cle: `${mot}-${rang}`, mot: mot.toUpperCase(), couleur, encre: '#FFFEF7' };
}

/** La mise de côté, écrite comme sur le papier. */
export function partDuRêve(part: number): string {
  return `${Math.round(part * 100)} %`;
}

/** Les cinq portefeuilles, tels qu'ils s'écrivent sur le ticket du couple. */
export const LES_CINQ = PORTEFEUILLES.map((p) => p.mot);

/** Le code de démonstration : celui qu'on peut essayer sans être invité. */
export const CODE_DE_DÉMONSTRATION = codeDuMariage(TICKET_COUPLE);
