import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useSiteView } from './context';
import { Eyebrow, SectionTitle } from './primitives';
import MusicCard from '../MusicCard';
import { soundtrackOf } from '../../lib/weddingSoundtrack';

/**
 * LE PROGRAMME
 *
 * Des cartes simples, celles du menu Métiers : l'heure, le titre, le récit, le
 * lieu. Rien d'autre — pas de ligne, pas de pastille, pas de colonne qui
 * alterne. L'univers décide du fond, de l'arrondi et de la couleur de l'heure :
 * sombre ou clair, franc ou généreux.
 */
export default function Programme() {
  const { data, fonts, headWeight, accent, muted, ink, dark, cardR } = useSiteView();
  const programme = data.programme;
  const soundtrack = useMemo(() => soundtrackOf(programme), [programme]);

  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28" style={{ color: ink }}>
      <div className="mx-auto max-w-5xl">
        <Eyebrow>Programme du Jour J</Eyebrow>
        <SectionTitle>Le déroulé de la journée</SectionTitle>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programme.map((ev, i) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.05 }}
              className="p-5"
              style={{
                borderRadius: cardR,
                background: dark ? 'rgba(255,255,255,0.055)' : 'rgba(12,14,24,0.035)',
              }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span
                  className="vp-num text-[12.5px] font-semibold tracking-[0.16em]"
                  style={{ color: accent }}
                >
                  {ev.event_time}
                </span>
                {ev.place && <MapPin size={13} style={{ color: muted }} className="shrink-0" />}
              </div>

              <div
                className="mt-2 text-[19px] leading-tight"
                style={{ fontFamily: fonts.heading, fontWeight: headWeight, letterSpacing: '-0.02em' }}
              >
                {ev.title}
              </div>

              {ev.description && (
                <p
                  className="mt-2 text-[14px] leading-relaxed"
                  style={{ color: dark ? 'rgba(242,244,251,0.62)' : 'var(--vp-ink-soft)' }}
                >
                  {ev.description}
                </p>
              )}

              {ev.place && (
                <div className="mt-3 text-[12.5px] leading-snug" style={{ color: muted }}>
                  {ev.place}
                </div>
              )}

              {soundtrack.has(ev.id) && (
                <MusicCard track={soundtrack.get(ev.id)!} dark={dark} accent={accent} className="mt-3.5" />
              )}
            </motion.div>
          ))}
        </div>

        {programme.length === 0 && (
          <p className="py-8 text-center" style={{ color: muted }}>
            Le programme sera dévoilé très bientôt.
          </p>
        )}
      </div>
    </section>
  );
}
