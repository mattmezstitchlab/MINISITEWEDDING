import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  PublicSiteData, WeddingSite, SiteSection, ProgrammeEvent, InfoPratique,
  GalleryPhoto, Faq, RsvpEvent, GiftOption,
} from './types';
import { apiGet, ApiError } from './http';
import { DEMO_DATA, DEMO_ENABLED } from './demo';

/**
 * Chargement d’un site complet.
 *
 * L’autorisation est transparente : `http.ts` ajoute l’en-tête `x-site-token`
 * quand une clé d’édition est active, ce qui débloque l’éditeur et l’aperçu
 * d’un brouillon. Un visiteur ordinaire n’a pas de clé et ne voit que les sites
 * publiés.
 *
 * Le site public et l’éditeur demandaient exactement les mêmes huit
 * ressources, avec le même repli sur la démo en cas d’erreur : la logique
 * vit désormais ici, une seule fois.
 */

export interface SiteTarget {
  /** Accès public par slug. */
  slug?: string;
  /** Accès éditeur par identifiant. */
  id?: number | string;
}

function targetQuery(target: SiteTarget): string {
  const params = new URLSearchParams();
  if (target.slug) params.set('slug', target.slug);
  else if (target.id !== undefined) params.set('id', String(target.id));
  return params.toString();
}

export async function loadSiteData(target: SiteTarget): Promise<PublicSiteData> {
  const site = await apiGet<WeddingSite>(`/api/wedding-sites?${targetQuery(target)}`);
  const [sections, programme, infos, gallery, faqs, rsvpEvents, gifts] = await Promise.all([
    apiGet<SiteSection[]>(`/api/site-sections?site_id=${site.id}`),
    apiGet<ProgrammeEvent[]>(`/api/programme?site_id=${site.id}`),
    apiGet<InfoPratique[]>(`/api/infos?site_id=${site.id}`),
    apiGet<GalleryPhoto[]>(`/api/gallery?site_id=${site.id}`),
    apiGet<Faq[]>(`/api/faqs?site_id=${site.id}`),
    apiGet<RsvpEvent[]>(`/api/rsvp-events?site_id=${site.id}`),
    apiGet<GiftOption[]>(`/api/gifts?site_id=${site.id}`),
  ]);
  return { site, sections, programme, infos, gallery, faqs, rsvpEvents, gifts };
}

export interface SiteDataState {
  data: PublicSiteData | null;
  /** Vrai quand les données affichées sont celles de la démo (API injoignable). */
  demo: boolean;
  loading: boolean;
  error: string;
  /** Code HTTP de l’échec, le cas échéant (403 = clé d’édition refusée). */
  status: number | null;
}

export interface SiteDataActions {
  /** Recharge les huit ressources. */
  reload: () => Promise<void>;
  /** Mise à jour optimiste locale (l’éditeur), sans requête. */
  patchLocal: (updater: (data: PublicSiteData) => PublicSiteData) => void;
}

export function useSiteData(target: SiteTarget): SiteDataState & SiteDataActions {
  // Identité stable du target : les appelants passent un objet littéral à chaque rendu.
  const key = `${target.slug ?? ''}|${target.id ?? ''}`;
  const [state, setState] = useState<SiteDataState>({ data: null, demo: false, loading: true, error: '', status: null });
  // Une requête plus récente invalide les précédentes (changement de slug, rechargements).
  const generation = useRef(0);

  const reload = useCallback(() => {
    const gen = ++generation.current;
    const commit = (next: SiteDataState) => {
      if (gen === generation.current) setState(next);
    };
    return loadSiteData(target)
      .then((data) => commit({ data, demo: false, loading: false, error: '', status: null }))
      .catch((err: unknown) => {
        // En local, l’API serverless n’existe pas : le jeu de démo prend le relais.
        if (DEMO_ENABLED) {
          commit({ data: DEMO_DATA, demo: true, loading: false, error: '', status: null });
        } else {
          commit({
            data: null,
            demo: false,
            loading: false,
            error: err instanceof Error ? err.message : 'Chargement impossible',
            status: err instanceof ApiError ? err.status : null,
          });
        }
      });
    // `key` couvre déjà tous les champs de `target` utilisés ci-dessus.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const patchLocal = useCallback((updater: (data: PublicSiteData) => PublicSiteData) => {
    setState((prev) => (prev.data ? { ...prev, data: updater(prev.data) } : prev));
  }, []);

  useEffect(() => { reload(); }, [reload]);

  return { ...state, reload, patchLocal };
}
