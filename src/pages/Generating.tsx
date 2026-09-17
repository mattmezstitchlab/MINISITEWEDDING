import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const STEPS = [
  'Lecture de votre histoire',
  'Composition des sections',
  'Sélection des visuels',
  'Mise en page spatiale',
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
    <div className="vp-env flex min-h-screen items-center justify-center px-6 text-[var(--vp-ink)]">
      <div className="relative w-full max-w-md text-center">
        {/* Anneau de progression spatial */}
        <motion.div initial={{ opacity: 0, scale: 0.86 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="relative mx-auto h-32 w-32">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(12,14,24,0.08)" strokeWidth="7" />
            <circle
              cx="60" cy="60" r="52" fill="none" stroke="url(#vpgrad)" strokeWidth="7" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 52}
              strokeDashoffset={2 * Math.PI * 52 * (1 - progress / 100)}
              style={{ transition: 'stroke-dashoffset 0.2s linear' }}
            />
            <defs>
              <linearGradient id="vpgrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#55585F" />
                <stop offset="100%" stopColor="#16171A" />
              </linearGradient>
            </defs>
          </svg>
          <div className="vp-glass vp-spec absolute inset-[18px] flex items-center justify-center rounded-full">
            <span className="vp-title vp-num text-[26px]">{progress}%</span>
          </div>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="vp-title mt-9" style={{ fontSize: 'clamp(1.75rem, 5.4vw, 2.4rem)' }}>
          Votre site prend forme…
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="vp-body mt-2">
          Nous composons votre mariage, couche par couche.
        </motion.p>

        <div className="vp-progress mt-9"><span style={{ width: `${progress}%` }} /></div>

        <div className="mt-7 space-y-2.5 text-left">
          {STEPS.map((s, i) => {
            const done = i < stepIdx || progress === 100;
            const active = i === stepIdx && progress < 100;
            return (
              <motion.div
                key={s}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.13 }}
                className={`flex items-center gap-3 rounded-[20px] px-5 py-3 transition-all duration-500 ${
                  done ? 'vp-glass vp-spec' : active ? 'vp-glass-thin' : 'opacity-40'
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[12px] ${
                    done ? 'vp-glyph !rounded-full' : 'bg-black/5 text-[var(--vp-muted)]'
                  }`}
                >
                  {done ? <Check size={13} strokeWidth={3} /> : <span className="vp-num">{i + 1}</span>}
                </span>
                <span className="text-[14px] font-medium">{s}</span>
                {active && (
                  <span className="ml-auto flex gap-1">
                    {[0, 1, 2].map((dd) => (
                      <motion.span key={dd} className="h-1.5 w-1.5 rounded-full bg-[var(--vp-ink)]" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.2, delay: dd * 0.2 }} />
                    ))}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
