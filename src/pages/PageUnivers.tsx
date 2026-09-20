import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Check, Copy, Music2, Sparkles, Ticket } from 'lucide-react';
import BandeDuHero from '../components/BandeDuHero';
import ComplementaryThemes from '../components/ComplementaryThemes';
import UniversPagesGrid from '../components/UniversPagesGrid';
import PlaylistCollaborative from '../components/PlaylistCollaborative';
import RecapCourses from '../components/RecapCourses';
import { contentFor } from '../lib/universeContent';
import { getComplementaryStyles } from '../lib/weddingStyles';
import { cartesDesUnivers } from '../lib/cartesVivantes';
import { enregistrerNavVerticale } from '../lib/navVerticale';
import { NAV_UNIVERS } from '../lib/navDesPages';
import { getScenesForStyle } from '../lib/themeTimelineScenarios';
import { trackForText } from '../lib/weddingSoundtrack';
import { daysUntil, formatDateLong } from '../lib/format';
import { chargerPlaylist, enregistrerPlaylist, morceauxDeLaPlaylist } from '../lib/weddingPlaylist';
import MusicCard from '../components/MusicCard';
import { aPartirDe, pageFor, type PageUnivers as PageDonnees } from '../lib/weddingPage';
import { chargerNom, enregistrerNom, signataire, type EtatTerminal } from '../lib/weddingTicket';
import { etatDuComptoir, useComptoir } from '../lib/terminalLive';
import { gesteDepuis } from '../lib/liveRules';

const COULEURS = {
  magasin: { papier: '#FBFAF8', carte: '#FFFFFF' },
  table: { papier: '#FBF7EE', carte: '#FFFDF6' },
  billet: { papier: '#F1F1F4', carte: '#FFFFFF' },
} as const;

export default function PageUnivers({ styleId }: { styleId: string }) {
  const page: PageDonnees = useMemo(() => pageFor(styleId), [styleId]);
  const { style, magasin, magazine } = page;
  const tons = COULEURS[magasin.registre];
  const content = useMemo(() => contentFor(style), [style]);
  const scenes = useMemo(() => getScenesForStyle(styleId), [styleId]);
  const voisins = getComplementaryStyles(style);
  const [params] = useSearchParams();
  /** Le reçu d'un invité, quand on ouvre son lien. */
  const codeRecu = params.get('recu');


  // La nav de droite : l'article, le programme, la carte de fidélité.
  useEffect(() => {
    enregistrerNavVerticale(NAV_UNIVERS);
    return () => enregistrerNavVerticale(null);
  }, []);
  const aujourdHui = useMemo(() => new Date(), []);
  const dateLabel = aujourdHui.toLocaleDateString('fr-FR');
  const heureLabel = `${aujourdHui.getHours()}h${String(aujourdHui.getMinutes()).padStart(2, '0')}`;

  /* ————————————————— la carte de fidélité ————————————————— */
  const [nom, setNom] = useState(() => chargerNom(styleId));
  const [copie, setCopie] = useState(false);
  const nommer = (valeur: string) => {
    setNom(valeur);
    enregistrerNom(valeur, styleId);
  };

  /* ————————————————— le comptoir, en direct ————————————————— */
  /**
   * Le comptoir est **partagé** : les invités y prennent leurs lignes et y
   * demandent leurs morceaux, et la page des mariés se remplit toute seule
   * (voir `terminalLive.ts`). Sans base branchée, il vit dans le navigateur.
   */
  /* Un reçu arrive par son lien (`?recu=…`) : le comptoir le dépose lui-même. */
  const comptoir = useComptoir(styleId, codeRecu);
  const terminal = comptoir.etat;

  /** Ce que les composants demandent : un geste, appliqué et envoyé. */
  const majTerminal = (f: (etat: EtatTerminal) => EtatTerminal) => {
    const suivant = f(comptoir.etat);
    if (suivant === comptoir.etat) return;
    const geste = gesteDepuis(comptoir.etat, suivant);
    if (geste) comptoir.geste(geste);
  };

  /* ————————————————— la playlist du couple ————————————————— */
  const [playlist, setPlaylist] = useState<string[]>(() => chargerPlaylist(styleId));
  const morceaux = useMemo(() => morceauxDeLaPlaylist(playlist), [playlist]);
  const changerPlaylist = (suivant: string[]) => {
    setPlaylist(suivant);
    enregistrerPlaylist(suivant, styleId);
  };

  const couple = {
    noms: content.couple.names,
    date: formatDateLong(content.couple.date),
    venue: content.couple.venue,
    convives: content.couple.guests,
  };

  /** Collaboratif : on envoie la page telle quelle — chacun prend, chacun demande. */
  const partager = () => {
    const lien = typeof window === 'undefined' ? '' : window.location.href;
    void navigator.clipboard?.writeText(lien).then(() => {
      setCopie(true);
      window.setTimeout(() => setCopie(false), 2000);
    });
  };

  return (
    <div style={{ background: tons.papier, color: '#14130F' }}>
      {/* ═══════════════════════════ LE HERO ═══════════════════════════ */}
      <header id="hero" className="relative min-h-[100svh] overflow-hidden">
        <img src={style.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-[#0A0A0A]/35" />

        <div className="vp-page relative flex min-h-[100svh] flex-col justify-end pb-44 pt-24">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-black">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: style.accent }} />
              Leur univers · {style.name}
            </span>
            {page.signature && (
              <span className="inline-flex w-fit items-center rounded-full border border-white/25 bg-white/10 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
                {page.signature}
              </span>
            )}
          </div>

          <h1
            className="vp-title mt-6 max-w-[900px] text-white"
            style={{ fontSize: 'clamp(2.8rem, 8vw, 6rem)', lineHeight: 0.98 }}
          >
            {content.couple.names}
          </h1>

          <p className="mt-5 max-w-[620px] text-[16px] leading-relaxed text-white/75">
            {magazine.annonce} — {content.hero.subtitle}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
            {[
              { label: 'Date', valeur: `${formatDateLong(content.couple.date)} · ${daysUntil(content.couple.date)} jours` },
              { label: 'Lieu', valeur: `${content.couple.venue} · ${content.couple.city}` },
              { label: 'Invités', valeur: `${content.couple.guests} personnes` },
            ].map((info) => (
              <div key={info.label}>
                <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/45">{info.label}</div>
                <div className="mt-1 text-[13px] text-white/85">{info.valeur}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            <a
              href="#article"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-[#0C0C0C] no-underline transition hover:bg-white/90"
            >
              Lire l’article <ArrowRight size={14} />
            </a>
            <a
              href="#playlist"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-[13px] font-semibold text-white no-underline backdrop-blur transition hover:bg-white/20"
            >
              <Music2 size={14} /> La playlist
            </a>
            <a
              href="#recap"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-[13px] font-semibold text-white no-underline backdrop-blur transition hover:bg-white/20"
            >
              <Ticket size={14} /> Faire ses courses
            </a>
            <button
              type="button"
              onClick={partager}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-white/20"
            >
              {copie ? <Check size={14} /> : <Copy size={14} />}
              {copie ? 'Lien copié' : 'Envoyer aux invités'}
            </button>
          </div>

        </div>
      </header>

      {/* La bande, sous le hero : les univers, en cartes de playlist. */}
      <BandeDuHero
        libelle="Passer d’un univers à l’autre"
        styleId={style.id}
        cartes={cartesDesUnivers((univers) => `/le-mariage/${univers.id}`, style.id)}
      />

      {/* ═══════════ LA CARTE DE FIDÉLITÉ : le nom qui signe tout ═══════════ */}
      <section id="carte-fidelite" className="border-b border-black/10 bg-[#0A0A0A] py-4 text-white">
        <div className="vp-page flex flex-wrap items-center gap-x-5 gap-y-3">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
            Carte de fidélité
          </span>
          <label className="flex min-w-[240px] flex-1 items-center gap-3 rounded-full border border-white/20 bg-white/5 px-4 py-2">
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
              Votre nom
            </span>
            <input
              value={nom}
              onChange={(e) => nommer(e.target.value)}
              placeholder="Il signe vos prises et vos morceaux"
              className="min-w-0 flex-1 bg-transparent text-[13.5px] text-white outline-none placeholder:text-white/35"
            />
          </label>
          <span className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-wider text-white/55">
            <span
              className={`h-1.5 w-1.5 rounded-full ${comptoir.partage ? 'bg-emerald-400' : 'bg-white/40'}`}
              style={comptoir.partage ? { animation: 'pulse 1.6s ease-in-out infinite' } : undefined}
            />
            {etatDuComptoir(comptoir.partage, comptoir.invites.length)}
            {' '}· {terminal.prises.length} prise{terminal.prises.length > 1 ? 's' : ''}
            {' '}· {terminal.demandes.length} morceau{terminal.demandes.length > 1 ? 'x' : ''}
          </span>
          <a
            href="#recap"
            className="rounded-full bg-white px-4 py-2 text-[12.5px] font-bold text-[#0C0C0C] no-underline transition hover:bg-white/90"
          >
            Faire ses courses
          </a>
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/35">
            {signataire(nom)} au comptoir
          </span>
        </div>
      </section>

      {/* ═══════════════════════ 1 · L'ARTICLE DU MAGAZINE ═══════════════════════ */}
      <article id="article" className="vp-page py-20 sm:py-28">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#14130F] pb-3">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.28em]">SUPER MARIAGE · Le magazine</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45">
            Numéro 07 · {content.couple.city} · {formatDateLong(content.couple.date)}
          </span>
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: style.accent }}>
              {page.signature || 'Le reportage'}
            </span>

            <h2
              className="vp-title mt-4 max-w-[760px]"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', lineHeight: 1.04 }}
            >
              {magazine.titre}
            </h2>

            <p className="mt-6 max-w-[640px] text-[17px] leading-relaxed text-black/70">{style.synopsis}</p>

            <figure className="mt-10">
              <div className="overflow-hidden rounded-[6px] border border-black/10">
                <img src={style.image} alt="" className="h-[320px] w-full object-cover sm:h-[420px]" />
              </div>
              <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-2 border-t border-black/12 pt-2.5 font-mono text-[10.5px] uppercase tracking-wider text-black/45">
                <span>{content.couple.venue}, {content.couple.city}</span>
                <span>Photo · {style.name}</span>
              </figcaption>
            </figure>

            <div className="mt-10">
              <p className="text-[16.5px] leading-[1.75] text-black/80">
                <span
                  className="vp-title float-left mr-3 mt-1 leading-[0.8]"
                  style={{ fontSize: '4.4rem', color: style.accent }}
                >
                  {page.lettrineDe(content.couple.names)}
                </span>
                {magazine.texte(content.couple.names)}
              </p>

              <p className="mt-6 text-[16.5px] leading-[1.75] text-black/80">{style.manifesto}</p>

              <p className="mt-6 text-[16.5px] leading-[1.75] text-black/80">
                Le jour J se tient à {content.couple.venue} — {content.menu.service.toLowerCase()}, {content.couple.guests} convives. {content.rsvp.invitation}.
              </p>

              <div className="mt-10 border-y-2 border-[#14130F] py-6">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.24em]">En bref</div>
                <div className="mt-4 grid gap-5 sm:grid-cols-3">
                  {[
                    { label: 'Dress code', valeur: content.couple.dressCode },
                    { label: 'Saison', valeur: content.couple.season },
                    { label: 'Couverts', valeur: `${content.couple.guests} invités · ${content.menu.service}` },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-black/40">{item.label}</div>
                      <div className="mt-1 text-[13.5px] leading-snug">{item.valeur}</div>
                    </div>
                  ))}
                </div>
                <p className="mt-5 border-t border-black/12 pt-4 text-[13.5px] leading-relaxed text-black/60">
                  {magazine.surtitre} · Menu : {content.menu.items.slice(0, 3).join(' · ')}.
                </p>
              </div>
            </div>
          </div>

          {/* La colonne de droite : l'univers, puis les univers voisins */}
          <aside className="lg:sticky lg:top-8">
            <div className="rounded-[4px] border border-black/12 p-5">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em]">L’univers choisi</div>
              <div className="mt-3 flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-full" style={{ background: style.accent }} />
                <span className="text-[15px] font-semibold">{style.name}</span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-black/60">{style.tagline}</p>
              <div className="mt-4 overflow-hidden rounded-[3px]">
                <img src={style.image} alt="" className="h-[150px] w-full object-cover" />
              </div>
              <p className="mt-3 border-t border-black/12 pt-3 text-[12.5px] leading-relaxed text-black/60">
                {style.manifesto}
              </p>
              <p className="mt-3 border-t border-black/12 pt-3 font-mono text-[10.5px] uppercase tracking-wider text-black/45">
                Entrée dans le magasin : {magasin.nom} · à partir de {aPartirDe(styleId)}
              </p>
            </div>

            {voisins.length > 0 && (
              <div className="mt-6 rounded-[4px] border border-black/12 p-5">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em]">Les univers voisins</div>
                <div className="mt-3 space-y-3">
                  {voisins.slice(0, 3).map((voisin) => (
                    <Link key={voisin.id} to={`/le-mariage/${voisin.id}`} className="flex items-center gap-3 no-underline">
                      <img src={voisin.image} alt="" className="h-12 w-12 shrink-0 rounded-[3px] object-cover" />
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-semibold text-[#14130F]">{voisin.name}</span>
                        <span className="block truncate text-[11.5px] text-black/50">{voisin.tagline}</span>
                      </span>
                    </Link>
                  ))}
                </div>
                <a
                  href="#univers"
                  className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider text-black/50 no-underline transition hover:text-black"
                >
                  Tous les univers
                </a>
              </div>
            )}

            <p className="mt-6 font-mono text-[10.5px] leading-relaxed uppercase tracking-wider text-black/35">
              Texte, photo et mise en page composés depuis leur site. Aucune ligne n’est inventée.
            </p>
          </aside>
        </div>
      </article>

      {/* ═══════════════════════ 2 · LE PROGRAMME DU JOUR ═══════════════════════ */}
      <section id="programme" className="border-t border-black/10 py-20 sm:py-24" style={{ background: tons.carte }}>
        <div className="vp-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-black/40">Le programme</span>
              <h2 className="vp-title mt-3 text-[30px] leading-tight sm:text-[40px]">
                {scenes.length} moments, chacun son morceau.
              </h2>
            </div>
            <p className="max-w-[380px] text-[13px] leading-relaxed text-black/55">
              Chaque moment du jour J porte sa carte musicale : le morceau s’écoute vraiment, depuis les
              fichiers de la bande-son.
            </p>
          </div>

          <div className="mt-12 space-y-10">
            {scenes.map((scene, i) => {
              const track = trackForText(`${scene.title} ${scene.ambianceDetail ?? ''}`, []);
              return (
                <div
                  key={`${scene.time}-${scene.title}`}
                  className="grid gap-5 border-t border-black/10 pt-6 sm:grid-cols-[92px_minmax(0,1fr)_280px] sm:gap-8"
                >
                  <div className="font-mono text-[22px] font-bold tabular-nums text-black/85">{scene.time}</div>

                  <div>
                    <div className="text-[19px] font-semibold leading-snug">{scene.title}</div>
                    {scene.narrativeScript && (
                      <p className="mt-2 text-[14.5px] leading-relaxed text-black/60">{scene.narrativeScript}</p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-black/40">
                      <span>Moment {String(i + 1).padStart(2, '0')}</span>
                      {scene.ambianceDetail && <span>{scene.ambianceDetail}</span>}
                      {scene.vendorRoles?.[0] && <span>{scene.vendorRoles[0].role}</span>}
                    </div>
                  </div>

                  <div className="sm:pt-0.5">
                    {track ? (
                      <MusicCard track={track} accent={style.accent} />
                    ) : (
                      <div className="rounded-[18px] border border-dashed border-black/15 px-4 py-5 text-center text-[12px] text-black/40">
                        Ce moment se vit en silence.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ 3 · LA PLAYLIST COLLABORATIVE ═══════════════════════ */}
      <PlaylistCollaborative
        style={style}
        styleId={styleId}
        playlist={playlist}
        onPlaylist={changerPlaylist}
        terminal={terminal}
        onTerminal={majTerminal}
        nom={nom}
      />

      {/* ═══════════════════════ 4 · LES MÉTIERS DE L'UNIVERS ═══════════════════════ */}
      <ComplementaryThemes currentStyle={style} />

      {/* ═══════════════════════ 5 · LE RÉCAP, EN TICKET ═══════════════════════ */}
      {/* Côté invités : on prend une ligne, le reçu s'imprime. Côté mariés : le
          comptoir, le journal des reçus, et le terminal que le DJ récupère. */}
      <RecapCourses
        styleId={styleId}
        style={style}
        magasin={magasin}
        couple={couple}
        dateLabel={dateLabel}
        heureLabel={heureLabel}
        morceaux={morceaux}
        terminal={terminal}
        onTerminal={majTerminal}
        nom={nom}
        fond={tons.carte}
        comptoir={{ partage: comptoir.partage, invites: comptoir.invites, rafraichir: comptoir.rafraichir, remettreAZero: comptoir.remettreAZero }}
      />

      {/* ═══════════════════════ 6 · LES AUTRES UNIVERS ═══════════════════════ */}
      <UniversPagesGrid currentStyleId={styleId} />

      {/* ═══════════════════════ LE PIED ═══════════════════════ */}
      <footer className="bg-[#0A0A0A] pb-20 text-white">
        <div className="vp-page border-t border-white/10 pt-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Sparkles size={15} className="text-white/50" />
              <span className="text-[13px] text-white/70">
                Cette page suffit pour un mariage : l’article, le programme, la musique, les métiers,
                le récap.
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px]">
              <Link to="/creer" className="font-semibold text-white no-underline hover:underline">
                Créer ma carte
              </Link>
              <Link
                to={`/apercu?style=${styleId}`}
                className="font-semibold text-white/80 no-underline hover:underline"
              >
                Le mini-site
              </Link>
              <Link to="/prestataire" className="font-semibold text-white/80 no-underline hover:underline">
                Espace prestataire
              </Link>
              <Link to="/shop" className="font-semibold text-white/80 no-underline hover:underline">
                Faire ses courses
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
