import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { WEDDING_STYLES, type WeddingStyle } from '../lib/weddingStyles';
import { cartesDesUnivers } from '../lib/cartesVivantes';
import { usePrefersReducedMotion } from '../lib/useReducedMotion';
import { useControlesDeBande } from '../lib/personaCourant';
import HeroCycle from './HeroCycle';
import BandeDuHero from './BandeDuHero';

/**
 * LE HERO DES UNIVERS — LE SECOND AXE, PRÉSENTÉ COMME LE PREMIER
 *
 * Sous le manifeste, les univers ont **leur hero**, exactement comme les rôles :
 * le nom de l'univers en grand, et **ses cartes juste en dessous** — pas de
 * bande blanche, pas de flèches (celles du dock mènent la bande). L'univers
 * défile tout seul, on peut l'arrêter en écoutant un morceau, et les cartes
 * montrent les autres.
 *
 * Un clic sur une carte **montre son hero** ; le play, lui, lance le média de
 * l'univers dans le hero, comme partout.
 */

interface HeroUniversProps {
  /** L'univers à l'écran. */
  styleId: string;
  /** Choisi : la page décide (elle garde l'univers pour tout le reste). */
  onChoisir: (style: WeddingStyle) => void;
  /** Un média occupe le hero : la page retient ses autres défilés. */
  onLecture?: (enLecture: boolean) => void;
}

export default function HeroUnivers({ styleId, onChoisir, onLecture }: HeroUniversProps) {
  const [lectureEnCours, setLectureEnCours] = useState(false);
  const reduced = usePrefersReducedMotion();

  const index = Math.max(0, WEDDING_STYLES.findIndex((s) => s.id === styleId));
  const style = WEDDING_STYLES[index] ?? WEDDING_STYLES[0]!;

  /** Gagner l'univers d'à côté, d'un cran. */
  const glisser = (pas: number) => {
    const suivant = WEDDING_STYLES[(index + pas + WEDDING_STYLES.length) % WEDDING_STYLES.length]!;
    onChoisir(suivant);
  };

  /**
   * **Les flèches du dock mènent la bande qu'on regarde** : quand ce hero est à
   * l'écran, c'est lui, et l'on gagne l'univers d'à côté ; quand on remonte vers
   * les rôles, ce sont les leurs qui reviennent.
   */
  const surveiller = useControlesDeBande('univers', {
    precedent: () => glisser(-1),
    suivant: () => glisser(1),
  });

  /** Le choix du défilé, lu au moment du déclenchement (pas dans une dépendance). */
  const choisirRef = useRef(onChoisir);
  useEffect(() => {
    choisirRef.current = onChoisir;
  }, [onChoisir]);

  /** Le défilé des univers : personne ne clique, et il avance tout seul. */
  useEffect(() => {
    if (reduced || lectureEnCours) return;
    const t = window.setTimeout(() => {
      choisirRef.current(WEDDING_STYLES[(index + 1) % WEDDING_STYLES.length]!);
    }, 5600);
    return () => window.clearTimeout(t);
  }, [index, reduced, lectureEnCours]);

  return (
    <div id="univers-hero" ref={surveiller}>
      <HeroCycle actifId={style.id}>
        <div className="flex flex-col items-center text-center">
          <span className="vp-eyebrow !text-white/70">Les univers</span>

          <div key={style.id} className="mt-4 flex flex-col items-center">
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="vp-title text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
              style={{ fontSize: 'clamp(2rem, 5.4vw, 4rem)', lineHeight: 1.04 }}
            >
              {style.name}
            </motion.h2>
            <p className="mx-auto mt-3 max-w-lg text-[15.5px] leading-relaxed text-white/75">
              {style.tagline}
            </p>
          </div>

          {/* LES CARTES DES UNIVERS, SOUS LE TITRE : le même geste que les rôles. */}
          <div className="mt-9 w-full sm:mt-11">
            <BandeDuHero
              premiere
              styleId={style.id}
              cartes={cartesDesUnivers(() => undefined, style.id)}
              onChoisir={(carte) => {
                const choisi = WEDDING_STYLES.find((s) => s.id === carte.id);
                if (choisi) onChoisir(choisi);
              }}
              onLecture={(enLecture) => {
                setLectureEnCours(enLecture);
                onLecture?.(enLecture);
              }}
            />
          </div>
        </div>
      </HeroCycle>
    </div>
  );
}
