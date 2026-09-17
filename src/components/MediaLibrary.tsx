import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Upload, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import type { MediaAsset } from '../lib/types';
import { apiGet, apiSend } from '../lib/http';
import { MEDIA_CATEGORIES, MEDIA_COLLECTIONS } from '../lib/weddingStyles';
import { DEMO_MEDIA, DEMO_ENABLED } from '../lib/demo';
import VisionImage from './vision/VisionImage';

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
}

export default function MediaLibrary({ open, onClose, onSelect, title }: Props) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Tout');
  const [collection, setCollection] = useState('Toutes');
  const [uploading, setUploading] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let active = true;
    const fallback = () => (DEMO_ENABLED ? DEMO_MEDIA : []);
    apiGet<MediaAsset[]>('/api/media')
      .then((data) => (data && data.length ? data : fallback()))
      .catch(() => fallback())
      .then((assets) => {
        if (!active) return;
        setAssets(assets);
        setLoading(false);
      });
    return () => { active = false; };
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return assets.filter((a) => {
      if (category !== 'Tout' && a.category !== category) return false;
      if (collection !== 'Toutes' && a.collection !== collection) return false;
      if (q && !`${a.title} ${a.category} ${a.collection}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [assets, query, category, collection]);

  const choose = (url: string) => {
    setPicked(url);
    setTimeout(() => { onSelect(url); setPicked(null); }, 220);
  };

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const base64 = dataUrl.split(',')[1];
      const res = await apiSend<{ url: string }>('/api/upload', 'POST', { fileName: file.name, fileBase64: base64, contentType: file.type });
      onSelect(res.url);
    } catch {
      alert('L’import a échoué. Réessayez avec une image plus légère.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-6" onClick={onClose}>
          <motion.div
            initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="vp-env vp-glass-float flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[34px] sm:max-w-5xl sm:rounded-[34px]"
          >
            <div className="vp-veil-light px-6 pb-4 pt-6 sm:px-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="vp-h2 text-[22px] sm:text-[24px]">{title || 'Bibliothèque média'}</h3>
                  <p className="vp-caption mt-0.5 !text-sm">{filtered.length} visuel{filtered.length > 1 ? 's' : ''} — cliquez pour insérer</p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="vp-btn vp-press !px-4 !py-2.5 !text-[13.5px] cursor-pointer">
                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    <span className="hidden sm:inline">{uploading ? 'Import…' : 'Importer'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                  </label>
                  <button onClick={onClose} className="vp-press flex h-10 w-10 items-center justify-center rounded-full bg-black/5 transition hover:bg-black/10" aria-label="Fermer"><X size={18} /></button>
                </div>
              </div>
              <div className="mt-4 relative">
                <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--vp-muted-2)]" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher : alliances, château, bouquet…" className="vp-field !rounded-full !py-3 !pl-11 !text-[15px]" />
              </div>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {['Tout', ...MEDIA_CATEGORIES].map((c) => (
                  <button key={c} onClick={() => setCategory(c)} className={`vp-chip vp-press shrink-0 ${category === c ? '!bg-[var(--vp-ink)] !text-white' : 'text-[var(--vp-ink-soft)]'}`}>{c}</button>
                ))}
              </div>
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {['Toutes', ...MEDIA_COLLECTIONS].map((c) => (
                  <button key={c} onClick={() => setCollection(c)} className={`vp-chip vp-press shrink-0 !py-1.5 !text-[12px] ${collection === c ? '!bg-[var(--vp-accent)] !text-white' : '!text-[var(--vp-accent)]'}`}>{c}</button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="aspect-[4/3] animate-pulse rounded-[20px] bg-white/40" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-16 text-center text-[var(--vp-muted)]">
                  <ImageIcon size={36} strokeWidth={1.5} className="mx-auto" />
                  <p className="vp-caption mt-3">Aucun visuel trouvé. Essayez un autre mot.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filtered.map((a) => (
                    <button key={a.id} onClick={() => choose(a.url)} className="vp-press group relative aspect-[4/3] overflow-hidden rounded-[12px] border border-black/8 bg-[#F5F5F7] text-left">
                      <VisionImage src={a.url} alt={a.title} fallbackLabel={a.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <span className="absolute inset-0 bg-[#05060C]/0 transition group-hover:bg-[#05060C]/25" />
                      <span className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2">
                        <span className="truncate rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white">{a.title}</span>
                      </span>
                      {picked === a.url && (
                        <span className="absolute inset-0 flex items-center justify-center bg-[#05060C]/40">
                          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white"><Check size={20} className="text-[var(--vp-accent)]" strokeWidth={2.6} /></span>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
