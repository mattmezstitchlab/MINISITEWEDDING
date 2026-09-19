import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Command } from 'lucide-react';
import { THEME_CATEGORIES, WEDDING_STYLES } from '../lib/weddingStyles';
import { STEPS, ROLE_GROUPS, type SpaceDraft } from '../lib/spaceDraft';

/**
 * L'ESPACE SE CRÉE, QUESTION PAR QUESTION
 *
 * Une seule question à la fois, sur la barre sombre du hero — celle du départ.
 * On commence par le rôle, on finit par l'univers. Aucun champ à remplir pour
 * l'instant : les prénoms, la date et le lieu viendront autrement.
 */

interface SpaceBuilderProps {
  draft: SpaceDraft;
  onDraftChange: (patch: Partial<SpaceDraft>) => void;
  /** Appelé quand on valide la dernière question. */
  onCreated?: () => void;
}

export default function SpaceBuilder({ draft, onDraftChange, onCreated }: SpaceBuilderProps) {
  const [step, setStep] = useState(0);
  const [familleRole, setFamilleRole] = useState(ROLE_GROUPS[0]?.label ?? '');
  const [familleUnivers, setFamilleUnivers] = useState(THEME_CATEGORIES[1]?.id ?? 'classique');

  const current = STEPS[step];
  const set = (patch: Partial<SpaceDraft>) => onDraftChange(patch);

  // Les familles d'univers qui contiennent réellement des univers
  const famillesUnivers = useMemo(
    () =>
      THEME_CATEGORIES.filter((cat) => cat.id !== 'all')
        .map((cat) => ({
          ...cat,
          label: cat.label.replace(/^[^\p{L}]+/u, '').trim(),
          univers: WEDDING_STYLES.filter((s) => s.category === cat.id),
        }))
        .filter((cat) => cat.univers.length > 0),
    [],
  );

  const rolesAffiches = ROLE_GROUPS.find((g) => g.label === familleRole)?.roles ?? [];
  const universAffiches =
    famillesUnivers.find((f) => f.id === familleUnivers)?.univers ?? WEDDING_STYLES.slice(0, 6);

  const canAdvance = current.id === 'role' ? Boolean(draft.roleId) : Boolean(draft.styleId);
  const lastStep = step === STEPS.length - 1;

  const next = () => {
    if (!canAdvance) return;
    if (!lastStep) setStep(step + 1);
    else onCreated?.();
  };

  /** La rangée de familles, en pastilles sombres. */
  const familles = (items: Array<{ id: string; label: string; nombre: number; actif: boolean; onClick: () => void }>) => (
    <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-0.5">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={item.onClick}
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-semibold transition ${
            item.actif
              ? 'border-white/25 bg-white text-[#0B0C12]'
              : 'border-white/10 bg-white/[0.06] text-white/65 hover:border-white/25 hover:text-white'
          }`}
        >
          {item.label}
          <span className={item.actif ? 'text-black/45' : 'text-white/35'}>{item.nombre}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-2xl text-left">
      {/* La barre sombre du hero */}
      <div className="rounded-[24px] border border-white/10 bg-[#0B0C12]/92 p-3.5 shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-md">
        {/* La question, seule */}
        <div className="flex items-center justify-between gap-3 px-1 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10.5px] font-bold text-white">
              {step + 1}
            </span>
            <div>
              <div className="text-[14px] font-bold leading-none text-white">{current.title}</div>
              <div className="mt-1 text-[10.5px] leading-none text-white/45">{current.hint}</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="hidden items-center gap-1 rounded-md border border-white/12 px-1.5 py-0.5 font-mono text-[9.5px] text-white/40 sm:flex">
              <Command size={9} /> K
            </span>
            {STEPS.map((s, i) => (
              <span
                key={s.id}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? 'w-5 bg-white' : i < step ? 'w-1.5 bg-emerald-500' : 'w-1.5 bg-white/15'
                }`}
              />
            ))}
          </div>
        </div>

        {/* La réponse à la question du moment. Hauteur fixe : le bloc ne bouge
            plus quand on passe d'une question à l'autre. */}
        <div className="no-scrollbar h-[228px] overflow-y-auto pr-0.5">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {current.id === 'role' && (
              <div className="space-y-2">
                {familles(
                  ROLE_GROUPS.map((groupe) => ({
                    id: groupe.label,
                    label: groupe.label,
                    nombre: groupe.roles.length,
                    actif: familleRole === groupe.label,
                    onClick: () => setFamilleRole(groupe.label),
                  })),
                )}

                <AnimatePresence mode="wait">
                  <motion.div
                    key={familleRole}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16 }}
                    className="grid gap-1.5 sm:grid-cols-2"
                  >
                    {rolesAffiches.map((role) => {
                      const actif = draft.roleId === role.id;
                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => set({ roleId: role.id })}
                          className={`flex items-center justify-between gap-2 rounded-[14px] border px-3 py-2 text-left transition ${
                            actif
                              ? 'border-white bg-white text-[#0B0C12]'
                              : 'border-white/10 bg-white/[0.05] text-white hover:border-white/30'
                          }`}
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-[12.5px] font-bold">{role.title}</span>
                            <span className={`block truncate text-[10.5px] ${actif ? 'text-black/50' : 'text-white/45'}`}>
                              {role.tagline}
                            </span>
                          </span>
                          {actif && <Check size={13} className="shrink-0" />}
                        </button>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {current.id === 'style' && (
              <div className="space-y-2">
                {familles(
                  famillesUnivers.map((famille) => ({
                    id: famille.id,
                    label: famille.label,
                    nombre: famille.univers.length,
                    actif: familleUnivers === famille.id,
                    onClick: () => setFamilleUnivers(famille.id),
                  })),
                )}

                <AnimatePresence mode="wait">
                  <motion.div
                    key={familleUnivers}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16 }}
                    className="grid grid-cols-3 gap-1.5 sm:grid-cols-4"
                  >
                    {universAffiches.map((style) => {
                      const actif = draft.styleId === style.id;
                      return (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => set({ styleId: style.id })}
                          className={`relative overflow-hidden rounded-[14px] border text-left transition ${
                            actif ? 'border-white ring-2 ring-white' : 'border-white/12 hover:border-white/40'
                          }`}
                        >
                          <span className="relative block aspect-[16/10] w-full overflow-hidden">
                            <img src={style.image} alt={style.name} className="h-full w-full object-cover" />
                            <span className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <span className="absolute bottom-1 left-2 right-2 truncate text-[10.5px] font-bold text-white">
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
            )}
          </motion.div>
        </AnimatePresence>
        </div>

        {/* Le pilotage */}
        <div className="mt-3.5 flex items-center justify-between gap-3 px-1">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-[12px] font-semibold text-white/45 transition hover:text-white disabled:opacity-25"
          >
            Retour
          </button>

          <button
            type="button"
            onClick={next}
            disabled={!canAdvance}
            className="flex items-center gap-1.5 rounded-full bg-white px-5 py-2 text-[12.5px] font-bold text-[#0B0C12] shadow-[0_6px_20px_rgba(0,0,0,0.28)] transition hover:bg-white/90 disabled:opacity-30"
          >
            {lastStep ? 'Créer notre espace' : 'Continuer'}
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
