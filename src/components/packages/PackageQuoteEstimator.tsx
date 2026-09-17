import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Users, MapPin, Check, ArrowRight, ArrowLeft, Shield, Send } from 'lucide-react';
import { PACKAGES_DATA, PackageData } from '../../data/packagesData';

interface PackageQuoteEstimatorProps {
  onSelectPackage: (id: PackageData['id']) => void;
}

export default function PackageQuoteEstimator({ onSelectPackage }: PackageQuoteEstimatorProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [targetDate, setTargetDate] = useState('2027');
  const [guestCount, setGuestCount] = useState('80-150');
  const [venueVibe, setVenueVibe] = useState('Palais historique ou Galerie d’art');
  const [creativeAmbition, setCreativeAmbition] = useState('Haute architecture & Fête multi-jours');

  // Contact info
  const [names, setNames] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Calculate recommended package based on selections
  const getRecommendedPackage = (): PackageData => {
    if (creativeAmbition.includes('multi-jours') || guestCount === '150+') {
      return PACKAGES_DATA.find((p) => p.id === 'orbite') || PACKAGES_DATA[11];
    }
    if (creativeAmbition.includes('architecture') || venueVibe.includes('Palais')) {
      return PACKAGES_DATA.find((p) => p.id === 'desordre') || PACKAGES_DATA[8];
    }
    if (creativeAmbition.includes('transe') || creativeAmbition.includes('Nuit')) {
      return PACKAGES_DATA.find((p) => p.id === 'nocturne-volcan') || PACKAGES_DATA[3];
    }
    if (venueVibe.includes('Falaises') || guestCount === '2-20') {
      return PACKAGES_DATA.find((p) => p.id === 'brut-epure') || PACKAGES_DATA[1];
    }
    if (creativeAmbition.includes('Éco-luxe')) {
      return PACKAGES_DATA.find((p) => p.id === 'ciel-oublie') || PACKAGES_DATA[5];
    }
    if (venueVibe.includes('Méditerranée')) {
      return PACKAGES_DATA.find((p) => p.id === 'nomade-horizon') || PACKAGES_DATA[9];
    }
    return PACKAGES_DATA.find((p) => p.id === 'irreverence') || PACKAGES_DATA[2];
  };

  const recommendedPkg = getRecommendedPackage();

  return (
    <section id="contact-devis" className="py-24 sm:py-36 px-4 sm:px-8 bg-[#09090C] text-white border-t border-white/10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-[#C5A059]">
            <Sparkles size={14} />
            <span>DIAGNOSTIC CRÉATIF & DEVIS SUR-MESURE</span>
          </div>
          <h2 className="mt-3 text-3xl sm:text-5xl font-light uppercase tracking-tight text-white" style={{ fontFamily: '"Cinzel", serif' }}>
            QUALIFIER VOTRE PROJET DE MARIAGE
          </h2>
          <p className="mt-3 text-sm text-[#A1A1AA] font-light">
            En 3 questions, notre algorithme scénographique identifie le package d’agence et l’estimation budgétaire adaptés à vos ambitions.
          </p>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="grid grid-cols-4 gap-2 mb-10 pb-6 border-b border-white/10">
          {[
            { n: 1, label: '01. Temporalité' },
            { n: 2, label: '02. Cadre' },
            { n: 3, label: '03. Ambition' },
            { n: 4, label: '04. Diagnostic' },
          ].map((s) => (
            <div
              key={s.n}
              className={`text-center py-2 text-xs font-mono tracking-wider uppercase border-b-2 transition ${
                step === s.n
                  ? 'border-[#C5A059] text-[#C5A059] font-bold'
                  : step > s.n
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-white/10 text-white/30'
              }`}
            >
              {s.label}
            </div>
          ))}
        </div>

        {/* Step 1: Date & Guests */}
        {step === 1 && (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#121216] border border-white/10 shadow-2xl space-y-8">
            <h3 className="text-2xl font-light uppercase text-white" style={{ fontFamily: '"Cinzel", serif' }}>
              Quand et avec qui imaginez-vous célébrer ?
            </h3>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A1A1AA] mb-3 font-semibold">Année ou Période envisagée</label>
              <div className="grid sm:grid-cols-3 gap-3">
                {['Saison 2026', 'Saison 2027', '2028 ou Date libre'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setTargetDate(d)}
                    className={`p-4 rounded-xl border text-xs font-semibold uppercase tracking-wider text-center transition ${
                      targetDate === d
                        ? 'bg-white text-black border-white shadow-md'
                        : 'bg-black/40 border-white/10 text-[#A1A1AA] hover:border-white/30'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A1A1AA] mb-3 font-semibold">Format de convives estimé</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: '2-20', label: '2 à 20 convives (Intimité / Elopement)' },
                  { id: '30-80', label: '30 à 80 convives (Écrin intimiste)' },
                  { id: '80-150', label: '80 à 150 convives (Format grand banquet)' },
                  { id: '150+', label: '150+ convives (Festival multi-jours)' },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGuestCount(g.id)}
                    className={`p-4 rounded-xl border text-xs text-center transition ${
                      guestCount === g.id
                        ? 'bg-[#C5A059] text-black border-[#C5A059] font-bold shadow-md'
                        : 'bg-black/40 border-white/10 text-[#A1A1AA] hover:border-white/30'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-4 rounded-full bg-white text-black text-xs font-semibold uppercase tracking-[0.2em] hover:bg-neutral-200 transition flex items-center justify-center gap-2"
            >
              <span>Étape suivante : Le Cadre Scénographique</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* Step 2: Venue Vibe */}
        {step === 2 && (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#121216] border border-white/10 shadow-2xl space-y-8">
            <h3 className="text-2xl font-light uppercase text-white" style={{ fontFamily: '"Cinzel", serif' }}>
              Quel univers visuel résonne avec votre histoire ?
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Rooftop urbain ou Galerie brutaliste contemporaine', desc: 'Lignes épurées, flash direct, chic urbain' },
                { label: 'Falaises sauvages ou Promontoire secret', desc: 'Minéralité tellurique, vent, roches et solitude poétique' },
                { label: 'Serre de verre onirique ou Jardin de château', desc: 'Surréalisme, miroirs flottants, profusion de roses' },
                { label: 'Palais historique ou Grand hôtel particulier', desc: 'Baroque moderne, tables impériales, lustres de Murano' },
                { label: 'Finca méditerranéenne en bord de mer', desc: 'Terracotta, oliviers centenaires, brise marine' },
                { label: 'Îlot vierge ou Lieu vierge à bâtir de toutes pièces', desc: 'Structures éphémères pop-up, autonomie 100%' },
              ].map((v) => (
                <button
                  key={v.label}
                  type="button"
                  onClick={() => setVenueVibe(v.label)}
                  className={`p-5 rounded-2xl border text-left transition flex flex-col justify-between ${
                    venueVibe === v.label
                      ? 'bg-white text-black border-white shadow-xl'
                      : 'bg-black/40 border-white/10 text-[#A1A1AA] hover:border-white/30'
                  }`}
                >
                  <strong className="text-sm font-semibold">{v.label}</strong>
                  <span className={`text-xs mt-2 font-light ${venueVibe === v.label ? 'text-black/70' : 'text-[#71717A]'}`}>
                    {v.desc}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-4 rounded-full border border-white/20 text-white text-xs uppercase tracking-wider hover:bg-white/10"
              >
                <ArrowLeft size={14} className="inline mr-1" /> Retour
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-4 rounded-full bg-white text-black text-xs font-semibold uppercase tracking-[0.2em] hover:bg-neutral-200 transition flex items-center justify-center gap-2"
              >
                <span>Étape suivante : L’Ambition Créative</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Creative Ambition */}
        {step === 3 && (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#121216] border border-white/10 shadow-2xl space-y-8">
            <h3 className="text-2xl font-light uppercase text-white" style={{ fontFamily: '"Cinzel", serif' }}>
              Quelle expérience souhaitez-vous faire vivre à vos convives ?
            </h3>

            <div className="space-y-3">
              {[
                { label: 'Cadence horlogère & Live Content 24h sans filtre', desc: 'Zéro stress, captation verticale en direct et diffusion des rushs sous 24h.' },
                { label: 'Fashion Statement & Direction Artistique Subversive', desc: 'Dress-code sans compromis, lookbook d’invités et validation couture.' },
                { label: 'Nuit transe clubbing & Mixologie d’auteur', desc: 'Sound-system Fonction-One, cocktails moléculaires et fête jusqu’à l’aube.' },
                { label: 'Haute architecture & Fête multi-jours', desc: 'Célébration sur 2 à 4 jours avec conciergerie VIP, transferts et logistique totale.' },
                { label: 'Éco-luxe régénératif & Sourcing 100% pur', desc: 'Bilan carbone neutre, revalorisation florale et gastronomie végétale locale.' },
              ].map((amb) => (
                <button
                  key={amb.label}
                  type="button"
                  onClick={() => setCreativeAmbition(amb.label)}
                  className={`w-full p-5 rounded-2xl border text-left transition flex flex-col justify-between ${
                    creativeAmbition === amb.label
                      ? 'bg-[#C5A059] text-black border-[#C5A059] shadow-xl'
                      : 'bg-black/40 border-white/10 text-[#A1A1AA] hover:border-white/30'
                  }`}
                >
                  <strong className="text-sm font-bold uppercase tracking-wide">{amb.label}</strong>
                  <span className={`text-xs mt-1 font-light ${creativeAmbition === amb.label ? 'text-black/80' : 'text-[#71717A]'}`}>
                    {amb.desc}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-4 rounded-full border border-white/20 text-white text-xs uppercase tracking-wider hover:bg-white/10"
              >
                <ArrowLeft size={14} className="inline mr-1" /> Retour
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 py-4 rounded-full bg-[#C5A059] text-black text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#d8b56f] transition flex items-center justify-center gap-2"
              >
                <span>Générer Mon Diagnostic & Estimation</span>
                <Sparkles size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Diagnostic & Instant Estimation */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="p-8 sm:p-12 rounded-3xl bg-[#121216] border border-[#C5A059] shadow-2xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C5A059] block">
                    RECOMMANDATION SCÉNOGRAPHIQUE OFFICIELLE
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-light text-white uppercase mt-1" style={{ fontFamily: '"Cinzel", serif' }}>
                    PACKAGE {recommendedPkg.number} : {recommendedPkg.name}
                  </h3>
                  <p className="text-xs text-[#A1A1AA] mt-1 font-light">{recommendedPkg.agencySubtitle}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-[#A1A1AA] block">Honoraires d’Agence Estimés</span>
                  <div className="text-3xl font-bold font-mono text-[#C5A059]">{recommendedPkg.priceFrom}</div>
                </div>
              </div>

              {/* Package Snapshot & Features */}
              <div className="mt-8 grid sm:grid-cols-2 gap-6 items-center">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10">
                  <img src={recommendedPkg.heroImage} alt={recommendedPkg.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-xs font-mono text-white/90">
                    « {recommendedPkg.tagline} »
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-mono text-[#C5A059] uppercase">Livrables Inclus dans ce Diagnostic :</div>
                  {recommendedPkg.deliverables.map((del, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-white">
                      <Check size={14} className="text-emerald-400 shrink-0" />
                      <span>{del}</span>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      onSelectPackage(recommendedPkg.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="mt-4 px-5 py-2.5 rounded-full bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition"
                  >
                    Activer la Démo de ce Package
                  </button>
                </div>
              </div>

              {/* Contact Lead Form for Audit */}
              <div className="mt-10 pt-8 border-t border-white/10">
                <h4 className="text-xl font-light uppercase text-white" style={{ fontFamily: '"Cinzel", serif' }}>
                  Réserver un Audit Scénographique Confidentiel
                </h4>
                <p className="text-xs text-[#A1A1AA] mt-1 font-light">
                  Un échange de 45 minutes en visio ou à l'atelier parisien avec le directeur de création pour affiner votre cahier des charges.
                </p>

                {submitted ? (
                  <div className="mt-6 p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-1">
                    <Check size={28} className="mx-auto text-emerald-400" />
                    <div className="text-xs font-mono font-bold text-white uppercase">Demande d'Audit Transmise</div>
                    <p className="text-xs text-[#A1A1AA] font-light">
                      Merci {names}. Le Monde Aime vous contactera sous 24h avec une proposition de créneau.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSubmitted(true);
                    }}
                    className="mt-6 grid sm:grid-cols-3 gap-3"
                  >
                    <input
                      required
                      placeholder="Prénoms des futurs mariés"
                      value={names}
                      onChange={(e) => setNames(e.target.value)}
                      className="px-4 py-3 bg-black/60 border border-white/15 rounded-xl text-xs text-white outline-none focus:border-[#C5A059]"
                    />
                    <input
                      required
                      type="email"
                      placeholder="Adresse email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="px-4 py-3 bg-black/60 border border-white/15 rounded-xl text-xs text-white outline-none focus:border-[#C5A059]"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-[#C5A059] text-black text-xs font-semibold uppercase tracking-wider hover:bg-[#d8b56f] transition flex items-center justify-center gap-1.5"
                    >
                      <span>Planifier l’Audit</span>
                      <Send size={13} />
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setStep(1)}
                className="text-xs font-mono text-[#A1A1AA] hover:text-white uppercase tracking-wider underline"
              >
                Recommencer une simulation
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
