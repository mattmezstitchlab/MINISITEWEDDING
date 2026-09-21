import { CHAPITRES } from '../lib/chapitres';
import type { Branche } from '../lib/couvertureDuJour';

/**
 * LE CADRAN DU MAGAZINE — LES AIGUILLES, ET LE TEMPS QU'ON REGARDE
 *
 * C'est la création centrale des couvertures, et elle dit désormais **tout** ce
 * qu'AIME MAGAZINE sait du moment :
 *
 * ```
 * le tour du cadran   → LES SEPT CHAPITRES du magazine (la semaine)
 * les vingt-quatre branches → LES HEURES de la journée (leur longueur est celle du jour)
 * la grande aiguille  → L'HEURE qu'on regarde — celle de la capsule du bas
 * la petite aiguille  → LE CHAPITRE où la date entre (le jour dans la semaine)
 * ```
 *
 * **Le lien avec la capsule temporelle** : la capsule du bas choisit un moment
 * (l'aube, le matin, le midi, l'après-midi, le soir) ; l'aiguille s'y pose — 6,
 * 9, 12, 15 ou 20 heures — et les branches de cette heure s'allument. Sans
 * moment choisi, l'aiguille suit **l'heure réelle** : le cadran est une horloge,
 * pas une décoration.
 *
 * Le même composant sert partout : sur la couverture (grand), dans le kiosque
 * (petit), et dans la capsule du bas (miniature) — c'est ce qui fait qu'on
 * reconnaît le magazine d'un écran à l'autre.
 */

interface CadranDuMagazineProps {
  /** L'heure du jour, de 0 à 24 — ce que montre la grande aiguille. */
  heure: number;
  /** Le chapitre actif, de 1 à 7 — ce que montre l'aiguille du magazine. */
  chapitre: number;
  /** Le fond de la couverture : la couleur du jour, ou le noir des jours rares. */
  fond: string;
  /** L'encre, calculée pour rester lisible sur ce fond. */
  encre: string;
  /** L'accent du magazine : la couleur de la semaine. */
  accent: string;
  /** Les vingt-quatre branches du jour, quand on les a (la signature du jour). */
  branches?: Branche[];
  /** Ce qui s'écrit sous les aiguilles : « 20 h — le soir », par exemple. */
  legende?: string;
  /** Vrai pour le kiosque : moins de texte, plus de dessin. */
  vignette?: boolean;
  className?: string;
}

/** Le milieu de la part d'un chapitre : 01 en haut, puis le tour dans l'ordre. */
export function angleDuChapitre(chapitre: number): number {
  const part = 360 / CHAPITRES.length;
  return -90 + (Math.min(7, Math.max(1, chapitre)) - 0.5) * part;
}

/** L'angle d'une heure, minuit en haut, comme sur l'ancien cadran. */
export function angleDeLHeure(heure: number): number {
  return (Math.min(24, Math.max(0, heure)) / 24) * 360 - 90;
}

/** Les points d'un arc de cercle, du début à la fin. */
function arc(centreX: number, centreY: number, rayon: number, de: number, a: number): string {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const x1 = centreX + rayon * Math.cos(rad(de));
  const y1 = centreY + rayon * Math.sin(rad(de));
  const x2 = centreX + rayon * Math.cos(rad(a));
  const y2 = centreY + rayon * Math.sin(rad(a));
  const grand = a - de > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${rayon} ${rayon} 0 ${grand} 1 ${x2} ${y2}`;
}

/** La main qui tourne : elle s'anime quand la capsule change de moment. */
const MAIN = {
  transformBox: 'view-box',
  transformOrigin: '50px 50px',
  transition: 'transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1)',
} as const;

export default function CadranDuMagazine({
  heure,
  chapitre,
  encre,
  accent,
  branches,
  legende,
  vignette = false,
  className = '',
}: CadranDuMagazineProps) {
  const centre = 50;
  const rayonChapitres = 45;
  const rayonNombres = 38;
  const rayonBranches = 27;
  const rayonInterieur = 11;
  const part = 360 / CHAPITRES.length;
  const angleChapitre = angleDuChapitre(chapitre);
  const angleHeure = angleDeLHeure(heure);

  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={legende ?? `${chapitre} — ${heure} h`} className={className}>
      {/* ————— LE TOUR DES SEPT CHAPITRES : la semaine, en sept parts ————— */}
      {CHAPITRES.map((c) => {
        const milieu = angleDuChapitre(c.numero);
        const actif = c.numero === chapitre;
        const debut = milieu - part / 2 + 2.4;
        const fin = milieu + part / 2 - 2.4;
        const rad = ((milieu - 90) * Math.PI) / 180;
        return (
          <g key={c.numero} data-chapitre={c.id} data-actif={actif ? 'true' : 'false'}>
            <path
              d={arc(centre, centre, rayonChapitres, debut, fin)}
              fill="none"
              stroke={actif ? accent : encre}
              strokeWidth={actif ? 2.6 : 1}
              strokeLinecap="round"
              opacity={actif ? 1 : 0.3}
            />
            {!vignette && (
              <text
                x={centre + rayonNombres * Math.cos(rad)}
                y={centre + rayonNombres * Math.sin(rad)}
                textAnchor="middle"
                dominantBaseline="central"
                fill={encre}
                opacity={actif ? 0.95 : 0.4}
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                fontSize={actif ? 4.6 : 3.6}
                fontWeight={actif ? 700 : 400}
              >
                {String(c.numero).padStart(2, '0')}
              </text>
            )}
          </g>
        );
      })}

      {/* ————— LES VINGT-QUATRE BRANCHES : les heures, et la signature du jour ————— */}
      {branches?.map((b) => {
        const rad = ((b.heure / 24) * 360 - 90) * (Math.PI / 180);
        const r1 = rayonInterieur + 1.5;
        const r2 = rayonInterieur + b.longueur * (rayonBranches - rayonInterieur);
        return (
          <line
            key={b.heure}
            x1={centre + Math.cos(rad) * r1}
            y1={centre + Math.sin(rad) * r1}
            x2={centre + Math.cos(rad) * r2}
            y2={centre + Math.sin(rad) * r2}
            stroke={encre}
            strokeWidth={b.eclatante ? 1.4 : 0.7}
            strokeLinecap="round"
            opacity={b.eclatante ? 0.95 : 0.45}
          />
        );
      })}

      {/* ————— LES DEUX CERCLES : la piste des heures et le cœur ————— */}
      <circle cx={centre} cy={centre} r={rayonBranches} fill="none" stroke={encre} strokeWidth="0.3" opacity="0.22" />
      <circle cx={centre} cy={centre} r={rayonInterieur - 3.5} fill="none" stroke={encre} strokeWidth="0.3" opacity="0.3" />

      {/* ————— L'AIGUILLE DU CHAPITRE : où l'on est dans le magazine ————— */}
      <g
        data-aiguille="chapitre"
        style={{ ...MAIN, transform: `rotate(${angleChapitre}deg)` }}
      >
        <line
          x1={centre}
          y1={centre}
          x2={centre + rayonChapitres - 5.5}
          y2={centre}
          stroke={accent}
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <circle cx={centre + rayonChapitres - 5.5} cy={centre} r="2.1" fill={accent} />
      </g>

      {/* ————— L'AIGUILLE DE L'HEURE : celle de la capsule temporelle ————— */}
      <g data-aiguille="heure" style={{ ...MAIN, transform: `rotate(${angleHeure}deg)` }}>
        <line
          x1={centre}
          y1={centre}
          x2={centre + rayonBranches - 5}
          y2={centre}
          stroke={encre}
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.92"
        />
        <circle cx={centre + rayonBranches - 5} cy={centre} r="1.4" fill={encre} opacity="0.92" />
        {/* Le contrepoids : ce qui reste du côté de la nuit. */}
        <line x1={centre - 3.5} y1={centre} x2={centre} y2={centre} stroke={encre} strokeWidth="1.1" strokeLinecap="round" opacity="0.5" />
      </g>

      {/* ————— LE CŒUR : l'axe, et la moitié du jour ————— */}
      <path
        d={`M ${centre - (rayonInterieur - 6)} ${centre} A ${rayonInterieur - 6} ${rayonInterieur - 6} 0 0 1 ${centre + (rayonInterieur - 6)} ${centre} Z`}
        fill={encre}
        opacity="0.7"
      />
      <circle cx={centre} cy={centre} r={rayonInterieur - 6} fill="none" stroke={encre} strokeWidth="0.35" opacity="0.5" />
      <circle cx={centre} cy={centre} r="1.6" fill={accent} />

      {/* ————— LA LÉGENDE : l'heure qu'on regarde, sous les aiguilles ————— */}
      {legende && !vignette && (
        <text
          x={centre}
          y={centre + rayonBranches + 8}
          textAnchor="middle"
          fill={encre}
          opacity="0.85"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize="4"
          letterSpacing="0.6"
        >
          {legende}
        </text>
      )}
    </svg>
  );
}
