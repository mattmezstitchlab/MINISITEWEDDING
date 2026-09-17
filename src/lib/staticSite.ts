import type { PublicSiteData } from './types';

/**
 * Copies statiques des mini-sites.
 *
 * Le contenu d’un site vit dans Supabase : si la base est en pause (facture
 * impayée, projet endormi) ou si les variables d’environnement manquent,
 * l’API répond 503 `supabase_unavailable` et plus aucun site ne s’affiche —
 * y compris ceux déjà partagés par QR code.
 *
 * Ces fichiers sont la sortie de secours : un instantané JSON par site, placé
 * dans `public/sites/<slug>.json` et servi **comme un fichier statique** par
 * Vercel. Aucune fonction serverless, aucune variable d’environnement, aucun
 * coût : le site s’affiche même base coupée.
 *
 * Deux façons de les produire :
 *   - `npm run snapshot` — exporte depuis Supabase tant qu’il répond ;
 *   - le bouton « Copie statique » du panneau Partager de l’éditeur, qui
 *     télécharge le même fichier depuis le navigateur.
 *
 * Ce qui ne fonctionne pas dans ce mode : l’édition, l’envoi des réponses
 * RSVP et les téléversements — tout ce qui écrit a besoin de la base.
 */

/**
 * `VITE_STATIC_SITES=1` court-circuite l’API : les sites sont servis
 * directement depuis les copies, sans attendre un échec réseau. Utile quand on
 * sait la base coupée, pour ne pas faire patienter les invités.
 */
export const STATIC_SITES = import.meta.env.VITE_STATIC_SITES === '1';

const BASE = '/sites';

/** Chemin de la copie d’un site, p. ex. `/sites/matt-marie.json`. */
export function snapshotPath(slug: string): string {
  return `${BASE}/${encodeURIComponent(slug)}.json`;
}

/**
 * Vrai si la valeur a la forme d’un `PublicSiteData`.
 *
 * La garde compte : un chemin mal réécrit renvoie `index.html` (HTML, donc
 * `JSON.parse` échoue) et une copie partielle ne doit pas faire planter le
 * rendu — les listes absentes sont complétées par des tableaux vides.
 */
function isSnapshot(value: unknown): value is PublicSiteData {
  if (!value || typeof value !== 'object') return false;
  const site = (value as PublicSiteData).site;
  if (!site || typeof site !== 'object') return false;
  return typeof site.slug === 'string' && site.slug.length > 0;
}

/** Complète les listes manquantes d’une copie, sans toucher au reste. */
function normalize(snapshot: PublicSiteData): PublicSiteData {
  const list = <T>(value: T[] | undefined): T[] => (Array.isArray(value) ? value : []);
  return {
    ...snapshot,
    sections: list(snapshot.sections),
    programme: list(snapshot.programme),
    infos: list(snapshot.infos),
    gallery: list(snapshot.gallery),
    faqs: list(snapshot.faqs),
    rsvpEvents: list(snapshot.rsvpEvents),
    gifts: list(snapshot.gifts),
  };
}

/**
 * Lit la copie statique d’un site. Retourne `null` quand il n’y en a pas
 * (fichier absent, JSON invalide, forme inattendue) : l’appelant décide alors
 * quoi afficher, aucune exception ne remonte.
 */
export async function loadStaticSite(slug: string | undefined): Promise<PublicSiteData | null> {
  if (!slug) return null;
  try {
    // `no-cache` : une copie régénérée doit remplacer l’ancienne sans attendre
    // l’expiration du cache du navigateur.
    const res = await fetch(snapshotPath(slug), {
      headers: { Accept: 'application/json' },
      cache: 'no-cache',
    });
    if (!res.ok) return null;
    const json: unknown = await res.json();
    return isSnapshot(json) ? normalize(json) : null;
  } catch {
    return null;
  }
}
