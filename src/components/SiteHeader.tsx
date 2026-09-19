import { Link } from 'react-router-dom';
import MenuProfil from './MenuProfil';
import { usePersonaSurvolee } from '../lib/personaCourant';
import { NOM_DU_SITE } from '../lib/nomDuSite';

/**
 * LA BARRE DU SITE
 *
 * Une seule ligne posée sur le hero, sans fond : **le nom**, et à droite **le
 * profil** — une seule entrée, qui ouvre le menu du site. Le Shop et le
 * Magazine, eux, sont dans la nav verticale, sur toutes les pages, et ils
 * suivent le rôle survolé : ils n'ont pas besoin d'être en double ici.
 *
 * **Tout suit le rôle qu'on regarde.** On survole « SUPER PHOTOGRAPHE » : le nom
 * devient le sien, et ses deux portes deviennent les siennes — son Shop, son
 * Magazine. On ne mélange rien : c'est le rôle qui filtre.
 */

interface SiteHeaderProps {
  /** Une précision d'usage à droite du nom : « Invitation », « Prestataire »… */
  mention?: string;
}

export default function SiteHeader({ mention }: SiteHeaderProps) {
  /** Le rôle qu'on regarde, s'il y en a un : le nom et les portes sont les siens. */
  const survole = usePersonaSurvolee();
  const nom = survole?.nom ?? NOM_DU_SITE;

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

        {/* En haut à droite, une seule entrée : le profil — et tout part de là. */}
        <MenuProfil />
      </nav>
    </>
  );
}
