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
  logLevel: 'warning',
});

try {
  await import(pathToFileURL(outfile).href);
} finally {
  rmSync(work, { recursive: true, force: true });
}
