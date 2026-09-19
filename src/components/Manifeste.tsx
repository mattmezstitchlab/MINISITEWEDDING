import { MANIFESTE } from '../lib/manifeste';

/**
 * LE MANIFESTE — L'ÉDITO, SOUS LE HERO
 *
 * Il dit le concept en trois paragraphes, avant que le site ne le montre : les
 * portes de chacun, les trois temps (passé, présent, futur), et le miroir —
 * visible pour soi, invisible pour les autres. Posé sur blanc, en colonne
 * étroite, comme un édito de magazine.
 */

export default function Manifeste() {
  return (
    <section id="manifeste" className="bg-white pb-16 pt-14 sm:pb-20 sm:pt-20">
      <div className="vp-page max-w-[820px]">
        <span className="vp-eyebrow">{MANIFESTE.eyebrow}</span>
        <h2
          className="vp-title mt-4 text-[#0B0C12]"
          style={{ fontSize: 'clamp(1.6rem, 3.4vw, 2.5rem)', lineHeight: 1.14 }}
        >
          {MANIFESTE.titre}
        </h2>

        <div className="mt-7 grid gap-5 border-t border-black/10 pt-7 sm:grid-cols-2 sm:gap-x-10">
          {MANIFESTE.paragraphes.map((paragraphe) => (
            <p key={paragraphe.slice(0, 24)} className="text-[15px] leading-relaxed text-black/70">
              {paragraphe}
            </p>
          ))}
        </div>

        <div className="mt-8 font-mono text-[10px] uppercase tracking-[0.24em] text-black/35">
          {MANIFESTE.signature}
        </div>
      </div>
    </section>
  );
}
