/**
 * RELEVER LES PHOTOS LIVRÉES
 *
 * `npm run photos` regarde ce qui est **réellement arrivé** dans
 * `public/images/magazine/` et écrit la liste dans `src/lib/photosDuMagazine.ts`.
 *
 * Pourquoi une liste, et pas une devinette : dans un navigateur, on ne peut pas
 * demander « est-ce que ce fichier existe ? » sans provoquer une erreur d'image.
 * La liste est donc **relevée sur le disque** — et elle est engendrée, jamais
 * écrite à la main, comme les deux autres documents.
 *
 * Convention : un dossier par jour de l'année, `MM-JJ`, et dedans
 * `couverture.jpg` (le fond), puis `aube.jpg`, `matin.jpg`, `midi.jpg`,
 * `apres-midi.jpg`, `soir.jpg` — et `-2`, `-3` quand il y a plusieurs candidates
 * pour le même plan (c'est le casting qui choisira : `castingVisuels.ts`).
 */

import { existsSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const RACINE = join(process.cwd(), 'public', 'images', 'magazine');
const CIBLE = join(process.cwd(), 'src', 'lib', 'photosDuMagazine.ts');

const JOUR = /^\d{2}-\d{2}$/;
const PLANS = ['couverture', 'aube', 'matin', 'midi', 'apres-midi', 'soir'] as const;

const photos: Record<string, string[]> = {};

if (existsSync(RACINE)) {
  for (const dossier of readdirSync(RACINE, { withFileTypes: true })) {
    if (!dossier.isDirectory() || !JOUR.test(dossier.name)) continue;
    const fichiers = readdirSync(join(RACINE, dossier.name));
    const livrees = PLANS.filter((plan) =>
      fichiers.some((f) => f.toLowerCase().startsWith(`${plan.toLowerCase()}.`) || f.toLowerCase().startsWith(`${plan.toLowerCase()}-`)),
    );
    if (livrees.length > 0) photos[dossier.name] = [...livrees];
  }
}

const total = Object.values(photos).reduce((n, l) => n + l.length, 0);

const contenu = `/**
 * LES VISUELS LIVRÉS — ENGENDRÉ PAR \`npm run photos\`
 *
 * Ce fichier est la liste de ce qui est **réellement arrivé** dans
 * \`public/images/magazine/\` : un dossier par jour (\`MM-JJ\`), et dedans les plans
 * livrés. **Ne pas l'écrire à la main** : on dépose les images, on lance la
 * commande, la liste se refait.
 *
 * Le site s'en sert pour **prendre la photo quand elle est là** — et laisser le
 * dessin quand elle n'y est pas. Un fichier absent ne casse donc jamais une page.
 */

export const PHOTOS_DU_MAGAZINE: Record<string, string[]> = ${JSON.stringify(photos, null, 2)};

/** Le nombre de plans livrés, tous jours confondus. */
export const PHOTOS_LIVREES = ${total};

/** Vrai quand ce plan a son image. */
export function photoLivree(jour: string, slot: string): boolean {
  return (PHOTOS_DU_MAGAZINE[jour] ?? []).includes(slot);
}

/** Le chemin du premier rang livré pour ce plan, ou \`null\`. */
export function photoDuPlan(jour: string, slot: string): string | null {
  if (!photoLivree(jour, slot)) return null;
  return \`/images/magazine/\${jour}/\${slot}.jpg\`;
}
`;

writeFileSync(CIBLE, contenu, 'utf8');
console.log(`src/lib/photosDuMagazine.ts — ${total} plan(s) livré(s)`);
