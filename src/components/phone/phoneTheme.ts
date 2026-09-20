import { createContext, useContext } from 'react';
import type { WeddingStyle } from '../../lib/weddingStyles';

/**
 * CE QUE LE THÈME PRÊTE À UN ÉCRAN DE TÉLÉPHONE
 *
 * Les mêmes valeurs que celles du mini-site — la typographie de l'univers, son
 * accent, ses encres, le rayon de ses cartes — pour que les écrans du téléphone
 * ne soient pas un deuxième design à côté du site, mais le site, en plus petit.
 */

export interface PhoneTheme {
  style: WeddingStyle;
  heading: string;
  body: string;
  weight: number;
  accent: string;
  ink: string;
  muted: string;
  /** Le rayon des cartes et des boutons de l'univers. */
  cardR: string;
  btnR: string;
}

export const PhoneThemeContext = createContext<PhoneTheme | null>(null);

export function usePhoneTheme(): PhoneTheme {
  const value = useContext(PhoneThemeContext);
  if (!value) throw new Error('usePhoneTheme() doit être utilisé dans <PhoneShell>.');
  return value;
}
