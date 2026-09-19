import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PhoneFrame from './phone/PhoneFrame';
import VendorPhoneScreen from './phone/VendorPhoneScreen';
import { contentFor } from '../lib/universeContent';
import { previewPath } from '../lib/previewSite';
import { styleById, type WeddingStyle } from '../lib/weddingStyles';
import { signatureFor, signatureLabel } from '../lib/themeSignatures';

/**
 * LE DÉFILÉ DES MINI-SITES
 *
 * Sous l'éditeur, les téléphones défilent : chacun ouvre le vrai mini-site de
 * son univers — le même aperçu que dans l'éditeur, en plus petit — avec le
 * visuel plein écran et le titre en grand. Trois d'entre eux passent de l'autre
 * côté du comptoir : ce que voit le prestataire le jour J.
 */

/** Ce que le défilé met de côté : on ne montre que le visuel et son titre. */
const HORS_ECRAN = [
  'histoire',
  'programme',
  'lieux',
  'infos',
  'rsvp',
  'packages',
  'cagnotte',
  'galerie',
  'faq',
  'contact',
  'footer',
];

/** La fenêtre du mini-site : la largeur d'un vrai téléphone, mise à l'échelle. */
const SITE_W = 390;
const SITE_H = 844;

type Role = 'invite' | 'maries' | 'prestataire';

const ROLE_LABEL: Record<Role, string> = {
  invite: 'Écran invité',
  maries: 'Écran mariés',
  prestataire: 'Écran prestataire',
};

/** Le tour du catalogue : huit univers, et les trois côtés du mariage. */
const RAIL: Array<{ styleId: string; role: Role }> = [
  { styleId: 'vegas', role: 'invite' },
  { styleId: 'laverie', role: 'prestataire' },
  { styleId: 'new-york', role: 'maries' },
  { styleId: 'cinema', role: 'invite' },
  { styleId: 'corse', role: 'prestataire' },
  { styleId: 'club', role: 'maries' },
  { styleId: 'traditionnel', role: 'invite' },
  { styleId: 'chateau-moderne', role: 'prestataire' },
];

/**
 * Le mini-site dans le téléphone : le vrai aperçu, monté à la largeur d'un
 * téléphone puis réduit à la taille du châssis. Le visuel plein écran et le
 * titre restent ceux de l'univers — seuls les blocs du dessous sont écartés.
 */
function MiniSiteWindow({ style }: { style: WeddingStyle }) {
  const boite = useRef<HTMLDivElement>(null);
  const [echelle, setEchelle] = useState(0.66);

  useEffect(() => {
    const el = boite.current;
    if (!el) return;
    const mesurer = () => setEchelle(el.clientWidth / SITE_W);
    mesurer();
    const observateur = new ResizeObserver(mesurer);
    observateur.observe(el);
    return () => observateur.disconnect();
  }, []);

  const content = contentFor(style);
  const src = previewPath({
    styleId: style.id,
    heroTitle: content.hero.title,
    heroSubtitle: content.hero.subtitle,
    hiddenSections: HORS_ECRAN,
    // Pas de capsule de navigation dans le châssis : la Dynamic Island gagne.
    hideHeader: true,
  });

  return (
    <div ref={boite} className="absolute inset-0 overflow-hidden bg-white">
      <iframe
        key={src}
        title={`Mini-site · ${style.name}`}
        src={src}
        loading="lazy"
        tabIndex={-1}
        className="pointer-events-none border-0 bg-white"
        style={{
          width: SITE_W,
          height: SITE_H,
          transform: `scale(${echelle})`,
          transformOrigin: 'top left',
        }}
      />
    </div>
  );
}

export default function MiniSiteRail() {
  const scroller = useRef<HTMLDivElement>(null);
  const [actif, setActif] = useState(0);
  const reduire = useReducedMotion();

  /** Un pas de défilement : une carte et son intervalle. */
  const pas = () => {
    const premier = scroller.current?.children[0] as HTMLElement | undefined;
    return premier ? premier.offsetWidth + 24 : 300;
  };

  const aller = (index: number) => {
    const el = scroller.current;
    if (!el) return;
    const cible = Math.max(0, Math.min(RAIL.length - 1, index));
    const carte = el.children[cible] as HTMLElement | undefined;
    if (carte) el.scrollTo({ left: carte.offsetLeft - el.offsetLeft, behavior: 'smooth' });
  };

  /** Le défilé avance seul — et se met en pause dès qu'on y touche. */
  useEffect(() => {
    if (reduire) return;
    const el = scroller.current;
    if (!el) return;
    let pause = false;
    const arreter = () => { pause = true; };
    const reprendre = () => { pause = false; };

    el.addEventListener('pointerenter', arreter);
    el.addEventListener('pointerleave', reprendre);
    el.addEventListener('pointerdown', arreter);
    window.addEventListener('pointerup', reprendre);

    const timer = window.setInterval(() => {
      if (pause) return;
      const max = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= max - 8) el.scrollTo({ left: 0, behavior: 'smooth' });
      else el.scrollBy({ left: pas(), behavior: 'smooth' });
    }, 3800);

    return () => {
      window.clearInterval(timer);
      el.removeEventListener('pointerenter', arreter);
      el.removeEventListener('pointerleave', reprendre);
      el.removeEventListener('pointerdown', arreter);
      window.removeEventListener('pointerup', reprendre);
    };
  }, [reduire]);

  const handleScroll = () => {
    const el = scroller.current;
    if (!el) return;
    let proche = 0;
    let min = Infinity;
    Array.from(el.children).forEach((enfant, i) => {
      const noeud = enfant as HTMLElement;
      const distance = Math.abs(noeud.offsetLeft - el.offsetLeft - el.scrollLeft);
      if (distance < min) {
        min = distance;
        proche = i;
      }
    });
    setActif(proche);
  };

  return (
    <section
      id="mini-sites"
      className="relative overflow-hidden bg-[#0B0C12] px-5 py-20 text-white sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white/70">
            Le mini-site, écran par écran
          </span>
          <h2
            className="vp-title mt-3"
            style={{ fontSize: 'clamp(2rem, 4.6vw, 3.4rem)', lineHeight: 1.06 }}
          >
            Le vrai site, dans la main.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-white/65">
            Chaque téléphone ouvre le mini-site d’un univers — le même aperçu que dans l’éditeur :
            le visuel plein écran, le titre en grand, et rien d’autre.
          </p>
        </div>

        <div className="relative mt-12">
          <div
            ref={scroller}
            onScroll={handleScroll}
            className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 pt-1"
          >
            {RAIL.map((item, i) => {
              const style = styleById(item.styleId);
              const content = contentFor(style);
              return (
                <div
                  key={`${item.styleId}-${item.role}`}
                  className="w-[264px] shrink-0 snap-center sm:w-[292px]"
                  aria-label={`${ROLE_LABEL[item.role]} · ${style.name} · ${signatureLabel(item.styleId)}`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, delay: (i % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <PhoneFrame tint={style.accent}>
                      {item.role === 'prestataire' ? (
                        <VendorPhoneScreen
                          style={style}
                          content={content}
                          mission={style.humanMissions[0]}
                          signature={signatureFor(item.styleId)}
                        />
                      ) : (
                        <MiniSiteWindow style={style} />
                      )}
                    </PhoneFrame>
                  </motion.div>

                  <div className="mt-4 px-1 text-center">
                    <div className="text-[13px] font-bold text-white">{style.name}</div>
                    {/* Le geste de l'univers : c'est ce qu'on vient voir. */}
                    <div className="mt-1 text-[11.5px] font-semibold" style={{ color: style.accent }}>
                      {signatureLabel(item.styleId)}
                    </div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                      {ROLE_LABEL[item.role]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Le pilotage : on peut laisser défiler, ou y aller à la main */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => aller(actif - 1)}
              disabled={actif === 0}
              aria-label="Mini-site précédent"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition hover:bg-white/15 disabled:opacity-30"
            >
              <ChevronLeft size={15} />
            </button>

            <div className="flex items-center gap-1.5">
              {RAIL.map((item, i) => (
                <button
                  key={`${item.styleId}-${item.role}`}
                  type="button"
                  onClick={() => aller(i)}
                  aria-label={`Aller à ${styleById(item.styleId).name}`}
                  className={`h-1.5 rounded-full transition-all ${
                    actif === i ? 'w-6 bg-white' : 'w-1.5 bg-white/25'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => aller(actif + 1)}
              disabled={actif === RAIL.length - 1}
              aria-label="Mini-site suivant"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition hover:bg-white/15 disabled:opacity-30"
            >
              <ChevronRight size={15} />
            </button>
          </div>

          <p className="mx-auto mt-5 max-w-xl text-center text-[12px] leading-snug text-white/45">
            Chaque aperçu est le vrai mini-site. Et sous le défilé, les prestataires qui font
            tourner ces univers.
          </p>
        </div>
      </div>
    </section>
  );
}
