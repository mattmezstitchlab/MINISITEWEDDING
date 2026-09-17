#!/usr/bin/env node
/**
 * Copies statiques des mini-sites — `npm run snapshot`.
 *
 * Écrit un instantané JSON par site dans `public/sites/<slug>.json`. Ces
 * fichiers sont servis tels quels par Vercel (aucune fonction serverless,
 * aucune variable d’environnement) : `src/lib/staticSite.ts` s’y rabat quand
 * Supabase ne répond pas — projet en pause, facture impayée, variables
 * manquantes. Le site partagé reste donc en ligne.
 *
 * Usage :
 *   npm run snapshot                       # tous les sites publiés, depuis Supabase
 *   npm run snapshot -- --all              # brouillons compris (voir l’avertissement)
 *   npm run snapshot -- --slug matt-marie  # un seul site
 *   npm run snapshot:demo                  # le jeu de démonstration, sans Supabase
 *
 * Le contenu vient de la même base que le site en ligne : les huit ressources
 * sont lues dans le même ordre que `src/lib/siteData.ts`. Une copie est un
 * instantané : régénérez-la après chaque modification importante
 * (`npm run snapshot`), ou téléchargez-la depuis le panneau « Partager » de
 * l’éditeur quand vous n’avez pas les clés de service sous la main.
 */
import { build } from 'esbuild';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'sites');

/** Les huit ressources d’un site, dans l’ordre de `loadSiteData()`. */
const CHILDREN = [
  ['sections', 'site_sections', 'position'],
  ['programme', 'programme_events', 'position'],
  ['infos', 'infos_pratiques', 'position'],
  ['gallery', 'gallery_photos', 'position'],
  ['faqs', 'faqs', 'position'],
  ['rsvpEvents', 'rsvp_events', 'position'],
  ['gifts', 'gift_options', 'position'],
];

function parseArgs(argv) {
  const args = { demo: false, all: false, slug: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--demo') args.demo = true;
    else if (argv[i] === '--all') args.all = true;
    else if (argv[i] === '--slug') args.slug = argv[++i];
    else throw new Error(`Option inconnue : ${argv[i]}`);
  }
  return args;
}

/** Une copie doit porter un slug : c’est le nom du fichier servi. */
function assertSnapshot(data, label) {
  if (!data || !data.site || typeof data.site.slug !== 'string' || !data.site.slug) {
    throw new Error(`${label} : site sans slug, impossible d’en faire une copie.`);
  }
  return { ...data, exported_at: new Date().toISOString() };
}

function write(site, data) {
  mkdirSync(outDir, { recursive: true });
  const file = join(outDir, `${site.slug}.json`);
  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  const kb = (Buffer.byteLength(JSON.stringify(data)) / 1024).toFixed(1);
  console.log(`  ✓ ${site.slug.padEnd(24)} ${site.published ? 'publié  ' : 'brouillon'} ${kb} kB → public/sites/${site.slug}.json`);
}

/* ------------------------------------------------------------------ Supabase */

async function exportFromSupabase({ all, slug }) {
  const { getSupabaseClient, isSupabaseConfigured } = await import(
    pathToFileURL(join(root, 'server/db-client.js')).href
  );
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase n’est pas configuré (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).\n' +
      'Renseignez-les dans un `.env` local, ou utilisez `npm run snapshot:demo`.'
    );
  }
  const supabase = getSupabaseClient();

  let sitesQuery = supabase.from('wedding_sites').select('*').order('id', { ascending: true });
  if (slug) sitesQuery = sitesQuery.eq('slug', slug);
  const { data: sites, error } = await sitesQuery;
  if (error) throw new Error(`Lecture de wedding_sites : ${error.message}`);
  if (!sites || sites.length === 0) throw new Error(slug ? `Aucun site pour le slug « ${slug} ».` : 'Aucun site en base.');

  const targets = all ? sites : sites.filter((s) => s.published);
  const skipped = sites.length - targets.length;
  if (skipped > 0) {
    console.log(`  ${skipped} brouillon(s) ignoré(s) — une copie dans public/sites/ est lisible par tous. Utilisez --all en connaissance de cause.`);
  }

  for (const site of targets) {
    const data = { site };
    for (const [key, table, order] of CHILDREN) {
      const { data: rows, error: rowError } = await supabase
        .from(table)
        .select('*')
        .eq('site_id', site.id)
        .order(order, { ascending: true });
      if (rowError) throw new Error(`Lecture de ${table} (site ${site.id}) : ${rowError.message}`);
      data[key] = rows ?? [];
    }
    write(site, assertSnapshot(data, `Site ${site.id}`));
  }
  console.log(`\n${targets.length} copie(s) écrite(s) dans public/sites/.`);
}

/* ---------------------------------------------------------------------- Démo */

/**
 * Le jeu de démonstration est écrit en TypeScript et importé par le front :
 * plutôt que de le recopier ici (deux sources qui divergent), on le regroupe
 * avec esbuild — déjà présent dans les dépendances — puis on l’importe.
 */
async function exportDemo({ slug }) {
  const work = mkdtempSync(join(tmpdir(), 'wedding-demo-'));
  try {
    const outfile = join(work, 'demo.mjs');
    await build({
      entryPoints: [join(root, 'src/lib/demo.ts')],
      outfile,
      bundle: true,
      format: 'esm',
      platform: 'node',
      target: 'node20',
      define: { 'import.meta.env.DEV': 'true' },
      logLevel: 'warning',
    });
    const { DEMO_DATA } = await import(pathToFileURL(outfile).href);
    if (slug && DEMO_DATA.site.slug !== slug) {
      throw new Error(`La démo ne couvre que le slug « ${DEMO_DATA.site.slug} » (demandé : « ${slug} »).`);
    }
    write(DEMO_DATA.site, assertSnapshot(DEMO_DATA, 'Démo'));
    console.log('\n1 copie écrite dans public/sites/ (contenu de src/lib/demo.ts).');
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

/* --------------------------------------------------------------------- main */

try {
  const args = parseArgs(process.argv.slice(2));
  console.log(args.demo ? '\nCopie statique — jeu de démonstration' : '\nCopie statique — export depuis Supabase');
  if (args.demo) await exportDemo(args);
  else await exportFromSupabase(args);
} catch (err) {
  console.error(`\n✗ ${err.message}`);
  process.exit(1);
}
