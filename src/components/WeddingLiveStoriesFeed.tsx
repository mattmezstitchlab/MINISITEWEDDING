import { useState, useRef, useEffect, TouchEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Heart,
  Radio,
  PhoneCall,
  Sliders,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  MessageCircle,
  Clock,
  Sparkles,
  Users,
  Compass,
  Mic,
  Disc3,
  Zap,
} from 'lucide-react';

export type InteractiveStoryTool = 'none' | 'radio' | 'talkie' | 'event_os';

export interface WeddingLiveStoryItem {
  id: string;
  time: string;
  momentTitle: string;
  couple: string;
  styleName: string;
  location: string;
  frequencyChannel: string;
  mediaUrl: string;
  quoteOrDialogue: string;
  audioTrack: {
    title: string;
    artist: string;
    url: string;
  };
  cameraRole: string;
  likesCount: number;
  commentsCount: number;
  liveBpm: number;
  delayOffsetMin: number;
  walkieSnippet: {
    sender: string;
    role: string;
    message: string;
  };
}

const LIVE_STORIES: WeddingLiveStoryItem[] = [
  {
    id: 'story-1',
    time: '17h45',
    momentTitle: 'Les Vœux dans la Piscine Vide',
    couple: 'Léa & Maxime',
    styleName: 'Desert Motel',
    location: 'Joshua Tree · 38°C',
    frequencyChannel: 'Canal 88.4 MHz · Elopement',
    mediaUrl: '/images/desert-pool-vows.jpg',
    quoteOrDialogue: '« On a dit oui au fond d’une piscine carrelée turquoise sous le soleil ardent. Zéro protocole, deux chaises en rotin et nos proches sur le bord. »',
    audioTrack: {
      title: "Can't Help Falling in Love",
      artist: 'Elvis Presley',
      url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/b9/e7/03/b9e703f8-4509-c116-2d33-bc0d092d603f/mzaf_7822453664327702283.plus.aac.p.m4a',
    },
    cameraRole: 'Cinéaste Super 8mm Réel',
    likesCount: 1420,
    commentsCount: 84,
    liveBpm: 72,
    delayOffsetMin: 0,
    walkieSnippet: {
      sender: 'Clara (Régie Désert)',
      role: 'Régisseuse Elopement',
      message: '« Faisceau doré dans 8 minutes. Préparez la Ford décapotable 1968 pour le départ désert. »',
    },
  },
  {
    id: 'story-2',
    time: '18h30',
    momentTitle: 'Entrée Cathédrale & Flashes Parapluie',
    couple: 'Sarah & Noah',
    styleName: 'Black & White',
    location: 'Paris 7e · Verrière Monumentale',
    frequencyChannel: 'Canal 94.2 MHz · Haute Couture',
    mediaUrl: '/images/noir-blanc-entree.jpg',
    quoteOrDialogue: '« Silence cathédrale. Smoking architectural, robe sans dentelle, et le crépitement continu des argentiques moyen format. »',
    audioTrack: {
      title: 'At Last',
      artist: 'Etta James',
      url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/4a/14/b8/4a14b8a4-fa53-61b4-b040-349f48512140/mzaf_10332822416049084793.plus.aac.p.m4a',
    },
    cameraRole: 'Photographe Mode B&W',
    likesCount: 2310,
    commentsCount: 142,
    liveBpm: 84,
    delayOffsetMin: 5,
    walkieSnippet: {
      sender: 'Marc (Studio B&W)',
      role: 'Tireur Argentique Live',
      message: '« Les 24 premiers tirages sèchent sur les câbles tendus. Le rendu grand format est sublime. »',
    },
  },
  {
    id: 'story-3',
    time: '23h15',
    momentTitle: 'Bengale Doré & Champagne Millésimé',
    couple: 'Éléonore & Henri',
    styleName: 'Château Moderne',
    location: 'Val de Loire · Remparts',
    frequencyChannel: 'Canal 101.8 MHz · Cour d’Honneur',
    mediaUrl: '/images/chateau-bengale-bal.jpg',
    quoteOrDialogue: '« Au refrain du DJ, les feux de bengale ont illuminé la pierre blonde sur 200 mètres. Les coupes se sont levées ensemble. »',
    audioTrack: {
      title: 'I Wanna Dance With Somebody',
      artist: 'Whitney Houston',
      url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/09/bd/8a/09bd8a78-2dfa-12eb-9877-bb56dbdc3e19/mzaf_15077759885141014521.plus.aac.p.m4a',
    },
    cameraRole: 'Artificier & Quatuor',
    likesCount: 3105,
    commentsCount: 196,
    liveBpm: 119,
    delayOffsetMin: 12,
    walkieSnippet: {
      sender: 'Alex (Chef Artificier)',
      role: 'Pyrotechnie',
      message: '« Allumage synchronisé à la seconde 42 du morceau. Fumée blanche évacuée vers les douves. »',
    },
  },
  {
    id: 'story-4',
    time: '02h17',
    momentTitle: 'Le Pic 02h17 sous Stroboscope',
    couple: 'Romy & Théo',
    styleName: 'Club Amour',
    location: 'Lyon · Friche Industrielle',
    frequencyChannel: 'Canal 107.5 MHz · Rave Privée',
    mediaUrl: '/images/club-strobe-kiss.jpg',
    quoteOrDialogue: '« L’heure exacte de leur rencontre. Nappe de fumée lourde, basses telluriques et le baiser sous les flashs roses. »',
    audioTrack: {
      title: 'Midnight City',
      artist: 'M83',
      url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/3d/8a/0f/3d8a0f5a-c637-29cb-d130-97779f06c641/mzaf_16238641973053676231.plus.aac.p.m4a',
    },
    cameraRole: 'DJ Résident & Scénographe',
    likesCount: 4890,
    commentsCount: 312,
    liveBpm: 128,
    delayOffsetMin: 0,
    walkieSnippet: {
      sender: 'Klang (DJ Résident)',
      role: 'Sound Designer',
      message: '« Jauge dancefloor à 100%. On enchaîne sur le live set 130 BPM jusqu’à l’aube. »',
    },
  },
  {
    id: 'story-5',
    time: '21h00',
    momentTitle: 'Découpe du Gâteau Noir & Toast Liberté',
    couple: 'Hugo (Solo & Fier)',
    styleName: 'Fête de Divorce',
    location: 'Paris · Rooftop Montmartre',
    frequencyChannel: 'Canal 66.6 MHz · Renaissance',
    mediaUrl: '/images/table-noir.jpg',
    quoteOrDialogue: '« On a sabré le champagne et découpé le wedding cake noir "Officiellement Célibataire". Tous mes vrais potes étaient là, zéro larme que de la joie ! »',
    audioTrack: {
      title: 'Get Lucky',
      artist: 'Daft Punk',
      url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/bf/1a/f3/bf1af3c0-388f-a9cb-c7fb-6ba6a053c155/mzaf_8461011505367676709.plus.aac.p.m4a',
    },
    cameraRole: 'Maître de Cérémonie Dé-Mariage',
    likesCount: 5620,
    commentsCount: 418,
    liveBpm: 116,
    delayOffsetMin: 0,
    walkieSnippet: {
      sender: 'Maître Cérémonie Rupture',
      role: 'Officiant Satirique',
      message: '« Bagues officiellement fondues en direct. On ouvre la cagnotte pour son voyage à Tokyo ! »',
    },
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

  // Outil interactif actif sur cette story (Talkie PTT, Radio Live, Event OS)
  const [activeTool, setActiveTool] = useState<InteractiveStoryTool>('none');
  const [isPressingPTT, setIsPressingPTT] = useState(false);
  const [simulatedDelay, setSimulatedDelay] = useState<number>(0);
  const [walkieMessages, setWalkieMessages] = useState<string[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  const currentStory = LIVE_STORIES[currentIndex];

  // Gestion audio synchronisée avec la story en cours
  useEffect(() => {
    if (!isOpen) {
      if (audioRef.current) audioRef.current.pause();
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(currentStory.audioTrack.url);
      audioRef.current.loop = true;
    } else {
      audioRef.current.src = currentStory.audioTrack.url;
    }

    audioRef.current.play().catch(() => {});

    // Reset de l'outil interactif à chaque changement de story
    setActiveTool('none');
    setSimulatedDelay(currentStory.delayOffsetMin);
    setWalkieMessages([currentStory.walkieSnippet.message]);

    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, [isOpen, currentIndex]);

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % LIVE_STORIES.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + LIVE_STORIES.length) % LIVE_STORIES.length);
  };

  const handleTouchStart = (e: TouchEvent) => {
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    touchEndY.current = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY.current;
    if (diff > 50) goNext();
    else if (diff < -50) goPrev();
  };

  const handleDoubleTap = () => {
    setHeartBurst(true);
    setTimeout(() => setHeartBurst(false), 800);

    const count = likes[currentStory.id] || currentStory.likesCount;
    if (!hasLiked[currentStory.id]) {
      setLikes((prev) => ({ ...prev, [currentStory.id]: count + 1 }));
      setHasLiked((prev) => ({ ...prev, [currentStory.id]: true }));
    }
  };

  const handleSendPTTVoice = () => {
    setWalkieMessages((prev) => [
      `« Vous (Public) : Transmission audio reçue 5/5 sur ${currentStory.frequencyChannel.split('·')[0].trim()} »`,
      ...prev,
    ]);
  };

  if (!isOpen) return null;

  const currentLikesCount = likes[currentStory.id] || currentStory.likesCount;
  const isCurrentlyLiked = hasLiked[currentStory.id] || false;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 backdrop-blur-2xl text-white select-none">
      {/* Bouton fermer */}
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
      >
        <ChevronUp size={24} />
      </button>

      <button
        type="button"
        onClick={goNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-40 hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white hover:text-black transition"
      >
        <ChevronDown size={24} />
      </button>

      {/* CADRE SMARTPHONE STORY VERTICALE 9:16 */}
      <div
        className="relative h-full max-h-[94vh] w-full max-w-[430px] overflow-hidden rounded-[40px] bg-black shadow-[0_0_90px_rgba(0,0,0,0.9)] border border-white/15"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleTap}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStory.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full w-full"
          >
            {/* Image photo/vidéo plein écran */}
            <img
              src={currentStory.mediaUrl}
              alt={currentStory.momentTitle}
              className="h-full w-full object-cover"
            />

            {/* Dégradés haute couture sans banding */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-transparent to-black/95 pointer-events-none" />

            {/* Burst d'effet coeur */}
            <AnimatePresence>
              {heartBurst && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.4, opacity: 1 }}
                  exit={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
                >
                  <Heart size={110} className="fill-white text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.9)]" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Barres de progression en haut */}
            <div className="absolute top-2 inset-x-3 z-30 flex gap-1">
              {LIVE_STORIES.map((_, i) => (
                <div key={i} className="h-1 flex-1 rounded-full overflow-hidden bg-white/20">
                  <div
                    className={`h-full transition-all duration-300 ${
                      i === currentIndex ? 'bg-white' : i < currentIndex ? 'bg-white/70' : 'bg-transparent'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* En-tête Story : Localisation, Fréquence Live, Timecode */}
            <div className="absolute top-5 left-4 right-14 z-30 flex flex-col text-left space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono bg-white text-black px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {currentStory.time}
                </span>
                <span className="text-[13px] font-bold text-white drop-shadow">
                  {currentStory.couple}
                </span>
                <span className="text-[11px] text-white/60 font-mono hidden sm:inline">
                  · {currentStory.styleName}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-mono text-white/70">
                <span className="flex items-center gap-1">
                  <Compass size={10} className="text-emerald-400" />
                  <span>{currentStory.location}</span>
                </span>
                <span>•</span>
                <span className="text-emerald-300">{currentStory.frequencyChannel}</span>
              </div>
            </div>

            {/* COLONNE D'OUTILS INTERACTIFS SUR CHAQUE STORY (Style TikTok Creator Tools réinventés pour le mariage) */}
            <div className="absolute right-3.5 bottom-28 z-40 flex flex-col items-center gap-4">
              
              {/* OUTIL 1 : RADIO LIVE DE L'ÉVÉNEMENT (Écouter l'ambiance sonore en temps réel) */}
              <button
                type="button"
                onClick={() => setActiveTool(activeTool === 'radio' ? 'none' : 'radio')}
                className={`flex flex-col items-center gap-1 transition ${
                  activeTool === 'radio' ? 'scale-110' : ''
                }`}
                title="Brancher la Radio Live"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-md transition shadow-lg ${
                    activeTool === 'radio'
                      ? 'bg-white text-black'
                      : 'bg-black/60 border border-white/20 text-white hover:bg-black/80'
                  }`}
                >
                  <Radio size={19} className={activeTool === 'radio' ? 'animate-pulse' : ''} />
                </div>
                <span className="text-[9.5px] font-mono font-bold text-white uppercase drop-shadow">
                  Radio
                </span>
              </button>

              {/* OUTIL 2 : TALKIE-WALKIE PTT (Parler sur la fréquence de la régie) */}
              <button
                type="button"
                onClick={() => setActiveTool(activeTool === 'talkie' ? 'none' : 'talkie')}
                className={`flex flex-col items-center gap-1 transition ${
                  activeTool === 'talkie' ? 'scale-110' : ''
                }`}
                title="Talkie-Walkie PTT régie"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-md transition shadow-lg ${
                    activeTool === 'talkie'
                      ? 'bg-emerald-400 text-black'
                      : 'bg-black/60 border border-white/20 text-white hover:bg-black/80'
                  }`}
                >
                  <PhoneCall size={18} />
                </div>
                <span className="text-[9.5px] font-mono font-bold text-white uppercase drop-shadow">
                  Talkie
                </span>
              </button>

              {/* OUTIL 3 : EVENT OS COCKPIT (Voir le décalage & l'état régie en direct) */}
              <button
                type="button"
                onClick={() => setActiveTool(activeTool === 'event_os' ? 'none' : 'event_os')}
                className={`flex flex-col items-center gap-1 transition ${
                  activeTool === 'event_os' ? 'scale-110' : ''
                }`}
                title="Cockpit Event OS"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-md transition shadow-lg ${
                    activeTool === 'event_os'
                      ? 'bg-amber-400 text-black'
                      : 'bg-black/60 border border-white/20 text-white hover:bg-black/80'
                  }`}
                >
                  <Sliders size={18} />
                </div>
                <span className="text-[9.5px] font-mono font-bold text-white uppercase drop-shadow">
                  Régie
                </span>
              </button>

              {/* LIKE / DOUBLE-TAP */}
              <button
                type="button"
                onClick={handleDoubleTap}
                className="flex flex-col items-center gap-1 pt-1"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-md transition ${
                    isCurrentlyLiked ? 'bg-white text-black' : 'bg-black/60 border border-white/20 text-white'
                  }`}
                >
                  <Heart size={19} className={isCurrentlyLiked ? 'fill-black' : ''} />
                </div>
                <span className="text-[10px] font-mono font-bold text-white drop-shadow">
                  {currentLikesCount}
                </span>
              </button>

              {/* MUTE AUDIO */}
              <button
                type="button"
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.muted = !isMuted;
                    setIsMuted(!isMuted);
                  }
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 border border-white/20 text-white/80 backdrop-blur-md"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>

            {/* MODAL POPUP DU MODULE SÉLECTIONNÉ DANS LA STORY */}
            <AnimatePresence>
              {activeTool !== 'none' && (
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.95 }}
                  className="absolute inset-x-4 bottom-28 z-50 rounded-[28px] bg-[#0E0F16]/95 backdrop-blur-2xl border border-white/20 p-4 text-left shadow-2xl"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white/70">
                      {activeTool === 'radio' && 'Station Radio Live · Fréquence Dédiée'}
                      {activeTool === 'talkie' && 'Talkie-Walkie PTT · Fréquence Régie'}
                      {activeTool === 'event_os' && 'Cockpit Event OS · État du Jour J'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTool('none')}
                      className="text-white/40 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* 1. CONTENU MODULE RADIO DANS LA STORY */}
                  {activeTool === 'radio' && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[13px] font-bold text-white">
                            {currentStory.audioTrack.title}
                          </div>
                          <div className="text-[10px] font-mono text-white/60">
                            {currentStory.audioTrack.artist} · {currentStory.liveBpm} BPM
                          </div>
                        </div>
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                      <div className="rounded-xl bg-white/5 p-2 text-[10px] font-mono text-white/70 flex items-center justify-between">
                        <span>Flux public ouvert sans compte</span>
                        <span className="text-emerald-400 font-bold">128 kbps Opus</span>
                      </div>
                    </div>
                  )}

                  {/* 2. CONTENU MODULE TALKIE DANS LA STORY (Permet même au public d'écouter ou transmettre) */}
                  {activeTool === 'talkie' && (
                    <div className="mt-3 space-y-2.5">
                      <div className="text-[11px] font-mono text-white/80">
                        {currentStory.walkieSnippet.sender} ({currentStory.walkieSnippet.role}) :
                      </div>
                      <div className="text-[12px] font-medium text-emerald-300 italic bg-emerald-950/30 border border-emerald-500/20 p-2.5 rounded-xl">
                        « {currentStory.walkieSnippet.message} »
                      </div>

                      {/* Bouton tactile Push-To-Talk */}
                      <button
                        type="button"
                        onMouseDown={() => setIsPressingPTT(true)}
                        onMouseUp={() => {
                          setIsPressingPTT(false);
                          handleSendPTTVoice();
                        }}
                        onTouchStart={() => setIsPressingPTT(true)}
                        onTouchEnd={() => {
                          setIsPressingPTT(false);
                          handleSendPTTVoice();
                        }}
                        className={`w-full py-2 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider transition ${
                          isPressingPTT
                            ? 'bg-rose-500 text-white animate-pulse'
                            : 'bg-white text-black hover:bg-neutral-200'
                        }`}
                      >
                        {isPressingPTT ? '● Micro Ouvert · Transmission...' : 'Maintenir pour parler sur la fréquence'}
                      </button>
                    </div>
                  )}

                  {/* 3. CONTENU MODULE EVENT OS DANS LA STORY */}
                  {activeTool === 'event_os' && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-white/60">Écart au conducteur :</span>
                        <span className="text-amber-300 font-bold">
                          {simulatedDelay === 0 ? 'Nominal (0 min)' : `+${simulatedDelay} min reportées`}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                        <div className="rounded-xl bg-white/5 p-2 text-center">
                          <div className="text-white font-bold">{currentStory.liveBpm} BPM</div>
                          <div className="text-white/40">Cadence DJ</div>
                        </div>
                        <div className="rounded-xl bg-white/5 p-2 text-center">
                          <div className="text-emerald-400 font-bold">100%</div>
                          <div className="text-white/40">Prestataires prêts</div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* BAS DE LA STORY : SCRIPT VIVANT & CAPTATION MÉTIER */}
            <div className="absolute bottom-5 left-4 right-16 z-30 text-left space-y-1.5 pointer-events-none">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[9px] font-mono text-white/80 backdrop-blur-md border border-white/10">
                <Sparkles size={9} className="text-amber-300" />
                <span>Captation : {currentStory.cameraRole}</span>
              </div>

              <h4 className="text-[16px] font-bold text-white leading-tight drop-shadow">
                {currentStory.momentTitle}
              </h4>

              <p className="text-[12px] text-white/90 line-clamp-3 leading-snug drop-shadow italic">
                {currentStory.quoteOrDialogue}
              </p>

              {/* Titre audio défilant */}
              <div className="pt-0.5 flex items-center gap-1.5 text-[10.5px] font-mono text-white/70">
                <Radio size={11} className="text-emerald-400 animate-pulse" />
                <span className="truncate">
                  {currentStory.audioTrack.title} — {currentStory.audioTrack.artist}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Guide visuel de swipe vertical */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[10.5px] font-mono text-white/40 pointer-events-none">
        <ChevronUp size={12} className="animate-bounce" />
        <span>Glisser vers le haut pour le moment suivant</span>
      </div>
    </div>
  );
}
