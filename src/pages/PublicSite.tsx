import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import type { WeddingSite, SiteSection, ProgrammeEvent, InfoPratique, GalleryPhoto, Faq, RsvpEvent, GiftOption } from '../lib/types';
import { apiGet } from '../lib/api';
import PublicSiteView from '../components/PublicSiteView';

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

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
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
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (site) document.title = `${site.partner1} & ${site.partner2} — ${site.wedding_date}`;
    return () => { document.title = 'WEDDING SITE — Votre mariage. Votre histoire. Un seul endroit.'; };
  }, [site]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
        <div className="h-[70vh] bg-black/5 animate-pulse" />
        <div className="max-w-2xl mx-auto w-full px-6 py-12 space-y-4">
          <div className="h-8 w-2/3 mx-auto bg-black/10 rounded-full animate-pulse" />
          <div className="h-4 w-1/2 mx-auto bg-black/5 rounded-full animate-pulse" />
          <div className="h-4 w-3/4 mx-auto bg-black/5 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  if (notFound || !site) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center gap-4 px-6 text-center" style={{ fontFamily: '"Space Grotesk", "Hanken Grotesk", sans-serif' }}>
        <Heart size={36} strokeWidth={1.25} className="text-neutral-300" />
        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight" style={{ fontFamily: '"Space Grotesk", "Hanken Grotesk", sans-serif' }}>Ce site n’existe pas encore.</h1>
        <p className="text-neutral-500 max-w-sm text-sm sm:text-base">Le lien est peut-être incomplet — ou les mariés peaufinent encore leur histoire.</p>
        <Link to="/creer" className="mt-2 px-7 py-3.5 rounded-full bg-neutral-900 text-white text-sm font-semibold">Créer mon propre site</Link>
      </div>
    );
  }

  return <PublicSiteView data={{ site, sections, programme, infos, gallery, faqs, rsvpEvents, gifts }} />;
}
