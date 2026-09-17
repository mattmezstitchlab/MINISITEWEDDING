import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const STEPS = [
  'Lecture de votre histoire',
  'Composition des sections',
  'Sélection des visuels',
  'Mise en page éditoriale',
  'Dernières retouches',
];

export default function Generating() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const siteId = params.get('site');
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    if (!siteId) { navigate('/creer'); return; }
    const start = Date.now();
    const duration = 6000;
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(p);
      setStepIdx(Math.min(STEPS.length - 1, Math.floor((elapsed / duration) * STEPS.length)));
      if (p >= 100) {
        clearInterval(timer);
        setTimeout(() => navigate(`/editeur/${siteId}`), 650);
      }
    }, 80);
    return () => clearInterval(timer);
  }, [siteId, navigate]);

  return (
    <div className="min-h-screen bg-[#141311] text-white flex items-center justify-center px-6 overflow-hidden" style={{ fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}>
      <div className="absolute inset-0 opacity-20"><img src="/images/hero-wedding.jpg" alt="" className="w-full h-full object-cover" /></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#141311]/60 via-[#141311]/80 to-[#141311]" />
      <div className="relative w-full max-w-md text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto w-16 h-16 rounded-full bg-white text-neutral-900 flex items-center justify-center text-2xl" style={{ fontFamily: '"Playfair Display", "Cormorant Garamond", Georgia, serif' }}>W</motion.div>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-7 font-light" style={{ fontFamily: '"Playfair Display", "Cormorant Garamond", Georgia, serif', fontSize: 'clamp(1.9rem, 6vw, 2.6rem)' }}>
          Votre site prend forme…
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-2 text-white/60 text-[15px]">Nous composons votre mariage, page par page.</motion.p>
        <div className="mt-8 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div className="h-full rounded-full bg-[#C6A15B]" animate={{ width: `${progress}%` }} transition={{ ease: 'linear' }} />
        </div>
        <div className="mt-2 text-right text-[12px] text-white/50 tabular-nums">{progress}%</div>
        <div className="mt-6 space-y-2.5 text-left">
          {STEPS.map((s, i) => (
            <motion.div key={s} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.15 }} className={`flex items-center gap-3 px-5 py-3 rounded-2xl transition ${i < stepIdx || progress === 100 ? 'bg-white/10' : i === stepIdx ? 'bg-white/5' : 'opacity-40'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] ${i < stepIdx || progress === 100 ? 'bg-[#C6A15B] text-neutral-900' : 'bg-white/10 text-white/60'}`}>
                {i < stepIdx || progress === 100 ? <Check size={13} /> : <span className="tabular-nums">{i + 1}</span>}
              </span>
              <span className="text-[14px]">{s}</span>
              {i === stepIdx && progress < 100 && <span className="ml-auto flex gap-1">{[0, 1, 2].map((dd) => (<motion.span key={dd} className="w-1.5 h-1.5 rounded-full bg-[#C6A15B]" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.2, delay: dd * 0.2 }} />))}</span>}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
