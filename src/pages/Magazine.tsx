import AppGrille from '../components/AppGrille';

/**
 * LE MAGAZINE — L'ANNÉE, ET TOUT CE QUI S'Y RATTACHE
 *
 * La page ne fait plus rien : elle dit à l'application grille par où commencer.
 * Sans adresse, on arrive devant les trois cent soixante-cinq jours ; `?jour=`,
 * `?monde=`, `?niveau=`, `?cases=` et `?feuille=` ouvrent exactement ce qu'ils
 * annoncent.
 */
export default function Magazine() {
  return <AppGrille mondeInitial="annee" />;
}
