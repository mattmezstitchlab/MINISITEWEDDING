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
            {/* Event OS retiré du parcours : /features, /modules, /theater et
                /timeline redirigent vers l'accueil au lieu de mener à des
                studios de démonstration. */}
            <Route path="/modules" element={<Navigate to="/" replace />} />
            <Route path="/features" element={<Navigate to="/" replace />} />
            <Route path="/theater" element={<Navigate to="/" replace />} />
            <Route path="/timeline" element={<Navigate to="/" replace />} />
            {/* AIME reste accessible par URL directe, mais n'est plus lié depuis
                l'accueil : sa place est derrière le moteur, pas devant le couple. */}
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
