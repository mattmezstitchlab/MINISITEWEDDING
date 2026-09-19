import { useParams } from 'react-router-dom';
import PageUnivers from './PageUnivers';
import { WEDDING_STYLES } from '../lib/weddingStyles';

/**
 * LE MARIAGE, EN ENTIER — LA PAGE DE CHAQUE UNIVERS
 *
 * `/le-mariage` ouvre la page du Supermarché 22H, celle qui a montré le chemin.
 * `/le-mariage/<univers>` ouvre exactement la même page pour n'importe lequel
 * des vingt-quatre univers : même article, même programme, même playlist, même
 * récap en ticket — avec son magasin à lui (`lib/weddingPage.ts`).
 */

/** L'univers par défaut : celui qui a inventé la page. */
const UNIVERS_PAR_DEFAUT = 'supermarche';

export default function LeMariage() {
  const { styleId } = useParams<{ styleId?: string }>();
  const connu = WEDDING_STYLES.some((s) => s.id === styleId);
  return <PageUnivers styleId={styleId && connu ? styleId : UNIVERS_PAR_DEFAUT} />;
}
