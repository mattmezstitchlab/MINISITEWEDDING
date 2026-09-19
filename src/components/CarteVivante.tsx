import { Heart, Pause, Play } from 'lucide-react';
import type { CarteVivante } from '../lib/cartesVivantes';

/**
 * LA CARTE VIVANTE — LA CARTE DE LA PLAYLIST
 *
 * La carte de la section playlist, exactement : la pochette, le bouton de
 * lecture posé dessus, la pastille du haut, le titre, la précision, et son
 * avis dessous. Elle sert dans la bande de navigation, sous le hero, sur toutes
 * les pages — et sur toute page, c'est la même carte.
 *
 * Deux gestes, et rien d'autre : **le play** (le média s'enclenche) et **le
 * cœur** avec son nombre (l'avis du public). Aucune mention d'état sur la
 * carte : c'est la bande qui dit où l'on est, en centrant la carte courante.
 */

interface CarteVivanteProps {
  carte: CarteVivante;
  /** 0 à 1 selon la place dans la bande : la carte grossit au centre. */
  facteur?: number;
  /** Ce que ce navigateur pense de la carte. */
  aime: boolean;
  /** Le nombre de cœurs, tel que le comptoir le dit. */
  avis: number;
  /** Vrai quand c'est cette carte qui joue dans le hero. */
  joue?: boolean;
  onClic: () => void;
  onAimer: () => void;
  onJouer: () => void;
}

export default function CarteVivanteUI({
  carte,
  facteur = 0.5,
  aime,
  avis,
  joue = false,
  onClic,
  onAimer,
  onJouer,
}: CarteVivanteProps) {
  // Le même grossissement que la bande de la playlist : 0.88 au bord, 1.06 au
  // centre.
  const echelle = 0.88 + facteur * 0.18;
  const jouable = Boolean(carte.media.audio || carte.media.video);

  return (
    <div
      data-actif={carte.actif ? 'true' : undefined}
      style={{ transform: `scale(${echelle})` }}
      className={`group relative w-[172px] shrink-0 snap-center rounded-[20px] p-2.5 text-left transition-transform duration-150 ease-out sm:w-[188px] ${
        carte.actif
          ? 'z-20 border border-black/10 bg-white shadow-[0_16px_40px_-16px_rgba(0,0,0,0.28)]'
          : 'z-10 border border-black/6 bg-white'
      }`}
    >
      {/* La pochette, avec le bouton de lecture posé dessus */}
      <div className="relative aspect-square w-full overflow-hidden rounded-[15px] bg-black/5 shadow-inner">
        {carte.media.image && (
          <img
            src={carte.media.image}
            alt=""
            className={`h-full w-full object-cover transition duration-700 ${
              joue ? 'scale-105 brightness-90' : 'group-hover:scale-105'
            }`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        {carte.badge && (
          <span className="absolute left-2.5 top-2.5 rounded-full border border-white/10 bg-black/75 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide text-white backdrop-blur-md">
            {carte.badge}
          </span>
        )}

        {jouable && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              onClick={onJouer}
              aria-label={joue ? `Arrêter ${carte.titre}` : `Lancer ${carte.titre}`}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow-2xl transition-transform duration-300 hover:scale-110"
            >
              {joue ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
            </button>
          </div>
        )}

        {carte.etiquette && (
          <span className="absolute inset-x-2.5 bottom-2 truncate font-mono text-[9px] uppercase tracking-wider text-white/80">
            {carte.etiquette}
          </span>
        )}
      </div>

      {/* L'extrait qui avance : la barre suit la lecture */}
      {joue && (
        <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-black/8">
          <div
            className="h-full w-1/2 rounded-full transition-[width] duration-200"
            style={{ background: carte.accent ?? '#0B0C12' }}
          />
        </div>
      )}

      {/* Le titre, la précision, et l'avis du public */}
      <div className="mt-2.5">
        <button type="button" onClick={onClic} className="block w-full truncate text-left">
          <span className="block truncate text-[13px] font-bold leading-tight text-[#0B0C12]">{carte.titre}</span>
        </button>
        {carte.sousTitre && (
          <div className="mt-0.5 truncate text-[10.5px] text-black/55">{carte.sousTitre}</div>
        )}
        <div className="mt-2 flex items-center justify-between border-t border-black/8 pt-1.5">
          <button
            type="button"
            onClick={onAimer}
            aria-pressed={aime}
            aria-label={aime ? `Retirer mon avis sur ${carte.titre}` : `Aimer ${carte.titre}`}
            className={`flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold transition ${
              aime
                ? 'border-black/70 bg-[#0B0C12] text-white'
                : 'border-black/12 text-black/55 hover:border-black/35 hover:text-black'
            }`}
          >
            <Heart size={10} className={aime ? 'fill-current' : ''} />
            {avis}
          </button>
          <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: carte.accent ?? '#0B0C12' }} />
        </div>
      </div>
    </div>
  );
}
