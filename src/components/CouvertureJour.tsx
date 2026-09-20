import type { CouvertureJour } from '../lib/couvertureDuJour';

/**
 * LA COUVERTURE D'UN JOUR — LE MÊME DESSIN POUR LES 365
 *
 * Un fond uni, la marque en haut, **la création au centre** — un cadran de
 * vingt-quatre heures, une branche par heure de l'édition —, le nom du jour, et
 * la date en bas. Rien ne passe jamais sur la création.
 *
 * Tout est en **SVG**, dessiné ici : rien à téléverser, rien à installer, et
 * **la même date donne toujours la même couverture**. Ce dessin n'est pas une
 * illustration posée sur une page : c'est la couverture, et elle est la même au
 * kiosque, dans le flux, et en vignette.
 */

interface CouvertureJourProps {
  couverture: CouvertureJour;
  /** La largeur en pixels : la hauteur suit (rapport 5 / 7). */
  largeur?: number;
  /** Vrai pour une vignette : moins de texte, plus de dessin. */
  vignette?: boolean;
  className?: string;
}

export default function CouvertureJour({
  couverture,
  largeur = 300,
  vignette = false,
  className = '',
}: CouvertureJourProps) {
  const hauteur = Math.round((largeur * 7) / 5);
  const { fond, encre, branches } = couverture;
  const centreX = 50;
  const centreY = 47;
  const rayonInterieur = 11;
  const rayonMaximum = 27;
  const titreLong = couverture.titre.length > 16;

  /** Une branche : du bord du disque vers l'extérieur, à son heure. */
  const branche = (longueur: number, heure: number, eclatante: boolean) => {
    const angle = ((heure / 24) * 360 - 90) * (Math.PI / 180);
    const x1 = centreX + Math.cos(angle) * rayonInterieur;
    const y1 = centreY + Math.sin(angle) * rayonInterieur;
    const r2 = rayonInterieur + longueur * (rayonMaximum - rayonInterieur);
    const x2 = centreX + Math.cos(angle) * r2;
    const y2 = centreY + Math.sin(angle) * r2;
    return (
      <line
        key={heure}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={encre}
        strokeWidth={eclatante ? 1.5 : 0.8}
        strokeLinecap="round"
        opacity={eclatante ? 0.95 : 0.55}
      />
    );
  };

  return (
    <svg
      viewBox="0 0 100 140"
      width={largeur}
      height={hauteur}
      role="img"
      aria-label={`${couverture.titre} — ${couverture.dateLongue}, ${couverture.figure}`}
      className={className}
      style={{ display: 'block' }}
    >
      {/* LE FOND UNI : la couleur de la saison, ou le noir des jours qui ne sont pas comme les autres. */}
      <rect x="0" y="0" width="100" height="140" fill={fond} />

      {/* LA MARQUE EN HAUT, et le numéro dans l'année. */}
      <text
        x="50"
        y="9"
        textAnchor="middle"
        fill={encre}
        opacity="0.85"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize="3.1"
        letterSpacing="0.9"
      >
        AIME MAGAZINE
      </text>
      <text
        x="50"
        y="13.4"
        textAnchor="middle"
        fill={encre}
        opacity="0.5"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize="2.4"
        letterSpacing="0.7"
      >
        N° {couverture.numero} · SEMAINE {couverture.semaine}
      </text>

      {/* LA CRÉATION, AU CENTRE : le cadran des vingt-quatre heures. */}
      <g>
        <circle cx={centreX} cy={centreY} r={rayonMaximum + 3} fill="none" stroke={encre} strokeWidth="0.3" opacity="0.25" />
        <circle cx={centreX} cy={centreY} r={rayonInterieur - 3.5} fill="none" stroke={encre} strokeWidth="0.3" opacity="0.35" />
        {branches.map((b) => branche(b.longueur, b.heure, b.eclatante))}
        {/* Le centre : le disque du jour, et sa moitié — le jour et la nuit. */}
        <path
          d={`M ${centreX - (rayonInterieur - 5)} ${centreY} A ${rayonInterieur - 5} ${rayonInterieur - 5} 0 0 1 ${centreX + (rayonInterieur - 5)} ${centreY} Z`}
          fill={encre}
          opacity="0.85"
        />
        <circle cx={centreX} cy={centreY} r={rayonInterieur - 5} fill="none" stroke={encre} strokeWidth="0.4" opacity="0.6" />
      </g>

      {/* LE TITRE : le nom du jour, écrit au centre, sous la création. */}
      <text
        x="50"
        y="88"
        textAnchor="middle"
        fill={encre}
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize={titreLong ? 6.2 : 7.6}
        letterSpacing="0.2"
      >
        {couverture.titre}
      </text>
      {couverture.fete && (
        <text
          x="50"
          y="93.4"
          textAnchor="middle"
          fill={encre}
          opacity="0.72"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="3.2"
          fontStyle="italic"
        >
          en ce jour de {couverture.fete}
        </text>
      )}
      <text
        x="50"
        y={couverture.fete ? '98.6' : '94'}
        textAnchor="middle"
        fill={encre}
        opacity="0.7"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize="2.6"
        letterSpacing="0.6"
      >
        {couverture.saison.nom.toUpperCase()} {couverture.saison.symbole} · {couverture.figure.toUpperCase()}
      </text>

      {/* LA DATE EN BAS — et ce que le jour porte, quand on la regarde de près. */}
      <line x1="14" y1="112" x2="86" y2="112" stroke={encre} strokeWidth="0.25" opacity="0.35" />
      <text
        x="50"
        y="119"
        textAnchor="middle"
        fill={encre}
        opacity="0.9"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize="3"
        letterSpacing="0.8"
      >
        {couverture.dateLongue.toUpperCase()}
      </text>
      {!vignette && (
        <text
          x="50"
          y="125.5"
          textAnchor="middle"
          fill={encre}
          opacity="0.55"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize="2.3"
          letterSpacing="0.5"
        >
          {couverture.cles.slice(0, 3).map((c) => `${c.label.toUpperCase()} ${c.valeur}`.toUpperCase()).join(' · ')}
        </text>
      )}
      {couverture.pasCommeLesAutres && !vignette && (
        <text
          x="50"
          y="132"
          textAnchor="middle"
          fill={encre}
          opacity="0.45"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize="2.2"
          letterSpacing="0.5"
        >
          FOND NOIR — {couverture.raison.toUpperCase()}
        </text>
      )}
    </svg>
  );
}
