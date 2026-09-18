import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, ArrowRight, Layers, Sliders, Radio, PhoneCall, Shield, SlidersHorizontal } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const EVENT_OS_MODULES = [
  {
    id: 'theater',
    isDirectRoute: true,
    route: '/theater',
    number: '00',
    name: 'Timeline Theater Studio',
    tagline: 'Montage spatialisé, régie temporelle, calendrier & archives',
    icon: SlidersHorizontal,
    badge: 'Nouveau Studio',
    color: '#000000',
  },
  {
    id: 'module-orchestration',
    number: '01',
    name: 'Orchestration Prédictive',
    tagline: 'Résolution en cascade des retards et aléas',
    icon: Sliders,
    badge: 'Brevetable Core',
    color: '#10B981',
  },
  {
    id: 'module-talkie',
    number: '02',
    name: 'Talkie-Walkie WebRTC',
    tagline: 'Régie audio PTT chiffrée par canaux métiers',
    icon: PhoneCall,
    badge: 'Zéro WhatsApp',
    color: '#3B82F6',
  },
  {
    id: 'module-radio',
    number: '03',
    name: 'VOWS ON AIR · Radio Live',
    tagline: 'Diffusion streaming HD continue pour les proches',
    icon: Radio,
    badge: 'Flux 320 kbps',
    color: '#EC4899',
  },
];

export default function UnifiedEventOsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenModule = (mod: typeof EVENT_OS_MODULES[number]) => {
    setIsOpen(false);
    if ('isDirectRoute' in mod && mod.isDirectRoute) {
      navigate(mod.route);
      return;
    }
    navigate('/features');
    setTimeout(() => {
      const el = document.getElementById(mod.id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  return (
    <div>
      {/* Bouton déclencheur central élégant dans la nav : EVENT OS */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-1.5 rounded-full border border-black/10 bg-white/95 px-3.5 py-1.5 text-[12.5px] font-semibold text-[#0B0C12] shadow-sm backdrop-blur-md transition hover:border-black/30 hover:bg-white"
        aria-expanded={isOpen}
      >
        <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm" />
        <span className="tracking-wide">EVENT OS</span>
        <ChevronDown
          size={13}
          className={`text-[var(--vp-muted)] transition-transform duration-300 ml-0.5 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Panneau déroulant supérieur blanc moderne avec les cartes modules */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-0 z-[60] border-b border-black/10 bg-white/98 backdrop-blur-xl py-5 text-[#0B0C12] shadow-[0_25px_60px_rgba(0,0,0,0.12)]"
          >
            <div className="mx-auto max-w-5xl px-4 sm:px-6">
              {/* En-tête du menu */}
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-emerald-600" />
                  <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#0B0C12]">
                    Architecture &amp; Modules Event OS
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-[#0B0C12] transition hover:bg-black/10"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Grille des 4 modules présentés en cartes blanches épurées */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {EVENT_OS_MODULES.map((mod) => {
                  const Icon = mod.icon;

                  return (
                    <div
                      key={mod.id}
                      onClick={() => handleOpenModule(mod)}
                      className="cursor-pointer group relative rounded-[22px] bg-[#FAFAFC] border border-black/8 p-4 text-left transition-all hover:bg-white hover:border-black/20 hover:shadow-lg hover:scale-[1.01]"
                    >
                      <div className="flex items-center justify-between pb-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white shadow-sm">
                            <Icon size={15} />
                          </span>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-black/50">
                            {mod.number}
                          </span>
                        </div>
                        <span className="rounded-full bg-black/5 px-2 py-0.5 text-[9px] font-mono font-semibold text-black/70">
                          {mod.badge}
                        </span>
                      </div>

                      <div className="text-[15px] font-bold text-black mt-1 leading-snug">
                        {mod.name}
                      </div>

                      <p className="text-[11.5px] text-black/60 mt-1 line-clamp-2 leading-relaxed">
                        {mod.tagline}
                      </p>

                      <div className="mt-4 pt-2 border-t border-black/5 flex items-center justify-between text-[11px] font-bold text-black">
                        <span>Explorer le module</span>
                        <ArrowRight size={12} className="group-hover:translate-x-1 transition" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Lien vers la page complète */}
              <div className="mt-4 pt-3 border-t border-black/5 text-center">
                <Link
                  to="/features"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-black hover:underline"
                >
                  <span>Voir la page complète de l'architecture Event OS</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
