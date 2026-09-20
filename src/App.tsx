import { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import SiteChrome from './components/SiteChrome';

/**
 * Chaque page est chargée avec gestion propre des routes.
 */
import FaceDuSite from './components/FaceDuSite';
import LaCaisse from './pages/LaCaisse';
import SuperRipple from './pages/SuperRipple';
import Aime from './pages/Aime';
import Invitation from './pages/Invitation';
import Landing from './pages/Landing';
import LeMariage from './pages/LeMariage';
import MagazineArticle from './pages/MagazineArticle';
import PageMetier from './pages/PageMetier';
import PageProfil from './pages/PageProfil';
import Shop from './pages/Shop';
import SuperMariage from './pages/SuperMariage';
import ShopProduct from './pages/ShopProduct';
import Theater from './pages/Theater';
import VendorStudio from './pages/VendorStudio';
import WeddingPeople from './pages/WeddingPeople';
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
            {/* ON ARRIVE SUR LE TICKET. Le produit est le spécialiste du ticket de
                caisse, et la page ne défile plus : **la machine, seule, sur un
                fond blanc**. Tout ce qui se coche arrive par son écran — une
                famille, ou une demande écrite dans le champ — et l'on valide ou
                l'on passe. Le papier sort de la fente et part dans les
                portefeuilles. `?face=verso` montre le moteur, `?face=recto` rend
                l'ancienne page d'accueil. */}
            <Route path="/" element={<FaceDuSite grille={<LaCaisse />} recto={<Landing />} monde="magasin" />} />
            <Route path="/ticket" element={<FaceDuSite grille={<LaCaisse />} monde="magasin" />} />
            {/* Tout le site parle le langage de la grille : une adresse, un monde. */}
            <Route path="/theater" element={<FaceDuSite recto={<Theater />} monde="monde" />} />
            {/* La timeline est fusionnée avec le magazine : la languette du dock
                la déploie ; l'ancienne page renvoie vers elle, ouverte. */}
            <Route path="/timeline" element={<Navigate to="/magazine?timeline=1" replace />} />
            {/* Event OS retiré du produit : ses anciennes adresses ramènent à l'accueil. */}
            <Route path="/modules" element={<Navigate to="/" replace />} />
            <Route path="/features" element={<Navigate to="/" replace />} />
            <Route path="/shop" element={<FaceDuSite recto={<Shop />} monde="boutique" />} />
            <Route
              path="/shop/:slug"
              element={<FaceDuSite recto={<ShopProduct />} monde={(p) => `produit-${p.slug}`} />}
            />
            <Route path="/magazine" element={<Magazine />} />
            <Route
              path="/magazine/:slug"
              element={<FaceDuSite recto={<MagazineArticle />} monde={(p) => `article-${p.slug}`} />}
            />
            <Route path="/aime" element={<FaceDuSite recto={<Aime />} monde="magazines" />} />
            <Route path="/taxonomie" element={<FaceDuSite recto={<Aime />} monde="magazines" />} />
            <Route path="/creer" element={<Navigate to="/ripple" replace />} />
            <Route path="/carte" element={<Navigate to="/ripple" replace />} />
            {/* L'espace du prestataire : le même éditeur, dans la langue du métier. */}
            <Route path="/prestataire" element={<FaceDuSite recto={<VendorStudio />} monde="metiers" />} />
            <Route path="/parametres" element={<EditeurMiniSite />} />
            <Route path="/ripple" element={<SuperRipple />} />
            {/* SUPER RIPPLE a remplacé SUPER FOOTER : l'ancienne adresse suit. */}
            <Route path="/footer" element={<Navigate to="/ripple" replace />} />
            {/* Une seule page SUPER SHOP : le shop, son ticket, ses coches. */}
            {/* LA CAISSE : le magasin en cases, et le ticket qui s'imprime tout seul. */}
            <Route
              path="/caisse"
              element={<FaceDuSite grille={<LaCaisse />} recto={<SuperMariage />} monde="magasin" />}
            />
            <Route path="/supermarriage" element={<Navigate to="/caisse" replace />} />
            {/* Le mariage, en entier : l'article, la playlist, le récap — une page par univers. */}
            <Route path="/le-mariage" element={<FaceDuSite recto={<LeMariage />} monde="monde" />} />
            <Route path="/le-mariage/:styleId" element={<FaceDuSite recto={<LeMariage />} monde="monde" />} />
            {/* La page entière d'un métier : sa mission, ses moments, son ticket. */}
            <Route path="/metiers" element={<FaceDuSite recto={<PageMetier />} monde="metiers" />} />
            <Route
              path="/metiers/:slug"
              element={<FaceDuSite recto={<PageMetier />} monde={(p) => `metier-${p.slug}`} />}
            />
            {/* La page d'une personne : la carte faite avec le formulaire, en
                entier — sa couverture, son timbre, son univers, ses mariages. */}
            <Route
              path="/profil/:slug"
              element={<FaceDuSite recto={<PageProfil />} monde={(p) => `personne-${p.slug}`} />}
            />
            <Route
              path="/mariage/:slug"
              element={<FaceDuSite recto={<WeddingPeople />} monde={(p) => `personne-${p.slug}`} />}
            />
            <Route
              path="/rejoindre/:slug"
              element={<FaceDuSite recto={<Invitation />} monde="mini-site" />}
            />
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
