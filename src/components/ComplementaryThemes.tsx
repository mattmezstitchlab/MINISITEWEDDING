import { motion } from 'framer-motion';
import { ArrowRight, Users } from 'lucide-react';
import type { WeddingStyle } from '../lib/weddingStyles';
import { getComplementaryStyles } from '../lib/weddingStyles';

interface ComplementaryThemesProps {
  currentStyle: WeddingStyle;
  onSelectStyle: (style: WeddingStyle) => void;
}

export default function ComplementaryThemes({
  currentStyle,
  onSelectStyle,
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
              Vous pourriez aussi aimer ces univers complémentaires.
            </h3>
            <p className="vp-body mt-1 text-[14px]">
              Styles suggérés pour matcher avec l’énergie de <span className="font-semibold text-[#0B0C12]">{currentStyle.name}</span>.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestions.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              onClick={() => {
                onSelectStyle(item);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer group overflow-hidden rounded-[26px] border border-black/10 bg-white p-3 shadow-sm hover:shadow-xl hover:border-black/20 transition-all"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[20px]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
                      Harmonie recommandée
                    </div>
                    <div className="text-[17px] font-bold">{item.name}</div>
                  </div>
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ background: item.accent }}
                  />
                </div>
              </div>

              <div className="p-3">
                <p className="text-[12.5px] text-[var(--vp-muted)] line-clamp-2">
                  {item.tagline}
                </p>

                <div className="mt-3 pt-3 border-t border-black/5 flex items-center justify-between text-[11.5px]">
                  <span className="flex items-center gap-1 text-[var(--vp-muted)]">
                    <Users size={12} />
                    <span>{item.humanMissions.length} métiers associés</span>
                  </span>
                  <span className="font-semibold text-[#0B0C12] group-hover:translate-x-0.5 transition flex items-center gap-1">
                    Découvrir <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
