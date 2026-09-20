import { Bell } from 'lucide-react';
import {
  annoncesNouvelles, fermerFente, palierDuPoint, palierDuPointInfo, useAnnonces, useFenteOuverte,
  ouvrirFente,
} from '../lib/annonces';

/**
 * LE POINT D'ÉTAT — EN BAS À DROITE
 *
 * Un bouton noir, un picto blanc, et **un point qui s'allume**. Sa couleur monte
 * avec l'importance de ce qui est arrivé : **vert** (routine), **bleu** (à
 * savoir), **mauve** (à faire), **fuchsia** (important), **orangé** (urgent),
 * **rouge** (critique). Sans rien à voir, il s'éteint.
 *
 * On clique : **la fente sort** — c'est là que le ticket se lit, et que l'on
 * répond. Les documents, les messages et les notifications passent tous par lui :
 * un seul endroit à regarder, et l'on ne rate rien.
 */

export default function BoutonEtat() {
  const annonces = useAnnonces();
  const ouvert = useFenteOuverte();
  const palier = palierDuPoint(annonces);
  const info = palierDuPointInfo(palier);
  const combien = annoncesNouvelles(annonces).length;

  return (
    <button
      type="button"
      onClick={() => (ouvert ? fermerFente() : ouvrirFente())}
      aria-label={
        combien === 0
          ? 'État — rien à voir'
          : `État — ${combien} à voir, ${info.label.toLowerCase()}`
      }
      title={combien === 0 ? 'Rien à voir' : `${combien} à voir · ${info.label}`}
      className="vp-press fixed bottom-20 right-3 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[#0B0C12] text-white shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition hover:scale-105 sm:bottom-6 sm:right-6"
    >
      <Bell size={16} />

      {/* Le point : la couleur dit l'importance, et il bat tant qu'il y a à voir. */}
      <span
        aria-hidden="true"
        style={{ background: info.hex }}
        className={`absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#0B0C12] ${
          combien > 0 ? 'animate-pulse' : ''
        }`}
      />

      {/* Le compte, quand il y en a plusieurs. */}
      {combien > 1 && (
        <span className="absolute -bottom-1 -left-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 font-mono text-[9.5px] font-bold text-[#0B0C12]">
          {combien}
        </span>
      )}
    </button>
  );
}
