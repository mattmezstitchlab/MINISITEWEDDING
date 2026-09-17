import { createClient } from '@supabase/supabase-js';
import { triggerRestore } from './db-wake.js';

/**
 * Client Supabase côté serveur.
 *
 * Utilise la clé de service (`SUPABASE_SERVICE_ROLE_KEY`), qui contourne RLS :
 * ce fichier ne doit donc jamais être importé par du code livré au navigateur.
 * Il vit hors de `api/` pour ne pas être exposé comme fonction serverless.
 *
 * Historique du bug FUNCTION_INVOCATION_FAILED :
 * `createClient` lance `supabaseUrl is required` si l'URL est vide.
 * Comme c'était fait au chargement du module, l'exception n'était pas
 * dans le try/catch des handlers et Vercel répondait FUNCTION_INVOCATION_FAILED
 * au lieu d'un JSON 500. On passe donc en création paresseuse.
 */

/**
 * La base est injoignable : variables absentes, projet en pause, facture
 * impayée… Ce n’est pas un bug du handler, c’est une indisponibilité. On la
 * distingue par un `code` pour que l’API réponde 503 (voir `server/errors.js`)
 * et que le front puisse basculer sur une copie statique
 * (voir `src/lib/staticSite.ts`).
 */
export class SupabaseUnavailableError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SupabaseUnavailableError';
    this.code = 'SUPABASE_UNAVAILABLE';
  }
}

function resolveUrl() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    ''
  ).trim();
}

function resolveServiceKey() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    ''
  ).trim();
}

let _client = null;
let _initError = null;

function getClient() {
  if (_client) return _client;
  if (_initError) throw _initError;

  const url = resolveUrl();
  const key = resolveServiceKey();

  if (!url) {
    _initError = new SupabaseUnavailableError(
      'Configuration Supabase manquante: NEXT_PUBLIC_SUPABASE_URL / VITE_SUPABASE_URL non défini. Vérifiez les variables d’environnement Vercel.'
    );
    throw _initError;
  }
  if (!key) {
    _initError = new SupabaseUnavailableError(
      'Configuration Supabase manquante: SUPABASE_SERVICE_ROLE_KEY non défini. Vérifiez les variables d’environnement Vercel.'
    );
    throw _initError;
  }

  try {
    _client = createClient(url, key, {
      global: {
        fetch: async (fetchUrl, options) => {
          const res = await fetch(fetchUrl, options);
          if (!res.ok && res.status >= 500) triggerRestore();
          return res;
        },
      },
    });
  } catch (e) {
    _initError = e;
    throw e;
  }

  return _client;
}

/**
 * On exporte un Proxy qui retarde la création du client jusqu'au premier accès
 * (supabase.from, supabase.storage...). Ainsi, une variable manquante ne fait
 * pas crasher le module au chargement, mais lève une erreur contrôlée
 * dans le try/catch du handler, qui pourra répondre en JSON 500.
 */
const supabase = new Proxy(
  {},
  {
    get(_target, prop) {
      // Permet `await supabase` ou inspection sans crash ? On force la création.
      if (prop === '__isProxy') return true;
      const client = getClient();
      const value = client[prop];
      // Si c'est une fonction, on la bind au client réel
      if (typeof value === 'function') return value.bind(client);
      return value;
    },
  }
);

export default supabase;

// Export nommé utile pour les tests ou pour vérifier la config sans Proxy
export function getSupabaseClient() {
  return getClient();
}

export function isSupabaseConfigured() {
  return Boolean(resolveUrl() && resolveServiceKey());
}
