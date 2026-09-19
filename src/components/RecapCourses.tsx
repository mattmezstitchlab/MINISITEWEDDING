import { useMemo, useState } from 'react';
import { Check, Printer, ShoppingCart, Ticket, UserRound } from 'lucide-react';
import TicketCaisse from './TicketCaisse';
import { EnvoiRecu, QrPage } from './PlaylistCollaborative';
import { euros, lignesDuTicket, numeroDeTicket, prixDeLArticle, totalCaisse } from '../lib/superMariage';
import type { MagasinUnivers } from '../lib/weddingPage';
import type { Morceau } from '../lib/weddingPlaylist';
import type { WeddingStyle } from '../lib/weddingStyles';
import {
  avancement, encoderRecu, lacher, planDj, prendre, preneurDe, prisesParInvite, recuDe,
  recuVide, type EtatTerminal,
} from '../lib/weddingTicket';

/**
 * LE RÉCAP, EN TICKET
 *
 * Deux points de vue sur le même comptoir :
 *  - **côté invités** — chacun prend une ligne, et son reçu s’imprime à droite,
 *    avec le lien à envoyer aux mariés ;
 *  - **côté mariés** — ce qui est pris, par qui, ce qui reste libre, les reçus
 *    arrivés au journal, le ticket du couple, et le **terminal DJ** : la playlist
 *    complète, rangée dans l’ordre de la soirée.
 */

interface Props {
  styleId: string;
  style: WeddingStyle;
  magasin: MagasinUnivers;
  couple: { noms: string; date: string; venue: string; convives: number };
  dateLabel: string;
  heureLabel: string;
  /** La playlist du couple, pour le ticket du DJ. */
  morceaux: Morceau[];
  terminal: EtatTerminal;
  onTerminal: (f: (etat: EtatTerminal) => EtatTerminal) => void;
  nom: string;
  /** La teinte du papier de la page, pour que le récap s'y accorde. */
  fond: string;
  /** Le point de vue d'ouverture : les invités, ou les mariés (utile aux tests). */
  vueInitiale?: Vue;
}

type Vue = 'invites' | 'maries';

export default function RecapCourses({
  styleId, style, magasin, couple, dateLabel, heureLabel, morceaux, terminal, onTerminal, nom, fond,
  vueInitiale = 'invites',
}: Props) {
  /* La provision du couple : ce qui est prévu, coché, chiffré. */
  const [coches, setCoches] = useState<string[]>(magasin.panierDeDepart);
  const [menu, setMenu] = useState<string | null>(magasin.packages[0]?.id ?? null);
  const [valide, setValide] = useState(false);
  const [vue, setVue] = useState<Vue>(vueInitiale);

  const total = useMemo(() => totalCaisse(coches, menu, magasin.articles, magasin.packages), [coches, menu, magasin]);
  const lignes = useMemo(() => lignesDuTicket(coches, menu, magasin.articles, magasin.packages), [coches, menu, magasin]);
  const numeroCouple = useMemo(() => numeroDeTicket(coches, menu, magasin.prefixe), [coches, menu, magasin]);

  const basculerArticle = (id: string) => {
    setValide(false);
    setCoches((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  /* —————— le reçu de l'invité —————— */
  const signe = nom.trim().length > 0;
  const recu = useMemo(() => recuDe(terminal, nom), [terminal, nom]);
  const code = useMemo(() => (recuVide(recu) ? '' : encoderRecu(recu)), [recu]);
  const lignesRecu = useMemo(() => lignesDuTicket(recu.articles, null, magasin.articles, []), [recu, magasin]);
  const totalRecu = useMemo(() => totalCaisse(recu.articles, null, magasin.articles, []), [recu, magasin]);
  const numeroRecu = useMemo(() => (code ? `${magasin.prefixe}-${code.slice(0, 2).toUpperCase()}-RECU` : `${magasin.prefixe}-00-RECU`), [code, magasin]);
  const lienRecu = typeof window === 'undefined' || !code
    ? ''
    : `${window.location.origin}/le-mariage/${styleId}?recu=${code}`;

  /* —————— le terminal des mariés —————— */
  const prisParInvite = useMemo(() => prisesParInvite(terminal), [terminal]);
  const avance = useMemo(() => avancement(terminal, magasin.articles.length), [terminal, magasin]);
  const plan = useMemo(() => planDj(morceaux, terminal.demandes), [morceaux, terminal.demandes]);
  const numeroDj = useMemo(
    () => `${magasin.prefixe}-DJ-${String(plan.reduce((n, b) => n + b.lignes.length, 0)).padStart(2, '0')}`,
    [magasin, plan],
  );
  const lienPage = typeof window === 'undefined' ? '' : `${window.location.origin}/le-mariage/${styleId}`;

  const prix = (n: number) => (n === 0 ? 'Offert' : euros(n));

  return (
    <section id="recap" className="border-t border-black/10 px-6 py-20 sm:py-24" style={{ background: fond }}>
      <div className="mx-auto max-w-[1080px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-black/40">Le récap</span>
            <h2 className="mt-3 text-[30px] font-semibold leading-tight tracking-[-0.02em] sm:text-[40px]">
              {magasin.registre === 'table'
                ? 'Les invités dressent la table.'
                : magasin.registre === 'billet'
                  ? 'Les invités prennent leurs billets.'
                  : 'Les invités font leurs courses.'}
            </h2>
            <p className="mt-3 max-w-[620px] text-[13.5px] leading-relaxed text-black/55">
              Chacun prend une ligne : elle n’est plus libre, et <strong className="font-semibold text-black/70">son
              reçu s’imprime</strong> — un lien que les mariés ouvrent pour le poser sur le terminal. À la fin,
              le DJ récupère la playlist complète.
            </p>
          </div>

          {/* Le comptoir : invités, ou mariés */}
          <div className="inline-flex rounded-full border border-black/12 bg-white p-1">
            {([
              { id: 'invites' as Vue, label: 'Côté invités', icon: UserRound },
              { id: 'maries' as Vue, label: 'Côté mariés', icon: Ticket },
            ]).map((onglet) => {
              const actif = vue === onglet.id;
              return (
                <button
                  key={onglet.id}
                  type="button"
                  onClick={() => setVue(onglet.id)}
                  aria-pressed={actif}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-semibold transition ${
                    actif ? 'bg-black text-white' : 'text-black/60 hover:text-black'
                  }`}
                >
                  <onglet.icon size={13} />
                  {onglet.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          {/* —————————————————— la liste —————————————————— */}
          <div className="space-y-8">
            {vue === 'maries' && (
              <div className="rounded-[18px] border border-black/12 bg-[#FBFAF8] p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-mono text-[11px] font-bold uppercase tracking-[0.18em]">
                    Le comptoir · {avance.phrase}
                  </div>
                  <span className="font-mono text-[10.5px] text-black/45">
                    {prisParInvite.length} invité{prisParInvite.length > 1 ? 's' : ''} passé{prisParInvite.length > 1 ? 's' : ''}
                    {' '}· {terminal.demandes.length} demande{terminal.demandes.length > 1 ? 's' : ''} de morceau
                  </span>
                </div>

                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-black/8">
                  <div
                    className="h-full rounded-full transition-[width] duration-300"
                    style={{ width: `${Math.round((avance.pris / Math.max(1, avance.total)) * 100)}%`, background: style.accent }}
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {prisParInvite.map((invite) => (
                    <span
                      key={invite.nom}
                      className="rounded-full border border-black/12 bg-white px-3 py-1.5 text-[11.5px] font-semibold"
                    >
                      {invite.nom} · {invite.articles.length} ligne{invite.articles.length > 1 ? 's' : ''}
                    </span>
                  ))}
                </div>

                {/* Le journal : les reçus arrivés par lien */}
                <div className="mt-4 border-t border-black/12 pt-3">
                  <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">
                    Journal du terminal
                  </div>
                  {terminal.journal.length === 0 ? (
                    <p className="mt-2 text-[12px] leading-relaxed text-black/50">
                      Aucun reçu posé. Ouvrez le lien d’un reçu d’invité : il s’inscrit ici, une fois pour toutes.
                    </p>
                  ) : (
                    <ul className="mt-2 space-y-1.5">
                      {terminal.journal.map((entree) => (
                        <li key={entree.code} className="flex items-center gap-2 text-[12.5px]">
                          <Check size={12} className="shrink-0 text-black/45" />
                          <span className="min-w-0 flex-1 truncate">
                            Reçu de {entree.nom} · {entree.articles.length} ligne{entree.articles.length > 1 ? 's' : ''}
                            {entree.titres.length > 0 && ` · ${entree.titres.map((t) => t.titre).join(', ')}`}
                          </span>
                          <span className="shrink-0 font-mono text-[10px] text-black/35">{entree.code.slice(0, 6)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {magasin.rayons.map((rayon) => (
              <section key={rayon.key}>
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-black/12 pb-2.5">
                  <h3 className="font-mono text-[11.5px] font-bold uppercase tracking-[0.18em]">
                    <span className="mr-2">{rayon.emoji}</span>
                    {rayon.label}
                  </h3>
                  <span className="font-mono text-[10.5px] text-black/40">
                    {rayon.articles.filter((a) => (vue === 'maries' ? preneurDe(terminal, a.id) : coches.includes(a.id))).length} / {rayon.articles.length}
                  </span>
                </div>

                <p className="mt-1.5 text-[11.5px] leading-relaxed text-black/50">{rayon.sousTitre}</p>

                <div className="mt-3 space-y-1.5">
                  {rayon.articles.map((article) => {
                    const preneur = preneurDe(terminal, article.id);
                    const aMoi = signe && preneur === nom.trim();
                    return (
                      <div
                        key={article.id}
                        className={`flex flex-wrap items-center gap-3 rounded-[12px] px-3 py-2 transition ${
                          preneur ? 'bg-white shadow-sm ring-1 ring-black/8' : ''
                        }`}
                      >
                        {vue === 'maries' ? (
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                              preneur ? 'bg-black text-white' : 'bg-black/8 text-black/40'
                            }`}
                          >
                            {preneur ? preneur.slice(0, 1).toUpperCase() : '·'}
                          </span>
                        ) : (
                          <input
                            type="checkbox"
                            checked={coches.includes(article.id)}
                            onChange={() => basculerArticle(article.id)}
                            title="Prévu par les mariés"
                            className="h-4 w-4 shrink-0 accent-black"
                          />
                        )}

                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-medium">{article.label}</span>
                          <span className="block truncate text-[11px] text-black/45">{article.detail}</span>
                        </span>

                        <span className="shrink-0 font-mono text-[12px] tabular-nums text-black/70">
                          {prix(prixDeLArticle(article))}
                        </span>

                        {vue === 'invites' && (
                          // Une ligne = un invité. Une fois prise, elle porte son nom.
                          <button
                            type="button"
                            disabled={!signe && !preneur}
                            onClick={() =>
                              onTerminal((etat) =>
                                aMoi ? lacher(etat, article.id, nom) : prendre(etat, article.id, nom),
                              )
                            }
                            title={
                              preneur
                                ? `Pris par ${preneur}`
                                : signe
                                  ? 'Je prends cette ligne'
                                  : 'Mettez votre nom sur la carte de fidélité, plus haut'
                            }
                            className={`flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-[11.5px] font-semibold transition disabled:opacity-40 ${
                              aMoi
                                ? 'bg-black text-white hover:bg-neutral-800'
                                : preneur
                                  ? 'border border-black/12 text-black/45'
                                  : 'border border-black/15 text-black/70 hover:border-black hover:text-black'
                            }`}
                          >
                            {preneur ? (
                              <>
                                <Check size={12} />
                                <span className="max-w-[92px] truncate">{aMoi ? 'Pris par moi' : preneur}</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart size={12} /> Je prends
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}

            {/* La formule */}
            <section>
              <div className="border-b border-black/12 pb-2.5">
                <div className="font-mono text-[11.5px] font-bold uppercase tracking-[0.18em]">
                  <span className="mr-2">🍽</span>La formule
                </div>
                <div className="mt-1 text-[11.5px] text-black/45">{magasin.service}</div>
              </div>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
                {magasin.packages.map((pkg) => {
                  const actif = menu === pkg.id;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => {
                        setValide(false);
                        setMenu(actif ? null : pkg.id);
                        if (!actif) setVue('maries');
                      }}
                      className={`rounded-[14px] border p-3 text-left transition ${
                        actif ? 'border-transparent bg-[#0C0C0C] text-white' : 'border-black/12 hover:border-black/30'
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[13px] font-semibold">Menu {pkg.name}</span>
                        <span className="font-mono text-[12px] tabular-nums">{prix(pkg.prix)}</span>
                      </div>
                      <p className={`mt-1.5 text-[11.5px] leading-snug ${actif ? 'text-white/65' : 'text-black/50'}`}>
                        {pkg.description}
                      </p>
                      <ul className={`mt-2 space-y-0.5 font-mono text-[10px] uppercase tracking-wider ${actif ? 'text-white/50' : 'text-black/40'}`}>
                        {pkg.features.slice(0, 3).map((f) => (
                          <li key={f} className="truncate">· {f}</li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 font-mono text-[10px] uppercase leading-relaxed tracking-wider text-black/40">
                La formule est offerte : elle ouvre la carte de fidélité, −10 % sur la main-d’œuvre.
              </p>
            </section>

            {vue === 'maries' && (
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => { setValide(false); setCoches(magasin.panierDeDepart); }}
                  className="rounded-full border border-black/12 px-4 py-2 text-[12px] font-semibold text-black/65 transition hover:border-black/30"
                >
                  Repartir du départ
                </button>
                <button
                  type="button"
                  onClick={() => { setCoches(magasin.articles.map((a) => a.id)); setValide(true); }}
                  className="rounded-full border border-black/12 px-4 py-2 text-[12px] font-semibold text-black/65 transition hover:border-black/30"
                >
                  Tout cocher
                </button>
                <button
                  type="button"
                  onClick={() => setValide(true)}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-bold text-black transition hover:brightness-95"
                  style={{ background: style.accent }}
                >
                  <Printer size={13} /> Valider la provision
                </button>
              </div>
            )}
          </div>

          {/* —————————————————— les tickets —————————————————— */}
          <div className="space-y-6 lg:sticky lg:top-8">
            {vue === 'invites' ? (
              <>
                <div className="text-center">
                  <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-black/45">
                    Mon reçu
                  </div>
                </div>
                <TicketCaisse
                  variante="invite"
                  lignes={lignesRecu}
                  total={totalRecu}
                  numero={numeroRecu}
                  dateLabel={dateLabel}
                  heureLabel={heureLabel}
                  paye={lignesRecu.length > 0}
                  nom={nom}
                  magasin={magasin}
                  couple={couple}
                />
                {lignesRecu.length > 0 && lienRecu && signe ? (
                  <>
                    <EnvoiRecu lien={lienRecu} nom={nom.trim()} />
                    <p className="text-center font-mono text-[10px] uppercase tracking-wider text-black/35">
                      Ouvrir ce lien le pose sur le terminal des mariés
                    </p>
                  </>
                ) : (
                  <p className="text-center font-mono text-[10px] uppercase leading-relaxed tracking-wider text-black/40">
                    Prenez une ligne : votre reçu s’imprime ici
                  </p>
                )}
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-black/45">
                    Le ticket du couple
                  </div>
                </div>
                <TicketCaisse
                  variante="couple"
                  lignes={lignes}
                  total={total}
                  numero={numeroCouple}
                  dateLabel={dateLabel}
                  heureLabel={heureLabel}
                  paye={valide}
                  magasin={magasin}
                  couple={couple}
                />

                <QrPage lien={lienPage} />

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-black/45">
                    <Ticket size={11} /> Le terminal DJ · playlist complète
                  </div>
                </div>
                <TicketCaisse
                  variante="dj"
                  numero={numeroDj}
                  dateLabel={dateLabel}
                  heureLabel={heureLabel}
                  paye
                  plan={plan}
                  nbMorceaux={morceaux.length}
                  nbDemandes={terminal.demandes.length}
                  magasin={magasin}
                  couple={couple}
                />
                <p className="text-center font-mono text-[10px] uppercase leading-relaxed tracking-wider text-black/35">
                  Tarifs indicatifs — rien n’est facturé
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
