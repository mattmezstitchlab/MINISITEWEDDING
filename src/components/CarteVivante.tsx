import { Heart, Pause, Play } from 'lucide-react';
import type { CarteVivante } from '../lib/cartesVivantes';

/**
 * LA CARTE VIVANTE
 *
 * La carte musicale, devenue la carte de tout le site : le visuel, le badge, le
 * nom, la précision — puis les deux gestes, toujours les mêmes, sur toutes les
 * pages :
 *
 *  - **le cœur**, avec son nombre : la température du public, additionnée par
 *    le comptoir partagé ;
 *  - **le play**, qui lance le média de la carte dans le hero.
 *
 * Elle ne décide de rien : c'est la page qui lui dit où mène un clic, ce que
 * fait le cœur, et ce que joue le play. Elle ne fait que la même chose partout.
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
  className?: string;
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
  className = '',
}: CarteVivanteProps) {
  const echelle = 0.92 + facteur * 0.14;
  const jouable = Boolean(carte.media.audio || carte.media.video);

  return (
    <div
      style={{ transform: `scale(${echelle})` }}
      className={`group relative flex w-[186px] shrink-0 snap-start flex-col text-left transition-transform duration-150 ease-out sm:w-[214px] ${className}`}
    >
      {/* — la première couche : le visuel, et les deux gestes dessus — */}
      <div className="relative aspect-square overflow-hidden rounded-[18px] bg-black/10">
        {carte.media.image && (
          <img
            src={carte.media.image}
            alt=""
            className={`h-full w-full object-cover transition duration-700 ${
              joue ? 'scale-105 brightness-[0.78]' : 'group-hover:scale-[1.05]'
            }`}
          />
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/15" />

        {/* La carte entière ouvre ce qu'elle annonce ; le play, lui, est dessus. */}
        <button type="button" onClick={onClic} aria-label={`Ouvrir ${carte.titre}`} className="absolute inset-0 z-0" />

        <span className="pointer-events-none absolute left-2.5 top-2.5 z-10 rounded-full bg-white/95 px-2.5 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-black">
          {carte.badge}
        </span>
        {carte.actif && (
          <span className="pointer-events-none absolute right-2.5 top-2.5 z-10 rounded-full bg-black/75 px-2 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
            Ici
          </span>
        )}

        {/* Le nom, sur le visuel : la carte se lit même en petit */}
        <span className="pointer-events-none absolute inset-x-2.5 bottom-2.5 z-10 block">
          <span className="block text-[12.5px] font-bold uppercase leading-tight tracking-[0.06em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            {carte.titre}
          </span>
          {carte.sousTitre && (
            <span className="mt-0.5 block truncate text-[10.5px] text-white/70">{carte.sousTitre}</span>
          )}
        </span>

        {/* Le play : le média se lance dans le hero */}
        {jouable && (
          <button
            type="button"
            onClick={onJouer}
            aria-label={joue ? `Arrêter ${carte.titre}` : `Lancer ${carte.titre}`}
            className="absolute left-1/2 top-[42%] z-20 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-[#0B0C12] shadow-[0_10px_28px_rgba(0,0,0,0.45)] backdrop-blur transition hover:scale-105 active:scale-95"
          >
            {joue ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
          </button>
        )}
      </div>

      {/* — la deuxième couche : le cœur et son nombre, sous la carte — */}
      <div className="mt-1.5 flex items-center justify-between gap-2 px-1">
        <span className="truncate font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/55">
          {carte.badge ? `Avis · ${carte.sousTitre ? carte.sousTitre.split(' · ')[0] : ''}`.replace(/ · $/, '') : 'Avis'}
        </span>
        <button
          type="button"
          onClick={onAimer}
          aria-pressed={aime}
          aria-label={aime ? `Retirer mon avis sur ${carte.titre}` : `Aimer ${carte.titre}`}
          className={`flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold transition ${
            aime
              ? 'border-white/60 bg-white text-[#0B0C12]'
              : 'border-white/20 text-white/70 hover:border-white/50 hover:text-white'
          }`}
        >
          <Heart size={10} className={aime ? 'fill-current' : ''} />
          {avis}
        </button>
      </div>
    </div>
  );
}
