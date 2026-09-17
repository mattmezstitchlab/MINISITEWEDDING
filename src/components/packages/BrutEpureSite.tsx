import { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Feather, MapPin, Wind, Sparkles, Heart, Check, Mountain, Radio } from 'lucide-react';

export default function BrutEpureSite() {
  const [activeStep, setActiveStep] = useState(0);
  const [streamJoined, setStreamJoined] = useState(false);
  const [guestNote, setGuestNote] = useState('');
  const [noteSent, setNoteSent] = useState(false);

  const itinerary = [
    { hour: '07:30', name: 'Ascension aux premières lueurs', desc: 'Marche silencieuse à travers les sentiers de genévriers sauvages jusqu’au promontoire de basalte.' },
    { hour: '09:00', name: 'L’Échange des Serments Minéraux', desc: 'Cérémonie intime face aux vagues de l’océan. Échange des alliances gravées dans la roche.' },
    { hour: '11:00', name: 'Banquet Nomade & Vins Sauvages', desc: 'Table basse en bois flotté, vaisselle en grès brut tournée à la main et poissons levés du matin.' },
    { hour: '16:00', name: 'Bains Chauds dans la Faille Volcanique', desc: 'Repos en eau thermale naturelle sous les brumes de l’après-midi.' },
  ];

  return (
    <div className="bg-[#EBE7DF] text-[#2C2B29] min-h-screen selection:bg-[#606C5D] selection:text-white" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      {/* Top Banner */}
      <div className="border-b border-[#2C2B29]/10 bg-[#E2DCD2] px-4 sm:px-8 py-3 flex items-center justify-between text-xs tracking-[0.25em] uppercase font-semibold text-[#606C5D]">
        <div className="flex items-center gap-2">
          <Mountain size={14} />
          <span className="text-[#2C2B29]">BRUT & ÉPURE // ELOPEMENT SAUVAGE & MINÉRALITÉ PURE</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[11px] text-[#2C2B29]/70">
          <a href="#recit-poetique" className="hover:text-[#2C2B29] transition">Récit Poétique</a>
          <a href="#carte-secrete" className="hover:text-[#2C2B29] transition">Carte du Lieu Secret</a>
          <a href="#diffusion-intime" className="hover:text-[#2C2B29] transition">Streaming Privé</a>
        </div>
        <div className="text-[11px] font-mono text-[#606C5D] border border-[#606C5D]/40 px-3 py-1 rounded-full">
          ÉVASION 12 INVITÉS
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative min-h-[92vh] flex flex-col justify-end p-6 sm:p-14 overflow-hidden border-b border-[#2C2B29]/10">
        <div className="absolute inset-0">
          <img
            src="/images/packages/brut-epure.jpg"
            alt="Brut et Épure Elopement"
            className="w-full h-full object-cover filter contrast-105 brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#EBE7DF] via-[#EBE7DF]/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2C2B29]/10 backdrop-blur-md text-[#2C2B29] text-[11px] tracking-[0.25em] uppercase font-semibold mb-6">
            <Feather size={13} /> Elopement Sauvage & Intimité Tellurique
          </div>

          <h1
            className="text-[#2C2B29] uppercase leading-[0.92] tracking-tight font-light text-[clamp(3.5rem,11vw,9rem)]"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            AUREL <span className="italic font-normal text-[#606C5D]">&</span> ISOLDE
          </h1>

          <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 border-t border-[#2C2B29]/15">
            <div>
              <p className="text-xl sm:text-2xl font-light text-[#2C2B29] tracking-wide" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                08 JUIN 2026 — FALAISES DE BASALTE, ÎLE D’ELBE
              </p>
              <p className="text-sm text-[#2C2B29]/70 mt-1 font-light">
                Le vent, la roche et la mer pour seuls témoins. L'essentiel sans aucun artifice.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a href="#recit-poetique" className="px-7 py-3.5 rounded-full bg-[#2C2B29] text-white text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#606C5D] transition shadow-lg">
                Lire le Récit
              </a>
              <a href="#diffusion-intime" className="px-7 py-3.5 rounded-full border border-[#2C2B29]/40 text-[#2C2B29] text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#2C2B29]/5 transition">
                Accès Streaming Privé
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* MODULE 1 : RÉCIT POÉTIQUE DE LA CÉRÉMONIE INTIME */}
      <section id="recit-poetique" className="py-24 sm:py-36 px-4 sm:px-8 border-b border-[#2C2B29]/10 bg-[#E2DCD2]/40">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-[#606C5D] font-semibold">LE MANIFESTE DE L’ÉLOIGNEMENT</span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-light tracking-tight leading-snug" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            « Nous n’avons invité que ceux qui savent écouter le silence des pierres. »
          </h2>
          <p className="mt-8 text-[#2C2B29]/80 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Pour Aurel & Isolde, la promesse ne se crie pas dans une cathédrale dorée : elle se murmure au bord du vide, enveloppée dans un lin brut balayé par les embruns. Un elopement sauvage conçu sur-mesure par Le Monde Aime.
          </p>

          <div className="mt-16 grid sm:grid-cols-3 gap-8 text-left">
            <div className="p-6 rounded-2xl bg-white/60 border border-[#2C2B29]/10">
              <span className="text-xs font-mono text-[#606C5D] block">01 // MATÉRIAUX</span>
              <h3 className="font-semibold text-[#2C2B29] text-lg mt-1" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Grès & Lin Pur</h3>
              <p className="text-xs text-[#2C2B29]/70 mt-2 font-light leading-relaxed">
                Toutes les textures utilisées sur place sont d’origine tellurique : céramiques d’artisan, lins non teints et bois flotté.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/60 border border-[#2C2B29]/10">
              <span className="text-xs font-mono text-[#606C5D] block">02 // BOTANIQUE</span>
              <h3 className="font-semibold text-[#2C2B29] text-lg mt-1" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Végétation Spontanée</h3>
              <p className="text-xs text-[#2C2B29]/70 mt-2 font-light leading-relaxed">
                Aucune fleur coupée importée. Seuls les genévriers sauvages, l’immortelle des dunes et la sauge fraîche cueillis sur le sentier.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/60 border border-[#2C2B29]/10">
              <span className="text-xs font-mono text-[#606C5D] block">03 // TIMING</span>
              <h3 className="font-semibold text-[#2C2B29] text-lg mt-1" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Rythme des Éléments</h3>
              <p className="text-xs text-[#2C2B29]/70 mt-2 font-light leading-relaxed">
                L’heure des vœux est déterminée par le reflux de la marée et le déclin des vents solaires du matin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MODULE 2 : CARTE INTERACTIVE DU LIEU SECRET D'ELOPEMENT */}
      <section id="carte-secrete" className="py-24 sm:py-36 px-4 sm:px-8 border-b border-[#2C2B29]/10 bg-[#EBE7DF]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#2C2B29]/15">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-[#606C5D] font-semibold flex items-center gap-1.5">
                <Compass size={14} /> GÉOLOCALISATION CONFIDENTIELLE
              </span>
              <h2 className="text-4xl sm:text-5xl font-light uppercase tracking-tight mt-1" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                L’ITINÉRAIRE SAUVAGE DU JOUR J
              </h2>
            </div>
            <p className="text-sm text-[#2C2B29]/70 max-w-sm font-light leading-relaxed">
              Pour préserver l'inviolabilité du promontoire, les coordonnées GPS précises ne sont révélées qu'aux 12 convives conviés.
            </p>
          </div>

          <div className="mt-12 grid lg:grid-cols-[1fr_360px] gap-8 items-stretch">
            {/* Steps interactive list */}
            <div className="space-y-4">
              {itinerary.map((item, idx) => (
                <div
                  key={item.hour}
                  onClick={() => setActiveStep(idx)}
                  className={`p-6 rounded-2xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    activeStep === idx
                      ? 'bg-white border-[#606C5D] shadow-md'
                      : 'bg-white/40 border-[#2C2B29]/10 hover:border-[#606C5D]/40'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <span className="text-xl font-mono text-[#606C5D] font-bold">{item.hour}</span>
                    <div>
                      <h4 className="text-base font-semibold text-[#2C2B29]">{item.name}</h4>
                      <p className="text-xs text-[#2C2B29]/70 mt-1 font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#606C5D] shrink-0 font-medium">POINT 0{idx + 1}</span>
                </div>
              ))}
            </div>

            {/* Secret map briefing card */}
            <div className="p-8 rounded-3xl bg-[#E2DCD2] border border-[#2C2B29]/15 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-[#606C5D] uppercase tracking-widest">ZONE PROTÉGÉE</span>
                <h3 className="text-2xl font-light uppercase mt-2 text-[#2C2B29]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                  CONSIGNES DE SÉCURITÉ NOMADE
                </h3>
                <p className="text-xs text-[#2C2B29]/70 mt-3 font-light leading-relaxed">
                  Prévoir des chaussures de marche adaptées aux pierres plates. Des couvertures de laine vierge et des thermos de thé fumé seront remis au point de départ.
                </p>

                <div className="mt-6 p-4 rounded-xl bg-white/70 border border-[#2C2B29]/10 text-xs font-mono space-y-1">
                  <div>LAT : 42.7667° N</div>
                  <div>LONG : 10.2333° E</div>
                  <div>ALTITUDE : 142m au-dessus de la mer</div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#2C2B29]/10 text-xs text-[#606C5D] font-semibold flex items-center gap-2">
                <MapPin size={14} /> Accès par sentier côtier exclusivement
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODULE 3 : STREAMING PRIVÉ HAUTE DÉFINITION POUR LES PROCHES ÉLOIGNÉS */}
      <section id="diffusion-intime" className="py-24 sm:py-36 px-4 sm:px-8 bg-[#E2DCD2]/50">
        <div className="max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl bg-white border border-[#2C2B29]/15 shadow-xl text-center">
          <div className="w-12 h-12 rounded-full bg-[#606C5D]/10 text-[#606C5D] flex items-center justify-center mx-auto mb-4">
            <Radio size={22} className={streamJoined ? 'animate-pulse' : ''} />
          </div>

          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#606C5D] font-bold">LIAISON STREAMING CONFIDENTIELLE</span>
          <h3 className="text-2xl sm:text-3xl font-light uppercase text-[#2C2B29] mt-2" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            SUIVRE L’ÉCHANGE DES VŒUX EN DIRECT
          </h3>
          <p className="text-xs sm:text-sm text-[#2C2B29]/70 mt-2 font-light leading-relaxed">
            Pour les familles et amis restés au loin, une captation discrète 4K avec micro d’ambiance binaurale retransmet les vœux en direct.
          </p>

          {!streamJoined ? (
            <button
              onClick={() => setStreamJoined(true)}
              className="mt-8 px-8 py-4 rounded-full bg-[#2C2B29] text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#606C5D] transition shadow-lg"
            >
              Rejoindre le cercle privé de diffusion
            </button>
          ) : (
            <div className="mt-8 p-6 rounded-2xl bg-[#EBE7DF] border border-[#606C5D]/40 text-left space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-[#606C5D]">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 animate-ping" /> LIAISON ÉTABLIE</span>
                <span>SIGNAL 4K CRYPTÉ</span>
              </div>
              <p className="text-xs text-[#2C2B29]/80 font-light">
                Le flux commencera le 08 Juin à 09h00 précises. Vous pouvez déposer ici un mot d’amour qui sera lu par Aurel & Isolde au sommet de la falaise.
              </p>

              {noteSent ? (
                <div className="p-3 bg-white rounded-xl text-xs font-semibold text-emerald-700 flex items-center gap-2">
                  <Check size={16} /> Votre mot d’amour a été gravé sur le carnet des vœux.
                </div>
              ) : (
                <div className="space-y-2 pt-2">
                  <textarea
                    rows={2}
                    value={guestNote}
                    onChange={(e) => setGuestNote(e.target.value)}
                    placeholder="Votre message intime pour les mariés..."
                    className="w-full p-3 rounded-xl bg-white border border-[#2C2B29]/15 text-xs text-[#2C2B29] outline-none focus:border-[#606C5D]"
                  />
                  <button
                    onClick={() => guestNote && setNoteSent(true)}
                    className="w-full py-2.5 rounded-xl bg-[#606C5D] text-white text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition"
                  >
                    Envoyer ma bénédiction
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-xs tracking-[0.2em] uppercase text-[#2C2B29]/60 border-t border-[#2C2B29]/10 bg-[#EBE7DF]">
        AUREL & ISOLDE — 08 JUIN 2026 // SCÉNOGRAPHIE : BRUT & ÉPURE PAR LE MONDE AIME
      </footer>
    </div>
  );
}
