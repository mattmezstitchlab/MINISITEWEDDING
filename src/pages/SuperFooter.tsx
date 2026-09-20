import { useEffect, useMemo, useState } from 'react';
import { Check, FileText, FolderOpen, Send, Wallet } from 'lucide-react';
import {
  AXES_FOOTER, CHOIX_VIDE, LIGNES_FOOTER, basculer, documentsOuverts, etatDuDocument, lignesDuTicket,
  validationDuDocument, type ChoixDeFooter, type DocumentPossible,
} from '../lib/superFooter';
import { annoncerDocument } from '../lib/annonces';
import { walletParCategorie, useWallet } from '../lib/wallet';
import { usePersonaCourante } from '../lib/personaCourant';
import { enregistrerNavVerticale } from '../lib/navVerticale';
import { NAV_FOOTER } from '../lib/navDesPages';
import LeTemps from '../components/LeTemps';

/**
 * SUPER FOOTER — LE FOOTER D'UNE PERSONNE, ET LES DOCUMENTS QUI VONT AVEC
 *
 * On garde le design du magasin : des **rayons** qu'on coche, et **un ticket**
 * qui se compose tout seul. Les rayons, ici, ne sont pas des objets : ce sont
 * des situations de vie — statut, parcours, ce qu'on sait faire, ce qu'on veut.
 * Le ticket montre **ce que ça ouvre** : les documents qui existent pour cette
 * situation, qui les demande, au nom de qui, et les pièces à réunir.
 *
 * Et parce qu'un footer, c'est ce qu'on laisse derrière soi : il porte les
 * mentions, le statut, les crédits, les valeurs — et **les documents qui sont
 * prêts**. C'est le même footer sur la page profil et dans la carte.
 *
 * **Ce qui est juridique porte sa source, et se fait valider.** On ne fabrique
 * pas d'acte ici : on montre la voie, la personne rassemble, un juriste valide.
 */

export default function SuperFooter() {
  const moi = usePersonaCourante();
  const [choix, setChoix] = useState<ChoixDeFooter>(CHOIX_VIDE);
  const [envoyes, setEnvoyes] = useState<string[]>([]);

  // La nav de droite : les axes, le ticket, et le footer.
  useEffect(() => {
    enregistrerNavVerticale(NAV_FOOTER);
    return () => enregistrerNavVerticale(null);
  }, []);

  const pieces = useWallet();
  const familles = useMemo(() => walletParCategorie(pieces), [pieces]);
  const documents = useMemo(() => documentsOuverts(choix), [choix]);
  const lignes = useMemo(() => lignesDuTicket(choix), [choix]);

  /** Demander un document : **le ticket sort de la fente**, et l'on répond là-haut. */
  const demander = (doc: DocumentPossible) => {
    annoncerDocument(doc.nom, moi.nom, undefined, doc.id);
    setEnvoyes((liste) => [...liste, doc.id]);
  };

  return (
    <div className="vp-env vp-env-dark min-h-screen bg-[#0A0A0A] pb-40 pt-24 text-white">
      <header className="vp-page">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
          Le footer
        </span>
        <h1
          className="mt-4 font-black leading-[1.02] tracking-[-0.03em]"
          style={{ fontSize: 'clamp(2rem, 4.4vw, 3.4rem)' }}
        >
          SUPER FOOTER
        </h1>
        <p className="mt-5 max-w-[720px] text-[15px] leading-relaxed text-white/70">
          Ce que vous laissez derrière vous, en bas de votre page profil et dans votre carte : vos
          mentions, votre statut, vos crédits, vos valeurs — et <strong className="font-semibold text-white">les documents
          qui sont prêts</strong>. On coche sa situation, et le ticket dit ce que ça ouvre : ce qui
          existe vraiment, qui le demande, au nom de qui, et ce qu’il faut réunir.
        </p>
        <p className="mt-3 max-w-[720px] font-mono text-[11px] leading-relaxed text-white/45">
          Ici, on ne fabrique pas d’acte : on montre la voie. Ce qui relève du droit porte sa source
          et se fait valider.
        </p>
      </header>

      <div className="vp-page mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        {/* ————————————————————— CE QUI SE COCHE ————————————————————— */}
        <div id="axes" className="grid gap-8">
          {AXES_FOOTER.map((axe) => (
            <section key={axe.id} id={`axe-${axe.id}`}>
              <div className="flex items-baseline gap-3">
                <h2 className="text-[19px] font-bold tracking-tight">{axe.label}</h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                  {axe.question}
                </span>
              </div>

              <div className="mt-4 grid gap-3">
                {axe.entrees.map((entree) => (
                  <div key={entree.id} className="rounded-[14px] border border-white/10 bg-white/[0.03] p-3">
                    <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/40">
                      {entree.label}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {entree.entrees.map((sous) => {
                        const pris = choix.options.includes(sous.id);
                        return (
                          <button
                            key={sous.id}
                            type="button"
                            aria-pressed={pris}
                            onClick={() => setChoix((c) => ({ ...c, options: basculer(c.options, sous.id) }))}
                            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] transition ${
                              pris
                                ? 'border-transparent bg-[#00FF88] font-semibold text-black'
                                : 'border-white/12 text-white/70 hover:border-white/40 hover:text-white'
                            }`}
                          >
                            {pris && <Check size={11} />}
                            {sous.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* ————————————— CE QUE LE FOOTER PORTE ————————————— */}
          <section id="footer" className="rounded-[18px] border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-[19px] font-bold tracking-tight">Ce que votre footer porte</h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-white/60">
              Les mêmes lignes sur votre page profil et dans votre carte : ce qu’on doit pouvoir
              lire, et ce que vous acceptez de montrer.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {LIGNES_FOOTER.map((ligne) => {
                const prise = choix.lignes.includes(ligne.id);
                return (
                  <button
                    key={ligne.id}
                    type="button"
                    aria-pressed={prise}
                    onClick={() => setChoix((c) => ({ ...c, lignes: basculer(c.lignes, ligne.id) }))}
                    className={`rounded-[12px] border p-3 text-left transition ${
                      prise ? 'border-[#00FF88]/60 bg-[#00FF88]/10' : 'border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-[13px] font-semibold">
                      {prise && <Check size={11} />}
                      {ligne.label}
                    </div>
                    <div className="mt-1 text-[11.5px] leading-relaxed text-white/50">{ligne.note}</div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* ————————————————————— LE TICKET ————————————————————— */}
        <aside className="lg:sticky lg:top-24">
          <div className="rounded-t-[10px] bg-[#171717] px-4 py-2">
            <div className="mx-auto h-1 w-24 rounded-full bg-black/60" />
          </div>

          <div className="bg-[#FFFEF7] p-5 font-mono text-[11.5px] leading-relaxed text-black shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
            <div className="text-center font-black tracking-[0.18em]">SUPER FOOTER</div>
            <div className="mt-1 text-center text-[9.5px] uppercase tracking-[0.14em] text-black/45">
              {moi.nom} · {moi.titre}
            </div>
            <div className="my-3 border-y border-dashed border-black/20 py-2 text-center text-[9.5px]">
              {documents.length} document{documents.length > 1 ? 's' : ''} possible
              {documents.length > 1 ? 's' : ''} · {choix.lignes.length} ligne
              {choix.lignes.length > 1 ? 's' : ''} de footer
            </div>

            {lignes.length === 0 ? (
              <p className="py-2 text-center text-black/50">
                Cochez votre situation : les documents qui existent apparaîtront ici.
              </p>
            ) : (
              lignes.map((ligne, i) => (
                <div key={`${ligne.gauche}-${i}`} className="border-b border-dotted border-black/15 py-2">
                  <div className="flex justify-between gap-3">
                    <span className="font-bold">{ligne.gauche}</span>
                    <span className="shrink-0 text-[10px] uppercase tracking-wider text-black/45">
                      {etatDuDocument(documents[i]!)}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[10.5px] text-black/55">{ligne.droite}</div>
                </div>
              ))
            )}

            <div className="mt-3 border-t-2 border-black pt-2">
              <div className="flex items-baseline justify-between">
                <span className="text-[12px] font-black">VOTRE FOOTER</span>
                <span className="text-[14px] font-black tabular-nums">{choix.lignes.length} lignes</span>
              </div>
            </div>
            <div className="mt-1 text-[9px] uppercase tracking-widest text-black/40">
              Rien n’est publié tant que vous ne l’avez pas voulu
            </div>
          </div>
          <div className="h-3 rotate-180 bg-[radial-gradient(circle_at_6px_0px,_transparent_6px,_#FFFEF7_6px)] bg-[length:12px_12px] bg-repeat-x" />

          {/* —————————————— MON PORTEFEUILLE : TOUT SE RANGE TOUT SEUL —————————————— */}
          <section id="wallet" className="mt-6 rounded-[18px] border border-white/10 bg-white/[0.03] p-5">
            <h2 className="flex items-center gap-2 text-[16px] font-bold tracking-tight">
              <Wallet size={15} className="text-[#00FF88]" /> Mon portefeuille
            </h2>
            <p className="mt-2 text-[12.5px] leading-relaxed text-white/55">
              Ce que vous validez se range ici,{' '}
              <strong className="font-bold text-white/80">classé par famille</strong> — et si une pièce
              n’entre dans aucune famille connue, la famille se crée. C’est comme ça qu’un
              portefeuille apprend, à force de demandes.
            </p>

            {familles.length === 0 ? (
              <p className="mt-4 text-[12.5px] text-white/40">
                Rien encore. Validez un document au-dessus : il descendra ici, à sa place.
              </p>
            ) : (
              <div className="mt-4 grid gap-3">
                {familles.map((famille) => (
                  <div key={famille.id} className="rounded-[12px] border border-white/10 p-3">
                    <div className="flex items-center gap-2">
                      <FolderOpen size={13} className="text-white/45" />
                      <span className="text-[12.5px] font-semibold">{famille.label}</span>
                      <span className="font-mono text-[10px] text-white/40">
                        {famille.pieces.length}
                      </span>
                      {famille.creee && (
                        <span className="ml-auto rounded-full border border-[#00FF88]/50 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#00FF88]">
                          créée
                        </span>
                      )}
                    </div>
                    <ul className="mt-2 grid gap-1">
                      {famille.pieces.map((piece) => (
                        <li key={piece.id} className="text-[12px] leading-relaxed text-white/60">
                          {piece.nom}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>
        </aside>
      </div>

      {/* ————————————— CE QUE LA SITUATION OUVRE, EN DÉTAIL ————————————— */}
      <section id="documents" className="vp-page mt-16">
        <h2 className="text-[19px] font-bold tracking-tight">Ce que votre situation ouvre</h2>
        <p className="mt-2 max-w-[640px] text-[13.5px] leading-relaxed text-white/60">
          Chaque document dit qui le demande, au nom de qui il est établi, ce qu’il faut réunir, et
          où se trouve la règle. Ce qui engage le droit est marqué <em>à valider</em> : rien ne
          sort d’ici sans une relecture.
        </p>
        {documents.length === 0 ? (
          <p className="mt-6 rounded-[14px] border border-white/10 bg-white/[0.03] p-5 text-[13.5px] text-white/55">
            Cochez votre situation, juste au-dessus : les documents qui existent apparaîtront ici,
            avec les pièces à réunir.
          </p>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {documents.map((doc) => {
              const envoye = envoyes.includes(doc.id);
              return (
                <article key={doc.id} className="rounded-[16px] border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="flex items-center gap-2 text-[14.5px] font-bold">
                      <FileText size={14} className="text-[#00FF88]" />
                      {doc.nom}
                    </h3>
                    <span className="shrink-0 rounded-full border border-white/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white/55">
                      {etatDuDocument(doc)}
                    </span>
                  </div>

                  <dl className="mt-3 grid gap-1.5 text-[12.5px] text-white/65">
                    <div className="flex gap-2">
                      <dt className="w-[92px] shrink-0 font-mono text-[9.5px] uppercase tracking-wider text-white/40">
                        Demandé par
                      </dt>
                      <dd>{doc.demandePar}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-[92px] shrink-0 font-mono text-[9.5px] uppercase tracking-wider text-white/40">
                        Au nom de
                      </dt>
                      <dd>{doc.auNomDe}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-[92px] shrink-0 font-mono text-[9.5px] uppercase tracking-wider text-white/40">
                        À réunir
                      </dt>
                      <dd>{doc.pieces.join(' · ')}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-[92px] shrink-0 font-mono text-[9.5px] uppercase tracking-wider text-white/40">
                        Source
                      </dt>
                      <dd className="text-white/50">{doc.source}</dd>
                    </div>
                    {validationDuDocument(doc) && (
                      <div className="flex gap-2">
                        <dt className="w-[92px] shrink-0 font-mono text-[9.5px] uppercase tracking-wider text-white/40">
                          Validation
                        </dt>
                        <dd className="font-semibold text-[#00FF88]">{validationDuDocument(doc)}</dd>
                      </div>
                    )}
                  </dl>

                  <button
                    type="button"
                    onClick={() => demander(doc)}
                    disabled={envoye}
                    className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12.5px] font-semibold transition ${
                      envoye
                        ? 'bg-white/10 text-white/50'
                        : 'bg-[#00FF88] text-black hover:brightness-110'
                    }`}
                  >
                    <Send size={13} /> {envoye ? 'Demandé' : 'Demander ce document'}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ═════════ LE TEMPS : le journal des gestes, tout en bas ═════════ */}
      <LeTemps />
    </div>
  );
}
