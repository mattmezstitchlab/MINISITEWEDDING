/**
 * IMPORTER LA BIBLIOTHÈQUE DES VISUELS
 *
 * L'autre repo (`BIBLIOTHEQUESUPERMAGAZINE`) est **la source** : chaque image
 * y est posée, normalisée, déclarée dans `manifeste.json`, vérifiée. Ce repo
 * ne duplique rien d'autre : ce script copie **ce qui est déclaré** dans
 * `public/images/biblio/`, pour que le site serve ses visuels lui-même (le
 * dépôt de la bibliothèque est privé : un navigateur ne peut pas lire ses
 * liens bruts).
 *
 *   node scripts/importer-bibliotheque.mjs            # branche main
 *   node scripts/importer-bibliotheque.mjs --ref=…    # une branche / PR
 *
 * Télécharge par `gh` (authentifié), ou par `fetch` si GITHUB_TOKEN est posé.
 * On ne prend que le premier rang de chaque jour ; le manifeste copié ne
 * liste que ce qui est arrivé — jamais une image sans sa déclaration.
 */

import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const REPO = 'mattmezstitchlab/BIBLIOTHEQUESUPERMAGAZINE';
const args = process.argv.slice(2);
const ref = args.find((a) => a.startsWith('--ref='))?.slice(6) || 'main';
const jeton = process.env.GITHUB_TOKEN || '';
/** Par défaut `gh` (authentifié, passe partout) ; `--fetch` force l'API. */
const viaFetch = args.includes('--fetch') && jeton;

/** Le contenu brut d'un fichier du dépôt, par gh ou par fetch. */
async function lire(path) {
  if (viaFetch) {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${path}?ref=${encodeURIComponent(ref)}`,
      { headers: { Authorization: `Bearer ${jeton}`, Accept: 'application/vnd.github.raw+json' } },
    );
    if (!res.ok) throw new Error(`${path} : ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  }
  const b64 = execSync(
    `gh api "repos/${REPO}/contents/${path}?ref=${encodeURIComponent(ref)}" -q .content`,
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
  );
  return Buffer.from(b64.replace(/\s/g, ''), 'base64');
}

const racine = join(process.cwd(), 'public', 'images', 'biblio');
mkdirSync(racine, { recursive: true });

const manifeste = JSON.parse((await lire('manifeste.json')).toString('utf8'));
const declarations = manifeste.images ?? [];

let pris = 0;
let rates = 0;
const copie = { meta: manifeste.meta, images: [] };

for (const image of declarations) {
  /** Un seul rang par jour côté site : le premier déclaré. */
  const jour = image.fichier.match(/images\/(\d\d-\d\d)\//)?.[1];
  if (!jour || copie.images.some((i) => i.jour === jour)) continue;
  try {
    const buf = await lire(image.fichier);
    writeFileSync(join(racine, `${jour}.jpg`), buf);
    copie.images.push({ ...image, fichier: `/images/biblio/${jour}.jpg`, jour });
    pris += 1;
    process.stdout.write(`  ✓ ${jour}\n`);
  } catch (e) {
    rates += 1;
    process.stdout.write(`  ✗ ${jour} (${e.message})\n`);
  }
}

writeFileSync(join(racine, 'manifeste.json'), JSON.stringify(copie, null, 2));
console.log(`\nBibliothèque : ${pris} visuel(s) importé(s), ${rates} raté(s), depuis ${REPO}@${ref}`);
console.log('Le manifeste local ne liste que ce qui est arrivé.');
