import { useState } from 'react';
import { Check, ExternalLink } from 'lucide-react';
import type { LigneDUnivers, UniversDeTicket } from '../lib/universDuTicket';
import type { MiniSite } from '../lib/miniSiteDuMariage';
import { euros } from '../lib/superMariage';

/* LE TICKET DANS LE TÉLÉPHONE — un iPhone penché, posé sur la page
 *
 * « Dans un iPhone posé penché sur la page : on peut faire défiler le ticket
 * dedans et cliquer — et quand on veut voir le site, on clique en bas, et le
 * site apparaît sur l'écran du téléphone. »
 *
 * ```
 *        ╱──────────────────────╲
 *       │  SUPER MARIAGE  NUB-139│   ← le ticket défile dans l'écran
 *       │  22:00 · les néons  ✓  │
 *       │  22:17 · la cérémonie  │   ← on clique : la ligne se coche
 *       │  22:30 · le cocktail   │
 *       │  …                     │
 *       │ ┌──────┐  ┌──────┐     │
 *       │ │TICKET│  │ SITE │     │   ← on bascule, et le site s'affiche
 *       │ └──────┘  └──────┘     │      dans le même écran
 *        ╲──────────────────────╱
 * ```
 *
 * Le téléphone est **penché** (trois degrés et demi), avec son ombre : c'est un
 * objet posé sur la page, pas une capture d'écran. Redressé sur un téléphone,
 * penché sur un ordinateur.
 */

export interface LeTelephoneAuTicketProps {
  /** L'univers du ticket, tel qu'il s'imprime en haut de l'écran. */
  univers: UniversDeTicket;
  /** Les lignes de l'univers. */
  lignes: LigneDUnivers[];
  /** Ce qui est coché. */
  coches: string[];
  surCocher: (id: string) => void;
  /** Le code du mariage, écrit sur le ticket. */
  code: string;
  /** Le site, tel qu'il apparaît dans l'écran quand on bascule. */
  site: MiniSite;
  visuel: string | null;
  noms: string;
  dateLabel: string;
  /** Ouvrir le site en grand — c'est le seul geste qui quitte le téléphone. */
  surOuvrirLeSite: () => void;
  /** L'écran du départ : `ticket`, ou `site`. */
  écranInitial?: 'ticket' | 'site';
}

export default function LeTelephoneAuTicket({
  univers,
  lignes,
  coches,
  surCocher,
  code,
  site,
  visuel,
  noms,
  dateLabel,
  surOuvrirLeSite,
  écranInitial = 'ticket',
}: LeTelephoneAuTicketProps) {
  const [écran, setÉcran] = useState<'ticket' | 'site'>(écranInitial);
  const prises = new Set(coches);

  /** Le ticket a un total : ce sont les lignes cochées qui le font. */
  const payantes = lignes.filter((l) => prises.has(l.id) && !l.inclus && (l.prix ?? 0) !== 0);
  const total = payantes.reduce((somme, l) => somme + (l.prix ?? 0), 0);
  const compte = lignes.filter((l) => prises.has(l.id)).length;

  return (
    <div data-tel="vrai" data-tel-univers={univers.id} className="vp-tel relative mx-auto w-[268px] sm:w-[296px]">
      <div className="vp-tel-coque">
        {/* L'encoche, et la barre du haut : c'est ce qui fait l'objet. */}
        <span aria-hidden="true" className="vp-tel-encoche" />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-20 flex items-baseline justify-between px-4 pt-2 font-mono text-[8.5px] uppercase tracking-[0.16em] text-white/70"
        >
          <span>{univers.mot}</span>
          <span className="tabular-nums">{code}</span>
        </span>

        {/* —————————————————— L'ÉCRAN —————————————————— */}
        <div data-tel-écran={écran} className="vp-tel-écran">
          {écran === 'ticket' ? (
            <>
              <header className="border-b border-dashed border-black/25 pb-[0.5em] text-center">
                <p data-tel-marque="vrai" className="text-[1.05em] font-bold uppercase leading-none tracking-[0.14em]">
                  SUPER MARIAGE
                </p>
                <p className="mt-[0.35em] text-[0.72em] uppercase tracking-[0.16em] text-black/55">
                  {univers.mot} · {code}
                </p>
              </header>
              <p className="mt-[0.5em] text-[0.72em] uppercase tracking-[0.12em] text-black/45">{univers.sous}</p>

              {/* **Le ticket défile dans l'écran** : on scrolle, on clique. */}
              <ul data-tel-liste="vrai" className="mt-[0.5em]">
                {lignes.map((ligne) => {
                  const prise = prises.has(ligne.id);
                  return (
                    <li key={ligne.id}>
                      <button
                        type="button"
                        data-tel-ligne={ligne.id}
                        data-tel-ligne-cochee={prise}
                        onClick={() => surCocher(ligne.id)}
                        className={`flex w-full items-baseline gap-[0.4em] border-b border-dashed border-black/10 py-[0.32em] text-left ${
                          prise ? 'text-[color:var(--vp-ink)]' : 'text-black/55'
                        }`}
                      >
                        <span className={`min-w-0 flex-1 ${prise ? 'vp-fluo' : ''}`}>
                          <span className="block leading-tight">{ligne.mot}</span>
                          {ligne.sous && (
                            <span className="block text-[0.85em] leading-tight text-black/45">{ligne.sous}</span>
                          )}
                        </span>
                        {ligne.inclus ? (
                          <span className="shrink-0 text-[0.85em] uppercase tracking-[0.1em] text-black/40">
                            {prise ? '✓' : 'inclus'}
                          </span>
                        ) : (
                          <span className="shrink-0 tabular-nums">{euros(ligne.prix ?? 0)}</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-[0.6em] flex items-baseline justify-between gap-2 border-t-2 border-black/70 pt-[0.35em] text-[1.05em] font-bold uppercase tracking-[0.06em]">
                <span>
                  {compte}/{lignes.length}
                </span>
                <span data-tel-total={total} className="tabular-nums">
                  {total === 0 ? 'inclus' : euros(total)}
                </span>
              </p>
              <p className="mt-[0.25em] text-[0.7em] uppercase tracking-[0.12em] text-black/40">
                {univers.geste} · qui le voit : {univers.qui}
              </p>
            </>
          ) : (
            /* ——————————————— LE SITE, SUR L'ÉCRAN DU TÉLÉPHONE ——————————————— */
            <>
              <div data-tel-site="vrai" className="relative -mx-[0.9em] -mt-[0.9em]">
                {visuel && <img src={visuel} alt="" className="h-[7.4em] w-full object-cover" />}
                <span
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(6,12,8,0.85), rgba(6,12,8,0.15))' }}
                />
                <span className="absolute inset-x-[0.9em] bottom-[0.6em] block text-white">
                  <span className="block text-[0.72em] uppercase tracking-[0.16em] text-white/70">{dateLabel}</span>
                  <span data-tel-site-noms="vrai" className="block text-[1.05em] leading-tight tracking-[-0.01em]">
                    {noms}
                  </span>
                </span>
              </div>

              <p className="mt-[0.7em] text-[0.72em] uppercase tracking-[0.12em] text-black/45">
                {site.allumés} blocs sur {site.total}
              </p>
              <ul data-tel-site-blocs="vrai" className="mt-[0.3em]">
                {site.blocs.map((bloc) => (
                  <li
                    key={bloc.id}
                    data-tel-site-bloc={bloc.id}
                    data-tel-site-compte={bloc.compte}
                    className="flex items-baseline justify-between gap-2 border-b border-dashed border-black/10 py-[0.28em]"
                  >
                    <span className="min-w-0 flex-1 truncate">{bloc.mot}</span>
                    <span className="shrink-0 tabular-nums text-black/45">{bloc.compte > 0 ? bloc.compte : '—'}</span>
                  </li>
                ))}
              </ul>
              <p data-tel-site-adresse={site.adresse} className="mt-[0.6em] break-all text-[0.78em] text-black/55">
                {site.adresse}
              </p>
              <button
                type="button"
                data-action="ouvrir-le-site-depuis-le-tel"
                onClick={surOuvrirLeSite}
                className="mt-[0.7em] inline-flex items-center gap-[0.4em] border border-black/25 px-[0.7em] py-[0.4em] font-mono text-[0.75em] uppercase tracking-[0.12em] transition hover:border-[color:var(--vp-ink)]"
              >
                <ExternalLink size={11} />
                voir le site en grand
              </button>
            </>
          )}
        </div>

        {/* ——————————————— LES DEUX TOUCHES, SUR L'ÉCRAN ——————————————— */}
        <div data-tel-barre="vrai" className="vp-tel-barre">
          <button
            type="button"
            data-tel-bouton="ticket"
            data-tel-bouton-actif={écran === 'ticket'}
            onClick={() => setÉcran('ticket')}
            className={`flex-1 rounded-full py-[0.4em] font-mono text-[0.72em] uppercase tracking-[0.12em] transition ${
              écran === 'ticket' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            le ticket
          </button>
          <button
            type="button"
            data-tel-bouton="site"
            data-tel-bouton-actif={écran === 'site'}
            onClick={() => setÉcran('site')}
            className={`flex flex-1 items-center justify-center gap-1 rounded-full py-[0.4em] font-mono text-[0.72em] uppercase tracking-[0.12em] transition ${
              écran === 'site' ? 'bg-[var(--vp-fluo)] text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            {écran === 'site' ? <Check size={10} /> : null}
            le site
          </button>
        </div>
      </div>
    </div>
  );
}
