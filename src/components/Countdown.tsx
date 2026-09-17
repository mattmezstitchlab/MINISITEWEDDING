import { useEffect, useState } from 'react';

interface Props {
  target: string;
  accent: string;
  light?: boolean;
}

interface Parts { days: number; hours: number; minutes: number; seconds: number; passed: boolean; }

function compute(target: string): Parts {
  const t = new Date(target.includes('T') ? target : `${target}T12:00:00`).getTime();
  if (Number.isNaN(t)) return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: false };
  const diff = t - Date.now();
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
  const [parts, setParts] = useState<Parts>(() => compute(target));

  useEffect(() => {
    setParts(compute(target));
    const timer = setInterval(() => setParts(compute(target)), 1000);
    return () => clearInterval(timer);
  }, [target]);

  if (parts.passed) {
    return (
      <div
        className={`inline-flex items-center gap-3 rounded-full px-6 py-3 ${light ? 'text-white' : ''}`}
        style={{
          background: light ? 'rgba(255,255,255,0.14)' : 'rgba(12,14,24,0.05)',
          backdropFilter: 'blur(22px) saturate(180%)',
          border: light ? '1px solid rgba(255,255,255,0.22)' : '1px solid rgba(255,255,255,0.6)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)',
        }}
      >
        <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: light ? '#fff' : accent, boxShadow: `0 0 12px ${light ? '#fff' : accent}` }} />
        <span className="text-[13px] font-semibold uppercase tracking-[0.18em]">Ce jour est arrivé</span>
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
          <div
            className="min-w-[64px] px-3 py-3 text-center sm:min-w-[84px] sm:py-4"
            style={{
              borderRadius: 20,
              background: light ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.62)',
              backdropFilter: 'blur(28px) saturate(190%)',
              WebkitBackdropFilter: 'blur(28px) saturate(190%)',
              border: light ? '1px solid rgba(255,255,255,0.24)' : '1px solid rgba(255,255,255,0.7)',
              boxShadow: light ? 'inset 0 1px 0 rgba(255,255,255,0.3)' : 'inset 0 1px 0 rgba(255,255,255,0.6)',
            }}
          >
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
