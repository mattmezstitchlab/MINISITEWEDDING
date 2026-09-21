import { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Calendar,
  Archive,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Sun,
  Layers,
  FileText,
  Music,
  User,
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

interface TimelineTheaterStudioProps {
  initialMode?: TimelineMode;
  onSelectMoment?: (item: TimelineTrackItem) => void;
  standalone?: boolean;
  /**
   * **Les blocs à monter.** Par défaut, les moments du jour J (l'atelier
   * d'origine). Quand on les donne — les 54 magazines de la collection —, la
   * bande devient **l'année** : chaque bloc est un magazine, et son contenu est
   * ses sept chapitres. Le sélecteur de mode disparaît alors : il n'a plus lieu
   * d'être, la source est donnée.
   */
  items?: TimelineTrackItem[];
  /** **Les graduations de la règle**, à la place des heures (une par magazine). */
  graduations?: Array<{ label: string; sous?: string }>;
  /** Ce qui s'écrit au-dessus de la bande. */
  titreDeLAxe?: string;
  /** Le pas de zoom au départ. */
  zoomInitial?: number;
  /** Où poser la tête de lecture au départ, en minutes depuis le début. */
  teteInitiale?: number;
}

export default function TimelineTheaterStudio({
  initialMode = 'jour-j',
  onSelectMoment,
  standalone = false,
  items: blocsDonnes,
  graduations,
  titreDeLAxe,
  zoomInitial = 1,
  teteInitiale,
}: TimelineTheaterStudioProps) {
  /** La source est donnée : c'est la collection qui parle, pas les moments du jour J. */
  const surMesure = blocsDonnes !== undefined;
  const [mode, setMode] = useState<TimelineMode>(initialMode);
  const [items, setItems] = useState<TimelineTrackItem[]>(blocsDonnes ?? INITIAL_TIMELINE_ITEMS);
  const [selectedId, setSelectedId] = useState<string>(blocsDonnes?.[0]?.id ?? 'jj-3');
  /**
   * **Quand la source change** (une autre année, une autre collection), on
   * repose les blocs — mais pendant le rendu, pas dans un effet : React le
   * recommande pour ajuster un état à une prop, et l'on évite ainsi un rendu en
   * cascade. La référence ne bouge que si l'appelant a vraiment changé de
   * collection (`useMemo`).
   */
  const [sourceConnue, setSourceConnue] = useState(blocsDonnes);
  if (blocsDonnes !== sourceConnue) {
    setSourceConnue(blocsDonnes);
    if (blocsDonnes) {
      setItems(blocsDonnes);
      setSelectedId((actuel) => (blocsDonnes.some((b) => b.id === actuel) ? actuel : (blocsDonnes[0]?.id ?? actuel)));
    }
  }
  const [zoomLevel, setZoomLevel] = useState<number>(zoomInitial); // 1x, 2x, 4x
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPlayheadMin, setCurrentPlayheadMin] = useState<number>(teteInitiale ?? 720); // 18:00 par défaut (720 min après 06h00)
  const [audioPlaying, setAudioPlaying] = useState<string | null>(null);

  const rulerContainerRef = useRef<HTMLDivElement>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  // Filtrage selon le mode actif — ou la source donnée, telle quelle.
  const currentItems = useMemo(() => {
    if (surMesure) return items;
    return items.filter((it) => it.mode === mode);
  }, [items, mode, surMesure]);

  const selectedItem = useMemo(() => {
    return items.find((it) => it.id === selectedId) || currentItems[0] || items[0];
  }, [items, selectedId, currentItems]);

  // Largeur de base en pixels par heure selon le zoom
  const pxPerHour = 130 * zoomLevel;
  const totalRulerWidth = TIMELINE_TOTAL_HOURS * pxPerHour;
  const pxPerMinute = pxPerHour / 60;
  /** Le pas d'une graduation : une par magazine, ou une par heure. */
  const pasPx = graduations ? totalRulerWidth / graduations.length : pxPerHour;

  // Animation de la tête de lecture si Play
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentPlayheadMin((prev) => {
        if (prev >= TIMELINE_TOTAL_MINUTES) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1; // avance de 1 min simulée
      });
    }, 120);
    return () => clearInterval(interval);
  }, [isPlaying]);

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

  // Déplacement / Retime d'un bloc (clavier ou bouton +- 15 min)
  const adjustMomentTime = (id: string, deltaMinutes: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newStart = Math.max(0, Math.min(TIMELINE_TOTAL_MINUTES - item.durationMinutes, item.startMinuteOfDay + deltaMinutes));
        // Snapping 5 minutes
        const snappedStart = Math.round(newStart / 5) * 5;
        return {
          ...item,
          startMinuteOfDay: snappedStart,
          startTime: minutesToTimeString(snappedStart),
        };
      })
    );
  };

  const adjustMomentDuration = (id: string, deltaMinutes: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newDur = Math.max(15, Math.min(360, item.durationMinutes + deltaMinutes));
        return {
          ...item,
          durationMinutes: Math.round(newDur / 5) * 5,
        };
      })
    );
  };

  return (
    <div className={`w-full ${standalone ? 'min-h-[85vh]' : ''} text-[#0B0C12]`}>
      
      {/* BARRE DE CONTRÔLE SUPÉRIEURE DU STUDIO (Style Apple VisionOS / Pro Audio) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-black/8">
        
        {/* Modes de travail commutables — masqués quand la source est la collection :
            il n'y a plus trois modes, il y a une année. */}
        <div
          data-modes={surMesure ? 'masques' : 'visibles'}
          className={`flex items-center gap-1.5 p-1 rounded-full bg-neutral-100/90 border border-black/5 self-start ${surMesure ? 'hidden' : ''}`}
        >
          <button
            type="button"
            onClick={() => setMode('jour-j')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[12.5px] font-semibold transition ${
              mode === 'jour-j'
                ? 'bg-white text-black shadow-sm font-bold'
                : 'text-black/60 hover:text-black'
            }`}
          >
            <Clock size={14} className={mode === 'jour-j' ? 'text-black' : 'text-black/40'} />
            <span>Jour J Live</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[12.5px] font-semibold transition ${
              mode === 'calendar'
                ? 'bg-white text-black shadow-sm font-bold'
                : 'text-black/60 hover:text-black'
            }`}
          >
            <Calendar size={14} className={mode === 'calendar' ? 'text-black' : 'text-black/40'} />
            <span>Futurs Events</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('archives')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[12.5px] font-semibold transition ${
              mode === 'archives'
                ? 'bg-white text-black shadow-sm font-bold'
                : 'text-black/60 hover:text-black'
            }`}
          >
            <Archive size={14} className={mode === 'archives' ? 'text-black' : 'text-black/40'} />
            <span>Archives &amp; Docs</span>
          </button>
        </div>

        {/* Console de transport et de Zoom */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {/* Zoom */}
          <div className="flex items-center gap-1 bg-neutral-100 rounded-full p-1 border border-black/5">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
              className="p-1.5 text-black/60 hover:text-black transition"
              title="Dézoomer"
            >
              <ZoomOut size={14} />
            </button>
            <span className="text-[11px] font-mono px-2 text-black/60 font-semibold">{zoomLevel.toFixed(1)}×</span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
              className="p-1.5 text-black/60 hover:text-black transition"
              title="Zoomer"
            >
              <ZoomIn size={14} />
            </button>
          </div>

          {/* Bouton Playhead Live Simulator */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-bold transition shadow-sm border ${
              isPlaying
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-black/10 hover:border-black/30'
            }`}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            <span>{isPlaying ? 'Pause Tête' : 'Simulation Direct'}</span>
          </button>

          {/* Horloge Tête de lecture */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 font-mono text-[12px] text-black font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{minutesToTimeString(currentPlayheadMin)}</span>
          </div>
        </div>
      </div>

      {/* DISPOSITION EN COUPLAGE BI-DIRECTIONNEL : RÈGLE HORIZONTALE EN HAUT + INSPECTEUR SPATIAL VERTICAL EN BAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        
        {/* ZONE GAUCHE (8 COLS) : LA SURFACE HORIZONTALE TIMELINE RULER */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="flex items-center justify-between text-[12px]">
            <div className="font-semibold text-black/70 flex items-center gap-2">
              <Layers size={14} className="text-black" />
              <span>{titreDeLAxe ?? 'Bande de Montage Temporel (06:00 → 04:00 J+1)'}</span>
              <span className="text-[10px] font-mono bg-black/5 px-2 py-0.5 rounded-full text-black/50">
                Aimantation 5 min
              </span>
            </div>
            <div className="text-[11px] text-black/40 font-mono">
              Glisser ou ajuster durée via l'inspecteur
            </div>
          </div>

          {/* CONTENEUR DE LA RÈGLE AVEC SCROLL HORIZONTAL FLUIDE */}
          <div
            ref={rulerContainerRef}
            className="relative overflow-x-auto rounded-[24px] bg-[#F7F7F8] border border-black/8 p-4 shadow-inner custom-scrollbar"
            style={{ minHeight: '260px' }}
          >
            {/* L'espace total gradué */}
            <div
              className="relative h-56 select-none"
              style={{ width: `${totalRulerWidth}px` }}
            >
              
              {/* HEURES ET GRADUATIONS DE FOND — ou les semaines de la collection */}
              <div className="absolute inset-x-0 top-0 h-9 border-b border-black/10 flex">
                {graduations
                  ? graduations.map((g) => (
                      <div
                        key={g.label}
                        data-graduation={g.label}
                        className="relative h-full border-r border-black/10 font-mono text-[11px] text-black/45 pl-2 flex flex-col justify-center"
                        style={{ width: `${pasPx}px` }}
                      >
                        <span className="font-bold whitespace-nowrap">{g.label}</span>
                        {g.sous && <span className="text-[9.5px] text-black/35 whitespace-nowrap">{g.sous}</span>}
                      </div>
                    ))
                  : Array.from({ length: TIMELINE_TOTAL_HOURS }).map((_, hIdx) => {
                      const hour = (TIMELINE_START_HOUR + hIdx) % 24;
                      const isGolden = hour === 18 || hour === 19;

                      return (
                        <div
                          key={hIdx}
                          className="relative h-full border-r border-black/10 font-mono text-[11px] text-black/40 pl-2 pt-1 flex flex-col justify-between"
                          style={{ width: `${pxPerHour}px` }}
                        >
                          <div className="flex items-center gap-1 font-bold">
                            <span>{hour.toString().padStart(2, '0')}:00</span>
                            {isGolden && <Sun size={10} className="text-amber-500" />}
                          </div>

                          {/* Sous-graduations 15, 30, 45 min */}
                          <div className="flex justify-between px-1 pb-0.5">
                            <span className="h-1.5 w-[1px] bg-black/15" />
                            <span className="h-2.5 w-[1px] bg-black/30" />
                            <span className="h-1.5 w-[1px] bg-black/15" />
                          </div>
                        </div>
                      );
                    })}
              </div>

              {/* LIGNES DE GUIDAGE VERTICALES */}
              <div className="absolute inset-0 top-9 pointer-events-none flex">
                {Array.from({ length: graduations ? graduations.length : TIMELINE_TOTAL_HOURS }).map((_, hIdx) => (
                  <div
                    key={hIdx}
                    className="h-full border-r border-black/[0.04]"
                    style={{ width: `${graduations ? pasPx : pxPerHour}px` }}
                  />
                ))}
              </div>

              {/* TÊTE DE LECTURE VERTICALE ROUGE / ORCHESTRATEUR */}
              <div
                className="absolute top-0 bottom-0 z-30 pointer-events-none transition-all duration-100"
                style={{ left: `${currentPlayheadMin * pxPerMinute}px` }}
              >
                <div className="h-full w-[2px] bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                <div className="-translate-x-1/2 rounded-full bg-rose-500 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 shadow-sm mt-0.5">
                  NOW
                </div>
              </div>

              {/* BLOCS TEMPORELS MANIPULABLES */}
              <div className="absolute inset-x-0 top-14 bottom-4">
                {currentItems.map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  const leftPx = item.startMinuteOfDay * pxPerMinute;
                  const widthPx = Math.max(90, item.durationMinutes * pxPerMinute);

                  return (
                    <motion.div
                      key={item.id}
                      data-bloc={item.id}
                      data-mesure={item.mesure ?? ''}
                      onClick={() => {
                        setSelectedId(item.id);
                        onSelectMoment?.(item);
                      }}
                      className={`absolute top-2 rounded-[18px] p-3 text-left cursor-pointer transition-all duration-200 border select-none group ${
                        isSelected
                          ? 'bg-black text-white border-black shadow-xl ring-4 ring-black/10 z-20 scale-[1.02]'
                          : 'bg-white text-black border-black/10 hover:border-black/30 shadow-sm z-10'
                      }`}
                      style={{
                        left: `${leftPx}px`,
                        width: `${widthPx}px`,
                        height: '110px',
                      }}
                    >
                      {/* En-tête du bloc */}
                      <div className="flex items-center justify-between pb-1 border-b border-current/10">
                        <div className="flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-emerald-400' : 'bg-black'}`} />
                          <span className="font-mono text-[10px] font-bold">{item.startTime}</span>
                        </div>
                        <span className="font-mono text-[9.5px] opacity-70">
                          {item.mesure ?? `${item.durationMinutes}m`}
                        </span>
                      </div>

                      {/* Titre & Sous-titre */}
                      <div className="mt-2">
                        <div className="font-bold text-[12px] truncate leading-tight">
                          {item.title}
                        </div>
                        <div className="text-[10px] opacity-70 truncate mt-0.5">
                          {item.alignedRole || item.subtitle}
                        </div>
                      </div>

                      {/* Les sept chapitres du magazine, quand c'en est un. */}
                      {item.sousTitres && (
                        <div className="mt-2 flex items-center gap-[3px]" aria-hidden="true">
                          {item.sousTitres.map((titre, i) => (
                            <span
                              key={titre}
                              title={titre}
                              className={`h-[5px] flex-1 rounded-full ${isSelected ? 'bg-white/45' : 'bg-black/25'}`}
                              data-chapitre={i + 1}
                            />
                          ))}
                        </div>
                      )}

                      {/* Badge spécifique */}
                      <div className="mt-2.5 flex items-center gap-1.5">
                        {item.audioPreviewUrl && (
                          <span className={`p-1 rounded-full ${isSelected ? 'bg-white/20' : 'bg-black/5'}`}>
                            <Music size={10} />
                          </span>
                        )}
                        {item.docBadge && (
                          <span className={`text-[8.5px] font-mono px-1.5 py-0.5 rounded-md truncate ${
                            isSelected ? 'bg-white/15 text-white' : 'bg-black/5 text-black/70'
                          }`}>
                            {item.docBadge}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* PALETTE D'ALIGNEMENT RAPIDE / RETIME */}
          {selectedItem && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-[20px] bg-white border border-black/8 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[12px] font-semibold text-black">
                  Ajustement instantané de <span className="font-bold">« {selectedItem.title} »</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-black/40">Déplacer :</span>
                <button
                  type="button"
                  onClick={() => adjustMomentTime(selectedItem.id, -15)}
                  className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[11px] font-mono font-bold transition"
                >
                  -15m
                </button>
                <button
                  type="button"
                  onClick={() => adjustMomentTime(selectedItem.id, 15)}
                  className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[11px] font-mono font-bold transition"
                >
                  +15m
                </button>

                <div className="h-4 w-[1px] bg-black/10 mx-1" />

                <span className="text-[11px] font-mono text-black/40">Durée :</span>
                <button
                  type="button"
                  onClick={() => adjustMomentDuration(selectedItem.id, -15)}
                  className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[11px] font-mono font-bold transition"
                >
                  -15m
                </button>
                <button
                  type="button"
                  onClick={() => adjustMomentDuration(selectedItem.id, 15)}
                  className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[11px] font-mono font-bold transition"
                >
                  +15m
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ZONE DROITE (4 COLS) : INSPECTEUR VERTICAL DU MOMENT & MINI-SITE ASSOCIÉ */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 rounded-[28px] bg-white border border-black/8 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] space-y-6">
            
            {/* Titre de l'inspecteur */}
            <div className="flex items-center justify-between pb-3 border-b border-black/8">
              <div className="text-[11px] font-mono uppercase tracking-wider text-black/40 font-bold">
                Inspecteur de Scène &amp; Médias
              </div>
              <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-[10px] font-mono font-bold">
                Synchronisé Super Mariage
              </span>
            </div>

            {selectedItem ? (
              <div className="space-y-4">
                
                {/* Médias & Couverture de scène */}
                {selectedItem.mediaUrl && (
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[18px] bg-neutral-100">
                    <img
                      src={selectedItem.mediaUrl}
                      alt={selectedItem.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-3 text-white">
                      <div className="text-[10px] font-mono uppercase text-white/70">{selectedItem.chapter}</div>
                      <div className="text-[14px] font-bold">{selectedItem.title}</div>
                    </div>
                  </div>
                )}

                {/* Métadonnées temporelles */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-[14px] bg-[#F7F7F8] p-2.5">
                    <div className="text-[10px] font-mono text-black/40">HORAIRE DÉBUT</div>
                    <div className="text-[15px] font-bold font-mono text-black mt-0.5">{selectedItem.startTime}</div>
                  </div>
                  <div className="rounded-[14px] bg-[#F7F7F8] p-2.5">
                    <div className="text-[10px] font-mono text-black/40">DURÉE TOTALE</div>
                    <div className="text-[15px] font-bold font-mono text-black mt-0.5">{selectedItem.durationMinutes} min</div>
                  </div>
                </div>

                {/* Description de l'instant */}
                <p className="text-[13px] text-[#0B0C12]/70 leading-relaxed bg-[#FBFBFD] p-3.5 rounded-[16px] border border-black/5">
                  {selectedItem.description}
                </p>

                {/* Alignement Métier / Mini-site du prestataire */}
                {selectedItem.alignedRole && (
                  <div className="rounded-[18px] border border-black/10 p-3.5 bg-neutral-50/70 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-black/50">
                      <span>RÔLE ALIGNÉ SUR LE MOMENT :</span>
                      <User size={12} />
                    </div>
                    <div className="text-[13px] font-bold text-black">
                      {selectedItem.alignedRole}
                    </div>
                    {selectedItem.targetBpm && (
                      <div className="text-[11px] font-mono text-black/60 flex items-center gap-1.5">
                        <Music size={12} className="text-emerald-600" />
                        <span>Cadence audio cible : {selectedItem.targetBpm} BPM</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Lecteur audio live preview si disponible */}
                {selectedItem.audioPreviewUrl && (
                  <div className="p-3.5 rounded-[18px] bg-black text-white flex items-center justify-between shadow-md">
                    <div className="space-y-0.5">
                      <div className="text-[10.5px] font-mono text-white/50">EXTRAIT SONORE DU MOMENT</div>
                      <div className="text-[12px] font-bold">Bande sonore calibrée</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => togglePlayAudio(selectedItem.audioPreviewUrl, selectedItem.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition hover:scale-105"
                    >
                      {audioPlaying === selectedItem.id ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                  </div>
                )}

                {/* Badge Document scellé */}
                {selectedItem.docBadge && (
                  <div className="flex items-center gap-2 p-2.5 rounded-[14px] bg-neutral-100 text-[11.5px] text-black/80 font-mono">
                    <FileText size={13} className="text-black/50" />
                    <span>{selectedItem.docBadge}</span>
                  </div>
                )}

              </div>
            ) : (
              <div className="text-center py-10 text-[13px] text-black/40">
                Sélectionnez un bloc temporel sur la règle pour l'éditer
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
