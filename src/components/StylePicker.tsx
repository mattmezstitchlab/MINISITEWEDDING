import { Check } from 'lucide-react';
import { WEDDING_STYLES } from '../lib/weddingStyles';
import VisionImage from './vision/VisionImage';

interface Props {
  value: string;
  onChange: (id: string) => void;
}

/**
 * Sélecteur d’environnement (étape 4 de la création).
 *
 * Extrait de la page d’onboarding pour que le choix d’un style soit un
 * composant à part entière, réutilisable depuis l’éditeur. La vitrine de la
 * landing reste volontairement séparée : elle ne sélectionne rien, elle montre.
 */
export default function StylePicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {WEDDING_STYLES.map((s) => {
        const active = value === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onChange(s.id)}
            aria-pressed={active}
            className={`vp-press text-left transition-all duration-500 ${
              active ? 'scale-[1.01] ring-2 ring-[var(--vp-accent)] ring-offset-4 ring-offset-transparent' : 'hover:scale-[1.01]'
            }`}
            style={{ borderRadius: 14 }}
          >
            <span className="relative block overflow-hidden rounded-[14px]">
              <VisionImage src={s.image} alt={s.name} fallbackLabel={s.name} aura={s.aura} className="aspect-[3/4] w-full object-cover" />
              {active && (
                <span className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white">
                  <Check size={15} className="text-[var(--vp-accent)]" strokeWidth={2.6} />
                </span>
              )}
            </span>
            <span className="block px-0.5 pt-2.5">
              <span className="vp-title block text-[16px]">{s.name}</span>
              <span className="vp-caption mt-0.5 block !text-[11.5px]">{s.tagline}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
