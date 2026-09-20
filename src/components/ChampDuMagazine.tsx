import { useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarDays, Check, MapPin, Plus, X } from 'lucide-react';
import {
  PROPOSITIONS,
  dateCourte,
  encoderPersonnes,
  jourDeNaissance,
  motDeLaCondition,
  personneComplete,
  propositionsFermees,
  propositionsPossibles,
  type PersonneComposee,
  type Proposition,
} from '../lib/composerPersonnes';
import { effacerMagazine, magazineCompose, phraseDuMagazine, reponseEnregistree } from '../lib/composition';
import CouvertureJour from './CouvertureJour';

/**
 * LE COMPOSEUR DE L'ACCUEIL — DES PERSONNES, PUIS CE QUI DEVIENT POSSIBLE
 *
 * Un bloc, un **+**, et trois informations par personne : **le prénom, la date de
 * naissance, la ville de naissance**. Le + est **éteint au départ** — il ne
 * s'allume que quand les trois sont écrites. Il ouvre alors **un menu**, où l'on
 * ajoute une personne, et **plusieurs à la suite**.
 *
 * Et c'est **après** avoir rempli que **la liste se met à jour** : à une personne
 * on peut être témoin ou prestataire, **à deux apparaît « Nous sommes des futurs
 * mariés »**, à trois la famille. Ce qui n'est pas encore possible **reste dans le
 * menu, grisé, avec sa condition écrite** — on ne cache pas la suite, on dit
 * quand elle s'ouvre.
 *
 * La date de naissance n'est pas décorative : elle **donne le jour de naissance**,
 * donc **le magazine de ce jour-là** parmi les 365 — « le jour de Guy ». C'est la
 * seule chose qu'on rend en retour, parce qu'elle existe déjà.
 *
 * Et quand le magazine est composé, **ce bloc devient sa couverture**.
 */

/** Ce qu'on écrit dans le champ, avant de l'ajouter : trois informations, pas une. */
type Brouillon = { prenom: string; naissance: string; ville: string };

const BROUILLON_VIDE: Brouillon = { prenom: '', naissance: '', ville: '' };

export default function ChampDuMagazine({ className = '' }: { className?: string }) {
  const navigate = useNavigate();

  /** La réponse déjà donnée sur cet appareil : on repart de là, on ne reperd rien. */
  const [depart] = useState(() => reponseEnregistree());
  const [personnes, setPersonnes] = useState<PersonneComposee[]>(() => depart?.personnes ?? []);
  const [date, setDate] = useState(() => depart?.date ?? '');
  const [lieu, setLieu] = useState('');
  const [roleId, setRoleId] = useState(() => depart?.roleId ?? '');
  const [brouillon, setBrouillon] = useState<Brouillon>(BROUILLON_VIDE);
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [saisie, setSaisie] = useState<'aucune' | 'date' | 'lieu'>('aucune');
  /** Le magazine déjà composé : tant qu'on n'y touche pas, le bloc est la couverture. */
  const [compose, setCompose] = useState(() => magazineCompose());

  const nombre = personnes.length;
  const complet = personneComplete(brouillon);
  /** Le + s'allume dès qu'une personne est complète — ou qu'il y en a déjà une. */
  const peutOuvrir = complet || nombre > 0;
  const possibles = useMemo(() => propositionsPossibles(nombre), [nombre]);
  const fermees = useMemo(() => propositionsFermees(nombre), [nombre]);
  const roles = possibles.filter((p) => p.roleId);
  const essentielles = possibles.filter((p) => p.essentielle);
  const roleChoisi = PROPOSITIONS.find((p) => p.roleId === roleId);

  const ajouter = () => {
    if (!complet) return;
    setPersonnes((liste) => [
      ...liste,
      { id: `p${liste.length + 1}-${Date.now().toString(36)}`, ...brouillon, prenom: brouillon.prenom.trim(), ville: brouillon.ville.trim() },
    ]);
    setBrouillon(BROUILLON_VIDE);
  };

  const retirer = (id: string) => setPersonnes((liste) => liste.filter((p) => p.id !== id));

  const generer = (e: FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (nombre > 0) query.set('p', encoderPersonnes(personnes));
    if (date.length > 0) query.set('jour', date);
    if (roleId.length > 0) query.set('role', roleId);
    navigate(`/generer${query.toString() ? `?${query}` : ''}`);
  };

  /** Reprendre les questions du site, avec tout ce qui est déjà répondu. */
  const completer = () => {
    const [partner1 = '', partner2 = ''] = personnes.map((p) => p.prenom);
    navigate('/creer', { state: { partner1, partner2, weddingDate: date, venue: lieu } });
  };

  /* ——————————————————— LE MAGAZINE EXISTE : SA COUVERTURE ——————————————————— */
  if (compose) {
    return (
      <div className={`vp-glass w-full max-w-3xl rounded-[26px] p-4 text-left ${className}`}>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <CouvertureJour couverture={compose.couverture} largeur={112} vignette />
          <div className="min-w-0 flex-1">
            <span className="vp-eyebrow">Votre magazine</span>
            <div className="vp-title mt-1 text-[17px]">{phraseDuMagazine(compose)}</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--vp-muted)]">
              {compose.edition.titre} · {compose.edition.pages.length} pages · une par heure
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => navigate('/magazine')} className="vp-btn !py-2.5 !text-[13px]">
                Ouvrir le magazine
                <ArrowRight size={14} />
              </button>
              <button type="button" onClick={completer} className="vp-btn-glass !py-2.5 !text-[13px]">
                Compléter les questions
              </button>
              <button
                type="button"
                onClick={() => {
                  effacerMagazine();
                  setCompose(null);
                }}
                className="rounded-full px-3 py-2 text-[12.5px] font-semibold text-[var(--vp-muted)] underline decoration-black/20 underline-offset-4 transition hover:text-[var(--vp-ink)]"
              >
                Refaire
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ——————————————————————— LE COMPOSEUR, EN CLAIR ——————————————————————— */
  return (
    <form onSubmit={generer} className={`vp-glass w-full max-w-3xl rounded-[26px] p-4 text-left ${className}`}>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 px-1">
        <h2 className="vp-title text-[clamp(1.15rem,2.2vw,1.5rem)]">Votre magazine</h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--vp-muted)]">
          24 pages · une par heure
        </span>
      </div>

      {/* LES PERSONNES AJOUTÉES — et, pour chacune, le jour de sa naissance. */}
      {nombre > 0 && (
        <ul className="mb-3 flex flex-wrap gap-2">
          {personnes.map((p) => {
            const jour = jourDeNaissance(p);
            return (
              <li
                key={p.id}
                className="flex items-center gap-2 rounded-full border border-black/10 bg-white/75 px-3 py-1.5"
              >
                <span className="text-[12.5px] font-bold text-[var(--vp-ink)]">{p.prenom}</span>
                <span className="vp-num text-[10.5px] text-[var(--vp-muted)]">
                  {dateCourte(p.naissance)} · {p.ville}
                </span>
                {jour && (
                  <span className="hidden text-[11.5px] text-[var(--vp-muted)] sm:inline">
                    le jour de {jour.personnage}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => retirer(p.id)}
                  aria-label={`Retirer ${p.prenom}`}
                  className="flex h-4 w-4 items-center justify-center rounded-full text-[var(--vp-muted)] transition hover:text-[var(--vp-ink)]"
                >
                  <X size={12} />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* CE QU'ON A CHOISI, ET LES INFORMATIONS ESSENTIELLES. */}
      {(roleChoisi || date || lieu) && (
        <div className="mb-3 flex flex-wrap gap-2">
          {roleChoisi && (
            <span className="flex items-center gap-1.5 rounded-full bg-[var(--vp-ink)] px-3 py-1.5 text-[11.5px] font-semibold text-white">
              <Check size={12} strokeWidth={3} />
              {roleChoisi.titre}
            </span>
          )}
          {date && (
            <span className="vp-num rounded-full border border-black/10 bg-white/60 px-3 py-1.5 text-[11.5px] text-[var(--vp-ink)]">
              Le mariage : {dateCourte(date)}
            </span>
          )}
          {lieu && (
            <span className="rounded-full border border-black/10 bg-white/60 px-3 py-1.5 text-[11.5px] text-[var(--vp-ink)]">
              {lieu}
            </span>
          )}
        </div>
      )}

      {/* LE CHAMP : LE + À GAUCHE, PUIS LES TROIS INFORMATIONS. */}
      <div className="flex flex-wrap items-end gap-2 rounded-[20px] border border-black/10 bg-white/60 p-2">
        <button
          type="button"
          onClick={() => setMenuOuvert((v) => !v)}
          disabled={!peutOuvrir}
          aria-expanded={menuOuvert}
          aria-label="Ajouter une personne"
          className={`mb-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-[18px] transition ${
            peutOuvrir
              ? 'border-[var(--vp-ink)] bg-[var(--vp-ink)] text-white hover:bg-black'
              : 'cursor-not-allowed border-black/10 bg-black/[0.04] text-black/25'
          }`}
        >
          <Plus size={18} strokeWidth={2.5} />
        </button>

        <div className="min-w-[8.5rem] flex-1">
          <label htmlFor="composeur-prenom" className="vp-label ml-1 !text-[10px]">
            Prénom
          </label>
          <input
            id="composeur-prenom"
            value={brouillon.prenom}
            onChange={(e) => setBrouillon({ ...brouillon, prenom: e.target.value })}
            placeholder="Paul"
            autoComplete="off"
            className="vp-field !py-2.5 !text-[15px]"
          />
        </div>

        <div className="w-[10.5rem]">
          <label htmlFor="composeur-naissance" className="vp-label ml-1 !text-[10px]">
            Né(e) le
          </label>
          <div className="relative">
            <input
              id="composeur-naissance"
              type="date"
              value={brouillon.naissance}
              onChange={(e) => setBrouillon({ ...brouillon, naissance: e.target.value })}
              className="vp-field vp-num !py-2.5 !pl-9 !text-[15px]"
            />
            <CalendarDays
              size={15}
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--vp-muted)]"
            />
          </div>
        </div>

        <div className="min-w-[8.5rem] flex-1">
          <label htmlFor="composeur-ville" className="vp-label ml-1 !text-[10px]">
            Ville de naissance
          </label>
          <div className="relative">
            <input
              id="composeur-ville"
              value={brouillon.ville}
              onChange={(e) => setBrouillon({ ...brouillon, ville: e.target.value })}
              placeholder="Provins"
              autoComplete="off"
              className="vp-field !py-2.5 !pl-9 !text-[15px]"
            />
            <MapPin
              size={15}
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--vp-muted)]"
            />
          </div>
        </div>
      </div>

      {/* LE MENU DU + : CE QUI EST POSSIBLE, ET CE QUI S'OUVRIRA. */}
      {menuOuvert && (
        <div className="mt-2 rounded-[20px] border border-black/10 bg-white/85 p-2 shadow-[0_20px_50px_-30px_rgba(11,12,18,0.6)]">
          <button
            type="button"
            onClick={ajouter}
            disabled={!complet}
            className={`flex w-full items-center gap-2 rounded-[14px] px-3 py-2.5 text-left text-[13.5px] font-semibold transition ${
              complet ? 'text-[var(--vp-ink)] hover:bg-black/[0.05]' : 'cursor-not-allowed text-black/30'
            }`}
          >
            <Plus size={14} />
            {complet ? `Ajouter ${brouillon.prenom.trim()}` : 'Ajouter une personne'}
            {!complet && <span className="ml-auto text-[11.5px] font-normal">prénom, naissance et ville</span>}
          </button>

          {essentielles.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSaisie(p.id === 'date-du-mariage' ? 'date' : 'lieu')}
              className="mt-1 flex w-full items-start gap-2 rounded-[14px] px-3 py-2.5 text-left transition hover:bg-black/[0.05]"
            >
              <CalendarDays size={14} className="mt-0.5 shrink-0 text-[var(--vp-muted)]" />
              <span className="min-w-0">
                <span className="block text-[13.5px] font-semibold text-[var(--vp-ink)]">{p.titre}</span>
                <span className="block text-[11.5px] leading-snug text-[var(--vp-muted)]">{p.explication}</span>
              </span>
            </button>
          ))}

          {roles.length > 0 && (
            <div className="mt-2 border-t border-black/[0.07] pt-2">
              <span className="px-3 font-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--vp-muted)]">
                Ce que vous êtes
              </span>
              {roles.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setRoleId(p.roleId ?? '')}
                  className="mt-1 flex w-full items-start gap-2 rounded-[14px] px-3 py-2.5 text-left transition hover:bg-black/[0.05]"
                >
                  <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                    {roleId === p.roleId && <Check size={13} strokeWidth={3} className="text-emerald-600" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13.5px] font-semibold text-[var(--vp-ink)]">{p.titre}</span>
                    <span className="block text-[11.5px] leading-snug text-[var(--vp-muted)]">{p.explication}</span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {fermees.length > 0 && (
            <div className="mt-2 border-t border-black/[0.07] pt-2">
              {fermees.map((p: Proposition) => (
                <div key={p.id} className="flex items-center gap-2 px-3 py-2 text-[12.5px] text-black/30">
                  <span className="truncate">{p.titre}</span>
                  <span className="ml-auto shrink-0 text-[11px]">{motDeLaCondition(p)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* LES INFORMATIONS ESSENTIELLES, QUAND ON LES DEMANDE. */}
      {saisie === 'date' && (
        <div className="mt-2 max-w-xs">
          <label htmlFor="composeur-date" className="vp-label ml-1 !text-[10px]">
            La date du mariage
          </label>
          <input
            id="composeur-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="vp-field vp-num !py-2.5 !text-[15px]"
          />
        </div>
      )}
      {saisie === 'lieu' && (
        <div className="mt-2 max-w-sm">
          <label htmlFor="composeur-lieu" className="vp-label ml-1 !text-[10px]">
            Le lieu
          </label>
          <input
            id="composeur-lieu"
            value={lieu}
            onChange={(e) => setLieu(e.target.value)}
            placeholder="Château des Tilleuls, Provins"
            className="vp-field !py-2.5 !text-[15px]"
          />
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-1">
        <span className="text-[12px] text-[var(--vp-muted)]">
          {nombre === 0
            ? 'Le + s’allume quand le prénom, la naissance et la ville sont écrits.'
            : `${nombre} ${nombre > 1 ? 'personnes' : 'personne'} dans le magazine`}
        </span>
        <button type="submit" className="vp-btn vp-spec !py-3 !text-[14px]">
          Générer mon magazine
          <ArrowRight size={15} />
        </button>
      </div>
    </form>
  );
}
