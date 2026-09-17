import { getActiveToken } from './auth';
import { isRemote } from './dataSource';
import { localRequest } from './localApi';
import type { LocalResponse } from './localApi';

/**
 * Accès aux données : fonctions serverless de `api/` quand une base distante
 * est configurée, base locale du navigateur sinon (voir `dataSource.ts`).
 *
 * Les deux chemins renvoient exactement les mêmes formes et les mêmes codes
 * d’erreur, si bien qu’aucun écran ne sait lequel il emprunte.
 *
 * Côté distant, les chemins sont relatifs : l’API est servie par la même
 * origine que le front. La clé d’édition active, s’il y en a une, part dans
 * l’en-tête `x-site-token`.
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

/** Traduit une réponse de la base locale comme `parse()` traduit un `Response`. */
function parseLocal<T>(res: LocalResponse): T {
  if (res.status >= 400) {
    const message = (res.body as { error?: string } | null)?.error ?? `Erreur ${res.status}`;
    throw new ApiError(res.status, message);
  }
  return res.body as T;
}

export async function apiGet<T>(path: string): Promise<T> {
  if (!isRemote()) return parseLocal<T>(await localRequest(path, 'GET', undefined, getActiveToken()));
  return parse<T>(await fetch(path, { headers: headers(false) }));
}

export async function apiSend<T>(path: string, method: 'POST' | 'PUT' | 'DELETE', body?: unknown): Promise<T> {
  if (!isRemote()) return parseLocal<T>(await localRequest(path, method, body, getActiveToken()));
  return parse<T>(
    await fetch(path, {
      method,
      headers: headers(true),
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  );
}
