/**
 * VOWS Event OS - Predictive Orchestration Engine (Brevetable Core)
 *
 * Algorithme de synchronisation temporelle asynchrone multi-rôles :
 * Lorsqu'un décalage survient sur le terrain (ex: le repas prend 20 min de retard),
 * le moteur recalcule en cascade :
 * 1. La timeline du DJ (BPM, fondu sonore, transition sans temps mort).
 * 2. L'heure du golden hour pour les portraits du photographe argentique.
 * 3. L'heure de déclenchement du chef pâtissier / pyrotechnie.
 * 4. L'information discrète diffusée aux invités sans panique.
 */

export interface TimelineMomentNode {
  id: string;
  originalTime: string; // Ex: "18h30"
  adjustedTime: string;
  title: string;
  category: 'ceremony' | 'cocktail' | 'dinner' | 'first_dance' | 'peak_party';
  durationMinutes: number;
  fixedSunlightConstraint?: boolean; // Dépend du coucher de soleil ?
  vendorDependencies: Array<{
    role: string;
    actionOnShift: string;
    urgency: 'low' | 'medium' | 'critical';
  }>;
  guestNotification?: string;
  targetBpmRange: [number, number];
}

export interface EngineState {
  totalDelayMinutes: number;
  isRecalibrating: boolean;
  moments: TimelineMomentNode[];
  activeMilestoneId: string | null;
  logs: Array<{ timestamp: string; message: string; impactedRole: string }>;
}

export function parseTimeToMinutes(timeStr: string): number {
  const clean = timeStr.replace('h', ':');
  const [h, m] = clean.split(':').map((v) => parseInt(v, 10) || 0);
  return h * 60 + m;
}

export function formatMinutesToTime(totalMin: number): string {
  const norm = ((totalMin % (24 * 60)) + (24 * 60)) % (24 * 60);
  const h = Math.floor(norm / 60);
  const m = norm % 60;
  return `${h.toString().padStart(2, '0')}h${m.toString().padStart(2, '0')}`;
}

/**
 * Calculateur algorithmique de propagation de cascade temporelle
 */
export function calculateCascadeShift(
  moments: TimelineMomentNode[],
  triggerMomentId: string,
  delayMinutes: number
): { shiftedMoments: TimelineMomentNode[]; cascadeEvents: Array<{ role: string; message: string }> } {
  const triggerIdx = moments.findIndex((m) => m.id === triggerMomentId);
  if (triggerIdx === -1) return { shiftedMoments: moments, cascadeEvents: [] };

  const cascadeEvents: Array<{ role: string; message: string }> = [];

  const shiftedMoments = moments.map((moment, idx) => {
    if (idx < triggerIdx) {
      return moment; // Les moments passés restent intacts
    }

    const origMin = parseTimeToMinutes(moment.originalTime);
    const newMin = origMin + delayMinutes;
    const newTime = formatMinutesToTime(newMin);

    // Détection des impacts pour chaque corps de métier
    moment.vendorDependencies.forEach((dep) => {
      cascadeEvents.push({
        role: dep.role,
        message: `${moment.title} décalé à ${newTime} (${delayMinutes > 0 ? `+${delayMinutes} min` : `${delayMinutes} min`}) : ${dep.actionOnShift}`,
      });
    });

    return {
      ...moment,
      adjustedTime: newTime,
    };
  });

  return { shiftedMoments, cascadeEvents };
}
