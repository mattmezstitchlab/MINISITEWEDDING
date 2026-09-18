import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio,
  Sparkles,
  PhoneCall,
  Sliders,
  ArrowUp,
  Flame,
  Compass,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import WeddingLiveStoriesFeed from './WeddingLiveStoriesFeed';

interface UniversalMiniSiteToolbarProps {
  currentStyleId?: string | null;
  onOpenStories?: () => void;
}

export default function UniversalMiniSiteToolbar({
  currentStyleId,
  onOpenStories,
}: UniversalMiniSiteToolbarProps) {
  const [isStoriesOpen, setIsStoriesOpen] = useState(false);
  const location = useLocation();

  const handleOpenStoriesModal = () => {
    setIsStoriesOpen(true);
    onOpenStories?.();
  };

  const isPublicSite = location.pathname.startsWith('/p/');
  const isFeaturesPage = location.pathname.startsWith('/features');

  return (
    <>
      {/* Barre d'outils tactile flottante fixée en bas d'écran (Floating Dock visionOS) */}
      <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-md pointer-events-none">
        <div className="pointer-events-auto mx-auto flex items-center justify-between gap-2 rounded-full bg-[#0A0B10]/95 p-1.5 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          
          {/* 1. BOUTON STORY LIVE IMMERSIVE (Contient les modules Talkie, Radio, Event OS en direct) */}
          <button
            type="button"
            onClick={handleOpenStoriesModal}
            className="group relative flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-mono font-bold uppercase tracking-wider text-black shadow-lg transition hover:bg-neutral-200 active:scale-95"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-90" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Stories Live</span>
            <Flame size={12} className="fill-black" />
          </button>

          {/* 2. ACCÈS DIRECT AUX FRÉQUENCES RADIO & TALKIE */}
          <button
            type="button"
            onClick={handleOpenStoriesModal}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-mono text-white/70 hover:bg-white/10 hover:text-white transition"
            title="Écouter la fréquence en direct"
          >
            <Radio size={13} className="text-emerald-400" />
            <span className="hidden sm:inline">Fréquences</span>
          </button>

          {/* 3. COCKPIT / FEATURES SUITE */}
          <Link
            to="/features"
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-mono text-white/70 hover:bg-white/10 hover:text-white transition"
            title="Architecture Event OS"
          >
            <Sliders size={13} className="text-white/60" />
            <span className="hidden sm:inline">Event OS</span>
          </Link>

          {/* 4. REMONTER EN HAUT RAPIDEMENT */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white hover:text-black transition"
            title="Haut de page"
          >
            <ArrowUp size={13} />
          </button>

        </div>
      </div>

      {/* MODALE FULLSCREEN DES STORIES TIKTOK-STYLE AVEC LES OUTILS INTÉGRÉS */}
      <WeddingLiveStoriesFeed
        isOpen={isStoriesOpen}
        onClose={() => setIsStoriesOpen(false)}
      />
    </>
  );
}
