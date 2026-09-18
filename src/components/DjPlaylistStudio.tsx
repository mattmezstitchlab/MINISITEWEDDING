import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Plus,
  ThumbsUp,
  Volume2,
  Clock,
  Disc,
  ChevronLeft,
  ChevronRight,
  Music,
} from 'lucide-react';
import {
  GLOBAL_WEDDING_PLAYLIST_FULL,
  type WeddingDjTrack,
} from '../lib/weddingDjPlaylist';
import type { WeddingStyle } from '../lib/weddingStyles';

interface DjPlaylistStudioProps {
  style: WeddingStyle;
}

export default function DjPlaylistStudio({ style }: DjPlaylistStudioProps) {
  const [playlist, setPlaylist] = useState<WeddingDjTrack[]>(GLOBAL_WEDDING_PLAYLIST_FULL);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [userVotedIds, setUserVotedIds] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);

  const activeTrack = playlist[activeTrackIndex] || playlist[0];

  // Lecture / pause de l'extrait officiel 30s
  const togglePlay = (track: WeddingDjTrack) => {
    if (playingTrackId === track.id) {
      audioRef.current?.pause();
      setPlayingTrackId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(track.previewUrl);
      audioRef.current = audio;
      audio.play().then(() => {
        setPlayingTrackId(track.id);
      }).catch((e) => {
        console.warn('Playback policy restriction:', e);
      });
      audio.onended = () => setPlayingTrackId(null);
    }
  };

  const voteTrack = (id: string) => {
    if (userVotedIds.includes(id)) return;
    setUserVotedIds((prev) => [...prev, id]);
    setPlaylist((prev) =>
      prev.map((t) => (t.id === id ? { ...t, votes: t.votes + 1 } : t))
    );
  };

  const scrollDeck = (direction: 'left' | 'right') => {
    if (horizontalScrollRef.current) {
      const scrollAmt = 320;
      horizontalScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmt : scrollAmt,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[38px] border border-black/5 bg-[#0B0C10] text-white p-6 sm:p-10 lg:p-12 shadow-2xl">
      {/* Lueur de fond diffuse */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full opacity-20 blur-[120px]"
        style={{ background: style.accent }}
      />

      {/* En-tête épuré et cinématographique */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 block mb-2">
            La Bande-Son du Jour J · {style.name}
          </span>
          <h3 className="vp-title text-[28px] sm:text-[40px] text-white leading-tight">
            Chaque seconde a sa musique.<br />
            <span className="text-white/40">Du premier regard jusqu’à l’aube.</span>
          </h3>
        </div>

        {/* Commandes de navigation horizontales */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollDeck('left')}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-black shadow-lg"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollDeck('right')}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-black shadow-lg"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Le Lecteur Phare Épuré (Focus Track) */}
      <div className="mt-8 grid md:grid-cols-12 gap-8 items-center bg-white/[0.03] rounded-[28px] p-6 sm:p-8">
        {/* Pochette vinyle grand format sans bordure criarde */}
        <div className="md:col-span-4 flex justify-center">
          <div className="relative group aspect-square w-52 sm:w-60 overflow-hidden rounded-[24px] shadow-[0_24px_50px_rgba(0,0,0,0.8)]">
            <img
              src={activeTrack.artwork}
              alt={activeTrack.title}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/images/danse.jpg';
              }}
              className="h-full w-full object-cover group-hover:scale-105 transition duration-700"
            />
            <button
              type="button"
              onClick={() => togglePlay(activeTrack)}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition hover:bg-black/20"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-2xl transition-transform hover:scale-110">
                {playingTrackId === activeTrack.id ? (
                  <Pause size={24} className="fill-black" />
                ) : (
                  <Play size={24} className="fill-black ml-1" />
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Détails du morceau */}
        <div className="md:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
              {activeTrack.suggestedTime}
            </span>
            <span className="rounded-full bg-indigo-500/20 text-indigo-300 px-3 py-1 text-[11px] font-medium">
              {activeTrack.phaseLabel}
            </span>
            {playingTrackId === activeTrack.id && (
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 text-emerald-300 px-3 py-1 text-[11px] font-semibold animate-pulse">
                <Volume2 size={12} /> Écoute 30s en cours
              </span>
            )}
          </div>

          <div>
            <h4 className="text-[26px] sm:text-[34px] font-bold text-white tracking-tight">
              {activeTrack.title}
            </h4>
            <div className="text-[17px] text-white/60 font-medium">
              {activeTrack.artist} · <span className="font-mono text-white/40">{activeTrack.audioBpm} BPM</span>
            </div>
          </div>

          <p className="text-[14px] leading-relaxed text-white/70 max-w-xl">
            {activeTrack.globalStat}
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => voteTrack(activeTrack.id)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-[12.5px] font-semibold transition ${
                userVotedIds.includes(activeTrack.id)
                  ? 'bg-emerald-500 text-black'
                  : 'bg-white/10 text-white hover:bg-white hover:text-black'
              }`}
            >
              <ThumbsUp size={14} className={userVotedIds.includes(activeTrack.id) ? 'fill-black' : ''} />
              <span>{activeTrack.votes} invités souhaitent ce titre</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ruban horizontal épuré sans contours agressifs */}
      <div className="mt-10">
        <div className="text-[12px] font-bold uppercase tracking-widest text-white/40 mb-3 px-1">
          Défilement de la Soirée · Cliquez une pochette pour changer de moment
        </div>

        <div
          ref={horizontalScrollRef}
          className="no-scrollbar flex gap-4 overflow-x-auto pb-4 pt-1 scroll-smooth"
        >
          {playlist.map((track, idx) => {
            const isCurrent = activeTrackIndex === idx;
            const isPlaying = playingTrackId === track.id;

            return (
              <div
                key={track.id}
                onClick={() => {
                  setActiveTrackIndex(idx);
                  if (playingTrackId) togglePlay(track);
                }}
                className={`cursor-pointer group relative w-44 sm:w-48 shrink-0 overflow-hidden rounded-[22px] p-2 transition-all duration-300 ${
                  isCurrent
                    ? 'bg-white/15 scale-102 shadow-2xl'
                    : 'bg-white/[0.03] hover:bg-white/[0.08]'
                }`}
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-[18px]">
                  <img
                    src={track.artwork}
                    alt={track.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/danse.jpg';
                    }}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-2 left-2 rounded-full bg-black/60 px-2.5 py-0.5 font-mono text-[10px] font-bold text-white backdrop-blur-md">
                    {track.suggestedTime}
                  </div>
                  {isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <Volume2 size={24} className="text-white animate-pulse" />
                    </div>
                  )}
                </div>

                <div className="mt-2.5 px-1.5 pb-1">
                  <div className="text-[13px] font-bold text-white truncate">
                    {track.title}
                  </div>
                  <div className="text-[11.5px] text-white/50 truncate">
                    {track.artist}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
