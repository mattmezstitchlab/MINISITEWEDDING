import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Moon, Compass, Check, Feather, Cloud } from 'lucide-react';

export default function MaisonAnomalieSite() {
  const [rsvpSent, setRsvpSent] = useState(false);
  const [chimereChosen, setChimereChosen] = useState('Le Poisson Volant');

  const lodgings = [
    { title: 'La Tour aux Miroirs', place: 'Cime des chênes', desc: 'Une suite suspendue à 12 mètres, entourée de verres réfléchissant le ciel et les feuillages.' },
    { title: 'La Cabane Flottante', place: 'Étang des songes', desc: 'Accessible uniquement en barque en bois sculpté. Réveil au chant des grenouilles dorées.' },
    { title: 'Les Roulottes de Soie', place: 'Clairière des poètes', desc: 'Trois roulottes d’antan tendues de velours rose poudré et de draps en lin brodé.' },
  ];

  return (
    <div className="bg-[#E2EEF8] text-[#0B192C] min-h-screen selection:bg-[#F4ACB7] selection:text-[#0B192C]" style={{ fontFamily: '"DM Sans", "Plus Jakarta Sans", sans-serif' }}>
      {/* Oniric Top Bar */}
      <div className="border-b border-[#0B192C]/10 px-4 sm:px-8 py-3 flex items-center justify-between text-xs tracking-[0.25em] uppercase font-medium bg-[#E2EEF8]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Cloud size={15} className="text-[#F4ACB7]" />
          <span>MAISON ANOMALIE // ÉPISODE ONIRIQUE</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[12px]">
          <a href="#conte" className="hover:text-[#D4AF37] transition">Le Conte</a>
          <a href="#hebergements" className="hover:text-[#D4AF37] transition">Hébergements Insolites</a>
          <a href="#chimere" className="hover:text-[#D4AF37] transition">RSVP Chimérique</a>
        </div>
        <div className="text-[11px] px-3 py-1 rounded-full bg-white/70 border border-[#0B192C]/10 font-serif italic">
          12 Juin 2027
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative min-h-[92vh] flex flex-col justify-center items-center text-center p-6 sm:p-12 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/packages/anomalie.jpg"
            alt="Zéphir et Olympe Maison Anomalie"
            className="w-full h-full object-cover opacity-90 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#E2EEF8]/40 via-[#E2EEF8]/30 to-[#E2EEF8]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur border border-[#0B192C]/10 text-xs tracking-[0.25em] uppercase text-[#0B192C] mb-6 shadow-sm">
            <Feather size={14} className="text-[#D4AF37]" /> Ceci n’est pas un mariage conventionnel
          </motion.div>

          <motion.h1
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-[clamp(3.2rem,11vw,8rem)] leading-[0.98] font-light tracking-tight text-[#0B192C]"
            style={{ fontFamily: '"Playfair Display", "Italiana", serif' }}
          >
            Zéphir <span className="italic font-normal text-[#D4AF37]">&</span> Olympe
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-base sm:text-xl font-serif italic text-[#0B192C]/80 max-w-xl mx-auto leading-relaxed"
          >
            « Un songe éveillé au Jardin des Chimères. Là où les statues pleurent de la glace à la fraise et où le temps suspend son vol. »
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="#conte" className="px-8 py-3.5 rounded-full bg-[#0B192C] text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#D4AF37] transition shadow-md">
              Lire le conte
            </a>
            <a href="#chimere" className="px-8 py-3.5 rounded-full bg-white/90 border border-[#0B192C]/15 text-[#0B192C] text-xs tracking-[0.2em] uppercase font-medium hover:bg-white transition shadow-sm">
              Répondre au sortilège
            </a>
          </motion.div>
        </div>
      </header>

      {/* Le Conte Décalé */}
      <section id="conte" className="py-24 sm:py-36 px-6 sm:px-12 bg-white/70 backdrop-blur-sm border-y border-[#0B192C]/10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-[#D4AF37] font-semibold">LE PROTOCOLE DES CHIMÈRES</span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-light tracking-tight" style={{ fontFamily: '"Playfair Display", "Italiana", serif' }}>
            Comment deux météores ont dévié leur course
          </h2>

          <div className="mt-10 space-y-6 text-base sm:text-lg leading-[1.9] text-[#0B192C]/85 font-light text-left border-l-2 border-[#F4ACB7] pl-6 sm:pl-8">
            <p>
              Il était une fois un mardi ordinaire où les lois de la gravité décidèrent de faire grève. Zéphir portait une pomme verte sur le sommet de son chapeau, et Olympe tenait un parapluie sous lequel il pleuvait des confettis de lumière.
            </p>
            <p>
              Ils se sont regardés, ont éclaté de rire, et l'univers s'est accordé à leur folie douce. Depuis ce jour, ils collectionnent les horloges arrêtées à minuit et les coquillages qui chuchotent des secrets d'amour.
            </p>
            <p>
              Le 12 Juin 2027, ils ouvrent les grilles du <em>Jardin des Chimères</em> pour que leurs amis deviennent les complices de cette rêverie sans fin.
            </p>
          </div>
        </div>
      </section>

      {/* Hébergements Insolites */}
      <section id="hebergements" className="py-24 sm:py-36 px-6 sm:px-12 bg-[#E2EEF8]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs tracking-[0.3em] uppercase text-[#D4AF37] font-semibold">REPOS ONIRIQUE</span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-light tracking-tight" style={{ fontFamily: '"Playfair Display", "Italiana", serif' }}>
              Dormir parmi les songes
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#0B192C]/70">
              Pour prolonger l'enchantement, nous avons privatisé des nids poétiques autour du domaine.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {lodgings.map((item) => (
              <div
                key={item.title}
                className="p-8 rounded-3xl bg-white/80 border border-[#0B192C]/10 shadow-[0_15px_40px_rgba(11,25,44,0.05)] flex flex-col justify-between hover:-translate-y-1 transition duration-300"
              >
                <div>
                  <span className="text-[11px] tracking-[0.2em] uppercase text-[#D4AF37] font-semibold">{item.place}</span>
                  <h3 className="mt-2 text-2xl font-light" style={{ fontFamily: '"Playfair Display", serif' }}>{item.title}</h3>
                  <p className="mt-3 text-sm text-[#0B192C]/75 leading-relaxed font-light">{item.desc}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-[#0B192C]/10 flex items-center justify-between text-xs font-medium text-[#0B192C]">
                  <span>Capacité 2 personnes</span>
                  <span className="px-3 py-1 rounded-full bg-[#E2EEF8] text-[#0B192C]">Réservation mariés</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP Surréaliste */}
      <section id="chimere" className="py-24 sm:py-36 px-6 sm:px-12 bg-white/60 backdrop-blur-md border-t border-[#0B192C]/10">
        <div className="max-w-2xl mx-auto p-8 sm:p-12 rounded-[2.5rem] bg-white border border-[#0B192C]/10 shadow-[0_20px_60px_rgba(11,25,44,0.06)] text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-[#D4AF37] font-semibold">FORMULAIRE DE SORTILÈGE</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-light" style={{ fontFamily: '"Playfair Display", "Italiana", serif' }}>
            Prendrez-vous part au mirage ?
          </h2>
          <p className="mt-2 text-sm text-[#0B192C]/70">Répondez avant la prochaine pleine lune.</p>

          {rsvpSent ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-8 p-6 rounded-2xl bg-[#E2EEF8] text-[#0B192C]">
              <Sparkles size={32} className="mx-auto text-[#D4AF37]" />
              <div className="text-xl font-light mt-2" style={{ fontFamily: '"Playfair Display", serif' }}>Votre sort a été scellé avec grâce.</div>
              <p className="text-xs text-[#0B192C]/70 mt-1">Les chimères vous attendent le 12 Juin 2027.</p>
            </motion.div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setRsvpSent(true); }} className="mt-8 space-y-5 text-left">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#0B192C]/70 mb-1 font-medium">Votre Nom d'humain</label>
                <input required placeholder="ex: Léonora Carrington" className="w-full px-5 py-3.5 rounded-2xl bg-[#E2EEF8]/40 border border-[#0B192C]/15 text-sm outline-none focus:border-[#D4AF37]" />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#0B192C]/70 mb-1 font-medium">Sous quelle forme assisterez-vous au mariage ?</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {['Le Poisson Volant', 'La Statue Émue', 'Le Nuage Voyageur', 'Le Poète Lucide'].map((ch) => (
                    <button
                      type="button"
                      key={ch}
                      onClick={() => setChimereChosen(ch)}
                      className={`p-3 rounded-xl border text-xs font-medium transition ${chimereChosen === ch ? 'bg-[#0B192C] text-white border-[#0B192C]' : 'bg-white border-[#0B192C]/15 hover:border-[#D4AF37]'}`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#0B192C]/70 mb-1 font-medium">Quel sort jetez-vous aux mariés pour l'éternité ?</label>
                <textarea rows={3} placeholder="« Que vos pas ne foulent jamais la terreur du quotidien… »" className="w-full px-5 py-3.5 rounded-2xl bg-[#E2EEF8]/40 border border-[#0B192C]/15 text-sm outline-none focus:border-[#D4AF37]" />
              </div>

              <button type="submit" className="w-full py-4 rounded-full bg-[#0B192C] text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#D4AF37] transition shadow-md">
                Expédier ma réponse au vent
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-xs tracking-[0.2em] uppercase text-[#0B192C]/60 border-t border-[#0B192C]/10">
        ZÉPHIR & OLYMPE — 12.06.2027 // ORGANISATION : MAISON ANOMALIE PAR LE MONDE AIME
      </footer>
    </div>
  );
}
