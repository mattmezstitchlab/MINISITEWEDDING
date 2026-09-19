import { Link } from 'react-router-dom';
import { BookOpen, ShoppingCart } from 'lucide-react';

/**
 * LA BARRE DU SITE
 *
 * Une seule ligne posée sur le hero, sans fond : **le nom en blanc**, et à
 * droite les deux portes du site — le caddie pour le Shop, le magazine pour le
 * Magazine. Pas de capsule : la barre laisse voir le hero, et un voile très
 * doux tient la lisibilité du blanc quand la page défile.
 *
 * Le site s'appelle **Super Mariage**.
 */

interface SiteHeaderProps {
  /** Une précision d'usage à droite du nom : « Invitation », « Prestataire »… */
  mention?: string;
}

/** Le nom du site, tel qu'il s'écrit partout ailleurs. */
export const NOM_DU_SITE = 'SUPER MARIAGE';

export default function SiteHeader({ mention }: SiteHeaderProps) {
  return (
    <>
      {/* Le voile : il ne tient que le haut de la page, et laisse passer les clics. */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-24 bg-gradient-to-b from-black/45 to-transparent"
        aria-hidden="true"
      />

      <nav className="fixed inset-x-0 top-3 z-50 flex items-center justify-between gap-3 px-4 sm:top-4 sm:px-7">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="vp-title text-[14px] font-bold italic tracking-[0.1em] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:text-[17px] sm:tracking-[0.14em]">
            {NOM_DU_SITE}
          </span>
          {mention && (
            <span className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60 sm:inline">
              {mention}
            </span>
          )}
        </Link>

        {/* En haut à droite, les deux portes du site : le Shop, le Magazine. */}
        <div className="flex items-center gap-2">
          <Link
            to="/shop"
            aria-label="Le Shop"
            title="Le Shop"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-md transition hover:border-white hover:bg-white hover:text-[#0B0C12]"
          >
            <ShoppingCart size={16} />
          </Link>
          <Link
            to="/magazine"
            aria-label="Le Magazine"
            title="Le Magazine"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-md transition hover:border-white hover:bg-white hover:text-[#0B0C12]"
          >
            <BookOpen size={16} />
          </Link>
        </div>
      </nav>
    </>
  );
}
