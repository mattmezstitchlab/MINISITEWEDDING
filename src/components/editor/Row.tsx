import type { ReactNode } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { fieldCls, labelCls } from './draft';

/**
 * Briques des panneaux d’édition.
 *
 * Les cinq éditeurs de lignes (programme, infos, événements RSVP, cagnottes,
 * FAQ) recopiaient le même schéma : carte de verre, champs, sauvegarde à la
 * perte de focus, bouton poubelle, bouton « Ajouter ». Tout est factorisé ici.
 */

/** Carte de verre d’une ligne éditable. */
export function RowCard({ children }: { children: ReactNode }) {
  return <div className="vp-glass vp-spec space-y-2.5 rounded-[20px] p-4">{children}</div>;
}

interface TextFieldProps {
  /** Valeur du brouillon. */
  value: string;
  /** Valeur enregistrée : la sauvegarde ne part que si le texte a changé. */
  saved: string;
  onChange: (value: string) => void;
  onCommit: () => void;
  placeholder?: string;
  label?: string;
  type?: 'text' | 'number';
  /** Rendu en `<textarea>` quand défini. */
  rows?: number;
  className?: string;
}

export function TextField({ value, saved, onChange, onCommit, placeholder, label, type = 'text', rows, className = fieldCls }: TextFieldProps) {
  const blur = () => { if (value !== saved) onCommit(); };
  return (
    <>
      {label && <label className={labelCls}>{label}</label>}
      {rows ? (
        <textarea rows={rows} className={className} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} onBlur={blur} />
      ) : (
        <input type={type} className={className} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} onBlur={blur} />
      )}
    </>
  );
}

/** Bouton « Ajouter … » en pointillés, en bas de chaque liste. */
export function AddRowButton({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="vp-press flex w-full items-center justify-center gap-2 rounded-[18px] border border-dashed border-black/25 bg-white/35 py-3 text-sm font-medium text-[var(--vp-muted)] backdrop-blur-xl transition hover:border-[var(--vp-accent)] hover:text-[var(--vp-accent)] disabled:opacity-50"
    >
      <Plus size={16} /> {children}
    </button>
  );
}

/** Poubelle carrée, à droite d’un champ. */
export function DeleteIconButton({ onClick, label = 'Supprimer' }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="vp-press flex w-10 shrink-0 items-center justify-center rounded-[12px] text-[var(--vp-muted-2)] transition hover:bg-[color-mix(in_srgb,var(--vp-red)_14%,transparent)] hover:text-[var(--vp-red)]"
    >
      <Trash2 size={16} />
    </button>
  );
}

/** Suppression discrète, sous la carte. */
export function DeleteLink({ onClick, children = 'Supprimer' }: { onClick: () => void; children?: ReactNode }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--vp-muted)] transition hover:text-[var(--vp-red)]">
      <Trash2 size={13} /> {children}
    </button>
  );
}
