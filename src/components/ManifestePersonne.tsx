import { manifesteDeLaPersonne, type CarteChoisie, type FaitsDeLaPersonne } from '../lib/selection';

/**
 * LE MANIFESTE DE LA PERSONNE — LE MÊME TEXTE, VU DE SA PLACE
 *
 * Sous son hero : sa porte (« celle de Clara s'appelle fleuriste »), ce que
 * l'accueil a retenu d'elle, et les trois temps du manifeste — le passé qui
 * raconte, le présent qui prépare, le futur qui imagine. Tout est déjà écrit :
 * la page ne fait que le nommer.
 */

interface ManifestePersonneProps {
  faits: FaitsDeLaPersonne;
  selection?: CarteChoisie[];
}

export default function ManifestePersonne({ faits, selection = [] }: ManifestePersonneProps) {
  const manifeste = manifesteDeLaPersonne(faits, selection);

  return (
    <section id="manifeste" className="bg-white pb-14 pt-14 sm:pb-16 sm:pt-16">
      <div className="vp-page max-w-[820px]">
        <span className="vp-eyebrow">{manifeste.eyebrow}</span>
        <h2
          className="vp-title mt-4 text-[#0B0C12]"
          style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2.3rem)', lineHeight: 1.14 }}
        >
          {manifeste.titre}
        </h2>

        <div className="mt-7 grid gap-5 border-t border-black/10 pt-7 sm:grid-cols-2 sm:gap-x-10">
          {manifeste.paragraphes.map((paragraphe) => (
            <p key={paragraphe.slice(0, 24)} className="text-[15px] leading-relaxed text-black/70">
              {paragraphe}
            </p>
          ))}
        </div>

        <div className="mt-8 font-mono text-[10px] uppercase tracking-[0.24em] text-black/35">
          {manifeste.signature}
        </div>
      </div>
    </section>
  );
}
