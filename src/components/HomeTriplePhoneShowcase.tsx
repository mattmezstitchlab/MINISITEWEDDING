import { useState } from 'react';
import { motion } from 'framer-motion';
import { WEDDING_STYLES } from '../lib/weddingStyles';
import { getThemeConfig } from '../lib/themeConfigs';
import { formatDateLong, daysUntil } from '../lib/format';
import VisionImage from './vision/VisionImage';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
};

/**
 * Rendu épuré, haute couture & monochrome d'un mini-site à l'intérieur du téléphone.
 * Respect strict du design system blanc, noir profond et typographies éditoriales,
 * avec photo hero correspondant fidèlement à l'univers.
 */
function ElegantMiniSiteScreen({
  style,
  roleLabel,
  viewType,
}: {
  style: any;
  roleLabel: string;
  viewType: 'guest' | 'couple' | 'vendor';
}) {
  const config = getThemeConfig(style.id);

  return (
    <div className="h-full w-full bg-white text-[#111116] flex flex-col justify-between overflow-hidden text-left">
      {/* Hero photo cinématique plein écran correspondant au thème */}
      <div className="relative h-[48%] w-full overflow-hidden shrink-0">
        <VisionImage
          src={style.image}
          alt={style.name}
          className="h-full w-full object-cover"
        />
        {/* Dégradé monochrome subtil */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        {/* Badge discret blanc pur en haut à gauche */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full shadow-sm"
            style={{ background: style.accent }}
          />
          <span className="rounded-full bg-white/95 px-2 py-0.5 text-[8.5px] font-mono font-bold uppercase tracking-wider text-[#111116] shadow-sm">
            {roleLabel}
          </span>
        </div>

        {/* Titre & Couple */}
        <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
          <div className="text-[8px] font-mono uppercase tracking-[0.2em] text-white/70">
            {style.name}
          </div>
          <div className="vp-title text-[20px] sm:text-[22px] leading-none mt-1">
            Sarah &amp; Gabriel
          </div>
          <div className="text-[9.5px] font-mono text-white/80 mt-1 flex items-center justify-between">
            <span>{formatDateLong('2027-06-12')}</span>
            <span className="font-semibold text-white/90">J-267</span>
          </div>
        </div>
      </div>

      {/* Corps intérieur sobre et aéré */}
      <div className="flex-1 p-3.5 space-y-2.5 overflow-hidden flex flex-col justify-center bg-[#FAFAFC]">
        {viewType === 'guest' && (
          <>
            <div className="rounded-[12px] bg-white p-2.5 border border-black/5 shadow-sm space-y-1">
              <div className="text-[8.5px] font-mono uppercase tracking-wider text-black/40">Programme Jour J</div>
              <div className="text-[10px] font-semibold text-black flex items-center justify-between">
                <span>16h30 · Cérémonie &amp; Vœux</span>
                <span className="font-mono text-[9px] text-black/50">Lieu d'exception</span>
              </div>
              <div className="text-[10px] font-semibold text-black flex items-center justify-between">
                <span>18h30 · Cocktail &amp; Toasts</span>
                <span className="font-mono text-[9px] text-black/50">Coucher de soleil</span>
              </div>
            </div>

            <div className="rounded-[12px] bg-[#111116] text-white p-2 text-center text-[9.5px] font-bold shadow-sm">
              Confirmer ma présence (RSVP)
            </div>
          </>
        )}

        {viewType === 'couple' && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-[12px] bg-white p-2 border border-black/5 shadow-sm text-center">
                <div className="text-[14px] font-bold text-black">84 / 92</div>
                <div className="text-[8px] font-mono uppercase text-black/40">RSVP reçus</div>
              </div>
              <div className="rounded-[12px] bg-white p-2 border border-black/5 shadow-sm text-center">
                <div className="text-[14px] font-bold text-black">100%</div>
                <div className="text-[8px] font-mono uppercase text-black/40">Équipe prête</div>
              </div>
            </div>

            <div className="rounded-[12px] bg-white p-2 border border-black/5 shadow-sm">
              <div className="text-[8px] font-mono uppercase text-black/40">Alerte Timing</div>
              <div className="text-[9.5px] font-bold text-black mt-0.5 truncate">
                Photographe argentique en place
              </div>
            </div>
          </>
        )}

        {viewType === 'vendor' && (
          <>
            <div className="rounded-[12px] bg-white p-2.5 border border-black/5 shadow-sm space-y-1">
              <div className="text-[8.5px] font-mono uppercase tracking-wider text-black/40">Fiche Mission</div>
              <div className="text-[10px] font-bold text-black truncate">
                {style.humanMissions[0]?.role || 'Missionnaire Dédié'}
              </div>
              <div className="text-[9px] text-black/60 line-clamp-2 leading-tight">
                {style.vendorToolkit.description}
              </div>
            </div>

            <div className="rounded-[12px] bg-white p-2 border border-black/5 shadow-sm flex items-center justify-between">
              <span className="text-[8.5px] font-mono text-black/50">Conducteur technique</span>
              <span className="text-[9px] font-bold text-black">Prêt pour régie</span>
            </div>
          </>
        )}
      </div>

      {/* Signature minimale en bas */}
      <div className="p-2 text-center text-[8px] font-mono tracking-widest text-black/30 border-t border-black/5 uppercase">
        VOWS · ARCHITECTURE ÉVÉNEMENTIELLE
      </div>
    </div>
  );
}

export default function HomeTriplePhoneShowcase({ onExplore }: { onExplore?: () => void }) {
  // Sélection de 3 univers singuliers du catalogue
  const styleGuest = WEDDING_STYLES.find((s) => s.id === 'noir-blanc') || WEDDING_STYLES[0];
  const styleCouple = WEDDING_STYLES.find((s) => s.id === 'chateau-moderne') || WEDDING_STYLES[1];
  const styleVendor = WEDDING_STYLES.find((s) => s.id === 'desert') || WEDDING_STYLES[4];

  return (
    <section className="relative overflow-hidden bg-[#FAFAFC] px-5 py-20 sm:px-8 sm:py-32 border-b border-black/5">
      <div className="relative mx-auto max-w-6xl">
        {/* En-tête aéré, haut de gamme et noble */}
        <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="mx-auto max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-1.5 text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#0B0C12] shadow-sm">
            <span>Décliné à l'infini · VisionOS Studio</span>
          </div>

          <h2 className="vp-title text-[#0B0C12]" style={{ fontSize: 'clamp(2.4rem, 5.2vw, 4.2rem)', lineHeight: 1.05 }}>
            Ce que chacun ouvre<br />
            <span className="text-[#0B0C12]/40">sur son propre écran.</span>
          </h2>

          <p className="text-[16px] sm:text-[17.5px] text-[#0B0C12]/60 max-w-2xl mx-auto leading-relaxed">
            Un seul lien. Trois interfaces contemporaines et coordonnées. L’invitation pour vos proches,
            le cockpit de bord pour les mariés, et la fiche mission pour chaque talent.
          </p>
        </motion.div>

        {/* TRIPTYQUE DES 3 IPHONES LUXUEUX & AÉRÉS (Châssis sombres ciselés, écrans blancs contrastés) */}
        <div className="mt-14 sm:mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-6 lg:gap-10 items-center">
          
          {/* IPHONE 1 : CÔTÉ INVITÉS */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="mb-4 text-center">
              <span className="inline-block rounded-full bg-white border border-black/10 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-black shadow-sm">
                01. Côté Invités
              </span>
              <h3 className="text-[18px] font-bold text-[#0B0C12] mt-2">L’Émotion &amp; le RSVP</h3>
              <p className="text-[12px] text-[#0B0C12]/50">Histoire, programme, hébergements</p>
            </div>

            {/* Châssis iPhone studio noir pur */}
            <div className="relative w-[265px] sm:w-[285px] rounded-[48px] bg-[#0E0F14] p-[9px] shadow-[0_35px_80px_rgba(0,0,0,0.18)] ring-1 ring-black/10 transition-transform duration-500 hover:scale-[1.02]">
              <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[40px] bg-white">
                {/* Dynamic Island Apple */}
                <div className="absolute left-1/2 top-2.5 z-20 h-[19px] w-[80px] -translate-x-1/2 rounded-full bg-black" />
                
                <ElegantMiniSiteScreen
                  style={styleGuest}
                  roleLabel="Invité · Célébration"
                  viewType="guest"
                />

                {/* Home bar Apple */}
                <div className="pointer-events-none absolute inset-x-0 bottom-1.5 z-20 flex justify-center">
                  <span className="h-1 w-24 rounded-full bg-black/20" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* IPHONE 2 : CÔTÉ MARIÉS */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="mb-4 text-center">
              <span className="inline-block rounded-full bg-black px-3.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-white shadow-md">
                02. Côté Mariés
              </span>
              <h3 className="text-[18px] font-bold text-[#0B0C12] mt-2">Le Cockpit en Direct</h3>
              <p className="text-[12px] text-[#0B0C12]/50">Flux temps réel &amp; suivi des talents</p>
            </div>

            {/* Châssis iPhone central */}
            <div className="relative w-[275px] sm:w-[295px] rounded-[50px] bg-[#0A0B10] p-[9.5px] shadow-[0_45px_100px_rgba(0,0,0,0.22)] ring-1 ring-black/15 transition-transform duration-500 hover:scale-[1.03]">
              <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[41px] bg-white">
                {/* Dynamic Island Apple avec micro point de repère */}
                <div className="absolute left-1/2 top-2.5 z-20 h-[20px] w-[84px] -translate-x-1/2 rounded-full bg-black flex items-center justify-between px-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                </div>

                <ElegantMiniSiteScreen
                  style={styleCouple}
                  roleLabel="Cockpit · Mariés"
                  viewType="couple"
                />

                {/* Home bar Apple */}
                <div className="pointer-events-none absolute inset-x-0 bottom-1.5 z-20 flex justify-center">
                  <span className="h-1 w-24 rounded-full bg-black/20" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* IPHONE 3 : CÔTÉ MÉTIERS & TALENTS */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <div className="mb-4 text-center">
              <span className="inline-block rounded-full bg-white border border-black/10 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-black shadow-sm">
                03. Côté Métiers
              </span>
              <h3 className="text-[18px] font-bold text-[#0B0C12] mt-2">La Fiche Technique</h3>
              <p className="text-[12px] text-[#0B0C12]/50">Régie, conducteurs &amp; logistique</p>
            </div>

            {/* Châssis iPhone studio noir pur */}
            <div className="relative w-[265px] sm:w-[285px] rounded-[48px] bg-[#0E0F14] p-[9px] shadow-[0_35px_80px_rgba(0,0,0,0.18)] ring-1 ring-black/10 transition-transform duration-500 hover:scale-[1.02]">
              <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[40px] bg-white">
                {/* Dynamic Island Apple */}
                <div className="absolute left-1/2 top-2.5 z-20 h-[19px] w-[80px] -translate-x-1/2 rounded-full bg-black" />

                <ElegantMiniSiteScreen
                  style={styleVendor}
                  roleLabel="Fiche Mission · Régie"
                  viewType="vendor"
                />

                {/* Home bar Apple */}
                <div className="pointer-events-none absolute inset-x-0 bottom-1.5 z-20 flex justify-center">
                  <span className="h-1 w-24 rounded-full bg-black/20" />
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* LIGNE DE CONCLUSION MINIMALISTE SANS BLOCS SURCHARGÉS */}
        <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="mt-14 text-center">
          <button
            type="button"
            onClick={onExplore}
            className="vp-btn vp-press !bg-black !text-white hover:!bg-neutral-800 !px-8 !py-3.5 !text-[13.5px] rounded-full shadow-lg"
          >
            Explorer tous les univers et fiches métiers
          </button>
        </motion.div>
      </div>
    </section>
  );
}
