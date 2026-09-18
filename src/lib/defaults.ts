import { apiSend } from './http';
import { saveEditToken, setActiveToken } from './auth';
import { slugify } from './format';
import { styleById } from './weddingStyles';
import { getThemeConfig } from './themeConfigs';
import { getScenesForStyle } from './themeTimelineScenarios';
import type { WeddingSite } from './types';

/**
 * Contenu par défaut d’un site de mariage.
 * Maintenant thématisé : chaque style a son propre vocabulaire,
 * son programme, ses infos, ses FAQ, et ses packages.
 */

export const SECTION_DEFAULTS = [
  { key: 'hero', title: 'Accueil' },
  { key: 'histoire', title: 'Notre histoire' },
  { key: 'programme', title: 'Programme' },
  { key: 'lieux', title: 'Lieux' },
  { key: 'infos', title: 'Infos pratiques' },
  { key: 'rsvp', title: 'RSVP' },
  { key: 'packages', title: 'Packages' },
  { key: 'cagnotte', title: 'Cagnotte' },
  { key: 'galerie', title: 'Galerie' },
  { key: 'faq', title: 'FAQ' },
  { key: 'contact', title: 'Contact' },
  { key: 'footer', title: 'Pied de page' },
];

/** Fallbacks si pas de config thématique */
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

export const GENERIC_INFO_DEFAULTS = [
  { category: 'Parking', title: 'Parking privé', detail: 'Un parking est réservé aux invités à l’entrée du domaine.', event_time: '', link_label: '' },
  { category: 'Hébergements', title: 'Où dormir ?', detail: 'Hôtels et chambres d’hôtes à proximité — réservez tôt.', event_time: '', link_label: '' },
  { category: 'Dress code', title: 'Tenue de cocktail', detail: 'Élégance estivale. Prévoyez des chaussures adaptées aux jardins.', event_time: '', link_label: '' },
  { category: 'Contacts', title: 'Une question ?', detail: 'Écrivez-nous, nous répondons à tout, vite.', event_time: '', link_label: '' },
];

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

/** Le site lui-même, thématisé */
export function buildSitePayload(input: NewSiteInput) {
  const theme = styleById(input.style);
  const config = getThemeConfig(input.style);
  const p1 = input.partner1.trim();
  const p2 = input.partner2.trim();
  const base = slugify(`${p1}-${p2}`) || 'notre-mariage';

  const editorial = config?.editorial;

  return {
    slug: `${base}-${Math.random().toString(36).slice(2, 6)}`,
    partner1: p1,
    partner2: p2,
    wedding_date: input.wedding_date,
    venue: input.venue.trim(),
    city: input.city.trim(),
    style: input.style,
    phase: 'avant',
    typography: editorial?.typography || 'spatial',
    accent_color: theme.accent,
    button_style: editorial?.button_style || 'pill',
    shape: editorial?.shape || 'soft',
    layout: editorial?.layout || 'magazine',
    animation_level: editorial?.animation_level || 'fluide',
    hero_photo: theme.image,
    hero_title: `${p1} & ${p2}`,
    hero_subtitle: editorial?.hero_subtitle || 'Nous nous marions',
    story_title: editorial?.story_title || 'Tout a commencé par un regard',
    story_text: editorial ? editorial.story_text(p1, p2) : storyText(p1, p2),
    story_photo: '/images/couple-paris.jpg',
    announcement: editorial?.announcement || 'Nous avons hâte de vous retrouver.',
    contact_email: '',
    contact_phone: '',
    published: false,
  };
}

export interface CreatedSite {
  site: WeddingSite;
  editToken: string;
}

async function runBatched(tasks: Array<() => Promise<unknown>>, batchSize = 5) {
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize).map((fn) => fn());
    const results = await Promise.allSettled(batch);
    const failed = results.filter((r) => r.status === 'rejected');
    if (failed.length > 0) {
      const retry = await Promise.allSettled(
        failed.map((_, idx) => {
          const taskIndex = i + results.findIndex((r) => r.status === 'rejected');
          return tasks[taskIndex]?.() ?? Promise.resolve();
        })
      );
      const stillFailed = retry.filter((r) => r.status === 'rejected');
      if (stillFailed.length > 0) {
        const firstError = (stillFailed[0] as PromiseRejectedResult).reason;
        throw firstError;
      }
    }
  }
}

/**
 * Crée un site complet thématisé : sections avec titres du thème,
 * programme, infos, FAQ, RSVP, cagnotte issus de THEME_CONFIGS.
 */
export async function seedSite(input: NewSiteInput): Promise<CreatedSite> {
  const theme = styleById(input.style);
  const config = getThemeConfig(input.style);

  let created: { site: WeddingSite; edit_token: string };
  try {
    created = await apiSend<{ site: WeddingSite; edit_token: string }>(
      '/api/create-site',
      'POST',
      buildSitePayload(input)
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('FUNCTION_INVOCATION_FAILED') || msg.includes('server error') || msg.includes('500')) {
      throw new Error(
        `La création a échoué côté serveur. Vérifiez que les variables Supabase sont bien configurées sur Vercel (NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY). Détail: ${msg}`
      );
    }
    throw e;
  }

  const site = created.site;
  const editToken = created.edit_token;

  saveEditToken(site, editToken);
  setActiveToken(editToken);

  const site_id = site.id;

  // Sections : titres thématisés si config existe
  const sections = config?.sections || SECTION_DEFAULTS;

  // SYNCHRONISATION TRANSVERSALE MIROIR :
  // Le programme réel hérite directement des scènes scénarisées du thème (THEME_TIMELINE_SCENARIOS)
  const themeScenes = getScenesForStyle(input.style);
  const programme = themeScenes && themeScenes.length > 0
    ? themeScenes.map(sc => ({
        time: sc.time,
        title: sc.title,
        description: sc.narrativeScript,
        place: input.venue.trim() || 'Lieu de réception',
      }))
    : (config?.programme || PROGRAMME_DEFAULTS);

  const infos = config ? config.infos : infoDefaults(input.venue, input.city);
  const faq = config?.faq || FAQ_DEFAULTS;
  const rsvpEvents = config?.rsvpEvents || RSVP_EVENT_DEFAULTS;
  const gifts = config?.gifts || GIFT_DEFAULTS;

  // Pour les lieux, si config a déjà des infos avec lieux, on ajoute quand même le lieu saisi en plus si besoin
  const finalInfos = config
    ? [...config.infos.slice(0, 2).map(i => ({ ...i, title: input.venue.trim() || i.title, detail: input.city.trim() || i.detail })), ...config.infos.slice(2)]
    : infos;

  const tasks: Array<() => Promise<unknown>> = [
    ...sections.map((s, position) => () =>
      apiSend('/api/site-sections', 'POST', { site_id, section_key: s.key, title: s.title, visible: (s as any).visible ?? true, position })
    ),
    ...programme.map((p, position) => () =>
      apiSend('/api/programme', 'POST', {
        site_id,
        event_time: p.time,
        title: p.title,
        description: p.description,
        place: (p.place as string) || input.venue.trim(),
        icon: (p as any).icon || 'clock',
        position,
      })
    ),
    ...finalInfos.map((i, position) => () =>
      apiSend('/api/infos', 'POST', { site_id, ...i, position })
    ),
    ...galleryDefaults(theme.image).map((g, position) => () =>
      apiSend('/api/gallery', 'POST', { site_id, url: g.url, caption: g.caption, position, is_private: false })
    ),
    ...faq.map((f, position) => () =>
      apiSend('/api/faqs', 'POST', { site_id, question: f.question, answer: f.answer, position })
    ),
    ...rsvpEvents.map((e, position) => () =>
      apiSend('/api/rsvp-events', 'POST', { site_id, name: e.name, description: e.description, position })
    ),
    ...gifts.map((g, position) => () =>
      apiSend('/api/gifts', 'POST', { site_id, ...g, current_amount: 0, position })
    ),
    // Packages : on les stocke aussi dans gift_options avec gift_type = package pour affichage
    ...(config?.packages || []).map((pkg, position) =>
      () =>
        apiSend('/api/gifts', 'POST', {
          site_id,
          gift_type: 'package',
          title: `${pkg.name} — ${pkg.price}`,
          description: `${pkg.description} | ${pkg.features.join(' • ')}`,
          goal_amount: 0,
          current_amount: 0,
          position: 100 + position,
        })
    ),
  ];

  await runBatched(tasks, 6);
  return { site, editToken };
}
