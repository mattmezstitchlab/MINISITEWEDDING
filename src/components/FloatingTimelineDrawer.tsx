import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Maximize2,
  Clock,
  Sparkles,
  ArrowRight,
  Music,
  User,
  SlidersHorizontal,
  ChevronUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { INITIAL_TIMELINE_ITEMS, type TimelineTrackItem } from '../lib/timelineTheaterEngine';

interface FloatingTimelineDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeThemeName?: string;
}

export default function FloatingTimelineDrawer({
  isOpen,
  onClose,
  activeThemeName = 'Général',
}: FloatingTimelineDrawerProps) {
  const [selectedMoment, setSelectedMoment] = useState<TimelineTrackItem>(INITIAL_TIMELINE_ITEMS[2]); // Cocktail & Sax par défaut

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          className="fixed inset-x-0 bottom-0 z-50 pointer-events-auto"
        >
          {/* Ombre de profondeur */}
          <div className="mx-auto max-w-5xl px-3 sm:px-6 pb-3">
            <div className="relative overflow-hidden rounded-[32px] bg-white/95 backdrop-blur-2xl border border-black/10 shadow-[0_-20px_60px_rgba(0,0,0,0.18)] p-5 text-[#0B0C12]">
              
              {/* Poignée supérieure & En-tête du tiroir */}
              <div className="flex items-center justify-between pb-4 border-b border-black/8">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white">
                    <SlidersHorizontal size={13} />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-black/50 font-bold">
                      Timeline Theater · Bandeau Rétractable
                    </div>
                    <div className="text-[14px] font-bold text-black flex items-center gap-2">
                      <span>Synchronisation du Jour J</span>
                      <span className="text-[11px] font-mono text-black/40 font-normal">({activeThemeName})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/theater"
                    onClick={onClose}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black text-white text-[11.5px] font-bold hover:bg-neutral-800 transition shadow-sm"
                  >
                    <span>Ouvrir l'Atelier Studio Complet</span>
                    <Maximize2 size={11} />
                  </Link>

                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-black hover:bg-neutral-200 transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* DÉFILEMENT HORIZONTAL DES MOMENTS JOUR J DU THÈME */}
              <div className="mt-4 no-scrollbar flex items-center gap-3 overflow-x-auto pb-2 pt-1">
                {INITIAL_TIMELINE_ITEMS.filter((m) => m.mode === 'jour-j').map((moment) => {
                  const isSelected = selectedMoment.id === moment.id;

                  return (
                    <button
                      key={moment.id}
                      type="button"
                      onClick={() => setSelectedMoment(moment)}
                      className={`shrink-0 w-64 text-left p-3 rounded-[20px] transition-all border ${
                        isSelected
                          ? 'bg-black text-white border-black shadow-md scale-[1.01]'
                          : 'bg-[#F7F7F8] text-black border-black/5 hover:bg-white hover:border-black/20'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-1 border-b border-current/10">
                        <span className="font-mono text-[10px] font-bold">{moment.startTime}</span>
                        <span className="font-mono text-[9px] opacity-60">{moment.durationMinutes}m</span>
                      </div>
                      <div className="font-bold text-[12px] truncate mt-1.5">{moment.title}</div>
                      <div className="text-[10px] opacity-60 truncate mt-0.5">
                        {moment.alignedRole || moment.subtitle}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* BANDE INFÉRIEURE : FOCUS SUR LE MOMENT SÉLECTIONNÉ & MINI-SITE ASSOCIÉ */}
              {selectedMoment && (
                <div className="mt-3 pt-3 border-t border-black/8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12px]">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <div>
                      <span className="font-bold text-black">{selectedMoment.title}</span>
                      <span className="text-black/50 ml-2 font-mono">
                        {selectedMoment.startTime} · {selectedMoment.durationMinutes} min
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-black/70">
                    {selectedMoment.alignedRole && (
                      <span className="flex items-center gap-1.5 text-[11px] font-mono bg-black/5 px-2.5 py-1 rounded-full">
                        <User size={11} />
                        <span>{selectedMoment.alignedRole}</span>
                      </span>
                    )}

                    <Link
                      to="/theater"
                      onClick={onClose}
                      className="font-bold text-black hover:underline flex items-center gap-1"
                    >
                      <span>Ajuster sur la règle</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              )}

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
