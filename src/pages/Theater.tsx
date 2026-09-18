import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  SlidersHorizontal,
  Clock,
  Sparkles,
  Maximize2,
  Calendar,
  Archive,
  Layers,
  ArrowRight,
} from 'lucide-react';
import TimelineTheaterStudio from '../components/TimelineTheaterStudio';
import UnifiedEventOsMenu from '../components/UnifiedEventOsMenu';
import UnifiedUniverseMenu from '../components/UnifiedUniverseMenu';
import UniversalMiniSiteToolbar from '../components/UniversalMiniSiteToolbar';

export default function Theater() {
  return (
    <div className="relative min-h-screen bg-[#FBFBFD] text-[#0B0C12] selection:bg-black selection:text-white pb-32">
      
      {/* BARRE DE NAVIGATION UNIFIÉE (Capsule VOWS identique à l'accueil et partout) */}
      <nav className="fixed top-3 left-1/2 z-50 w-[calc(100%-1.25rem)] max-w-5xl -translate-x-1/2 sm:top-4">
        <div className="flex items-center justify-between gap-3 rounded-[26px] bg-white px-4 py-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] ring-1 ring-black/5 sm:px-5">
          <Link
            to="/"
            className="flex items-center gap-2"
          >
            <span className="vp-title text-[18px] font-bold italic tracking-wider text-[#0B0C12]">VOWS</span>
          </Link>

          {/* Menus unifiés Event OS & Univers */}
          <div className="flex items-center gap-2 sm:gap-3">
            <UnifiedEventOsMenu />
            <UnifiedUniverseMenu
              selectedStyleId={null}
              onSelectStyle={(_style) => {
                window.location.href = '/';
              }}
            />
          </div>
        </div>
      </nav>

      {/* EN-TÊTE ÉDITORIAL DU STUDIO DE MONTAGE TEMPOREL */}
      <header className="mx-auto max-w-5xl px-5 pt-20 pb-8 sm:px-8 sm:pt-28 text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-800">
          <SlidersHorizontal size={12} className="text-black" />
          <span>Timeline Theater · Moteur Temporel de Haute Précision</span>
        </div>

        <h1 className="vp-title text-[32px] sm:text-[46px] text-[#0B0C12] leading-[1.08]">
          L'Atelier Temporel &amp; d'Alignement.<br />
          Du second-par-second aux archives d'une vie.
        </h1>

        <p className="mx-auto max-w-2xl text-[15px] sm:text-[17px] text-[#0B0C12]/60 leading-relaxed pt-1">
          Une véritable surface de montage spatialisée pour orchestrer le Jour J, anticiper les jalons du calendrier
          et sceller la mémoire documentaire de votre célébration.
        </p>
      </header>

      {/* SURFACE PRINCIPALE DU STUDIO */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-[36px] bg-white p-6 sm:p-10 border border-black/6 shadow-[0_25px_70px_rgba(0,0,0,0.03)]">
          <TimelineTheaterStudio standalone={true} />
        </div>
      </main>

      {/* TOOLBAR FLOTTANTE UNIVERSELLE AVEC PICTOS MINIMALISTES */}
      <UniversalMiniSiteToolbar />

      {/* FOOTER DISCRET */}
      <footer className="mt-24 border-t border-black/5 pt-8 text-center text-[11.5px] font-mono text-black/40">
        VOWS TIMELINE THEATER · ARCHITECTURE &amp; ORCHESTRATION SPATIALE DU TEMPS
      </footer>

    </div>
  );
}
