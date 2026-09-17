import { motion } from 'framer-motion';
import { Gift, Check } from 'lucide-react';
import { useSiteView } from './context';
import { SectionTitle } from './primitives';

/** Liste de mariage et cagnottes, avec progression vers l’objectif. */
export default function Gifts() {
  const { data, fonts, headWeight, accent, muted, ink, dark, glass, glassSpec, btnR, cardR, preview, giftThanks, setGiftThanks } = useSiteView();
  const gifts = data.gifts;

  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28" style={{ color: ink }}>
      <div className="mx-auto max-w-4xl text-center">
        <span className="vp-glyph mx-auto flex h-14 w-14 items-center justify-center rounded-[20px]">
          <Gift size={24} strokeWidth={1.8} />
        </span>
        <SectionTitle>Liste de mariage</SectionTitle>
        <p className="mx-auto mt-4 max-w-xl text-[17px] italic" style={{ fontFamily: fonts.heading, color: muted }}>
          « Nous préférons créer des souvenirs plutôt que recevoir des objets. »
        </p>
        <div className="mt-10 grid gap-5 text-left sm:grid-cols-2">
          {gifts.map((g) => {
            const goal = Number(g.goal_amount) || 0;
            const current = Number(g.current_amount) || 0;
            const pct = goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0;
            return (
              <motion.div key={g.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.6 }}>
                <div className={`${glass} ${glassSpec} vp-lift h-full p-7`} style={{ borderRadius: cardR }}>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: accent }}>{g.gift_type}</div>
                  <div className="mt-2 text-[22px]" style={{ fontFamily: fonts.heading, fontWeight: headWeight, letterSpacing: '-0.025em' }}>{g.title}</div>
                  {g.description && <p className={`mt-2 text-[14px] leading-relaxed ${dark ? 'text-white/65' : 'text-[var(--vp-ink-soft)]'}`}>{g.description}</p>}
                  {goal > 0 && (
                    <div className="mt-5">
                      <div className="vp-num mb-2 flex justify-between text-[13.5px]">
                        <span className="font-semibold">{current.toLocaleString('fr-FR')} €</span>
                        <span style={{ color: muted }}>sur {goal.toLocaleString('fr-FR')} €</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full" style={{ background: dark ? 'rgba(255,255,255,0.12)' : 'rgba(12,14,24,0.08)' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${accent}, ${accent}cc)`, boxShadow: `0 0 14px ${accent}88` }}
                        />
                      </div>
                    </div>
                  )}
                  {!preview && (
                    giftThanks === g.id ? (
                      <div className="mt-5 flex items-center gap-2 text-[14px] font-medium" style={{ color: accent }}><Check size={16} /> Merci infiniment pour votre attention.</div>
                    ) : (
                      <button
                        onClick={() => setGiftThanks(g.id)}
                        className="vp-press mt-5 w-full py-3.5 text-[14.5px] font-semibold text-white"
                        style={{ background: accent, borderRadius: btnR, boxShadow: `0 14px 30px -16px ${accent}, inset 0 1px 0 rgba(255,255,255,0.28)` }}
                      >
                        Participer
                      </button>
                    )
                  )}
                </div>
              </motion.div>
            );
          })}
          {gifts.length === 0 && <p className="col-span-full py-8 text-center" style={{ color: muted }}>La liste sera partagée très bientôt.</p>}
        </div>
      </div>
    </section>
  );
}
