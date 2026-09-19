import { useState } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, MapPin } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * LA COQUE D'UN ÉCRAN DE TÉLÉPHONE
 *
 * Même logique que le site : un hero visuel en haut, une seule chose à lire à
 * la fois, et une capsule de navigation en bas pour passer d'une catégorie à
 * l'autre. Les écrans défilent à l'horizontal, au doigt comme au clic.
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
  accent: string;
  /** Pour repartir d'une catégorie précise quand le téléphone change d'univers. */
  initial?: number;
}

export default function PhoneShell({ hero, modules, accent, initial = 0 }: PhoneShellProps) {
  const [active, setActive] = useState(Math.min(initial, modules.length - 1));
  const current = modules[Math.min(active, modules.length - 1)];

  const go = (index: number) => {
    setActive((prev) => Math.max(0, Math.min(modules.length - 1, typeof index === 'number' ? index : prev)));
  };

  return (
    <div className="relative flex h-full w-full flex-col bg-white">
      {/* Le hero visuel, propre au rôle */}
      {hero}

      {/* L'écran courant, une catégorie à la fois */}
      <div className="relative flex-1 overflow-hidden bg-[#FAFAFC]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.x < -45) setActive((i) => Math.min(modules.length - 1, i + 1));
              if (info.offset.x > 45) setActive((i) => Math.max(0, i - 1));
            }}
            className="no-scrollbar h-full w-full cursor-grab overflow-y-auto px-3.5 pb-14 pt-3.5 text-left active:cursor-grabbing"
          >
            {current.content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* La capsule de navigation de cet écran */}
      <nav className="absolute inset-x-2 bottom-2 z-30 flex items-center justify-between gap-0.5 rounded-full bg-white/95 p-1 shadow-[0_6px_20px_rgba(0,0,0,0.16)] ring-1 ring-black/8 backdrop-blur">
        {modules.map((module, i) => {
          const Icon = module.icon;
          const isActive = i === active;
          return (
            <button
              key={module.id}
              type="button"
              onClick={() => go(i)}
              aria-label={`Écran ${module.label}`}
              aria-current={isActive}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-full px-0.5 py-1.5 transition ${
                isActive ? 'text-[#0B0C12]' : 'text-black/35 hover:text-black/60'
              }`}
              style={isActive ? { background: `${accent}1f` } : undefined}
            >
              <Icon size={13} strokeWidth={isActive ? 2.4 : 1.8} />
              <span className="text-[7.5px] font-semibold leading-none">{module.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

/**
 * Le bandeau de hero des écrans : le visuel, l'étiquette du rôle posée en haut
 * du bloc, le titre, puis la date et le lieu — chacun avec son picto, alignés
 * sur la même ligne de base.
 */
export function PhoneHero({
  image,
  badge,
  title,
  date,
  venue,
  height = 'h-[40%]',
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
    <div className={`relative w-full shrink-0 overflow-hidden ${height}`}>
      <img src={image} alt={title} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/30" />

      <div className="absolute inset-x-0 bottom-0 px-4 pb-5 text-white">
        {/* L'étiquette du rôle, posée haut et alignée avec le titre */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 font-mono text-[8.5px] font-bold uppercase tracking-[0.14em] text-black shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {badge}
        </span>

        <div className="vp-title mt-3.5 text-[19px] leading-[1.1]">{title}</div>

        {/* La date et le lieu, chacun avec son picto */}
        {(date || venue) && (
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {date && (
              <span className="inline-flex items-center gap-1.5 text-[10px] text-white/85">
                <CalendarDays size={11} className="shrink-0 text-white/65" />
                {date}
              </span>
            )}
            {venue && (
              <span className="inline-flex items-center gap-1.5 text-[10px] text-white/85">
                <MapPin size={11} className="shrink-0 text-white/65" />
                <span className="max-w-[150px] truncate">{venue}</span>
              </span>
            )}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
