import { motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';
import { formatDateLong } from '../../lib/format';
import VisionImage, { VisionFrame } from '../vision/VisionImage';
import { useSiteView } from './context';
import { Eyebrow, SectionTitle } from './primitives';

/** L’histoire du couple, en photo et en texte. */
export default function Story() {
  const { site, theme, accent, muted, ink, dark, glass, glassSpec, cardR, daysLeft } = useSiteView();

  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28" style={{ color: ink }}>
      <div className="mx-auto max-w-5xl">
        <Eyebrow>Notre histoire</Eyebrow>
        <SectionTitle>{site.story_title || 'Tout a commencé par un regard'}</SectionTitle>
        <div className="mt-12 grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8 }}>
            <VisionFrame radius={cardR}>
              <VisionImage src={site.story_photo || theme.image} alt="Notre histoire" aura={theme.aura} className="aspect-[4/5] w-full object-cover" />
            </VisionFrame>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8 }}>
            <div className={`${glass} ${glassSpec} rounded-[28px] p-7 sm:p-9`}>
              {(site.story_text || '').split('\n\n').filter(Boolean).map((p, i) => (
                <p key={i} className={`text-[16px] leading-[1.75] sm:text-[17px] ${i > 0 ? 'mt-5' : ''} ${dark ? 'text-white/78' : 'text-[var(--vp-ink-soft)]'}`} style={i === 0 ? { fontSize: '1.1em' } : undefined}>
                  {p}
                </p>
              ))}
              {daysLeft > 0 && (
                <div className="mt-7 inline-flex items-center gap-3 rounded-full border px-4 py-2.5" style={{ borderColor: `${accent}33`, background: `${accent}10` }}>
                  <CalendarDays size={17} style={{ color: accent }} />
                  <span className="text-[13.5px] font-medium" style={{ color: muted }}>
                    <span className="vp-num">J-{daysLeft}</span> avant le grand jour — {formatDateLong(site.wedding_date)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
