import type { MediaAsset, PublicSiteData, WeddingSite, SiteSection, ProgrammeEvent, InfoPratique, GalleryPhoto, Faq, RsvpEvent, GiftOption } from './types';
import {
  SECTION_DEFAULTS, PROGRAMME_DEFAULTS, FAQ_DEFAULTS, RSVP_EVENT_DEFAULTS,
  GIFT_DEFAULTS, GENERIC_INFO_DEFAULTS, storyText,
} from './defaults';

/**
 * Jeu de démonstration.
 *
 * L’API (fonctions serverless + Supabase) n’est pas joignable en local :
 * en développement uniquement, ces données prennent le relais pour que
 * l’aperçu reste explorable. En production, rien ne change : l’API prime
 * et une erreur remonte normalement.
 *
 * Le contenu est composé depuis `defaults.ts` — la même source que celle
 * qui amorce un vrai site — pour qu’un nouveau mariage et la démo ne
 * puissent pas diverger.
 */
export const DEMO_ENABLED = import.meta.env.DEV;

const SITE_ID = 1;

const VENUE = 'Château de Chantilly';
const ADDRESS = '7 rue du Connétable, Chantilly';

/** Le mariage fictif qui sert d’exemple : lieux réels, programme détaillé. */
const DEMO_PLACES = [
  { place: 'Orangerie du château', description: 'Échange des vœux et des alliances, dans l’orangerie.' },
  { place: 'Jardins à la française', description: 'Coupe de champagne et photos de groupe dans les jardins.' },
  { place: 'Grande nef' },
  { place: 'Grande nef' },
  { place: 'Orangerie' },
];

export const DEMO_MEDIA: MediaAsset[] = [
  { id: 1, category: 'Couple', title: 'Couple à Paris', url: '/images/couple-paris.jpg', collection: 'Editorial Paris', kind: 'photo', orientation: 'portrait' },
  { id: 2, category: 'Alliances', title: 'Les alliances', url: '/images/alliances.jpg', collection: 'Editorial Paris', kind: 'photo', orientation: 'carre' },
  { id: 3, category: 'Bouquet', title: 'Bouquet pivoines', url: '/images/bouquet.jpg', collection: 'Garden Wedding', kind: 'photo', orientation: 'portrait' },
  { id: 4, category: 'Château', title: 'Château de Chantilly', url: '/images/chateau.jpg', collection: 'Château', kind: 'photo', orientation: 'paysage' },
  { id: 5, category: 'Table', title: 'Table black tie', url: '/images/table-noir.jpg', collection: 'Black Tie', kind: 'photo', orientation: 'paysage' },
  { id: 6, category: 'Danse', title: 'Première danse', url: '/images/danse.jpg', collection: 'Modern Romance', kind: 'photo', orientation: 'paysage' },
  { id: 7, category: 'Nature', title: 'Jardin anglais', url: '/images/garden.jpg', collection: 'Garden Wedding', kind: 'photo', orientation: 'paysage' },
  { id: 8, category: 'Décoration', title: 'Terrasse au soleil', url: '/images/terrasse.jpg', collection: "Côte d'Azur", kind: 'photo', orientation: 'paysage' },
  { id: 9, category: 'Champagne', title: 'Coupe de champagne', url: '/images/champagne.jpg', collection: 'Black Tie', kind: 'photo', orientation: 'portrait' },
  { id: 10, category: 'Textures', title: 'Noir & blanc', url: '/images/noir-blanc.jpg', collection: 'Editorial Paris', kind: 'photo', orientation: 'carre' },
  { id: 11, category: 'Cérémonie', title: 'Hero — mariage', url: '/images/hero-wedding.jpg', collection: 'Château', kind: 'photo', orientation: 'paysage' },
];

const site: WeddingSite = {
  id: SITE_ID,
  slug: 'matt-marie',
  partner1: 'Matt',
  partner2: 'Marie',
  wedding_date: '2027-07-18',
  venue: VENUE,
  city: 'Chantilly, Oise',
  style: 'editorial',
  phase: 'avant',
  typography: 'spatial',
  accent_color: '#16171A',
  button_style: 'pill',
  shape: 'soft',
  layout: 'magazine',
  animation_level: 'fluide',
  hero_photo: '/images/hero-wedding.jpg',
  hero_title: 'Matt & Marie',
  hero_subtitle: 'Nous nous marions',
  story_title: 'Tout a commencé par un regard',
  story_text: storyText('Matt', 'Marie'),
  story_photo: '/images/couple-paris.jpg',
  announcement: 'Nous avons hâte de vous retrouver.',
  contact_email: 'matt.et.marie@byaime.fr',
  contact_phone: '+33 6 12 34 56 78',
  published: true,
};

const sections: SiteSection[] = SECTION_DEFAULTS.map((s, i) => ({
  id: i + 1, site_id: SITE_ID, section_key: s.key, title: s.title, visible: true, position: i,
}));

const programme: ProgrammeEvent[] = PROGRAMME_DEFAULTS.map((p, i) => ({
  id: i + 1,
  site_id: SITE_ID,
  event_time: p.time,
  title: p.title,
  description: DEMO_PLACES[i].description ?? p.description,
  place: DEMO_PLACES[i].place,
  icon: 'clock',
  position: i,
}));

const infos: InfoPratique[] = [
  { category: 'Cérémonie', title: VENUE, detail: `Orangerie — ${ADDRESS}`, event_time: '14:30', link_label: 'Voir l’itinéraire' },
  { category: 'Réception', title: VENUE, detail: `Grande nef — ${ADDRESS}`, event_time: '18:30', link_label: 'Voir l’itinéraire' },
  ...GENERIC_INFO_DEFAULTS,
].map((row, i) => ({ id: i + 1, site_id: SITE_ID, position: i, ...row }));

const gallery: GalleryPhoto[] = [
  { url: '/images/hero-wedding.jpg', caption: 'Nous deux' },
  { url: '/images/couple-paris.jpg', caption: 'Paris, toujours' },
  { url: '/images/alliances.jpg', caption: 'Les alliances' },
  { url: '/images/bouquet.jpg', caption: 'Le bouquet' },
  { url: '/images/chateau.jpg', caption: 'Le château' },
  { url: '/images/champagne.jpg', caption: 'À la vie' },
  { url: '/images/garden.jpg', caption: 'Les jardins' },
  { url: '/images/danse.jpg', caption: 'Première danse' },
].map((row, i) => ({ id: i + 1, site_id: SITE_ID, position: i, is_private: false, ...row }));

const faqs: Faq[] = FAQ_DEFAULTS.map((f, i) => ({ id: i + 1, site_id: SITE_ID, position: i, ...f }));

const rsvpEvents: RsvpEvent[] = RSVP_EVENT_DEFAULTS.map((e, i) => ({ id: i + 1, site_id: SITE_ID, position: i, ...e }));

/** La démo affiche une cagnotte déjà amorcée, pour montrer la barre de progression. */
const gifts: GiftOption[] = GIFT_DEFAULTS.map((g, i) => ({
  id: i + 1, site_id: SITE_ID, position: i, current_amount: i === 0 ? 1840 : 0, ...g,
}));

export const DEMO_DATA: PublicSiteData = { site, sections, programme, infos, gallery, faqs, rsvpEvents, gifts };
