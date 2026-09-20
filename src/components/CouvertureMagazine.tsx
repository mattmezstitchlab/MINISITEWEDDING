import type { CouvertureMagazine as Couverture } from '../lib/aimeMagazine';

/**
 * LA COUVERTURE — UN MAGAZINE DE KIOSQUE
 *
 * En haut la **marque** (AIME MAGAZINE) et le numéro ; au milieu **le thème**,
 * en grand ; en bas, sur la photo, **les titres à la une**. C'est la couverture
 * d'un vrai magazine : on la reconnaît sans lire, et elle dit exactement ce
 * qu'il y a dedans.
 *
 * La carte au centre est **l'édition ouverte** ; celles de côté sont les
 * suivantes. Un clic ouvre l'édition — et le dock mène la même bande, comme
 * partout.
 */

interface CouvertureMagazineProps {
  couverture: Couverture;
  /** 1 au centre, moins sur les côtés. */
  facteur?: number;
  /** Vrai pour l'édition ouverte. */
  active?: boolean;
  onChoisir: () => void;
}

export default function CouvertureMagazine({
  couverture,
  facteur = 1,
  active = false,
  onChoisir,
}: CouvertureMagazineProps) {
  /** Le centre est plein, les côtés reculent : c'est la mise en avant du kiosque. */
  const echelle = 0.86 + facteur * 0.14;

  return (
    <button
      type="button"
      onClick={onChoisir}
      aria-label={`AIME MAGAZINE n° ${couverture.numero} — ${couverture.theme}`}
      aria-pressed={active}
      style={{ transform: `scale(${echelle})` }}
      className={`group relative w-[236px] shrink-0 overflow-hidden rounded-[18px] text-left transition-transform duration-200 ease-out sm:w-[268px] ${
        active
          ? 'z-20 shadow-[0_30px_70px_-24px_rgba(0,0,0,0.6)] ring-2 ring-white/80'
          : 'z-10 opacity-75 shadow-[0_20px_50px_-26px_rgba(0,0,0,0.55)] hover:opacity-100'
      }`}
    >
      {/* Le papier : la couverture est un objet, pas une photo posée sur le fond. */}
      <div className="relative aspect-[3/4.15] w-full bg-[#0B0C12]">
        <img
          src={couverture.visuel}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/10 to-black/88" />
        {/* Le filet de l'édition, en haut : la couleur du thème. */}
        <div className="absolute inset-x-0 top-0 h-1" style={{ background: couverture.accent }} />

        <div className="relative flex h-full flex-col justify-between p-4 text-white">
          {/* LA MARQUE, en haut */}
          <div className="flex items-baseline justify-between gap-2">
            <span className="vp-title text-[13px] font-bold italic tracking-[0.16em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              {couverture.marque}
            </span>
            <span className="font-mono text-[10px] tracking-[0.18em] text-white/70">
              N° {couverture.numero}
            </span>
          </div>

          {/* LE THÈME, au milieu */}
          <div>
            <h3
              className="vp-title drop-shadow-[0_3px_18px_rgba(0,0,0,0.7)]"
              style={{ fontSize: 'clamp(1.15rem, 2vw, 1.5rem)', lineHeight: 1.06 }}
            >
              {couverture.theme}
            </h3>
            <p className="mt-2 max-w-[210px] text-[11.5px] leading-snug text-white/75">
              {couverture.sousTitre}
            </p>
          </div>

          {/* LES TITRES À LA UNE, en bas */}
          <ul className="grid gap-1.5 border-t border-white/25 pt-2.5">
            {couverture.aLaUne.map((titre) => (
              <li key={titre} className="truncate text-[11px] text-white/85">
                {titre}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </button>
  );
}
