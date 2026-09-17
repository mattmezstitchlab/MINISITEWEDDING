import type { ComponentType } from 'react';
import Hero from './Hero';
import Story from './Story';
import Programme from './Programme';
import Lieux from './Lieux';
import Infos from './Infos';
import Rsvp from './Rsvp';
import Gifts from './Gifts';
import Gallery from './Gallery';
import Faq from './Faq';
import Contact from './Contact';
import Footer from './Footer';

/**
 * Registre des sections, indexé par `site_sections.section_key`.
 *
 * L’ordre d’affichage n’est pas ici : il vient de la base (`position`), et
 * chaque section lit ses propres données dans `SiteViewContext`.
 */
export const SECTION_COMPONENTS: Record<string, ComponentType> = {
  hero: Hero,
  histoire: Story,
  programme: Programme,
  lieux: Lieux,
  infos: Infos,
  rsvp: Rsvp,
  cagnotte: Gifts,
  galerie: Gallery,
  faq: Faq,
  contact: Contact,
  footer: Footer,
};
