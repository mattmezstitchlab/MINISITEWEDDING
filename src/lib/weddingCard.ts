import { BLANK_STYLE_ID } from './weddingStyles';
import { roleToScreen, roleTitle } from './spaceDraft';

/**
 * LA CARTE VOWS — recto / verso
 *
 * Une carte par personne, et une seule source de vérité : la personne, son
 * rôle dans le mariage, ses coordonnées, ses disponibilités, son repas, sa
 * mobilité — et, si elle est prestataire, ses prestations et ses documents.
 *
 * Le **recto** montre qui l'on est : la photo, le nom, le rôle, la ville, le
 * métier, l'univers musical et le mariage. Le **verso** porte le détail, et il
 * n'affiche que ce qui concerne le rôle tenu (`cardSections`) : un invité n'a
 * rien à faire d'un tarif, un photographe n'a rien à faire d'un régime
 * alimentaire. C'est la règle du « seulement les champs pertinents », appliquée
 * ici une fois pour toutes.
 *
 * La carte reste locale tant que les comptes n'existent pas : elle vit dans le
 * stockage du navigateur, et elle est prête à devenir la table `people` du
 * réseau (voir `docs/noyau-reseau.md`).
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

/* ------------------------------------------------------- verso · les listes */

export type ContactVisibility = 'maries' | 'participants' | 'carte';

export interface ContactVisibilityDef {
  id: ContactVisibility;
  label: string;
  hint: string;
}

/** Qui voit mes coordonnées. Le défaut est « les participants », jamais public. */
export const CONTACT_VISIBILITY: ContactVisibilityDef[] = [
  { id: 'maries', label: 'Les mariés', hint: 'Vos coordonnées ne quittent pas le couple.' },
  { id: 'participants', label: 'Les participants', hint: 'Famille, amis, témoins et prestataires du mariage.' },
  { id: 'carte', label: 'Sur ma carte', hint: 'Quiconque voit ma carte peut me joindre.' },
];

export const DIETS: string[] = [
  'Végétarien',
  'Végétalien',
  'Sans gluten',
  'Sans lactose',
  'Halal',
  'Casher',
  'Sans porc',
  'Sans alcool',
];

export const ALLERGENS: string[] = [
  'Gluten',
  'Arachides',
  'Fruits à coque',
  'Lait',
  'Œufs',
  'Soja',
  'Poisson',
  'Crustacés',
  'Sésame',
];

/** Les pièces qu'un prestataire a intérêt à tenir prêtes. */
export const DEFAULT_DOCUMENTS: string[] = [
  'Devis',
  'Contrat signé',
  'Facture',
  'Attestation d’assurance',
  'Conditions générales',
];

export interface CardDocument {
  id: string;
  label: string;
  done: boolean;
}

/* ------------------------------------------------------------ la carte */

export interface CardData {
  /* — la personne — */
  firstName: string;
  lastName: string;
  photo: string;
  homeCity: string;
  trade: string;
  bio: string;
  /** Un identifiant de `FULL_ROLES_TAXONOMY` ('' tant qu'aucun rôle n'est choisi). */
  roleId: string;
  access: CardAccess;

  /* — le mariage — */
  partner1: string;
  partner2: string;
  date: string;
  venue: string;
  /** La ville du mariage. */
  city: string;
  styleId: string;
  events: string[];
  music: string;

  /* — verso · coordonnées — */
  email: string;
  phone: string;
  website: string;
  social: string;
  contactVisibility: ContactVisibility;

  /* — verso · disponibilité — */
  from: string;
  to: string;
  travel: string;
  blackout: string;

  /* — verso · repas — */
  diet: string[];
  allergens: string[];

  /* — verso · mobilité — */
  vehicle: string;
  seats: string;
  needsRide: boolean;

  /* — verso · prestations — */
  service: string;
  rate: string;
  area: string;
  minimum: string;

  /* — verso · documents — */
  documents: CardDocument[];
  iban: string;
}

/** L'ancien nom, gardé pour ne rien casser. */
export type WeddingCard = CardData;

export const EMPTY_CARD: CardData = {
  firstName: '',
  lastName: '',
  photo: '',
  homeCity: '',
  trade: '',
  bio: '',
  roleId: '',
  access: 'couple',

  partner1: '',
  partner2: '',
  date: '',
  venue: '',
  city: '',
  styleId: BLANK_STYLE_ID,
  events: DAY_EVENTS.map((e) => e.id),
  music: MUSIC_MOODS[0].id,

  email: '',
  phone: '',
  website: '',
  social: '',
  contactVisibility: 'participants',

  from: '',
  to: '',
  travel: '',
  blackout: '',

  diet: [],
  allergens: [],

  vehicle: '',
  seats: '',
  needsRide: false,

  service: '',
  rate: '',
  area: '',
  minimum: '',

  documents: DEFAULT_DOCUMENTS.map((label, i) => ({ id: `piece-${i}`, label, done: false })),
  iban: '',
};

const CLE = 'vows:carte';

/** La carte composée par son propriétaire, relue au retour sur le site. */
export function saveCard(card: CardData): void {
  try {
    window.localStorage.setItem(CLE, JSON.stringify(card));
  } catch {
    /* mode privé : la carte reste en mémoire */
  }
}

export function readCard(): CardData | null {
  try {
    const brut = window.localStorage.getItem(CLE);
    if (!brut) return null;
    const carte = JSON.parse(brut) as Partial<CardData>;
    return {
      ...EMPTY_CARD,
      ...carte,
      events: carte.events ?? EMPTY_CARD.events,
      diet: carte.diet ?? [],
      allergens: carte.allergens ?? [],
      documents: carte.documents ?? EMPTY_CARD.documents,
    };
  } catch {
    return null;
  }
}

/** La carte d'une session précédente, ou une carte vierge. */
export function savedOrEmpty(): CardData {
  return readCard() ?? EMPTY_CARD;
}

/* --------------------------------------------------------- ce qu'elle dit */

export type CardKind = 'couple' | 'invite' | 'prestataire';

/** Ce que la carte est : celle des mariés, d'un invité, ou d'un prestataire. */
export function cardKind(card: Pick<CardData, 'roleId' | 'access'>): CardKind {
  if (card.roleId) {
    const ecran = roleToScreen(card.roleId);
    return ecran === 'maries' ? 'couple' : ecran;
  }
  if (card.access === 'couple') return 'couple';
  return card.access === 'prestataire' ? 'prestataire' : 'invite';
}

/**
 * L'accès que donne un rôle de la taxonomie. Écrit une fois ici : l'écran de
 * la carte et la collection des personnes doivent répondre pareil.
 */
export function accessForRole(roleId: string): CardAccess {
  if (!roleId) return 'couple';
  const ecran = roleToScreen(roleId);
  if (ecran === 'maries') return 'couple';
  if (ecran === 'prestataire') return 'prestataire';
  return roleId === 'temoin' ? 'famille' : 'amis';
}

export type CardSectionId =
  | 'place'
  | 'contact'
  | 'dispo'
  | 'repas'
  | 'mobilite'
  | 'prestations'
  | 'documents'
  | 'musique';

export interface CardSectionDef {
  id: CardSectionId;
  label: string;
}

const SECTIONS: Record<CardSectionId, CardSectionDef> = {
  place: { id: 'place', label: 'Ma place dans le mariage' },
  contact: { id: 'contact', label: 'Mes coordonnées' },
  dispo: { id: 'dispo', label: 'Ma disponibilité' },
  repas: { id: 'repas', label: 'Le repas' },
  mobilite: { id: 'mobilite', label: 'Ma mobilité' },
  prestations: { id: 'prestations', label: 'Mes prestations' },
  documents: { id: 'documents', label: 'Mes documents' },
  musique: { id: 'musique', label: 'Ma musique' },
};

/**
 * Le verso, dans l'ordre, **selon le rôle** : c'est la seule règle qui empêche
 * la carte de devenir un formulaire universel que personne ne remplit.
 */
export function cardSections(card: Pick<CardData, 'roleId' | 'access'>): CardSectionDef[] {
  const kind = cardKind(card);
  const ids: CardSectionId[] =
    kind === 'prestataire'
      ? ['place', 'prestations', 'dispo', 'contact', 'documents', 'musique']
      : kind === 'couple'
        ? ['place', 'contact', 'dispo', 'repas', 'mobilite', 'documents', 'musique']
        : ['place', 'contact', 'dispo', 'repas', 'mobilite', 'musique'];
  return ids.map((id) => SECTIONS[id]);
}

export function sectionLabel(id: CardSectionId): string {
  return SECTIONS[id].label;
}

/** Le nom affiché : « Clara Mez », ou les initiales tant qu'il n'y a rien. */
export function cardName(card: CardData): string {
  return [card.firstName, card.lastName].map((s) => s.trim()).filter(Boolean).join(' ');
}

export function initials(card: CardData): string {
  const a = card.firstName.trim().charAt(0);
  const b = card.lastName.trim().charAt(0);
  return (a + b).toUpperCase() || '·';
}

/** Le rôle précis, s'il est choisi ; sinon le rôle de l'accès. */
export function cardRoleLabel(card: Pick<CardData, 'roleId' | 'access'>): string {
  return (card.roleId ? roleTitle(card.roleId) : null) ?? accessRole(card.access);
}

export function cardKindLabel(card: Pick<CardData, 'roleId' | 'access'>): string {
  const kind = cardKind(card);
  if (kind === 'couple') return 'Les mariés';
  if (kind === 'prestataire') return 'Prestataire';
  return 'Invité·e';
}

/** Un IBAN ne s'affiche jamais en clair : début, fin, et rien au milieu. */
export function maskIban(iban: string): string {
  const clean = iban.replace(/\s+/g, '').toUpperCase();
  if (clean.length < 8) return '•••• ••••';
  return `${clean.slice(0, 4)} •••• •••• ${clean.slice(-4)}`;
}

/** L'avancement de la carte : ce qui reste à remplir, sans culpabiliser. */
export function cardCompletion(card: CardData): number {
  const kind = cardKind(card);
  const champs: Array<string | boolean> = [
    card.firstName,
    card.photo,
    card.homeCity,
    card.trade,
    card.bio,
    card.email || card.phone,
    card.from && card.to,
    card.music,
    card.date,
    card.venue,
  ];
  if (kind === 'prestataire') champs.push(card.service, card.rate, card.area);
  else {
    champs.push(card.diet.length > 0 || card.allergens.length > 0);
    champs.push(card.vehicle || card.needsRide);
  }
  const remplis = champs.filter((c) => (typeof c === 'string' ? c.trim().length > 0 : c)).length;
  return Math.round((remplis / champs.length) * 100);
}

/** De quoi se présenter en un message, pour un partage honnête (pas de faux lien). */
export function cardSummary(card: CardData): string {
  const lignes: string[] = [];
  const nom = cardName(card);
  if (nom) lignes.push(`${nom} — ${cardRoleLabel(card)}`);
  else lignes.push(`Ma carte — ${cardRoleLabel(card)}`);
  const lieu = [card.homeCity, card.trade].filter((s) => s.trim()).join(' · ');
  if (lieu) lignes.push(lieu);
  if (card.from && card.to) lignes.push(`Disponible de ${card.from} à ${card.to}`);
  const mariage = [card.partner1, card.partner2].filter((s) => s.trim()).join(' & ');
  if (mariage) lignes.push(`${mariage}${card.date ? ` — ${card.date}` : ''}`);
  return lignes.join('\n');
}

/* --------------------------------------------------- le verso, côté serveur */

/**
 * Le détail du verso, tel qu'il voyage vers `people.card`.
 *
 * Ce qui distingue une personne — sa disponibilité, son repas, sa mobilité,
 * ses prestations, ses pièces — n'a pas à occuper une colonne par champ dans
 * la base : ça ne se filtre pas, ça appartient à la carte. Le reste (identité,
 * coordonnées, ville, métier) est bien en colonnes : c'est ce sur quoi on
 * cherche et on filtre.
 *
 * Les deux fonctions ci-dessous font le pont dans les deux sens, et **aucune
 * autre** : une information saisie une fois ne se recopie pas ailleurs.
 */
export interface CardDetail {
  from: string;
  to: string;
  travel: string;
  blackout: string;
  diet: string[];
  allergens: string[];
  vehicle: string;
  seats: string;
  needsRide: boolean;
  service: string;
  rate: string;
  area: string;
  minimum: string;
  documents: CardDocument[];
  iban: string;
}

export function cardDetail(card: CardData): CardDetail {
  return {
    from: card.from,
    to: card.to,
    travel: card.travel,
    blackout: card.blackout,
    diet: card.diet,
    allergens: card.allergens,
    vehicle: card.vehicle,
    seats: card.seats,
    needsRide: card.needsRide,
    service: card.service,
    rate: card.rate,
    area: card.area,
    minimum: card.minimum,
    documents: card.documents,
    iban: card.iban,
  };
}

/** Reconstruit une carte locale à partir du verso reçu du serveur. */
export function withDetail(card: CardData, detail: Partial<CardDetail> | null | undefined): CardData {
  if (!detail || typeof detail !== 'object') return card;
  return {
    ...card,
    from: typeof detail.from === 'string' ? detail.from : card.from,
    to: typeof detail.to === 'string' ? detail.to : card.to,
    travel: typeof detail.travel === 'string' ? detail.travel : card.travel,
    blackout: typeof detail.blackout === 'string' ? detail.blackout : card.blackout,
    diet: Array.isArray(detail.diet) ? detail.diet : card.diet,
    allergens: Array.isArray(detail.allergens) ? detail.allergens : card.allergens,
    vehicle: typeof detail.vehicle === 'string' ? detail.vehicle : card.vehicle,
    seats: typeof detail.seats === 'string' ? detail.seats : card.seats,
    needsRide: typeof detail.needsRide === 'boolean' ? detail.needsRide : card.needsRide,
    service: typeof detail.service === 'string' ? detail.service : card.service,
    rate: typeof detail.rate === 'string' ? detail.rate : card.rate,
    area: typeof detail.area === 'string' ? detail.area : card.area,
    minimum: typeof detail.minimum === 'string' ? detail.minimum : card.minimum,
    documents: Array.isArray(detail.documents) ? detail.documents : card.documents,
    iban: typeof detail.iban === 'string' ? detail.iban : card.iban,
  };
}

/* ------------------------------------------------------- les mêmes qu'avant */

export function accessLabel(access: CardAccess): string {
  return CARD_ACCESS.find((a) => a.id === access)?.label ?? CARD_ACCESS[0].label;
}

export function accessHint(access: CardAccess): string {
  return CARD_ACCESS.find((a) => a.id === access)?.hint ?? CARD_ACCESS[0].hint;
}

export function accessRole(access: CardAccess): string {
  return CARD_ACCESS.find((a) => a.id === access)?.role ?? CARD_ACCESS[0].role;
}

export function musicLabel(music: string): string {
  return MUSIC_MOODS.find((m) => m.id === music)?.label ?? MUSIC_MOODS[0].label;
}

export function visibilityLabel(id: ContactVisibility): string {
  return CONTACT_VISIBILITY.find((v) => v.id === id)?.label ?? CONTACT_VISIBILITY[1].label;
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
