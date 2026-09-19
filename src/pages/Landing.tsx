import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { WEDDING_STYLES, type WeddingStyle } from '../lib/weddingStyles';
import { PERSONNAGES, VISUELS_DU_HERO } from '../lib/personas';
import { usePrefersReducedMotion } from '../lib/useReducedMotion';
import HeroCycle from '../components/HeroCycle';
import PictoPersonnage from '../components/PictoPersonnage';
import OuvertureSite from '../components/OuvertureSite';
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
   * LE HERO EST UN SÉLECTEUR DE PERSONNAGE
   *
   * « Qui êtes-vous dans ce mariage ? » Le hero traverse les rôles du site, du
   * premier au dernier : le visuel, le nom, la phrase, et **les entrées de leur
   * espace** — de quoi comprendre le site sans jamais voir les informations de
   * quelqu'un d'autre. Les flèches font la même chose à la main, et l'on
   * n'entre qu'avec le personnage qui est au milieu.
   */
  const [personaId, setPersonaId] = useState(PERSONNAGES[0]!.id);
  /** Un média occupe le hero : le défilé attend, la carte joue. */
  const [lectureEnCours, setLectureEnCours] = useState(false);
  const reduced = usePrefersReducedMotion();

  const indexPersona = Math.max(0, PERSONNAGES.findIndex((p) => p.id === personaId));
  const persona = PERSONNAGES[indexPersona] ?? PERSONNAGES[0]!;

  const personaSuivant = () => setPersonaId(PERSONNAGES[(indexPersona + 1) % PERSONNAGES.length]!.id);
  const personaPrecedent = () => setPersonaId(PERSONNAGES[(indexPersona - 1 + PERSONNAGES.length) % PERSONNAGES.length]!.id);

  /** Le défilé des personnages : personne ne clique, et il avance tout seul. */
  useEffect(() => {
    if (reduced || lectureEnCours) return;
    const t = window.setTimeout(() => {
      setPersonaId(PERSONNAGES[(indexPersona + 1) % PERSONNAGES.length]!.id);
    }, 5600);
    return () => window.clearTimeout(t);
  }, [indexPersona, reduced, lectureEnCours]);

  /** L'univers de la page : celui qui mène l'éditeur, la playlist et la bande. */
  const activeStyleOrFallback = selectedStyle ?? WEDDING_STYLES[0]!;

  /** On entre avec le personnage du milieu : c'est la carte qu'on vient créer. */
  const entrer = () => navigate('/creer', { state: { roleId: persona.id } });

  const handleSelectStyle = (style: WeddingStyle | null) => {
    setSelectedStyle(style);
    if (searchParams.has('univers')) setSearchParams({}, { replace: true });
  };

  /**
   * LA BANDE DU HERO — LES CARTES VIVANTES
   *
   * Sous le hero, l'autre axe : **l'univers**. Les cartes musicales disent le
   * nombre de personnes qui les aiment, leur play allume le média, et celle qui
   * est au milieu est l'univers de la page — celui qui mène l'éditeur, la
   * playlist et les sections plus bas.
   */
  const bandeDesUnivers = (
    <BandeDuHero
      libelle="Les univers"
      styleId={activeStyleOrFallback.id}
      cartes={cartesDesUnivers(() => undefined, activeStyleOrFallback.id)}
      onChoisir={(carte) => handleSelectStyle(WEDDING_STYLES.find((s) => s.id === carte.id) ?? null)}
      onLecture={setLectureEnCours}
    />
  );

  return (
    <div className="vp-env min-h-screen overflow-x-clip text-[#0B0C12] pb-16">
      {/* L'OUVERTURE : le nom prend l'écran, une lumière le traverse, et il se
          fond — le générique, puis la question : qui êtes-vous ? */}
      <OuvertureSite />

      {/* Le header du site : la même barre que partout. */}
      <SiteHeader />

      {/* LE HERO : QUI ÊTES-VOUS DANS CE MARIAGE ? */}
      <div id="hero">
        <HeroCycle visuels={VISUELS_DU_HERO} actifId={persona.id}>
          <div className="flex flex-col items-center text-center">
            <span className="vp-eyebrow !text-white/70">Qui êtes-vous dans ce mariage ?</span>

            {/* Le personnage du milieu : son picto, son nom, sa phrase */}
            <div key={persona.id} className="mt-5 flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur"
              >
                <PictoPersonnage picto={persona.picto} size={24} />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="vp-title mt-4 text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
                style={{ fontSize: 'clamp(2rem, 5.4vw, 4rem)', lineHeight: 1.04 }}
              >
                {persona.nom}
              </motion.h1>
              <p className="mx-auto mt-3 max-w-xl text-[15.5px] leading-relaxed text-white/80">
                « {persona.phrase} »
              </p>

              {/* Les entrées de son espace : la démonstration, sans ses données */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                {persona.entrees.map((entree) => (
                  <span
                    key={entree}
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/70 backdrop-blur"
                  >
                    {entree}
                  </span>
                ))}
              </div>
            </div>

            {/* On entre avec ce personnage — et l'on regarde les autres */}
            <div className="mt-7 flex items-center gap-3">
              <button
                type="button"
                onClick={personaPrecedent}
                aria-label="Personnage précédent"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-[#0B0C12] active:scale-95"
              >
                <ChevronLeft size={17} />
              </button>
              <button
                type="button"
                onClick={entrer}
                className="vp-btn vp-press !bg-white !px-8 !py-3 !text-black shadow-2xl hover:!bg-white/90"
              >
                Entrer
              </button>
              <button
                type="button"
                onClick={personaSuivant}
                aria-label="Personnage suivant"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-[#0B0C12] active:scale-95"
              >
                <ChevronRight size={17} />
              </button>
            </div>

            <p className="mt-4 font-mono text-[9.5px] uppercase tracking-[0.2em] text-white/45">
              Les autres rôles se regardent — on n’entre qu’avec le sien
            </p>

            {/* Les autres personnages, visibles et non cliquables : on découvre
                le site entier sans jamais ouvrir l'espace de quelqu'un d'autre. */}
            <div aria-hidden="true" className="mt-4 hidden max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5 sm:flex">
              {PERSONNAGES.filter((p) => p.id !== persona.id).map((p) => (
                <span key={p.id} className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/30">
                  {p.nom}
                </span>
              ))}
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
