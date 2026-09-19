import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cake,
  Camera,
  ChevronDown,
  ChevronLeft,
  Hammer,
  HeartHandshake,
  Music,
  Palette,
  Sparkles,
  Disc3,
  Users,
  UtensilsCrossed,
  Wine,
  Wrench,
  X,
  ArrowRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { metiersParDomaine } from '../lib/weddingVendors';
import { styleById, type WeddingStyle } from '../lib/weddingStyles';

/**
 * LE MENU MÉTIERS
 *
 * Les prestataires, rangés par domaine : cuisine, photo, musique, fleurs,
 * bar, technique… Chaque carte annonce son domaine ; on l'ouvre pour voir les
 * métiers qu'il contient et les univers qui les mobilisent. Un clic sur un
 * métier ouvre l'univers correspondant.
 */

const ICONES: Record<string, LucideIcon> = {
  chef: UtensilsCrossed,
  patissier: Cake,
  photographe: Camera,
  musicien: Music,
  dj: Disc3,
  fleuriste: Sparkles,
  officiant: HeartHandshake,
  mixologue: Wine,
  createur: Palette,
  artisan: Hammer,
  regisseur: Wrench,
  polyvalent: Users,
};

interface VendorDomainMenuProps {
  onSelectStyle: (style: WeddingStyle) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VendorDomainMenu({ onSelectStyle, open, onOpenChange }: VendorDomainMenuProps) {
  const domaines = metiersParDomaine();
  const [domaineOuvert, setDomaineOuvert] = useState<string | null>(null);

  const totalMetiers = domaines.reduce((n, d) => n + d.metiers.length, 0);
  const ouvert = domaines.find((d) => d.key === domaineOuvert) ?? null;

  const ouvrirUnivers = (styleId: string) => {
    onSelectStyle(styleById(styleId));
    onOpenChange(false);
  };

  return (
    <>
      {/* Le bouton du menu */}
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-expanded={open}
        className="group flex items-center gap-2 rounded-full border border-black/10 bg-white/95 px-4 py-1.5 text-[13px] font-semibold text-[#0B0C12] shadow-sm backdrop-blur-md transition hover:border-black/30 hover:bg-white"
      >
        <Hammer size={14} />
        <span className="tracking-wide">Métiers</span>
        <ChevronDown
          size={14}
          className={`ml-0.5 text-[var(--vp-muted)] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-0 z-[60] border-b border-black/10 bg-white/98 py-5 text-[#0B0C12] shadow-[0_25px_60px_rgba(0,0,0,0.12)] backdrop-blur-xl"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              {/* En-tête du panneau */}
              <div className="mb-4 flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-[#0B0C12]" />
                  <span className="text-[12.5px] font-bold uppercase tracking-[0.2em] text-[#0B0C12]/80">
                    {ouvert ? `Domaine · ${ouvert.label}` : `Les métiers du mariage · ${totalMetiers} rôles`}
                  </span>
                  {ouvert && (
                    <button
                      type="button"
                      onClick={() => setDomaineOuvert(null)}
                      className="ml-2 flex items-center gap-1 text-[11.5px] text-[#0B0C12]/60 underline transition hover:text-[#0B0C12]"
                    >
                      <ChevronLeft size={12} />
                      Tous les domaines
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-[#0B0C12] transition hover:bg-black/10"
                  title="Fermer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Les cartes de domaine, ou les métiers du domaine ouvert */}
              <div className="no-scrollbar max-h-[62vh] overflow-y-auto pb-2">
                {!ouvert ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {domaines.map((domaine) => {
                      const Icone = ICONES[domaine.key] ?? Users;
                      return (
                        <button
                          key={domaine.key}
                          type="button"
                          onClick={() => setDomaineOuvert(domaine.key)}
                          className="group rounded-[22px] bg-[#F7F7F8] p-4 text-left transition-all duration-300 hover:bg-white hover:shadow-lg"
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0B0C12] shadow-sm group-hover:bg-black group-hover:text-white">
                            <Icone size={16} />
                          </span>
                          <div className="mt-3 text-[14px] font-bold text-[#0B0C12]">{domaine.label}</div>
                          <div className="mt-1 text-[11.5px] leading-snug text-[#0B0C12]/55">
                            {domaine.description}
                          </div>
                          <div className="mt-3 flex items-center justify-between text-[11px] text-[#0B0C12]/50">
                            <span>{domaine.metiers.length} métiers</span>
                            <ArrowRight size={12} className="transition group-hover:translate-x-0.5" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {ouvert.metiers.map((metier) => (
                      <div key={metier.role} className="rounded-[22px] bg-[#F7F7F8] p-4">
                        <div className="text-[13.5px] font-bold text-[#0B0C12]">{metier.role}</div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {metier.universes.slice(0, 4).map((univers) => (
                            <button
                              key={`${metier.role}-${univers.id}`}
                              type="button"
                              onClick={() => ouvrirUnivers(univers.id)}
                              className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0B0C12] transition hover:border-black hover:bg-black hover:text-white"
                            >
                              {univers.name}
                            </button>
                          ))}
                          {metier.universes.length > 4 && (
                            <span className="self-center px-1 text-[11px] text-[#0B0C12]/45">
                              +{metier.universes.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-3 px-1 text-[11.5px] text-[#0B0C12]/50">
                Un métier vous ressemble ? Ouvrez l’univers qui le mobilise, puis revendiquez le rôle depuis la
                section des prestataires.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
