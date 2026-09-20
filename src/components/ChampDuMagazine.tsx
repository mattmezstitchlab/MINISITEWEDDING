import { useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarDays, Check, MapPin, Plus, X } from 'lucide-react';
import {
  PROPOSITIONS,
  ageEcrit,
  ageLePlusJeune,
  dateCourte,
  encoderPersonnes,
  genreDeLaPersonne,
  jourDeNaissance,
  personneComplete,
  propositionsFermees,
  propositionsPossibles,
  raisonDeLaFermeture,
  roleDeLaProposition,
  titreDeLaProposition,
  type PersonneComposee,
  type Proposition,
} from '../lib/composerPersonnes';
import { dateDuJourNomme, lectureDuPrenom, type GenrePrenom } from '../lib/genreDesPrenoms';
import { effacerMagazine, magazineCompose, phraseDuMagazine, reponseEnregistree } from '../lib/composition';
import CouvertureJour from './CouvertureJour';

/**
 * LE COMPOSEUR DE L'ACCUEIL — DES PERSONNES, PUIS CE QUI DEVIENT POSSIBLE
 *
 * Un bloc, un **+**, et trois informations par personne : **le prénom, la date de
 * naissance, la ville de naissance**. Le + est **éteint au départ** — il ne
 * s'allume que quand les trois sont écrites — puis il ouvre **un menu**, où l'on
 * ajoute une personne, et **plusieurs à la suite**.
 *
 * **Mais on en sait déjà plus qu'on n'en demande** : au prénom, on lit **le genre**
 * (le calendrier des 365 d'abord, les prénoms courants ensuite) **et le jour de
 * l'année qui porte ce prénom** ; à la date de naissance, **l'âge** et **le jour
 * de naissance** — donc le magazine de ce jour-là ; à la ville, **d'où l'on
 * vient**. Rien n'est déduit d'un prénom : quand le prénom se porte des deux
 * façons, **on demande**.
 *
 * Et **la liste des possibles se resserre** au fur et à mesure : invité, témoin,
 * l'un des mariés, venu avec ses parents ; **à deux, « Nous sommes des futurs
 * mariés »** ; à trois, un groupe ou la famille. Ce qui n'est pas encore possible
 * **reste dans le menu, grisé, avec sa raison écrite**.
 *
 * Et quand le magazine est composé, **ce bloc devient sa couverture**.
 */

/** Ce qu'on écrit dans le champ, avant de l'ajouter. */
type Brouillon = {
  prenom: string;
  naissance: string;
  ville: string;
  /** `auto` = on suit la lecture du prénom ; sinon, la personne a tranché. */
  genre: GenrePrenom | 'auto';
};

const BROUILLON_VIDE: Brouillon = { prenom: '', naissance: '', ville: '', genre: 'auto' };

/** « Femme », « Homme », ou rien quand on ne sait pas. */
function motDuGenre(genre: GenrePrenom | ''): string {
  if (genre === 'feminin') return 'Femme';
  if (genre === 'masculin') return 'Homme';
  return 'À préciser';
}

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
  const [compose, setCompose] = useState(() => magazineCompose());

  const nombre = personnes.length;
  const complet = personneComplete(brouillon);

  /* Ce que le prénom dit tout seul : son genre, sa source, son jour. */
  const lecture = useMemo(() => lectureDuPrenom(brouillon.prenom), [brouillon.prenom]);
  const genreDuBrouillon: GenrePrenom | '' =
    brouillon.genre === 'auto' ? (lecture.genre ?? '') : brouillon.genre;
  const ageDuBrouillon = ageEcrit({ naissance: brouillon.naissance });

  /** Le plus jeune de la liste : c'est lui qui ouvre ou ferme des propositions. */
  const jeune = ageLePlusJeune(personnes);
  const possibles = useMemo(() => propositionsPossibles(nombre, jeune), [nombre, jeune]);
  const fermees = useMemo(() => propositionsFermees(nombre, jeune), [nombre, jeune]);
  const roles = possibles.filter((p) => p.roleId);
  const essentielles = possibles.filter((p) => p.essentielle);
  const roleChoisi = PROPOSITIONS.find((p) => p.roleId === roleId || p.roleFeminin === roleId);
  /** Le genre qui décide de la langue du menu : celui de la première personne. */
  const genreDuGroupe = personnes[0] ? genreDeLaPersonne(personnes[0]) : genreDuBrouillon;

  const cycleGenre = () => {
    const ordre: Array<GenrePrenom | 'auto'> = lecture.genre ? ['auto', 'masculin', 'feminin'] : ['masculin', 'feminin', 'auto'];
    const i = ordre.indexOf(brouillon.genre);
    setBrouillon({ ...brouillon, genre: ordre[(i + 1) % ordre.length] ?? 'auto' });
  };

  const ajouter = () => {
    if (!complet) return;
    setPersonnes((liste) => [
      ...liste,
      {
        id: `p${liste.length + 1}-${Date.now().toString(36)}`,
        prenom: brouillon.prenom.trim(),
        naissance: brouillon.naissance,
        ville: brouillon.ville.trim(),
        genre: genreDuBrouillon,
      },
    ]);
    setBrouillon(BROUILLON_VIDE);
  };

  const retirer = (id: string) => setPersonnes((liste) => liste.filter((p) => p.id !== id));

  /** Le rôle part dans la composition, au genre de la personne qui l'a choisi. */
  const choisirRole = (p: Proposition) => setRoleId(roleDeLaProposition(p, genreDuGroupe));

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
    navigate('/ripple');
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

      {/* LES PERSONNES AJOUTÉES — ce que chacune donne, sans qu'on le lui demande. */}
      {nombre > 0 && (
        <ul className="mb-3 flex flex-wrap gap-2">
          {personnes.map((p) => {
            const jour = jourDeNaissance(p);
            const jourDuNom = lectureDuPrenom(p.prenom).jour;
            const age = ageEcrit(p);
            const genre = genreDeLaPersonne(p);
            return (
              <li key={p.id} className="rounded-[16px] border border-black/10 bg-white/75 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-[12.5px] font-bold text-[var(--vp-ink)]">{p.prenom}</span>
                  <span className="vp-num text-[10.5px] text-[var(--vp-muted)]">
                    {[genre === 'feminin' ? 'F' : genre === 'masculin' ? 'H' : '', age, dateCourte(p.naissance), p.ville]
                      .filter((v) => v.length > 0)
                      .join(' · ')}
                  </span>
                  <button
                    type="button"
                    onClick={() => retirer(p.id)}
                    aria-label={`Retirer ${p.prenom}`}
                    className="flex h-4 w-4 items-center justify-center rounded-full text-[var(--vp-muted)] transition hover:text-[var(--vp-ink)]"
                  >
                    <X size={12} />
                  </button>
                </div>
                <div className="mt-0.5 text-[11px] leading-snug text-[var(--vp-muted)]">
                  {jour ? `né(e) un ${jour.dateLongue} — le jour de ${jour.personnage}` : 'sans date de naissance'}
                  {jourDuNom && ` · son jour : ${dateDuJourNomme(jourDuNom)}`}
                </div>
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
              {titreDeLaProposition(roleChoisi, genreDuGroupe)}
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
          disabled={!(complet || nombre > 0)}
          aria-expanded={menuOuvert}
          aria-label="Ajouter une personne"
          className={`mb-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-[18px] transition ${
            complet || nombre > 0
              ? 'border-[var(--vp-ink)] bg-[var(--vp-ink)] text-white hover:bg-black'
              : 'cursor-not-allowed border-black/10 bg-black/[0.04] text-black/25'
          }`}
        >
          <Plus size={18} strokeWidth={2.5} />
        </button>

        <div className="min-w-[8rem] flex-1">
          <label htmlFor="composeur-prenom" className="vp-label ml-1 !text-[10px]">
            Prénom
          </label>
          <input
            id="composeur-prenom"
            value={brouillon.prenom}
            onChange={(e) => setBrouillon({ ...brouillon, prenom: e.target.value, genre: 'auto' })}
            placeholder="Paul"
            autoComplete="off"
            className="vp-field !py-2.5 !text-[15px]"
          />
        </div>

        {/* CE QUE LE PRÉNOM DIT TOUT SEUL — et qu'on peut corriger d'un clic. */}
        <button
          type="button"
          onClick={cycleGenre}
          title={lecture.source ? `Lu dans ${lecture.source} — cliquez pour changer` : 'Cliquez pour préciser'}
          className={`mb-0.5 shrink-0 rounded-full border px-3 py-2 text-[11.5px] font-semibold transition ${
            genreDuBrouillon
              ? 'border-black/10 bg-white/80 text-[var(--vp-ink)]'
              : 'border-dashed border-black/20 bg-white/40 text-[var(--vp-muted)]'
          }`}
        >
          {motDuGenre(genreDuBrouillon)}
        </button>

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

        {/* L'ÂGE, CALCULÉ AU JOUR PRÈS. */}
        <span
          className={`vp-num mb-2 shrink-0 text-[12.5px] font-semibold ${
            ageDuBrouillon ? 'text-[var(--vp-ink)]' : 'text-black/25'
          }`}
        >
          {ageDuBrouillon || 'âge'}
        </span>

        <div className="min-w-[8rem] flex-1">
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

      {/* CE QUE LE PRÉNOM DONNE, DIT À VOIX HAUTE. */}
      {brouillon.prenom.trim().length > 0 && (
        <p className="mt-2 px-1 text-[11.5px] leading-relaxed text-[var(--vp-muted)]">
          {lecture.jour ? (
            <>
              <span className="font-semibold text-[var(--vp-ink)]">{brouillon.prenom.trim()}</span> a son jour :
              le {dateDuJourNomme(lecture.jour)} — n° {lecture.jour.ordinal} des 365.
            </>
          ) : (
            <>
              <span className="font-semibold text-[var(--vp-ink)]">{brouillon.prenom.trim()}</span> n’est pas au
              calendrier des 365 : rien n’est décidé pour lui.
            </>
          )}
          {lecture.mixte && ' Ce prénom se porte des deux façons : à vous de dire.'}
        </p>
      )}

      {/* LE MENU DU + : CE QUI EST POSSIBLE, ET CE QUI S'OUVRIRA. */}
      {menuOuvert && (
        <div className="mt-2 rounded-[20px] border border-black/10 bg-white/85 p-2 shadow-[0_20px_50px_-30px_rgba(11,12,18,0.6)]">
          <div className="flex flex-wrap items-baseline justify-between gap-2 px-3 pb-1 pt-1">
            <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--vp-muted)]">
              Ce qui devient possible
            </span>
            <span className="text-[11px] text-[var(--vp-muted)]">
              {nombre} {nombre > 1 ? 'personnes' : 'personne'}
              {jeune !== null && ` · le plus jeune a ${jeune} ans`}
            </span>
          </div>

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

          {[...essentielles, ...roles].map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => (p.essentielle ? setSaisie(p.id === 'date-du-mariage' ? 'date' : 'lieu') : choisirRole(p))}
              className="mt-1 flex w-full items-start gap-2 rounded-[14px] px-3 py-2.5 text-left transition hover:bg-black/[0.05]"
            >
              <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                {p.roleId && (roleId === p.roleId || roleId === p.roleFeminin) && (
                  <Check size={13} strokeWidth={3} className="text-emerald-600" />
                )}
              </span>
              <span className="min-w-0">
                <span className="block text-[13.5px] font-semibold text-[var(--vp-ink)]">
                  {titreDeLaProposition(p, genreDuGroupe || genreDuBrouillon)}
                </span>
                <span className="block text-[11.5px] leading-snug text-[var(--vp-muted)]">{p.explication}</span>
              </span>
            </button>
          ))}

          {fermees.length > 0 && (
            <div className="mt-2 border-t border-black/[0.07] pt-2">
              {fermees.map((p: Proposition) => (
                <div key={p.id} className="flex items-center gap-2 px-3 py-2 text-[12.5px] text-black/30">
                  <span className="truncate">{titreDeLaProposition(p, genreDuGroupe || genreDuBrouillon)}</span>
                  <span className="ml-auto shrink-0 text-[11px]">{raisonDeLaFermeture(p, nombre)}</span>
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
            : `${nombre} ${nombre > 1 ? 'personnes' : 'personne'} dans le magazine · ${possibles.length} possibilités`}
        </span>
        <button type="submit" className="vp-btn vp-spec !py-3 !text-[14px]">
          Générer mon magazine
          <ArrowRight size={15} />
        </button>
      </div>
    </form>
  );
}
