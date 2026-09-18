import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Video,
  Image as ImageIcon,
  Heart,
  MoreHorizontal,
  Radio,
  MapPin,
  Clock,
  Shield,
  FileText,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Share2,
  Sliders,
  Send,
  Download,
  Flame,
  Check,
} from 'lucide-react';
import { type TimelineTrackItem, type ViewerPerspective } from '../lib/timelineTheaterEngine';

interface UniversalInteractiveCardViewerProps {
  item: TimelineTrackItem;
  perspective: ViewerPerspective;
  onClose?: () => void;
  onUpdateNote?: (note: string) => void;
}

export default function UniversalInteractiveCardViewer({
  item,
  perspective,
  onClose,
  onUpdateNote,
}: UniversalInteractiveCardViewerProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState<'photo' | 'video' | 'gallery'>('photo');
  const [isLiked, setIsLiked] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [activeCenterTab, setActiveCenterTab] = useState<'info' | 'audio' | 'docs' | 'talkie'>('info');
  
  // Note / Repère éditable directement sur la carte sans passer par une page profil !
  const [noteText, setNoteText] = useState(item.coupleNote || '');
  const [isSaved, setIsSaved] = useState(false);
  const [currentGalleryIdx, setCurrentGalleryIdx] = useState(0);

  const galleryImages = [
    item.mediaUrl || '/images/noir-blanc.jpg',
    '/images/chateau.jpg',
    '/images/table-noir.jpg',
  ];

  const handleSaveNote = () => {
    setIsSaved(true);
    onUpdateNote?.(noteText);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const authorizedDocs = item.attachedDocs.filter((doc) =>
    doc.accessLevels.includes(perspective)
  );

  return (
    <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[32px] bg-[#0E0F16]/98 border border-white/20 shadow-[0_25px_70px_rgba(0,0,0,0.85)] text-white backdrop-blur-3xl">
      
      {/* 1. EN-TÊTE DE LA CARTE : PSEUDO, HORAIRE, MAP, LIKES & ACTIONS "..." */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.03]">
        {/* Identité / Pseudo & Rôle */}
        <div className="flex items-center gap-2.5">
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-white/30 bg-black">
            <img
              src="/images/couple-paris.jpg"
              alt="Avatar"
              className="h-full w-full object-cover"
            />
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 ring-1 ring-black" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[13px] text-white tracking-tight">
                {item.alignedRole || 'Sarah & Gabriel'}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded-full border border-emerald-500/30">
                Certifié
              </span>
            </div>
            <div className="text-[10.5px] font-mono text-white/50 flex items-center gap-2">
              <span className="flex items-center gap-0.5"><Clock size={10} /> {item.startTime}</span>
              <span>•</span>
              <span className="flex items-center gap-0.5"><MapPin size={10} /> Paris 7e (32 km)</span>
            </div>
          </div>
        </div>

        {/* Boutons d'interaction : Talkie direct, Like Coeur, Bouton "..." */}
        <div className="flex items-center gap-1.5">
          {/* Témoin Talkie-Walkie PTT */}
          <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[9.5px] font-mono text-emerald-400 font-bold">
            <Radio size={10} className="animate-pulse" />
            <span className="hidden sm:inline">Canal #1</span>
          </div>

          {/* Bouton Like / Favori */}
          <button
            type="button"
            onClick={() => setIsLiked(!isLiked)}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
              isLiked ? 'bg-rose-500/20 text-rose-500' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <Heart size={14} className={isLiked ? 'fill-rose-500' : ''} />
          </button>

          {/* Menu d'actions "..." */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMoreActions(!showMoreActions)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 transition"
              title="Options"
            >
              <MoreHorizontal size={14} />
            </button>

            {/* Menu Popover "..." */}
            <AnimatePresence>
              {showMoreActions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 5 }}
                  className="absolute right-0 top-10 z-30 w-48 rounded-[18px] bg-[#161722] border border-white/15 p-2 shadow-2xl text-[11.5px]"
                >
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      setShowMoreActions(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-[10px] px-2.5 py-1.5 text-white/80 hover:bg-white/10 transition"
                  >
                    <Share2 size={12} />
                    <span>Partager ce repère</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCenterTab('docs');
                      setShowMoreActions(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-[10px] px-2.5 py-1.5 text-white/80 hover:bg-white/10 transition"
                  >
                    <FileText size={12} />
                    <span>Consulter les pièces</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 2. ZONE VISUELLE : PHOTO / VIDÉO APERÇU / GALERIE COMMUTABLE */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
        {/* Bascule Médias Photo / Vidéo / Galerie */}
        <div className="absolute top-3 left-3 z-20 flex rounded-full bg-black/60 p-1 backdrop-blur-md border border-white/15 text-[10px]">
          <button
            type="button"
            onClick={() => setActiveMediaTab('photo')}
            className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 font-bold transition ${
              activeMediaTab === 'photo' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            <ImageIcon size={11} />
            <span>Photo</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMediaTab('video')}
            className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 font-bold transition ${
              activeMediaTab === 'video' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            <Video size={11} />
            <span>Vidéo</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMediaTab('gallery')}
            className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 font-bold transition ${
              activeMediaTab === 'gallery' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            <span>Galerie (3)</span>
          </button>
        </div>

        {/* Affichage du média selon le mode */}
        {activeMediaTab === 'photo' && (
          <img
            src={item.mediaUrl || '/images/noir-blanc.jpg'}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        )}

        {activeMediaTab === 'video' && (
          <div className="relative h-full w-full flex items-center justify-center bg-neutral-900">
            <img
              src={item.mediaUrl || '/images/noir-blanc.jpg'}
              alt={item.title}
              className="h-full w-full object-cover opacity-60"
            />
            <div className="absolute flex flex-col items-center gap-2">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-2xl hover:scale-105 transition cursor-pointer">
                <Play size={18} className="ml-0.5" />
              </span>
              <span className="rounded-full bg-black/70 px-2.5 py-0.5 text-[10px] font-mono text-white/90">
                Aperçu 4K · 0:45
              </span>
            </div>
          </div>
        )}

        {activeMediaTab === 'gallery' && (
          <div className="relative h-full w-full">
            <img
              src={galleryImages[currentGalleryIdx]}
              alt="Galerie"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => setCurrentGalleryIdx((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={() => setCurrentGalleryIdx((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0F16] via-transparent to-transparent pointer-events-none" />

        {/* Titre & Sous-titre incrustés */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
              {item.chapter}
            </span>
            <h3 className="vp-title text-[20px] font-bold text-white leading-tight">
              {item.title}
            </h3>
            <p className="text-[11.5px] text-white/70 truncate max-w-sm">
              {item.subtitle}
            </p>
          </div>

          <div className="shrink-0 text-right font-mono text-[11px] text-white/80 bg-black/60 px-2.5 py-1 rounded-full border border-white/10">
            {item.durationMinutes} min
          </div>
        </div>
      </div>

      {/* 3. CENTRE DE LA CARTE : ONGLETS MODULAIRES (INFO & REPÈRE / AUDIO LIVE / DOCS SCELLÉS / TALKIE) */}
      <div className="p-4 space-y-3">
        {/* Barre des 4 onglets internes de la carte */}
        <div className="flex rounded-full bg-white/5 p-1 border border-white/10 text-[11px]">
          <button
            type="button"
            onClick={() => setActiveCenterTab('info')}
            className={`flex-1 py-1 rounded-full text-center font-bold transition ${
              activeCenterTab === 'info' ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white'
            }`}
          >
            Repère &amp; Note
          </button>
          <button
            type="button"
            onClick={() => setActiveCenterTab('audio')}
            className={`flex-1 py-1 rounded-full text-center font-bold transition ${
              activeCenterTab === 'audio' ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white'
            }`}
          >
            Audio (Morceau)
          </button>
          <button
            type="button"
            onClick={() => setActiveCenterTab('docs')}
            className={`flex-1 py-1 rounded-full text-center font-bold transition flex items-center justify-center gap-1 ${
              activeCenterTab === 'docs' ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white'
            }`}
          >
            <span>Docs</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </button>
          <button
            type="button"
            onClick={() => setActiveCenterTab('talkie')}
            className={`flex-1 py-1 rounded-full text-center font-bold transition ${
              activeCenterTab === 'talkie' ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white'
            }`}
          >
            Talkie Régie
          </button>
        </div>

        {/* CONTENU DU CENTRE SELON L'ONGLET SÉLECTIONNÉ */}
        
        {/* Onglet A : Repère Mariés & Validation sans page profil */}
        {activeCenterTab === 'info' && (
          <div className="rounded-[20px] bg-white/[0.04] border border-white/10 p-3 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-white/50">
                Consigne &amp; Repère des Mariés (Édition directe)
              </span>
              {isSaved && (
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <Check size={11} /> Enregistré
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Ajouter une instruction précise pour la régie..."
                className="w-full rounded-[12px] bg-black/40 border border-white/10 px-3 py-1.5 text-[12px] text-white placeholder-white/30 focus:outline-none focus:border-white/30"
              />
              <button
                type="button"
                onClick={handleSaveNote}
                className="shrink-0 rounded-[12px] bg-white px-3 py-1.5 text-[11px] font-bold text-black hover:bg-neutral-200 transition"
              >
                Poser
              </button>
            </div>

            <div className="text-[10.5px] font-mono text-white/50 pt-1 flex items-center justify-between">
              <span>Technique : {item.vendorConfirmation?.technicalRequirements || 'Matériel calé'}</span>
              <span className="text-emerald-400">Zéro harcèlement</span>
            </div>
          </div>
        )}

        {/* Onglet B : Morceau audio musical complet synchronisé */}
        {activeCenterTab === 'audio' && (
          <div className="rounded-[20px] bg-black/60 border border-white/10 p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black hover:scale-105 transition shadow-lg shrink-0"
              >
                {isPlayingAudio ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
              </button>

              <div>
                <div className="text-[12.5px] font-bold text-white">
                  {item.title} · Bande-Son Scénarisée
                </div>
                <div className="text-[10.5px] font-mono text-white/50">
                  Spotify Link &amp; Master 48kHz · BPM {item.targetBpm || 104}
                </div>
              </div>
            </div>

            <span className="text-[10.5px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Live
            </span>
          </div>
        )}

        {/* Onglet C : Coffre-Fort Documentaire scellé (Devis, factures, contrats) */}
        {activeCenterTab === 'docs' && (
          <div className="rounded-[20px] bg-black/60 border border-white/10 p-3 space-y-2 text-left">
            <div className="flex items-center justify-between text-[11px] font-mono text-white/50">
              <span>Fichiers scellés pour ce moment</span>
              <span>{authorizedDocs.length} pièce(s)</span>
            </div>

            {authorizedDocs.length === 0 ? (
              <div className="text-[11.5px] text-white/40 py-2 text-center">
                Aucun document n'est public pour votre profil ({perspective}).
              </div>
            ) : (
              <div className="space-y-1.5">
                {authorizedDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-[12px] bg-white/[0.05] border border-white/10 px-3 py-2 text-[11.5px]"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText size={13} className="text-white/60 shrink-0" />
                      <span className="font-medium text-white truncate">{doc.name}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[9.5px] font-mono text-white/40">{doc.fileSize}</span>
                      <span className="rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-mono">
                        {doc.status === 'regle' ? 'Réglé' : 'Scellé'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Onglet D : Talkie-Walkie WebRTC PTT */}
        {activeCenterTab === 'talkie' && (
          <div className="rounded-[20px] bg-blue-950/20 border border-blue-500/20 p-3 text-left flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                <Radio size={14} />
              </span>
              <div>
                <div className="text-[12px] font-bold text-white">Canal Audio Direct : Régie &amp; Témoins</div>
                <div className="text-[10px] font-mono text-blue-300/70">Chiffré WebRTC · PTT actif</div>
              </div>
            </div>

            <button
              type="button"
              className="rounded-full bg-blue-500 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-blue-600 transition shadow-md"
            >
              Parler
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
