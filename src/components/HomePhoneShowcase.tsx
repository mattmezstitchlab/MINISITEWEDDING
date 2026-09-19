import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import PhoneFrame from './phone/PhoneFrame';
import GuestPhoneScreen from './phone/GuestPhoneScreen';
import CouplePhoneScreen from './phone/CouplePhoneScreen';
import VendorPhoneScreen from './phone/VendorPhoneScreen';
import { styleById } from '../lib/weddingStyles';
import { contentFor } from '../lib/universeContent';

/**
 * L'ÉCRAN DU MARIAGE
 *
 * Un seul téléphone, posé sous le hero, qui fait défiler des écrans de
 * différents univers — côté invité, côté mariés, côté prestataire. C'est le même
 * mariage vu par ceux qui le vivent : la carte de chacun décide de ce qui
 * s'affiche.
 */

type Role = 'invite' | 'maries' | 'prestataire';

const ROLE_LABELS: Record<Role, string> = {
  invite: 'Écran Invité',
  maries: 'Écran Mariés',
  prestataire: 'Écran Prestataire',
};

/** Le tour d'horizon : des univers différents, des rôles différents. */
const DEMO: Array<{ styleId: string; role: Role }> = [
  { styleId: 'traditionnel', role: 'invite' },
  { styleId: 'corse', role: 'prestataire' },
  { styleId: 'new-york', role: 'maries' },
  { styleId: 'vegas', role: 'invite' },
  { styleId: 'brutal', role: 'prestataire' },
  { styleId: 'reunion', role: 'invite' },
  { styleId: 'chateau-moderne', role: 'maries' },
  { styleId: 'club', role: 'prestataire' },
];

const STEP_MS = 5200;

export default function HomePhoneShowcase() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % DEMO.length), STEP_MS);
    return () => clearInterval(timer);
  }, []);

  const { style, content, role, caption } = useMemo(() => {
    const step = DEMO[index % DEMO.length];
    const demoStyle = styleById(step.styleId);
    const base = contentFor(demoStyle);
    return {
      style: demoStyle,
      content: {
        ...base,
        // Pas de prénoms sur l'accueil : c'est l'univers qui signe l'écran.
        couple: { ...base.couple, names: demoStyle.name },
      },
      role: step.role,
      caption: ROLE_LABELS[step.role],
    };
  }, [index]);

  return (
    <section className="relative z-20 bg-white px-5 pb-20 sm:px-8 sm:pb-28">
      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col items-center pt-16 sm:pt-20">
          <motion.div
            key={`${style.id}-${role}`}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-[272px] shrink-0 sm:w-[296px]"
          >
            <PhoneFrame tint={style.accent}>
              {role === 'invite' && <GuestPhoneScreen style={style} content={content} />}
              {role === 'maries' && <CouplePhoneScreen style={style} content={content} />}
              {role === 'prestataire' && (
                <VendorPhoneScreen style={style} content={content} mission={style.humanMissions[0]} />
              )}
            </PhoneFrame>
          </motion.div>

          {/* Ce que l'écran montre, et comment il défile */}
          <div className="mt-5 text-center">
            <div className="text-[13px] font-bold text-[#0B0C12]">
              {caption} · {style.name}
            </div>
            <div className="mt-1 text-[12px] text-[var(--vp-muted)]">
              Les écrans défilent : côté invité, côté mariés, côté prestataire, dans huit univers différents.
            </div>

            <div className="mt-3 flex items-center justify-center gap-1.5">
              {DEMO.map((item, i) => (
                <span
                  key={`${item.styleId}-${item.role}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index % DEMO.length ? 'w-5 bg-black' : 'w-1.5 bg-black/15'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
