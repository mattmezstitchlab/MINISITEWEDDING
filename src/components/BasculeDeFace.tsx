import { FACES, useFace, type Face } from '../lib/faceDuSite';

/**
 * **TROIS MOTS POUR VOIR LE SITE AUTREMENT.** La grille, le verso, le recto.
 * Rien de plus : pas d'onglets, pas de panneau, pas d'explication. Le mot de la
 * face où l'on est reste allumé ; les deux autres sont à un clic.
 */
export default function BasculeDeFace({
  className = '',
  faces = FACES.map((f) => f.id),
}: {
  className?: string;
  faces?: Face[];
}) {
  const { face, changer } = useFace();
  return (
    <span data-bascule="face" data-face={face} className={`flex items-center gap-2 ${className}`}>
      {FACES.filter((f) => faces.includes(f.id)).map((f) => (
        <button
          key={f.id}
          type="button"
          data-face-mot={f.id}
          data-actif={face === f.id ? 'true' : 'false'}
          aria-pressed={face === f.id}
          title={f.note}
          onClick={() => changer(f.id)}
          className={`font-mono text-[10px] uppercase tracking-[0.18em] transition ${
            face === f.id ? 'text-[#7DE2B0]' : 'text-white/45 hover:text-white'
          }`}
        >
          {f.mot}
        </button>
      ))}
    </span>
  );
}
