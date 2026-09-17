import { createClient } from '@supabase/supabase-js';
import { triggerRestore } from './db-wake.js';

/**
 * Client Supabase côté serveur.
 *
 * Utilise la clé de service (`SUPABASE_SERVICE_ROLE_KEY`), qui contourne RLS :
 * ce fichier ne doit donc jamais être importé par du code livré au navigateur.
 * Il vit hors de `api/` pour ne pas être exposé comme fonction serverless.
 */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    global: {
      fetch: async (url, options) => {
        const res = await fetch(url, options);
        if (!res.ok && res.status >= 500) triggerRestore();
        return res;
      },
    },
  }
);

export default supabase;
