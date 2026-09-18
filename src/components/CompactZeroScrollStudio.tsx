import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  SlidersHorizontal,
  FileCheck,
} from 'lucide-react';
import {
  WEDDING_TAXONOMY,
  type WeddingTaxonomyRole,
  type TaxonomyEntity,
} from '../lib/weddingTaxonomy';
import {
  INITIAL_TIMELINE_ITEMS,
  type ViewerPerspective,
} from '../lib/timelineTheaterEngine';

// Fonds d'écran immersifs commutable façon Apple Wallpapers
const WALLPAPERS = [
  { id: 'black-white', name: 'Éditorial Black & White', url: '/images/noir-blanc.jpg' },
  { id: 'chateau', name: 'Château & Verrière', url: '/images/chateau.jpg' },
  { id: 'brutal', name: 'Chapelle Contemporaine', url: '/images/brutal-bunker-vows.jpg' },
  { id: 'club', name: 'Nuit & Club Amour', url: '/images/club-amour.jpg' },
  { id: 'desert', name: 'Desert Sunset & Motel', url: '/images/desert-pool-vows.jpg' },
  { id: 'phare', name: 'Horizon & Côte Sauvage', url: '/images/phare-vows.jpg' },
];

export default function CompactZeroScrollStudio() {
  const [activeRoleKey, setActiveRoleKey] = useState<WeddingTaxonomyRole>('maries');
  const [activeWallpaper, setActiveWallpaper] = useState(WALLPAPERS[0]);
  const [selectedMomentId, setSelectedMomentId] = useState<string>('jj-3');
  const coupleNames = 'Sarah & Gabriel';
  const eventDate = 'Samedi 19 Septembre 2026';

  // Entité active de la taxonomie
  const activeEntity: TaxonomyEntity = WEDDING_TAXONOMY[activeRoleKey] || WEDDING_TAXONOMY.maries;

  // Moment actif de la timeline
  const selectedMoment = useMemo(() => {
    return INITIAL_TIMELINE_ITEMS.find((it) => it.id === selectedMomentId) || INITIAL_TIMELINE_ITEMS[2];
  }, [selectedMomentId]);

  // Documents visibles selon le rôle
  const perspective: ViewerPerspective = activeRoleKey === 'invites' ? 'guest' : activeRoleKey === 'maries' ? 'couple' : 'vendor';
  const authorizedDocs = selectedMoment.attachedDocs.filter((d) => d.accessLevels.includes(perspective));

  // Liste ordonnée des rôles de la taxonomie les plus fréquents pour la barre supérieure
  const topTaxonomyKeys: WeddingTaxonomyRole[] = [
    'maries',
    'temoin',
    'officiant',
    'traiteur',
    'saxophoniste',
    'dj',
    'photographe',
    'invites',
  ];

  return (
    <div className="relative w-full h-[92vh] max-h-[880px] min-h-[620px] rounded-[36px] overflow-hidden bg-black text-white border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.85)] flex flex-col justify-between select-none">
      
      {/* 1. VISUEL HERO PLEIN ÉCRAN EN FOND (Wallpaper d'ambiance commutable) */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeWallpaper.url}
            src={activeWallpaper.url}
            alt={activeWallpaper.name}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full w-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/30" />
      </div>

      {/* 2. EN-TÊTE SUPÉRIEUR : SÉLECTEUR DE RÔLE TAXONOMIQUE (AVEC VIGNETTES VISUELLES CARRÉES) */}
      <div className="relative z-10 shrink-0 px-4 sm:px-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Ruban des Rôles avec Micro-Vignettes d'Identification Immédiate */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/65 backdrop-blur-2xl border border-white/15 overflow-x-auto max-w-full no-scrollbar">
          {topTaxonomyKeys.map((key) => {
            const ent = WEDDING_TAXONOMY[key];
            const isSelected = activeRoleKey === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveRoleKey(key)}
                className={`flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full text-[11px] font-bold transition shrink-0 ${
                  isSelected
                    ? 'bg-white text-black shadow-lg scale-[1.02]'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {/* Vignette visuelle miniature d'identification */}
                <span className="relative h-5 w-5 rounded-full overflow-hidden shrink-0 border border-current/20">
                  <img src={ent.thumbnail} alt={ent.label} className="h-full w-full object-cover" />
                </span>
                <span>{ent.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sélecteur de Fond d'écran d'ambiance */}
        <div className="flex items-center gap-1.5 bg-black/65 backdrop-blur-2xl px-3 py-1 rounded-full border border-white/15 text-[10.5px] font-mono">
          <span className="text-white/50 hidden sm:inline">Fond :</span>
          <select
            value={activeWallpaper.id}
            onChange={(e) => {
              const wp = WALLPAPERS.find((w) => w.id === e.target.value);
              if (wp) setActiveWallpaper(wp);
            }}
            className="bg-transparent text-white font-bold cursor-pointer focus:outline-none"
          >
            {WALLPAPERS.map((wp) => (
              <option key={wp.id} value={wp.id} className="bg-[#111218] text-white">
                {wp.name}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* 3. CENTRE : LA CARTE UNIVERSELLE DU RÔLE (ZÉRO SCROLL, TOUT AU CENTRE D'UN COUP D'ŒIL) */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <motion.div
          key={`${activeRoleKey}-${selectedMomentId}`}
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-xl rounded-[28px] bg-white/[0.08] backdrop-blur-2xl border border-white/20 p-5 sm:p-6 text-left space-y-4 shadow-2xl"
        >
          {/* En-tête avec vignette visuelle du rôle, titre et badge d'action */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              {/* Vignette de la taxonomie */}
              <div className="relative h-11 w-11 rounded-[14px] overflow-hidden border border-white/30 shadow-md shrink-0">
                <img src={activeEntity.thumbnail} alt={activeEntity.label} className="h-full w-full object-cover" />
              </div>

              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                  {activeEntity.label} · {selectedMoment.startTime}
                </div>
                <h2 className="text-[20px] sm:text-[23px] font-bold text-white mt-0.5 leading-tight">
                  {selectedMoment.title}
                </h2>
              </div>
            </div>

            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-black shadow-md shrink-0">
              {activeEntity.badgeAction}
            </span>
          </div>

          {/* Consigne ou Repère posé pour ce créneau horaire */}
          <div className="rounded-[18px] bg-black/50 border border-white/10 p-3 text-[12px] space-y-1">
            <div className="flex items-center justify-between text-white/50 font-mono text-[10px]">
              <span>Repère Partagé sur ce Moment</span>
              <span className="text-emerald-400 font-bold">Alignement Validé</span>
            </div>
            <div className="text-white font-medium">
              {selectedMoment.coupleNote || 'Créneau validé dans le conducteur. Tous les acteurs sont synchronisés.'}
            </div>
          </div>

          {/* Documents scellés et bouton d'action contextuel */}
          <div className="pt-1 flex items-center justify-between text-[11.5px] font-mono">
            <div className="flex items-center gap-1.5 text-white/60">
              <FileCheck size={14} className={authorizedDocs.length > 0 ? 'text-emerald-400' : ''} />
              <span>{authorizedDocs.length} pièce(s) scellée(s)</span>
            </div>

            <button
              type="button"
              className="rounded-full bg-white px-4 py-1.5 text-[11px] font-bold text-black hover:bg-neutral-200 transition shadow-md flex items-center gap-1"
            >
              <span>Accéder à mon espace</span>
              <ArrowRight size={11} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* 4. SURFACE HORIZONTALE EN BAS : LA TIMELINE AVEC VIGNETTES VISUELLES D'IDENTIFICATION IMMÉDIATE */}
      <div className="relative z-10 shrink-0 px-4 sm:px-8 pb-4">
        <div className="overflow-hidden rounded-[24px] bg-black/75 backdrop-blur-2xl border border-white/15 p-3 space-y-2 shadow-2xl">
          
          <div className="flex items-center justify-between text-[11px] font-mono text-white/50 border-b border-white/5 pb-1 px-1">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={13} className="text-white" />
              <span className="font-bold text-white uppercase tracking-wider">
                {coupleNames} • {eventDate}
              </span>
            </div>
            <span className="text-emerald-400">● Repères visuels universels actifs</span>
          </div>

          {/* Cartes temporelles enrichies avec Vignettes Visuelles pour identification immédiate sans lire le texte */}
          <div className="no-scrollbar flex items-center gap-2.5 overflow-x-auto py-1 scroll-smooth">
            {INITIAL_TIMELINE_ITEMS.map((item) => {
              const isSelected = selectedMomentId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedMomentId(item.id)}
                  className={`cursor-pointer shrink-0 w-48 sm:w-56 rounded-[18px] p-2.5 text-left transition-all duration-200 border flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-white text-black shadow-xl ring-2 ring-emerald-400 scale-[1.02]'
                      : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                  }`}
                >
                  {/* Vignette visuelle miniature carrée (Repérage immédiat d'un coup d'œil) */}
                  <div className="relative h-11 w-11 rounded-[12px] overflow-hidden shrink-0 border border-current/20 shadow-sm">
                    <img
                      src={item.mediaUrl || '/images/table-noir.jpg'}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between pb-0.5">
                      <span className="font-mono text-[9px] font-bold">{item.startTime}</span>
                      <span className={`text-[8px] font-mono px-1 rounded-full ${isSelected ? 'bg-black text-white' : 'bg-emerald-400 text-black font-bold'}`}>
                        {item.durationMinutes}m
                      </span>
                    </div>

                    <div className="font-bold text-[11px] truncate leading-tight">
                      {item.title}
                    </div>

                    <div className="text-[9px] opacity-60 truncate mt-0.5">
                      {item.alignedRole || item.subtitle}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

    </div>
  );
}
