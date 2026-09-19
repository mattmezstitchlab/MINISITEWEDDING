import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import type { WeddingStyle } from '../lib/weddingStyles';
import { getComplementaryStyles } from '../lib/weddingStyles';
import { vendorsFor } from '../lib/weddingVendors';

/**
 * HARMONIES & AFFINITÉS
 *
 * Les univers qui matchent avec celui du couple — mais vus par les personnes :
 * chaque carte montre les prestataires qui font tourner cet univers, leur
 * portrait et leur métier. On ne découvre plus une ambiance, on découvre qui
 * la réalise, et on peut revendiquer le rôle.
 */

interface ComplementaryThemesProps {
  currentStyle: WeddingStyle;
  onSelectStyle: (style: WeddingStyle) => void;
  onClaimRole?: (role: string) => void;
}

export default function ComplementaryThemes({
  currentStyle,
  onSelectStyle,
  onClaimRole,
}: ComplementaryThemesProps) {
  const suggestions = getComplementaryStyles(currentStyle);

  if (suggestions.length === 0) return null;

  return (
    <section className="relative px-5 py-16 sm:px-8 sm:py-24 bg-[#FAFAFA] border-t border-black/5">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--vp-muted)]">
              Harmonies &amp; Affinités
            </div>
            <h3 className="vp-title mt-2 text-[26px] sm:text-[34px] text-[#0B0C12]">
              Les prestataires qui font tourner ces univers.
            </h3>
            <p className="vp-body mt-1 text-[14px]">
              Chaque univers mobilise ses métiers. Voici ceux qui les réalisent —
              et il reste de la place pour vous, si c’est votre métier.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestions.map((item) => {
            const vendors = vendorsFor(item);
            const lead = vendors[0];

            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="group overflow-hidden rounded-[26px] border border-black/10 bg-white p-3 shadow-sm hover:shadow-xl hover:border-black/20 transition-all"
              >
                {/* Les personnes qui réalisent cet univers */}
                <div className="grid grid-cols-3 gap-1.5">
                  {vendors.map((vendor) => (
                    <div key={vendor.role} className="relative aspect-[3/4] overflow-hidden rounded-[16px]">
                      <img
                        src={vendor.portrait}
                        alt={vendor.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                      <span
                        className="absolute left-1.5 top-1.5 h-2 w-2 rounded-full"
                        style={{ background: item.accent }}
                      />
                      <div className="absolute inset-x-1.5 bottom-1.5">
                        <div className="truncate text-[10.5px] font-bold leading-tight text-white">
                          {vendor.name}
                        </div>
                        <div className="truncate text-[8.5px] leading-tight text-white/70">
                          {vendor.trade}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* L'univers qu'ils composent */}
                <div className="px-1 pt-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[17px] font-bold text-[#0B0C12]">{item.name}</div>
                    <span className="shrink-0 rounded-full bg-black/5 px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-[var(--vp-muted)]">
                      Harmonie recommandée
                    </span>
                  </div>
                  <p className="mt-1 text-[12.5px] text-[var(--vp-muted)] line-clamp-2">{item.tagline}</p>

                  {lead && (
                    <div className="mt-2.5 flex items-start gap-1.5 rounded-[12px] bg-black/[0.03] px-2.5 py-2 text-[11px] text-[var(--vp-muted)]">
                      <Check size={12} className="mt-[2px] shrink-0 text-emerald-600" />
                      <span>
                        <span className="font-semibold text-[#0B0C12]">{lead.trade}</span> — {lead.specialty}
                      </span>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-black/5 pt-3">
                    <button
                      type="button"
                      onClick={() => onClaimRole?.(lead?.role)}
                      className="flex items-center gap-1.5 rounded-full border border-black/15 px-3 py-1.5 text-[11.5px] font-semibold text-[#0B0C12] transition hover:border-black hover:bg-black hover:text-white"
                    >
                      Revendiquer
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectStyle(item);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex items-center gap-1 text-[11.5px] font-semibold text-[#0B0C12] transition group-hover:translate-x-0.5"
                    >
                      Voir l’univers <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
