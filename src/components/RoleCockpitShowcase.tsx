import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  BookOpen,
  Clock,
  Heart,
  Lock,
  Music,
  Pause,
  Play,
  Sparkles,
  Utensils,
  UserCheck,
  type LucideIcon,
} from 'lucide-react';
import {
  MOMENTS,
  ROLE_COCKPITS,
  UNIVERSAL_ROLES,
  momentsForRole,
  type RoleMoment,
} from '../lib/roleCockpits';
import type { UniversalRoleType } from '../lib/bidirectionalAlignmentEngine';
import {
  TIMELINE_START_HOUR,
  TIMELINE_TOTAL_MINUTES,
} from '../lib/timelineTheaterEngine';

/**
 * UN SEUL ÉCRAN PAR RÔLE
 *
 * Le visuel, le nom du rôle, ses informations, sa musique et la timeline —
 * rien d'autre. Cliquer un moment de la timeline ouvre l'inspecteur au centre.
 *
 * La timeline est la MÊME pour tous : seuls les moments autorisés s'affichent
 * (`visibility` du moteur temporel). Les autres restent visibles mais scellés.
 */

const ROLE_ORDER: UniversalRoleType[] = [
  'couple',
  'guest',
  'temoin',
  'officiant',
  'traiteur',
  'dj_sax',
  'photo',
];

const ROLE_ICONS: Record<string, LucideIcon> = {
  Heart,
  UserCheck,
  Sparkles,
  BookOpen,
  Utensils,
  Music,
  Camera,
};

/** Échelle de la timeline dans l'écran du téléphone. */
const PX_PER_MINUTE = 0.44;

const NOTIF_TONE: Record<'ok' | 'warn' | 'info', string> = {
  ok: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
  warn: 'bg-amber-50 text-amber-700 ring-amber-600/15',
  info: 'bg-neutral-100 text-neutral-600 ring-black/8',
};

export default function RoleCockpitShowcase() {
  const [role, setRole] = useState<UniversalRoleType>('couple');
  const cockpit = ROLE_COCKPITS[role];
  const identity = UNIVERSAL_ROLES[role];
  const RoleIcon = ROLE_ICONS[identity.iconName] ?? Heart;

  const moments = momentsForRole(role);
  const [selectedId, setSelectedId] = useState(cockpit.focusMomentId);
  const selected: RoleMoment =
    moments.find((m) => m.moment.id === selectedId) ?? moments[0];

  // --- Lecture réelle du morceau (fichier de public/audio/) ---
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const stop = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setPlaying(false);
    setProgress(0);
  };

  const togglePlay = () => {
    if (typeof window === 'undefined') return;
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
      return;
    }
    if (!audioRef.current) {
      const el = new Audio();
      el.preload = 'auto';
      el.addEventListener('timeupdate', () => {
        if (el.duration) setProgress(el.currentTime / el.duration);
      });
      el.addEventListener('ended', () => {
        setPlaying(false);
        setProgress(0);
      });
      audioRef.current = el;
    }
    const el = audioRef.current;
    if (el.src !== new URL(cockpit.track.src, window.location.origin).href) {
      el.src = cockpit.track.src;
    }
    void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  // Changer de rôle coupe la musique et rouvre le moment de référence.
  // Le changement se fait ici, dans le gestionnaire : pas d'effet qui rejoue
  // un rendu pour remettre l'état d'aplomb.
  const selectRole = (id: UniversalRoleType) => {
    if (id === role) return;
    stop();
    setRole(id);
    setSelectedId(ROLE_COCKPITS[id].focusMomentId);
  };

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const bar = trackRef.current?.querySelector<HTMLElement>(`[data-moment="${selectedId}"]`);
    bar?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [selectedId]);

  const trackWidth = TIMELINE_TOTAL_MINUTES * PX_PER_MINUTE;
  const hours = Array.from(
    { length: Math.floor(TIMELINE_TOTAL_MINUTES / 60) + 1 },
    (_, i) => TIMELINE_START_HOUR + i,
  ).map((h) => (h >= 24 ? h - 24 : h));

  return (
    <section className="overflow-hidden bg-white px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="vp-eyebrow">Un seul écran par rôle</div>
          <h2 className="vp-h2 mt-4" style={{ fontSize: 'clamp(2rem, 4.4vw, 3rem)' }}>
            Chacun son cockpit.
            <br />
            Une seule vérité.
          </h2>
          <p className="vp-body mx-auto mt-4 max-w-lg">
            Le même jour, la même timeline. Chaque personne ouvre son écran et n’y trouve
            que ce qui la concerne : son visuel, ses informations, son rôle, son moment.
          </p>
        </motion.div>

        {/* Sélecteur de rôle : le nom du rôle, dit simplement */}
        <div className="no-scrollbar mt-10 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible">
          {ROLE_ORDER.map((id) => {
            const Icon = ROLE_ICONS[UNIVERSAL_ROLES[id].iconName] ?? Heart;
            const active = id === role;
            return (
              <button
                key={id}
                type="button"
                onClick={() => selectRole(id)}
                aria-pressed={active}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-[12.5px] font-semibold transition ${
                  active
                    ? 'border-transparent bg-[#0B0C12] text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)]'
                    : 'border-black/10 bg-white text-[#0B0C12]/70 hover:border-black/25 hover:text-[#0B0C12]'
                }`}
              >
                <Icon size={14} />
                {UNIVERSAL_ROLES[id].title}
              </button>
            );
          })}
        </div>

        {/* L'écran */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-12 flex justify-center"
        >
          <div className="w-[292px] shrink-0 rounded-[46px] border-[9px] border-[#0B0C12] bg-[#0B0C12] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.55)]">
            <div className="relative overflow-hidden rounded-[38px] bg-white">
              {/* Dynamic island */}
              <div className="absolute left-1/2 top-2.5 z-30 h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-[#0B0C12]" />

              <div className="flex h-[618px] flex-col">
                {/* VISUEL + NOM DU RÔLE */}
                <div className="relative h-[186px] shrink-0 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={cockpit.heroImage}
                      src={cockpit.heroImage}
                      alt=""
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/45" />

                  <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-3">
                    <span
                      className="rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white"
                      style={{ background: identity.colorAccent }}
                    >
                      {identity.badge}
                    </span>
                    <span className="flex items-center gap-1 text-[9px] font-mono text-white/75">
                      <Clock size={10} /> J-118
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 px-4 pb-3.5">
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-white/70">
                      <RoleIcon size={12} /> {identity.title}
                    </div>
                    <div className="vp-title mt-1 text-[26px] leading-none text-white">
                      Sarah &amp; Gabriel
                    </div>
                    <div className="mt-1.5 text-[10.5px] text-white/75">
                      Château des Tilleuls · Valbonne
                    </div>
                  </div>
                </div>

                {/* INFORMATIONS DU RÔLE */}
                <div className="shrink-0 space-y-1.5 border-b border-black/6 px-3.5 py-3">
                  {cockpit.notifications.map((n) => (
                    <div
                      key={n.label}
                      className={`flex items-center gap-1.5 rounded-[10px] px-2.5 py-1.5 text-[10.5px] font-medium ring-1 ${NOTIF_TONE[n.kind]}`}
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
                      <span className="truncate">{n.label}</span>
                    </div>
                  ))}
                </div>

                {/* INSPECTEUR — l'information s'affiche au centre */}
                <div className="flex-1 overflow-hidden px-3.5 py-3">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${role}-${selected.moment.id}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                      className="flex h-full flex-col"
                    >
                      <div className="flex items-baseline justify-between">
                        <span className="vp-num text-[19px] font-semibold text-[#0B0C12]">
                          {selected.moment.startTime}
                        </span>
                        <span className="text-[9px] font-mono uppercase tracking-wider text-black/35">
                          {selected.moment.chapter}
                        </span>
                      </div>

                      {selected.locked ? (
                        <>
                          <div className="mt-1.5 flex items-center gap-1.5 text-[12.5px] font-semibold text-black/45">
                            <Lock size={12} /> Moment scellé pour ce rôle
                          </div>
                          <p className="mt-1.5 text-[10.5px] leading-relaxed text-black/45">
                            Ce créneau ne s’affiche pas sur cet écran. Les autres rôles le
                            voient à la même heure, sur la même timeline.
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="mt-1.5 text-[13.5px] font-semibold leading-snug text-[#0B0C12]">
                            {selected.moment.title}
                          </div>
                          <div className="mt-1 text-[10.5px] text-black/50">
                            {selected.moment.subtitle}
                          </div>
                          {selected.moment.alignedRole ? (
                            <div className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0B0C12] px-2.5 py-1 text-[9.5px] font-semibold text-white">
                              <Sparkles size={10} /> Aligné : {selected.moment.alignedRole}
                            </div>
                          ) : null}
                          <p className="mt-2 line-clamp-4 text-[10.5px] leading-relaxed text-black/60">
                            {selected.moment.coupleNote ?? selected.moment.description}
                          </p>
                          <div className="mt-auto flex items-center gap-3 pt-2 text-[9.5px] font-mono text-black/40">
                            <span className="flex items-center gap-1">
                              <Clock size={10} /> {selected.moment.durationMinutes} min
                            </span>
                            {selected.moment.attachedDocs.length > 0 && (
                              <span>📎 {selected.moment.attachedDocs.length} document</span>
                            )}
                            {selected.moment.vendorConfirmation?.confirmed && (
                              <span className="text-emerald-600">✓ confirmé</span>
                            )}
                          </div>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* CARTE MUSICALE — visuel + vrai morceau */}
                <div className="shrink-0 px-3.5 pb-2">
                  <div className="flex items-center gap-2.5 rounded-[16px] bg-[#0B0C12] p-2.5 text-white">
                    <img
                      src={cockpit.track.cover}
                      alt=""
                      className="h-9 w-9 shrink-0 rounded-[10px] object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[10.5px] font-semibold">
                        {cockpit.track.title}
                      </div>
                      <div className="truncate text-[9px] text-white/55">
                        {cockpit.track.subtitle}
                      </div>
                      <div className="mt-1 h-[2px] w-full overflow-hidden rounded-full bg-white/20">
                        <div
                          className="h-full rounded-full bg-white transition-[width] duration-200"
                          style={{ width: `${Math.round(progress * 100)}%` }}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={playing ? 'Mettre en pause' : `Écouter ${cockpit.track.title}`}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#0B0C12] transition hover:scale-105 active:scale-95"
                    >
                      {playing ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
                    </button>
                  </div>
                </div>

                {/* TIMELINE — le différenciant, en bas, pour tous */}
                <div className="shrink-0 border-t border-black/6 bg-[#FAFAFA] pb-3 pt-2">
                  <div className="mb-1.5 flex items-center justify-between px-3.5">
                    <span className="text-[8.5px] font-mono uppercase tracking-[0.16em] text-black/40">
                      Timeline du jour J
                    </span>
                    <span className="text-[8.5px] font-mono text-black/35">
                      {moments.filter((m) => !m.locked).length}/{moments.length} visibles
                    </span>
                  </div>

                  <div ref={trackRef} className="no-scrollbar overflow-x-auto px-3.5 pb-1">
                    <div className="relative h-[62px]" style={{ width: trackWidth }}>
                      {/* Règle horaire */}
                      {hours.map((h, i) => (
                        <div
                          key={h}
                          className="absolute top-0 h-[62px] border-l border-black/8"
                          style={{ left: i * 60 * PX_PER_MINUTE }}
                        >
                          <span className="absolute -top-0.5 left-1 text-[7.5px] font-mono text-black/30">
                            {String(h).padStart(2, '0')}h
                          </span>
                        </div>
                      ))}

                      {/* Moments */}
                      {moments.map(({ moment, locked }) => {
                        const active = moment.id === selectedId;
                        const left = moment.startMinuteOfDay * PX_PER_MINUTE;
                        const width = Math.max(20, moment.durationMinutes * PX_PER_MINUTE);
                        return (
                          <button
                            key={moment.id}
                            type="button"
                            data-moment={moment.id}
                            onClick={() => setSelectedId(moment.id)}
                            title={
                              locked
                                ? `${moment.startTime} · scellé pour ce rôle`
                                : `${moment.startTime} · ${moment.title}`
                            }
                            className={`absolute bottom-1 overflow-hidden rounded-[7px] border px-1.5 pt-1 text-left transition ${
                              active
                                ? 'z-10 border-[#0B0C12] bg-[#0B0C12] text-white shadow-[0_6px_16px_rgba(0,0,0,0.25)]'
                                : locked
                                  ? 'border-dashed border-black/20 bg-black/[0.03] text-black/35'
                                  : 'border-black/10 bg-white text-[#0B0C12] hover:border-black/35'
                            }`}
                            style={{ left, width, height: 40 }}
                          >
                            <span className="flex items-center gap-1 text-[7.5px] font-mono opacity-70">
                              {locked && <Lock size={7} />}
                              {moment.startTime}
                            </span>
                            <span className="mt-0.5 line-clamp-2 block text-[8.5px] font-semibold leading-[1.15]">
                              {locked ? 'Scellé' : moment.title}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <p className="vp-caption mx-auto mt-9 max-w-lg text-center">
          {identity.privateSpaceHint}
        </p>
      </div>
    </section>
  );
}

export { MOMENTS };
