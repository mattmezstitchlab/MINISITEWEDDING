import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sliders, Users, HeartHandshake, Check, ArrowRight, ShieldCheck, Layers } from 'lucide-react';
import { WEDDING_STYLES, type WeddingStyle } from '../lib/weddingStyles';
import { Link } from 'react-router-dom';

export interface MixProfile {
  id: string;
  name: string;
  targetAudience: string;
  description: string;
  selectedStyle: WeddingStyle;
  icon: typeof Users;
  focusModules: string[];
}

const DEFAULT_PROFILES: Omit<MixProfile, 'selectedStyle'>[] = [
  {
    id: 'famille',
    name: 'Vue Famille & Grands-Parents',
    targetAudience: 'Parents, famille, aînés',
    description: 'Ton chaleureux, repères temporels clairs, détails des hébergements et cérémonie solennelle.',
    icon: Users,
    focusModules: ['Programme détaillé', 'Infos d’accès & parkings', 'Liste d’hôtels', 'Cérémonie laïque'],
  },
  {
    id: 'amis',
    name: 'Vue Amis & Fête',
    targetAudience: 'Témoins, amis proches, collègues',
    description: 'After secret, dress code festif, bar tab, line-up musical et photos spontanées.',
    icon: HeartHandshake,
    focusModules: ['After 02h17', 'Bar tab & Cocktails', 'Playlist collaborative', 'Cagnotte lune de miel'],
  },
  {
    id: 'officiel',
    name: 'Vue Officielle & Épurée',
    targetAudience: 'Tous les invités & prestataires',
    description: 'La référence sobre : RSVP en un clic, adresses GPS et décompte avant le Jour J.',
    icon: ShieldCheck,
    focusModules: ['RSVP instantané', 'Adresses GPS', 'Compte à rebours', 'Galerie officielle'],
  },
];

export default function ThemeMixerStudio() {
  const [profiles, setProfiles] = useState<MixProfile[]>([
    { ...DEFAULT_PROFILES[0], selectedStyle: WEDDING_STYLES.find(s => s.id === 'chateau-moderne') || WEDDING_STYLES[1] },
    { ...DEFAULT_PROFILES[1], selectedStyle: WEDDING_STYLES.find(s => s.id === 'rooftop-paris') || WEDDING_STYLES[3] },
    { ...DEFAULT_PROFILES[2], selectedStyle: WEDDING_STYLES.find(s => s.id === 'noir-blanc') || WEDDING_STYLES[0] },
  ]);

  const [activeProfileId, setActiveProfileId] = useState<string>('famille');
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const updateProfileStyle = (style: WeddingStyle) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === activeProfileId ? { ...p, selectedStyle: style } : p))
    );
  };

  return (
    <section className="relative overflow-hidden px-5 py-14 sm:px-8 sm:py-20 bg-[#0B0C12] text-white">
      {/* Lueur d'ambiance discrète */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[350px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl transition-colors duration-700"
        style={{ background: `radial-gradient(circle, ${activeProfile.selectedStyle.accent} 0%, transparent 70%)` }}
      />

      <div className="relative mx-auto max-w-5xl">
        {/* En-tête compact */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-[11px] font-semibold tracking-wider uppercase text-white/80 backdrop-blur-md">
            <Sliders size={13} className="text-[#FF4D00]" />
            Le Combinateur Super Mariage · Mix &amp; Match
          </div>

          <h2
            className="vp-title mt-3 text-white"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.1 }}
          >
            Un seul mariage.<br />
            <span className="text-white/50">Des vues ciblées selon vos invités.</span>
          </h2>

          <p className="vp-body mx-auto mt-2 max-w-lg text-[14.5px] text-white/70">
            Créez une vue sobre et rassurante pour votre famille, et une vue vibrante pour vos amis.
          </p>
        </div>

        {/* Capsule des 3 boutons (sans picto étoile, avec pictogrammes sobres) */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex flex-wrap justify-center gap-1.5 rounded-[22px] border border-white/15 bg-white/5 p-1 backdrop-blur-xl">
            {profiles.map((p) => {
              const Icon = p.icon;
              const isActive = p.id === activeProfileId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActiveProfileId(p.id)}
                  className={`flex items-center gap-2 rounded-[16px] px-4 py-2 text-[12.5px] font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-[#0B0C12] shadow-lg scale-[1.02]'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={14} />
                  <span>{p.name.replace('Vue ', '')}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Studio compact : 2 colonnes parfaitement proportionnées pour rester dans l'écran */}
        <div className="mt-8 grid gap-6 md:grid-cols-12 md:items-stretch">
          {/* Configuration gauche */}
          <div className="md:col-span-6 flex flex-col justify-between rounded-[26px] border border-white/15 bg-white/[0.05] p-5 sm:p-6 backdrop-blur-xl">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                  Cible : {activeProfile.targetAudience}
                </span>
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: activeProfile.selectedStyle.accent }}
                />
              </div>

              <h3 className="vp-title mt-1.5 text-[20px]">{activeProfile.name}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-white/70">
                {activeProfile.description}
              </p>

              {/* Modules sélectionnés */}
              <div className="mt-4 pt-3.5 border-t border-white/10">
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-white/50 mb-2">
                  Modules activés pour ce profil :
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {activeProfile.focusModules.map((m) => (
                    <div
                      key={m}
                      className="flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-[11.5px] font-medium text-white/90"
                    >
                      <Check size={12} className="text-emerald-400 shrink-0" />
                      <span className="truncate">{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sélecteur de style associé */}
              <div className="mt-4 pt-3.5 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-white/50">
                    Ambiance visuelle :
                  </span>
                  <span className="text-[12px] font-bold text-white">
                    {activeProfile.selectedStyle.name}
                  </span>
                </div>

                <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
                  {WEDDING_STYLES.map((s) => {
                    const isPicked = s.id === activeProfile.selectedStyle.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => updateProfileStyle(s)}
                        className={`group relative h-11 w-11 shrink-0 overflow-hidden rounded-[10px] ring-2 transition-all ${
                          isPicked
                            ? 'ring-white scale-105 shadow-sm'
                            : 'ring-transparent opacity-50 hover:opacity-100'
                        }`}
                        title={s.name}
                      >
                        <img
                          src={s.image}
                          alt={s.name}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11.5px] text-white/60">
                <Layers size={13} />
                <span>3 liens distincts</span>
              </div>
              <Link
                to="/creer"
                className="vp-btn vp-press !px-4 !py-2 !text-[12.5px] !bg-white !text-black hover:!bg-white/90"
              >
                Créer ce Mix <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Prévisualisation droite compacte & calibrée */}
          <div className="md:col-span-6 flex flex-col">
            <div className="relative h-full min-h-[300px] overflow-hidden rounded-[26px] border border-white/15 bg-white/[0.04] p-2.5 backdrop-blur-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProfile.id + activeProfile.selectedStyle.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                  className="relative h-full w-full overflow-hidden rounded-[20px]"
                >
                  <img
                    src={activeProfile.selectedStyle.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />

                  {/* Badge du profil */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1 backdrop-blur-md">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: activeProfile.selectedStyle.accent }}
                    />
                    <span className="text-[11px] font-semibold text-white tracking-wide">
                      {activeProfile.name}
                    </span>
                  </div>

                  {/* Contenu simulé du mini-site */}
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-white">
                    <div className="text-[9.5px] font-semibold uppercase tracking-[0.2em] text-white/70">
                      {activeProfile.selectedStyle.tagline}
                    </div>
                    <div className="vp-title mt-1 text-[24px] sm:text-[28px] leading-none">
                      Sarah &amp; Gabriel
                    </div>
                    <p className="mt-1.5 text-[12px] text-white/75 line-clamp-2">
                      {activeProfile.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {activeProfile.focusModules.map((m) => (
                        <span
                          key={m}
                          className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-md"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
