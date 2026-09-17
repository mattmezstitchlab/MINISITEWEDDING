/**
 * Formatage : dates, slugs et liens externes.
 *
 * Une seule façon de lire une date, partagée par le site public, l’éditeur,
 * l’onboarding et le compte à rebours.
 */

/**
 * Les dates de mariage arrivent en `YYYY-MM-DD` (sans fuseau) : on les ancre à
 * midi local pour éviter le décalage d’un jour selon le fuseau du visiteur.
 */
export function parseDate(value: string): Date | null {
  if (!value) return null;
  const d = new Date(value.includes('T') ? value : `${value}T12:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDateLong(iso: string): string {
  const d = parseDate(iso);
  if (!d) return iso || '';
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatDateShort(iso: string): string {
  const d = parseDate(iso);
  if (!d) return iso || '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}.${d.getFullYear()}`;
}

export function daysUntil(iso: string): number {
  const d = parseDate(iso);
  if (!d) return 0;
  return Math.ceil((d.getTime() - Date.now()) / 86400000);
}

export function mapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Lien public d’un site.
 *
 * Construit depuis l’origine réelle du déploiement : le domaine était codé en
 * dur (`{slug}.byaime.fr`), ce qui faisait copier — et encoder dans le QR code —
 * une adresse qui n’existe pas.
 */
export function publicUrl(slug: string): string {
  if (typeof window === 'undefined') return `/p/${slug}`;
  return `${window.location.origin}/p/${slug}`;
}

/** Même lien, affiché sans le protocole (en-tête éditeur, panneau de partage). */
export function publicPath(slug: string): string {
  if (typeof window === 'undefined') return `/p/${slug}`;
  return `${window.location.host}/p/${slug}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
