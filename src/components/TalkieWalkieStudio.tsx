import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Users,
  Shield,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowUpRight,
  ChevronDown,
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
    name: 'Canal 01 · Régie Générale & Mariés',
    roleHint: 'Coordination globale, tops départs et urgences',
    badgeColor: '#10B981', // Emerald
    membersCount: 8,
    lastTransmission: {
      speaker: 'Clara (Régie VOWS)',
      role: 'Régisseuse Générale',
      message: '« Cérémonie terminée. Lancement du cortège vers les cocktails. Top traiteur champagne dans 3 minutes. »',
      time: '18h28',
      audioWave: [30, 65, 90, 45, 80, 100, 50, 75, 40, 20],
    },
  },
  {
    id: 'traiteur-cuisine',
    name: 'Canal 02 · Traiteur & Cuisine Chaude',
    roleHint: 'Feu vert envoi des plats, timing cuissons, régimes',
    badgeColor: '#F59E0B', // Amber
    membersCount: 6,
    lastTransmission: {
      speaker: 'Chef Thomas',
      role: 'Chef Exécutif',
      message: '« Bien reçu la régie. Les 40 magrets fumés sont saisis. Envoi à 20h45 pile comme recalibré par l’algorithme. »',
      time: '20h12',
      audioWave: [20, 45, 70, 85, 60, 40, 90, 35, 25, 10],
    },
  },
  {
    id: 'dj-lumiere',
    name: 'Canal 03 · DJ & Light Designer',
    roleHint: 'Synchronisation faisceaux, montée en BPM, top entrée',
    badgeColor: '#EC4899', // Pink
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
    name: 'Canal 04 · Photo & Super 8mm',
    roleHint: 'Golden hour, placements discrets, vœux intimes',
    badgeColor: '#3B82F6', // Blue
    membersCount: 3,
    lastTransmission: {
      speaker: 'Léo (Argentique 35mm)',
      role: 'Photographe',
      message: '« Lumière dorée parfaite sur la verrière. 15 minutes de portraits rapides avec les témoins avant la nuit. »',
      time: '19h40',
      audioWave: [15, 35, 60, 80, 45, 65, 30, 20, 10, 5],
    },
  },
  {
    id: 'temoins-surprise',
    name: 'Canal 05 · Témoins (Canal Secret)',
    roleHint: 'Canal invisible aux mariés pour caler la surprise',
    badgeColor: '#8B5CF6', // Purple
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

export default function TalkieWalkieStudio() {
  const [activeChannelId, setActiveChannelId] = useState<ChannelId>('regie-generale');
  const [isPressingPTT, setIsPressingPTT] = useState(false); // Push-To-Talk
  const [isMuted, setIsMuted] = useState(false);
  const [radioStaticNoise, setRadioStaticNoise] = useState(false);
  const [liveTransmissions, setLiveTransmissions] = useState<Record<ChannelId, string[]>>({
    'regie-generale': ['Top départ cortège validé', 'Navettes 19h confirmées'],
    'traiteur-cuisine': ['Four 2 calé', 'Table 4 végétarien confirmé'],
    'dj-lumiere': ['Faisceau centré', 'Micro sans fil testé'],
    'photo-video': ['Pellicule 400 ISO chargée', 'Ciel dégagé pour 19h45'],
    'temoins-surprise': ['Projecteur 35mm testé', 'Mariés ne se doutent de rien'],
  });

  const activeChannel = CHANNELS.find((c) => c.id === activeChannelId) || CHANNELS[0];

  // Simulation d'un bip de relâchement PTT ("Roger Beep" pro)
  const pttTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleStartPTT = () => {
    setIsPressingPTT(true);
    setRadioStaticNoise(true);
  };

  const handleReleasePTT = () => {
    setIsPressingPTT(false);
    // Court "crr-kchhh" de radio pro
    if (pttTimeoutRef.current) clearTimeout(pttTimeoutRef.current);
    pttTimeoutRef.current = setTimeout(() => {
      setRadioStaticNoise(false);
    }, 400);

    // Ajout d'un message simulé dans le canal actif
    setLiveTransmissions((prev) => ({
      ...prev,
      [activeChannelId]: [
        `Transmission directe transmise sur ${activeChannel.name.split('·')[0].trim()} (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
        ...prev[activeChannelId].slice(0, 3),
      ],
    }));
  };

  return (
    <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#090A10] p-5 sm:p-8 text-white shadow-2xl">
      {/* Halo de fréquences radio */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-96 rounded-full blur-[130px] opacity-25 transition-colors duration-700"
        style={{ background: activeChannel.badgeColor }}
      />

      {/* En-tête du module Talkie-Walkie */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
            <Radio size={12} className="animate-pulse" />
            VOWS Event OS · Talkie-Walkie WebRTC Crypté
          </div>
          <h3 className="vp-title mt-2 text-[22px] sm:text-[28px] text-white">
            La Régie Audio Sans Téléphone ni WhatsApp
          </h3>
          <p className="mt-1 text-[13px] text-white/60 max-w-xl">
            Un bouton PTT (Push-To-Talk) instantané dans le navigateur de chaque intervenant.
            Canaux dédiés, pas de numéros de téléphone échangés, zéro pollution pour les mariés.
          </p>
        </div>

        {/* Témoin de connexion réseau WebRTC */}
        <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-3.5 py-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-mono font-bold text-emerald-400">Canal Audio Live</span>
          </div>
          <span className="text-white/20">|</span>
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="flex items-center gap-1 text-[11px] font-mono text-white/60 hover:text-white transition"
          >
            {isMuted ? <VolumeX size={13} className="text-rose-400" /> : <Volume2 size={13} />}
            <span>{isMuted ? 'Muet' : 'Écoute active'}</span>
          </button>
        </div>
      </div>

      {/* SÉLECTEUR DE CANAUX FRÉQUENCES RADIO */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {CHANNELS.map((ch) => {
          const isActive = ch.id === activeChannelId;

          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => setActiveChannelId(ch.id)}
              className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-white text-black shadow-lg font-bold scale-[1.02]'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              <span
                className="h-2 w-2 rounded-full shadow-sm"
                style={{ background: ch.badgeColor }}
              />
              <span>{ch.name.split('·')[1].trim()}</span>
              <span className="text-[10px] font-mono opacity-50">({ch.membersCount})</span>
            </button>
          );
        })}
      </div>

      {/* DISPOSITIF TALKIE-WALKIE STUDIO : L'INTERFACE PTT & HISTORIQUE D'ÉCOUTE */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* COLONNE GAUCHE : L'ÉMETTEUR PTT TACTILE PHYSIQUE (Le Talkie) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-[28px] bg-gradient-to-b from-[#13141E] to-[#0A0B10] border border-white/10 shadow-xl text-center">
          <div className="flex items-center justify-between w-full pb-4 border-b border-white/10 text-[11px] font-mono text-white/50">
            <span className="flex items-center gap-1.5">
              <Shield size={12} className="text-emerald-400" />
              <span>Cryptage Chiffré AES-256</span>
            </span>
            <span className="text-white/80">{activeChannel.name.split('·')[0].trim()}</span>
          </div>

          <div className="my-5">
            <div className="text-[16px] font-bold text-white">{activeChannel.name.split('·')[1].trim()}</div>
            <div className="text-[11.5px] text-white/50 mt-0.5">{activeChannel.roleHint}</div>
          </div>

          {/* GROS BOUTON PTT CIRCULAIRE (PUSH-TO-TALK) */}
          <div className="relative my-3">
            {/* Onde de transmission quand on maintient appuyé */}
            {isPressingPTT && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0.8 }}
                animate={{ scale: 1.35, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full"
                style={{ background: activeChannel.badgeColor }}
              />
            )}

            <button
              type="button"
              onMouseDown={handleStartPTT}
              onMouseUp={handleReleasePTT}
              onTouchStart={handleStartPTT}
              onTouchEnd={handleReleasePTT}
              className={`relative z-10 flex flex-col items-center justify-center h-32 w-32 rounded-full border-2 transition-all duration-200 select-none cursor-pointer shadow-2xl active:scale-95 ${
                isPressingPTT
                  ? 'border-white bg-rose-600 text-white shadow-[0_0_40px_rgba(225,29,72,0.6)]'
                  : 'border-white/20 bg-white/10 hover:bg-white/15 text-white'
              }`}
            >
              {isPressingPTT ? (
                <>
                  <Mic size={34} className="animate-pulse" />
                  <span className="mt-1 text-[11px] font-mono font-bold uppercase tracking-wider">
                    EN DIRECT
                  </span>
                </>
              ) : (
                <>
                  <Radio size={30} className="text-white/80" />
                  <span className="mt-1 text-[10px] font-mono font-bold uppercase tracking-wider text-white/80">
                    MAINTENIR PTT
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Consigne d'usage */}
          <p className="mt-3 text-[11px] font-mono text-white/40">
            {isPressingPTT
              ? '● Micro ouvert · Vous parlez à tout le canal'
              : 'Maintenez enfoncé pour transmettre votre voix'}
          </p>
        </div>

        {/* COLONNE DROITE : DERNIÈRE TRANSMISSION AUDIO & ONDE SPECTRALE */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6 rounded-[28px] bg-white/[0.02] border border-white/10 space-y-4">
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pb-2 border-b border-white/10">
              <span className="uppercase tracking-wider">Dernier Échange Transmis sur ce Canal</span>
              <span>{activeChannel.lastTransmission?.time || '18h28'}</span>
            </div>

            {activeChannel.lastTransmission && (
              <div className="mt-3.5 rounded-2xl bg-black/40 border border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: activeChannel.badgeColor }}
                    />
                    <span className="font-bold text-[14px] text-white">
                      {activeChannel.lastTransmission.speaker}
                    </span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9.5px] font-mono text-white/60">
                      {activeChannel.lastTransmission.role}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Reçu 5/5
                  </span>
                </div>

                <p className="mt-2 text-[13px] text-white/90 italic font-medium leading-relaxed">
                  {activeChannel.lastTransmission.message}
                </p>

                {/* Spectre audio visuel stylisé de la voix reçue */}
                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center gap-1.5 h-6">
                  {activeChannel.lastTransmission.audioWave.map((h, i) => (
                    <motion.span
                      key={i}
                      animate={{ height: [`${h * 0.4}%`, `${h}%`, `${h * 0.6}%`] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.08 }}
                      className="w-1.5 rounded-full"
                      style={{ background: activeChannel.badgeColor }}
                    />
                  ))}
                  <span className="ml-2 text-[9.5px] font-mono text-white/40">
                    Audio Haute Définition Opus 48kHz
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Fil des messages récents transmis sur ce canal */}
          <div className="space-y-1.5 pt-2">
            <div className="text-[10.5px] font-mono uppercase tracking-wider text-white/40">
              Activité récente du canal :
            </div>
            {liveTransmissions[activeChannelId].map((msg, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-[11px] font-mono text-white/60 bg-white/5 rounded-lg px-2.5 py-1.5"
              >
                <span className="text-emerald-400">●</span>
                <span className="truncate">{msg}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
            <span>Aucune installation d'application requise · Navigateur standard</span>
            <span className="text-emerald-400 font-mono">0.0 ms Latence P2P</span>
          </div>
        </div>

      </div>
    </div>
  );
}
