import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  ThumbsUp,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Disc,
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
  const [centerTrackIndex, setCenterTrackIndex] = useState(2); // Initialisé sur un moment fort (Cocktail / Sunset)
  const [userVotedIds, setUserVotedIds] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Écoute audio
  const togglePlay = (track: WeddingDjTrack, e?: React.MouseEvent) => {
    e?.stopPropagation();
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
      }).catch((err) => {
        console.warn('Audio play restricted:', err);
      });
      audio.onended = () => setPlayingTrackId(null);
    }
  };

  const voteTrack = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (userVotedIds.includes(id)) return;
    setUserVotedIds((prev) => [...prev, id]);
    setPlaylist((prev) =>
      prev.map((t) => (t.id === id ? { ...t, votes: t.votes + 1 } : t))
    );
  };

  // Centrage de la carte au clic ou défilement
  const handleSelectTrack = (index: number) => {
    setCenterTrackIndex(index);
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 260; // largeur carte + gap
      const targetScroll = index * cardWidth - container.clientWidth / 2 + cardWidth / 2;
      container.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: 'smooth',
      });
    }
  };

  const scrollNav = (direction: 'left' | 'right') => {
    const nextIdx = direction === 'left' 
      ? Math.max(0, centerTrackIndex - 1)
      : Math.min(playlist.length - 1, centerTrackIndex + 1);
    handleSelectTrack(nextIdx);
  };

  return (
    <div className="relative overflow-hidden rounded-[38px] border border-black/5 bg-[#0A0B10] text-white p-6 sm:p-10 lg:p-12 shadow-2xl">
      {/* Halo chromatique doux lié au thème */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-20 blur-[130px]"
        style={{ background: style.accent }}
      />

      {/* En-tête épuré */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-white/40 block mb-1.5">
            Bande-Son Scénarisée · {style.name}
          </span>
          <h3 className="vp-title text-[26px] sm:text-[36px] text-white leading-tight">
            Chaque instant a son tempo.<br />
            <span className="text-white/40 text-[20px] sm:text-[24px]">Naviguez au cœur des titres du Jour J.</span>
          </h3>
        </div>

        {/* Flèches de navigation type dock */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => scrollNav('left')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-black shadow-md"
            title="Titre précédent"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollNav('right')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-black shadow-md"
            title="Titre suivant"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* DOCK HORIZONTAL INTERACTIF : CARTES AVEC PLAY INTÉGRÉ & EFFET MAGNIFIER SUR LA CARTE CENTRALE */}
      <div className="mt-8 pt-4 pb-4">
        <div
          ref={scrollContainerRef}
          className="no-scrollbar flex items-center gap-6 overflow-x-auto px-4 py-8 scroll-smooth"
        >
          {playlist.map((track, idx) => {
            const isCenter = centerTrackIndex === idx;
            const isPlaying = playingTrackId === track.id;

            return (
              <motion.div
                key={track.id}
                onClick={() => handleSelectTrack(idx)}
                layout
                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                className={`cursor-pointer group relative shrink-0 rounded-[30px] p-4 text-left transition-all duration-500 select-none ${
                  isCenter
                    ? 'w-[280px] sm:w-[320px] bg-white/[0.12] backdrop-blur-xl border border-white/25 shadow-[0_20px_50px_rgba(0,0,0,0.7)] scale-105 z-20'
                    : 'w-[230px] sm:w-[250px] bg-white/[0.03] border border-white/5 opacity-60 hover:opacity-90 hover:scale-100 z-10'
                }`}
              >
                {/* Pochette avec bouton Play/Pause DIRECT dessus */}
                <div className="relative aspect-square w-full overflow-hidden rounded-[22px] bg-black/40 shadow-inner">
                  <img
                    src={track.artwork}
                    alt={track.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/danse.jpg';
                    }}
                    className={`h-full w-full object-cover transition duration-700 ${
                      isPlaying ? 'scale-105 filter brightness-90' : 'group-hover:scale-105'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Heure & BPM en pilules discrètes en haut */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="rounded-full bg-black/70 backdrop-blur-md px-2.5 py-1 font-mono text-[10px] font-bold text-white border border-white/10">
                      {track.suggestedTime}
                    </span>
                    <span className="rounded-full bg-white/20 backdrop-blur-md px-2 py-0.5 font-mono text-[10px] text-white/90">
                      {track.audioBpm} BPM
                    </span>
                  </div>

                  {/* LE BOUTON PLAY/PAUSE SUR LA CARTE (Toujours accessible et animé) */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => togglePlay(track, e)}
                      className={`flex items-center justify-center rounded-full transition-transform duration-300 shadow-2xl ${
                        isCenter ? 'h-14 w-14 scale-100 hover:scale-110' : 'h-11 w-11 hover:scale-110'
                      } ${
                        isPlaying
                          ? 'bg-emerald-400 text-black shadow-emerald-500/50'
                          : 'bg-white text-black hover:bg-neutral-100'
                      }`}
                      title={isPlaying ? 'Pause' : 'Écouter extrait'}
                    >
                      {isPlaying ? (
                        <Pause size={isCenter ? 22 : 18} className="fill-black" />
                      ) : (
                        <Play size={isCenter ? 22 : 18} className="fill-black ml-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Label Phase (ex: Cocktail, Dîner, Bal) */}
                  <div className="absolute bottom-2.5 left-3 right-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/70 block truncate">
                      {track.phaseLabel}
                    </span>
                  </div>
                </div>

                {/* Contenu textuel sur la carte */}
                <div className="mt-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-[15px] sm:text-[16px] truncate leading-tight">
                      {track.title}
                    </h4>
                    {isPlaying && (
                      <Volume2 size={14} className="text-emerald-400 animate-pulse shrink-0 ml-1" />
                    )}
                  </div>
                  
                  <div className="text-[12.5px] text-white/60 truncate">
                    {track.artist}
                  </div>

                  {/* Mention statistique ou note d'ambiance */}
                  {isCenter && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pt-2 border-t border-white/10 text-[11px] text-white/70 leading-snug line-clamp-2"
                    >
                      {track.globalStat}
                    </motion.div>
                  )}

                  {/* Bouton de vote intégré sur la carte */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => voteTrack(track.id, e)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                        userVotedIds.includes(track.id)
                          ? 'bg-emerald-500 text-black'
                          : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      <ThumbsUp size={11} className={userVotedIds.includes(track.id) ? 'fill-black' : ''} />
                      <span>{track.votes}</span>
                    </button>

                    <span className="text-[10px] font-mono text-white/40">
                      {idx + 1} / {playlist.length}
                    </span>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
