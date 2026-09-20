import { morceauParId } from './weddingPlaylist';
import {
  cleLibre, demander, entrerRecu, lacher, prendre, retirerDemande,
  type EtatTerminal, type PayloadRecu,
} from './weddingTicket';

/**
 * LES GESTES DU COMPTOIR
 *
 * Un geste est ce qu'un invité fait, réduit à l'essentiel : « je prends cette
 * ligne », « je demande ce morceau », « voici mon reçu ». Le front les envoie
 * tels quels — c'est le serveur qui les applique sur l'état partagé
 * (`server/live.js`), et le navigateur les applique de la même façon quand
 * aucune base n'est branchée (`localApi.ts`) ou pour répondre tout de suite.
 *
 * Cette couche ne sait rien de l'affichage : elle traduit un geste en état.
 */

export type Geste =
  /** Un cœur sur une carte : le compteur du sujet monte (ou redescend). */
  | { type: 'aimer'; cle: string; sens?: 'plus' | 'moins' }
  | { type: 'prendre'; articleId: string; nom: string }
  | { type: 'lacher'; articleId: string; nom: string }
  | { type: 'demander'; cle: string; titre: string; artiste: string; phaseId: string; nom: string; libre?: boolean }
  | { type: 'retirerDemande'; cle: string; nom: string }
  | {
    type: 'journaliser';
    code: string;
    nom: string;
    articles: string[];
    demandes: Array<{ cle: string; titre: string; artiste: string; phaseId: string; libre?: boolean }>;
    recu: PayloadRecu;
  };

/** Un cœur de plus (ou de moins) sur un sujet. Jamais en dessous de zéro. */
function basculerAvis(etat: EtatTerminal, cle: string, pas: number): EtatTerminal {
  const propre = cle.trim();
  if (!propre) return etat;
  const avant = Math.max(0, etat.avis[propre] ?? 0);
  const apres = Math.max(0, avant + pas);
  if (apres === avant) return etat;
  return { ...etat, avis: { ...etat.avis, [propre]: apres } };
}

/**
 * Applique un geste. Retourne le nouvel état, ou `null` quand le geste ne
 * change rien — ligne déjà prise, rien à lâcher, reçu déjà au journal.
 */
export function appliquerGeste(etat: EtatTerminal, geste: Geste): EtatTerminal | null {
  switch (geste.type) {
    case 'aimer': {
      const suivant = basculerAvis(etat, geste.cle, geste.sens === 'moins' ? -1 : 1);
      return suivant === etat ? null : suivant;
    }
    case 'prendre': {
      const suivant = prendre(etat, geste.articleId, geste.nom);
      return suivant === etat ? null : suivant;
    }
    case 'lacher': {
      const suivant = lacher(etat, geste.articleId, geste.nom);
      return suivant === etat ? null : suivant;
    }
    case 'demander': {
      const suivant = demander(etat, geste, geste.nom);
      return suivant === etat ? null : suivant;
    }
    case 'retirerDemande': {
      const suivant = retirerDemande(etat, geste.cle, geste.nom);
      return suivant.demandes.length === etat.demandes.length ? null : suivant;
    }
    case 'journaliser': {
      const suivant = entrerRecu(etat, geste.recu, geste.code);
      return suivant === etat ? null : suivant;
    }
    default:
      return null;
  }
}

/**
 * Le reçu d'un invité, décomposé en gestes : ses lignes, ses morceaux (résolus
 * depuis le catalogue, pour que le ticket du DJ ne porte jamais un identifiant),
 * puis le reçu lui-même au journal.
 */
export function gestesDuRecu(recu: PayloadRecu, code: string): Geste[] {
  const nom = recu.nom.trim();
  const gestes: Geste[] = [];

  for (const articleId of recu.articles) gestes.push({ type: 'prendre', articleId, nom });

  const catalogue = recu.morceaux
    .map((cle) => ({ cle, morceau: morceauParId(cle) }))
    .map(({ cle, morceau }) => ({
      cle,
      titre: morceau?.title ?? cle,
      artiste: morceau?.artiste ?? '',
      phaseId: morceau?.phase ?? 'dancefloor_classics',
    }));

  const libres = recu.titres.map((t) => ({
    cle: cleLibre(t.titre, t.artiste),
    titre: t.titre,
    artiste: t.artiste,
    phaseId: 'dancefloor_classics',
    libre: true,
  }));

  for (const demande of [...catalogue, ...libres]) gestes.push({ type: 'demander', nom, ...demande });

  gestes.push({
    type: 'journaliser',
    code,
    nom,
    articles: recu.articles,
    demandes: [...catalogue, ...libres],
    recu,
  });
  return gestes;
}

/** Les invités passés au comptoir : les noms, une fois chacun. */
export function invitesAuComptoir(etat: EtatTerminal): string[] {
  return [...new Set([...etat.prises.map((p) => p.nom), ...etat.demandes.map((d) => d.nom)])].filter(Boolean);
}

/**
 * Le geste qui mène d'un état à l'autre.
 *
 * Les composants n'ont pas à connaître les gestes : ils disent « ces articles
 * sont cochés », « ce morceau est demandé ». Cette fonction retrouve le ou les
 * gestes qui expliquent la différence — c'est ce qui part au comptoir partagé.
 */
export function gesteDepuis(avant: EtatTerminal, apres: EtatTerminal): Geste | null {
  // Une prise en plus (ou une lâchée) : on rend le premier écart, et l'appelant
  // rappellera pour le suivant — les gestes sont journalisés à la suite.
  if (apres.prises.length > avant.prises.length) {
    const avantIds = new Set(avant.prises.map((p) => p.articleId));
    const nouvelle = apres.prises.find((p) => !avantIds.has(p.articleId));
    return nouvelle ? { type: 'prendre', articleId: nouvelle.articleId, nom: nouvelle.nom } : null;
  }
  if (apres.prises.length < avant.prises.length) {
    const apresIds = new Set(apres.prises.map((p) => p.articleId));
    const perdue = avant.prises.find((p) => !apresIds.has(p.articleId));
    return perdue ? { type: 'lacher', articleId: perdue.articleId, nom: perdue.nom } : null;
  }

  const cle = (d: { cle: string; nom: string }) => `${d.cle}|${d.nom}`;
  if (apres.demandes.length > avant.demandes.length) {
    const avantCles = new Set(avant.demandes.map(cle));
    const nouvelle = apres.demandes.find((d) => !avantCles.has(cle(d)));
    if (!nouvelle) return null;
    return {
      type: 'demander',
      cle: nouvelle.cle,
      titre: nouvelle.titre,
      artiste: nouvelle.artiste,
      phaseId: nouvelle.phaseId,
      nom: nouvelle.nom,
      ...(nouvelle.libre ? { libre: true } : {}),
    };
  }
  if (apres.demandes.length < avant.demandes.length) {
    const apresCles = new Set(apres.demandes.map(cle));
    const perdue = avant.demandes.find((d) => !apresCles.has(cle(d)));
    return perdue ? { type: 'retirerDemande', cle: perdue.cle, nom: perdue.nom } : null;
  }

  return null;
}
