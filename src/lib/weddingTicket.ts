import { DJ_CHRONOLOGICAL_PHASES } from './weddingDjPlaylist';
import { morceauParId, type Morceau } from './weddingPlaylist';

/**
 * LE TERMINAL
 *
 * Ce que les invités prennent, ce qu'ils demandent, et ce qui remonte aux
 * mariés. Le principe est celui des courses : une ligne libre, un invité la
 * prend, elle n'est plus libre — et il repart avec son reçu.
 *
 * Trois objets, et rien d'autre :
 *  - la **prise** : « cet article, c'est moi qui l'offre » (un article = un
 *    invité) ;
 *  - la **demande** : « ce morceau, je le veux » (plusieurs invités peuvent
 *    demander le même — c'est même le meilleur signe) ;
 *  - le **reçu** : ce qu'un invité emporte, encodé dans un lien qu'il envoie aux
 *    mariés. Ouvrir le lien, c'est poser le reçu sur le terminal.
 *
 * Aucun horodatage : on garde l'**ordre d'arrivée** (`rang`), qui suffit à
 * raconter la soirée sans horloge.
 */

export interface Prise {
  articleId: string;
  nom: string;
  /** L'ordre d'arrivée au terminal — pas une heure. */
  rang: number;
}

export interface DemandeMusicale {
  /** L'identifiant du morceau du catalogue, ou `libre:<titre>` pour un titre proposé. */
  cle: string;
  titre: string;
  artiste: string;
  /** Le moment du mariage où la jouer. */
  phaseId: string;
  nom: string;
  rang: number;
  /** Proposé par un invité, hors catalogue. */
  libre?: boolean;
}

/** Un reçu arrivé au terminal : celui d'un invité, avec son code. */
export interface RecuEntrant {
  code: string;
  nom: string;
  articles: string[];
  morceaux: string[];
  titres: Array<{ titre: string; artiste: string }>;
  rang: number;
}

export interface EtatTerminal {
  prises: Prise[];
  demandes: DemandeMusicale[];
  journal: RecuEntrant[];
}

export const TERMINAL_VIDE: EtatTerminal = { prises: [], demandes: [], journal: [] };

/* ————————————————————————— les gestes, en pur ————————————————————————— */

/** Le prochain rang : l'ordre d'arrivée, jamais l'heure. */
function prochainRang(etat: EtatTerminal): number {
  return etat.prises.length + etat.demandes.length + etat.journal.length + 1;
}

/** Qui a pris cette ligne, s'il y a quelqu'un. */
export function preneurDe(etat: EtatTerminal, articleId: string): string | undefined {
  return etat.prises.find((p) => p.articleId === articleId)?.nom;
}

/** Un article = un invité. Le premier arrivé le garde, les autres lisent son nom. */
export function prendre(etat: EtatTerminal, articleId: string, nom: string): EtatTerminal {
  const propre = nom.trim();
  if (!propre || preneurDe(etat, articleId)) return etat;
  return { ...etat, prises: [...etat.prises, { articleId, nom: propre, rang: prochainRang(etat) }] };
}

/** On ne lâche que ce qu'on a pris soi-même. */
export function lacher(etat: EtatTerminal, articleId: string, nom: string): EtatTerminal {
  const prise = etat.prises.find((p) => p.articleId === articleId);
  if (!prise || prise.nom !== nom.trim()) return etat;
  return { ...etat, prises: etat.prises.filter((p) => p.articleId !== articleId) };
}

/** Les articles pris par quelqu'un. */
export function articlesPris(etat: EtatTerminal): string[] {
  return etat.prises.map((p) => p.articleId);
}

/** Les articles encore libres, dans l'ordre du magasin. */
export function articlesLibres(etat: EtatTerminal, ids: string[]): string[] {
  const pris = new Set(articlesPris(etat));
  return ids.filter((id) => !pris.has(id));
}

/** Les reçus groupés par invité, pour la vue des mariés. */
export function prisesParInvite(etat: EtatTerminal): Array<{ nom: string; articles: string[] }> {
  const parNom = new Map<string, string[]>();
  for (const prise of [...etat.prises].sort((a, b) => a.rang - b.rang)) {
    parNom.set(prise.nom, [...(parNom.get(prise.nom) ?? []), prise.articleId]);
  }
  return [...parNom.entries()].map(([nom, articles]) => ({ nom, articles }));
}

/* ————————————————————————— la musique ————————————————————————— */

/** Demandé par quelqu'un ? Plusieurs invités peuvent demander le même morceau. */
export function demandeursDe(etat: EtatTerminal, cle: string): string[] {
  return etat.demandes.filter((d) => d.cle === cle).map((d) => d.nom);
}

export function demander(
  etat: EtatTerminal,
  morceau: { cle: string; titre: string; artiste: string; phaseId: string; libre?: boolean },
  nom: string,
): EtatTerminal {
  const propre = nom.trim();
  if (!propre) return etat;
  // On peut redemander le morceau d'un autre invité : c'est le principe du vote.
  if (etat.demandes.some((d) => d.cle === morceau.cle && d.nom === propre)) return etat;
  return {
    ...etat,
    demandes: [...etat.demandes, { ...morceau, nom: propre, rang: prochainRang(etat) }],
  };
}

export function retirerDemande(etat: EtatTerminal, cle: string, nom: string): EtatTerminal {
  return { ...etat, demandes: etat.demandes.filter((d) => !(d.cle === cle && d.nom === nom.trim())) };
}

/** Ce qu'un invité a demandé, à son nom. */
export function demandesDe(etat: EtatTerminal, nom: string): DemandeMusicale[] {
  return etat.demandes.filter((d) => d.nom === nom.trim());
}

/** Le morceau du catalogue porté par une demande libre, pour l'afficher pareil. */
export function cleLibre(titre: string, artiste: string): string {
  const slug = (v: string) => v.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `libre:${slug(titre)}${artiste ? `-${slug(artiste)}` : ''}`;
}

/* ————————————————————————— le plan du DJ ————————————————————————— */

export interface LigneDj {
  titre: string;
  artiste: string;
  /** Qui l'a demandé — vide quand il vient de la playlist du couple. */
  demandeurs: string[];
  /** Vrai quand le morceau a un extrait audible dans la page. */
  extrait: boolean;
}

export interface BlocDj {
  phaseId: string;
  phaseLabel: string;
  lignes: LigneDj[];
}

/**
 * Le ticket terminal : la playlist complète que le DJ récupère, rangée dans
 * l'ordre de la soirée. Les morceaux du couple d'abord (le socle), puis les
 * demandes des invités — celles du catalogue comme celles qu'ils ont proposées.
 */
export function planDj(morceaux: Morceau[], demandes: DemandeMusicale[]): BlocDj[] {
  const phases = DJ_CHRONOLOGICAL_PHASES.filter((p) => p.id !== 'all');
  const blocs = new Map<string, BlocDj>();
  for (const phase of phases) {
    blocs.set(phase.id, { phaseId: phase.id, phaseLabel: phase.label, lignes: [] });
  }
  const poser = (
    phaseId: string,
    titre: string,
    artiste: string,
    demandeurs: string[],
    extrait: boolean,
  ) => {
    const bloc = blocs.get(phaseId) ?? blocs.get('dancefloor_classics')!;
    const existante = bloc.lignes.find((l) => l.titre.toLowerCase() === titre.toLowerCase());
    if (existante) {
      existante.demandeurs = [...new Set([...existante.demandeurs, ...demandeurs])];
      existante.extrait = existante.extrait || extrait;
      return;
    }
    bloc.lignes.push({ titre, artiste, demandeurs, extrait });
  };

  for (const morceau of morceaux) poser(morceau.phase, morceau.title, morceau.artiste, [], !morceau.suggere);
  for (const demande of demandes) {
    poser(demande.phaseId, demande.titre, demande.artiste, [demande.nom], !demande.libre);
  }

  return phases.map((p) => blocs.get(p.id)!).filter((b) => b.lignes.length > 0);
}

/* ————————————————————————— les reçus ————————————————————————— */

export interface PayloadRecu {
  nom: string;
  articles: string[];
  morceaux: string[];
  titres: Array<{ titre: string; artiste: string }>;
}

/** Le reçu tel qu'un invité l'emporte : son nom, ses lignes, ses morceaux. */
export function recuDe(etat: EtatTerminal, nom: string): PayloadRecu {
  const propre = nom.trim();
  return {
    nom: propre,
    articles: etat.prises.filter((p) => p.nom === propre).map((p) => p.articleId),
    morceaux: demandesDe(etat, propre).filter((d) => !d.libre).map((d) => d.cle),
    titres: demandesDe(etat, propre)
      .filter((d) => d.libre)
      .map((d) => ({ titre: d.titre, artiste: d.artiste })),
  };
}

/** Un reçu vide n'est pas un reçu. */
export function recuVide(recu: PayloadRecu): boolean {
  return recu.articles.length === 0 && recu.morceaux.length === 0 && recu.titres.length === 0;
}

/**
 * Le code du reçu : tout le reçu tient dans l'adresse. Un lien, et le reçu est
 * posé sur le terminal des mariés (voir `entrerRecu`).
 */
export function encoderRecu(recu: PayloadRecu): string {
  const payload = JSON.stringify({
    n: recu.nom,
    a: recu.articles,
    m: recu.morceaux,
    t: recu.titres.map((t) => [t.titre, t.artiste]),
  });
  const base = typeof btoa === 'function' ? btoa(unescape(encodeURIComponent(payload))) : '';
  return base.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decoderRecu(code: string): PayloadRecu | null {
  try {
    const base = code.replace(/-/g, '+').replace(/_/g, '/');
    const complet = base.padEnd(Math.ceil(base.length / 4) * 4, '=');
    const json = decodeURIComponent(escape(atob(complet)));
    const brut = JSON.parse(json) as { n?: unknown; a?: unknown; m?: unknown; t?: unknown };
    const liste = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);
    const titres = Array.isArray(brut.t)
      ? brut.t
        .filter((t): t is unknown[] => Array.isArray(t))
        .map((t) => ({ titre: String(t[0] ?? ''), artiste: String(t[1] ?? '') }))
        .filter((t) => t.titre)
      : [];
    const nom = typeof brut.n === 'string' ? brut.n : '';
    if (!nom) return null;
    return { nom, articles: liste(brut.a), morceaux: liste(brut.m), titres };
  } catch {
    return null;
  }
}

/**
 * Poser un reçu sur le terminal : les lignes qu'il contient sont marquées comme
 * prises au nom de l'invité, et le reçu entre au journal. Deux fois le même
 * code ne change rien — on peut rouvrir le lien sans compter double.
 */
export function entrerRecu(etat: EtatTerminal, recu: PayloadRecu, code: string): EtatTerminal {
  if (recuVide(recu)) return etat;
  if (etat.journal.some((r) => r.code === code)) return etat;

  const rang = prochainRang(etat);
  const dejaPris = new Set(articlesPris(etat));
  const prises = [
    ...etat.prises,
    ...recu.articles
      .filter((id) => !dejaPris.has(id))
      .map((articleId, i) => ({ articleId, nom: recu.nom, rang: rang + i })),
  ];

  const dejaDemande = new Set(etat.demandes.map((d) => `${d.cle}|${d.nom}`));
  const demandes = [
    ...etat.demandes,
    // Un morceau du catalogue reprend son titre, son artiste et son moment :
    // le ticket du DJ ne doit jamais afficher un identifiant.
    ...recu.morceaux
      .filter((cle) => !dejaDemande.has(`${cle}|${recu.nom}`))
      .map((cle, i) => {
        const morceau = morceauParId(cle);
        return {
          cle,
          titre: morceau?.title ?? cle,
          artiste: morceau?.artiste ?? '',
          phaseId: morceau?.phase ?? 'dancefloor_classics',
          nom: recu.nom,
          rang: rang + i,
        };
      }),
    ...recu.titres
      .map((t, i) => ({
        cle: cleLibre(t.titre, t.artiste),
        titre: t.titre,
        artiste: t.artiste,
        phaseId: 'dancefloor_classics',
        nom: recu.nom,
        rang: rang + i,
        libre: true,
      }))
      .filter((d) => !dejaDemande.has(`${d.cle}|${d.nom}`)),
  ];

  return {
    prises,
    demandes,
    journal: [
      ...etat.journal,
      {
        code,
        nom: recu.nom,
        articles: recu.articles,
        morceaux: recu.morceaux,
        titres: recu.titres,
        rang,
      },
    ],
  };
}

/* ————————————————————————— la mémoire ————————————————————————— */

const CLE = 'vows:terminal';

const cleDe = (styleId: string): string => (styleId ? `${CLE}:${styleId}` : CLE);

export function chargerTerminal(styleId = ''): EtatTerminal {
  try {
    const brut = localStorage.getItem(cleDe(styleId));
    if (!brut) return TERMINAL_VIDE;
    const etat = JSON.parse(brut) as Partial<EtatTerminal>;
    return {
      prises: Array.isArray(etat.prises) ? etat.prises : [],
      demandes: Array.isArray(etat.demandes) ? etat.demandes : [],
      journal: Array.isArray(etat.journal) ? etat.journal : [],
    };
  } catch {
    return TERMINAL_VIDE;
  }
}

export function enregistrerTerminal(etat: EtatTerminal, styleId = ''): void {
  try {
    localStorage.setItem(cleDe(styleId), JSON.stringify(etat));
  } catch {
    // stockage indisponible : le terminal vit le temps de la visite
  }
}

/* ————————————————————————— les phrases ————————————————————————— */

/** Ce que le terminal affiche en haut : où en sont les courses. */
export function avancement(etat: EtatTerminal, totalArticles: number): { pris: number; total: number; phrase: string } {
  const pris = etat.prises.length;
  const phrase = pris === 0
    ? 'Personne n’a encore pris de ligne.'
    : `${pris} ligne${pris > 1 ? 's' : ''} prise${pris > 1 ? 's' : ''} · ${totalArticles - pris} encore libre${totalArticles - pris > 1 ? 's' : ''}`;
  return { pris, total: totalArticles, phrase };
}

/** La phrase qui signe un reçu : le nom, ou l'anonyme du magasin. */
export function signataire(nom: string): string {
  return nom.trim() || 'Invité anonyme';
}

/* ————————————————————————— la carte de fidélité ————————————————————————— */

const CLE_NOM = 'vows:nom';

/** Le nom de l'invité est gardé : il signe ses reçus sans le retaper. */
export function chargerNom(styleId = ''): string {
  try {
    return localStorage.getItem(styleId ? `${CLE_NOM}:${styleId}` : CLE_NOM) ?? '';
  } catch {
    return '';
  }
}

export function enregistrerNom(nom: string, styleId = ''): void {
  try {
    localStorage.setItem(styleId ? `${CLE_NOM}:${styleId}` : CLE_NOM, nom);
  } catch {
    // stockage indisponible : le nom vit le temps de la visite
  }
}
