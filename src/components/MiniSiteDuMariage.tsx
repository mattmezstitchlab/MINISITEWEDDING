import type { ComponentProps } from 'react';
import { Check, Home } from 'lucide-react';
import type { LigneDuTicket } from '../lib/categoriesDuTicket';
import type { BudgetDuRêve, Rêve } from '../lib/codeDuMariage';
import type { MiniSite } from '../lib/miniSiteDuMariage';
import { partDuRêve } from '../lib/codeDuMariage';
import { euros } from '../lib/superMariage';
import TicketCaisse from './TicketCaisse';

/* LE MINI-SITE DES INVITÉS — CE QUE LA MACHINE A FABRIQUÉ
 *
 * C'est la sortie de la machine : on a coché, la machine a composé, et **voilà
 * ce que les invités reçoivent**. Une seule page, celle du lien :
 *
 * ```
 *   LA COUVERTURE      l'image du jour, les noms, la date, le lieu
 *   LES CHIFFRES       les lignes, le mariage, ce qui est mis de côté, le reste
 *   LE PROGRAMME       les horaires cochés, à l'heure près
 *   LES BLOCS          ce que les mariés ont préparé — un bloc par sujet
 *   LE VOYAGE          le rêve, sa jauge, ce qu'il reste à financer
 *   LE TICKET          le récapitulatif, ligne à ligne
 * ```
 *
 * Tout vient du ticket : **ce qui est coché est ce qui s'affiche**. Ce que les
 * mariés n'ont pas pris n'existe pas ici — pas de bloc vide, pas de « à venir ».
 */

export interface MiniSiteDuMariageProps {
  /** Le code du mariage, écrit sur la couverture. */
  code: string;
  avatar: { noms: string; dateLabel: string; lieu: string; convives: number };
  /** Le visuel du jour : la couverture du mini-site. */
  visuel: string | null;
  /** Le mini-site composé par la machine. */
  site: MiniSite;
  rêve: Rêve;
  budget: BudgetDuRêve;
  /** Le programme : les horaires cochés. */
  programme: LigneDuTicket[];
  /** Le papier du couple, tel quel — c'est le même que sur la page. */
  ticket: ComponentProps<typeof TicketCaisse>;
  /** Retourner à la machine (le lien est vivant dans les deux sens). */
  surQuitter: () => void;
}

export default function MiniSiteDuMariage({
  code,
  avatar,
  visuel,
  site,
  rêve,
  budget,
  programme,
  ticket,
  surQuitter,
}: MiniSiteDuMariageProps) {
  const totaux = ticket.total ?? { sousTotal: 0, remise: 0, tva: 0, total: 0, articles: 0 };
  return (
    <div data-site="invités" data-site-code={code} className="min-h-svh bg-white text-[color:var(--vp-ink)]">
      {/* ————————————————— LA COUVERTURE, PLEIN ÉCRAN ————————————————— */}
      <header className="relative flex min-h-[86svh] flex-col justify-end overflow-hidden px-4 pb-10 pt-16 text-white sm:px-8">
        {visuel && <img src={visuel} alt="" data-site-visuel="jour" className="absolute inset-0 h-full w-full object-cover" />}
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25" />

        <span className="absolute inset-x-4 top-5 z-10 flex items-baseline justify-between gap-3 font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/70 sm:inset-x-8">
          <span>LE SITE DES INVITÉS</span>
          <span data-site-marque="vrai" className="tabular-nums text-white/90">
            {code}
          </span>
        </span>

        <div className="relative z-10 max-w-[46ch]">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">{avatar.dateLabel}</p>
          <h1 data-site-noms="vrai" className="vp-title mt-3 text-white">
            {avatar.noms}
          </h1>
          <p className="mt-3 text-[13.5px] text-white/80">
            {avatar.lieu} · {avatar.convives} invités
          </p>
          <p className="mt-5 max-w-[40ch] text-[13.5px] leading-snug text-white/70">
            {site.allumés} blocs sur {site.total} sont prêts. Tout ce qui est ici a été coché, ligne après ligne — et
            chaque ligne payée met de côté pour le voyage.
          </p>
        </div>
      </header>

      {/* ————————————————— LES CHIFFRES DU MARIAGE ————————————————— */}
      <section data-site-chiffres="vrai" className="vp-bande vp-bande-fond">
        <div className="vp-page grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { mot: 'LIGNES', valeur: String(totaux.articles) },
            { mot: 'LE MARIAGE', valeur: euros(totaux.total) },
            { mot: 'MIS DE CÔTÉ', valeur: euros(budget.misDeCôté) },
            { mot: 'RESTE À FINANCER', valeur: euros(budget.reste) },
          ].map((chiffre) => (
            <p key={chiffre.mot} className="flex flex-col gap-1">
              <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-[color:var(--vp-muted)]">
                {chiffre.mot}
              </span>
              <span className="text-[26px] leading-none tabular-nums tracking-[-0.03em]">{chiffre.valeur}</span>
            </p>
          ))}
        </div>
      </section>

      {/* ————————————————— LE PROGRAMME ————————————————— */}
      {programme.length > 0 && (
        <section data-site-programme="vrai" className="vp-bande">
          <div className="vp-page">
            <p className="vp-bande-nom">
              <b>AIME</b>
              <span aria-hidden="true">·</span>
              <span>LE PROGRAMME</span>
            </p>
            <ul className="mt-6 max-w-[52ch]">
              {programme.map((ligne) => (
                <li
                  key={ligne.id}
                  data-site-horaire={ligne.id}
                  className="flex items-baseline justify-between gap-4 border-b border-[color:var(--vp-line)] py-2.5"
                >
                  <span className="text-[14px]">{ligne.label}</span>
                  <span className="shrink-0 font-mono text-[11px] tabular-nums text-[color:var(--vp-muted)]">
                    {ligne.incluse ? 'inclus' : euros(ligne.prix * (ligne.quantite ?? 1))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ————————————————— LES BLOCS, EN IMAGES ————————————————— */}
      <section data-site-blocs-section="vrai" className="vp-bande vp-bande-fond">
        <div className="vp-page">
          <p className="vp-bande-nom">
            <b>AIME</b>
            <span aria-hidden="true">·</span>
            <span>CE QU’IL Y A DEDANS</span>
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {site.blocs.map((bloc) => (
              <article
                key={bloc.id}
                data-site-bloc-carte={bloc.id}
                data-site-compte={bloc.compte}
                className="vp-heros h-[220px]"
              >
                <img src={bloc.image} alt="" />
                <span aria-hidden="true" className="vp-heros-voile" />
                <span className="absolute inset-x-0 bottom-0 block px-4 pb-4">
                  <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-white/65">
                    {bloc.compte > 0 ? `${bloc.compte} ligne${bloc.compte > 1 ? 's' : ''}` : 'toujours là'}
                  </span>
                  <span className="mt-1 block text-[15px] font-semibold leading-tight tracking-[-0.02em] text-white">
                    {bloc.mot}
                  </span>
                  <span className="mt-1 block max-w-[30ch] text-[12px] leading-snug text-white/70">{bloc.sous}</span>
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ————————————————— LE VOYAGE, LA CIBLE ————————————————— */}
      <section data-site-voyage="vrai" className="vp-bande">
        <div className="vp-page grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-center">
          <div className="max-w-[42ch]">
            <p className="vp-bande-nom">
              <b>AIME</b>
              <span aria-hidden="true">·</span>
              <span>LE VOYAGE</span>
            </p>
            <h2 className="vp-bande-titre mt-6">{rêve.mot}</h2>
            <p className="vp-bande-sous mt-4">{rêve.sous}</p>
            <p className="mt-4 text-[13px] text-[color:var(--vp-muted)]">{rêve.comprend.join(' · ')}</p>
          </div>

          <div className="rounded-[4px] border border-[color:var(--vp-line)] p-5">
            <span className="flex items-baseline justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.14em]">
              <span className="tabular-nums">{partDuRêve(budget.part)} du rêve</span>
              <span className="tabular-nums text-[color:var(--vp-muted)]">{euros(rêve.prix)}</span>
            </span>
            <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-black/10">
              <i className="block h-full bg-[color:var(--vp-ink)]" style={{ width: `${Math.round(budget.part * 100)}%` }} />
            </span>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--vp-muted)]">
              {euros(budget.misDeCôté)} mis de côté · reste {euros(budget.reste)}
            </p>
            <p className="mt-4 flex items-start gap-2 text-[12.5px] leading-snug text-[color:var(--vp-muted)]">
              <Check size={14} className="mt-0.5 shrink-0" />
              Chaque ligne du ticket laisse dix-huit lignes de côté pour ce voyage : c’est pour lui qu’on économise.
            </p>
          </div>
        </div>
      </section>

      {/* ————————————————— LE TICKET, EN ENTIER ————————————————— */}
      <section data-site-ticket="vrai" className="vp-bande vp-bande-fond">
        <div className="vp-page">
          <p className="vp-bande-nom">
            <b>AIME</b>
            <span aria-hidden="true">·</span>
            <span>LE TICKET</span>
          </p>
          <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,420px)_minmax(0,1fr)] md:items-start">
            <TicketCaisse {...ticket} />
            <div className="max-w-[46ch]">
              <p className="vp-bande-sous">
                Le ticket entier, tel qu’il sort de la fente. Les invités voient ce qui est pris en charge, et ce qui
                reste à financer — pas de devis caché, pas de parenthèse.
              </p>
              <button
                type="button"
                data-action="quitter-le-site"
                onClick={surQuitter}
                className="vp-pastille mt-6 !text-[11px]"
              >
                <Home size={13} />
                revenir à la machine
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer data-site-pied="vrai" className="vp-pied">
        <div className="vp-page flex flex-wrap items-center justify-between gap-3">
          <p className="vp-bande-nom">
            <b>AIME</b>
            <span aria-hidden="true">·</span>
            <span>SUPER MARIAGE</span>
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--vp-muted-2)]">
            le site des invités · {code}
          </p>
        </div>
      </footer>
    </div>
  );
}
