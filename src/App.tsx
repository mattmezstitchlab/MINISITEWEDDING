import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

/**
 * Chaque page est chargée à la demande : un invité qui ouvre un site de mariage
 * ne télécharge ni l’éditeur, ni l’onboarding (le bundle faisait 590 kB en un
 * seul morceau).
 */
const Landing = lazy(() => import('./pages/Landing'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Generating = lazy(() => import('./pages/Generating'));
const Editor = lazy(() => import('./pages/Editor'));
const PublicSite = lazy(() => import('./pages/PublicSite'));

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
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/creer" element={<Onboarding />} />
          <Route path="/generer" element={<Generating />} />
          <Route path="/editeur/:id" element={<Editor />} />
          <Route path="/p/:slug" element={<PublicSite />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
