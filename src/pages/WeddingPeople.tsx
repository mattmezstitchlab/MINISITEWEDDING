import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Loader2, Users } from 'lucide-react';
import WeddingCard from '../components/WeddingCard';
import { slugDePersonne } from '../lib/profil';
import { apiGet } from '../lib/http';
import { listWeddingMembers, personToCard } from '../lib/people';
import { DAY_EVENTS, EMPTY_CARD, accessForRole, type CardData } from '../lib/weddingCard';
import { ROLE_GROUPS, roleTitle } from '../lib/spaceDraft';
import { styleById } from '../lib/weddingStyles';
import { formatDateLong } from '../lib/format';
import type { WeddingMember, WeddingSite } from '../lib/types';

/**
 * LES PERSONNES DU MARIAGE
 *
 * La collection des cartes : chaque personne qui a rejoint le mariage y
 * apparaît avec sa carte, dans l'ordre où elle est arrivée. On peut la
 * retourner, comme la sienne.
 *
 * Ce que chacun voit est décidé par le serveur, pas ici : quelqu'un qui n'est
 * pas membre d'un brouillon obtient « introuvable », et les coordonnées d'une
 * carte réservée arrivent vides — la carte écrit alors « réservé ».
 */

type Etat = 'chargement' | 'ouvert' | 'ferme';

/** La famille d'un rôle : « Image & Mémoire », « Protagonistes »… */
function familleDe(roleId: string): string {
  return ROLE_GROUPS.find((g) => g.roles.some((r) => r.id === roleId))?.label ?? 'Autres';
}

export default function WeddingPeople() {
  const { slug = '' } = useParams();
  const [etat, setEtat] = useState<Etat>('chargement');
  const [site, setSite] = useState<WeddingSite | null>(null);
  const [membres, setMembres] = useState<WeddingMember[]>([]);
  const [famille, setFamille] = useState('Toutes');

  useEffect(() => {
    let vivant = true;
    void (async () => {
      try {
        const mariage = await apiGet<WeddingSite>(`/api/wedding-sites?slug=${encodeURIComponent(slug)}`);
        const gens = await listWeddingMembers({ slug });
        if (!vivant) return;
        setSite(mariage);
        setMembres(gens);
        setEtat('ouvert');
      } catch {
        if (vivant) setEtat('ferme');
      }
    })();
    return () => {
      vivant = false;
    };
  }, [slug]);

  const familles = useMemo(() => {
    const presentes = new Set(membres.map((m) => familleDe(m.role_id)));
    return ['Toutes', ...[...presentes].sort()];
  }, [membres]);

  const visibles = useMemo(
    () => (famille === 'Toutes' ? membres : membres.filter((m) => familleDe(m.role_id) === famille)),
    [membres, famille],
  );

  const style = styleById(site?.style ?? EMPTY_CARD.styleId);
  const names = site ? [site.partner1, site.partner2].filter(Boolean).join(' & ') : '';

  /** La carte d'un membre : sa personne, dans le contexte de ce mariage. */
  const carteDe = (membre: WeddingMember): CardData =>
    personToCard(membre.person ?? ({} as never), {
      ...EMPTY_CARD,
      partner1: site?.partner1 ?? '',
      partner2: site?.partner2 ?? '',
      date: site?.wedding_date ?? '',
      venue: site?.venue ?? '',
      city: site?.city ?? '',
      styleId: site?.style ?? EMPTY_CARD.styleId,
      roleId: membre.role_id,
      access: accessForRole(membre.role_id),
      events: DAY_EVENTS.map((e) => e.id),
    });

  if (etat === 'chargement') {
    return (
      <div className="vp-env flex min-h-screen items-center justify-center">
        <span className="flex items-center gap-2 text-[14px] text-[var(--vp-muted)]">
          <Loader2 size={16} className="animate-spin" /> Ouverture du mariage…
        </span>
      </div>
    );
  }

  if (etat === 'ferme' || !site) {
    return (
      <div className="vp-env flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <span className="vp-eyebrow">Les personnes du mariage</span>
        <h1 className="vp-title mt-3 text-[clamp(1.7rem,4vw,2.4rem)]">Ce mariage n’est pas encore ouvert</h1>
        <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-[var(--vp-muted)]">
          Un brouillon ne se montre qu’à ses mariés et aux personnes qui l’ont déjà rejoint. Si vous avez reçu un
          lien, demandez-leur de publier leur site.
        </p>
        <Link to="/carte" className="vp-btn vp-press mt-6">
          Créer ma carte <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div className="vp-env flex min-h-screen flex-col">
      <nav className="sticky top-3 z-40 mx-auto w-[calc(100%-1rem)] max-w-6xl sm:top-4">
        <div className="vp-glass vp-spec flex flex-wrap items-center justify-between gap-3 rounded-[26px] px-4 py-2.5 sm:px-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="vp-title text-[18px] font-bold italic tracking-wider">SUPER MARIAGE</span>
            <span className="hidden text-[11.5px] font-semibold uppercase tracking-[0.18em] text-[var(--vp-muted)] sm:inline">
              Les personnes
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to={`/p/${slug}`} className="vp-btn vp-btn-glass vp-press">
              Le site
            </Link>
            <Link to="/carte" className="vp-btn vp-press">
              Ma carte <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </nav>

      <header className="relative mx-4 mt-4 overflow-hidden rounded-[28px] bg-[#0B0C12] sm:mx-8">
        <img src={style.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/35" />
        <div className="relative px-6 py-10 text-white sm:px-10 sm:py-14">
          <span className="vp-eyebrow !text-white/70">Les personnes du mariage</span>
          <h1 className="vp-title mt-3 text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>
            {names || 'Ce mariage'}
          </h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14.5px] text-white/75">
            {site.wedding_date && <span className="capitalize">{formatDateLong(site.wedding_date)}</span>}
            {(site.venue || site.city) && <span>{[site.venue, site.city].filter(Boolean).join(', ')}</span>}
            <span className="flex items-center gap-1.5">
              <Users size={14} /> {membres.length} {membres.length > 1 ? 'personnes' : 'personne'}
            </span>
          </p>
        </div>
      </header>

      <div className="vp-page py-10">
        {membres.length > 1 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {familles.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={famille === f}
                onClick={() => setFamille(f)}
                className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition ${
                  famille === f ? 'bg-[var(--vp-ink)] text-white' : 'bg-black/[0.045] text-[var(--vp-ink)] hover:bg-black/[0.08]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {membres.length === 0 ? (
          <div className="rounded-[22px] border border-black/8 bg-white p-8 text-center">
            <h2 className="text-[16px] font-bold text-[var(--vp-ink)]">Personne n’a encore rejoint ce mariage</h2>
            <p className="mx-auto mt-2 max-w-md text-[13.5px] leading-relaxed text-[var(--vp-muted)]">
              Chaque personne arrive avec sa carte. La première place est libre — et la collection se remplit dans
              l’ordre des arrivées.
            </p>
            <Link to="/carte" className="vp-btn vp-press mt-5">
              Créer ma carte <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visibles.map((membre) => (
              <div key={membre.id}>
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <span className="text-[13px] font-semibold text-[var(--vp-ink)]">
                    {roleTitle(membre.role_id) ?? membre.role_id}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--vp-muted)]">
                    {familleDe(membre.role_id)}
                  </span>
                </div>
                <WeddingCard
                  card={carteDe(membre)}
                  compact
                  redacted={membre.person?.redacted}
                  className="mx-auto w-full max-w-[360px]"
                />
                {/* Chaque carte a sa page : son timbre, son univers, ses mariages. */}
                {membre.person && (
                  <Link
                    to={`/profil/${slugDePersonne(membre.person)}`}
                    className="mx-auto mt-3 flex w-full max-w-[360px] items-center justify-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider text-[var(--vp-muted)] no-underline transition hover:text-[var(--vp-ink)]"
                  >
                    La page de {membre.person.first_name} <ArrowRight size={12} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
