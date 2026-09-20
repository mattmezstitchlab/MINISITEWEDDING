import { apiGet, apiSend } from './http';
import { forgetPersonToken, getPersonToken, savePersonToken } from './auth';
import type { WeddingSite } from './types';
import { cardDetail, withDetail, type CardData, type CardDetail } from './weddingCard';
import type { Person, WeddingMember } from './types';

/**
 * LE RÉSEAU VU DU NAVIGATEUR
 *
 * Une seule porte vers `/api/people` et `/api/wedding-members`, que le
 * stockage soit distant ou celui du navigateur : `http.ts` aiguille, ici on ne
 * parle que de cartes et de places.
 *
 * La clé personnelle est ce qui identifie la carte : créée une seule fois,
 * gardée dans le navigateur, saisissable à la main pour retrouver sa carte
 * ailleurs.
 */

/** Ce qu'une carte envoie au réseau : identité en colonnes, verso en détail. */
export function cardToPerson(card: CardData): Record<string, unknown> {
  return {
    first_name: card.firstName.trim(),
    last_name: card.lastName.trim(),
    photo: card.photo,
    home_city: card.homeCity.trim(),
    trade: card.trade.trim(),
    bio: card.bio.trim(),
    email: card.email.trim(),
    phone: card.phone.trim(),
    website: card.website.trim(),
    social: card.social.trim(),
    contact_visibility: card.contactVisibility,
    card: cardDetail(card),
  };
}

/** Et l'inverse : la carte locale retrouve ce que le réseau a gardé. */
export function personToCard(person: Person, base: CardData): CardData {
  return withDetail(
    {
      ...base,
      firstName: person.first_name ?? '',
      lastName: person.last_name ?? '',
      photo: person.photo ?? '',
      homeCity: person.home_city ?? '',
      trade: person.trade ?? '',
      bio: person.bio ?? '',
      email: person.email ?? '',
      phone: person.phone ?? '',
      website: person.website ?? '',
      social: person.social ?? '',
      contactVisibility:
        person.contact_visibility === 'maries' || person.contact_visibility === 'carte'
          ? person.contact_visibility
          : 'participants',
    },
    (person.card ?? {}) as Partial<CardDetail>,
  );
}

export function hasPersonKey(): boolean {
  return Boolean(getPersonToken());
}

export function personKey(): string | null {
  return getPersonToken();
}

/** Reprendre sa carte ailleurs : on saisit sa clé, on la garde ici. */
export function adoptPersonKey(key: string): void {
  savePersonToken(key.trim());
}

/** Oublier sa clé : la carte reste en ligne, mais on ne l'édite plus d'ici. */
export function forgetKey(): void {
  forgetPersonToken();
}

/** Créer sa carte. La clé n'est renvoyée qu'ici, une seule fois. */
export async function createCard(card: CardData): Promise<{ person: Person; key: string }> {
  const res = await apiSend<{ person: Person; person_token: string }>('/api/people', 'POST', cardToPerson(card));
  savePersonToken(res.person_token);
  return { person: res.person, key: res.person_token };
}

/** Mettre à jour sa carte. Sans clé, le serveur refuse — et c'est tant mieux. */
export async function updateCard(card: CardData): Promise<Person> {
  const res = await apiSend<{ person: Person }>('/api/people', 'PUT', cardToPerson(card));
  return res.person;
}

/** Ma carte, telle qu'elle est en ligne. `null` s'il n'y a pas de clé. */
export async function loadMyCard(): Promise<Person | null> {
  if (!getPersonToken()) return null;
  const res = await apiGet<{ person: Person }>('/api/people');
  return res.person;
}

export interface WeddingRef {
  slug?: string;
  site_id?: number;
}

function refQuery(ref: WeddingRef): string {
  if (ref.site_id) return `site_id=${ref.site_id}`;
  if (ref.slug) return `slug=${encodeURIComponent(ref.slug)}`;
  return '';
}

/** Les cartes d'un mariage, filtrées par le serveur selon qui regarde. */
export async function listWeddingPeople(ref: WeddingRef): Promise<Person[]> {
  const res = await apiGet<{ people: Person[] }>(`/api/people?${refQuery(ref)}`);
  return res.people;
}

/** Les membres : la carte **et** la place tenue dans ce mariage. */
export async function listWeddingMembers(ref: WeddingRef): Promise<WeddingMember[]> {
  const res = await apiGet<{ members: WeddingMember[] }>(`/api/wedding-members?${refQuery(ref)}`);
  return res.members;
}

export async function joinWedding(ref: WeddingRef, roleId: string): Promise<WeddingMember> {
  const res = await apiSend<{ member: WeddingMember }>('/api/wedding-members', 'POST', {
    ...ref,
    role_id: roleId,
  });
  return res.member;
}

/** Mes mariages : la place tenue, et le mariage lui-même. */
export interface Membership {
  member: WeddingMember;
  site: Pick<WeddingSite, 'id' | 'slug' | 'partner1' | 'partner2' | 'wedding_date' | 'city' | 'venue' | 'style'> | null;
}

export async function listMyMemberships(): Promise<Membership[]> {
  const res = await apiGet<{ memberships: Membership[] }>('/api/wedding-members');
  return res.memberships;
}

export async function leaveWedding(memberId: number): Promise<void> {
  await apiSend<{ deleted: boolean }>(`/api/wedding-members?id=${memberId}`, 'DELETE');
}
