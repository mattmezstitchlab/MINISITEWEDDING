import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import type { WeddingSite, SiteSection, ProgrammeEvent, InfoPratique, GalleryPhoto, Faq, RsvpEvent, GiftOption } from '../lib/types';
import { apiGet } from '../lib/api';
import PublicSiteView from '../components/PublicSiteView';
import { DEMO_DATA, DEMO_ENABLED } from '../lib/demo';

export default function PublicSite() {
  const { slug } = useParams();
  const [site, setSite] = useState<WeddingSite | null>(null);
  const [sections, setSections] = useState<SiteSection[]>([]);
  const [programme, setProgramme] = useState<ProgrammeEvent[]>([]);
  const [infos, setInfos] = useState<InfoPratique[]>([]);
  const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [rsvpEvents, setRsvpEvents] = useState<RsvpEvent[]>([]);
  const [gifts, setGifts] = useState<GiftOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    setIsDemo(false);
    apiGet<WeddingSite>(`/api/wedding-sites?slug=${slug}`)
      .then(async (s) => {
        setSite(s);
        const [sec, prog, inf, gal, fq, rev, gf] = await Promise.all([
          apiGet<SiteSection[]>(`/api/site-sections?site_id=${s.id}`),
          apiGet<ProgrammeEvent[]>(`/api/programme?site_id=${s.id}`),
          apiGet<InfoPratique[]>(`/api/infos?site_id=${s.id}`),
          apiGet<GalleryPhoto[]>(`/api/gallery?site_id=${s.id}`),
          apiGet<Faq[]>(`/api/faqs?site_id=${s.id}`),
          apiGet<RsvpEvent[]>(`/api/rsvp-events?site_id=${s.id}`),
          apiGet<GiftOption[]>(`/api/gifts?site_id=${s.id}`),
        ]);
        setSections(sec); setProgramme(prog); setInfos(inf);
        setGallery(gal); setFaqs(fq); setRsvpEvents(rev); setGifts(gf);
      })
      .catch(() => {
        // En local, l’API serverless n’existe pas : on bascule sur le jeu de démo.
        if (DEMO_ENABLED) {
          setSite(DEMO_DATA.site); setSections(DEMO_DATA.sections); setProgramme(DEMO_DATA.programme);
          setInfos(DEMO_DATA.infos); setGallery(DEMO_DATA.gallery); setFaqs(DEMO_DATA.faqs);
          setRsvpEvents(DEMO_DATA.rsvpEvents); setGifts(DEMO_DATA.gifts);
          setIsDemo(true);
        } else {
          setNotFound(true);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

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

  if (notFound || !site) {
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
      <PublicSiteView data={{ site, sections, programme, infos, gallery, faqs, rsvpEvents, gifts }} />
      {isDemo && (
        <div className="vp-glass-dark vp-spec-dark fixed bottom-4 left-1/2 z-[60] -translate-x-1/2 rounded-full px-4 py-2 text-[12px] font-medium text-white">
          Aperçu local — données de démonstration
        </div>
      )}
    </>
  );
}
