import { Plus } from 'lucide-react';
import {
  QUI_PEUT_VOIR,
  UNIVERS_DU_TICKET,
  composerLeTicketDeLUnivers,
  universParId,
} from '../lib/universDuTicket';
import type { MiniSite } from '../lib/miniSiteDuMariage';
import { euros } from '../lib/superMariage';
import LeTelephoneAuTicket from './LeTelephoneAuTicket';

/* L'ATELIER DU TICKET — CHACUN COMPOSE LE SIEN, ET DÉCIDE QUI LE VOIT
 *
 * « Chacun peut créer un espace ticket, et il faut pouvoir le configurer dans
 * notre espace : donc un éditeur de ticket. »
 *
 * Trois réglages, et c'est tout :
 *
 * 1. **l'univers** — mini-site, photos, vidéos, repas, enfants, DJ, RSVP,
 *    témoins, délires, devis. Dix tickets, dix métiers ;
 * 2. **les lignes** — on coche ce qui entre sur le papier, ligne à ligne ;
 * 3. **qui le voit** — les mariés, les invités, la famille, les témoins, les
 *    enfants, le DJ, les métiers, ou tout le monde.
 *
 * Et **le lien se compose tout seul** : `?ticket=photos&lignes=…&qui=…&nom=…`.
 * C'est ce lien qu'on envoie — l'atelier est l'endroit où on le fabrique, le
 * téléphone est l'endroit où on le voit tel que l'autre le verra.
 */

export interface LAtelierDuTicketProps {
  /** L'univers choisi, et les lignes cochées de cet univers. */
  univers: string;
  lignes: string[];
  qui: string;
  nom: string;
  surUnivers: (id: string) => void;
  surLigne: (id: string) => void;
  surQui: (qui: string) => void;
  surNom: (nom: string) => void;
  /** Ce que le téléphone montre quand on bascule sur le site. */
  code: string;
  site: MiniSite;
  visuel: string | null;
  noms: string;
  dateLabel: string;
  surOuvrirLeSite: () => void;
}

export default function LAtelierDuTicket({
  univers,
  lignes,
  qui,
  nom,
  surUnivers,
  surLigne,
  surQui,
  surNom,
  code,
  site,
  visuel,
  noms,
  dateLabel,
  surOuvrirLeSite,
}: LAtelierDuTicketProps) {
  const u = universParId(univers);
  const ticket = composerLeTicketDeLUnivers(univers, lignes, qui, nom);

  return (
    <section id="l-atelier" data-bande="atelier" data-section="atelier" className="vp-bande vp-bande-fond">
      <div className="vp-page">
        <p className="vp-bande-nom">
          <b>AIME</b>
          <span aria-hidden="true">·</span>
          <span>L’ATELIER DU TICKET</span>
        </p>

        <div className="mt-8 max-w-[52ch]">
          <h2 data-bande-titre="atelier" className="vp-bande-titre">
            N’importe qui compose un ticket, et décide qui le voit.
          </h2>
          <p className="vp-bande-sous mt-5">
            Dix univers, et le même objet : le papier. On choisit les lignes, on choisit les yeux, et le lien
            s’écrit tout seul. Là-bas, l’autre ouvre son ticket — et le prépare dans son téléphone.
          </p>
        </div>

        <div data-atelier="vrai" data-atelier-univers={u.id} className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-14">
          {/* ═══════════════════ LES TROIS RÉGLAGES ═══════════════════ */}
          <div>
            {/* 1. L'UNIVERS */}
            <p className="vp-label">01 · L’UNIVERS</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {UNIVERS_DU_TICKET.map((autre) => (
                <button
                  key={autre.id}
                  type="button"
                  data-univers={autre.id}
                  data-univers-actif={autre.id === u.id}
                  aria-pressed={autre.id === u.id}
                  onClick={() => surUnivers(autre.id)}
                  className={`border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition ${
                    autre.id === u.id
                      ? 'border-[color:var(--vp-ink)] bg-[color:var(--vp-ink)] text-white'
                      : 'border-[color:var(--vp-line)] text-[color:var(--vp-muted)] hover:border-[color:var(--vp-ink)] hover:text-[color:var(--vp-ink)]'
                  }`}
                >
                  {autre.mot}
                </button>
              ))}
            </div>

            {/* 2. LES LIGNES */}
            <p className="vp-label mt-8">
              02 · LES LIGNES <span className="text-[color:var(--vp-muted-2)]">— {u.lignes.length} au catalogue</span>
            </p>
            <ul data-atelier-lignes="vrai" className="mt-3 border-t border-[color:var(--vp-line)]">
              {u.lignes.map((ligne) => {
                const prise = lignes.includes(ligne.id);
                return (
                  <li key={ligne.id} className="border-b border-[color:var(--vp-line)]">
                    <button
                      type="button"
                      data-atelier-ligne={ligne.id}
                      data-atelier-ligne-cochee={prise}
                      aria-pressed={prise}
                      onClick={() => surLigne(ligne.id)}
                      className="flex w-full items-baseline gap-3 py-2.5 text-left transition hover:bg-black/[0.03]"
                    >
                      <span
                        aria-hidden="true"
                        className={`mt-[0.2em] flex h-3.5 w-3.5 shrink-0 items-center justify-center border ${
                          prise ? 'border-[color:var(--vp-ink)] bg-[color:var(--vp-ink)] text-white' : 'border-[color:var(--vp-line)]'
                        }`}
                      >
                        {prise && <Plus size={10} className="rotate-45" />}
                      </span>
                      <span className={`min-w-0 flex-1 text-[13.5px] leading-snug ${prise ? '' : 'text-[color:var(--vp-muted)]'}`}>
                        {ligne.mot}
                        {ligne.sous && (
                          <span className="mt-0.5 block text-[11.5px] leading-snug text-[color:var(--vp-muted-2)]">
                            {ligne.sous}
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-[color:var(--vp-muted)]">
                        {ligne.inclus ? 'inclus' : (ligne.prix ?? 0) === 0 ? '—' : euros(ligne.prix ?? 0)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* 3. QUI LE VOIT */}
            <p className="vp-label mt-8">03 · QUI LE VOIT</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {QUI_PEUT_VOIR.map((vue) => (
                <button
                  key={vue}
                  type="button"
                  data-atelier-qui={vue}
                  data-atelier-qui-actif={vue === ticket.qui}
                  aria-pressed={vue === ticket.qui}
                  onClick={() => surQui(vue)}
                  className={`border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition ${
                    vue === ticket.qui
                      ? 'border-[color:var(--vp-ink)] bg-[color:var(--vp-ink)] text-white'
                      : 'border-[color:var(--vp-line)] text-[color:var(--vp-muted)] hover:border-[color:var(--vp-ink)] hover:text-[color:var(--vp-ink)]'
                  }`}
                >
                  {vue}
                </button>
              ))}
            </div>

            {/* LE NOM, ET LE LIEN */}
            <p className="vp-label mt-8">04 · LE NOM DU TICKET</p>
            <input
              data-atelier-nom="vrai"
              value={nom}
              onChange={(e) => surNom(e.target.value)}
              placeholder={u.mot}
              className="vp-field mt-3 w-full max-w-[420px] uppercase tracking-[0.08em]"
            />

            <p className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--vp-muted)]">
              <span data-atelier-compte={ticket.compte} className="tabular-nums text-[color:var(--vp-ink)]">
                {ticket.compte} lignes cochées
              </span>
              <span data-atelier-total={ticket.total} className="tabular-nums">
                {ticket.total === 0 ? 'inclus' : euros(ticket.total)}
              </span>
              <span data-atelier-geste={u.geste}>{u.geste}</span>
            </p>
            <p
              data-atelier-adresse={ticket.adresse}
              className="mt-2 break-all font-mono text-[11px] text-[color:var(--vp-muted)]"
            >
              {ticket.adresse}
            </p>
            <p className="mt-2 text-[12px] leading-snug text-[color:var(--vp-muted-2)]">
              C’est ce lien qui part. Celui qui l’ouvre a **son** ticket : il coche ses lignes, il prend ses missions, et
              il prépare ce qu’il a promis.
            </p>
          </div>

          {/* ═══════════════════ LE TÉLÉPHONE, PENCHEÀ, QUI MONTRE ═══════════════════ */}
          <div className="lg:sticky lg:top-24">
            <p className="vp-label text-center">CE QUE L’AUTRE VOIT</p>
            <div className="mt-5">
              <LeTelephoneAuTicket
                univers={u}
                lignes={u.lignes}
                coches={lignes}
                surCocher={surLigne}
                code={code}
                site={site}
                visuel={visuel}
                noms={noms}
                dateLabel={dateLabel}
                surOuvrirLeSite={surOuvrirLeSite}
              />
            </div>
            <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--vp-muted)]">
              {u.geste} · {ticket.qui}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
