import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wine, Crown, Compass, Clock, Check, Sparkles, Utensils } from 'lucide-react';

export default function MaisonDesordreSite() {
  const [rsvpSent, setRsvpSent] = useState(false);
  const [dietChoice, setDietChoice] = useState('Festin Carné & Gibier Noble');

  const programme24h = [
    { hour: '15:00', label: 'ACCUEIL SUR LA LAGUNE & GONDÔLES PRIVÉES', place: 'Grand Canal // Embarcadère Nord' },
    { hour: '16:30', label: 'CÉRÉMONIE SOUS LES FRESQUES DU XVIIe', place: 'Salone dei Dogi // Palais Privatisé' },
    { hour: '18:00', label: 'COCKTAIL D’OR & HUÎTRES OUVERTES À LA VOLÉE', place: 'Terrasse sur l’eau // Jazz contemporain' },
    { hour: '20:30', label: 'LE GRAND BANQUET DU DÉSORDRE (7 SERVICES)', place: 'Table impériale 60 mètres // Lustres Murano' },
    { hour: '00:00', label: 'SABRAGE DU CHAMPAGNE & NUIT SAUVAGE', place: 'Crypte voûtée // Sound-system immersif' },
    { hour: '05:30', label: 'L’ESPRESSO DES SURVIVANTS & BRIOCHES CHAUDES', place: 'Quai des Soupirs // Premières lueurs' },
  ];

  return (
    <div className="bg-[#18181B] text-[#F5F5F0] min-h-screen selection:bg-[#6B121C] selection:text-white" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      {/* Top Banner */}
      <div className="border-b border-white/10 bg-[#121214] px-4 sm:px-8 py-3 flex items-center justify-between text-xs tracking-[0.25em] uppercase font-semibold text-[#A1A1AA]">
        <div className="flex items-center gap-2">
          <Crown size={15} className="text-[#C5A059]" />
          <span className="text-[#F5F5F0]">MAISON DÉSORDRE // HAUTE ARCHITECTURE DU CHAOS</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[11px]">
          <a href="#programme24h" className="hover:text-[#6B121C] transition">Programme 24h</a>
          <a href="#conciergerie" className="hover:text-[#6B121C] transition">Conciergerie</a>
          <a href="#banquet-rsvp" className="hover:text-[#6B121C] transition">RSVP Gastronomique</a>
        </div>
        <div className="text-[11px] font-mono text-[#C5A059] border border-[#C5A059]/30 px-3 py-1">
          VENISE 2026
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative min-h-[92vh] flex flex-col justify-end p-6 sm:p-14 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <img
            src="/images/packages/desordre.jpg"
            alt="Hector et Victoire Maison Désordre"
            className="w-full h-full object-cover contrast-125 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#18181B] via-[#18181B]/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#6B121C] text-white text-[11px] font-semibold tracking-[0.25em] uppercase mb-6">
            <Utensils size={13} /> Organisation Complète & Scénographie Baroque
          </div>

          <h1
            className="text-white uppercase leading-[0.92] tracking-tight font-normal text-[clamp(3.5rem,12vw,9.5rem)]"
            style={{ fontFamily: '"Cinzel", "Bodoni Moda", serif' }}
          >
            HECTOR <span className="text-[#C5A059] italic">&</span> VICTOIRE
          </h1>

          <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 border-t border-white/15">
            <div>
              <p className="text-xl sm:text-2xl font-light text-[#F5F5F0] tracking-wide" style={{ fontFamily: '"Cinzel", serif' }}>
                19 SEPTEMBRE 2026 — PALAZZO DEL CAOS, VENISE
              </p>
              <p className="text-sm text-[#A1A1AA] mt-1 font-light">
                Une célébration dionysiaque sur 24 heures. Aucune mesure. Rien que le sublime.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a href="#programme24h" className="px-8 py-3.5 bg-[#6B121C] text-white text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#851724] transition shadow-lg">
                Le Déroulé 24h
              </a>
              <a href="#banquet-rsvp" className="px-8 py-3.5 border border-white/30 text-white text-xs tracking-[0.2em] uppercase font-semibold hover:border-white transition">
                Confirmer
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Manifesto */}
      <section className="py-20 sm:py-28 px-6 sm:px-12 bg-[#121214] border-b border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-[#C5A059] font-semibold">L’OPULENCE D’UN BANQUET SANS FIN</span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-light tracking-tight leading-snug" style={{ fontFamily: '"Cinzel", serif' }}>
            « Nous maîtrisons le chaos pour que chaque seconde devienne une légende que l’on se raconte à voix basse. »
          </h2>
          <p className="mt-6 text-[#A1A1AA] text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
            La Maison Désordre signe pour Hector & Victoire une fresque vivante : 60 mètres de banquet en nappe de velours sombre, des milliers de cierges fondus, un opéra baroque surprise et un réveil au bord de l'eau.
          </p>
        </div>
      </section>

      {/* Programme 24h */}
      <section id="programme24h" className="py-24 sm:py-36 px-6 sm:px-12 border-b border-white/10 bg-[#18181B]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/15 pb-6 mb-16">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-[#6B121C] font-semibold">CADENCE ININTERROMPUE</span>
              <h2 className="text-4xl sm:text-5xl font-light uppercase tracking-tight mt-1" style={{ fontFamily: '"Cinzel", serif' }}>
                PROGRAMME 24H DU FESTIN
              </h2>
            </div>
            <span className="text-xs font-mono text-[#A1A1AA] tracking-widest uppercase">HORLOGE VÉNITIENNE</span>
          </div>

          <div className="space-y-6">
            {programme24h.map((item, idx) => (
              <motion.div
                key={item.hour}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="grid md:grid-cols-[120px_1fr_240px] items-center p-8 bg-[#1E1E22] border border-white/10 hover:border-[#6B121C] transition group"
              >
                <div className="text-3xl font-light text-[#C5A059] tabular-nums" style={{ fontFamily: '"Cinzel", serif' }}>
                  {item.hour}
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-wide uppercase group-hover:text-white transition">{item.label}</h3>
                </div>
                <div className="text-sm text-[#A1A1AA] font-light md:text-right mt-2 md:mt-0">
                  {item.place}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Conciergerie */}
      <section id="conciergerie" className="py-24 sm:py-36 px-6 sm:px-12 bg-[#121214] border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs tracking-[0.3em] uppercase text-[#C5A059] font-semibold">SERVICE AUX CONVIVES</span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-light uppercase tracking-tight" style={{ fontFamily: '"Cinzel", serif' }}>
              CONCIERGERIE PRIVÉE DÉDIÉE
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#A1A1AA] font-light">
              Parce que le luxe absolu est de ne se soucier de rien, notre équipe de régisseurs et majordomes prend tout en charge.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-8 bg-[#18181B] border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-[#C5A059]">01 // TRANSPORT</span>
                <h3 className="text-xl font-semibold uppercase mt-3">TRANSFERTS BATEAU-TAXI</h3>
                <p className="mt-3 text-sm text-[#A1A1AA] leading-relaxed font-light">
                  Liaisons privées en canot Riva depuis l'aéroport Marco Polo et la gare Santa Lucia jusqu’au ponton du palais.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/10 text-xs text-[#6B121C] font-semibold uppercase tracking-wider">
                Inclus pour tous les invités
              </div>
            </div>

            <div className="p-8 bg-[#18181B] border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-[#C5A059]">02 // COUTURE</span>
                <h3 className="text-xl font-semibold uppercase mt-3">ATELIER RETOUCHES D'URGENCE</h3>
                <p className="mt-3 text-sm text-[#A1A1AA] leading-relaxed font-light">
                  Une maîtresse-tailleur vénitienne présente dès 14h00 pour ajuster smokings, boutons et longueurs de robes.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/10 text-xs text-[#6B121C] font-semibold uppercase tracking-wider">
                Salon privé n°3
              </div>
            </div>

            <div className="p-8 bg-[#18181B] border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-[#C5A059]">03 // GASTRONOMIE</span>
                <h3 className="text-xl font-semibold uppercase mt-3">SOMMELLERIE SUR-MESURE</h3>
                <p className="mt-3 text-sm text-[#A1A1AA] leading-relaxed font-light">
                  Carte des vins rares et dégustation personnalisée pour chaque convive selon vos préférences oenologiques.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/10 text-xs text-[#6B121C] font-semibold uppercase tracking-wider">
                Sélection Grands Crus
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Gastronomique */}
      <section id="banquet-rsvp" className="py-24 sm:py-36 px-6 sm:px-12 bg-[#18181B]">
        <div className="max-w-2xl mx-auto p-8 sm:p-12 border border-[#C5A059]/40 bg-[#141416] shadow-2xl">
          <div className="text-center">
            <span className="text-xs tracking-[0.3em] uppercase text-[#C5A059] font-semibold">TABLE D'HONNEUR</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-light uppercase tracking-tight" style={{ fontFamily: '"Cinzel", serif' }}>
              RÉPONSE AU FESTIN
            </h2>
            <p className="mt-2 text-sm text-[#A1A1AA] font-light">Confirmez vos exigences de table et de transfert vénitien.</p>
          </div>

          {rsvpSent ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-8 p-6 bg-[#6B121C] text-white text-center">
              <Check size={32} className="mx-auto text-[#C5A059]" />
              <div className="text-xl font-light mt-2" style={{ fontFamily: '"Cinzel", serif' }}>VOTRE PLACE EST SCÈLÉE AU FESTIN</div>
              <p className="text-xs text-white/80 mt-1">Le majordome a pris note de vos souhaits gastronomiques.</p>
            </motion.div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setRsvpSent(true); }} className="mt-8 space-y-5 text-left">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A1A1AA] mb-1 font-semibold">Nom & Titre de vos convives</label>
                <input required placeholder="ex: Comte & Comtesse de Montmirail" className="w-full px-5 py-3.5 bg-[#1E1E22] border border-white/15 text-sm text-white outline-none focus:border-[#C5A059]" />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A1A1AA] mb-1 font-semibold">Orientation Gastronomique (7 Services)</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {['Festin Carné & Gibier Noble', 'Inspiration Halieutique de la Mer Adriatique', 'Haute Cuisine Végétale Vénitienne'].map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setDietChoice(opt)}
                      className={`p-3.5 border text-xs font-semibold uppercase tracking-wider text-left transition ${dietChoice === opt ? 'bg-[#6B121C] text-white border-[#6B121C]' : 'bg-[#1E1E22] border-white/10 text-[#A1A1AA] hover:border-[#C5A059]'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A1A1AA] mb-1 font-semibold">Arrivée à Venise & Transfert Bateau</label>
                <input placeholder="ex: Vol AF1420 arrivée 11h30 Marco Polo" className="w-full px-5 py-3.5 bg-[#1E1E22] border border-white/15 text-sm text-white outline-none focus:border-[#C5A059]" />
              </div>

              <button type="submit" className="w-full py-4 bg-[#C5A059] text-black text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#d8b56f] transition mt-6">
                Enregistrer ma présence au banquet
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-xs tracking-[0.2em] uppercase text-[#A1A1AA] border-t border-white/10 bg-[#121214]">
        HECTOR & VICTOIRE — 19.09.2026 // ORGANISATION : MAISON DÉSORDRE PAR LE MONDE AIME
      </footer>
    </div>
  );
}
