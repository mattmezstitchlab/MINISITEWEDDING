import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import { mapsUrl } from '../../lib/format';
import VisionImage from '../vision/VisionImage';
import { useSiteView } from './context';
import { Eyebrow, SectionTitle } from './primitives';

/**
 * Les deux rendez-vous du jour : cérémonie et réception.
 *
 * Les cartes reprennent les infos pratiques de ces catégories quand elles
 * existent, et retombent sinon sur le lieu et la ville du site.
 */
export default function Lieux() {
  const { site, data, theme, fonts, headWeight, accent, muted, ink, glass, glassSpec, btnR, cardR, preview } = useSiteView();

  const ceremony = data.infos.find((x) => x.category.toLowerCase().includes('cérémonie'));
  const reception = data.infos.find((x) => x.category.toLowerCase().includes('réception'));
  const cards = [
    { label: 'Cérémonie', img: '/images/chateau.jpg', title: ceremony?.title || site.venue, detail: ceremony?.detail || site.city, time: ceremony?.event_time || '' },
    { label: 'Réception', img: '/images/table-noir.jpg', title: reception?.title || site.venue, detail: reception?.detail || site.city, time: reception?.event_time || '' },
  ];

  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28" style={{ color: ink }}>
      <div className="mx-auto max-w-5xl">
        <Eyebrow>Lieux</Eyebrow>
        <SectionTitle>Où nous retrouver</SectionTitle>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {cards.map((c, i) => (
            <motion.div key={c.label} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, delay: i * 0.1 }}>
              <div className={`${glass} ${glassSpec} vp-lift overflow-hidden`} style={{ borderRadius: cardR }}>
                <div className="relative h-64 overflow-hidden sm:h-72">
                  <VisionImage src={c.img} alt={c.label} fallbackLabel={c.label} aura={theme.aura} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                  <span
                    className="absolute left-4 top-4 bg-black/45 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-xl"
                    style={{ borderRadius: btnR }}
                  >
                    {c.label}
                  </span>
                </div>
                <div className="p-7 sm:p-8">
                  {c.time && <div className="vp-num text-[13px] font-semibold tracking-[0.18em]" style={{ color: accent }}>{c.time}</div>}
                  <div className="mt-1.5 text-[22px]" style={{ fontFamily: fonts.heading, fontWeight: headWeight, letterSpacing: '-0.025em' }}>{c.title}</div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[14.5px]" style={{ color: muted }}>
                    <MapPin size={15} />{c.detail}
                  </div>
                  {!preview && (
                    <a
                      href={mapsUrl(`${c.title} ${c.detail}`)}
                      target="_blank"
                      rel="noreferrer"
                      className="vp-press mt-5 inline-flex items-center gap-2 px-5 py-3 text-[13.5px] font-semibold text-white transition"
                      style={{ background: accent, borderRadius: btnR, boxShadow: `0 14px 30px -16px ${accent}` }}
                    >
                      <Navigation size={15} /> Voir l’itinéraire
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
