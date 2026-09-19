import { motion } from 'framer-motion';
import { vendorsForStyles } from '../lib/weddingVendors';
import type { WeddingStyle } from '../lib/weddingStyles';
import { getComplementaryStyles } from '../lib/weddingStyles';

/**
 * HARMONIES & AFFINITÉS
 *
 * Une carte par personne, et rien d'autre que son métier : le portrait, le nom
 * du métier, et « Revendiquer ». Ni le nom du prestataire, ni celui de son
 * univers ne s'affichent — l'univers voyage dans le lien, pour arriver sur le
 * bon questionnaire.
 */

interface ComplementaryThemesProps {
  currentStyle: WeddingStyle;
  onClaimRole?: (role: string) => void;
}

export default function ComplementaryThemes({
  currentStyle,
  onClaimRole,
}: ComplementaryThemesProps) {
  const suggestions = getComplementaryStyles(currentStyle);
  const vendors = vendorsForStyles(suggestions);

  if (vendors.length === 0) return null;

  return (
    <section className="relative px-5 py-16 sm:px-8 sm:py-24 bg-[#FAFAFA] border-t border-black/5">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
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

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-6">
          {vendors.map((vendor) => (
            <motion.div
              key={`${vendor.styleId}-${vendor.role}`}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              className="group overflow-hidden rounded-[24px] border border-black/10 bg-white p-2.5 shadow-sm hover:shadow-xl hover:border-black/20 transition-all"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[18px]">
                <img
                  src={vendor.portrait}
                  alt={vendor.trade}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />
                <span
                  className="absolute left-2 top-2 h-2.5 w-2.5 rounded-full ring-2 ring-white/60"
                  style={{ background: vendor.accent }}
                />
              </div>

              <div className="px-1 pb-0.5 pt-3">
                <div className="text-[13.5px] font-bold leading-tight text-[#0B0C12]">
                  {vendor.trade}
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
