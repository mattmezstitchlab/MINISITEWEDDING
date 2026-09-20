/**
 * LES PROMPTS D'IMAGE DES 54 MAGAZINES
 *
 * `npm run prompts:aime` engendre le prompt **de chaque image de la
 * collection**, à partir de la seule source de vérité : la direction artistique
 * d'une semaine (`directionsDuMagazine.ts`), le brief d'un chapitre
 * (`chapitres.ts`), et le style de la maison (ci-dessous).
 *
 * Le format est **toujours le même**, et c'est ce qui fait qu'on reconnaît AIME
 * MAGAZINE d'une image à l'autre :
 *
 * ```
 *   [nature de l'image] [sujet de la semaine] [brief du chapitre]
 *   [lumière] [matière et motif] [palette]
 *   [style de la maison] [interdits]
 * ```
 *
 * Usage :
 *
 *   npm run prompts:aime -- --semaine=26            # les huit images de la 26
 *   npm run prompts:aime -- --semaine=26 --chapitre=4
 *   npm run prompts:aime -- --liste                  # ce qui manque, semaine par semaine
 *   npm run prompts:aime -- --semaine=1 --chapitre=cover --texte   # le prompt nu
 */

import { CHAPITRES } from '../src/lib/chapitres';
import { MAGAZINES, NOMBRE_DE_MAGAZINES, chapitreDuMagazine } from '../src/lib/semaines';
import { visuelLivre } from '../src/lib/bibliothequeMagazine';

/* ————————————————————— LE STYLE DE LA MAISON, ÉCRIT UNE FOIS ————————————————————— */

export const STYLE_DE_LA_MAISON = [
  'photographie éditoriale de magazine international, pas une illustration',
  'format portrait 5:7, cadrage soigné, une intention par image',
  'film moyen format, 80 mm à 110 mm, ouverture ouverte, grain fin',
  'couleurs désaturées sauf la couleur de la semaine, noirs tenus',
  'une source de lumière décidée, une ombre assumée, aucune lumière plate',
  'aucun texte, aucun lettrage, aucun logo, aucun filigrane',
  'aucune icône religieuse, aucun vitrail, aucune auréole',
  'ni cartoon, ni rendu 3D lisse, ni image d’illustration',
  'direction de casting tenue : un âge, une silhouette, des mains réelles',
].join(' ; ');

/** Ce qu'on ne veut sous aucun prétexte : la liste des clichés à éviter. */
export const SANS_CLICHE =
  'aucun cliché nuptial : pas de mariés souriants face caméra, pas d’alliances en gros plan, pas de bouquet sage, ' +
  'pas d’arche de fleurs, pas de robe blanche mise en avant pour elle seule, pas de demoiselles d’honneur alignées, ' +
  'pas de gâteau à étages — le mariage est suggéré par l’univers, jamais illustré';

/** Une phrase dit ce que l'image est, en tête de prompt. */
function natureDeLImage(chapitre: number | 'cover'): string {
  if (chapitre === 'cover') {
    return 'Photographie de couverture de magazine, portrait 5:7 : une scène forte, lisible en petit, qui annonce l’univers de la semaine sans le montrer en entier.';
  }
  const c = CHAPITRES[chapitre - 1]!;
  return `Photographie éditoriale, portrait 5:7, pour le chapitre « ${c.titre} » d’un magazine hebdomadaire : ${c.brief}.`;
}

/** Le prompt complet d'une image. **Le seul endroit où une image se décrit.** */
export function promptDUneImage(numero: number, chapitre: number | 'cover'): string {
  const magazine = MAGAZINES[numero - 1]!;
  const palette = `${magazine.palette.fond} (fond) et ${magazine.palette.accent} (accent)`;
  const saison = magazine.saison.nom.toLowerCase();

  const sujet =
    chapitre === 'cover'
      ? magazine.coverSujet
      : chapitreDuMagazine(numero, chapitre).sujet;

  const role =
    chapitre === 'cover'
      ? `Semaine ${numero} — « ${magazine.titre} », ${magazine.style}.`
      : `Semaine ${numero} — « ${magazine.titre} », ${magazine.style} ; chapitre ${String(chapitre).padStart(2, '0')} : ${CHAPITRES[chapitre - 1]!.titre}.`;

  return [
    natureDeLImage(chapitre),
    role,
    `SUJET : ${sujet}.`,
    `LIEU ET CULTURE : ${magazine.terroir}.`,
    `LUMIÈRE : ${magazine.lumiere}, saison ${saison}.`,
    `MATIÈRE : ${magazine.matiere}. MOTIF à tenir : ${magazine.motif}.`,
    `PALETTE : ${palette}.`,
    STYLE_DE_LA_MAISON,
    SANS_CLICHE,
  ].join('\n');
}

/** Le nom de fichier attendu — la convention, sans discussion. */
export function fichierDUneImage(numero: number, chapitre: number | 'cover'): string {
  const dossier = `semaine-${String(numero).padStart(2, '0')}`;
  return chapitre === 'cover'
    ? `public/images/magazine/${dossier}/cover.jpg`
    : `public/images/magazine/${dossier}/${CHAPITRES[chapitre - 1]!.fichier}`;
}

/* ——————————————————————————————— LA LIGNE DE COMMANDE ——————————————————————————————— */

const args = process.argv.slice(2);
const lire = (nom: string) => args.find((a) => a.startsWith(`--${nom}=`))?.split('=')[1];

const semaine = Number(lire('semaine') ?? 0);
const chapitreBrut = lire('chapitre');
const texteen = args.includes('--texte');
const liste = args.includes('--liste');

if (liste) {
  for (const magazine of MAGAZINES) {
    const manque = !visuelLivre(magazine.numero, 'cover');
    const chapitresManquants = CHAPITRES.filter((c) => !visuelLivre(magazine.numero, c.fichier)).length;
    console.log(
      `magazine ${String(magazine.numero).padStart(2, '0')} · ${magazine.titre.padEnd(28, ' ')} · ` +
        `${magazine.joker ? 'joker' : `semaine ${magazine.semaine}`} · ${magazine.saison.nom.padEnd(9, ' ')} · ` +
        `couverture ${manque ? 'à faire' : 'livrée'} · chapitres ${7 - chapitresManquants}/7`,
    );
  }
  process.exit(0);
}

if (!semaine || semaine < 1 || semaine > NOMBRE_DE_MAGAZINES) {
  console.log('npm run prompts:aime -- --semaine=26 [--chapitre=4|cover] [--texte]');
  console.log('npm run prompts:aime -- --liste');
  process.exit(0);
}

const chapitre: number | 'cover' =
  chapitreBrut === 'cover' || chapitreBrut === undefined ? (chapitreBrut === undefined ? 'cover' : 'cover') : Number(chapitreBrut);

const cibles: Array<number | 'cover'> =
  chapitreBrut === undefined ? ['cover', ...CHAPITRES.map((c) => c.numero)] : [chapitre];

for (const cible of cibles) {
  console.log('—'.repeat(78));
  console.log(`FICHIER  ${fichierDUneImage(semaine, cible)}`);
  console.log('—'.repeat(78));
  console.log(promptDUneImage(semaine, cible));
  if (!texteen) console.log('');
}
