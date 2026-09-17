import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Palette, Type, Layers, Info, Check, Copy } from 'lucide-react';
import { PackageData } from '../../data/packagesData';

interface PackageSpecDrawerProps {
  pkg: PackageData;
  isOpen: boolean;
  onClose: () => void;
}

export default function PackageSpecDrawer({ pkg, isOpen, onClose }: PackageSpecDrawerProps) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const copyPromptToClipboard = () => {
    navigator.clipboard.writeText(pkg.aiPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-xl bg-[#121214] text-[#F5F5F0] border-l border-white/10 z-50 overflow-y-auto p-6 sm:p-8 flex flex-col shadow-2xl"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#A1A1AA] uppercase tracking-widest">
                  <span>PACK {pkg.number}</span>
                  <span>•</span>
                  <span>LE MONDE AIME</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mt-1">
                  {pkg.name}
                </h3>
                <p className="text-sm text-[#A1A1AA] mt-1 font-light">{pkg.agencySubtitle}</p>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="mt-8 space-y-8 flex-1">
              {/* Vision & Tagline */}
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#A1A1AA] flex items-center gap-1.5">
                  <Info size={14} /> Concept & Intention Créative
                </span>
                <p className="text-base text-white/90 mt-2 font-medium italic border-l-2 border-[#F5F5F0] pl-4">
                  « {pkg.tagline} »
                </p>
                <p className="text-sm text-[#A1A1AA] mt-3 font-light leading-relaxed">
                  {pkg.description}
                </p>
              </div>

              {/* Color Palette */}
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#A1A1AA] flex items-center gap-1.5 mb-3">
                  <Palette size={14} /> Palette Chromatique Dédiée
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {pkg.colors.map((c) => (
                    <div key={c.hex} className="p-3 bg-[#18181B] border border-white/10 rounded-lg">
                      <div
                        className="w-full h-10 rounded border border-white/10 mb-2 shadow-inner"
                        style={{ backgroundColor: c.hex }}
                      />
                      <div className="text-xs font-semibold text-white truncate">{c.name}</div>
                      <div className="text-[11px] font-mono text-[#A1A1AA]">{c.hex}</div>
                      <div className="text-[10px] text-[#71717A] mt-1 truncate">{c.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Typography */}
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#A1A1AA] flex items-center gap-1.5 mb-3">
                  <Type size={14} /> Harmonisation Typographique
                </span>
                <div className="p-4 bg-[#18181B] border border-white/10 rounded-lg space-y-2 text-xs">
                  <div>
                    <span className="text-[#A1A1AA] font-mono block">TITRES // DISPLAY</span>
                    <strong className="text-white text-sm font-semibold">{pkg.typography.titles}</strong>
                  </div>
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-[#A1A1AA] font-mono block">CORPS DE TEXTE</span>
                    <strong className="text-white font-semibold">{pkg.typography.body}</strong>
                  </div>
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-[#A1A1AA] font-mono block">DÉTAIL STYLISTIQUE</span>
                    <span className="text-[#71717A]">{pkg.typography.notes}</span>
                  </div>
                </div>
              </div>

              {/* Features Included */}
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#A1A1AA] flex items-center gap-1.5 mb-3">
                  <Layers size={14} /> Fonctionnalités Clés du Mini-Site
                </span>
                <ul className="space-y-2.5">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-white/90">
                      <div className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI Image Generation Prompt */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#A1A1AA] flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#C5A059]" /> Prompt IA Midjourney / Imagen 3
                  </span>
                  <button
                    onClick={copyPromptToClipboard}
                    className="text-[11px] font-mono text-white flex items-center gap-1 hover:underline"
                  >
                    {copiedPrompt ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    {copiedPrompt ? 'Copié !' : 'Copier'}
                  </button>
                </div>
                <div className="p-4 bg-[#09090B] border border-white/10 rounded-lg text-xs font-mono text-[#A1A1AA] leading-relaxed break-words">
                  {pkg.aiPrompt}
                </div>
              </div>
            </div>

            {/* Bottom price indicator */}
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-mono text-[#A1A1AA] uppercase">Honoraires Package Agence</div>
                <div className="text-xl font-bold text-white">À partir de {pkg.priceFrom}</div>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-white text-black text-xs font-semibold uppercase tracking-wider rounded hover:bg-neutral-200 transition"
              >
                Explorer le mini-site
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
