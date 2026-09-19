import { useEffect, useState } from 'react';
import {
  DUREE_OUVERTURE, DUREE_OUVERTURE_SANS_MOUVEMENT, marquerOuvertureVue, ouvertureDejaVue,
} from '../lib/ouverture';
import { usePrefersReducedMotion } from '../lib/useReducedMotion';

/**
 * L'OUVERTURE — LE GÉNÉRIQUE DU SITE
 *
 * À l'arrivée, le nom prend tout l'écran, une lumière le traverse, puis il se
 * fond : l'ouverture d'un film, en trois secondes. Ensuite seulement la page
 * apparaît, et la première chose qu'elle demande, c'est **qui vous êtes**.
 *
 * Elle ne se joue qu'une fois par visite (`sessionStorage`) : on ne la revoit
 * pas à chaque page. Un clic, une touche ou « Passer » l'écourte, et qui a
 * demandé moins d'animations ne la voit qu'un instant — sans lumière qui
 * traverse, sans attente.
 */

export default function OuvertureSite() {
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(() => !ouvertureDejaVue());
  const [partant, setPartant] = useState(false);

  // Le générique se termine tout seul : on ferme, et on se souvient.
  useEffect(() => {
    if (!visible) return;
    const duree = reduced ? DUREE_OUVERTURE_SANS_MOUVEMENT : DUREE_OUVERTURE;
    const fin = window.setTimeout(() => setPartant(true), duree);
    return () => window.clearTimeout(fin);
  }, [visible, reduced]);

  // La page reprend la main dès que la lumière a fini de passer.
  useEffect(() => {
    if (!partant) return;
    const disparait = window.setTimeout(() => {
      setVisible(false);
      marquerOuvertureVue();
    }, 620);
    return () => window.clearTimeout(disparait);
  }, [partant]);

  if (!visible) return null;

  return (
    <div
      role="presentation"
      onClick={() => setPartant(true)}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') setPartant(true);
      }}
      className={`fixed inset-0 z-[70] flex flex-col items-center justify-center bg-[#0B0C12] px-6 transition-opacity duration-[600ms] ${
        partant ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <span className="vp-title select-none text-center text-white" style={{ fontSize: 'clamp(2.2rem, 9vw, 7rem)', lineHeight: 1 }}>
        <span className={reduced ? '' : 'vp-lumiere'} data-ouverture="nom">
          SUPER MARIAGE
        </span>
      </span>
      <span className="mt-5 font-mono text-[10px] uppercase tracking-[0.34em] text-white/45">
        L’espace de votre union
      </span>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setPartant(true);
        }}
        className="absolute bottom-6 right-6 rounded-full border border-white/25 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 transition hover:border-white hover:text-white"
      >
        Passer
      </button>
    </div>
  );
}
