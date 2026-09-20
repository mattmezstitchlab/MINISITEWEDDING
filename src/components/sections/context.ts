import { createContext, useContext } from 'react';
import type { PublicSiteData, WeddingSite } from '../../lib/types';
import type { WeddingStyle } from '../../lib/weddingStyles';

/**
 * Tout ce dont une section a besoin pour se rendre.
 *
 * Le site public et l’aperçu de l’éditeur partagent le même rendu : les valeurs
 * dérivées du thème (couleurs, matériaux, arrondis, typographies) sont calculées
 * une fois, ici, puis lues par chaque section via `useSiteView()`.
 */
export interface SiteViewValue {
  data: PublicSiteData;
  site: WeddingSite;
  theme: WeddingStyle;
  fonts: { heading: string; body: string; weight: number };
  /** Couleur d’accent du mariage, ou celle de l’environnement à défaut. */
  accent: string;
  dark: boolean;
  ink: string;
  muted: string;
  /** Classes du matériau verre, clair ou sombre selon l’environnement. */
  glass: string;
  glassSpec: string;
  /** Rayon des boutons (choix « Capsule / Doux / Franc »). */
  btnR: string;
  /** Rayon des cartes (choix « Continue / Franche / Généreuse »). */
  cardR: string;
  headWeight: number;
  names: string;
  daysLeft: number;
  /** Aperçu dans l’éditeur : pas de navigation, pas de formulaire réel. */
  preview: boolean;
  /** Le défilé montre le mini-site dans un iPhone : le header du site y gêne. */
  hideHeader: boolean;
  /**
   * Site servi depuis une copie statique (`public/sites/<slug>.json`) parce que
   * la base est injoignable. Le rendu est complet, mais rien ne peut être
   * enregistré : les sections qui écrivent (RSVP) se mettent en pause.
   */
  degraded: boolean;
  scrolled: boolean;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  lightbox: string | null;
  setLightbox: (url: string | null) => void;
  giftThanks: number | null;
  setGiftThanks: (id: number | null) => void;
}

export const SiteViewContext = createContext<SiteViewValue | null>(null);

export function useSiteView(): SiteViewValue {
  const value = useContext(SiteViewContext);
  if (!value) throw new Error('useSiteView() doit être utilisé à l’intérieur de <SiteViewContext.Provider>.');
  return value;
}
