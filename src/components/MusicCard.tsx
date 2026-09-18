import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import type { Track } from '../lib/weddingSoundtrack';

/**
 * CARTE MUSICALE
 *
 * Le visuel, le titre, et un bouton qui joue vraiment le morceau. Elle prend la
 * teinte de l'univers du mariage (claire ou sombre) et sert dans la barre du
 * Jour J comme dans la section Programme.
 */
interface Props {
  track: Track;
  /** Environnement sombre : l'écriture passe en blanc. */
  dark?: boolean;
  accent?: string;
  /** Version compacte, pour la barre du bas. */
  compact?: boolean;
  className?: string;
}

export default function MusicCard({ track, dark = false, accent = '#16171A', compact = false, className = '' }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Un morceau à la fois : dès que la carte change, la précédente se tait.
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [track.src]);

  const toggle = () => {
    if (typeof window === 'undefined') return;
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
      return;
    }
    if (!audioRef.current || audioRef.current.dataset.src !== track.src) {
      audioRef.current?.pause();
      const el = new Audio(track.src);
      el.preload = 'auto';
      el.dataset.src = track.src;
      el.addEventListener('timeupdate', () => {
        if (el.duration) setProgress(el.currentTime / el.duration);
      });
      el.addEventListener('ended', () => {
        setPlaying(false);
        setProgress(0);
      });
      audioRef.current = el;
    }
    void audioRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  if (compact) {
    return (
      <div
        className={`flex items-center gap-2.5 rounded-[14px] px-2.5 py-2 ${className}`}
        style={{ background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(12,14,24,0.04)' }}
      >
        <img src={track.cover} alt="" className="h-9 w-9 shrink-0 rounded-[10px] object-cover" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[11.5px] font-semibold">{track.title}</div>
          <div className="mt-1 h-[2px] w-full overflow-hidden rounded-full" style={{ background: dark ? 'rgba(255,255,255,0.18)' : 'rgba(12,14,24,0.1)' }}>
            <div className="h-full rounded-full transition-[width] duration-200" style={{ width: `${Math.round(progress * 100)}%`, background: accent }} />
          </div>
        </div>
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? `Mettre en pause ${track.title}` : `Écouter ${track.title}`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition hover:scale-105 active:scale-95"
          style={{ background: accent, color: dark ? '#0B0C12' : '#FFFFFF' }}
        >
          {playing ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
        </button>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-3 rounded-[18px] p-2.5 ${className}`}
      style={{
        background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.72)',
        border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(12,14,24,0.08)'}`,
        boxShadow: dark ? 'none' : 'var(--vp-depth-1)',
      }}
    >
      <img src={track.cover} alt="" className="h-12 w-12 shrink-0 rounded-[13px] object-cover" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-semibold">{track.title}</div>
        <div className="truncate text-[11.5px] opacity-60">{track.subtitle}</div>
        <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full" style={{ background: dark ? 'rgba(255,255,255,0.16)' : 'rgba(12,14,24,0.1)' }}>
          <div className="h-full rounded-full transition-[width] duration-200" style={{ width: `${Math.round(progress * 100)}%`, background: accent }} />
        </div>
      </div>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `Mettre en pause ${track.title}` : `Écouter ${track.title}`}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:scale-105 active:scale-95"
        style={{ background: accent, color: dark ? '#0B0C12' : '#FFFFFF' }}
      >
        {playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
      </button>
    </div>
  );
}
