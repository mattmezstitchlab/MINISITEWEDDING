import { useEffect, useState } from 'react';
import { parseDate } from '../lib/format';

interface Props {
  target: string;
  accent: string;
  /** Variante claire : le compte à rebours est posé sur la photo du hero. */
  light?: boolean;
}

interface Parts { days: number; hours: number; minutes: number; seconds: number; passed: boolean; }

const GLASS_LIGHT = 'vp-glass-photo';
const GLASS_DARK = 'vp-glass';

function compute(target: string, now: number): Parts {
  const d = parseDate(target);
  if (!d) return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: false };
  const diff = d.getTime() - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    passed: false,
  };
}

export default function Countdown({ target, accent, light }: Props) {
  // L’instant présent est l’état ; le compte à rebours en est dérivé au rendu.
  // Une date qui change est donc prise en compte immédiatement, sans effet de
  // synchronisation d’état.
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const parts = compute(target, now);

  if (parts.passed) {
    return (
      <div
        className={`inline-flex items-center gap-3 rounded-full px-6 py-3 ${light ? GLASS_LIGHT : GLASS_DARK}`}
      >
        <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: light ? '#fff' : accent, boxShadow: `0 0 12px ${light ? '#fff' : accent}` }} />
        <span className={`text-[13px] font-semibold uppercase tracking-[0.18em] ${light ? 'text-white' : 'text-[var(--vp-ink)]'}`}>Ce jour est arrivé</span>
      </div>
    );
  }

  const cells = [
    { v: parts.days, l: 'Jours' },
    { v: parts.hours, l: 'Heures' },
    { v: parts.minutes, l: 'Minutes' },
    { v: parts.seconds, l: 'Secondes' },
  ];

  return (
    <div className="flex items-stretch justify-center gap-2 sm:gap-3">
      {cells.map((c, i) => (
        <div key={c.l} className="flex items-stretch gap-2 sm:gap-3">
          <div className={`min-w-[64px] rounded-[20px] px-3 py-3 text-center sm:min-w-[84px] sm:py-4 ${light ? GLASS_LIGHT : GLASS_DARK}`}>
            <div
              className={`vp-num text-2xl sm:text-[38px] ${light ? 'text-white' : 'text-[var(--vp-ink)]'}`}
              style={{ fontWeight: 620, letterSpacing: '-0.035em', lineHeight: 1.1 }}
            >
              {String(c.v).padStart(2, '0')}
            </div>
            <div className={`mt-1 text-[9.5px] font-semibold uppercase tracking-[0.22em] sm:text-[11px] ${light ? 'text-white/70' : 'text-[var(--vp-muted)]'}`}>{c.l}</div>
          </div>
          {i < cells.length - 1 && <div className={`my-2 hidden w-px sm:block ${light ? 'bg-white/25' : 'bg-black/10'}`} />}
        </div>
      ))}
    </div>
  );
}
