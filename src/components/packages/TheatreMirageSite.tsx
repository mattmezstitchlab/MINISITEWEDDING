import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Eye, Play, Film, Award, Check, Crown, Layers } from 'lucide-react';

export default function TheatreMirageSite() {
  const [selectedPerformer, setSelectedPerformer] = useState(0);
  const [selectedSeat, setSelectedSeat] = useState('Loge Royale n°03 (Balcon)');
  const [seatReserved, setSeatReserved] = useState(false);

  const performers = [
    {
      name: 'Vassili & Elena // Voltigeurs Célestes',
      discipline: 'ACROBATIE AÉRIENNE AU-DESSUS DU BANQUET',
      desc: 'Duo suspendu à 8 mètres au-dessus des tables en soie noire, enchaînant portés et chutes libres lentes au son d’un violoncelle baroque.',
      time: 'Acte II — 21h45',
      image: '/images/packages/theatre-mirage.jpg',
    },
    {
      name: 'Aria Montenari // Cantatrice Soprano',
      discipline: 'OPÉRA BAROQUE IMPROMPTUS',
      desc: 'Apparition surprise depuis le balcon des miroirs pour interpréter « Lascia ch’io pianga » enveloppée d’une traîne de 15 mètres de satin pourpre.',
      time: 'Ouverture Cérémonie — 17h30',
      image: '/images/hero-wedding.jpg',
    },
    {
      name: 'Le Ballet des Ombres Noires',
      discipline: 'DANSE CONTEMPORAINE & FEUX D’AMBRE',
      desc: 'Six danseurs de l’Opéra vêtus de masques de chrome sculpté ouvrent le bal par une chorégraphie hypnotique au milieu des convives.',
      time: 'Minuit Sacré — 00h00',
      image: '/images/packages/desordre.jpg',
    },
  ];

  const installations = [
    {
      title: 'Le Tunnel des Miroirs Déformants',
      spec: '36 panneaux de verre teinté or brossé',
      desc: 'Une traversée immersive où la lumière se diffracte en mille éclats dorés avant l’entrée dans la grande galerie.',
    },
    {
      title: 'La Forêt de Candélabres Suspendus',
      spec: '120 lustres baroques asservis au son',
      desc: 'Des lustres mobiles descendant lentement vers les convives au fur et à mesure que l’opéra s’intensifie.',
    },
    {
      title: 'L’Autel de Fumée & d’Argent',
      spec: 'Nébulisation cryogénique et vasque de marbre noir',
      desc: 'Une nappe de brume constante au ras du sol créant l’illusion d’une marche sur les nuages.',
    },
  ];

  return (
    <div className="bg-[#0B0A0E] text-[#FAF6ED] min-h-screen selection:bg-[#D4AF37] selection:text-black" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      {/* Top Banner */}
      <div className="border-b border-white/10 bg-[#121017] px-4 sm:px-8 py-3 flex items-center justify-between text-xs tracking-[0.25em] uppercase font-semibold text-[#D4AF37]">
        <div className="flex items-center gap-2">
          <Crown size={14} />
          <span className="text-[#FAF6ED]">THÉÂTRE & MIRAGE // ART SPATIEUX, PERFORMERS & OPÉRA IMMERSIF</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[11px] text-[#A1A1AA]">
          <a href="#artistes-live" className="hover:text-[#D4AF37] transition">Casting Artistes</a>
          <a href="#installations-3d" className="hover:text-[#D4AF37] transition">Installations Vivantes</a>
          <a href="#loge-privee" className="hover:text-[#D4AF37] transition">Attribution des Loges</a>
        </div>
        <div className="text-[11px] font-mono text-[#D4AF37] border border-[#D4AF37]/40 px-3 py-1 rounded-full">
          3 ACTES THÉÂTRAUX
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative min-h-[92vh] flex flex-col justify-end p-6 sm:p-14 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <img
            src="/images/packages/theatre-mirage.jpg"
            alt="Théâtre et Mirage Mariage"
            className="w-full h-full object-cover filter contrast-125 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A0E] via-[#0B0A0E]/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 backdrop-blur-md border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] tracking-[0.25em] uppercase font-semibold mb-6">
            <Film size={13} /> Scénographie Vivante & Performances Lyriques
          </div>

          <h1
            className="text-white uppercase leading-[0.92] tracking-tight font-light text-[clamp(3.5rem,11vw,9rem)]"
            style={{ fontFamily: '"Cinzel", "Italiana", serif' }}
          >
            CONSTANTIN <span className="italic font-normal text-[#D4AF37]">&</span> DIANE
          </h1>

          <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 border-t border-white/15">
            <div>
              <p className="text-xl sm:text-2xl font-light text-white tracking-wide" style={{ fontFamily: '"Cinzel", serif' }}>
                05 SEPTEMBRE 2026 — L’OPÉRA DES GLACES, VENISE
              </p>
              <p className="text-sm text-[#A1A1AA] mt-1 font-light">
                Quand le mariage devient une œuvre totale. Acrobates, cantatrices et scénographie en perpétuelle métamorphose.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a href="#artistes-live" className="px-7 py-3.5 rounded-full bg-[#D4AF37] text-black text-xs tracking-[0.2em] uppercase font-bold hover:bg-white transition shadow-lg">
                Le Programme des Actes
              </a>
              <a href="#loge-privee" className="px-7 py-3.5 rounded-full border border-white/30 text-white text-xs tracking-[0.2em] uppercase font-semibold hover:bg-white/10 transition">
                Ma Loge Royale
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* MODULE 1 : CASTING DES ARTISTES & PROGRAMME DES PERFORMANCES */}
      <section id="artistes-live" className="py-24 sm:py-36 px-4 sm:px-8 border-b border-white/10 bg-[#121017]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#D4AF37] font-bold">
                DISTRIBUTION ARTISTIQUE
              </span>
              <h2 className="text-4xl sm:text-5xl font-light uppercase tracking-tight text-white mt-1" style={{ fontFamily: '"Cinzel", serif' }}>
                LES PERFORMERS DE LA SOIRÉE
              </h2>
            </div>
            <p className="text-sm text-[#A1A1AA] max-w-sm font-light leading-relaxed">
              Huit artistes internationaux spécialement engagés pour ponctuer le banquet d’éclats de virtuosité et d’émotion pure.
            </p>
          </div>

          <div className="mt-12 grid lg:grid-cols-3 gap-8">
            {performers.map((p, i) => (
              <div
                key={p.name}
                onClick={() => setSelectedPerformer(i)}
                className={`p-8 rounded-3xl border transition cursor-pointer flex flex-col justify-between ${
                  selectedPerformer === i
                    ? 'bg-[#1A1722] border-[#D4AF37] shadow-2xl'
                    : 'bg-[#14121B] border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6 border border-white/10">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-md rounded-full text-[10px] font-mono text-[#D4AF37] border border-[#D4AF37]/30">
                      {p.time}
                    </div>
                  </div>

                  <span className="text-[10px] font-mono uppercase text-[#D4AF37] tracking-widest">{p.discipline}</span>
                  <h3 className="text-xl font-bold uppercase text-white mt-1" style={{ fontFamily: '"Cinzel", serif' }}>
                    {p.name}
                  </h3>
                  <p className="text-xs text-[#A1A1AA] mt-3 leading-relaxed font-light">{p.desc}</p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 text-xs text-[#D4AF37] font-mono flex items-center gap-1.5">
                  <Play size={12} className="fill-[#D4AF37]" /> Extrait vidéo disponible
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULE 2 : FICHES DES INSTALLATIONS 3D & SCÉNOGRAPHIE DE MIROIRS */}
      <section id="installations-3d" className="py-24 sm:py-36 px-4 sm:px-8 border-b border-white/10 bg-[#0B0A0E]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#D4AF37] font-bold">
              ARCHITECTURE ÉPHÉMÈRE DU SPECTACLE
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-light uppercase tracking-tight text-white" style={{ fontFamily: '"Cinzel", serif' }}>
              LES INSTALLATIONS VIVANTES
            </h2>
            <p className="mt-3 text-sm text-[#A1A1AA] font-light">
              Des décors mobiles et monumentaux qui transforment l'espace au gré des chapitres de la célébration.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {installations.map((inst, i) => (
              <div key={i} className="p-8 rounded-3xl bg-[#121017] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono text-[#D4AF37] uppercase mb-2">ZONE ARTISTIQUE 0{i + 1}</div>
                  <h3 className="text-lg font-bold text-white uppercase" style={{ fontFamily: '"Cinzel", serif' }}>{inst.title}</h3>
                  <p className="text-xs text-[#A1A1AA] mt-3 font-light leading-relaxed">{inst.desc}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-white/10 text-xs font-mono text-white/70">
                  {inst.spec}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULE 3 : ATTRIBUTION DES LOGES PRIVÉES */}
      <section id="loge-privee" className="py-24 sm:py-36 px-4 sm:px-8 bg-[#121017]">
        <div className="max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl bg-[#181520] border border-[#D4AF37]/40 shadow-2xl text-center">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-bold">ACCUEIL VIP AU THÉÂTRE</span>
          <h3 className="text-2xl sm:text-3xl font-light uppercase text-white mt-2" style={{ fontFamily: '"Cinzel", serif' }}>
            RÉSERVER VOTRE LOGE D'HONNEUR
          </h3>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-2 font-light">
            Chaque convive bénéficie d’un emplacement dédié avec vue plongeante sur la scène et service de champagne privé.
          </p>

          <div className="mt-6 space-y-2 text-left">
            {[
              'Loge Royale n°03 (Balcon Central • Champagne Dom Pérignon)',
              'Fauteuil d’Orchestre Impérial (Premier Rang Scénique)',
              'Loge des Miroirs (Vue Panoramique Côté Cour)',
            ].map((seat) => (
              <button
                key={seat}
                onClick={() => setSelectedSeat(seat)}
                className={`w-full p-4 rounded-xl border text-xs text-left transition ${
                  selectedSeat === seat
                    ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-semibold'
                    : 'bg-black/50 border-white/10 text-[#A1A1AA] hover:border-white/30'
                }`}
              >
                {seat}
              </button>
            ))}
          </div>

          {seatReserved ? (
            <div className="mt-6 p-4 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37] text-xs font-mono text-white flex items-center justify-center gap-2">
              <Check size={18} className="text-[#D4AF37]" /> Votre carton de loge imprimé à la feuille d'or sera remis à votre arrivée.
            </div>
          ) : (
            <button
              onClick={() => setSeatReserved(true)}
              className="mt-6 w-full py-4 rounded-xl bg-[#D4AF37] text-black text-xs font-semibold uppercase tracking-[0.2em] hover:bg-white transition"
            >
              Confirmer mon assignation
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-xs tracking-[0.2em] uppercase text-[#A1A1AA] border-t border-white/10 bg-[#0B0A0E]">
        CONSTANTIN & DIANE — 05.09.2026 // SCÉNOGRAPHIE : THÉÂTRE & MIRAGE PAR LE MONDE AIME
      </footer>
    </div>
  );
}
