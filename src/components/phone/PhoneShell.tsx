import { useState } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { fondPour } from '../../lib/phoneBackdrops';
import { fontsFor, typographyFor, type WeddingStyle } from '../../lib/weddingStyles';
import { PhoneThemeContext, usePhoneTheme, type PhoneTheme } from './phoneTheme';

/**
 * LA COQUE D'UN ÉCRAN DE TÉLÉPHONE
 *
 * Même grammaire que le mini-site, en plus petit : la capsule blanche du site en
 * haut, le hero plein cadre de l'univers juste dessous, des cartes au matériau
 * du thème, et la capsule de navigation du bas — blanche, sans teinte, sans
 * contour. La typographie et l'accent viennent de l'univers : un écran ne
 * ressemble pas à un autre.
 */

export interface PhoneModuleDef {
  id: string;
  label: string;
  icon: LucideIcon;
  content: ReactNode;
}

interface PhoneShellProps {
  hero: ReactNode;
  modules: PhoneModuleDef[];
  /** L'univers, pour choisir son fond d'écran plein cadre et sa typographie. */
  style: WeddingStyle;
  /** Pour repartir d'une catégorie précise quand le téléphone change d'univers. */
  initial?: number;
}

export default function PhoneShell({ hero, modules, style, initial = 0 }: PhoneShellProps) {
  const [active, setActive] = useState(Math.min(initial, modules.length - 1));
  const current = modules[Math.min(active, modules.length - 1)];
  const fonts = fontsFor(typographyFor(style.id));

  const theme: PhoneTheme = {
    style,
    heading: fonts.heading,
    body: fonts.body,
    weight: fonts.weight,
    accent: style.accent,
    ink: style.ink,
    muted: style.muted,
    cardR: '18px',
    btnR: '999px',
  };

  return (
    <PhoneThemeContext.Provider value={theme}>
      <div className="relative h-full w-full overflow-hidden bg-white" style={{ fontFamily: theme.body }}>
        {/* Le fond plein écran de l'univers */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <img src={fondPour(style)} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-white/80" />
          <div className="absolute inset-x-0 top-0 h-[250px] bg-gradient-to-b from-white/40 to-transparent" />
        </div>

        <div className="relative flex h-full w-full flex-col">
          {/* LA CAPSULE DU SITE : le header, en plus petit */}
          <div className="shrink-0 px-2.5 pt-2.5">
            <div className="flex items-center justify-between gap-2 rounded-full bg-white px-3 py-2 shadow-[0_6px_20px_rgba(0,0,0,0.10)] ring-1 ring-black/5">
              <span className="flex min-w-0 items-center gap-1.5">
                <span className="vp-title text-[11.5px] font-bold italic tracking-wider text-[#0B0C12]">VOWS</span>
                <span className="truncate text-[8.5px] font-semibold uppercase tracking-[0.16em] text-black/35">
                  {style.name}
                </span>
              </span>
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: theme.accent }}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Le hero visuel de l'univers, plein cadre */}
          <div className="shrink-0 px-2.5 pt-2">{hero}</div>

          {/* L'écran courant, une catégorie à la fois */}
          <div className="relative min-h-0 flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 22 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -22 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -45) setActive((i) => Math.min(modules.length - 1, i + 1));
                  if (info.offset.x > 45) setActive((i) => Math.max(0, i - 1));
                }}
                className="no-scrollbar h-full w-full cursor-grab overflow-y-auto px-2.5 pb-14 pt-2.5 text-left active:cursor-grabbing"
              >
                {current.content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* La capsule de navigation : celle du site, en plus petit */}
          <nav className="absolute inset-x-2.5 bottom-2.5 z-30 flex items-center justify-between gap-0.5 rounded-full bg-white/95 p-1 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md">
            {modules.map((module, i) => {
              const Icon = module.icon;
              const isActive = i === active;
              return (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => setActive(Math.max(0, Math.min(modules.length - 1, i)))}
                  aria-label={`Écran ${module.label}`}
                  aria-current={isActive}
                  className="flex flex-1 flex-col items-center gap-0.5 rounded-full px-0.5 py-1.5 transition"
                  style={{
                    background: isActive ? 'rgba(12,14,24,0.06)' : 'transparent',
                    color: isActive ? '#0B0C12' : 'rgba(11,12,18,0.38)',
                  }}
                >
                  <Icon size={13} strokeWidth={isActive ? 2.4 : 1.8} />
                  <span className="text-[7.5px] font-semibold leading-none">{module.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </PhoneThemeContext.Provider>
  );
}

/**
 * LE HERO D'UN ÉCRAN
 *
 * Celui du mini-site : le visuel plein cadre, l'étiquette du rôle, le titre dans
 * la typographie de l'univers, la date encadrée de deux filets, le lieu — puis
 * les boutons, dans la couleur d'accent du thème.
 */
export function PhoneHero({
  image,
  badge,
  kicker,
  title,
  date,
  venue,
  height = 'h-[262px]',
  children,
}: {
  image: string;
  badge: string;
  kicker?: string;
  title: string;
  date?: string;
  venue?: string;
  height?: string;
  children?: ReactNode;
}) {
  const theme = usePhoneTheme();

  return (
    <div className={`relative w-full shrink-0 overflow-hidden rounded-[22px] ${height}`}>
      <img src={image} alt={title} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/30 to-black/25" />

      <div className="absolute inset-x-0 bottom-0 p-3 text-white">
        {/* L'étiquette du rôle, alignée sur la colonne des modules */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 font-mono text-[8.5px] font-bold uppercase tracking-[0.14em] text-black shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: theme.accent }} />
          {badge}
        </span>

        {kicker && (
          <div className="mt-2.5 text-[8.5px] font-semibold uppercase tracking-[0.28em] text-white/70">{kicker}</div>
        )}

        <div
          className="mt-1 text-[21px] leading-[1.08]"
          style={{ fontFamily: theme.heading, fontWeight: theme.weight, letterSpacing: '-0.035em' }}
        >
          {title}
        </div>

        {/* La date, entre deux filets, comme sur le site */}
        {date && (
          <div className="mt-2 flex items-center gap-2">
            <span className="h-px w-6 bg-white/40" />
            <span className="text-[11px] tracking-[0.14em] text-white/85">{date}</span>
            <span className="h-px w-6 bg-white/40" />
          </div>
        )}

        {venue && (
          <div className="mt-1.5 flex items-center gap-1.5 text-[10px] leading-none text-white/80">
            <MapPin size={11} className="shrink-0 text-white/60" />
            <span className="max-w-[180px] truncate">{venue}</span>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}

/**
 * LES DEUX BOUTONS DU HERO
 *
 * Ceux du site : le premier dans la couleur d'accent, le second en verre. Aucune
 * autre couleur, aucun contour noir.
 */
export function PhoneHeroActions({ children }: { children: ReactNode }) {
  return <div className="mt-3 flex items-center gap-1.5">{children}</div>;
}

export function PhoneHeroButton({
  children,
  primary = false,
  icon: Icon,
}: {
  children: ReactNode;
  primary?: boolean;
  icon?: LucideIcon;
}) {
  const theme = usePhoneTheme();
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[10.5px] font-semibold transition"
      style={
        primary
          ? { background: theme.accent, color: '#fff', borderRadius: theme.btnR, boxShadow: `0 12px 26px -16px ${theme.accent}` }
          : {
              border: '1px solid rgba(255,255,255,0.28)',
              background: 'rgba(255,255,255,0.14)',
              color: '#fff',
              borderRadius: theme.btnR,
              backdropFilter: 'blur(10px)',
            }
      }
    >
      {Icon && <Icon size={12} />}
      {children}
    </button>
  );
}
