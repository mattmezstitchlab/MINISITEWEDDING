import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import type { WeddingSite } from '../lib/types';
import { TYPO_OPTIONS, ACCENT_PRESETS, BUTTON_OPTIONS, SHAPE_OPTIONS, LAYOUT_OPTIONS, ANIMATION_OPTIONS } from '../lib/weddingStyles';

interface Props {
  site: WeddingSite;
  onPatch: (patch: Partial<WeddingSite>) => void;
}

function Label({ children }: { children: ReactNode }) {
  return <div className="text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-medium mb-3">{children}</div>;
}

export default function AppearancePanel({ site, onPatch }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <Label>Typographie</Label>
        <div className="grid grid-cols-2 gap-2.5">
          {TYPO_OPTIONS.map((t) => (
            <button key={t.id} onClick={() => onPatch({ typography: t.id })} className={`p-4 rounded-2xl border text-left transition ${site.typography === t.id ? 'border-neutral-900 bg-white shadow-sm' : 'border-black/10 bg-white hover:border-black/30'}`}>
              <div className="text-2xl" style={{ fontFamily: t.heading }}>Ag</div>
              <div className="mt-1 text-[13px] font-medium">{t.name}</div>
              <div className="text-[11px] text-neutral-400">{t.hint}</div>
            </button>
          ))}
        </div>
      </div>
      <div>
        <Label>Couleur d’accent</Label>
        <div className="flex items-center gap-2.5 flex-wrap">
          {ACCENT_PRESETS.map((c) => (
            <button key={c} onClick={() => onPatch({ accent_color: c })} className={`w-10 h-10 rounded-full transition ring-offset-2 ${site.accent_color === c ? 'ring-2 ring-neutral-900' : 'hover:scale-110'}`} style={{ background: c }} aria-label={c}>
              {site.accent_color === c && <Check size={16} className="mx-auto text-white" />}
            </button>
          ))}
          <label className="w-10 h-10 rounded-full border border-dashed border-black/25 flex items-center justify-center cursor-pointer text-neutral-400 hover:border-black/50 transition overflow-hidden relative" title="Couleur personnalisée">
            <span className="text-lg leading-none">+</span>
            <input type="color" value={site.accent_color || '#8A6D4B'} onChange={(e) => onPatch({ accent_color: e.target.value })} className="absolute inset-0 opacity-0 cursor-pointer" />
          </label>
        </div>
      </div>
      <div>
        <Label>Boutons</Label>
        <div className="grid grid-cols-3 gap-2.5">
          {BUTTON_OPTIONS.map((b) => (
            <button key={b.id} onClick={() => onPatch({ button_style: b.id })} className={`py-3.5 px-2 text-[13px] font-medium bg-neutral-900 text-white transition ${site.button_style === b.id ? 'ring-2 ring-offset-2 ring-neutral-900' : 'opacity-70 hover:opacity-100'}`} style={{ borderRadius: b.id === 'pill' ? 999 : b.id === 'soft' ? 12 : 4 }}>{b.name}</button>
          ))}
        </div>
      </div>
      <div>
        <Label>Formes</Label>
        <div className="grid grid-cols-3 gap-2.5">
          {SHAPE_OPTIONS.map((s) => (
            <button key={s.id} onClick={() => onPatch({ shape: s.id })} className={`py-4 text-[13px] font-medium border transition ${site.shape === s.id ? 'border-neutral-900 bg-white shadow-sm' : 'border-black/10 bg-white text-neutral-500 hover:border-black/30'}`} style={{ borderRadius: s.id === 'round' ? 26 : s.id === 'soft' ? 14 : 3 }}>{s.name}</button>
          ))}
        </div>
      </div>
      <div>
        <Label>Mise en page</Label>
        <div className="grid grid-cols-2 gap-2.5">
          {LAYOUT_OPTIONS.map((l) => (
            <button key={l.id} onClick={() => onPatch({ layout: l.id })} className={`p-4 rounded-2xl border text-left transition ${site.layout === l.id ? 'border-neutral-900 bg-white shadow-sm' : 'border-black/10 bg-white hover:border-black/30'}`}>
              <div className="text-[13px] font-medium">{l.name}</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">{l.desc}</div>
            </button>
          ))}
        </div>
      </div>
      <div>
        <Label>Niveau d’animation</Label>
        <div className="grid grid-cols-3 gap-2.5">
          {ANIMATION_OPTIONS.map((a) => (
            <button key={a.id} onClick={() => onPatch({ animation_level: a.id })} className={`p-3.5 rounded-2xl border text-center transition ${site.animation_level === a.id ? 'border-neutral-900 bg-white shadow-sm' : 'border-black/10 bg-white hover:border-black/30'}`}>
              <div className="text-[13px] font-medium">{a.name}</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">{a.desc}</div>
            </button>
          ))}
        </div>
      </div>
      <p className="text-[12px] text-neutral-400 leading-relaxed pb-2">Chaque changement est visible instantanément dans l’aperçu, sur mobile comme sur ordinateur.</p>
    </div>
  );
}
