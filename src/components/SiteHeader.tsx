import { useState } from 'react';
import { Link } from 'react-router-dom';
import VendorDomainMenu from './VendorDomainMenu';

/**
 * LE HEADER DU SITE
 *
 * La même barre partout : VOWS à gauche, les Métiers, le Shop et le Magazine à
 * droite. Le menu déroulant des univers n'y est plus : les univers se
 * parcourent dans la bande du hero, toujours au même endroit, sur la page qui
 * les montre (`BandeauHero`). Le header reste une barre courte, et il ne
 * change plus de rôle selon la page.
 */

interface SiteHeaderProps {
  /** Une précision d'usage à droite du logo : « Invitation », « Prestataire »… */
  mention?: string;
}

export default function SiteHeader({ mention }: SiteHeaderProps) {
  const [menuOuvert, setMenuOuvert] = useState<'metiers' | null>(null);

  return (
    <nav className="fixed top-3 left-1/2 z-50 w-[calc(100%-1.25rem)] max-w-5xl -translate-x-1/2 sm:top-4">
      <div className="flex items-center justify-between gap-3 rounded-[26px] bg-white px-4 py-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] ring-1 ring-black/5 sm:px-5">
        <Link to="/" className="flex items-center gap-2">
          <span className="vp-title text-[18px] font-bold italic tracking-wider text-[#0B0C12]">VOWS</span>
          {mention && (
            <span className="hidden text-[11.5px] font-semibold uppercase tracking-[0.18em] text-[#0B0C12]/45 sm:inline">
              {mention}
            </span>
          )}
        </Link>

        {/* La bande : les métiers, le shop, le magazine */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <VendorDomainMenu
            open={menuOuvert === 'metiers'}
            onOpenChange={(ouvert) => setMenuOuvert(ouvert ? 'metiers' : null)}
          />
          <Link
            to="/shop"
            className="hidden rounded-full border border-black/10 bg-white/95 px-3.5 py-1.5 text-[13px] font-semibold text-[#0B0C12] shadow-sm backdrop-blur-md transition hover:border-black/30 hover:bg-white sm:inline-block"
          >
            Shop
          </Link>
          <Link
            to="/magazine"
            className="rounded-full border border-black/10 bg-white/95 px-4 py-1.5 text-[13px] font-semibold text-[#0B0C12] shadow-sm backdrop-blur-md transition hover:border-black/30 hover:bg-white"
          >
            Magazine
          </Link>
        </div>
      </div>
    </nav>
  );
}
