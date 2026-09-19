import { Check, ShoppingCart } from 'lucide-react';
import {
  MAGASIN, TICKET_COUPLE, barresTicket, euros,
  type LigneTicket, type TotalCaisse,
} from '../lib/superMariage';

/**
 * LE TICKET DE CAISSE
 *
 * Le papier thermique du Supermarché 22H, mais avec de vrais chiffres : une
 * ligne par article coché, la remise de la carte de fidélité, la TVA incluse,
 * le total — et le code-barres qui lit le numéro du ticket.
 *
 * Tant qu'on n'a pas payé, le ticket est « en cours » : il se remplit à mesure
 * qu'on coche. Après la caisse, il porte son tampon.
 */

interface Props {
  lignes: LigneTicket[];
  total: TotalCaisse;
  numero: string;
  dateLabel: string;
  heureLabel: string;
  paye: boolean;
}

export default function TicketCaisse({ lignes, total, numero, dateLabel, heureLabel, paye }: Props) {
  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      {/* L'imprimante */}
      <div className="relative mx-auto h-7 w-[86%] rounded-t-[12px] bg-[#171717] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
        <div className="absolute inset-x-6 top-2 h-[3px] rounded-full bg-black/60" />
        <div className="absolute left-1/2 top-1/2 h-1 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00FF88]/25" />
      </div>

      <div className="relative bg-[#FFFEF7] font-mono text-[12.5px] leading-[1.35] text-black shadow-[0_30px_70px_rgba(0,0,0,0.55)]">
        {/* Le papier déchiré */}
        <div className="absolute -top-3 left-0 right-0 h-3 bg-[radial-gradient(circle_at_6px_0px,_transparent_6px,_#FFFEF7_6px)] bg-[length:12px_12px] bg-repeat-x" />

        <div className="p-6">
          {/* En-tête du magasin */}
          <div className="text-center">
            <div className="font-black tracking-[0.2em]">{MAGASIN.nom}</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-black/50">
              {MAGASIN.slogan}
            </div>
            <div className="mt-3 border-y border-dashed border-black/20 py-2 text-[10px] leading-relaxed">
              <div>{MAGASIN.ville}</div>
              <div>{MAGASIN.rayon}</div>
              <div>
                TICKET {numero} · {heureLabel} · {dateLabel}
              </div>
              <div>{MAGASIN.caisse} · POUR {TICKET_COUPLE.convives} CONVIVES</div>
            </div>
          </div>

          {/* L'article principal : le couple */}
          <div className="mt-5 border-b border-dashed border-black/20 pb-4">
            <div className="text-[10px] uppercase tracking-widest text-black/40">Article principal</div>
            <div className="mt-1 text-[19px] font-black leading-none tracking-tight">
              {TICKET_COUPLE.noms.toUpperCase()}
            </div>
            <div className="mt-1 text-[10.5px] text-black/60">
              {TICKET_COUPLE.date} · {TICKET_COUPLE.venue}
            </div>
            <div className="mt-2 flex items-center gap-2 text-[10.5px]">
              <span className="rounded bg-black px-2 py-0.5 text-white">QTÉ 2</span>
              <span className="text-black/45">AMOUR · 1 LOT · DÉFINITIF</span>
            </div>
          </div>

          {/* Les lignes cochées */}
          <div className="mt-4">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em]">
              <ShoppingCart size={12} /> Vos courses
            </div>

            {lignes.length === 0 ? (
              <div className="mt-3 border border-dashed border-black/20 py-6 text-center text-[11px] text-black/45">
                Caddie vide.
                <br />
                Cochez un horaire, un métier, un petit prix.
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                {lignes.map((ligne) => (
                  <div key={ligne.id} className="border-b border-dotted border-black/15 pb-2 last:border-none">
                    <div className="flex items-baseline gap-1.5">
                      <span className="shrink-0 text-[10px] font-bold text-black/70">×{ligne.quantite}</span>
                      <span className="min-w-0 flex-1 truncate font-bold uppercase">{ligne.label}</span>
                      <span className="shrink-0 tabular-nums">{euros(ligne.total)}</span>
                    </div>
                    <div className="flex items-baseline justify-between gap-3 pl-6 text-[10px] text-black/50">
                      <span className="min-w-0 flex-1 truncate">
                        {ligne.detail}
                        {ligne.quantite > 1 ? ` · ${euros(ligne.prixUnitaire)} / pers.` : ''}
                      </span>
                      {ligne.promo && (
                        <span className="shrink-0 rounded bg-[#00FF88] px-1.5 py-[1px] text-[9px] font-bold text-black">
                          PROMO
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Le total */}
          <div className="mt-5 border-t-2 border-black pt-3">
            <div className="flex justify-between text-[11px]">
              <span>SOUS-TOTAL</span>
              <span className="tabular-nums">{euros(total.sousTotal)}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span>CARTE DE FIDÉLITÉ · -10 %</span>
              <span className="tabular-nums">-{euros(total.remise)}</span>
            </div>
            <div className="flex justify-between text-[11px] text-black/55">
              <span>DONT TVA 20 % INCLUSE</span>
              <span className="tabular-nums">{euros(total.tva)}</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between border-t border-black pt-2">
              <span className="text-[15px] font-black tracking-tight">TOTAL</span>
              <span className="text-[19px] font-black tabular-nums">{euros(total.total)}</span>
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-black/45">
              <span>{total.articles} ligne{total.articles > 1 ? 's' : ''}</span>
              <span>MODE DE PAIEMENT · AMOUR</span>
            </div>
          </div>

          {/* Le tampon */}
          <div className="mt-4 text-center">
            {paye ? (
              <span className="inline-flex -rotate-[4deg] items-center gap-1.5 rounded border-2 border-black px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em]">
                <Check size={12} /> Payé · merci
              </span>
            ) : (
              <span className="inline-block rounded border border-dashed border-black/35 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-black/50">
                Ticket en cours · passez à la caisse
              </span>
            )}
          </div>

          {/* Le code-barres */}
          <div className="mt-5 flex flex-col items-center border-t border-dashed border-black/20 pt-5">
            <div className="flex h-10 items-end gap-[2px]">
              {barresTicket(numero).map((largeur, i) => (
                <span
                  key={i}
                  className="bg-black"
                  style={{ width: `${largeur}px`, height: `${60 + (largeur * 12)}%`, opacity: i % 7 === 0 ? 0.5 : 1 }}
                />
              ))}
            </div>
            <div className="mt-1 font-mono text-[10px] tracking-[0.3em]">{numero}</div>
          </div>

          <div className="mt-5 border-t border-black pt-3 text-center text-[9px] uppercase leading-relaxed tracking-widest text-black/35">
            {MAGASIN.nom} · {MAGASIN.caisse}
            <br />
            Ticket non échangeable, amour définitif
            <br />
            Tarifs indicatifs — aucun paiement réel
          </div>
        </div>

        <div className="absolute -bottom-3 left-0 right-0 h-3 rotate-180 bg-[radial-gradient(circle_at_6px_0px,_transparent_6px,_#FFFEF7_6px)] bg-[length:12px_12px] bg-repeat-x" />
      </div>
    </div>
  );
}
