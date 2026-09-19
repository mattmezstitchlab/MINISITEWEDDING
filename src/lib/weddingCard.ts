import { WEDDING_STYLES } from './weddingStyles';

/**
 * LA CARTE VOWS
 *
 * Ce que l'onboarding compose, et ce que chacun reçoit : un accès, un rôle, une
 * disponibilité, l'accès aux événements de la journée et une empreinte
 * musicale. La carte résume tout, et c'est elle qu'on montre pendant les
 * questions — « votre carte, votre univers ».
 */

export type CardAccess = 'couple' | 'famille' | 'amis' | 'prestataire';

export interface CardAccessDef {
  id: CardAccess;
  /** Le libellé de la carte : « Accès Couple ». */
  label: string;
  /** Le rôle affiché dessous : « Organisateurs ». */
  role: string;
  hint: string;
}

export const CARD_ACCESS: CardAccessDef[] = [
  { id: 'couple', label: 'Accès Couple', role: 'Organisateurs', hint: 'Vous décidez de tout, et vous voyez tout.' },
  { id: 'famille', label: 'Accès Famille', role: 'Proches & témoins', hint: 'Le programme, les lieux, la cagnotte, les photos.' },
  { id: 'amis', label: 'Accès Amis', role: 'Invités', hint: 'L’invitation, le RSVP, le régime alimentaire, la playlist.' },
  { id: 'prestataire', label: 'Accès Prestataire', role: 'Métiers missionnés', hint: 'La fiche mission, l’accès au site, les créneaux.' },
];

export interface DayEventDef {
  id: string;
  label: string;
  time: string;
  detail: string;
}

/** Les quatre temps de la journée, tels qu'ils sont proposés dans la carte. */
export const DAY_EVENTS: DayEventDef[] = [
  { id: 'ceremonie', label: 'Cérémonie', time: '15:00', detail: 'Les vœux, les alliances, la sortie au milieu des invités.' },
  { id: 'cocktail', label: 'Cocktail', time: '17:30', detail: 'Champagne, discours courts, portraits de famille.' },
  { id: 'diner', label: 'Dîner', time: '20:00', detail: 'Le repas, les tables, les régimes pris en compte.' },
  { id: 'soiree', label: 'Soirée', time: '23:00', detail: 'Le bal, les vinyles, la piste qui ne désemplit pas.' },
];

export interface MusicMoodDef {
  id: string;
  label: string;
  hint: string;
}

export const MUSIC_MOODS: MusicMoodDef[] = [
  { id: 'disco', label: 'Disco & funk', hint: 'Cuivres, groove, piste pleine dès le premier morceau.' },
  { id: 'jazz', label: 'Jazz & crooner', hint: 'Contrebasse, voix feutrée, cocktail qui s’étire.' },
  { id: 'pop', label: 'Pop & tubes', hint: 'Les refrains que tout le monde reprend.' },
  { id: 'electro', label: 'Électro & club', hint: 'Basses longues, lumières, fin très tard.' },
  { id: 'monde', label: 'Musiques du monde', hint: 'Maloya, séga, percussions, danses en cercle.' },
  { id: 'classique', label: 'Classique & cérémonie', hint: 'Cordes, piano, silence tenu pendant les vœux.' },
];

/** Ce que l'onboarding garde en mémoire : la carte elle-même. */
export interface WeddingCard {
  access: CardAccess;
  partner1: string;
  partner2: string;
  date: string;
  venue: string;
  city: string;
  styleId: string;
  events: string[];
  music: string;
}

export const EMPTY_CARD: WeddingCard = {
  access: 'couple',
  partner1: '',
  partner2: '',
  date: '',
  venue: '',
  city: '',
  styleId: WEDDING_STYLES[0].id,
  events: DAY_EVENTS.map((e) => e.id),
  music: MUSIC_MOODS[0].id,
};

const CLE = 'vows:carte';

/** La carte composée dans l'onboarding, relue au retour sur le site. */
export function saveCard(card: WeddingCard): void {
  try {
    window.localStorage.setItem(CLE, JSON.stringify(card));
  } catch {
    /* mode privé : la carte reste en mémoire */
  }
}

export function readCard(): WeddingCard | null {
  try {
    const brut = window.localStorage.getItem(CLE);
    if (!brut) return null;
    const carte = JSON.parse(brut) as Partial<WeddingCard>;
    return { ...EMPTY_CARD, ...carte, events: carte.events ?? EMPTY_CARD.events };
  } catch {
    return null;
  }
}

export function accessLabel(access: CardAccess): string {
  return CARD_ACCESS.find((a) => a.id === access)?.label ?? CARD_ACCESS[0].label;
}

export function accessHint(access: CardAccess): string {
  return CARD_ACCESS.find((a) => a.id === access)?.hint ?? CARD_ACCESS[0].hint;
}

/** La carte d'une session précédente, ou une carte vierge. */
export function savedOrEmpty(): WeddingCard {
  return readCard() ?? EMPTY_CARD;
}

export function accessRole(access: CardAccess): string {
  return CARD_ACCESS.find((a) => a.id === access)?.role ?? CARD_ACCESS[0].role;
}

export function musicLabel(music: string): string {
  return MUSIC_MOODS.find((m) => m.id === music)?.label ?? MUSIC_MOODS[0].label;
}

/** Les temps retenus, dans l'ordre de la journée. */
export function keptEvents(events: string[]): DayEventDef[] {
  return DAY_EVENTS.filter((e) => events.includes(e.id));
}

/**
 * Les scènes du programme qui correspondent aux temps retenus. Chaque temps de
 * la journée est reconnu à ses mots — « cérémonie », « cocktail », « dîner »,
 * « bal » — puis on ne garde que les scènes correspondantes, dans l'ordre de la
 * journée. Si rien ne correspond, le programme reste complet.
 */
const MOTS_PAR_TEMPS: Record<string, string[]> = {
  ceremonie: ['cérémonie', 'ceremonie', 'vœux', 'voeux', 'alliances', 'messe', 'entrée', 'entree'],
  cocktail: ['cocktail', 'apéritif', 'aperitif', 'champagne', 'toast'],
  diner: ['dîner', 'diner', 'repas', 'menu', 'table', 'banquet', 'service'],
  soiree: ['bal', 'danse', 'soirée', 'soiree', 'fête', 'fete', 'piste', 'nuit', 'sound', 'dj'],
};

export function keepScenesForEvents<T extends { time: string; title: string; narrativeScript?: string }>(
  scenes: T[],
  events: string[],
): T[] {
  if (events.length === 0 || events.length === DAY_EVENTS.length) return scenes;

  const retenues = new Set<T>();
  for (const id of events) {
    const mots = MOTS_PAR_TEMPS[id] ?? [];
    const trouvee = scenes.find((scene) => {
      const texte = `${scene.title} ${scene.narrativeScript ?? ''}`.toLowerCase();
      return mots.some((mot) => texte.includes(mot));
    });
    if (trouvee) retenues.add(trouvee);
  }

  const gardees = scenes.filter((scene) => retenues.has(scene));
  return gardees.length > 0 ? gardees : scenes;
}
