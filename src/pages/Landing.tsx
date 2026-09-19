import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { WEDDING_STYLES, getDirectionArtistiqueImage, type WeddingStyle } from '../lib/weddingStyles';
import HeroCycle from '../components/HeroCycle';
import UnifiedUniverseMenu from '../components/UnifiedUniverseMenu';
import ParallaxSection from '../components/ParallaxSection';
import DjPlaylistStudio from '../components/DjPlaylistStudio';
import ComplementaryThemes from '../components/ComplementaryThemes';
import HeroAiPrompt from '../components/HeroAiPrompt';

import ThemePhoneShowcase from '../components/ThemePhoneShowcase';
import ErrorBoundary from '../components/ErrorBoundary';
import HomePhoneShowcase from '../components/HomePhoneShowcase';

const HERO_ROTATING_TITLES = [
  'Votre mariage. Votre histoire.\nUn seul endroit.',
  'Une vision. Des missionnaires.\nL’impossible devient réel.',
  'Mariés, invités, prestataires.\nLe même instant, sans fausse note.',
];


const fadeUp = { initial: { opacity: 0, y: 26 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' } };


export default function Landing() {
  // Par défaut : null = page principale générale d'atterrissage VOWS
  const [selectedStyle, setSelectedStyle] = useState<WeddingStyle | null>(null);
  const [titleIdx, setTitleIdx] = useState(0);

  const activeStyleOrFallback = selectedStyle || WEDDING_STYLES[0];

  // Rotation douce des 3 phrases manifestes qui font comprendre le produit
  useEffect(() => {
    if (selectedStyle) return;
    const interval = setInterval(() => {
      setTitleIdx((prev) => (prev + 1) % HERO_ROTATING_TITLES.length);
    }, 4800);
    return () => clearInterval(interval);
  }, [selectedStyle]);

  const scrollToHero = () => {
    const el = document.getElementById('hero-ai-container');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const input = el.querySelector('input');
      input?.focus();
    }
  };

  const handleSelectStyle = (style: WeddingStyle | null) => {
    setSelectedStyle(style);
  };

  return (
    <div className="vp-env min-h-screen overflow-x-clip text-[#0B0C12] pb-16">
      {/* Barre de navigation unifiée : Logo à gauche, UNIVERS & MÉTIERS à droite */}
      <nav className="fixed top-3 left-1/2 z-50 w-[calc(100%-1.25rem)] max-w-5xl -translate-x-1/2 sm:top-4">
        <div className="flex items-center justify-between gap-3 rounded-[26px] bg-white px-4 py-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] ring-1 ring-black/5 sm:px-5">
          <Link
            to="/"
            onClick={() => setSelectedStyle(null)}
            className="flex items-center gap-2"
          >
            <span className="vp-title text-[18px] font-bold italic tracking-wider text-[#0B0C12]">VOWS</span>
          </Link>

          {/* Le menu des univers : les vingt environnements du catalogue */}
          <div className="flex items-center gap-2 sm:gap-3">
            <UnifiedUniverseMenu
              selectedStyleId={selectedStyle?.id || null}
              onSelectStyle={handleSelectStyle}
            />
          </div>
        </div>
      </nav>

      {/* Hero plein écran : défilement cinématographique avec titres rotatifs explicatifs */}
      <HeroCycle activeStyleId={selectedStyle?.id}>
        <div className="mx-auto flex flex-col items-center justify-center text-center">
          <div className="min-h-[140px] sm:min-h-[160px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.h1
                key={selectedStyle ? selectedStyle.id : titleIdx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="vp-title max-w-4xl text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] whitespace-pre-line"
                style={{ fontSize: 'clamp(2.4rem, 6vw, 4.6rem)', lineHeight: 1.08 }}
              >
                {selectedStyle
                  ? `${selectedStyle.name} · ${selectedStyle.tagline}`
                  : HERO_ROTATING_TITLES[titleIdx]}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Saisie de l'Agent IA connecté à tous les thèmes */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="mt-4 w-full"
          >
            <ErrorBoundary>
              <HeroAiPrompt
                onProposalGenerated={(proposal) => {
                  setSelectedStyle(proposal.style);
                }}
              />
            </ErrorBoundary>
          </motion.div>
        </div>
      </HeroCycle>

      {/* L'ÉCRAN DU COUPLE : un seul téléphone, qui remonte d'un tiers sur le hero.
          Sur un univers précis, l'iPhone interactif permet de faire défiler les vues. */}
      <ErrorBoundary>
        {!selectedStyle ? (
          <HomePhoneShowcase />
        ) : (
          <ThemePhoneShowcase
            currentStyle={selectedStyle}
            onOpenVendorApplication={() => scrollToHero()}
          />
        )}
      </ErrorBoundary>

      {/* SECTION DIRECTION ARTISTIQUE & SCÉNOGRAPHIE */}
      <ParallaxSection
        image={
          selectedStyle
            ? getDirectionArtistiqueImage(selectedStyle.id)
            : '/images/table-noir.jpg'
        }
        overlayOpacity={0.62}
        heightClass="min-h-[72vh]"
      >
        <motion.div {...fadeUp} transition={{ duration: 0.8 }} className="mx-auto max-w-3xl text-center">
          <span className="vp-eyebrow !text-white/70">
            {selectedStyle
              ? `Direction Artistique & Scénographie · ${selectedStyle.name}`
              : 'Direction Artistique & Haute Scénographie'}
          </span>
          <h2
            className="vp-title mt-4 text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
            style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)', lineHeight: 1.05 }}
          >
            {selectedStyle ? (
              <>
                L’émotion d’une esthétique pure.<br />
                {selectedStyle.tagline}
              </>
            ) : (
              <>
                Des univers créés comme des pièces de mode.<br />
                Jamais de templates génériques.
              </>
            )}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-white/80">
            {selectedStyle?.manifesto ||
              "Chaque mariage possède son langage visuel, sa typographie et ses métiers dédiés. De la chapelle de béton au château contemporain, explorez des atmosphères sans concession."}
          </p>
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={scrollToHero}
              className="vp-btn vp-press !bg-white !text-black hover:!bg-white/90 !px-8 !py-3.5 shadow-2xl"
            >
              Donner vie à votre projet <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </ParallaxSection>

      {/* STUDIO DJ & BANDE-SON CHRONOLOGIQUE */}
      <section className="px-5 py-16 sm:px-8 bg-[#070709]">
        <div className="mx-auto max-w-6xl">
          <DjPlaylistStudio style={activeStyleOrFallback} />
        </div>
      </section>

      {/* SECTION SUGGESTIONS COMPLÉMENTAIRES D'UNIVERS & MISSIONS */}
      <ComplementaryThemes
        currentStyle={activeStyleOrFallback}
        onSelectStyle={handleSelectStyle}
      />

      {/* SECTION PARALLAX 2 : Zéro contrainte */}
      <ParallaxSection image="/images/zero-contrainte-wedding.jpg" overlayOpacity={0.65} heightClass="min-h-[70vh]">
        <motion.div {...fadeUp} transition={{ duration: 0.8 }} className="mx-auto max-w-3xl">
          <span className="vp-eyebrow !text-white/70">Zéro contrainte</span>
          <h2
            className="vp-title mt-4 text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
            style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)', lineHeight: 1.1 }}
          >
            Le plus beau jour se vit.<br />
            Il ne s’administre pas.
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-[16.5px] leading-relaxed text-white/80">
            Fini les tableaux Excel et les messages perdus. Tout converge naturellement au même endroit,
            avec une élégance qui impressionne vos invités dès la première seconde.
          </p>
        </motion.div>
      </ParallaxSection>

      <footer className="px-5 pb-10">
        <div className="vp-glass vp-spec mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 rounded-[26px] px-6 py-6 text-[13px] text-[var(--vp-muted)] sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="vp-title text-[17px] font-bold italic tracking-wider text-[var(--vp-ink)]">VOWS</span>
          </div>
          <div className="text-center">Votre mariage. Votre histoire. Un seul endroit.</div>
          <div className="flex items-center gap-4">
          </div>
        </div>
      </footer>
    </div>
  );
}
