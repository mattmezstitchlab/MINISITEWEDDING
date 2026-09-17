/**
 * Clés d’édition côté navigateur.
 *
 * La clé est générée par `POST /api/create-site`, renvoyée une seule fois, puis
 * conservée ici — indexée par identifiant (l’éditeur) et par slug (l’aperçu d’un
 * brouillon depuis `/p/:slug`). Elle est envoyée dans l’en-tête `x-site-token`
 * par `http.ts`.
 *
 * Effacer le stockage du navigateur fait perdre l’accès à l’édition : la
 * récupération passe par la base (voir `supabase/schema.sql`, section
 * « Exploitation des clés d’édition »).
 */

const STORAGE_KEY = 'wedding-site:edit-tokens';

type Store = Record<string, string>;

export interface SiteRef {
  id?: number | string;
  slug?: string;
}

function read(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? (parsed as Store) : {};
  } catch {
    return {};
  }
}

function persist(store: Store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Stockage indisponible (navigation privée, quota) : la session reste
    // utilisable tant que la page n’est pas rechargée.
  }
}

export function saveEditToken(site: SiteRef, token: string) {
  const store = read();
  if (site.id !== undefined) store[`id:${site.id}`] = token;
  if (site.slug) store[`slug:${site.slug}`] = token;
  persist(store);
}

export function getEditToken(ref: SiteRef): string | null {
  const store = read();
  if (ref.id !== undefined && store[`id:${ref.id}`]) return store[`id:${ref.id}`];
  if (ref.slug && store[`slug:${ref.slug}`]) return store[`slug:${ref.slug}`];
  return null;
}

export function forgetEditToken(ref: SiteRef) {
  const store = read();
  if (ref.id !== undefined) delete store[`id:${ref.id}`];
  if (ref.slug) delete store[`slug:${ref.slug}`];
  persist(store);
}

/* ------------------------------------------------------------------------- *
 * Clé active de la session
 *
 * Les appels de l’éditeur sont nombreux et éparpillés (chaque champ sauvegardé
 * à la perte de focus) : plutôt que de threading un jeton dans trente appels,
 * la page qui possède la clé la déclare active, et `http.ts` l’attache.
 * --------------------------------------------------------------------------- */

let activeToken: string | null = null;

export function setActiveToken(token: string | null) {
  activeToken = token;
}

export function getActiveToken(): string | null {
  return activeToken;
}
