import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { WEDDING_STYLES } from '../lib/weddingStyles';
import { usePrefersReducedMotion, useTabVisible } from '../lib/useReducedMotion';
import VisionImage, { TiltCard } from './vision/VisionImage';

/** Millisecondes passées sur chaque environnement. */
const STEP_MS = 5200;

/**
 * L’enchaînement du hero : les dix environnements défilent, chacun avec son
 * visuel et son gros titre.
 *
 * Le défilement s’arrête dès que le pointeur entre dans la carte, qu’un
 * élément reçoit le focus, que l’onglet passe en arrière-plan ou que
 * l’utilisateur demande des animations réduites — les segments restent
 * cliquables dans tous les cas, personne n’est privé du choix.
 */
export default function HeroCycle() {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const reduced = usePrefersReducedMotion();
  const tabVisible = useTabVisible();

  const running = !hovered && !reduced && tabVisible;

  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % WEDDING_STYLES.length), STEP_MS);
    return () => clearTimeout(timer);
  }, [index, running]);

  const style = WEDDING_STYLES[index];
  const go = useCallback((next: number) => setIndex(((next % WEDDING_STYLES.length) + WEDDING_STYLES.length) % WEDDING_STYLES.length), []);

  return (
    <div
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <TiltCard max={5}>
        <div className="vp-glass overflow-hidden rounded-[34px] p-2.5">
          <div className="flex items-center gap-2 px-2 pb-2.5 pt-1">
            <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5EA]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5EA]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5EA]" />
            <span className="vp-caption ml-2 truncate text-[11px]">Environnements</span>
            <span className="vp-num ml-auto text-[11px] font-semibold text-[var(--vp-muted)]">
              {String(index + 1).padStart(2, '0')} / {String(WEDDING_STYLES.length).padStart(2, '0')}
            </span>
          </div>

          {/* Visuels empilés : seul l’actif est visible, les autres attendent en léger zoom */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-[26px] bg-[#0B0C12]">
            {WEDDING_STYLES.map((s, i) => (
              <VisionImage
                key={s.id}
                src={s.image}
                alt={s.name}
                fallbackLabel={s.name}
                aura={s.aura}
                loading={i === 0 ? 'eager' : 'lazy'}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  i === index ? 'scale-100 opacity-100' : 'scale-[1.08] opacity-0'
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />

            {/* Gros titre de l’environnement */}
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={style.id}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: reduced ? 0.01 : 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">{style.tagline}</div>
                  <div className="vp-title mt-2 text-white" style={{ fontSize: 'clamp(2.2rem, 4.8vw, 3.4rem)' }}>
                    {style.name}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Segments : état du défilement et navigation directe */}
          <div className="mt-4 flex gap-1.5 px-1">
            {WEDDING_STYLES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => go(i)}
                aria-label={`Voir l’environnement ${s.name}`}
                aria-current={i === index}
                className="vp-press h-2 flex-1 overflow-hidden rounded-full bg-black/10 transition hover:bg-black/25"
              >
                <span
                  className={`block h-full rounded-full transition-colors duration-500 ${
                    i === index ? 'bg-[var(--vp-ink)]' : i < index ? 'bg-[var(--vp-ink)]/25' : 'bg-transparent'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-4">
            <p className="vp-caption max-w-[62%] !text-[12.5px] leading-snug">{style.manifesto}</p>
            <Link
              to="/creer"
              state={{ preselectedStyle: style.id }}
              className="vp-btn vp-btn-glass vp-press shrink-0 !px-4 !py-2.5 !text-[13px]"
            >
              Choisir <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </TiltCard>
    </div>
  );
}
