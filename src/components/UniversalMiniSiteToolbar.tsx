import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio,
  Sparkles,
  PhoneCall,
  Flame,
  Layers,
  ArrowUp,
  Sliders,
  Play,
  Volume2,
} from 'lucide-react';
import WeddingLiveStoriesFeed from './WeddingLiveStoriesFeed';

interface UniversalMiniSiteToolbarProps {
  onOpenStories?: () => void;
  onOpenWalkie?: () => void;
  onOpenRadio?: () => void;
  onOpenOrchestrator?: () => void;
}

export default function UniversalMiniSiteToolbar({
  onOpenStories,
  onOpenWalkie,
  onOpenRadio,
  onOpenOrchestrator,
}: UniversalMiniSiteToolbarProps) {
  const [isStoriesOpen, setIsStoriesOpen] = useState(false);

  const handleOpenStoriesModal = () => {
    setIsStoriesOpen(true);
    onOpenStories?.();
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <>
      {/* Barre d'outils tactile flottante fixée en bas d'écran (Floating Dock visionOS) */}
      <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-lg pointer-events-none">
        <div className="pointer-events-auto mx-auto flex items-center justify-between gap-1.5 rounded-full bg-[#0C0D14]/90 p-1.5 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          
          {/* 1. BOUTON STORY VIBRANTE / TIKTOK REEL WEDDING */}
          <button
            type="button"
            onClick={handleOpenStoriesModal}
            className="group relative flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 px-4 py-2 text-[12px] font-bold text-black shadow-lg transition hover:scale-105 active:scale-95"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            <span className="tracking-wide">Stories Live</span>
            <Flame size={13} className="fill-black" />
          </button>

          {/* 2. BOUTON RADIO LIVE VOWS ON AIR */}
          <button
            type="button"
            onClick={() => scrollToSection('radio-studio')}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[11.5px] font-medium text-white/80 hover:bg-white/10 hover:text-white transition"
            title="Ouvrir la Radio Live"
          >
            <Radio size={14} className="text-rose-400" />
            <span className="hidden sm:inline">Radio</span>
          </button>

          {/* 3. BOUTON TALKIE-WALKIE PTT */}
          <button
            type="button"
            onClick={() => scrollToSection('talkie-studio')}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[11.5px] font-medium text-white/80 hover:bg-white/10 hover:text-white transition"
            title="Talkie-Walkie PTT régie"
          >
            <PhoneCall size={13} className="text-emerald-400" />
            <span className="hidden sm:inline">Talkie</span>
          </button>

          {/* 4. BOUTON EVENT OS ORCHESTRATION */}
          <button
            type="button"
            onClick={() => scrollToSection('orchestration-engine')}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[11.5px] font-medium text-white/80 hover:bg-white/10 hover:text-white transition"
            title="Orchestration & Retards"
          >
            <Sliders size={13} className="text-amber-400" />
            <span className="hidden sm:inline">Event OS</span>
          </button>

          {/* 5. REMONTER EN HAUT RAPIDEMENT */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white hover:text-black transition"
            title="Haut de page"
          >
            <ArrowUp size={14} />
          </button>

        </div>
      </div>

      {/* MODALE FULLSCREEN DES STORIES TIKTOK-STYLE */}
      <WeddingLiveStoriesFeed
        isOpen={isStoriesOpen}
        onClose={() => setIsStoriesOpen(false)}
      />
    </>
  );
}
