import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Radio,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  Layers,
  FileCheck,
  Disc,
  Compass,
  Play,
  Pause,
  Check,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  INITIAL_TIMELINE_ITEMS,
  type TimelineTrackItem,
  type ViewerPerspective,
  TIMELINE_START_HOUR,
  TIMELINE_TOTAL_HOURS,
  TIMELINE_TOTAL_MINUTES,
  minutesToTimeString,
} from '../lib/timelineTheaterEngine';
import { WEDDING_STYLES, type WeddingStyle } from '../lib/weddingStyles';
import UniversalInteractiveCardViewer from './UniversalInteractiveCardViewer';

// Canaux de fréquences dédiés selon le profil (Traiteur, Salle, Musiciens, Invités, Mariés)
export type RadioChannel = 'general' | 'maries' | 'traiteur' | 'son_sax' | 'invites';

export const RADIO_CHANNELS: { id: RadioChannel; name: string; freq: string; roleTag: string }[] = [
  { id: 'maries', name: 'Canal Cœur · Mariés', freq: '98.4 MHz', roleTag: 'Cockpit Intime' },
  { id: 'son_sax', name: 'Canal Régie · Son & Saxophone', freq: '102.1 MHz', roleTag: 'Artistes & DJ' },
  { id: 'traiteur', name: 'Canal Banquet · Traiteur & Salle', freq: '105.8 MHz', roleTag: 'Cuisine & Maître d’Hôtel' },
  { id: 'invites', name: 'Canal Public · Invités', freq: '91.2 MHz', roleTag: 'Flux & Musique Live' },
];

interface IntegratedMirrorTimelineBarProps {
  currentPerspective?: ViewerPerspective; // 'guest' | 'couple' | 'vendor'
  activeStyleId?: string | null;
  onChangePerspective?: (p: ViewerPerspective) => void;
  onSelectStyle?: (style: WeddingStyle) => void;
}

export default function IntegratedMirrorTimelineBar({
  currentPerspective = 'couple',
  activeStyleId,
  onChangePerspective,
  onSelectStyle,
}: IntegratedMirrorTimelineBarProps) {
  const [perspective, setPerspective] = useState<ViewerPerspective>(currentPerspective);
  const [items, setItems] = useState<TimelineTrackItem[]>(INITIAL_TIMELINE_ITEMS);
  const [selectedItemId, setSelectedItemId] = useState<string>('jj-3');
  const [isCardViewerOpen, setIsCardViewerOpen] = useState<boolean>(true);
  
  // MOTEUR D'ACCORDAGE AUTOMATIQUE (Boussole Accordeur / Auto-Tuner Temporel)
  const [isAutoTuning, setIsAutoTuning] = useState<boolean>(false);
  const [currentChannel, setCurrentChannel] = useState<RadioChannel>('son_sax');
  const [activeThemeIdx, setActiveThemeIdx] = useState<number>(0);

  const rulerScrollRef = useRef<HTMLDivElement>(null);

  // Synchronisation avec le thème passé en props
  useEffect(() => {
    if (activeStyleId) {
      const idx = WEDDING_STYLES.findIndex((s) => s.id === activeStyleId);
      if (idx !== -1) setActiveThemeIdx(idx);
    }
  }, [activeStyleId]);

  const currentTheme = WEDDING_STYLES[activeThemeIdx] || WEDDING_STYLES[0];

  // Filtrage des éléments selon les autorisations
  const visibleItems = items.filter((item) => item.visibility.includes(perspective));
  const selectedItem = items.find((it) => it.id === selectedItemId) || visibleItems[0] || items[0];

  const zoomLevel = 1.05;
  const pxPerHour = 120 * zoomLevel;
  const totalRulerWidth = TIMELINE_TOTAL_HOURS * pxPerHour;
  const pxPerMinute = pxPerHour / 60;

  // AUTO-ACCORDAGE : Quand on change d'univers ou active l'auto-tuner, la timeline défile seule et s'ancre sur le repère clé
  const tuneToMoment = (item: TimelineTrackItem) => {
    setSelectedItemId(item.id);
    if (rulerScrollRef.current) {
      const momentLeft = item.startMinuteOfDay * pxPerMinute;
      const containerWidth = rulerScrollRef.current.clientWidth;
      rulerScrollRef.current.scrollTo({
        left: Math.max(0, momentLeft - containerWidth / 2 + 80),
        behavior: 'smooth',
      });
    }
  };

  // Défilement automatique vivant (Boussole Accordeur)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoTuning) {
      interval = setInterval(() => {
        const nextIdx = (visibleItems.findIndex((it) => it.id === selectedItemId) + 1) % visibleItems.length;
        tuneToMoment(visibleItems[nextIdx]);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isAutoTuning, selectedItemId, visibleItems]);

  // Changement d'univers fluide depuis la boussole
  const handleSwitchUniverse = (direction: 'next' | 'prev') => {
    const nextIdx = direction === 'next'
      ? (activeThemeIdx + 1) % WEDDING_STYLES.length
      : (activeThemeIdx - 1 + WEDDING_STYLES.length) % WEDDING_STYLES.length;
    
    setActiveThemeIdx(nextIdx);
    const newStyle = WEDDING_STYLES[nextIdx];
    onSelectStyle?.(newStyle);

    // Auto-accordage instantané sur le moment scénarisé de ce nouvel univers !
    const matchedMoment = visibleItems.find((it) => it.id === 'jj-3') || visibleItems[0];
    tuneToMoment(matchedMoment);
  };

  const handleUpdateNote = (newNote: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === selectedItem.id ? { ...it, coupleNote: newNote } : it))
    );
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 pointer-events-none">
      <div className="mx-auto max-w-4xl px-3 sm:px-6 pb-2.5 pointer-events-auto space-y-2.5">
        
        {/* 1. LA CARTE INTERACTIVE UNIVERSELLE CENTRÉE (VISIONNEUSE ACCORDÉE) */}
        <AnimatePresence>
          {isCardViewerOpen && selectedItem && (
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 25, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <UniversalInteractiveCardViewer
                item={selectedItem}
                perspective={perspective}
                onClose={() => setIsCardViewerOpen(false)}
                onUpdateNote={handleUpdateNote}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. DOCK SYMÉTRIQUE & BOUSSOLE ACCORDEUR TIMELINE */}
        <div className="overflow-hidden rounded-[28px] bg-[#0A0B10]/95 backdrop-blur-3xl border border-white/15 shadow-[0_-20px_55px_rgba(0,0,0,0.85)] text-white p-3 space-y-2.5">
          
          {/* LIGNE 1 : SÉLECTEUR D'UNIVERS SYMÉTRIQUE + CANAL RADIO FRÉQUENCE */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pb-2 border-b border-white/10">
            
            {/* Navigation symétrique entre les univers */}
            <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-full border border-white/10">
              <button
                type="button"
                onClick={() => handleSwitchUniverse('prev')}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                title="Univers précédent"
              >
                <ChevronLeft size={13} />
              </button>

              <div className="flex items-center gap-2 px-2.5">
                <span
                  className="h-2 w-2 rounded-full shadow-sm"
                  style={{ background: currentTheme.accent }}
                />
                <span className="font-bold text-[12px] text-white truncate max-w-[140px] sm:max-w-[180px]">
                  {currentTheme.name}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleSwitchUniverse('next')}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                title="Univers suivant"
              >
                <ChevronRight size={13} />
              </button>
            </div>

            {/* Sélecteur de Canaux de Fréquence (Traiteur, Salle, Mariés, Son/Sax) */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 rounded-full bg-black/60 border border-white/10 px-2.5 py-1 text-[10.5px]">
                <Radio size={12} className="text-emerald-400 animate-pulse" />
                <select
                  value={currentChannel}
                  onChange={(e) => setCurrentChannel(e.target.value as RadioChannel)}
                  className="bg-transparent font-mono font-semibold text-emerald-300 focus:outline-none cursor-pointer"
                >
                  {RADIO_CHANNELS.map((ch) => (
                    <option key={ch.id} value={ch.id} className="bg-[#12131C] text-white">
                      {ch.name} ({ch.freq})
                    </option>
                  ))}
                </select>
              </div>

              {/* Bouton Accordeur Automatique (Fait défiler la timeline toute seule comme une boussole) */}
              <button
                type="button"
                onClick={() => setIsAutoTuning(!isAutoTuning)}
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-bold border transition ${
                  isAutoTuning
                    ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/15'
                }`}
                title="Activer la boussole défilante automatique"
              >
                <Compass size={12} className={isAutoTuning ? 'animate-spin' : ''} />
                <span>{isAutoTuning ? 'Boussole Active' : 'Auto-Accord'}</span>
              </button>
            </div>

            {/* Sélecteur de rôle & perspective */}
            <div className="flex rounded-full bg-white/10 p-0.5 border border-white/10 text-[10px]">
              <button
                type="button"
                onClick={() => { setPerspective('guest'); onChangePerspective?.('guest'); }}
                className={`px-2 py-0.5 rounded-full font-semibold transition ${
                  perspective === 'guest' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
                }`}
              >
                Invités
              </button>
              <button
                type="button"
                onClick={() => { setPerspective('couple'); onChangePerspective?.('couple'); }}
                className={`px-2 py-0.5 rounded-full font-semibold transition ${
                  perspective === 'couple' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
                }`}
              >
                Mariés
              </button>
              <button
                type="button"
                onClick={() => { setPerspective('vendor'); onChangePerspective?.('vendor'); }}
                className={`px-2 py-0.5 rounded-full font-semibold transition ${
                  perspective === 'vendor' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
                }`}
              >
                Régie
              </button>
            </div>

          </div>

          {/* LIGNE 2 : RÈGLE HORAIRE MANIPULABLE AVEC AUTO-ALIGNEMENT SUR LE REPÈRE ACTIF */}
          <div
            ref={rulerScrollRef}
            className="relative overflow-x-auto rounded-[18px] bg-black/50 border border-white/10 p-1.5 custom-scrollbar shadow-inner"
          >
            <div
              className="relative h-18 select-none"
              style={{ width: `${totalRulerWidth}px` }}
            >
              {/* Ligne des heures */}
              <div className="absolute inset-x-0 top-0 h-5 border-b border-white/10 flex">
                {Array.from({ length: TIMELINE_TOTAL_HOURS }).map((_, hIdx) => {
                  const hour = (TIMELINE_START_HOUR + hIdx) % 24;
                  return (
                    <div
                      key={hIdx}
                      className="relative h-full border-r border-white/10 font-mono text-[9px] text-white/40 pl-1.5 pt-0.5"
                      style={{ width: `${pxPerHour}px` }}
                    >
                      <span>{hour.toString().padStart(2, '0')}:00</span>
                    </div>
                  );
                })}
              </div>

              {/* Blocs des moments synchronisés avec la carte supérieure */}
              <div className="absolute inset-x-0 top-6 bottom-1">
                {visibleItems.map((item) => {
                  const isSelected = selectedItem.id === item.id;
                  const leftPx = item.startMinuteOfDay * pxPerMinute;
                  const widthPx = Math.max(90, item.durationMinutes * pxPerMinute);
                  const docsCount = item.attachedDocs.filter((d) => d.accessLevels.includes(perspective)).length;

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        tuneToMoment(item);
                        setIsCardViewerOpen(true);
                      }}
                      className={`cursor-pointer absolute top-0.5 rounded-[13px] p-2 text-left transition-all select-none ${
                        isSelected
                          ? 'bg-white text-black shadow-2xl ring-2 ring-emerald-400 scale-[1.02] z-20 font-bold'
                          : 'bg-white/10 text-white border border-white/10 hover:bg-white/20 z-10'
                      }`}
                      style={{
                        left: `${leftPx}px`,
                        width: `${widthPx}px`,
                        height: '46px',
                      }}
                    >
                      <div className="flex items-center justify-between pb-0.5">
                        <span className="font-mono text-[8.5px]">{item.startTime}</span>
                        {docsCount > 0 && (
                          <span className={`text-[8px] font-mono px-1 rounded-full ${isSelected ? 'bg-black text-white' : 'bg-emerald-400 text-black font-bold'}`}>
                            {docsCount} doc
                          </span>
                        )}
                      </div>

                      <div className="text-[10.5px] truncate leading-tight">
                        {item.title}
                      </div>

                      <div className="text-[8.5px] truncate opacity-60">
                        {item.alignedRole || item.subtitle}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
