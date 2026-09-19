import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WeddingStyle, HumanMissionRequirement } from '../lib/weddingStyles';
import { getScenesForStyle } from '../lib/themeTimelineScenarios';
import { formatDateLong } from '../lib/format';

export type MiniSiteViewMode = 'guests' | 'couples' | 'missionnaire';

interface ThemePhoneShowcaseProps {
  currentStyle: WeddingStyle;
  onOpenVendorApplication?: (role?: string) => void;
}

export default function ThemePhoneShowcase({
  currentStyle,
  onOpenVendorApplication,
}: ThemePhoneShowcaseProps) {
  // Les boutons qui surplombaient le téléphone ont été retirés : l'écran ouvre
  // la vue invité, et rien ne le domine. Les deux autres écrans restent écrits
  // ci-dessous, prêts à revenir si un jour un sélecteur reprend sa place.
  const [viewMode] = useState<MiniSiteViewMode>('guests');
  const [selectedMissionIdx] = useState(0);

  const isDivorce = currentStyle.id === 'divorce-party';
  const missions = currentStyle.humanMissions || [];
  const currentMission: HumanMissionRequirement | undefined = missions[selectedMissionIdx] || missions[0];
  const scenes = useMemo(() => getScenesForStyle(currentStyle.id), [currentStyle.id]);

  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-8 sm:py-24 bg-[#FBFBFD] text-[#0B0C12] border-b border-black/5">
      <div className="relative mx-auto max-w-5xl">
        {/* Titre et sélecteur de persona / vue épuré sur fond blanc noble */}
        <div className="mx-auto max-w-2xl text-center space-y-3.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3.5 py-1 text-[11px] font-mono font-bold text-black uppercase tracking-widest shadow-sm">
            <span className="h-2 w-2 rounded-full shadow-sm" style={{ background: currentStyle.accent }} />
            {isDivorce ? 'Dé-Mariage & Liberté' : `Univers ${currentStyle.name}`} · 3 Regards Synchronisés
          </div>

          <h2 className="vp-title text-[#0B0C12]" style={{ fontSize: 'clamp(2rem, 4.4vw, 3.4rem)', lineHeight: 1.1 }}>
            {isDivorce ? (
              <>Célébrer la fin avec élégance.<br /><span className="text-black/40">Zéro rancœur, pure fête.</span></>
            ) : (
              <>Un seul univers.<br /><span className="text-black/40">Chaque personne a son interface dédiée.</span></>
            )}
          </h2>

          <p className="text-[15px] sm:text-[16px] text-[#0B0C12]/60 max-w-xl mx-auto leading-relaxed">
            {isDivorce
              ? "L'invitation pour les vrais amis, le cockpit solo pour suivre la cagnotte du nouveau départ, et la régie du rituel."
              : "Faites défiler le mini-site pour découvrir l'expérience exacte des invités, le cockpit des mariés, ou la feuille de route d'un métier missionné."}
          </p>

        </div>

        {/* CONTENEUR DE L'IPHONE SUR FOND BLANC NOBLE */}
        <div className="mt-12 flex items-center justify-center">
          {/* MOCKUP IPHONE STUDIO NOIR SUR FOND BLANC PUR */}
          <div className="relative">
            {/* Châssis iPhone Apple en noir pur ciselé */}
            <div className="relative w-[300px] sm:w-[325px] rounded-[50px] bg-[#0A0B10] p-[9.5px] shadow-[0_35px_90px_rgba(0,0,0,0.18)] ring-1 ring-black/10">
              <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[41px] bg-white text-[#0B0C12]">
                {/* Dynamic Island Apple */}
                <div className="absolute left-1/2 top-2.5 z-30 h-[20px] w-[84px] -translate-x-1/2 rounded-full bg-black flex items-center justify-between px-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[8.5px] font-mono text-white/50">VOWS</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                </div>

                {/* ÉCRAN DYNAMIQUE SELON LE MODE CHOISI */}
                <AnimatePresence mode="wait">
                  {viewMode === 'guests' && (
                    <motion.div
                      key={`guest-${currentStyle.id}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.25 }}
                      className="no-scrollbar h-full w-full overflow-y-auto pt-9 pb-8 text-left bg-white"
                    >
                      {/* VUE INVITÉ : Hero avec photo du thème */}
                      <div className="relative h-[210px] w-full overflow-hidden">
                        <img
                          src={currentStyle.image}
                          alt={currentStyle.name}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                        <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                          <span
                            className="rounded-full px-2 py-0.5 text-[8.5px] font-mono font-bold uppercase tracking-wider text-black bg-white"
                          >
                            {isDivorce ? 'Fête de Dé-Mariage' : 'Invitation Privée'}
                          </span>
                          <h3 className="vp-title mt-1 text-[20px] text-white leading-tight">
                            {isDivorce ? 'Hugo (Officiellement Libre)' : 'Sarah & Gabriel'}
                          </h3>
                          <div className="text-[10px] text-white/80 mt-0.5 font-mono">
                            {formatDateLong('2026-10-18')} · {isDivorce ? 'Paris Rooftop' : currentStyle.name}
                          </div>
                        </div>
                      </div>

                      {/* Contenu invité : Programme & Accès */}
                      <div className="p-3.5 space-y-2.5 bg-[#FAFAFC]">
                        <div className="rounded-[14px] bg-white border border-black/6 p-3 shadow-sm">
                          <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-black/40">
                            {isDivorce ? 'Programme de la Rupture' : 'Programme Jour J'}
                          </div>
                          <div className="mt-2 space-y-1.5 text-[11px]">
                            {scenes.slice(0, 3).map((sc, i) => (
                              <div key={i} className="flex items-center justify-between py-1 border-b border-black/5 last:border-none">
                                <span className="font-mono text-black/50 text-[10px]">{sc.time}</span>
                                <span className="font-medium text-black truncate ml-2">{sc.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Module RSVP Invité */}
                        <div className="rounded-[14px] bg-white border border-black/6 p-3 text-center shadow-sm">
                          <div className="text-[11px] font-bold text-black">
                            {isDivorce ? 'Confirmer ma présence pour fêter ça' : 'Confirmez votre présence'}
                          </div>
                          <button
                            type="button"
                            className="mt-2 w-full rounded-full py-1.5 text-[10.5px] font-bold text-white bg-black shadow-sm"
                          >
                            Je viens célébrer la liberté
                          </button>
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
                      transition={{ duration: 0.25 }}
                      className="no-scrollbar h-full w-full overflow-y-auto pt-9 pb-8 text-left bg-[#FAFAFC]"
                    >
                      {/* VUE COCKPIT SOLO OU MARIÉS */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-black/5 pb-2.5">
                          <div>
                            <span className="text-[9px] font-mono uppercase text-black/40">
                              {isDivorce ? 'Cockpit Dé-Mariage' : 'Cockpit Jour J'}
                            </span>
                            <h4 className="text-[15px] font-bold text-black leading-tight">
                              {isDivorce ? 'Hugo · Renaissance' : 'Sarah & Gabriel'}
                            </h4>
                          </div>
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[8.5px] font-mono font-bold text-emerald-800 border border-emerald-200">
                            En direct
                          </span>
                        </div>

                        {/* Métriques clés */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-[12px] bg-white border border-black/6 p-2.5 text-center shadow-sm">
                            <div className="text-[15px] font-bold text-black">
                              {isDivorce ? '42 / 45' : '84 / 92'}
                            </div>
                            <div className="text-[8px] font-mono uppercase text-black/40">Amis confirmés</div>
                          </div>
                          <div className="rounded-[12px] bg-white border border-black/6 p-2.5 text-center shadow-sm">
                            <div className="text-[15px] font-bold text-emerald-600">
                              {isDivorce ? '2 400 €' : '100%'}
                            </div>
                            <div className="text-[8px] font-mono uppercase text-black/40">
                              {isDivorce ? 'Cagnotte Solo' : 'Équipe prête'}
                            </div>
                          </div>
                        </div>

                        {/* Prochaine étape */}
                        <div className="rounded-[12px] bg-white border border-black/6 p-3 shadow-sm">
                          <div className="text-[8.5px] font-mono uppercase text-black/40">Top suivant</div>
                          <div className="mt-1 text-[12px] font-bold text-black">{scenes[0]?.title}</div>
                          <div className="text-[9.5px] text-black/50 font-mono mt-0.5">{scenes[0]?.time} · En préparation</div>
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
                      transition={{ duration: 0.25 }}
                      className="no-scrollbar h-full w-full overflow-y-auto pt-9 pb-8 text-left bg-[#FAFAFC]"
                    >
                      {/* VUE FICHE TECHNIQUE MÉTIER */}
                      <div className="p-4 space-y-3">
                        <div className="rounded-[14px] bg-white border border-black/6 p-3 shadow-sm">
                          <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-black/50">
                            Fiche Mission Dédiée
                          </div>
                          <div className="mt-1 text-[13px] font-bold text-black leading-tight">
                            {currentMission?.role}
                          </div>
                          <div className="mt-1 text-[10px] text-black/60 leading-snug">
                            {currentMission?.mission}
                          </div>
                        </div>

                        <div className="rounded-[14px] bg-white border border-black/6 p-3 shadow-sm">
                          <div className="text-[9px] font-mono uppercase text-black/40">Règle Scénographique</div>
                          <div className="mt-1 text-[10.5px] font-semibold text-black">
                            « {currentMission?.essentialSkill} »
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onOpenVendorApplication?.(currentMission?.role)}
                          className="w-full py-2 rounded-full bg-black text-white text-[10.5px] font-bold shadow-md hover:bg-neutral-800 transition"
                        >
                          Se proposer pour ce rôle
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Home bar d'Apple */}
                <div className="pointer-events-none absolute inset-x-0 bottom-1.5 z-30 flex justify-center">
                  <span className="h-1 w-24 rounded-full bg-black/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
