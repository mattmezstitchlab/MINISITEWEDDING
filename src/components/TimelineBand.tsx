import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Clock, MapPin, Music2, X } from 'lucide-react';
import MusicCard from './MusicCard';
import type { Track } from '../lib/weddingSoundtrack';
import {
  TIMELINE_START_HOUR,
  TIMELINE_TOTAL_MINUTES,
  timeToMinutesFromStart,
} from '../lib/timelineTheaterEngine';

/**
 * LA BANDE DU JOUR J
 *
 * Toujours affichée, collée en bas de l'écran, sur toute la largeur. Elle porte
 * l'axe des heures du mariage (06h00 → 04h00) et les moments posés à leur heure.
 * Un moment ouvert montre son détail, et le morceau qui l'accompagne.
 *
 * Elle sert aux deux endroits, avec les mêmes gestes et la même lecture :
 *  - sur le site du couple, avec les vrais moments et le calendrier du mois ;
 *  - sur l'accueil, avec la journée de démonstration, pour montrer l'objet.
 *
 * Elle annonce sa hauteur (`--vows-daybar`) : la page lui réserve la place, sinon
 * le bas de page passe dessous.
 */

const PX_PER_MINUTE = 1.05;
const RAIL_WIDTH = TIMELINE_TOTAL_MINUTES * PX_PER_MINUTE;
const CSS_VAR = '--vows-daybar';

export interface BandMoment {
  id: string | number;
  /** '17:30' */
  time: string;
  title: string;
  detail?: string;
  place?: string;
  /** Le métier ou la personne qui porte ce moment. */
  role?: string;
  track?: Track | null;
}

interface Props {
  moments: BandMoment[];
  /** Ligne de gauche, en grand. */
  title: string;
  subtitle?: string;
  /** Pastille de droite (compte à rebours). */
  pill?: string;
  /** Vue « Calendrier » : le mois du mariage. Absente sur l'accueil. */
  calendar?: { date: Date | null; daysLeft: number } | null;
  dark?: boolean;
  accent?: string;
  ink?: string;
  muted?: string;
}

/** Ramène une heure sur l'axe (06h00 → 04h00) plutôt que de la faire disparaître. */
function position(time: string): number {
  return Math.max(0, Math.min(TIMELINE_TOTAL_MINUTES, timeToMinutesFromStart(time)));
}

export default function TimelineBand({
  moments,
  title,
  subtitle,
  pill,
  calendar = null,
  dark = false,
  accent = '#16171A',
  ink = '#0B0C12',
  muted = 'rgba(12,14,24,0.55)',
}: Props) {
  const [tab, setTab] = useState<'jour-j' | 'calendrier'>('jour-j');
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const ordered = useMemo(
    () => [...moments].sort((a, b) => position(a.time) - position(b.time)),
    [moments],
  );
  const selected = moments.find((m) => m.id === selectedId) ?? null;

  /** La page réserve exactement la place que la bande occupe. */
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const publish = () => document.documentElement.style.setProperty(CSS_VAR, `${el.offsetHeight + 12}px`);
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    window.addEventListener('resize', publish);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', publish);
      document.documentElement.style.removeProperty(CSS_VAR);
    };
  }, [tab, selectedId, moments.length]);

  /** À l'ouverture, on cadre le premier moment de la journée. */
  useEffect(() => {
    if (tab !== 'jour-j' || !railRef.current || ordered.length === 0) return;
    railRef.current.scrollTo({ left: Math.max(0, position(ordered[0].time) * PX_PER_MINUTE - 40), behavior: 'smooth' });
  }, [tab, ordered]);

  const hours = Array.from({ length: TIMELINE_TOTAL_MINUTES / 60 + 1 }, (_, i) => (TIMELINE_START_HOUR + i) % 24);
  const line = dark ? 'rgba(255,255,255,0.12)' : 'rgba(12,14,24,0.09)';
  const panelBg = dark ? 'rgba(12,14,20,0.94)' : 'rgba(255,255,255,0.94)';

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 w-full" style={{ color: ink }}>
      {/* Le détail du moment ouvert, juste au-dessus de la bande */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto w-full px-3 sm:px-6"
          >
            <div
              className="mx-auto w-full max-w-3xl overflow-hidden rounded-[20px] p-4 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
              style={{ background: panelBg, border: `1px solid ${line}` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.16em]" style={{ color: accent }}>
                    <Clock size={12} />
                    <span className="vp-num">{selected.time}</span>
                    {selected.role && <span style={{ color: muted }}>· {selected.role}</span>}
                  </div>
                  <div className="mt-1 text-[19px] font-semibold leading-snug">{selected.title}</div>
                  {selected.detail && (
                    <p className="mt-1.5 max-w-xl text-[13.5px] leading-relaxed" style={{ color: muted }}>
                      {selected.detail}
                    </p>
                  )}
                  {selected.place && (
                    <div className="mt-2 inline-flex items-center gap-1.5 text-[12.5px]" style={{ color: muted }}>
                      <MapPin size={13} />
                      {selected.place}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition hover:opacity-70"
                  style={{ background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(12,14,24,0.05)' }}
                  aria-label="Fermer le détail"
                >
                  <X size={15} />
                </button>
              </div>

              {selected.track ? (
                <div className="mt-3">
                  <div className="mb-1.5 flex items-center gap-1.5 text-[10.5px] font-mono uppercase tracking-[0.16em]" style={{ color: muted }}>
                    <Music2 size={11} /> Le morceau de ce moment
                  </div>
                  <MusicCard track={selected.track} dark={dark} accent={accent} />
                </div>
              ) : (
                <p className="mt-2 text-[12.5px]" style={{ color: muted }}>
                  Ce moment se vit sans musique.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* La bande, toute la largeur */}
      <div
        ref={barRef}
        className="pointer-events-auto w-full backdrop-blur-2xl"
        style={{ background: panelBg, borderTop: `1px solid ${line}` }}
      >
        <div className="w-full px-3 sm:px-6">
          {/* Ligne de tête */}
          <div className="flex items-center justify-between gap-3 py-2.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{ background: accent, color: dark ? '#0B0C12' : '#FFFFFF' }}
              >
                <CalendarDays size={16} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[13.5px] font-semibold capitalize">{title}</span>
                {subtitle && (
                  <span className="block truncate text-[11.5px]" style={{ color: muted }}>
                    {subtitle}
                  </span>
                )}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {pill && (
                <span
                  className="hidden rounded-full px-3 py-1.5 text-[11.5px] font-semibold sm:block"
                  style={{ background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(12,14,24,0.05)', color: muted }}
                >
                  {pill}
                </span>
              )}

              {calendar && (
                <div className="flex rounded-full p-1" style={{ background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(12,14,24,0.05)' }}>
                  {([
                    { id: 'jour-j', label: 'Jour J' },
                    { id: 'calendrier', label: 'Calendrier' },
                  ] as const).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTab(t.id)}
                      aria-pressed={tab === t.id}
                      className="rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold transition sm:px-4"
                      style={
                        tab === t.id
                          ? { background: dark ? '#FFFFFF' : '#16171A', color: dark ? '#0B0C12' : '#FFFFFF' }
                          : { color: muted }
                      }
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Les vues */}
          {tab === 'calendrier' && calendar ? (
            <CalendarView date={calendar.date} daysLeft={calendar.daysLeft} ink={ink} muted={muted} line={line} accent={accent} dark={dark} />
          ) : (
            <div ref={railRef} className="no-scrollbar w-full overflow-x-auto pb-3 pt-1">
              <div className="relative" style={{ width: RAIL_WIDTH, height: 108 }}>
                {/* L'axe des heures */}
                <div className="absolute left-0 right-0 top-[54px] h-px" style={{ background: line }} />
                {hours.map((hour, i) => (
                  <div key={`${hour}-${i}`} className="absolute top-[54px]" style={{ left: i * 60 * PX_PER_MINUTE }}>
                    <span className="block h-2 w-px -translate-y-1/2" style={{ background: line }} />
                    <span className="mt-1 block text-[9px] font-mono" style={{ color: muted }}>
                      {String(hour).padStart(2, '0')}h
                    </span>
                  </div>
                ))}

                {/* Les moments */}
                {ordered.map((moment, i) => {
                  const active = moment.id === selectedId;
                  const above = i % 2 === 0;
                  return (
                    <button
                      key={moment.id}
                      type="button"
                      onClick={() => setSelectedId(active ? null : moment.id)}
                      className="absolute w-[128px] text-left transition"
                      style={{ left: position(moment.time) * PX_PER_MINUTE - 8, top: above ? 6 : 54 }}
                      title={`${moment.time} · ${moment.title}`}
                    >
                      <span className="block text-[10px] font-mono" style={{ color: active ? accent : muted }}>
                        {moment.time}
                      </span>
                      <span
                        className="mt-0.5 flex items-start gap-1 text-[11.5px] font-semibold leading-tight"
                        style={{ color: active ? accent : ink }}
                      >
                        {moment.track && <Music2 size={10} className="mt-[2px] shrink-0" />}
                        <span className="line-clamp-2">{moment.title}</span>
                      </span>
                      {moment.role && (
                        <span className="mt-0.5 block truncate text-[9.5px]" style={{ color: muted }}>
                          {moment.role}
                        </span>
                      )}
                      <span
                        className="absolute h-[7px] w-[7px] rounded-full transition"
                        style={{
                          left: 8,
                          top: above ? 47 : -2,
                          background: active ? accent : dark ? 'rgba(255,255,255,0.45)' : 'rgba(12,14,24,0.28)',
                          boxShadow: active ? `0 0 0 4px ${accent}22` : 'none',
                        }}
                      />
                    </button>
                  );
                })}

                {moments.length === 0 && (
                  <p className="absolute left-0 top-8 text-[12.5px]" style={{ color: muted }}>
                    Le programme du jour sera dévoilé très bientôt.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Le mois du mariage : le jour entouré, le reste du mois en retrait. */
function CalendarView({
  date, daysLeft, ink, muted, line, accent, dark,
}: {
  date: Date | null;
  daysLeft: number;
  ink: string;
  muted: string;
  line: string;
  accent: string;
  dark: boolean;
}) {
  if (!date) {
    return <p className="pb-4 text-[12.5px]" style={{ color: muted }}>La date sera annoncée bientôt.</p>;
  }

  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const cells: Array<number | null> = [
    ...Array.from({ length: firstOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="flex w-full flex-wrap items-start gap-x-10 gap-y-4 pb-3.5">
      <div>
        <div className="mb-2 text-[11px] font-mono uppercase tracking-[0.16em]" style={{ color: muted }}>
          {date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </div>
        <div className="grid grid-cols-7 gap-[3px]">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
            <span key={`${d}-${i}`} className="w-6 text-center text-[9.5px] font-mono" style={{ color: muted }}>{d}</span>
          ))}
          {cells.map((day, i) => {
            if (day === null) return <span key={`empty-${i}`} className="h-6 w-6" />;
            const isWedding = day === date.getDate();
            return (
              <span
                key={day}
                className="flex h-6 w-6 items-center justify-center rounded-full text-[10.5px] font-medium"
                style={
                  isWedding
                    ? { background: accent, color: dark ? '#0B0C12' : '#FFFFFF', boxShadow: `0 0 0 3px ${accent}22` }
                    : { color: muted }
                }
              >
                {day}
              </span>
            );
          })}
        </div>
      </div>

      <div className="min-w-[200px] flex-1">
        <div className="flex items-center gap-2 text-[12.5px]" style={{ color: muted }}>
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: accent }} />
          Le jour du mariage
        </div>
        <p className="mt-2 text-[13.5px] capitalize" style={{ color: ink }}>
          {date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <p className="mt-1 text-[12.5px]" style={{ color: muted }}>
          <span className="vp-num">{Math.max(0, daysLeft)}</span> jours à attendre — et une journée entière à vivre.
        </p>
        <div className="mt-3 h-px w-full" style={{ background: line }} />
        <p className="mt-3 text-[11.5px]" style={{ color: muted }}>
          Ouvrez la vue « Jour J » pour parcourir les heures, moment par moment.
        </p>
      </div>
    </div>
  );
}
