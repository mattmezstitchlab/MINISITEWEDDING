import { motion } from 'framer-motion';
import { mapsUrl } from '../../lib/format';
import { useSiteView } from './context';
import { Eyebrow, SectionTitle, InfoIcon } from './primitives';

/** Parking, hébergements, dress code… une carte de verre par information. */
export default function Infos() {
  const { data, fonts, headWeight, accent, muted, ink, dark, glass, glassSpec, cardR, preview } = useSiteView();
  const infos = data.infos;

  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28" style={{ color: ink }}>
      <div className="mx-auto max-w-5xl">
        <Eyebrow>Tout ce qu’il faut savoir</Eyebrow>
        <SectionTitle>Informations pratiques</SectionTitle>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {infos.map((info, i) => (
            <motion.div key={info.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}>
              <div className={`${glass} ${glassSpec} vp-lift h-full p-7`} style={{ borderRadius: cardR }}>
                <span className="vp-glyph h-11 w-11 rounded-[15px]">
                  <InfoIcon category={info.category} />
                </span>
                <div className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: accent }}>{info.category}</div>
                {info.event_time && <div className="vp-num mt-1 text-[13.5px] font-semibold">{info.event_time}</div>}
                <div className="mt-1 text-[19px]" style={{ fontFamily: fonts.heading, fontWeight: headWeight, letterSpacing: '-0.022em' }}>{info.title}</div>
                {info.detail && <p className={`mt-2 text-[14px] leading-relaxed ${dark ? 'text-white/65' : 'text-[var(--vp-ink-soft)]'}`}>{info.detail}</p>}
                {info.link_label && !preview && (
                  <a href={mapsUrl(`${info.title} ${info.detail}`)} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-medium underline underline-offset-4" style={{ color: accent }}>
                    {info.link_label}
                  </a>
                )}
              </div>
            </motion.div>
          ))}
          {infos.length === 0 && <p className="col-span-full py-8 text-center" style={{ color: muted }}>Les informations arrivent bientôt.</p>}
        </div>
      </div>
    </section>
  );
}
