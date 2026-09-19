import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { WEDDING_STYLES } from '../lib/weddingStyles';
import { STEPS, QUICK_STYLES, type SpaceDraft } from '../lib/spaceDraft';

/**
 * LA CRÉATION DE L'ESPACE, EN QUATRE ÉTAPES
 *
 * Le champ du hero ne pose plus une question ouverte : il avance étape par
 * étape — les prénoms, la date, le lieu, l'univers — et chaque réponse part
 * directement dans le téléphone posé sous le hero, qui se remplit au fur et à
 * mesure.
 */

interface SpaceBuilderProps {
  draft: SpaceDraft;
  onDraftChange: (patch: Partial<SpaceDraft>) => void;
  /** Appelé quand on valide la dernière étape. */
  onCreated?: () => void;
}

export default function SpaceBuilder({ draft, onDraftChange, onCreated }: SpaceBuilderProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  const set = (patch: Partial<SpaceDraft>) => onDraftChange(patch);

  const canAdvance = (() => {
    if (step === 0) return draft.partner1.trim().length > 0 && draft.partner2.trim().length > 0;
    if (step === 1) return draft.date.length > 0;
    if (step === 2) return draft.venue.trim().length > 0;
    return Boolean(draft.styleId);
  })();

  const next = () => {
    if (!canAdvance) return;
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onCreated?.();
    }
  };

  const inputClass =
    'w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-[13.5px] text-[#0B0C12] outline-none transition placeholder:text-black/35 focus:border-black/40';

  return (
    <div className="mx-auto w-full max-w-2xl text-left">
      <div className="rounded-[24px] bg-white/95 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-sm">
        {/* L'en-tête : où en est la création */}
        <div className="flex items-center justify-between px-1.5 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
              {step + 1}
            </span>
            <div>
              <div className="text-[12.5px] font-bold leading-none text-[#0B0C12]">{current.title}</div>
              <div className="mt-0.5 text-[10.5px] leading-none text-black/45">{current.hint}</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => (
              <span
                key={s.id}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? 'w-5 bg-black' : i < step ? 'w-1.5 bg-emerald-500' : 'w-1.5 bg-black/15'
                }`}
              />
            ))}
          </div>
        </div>

        {/* L'étape courante */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.2 }}
          >
            {step === 0 && (
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  className={inputClass}
                  placeholder="Votre prénom"
                  value={draft.partner1}
                  onChange={(e) => set({ partner1: e.target.value })}
                />
                <input
                  className={inputClass}
                  placeholder="Son prénom"
                  value={draft.partner2}
                  onChange={(e) => set({ partner2: e.target.value })}
                />
              </div>
            )}

            {step === 1 && (
              <input
                type="date"
                className={inputClass}
                value={draft.date}
                onChange={(e) => set({ date: e.target.value })}
              />
            )}

            {step === 2 && (
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  className={inputClass}
                  placeholder="Le lieu (domaine, mairie, plage…)"
                  value={draft.venue}
                  onChange={(e) => set({ venue: e.target.value })}
                />
                <input
                  className={inputClass}
                  placeholder="La ville"
                  value={draft.city}
                  onChange={(e) => set({ city: e.target.value })}
                />
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-wrap gap-1.5">
                {QUICK_STYLES.map((id) => {
                  const style = WEDDING_STYLES.find((s) => s.id === id);
                  if (!style) return null;
                  const active = draft.styleId === style.id;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => set({ styleId: style.id })}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition ${
                        active
                          ? 'border-black bg-black text-white'
                          : 'border-black/12 bg-white text-[#0B0C12] hover:border-black/40'
                      }`}
                    >
                      {active && <Check size={11} />}
                      {style.name}
                    </button>
                  );
                })}
                <span className="self-center px-1 text-[11px] text-black/45">
                  Les {WEDDING_STYLES.length} univers sont dans le menu, en haut.
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* La barre de progression */}
        <div className="mt-3 flex items-center justify-between gap-3 px-1.5">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-[12px] font-semibold text-black/50 transition hover:text-black disabled:opacity-30"
          >
            Retour
          </button>

          <div className="flex items-center gap-2">
            {draft.styleId && step === 3 && (
              <span className="text-[11px] text-black/45">
                Votre espace se construit dans le téléphone, juste en dessous
              </span>
            )}
            <button
              type="button"
              onClick={next}
              disabled={!canAdvance}
              className="flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-[12.5px] font-bold text-white transition hover:bg-neutral-800 disabled:opacity-30"
            >
              {step === STEPS.length - 1 ? 'Créer notre espace' : 'Continuer'}
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
