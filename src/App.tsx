import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import SiteChrome from './components/SiteChrome';

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
import Shop from './pages/Shop';
import ShopProduct from './pages/ShopProduct';
import PreviewSite from './pages/PreviewSite';
import CardStudio from './pages/CardStudio';
import WeddingPeople from './pages/WeddingPeople';
import Invitation from './pages/Invitation';
import VendorStudio from './pages/VendorStudio';
import SuperMariage from './pages/SuperMariage';
import LeMariage from './pages/LeMariage';
import PageMetier from './pages/PageMetier';
import PageProfil from './pages/PageProfil';
import EditeurMiniSite from './pages/EditeurMiniSite';
import SuperFooter from './pages/SuperFooter';

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
        <SiteChrome>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/theater" element={<Theater />} />
            <Route path="/timeline" element={<Theater />} />
            {/* Event OS retiré du produit : ses anciennes adresses ramènent à l'accueil. */}
            <Route path="/modules" element={<Navigate to="/" replace />} />
            <Route path="/features" element={<Navigate to="/" replace />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:slug" element={<ShopProduct />} />
            <Route path="/magazine" element={<Magazine />} />
            <Route path="/magazine/:slug" element={<MagazineArticle />} />
            <Route path="/aime" element={<Aime />} />
            <Route path="/taxonomie" element={<Aime />} />
            <Route path="/creer" element={<Onboarding />} />
            <Route path="/carte" element={<CardStudio />} />
            {/* L'espace du prestataire : le même éditeur, dans la langue du métier. */}
            <Route path="/prestataire" element={<VendorStudio />} />
            <Route path="/parametres" element={<EditeurMiniSite />} />
            <Route path="/footer" element={<SuperFooter />} />
            {/* SuperMariage : le magasin où l'on coche son mariage, et le ticket suit. */}
            <Route path="/supermarriage" element={<SuperMariage />} />
            {/* Le mariage, en entier : l'article, la playlist, le récap — une page par univers. */}
            <Route path="/le-mariage" element={<LeMariage />} />
            <Route path="/le-mariage/:styleId" element={<LeMariage />} />
            {/* La page entière d'un métier : sa mission, ses moments, son ticket. */}
            <Route path="/metiers/:slug" element={<PageMetier />} />
            {/* La page d'une personne : la carte faite avec le formulaire, en
                entier — sa couverture, son timbre, son univers, ses mariages. */}
            <Route path="/profil/:slug" element={<PageProfil />} />
            <Route path="/mariage/:slug" element={<WeddingPeople />} />
            <Route path="/rejoindre/:slug" element={<Invitation />} />
            <Route path="/generer" element={<Generating />} />
            <Route path="/generation" element={<Generating />} />
            <Route path="/editeur/:id" element={<Editor />} />
            <Route path="/p/:slug" element={<PublicSite />} />
            {/* L'aperçu d'un mini-site : la même page que le site public, montée
                dans une fenêtre à part pour l'accueil et l'éditeur. */}
            <Route path="/apercu" element={<PreviewSite />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        </SiteChrome>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
