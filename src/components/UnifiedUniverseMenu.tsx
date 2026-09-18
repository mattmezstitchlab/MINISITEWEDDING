import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, ChevronLeft, X, Users, ArrowRight, Layers, Home, Grid, Radio } from 'lucide-react';
import { WEDDING_STYLES, type WeddingStyle } from '../lib/weddingStyles';
import UniverseDirectoryModal from './UniverseDirectoryModal';

interface UnifiedUniverseMenuProps {
  onSelectStyle: (style: WeddingStyle | null) => void;
  selectedStyleId: string | null;
}

export default function UnifiedUniverseMenu({
  onSelectStyle,
  selectedStyleId,
}: UnifiedUniverseMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedStyle = selectedStyleId
    ? WEDDING_STYLES.find((s) => s.id === selectedStyleId) || null
    : null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 380;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Pill de retour rapide à l'accueil si un thème est sélectionné */}
        {selectedStyle && (
          <button
            type="button"
            onClick={() => onSelectStyle(null)}
            className="flex items-center gap-1.5 rounded-full border border-black/10 bg-white/90 px-3 py-1.5 text-[12px] font-semibold text-[#0B0C12]/80 shadow-sm backdrop-blur-md transition hover:bg-neutral-100 hover:text-black"
            title="Revenir à l'accueil générale"
          >
            <Home size={12} />
            <span className="hidden sm:inline">Accueil</span>
            <X size={12} className="opacity-60" />
          </button>
        )}

        {/* Bouton déclencheur central élégant dans la nav : UNIVERS & MÉTIERS */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group flex items-center gap-2 rounded-full border border-black/10 bg-white/95 px-4 py-1.5 text-[13px] font-semibold text-[#0B0C12] shadow-sm backdrop-blur-md transition hover:border-black/30 hover:bg-white"
          aria-expanded={isOpen}
        >
          {selectedStyle ? (
            <>
              <span
                className="h-2.5 w-2.5 rounded-full transition-transform group-hover:scale-125"
                style={{ background: selectedStyle.accent }}
              />
              <span className="max-w-[120px] sm:max-w-none truncate">{selectedStyle.name}</span>
              <span className="text-[11px] text-[var(--vp-muted)] font-normal hidden md:inline">
                · {selectedStyle.humanMissions.length} métiers
              </span>
            </>
          ) : (
            <>
              <Layers size={14} className="text-[#0B0C12]" />
              <span className="tracking-wide">UNIVERS &amp; MÉTIERS</span>
            </>
          )}
          <ChevronDown
            size={14}
            className={`text-[var(--vp-muted)] transition-transform duration-300 ml-0.5 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Panneau supérieur blanc moderne */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-0 top-0 z-[60] border-b border-black/10 bg-white/98 backdrop-blur-xl py-5 text-[#0B0C12] shadow-[0_25px_60px_rgba(0,0,0,0.12)]"
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6">
                {/* En-tête épuré */}
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-[#0B0C12]" />
                    <span className="text-[12.5px] font-bold uppercase tracking-[0.2em] text-[#0B0C12]/80">
                      Galerie des Univers &amp; Métiers VOWS
                    </span>
                    {selectedStyle && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectStyle(null);
                          setIsOpen(false);
                        }}
                        className="text-[11.5px] text-[#0B0C12]/60 hover:text-[#0B0C12] underline ml-2 transition"
                      >
                        Revenir à la vue d'ensemble
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => scroll('left')}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-[#0B0C12] transition hover:bg-black/10"
                        title="Précédent"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => scroll('right')}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-[#0B0C12] transition hover:bg-black/10"
                        title="Suivant"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-[#0B0C12] transition hover:bg-black/10 ml-2"
                      title="Fermer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Ruban horizontal : Cartes blanches modernes */}
                <div
                  ref={scrollContainerRef}
                  className="no-scrollbar flex gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth"
                >
                  {WEDDING_STYLES.map((style) => {
                    const isSelected = selectedStyleId === style.id;
                    return (
                      <div
                        key={style.id}
                        onClick={() => {
                          onSelectStyle(style);
                          setIsOpen(false);
                        }}
                        className={`cursor-pointer group relative w-[280px] sm:w-[320px] shrink-0 overflow-hidden rounded-[24px] bg-[#F7F7F8] p-3 text-left transition-all duration-300 ${
                          isSelected
                            ? 'bg-neutral-100 shadow-md scale-[1.01]'
                            : 'hover:bg-white hover:shadow-lg'
                        }`}
                      >
                        {/* Image panoramique avec titre immersif */}
                        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[18px]">
                          <img
                            src={style.image}
                            alt={style.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                          {/* Pastille chromatique */}
                          <div className="absolute top-3 left-3 flex items-center gap-1.5">
                            <span
                              className="h-2.5 w-2.5 rounded-full shadow-sm"
                              style={{ background: style.accent }}
                            />
                            {isSelected && (
                              <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-bold text-black uppercase tracking-wider">
                                Actif
                              </span>
                            )}
                          </div>

                          {/* Titre & Tagline */}
                          <div className="absolute bottom-3 left-3 right-3 text-white">
                            <div className="text-[16px] font-bold">
                              {style.name}
                            </div>
                            <div className="text-[11px] text-white/80 truncate">
                              {style.tagline}
                            </div>
                          </div>
                        </div>

                        {/* Corps de carte modernisé */}
                        <div className="p-2.5 pt-3">
                          <div className="flex items-center justify-between text-[11.5px] text-[#0B0C12]/60 pb-1">
                            <span className="flex items-center gap-1 font-medium">
                              <Users size={12} />
                              <span>{style.humanMissions.length} métiers coordonnés</span>
                            </span>
                            <span className="font-semibold text-[#0B0C12] group-hover:translate-x-0.5 transition flex items-center gap-1">
                              Choisir <ArrowRight size={12} />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* BAS DU MENU : Bouton picto Mosaïque seul (ferme le panneau menu et ouvre la mosaïque plein écran) */}
                <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between px-2">
                  <div className="text-[11.5px] text-[#0B0C12]/60 hidden sm:flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Vue globale transversale des styles et des métiers</span>
                  </div>

                  {/* Bouton picto mosaïque unique */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setIsDirectoryOpen(true);
                    }}
                    className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-black text-white hover:bg-neutral-800 transition shadow-md"
                    title="Ouvrir la Mosaïque Globale Plein Écran"
                  >
                    <Grid size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MODALE PLEIN ÉCRAN : MOSAÏQUE & CARTE GÉOLOCALISÉE */}
      <UniverseDirectoryModal
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
        selectedStyleId={selectedStyleId}
        onSelectStyle={(style) => {
          onSelectStyle(style);
        }}
      />
    </>
  );
}
