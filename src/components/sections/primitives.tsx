import type { CSSProperties } from 'react';
import {
  MapPin, Clock, Heart, Shirt, BedDouble, Car, CloudSun, Baby, Accessibility, Phone,
} from 'lucide-react';
import { useSiteView } from './context';

/** Pastille de sur-titre, posée au centre au-dessus du titre de section. */
export function Eyebrow({ children }: { children: string }) {
  const { dark, accent } = useSiteView();
  return (
    <div className="flex justify-center">
      <span
        className="rounded-full border border-white/70 bg-white/60 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] backdrop-blur-xl [box-shadow:inset_0_1px_0_rgba(255,255,255,0.8)]"
        style={{ color: dark ? '#F2F4FB' : accent }}
      >
        {children}
      </span>
    </div>
  );
}

/** Titre de section : grande typo d’affichage, centrée. */
export function SectionTitle({ children, style }: { children: string; style?: CSSProperties }) {
  const { fonts, headWeight, ink } = useSiteView();
  return (
    <h2
      className="mt-5 text-center"
      style={{
        fontFamily: fonts.heading,
        fontWeight: headWeight,
        letterSpacing: '-0.03em',
        lineHeight: 1.08,
        color: ink,
        fontSize: 'clamp(2rem, 4.6vw, 3.1rem)',
        ...style,
      }}
    >
      {children}
    </h2>
  );
}

/** Icône d’une carte d’information pratique, choisie d’après sa catégorie. */
export function InfoIcon({ category }: { category: string }) {
  const c = category.toLowerCase();
  if (c.includes('parking') || c.includes('transport')) return <Car size={20} strokeWidth={1.7} />;
  if (c.includes('bergement') || c.includes('hôtel') || c.includes('hotel')) return <BedDouble size={20} strokeWidth={1.7} />;
  if (c.includes('horaire') || c.includes('heure')) return <Clock size={20} strokeWidth={1.7} />;
  if (c.includes('dress') || c.includes('tenue')) return <Shirt size={20} strokeWidth={1.7} />;
  if (c.includes('météo') || c.includes('meteo')) return <CloudSun size={20} strokeWidth={1.7} />;
  if (c.includes('contact')) return <Phone size={20} strokeWidth={1.7} />;
  if (c.includes('enfant')) return <Baby size={20} strokeWidth={1.7} />;
  if (c.includes('access')) return <Accessibility size={20} strokeWidth={1.7} />;
  if (c.includes('adresse') || c.includes('lieu') || c.includes('cérémonie') || c.includes('réception')) return <MapPin size={20} strokeWidth={1.7} />;
  return <Heart size={20} strokeWidth={1.7} />;
}
