import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio,
  Flame,
  Compass,
  ArrowUp,
  User,
  Sliders,
} from 'lucide-react';
import WeddingLiveStoriesFeed from './WeddingLiveStoriesFeed';
import UniverseDirectoryModal from './UniverseDirectoryModal';
import SaxophonistProfileModal from './SaxophonistProfileModal';
import type { WeddingStyle } from '../lib/weddingStyles';

interface UniversalMiniSiteToolbarProps {
  currentStyleId?: string | null;
  onOpenStories?: () => void;
  onSelectStyle?: (style: WeddingStyle) => void;
}

export default function UniversalMiniSiteToolbar({
  currentStyleId,
  onOpenStories,
  onSelectStyle,
}: UniversalMiniSiteToolbarProps) {
  const [isStoriesOpen, setIsStoriesOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isSaxProfileOpen, setIsSaxProfileOpen] = useState(false);

  return (
    <>
      {/* Barre d'outils tactile flottante fixée en bas d'écran (Uniquement avec des pictos ultra-épurés) */}
      <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-[#0A0B10]/95 px-3 py-1.5 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          
          {/* 1. PICTO STORIES LIVE VERTICALES TIKTOK */}
          <button
            type="button"
            onClick={() => setIsStoriesOpen(true)}
            className="group relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow-md transition hover:bg-neutral-200 active:scale-95"
            title="Stories Live"
          >
            <span className="relative flex h-2 w-2 absolute -top-0.5 -right-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-90" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            <Flame size={16} className="fill-black" />
          </button>

          {/* 2. PICTO CARTE RADAR LIVE */}
          <button
            type="button"
            onClick={() => setIsMapModalOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white transition"
            title="Carte Radar & Plan B à proximité"
          >
            <Compass size={17} className="text-emerald-400" />
          </button>

          {/* 3. PICTO MON PROFIL SAXOPHONISTE LIVE (Disponible pour tous les thèmes) */}
          <button
            type="button"
            onClick={() => setIsSaxProfileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white transition relative"
            title="Mon Mini-Site · Saxophoniste Live (Tous univers)"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 absolute top-1 right-1" />
            <User size={16} />
          </button>

          {/* 4. PICTO RADIO & FRÉQUENCES */}
          <button
            type="button"
            onClick={() => setIsStoriesOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white transition"
            title="Fréquences & Ondes"
          >
            <Radio size={16} />
          </button>

          {/* 5. PICTO HAUT DE PAGE */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white hover:text-black transition shrink-0 ml-1"
            title="Haut de page"
          >
            <ArrowUp size={14} />
          </button>

        </div>
      </div>

      {/* MODALE STORIES TIKTOK-STYLE */}
      <WeddingLiveStoriesFeed
        isOpen={isStoriesOpen}
        onClose={() => setIsStoriesOpen(false)}
      />

      {/* MODALE CARTE LIVE GÉOLOCALISÉE */}
      <UniverseDirectoryModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        selectedStyleId={currentStyleId}
        onSelectStyle={(style) => {
          onSelectStyle?.(style);
          setIsMapModalOpen(false);
        }}
      />

      {/* MODALE PROFIL SAXOPHONISTE LIVE DU CRÉATEUR */}
      <SaxophonistProfileModal
        isOpen={isSaxProfileOpen}
        onClose={() => setIsSaxProfileOpen(false)}
      />
    </>
  );
}
