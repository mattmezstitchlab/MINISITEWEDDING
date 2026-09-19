import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WEDDING_STYLES } from '../lib/weddingStyles';
import { usePrefersReducedMotion } from '../lib/useReducedMotion';
import VisionImage from './vision/VisionImage';

/**
 * LE HERO — UN VISUEL QUI SE FOND DANS LE SUIVANT
 *
 * Le hero ne sait rien de ce qu'il montre : on lui donne des **visuels**, et
 * celui qui est actif. Il les présente comme un plateau de télévision : **le
 * rôle arrive de la gauche, le suivant de la droite**, glisse jusqu'au centre et
 * respire là, face à nous — puis il sort du côté opposé. On regarde un
 * personnage entrer en scène, pas une image changer.
 *
 * Il ne décide de rien : ni de ce qui défile, ni quand. C'est la page qui mène
 * l'index — parce que c'est elle qui sait ce qui défile (les personnages, les
 * univers), et ce qui doit s'arrêter quand un média joue.
 */

export interface VisuelHero {
  id: string;
  image: string;
  /** Les couleurs du dégradé de secours, si le visuel manque. */
  aura?: string[];
  /** Ce qui s'écrit sur le dégradé de secours. */
  nom: string;
}

interface HeroCycleProps {
  children?: ReactNode;
  /** Ce que le hero traverse. Par défaut, les univers du site. */
  visuels?: VisuelHero[];
  /** Celui qui est à l'écran. */
  actifId?: string;
  className?: string;
}

export default function HeroCycle({
  children,
  visuels = WEDDING_STYLES.map((s) => ({ id: s.id, image: s.image, aura: s.aura, nom: s.name })),
  actifId,
  className = '',
}: HeroCycleProps) {
  const reduced = usePrefersReducedMotion();
  const courant = Math.max(0, visuels.findIndex((v) => v.id === actifId));
  const visuel = visuels[courant] ?? visuels[0];

  /**
   * Le sens de l'arrivée : **un rôle sur deux entre par la gauche** (−1), puis
   * par la droite (+1) — le défilé du plateau, gauche, droite, gauche. Il vient
   * de la place dans la liste, jamais d'un état à tenir à jour.
   */
  const sens = courant % 2 === 0 ? -1 : 1;

  return (
    <header className={`relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-[#0B0C12] px-5 py-24 sm:px-8 ${className}`}>
      {/* Le rôle entre en scène : il glisse depuis un côté, puis respire */}
      <div className="absolute inset-0" aria-hidden="true">
        <AnimatePresence initial={false} custom={sens} mode="popLayout">
          <motion.div
            key={visuel?.id ?? 'aucun'}
            data-direction={sens > 0 ? 'droite' : 'gauche'}
            className="absolute inset-0"
            initial={{ x: reduced ? 0 : `${sens * 16}%`, opacity: 0 }}
            animate={{ x: '0%', opacity: 1 }}
            exit={{ x: reduced ? 0 : `${sens * -12}%`, opacity: 0 }}
            transition={{ duration: reduced ? 0.01 : 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Il respire tant qu'il est à l'écran */}
            <motion.div
              className="h-full w-full"
              initial={{ scale: 1.04 }}
              animate={{ scale: reduced ? 1.02 : 1.12 }}
              transition={{ duration: 9, ease: 'linear' }}
            >
              <VisionImage
                src={visuel?.image ?? ''}
                alt=""
                aura={visuel?.aura}
                fallbackLabel={visuel?.nom ?? ''}
                loading="eager"
                className="h-full w-full object-cover"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
        {/* Les voiles : ils tiennent la lisibilité du texte, quelle que soit la photo */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/65" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl">{children}</div>
    </header>
  );
}
