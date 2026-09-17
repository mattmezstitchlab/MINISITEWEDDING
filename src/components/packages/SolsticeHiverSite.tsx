import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Snowflake, Wine, Coffee, Clock, Sun, Sparkles, Check, Compass } from 'lucide-react';

export default function SolsticeHiverSite() {
  const [activeLounge, setActiveLounge] = useState(0);
  const [selectedWine, setSelectedWine] = useState('');
  const [toastConfirmed, setToastConfirmed] = useState(false);

  const cozyLounges = [
    {
      title: 'Le Grand Foyer & Bar à Vins Rares',
      desc: 'Cheminée monumentale du XVe siècle crépitant sans fin. Dégustation de Pomerol, Côte-Rôtie et vins chauds infusés aux épices d’Orient.',
      icon: Wine,
    },
    {
      title: 'Le Salon Chocolat & Mignardises d’Hiver',
      desc: 'Barista dédié servant des chocolats chauds d’Équateur 85% coulés à la minute, guimauves artisanales à la fleur d’oranger et marrons glacés.',
      icon: Coffee,
    },
    {
      title: 'Le Sanctuaire des Étoles en Cachemire',
      desc: 'Vestiaire privé chauffé distribuant aux invités des plaids en laine mérinos et étoles en cachemire brodées aux initiales du couple.',
      icon: Snowflake,
    },
  ];

  const winterLightPlanning = [
    { hour: '14:00', title: 'Accueil Chaud & Grog d’Épices', note: 'Lumière d’hiver rasante et feux de bienvenue dans la cour' },
    { hour: '15:15', title: 'Cérémonie sous la Charpente Séculaire', note: 'Échange des anneaux à la lueur des premiers candélabres' },
    { hour: '16:00', title: 'Golden Hour d’Hiver & Portraits sur la Neige', note: 'Créneau magique de 45 minutes : clarté ambrée sur les cimes' },
    { hour: '17:00', title: 'Allumage des 1 000 Bougies & Dîner de Velours', note: 'Nuit totale à l’extérieur, chaleur absolue à l’intérieur' },
    { hour: '23:30', title: 'Bain de Minuit Thermal & Brasero Extérieur', note: 'Bains fumants sous les flocons pour les plus audacieux' },
  ];

  return (
    <div className="bg-[#FAF7F2] text-[#291417] min-h-screen selection:bg-[#58111A] selection:text-white" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      {/* Top Banner */}
      <div className="border-b border-[#58111A]/10 bg-[#F2ECE2] px-4 sm:px-8 py-3 flex items-center justify-between text-xs tracking-[0.25em] uppercase font-semibold text-[#58111A]">
        <div className="flex items-center gap-2">
          <Snowflake size={14} className="text-[#D97706]" />
          <span className="text-[#291417]">SOLSTICE D’HIVER // WARM LUXURY, FEU DE CHEMINÉE & 1000 BOUGIES</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[11px] text-[#291417]/70">
          <a href="#lounges-cosy" className="hover:text-[#58111A] transition">Salons Cosy</a>
          <a href="#planning-lumiere" className="hover:text-[#58111A] transition">Planning Lumière d'Hiver</a>
          <a href="#vins-rares" className="hover:text-[#58111A] transition">Dégustation</a>
        </div>
        <div className="text-[11px] font-mono text-[#58111A] border border-[#58111A]/40 px-3 py-1 rounded-full">
          MARIAGE HORS-SAISON
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative min-h-[92vh] flex flex-col justify-end p-6 sm:p-14 overflow-hidden border-b border-[#58111A]/10">
        <div className="absolute inset-0">
          <img
            src="/images/packages/solstice-hiver.jpg"
            alt="Solstice d'Hiver Mariage"
            className="w-full h-full object-cover filter contrast-110 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#58111A]/10 backdrop-blur-md text-[#58111A] text-[11px] tracking-[0.25em] uppercase font-semibold mb-6">
            <Flame size={13} className="text-[#D97706]" /> Warm Luxury & Célébration au Cœur de l'Hiver
          </div>

          <h1
            className="text-[#291417] uppercase leading-[0.92] tracking-tight font-light text-[clamp(3.5rem,11vw,9rem)]"
            style={{ fontFamily: '"Playfair Display", "Bodoni Moda", serif' }}
          >
            ADAM <span className="font-normal italic text-[#D97706]">&</span> ÉLÉONORE
          </h1>

          <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 border-t border-[#58111A]/15">
            <div>
              <p className="text-xl sm:text-2xl font-light text-[#291417] tracking-wide" style={{ fontFamily: '"Playfair Display", serif' }}>
                12 DÉCEMBRE 2026 — LE REFUGE DES ROCHES, MEGÈVE
              </p>
              <p className="text-sm text-[#291417]/75 mt-1 font-light">
                La blancheur pure des cimes enneigées et la chaleur d'un sanctuaire de velours et de feu.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a href="#lounges-cosy" className="px-7 py-3.5 rounded-full bg-[#58111A] text-white text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#781724] transition shadow-lg">
                Explorer les Salons
              </a>
              <a href="#planning-lumiere" className="px-7 py-3.5 rounded-full border border-[#58111A]/30 text-[#291417] text-xs tracking-[0.2em] uppercase font-semibold hover:bg-white transition">
                Planning Lumière
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* MODULE 1 : SALONS COSY ET EXPÉRIENCES CHALEUREUSES */}
      <section id="lounges-cosy" className="py-24 sm:py-36 px-4 sm:px-8 border-b border-[#58111A]/10 bg-[#F2ECE2]/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#D97706] font-bold">
              REFUGE DE CHALEUR ABSOLUE
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-light uppercase tracking-tight text-[#291417]" style={{ fontFamily: '"Playfair Display", serif' }}>
              LES SALONS COSY DU REFUGE
            </h2>
            <p className="mt-3 text-sm text-[#291417]/70 font-light">
              Tandis que la neige tombe sur les sapins, trois espaces intimistes ont été agencés pour le confort suprême des convives.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {cozyLounges.map((lounge, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white border border-[#58111A]/10 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#58111A]/10 text-[#58111A] flex items-center justify-center mb-6">
                    <lounge.icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-[#291417] uppercase tracking-wide">{lounge.title}</h3>
                  <p className="text-xs text-[#291417]/75 mt-3 leading-relaxed font-light">{lounge.desc}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-[#58111A]/10 text-xs font-mono text-[#D97706]">
                  Ouvert en continu de 14h à l’aube
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULE 2 : PLANNING LUMIÈRE D'HIVER & GOLDEN HOUR */}
      <section id="planning-lumiere" className="py-24 sm:py-36 px-4 sm:px-8 border-b border-[#58111A]/10 bg-[#FAF7F2]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between border-b border-[#58111A]/15 pb-4 mb-12">
            <div>
              <span className="text-xs font-mono uppercase text-[#D97706] tracking-widest flex items-center gap-1.5">
                <Sun size={14} /> CADENCE SOLAIRE DU SOLSTICE
              </span>
              <h2 className="text-3xl sm:text-5xl font-light uppercase tracking-tight mt-1" style={{ fontFamily: '"Playfair Display", serif' }}>
                LE PLANNING DE LA LUMIÈRE
              </h2>
            </div>
            <span className="text-xs font-mono text-[#58111A] hidden sm:inline">COUCHER DU SOLEIL : 16H42</span>
          </div>

          <div className="space-y-4">
            {winterLightPlanning.map((item) => (
              <div
                key={item.hour}
                className="grid md:grid-cols-[120px_1fr] items-start p-6 rounded-2xl bg-white border border-[#58111A]/10 hover:border-[#D97706] transition"
              >
                <div className="text-2xl font-mono font-bold text-[#58111A]">{item.hour}</div>
                <div>
                  <h3 className="text-base font-bold uppercase tracking-wider text-[#291417]">{item.title}</h3>
                  <p className="text-xs text-[#291417]/70 mt-1 font-light leading-relaxed">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULE 3 : DÉGUSTATION DE VINS RARES DE MONTAGNE */}
      <section id="vins-rares" className="py-24 sm:py-36 px-4 sm:px-8 bg-[#F2ECE2]/50">
        <div className="max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl bg-white border border-[#58111A]/15 shadow-xl text-center">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D97706] font-bold">SOMMELLERIE DE LA NUIT BLANCHE</span>
          <h3 className="text-2xl sm:text-3xl font-light uppercase text-[#291417] mt-2" style={{ fontFamily: '"Playfair Display", serif' }}>
            RÉSERVER VOTRE CRU DU FOYER
          </h3>
          <p className="text-xs sm:text-sm text-[#291417]/75 mt-2 font-light leading-relaxed">
            Pour accompagner le dîner au coin du feu, le sommelier a sélectionné trois pépites des terroirs alpins et jurassiens.
          </p>

          <div className="mt-6 space-y-2 text-left">
            {[
              'Vin Jaune du Jura 2014 & Vieux Comté 36 mois',
              'Côte-Rôtie Brune & Blonde 2016 (Maison Guigal)',
              'Chignin-Bergeron Rares Grains Nobles 2018',
            ].map((wine) => (
              <button
                key={wine}
                onClick={() => setSelectedWine(wine)}
                className={`w-full p-3.5 rounded-xl border text-xs text-left transition ${
                  selectedWine === wine
                    ? 'bg-[#58111A] text-white border-[#58111A] font-semibold'
                    : 'bg-[#FAF7F2] border-[#58111A]/15 text-[#291417] hover:border-[#58111A]/40'
                }`}
              >
                {wine}
              </button>
            ))}
          </div>

          {toastConfirmed ? (
            <div className="mt-6 p-4 rounded-xl bg-emerald-50 text-xs font-semibold text-emerald-800 flex items-center justify-center gap-2">
              <Check size={18} /> Votre bouteille est chambrée à température idéale au Grand Foyer.
            </div>
          ) : (
            <button
              onClick={() => selectedWine && setToastConfirmed(true)}
              disabled={!selectedWine}
              className="mt-6 w-full py-3.5 rounded-xl bg-[#58111A] text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#781724] transition disabled:opacity-40"
            >
              Confirmer pour ma table
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-xs tracking-[0.2em] uppercase text-[#291417]/60 border-t border-[#58111A]/10 bg-[#FAF7F2]">
        ADAM & ÉLÉONORE — 12 DÉCEMBRE 2026 // SCÉNOGRAPHIE : SOLSTICE D’HIVER PAR LE MONDE AIME
      </footer>
    </div>
  );
}
