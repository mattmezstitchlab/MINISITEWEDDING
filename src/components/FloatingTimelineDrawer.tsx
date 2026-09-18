import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Maximize2,
  Clock,
  Sun,
  User,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  INITIAL_TIMELINE_ITEMS,
  type TimelineTrackItem,
  TIMELINE_START_HOUR,
  TIMELINE_TOTAL_HOURS,
  TIMELINE_TOTAL_MINUTES,
  minutesToTimeString,
} from '../lib/timelineTheaterEngine';

interface FloatingTimelineDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeThemeName?: string;
}

export default function FloatingTimelineDrawer({
  isOpen,
  onClose,
  activeThemeName = 'Général',
}: FloatingTimelineDrawerProps) {
  const [items, setItems] = useState<TimelineTrackItem[]>(
    INITIAL_TIMELINE_ITEMS.filter((m) => m.mode === 'jour-j')
  );
  const [selectedId, setSelectedId] = useState<string>('jj-3');

  const rulerScrollRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<{ id: string; startX: number; origMin: number } | null>(null);
  const isResizingRef = useRef<{ id: string; startX: number; origDur: number } | null>(null);

  const zoomLevel = 1.1;
  const pxPerHour = 130 * zoomLevel;
  const totalRulerWidth = TIMELINE_TOTAL_HOURS * pxPerHour;
  const pxPerMinute = pxPerHour / 60;

  const selectedItem = items.find((it) => it.id === selectedId) || items[0];

  // Auto-scroll vers le moment sélectionné à l'ouverture
  useEffect(() => {
    if (isOpen && selectedItem && rulerScrollRef.current) {
      const momentLeft = selectedItem.startMinuteOfDay * pxPerMinute;
      const containerWidth = rulerScrollRef.current.clientWidth;
      rulerScrollRef.current.scrollTo({
        left: Math.max(0, momentLeft - containerWidth / 2 + 100),
        behavior: 'smooth',
      });
    }
  }, [isOpen, selectedId]);

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          className="fixed inset-x-0 bottom-0 z-50 pointer-events-auto"
        >
          <div className="mx-auto max-w-6xl px-2 sm:px-6 pb-2">
            <div className="relative overflow-hidden rounded-[28px] bg-white/95 backdrop-blur-2xl border border-black/10 shadow-[0_-20px_60px_rgba(0,0,0,0.18)] p-3 sm:p-4 text-[#0B0C12]">
              
              {/* En-tête ultra-épuré 100% pictos & action direct */}
              <div className="flex items-center justify-between pb-2 border-b border-black/8">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white">
                    <SlidersHorizontal size={13} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[13px] text-black">Timeline Jour J</span>
                    <span className="text-[10px] font-mono text-black/40">06:00 → 04:00 (+1)</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/theater"
                    onClick={onClose}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white hover:bg-neutral-800 transition"
                    title="Ouvrir le Studio Cinéma Plein Écran"
                  >
                    <Maximize2 size={13} />
                  </Link>

                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-black hover:bg-neutral-200 transition"
                    title="Fermer"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* RÈGLE IDENTIQUE AU STUDIO AVEC VRAI DRAG & RESIZE */}
              <div
                ref={rulerScrollRef}
                className="relative mt-2 overflow-x-auto rounded-[18px] bg-[#F7F7F8] border border-black/8 p-2 custom-scrollbar shadow-inner"
              >
                <div
                  className="relative h-28 select-none"
                  style={{ width: `${totalRulerWidth}px` }}
                >
                  {/* Heures & Graduations */}
                  <div className="absolute inset-x-0 top-0 h-7 border-b border-black/10 flex">
                    {Array.from({ length: TIMELINE_TOTAL_HOURS }).map((_, hIdx) => {
                      const hour = (TIMELINE_START_HOUR + hIdx) % 24;
                      const isGolden = hour === 18 || hour === 19;

                      return (
                        <div
                          key={hIdx}
                          className="relative h-full border-r border-black/10 font-mono text-[10px] text-black/40 pl-2 pt-0.5 flex flex-col justify-between"
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

                  {/* Blocs manipulables */}
                  <div className="absolute inset-x-0 top-9 bottom-1">
                    {items.map((item) => {
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
                          <div className="flex items-center justify-between pb-1 border-b border-current/10">
                            <div className="flex items-center gap-1">
                              <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-emerald-400' : 'bg-black'}`} />
                              <span className="font-mono text-[9px] font-bold">{item.startTime}</span>
                            </div>
                            <span className="font-mono text-[8.5px] opacity-70">{item.durationMinutes}m</span>
                          </div>

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

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
