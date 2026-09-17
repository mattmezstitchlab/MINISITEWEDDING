import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ShieldCheck, CheckCircle2, XCircle, ArrowUpRight, 
  Upload, HelpCircle, Glasses, Shirt, Tag, ChevronRight, Check
} from 'lucide-react';

interface StyleRef {
  id: string;
  category: 'femme' | 'homme' | 'accessoire';
  title: string;
  designer: string;
  desc: string;
  image: string;
  badge: string;
}

export default function IrreverenceSite() {
  const [styleFilter, setStyleFilter] = useState<'all' | 'femme' | 'homme' | 'accessoire'>('all');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Conciergerie Style State
  const [guestName, setGuestName] = useState('');
  const [outfitDesc, setOutfitDesc] = useState('');
  const [outfitCategory, setOutfitCategory] = useState('Smoking / Tailleur');
  const [validationStatus, setValidationStatus] = useState<'idle' | 'analyzing' | 'approved'>('idle');

  const paletteAutorisee = [
    { name: 'Rouge Carmin Radical', hex: '#E11D48', note: 'La signature chromatique de la soirée' },
    { name: 'Noir Smoking Obscur', hex: '#09090B', note: 'Coupes acérées, tombés impeccables' },
    { name: 'Chrome & Argent Liquide', hex: '#E4E4E7', note: 'Bijoux massifs, reflets métalliques' },
    { name: 'Blanc Sculptural', hex: '#FFFFFF', note: 'Volume architectural uniquement' },
  ];

  const paletteInterdite = [
    { name: 'Beige Terne / Lin Bohème', hex: '#D2B48C', reason: 'Trop sage, formellement banni' },
    { name: 'Rose Bonbon / Pastel Mielleux', hex: '#F9A8D4', reason: 'Incompatible avec l’énergie' },
    { name: 'Bleu Marine Conventionnel', hex: '#1E3A8A', reason: 'Rappel de bureau d’affaires' },
  ];

  const references: StyleRef[] = [
    {
      id: '1',
      category: 'femme',
      title: 'Fourreau Asymétrique & Gants Longs',
      designer: 'Inspiration Rick Owens & Mugler',
      desc: 'Matière seconde peau, tombé fluide, décolleté géométrique tranché net.',
      image: '/images/packages/irreverence.jpg',
      badge: 'SILHOUETTE 01'
    },
    {
      id: '2',
      category: 'homme',
      title: 'Smoking Déstructuré Sans Chemise',
      designer: 'Inspiration Saint Laurent & Peter Do',
      desc: 'Revers en satin brut, coupe ample, plastron nu ou chaîne d’argent oversize.',
      image: '/images/table-noir.jpg',
      badge: 'SILHOUETTE 02'
    },
    {
      id: '3',
      category: 'accessoire',
      title: 'Lunettes Noires Architecturales',
      designer: 'Inspiration Balenciaga',
      desc: 'Portées obligatoires même au dîner sous les néons et stroboscopes.',
      image: '/images/hero-wedding.jpg',
      badge: 'ACCESSOIRE PHARE'
    },
    {
      id: '4',
      category: 'femme',
      title: 'Tailleur Pantalon Évasé Rouge Sang',
      designer: 'Inspiration Alexander McQueen',
      desc: 'Épaulettes monumentales, taille cintrée, provocation élégante.',
      image: '/images/packages/fugace.jpg',
      badge: 'SILHOUETTE 03'
    }
  ];

  const filteredRefs = styleFilter === 'all' 
    ? references 
    : references.filter(r => r.category === styleFilter);

  const handleValidateOutfit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !outfitDesc) return;
    setValidationStatus('analyzing');
    setTimeout(() => {
      setValidationStatus('approved');
    }, 1200);
  };

  return (
    <div className="bg-[#0A0A0C] text-[#FAF8F5] min-h-screen selection:bg-[#E11D48] selection:text-white" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      {/* Top Banner */}
      <div className="border-b border-white/10 bg-[#0E0E12] px-4 sm:px-8 py-3 flex items-center justify-between text-xs tracking-[0.25em] uppercase font-semibold text-[#A1A1AA]">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-[#E11D48]" />
          <span className="text-[#FAF8F5]">IRRÉVÉRENCE // DIRECTION ARTISTIQUE & GUEST STYLING</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[11px]">
          <a href="#dress-code" className="hover:text-[#E11D48] transition">Guide Éditorial</a>
          <a href="#conciergerie-style" className="hover:text-[#E11D48] transition">Conciergerie Style</a>
          <a href="#signature" className="hover:text-[#E11D48] transition">Cocktail RSVP</a>
        </div>
        <div className="text-[11px] font-mono text-[#E11D48] border border-[#E11D48]/30 px-3 py-1">
          DRESS CODE STRICT
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative min-h-[92vh] flex flex-col justify-end p-6 sm:p-14 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <img
            src="/images/packages/irreverence.jpg"
            alt="Irrévérence Mariage"
            className="w-full h-full object-cover filter contrast-125 brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-6xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E11D48] text-white text-[11px] tracking-[0.25em] uppercase font-semibold mb-6">
            <Shirt size={13} /> Direction Artistique & Scénographie Subversive
          </div>

          <h1
            className="text-white uppercase leading-[0.92] tracking-tight font-normal text-[clamp(3.5rem,12vw,9.5rem)]"
            style={{ fontFamily: '"Italiana", "Syne", serif' }}
          >
            GABRIEL <span className="text-[#E11D48] italic">&</span> CÉLESTE
          </h1>

          <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 border-t border-white/15">
            <div>
              <p className="text-xl sm:text-2xl font-light text-[#FAF8F5] tracking-wide" style={{ fontFamily: '"Italiana", serif' }}>
                24 OCTOBRE 2026 — LA DISTILLERIE BÉTON, BERLIN
              </p>
              <p className="text-sm text-[#A1A1AA] mt-1 font-light">
                Le chic sans protocole. Une scénographie chrome et rouge carmin. Zéro convention.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a href="#dress-code" className="px-6 sm:px-8 py-3.5 bg-[#E11D48] text-white text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#be123c] transition shadow-lg">
                Guide Dress Code
              </a>
              <a href="#conciergerie-style" className="px-6 sm:px-8 py-3.5 border border-white/30 text-white text-xs tracking-[0.2em] uppercase font-semibold hover:border-white transition">
                Faire Valider Ma Tenue
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Manifeste Éclectique */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 bg-[#0E0E12] border-b border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-[#E11D48] font-semibold">L’INTENTION STYLISTIQUE</span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-light tracking-tight leading-snug" style={{ fontFamily: '"Italiana", serif' }}>
            « Venez habillés comme si vous alliez être photographiés pour la couverture de Vogue à minuit. »
          </h2>
          <p className="mt-6 text-[#A1A1AA] text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Nous avons banni les demi-mesures. Ce mariage est un défilé nocturne où chaque convive est une œuvre d'art en mouvement.
          </p>
        </div>
      </section>

      {/* MODULE 1 : DRESS-CODE & NUANCIER IMPOSÉ STYLE MAGAZINE */}
      <section id="dress-code" className="py-24 sm:py-36 px-4 sm:px-8 border-b border-white/10 bg-[#0A0A0C]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-[#E11D48] font-semibold">ÉDITORIAL MODE INVITES</span>
              <h2 className="text-4xl sm:text-6xl font-light uppercase tracking-tight mt-1" style={{ fontFamily: '"Italiana", serif' }}>
                LE NUANCIER & LES RÈGLES DU JEU
              </h2>
            </div>
            <p className="text-sm text-[#A1A1AA] max-w-md font-light leading-relaxed">
              Pour assurer l'harmonie photographique du livre d'art officiel, veuillez respecter scrupuleusement la charte chromatique ci-dessous.
            </p>
          </div>

          {/* Nuanciers Comparatifs : Autorisé vs Interdit */}
          <div className="mt-14 grid lg:grid-cols-2 gap-10">
            {/* Palette Autorisée */}
            <div className="p-8 sm:p-10 rounded-2xl bg-[#121216] border border-[#E11D48]/30 shadow-2xl">
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-emerald-400 font-bold mb-6">
                <CheckCircle2 size={16} />
                <span>COULEURS AUTORISÉES & FORTEMENT ENCOURAGÉES</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {paletteAutorisee.map((color) => (
                  <div
                    key={color.hex}
                    onClick={() => setSelectedColor(color.hex)}
                    className="p-4 rounded-xl bg-black/40 border border-white/10 hover:border-[#E11D48] transition cursor-pointer group"
                  >
                    <div
                      className="w-full h-12 rounded-lg border border-white/10 mb-3 shadow-inner group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="text-sm font-semibold text-white">{color.name}</div>
                    <div className="text-[11px] font-mono text-[#E11D48]">{color.hex}</div>
                    <div className="text-xs text-[#A1A1AA] mt-1 font-light leading-snug">{color.note}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Palette Bannis */}
            <div className="p-8 sm:p-10 rounded-2xl bg-[#121216] border border-red-500/20 shadow-2xl">
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-red-400 font-bold mb-6">
                <XCircle size={16} />
                <span>FAUX-PAS STYLISTIQUES & COULEURS STRICTEMENT PROSCRITES</span>
              </div>

              <div className="space-y-4">
                {paletteInterdite.map((color) => (
                  <div key={color.hex} className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg border border-white/10 shrink-0 opacity-80"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div>
                        <div className="text-sm font-semibold text-white/90">{color.name}</div>
                        <div className="text-xs text-red-400 font-light mt-0.5">{color.reason}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-red-500 font-bold px-2.5 py-1 bg-red-500/10 rounded border border-red-500/20">
                      INTERDIT
                    </span>
                  </div>
                ))}

                <div className="p-4 rounded-xl bg-[#E11D48]/10 border border-[#E11D48]/20 text-xs text-white/90 leading-relaxed font-light">
                  <strong className="text-white block font-medium mb-1">NOTE SUR LES ACCESSOIRES :</strong>
                  Les lunettes noires de soleil sont obligatoires dès l'entrée dans le club. Les talons aiguilles acérés ou rangers en cuir ciré sont plébiscités.
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Lookbook Filters & Gallery */}
          <div className="mt-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h3 className="text-2xl sm:text-3xl font-light uppercase tracking-tight" style={{ fontFamily: '"Italiana", serif' }}>
                RÉFÉRENCES ÉDITORIALES // LOOKBOOK INVITES
              </h3>
              
              <div className="flex items-center gap-2">
                {[
                  { id: 'all', label: 'Toutes les silhouettes' },
                  { id: 'femme', label: 'Femme' },
                  { id: 'homme', label: 'Homme' },
                  { id: 'accessoire', label: 'Accessoires' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setStyleFilter(f.id as any)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
                      styleFilter === f.id
                        ? 'bg-[#E11D48] text-white shadow-lg'
                        : 'bg-white/5 border border-white/10 text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredRefs.map((item) => (
                <div key={item.id} className="group rounded-2xl overflow-hidden bg-[#121216] border border-white/10 hover:border-[#E11D48] transition flex flex-col">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 bg-black/70 backdrop-blur-md rounded border border-white/20 text-[#E11D48] font-bold">
                      {item.badge}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-[#A1A1AA] block">{item.designer}</span>
                      <h4 className="text-base font-semibold text-white mt-1 group-hover:text-[#E11D48] transition">{item.title}</h4>
                      <p className="text-xs text-[#A1A1AA] mt-2 font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MODULE 2 : SERVICE CONCIERGERIE STYLE (VALIDATION PAR LA DIRECTION ARTISTIQUE) */}
      <section id="conciergerie-style" className="py-24 sm:py-36 px-4 sm:px-8 border-b border-white/10 bg-[#0E0E12]">
        <div className="max-w-3xl mx-auto p-8 sm:p-12 rounded-3xl bg-[#141418] border border-[#E11D48]/30 shadow-2xl">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#E11D48] font-bold">
              SERVICE VIP INVITES
            </span>
            <h2 className="mt-2 text-3xl sm:text-5xl font-light uppercase tracking-tight" style={{ fontFamily: '"Italiana", serif' }}>
              CONCIERGERIE STYLE
            </h2>
            <p className="mt-3 text-sm text-[#A1A1AA] font-light leading-relaxed">
              Un doute sur une coupe, une couleur ou un accessoire ? Soumettez votre idée à notre direction artistique. Réponse personnalisée sous 48h.
            </p>
          </div>

          {validationStatus === 'approved' ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-10 p-8 rounded-2xl bg-black border border-emerald-500/40 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
                <Check size={28} />
              </div>
              <div className="mt-4 text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                PROPOSITION SOUMISE AVEC SUCCÈS
              </div>
              <h3 className="text-2xl font-light uppercase text-white mt-1" style={{ fontFamily: '"Italiana", serif' }}>
                LOOK ENREGISTRÉ POUR {guestName.toUpperCase()}
              </h3>
              <p className="text-xs text-[#A1A1AA] mt-2 font-light max-w-md mx-auto leading-relaxed">
                Notre curatrice de style examine votre tenue (« {outfitDesc} »). Vous recevrez un mot doux et des conseils de retouche par SMS.
              </p>
              <button
                onClick={() => setValidationStatus('idle')}
                className="mt-6 px-6 py-2.5 rounded-full border border-white/20 text-xs font-mono uppercase text-white hover:bg-white/10"
              >
                Soumettre une autre pièce
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleValidateOutfit} className="mt-10 space-y-6">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A1A1AA] mb-2 font-semibold">Votre Nom & Prénom</label>
                  <input
                    required
                    type="text"
                    placeholder="ex: Camille Saint-Germain"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-4 py-3.5 bg-black/60 border border-white/15 rounded-xl text-sm text-white placeholder-neutral-600 outline-none focus:border-[#E11D48] transition"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A1A1AA] mb-2 font-semibold">Type de Silhouette</label>
                  <select
                    value={outfitCategory}
                    onChange={(e) => setOutfitCategory(e.target.value)}
                    className="w-full px-4 py-3.5 bg-black/60 border border-white/15 rounded-xl text-sm text-white outline-none focus:border-[#E11D48] transition"
                  >
                    <option>Smoking Déstructuré / Tailleur</option>
                    <option>Robe Fourreau / Asymétrique</option>
                    <option>Ensemble Cuir / Vinyle</option>
                    <option>Accessoire / Chapeau / Bijou</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A1A1AA] mb-2 font-semibold">Description de la Tenue & Marques Envisagées</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Décrivez votre couleur dominante, la coupe, la texture (ex: Smoking noir oversize revers satin, bottines cuir ciré, collier argent)..."
                  value={outfitDesc}
                  onChange={(e) => setOutfitDesc(e.target.value)}
                  className="w-full px-4 py-3.5 bg-black/60 border border-white/15 rounded-xl text-sm text-white placeholder-neutral-600 outline-none focus:border-[#E11D48] transition"
                />
              </div>

              <div className="p-4 rounded-xl border border-dashed border-white/20 text-center cursor-pointer hover:border-[#E11D48] transition bg-black/30">
                <Upload size={22} className="mx-auto text-[#A1A1AA] mb-1" />
                <span className="text-xs font-semibold text-white">Ajouter une photo de la tenue ou lien Pinterest (Optionnel)</span>
                <span className="block text-[11px] text-[#A1A1AA] font-mono mt-0.5">JPG, PNG, HEIC jusqu'à 20 Mo</span>
              </div>

              <button
                type="submit"
                disabled={validationStatus === 'analyzing'}
                className="w-full py-4 rounded-xl bg-[#E11D48] text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#be123c] transition shadow-xl flex items-center justify-center gap-2"
              >
                {validationStatus === 'analyzing' ? (
                  <span>Analyse stylistique en cours...</span>
                ) : (
                  <>
                    <span>Soumettre à la Direction Artistique</span>
                    <ArrowUpRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-xs tracking-[0.2em] uppercase text-[#A1A1AA] border-t border-white/10 bg-[#0A0A0C]">
        GABRIEL & CÉLESTE — 24.10.2026 // DIRECTION ARTISTIQUE : IRRÉVÉRENCE PAR LE MONDE AIME
      </footer>
    </div>
  );
}
