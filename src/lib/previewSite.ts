import type { PublicSiteData, WeddingSite } from './types';
import {
  SECTION_DEFAULTS, GENERIC_INFO_DEFAULTS, FAQ_DEFAULTS, RSVP_EVENT_DEFAULTS, GIFT_DEFAULTS, storyText,
} from './defaults';
import { styleById } from './weddingStyles';
import { getScenesForStyle } from './themeTimelineScenarios';
import { contentFor } from './universeContent';

/**
 * UN MINI-SITE D'APERÇU
 *
 * Le même montage que celui qui amorce un vrai site — les sections, le
 * programme tiré des scènes de l'univers, les informations pratiques, la
 * galerie, la FAQ, la cagnotte — mais côté navigateur, sans base : c'est ce qui
 * permet de montrer le mini-site complet, dans le style du site, avant même
 * d'avoir répondu à une seule question.
 */

export interface PreviewSiteOptions {
  styleId: string;
  typography?: string;
  accent?: string;
  buttonStyle?: string;
  shape?: string;
  layout?: string;
  heroTitle?: string;
  heroSubtitle?: string;
}

const SITE_ID = 0;

export function buildPreviewSite(options: PreviewSiteOptions): PublicSiteData {
  const theme = styleById(options.styleId);
  const content = contentFor(theme);
  const scenes = getScenesForStyle(theme.id);

  const site: WeddingSite = {
    id: SITE_ID,
    slug: 'apercu',
    partner1: 'Sarah',
    partner2: 'Gabriel',
    wedding_date: '2027-07-18',
    venue: 'Château de Chantilly',
    city: 'Chantilly, Oise',
    style: theme.id,
    phase: 'avant',
    typography: options.typography ?? 'spatial',
    accent_color: options.accent ?? theme.accent,
    button_style: options.buttonStyle ?? 'pill',
    shape: options.shape ?? 'soft',
    layout: options.layout ?? 'magazine',
    animation_level: 'fluide',
    hero_photo: theme.image,
    hero_title: options.heroTitle ?? 'Sarah & Gabriel',
    hero_subtitle: options.heroSubtitle ?? content.hero.kicker,
    story_title: content.hero.title,
    story_text: storyText('Sarah', 'Gabriel'),
    story_photo: theme.image,
    announcement: content.hero.subtitle,
    contact_email: 'sarah.et.gabriel@vows.fr',
    contact_phone: '+33 6 12 34 56 78',
    published: false,
  };

  const sections = SECTION_DEFAULTS.map((s, i) => ({
    id: i + 1, site_id: SITE_ID, section_key: s.key, title: s.title, visible: true, position: i,
  }));

  const programme = scenes.map((scene, i) => ({
    id: i + 1,
    site_id: SITE_ID,
    event_time: scene.time,
    title: scene.title,
    description: scene.narrativeScript,
    place: scene.ambianceDetail,
    icon: 'clock',
    position: i,
  }));

  const infos = [
    { category: 'Cérémonie', title: 'Château de Chantilly', detail: 'Orangerie — 7 rue du Connétable', event_time: '14:30', link_label: 'Voir l’itinéraire' },
    { category: 'Réception', title: 'Château de Chantilly', detail: 'Grande nef — 7 rue du Connétable', event_time: '18:30', link_label: 'Voir l’itinéraire' },
    ...GENERIC_INFO_DEFAULTS,
  ].map((row, i) => ({ id: i + 1, site_id: SITE_ID, position: i, ...row }));

  const gallery = [
    theme.image,
    '/images/alliances.jpg',
    '/images/champagne.jpg',
    '/images/table-noir.jpg',
    '/images/bouquet.jpg',
    '/images/danse.jpg',
  ].map((url, i) => ({
    id: i + 1, site_id: SITE_ID, url, caption: '', position: i, is_private: false,
  }));

  const faqs = FAQ_DEFAULTS.map((f, i) => ({ id: i + 1, site_id: SITE_ID, position: i, ...f }));
  const rsvpEvents = RSVP_EVENT_DEFAULTS.map((e, i) => ({ id: i + 1, site_id: SITE_ID, position: i, ...e }));
  const gifts = GIFT_DEFAULTS.map((g, i) => ({
    id: i + 1, site_id: SITE_ID, position: i, current_amount: i === 0 ? 1840 : 0, ...g,
  }));

  return { site, sections, programme, infos, gallery, faqs, rsvpEvents, gifts };
}

/** Le chemin de l'aperçu, avec tout ce qui se règle dans l'éditeur. */
export function previewPath(options: PreviewSiteOptions): string {
  const params = new URLSearchParams();
  params.set('style', options.styleId);
  if (options.typography) params.set('typo', options.typography);
  if (options.accent) params.set('accent', options.accent.replace('#', ''));
  if (options.buttonStyle) params.set('bouton', options.buttonStyle);
  return `/apercu?${params.toString()}`;
}
