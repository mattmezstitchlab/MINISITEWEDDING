import { useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

/**
 * Fonde de dégradé : l’image de secours quand un visuel manque.
 * Elle reprend la grammaire visionOS (halos flous, courbure continue).
 */
export function AuraFallback({ colors, className, style, label }: { colors?: string[]; className?: string; style?: CSSProperties; label?: string }) {
  const [c1, c2, c3] = colors ?? ['#EDEEF1', '#F7F8FA', '#E4E6EB'];
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className ?? ''}`}
      style={{ background: `linear-gradient(150deg, ${c1}, ${c2} 52%, ${c3})`, ...style }}
      aria-hidden="true"
    >
      <div className="absolute -left-[10%] -top-[15%] h-[70%] w-[70%] rounded-full opacity-45 blur-[70px]" style={{ background: c1 }} />
      <div className="absolute -bottom-[20%] -right-[10%] h-[80%] w-[80%] rounded-full opacity-40 blur-[80px]" style={{ background: c3 }} />
      {label && (
        <span className="relative z-[2] text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0B0C12]/35">
          {label}
        </span>
      )}
    </div>
  );
}

interface VisionImageProps {
  src?: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  loading?: 'lazy' | 'eager';
  aura?: string[];
  /** Étiquette affichée sur le dégradé de secours */
  fallbackLabel?: string;
}

/**
 * Image tolérante : si le fichier est absent (404), un dégradé spatial
 * prend le relais au lieu d’un cadre cassé.
 */
export default function VisionImage({ src, alt, className, style, loading = 'lazy', aura, fallbackLabel }: VisionImageProps) {
  const [failed, setFailed] = useState(false);
  const key = useMemo(() => src ?? '', [src]);

  if (!src || failed) {
    return <AuraFallback colors={aura} className={className} style={style} label={fallbackLabel ?? alt} />;
  }

  return (
    <img
      key={key}
      src={src}
      alt={alt}
      loading={loading}
      onError={() => setFailed(true)}
      className={className}
      style={style}
    />
  );
}

/**
 * Cadre photo : l’image seule, à 100 %.
 * Ni voile blanc, ni liseré, ni reflet spéculaire, ni ombre portée.
 */
export function VisionFrame({
  children,
  radius = 22,
  className = '',
  style,
}: {
  children: ReactNode;
  radius?: number | string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ borderRadius: radius, ...style }}>
      {children}
    </div>
  );
}

/**
 * Carte à inclinaison spatiale : suit le pointeur en 3D (léger),
 * désactivée si l’utilisateur préfère les animations réduites.
 */
export function TiltCard({
  children,
  className = '',
  style,
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1200px) rotateY(${px * max}deg) rotateX(${-py * max}deg) translateY(-6px) scale(1.012)`;
    el.style.setProperty('--vp-mx', `${(px + 0.5) * 100}%`);
    el.style.setProperty('--vp-my', `${(py + 0.5) * 100}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = '';
  };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`vp-tilt ${className}`} style={style}>
      {children}
    </div>
  );
}
