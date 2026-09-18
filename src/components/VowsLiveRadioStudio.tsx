import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Radio,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Disc3,
  Heart,
  Users,
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
    vibeTag: 'Basses Profondes · 128 BPM',
    bpm: 128,
    coverImage: '/images/club-amour.jpg',
    listenersCount: 168,
  },
];

export default function VowsLiveRadioStudio({ lightMode = false }: { lightMode?: boolean }) {
  const [currentProgIdx, setCurrentProgIdx] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeProg = LIVE_PROGRAMS[currentProgIdx];

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
      if (audioRef.current) audioRef.current.pause();
    };
  }, [currentProgIdx]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  if (lightMode) {
    // VERSION FOND BLANC NOBLE / APPLE STYLE
    return (
      <div className="w-full text-left text-[#0B0C12] space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-6">
          <div className="space-y-1">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-black/50">
              Module 03 · VOWS ON AIR (Radio Live Streaming)
            </div>
            <h3 className="vp-title text-[24px] sm:text-[30px] text-[#0B0C12]">
              La bande-son du Jour J diffusée en temps réel
            </h3>
            <p className="text-[14px] text-[#0B0C12]/60 max-w-xl leading-relaxed">
              Les proches à l'étranger ou les invités sur la route écoutent le flux officiel du mariage au fur et à mesure que la journée avance.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-full bg-neutral-100 p-2 border border-black/5 shrink-0 text-[11px] font-mono">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-semibold text-black">{activeProg.listenersCount} auditeurs en direct</span>
          </div>
        </div>

        {/* Lecteur Apple minimaliste */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-[24px] bg-white border border-black/8 shadow-sm text-center">
            <div className="h-44 w-44 rounded-[20px] overflow-hidden shadow-md relative">
              <img src={activeProg.coverImage} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white text-left">
                <div className="text-[13px] font-bold leading-tight">{activeProg.trackName}</div>
                <div className="text-[10px] text-white/70">{activeProg.artist}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={togglePlay}
              className="mt-4 flex items-center justify-center h-12 w-12 rounded-full bg-black text-white hover:bg-neutral-800 transition shadow-md"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>
          </div>

          <div className="md:col-span-7 p-6 rounded-[24px] bg-white border border-black/8 shadow-sm space-y-4">
            <div className="flex items-center justify-between text-[11px] font-mono text-black/40 border-b border-black/5 pb-2">
              <span className="uppercase">Conducteur Musical</span>
              <span>{activeProg.timeRange}</span>
            </div>

            <div className="space-y-1.5">
              {LIVE_PROGRAMS.map((prog, idx) => (
                <button
                  key={prog.id}
                  type="button"
                  onClick={() => {
                    setCurrentProgIdx(idx);
                    setIsPlaying(true);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-[14px] text-left transition border ${
                    idx === currentProgIdx
                      ? 'bg-black text-white border-black font-semibold'
                      : 'bg-[#FAFAFC] text-black border-black/5 hover:bg-white'
                  }`}
                >
                  <div>
                    <div className="text-[12.5px] font-bold">{prog.title}</div>
                    <div className="text-[10px] opacity-60 font-mono">{prog.trackName} — {prog.artist}</div>
                  </div>
                  <span className="text-[11px] font-mono opacity-80">{prog.timeRange}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Version standard
  return null;
}
