import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WEDDING_STYLES, type WeddingStyle } from '../lib/weddingStyles';
import { contentFor } from '../lib/universeContent';
import HeroCycle from '../components/HeroCycle';
import BandeDuHero from '../components/BandeDuHero';
import { cartesDesUnivers } from '../lib/cartesVivantes';
import SiteHeader from '../components/SiteHeader';
import ParallaxSection from '../components/ParallaxSection';
import DjPlaylistStudio from '../components/DjPlaylistStudio';
import EditorShowcase from '../components/EditorShowcase';
import SuperMariageTeaser from '../components/SuperMariageTeaser';
import ComplementaryThemes from '../components/ComplementaryThemes';

import ErrorBoundary from '../components/ErrorBoundary';
import HomeCardShowcase from '../components/HomeCardShowcase';

const fadeUp = { initial: { opacity: 0, y: 26 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' } };


export default function Landing() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  // Par défaut : null = page principale générale d'atterrissage du site
  // Un article du magazine peut ouvrir directement un univers : « /?univers=corse »
  const [selectedStyle, setSelectedStyle] = useState<WeddingStyle | null>(() => {
    const id = searchParams.get('univers');
    return id ? WEDDING_STYLES.find((s) => s.id === id) ?? null : null;
  });
  /**
   * L'univers que le hero montre : il défile tout seul, et la bande s'aligne
   * dessus — chaque carte arrive au centre en même temps que son visuel.
   */
  const [universMontre, setUniversMontre] = useState(WEDDING_STYLES[0]!.id);
  /** Un média occupe le hero : le défilé attend, la carte joue. */
  const [lectureEnCours, setLectureEnCours] = useState(false);

  /** L'univers que la page montre : celui qu'on a choisi, sinon celui qui défile. */
  const activeStyleOrFallback = selectedStyle || WEDDING_STYLES[0];
  const afficheId = selectedStyle?.id ?? universMontre;
  /**
   * LE TITRE DU HERO EST CELUI DE L'UNIVERS
   *
   * Le hero montre un univers et il en porte le titre : celui que la bande met
   * au milieu, que l'univers défile tout seul ou qu'on l'ait choisi. Le site,
   * lui, continue plus bas — la carte, l'éditeur, la playlist.
   */
  const universAffiche = WEDDING_STYLES.find((s) => s.id === afficheId) ?? WEDDING_STYLES[0]!;
  const heroDeLUnivers = contentFor(universAffiche).hero;

  const handleSelectStyle = (style: WeddingStyle | null) => {
    setSelectedStyle(style);
    if (searchParams.has('univers')) setSearchParams({}, { replace: true });
  };

  /**
   * LA BANDE DU HERO — LES CARTES VIVANTES
   *
   * Les univers, en cartes musicales : elles grossissent au centre, portent le
   * nombre de personnes qui les aiment, et leur play allume le hero — le visuel
   * de l'univers et un morceau du Jour J. Un clic sur la carte choisit l'univers
   * que le hero montre — et sans choix, c'est la carte de l'univers qui défile
   * qui se centre, au même rythme que le hero.
   */
  const bandeDesUnivers = (
    <BandeDuHero
      libelle="Les univers"
      styleId={activeStyleOrFallback.id}
      cartes={cartesDesUnivers(() => undefined, afficheId)}
      onChoisir={(carte) => handleSelectStyle(WEDDING_STYLES.find((s) => s.id === carte.id) ?? null)}
      onLecture={setLectureEnCours}
    />
  );

  return (
    <div className="vp-env min-h-screen overflow-x-clip text-[#0B0C12] pb-16">
      {/* Le header du site : la même barre que partout. Les univers, eux, se
          parcourent dans la bande en bas du hero. */}
      <SiteHeader />

      {/* Le hero : le visuel de l'univers qui défile, et son titre */}
      <div id="hero">
      <HeroCycle activeStyleId={selectedStyle?.id} pause={lectureEnCours} onChange={setUniversMontre}>
        <div className="mx-auto flex flex-col items-center justify-center text-center">
          {/* Le titre de l'univers montré : il change quand le défilé passe à
              l'univers suivant, exactement comme le visuel. */}
          <div key={universAffiche.id} className="mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="vp-eyebrow !text-white/70">{heroDeLUnivers.kicker}</span>
              <h1
                className="vp-title mt-3 max-w-3xl text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
                style={{ fontSize: 'clamp(2.1rem, 5vw, 3.9rem)', lineHeight: 1.08 }}
              >
                {heroDeLUnivers.title}
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-white/80">
                {heroDeLUnivers.subtitle}
              </p>
            </motion.div>
          </div>
        </div>
      </HeroCycle>
      </div>

      {/* LA BANDE : sous le hero, sur blanc — la navigation du site, la carte de
          la page centrée, l'avis du public et le play. */}
      {bandeDesUnivers}

      {/* LA CARTE AVANT LE SITE : sous le hero, la carte — on voit ce qu'il
          reste à remplir. Les écrans de téléphone ont disparu : un univers se
          découvre dans son article. */}
      <ErrorBoundary>
        <div id="ecran">
          <HomeCardShowcase />
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
            <span className="vp-title text-[17px] font-bold italic tracking-wider text-[var(--vp-ink)]">SUPER MARIAGE</span>
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
