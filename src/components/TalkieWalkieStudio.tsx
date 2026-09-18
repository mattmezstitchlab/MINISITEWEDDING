import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Radio,
  Mic,
  Volume2,
  VolumeX,
  Shield,
  ChevronRight,
} from 'lucide-react';

export type ChannelId = 'regie-generale' | 'traiteur-cuisine' | 'dj-lumiere' | 'photo-video' | 'temoins-surprise';

interface WalkieChannel {
  id: ChannelId;
  name: string;
  roleHint: string;
  badgeColor: string;
  membersCount: number;
  lastTransmission?: {
    speaker: string;
    role: string;
    message: string;
    time: string;
    audioWave: number[];
  };
}

const CHANNELS: WalkieChannel[] = [
  {
    id: 'regie-generale',
    name: 'Canal 01 · Régie Générale',
    roleHint: 'Coordination globale, tops départs et urgences',
    badgeColor: '#10B981',
    membersCount: 8,
    lastTransmission: {
      speaker: 'Clara (Régie VOWS)',
      role: 'Régisseuse Générale',
      message: '« Cérémonie terminée. Lancement du cortège vers les cocktails. Top champagne dans 3 minutes. »',
      time: '18h28',
      audioWave: [30, 65, 90, 45, 80, 100, 50, 75, 40, 20],
    },
  },
  {
    id: 'traiteur-cuisine',
    name: 'Canal 02 · Traiteur & Cuisine',
    roleHint: 'Feu vert envoi des plats, timing cuissons, régimes',
    badgeColor: '#F59E0B',
    membersCount: 6,
    lastTransmission: {
      speaker: 'Chef Thomas',
      role: 'Chef Exécutif',
      message: '« Bien reçu la régie. Les 40 magrets fumés sont saisis. Envoi à 20h45 pile. »',
      time: '20h12',
      audioWave: [20, 45, 70, 85, 60, 40, 90, 35, 25, 10],
    },
  },
  {
    id: 'dj-lumiere',
    name: 'Canal 03 · DJ & Lumière',
    roleHint: 'Synchronisation faisceaux, montée en BPM, top entrée',
    badgeColor: '#EC4899',
    membersCount: 4,
    lastTransmission: {
      speaker: 'Alex (DJ Sound Engineer)',
      role: 'DJ Résident',
      message: '« Prêt pour l’entrée des mariés. Faisceau zénithal 4000K calé, transition progressive 124 BPM armée. »',
      time: '20h30',
      audioWave: [50, 85, 100, 90, 95, 80, 100, 70, 85, 40],
    },
  },
  {
    id: 'photo-video',
    name: 'Canal 04 · Photo & Super 8',
    roleHint: 'Golden hour, placements discrets, vœux intimes',
    badgeColor: '#3B82F6',
    membersCount: 3,
    lastTransmission: {
      speaker: 'Léo (Argentique 35mm)',
      role: 'Photographe',
      message: '« Lumière dorée parfaite sur la verrière. 15 minutes de portraits rapides avant la nuit. »',
      time: '19h40',
      audioWave: [15, 35, 60, 80, 45, 65, 30, 20, 10, 5],
    },
  },
  {
    id: 'temoins-surprise',
    name: 'Canal 05 · Témoins (Secret)',
    roleHint: 'Canal invisible aux mariés pour caler la surprise',
    badgeColor: '#8B5CF6',
    membersCount: 5,
    lastTransmission: {
      speaker: 'Julien (Témoin)',
      role: 'Témoin du Marié',
      message: '« La vidéo surprise est branchée sur le projecteur du Canal 03. On envoie juste après le dessert ! »',
      time: '21h50',
      audioWave: [40, 70, 85, 60, 75, 90, 50, 30, 20, 15],
    },
  },
];

export default function TalkieWalkieStudio({ lightMode = false }: { lightMode?: boolean }) {
  const [activeChannelId, setActiveChannelId] = useState<ChannelId>('regie-generale');
  const [isPressingPTT, setIsPressingPTT] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [liveTransmissions, setLiveTransmissions] = useState<Record<ChannelId, string[]>>({
    'regie-generale': ['Top départ cortège validé', 'Navettes 19h confirmées'],
    'traiteur-cuisine': ['Four 2 calé', 'Table 4 végétarien confirmé'],
    'dj-lumiere': ['Faisceau centré', 'Micro sans fil testé'],
    'photo-video': ['Pellicule 400 ISO chargée', 'Ciel dégagé pour 19h45'],
    'temoins-surprise': ['Projecteur 35mm testé', 'Mariés ne se doutent de rien'],
  });

  const activeChannel = CHANNELS.find((c) => c.id === activeChannelId) || CHANNELS[0];

  const handleStartPTT = () => {
    setIsPressingPTT(true);
  };

  const handleReleasePTT = () => {
    setIsPressingPTT(false);
    setLiveTransmissions((prev) => ({
      ...prev,
      [activeChannelId]: [
        `Transmission directe transmise sur ${activeChannel.name.split('·')[0].trim()} (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
        ...prev[activeChannelId].slice(0, 2),
      ],
    }));
  };

  if (lightMode) {
    // VERSION FOND BLANC NOBLE / APPLE STYLE
    return (
      <div className="w-full text-left text-[#0B0C12] space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-6">
          <div className="space-y-1">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-black/50">
              Module 02 · Talkie-Walkie WebRTC Crypté
            </div>
            <h3 className="vp-title text-[24px] sm:text-[30px] text-[#0B0C12]">
              La coordination audio de régie sans WhatsApp
            </h3>
            <p className="text-[14px] text-[#0B0C12]/60 max-w-xl leading-relaxed">
              Chaque équipe (traiteur, DJ, photographe, mariés, témoins) dispose de son canal voix sécurisé directement dans le navigateur, avec bouton Push-To-Talk.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-neutral-100 p-2 border border-black/5 shrink-0 text-[11px] font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-black">WebRTC P2P Connecté</span>
          </div>
        </div>

        {/* Canaux sous forme de pills blanches */}
        <div className="flex flex-wrap items-center gap-2">
          {CHANNELS.map((ch) => {
            const isActive = ch.id === activeChannelId;

            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => setActiveChannelId(ch.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-medium transition ${
                  isActive
                    ? 'bg-black text-white shadow-md font-semibold'
                    : 'bg-white border border-black/10 text-black/70 hover:bg-neutral-50 hover:text-black'
                }`}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: ch.badgeColor }} />
                <span>{ch.name.split('·')[1].trim()}</span>
                <span className="text-[10px] opacity-60">({ch.membersCount})</span>
              </button>
            );
          })}
        </div>

        {/* Zone centrale Talkie en carte blanche Apple */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Bouton PTT tactile */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-[24px] bg-white border border-black/8 shadow-sm text-center">
            <div className="text-[14px] font-bold text-black">{activeChannel.name.split('·')[1].trim()}</div>
            <div className="text-[11px] text-black/50 mt-0.5">{activeChannel.roleHint}</div>

            <div className="my-5">
              <button
                type="button"
                onMouseDown={handleStartPTT}
                onMouseUp={handleReleasePTT}
                onTouchStart={handleStartPTT}
                onTouchEnd={handleReleasePTT}
                className={`flex flex-col items-center justify-center h-28 w-28 rounded-full border transition select-none cursor-pointer shadow-lg active:scale-95 ${
                  isPressingPTT
                    ? 'bg-black text-white border-black shadow-xl animate-pulse'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-black border-black/10'
                }`}
              >
                <Mic size={26} />
                <span className="mt-1 text-[9.5px] font-mono font-bold uppercase tracking-wider">
                  {isPressingPTT ? 'PARLEZ...' : 'MAINTENIR'}
                </span>
              </button>
            </div>

            <p className="text-[10.5px] font-mono text-black/40">
              {isPressingPTT ? '● Micro actif · En direct' : 'Maintenir pour parler au canal'}
            </p>
          </div>

          {/* Écoute de la dernière transmission */}
          <div className="md:col-span-7 p-6 rounded-[24px] bg-white border border-black/8 shadow-sm space-y-4">
            <div className="flex items-center justify-between text-[11px] font-mono text-black/40 border-b border-black/5 pb-2">
              <span className="uppercase">Dernière Transmission Audio</span>
              <span>{activeChannel.lastTransmission?.time}</span>
            </div>

            {activeChannel.lastTransmission && (
              <div className="rounded-[16px] bg-[#FAFAFC] border border-black/5 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[13px] text-black flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: activeChannel.badgeColor }} />
                    <span>{activeChannel.lastTransmission.speaker}</span>
                  </div>
                  <span className="text-[9.5px] font-mono bg-black/5 px-2 py-0.5 rounded-full text-black/60">
                    {activeChannel.lastTransmission.role}
                  </span>
                </div>

                <p className="text-[12.5px] text-black/80 italic font-medium">
                  {activeChannel.lastTransmission.message}
                </p>

                <div className="pt-2 flex items-center gap-1 h-5">
                  {activeChannel.lastTransmission.audioWave.map((h, i) => (
                    <span
                      key={i}
                      className="w-1 rounded-full bg-black/30"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                  <span className="ml-2 text-[9.5px] font-mono text-black/40">HD Opus 48kHz</span>
                </div>
              </div>
            )}

            <div className="space-y-1 text-[10.5px] font-mono text-black/60">
              {liveTransmissions[activeChannelId].map((msg, idx) => (
                <div key={idx} className="truncate">
                  ● {msg}
                </div>
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
