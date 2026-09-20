/* LES FACES DU SITE — LA MÊME ADRESSE, TROIS VERSANTS
 *
 * Le site a maintenant trois faces, et **toutes les pages les ont** :
 *
 * - **la grille** — le contenu en cases, plein écran : la mosaïque du monde ;
 * - **le verso** — le même monde, retourné : les modules, les sources, les
 *   ouvertures, les quatre ports de chaque case, les liaisons qui se dessinent
 *   sous la grille, les réglages du design system. C'est là qu'on déplace une
 *   case pour la poser **bord à bord** — et qu'une liaison se fait ;
 * - **le recto** — la page d'avant, celle qu'on n'a pas détruite : on peut
 *   toujours la revoir, exactement comme elle était.
 *
 * La face vit **dans l'adresse** (`?face=verso`), donc elle se partage, elle
 * survit à la navigation, et elle se quitte d'un mot.
 */

import { useSearchParams } from 'react-router-dom';

export type Face = 'grille' | 'verso' | 'recto';

/** Les trois faces, dans l'ordre où on les propose. */
export const FACES: Array<{ id: Face; mot: string; note: string }> = [
  { id: 'grille', mot: 'la grille', note: 'le monde, en cases' },
  { id: 'verso', mot: 'le verso', note: 'le système : ports, réglages, liaisons' },
  { id: 'recto', mot: 'le recto', note: 'la page d’avant' },
];

/** La face d'une adresse : `?face=verso`, `?face=recto`, sinon la grille. */
export function faceDeLAdresse(valeur: string | null | undefined): Face {
  if (valeur === 'verso' || valeur === 'recto') return valeur;
  return 'grille';
}

/**
 * **La face courante, et de quoi en changer.** Elle s'écrit dans l'adresse :
 * on peut donc l'envoyer à quelqu'un, et elle suit d'une page à l'autre.
 */
export function useFace(): { face: Face; changer: (face: Face) => void } {
  const [params, setParams] = useSearchParams();
  const brut = params.get('face') ?? (params.get('verso') === '1' ? 'verso' : null);
  const face = faceDeLAdresse(brut);
  const changer = (suivante: Face) => {
    const suite = new URLSearchParams(params);
    suite.delete('verso');
    if (suivante === 'grille') suite.delete('face');
    else suite.set('face', suivante);
    setParams(suite, { replace: true });
  };
  return { face, changer };
}
