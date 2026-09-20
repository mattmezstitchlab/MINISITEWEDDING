/**
 * L'OUVERTURE DU SITE — CE QU'ON RETIENT
 *
 * Le générique se joue une fois par visite, pas une fois par page : c'est un
 * repère de session, et il vit ici pour que le composant ne soit qu'un
 * composant.
 */

const CLE = 'supermariage:ouverture';

/** Le générique a-t-il déjà été vu dans cette visite ? */
export function ouvertureDejaVue(): boolean {
  try {
    if (typeof sessionStorage === 'undefined') return true;
    return sessionStorage.getItem(CLE) === 'vue';
  } catch {
    return true;
  }
}

/** On s'en souvient pour le reste de la visite. */
export function marquerOuvertureVue(): void {
  try {
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(CLE, 'vue');
  } catch {
    /* sans stockage, le générique se rejoue : ce n'est pas grave */
  }
}

/** Le temps du générique, et celui, plus court, sans animations. */
export const DUREE_OUVERTURE = 3000;
export const DUREE_OUVERTURE_SANS_MOUVEMENT = 1100;
