import { useLocation } from 'react-router-dom';
import SiteHeader from './SiteHeader';
import BottomCapsuleNav from './BottomCapsuleNav';

/**
 * LA NAVIGATION DU SITE, POSÉE UNE SEULE FOIS
 *
 * Le header sert de nav et le dock du bas de repère : les deux encadrent les
 * grandes pages — accueil, univers, métiers, magazine, shop, prestataires — et
 * laissent les pages intimes sans rien : le site des mariés, l'invitation d'un
 * invité, les éditeurs et l'onboarding, où l'on entre pour faire, pas pour
 * visiter.
 */

/** Les adresses qui ne reçoivent ni header ni dock. */
const SANS_CHROME = [
  '/p/', // le site des mariés, tel que leurs invités le voient
  '/apercu', // la même page, dans une fenêtre d'aperçu
  '/rejoindre/', // l'invitation d'un invité
  '/mariage/', // l'espace des personnes du mariage
  '/editeur/', // l'éditeur du couple
  '/creer', // l'onboarding
  '/carte', // l'atelier de sa carte
  '/generer', // la fabrication du site
  '/generation',
  '/theater', // le défilé plein écran
  '/timeline',
  '/aime',
  '/taxonomie',
];

/** Ce que la barre annonce à côté du logo, selon la page. */
const MENTIONS: Array<[string, string]> = [
  ['/magazine', 'Magazine'],
  ['/shop', 'Shop'],
  ['/le-mariage', 'Le mariage'],
  ['/metiers/', 'Les métiers'],
  ['/prestataire', 'Espace prestataire'],
  ['/supermarriage', 'SuperMariage'],
];

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const avecChrome = !SANS_CHROME.some((prefixe) => pathname.startsWith(prefixe));
  const mention = MENTIONS.find(([prefixe]) => pathname.startsWith(prefixe))?.[1];

  if (!avecChrome) return <>{children}</>;

  return (
    <>
      {/* Sur l'accueil, la barre vient de la page : c'est elle qui change
          l'univers montré dans le hero. Partout ailleurs, elle est ici. */}
      {pathname !== '/' && <SiteHeader mention={mention} />}
      {/* Le dock est fixe : la page laisse la place au bas. */}
      <div className="pb-24">{children}</div>
      <BottomCapsuleNav />
    </>
  );
}
