import type { ReactNode } from 'react';
import { usePhoneTheme } from './phoneTheme';

/**
 * LE CHÂSSIS DU TÉLÉPHONE
 *
 * Un seul châssis pour les trois écrans — invité, mariés, prestataire — afin
 * qu'ils aient exactement la même silhouette : Dynamic Island, verre teinté et
 * barre de retour, comme un vrai iPhone.
 */

interface PhoneFrameProps {
  children: ReactNode;
  /** La largeur du châssis. */
  className?: string;
  /** Conservé pour compatibilité : plus de liseré sous le verre. */
  tint?: string;
}

export default function PhoneFrame({ children, className = '' }: PhoneFrameProps) {
  return (
    <div
      className={`relative rounded-[48px] bg-[#0A0B10] p-[9px] shadow-[0_35px_90px_rgba(0,0,0,0.22)] ring-1 ring-black/10 ${className}`}
    >
      <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[40px] bg-white text-[#0B0C12]">
        {/* Dynamic Island */}
        <div className="absolute left-1/2 top-2.5 z-30 flex h-[19px] w-[80px] -translate-x-1/2 items-center justify-between rounded-full bg-black px-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-[8px] font-mono text-white/50">VOWS</span>
          <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
        </div>

        {/* L'écran */}
        {children}

        {/* Barre de retour d'Apple */}
        <div className="pointer-events-none absolute inset-x-0 bottom-1.5 z-30 flex justify-center">
          <span className="h-1 w-20 rounded-full bg-black/20" />
        </div>
      </div>
    </div>
  );
}

/**
 * LA CARTE D'UN MODULE
 *
 * Le même matériau que les cartes du mini-site : un fond à peine teinté, l'arrondi
 * du thème, une bordure discrète. Le sur-titre prend la couleur d'accent, comme
 * les sur-titres du site.
 */
export function PhoneModule({
  eyebrow,
  children,
  className = '',
}: {
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}) {
  const theme = usePhoneTheme();
  return (
    <div
      className={`p-3 ${className}`}
      style={{
        borderRadius: theme.cardR,
        background: 'rgba(12,14,24,0.042)',
        border: '1px solid rgba(12,14,24,0.05)',
        fontFamily: theme.body,
      }}
    >
      {eyebrow && (
        <div
          className="mb-1.5 font-mono text-[8.5px] font-bold uppercase tracking-[0.16em]"
          style={{ color: theme.accent }}
        >
          {eyebrow}
        </div>
      )}
      {children}
    </div>
  );
}
