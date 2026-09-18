import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Zap,
  RotateCcw,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Music,
  Camera,
  Utensils,
  Sun,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  calculateCascadeShift,
  type TimelineMomentNode,
} from '../lib/vowsOrchestrationEngine';

const INITIAL_MOMENTS: TimelineMomentNode[] = [
  {
    id: 'm1',
    originalTime: '17h00',
    adjustedTime: '17h00',
    title: 'Cérémonie & Échange des Vœux',
    category: 'ceremony',
    durationMinutes: 60,
    targetBpmRange: [65, 80],
    vendorDependencies: [
      { role: 'Célébrant / Officiant', actionOnShift: 'Ajuste la durée de lecture des vœux', urgency: 'low' },
      { role: 'Violoncelliste Solo', actionOnShift: 'Maintient la boucle d’ambiance en fond', urgency: 'medium' },
    ],
  },
  {
    id: 'm2',
    originalTime: '18h30',
    adjustedTime: '18h30',
    title: 'Cocktail & Portraits Golden Hour',
    category: 'cocktail',
    durationMinutes: 90,
    fixedSunlightConstraint: true,
    targetBpmRange: [85, 105],
    vendorDependencies: [
      { role: 'Photographe Argentique', actionOnShift: 'Alerte coucher de soleil impératif à 19h45', urgency: 'critical' },
      { role: 'Traiteur & Verrerie', actionOnShift: 'Prolonge le plateau champagne sans interruption', urgency: 'medium' },
    ],
  },
  {
    id: 'm3',
    originalTime: '20h30',
    adjustedTime: '20h30',
    title: 'Dîner des Banquets & Toasts',
    category: 'dinner',
    durationMinutes: 120,
    targetBpmRange: [90, 110],
    vendorDependencies: [
      { role: 'Chef Traiteur Étoilé', actionOnShift: 'Reporte le départ des cuissons chaudes', urgency: 'critical' },
      { role: 'Light Designer', actionOnShift: 'Baisse progressive des bougies et sodium', urgency: 'low' },
    ],
  },
  {
    id: 'm4',
    originalTime: '23h00',
    adjustedTime: '23h00',
    title: 'Pièce Montée & Pyrotechnie',
    category: 'first_dance',
    durationMinutes: 30,
    targetBpmRange: [115, 122],
    vendorDependencies: [
      { role: 'Artificier & Pyrotechnie', actionOnShift: 'Reprogramme l’allumage des cascades de bengale', urgency: 'critical' },
      { role: 'Chef Pâtissier', actionOnShift: 'Sortie minutée du chariot froid', urgency: 'high' as any },
    ],
  },
  {
    id: 'm5',
    originalTime: '23h30',
    adjustedTime: '23h30',
    title: 'Ouverture du Bal & Pic 02h17',
    category: 'peak_party',
    durationMinutes: 240,
    targetBpmRange: [124, 130],
    vendorDependencies: [
      { role: 'DJ Sound Engineer', actionOnShift: 'Transition automatique vers le set progressif 128 BPM', urgency: 'medium' },
      { role: 'Mixologue Bar de Nuit', actionOnShift: 'Ouverture du comptoir à cocktails énergisants', urgency: 'low' },
    ],
  },
];

export default function PredictiveOrchestrationStudio({ lightMode = false }: { lightMode?: boolean }) {
  const [moments, setMoments] = useState<TimelineMomentNode[]>(INITIAL_MOMENTS);
  const [accumulatedShift, setAccumulatedShift] = useState(0);
  const [lastCascadeLogs, setLastCascadeLogs] = useState<Array<{ role: string; message: string }>>([]);

  const applyDelay = (delayDeltaMinutes: number) => {
    const nextShift = accumulatedShift + delayDeltaMinutes;
    setAccumulatedShift(nextShift);

    const { shiftedMoments, cascadeEvents } = calculateCascadeShift(
      moments,
      'm3',
      nextShift
    );

    setMoments(shiftedMoments);
    setLastCascadeLogs(cascadeEvents);
  };

  const resetTimeline = () => {
    setAccumulatedShift(0);
    setMoments(INITIAL_MOMENTS);
    setLastCascadeLogs([]);
  };

  if (lightMode) {
    // VERSION APPLE SUR FOND BLANC NOBLE & ÉPURÉ (SANS GROS BLOC NOIR)
    return (
      <div className="w-full text-left text-[#0B0C12] space-y-8">
        {/* En-tête épuré */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-6">
          <div className="space-y-1">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-black/50">
              Module 01 · Orchestration Prédictive Temporelle
            </div>
            <h3 className="vp-title text-[24px] sm:text-[30px] text-[#0B0C12]">
              Résolution en cascade des retards du Jour J
            </h3>
            <p className="text-[14px] text-[#0B0C12]/60 max-w-xl leading-relaxed">
              Le traiteur a 15 minutes de retard ? Le système recalcule le conducteur du DJ, l'heure solaire du photographe et la pyrotechnie sans aucune panique.
            </p>
          </div>

          {/* Boutons de simulation discrets */}
          <div className="flex items-center gap-2 rounded-full bg-neutral-100 p-1.5 border border-black/5 shrink-0">
            <span className="text-[11px] font-mono text-black/40 px-2">Simuler :</span>
            <button
              type="button"
              onClick={() => applyDelay(15)}
              className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[11.5px] font-bold text-black border border-black/10 shadow-sm hover:bg-neutral-50 transition"
            >
              <Plus size={12} />
              <span>+15 min</span>
            </button>
            <button
              type="button"
              onClick={() => applyDelay(-15)}
              className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[11.5px] font-bold text-black border border-black/10 shadow-sm hover:bg-neutral-50 transition"
            >
              <Minus size={12} />
              <span>-15 min</span>
            </button>
            {accumulatedShift !== 0 && (
              <button
                type="button"
                onClick={resetTimeline}
                className="p-1.5 rounded-full text-black/40 hover:text-black transition"
                title="Réinitialiser"
              >
                <RotateCcw size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Jauge d'état simple */}
        <div className="flex items-center justify-between py-2 text-[12px] font-mono">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${accumulatedShift !== 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
            <span className="font-semibold text-black">
              {accumulatedShift === 0
                ? 'Planning nominal · 0 min de décalage'
                : `Décalage Dîner répercuté : ${accumulatedShift > 0 ? `+${accumulatedShift}` : accumulatedShift} minutes`}
            </span>
          </div>
          <span className="text-black/40 hidden sm:inline">Algorithme brevetable v1.4</span>
        </div>

        {/* Ligne des 5 moments en cartes blanches minimales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {moments.map((m, idx) => {
            const isShifted = m.originalTime !== m.adjustedTime;

            return (
              <div
                key={m.id}
                className={`rounded-[20px] p-4 border transition-all ${
                  isShifted
                    ? 'bg-amber-500/[0.04] border-amber-500/30 shadow-sm'
                    : 'bg-white border-black/8 hover:border-black/20 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-black/5">
                  <span className="text-[9.5px] font-mono text-black/40 uppercase">0{idx + 1}</span>
                  <div className="flex items-center gap-1.5">
                    {isShifted && (
                      <span className="text-[10px] font-mono line-through text-black/30">
                        {m.originalTime}
                      </span>
                    )}
                    <span className={`font-mono text-[12.5px] font-bold px-2 py-0.5 rounded-full ${
                      isShifted ? 'bg-amber-500/10 text-amber-900 font-bold' : 'bg-black/5 text-black'
                    }`}>
                      {m.adjustedTime}
                    </span>
                  </div>
                </div>

                <div className="mt-2.5">
                  <div className="text-[13px] font-bold text-black leading-snug">{m.title}</div>
                  <div className="text-[10px] font-mono text-black/50 mt-1 flex items-center gap-1">
                    <Music size={10} />
                    <span>{m.targetBpmRange.join('-')} BPM</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-black/5 space-y-1">
                  {m.vendorDependencies.map((dep, dIdx) => (
                    <div key={dIdx} className="text-[9px] text-black/60 truncate">
                      <strong>{dep.role} :</strong> {dep.actionOnShift}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Journal d'impacts épuré */}
        {lastCascadeLogs.length > 0 && (
          <div className="rounded-[18px] bg-neutral-100/70 border border-black/5 p-4 text-[11px] font-mono space-y-1">
            <div className="text-black/50 font-bold uppercase mb-1">Journal des ajustements automatiques :</div>
            {lastCascadeLogs.map((log, i) => (
              <div key={i} className="text-black/80">
                <span className="text-emerald-600 font-bold">●</span> [{log.role}] {log.message}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Version sombre d'origine
  return (
    <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#0C0D14] p-5 sm:p-8 text-white shadow-2xl">
      <div className="pointer-events-none absolute -top-24 right-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-[100px]" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
            <Zap size={12} className="animate-pulse" />
            VOWS Event OS · Orchestration Prédictive Temporelle
          </div>
          <h3 className="vp-title mt-2 text-[22px] sm:text-[28px] text-white">
            Algorithme de Résolution Asynchrone des Aléas
          </h3>
          <p className="mt-1 text-[13px] text-white/60 max-w-xl">
            Simulez un retard ou une avance terrain : le moteur recalcule instantanément les flux en cascade
            pour le DJ, le traiteur, le photographe et les convives sans stress.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 p-2 shrink-0">
          <div className="text-[11px] font-mono text-white/50 px-2 uppercase">Simulateur :</div>
          <button
            type="button"
            onClick={() => applyDelay(15)}
            className="flex items-center gap-1 rounded-full bg-rose-500/20 border border-rose-500/40 px-3 py-1.5 text-[12px] font-bold text-rose-300 hover:bg-rose-500/30 transition shadow-sm"
          >
            <Plus size={12} />
            <span>+15 min</span>
          </button>
          <button
            type="button"
            onClick={() => applyDelay(-15)}
            className="flex items-center gap-1 rounded-full bg-blue-500/20 border border-blue-500/40 px-3 py-1.5 text-[12px] font-bold text-blue-300 hover:bg-blue-500/30 transition shadow-sm"
          >
            <Minus size={12} />
            <span>-15 min</span>
          </button>
          {accumulatedShift !== 0 && (
            <button
              type="button"
              onClick={resetTimeline}
              className="p-1.5 rounded-full text-white/40 hover:text-white transition"
              title="Réinitialiser"
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/[0.03] border border-white/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <Clock size={16} className={accumulatedShift !== 0 ? 'text-amber-400 animate-pulse' : 'text-emerald-400'} />
          <span className="text-[13px] font-medium text-white/90">
            {accumulatedShift === 0 ? (
              'Synchronisation nominale (0 min d’écart avec le planning initial)'
            ) : (
              <span className="text-amber-300 font-mono font-bold">
                Écart détecté sur le Dîner : {accumulatedShift > 0 ? `+${accumulatedShift}` : accumulatedShift} minutes
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11.5px] font-mono text-white/50">
          <Shield size={13} className="text-emerald-400" />
          <span>Protection anti-coupure musicale active · DJ calibré</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-3">
        {moments.map((m, idx) => {
          const isShifted = m.originalTime !== m.adjustedTime;

          return (
            <div
              key={m.id}
              className={`relative rounded-[22px] p-3.5 border transition-all duration-300 ${
                isShifted
                  ? 'border-amber-500/40 bg-amber-500/5 shadow-[0_10px_30px_rgba(245,158,11,0.08)]'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/40">
                  Étape 0{idx + 1}
                </span>
                <div className="flex items-center gap-1.5">
                  {isShifted && (
                    <span className="text-[10px] font-mono line-through text-white/30">
                      {m.originalTime}
                    </span>
                  )}
                  <span
                    className={`font-mono text-[13px] font-bold px-2 py-0.5 rounded-full ${
                      isShifted
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    {m.adjustedTime}
                  </span>
                </div>
              </div>

              <div className="mt-2.5 space-y-1">
                <div className="text-[13px] font-bold text-white leading-snug line-clamp-2">
                  {m.title}
                </div>
                <div className="text-[10px] font-mono text-white/50 flex items-center gap-1">
                  <Music size={10} className="text-emerald-400" />
                  <span>Cadence : {m.targetBpmRange.join('-')} BPM</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/5 space-y-1.5">
                {m.vendorDependencies.map((dep, dIdx) => (
                  <div key={dIdx} className="text-[9.5px] rounded-lg bg-black/40 p-1.5 text-white/70">
                    <div className="font-semibold text-white/90 flex items-center gap-1">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          dep.urgency === 'critical'
                            ? 'bg-rose-400'
                            : dep.urgency === 'medium'
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                      />
                      <span>{dep.role}</span>
                    </div>
                    <div className="text-white/50 truncate mt-0.5">{dep.actionOnShift}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {lastCascadeLogs.length > 0 && (
        <div className="mt-6 rounded-2xl bg-black/60 border border-white/10 p-4">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 mb-2">
            <Zap size={13} />
            <span>Journal de Propagation Algorithmique en Cascade :</span>
          </div>
          <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar font-mono text-[11px] text-white/70">
            {lastCascadeLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-2 py-0.5">
                <span className="text-emerald-400">➔</span>
                <span className="font-bold text-white/90">[{log.role}]</span>
                <span className="text-white/70">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
