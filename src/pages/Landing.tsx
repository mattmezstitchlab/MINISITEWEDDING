import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WEDDING_STYLES, type WeddingStyle } from '../lib/weddingStyles';
import {
  DOMAINES_PRESTATAIRES, PERSONNAGES, TITRES, VISUELS_DU_HERO, domainePrestataire,
  personnageParId, porteurDuDomaine,
} from '../lib/personas';
import { usePrefersReducedMotion } from '../lib/useReducedMotion';
import HeroCycle from '../components/HeroCycle';
import PictoPersonnage from '../components/PictoPersonnage';
import OuvertureSite from '../components/OuvertureSite';
import BandeDuHero from '../components/BandeDuHero';
import ChampDuMagazine from '../components/ChampDuMagazine';
import { cartesDesDomaines, cartesDesPersonas, type CarteVivante } from '../lib/cartesVivantes';
import { choisirCarte } from '../lib/selection';
import {
  definirPersonaCourant, definirPersonaSurvolee, useControlesDeBande,
} from '../lib/personaCourant';
import { enregistrerNavVerticale } from '../lib/navVerticale';
import { NAV_ACCUEIL } from '../lib/navDesPages';
import SiteHeader from '../components/SiteHeader';
import Manifeste from '../components/Manifeste';
import HeroUnivers from '../components/HeroUnivers';
import Appareils from '../components/Appareils';
import ParallaxSection from '../components/ParallaxSection';
import DjPlaylistStudio from '../components/DjPlaylistStudio';
import { PISTES_DE_LANNEE, playlistDeLAnnee } from '../lib/playlistDeLAnnee';
import SuperMariageTeaser from '../components/SuperMariageTeaser';
import ComplementaryThemes from '../components/ComplementaryThemes';
import CadranHero from '../components/CadranHero';


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
   * LE HERO : UN TITRE, PUIS LES CARTES
   *
   * « Qui êtes-vous dans ce mariage ? » Le hero ouvre les grandes familles l'une
   * après l'autre — **SUPER PRESTATAIRE, SUPER MARIÉ(E), SUPER FUTUR MARIÉ(E),
   * SUPER FAMILLE, SUPER TÉMOIN** — et sous chacune, **les cartes à choisir**.
   * On ne demande pas qui on est : on le laisse se choisir, carte après carte.
   *
   * **Les prestataires ont deux niveaux** : le domaine (« Image & Mémoire »),
   * puis les métiers qui le font vivre. C'est là qu'on trouve ce qu'on n'était
   * pas venu chercher.
   */
  const [titreIndex, setTitreIndex] = useState(0);
  const [carteIndex, setCarteIndex] = useState(0);
  /** Un domaine ouvert : le hero montre ses métiers, et prend son nom. */
  const [domaineOuvert, setDomaineOuvert] = useState<string | null>(null);
  /** Un média occupe le hero : le défilé attend, la carte joue. */
  const [lectureEnCours, setLectureEnCours] = useState(false);
  const reduced = usePrefersReducedMotion();

  const titre = TITRES[titreIndex] ?? TITRES[0]!;
  const domaine = domaineOuvert ? domainePrestataire(domaineOuvert) ?? null : null;

  /** Les cartes du moment, dans l'ordre : des domaines, ou des personnages. */
  const ids = useMemo(() => {
    if (!titre.domaines) return titre.cartes;
    return domaine ? domaine.cartes : DOMAINES_PRESTATAIRES.map((d) => d.key);
  }, [titre, domaine]);
  const index = Math.min(carteIndex, Math.max(0, ids.length - 1));
  const cleActive = ids[index] ?? '';

  /** Le domaine ouvert dans la liste (premier niveau des prestataires). */
  const domaineActif = titre.domaines && !domaine ? domainePrestataire(cleActive) ?? null : null;

  /** Le nom écrit en grand : le titre, ou le domaine quand il est ouvert. */
  const nomDuHero = domaine ? domaine.label : titre.nom;

  /** Le personnage qui mène le site : la carte du milieu, ou le métier du domaine. */
  const persona = useMemo(() => {
    const porteur = domaineActif ? porteurDuDomaine(domaineActif.key) : personnageParId(cleActive);
    const premier = personnageParId(titre.cartes[0] ?? '') ?? PERSONNAGES[0]!;
    return porteur ?? premier;
  }, [domaineActif, cleActive, titre]);

  const cartes = useMemo(() => {
    if (domaineActif) return cartesDesDomaines(DOMAINES_PRESTATAIRES, domaineActif.key);
    return cartesDesPersonas(persona.id, ids);
  }, [domaineActif, persona.id, ids]);

  // Le site s'accorde au personnage qui défile : le dock montre ses outils.
  useEffect(() => {
    definirPersonaCourant(persona.id);
  }, [persona.id]);

  // La nav de droite : la carte, les univers, le mariage, la playlist.
  useEffect(() => {
    enregistrerNavVerticale(NAV_ACCUEIL);
    return () => enregistrerNavVerticale(null);
  }, []);

  /** Ouvrir un domaine : on montre ses métiers, et le hero prend son nom. */
  const ouvrirDomaine = (key: string | null) => {
    setDomaineOuvert(key);
    setCarteIndex(0);
  };

  /**
   * Les deux flèches, posées de chaque côté du dock : elles mènent la bande. Une
   * flèche fait avancer d'une carte — et quand le titre n'en a plus, elle entre
   * dans le titre suivant, au début.
   */
  const suivant = () => {
    if (index + 1 < ids.length) setCarteIndex(index + 1);
    else {
      setTitreIndex((i) => (i + 1) % TITRES.length);
      setDomaineOuvert(null);
      setCarteIndex(0);
    }
  };
  const precedent = () => {
    if (index > 0) setCarteIndex(index - 1);
    else {
      setTitreIndex((i) => (i - 1 + TITRES.length) % TITRES.length);
      setDomaineOuvert(null);
      setCarteIndex(999);
    }
  };
  /** Les deux flèches du dock mènent **la bande à l'écran** : ici, les rôles. */
  const surveillerLeHero = useControlesDeBande('roles', { precedent, suivant });

  /** Le défilé : les cartes d'un titre, puis le titre suivant. Il attend qu'on explore. */
  useEffect(() => {
    if (reduced || lectureEnCours || domaineOuvert) return;
    const t = window.setTimeout(() => {
      if (index + 1 < ids.length) setCarteIndex(index + 1);
      else {
        setTitreIndex((i) => (i + 1) % TITRES.length);
        setCarteIndex(0);
      }
    }, 5600);
    return () => window.clearTimeout(t);
  }, [index, ids.length, domaineOuvert, reduced, lectureEnCours]);

  /** L'univers de la page : celui qui mène l'éditeur, la playlist et la bande. */
  const activeStyleOrFallback = selectedStyle ?? WEDDING_STYLES[0]!;

  /** On entre avec un personnage : c'est la carte qu'on vient créer. */
  const entrer = (id: string) => navigate('/creer', { state: { roleId: id } });

  /**
   * **CE QU'ON RETIENT DE L'ACCUEIL** — chaque carte cliquée ici entre dans la
   * sélection de la personne : c'est elle qui fait **son hero**, dans l'ordre.
   * Le défilé automatique ne retient rien : seul un clic est un choix.
   */
  const retenir = (carte: { id: string; sorte: 'univers' | 'persona'; titre: string }) => choisirCarte(carte);

  /** Le domaine d'une carte de domaine : « domaine-image » → « image ». */
  const cleDeCarte = (carte: CarteVivante) =>
    carte.id.startsWith('domaine-') ? carte.id.slice('domaine-'.length) : null;

  /**
   * LA BANDE DES TITRES
   *
   * Sous le titre, **les cartes à choisir** : un clic montre la carte au milieu,
   * le play fait l'action — « Entrer » pour un personnage, « Ouvrir » pour un
   * domaine, qui découvre alors ses métiers. **Dans le hero** (`premiere`) : pas
   * de bande blanche, pas de flèches — celles du dock mènent la bande.
   */
  const bandeDuTitre = (
    <BandeDuHero
      premiere
      styleId="personas"
      cartes={cartes}
      onChoisir={(carte) => {
        const cle = cleDeCarte(carte);
        if (cle) ouvrirDomaine(cle);
        else {
          setCarteIndex(Math.max(0, cartes.findIndex((c) => c.id === carte.id)));
          retenir({ id: carte.id, sorte: 'persona', titre: carte.titre });
        }
      }}
      onAction={(carte) => {
        const cle = cleDeCarte(carte);
        if (cle) ouvrirDomaine(cle);
        else {
          retenir({ id: carte.id, sorte: 'persona', titre: carte.titre });
          entrer(carte.id);
        }
      }}
      onSurvol={(carte) => {
        const cle = carte ? cleDeCarte(carte) : null;
        definirPersonaSurvolee(cle ? porteurDuDomaine(cle)?.id ?? null : carte?.id ?? null);
      }}
      libelleAction={titre.domaines && !domaine ? 'Ouvrir' : 'Entrer'}
    />
  );

  const handleSelectStyle = (style: WeddingStyle | null) => {
    setSelectedStyle(style);
    if (searchParams.has('univers')) setSearchParams({}, { replace: true });
  };

  return (
    <div className="vp-env min-h-screen overflow-x-clip text-[#0B0C12] pb-16">
      {/* L'OUVERTURE : le nom prend l'écran, une lumière le traverse, et il se
          fond — le générique, puis la question : qui êtes-vous ? */}
      <OuvertureSite />

      {/* Le header du site : la même barre que partout. */}
      <SiteHeader />

      {/* LE CADRAN, DEVANT : la porte du concept. Le hero d'hier descend d'un
          étage, juste en dessous. */}
      <CadranHero />

      {/* LE HERO : QUI ÊTES-VOUS DANS CE MARIAGE ? */}
      <div id="hero" ref={surveillerLeHero}>
        <HeroCycle visuels={VISUELS_DU_HERO} actifId={persona.id}>
          <div className="flex flex-col items-center text-center">
            <span className="vp-eyebrow !text-white/70">Qui êtes-vous dans ce mariage ?</span>

            {/* LE TITRE DU MOMENT : la grande famille, et son picto */}
            <div key={nomDuHero} className="mt-4 flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.55)]"
              >
                <PictoPersonnage picto={titre.picto} size={30} />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="vp-title mt-3 text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
                style={{ fontSize: 'clamp(2rem, 5.4vw, 4rem)', lineHeight: 1.04 }}
              >
                {nomDuHero}
              </motion.h1>

              {/* Un domaine ouvert : de quoi revenir à tous les domaines. */}
              {domaine && (
                <button
                  type="button"
                  onClick={() => ouvrirDomaine(null)}
                  className="mt-3 rounded-full border border-white/25 px-3 py-1 text-[11px] font-semibold text-white/80 transition hover:border-white hover:text-white"
                >
                  ← Tous les domaines
                </button>
              )}
            </div>

            {/* LE CHAMP DU MAGAZINE A QUITTÉ LE HERO : il vit maintenant sur la
                page magazine, où le titre, le champ et les couvertures se
                tiennent ensemble. Ici, le hero garde sa question, son titre, et
                ses cartes — rien d'autre. */}

            {/* LES CARTES À CHOISIR : on les a sous les yeux dans le hero, sans
                bande blanche et sans flèches — celles du dock mènent la bande. */}
            <div className="mt-9 w-full sm:mt-11">{bandeDuTitre}</div>
          </div>
        </HeroCycle>
      </div>

      {/* LE MANIFESTE : le concept en trois paragraphes, avant de le montrer. */}
      <Manifeste />

      {/* LES UNIVERS : le second axe, avec **son propre hero** — le nom de
          l'univers en grand, ses cartes juste en dessous, comme les rôles. */}
      <HeroUnivers
        styleId={activeStyleOrFallback.id}
        onChoisir={(style) => handleSelectStyle(style)}
        onLecture={setLectureEnCours}
        onCarteChoisie={(carte) => retenir({ id: carte.id, sorte: 'univers', titre: carte.titre })}
      />

      {/* SUPER ÉDITEUR : la même page sur trois appareils. L'éditeur lui-même a
          sa page — le bouton Paramètres, en bas à gauche, l'ouvre. */}
      <Appareils styleId={activeStyleOrFallback.id} />

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

      {/* LE COMPOSEUR, PLUS BAS : la même chose que dans le hero, à l'endroit où
          l'on arrive quand on a tout regardé. On ne le réécrit pas : c'est le même
          bloc, il retrouve tout seul ce qui a déjà été répondu. */}
      <section id="votre-magazine" className="mx-auto max-w-[1180px] px-5 py-16 sm:py-24">
        <div className="flex flex-col items-center text-center">
          <span className="vp-eyebrow">En une fois</span>
          <h2 className="vp-title mt-3" style={{ fontSize: 'clamp(1.8rem, 4.4vw, 2.8rem)' }}>
            Votre magazine, maintenant
          </h2>
          <p className="vp-body mt-3 max-w-xl">
            Deux prénoms, une date : le magazine se compose, on coche ce qu’on garde, et la page d’une
            personne devient la couverture de son magazine.
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <ChampDuMagazine />
        </div>
      </section>

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

      {/* PLAYLIST COLLABORATIVE : la playlist de l'année — un morceau par jour,
          toutes les cartes déjà là. */}
      <section id="bande-son" className="bg-white py-16">
        <div className="vp-page">
          <DjPlaylistStudio
            style={activeStyleOrFallback}
            pistes={playlistDeLAnnee(new Date().getFullYear())}
            sousTitre={`La playlist de l’année — un morceau par jour, ${PISTES_DE_LANNEE} cartes.`}
          />
        </div>
      </section>

    </div>
  );
}
