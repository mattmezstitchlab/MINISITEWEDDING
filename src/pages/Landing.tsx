import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WEDDING_STYLES, type WeddingStyle } from '../lib/weddingStyles';
import { PERSONNAGES, VISUELS_DU_HERO } from '../lib/personas';
import { usePrefersReducedMotion } from '../lib/useReducedMotion';
import HeroCycle from '../components/HeroCycle';
import PictoPersonnage from '../components/PictoPersonnage';
import OuvertureSite from '../components/OuvertureSite';
import BandeDuHero from '../components/BandeDuHero';
import { cartesDesPersonas, cartesDesUnivers } from '../lib/cartesVivantes';
import { definirPersonaCourant, definirPersonaSurvolee, enregistrerControlesBande } from '../lib/personaCourant';
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

  // Le site s'accorde au personnage qui défile : le dock montre ses outils.
  useEffect(() => {
    definirPersonaCourant(persona.id);
  }, [persona.id]);

  /** Les deux flèches, posées de chaque côté du dock : elles mènent la bande. */
  const suivant = () => setPersonaId(PERSONNAGES[(indexPersona + 1) % PERSONNAGES.length]!.id);
  const precedent = () => setPersonaId(PERSONNAGES[(indexPersona - 1 + PERSONNAGES.length) % PERSONNAGES.length]!.id);
  useEffect(() => {
    enregistrerControlesBande({ precedent, suivant });
    return () => enregistrerControlesBande(null);
  });

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

  /** On entre avec un personnage : c'est la carte qu'on vient créer. */
  const entrer = (id: string) => navigate('/creer', { state: { roleId: id } });

  /**
   * LA BANDE DES RÔLES
   *
   * Les mêmes cartes que les univers, pour la première question du site : celle
   * du milieu est le personnage du hero, un clic montre son hero, et **le play
   * entre** — c'est lui le bouton. Pas de flèches, pas de bouton « Entrer ».
   */
  const bandeDesRoles = (
    <BandeDuHero
      libelle="Les rôles — cliquez pour voir, play pour entrer"
      styleId="personas"
      cartes={cartesDesPersonas(persona.id)}
      onChoisir={(carte) => setPersonaId(carte.id)}
      onAction={(carte) => entrer(carte.id)}
      onSurvol={(carte) => definirPersonaSurvolee(carte?.id ?? null)}
      libelleAction="Entrer"
    />
  );

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
        <HeroCycle visuels={VISUELS_DU_HERO} actifId={persona.id} contenuClassName="-translate-y-[10vh]">
          <div className="flex flex-col items-center text-center">
            <span className="vp-eyebrow !text-white/70">Qui êtes-vous dans ce mariage ?</span>

            {/* Le personnage du milieu : son picto, son nom, sa phrase */}
            <div key={persona.id} className="mt-4 flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.55)]"
              >
                <PictoPersonnage picto={persona.picto} size={30} />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="vp-title mt-3 text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
                style={{ fontSize: 'clamp(2rem, 5.4vw, 4rem)', lineHeight: 1.04 }}
              >
                {persona.nom}
              </motion.h1>
              <p className="mx-auto mt-3 max-w-xl text-[15.5px] leading-relaxed text-white/80">
                « {persona.phrase} »
              </p>

            </div>
          </div>

          {/* LES CARTES DES RÔLES, dans le hero : juste au-dessus du dock, pour
              qu'on les voie sans quitter le hero — le texte, lui, est remonté. */}
          <div className="absolute inset-x-0 bottom-[6.5rem] z-20 sm:bottom-[7rem]">
            <div className="vp-page">{bandeDesRoles}</div>
          </div>
        </HeroCycle>
      </div>

      {/* LA BANDE DES UNIVERS : le second axe du site, sous le hero — les rôles,
          eux, sont dans le hero, juste au-dessus du dock. */}
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
