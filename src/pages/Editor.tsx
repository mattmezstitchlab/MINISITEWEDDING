import { useCallback, useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Eye, EyeOff, GripVertical, Monitor, Smartphone, Palette, Images,
  MailCheck, Share2, Rocket, Check, X, ChevronDown, LayoutList, Loader2, Globe,
} from 'lucide-react';
import type { SiteSection, WeddingSite } from '../lib/types';
import { apiSend, ApiError } from '../lib/http';
import { publicPath } from '../lib/format';
import { getEditToken, setActiveToken } from '../lib/auth';
import { useSiteData } from '../lib/siteData';
import NoAccess from '../components/editor/NoAccess';
import { PHASES } from '../lib/weddingStyles';
import PublicSiteView from '../components/PublicSiteView';
import MediaLibrary from '../components/MediaLibrary';
import AppearancePanel from '../components/AppearancePanel';
import RsvpManager from '../components/RsvpManager';
import SharePanel from '../components/SharePanel';
import SectionEditor from '../components/editor/SectionEditor';
import type { EditorContext } from '../components/editor/SectionEditor';

type Drawer = null | 'appearance' | 'rsvp' | 'share' | 'structure';

/**
 * Garde d’accès : la clé d’édition doit être active **avant** le premier
 * chargement, d’où cette coquille qui la pose puis monte l’éditeur.
 *
 * La clé est posée pendant le rendu (variable de module, opération idempotente)
 * plutôt que dans un effet : un effet s’exécuterait après celui de
 * `useSiteData`, donc après la requête.
 */
export default function Editor() {
  const { id } = useParams();
  const [token] = useState(() => getEditToken({ id }));
  setActiveToken(token);

  if (!token) return <NoAccess siteId={id} />;
  return <EditorShell id={id} />;
}

/**
 * L’éditeur : aperçu du site au centre, structure à gauche, champs de la
 * section sélectionnée à droite. Les données viennent de `useSiteData`, le même
 * chargement que la page publique.
 */
function EditorShell({ id }: { id?: string }) {
  const { data, loading, error, status, reload, patchLocal } = useSiteData({ id });
  const [selectedKey, setSelectedKey] = useState<string>('hero');
  const [drawer, setDrawer] = useState<Drawer>(null);
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [toast, setToast] = useState('');
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaTitle, setMediaTitle] = useState('Bibliothèque média');
  const [rsvpTick, setRsvpTick] = useState(0);
  const [locked, setLocked] = useState(false);
  const mediaCb = useRef<((url: string) => void) | null>(null);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  }, []);

  const openMedia = useCallback((cb: (url: string) => void, title: string) => {
    mediaCb.current = cb;
    setMediaTitle(title);
    setMediaOpen(true);
  }, []);

  /**
   * Toute écriture passe par ici : un 403 signifie que la clé a été révoquée en
   * cours de session, et l’éditeur se reverrouille au lieu d’afficher un toast
   * que l’utilisateur pourrait ignorer.
   */
  const onWriteError = useCallback((err: unknown, message: string) => {
    if (err instanceof ApiError && err.status === 403) { setLocked(true); return; }
    notify(message);
  }, [notify]);

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

  if (locked || status === 403) return <NoAccess siteId={id} invalid />;

  if (error || !data) {
    // 503 = base injoignable (Supabase en pause, variables manquantes) : ce
    // n’est pas le site qui a disparu. Les mini-sites publiés restent visibles
    // sur /p/:slug s’ils ont une copie dans public/sites/.
    const baseDown = status !== null && status >= 500;
    return (
      <div className="vp-env flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="vp-h2 text-[22px]">{baseDown ? 'La base de données ne répond pas.' : 'Ce site est introuvable.'}</p>
        <p className="vp-caption">{error}</p>
        {baseDown && (
          <p className="vp-caption !max-w-md">
            L’édition reprendra dès que Supabase répondra de nouveau. Les mini-sites
            disposant d’une copie dans <code className="vp-num">public/sites/</code> restent
            affichés sur leur lien public.
          </p>
        )}
        <Link to="/creer" className="vp-btn vp-press !px-6">Créer un site</Link>
      </div>
    );
  }

  const { site, sections, programme, infos, gallery, faqs, rsvpEvents, gifts } = data;

  const patchSite = async (patch: Partial<WeddingSite>) => {
    patchLocal((d) => ({ ...d, site: { ...d.site, ...patch } }));
    try {
      await apiSend('/api/wedding-sites', 'PUT', { id: site.id, ...patch });
    } catch (err) { onWriteError(err, 'Sauvegarde impossible'); }
  };

  const toggleVisible = async (sec: SiteSection) => {
    patchLocal((d) => ({ ...d, sections: d.sections.map((s) => (s.id === sec.id ? { ...s, visible: !s.visible } : s)) }));
    try {
      await apiSend('/api/site-sections', 'PUT', { id: sec.id, visible: !sec.visible });
      notify(sec.visible ? 'Section masquée' : 'Section affichée');
    } catch (err) { onWriteError(err, 'Sauvegarde impossible'); }
  };

  const onDropSection = async (e: DragEvent<HTMLDivElement>, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) { setDragIdx(null); return; }
    const next = [...sections];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(idx, 0, moved);
    const reordered = next.map((s, i) => ({ ...s, position: i }));
    patchLocal((d) => ({ ...d, sections: reordered }));
    setDragIdx(null);
    try {
      for (const s of reordered) { await apiSend('/api/site-sections', 'PUT', { id: s.id, position: s.position }); }
      notify('Ordre mis à jour');
    } catch (err) { onWriteError(err, 'Sauvegarde impossible'); }
  };

  const publish = async () => {
    await patchSite({ published: true });
    setDrawer('share');
    notify('Votre site est publié');
  };

  const ctx: EditorContext = { site, programme, infos, gallery, faqs, rsvpEvents, gifts, patchSite, refresh: reload, openMedia, notify };
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
          <div className="vp-num vp-caption truncate !text-[11px]">{publicPath(site.slug)} {site.published && '· Publié'}</div>
        </div>
        <div className="flex-1" />
        <div className="vp-segmented hidden md:inline-flex">
          <button onClick={() => setDevice('desktop')} className="vp-seg-item" data-on={device === 'desktop'}><Monitor size={14} /> Desktop</button>
          <button onClick={() => setDevice('mobile')} className="vp-seg-item" data-on={device === 'mobile'}><Smartphone size={14} /> Mobile</button>
        </div>
        <button onClick={() => setDrawer('structure')} className="vp-chip vp-press lg:hidden"><LayoutList size={15} /> Sections</button>
        <div className="hidden items-center gap-1.5 sm:flex">
          <button onClick={() => setDrawer(drawer === 'appearance' ? null : 'appearance')} className={`vp-chip vp-press ${drawer === 'appearance' ? '!bg-[var(--vp-ink)] !text-white' : ''}`}><Palette size={15} /> <span className="hidden xl:inline">Apparence</span></button>
          <button onClick={() => openMedia(() => { reload(); }, 'Bibliothèque média')} className="vp-chip vp-press"><Images size={15} /> <span className="hidden xl:inline">Médias</span></button>
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
        <button onClick={() => openMedia(() => { reload(); }, 'Bibliothèque média')} className="vp-press flex flex-col items-center gap-0.5 p-1.5 text-[10px] font-medium text-[var(--vp-muted)]"><Images size={19} /> Photos</button>
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
                {drawer === 'share' && <SharePanel site={site} data={data} onPublishedChange={(v) => { patchSite({ published: v }); notify(v ? 'Site publié' : 'Site en brouillon'); }} />}
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
