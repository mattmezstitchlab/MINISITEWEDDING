import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Disc3,
  Flame,
  Users,
  Sparkles,
  ExternalLink,
  Heart,
  Share2,
} from 'lucide-react';

interface RadioProgram {
  id: string;
  timeRange: string;
  title: string;
  curator: string;
  trackName: string;
  artist: string;
  audioPreviewUrl: string;
  vibeTag: string;
  bpm: number;
  coverImage: string;
  listenersCount: number;
}

const LIVE_PROGRAMS: RadioProgram[] = [
  {
    id: 'prog-1',
    timeRange: '17h00 - 18h30',
    title: 'La Cérémonie & Vœux Intimes',
    curator: 'Quatuor & Acoustique',
    trackName: "Can't Help Falling in Love",
    artist: 'Elvis Presley',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/b9/e7/03/b9e703f8-4509-c116-2d33-bc0d092d603f/mzaf_7822453664327702283.plus.aac.p.m4a',
    vibeTag: 'Émotion Pure · 68 BPM',
    bpm: 68,
    coverImage: '/images/alliances.jpg',
    listenersCount: 42,
  },
  {
    id: 'prog-2',
    timeRange: '18h30 - 20h30',
    title: 'Cocktail Solaire & Golden Hour',
    curator: 'Sélection Jazz & Soul Vinyle',
    trackName: 'At Last',
    artist: 'Etta James',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/4a/14/b8/4a14b8a4-fa53-61b4-b040-349f48512140/mzaf_10332822416049084793.plus.aac.p.m4a',
    vibeTag: 'Champagne & Crépuscule · 84 BPM',
    bpm: 84,
    coverImage: '/images/champagne.jpg',
    listenersCount: 78,
  },
  {
    id: 'prog-3',
    timeRange: '20h30 - 23h00',
    title: 'Dîner des Banquets & Toast Étoilé',
    curator: 'Fly Me to the Moon Quintet',
    trackName: 'Fly Me to the Moon',
    artist: 'Frank Sinatra',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/a5/d6/ea/a5d6ea71-6c7c-e431-7e81-cf1b29a2e88a/mzaf_16155919658700204791.plus.aac.p.m4a',
    vibeTag: 'Chandeliers & Toasts · 96 BPM',
    bpm: 96,
    coverImage: '/images/table-noir.jpg',
    listenersCount: 94,
  },
  {
    id: 'prog-4',
    timeRange: '23h00 - 02h17',
    title: 'Le Grand Bal & Euphorie',
    curator: 'DJ Résident VOWS',
    trackName: 'I Wanna Dance With Somebody',
    artist: 'Whitney Houston',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/09/bd/8a/09bd8a78-2dfa-12eb-9877-bb56dbdc3e19/mzaf_15077759885141014521.plus.aac.p.m4a',
    vibeTag: 'Dancefloor Explosif · 119 BPM',
    bpm: 119,
    coverImage: '/images/danse.jpg',
    listenersCount: 136,
  },
  {
    id: 'prog-5',
    timeRange: '02h17 - L’Aube',
    title: 'Club 02h17 & Nuit Blanche',
    curator: 'French Touch & Electro Underground',
    trackName: 'Midnight City',
    artist: 'M83',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/3d/8a/0f/3d8a0f5a-c637-29cb-d130-97779f06c641/mzaf_16238641973053676231.plus.aac.p.m4a',
    vibeTag: 'Basses Profondes & Néons · 128 BPM',
    bpm: 128,
    coverImage: '/images/club-amour.jpg',
    listenersCount: 168,
  },
];

export default function VowsLiveRadioStudio() {
  const [currentProgIdx, setCurrentProgIdx] = useState(3); // Démarre sur le Bal / Euphorie
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [likesCount, setLikesCount] = useState(247);
  const [hasLiked, setHasLiked] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeProg = LIVE_PROGRAMS[currentProgIdx];

  // Gestion du lecteur audio natif
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(activeProg.audioPreviewUrl);
      audioRef.current.loop = true;
    } else {
      audioRef.current.src = activeProg.audioPreviewUrl;
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [currentProgIdx]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-b from-[#12131D] to-[#0A0B10] p-6 sm:p-10 text-white shadow-2xl">
      {/* Halo de pulsation radio FM / Digital */}
      <div className="pointer-events-none absolute -top-20 right-1/4 h-80 w-80 rounded-full bg-rose-500/15 blur-[120px]" />

      {/* En-tête de la station Radio Live */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-rose-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            <span>VOWS ON AIR · Station Radio FM &amp; Streaming HD</span>
          </div>

          <h3 className="vp-title mt-2 text-[22px] sm:text-[30px] text-white">
            La Radio Live du Mariage en Continu
          </h3>
          <p className="mt-1 text-[13.5px] text-white/60 max-w-xl">
            Ceux qui ne peuvent pas être sur place, les proches à l'autre bout du monde ou les invités sur la route
            écoutent l'ambiance sonore en temps réel au rythme de la journée.
          </p>
        </div>

        {/* Badge auditeurs connectés */}
        <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-2 shrink-0">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-emerald-400" />
            <span className="text-[12px] font-mono font-bold text-white">
              {activeProg.listenersCount} auditeurs connectés
            </span>
          </div>
          <span className="text-white/20">|</span>
          <div className="text-[11px] font-mono text-white/60">Flux 320 kbps</div>
        </div>
      </div>

      {/* LECTEUR PRINCIPAL & SPECTRE VISUEL */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* POCHETTE VINYLE TOURNANTE DU MOMENT */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative group">
            {/* Vinyle qui dépasse */}
            <motion.div
              animate={isPlaying ? { rotate: 360 } : {}}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="absolute -right-6 top-3 h-48 w-48 rounded-full bg-[#111116] border-4 border-black/40 shadow-2xl flex items-center justify-center pointer-events-none"
            >
              <div className="h-16 w-16 rounded-full border border-white/20 bg-neutral-900 flex items-center justify-center">
                <Disc3 size={28} className="text-white/30" />
              </div>
            </motion.div>

            {/* Pochette de l'album / du moment */}
            <div className="relative z-10 h-52 w-52 overflow-hidden rounded-[26px] border border-white/20 shadow-2xl">
              <img
                src={activeProg.coverImage}
                alt={activeProg.trackName}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-wider text-white">
                  EN DIRECT
                </span>
                <div className="mt-1 font-bold text-white text-[15px] truncate">
                  {activeProg.trackName}
                </div>
                <div className="text-[11px] text-white/70 truncate">{activeProg.artist}</div>
              </div>
            </div>
          </div>

          {/* Boutons d'interaction sous la pochette */}
          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition ${
                hasLiked
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              <Heart size={12} className={hasLiked ? 'fill-rose-400 text-rose-400' : ''} />
              <span>{likesCount} Envois de cœurs</span>
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-white/70 hover:text-white transition"
              title={isMuted ? 'Rétablir le son' : 'Couper le son'}
            >
              {isMuted ? <VolumeX size={14} className="text-rose-400" /> : <Volume2 size={14} />}
            </button>
          </div>
        </div>

        {/* COMMANDES DE DIFFUSION & GRILLE DE LA JOURNÉE */}
        <div className="lg:col-span-7 space-y-5 text-left">
          {/* Titre du créneau actif */}
          <div className="rounded-[24px] bg-white/[0.03] border border-white/10 p-4 sm:p-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="space-y-0.5">
                <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  Phase Actuelle : {activeProg.timeRange}
                </span>
                <h4 className="text-[18px] font-bold text-white">{activeProg.title}</h4>
              </div>

              {/* Bouton Play / Pause stylisé */}
              <button
                type="button"
                onClick={togglePlay}
                className="flex items-center justify-center h-12 w-12 rounded-full bg-white text-black hover:bg-neutral-200 transition shadow-xl"
              >
                {isPlaying ? <Pause size={20} className="fill-black" /> : <Play size={20} className="fill-black ml-0.5" />}
              </button>
            </div>

            {/* Spectre de fréquences audio animées pendant la lecture */}
            <div className="mt-4 flex items-center justify-between gap-1 h-8 px-2 bg-black/40 rounded-xl">
              {Array.from({ length: 24 }).map((_, i) => (
                <motion.span
                  key={i}
                  animate={
                    isPlaying
                      ? { height: [`${Math.max(15, (i % 6) * 16)}%`, `${Math.min(95, (i % 4) * 28 + 20)}%`, `${Math.max(10, (i % 5) * 18)}%`] }
                      : { height: '15%' }
                  }
                  transition={{ duration: 0.6 + (i % 5) * 0.1, repeat: Infinity }}
                  className={`w-1 rounded-full transition-all ${isPlaying ? 'bg-rose-500' : 'bg-white/20'}`}
                />
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-white/50">
              <span>Sélection : {activeProg.curator}</span>
              <span className="text-white/80">{activeProg.vibeTag}</span>
            </div>
          </div>

          {/* SÉLECTEUR DE MOMENT DE LA JOURNÉE POUR ÉCOUTER LE CONDUCTEUR RADIO */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-white/40">
              Conducteur de la Station (Choisir un moment de la journée) :
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LIVE_PROGRAMS.map((prog, idx) => {
                const isSelected = idx === currentProgIdx;

                return (
                  <button
                    key={prog.id}
                    type="button"
                    onClick={() => {
                      setCurrentProgIdx(idx);
                      setIsPlaying(true);
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition ${
                      isSelected
                        ? 'bg-rose-500/15 border-rose-500/40 text-white shadow-md'
                        : 'bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-[12px] font-bold text-white truncate">{prog.title}</div>
                      <div className="text-[10px] font-mono text-white/50">{prog.timeRange} · {prog.artist}</div>
                    </div>
                    {isSelected && (
                      <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
