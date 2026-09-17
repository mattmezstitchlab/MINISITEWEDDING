import { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Sparkles, Check, ArrowUpRight, Flame, Disc } from 'lucide-react';

export default function IrreverenceSite() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rsvpSent, setRsvpSent] = useState(false);
  const [selectedLook, setSelectedLook] = useState('Silk Tuxedo');

  const moodboard = [
    { title: 'SILK & SUNGLASSES', tag: 'DRESS CODE', desc: 'Le smoking sans chemise ou le costume soie sauvage avec monture noire épaisse.' },
    { title: 'RED ACCENT ONLY', tag: 'PALETTE', desc: 'Une touche rouge fraise incandescente : rouge à lèvres sang, stiletto carmin ou fleur inversée.' },
    { title: 'CHROME & SHADOWS', tag: 'SCÉNOGRAPHIE', desc: 'Mobilier miroir, verrerie soufflée brute et chandeliers argentés massifs.' },
    { title: 'NO GENTLE PROTOCOL', tag: 'PHILOSOPHIE', desc: 'Pas de pièce montée ennuyeuse. Glace à la fraise dégoulinante et fontaines de mezcal.' },
  ];

  return (
    <div className="bg-[#FBF9F5] text-[#050505] min-h-screen selection:bg-[#E63946] selection:text-white" style={{ fontFamily: '"Syne", "Plus Jakarta Sans", sans-serif' }}>
      {/* Editorial Top Bar */}
      <div className="border-b border-black/10 px-4 sm:px-8 py-3.5 flex items-center justify-between text-xs tracking-[0.2em] uppercase font-bold bg-[#FBF9F5]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#E63946] rounded-full inline-block" />
          <span>IRRÉVÉRENCE // ISSUE 09</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#dresscode" className="hover:text-[#E63946] transition">01. Dress Code</a>
          <a href="#moodboard" className="hover:text-[#E63946] transition">02. Moodboard</a>
          <a href="#playlist" className="hover:text-[#E63946] transition">03. Audio Teaser</a>
          <a href="#rsvp" className="hover:text-[#E63946] transition">04. RSVP</a>
        </div>
        <div className="text-[11px] px-3 py-1 bg-black text-white rounded-none tracking-widest font-mono">
          VILLA NOAILLES
        </div>
      </div>

      {/* Hero Magazine Cover */}
      <header className="relative min-h-[92vh] flex flex-col justify-between p-4 sm:p-12 overflow-hidden border-b-2 border-black">
        <div className="absolute inset-0">
          <img
            src="/images/packages/irreverence.jpg"
            alt="Sasha et Camille Irrévérence"
            className="w-full h-full object-cover contrast-115 saturate-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/30" />
        </div>

        {/* Top Header of Magazine */}
        <div className="relative z-10 flex justify-between items-start text-white">
          <span className="text-xs tracking-[0.35em] uppercase font-bold py-1 px-3 bg-[#E63946]">ÉDITION SPÉCIALE MARIAGE</span>
          <span className="text-sm tracking-[0.25em] font-mono text-white/80">05 SEPTEMBRE 2026</span>
        </div>

        {/* Giant Magazine Title */}
        <div className="relative z-10 my-auto text-center py-10">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <h1
              className="text-white uppercase leading-[0.9] tracking-tighter font-extrabold text-[clamp(3.5rem,13vw,10.5rem)]"
              style={{ fontFamily: '"Bodoni Moda", "Italiana", serif' }}
            >
              SASHA <span className="italic font-light text-[#E63946]">&</span> CAMILLE
            </h1>
            <p className="mt-4 text-white/90 text-sm sm:text-lg tracking-[0.3em] uppercase font-bold max-w-2xl mx-auto">
              Chic affûté. Zéro protocole. Rupture délibérée des codes.
            </p>
          </motion.div>
        </div>

        {/* Bottom Strip */}
        <div className="relative z-10 grid sm:grid-cols-3 gap-4 pt-4 border-t border-white/20 text-white text-xs tracking-wider uppercase">
          <div><strong className="text-[#E63946]">LIEU //</strong> VILLA NOAILLES, HYÈRES</div>
          <div><strong className="text-[#E63946]">THEME //</strong> AVANT-GARDE & RED STRAWBERRY</div>
          <div className="sm:text-right"><strong className="text-[#E63946]">DA //</strong> LE MONDE AIME STUDIO</div>
        </div>
      </header>

      {/* Manifesto Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-12 bg-[#050505] text-[#FBF9F5] border-b-2 border-black">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-[#E63946] font-bold mb-4">
            <Flame size={16} /> Le Manifeste
          </div>
          <h2
            className="text-3xl sm:text-6xl font-normal leading-tight tracking-tight uppercase"
            style={{ fontFamily: '"Bodoni Moda", "Italiana", serif' }}
          >
            « Nous n’avons pas invité les convenances. Nous avons invité ceux qui savent brûler d’intensité. »
          </h2>
          <p className="mt-8 text-white/70 text-base sm:text-lg leading-relaxed max-w-3xl font-light">
            Oubliez les nœuds papillons compassés et les robes meringues. Le mariage de Sasha & Camille est pensé comme un défilé de mode immersif, une nuit fauve de musique électronique et une scénographie sculpturale où chaque détail dérange avec grâce.
          </p>
        </div>
      </section>

      {/* Dress Code Section */}
      <section id="dresscode" className="py-20 sm:py-28 px-4 sm:px-12 border-b-2 border-black bg-[#FBF9F5]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-black pb-6 mb-12">
            <div>
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#E63946]">EXIGENCE ÉDITORIALE</span>
              <h2
                className="text-4xl sm:text-6xl uppercase tracking-tight font-extrabold mt-1"
                style={{ fontFamily: '"Bodoni Moda", "Italiana", serif' }}
              >
                DRESS CODE : SUBVERSIF
              </h2>
            </div>
            <span className="text-sm font-mono text-[#666] tracking-widest uppercase">CONSIGNE OBLIGATOIRE</span>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6 text-base leading-relaxed">
              <p className="text-xl font-bold">
                Pour être raccord avec la scénographie rouge fraise et chrome, voici les règles du jeu :
              </p>
              <ul className="space-y-4 text-sm text-[#333]">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-[#E63946] text-white flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">✕</span>
                  <span><strong>Interdit formel :</strong> Costumes bleu marine de bureau, petites robes à fleurs pastel sages, cravates ternes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-black text-white flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">✓</span>
                  <span><strong>Recommandé :</strong> Lunettes de soleil noires dès 16h00, tailoring oversize, monochrome blanc ou noir, accents rouge sang, textures vinyle ou soie brute.</span>
                </li>
              </ul>

              <div className="p-6 bg-black text-white mt-6">
                <span className="text-xs text-[#E63946] uppercase tracking-widest font-bold">RÈGLE D’OR</span>
                <p className="text-sm mt-1">« Si votre tenue ressemble à celle d'un mariage de cousin de province, osez l'audace et coupez les manches. »</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {['Costume Soie Noir', 'Robe Chrome Miroir', 'Tailoring Rouge Fraise', 'Total Look White'].map((look) => (
                <button
                  key={look}
                  onClick={() => setSelectedLook(look)}
                  className={`p-6 border-2 border-black text-left transition ${selectedLook === look ? 'bg-[#E63946] text-white border-[#E63946]' : 'bg-white hover:bg-black hover:text-white'}`}
                >
                  <span className="text-[10px] tracking-widest uppercase block font-mono opacity-80">INSPIRATION</span>
                  <span className="text-base font-bold uppercase mt-2 block leading-snug">{look}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Moodboard Section */}
      <section id="moodboard" className="py-20 sm:py-28 px-4 sm:px-12 bg-[#F1EFEA] border-b-2 border-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#E63946]">DIRECTION ARTISTIQUE</span>
            <h2
              className="text-4xl sm:text-5xl uppercase tracking-tight font-extrabold mt-1"
              style={{ fontFamily: '"Bodoni Moda", "Italiana", serif' }}
            >
              LE MOODBOARD SCÉNOGRAPHIQUE
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {moodboard.map((item, idx) => (
              <div key={item.title} className="p-8 bg-white border-2 border-black shadow-[6px_6px_0px_#000] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-xs font-mono text-[#888]">
                    <span>0{idx + 1}</span>
                    <span className="text-[#E63946] font-bold">[{item.tag}]</span>
                  </div>
                  <h3 className="text-xl font-bold uppercase mt-4 tracking-tight">{item.title}</h3>
                  <p className="text-sm text-[#444] mt-3 leading-relaxed font-light">{item.desc}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-black/10 flex justify-between items-center text-xs font-bold tracking-widest">
                  <span>VALIDÉ DA</span>
                  <ArrowUpRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Playlist / Audio Teaser */}
      <section id="playlist" className="py-20 sm:py-28 px-4 sm:px-12 bg-[#050505] text-white border-b-2 border-black">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-[#E63946] text-white text-xs font-bold tracking-widest uppercase mb-6">
            <Disc size={15} /> Bande Son du Mariage
          </div>
          <h2
            className="text-3xl sm:text-5xl uppercase tracking-tight font-extrabold"
            style={{ fontFamily: '"Bodoni Moda", "Italiana", serif' }}
          >
            AUDIO TEASER // FRENCH TOUCH & CLUB CULTURE
          </h2>
          <p className="mt-4 text-white/60 text-sm sm:text-base max-w-xl mx-auto">
            La curation musicale signée par Sasha & Camille pour se préparer à la fièvre de la nuit.
          </p>

          <div className="mt-10 p-6 sm:p-8 border-2 border-white/20 bg-white/5 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 bg-[#E63946] text-white flex items-center justify-center hover:scale-105 transition shrink-0"
              >
                {isPlaying ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
              <div>
                <div className="text-sm font-bold uppercase tracking-wider">TRACK 01 : ACID ROMANCE (LIVE EDIT)</div>
                <div className="text-xs text-white/60 font-mono mt-0.5">CURATION : DJ RESIDENT VILLA NOAILLES — 128 BPM</div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {[40, 70, 30, 90, 60, 100, 45, 80, 50, 95].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-[#E63946] transition-all duration-300"
                  style={{ height: isPlaying ? `${h}px` : '12px' }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Stylisé */}
      <section id="rsvp" className="py-20 sm:py-28 px-4 sm:px-12 bg-[#FBF9F5]">
        <div className="max-w-2xl mx-auto p-8 sm:p-12 border-2 border-black bg-white shadow-[10px_10px_0px_#E63946]">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#E63946]">AVANT-GARDE GUESTLIST</span>
          <h2
            className="text-3xl sm:text-4xl uppercase tracking-tight font-extrabold mt-1"
            style={{ fontFamily: '"Bodoni Moda", "Italiana", serif' }}
          >
            CONFIRMER VOTRE PRÉSENCE
          </h2>
          <p className="text-sm text-[#555] mt-2">Dernier délai de réponse : 1er Juillet 2026.</p>

          {rsvpSent ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-8 p-6 bg-black text-white text-center">
              <Check size={32} className="mx-auto text-[#E63946]" />
              <div className="text-lg font-bold uppercase mt-2">ENTRÉE VIP ENREGISTRÉE</div>
              <p className="text-xs text-white/70 mt-1">N’oubliez pas vos lunettes de soleil. Rendez-vous sur la terrasse de la Villa Noailles.</p>
            </motion.div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setRsvpSent(true); }} className="mt-8 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">Prénom & Nom</label>
                <input required placeholder="Votre nom" className="w-full px-4 py-3.5 border-2 border-black bg-[#FBF9F5] text-sm font-medium outline-none focus:border-[#E63946]" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">Votre audace vestimentaire prévue</label>
                <input placeholder="ex: Smoking soie rouge carmin ou lunettes vintage" className="w-full px-4 py-3.5 border-2 border-black bg-[#FBF9F5] text-sm font-medium outline-none focus:border-[#E63946]" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">Boisson de prédilection au bar de nuit</label>
                <select className="w-full px-4 py-3.5 border-2 border-black bg-[#FBF9F5] text-sm font-medium outline-none">
                  <option>Mezcal & Piment doux</option>
                  <option>Champagne Brut Nature</option>
                  <option>Gin Tonic artisanal concombre</option>
                  <option>Mocktail détox glacé fraise</option>
                </select>
              </div>

              <button type="submit" className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#E63946] transition mt-6">
                Valider mon invitation VIP
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-12 border-t-2 border-black bg-white flex flex-col sm:flex-row items-center justify-between text-xs tracking-wider uppercase font-bold text-[#666] gap-4">
        <div>SASHA & CAMILLE — 05.09.2026 // VILLA NOAILLES</div>
        <div>DIRECTION ARTISTIQUE : IRRÉVÉRENCE PAR LE MONDE AIME</div>
      </footer>
    </div>
  );
}
