import { useState, useRef, useEffect, TouchEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Heart,
  Share2,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  MessageCircle,
  Radio,
  Clock,
  Send,
  Flame,
} from 'lucide-react';

export interface WeddingMomentReel {
  id: string;
  time: string;
  momentTitle: string;
  couple: string;
  styleName: string;
  mediaUrl: string; // Photo ou vidéo verticale plein écran
  quoteOrDialogue: string;
  audioTrack: {
    title: string;
    artist: string;
    url: string;
  };
  likesCount: number;
  commentsCount: number;
  cameraRole: string; // Ex: "Cinéaste Super 8mm" ou "Photographe Mode Argentique"
}

const REELS_DATA: WeddingMomentReel[] = [
  {
    id: 'reel-1',
    time: '17h45',
    momentTitle: 'Les Vœux dans la Piscine Vide',
    couple: 'Léa & Maxime',
    styleName: 'Desert Motel',
    mediaUrl: '/images/desert-pool-vows.jpg',
    quoteOrDialogue: '« On a dit oui au fond d’une piscine carrelée turquoise à 38°C. Les invités étaient assis sur le bord les pieds dans le vide. »',
    audioTrack: {
      title: "Can't Help Falling in Love",
      artist: 'Elvis Presley',
      url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/b9/e7/03/b9e703f8-4509-c116-2d33-bc0d092d603f/mzaf_7822453664327702283.plus.aac.p.m4a',
    },
    likesCount: 1420,
    commentsCount: 84,
    cameraRole: 'Cinéaste Super 8mm Réel',
  },
  {
    id: 'reel-2',
    time: '18h30',
    momentTitle: 'Entrée Cathédrale & Flash Parapluie',
    couple: 'Sarah & Noah',
    styleName: 'Black & White',
    mediaUrl: '/images/noir-blanc-entree.jpg',
    quoteOrDialogue: '« Silence de plomb sous la verrière. Pas une seule fleur, juste un violoncelle et le crépitement des flashes parapluies. »',
    audioTrack: {
      title: 'At Last',
      artist: 'Etta James',
      url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/4a/14/b8/4a14b8a4-fa53-61b4-b040-349f48512140/mzaf_10332822416049084793.plus.aac.p.m4a',
    },
    likesCount: 2310,
    commentsCount: 142,
    cameraRole: 'Photographe Mode B&W',
  },
  {
    id: 'reel-3',
    time: '23h15',
    momentTitle: 'Cascades de Bengale & Champagne',
    couple: 'Éléonore & Henri',
    styleName: 'Château Moderne',
    mediaUrl: '/images/chateau-bengale-bal.jpg',
    quoteOrDialogue: '« Les remparts se sont embrasés de feux d’or pile sur l’envolée du morceau. Tout le monde a levé sa coupe en même temps. »',
    audioTrack: {
      title: 'I Wanna Dance With Somebody',
      artist: 'Whitney Houston',
      url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/09/bd/8a/09bd8a78-2dfa-12eb-9877-bb56dbdc3e19/mzaf_15077759885141014521.plus.aac.p.m4a',
    },
    likesCount: 3105,
    commentsCount: 196,
    cameraRole: 'Artificier & Vidéaste',
  },
  {
    id: 'reel-4',
    time: '02h17',
    momentTitle: 'Le Pic de Nuit 02h17 sous Stroboscope',
    couple: 'Romy & Théo',
    styleName: 'Club Amour',
    mediaUrl: '/images/club-strobe-kiss.jpg',
    quoteOrDialogue: '« 02h17 pile. Fumée lourde au sol, lasers magenta, tout le monde en transe les pieds nus sur la moquette club. »',
    audioTrack: {
      title: 'Midnight City',
      artist: 'M83',
      url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/3d/8a/0f/3d8a0f5a-c637-29cb-d130-97779f06c641/mzaf_16238641973053676231.plus.aac.p.m4a',
    },
    likesCount: 4890,
    commentsCount: 312,
    cameraRole: 'DJ Résident & Scénographe Néon',
  },
];

interface WeddingLiveStoriesFeedProps {
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export default function WeddingLiveStoriesFeed({
  isOpen,
  onClose,
  initialIndex = 0,
}: WeddingLiveStoriesFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});
  const [isMuted, setIsMuted] = useState(false);
  const [heartBurst, setHeartBurst] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  const currentReel = REELS_DATA[currentIndex];

  // Gestion audio synchronisé avec le reel en cours
  useEffect(() => {
    if (!isOpen) {
      if (audioRef.current) audioRef.current.pause();
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(currentReel.audioTrack.url);
      audioRef.current.loop = true;
    } else {
      audioRef.current.src = currentReel.audioTrack.url;
    }

    audioRef.current.play().catch(() => {});

    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, [isOpen, currentIndex]);

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % REELS_DATA.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + REELS_DATA.length) % REELS_DATA.length);
  };

  // Gestion du swipe vertical addictif (style TikTok / Reels vertical)
  const handleTouchStart = (e: TouchEvent) => {
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    touchEndY.current = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY.current;

    if (diff > 50) {
      // Swipe vers le haut -> Moment suivant
      goNext();
    } else if (diff < -50) {
      // Swipe vers le bas -> Moment précédent
      goPrev();
    }
  };

  // Double tap pour aimer avec burst d'effet coeur
  const handleDoubleTap = () => {
    setHeartBurst(true);
    setTimeout(() => setHeartBurst(false), 800);

    const currentLikes = likes[currentReel.id] || currentReel.likesCount;
    if (!hasLiked[currentReel.id]) {
      setLikes((prev) => ({ ...prev, [currentReel.id]: currentLikes + 1 }));
      setHasLiked((prev) => ({ ...prev, [currentReel.id]: true }));
    }
  };

  if (!isOpen) return null;

  const currentLikesCount = likes[currentReel.id] || currentReel.likesCount;
  const isCurrentlyLiked = hasLiked[currentReel.id] || false;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 backdrop-blur-2xl text-white select-none">
      {/* Bouton fermer en haut à droite */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white hover:text-black transition"
      >
        <X size={20} />
      </button>

      {/* Flèches de navigation desktop */}
      <button
        type="button"
        onClick={goPrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-40 hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white hover:text-black transition"
        title="Moment précédent (Haut)"
      >
        <ChevronUp size={24} />
      </button>

      <button
        type="button"
        onClick={goNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-40 hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white hover:text-black transition"
        title="Moment suivant (Bas)"
      >
        <ChevronDown size={24} />
      </button>

      {/* CADRE TIKTOK / REEL VERTICAL 9:16 CENTRÉ */}
      <div
        className="relative h-full max-h-[92vh] w-full max-w-[430px] overflow-hidden rounded-[36px] bg-black shadow-[0_0_80px_rgba(0,0,0,0.9)] border border-white/10"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleTap}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentReel.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full w-full"
          >
            {/* Image / Vidéo verticale plein écran */}
            <img
              src={currentReel.mediaUrl}
              alt={currentReel.momentTitle}
              className="h-full w-full object-cover"
            />

            {/* Dégradé cinématique pour lisibilité parfaite */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />

            {/* Burst d'effet coeur au double-tap */}
            <AnimatePresence>
              {heartBurst && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.4, opacity: 1 }}
                  exit={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                >
                  <Heart size={110} className="fill-rose-500 text-rose-500 drop-shadow-[0_0_30px_rgba(244,63,94,0.8)]" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Barre supérieure : Timecode & Couple */}
            <div className="absolute top-4 left-4 right-14 z-20 flex items-center justify-between text-left">
              <div className="flex items-center gap-2">
                <span className="font-mono bg-rose-500/90 text-black px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                  {currentReel.time}
                </span>
                <span className="text-[12.5px] font-bold text-white drop-shadow-md">
                  {currentReel.couple} · {currentReel.styleName}
                </span>
              </div>
            </div>

            {/* COLONNE D'ACTIONS INTERACTIVES DROITE (Like, Comment, Share, Mute) */}
            <div className="absolute right-3 bottom-24 z-30 flex flex-col items-center gap-5">
              {/* Like */}
              <button
                type="button"
                onClick={handleDoubleTap}
                className="flex flex-col items-center gap-1 group"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-md transition ${
                    isCurrentlyLiked
                      ? 'bg-rose-500 text-white'
                      : 'bg-black/50 text-white/90 hover:bg-black/80'
                  }`}
                >
                  <Heart size={20} className={isCurrentlyLiked ? 'fill-white' : ''} />
                </div>
                <span className="text-[10.5px] font-mono font-bold text-white drop-shadow">
                  {currentLikesCount}
                </span>
              </button>

              {/* Commentaires */}
              <button type="button" className="flex flex-col items-center gap-1 group">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 backdrop-blur-md text-white/90 hover:bg-black/80 transition">
                  <MessageCircle size={20} />
                </div>
                <span className="text-[10.5px] font-mono font-bold text-white drop-shadow">
                  {currentReel.commentsCount}
                </span>
              </button>

              {/* Mute audio */}
              <button
                type="button"
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.muted = !isMuted;
                    setIsMuted(!isMuted);
                  }
                }}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 backdrop-blur-md text-white/90 hover:bg-black/80 transition"
              >
                {isMuted ? <VolumeX size={18} className="text-rose-400" /> : <Volume2 size={18} />}
              </button>
            </div>

            {/* BAS DE STORY : SCRIPT VIVANT, CAPTATION MÉTIER & PISTE SON */}
            <div className="absolute bottom-5 left-4 right-16 z-20 text-left space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[9.5px] font-mono text-white/80 backdrop-blur-md border border-white/10">
                <Sparkles size={10} className="text-amber-300" />
                <span>Captation : {currentReel.cameraRole}</span>
              </div>

              <h4 className="text-[17px] font-bold text-white leading-tight drop-shadow-md">
                {currentReel.momentTitle}
              </h4>

              <p className="text-[12.5px] text-white/90 line-clamp-3 leading-snug drop-shadow-sm italic">
                {currentReel.quoteOrDialogue}
              </p>

              {/* Piste sonore qui défile en bas comme sur TikTok */}
              <div className="pt-1 flex items-center gap-2 text-[11px] font-mono text-white/70">
                <Radio size={12} className="text-rose-400 animate-pulse" />
                <span className="truncate">
                  {currentReel.audioTrack.title} — {currentReel.audioTrack.artist}
                </span>
              </div>
            </div>

            {/* Barre de progression des stories en haut */}
            <div className="absolute top-1.5 inset-x-3 z-30 flex gap-1">
              {REELS_DATA.map((_, i) => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded-full overflow-hidden bg-white/25"
                >
                  <div
                    className={`h-full transition-all duration-300 ${
                      i === currentIndex ? 'bg-white' : i < currentIndex ? 'bg-white/80' : 'bg-transparent'
                    }`}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Guide visuel de swipe en bas */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[11px] font-mono text-white/40 pointer-events-none">
        <ChevronUp size={13} className="animate-bounce" />
        <span>Glisser vers le haut pour le moment suivant</span>
      </div>
    </div>
  );
}
