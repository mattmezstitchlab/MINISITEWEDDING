import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, ChevronDown, Clock, MapPin, Music2, X } from 'lucide-react';
import { useSiteView } from './sections/context';
import MusicCard from './MusicCard';
import { soundtrackOf } from '../lib/weddingSoundtrack';
import { formatDateLong, parseDate } from '../lib/format';
import {
  TIMELINE_START_HOUR,
  TIMELINE_TOTAL_MINUTES,
  timeToMinutesFromStart,
} from '../lib/timelineTheaterEngine';

/**
 * LA BARRE DU BAS — le Jour J, et le calendrier
 *
 * C'est la colonne vertébrale du mini-site : elle reste sous les yeux pendant
 * toute la visite. Deux vues, une seule barre :
 *
 *  - **Jour J**   : l'axe des heures du mariage (06h00 → 04h00), les moments du
 *                   programme posés à leur heure. Un moment ouvert montre son
 *                   détail et, s'il en a un, son morceau.
 *  - **Calendrier**: le mois du mariage, le jour entouré, et le compte à rebours.
 *
 * Elle prend la teinte de l'univers du couple : un mariage sobre comme un
 * mariage radical lisent la même barre, dans leurs couleurs.
 */

const PX_PER_MINUTE = 1.05;
const RAIL_WIDTH = TIMELINE_TOTAL_MINUTES * PX_PER_MINUTE;
/** Hauteur réservée sous la page, tenue à jour par la barre elle-même. */
const CSS_VAR = '--vows-daybar';

type Tab = 'jour-j' | 'calendrier';

export default function WeddingDayBar() {
  const { data, site, accent, dark, muted, ink, btnR, daysLeft } = useSiteView();
  const programme = data.programme;
  const soundtrack = useMemo(() => soundtrackOf(programme), [programme]);

  const [tab, setTab] = useState<Tab>('jour-j');
  const [open, setOpen] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const selected = programme.find((p) => p.id === selectedId) ?? null;
  const selectedTrack = selected ? soundtrack.get(selected.id) ?? null : null;

  /** L'axe ne descend jamais sous 06h00 ni au-delà de 04h00 : un moment hors
   *  créneau (aube, petit matin) est ramené sur la borne la plus proche plutôt
   *  que de disparaître. */
  const position = (time: string) => {
    const minutes = timeToMinutesFromStart(time);
    return Math.max(0, Math.min(TIMELINE_TOTAL_MINUTES, minutes));
  };

  /** La page réserve la place exacte que la barre occupe. */
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const publish = () => {
      document.documentElement.style.setProperty(CSS_VAR, `${el.offsetHeight + 12}px`);
    };
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    window.addEventListener('resize', publish);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', publish);
      document.documentElement.style.removeProperty(CSS_VAR);
    };
  }, [open, tab, selectedId]);

  // À l'ouverture de la vue Jour J, on cadre le premier moment de la journée.
  const railRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open || tab !== 'jour-j' || !railRef.current || programme.length === 0) return;
    const first = [...programme].sort((a, b) => position(a.event_time) - position(b.event_time))[0];
    const left = position(first.event_time) * PX_PER_MINUTE;
    railRef.current.scrollTo({ left: Math.max(0, left - 40), behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tab, programme.length]);

  const weddingDate = useMemo(() => parseDate(site.wedding_date), [site.wedding_date]);
  const hours = Array.from({ length: TIMELINE_TOTAL_MINUTES / 60 + 1 }, (_, i) => (TIMELINE_START_HOUR + i) % 24);
  const panelBg = dark ? 'rgba(12,14,20,0.92)' : 'rgba(255,255,255,0.92)';
  const line = dark ? 'rgba(255,255,255,0.12)' : 'rgba(12,14,24,0.09)';

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40" style={{ color: ink }}>
      {/* Le détail d'un moment, juste au-dessus de la barre */}
      <AnimatePresence>
        {selected && open && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto mx-auto mb-2 w-[min(100%-1rem,44rem)] overflow-hidden rounded-[20px] p-4 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
            style={{ background: panelBg, border: `1px solid ${line}` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.16em]" style={{ color: accent }}>
                  <Clock size={12} />
                  <span className="vp-num">{selected.event_time}</span>
                </div>
                <div className="mt-1 text-[19px] font-semibold leading-snug">{selected.title}</div>
                {selected.description && (
                  <p className="mt-1.5 max-w-xl text-[13.5px] leading-relaxed" style={{ color: muted }}>
                    {selected.description}
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

            {selectedTrack ? (
              <div className="mt-3">
                <div className="mb-1.5 flex items-center gap-1.5 text-[10.5px] font-mono uppercase tracking-[0.16em]" style={{ color: muted }}>
                  <Music2 size={11} /> Le morceau de ce moment
                </div>
                <MusicCard track={selectedTrack} dark={dark} accent={accent} />
              </div>
            ) : (
              <p className="mt-2 text-[12.5px]" style={{ color: muted }}>
                Ce moment se vit sans musique.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* La barre */}
      <div
        ref={barRef}
        className="pointer-events-auto backdrop-blur-2xl"
        style={{ background: panelBg, borderTop: `1px solid ${line}` }}
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          {/* Ligne de tête : la date, le compte à rebours, les deux vues */}
          <div className="flex items-center justify-between gap-3 py-2.5">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex min-w-0 items-center gap-2.5 text-left"
              aria-expanded={open}
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{ background: accent, color: dark ? '#0B0C12' : '#FFFFFF' }}
              >
                <CalendarDays size={16} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[13.5px] font-semibold capitalize">
                  {formatDateLong(site.wedding_date)}
                </span>
                <span className="block text-[11.5px]" style={{ color: muted }}>
                  {site.venue || site.city || 'Lieu à confirmer'}
                  {site.city && site.venue ? ` · ${site.city}` : ''}
                </span>
              </span>
              <ChevronDown
                size={15}
                className="shrink-0 transition-transform duration-300"
                style={{ transform: open ? 'rotate(0deg)' : 'rotate(180deg)', color: muted }}
              />
            </button>

            <div className="flex items-center gap-2">
              <span
                className="hidden rounded-full px-3 py-1.5 text-[11.5px] font-semibold sm:block"
                style={{ background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(12,14,24,0.05)', color: muted }}
              >
                <span className="vp-num">{Math.max(0, daysLeft)}</span> jours
              </span>

              <div className="flex rounded-full p-1" style={{ background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(12,14,24,0.05)' }}>
                {([
                  { id: 'jour-j', label: 'Jour J' },
                  { id: 'calendrier', label: 'Calendrier' },
                ] as const).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => { setTab(t.id); setOpen(true); }}
                    aria-pressed={tab === t.id}
                    className="rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition sm:px-4"
                    style={
                      tab === t.id && open
                        ? { background: dark ? '#FFFFFF' : '#16171A', color: dark ? '#0B0C12' : '#FFFFFF', borderRadius: btnR }
                        : { color: muted }
                    }
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Les vues */}
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                {tab === 'jour-j' ? (
                  <div ref={railRef} className="no-scrollbar overflow-x-auto pb-3 pt-1">
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
                      {[...programme]
                        .sort((a, b) => position(a.event_time) - position(b.event_time))
                        .map((ev, i) => {
                          const left = position(ev.event_time) * PX_PER_MINUTE;
                          const active = ev.id === selectedId;
                          const hasMusic = soundtrack.has(ev.id);
                          const above = i % 2 === 0;
                          return (
                            <button
                              key={ev.id}
                              type="button"
                              onClick={() => setSelectedId(active ? null : ev.id)}
                              className="absolute w-[126px] text-left transition"
                              style={{ left: left - 8, top: above ? 6 : 54 }}
                              title={`${ev.event_time} · ${ev.title}`}
                            >
                              <span
                                className="block truncate text-[10px] font-mono"
                                style={{ color: active ? accent : muted }}
                              >
                                {ev.event_time}
                              </span>
                              <span
                                className="mt-0.5 flex items-center gap-1 text-[11.5px] font-semibold leading-tight"
                                style={{ color: active ? accent : ink }}
                              >
                                {hasMusic && <Music2 size={10} className="shrink-0" />}
                                <span className="line-clamp-2">{ev.title}</span>
                              </span>
                              <span
                                className="absolute h-[7px] w-[7px] rounded-full transition"
                                style={{
                                  left: 8,
                                  top: above ? 49 : -2,
                                  background: active ? accent : dark ? 'rgba(255,255,255,0.45)' : 'rgba(12,14,24,0.28)',
                                  boxShadow: active ? `0 0 0 4px ${accent}22` : 'none',
                                }}
                              />
                            </button>
                          );
                        })}

                      {programme.length === 0 && (
                        <p className="absolute left-0 top-8 text-[12.5px]" style={{ color: muted }}>
                          Le programme du jour sera dévoilé très bientôt.
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <CalendarView date={weddingDate} daysLeft={daysLeft} ink={ink} muted={muted} line={line} accent={accent} dark={dark} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
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
  // Semaine commençant le lundi.
  const firstOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const cells: Array<number | null> = [
    ...Array.from({ length: firstOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="flex flex-wrap items-start gap-6 pb-3.5">
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

      <div className="min-w-[190px] flex-1">
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
