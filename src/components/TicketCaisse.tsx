import { Check, Music2, ShoppingCart } from 'lucide-react';
import { barresTicket, euros, type LigneTicket, type TotalCaisse } from '../lib/superMariage';
import type { BlocDj } from '../lib/weddingTicket';

/**
 * LE TICKET DE CAISSE
 *
 * Le même papier thermique pour trois moments du mariage :
 *  - **le couple** — ce qui est prévu, coché, chiffré (le récap du couple) ;
 *  - **l'invité** — ce qu'il prend et ce qu'il demande : son reçu, à envoyer ;
 *  - **le DJ** — la playlist complète, rangée dans l'ordre de la soirée.
 *
 * Le papier, le code-barres et le tampon ne changent pas : seul l'en-tête
 * change, parce que le ticket est la monnaie du mariage.
 */

export type VarianteTicket = 'couple' | 'invite' | 'dj' | 'metier';

interface Props {
  variante?: VarianteTicket;
  /** L'enseigne du magasin : chaque univers a la sienne. */
  magasin: { nom: string; slogan: string; ville: string; rayon: string; caisse: string };
  /** Le couple qui passe à la caisse, et ses têtes. */
  couple: { noms: string; date: string; venue: string; convives: number };
  numero: string;
  dateLabel: string;
  heureLabel: string;
  /** Le tampon : validé, ou en cours. */
  paye: boolean;
  /** Les lignes (variantes couple et invité). */
  lignes?: LigneTicket[];
  total?: TotalCaisse;
  remiseLabel?: string;
  /** Le nom de l'invité, ou celui du métier (variantes invité et métier). */
  nom?: string;
  /** Le sous-titre de l'en-tête (variante métier : le domaine). */
  sousTitre?: string;
  /** Le plan de la soirée (variante DJ). */
  plan?: BlocDj[];
  /** Le nombre de morceaux du socle, et de demandes d'invités (variante DJ). */
  nbMorceaux?: number;
  nbDemandes?: number;
}

export default function TicketCaisse({
  variante = 'couple',
  magasin,
  couple,
  numero,
  dateLabel,
  heureLabel,
  paye,
  lignes = [],
  total,
  remiseLabel,
  nom,
  sousTitre,
  plan = [],
  nbMorceaux = 0,
  nbDemandes = 0,
}: Props) {
  const invite = variante === 'invite';
  const dj = variante === 'dj';
  const metier = variante === 'metier';
  const aDesLignes = lignes.length > 0;

  const enTete = dj
    ? { titre: 'SUPER MARIAGE · TERMINAL DJ', sous: 'Playlist complète à emporter' }
    : metier
      ? { titre: magasin.nom, sous: `Bon de commande · ${sousTitre ?? 'Métier'}` }
      : invite
        ? { titre: magasin.nom, sous: `Reçu invité · ${magasin.slogan}` }
        : { titre: magasin.nom, sous: magasin.slogan };

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
          {/* En-tête */}
          <div className="text-center">
            <div className="font-black tracking-[0.2em]">{enTete.titre}</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-black/50">{enTete.sous}</div>
            <div className="mt-3 border-y border-dashed border-black/20 py-2 text-[10px] leading-relaxed">
              <div>{magasin.ville}</div>
              <div>{dj ? `PLAYLIST · ${magasin.rayon}` : magasin.rayon}</div>
              <div>
                TICKET {numero} · {heureLabel} · {dateLabel}
              </div>
              <div>
                {magasin.caisse} · POUR {couple.convives} CONVIVES
              </div>
            </div>
          </div>

          {/* L'article principal */}
          <div className="mt-5 border-b border-dashed border-black/20 pb-4">
            <div className="text-[10px] uppercase tracking-widest text-black/40">
              {invite ? 'Le reçu de' : metier ? 'Le métier' : dj ? 'Le socle' : 'Article principal'}
            </div>
            <div className="mt-1 text-[19px] font-black leading-none tracking-tight">
              {(invite || metier ? nom ?? (invite ? 'Invité' : 'Métier') : couple.noms).toUpperCase()}
            </div>
            <div className="mt-1 text-[10.5px] text-black/60">
              {dj || metier
                ? `${couple.noms} · ${couple.date}`
                : `${couple.date} · ${couple.venue}`}
            </div>
            <div className="mt-2 flex items-center gap-2 text-[10.5px]">
              {dj ? (
                <>
                  <span className="rounded bg-black px-2 py-0.5 text-white">{nbMorceaux} MORCEAUX</span>
                  <span className="text-black/45">{nbDemandes} DEMANDE{nbDemandes > 1 ? 'S' : ''} D’INVITÉS</span>
                </>
              ) : invite || metier ? (
                <>
                  <span className="rounded bg-black px-2 py-0.5 text-white">{lignes.length} LIGNE{lignes.length > 1 ? 'S' : ''}</span>
                  <span className="text-black/45">POUR {couple.noms.toUpperCase()}</span>
                </>
              ) : (
                <>
                  <span className="rounded bg-black px-2 py-0.5 text-white">QTÉ 2</span>
                  <span className="text-black/45">AMOUR · 1 LOT · DÉFINITIF</span>
                </>
              )}
            </div>
          </div>

          {/* Les lignes */}
          <div className="mt-4">
            {dj ? (
              <>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em]">
                  <Music2 size={12} /> L’ordre de la soirée
                </div>

                {plan.length === 0 ? (
                  <div className="mt-3 border border-dashed border-black/20 py-6 text-center text-[11px] text-black/45">
                    Rien à jouer.
                    <br />
                    La playlist du couple et les demandes des invités arriveront ici.
                  </div>
                ) : (
                  <div className="mt-3 space-y-4">
                    {plan.map((bloc) => (
                      <div key={bloc.phaseId}>
                        <div className="border-b border-black/20 pb-1 text-[10px] font-bold uppercase tracking-[0.14em]">
                          {bloc.phaseLabel}
                        </div>
                        <div className="mt-2 space-y-1.5">
                          {bloc.lignes.map((ligne) => (
                            <div key={`${bloc.phaseId}-${ligne.titre}`} className="border-b border-dotted border-black/15 pb-1.5 last:border-none">
                              <div className="flex items-baseline gap-1.5">
                                <span className="shrink-0 text-[10px]">{ligne.demandeurs.length > 1 ? `×${ligne.demandeurs.length}` : '♪'}</span>
                                <span className="min-w-0 flex-1 truncate font-bold uppercase">{ligne.titre}</span>
                                {ligne.extrait && <span className="shrink-0 text-[9px] text-black/40">EXTRAIT</span>}
                              </div>
                              <div className="pl-4 text-[10px] text-black/50">
                                {ligne.artiste || 'Titre proposé'}
                                {ligne.demandeurs.length > 0
                                  ? ` · demandé par ${ligne.demandeurs.join(', ')}`
                                  : ' · playlist du couple'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em]">
                  <ShoppingCart size={12} />{' '}
                  {invite ? 'Ce que vous prenez' : metier ? 'Vos lignes sur le ticket' : 'Vos courses'}
                </div>

                {!aDesLignes ? (
                  <div className="mt-3 border border-dashed border-black/20 py-6 text-center text-[11px] text-black/45">
                    {invite ? (
                      <>
                        Rien de pris pour l’instant.
                        <br />
                        Choisissez une ligne : votre reçu s’imprime ici.
                      </>
                    ) : metier ? (
                      <>
                        Aucune ligne pour l’instant.
                        <br />
                        Les mariés n’ont rien validé sur ce poste.
                      </>
                    ) : (
                      <>
                        Caddie vide.
                        <br />
                        Cochez un horaire, un métier, un petit prix.
                      </>
                    )}
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
              </>
            )}
          </div>

          {/* Le total, ou le résumé de la playlist */}
          <div className="mt-5 border-t-2 border-black pt-3">
            {dj ? (
              <>
                <div className="flex justify-between text-[11px]">
                  <span>MORCEAUX AU TOTAL</span>
                  <span className="tabular-nums">{nbMorceaux + nbDemandes}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>DEMANDÉS PAR LES INVITÉS</span>
                  <span className="tabular-nums">{nbDemandes}</span>
                </div>
                <div className="flex justify-between text-[11px] text-black/55">
                  <span>À JOUER</span>
                  <span>Toute la nuit</span>
                </div>
                <div className="mt-2 flex items-baseline justify-between border-t border-black pt-2">
                  <span className="text-[15px] font-black tracking-tight">PLAYLIST</span>
                  <span className="text-[19px] font-black tabular-nums">{plan.length} SET{plan.length > 1 ? 'S' : ''}</span>
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-black/45">
                  <span>MODE DE PAIEMENT · LA PISTE</span>
                  <span>REMIS AU DJ</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between text-[11px]">
                  <span>SOUS-TOTAL</span>
                  <span className="tabular-nums">{euros(total?.sousTotal ?? 0)}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>{remiseLabel ?? 'CARTE DE FIDÉLITÉ · -10 %'}</span>
                  <span className="tabular-nums">-{euros(total?.remise ?? 0)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-black/55">
                  <span>DONT TVA 20 % INCLUSE</span>
                  <span className="tabular-nums">{euros(total?.tva ?? 0)}</span>
                </div>
                <div className="mt-2 flex items-baseline justify-between border-t border-black pt-2">
                  <span className="text-[15px] font-black tracking-tight">TOTAL</span>
                  <span className="text-[19px] font-black tabular-nums">{euros(total?.total ?? 0)}</span>
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-black/45">
                  <span>{total?.articles ?? 0} ligne{(total?.articles ?? 0) > 1 ? 's' : ''}</span>
                  <span>MODE DE PAIEMENT · AMOUR</span>
                </div>
              </>
            )}
          </div>

          {/* Le tampon */}
          <div className="mt-4 text-center">
            {dj ? (
              <span className="inline-flex -rotate-[4deg] items-center gap-1.5 rounded border-2 border-black px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em]">
                <Check size={12} /> Prêt pour la piste
              </span>
            ) : paye ? (
              <span className="inline-flex -rotate-[4deg] items-center gap-1.5 rounded border-2 border-black px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em]">
                <Check size={12} /> {invite ? 'Réservé · merci' : metier ? 'Confirmé par le couple' : 'Payé · merci'}
              </span>
            ) : (
              <span className="inline-block rounded border border-dashed border-black/35 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-black/50">
                {invite
                  ? 'Ticket en cours · rien de pris'
                  : metier
                    ? 'En attente du couple'
                    : 'Ticket en cours · passez à la caisse'}
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
            {magasin.nom} · {magasin.caisse}
            <br />
            {dj
              ? 'Remis au DJ le soir du jour J · playlist du couple et demandes des invités'
              : metier
                ? 'Édité depuis la page du mariage · rien à ressaisir'
                : invite
                  ? `Reçu invité · les mariés reçoivent la même liste · pour ${couple.noms}`
                  : 'Ticket non échangeable, amour définitif'}
            <br />
            Tarifs indicatifs — aucun paiement réel
          </div>
        </div>

        <div className="absolute -bottom-3 left-0 right-0 h-3 rotate-180 bg-[radial-gradient(circle_at_6px_0px,_transparent_6px,_#FFFEF7_6px)] bg-[length:12px_12px] bg-repeat-x" />
      </div>
    </div>
  );
}
