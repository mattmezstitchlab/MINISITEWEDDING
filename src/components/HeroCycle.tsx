import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { WEDDING_STYLES } from '../lib/weddingStyles';
import { usePrefersReducedMotion, useTabVisible } from '../lib/useReducedMotion';
import VisionImage from './vision/VisionImage';

/** Millisecondes passées sur chaque environnement. */
const STEP_MS = 5600;

/**
 * Hero plein écran : les dix environnements en fond, chacun avec son gros
 * titre.
 *
 * Le visuel couvre toute la hauteur ; le pitch du produit (`children`) est posé
 * en haut, le titre de l’univers en bas. Deux dégradés garantissent la lisibilité
 * du texte quelle que soit la photo.
 *
 * Le défilement s’arrête dès que le pointeur entre dans le hero, qu’un élément
 * reçoit le focus, que l’onglet passe en arrière-plan ou que l’utilisateur
 * demande des animations réduites — les segments et les flèches restent
 * cliquables dans tous les cas.
 */
export default function HeroCycle({ children }: { children?: ReactNode }) {
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

  const go = useCallback(
    (next: number) => setIndex(((next % WEDDING_STYLES.length) + WEDDING_STYLES.length) % WEDDING_STYLES.length),
    []
  );

  const style = WEDDING_STYLES[index];
  const words = style.name.split(' ');

  return (
    <header
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-[#0B0C12] px-5 pb-8 pt-28 sm:px-8 sm:pb-10 sm:pt-32"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {/* Visuels plein écran, en fondu enchaîné, avec un léger souffle */}
      <div className="absolute inset-0" aria-hidden="true">
        {WEDDING_STYLES.map((s, i) => (
          <motion.div
            key={s.id}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === index ? 1 : 0 }}
            transition={{ duration: reduced ? 0.01 : 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Seul le visuel affiché respire : inutile d’animer les neuf autres */}
            <motion.div
              className="h-full w-full"
              initial={false}
              animate={{ scale: i === index && !reduced ? 1.14 : 1.04 }}
              transition={{ duration: i === index ? 9 : 0.6, ease: 'linear' }}
            >
              <VisionImage
                src={s.image}
                alt=""
                aura={s.aura}
                fallbackLabel={s.name}
                loading={i === 0 ? 'eager' : 'lazy'}
                className="h-full w-full object-cover"
              />
            </motion.div>
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/55 to-black/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-transparent" />
      </div>

      {/* Pitch du produit */}
      <div className="relative z-10 mx-auto w-full max-w-6xl text-white">{children}</div>

      {/* Gros titre de l’environnement + navigation */}
      <div className="relative z-10 mx-auto mt-14 w-full max-w-6xl sm:mt-20">
        <div className="flex items-end justify-between gap-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 shrink-0 rounded-full transition-colors duration-700" style={{ background: style.accent }} />
              <span className="truncate text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70 sm:tracking-[0.28em]">
                {style.tagline}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.h2
                key={style.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0.01 : 0.25 }}
                className="vp-title mt-3 select-none text-white"
                style={{ fontSize: 'clamp(2.9rem, 10.5vw, 8rem)', lineHeight: 0.86, letterSpacing: '-0.045em' }}
              >
                {words.map((word, i) => (
                  <span key={`${word}-${i}`} className="block overflow-hidden pb-[0.06em]">
                    <motion.span
                      className="block"
                      initial={{ y: '108%' }}
                      animate={{ y: 0 }}
                      transition={{ duration: reduced ? 0.01 : 0.85, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </motion.h2>
            </AnimatePresence>
          </div>

          <div className="hidden shrink-0 flex-col items-end gap-3 pb-2 sm:flex">
            <span className="vp-num text-[12px] font-semibold tracking-widest text-white/55">
              {String(index + 1).padStart(2, '0')} / {String(WEDDING_STYLES.length).padStart(2, '0')}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Environnement précédent"
                className="vp-press flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
              >
                <ChevronLeft size={17} />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Environnement suivant"
                className="vp-press flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-5 border-t border-white/15 pt-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Segments : état du défilement et accès direct à chaque univers */}
          <div className="flex flex-1 gap-1.5">
            {WEDDING_STYLES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => go(i)}
                aria-label={`Voir l’environnement ${s.name}`}
                aria-current={i === index}
                className="vp-press group h-2.5 flex-1 overflow-hidden rounded-full bg-white/20 transition hover:bg-white/35"
              >
                <span
                  className="block h-full rounded-full transition-colors duration-700"
                  style={{ background: i === index ? s.accent : i < index ? 'rgba(255,255,255,0.5)' : 'transparent' }}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <p className="hidden max-w-[15rem] text-[12.5px] leading-snug text-white/60 xl:block">{style.manifesto}</p>
            <Link
              to="/creer"
              state={{ preselectedStyle: style.id }}
              className="vp-btn vp-press shrink-0 !px-6 !py-3.5 !text-[14px]"
              style={{ background: style.accent, color: style.dark ? '#0B0C12' : '#FFFFFF' }}
            >
              Choisir cet univers <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
