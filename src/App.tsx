import { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import SiteChrome from './components/SiteChrome';

/**
 * Chaque page est chargée avec gestion propre des routes.
 */
import FaceDuSite from './components/FaceDuSite';
import LaCaisse from './pages/LaCaisse';
/* La page d'avant reste au recto : `/?face=recto` — c'est tout ce qu'on garde
   des autres pages, avec l'historique git. */
import Landing from './pages/Landing';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PageFallback() {
  return <div className="vp-env min-h-screen animate-pulse" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ErrorBoundary>
        <SiteChrome>
        <Suspense fallback={<PageFallback />}>
          {/* **UNE SEULE PAGE.** Le site n'a plus qu'une adresse : la page
              d'accueil. Tout ce qui était ailleurs (le magazine, le shop, les
              métiers, le mariage, le ripple, l'atelier, les éditeurs) n'est plus
              monté — les fichiers sont restés dans `src/pages/`, et leurs
              adresses ramènent ici. Les trois faces restent celles de la page
              d'accueil : `?face=verso` retourne le moteur, `?face=recto` rend la
              page d'avant. */}
          <Routes>
            <Route path="/" element={<FaceDuSite grille={<LaCaisse />} recto={<Landing />} monde="magasin" />} />
            <Route path="/ticket" element={<FaceDuSite grille={<LaCaisse />} monde="magasin" />} />
            <Route path="/caisse" element={<FaceDuSite grille={<LaCaisse />} monde="magasin" />} />
            {/* L'ancienne adresse du supermarché, et tout le reste : la page. */}
            <Route path="/supermarriage" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        </SiteChrome>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
