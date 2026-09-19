import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { THEME_CATEGORIES, WEDDING_STYLES } from '../lib/weddingStyles';
import { STEPS, ROLE_GROUPS, isCoupleRole, type SpaceDraft } from '../lib/spaceDraft';

/**
 * LA CRÉATION DE L'ESPACE, EN CINQ ÉTAPES
 *
 * Chaque étape qui propose des choix le fait par menus : une rangée de
 * sous-catégories, puis seulement les options de la catégorie ouverte. Rien ne
 * déborde, on ne fait pas défiler dix-sept rôles et vingt-quatre univers d'un
 * coup.
 */

interface SpaceBuilderProps {
  draft: SpaceDraft;
  onDraftChange: (patch: Partial<SpaceDraft>) => void;
  /** Appelé quand on valide la dernière étape. */
  onCreated?: () => void;
}

export default function SpaceBuilder({ draft, onDraftChange, onCreated }: SpaceBuilderProps) {
  const [step, setStep] = useState(0);
  const [familleRole, setFamilleRole] = useState(ROLE_GROUPS[0]?.label ?? '');
  const [familleUnivers, setFamilleUnivers] = useState('classique');

  const current = STEPS[step];
  const couple = isCoupleRole(draft.roleId);

  // Les familles d'univers qui contiennent réellement des univers
  const famillesUnivers = useMemo(
    () =>
      THEME_CATEGORIES.filter((cat) => cat.id !== 'all')
        .map((cat) => ({ ...cat, univers: WEDDING_STYLES.filter((s) => s.category === cat.id) }))
        .filter((cat) => cat.univers.length > 0),
    [],
  );

  const rolesAffiches = ROLE_GROUPS.find((g) => g.label === familleRole)?.roles ?? [];
  const universAffiches =
    famillesUnivers.find((f) => f.id === familleUnivers)?.univers ?? WEDDING_STYLES.slice(0, 6);

  const set = (patch: Partial<SpaceDraft>) => onDraftChange(patch);

  const canAdvance = (() => {
    if (current.id === 'role') return Boolean(draft.roleId);
    if (current.id === 'names')
      return couple
        ? draft.partner1.trim().length > 0 && draft.partner2.trim().length > 0
        : draft.partner1.trim().length > 0;
    if (current.id === 'date') return draft.date.length > 0;
    if (current.id === 'place') return draft.venue.trim().length > 0;
    return Boolean(draft.styleId);
  })();

  const next = () => {
    if (!canAdvance) return;
    if (step < STEPS.length - 1) setStep(step + 1);
    else onCreated?.();
  };

  const inputClass =
    'w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-[13.5px] text-[#0B0C12] outline-none transition placeholder:text-black/35 focus:border-black/40';

  /** La rangée de sous-catégories, commune aux deux étapes à choix. */
  const onglets = (items: Array<{ id: string; label: string; nombre: number; actif: boolean; onClick: () => void }>) => (
    <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-0.5">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={item.onClick}
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-semibold transition ${
            item.actif
              ? 'border-black bg-black text-white'
              : 'border-black/12 bg-white text-[#0B0C12]/75 hover:border-black/40'
          }`}
        >
          {item.label}
          <span className={item.actif ? 'text-white/55' : 'text-black/35'}>{item.nombre}</span>
        </button>
      ))}
    </div>
  );

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
            {/* 1. Qui êtes-vous : les familles de rôles, puis les rôles */}
            {current.id === 'role' && (
              <div className="space-y-2">
                {onglets(
                  ROLE_GROUPS.map((groupe) => ({
                    id: groupe.label,
                    label: groupe.label,
                    nombre: groupe.roles.length,
                    actif: familleRole === groupe.label,
                    onClick: () => setFamilleRole(groupe.label),
                  })),
                )}

                <div className="space-y-1 rounded-[16px] bg-[#FAFAFC] p-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={familleRole}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-1"
                    >
                      {rolesAffiches.map((role) => {
                        const actif = draft.roleId === role.id;
                        return (
                          <button
                            key={role.id}
                            type="button"
                            onClick={() => set({ roleId: role.id })}
                            className={`flex w-full items-center justify-between gap-3 rounded-[12px] border px-3 py-2 text-left transition ${
                              actif
                                ? 'border-black bg-black text-white'
                                : 'border-transparent bg-white hover:border-black/15'
                            }`}
                          >
                            <span className="min-w-0">
                              <span className="block truncate text-[12.5px] font-bold">{role.title}</span>
                              <span
                                className={`block truncate text-[10.5px] ${actif ? 'text-white/60' : 'text-black/45'}`}
                              >
                                {role.tagline}
                              </span>
                            </span>
                            <span className="flex shrink-0 items-center gap-1">
                              <span
                                className={`rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                                  actif ? 'bg-white/15 text-white/80' : 'bg-black/5 text-black/45'
                                }`}
                              >
                                {role.badge}
                              </span>
                              {actif && <Check size={12} />}
                            </span>
                          </button>
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* 2. Le nom */}
            {current.id === 'names' &&
              (couple ? (
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
              ) : (
                <input
                  className={inputClass}
                  placeholder="Votre nom ou celui de votre maison"
                  value={draft.partner1}
                  onChange={(e) => set({ partner1: e.target.value, partner2: '' })}
                />
              ))}

            {/* 3. La date */}
            {current.id === 'date' && (
              <input
                type="date"
                className={inputClass}
                value={draft.date}
                onChange={(e) => set({ date: e.target.value })}
              />
            )}

            {/* 4. Le lieu */}
            {current.id === 'place' && (
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

            {/* 5. L'univers : les familles d'univers, puis les univers */}
            {current.id === 'style' && (
              <div className="space-y-2">
                {onglets(
                  famillesUnivers.map((famille) => ({
                    id: famille.id,
                    label: famille.label.replace(/^[^\p{L}]+/u, '').trim(),
                    nombre: famille.univers.length,
                    actif: familleUnivers === famille.id,
                    onClick: () => setFamilleUnivers(famille.id),
                  })),
                )}

                <div className="rounded-[16px] bg-[#FAFAFC] p-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={familleUnivers}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="grid grid-cols-2 gap-1.5 sm:grid-cols-3"
                    >
                      {universAffiches.map((style) => {
                        const actif = draft.styleId === style.id;
                        return (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => set({ styleId: style.id })}
                            className={`relative overflow-hidden rounded-[14px] border text-left transition ${
                              actif ? 'border-black ring-2 ring-black' : 'border-black/10 hover:border-black/40'
                            }`}
                          >
                            <span className="relative block h-[56px] w-full overflow-hidden">
                              <img src={style.image} alt={style.name} className="h-full w-full object-cover" />
                              <span className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                              <span className="absolute bottom-1 left-2 right-2 truncate text-[11px] font-bold text-white">
                                {style.name}
                              </span>
                              {actif && (
                                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white">
                                  <Check size={10} className="text-black" />
                                </span>
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                </div>
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
            {draft.styleId && current.id === 'style' && (
              <span className="hidden text-[11px] text-black/45 sm:inline">
                Votre espace se construit dans le téléphone, juste en dessous
              </span>
            )}
            <button
              type="button"
              onClick={next}
              disabled={!canAdvance}
              className="vp-rainbow flex items-center gap-1.5 rounded-full bg-black px-5 py-2 text-[12.5px] font-bold text-white transition hover:bg-neutral-900 disabled:opacity-30"
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
