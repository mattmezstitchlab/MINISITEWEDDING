import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  Grid,
  MapPin,
  Layers,
  ArrowRight,
  Briefcase,
  Users,
  Compass,
  Radio,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { WEDDING_STYLES, THEME_CATEGORIES, type WeddingStyle } from '../lib/weddingStyles';

interface UniverseDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStyle: (style: WeddingStyle) => void;
  selectedStyleId?: string | null;
}

// Données de géolocalisation vivantes pour la carte interactive
interface GeoNode {
  id: string;
  styleId: string;
  label: string;
  sublabel: string;
  type: 'wedding' | 'vendor';
  roleOrStyle: string;
  latRatio: number; // 0 à 100% (axe Y)
  lngRatio: number; // 0 à 100% (axe X)
  liveStatus: string;
  isPulse: boolean;
}

const LIVE_GEO_NODES: GeoNode[] = [
  { id: 'g1', styleId: 'noir-blanc', label: 'Sarah & Noah', sublabel: 'Hôtel Particulier · Paris 7e', type: 'wedding', roleOrStyle: 'Black & White', latRatio: 36, lngRatio: 48, liveStatus: 'En cours de validation régie', isPulse: true },
  { id: 'g2', styleId: 'desert', label: 'Léa & Maxime', sublabel: 'Motel & Piscine · Joshua Tree / Almería', type: 'wedding', roleOrStyle: 'Desert Motel', latRatio: 64, lngRatio: 26, liveStatus: '1 rôle encore ouvert (Super 8)', isPulse: true },
  { id: 'g3', styleId: 'brutal', label: 'Camille & Antoine', sublabel: 'Bunker Industriel · Berlin / Dunkerque', type: 'wedding', roleOrStyle: 'Béton Brut', latRatio: 28, lngRatio: 62, liveStatus: 'Fiche sécurité son validée', isPulse: false },
  { id: 'g4', styleId: 'club', label: 'Romy & Théo', sublabel: 'Warehouse · Lyon Confluence', type: 'wedding', roleOrStyle: 'Club Amour', latRatio: 52, lngRatio: 54, liveStatus: 'Set 02h17 en répétition', isPulse: true },
  { id: 'g5', styleId: 'chateau-moderne', label: 'Éléonore & Henri', sublabel: 'Château de Courcelles · Val de Loire', type: 'wedding', roleOrStyle: 'Château Moderne', latRatio: 42, lngRatio: 42, liveStatus: 'Navettes et tentes crystal calées', isPulse: false },
  { id: 'g6', styleId: 'co-mariage', label: 'Sonia & Julie · Marc & Théo', sublabel: 'Domaine des Deux Rives · Provence', type: 'wedding', roleOrStyle: 'Co-Mariage Festival', latRatio: 72, lngRatio: 58, liveStatus: 'Double scène en montage', isPulse: true },
  { id: 'g7', styleId: 'abyssal', label: 'Dôme Océanique', sublabel: 'Observatoire Sous-marin · Brest / Madère', type: 'wedding', roleOrStyle: 'Dôme Abyssal', latRatio: 38, lngRatio: 18, liveStatus: 'Plongée barométrique confirmée', isPulse: true },
  { id: 'g8', styleId: 'orient-express', label: 'Train de Nuit Impérial', sublabel: 'Ligne Venise Simplon · En mouvement', type: 'wedding', roleOrStyle: 'Train de Nuit', latRatio: 48, lngRatio: 70, liveStatus: 'Passage frontière 21h15', isPulse: true },
  { id: 'g9', styleId: 'phare-atlantique', label: 'Phare de Tévennec', sublabel: 'Pointe du Raz · Mer d’Iroise', type: 'wedding', roleOrStyle: 'Le Phare Isolé', latRatio: 33, lngRatio: 14, liveStatus: 'Créneau houle favorable 17h', isPulse: false },

  // Prestataires & talents en direct
  { id: 'v1', styleId: 'desert', label: 'Studio Pellicule 8mm', sublabel: 'Cinéaste Nomade', type: 'vendor', roleOrStyle: 'Cinéaste Super 8', latRatio: 58, lngRatio: 32, liveStatus: 'En route vers le désert', isPulse: true },
  { id: 'v2', styleId: 'brutal', label: 'Atelier Béton & Métal', sublabel: 'Designer Scénographe', type: 'vendor', roleOrStyle: 'Light Designer', latRatio: 30, lngRatio: 55, liveStatus: 'Laser sodium prêt', isPulse: true },
  { id: 'v3', styleId: 'club', label: 'Klang Klub Soundsystem', sublabel: 'Ingénieur du son & DJ', type: 'vendor', roleOrStyle: 'DJ Résident', latRatio: 50, lngRatio: 60, liveStatus: 'Jauge 130 BPM synchronisée', isPulse: false },
];

export default function UniverseDirectoryModal({
  isOpen,
  onClose,
  onSelectStyle,
  selectedStyleId,
}: UniverseDirectoryModalProps) {
  const [viewMode, setViewMode] = useState<'mosaic' | 'map'>('mosaic');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeGeoNode, setActiveGeoNode] = useState<GeoNode | null>(null);

  // Animation douce du live pulse
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => setTick((t) => t + 1), 2500);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Filtrage combiné recherche + catégorie
  const filteredStyles = useMemo(() => {
    return WEDDING_STYLES.filter((style) => {
      const matchCat = activeCategory === 'all' || style.category === activeCategory;
      const q = search.trim().toLowerCase();
      if (!q) return matchCat;

      const matchName = style.name.toLowerCase().includes(q);
      const matchTagline = style.tagline.toLowerCase().includes(q);
      const matchSynopsis = style.synopsis?.toLowerCase().includes(q);
      const matchMissions = style.humanMissions.some(
        (m) => m.role.toLowerCase().includes(q) || m.mission.toLowerCase().includes(q)
      );

      return matchCat && (matchName || matchTagline || matchSynopsis || matchMissions);
    });
  }, [activeCategory, search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#0A0B10] text-white">
      {/* Barre supérieure de contrôle & bascule Mosaïque / Carte */}
      <div className="flex items-center justify-between border-b border-white/10 bg-[#0E0F16]/90 px-4 py-3.5 backdrop-blur-2xl sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            <h2 className="text-[15px] sm:text-[17px] font-bold tracking-tight text-white">
              Atlas Global VOWS · Univers, Missions &amp; Carte Live
            </h2>
          </div>
          <span className="hidden md:inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-mono text-white/60">
            {WEDDING_STYLES.length} univers répertoriés
          </span>
        </div>

        {/* Bascule Vue Mosaïque / Carte en direct */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex rounded-full bg-white/10 p-1 border border-white/10">
            <button
              type="button"
              onClick={() => setViewMode('mosaic')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[12px] font-semibold transition ${
                viewMode === 'mosaic'
                  ? 'bg-white text-black shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Grid size={13} />
              <span>Mosaïque</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[12px] font-semibold transition ${
                viewMode === 'map'
                  ? 'bg-emerald-400 text-black shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Radio size={13} className="animate-pulse text-emerald-950" />
              <span>Carte Live</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white hover:text-black transition"
            title="Fermer l'atlas"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Barre de filtres et recherche */}
      <div className="border-b border-white/5 bg-[#0A0B10] px-4 py-3 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Recherche rapide */}
        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un univers, un lieu, un métier..."
            className="w-full rounded-full border border-white/10 bg-white/5 py-1.5 pl-9 pr-3 text-[13px] text-white placeholder-white/30 focus:border-white/30 focus:outline-none"
          />
        </div>

        {/* Pilules de catégories */}
        <div className="no-scrollbar flex w-full md:w-auto items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {THEME_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 rounded-full px-3 py-1 text-[11.5px] font-medium transition ${
                activeCategory === cat.id
                  ? 'bg-white text-black font-semibold'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENU PRINCIPAL SELON LE MODE */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative">
        {viewMode === 'mosaic' ? (
          /* VUE MOSAÏQUE GRILLE DE CARTES COMPLÈTE */
          <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredStyles.map((style) => {
                const isSelected = selectedStyleId === style.id;

                return (
                  <div
                    key={style.id}
                    onClick={() => {
                      onSelectStyle(style);
                      onClose();
                    }}
                    className={`cursor-pointer group relative overflow-hidden rounded-[26px] bg-[#12131C] border border-white/10 p-3 text-left transition-all duration-300 hover:border-white/30 hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] ${
                      isSelected ? 'ring-2 ring-emerald-400 bg-white/[0.08]' : ''
                    }`}
                  >
                    {/* Vignette photographique */}
                    <div className="relative aspect-[16/11] w-full overflow-hidden rounded-[20px]">
                      <img
                        src={style.image}
                        alt={style.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                      {/* Pastille chromatique */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span
                          className="h-2.5 w-2.5 rounded-full shadow-md"
                          style={{ background: style.accent }}
                        />
                        <span className="rounded-full bg-black/60 backdrop-blur-md px-2 py-0.5 text-[8.5px] font-bold text-white uppercase tracking-wider">
                          {style.category}
                        </span>
                      </div>

                      {/* Titres */}
                      <div className="absolute bottom-2.5 left-3 right-3 text-white">
                        <div className="text-[17px] font-bold leading-tight">{style.name}</div>
                        <div className="text-[11px] text-white/70 truncate mt-0.5">{style.tagline}</div>
                      </div>
                    </div>

                    {/* Missions humaines */}
                    <div className="mt-3 px-1 space-y-2">
                      <div className="text-[10.5px] text-white/50 flex items-center gap-1.5">
                        <Briefcase size={11} className="text-white/40 shrink-0" />
                        <span className="truncate">
                          {style.humanMissions.map((m) => m.role.split('/')[0].trim()).join(' · ')}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-emerald-400">
                          {style.vendorToolkit.badge}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-white group-hover:translate-x-1 transition">
                          <span>Sélectionner</span>
                          <ArrowRight size={12} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* VUE CARTE LIVE GÉOLOCALISÉE INTERACTIVE EN TEMPS RÉEL */
          <div className="relative h-full w-full min-h-[600px] flex items-center justify-center overflow-hidden bg-[#07080D]">
            {/* Grille cartographique futuriste en arrière-plan */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)',
                backgroundSize: '36px 36px',
              }}
            />

            {/* Représentation géographique stylisée / Coordonnées spatiales */}
            <div className="relative w-full max-w-5xl aspect-[16/10] max-h-[80vh] mx-auto rounded-[32px] border border-white/10 bg-[#0B0C14]/80 backdrop-blur-3xl overflow-hidden shadow-2xl p-6">
              {/* Lignes de repères cartographiques */}
              <div className="absolute inset-x-8 top-1/4 h-[1px] bg-white/[0.04] border-dashed" />
              <div className="absolute inset-x-8 top-1/2 h-[1px] bg-white/[0.04] border-dashed" />
              <div className="absolute inset-x-8 top-3/4 h-[1px] bg-white/[0.04] border-dashed" />
              <div className="absolute inset-y-8 left-1/3 w-[1px] bg-white/[0.04] border-dashed" />
              <div className="absolute inset-y-8 left-2/3 w-[1px] bg-white/[0.04] border-dashed" />

              {/* Boussole en bas à gauche */}
              <div className="absolute bottom-5 left-6 flex items-center gap-2 text-[10px] font-mono text-white/40">
                <Compass size={14} className="text-emerald-400 animate-spin" style={{ animationDuration: '30s' }} />
                <span>FLUX RADAR VOWS · SYNCHRONISATION EN COURS</span>
              </div>

              {/* Nœuds géolocalisés en direct sur la carte */}
              {LIVE_GEO_NODES.map((node) => {
                const targetStyle = WEDDING_STYLES.find((s) => s.id === node.styleId) || WEDDING_STYLES[0];
                const isSelected = activeGeoNode?.id === node.id;

                return (
                  <div
                    key={node.id}
                    style={{ left: `${node.lngRatio}%`, top: `${node.latRatio}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                    onClick={() => setActiveGeoNode(node)}
                  >
                    {/* Anneau d'onde radar live */}
                    {node.isPulse && (
                      <span className="absolute -inset-2.5 rounded-full bg-emerald-400/20 animate-ping opacity-75" />
                    )}

                    {/* Point central géolocalisé */}
                    <div
                      className={`relative flex items-center justify-center h-7 w-7 rounded-full shadow-lg border transition-all duration-300 ${
                        node.type === 'wedding'
                          ? 'bg-[#181924] border-white/30 text-white group-hover:scale-125'
                          : 'bg-emerald-950 border-emerald-400 text-emerald-300 group-hover:scale-125'
                      }`}
                    >
                      {node.type === 'wedding' ? <Users size={12} /> : <Briefcase size={12} />}
                    </div>

                    {/* Étiquette flottante permanente ou hover */}
                    <div className="absolute left-1/2 -top-8 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 backdrop-blur-md px-2 py-0.5 text-[9.5px] font-medium text-white border border-white/10 opacity-75 group-hover:opacity-100 transition shadow-md">
                      {node.label}
                    </div>
                  </div>
                );
              })}

              {/* Fiche d'inspection du point sélectionné sur la carte */}
              <AnimatePresence>
                {activeGeoNode && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute bottom-5 right-5 z-30 w-80 rounded-[22px] bg-[#141520]/95 backdrop-blur-xl border border-white/15 p-4 shadow-2xl text-left"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                          {activeGeoNode.type === 'wedding' ? 'Mariage Planifié' : 'Missionnaire en Direct'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveGeoNode(null)}
                        className="text-white/40 hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="mt-2.5 space-y-1">
                      <div className="text-[15px] font-bold text-white">{activeGeoNode.label}</div>
                      <div className="text-[11px] text-white/70">{activeGeoNode.sublabel}</div>
                      <div className="text-[10.5px] font-mono text-emerald-300 bg-emerald-950/40 rounded-md p-1.5 border border-emerald-500/20 mt-1">
                        ● {activeGeoNode.liveStatus}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/10 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          const targetStyle = WEDDING_STYLES.find((s) => s.id === activeGeoNode.styleId);
                          if (targetStyle) {
                            onSelectStyle(targetStyle);
                            onClose();
                          }
                        }}
                        className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-black hover:bg-neutral-200 transition"
                      >
                        <span>Ouvrir l'univers</span>
                        <ArrowRight size={11} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
