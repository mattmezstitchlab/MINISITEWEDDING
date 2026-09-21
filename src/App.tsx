import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import LaCaisse from './pages/LaCaisse';
import LaLanding from './components/LaLanding';

/* DEUX ADRESSES, UN SEUL OBJET — LE TICKET
 *
 * « Un vrai champ capsule, et sur une landing ? Comme la capture, et présentation
 * dans un iPhone en animé, et du coup un ticket au propre bien droit, avec
 * éditeur propre même design que sur l'exemple. »
 *
 * - **`/` — la landing** : la capsule, l'iPhone qui présente le papier, le
 *   ticket au propre, et l'éditeur (huit questions, même design que la
 *   référence) ;
 * - **`/ticket`** (et `/caisse`) — **le papier seul**, avec son champ.
 *
 * Les deux montent le même état (`useLEtatDuTicket`) et le même ticket : c'est un
 * seul objet, montré de deux façons. Plus de grille du monde, plus de verso, plus
 * de mini-site, plus de chrome.
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
          <Route path="/" element={<LaLanding />} />
          <Route path="/ticket" element={<LaCaisse />} />
          <Route path="/caisse" element={<LaCaisse />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
