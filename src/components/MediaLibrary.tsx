import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Upload, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import type { MediaAsset } from '../lib/types';
import { apiGet, apiSend } from '../lib/api';
import { MEDIA_CATEGORIES, MEDIA_COLLECTIONS } from '../lib/weddingStyles';

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
    setLoading(true);
    apiGet<MediaAsset[]>('/api/media')
      .then(setAssets)
      .catch(() => setAssets([]))
      .finally(() => setLoading(false));
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
            className="w-full sm:max-w-5xl max-h-[92vh] bg-[#FAF8F5] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-black/10 bg-white/70 backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-medium tracking-tight" style={{ fontFamily: '"Wix Madefor Display", "Plus Jakarta Sans", system-ui, sans-serif' }}>{title || 'Bibliothèque média'}</h3>
                  <p className="text-sm text-neutral-500 mt-0.5">{filtered.length} visuel{filtered.length > 1 ? 's' : ''} — cliquez pour insérer</p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-900 text-white text-sm cursor-pointer hover:bg-neutral-700 transition">
                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    <span className="hidden sm:inline">{uploading ? 'Import…' : 'Importer'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                  </label>
                  <button onClick={onClose} className="w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition" aria-label="Fermer"><X size={18} /></button>
                </div>
              </div>
              <div className="mt-4 relative">
                <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher : alliances, château, bouquet…" className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-black/10 text-[15px] outline-none focus:border-black/30 transition" />
              </div>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {Array.from(new Set(MEDIA_CATEGORIES)).map((c) => (
                  <button key={c} onClick={() => setCategory(c)} className={`shrink-0 px-4 py-2 rounded-full text-[13px] transition ${category === c ? 'bg-neutral-900 text-white' : 'bg-white border border-black/10 text-neutral-600 hover:border-black/30'}`}>{c}</button>
                ))}
              </div>
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {Array.from(new Set(MEDIA_COLLECTIONS)).map((c) => (
                  <button key={c} onClick={() => setCollection(c)} className={`shrink-0 px-4 py-1.5 rounded-full text-[12px] tracking-wide transition ${collection === c ? 'bg-[#8A6D4B] text-white' : 'bg-[#8A6D4B]/10 text-[#8A6D4B] hover:bg-[#8A6D4B]/20'}`}>{c}</button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="aspect-[4/3] rounded-2xl bg-black/5 animate-pulse" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-16 text-center text-neutral-400">
                  <ImageIcon size={36} strokeWidth={1.25} className="mx-auto" />
                  <p className="mt-3">Aucun visuel trouvé. Essayez un autre mot.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filtered.map((a) => (
                    <button key={a.id} onClick={() => choose(a.url)} className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-black/5 text-left">
                      <img src={a.url} alt={a.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition" />
                      <span className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-white bg-black/55 backdrop-blur px-2.5 py-1 rounded-full truncate">{a.title}</span>
                      </span>
                      {picked === a.url && (
                        <span className="absolute inset-0 bg-black/45 flex items-center justify-center">
                          <span className="w-11 h-11 rounded-full bg-white flex items-center justify-center"><Check size={20} className="text-neutral-900" /></span>
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
