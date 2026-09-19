import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { vendorsForStyles } from '../lib/weddingVendors';
import type { WeddingStyle } from '../lib/weddingStyles';
import { getComplementaryStyles } from '../lib/weddingStyles';

/**
 * HARMONIES & AFFINITÉS
 *
 * Une carte par personne, et rien d'autre que son métier et sa localisation.
 * Les portraits sont animés en continu — un lent mouvement de caméra, décalé
 * d'une carte à l'autre, pour que la grille respire au lieu d'être figée.
 */

interface ComplementaryThemesProps {
  currentStyle: WeddingStyle;
  onClaimRole?: (role: string) => void;
}

export default function ComplementaryThemes({ currentStyle, onClaimRole }: ComplementaryThemesProps) {
  const suggestions = getComplementaryStyles(currentStyle);
  const vendors = vendorsForStyles(suggestions);

  if (vendors.length === 0) return null;

  return (
    <section className="relative border-t border-black/5 bg-[#FAFAFA] px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--vp-muted)]">
            Harmonies &amp; Affinités
          </div>
          <h3 className="vp-title mt-2 text-[26px] text-[#0B0C12] sm:text-[34px]">
            Les prestataires qui font tourner ces univers.
          </h3>
          <p className="vp-body mt-1 text-[14px]">
            Chaque univers mobilise ses métiers. Voici ceux qui les réalisent —
            et il reste de la place pour vous, si c’est votre métier.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6">
          {vendors.map((vendor, i) => (
            <motion.div
              key={`${vendor.styleId}-${vendor.role}`}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              className="group overflow-hidden rounded-[24px] border border-black/10 bg-white p-2.5 shadow-sm transition-all hover:border-black/20 hover:shadow-xl"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[18px]">
                {/* Le portrait, animé comme un plan filmé */}
                <img
                  src={vendor.portrait}
                  alt={vendor.trade}
                  className="vp-live-frame h-full w-full object-cover"
                  style={{ animationDelay: `${(i % 6) * -2.7}s` }}
                />

                {/* La pastille de direct, discrète */}
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

                {/* La localisation du prestataire */}
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
      </div>
    </section>
  );
}
