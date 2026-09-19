import { useState } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, MapPin } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { fondPour } from '../../lib/phoneBackdrops';
import type { WeddingStyle } from '../../lib/weddingStyles';

/**
 * LA COQUE D'UN ÉCRAN DE TÉLÉPHONE
 *
 * Même logique que le site : le fond d'écran de l'univers couvre toute la
 * surface, le hero visuel est posé dessus, une seule chose se lit à la fois, et
 * la capsule du bas fonctionne exactement comme la toolbar du site — capsule
 * blanche, aucune teinte, aucun contour.
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
  /** L'univers, pour choisir son fond d'écran plein cadre. */
  style: WeddingStyle;
  /** Pour repartir d'une catégorie précise quand le téléphone change d'univers. */
  initial?: number;
}

export default function PhoneShell({ hero, modules, style, initial = 0 }: PhoneShellProps) {
  const [active, setActive] = useState(Math.min(initial, modules.length - 1));
  const current = modules[Math.min(active, modules.length - 1)];

  return (
    <div className="relative h-full w-full overflow-hidden bg-white">
      {/* Le fond plein écran de l'univers */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <img src={fondPour(style)} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-white/76" />
        <div className="absolute inset-x-0 top-0 h-[250px] bg-gradient-to-b from-white/35 to-transparent" />
      </div>

      <div className="relative flex h-full w-full flex-col">
        {/* Le hero visuel : une carte posée sur le fond, plus haute qu'avant */}
        <div className="shrink-0 px-2.5 pt-2.5">{hero}</div>

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
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-full px-0.5 py-1.5 transition ${
                  isActive ? 'bg-black/[0.055] text-[#0B0C12]' : 'text-black/35 hover:text-black/60'
                }`}
              >
                <Icon size={13} strokeWidth={isActive ? 2.4 : 1.8} />
                <span className="text-[7.5px] font-semibold leading-none">{module.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

/**
 * LE HERO D'UN ÉCRAN
 *
 * Le visuel de l'univers, l'étiquette du rôle, le titre, puis la date et le
 * lieu. Tout partage la même ligne de gauche que les modules du dessous : le
 * badge, le titre et les blocs sont alignés au millimètre.
 */
export function PhoneHero({
  image,
  badge,
  title,
  date,
  venue,
  height = 'h-[248px]',
  children,
}: {
  image: string;
  badge: string;
  title: string;
  date?: string;
  venue?: string;
  height?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`relative w-full shrink-0 overflow-hidden rounded-[24px] ${height}`}>
      <img src={image} alt={title} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/25 to-black/25" />

      <div className="absolute inset-x-0 bottom-0 p-3 text-white">
        {/* L'étiquette du rôle, alignée sur la colonne des modules */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 font-mono text-[8.5px] font-bold uppercase tracking-[0.14em] text-black shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {badge}
        </span>

        <div className="vp-title mt-2.5 text-[19px] leading-[1.1]">{title}</div>

        {/* La date et le lieu, chacun avec son picto, sur la même ligne de base */}
        {(date || venue) && (
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            {date && (
              <span className="inline-flex items-center gap-1.5 text-[10px] leading-none text-white/85">
                <CalendarDays size={11} className="shrink-0 text-white/65" />
                {date}
              </span>
            )}
            {venue && (
              <span className="inline-flex items-center gap-1.5 text-[10px] leading-none text-white/85">
                <MapPin size={11} className="shrink-0 text-white/65" />
                <span className="max-w-[142px] truncate">{venue}</span>
              </span>
            )}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
