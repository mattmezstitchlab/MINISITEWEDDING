import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PACKAGES_DATA, PackageData } from '../data/packagesData';
import FugaceStudioSite from '../components/packages/FugaceStudioSite';
import IrreverenceSite from '../components/packages/IrreverenceSite';
import MaisonAnomalieSite from '../components/packages/MaisonAnomalieSite';
import MaisonDesordreSite from '../components/packages/MaisonDesordreSite';
import OrbiteIncartadeSite from '../components/packages/OrbiteIncartadeSite';
import PackageSpecDrawer from '../components/packages/PackageSpecDrawer';
import { ArrowLeft, Sparkles, SlidersHorizontal, ChevronRight, Eye } from 'lucide-react';

export default function PackagesShowcase() {
  const [searchParams, setSearchParams] = useSearchParams();
  const packParam = searchParams.get('pack') as PackageData['id'] | null;

  const [activePackageId, setActivePackageId] = useState<PackageData['id']>(
    packParam && PACKAGES_DATA.some((p) => p.id === packParam) ? packParam : 'fugace'
  );
  const [isSpecDrawerOpen, setIsSpecDrawerOpen] = useState(false);

  useEffect(() => {
    if (packParam && PACKAGES_DATA.some((p) => p.id === packParam)) {
      setActivePackageId(packParam);
    }
  }, [packParam]);

  const handleSelectPackage = (id: PackageData['id']) => {
    setActivePackageId(id);
    setSearchParams({ pack: id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activePackage = PACKAGES_DATA.find((p) => p.id === activePackageId) || PACKAGES_DATA[0];

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col">
      {/* Top Showcase Master Switch Bar */}
      <header className="sticky top-0 z-40 bg-[#09090B]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Brand & Back link */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#A1A1AA] hover:text-white transition"
              >
                <ArrowLeft size={14} />
                <span>Studio</span>
              </Link>
              <span className="text-white/20">|</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-white">
                  LE MONDE AIME <span className="text-[#A1A1AA] font-normal hidden sm:inline">— 5 Collections Agence</span>
                </span>
              </div>
            </div>

            {/* Spec button for small screens */}
            <button
              onClick={() => setIsSpecDrawerOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition border border-white/15"
            >
              <SlidersHorizontal size={13} />
              <span>Specs</span>
            </button>
          </div>

          {/* 5 Package Switch Tabs */}
          <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {PACKAGES_DATA.map((pkg) => {
              const isActive = pkg.id === activePackageId;
              return (
                <button
                  key={pkg.id}
                  onClick={() => handleSelectPackage(pkg.id)}
                  className={`px-3.5 py-2 rounded-full text-xs font-medium tracking-wide whitespace-nowrap transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-white text-black font-semibold shadow-lg shadow-white/10'
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
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setIsSpecDrawerOpen(true)}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-full bg-white/[0.08] hover:bg-white/15 text-white transition border border-white/10 hover:border-white/25"
            >
              <SlidersHorizontal size={13} className="text-[#C5A059]" />
              <span>Palette & Specs ({activePackage.number})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Package Sub-header Info Strip */}
      <div className="bg-[#121215] border-b border-white/5 px-4 sm:px-6 py-2.5 text-xs text-[#A1A1AA] flex items-center justify-between overflow-x-auto">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-white uppercase">{activePackage.name}</span>
            <span className="text-white/30">•</span>
            <span className="text-[#D4D4D8] truncate">{activePackage.agencySubtitle}</span>
          </div>

          <div className="flex items-center gap-4 shrink-0 font-mono text-[11px]">
            <span className="text-[#A1A1AA] hidden md:inline">Palette :</span>
            <div className="flex items-center gap-1.5">
              {activePackage.colors.map((c) => (
                <div
                  key={c.hex}
                  title={`${c.name} (${c.hex})`}
                  className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
            <span className="text-white/20 hidden sm:inline">|</span>
            <span className="text-white hidden sm:inline">À partir de {activePackage.priceFrom}</span>
            <button
              onClick={() => setIsSpecDrawerOpen(true)}
              className="text-[#C5A059] hover:underline flex items-center gap-1 font-sans font-medium text-xs ml-2"
            >
              <Eye size={13} />
              <span>Détails pack</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mini-site Viewer Content */}
      <main className="flex-1 w-full relative">
        {activePackageId === 'fugace' && <FugaceStudioSite />}
        {activePackageId === 'irreverence' && <IrreverenceSite />}
        {activePackageId === 'anomalie' && <MaisonAnomalieSite />}
        {activePackageId === 'desordre' && <MaisonDesordreSite />}
        {activePackageId === 'orbite' && <OrbiteIncartadeSite />}
      </main>

      {/* Bottom Switcher Navigation Bar for quick hopping */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[92%] sm:w-auto">
        <div className="bg-[#121214]/90 backdrop-blur-xl border border-white/15 rounded-full p-1.5 shadow-2xl flex items-center justify-between gap-1 sm:gap-2">
          {PACKAGES_DATA.map((p) => {
            const isCur = p.id === activePackageId;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPackage(p.id)}
                className={`px-3 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-medium uppercase tracking-wider transition ${
                  isCur ? 'bg-white text-black font-semibold' : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
                }`}
              >
                {p.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Package Specification Side Drawer */}
      <PackageSpecDrawer
        pkg={activePackage}
        isOpen={isSpecDrawerOpen}
        onClose={() => setIsSpecDrawerOpen(false)}
      />
    </div>
  );
}
