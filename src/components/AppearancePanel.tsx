import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import type { WeddingSite } from '../lib/types';
import { TYPO_OPTIONS, ACCENT_PRESETS, BUTTON_OPTIONS, SHAPE_OPTIONS, LAYOUT_OPTIONS, ANIMATION_OPTIONS } from '../lib/weddingStyles';

interface Props {
  site: WeddingSite;
  onPatch: (patch: Partial<WeddingSite>) => void;
}

function Label({ children }: { children: ReactNode }) {
  return <div className="vp-eyebrow mb-3">{children}</div>;
}

export default function AppearancePanel({ site, onPatch }: Props) {
  const card = (active: boolean) =>
    `vp-press rounded-[20px] border p-4 text-left transition-all duration-300 backdrop-blur-xl ${
      active
        ? 'border-[var(--vp-ink)] bg-white shadow-[0_0_0_3px_rgba(12,14,24,0.10),var(--vp-depth-1)]'
        : 'border-white/65 bg-white/55 hover:border-white/95 hover:bg-white/80'
    }`;

  return (
    <div className="space-y-8">
      <div>
        <Label>Typographie</Label>
        <div className="grid grid-cols-2 gap-2.5">
          {TYPO_OPTIONS.map((t) => (
            <button key={t.id} onClick={() => onPatch({ typography: t.id })} className={card(site.typography === t.id)}>
              <div className="text-[26px] leading-none" style={{ fontFamily: t.heading, fontWeight: t.weight }}>Ag</div>
              <div className="mt-2 text-[13px] font-semibold">{t.name}</div>
              <div className="vp-caption !text-[11px]">{t.hint}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Couleur d’accent</Label>
        <div className="flex flex-wrap items-center gap-2.5">
          {ACCENT_PRESETS.map((c) => (
            <button
              key={c}
              onClick={() => onPatch({ accent_color: c })}
              className={`vp-press flex h-10 w-10 items-center justify-center rounded-full transition ${site.accent_color === c ? 'scale-110' : 'hover:scale-105'}`}
              style={{ background: c, boxShadow: site.accent_color === c ? `0 0 0 3px white, 0 0 0 5px ${c}` : `0 8px 18px -10px ${c}` }}
              aria-label={c}
            >
              {site.accent_color === c && <Check size={16} className="text-white" strokeWidth={3} />}
            </button>
          ))}
          <label
            className="vp-press relative flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-black/25 text-[var(--vp-muted)] transition hover:border-[var(--vp-accent)] hover:text-[var(--vp-accent)]"
            title="Couleur personnalisée"
          >
            <span className="text-lg leading-none">+</span>
            <input type="color" value={site.accent_color || '#16171A'} onChange={(e) => onPatch({ accent_color: e.target.value })} className="absolute inset-0 cursor-pointer opacity-0" />
          </label>
        </div>
      </div>

      <div>
        <Label>Boutons</Label>
        <div className="grid grid-cols-3 gap-2.5">
          {BUTTON_OPTIONS.map((b) => (
            <button
              key={b.id}
              onClick={() => onPatch({ button_style: b.id })}
              className={`vp-press px-2 py-3.5 text-[13px] font-semibold text-white transition ${site.button_style === b.id ? 'opacity-100' : 'opacity-60 hover:opacity-90'}`}
              style={{
                borderRadius: b.id === 'pill' ? 999 : b.id === 'soft' ? 14 : 6,
                background: 'var(--vp-accent)',
                boxShadow: site.button_style === b.id ? '0 0 0 3px color-mix(in srgb, var(--vp-accent) 22%, transparent), var(--vp-depth-1)' : 'var(--vp-depth-1)',
              }}
            >
              {b.name}
            </button>
          ))}
        </div>
        <p className="vp-caption mt-2 !text-[11.5px]">{BUTTON_OPTIONS.find((b) => b.id === site.button_style)?.desc}</p>
      </div>

      <div>
        <Label>Formes</Label>
        <div className="grid grid-cols-3 gap-2.5">
          {SHAPE_OPTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => onPatch({ shape: s.id })}
              className={`vp-press border py-4 text-[13px] font-semibold transition backdrop-blur-xl ${
                site.shape === s.id
                  ? 'border-[var(--vp-ink)] bg-white text-[var(--vp-ink)] shadow-[0_0_0_3px_rgba(12,14,24,0.10)]'
                  : 'border-white/65 bg-white/55 text-[var(--vp-muted)] hover:border-white/95 hover:bg-white/80'
              }`}
              style={{ borderRadius: s.id === 'round' ? 30 : s.id === 'soft' ? 18 : 4 }}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Mise en page</Label>
        <div className="grid grid-cols-2 gap-2.5">
          {LAYOUT_OPTIONS.map((l) => (
            <button key={l.id} onClick={() => onPatch({ layout: l.id })} className={card(site.layout === l.id)}>
              <div className="text-[13px] font-semibold">{l.name}</div>
              <div className="vp-caption mt-0.5 !text-[11px]">{l.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Niveau d’animation</Label>
        <div className="vp-segmented grid w-full grid-cols-3">
          {ANIMATION_OPTIONS.map((a) => (
            <button key={a.id} onClick={() => onPatch({ animation_level: a.id })} className="vp-seg-item justify-center !px-1" data-on={site.animation_level === a.id}>
              {a.name}
            </button>
          ))}
        </div>
        <p className="vp-caption mt-2.5 !text-[11.5px]">{ANIMATION_OPTIONS.find((a) => a.id === site.animation_level)?.desc}</p>
      </div>

      <div className="vp-glass vp-spec rounded-[20px] p-4">
        <p className="vp-caption !text-[12px] leading-relaxed">Chaque changement est visible instantanément dans l’aperçu, sur mobile comme sur ordinateur.</p>
      </div>
    </div>
  );
}
