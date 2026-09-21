import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import LaCaisse from './pages/LaCaisse';

/* UNE ADRESSE, UN OBJET — LE TICKET
 *
 * « Garde que le ticket du haut, c'est suffisant. » L'application a une seule
 * chose à l'écran : **le ticket**. Plus de grille du monde, plus de verso, plus
 * de recto, plus de mini-site, plus de chrome : on arrive sur le papier.
 *
 * Rien n'a été détruit : les autres pages, les autres faces, les bandes
 * éditoriales et les outils sont restés dans `src/` — ils ne sont simplement plus
 * montés. Le jour où l'on veut en revoir un, c'est une ligne, ici.
 */

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<LaCaisse />} />
          <Route path="/ticket" element={<LaCaisse />} />
          <Route path="/caisse" element={<LaCaisse />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
