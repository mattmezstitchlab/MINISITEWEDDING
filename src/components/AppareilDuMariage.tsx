import { useState } from 'react';
import { ArrowRight, CornerDownLeft, Lock, Plane, Receipt } from 'lucide-react';
import { OBJETS_DE_LA_FABRIQUE, pictoDuRipple } from '../lib/ripple';
import { LIGNES_DU_TICKET, type LigneDuTicket } from '../lib/categoriesDuTicket';
import type { BudgetDuRêve, Rêve, Sticker } from '../lib/codeDuMariage';
import { OBJETS_IMPRIMÉS, ligneImprimée, partDuRêve } from '../lib/codeDuMariage';
import { LES_HÉROS, LE_SPÉCIALISTE, type HérosDeLaLanding } from '../lib/bandesDeLAime';
import { euros } from '../lib/superMariage';

/* L'APPAREIL DU MARIAGE — LE TICKET, LE BUDGET, LES STICKERS
 *
 * « Le spécialiste du ticket de caisse » : le ticket n'est plus la fin du
 * produit, c'est **l'objet d'une machine** qui tient trois choses ensemble :
 *
 * 1. **l'écran** — il affiche le rêve (l'image, le titre dessus, le budget qui
 *    monte). On change de rêve avec les quatre boutons de catégorie : c'est
 *    l'arborescence du produit, en quatre images ;
 * 2. **les objets** — les six boutons ronds du Ripple, gardés. Chacun imprime
 *    **sa ligne sur le ticket** : `A7K-241-AV · BILLET D'AVION · JOSHUA TREE` ;
 * 3. **la fente, en bas** — le papier sort **par le dessous de la machine**
 *    (`presse-par-le-bas`), et les **stickers carrés** s'impriment en dessous.
 *
 * ```txt
 *  ┌───────────────────────────── ÉCRAN ─────────────────────────────┐
 *  │  SUPER MARIAGE        LE SPÉCIALISTE DU TICKET DE CAISSE A7K-241│
 *  │  ┌─────────── l'image du rêve, le titre dessus ────────────┐    │
 *  │  │           JOSHUA TREE · 72 % du rêve                     │    │
 *  │  └──────────────────────────────────────────────────────────┘    │
 *  │  ▬▬▬▬ la jauge du budget ▬▬▬▬  24 000 € mis de côté · 4 320 €     │
 *  └─────────────────────────────────────────────────────────────────┘
 *  ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ LA FENTE ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬   le papier sort par là
 *        ┌──────────────────────────┐
 *        │  SUPER MARIAGE   A7K-241 │                  ▣ ▣ ▣
 *        └──────────────────────────┘                  les stickers
 * ```
 */

/* ————————————————————————— LA PORTE : LE CODE DU MARIAGE ————————————————————————— */

/** La porte : on arrive, on donne le code, et tout s'ouvre. */
export function LaPorteDuMariage({
  surOuvrir,
  démonstration,
}: {
  surOuvrir: (code: string) => void;
  démonstration: string;
}) {
  const [texte, setTexte] = useState('');
  const [refusé, setRefusé] = useState(false);

  const ouvrir = () => {
    const propre = texte.trim();
    if (!propre) return;
    // Un code bien formé ouvre : c'est un cadenas, pas un mot de passe.
    if (/^[A-Za-z0-9]{3}-?\d{3}$/.test(propre.replace(/\s/g, ''))) {
      surOuvrir(propre);
      return;
    }
    setRefusé(true);
  };

  return (
    <div
      data-porte="vrai"
      className="grid min-h-svh place-items-center bg-white px-4 py-10 text-[color:var(--vp-ink)]"
    >
      <div className="w-full max-w-[420px]">
        <div className="rounded-[26px] border border-[color:var(--vp-line)] bg-white p-4 shadow-[0_30px_70px_rgba(12,14,24,0.10)]">
          <div className="rounded-[14px] border border-black/10 bg-[#06120C] px-4 py-5 font-mono text-[#7DE2B0] shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
            <span className="flex items-baseline justify-between gap-3 text-[9.5px] uppercase tracking-[0.16em] text-[#7DE2B0]/60">
              <span>{LE_SPÉCIALISTE.marque}</span>
              <span className="flex items-center gap-1.5">
                <Lock size={11} />
                fermé
              </span>
            </span>
            <span className="mt-3 block text-[12px] uppercase tracking-[0.14em]">{LE_SPÉCIALISTE.metier}</span>
            <span className="mt-2 block text-[15px] text-[#9BF3C6]">ENTREZ LE CODE DU MARIAGE</span>
            <span className="mt-1 block text-[9.5px] uppercase leading-relaxed tracking-[0.12em] text-[#7DE2B0]/50">
              c’est le code écrit sur le ticket — celui que le couple partage
            </span>

            <form
              data-porte-formulaire="vrai"
              onSubmit={(e) => {
                e.preventDefault();
                ouvrir();
              }}
              className="mt-4 flex items-center gap-2 rounded-full border border-[#7DE2B0]/25 px-3 py-1.5"
            >
              <input
                data-porte-champ="vrai"
                value={texte}
                onChange={(e) => {
                  setTexte(e.target.value);
                  setRefusé(false);
                }}
                placeholder="A7K-241"
                aria-label="code du mariage"
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent font-mono text-[15px] uppercase tracking-[0.22em] text-[#9BF3C6] outline-none placeholder:text-[#7DE2B0]/30"
              />
              <button
                type="submit"
                data-porte-ouvrir="vrai"
                aria-label="ouvrir"
                disabled={!texte.trim()}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00FF88] text-black transition hover:brightness-110 disabled:bg-white/10 disabled:text-white/25"
              >
                <CornerDownLeft size={14} />
              </button>
            </form>

            <span
              data-porte-refus={refusé ? 'vrai' : 'false'}
              className={`mt-2 block text-[9.5px] uppercase tracking-[0.12em] ${refusé ? 'text-[#FF7A6B]' : 'text-[#7DE2B0]/35'}`}
            >
              {refusé ? 'six signes : trois, un tiret, trois' : 'trois signes, un tiret, trois chiffres'}
            </span>
          </div>
        </div>

        <p className="mt-5 text-center font-mono text-[10.5px] uppercase tracking-[0.16em] text-[color:var(--vp-muted)]">
          pas de code sous la main ? essayez{' '}
          <button
            type="button"
            data-porte-démo={démonstration}
            onClick={() => {
              setTexte(démonstration);
              setRefusé(false);
            }}
            className="underline decoration-[color:var(--vp-line)] underline-offset-4 transition hover:text-[color:var(--vp-ink)]"
          >
            {démonstration}
          </button>
        </p>
      </div>
    </div>
  );
}

/* —————————————————————————————— L'APPAREIL —————————————————————————————— */

export interface AppareilDuMariageProps {
  /** Le code, écrit comme il s'imprime : `A7K-241`. */
  code: string;
  /** Le couple, la date, le lieu, et ce qui est sur le ticket. */
  avatar: { noms: string; date: string; lieu: string; convives: number; lignes: number; total: number };
  /** Le rêve, et où en est son budget. */
  rêve: Rêve;
  budget: BudgetDuRêve;
  /** Le rêve affiché sur l'écran, et de quoi en changer. */
  cible: string;
  surCible: (id: string) => void;
  /** Les objets posés, et le papier qui sort. */
  marques: string[];
  surObjet: (id: string) => void;
  sortie: { label: string; prix: string; sous: string } | null;
  /** Les stickers imprimés, et de quoi en tirer un. */
  stickers: Sticker[];
  surSticker: () => void;
  /** Le ticket, ligne à ligne. */
  ticket: LigneDuTicket[];
  /** Changer de mariage : on redemande le code. */
  surCode: () => void;
}

export default function AppareilDuMariage({
  code,
  avatar,
  rêve,
  budget,
  cible,
  surCible,
  marques,
  surObjet,
  sortie,
  stickers,
  surSticker,
  ticket,
  surCode,
}: AppareilDuMariageProps) {
  const héros: HérosDeLaLanding = LES_HÉROS.find((h) => h.id === cible) ?? LES_HÉROS[0]!;
  const marqués = OBJETS_IMPRIMÉS.filter((o) => marques.includes(o.id));

  return (
    <section id="l-appareil" data-bande="appareil" className="vp-bande vp-bande-fond">
      <div className="vp-page">
        <p className="vp-bande-nom">
          <b>SUPER MARIAGE</b>
          <span aria-hidden="true">·</span>
          <span>{LE_SPÉCIALISTE.metier}</span>
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
          {/* —————————————————— L'APPAREIL, ET SON ÉCRAN —————————————————— */}
          <div>
            <div
              data-appareil="mariage"
              className="relative rounded-[26px] border border-[color:var(--vp-line)] bg-white p-3 shadow-[0_30px_70px_rgba(12,14,24,0.12)] sm:p-4"
            >
              {/* L'écran : le rêve, son titre dessus, le budget dessous. */}
              <div data-appareil-écran="vrai" className="relative overflow-hidden rounded-[14px] bg-[#07090D]">
                <span className="absolute inset-x-0 top-0 z-20 flex items-baseline justify-between gap-2 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-white/70">
                  <span>{LE_SPÉCIALISTE.marque}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-white/45">{LE_SPÉCIALISTE.metier}</span>
                    <span data-appareil-code={code} className="text-[#7DE2B0]">
                      {code}
                    </span>
                  </span>
                </span>

                {/* Le rêve : une image, le titre dessus — comme partout ailleurs. */}
                <span className="relative block h-[280px] w-full sm:h-[330px]">
                  <img
                    src={héros.image}
                    alt=""
                    data-appareil-visuel={héros.id}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <span aria-hidden="true" className="vp-heros-voile" />
                  <span className="absolute inset-x-0 bottom-0 z-10 block px-4 pb-4">
                    <span className="block font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/65">
                      {héros.mot}
                    </span>
                    <span data-appareil-titre={héros.id} className="vp-hero-titre mt-1 block max-w-[26ch] text-white">
                      {héros.titre}
                    </span>
                    <span className="mt-1.5 block max-w-[38ch] text-[12.5px] leading-snug text-white/70">
                      {héros.sous}
                    </span>
                  </span>
                </span>

                {/* Le budget, sous l'image : la jauge, et les deux chiffres. */}
                <span className="block px-4 pb-3.5 pt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-white/75">
                  <span className="flex items-baseline justify-between gap-3">
                    <span data-appareil-jauge-mot="vrai" className="text-[#7DE2B0]">
                      {partDuRêve(budget.part)} du rêve · {euros(budget.misDeCôté)} mis de côté
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Plane size={11} />
                      {rêve.mot} · {euros(rêve.prix)}
                    </span>
                  </span>
                  <span className="vp-jauge mt-2 block">
                    <i style={{ width: `${Math.round(budget.part * 100)}%` }} />
                  </span>
                </span>
              </div>

              {/* Les objets du Ripple : gardés, et chacun imprime sa ligne. */}
              <div data-appareil-objets="vrai" className="mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                {OBJETS_DE_LA_FABRIQUE.map((objet) => {
                  const Icone = pictoDuRipple(objet.pictoParDefaut).Icone;
                  const posée = objet.id === 'ticket-caisse' ? false : marques.includes(objet.id);
                  return (
                    <button
                      key={objet.id}
                      type="button"
                      data-objet-de-lappareil={objet.id}
                      data-pose={posée ? 'true' : 'false'}
                      aria-pressed={posée}
                      title={objet.nom}
                      aria-label={`${objet.nom} — ${objet.sens}`}
                      onClick={() => surObjet(objet.id)}
                      className={`flex h-9 w-9 items-center justify-center rounded-full border transition sm:h-10 sm:w-10 ${
                        posée
                          ? 'border-[color:var(--vp-ink)] bg-[color:var(--vp-ink)] text-white'
                          : 'border-[color:var(--vp-line)] text-[color:var(--vp-muted)] hover:border-[color:var(--vp-ink)] hover:text-[color:var(--vp-ink)]'
                      }`}
                    >
                      <Icone size={15} />
                    </button>
                  );
                })}
                <button
                  type="button"
                  data-action="tirer-un-sticker"
                  onClick={surSticker}
                  className="flex h-9 items-center gap-1.5 rounded-full border border-[color:var(--vp-line)] px-3 font-mono text-[9.5px] uppercase tracking-[0.1em] text-[color:var(--vp-muted)] transition hover:border-[color:var(--vp-ink)] hover:text-[color:var(--vp-ink)] sm:h-10"
                >
                  <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-sm bg-[color:var(--vp-ink)]" />
                  sticker
                </button>
              </div>

              {/* LA FENTE, EN BAS : le papier sort par le dessous de la machine. */}
              <div
                data-fente-bas="vrai"
                aria-hidden="true"
                className="mx-auto mt-3 h-2.5 w-[78%] rounded-full bg-black shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)]"
              />
            </div>

            {/* Le papier, sous l'appareil : il descend de la fente. */}
            <div className="relative h-[104px] overflow-hidden px-6">
              {sortie && (
                <span
                  data-presse="bas"
                  data-presse-label={sortie.label}
                  className="presse-par-le-bas mx-auto block max-w-[360px] rounded-b-[3px] bg-[#FFFEF7] px-3 py-2 font-mono text-[11px] text-black shadow-[0_18px_40px_rgba(0,0,0,0.28)]"
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="truncate font-bold uppercase tracking-[0.08em]">{sortie.label}</span>
                    <span className="shrink-0 tabular-nums">{sortie.prix}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-[9.5px] uppercase tracking-[0.12em] text-black/45">
                    {sortie.sous}
                  </span>
                </span>
              )}
            </div>

            {/* Les stickers carrés : ce qui se colle sur le cahier. */}
            <div data-stickers="vrai" className="mt-1 flex flex-wrap items-center gap-2 px-1">
              {stickers.length === 0 && (
                <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-[color:var(--vp-muted-2)]">
                  aucun sticker — posez un objet, ou tirez-en un
                </span>
              )}
              {stickers.map((sticker) => (
                <span
                  key={sticker.cle}
                  data-sticker={sticker.mot}
                  className="vp-sticker"
                  style={{ background: sticker.couleur, color: sticker.encre }}
                >
                  {sticker.mot}
                </span>
              ))}
            </div>
          </div>

          {/* ————————————————— LE TICKET : CE QUI S'IMPRIME ————————————————— */}
          <div className="flex flex-col gap-4">
            <div
              data-ticket-de-lappareil="vrai"
              className="rounded-[3px] bg-[#FFFEF7] px-5 py-5 font-mono text-[11.5px] leading-relaxed text-black shadow-[0_20px_50px_rgba(12,14,24,0.12)]"
            >
              {/* AU DÉBUT DU TICKET : la marque, et ce qu'on est. */}
              <span className="flex items-baseline justify-between gap-3">
                <span data-ticket-marque="vrai" className="text-[15px] font-bold uppercase tracking-[0.12em]">
                  {LE_SPÉCIALISTE.marque}
                </span>
                <span className="tabular-nums text-black/45">{code}</span>
              </span>
              <span className="mt-0.5 block text-[9.5px] uppercase tracking-[0.14em] text-black/55">
                {LE_SPÉCIALISTE.metier}
              </span>

              <span className="mt-3 block border-t border-dashed border-black/25 pt-2.5 text-[10px] uppercase tracking-[0.1em] text-black/60">
                {avatar.noms} · {avatar.date} · {avatar.lieu}
                <br />
                {avatar.convives} convives · {avatar.lignes} ligne{avatar.lignes > 1 ? 's' : ''} cochée
                {avatar.lignes > 1 ? 's' : ''}
              </span>

              {/* Les lignes : le mariage, le rêve, les objets imprimés. */}
              <span className="mt-3 block border-t border-dashed border-black/25 pt-2.5">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="uppercase">LE MARIAGE</span>
                  <span data-ticket-ligne="mariage" className="tabular-nums">
                    {euros(avatar.total)}
                  </span>
                </span>
                <span className="mt-1 flex items-baseline justify-between gap-3">
                  <span className="uppercase">{rêve.mot} · LE VOYAGE</span>
                  <span data-ticket-ligne="voyage" className="tabular-nums">
                    {euros(rêve.prix)}
                  </span>
                </span>
                {rêve.comprend.map((morceau) => (
                  <span key={morceau} className="block pl-3 text-[10px] uppercase tracking-[0.08em] text-black/45">
                    · {morceau}
                  </span>
                ))}
              </span>

              {/* Les objets posés : chacun laisse sa ligne de code. */}
              <span data-ticket-objets="vrai" className="mt-3 block border-t border-dashed border-black/25 pt-2.5">
                <span className="block text-[9.5px] uppercase tracking-[0.14em] text-black/55">
                  LES OBJETS IMPRIMÉS {marqués.length > 0 ? `(${marqués.length})` : ''}
                </span>
                {marqués.length === 0 && (
                  <span className="mt-1 block text-[10px] uppercase tracking-[0.08em] text-black/35">
                    aucun — les boutons ronds en impriment
                  </span>
                )}
                {marqués.map((objet) => (
                  <span key={objet.id} data-objet-imprimé={objet.id} className="mt-1 block uppercase tracking-[0.06em]">
                    {ligneImprimée(code, objet)}
                  </span>
                ))}
                {budget.payé ? (
                  <span data-rêve-payé="vrai" className="mt-2 block uppercase text-black">
                    ✓ LE VOYAGE EST PAYÉ — reste {euros(budget.mariage)} de mariage
                  </span>
                ) : (
                  <span className="mt-2 block uppercase text-black/70">
                    {euros(budget.misDeCôté)} mis de côté · reste {euros(budget.reste)} pour le voyage
                  </span>
                )}
              </span>

              <span className="mt-3 flex items-baseline justify-between gap-3 border-t border-black pt-2.5 text-[14px]">
                <span className="uppercase">À FINANCER</span>
                <span data-ticket-reste={budget.reste} className="font-bold tabular-nums">
                  {euros(budget.reste)}
                </span>
              </span>

              <span className="mt-2 block text-[9.5px] uppercase tracking-[0.14em] text-black/40">
                {LE_SPÉCIALISTE.phrase}
              </span>
            </div>

            {/* Les quatre cibles : l'arborescence, en quatre images. */}
            <div data-cibles="vrai" className="grid grid-cols-2 gap-2">
              {LES_HÉROS.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  data-cible={h.id}
                  data-actif={h.id === héros.id ? 'true' : 'false'}
                  onClick={() => surCible(h.id)}
                  className={`vp-heros h-[104px] text-left transition ${
                    h.id === héros.id ? 'ring-2 ring-[color:var(--vp-ink)] ring-offset-2' : 'opacity-90 hover:opacity-100'
                  }`}
                >
                  <img src={h.image} alt="" />
                  <span aria-hidden="true" className="vp-heros-voile" />
                  <span className="absolute inset-x-0 bottom-0 block px-3 pb-2.5">
                    <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-white/70">
                      {h.mot}
                    </span>
                    <span className="mt-0.5 block text-[13.5px] font-semibold tracking-[-0.02em] text-white">
                      {h.titre}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <a
                href="#on-coche"
                data-action="descendre-aux-lignes"
                className="vp-pastille !text-[11px]"
              >
                <Receipt size={13} />
                les {LIGNES_DU_TICKET.length} lignes
                <ArrowRight size={13} />
              </a>
              <span
                data-ticket-prises={ticket.length}
                className="font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--vp-muted)]"
              >
                {ticket.length === 0
                  ? 'aucune ligne sur le ticket'
                  : `${ticket.length} ligne${ticket.length > 1 ? 's' : ''} sur le ticket`}
              </span>
              <button
                type="button"
                data-action="changer-de-code"
                onClick={surCode}
                className="font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--vp-muted)] underline decoration-[color:var(--vp-line)] underline-offset-4 transition hover:text-[color:var(--vp-ink)]"
              >
                changer de code
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
