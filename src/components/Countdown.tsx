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
      <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${light ? 'bg-white/15 text-white backdrop-blur-md' : 'bg-black/5'}`}>
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: light ? '#fff' : accent }} />
        <span className="text-sm tracking-[0.2em] uppercase">Ce jour est arrivé</span>
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
            className={`min-w-[66px] sm:min-w-[84px] px-3 py-3 sm:py-4 rounded-2xl text-center ${light ? 'bg-white/10 backdrop-blur-md border border-white/20' : 'bg-white/80 backdrop-blur border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.06)]'}`}
          >
            <div
              className={`text-2xl sm:text-4xl font-light tabular-nums ${light ? 'text-white' : 'text-neutral-900'}`}
              style={{ fontFamily: 'Fraunces, Georgia, serif' }}
            >
              {String(c.v).padStart(2, '0')}
            </div>
            <div className={`mt-1 text-[10px] sm:text-[11px] tracking-[0.25em] uppercase ${light ? 'text-white/70' : 'text-neutral-500'}`}>{c.l}</div>
          </div>
          {i < cells.length - 1 && <div className={`hidden sm:block w-px my-2 ${light ? 'bg-white/25' : 'bg-black/10'}`} />}
        </div>
      ))}
    </div>
  );
}
