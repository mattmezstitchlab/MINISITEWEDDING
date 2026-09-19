import type {
  Faq, GalleryPhoto, GiftOption, InfoPratique, MediaAsset, Person,
  ProgrammeEvent, RsvpEvent, RsvpResponse, SiteSection, WeddingMember, WeddingSite,
} from './types';
import { MEDIA_SEED } from './mediaSeed';

/**
 * La base locale : tout le mariage tient dans le navigateur.
 *
 * Un seul objet JSON sous la clé `wedding-site:db`, avec les mêmes tables que
 * `supabase/schema.sql`. `localApi.ts` le fait répondre comme les fonctions
 * serverless, si bien que les écrans ignorent où vivent les données.
 *
 * Ce que ça change concrètement :
 *  - aucune dépendance externe, aucun compte, aucune facture ;
 *  - les modifications sont instantanées et hors ligne ;
 *  - elles restent sur **cet appareil** — pour les invités, le site est publié
 *    en déposant son fichier dans `public/sites/` (bouton « Publier » de
 *    l’éditeur).
 *
 * Le stockage du navigateur est limité (quelques Mo) : les écritures sont
 * surveillées et une image trop lourde est recompressée avant d’être rangée.
 */

const KEY = 'wedding-site:db';
const VERSION = 1;

export interface SiteSecret {
  site_id: number;
  token: string;
}

/** La clé personnelle, en clair dans le navigateur : ici, la base est à nous. */
export interface PersonSecret {
  person_id: number;
  token: string;
}

export interface LocalDb {
  version: number;
  seq: number;
  sites: WeddingSite[];
  secrets: SiteSecret[];
  sections: SiteSection[];
  programme: ProgrammeEvent[];
  infos: InfoPratique[];
  gallery: GalleryPhoto[];
  faqs: Faq[];
  rsvpEvents: RsvpEvent[];
  gifts: GiftOption[];
  rsvp: RsvpResponse[];
  media: MediaAsset[];
  people: Person[];
  members: WeddingMember[];
  personSecrets: PersonSecret[];
}

/** Écriture refusée faute de place : l’éditeur l’affiche telle quelle. */
export class StorageFullError extends Error {
  readonly status = 507;

  constructor(message = 'Stockage de l’appareil plein. Retirez des photos importées, puis réessayez.') {
    super(message);
    this.name = 'StorageFullError';
  }
}

function emptyDb(): LocalDb {
  return {
    version: VERSION,
    seq: 100,
    sites: [],
    secrets: [],
    sections: [],
    programme: [],
    infos: [],
    gallery: [],
    faqs: [],
    rsvpEvents: [],
    gifts: [],
    rsvp: [],
    // La bibliothèque livrée avec le projet : l’éditeur n’est jamais vide.
    media: MEDIA_SEED.map((m) => ({ ...m })),
    people: [],
    members: [],
    personSecrets: [],
  };
}

/** Lit la base, et repart d’une base neuve si le contenu est illisible. */
export function readDb(): LocalDb {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyDb();
    const parsed = JSON.parse(raw) as Partial<LocalDb>;
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.sites)) return emptyDb();
    // Une base plus ancienne est complétée plutôt que jetée.
    return { ...emptyDb(), ...parsed } as LocalDb;
  } catch {
    return emptyDb();
  }
}

export function writeDb(db: LocalDb): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    throw new StorageFullError();
  }
}

/** Lit, transforme, écrit. Toute mutation de la base passe par là. */
export function withDb<T>(update: (db: LocalDb) => T): T {
  const db = readDb();
  const result = update(db);
  writeDb(db);
  return result;
}

/** Prochain identifiant, dans le même ordre que les séquences Postgres. */
export function nextId(db: LocalDb): number {
  db.seq += 1;
  return db.seq;
}

/** Jeton d’édition : 192 bits, alphabet URL-safe, comme côté serveur. */
export function createToken(): string {
  const bytes = new Uint8Array(24);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }
  let out = '';
  for (const b of bytes) out += String.fromCharCode(b);
  return btoa(out).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Test : repart d’une base vide. */
export function resetDb(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // stockage indisponible : rien à oublier
  }
}
