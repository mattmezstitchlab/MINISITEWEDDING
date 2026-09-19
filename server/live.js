/**
 * LE COMPTOIR PARTAGÉ — LES RÈGLES, CÔTÉ SERVEUR
 *
 * La page « le mariage, en entier » est ouverte à tous : le couple prépare, les
 * invités prennent une ligne et demandent des morceaux, et le comptoir des
 * mariés se remplit tout seul. Ce fichier applique les gestes sur l'état
 * partagé — c'est la seule autorité quand une base est branchée.
 *
 * Les mêmes règles existent côté navigateur (`appliquerGeste` dans
 * `src/lib/weddingTicket.ts`), mot pour mot, pour le mode local et pour
 * l'affichage optimiste. Deux portages, une seule règle :
 *
 *  - **une prise** : un article = un invité. Le premier arrivé le garde, et l'on
 *    ne lâche que ce qu'on a pris soi-même ;
 *  - **une demande** : plusieurs invités peuvent demander le même morceau ;
 *    on ne demande pas deux fois le même à son propre nom ;
 *  - **un reçu** : il entre au journal une fois, et rouvrir son lien ne compte
 *    jamais double (idempotent par code).
 *
 * Aucun horodatage : `rang` dit l'ordre d'arrivée, et il suffit.
 */

export const LIVE_VIDE = { prises: [], demandes: [], journal: [], avis: {} };

/** L'état relu tel qu'il est stocké : jamais de champ manquant. */
export function normaliser(payload) {
  const etat = payload && typeof payload === 'object' ? payload : {};
  return {
    prises: Array.isArray(etat.prises) ? etat.prises : [],
    demandes: Array.isArray(etat.demandes) ? etat.demandes : [],
    journal: Array.isArray(etat.journal) ? etat.journal : [],
    avis: etat.avis && typeof etat.avis === 'object' ? etat.avis : {},
  };
}

const texte = (v) => (typeof v === 'string' ? v.trim() : '');

function prochainRang(etat) {
  return etat.prises.length + etat.demandes.length + etat.journal.length + 1;
}

export function preneurDe(etat, articleId) {
  const prise = etat.prises.find((p) => p.articleId === articleId);
  return prise ? prise.nom : undefined;
}

/**
 * Un geste, appliqué. Retourne le nouvel état, ou `null` quand le geste ne
 * change rien (ligne déjà prise, rien à lâcher, reçu déjà au journal) — la
 * route le dit alors à l'appelant, sans écrire en base pour rien.
 */
export function appliquerGeste(payload, geste) {
  const etat = normaliser(payload);
  if (!geste || typeof geste !== 'object') return null;
  const nom = texte(geste.nom);
  const type = geste.type;

  /* Un cœur sur une carte : le compteur du sujet monte (ou redescend). Les avis
     sont publics — c'est la température de la page, jamais un nom. */
  if (type === 'aimer') {
    const cle = texte(geste.cle);
    if (!cle) return null;
    const avant = Math.max(0, Number(etat.avis[cle]) || 0);
    const apres = Math.max(0, avant + (geste.sens === 'moins' ? -1 : 1));
    if (apres === avant) return null;
    return { ...etat, avis: { ...etat.avis, [cle]: apres } };
  }

  if (type === 'prendre') {
    const articleId = texte(geste.articleId);
    if (!articleId || !nom || preneurDe(etat, articleId)) return null;
    return { ...etat, prises: [...etat.prises, { articleId, nom, rang: prochainRang(etat) }] };
  }

  if (type === 'lacher') {
    const articleId = texte(geste.articleId);
    const prise = etat.prises.find((p) => p.articleId === articleId);
    if (!prise || prise.nom !== nom) return null;
    return { ...etat, prises: etat.prises.filter((p) => p.articleId !== articleId) };
  }

  if (type === 'demander') {
    const cle = texte(geste.cle);
    if (!cle || !nom) return null;
    if (etat.demandes.some((d) => d.cle === cle && d.nom === nom)) return null;
    return {
      ...etat,
      demandes: [
        ...etat.demandes,
        {
          cle,
          titre: texte(geste.titre) || cle,
          artiste: texte(geste.artiste),
          phaseId: texte(geste.phaseId) || 'dancefloor_classics',
          nom,
          rang: prochainRang(etat),
          ...(geste.libre ? { libre: true } : {}),
        },
      ],
    };
  }

  if (type === 'retirerDemande') {
    const cle = texte(geste.cle);
    if (!cle || !nom) return null;
    const avant = etat.demandes.length;
    const demandes = etat.demandes.filter((d) => !(d.cle === cle && d.nom === nom));
    return demandes.length === avant ? null : { ...etat, demandes };
  }

  /* Le reçu d'un invité : il pose ses lignes et ses morceaux, puis entre au
     journal. Envoyé deux fois (le lien rouvert), il ne compte qu'une. */
  if (type === 'journaliser') {
    const code = texte(geste.code);
    const recu = geste.recu && typeof geste.recu === 'object' ? geste.recu : null;
    if (!code || !recu || !nom) return null;
    if (etat.journal.some((r) => r.code === code)) return null;

    let suivant = etat;
    for (const articleId of Array.isArray(geste.articles) ? geste.articles : []) {
      suivant = appliquerGeste(suivant, { type: 'prendre', articleId, nom }) || suivant;
    }
    for (const demande of Array.isArray(geste.demandes) ? geste.demandes : []) {
      suivant = appliquerGeste(suivant, { type: 'demander', nom, ...demande }) || suivant;
    }

    return {
      ...suivant,
      journal: [
        ...suivant.journal,
        {
          code,
          nom,
          articles: Array.isArray(geste.articles) ? geste.articles : [],
          morceaux: registre(geste.demandes, false),
          titres: registre(geste.demandes, true),
          rang: prochainRang(suivant),
        },
      ],
    };
  }

  return null;
}

/** Ce que le reçu a laissé : ses morceaux du catalogue, ou ses titres libres. */
function registre(demandes, libres) {
  if (!Array.isArray(demandes)) return [];
  return demandes
    .filter((d) => d && Boolean(d.libre) === libres)
    .map((d) => (libres ? { titre: texte(d.titre), artiste: texte(d.artiste) } : texte(d.cle)))
    .filter((v) => (typeof v === 'string' ? v.length > 0 : Boolean(v.titre)));
}

/** Les invités passés au comptoir : les noms, une fois chacun. */
export function invitesAuComptoir(payload) {
  const etat = normaliser(payload);
  return [...new Set([...etat.prises.map((p) => p.nom), ...etat.demandes.map((d) => d.nom)])].filter(Boolean);
}
