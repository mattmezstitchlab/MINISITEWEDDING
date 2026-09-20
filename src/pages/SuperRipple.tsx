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
import { NAV_RIPPLE } from '../lib/navDesPages';
import {
  CHAMPS_DU_POINT_ZERO, OBJETS_DE_LA_FABRIQUE, PICTOS_DU_RIPPLE, ceQuiManque, changerPointZero,
  choisirRepere, endroitsTouches, phraseDeLAgent, pictoDuRipple, repereDe, rippleComplet,
  usePointZero, useReperes,
} from '../lib/ripple';
import { SAISONS } from '../lib/jeuDeCartes';
import LeTemps from '../components/LeTemps';

/**
 * SUPER RIPPLE — LE POINT DE CONVERGENCE
 *
 * Tout ce qui était dispersé — les formulaires de la carte, du mini-site, de
 * chaque organisme et de chaque recherche — se réunit ici, **en une seule
 * page, en profondeur** : comme la timeline descend des saisons aux jours,
 * cette page descend du **point zéro** vers tout ce qu'il ouvre.
 *
 * On entre une information une fois, au centre du cadran. Elle se propage :
 * le ticket de caisse se compose, les objets de la fabrique se préparent, et
 * tout se répercute en une modification. Le magazine devient l'objet unique —
 * à lui-même une carte.
 */

export default function SuperRipple() {
  const moi = usePersonaCourante();
  const point = usePointZero();
  const reperes = useReperes();
  const [choix, setChoix] = useState<ChoixDeFooter>(CHOIX_VIDE);
  const [envoyes, setEnvoyes] = useState<string[]>([]);

  // La nav de droite : le point zéro, la fabrique, la situation, les papiers.
  useEffect(() => {
    enregistrerNavVerticale(NAV_RIPPLE);
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

  const nomAffiche = point.nom.trim() || moi.nom;
  const touches = endroitsTouches(point);

  return (
    <div className="vp-env vp-env-dark min-h-screen bg-[#0A0A0A] pb-40 pt-24 text-white">
      <header className="vp-page">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
          Le point de convergence
        </span>
        <h1
          className="mt-4 font-black leading-[1.02] tracking-[-0.03em]"
          style={{ fontSize: 'clamp(2rem, 4.4vw, 3.4rem)' }}
        >
          SUPER RIPPLE
        </h1>
        <p className="mt-5 max-w-[720px] text-[15px] leading-relaxed text-white/70">
          Tout ce qui était dispersé se réunit ici : les formulaires, les situations, les papiers.
          On entre une information <strong className="font-semibold text-white">une seule fois</strong>,
          au point zéro — et elle se propage au ticket, aux objets, au magazine. Une modification,
          tout se répercute. Le but : <strong className="font-semibold text-white">gagner les années
          perdues à tout re-rentrer partout</strong>.
        </p>
        <p className="mt-3 max-w-[720px] font-mono text-[11px] leading-relaxed text-white/45">
          Ici, on ne fabrique pas d’acte : on montre la voie. Ce qui relève du droit porte sa source
          et se fait valider.
        </p>
      </header>

      {/* ═════════ LE POINT ZÉRO : UNE SAISIE, TOUT SE RÉPERCUTE ═════════ */}
      <section id="point-zero" className="vp-page mt-14">
        <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
          {/* Le cadran : le point zéro est son centre. */}
          <div className="flex justify-center">
            <svg width="190" height="190" viewBox="0 0 40 40" role="img" aria-label="Le cadran du point zéro">
              {SAISONS.map((saison, i) => {
                const debut = (i / 4) * 360 - 90;
                const fin = ((i + 1) / 4) * 360 - 90;
                const rad = (deg: number) => (deg * Math.PI) / 180;
                return (
                  <path
                    key={saison.id}
                    d={`M 20 20 L ${20 + 17 * Math.cos(rad(debut))} ${20 + 17 * Math.sin(rad(debut))} A 17 17 0 0 1 ${20 + 17 * Math.cos(rad(fin))} ${20 + 17 * Math.sin(rad(fin))} Z`}
                    fill={saison.fond}
                    opacity="0.85"
                  />
                );
              })}
              <circle cx="20" cy="20" r="6.5" fill="#0A0A0A" />
              <circle cx="20" cy="20" r="2.4" fill={rippleComplet(point) ? '#00FF88' : '#ffffff'} />
            </svg>
          </div>

          <div>
            <h2 className="text-[19px] font-bold tracking-tight">Le point zéro</h2>
            <p className="mt-2 max-w-[560px] text-[13.5px] leading-relaxed text-white/60">
              Trois champs, saisis une fois. Tout le reste du site s'en nourrit — c'est l'équivalent
              du champ qui génère le magazine, pour tout ce qui vous concerne.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {CHAMPS_DU_POINT_ZERO.map((champ) => (
                <label key={champ.id} className="block">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/45">
                    {champ.label}
                  </span>
                  <input
                    value={point[champ.id]}
                    onChange={(e) => changerPointZero({ [champ.id]: e.target.value })}
                    placeholder={champ.indice}
                    aria-label={`${champ.label} du point zéro`}
                    className="mt-1.5 w-full rounded-[10px] border border-white/15 bg-white/[0.04] px-3 py-2.5 text-[14px] text-white placeholder:text-white/30 focus:border-[#00FF88]/60 focus:outline-none"
                  />
                </label>
              ))}
            </div>

            {/* L'agent lit le ticket et dit ce qu'il manque. */}
            <p
              aria-live="polite"
              className="mt-4 rounded-[12px] border border-white/10 bg-white/[0.04] px-4 py-3 text-[13px] leading-relaxed text-white/70"
            >
              <span className="mr-2 font-mono text-[9.5px] uppercase tracking-[0.18em] text-[#00FF88]">
                L’agent
              </span>
              {phraseDeLAgent(point)}
            </p>
            {touches > 0 && (
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                Ripple en cours : {touches} endroits mis à jour en une seule saisie
              </p>
            )}
            <p className="mt-4 max-w-[560px] font-mono text-[10.5px] leading-relaxed text-white/45">
              LE PRINCIPE : rien n'est stocké en fichier. Un document qui arrive — un PDF, une
              capture, un SMS — est <strong className="text-white/70">extrait (OCR), reconnu, puis
              classé</strong>. Le fichier repart, l'information reste, rangée à sa place.
            </p>
          </div>
        </div>
      </section>

      {/* ═════════ LA FABRIQUE : LES OBJETS QUI SE PRÉPARENT ICI ═════════ */}
      <section id="fabrique" className="vp-page mt-16">
        <h2 className="text-[19px] font-bold tracking-tight">La fabrique</h2>
        <p className="mt-2 max-w-[640px] text-[13.5px] leading-relaxed text-white/60">
          Comme des éléments préparés une fois, qui partent partout : chaque objet porte le point
          zéro, et le picto qu'on lui choisit devient son <strong className="text-white/80">repère
          signalétique</strong> dans le magazine. Une modification au point zéro se répercute sur tous.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {OBJETS_DE_LA_FABRIQUE.map((objet) => {
            const repere = repereDe(objet.id);
            const Picto = pictoDuRipple(reperes[objet.id] ?? objet.pictoParDefaut).Icone;
            return (
              <article key={objet.id} className="rounded-[16px] border border-white/10 bg-white/[0.03] p-4">
                {/* L'objet : il porte le point zéro, en direct. */}
                <div className="rounded-[10px] border border-dashed border-white/20 bg-[#FFFEF7] p-3 font-mono text-[10.5px] leading-snug text-black">
                  <div className="flex items-center justify-between">
                    <span className="font-black uppercase tracking-[0.14em]">{objet.nom}</span>
                    <Picto size={13} />
                  </div>
                  <div className="mt-2 border-t border-dotted border-black/25 pt-2">
                    {nomAffiche}
                    {point.jour.trim() && <> · {point.jour.trim()}</>}
                  </div>
                  {point.ville.trim() && <div className="text-black/55">{point.ville.trim()}</div>}
                </div>

                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <h3 className="text-[13.5px] font-bold">{objet.nom}</h3>
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">
                    repère : {pictoDuRipple(repere).nom}
                  </span>
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-white/50">{objet.sens}</p>

                {/* Le picto choisi devient le repère de l'objet dans le magazine. */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {PICTOS_DU_RIPPLE.map((picto) => {
                    const Icone = picto.Icone;
                    const pris = repere === picto.id;
                    return (
                      <button
                        key={picto.id}
                        type="button"
                        onClick={() => choisirRepere(objet.id, picto.id)}
                        aria-label={`Repère ${picto.nom} pour ${objet.nom}`}
                        aria-pressed={pris}
                        className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
                          pris
                            ? 'border-transparent bg-[#00FF88] text-black'
                            : 'border-white/12 text-white/60 hover:border-white/40 hover:text-white'
                        }`}
                      >
                        <Icone size={14} />
                      </button>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ═════════ LA SITUATION : CE QUI SE COCHE ═════════ */}
      <div className="vp-page mt-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
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

          {/* ————————————— CE QUI SE GARDE PARTOUT ————————————— */}
          <section id="footer" className="rounded-[18px] border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-[19px] font-bold tracking-tight">Ce qui se garde partout</h2>
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
            <div className="text-center font-black tracking-[0.18em]">SUPER RIPPLE</div>
            <div className="mt-1 text-center text-[9.5px] uppercase tracking-[0.14em] text-black/45">
              {nomAffiche} · {moi.titre}
            </div>
            <div className="my-3 border-y border-dashed border-black/20 py-2 text-center text-[9.5px]">
              {documents.length} document{documents.length > 1 ? 's' : ''} possible
              {documents.length > 1 ? 's' : ''} · {choix.lignes.length} ligne
              {choix.lignes.length > 1 ? 's' : ''} gardée{choix.lignes.length > 1 ? 's' : ''}
            </div>

            {/* Le point zéro, tel qu'il est saisi — et ce qu'il manque. */}
            <div className="border-b border-dotted border-black/15 py-2">
              <div className="flex justify-between gap-3">
                <span className="font-bold">Point zéro</span>
                <span className="shrink-0 text-[10px] uppercase tracking-wider text-black/45">
                  {ceQuiManque(point).length === 0 ? 'complet' : 'en cours'}
                </span>
              </div>
              <div className="mt-0.5 text-[10.5px] text-black/55">
                {[point.nom, point.jour, point.ville].filter((c) => c.trim()).join(' · ') ||
                  'Rien encore : trois champs suffisent.'}
              </div>
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
                <span className="text-[12px] font-black">VOTRE TICKET</span>
                <span className="text-[14px] font-black tabular-nums">
                  {choix.lignes.length + (rippleComplet(point) ? 1 : 0)} lignes
                </span>
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
