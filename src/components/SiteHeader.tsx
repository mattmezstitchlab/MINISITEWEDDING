import { Link } from 'react-router-dom';
import { BookOpen, ShoppingCart } from 'lucide-react';

/**
 * LA BARRE DU SITE
 *
 * Une seule ligne, et rien de plus : **le nom au centre**, et deux pictos à
 * droite — le caddie pour le Shop, le magazine pour le Magazine. Plus de menu
 * déroulant : les univers se parcourent dans la bande, sous le hero, et les
 * métiers sur la page qui les montre.
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
    <nav className="fixed top-3 left-1/2 z-50 w-[calc(100%-1.25rem)] max-w-3xl -translate-x-1/2 sm:top-4">
      <div className="relative flex items-center justify-center rounded-[26px] bg-white px-4 py-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] ring-1 ring-black/5 sm:px-5">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="vp-title text-[14px] font-bold italic tracking-[0.1em] text-[#0B0C12] sm:text-[17px] sm:tracking-[0.14em]">
            {NOM_DU_SITE}
          </span>
          {mention && (
            <span className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0B0C12]/45 sm:inline">
              {mention}
            </span>
          )}
        </Link>

        {/* À droite, les deux portes du site : le Shop, le Magazine. */}
        <div className="absolute right-3 flex items-center gap-1.5 sm:right-4">
          <Link
            to="/shop"
            aria-label="Le Shop"
            title="Le Shop"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-[#0B0C12] transition hover:border-black/30 hover:bg-black hover:text-white"
          >
            <ShoppingCart size={15} />
          </Link>
          <Link
            to="/magazine"
            aria-label="Le Magazine"
            title="Le Magazine"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-[#0B0C12] transition hover:border-black/30 hover:bg-black hover:text-white"
          >
            <BookOpen size={15} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
