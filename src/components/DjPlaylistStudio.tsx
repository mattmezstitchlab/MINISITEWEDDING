import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  ThumbsUp,
  Volume2,
  ChevronLeft,
  ChevronRight,
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
  const [userVotedIds, setUserVotedIds] = useState<string[]>([]);
  const [scrollX, setScrollX] = useState(0);
  const [containerCenter, setContainerCenter] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Écoute continue du scroll pour calculer la distance de chaque carte au centre géométrique
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    setScrollX(container.scrollLeft);
    setContainerCenter(container.scrollLeft + container.clientWidth / 2);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    // Initialisation
    setScrollX(container.scrollLeft);
    setContainerCenter(container.scrollLeft + container.clientWidth / 2);

    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    // Centrage initial sur le 3ème morceau (cocktail)
    const initialTarget = cardRefs.current[2];
    if (initialTarget) {
      container.scrollTo({
        left: initialTarget.offsetLeft - container.clientWidth / 2 + initialTarget.clientWidth / 2,
        behavior: 'auto',
      });
    }

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  // Lecture / pause audio réelle
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
        console.warn('Audio playback restriction:', err);
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

  const scrollToCard = (index: number) => {
    const card = cardRefs.current[index];
    const container = scrollContainerRef.current;
    if (card && container) {
      container.scrollTo({
        left: card.offsetLeft - container.clientWidth / 2 + card.clientWidth / 2,
        behavior: 'smooth',
      });
    }
  };

  const scrollStep = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmt = 300;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmt : scrollAmt,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[38px] border border-black/5 bg-[#0A0B10] text-white p-6 sm:p-10 lg:p-12 shadow-2xl">
      {/* Halo chromatique doux */}
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
            Chaque instant a sa musique.<br />
            <span className="text-white/40 text-[20px] sm:text-[24px]">Faites glisser le dock pour voyager dans la soirée.</span>
          </h3>
        </div>

        {/* Flèches de navigation dock */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => scrollStep('left')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-black shadow-md"
            title="Précédent"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollStep('right')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-black shadow-md"
            title="Suivant"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* DOCK HORIZONTAL TYPE APPLE / IOS : MAGNIFIER DYNAMIQUE CONTINU PENDANT LE GLISSER */}
      <div className="mt-8 pt-4 pb-4">
        <div
          ref={scrollContainerRef}
          className="no-scrollbar flex items-center gap-6 overflow-x-auto px-12 sm:px-32 py-10 scroll-smooth"
        >
          {playlist.map((track, idx) => {
            const isPlaying = playingTrackId === track.id;

            // Calcul dynamique de la distance au centre du viewport pendant le scroll
            const cardEl = cardRefs.current[idx];
            let distFromCenter = 9999;
            if (cardEl && containerCenter > 0) {
              const cardCenter = cardEl.offsetLeft + cardEl.clientWidth / 2;
              distFromCenter = Math.abs(containerCenter - cardCenter);
            }

            // Normalisation de l'échelle (de 0.85 à 1.10) et de l'opacité (de 0.55 à 1.0)
            const maxDist = 360;
            const factor = Math.max(0, 1 - Math.min(distFromCenter, maxDist) / maxDist);
            const scale = 0.88 + factor * 0.22; // 0.88 à 1.10
            const opacity = 0.55 + factor * 0.45; // 0.55 à 1.0
            const isDominant = factor > 0.65;

            return (
              <div
                key={track.id}
                ref={(el) => { cardRefs.current[idx] = el; }}
                onClick={() => scrollToCard(idx)}
                style={{
                  transform: `scale(${scale})`,
                  opacity,
                }}
                className={`cursor-pointer group relative shrink-0 w-[260px] sm:w-[290px] rounded-[30px] p-4 text-left select-none transition-transform duration-150 ease-out ${
                  isDominant
                    ? 'bg-white/[0.14] backdrop-blur-2xl border border-white/30 shadow-[0_25px_60px_rgba(0,0,0,0.8)] z-20'
                    : 'bg-white/[0.04] border border-white/5 z-10'
                }`}
              >
                {/* Pochette avec bouton Play/Pause intégré DIRECTEMENT dessus */}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  {/* Heure & BPM */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="rounded-full bg-black/75 backdrop-blur-md px-2.5 py-1 font-mono text-[10px] font-bold text-white border border-white/10">
                      {track.suggestedTime}
                    </span>
                    <span className="rounded-full bg-white/20 backdrop-blur-md px-2 py-0.5 font-mono text-[10px] text-white/90">
                      {track.audioBpm} BPM
                    </span>
                  </div>

                  {/* BOUTON PLAY/PAUSE SUR LA CARTE AVEC VRAIE ÉCOUTE AUDIO */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => togglePlay(track, e)}
                      className={`flex items-center justify-center rounded-full transition-transform duration-300 shadow-2xl ${
                        isDominant ? 'h-14 w-14 hover:scale-110' : 'h-11 w-11 hover:scale-110'
                      } ${
                        isPlaying
                          ? 'bg-emerald-400 text-black shadow-emerald-500/50'
                          : 'bg-white text-black hover:bg-neutral-100'
                      }`}
                      title={isPlaying ? 'Pause' : 'Écouter'}
                    >
                      {isPlaying ? (
                        <Pause size={isDominant ? 22 : 18} className="fill-black" />
                      ) : (
                        <Play size={isDominant ? 22 : 18} className="fill-black ml-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Label Phase (Cocktail, Cérémonie, Dîner, Bal, Closing) */}
                  <div className="absolute bottom-2.5 left-3 right-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/70 block truncate">
                      {track.phaseLabel}
                    </span>
                  </div>
                </div>

                {/* Contenu textuel de la carte */}
                <div className="mt-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-[15px] sm:text-[16px] truncate leading-tight">
                      {track.title}
                    </h4>
                    {isPlaying && (
                      <Volume2 size={14} className="text-emerald-400 animate-pulse shrink-0 ml-1" />
                    )}
                  </div>
                  
                  <div className="text-[12px] text-white/60 truncate">
                    {track.artist}
                  </div>

                  {/* Note statistique ou d'ambiance */}
                  <div className="pt-2 border-t border-white/10 text-[11px] text-white/70 leading-snug line-clamp-2 min-h-[32px]">
                    {track.globalStat}
                  </div>

                  {/* Vote invité & index */}
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

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
