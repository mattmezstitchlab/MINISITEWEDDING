import { useEffect, useRef } from 'react';
import { Pause, Play, Volume2, X } from 'lucide-react';
import type { CarteVivante } from '../lib/cartesVivantes';

/**
 * LE LECTEUR DU HERO
 *
 * Quand on lance une carte, le hero s'en empare : le visuel occupe tout le
 * cadre — animé lentement, comme un plan qui avance — **et le morceau joue**.
 * La carte, elle, ne bouge pas : elle reste dans sa bande, allumée, et c'est le
 * hero qui raconte.
 *
 * Si la carte porte une vidéo (`media.video`), c'est elle qui tourne, avec son
 * son ; sinon — c'est le cas aujourd'hui, le site n'a pas encore de rushes — le
 * visuel prend le mouvement et le morceau fait la bande sonore. Le lecteur ne
 * change pas : brancher une vidéo sur une carte suffit à l'allumer.
 */

interface LecteurHeroProps {
  carte: CarteVivante;
  enLecture: boolean;
  onBasculer: () => void;
  onFermer: () => void;
}

export default function LecteurHero({ carte, enLecture, onBasculer, onFermer }: LecteurHeroProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Un seul média à la fois : changer de carte arrête le précédent.
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
      videoRef.current?.pause();
      videoRef.current = null;
    };
  }, [carte.id]);

  useEffect(() => {
    if (carte.media.video) return;
    if (typeof window === 'undefined') return;
    const src = carte.media.audio;
    if (!src) return;
    if (!enLecture) {
      audioRef.current?.pause();
      return;
    }
    if (!audioRef.current || audioRef.current.dataset.src !== src) {
      audioRef.current?.pause();
      const el = new Audio(src);
      el.preload = 'auto';
      el.dataset.src = src;
      el.loop = true;
      audioRef.current = el;
    }
    void audioRef.current.play().catch(() => undefined);
  }, [carte.id, carte.media.audio, carte.media.video, enLecture]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (enLecture) void el.play().catch(() => undefined);
    else el.pause();
  }, [enLecture, carte.media.video]);

  return (
    <div className="fixed inset-0 z-[45] bg-black/45 backdrop-blur-[2px]">
      {/* Le média plein cadre */}
      {carte.media.video ? (
        <video
          ref={videoRef}
          src={carte.media.video}
          poster={carte.media.image}
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={carte.media.image}
            alt=""
            className="hero-plan h-full w-full object-cover"
            style={{ animationPlayState: enLecture ? 'running' : 'paused' }}
          />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/45" />

      {/* Ce que le média raconte, et ses commandes */}
      <div className="vp-page absolute inset-x-0 bottom-0 z-10 pb-8 sm:pb-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-white/60">
              {carte.badge ? `${carte.badge} · ` : ''}Le Jour J, en conditions
            </span>
            <h2 className="vp-title mt-2 text-white" style={{ fontSize: 'clamp(1.5rem, 3.4vw, 2.4rem)' }}>
              {carte.titre}
            </h2>
            {carte.media.legende && (
              <p className="mt-2 max-w-[520px] text-[13.5px] leading-relaxed text-white/75">{carte.media.legende}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBasculer}
              aria-label={enLecture ? 'Mettre en pause' : 'Reprendre'}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#0B0C12] shadow-[0_10px_28px_rgba(0,0,0,0.4)] transition hover:scale-105 active:scale-95"
            >
              {enLecture ? <Pause size={17} /> : <Play size={17} className="ml-0.5" />}
            </button>
            <span className="hidden items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-2 font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/70 backdrop-blur sm:flex">
              <Volume2 size={11} /> {carte.media.video ? 'Vidéo' : 'Le morceau joue'}
            </span>
            <button
              type="button"
              onClick={onFermer}
              aria-label="Fermer le lecteur"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
