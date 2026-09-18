import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Clock,
  Calendar,
  FileText,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  RotateCcw,
  Sun,
  Music,
  User,
  SlidersHorizontal,
  Headphones,
  Eye,
  CheckCircle2,
  Sparkles,
  Layers,
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
  const [zoomLevel, setZoomLevel] = useState<number>(1.2);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPlayheadMin, setCurrentPlayheadMin] = useState<number>(690); // 17:30
  const [audioPlaying, setAudioPlaying] = useState<string | null>(null);
  const [isSaxModalOpen, setIsSaxModalOpen] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState<'visual' | 'doc' | 'audio'>('visual');

  const rulerScrollRef = useRef<HTMLDivElement>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const isDraggingRef = useRef<{ id: string; startX: number; origMin: number } | null>(null);
  const isResizingRef = useRef<{ id: string; startX: number; origDur: number } | null>(null);

  // Filtrage selon le mode
  const currentItems = useMemo(() => {
    return items.filter((it) => it.mode === mode);
  }, [items, mode]);

  const selectedItem = useMemo(() => {
    return items.find((it) => it.id === selectedId) || currentItems[0] || items[0];
  }, [items, selectedId, currentItems]);

  // Échelle de largeur en pixels
  const pxPerHour = 140 * zoomLevel;
  const totalRulerWidth = TIMELINE_TOTAL_HOURS * pxPerHour;
  const pxPerMinute = pxPerHour / 60;

  // Lecture playhead simulation
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

  // Centrage auto sur le moment
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

  // Audio preview
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
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-black text-[#0B0C12] select-none font-sans">
      
      {/* 1. BARRE FLOTTANTE DISCRÈTE EN HAUT : CAPSULE GLASS VOWS & PICTOS */}
      <header className="absolute top-3 inset-x-0 z-40 px-3 sm:px-6 pointer-events-none">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          
          {/* Logo & Modes (100% pictos) */}
          <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-xl px-3 py-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-black/5">
            <Link to="/" className="flex items-center gap-1.5 pr-2 border-r border-black/10" title="Retour à l'accueil">
              <span className="vp-title text-[17px] font-bold italic tracking-wider text-[#0B0C12]">VOWS</span>
            </Link>

            {/* Pictos des 3 Modes */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMode('jour-j')}
                className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                  mode === 'jour-j' ? 'bg-black text-white shadow-sm' : 'text-black/50 hover:bg-black/5 hover:text-black'
                }`}
                title="Jour J Live (06:00 → 04:00)"
              >
                <Clock size={15} />
              </button>
              <button
                type="button"
                onClick={() => setMode('calendar')}
                className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                  mode === 'calendar' ? 'bg-black text-white shadow-sm' : 'text-black/50 hover:bg-black/5 hover:text-black'
                }`}
                title="Calendrier & Futurs Événements"
              >
                <Calendar size={15} />
              </button>
              <button
                type="button"
                onClick={() => setMode('archives')}
                className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                  mode === 'archives' ? 'bg-black text-white shadow-sm' : 'text-black/50 hover:bg-black/5 hover:text-black'
                }`}
                title="Archives & Documents scellés"
              >
                <FileText size={15} />
              </button>
            </div>
          </div>

          {/* Outils & Commandes droite */}
          <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-xl px-3 py-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-black/5">
            
            {/* Zoom */}
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.25))}
                className="p-1 text-black/60 hover:text-black transition"
                title="Dézoomer"
              >
                <ZoomOut size={13} />
              </button>
              <span className="text-[10px] font-mono px-1 text-black/60 font-semibold">{zoomLevel.toFixed(1)}×</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                className="p-1 text-black/60 hover:text-black transition"
                title="Zoomer"
              >
                <ZoomIn size={13} />
              </button>
            </div>

            {/* Playhead Direct */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex h-7 w-7 items-center justify-center rounded-full transition ${
                isPlaying ? 'bg-black text-white shadow-sm' : 'bg-black/5 text-black hover:bg-black/10'
              }`}
              title={isPlaying ? 'Pause simulation' : 'Simulation en direct'}
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            </button>

            {/* Horloge Tête */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/5 font-mono text-[11px] text-black font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{minutesToTimeString(currentPlayheadMin)}</span>
            </div>

            {/* Menus unifiés Event OS & Univers */}
            <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-black/10">
              <UnifiedEventOsMenu />
              <UnifiedUniverseMenu
                selectedStyleId={null}
                onSelectStyle={() => {
                  window.location.href = '/';
                }}
              />
            </div>

          </div>

        </div>
      </header>

      {/* 2. ESPACE CENTRAL BORD-À-BORD IMMERSIF (FAÇON HERO MINI-SITE) */}
      <main className="flex-1 min-h-0 relative w-full overflow-hidden flex items-end">
        
        {/* FOND CINÉMATOGRAPHIQUE PLEIN ÉCRAN DU THÈME / MOMENT */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedItem?.id || 'empty'}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-0 bg-neutral-900"
          >
            {activeMediaTab === 'visual' && (
              <>
                {selectedItem?.mediaUrl ? (
                  <img
                    src={selectedItem.mediaUrl}
                    alt={selectedItem.title}
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-white/30 font-mono text-[13px]">
                    <Eye size={20} className="mr-2" />
                    <span>Visuel haute scénographie</span>
                  </div>
                )}
                {/* Dégradé doux vers le bas pour faire ressortir la timeline et les textes */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
              </>
            )}

            {/* ÉCRAN DOCUMENT SCELLÉ */}
            {activeMediaTab === 'doc' && (
              <div className="h-full w-full bg-[#111218] p-8 sm:p-14 flex items-center justify-center text-white pb-24">
                <div className="max-w-xl space-y-3 text-center">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3.5 py-1 text-[11px] font-mono font-bold uppercase">
                    <CheckCircle2 size={13} />
                    <span>Document Scellé Registre VOWS</span>
                  </div>
                  <h2 className="text-[26px] sm:text-[32px] font-bold text-white">{selectedItem?.docBadge}</h2>
                  <p className="text-[13.5px] text-white/70 leading-relaxed">
                    Certifié intègre et non altérable. Version opposable pour l'ensemble des missionnaires et intervenants du Jour J.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-full bg-white text-black text-[12px] font-bold hover:bg-neutral-200 transition shadow-lg"
                    >
                      Consulter le PDF sécurisé
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ÉCRAN AUDIO DIRECT */}
            {activeMediaTab === 'audio' && (
              <div className="h-full w-full bg-[#090A0F] p-8 sm:p-14 flex items-center justify-center text-white pb-24">
                <div className="max-w-md text-center space-y-4">
                  <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    FLUX MASTER LIVE 320 KBPS
                  </div>
                  <h2 className="text-[24px] sm:text-[30px] font-bold">Bande sonore calibrée</h2>
                  <p className="text-[13px] text-white/60">
                    Cadence synchronisée : {selectedItem?.targetBpm || 105} BPM pour ce moment.
                  </p>
                  <div className="pt-2 flex justify-center">
                    <button
                      type="button"
                      onClick={() => togglePlayAudio(selectedItem?.audioPreviewUrl, selectedItem?.id)}
                      className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black transition hover:scale-105 shadow-2xl"
                    >
                      {audioPlaying === selectedItem?.id ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* BANDEAU FLOTTANT EN BAS DU HERO (TITRE & RÔLE ALIGNÉ DU MOMENT) */}
        {selectedItem && (
          <div className="relative z-10 w-full px-4 sm:px-8 pb-4 pointer-events-none">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
              
              {/* Informations du moment (hiérarchie pure sans répétition inutile) */}
              <div className="text-white space-y-1 drop-shadow-md">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-white/70 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-md">
                    {selectedItem.chapter}
                  </span>
                  {selectedItem.solarConstraint && (
                    <span className="flex items-center gap-1 text-[10.5px] font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full backdrop-blur-md">
                      <Sun size={11} />
                      <span>Golden Hour</span>
                    </span>
                  )}
                </div>

                <h1 className="text-[26px] sm:text-[38px] font-bold tracking-tight text-white leading-tight">
                  {selectedItem.title}
                </h1>
                
                <p className="text-[13px] sm:text-[14px] text-white/80 max-w-2xl line-clamp-1">
                  {selectedItem.description}
                </p>
              </div>

              {/* Rôle aligné & commutateur de vue média */}
              <div className="pointer-events-auto flex items-center gap-2 shrink-0">
                
                {/* Sélecteur de type d'aperçu au centre */}
                <div className="flex items-center gap-1 bg-white/15 backdrop-blur-xl rounded-full p-1 border border-white/20 text-white">
                  <button
                    type="button"
                    onClick={() => setActiveMediaTab('visual')}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
                      activeMediaTab === 'visual' ? 'bg-white text-black shadow-md' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Visuel
                  </button>
                  {selectedItem.docBadge && (
                    <button
                      type="button"
                      onClick={() => setActiveMediaTab('doc')}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
                        activeMediaTab === 'doc' ? 'bg-white text-black shadow-md' : 'text-white/70 hover:text-white'
                      }`}
                    >
                      Doc
                    </button>
                  )}
                  {selectedItem.audioPreviewUrl && (
                    <button
                      type="button"
                      onClick={() => setActiveMediaTab('audio')}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
                        activeMediaTab === 'audio' ? 'bg-white text-black shadow-md' : 'text-white/70 hover:text-white'
                      }`}
                    >
                      Audio
                    </button>
                  )}
                </div>

                {/* Si rôle assigné, badge interactif */}
                {selectedItem.alignedRole && (
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedItem.alignedRole?.toLowerCase().includes('sax')) {
                        setIsSaxModalOpen(true);
                      }
                    }}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-black text-[12px] font-bold shadow-lg hover:bg-neutral-200 transition"
                  >
                    <User size={13} />
                    <span>{selectedItem.alignedRole}</span>
                  </button>
                )}

              </div>

            </div>
          </div>
        )}

      </main>

      {/* 3. SURFACE HORIZONTALE PLEINE LARGEUR BORD-À-BORD EN BAS (TIMELINE RULER) */}
      <footer className="shrink-0 h-44 sm:h-48 bg-white border-t border-black/10 px-3 sm:px-6 py-2.5 flex flex-col justify-between shadow-[0_-15px_40px_rgba(0,0,0,0.15)] z-30">
        
        {/* Barre de contrôle fine de la Timeline */}
        <div className="flex items-center justify-between text-[11px] pb-1">
          <div className="flex items-center gap-2 font-mono text-black/60">
            <SlidersHorizontal size={13} className="text-black" />
            <span className="font-bold text-black uppercase tracking-wider text-[11px]">Timeline</span>
            <span className="text-[10px] text-black/40 font-mono">06:00 → 04:00 (+1)</span>
          </div>

          <div className="flex items-center gap-2 text-black/40 font-mono text-[10.5px]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] bg-black/5 px-2 py-0.5 rounded-full">Snap 5m</span>
            <button
              type="button"
              onClick={() => {
                setItems(INITIAL_TIMELINE_ITEMS);
                setSelectedId('jj-3');
              }}
              className="hover:text-black transition p-1"
              title="Réinitialiser"
            >
              <RotateCcw size={12} />
            </button>
          </div>
        </div>

        {/* SURFACE DE LA RÈGLE DÉFILABLE BORD-À-BORD */}
        <div
          ref={rulerScrollRef}
          className="relative flex-1 overflow-x-auto rounded-[18px] bg-[#F7F7F8] border border-black/8 p-2 custom-scrollbar shadow-inner"
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

            {/* BLOCS TEMPORELS MANIPULABLES */}
            <div className="absolute inset-x-0 top-9 bottom-1">
              {currentItems.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                const leftPx = item.startMinuteOfDay * pxPerMinute;
                const widthPx = Math.max(85, item.durationMinutes * pxPerMinute);

                return (
                  <div
                    key={item.id}
                    onMouseDown={(e) => handleMouseDownMoment(e, item)}
                    className={`absolute top-1 rounded-[16px] p-2.5 text-left cursor-grab active:cursor-grabbing transition-all select-none group ${
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

                    {/* Poignée de redimensionnement droite */}
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

      {/* MODALE SAXOPHONISTE DU CRÉATEUR */}
      <SaxophonistProfileModal
        isOpen={isSaxModalOpen}
        onClose={() => setIsSaxModalOpen(false)}
      />

    </div>
  );
}
