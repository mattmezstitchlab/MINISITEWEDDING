import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Loader2, MapPin, Music2, PenLine, Sparkles, Ticket, Users } from 'lucide-react';
import HeroEnchaine from '../components/HeroEnchaine';
import ManifestePersonne from '../components/ManifestePersonne';
import UniversDeLaPersonne from '../components/UniversDeLaPersonne';
import WeddingCard from '../components/WeddingCard';
import { Timbre } from '../components/Timbre';
import {
  chargerProfil, idDeProfil, nomDePersonne, personneDeLaCarte, slugDePersonne, type MariageDeProfil,
} from '../lib/profil';
import { cardKindLabel, cardName, readCard, savedOrEmpty, type CardData } from '../lib/weddingCard';
import { chargerSelection, enchainement, enchainementDeSecours, useSelection } from '../lib/selection';
import { personToCard } from '../lib/people';
import { styleById } from '../lib/weddingStyles';
import { roleTitle, isCoupleRole } from '../lib/spaceDraft';
import { domaineDuMetier, donneesMetier, modulesDuMetier, type MetierData, type MetierModule } from '../lib/vendorModules';
import { formatDateLong } from '../lib/format';
import { slugDeRole } from '../lib/metierPage';
import type { Person } from '../lib/types';

/**
 * LA PAGE D'UNE PERSONNE
 *
 * **Son hero, c'est elle** : l'enchaînement de ses univers, avec les cartes
 * associées aux cartes qu'elle a choisies sur l'accueil — chaque carte retenue y
 * entre **dans l'ordre**. Sous le hero, **son manifeste** (le même texte que
 * l'accueil, vu de sa place), puis **ses univers** : la suite de ses clics, où
 * l'ordre se règle à la main.
 *
 * Viennent ensuite son **timbre** en guise de photo de profil, son rôle, ce
 * qu'elle apporte, ses mariages, ses liens, et sa carte en entier.
 *
 * Tout le monde en a une : l'invité comme le marié, le photographe comme le DJ.
 * C'est la même page, dans la langue de chacun.
 */

/** La date écrite court : « 12.06.2027 », comme sur un timbre. */
function dateCourte(date: string): string {
  const [a, m, j] = (date ?? '').split('-');
  return a && m && j ? `${j}.${m}.${a}` : '';
}

/** Le mariage où la carte a sa place principale : le premier publié. */
function mariagePrincipal(mariages: MariageDeProfil[]): MariageDeProfil | null {
  return mariages.find((m) => m.site?.style) ?? mariages[0] ?? null;
}

export default function PageProfil() {
  const { slug = '' } = useParams<{ slug: string }>();
  const id = idDeProfil(slug);
  const [etat, setEtat] = useState<'chargement' | 'pret' | 'absent'>('chargement');
  const [person, setPerson] = useState<Person | null>(null);
  const [mariages, setMariages] = useState<MariageDeProfil[]>([]);
  const [carte, setCarte] = useState<CardData | null>(null);
  /** La carte n'est pas (encore) publiée : la page le dit, sans se cacher. */
  const [brouillon, setBrouillon] = useState(false);
  /** Les cartes choisies sur l'accueil : c'est la matière du hero. */
  const selection = useSelection();

  useEffect(() => {
    let vivant = true;
    if (!id) return;
    void (async () => {
      const profil = await chargerProfil(id);
      if (!vivant) return;
      if (!profil) {
        /**
         * Rien en ligne : la **carte locale** prend le relais. La page d'une
         * personne existe dès qu'elle a une carte ici — même non publiée —
         * parce que son hero, lui, est déjà fait de ses clics d'accueil.
         */
        const locale = readCard();
        const choix = chargerSelection();
        if (locale && (cardName(locale).trim() !== '' || choix.length > 0)) {
          setPerson(personneDeLaCarte(id, locale));
          setCarte(locale);
          setBrouillon(true);
          setEtat('pret');
          return;
        }
        setEtat('absent');
        return;
      }
      /** La carte : ce que le réseau a gardé, monté sur un formulaire vide. */
      const principal = mariagePrincipal(profil.memberships);
      const base = savedOrEmpty();
      const universDeLaCarte = String((profil.person.card ?? {}).styleId ?? '');
      setCarte(
        personToCard(profil.person, {
          ...base,
          styleId: principal?.site?.style || universDeLaCarte || base.styleId,
          partner1: principal?.site?.partner1 ?? base.partner1,
          partner2: principal?.site?.partner2 ?? base.partner2,
          date: principal?.site?.wedding_date ?? base.date,
          venue: principal?.site?.venue ?? base.venue,
          city: principal?.site?.city ?? base.city,
          roleId: principal?.role_id || base.roleId,
        }),
      );
      setPerson(profil.person);
      setMariages(profil.memberships);
      setEtat('pret');
    })();
    return () => {
      vivant = false;
    };
  }, [id]);

  const mariage = mariagePrincipal(mariages);
  const style = styleById(mariage?.site?.style ?? '');
  const nom = person ? nomDePersonne(person) : '';
  const role = roleTitle(mariage?.role_id ?? '') ?? person?.trade ?? '';
  /** Un rôle de métier : ni les mariés, ni les invités. */
  const estMetier = Boolean(role) && !isCoupleRole(mariage?.role_id ?? '');
  const donnees: MetierData | null = role && estMetier ? donneesMetier(style, role) : null;
  const modules: MetierModule[] = donnees ? modulesDuMetier(donnees) : [];
  const domaine = role && estMetier ? domaineDuMetier(role) : null;
  const etatAffiche = id ? etat : 'absent';

  /**
   * **L'ENCHAÎNEMENT** : les cartes choisies sur l'accueil, dans l'ordre du
   * clic. Sans un seul clic, le hero montre l'univers de son mariage — il y a
   * toujours un hero, jamais un trou.
   */
  const choisies = enchainement(selection);
  const chaine = choisies.length > 0 ? choisies : enchainementDeSecours(mariage?.site?.style || carte?.styleId || '');

  if (etatAffiche === 'chargement') {
    return (
      <div className="vp-env flex min-h-[60vh] items-center justify-center">
        <span className="flex items-center gap-2 text-[14px] text-[var(--vp-muted)]">
          <Loader2 size={16} className="animate-spin" /> Ouverture de la page…
        </span>
      </div>
    );
  }

  if (etatAffiche === 'absent' || !person || !carte) {
    return (
      <div className="vp-env vp-page flex min-h-[70vh] flex-col items-center justify-center pb-24 pt-28 text-center">
        <span className="vp-eyebrow">Page d’une personne</span>
        <h1 className="vp-title mt-3 text-[clamp(1.7rem,4vw,2.4rem)]">Cette page n’existe pas encore</h1>
        <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-[var(--vp-muted)]">
          Une page naît d’une carte : créez la vôtre, et la voici — son timbre, son univers, son rôle.
        </p>
        <Link to="/carte" className="vp-btn vp-press mt-6">
          Créer ma carte <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  const dateMariage = mariage?.site?.wedding_date ?? '';
  const dateCarte = dateCourte(dateMariage || carte.date);
  const initiales = `${person.first_name[0] ?? ''}${person.last_name[0] ?? ''}`.toUpperCase();

  return (
    <div className="vp-env min-h-screen">
      {/* ══════════ LE HERO ENCHAÎNÉ : ses univers, ses cartes, son ordre ══════════ */}
      <header className="relative">
        <HeroEnchaine cartes={chaine} eyebrow={brouillon ? 'Son hero · brouillon' : 'Son hero'}>
          {brouillon && (
            <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/25 px-3 py-1 text-[11.5px] text-white/75">
              <PenLine size={12} /> Brouillon — cette carte n’est pas encore publiée
            </p>
          )}
          <h1 className="vp-title mt-2 text-white" style={{ fontSize: 'clamp(1.9rem, 5vw, 3.2rem)' }}>
            {nom || 'Votre nom'}
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13.5px] text-white/75">
              {role && (
                <span className="inline-flex items-center gap-1.5">
                  <BadgeCheck size={14} /> {role}
                </span>
              )}
              {person.home_city && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} /> {person.home_city}
                </span>
              )}
              {mariage?.site && (
                <span className="capitalize">
                  {mariage.site.partner1} &amp; {mariage.site.partner2}
                  {dateMariage ? ` · ${formatDateLong(dateMariage)}` : ''}
                </span>
              )}
          </p>
        </HeroEnchaine>

        {/* LE TIMBRE : la photo de profil du réseau, posée sur la couverture */}
        <div className="vp-page flex flex-wrap items-end gap-4">
          <div className="-mt-14 sm:-mt-16">
            <Timbre
              photo={person.photo}
              label="Son timbre"
              nom={person.first_name}
              date={dateCarte}
              accent={style.accent}
              penche={-2}
              largeur={148}
              initiales={initiales}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 pb-1">
            <Link to="/carte" className="vp-btn vp-press">
              Compléter ma carte
            </Link>
            {estMetier && (
              <Link to={`/metiers/${slugDeRole(role)}`} className="vp-btn vp-btn-glass vp-press">
                Sa page de métier <ArrowRight size={14} />
              </Link>
            )}
            {mariage?.site?.slug && (
              <Link to={`/p/${mariage.site.slug}`} className="vp-btn vp-btn-glass vp-press">
                Le site du mariage
              </Link>
            )}
          </div>
        </div>

        {(person.bio || person.trade) && (
          <div className="vp-page pt-6">
            {person.trade && (
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">
                {person.trade}
              </div>
            )}
            {person.bio && <p className="mt-2 max-w-[640px] text-[16px] leading-relaxed text-black/75">{person.bio}</p>}
          </div>
        )}
      </header>

      {/* SON MANIFESTE : le même texte que l'accueil, vu de sa place. */}
      <ManifestePersonne
        faits={{
          prenom: person.first_name || nom,
          role,
          ville: person.home_city,
          univers: style.name,
          date: dateMariage ? formatDateLong(dateMariage) : '',
        }}
        selection={selection}
      />

      <main className="vp-page py-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:items-start">
          <div className="space-y-10">
            {/* — SES UNIVERS : la suite de ses clics d'accueil, dans l'ordre — */}
            <UniversDeLaPersonne selection={selection} />

            {/* — SON UNIVERS PRINCIPAL : celui de son mariage, avec sa page — */}
            <section>
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-black/45">
                L’univers de son mariage
              </div>
              <h2 className="vp-title mt-3 text-[clamp(1.4rem,3.2vw,2rem)]">
                {style.name} — {style.tagline}
              </h2>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  to={mariage?.site?.style ? `/mariage/${mariage.site.style}` : '/le-mariage'}
                  className="vp-btn vp-btn-glass vp-press"
                >
                  La page de l’univers <ArrowRight size={14} />
                </Link>
                {estMetier && domaine && (
                  <Link to={`/metiers/${slugDeRole(role)}`} className="vp-btn vp-btn-glass vp-press">
                    {domaine.label} · sa page de métier
                  </Link>
                )}
              </div>
            </section>

            {/* — CE QU'IL APPORTE — */}
            {estMetier && modules.length > 0 && (
              <section>
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-black/45">
                  Ce qu’il apporte au mariage
                </div>
                <h2 className="vp-title mt-3 text-[clamp(1.4rem,3.2vw,2rem)]">
                  {donnees?.mission?.mission ?? 'Sa mission, dans la langue du mariage'}
                </h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {modules.slice(0, 6).map((m) => (
                    <div key={m.titre} className="rounded-[18px] border border-black/8 bg-white p-4">
                      <div className="flex items-center gap-2 text-[13px] font-bold">
                        <Sparkles size={13} style={{ color: style.accent }} /> {m.titre}
                      </div>
                      {m.lignes.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {m.lignes.slice(0, 3).map((l) => (
                            <li key={l.label} className="flex items-baseline justify-between gap-3 text-[12px] text-black/60">
                              <span className="truncate">{l.label}</span>
                              <span className="shrink-0 font-semibold text-black/75">{l.valeur}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* — SES MARIAGES — */}
            <section>
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-black/45">
                {mariages.length > 1 ? `Ses mariages · ${mariages.length}` : 'Son mariage'}
              </div>
              <div className="mt-4 space-y-2.5">
                {mariages.length === 0 && (
                  <p className="rounded-[16px] border border-dashed border-black/15 px-4 py-6 text-[13px] text-black/50">
                    Aucun mariage publié pour l’instant : la carte attend sa place.
                  </p>
                )}
                {mariages.map((m) => (
                  <div
                    key={m.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-black/8 bg-white p-4"
                  >
                    <div className="min-w-0">
                      <div className="text-[14px] font-bold">
                        {m.site?.partner1} &amp; {m.site?.partner2}
                      </div>
                      <div className="mt-0.5 text-[12.5px] text-black/55">
                        {roleTitle(m.role_id) ?? m.role_id}
                        {m.site?.wedding_date ? ` · ${formatDateLong(m.site.wedding_date)}` : ''}
                        {m.site?.city ? ` · ${m.site.city}` : ''}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {m.site?.slug && (
                        <Link to={`/p/${m.site.slug}`} className="vp-btn vp-btn-glass vp-press">
                          Voir le site
                        </Link>
                      )}
                      <Link to={`/mariage/${m.site?.slug ?? ''}`} className="vp-btn vp-btn-glass vp-press">
                        <Users size={13} /> Les personnes
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* — SES LIENS — */}
            {(person.website || person.social || person.email || person.phone) && (
              <section>
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-black/45">
                  Ses liens
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[person.website, person.social, person.email, person.phone]
                    .filter(Boolean)
                    .map((lien) => (
                      <span
                        key={lien}
                        className="rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-black/70"
                      >
                        {lien}
                      </span>
                    ))}
                </div>
              </section>
            )}
          </div>

          {/* — SA CARTE, EN ENTIER — */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-black/45">
              Sa carte · {cardKindLabel(carte)}
            </div>
            <div className="mt-4">
              <WeddingCard card={carte} redacted={person.redacted} />
            </div>
            <p className="mt-3 flex items-start gap-2 text-[11.5px] leading-snug text-black/50">
              <Ticket size={13} className="mt-0.5 shrink-0" />
              La même carte que dans le mariage : son verso est un ticket, son recto ce qu’elle montre de
              elle. Le retourner ne change rien pour personne.
            </p>
            {/* Ce qui vient de la musique : la carte parle au terminal */}
            {carte.music && estMetier && (
              <p className="mt-3 flex items-start gap-2 text-[11.5px] leading-snug text-black/50">
                <Music2 size={13} className="mt-0.5 shrink-0" />
                Sa contribution musicale rejoint la playlist du mariage.
              </p>
            )}
          </aside>
        </div>

        {/* — L'ADRESSE DE LA PAGE — */}
        <section className="mt-14 rounded-[22px] border border-black/8 bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-black/45">
                Votre page
              </div>
              <p className="mt-2 text-[14px] text-black/70">
                Chaque carte a son adresse : elle s’envoie, se partage, et dit qui vous êtes dans ce mariage.
              </p>
            </div>
            <code className="rounded-[12px] bg-black/[0.04] px-3.5 py-2 font-mono text-[12px] text-black/70">
              /profil/{slugDePersonne(person)}
            </code>
          </div>
        </section>
      </main>
    </div>
  );
}
