import { Check } from 'lucide-react';
import { WEDDING_STYLES } from '../lib/weddingStyles';
import VisionImage from './vision/VisionImage';

interface Props {
  value: string;
  onChange: (id: string) => void;
}

/**
 * Sélecteur d’environnement — version qui casse les codes.
 *
 * Chaque carte est un mini-manifeste : image radicalement distincte,
 * accent qui claque, tagline qui provoque. Plus de doublons bouquet.jpg.
 * On veut que l'utilisateur s'arrête et se dise "ah, on peut faire ça ?"
 */
export default function StylePicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {WEDDING_STYLES.map((s) => {
        const active = value === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onChange(s.id)}
            aria-pressed={active}
            className={`group vp-press relative text-left transition-all duration-500 ${
              active ? 'scale-[1.02]' : 'hover:scale-[1.01]'
            }`}
            style={{ borderRadius: 18 }}
          >
            <span
              className={`relative block overflow-hidden rounded-[18px] border transition-all duration-500 ${
                active
                  ? 'border-[var(--vp-ink)] shadow-[0_0_0_3px_rgba(0,0,0,0.08),0_20px_40px_-20px_rgba(0,0,0,0.3)]'
                  : 'border-white/70 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.2)] group-hover:border-white'
              }`}
            >
              <VisionImage
                src={s.image}
                alt={s.name}
                fallbackLabel={s.name}
                aura={s.aura}
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
              {/* Accent dot + dark badge */}
              <span className="absolute left-3 top-3 flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full shadow-[0_0_0_3px_rgba(255,255,255,0.9)]"
                  style={{ background: s.accent }}
                />
                {s.dark && (
                  <span className="rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur-md">
                    Nuit
                  </span>
                )}
              </span>
              {active && (
                <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                  <Check size={15} className="text-black" strokeWidth={2.8} />
                </span>
              )}
              {/* Manifesto overlay on hover */}
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 pt-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="line-clamp-2 text-[12px] font-medium leading-snug text-white/90">
                  {s.manifesto}
                </span>
              </span>
            </span>
            <span className="block px-1 pt-3">
              <span className="flex items-center gap-2">
                <span className="vp-title block text-[17px] leading-none">{s.name}</span>
                <span className="h-px w-4 bg-black/10" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-black/40">{s.id}</span>
              </span>
              <span className="vp-caption mt-1 block !text-[12px] font-medium leading-tight text-[var(--vp-muted)]">
                {s.tagline}
              </span>
              {active && s.manifesto && (
                <span className="mt-2 block rounded-[12px] bg-black/[0.04] px-2.5 py-2 text-[11.5px] leading-snug text-[var(--vp-ink-soft)]">
                  {s.manifesto}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
