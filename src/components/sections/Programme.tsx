import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useSiteView } from './context';
import { Eyebrow, SectionTitle } from './primitives';

/** Timeline du Jour J, en alternance gauche/droite sur grand écran. */
export default function Programme() {
  const { data, fonts, headWeight, accent, muted, ink, dark, glass, glassSpec } = useSiteView();
  const programme = data.programme;

  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28" style={{ color: ink }}>
      <div className="mx-auto max-w-3xl">
        <Eyebrow>Programme du Jour J</Eyebrow>
        <SectionTitle>Le déroulé de la journée</SectionTitle>
        <div className="relative mt-14">
          <div className="absolute bottom-2 left-[19px] top-2 w-px sm:left-1/2" style={{ background: dark ? 'rgba(255,255,255,0.14)' : 'rgba(12,14,24,0.1)' }} />
          {programme.map((ev, i) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className={`relative flex gap-6 pb-6 last:pb-0 sm:gap-0 sm:pb-10 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
            >
              <div className="sm:w-1/2 sm:px-10">
                <div className={`${glass} ${glassSpec} vp-lift rounded-[24px] p-6`} style={{ textAlign: 'left' }}>
                  <div className="vp-num text-[13px] font-semibold tracking-[0.18em]" style={{ color: accent }}>{ev.event_time}</div>
                  <div className="mt-1.5 text-[22px]" style={{ fontFamily: fonts.heading, fontWeight: headWeight, letterSpacing: '-0.025em' }}>{ev.title}</div>
                  {ev.description && <p className={`mt-2 text-[14.5px] leading-relaxed ${dark ? 'text-white/65' : 'text-[var(--vp-ink-soft)]'}`}>{ev.description}</p>}
                  {ev.place && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 text-[13.5px]" style={{ color: muted }}>
                      <MapPin size={14} />{ev.place}
                    </div>
                  )}
                </div>
              </div>
              <div
                className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border"
                style={{ background: dark ? 'rgba(20,22,32,0.9)' : 'rgba(255,255,255,0.9)', borderColor: dark ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.7)', backdropFilter: 'blur(18px)', boxShadow: 'var(--vp-depth-1)' }}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: accent, boxShadow: `0 0 12px ${accent}` }} />
              </div>
              <div className="hidden sm:block sm:w-1/2" />
            </motion.div>
          ))}
          {programme.length === 0 && <p className="py-8 text-center" style={{ color: muted }}>Le programme sera dévoilé très bientôt.</p>}
        </div>
      </div>
    </section>
  );
}
