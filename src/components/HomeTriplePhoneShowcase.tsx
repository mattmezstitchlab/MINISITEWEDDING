import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Briefcase, Sparkles, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { WEDDING_STYLES } from '../lib/weddingStyles';
import VisionImage from './vision/VisionImage';

const fadeUp = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
};

export default function HomeTriplePhoneShowcase({ onExplore }: { onExplore?: () => void }) {
  // Sélection de 3 univers contrastés pour illustrer la déclinaison infinie
  const demoStyle1 = WEDDING_STYLES.find((s) => s.id === 'desert') || WEDDING_STYLES[4]; // Desert Motel
  const demoStyle2 = WEDDING_STYLES.find((s) => s.id === 'club') || WEDDING_STYLES[3]; // Club Amour
  const demoStyle3 = WEDDING_STYLES.find((s) => s.id === 'brutal') || WEDDING_STYLES[2]; // Béton Brut

  return (
    <section className="relative overflow-hidden bg-[#07080D] px-4 py-20 sm:px-8 sm:py-32 text-white">
      {/* Halo de fond subtil */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 blur-[150px]" />

      <div className="relative mx-auto max-w-6xl">
        {/* En-tête aéré et contemporain */}
        <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="mx-auto max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.2em] text-white/60 backdrop-blur-md">
            Un écosystème · Décliné à l’infini
          </div>

          <h2 className="vp-title text-white" style={{ fontSize: 'clamp(2.4rem, 5.2vw, 4.2rem)', lineHeight: 1.05 }}>
            Trois regards synchronisés.<br />
            <span className="text-white/40">Zéro friction le Jour J.</span>
          </h2>

          <p className="text-[16px] sm:text-[18px] text-white/70 max-w-2xl mx-auto leading-relaxed">
            Chaque mariage génère son mini-site complet avec 3 interfaces vivantes :
            l'émotion pour les invités, le cockpit pour les mariés, et les outils techniques pour chaque corps de métier.
          </p>
        </motion.div>

        {/* TRIPTYQUE DES 3 IPHONES AÉRÉS */}
        <div className="mt-14 sm:mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-6 lg:gap-8 items-center">
          
          {/* IPHONE 1 : CÔTÉ INVITÉS (Exemple Desert Motel) */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="mb-4 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-300 border border-white/10">
                <Users size={12} />
                <span>01. Côté Invités</span>
              </span>
              <h3 className="text-[18px] font-bold text-white mt-1.5">L’Émotion &amp; le RSVP</h3>
              <p className="text-[12px] text-white/50">Programme poétique, carte d’accès, cagnotte</p>
            </div>

            {/* Mockup iPhone */}
            <div className="relative w-[260px] sm:w-[275px] rounded-[44px] bg-[#14151C] p-[8px] shadow-[0_30px_70px_rgba(0,0,0,0.8)] ring-1 ring-white/15 transition-transform duration-500 hover:scale-[1.02]">
              <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[36px] bg-[#0E0F16] text-white text-left p-3.5 pt-7">
                {/* Dynamic Island */}
                <div className="absolute left-1/2 top-2 h-[18px] w-[75px] -translate-x-1/2 rounded-full bg-black" />

                <div className="relative aspect-[16/11] rounded-[18px] overflow-hidden mb-3">
                  <img src={demoStyle1.image} alt="Desert" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <div className="text-[7.5px] uppercase tracking-wider text-amber-300 font-bold">Desert Motel</div>
                    <div className="text-[14px] font-bold">Léa &amp; Maxime</div>
                  </div>
                </div>

                <div className="space-y-2 text-[10px]">
                  <div className="rounded-[12px] bg-white/5 p-2 border border-white/10">
                    <div className="text-white/50 text-[8px] uppercase tracking-wider">Programme Jour J</div>
                    <div className="mt-1 font-semibold text-white">17h30 · Vœux dans la piscine vide</div>
                    <div className="text-white/60 text-[9px]">20h00 · Tacos &amp; Bières au néon</div>
                  </div>

                  <div className="rounded-[12px] bg-amber-400 p-2 text-center text-black font-bold">
                    Confirmer ma présence (RSVP)
                  </div>

                  <div className="rounded-[12px] bg-white/5 p-2 border border-white/10 text-white/70 text-[9px]">
                    📍 Joshua Tree, Motel 70s · Piscine privatisée
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* IPHONE 2 : CÔTÉ MARIÉS (Cockpit de contrôle en direct) */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="mb-4 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-rose-300 border border-rose-500/30">
                <Heart size={12} />
                <span>02. Côté Mariés</span>
              </span>
              <h3 className="text-[18px] font-bold text-white mt-1.5">Le Cockpit en Direct</h3>
              <p className="text-[12px] text-white/50">Flux temps réel, alertes régie, présence</p>
            </div>

            {/* Mockup iPhone central légèrement mis en avant */}
            <div className="relative w-[275px] sm:w-[290px] rounded-[46px] bg-[#181922] p-[8.5px] shadow-[0_35px_80px_rgba(244,63,94,0.2)] ring-1 ring-white/20 transition-transform duration-500 hover:scale-[1.03]">
              <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[38px] bg-[#0C0D14] text-white text-left p-4 pt-8">
                {/* Dynamic Island */}
                <div className="absolute left-1/2 top-2 h-[20px] w-[82px] -translate-x-1/2 rounded-full bg-black flex items-center justify-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                </div>

                <div className="border-b border-white/10 pb-2 mb-3">
                  <div className="text-[9px] uppercase tracking-wider text-rose-400 font-bold">Cockpit Jour J</div>
                  <div className="text-[15px] font-bold text-white">Camille &amp; Antoine</div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 mb-2.5">
                  <div className="rounded-[10px] bg-white/5 p-2 text-center border border-white/5">
                    <div className="text-[14px] font-bold text-white">96 / 100</div>
                    <div className="text-[7.5px] text-white/50 uppercase">Présents</div>
                  </div>
                  <div className="rounded-[10px] bg-emerald-500/10 p-2 text-center border border-emerald-500/20">
                    <div className="text-[14px] font-bold text-emerald-400">100%</div>
                    <div className="text-[7.5px] text-emerald-300 uppercase">Prestataires</div>
                  </div>
                </div>

                <div className="space-y-1.5 text-[9.5px]">
                  <div className="rounded-[10px] bg-white/5 p-2 border border-white/10">
                    <div className="text-white/40 text-[7.5px] uppercase">Alerte minute</div>
                    <div className="font-medium text-white">DJ Sound System prêt (02h17)</div>
                  </div>
                  <div className="rounded-[10px] bg-white/5 p-2 border border-white/10">
                    <div className="text-white/40 text-[7.5px] uppercase">Régie Bar &amp; Nuit</div>
                    <div className="font-medium text-white">Barista nocturne opérationnel</div>
                  </div>
                </div>

                <div className="mt-3 rounded-full bg-white/10 py-1.5 text-center text-[9px] font-bold text-white">
                  Contacter le régisseur
                </div>
              </div>
            </div>
          </motion.div>

          {/* IPHONE 3 : CÔTÉ MÉTIERS & MISSIONNAIRES (Fiche technique & Toolkit) */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <div className="mb-4 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-300 border border-indigo-500/30">
                <Briefcase size={12} />
                <span>03. Côté Métiers &amp; Talents</span>
              </span>
              <h3 className="text-[18px] font-bold text-white mt-1.5">La Fiche Mission Dédiée</h3>
              <p className="text-[12px] text-white/50">Implantation, horaires, outils spécialisés</p>
            </div>

            {/* Mockup iPhone */}
            <div className="relative w-[260px] sm:w-[275px] rounded-[44px] bg-[#14151C] p-[8px] shadow-[0_30px_70px_rgba(0,0,0,0.8)] ring-1 ring-white/15 transition-transform duration-500 hover:scale-[1.02]">
              <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[36px] bg-[#0E0F16] text-white text-left p-3.5 pt-7">
                {/* Dynamic Island */}
                <div className="absolute left-1/2 top-2 h-[18px] w-[75px] -translate-x-1/2 rounded-full bg-black" />

                <div className="rounded-[14px] bg-indigo-950/40 border border-indigo-500/30 p-2.5 mb-2.5">
                  <div className="text-[8px] uppercase tracking-wider text-indigo-400 font-bold">Mission Spécialiste</div>
                  <div className="text-[13px] font-bold text-white">Light Designer Architectural</div>
                  <div className="text-[8.5px] text-white/60 mt-0.5">Béton Brut · Bunker 16h30</div>
                </div>

                <div className="space-y-2 text-[9.5px]">
                  <div className="rounded-[10px] bg-white/5 p-2 border border-white/10">
                    <div className="text-white/40 text-[7.5px] uppercase">Règle Scénographique</div>
                    <div className="font-medium text-amber-300">« Faisceaux rasants sodium sans pivoine »</div>
                  </div>

                  <div className="rounded-[10px] bg-white/5 p-2 border border-white/10">
                    <div className="text-white/40 text-[7.5px] uppercase">Toolkit Synchronisé</div>
                    <div className="font-semibold text-white">Console Régie &amp; Chantier</div>
                    <div className="text-white/60 text-[8.5px]">Plan électrique &amp; décibels</div>
                  </div>

                  <div className="rounded-full bg-white py-1.5 text-center text-[9px] font-bold text-black">
                    Valider le top départ
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* LIGNE DE CONCLUSION & CTA RECTIFIÉ */}
        <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="mt-14 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <button
              type="button"
              onClick={onExplore}
              className="vp-btn vp-press !bg-white !text-black hover:!bg-neutral-200 !px-8 !py-3.5 !text-[14px] rounded-full shadow-2xl flex items-center gap-2"
            >
              <span>Générer votre mariage ou explorer une mission</span>
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="mt-3 text-[12px] text-white/40">
            Déclinable à l'infini pour tous les lieux insolites, châteaux, bunkers, déserts ou festivals.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
