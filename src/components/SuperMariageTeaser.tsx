import { Link } from 'react-router-dom';
import { ArrowRight, ScanBarcode, ShoppingCart } from 'lucide-react';
import { MAGASIN, PACKAGES, RAYONS, euros } from '../lib/superMariage';

/**
 * SUPERMARIAGE — LE BANDEAU DU MAGASIN
 *
 * Le mini-site du Supermarché 22H a son ticket de caisse ; ce bandeau ouvre le
 * magasin en vrai : on y coche ses horaires et ses métiers, et le ticket se
 * calcule tout seul. Un aperçu de ticket, ici, qui donne envie d'aller remplir
 * le caddie.
 */

const TICKET_APERCU = [
  ['22:17', 'Cérémonie — rayon 7'],
  ['22:30', 'Cocktail — surgelés'],
  ['23:00', 'Dîner — caisse 3'],
];

export default function SuperMariageTeaser() {
  const articles = RAYONS.reduce((n, r) => n + r.articles.length, 0);

  return (
    <section className="bg-[#0A0A0A] py-16 text-white">
      <div className="vp-page grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center">
        <div>
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-black"
            style={{ background: '#00FF88' }}
          >
            <ShoppingCart size={12} /> Nouveau rayon
          </span>

          <h2 className="mt-5 font-black leading-[1.02] tracking-[-0.03em]" style={{ fontSize: 'clamp(2rem, 4.4vw, 3.4rem)' }}>
            SuperMariage
          </h2>
          <p className="mt-4 max-w-[560px] text-[14.5px] leading-relaxed text-white/65">
            Le mariage se compose comme une liste de courses : {RAYONS.length} rayons, {articles}{' '}
            articles, {PACKAGES.length} menus. On coche les horaires, on prend les métiers, on ajoute
            les petits prix — et on passe à la caisse. Le ticket de caisse se calcule ligne par ligne,
            comme au rayon 7.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            <Link
              to="/supermarriage"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-bold text-black no-underline transition hover:brightness-110"
              style={{ background: '#00FF88' }}
            >
              <ScanBarcode size={14} /> Faire mes courses
            </Link>
            <Link
              to="/prestataire"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-[13px] font-semibold text-white/80 no-underline transition hover:border-white/40"
            >
              L’éditeur des métiers <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* L'aperçu du ticket */}
        <div className="mx-auto w-full max-w-[340px]">
          <div className="rounded-t-[10px] bg-[#171717] px-4 py-2">
            <div className="mx-auto h-1 w-24 rounded-full bg-black/60" />
          </div>
          <div className="bg-[#FFFEF7] p-5 font-mono text-[11.5px] leading-relaxed text-black shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
            <div className="text-center font-black tracking-[0.18em]">{MAGASIN.nom}</div>
            <div className="mt-1 text-center text-[9.5px] uppercase tracking-[0.14em] text-black/45">
              {MAGASIN.slogan}
            </div>
            <div className="my-3 border-y border-dashed border-black/20 py-2 text-center text-[9.5px]">
              {MAGASIN.ville} · {MAGASIN.caisse}
            </div>

            {TICKET_APERCU.map(([heure, titre]) => (
              <div key={heure} className="flex justify-between gap-3 border-b border-dotted border-black/15 py-1.5">
                <span className="font-bold">{heure}</span>
                <span className="min-w-0 flex-1 truncate text-right text-black/65">{titre}</span>
              </div>
            ))}

            <div className="mt-3 flex items-baseline justify-between border-t-2 border-black pt-2">
              <span className="text-[12px] font-black">TOTAL</span>
              <span className="text-[14px] font-black tabular-nums">
                {euros(350 + 900 + 1200 + 2400)}
              </span>
            </div>
            <div className="mt-1 text-[9px] uppercase tracking-widest text-black/40">
              Exemple · vos coches font le vrai ticket
            </div>
          </div>
          <div className="h-3 rotate-180 bg-[radial-gradient(circle_at_6px_0px,_transparent_6px,_#FFFEF7_6px)] bg-[length:12px_12px] bg-repeat-x" />
        </div>
      </div>
    </section>
  );
}
