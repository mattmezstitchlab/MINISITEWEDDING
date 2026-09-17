import { useCallback, useState } from 'react';

/**
 * Brouillon local d’une ligne éditable + classes partagées des panneaux.
 *
 * Fichier sans composant : Fast Refresh exige qu’un module n’exporte que des
 * composants, les constantes et le hook vivent donc ici.
 */

export const fieldCls = 'vp-field !px-4 !py-2.5 !text-[14px]';
export const labelCls = 'vp-label !mb-1.5 !tracking-[0.12em]';

/**
 * Les lignes sont rendues avec `key={record.id}` : changer de ligne remonte le
 * composant, l’état initial suffit donc. Aucun effet de resynchronisation n’est
 * nécessaire (c’était la source de six avertissements `react-hooks`).
 */
export function useDraftRow<T extends object>(record: T) {
  const [draft, setDraft] = useState<T>(record);
  const set = useCallback(<K extends keyof T,>(key: K, value: T[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
  }, []);
  return { draft, set };
}
