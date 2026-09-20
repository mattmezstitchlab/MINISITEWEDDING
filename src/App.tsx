import { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import SiteChrome from './components/SiteChrome';

/**
 * Chaque page est chargée avec gestion propre des routes.
 */
import GrilleDuneRoute from './components/GrilleDuneRoute';
import SuperRipple from './pages/SuperRipple';
import Editor from './pages/Editor';
import PublicSite from './pages/PublicSite';
import Magazine from './pages/Magazine';
import PreviewSite from './pages/PreviewSite';
import EditeurMiniSite from './pages/EditeurMiniSite';


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
            {/* On n'arrive plus sur une page : on arrive devant tout le contenu. */}
            <Route path="/" element={<GrilleDuneRoute monde="annee" />} />
            {/* Tout le site parle le langage de la grille : une adresse, un monde. */}
            <Route path="/theater" element={<GrilleDuneRoute monde="monde" />} />
            {/* La timeline est fusionnée avec le magazine : la languette du dock
                la déploie ; l'ancienne page renvoie vers elle, ouverte. */}
            <Route path="/timeline" element={<Navigate to="/magazine?timeline=1" replace />} />
            {/* Event OS retiré du produit : ses anciennes adresses ramènent à l'accueil. */}
            <Route path="/modules" element={<Navigate to="/" replace />} />
            <Route path="/features" element={<Navigate to="/" replace />} />
            <Route path="/shop" element={<GrilleDuneRoute monde="boutique" />} />
            <Route path="/shop/:slug" element={<GrilleDuneRoute monde={(p) => `produit-${p.slug}`} />} />
            <Route path="/magazine" element={<Magazine />} />
            <Route path="/magazine/:slug" element={<GrilleDuneRoute monde={(p) => `article-${p.slug}`} />} />
            <Route path="/aime" element={<GrilleDuneRoute monde="magazines" />} />
            <Route path="/taxonomie" element={<GrilleDuneRoute monde="magazines" />} />
            <Route path="/creer" element={<Navigate to="/ripple" replace />} />
            <Route path="/carte" element={<Navigate to="/ripple" replace />} />
            {/* L'espace du prestataire : le même éditeur, dans la langue du métier. */}
            <Route path="/prestataire" element={<GrilleDuneRoute monde="metiers" />} />
            <Route path="/parametres" element={<EditeurMiniSite />} />
            <Route path="/ripple" element={<SuperRipple />} />
            {/* SUPER RIPPLE a remplacé SUPER FOOTER : l'ancienne adresse suit. */}
            <Route path="/footer" element={<Navigate to="/ripple" replace />} />
            {/* Une seule page SUPER SHOP : le shop, son ticket, ses coches. */}
            <Route path="/supermarriage" element={<Navigate to="/shop" replace />} />
            {/* Le mariage, en entier : l'article, la playlist, le récap — une page par univers. */}
            <Route path="/le-mariage" element={<GrilleDuneRoute monde="monde" />} />
            <Route path="/le-mariage/:styleId" element={<GrilleDuneRoute monde="monde" />} />
            {/* La page entière d'un métier : sa mission, ses moments, son ticket. */}
            <Route path="/metiers" element={<GrilleDuneRoute monde="metiers" />} />
            <Route path="/metiers/:slug" element={<GrilleDuneRoute monde={(p) => `metier-${p.slug}`} />} />
            {/* La page d'une personne : la carte faite avec le formulaire, en
                entier — sa couverture, son timbre, son univers, ses mariages. */}
            <Route path="/profil/:slug" element={<GrilleDuneRoute monde={(p) => `personne-${p.slug}`} />} />
            <Route path="/mariage/:slug" element={<GrilleDuneRoute monde={(p) => `personne-${p.slug}`} />} />
            <Route path="/rejoindre/:slug" element={<GrilleDuneRoute monde="mini-site" />} />
            <Route path="/generer" element={<Navigate to="/ripple" replace />} />
            <Route path="/generation" element={<Navigate to="/ripple" replace />} />
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
