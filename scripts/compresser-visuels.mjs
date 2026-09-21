/**
 * COMPRESSER LES VISUELS DU MAGAZINE
 *
 * La bibliothèque compte 432 images : à 250 Ko pièce, le dépôt deviendrait
 * ingérable. Ce script ramène chaque image au format de service — **800 × 1120
 * (5 / 7), 76 % de qualité, sans métadonnées** — ce qui suffit largement : une
 * couverture s'affiche à 236 px de large, et un chapitre à 210.
 *
 *   node scripts/compresser-visuels.mjs            # tout ce qui est trop lourd
 *   node scripts/compresser-visuels.mjs --force    # tout retraiter
 *
 * ImageMagick (`convert`) est utilisé s'il est présent ; sinon, le script le dit
 * et ne touche à rien — les images restent lisibles par le site.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const RACINE = join(process.cwd(), 'public', 'images', 'magazine');
const SEUIL = 170 * 1024; // au-dessus, on retraite
const LARGEUR = 800;
const HAUTEUR = 1120;
const QUALITE = '76';

const force = process.argv.includes('--force');

function magick() {
  for (const binaire of ['convert', 'magick']) {
    try {
      execFileSync(binaire, ['-version'], { stdio: 'ignore' });
      return binaire;
    } catch {
      /* on essaie le suivant */
    }
  }
  return null;
}

const outil = magick();
if (!outil) {
  console.log('ImageMagick n’est pas installé : rien n’a été compressé (les images restent servies telles quelles).');
  process.exit(0);
}

if (!existsSync(RACINE)) {
  console.log('Aucun dossier public/images/magazine : rien à compresser.');
  process.exit(0);
}

let traitees = 0;
let epargne = 0;
let avant = 0;
let apres = 0;

for (const dossier of readdirSync(RACINE, { withFileTypes: true })) {
  if (!dossier.isDirectory() || !/^semaine-\d{2}$/.test(dossier.name)) continue;
  for (const fichier of readdirSync(join(RACINE, dossier.name))) {
    if (!/\.(jpe?g|png)$/i.test(fichier)) continue;
    const chemin = join(RACINE, dossier.name, fichier);
    const poids = statSync(chemin).size;
    if (!force && poids <= SEUIL) {
      epargne += 1;
      continue;
    }
    avant += poids;
    execFileSync(outil, [
      chemin,
      '-resize', `${LARGEUR}x${HAUTEUR}^`,
      '-gravity', 'center',
      '-extent', `${LARGEUR}x${HAUTEUR}`,
      '-strip',
      '-interlace', 'Plane',
      '-quality', QUALITE,
      chemin,
    ]);
    apres += statSync(chemin).size;
    traitees += 1;
  }
}

const mo = (n) => `${(n / 1024 / 1024).toFixed(1)} Mo`;
console.log(
  traitees === 0
    ? `Aucune image à compresser (${epargne} déjà au format).`
    : `${traitees} image(s) compressée(s) : ${mo(avant)} → ${mo(apres)} (${epargne} déjà au format).`,
);
