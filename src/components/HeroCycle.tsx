import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { WEDDING_STYLES } from '../lib/weddingStyles';
import { usePrefersReducedMotion } from '../lib/useReducedMotion';
import VisionImage from './vision/VisionImage';

/**
 * LE HERO — UN VISUEL QUI SE FOND DANS LE SUIVANT
 *
 * Le hero ne sait rien de ce qu'il montre : on lui donne des **visuels**, et
 * celui qui est actif. Il les enchaîne en fondu, fait respirer doucement celui
 * qui est à l'écran, et pose le contenu de la page par-dessus.
 *
 * Il ne décide de rien : ni de ce qui défile, ni quand. C'est la page qui mène
 * l'index — parce que c'est elle qui sait ce qui défile (les univers, les
 * personnages), et ce qui doit s'arrêter quand un média joue.
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

  return (
    <header className={`relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-[#0B0C12] px-5 py-24 sm:px-8 ${className}`}>
      {/* Les visuels plein cadre, en fondu enchaîné, avec un léger souffle */}
      <div className="absolute inset-0" aria-hidden="true">
        {visuels.map((v, i) => (
          <motion.div
            key={v.id}
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
                src={v.image}
                alt=""
                aura={v.aura}
                fallbackLabel={v.nom}
                loading={i === 0 ? 'eager' : 'lazy'}
                className="h-full w-full object-cover"
              />
            </motion.div>
          </motion.div>
        ))}
        {/* Les voiles : ils tiennent la lisibilité du texte, quelle que soit la photo */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/65" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl">{children}</div>
    </header>
  );
}
