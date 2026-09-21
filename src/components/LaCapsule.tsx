import { useState, type FormEvent } from 'react';

/* LA CAPSULE — LE CHAMP DU DÉBUT, ET LE SEUL BOUTON
 *
 * « Faudrait un vrai champ capsule. » Une capsule, c'est un champ **qui tient
 * dans une seule forme** : un libellé minuscule au-dessus, la ligne arrondie où
 * l'on écrit, et un bouton vert en dessous — et rien autour. On écrit, on
 * valide (la touche, ou le bouton), et ça part.
 *
 * C'est la même chose partout : le code du mariage, les prénoms, la ville, ce
 * qu'on prend. Un seul objet, une seule façon de s'en servir.
 */

export interface LaCapsuleProps {
  /** Le libellé minuscule, au-dessus — il ne change jamais de style. */
  libellé: string;
  /** Ce que le champ suggère, en gris, à l'intérieur. */
  indice: string;
  /** Le mot du bouton — « ALLONS-Y » par défaut. */
  bouton?: string;
  valeurInitiale?: string;
  /** Ce qu'on fait de la valeur : elle est rendue telle quelle, au trim près. */
  surEnvoi: (texte: string) => string | void;
  /** Où l'on va après — par exemple la question suivante de l'éditeur. */
  surSuivant?: () => void;
  /** Ce qu'on dit après, sous le bouton (ce que l'agent a compris, un merci…). */
  réponse?: string | null;
}

export default function LaCapsule({
  libellé,
  indice,
  bouton = 'Allons-y',
  valeurInitiale = '',
  surEnvoi,
  surSuivant,
  réponse,
}: LaCapsuleProps) {
  const [valeur, setValeur] = useState(valeurInitiale);
  const [dit, setDit] = useState<string | null>(null);

  const envoyer = (e: FormEvent) => {
    e.preventDefault();
    const texte = valeur.trim();
    if (!texte) return;
    const rendu = surEnvoi(texte);
    setDit(typeof rendu === 'string' ? rendu : null);
    surSuivant?.();
  };

  return (
    <form data-capsule="vrai" onSubmit={envoyer} className="mx-auto w-full max-w-[460px] text-center">
      <p data-capsule-libellé={libellé} className="vp-petit-mot">
        {libellé}
      </p>
      <div className="vp-capsule mt-[0.8em] flex items-center justify-center gap-[0.5em]">
        <input
          data-capsule-champ="vrai"
          value={valeur}
          onChange={(e) => setValeur(e.target.value)}
          placeholder={indice}
          aria-label={`${libellé} — ${indice}`}
          autoComplete="off"
          spellCheck={false}
          className="w-full border-0 bg-transparent text-center text-[1rem] text-[#111] outline-none placeholder:text-[#b8b8b8]"
        />
      </div>
      <button data-capsule-bouton="vrai" type="submit" className="vp-bouton-vert mt-[1.3em]">
        {bouton}
      </button>
      {(dit ?? réponse) && (
        <p data-capsule-réponse={dit ?? réponse ?? ''} className="vp-petit-mot mt-[1em] normal-case tracking-normal text-[#8a8a8a]">
          {dit ?? réponse}
        </p>
      )}
    </form>
  );
}
