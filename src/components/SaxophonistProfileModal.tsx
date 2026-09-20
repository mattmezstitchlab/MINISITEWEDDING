import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Music,
  CheckCircle2,
  Calendar,
  Sparkles,
  MapPin,
  Share2,
  Play,
  Pause,
  ExternalLink,
  Briefcase,
} from 'lucide-react';

interface SaxophonistProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SaxophonistProfileModal({ isOpen, onClose }: SaxophonistProfileModalProps) {
  const [isPlayingSample, setIsPlayingSample] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 text-[#0B0C12]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-lg rounded-[36px] bg-white p-6 sm:p-8 shadow-2xl border border-black/10 text-left overflow-hidden"
      >
        {/* Bouton fermer */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-black/70 hover:bg-black hover:text-white transition"
        >
          <X size={16} />
        </button>

        {/* En-tête profil saxophoniste */}
        <div className="flex items-center gap-4">
          <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-[22px] border border-black/10 shadow-md">
            <img
              src="/images/couple-paris.jpg"
              alt="Saxophoniste Live"
              className="h-full w-full object-cover"
            />
            <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[9.5px] font-mono font-bold uppercase tracking-wider text-emerald-800">
              <span>Disponible tous thèmes 2026/2027</span>
            </div>
            <h3 className="vp-title text-[22px] text-black leading-tight mt-1">
              Maxime B. · Saxophoniste Live &amp; Deep House
            </h3>
            <div className="text-[11.5px] text-black/60 font-mono mt-0.5 flex items-center gap-2">
              <span className="flex items-center gap-1"><MapPin size={11} /> Paris &amp; International</span>
              <span>•</span>
              <span className="font-semibold text-black">124 sets joués</span>
            </div>
          </div>
        </div>

        {/* Bio & Spécialité */}
        <div className="mt-5 space-y-3">
          <p className="text-[13.5px] text-black/80 leading-relaxed font-normal">
            Improvisation live au saxophone alto &amp; ténor par-dessus vos sets DJ.
            De la réverbération feutrée au coucher du soleil (Golden Hour) à l’explosion du dancefloor à 02h17.
          </p>

          {/* Adaptabilité tous univers */}
          <div className="rounded-[20px] bg-[#FAFAFC] border border-black/6 p-3.5 space-y-2">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-black/40">
              Adaptabilité Scénographique Super Mariage :
            </div>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="rounded-full bg-white border border-black/8 px-2.5 py-1 text-black font-medium">
                🎷 Rooftop &amp; Golden Hour
              </span>
              <span className="rounded-full bg-white border border-black/8 px-2.5 py-1 text-black font-medium">
                ⚡ Club 02h17 (Micro sans fil)
              </span>
              <span className="rounded-full bg-white border border-black/8 px-2.5 py-1 text-black font-medium">
                🏰 Châteaux &amp; Remparts
              </span>
              <span className="rounded-full bg-white border border-black/8 px-2.5 py-1 text-black font-medium">
                🖤 Fête de Dé-Mariage (Hymnes)
              </span>
            </div>
          </div>

          {/* Extrait sonore démo */}
          <div className="rounded-[18px] bg-black text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPlayingSample(!isPlayingSample)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black hover:bg-neutral-200 transition shrink-0"
              >
                {isPlayingSample ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
              </button>
              <div>
                <div className="text-[12.5px] font-bold">Improvisation Saxo Golden Hour</div>
                <div className="text-[10px] font-mono text-white/60">Extrait Live 48kHz · 118 BPM</div>
              </div>
            </div>

            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30">
              0:45
            </span>
          </div>
        </div>

        {/* Bouton de contact direct ou booking pour ce mini-site */}
        <div className="mt-6 pt-3 border-t border-black/10 flex items-center justify-between">
          <span className="text-[11.5px] text-black/50 font-mono">
            Régie son sans fil autonome incluse
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-black px-5 py-2.5 text-[12px] font-bold text-white hover:bg-neutral-800 transition shadow-md"
          >
            Bloquer une date sur mon planning
          </button>
        </div>
      </motion.div>
    </div>
  );
}
