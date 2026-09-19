import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/**
 * LA BANDE DU HERO
 *
 * Le hero de chaque page se termine par la même bande : des cartes à faire
 * défiler à l'horizontale, toujours au même endroit, qui font passer d'un
 * univers à l'autre — ou d'un métier à l'autre. C'est la navigation de la page,
 * posée là où le regard arrive : plus besoin d'ouvrir un menu déroulant pour
 * changer d'univers, on le fait d'un geste, et on voit où l'on est.
 *
 * Elle ne pose aucun contenant : la page l'installe dans le sien
 * (`.vp-page`), comme le reste de ses blocs.
 */

export interface CarteBandeau {
  id: string;
  /** Le nom, écrit sur la carte. */
  titre: string;
  /** La précision, en petit au-dessus : un domaine, un registre… */
  sousTitre?: string;
  /** Le visuel de la carte, quand elle en a un. */
  image?: string;
  /** La pastille de couleur : l'accent de l'univers. */
  accent?: string;
  /** L'élément courant : la carte est marquée « Ici ». */
  actif?: boolean;
  /** Où mène la carte. Sans adresse, `onChoisir` fait le travail. */
  to?: string;
  /** Choisir sur place — l'accueil, où l'univers change le hero. */
  onChoisir?: () => void;
}

interface BandeauHeroProps {
  /** Ce que la bande annonce : « Les univers », « Les métiers de cet univers ». */
  libelle: string;
  cartes: CarteBandeau[];
  /** Le petit mot de droite, à la place du compte par défaut. */
  note?: string;
}

function Carte({ carte }: { carte: CarteBandeau }): ReactNode {
  const commun =
    'group relative flex h-[94px] w-[168px] shrink-0 snap-start flex-col overflow-hidden rounded-[16px] border no-underline transition duration-300';
  const etat = carte.actif
    ? 'border-white/70 ring-2 ring-white/50'
    : 'border-white/15 hover:border-white/45 hover:-translate-y-0.5';

  const dedans = carte.image ? (
    <>
      <img
        src={carte.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/35 to-black/10" />
      {carte.accent && (
        <span className="absolute left-2 top-2 h-2 w-2 rounded-full shadow-sm" style={{ background: carte.accent }} />
      )}
      {carte.actif && (
        <span className="absolute right-2 top-2 rounded-full bg-white px-1.5 py-0.5 font-mono text-[8.5px] font-bold uppercase tracking-wider text-black">
          Ici
        </span>
      )}
      <span
        className="absolute inset-x-2 bottom-2 text-[12.5px] font-semibold leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
      >
        {carte.titre}
      </span>
    </>
  ) : (
    <>
      <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/55">{carte.sousTitre}</span>
      {carte.actif && (
        <span className="absolute right-2 top-2 rounded-full bg-white px-1.5 py-0.5 font-mono text-[8.5px] font-bold uppercase tracking-wider text-black">
          Ici
        </span>
      )}
      <span className="mt-auto block pr-1 text-[12.5px] font-semibold leading-tight text-white">{carte.titre}</span>
      <span
        className="mt-1.5 block h-[3px] w-7 rounded-full"
        style={{ background: carte.accent ?? 'rgba(255,255,255,0.5)' }}
      />
    </>
  );

  const classeImage = carte.image ? '' : 'bg-white/8 p-2.5 backdrop-blur hover:bg-white/14';

  if (carte.to) {
    return (
      <Link
        to={carte.to}
        aria-current={carte.actif ? 'true' : undefined}
        className={`${commun} ${etat} ${classeImage}`}
      >
        {dedans}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={carte.onChoisir}
      aria-current={carte.actif ? 'true' : undefined}
      aria-pressed={carte.actif}
      className={`${commun} ${etat} ${classeImage} text-left`}
    >
      {dedans}
    </button>
  );
}

export default function BandeauHero({ libelle, cartes, note }: BandeauHeroProps): ReactNode {
  if (cartes.length === 0) return null;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-white/60">{libelle}</span>
        <span className="hidden font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/40 sm:inline">
          {note ?? `${cartes.length} · faites défiler`}
        </span>
      </div>

      <div className="no-scrollbar -mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1">
        {cartes.map((carte) => (
          <Carte key={carte.id} carte={carte} />
        ))}
      </div>
    </div>
  );
}
