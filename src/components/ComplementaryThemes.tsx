import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Pause, Play } from 'lucide-react';
import { useState } from 'react';
import { vendorsForStyles } from '../lib/weddingVendors';
import type { WeddingStyle } from '../lib/weddingStyles';
import { getComplementaryStyles } from '../lib/weddingStyles';

/**
 * HARMONIES & AFFINITÉS
 *
 * Une seule bande, une seule ligne : les cartes des prestataires qui font
 * tourner ces univers, qui défilent lentement — et qu'on arrête d'un clic.
 * Le portrait est animé comme un plan filmé, la bande avance toute seule,
 * s'arrête au survol, et se reprend quand on la laisse.
 */

interface ComplementaryThemesProps {
  currentStyle: WeddingStyle;
  onClaimRole?: (role: string) => void;
}

/** La vitesse du défilement : lente, et réglable d'un clic. */
const VITESSE = 0.4;

export default function ComplementaryThemes({ currentStyle, onClaimRole }: ComplementaryThemesProps) {
  const suggestions = getComplementaryStyles(currentStyle);
  const vendors = vendorsForStyles(suggestions);
  const bande = useRef<HTMLDivElement>(null);
  const [defile, setDefile] = useState(true);
  const [suspendu, setSuspendu] = useState(false);

  // Le défilement continu : la bande avance d'un demi-pixel par image, et
  // repart au début quand elle a tout montré. Aucune interaction ne la casse :
  // le visiteur peut la faire glisser à la main, elle reprend ensuite.
  useEffect(() => {
    if (!defile || suspendu) return;
    const el = bande.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let position = el.scrollLeft;
    const avancer = () => {
      position += VITESSE;
      const fin = el.scrollWidth - el.clientWidth;
      if (fin <= 0) {
        frame = requestAnimationFrame(avancer);
        return;
      }
      if (position >= fin - 1) position = 0;
      el.scrollLeft = position;
      frame = requestAnimationFrame(avancer);
    };
    frame = requestAnimationFrame(avancer);
    return () => cancelAnimationFrame(frame);
  }, [defile, suspendu]);

  if (vendors.length === 0) return null;

  return (
    <section className="relative border-t border-black/5 bg-[#FAFAFA] py-16 sm:py-24">
      <div className="vp-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--vp-muted)]">
              Harmonies &amp; Affinités
            </div>
            <h3 className="vp-title mt-2 text-[26px] text-[#0B0C12] sm:text-[34px]">
              Les métiers qui font tourner ces univers.
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              setDefile((v) => !v);
              setSuspendu(false);
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-black/12 px-3.5 py-1.5 font-mono text-[10.5px] uppercase tracking-wider text-black/55 transition hover:border-black/30 hover:text-black"
          >
            {defile ? <Pause size={11} /> : <Play size={11} />}
            {defile ? 'Mettre en pause' : 'Faire défiler'}
          </button>
        </div>
      </div>

      {/* La bande : une seule ligne, qui défile toute seule */}
      <div
        ref={bande}
        onPointerEnter={() => setSuspendu(true)}
        onPointerLeave={() => setSuspendu(false)}
        onTouchStart={() => setSuspendu(true)}
        className="no-scrollbar mt-8 flex gap-5 overflow-x-auto px-5 pb-2 sm:px-8"
      >
        {vendors.map((vendor, i) => (
          <motion.div
            key={`${vendor.styleId}-${vendor.role}`}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            className="group w-[220px] shrink-0 overflow-hidden rounded-[24px] border border-black/10 bg-white p-2.5 shadow-sm transition-all hover:border-black/20 hover:shadow-xl sm:w-[244px]"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-[18px]">
              {/* Le portrait, animé comme un plan filmé */}
              <img
                src={vendor.portrait}
                alt={vendor.trade}
                className="vp-live-frame h-full w-full object-cover object-top"
                style={{ animationDelay: `${(i % 6) * -2.7}s` }}
              />

              <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/55 px-1.5 py-0.5 backdrop-blur-sm">
                <span className="vp-live-dot h-1.5 w-1.5 rounded-full bg-red-500" />
                <span className="font-mono text-[7.5px] font-bold uppercase tracking-wider text-white/85">
                  live
                </span>
              </span>

              <span
                className="absolute left-2 top-2 h-2.5 w-2.5 rounded-full ring-2 ring-white/60"
                style={{ background: vendor.accent }}
              />
            </div>

            <div className="px-1 pb-0.5 pt-3">
              <div className="text-[13.5px] font-bold leading-tight text-[#0B0C12]">{vendor.trade}</div>

              <div className="mt-1 flex items-center gap-1 text-[11px] text-[var(--vp-muted)]">
                <MapPin size={11} className="shrink-0" />
                <span className="truncate">{vendor.location}</span>
              </div>

              <button
                type="button"
                onClick={() => onClaimRole?.(vendor.role)}
                className="mt-2.5 w-full rounded-full border border-black/15 px-3 py-1.5 text-[11.5px] font-semibold text-[#0B0C12] transition hover:border-black hover:bg-black hover:text-white"
              >
                Revendiquer
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
