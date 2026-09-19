import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PhoneFrame from './phone/PhoneFrame';
import GuestPhoneScreen from './phone/GuestPhoneScreen';
import CouplePhoneScreen from './phone/CouplePhoneScreen';
import VendorPhoneScreen from './phone/VendorPhoneScreen';
import { contentFor } from '../lib/universeContent';
import type { WeddingStyle } from '../lib/weddingStyles';

/**
 * LES TROIS ÉCRANS D'UN UNIVERS
 *
 * Un seul mariage, trois téléphones : celui de l'invité, celui des mariés,
 * celui du prestataire. Ils se font face et défilent horizontalement — le même
 * contenu, lu par trois personnes différentes.
 */

const SCREENS = [
  {
    id: 'invite',
    label: 'Invité',
    caption: 'L’invitation, le oui, la cagnotte et son régime alimentaire.',
  },
  {
    id: 'maries',
    label: 'Mariés',
    caption: 'Le cockpit : réponses reçues, cagnotte, régimes transmis, logistique.',
  },
  {
    id: 'prestataire',
    label: 'Prestataire',
    caption: 'La fiche mission : arrivée, accès, contraintes alimentaires, créneaux.',
  },
] as const;

export default function UniversePhoneScreens({ currentStyle }: { currentStyle: WeddingStyle }) {
  const content = contentFor(currentStyle);
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scrollTo = (index: number) => {
    const el = scroller.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(SCREENS.length - 1, index));
    const card = el.children[clamped] as HTMLElement | undefined;
    if (card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: 'smooth' });
  };

  const handleScroll = () => {
    const el = scroller.current;
    if (!el) return;
    let closest = 0;
    let min = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const node = child as HTMLElement;
      const distance = Math.abs(node.offsetLeft - el.offsetLeft - el.scrollLeft);
      if (distance < min) {
        min = distance;
        closest = i;
      }
    });
    setActive(closest);
  };

  return (
    <section className="relative overflow-hidden border-b border-black/5 bg-white py-16 text-[#0B0C12] sm:py-24">
      <div className="vp-page">
        {/* Le pitch des trois écrans */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--vp-muted)]">
            Un univers · {currentStyle.name}
          </div>
          <h2
            className="vp-title mt-3 text-[#0B0C12]"
            style={{ fontSize: 'clamp(1.9rem, 4.2vw, 3.1rem)', lineHeight: 1.1 }}
          >
            Trois téléphones.<br />
            <span className="text-black/40">Le même jour, vu par chacun.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-[#0B0C12]/60">
            La cagnotte, les réponses, les allergènes et les informations pratiques vivent au même
            endroit — chaque personne n’en voit que ce qui la concerne.
          </p>
        </div>

        {/* Les trois téléphones, en défilement horizontal */}
        <div className="relative mt-10">
          <div
            ref={scroller}
            onScroll={handleScroll}
            className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto px-1 pb-2 pt-1 sm:gap-7"
          >
            {SCREENS.map((screen) => (
              <div
                key={screen.id}
                className="w-[268px] shrink-0 snap-start sm:w-[300px]"
                aria-label={`Écran ${screen.label}`}
              >
                <PhoneFrame tint={currentStyle.accent}>
                  {screen.id === 'invite' && <GuestPhoneScreen style={currentStyle} content={content} />}
                  {screen.id === 'maries' && <CouplePhoneScreen style={currentStyle} content={content} />}
                  {screen.id === 'prestataire' && (
                    <VendorPhoneScreen
                      style={currentStyle}
                      content={content}
                      mission={currentStyle.humanMissions[0]}
                    />
                  )}
                </PhoneFrame>

                <div className="mt-4 px-1 text-center">
                  <div className="text-[13px] font-bold text-[#0B0C12]">Écran {screen.label}</div>
                  <p className="mt-1 text-[12px] leading-snug text-[var(--vp-muted)]">{screen.caption}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Le pilotage du défilement */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => scrollTo(active - 1)}
              disabled={active === 0}
              aria-label="Écran précédent"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-[#0B0C12] transition hover:border-black disabled:opacity-30"
            >
              <ChevronLeft size={15} />
            </button>

            <div className="flex items-center gap-1.5">
              {SCREENS.map((screen, i) => (
                <button
                  key={screen.id}
                  type="button"
                  onClick={() => scrollTo(i)}
                  aria-label={`Aller à l’écran ${screen.label}`}
                  className={`h-1.5 rounded-full transition-all ${
                    active === i ? 'w-6 bg-black' : 'w-1.5 bg-black/20'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollTo(active + 1)}
              disabled={active === SCREENS.length - 1}
              aria-label="Écran suivant"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-[#0B0C12] transition hover:border-black disabled:opacity-30"
            >
              <ChevronRight size={15} />
            </button>
          </div>

          <div className="mt-3 text-center font-mono text-[10.5px] uppercase tracking-wider text-black/35">
            Faites défiler à l’horizontal
          </div>
        </div>
      </div>
    </section>
  );
}
