import { Link } from 'react-router-dom';
import { BookOpen, ShoppingCart } from 'lucide-react';
import { usePersonaSurvolee } from '../lib/personaCourant';
import { NOM_DU_SITE } from '../lib/nomDuSite';

/**
 * LA BARRE DU SITE
 *
 * Une seule ligne posée sur le hero, sans fond : **le nom**, et à droite les
 * deux portes — le caddie pour le Shop, le magazine pour le Magazine. Pas de
 * capsule : la barre laisse voir le hero, et un voile très doux tient la
 * lisibilité du blanc quand la page défile.
 *
 * **Tout suit le rôle qu'on regarde.** On survole « SUPER PHOTOGRAPHE » : le nom
 * devient le sien, et les deux portes deviennent les siennes — son Shop (les
 * pièces qui le concernent), son Magazine (les conseils qui lui parlent). On ne
 * mélange rien : c'est le rôle qui filtre, et les filtres restent sur la page
 * pour affiner.
 */

interface SiteHeaderProps {
  /** Une précision d'usage à droite du nom : « Invitation », « Prestataire »… */
  mention?: string;
}

export default function SiteHeader({ mention }: SiteHeaderProps) {
  /** Le rôle qu'on regarde, s'il y en a un : le nom et les portes sont les siens. */
  const survole = usePersonaSurvolee();
  const nom = survole?.nom ?? NOM_DU_SITE;
  const suite = survole ? `?role=${survole.id}` : '';

  return (
    <>
      {/* Le voile : il ne tient que le haut de la page, et laisse passer les clics. */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-24 bg-gradient-to-b from-black/45 to-transparent"
        aria-hidden="true"
      />

      <nav className="fixed inset-x-0 top-3 z-50 flex items-center justify-between gap-3 px-4 sm:top-4 sm:px-7">
        <Link to="/" className="flex items-baseline gap-2">
          <span
            data-nom={nom}
            className="vp-title text-[14px] font-bold italic tracking-[0.1em] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] transition-colors sm:text-[17px] sm:tracking-[0.14em]"
          >
            {nom}
          </span>
          {mention && (
            <span className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60 sm:inline">
              {mention}
            </span>
          )}
        </Link>

        {/* En haut à droite, les deux portes du site — celles du rôle regardé. */}
        <div className="flex items-center gap-2">
          <Link
            to={`/shop${suite}`}
            aria-label={survole ? `Le Shop de ${survole.nom}` : 'Le Shop'}
            title={survole ? `Le Shop de ${survole.nom}` : 'Le Shop'}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-md transition hover:border-white hover:bg-white hover:text-[#0B0C12]"
          >
            <ShoppingCart size={16} />
          </Link>
          <Link
            to={`/magazine${suite}`}
            aria-label={survole ? `Le Magazine de ${survole.nom}` : 'Le Magazine'}
            title={survole ? `Le Magazine de ${survole.nom}` : 'Le Magazine'}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-md transition hover:border-white hover:bg-white hover:text-[#0B0C12]"
          >
            <BookOpen size={16} />
          </Link>
        </div>
      </nav>
    </>
  );
}
