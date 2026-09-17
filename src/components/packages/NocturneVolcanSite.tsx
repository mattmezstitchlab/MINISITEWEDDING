import { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Play, Pause, Flame, GlassWater, Clock, Zap, Sparkles, Check, Disc3 } from 'lucide-react';

export default function NocturneVolcanSite() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCocktail, setActiveCocktail] = useState(0);
  const [guestCocktailChoice, setGuestCocktailChoice] = useState('');
  const [cocktailConfirmed, setCocktailConfirmed] = useState(false);

  const cocktails = [
    {
      name: 'Lave Sombre & Mezcal Fumé',
      ingredients: 'Mezcal artisanal d’Oaxaca, charbon végétal activé, cordial de mûre sauvage, piment d’Espelette et sel volcanique noir.',
      vibe: 'Puissant, fumé, tellurique',
      color: '#7E22CE',
    },
    {
      name: 'Néon Violette & Gin Infusé',
      ingredients: 'Gin botanique de forêt, liqueur de violette ancienne, tonic artisanal au pamplemousse rose et brume de romarin calciné.',
      vibe: 'Floral acéré, électrique',
      color: '#A855F7',
    },
    {
      name: 'Obsidienne Sans Alcool',
      ingredients: 'Distillat sans alcool de racines amères, jus de cerise noire concentré, infusion de cardamome noire et bulles de source volcanique.',
      vibe: 'Zéro alcool, 100% extase gustative',
      color: '#F59E0B',
    },
  ];

  const nightTimeline = [
    { hour: '20:00', title: 'Apéritif au Crépuscule', desc: 'Arrivée sous les arches de pierre basaltique. Basses feutrées et premiers verres de vin nature.' },
    { hour: '22:30', title: 'L’Embrasement du Dancefloor', desc: 'Coupure des lustres. Allumage des néons sculpturaux et ouverture par le set live B2B.' },
    { hour: '01:30', title: 'Midnight Street-Food & Huîtres Braisées', desc: 'Barbecue nocturne en direct, tacos de wagyu et huîtres au beurre d’algues flambé.' },
    { hour: '04:00', title: 'After Hypnotique & Transe Minimaliste', desc: 'Session intimiste dans la petite salle voûtée pour les danseurs infatigables.' },
    { hour: '07:00', title: 'Le Lever du Soleil & Bouillon Réconfortant', desc: 'Ramen chaud du petit matin et espresso serré face aux brumes d’Islande.' },
  ];

  return (
    <div className="bg-[#09080D] text-[#FAF5FF] min-h-screen selection:bg-[#7E22CE] selection:text-white" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      {/* Top Banner */}
      <div className="border-b border-white/10 bg-[#0E0C16] px-4 sm:px-8 py-3 flex items-center justify-between text-xs tracking-[0.25em] uppercase font-semibold text-[#C084FC]">
        <div className="flex items-center gap-2">
          <Flame size={14} className="text-[#F59E0B]" />
          <span className="text-white">NOCTURNE & VOLCAN // SCÉNOGRAPHIE DE NUIT & PARTY FOCUS</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[11px] text-[#D8B4FE]">
          <a href="#curation-dj" className="hover:text-white transition">Curation DJ</a>
          <a href="#cocktails-mixologie" className="hover:text-white transition">Bar Mixologie</a>
          <a href="#timeline-nuit" className="hover:text-white transition">Timeline de Nuit</a>
        </div>
        <div className="text-[11px] font-mono text-[#F59E0B] border border-[#F59E0B]/40 px-3 py-1 rounded-full">
          AFTER JUSQU'À 07H
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative min-h-[92vh] flex flex-col justify-end p-6 sm:p-14 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <img
            src="/images/packages/nocturne-volcan.jpg"
            alt="Nocturne et Volcan Mariage"
            className="w-full h-full object-cover filter contrast-125 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09080D] via-[#09080D]/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#581C87]/60 backdrop-blur-md border border-[#C084FC]/40 text-[#FAF5FF] text-[11px] tracking-[0.25em] uppercase font-semibold mb-6">
            <Disc3 size={13} className="text-[#F59E0B]" /> Party Focus & Scénographie Néo-Brutaliste
          </div>

          <h1
            className="text-white uppercase leading-[0.92] tracking-tight font-extrabold text-[clamp(3.5rem,12vw,9rem)]"
            style={{ fontFamily: '"Syne", sans-serif' }}
          >
            MALIK <span className="text-[#C084FC] font-light">&</span> NOA
          </h1>

          <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 border-t border-white/15">
            <div>
              <p className="text-xl sm:text-2xl font-mono text-white tracking-wide">
                17 OCTOBRE 2026 — FONDERIE VOLCANIQUE, NANTES
              </p>
              <p className="text-sm text-[#D8B4FE]/80 mt-1 font-light">
                Une célébration sans temps mort. Acoustique de club berlinois, néons sculptés et mixologie d'avant-garde.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a href="#curation-dj" className="px-7 py-3.5 rounded-full bg-[#7E22CE] text-white text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#9333EA] transition shadow-lg shadow-purple-900/40">
                Écouter le DJ Set
              </a>
              <a href="#cocktails-mixologie" className="px-7 py-3.5 rounded-full border border-white/30 text-white text-xs tracking-[0.2em] uppercase font-semibold hover:bg-white/10 transition">
                Carte des Cocktails
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* MODULE 1 : CURATION DJ ET LECTEUR AUDIO */}
      <section id="curation-dj" className="py-24 sm:py-36 px-4 sm:px-8 border-b border-white/10 bg-[#0E0C16]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#C084FC] flex items-center justify-center gap-2 mb-3">
            <Music size={14} /> SOUND-SYSTEM FUNCTION-ONE DÉDIÉ
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight" style={{ fontFamily: '"Syne", sans-serif' }}>
            CURATION MUSICALE PAR DJ KÕRBO
          </h2>
          <p className="mt-4 text-sm text-[#D8B4FE]/70 font-light max-w-xl mx-auto">
            Pas de playlist mariage impersonnelle. Un arc narratif sonore en cinq chapitres, de l'ambient mélodique au crépuscule jusqu’à la deep techno hypnotique de l’aube.
          </p>

          <div className="mt-12 p-8 rounded-3xl bg-[#141120] border border-[#7E22CE]/40 shadow-2xl text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
              <div>
                <span className="text-xs font-mono text-[#F59E0B] uppercase">SET EXCLUSIF MARIAGE</span>
                <h3 className="text-xl sm:text-2xl font-bold uppercase text-white mt-1">VOLCANIC REVERIE (LIVE RECORDING)</h3>
                <p className="text-xs text-[#D8B4FE]/60 font-mono mt-0.5">BPM : 118 à 128 • Durée : 01h 48m</p>
              </div>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 rounded-full bg-[#7E22CE] text-white flex items-center justify-center hover:scale-105 transition shadow-lg shrink-0"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1 fill-white" />}
              </button>
            </div>

            {/* Visualizer bars */}
            <div className="flex items-center gap-1 h-14 bg-black/50 p-3 rounded-2xl border border-white/5">
              {[40, 70, 95, 30, 85, 60, 45, 100, 75, 50, 90, 65, 35, 80, 95, 60, 40, 85, 100, 70, 50, 30].map((h, i) => (
                <motion.div
                  key={i}
                  animate={isPlaying ? { height: [`${h * 0.2}%`, `${h}%`, `${h * 0.3}%`] } : { height: '20%' }}
                  transition={{ repeat: Infinity, duration: 1.0 + (i * 0.04), ease: 'easeInOut' }}
                  className="flex-1 bg-gradient-to-t from-[#581C87] via-[#A855F7] to-[#F59E0B] rounded-full"
                />
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs font-mono text-[#D8B4FE]/60">
              <span>{isPlaying ? 'En cours de lecture...' : 'Appuyez sur play pour écouter'}</span>
              <span>128 kbps HD Master</span>
            </div>
          </div>
        </div>
      </section>

      {/* MODULE 2 : CARTE DES COCKTAILS DE MIXOLOGIE MOLÉCULAIRE */}
      <section id="cocktails-mixologie" className="py-24 sm:py-36 px-4 sm:px-8 border-b border-white/10 bg-[#09080D]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#F59E0B] flex items-center gap-1.5">
                <GlassWater size={14} /> BAR À COCKTAILS D'AUTEUR
              </span>
              <h2 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tight mt-1" style={{ fontFamily: '"Syne", sans-serif' }}>
                LES ÉLIXIRS DU BAR NOIR
              </h2>
            </div>
            <p className="text-sm text-[#D8B4FE]/70 max-w-sm font-light leading-relaxed">
              Trois signatures conçues exclusivement pour la soirée par le mixologue en chef, servies sur glace sculptée au diamant.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {cocktails.map((c, i) => (
              <div
                key={c.name}
                onClick={() => setActiveCocktail(i)}
                className={`p-8 rounded-3xl border transition cursor-pointer flex flex-col justify-between ${
                  activeCocktail === i
                    ? 'bg-[#181326] border-[#A855F7] shadow-xl'
                    : 'bg-[#100D1C] border-white/10 hover:border-white/25'
                }`}
              >
                <div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm font-bold border border-white/20 mb-6" style={{ backgroundColor: `${c.color}25`, color: c.color }}>
                    0{i + 1}
                  </div>
                  <h3 className="text-xl font-bold uppercase text-white tracking-wide">{c.name}</h3>
                  <p className="text-xs text-[#D8B4FE]/80 mt-3 leading-relaxed font-light">{c.ingredients}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-white/10 text-xs font-mono text-[#F59E0B]">
                  {c.vibe}
                </div>
              </div>
            ))}
          </div>

          {/* Guest Cocktail Reservation Widget */}
          <div className="mt-12 p-8 rounded-3xl bg-[#141120] border border-white/10 max-w-xl mx-auto text-center">
            <span className="text-xs font-mono text-[#C084FC] uppercase tracking-widest">RÉSERVER VOTRE VERRE DE MINUIT</span>
            <h4 className="text-lg font-bold text-white uppercase mt-1">Quel sera votre premier toast avec Malik & Noa ?</h4>

            {cocktailConfirmed ? (
              <div className="mt-4 p-4 rounded-xl bg-[#7E22CE]/30 border border-[#A855F7] text-xs font-mono text-white flex items-center justify-center gap-2">
                <Check size={16} className="text-emerald-400" />
                Votre verre de « {cocktails[activeCocktail].name} » sera prêt au bar dès 22h30.
              </div>
            ) : (
              <button
                onClick={() => setCocktailConfirmed(true)}
                className="mt-6 px-8 py-3.5 rounded-full bg-[#F59E0B] text-black text-xs font-mono font-bold uppercase hover:bg-amber-400 transition"
              >
                Valider ma sélection au bar
              </button>
            )}
          </div>
        </div>
      </section>

      {/* MODULE 3 : TIMELINE DE L'AFTER-PARTY */}
      <section id="timeline-nuit" className="py-24 sm:py-36 px-4 sm:px-8 bg-[#0E0C16]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-12">
            <div>
              <span className="text-xs font-mono uppercase text-[#C084FC] tracking-widest">CADENCE NOCTURNE</span>
              <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight mt-1" style={{ fontFamily: '"Syne", sans-serif' }}>
                PROGRAMME DE L’AFTER-PARTY
              </h2>
            </div>
            <span className="text-xs font-mono text-[#F59E0B] hidden sm:inline">ZERO COUVRE-FEU</span>
          </div>

          <div className="space-y-4">
            {nightTimeline.map((item) => (
              <div
                key={item.hour}
                className="grid md:grid-cols-[110px_1fr] items-start p-6 rounded-2xl bg-[#141120] border border-white/10 hover:border-[#A855F7] transition"
              >
                <div className="text-2xl font-mono font-bold text-[#F59E0B]">{item.hour}</div>
                <div>
                  <h3 className="text-base font-bold uppercase tracking-wider text-white">{item.title}</h3>
                  <p className="text-xs text-[#D8B4FE]/70 mt-1 font-light leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-xs font-mono uppercase text-[#D8B4FE]/50 border-t border-white/10 bg-[#09080D]">
        MALIK & NOA — 17.10.2026 // DIRECTION : NOCTURNE & VOLCAN PAR LE MONDE AIME
      </footer>
    </div>
  );
}
