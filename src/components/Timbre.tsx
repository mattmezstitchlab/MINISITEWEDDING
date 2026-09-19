import { useId } from 'react';

/**
 * LE TIMBRE ET LE SCEAU
 *
 * Le timbre, c'est la photo de profil du réseau : un rectangle dentelé, la
 * photo, le nom, la date — le même objet que sur la carte postale
 * d'invitation. Le sceau, c'est le tampon rond du site : les noms, la date et
 * le lieu écrits au cercle.
 *
 * Les deux sont dessinés ici : aucune image à téléverser, aucune police à
 * installer. La carte postale et les pages de profil s'en servent ensemble.
 */

export interface TimbreProps {
  photo?: string;
  /** Ce que le timbre annonce : « Le marié », « Son timbre », « Invité »… */
  label: string;
  nom: string;
  /** Déjà écrite court : « 12.06.2027 ». */
  date?: string;
  accent: string;
  /** L'inclinaison du timbre, en degrés. */
  penche?: number;
  /** La largeur du timbre : 112 sur une carte postale, 148 en photo de profil. */
  largeur?: number;
  /** Sans photo : les initiales, posées comme un portrait. */
  initiales?: string;
}

export function Timbre({
  photo,
  label,
  nom,
  date,
  accent,
  penche = 0,
  largeur = 112,
  initiales = '',
}: TimbreProps) {
  const hauteur = Math.round(largeur * 0.72);
  return (
    <figure
      className="relative shrink-0 bg-white p-[3px] shadow-[0_12px_26px_-16px_rgba(0,0,0,0.6)]"
      style={{ transform: `rotate(${penche}deg)`, width: `${largeur}px` }}
    >
      {/* La dentelure du timbre */}
      <span
        className="pointer-events-none absolute inset-[3px] border border-dashed"
        style={{ borderColor: 'rgba(0,0,0,0.28)' }}
      />
      {photo ? (
        <img src={photo} alt="" className="w-full object-cover" style={{ height: `${hauteur}px` }} />
      ) : (
        <span
          className="flex w-full items-center justify-center text-[34px] font-bold text-white"
          style={{ height: `${hauteur}px`, background: accent }}
        >
          {initiales}
        </span>
      )}
      <figcaption className="px-1 pb-1 pt-1.5 text-center font-mono text-[8px] uppercase leading-[1.35] tracking-[0.1em] text-black/60">
        <span className="block font-black" style={{ color: accent }}>
          {label}
          {nom ? ` · ${nom}` : ''}
        </span>
        {date}
        <br />
        VOWS · POSTE 22H
      </figcaption>
    </figure>
  );
}

export interface SceauProps {
  /** Le texte écrit au cercle. */
  texte: string;
  /** Ce qui est écrit au centre — la date, le plus souvent. */
  centre: string;
  accent: string;
  taille?: number;
}

export function Sceau({ texte, centre, accent, taille = 112 }: SceauProps) {
  const id = useId().replace(/:/g, '');
  const chemin = `sceau-${id}`;
  const cercle = 2 * Math.PI * 41;
  return (
    <svg viewBox="0 0 120 120" className="mix-blend-multiply" style={{ width: taille, height: taille }} aria-hidden>
      <defs>
        <path id={chemin} d="M60,60 m-41,0 a41,41 0 1,1 82,0 a41,41 0 1,1 -82,0" />
      </defs>
      <circle cx="60" cy="60" r="53" fill="none" stroke={accent} strokeWidth="2.4" opacity="0.9" />
      <circle cx="60" cy="60" r="30" fill="none" stroke={accent} strokeWidth="1.2" opacity="0.75" />
      <text fill={accent} fontSize="9" fontWeight="800" letterSpacing="0.6" opacity="0.95">
        <textPath href={`#${chemin}`} textLength={cercle} lengthAdjust="spacing">
          {texte}
        </textPath>
      </text>
      <text x="60" y="58" textAnchor="middle" fill={accent} fontSize="12" fontWeight="800" letterSpacing="0.5">
        {centre}
      </text>
      <text x="60" y="70" textAnchor="middle" fill={accent} fontSize="7.5" fontWeight="700" letterSpacing="2">
        VOWS
      </text>
    </svg>
  );
}
