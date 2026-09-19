import { GLOBAL_WEDDING_PLAYLIST_FULL } from './weddingDjPlaylist';
import type { Track } from './weddingSoundtrack';

/**
 * LA PLAYLIST COLLABORATIVE
 *
 * Un seul catalogue, deux familles de morceaux :
 *  - ceux qui ont un **extrait réel** dans `public/audio/` — ils s'écoutent
 *    dans la page, sur leur carte musicale ;
 *  - ceux qui sont **suggérés** — de vrais morceaux de mariage, sans extrait
 *    libre : ils s'ajoutent à la playlist, et le lien renvoie à l'original.
 *
 * La recherche et la playlist vivent ici, sans base : c'est le même catalogue
 * pour tout le monde, et la liste choisie reste sur l'appareil.
 */

export interface Morceau extends Track {
  id: string;
  artiste: string;
  /** Le moment du mariage auquel il appartient. */
  moment: string;
  /** L'humeur, en un mot ou deux. */
  ambiance: string;
  /** L'identifiant Spotify de l'original, quand il existe. */
  spotifyId?: string;
  /** Vrai quand le morceau est seulement suggéré (pas d'extrait local). */
  suggere?: boolean;
}

/** Les extraits réels : chaque morceau a son fichier dans `public/audio/`. */
const EXTRAITS: Morceau[] = GLOBAL_WEDDING_PLAYLIST_FULL.map((t) => ({
  id: t.id,
  title: t.title,
  subtitle: `${t.artist} · ${t.phaseLabel}`,
  src: t.previewUrl,
  cover: t.artwork,
  artiste: t.artist,
  moment: t.phaseLabel,
  ambiance: t.audioBpm >= 110 ? 'ça danse' : t.audioBpm >= 90 ? 'ça balance' : 'ça écoute',
  spotifyId: t.spotifyTrackId,
}));

/** Les suggestions : de vrais morceaux, sans extrait libre. */
const SUGGESTIONS: Array<Omit<Morceau, 'src' | 'subtitle' | 'suggere'>> = [
  { id: 'sug-1', title: 'Thinkin’ Out Loud', artiste: 'Ed Sheeran', cover: '/images/bouquet.jpg', moment: 'Première danse', ambiance: 'à deux', spotifyId: '34gCuhDGsG4bRPIf9bb02f' },
  { id: 'sug-2', title: 'Stand by Me', artiste: 'Ben E. King', cover: '/images/garden.jpg', moment: 'Cérémonie', ambiance: 'tout le monde', spotifyId: '3SdTKo2uVsxFblQjpScoHy' },
  { id: 'sug-3', title: 'Dancing Queen', artiste: 'ABBA', cover: '/images/danse.jpg', moment: 'Bal', ambiance: 'dancefloor', spotifyId: '0GjEhVFGZW8afUYGChu3Rr' },
  { id: 'sug-4', title: 'Superstition', artiste: 'Stevie Wonder', cover: '/images/club-amour.jpg', moment: 'Bal', ambiance: 'dancefloor', spotifyId: '1hA8LOb0lMdWXQfXaISnHu' },
  { id: 'sug-5', title: 'Get Lucky', artiste: 'Daft Punk', cover: '/images/club-amour.jpg', moment: 'Bal', ambiance: 'dancefloor', spotifyId: '69kOkLUCkxIZYexIgSG8rq' },
  { id: 'sug-6', title: 'Stayin’ Alive', artiste: 'Bee Gees', cover: '/images/club-amour.jpg', moment: 'Bal', ambiance: 'dancefloor', spotifyId: '5ubvP9oKmxLUVq506fgLhk' },
  { id: 'sug-7', title: 'Dancing in the Moonlight', artiste: 'Toploader', cover: '/images/garden.jpg', moment: 'Cocktail', ambiance: 'golden hour', spotifyId: '6u8B9bNWBDfc1hxwcSd8dg' },
  { id: 'sug-8', title: 'Beyond the Sea', artiste: 'Bobby Darin', cover: '/images/desert-motel.jpg', moment: 'Cocktail', ambiance: 'crooner', spotifyId: '3LmPK5QLa2C4zPFZBjEZnY' },
  { id: 'sug-9', title: 'La Vie en rose', artiste: 'Édith Piaf', cover: '/images/couple-paris.jpg', moment: 'Dîner', ambiance: 'français', spotifyId: '1iYVnTkRHB0bCwGZSKPpnL' },
  { id: 'sug-10', title: 'La Javanaise', artiste: 'Serge Gainsbourg', cover: '/images/couple-paris.jpg', moment: 'Dîner', ambiance: 'français', spotifyId: '4pFcv3LFbwXNRKQfAGO8wD' },
  { id: 'sug-11', title: 'Les Champs-Élysées', artiste: 'Joe Dassin', cover: '/images/couple-paris.jpg', moment: 'Bal', ambiance: 'chanson', spotifyId: '7IjZvSV0sPuZ6yIcbUqCVM' },
  { id: 'sug-12', title: 'Bamboléo', artiste: 'Gipsy Kings', cover: '/images/desert-motel.jpg', moment: 'Bal', ambiance: 'tout le monde', spotifyId: '1aP4kfjpT4VsRvSjdUe8jL' },
  { id: 'sug-13', title: 'Sarà perché ti amo', artiste: 'Ricchi e Poveri', cover: '/images/garden.jpg', moment: 'Bal', ambiance: 'tout le monde', spotifyId: '4BgnwxiCbOwC0y1GFIPDDD' },
  { id: 'sug-14', title: '(I’ve Had) The Time of My Life', artiste: 'Bill Medley & Jennifer Warnes', cover: '/images/danse.jpg', moment: 'Bal', ambiance: 'climax', spotifyId: '28kOchCkrm4MYjYQ2JEZi6' },
  { id: 'sug-15', title: 'Last Dance', artiste: 'Donna Summer', cover: '/images/club-amour.jpg', moment: 'Nuit', ambiance: 'closing', spotifyId: '3afQ4z4DkxKEjLDMoEGzWN' },
  { id: 'sug-16', title: 'I Gotta Feeling', artiste: 'The Black Eyed Peas', cover: '/images/club-amour.jpg', moment: 'Nuit', ambiance: 'closing', spotifyId: '4kLLWz7srcuLKA7Et40PQR' },
  { id: 'sug-17', title: 'Hallelujah', artiste: 'Leonard Cohen', cover: '/images/table-noir.jpg', moment: 'Cérémonie', ambiance: 'à l’église', spotifyId: '1LzM3OCPqvmW2u1NrPohV2' },
  { id: 'sug-18', title: 'Ave Maria', artiste: 'Schubert', cover: '/images/hero-wedding.jpg', moment: 'Cérémonie', ambiance: 'à l’église', spotifyId: '1t1bPJqR34KbzhZck5RZT3' },
  { id: 'sug-19', title: 'Fly Me to the Moon', artiste: 'Frank Sinatra', cover: '/images/champagne.jpg', moment: 'Cocktail', ambiance: 'crooner', spotifyId: '5b7OgznPJJr1vHNYGyvxau' },
  { id: 'sug-20', title: 'My Way', artiste: 'Frank Sinatra', cover: '/images/hero-wedding.jpg', moment: 'Nuit', ambiance: 'grand final', spotifyId: '3spdoTYpuCpmq19tuD0bOe' },
];

const parId = new Map<string, Morceau>();
for (const extrait of EXTRAITS) parId.set(extrait.id, extrait);
for (const suggestion of SUGGESTIONS) {
  const doublon = [...parId.values()].some(
    (m) => m.title.toLowerCase() === suggestion.title.toLowerCase(),
  );
  if (!doublon) {
    parId.set(suggestion.id, {
      ...suggestion,
      subtitle: `${suggestion.artiste} · ${suggestion.moment}`,
      src: '',
      suggere: true,
    });
  }
}

/** Tout le catalogue : extraits réels d'abord, suggestions ensuite. */
export const CATALOGUE: Morceau[] = [...parId.values()];

/** Le morceau d'un identifiant, quand on relit une playlist enregistrée. */
export function morceauParId(id: string): Morceau | undefined {
  return parId.get(id);
}

/* ————————————————————————— la recherche ————————————————————————— */

function normalise(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ');
}

/**
 * Cherche dans le titre, l'artiste, le moment et l'humeur. Une requête vide
 * montre d'abord les extraits — ce qui s'écoute tout de suite.
 */
export function chercherMorceaux(requete: string, limite = 24): Morceau[] {
  const q = normalise(requete).trim();
  if (q.length === 0) {
    return [...CATALOGUE].sort((a, b) => Number(Boolean(a.suggere)) - Number(Boolean(b.suggere))).slice(0, limite);
  }
  const mots = q.split(/\s+/).filter(Boolean);
  return CATALOGUE.filter((m) => {
    const champs = normalise(`${m.title} ${m.artiste} ${m.moment} ${m.ambiance}`);
    return mots.every((mot) => champs.includes(mot));
  }).slice(0, limite);
}

/* ————————————————————————— la playlist ————————————————————————— */

/** Ce qu'on trouve en arrivant : les trois morceaux qui ouvrent la soirée. */
export const PLAYLIST_DEPART: string[] = ['track-c1', 'track-ck1', 'track-d1'];

const CLE = 'vows:playlist';

/** Chaque univers garde sa playlist : on passe de l'un à l'autre sans la mélanger. */
const cleDe = (styleId: string): string => (styleId ? `${CLE}:${styleId}` : CLE);

export function chargerPlaylist(styleId = ''): string[] {
  try {
    const brut = localStorage.getItem(cleDe(styleId)) ?? localStorage.getItem(CLE);
    if (!brut) return PLAYLIST_DEPART;
    const ids = JSON.parse(brut) as unknown;
    if (!Array.isArray(ids)) return PLAYLIST_DEPART;
    return ids.filter((id): id is string => typeof id === 'string' && parId.has(id));
  } catch {
    return PLAYLIST_DEPART;
  }
}

export function enregistrerPlaylist(ids: string[], styleId = ''): void {
  try {
    localStorage.setItem(cleDe(styleId), JSON.stringify(ids));
  } catch {
    // stockage indisponible : la playlist vit le temps de la visite
  }
}

/** Les morceaux d'une playlist, dans l'ordre choisi. */
export function morceauxDeLaPlaylist(ids: string[]): Morceau[] {
  return ids.map((id) => parId.get(id)).filter((m): m is Morceau => Boolean(m));
}

/** Ce que la playlist contient, par moment — l'entête de la section. */
export function repartitionParMoment(morceaux: Morceau[]): Array<{ moment: string; nombre: number }> {
  const compte = new Map<string, number>();
  for (const m of morceaux) compte.set(m.moment, (compte.get(m.moment) ?? 0) + 1);
  return [...compte.entries()]
    .map(([moment, nombre]) => ({ moment, nombre }))
    .sort((a, b) => b.nombre - a.nombre);
}
