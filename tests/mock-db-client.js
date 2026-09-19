/**
 * Faux client Supabase pour tester les handlers sans base réelle.
 * Remplace `server/db-client.js` (même export par défaut) dans le dossier de test.
 */

export const store = {
  wedding_sites: [],
  site_secrets: [],
  site_sections: [],
  programme_events: [],
  infos_pratiques: [],
  gallery_photos: [],
  faqs: [],
  gift_options: [],
  rsvp_events: [],
  rsvp_responses: [],
  media_assets: [],
  people: [],
  person_secrets: [],
  wedding_members: [],
  wedding_live: [],
};

/** `{ table, message }` : force l’échec du prochain insert sur cette table. */
export const failInsertOn = { table: null, message: 'insert refusé' };

export const uploads = [];

let seq = 100;

export function reset() {
  for (const key of Object.keys(store)) store[key] = [];
  failInsertOn.table = null;
  uploads.length = 0;
  seq = 100;
}

function matches(row, filters) {
  return filters.every(([key, value]) =>
    Array.isArray(value) ? value.map(String).includes(String(row[key])) : String(row[key]) === String(value),
  );
}

class Query {
  constructor(table) {
    this.table = table;
    this.op = 'select';
    this.filters = [];
    this.orders = [];
    this.max = null;
    this.payload = null;
  }

  select() { return this; }
  eq(key, value) { this.filters.push([key, value]); return this; }
  /** `in()` de Supabase : un filtre, plusieurs valeurs possibles. */
  in(key, values) { this.filters.push([key, Array.isArray(values) ? values : [values]]); return this; }
  order(col, opts = {}) { this.orders.push([col, opts.ascending !== false]); return this; }
  limit(n) { this.max = n; return this; }
  insert(rows) { this.payload = rows; this.op = 'insert'; return this; }
  update(patch) { this.payload = patch; this.op = 'update'; return this; }
  delete() { this.op = 'delete'; return this; }
  single() { return this.run('single'); }
  maybeSingle() { return this.run('maybeSingle'); }
  then(resolve, reject) { return this.run('list').then(resolve, reject); }

  async run(mode) {
    const rows = store[this.table] || (store[this.table] = []);

    if (this.op === 'insert') {
      if (failInsertOn.table === this.table) return { data: null, error: { message: failInsertOn.message } };
      const row = { id: ++seq, ...this.payload };
      rows.push(row);
      return mode === 'single' ? { data: { ...row }, error: null } : { data: [{ ...row }], error: null };
    }

    if (this.op === 'update') {
      const targets = rows.filter((r) => matches(r, this.filters));
      for (const r of targets) Object.assign(r, this.payload);
      if (!targets.length) return { data: null, error: { message: '0 rows' } };
      return mode === 'single' ? { data: { ...targets[0] }, error: null } : { data: targets.map((r) => ({ ...r })), error: null };
    }

    if (this.op === 'delete') {
      const keep = rows.filter((r) => !matches(r, this.filters));
      const removed = rows.length - keep.length;
      rows.length = 0;
      rows.push(...keep);
      return { data: null, error: null, count: removed };
    }

    // select
    let out = rows.filter((r) => matches(r, this.filters));
    for (const [col, asc] of this.orders) {
      out = out.slice().sort((a, b) => {
        const av = a[col];
        const bv = b[col];
        if (av === bv) return 0;
        const cmp = av > bv ? 1 : -1;
        return asc ? cmp : -cmp;
      });
    }
    if (this.max) out = out.slice(0, this.max);
    if (mode === 'single') {
      return out.length ? { data: { ...out[0] }, error: null } : { data: null, error: { message: '0 rows' } };
    }
    if (mode === 'maybeSingle') return { data: out.length ? { ...out[0] } : null, error: null };
    return { data: out.map((r) => ({ ...r })), error: null };
  }
}

const supabase = {
  from: (table) => new Query(table),
  storage: {
    from: () => ({
      upload: async (name, buffer, options) => {
        uploads.push({ name, size: buffer.length, options });
        return { error: null };
      },
      getPublicUrl: (name) => ({ data: { publicUrl: `https://mock.storage/wedding-media/${name}` } }),
    }),
  },
};

export default supabase;
