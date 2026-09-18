import { useRef } from 'react';
import type { ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxSectionProps {
  image: string;
  overlayOpacity?: number;
  children: ReactNode;
  heightClass?: string;
  speed?: number; // 0.2 à 0.5
}

export default function ParallaxSection({
  image,
  overlayOpacity = 0.45,
  children,
  heightClass = 'min-h-[70vh]',
  speed = 0.25,
}: ParallaxSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${speed * 100}%`, `${speed * 100}%`]
  );

  return (
    <section
      ref={containerRef}
      className={`relative flex items-center justify-center overflow-hidden ${heightClass}`}
    >
      {/* Arrière-plan Parallax */}
      <motion.div
        style={{ y }}
        className="absolute -top-[30%] left-0 right-0 h-[160%] w-full"
      >
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
      </motion.div>

      {/* Contenu textuel flottant */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 py-20 text-center text-white sm:px-8">
        {children}
      </div>
    </section>
  );
}
