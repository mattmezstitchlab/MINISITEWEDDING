import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Clock,
  Calendar,
  Archive,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Sparkles,
  Sun,
  Shield,
  Layers,
  FileText,
  Music,
  User,
  ChevronRight,
  Maximize2,
  Minimize2,
  SlidersHorizontal,
  FolderOpen,
  Eye,
  CheckCircle2,
  Headphones,
  Compass,
  ArrowRight,
  Radio,
  Share2,
} from 'lucide-react';
import {
  type TimelineTrackItem,
  type TimelineMode,
  INITIAL_TIMELINE_ITEMS,
  TIMELINE_START_HOUR,
  TIMELINE_TOTAL_HOURS,
  TIMELINE_TOTAL_MINUTES,
  minutesToTimeString,
} from '../lib/timelineTheaterEngine';
import UnifiedEventOsMenu from '../components/UnifiedEventOsMenu';
import UnifiedUniverseMenu from '../components/UnifiedUniverseMenu';
import SaxophonistProfileModal from '../components/SaxophonistProfileModal';

export default function Theater() {
  const [mode, setMode] = useState<TimelineMode>('jour-j');
  const [items, setItems] = useState<TimelineTrackItem[]>(INITIAL_TIMELINE_ITEMS);
  const [selectedId, setSelectedId] = useState<string>('jj-3');
  const [zoomLevel, setZoomLevel] = useState<number>(1.2); // zoom 0.8x à 2.5x
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPlayheadMin, setCurrentPlayheadMin] = useState<number>(690); // 17:30
  const [audioPlaying, setAudioPlaying] = useState<string | null>(null);
  const [isSaxModalOpen, setIsSaxModalOpen] = useState(false);
  const [activeTabMedia, setActiveTabMedia] = useState<'visual' | 'doc' | 'audio'>('visual');

  const rulerScrollRef = useRef<HTMLDivElement>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const isDraggingRef = useRef<{ id: string; startX: number; origMin: number } | null>(null);
  const isResizingRef = useRef<{ id: string; startX: number; origDur: number } | null>(null);

  // Filtrage selon le mode (Jour J, Calendrier futur, Archives doc)
  const currentItems = useMemo(() => {
    return items.filter((it) => it.mode === mode);
  }, [items, mode]);

  const selectedItem = useMemo(() => {
    return items.find((it) => it.id === selectedId) || currentItems[0] || items[0];
  }, [items, selectedId, currentItems]);

  // Largeur de base de la ruler en pixels
  const pxPerHour = 140 * zoomLevel;
  const totalRulerWidth = TIMELINE_TOTAL_HOURS * pxPerHour;
  const pxPerMinute = pxPerHour / 60;

  // Animation Playhead en lecture simulée
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentPlayheadMin((prev) => {
        if (prev >= TIMELINE_TOTAL_MINUTES) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Auto-scroll vers le moment sélectionné lors du clic
  useEffect(() => {
    if (selectedItem && rulerScrollRef.current) {
      const momentLeft = selectedItem.startMinuteOfDay * pxPerMinute;
      const containerWidth = rulerScrollRef.current.clientWidth;
      rulerScrollRef.current.scrollTo({
        left: Math.max(0, momentLeft - containerWidth / 2 + 100),
        behavior: 'smooth',
      });
    }
  }, [selectedId, zoomLevel]);

  // Écoute audio preview
  const togglePlayAudio = (url?: string, itemId?: string) => {
    if (!url) return;
    if (audioPlaying === itemId) {
      activeAudioRef.current?.pause();
      setAudioPlaying(null);
    } else {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
      }
      const audio = new Audio(url);
      activeAudioRef.current = audio;
      audio.play().catch(() => {});
      audio.onended = () => setAudioPlaying(null);
      setAudioPlaying(itemId || null);
    }
  };

  // Drag & drop glisser pour repositionner
  const handleMouseDownMoment = (e: React.MouseEvent, item: TimelineTrackItem) => {
    e.stopPropagation();
    setSelectedId(item.id);
    isDraggingRef.current = {
      id: item.id,
      startX: e.clientX,
      origMin: item.startMinuteOfDay,
    };

    const handleMouseMove = (moveEvt: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = moveEvt.clientX - isDraggingRef.current.startX;
      const deltaMin = Math.round(deltaX / pxPerMinute);
      const rawMin = isDraggingRef.current.origMin + deltaMin;
      // Snapping 5 min
      const snappedMin = Math.max(0, Math.min(TIMELINE_TOTAL_MINUTES - item.durationMinutes, Math.round(rawMin / 5) * 5));

      setItems((prev) =>
        prev.map((it) => {
          if (it.id !== isDraggingRef.current?.id) return it;
          return {
            ...it,
            startMinuteOfDay: snappedMin,
            startTime: minutesToTimeString(snappedMin),
          };
        })
      );
    };

    const handleMouseUp = () => {
      isDraggingRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Redimensionnement de durée par poignée droite
  const handleMouseDownResize = (e: React.MouseEvent, item: TimelineTrackItem) => {
    e.stopPropagation();
    isResizingRef.current = {
      id: item.id,
      startX: e.clientX,
      origDur: item.durationMinutes,
    };

    const handleMouseMove = (moveEvt: MouseEvent) => {
      if (!isResizingRef.current) return;
      const deltaX = moveEvt.clientX - isResizingRef.current.startX;
      const deltaMin = Math.round(deltaX / pxPerMinute);
      const rawDur = isResizingRef.current.origDur + deltaMin;
      // Snapping 5 min avec min 15m et max 360m
      const snappedDur = Math.max(15, Math.min(360, Math.round(rawDur / 5) * 5));

      setItems((prev) =>
        prev.map((it) => {
          if (it.id !== isResizingRef.current?.id) return it;
          return {
            ...it,
            durationMinutes: snappedDur,
          };
        })
      );
    };

    const handleMouseUp = () => {
      isResizingRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#FBFBFD] text-[#0B0C12] select-none font-sans">
      
      {/* 1. BARRE SUPÉRIEURE DE NAVIGATION ET COMMANDES STUDIO UNIFIÉE */}
      <header className="h-16 shrink-0 z-40 border-b border-black/8 bg-white/95 px-4 sm:px-6 flex items-center justify-between backdrop-blur-xl">
        
        {/* Logo VOWS & Switcher de mode de timeline */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="vp-title text-[18px] font-bold italic tracking-wider text-[#0B0C12]">VOWS</span>
            <span className="text-[10.5px] font-mono uppercase tracking-wider text-black/40 hidden sm:inline">
              / Timeline Theater Studio
            </span>
          </Link>

          {/* Sélecteur de mode Studio */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-neutral-100 border border-black/5">
            <button
              type="button"
              onClick={() => setMode('jour-j')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-semibold transition ${
                mode === 'jour-j' ? 'bg-white text-black shadow-sm font-bold' : 'text-black/50 hover:text-black'
              }`}
            >
              <Clock size={13} />
              <span>Jour J Live</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-semibold transition ${
                mode === 'calendar' ? 'bg-white text-black shadow-sm font-bold' : 'text-black/50 hover:text-black'
              }`}
            >
              <Calendar size={13} />
              <span>Futurs Events</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('archives')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-semibold transition ${
                mode === 'archives' ? 'bg-white text-black shadow-sm font-bold' : 'text-black/50 hover:text-black'
              }`}
            >
              <Archive size={13} />
              <span>Archives &amp; Docs</span>
            </button>
          </div>
        </div>

        {/* Contrôles de lecture & Menus de navigation */}
        <div className="flex items-center gap-3">
          
          {/* Zoom Ruler */}
          <div className="flex items-center gap-0.5 bg-neutral-100 rounded-full p-1 border border-black/5">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.25))}
              className="p-1 text-black/60 hover:text-black transition"
              title="Dézoomer"
            >
              <ZoomOut size={13} />
            </button>
            <span className="text-[10px] font-mono px-1.5 text-black/60 font-semibold">{zoomLevel.toFixed(1)}×</span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
              className="p-1 text-black/60 hover:text-black transition"
              title="Zoomer"
            >
              <ZoomIn size={13} />
            </button>
          </div>

          {/* Bouton Simulation Playhead */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11.5px] font-bold transition border ${
              isPlaying
                ? 'bg-black text-white border-black shadow-sm'
                : 'bg-white text-black border-black/10 hover:border-black/30'
            }`}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Simulation Direct'}</span>
          </button>

          {/* Indicateur Heure Tête de lecture */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/5 font-mono text-[11.5px] text-black font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{minutesToTimeString(currentPlayheadMin)}</span>
          </div>

          {/* Menus unifiés Event OS & Univers */}
          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-black/8">
            <UnifiedEventOsMenu />
            <UnifiedUniverseMenu
              selectedStyleId={null}
              onSelectStyle={() => {
                window.location.href = '/';
              }}
            />
          </div>

        </div>

      </header>

      {/* 2. ESPACE CENTRAL FULLSCREEN : APERÇU MÉDIA, DOCUMENT & ALIGNEMENT AU CENTRE */}
      <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 bg-[#FBFBFD] flex items-center justify-center">
        <div className="w-full max-w-6xl h-full flex flex-col justify-center">
          
          {selectedItem ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full max-h-[580px]">
              
              {/* GRAND ÉCRAN MÉDIA / VISUEL DU MOMENT AU CENTRE (7 colonnes) */}
              <div className="lg:col-span-7 flex flex-col rounded-[32px] bg-white border border-black/8 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
                
                {/* Barre supérieure de l'écran média */}
                <div className="px-5 py-3.5 border-b border-black/8 flex items-center justify-between bg-neutral-50/50">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-black" />
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-black/50">
                      {selectedItem.chapter}
                    </span>
                  </div>

                  {/* Onglets de visualisation */}
                  <div className="flex items-center gap-1 bg-white rounded-full p-1 border border-black/5">
                    <button
                      type="button"
                      onClick={() => setActiveTabMedia('visual')}
                      className={`px-2.5 py-1 rounded-full text-[10.5px] font-semibold transition ${
                        activeTabMedia === 'visual' ? 'bg-black text-white' : 'text-black/50 hover:text-black'
                      }`}
                    >
                      Visuel &amp; Scène
                    </button>
                    {selectedItem.docBadge && (
                      <button
                        type="button"
                        onClick={() => setActiveTabMedia('doc')}
                        className={`px-2.5 py-1 rounded-full text-[10.5px] font-semibold transition ${
                          activeTabMedia === 'doc' ? 'bg-black text-white' : 'text-black/50 hover:text-black'
                        }`}
                      >
                        Document
                      </button>
                    )}
                    {selectedItem.audioPreviewUrl && (
                      <button
                        type="button"
                        onClick={() => setActiveTabMedia('audio')}
                        className={`px-2.5 py-1 rounded-full text-[10.5px] font-semibold transition ${
                          activeTabMedia === 'audio' ? 'bg-black text-white' : 'text-black/50 hover:text-black'
                        }`}
                      >
                        Audio Master
                      </button>
                    )}
                  </div>
                </div>

                {/* Contenu visuel / lecteur */}
                <div className="flex-1 relative overflow-hidden bg-neutral-900 flex items-center justify-center min-h-[260px]">
                  {activeTabMedia === 'visual' && (
                    <>
                      {selectedItem.mediaUrl ? (
                        <img
                          src={selectedItem.mediaUrl}
                          alt={selectedItem.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="text-white/40 font-mono text-[13px] flex items-center gap-2">
                          <Eye size={16} />
                          <span>Aperçu de scène généré en direct</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                      
                      <div className="absolute bottom-4 left-5 right-5 text-white pointer-events-none">
                        <div className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                          {selectedItem.startTime} · Durée {selectedItem.durationMinutes} min
                        </div>
                        <h2 className="text-[20px] sm:text-[24px] font-bold leading-tight mt-0.5">
                          {selectedItem.title}
                        </h2>
                        <p className="text-[12.5px] text-white/80 line-clamp-1 mt-1">
                          {selectedItem.subtitle}
                        </p>
                      </div>
                    </>
                  )}

                  {activeTabMedia === 'doc' && (
                    <div className="p-8 w-full h-full bg-neutral-50 flex flex-col justify-between text-[#0B0C12]">
                      <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-[11px] font-mono font-bold">
                          <CheckCircle2 size={13} />
                          <span>DOCUMENT OFFICIEL SCELLÉ VOWS</span>
                        </div>
                        <h3 className="text-[22px] font-bold text-black">{selectedItem.docBadge}</h3>
                        <p className="text-[13px] text-black/70 leading-relaxed max-w-lg">
                          Ce livrable a été validé et horodaté sur le registre de l'événement.
                          Toutes les parties prenantes (mariés, coordinateurs, prestataires) disposent de la même version sans désynchronisation.
                        </p>
                      </div>
                      <div className="flex items-center gap-3 pt-4 border-t border-black/10">
                        <button
                          type="button"
                          className="px-4 py-2 rounded-full bg-black text-white text-[12px] font-bold hover:bg-neutral-800 transition"
                        >
                          Télécharger la copie PDF certifiée
                        </button>
                        <span className="text-[11px] font-mono text-black/40">SHA-256 : e7b92...8fa1</span>
                      </div>
                    </div>
                  )}

                  {activeTabMedia === 'audio' && (
                    <div className="p-8 w-full h-full bg-neutral-950 text-white flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                          FLUX AUDIO HAUTE FIDÉLITÉ 320 KBPS
                        </div>
                        <h3 className="text-[20px] font-bold">Bande-son du moment calibrée</h3>
                        <p className="text-[12.5px] text-white/60">
                          Tempo cible synchronisé avec le rythme de la journée : {selectedItem.targetBpm || 105} BPM.
                        </p>
                      </div>

                      <div className="flex items-center gap-4 py-4">
                        <button
                          type="button"
                          onClick={() => togglePlayAudio(selectedItem.audioPreviewUrl, selectedItem.id)}
                          className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black transition hover:scale-105 shadow-xl"
                        >
                          {audioPlaying === selectedItem.id ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                        </button>
                        <div className="space-y-1">
                          <div className="text-[13px] font-bold text-white">
                            {audioPlaying === selectedItem.id ? 'Lecture en cours sur les retours...' : 'Prêt pour l’écoute'}
                          </div>
                          <div className="text-[11px] font-mono text-white/50">Flux station direct VOWS</div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

              </div>

              {/* PANNEAU LATÉRAL : ALIGNEMENT MÉTIERS, PRESTATAIRES & MINI-SITES (5 colonnes) */}
              <div className="lg:col-span-5 rounded-[32px] bg-white border border-black/8 p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex flex-col justify-between overflow-y-auto">
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-black/8">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-black/40 font-bold">
                      Alignement &amp; Fiche Spatiale
                    </span>
                    <span className="rounded-full bg-black/5 text-black px-2.5 py-0.5 text-[10px] font-mono font-bold">
                      ID: {selectedItem.id}
                    </span>
                  </div>

                  {/* Titre & Description détaillée */}
                  <div>
                    <h3 className="text-[18px] font-bold text-black">{selectedItem.title}</h3>
                    <p className="text-[13px] text-black/60 mt-1.5 leading-relaxed">
                      {selectedItem.description}
                    </p>
                  </div>

                  {/* Horodatage & Durée avec boutons +/- direct */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <div className="p-3 rounded-[18px] bg-[#F7F7F8] border border-black/5">
                      <div className="text-[9.5px] font-mono text-black/40 uppercase">Début Nominale</div>
                      <div className="text-[16px] font-bold font-mono text-black mt-0.5">
                        {selectedItem.startTime}
                      </div>
                    </div>
                    <div className="p-3 rounded-[18px] bg-[#F7F7F8] border border-black/5">
                      <div className="text-[9.5px] font-mono text-black/40 uppercase">Durée Allouée</div>
                      <div className="text-[16px] font-bold font-mono text-black mt-0.5">
                        {selectedItem.durationMinutes} min
                      </div>
                    </div>
                  </div>

                  {/* Carte Métier Aligné / Déclinaison vers le Mini-site */}
                  {selectedItem.alignedRole && (
                    <div className="p-4 rounded-[22px] border border-black/10 bg-neutral-50/70 space-y-2.5">
                      <div className="flex items-center justify-between text-[10.5px] font-mono text-black/50">
                        <span className="font-bold">MISSIONNAIRE ASSIGNÉ :</span>
                        <User size={13} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[14px] font-bold text-black">{selectedItem.alignedRole}</div>
                          <div className="text-[11px] text-black/50 mt-0.5">Mini-site synchronisé avec le conducteur</div>
                        </div>

                        {/* Si rôle saxophoniste, bouton d'ouverture directe de sa modale */}
                        {selectedItem.alignedRole.toLowerCase().includes('sax') && (
                          <button
                            type="button"
                            onClick={() => setIsSaxModalOpen(true)}
                            className="px-3 py-1.5 rounded-full bg-black text-white text-[11px] font-bold hover:bg-neutral-800 transition shadow-sm"
                          >
                            Voir Mini-Site
                          </button>
                        )}
                      </div>

                      {selectedItem.solarConstraint && (
                        <div className="flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 border border-amber-200/60 rounded-xl p-2 font-mono">
                          <Sun size={12} className="text-amber-500 shrink-0" />
                          <span>Contrainte Golden Hour impérative (coucher du soleil)</span>
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* Pied du panneau : indication glisser-déposer */}
                <div className="pt-4 border-t border-black/8 flex items-center justify-between text-[11px] text-black/40 font-mono">
                  <span>💡 Glissez le bloc sur la règle pour déplacer</span>
                  <span>↔ Poignée droite pour étirer</span>
                </div>

              </div>

            </div>
          ) : (
            <div className="text-center py-20 text-black/40">Sélectionnez un moment</div>
          )}

        </div>
      </main>

      {/* 3. SURFACE HORIZONTALE PLEINE LARGEUR EN BAS : LA TIMELINE RULER GLISSABLE */}
      <footer className="shrink-0 h-48 border-t border-black/10 bg-white/95 px-4 sm:px-6 py-3 flex flex-col justify-between shadow-[0_-15px_40px_rgba(0,0,0,0.04)]">
        
        {/* En-tête de la Timeline Ruler */}
        <div className="flex items-center justify-between text-[11px] pb-1">
          <div className="flex items-center gap-2 font-mono text-black/60">
            <SlidersHorizontal size={12} className="text-black" />
            <span className="font-bold text-black uppercase tracking-wider">Surface de Montage Temporel</span>
            <span>(06:00 → 04:00 J+1)</span>
            <span className="text-[10px] bg-black/5 px-2 py-0.5 rounded-full">Aimantation 5 min</span>
          </div>

          <div className="flex items-center gap-4 text-black/40 font-mono text-[10.5px]">
            <span>Glisser = Déplacer heure</span>
            <span>Poignée droite = Étirer durée</span>
            <button
              type="button"
              onClick={() => {
                setItems(INITIAL_TIMELINE_ITEMS);
                setSelectedId('jj-3');
              }}
              className="hover:text-black transition flex items-center gap-1"
            >
              <RotateCcw size={11} />
              <span>Réinitialiser</span>
            </button>
          </div>
        </div>

        {/* CONTENEUR DE LA RÈGLE DÉFILABLE HORIZONTALEMENT */}
        <div
          ref={rulerScrollRef}
          className="relative flex-1 overflow-x-auto rounded-[20px] bg-[#F7F7F8] border border-black/8 p-2 custom-scrollbar shadow-inner"
        >
          <div
            className="relative h-28 select-none"
            style={{ width: `${totalRulerWidth}px` }}
          >
            
            {/* HEURES ET GRADUATIONS DE FOND */}
            <div className="absolute inset-x-0 top-0 h-7 border-b border-black/10 flex">
              {Array.from({ length: TIMELINE_TOTAL_HOURS }).map((_, hIdx) => {
                const hour = (TIMELINE_START_HOUR + hIdx) % 24;
                const isGolden = hour === 18 || hour === 19;

                return (
                  <div
                    key={hIdx}
                    className="relative h-full border-r border-black/10 font-mono text-[10.5px] text-black/40 pl-2 pt-0.5 flex flex-col justify-between"
                    style={{ width: `${pxPerHour}px` }}
                  >
                    <div className="flex items-center gap-1 font-bold">
                      <span>{hour.toString().padStart(2, '0')}:00</span>
                      {isGolden && <Sun size={9} className="text-amber-500" />}
                    </div>

                    <div className="flex justify-between px-1 pb-0.5">
                      <span className="h-1 w-[1px] bg-black/15" />
                      <span className="h-2 w-[1px] bg-black/30" />
                      <span className="h-1 w-[1px] bg-black/15" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* GUIDES VERTICAUX */}
            <div className="absolute inset-0 top-7 pointer-events-none flex">
              {Array.from({ length: TIMELINE_TOTAL_HOURS }).map((_, hIdx) => (
                <div
                  key={hIdx}
                  className="h-full border-r border-black/[0.03]"
                  style={{ width: `${pxPerHour}px` }}
                />
              ))}
            </div>

            {/* TÊTE DE LECTURE ROUGE (PLAYHEAD) */}
            <div
              className="absolute top-0 bottom-0 z-30 pointer-events-none transition-all duration-100"
              style={{ left: `${currentPlayheadMin * pxPerMinute}px` }}
            >
              <div className="h-full w-[2px] bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
              <div className="-translate-x-1/2 rounded-full bg-rose-500 text-white font-mono text-[8.5px] font-bold px-1.5 py-0.5 shadow-sm mt-0.5">
                NOW
              </div>
            </div>

            {/* BLOCS TEMPORELS MANIPULABLES PAR DRAG & RESIZE */}
            <div className="absolute inset-x-0 top-9 bottom-1">
              {currentItems.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                const leftPx = item.startMinuteOfDay * pxPerMinute;
                const widthPx = Math.max(85, item.durationMinutes * pxPerMinute);

                return (
                  <div
                    key={item.id}
                    onMouseDown={(e) => handleMouseDownMoment(e, item)}
                    className={`absolute top-1 rounded-[16px] p-2.5 text-left cursor-grab active:cursor-grabbing transition-shadow select-none group ${
                      isSelected
                        ? 'bg-black text-white shadow-xl ring-2 ring-black/20 z-20 scale-[1.01]'
                        : 'bg-white text-black border border-black/10 hover:border-black/30 shadow-sm z-10'
                    }`}
                    style={{
                      left: `${leftPx}px`,
                      width: `${widthPx}px`,
                      height: '68px',
                    }}
                  >
                    {/* Heure & Durée */}
                    <div className="flex items-center justify-between pb-1 border-b border-current/10">
                      <div className="flex items-center gap-1">
                        <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-emerald-400' : 'bg-black'}`} />
                        <span className="font-mono text-[9.5px] font-bold">{item.startTime}</span>
                      </div>
                      <span className="font-mono text-[8.5px] opacity-70">{item.durationMinutes}m</span>
                    </div>

                    {/* Titre */}
                    <div className="font-bold text-[11px] truncate mt-1 leading-tight">
                      {item.title}
                    </div>

                    <div className="text-[9px] opacity-60 truncate">
                      {item.alignedRole || item.subtitle}
                    </div>

                    {/* POIGNÉE DE REDIMENSIONNEMENT DROITE */}
                    <div
                      onMouseDown={(e) => handleMouseDownResize(e, item)}
                      className="absolute right-0 top-0 bottom-0 w-2.5 cursor-ew-resize hover:bg-neutral-400/40 rounded-r-[16px] transition flex items-center justify-center opacity-0 group-hover:opacity-100"
                      title="Étirer la durée"
                    >
                      <div className="h-4 w-[2px] bg-current opacity-40" />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </footer>

      {/* MODALE SAXOPHONISTE DU CRÉATEUR SI SOUHAITÉ */}
      <SaxophonistProfileModal
        isOpen={isSaxModalOpen}
        onClose={() => setIsSaxModalOpen(false)}
      />

    </div>
  );
}
