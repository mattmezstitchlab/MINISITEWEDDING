import { Link } from 'react-router-dom';
import LogoSuperMariage from './LogoSuperMariage';
import { ASSOCIATION, SIGNATURE_EDITEUR } from '../lib/charte';

/**
 * LE PIED DE PAGE COMMUN — LE MÊME PARTOUT
 *
 * Un seul pied, sur toutes les pages qui reçoivent la navigation : la marque, la
 * **signature** (le fondateur et l'association), et les portes du site. Les
 * pages intimes (le site des mariés, l'invitation, les éditeurs) n'en ont pas :
 * on y entre pour faire, pas pour visiter.
 *
 * Il ne dit rien de nouveau : il dit **qui signe**, et par où sortir.
 */

const PORTES: Array<{ label: string; to: string }> = [
  { label: 'Le magazine', to: '/magazine' },
  { label: 'Le shop', to: '/shop' },
  { label: 'Le mariage', to: '/le-mariage' },
  { label: 'La timeline', to: '/timeline' },
  { label: 'Le footer', to: '/footer' },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-black/8 bg-white">
      <div className="vp-page grid gap-8 py-10 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] sm:items-start">
        <div>
          <Link to="/" className="flex items-center gap-2 no-underline">
            <LogoSuperMariage taille={20} className="shrink-0 text-black/80" />
            <span className="vp-title text-[17px] font-bold italic tracking-wider text-black/85">
              SUPER MARIAGE
            </span>
          </Link>
          <p className="mt-3 max-w-[420px] text-[12.5px] leading-relaxed text-black/55">
            Mille mariages, jamais marié, pas d’enfants : ce magazine tient ce qu’il a vu.
          </p>
          <p className="mt-3 font-mono text-[9.5px] uppercase tracking-[0.2em] text-black/35">
            {SIGNATURE_EDITEUR} · {ASSOCIATION}
          </p>
        </div>

        <nav aria-label="Les portes du site" className="flex flex-wrap gap-x-6 gap-y-2">
          {PORTES.map((porte) => (
            <Link
              key={porte.to}
              to={porte.to}
              className="text-[12.5px] font-semibold text-black/60 no-underline transition hover:text-black"
            >
              {porte.label}
            </Link>
          ))}
        </nav>

        <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-black/35 sm:text-right">
          Le mariage se vit.
          <br />
          Il ne s’administre pas.
        </p>
      </div>
    </footer>
  );
}
