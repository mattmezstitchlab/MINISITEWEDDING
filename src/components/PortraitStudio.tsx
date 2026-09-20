import type { StudioDuJour } from '../lib/jourDuMagazine';

/**
 * LE PORTRAIT DE STUDIO — LE VISAGE DU JOUR
 *
 * Les 364 prénoms du calendrier sont les **personnages** du magazine : des
 * exemples à nous, qui rendent les couvertures habitées. Chaque jour a son
 * portrait, **sur fond blanc comme en studio**, et **sur fond noir** les jours
 * qui ne sont pas des jours comme les autres (les dimanches, les temps clos, les
 * portes de l'année, les jokers).
 *
 * Le portrait est **rendu**, pas photographié : une silhouette, une lumière, une
 * pose, un attribut — tout se déduit de la date par une graine stable. Deux
 * jours ne se ressemblent donc jamais, et le même jour se retrouve à l'identique
 * quand on le relit. Les photographies réelles prendront la place, planche après
 * planche, sans que rien d'autre change.
 */

const PEAUX = ['#F1D0B4', '#E7BE9C', '#D9A57E', '#BE8460', '#8D5A3B', '#6B4227', '#F6DCC6', '#A9714B'];
const CHEVEUX = ['#1C1613', '#3B2A1C', '#6B4A2A', '#A8794A', '#C9A46A', '#8A8A8A', '#2B2B33', '#4A2C2C'];
const ETOFFES = ['#F4F4F2', '#E8E2D8', '#D9DEE4', '#C9CFD6', '#3E3A36', '#22242A', '#6E5B4B', '#B9C2C7'];

/** La même graine que le studio du jour : le portrait ne bouge pas. */
function tirages(graine: number) {
  return {
    peau: PEAUX[graine % PEAUX.length]!,
    cheveux: CHEVEUX[(graine >> 3) % CHEVEUX.length]!,
    etoffe: ETOFFES[(graine >> 6) % ETOFFES.length]!,
    coiffure: (graine >> 9) % 4,
    carrure: 0.92 + ((graine >> 12) % 7) / 50,
    inclinaison: ((graine >> 15) % 5) - 2,
  };
}

export default function PortraitStudio({
  nom,
  date,
  studio,
  saison,
  taille = 'hero',
}: {
  nom: string;
  date: Date;
  studio: StudioDuJour;
  /** La couleur de la saison : c'est elle qui teinte le fond du studio. */
  saison: { nom: string; fond: string; encre: string; symbole: string };
  taille?: 'hero' | 'carte';
}) {
  const noir = studio.fond === 'noir';
  const fond = noir ? '#0B0B0F' : '#F3F1ED';
  const encre = noir ? '#F7F5F2' : '#14141A';
  const t = tirages(studio.graine);
  const hero = taille === 'hero';
  const dateTexte = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <figure
      className={`relative overflow-hidden rounded-[20px] ${hero ? 'w-full max-w-[320px]' : 'w-[190px]'} shrink-0`}
      style={{ background: fond }}
      aria-label={`Portrait de studio — ${nom}, ${dateTexte}`}
    >
      {/* Le mur du studio : une lumière qui vient d'un côté, un sol qui remonte. */}
      <div
        className="absolute inset-0"
        style={{
          background: noir
            ? `radial-gradient(120% 80% at ${t.inclinaison > 0 ? 72 : 28}% 16%, ${saison.fond}55 0%, transparent 62%), linear-gradient(180deg, #0B0B0F 55%, #17171C 100%)`
            : `radial-gradient(120% 80% at ${t.inclinaison > 0 ? 72 : 28}% 16%, #FFFFFF 0%, transparent 60%), linear-gradient(180deg, #F7F6F3 60%, #E6E2DB 100%)`,
        }}
      />

      <svg viewBox="0 0 300 400" className={`relative block w-full ${hero ? 'aspect-[3/4]' : 'aspect-[3/4]'}`} role="img" aria-hidden="true">
        <defs>
          <linearGradient id={`clair-${studio.graine}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={noir ? '#FFFFFF' : '#FFFFFF'} stopOpacity={noir ? 0.22 : 0.5} />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Le sol du studio, et l'ombre portée. */}
        <ellipse cx="150" cy="392" rx={noir ? 86 : 96} ry="9" fill="#000000" opacity={noir ? 0.5 : 0.12} />

        <g transform={`translate(${t.inclinaison * 3} 0) scale(${t.carrure} ${t.carrure}) translate(${(1 - t.carrure) * 150} ${(1 - t.carrure) * 400})`}>
          {/* Les épaules, et le vêtement qui tombe. */}
          <path d="M150 208 C 104 214 78 250 70 320 C 66 356 64 380 64 396 L 236 396 C 236 380 234 356 230 320 C 222 250 196 214 150 208 Z" fill={t.etoffe} />
          <path d="M150 210 C 138 232 138 250 150 264 C 162 250 162 232 150 210 Z" fill={t.etoffe} opacity="0.85" />
          {/* Le cou. */}
          <rect x="136" y="176" width="28" height="42" rx="12" fill={t.peau} />
          {/* Le visage. */}
          <ellipse cx="150" cy="140" rx="42" ry="52" fill={t.peau} />
          {/* Les cheveux : quatre coiffures, tirées de la graine. */}
          {t.coiffure === 0 && <path d="M108 138 C 108 96 122 84 150 84 C 178 84 192 96 192 138 C 186 120 176 112 150 112 C 124 112 114 120 108 138 Z" fill={t.cheveux} />}
          {t.coiffure === 1 && <path d="M106 150 C 100 92 124 80 150 80 C 176 80 200 92 194 150 C 196 186 188 206 182 214 C 186 176 182 132 150 128 C 118 132 114 176 118 214 C 112 206 104 186 106 150 Z" fill={t.cheveux} />}
          {t.coiffure === 2 && (
            <>
              <path d="M112 132 C 116 94 130 86 150 86 C 170 86 184 94 188 132 C 178 116 168 110 150 110 C 132 110 122 116 112 132 Z" fill={t.cheveux} />
              <circle cx="150" cy="74" r="18" fill={t.cheveux} />
            </>
          )}
          {t.coiffure === 3 && <path d="M110 130 C 116 98 128 90 150 90 C 172 90 184 98 190 130 C 176 118 166 114 150 114 C 134 114 124 118 110 130 Z" fill={t.cheveux} opacity="0.9" />}
          {/* Les yeux et la bouche : trois traits, pas plus. */}
          <ellipse cx="134" cy="142" rx="4" ry="5" fill="#1B1B20" />
          <ellipse cx="166" cy="142" rx="4" ry="5" fill="#1B1B20" />
          <path d="M138 164 Q 150 172 162 164" stroke="#1B1B20" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7" />
        </g>

        {/* La lumière du studio, par-dessus : c'est elle qui fait la photo. */}
        <rect x="0" y="0" width="300" height="400" fill={`url(#clair-${studio.graine})`} />
      </svg>

      {/* La légende : le prénom, la date, et comment la photo a été prise. */}
      <figcaption
        className="absolute inset-x-0 bottom-0 p-3"
        style={{ color: encre, background: noir ? 'linear-gradient(180deg, transparent, #0B0B0F 70%)' : 'linear-gradient(180deg, transparent, #F3F1ED 72%)' }}
      >
        <div className="vp-title text-[19px] font-bold leading-tight">{nom}</div>
        <div className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.14em] opacity-70">
          {saison.symbole} {saison.nom} · {dateTexte}
        </div>
        <div className="mt-1 text-[10.5px] leading-snug opacity-70">
          {studio.pose} · {studio.attribut} · {studio.lumiere}
        </div>
      </figcaption>

      {/* Le coin du studio : fond blanc ou fond noir, et pourquoi. */}
      <span
        className="absolute left-3 top-3 rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em]"
        style={{ background: noir ? '#F7F5F2' : '#14141A', color: noir ? '#14141A' : '#F7F5F2' }}
      >
        Studio {studio.fond}
      </span>
    </figure>
  );
}
