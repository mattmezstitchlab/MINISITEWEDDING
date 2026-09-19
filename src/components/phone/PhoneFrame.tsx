import type { ReactNode } from 'react';

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
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
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

/** La carte blanche qui sert de module à l'intérieur des écrans. */
export function PhoneModule({
  eyebrow,
  children,
  className = '',
}: {
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[14px] border border-black/6 bg-white p-3 shadow-sm ${className}`}>
      {eyebrow && (
        <div className="mb-1.5 text-[8.5px] font-mono font-bold uppercase tracking-wider text-black/40">
          {eyebrow}
        </div>
      )}
      {children}
    </div>
  );
}
