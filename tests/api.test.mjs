/**
 * Tests d’autorisation de l’API — `npm test`.
 *
 * Les handlers de `api/` sont copiés dans un dossier temporaire avec un faux
 * `server/db-client.js` (`tests/mock-db-client.js`) : aucune base réelle, aucune
 * variable d’environnement. Ce que ces tests vérifient, c’est la matrice
 * d’accès — qui peut lire, qui peut écrire, ce que refuse une clé d’un autre
 * site — c’est-à-dire exactement ce qui a été ouvert avant l’arrivée des clés.
 */
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const work = mkdtempSync(join(tmpdir(), 'wedding-api-'));

cpSync(join(repoRoot, 'api'), join(work, 'api'), { recursive: true });
mkdirSync(join(work, 'server'));
for (const f of ['auth.js', 'crud.js', 'errors.js']) {
  cpSync(join(repoRoot, 'server', f), join(work, 'server', f));
}
cpSync(new URL('./mock-db-client.js', import.meta.url), join(work, 'server/db-client.js'));
writeFileSync(join(work, 'package.json'), '{"type":"module"}');

const load = async (relative) => (await import(pathToFileURL(join(work, relative)).href)).default;
const { store, reset, failInsertOn, uploads } = await import(pathToFileURL(join(work, 'server/db-client.js')).href);

const createSite = await load('api/create-site.js');
const weddingSites = await load('api/wedding-sites.js');
const siteSections = await load('api/site-sections.js');
const programme = await load('api/programme.js');
const infos = await load('api/infos.js');
const gallery = await load('api/gallery.js');
const faqs = await load('api/faqs.js');
const gifts = await load('api/gifts.js');
const rsvpEvents = await load('api/rsvp-events.js');
const rsvp = await load('api/rsvp.js');
const media = await load('api/media.js');
const upload = await load('api/upload.js');

let pass = 0;
const failures = [];

function check(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) pass++;
  else failures.push(`${label}\n     attendu: ${JSON.stringify(expected)}\n     reçu   : ${JSON.stringify(actual)}`);
}

function mkRes() {
  const res = { statusCode: 0, body: undefined, headers: {}, ended: false };
  res.setHeader = (k, v) => { res.headers[k] = v; return res; };
  res.status = (c) => { res.statusCode = c; return res; };
  res.json = (b) => { res.body = b; return res; };
  res.end = () => { res.ended = true; return res; };
  return res;
}

async function call(handler, { method = 'GET', query = {}, body = null, token = null } = {}) {
  const res = mkRes();
  const req = { method, query, body, headers: token ? { 'x-site-token': token } : {} };
  await handler(req, res);
  return res;
}

const sitePayload = (slug, published) => ({ slug, partner1: 'Alice', partner2: 'Bruno', wedding_date: '2026-06-20', published });

/* ---------------------------------------------------------------- 1. création */

reset();
let res = await call(createSite, { method: 'POST', body: sitePayload('alice-bruno', false) });
check('create-site POST → 201', res.statusCode, 201);
const keyA = res.body?.edit_token;
const siteA = res.body?.site;
check('create-site renvoie un jeton de 32 caractères', typeof keyA === 'string' && keyA.length, 32);
check('create-site crée la ligne du site', store.wedding_sites.length, 1);
check('create-site crée le secret', store.site_secrets.length, 1);
check(
  'le secret stocké est le SHA-256 du jeton, pas le jeton',
  store.site_secrets[0].edit_token,
  createHash('sha256').update(keyA).digest('hex')
);
check('le jeton en clair n’est jamais écrit en base', JSON.stringify(store).includes(keyA), false);
check('create-site GET → 405', (await call(createSite, { method: 'GET' })).statusCode, 405);
check('create-site sans champs → 400', (await call(createSite, { method: 'POST', body: { slug: 'x' } })).statusCode, 400);

res = await call(createSite, { method: 'POST', body: sitePayload('autre-couple', true) });
const keyB = res.body?.edit_token;
const siteB = res.body?.site;
check('deuxième site créé avec sa propre clé', keyB !== keyA && siteB.id !== siteA.id, true);

// Échec de l’insert du secret : le site ne doit pas rester orphelin.
const quiet = console.error;
console.error = () => {};            // le handler journalise l’échec provoqué
failInsertOn.table = 'site_secrets';
res = await call(createSite, { method: 'POST', body: sitePayload('orphelin', false) });
failInsertOn.table = null;
console.error = quiet;
check('create-site sans secret → 500', res.statusCode, 500);
check('le site orphelin est supprimé', store.wedding_sites.map((s) => s.slug), ['alice-bruno', 'autre-couple']);

// Un site « historique », sans clé : inadministrable tant qu’on n’en génère pas.
store.wedding_sites.push({ id: 7, slug: 'avant-auth', partner1: 'C', partner2: 'D', published: true });

/* ---------------------------------------------------- 2. le site lui-même */

check('site publié, lecture par slug sans clé', (await call(weddingSites, { query: { slug: 'autre-couple' } })).statusCode, 200);
check('brouillon, lecture par slug sans clé → 404', (await call(weddingSites, { query: { slug: 'alice-bruno' } })).statusCode, 404);
check('brouillon, lecture par slug avec sa clé → 200', (await call(weddingSites, { query: { slug: 'alice-bruno' }, token: keyA })).statusCode, 200);
check('brouillon, lecture avec la clé d’un autre site → 404', (await call(weddingSites, { query: { slug: 'alice-bruno' }, token: keyB })).statusCode, 404);

check('lecture par id sans clé → 403', (await call(weddingSites, { query: { id: siteA.id } })).statusCode, 403);
check('lecture par id avec sa clé → 200', (await call(weddingSites, { query: { id: siteA.id }, token: keyA })).statusCode, 200);
check('lecture par id avec une autre clé → 403', (await call(weddingSites, { query: { id: siteA.id }, token: keyB })).statusCode, 403);
check('lecture par id avec une clé inventée → 403', (await call(weddingSites, { query: { id: siteA.id }, token: 'invente' })).statusCode, 403);
check('lecture sans slug ni id → 400', (await call(weddingSites, { query: {} })).statusCode, 400);

res = await call(weddingSites, { method: 'PUT', body: { id: siteA.id, partner1: 'Alicia' }, token: keyA });
check('mise à jour du site par le propriétaire → 200', res.statusCode, 200);
check('mise à jour appliquée', res.body?.partner1, 'Alicia');
check('mise à jour sans clé → 403', (await call(weddingSites, { method: 'PUT', body: { id: siteA.id, partner1: 'Pirate' } })).statusCode, 403);
check('mise à jour avec une autre clé → 403', (await call(weddingSites, { method: 'PUT', body: { id: siteA.id, partner1: 'Pirate' }, token: keyB })).statusCode, 403);
check('la tentative non autorisée n’a rien écrit', store.wedding_sites.find((s) => s.id === siteA.id).partner1, 'Alicia');

res = await call(weddingSites, { method: 'POST', body: sitePayload('pirate', true), token: keyA });
check('POST /api/wedding-sites n’existe plus → 405', res.statusCode, 405);
check('aucun site créé par l’ancien point d’entrée', store.wedding_sites.map((s) => s.slug).includes('pirate'), false);

res = await call(weddingSites, { method: 'DELETE', body: { id: 7 }, token: keyA });
check('suppression d’un site par un non-propriétaire → 403', res.statusCode, 403);
check('le site visé existe toujours', store.wedding_sites.map((s) => s.id).includes(7), true);

/* -------------------------------------------------------- 3. tables enfants */

store.site_sections.push(
  { id: 11, site_id: siteA.id, section_key: 'hero', title: 'Hero', position: 0, visible: true },
  { id: 12, site_id: siteB.id, section_key: 'hero', title: 'Hero', position: 0, visible: true }
);

check('sections d’un site publié, sans clé', (await call(siteSections, { query: { site_id: siteB.id } })).statusCode, 200);
check('sections d’un brouillon, sans clé → 403', (await call(siteSections, { query: { site_id: siteA.id } })).statusCode, 403);
check('sections d’un brouillon, avec sa clé → 200', (await call(siteSections, { query: { site_id: siteA.id }, token: keyA })).statusCode, 200);
res = await call(siteSections, { query: {} });
check('GET enfant sans site_id → 400 (fuite « toutes les lignes » fermée)', res.statusCode, 400);
check('GET enfant sans site_id ne renvoie aucune donnée', res.body?.error, 'site_id requis');

check('création de section sans clé → 403', (await call(siteSections, { method: 'POST', body: { site_id: siteA.id, section_key: 'gifts' } })).statusCode, 403);
check('création de section avec une autre clé → 403', (await call(siteSections, { method: 'POST', body: { site_id: siteA.id, section_key: 'gifts' }, token: keyB })).statusCode, 403);
res = await call(siteSections, { method: 'POST', body: { site_id: siteA.id, section_key: 'gifts', title: 'Cadeaux', position: 1 }, token: keyA });
check('création de section par le propriétaire → 201', res.statusCode, 201);
const newSectionId = res.body?.id;

check('mise à jour de section sans clé → 403', (await call(siteSections, { method: 'PUT', body: { id: newSectionId, title: 'Piraté' } })).statusCode, 403);
check('mise à jour d’une section d’autrui avec sa clé → 403', (await call(siteSections, { method: 'PUT', body: { id: 12, title: 'Piraté' }, token: keyA })).statusCode, 403);
check('la section d’autrui n’a pas bougé', store.site_sections.find((s) => s.id === 12).title, 'Hero');
res = await call(siteSections, { method: 'PUT', body: { id: newSectionId, title: 'Liste de cadeaux' }, token: keyA });
check('mise à jour de section par le propriétaire → 200', res.statusCode, 200);
check('suppression de section sans clé → 403', (await call(siteSections, { method: 'DELETE', body: { id: newSectionId } })).statusCode, 403);
check('suppression de section par le propriétaire → 200', (await call(siteSections, { method: 'DELETE', body: { id: newSectionId }, token: keyA })).statusCode, 200);
check('la section a disparu', store.site_sections.map((s) => s.id).includes(newSectionId), false);

// Le DELETE des infos pratiques, absent de l’ancien handler.
store.infos_pratiques.push({ id: 21, site_id: siteA.id, title: 'Navette', position: 0 });
check('DELETE infos par le propriétaire → 200', (await call(infos, { method: 'DELETE', body: { id: 21 }, token: keyA })).statusCode, 200);
check('DELETE infos supprimé de la table', store.infos_pratiques.length, 0);

/* ------------------------------------------------------------- 4. RSVP */

store.rsvp_responses.push(
  { id: 31, site_id: siteA.id, guest_name: 'Claire', email: 'claire@example.com', attending: true, created_at: '2026-01-02' },
  { id: 32, site_id: siteB.id, guest_name: 'Marc', email: 'marc@example.com', attending: true, created_at: '2026-01-03' }
);

check('réponses RSVP sans clé, même sur site publié → 403', (await call(rsvp, { query: { site_id: siteB.id } })).statusCode, 403);
check('réponses RSVP avec la clé d’un autre site → 403', (await call(rsvp, { query: { site_id: siteB.id }, token: keyA })).statusCode, 403);
res = await call(rsvp, { query: { site_id: siteA.id }, token: keyA });
check('réponses RSVP avec sa clé → 200', res.statusCode, 200);
check('le propriétaire ne voit que ses réponses', res.body.map((r) => r.id), [31]);

res = await call(rsvp, { method: 'POST', body: { site_id: siteB.id, guest_name: 'Invité', email: 'invite@example.com', attending: true } });
check('un invité peut répondre sans clé → 201', res.statusCode, 201);
check('réponse d’invité enregistrée', store.rsvp_responses.some((r) => r.guest_name === 'Invité'), true);
check('modification d’une réponse sans clé → 403', (await call(rsvp, { method: 'PUT', body: { id: 31, attending: false } })).statusCode, 403);
check('suppression d’une réponse sans clé → 403', (await call(rsvp, { method: 'DELETE', body: { id: 31 } })).statusCode, 403);
check('modification d’une réponse par le propriétaire → 200', (await call(rsvp, { method: 'PUT', body: { id: 31, attending: false }, token: keyA })).statusCode, 200);
check('événements RSVP d’un brouillon sans clé → 403', (await call(rsvpEvents, { query: { site_id: siteA.id } })).statusCode, 403);

/* ------------------------------------------------------- 5. médias & upload */

store.media_assets.push({ id: 41, category: 'photos', url: 'https://x/1.jpg' });
res = await call(media, { query: {} });
check('médiathèque partagée : lecture publique sans site_id → 200', res.statusCode, 200);
check('médiathèque renvoie ses lignes', res.body.length, 1);
check('ajout de média sans clé → 403', (await call(media, { method: 'POST', body: { url: 'https://x/2.jpg' } })).statusCode, 403);
res = await call(media, { method: 'POST', body: { url: 'https://x/2.jpg' }, token: keyA });
check('ajout de média avec une clé valide → 201', res.statusCode, 201);
res = await call(media, { method: 'DELETE', body: { id: 41 }, token: keyB });
check('suppression de média par un autre propriétaire → 200', res.statusCode, 200);
check('méthode non déclarée sur media → 405', (await call(media, { method: 'PUT', body: { id: 41 } })).statusCode, 405);

res = await call(upload, { method: 'POST', body: { fileName: 'photo.jpg', fileBase64: 'aGk=', contentType: 'image/jpeg' } });
check('upload sans clé → 403', res.statusCode, 403);
check('upload refusé : rien n’a été écrit', uploads.length, 0);
res = await call(upload, { method: 'POST', body: { fileName: 'photo.jpg', fileBase64: 'aGk=', contentType: 'image/jpeg' }, token: keyA });
check('upload avec une clé valide → 200', res.statusCode, 200);
check('upload renvoie une URL publique', typeof res.body?.url === 'string' && res.body.url.includes('photo.jpg'), true);
check('upload sans fichier → 400', (await call(upload, { method: 'POST', body: {}, token: keyA })).statusCode, 400);

/* ---------------------------------------------------------- 6. divers */

res = await call(siteSections, { method: 'OPTIONS' });
check('prévol CORS → 204', res.statusCode, 204);
check('prévol CORS autorise l’en-tête de clé', res.headers['Access-Control-Allow-Headers'].includes('x-site-token'), true);

for (const [name, handler] of [['programme', programme], ['infos', infos], ['gallery', gallery], ['faqs', faqs], ['gifts', gifts], ['rsvp-events', rsvpEvents]]) {
  const anon = (await call(handler, { query: { site_id: siteA.id } })).statusCode;
  const owner = (await call(handler, { query: { site_id: siteA.id }, token: keyA })).statusCode;
  const write = (await call(handler, { method: 'POST', body: { site_id: siteA.id, title: 'x' } })).statusCode;
  check(`${name} : brouillon sans clé → 403`, anon, 403);
  check(`${name} : brouillon avec sa clé → 200`, owner, 200);
  check(`${name} : écriture sans clé → 403`, write, 403);
}

/* Site « historique » publié, sans clé : lecture publique OK, édition impossible. */
check('site sans clé, publié, lecture publique → 200', (await call(weddingSites, { query: { slug: 'avant-auth' } })).statusCode, 200);
check('site sans clé : édition impossible → 403', (await call(weddingSites, { method: 'PUT', body: { id: 7, partner1: 'x' }, token: 'nimporte' })).statusCode, 403);

/* --------------------------------------- 8. base injoignable (Supabase coupé) */

/**
 * Même décor, mais avec le VRAI `server/db-client.js` et aucune variable
 * d’environnement : l’état d’un déploiement dont le projet Supabase est en
 * pause (facture impayée) ou dont les variables ont sauté.
 *
 * L’API doit alors répondre **503 `supabase_unavailable`** et non 500 : c’est
 * ce code qui autorise le front à servir la copie statique du site
 * (`public/sites/<slug>.json`) au lieu d’une page d’erreur à un invité.
 */
{
  // Un .env local ou des variables exportées ne doivent pas fausser le test :
  // on part d’une configuration vide, puis on charge les VRAIS handlers du
  // dépôt (pas de copie), avec le vrai `server/db-client.js`.
  for (const key of [
    'NEXT_PUBLIC_SUPABASE_URL', 'VITE_SUPABASE_URL', 'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY',
  ]) delete process.env[key];

  const loadReal = async (relative) => (await import(pathToFileURL(join(repoRoot, relative)).href)).default;
  const quiet = console.error;
  console.error = () => {};            // les handlers journalisent l’indisponibilité
  const downSites = await loadReal('api/wedding-sites.js');
  const downMedia = await loadReal('api/media.js');
  const downCreate = await loadReal('api/create-site.js');
  res = await call(downSites, { query: { slug: 'sarah-gabriel' } });
  check('base coupée : lecture d’un site → 503', res.statusCode, 503);
  check('base coupée : code supabase_unavailable', res.body?.code, 'supabase_unavailable');
  check('base coupée : le message explique quoi régler', /SUPABASE_URL/.test(res.body?.error ?? ''), true);
  check('base coupée : lecture publique (media) → 503', (await call(downMedia, {})).statusCode, 503);
  res = await call(downCreate, { method: 'POST', body: sitePayload('nouveau', false) });
  check('base coupée : création d’un site → 503', res.statusCode, 503);
  console.error = quiet;
}

/* --------------------------------------------------------- 9. copies statiques */

/**
 * Les fichiers servis en repli doivent rester chargeables : un nom de fichier
 * qui ne correspond pas au slug, ou une liste manquante, casserait le rendu au
 * moment précis où la base est indisponible.
 */
{
  const dir = join(repoRoot, 'public', 'sites');
  check('le dossier des copies statiques existe', existsSync(dir), true);
  const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.json')).sort() : [];
  for (const f of files) {
    const snap = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    check(`${f} : le slug correspond au nom du fichier`, snap.site?.slug, f.replace(/\.json$/, ''));
    check(
      `${f} : les sept listes d’un site complet sont présentes`,
      ['sections', 'programme', 'infos', 'gallery', 'faqs', 'rsvpEvents', 'gifts'].every((k) => Array.isArray(snap[k])),
      true
    );
    check(`${f} : les sections sont ordonnées`, snap.sections.every((s, i) => i === 0 || s.position >= snap.sections[i - 1].position), true);
  }
}

/* ------------------------------------------------------------------ bilan */

rmSync(work, { recursive: true, force: true });

console.log(`\n${failures.length ? '✗' : '✓'} API — ${pass} vérifications réussies, ${failures.length} échec(s)`);
for (const f of failures) console.log(`\n  ✗ ${f}`);
process.exit(failures.length ? 1 : 0);
