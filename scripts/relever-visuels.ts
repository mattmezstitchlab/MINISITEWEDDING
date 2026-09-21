/**
 * RELEVER LES VISUELS DU MAGAZINE
 *
 * `npm run visuels` regarde ce qui est **réellement arrivé** dans
 * `public/images/magazine/` et écrit trois choses :
 *
 * 1. `src/lib/bibliothequeMagazine.ts` — l'inventaire, lu par le site ;
 * 2. `public/images/magazine/manifeste.json` — **la déclaration de chaque
 *    image** de la collection : semaine, chapitre, titre, univers, saison,
 *    style, sujet, couleur dominante, description, mots-clés. Les 432 entrées y
 *    sont, livrées ou non : le manifeste est aussi le **plan de production** ;
 * 3. l'écran : ce qui est livré, ce qui manque, et **où remapper les anciens
 *    visuels par jour** (`09-21/couverture.jpg` → `semaine-38/cover.jpg`).
 *
 * Pourquoi un inventaire, et pas une devinette : dans un navigateur, on ne peut
 * pas demander « est-ce que ce fichier existe ? » sans provoquer une erreur
 * d'image. La liste est donc **relevée sur le disque** — et elle est engendrée,
 * jamais écrite à la main.
 */

import { existsSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CHAPITRES } from '../src/lib/chapitres';
import { PHOTOS_DU_MAGAZINE } from '../src/lib/photosDuMagazine';
import {
  MAGAZINES,
  NOMBRE_DE_MAGAZINES,
  cheminDeLaCouverture,
  cheminDuChapitre,
  chapitreDuMagazine,
  dossierDeLaSemaine,
  numeroDeMagazine,
  positionDansLeMagazine,
} from '../src/lib/semaines';
import { MOIS_LONGS } from '../src/lib/calendrier';

const RACINE = join(process.cwd(), 'public', 'images', 'magazine');
const INVENTAIRE = join(process.cwd(), 'src', 'lib', 'bibliothequeMagazine.ts');
const MANIFESTE = join(RACINE, 'manifeste.json');

const DOSSIER_SEMAINE = /^semaine-(\d{2})$/;
const SLOT_COUVERTURE = 'cover.jpg';

/* ————————————————————— 1. CE QUI EST ARRIVÉ, SUR LE DISQUE ————————————————————— */

const inventaire: Record<string, string[]> = {};

if (existsSync(RACINE)) {
  for (const entree of readdirSync(RACINE, { withFileTypes: true })) {
    if (!entree.isDirectory()) continue;
    const trouve = DOSSIER_SEMAINE.exec(entree.name);
    if (!trouve) continue;
    const numero = Number(trouve[1]);
    if (numero < 1 || numero > NOMBRE_DE_MAGAZINES) continue;
    const fichiers = readdirSync(join(RACINE, entree.name));
    const attendus = [SLOT_COUVERTURE, ...CHAPITRES.map((c) => c.fichier)];
    const livres = attendus.filter((slot) =>
      fichiers.some((f) => f.toLowerCase() === slot.toLowerCase()),
    );
    if (livres.length > 0) inventaire[entree.name] = livres;
  }
}

const total = Object.values(inventaire).reduce((n, liste) => n + liste.length, 0);

/* ————————————————————— 2. L'INVENTAIRE, POUR LE SITE ————————————————————— */

const enTete = `/**
 * L'INVENTAIRE DES VISUELS DU MAGAZINE — ENGENDRÉ PAR \`npm run visuels\`
 *
 * Ce fichier est la liste de ce qui est **réellement arrivé** dans
 * \`public/images/magazine/\` : un dossier par semaine (\`semaine-01\` …
 * \`semaine-54\`), et dedans \`cover.jpg\` plus les sept chapitres
 * (\`01-amoureux.jpg\`, \`02-style.jpg\`, …, \`07-souvenirs.jpg\`).
 *
 * **Ne pas l'écrire à la main** : on dépose les images, on lance la commande, la
 * liste se refait. Le site s'en sert pour **prendre la photo quand elle est
 * là** — et laisser le dessin quand elle n'y est pas. Un fichier absent ne casse
 * donc jamais une page.
 *
 * Convention de nommage — c'est elle qui rend la bibliothèque remplaçable sans
 * toucher au code :
 *
 * \`\`\`
 * public/images/magazine/
 *   semaine-01/
 *     cover.jpg            la couverture du magazine 1
 *     01-amoureux.jpg      les sept chapitres
 *     02-style.jpg
 *     03-lieux.jpg
 *     04-recevoir.jpg
 *     05-fete.jpg
 *     06-monde.jpg
 *     07-souvenirs.jpg
 *   semaine-02/…
 *   semaine-54/…
 * \`\`\`
 *
 * Les anciens dossiers par jour (\`09-21/couverture.jpg\`) restent lus : ils
 * servent de **repli de transition** au troisième rang, jamais d'image d'une
 * autre semaine (voir \`visuelsDuMagazine.ts\`).
 */

export const VISUELS_DU_MAGAZINE: Record<string, string[]> = ${JSON.stringify(inventaire, null, 2)};

/** Le nombre de visuels livrés, toutes semaines confondues. */
export const VISUELS_LIVRES = ${total};

/** Vrai quand ce visuel est arrivé pour cette semaine. */
export function visuelLivre(numero: number, slot: string): boolean {
  const dossier = \`semaine-\${String(numero).padStart(2, '0')}\`;
  return (VISUELS_DU_MAGAZINE[dossier] ?? []).includes(slot);
}

/** Le chemin servi d'un visuel : \`/images/magazine/semaine-38/cover.jpg\`. */
export function cheminDuVisuel(numero: number, slot: string): string {
  const dossier = \`semaine-\${String(numero).padStart(2, '0')}\`;
  return \`/images/magazine/\${dossier}/\${slot}\`;
}
`;

writeFileSync(INVENTAIRE, enTete, 'utf8');

/* ————————————————————— 3. LE MANIFESTE, IMAGE PAR IMAGE ————————————————————— */

interface Declaration {
  fichier: string;
  semaine: number;
  chapitre: string;
  titre: string;
  univers: string;
  saison: string;
  style: string;
  sujet: string;
  dominante_color: string;
  description: string;
  mots_cles: string[];
  couverture: boolean;
  livree: boolean;
}

const livree = (numero: number, slot: string) => (inventaire[dossierDeLaSemaine(numero)] ?? []).includes(slot);

const motsClesDuMagazine = (numero: number): string[] => {
  const m = MAGAZINES[numero - 1]!;
  return [
    m.style.toLowerCase(),
    m.saison.nom.toLowerCase(),
    m.terroir,
    m.matiere,
    m.motif,
    'mariage',
  ];
};

const declarations: Declaration[] = [];

for (let numero = 1; numero <= NOMBRE_DE_MAGAZINES; numero += 1) {
  const magazine = MAGAZINES[numero - 1]!;
  declarations.push({
    fichier: cheminDeLaCouverture(numero),
    semaine: numero,
    chapitre: 'cover',
    titre: magazine.titre,
    univers: 'La couverture du magazine',
    saison: magazine.saison.nom,
    style: magazine.style,
    sujet: magazine.coverSujet,
    dominante_color: magazine.palette.fond,
    description: `${magazine.titre} — ${magazine.style}. ${magazine.coverSujet}.`,
    mots_cles: motsClesDuMagazine(numero),
    couverture: true,
    livree: livree(numero, SLOT_COUVERTURE),
  });

  for (const chapitre of CHAPITRES) {
    const c = chapitreDuMagazine(numero, chapitre.numero);
    declarations.push({
      fichier: cheminDuChapitre(numero, chapitre.numero),
      semaine: numero,
      chapitre: chapitre.fichier.replace('.jpg', ''),
      titre: chapitre.titre,
      univers: chapitre.territoire,
      saison: magazine.saison.nom,
      style: magazine.style,
      sujet: c.sujet,
      dominante_color: magazine.palette.accent,
      description: c.description,
      mots_cles: [...motsClesDuMagazine(numero), chapitre.id],
      couverture: false,
      livree: livree(numero, chapitre.fichier),
    });
  }
}

const manifeste = {
  meta: {
    magazine: 'AIME MAGAZINE — la bibliothèque des 54 magazines',
    modele: '54 magazines × 7 chapitres = 378 images, plus 54 couvertures',
    regle:
      'Une image se nomme par son rang, jamais par sa date : semaine-NN/cover.jpg et semaine-NN/0X-chapitre.jpg. Le site fait le mapping date → semaine → chapitre.',
    convention: {
      racine: 'images/magazine/',
      semaine: 'semaine-NN/ où NN va de 01 à 54',
      couverture: 'semaine-NN/cover.jpg',
      chapitres: CHAPITRES.map((c) => `semaine-NN/${c.fichier} — ${c.titre}`),
      format: { ratio: '5 / 7', recommandé: '1000 × 1400', poids: '≤ 250 Ko' },
    },
    composition: {
      couvertures: NOMBRE_DE_MAGAZINES,
      chapitres: NOMBRE_DE_MAGAZINES * CHAPITRES.length,
      total: NOMBRE_DE_MAGAZINES * (CHAPITRES.length + 1),
    },
    calendrier: {
      semaine: 'blocs de sept jours depuis le 1ᵉʳ janvier (52 semaines : 364 jours)',
      jokers: [
        'magazine 53 — le 31 décembre, le jour de trop',
        'magazine 54 — le 29 février, le jour bissextile',
      ],
      chapitre: 'la position du jour dans sa semaine : jour 1 → chapitre 01',
      transition: 'les deux jours de trop prennent le chapitre de leur jour de semaine (lundi → 01)',
    },
    directrice_artistique:
      'Le mariage est le territoire, pas le sujet. Le mariage peut apparaître directement ou indirectement : une robe, une table, une ville, une chanson, une architecture, un objet transmis. Aucun cliché nuptial : pas de mariés souriants, pas d’alliances en gros plan, pas de bouquet sage.',
    interdits: [
      'aucun texte, aucun lettrage, aucun logo, aucun filigrane',
      'aucune icône religieuse, aucun vitrail, aucune auréole',
      'aucune illustration, aucun rendu 3D lisse, aucun cartoon',
      'aucune image d’une autre semaine',
    ],
  },
  livrees: total,
  attendues: declarations.length,
  images: declarations,
};

writeFileSync(MANIFESTE, `${JSON.stringify(manifeste, null, 2)}\n`, 'utf8');

/* ———————————————————— 4. CE QU'ON DIT À L'ÉCRAN ———————————————————— */

const parSaison = new Map<string, number>();
for (const magazine of MAGAZINES) {
  if (livree(magazine.numero, SLOT_COUVERTURE)) {
    parSaison.set(magazine.saison.nom, (parSaison.get(magazine.saison.nom) ?? 0) + 1);
  }
}

console.log(`src/lib/bibliothequeMagazine.ts — ${total} visuel(s) livré(s) sur ${declarations.length}`);
console.log(`public/images/magazine/manifeste.json — ${declarations.length} déclarations (plan complet)`);
for (const [saison, n] of parSaison) console.log(`  ${saison} : ${n} couverture(s)`);

const manquants = MAGAZINES.filter((m) => !livree(m.numero, SLOT_COUVERTURE)).map((m) => m.numero);
console.log(
  manquants.length === 0
    ? '  Les 54 couvertures sont livrées.'
    : `  Couvertures manquantes : ${manquants.slice(0, 12).join(', ')}${manquants.length > 12 ? '…' : ''} (${manquants.length})`,
);

/* ——————————————— 5. LES ANCIENS VISUELS PAR JOUR : OÙ LES REMAPPER ——————————————— */

const anciens = Object.keys(PHOTOS_DU_MAGAZINE).sort();
if (anciens.length > 0) {
  console.log(`\nAnciens dossiers par jour encore lus : ${anciens.length}`);
  for (const jour of anciens.slice(0, 10)) {
    const [mois, quantieme] = jour.split('-').map(Number);
    const annee = new Date().getFullYear();
    const date = new Date(annee, (mois ?? 1) - 1, quantieme ?? 1, 12);
    const magazine = numeroDeMagazine(date);
    const rang = positionDansLeMagazine(date);
    console.log(
      `  images/magazine/${jour}/ → ${cheminDeLaCouverture(magazine)} (couverture du magazine ${magazine})` +
        ` et ${cheminDuChapitre(magazine, rang)} (chapitre ${String(rang).padStart(2, '0')}, ${quantieme} ${MOIS_LONGS[(mois ?? 1) - 1]})`,
    );
  }
  console.log('  Ces fichiers ne sont ni déplacés ni supprimés : ils restent le repli de transition.');
}
