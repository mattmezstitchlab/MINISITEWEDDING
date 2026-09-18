import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Radio, PhoneCall, Sliders, Shield, Zap, Sparkles, Volume2, CheckCircle2, Compass, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import PredictiveOrchestrationStudio from '../components/PredictiveOrchestrationStudio';
import TalkieWalkieStudio from '../components/TalkieWalkieStudio';
import VowsLiveRadioStudio from '../components/VowsLiveRadioStudio';

const TABS = [
  { id: 'orchestrator', label: 'Orchestration Prédictive', icon: Sliders, hint: 'Résolution en cascade des retards' },
  { id: 'talkie', label: 'Talkie-Walkie WebRTC', icon: PhoneCall, hint: 'Régie audio PTT sans téléphone' },
  { id: 'radio', label: 'Radio Live Streaming', icon: Radio, hint: 'Diffusion HD pour les proches à distance' },
];

export default function Features() {
  const [activeTab, setActiveTab] = useState<'orchestrator' | 'talkie' | 'radio'>('orchestrator');

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#0B0C12] selection:bg-black selection:text-white pb-24">
      {/* Barre de navigation sobre et claire avec header blanc immaculé */}
      <nav className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-xl px-5 py-3 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-[13px] font-semibold text-[#0B0C12]/70 hover:text-black transition"
          >
            <ArrowLeft size={14} />
            <span>Retour à l'accueil</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="vp-title text-[18px] font-bold italic tracking-wider text-[#0B0C12]">VOWS</span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-black/40">/ Event OS Suite</span>
          </div>

          <div className="w-20" />
        </div>
      </nav>

      {/* En-tête éditorial sur fond blanc noble */}
      <div className="mx-auto max-w-4xl px-5 pt-14 pb-10 sm:px-8 sm:pt-16 text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-800">
          <Shield size={12} className="text-emerald-600" />
          <span>Architecture &amp; Modules Event OS</span>
        </div>

        <h1 className="vp-title text-[30px] sm:text-[44px] text-[#0B0C12] leading-tight">
          La technologie invisible<br />
          qui protège le Jour J.
        </h1>

        <p className="mx-auto max-w-2xl text-[15.5px] text-[#0B0C12]/60 leading-relaxed">
          Pour que les mariés et leurs invités ne retiennent que l’émotion, VOWS intègre une suite d’outils
          de régie temps réel, conçue pour opérer sans friction, sans groupe WhatsApp et sans stress.
        </p>

        {/* Bannière "Plan B / Last Minute & Secours à proximité" */}
        <div className="pt-2">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 px-4 py-2 text-[12px] font-medium text-amber-900">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Nouveau : Détection radar Plan B &amp; Mariages improvisés 48h active sur la carte</span>
          </div>
        </div>

        {/* Sélecteur d'onglets soigné noir et blanc */}
        <div className="pt-4 flex justify-center">
          <div className="inline-flex rounded-full bg-neutral-200/60 p-1 border border-black/5 shadow-inner">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-[12.5px] font-semibold transition ${
                    isActive
                      ? 'bg-white text-black shadow-sm font-bold'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-black' : 'text-neutral-400'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Conteneur du module sélectionné */}
      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        <AnimatePresence mode="wait">
          {activeTab === 'orchestrator' && (
            <motion.div
              key="orchestrator"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <PredictiveOrchestrationStudio />
            </motion.div>
          )}

          {activeTab === 'talkie' && (
            <motion.div
              key="talkie"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <TalkieWalkieStudio />
            </motion.div>
          )}

          {activeTab === 'radio' && (
            <motion.div
              key="radio"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <VowsLiveRadioStudio />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
