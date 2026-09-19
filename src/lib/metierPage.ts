import { magasinFor, type MagasinUnivers } from './weddingPage';
import { metiersParDomaine, DOMAINES, type MetierDuDomaine } from './weddingVendors';
import { donneesMetier, modulesDuMetier, type MetierModule } from './vendorModules';
import { partageAvecLesMaries, type Partage } from './vendorDraft';
import { THEME_CONFIGS } from './themeConfigs';
import { contentFor } from './universeContent';
import { getScenesForStyle, type ThemeTimelineScene } from './themeTimelineScenarios';
import { styleById, type WeddingStyle } from './weddingStyles';
import type { Article } from './superMariage';

/**
 * LA PAGE ENTIÈRE D'UN MÉTIER
 *
 * La page des mariés a montré le chemin : une grande page verticale, bien
 * espacée, qui suffit pour tout. Chaque métier a la sienne — et c'est la même :
 * son hero, ce qui vient des mariés, ce qu'il a à faire ce jour-là, ce qu'il
 * touche, et les autres métiers.
 *
 * Ce qui relie tout, c'est la source : le programme, les chiffres, la table, la
 * playlist et le comptoir viennent de la page du mariage. Un métier ne
 * ressaisit rien — il lit.
 */

export interface PageMetier {
  slug: string;
  role: string;
  short: string;
  /** Le domaine (DJ & Régie son, Cuisine & Traiteur…). */
  domaine: { key: string; label: string };
  /** L'univers de référence : le premier qui mobilise ce métier. */
  styleId: string;
  style: WeddingStyle;
  /** Tous les univers qui appellent ce métier. */
  universes: Array<{ id: string; name: string }>;
  /** Sa mission dans l'univers de référence, quand elle y est écrite. */
  mission?: { role: string; mission: string; essentialSkill: string };
  /** Les modules de son métier : sa langue, ses chiffres, ses cachets. */
  modules: MetierModule[];
  /** Ce que les mariés lui donnent, sans qu'il ait à le demander. */
  partages: Partage[];
  /** Les moments du jour J où il intervient. */
  scenes: ThemeTimelineScene[];
  /** Ses lignes sur le ticket du mariage (son rayon du magasin). */
  lignes: Article[];
  /** Le rayon dont ces lignes viennent, et son libellé. */
  rayon?: { key: string; label: string };
  /** Le prix de sa ligne, tel qu'il est écrit sur le ticket. */
  prix: number;
  /** Le magasin de l'univers de référence : enseigne, rayons, caisse. */
  magasin: MagasinUnivers;
  /** Vrai pour les métiers de la musique : leur page porte la playlist. */
  musique: boolean;
  /** Vrai pour le DJ : sa page porte le terminal de la soirée. */
  dj: boolean;
  /** La fiche de l'article de magazine : le métier raconté par son univers. */
  recit: { titre: string; annonce: string; texte: string };
}

/* ———————————————————————— le slug d'un métier ———————————————————————— */

/** « Photographe Pop-Flash 90s » → « photographe-pop-flash-90s ». */
export function slugDeRole(role: string): string {
  return role
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Tous les métiers du catalogue, à plat, avec leur domaine. */
export function tousLesMetiers(): Array<MetierDuDomaine & { key: string; label: string }> {
  return metiersParDomaine().flatMap((domaine) =>
    domaine.metiers.map((metier) => ({ ...metier, key: domaine.key, label: domaine.label })),
  );
}

export function metierParSlug(slug: string): (MetierDuDomaine & { key: string; label: string }) | null {
  return tousLesMetiers().find((m) => slugDeRole(m.role) === slug) ?? null;
}

/* ————————————————————— le rayon qui porte ce métier ————————————————————— */

/**
 * À quel rayon du magasin un domaine correspond : le chef lit la table, le
 * régisseur lit les horaires, les métiers du décor lisent les petits prix. Les
 * métiers de la musique n'ont pas de rayon : leur page porte la playlist.
 */
const RAYON_PAR_DOMAINE: Record<string, string> = {
  chef: 'rayon-table',
  patissier: 'rayon-table',
  mixologue: 'rayon-table',
  officiant: 'rayon-moments',
  regisseur: 'rayon-moments',
  photographe: 'rayon-plus',
  fleuriste: 'rayon-plus',
  createur: 'rayon-plus',
  artisan: 'rayon-plus',
  polyvalent: 'rayon-plus',
  dj: 'rayon-moments',
  musicien: 'rayon-moments',
};

/** Les métiers de la musique : leur page parle de sons, pas de lignes. */
export function estMetierMusique(role: string): boolean {
  const d = role.toLowerCase();
  return d.includes('dj') || d.includes('musicien') || d.includes('groupe') || d.includes('orchestre')
    || d.includes('chanteur') || d.includes('violon') || d.includes('polyphonique') || d.includes('saxo')
    || d.includes('pianiste') || d.includes('batteur') || d.includes('chœur') || d.includes('chorale');
}

export function estDj(role: string): boolean {
  return role.toLowerCase().includes('dj');
}

/* ————————————————————————— la page d'un métier ————————————————————————— */

const cache = new Map<string, PageMetier | null>();

export function pageMetier(slug: string): PageMetier | null {
  if (cache.has(slug)) return cache.get(slug)!;
  const metier = metierParSlug(slug);
  if (!metier) {
    cache.set(slug, null);
    return null;
  }

  const styleId = metier.universes[0]?.id ?? 'supermarche';
  const style = styleById(styleId);
  const contenu = contentFor(style);
  const magasin = magasinFor(styleId);
  const domaine = DOMAINES[metier.key] ?? DOMAINES.polyvalent;
  // Le domaine fait foi : un « Acousticien » est de la musique, même si son
  // intitulé ne dit ni DJ ni musicien.
  const musique = metier.key === 'dj' || metier.key === 'musicien' || estMetierMusique(metier.role);
  const dj = metier.key === 'dj' || estDj(metier.role);

  const donnees = donneesMetier(style, metier.role);
  const modules = modulesDuMetier(donnees);
  const partages = partageAvecLesMaries(donnees);

  /* Ses lignes : sa propre ligne sur le ticket, puis le rayon de son domaine —
     la table pour un chef, le décor pour un fleuriste, les horaires pour un
     régisseur. Ce qu'il touche, sans le ressaisir. */
  const rayonKey = RAYON_PAR_DOMAINE[metier.key] ?? 'rayon-plus';
  const rayon = magasin.rayons.find((r) => r.key === rayonKey);
  const saLigne = magasin.rayons.find((r) => r.key === 'rayon-metiers')?.articles.find((a) => a.id === `metier-${metier.role}`);
  const lignes = [saLigne, ...(rayon?.articles ?? [])].filter((a): a is Article => Boolean(a));

  const editorial = THEME_CONFIGS[styleId]?.editorial;
  const recit = {
    titre: `${metier.short}, ${domaine.label.toLowerCase()}`,
    annonce: editorial?.hero_subtitle ?? contenu.hero.subtitle,
    texte:
      `${metier.role} intervient à ${contenu.couple.venue} pour ${contenu.couple.names} — ${contenu.couple.guests} convives, ` +
      `le ${contenu.couple.date}. ${donnees.mission?.mission ?? `Le métier qui tient ${style.name}.`} ` +
      `Sa page lit le programme, la table et la playlist des mariés : rien à ressaisir, tout est déjà là.`,
  };

  const page: PageMetier = {
    slug,
    role: metier.role,
    short: metier.short,
    domaine: { key: metier.key, label: metier.label },
    styleId,
    style,
    universes: metier.universes,
    mission: donnees.mission,
    modules,
    partages,
    scenes: getScenesForStyle(styleId),
    lignes,
    rayon: rayon ? { key: rayon.key, label: rayon.label } : undefined,
    prix: saLigne?.prix ?? 0,
    magasin,
    musique,
    dj,
    recit,
  };
  cache.set(slug, page);
  return page;
}

/** Les métiers qui tournent autour de celui-ci : même univers, puis même domaine. */
export function metiersVoisins(page: PageMetier, limite = 12): Array<{ slug: string; role: string; short: string; label: string; styleId: string }> {
  const tous = tousLesMetiers();
  const deLUnivers = tous.filter((m) => m.role !== page.role && m.universes.some((u) => u.id === page.styleId));
  const duDomaine = tous.filter(
    (m) => m.role !== page.role && m.key === page.domaine.key && !deLUnivers.some((d) => d.role === m.role),
  );
  return [...deLUnivers, ...duDomaine].slice(0, limite).map((m) => ({
    slug: slugDeRole(m.role),
    role: m.role,
    short: m.short,
    label: m.label,
    styleId: m.universes[0]?.id ?? page.styleId,
  }));
}

/**
 * Le texte public d'un métier : ce que la page dit à qui la reçoit. Sert aussi
 * de description partagée (messages, liens) — une seule phrase, jamais deux.
 */
export function resumeMetier(page: PageMetier): string {
  return `${page.short} · ${page.domaine.label} · ${page.style.name}`;
}
