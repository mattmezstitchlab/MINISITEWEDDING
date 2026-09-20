import { useParams } from 'react-router-dom';
import AppGrille from './AppGrille';

/**
 * **UNE ADRESSE, UN MONDE.** Chaque route du site passe par ici : la grille
 * s'ouvre sur l'ensemble qui concerne l'adresse — un produit, un métier, une
 * personne, un article, la collection — et l'on entre dans la case.
 */
export default function GrilleDuneRoute({
  monde,
}: {
  /** Le monde à ouvrir, ou de quoi le déduire du segment de l'adresse. */
  monde: string | ((segments: Record<string, string | undefined>) => string);
}) {
  const segments = useParams();
  return <AppGrille mondeInitial={typeof monde === 'function' ? monde(segments) : monde} />;
}
