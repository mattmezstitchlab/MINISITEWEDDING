import { useEffect, useMemo, useState } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import { Camera } from 'lucide-react';
import type { PublicSiteData } from '../lib/types';
import { styleById, fontsFor, buttonRadius, cardRadius, envVars } from '../lib/weddingStyles';
import { daysUntil } from '../lib/format';
import { SiteViewContext } from './sections/context';
import type { SiteViewValue } from './sections/context';
import { SECTION_COMPONENTS } from './sections';
import SupermarcheTicket from './themes/SupermarcheTicket';
import WeddingDayBar from './WeddingDayBar';

/**
 * Rendu d’un site de mariage — utilisé tel quel par la page publique, et en
 * aperçu cliquable par l’éditeur (`preview`).
 *
 * Ce fichier ne contient que la coquille : calcul des valeurs de thème, ordre
 * des sections et sélection dans l’éditeur. Chaque section vit dans
 * `components/sections/` et lit ce dont elle a besoin via `useSiteView()`.
 */
interface Props {
  data: PublicSiteData;
  /** Copie statique : la base est injoignable, les écritures sont désactivées. */
  degraded?: boolean;
  preview?: boolean;
  selectedKey?: string | null;
  onSelectSection?: (key: string) => void;
  /**
   * Barre du bas sur le site du couple : le Jour J et son calendrier.
   * Désactivée dans l'aperçu de l'éditeur, où elle masquerait les sections.
   */
  dayBar?: boolean;
}

export default function PublicSiteView({ data, degraded = false, preview = false, selectedKey, onSelectSection, dayBar = false }: Props) {
  const { site, sections } = data;
  const theme = styleById(site.style);
  const fonts = fontsFor(site.typography);
  const accent = site.accent_color || theme.accent;
  const dark = theme.dark;

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [giftThanks, setGiftThanks] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const ordered = useMemo(() => {
    const sorted = [...sections].sort((a, b) => a.position - b.position);
    return preview ? sorted : sorted.filter((s) => s.visible);
  }, [sections, preview]);

  const value = useMemo<SiteViewValue>(() => ({
    data,
    site,
    theme,
    fonts,
    accent,
    dark,
    ink: dark ? '#F2F4FB' : theme.ink,
    muted: dark ? 'rgba(242,244,251,0.62)' : theme.muted,
    glass: dark ? 'vp-glass-dark' : 'vp-glass',
    glassSpec: dark ? 'vp-spec-dark' : 'vp-spec',
    btnR: buttonRadius(site.button_style || 'pill'),
    cardR: cardRadius(site.shape || 'soft'),
    headWeight: fonts.weight ?? 620,
    names: `${site.partner1} & ${site.partner2}`,
    daysLeft: daysUntil(site.wedding_date),
    preview,
    degraded,
    scrolled,
    menuOpen,
    setMenuOpen,
    lightbox,
    setLightbox,
    giftThanks,
    setGiftThanks,
  }), [data, site, theme, fonts, accent, dark, preview, degraded, scrolled, menuOpen, lightbox, giftThanks]);

  /** En aperçu, chaque section devient cliquable et signale si elle est masquée. */
  const wrap = (key: string, content: ReactNode) => {
    if (!preview || !onSelectSection) return <div id={`sec-${key}`}>{content}</div>;
    const sec = sections.find((s) => s.section_key === key);
    const selected = selectedKey === key;
    return (
      <div
        id={`sec-${key}`}
        onClick={(e) => { e.stopPropagation(); onSelectSection(key); }}
        className={`relative cursor-pointer transition ${selected ? 'ring-2 ring-offset-2' : 'hover:ring-1 hover:ring-black/15'}`}
        style={selected ? ({ '--tw-ring-color': '#16171A' } as CSSProperties) : undefined}
      >
        {sec && !sec.visible && (
          <div className="absolute right-2 top-2 z-10 rounded-full bg-black/70 px-2.5 py-1 text-[11px] tracking-wide text-white">Masquée</div>
        )}
        <div className={sec && !sec.visible ? 'pointer-events-none opacity-50' : ''}>{content}</div>
      </div>
    );
  };

  return (
    <SiteViewContext.Provider value={value}>
      {/* Mode spécial SUPERMARCHÉ 22H : ticket de caisse thermique */}
      {site.style === 'supermarche' ? (
        <SupermarcheTicket data={data} preview={preview} />
      ) : (
        <div
          className={`vp-env min-h-screen ${dark ? 'vp-env-dark' : ''}`}
          style={{
            fontFamily: fonts.body,
            color: value.ink,
            // La barre du bas annonce sa hauteur : la page lui laisse la place,
            // sinon le pied de page passerait dessous.
            paddingBottom: dayBar ? 'var(--vows-daybar, 0px)' : undefined,
            ...envVars(theme, accent),
          } as CSSProperties}
        >
          {ordered.map((s) => {
            const Section = SECTION_COMPONENTS[s.section_key];
            return <div key={s.section_key}>{wrap(s.section_key, Section ? <Section /> : null)}</div>;
          })}
          {dayBar && <WeddingDayBar />}
          {ordered.length === 0 && (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center" style={{ color: value.muted }}>
              <Camera size={32} strokeWidth={1.5} />
              <p>Votre site prend forme…</p>
            </div>
          )}
        </div>
      )}
    </SiteViewContext.Provider>
  );
}
