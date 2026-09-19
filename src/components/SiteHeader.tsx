import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UnifiedUniverseMenu from './UnifiedUniverseMenu';
import VendorDomainMenu from './VendorDomainMenu';
import type { WeddingStyle } from '../lib/weddingStyles';

/**
 * LE HEADER DU SITE
 *
 * La même barre partout : VOWS à gauche, UNIVERS & MÉTIERS, le Shop et le
 * Magazine à droite. Elle sert de navigation au site — chaque page se contente
 * donc de son contenu, et son hero peut se libérer des rappels de navigation.
 *
 * Sur l'accueil, choisir un univers change le hero (`onSelectStyle`) ; ailleurs,
 * le choix ouvre la page entière de cet univers (`/le-mariage/<univers>`).
 */

interface SiteHeaderProps {
  /** L'univers actuellement montré, s'il y en a un. */
  selectedStyleId?: string | null;
  /** Choisir un univers sans quitter la page (l'accueil). Sinon, on navigue. */
  onSelectStyle?: (style: WeddingStyle | null) => void;
  /** Une précision d'usage à droite du logo : « Invitation », « Prestataire »… */
  mention?: string;
}

export default function SiteHeader({ selectedStyleId = null, onSelectStyle, mention }: SiteHeaderProps) {
  const navigate = useNavigate();
  // Un seul panneau de menu ouvert à la fois : Univers ou Métiers.
  const [menuOuvert, setMenuOuvert] = useState<'univers' | 'metiers' | null>(null);

  const choisir = (style: WeddingStyle | null) => {
    if (onSelectStyle) {
      onSelectStyle(style);
      return;
    }
    // Ailleurs, un univers s'ouvre en entier : sa page, sa playlist, son ticket.
    if (style) navigate(`/le-mariage/${style.id}`);
  };

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

        {/* La bande : les univers, les métiers, le magazine */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <UnifiedUniverseMenu
            selectedStyleId={selectedStyleId}
            onSelectStyle={choisir}
            open={menuOuvert === 'univers'}
            onOpenChange={(ouvert) => setMenuOuvert(ouvert ? 'univers' : null)}
          />
          <VendorDomainMenu
            onSelectStyle={choisir}
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
