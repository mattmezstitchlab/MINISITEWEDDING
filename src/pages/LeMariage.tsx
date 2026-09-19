import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Check, ExternalLink, Minus, Music2, Plus, Printer, Search, Sparkles, Ticket, X,
} from 'lucide-react';
import MusicCard from '../components/MusicCard';
import TicketCaisse from '../components/TicketCaisse';
import ComplementaryThemes from '../components/ComplementaryThemes';
import MiniSiteRail from '../components/MiniSiteRail';
import { contentFor } from '../lib/universeContent';
import { getComplementaryStyles, styleById } from '../lib/weddingStyles';
import { getScenesForStyle } from '../lib/themeTimelineScenarios';
import { THEME_CONFIGS } from '../lib/themeConfigs';
import { trackForText } from '../lib/weddingSoundtrack';
import { daysUntil, formatDateLong } from '../lib/format';
import {
  CATALOGUE, chargerPlaylist, chercherMorceaux, enregistrerPlaylist,
  morceauxDeLaPlaylist, repartitionParMoment,
} from '../lib/weddingPlaylist';
import {
  ARTICLES, PACKAGES, RAYONS, euros, lignesDuTicket, numeroDeTicket, prixDeLArticle, totalCaisse,
} from '../lib/superMariage';

/**
 * LE MARIAGE, EN ENTIER
 *
 * Une seule page verticale, bien espacée, qui rassemble ce que le site sait
 * faire de mieux — et qui suffirait pour un mariage entier :
 *
 *  1. le hero, avec leur univers ;
 *  2. l'article de magazine : leur histoire, leur univers, les univers voisins ;
 *  3. le programme du jour, chaque moment avec sa carte musicale ;
 *  4. la playlist collaborative : on cherche, on ajoute, on écoute ;
 *  5. les métiers qui font tourner l'univers, en bande qui défile ;
 *  6. le récap, en ticket de caisse — une checklist qui se calcule ;
 *  7. les autres univers, en vrai, dans la main.
 *
 * L'univers de la page est le Supermarché 22H : c'est lui qui porte le ticket,
 * et c'est le plus insolite à montrer d'un bout à l'autre.
 */

const STYLE_ID = 'supermarche';

/** La checklist de départ : ce qui est déjà prévu pour ce mariage. */
const CHECKLIST_DEPART: string[] = [
  ...RAYONS.find((r) => r.key === 'rayon-horaires')!.articles.map((a) => a.id),
  'metier-Régisseur Négociateur Espaces Publics',
  'metier-Photographe Pop-Flash 90s',
  'metier-Chef Tapas & Finger Food Étoilé',
  'sup-caddie',
  'sup-neon',
  'sup-camera',
  'sup-manteaux',
  'sup-brunch',
];

export default function LeMariage() {
  const style = styleById(STYLE_ID);
  const content = useMemo(() => contentFor(style), [style]);
  const scenes = useMemo(() => getScenesForStyle(STYLE_ID), []);
  const editorial = THEME_CONFIGS[STYLE_ID].editorial;
  const voisins = getComplementaryStyles(style);

  const aujourdHui = useMemo(() => new Date(), []);
  const dateLabel = aujourdHui.toLocaleDateString('fr-FR');
  const heureLabel = `${aujourdHui.getHours()}h${String(aujourdHui.getMinutes()).padStart(2, '0')}`;

  /* ————————————————— la playlist ————————————————— */
  const [playlist, setPlaylist] = useState<string[]>(() => chargerPlaylist());
  const [requete, setRequete] = useState('');
  const morceaux = useMemo(() => morceauxDeLaPlaylist(playlist), [playlist]);
  const resultats = useMemo(() => chercherMorceaux(requete), [requete]);
  const moments = useMemo(() => repartitionParMoment(morceaux), [morceaux]);

  const basculerMorceau = (id: string) => {
    setPlaylist((prev) => {
      const suivant = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      enregistrerPlaylist(suivant);
      return suivant;
    });
  };

  /* ————————————————— la checklist et son ticket ————————————————— */
  const [coches, setCoches] = useState<string[]>(CHECKLIST_DEPART);
  const [menu, setMenu] = useState<string | null>('super-caddie');
  const [valide, setValide] = useState(false);

  const total = useMemo(() => totalCaisse(coches, menu), [coches, menu]);
  const lignes = useMemo(() => lignesDuTicket(coches, menu), [coches, menu]);
  const numero = useMemo(() => numeroDeTicket(coches, menu), [coches, menu]);

  const basculerArticle = (id: string) => {
    setValide(false);
    setCoches((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const articlesChoisis = new Set(coches);

  return (
    <div className="bg-[#FBFAF8] text-[#14130F]">
      {/* ═══════════════════════════ LE HERO ═══════════════════════════ */}
      <header className="relative min-h-[88svh] overflow-hidden">
        <img src={style.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-[#0A0A0A]/35" />

        <div className="relative mx-auto flex min-h-[88svh] max-w-[1180px] flex-col justify-end px-6 pb-16 pt-24">
          <Link
            to="/"
            className="absolute left-6 top-8 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 no-underline transition hover:text-white"
          >
            ← VOWS
          </Link>

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-black">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: style.accent }} />
            Leur univers · {style.name}
          </span>

          <h1
            className="mt-6 max-w-[900px] text-white"
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 'clamp(2.8rem, 8vw, 6rem)',
              lineHeight: 0.98,
              letterSpacing: '-0.03em',
            }}
          >
            {content.couple.names}
          </h1>

          <p className="mt-5 max-w-[620px] text-[16px] leading-relaxed text-white/75">
            {editorial.hero_subtitle} — {content.hero.subtitle}
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
              <Ticket size={14} /> Le récap
            </a>
          </div>
        </div>
      </header>

      {/* ═══════════════════════ 1 · L'ARTICLE DU MAGAZINE ═══════════════════════ */}
      <article id="article" className="mx-auto max-w-[1080px] px-6 py-20 sm:py-28">
        {/* La manchette */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#14130F] pb-3">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.28em]">VOWS · Le magazine</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45">
            Numéro 07 · {content.couple.city} · {formatDateLong(content.couple.date)}
          </span>
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: '#0A7F45' }}>
              Le reportage
            </span>

            <h2
              className="mt-4 max-w-[760px]"
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 'clamp(2rem, 5vw, 3.4rem)',
                lineHeight: 1.04,
                letterSpacing: '-0.02em',
              }}
            >
              {editorial.story_title}
            </h2>

            <p className="mt-6 max-w-[640px] text-[17px] leading-relaxed text-black/70">
              {style.synopsis}
            </p>

            {/* L'image du reportage, encadrée, avec sa légende */}
            <figure className="mt-10">
              <div className="overflow-hidden rounded-[6px] border border-black/10">
                <img src={style.image} alt="" className="h-[320px] w-full object-cover sm:h-[420px]" />
              </div>
              <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-2 border-t border-black/12 pt-2.5 font-mono text-[10.5px] uppercase tracking-wider text-black/45">
                <span>{content.couple.venue}, {content.couple.city}</span>
                <span>Photo · {style.name}</span>
              </figcaption>
            </figure>

            {/* Le corps, en colonnes, comme un vrai papier */}
            <div className="mt-10">
              <p
                className="text-[16.5px] leading-[1.75] text-black/80"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                <span
                  className="float-left mr-3 mt-1 leading-[0.8]"
                  style={{ fontFamily: 'Georgia, serif', fontSize: '4.4rem', color: '#0A7F45' }}
                >
                  {editorial.story_text(content.couple.names.split(' & ')[0] ?? 'I', content.couple.names.split(' & ')[1] ?? 'L').slice(0, 1)}
                </span>
                {editorial.story_text(
                  content.couple.names.split(' & ')[0] ?? 'Ils',
                  content.couple.names.split(' & ')[1] ?? 'eux',
                )}
              </p>

              <p className="mt-6 text-[16.5px] leading-[1.75] text-black/80">
                {style.manifesto}
              </p>

              <p className="mt-6 text-[16.5px] leading-[1.75] text-black/80">
                {content.hero.title} — {content.hero.title.toLowerCase().includes('céréales')
                  ? 'le rayon 7, la caisse 3, le parking : tout est déjà là.'
                  : 'les néons, les caddies, et la caisse 3 comme table d’honneur.'}{' '}
                {content.rsvp.invitation}
              </p>

              {/* L'encadré du jour J, à la manière des magazines */}
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
            </div>

            {voisins.length > 0 && (
              <div className="mt-6 rounded-[4px] border border-black/12 p-5">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em]">
                  Les univers voisins
                </div>
                <div className="mt-3 space-y-3">
                  {voisins.slice(0, 3).map((voisin) => (
                    <Link
                      key={voisin.id}
                      to={`/apercu?style=${voisin.id}`}
                      target="_blank"
                      className="flex items-center gap-3 no-underline"
                    >
                      <img
                        src={voisin.image}
                        alt=""
                        className="h-12 w-12 shrink-0 rounded-[3px] object-cover"
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-semibold text-[#14130F]">{voisin.name}</span>
                        <span className="block truncate text-[11.5px] text-black/50">{voisin.tagline}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <p className="mt-6 font-mono text-[10.5px] leading-relaxed uppercase tracking-wider text-black/35">
              Texte, photo et mise en page composés depuis leur site. Aucune ligne n’est inventée.
            </p>
          </aside>
        </div>
      </article>

      {/* ═══════════════════════ 2 · LE PROGRAMME DU JOUR ═══════════════════════ */}
      <section id="programme" className="border-t border-black/10 bg-white px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-[1080px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-black/40">
                Le programme
              </span>
              <h2 className="mt-3 text-[30px] font-semibold leading-tight tracking-[-0.02em] sm:text-[40px]">
                Cinq moments, cinq morceaux.
              </h2>
            </div>
            <p className="max-w-[380px] text-[13px] leading-relaxed text-black/55">
              Chaque moment du jour J porte sa carte musicale : le morceau s’écoute vraiment, depuis
              les fichiers de la bande-son.
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
      <section id="playlist" className="border-t border-black/10 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-[1080px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-black/40">
                La playlist
              </span>
              <h2 className="mt-3 text-[30px] font-semibold leading-tight tracking-[-0.02em] sm:text-[40px]">
                Cherchez un morceau, ajoutez-le.
              </h2>
            </div>
            <p className="max-w-[380px] text-[13px] leading-relaxed text-black/55">
              {morceaux.length} morceau{morceaux.length > 1 ? 'x' : ''} dans la playlist ·{' '}
              {CATALOGUE.filter((m) => !m.suggere).length} s’écoutent ici, les autres sont suggérés.
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
            {/* Les résultats */}
            <div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
                {requete ? `${resultats.length} résultat${resultats.length > 1 ? 's' : ''}` : 'Tout le catalogue'}
              </div>

              <div className="mt-4 space-y-2.5">
                {resultats.length === 0 && (
                  <p className="rounded-[16px] border border-dashed border-black/15 px-4 py-6 text-center text-[13px] text-black/45">
                    Rien pour « {requete} ». Essayez « bal », « cocktail », « Piaf »…
                  </p>
                )}

                {resultats.map((morceau) => {
                  const dedans = playlist.includes(morceau.id);
                  return (
                    <div
                      key={morceau.id}
                      className="flex items-center gap-3.5 rounded-[16px] border border-black/10 bg-white p-2.5"
                    >
                      <img src={morceau.cover} alt="" className="h-12 w-12 shrink-0 rounded-[12px] object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13.5px] font-semibold">{morceau.title}</div>
                        <div className="truncate text-[11.5px] text-black/55">
                          {morceau.artiste} · {morceau.moment}
                        </div>
                      </div>

                      <span
                        className="hidden shrink-0 rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider sm:block"
                        style={{
                          background: morceau.suggere ? 'rgba(12,14,24,0.05)' : `${style.accent}22`,
                          color: morceau.suggere ? 'rgba(12,14,24,0.5)' : '#0A7F45',
                        }}
                      >
                        {morceau.suggere ? 'Suggéré' : 'Extrait'}
                      </span>

                      <button
                        type="button"
                        onClick={() => basculerMorceau(morceau.id)}
                        aria-label={dedans ? `Retirer ${morceau.title}` : `Ajouter ${morceau.title}`}
                        className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[12px] font-semibold transition ${
                          dedans
                            ? 'bg-black text-white hover:bg-neutral-800'
                            : 'border border-black/15 text-black/70 hover:border-black hover:text-black'
                        }`}
                      >
                        {dedans ? <Check size={13} /> : <Plus size={13} />}
                        {dedans ? 'Ajouté' : 'Ajouter'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* La playlist, en cartes musicales */}
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
                        <Minus size={12} />
                      </button>
                      {!morceau.suggere && morceau.spotifyId && (
                        <a
                          href={`https://open.spotify.com/track/${morceau.spotifyId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="absolute bottom-3 right-3 text-black/30 transition hover:text-black"
                          title="L’original sur Spotify"
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>

                <p className="mt-4 border-t border-black/10 pt-3 font-mono text-[10px] uppercase leading-relaxed tracking-wider text-black/35">
                  La playlist reste sur cet appareil · chaque invité peut ajouter la sienne
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ 4 · LES MÉTIERS DE L'UNIVERS ═══════════════════════ */}
      <ComplementaryThemes currentStyle={style} />

      {/* ═══════════════════════ 5 · LE RÉCAP, EN TICKET ═══════════════════════ */}
      <section id="recap" className="border-t border-black/10 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-[1080px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-black/40">
                Le récap
              </span>
              <h2 className="mt-3 text-[30px] font-semibold leading-tight tracking-[-0.02em] sm:text-[40px]">
                Tout ce qui est préparé, sur un ticket.
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => { setValide(false); setCoches(CHECKLIST_DEPART); }}
                className="rounded-full border border-black/12 px-4 py-2 text-[12px] font-semibold text-black/65 transition hover:border-black/30"
              >
                Repartir du départ
              </button>
              <button
                type="button"
                onClick={() => { setCoches(ARTICLES.map((a) => a.id)); setValide(true); }}
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
                <Printer size={13} /> Valider
              </button>
            </div>
          </div>

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
            {/* La checklist */}
            <div className="space-y-8">
              {RAYONS.map((rayon) => (
                <section key={rayon.key}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-black/12 pb-2.5">
                    <h3 className="font-mono text-[11.5px] font-bold uppercase tracking-[0.18em]">{rayon.label}</h3>
                    <span className="font-mono text-[10.5px] text-black/40">
                      {rayon.articles.filter((a) => articlesChoisis.has(a.id)).length} / {rayon.articles.length}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5">
                    {rayon.articles.map((article) => {
                      const coche = articlesChoisis.has(article.id);
                      return (
                        <label
                          key={article.id}
                          className={`flex cursor-pointer items-center gap-3 rounded-[12px] px-3 py-2 transition ${
                            coche ? 'bg-white shadow-sm ring-1 ring-black/8' : 'hover:bg-black/[0.025]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={coche}
                            onChange={() => basculerArticle(article.id)}
                            className="h-4 w-4 shrink-0 accent-[#0A7F45]"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13px] font-medium">{article.label}</span>
                            <span className="block truncate text-[11px] text-black/45">{article.detail}</span>
                          </span>
                          <span className="shrink-0 font-mono text-[12px] tabular-nums text-black/70">
                            {euros(prixDeLArticle(article))}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </section>
              ))}

              {/* Le menu */}
              <section>
                <div className="border-b border-black/12 pb-2.5 font-mono text-[11.5px] font-bold uppercase tracking-[0.18em]">
                  Le menu
                </div>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
                  {PACKAGES.map((pkg) => {
                    const actif = menu === pkg.id;
                    return (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => { setValide(false); setMenu(actif ? null : pkg.id); }}
                        className={`rounded-[14px] border p-3 text-left transition ${
                          actif ? 'border-transparent bg-[#0C0C0C] text-white' : 'border-black/12 hover:border-black/30'
                        }`}
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-[13px] font-semibold">Menu {pkg.name}</span>
                          <span className="font-mono text-[12px] tabular-nums">{euros(pkg.prix)}</span>
                        </div>
                        <p className={`mt-1.5 text-[11.5px] leading-snug ${actif ? 'text-white/65' : 'text-black/50'}`}>
                          {pkg.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Le ticket */}
            <div className="lg:sticky lg:top-8">
              <TicketCaisse
                lignes={lignes}
                total={total}
                numero={numero}
                dateLabel={dateLabel}
                heureLabel={heureLabel}
                paye={valide}
              />
              <p className="mt-4 text-center font-mono text-[10.5px] uppercase tracking-wider text-black/35">
                Tarifs indicatifs — rien n’est facturé
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ 6 · LES AUTRES UNIVERS ═══════════════════════ */}
      {/* ═══════════════════════ 6 · LES AUTRES UNIVERS ═══════════════════════ */}
      {/* Le vrai site, écran par écran : la bande des téléphones, telle quelle. */}
      <MiniSiteRail />

      {/* ═══════════════════════ LE PIED ═══════════════════════ */}
      <footer className="bg-[#0A0A0A] px-6 pb-20 text-white">
        <div className="mx-auto max-w-[1080px] border-t border-white/10 pt-10">
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
              <Link to="/apercu?style=supermarche" className="font-semibold text-white/80 no-underline hover:underline">
                Le mini-site
              </Link>
              <Link to="/prestataire" className="font-semibold text-white/80 no-underline hover:underline">
                Espace prestataire
              </Link>
              <Link to="/supermarriage" className="font-semibold text-white/80 no-underline hover:underline">
                Faire ses courses
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
