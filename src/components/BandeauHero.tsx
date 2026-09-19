import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/**
 * LA BANDE DU HERO
 *
 * Le hero de chaque page se termine par la même bande : de grandes cartes à
 * faire défiler à l'horizontale, toujours au même endroit. C'est la charte du
 * site — le visuel de l'univers, le badge blanc du magazine, le nom en
 * majuscules — et c'est aussi la navigation de la page : d'un geste on change
 * d'univers, de métier ou d'article, sans ouvrir de menu.
 *
 * Ce que fait un clic dépend de la page, jamais de la bande : changer l'univers
 * montré (l'accueil), ouvrir la page de l'univers, ou passer à l'article de cet
 * univers — c'est la page qui le décide.
 *
 * Elle ne pose aucun contenant : la page l'installe dans le sien (`.vp-page`).
 */

export interface CarteBandeau {
  id: string;
  /** Le nom, écrit en majuscules sur le visuel. */
  titre: string;
  /** Le badge blanc, comme sur les cartes du magazine. */
  badge?: string;
  /** La ligne de dessous, à la place du badge quand il n'y a pas de visuel. */
  sousTitre?: string;
  /** Le visuel de la carte. */
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
  /** Ce que la bande annonce : « Les univers », « Les métiers d'à côté ». */
  libelle: string;
  cartes: CarteBandeau[];
  /** Le petit mot de droite, à la place du compte par défaut. */
  note?: string;
}

/** La carte, dans la charte du site : visuel, badge blanc, titre en capitales. */
function Carte({ carte }: { carte: CarteBandeau }): ReactNode {
  const etat = carte.actif ? 'ring-2 ring-white ring-offset-2 ring-offset-black/30' : 'hover:-translate-y-1';

  const dedans = carte.image ? (
    <>
      <div className="relative aspect-[16/10] overflow-hidden rounded-[16px]">
        <img
          src={carte.image}
          alt=""
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/10" />
        {carte.badge && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 px-2.5 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-black">
            {carte.badge}
          </span>
        )}
        {carte.actif && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-black/80 px-2 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
            Ici
          </span>
        )}
      </div>
      <span className="mt-2 flex items-center gap-2 px-0.5">
        {carte.accent && <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: carte.accent }} />}
        <span className="truncate text-[13px] font-bold uppercase tracking-[0.08em] text-white">{carte.titre}</span>
      </span>
    </>
  ) : (
    <>
      <div className="relative flex aspect-[16/10] flex-col justify-end rounded-[16px] border border-white/15 bg-white/8 p-3 backdrop-blur transition group-hover:bg-white/14">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/60">{carte.badge ?? carte.sousTitre}</span>
        {carte.actif && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-black/70 px-2 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
            Ici
          </span>
        )}
        <span className="mt-6 block text-[13px] font-bold uppercase leading-tight tracking-[0.08em] text-white">
          {carte.titre}
        </span>
        <span
          className="mt-2 block h-[3px] w-8 rounded-full"
          style={{ background: carte.accent ?? 'rgba(255,255,255,0.5)' }}
        />
      </div>
    </>
  );

  const classe =
    'group relative flex w-[248px] shrink-0 snap-start flex-col text-left no-underline transition duration-300 sm:w-[288px]';

  if (carte.to) {
    return (
      <Link to={carte.to} aria-current={carte.actif ? 'true' : undefined} className={`${classe} ${etat}`}>
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
      className={`${classe} ${etat}`}
    >
      {dedans}
    </button>
  );
}

export default function BandeauHero({ libelle, cartes, note }: BandeauHeroProps): ReactNode {
  if (cartes.length === 0) return null;

  return (
    <div className="w-full">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-white/60">{libelle}</span>
        <span className="hidden font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/40 sm:inline">
          {note ?? `${cartes.length} · faites défiler`}
        </span>
      </div>

      <div className="no-scrollbar -mx-1 flex snap-x gap-3.5 overflow-x-auto px-1 pb-2">
        {cartes.map((carte) => (
          <Carte key={carte.id} carte={carte} />
        ))}
      </div>
    </div>
  );
}
