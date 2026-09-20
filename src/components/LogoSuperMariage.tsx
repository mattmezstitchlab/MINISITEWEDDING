/**
 * LE SOLEIL-CADRAN — LE LOGO DE SUPER MARIAGE
 *
 * Synthétisé : **un cercle, douze rayons, un point au centre** — le cadran des
 * couvertures, ramené à son geste. Douze rayons comme douze mois, quatre d'entre
 * eux plus marqués aux quatre temps de la journée. Assez grand pour se lire,
 * assez simple pour ne plus faire une tache.
 *
 * Il est en `currentColor` : blanc sur les fonds sombres, noir sur les fonds
 * clairs — comme le nom qu'il accompagne.
 */

interface LogoSuperMariageProps {
  /** La largeur en pixels : le dessin est carré. */
  taille?: number;
  /** La couleur du tracé — `currentColor` par défaut. */
  couleur?: string;
  className?: string;
}

export default function LogoSuperMariage({
  taille = 26,
  couleur = 'currentColor',
  className = '',
}: LogoSuperMariageProps) {
  /** Douze rayons, un par mois, posés comme les heures du cadran. */
  const rayons = Array.from({ length: 12 }, (_, mois) => {
    const angle = (mois / 12) * Math.PI * 2 - Math.PI / 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      cle: mois,
      x1: 20 + cos * 10,
      y1: 20 + sin * 10,
      x2: 20 + cos * 17,
      y2: 20 + sin * 17,
      /** Les quatre temps de la journée : plus marqués. */
      pleine: mois % 3 === 0,
    };
  });

  return (
    <svg
      width={taille}
      height={taille}
      viewBox="0 0 40 40"
      role="img"
      aria-label="Le soleil-cadran, logo de SUPER MARIAGE"
      className={className}
    >
      <circle cx="20" cy="20" r="7" fill="none" stroke={couleur} strokeWidth="1.6" />
      {rayons.map((r) => (
        <line
          key={r.cle}
          x1={r.x1}
          y1={r.y1}
          x2={r.x2}
          y2={r.y2}
          stroke={couleur}
          strokeWidth={r.pleine ? 2.6 : 1.6}
          strokeLinecap="round"
        />
      ))}
      <circle cx="20" cy="20" r="2.2" fill={couleur} />
    </svg>
  );
}
