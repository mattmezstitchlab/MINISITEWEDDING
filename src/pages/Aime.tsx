import { useState } from 'react';
import { ArrowLeft, Database, Network, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import AimeUniversalGraphShowcase from '../components/AimeUniversalGraphShowcase';
import AimeUniversalUxProof from '../components/AimeUniversalUxProof';
import ArchitectureTruthModal from '../components/ArchitectureTruthModal';
import CompactZeroScrollStudio from '../components/CompactZeroScrollStudio';
import WeddingTaxonomyDirectory from '../components/WeddingTaxonomyDirectory';
import { FULL_ROLES_TAXONOMY, WORLD_DESTINATIONS } from '../lib/weddingTaxonomy';

export default function Aime() {
  const [isTruthModalOpen, setIsTruthModalOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-x-clip bg-[#F4F4F2] text-[#0B0C12]">
      <header className="sticky top-0 z-50 border-b border-black/8 bg-white/90 px-4 py-3 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-black/65 transition hover:bg-black hover:text-white" title="Retour à l'accueil">
              <ArrowLeft size={15} />
            </Link>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-black/40">VOWS · AIME</div>
              <div className="text-[14px] font-bold">Taxonomie mariage &amp; graphe relationnel</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsTruthModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-black px-3.5 py-2 text-[11px] font-semibold text-white transition hover:bg-black/80 sm:px-4"
          >
            <ShieldCheck size={14} />
            <span className="hidden sm:inline">Diagnostic de réalité</span>
            <span className="sm:hidden">Diagnostic</span>
          </button>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#0A0B10] px-5 py-20 text-white sm:px-8 sm:py-28">
        <div className="pointer-events-none absolute -right-24 -top-32 h-[430px] w-[430px] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/3 h-[380px] w-[380px] rounded-full bg-fuchsia-400/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-emerald-300">
              <Sparkles size={13} />
              Une personne · plusieurs mondes · zéro doublon
            </div>
            <h1 className="mt-6 text-[clamp(2.6rem,7vw,6.5rem)] font-bold leading-[0.94] tracking-[-0.06em]">
              Le mariage devient<br />
              <span className="text-white/45">un système vivant.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-[16px] leading-relaxed text-white/65 sm:text-[18px]">
              La dernière couche VOWS n’est pas un tableau de prestataires. C’est une taxonomie de rôles, des permissions lisibles et une timeline partagée : chacun voit ce qui lui permet d’agir, rien de plus.
            </p>
            <div className="mt-8 flex flex-wrap gap-2 text-[10px] font-mono uppercase tracking-wider text-white/55">
              <span className="rounded-full border border-white/15 px-3 py-1.5">{FULL_ROLES_TAXONOMY.length} rôles &amp; métiers</span>
              <span className="rounded-full border border-white/15 px-3 py-1.5">{WORLD_DESTINATIONS.length} destinations</span>
              <span className="rounded-full border border-white/15 px-3 py-1.5">Persistance locale</span>
              <span className="rounded-full border border-white/15 px-3 py-1.5">Permissions par contexte</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <WeddingTaxonomyDirectory />
        </div>
      </section>

      <section className="bg-[#070709] px-4 py-12 text-white sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex flex-col gap-3 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-emerald-300">Studio zéro scroll</div>
              <h2 className="mt-2 text-[clamp(1.8rem,4vw,3.4rem)] font-bold leading-tight tracking-[-0.04em]">Un cockpit différent pour chaque rôle.</h2>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-white/45"><Database size={14} /> Données canoniques locales</div>
          </div>
          <CompactZeroScrollStudio />
        </div>
      </section>

      <section className="px-4 py-12 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="flex items-end gap-3">
            <Network size={22} className="mb-1 text-black/45" />
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-black/40">Passe 10 · 11</div>
              <h2 className="mt-2 text-[clamp(1.8rem,4vw,3.4rem)] font-bold leading-tight tracking-[-0.04em]">Une personne, plusieurs contextes.</h2>
            </div>
          </div>
          <AimeUniversalUxProof />
        </div>
      </section>

      <section className="bg-white px-4 py-12 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl space-y-8">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-black/40">Passe 12 · Kernel relationnel</div>
            <h2 className="mt-2 text-[clamp(1.8rem,4vw,3.4rem)] font-bold leading-tight tracking-[-0.04em]">Le graphe protège les décisions.</h2>
            <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-black/55">Propositions arbitrables, cascade d’impacts, révocation non destructive et journal d’audit : la démonstration complète est ici, dans le même espace que la taxonomie mariage.</p>
          </div>
          <AimeUniversalGraphShowcase />
        </div>
      </section>

      <footer className="border-t border-black/8 bg-[#F4F4F2] px-5 py-8 text-center text-[11px] font-mono text-black/45 sm:px-8">
        <Link to="/" className="font-bold text-black hover:underline">VOWS</Link> · Taxonomie mariage · AIME Universal Relation Graph
      </footer>

      <ArchitectureTruthModal isOpen={isTruthModalOpen} onClose={() => setIsTruthModalOpen(false)} />
    </main>
  );
}
