import { useCallback, useEffect, useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Eye, EyeOff, GripVertical, Monitor, Smartphone, Palette, Images,
  MailCheck, Share2, Rocket, Plus, Trash2, Check, X, ChevronDown, LayoutList, Loader2, Globe,
} from 'lucide-react';
import type { WeddingSite, SiteSection, ProgrammeEvent, InfoPratique, GalleryPhoto, Faq, RsvpEvent, GiftOption, PublicSiteData } from '../lib/types';
import { apiGet, apiSend } from '../lib/api';
import { DEMO_DATA, DEMO_ENABLED } from '../lib/demo';
import { PHASES, fontsFor } from '../lib/weddingStyles';
import PublicSiteView from '../components/PublicSiteView';
import MediaLibrary from '../components/MediaLibrary';
import AppearancePanel from '../components/AppearancePanel';
import RsvpManager from '../components/RsvpManager';
import SharePanel from '../components/SharePanel';

type Drawer = null | 'appearance' | 'rsvp' | 'share' | 'structure';

const fieldCls = 'vp-field !px-4 !py-2.5 !text-[14px]';
const labelCls = 'vp-label !mb-1.5 !tracking-[0.12em]';

interface Ctx {
  site: WeddingSite;
  programme: ProgrammeEvent[];
  infos: InfoPratique[];
  gallery: GalleryPhoto[];
  faqs: Faq[];
  rsvpEvents: RsvpEvent[];
  gifts: GiftOption[];
  patchSite: (patch: Partial<WeddingSite>) => void;
  refresh: () => void;
  openMedia: (cb: (url: string) => void, title: string) => void;
  notify: (msg: string) => void;
}

function PhotoField({ label, value, onPick, openMedia }: { label: string; value: string; onPick: (url: string) => void; openMedia: Ctx['openMedia'] }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <button onClick={() => openMedia(onPick, label)} className="vp-press group relative aspect-[16/10] w-full overflow-hidden rounded-[12px] border border-black/8 bg-[#F5F5F7]">
        {value ? <img src={value} alt={label} className="h-full w-full object-cover" /> : <span className="text-sm font-medium text-[var(--vp-muted)]">Choisir une photo</span>}
        <span className="absolute inset-0 flex items-center justify-center bg-[#05060C]/0 transition group-hover:bg-[#05060C]/35">
          <span className="rounded-full bg-[var(--vp-accent)] px-4 py-2 text-[13px] font-semibold text-white opacity-0 transition group-hover:opacity-100">Choisir dans la bibliothèque</span>
        </span>
      </button>
    </div>
  );
}

function SectionEditor({ sectionKey, ctx }: { sectionKey: string; ctx: Ctx }) {
  const { site, patchSite, refresh, openMedia, notify } = ctx;
  const [busy, setBusy] = useState(false);
  const heroFonts = fontsFor(site.typography);

  const save = async (fn: () => Promise<unknown>, msg = 'Enregistré') => {
    setBusy(true);
    try { await fn(); refresh(); notify(msg); } catch { notify('Une erreur est survenue'); } finally { setBusy(false); }
  };

  if (sectionKey === 'hero') {
    return (
      <div className="space-y-5">
        <PhotoField label="Photo du Hero" value={site.hero_photo} onPick={(url) => patchSite({ hero_photo: url })} openMedia={openMedia} />
        <div>
          <label className={labelCls}>Titre principal</label>
          <input
            className={fieldCls}
            value={site.hero_title}
            onChange={(e) => patchSite({ hero_title: e.target.value })}
            style={{ fontFamily: heroFonts.heading, fontWeight: heroFonts.weight, fontSize: '1.25rem', letterSpacing: '-0.02em' }}
          />
        </div>
        <div><label className={labelCls}>Sur-titre</label><input className={fieldCls} value={site.hero_subtitle} onChange={(e) => patchSite({ hero_subtitle: e.target.value })} /></div>
        <div><label className={labelCls}>Phrase d’accueil</label><input className={fieldCls} value={site.announcement} onChange={(e) => patchSite({ announcement: e.target.value })} /></div>
        <p className="vp-caption !text-[12px]">La photo occupe tout l’écran, le compte à rebours se calcule seul depuis votre date.</p>
      </div>
    );
  }
  if (sectionKey === 'histoire') {
    return (
      <div className="space-y-5">
        <div><label className={labelCls}>Titre</label><input className={fieldCls} value={site.story_title} onChange={(e) => patchSite({ story_title: e.target.value })} /></div>
        <div><label className={labelCls}>Votre histoire</label><textarea rows={7} className={fieldCls} value={site.story_text} onChange={(e) => patchSite({ story_text: e.target.value })} /></div>
        <PhotoField label="Photo" value={site.story_photo} onPick={(url) => patchSite({ story_photo: url })} openMedia={openMedia} />
      </div>
    );
  }
  if (sectionKey === 'programme') {
    return (
      <div className="space-y-3">
        {ctx.programme.map((p) => (
          <ProgRow key={p.id} p={p} save={save} />
        ))}
        <button disabled={busy} onClick={() => save(() => apiSend('/api/programme', 'POST', { site_id: site.id, event_time: '12:00', title: 'Nouveau moment', description: '', place: '', icon: 'clock', position: ctx.programme.length }), 'Moment ajouté')} className="vp-press flex w-full items-center justify-center gap-2 rounded-[18px] border border-dashed border-black/25 bg-white/35 py-3 text-sm font-medium text-[var(--vp-muted)] backdrop-blur-xl transition hover:border-[var(--vp-accent)] hover:text-[var(--vp-accent)] disabled:opacity-50"><Plus size={16} /> Ajouter un moment</button>
      </div>
    );
  }
  if (sectionKey === 'lieux') {
    return (
      <div className="space-y-5">
        <div><label className={labelCls}>Lieu</label><input className={fieldCls} value={site.venue} onChange={(e) => patchSite({ venue: e.target.value })} /></div>
        <div><label className={labelCls}>Ville</label><input className={fieldCls} value={site.city} onChange={(e) => patchSite({ city: e.target.value })} /></div>
        <p className="vp-caption !text-[12px]">Les boutons « Voir l’itinéraire » ouvrent Google Maps avec ces adresses.</p>
      </div>
    );
  }
  if (sectionKey === 'infos') {
    return (
      <div className="space-y-3">
        {ctx.infos.map((inf) => (
          <InfoRow key={inf.id} inf={inf} save={save} />
        ))}
        <button disabled={busy} onClick={() => save(() => apiSend('/api/infos', 'POST', { site_id: site.id, category: 'Nouveau', title: 'Nouvelle information', detail: '', event_time: '', link_label: '', position: ctx.infos.length }), 'Carte ajoutée')} className="vp-press flex w-full items-center justify-center gap-2 rounded-[18px] border border-dashed border-black/25 bg-white/35 py-3 text-sm font-medium text-[var(--vp-muted)] backdrop-blur-xl transition hover:border-[var(--vp-accent)] hover:text-[var(--vp-accent)] disabled:opacity-50"><Plus size={16} /> Ajouter une carte</button>
      </div>
    );
  }
  if (sectionKey === 'rsvp') {
    return (
      <div className="space-y-3">
        <p className="vp-caption !text-[13px] leading-relaxed">Les invités indiquent présence, convives, régimes, hébergement et message. Choisissez les moments proposés :</p>
        {ctx.rsvpEvents.map((ev) => (
          <RsvpEventRow key={ev.id} ev={ev} save={save} />
        ))}
        <button disabled={busy} onClick={() => save(() => apiSend('/api/rsvp-events', 'POST', { site_id: site.id, name: 'Nouvel événement', description: '', position: ctx.rsvpEvents.length }), 'Événement ajouté')} className="vp-press flex w-full items-center justify-center gap-2 rounded-[18px] border border-dashed border-black/25 bg-white/35 py-3 text-sm font-medium text-[var(--vp-muted)] backdrop-blur-xl transition hover:border-[var(--vp-accent)] hover:text-[var(--vp-accent)] disabled:opacity-50"><Plus size={16} /> Ajouter un événement</button>
      </div>
    );
  }
  if (sectionKey === 'cagnotte') {
    return (
      <div className="space-y-3">
        {ctx.gifts.map((g) => (
          <GiftRow key={g.id} g={g} save={save} />
        ))}
        <button disabled={busy} onClick={() => save(() => apiSend('/api/gifts', 'POST', { site_id: site.id, gift_type: 'Cagnotte', title: 'Nouvelle cagnotte', description: '', goal_amount: 0, current_amount: 0, position: ctx.gifts.length }), 'Cagnotte ajoutée')} className="vp-press flex w-full items-center justify-center gap-2 rounded-[18px] border border-dashed border-black/25 bg-white/35 py-3 text-sm font-medium text-[var(--vp-muted)] backdrop-blur-xl transition hover:border-[var(--vp-accent)] hover:text-[var(--vp-accent)] disabled:opacity-50"><Plus size={16} /> Ajouter une cagnotte</button>
        <p className="vp-caption !text-[12px]">Les moyens de paiement se connecteront ici — l’architecture est prête.</p>
      </div>
    );
  }
  if (sectionKey === 'galerie') {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2.5">
          {ctx.gallery.map((g) => (
            <div key={g.id} className="group relative aspect-square overflow-hidden rounded-[12px] border border-black/8 bg-[#F5F5F7]">
              <img src={g.url} alt={g.caption || ''} className="w-full h-full object-cover" />
              <button onClick={() => save(() => apiSend('/api/gallery', 'DELETE', { id: g.id }), 'Photo supprimée')} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-xl transition group-hover:opacity-100" aria-label="Supprimer"><Trash2 size={14} /></button>
              {g.is_private && <span className="absolute bottom-2 left-2 rounded-full bg-black/45 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-xl">Privée</span>}
            </div>
          ))}
        </div>
        <button onClick={() => openMedia((url) => { save(() => apiSend('/api/gallery', 'POST', { site_id: site.id, url, caption: '', position: ctx.gallery.length, is_private: false }), 'Photo ajoutée'); }, 'Ajouter à la galerie')} className="vp-btn vp-press w-full !py-3.5 !text-[14px]"><Images size={16} /> Choisir des photos</button>
        <p className="vp-caption !text-[12px]">Après le mariage, continuez à publier ici — la galerie devient vos souvenirs.</p>
      </div>
    );
  }
  if (sectionKey === 'faq') {
    return (
      <div className="space-y-3">
        {ctx.faqs.map((f) => (
          <FaqRow key={f.id} f={f} save={save} />
        ))}
        <button disabled={busy} onClick={() => save(() => apiSend('/api/faqs', 'POST', { site_id: site.id, question: 'Nouvelle question ?', answer: 'Votre réponse…', position: ctx.faqs.length }), 'Question ajoutée')} className="vp-press flex w-full items-center justify-center gap-2 rounded-[18px] border border-dashed border-black/25 bg-white/35 py-3 text-sm font-medium text-[var(--vp-muted)] backdrop-blur-xl transition hover:border-[var(--vp-accent)] hover:text-[var(--vp-accent)] disabled:opacity-50"><Plus size={16} /> Ajouter une question</button>
      </div>
    );
  }
  if (sectionKey === 'contact') {
    return (
      <div className="space-y-5">
        <div><label className={labelCls}>Email</label><input className={fieldCls} value={site.contact_email || ''} placeholder="nous@exemple.fr" onChange={(e) => patchSite({ contact_email: e.target.value })} /></div>
        <div><label className={labelCls}>Téléphone</label><input className={fieldCls} value={site.contact_phone || ''} placeholder="06 00 00 00 00" onChange={(e) => patchSite({ contact_phone: e.target.value })} /></div>
      </div>
    );
  }
  return <p className="vp-caption !text-[13px]">Le pied de page reprend vos prénoms, la date et la phase du mariage — rien à régler.</p>;
}

type SaveFn = (fn: () => Promise<unknown>, msg?: string) => Promise<void>;

function ProgRow({ p, save }: { p: ProgrammeEvent; save: SaveFn }) {
  const [time, setTime] = useState(p.event_time);
  const [title, setTitle] = useState(p.title);
  const [desc, setDesc] = useState(p.description || '');
  const [place, setPlace] = useState(p.place || '');
  useEffect(() => { setTime(p.event_time); setTitle(p.title); setDesc(p.description || ''); setPlace(p.place || ''); }, [p.id]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="vp-glass vp-spec space-y-2.5 rounded-[20px] p-4">
      <div className="grid grid-cols-[86px_1fr] gap-2">
        <input className={fieldCls} value={time} onChange={(e) => setTime(e.target.value)} onBlur={() => time !== p.event_time && save(() => apiSend('/api/programme', 'PUT', { id: p.id, event_time: time }), 'Heure mise à jour')} />
        <input className={fieldCls} value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => title !== p.title && save(() => apiSend('/api/programme', 'PUT', { id: p.id, title }), 'Titre mis à jour')} />
      </div>
      <input className={fieldCls} value={desc} placeholder="Description" onChange={(e) => setDesc(e.target.value)} onBlur={() => desc !== (p.description || '') && save(() => apiSend('/api/programme', 'PUT', { id: p.id, description: desc }), 'Description mise à jour')} />
      <div className="flex gap-2">
        <input className={fieldCls} value={place} placeholder="Lieu" onChange={(e) => setPlace(e.target.value)} onBlur={() => place !== (p.place || '') && save(() => apiSend('/api/programme', 'PUT', { id: p.id, place }), 'Lieu mis à jour')} />
        <button onClick={() => save(() => apiSend('/api/programme', 'DELETE', { id: p.id }), 'Moment supprimé')} className="vp-press flex w-10 shrink-0 items-center justify-center rounded-[12px] text-[var(--vp-muted-2)] transition hover:bg-[color-mix(in_srgb,var(--vp-red)_14%,transparent)] hover:text-[var(--vp-red)]" aria-label="Supprimer"><Trash2 size={16} /></button>
      </div>
    </div>
  );
}

function InfoRow({ inf, save }: { inf: InfoPratique; save: SaveFn }) {
  const [cat, setCat] = useState(inf.category);
  const [time, setTime] = useState(inf.event_time || '');
  const [title, setTitle] = useState(inf.title);
  const [detail, setDetail] = useState(inf.detail || '');
  useEffect(() => { setCat(inf.category); setTime(inf.event_time || ''); setTitle(inf.title); setDetail(inf.detail || ''); }, [inf.id]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="vp-glass vp-spec space-y-2.5 rounded-[20px] p-4">
      <div className="grid grid-cols-[1fr_76px] gap-2">
        <input className={fieldCls} value={cat} onChange={(e) => setCat(e.target.value)} onBlur={() => cat !== inf.category && save(() => apiSend('/api/infos', 'PUT', { id: inf.id, category: cat }), 'Catégorie mise à jour')} />
        <input className={fieldCls} value={time} placeholder="Heure" onChange={(e) => setTime(e.target.value)} onBlur={() => time !== (inf.event_time || '') && save(() => apiSend('/api/infos', 'PUT', { id: inf.id, event_time: time }), 'Heure mise à jour')} />
      </div>
      <input className={fieldCls} value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => title !== inf.title && save(() => apiSend('/api/infos', 'PUT', { id: inf.id, title }), 'Titre mis à jour')} />
      <textarea rows={2} className={fieldCls} value={detail} onChange={(e) => setDetail(e.target.value)} onBlur={() => detail !== (inf.detail || '') && save(() => apiSend('/api/infos', 'PUT', { id: inf.id, detail }), 'Détail mis à jour')} />
      <button onClick={() => save(() => apiSend('/api/infos', 'DELETE', { id: inf.id }), 'Carte supprimée')} className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--vp-muted)] transition hover:text-[var(--vp-red)]"><Trash2 size={13} /> Supprimer cette carte</button>
    </div>
  );
}

function RsvpEventRow({ ev, save }: { ev: RsvpEvent; save: SaveFn }) {
  const [name, setName] = useState(ev.name);
  useEffect(() => { setName(ev.name); }, [ev.id]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="flex gap-2">
      <input className={fieldCls} value={name} onChange={(e) => setName(e.target.value)} onBlur={() => name !== ev.name && save(() => apiSend('/api/rsvp-events', 'PUT', { id: ev.id, name }), 'Événement mis à jour')} />
      <button onClick={() => save(() => apiSend('/api/rsvp-events', 'DELETE', { id: ev.id }), 'Événement supprimé')} className="vp-press flex w-10 shrink-0 items-center justify-center rounded-[12px] text-[var(--vp-muted-2)] transition hover:bg-[color-mix(in_srgb,var(--vp-red)_14%,transparent)] hover:text-[var(--vp-red)]" aria-label="Supprimer"><Trash2 size={16} /></button>
    </div>
  );
}

function GiftRow({ g, save }: { g: GiftOption; save: SaveFn }) {
  const [type, setType] = useState(g.gift_type);
  const [title, setTitle] = useState(g.title);
  const [desc, setDesc] = useState(g.description || '');
  const [goal, setGoal] = useState(String(Number(g.goal_amount) || 0));
  const [current, setCurrent] = useState(String(Number(g.current_amount) || 0));
  useEffect(() => { setType(g.gift_type); setTitle(g.title); setDesc(g.description || ''); setGoal(String(Number(g.goal_amount) || 0)); setCurrent(String(Number(g.current_amount) || 0)); }, [g.id]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="vp-glass vp-spec space-y-2.5 rounded-[20px] p-4">
      <input className={fieldCls} value={type} onChange={(e) => setType(e.target.value)} onBlur={() => type !== g.gift_type && save(() => apiSend('/api/gifts', 'PUT', { id: g.id, gift_type: type }), 'Type mis à jour')} />
      <input className={fieldCls} value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => title !== g.title && save(() => apiSend('/api/gifts', 'PUT', { id: g.id, title }), 'Titre mis à jour')} />
      <textarea rows={2} className={fieldCls} value={desc} onChange={(e) => setDesc(e.target.value)} onBlur={() => desc !== (g.description || '') && save(() => apiSend('/api/gifts', 'PUT', { id: g.id, description: desc }), 'Description mise à jour')} />
      <div className="grid grid-cols-2 gap-2">
        <div><label className={labelCls}>Objectif (€)</label><input type="number" className={fieldCls} value={goal} onChange={(e) => setGoal(e.target.value)} onBlur={() => save(() => apiSend('/api/gifts', 'PUT', { id: g.id, goal_amount: Number(goal) || 0 }), 'Objectif mis à jour')} /></div>
        <div><label className={labelCls}>Collecté (€)</label><input type="number" className={fieldCls} value={current} onChange={(e) => setCurrent(e.target.value)} onBlur={() => save(() => apiSend('/api/gifts', 'PUT', { id: g.id, current_amount: Number(current) || 0 }), 'Montant mis à jour')} /></div>
      </div>
      <button onClick={() => save(() => apiSend('/api/gifts', 'DELETE', { id: g.id }), 'Cagnotte supprimée')} className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--vp-muted)] transition hover:text-[var(--vp-red)]"><Trash2 size={13} /> Supprimer</button>
    </div>
  );
}

function FaqRow({ f, save }: { f: Faq; save: SaveFn }) {
  const [q, setQ] = useState(f.question);
  const [a, setA] = useState(f.answer);
  useEffect(() => { setQ(f.question); setA(f.answer); }, [f.id]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="vp-glass vp-spec space-y-2.5 rounded-[20px] p-4">
      <input className={fieldCls} value={q} onChange={(e) => setQ(e.target.value)} onBlur={() => q !== f.question && save(() => apiSend('/api/faqs', 'PUT', { id: f.id, question: q }), 'Question mise à jour')} />
      <textarea rows={2} className={fieldCls} value={a} onChange={(e) => setA(e.target.value)} onBlur={() => a !== f.answer && save(() => apiSend('/api/faqs', 'PUT', { id: f.id, answer: a }), 'Réponse mise à jour')} />
      <button onClick={() => save(() => apiSend('/api/faqs', 'DELETE', { id: f.id }), 'Question supprimée')} className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--vp-muted)] transition hover:text-[var(--vp-red)]"><Trash2 size={13} /> Supprimer</button>
    </div>
  );
}

export default function Editor() {
  const { id } = useParams();
  const [site, setSite] = useState<WeddingSite | null>(null);
  const [sections, setSections] = useState<SiteSection[]>([]);
  const [programme, setProgramme] = useState<ProgrammeEvent[]>([]);
  const [infos, setInfos] = useState<InfoPratique[]>([]);
  const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [rsvpEvents, setRsvpEvents] = useState<RsvpEvent[]>([]);
  const [gifts, setGifts] = useState<GiftOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedKey, setSelectedKey] = useState<string>('hero');
  const [drawer, setDrawer] = useState<Drawer>(null);
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [toast, setToast] = useState('');
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaTitle, setMediaTitle] = useState('Bibliothèque média');
  const [rsvpTick, setRsvpTick] = useState(0);
  const mediaCb = useRef<((url: string) => void) | null>(null);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  }, []);

  const fetchAll = useCallback(async () => {
    if (!id) return;
    try {
      const [s, sec, prog, inf, gal, fq, rev, gf] = await Promise.all([
        apiGet<WeddingSite>(`/api/wedding-sites?id=${id}`),
        apiGet<SiteSection[]>(`/api/site-sections?site_id=${id}`),
        apiGet<ProgrammeEvent[]>(`/api/programme?site_id=${id}`),
        apiGet<InfoPratique[]>(`/api/infos?site_id=${id}`),
        apiGet<GalleryPhoto[]>(`/api/gallery?site_id=${id}`),
        apiGet<Faq[]>(`/api/faqs?site_id=${id}`),
        apiGet<RsvpEvent[]>(`/api/rsvp-events?site_id=${id}`),
        apiGet<GiftOption[]>(`/api/gifts?site_id=${id}`),
      ]);
      setSite(s); setSections(sec); setProgramme(prog); setInfos(inf);
      setGallery(gal); setFaqs(fq); setRsvpEvents(rev); setGifts(gf);
    } catch (err) {
      // En local, l’API serverless n’existe pas : on édite le jeu de démo.
      if (DEMO_ENABLED) {
        setSite(DEMO_DATA.site); setSections(DEMO_DATA.sections); setProgramme(DEMO_DATA.programme);
        setInfos(DEMO_DATA.infos); setGallery(DEMO_DATA.gallery); setFaqs(DEMO_DATA.faqs);
        setRsvpEvents(DEMO_DATA.rsvpEvents); setGifts(DEMO_DATA.gifts);
      } else {
        setError(err instanceof Error ? err.message : 'Chargement impossible');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const patchSite = async (patch: Partial<WeddingSite>) => {
    if (!site) return;
    setSite({ ...site, ...patch });
    try {
      await apiSend('/api/wedding-sites', 'PUT', { id: site.id, ...patch });
    } catch { notify('Sauvegarde impossible'); }
  };

  const toggleVisible = async (sec: SiteSection) => {
    setSections((prev) => prev.map((s) => (s.id === sec.id ? { ...s, visible: !s.visible } : s)));
    await apiSend('/api/site-sections', 'PUT', { id: sec.id, visible: !sec.visible });
    notify(sec.visible ? 'Section masquée' : 'Section affichée');
  };

  const onDropSection = async (e: DragEvent<HTMLDivElement>, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) { setDragIdx(null); return; }
    const next = [...sections];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(idx, 0, moved);
    const reordered = next.map((s, i) => ({ ...s, position: i }));
    setSections(reordered);
    setDragIdx(null);
    for (const s of reordered) { await apiSend('/api/site-sections', 'PUT', { id: s.id, position: s.position }); }
    notify('Ordre mis à jour');
  };

  const openMedia = useCallback((cb: (url: string) => void, title: string) => {
    mediaCb.current = cb;
    setMediaTitle(title);
    setMediaOpen(true);
  }, []);

  const publish = async () => {
    if (!site) return;
    await patchSite({ published: true });
    setDrawer('share');
    notify('Votre site est publié');
  };

  if (loading) {
    return (
      <div className="vp-env flex min-h-screen flex-col items-center justify-center gap-5">
        <div className="vp-glass vp-spec flex h-16 w-16 items-center justify-center rounded-[22px]">
          <Loader2 size={26} className="animate-spin text-[var(--vp-accent)]" />
        </div>
        <p className="vp-h2 text-[20px]">Ouverture de votre éditeur…</p>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="vp-env flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="vp-h2 text-[22px]">Ce site est introuvable.</p>
        <p className="vp-caption">{error}</p>
        <Link to="/creer" className="vp-btn vp-press !px-6">Créer un site</Link>
      </div>
    );
  }

  const data: PublicSiteData = { site, sections, programme, infos, gallery, faqs, rsvpEvents, gifts };
  const ctx: Ctx = { site, programme, infos, gallery, faqs, rsvpEvents, gifts, patchSite, refresh: fetchAll, openMedia, notify };
  const selectedSection = sections.find((s) => s.section_key === selectedKey);

  const structureList = (
    <div className="space-y-1.5">
      {sections.map((s, idx) => (
        <div
          key={s.id} draggable
          onDragStart={(e) => { setDragIdx(idx); e.dataTransfer.effectAllowed = 'move'; }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDropSection(e, idx)}
          onClick={() => { setSelectedKey(s.section_key); setDrawer(null); }}
          className={`vp-press group flex cursor-pointer items-center gap-2.5 rounded-[16px] border px-3 py-2.5 transition-all duration-300 ${selectedKey === s.section_key ? 'border-transparent bg-[var(--vp-ink)] text-white' : 'border-white/60 bg-white/55 hover:border-white/90 hover:bg-white/80 backdrop-blur-xl'} ${dragIdx === idx ? 'opacity-40' : ''} ${!s.visible ? 'opacity-60' : ''}`}
        >
          <GripVertical size={15} className="shrink-0 opacity-40 cursor-grab" />
          <span className="flex-1 text-[13px] font-medium truncate">{s.title}</span>
          <button onClick={(e) => { e.stopPropagation(); toggleVisible(s); }} className="flex h-7 w-7 items-center justify-center rounded-[10px] opacity-50 transition hover:bg-black/5 hover:opacity-100" aria-label={s.visible ? 'Masquer' : 'Afficher'}>
            {s.visible ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="vp-env flex h-screen flex-col overflow-hidden">
      <header className="vp-veil-light relative z-30 flex h-[64px] shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-5">
        <Link to="/" className="vp-press flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-black/5" aria-label="Retour"><ArrowLeft size={18} /></Link>
        <div className="hidden min-w-0 sm:block">
          <div className="vp-title truncate text-[16px]">{site.partner1} & {site.partner2}</div>
          <div className="vp-num vp-caption truncate !text-[11px]">{site.slug}.byaime.fr {site.published && '· Publié'}</div>
        </div>
        <div className="flex-1" />
        <div className="vp-segmented hidden md:inline-flex">
          <button onClick={() => setDevice('desktop')} className="vp-seg-item" data-on={device === 'desktop'}><Monitor size={14} /> Desktop</button>
          <button onClick={() => setDevice('mobile')} className="vp-seg-item" data-on={device === 'mobile'}><Smartphone size={14} /> Mobile</button>
        </div>
        <button onClick={() => setDrawer('structure')} className="vp-chip vp-press lg:hidden"><LayoutList size={15} /> Sections</button>
        <div className="hidden items-center gap-1.5 sm:flex">
          <button onClick={() => setDrawer(drawer === 'appearance' ? null : 'appearance')} className={`vp-chip vp-press ${drawer === 'appearance' ? '!bg-[var(--vp-ink)] !text-white' : ''}`}><Palette size={15} /> <span className="hidden xl:inline">Apparence</span></button>
          <button onClick={() => openMedia(() => { fetchAll(); }, 'Bibliothèque média')} className="vp-chip vp-press"><Images size={15} /> <span className="hidden xl:inline">Médias</span></button>
          <button onClick={() => { setDrawer(drawer === 'rsvp' ? null : 'rsvp'); setRsvpTick((t) => t + 1); }} className={`vp-chip vp-press ${drawer === 'rsvp' ? '!bg-[var(--vp-ink)] !text-white' : ''}`}><MailCheck size={15} /> <span className="hidden xl:inline">RSVP</span></button>
          <button onClick={() => setDrawer(drawer === 'share' ? null : 'share')} className={`vp-chip vp-press ${drawer === 'share' ? '!bg-[var(--vp-ink)] !text-white' : ''}`}><Share2 size={15} /> <span className="hidden xl:inline">Partager</span></button>
        </div>
        {site.published ? (
          <Link to={`/p/${site.slug}`} target="_blank" className="vp-btn vp-press !px-4 !py-2 !text-[13px]"><Globe size={15} /> Voir</Link>
        ) : (
          <button onClick={publish} className="vp-btn vp-press !px-4 !py-2 !text-[13px]"><Rocket size={15} /> Publier</button>
        )}
      </header>

      <div className="flex-1 flex min-h-0">
        <aside className="vp-veil-light hidden w-[264px] shrink-0 flex-col overflow-y-auto border-r-0 p-4 lg:flex">
          <div className="vp-eyebrow mb-2.5 px-2">Structure du site</div>
          {structureList}
          <div className="mt-6 px-1">
            <div className="vp-eyebrow mb-2.5">Phase du mariage</div>
            <div className="vp-segmented grid w-full grid-cols-3">
              {PHASES.map((p) => (
                <button key={p.id} onClick={() => { patchSite({ phase: p.id }); notify(`Phase : ${p.name}`); }} className="vp-seg-item justify-center !px-1 !py-2" data-on={site.phase === p.id}>{p.name}</button>
              ))}
            </div>
            <p className="vp-caption mt-2.5 !text-[11.5px] leading-relaxed">{PHASES.find((p) => p.id === site.phase)?.desc}</p>
          </div>
        </aside>

        <main className="flex-1 min-w-0 overflow-y-auto" onClick={() => setDrawer(null)}>
          <div className={`mx-auto py-5 px-3 sm:px-6 transition-all duration-500 ${device === 'mobile' ? 'max-w-[400px]' : 'max-w-5xl'}`}>
            <div className={`vp-glass-float overflow-hidden transition-all duration-500 ${device === 'mobile' ? 'rounded-[38px] p-2' : 'rounded-[26px]'}`}>
              {device === 'mobile' && <div className="flex justify-center pb-2 pt-1"><div className="h-5 w-24 rounded-full bg-black/70" /></div>}
              <div className="overflow-hidden" style={{ borderRadius: device === 'mobile' ? 30 : 20 }}>
                <PublicSiteView data={data} preview selectedKey={selectedKey} onSelectSection={(k) => setSelectedKey(k)} />
              </div>
            </div>
            <p className="vp-caption mt-4 text-center !text-[12px]">Cliquez sur une section du site pour la modifier — aperçu {device === 'mobile' ? 'mobile' : 'desktop'} en temps réel.</p>
          </div>
        </main>

        <aside className="vp-veil-light hidden w-[320px] shrink-0 flex-col border-l-0 lg:flex">
          <div className="shrink-0 px-5 pb-3 pt-5">
            <div className="vp-eyebrow">Sélection</div>
            <div className="vp-h2 mt-1 flex items-center gap-2 text-[20px]">
              {selectedSection?.title || 'Section'}
              {selectedSection && !selectedSection.visible && <span className="rounded-full bg-black/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--vp-muted)]">Masquée</span>}
            </div>
            <div className="vp-hr mt-3.5" />
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            <SectionEditor sectionKey={selectedKey} ctx={ctx} />
          </div>
        </aside>
      </div>

      <div className="vp-veil-light z-30 flex shrink-0 items-center justify-around px-3 py-2 lg:hidden">
        <button onClick={() => setDevice(device === 'mobile' ? 'desktop' : 'mobile')} className="vp-press flex flex-col items-center gap-0.5 p-1.5 text-[10px] font-medium text-[var(--vp-muted)]">{device === 'mobile' ? <Monitor size={19} /> : <Smartphone size={19} />} Aperçu</button>
        <button onClick={() => setDrawer('appearance')} className="vp-press flex flex-col items-center gap-0.5 p-1.5 text-[10px] font-medium text-[var(--vp-muted)]"><Palette size={19} /> Style</button>
        <button onClick={() => openMedia(() => { fetchAll(); }, 'Bibliothèque média')} className="vp-press flex flex-col items-center gap-0.5 p-1.5 text-[10px] font-medium text-[var(--vp-muted)]"><Images size={19} /> Photos</button>
        <button onClick={() => { setDrawer('rsvp'); setRsvpTick((t) => t + 1); }} className="vp-press flex flex-col items-center gap-0.5 p-1.5 text-[10px] font-medium text-[var(--vp-muted)]"><MailCheck size={19} /> RSVP</button>
        <button onClick={() => setDrawer('share')} className="vp-press flex flex-col items-center gap-0.5 p-1.5 text-[10px] font-medium text-[var(--vp-muted)]"><Share2 size={19} /> Partage</button>
      </div>

      <AnimatePresence>
        {drawer && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(null)} className="fixed inset-0 z-40 bg-[#05060C]/25 backdrop-blur-[6px]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="vp-env fixed bottom-0 right-0 top-0 z-50 flex w-full flex-col sm:w-[430px]">
              <div className="vp-veil-light flex h-[68px] shrink-0 items-center justify-between px-6">
                <div className="vp-eyebrow !tracking-[0.18em] !text-[var(--vp-ink)]">
                  {drawer === 'appearance' && 'Apparence de votre mariage'}
                  {drawer === 'rsvp' && 'RSVP'}
                  {drawer === 'share' && 'Publication & partage'}
                  {drawer === 'structure' && 'Structure du site'}
                </div>
                <button onClick={() => setDrawer(null)} className="vp-press flex h-9 w-9 items-center justify-center rounded-full bg-black/5 transition hover:bg-black/10" aria-label="Fermer"><X size={17} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {drawer === 'appearance' && <AppearancePanel site={site} onPatch={patchSite} />}
                {drawer === 'rsvp' && <RsvpManager siteId={site.id} events={rsvpEvents} refreshKey={rsvpTick} />}
                {drawer === 'share' && <SharePanel site={site} onPublishedChange={(v) => { patchSite({ published: v }); notify(v ? 'Site publié' : 'Site en brouillon'); }} />}
                {drawer === 'structure' && (
                  <div>
                    {structureList}
                    <div className="mt-6">
                      <div className="vp-eyebrow mb-3">Modifier : {selectedSection?.title}</div>
                      <SectionEditor sectionKey={selectedKey} ctx={ctx} />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="lg:hidden">
        <button onClick={() => setDrawer('structure')} className="vp-btn vp-press fixed bottom-[76px] right-4 z-30 !px-4 !py-3 !text-[13px]">
          Modifier : {selectedSection?.title || 'section'} <ChevronDown size={15} className="rotate-[-90deg]" />
        </button>
      </div>

      <MediaLibrary open={mediaOpen} onClose={() => setMediaOpen(false)} title={mediaTitle} onSelect={(url) => { setMediaOpen(false); mediaCb.current?.(url); notify('Photo insérée'); }} />

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="vp-glass-dark vp-spec-dark fixed bottom-24 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white lg:bottom-8">
            <Check size={16} className="text-[var(--vp-green)]" strokeWidth={2.5} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
