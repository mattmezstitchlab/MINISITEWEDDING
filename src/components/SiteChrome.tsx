import { useLocation } from 'react-router-dom';
import { useFace } from '../lib/faceDuSite';
import { useModeImmersif } from '../lib/modeImmersif';
import SiteHeader from './SiteHeader';
import BottomCapsuleNav from './BottomCapsuleNav';
import LanguetteTimeline from './LanguetteTimeline';
import NavVerticale from './NavVerticale';
import BoutonParametres from './BoutonParametres';
import FenteDocuments from './FenteDocuments';
import BoutonEtat from './BoutonEtat';
import SiteFooter from './SiteFooter';

/**
 * LA NAVIGATION DU SITE, POSÉE UNE SEULE FOIS
 *
 * Le header sert de nav et le dock du bas de repère : les deux encadrent les
 * grandes pages — accueil, univers, métiers, magazine, shop, prestataires — et
 * laissent les pages intimes sans rien : le site des mariés, l'invitation d'un
 * invité, les éditeurs et l'onboarding, où l'on entre pour faire, pas pour
 * visiter.
 */

/**
 * **Les adresses qui ne reçoivent ni header ni dock.** Depuis que tout le site
 * est en grille, ce sont **toutes les pages de contenu** : la mosaïque est la
 * navigation, et rien de permanent ne doit l'entourer. Le chrome ne vit plus que
 * sur les **outils** — l'éditeur de blocs, les paramètres, l'aperçu, le site
 * public d'un couple.
 */
const SANS_CHROME = [
  '/', // la mosaïque du monde, et son année
  '/magazine', // l'année, les jours, les mondes
  '/shop', // la boutique, en cases
  '/metiers', // les métiers, en cases
  '/profil/', // une page du réseau, en cases
  '/prestataire', // l'espace prestataire, en cases
  '/le-mariage', // le mariage, en mondes
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
  ['/profil/', 'Une page du réseau'],
  ['/prestataire', 'Espace prestataire'],
  ['/supermarriage', 'SuperShop'],
  ['/parametres', 'Paramètres'],
  ['/ripple', 'Super Ripple'],
];

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  /**
   * **Le mode immersif.** Quand une page se déclare immersive (`modeImmersif.ts`),
   * elle tient l'écran : l'image plein cadre, et la mosaïque du temps — sa
   * timeline — en bas. **Le site s'efface alors complètement** : plus de barre,
   * plus de colonne de navigation, plus de dock, plus de pied. C'est la règle du
   * nouveau magazine : rien de permanent autour de l'image, et tout ce qui n'est
   * pas l'image et la mosaïque s'ouvre à la demande, dans une feuille.
   */
  const immersif = useModeImmersif();
  /**
   * **La face change le chrome.** Sur la grille et au verso, la mosaïque est la
   * navigation : rien autour. Au **recto**, on revoit la page d'avant — avec sa
   * barre, son dock et son pied, exactement comme ils étaient.
   */
  const { face } = useFace();
  /** « / » se compare exactement — sinon, tous les chemins commenceraient par lui. */
  const sansChrome =
    face !== 'recto' &&
    SANS_CHROME.some((prefixe) => (prefixe === '/' ? pathname === '/' : pathname.startsWith(prefixe)));
  const avecChrome = !immersif && !sansChrome;
  const mention = MENTIONS.find(([prefixe]) => pathname.startsWith(prefixe))?.[1];

  if (!avecChrome) return <>{children}</>;

  return (
    <>
      {/* La barre est la même partout : le nom, le caddie, le magazine. Les
          univers, eux, se parcourent dans la bande, sous le hero. */}
      {pathname !== '/' && <SiteHeader mention={mention} />}
      {/* La nav verticale : à droite, et différente sur chaque page. */}
      <NavVerticale />
      {/* En bas à gauche : les paramètres, c'est-à-dire l'éditeur du mini-site. */}
      <BoutonParametres />
      {/* En bas à droite : le point d'état. Il s'allume, on clique, la fente sort. */}
      <BoutonEtat />
      {/* En haut, la fente : le ticket sort quand il y a quelque chose à voir. */}
      <FenteDocuments />
      {/* Le pied commun : la signature, et les portes du site. */}
      <div className="pb-24">{children}</div>
      <SiteFooter />
      {/* La languette timeline : elle sort du dock, sous toutes les pages. */}
      <LanguetteTimeline />
      <BottomCapsuleNav />
    </>
  );
}
