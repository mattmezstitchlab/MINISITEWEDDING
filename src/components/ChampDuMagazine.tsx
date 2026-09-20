import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { prenomsDuChamp } from '../lib/champDuMagazine';
import { effacerMagazine, magazineCompose, phraseDuMagazine, type MagazineCompose } from '../lib/composition';
import CouvertureJour from './CouvertureJour';

/**
 * LE CHAMP DU MAGAZINE — LA QUESTION DU HERO, APRÈS L'INTRO
 *
 * Un titre, un champ, un bouton : **vos deux prénoms, votre date**, et le
 * magazine se compose. Le champ ne demande rien d'autre, parce que tout le reste
 * **existe déjà** : les 365 journées, leurs couvertures, leurs cartes, leurs
 * personnages, leurs métiers, leurs portes, les univers, la playlist. On prend la
 * seule information que le site ne peut pas deviner, et il travaille.
 *
 * **Rien n'est un cul-de-sac** : sans une seule réponse, le bouton compose le
 * magazine **du jour** — il y en a trois cent soixante-cinq, un par jour.
 *
 * **Et quand le magazine existe**, ce bloc devient **sa couverture** : le titre
 * du bloc passe de la question au magazine lui-même — on ouvre, ou on complète
 * les questions laissées en attente. C'est ainsi que l'accueil tient à jour ce
 * qui a été répondu.
 */

export default function ChampDuMagazine({ className = '' }: { className?: string }) {
  const navigate = useNavigate();
  const [prenoms, setPrenoms] = useState('');
  const [date, setDate] = useState('');
  /** Le magazine déjà composé sur cet appareil : l'accueil le reprend. */
  const [compose, setCompose] = useState<MagazineCompose | null>(() => magazineCompose());

  const generer = (e: FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (prenoms.trim().length > 0) query.set('prenoms', prenoms.trim());
    if (date.length > 0) query.set('jour', date);
    navigate(`/generer${query.toString() ? `?${query}` : ''}`);
  };

  const completer = () => {
    const [partner1, partner2] = compose?.prenoms ?? prenomsDuChamp(prenoms);
    navigate('/creer', { state: { partner1, partner2, weddingDate: compose?.date ?? date } });
  };

  /* LE MAGAZINE EXISTE : le bloc devient sa couverture. */
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

  /* RIEN ENCORE : le titre, le champ, le bouton. */
  return (
    <form onSubmit={generer} className={`vp-glass w-full max-w-3xl rounded-[26px] p-4 text-left ${className}`}>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 px-1">
        <h2 className="vp-title text-[clamp(1.15rem,2.2vw,1.5rem)]">Votre magazine</h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--vp-muted)]">
          24 pages · une par heure
        </span>
      </div>

      <div className="flex flex-wrap items-end gap-2 sm:gap-3">
        <div className="min-w-[9rem] flex-1">
          <label htmlFor="champ-prenoms" className="vp-label ml-1 !text-[10px]">
            Vos deux prénoms
          </label>
          <input
            id="champ-prenoms"
            value={prenoms}
            onChange={(e) => setPrenoms(e.target.value)}
            placeholder="Paul & Emma"
            autoComplete="off"
            className="vp-field !py-3 !text-[15px]"
          />
        </div>

        <div className="w-[10.5rem]">
          <label htmlFor="champ-date" className="vp-label ml-1 !text-[10px]">
            La date
          </label>
          <div className="relative">
            <input
              id="champ-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="vp-field vp-num !py-3 !pl-9 !text-[15px]"
            />
            <CalendarDays
              size={15}
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--vp-muted)]"
            />
          </div>
        </div>

        <button type="submit" className="vp-btn vp-spec w-full shrink-0 !py-3.5 !text-[14.5px] sm:w-auto">
          Générer mon magazine
          <ArrowRight size={15} />
        </button>
      </div>
    </form>
  );
}
