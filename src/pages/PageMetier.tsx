import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowRight, BadgeCheck, Building2, Check, Copy, Radio, Sparkles, Users,
} from 'lucide-react';
import MusicCard from '../components/MusicCard';
import TicketCaisse from '../components/TicketCaisse';
import { contentFor } from '../lib/universeContent';
import { euros, lignesDuTicket, numeroDeTicket, totalCaisse } from '../lib/superMariage';
import { chargerPlaylist, morceauParId, morceauxDeLaPlaylist } from '../lib/weddingPlaylist';
import { planDj } from '../lib/weddingTicket';
import { useComptoir } from '../lib/terminalLive';
import BandeDuHero from '../components/BandeDuHero';
import { cartesDesMetiers } from '../lib/cartesVivantes';
import { metiersVoisins, pageMetier, resumeMetier, slugDeRole, type PageMetier as Donnees } from '../lib/metierPage';
import { formatDateLong } from '../lib/format';
import { DJ_CHRONOLOGICAL_PHASES } from '../lib/weddingDjPlaylist';

/**
 * LA PAGE D'UN MÉTIER — LA MÊME POUR TOUS
 *
 * Le DJ a désormais sa page entière, et les autres métiers aussi : le hero, le
 * récit, le jour J, la langue du métier, ses lignes sur le ticket, et les
 * métiers d'à côté. Rien n'est ressaisi : tout vient de la page du mariage —
 * programme, table, chiffres, playlist et comptoir des invités.
 */

export default function PageMetier() {
  const { slug } = useParams<{ slug: string }>();
  const page: Donnees | null = useMemo(() => (slug ? pageMetier(slug) : null), [slug]);

  if (!page) {
    return (
      <div className="vp-page flex min-h-[70svh] flex-col items-center justify-center gap-4 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-black/40">Métiers</span>
        <h1 className="vp-title text-[26px]">Ce métier n’existe pas encore</h1>
        <p className="max-w-[420px] text-[14px] leading-relaxed text-black/55">
          Chaque métier du catalogue a sa page — celle-ci n’est pas au répertoire.
        </p>
        <Link
          to="/le-mariage"
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-[13px] font-semibold text-white no-underline"
        >
          Voir la page du mariage <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return <PageMetierContenu page={page} />;
}

function PageMetierContenu({ page }: { page: Donnees }) {
  const { style, styleId, musique, dj } = page;
  const content = useMemo(() => contentFor(style), [style]);
  const [copie, setCopie] = useState(false);
  const voisins = useMemo(() => metiersVoisins(page), [page]);

  /* —————— le comptoir : ce que les invités ont demandé —————— */
  const comptoir = useComptoir(styleId);
  const morceaux = useMemo(() => morceauxDeLaPlaylist(chargerPlaylist(styleId)), [styleId]);
  const plan = useMemo(() => planDj(morceaux, comptoir.etat.demandes), [morceaux, comptoir.etat.demandes]);
  const demandes = comptoir.etat.demandes;

  /* —————— ses lignes sur le ticket du mariage —————— */
  const aujourdHui = useMemo(() => new Date(), []);
  const dateLabel = aujourdHui.toLocaleDateString('fr-FR');
  const heureLabel = `${aujourdHui.getHours()}h${String(aujourdHui.getMinutes()).padStart(2, '0')}`;
  // Ses lignes ne changent pas d'un rendu à l'autre : la page est déjà mémoïsée.
  const ids = page.lignes.map((a) => a.id);
  const lignes = lignesDuTicket(ids, null, page.lignes, []);
  const total = totalCaisse(ids, null, page.lignes, []);
  const numero = numeroDeTicket(ids, null, page.magasin.prefixe);

  const sommeDirecte = lignes.length;
  const demandesUniques = new Set(demandes.map((d) => d.cle)).size;

  return (
    <div className="bg-[#FBFAF8] text-[#14130F]">
      {/* ═══════════════════════════ LE HERO ═══════════════════════════ */}
      <header className="relative min-h-[100svh] overflow-hidden">
        <img src={style.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-[#0A0A0A]/35" />

        <div className="vp-page relative flex min-h-[100svh] flex-col justify-end pb-16 pt-24">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-black">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: style.accent }} />
              {page.domaine.label}
            </span>
            <span className="inline-flex w-fit items-center rounded-full border border-white/25 bg-white/10 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
              {style.name}
            </span>
            {page.musique && (
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
                <Radio size={11} /> Page du métier · en direct
              </span>
            )}
          </div>

          <h1
            className="vp-title mt-6 max-w-[900px] text-white"
            style={{ fontSize: 'clamp(2.4rem, 7vw, 5rem)', lineHeight: 1 }}
          >
            {page.short}
          </h1>
          <p className="mt-4 max-w-[640px] text-[15.5px] leading-relaxed text-white/75">
            {page.role !== page.short ? `${page.role} · ` : ''}{resumeMetier(page)} — au mariage de {content.couple.names}.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
            {[
              { label: 'Date', valeur: formatDateLong(content.couple.date) },
              { label: 'Lieu', valeur: `${content.couple.venue} · ${content.couple.city}` },
              { label: 'Convives', valeur: `${content.couple.guests} personnes` },
              { label: 'Univers', valeur: `${page.universes.length} au catalogue` },
            ].map((info) => (
              <div key={info.label}>
                <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/45">{info.label}</div>
                <div className="mt-1 text-[13px] text-white/85">{info.valeur}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            <Link
              to={`/le-mariage/${styleId}`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-[#0C0C0C] no-underline transition hover:bg-white/90"
            >
              La page du mariage <ArrowRight size={14} />
            </Link>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard?.writeText(window.location.href).then(() => {
                  setCopie(true);
                  window.setTimeout(() => setCopie(false), 2000);
                });
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-white/20"
            >
              {copie ? <Check size={14} /> : <Copy size={14} />}
              {copie ? 'Lien copié' : 'Envoyer au prestataire'}
            </button>
            <Link
              to={`/apercu?style=${styleId}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-[13px] font-semibold text-white no-underline transition hover:bg-white/20"
            >
              Le mini-site
            </Link>
          </div>

        </div>
      </header>

      {/* La bande, sous le hero : les métiers d'à côté. Le cœur y vaut pour un
          avis — la température du public sur le métier. */}
      <BandeDuHero
        libelle="Changer de métier"
        styleId={styleId}
        cartes={cartesDesMetiers(page, voisins.length)}
      />

      {/* ═══════════════ CE QUI VIENT DES MARIÉS : rien à ressaisir ═══════════════ */}
      <section className="border-b border-black/10 bg-white py-14 sm:py-16">
        <div className="vp-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-black/40">
                Venu des mariés
              </span>
              <h2 className="vp-h2 mt-3 text-[24px] sm:text-[30px]">
                Vous ne ressaisissez rien.
              </h2>
            </div>
            <p className="max-w-[420px] text-[13px] leading-relaxed text-black/55">
              Le programme, la table, les accès et les chiffres sortent de la page du mariage. Ils
              arrivent ici le jour où les mariés les publient.
            </p>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {page.partages.map((partage) => (
              <div key={partage.id} className="rounded-[18px] border border-black/10 bg-[#FBFAF8] p-4">
                <div className="flex items-center gap-2">
                  <BadgeCheck size={14} className="shrink-0 text-black/45" />
                  <span className="text-[13.5px] font-semibold">{partage.titre}</span>
                </div>
                <div className="mt-1 font-mono text-[9.5px] uppercase tracking-wider text-black/40">
                  {partage.origine}
                </div>
                <ul className="mt-3 space-y-1.5">
                  {partage.lignes.slice(0, 4).map((ligne) => (
                    <li key={`${partage.id}-${ligne.label}`} className="text-[12px] leading-snug">
                      <span className="font-mono text-[9.5px] uppercase tracking-wider text-black/40">
                        {ligne.label}
                      </span>
                      <span className="mt-0.5 block text-black/70">{ligne.valeur}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ LE RÉCIT DU MÉTIER ═══════════════════════ */}
      <article className="vp-page py-20 sm:py-24">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#14130F] pb-3">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.28em]">VOWS · Les métiers</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45">
            {page.domaine.label} · {style.name}
          </span>
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div>
            <h2
              className="vp-title max-w-[760px]"
              style={{ fontSize: 'clamp(1.8rem, 4.4vw, 3rem)', lineHeight: 1.05 }}
            >
              {page.recit.titre}
            </h2>
            <p className="mt-6 max-w-[640px] text-[16.5px] leading-relaxed text-black/70">{page.recit.texte}</p>

            {page.mission && (
              <div className="mt-8 border-l-2 pl-5" style={{ borderColor: style.accent }}>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40">Sa mission, écrite par l’univers</div>
                <p className="mt-2 text-[15px] leading-relaxed text-black/75">{page.mission.mission}</p>
                <p className="mt-2 text-[13px] text-black/50">Ce qu’on attend de lui : {page.mission.essentialSkill}.</p>
              </div>
            )}

            <div className="mt-10 border-y-2 border-[#14130F] py-6">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.24em]">En bref</div>
              <div className="mt-4 grid gap-5 sm:grid-cols-3">
                {[
                  { label: 'Domaine', valeur: page.domaine.label },
                  { label: 'Univers de référence', valeur: style.name },
                  { label: 'Sa ligne sur le ticket', valeur: page.prix > 0 ? euros(page.prix) : 'Sur devis' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-black/40">{item.label}</div>
                    <div className="mt-1 text-[13.5px] leading-snug">{item.valeur}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-8">
            <div className="rounded-[4px] border border-black/12 p-5">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em]">Le mariage</div>
              <div className="mt-3 text-[15px] font-semibold">{content.couple.names}</div>
              <p className="mt-1 text-[12.5px] text-black/55">
                {content.couple.venue} · {content.couple.city}
              </p>
              <div className="mt-4 overflow-hidden rounded-[3px]">
                <img src={style.image} alt="" className="h-[150px] w-full object-cover" />
              </div>
              <ul className="mt-4 space-y-2 border-t border-black/12 pt-3 text-[12.5px] text-black/65">
                <li className="flex items-start gap-2">
                  <Users size={13} className="mt-0.5 shrink-0 text-black/35" />
                  <span>{content.couple.guests} convives · {content.menu.service}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building2 size={13} className="mt-0.5 shrink-0 text-black/35" />
                  <span>{content.couple.season} · {content.couple.dressCode}</span>
                </li>
              </ul>
              <Link
                to={`/le-mariage/${styleId}`}
                className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider text-black/50 no-underline transition hover:text-black"
              >
                Ouvrir la page du mariage
              </Link>
            </div>

            {page.universes.length > 1 && (
              <div className="mt-6 rounded-[4px] border border-black/12 p-5">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em]">
                  Les univers qui l’appellent
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {page.universes.map((univers) => (
                    <Link
                      key={univers.id}
                      to={`/le-mariage/${univers.id}`}
                      className="rounded-full border border-black/12 px-2.5 py-1 text-[11px] font-semibold text-black/65 no-underline transition hover:border-black/35"
                    >
                      {univers.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </article>

      {/* ═══════════════════════ LE JOUR J, CHEZ LUI ═══════════════════════ */}
      <section className="border-t border-black/10 bg-white py-20 sm:py-24">
        <div className="vp-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-black/40">
                Le jour J
              </span>
              <h2 className="vp-h2 mt-3 text-[26px] sm:text-[34px]">
                Ses moments dans la journée.
              </h2>
            </div>
            <p className="max-w-[400px] text-[13px] leading-relaxed text-black/55">
              Le programme publié par les mariés, tel quel — avec sa mission rappelée à chaque étape.
            </p>
          </div>

          <div className="mt-10 space-y-8">
            {page.scenes.map((scene, i) => (
              <div
                key={`${scene.time}-${scene.title}`}
                className="grid gap-4 border-t border-black/10 pt-6 sm:grid-cols-[92px_minmax(0,1fr)] sm:gap-8"
              >
                <div className="font-mono text-[20px] font-bold tabular-nums text-black/85">{scene.time}</div>
                <div>
                  <div className="text-[17.5px] font-semibold leading-snug">{scene.title}</div>
                  {scene.narrativeScript && (
                    <p className="mt-2 max-w-[640px] text-[14px] leading-relaxed text-black/60">{scene.narrativeScript}</p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-black/40">
                    <span>Moment {String(i + 1).padStart(2, '0')}</span>
                    {scene.vendorRoles?.[0] && <span>{scene.vendorRoles[0].role}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sa langue : les modules du métier */}
          <div className="mt-16">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-black/40">
              Sa langue
            </span>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {page.modules.map((module) => (
                <div key={module.id} className="rounded-[18px] border border-black/10 bg-[#FBFAF8] p-5">
                  <div className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-black/40">
                    {module.eyebrow}
                  </div>
                  <div className="mt-2 text-[15px] font-semibold leading-snug">{module.titre}</div>
                  <ul className="mt-3 space-y-2">
                    {module.lignes.slice(0, 5).map((ligne) => (
                      <li key={`${module.id}-${ligne.label}`} className="text-[12.5px] leading-snug">
                        <span className="font-mono text-[9.5px] uppercase tracking-wider text-black/40">
                          {ligne.label}
                        </span>
                        <span className="mt-0.5 block text-black/70">{ligne.valeur}</span>
                      </li>
                    ))}
                  </ul>
                  {module.note && <p className="mt-3 text-[11.5px] leading-snug text-black/45">{module.note}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ LA MUSIQUE : la playlist, en direct depuis le comptoir ═══════════ */}
      {musique && (
        <section id="playlist" className="border-t border-black/10 py-20 sm:py-24">
          <div className="vp-page">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-black/40">
                  La playlist
                </span>
                <h2 className="vp-title mt-3 text-[26px] leading-tight sm:text-[34px]">
                  Ce que la soirée a demandé.
                </h2>
              </div>
              <p className="max-w-[420px] text-[13px] leading-relaxed text-black/55">
                Les invités choisissent sur la page du mariage, et les demandes arrivent ici —
                {' '}{demandesUniques} morceau{demandesUniques > 1 ? 'x' : ''} différent{demandesUniques > 1 ? 's' : ''},
                {' '}{demandes.length} demande{demandes.length > 1 ? 's' : ''}.
                <span className={`ml-1 ${comptoir.partage ? 'text-emerald-600' : 'text-black/40'}`}>
                  {comptoir.partage ? '● en direct' : '○ sur cet appareil'}
                </span>
              </p>
            </div>

            <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
              <div>
                {demandes.length === 0 ? (
                  <p className="rounded-[16px] border border-dashed border-black/15 px-5 py-8 text-center text-[13px] text-black/50">
                    Aucune demande d’invité pour l’instant. Elles apparaîtront ici dès le premier
                    morceau demandé.
                  </p>
                ) : (
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {demandes.map((demande) => {
                      const libelle = DJ_CHRONOLOGICAL_PHASES.find((p) => p.id === demande.phaseId)?.label;
                      return (
                        <div key={`${demande.cle}-${demande.nom}`}>
                          {/* Une demande arrive comme une carte musicale : le
                              morceau s'écoute quand il est au catalogue. */}
                          <MusicCard
                            track={
                              morceauParId(demande.cle) ?? {
                                title: demande.titre,
                                subtitle: demande.artiste || 'Titre proposé par un invité',
                                src: '',
                                cover: style.image,
                              }
                            }
                            accent={style.accent}
                            sousTitre={`${demande.artiste || 'Proposé'} · ${libelle ?? 'Bal'}`}
                            pastille="Proposé"
                            actions={
                              <span className="rounded-full bg-black/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-black/60">
                                Demandé par {demande.nom}
                              </span>
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Le socle du couple, en cartes musicales */}
                <div className="mt-10">
                  <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
                    Le socle du couple · {morceaux.length} morceaux
                  </div>
                  <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {morceaux.slice(0, 6).map((morceau) => (
                      <MusicCard key={morceau.id} track={morceau} accent={style.accent} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:sticky lg:top-8">
                <div className="text-center">
                  <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-black/45">
                    {dj ? 'Le terminal DJ' : 'La setlist à emporter'}
                  </div>
                </div>
                <TicketCaisse
                  variante="dj"
                  numero={`${page.magasin.prefixe}-DJ-${String(plan.reduce((n, b) => n + b.lignes.length, 0)).padStart(2, '0')}`}
                  dateLabel={dateLabel}
                  heureLabel={heureLabel}
                  paye
                  plan={plan}
                  nbMorceaux={morceaux.length}
                  nbDemandes={demandes.length}
                  magasin={page.magasin}
                  couple={{
                    noms: content.couple.names,
                    date: formatDateLong(content.couple.date),
                    venue: content.couple.venue,
                    convives: content.couple.guests,
                  }}
                />
                <p className="mt-4 text-center font-mono text-[10.5px] uppercase tracking-wider text-black/35">
                  Récupéré depuis la page du mariage · rien à ressaisir
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ LE TICKET : ses lignes sur le mariage ═══════════ */}
      <section id="ticket" className="border-t border-black/10 py-20 sm:py-24">
        <div className="vp-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-black/40">
                Le ticket
              </span>
              <h2 className="vp-h2 mt-3 text-[26px] sm:text-[34px]">
                Ce qui est prévu pour vous {sommeDirecte > 1 ? 's' : ''}.
              </h2>
            </div>
            <p className="max-w-[420px] text-[13px] leading-relaxed text-black/55">
              {page.rayon
                ? `Vos lignes viennent de « ${page.rayon.label} » du magasin des mariés, plus votre propre ligne.`
                : 'Votre ligne vient du magasin des mariés.'}
              {' '}Les mariés cochent, le ticket suit.
            </p>
          </div>

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
            <div className="space-y-2.5">
              {page.lignes.map((article) => (
                <div key={article.id} className="flex items-center gap-3.5 rounded-[16px] border border-black/10 bg-white p-3">
                  <BadgeCheck size={15} className="shrink-0 text-black/35" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-semibold">{article.label}</span>
                    <span className="block truncate text-[11.5px] text-black/55">{article.detail}</span>
                  </span>
                  <span className="shrink-0 font-mono text-[12.5px] tabular-nums text-black/70">
                    {euros(article.prix * (article.quantite ?? 1))}
                  </span>
                </div>
              ))}

              <p className="pt-3 font-mono text-[10px] uppercase leading-relaxed tracking-wider text-black/40">
                Tarifs indicatifs — rien n’est facturé. Un prestataire revendique sa ligne, les
                mariés la gardent ou la changent.
              </p>
            </div>

            <div className="lg:sticky lg:top-8">
              <TicketCaisse
                variante="metier"
                lignes={lignes}
                total={total}
                numero={numero}
                dateLabel={dateLabel}
                heureLabel={heureLabel}
                paye={lignes.length > 0}
                nom={page.short}
                sousTitre={`${page.domaine.label} · ${style.name}`}
                magasin={page.magasin}
                couple={{
                  noms: content.couple.names,
                  date: formatDateLong(content.couple.date),
                  venue: content.couple.venue,
                  convives: content.couple.guests,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ LES MÉTIERS D'À CÔTÉ ═══════════════════════ */}
      <section className="border-t border-black/10 bg-[#0A0A0A] py-20 text-white sm:py-24">
        <div className="vp-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
                Les métiers d’à côté
              </span>
              <h2
                className="vp-title mt-3 max-w-[720px] text-white"
                style={{ fontSize: 'clamp(1.7rem, 4vw, 2.6rem)', lineHeight: 1.06 }}
              >
                Chaque métier a sa page entière.
              </h2>
            </div>
            <p className="max-w-[420px] text-[13px] leading-relaxed text-white/60">
              Même programme, mêmes chiffres, mêmes demandes de morceaux : les pages se répondent —
              tout le monde travaille sur le même mariage.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {voisins.map((voisin) => (
              <Link
                key={voisin.slug}
                to={`/metiers/${voisin.slug}`}
                className="group flex items-center gap-3.5 rounded-[16px] border border-white/12 bg-white/5 p-3.5 no-underline transition hover:border-white/30 hover:bg-white/10"
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] font-mono text-[15px] font-bold text-[#0C0C0C]"
                  style={{ background: style.accent }}
                >
                  {voisin.short.slice(0, 1).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-semibold text-white">{voisin.short}</span>
                  <span className="block truncate text-[11.5px] text-white/55">{voisin.label}</span>
                </span>
                <ArrowRight size={14} className="shrink-0 text-white/35 transition group-hover:text-white" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ LE PIED ═══════════════════════ */}
      <footer className="bg-[#0A0A0A] pb-20 text-white">
        <div className="vp-page border-t border-white/10 pt-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Sparkles size={15} className="text-white/50" />
              <span className="text-[13px] text-white/70">
                {slugDeRole(page.role)} · page du métier, reliée à celle du mariage.
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px]">
              <Link to={`/le-mariage/${styleId}`} className="font-semibold text-white no-underline hover:underline">
                Le mariage, en entier
              </Link>
              <Link to="/prestataire" className="font-semibold text-white/80 no-underline hover:underline">
                Ouvrir l’éditeur
              </Link>
              <Link to="/creer" className="font-semibold text-white/80 no-underline hover:underline">
                Créer ma carte
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
