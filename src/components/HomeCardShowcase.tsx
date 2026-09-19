import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import WeddingCard from './WeddingCard';
import { EMPTY_CARD, type CardData } from '../lib/weddingCard';

/**
 * LA CARTE, AVANT LE SITE
 *
 * Sous le hero, il n'y a plus un téléphone mais une carte : celle qu'on n'a pas
 * encore remplie. Son grand visuel est celui de l'univers vierge — floral, sans
 * personne — et « Votre nom » dit exactement ce qu'il reste à faire. Les
 * informations qu'on y écrit ouvrent le mini-site : on ne les écrira pas deux
 * fois.
 */

/** La carte d'exemple : vide, à l'image de celle qui reste à créer. */
const CARTE_DEMO: CardData = { ...EMPTY_CARD };

export default function HomeCardShowcase() {
  return (
    <section className="relative z-20 bg-white px-5 pb-20 sm:px-8 sm:pb-28">
      <div className="mx-auto grid max-w-6xl items-center gap-10 pt-16 sm:pt-20 lg:grid-cols-2 lg:gap-16">
        <div className="mx-auto max-w-md text-center lg:mx-0 lg:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--vp-muted)]">
            Votre carte
          </span>
          <h2
            className="vp-title mt-3 text-[#0B0C12]"
            style={{ fontSize: 'clamp(1.9rem, 4.2vw, 3.1rem)', lineHeight: 1.08 }}
          >
            La carte d’abord.
            <br />
            <span className="text-black/40">Le mini-site suit.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-[#0B0C12]/60 lg:mx-0">
            Quelques questions — votre nom, votre ville, la date — et la carte ouvre le mini-site de
            votre mariage. Vos informations y sont déjà écrites : le programme, les lieux, le RSVP
            et la cagnotte se remplissent depuis ce que vous avez dit.
          </p>
          <div className="mt-7 flex flex-col items-center gap-3 lg:items-start">
            <Link to="/creer" className="vp-btn vp-press !px-8 !py-3.5">
              Créer ma carte <ArrowRight size={16} />
            </Link>
            <p className="text-[12.5px] leading-snug text-[var(--vp-muted)]">
              Aucun univers à choisir avant : il se découvre sur votre site, et se change à tout
              moment dans l’éditeur.
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[356px]">
          <WeddingCard card={CARTE_DEMO} />
        </div>
      </div>
    </section>
  );
}
