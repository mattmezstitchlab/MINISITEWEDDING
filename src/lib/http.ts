import { getActiveToken } from './auth';

/**
 * Client HTTP minimal vers les fonctions serverless de `api/`.
 *
 * En production, l’API est servie par la même origine que le front (réécriture
 * Vercel) : les chemins sont donc toujours relatifs. En local, `vite dev` ne
 * sert pas `api/` et les pages basculent sur la démo (voir README).
 *
 * La clé d’édition active, s’il y en a une, part dans l’en-tête `x-site-token`.
 */

/** Erreur d’API portant le code HTTP, pour distinguer 403 (clé) et 404 (site). */
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function headers(json: boolean): Record<string, string> {
  const h: Record<string, string> = json ? { 'Content-Type': 'application/json' } : {};
  const token = getActiveToken();
  if (token) h['x-site-token'] = token;
  return h;
}

async function parse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    let message = text || `Erreur ${res.status}`;
    try {
      const json = JSON.parse(text);
      if (json && typeof json.error === 'string' && json.error.trim()) {
        message = json.error;
      }
    } catch {
      // text n'est pas du JSON, on le garde tel quel
      // Cas Vercel FUNCTION_INVOCATION_FAILED : le body est une page HTML
      if (text.includes('FUNCTION_INVOCATION_FAILED')) {
        message = `Le serveur a rencontré une erreur (FUNCTION_INVOCATION_FAILED). Vérifiez la configuration Supabase côté Vercel. Détail: ${text.slice(0, 300)}`;
      }
    }
    throw new ApiError(res.status, message);
  }
  return (await res.json()) as T;
}

export async function apiGet<T>(path: string): Promise<T> {
  return parse<T>(await fetch(path, { headers: headers(false) }));
}

export async function apiSend<T>(path: string, method: 'POST' | 'PUT' | 'DELETE', body?: unknown): Promise<T> {
  return parse<T>(
    await fetch(path, {
      method,
      headers: headers(true),
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  );
}
