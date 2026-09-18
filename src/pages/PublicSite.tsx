import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { getEditToken, setActiveToken } from '../lib/auth';
import { useSiteData } from '../lib/siteData';
import PublicSiteView from '../components/PublicSiteView';
import UniversalMiniSiteToolbar from '../components/UniversalMiniSiteToolbar';

export default function PublicSite() {
  const { slug } = useParams();
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
      
      {/* Barre d'outils interactive contextuelle sur le mini-site du couple */}
      <UniversalMiniSiteToolbar />

      {demo && (
        <div className="vp-glass-dark vp-spec-dark fixed bottom-20 left-1/2 z-[60] -translate-x-1/2 rounded-full px-4 py-1.5 text-[11px] font-medium text-white shadow-lg">
          Aperçu local — données de démonstration
        </div>
      )}
    </>
  );
}
