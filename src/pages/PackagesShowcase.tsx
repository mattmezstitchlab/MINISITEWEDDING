import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PACKAGES_DATA, PackageData } from '../data/packagesData';

// 12 Dedicated Package Mini-Sites
import FugaceStudioSite from '../components/packages/FugaceStudioSite';
import BrutEpureSite from '../components/packages/BrutEpureSite';
import IrreverenceSite from '../components/packages/IrreverenceSite';
import NocturneVolcanSite from '../components/packages/NocturneVolcanSite';
import MaisonAnomalieSite from '../components/packages/MaisonAnomalieSite';
import CielOublieSite from '../components/packages/CielOublieSite';
import SolsticeHiverSite from '../components/packages/SolsticeHiverSite';
import TheatreMirageSite from '../components/packages/TheatreMirageSite';
import MaisonDesordreSite from '../components/packages/MaisonDesordreSite';
import NomadeHorizonSite from '../components/packages/NomadeHorizonSite';
import ArchipelSecretSite from '../components/packages/ArchipelSecretSite';
import OrbiteIncartadeSite from '../components/packages/OrbiteIncartadeSite';

// Shared Components
import PackageSpecDrawer from '../components/packages/PackageSpecDrawer';
import PackagesComparisonTable from '../components/packages/PackagesComparisonTable';
import PackageQuoteEstimator from '../components/packages/PackageQuoteEstimator';

import { 
  Sparkles, SlidersHorizontal, ArrowRight, Eye, Shield, Layers, 
  Compass, ChevronRight, Menu, X, ArrowUpRight
} from 'lucide-react';

export default function PackagesShowcase() {
  const [searchParams, setSearchParams] = useSearchParams();
  const packParam = searchParams.get('pack') as PackageData['id'] | null;

  const [activePackageId, setActivePackageId] = useState<PackageData['id']>(
    packParam && PACKAGES_DATA.some((p) => p.id === packParam) ? packParam : 'fugace'
  );
  const [isSpecDrawerOpen, setIsSpecDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (packParam && PACKAGES_DATA.some((p) => p.id === packParam)) {
      setActivePackageId(packParam);
    }
  }, [packParam]);

  const handleSelectPackage = (id: PackageData['id']) => {
    setActivePackageId(id);
    setSearchParams({ pack: id });
    const demoElement = document.getElementById('demonstrateur-live');
    if (demoElement) {
      demoElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activePackage = PACKAGES_DATA.find((p) => p.id === activePackageId) || PACKAGES_DATA[0];

  return (
    <div className="min-h-screen bg-[#070709] text-white selection:bg-[#C5A059] selection:text-black">
      {/* ========================================================= */}
      {/* 1. HEADER PERMANENT & NAVIGATION FLUIDE                  */}
      {/* ========================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090C]/90 backdrop-blur-xl border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 flex items-center justify-between">
          {/* Logo Minimaliste Le Monde Aime */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <span className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs group-hover:bg-[#C5A059] transition">
                A
              </span>
              <div>
                <span className="text-xs uppercase tracking-[0.25em] font-semibold text-white block">
                  LE MONDE AIME
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-[#A1A1AA] font-mono block -mt-0.5">
                  Creative Design Architecte
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-[0.18em] font-medium text-[#A1A1AA]">
            <a href="#philosophie" className="hover:text-white transition">Philosophie</a>
            <a href="#collection-12" className="hover:text-white transition">Collection 12 Packages</a>
            <a href="#demonstrateur-live" className="text-white hover:text-[#C5A059] transition flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Générateur Démo
            </a>
            <a href="#comparatif" className="hover:text-white transition">Comparatif</a>
            <a href="#contact-devis" className="hover:text-white transition">Contact / Audit</a>
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSpecDrawerOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition border border-white/15"
            >
              <SlidersHorizontal size={13} className="text-[#C5A059]" />
              <span>Specs Pack ({activePackage.number})</span>
            </button>
            <a
              href="#contact-devis"
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase px-4 sm:px-5 py-2.5 rounded-full bg-white text-black hover:bg-[#C5A059] transition shadow-lg"
            >
              <span>Demander un Audit</span>
              <ArrowUpRight size={13} />
            </a>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0D0D12] border-b border-white/10 px-6 py-6 space-y-4 text-xs uppercase tracking-widest font-semibold">
            <a href="#philosophie" onClick={() => setMobileMenuOpen(false)} className="block text-[#A1A1AA] hover:text-white">Philosophie</a>
            <a href="#collection-12" onClick={() => setMobileMenuOpen(false)} className="block text-[#A1A1AA] hover:text-white">Collection 12 Packages</a>
            <a href="#demonstrateur-live" onClick={() => setMobileMenuOpen(false)} className="block text-[#C5A059]">Générateur Démo ({activePackage.name})</a>
            <a href="#comparatif" onClick={() => setMobileMenuOpen(false)} className="block text-[#A1A1AA] hover:text-white">Grille Comparative</a>
            <a href="#contact-devis" onClick={() => setMobileMenuOpen(false)} className="block text-[#A1A1AA] hover:text-white">Contact / Diagnostic</a>
          </div>
        )}
      </header>

      {/* ========================================================= */}
      {/* 2. SECTION HERO & PHILOSOPHIE DE MARQUE                  */}
      {/* ========================================================= */}
      <section id="philosophie" className="pt-36 sm:pt-44 pb-20 sm:pb-32 px-4 sm:px-8 border-b border-white/10 bg-gradient-to-b from-[#09090C] via-[#0D0D12] to-[#070709] relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#C5A059]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs font-mono uppercase tracking-[0.3em] text-[#C5A059] mb-8">
            <Sparkles size={13} /> Architecture d'Expérience & Scénographie Monumentale
          </div>

          <h1
            className="text-white uppercase leading-[0.92] tracking-tight font-light text-[clamp(2.8rem,7.5vw,6.5rem)]"
            style={{ fontFamily: '"Cinzel", "Bodoni Moda", serif' }}
          >
            L’ARCHITECTURE DU MARIAGE D’EXCEPTION.
          </h1>

          <p className="mt-8 text-base sm:text-xl text-[#A1A1AA] font-light max-w-3xl mx-auto leading-relaxed">
            Nous ne décorons pas des salles : nous érigeons des récits vivants. De la cadence d’un elopement brut sur les falaises jusqu’à la démesure d’un festival secret sur 4 jours, <em>Le Monde Aime</em> conçoit l'expérience de votre mariage comme une œuvre architecturale totale.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#demonstrateur-live"
              className="px-8 sm:px-10 py-4 rounded-full bg-white text-black text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#C5A059] transition shadow-2xl flex items-center gap-2"
            >
              <span>Tester le Démonstrateur Interactif</span>
              <ArrowRight size={15} />
            </a>
            <a
              href="#comparatif"
              className="px-8 sm:px-10 py-4 rounded-full bg-white/5 border border-white/20 text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-white/10 transition"
            >
              Comparer les 12 Univers
            </a>
          </div>

          {/* 4 Pillars Manifesto */}
          <div className="mt-24 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left border-t border-white/10 pt-16">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-xs font-mono text-[#C5A059] block">01 // CONCEPT TOTAL</span>
              <h3 className="font-semibold text-white text-base mt-2">Scénographie & Volumes</h3>
              <p className="text-xs text-[#A1A1AA] mt-2 font-light leading-relaxed">
                Chaque détail est dessiné en 3D : axes de vue, circulation de la brume, jeux d'ombres et lumière zénithale.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-xs font-mono text-[#C5A059] block">02 // TECH INVISIBLE</span>
              <h3 className="font-semibold text-white text-base mt-2">Mini-Sites & Live Feed</h3>
              <p className="text-xs text-[#A1A1AA] mt-2 font-light leading-relaxed">
                Le web design au service de l'émotion : Stories 9:16 en direct, capsule temporelle, signature sonore et pass VIP chiffrés.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-xs font-mono text-[#C5A059] block">03 // CADENCE DE NUIT</span>
              <h3 className="font-semibold text-white text-base mt-2">Curation Musique & Bars</h3>
              <p className="text-xs text-[#A1A1AA] mt-2 font-light leading-relaxed">
                Mixologie d'auteur, sound-systems Funktion-One et transitions théâtrales jusqu'aux premières lueurs.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-xs font-mono text-[#C5A059] block">04 // LOGISTIQUE VIP</span>
              <h3 className="font-semibold text-white text-base mt-2">Conciergerie Complète</h3>
              <p className="text-xs text-[#A1A1AA] mt-2 font-light leading-relaxed">
                Transferts en Riva, berlines privées, suites privatisées et gestion des moindres désirs de vos convives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. STICKY TABS SWITCHER DES 12 PACKAGES                   */}
      {/* ========================================================= */}
      <section id="collection-12" className="sticky top-18 z-40 bg-[#09090C]/95 backdrop-blur-xl border-y border-white/10 px-4 sm:px-8 py-3 transition-all shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Active Package Quick Tag */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[11px] font-mono uppercase text-[#C5A059] font-bold">
              COLLECTION 12 PACKAGES :
            </span>
            <span className="text-xs text-white font-semibold uppercase">
              {activePackage.number}. {activePackage.name}
            </span>
          </div>

          {/* Scrollable Switcher Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {PACKAGES_DATA.map((pkg) => {
              const isActive = pkg.id === activePackageId;
              return (
                <button
                  key={pkg.id}
                  onClick={() => handleSelectPackage(pkg.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wide whitespace-nowrap transition flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white text-black font-semibold shadow-md'
                      : 'bg-white/[0.04] text-[#A1A1AA] hover:text-white hover:bg-white/[0.08] border border-white/5'
                  }`}
                >
                  <span className={`text-[10px] font-mono ${isActive ? 'text-black/60' : 'text-neutral-500'}`}>
                    {pkg.number}
                  </span>
                  <span>{pkg.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* DÉMONSTRATEUR INTERACTIF (CORE FEATURE EN DIRECT)        */}
      {/* ========================================================= */}
      <main id="demonstrateur-live" className="w-full relative min-h-screen">
        {activePackageId === 'fugace' && <FugaceStudioSite />}
        {activePackageId === 'brut-epure' && <BrutEpureSite />}
        {activePackageId === 'irreverence' && <IrreverenceSite />}
        {activePackageId === 'nocturne-volcan' && <NocturneVolcanSite />}
        {activePackageId === 'anomalie' && <MaisonAnomalieSite />}
        {activePackageId === 'ciel-oublie' && <CielOublieSite />}
        {activePackageId === 'solstice-hiver' && <SolsticeHiverSite />}
        {activePackageId === 'theatre-mirage' && <TheatreMirageSite />}
        {activePackageId === 'desordre' && <MaisonDesordreSite />}
        {activePackageId === 'nomade-horizon' && <NomadeHorizonSite />}
        {activePackageId === 'archipel-secret' && <ArchipelSecretSite />}
        {activePackageId === 'orbite' && <OrbiteIncartadeSite />}
      </main>

      {/* ========================================================= */}
      {/* 4. TABLEAU COMPARATIF ET SECTION CONTACT / DEVIS          */}
      {/* ========================================================= */}
      <PackagesComparisonTable
        onSelectPackage={handleSelectPackage}
        selectedPackageId={activePackageId}
      />

      <PackageQuoteEstimator
        onSelectPackage={handleSelectPackage}
      />

      {/* Drawer des Spécifications et Prompts IA */}
      <PackageSpecDrawer
        pkg={activePackage}
        isOpen={isSpecDrawerOpen}
        onClose={() => setIsSpecDrawerOpen(false)}
      />

      {/* Footer Global */}
      <footer className="py-12 px-6 sm:px-12 text-center text-xs tracking-[0.25em] uppercase text-[#71717A] border-t border-white/10 bg-[#070709]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center font-bold text-[10px]">A</span>
            <span className="text-white font-medium">LE MONDE AIME</span>
            <span>— Architecture d’Événements & Design Scénographique</span>
          </div>
          <div>© {new Date().getFullYear()} Le Monde Aime. Tous droits réservés.</div>
        </div>
      </footer>
    </div>
  );
}
