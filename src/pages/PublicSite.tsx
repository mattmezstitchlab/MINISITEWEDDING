import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { getEditToken, setActiveToken } from '../lib/auth';
import { useSiteData } from '../lib/siteData';
import { isRemote } from '../lib/dataSource';
import PublicSiteView from '../components/PublicSiteView';

export default function PublicSite() {
  const { slug } = useParams();
  // Si ce navigateur détient la clé du site (aperçu depuis l’éditeur, ou second
  // membre du couple), elle est activée **pendant le rendu**, donc avant le
  // chargement : c’est elle qui autorise la lecture d’un brouillon. Un visiteur
  // n’a pas de clé et ne voit que les sites publiés — un brouillon renvoie 404.
  //
  // Aucune remise à zéro au démontage : les effets de l’ancienne page
  // s’exécutent après le rendu de la nouvelle et effaceraient la clé fraîchement
  // posée. Un en-tête périmé est sans effet, l’API compare la clé au site visé.
  const [token] = useState(() => getEditToken({ slug }));
  setActiveToken(token);
  const { data, demo, degraded, loading } = useSiteData({ slug });
  const site = data?.site;

  useEffect(() => {
    if (site) document.title = `${site.partner1} & ${site.partner2} — ${site.wedding_date}`;
    return () => { document.title = 'WEDDING SITE — Votre mariage. Votre histoire. Un seul endroit.'; };
  }, [site]);

  if (loading) {
    return (
      <div className="vp-env flex min-h-screen flex-col">
        <div className="h-[70vh] animate-pulse bg-white/25" />
        <div className="mx-auto w-full max-w-2xl space-y-4 px-6 py-12">
          <div className="mx-auto h-9 w-2/3 animate-pulse rounded-full bg-white/40" />
          <div className="mx-auto h-4 w-1/2 animate-pulse rounded-full bg-white/30" />
          <div className="mx-auto h-4 w-3/4 animate-pulse rounded-full bg-white/30" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="vp-env flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="vp-glass vp-spec flex h-16 w-16 items-center justify-center rounded-[22px]">
          <Heart size={28} strokeWidth={1.6} className="text-[var(--vp-muted)]" />
        </span>
        <h1 className="vp-h2 text-[26px]">Ce site n’existe pas encore.</h1>
        <p className="vp-body mx-auto max-w-sm">Le lien est peut-être incomplet — ou les mariés peaufinent encore leur histoire.</p>
        <Link to="/creer" className="vp-btn vp-press mt-2 !px-7">Créer mon propre site</Link>
      </div>
    );
  }

  return (
    <>
      <PublicSiteView data={data} degraded={degraded} />
      {demo && (
        <div className="vp-glass-dark vp-spec-dark fixed bottom-4 left-1/2 z-[60] -translate-x-1/2 rounded-full px-4 py-2 text-[12px] font-medium text-white">
          Aperçu local — données de démonstration
        </div>
      )}
      {/* Le site vient du navigateur : seul cet appareil le voit tant qu’il
          n’est pas publié dans `public/sites/`. */}
      {!isRemote() && !demo && !degraded && (
        <div className="vp-glass-dark vp-spec-dark fixed bottom-4 left-1/2 z-[60] -translate-x-1/2 rounded-full px-4 py-2 text-center text-[12px] font-medium text-white">
          Aperçu sur cet appareil — publiez depuis l’éditeur pour le partager.
        </div>
      )}
      {/* Une base distante était attendue et ne répond pas : le site est servi
          depuis sa copie `public/sites/<slug>.json`. L’affichage reste complet,
          seules les réponses RSVP sont suspendues. En mode autonome, servir ce
          fichier est le fonctionnement normal — donc aucune bannière. */}
      {isRemote() && degraded && !demo && (
        <div className="vp-glass-dark vp-spec-dark fixed bottom-4 left-1/2 z-[60] -translate-x-1/2 rounded-full px-4 py-2 text-center text-[12px] font-medium text-white">
          Site affiché depuis une copie — les réponses sont suspendues pour l’instant.
        </div>
      )}
    </>
  );
}
