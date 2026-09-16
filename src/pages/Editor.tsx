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
import { PHASES } from '../lib/weddingStyles';
import PublicSiteView from '../components/PublicSiteView';
import MediaLibrary from '../components/MediaLibrary';
import AppearancePanel from '../components/AppearancePanel';
import RsvpManager from '../components/RsvpManager';
import SharePanel from '../components/SharePanel';

type Drawer = null | 'appearance' | 'rsvp' | 'share' | 'structure';

const fieldCls = 'w-full px-4 py-2.5 rounded-xl bg-white border border-black/10 text-[14px] outline-none focus:border-black/40 transition';
const labelCls = 'block text-[11px] tracking-[0.18em] uppercase text-neutral-400 font-medium mb-1.5';

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
      <button onClick={() => openMedia(onPick, label)} className="group relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-black/5 border border-black/10">
        {value ? <img src={value} alt={label} className="w-full h-full object-cover" /> : <span className="text-sm text-neutral-400">Choisir une photo</span>}
        <span className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition text-white text-[13px] font-medium px-4 py-2 rounded-full bg-white/20 backdrop-blur">Choisir dans la bibliothèque</span>
        </span>
      </button>
    </div>
  );
}

function SectionEditor({ sectionKey, ctx }: { sectionKey: string; ctx: Ctx }) {
  const { site, patchSite, refresh, openMedia, notify } = ctx;
  const [busy, setBusy] = useState(false);

  const save = async (fn: () => Promise<unknown>, msg = 'Enregistré') => {
    setBusy(true);
    try { await fn(); refresh(); notify(msg); } catch { notify('Une erreur est survenue'); } finally { setBusy(false); }
  };

  if (sectionKey === 'hero') {
    return (
      <div className="space-y-5">
        <PhotoField label="Photo du Hero" value={site.hero_photo} onPick={(url) => patchSite({ hero_photo: url })} openMedia={openMedia} />
        <div><label className={labelCls}>Titre principal</label><input className={fieldCls} value={site.hero_title} onChange={(e) => patchSite({ hero_title: e.target.value })} style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.2rem' }} /></div>
        <div><label className={labelCls}>Sur-titre</label><input className={fieldCls} value={site.hero_subtitle} onChange={(e) => patchSite({ hero_subtitle: e.target.value })} /></div>
        <div><label className={labelCls}>Phrase d’accueil</label><input className={fieldCls} value={site.announcement} onChange={(e) => patchSite({ announcement: e.target.value })} /></div>
        <p className="text-[12px] text-neutral-400">La photo occupe tout l’écran, le compte à rebours se calcule seul depuis votre date.</p>
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
        <button disabled={busy} onClick={() => save(() => apiSend('/api/programme', 'POST', { site_id: site.id, event_time: '12:00', title: 'Nouveau moment', description: '', place: '', icon: 'clock', position: ctx.programme.length }), 'Moment ajouté')} className="w-full py-3 rounded-2xl border border-dashed border-black/20 text-sm text-neutral-500 hover:border-black/50 hover:text-black transition flex items-center justify-center gap-2 disabled:opacity-50"><Plus size={16} /> Ajouter un moment</button>
      </div>
    );
  }
  if (sectionKey === 'lieux') {
    return (
      <div className="space-y-5">
        <div><label className={labelCls}>Lieu</label><input className={fieldCls} value={site.venue} onChange={(e) => patchSite({ venue: e.target.value })} /></div>
        <div><label className={labelCls}>Ville</label><input className={fieldCls} value={site.city} onChange={(e) => patchSite({ city: e.target.value })} /></div>
        <p className="text-[12px] text-neutral-400">Les boutons « Voir l’itinéraire » ouvrent Google Maps avec ces adresses.</p>
      </div>
    );
  }
  if (sectionKey === 'infos') {
    return (
      <div className="space-y-3">
        {ctx.infos.map((inf) => (
          <InfoRow key={inf.id} inf={inf} save={save} />
        ))}
        <button disabled={busy} onClick={() => save(() => apiSend('/api/infos', 'POST', { site_id: site.id, category: 'Nouveau', title: 'Nouvelle information', detail: '', event_time: '', link_label: '', position: ctx.infos.length }), 'Carte ajoutée')} className="w-full py-3 rounded-2xl border border-dashed border-black/20 text-sm text-neutral-500 hover:border-black/50 hover:text-black transition flex items-center justify-center gap-2 disabled:opacity-50"><Plus size={16} /> Ajouter une carte</button>
      </div>
    );
  }
  if (sectionKey === 'rsvp') {
    return (
      <div className="space-y-3">
        <p className="text-[13px] text-neutral-500 leading-relaxed">Les invités indiquent présence, convives, régimes, hébergement et message. Choisissez les moments proposés :</p>
        {ctx.rsvpEvents.map((ev) => (
          <RsvpEventRow key={ev.id} ev={ev} save={save} />
        ))}
        <button disabled={busy} onClick={() => save(() => apiSend('/api/rsvp-events', 'POST', { site_id: site.id, name: 'Nouvel événement', description: '', position: ctx.rsvpEvents.length }), 'Événement ajouté')} className="w-full py-3 rounded-2xl border border-dashed border-black/20 text-sm text-neutral-500 hover:border-black/50 hover:text-black transition flex items-center justify-center gap-2 disabled:opacity-50"><Plus size={16} /> Ajouter un événement</button>
      </div>
    );
  }
  if (sectionKey === 'cagnotte') {
    return (
      <div className="space-y-3">
        {ctx.gifts.map((g) => (
          <GiftRow key={g.id} g={g} save={save} />
        ))}
        <button disabled={busy} onClick={() => save(() => apiSend('/api/gifts', 'POST', { site_id: site.id, gift_type: 'Cagnotte', title: 'Nouvelle cagnotte', description: '', goal_amount: 0, current_amount: 0, position: ctx.gifts.length }), 'Cagnotte ajoutée')} className="w-full py-3 rounded-2xl border border-dashed border-black/20 text-sm text-neutral-500 hover:border-black/50 hover:text-black transition flex items-center justify-center gap-2 disabled:opacity-50"><Plus size={16} /> Ajouter une cagnotte</button>
        <p className="text-[12px] text-neutral-400">Les moyens de paiement se connecteront ici — l’architecture est prête.</p>
      </div>
    );
  }
  if (sectionKey === 'galerie') {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2.5">
          {ctx.gallery.map((g) => (
            <div key={g.id} className="relative group rounded-2xl overflow-hidden aspect-square bg-black/5">
              <img src={g.url} alt={g.caption || ''} className="w-full h-full object-cover" />
              <button onClick={() => save(() => apiSend('/api/gallery', 'DELETE', { id: g.id }), 'Photo supprimée')} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center" aria-label="Supprimer"><Trash2 size={14} /></button>
              {g.is_private && <span className="absolute bottom-2 left-2 text-[10px] px-2 py-1 rounded-full bg-black/60 text-white">Privée</span>}
            </div>
          ))}
        </div>
        <button onClick={() => openMedia((url) => { save(() => apiSend('/api/gallery', 'POST', { site_id: site.id, url, caption: '', position: ctx.gallery.length, is_private: false }), 'Photo ajoutée'); }, 'Ajouter à la galerie')} className="w-full py-3.5 rounded-2xl bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 transition flex items-center justify-center gap-2"><Images size={16} /> Choisir des photos</button>
        <p className="text-[12px] text-neutral-400">Après le mariage, continuez à publier ici — la galerie devient vos souvenirs.</p>
      </div>
    );
  }
  if (sectionKey === 'faq') {
    return (
      <div className="space-y-3">
        {ctx.faqs.map((f) => (
          <FaqRow key={f.id} f={f} save={save} />
        ))}
        <button disabled={busy} onClick={() => save(() => apiSend('/api/faqs', 'POST', { site_id: site.id, question: 'Nouvelle question ?', answer: 'Votre réponse…', position: ctx.faqs.length }), 'Question ajoutée')} className="w-full py-3 rounded-2xl border border-dashed border-black/20 text-sm text-neutral-500 hover:border-black/50 hover:text-black transition flex items-center justify-center gap-2 disabled:opacity-50"><Plus size={16} /> Ajouter une question</button>
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
  return <p className="text-[13px] text-neutral-400">Le pied de page reprend vos prénoms, la date et la phase du mariage — rien à régler.</p>;
}

type SaveFn = (fn: () => Promise<unknown>, msg?: string) => Promise<void>;

function ProgRow({ p, save }: { p: ProgrammeEvent; save: SaveFn }) {
  const [time, setTime] = useState(p.event_time);
  const [title, setTitle] = useState(p.title);
  const [desc, setDesc] = useState(p.description || '');
  const [place, setPlace] = useState(p.place || '');
  useEffect(() => { setTime(p.event_time); setTitle(p.title); setDesc(p.description || ''); setPlace(p.place || ''); }, [p.id]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="p-4 rounded-2xl bg-white border border-black/10 space-y-2.5">
      <div className="grid grid-cols-[86px_1fr] gap-2">
        <input className={fieldCls} value={time} onChange={(e) => setTime(e.target.value)} onBlur={() => time !== p.event_time && save(() => apiSend('/api/programme', 'PUT', { id: p.id, event_time: time }), 'Heure mise à jour')} />
        <input className={fieldCls} value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => title !== p.title && save(() => apiSend('/api/programme', 'PUT', { id: p.id, title }), 'Titre mis à jour')} />
      </div>
      <input className={fieldCls} value={desc} placeholder="Description" onChange={(e) => setDesc(e.target.value)} onBlur={() => desc !== (p.description || '') && save(() => apiSend('/api/programme', 'PUT', { id: p.id, description: desc }), 'Description mise à jour')} />
      <div className="flex gap-2">
        <input className={fieldCls} value={place} placeholder="Lieu" onChange={(e) => setPlace(e.target.value)} onBlur={() => place !== (p.place || '') && save(() => apiSend('/api/programme', 'PUT', { id: p.id, place }), 'Lieu mis à jour')} />
        <button onClick={() => save(() => apiSend('/api/programme', 'DELETE', { id: p.id }), 'Moment supprimé')} className="w-10 shrink-0 rounded-xl hover:bg-red-50 text-neutral-300 hover:text-red-500 flex items-center justify-center transition" aria-label="Supprimer"><Trash2 size={16} /></button>
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
    <div className="p-4 rounded-2xl bg-white border border-black/10 space-y-2.5">
      <div className="grid grid-cols-[1fr_76px] gap-2">
        <input className={fieldCls} value={cat} onChange={(e) => setCat(e.target.value)} onBlur={() => cat !== inf.category && save(() => apiSend('/api/infos', 'PUT', { id: inf.id, category: cat }), 'Catégorie mise à jour')} />
        <input className={fieldCls} value={time} placeholder="Heure" onChange={(e) => setTime(e.target.value)} onBlur={() => time !== (inf.event_time || '') && save(() => apiSend('/api/infos', 'PUT', { id: inf.id, event_time: time }), 'Heure mise à jour')} />
      </div>
      <input className={fieldCls} value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => title !== inf.title && save(() => apiSend('/api/infos', 'PUT', { id: inf.id, title }), 'Titre mis à jour')} />
      <textarea rows={2} className={fieldCls} value={detail} onChange={(e) => setDetail(e.target.value)} onBlur={() => detail !== (inf.detail || '') && save(() => apiSend('/api/infos', 'PUT', { id: inf.id, detail }), 'Détail mis à jour')} />
      <button onClick={() => save(() => apiSend('/api/infos', 'DELETE', { id: inf.id }), 'Carte supprimée')} className="text-[12px] text-neutral-400 hover:text-red-500 transition inline-flex items-center gap-1"><Trash2 size={13} /> Supprimer cette carte</button>
    </div>
  );
}

function RsvpEventRow({ ev, save }: { ev: RsvpEvent; save: SaveFn }) {
  const [name, setName] = useState(ev.name);
  useEffect(() => { setName(ev.name); }, [ev.id]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="flex gap-2">
      <input className={fieldCls} value={name} onChange={(e) => setName(e.target.value)} onBlur={() => name !== ev.name && save(() => apiSend('/api/rsvp-events', 'PUT', { id: ev.id, name }), 'Événement mis à jour')} />
      <button onClick={() => save(() => apiSend('/api/rsvp-events', 'DELETE', { id: ev.id }), 'Événement supprimé')} className="w-10 shrink-0 rounded-xl hover:bg-red-50 text-neutral-300 hover:text-red-500 flex items-center justify-center transition" aria-label="Supprimer"><Trash2 size={16} /></button>
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
    <div className="p-4 rounded-2xl bg-white border border-black/10 space-y-2.5">
      <input className={fieldCls} value={type} onChange={(e) => setType(e.target.value)} onBlur={() => type !== g.gift_type && save(() => apiSend('/api/gifts', 'PUT', { id: g.id, gift_type: type }), 'Type mis à jour')} />
      <input className={fieldCls} value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => title !== g.title && save(() => apiSend('/api/gifts', 'PUT', { id: g.id, title }), 'Titre mis à jour')} />
      <textarea rows={2} className={fieldCls} value={desc} onChange={(e) => setDesc(e.target.value)} onBlur={() => desc !== (g.description || '') && save(() => apiSend('/api/gifts', 'PUT', { id: g.id, description: desc }), 'Description mise à jour')} />
      <div className="grid grid-cols-2 gap-2">
        <div><label className={labelCls}>Objectif (€)</label><input type="number" className={fieldCls} value={goal} onChange={(e) => setGoal(e.target.value)} onBlur={() => save(() => apiSend('/api/gifts', 'PUT', { id: g.id, goal_amount: Number(goal) || 0 }), 'Objectif mis à jour')} /></div>
        <div><label className={labelCls}>Collecté (€)</label><input type="number" className={fieldCls} value={current} onChange={(e) => setCurrent(e.target.value)} onBlur={() => save(() => apiSend('/api/gifts', 'PUT', { id: g.id, current_amount: Number(current) || 0 }), 'Montant mis à jour')} /></div>
      </div>
      <button onClick={() => save(() => apiSend('/api/gifts', 'DELETE', { id: g.id }), 'Cagnotte supprimée')} className="text-[12px] text-neutral-400 hover:text-red-500 transition inline-flex items-center gap-1"><Trash2 size={13} /> Supprimer</button>
    </div>
  );
}

function FaqRow({ f, save }: { f: Faq; save: SaveFn }) {
  const [q, setQ] = useState(f.question);
  const [a, setA] = useState(f.answer);
  useEffect(() => { setQ(f.question); setA(f.answer); }, [f.id]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="p-4 rounded-2xl bg-white border border-black/10 space-y-2.5">
      <input className={fieldCls} value={q} onChange={(e) => setQ(e.target.value)} onBlur={() => q !== f.question && save(() => apiSend('/api/faqs', 'PUT', { id: f.id, question: q }), 'Question mise à jour')} />
      <textarea rows={2} className={fieldCls} value={a} onChange={(e) => setA(e.target.value)} onBlur={() => a !== f.answer && save(() => apiSend('/api/faqs', 'PUT', { id: f.id, answer: a }), 'Réponse mise à jour')} />
      <button onClick={() => save(() => apiSend('/api/faqs', 'DELETE', { id: f.id }), 'Question supprimée')} className="text-[12px] text-neutral-400 hover:text-red-500 transition inline-flex items-center gap-1"><Trash2 size={13} /> Supprimer</button>
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
      setError(err instanceof Error ? err.message : 'Chargement impossible');
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
      <div className="min-h-screen bg-[#F4F2EE] flex flex-col items-center justify-center gap-4">
        <Loader2 size={28} className="animate-spin text-neutral-400" />
        <p className="text-neutral-500" style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.3rem' }}>Ouverture de votre éditeur…</p>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="min-h-screen bg-[#F4F2EE] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-xl" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>Ce site est introuvable.</p>
        <p className="text-sm text-neutral-500">{error}</p>
        <Link to="/creer" className="px-6 py-3 rounded-full bg-neutral-900 text-white text-sm">Créer un site</Link>
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
          className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition border ${selectedKey === s.section_key ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white border-black/10 hover:border-black/25'} ${dragIdx === idx ? 'opacity-40' : ''} ${!s.visible ? 'opacity-60' : ''}`}
        >
          <GripVertical size={15} className="shrink-0 opacity-40 cursor-grab" />
          <span className="flex-1 text-[13px] font-medium truncate">{s.title}</span>
          <button onClick={(e) => { e.stopPropagation(); toggleVisible(s); }} className="w-7 h-7 rounded-lg flex items-center justify-center opacity-50 hover:opacity-100 transition" aria-label={s.visible ? 'Masquer' : 'Afficher'}>
            {s.visible ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-[#F4F2EE] text-[#1A1A1A]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <header className="h-[60px] shrink-0 bg-white/85 backdrop-blur-xl border-b border-black/10 flex items-center gap-2 sm:gap-3 px-3 sm:px-5 z-30">
        <Link to="/" className="w-9 h-9 rounded-full hover:bg-black/5 flex items-center justify-center transition" aria-label="Retour"><ArrowLeft size={18} /></Link>
        <div className="min-w-0 hidden sm:block">
          <div className="text-[14px] font-medium truncate" style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.05rem' }}>{site.partner1} & {site.partner2}</div>
          <div className="text-[11px] text-neutral-400 tabular-nums truncate">{site.slug}.byaime.fr {site.published && '· Publié'}</div>
        </div>
        <div className="flex-1" />
        <div className="hidden md:flex items-center p-1 rounded-full bg-black/5">
          <button onClick={() => setDevice('desktop')} className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition ${device === 'desktop' ? 'bg-white shadow-sm' : 'text-neutral-500'}`}><Monitor size={14} /> Desktop</button>
          <button onClick={() => setDevice('mobile')} className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition ${device === 'mobile' ? 'bg-white shadow-sm' : 'text-neutral-500'}`}><Smartphone size={14} /> Mobile</button>
        </div>
        <button onClick={() => setDrawer('structure')} className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-black/5 text-[13px] font-medium"><LayoutList size={15} /> Sections</button>
        <div className="hidden sm:flex items-center gap-1.5">
          <button onClick={() => setDrawer(drawer === 'appearance' ? null : 'appearance')} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium transition ${drawer === 'appearance' ? 'bg-neutral-900 text-white' : 'bg-black/5 hover:bg-black/10'}`}><Palette size={15} /> <span className="hidden xl:inline">Apparence</span></button>
          <button onClick={() => openMedia(() => { fetchAll(); }, 'Bibliothèque média')} className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium bg-black/5 hover:bg-black/10 transition"><Images size={15} /> <span className="hidden xl:inline">Médias</span></button>
          <button onClick={() => { setDrawer(drawer === 'rsvp' ? null : 'rsvp'); setRsvpTick((t) => t + 1); }} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium transition ${drawer === 'rsvp' ? 'bg-neutral-900 text-white' : 'bg-black/5 hover:bg-black/10'}`}><MailCheck size={15} /> <span className="hidden xl:inline">RSVP</span></button>
          <button onClick={() => setDrawer(drawer === 'share' ? null : 'share')} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium transition ${drawer === 'share' ? 'bg-neutral-900 text-white' : 'bg-black/5 hover:bg-black/10'}`}><Share2 size={15} /> <span className="hidden xl:inline">Partager</span></button>
        </div>
        {site.published ? (
          <Link to={`/p/${site.slug}`} target="_blank" className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 text-white text-[13px] font-medium hover:bg-emerald-500 transition"><Globe size={15} /> Voir</Link>
        ) : (
          <button onClick={publish} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#8A6D4B] text-white text-[13px] font-medium hover:bg-[#75593C] transition"><Rocket size={15} /> Publier</button>
        )}
      </header>

      <div className="flex-1 flex min-h-0">
        <aside className="hidden lg:flex w-[264px] shrink-0 flex-col bg-white/60 backdrop-blur border-r border-black/10 p-4 overflow-y-auto">
          <div className="text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-medium px-2 mb-2">Structure du site</div>
          {structureList}
          <div className="mt-5 px-2">
            <div className="text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-medium mb-2">Phase du mariage</div>
            <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-black/5">
              {PHASES.map((p) => (
                <button key={p.id} onClick={() => { patchSite({ phase: p.id }); notify(`Phase : ${p.name}`); }} className={`py-2 rounded-xl text-[12px] font-medium transition ${site.phase === p.id ? 'bg-white shadow-sm' : 'text-neutral-500'}`}>{p.name}</button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-neutral-400 leading-relaxed">{PHASES.find((p) => p.id === site.phase)?.desc}</p>
          </div>
        </aside>

        <main className="flex-1 min-w-0 overflow-y-auto" onClick={() => setDrawer(null)}>
          <div className={`mx-auto py-5 px-3 sm:px-6 transition-all duration-500 ${device === 'mobile' ? 'max-w-[400px]' : 'max-w-5xl'}`}>
            <div className={`overflow-hidden bg-white shadow-[0_20px_70px_rgba(0,0,0,0.10)] border border-black/10 transition-all duration-500 ${device === 'mobile' ? 'rounded-[2.2rem] border-[6px] border-neutral-900' : 'rounded-2xl'}`}>
              {device === 'mobile' && <div className="bg-neutral-900 pt-2.5 pb-1.5 flex justify-center"><div className="w-24 h-5 bg-black rounded-full" /></div>}
              <PublicSiteView data={data} preview selectedKey={selectedKey} onSelectSection={(k) => setSelectedKey(k)} />
            </div>
            <p className="mt-4 text-center text-[12px] text-neutral-400">Cliquez sur une section du site pour la modifier — aperçu {device === 'mobile' ? 'mobile' : 'desktop'} en temps réel.</p>
          </div>
        </main>

        <aside className="hidden lg:flex w-[320px] shrink-0 flex-col bg-white border-l border-black/10 min-h-0">
          <div className="px-5 pt-5 pb-3 border-b border-black/5 shrink-0">
            <div className="text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-medium">Sélection</div>
            <div className="mt-1 text-lg font-light flex items-center gap-2" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>
              {selectedSection?.title || 'Section'}
              {selectedSection && !selectedSection.visible && <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/10 text-neutral-500 tracking-wide uppercase">Masquée</span>}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            <SectionEditor sectionKey={selectedKey} ctx={ctx} />
          </div>
        </aside>
      </div>

      <div className="lg:hidden shrink-0 bg-white/90 backdrop-blur-xl border-t border-black/10 px-3 py-2.5 flex items-center justify-around z-30">
        <button onClick={() => setDevice(device === 'mobile' ? 'desktop' : 'mobile')} className="flex flex-col items-center gap-0.5 text-[10px] text-neutral-500 p-1.5">{device === 'mobile' ? <Monitor size={19} /> : <Smartphone size={19} />} Aperçu</button>
        <button onClick={() => setDrawer('appearance')} className="flex flex-col items-center gap-0.5 text-[10px] text-neutral-500 p-1.5"><Palette size={19} /> Style</button>
        <button onClick={() => openMedia(() => { fetchAll(); }, 'Bibliothèque média')} className="flex flex-col items-center gap-0.5 text-[10px] text-neutral-500 p-1.5"><Images size={19} /> Photos</button>
        <button onClick={() => { setDrawer('rsvp'); setRsvpTick((t) => t + 1); }} className="flex flex-col items-center gap-0.5 text-[10px] text-neutral-500 p-1.5"><MailCheck size={19} /> RSVP</button>
        <button onClick={() => setDrawer('share')} className="flex flex-col items-center gap-0.5 text-[10px] text-neutral-500 p-1.5"><Share2 size={19} /> Partage</button>
      </div>

      <AnimatePresence>
        {drawer && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(null)} className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[420px] bg-[#FAF8F5] shadow-2xl flex flex-col">
              <div className="flex items-center justify-between px-6 h-[68px] border-b border-black/10 bg-white/70 backdrop-blur shrink-0">
                <div className="text-[13px] tracking-[0.25em] uppercase font-medium">
                  {drawer === 'appearance' && 'Apparence de votre mariage'}
                  {drawer === 'rsvp' && 'RSVP'}
                  {drawer === 'share' && 'Publication & partage'}
                  {drawer === 'structure' && 'Structure du site'}
                </div>
                <button onClick={() => setDrawer(null)} className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition" aria-label="Fermer"><X size={17} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {drawer === 'appearance' && <AppearancePanel site={site} onPatch={patchSite} />}
                {drawer === 'rsvp' && <RsvpManager siteId={site.id} events={rsvpEvents} refreshKey={rsvpTick} />}
                {drawer === 'share' && <SharePanel site={site} onPublishedChange={(v) => { patchSite({ published: v }); notify(v ? 'Site publié' : 'Site en brouillon'); }} />}
                {drawer === 'structure' && (
                  <div>
                    {structureList}
                    <div className="mt-6">
                      <div className="text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-medium mb-3">Modifier : {selectedSection?.title}</div>
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
        <button onClick={() => setDrawer('structure')} className="fixed bottom-[76px] right-4 z-30 flex items-center gap-2 px-4 py-3 rounded-full bg-neutral-900 text-white text-[13px] font-medium shadow-xl">
          Modifier : {selectedSection?.title || 'section'} <ChevronDown size={15} className="rotate-[-90deg]" />
        </button>
      </div>

      <MediaLibrary open={mediaOpen} onClose={() => setMediaOpen(false)} title={mediaTitle} onSelect={(url) => { setMediaOpen(false); mediaCb.current?.(url); notify('Photo insérée'); }} />

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-2 px-5 py-3 rounded-full bg-neutral-900 text-white text-sm shadow-2xl">
            <Check size={16} className="text-emerald-400" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
