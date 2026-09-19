import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Camera,
  Check,
  Copy,
  KeyRound,
  Loader2,
  Lock,
  Share2,
  Sparkles,
  Trash2,
  UserPlus,
} from 'lucide-react';
import WeddingCard from '../components/WeddingCard';
import StylePicker from '../components/StylePicker';
import { prepareCardPhoto } from '../lib/cardPhoto';
import { styleById } from '../lib/weddingStyles';
import { slugDePersonne } from '../lib/profil';
import type { Person } from '../lib/types';
import { ROLE_GROUPS, roleTitle } from '../lib/spaceDraft';
import {
  adoptPersonKey,
  createCard,
  forgetKey,
  hasPersonKey,
  joinWedding,
  leaveWedding,
  listMyMemberships,
  loadMyCard,
  personToCard,
  updateCard,
  type Membership,
} from '../lib/people';
import {
  ALLERGENS,
  CARD_ACCESS,
  CONTACT_VISIBILITY,
  DAY_EVENTS,
  DIETS,
  MUSIC_MOODS,
  accessForRole,
  accessRole,
  cardCompletion,
  cardKind,
  cardSummary,
  maskIban,
  savedOrEmpty,
  saveCard,
  type CardData,
} from '../lib/weddingCard';

/**
 * MA CARTE
 *
 * Une page, une carte, deux faces. À gauche la carte se retourne, à droite on
 * la remplit — et **seuls les blocs qui concernent le rôle apparaissent** : un
 * invité ne voit jamais de tarif, un photographe jamais de régime alimentaire.
 *
 * Tout est enregistré à chaque frappe, dans ce navigateur. La carte deviendra
 * la table `people` du réseau quand les comptes s'ouvriront ; d'ici là, elle
 * n'invente rien et ne part nulle part.
 */

/* ------------------------------------------------------------ les morceaux */

function Bloc({ titre, indice, children }: { titre: string; indice?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[22px] border border-black/8 bg-white p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[15.5px] font-bold text-[var(--vp-ink)]">{titre}</h2>
        {indice && <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--vp-muted)]">{indice}</span>}
      </div>
      <div className="mt-4 space-y-3.5">{children}</div>
    </section>
  );
}

function Champ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  min,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  min?: number;
}) {
  return (
    <label className="block">
      <span className="vp-label">{label}</span>
      <input
        className="vp-field"
        type={type}
        min={min}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Choix({ label, options, value, onChange }: { label: string; options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  const basculer = (option: string) =>
    onChange(value.includes(option) ? value.filter((o) => o !== option) : [...value, option]);
  return (
    <div>
      <span className="vp-label">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const actif = value.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={actif}
              onClick={() => basculer(option)}
              className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition ${
                actif ? 'bg-[var(--vp-ink)] text-white' : 'bg-black/[0.045] text-[var(--vp-ink)] hover:bg-black/[0.08]'
              }`}
            >
              {actif ? `${option} ✓` : option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function CardStudio() {
  const [card, setCard] = useState<CardData>(() => savedOrEmpty());
  const [message, setMessage] = useState('');
  const [cle, setCle] = useState(() => hasPersonKey());
  const [cleNouvelle, setCleNouvelle] = useState('');
  const [cleSaisie, setCleSaisie] = useState('');
  const [reprendre, setReprendre] = useState(false);
  const [enregistrement, setEnregistrement] = useState<'repos' | 'encours' | 'ok' | 'erreur'>('repos');
  const [publication, setPublication] = useState(false);
  const [mariages, setMariages] = useState<Membership[]>([]);
  /** La personne en ligne : c'est elle qui a une page. */
  const [moi, setMoi] = useState<Person | null>(null);
  const [slug, setSlug] = useState('');
  const [roleJoint, setRoleJoint] = useState('');
  const [rejoint, setRejoint] = useState(false);
  const fichier = useRef<HTMLInputElement>(null);
  const minuteur = useRef<number | null>(null);
  const style = styleById(card.styleId);
  const kind = cardKind(card);
  const completion = cardCompletion(card);
  const estPrestataire = kind === 'prestataire';
  const estInvite = kind !== 'prestataire';

  /**
   * L'enregistrement en ligne attend une seconde et demie : on ne lance pas
   * une requête par lettre, et on n'attend pas non plus la fin de la saisie.
   */
  const planifier = (suivant: CardData) => {
    if (!hasPersonKey()) return;
    if (minuteur.current) window.clearTimeout(minuteur.current);
    setEnregistrement('encours');
    minuteur.current = window.setTimeout(() => {
      updateCard(suivant)
        .then(() => setEnregistrement('ok'))
        .catch(() => setEnregistrement('erreur'));
    }, 1500);
  };

  /** Chaque frappe est enregistrée : la carte ne se perd pas. */
  const set = (patch: Partial<CardData>) => {
    const suivant = { ...card, ...patch };
    saveCard(suivant);
    setCard(suivant);
    planifier(suivant);
  };

  /** Au retour : ce que le réseau garde fait autorité sur le brouillon local. */
  useEffect(() => {
    if (!hasPersonKey()) return;
    let vivant = true;
    void (async () => {
      try {
        const person = await loadMyCard();
        if (!vivant || !person) return;
        setMoi(person);
        setCard((base) => personToCard(person, base));
        const mes = await listMyMemberships();
        if (vivant) setMariages(mes);
      } catch {
        if (vivant) setEnregistrement('erreur');
      }
    })();
    return () => {
      vivant = false;
      if (minuteur.current) window.clearTimeout(minuteur.current);
    };
  }, []);

  const choisirPhoto = async (file?: File) => {
    if (!file) return;
    try {
      const photo = await prepareCardPhoto(file);
      set({ photo });
    } catch {
      setMessage('Cette image n’a pas pu être lue.');
      window.setTimeout(() => setMessage(''), 2600);
    }
  };

  const publier = async () => {
    setPublication(true);
    setMessage('');
    try {
      const { person, key } = await createCard(card);
      setMoi(person);
      setCle(true);
      setCleNouvelle(key);
      setEnregistrement('ok');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'La publication a échoué.');
    } finally {
      setPublication(false);
    }
  };

  const reprendreAvecCle = async () => {
    if (!cleSaisie.trim()) return;
    adoptPersonKey(cleSaisie.trim());
    setCle(true);
    setCleSaisie('');
    setReprendre(false);
    try {
      const person = await loadMyCard();
      if (person) setCard((base) => personToCard(person, base));
      setMariages(await listMyMemberships());
    } catch {
      setMessage('Cette clé n’a pas été reconnue.');
      forgetKey();
      setCle(false);
    }
  };

  const rejoindre = async () => {
    setRejoint(true);
    setMessage('');
    try {
      await joinWedding({ slug: slug.trim() }, roleJoint || card.roleId || 'invites');
      setMariages(await listMyMemberships());
      setSlug('');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Ce mariage n’a pas été trouvé.');
    } finally {
      setRejoint(false);
    }
  };

  const quitter = async (memberId: number) => {
    await leaveWedding(memberId);
    setMariages(await listMyMemberships());
  };

  const copierCle = async () => {
    try {
      await navigator.clipboard.writeText(cleNouvelle);
      setMessage('Clé copiée — gardez-la dans un endroit sûr.');
    } catch {
      setMessage('Copiez la clé à la main : elle ne sera plus affichée.');
    }
    window.setTimeout(() => setMessage(''), 3000);
  };

  const partager = async () => {
    const texte = cardSummary(card);
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title: 'Ma carte', text: texte });
        return;
      }
      await navigator.clipboard.writeText(texte);
      setMessage('Carte copiée — collez-la dans WhatsApp.');
    } catch {
      setMessage('Le partage n’est pas disponible ici.');
    }
    window.setTimeout(() => setMessage(''), 3000);
  };

  const blocs: Array<{ id: string; titre: string; indice?: string; contenu: React.ReactNode }> = [
    {
      id: 'personne',
      titre: 'La personne',
      indice: 'recto',
      contenu: (
        <>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[var(--vp-ink)]">
              {card.photo ? (
                <img src={card.photo} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-[13px] font-semibold text-white">
                  Photo
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => fichier.current?.click()} className="vp-btn vp-btn-glass vp-press">
                <Camera size={15} /> Choisir une photo
              </button>
              {card.photo && (
                <button type="button" onClick={() => set({ photo: '' })} className="vp-btn vp-btn-glass vp-press">
                  <Trash2 size={15} /> Retirer
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
          </div>
          <p className="text-[11.5px] leading-snug text-[var(--vp-muted)]">
            La photo est réduite dans votre navigateur et n’en sort pas. Sans photo, la carte affiche vos initiales —
            jamais le visage de quelqu’un d’autre.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <Champ label="Prénom" value={card.firstName} onChange={(v) => set({ firstName: v })} placeholder="Clara" />
            <Champ label="Nom" value={card.lastName} onChange={(v) => set({ lastName: v })} placeholder="Mez" />
            <Champ label="Ville" value={card.homeCity} onChange={(v) => set({ homeCity: v })} placeholder="Bouray-sur-Juine" />
            <Champ label="Métier / activité" value={card.trade} onChange={(v) => set({ trade: v })} placeholder="Saxophoniste" />
          </div>
          <label className="block">
            <span className="vp-label">Présentation courte</span>
            <textarea
              className="vp-field resize-none"
              rows={2}
              maxLength={140}
              value={card.bio}
              placeholder="Deux lignes, à la première personne."
              onChange={(e) => set({ bio: e.target.value })}
            />
          </label>

          <div>
            <span className="vp-label">Mon rôle dans le mariage</span>
            <div className="space-y-3">
              {ROLE_GROUPS.map((groupe) => (
                <div key={groupe.label}>
                  <div className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-[var(--vp-muted)]">
                    {groupe.label}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {groupe.roles.map((role) => {
                      const actif = card.roleId === role.id;
                      return (
                        <button
                          key={role.id}
                          type="button"
                          aria-pressed={actif}
                          onClick={() => set({ roleId: actif ? '' : role.id, access: accessForRole(role.id) })}
                          className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition ${
                            actif ? 'bg-[var(--vp-ink)] text-white' : 'bg-black/[0.045] text-[var(--vp-ink)] hover:bg-black/[0.08]'
                          }`}
                        >
                          {role.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="vp-label">Accès</span>
            <div className="flex flex-wrap gap-2">
              {CARD_ACCESS.map((acces) => {
                const actif = card.access === acces.id;
                return (
                  <button
                    key={acces.id}
                    type="button"
                    aria-pressed={actif}
                    onClick={() => set({ access: acces.id })}
                    className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition ${
                      actif ? 'bg-[var(--vp-ink)] text-white' : 'bg-black/[0.045] text-[var(--vp-ink)] hover:bg-black/[0.08]'
                    }`}
                  >
                    {acces.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[11.5px] text-[var(--vp-muted)]">
              {accessRole(card.access)} — c’est ce qui décide de ce que la carte montre au verso.
            </p>
          </div>
        </>
      ),
    },
    {
      id: 'mariage',
      titre: 'Le mariage',
      indice: card.styleId,
      contenu: (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <Champ label="Premier prénom" value={card.partner1} onChange={(v) => set({ partner1: v })} placeholder="Paul" />
            <Champ label="Second prénom" value={card.partner2} onChange={(v) => set({ partner2: v })} placeholder="Emma" />
            <Champ label="Date" type="date" value={card.date} onChange={(v) => set({ date: v })} />
            <Champ label="Lieu" value={card.venue} onChange={(v) => set({ venue: v })} placeholder="Château des Tilleuls" />
            <Champ label="Ville du mariage" value={card.city} onChange={(v) => set({ city: v })} placeholder="Provins" />
          </div>
          <div>
            <span className="vp-label">L’univers</span>
            <StylePicker value={card.styleId} onChange={(id) => set({ styleId: id })} />
          </div>
        </>
      ),
    },
    {
      id: 'contact',
      titre: 'Mes coordonnées',
      indice: 'verso',
      contenu: (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <Champ label="E-mail" type="email" value={card.email} onChange={(v) => set({ email: v })} placeholder="clara@exemple.fr" />
            <Champ label="Téléphone" type="tel" value={card.phone} onChange={(v) => set({ phone: v })} placeholder="06 12 34 56 78" />
            <Champ label="Site" value={card.website} onChange={(v) => set({ website: v })} placeholder="monsite.fr" />
            <Champ label="Réseaux" value={card.social} onChange={(v) => set({ social: v })} placeholder="@clara" />
          </div>
          <div>
            <span className="vp-label">Visible par</span>
            <div className="flex flex-wrap gap-2">
              {CONTACT_VISIBILITY.map((v) => {
                const actif = card.contactVisibility === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    aria-pressed={actif}
                    onClick={() => set({ contactVisibility: v.id })}
                    className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition ${
                      actif ? 'bg-[var(--vp-ink)] text-white' : 'bg-black/[0.045] text-[var(--vp-ink)] hover:bg-black/[0.08]'
                    }`}
                  >
                    {v.label}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'dispo',
      titre: 'Ma disponibilité',
      indice: 'verso',
      contenu: (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Champ label="À partir de" type="time" value={card.from} onChange={(v) => set({ from: v })} />
            <Champ label="Jusqu’à" type="time" value={card.to} onChange={(v) => set({ to: v })} />
            <Champ
              label="Déplacement (min)"
              type="number"
              min={0}
              value={card.travel}
              onChange={(v) => set({ travel: v })}
              placeholder="25"
            />
          </div>
          <Champ
            label="Indisponibilités"
            value={card.blackout}
            onChange={(v) => set({ blackout: v })}
            placeholder="Indisponible le vendredi soir."
          />
          <p className="text-[11.5px] leading-snug text-[var(--vp-muted)]">
            C’est cette disponibilité qui permettra au mariage de vous proposer au bon moment — vous restez libre
            d’accepter ou de refuser.
          </p>
        </>
      ),
    },
    {
      id: 'repas',
      titre: 'Le repas',
      indice: 'transmis au traiteur',
      contenu: (
        <>
          <Choix label="Régime" options={DIETS} value={card.diet} onChange={(v) => set({ diet: v })} />
          <Choix label="Allergènes" options={ALLERGENS} value={card.allergens} onChange={(v) => set({ allergens: v })} />
          <p className="flex items-start gap-2 text-[11.5px] leading-snug text-[var(--vp-muted)]">
            <Lock size={12} className="mt-0.5 shrink-0" />
            Ces informations ne figurent jamais publiquement : elles rejoignent la liste du traiteur.
          </p>
        </>
      ),
    },
    {
      id: 'mobilite',
      titre: 'Ma mobilité',
      indice: 'verso',
      contenu: (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <Champ label="Véhicule" value={card.vehicle} onChange={(v) => set({ vehicle: v })} placeholder="Break, 4 places" />
            <Champ label="Places disponibles" type="number" min={0} value={card.seats} onChange={(v) => set({ seats: v })} placeholder="3" />
          </div>
          <button
            type="button"
            aria-pressed={card.needsRide}
            onClick={() => set({ needsRide: !card.needsRide })}
            className={`flex w-full items-center justify-between rounded-[16px] px-4 py-3 text-left text-[13px] font-semibold transition ${
              card.needsRide ? 'bg-[var(--vp-ink)] text-white' : 'bg-black/[0.045] text-[var(--vp-ink)]'
            }`}
          >
            Chercher une place dans une voiture
            {card.needsRide && <Check size={15} />}
          </button>
        </>
      ),
    },
    {
      id: 'prestations',
      titre: 'Mes prestations',
      indice: 'prestataire',
      contenu: (
        <>
          <Champ label="Prestation" value={card.service} onChange={(v) => set({ service: v })} placeholder="Saxophone live, cérémonie et cocktail" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Champ label="Tarif" value={card.rate} onChange={(v) => set({ rate: v })} placeholder="550 € le set" />
            <Champ label="Minimum de prestation" value={card.minimum} onChange={(v) => set({ minimum: v })} placeholder="2 heures" />
          </div>
          <Champ
            label="Zone d’intervention"
            value={card.area}
            onChange={(v) => set({ area: v })}
            placeholder="Île-de-France, jusqu’à 150 km"
          />
          <p className="text-[11.5px] leading-snug text-[var(--vp-muted)]">
            Un tarif saisi une fois sert à toutes les demandes. Aucun montant n’est deviné ni complété
            automatiquement.
          </p>
        </>
      ),
    },
    {
      id: 'documents',
      titre: 'Mes documents',
      indice: 'privé',
      contenu: (
        <>
          <div className="flex flex-wrap gap-2">
            {card.documents.map((doc) => (
              <button
                key={doc.id}
                type="button"
                aria-pressed={doc.done}
                onClick={() =>
                  set({ documents: card.documents.map((d) => (d.id === doc.id ? { ...d, done: !d.done } : d)) })
                }
                className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition ${
                  doc.done ? 'bg-emerald-500/90 text-white' : 'bg-black/[0.045] text-[var(--vp-ink)] hover:bg-black/[0.08]'
                }`}
              >
                {doc.done ? `${doc.label} ✓` : doc.label}
              </button>
            ))}
          </div>
          <div>
            <Champ label="IBAN" value={card.iban} onChange={(v) => set({ iban: v })} placeholder="FR76 3000 6000 …" />
            <p className="mt-2 font-mono text-[12px] text-[var(--vp-muted)]">Sur la carte : {maskIban(card.iban)}</p>
          </div>
          <p className="flex items-start gap-2 text-[11.5px] leading-snug text-[var(--vp-muted)]">
            <Lock size={12} className="mt-0.5 shrink-0" />
            L’IBAN et les pièces ne sont lisibles que par les mariés. Le dépôt de fichiers attend l’ouverture des
            comptes : le stockage actuel est public, et un contrat n’y a rien à faire.
          </p>
        </>
      ),
    },
    {
      id: 'musique',
      titre: 'Ma musique',
      indice: 'verso',
      contenu: (
        <>
          <div>
            <span className="vp-label">Empreinte musicale</span>
            <div className="flex flex-wrap gap-2">
              {MUSIC_MOODS.map((mood) => {
                const actif = card.music === mood.id;
                return (
                  <button
                    key={mood.id}
                    type="button"
                    aria-pressed={actif}
                    onClick={() => set({ music: mood.id })}
                    className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition ${
                      actif ? 'bg-[var(--vp-ink)] text-white' : 'bg-black/[0.045] text-[var(--vp-ink)] hover:bg-black/[0.08]'
                    }`}
                  >
                    {mood.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <span className="vp-label">Les temps que je vis</span>
            <div className="flex flex-wrap gap-2">
              {DAY_EVENTS.map((evenement) => {
                const actif = card.events.includes(evenement.id);
                return (
                  <button
                    key={evenement.id}
                    type="button"
                    aria-pressed={actif}
                    onClick={() =>
                      set({
                        events: actif
                          ? card.events.filter((e) => e !== evenement.id)
                          : DAY_EVENTS.filter((e) => [...card.events, evenement.id].includes(e.id)).map((e) => e.id),
                      })
                    }
                    className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition ${
                      actif ? 'bg-[var(--vp-ink)] text-white' : 'bg-black/[0.045] text-[var(--vp-ink)] hover:bg-black/[0.08]'
                    }`}
                  >
                    {evenement.label} <span className="font-mono text-[10px] opacity-60">{evenement.time}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ),
    },
  ];

  const visibles = blocs.filter((bloc) => {
    if (bloc.id === 'repas' || bloc.id === 'mobilite') return estInvite;
    if (bloc.id === 'prestations') return estPrestataire;
    if (bloc.id === 'documents') return estPrestataire || kind === 'couple';
    return true;
  });

  return (
    <div className="vp-env flex min-h-screen flex-col">
      <nav className="sticky top-3 z-40 mx-auto w-[calc(100%-1rem)] max-w-6xl sm:top-4">
        <div className="vp-glass vp-spec flex flex-wrap items-center justify-between gap-3 rounded-[26px] px-4 py-2.5 sm:px-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="vp-title text-[18px] font-bold italic tracking-wider">VOWS</span>
            <span className="hidden text-[11.5px] font-semibold uppercase tracking-[0.18em] text-[var(--vp-muted)] sm:inline">
              Ma carte
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/" className="vp-btn vp-btn-glass vp-press">
              Accueil
            </Link>
            <Link to="/creer" className="vp-btn vp-press">
              Créer notre site <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Le hero prend le visuel de l'univers choisi : la carte et la page ne font qu'un */}
      <header className="relative mx-4 mt-4 overflow-hidden rounded-[28px] bg-[#0B0C12] sm:mx-8">
        <img src={style.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/35" />
        <div className="relative px-6 py-10 text-white sm:px-10 sm:py-12">
          <span className="vp-eyebrow !text-white/70">Votre carte</span>
          <h1 className="vp-title mt-3 max-w-2xl text-white" style={{ fontSize: 'clamp(1.9rem, 4.6vw, 3rem)' }}>
            Une carte. Deux faces.
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/75">
            Le recto dit qui vous êtes, le verso porte le détail — et le détail s’adapte à votre rôle. Personne ne
            remplit un formulaire de quarante champs : la carte ne demande que ce qu’elle peut montrer.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="button" onClick={partager} className="vp-btn vp-press">
              <Share2 size={15} /> Partager ma carte
            </button>
            <span className="text-[12.5px] text-white/60">
              {message || 'Enregistrée à chaque frappe, dans ce navigateur.'}
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-8 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-12">
        {/* La carte, qui se retourne */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <WeddingCard card={card} />
          <div className="mt-5 rounded-[22px] border border-black/8 bg-white p-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--vp-muted)]">
                Votre carte
              </span>
              <span className="text-[13px] font-bold text-[var(--vp-ink)]">{completion} %</span>
            </div>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${completion}%`, background: style.accent }}
              />
            </div>
            <p className="mt-3 text-[12px] leading-snug text-[var(--vp-muted)]">
              {completion === 100
                ? 'Votre carte est complète. Elle est prête à rejoindre le mariage.'
                : `Il reste ${100 - completion} % : la carte se remplit dans l’ordre que vous voulez.`}
            </p>
          </div>
          <p className="mt-3 flex items-start gap-2 text-[11.5px] leading-snug text-[var(--vp-muted)]">
            <Sparkles size={13} className="mt-0.5 shrink-0" />
            Sans photo, la carte affiche vos initiales ; sans nom, elle reste en attente. Rien n’est inventé, rien
            n’est publié.
          </p>
        </aside>

        {/* Les blocs, filtrés par le rôle */}
        <div className="min-w-0 space-y-4">
          {/* En ligne : la carte devient une personne du réseau */}
          <section className="rounded-[22px] border border-black/8 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-[15.5px] font-bold text-[var(--vp-ink)]">En ligne</h2>
                <p className="mt-1 max-w-md text-[12.5px] leading-snug text-[var(--vp-muted)]">
                  {cle
                    ? 'Votre carte est publiée : elle a une clé, une page, et elle peut rejoindre un mariage.'
                    : 'Votre carte vit encore dans ce navigateur. Publiez-la pour qu’elle rejoigne le réseau.'}
                </p>
              </div>
              {cle ? (
                <span className="flex shrink-0 flex-wrap items-center justify-end gap-3 text-[12px] font-semibold text-[var(--vp-muted)]">
                  {moi && (
                    <Link to={`/profil/${slugDePersonne(moi)}`} className="vp-btn vp-press">
                      Voir ma page <ArrowRight size={14} />
                    </Link>
                  )}
                  {enregistrement === 'encours' && (
                    <>
                      <Loader2 size={13} className="animate-spin" /> Enregistrement…
                    </>
                  )}
                  {enregistrement === 'ok' && (
                    <>
                      <Check size={13} className="text-emerald-600" /> À jour
                    </>
                  )}
                  {enregistrement === 'erreur' && 'Enregistrement impossible'}
                  {enregistrement === 'repos' && (
                    <>
                      <Check size={13} className="text-emerald-600" /> En ligne
                    </>
                  )}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={publier}
                  disabled={!card.firstName.trim() || publication}
                  className="vp-btn vp-press shrink-0"
                >
                  {publication ? <Loader2 size={15} className="animate-spin" /> : <UserPlus size={15} />}
                  Publier ma carte
                </button>
              )}
            </div>

            {cleNouvelle && (
              <div className="mt-4 rounded-[18px] bg-[#0B0C12] p-4 text-white">
                <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/50">
                  <KeyRound size={12} /> Votre clé personnelle
                </div>
                <p className="mt-1.5 text-[12.5px] leading-snug text-white/70">
                  Elle s’affiche une seule fois. Sans elle, personne ne peut modifier votre carte — ni vous, sur un
                  autre appareil. C’est aussi ce qui permet de la retrouver ailleurs.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <code className="min-w-0 flex-1 truncate rounded-[12px] bg-white/10 px-3 py-2 font-mono text-[12px]">
                    {cleNouvelle}
                  </code>
                  <button type="button" onClick={copierCle} className="vp-btn vp-press shrink-0">
                    <Copy size={14} /> Copier
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setCleNouvelle('')}
                  className="mt-3 text-[11.5px] text-white/50 underline transition hover:text-white/80"
                >
                  Je l’ai notée
                </button>
              </div>
            )}

            {!cle && (
              <div className="mt-4 border-t border-black/8 pt-4">
                {reprendre ? (
                  <div className="grid gap-2">
                    <label className="block">
                      <span className="vp-label">Collez votre clé personnelle</span>
                      <input
                        className="vp-field font-mono text-[13px]"
                        value={cleSaisie}
                        placeholder="ex. 3vT…"
                        onChange={(e) => setCleSaisie(e.target.value)}
                      />
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={reprendreAvecCle}
                        disabled={!cleSaisie.trim()}
                        className="vp-btn vp-press"
                      >
                        Reprendre ma carte
                      </button>
                      <button type="button" onClick={() => setReprendre(false)} className="vp-btn vp-btn-glass vp-press">
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setReprendre(true)}
                    className="text-[12.5px] font-semibold text-[var(--vp-ink)] underline transition hover:opacity-70"
                  >
                    J’ai déjà une clé — retrouver ma carte
                  </button>
                )}
              </div>
            )}

            {cle && (
              <div className="mt-4 border-t border-black/8 pt-4">
                <span className="vp-label">Ma place dans les mariages</span>
                {mariages.length > 0 && (
                  <div className="space-y-2">
                    {mariages.map(({ member, site }) => (
                      <div
                        key={member.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] bg-black/[0.035] px-3.5 py-3"
                      >
                        <div className="min-w-0">
                          <div className="truncate text-[13px] font-semibold text-[var(--vp-ink)]">
                            {site ? `${site.partner1} & ${site.partner2}` : `Mariage #${member.site_id}`}
                          </div>
                          <div className="text-[11.5px] text-[var(--vp-muted)]">
                            {roleTitle(member.role_id) ?? member.role_id}
                            {site?.wedding_date ? ` · ${site.wedding_date}` : ''}
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          {site?.slug && (
                            <Link to={`/mariage/${site.slug}`} className="vp-btn vp-btn-glass vp-press">
                              Les personnes
                            </Link>
                          )}
                          <button
                            type="button"
                            onClick={() => quitter(member.id)}
                            aria-label="Quitter ce mariage"
                            className="vp-btn vp-btn-glass vp-press"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-3 grid gap-2">
                  <label className="block">
                    <span className="vp-label">Rejoindre un mariage</span>
                    <input
                      className="vp-field"
                      value={slug}
                      placeholder="paul-emma — l’adresse du mini-site"
                      onChange={(e) => setSlug(e.target.value)}
                    />
                  </label>
                  <label className="block">
                    <span className="vp-label">Mon rôle dans ce mariage</span>
                    <select
                      className="vp-field"
                      value={roleJoint || card.roleId}
                      onChange={(e) => setRoleJoint(e.target.value)}
                    >
                      {ROLE_GROUPS.map((groupe) => (
                        <optgroup key={groupe.label} label={groupe.label}>
                          {groupe.roles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.title}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={rejoindre}
                    disabled={!slug.trim() || rejoint}
                    className="vp-btn vp-press justify-center"
                  >
                    {rejoint ? <Loader2 size={15} className="animate-spin" /> : <UserPlus size={15} />}
                    Rejoindre ce mariage
                  </button>
                </div>
              </div>
            )}
          </section>

          {visibles.map((bloc) => (
            <Bloc key={bloc.id} titre={bloc.titre} indice={bloc.indice}>
              {bloc.contenu}
            </Bloc>
          ))}

          <div className="rounded-[22px] border border-black/8 bg-[#0B0C12] p-5 text-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-[15.5px] font-bold">La suite : votre mini-site</div>
                <p className="mt-1 max-w-md text-[12.5px] leading-snug text-white/60">
                  Votre carte est l’identité. Le mini-site est ce que vos invités voient : le programme, les lieux, le
                  RSVP, la galerie.
                </p>
              </div>
              <Link to="/creer" className="vp-btn vp-press">
                Créer notre site <ArrowRight size={15} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
