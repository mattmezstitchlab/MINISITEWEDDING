import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, UserCheck, Send, X, Briefcase } from 'lucide-react';
import { WEDDING_STYLES, type WeddingStyle } from '../lib/weddingStyles';
import {
  getScenesForStyle,
  type ThemeTimelineScene,
  type VendorRoleCandidate,
} from '../lib/themeTimelineScenarios';

interface ImmersiveThemesProps {
  currentStyle: WeddingStyle | null;
  onOpenVendorApplication?: () => void;
  onSelectStyle?: (style: WeddingStyle) => void;
}

interface VendorModalState {
  isOpen: boolean;
  role: VendorRoleCandidate | null;
  sceneTitle: string;
  time: string;
}

function ParallaxSceneBlock({
  scene,
  styleName,
  index,
  total,
  onOpenVendorProposal,
}: {
  scene: ThemeTimelineScene;
  styleName?: string;
  index: number;
  total: number;
  onOpenVendorProposal: (role: VendorRoleCandidate, sceneTitle: string, time: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-7%', '7%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.02, 1.08]);

  return (
    <div
      ref={ref}
      className="group relative h-[88svh] min-h-[580px] w-full overflow-hidden bg-black flex flex-col justify-between p-6 sm:p-10 lg:p-14"
    >
      {/* Vrai visuel photographique du moment précis */}
      <motion.div style={{ y, scale }} className="absolute inset-0 -inset-y-[10%] z-0">
        <img
          src={scene.image}
          alt={scene.title}
          className="h-[120%] w-full object-cover"
          loading="lazy"
        />
        {/* Dégradé cinématique sombre sans bruit pour une lisibilité parfaite */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.52) 50%, rgba(0,0,0,0.25) 100%)',
          }}
        />
      </motion.div>

      {/* Barre supérieure épurée : Timecode uniquement, titres relevés en hauteur */}
      <div className="relative z-10 flex items-start justify-between border-b border-white/10 pb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="font-mono rounded-full bg-white/15 px-3 py-1 text-[13px] font-bold tracking-wider text-white backdrop-blur-md">
              {scene.time}
            </span>
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/50">
              {styleName ? `${styleName} · ` : ''}Instant 0{index + 1} / 0{total}
            </span>
          </div>
          <h3
            className="vp-title select-none text-white leading-none tracking-tight pt-1 drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]"
            style={{ fontSize: 'clamp(2rem, 4.8vw, 3.8rem)' }}
          >
            {scene.title}
          </h3>
        </div>
      </div>

      {/* Centre/Bas : Script vivant et prestataires missionnés */}
      <div className="relative z-10 max-w-3xl space-y-4">
        <p className="text-[17px] sm:text-[20px] font-medium leading-relaxed text-white/95 drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
          « {scene.narrativeScript} »
        </p>

        {/* Détail d'ambiance */}
        <div className="text-[13px] text-white/60 italic pb-1">
          {scene.ambianceDetail}
        </div>

        {/* Prestataires missionnés pour cet instant */}
        {scene.vendorRoles && scene.vendorRoles.length > 0 && (
          <div className="pt-3 border-t border-white/15">
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/50 mb-2.5 flex items-center gap-2">
              <Briefcase size={13} />
              <span>Prestataires mobilisés pour cet instant :</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {scene.vendorRoles.map((vr, vrIdx) => (
                <div key={vrIdx} className="inline-flex items-center">
                  {vr.status === 'filled' ? (
                    <div className="flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[12px] font-medium text-white/90 backdrop-blur-md">
                      <UserCheck size={13} className="text-emerald-400" />
                      <span>{vr.role}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenVendorProposal(vr, scene.title, scene.time)}
                      className="group/btn flex items-center gap-1.5 rounded-full bg-white/20 border border-white/30 px-3 py-1 text-[12px] font-medium text-white hover:bg-white hover:text-black transition shadow-lg backdrop-blur-md"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <span>{vr.role}</span>
                      <span className="text-white/70 group-hover/btn:text-black/70">· Se proposer</span>
                      <ArrowRight size={11} className="opacity-70 group-hover/btn:opacity-100" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ImmersiveThemes({
  currentStyle,
  onOpenVendorApplication,
  onSelectStyle,
}: ImmersiveThemesProps) {
  // Si aucun thème sélectionné (page générale d'atterrissage) :
  // On affiche un florilège représentatif des univers et moments comme avant !
  const isGlobalLanding = !currentStyle;

  const scenesWithStyle: Array<{ scene: ThemeTimelineScene; styleName: string }> = isGlobalLanding
    ? [
        { scene: getScenesForStyle('noir-blanc')[0], styleName: 'Black & White' },
        { scene: getScenesForStyle('desert')[0], styleName: 'Desert Motel' },
        { scene: getScenesForStyle('brutal')[0], styleName: 'Béton Brut' },
        { scene: getScenesForStyle('chateau-moderne')[1], styleName: 'Château Moderne' },
        { scene: getScenesForStyle('club')[1], styleName: 'Club Amour' },
        { scene: getScenesForStyle('supermarche')[0], styleName: 'Supermarché 22h' },
      ]
    : getScenesForStyle(currentStyle.id).map((sc) => ({
        scene: sc,
        styleName: currentStyle.name,
      }));

  // État de la modale de proposition prestataire
  const [modalState, setModalState] = useState<VendorModalState>({
    isOpen: false,
    role: null,
    sceneTitle: '',
    time: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const [vendorEmail, setVendorEmail] = useState('');
  const [vendorInstagram, setVendorInstagram] = useState('');
  const [vendorNote, setVendorNote] = useState('');

  const openProposalModal = (role: VendorRoleCandidate, sceneTitle: string, time: string) => {
    setModalState({
      isOpen: true,
      role,
      sceneTitle,
      time,
    });
    setFormSubmitted(false);
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
    setFormSubmitted(false);
  };

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      closeModal();
    }, 2400);
  };

  return (
    <section id="styles-immersive" className="relative bg-[#07070A] py-14 sm:py-24">
      {/* En-tête épuré */}
      <div className="mx-auto max-w-6xl px-5 pb-10 sm:px-8 sm:pb-14">
        <div className="flex flex-col gap-3">
          <span className="text-[11.5px] font-bold uppercase tracking-[0.2em] text-white/40">
            {isGlobalLanding
              ? 'La Chronologie Vivante de vos Moments'
              : `Chronologie Scénarisée · Univers ${currentStyle.name}`}
          </span>
          <h2 className="vp-title text-white" style={{ fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', lineHeight: 1.05 }}>
            Votre Jour J minute par minute.<br />
            <span className="text-white/40">Visuels réels. Prestataires synchronisés.</span>
          </h2>
        </div>
      </div>

      {/* Pile verticale des scènes */}
      <div className="flex flex-col gap-8 px-3 sm:gap-12 sm:px-6">
        {scenesWithStyle.map(({ scene, styleName }, scIdx) => (
          <div
            key={`${styleName}-${scene.time}-${scIdx}`}
            className="overflow-hidden rounded-[32px] sm:rounded-[44px] shadow-2xl"
          >
            <ParallaxSceneBlock
              scene={scene}
              styleName={isGlobalLanding ? styleName : undefined}
              index={scIdx}
              total={scenesWithStyle.length}
              onOpenVendorProposal={openProposalModal}
            />
          </div>
        ))}
      </div>

      {/* MODALE ÉPURÉE : SE PROPOSER EN TANT QUE PRESTATAIRE */}
      <AnimatePresence>
        {modalState.isOpen && modalState.role && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg rounded-[28px] border border-white/15 bg-[#12131A] p-6 sm:p-8 text-white shadow-2xl"
            >
              <button
                type="button"
                onClick={closeModal}
                className="absolute right-5 top-5 text-white/50 hover:text-white transition"
              >
                <X size={20} />
              </button>

              {!formSubmitted ? (
                <form onSubmit={handleProposalSubmit} className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 border border-amber-400/30 px-3 py-1 text-[11px] font-semibold text-amber-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    Candidature Prestataire · {modalState.time}
                  </div>

                  <h3 className="text-[24px] font-bold text-white tracking-tight">
                    Se proposer pour : {modalState.role.role}
                  </h3>

                  <div className="rounded-[18px] bg-white/[0.04] p-3.5 border border-white/10 text-[13px] text-white/80 space-y-1">
                    <div><strong>Moment :</strong> {modalState.sceneTitle}</div>
                    <div><strong>Mission :</strong> {modalState.role.mission}</div>
                    {modalState.role.compensationHint && (
                      <div className="text-emerald-400"><strong>Modalité :</strong> {modalState.role.compensationHint}</div>
                    )}
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-[12px] font-medium text-white/70 block mb-1">
                        Votre Nom / Studio / Marque *
                      </label>
                      <input
                        type="text"
                        required
                        value={vendorName}
                        onChange={(e) => setVendorName(e.target.value)}
                        placeholder="Ex: Studio Nova / Clara B."
                        className="w-full rounded-[14px] border border-white/15 bg-white/5 px-4 py-2.5 text-[14px] text-white placeholder-white/30 focus:border-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[12px] font-medium text-white/70 block mb-1">
                          Email professionnel *
                        </label>
                        <input
                          type="email"
                          required
                          value={vendorEmail}
                          onChange={(e) => setVendorEmail(e.target.value)}
                          placeholder="contact@studio.com"
                          className="w-full rounded-[14px] border border-white/15 bg-white/5 px-4 py-2.5 text-[14px] text-white placeholder-white/30 focus:border-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[12px] font-medium text-white/70 block mb-1">
                          Lien Portfolio / Instagram
                        </label>
                        <input
                          type="text"
                          value={vendorInstagram}
                          onChange={(e) => setVendorInstagram(e.target.value)}
                          placeholder="@monstudio ou https://"
                          className="w-full rounded-[14px] border border-white/15 bg-white/5 px-4 py-2.5 text-[14px] text-white placeholder-white/30 focus:border-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[12px] font-medium text-white/70 block mb-1">
                        Une phrase sur votre approche pour cet instant
                      </label>
                      <textarea
                        rows={2}
                        value={vendorNote}
                        onChange={(e) => setVendorNote(e.target.value)}
                        placeholder="Matériel disponible, expérience similaire, disponibilité..."
                        className="w-full rounded-[14px] border border-white/15 bg-white/5 px-4 py-2 text-[13px] text-white placeholder-white/30 focus:border-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-[13px] text-white/70 hover:text-white"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="vp-btn vp-press !bg-white !text-black hover:!bg-white/90 !px-6 !py-2.5 !text-[13px] rounded-full flex items-center gap-2 shadow-xl"
                    >
                      <Send size={13} />
                      <span>Transmettre ma candidature</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-8 text-center space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 size={30} />
                  </div>
                  <h4 className="text-[20px] font-bold text-white">Candidature transmise avec succès !</h4>
                  <p className="text-[14px] text-white/70 max-w-sm mx-auto">
                    Votre profil a été relié à ce moment ({modalState.sceneTitle}). Les mariés et l'organisateur vous contacteront directement.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
