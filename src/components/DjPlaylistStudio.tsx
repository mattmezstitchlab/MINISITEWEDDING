import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ThumbsUp, Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [activeSpotifyTrack, setActiveSpotifyTrack] = useState<WeddingDjTrack | null>(null);
  const [userVotedIds, setUserVotedIds] = useState<string[]>([]);
  const [containerCenter, setContainerCenter] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Écoute continue du scroll pour calculer la distance au centre
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    setContainerCenter(container.scrollLeft + container.clientWidth / 2);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    setContainerCenter(container.scrollLeft + container.clientWidth / 2);
    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    // Centrage initial sur le 3ème morceau
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

  // Clic Play pour activer le VRAI morceau officiel via le player Spotify intégré
  const handlePlayOfficial = (track: WeddingDjTrack, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeSpotifyTrack?.id === track.id) {
      // Toggle off si déjà actif
      setActiveSpotifyTrack(null);
    } else {
      setActiveSpotifyTrack(track);
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
    <div className="relative overflow-hidden rounded-[38px] border border-black/6 bg-white p-6 text-[#0B0C12] sm:p-9 lg:p-10 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.25)]">
      {/* Halo chromatique doux */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-[0.13] blur-[130px]"
        style={{ background: style.accent }}
      />

      {/* En-tête épuré */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/8 pb-5">
        <div>
          <h3 className="vp-title text-[24px] sm:text-[32px] text-[#0B0C12] leading-tight">
            Playlist Collaborative
          </h3>
        </div>

        {/* Flèches de navigation dock */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => scrollStep('left')}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-[#0B0C12] transition hover:bg-black hover:text-white shadow-sm"
            title="Précédent"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scrollStep('right')}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-[#0B0C12] transition hover:bg-black hover:text-white shadow-sm"
            title="Suivant"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* BANDEAU DU LECTEUR OFFICIEL ACTIF (Quand on clique sur Play) */}
      <AnimatePresence>
        {activeSpotifyTrack && (
          <motion.div
            initial={{ opacity: 0, y: -16, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -16, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-5 overflow-hidden rounded-[20px] bg-black/[0.03] border border-emerald-600/25 p-3.5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11.5px] font-mono uppercase tracking-wider text-emerald-700 font-bold">
                  Lecture Officielle : {activeSpotifyTrack.title} — {activeSpotifyTrack.artist}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveSpotifyTrack(null)}
                className="text-[11px] font-mono text-black/45 hover:text-black underline"
              >
                Fermer le lecteur
              </button>
            </div>

            {/* IFRAME OFFICIELLE SPOTIFY : Le vrai master audio original garanti */}
            <div className="w-full rounded-[14px] overflow-hidden bg-white shadow-inner">
              <iframe
                title={`Spotify player ${activeSpotifyTrack.title}`}
                src={`https://open.spotify.com/embed/track/${activeSpotifyTrack.spotifyTrackId}?utm_source=generator&theme=0`}
                width="100%"
                height="80"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-[16px]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DOCK HORIZONTAL TYPE APPLE / IOS : MAGNIFIER DYNAMIQUE CONTINU AU GLISSER */}
      <div className="mt-5 pt-2 pb-1">
        <div
          ref={scrollContainerRef}
          className="no-scrollbar flex items-center gap-4 overflow-x-auto px-8 sm:px-20 py-6 scroll-smooth"
        >
          {playlist.map((track, idx) => {
            const isPlayingThis = activeSpotifyTrack?.id === track.id;

            // Calcul dynamique de la distance au centre du viewport pendant le scroll
            const cardEl = cardRefs.current[idx];
            let distFromCenter = 9999;
            if (cardEl && containerCenter > 0) {
              const cardCenter = cardEl.offsetLeft + cardEl.clientWidth / 2;
              distFromCenter = Math.abs(containerCenter - cardCenter);
            }

            // Normalisation de l'échelle (de 0.88 à 1.10) et de l'opacité (de 0.55 à 1.0)
            const maxDist = 360;
            const factor = Math.max(0, 1 - Math.min(distFromCenter, maxDist) / maxDist);
            const scale = 0.88 + factor * 0.22;
            const opacity = 0.55 + factor * 0.45;
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
                className={`cursor-pointer group relative shrink-0 w-[172px] sm:w-[188px] rounded-[20px] p-2.5 text-left select-none transition-transform duration-150 ease-out ${
                  isPlayingThis
                    ? 'bg-emerald-50 border border-emerald-500 shadow-[0_16px_36px_-14px_rgba(16,185,129,0.45)] z-30'
                    : isDominant
                    ? 'bg-white border border-black/10 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.28)] z-20'
                    : 'bg-white border border-black/6 z-10'
                }`}
              >
                {/* Pochette avec bouton Play/Pause intégré DIRECTEMENT dessus */}
                <div className="relative aspect-square w-full overflow-hidden rounded-[15px] bg-black/5 shadow-inner">
                  <img
                    src={track.artwork}
                    alt={track.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/danse.jpg';
                    }}
                    className={`h-full w-full object-cover transition duration-700 ${
                      isPlayingThis ? 'scale-105 filter brightness-90' : 'group-hover:scale-105'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  {/* Heure & BPM */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="rounded-full bg-black/75 backdrop-blur-md px-2 py-0.5 font-mono text-[9px] font-bold text-white border border-white/10">
                      {track.suggestedTime}
                    </span>
                    <span className="rounded-full bg-white/25 backdrop-blur-md px-1.5 py-0.5 font-mono text-[9px] text-white">
                      {track.audioBpm} BPM
                    </span>
                  </div>

                  {/* BOUTON PLAY/PAUSE SUR LA CARTE (Lance le vrai morceau original) */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => handlePlayOfficial(track, e)}
                      className={`flex items-center justify-center rounded-full transition-transform duration-300 shadow-2xl ${
                        isDominant ? 'h-10 w-10 hover:scale-110' : 'h-8 w-8 hover:scale-110'
                      } ${
                        isPlayingThis
                          ? 'bg-emerald-400 text-black shadow-emerald-500/50 ring-2 ring-emerald-400/30'
                          : 'bg-white text-black hover:bg-neutral-100'
                      }`}
                      title={isPlayingThis ? 'Pause' : 'Écouter le vrai morceau'}
                    >
                      {isPlayingThis ? (
                        <Pause size={isDominant ? 16 : 13} className="fill-black" />
                      ) : (
                        <Play size={isDominant ? 16 : 13} className="fill-black ml-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Label Phase (Cocktail, Cérémonie, Dîner, Bal, Closing) */}
                  <div className="absolute bottom-2.5 left-3 right-3">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-white/80 block truncate">
                      {track.phaseLabel}
                    </span>
                  </div>
                </div>

                {/* Contenu textuel de la carte */}
                <div className="mt-2.5 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[#0B0C12] text-[13px] truncate leading-tight">
                      {track.title}
                    </h4>
                    {isPlayingThis && (
                      <Volume2 size={12} className="text-emerald-600 animate-pulse shrink-0 ml-1" />
                    )}
                  </div>
                  
                  <div className="text-[10.5px] text-black/55 truncate">
                    {track.artist}
                  </div>

                  {/* Note statistique ou d'ambiance */}
                  <div className="pt-1.5 border-t border-black/8 text-[9.5px] text-black/60 leading-snug line-clamp-2 min-h-[26px]">
                    {track.globalStat}
                  </div>

                  {/* Vote invité & index */}
                  <div className="pt-1.5 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => voteTrack(track.id, e)}
                      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold transition ${
                        userVotedIds.includes(track.id)
                          ? 'bg-emerald-500 text-black'
                          : 'bg-black/5 text-black/70 hover:bg-black/10 hover:text-black'
                      }`}
                    >
                      <ThumbsUp size={10} className={userVotedIds.includes(track.id) ? 'fill-black' : ''} />
                      <span>{track.votes}</span>
                    </button>

                    <span className="text-[9px] font-mono text-black/35">
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
