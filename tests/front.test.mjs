/**
 * Lance `tests/front.test.ts` : esbuild le regroupe avec les modules de `src/`
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
const work = mkdtempSync(join(tmpdir(), 'wedding-front-'));
const outfile = join(work, 'front.test.mjs');

await build({
  entryPoints: [join(here, 'front.test.ts')],
  outfile,
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node20',
  // `demo.ts` et `staticSite.ts` lisent `import.meta.env`, absent de Node.
  // Les tests portent sur le chemin de production : démo désactivée, mode
  // 100 % statique éteint (le repli sur copie est testé explicitement).
  define: { 'import.meta.env.DEV': 'false', 'import.meta.env.VITE_STATIC_SITES': '""' },
  logLevel: 'warning',
});

try {
  await import(pathToFileURL(outfile).href);
} finally {
  rmSync(work, { recursive: true, force: true });
}
