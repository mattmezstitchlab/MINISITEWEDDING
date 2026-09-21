import type { Edition } from '../lib/aimeMoteur';
import { magazineParNumero } from '../lib/semaines';
import { visuelDeLaCouverture } from '../lib/visuelsDuMagazine';

/**
 * LA COUVERTURE D'UNE SEMAINE — FOND UNI, CRÉATION AU CENTRE
 *
 * Quatre couvertures de base, une par saison : **un fond uni**, et au centre la
 * **création digitale sur l'amour de la saison**. Rien ne passe dessus : la
 * marque tient le haut, le nom et la carte tiennent le bas, comme sur un vrai
 * magazine — et le milieu reste à l'image.
 *
 * **Depuis la collection**, une semaine peut porter son propre visuel
 * (`semaine-38/cover.jpg`) : dès qu'il est livré, il prend la place du dessin de
 * saison, et la couverture affiche le **titre du magazine**. Sans visuel, la
 * couverture de saison reste — elle est le repli, pas un brouillon.
 *
 * AIME en haut à gauche, le numéro en haut à droite ; en bas, la saison, la
 * carte de la semaine et sa date.
 */

export default function CouvertureSemaine({
  edition,
  /** 1 au centre, moins sur les côtés. */
  facteur = 1,
  active = false,
  onChoisir,
  taille = 'normale',
}: {
  edition: Edition;
  facteur?: number;
  active?: boolean;
  onChoisir: () => void;
  taille?: 'normale' | 'petite';
}) {
  const echelle = 0.88 + facteur * 0.12;
  const { carte, saison } = edition;
  const petite = taille === 'petite';
  const teinte = saison.encre;
  const date = edition.du.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  /** Le magazine de cette semaine, et son visuel — s'il est livré. */
  const magazine = magazineParNumero(carte.numero);
  const visuel = visuelDeLaCouverture(magazine.numero);
  const image = visuel.url ?? saison.visuel;

  return (
    <button
      type="button"
      onClick={onChoisir}
      aria-label={`AIME MAGAZINE n° ${carte.numero} — ${magazine.titre}, ${saison.nom}`}
      aria-pressed={active}
      style={{ transform: `scale(${echelle})`, background: saison.fond, color: teinte }}
      className={`group relative shrink-0 overflow-hidden rounded-[16px] text-left transition-transform duration-200 ease-out ${
        petite ? 'w-[150px]' : 'w-[210px] sm:w-[236px]'
      } ${active ? 'z-20 shadow-[0_26px_60px_-20px_rgba(0,0,0,0.55)]' : 'z-10 opacity-85 shadow-[0_18px_44px_-24px_rgba(0,0,0,0.5)] hover:opacity-100'}`}
    >
      <div className="relative aspect-[3/4.2] w-full">
        {/* La création digitale, au centre du fond uni. */}
        <img src={image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        {visuel.url && <div className="absolute inset-0 bg-black/25" />}

        <div className="relative flex h-full flex-col justify-between p-3.5" style={{ color: teinte }}>
          <div className="flex items-baseline justify-between gap-2">
            <span className="vp-title text-[11px] font-bold italic tracking-[0.16em]">AIME</span>
            <span className="font-mono text-[10px] tracking-[0.16em] opacity-80">
              N° {String(carte.numero).padStart(2, '0')}
            </span>
          </div>

          <div className={petite ? 'text-right' : ''}>
            <div
              className={`vp-title font-bold ${petite ? 'text-[14px]' : 'text-[19px] sm:text-[21px]'}`}
              style={{ lineHeight: 1.05 }}
            >
              {visuel.url ? magazine.titre : saison.nom}
            </div>
            {visuel.url && (
              <div className={`mt-0.5 font-mono uppercase tracking-[0.12em] opacity-70 ${petite ? 'text-[8px]' : 'text-[9px]'}`}>
                {magazine.style}
              </div>
            )}
            <div className={`mt-1 font-mono uppercase tracking-[0.14em] opacity-75 ${petite ? 'text-[8.5px]' : 'text-[9.5px]'}`}>
              {carte.joker ? 'Hors calendrier' : `Semaine ${carte.semaine}`}
            </div>
            <div
              className={`mt-2 border-t pt-2 text-[9.5px] leading-snug ${petite ? 'opacity-70' : 'opacity-80'}`}
              style={{ borderColor: `${teinte}33` }}
            >
              {carte.joker ? (
                <span>Hors calendrier</span>
              ) : (
                <span>
                  Semaine {carte.semaine} · {date}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
