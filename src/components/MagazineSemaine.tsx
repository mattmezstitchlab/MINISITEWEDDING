import { MARQUE_MAGAZINE } from '../lib/aimeMagazine';
import type { Magazine } from '../lib/semaines';
import { visuelDeLaCouverture } from '../lib/visuelsDuMagazine';

/**
 * LA COUVERTURE D'UN MAGAZINE DE LA COLLECTION — LES 54 PORTES D'ENTRÉE
 *
 * Un numéro, une semaine, une personnalité : c'est l'objet qu'on vient
 * chercher au kiosque. La couverture est celle de la bibliothèque
 * (`semaine-38/cover.jpg`) ; tant qu'elle n'est pas livrée, **on ne montre pas
 * le visuel d'une autre semaine** — on montre la vignette éditoriale du
 * magazine : la couleur de sa saison, son numéro, son titre, son style, et sa
 * mention « à paraître ».
 *
 * Les sept chapitres sont écrits sur la couverture, dans l'ordre : on sait ce
 * qu'on va trouver dedans avant d'ouvrir.
 */

interface MagazineSemaineProps {
  magazine: Magazine;
  /** 1 au centre, moins sur les côtés. */
  facteur?: number;
  /** Vrai pour le magazine de la date regardée. */
  active?: boolean;
  /** `petite` pour les bandes horizontales. */
  taille?: 'normale' | 'petite';
  onChoisir?: () => void;
}

export default function MagazineSemaine({
  magazine,
  facteur = 1,
  active = false,
  taille = 'normale',
  onChoisir,
}: MagazineSemaineProps) {
  const echelle = 0.9 + facteur * 0.1;
  const petite = taille === 'petite';
  const visuel = visuelDeLaCouverture(magazine.numero);
  const teinte = magazine.saison.encre;

  const contenu = (
    <div className="relative aspect-[3/4.15] w-full overflow-hidden rounded-[18px]">
      {/* L'IMAGE DE LA SEMAINE, ou la vignette de repli — jamais celle d'une autre. */}
      {visuel.url ? (
        <img
          src={visuel.url}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: magazine.saison.fond, color: teinte }}
        >
          {/* Le motif du repli : les sept chapitres, en sept traits. */}
          <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
            {magazine.chapitres.map((c) => (
              <span
                key={c.numero}
                aria-hidden="true"
                className="block h-[6px] flex-1 rounded-full"
                style={{ background: `${teinte}44` }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/5 to-black/85" />

      <div className="relative flex h-full flex-col justify-between p-3.5 text-white">
        <div className="flex items-baseline justify-between gap-2">
          <span className="vp-title text-[11px] font-bold italic tracking-[0.16em]">{MARQUE_MAGAZINE}</span>
          <span className="font-mono text-[9.5px] tracking-[0.16em] text-white/80">
            N° {String(magazine.numero).padStart(2, '0')}
          </span>
        </div>

        <div>
          <div className={`vp-title font-bold ${petite ? 'text-[15px]' : 'text-[19px] sm:text-[21px]'}`} style={{ lineHeight: 1.06 }}>
            {magazine.titre}
          </div>
          <div className={`mt-1 font-mono uppercase tracking-[0.12em] text-white/70 ${petite ? 'text-[8.5px]' : 'text-[9.5px]'}`}>
            {magazine.style}
          </div>
          {!petite && (
            <ul className="mt-2.5 grid gap-0.5 border-t border-white/25 pt-2">
              {magazine.chapitres.map((c) => (
                <li key={c.numero} className="truncate text-[10px] text-white/80">
                  {String(c.numero).padStart(2, '0')} · {c.chapitre.titre}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/70">
          {magazine.joker
            ? 'Hors calendrier — le jour de trop'
            : `Semaine ${magazine.semaine} · ${magazine.saison.nom}`}
          {!visuel.url && <span className="ml-1 text-white/45">· à paraître</span>}
        </div>
      </div>
    </div>
  );

  if (!onChoisir) return <div className={petite ? 'w-[150px]' : 'w-[210px] sm:w-[236px]'}>{contenu}</div>;

  return (
    <button
      type="button"
      onClick={onChoisir}
      aria-pressed={active}
      aria-label={`${MARQUE_MAGAZINE} n° ${magazine.numero} — ${magazine.titre}, ${magazine.style}`}
      style={{ transform: `scale(${echelle})` }}
      className={`group relative shrink-0 text-left transition-transform duration-200 ease-out ${
        petite ? 'w-[150px]' : 'w-[210px] sm:w-[236px]'
      } ${
        active
          ? 'z-20 shadow-[0_26px_60px_-20px_rgba(0,0,0,0.55)]'
          : 'z-10 opacity-85 shadow-[0_18px_44px_-24px_rgba(0,0,0,0.5)] hover:opacity-100'
      }`}
    >
      {contenu}
    </button>
  );
}
