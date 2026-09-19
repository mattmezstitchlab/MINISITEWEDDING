import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
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
interface HeroCycleProps {
  children?: ReactNode;
  activeStyleId?: string;
  /** La bande de navigation, posée en bas du hero, toujours au même endroit. */
  bas?: ReactNode;
}

export default function HeroCycle({ children, activeStyleId, bas }: HeroCycleProps) {
  const [index, setIndex] = useState(0);
  const reduced = usePrefersReducedMotion();
  const tabVisible = useTabVisible();

  // Un univers choisi par la bande se montre tout de suite : il n'y a rien à
  // synchroniser, l'index se déduit du choix.
  const impose = activeStyleId ? WEDDING_STYLES.findIndex((s) => s.id === activeStyleId) : -1;
  const courant = impose === -1 ? index : impose;

  const running = !reduced && tabVisible && !activeStyleId;

  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % WEDDING_STYLES.length), STEP_MS);
    return () => clearTimeout(timer);
  }, [index, running]);

  return (
    <header
      className={`relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-[#0B0C12] px-5 pt-24 sm:px-8 ${
        bas ? 'pb-[264px] sm:pb-[300px]' : 'pb-24'
      }`}
    >
      {/* Visuels plein écran, en fondu enchaîné, avec un léger souffle */}
      <div className="absolute inset-0" aria-hidden="true">
        {WEDDING_STYLES.map((s, i) => (
          <motion.div
            key={s.id}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === courant ? 1 : 0 }}
            transition={{ duration: reduced ? 0.01 : 1.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Seul le visuel affiché respire */}
            <motion.div
              className="h-full w-full"
              initial={false}
              animate={{ scale: i === courant && !reduced ? 1.12 : 1.02 }}
              transition={{ duration: i === courant ? 9 : 0.6, ease: 'linear' }}
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
        {/* Voiles d'assombrissement pour garantir la lisibilité du titre centré */}
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
      </div>

      {/* Titre centré */}
      <div className="relative z-10 mx-auto w-full max-w-4xl">{children}</div>

      {/* La bande du hero : la navigation de la page, au même endroit partout. */}
      {bas && (
        <div className="absolute inset-x-0 bottom-0 z-20 pb-5 sm:pb-7">
          <div className="vp-page">{bas}</div>
        </div>
      )}
    </header>
  );
}
