import { motion } from 'framer-motion';
import { ArrowRight, Briefcase } from 'lucide-react';
import { type WeddingStyle } from '../lib/weddingStyles';

interface ThemeManifestoWhiteProps {
  style: WeddingStyle | null;
  onJoinClick?: () => void;
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
};

export default function ThemeManifestoWhite({ style, onJoinClick }: ThemeManifestoWhiteProps) {
  // Si sur l'accueil générale (aucun style précis sélectionné) :
  // Présentation transversale de l'orchestration des métiers VOWS sans forcer "Black & White"
  const isGlobal = !style;

  const displayTitle = isGlobal
    ? "L'orchestration des métiers d'exception"
    : `L'équipe humaine orchestrée pour ${style.name}`;

  const missionsList = isGlobal
    ? [
        'Light Designer Architectural',
        'Cinéaste Super 8mm Réel',
        'DJ Résident & Sound Engineer',
        'Chef Brasero / Chalumeau',
        'Botaniste & Paysagiste Éphémère',
        'Mixologue Bar à Bulles',
        'Affréteur Ferroviaire & Sillon Privé',
      ]
    : style.humanMissions.map((m) => m.role);

  return (
    <section className="relative bg-white py-14 px-5 sm:px-8 border-y border-black/5">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="space-y-6">
          <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#8F92A1] flex items-center justify-center gap-2">
            <Briefcase size={14} />
            <span>{displayTitle}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {missionsList.map((roleName, idx) => (
              <span
                key={idx}
                className="rounded-full border border-black/10 bg-neutral-50 px-4 py-2 text-[13px] font-medium text-neutral-800 shadow-sm"
              >
                {roleName}
              </span>
            ))}
          </div>

          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={onJoinClick}
              className="vp-btn vp-press !bg-black !text-white hover:!bg-neutral-800 !px-7 !py-3 !text-[13px] rounded-full shadow-md flex items-center gap-2"
            >
              <span>{isGlobal ? "Rejoindre l'écosystème prestataires" : "Rejoindre l'équipe de ce mariage"}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
