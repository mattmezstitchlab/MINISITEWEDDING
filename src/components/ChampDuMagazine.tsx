import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { prenomsDuChamp } from '../lib/champDuMagazine';

/**
 * LE CHAMP DU MAGAZINE — LA PREMIÈRE CHOSE QU'ON VOIT, ET LA SEULE QUESTION
 *
 * Sur l'accueil, avant tout le reste, un seul champ : **vos deux prénoms, votre
 * date** — et le magazine commence. Le champ ne demande rien d'autre, parce que
 * tout le reste **existe déjà** : les 365 journées, leurs couvertures, leurs
 * cartes, leurs personnages, leurs métiers, leurs portes, les univers, la
 * playlist. On ne fait donc pas remplir un formulaire : on prend la seule
 * information que le site ne peut pas deviner, et il travaille.
 *
 * Ensuite, **une question à la fois** (la règle de l'éditeur) : le champ passe
 * la main à la création, qui continue avec ce qui manque. Et celui qui ne répond
 * rien n'est pas bloqué : **le magazine du jour existe toujours** — il y a trois
 * cent soixante-cinq magazines, un par jour, et celui d'aujourd'hui est ouvert.
 *
 * Un champ ne se remplit pas d'invention : rien n'est déduit d'un prénom, rien
 * n'est publié avant d'avoir été validé.
 */

export default function ChampDuMagazine({ className = '' }: { className?: string }) {
  const navigate = useNavigate();
  const [prenoms, setPrenoms] = useState('');
  const [date, setDate] = useState('');

  const rien = prenoms.trim().length === 0 && date.length === 0;

  const generer = (e: FormEvent) => {
    e.preventDefault();
    // Sans une seule réponse : le magazine du jour, qui est toujours prêt.
    if (rien) {
      navigate('/magazine');
      return;
    }
    const [partner1, partner2] = prenomsDuChamp(prenoms);
    navigate('/creer', { state: { partner1, partner2, weddingDate: date } });
  };

  return (
    <form
      onSubmit={generer}
      className={`vp-glass w-full max-w-3xl rounded-[26px] p-3 text-left sm:p-4 ${className}`}
    >
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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

        <button
          type="submit"
          className="vp-btn vp-spec mt-4 w-full shrink-0 !py-3.5 !text-[14.5px] sm:mt-[1.35rem] sm:w-auto"
        >
          {rien ? 'Voir le magazine du jour' : 'Générer notre magazine'}
          <ArrowRight size={15} />
        </button>
      </div>

      <p className="mt-3 px-1 text-[12px] leading-relaxed text-[var(--vp-muted)]">
        {rien ? (
          <>
            Aucune réponse n’est nécessaire pour commencer :{' '}
            <span className="font-semibold text-[var(--vp-ink)]">365 magazines</span>, un par jour — celui
            d’aujourd’hui est ouvert.
          </>
        ) : (
          <>
            Ensuite, <span className="font-semibold text-[var(--vp-ink)]">une question à la fois</span> : le
            magazine se compose, puis on coche ce qu’on garde, ce qu’on modifie, ce qu’on retire.
          </>
        )}
      </p>
    </form>
  );
}
