import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, ThumbsUp, Volume2, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import {
  GLOBAL_WEDDING_PLAYLIST_FULL,
  type WeddingDjTrack,
} from '../lib/weddingDjPlaylist';
import type { WeddingStyle } from '../lib/weddingStyles';

interface DjPlaylistStudioProps {
  style: WeddingStyle;
  /** La liste à montrer : par défaut le socle du DJ, ou la playlist de l'année. */
  pistes?: WeddingDjTrack[];
  /** Une ligne sous le titre, pour dire ce qu'on regarde. */
  sousTitre?: string;
}

export default function DjPlaylistStudio({ style, pistes, sousTitre }: DjPlaylistStudioProps) {
  const [playlist, setPlaylist] = useState<WeddingDjTrack[]>(pistes ?? GLOBAL_WEDDING_PLAYLIST_FULL);
  /**
   * La lecture est locale : chaque morceau a son extrait dans `public/audio/`.
   * Le lecteur Spotify intégré a été retiré — l'embed s'affichait mal, et un
   * vrai son vaut mieux qu'un cadre cassé.
   */
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [userVotedIds, setUserVotedIds] = useState<string[]>([]);
  /**
   * La loupe au centre de la bande : pour chaque carte, de combien elle est
   * « au centre » (1 = pile au milieu, 0 = hors champ). On la mesure dans les
   * gestes — jamais pendant le rendu : les refs ne servent pas à rendre.
   */
  const [facteurs, setFacteurs] = useState<number[]>([]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const mesurer = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const centre = container.scrollLeft + container.clientWidth / 2;
    const maxDist = 360;
    setFacteurs(
      playlist.map((_, index) => {
        const card = cardRefs.current[index];
        if (!card) return 0;
        const distance = Math.abs(centre - (card.offsetLeft + card.clientWidth / 2));
        return Math.max(0, 1 - Math.min(distance, maxDist) / maxDist);
      }),
    );
  }, [playlist]);

  // Écoute continue du scroll pour recalculer la distance au centre
  const handleScroll = useCallback(() => {
    mesurer();
  }, [mesurer]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    // Centrage initial sur le 3ème morceau, puis première mesure.
    const initialTarget = cardRefs.current[2];
    if (initialTarget) {
      container.scrollTo({
        left: initialTarget.offsetLeft - container.clientWidth / 2 + initialTarget.clientWidth / 2,
        behavior: 'auto',
      });
    }
    const frame = requestAnimationFrame(mesurer);

    return () => {
      cancelAnimationFrame(frame);
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll, mesurer]);

  /** Arrête le son quand la page se ferme ou que l'onglet passe en arrière-plan. */
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  /**
   * Le play joue l'extrait réel du morceau (`previewUrl`), pas un cadre
   * embarqué. Un seul morceau à la fois : le précédent se tait.
   */
  const handlePlayOfficial = (track: WeddingDjTrack, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (playingId === track.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }

    audioRef.current?.pause();
    const el = new Audio(track.previewUrl);
    el.preload = 'auto';
    el.addEventListener('timeupdate', () => {
      if (el.duration) setProgress(el.currentTime / el.duration);
    });
    el.addEventListener('ended', () => {
      setPlayingId(null);
      setProgress(0);
    });
    audioRef.current = el;
    setProgress(0);
    void el.play().then(() => setPlayingId(track.id)).catch(() => setPlayingId(null));
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
          {sousTitre && (
            <p className="mt-1 text-[12.5px] text-black/55">{sousTitre}</p>
          )}
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

      {/* DOCK HORIZONTAL TYPE APPLE / IOS : MAGNIFIER DYNAMIQUE CONTINU AU GLISSER */}
      <div className="mt-5 pt-2 pb-1">
        <div
          ref={scrollContainerRef}
          className="no-scrollbar flex items-center gap-4 overflow-x-auto px-8 sm:px-20 py-6 scroll-smooth"
        >
          {playlist.map((track, idx) => {
            const isPlayingThis = playingId === track.id;

            // La mesure vient du scroll : échelle de 0.88 à 1.10, opacité de 0.55 à 1.0
            const factor = facteurs[idx] ?? 0;
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
                      title={isPlayingThis ? 'Pause' : 'Écouter l’extrait'}
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

                {/* L'extrait qui avance : la barre suit la lecture réelle */}
                {isPlayingThis && (
                  <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-black/8">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-[width] duration-200"
                      style={{ width: `${Math.round(progress * 100)}%` }}
                    />
                  </div>
                )}

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

                    <span className="flex items-center gap-1.5">
                      {/* L'original, chez Spotify : un lien, pas un cadre. */}
                      <a
                        href={`https://open.spotify.com/track/${track.spotifyTrackId}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title={`${track.title} — l’original sur Spotify`}
                        className="text-black/35 transition hover:text-black"
                      >
                        <ExternalLink size={11} />
                      </a>
                      <span className="text-[9px] font-mono text-black/35">
                        {idx + 1} / {playlist.length}
                      </span>
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
