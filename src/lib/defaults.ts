import { apiSend } from './http';
import { saveEditToken, setActiveToken } from './auth';
import { slugify } from './format';
import { styleById } from './weddingStyles';
import type { WeddingSite } from './types';

/**
 * Contenu par défaut d’un site de mariage.
 *
 * Source unique : ces constantes servent à la fois à l’amorçage d’un nouveau
 * site (onboarding) et au jeu de démonstration (`demo.ts`). Auparavant les
 * deux étaient recopiés à la main — les FAQ, horaires et événements étaient
 * dupliqués mot pour mot, avec déjà quelques écarts.
 */

export const SECTION_DEFAULTS = [
  { key: 'hero', title: 'Accueil' },
  { key: 'histoire', title: 'Notre histoire' },
  { key: 'programme', title: 'Programme' },
  { key: 'lieux', title: 'Lieux' },
  { key: 'infos', title: 'Infos pratiques' },
  { key: 'rsvp', title: 'RSVP' },
  { key: 'cagnotte', title: 'Cagnotte' },
  { key: 'galerie', title: 'Galerie' },
  { key: 'faq', title: 'FAQ' },
  { key: 'contact', title: 'Contact' },
  { key: 'footer', title: 'Pied de page' },
];

/** Déroulé type. Les lieux restent vides : l’amorçage les remplit avec le lieu saisi. */
export const PROGRAMME_DEFAULTS = [
  { time: '14:30', title: 'Cérémonie', description: 'Échange des vœux et des alliances.', place: '' },
  { time: '16:00', title: 'Cocktail', description: 'Coupe de champagne et photos de groupe.', place: '' },
  { time: '18:30', title: 'Dîner', description: 'Dîner assis, discours et surprises.', place: '' },
  { time: '21:00', title: 'Ouverture du bal', description: 'La première danse, puis à vous.', place: '' },
  { time: '23:30', title: 'Soirée', description: 'Dansez jusqu’au bout de la nuit.', place: '' },
];

export const FAQ_DEFAULTS = [
  { question: 'Comment venir ?', answer: 'Toutes les adresses et itinéraires sont indiqués dans la rubrique Lieux. Un parking est prévu à proximité.' },
  { question: 'Où dormir ?', answer: 'Plusieurs hôtels et chambres d’hôtes autour du lieu. Réservez tôt et mentionnez notre mariage.' },
  { question: 'Y a-t-il un parking ?', answer: 'Oui, un parking privé est réservé aux invités juste à côté du lieu de réception.' },
  { question: 'Les enfants sont-ils invités ?', answer: 'Nous adorons vos enfants, mais la soirée est réservée aux adultes — sauf mention sur votre invitation.' },
  { question: 'Quel est le dress code ?', answer: 'Tenue de cocktail. Mesdames, prévoyez des chaussures adaptées aux jardins.' },
  { question: 'À quelle heure arriver ?', answer: 'Merci d’arriver 30 minutes avant la cérémonie pour vous installer sereinement.' },
];

export const RSVP_EVENT_DEFAULTS = [
  { name: 'Cérémonie', description: '14:30' },
  { name: 'Cocktail', description: '16:00' },
  { name: 'Dîner', description: '18:30' },
  { name: 'Brunch', description: 'Lendemain, 11:00' },
];

export const GIFT_DEFAULTS = [
  {
    gift_type: 'Voyage de noces',
    title: 'Notre lune de miel',
    description: 'Aidez-nous à créer des souvenirs inoubliables au bout du monde.',
    goal_amount: 5000,
  },
  {
    gift_type: 'Participation libre',
    title: 'Cagnotte des mariés',
    description: 'Chaque attention nous touche, quel qu’en soit le montant.',
    goal_amount: 0,
  },
];

/** Cartes d’infos indépendantes du lieu saisi. */
export const GENERIC_INFO_DEFAULTS = [
  { category: 'Parking', title: 'Parking privé', detail: 'Un parking est réservé aux invités à l’entrée du domaine.', event_time: '', link_label: '' },
  { category: 'Hébergements', title: 'Où dormir ?', detail: 'Hôtels et chambres d’hôtes à proximité — réservez tôt.', event_time: '', link_label: '' },
  { category: 'Dress code', title: 'Tenue de cocktail', detail: 'Élégance estivale. Prévoyez des chaussures adaptées aux jardins.', event_time: '', link_label: '' },
  { category: 'Contacts', title: 'Une question ?', detail: 'Écrivez-nous, nous répondons à tout, vite.', event_time: '', link_label: '' },
];

/** Les deux cartes de lieux, dérivées du lieu saisi (cérémonie puis réception). */
export function locationInfos(venue: string, city: string) {
  const place = venue.trim() || 'Le lieu';
  const address = city.trim() || 'Adresse à préciser';
  return [
    { category: 'Cérémonie', title: place, detail: address, event_time: '14:30', link_label: 'Voir l’itinéraire' },
    { category: 'Réception', title: place, detail: address, event_time: '18:30', link_label: 'Voir l’itinéraire' },
  ];
}

export function infoDefaults(venue: string, city: string) {
  return [...locationInfos(venue, city), ...GENERIC_INFO_DEFAULTS];
}

/** Première photo de galerie : celle de l’environnement choisi. */
export function galleryDefaults(themeImage: string) {
  return [
    { url: themeImage, caption: 'Nous deux' },
    { url: '/images/alliances.jpg', caption: 'Les alliances' },
    { url: '/images/bouquet.jpg', caption: 'Le bouquet' },
    { url: '/images/champagne.jpg', caption: 'À la vie' },
  ];
}

export function storyText(partner1: string, partner2: string): string {
  return `C’est une histoire comme on les aime : une rencontre, un éclat de rire, puis l’évidence.\n\nDepuis ce jour, ${partner1} et ${partner2} ne se quittent plus. Et aujourd’hui, ils veulent écrire la suite avec vous, entourés de celles et ceux qu’ils aiment.`;
}

export interface NewSiteInput {
  partner1: string;
  partner2: string;
  wedding_date: string;
  venue: string;
  city: string;
  style: string;
}

/** Le site lui-même, tel qu’envoyé à `POST /api/wedding-sites`. */
export function buildSitePayload(input: NewSiteInput) {
  const theme = styleById(input.style);
  const p1 = input.partner1.trim();
  const p2 = input.partner2.trim();
  const base = slugify(`${p1}-${p2}`) || 'notre-mariage';

  return {
    slug: `${base}-${Math.random().toString(36).slice(2, 6)}`,
    partner1: p1,
    partner2: p2,
    wedding_date: input.wedding_date,
    venue: input.venue.trim(),
    city: input.city.trim(),
    style: input.style,
    phase: 'avant',
    typography: 'spatial',
    accent_color: theme.accent,
    button_style: 'pill',
    shape: 'soft',
    layout: 'magazine',
    animation_level: 'fluide',
    hero_photo: theme.image,
    hero_title: `${p1} & ${p2}`,
    hero_subtitle: 'Nous nous marions',
    story_title: 'Tout a commencé par un regard',
    story_text: storyText(p1, p2),
    story_photo: '/images/couple-paris.jpg',
    announcement: 'Nous avons hâte de vous retrouver.',
    contact_email: '',
    contact_phone: '',
    published: false,
  };
}

/** Site créé et clé d’édition associée (renvoyée une seule fois par l’API). */
export interface CreatedSite {
  site: WeddingSite;
  editToken: string;
}

/**
 * Crée un site complet : le site et sa clé d’édition, puis toutes ses sections
 * en parallèle (elles sont indépendantes et portent déjà leur `position`).
 * Auparavant, 34 requêtes partaient les unes après les autres.
 */
export async function seedSite(input: NewSiteInput): Promise<CreatedSite> {
  const theme = styleById(input.style);
  const created = await apiSend<{ site: WeddingSite; edit_token: string }>(
    '/api/create-site',
    'POST',
    buildSitePayload(input)
  );
  const site = created.site;
  const editToken = created.edit_token;

  // Sans cela, les créations de sections qui suivent seraient refusées (403).
  saveEditToken(site, editToken);
  setActiveToken(editToken);

  const site_id = site.id;

  const rows: Array<Promise<unknown>> = [
    ...SECTION_DEFAULTS.map((s, position) =>
      apiSend('/api/site-sections', 'POST', { site_id, section_key: s.key, title: s.title, visible: true, position })
    ),
    ...PROGRAMME_DEFAULTS.map((p, position) =>
      apiSend('/api/programme', 'POST', {
        site_id, event_time: p.time, title: p.title, description: p.description,
        place: p.place || input.venue.trim(), icon: 'clock', position,
      })
    ),
    ...infoDefaults(input.venue, input.city).map((i, position) =>
      apiSend('/api/infos', 'POST', { site_id, ...i, position })
    ),
    ...galleryDefaults(theme.image).map((g, position) =>
      apiSend('/api/gallery', 'POST', { site_id, url: g.url, caption: g.caption, position, is_private: false })
    ),
    ...FAQ_DEFAULTS.map((f, position) =>
      apiSend('/api/faqs', 'POST', { site_id, question: f.question, answer: f.answer, position })
    ),
    ...RSVP_EVENT_DEFAULTS.map((e, position) =>
      apiSend('/api/rsvp-events', 'POST', { site_id, name: e.name, description: e.description, position })
    ),
    ...GIFT_DEFAULTS.map((g, position) =>
      apiSend('/api/gifts', 'POST', { site_id, ...g, current_amount: 0, position })
    ),
  ];

  await Promise.all(rows);
  return { site, editToken };
}
