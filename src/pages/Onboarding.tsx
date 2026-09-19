import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Check, Loader2, MapPin, CalendarDays, Heart, Clock, Music2, Users,
} from 'lucide-react';
import { seedSite } from '../lib/defaults';
import WeddingCard from '../components/WeddingCard';
import { roleToScreen } from '../lib/spaceDraft';
import {
  CARD_ACCESS,
  DAY_EVENTS,
  MUSIC_MOODS,
  accessHint,
  saveCard,
  savedOrEmpty,
  type CardAccess,
  type CardData,
} from '../lib/weddingCard';

/**
 * L'ONBOARDING DES MARIÉS
 *
 * Le parcours se lit comme une carte d'identité : quel accès, quels prénoms,
 * quelle date et quel lieu, quels temps de la journée, quelle empreinte
 * musicale, quel univers. La carte se remplit à droite au fil des réponses, et
 * elle ouvre ensuite l'éditeur — puis le mini-site complet.
 */

/** Ce que l'accueil transmet : l'univers et le rôle déjà choisis dans le hero. */
function useEntryState(): { preselectedStyle: string; roleId: string } {
  const state = useLocation().state as { preselectedStyle?: string; roleId?: string } | null;
  return {
    preselectedStyle: typeof state?.preselectedStyle === 'string' ? state.preselectedStyle : '',
    roleId: typeof state?.roleId === 'string' ? state.roleId : '',
  };
}

function accessFromRole(roleId: string): CardAccess {
  if (!roleId) return 'couple';
  const ecran = roleToScreen(roleId);
  if (ecran === 'maries') return 'couple';
  if (ecran === 'invite') return 'amis';
  return 'prestataire';
}

export default function Onboarding() {
  const navigate = useNavigate();
  const entree = useEntryState();
  const [step, setStep] = useState(0);
  const [card, setCard] = useState<CardData>(() => {
    const base = savedOrEmpty();
    return {
      ...base,
      access: accessFromRole(entree.roleId),
      styleId: entree.preselectedStyle || base.styleId,
    };
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  /** Chaque réponse est enregistrée : la carte ouverte ensuite est celle-ci. */
  const set = (patch: Partial<CardData>) => {
    const suivant = { ...card, ...patch };
    saveCard(suivant);
    setCard(suivant);
  };

  const steps = useMemo(
    () => [
      { icon: Heart, label: 'La carte' },
      { icon: Users, label: 'Les mariés' },
      { icon: CalendarDays, label: 'Le jour' },
      { icon: Clock, label: 'Les événements' },
      { icon: Music2, label: 'La musique' },
    ],
    [],
  );

  const dernier = step === steps.length - 1;

  const peutAvancer = () => {
    if (step === 1) return card.partner1.trim().length > 0 && card.partner2.trim().length > 0;
    if (step === 2) return card.date.length > 0 && card.venue.trim().length > 0;
    if (step === 3) return card.events.length > 0;
    return true;
  };

  const toggleEvent = (id: string) => {
    setCard((prev) => ({
      ...prev,
      events: prev.events.includes(id)
        ? prev.events.filter((e) => e !== id)
        : DAY_EVENTS.filter((e) => [...prev.events, id].includes(e.id)).map((e) => e.id),
    }));
  };

  const create = async () => {
    setError('');
    setCreating(true);
    try {
      const { site } = await seedSite(
        {
          partner1: card.partner1,
          partner2: card.partner2,
          wedding_date: card.date,
          venue: card.venue,
          city: card.city,
          style: card.styleId,
        },
        { events: card.events, music: card.music },
      );
      navigate(`/generer?site=${site.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue. Réessayez.');
      setCreating(false);
    }
  };

  return (
    <div className="vp-env flex min-h-screen flex-col">
      <nav className="sticky top-3 z-40 mx-auto w-[calc(100%-1rem)] max-w-6xl sm:top-4">
        <div className="vp-glass vp-spec flex flex-wrap items-center justify-between gap-3 rounded-[26px] px-4 py-2.5 sm:px-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="vp-title text-[18px] font-bold italic tracking-wider">VOWS</span>
            <span className="hidden text-[11.5px] font-semibold uppercase tracking-[0.18em] text-[var(--vp-muted)] sm:inline">
              Votre carte
            </span>
          </Link>
          <div className="flex items-center gap-1 sm:gap-1.5">
            {steps.map((s, i) => (
              <div key={s.label} className="flex items-center gap-1 sm:gap-1.5">
                <div
                  className={`flex items-center gap-2 rounded-full px-2.5 py-1.5 text-[12px] font-medium transition-all duration-500 sm:px-3.5 ${
                    i === step
                      ? 'bg-[var(--vp-ink)] text-white'
                      : i < step
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-black/[0.05] text-[var(--vp-muted)]'
                  }`}
                >
                  {i < step ? <Check size={14} /> : <s.icon size={14} />}
                  <span className="hidden lg:inline">{s.label}</span>
                </div>
                {i < steps.length - 1 && <span className="h-px w-1.5 bg-black/15 sm:w-3" />}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Le hero de la création */}
      <header className="relative mx-4 mt-4 overflow-hidden rounded-[28px] bg-[#0B0C12] sm:mx-8">
        <img
          src="/images/hero-wedding.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/45 to-black/30" />
        <div className="relative px-6 py-10 text-white sm:px-10 sm:py-14">
          <span className="vp-eyebrow !text-white/70">Créer votre site</span>
          <h1 className="vp-title mt-3 max-w-2xl text-white" style={{ fontSize: 'clamp(1.9rem, 4.6vw, 3rem)' }}>
            Votre carte. Votre mariage.
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/75">
            Cinq questions, une carte, et votre mini-site complet s’ouvre dans l’éditeur — le programme, les lieux,
            le RSVP, la cagnotte, la galerie. L’univers, lui, se choisit dans l’éditeur : vous le découvrirez sur
            votre site.
          </p>
        </div>
      </header>

      <div className="flex flex-1 px-4 py-10 sm:px-8">
        <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
          {/* Les questions */}
          <div className="min-w-0">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="s0" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                  <div className="vp-eyebrow">Étape 1 · La carte</div>
                  <h2 className="vp-title mt-3" style={{ fontSize: 'clamp(1.8rem, 4.4vw, 2.6rem)' }}>
                    Quel accès ?
                  </h2>
                  <p className="vp-body mt-3 max-w-xl">
                    Une identité numérique par personne : que vous soyez les mariés, la famille, les amis ou un
                    prestataire, votre carte définit votre accès et votre participation.
                  </p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {CARD_ACCESS.map((acces) => {
                      const actif = card.access === acces.id;
                      return (
                        <button
                          key={acces.id}
                          type="button"
                          onClick={() => set({ access: acces.id })}
                          className={`rounded-[20px] border p-4 text-left transition ${
                            actif
                              ? 'border-[var(--vp-ink)] bg-white shadow-[0_12px_34px_-20px_rgba(11,12,18,0.5)]'
                              : 'border-black/10 bg-white/70 hover:border-black/30'
                          }`}
                        >
                          <span className="flex items-center justify-between gap-2">
                            <span className="text-[14.5px] font-bold text-[var(--vp-ink)]">{acces.label}</span>
                            {actif && <Check size={15} className="shrink-0 text-emerald-600" />}
                          </span>
                          <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--vp-muted)]">
                            {acces.role}
                          </span>
                          <span className="mt-2 block text-[12.5px] leading-snug text-[var(--vp-muted)]">
                            {acces.hint}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                  <div className="vp-eyebrow">Étape 2 · Les mariés</div>
                  <h2 className="vp-title mt-3" style={{ fontSize: 'clamp(1.8rem, 4.4vw, 2.6rem)' }}>
                    Qui se marie ?
                  </h2>
                  <p className="vp-body mt-3 max-w-xl">Vos prénoms, tels que vous voulez les voir en grand sur la carte.</p>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="vp-label ml-1">Premier prénom</label>
                      <input
                        value={card.partner1}
                        onChange={(e) => set({ partner1: e.target.value })}
                        placeholder="Sarah"
                        autoFocus
                        className="vp-field !py-5 !text-[1.5rem] !font-semibold"
                      />
                    </div>
                    <div>
                      <label className="vp-label ml-1">Second prénom</label>
                      <input
                        value={card.partner2}
                        onChange={(e) => set({ partner2: e.target.value })}
                        placeholder="Gabriel"
                        className="vp-field !py-5 !text-[1.5rem] !font-semibold"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                  <div className="vp-eyebrow">Étape 3 · Le jour</div>
                  <h2 className="vp-title mt-3" style={{ fontSize: 'clamp(1.8rem, 4.4vw, 2.6rem)' }}>
                    Quelle date, et où ?
                  </h2>
                  <p className="vp-body mt-3 max-w-xl">
                    La date lance le compte à rebours, le lieu ouvre l’accès et les informations pratiques.
                  </p>
                  <div className="mt-8 grid gap-4">
                    <div className="max-w-sm">
                      <label className="vp-label ml-1">Date du mariage</label>
                      <input
                        type="date"
                        value={card.date}
                        onChange={(e) => set({ date: e.target.value })}
                        className="vp-field vp-num !py-4 !text-[1.15rem] !font-semibold"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="vp-label ml-1">Lieu de réception</label>
                        <input
                          value={card.venue}
                          onChange={(e) => set({ venue: e.target.value })}
                          placeholder="Château de Chantilly"
                          className="vp-field"
                        />
                      </div>
                      <div>
                        <label className="vp-label ml-1">Ville</label>
                        <input
                          value={card.city}
                          onChange={(e) => set({ city: e.target.value })}
                          placeholder="Chantilly, Oise"
                          className="vp-field"
                        />
                      </div>
                    </div>
                    {card.date && (
                      <div className="max-w-sm rounded-[18px] border border-black/8 bg-white/70 p-4">
                        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--vp-muted)]">
                          Disponibilité
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-[14px] font-bold text-[var(--vp-ink)]">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Confirmée
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                  <div className="vp-eyebrow">Étape 4 · Les événements</div>
                  <h2 className="vp-title mt-3" style={{ fontSize: 'clamp(1.8rem, 4.4vw, 2.6rem)' }}>
                    À quoi donne-t-on accès ?
                  </h2>
                  <p className="vp-body mt-3 max-w-xl">
                    Les temps de la journée qui apparaîtront dans le programme et sur les cartes.
                  </p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {DAY_EVENTS.map((evenement) => {
                      const actif = card.events.includes(evenement.id);
                      return (
                        <button
                          key={evenement.id}
                          type="button"
                          onClick={() => toggleEvent(evenement.id)}
                          className={`flex items-start gap-3 rounded-[20px] border p-4 text-left transition ${
                            actif
                              ? 'border-[var(--vp-ink)] bg-white shadow-[0_12px_34px_-20px_rgba(11,12,18,0.5)]'
                              : 'border-black/10 bg-white/70 hover:border-black/30'
                          }`}
                        >
                          <span
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                              actif ? 'border-[var(--vp-ink)] bg-[var(--vp-ink)] text-white' : 'border-black/20'
                            }`}
                          >
                            {actif && <Check size={11} />}
                          </span>
                          <span>
                            <span className="flex items-baseline gap-2">
                              <span className="text-[14.5px] font-bold text-[var(--vp-ink)]">{evenement.label}</span>
                              <span className="vp-num font-mono text-[11px] text-[var(--vp-muted)]">
                                {evenement.time}
                              </span>
                            </span>
                            <span className="mt-1 block text-[12.5px] leading-snug text-[var(--vp-muted)]">
                              {evenement.detail}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="s4" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                  <div className="vp-eyebrow">Étape 5 · La musique</div>
                  <h2 className="vp-title mt-3" style={{ fontSize: 'clamp(1.8rem, 4.4vw, 2.6rem)' }}>
                    Quelle empreinte musicale ?
                  </h2>
                  <p className="vp-body mt-3 max-w-xl">
                    L’ambiance de la playlist collaborative — celle que vos invités complètent avant le jour J.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-2.5">
                    {MUSIC_MOODS.map((mood) => {
                      const actif = card.music === mood.id;
                      return (
                        <button
                          key={mood.id}
                          type="button"
                          onClick={() => set({ music: mood.id })}
                          className={`rounded-[18px] border px-4 py-3 text-left transition ${
                            actif
                              ? 'border-[var(--vp-ink)] bg-white shadow-[0_12px_34px_-20px_rgba(11,12,18,0.5)]'
                              : 'border-black/10 bg-white/70 hover:border-black/30'
                          }`}
                        >
                          <span className="flex items-center gap-2 text-[13.5px] font-bold text-[var(--vp-ink)]">
                            {actif && <Check size={13} className="text-emerald-600" />}
                            {mood.label}
                          </span>
                          <span className="mt-1 block max-w-[240px] text-[12px] leading-snug text-[var(--vp-muted)]">
                            {mood.hint}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {error && (
              <p className="mt-6 rounded-[16px] bg-[color-mix(in_srgb,var(--vp-red)_12%,transparent)] px-4 py-3 text-center text-sm font-medium text-[#B3261E]">
                {error}
              </p>
            )}

            <div className="mt-10 flex items-center justify-between gap-4">
              {step > 0 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  disabled={creating}
                  className="vp-btn vp-btn-glass vp-press disabled:opacity-40"
                >
                  <ArrowLeft size={16} /> Retour
                </button>
              ) : (
                <Link to="/" className="vp-btn vp-btn-glass vp-press">
                  <ArrowLeft size={16} /> Accueil
                </Link>
              )}
              {!dernier ? (
                <button
                  onClick={() => peutAvancer() && setStep(step + 1)}
                  disabled={!peutAvancer()}
                  className="vp-btn vp-press !px-7 disabled:opacity-40"
                >
                  Continuer <ArrowRight size={16} />
                </button>
              ) : (
                <button onClick={create} disabled={!peutAvancer() || creating} className="vp-btn vp-press !px-7">
                  {creating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Création…
                    </>
                  ) : (
                    <>
                      Créer mon site <ArrowRight size={16} />
                    </>
                  )}
                </button>
              )}
            </div>

            <p className="mt-4 flex items-center gap-2 text-[12.5px] text-[var(--vp-muted)]">
              <MapPin size={13} />
              Votre mini-site s’ouvre dans l’éditeur juste après : l’univers, les textes et les sections s’y
              règlent à tout moment.
            </p>
          </div>

          {/* La carte, qui se remplit au fil des questions */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--vp-muted)]">
              Votre carte
            </div>
            <WeddingCard card={card} compact />
            <p className="mt-3 text-[12px] leading-snug text-[var(--vp-muted)]">{accessHint(card.access)}</p>
            <Link to="/carte" className="vp-btn vp-btn-glass vp-press mt-3 w-full justify-center">
              Ouvrir ma carte <ArrowRight size={15} />
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
