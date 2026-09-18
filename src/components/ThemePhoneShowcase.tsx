import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Users,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  CheckCircle2,
  FileText,
  Calendar,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Send,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { WEDDING_STYLES, type WeddingStyle, type HumanMissionRequirement } from '../lib/weddingStyles';
import { getThemeConfig } from '../lib/themeConfigs';
import { getScenesForStyle, type ThemeTimelineScene } from '../lib/themeTimelineScenarios';
import { formatDateLong, daysUntil } from '../lib/format';
import VisionImage from './vision/VisionImage';

export type MiniSiteViewMode = 'guests' | 'couples' | 'missionnaire';

interface ThemePhoneShowcaseProps {
  currentStyle: WeddingStyle;
  onOpenVendorApplication?: (role?: string) => void;
}

export default function ThemePhoneShowcase({
  currentStyle,
  onOpenVendorApplication,
}: ThemePhoneShowcaseProps) {
  const [viewMode, setViewMode] = useState<MiniSiteViewMode>('guests');
  const [selectedMissionIdx, setSelectedMissionIdx] = useState(0);

  const missions = currentStyle.humanMissions || [];
  const currentMission: HumanMissionRequirement | undefined = missions[selectedMissionIdx] || missions[0];
  const scenes = useMemo(() => getScenesForStyle(currentStyle.id), [currentStyle.id]);
  const config = useMemo(() => getThemeConfig(currentStyle.id), [currentStyle.id]);

  // Si on change de missionnaire
  const handleNextMission = () => {
    setSelectedMissionIdx((prev) => (prev + 1) % missions.length);
  };
  const handlePrevMission = () => {
    setSelectedMissionIdx((prev) => (prev - 1 + missions.length) % missions.length);
  };

  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-8 sm:py-24 bg-[#090A0F] text-white">
      {/* Halo d'ambiance aux couleurs du thème */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[450px] w-[650px] rounded-full blur-[140px] opacity-25"
        style={{ background: currentStyle.accent }}
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Titre et sélecteur de persona / vue */}
        <div className="mx-auto max-w-2xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-[11.5px] font-semibold text-white/70 uppercase tracking-widest backdrop-blur-md">
            <span className="h-2 w-2 rounded-full shadow-sm" style={{ background: currentStyle.accent }} />
            Univers {currentStyle.name} · Les 3 Visages de l'Écran
          </div>

          <h2 className="vp-title text-white" style={{ fontSize: 'clamp(2rem, 4.4vw, 3.4rem)', lineHeight: 1.1 }}>
            Un seul thème.<br />
            <span className="text-white/40">Chaque personne a son interface dédiée.</span>
          </h2>

          <p className="text-[15px] sm:text-[16px] text-white/70 max-w-xl mx-auto leading-relaxed">
            Faites défiler le mini-site pour découvrir l'expérience exacte des invités, le cockpit des mariés,
            ou la feuille de route sur-mesure d'un métier missionné.
          </p>

          {/* Onglets sélecteurs de points de vue */}
          <div className="pt-2 flex justify-center">
            <div className="inline-flex rounded-full bg-white/10 p-1 backdrop-blur-xl border border-white/10 shadow-xl">
              <button
                type="button"
                onClick={() => setViewMode('guests')}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-semibold transition ${
                  viewMode === 'guests'
                    ? 'bg-white text-black shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Users size={14} />
                <span>Invités</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('couples')}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-semibold transition ${
                  viewMode === 'couples'
                    ? 'bg-white text-black shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Heart size={14} />
                <span>Mariés</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('missionnaire')}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-semibold transition ${
                  viewMode === 'missionnaire'
                    ? 'bg-white text-black shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Briefcase size={14} />
                <span>Métiers & Missionnaires ({missions.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* CONTENEUR DE L'IPHONE ET DES COMMANDES LATÉRALES */}
        <div className="mt-12 flex flex-col items-center justify-center">
          {/* Si mode missionnaire : Sélecteur du métier spécifique parmi les rôles du thème */}
          {viewMode === 'missionnaire' && missions.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center justify-center gap-2 max-w-2xl">
              {missions.map((m, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedMissionIdx(idx)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition ${
                    selectedMissionIdx === idx
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  <Briefcase size={11} />
                  <span>{m.role}</span>
                </button>
              ))}
            </div>
          )}

          {/* MOCKUP IPHONE STUDIO */}
          <div className="relative">
            {/* Lueur d'appui au sol sous le smartphone */}
            <div
              className="absolute -inset-x-8 -bottom-6 h-28 rounded-[50%] opacity-50 blur-2xl transition-colors duration-500"
              style={{ background: `radial-gradient(closest-side, ${currentStyle.accent}66, transparent)` }}
            />

            {/* Boîtier iPhone en aluminium sombre et bordures céramiques */}
            <div className="relative w-[300px] sm:w-[330px] rounded-[50px] bg-[#111218] p-[10px] shadow-[0_45px_90px_-25px_rgba(0,0,0,0.9)] ring-1 ring-white/15">
              <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[40px] bg-[#0A0B10] text-white">
                {/* Dynamic Island Apple */}
                <div className="absolute left-1/2 top-2.5 z-30 h-[22px] w-[88px] -translate-x-1/2 rounded-full bg-black flex items-center justify-between px-2.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500/80 animate-pulse" />
                  <span className="text-[9px] font-mono text-white/50 tracking-tighter">VOWS</span>
                  <span className="h-2 w-2 rounded-full bg-white/15" />
                </div>

                {/* ÉCRAN DYNAMIQUE SELON LE MODE CHOISI */}
                <AnimatePresence mode="wait">
                  {viewMode === 'guests' && (
                    <motion.div
                      key={`guest-${currentStyle.id}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="no-scrollbar h-full w-full overflow-y-auto pt-9 pb-8 text-left"
                    >
                      {/* VUE INVITÉ : Hero avec photo du thème et carte d'invitation */}
                      <div className="relative h-[220px] w-full overflow-hidden">
                        <img
                          src={currentStyle.image}
                          alt={currentStyle.name}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10] via-black/40 to-transparent" />
                        <div className="absolute bottom-3 left-4 right-4">
                          <span
                            className="rounded-full px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-wider text-black"
                            style={{ background: currentStyle.accent }}
                          >
                            Invitation Privée
                          </span>
                          <h3 className="vp-title mt-1.5 text-[22px] text-white leading-tight">
                            Sarah &amp; Maxime
                          </h3>
                          <div className="text-[10px] text-white/80 mt-0.5">
                            {currentStyle.name} · {formatDateLong('2027-06-24')}
                          </div>
                        </div>
                      </div>

                      {/* Contenu invité : Programme & Accès */}
                      <div className="px-4 py-3 space-y-3">
                        <div className="rounded-[14px] bg-white/5 border border-white/10 p-3">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                            <Clock size={11} style={{ color: currentStyle.accent }} />
                            <span>Programme des Invités</span>
                          </div>
                          <div className="mt-2 space-y-1.5 text-[11px]">
                            {scenes.slice(0, 3).map((sc, i) => (
                              <div key={i} className="flex items-center justify-between py-1 border-b border-white/5 last:border-none">
                                <span className="font-mono text-white/50 text-[10px]">{sc.time}</span>
                                <span className="font-medium text-white/90 truncate ml-2">{sc.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Module RSVP Invité */}
                        <div className="rounded-[14px] bg-white/5 border border-white/10 p-3 text-center">
                          <div className="text-[11px] font-bold text-white">Confirmez votre présence</div>
                          <p className="text-[9.5px] text-white/60 mt-0.5">Avant le 15 mai · Régimes pris en compte</p>
                          <button
                            type="button"
                            className="mt-2.5 w-full rounded-full py-2 text-[11px] font-bold text-black shadow-md transition hover:opacity-90"
                            style={{ background: currentStyle.accent }}
                          >
                            Je confirme ma présence
                          </button>
                        </div>

                        {/* Cagnotte ou hébergements */}
                        <div className="rounded-[14px] bg-white/5 border border-white/10 p-3">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                            <MapPin size={11} style={{ color: currentStyle.accent }} />
                            <span>Accès &amp; Hébergements</span>
                          </div>
                          <p className="text-[10.5px] text-white/80 mt-1.5 leading-snug">
                            Navettes prévues toutes les 30 min depuis la gare. Hébergements recommandés sur le lien dédié.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {viewMode === 'couples' && (
                    <motion.div
                      key={`couple-${currentStyle.id}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="no-scrollbar h-full w-full overflow-y-auto pt-9 pb-8 text-left"
                    >
                      {/* VUE MARIÉS : Cockpit de pilotage Jour J */}
                      <div className="p-4 space-y-3.5">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <div>
                            <span className="text-[9.5px] font-bold uppercase tracking-wider text-white/40">Cockpit Mariés</span>
                            <h4 className="text-[16px] font-bold text-white leading-tight">Sarah &amp; Maxime</h4>
                          </div>
                          <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
                            En direct
                          </span>
                        </div>

                        {/* Métriques clés mariés */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-[14px] bg-white/5 border border-white/10 p-2.5 text-center">
                            <div className="text-[16px] font-bold text-white">84 / 92</div>
                            <div className="text-[9px] text-white/50 uppercase">RSVP Confirmés</div>
                          </div>
                          <div className="rounded-[14px] bg-white/5 border border-white/10 p-2.5 text-center">
                            <div className="text-[16px] font-bold text-emerald-400">100%</div>
                            <div className="text-[9px] text-white/50 uppercase">Équipe prête</div>
                          </div>
                        </div>

                        {/* Suivi des prestataires par les mariés */}
                        <div className="rounded-[14px] bg-white/5 border border-white/10 p-3">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-white/50 flex items-center justify-between">
                            <span>Équipe ({missions.length} métiers)</span>
                            <span className="text-emerald-400 text-[9px]">Tous synchronisés</span>
                          </div>
                          <div className="mt-2.5 space-y-1.5">
                            {missions.map((m, i) => (
                              <div key={i} className="flex items-center justify-between text-[10.5px] py-1 border-b border-white/5 last:border-none">
                                <span className="text-white/90 font-medium truncate max-w-[170px]">{m.role}</span>
                                <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Timing temps réel */}
                        <div className="rounded-[14px] bg-white/5 border border-white/10 p-3">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-white/50">Prochaine étape</div>
                          <div className="mt-1 text-[12px] font-bold text-white">{scenes[0]?.title || 'Cérémonie'}</div>
                          <div className="text-[10px] text-white/60 font-mono mt-0.5">{scenes[0]?.time || '16h00'} · Dans 2h14</div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {viewMode === 'missionnaire' && (
                    <motion.div
                      key={`vendor-${currentStyle.id}-${selectedMissionIdx}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="no-scrollbar h-full w-full overflow-y-auto pt-9 pb-8 text-left"
                    >
                      {/* VUE MISSIONNAIRE / PRESTATAIRE SPÉCIFIQUE */}
                      <div className="p-4 space-y-3">
                        <div className="rounded-[16px] bg-emerald-950/30 border border-emerald-500/30 p-3 text-left">
                          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                            <Briefcase size={10} />
                            <span>Fiche Mission Dédiée</span>
                          </div>
                          <div className="mt-1 text-[14px] font-bold text-white leading-tight">
                            {currentMission?.role || 'Mission Spécialiste'}
                          </div>
                          <div className="mt-1 text-[10px] text-white/70 leading-snug">
                            {currentMission?.mission}
                          </div>
                        </div>

                        {/* Outil & Compétence clé exigée pour ce thème */}
                        <div className="rounded-[14px] bg-white/5 border border-white/10 p-3">
                          <div className="text-[9.5px] font-bold uppercase tracking-wider text-white/50">
                            Exigence Scénographique VOWS
                          </div>
                          <div className="mt-1 text-[11px] font-semibold text-amber-300">
                            « {currentMission?.essentialSkill} »
                          </div>
                        </div>

                        {/* Fiche technique / Toolkit synchronisé */}
                        <div className="rounded-[14px] bg-white/5 border border-white/10 p-3 space-y-1.5">
                          <div className="text-[9.5px] font-bold uppercase tracking-wider text-white/50 flex items-center justify-between">
                            <span>{currentStyle.vendorToolkit.title}</span>
                            <span className="text-[8.5px] text-emerald-400 font-semibold">{currentStyle.vendorToolkit.badge}</span>
                          </div>
                          <p className="text-[10px] text-white/70 leading-relaxed">
                            {currentStyle.vendorToolkit.description}
                          </p>
                        </div>

                        {/* Bouton pour candidater ou synchroniser sa régie */}
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => onOpenVendorApplication?.(currentMission?.role)}
                            className="w-full flex items-center justify-center gap-1.5 rounded-full bg-white px-3 py-2 text-[11px] font-bold text-black shadow-lg hover:bg-neutral-200 transition"
                          >
                            <Send size={11} />
                            <span>Se proposer pour ce rôle</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Home bar d'Apple */}
                <div className="pointer-events-none absolute inset-x-0 bottom-1.5 z-30 flex justify-center">
                  <span className="h-1 w-24 rounded-full bg-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
