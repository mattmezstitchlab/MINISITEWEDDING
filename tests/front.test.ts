/**
 * Vérifications des modules front de l’authentification — lancé par
 * `tests/front.test.mjs` (esbuild regroupe ce fichier TypeScript, puis Node
 * l’exécute avec un `localStorage` et un `fetch` simulés).
 *
 * Trois choses sont couvertes :
 *  1. le stockage de la clé, indexée par identifiant **et** par slug ;
 *  2. l’en-tête `x-site-token` posé par `http.ts`, et `ApiError.status` ;
 *  3. l’amorçage d’un site : la création part sans clé, toutes les sections qui
 *     suivent partent avec — l’ordre est vital, sinon l’API renvoie 403.
 */
import { saveEditToken, getEditToken, forgetEditToken, setActiveToken, getActiveToken } from '../src/lib/auth';
import { apiGet, apiSend, ApiError } from '../src/lib/http';
import { seedSite } from '../src/lib/defaults';
import { loadSiteData } from '../src/lib/siteData';
import { loadStaticSite, snapshotPath } from '../src/lib/staticSite';

let pass = 0;
const failures: string[] = [];
function check(label: string, actual: unknown, expected: unknown) {
  if (JSON.stringify(actual) === JSON.stringify(expected)) pass++;
  else failures.push(`${label}\n     attendu: ${JSON.stringify(expected)}\n     reçu   : ${JSON.stringify(actual)}`);
}

/* ------------------------------------------------------------ faux stockage */

class MemStorage {
  private map = new Map<string, string>();
  broken = false;
  getItem(key: string) { if (this.broken) throw new Error('accès interdit'); return this.map.get(key) ?? null; }
  setItem(key: string, value: string) { if (this.broken) throw new Error('quota dépassé'); this.map.set(key, value); }
  clear() { this.map.clear(); }
}
const mem = new MemStorage();

/* ---------------------------------------------------------------- faux fetch */

interface Sent { url: string; method: string; headers: Record<string, string>; body?: string }
interface FetchInit { method?: string; headers?: Record<string, string>; body?: string }

const sent: Sent[] = [];
let nextResponse: { status: number; body: unknown } = { status: 200, body: {} };
/** Réponses par chemin, pour jouer l’API d’un côté et les copies de l’autre. */
const routes: { match: (url: string) => boolean; status: number; body: unknown }[] = [];

const fakeFetch = async (url: string, init: FetchInit = {}) => {
  sent.push({ url, method: init.method ?? 'GET', headers: init.headers ?? {}, body: init.body });
  const route = routes.find((r) => r.match(url));
  const status = route ? route.status : nextResponse.status;
  const body = route ? route.body : nextResponse.body;
  return {
    ok: status >= 200 && status < 300,
    status,
    // Un chemin mal réécrit sert `index.html` : `JSON.parse` échoue vraiment.
    json: async () => {
      if (typeof body === 'string') throw new SyntaxError('Unexpected token < in JSON');
      return body;
    },
    text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
  };
};

const globals = globalThis as { localStorage?: unknown; fetch?: unknown };
globals.localStorage = mem;
globals.fetch = fakeFetch;

/* ------------------------------------------------------ 1. stockage de la clé */

mem.clear();
saveEditToken({ id: 5, slug: 'alice-bruno' }, 'JETON_A');
check('clé retrouvée par identifiant', getEditToken({ id: 5 }), 'JETON_A');
check('clé retrouvée par slug (aperçu d’un brouillon)', getEditToken({ slug: 'alice-bruno' }), 'JETON_A');
check('clé retrouvée par identifiant en chaîne (useParams)', getEditToken({ id: '5' }), 'JETON_A');
check('site inconnu → null', getEditToken({ id: 9, slug: 'autre' }), null);
saveEditToken({ id: 6, slug: 'autre-couple' }, 'JETON_B');
check('deux sites cohabitent', [getEditToken({ id: 5 }), getEditToken({ id: 6 })], ['JETON_A', 'JETON_B']);
forgetEditToken({ id: 5, slug: 'alice-bruno' });
check('oubli de la clé', getEditToken({ id: 5 }), null);
check('oubli ciblé : l’autre site est intact', getEditToken({ id: 6 }), 'JETON_B');
saveEditToken({ id: 5, slug: 'alice-bruno' }, 'JETON_A');

mem.broken = true;
let crashed = false;
try {
  saveEditToken({ id: 7 }, 'JETON_C');
  getEditToken({ id: 7 });
} catch {
  crashed = true;
}
check('stockage indisponible (navigation privée) : aucune exception', crashed, false);
mem.broken = false;

/* ------------------------------------------------------------ 2. en-tête HTTP */

setActiveToken(null);
sent.length = 0;
nextResponse = { status: 200, body: { ok: true } };
await apiGet('/api/media');
check('sans clé active : pas d’en-tête x-site-token', 'x-site-token' in sent[0].headers, false);

setActiveToken('JETON_A');
sent.length = 0;
await apiGet('/api/site-sections?site_id=5');
check('avec clé active : en-tête x-site-token envoyé', sent[0].headers['x-site-token'], 'JETON_A');
check('GET : pas de Content-Type inutile', 'Content-Type' in sent[0].headers, false);

sent.length = 0;
await apiSend('/api/faqs', 'POST', { site_id: 5 });
check('envoi : méthode et Content-Type', [sent[0].method, sent[0].headers['Content-Type']], ['POST', 'application/json']);
check('envoi : la clé accompagne la requête', sent[0].headers['x-site-token'], 'JETON_A');
check('envoi : corps sérialisé', sent[0].body, JSON.stringify({ site_id: 5 }));

nextResponse = { status: 403, body: { error: 'Clé d’édition requise' } };
let caught: unknown = null;
try {
  await apiSend('/api/wedding-sites', 'PUT', { id: 5 });
} catch (err) {
  caught = err;
}
check('erreur : ApiError portant son code HTTP', [caught instanceof ApiError, caught instanceof ApiError ? caught.status : null], [true, 403]);
nextResponse = { status: 200, body: { ok: true } };

/* -------------------------------------------- 3. amorçage d’un nouveau site */

setActiveToken(null);
mem.clear();
sent.length = 0;
nextResponse = {
  status: 201,
  body: { site: { id: 42, slug: 'alice-bruno', partner1: 'Alice', partner2: 'Bruno' }, edit_token: 'JETON_NEUF' },
};

const created = await seedSite({
  partner1: 'Alice',
  partner2: 'Bruno',
  wedding_date: '2026-06-20',
  venue: 'Château de Larris',
  city: 'Paris',
  style: 'romantique',
});

check('amorçage : renvoie le site et sa clé', [created.site.id, created.editToken], [42, 'JETON_NEUF']);
check('amorçage : première requête = POST /api/create-site', [sent[0].url, sent[0].method], ['/api/create-site', 'POST']);
check('amorçage : la création part sans clé (elle n’existe pas encore)', 'x-site-token' in sent[0].headers, false);

const children = sent.slice(1);
check('amorçage : les tables enfants sont alimentées', children.length > 0, true);
check('amorçage : aucune création d’enfant ne part sans clé', children.every((r) => r.headers['x-site-token'] === 'JETON_NEUF'), true);
check('amorçage : chaque enfant porte le site_id créé', children.every((r) => JSON.parse(r.body as string).site_id === 42), true);
check('amorçage : la clé est mémorisée pour l’éditeur', getEditToken({ id: 42 }), 'JETON_NEUF');
check('amorçage : la clé est mémorisée pour l’aperçu', getEditToken({ slug: 'alice-bruno' }), 'JETON_NEUF');
check('amorçage : la clé reste active après création', getActiveToken(), 'JETON_NEUF');
check('amorçage : les sept tables enfants sont servies', new Set(children.map((r) => r.url)).size, 7);


/* ------------------------------------- 4. repli sur copie statique (base coupée) */

const snapshot = {
  site: { id: 1, slug: 'matt-marie', partner1: 'Matt', partner2: 'Marie', wedding_date: '2027-07-18' },
  sections: [{ id: 1, site_id: 1, section_key: 'hero', title: 'Accueil', visible: true, position: 0 }],
  programme: [], infos: [], gallery: [], faqs: [], rsvpEvents: [], gifts: [],
  exported_at: '2026-09-17T12:00:00.000Z',
};
const apiDown = { status: 503, body: { error: 'Configuration Supabase manquante', code: 'supabase_unavailable' } };

check('chemin de la copie statique', snapshotPath('matt-marie'), '/sites/matt-marie.json');

// L’API est en panne, une copie existe : le site s’affiche quand même.
routes.length = 0;
routes.push({ match: (u) => u.startsWith('/api/'), ...apiDown });
routes.push({ match: (u) => u === snapshotPath('matt-marie'), status: 200, body: snapshot });
let loaded = await loadSiteData({ slug: 'matt-marie' });
check('base coupée : la copie statique est servie', loaded.degraded, true);
check('base coupée : le contenu affiché est celui de la copie', loaded.data.site.partner1, 'Matt');

// L’API répond : la copie n’est jamais demandée.
routes.length = 0;
sent.length = 0;
routes.push({ match: (u) => u.startsWith('/api/wedding-sites'), status: 200, body: snapshot.site });
routes.push({ match: (u) => u.startsWith('/api/'), status: 200, body: [] });
loaded = await loadSiteData({ slug: 'matt-marie' });
check('API en ligne : pas de repli', loaded.degraded, false);
check('API en ligne : aucune copie n’est lue', sent.some((r) => r.url.startsWith('/sites/')), false);

// Un brouillon (404) ne doit jamais basculer sur une copie : ce serait le publier.
routes.length = 0;
routes.push({ match: (u) => u.startsWith('/api/'), status: 404, body: { error: 'Introuvable' } });
routes.push({ match: (u) => u.startsWith('/sites/'), status: 200, body: snapshot });
let caught2: unknown = null;
try {
  await loadSiteData({ slug: 'matt-marie' });
} catch (err) {
  caught2 = err;
}
check('brouillon (404) : pas de repli sur la copie', caught2 instanceof ApiError ? caught2.status : null, 404);

// Base coupée et aucune copie : l’erreur d’origine remonte telle quelle.
routes.length = 0;
routes.push({ match: (u) => u.startsWith('/api/'), ...apiDown });
routes.push({ match: (u) => u.startsWith('/sites/'), status: 404, body: { error: 'Not found' } });
caught2 = null;
try {
  await loadSiteData({ slug: 'inconnu' });
} catch (err) {
  caught2 = err;
}
check('base coupée sans copie : l’erreur de l’API remonte', caught2 instanceof Error ? caught2.message : null, 'Configuration Supabase manquante');
check('copie absente : loadStaticSite renvoie null', await loadStaticSite('inconnu'), null);

// La réécriture SPA peut servir index.html à la place du JSON : la garde l’écarte.
routes.length = 0;
routes.push({ match: (u) => u.startsWith('/api/'), ...apiDown });
routes.push({ match: (u) => u.startsWith('/sites/'), status: 200, body: '<!doctype html><html></html>' });
caught2 = null;
try {
  await loadSiteData({ slug: 'matt-marie' });
} catch (err) {
  caught2 = err;
}
check('HTML servi à la place du JSON : pas de repli', caught2 instanceof ApiError, true);

// Une copie partielle reste affichable : les listes absentes deviennent vides.
routes.length = 0;
routes.push({ match: (u) => u.startsWith('/sites/'), status: 200, body: { site: snapshot.site, sections: snapshot.sections } });
const partial = await loadStaticSite('matt-marie');
check('copie partielle : les listes manquantes sont complétées', [partial?.faqs.length, partial?.gifts.length, partial?.rsvpEvents.length], [0, 0, 0]);
check('copie partielle : le site lui-même est conservé', partial?.site.slug, 'matt-marie');

// L’éditeur charge par identifiant : les copies, indexées par slug, ne le concernent pas.
routes.length = 0;
sent.length = 0;
routes.push({ match: (u) => u.startsWith('/api/'), ...apiDown });
routes.push({ match: (u) => u.startsWith('/sites/'), status: 200, body: snapshot });
caught2 = null;
try {
  await loadSiteData({ id: 1 });
} catch (err) {
  caught2 = err;
}
check('éditeur (chargement par id) : aucune copie n’est lue', sent.some((r) => r.url.startsWith('/sites/')), false);
check('éditeur : l’erreur de l’API remonte', caught2 instanceof ApiError, true);
routes.length = 0;

/* ------------------------------------------------------------------- bilan */

console.log(`\n${failures.length ? '✗' : '✓'} Front — ${pass} vérifications réussies, ${failures.length} échec(s)`);
for (const f of failures) console.log(`\n  ✗ ${f}`);
process.exit(failures.length ? 1 : 0);
