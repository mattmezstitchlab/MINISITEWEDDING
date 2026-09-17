// Resilient API client for Wedding Site with server-first + localStorage fallback

export async function apiGet<T>(path: string): Promise<T> {
  try {
    const res = await fetch(path);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Erreur ${res.status}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    // If local dev or offline, fallback to client-side localStorage cache
    const fallback = tryClientFallbackGet<T>(path);
    if (fallback !== null) {
      return fallback;
    }
    throw err;
  }
}

export async function apiSend<T>(path: string, method: 'POST' | 'PUT' | 'DELETE', body?: unknown): Promise<T> {
  try {
    const res = await fetch(path, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Erreur ${res.status}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    const fallback = tryClientFallbackSend<T>(path, method, body);
    if (fallback !== null) {
      return fallback;
    }
    throw err;
  }
}

function tryClientFallbackGet<T>(path: string): T | null {
  try {
    const url = new URL(path, window.location.origin);
    const key = `wedding_cache_${url.pathname.replace('/api/', '')}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const items = JSON.parse(raw);
    const siteId = url.searchParams.get('site_id');
    const slug = url.searchParams.get('slug');
    const id = url.searchParams.get('id');

    if (slug) {
      return (items.find((x: any) => x.slug === slug) ?? null) as T;
    }
    if (id) {
      return (items.find((x: any) => String(x.id) === String(id)) ?? null) as T;
    }
    if (siteId) {
      return (items.filter((x: any) => String(x.site_id) === String(siteId)) ?? []) as T;
    }
    return items as T;
  } catch {
    return null;
  }
}

function tryClientFallbackSend<T>(path: string, method: string, body?: unknown): T | null {
  try {
    const endpoint = path.replace('/api/', '').split('?')[0];
    const key = `wedding_cache_${endpoint}`;
    const raw = localStorage.getItem(key) || '[]';
    let items = JSON.parse(raw);
    const payload = (body as any) || {};

    if (method === 'POST') {
      const newItem = {
        id: Date.now(),
        ...payload,
        created_at: new Date().toISOString(),
      };
      items.push(newItem);
      localStorage.setItem(key, JSON.stringify(items));
      return newItem as T;
    }

    if (method === 'PUT') {
      const idx = items.findIndex((x: any) => String(x.id) === String(payload.id));
      if (idx !== -1) {
        items[idx] = { ...items[idx], ...payload };
        localStorage.setItem(key, JSON.stringify(items));
        return items[idx] as T;
      }
    }

    if (method === 'DELETE') {
      items = items.filter((x: any) => String(x.id) !== String(payload.id));
      localStorage.setItem(key, JSON.stringify(items));
      return { ok: true } as T;
    }
  } catch {
    // Ignore fallback errors
  }
  return null;
}

export function mapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function formatDateLong(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso.includes('T') ? iso : `${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatDateShort(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso.includes('T') ? iso : `${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}.${d.getFullYear()}`;
}

export function daysUntil(iso: string): number {
  if (!iso) return 0;
  const d = new Date(iso.includes('T') ? iso : `${iso}T12:00:00`).getTime();
  if (Number.isNaN(d)) return 0;
  return Math.ceil((d - Date.now()) / 86400000);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
