import { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellRing,
  Check,
  GripVertical,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import {
  CATALOG_CARDS,
  searchCards,
  type GestureCard,
  type CardKind,
} from '../lib/gestureCatalog';
import { UNIVERSAL_ROLES, type UniversalRoleType } from '../lib/bidirectionalAlignmentEngine';
import {
  TIMELINE_START_HOUR,
  TIMELINE_TOTAL_MINUTES,
  minutesToTimeString,
  timeToMinutesFromStart,
} from '../lib/timelineTheaterEngine';
import type { WeddingStyle } from '../lib/weddingStyles';

/**
 * LE GESTE — de la recherche à la timeline
 *
 * On écrit ce qu'on veut (« traiteur », « boxeur », « soupe à l'oignon »), la
 * carte apparaît avec un visuel d'univers — même si rien ne correspond. On la
 * glisse sur la timeline du Jour J, on règle la durée à la réglette. Si la carte
 * correspond à quelqu'un de réel, cette personne est notifiée et doit confirmer.
 *
 * Le glisser-déposer fonctionne à la souris ; au doigt, la carte se prend d'un
 * tap et se pose d'un second tap sur la timeline.
 */

const PX_PER_MINUTE = 0.82;
const TRACK_WIDTH = TIMELINE_TOTAL_MINUTES * PX_PER_MINUTE;
const SLOT_MINUTES = 15;

interface Placed {
  id: string;
  title: string;
  mission: string;
  image: string;
  accent: string;
  role?: UniversalRoleType;
  startMinute: number;
  durationMinutes: number;
  status: 'en_attente' | 'confirme';
}

const SEED: Placed[] = [
  {
    id: 'seed-ceremonie',
    title: 'Échange des vœux',
    mission: 'Cérémonie laïque sous l’arche',
    image: '/images/brutal.jpg',
    accent: '#111116',
    role: 'officiant',
    startMinute: timeToMinutesFromStart('16:00'),
    durationMinutes: 60,
    status: 'confirme',
  },
  {
    id: 'seed-diner',
    title: 'Dîner & toasts',
    mission: 'Service gastronomique, discours des témoins',
    image: '/images/table-noir.jpg',
    accent: '#10B981',
    role: 'traiteur',
    startMinute: timeToMinutesFromStart('20:00'),
    durationMinutes: 150,
    status: 'confirme',
  },
  {
    id: 'seed-bal',
    title: 'Ouverture du bal',
    mission: 'Montée progressive, 125 BPM',
    image: '/images/club-amour.jpg',
    accent: '#EC4899',
    role: 'dj_sax',
    startMinute: timeToMinutesFromStart('22:45'),
    durationMinutes: 45,
    status: 'en_attente',
  },
];

function cardFromStyle(style: WeddingStyle): GestureCard {
  return {
    id: `univers-${style.id}`,
    title: style.name,
    kind: 'moment',
    mission: style.tagline,
    image: style.image,
    accent: style.accent,
    durationMinutes: 120,
  };
}

const clampMinute = (value: number, duration: number) =>
  Math.max(0, Math.min(TIMELINE_TOTAL_MINUTES - duration, value));

export default function TimelineGesture({ preloaded }: { preloaded?: WeddingStyle | null }) {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<CardKind | 'tout'>('tout');
  const [placed, setPlaced] = useState<Placed[]>(SEED);
  // Ouvert sur le créneau en attente de confirmation : la réglette de durée est
  // visible dès l'arrivée, sans avoir à cliquer quoi que ce soit.
  const [selectedId, setSelectedId] = useState<string | null>('seed-bal');
  /** Carte prise au doigt, en attente d'être posée. */
  const [armed, setArmed] = useState<GestureCard | null>(null);
  const dragRef = useRef<{ type: 'card'; card: GestureCard } | { type: 'block'; id: string } | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const { cards, invented } = useMemo(() => searchCards(query), [query]);

  const palette = useMemo(() => {
    const base = query.trim()
      ? cards
      : CATALOG_CARDS.filter((c) => kind === 'tout' || c.kind === kind);
    const ready = preloaded ? [cardFromStyle(preloaded)] : [];
    return [...ready, ...base];
  }, [query, cards, kind, preloaded]);

  const selected = placed.find((p) => p.id === selectedId) ?? null;
  const awaiting = placed.filter((p) => p.role && p.status === 'en_attente');

  const minuteAt = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const raw = (clientX - rect.left) / PX_PER_MINUTE;
    return Math.max(0, Math.round(raw / SLOT_MINUTES) * SLOT_MINUTES);
  };

  const dropCard = (card: GestureCard, startMinute: number) => {
    const id = `${card.id}-${startMinute}-${placed.length}`;
    setPlaced((prev) => [
      ...prev,
      {
        id,
        title: card.title,
        mission: card.mission,
        image: card.image,
        accent: card.accent,
        role: card.role,
        startMinute: clampMinute(startMinute, card.durationMinutes),
        durationMinutes: card.durationMinutes,
        status: 'en_attente',
      },
    ]);
    setSelectedId(id);
    setArmed(null);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const startMinute = minuteAt(event.clientX);
    const dragged = dragRef.current;
    dragRef.current = null;
    if (!dragged) return;
    if (dragged.type === 'card') {
      dropCard(dragged.card, startMinute);
      return;
    }
    setPlaced((prev) =>
      prev.map((p) =>
        p.id === dragged.id ? { ...p, startMinute: clampMinute(startMinute, p.durationMinutes) } : p,
      ),
    );
    setSelectedId(dragged.id);
  };

  const handleTrackClick = (event: React.MouseEvent) => {
    if (!armed) return;
    dropCard(armed, minuteAt(event.clientX));
  };

  const patchSelected = (patch: Partial<Placed>) => {
    if (!selectedId) return;
    setPlaced((prev) =>
      prev.map((p) => {
        if (p.id !== selectedId) return p;
        const next = { ...p, ...patch };
        next.startMinute = clampMinute(next.startMinute, next.durationMinutes);
        return next;
      }),
    );
  };

  const hours = Array.from({ length: TIMELINE_TOTAL_MINUTES / 60 + 1 }, (_, i) =>
    (TIMELINE_START_HOUR + i) % 24,
  );

  return (
    <section id="geste" className="bg-white px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="vp-eyebrow">Le geste</div>
          <h2 className="vp-h2 mt-4" style={{ fontSize: 'clamp(2rem, 4.4vw, 3rem)' }}>
            De la recherche à la timeline.
          </h2>
          <p className="vp-body mx-auto mt-4 max-w-xl">
            Écrivez ce que vous cherchez. Une carte apparaît avec un visuel — même si rien
            ne correspond. Glissez-la sur le Jour J, réglez la durée. La personne est
            prévenue et confirme.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[330px_1fr]">
          {/* 1. La recherche et les cartes */}
          <div>
            <div className="flex items-center gap-2 rounded-[18px] border border-black/10 bg-white px-3.5 py-2.5 shadow-sm focus-within:border-black/30">
              <Search size={15} className="shrink-0 text-black/35" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="traiteur, saxophoniste, feu d’artifice…"
                className="w-full bg-transparent text-[13px] text-[#0B0C12] placeholder:text-black/30 focus:outline-none"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="text-black/35 hover:text-black">
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto">
              {(['tout', 'métier', 'moment'] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => { setKind(k); setQuery(''); }}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-[11.5px] font-semibold capitalize transition ${
                    kind === k && !query
                      ? 'bg-[#0B0C12] text-white'
                      : 'bg-black/[0.04] text-black/55 hover:bg-black/[0.08]'
                  }`}
                >
                  {k === 'tout' ? 'Toute la taxonomie' : k === 'métier' ? 'Métiers' : 'Moments'}
                </button>
              ))}
            </div>

            {invented && (
              <p className="mt-3 rounded-[12px] bg-amber-50 px-3 py-2 text-[11px] font-medium text-amber-700 ring-1 ring-amber-600/15">
                Rien de tel dans la taxonomie — la carte est créée pour vous, à éditer.
              </p>
            )}

            <div className="no-scrollbar mt-4 max-h-[420px] space-y-2 overflow-y-auto pr-1">
              {palette.map((card) => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={(event) => {
                    dragRef.current = { type: 'card', card };
                    event.dataTransfer.effectAllowed = 'copy';
                  }}
                  onClick={() => setArmed(card)}
                  className={`group flex cursor-grab items-center gap-3 rounded-[16px] border bg-white p-2.5 transition active:cursor-grabbing ${
                    armed?.id === card.id
                      ? 'border-[#0B0C12] shadow-[0_10px_24px_-12px_rgba(0,0,0,0.35)]'
                      : 'border-black/8 hover:border-black/25 hover:shadow-[0_10px_24px_-16px_rgba(0,0,0,0.35)]'
                  }`}
                >
                  <img src={card.image} alt="" className="h-11 w-11 shrink-0 rounded-[11px] object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12.5px] font-semibold text-[#0B0C12]">{card.title}</div>
                    <div className="truncate text-[10.5px] text-black/50">{card.mission}</div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="text-[9.5px] font-mono text-black/35">
                      {Math.round(card.durationMinutes / 60 * 10) / 10} h
                    </span>
                    <GripVertical size={13} className="text-black/25 group-hover:text-black/50" />
                  </div>
                </div>
              ))}
              {palette.length === 0 && (
                <p className="vp-caption py-6 text-center">Aucune carte. Essayez un autre mot.</p>
              )}
            </div>

            <p className="mt-3 text-center text-[11px] text-black/40">
              {armed
                ? `« ${armed.title} » est prêt — touchez la timeline pour le poser.`
                : 'Glissez une carte sur la timeline, ou touchez-la puis touchez l’heure.'}
            </p>
          </div>

          {/* 2. La timeline du Jour J */}
          <div>
            <div className="rounded-[26px] border border-black/8 bg-[#FAFAFA] p-4 sm:p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-black/40">
                  Jour J · 06h00 → 04h00
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-black/50">
                  <BellRing size={12} />
                  {awaiting.length === 0
                    ? 'Tout le monde a confirmé'
                    : `${awaiting.length} personne${awaiting.length > 1 ? 's' : ''} à confirmer`}
                </span>
              </div>

              <div className="no-scrollbar overflow-x-auto pb-2">
                <div
                  ref={trackRef}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={handleDrop}
                  onClick={handleTrackClick}
                  className={`relative h-[168px] select-none rounded-[14px] bg-white ring-1 ring-black/6 ${
                    armed ? 'cursor-copy ring-2 ring-[#0B0C12]/30' : ''
                  }`}
                  style={{ width: TRACK_WIDTH }}
                >
                  {/* Règle horaire */}
                  {hours.map((hour, i) => (
                    <div
                      key={`${hour}-${i}`}
                      className="absolute bottom-0 top-0 border-l border-black/6"
                      style={{ left: i * 60 * PX_PER_MINUTE }}
                    >
                      <span className="absolute left-1.5 top-1.5 text-[9px] font-mono text-black/30">
                        {String(hour).padStart(2, '0')}h
                      </span>
                    </div>
                  ))}

                  {/* Créneaux posés */}
                  {placed.map((item) => {
                    const isSelected = item.id === selectedId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        draggable
                        onDragStart={(event) => {
                          event.stopPropagation();
                          dragRef.current = { type: 'block', id: item.id };
                          event.dataTransfer.effectAllowed = 'move';
                        }}
                        onClick={(event) => { event.stopPropagation(); setSelectedId(item.id); }}
                        className={`absolute top-[34px] flex h-[104px] cursor-grab flex-col overflow-hidden rounded-[12px] border p-2 text-left transition active:cursor-grabbing ${
                          isSelected
                            ? 'z-10 border-[#0B0C12] shadow-[0_14px_30px_-12px_rgba(0,0,0,0.4)]'
                            : 'border-black/10 hover:border-black/30'
                        }`}
                        style={{
                          left: item.startMinute * PX_PER_MINUTE,
                          width: Math.max(62, item.durationMinutes * PX_PER_MINUTE),
                          background: 'white',
                        }}
                      >
                        <span
                          className="absolute inset-x-0 top-0 h-[3px]"
                          style={{ background: item.accent }}
                        />
                        <span className="truncate text-[11px] font-semibold text-[#0B0C12]">
                          {item.title}
                        </span>
                        <span className="mt-0.5 text-[9.5px] font-mono text-black/45">
                          {minutesToTimeString(item.startMinute)} · {Math.round(item.durationMinutes / 6) / 10}h
                        </span>
                        <span className="mt-auto flex items-center gap-1 text-[9px] font-medium">
                          {item.role ? (
                            item.status === 'confirme' ? (
                              <><Check size={10} className="text-emerald-600" /><span className="text-emerald-700">confirmé</span></>
                            ) : (
                              <><BellRing size={10} className="text-amber-600" /><span className="text-amber-700">en attente</span></>
                            )
                          ) : (
                            <span className="text-black/40">moment</span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. L'inspecteur : la réglette de durée */}
            <AnimatePresence>
              {selected && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 rounded-[22px] border border-black/8 bg-white p-4 shadow-sm sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <img src={selected.image} alt="" className="h-12 w-12 rounded-[12px] object-cover" />
                      <div className="min-w-0">
                        <input
                          value={selected.title}
                          onChange={(e) => patchSelected({ title: e.target.value })}
                          className="w-full max-w-[240px] truncate border-b border-transparent bg-transparent text-[14px] font-semibold text-[#0B0C12] focus:border-black/30 focus:outline-none"
                        />
                        <div className="truncate text-[11px] text-black/50">{selected.mission}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {selected.role && (
                        selected.status === 'confirme' ? (
                          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-600/15">
                            <Check size={12} /> Confirmé
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              patchSelected({ status: 'confirme' });
                              setSelectedId(null);
                            }}
                            className="flex items-center gap-1.5 rounded-full bg-[#0B0C12] px-3.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-black/80"
                          >
                            <Check size={12} /> Il a confirmé
                          </button>
                        )
                      )}
                      <button
                        type="button"
                        onClick={() => { setPlaced((prev) => prev.filter((p) => p.id !== selected.id)); setSelectedId(null); }}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-black/40 transition hover:bg-black/5 hover:text-black"
                        title="Retirer de la timeline"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="flex items-center justify-between text-[11px] font-medium text-black/55">
                        Début <span className="font-mono">{minutesToTimeString(selected.startMinute)}</span>
                      </span>
                      <input
                        type="range"
                        min={0}
                        max={TIMELINE_TOTAL_MINUTES - selected.durationMinutes}
                        step={SLOT_MINUTES}
                        value={selected.startMinute}
                        onChange={(e) => patchSelected({ startMinute: Number(e.target.value) })}
                        className="mt-2 w-full accent-[#0B0C12]"
                      />
                    </label>
                    <label className="block">
                      <span className="flex items-center justify-between text-[11px] font-medium text-black/55">
                        Durée
                        <span className="font-mono">
                          {Math.floor(selected.durationMinutes / 60)}h
                          {String(selected.durationMinutes % 60).padStart(2, '0')}
                        </span>
                      </span>
                      <input
                        type="range"
                        min={15}
                        max={360}
                        step={15}
                        value={selected.durationMinutes}
                        onChange={(e) => patchSelected({ durationMinutes: Number(e.target.value) })}
                        className="mt-2 w-full accent-[#0B0C12]"
                      />
                    </label>
                  </div>

                  {selected.role && (
                    <p className="mt-3 text-[11px] text-black/45">
                      {UNIVERSAL_ROLES[selected.role].title} ·{' '}
                      {selected.status === 'confirme'
                        ? 'a confirmé ce créneau, tout le monde est aligné.'
                        : 'a reçu une notification : ce créneau l’attend, en attente de sa confirmation.'}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 4. Les personnes prévenues */}
            <div className="mt-4 rounded-[22px] border border-black/8 bg-[#FAFAFA] p-4 sm:p-5">
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-black/40">
                Notification envoyée au dépôt de la carte
              </div>
              <div className="mt-3 space-y-2">
                {placed.filter((p) => p.role).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-[12px]">
                    <img src={item.image} alt="" className="h-7 w-7 rounded-[8px] object-cover" />
                    <span className="font-semibold text-[#0B0C12]">
                      {UNIVERSAL_ROLES[item.role as UniversalRoleType].title}
                    </span>
                    <span className="text-black/50">
                      ajouté à {minutesToTimeString(item.startMinute)} ·
                    </span>
                    {item.status === 'confirme' ? (
                      <span className="flex items-center gap-1 font-medium text-emerald-700">
                        <Check size={11} /> confirmé
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-medium text-amber-700">
                        <BellRing size={11} /> en attente de confirmation
                      </span>
                    )}
                  </div>
                ))}
                {placed.every((p) => !p.role) && (
                  <p className="text-[12px] text-black/45">
                    Déposez une carte « métier » : la personne est prévenue automatiquement.
                  </p>
                )}
              </div>
            </div>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-black/40">
              <Plus size={12} /> La timeline se remplit, tout le monde reste aligné sur la même heure.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
