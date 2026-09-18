import { useState } from 'react';
import { ArrowUp, SlidersHorizontal } from 'lucide-react';
import FloatingTimelineDrawer from './FloatingTimelineDrawer';

/**
 * Barre d'outils du mini-site.
 *
 * Réduite à l'essentiel : la timeline (le différenciant du produit) et le retour
 * en haut de page. Les pictos Stories, Radar, Radio et Profil saxophoniste ont
 * été retirés — sur le site d'un mariage, ils détournaient l'invité de ce qu'il
 * venait chercher : le programme, le lieu, et sa réponse.
 */
export default function UniversalMiniSiteToolbar() {
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  return (
    <>
      <div className="pointer-events-none fixed bottom-4 left-1/2 z-40 -translate-x-1/2">
        <div className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/15 bg-[#0A0B10]/95 px-2.5 py-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
          <button
            type="button"
            onClick={() => setIsTimelineOpen(true)}
            className="flex items-center gap-2 rounded-full px-3 py-1.5 text-[11.5px] font-semibold text-white/85 transition hover:bg-white/10 hover:text-white"
            title="Ouvrir la timeline du jour J"
          >
            <SlidersHorizontal size={15} />
            <span>Timeline</span>
          </button>

          <span className="h-4 w-px bg-white/15" />

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition hover:bg-white hover:text-black"
            title="Haut de page"
          >
            <ArrowUp size={14} />
          </button>
        </div>
      </div>

      <FloatingTimelineDrawer
        isOpen={isTimelineOpen}
        onClose={() => setIsTimelineOpen(false)}
      />
    </>
  );
}
