import type { LocalDb } from './localStore';
import { createToken, nextId, readDb, withDb } from './localStore';
import type { Person, WeddingMember, WeddingSite } from './types';
import {
  cleanPersonPatch,
  isValidRoleId,
  redactPerson,
  type PersonRow,
  type Viewer,
} from './personRules';

/**
 * Les fonctions serverless, rejouées dans le navigateur.
 *
 * `http.ts` aiguille ici quand aucune base distante n’est configurée. Les
 * chemins, les corps de requête, les codes d’état et surtout **les règles
 * d’autorisation** sont les mêmes que dans `api/` et `server/crud.js` : une
 * clé d’édition d’un autre site y est refusée pareil, un brouillon y reste
 * invisible, un GET d’enfants sans `site_id` y renvoie 400.
 *
 * L’intérêt n’est pas de dupliquer pour le plaisir : les écrans n’ont qu’un
 * seul chemin d’accès aux données, et le jour où une base revient, il suffit
 * de renseigner `VITE_SUPABASE_URL` — voir `dataSource.ts`.
 */

export interface LocalResponse {
  status: number;
  body: unknown;
}

type Row = { id: number; site_id?: number; position?: number; created_at?: string } & Record<string, unknown>;
type TableKey = 'sections' | 'programme' | 'infos' | 'gallery' | 'faqs' | 'rsvpEvents' | 'gifts' | 'rsvp' | 'media';
type WriteRule = 'public' | 'owner' | 'any-owner';
type Verb = 'POST' | 'PUT' | 'DELETE';

interface TableSpec {
  key: TableKey;
  label: string;
  order: string;
  direction?: 'asc' | 'desc';
  limit?: number;
  filters: string[];
  read: 'public' | 'published-or-owner' | 'owner';
  write: WriteRule | Partial<Record<Verb, WriteRule>>;
  verbs?: Verb[];
}

/** Même déclaration que les fichiers de `api/`, ligne pour ligne. */
const TABLES: Record<string, TableSpec> = {
  '/api/site-sections': { key: 'sections', label: 'site-sections', order: 'position', filters: ['site_id'], read: 'published-or-owner', write: 'owner' },
  '/api/programme': { key: 'programme', label: 'programme', order: 'position', filters: ['site_id'], read: 'published-or-owner', write: 'owner' },
  '/api/infos': { key: 'infos', label: 'infos', order: 'position', filters: ['site_id'], read: 'published-or-owner', write: 'owner' },
  '/api/gallery': { key: 'gallery', label: 'gallery', order: 'position', filters: ['site_id'], read: 'published-or-owner', write: 'owner' },
  '/api/faqs': { key: 'faqs', label: 'faqs', order: 'position', filters: ['site_id'], read: 'published-or-owner', write: 'owner' },
  '/api/rsvp-events': { key: 'rsvpEvents', label: 'rsvp-events', order: 'position', filters: ['site_id'], read: 'published-or-owner', write: 'owner' },
  '/api/gifts': { key: 'gifts', label: 'gifts', order: 'position', filters: ['site_id'], read: 'published-or-owner', write: 'owner' },
  '/api/rsvp': {
    key: 'rsvp', label: 'rsvp', order: 'created_at', direction: 'desc', limit: 500, filters: ['site_id'],
    read: 'owner', write: { POST: 'public', PUT: 'owner', DELETE: 'owner' },
  },
  '/api/media': {
    key: 'media', label: 'media', order: 'id', filters: ['category', 'collection'],
    read: 'public', write: 'any-owner', verbs: ['POST', 'DELETE'],
  },
};

/* ------------------------------------------------------------------ réponses */

const ok = (body: unknown, status = 200): LocalResponse => ({ status, body });
const fail = (status: number, error: string): LocalResponse => ({ status, body: { error } });

function rowsOf(db: LocalDb, key: TableKey): Row[] {
  return db[key] as unknown as Row[];
}

/* ------------------------------------------------------------- autorisations */

function ownerSiteId(db: LocalDb, token: string | null): number | null {
  if (!token) return null;
  const secret = db.secrets.find((s) => s.token === token);
  return secret ? secret.site_id : null;
}

function isPublished(db: LocalDb, siteId: number | null): boolean {
  if (!siteId) return false;
  return Boolean(db.sites.find((s) => s.id === siteId)?.published);
}

function writeRule(spec: TableSpec, verb: Verb): WriteRule {
  if (typeof spec.write === 'string') return spec.write;
  return spec.write[verb] ?? 'owner';
}

function sortBy(rows: Row[], column: string, ascending: boolean): Row[] {
  return rows.slice().sort((a, b) => {
    const av = a[column] as string | number | null | undefined;
    const bv = b[column] as string | number | null | undefined;
    if (av === bv) return 0;
    if (av === null || av === undefined) return ascending ? -1 : 1;
    if (bv === null || bv === undefined) return ascending ? 1 : -1;
    const cmp = av > bv ? 1 : -1;
    return ascending ? cmp : -cmp;
  });
}

/* --------------------------------------------------------------------- CRUD */

function crud(spec: TableSpec, method: string, query: Record<string, string>, payload: Record<string, unknown>, token: string | null): LocalResponse {
  const db = readDb();
  const rows = rowsOf(db, spec.key);

  if (method === 'GET') {
    const siteId = Number(query.site_id) || null;
    if (spec.read !== 'public') {
      if (!siteId) return fail(400, 'site_id requis');
      const owner = ownerSiteId(db, token);
      if (owner !== siteId) {
        const allowed = spec.read === 'published-or-owner' && isPublished(db, siteId);
        if (!allowed) return fail(403, owner ? 'Clé d’édition d’un autre site' : 'Clé d’édition requise');
      }
    }
    let out = rows.filter((row) =>
      spec.filters.every((filter) => !query[filter] || String(row[filter]) === String(query[filter]))
    );
    out = sortBy(out, spec.order, spec.direction !== 'desc');
    if (spec.limit) out = out.slice(0, spec.limit);
    return ok(out.map((row) => ({ ...row })));
  }

  if (!['POST', 'PUT', 'DELETE'].includes(method)) return fail(405, 'Method not allowed');
  const verb = method as Verb;
  if (spec.verbs && !spec.verbs.includes(verb)) return fail(405, 'Method not allowed');

  const rule = writeRule(spec, verb);
  if (rule !== 'public') {
    const owner = ownerSiteId(db, token);
    if (!owner) return fail(403, 'Clé d’édition requise');
    if (rule === 'owner') {
      const rowId = verb === 'POST' ? null : Number(payload.id) || null;
      const siteId = rowId ? rows.find((r) => r.id === rowId)?.site_id ?? null : Number(payload.site_id) || null;
      if (!siteId) return fail(rowId ? 404 : 400, rowId ? 'Ligne introuvable' : 'site_id requis');
      if (siteId !== owner) return fail(403, 'Clé d’édition d’un autre site');
    }
  }

  return withDb((live) => {
    const liveRows = rowsOf(live, spec.key);

    if (verb === 'POST') {
      const row = { id: nextId(live), ...(spec.key === 'rsvp' ? { created_at: new Date().toISOString() } : {}), ...payload } as Row;
      liveRows.push(row);
      return ok({ ...row }, 201);
    }

    const id = Number(payload.id) || null;
    if (!id) return fail(400, 'id requis');
    const index = liveRows.findIndex((r) => r.id === id);
    if (index < 0) return fail(404, 'Ligne introuvable');

    if (verb === 'PUT') {
      const patch = { ...payload };
      delete patch.id;
      liveRows[index] = { ...liveRows[index], ...patch };
      return ok({ ...liveRows[index] });
    }

    liveRows.splice(index, 1);
    return ok({ ok: true });
  });
}

/* --------------------------------------------------------------- le site lui-même */

function weddingSites(method: string, query: Record<string, string>, payload: Record<string, unknown>, token: string | null): LocalResponse {
  const db = readDb();
  const owner = ownerSiteId(db, token);

  if (method === 'GET') {
    const { slug, id } = query;
    if (!slug && !id) return fail(400, 'slug ou id requis');

    if (id) {
      if (owner !== Number(id)) return fail(403, 'Clé d’édition requise');
      const site = db.sites.find((s) => s.id === Number(id));
      return site ? ok({ ...site }) : fail(404, 'Introuvable');
    }

    const site = db.sites.find((s) => s.slug === slug);
    // Un brouillon reste invisible, sauf pour son propriétaire.
    if (!site || (!site.published && owner !== site.id)) return fail(404, 'Introuvable');
    return ok({ ...site });
  }

  if (!['PUT', 'DELETE'].includes(method)) return fail(405, 'Method not allowed');
  const id = Number(payload.id) || null;
  if (!id) return fail(400, 'id requis');
  if (owner !== id) return fail(403, 'Clé d’édition requise');

  return withDb((live) => {
    const index = live.sites.findIndex((s) => s.id === id);
    if (index < 0) return fail(404, 'Introuvable');
    if (method === 'PUT') {
      const patch = { ...payload };
      delete patch.id;
      live.sites[index] = { ...live.sites[index], ...patch } as WeddingSite;
      return ok({ ...live.sites[index] });
    }
    // Suppression en cascade : le site et tout ce qu’il porte.
    const [removed] = live.sites.splice(index, 1);
    live.secrets = live.secrets.filter((s) => s.site_id !== removed.id);
    for (const key of ['sections', 'programme', 'infos', 'gallery', 'faqs', 'rsvpEvents', 'gifts', 'rsvp'] as const) {
      live[key] = live[key].filter((row) => row.site_id !== removed.id) as never;
    }
    return ok({ ok: true });
  });
}

function createSite(method: string, payload: Record<string, unknown>): LocalResponse {
  if (method !== 'POST') return fail(405, 'Method not allowed');
  const { slug, partner1, partner2 } = payload;
  if (!slug || !partner1 || !partner2) return fail(400, 'slug, partner1 et partner2 sont requis');

  return withDb((db) => {
    // Un slug est une adresse publique : il doit rester unique.
    let unique = String(slug);
    while (db.sites.some((s) => s.slug === unique)) {
      unique = `${slug}-${Math.random().toString(36).slice(2, 4)}`;
    }
    const site = { id: nextId(db), ...payload, slug: unique, published: payload.published ?? false } as unknown as WeddingSite;
    db.sites.push(site);
    const editToken = createToken();
    db.secrets.push({ site_id: site.id, token: editToken });
    return ok({ site: { ...site }, edit_token: editToken }, 201);
  });
}

/* ------------------------------------------------------------------- images */

/**
 * Une photo de téléphone pèse plusieurs Mo : rangée telle quelle en `data:`
 * URL, elle sature le stockage de l’appareil. On la redimensionne donc avant
 * de l’enregistrer (1600 px de large, JPEG 0.82) — invisible sur un site,
 * décisif pour la place.
 */
async function shrink(dataUrl: string, maxSide = 1600, quality = 0.82): Promise<string> {
  if (typeof document === 'undefined') return dataUrl; // hors navigateur (tests)
  if (!dataUrl.startsWith('data:image/') || dataUrl.length < 400_000) return dataUrl;
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('image illisible'));
      el.src = dataUrl;
    });
    const ratio = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
    if (ratio >= 1) return dataUrl;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(image.naturalWidth * ratio);
    canvas.height = Math.round(image.naturalHeight * ratio);
    const ctx = canvas.getContext('2d');
    if (!ctx) return dataUrl;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const shrunk = canvas.toDataURL('image/jpeg', quality);
    return shrunk.length < dataUrl.length ? shrunk : dataUrl;
  } catch {
    return dataUrl;
  }
}

async function upload(method: string, payload: Record<string, unknown>, token: string | null): Promise<LocalResponse> {
  if (method !== 'POST') return fail(405, 'Method not allowed');
  if (!ownerSiteId(readDb(), token)) return fail(403, 'Clé d’édition requise');

  const { fileName, fileBase64, contentType } = payload;
  if (!fileName || !fileBase64) return fail(400, 'Fichier manquant');
  const url = await shrink(`data:${contentType || 'image/jpeg'};base64,${fileBase64}`);

  return withDb((db) => {
    const id = nextId(db);
    db.media.unshift({
      id,
      category: 'Mes photos',
      title: String(fileName).replace(/\.[^.]+$/, ''),
      url,
      collection: 'Importées',
      kind: 'photo',
      orientation: 'paysage',
    });
    return ok({ url });
  });
}

/* ------------------------------------------------------------ les personnes */

/**
 * Les personnes et leurs places, rejouées comme dans `api/people.js` et
 * `api/wedding-members.js` — mêmes corps, mêmes codes, mêmes règles de
 * lecture. La clé personnelle est en clair : cette base est celle du
 * navigateur, elle n'est pas un secret partagé.
 */
function personIdFromToken(db: LocalDb, token: string | null): number | null {
  if (!token) return null;
  return db.personSecrets.find((s) => s.token === token)?.person_id ?? null;
}

function viewerOf(db: LocalDb, personToken: string | null): Viewer {
  const personId = personIdFromToken(db, personToken);
  const memberships = personId
    ? db.members
        .filter((m) => m.person_id === personId)
        .map((m) => ({ id: m.id, site_id: m.site_id, role_id: m.role_id }))
    : [];
  return { personId, memberships };
}

function siteIdFrom(db: LocalDb, query: Record<string, string>): number | null {
  if (query.site_id) {
    const n = Number(query.site_id);
    return Number.isFinite(n) && n > 0 ? n : null;
  }
  if (!query.slug) return null;
  const site = db.sites.find((s) => s.slug === query.slug);
  return site ? Number(site.id) : null;
}

function canReadSiteHere(db: LocalDb, viewer: Viewer, siteId: number | null, siteToken: string | null): boolean {
  if (!siteId) return false;
  const site = db.sites.find((s) => Number(s.id) === Number(siteId));
  if (!site) return false;
  if (site.published) return true;
  if (viewer.personId && viewer.memberships.some((m) => Number(m.site_id) === Number(siteId))) return true;
  return ownerSiteId(db, siteToken) === Number(siteId);
}

function peopleRoutes(
  method: string,
  query: Record<string, string>,
  payload: Record<string, unknown>,
  siteToken: string | null,
  personToken: string | null,
): LocalResponse {
  const db = readDb();
  const viewer = viewerOf(db, personToken);

  if (method === 'POST') {
    const propre = cleanPersonPatch(payload);
    const prenom = String(propre.first_name ?? '').trim();
    if (!prenom) return fail(400, 'Le prénom est requis pour créer une carte');

    return withDb((live) => {
      const person: Person = {
        id: nextId(live),
        first_name: '',
        last_name: '',
        photo: '',
        home_city: '',
        trade: '',
        bio: '',
        email: '',
        phone: '',
        website: '',
        social: '',
        contact_visibility: 'participants',
        ...(propre as Partial<Person>),
      };
      const token = createToken();
      live.people.push(person);
      live.personSecrets.push({ person_id: person.id, token });
      const lecteur: Viewer = { personId: person.id, memberships: [] };
      return ok({ person: redactPerson(person as PersonRow, lecteur), person_token: token }, 201);
    });
  }

  if (method === 'PUT') {
    const personId = viewer.personId;
    if (!personId) return fail(403, 'Clé personnelle requise');
    const patch = cleanPersonPatch(payload);
    if (Object.keys(patch).length === 0) return fail(400, 'Aucun champ reconnu à modifier');

    return withDb((live) => {
      const index = live.people.findIndex((p) => Number(p.id) === Number(personId));
      if (index < 0) return fail(404, 'Introuvable');
      live.people[index] = { ...live.people[index], ...(patch as Partial<Person>) };
      const lecteur = viewerOf(live, personToken);
      return ok({ person: redactPerson(live.people[index] as PersonRow, lecteur) });
    });
  }

  if (method !== 'GET') return fail(405, 'Method not allowed');

  const { id, site_id: siteParam, slug } = query;

  // Ma carte : sans cible, la clé suffit.
  if (!id && !siteParam && !slug) {
    if (!viewer.personId) return fail(400, 'id, site_id ou slug requis');
    const moi = db.people.find((p) => Number(p.id) === Number(viewer.personId));
    if (!moi) return fail(404, 'Introuvable');
    return ok({ person: redactPerson(moi as PersonRow, viewer) });
  }

  const siteId = siteIdFrom(db, query);

  if (id) {
    const person = db.people.find((p) => Number(p.id) === Number(id));
    if (!person) return fail(404, 'Introuvable');
    return ok({ person: redactPerson(person as PersonRow, viewer, siteId) });
  }

  if (!siteId) return fail(404, 'Introuvable');
  if (!canReadSiteHere(db, viewer, siteId, siteToken)) return fail(404, 'Introuvable');

  const ids = db.members.filter((m) => Number(m.site_id) === siteId).map((m) => Number(m.person_id));
  const people = ids
    .map((personId) => db.people.find((p) => Number(p.id) === personId))
    .filter((p): p is Person => Boolean(p))
    .map((person) => redactPerson(person as PersonRow, viewer, siteId));

  return ok({ people });
}

function memberRoutes(
  method: string,
  query: Record<string, string>,
  payload: Record<string, unknown>,
  siteToken: string | null,
  personToken: string | null,
): LocalResponse {
  const db = readDb();
  const viewer = viewerOf(db, personToken);

  if (method === 'GET') {
    if (!query.site_id && !query.slug) {
      if (!viewer.personId) return fail(400, 'site_id ou slug requis');
      const memberships = db.members
        .filter((m) => Number(m.person_id) === Number(viewer.personId))
        .map((member) => ({
          member,
          site: db.sites.find((s) => Number(s.id) === Number(member.site_id)) ?? null,
        }));
      return ok({ memberships });
    }

    const siteId = siteIdFrom(db, query);
    if (!siteId) return fail(404, 'Introuvable');
    if (!canReadSiteHere(db, viewer, siteId, siteToken)) return fail(404, 'Introuvable');

    const members = db.members
      .filter((m) => Number(m.site_id) === siteId)
      .sort((a, b) => String(a.joined_at ?? '').localeCompare(String(b.joined_at ?? '')))
      .map((m) => {
        const person = db.people.find((p) => Number(p.id) === Number(m.person_id)) ?? null;
        return {
          ...m,
          person: person ? redactPerson(person as PersonRow, viewer, siteId) : null,
        };
      });

    return ok({
      members,
      count: members.length,
      moi: viewer.personId ? members.find((m) => Number(m.person_id) === Number(viewer.personId)) ?? null : null,
    });
  }

  const personId = viewer.personId;
  if (!personId) return fail(403, 'Clé personnelle requise');

  if (method === 'POST') {
    const siteId = siteIdFrom(db, { site_id: String(payload.site_id ?? ''), slug: String(payload.slug ?? '') });
    if (!siteId) return fail(404, 'Mariage introuvable');
    // On ne rejoint qu'un mariage ouvert : publié, ou déjà à nous.
    if (!canReadSiteHere(db, viewer, siteId, siteToken)) return fail(404, 'Mariage introuvable');
    if (!isValidRoleId(payload.role_id)) return fail(400, 'Rôle invalide');

    return withDb((live) => {
      const existant = live.members.find(
        (m) => Number(m.site_id) === siteId && Number(m.person_id) === Number(personId),
      );
      if (existant) {
        if (existant.role_id !== payload.role_id) {
          existant.role_id = String(payload.role_id);
          existant.status = 'confirme';
        }
        return ok({ member: existant, deja: true });
      }
      const membre: WeddingMember = {
        id: nextId(live),
        site_id: siteId,
        person_id: Number(personId),
        role_id: String(payload.role_id),
        status: 'confirme',
        joined_at: new Date().toISOString(),
      };
      live.members.push(membre);
      const lecteur = viewerOf(live, personToken);
      const person = live.people.find((p) => Number(p.id) === Number(personId)) ?? null;
      return ok(
        { member: { ...membre, person: person ? redactPerson(person as PersonRow, lecteur, siteId) : null }, deja: false },
        201,
      );
    });
  }

  if (method === 'DELETE') {
    const id = Number(query.id);
    if (!Number.isFinite(id) || id <= 0) return fail(400, 'id requis');
    const ligne = db.members.find((m) => Number(m.id) === id);
    if (!ligne) return fail(404, 'Introuvable');
    if (Number(ligne.person_id) !== Number(personId)) return fail(403, 'Accès refusé');
    return withDb((live) => {
      const index = live.members.findIndex((m) => Number(m.id) === id);
      if (index >= 0) live.members.splice(index, 1);
      return ok({ deleted: true });
    });
  }

  return fail(405, 'Method not allowed');
}

/* ------------------------------------------------------------------- entrée */

export async function localRequest(
  path: string,
  method: string,
  body: unknown,
  token: string | null,
  personToken: string | null = null,
): Promise<LocalResponse> {
  const [pathname, search = ''] = path.split('?');
  const query = Object.fromEntries(new URLSearchParams(search));
  const payload = (body ?? {}) as Record<string, unknown>;

  try {
    if (pathname === '/api/create-site') return createSite(method, payload);
    if (pathname === '/api/wedding-sites') return weddingSites(method, query, payload, token);
    if (pathname === '/api/upload') return await upload(method, payload, token);
    if (pathname === '/api/people') return peopleRoutes(method, query, payload, token, personToken);
    if (pathname === '/api/wedding-members') return memberRoutes(method, query, payload, token, personToken);

    const spec = TABLES[pathname];
    if (!spec) return fail(404, 'Route inconnue');
    return crud(spec, method, query, payload, token);
  } catch (err) {
    const status = typeof (err as { status?: number }).status === 'number' ? (err as { status: number }).status : 500;
    return fail(status, err instanceof Error ? err.message : 'Erreur interne');
  }
}
