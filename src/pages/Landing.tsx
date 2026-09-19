import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { WEDDING_STYLES, type WeddingStyle } from '../lib/weddingStyles';
import { contentFor } from '../lib/universeContent';
import HeroCycle from '../components/HeroCycle';
import BandeauHero from '../components/BandeauHero';
import SiteHeader from '../components/SiteHeader';
import ParallaxSection from '../components/ParallaxSection';
import DjPlaylistStudio from '../components/DjPlaylistStudio';
import EditorShowcase from '../components/EditorShowcase';
import SuperMariageTeaser from '../components/SuperMariageTeaser';
import ComplementaryThemes from '../components/ComplementaryThemes';

import UniversePhoneScreens from '../components/UniversePhoneScreens';
import ErrorBoundary from '../components/ErrorBoundary';
import HomeCardShowcase from '../components/HomeCardShowcase';

const HERO_ROTATING_TITLES = [
  'Votre mariage. Votre histoire.\nUn seul endroit.',
  'Une vision. Des missionnaires.\nL’impossible devient réel.',
  'Mariés, invités, prestataires.\nLe même instant, sans fausse note.',
];


const fadeUp = { initial: { opacity: 0, y: 26 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' } };


export default function Landing() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  // Par défaut : null = page principale générale d'atterrissage VOWS
  // Un article du magazine peut ouvrir directement un univers : « /?univers=corse »
  const [selectedStyle, setSelectedStyle] = useState<WeddingStyle | null>(() => {
    const id = searchParams.get('univers');
    return id ? WEDDING_STYLES.find((s) => s.id === id) ?? null : null;
  });
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

  /** « Découvrir » descend d'un écran : la carte, puis le mini-site. */
  const descendreVersLaCarte = () => {
    if (selectedStyle) setSelectedStyle(null);
    const el = document.getElementById('ecran');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSelectStyle = (style: WeddingStyle | null) => {
    setSelectedStyle(style);
    if (searchParams.has('univers')) setSearchParams({}, { replace: true });
  };

  /**
   * LA BANDE DU HERO
   *
   * Les vingt-cinq univers, à l'horizontale, en bas du hero : d'un geste on
   * change celui qui se montre — et « Vue d'ensemble » revient au site entier.
   * C'est la navigation de l'accueil, à la place du menu déroulant du header.
   */
  const bandeDesUnivers = (
    <BandeauHero
      libelle="Les univers"
      note={`${WEDDING_STYLES.length} univers · faites défiler`}
      cartes={[
        {
          id: 'ensemble',
          titre: 'Vue d’ensemble',
          sousTitre: 'Le site entier',
          accent: 'rgba(255,255,255,0.8)',
          actif: !selectedStyle,
          onChoisir: () => handleSelectStyle(null),
        },
        ...WEDDING_STYLES.map((univers) => ({
          id: univers.id,
          titre: univers.name,
          image: univers.image,
          accent: univers.accent,
          actif: selectedStyle?.id === univers.id,
          onChoisir: () => handleSelectStyle(univers),
        })),
      ]}
    />
  );

  return (
    <div className="vp-env min-h-screen overflow-x-clip text-[#0B0C12] pb-16">
      {/* Le header du site : la même barre que partout. Les univers, eux, se
          parcourent dans la bande en bas du hero. */}
      <SiteHeader />

      {/* Hero plein écran : défilement cinématographique avec titres rotatifs explicatifs */}
      <div id="hero">
      <HeroCycle activeStyleId={selectedStyle?.id} bas={bandeDesUnivers}>
        <div className="mx-auto flex flex-col items-center justify-center text-center">
          {selectedStyle ? (
            /* Le hero de l'univers choisi : son visuel, sa présentation, ses chiffres */
            <div key={selectedStyle.id} className="mx-auto max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="vp-eyebrow !text-white/70">
                  {contentFor(selectedStyle).hero.kicker}
                </span>
                <h1
                  className="vp-title mt-3 max-w-3xl text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
                  style={{ fontSize: 'clamp(2.1rem, 5vw, 3.9rem)', lineHeight: 1.08 }}
                >
                  {contentFor(selectedStyle).hero.title}
                </h1>
                <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-white/80">
                  {contentFor(selectedStyle).hero.subtitle}
                </p>

                {/* Les informations propres à cet univers */}
                <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-2.5">
                  {contentFor(selectedStyle).hero.facts.map((fact) => (
                    <span
                      key={fact.label}
                      className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[12px] text-white backdrop-blur-sm"
                    >
                      <span className="font-mono text-[10px] uppercase tracking-wider text-white/55">
                        {fact.label}
                      </span>
                      <span className="ml-1.5 font-semibold">{fact.value}</span>
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          ) : (
            /* Hauteur fixe : le bloc de création en dessous ne bouge plus quand
               le titre tourne, et l'animation se fait dans un cadre stable. */
            <div className="flex h-[118px] items-center justify-center overflow-hidden sm:h-[138px] lg:h-[158px]">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={titleIdx}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="vp-title max-w-3xl text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] whitespace-pre-line"
                  style={{ fontSize: 'clamp(1.75rem, 4.2vw, 3.2rem)', lineHeight: 1.06 }}
                >
                  {HERO_ROTATING_TITLES[titleIdx]}
                </motion.h1>
              </AnimatePresence>
            </div>
          )}

          {/* L'ACTION UNIQUE DU HERO : un bouton, pas un formulaire. La carte se
              compose sur la page de création — et l'univers se découvre après,
              dans l'éditeur, une fois le mini-site ouvert. */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="mt-4 w-full"
          >
            {!selectedStyle && (
              <ErrorBoundary>
                <div id="hero-ai-container" className="mt-6 flex w-full flex-col items-center gap-3">
                  <button
                    type="button"
                    onClick={descendreVersLaCarte}
                    className="vp-btn vp-press !bg-white !px-8 !py-3.5 !text-black shadow-2xl hover:!bg-white/90"
                  >
                    Découvrir <ArrowRight size={16} />
                  </button>
                </div>
              </ErrorBoundary>
            )}
          </motion.div>
        </div>
      </HeroCycle>
      </div>

      {/* LA CARTE AVANT LE SITE : sous le hero, la carte remplace l'écran — on
          voit ce qu'il reste à remplir. Sur un univers précis, les trois écrans
          de cet univers prennent sa place. */}
      <ErrorBoundary>
        <div id="ecran">
          {selectedStyle ? (
            <UniversePhoneScreens currentStyle={selectedStyle} />
          ) : (
            <HomeCardShowcase />
          )}
        </div>
      </ErrorBoundary>

      {/* LE MINI-SITE COMPLET : l'éditeur, ses sections, et ce qu'il contient */}
      <div id="site">
        <EditorShowcase key={activeStyleOrFallback.id} styleId={activeStyleOrFallback.id} />
      </div>


      {/* LE MAGASIN : on coche ses horaires et ses métiers, le ticket suit */}
      <div id="supermarriage">
        <SuperMariageTeaser />
      </div>

      {/* SECTION SUGGESTIONS COMPLÉMENTAIRES D'UNIVERS & MISSIONS */}
      <div id="univers">
        <ComplementaryThemes
          currentStyle={activeStyleOrFallback}
          onClaimRole={(role) => {
            if (role) window.sessionStorage.setItem('vows:role-revendique', role);
            navigate('/creer', { state: { preselectedStyle: activeStyleOrFallback.id } });
          }}
        />
      </div>

      {/* SECTION PARALLAX 2 : Zéro contrainte */}
      <div id="contrainte">
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
      </div>

      {/* PLAYLIST COLLABORATIVE : en bas de page, tout de suite avant la capsule */}
      <section id="bande-son" className="bg-white py-16">
        <div className="vp-page">
          <DjPlaylistStudio style={activeStyleOrFallback} />
        </div>
      </section>

      <footer className="pb-24">
        <div className="vp-page">
        <div className="vp-glass vp-spec flex flex-col items-center justify-between gap-4 rounded-[26px] px-6 py-6 text-[13px] text-[var(--vp-muted)] sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="vp-title text-[17px] font-bold italic tracking-wider text-[var(--vp-ink)]">VOWS</span>
          </div>
          <div className="text-center">Votre mariage. Votre histoire. Un seul endroit.</div>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link to="/creer" className="font-semibold text-[var(--vp-ink)] no-underline hover:underline">
              Créer ma carte
            </Link>
            <Link to="/carte" className="font-semibold text-[var(--vp-ink)] no-underline hover:underline">
              J’ai déjà une carte
            </Link>
            <Link to="/prestataire" className="font-semibold text-[var(--vp-ink)] no-underline hover:underline">
              Espace prestataire
            </Link>
            <Link to="/le-mariage" className="font-semibold text-[var(--vp-ink)] no-underline hover:underline">
              Le mariage, en entier
            </Link>
            <Link to="/supermarriage" className="font-semibold text-[var(--vp-ink)] no-underline hover:underline">
              SuperMariage
            </Link>
          </div>
        </div>
        </div>
      </footer>
    </div>
  );
}
