import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Radio,
  PhoneCall,
  Sliders,
  Shield,
  Zap,
  Sparkles,
  Compass,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PredictiveOrchestrationStudio from '../components/PredictiveOrchestrationStudio';
import TalkieWalkieStudio from '../components/TalkieWalkieStudio';
import VowsLiveRadioStudio from '../components/VowsLiveRadioStudio';
import UnifiedEventOsMenu from '../components/UnifiedEventOsMenu';

interface ModuleSection {
  id: string;
  number: string;
  title: string;
  shortLabel: string;
  icon: any;
  component: any;
}

const MODULES_LIST: ModuleSection[] = [
  {
    id: 'module-orchestration',
    number: '01',
    title: 'Orchestration Prédictive & Aléas Temporels',
    shortLabel: 'Orchestrateur',
    icon: Sliders,
    component: PredictiveOrchestrationStudio,
  },
  {
    id: 'module-talkie',
    number: '02',
    title: 'Talkie-Walkie WebRTC PTT par Canaux Métiers',
    shortLabel: 'Talkie-Walkie',
    icon: PhoneCall,
    component: TalkieWalkieStudio,
  },
  {
    id: 'module-radio',
    number: '03',
    title: 'VOWS ON AIR · Station Radio Streaming Live HD',
    shortLabel: 'Radio Live',
    icon: Radio,
    component: VowsLiveRadioStudio,
  },
];

export default function Features() {
  const [activeSectionId, setActiveSectionId] = useState('module-orchestration');

  // Détection de la section visible lors du défilement vertical
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const mod of MODULES_LIST) {
        const el = document.getElementById(mod.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSectionId(mod.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToModule = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FBFBFD] text-[#0B0C12] selection:bg-black selection:text-white pb-32">
      
      {/* Barre de navigation supérieure nette et blanche (identique à l'accueil) */}
      <nav className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-xl px-5 py-3.5 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-[13px] font-semibold text-[#0B0C12]/70 hover:text-black transition"
          >
            <ArrowLeft size={14} />
            <span>Accueil</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="vp-title text-[18px] font-bold italic tracking-wider text-[#0B0C12]">VOWS</span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-black/40">/ Event OS Suite</span>
          </div>

          <div className="flex items-center gap-2">
            <UnifiedEventOsMenu />
          </div>
        </div>
      </nav>

      {/* MENU VERTICAL FLOTTANT DE NAVIGATION LATÉRALE (Façon Story / TikTok tools à droite) */}
      <div className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-2.5 rounded-full bg-white/90 p-2 shadow-[0_15px_35px_rgba(0,0,0,0.08)] border border-black/8 backdrop-blur-xl">
        {MODULES_LIST.map((mod) => {
          const isActive = activeSectionId === mod.id;
          const Icon = mod.icon;

          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => scrollToModule(mod.id)}
              className={`group relative flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                isActive
                  ? 'bg-black text-white shadow-md scale-105'
                  : 'text-black/50 hover:bg-neutral-100 hover:text-black'
              }`}
              title={mod.title}
            >
              <Icon size={16} />
              
              {/* Tooltip au survol */}
              <span className="pointer-events-none absolute right-12 whitespace-nowrap rounded-lg bg-black px-2.5 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 shadow-md">
                {mod.shortLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* EN-TÊTE ÉDITORIAL DE LA SUITE EVENT OS (Typographies noires & fond blanc pur à la Apple) */}
      <header className="mx-auto max-w-4xl px-5 pt-16 pb-14 sm:px-8 sm:pt-24 text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-800">
          <Shield size={12} className="text-emerald-600" />
          <span>Architecture &amp; Modules Event OS</span>
        </div>

        <h1 className="vp-title text-[34px] sm:text-[50px] text-[#0B0C12] leading-[1.05]">
          La technologie invisible<br />
          qui orchestre le Jour J.
        </h1>

        <p className="mx-auto max-w-2xl text-[16px] sm:text-[18px] text-[#0B0C12]/60 leading-relaxed pt-2">
          Tous les modules indispensables réunis sur un seul axe vertical fluide.
          Aucun gros bloc opaque : chaque outil respire dans un design blanc épuré d'inspiration Apple.
        </p>

        {/* Pilules de saut direct vers chaque module */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-2">
          {MODULES_LIST.map((mod) => (
            <button
              key={mod.id}
              type="button"
              onClick={() => scrollToModule(mod.id)}
              className="flex items-center gap-1.5 rounded-full bg-white border border-black/10 px-4 py-2 text-[12.5px] font-semibold text-black hover:border-black/30 hover:shadow-sm transition"
            >
              <span>{mod.number}. {mod.shortLabel}</span>
              <ChevronDown size={12} className="opacity-40" />
            </button>
          ))}
        </div>
      </header>

      {/* GRANDE VERTICALE FLUIDE DES MODULES SUR FOND BLANC NOBLE */}
      <main className="mx-auto max-w-5xl px-5 sm:px-8 space-y-24">
        {MODULES_LIST.map((mod) => {
          const Component = mod.component;

          return (
            <section
              key={mod.id}
              id={mod.id}
              className="scroll-mt-24 rounded-[32px] bg-white p-6 sm:p-10 border border-black/6 shadow-[0_20px_60px_rgba(0,0,0,0.03)]"
            >
              <Component lightMode={true} />
            </section>
          );
        })}
      </main>

      {/* PIED DE PAGE DISCRET */}
      <footer className="mt-28 border-t border-black/5 pt-10 text-center text-[12px] font-mono text-black/40">
        VOWS EVENT OS · SUITE LOGICIELLE ÉVÉNEMENTIELLE UNIFIÉE
      </footer>

    </div>
  );
}
