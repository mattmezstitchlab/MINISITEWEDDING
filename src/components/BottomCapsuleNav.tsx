import { useEffect, useState } from 'react';
import { Heart, Images, Layers, Music2, Smartphone, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * LA CAPSULE DU BAS
 *
 * La capsule verticale qui flottait à droite dans Event OS revient, posée en bas
 * de l'écran, à l'horizontale : les sections de l'accueil, un picto chacune, le
 * nom au survol. Un clic fait défiler jusqu'à la section, et celle qui est à
 * l'écran s'allume.
 */

interface Step {
  id: string;
  label: string;
  short: string;
  icon: LucideIcon;
}

const STEPS: Step[] = [
  { id: 'hero', label: 'Le visuel plein écran et le champ', short: 'Accueil', icon: Sparkles },
  { id: 'ecran', label: 'Le site du couple, dans la main', short: 'L’écran', icon: Smartphone },
  { id: 'direction', label: 'Direction artistique & scénographie', short: 'Direction artistique', icon: Images },
  { id: 'bande-son', label: 'Studio DJ & bande-son du Jour J', short: 'Bande son', icon: Music2 },
  { id: 'univers', label: 'Univers & métiers complémentaires', short: 'Univers', icon: Layers },
  { id: 'contrainte', label: 'Le plus beau jour se vit', short: 'Zéro contrainte', icon: Heart },
];

export default function BottomCapsuleNav() {
  const [activeId, setActiveId] = useState('hero');

  useEffect(() => {
    const onScroll = () => {
      const probe = window.scrollY + window.innerHeight * 0.45;
      let current = STEPS[0].id;
      for (const step of STEPS) {
        const el = document.getElementById(step.id);
        if (el && el.offsetTop <= probe) current = step.id;
      }
      setActiveId(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-40 -translate-x-1/2">
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-black/8 bg-white/90 p-1.5 shadow-[0_15px_35px_rgba(0,0,0,0.1)] backdrop-blur-xl">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isActive = activeId === step.id;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => goTo(step.id)}
              aria-label={step.label}
              className={`group relative flex h-9 w-9 items-center justify-center rounded-full transition-all sm:h-10 sm:w-10 ${
                isActive ? 'scale-105 bg-black text-white shadow-md' : 'text-black/50 hover:bg-neutral-100 hover:text-black'
              }`}
            >
              <Icon size={16} />

              {/* Le nom, au survol */}
              <span className="pointer-events-none absolute bottom-12 whitespace-nowrap rounded-lg bg-black px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                {step.short}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
