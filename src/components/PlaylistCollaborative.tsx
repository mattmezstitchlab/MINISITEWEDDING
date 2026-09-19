import { useMemo, useState } from 'react';
import { Check, Mail, MessageCircle, Music2, Plus, Search, Send, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import MusicCard from './MusicCard';
import type { Morceau } from '../lib/weddingPlaylist';
import {
  CATALOGUE, enregistrerPlaylist, morceauxDeLaPlaylist,
  chercherMorceaux, repartitionParMoment,
} from '../lib/weddingPlaylist';
import {
  cleLibre, demander, demandeursDe, demandesDe, retirerDemande, type EtatTerminal,
} from '../lib/weddingTicket';
import { DJ_CHRONOLOGICAL_PHASES } from '../lib/weddingDjPlaylist';
import type { WeddingStyle } from '../lib/weddingStyles';

/**
 * LA PLAYLIST COLLABORATIVE
 *
 * Le couple pose le socle ; les invités poussent des morceaux. Deux gestes,
 * jamais confondus : **Ajouter** met le morceau dans la playlist du mariage,
 * **Demander** le met sur le ticket — et c'est le ticket que le DJ récupère.
 *
 * On peut aussi **proposer un titre** qui n'est pas au catalogue, en disant à
 * quel moment de la soirée le jouer : il prend la même place que les autres sur
 * le ticket.
 */

interface Props {
  style: WeddingStyle;
  /** La playlist du couple, tenue par la page. */
  playlist: string[];
  onPlaylist: (suivant: string[]) => void;
  terminal: EtatTerminal;
  onTerminal: (f: (etat: EtatTerminal) => EtatTerminal) => void;
  nom: string;
  styleId: string;
}

export default function PlaylistCollaborative({
  style, playlist, onPlaylist, terminal, onTerminal, nom, styleId,
}: Props) {
  const [requete, setRequete] = useState('');
  const [titreLibre, setTitreLibre] = useState('');
  const [artisteLibre, setArtisteLibre] = useState('');
  const [phaseLibre, setPhaseLibre] = useState('dancefloor_classics');

  const morceaux = useMemo(() => morceauxDeLaPlaylist(playlist), [playlist]);
  const resultats = useMemo(() => chercherMorceaux(requete), [requete]);
  const moments = useMemo(() => repartitionParMoment(morceaux), [morceaux]);
  const mesDemandes = demandesDe(terminal, nom);
  const signe = nom.trim().length > 0;

  const basculerMorceau = (id: string) => {
    const suivant = playlist.includes(id) ? playlist.filter((x) => x !== id) : [...playlist, id];
    enregistrerPlaylist(suivant, styleId);
    onPlaylist(suivant);
  };

  const demanderMorceau = (morceau: Morceau) => {
    if (!signe) return;
    onTerminal((etat) =>
      etat.demandes.some((d) => d.cle === morceau.id && d.nom === nom.trim())
        ? retirerDemande(etat, morceau.id, nom)
        : demander(etat, { cle: morceau.id, titre: morceau.title, artiste: morceau.artiste, phaseId: morceau.phase }, nom),
    );
  };

  const proposerTitre = () => {
    const titre = titreLibre.trim();
    if (!titre || !signe) return;
    onTerminal((etat) =>
      demander(etat, { cle: cleLibre(titre, artisteLibre), titre, artiste: artisteLibre.trim(), phaseId: phaseLibre, libre: true }, nom),
    );
    setTitreLibre('');
    setArtisteLibre('');
  };

  return (
    <section id="playlist" className="border-t border-black/10 px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-[1080px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-black/40">La playlist</span>
            <h2 className="mt-3 text-[30px] font-semibold leading-tight tracking-[-0.02em] sm:text-[40px]">
              Cherchez un morceau, ajoutez-le.
            </h2>
          </div>
          <p className="max-w-[420px] text-[13px] leading-relaxed text-black/55">
            <strong className="font-semibold text-black/70">Ajouter</strong> met le morceau dans la playlist du
            mariage. <strong className="font-semibold text-black/70">Demander</strong> le met sur le ticket —
            et le ticket part au DJ. {CATALOGUE.filter((m) => !m.suggere).length} morceaux s’écoutent ici.
          </p>
        </div>

        {/* Le champ de recherche */}
        <div className="mt-8 flex items-center gap-3 rounded-full border border-black/12 bg-white px-5 py-3 shadow-sm">
          <Search size={16} className="shrink-0 text-black/35" />
          <input
            value={requete}
            onChange={(e) => setRequete(e.target.value)}
            placeholder="Un titre, un artiste, un moment — « cérémonie », « bal », « Sinatra »…"
            className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-black/35"
          />
          {requete && (
            <button
              type="button"
              onClick={() => setRequete('')}
              aria-label="Effacer la recherche"
              className="shrink-0 rounded-full p-1 text-black/35 transition hover:bg-black/5 hover:text-black"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
          <div>
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
              {requete ? `${resultats.length} résultat${resultats.length > 1 ? 's' : ''}` : 'Tout le catalogue'}
            </div>

            {/* Le catalogue en cartes musicales : le visuel, l'écoute, et les
                deux gestes — demander au DJ, ou ajouter à la playlist. */}
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {resultats.length === 0 && (
                <p className="rounded-[16px] border border-dashed border-black/15 px-4 py-6 text-center text-[13px] text-black/45 sm:col-span-2">
                  Rien pour « {requete} ». Proposez-le juste en dessous : il ira sur le ticket.
                </p>
              )}

              {resultats.map((morceau) => {
                const dedans = playlist.includes(morceau.id);
                const demandeurs = demandeursDe(terminal, morceau.id);
                const jeLaiDemande = demandeurs.includes(nom.trim());
                return (
                  <MusicCard
                    key={morceau.id}
                    track={morceau}
                    accent={style.accent}
                    sousTitre={`${morceau.artiste} · ${morceau.moment}`}
                    actions={
                      <>
                        <button
                          type="button"
                          onClick={() => demanderMorceau(morceau)}
                          disabled={!signe}
                          title={signe ? 'Mettre ce morceau sur le ticket du DJ' : 'Mettez d’abord votre nom, plus haut'}
                          className={`flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-[12px] font-semibold transition disabled:opacity-40 ${
                            jeLaiDemande
                              ? 'bg-black text-white hover:bg-neutral-800'
                              : 'border border-black/15 text-black/70 hover:border-black hover:text-black'
                          }`}
                        >
                          {jeLaiDemande ? <Check size={13} /> : <Music2 size={13} />}
                          {jeLaiDemande ? 'Sur le ticket' : 'Demander'}
                        </button>

                        <button
                          type="button"
                          onClick={() => basculerMorceau(morceau.id)}
                          aria-label={dedans ? `Retirer ${morceau.title} de la playlist` : `Ajouter ${morceau.title} à la playlist`}
                          className={`flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[12px] font-semibold transition ${
                            dedans
                              ? 'bg-black text-white hover:bg-neutral-800'
                              : 'border border-black/15 text-black/70 hover:border-black hover:text-black'
                          }`}
                        >
                          {dedans ? <Check size={13} /> : <Plus size={13} />}
                          {dedans ? 'Ajouté' : 'Ajouter'}
                        </button>

                        {demandeurs.length > 0 && (
                          <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-black/40">
                            demandé {demandeurs.length} fois
                          </span>
                        )}
                      </>
                    }
                  />
                );
              })}
            </div>

            {/* Proposer un titre qui n'est pas au catalogue */}
            <div className="mt-8 rounded-[18px] border border-black/12 bg-white p-5">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">
                Proposez un titre
              </div>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-black/55">
                Il n’est pas au catalogue ? Écrivez-le : il monte sur le ticket, au moment que vous choisissez.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <input
                  value={titreLibre}
                  onChange={(e) => setTitreLibre(e.target.value)}
                  placeholder="Le titre"
                  className="min-w-[150px] flex-1 rounded-full border border-black/12 px-4 py-2 text-[13px] outline-none placeholder:text-black/35 focus:border-black/40"
                />
                <input
                  value={artisteLibre}
                  onChange={(e) => setArtisteLibre(e.target.value)}
                  placeholder="L’artiste"
                  className="min-w-[120px] flex-1 rounded-full border border-black/12 px-4 py-2 text-[13px] outline-none placeholder:text-black/35 focus:border-black/40"
                />
                <select
                  value={phaseLibre}
                  onChange={(e) => setPhaseLibre(e.target.value)}
                  className="rounded-full border border-black/12 px-3 py-2 text-[12.5px] outline-none focus:border-black/40"
                >
                  {DJ_CHRONOLOGICAL_PHASES.filter((p) => p.id !== 'all').map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={proposerTitre}
                  disabled={!signe || titreLibre.trim().length === 0}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12.5px] font-bold text-black transition hover:brightness-95 disabled:opacity-40"
                  style={{ background: style.accent }}
                >
                  <Send size={13} /> Mettre sur le ticket
                </button>
              </div>
              {!signe && (
                <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-black/40">
                  Mettez votre nom sur la carte de fidélité, plus haut : il signe vos demandes.
                </p>
              )}
            </div>
          </div>

          {/* La playlist du couple, et les demandes de l'invité */}
          <div className="lg:sticky lg:top-8">
            <div className="rounded-[20px] border border-black/12 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">
                  La playlist du mariage
                </div>
                <span className="font-mono text-[10.5px] text-black/40">{morceaux.length}</span>
              </div>

              {moments.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {moments.map((m) => (
                    <span
                      key={m.moment}
                      className="rounded-full bg-black/5 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-wider text-black/50"
                    >
                      {m.moment} · {m.nombre}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-4 space-y-2.5">
                {morceaux.length === 0 && (
                  <p className="rounded-[16px] border border-dashed border-black/15 px-4 py-6 text-center text-[12.5px] text-black/45">
                    La playlist est vide. Cherchez un morceau et ajoutez-le.
                  </p>
                )}

                {morceaux.map((morceau) => (
                  <div key={morceau.id} className="group relative">
                    <MusicCard track={morceau} accent={style.accent} />
                    <button
                      type="button"
                      onClick={() => basculerMorceau(morceau.id)}
                      aria-label={`Retirer ${morceau.title}`}
                      className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-black/45 opacity-0 shadow ring-1 ring-black/10 transition hover:text-black group-hover:opacity-100"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Mes demandes : ce que j'ai mis sur le ticket */}
              <div className="mt-5 border-t border-black/10 pt-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">
                    {signe ? `Vos demandes · ${nom.trim()}` : 'Vos demandes'}
                  </span>
                  <span className="font-mono text-[10.5px] text-black/40">{mesDemandes.length}</span>
                </div>

                {mesDemandes.length === 0 ? (
                  <p className="mt-2 text-[12px] leading-relaxed text-black/45">
                    Rien encore. « Demander » met un morceau sur le ticket du DJ.
                  </p>
                ) : (
                  <div className="mt-2 space-y-2">
                    {mesDemandes.map((d) => {
                      const auCatalogue = CATALOGUE.find((m) => m.id === d.cle);
                      return (
                        <div key={d.cle} className="flex items-center gap-2">
                          <div className="min-w-0 flex-1">
                            <MusicCard
                              compact
                              accent={style.accent}
                              track={
                                auCatalogue ?? {
                                  title: d.titre,
                                  subtitle: d.artiste || 'Titre proposé',
                                  src: '',
                                  cover: '/images/danse.jpg',
                                }
                              }
                              pastille="Proposé"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => onTerminal((etat) => retirerDemande(etat, d.cle, nom))}
                            aria-label={`Retirer ${d.titre} du ticket`}
                            className="shrink-0 text-black/30 transition hover:text-black"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <p className="mt-4 border-t border-black/10 pt-3 font-mono text-[10px] uppercase leading-relaxed tracking-wider text-black/35">
                La playlist reste sur cet appareil · le ticket du DJ réunit tout le monde
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * L'aperçu du reçu d'un invité, avec ses canaux d'envoi : le lien du reçu encode
 * ce qu'il a pris — ouvrir le lien, c'est poser le reçu sur le terminal.
 */
export function EnvoiRecu({ lien, nom }: { lien: string; nom: string }) {
  const [copie, setCopie] = useState(false);
  const texte = encodeURIComponent(
    `${nom || 'Un invité'} a fait ses courses pour le mariage : ${lien}`,
  );

  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
      <a
        href={`https://wa.me/?text=${texte}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full border border-black/12 px-3.5 py-2 text-[12px] font-semibold text-black/70 no-underline transition hover:border-black/35"
      >
        <MessageCircle size={13} /> Envoyer par WhatsApp
      </a>
      <a
        href={`mailto:?subject=${encodeURIComponent('Notre reçu de mariage')}&body=${texte}`}
        className="inline-flex items-center gap-1.5 rounded-full border border-black/12 px-3.5 py-2 text-[12px] font-semibold text-black/70 no-underline transition hover:border-black/35"
      >
        <Mail size={13} /> Par e-mail
      </a>
      <button
        type="button"
        onClick={() => {
          void navigator.clipboard?.writeText(lien).then(() => {
            setCopie(true);
            window.setTimeout(() => setCopie(false), 2000);
          });
        }}
        className="inline-flex items-center gap-1.5 rounded-full border border-black/12 px-3.5 py-2 text-[12px] font-semibold text-black/70 transition hover:border-black/35"
      >
        {copie ? <Check size={13} /> : <Send size={13} />}
        {copie ? 'Lien copié' : 'Copier le lien du reçu'}
      </button>
    </div>
  );
}

/** Le QR de la page : affiché au comptoir, les invités le scannent et prennent. */
export function QrPage({ lien }: { lien: string }) {
  return (
    <div className="rounded-[16px] border border-black/12 bg-white p-4 text-center">
      <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">
        À scanner au comptoir
      </div>
      <div className="mt-3 flex justify-center">
        <QRCodeSVG value={lien} size={112} level="M" />
      </div>
      <p className="mt-2 text-[11.5px] leading-snug text-black/50">
        Chaque invité ouvre la page, prend une ligne — et son reçu arrive ici.
      </p>
    </div>
  );
}
