import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

/**
 * Chaque page est chargée avec gestion propre des routes.
 */
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Generating from './pages/Generating';
import Editor from './pages/Editor';
import PublicSite from './pages/PublicSite';
import Theater from './pages/Theater';
import Magazine from './pages/Magazine';
import MagazineArticle from './pages/MagazineArticle';

const Aime = lazy(() => import('./pages/Aime'));

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
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/theater" element={<Theater />} />
            <Route path="/timeline" element={<Theater />} />
            {/* Event OS retiré du produit : ses anciennes adresses ramènent à l'accueil. */}
            <Route path="/modules" element={<Navigate to="/" replace />} />
            <Route path="/features" element={<Navigate to="/" replace />} />
            <Route path="/magazine" element={<Magazine />} />
            <Route path="/magazine/:slug" element={<MagazineArticle />} />
            <Route path="/aime" element={<Aime />} />
            <Route path="/taxonomie" element={<Aime />} />
            <Route path="/creer" element={<Onboarding />} />
            <Route path="/generer" element={<Generating />} />
            <Route path="/generation" element={<Generating />} />
            <Route path="/editeur/:id" element={<Editor />} />
            <Route path="/p/:slug" element={<PublicSite />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
