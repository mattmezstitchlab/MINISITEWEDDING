import {
  TAUX_FIDELITE,
  TVA,
  euros,
  lignesDuTicket as lignesDuPapier,
  numeroDeTicket,
  type LigneTicket,
} from './superMariage';
import { LIGNES_DU_TICKET, lignesCochées, prixDuneLigne, type LigneDuTicket } from './categoriesDuTicket';

/* LES PORTEFEUILLES — OÙ VA LE TICKET QUAND IL SORT
 *
 * Un ticket qui ne va nulle part n'est pas un ticket. Chaque ligne cochée sait
 * **qui la reçoit** : la cérémonie va aux invités et au couple, le traiteur va
 * au métier et au couple, un bloc de site va aux invités, un document va au
 * couple et aux invités.
 *
 * Cinq portefeuilles, et le même papier pour tout le monde :
 *
 * | le portefeuille | ce qu'il contient | le papier |
 * | --- | --- | --- |
 * | **le couple** | tout ce qui est coché, et le total | `couple` |
 * | **les invités** | ce qu'ils voient, et ce qu'ils prennent | `invite` |
 * | **la famille** | ce qui reste dans la famille | `invite` |
 * | **le DJ** | la playlist, dans l'ordre de la soirée | `dj` |
 * | **les métiers** | leurs bons de commande | `metier` |
 */

export type Portefeuille = 'couple' | 'invites' | 'famille' | 'dj' | 'metier';

export interface PortefeuilleDéfini {
  id: Portefeuille;
  mot: string;
  qui: string;
  /** La marque minuscule des droits : la même que dans la grille. */
  marque: string;
  /** Le papier que ce portefeuille imprime. */
  papier: 'couple' | 'invite' | 'dj' | 'metier';
  /** Le nombre d'exemplaires remis. */
  exemplaires: string;
}

/** **Les cinq portefeuilles.** Rien de plus, et ils existent tous déjà. */
export const PORTEFEUILLES: PortefeuilleDéfini[] = [
  { id: 'couple', mot: 'le couple', qui: 'tout ce qui est coché', marque: '●', papier: 'couple', exemplaires: '2' },
  { id: 'invites', mot: 'les invités', qui: 'ce qu’ils voient et ce qu’ils prennent', marque: '◔', papier: 'invite', exemplaires: '64' },
  { id: 'famille', mot: 'la famille', qui: 'ce qui reste entre vous', marque: '♥', papier: 'invite', exemplaires: '12' },
  { id: 'dj', mot: 'le DJ', qui: 'la playlist, dans l’ordre de la soirée', marque: '♪', papier: 'dj', exemplaires: '1' },
  { id: 'metier', mot: 'les métiers', qui: 'leurs bons de commande', marque: '✳', papier: 'metier', exemplaires: '12' },
];

/** Un ticket, dans un portefeuille : son papier, ses lignes, son numéro. */
export interface TicketAuPortefeuille {
  portefeuille: Portefeuille;
  papier: PortefeuilleDéfini['papier'];
  numero: string;
  lignes: LigneDuTicket[];
  /** Le papier tel que `TicketCaisse` l'imprime. */
  papierLignes: LigneTicket[];
  sousTotal: number;
  remise: number;
  tva: number;
  total: number;
  /** Ce qu'il faut lire en premier sur ce ticket. */
  entête: string;
}

/* ——————————————————————————— LES TOTAUX ——————————————————————————— */

export interface TotauxDuTicket {
  sousTotal: number;
  remise: number;
  tva: number;
  total: number;
  /** Les lignes qui comptent, et celles qui sont incluses. */
  articles: number;
  incluses: number;
}

/**
 * **Le calcul du ticket** : le même que celui du magasin — remise de fidélité
 * dix pour cent, TVA vingt pour cent incluse — mais il ignore les lignes
 * incluses, qui ne chargent pas la note.
 */
export function totauxDuTicket(lignes: LigneDuTicket[]): TotauxDuTicket {
  const avecPrix = lignes.filter((l) => !l.incluse);
  const sousTotal = avecPrix.reduce((n, l) => n + prixDuneLigne(l), 0);
  const remise = Math.round(sousTotal * TAUX_FIDELITE);
  const total = sousTotal - remise;
  const tva = Math.round(total - total / (1 + TVA));
  return {
    sousTotal,
    remise,
    tva,
    total,
    articles: avecPrix.length,
    incluses: lignes.length - avecPrix.length,
  };
}

/** Le numéro du ticket : il ne dépend que de ce qu'on a coché. */
export function numeroDuTicket(cochées: string[]): string {
  return numeroDeTicket([...cochées].sort());
}

/* —————————————————————— CE QUI VA OÙ, LIGNE PAR LIGNE —————————————————————— */

/**
 * **La distribution.** On prend ce qui est coché, et l'on regarde les
 * portefeuilles : chacun reçoit les lignes qui lui reviennent. Un portefeuille
 * vide n'existe pas — il n'y a pas de ticket pour rien.
 */
export function portefeuillesDesCoches(cochées: string[]): TicketAuPortefeuille[] {
  const lignes = lignesCochées(cochées);
  return PORTEFEUILLES.map((portefeuille) => {
    const siennes = lignes.filter((l) => l.vers.includes(portefeuille.id));
    if (!siennes.length) return null;
    const totaux = totauxDuTicket(siennes);
    const papierLignes = papierDeCesLignes(siennes);
    return {
      portefeuille: portefeuille.id,
      papier: portefeuille.papier,
      numero: numeroDeTicket(siennes.map((l) => l.id).sort()),
      lignes: siennes,
      papierLignes,
      sousTotal: totaux.sousTotal,
      remise: totaux.remise,
      tva: totaux.tva,
      total: totaux.total,
      entête: phraseDuPortefeuille(portefeuille.id, siennes),
    };
  }).filter((t): t is TicketAuPortefeuille => t !== null);
}

/** **Les lignes telles que le papier les imprime** — le même format que le magasin. */
export function papierDeCesLignes(lignes: LigneDuTicket[]): LigneTicket[] {
  return lignes.map((l) => ({
    id: l.id,
    label: l.label,
    detail: l.incluse ? `${l.detail} · inclus` : l.detail,
    quantite: l.quantite ?? 1,
    prixUnitaire: l.prix,
    total: prixDuneLigne(l),
    promo: l.promo,
  }));
}

function phraseDuPortefeuille(id: Portefeuille, lignes: LigneDuTicket[]): string {
  const incluses = lignes.filter((l) => l.incluse).length;
  if (id === 'dj') return `${lignes.length} morceaux du répertoire`;
  if (id === 'metier') return `${lignes.length} poste${lignes.length > 1 ? 's' : ''} à tenir`;
  if (incluses === lignes.length) return `${lignes.length} pièce${lignes.length > 1 ? 's' : ''} à emporter`;
  return `${lignes.filter((l) => !l.incluse).length} ligne${lignes.filter((l) => !l.incluse).length > 1 ? 's' : ''} · ${euros(totauxDuTicket(lignes).total)}`;
}

/**
 * **Le vol du ticket.** Quand on coche, le papier part vers les portefeuilles
 * concernés : c'est cette liste qui décide de la trajectoire.
 */
export function portefeuillesVisés(ajoutées: string[]): Portefeuille[] {
  const visés = new Set<Portefeuille>();
  ajoutées.forEach((id) => {
    LIGNES_DU_TICKET.find((l) => l.id === id)?.vers.forEach((p) => visés.add(p));
  });
  return PORTEFEUILLES.filter((p) => visés.has(p.id)).map((p) => p.id);
}

/** Ce qu'un portefeuille contient, une fois tout coché : son compte, et son total. */
export function compteDesPortefeuilles(cochées: string[]): Record<Portefeuille, { lignes: number; total: number }> {
  const compte = {} as Record<Portefeuille, { lignes: number; total: number }>;
  PORTEFEUILLES.forEach((p) => {
    compte[p.id] = { lignes: 0, total: 0 };
  });
  portefeuillesDesCoches(cochées).forEach((t) => {
    compte[t.portefeuille] = { lignes: t.lignes.length, total: t.total };
  });
  return compte;
}

/** La ligne du papier : celle du magasin, ou celle d'un module — même objet. */
export { lignesDuPapier };
