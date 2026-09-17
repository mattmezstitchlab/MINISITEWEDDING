import { useEffect, useState } from 'react';

/**
 * `prefers-reduced-motion` en hook.
 *
 * Les enchaînements automatiques (hero, aperçus dans le téléphone) doivent
 * s’arrêter quand l’utilisateur demande des animations réduites : on laisse
 * alors la main — flèches et vignettes — sans défilement imposé.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
}

/** Vrai tant que l’onglet est en arrière-plan : inutile de faire défiler. */
export function useTabVisible(): boolean {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  return visible;
}
