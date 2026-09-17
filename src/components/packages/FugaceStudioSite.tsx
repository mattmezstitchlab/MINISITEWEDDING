import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Zap, Clock, UploadCloud, QrCode, Check, ArrowRight, 
  MapPin, Play, Flame, X, Heart, Eye, Sparkles, AlertCircle, FileText
} from 'lucide-react';

interface Story {
  id: string;
  author: string;
  time: string;
  tag: string;
  image: string;
  views: number;
  likes: number;
  duration: string;
}

export default function FugaceStudioSite() {
  const [rsvpStep, setRsvpStep] = useState<'idle' | 'confirmed' | 'declined'>('idle');
  const [nameInput, setNameInput] = useState('');
  
  // Capsule Temporelle state
  const [timeLeft, setTimeLeft] = useState({ hours: 18, minutes: 42, seconds: 15 });
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([
    'IMG_3902_RAW.dng',
    'RUSH_001_ROOFTOP_4K.mov',
    'CANDID_CEREMONIE_09.jpg'
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  // Countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const stories: Story[] = [
    {
      id: '1',
      author: 'Live Content Creator',
      time: 'Il y a 14 min',
      tag: 'FIRST LOOK ROOFTOP',
      image: '/images/packages/fugace.jpg',
      views: 342,
      likes: 128,
      duration: '0:15'
    },
    {
      id: '2',
      author: 'Live Content Creator',
      time: 'Il y a 32 min',
      tag: 'MISE EN BEAUTÉ & FLASH DIRECT',
      image: '/images/table-noir.jpg',
      views: 520,
      likes: 210,
      duration: '0:22'
    },
    {
      id: '3',
      author: 'Live Content Creator',
      time: 'Il y a 1h 10m',
      tag: 'ARRIVÉE PORSCHE 1974',
      image: '/images/hero-wedding.jpg',
      views: 680,
      likes: 312,
      duration: '0:30'
    },
    {
      id: '4',
      author: 'Live Content Creator',
      time: 'Il y a 2h',
      tag: 'BACKSTAGE SCÉNO & VERRES',
      image: '/images/chateau.jpg',
      views: 410,
      likes: 189,
      duration: '0:18'
    }
  ];

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      const nextNum = uploadedFiles.length + 1;
      setUploadedFiles(prev => [`RUSH_INVITE_RAW_${nextNum}.heic`, ...prev]);
      setIsUploading(false);
    }, 800);
  };

  const schedule = [
    { time: '14:30', title: 'ACCUEIL ROOFTOP & CAFÉ GLACÉ', place: 'Terrasse 7e Ciel // Paris 10e', note: 'Flash direct et remise des badges' },
    { time: '15:15', title: 'CÉRÉMONIE ÉPURÉE 20 MINUTES CHRONO', place: 'Verrière Nord // Lumière zénithale', note: 'Zéro filtre, voeux spontanés' },
    { time: '16:00', title: 'SHOTS EXPRESS & LIVE CONTENT CAPTURE', place: 'Béton brut & Escaliers de secours', note: 'Rushs livrés en continu' },
    { time: '18:30', title: 'LE GRAND DÎNER VIBRANT', place: 'Table unique en acier 45m', note: 'Vins vivants & street food gastronomique' },
    { time: '22:00', title: 'CLUB SOUTERRAIN SANS INTERDICTION', place: 'Le Bunker Sound-system', note: 'Verrouillage de la capsule temporelle à 04:00' },
  ];

  return (
    <div className="bg-[#0B0B0C] text-[#FFFFFF] min-h-screen selection:bg-white selection:text-black" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      {/* Top Ticker */}
      <div className="border-b border-white/10 bg-[#121214] px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#A1A1AA]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-white font-semibold">LIVE CONTENT & COORDINATION JOUR J</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-[11px]">
          <span>RUSHS 4K : LIVRAISON &lt; 24H</span>
          <span>CAPSULE : {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
        </div>
        <div className="text-[11px] text-[#A1A1AA]">
          LE MONDE AIME • PACKAGE 01
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative min-h-[92vh] flex flex-col justify-end p-6 sm:p-14 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/packages/fugace.jpg"
            alt="Fugace Studio Mariage"
            className="w-full h-full object-cover filter contrast-125 brightness-90 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/40 to-black/30" />
        </div>

        <div className="relative z-10 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-black text-[11px] font-mono uppercase font-bold tracking-widest mb-4">
            <Zap size={13} /> Fugace Studio // Live Content 24h
          </div>

          <h1
            className="text-white uppercase leading-[0.92] tracking-tight font-extrabold text-[clamp(3.5rem,12vw,9rem)]"
            style={{ fontFamily: '"Syne", "Plus Jakarta Sans", sans-serif' }}
          >
            LÉON <span className="font-light text-white/50">&</span> RITA
          </h1>

          <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 border-t border-white/20">
            <div>
              <p className="text-xl sm:text-2xl font-mono text-white/90">
                12.09.2026 — ROOFTOP LE PERCHOIR, PARIS
              </p>
              <p className="text-sm text-[#A1A1AA] mt-1 font-light">
                Flash direct. 35mm grain. Captation verticale en direct. L’émotion brute sans artifice.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a href="#live-content" className="px-6 py-3.5 bg-white text-black text-xs font-mono font-bold tracking-wider uppercase hover:bg-neutral-200 transition">
                Feed Stories Live
              </a>
              <a href="#capsule" className="px-6 py-3.5 border border-white/40 text-white text-xs font-mono font-semibold tracking-wider uppercase hover:bg-white/10 transition">
                Capsule Temporelle
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* MODULE 1 : LIVE CONTENT & BACKSTAGE FEED (STORIES & TIKTOK 9:16) */}
      <section id="live-content" className="py-20 sm:py-28 px-4 sm:px-8 border-b border-white/10 bg-[#0E0E10]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-red-500 tracking-[0.25em] uppercase font-bold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>FLUX EN DIRECT // WEDDING CONTENT CREATOR</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight mt-2" style={{ fontFamily: '"Syne", sans-serif' }}>
                LIVE BACKSTAGE & RUSHS VERTICAUX
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md font-light leading-relaxed">
              Toutes les séquences et bruits de couloir capturés en direct au format 9:16 par notre créateur de contenu dédié. Livrés sous 24h en 4K non-compressée.
            </p>
          </div>

          {/* Stories Avatar Circles */}
          <div className="mt-8 flex items-center gap-4 overflow-x-auto pb-4 scrollbar-none">
            {stories.map((story) => (
              <button
                key={story.id}
                onClick={() => setActiveStory(story)}
                className="flex flex-col items-center gap-2 group shrink-0 focus:outline-none"
              >
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full p-[2.5px] bg-gradient-to-tr from-white via-neutral-400 to-white/40 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full rounded-full overflow-hidden bg-black p-[2px]">
                    <img src={story.image} alt={story.tag} className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition duration-500" />
                  </div>
                </div>
                <span className="text-[10px] font-mono text-white/80 tracking-wider uppercase max-w-[80px] truncate text-center">
                  {story.tag.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>

          {/* Stories 9:16 Video Feed Grid */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stories.map((story) => (
              <div
                key={story.id}
                onClick={() => setActiveStory(story)}
                className="group relative aspect-[9/16] rounded-2xl overflow-hidden border border-white/10 hover:border-white/40 transition cursor-pointer bg-neutral-900 shadow-xl"
              >
                <img
                  src={story.image}
                  alt={story.tag}
                  className="w-full h-full object-cover filter contrast-125 brightness-90 grayscale group-hover:grayscale-0 group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />
                
                {/* Story Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-white">
                  <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md rounded border border-white/15">
                    {story.time}
                  </span>
                  <span className="flex items-center gap-1 px-1.5 py-0.5 bg-red-600/90 rounded text-[9px] font-bold">
                    LIVE
                  </span>
                </div>

                {/* Center Play Button Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white scale-75 group-hover:scale-100 transition duration-300">
                    <Play size={20} className="ml-0.5 fill-white" />
                  </div>
                </div>

                {/* Story Bottom Metadata */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-[10px] font-mono text-white/60 uppercase tracking-wider">{story.author}</div>
                  <div className="text-xs font-bold uppercase text-white mt-0.5 leading-snug line-clamp-2">
                    {story.tag}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-white/70 pt-2 border-t border-white/10">
                    <span className="flex items-center gap-1"><Eye size={11} /> {story.views}</span>
                    <span className="flex items-center gap-1"><Heart size={11} className="text-red-400" /> {story.likes}</span>
                    <span>{story.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Fullscreen Preview Modal */}
      <AnimatePresence>
        {activeStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-sm aspect-[9/16] rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-black flex flex-col justify-between">
              {/* Top Progress bar */}
              <div className="absolute top-3 left-3 right-3 z-20 space-y-2">
                <div className="w-full bg-white/30 h-1 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 5, ease: 'linear' }} className="bg-white h-full" />
                </div>
                <div className="flex items-center justify-between text-white text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span>{activeStory.tag}</span>
                  </div>
                  <button onClick={() => setActiveStory(null)} className="p-1 hover:bg-white/20 rounded-full">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Story Content */}
              <img src={activeStory.image} alt={activeStory.tag} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

              {/* Story Bottom Details */}
              <div className="relative z-20 p-5 mt-auto">
                <div className="text-[11px] font-mono text-[#A1A1AA] uppercase">{activeStory.author} • {activeStory.time}</div>
                <div className="text-base font-bold text-white uppercase mt-1">{activeStory.tag}</div>
                <p className="text-xs text-white/80 font-light mt-1">Capture spontanée 4K livrée sans filtre. Disponible pour téléchargement direct.</p>
                <div className="mt-4 flex items-center gap-2">
                  <button className="flex-1 py-2.5 rounded-full bg-white text-black text-xs font-mono font-bold uppercase hover:bg-neutral-200">
                    Sauvegarder le clip
                  </button>
                  <button onClick={() => setActiveStory(null)} className="px-4 py-2.5 rounded-full bg-white/20 text-white text-xs font-mono">
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODULE 2 : CAPSULE TEMPORELLE & DROPZONE INVITES SANS DÉGRADATION */}
      <section id="capsule" className="py-24 sm:py-36 px-4 sm:px-8 border-b border-white/10 bg-[#0B0B0C]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-white/70 font-bold">
              ARCHIVAGE PARTICIPATIF BRUT
            </span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold uppercase tracking-tight" style={{ fontFamily: '"Syne", sans-serif' }}>
              LA CAPSULE TEMPORELLE
            </h2>
            <p className="mt-4 text-[#A1A1AA] text-sm sm:text-base font-light leading-relaxed">
              Scannez le QR Code ou déposez vos vidéos et photos instantanées. Les fichiers sont stockés en qualité native originale sans aucune compression WhatsApp.
            </p>
          </div>

          {/* Countdown Locking Clock */}
          <div className="p-8 sm:p-10 rounded-2xl bg-[#121215] border border-white/15 max-w-3xl mx-auto text-center mb-12 shadow-2xl">
            <div className="text-xs font-mono uppercase tracking-widest text-[#A1A1AA] flex items-center justify-center gap-2 mb-4">
              <Clock size={15} className="text-red-500" />
              <span>COMPTE À REBOURS AVANT VERROUILLAGE DÉFINITIF DE LA CAPSULE</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="p-4 bg-black/60 rounded-xl border border-white/10">
                <div className="text-4xl sm:text-5xl font-mono font-bold text-white tabular-nums">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <div className="text-[10px] font-mono text-[#A1A1AA] mt-1 uppercase">Heures</div>
              </div>
              <div className="p-4 bg-black/60 rounded-xl border border-white/10">
                <div className="text-4xl sm:text-5xl font-mono font-bold text-white tabular-nums">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <div className="text-[10px] font-mono text-[#A1A1AA] mt-1 uppercase">Minutes</div>
              </div>
              <div className="p-4 bg-black/60 rounded-xl border border-white/10">
                <div className="text-4xl sm:text-5xl font-mono font-bold text-red-500 tabular-nums">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="text-[10px] font-mono text-[#A1A1AA] mt-1 uppercase">Secondes</div>
              </div>
            </div>

            <div className="mt-6 text-xs text-[#A1A1AA] font-light flex items-center justify-center gap-2">
              <AlertCircle size={14} className="text-[#A1A1AA]" />
              Après ce délai, la capsule est scellée et gravée sur disque d'or pour Léon & Rita.
            </div>
          </div>

          {/* Dropzone & QR Code Grid */}
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* QR Code Card */}
            <div className="p-8 rounded-2xl bg-[#121215] border border-white/10 flex flex-col items-center justify-between text-center">
              <div>
                <span className="text-xs font-mono uppercase text-[#A1A1AA] tracking-widest">ACCÈS DIRECT MOBILE</span>
                <h3 className="text-xl font-bold uppercase mt-2">SCANNER LE QR CODE</h3>
                <p className="text-xs text-[#A1A1AA] mt-2 font-light">
                  Scannez depuis votre appareil photo pour envoyer vos rushs sans installer d'application.
                </p>
              </div>

              {/* Stylized QR Code Graphic */}
              <div className="my-6 p-4 bg-white rounded-xl shadow-2xl flex items-center justify-center">
                <QrCode size={160} className="text-black" />
              </div>

              <div className="text-xs font-mono text-white/60">
                URL : byaime.fr/c/leon-rita-raw
              </div>
            </div>

            {/* Direct Web Dropzone */}
            <div className="p-8 rounded-2xl bg-[#121215] border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-[#A1A1AA] tracking-widest">UPLOAD IMMÉDIAT WEB</span>
                <h3 className="text-xl font-bold uppercase mt-2">DÉPOSEZ VOS RUSHS BRUTS</h3>
                <p className="text-xs text-[#A1A1AA] mt-2 font-light">
                  Formats acceptés : HEIC, RAW, DNG, MOV, MP4 jusqu'à 4K.
                </p>
              </div>

              {/* Upload Drop Area */}
              <div
                onClick={handleSimulateUpload}
                className="my-6 p-8 border-2 border-dashed border-white/20 hover:border-white transition rounded-xl text-center cursor-pointer bg-black/40 group"
              >
                <UploadCloud size={40} className="mx-auto text-white/60 group-hover:text-white transition group-hover:scale-110 duration-300" />
                <div className="mt-3 text-sm font-mono font-bold uppercase text-white">
                  {isUploading ? 'Transfert 4K en cours...' : 'Glisser ou cliquer pour uploader'}
                </div>
                <div className="text-xs text-[#A1A1AA] mt-1 font-mono">
                  {isUploading ? 'Transmission chiffrée vers le serveur de production' : 'Zéro compression d’image garantie'}
                </div>
              </div>

              {/* Recent Uploads List */}
              <div className="space-y-2 border-t border-white/10 pt-4">
                <div className="text-[11px] font-mono text-[#A1A1AA] uppercase flex items-center justify-between">
                  <span>Derniers dépôts ({uploadedFiles.length})</span>
                  <span className="text-emerald-400">● 100% RAW</span>
                </div>
                <div className="space-y-1.5 max-h-24 overflow-y-auto font-mono text-xs text-white/80">
                  {uploadedFiles.map((file, i) => (
                    <div key={i} className="flex items-center justify-between px-2.5 py-1.5 bg-black/40 rounded border border-white/5">
                      <span className="truncate max-w-[200px]">{file}</span>
                      <span className="text-[10px] text-white/50">OK</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rétroplanning Jour J minute par minute */}
      <section className="py-24 sm:py-36 px-4 sm:px-8 border-b border-white/10 bg-[#0B0B0C]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end justify-between border-b border-white/20 pb-4 mb-12">
            <div>
              <span className="text-xs font-mono uppercase text-[#A1A1AA] tracking-widest">TIMELINE HORLOGÈRE</span>
              <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight mt-1" style={{ fontFamily: '"Syne", sans-serif' }}>
                RÉTROPLANNING MINUTE PAR MINUTE
              </h2>
            </div>
            <span className="text-xs font-mono text-[#A1A1AA] hidden sm:inline">CADENCE : STRICTE</span>
          </div>

          <div className="space-y-4">
            {schedule.map((item, index) => (
              <div
                key={item.time}
                className="grid md:grid-cols-[110px_1fr_220px] items-start p-6 bg-[#121214] border border-white/10 hover:border-white transition"
              >
                <div className="text-2xl font-mono font-bold text-white">
                  {item.time}
                </div>
                <div>
                  <h3 className="text-base font-bold uppercase tracking-wider text-white">{item.title}</h3>
                  <p className="text-xs text-[#A1A1AA] mt-1 font-mono">{item.note}</p>
                </div>
                <div className="text-xs font-mono text-[#A1A1AA] md:text-right mt-2 md:mt-0 flex items-center md:justify-end gap-1">
                  <MapPin size={12} />
                  <span>{item.place}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP Express en 2 Clics */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 bg-[#0E0E10]">
        <div className="max-w-xl mx-auto p-8 sm:p-12 border border-white/20 bg-[#121215] text-center">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#A1A1AA]">RSVP EXPRESS 2 CLICS</span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold uppercase tracking-tight" style={{ fontFamily: '"Syne", sans-serif' }}>
            VOTRE PRÉSENCE
          </h2>
          <p className="mt-2 text-xs text-[#A1A1AA] font-mono">Réponse instantanée exigée avant le 01 Août.</p>

          {rsvpStep === 'idle' ? (
            <div className="mt-8 space-y-4">
              <input
                type="text"
                placeholder="VOTRE NOM & PRÉNOM"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-4 py-3 bg-[#0B0B0C] border border-white/20 text-xs font-mono uppercase text-white placeholder-neutral-600 outline-none focus:border-white"
              />
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => nameInput && setRsvpStep('confirmed')}
                  disabled={!nameInput}
                  className="py-3.5 bg-white text-black text-xs font-mono font-bold uppercase hover:bg-neutral-200 transition disabled:opacity-40"
                >
                  JE CONFIRME (OUI)
                </button>
                <button
                  onClick={() => nameInput && setRsvpStep('declined')}
                  disabled={!nameInput}
                  className="py-3.5 border border-white/30 text-white text-xs font-mono uppercase hover:bg-white/10 transition disabled:opacity-40"
                >
                  JE DÉCLINE
                </button>
              </div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 p-6 bg-white text-black text-center">
              <Check size={28} className="mx-auto text-black" />
              <div className="text-sm font-mono font-bold mt-2 uppercase">
                {rsvpStep === 'confirmed' ? 'RÉPONSE ENREGISTRÉE : PRÉSENT' : 'ABSENCE BIEN NOTÉE'}
              </div>
              <p className="text-xs font-mono text-neutral-600 mt-1">Merci {nameInput}. Votre badge VIP est généré.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-xs font-mono uppercase text-[#A1A1AA] border-t border-white/10 bg-[#0B0B0C]">
        LÉON & RITA — 12.09.2026 // DIRECTION : FUGACE STUDIO PAR LE MONDE AIME
      </footer>
    </div>
  );
}
