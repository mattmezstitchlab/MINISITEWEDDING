import type { ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import { useFace } from '../lib/faceDuSite';
import AppGrille from './AppGrille';

/**
 * **UNE ADRESSE, TROIS FACES.** Chaque route passe par ici :
 *
 * - **la grille** ouvre le monde qui concerne l'adresse — un produit, un métier,
 *   une personne, un article, la collection — et l'on entre dans la case ;
 * - **le verso** retourne ce même monde : les modules, les sources, les ports,
 *   les liaisons, et la possibilité de poser les cases **bord à bord** ;
 * - **le recto** rend la page d'avant, telle quelle. Rien n'a été détruit.
 */
export default function FaceDuSite({
  /** La page d'avant — celle qu'on retrouve au recto. */
  recto,
  /** Le monde à ouvrir, ou de quoi le déduire du segment de l'adresse. */
  monde,
}: {
  recto?: ReactElement;
  monde: string | ((segments: Record<string, string | undefined>) => string);
}) {
  const segments = useParams();
  const { face } = useFace();
  const id = typeof monde === 'function' ? monde(segments) : monde;
  if (face === 'recto' && recto) return recto;
  return <AppGrille mondeInitial={id} versoInitial={face === 'verso'} />;
}
