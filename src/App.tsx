import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Generating from './pages/Generating';
import Editor from './pages/Editor';
import PublicSite from './pages/PublicSite';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/creer" element={<Onboarding />} />
        <Route path="/generer" element={<Generating />} />
        <Route path="/editeur/:id" element={<Editor />} />
        <Route path="/p/:slug" element={<PublicSite />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
