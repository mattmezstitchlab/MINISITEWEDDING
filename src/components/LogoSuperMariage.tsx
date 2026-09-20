/**
 * LE SOLEIL-CADRAN — LE LOGO DE SUPER MARIAGE
 *
 * C'est le même dessin que la création des couvertures : **un cadran de
 * vingt-quatre heures** — un disque au centre, deux cercles, et vingt-quatre
 * branches qui partent vers le bord, quatre d'entre elles plus marquées aux
 * quatre temps de la journée. Ici il ne raconte pas un jour : il est **la
 * marque**, et il se pose à côté du nom, dans la barre du site, dans le pied,
 * et en tête de la page du magasin.
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
  taille = 20,
  couleur = 'currentColor',
  className = '',
}: LogoSuperMariageProps) {
  /** Vingt-quatre branches, une par heure, posées comme sur la couverture. */
  const branches = Array.from({ length: 24 }, (_, heure) => {
    const angle = (heure / 24) * Math.PI * 2 - Math.PI / 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      cle: heure,
      x1: 20 + cos * 8.6,
      y1: 20 + sin * 8.6,
      x2: 20 + cos * 13.4,
      y2: 20 + sin * 13.4,
      /** Les quatre temps de la journée : midi, dix-huit heures, minuit, six heures. */
      pleine: heure % 6 === 0,
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
      <circle cx="20" cy="20" r="15.4" fill="none" stroke={couleur} strokeWidth="0.8" opacity="0.45" />
      <circle cx="20" cy="20" r="6.4" fill="none" stroke={couleur} strokeWidth="1" opacity="0.9" />
      {branches.map((b) => (
        <line
          key={b.cle}
          x1={b.x1}
          y1={b.y1}
          x2={b.x2}
          y2={b.y2}
          stroke={couleur}
          strokeWidth={b.pleine ? 1.6 : 0.9}
          strokeLinecap="round"
          opacity={b.pleine ? 1 : 0.8}
        />
      ))}
      <circle cx="20" cy="20" r="1.8" fill={couleur} />
    </svg>
  );
}
