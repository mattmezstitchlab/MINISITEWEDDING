/**
 * Lance `tests/ui.test.ts` : esbuild le regroupe avec les modules de `src/`
 * (Node ne sait pas résoudre les imports sans extension de `src/lib/`), puis le
 * bundle est importé. `esbuild` est déjà présent comme dépendance de Vite ; il
 * est déclaré dans devDependencies pour ne pas dépendre d’un arbre transitoire.
 */
import { build } from 'esbuild';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const work = mkdtempSync(join(tmpdir(), 'wedding-ui-'));
const outfile = join(work, 'ui.test.mjs');

await build({
  entryPoints: [join(here, 'ui.test.ts')],
  outfile,
  bundle: true,
  format: 'esm',
  // `src/` est écrit avec le JSX automatique (comme le fait Vite).
  jsx: 'automatic',
  platform: 'node',
  target: 'node20',
  // `demo.ts` et `staticSite.ts` lisent `import.meta.env`, absent de Node.
  // Les tests portent sur le chemin de production : démo désactivée, mode
  // 100 % statique éteint (le repli sur copie est testé explicitement).
  define: {
    'import.meta.env.DEV': 'false',
    'import.meta.env.VITE_STATIC_SITES': '""',
    // Ce lot porte sur le mode par défaut du projet : aucune base distante.
    'import.meta.env.VITE_DATA_SOURCE': '"local"',
    'import.meta.env.VITE_SUPABASE_URL': '""',
    'import.meta.env.NEXT_PUBLIC_SUPABASE_URL': '""',
    // Point de collecte facultatif des réponses (voir README) : absent ici.
    'import.meta.env.VITE_RSVP_WEBHOOK': '""',
  },
  // `react-dom/server` (version Node) fait des `require('util')` dynamiques,
  // impossibles à regrouper en ESM ; la version navigateur rend exactement la
  // même chose.
  alias: { 'react-dom/server': 'react-dom/server.browser' },
  logLevel: 'warning',
});

try {
  await import(pathToFileURL(outfile).href);
} finally {
  rmSync(work, { recursive: true, force: true });
}
