import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

/**
 * LE BOUTON PARAMÈTRES — EN BAS À GAUCHE, SUR TOUT LE SITE
 *
 * Il ouvre **la page de l'éditeur du mini-site** — « SUPER ÉDITEUR » — depuis
 * n'importe où : on n'a pas à retrouver son chemin dans l'accueil pour régler
 * quelque chose. Posé au-dessus du dock sur les petits écrans, à côté sur les
 * grands, il ne cache jamais la capsule.
 */

export default function BoutonParametres() {
  return (
    <Link
      to="/parametres"
      aria-label="Paramètres — l’éditeur du mini-site"
      title="Paramètres · l’éditeur du mini-site"
      className="vp-press fixed bottom-20 left-3 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[#0B0C12] text-white no-underline shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition hover:scale-105 sm:bottom-6 sm:left-6"
    >
      <Settings size={16} />
    </Link>
  );
}
