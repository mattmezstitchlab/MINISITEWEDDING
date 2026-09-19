import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Camera, Check, Copy, KeyRound, Loader2, UserRound } from 'lucide-react';
import WeddingCard from '../components/WeddingCard';
import { apiGet } from '../lib/http';
import { prepareCardPhoto } from '../lib/cardPhoto';
import {
  createCard,
  hasPersonKey,
  joinWedding,
  listMyMemberships,
  personToCard,
  updateCard,
} from '../lib/people';
import { ROLE_GROUPS } from '../lib/spaceDraft';
import { styleById } from '../lib/weddingStyles';
import { formatDateLong } from '../lib/format';
import { DAY_EVENTS, accessForRole, savedOrEmpty, saveCard, type CardData } from '../lib/weddingCard';
import type { Person, WeddingSite } from '../lib/types';

/**
 * REJOINDRE LE MARIAGE — la porte de l’invité
 *
 * Un lien, un QR code, et deux questions : qui êtes-vous dans ce mariage, et
 * comment vous appelez-vous. Pas de mot de passe, pas de formulaire de vingt
 * champs : rejoindre crée une carte, et la carte se remplit plus tard, à son
 * rythme (`/carte`).
 *
 * Le rôle proposé vient de la même taxonomie que partout ailleurs : ajouter un
 * métier se fait dans les données, jamais ici.
 */

type Etat = 'chargement' | 'ferme' | 'role' | 'identite' | 'fait' | 'deja';

export default function Invitation() {
  const { slug = '' } = useParams();
  const [etat, setEtat] = useState<Etat>('chargement');
  const [site, setSite] = useState<WeddingSite | null>(null);
  const [roleId, setRoleId] = useState('');
  const [metiers, setMetiers] = useState(false);
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [photo, setPhoto] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState('');
  const [carte, setCarte] = useState<CardData | null>(null);
  const [cleNouvelle, setCleNouvelle] = useState('');
  const fichier = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let vivant = true;
    void (async () => {
      try {
        const mariage = await apiGet<WeddingSite>(`/api/wedding-sites?slug=${encodeURIComponent(slug)}`);
        if (!vivant) return;
        setSite(mariage);

        if (hasPersonKey()) {
          // Déjà une carte : reste-t-il une place dans ce mariage ?
          const mes = await listMyMemberships().catch(() => []);
          if (!vivant) return;
          if (mes.some((m) => Number(m.member.site_id) === Number(mariage.id))) {
            setRoleId(mes.find((m) => Number(m.member.site_id) === Number(mariage.id))?.member.role_id ?? '');
            setEtat('deja');
            return;
          }
        }
        setEtat('role');
      } catch {
        if (vivant) setEtat('ferme');
      }
    })();
    return () => {
      vivant = false;
    };
  }, [slug]);

  const pros = ROLE_GROUPS.find((g) => g.label === 'Protagonistes')?.roles ?? [];
  const metiersDuMariage = ROLE_GROUPS.filter((g) => g.label !== 'Protagonistes').flatMap((g) => g.roles);
  const roleChoisi = [...pros, ...metiersDuMariage].find((r) => r.id === roleId);

  const choisirPhoto = async (file?: File) => {
    if (!file) return;
    try {
      setPhoto(await prepareCardPhoto(file));
    } catch {
      setErreur('Cette image n’a pas pu être lue.');
    }
  };

  const rejoindre = async () => {
    if (!site) return;
    setEnvoi(true);
    setErreur('');
    try {
      const base: CardData = {
        ...savedOrEmpty(),
        firstName: prenom.trim(),
        lastName: nom.trim(),
        photo,
        roleId,
        access: accessForRole(roleId),
        partner1: site.partner1,
        partner2: site.partner2,
        date: site.wedding_date ?? '',
        venue: site.venue ?? '',
        city: site.city ?? '',
        styleId: site.style,
        events: DAY_EVENTS.map((e) => e.id),
      };

      let personne: Person;
      if (hasPersonKey()) {
        personne = await updateCard(base);
      } else {
        const creee = await createCard(base);
        personne = creee.person;
        setCleNouvelle(creee.key);
      }

      await joinWedding({ slug }, roleId);
      saveCard(base);
      setCarte(personToCard(personne, base));
      setEtat('fait');
    } catch (err) {
      setErreur(err instanceof Error ? err.message : 'Impossible de rejoindre ce mariage pour l’instant.');
    } finally {
      setEnvoi(false);
    }
  };

  const copierCle = async () => {
    try {
      await navigator.clipboard.writeText(cleNouvelle);
      setErreur('');
    } catch {
      setErreur('Copiez la clé à la main : elle ne sera plus affichée.');
    }
  };

  const style = styleById(site?.style ?? 'traditionnel');
  const names = site ? [site.partner1, site.partner2].filter(Boolean).join(' & ') : '';

  /* — l’attente — */
  if (etat === 'chargement') {
    return (
      <div className="vp-env flex min-h-screen items-center justify-center">
        <span className="flex items-center gap-2 text-[14px] text-[var(--vp-muted)]">
          <Loader2 size={16} className="animate-spin" /> Ouverture de l’invitation…
        </span>
      </div>
    );
  }

  /* — un mariage qui n’est pas encore ouvert — */
  if (etat === 'ferme' || !site) {
    return (
      <div className="vp-env flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <span className="vp-eyebrow">Invitation</span>
        <h1 className="vp-title mt-3 text-[clamp(1.7rem,4vw,2.4rem)]">Ce mariage n’est pas encore ouvert</h1>
        <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-[var(--vp-muted)]">
          Un lien d’invitation ne fonctionne qu’une fois le site publié par les mariés. Si vous avez reçu ce lien
          d’eux, demandez-leur de publier leur site.
        </p>
        <Link to="/carte" className="vp-btn vp-press mt-6">
          Créer ma carte <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div className="vp-env min-h-screen">
      <nav className="sticky top-3 z-40 mx-auto w-[calc(100%-1rem)] max-w-5xl sm:top-4">
        <div className="vp-glass vp-spec flex items-center justify-between gap-3 rounded-[26px] px-4 py-2.5 sm:px-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="vp-title text-[18px] font-bold italic tracking-wider">VOWS</span>
            <span className="hidden text-[11.5px] font-semibold uppercase tracking-[0.18em] text-[var(--vp-muted)] sm:inline">
              Invitation
            </span>
          </Link>
          <Link to={`/p/${slug}`} className="vp-btn vp-btn-glass vp-press">
            Voir le site
          </Link>
        </div>
      </nav>

      <header className="relative mx-4 mt-4 overflow-hidden rounded-[28px] bg-[#0B0C12] sm:mx-8">
        <img src={style.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
        <div className="relative px-6 py-12 text-center text-white sm:px-10 sm:py-16">
          <span className="vp-eyebrow !text-white/70">Vous êtes invité</span>
          <h1 className="vp-title mt-4 text-white" style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)' }}>
            {names}
          </h1>
          <p className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[14.5px] text-white/75">
            {site.wedding_date && <span className="capitalize">{formatDateLong(site.wedding_date)}</span>}
            {(site.venue || site.city) && <span>{[site.venue, site.city].filter(Boolean).join(', ')}</span>}
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-8">
        {/* — déjà des nôtres — */}
        {etat === 'deja' && (
          <section className="rounded-[26px] border border-black/8 bg-white p-6 text-center sm:p-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/12 px-3.5 py-1.5 text-[12.5px] font-semibold text-emerald-700">
              <Check size={14} /> Vous êtes déjà des nôtres
            </span>
            <h2 className="vp-title mt-4 text-[clamp(1.5rem,3.4vw,2rem)]">
              Votre place{roleChoisi ? ` de ${roleChoisi.title.toLowerCase()}` : ''} est déjà prise
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-[var(--vp-muted)]">
              Votre carte figure dans les personnes du mariage. Vous pouvez la compléter à tout moment : elle dit qui
              vous êtes, ce que vous mangez, comment vous venez.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link to={`/mariage/${slug}`} className="vp-btn vp-press">
                Les personnes du mariage <ArrowRight size={15} />
              </Link>
              <Link to="/carte" className="vp-btn vp-btn-glass vp-press">
                Compléter ma carte
              </Link>
            </div>
          </section>
        )}

        {/* — question 1 : qui êtes-vous — */}
        {etat === 'role' && (
          <section className="rounded-[26px] border border-black/8 bg-white p-6 sm:p-8">
            <span className="vp-eyebrow">Première question</span>
            <h2 className="vp-title mt-3 text-[clamp(1.6rem,3.6vw,2.2rem)]">Qui êtes-vous dans ce mariage ?</h2>
            <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-[var(--vp-muted)]">
              C’est votre rôle qui décide de ce que votre carte montre — et de ce qu’elle garde pour vous.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {pros.map((role) => {
                const actif = roleId === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    aria-pressed={actif}
                    onClick={() => {
                      setRoleId(role.id);
                      setMetiers(false);
                    }}
                    className={`rounded-[20px] border p-4 text-left transition ${
                      actif
                        ? 'border-[var(--vp-ink)] bg-white shadow-[0_12px_34px_-20px_rgba(11,12,18,0.5)]'
                        : 'border-black/10 bg-white/70 hover:border-black/30'
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-[14.5px] font-bold text-[var(--vp-ink)]">{role.title}</span>
                      {actif && <Check size={15} className="shrink-0 text-emerald-600" />}
                    </span>
                    <span className="mt-1 block text-[12.5px] leading-snug text-[var(--vp-muted)]">{role.tagline}</span>
                  </button>
                );
              })}

              <button
                type="button"
                aria-pressed={metiers}
                onClick={() => {
                  setMetiers(true);
                  setRoleId('');
                }}
                className={`rounded-[20px] border p-4 text-left transition ${
                  metiers
                    ? 'border-[var(--vp-ink)] bg-white shadow-[0_12px_34px_-20px_rgba(11,12,18,0.5)]'
                    : 'border-black/10 bg-white/70 hover:border-black/30'
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-[14.5px] font-bold text-[var(--vp-ink)]">Un métier du mariage</span>
                  {roleId && !pros.some((p) => p.id === roleId) && <Check size={15} className="shrink-0 text-emerald-600" />}
                </span>
                <span className="mt-1 block text-[12.5px] leading-snug text-[var(--vp-muted)]">
                  Photographe, traiteur, DJ, fleuriste, planner…
                </span>
              </button>
            </div>

            {metiers && (
              <div className="mt-5 rounded-[20px] bg-black/[0.035] p-4">
                <span className="vp-label">Lequel ?</span>
                <div className="flex flex-wrap gap-2">
                  {metiersDuMariage.map((role) => {
                    const actif = roleId === role.id;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        aria-pressed={actif}
                        onClick={() => setRoleId(role.id)}
                        className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition ${
                          actif ? 'bg-[var(--vp-ink)] text-white' : 'bg-white text-[var(--vp-ink)] hover:bg-black/[0.06]'
                        }`}
                      >
                        {role.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-7 flex items-center justify-between gap-4">
              <span className="text-[12.5px] text-[var(--vp-muted)]">
                {roleChoisi ? `Votre rôle : ${roleChoisi.title}` : 'Choisissez un rôle pour continuer'}
              </span>
              <button
                type="button"
                onClick={() => setEtat('identite')}
                disabled={!roleId}
                className="vp-btn vp-press !px-7"
              >
                Continuer <ArrowRight size={16} />
              </button>
            </div>
          </section>
        )}

        {/* — question 2 : votre nom — */}
        {etat === 'identite' && (
          <section className="rounded-[26px] border border-black/8 bg-white p-6 sm:p-8">
            <span className="vp-eyebrow">Seconde question</span>
            <h2 className="vp-title mt-3 text-[clamp(1.6rem,3.6vw,2.2rem)]">Comment vous appelle-t-on ?</h2>
            <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-[var(--vp-muted)]">
              C’est le nom qui apparaîtra sur votre carte. Le reste — ville, métier, disponibilité, repas — peut
              attendre : vous le compléterez quand vous voudrez.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[var(--vp-ink)]">
                {photo ? (
                  <img src={photo} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-[12px] font-semibold text-white">
                    Photo
                  </span>
                )}
              </div>
              <button type="button" onClick={() => fichier.current?.click()} className="vp-btn vp-btn-glass vp-press">
                <Camera size={15} /> Ajouter ma photo
              </button>
              {photo && (
                <button type="button" onClick={() => setPhoto('')} className="text-[12.5px] text-[var(--vp-muted)] underline">
                  Retirer
                </button>
              )}
              <input
                ref={fichier}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => choisirPhoto(e.target.files?.[0])}
              />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="vp-label">Prénom</span>
                <input
                  className="vp-field"
                  value={prenom}
                  placeholder="Clara"
                  onChange={(e) => setPrenom(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="vp-label">Nom</span>
                <input className="vp-field" value={nom} placeholder="Mez" onChange={(e) => setNom(e.target.value)} />
              </label>
            </div>

            {erreur && <p className="mt-4 text-[13px] font-medium text-[#B3261E]">{erreur}</p>}

            <div className="mt-7 flex items-center justify-between gap-4">
              <button type="button" onClick={() => setEtat('role')} className="vp-btn vp-btn-glass vp-press">
                Retour
              </button>
              <button
                type="button"
                onClick={rejoindre}
                disabled={!prenom.trim() || envoi}
                className="vp-btn vp-press !px-7"
              >
                {envoi ? <Loader2 size={16} className="animate-spin" /> : <UserRound size={16} />}
                Rejoindre le mariage
              </button>
            </div>

            <p className="mt-4 text-[11.5px] leading-snug text-[var(--vp-muted)]">
              En rejoignant, vous créez votre carte. Elle reçoit une clé personnelle — elle s’affiche une seule fois,
              et c’est elle qui vous permettra de la modifier plus tard, sur cet appareil ou un autre.
            </p>
          </section>
        )}

        {/* — c’est fait — */}
        {etat === 'fait' && carte && (
          <section className="grid gap-6 sm:grid-cols-[minmax(0,320px)_minmax(0,1fr)] sm:items-start">
            <WeddingCard card={carte} compact />
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/12 px-3.5 py-1.5 text-[12.5px] font-semibold text-emerald-700">
                <Check size={14} /> Bienvenue
              </span>
              <h2 className="vp-title mt-4 text-[clamp(1.5rem,3.4vw,2rem)]">
                Votre carte a rejoint {names}
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-[var(--vp-muted)]">
                Elle apparaît maintenant dans les personnes du mariage, avec les autres. Vous pourrez la compléter —
                votre disponibilité, votre repas, votre mobilité — quand vous voudrez.
              </p>

              {cleNouvelle && (
                <div className="mt-5 rounded-[18px] bg-[#0B0C12] p-4 text-white">
                  <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/50">
                    <KeyRound size={12} /> Votre clé personnelle
                  </div>
                  <p className="mt-1.5 text-[12.5px] leading-snug text-white/70">
                    Elle s’affiche une seule fois. Sans elle, personne ne peut modifier votre carte — ni vous, sur un
                    autre appareil.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <code className="min-w-0 flex-1 truncate rounded-[12px] bg-white/10 px-3 py-2 font-mono text-[12px]">
                      {cleNouvelle}
                    </code>
                    <button type="button" onClick={copierCle} className="vp-btn vp-press shrink-0">
                      <Copy size={14} /> Copier
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                <Link to={`/mariage/${slug}`} className="vp-btn vp-press">
                  Les personnes du mariage <ArrowRight size={15} />
                </Link>
                <Link to="/carte" className="vp-btn vp-btn-glass vp-press">
                  Compléter ma carte
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
