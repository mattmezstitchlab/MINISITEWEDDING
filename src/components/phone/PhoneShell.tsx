import { useState } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

/** Le bandeau de hero des écrans : visuel, étiquette de rôle et deux lignes. */
export function PhoneHero({
  image,
  badge,
  title,
  subtitle,
  height = 'h-[38%]',
  children,
}: {
  image: string;
  badge: string;
  title: string;
  subtitle?: string;
  height?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`relative w-full shrink-0 overflow-hidden ${height}`}>
      <img src={image} alt={title} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/25 to-black/25" />

      <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
        <span className="rounded-full bg-white/95 px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider text-black">
          {badge}
        </span>
        <div className="vp-title mt-1 text-[18px] leading-tight">{title}</div>
        {subtitle && <div className="mt-0.5 font-mono text-[9px] text-white/80">{subtitle}</div>}
        {children}
      </div>
    </div>
  );
}
