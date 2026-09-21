import {
  LIGNES_DU_TICKET,
  catégorieDeLaLigne,
  type CatégorieDuTicket,
  type LigneDuTicket,
} from './categoriesDuTicket';
import {
  ORDRE_DES_FAMILLES,
  fileDeLaFamille,
  lAgentFaitPasser,
  motifDeLaLigne,
  motDeLaFamille,
  sousDeLaFamille,
} from './agentDuTicket';

/* LA MACHINE, EN FONCTIONS PURES — UNE TOUCHE FAIT TOUJOURS QUELQUE CHOSE
 *
 * Tout l'état de la machine tient ici, et **chaque geste rend un état
 * différent** : c'est la règle, et c'est testable sans navigateur.
 *
 * Trois temps, les deux mêmes touches :
 *
 * 1. **la famille** — « LE JOUR J, 48 lignes ». ✓ la passe en revue, ✗ propose
 *    la suivante ;
 * 2. **la ligne** — ✓ la met sur le ticket (`pris`), ✗ passe à la suivante ;
 * 3. **le reçu** — ✓ revient aux propositions, ✗ vide le ticket.
 *
 * Le geste dit aussi ce qu'il faut imprimer (`pris`) et ce qu'il faut écrire
 * sur l'écran (`mot`) : l'appelant n'a plus qu'à le faire.
 *
 * ```txt
 *   étatInitial() ──✓──> famille ouverte ──✓──> ligne sur le ticket ──✓──> …
 *        │                     │                       │
 *        ✗ famille suivante    ✗ ligne suivante        ✗ ligne suivante
 * ```
 */

/** Ce que l'écran montre : une ligne à prendre, ou une famille à ouvrir. */
export type Proposition =
  | {
      genre: 'ligne';
      ligne: LigneDuTicket;
      /** Le mot de la demande qui l'a fait venir — `null` quand elle vient d'une famille. */
      motif: string | null;
      /** Le rang dans la file, et sa taille : « 3 / 12 ». */
      rang: number;
      taille: number;
      /** D'où elle vient : sa famille, et sa catégorie. */
      groupe: CatégorieDuTicket['groupe'];
      catégorie: string;
    }
  | {
      genre: 'famille';
      groupe: CatégorieDuTicket['groupe'];
      /** Combien de lignes, dedans, et ce que la famille promet. */
      lignes: number;
      sous: string;
      rang: number;
      taille: number;
    };

/** La demande, telle que l'agent l'a entendue. */
export interface DemandeEntendue {
  /** Ce qu'on a écrit, mot pour mot. */
  texte: string;
  /** Les mots qu'il a vraiment entendus — écrits comme on les a écrits. */
  mots: string[];
  /** Il n'a rien trouvé : il propose les familles, plutôt que de se taire. */
  àVide: boolean;
}

/** Tout l'état de la machine. Rien d'autre n'est nécessaire pour la faire marcher. */
export interface ÉtatDeLaMachine {
  /** Ce qui est sur le ticket, dans l'ordre du catalogue. */
  coches: string[];
  /** La file des lignes proposées — `null` quand la machine propose une famille. */
  file: string[] | null;
  /** Où l'on en est dans la file. */
  rang: number;
  /** La famille proposée : son rang dans les trois. */
  famille: number;
  /** La demande écrite, et les mots que l'agent a entendus. */
  demande: string;
  mots: string[];
  /** L'écran : les propositions, le ticket entier, ou le mini-site composé. */
  écran: 'propositions' | 'ticket' | 'site';
}

/** Ce qu'un geste laisse derrière lui. */
export interface Geste {
  /** L'état d'après — toujours différent de celui d'avant. */
  état: ÉtatDeLaMachine;
  /** La ligne qui vient d'être cochée : c'est elle qu'on imprime. */
  pris: string | null;
  /** Ce qu'on écrit sur l'écran, un instant. */
  mot: string | null;
}

/** **L'état du départ.** La machine propose la première famille, et rien d'autre. */
export function étatInitial(
  options: { coches?: string[]; demande?: string; écran?: 'propositions' | 'ticket' | 'site' } = {},
): ÉtatDeLaMachine {
  const coches = options.coches ?? [];
  const texte = (options.demande ?? '').trim();
  const entendue = texte ? lAgentFaitPasser(texte, coches) : null;
  return {
    coches,
    file: entendue && entendue.lignes.length > 0 ? entendue.lignes.map((l) => l.id) : null,
    rang: 0,
    famille: 0,
    demande: texte,
    mots: entendue?.mots ?? [],
    écran: options.écran === 'ticket' || options.écran === 'site' ? options.écran : 'propositions',
  };
}

/** **Ce que la machine propose, là, maintenant.** Il y a toujours quelque chose. */
export function propositionDeLÉtat(état: ÉtatDeLaMachine): Proposition {
  const courante = état.file ? état.file[état.rang] : undefined;
  const ligne = courante ? LIGNES_DU_TICKET.find((l) => l.id === courante) : undefined;
  if (ligne) {
    return {
      genre: 'ligne',
      ligne,
      motif: état.mots.length > 0 ? motifDeLaLigne(ligne, état.mots) : null,
      rang: état.rang + 1,
      taille: état.file?.length ?? 1,
      groupe: catégorieDeLaLigne(ligne.id)?.groupe ?? 'jour',
      catégorie: catégorieDeLaLigne(ligne.id)?.mot ?? '',
    };
  }
  const groupe = ORDRE_DES_FAMILLES[état.famille] ?? ORDRE_DES_FAMILLES[0]!;
  return {
    genre: 'famille',
    groupe,
    lignes: fileDeLaFamille(groupe, état.coches).length,
    sous: sousDeLaFamille(groupe),
    rang: état.famille + 1,
    taille: ORDRE_DES_FAMILLES.length,
  };
}

/** Ce que l'écran dit de la demande, quand il y en a une. */
export function demandeDeLÉtat(état: ÉtatDeLaMachine): DemandeEntendue | null {
  return état.demande
    ? { texte: état.demande, mots: état.mots, àVide: (état.file?.length ?? 0) === 0 }
    : null;
}

/** **Ouvrir une famille** : ses lignes passent une par une, dans l'ordre. */
export function ouvrirLaFamille(état: ÉtatDeLaMachine, groupe: CatégorieDuTicket['groupe']): Geste {
  const file = fileDeLaFamille(groupe, état.coches).map((l) => l.id);
  return {
    état: {
      ...état,
      file,
      rang: 0,
      famille: Math.max(0, ORDRE_DES_FAMILLES.indexOf(groupe)),
      demande: '',
      mots: [],
      écran: 'propositions',
    },
    pris: null,
    mot: `${motDeLaFamille(groupe)} — prête à passer`,
  };
}

/** **Écrire une demande** : l'agent entend, trie, et fait passer ce qui répond. */
export function écrireLaDemande(état: ÉtatDeLaMachine, texte: string): Geste {
  const entendue = lAgentFaitPasser(texte, état.coches);
  return {
    état: {
      ...état,
      file: entendue.lignes.length > 0 ? entendue.lignes.map((l) => l.id) : null,
      rang: 0,
      demande: texte,
      mots: entendue.mots,
      écran: 'propositions',
    },
    pris: null,
    mot:
      entendue.lignes.length === 0
        ? 'rien de tel — je vous propose mes familles'
        : `entendu : ${entendue.mots.join(' · ')}`,
  };
}

/** **✓** — on prend ce qui est proposé. */
export function valider(état: ÉtatDeLaMachine): Geste {
  if (état.écran === 'ticket' || état.écran === 'site') {
    return { état: { ...état, écran: 'propositions' }, pris: null, mot: 'retour aux propositions' };
  }
  const proposition = propositionDeLÉtat(état);
  if (proposition.genre === 'famille') return ouvrirLaFamille(état, proposition.groupe);

  const déjà = état.coches.includes(proposition.ligne.id);
  return {
    état: {
      ...état,
      coches: déjà ? état.coches : [...état.coches, proposition.ligne.id],
      rang: état.rang + 1,
    },
    pris: déjà ? null : proposition.ligne.id,
    mot: `${proposition.ligne.label} — sur le ticket`,
  };
}

/** **✗** — on passe. Sur une famille, on passe à la famille suivante. */
export function passer(état: ÉtatDeLaMachine): Geste {
  if (état.écran === 'site') {
    return { état: { ...état, écran: 'propositions' }, pris: null, mot: 'retour aux propositions' };
  }
  if (état.écran === 'ticket') {
    return { état: { ...état, coches: [] }, pris: null, mot: 'ticket vidé' };
  }
  const proposition = propositionDeLÉtat(état);
  if (proposition.genre === 'famille') {
    return {
      état: { ...état, file: null, rang: 0, famille: (état.famille + 1) % ORDRE_DES_FAMILLES.length },
      pris: null,
      mot: 'la famille suivante',
    };
  }
  return {
    état: { ...état, rang: état.rang + 1 },
    pris: null,
    mot: `${proposition.ligne.label} — laissée de côté`,
  };
}

/** Le bouton rond du reçu : l'écran passe au ticket entier, et revient. */
export function basculerLeTicket(état: ÉtatDeLaMachine): Geste {
  const ouvert = état.écran === 'ticket';
  return {
    état: { ...état, écran: ouvert ? 'propositions' : 'ticket' },
    pris: null,
    mot: ouvert ? 'retour aux propositions' : 'le ticket, entier',
  };
}

/**
 * **Le bouton rond du mini-site** : l'écran montre ce que la machine a composé
 * pour les invités — les blocs allumés, et l'adresse à envoyer.
 */
export function basculerLeSite(état: ÉtatDeLaMachine): Geste {
  const ouvert = état.écran === 'site';
  return {
    état: { ...état, écran: ouvert ? 'propositions' : 'site' },
    pris: null,
    mot: ouvert ? 'retour aux propositions' : 'le mini-site des invités',
  };
}

/** Retirer une ligne du ticket, de la main, depuis l'écran. */
export function retirer(état: ÉtatDeLaMachine, id: string): Geste {
  return {
    état: { ...état, coches: état.coches.filter((c) => c !== id) },
    pris: null,
    mot: 'ligne retirée du ticket',
  };
}
