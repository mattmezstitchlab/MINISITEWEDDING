import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ALL_STYLES } from '../lib/weddingStyles';
import { aPartirDe, gesteDe } from '../lib/weddingPage';

/**
 * LES AUTRES UNIVERS — CHACUN SA PAGE
 *
 * La bande d'iPhones horizontale a quitté la page : à la place, les vingt-quatre
 * univers, en cartes, chacune menant à sa page entière — le même article, le même
 * programme, la même playlist, le même récap, avec son magasin à elle.
 *
 * L'univers qu'on est en train de lire est marqué « Vous êtes ici ».
 */

export default function UniversPagesGrid({ currentStyleId }: { currentStyleId: string }) {
  return (
    <section id="univers" className="border-t border-white/10 bg-[#0A0A0A] px-6 py-20 text-white sm:py-24">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
              Les autres univers
            </span>
            <h2
              className="vp-title mt-3 max-w-[760px] text-white"
              style={{ fontSize: 'clamp(1.9rem, 4.6vw, 3.2rem)', lineHeight: 1.05 }}
            >
              Chaque univers a sa page entière.
            </h2>
          </div>
          <p className="max-w-[420px] text-[13.5px] leading-relaxed text-white/60">
            Le même article, le même programme, la même playlist, le même récap en ticket — et son
            magasin : ses moments, ses trois métiers, ses plats, ses tarifs, sa caisse.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {ALL_STYLES.map((style) => {
            const ici = style.id === currentStyleId;
            const geste = gesteDe(style.id);
            return (
              <Link
                key={style.id}
                to={ici ? '#' : `/le-mariage/${style.id}`}
                aria-current={ici ? 'page' : undefined}
                className={`group relative block overflow-hidden rounded-[18px] no-underline transition ${
                  ici ? 'ring-2 ring-white/70' : 'hover:-translate-y-1'
                }`}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
                  <img
                    src={style.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  <span
                    className="absolute left-3 top-3 h-2.5 w-2.5 rounded-full ring-2 ring-white/50"
                    style={{ background: style.accent }}
                  />

                  <div className="absolute inset-x-0 bottom-0 p-3.5">
                    <div className="text-[14px] font-bold leading-tight text-white">{style.name}</div>
                    <div className="mt-1 font-mono text-[9.5px] uppercase tracking-wider text-white/60">
                      {geste || 'Aucun geste imposé'}
                    </div>
                    <div className="mt-2 flex items-center justify-between font-mono text-[9.5px] uppercase tracking-wider text-white/45">
                      <span>{ici ? 'Vous êtes ici' : `dès ${aPartirDe(style.id)}`}</span>
                      {!ici && <ArrowRight size={12} className="opacity-0 transition group-hover:opacity-100" />}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
