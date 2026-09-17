import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Moon, Sparkles, Key, Check, Shield, Eye, Flame } from 'lucide-react';

export default function OrbiteIncartadeSite() {
  const [activeAct, setActiveAct] = useState<'act1' | 'act2' | 'act3'>('act1');
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockError, setUnlockError] = useState('');
  const [rsvpSent, setRsvpSent] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim().toUpperCase() === 'ORBITE' || passcode.trim().length >= 4) {
      setIsUnlocked(true);
      setUnlockError('');
    } else {
      setUnlockError('Code confidentiel invalide. Référez-vous à votre faire-part scellé.');
    }
  };

  const acts = [
    {
      id: 'act1',
      num: 'ACTE I',
      date: 'VENDREDI 03 JUILLET // 19H30',
      title: 'LE SOUPER CLANDESTIN',
      place: 'Les Cryptoportiques Romains',
      desc: 'Rassemblement secret sous les voûtes antiques éclairées aux flambeaux. Dîner intimiste, crus millésimés et conversations chuchotées.',
    },
    {
      id: 'act2',
      num: 'ACTE II',
      date: 'SAMEDI 04 JUILLET // 21H00',
      title: 'LA NUIT SACRÉE & LE BAL D’OMBRES',
      place: 'L’Amphithéâtre Antique',
      desc: 'Cérémonie nocturne théâtrale sous la brume et 2000 cierges. Performance lyrique exclusive, échange des anneaux de météore et fête haute couture.',
    },
    {
      id: 'act3',
      num: 'ACTE III',
      date: 'DIMANCHE 05 JUILLET // 12H30',
      title: 'LE BRUNCH DES OMBRES & BAINS',
      place: 'Les Thermes Privatisés',
      desc: 'Bains tièdes sous la pinède, fruits de Méditerranée, musique de harpe électrique et repos absolu dans les salons de lin blanc.',
    },
  ];

  return (
    <div className="bg-[#000000] text-[#FFFFFF] min-h-screen selection:bg-[#C5A059] selection:text-black" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      {/* Top Secret Bar */}
      <div className="border-b border-white/[0.08] bg-[#000000]/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between text-xs tracking-[0.3em] uppercase text-[#A1A1AA] sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Moon size={14} className="text-[#C5A059]" />
          <span className="text-white font-medium">ORBITE & INCARTADE // ACCÈS CONFIDENTIEL</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[11px]">
          <a href="#triptyque" className="hover:text-[#C5A059] transition">Les 3 Actes</a>
          <a href="#vip-services" className="hover:text-[#C5A059] transition">Conciergerie VIP</a>
          <a href="#acces-prive" className="hover:text-[#C5A059] transition">Espace Privé</a>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-[#C5A059] font-mono px-3 py-1 bg-white/[0.04] border border-[#C5A059]/30 rounded-full">
          <Shield size={12} /> {isUnlocked ? 'ACCÈS VIP ACTIF' : 'ACCÈS PROTÉGÉ'}
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative min-h-[95vh] flex flex-col justify-center items-center text-center p-6 sm:p-14 overflow-hidden border-b border-white/[0.08]">
        <div className="absolute inset-0">
          <img
            src="/images/packages/orbite.jpg"
            alt="Solal et Althéa Orbite et Incartade"
            className="w-full h-full object-cover opacity-85 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ y: -15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-md border border-[#C5A059]/40 text-xs tracking-[0.3em] uppercase text-[#C5A059] mb-8">
            <Flame size={13} /> Expérience Immersive Haute Couture
          </motion.div>

          <motion.h1
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-[clamp(3.4rem,11vw,8.5rem)] font-light tracking-tight leading-[0.95] text-white uppercase"
            style={{ fontFamily: '"Cormorant Garamond", "Cinzel", serif' }}
          >
            SOLAL <span className="text-[#C5A059] italic font-normal">&</span> ALTHÉA
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-base sm:text-xl font-light text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed"
          >
            Une parenthèse clandestine de trois nuits dans les pierres millénaires d’Arles. Scénographie sacrée, musique d'opéra et mystère absolu.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="#triptyque" className="px-8 sm:px-10 py-4 rounded-full bg-[#C5A059] text-black text-xs tracking-[0.25em] uppercase font-semibold hover:bg-white transition shadow-2xl">
              Découvrir les 3 Actes
            </a>
            <a href="#acces-prive" className="px-8 sm:px-10 py-4 rounded-full bg-white/[0.06] border border-white/20 text-white text-xs tracking-[0.25em] uppercase font-semibold hover:bg-white/10 transition backdrop-blur-md">
              Déverrouiller mon pass VIP
            </a>
          </motion.div>
        </div>
      </header>

      {/* Programme en 3 Actes */}
      <section id="triptyque" className="py-24 sm:py-36 px-6 sm:px-12 border-b border-white/[0.08] bg-[#050505]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs tracking-[0.3em] uppercase text-[#C5A059] font-semibold">TRIPTYQUE ÉVÉNEMENTIEL</span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-light uppercase tracking-tight" style={{ fontFamily: '"Cormorant Garamond", "Cinzel", serif' }}>
              LE DÉROULÉ EN TROIS ACTES
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#A1A1AA] font-light">
              Chaque acte est conçu comme une scène vivante distincte, avec son propre décor et son code vestimentaire.
            </p>
          </div>

          {/* Act Tabs */}
          <div className="flex justify-center gap-2 mb-12 flex-wrap">
            {acts.map((act) => (
              <button
                key={act.id}
                onClick={() => setActiveAct(act.id as any)}
                className={`px-6 py-3 rounded-full text-xs tracking-[0.2em] uppercase font-semibold transition ${activeAct === act.id ? 'bg-[#C5A059] text-black' : 'bg-white/[0.05] border border-white/10 text-[#A1A1AA] hover:text-white'}`}
              >
                {act.num} : {act.title}
              </button>
            ))}
          </div>

          {/* Active Act Card */}
          <AnimatePresence mode="wait">
            {acts.filter((a) => a.id === activeAct).map((act) => (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="p-8 sm:p-14 rounded-3xl bg-white/[0.03] border border-[#C5A059]/30 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
                  <div>
                    <span className="text-xs font-mono text-[#C5A059] tracking-widest uppercase">{act.date}</span>
                    <h3 className="text-3xl sm:text-4xl font-light tracking-tight mt-1 text-white" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                      {act.title}
                    </h3>
                  </div>
                  <div className="text-sm font-mono text-[#A1A1AA] px-4 py-2 bg-white/[0.04] border border-white/10 rounded-full w-fit">
                    {act.place}
                  </div>
                </div>

                <p className="text-base sm:text-lg text-white/80 leading-relaxed font-light max-w-3xl">
                  {act.desc}
                </p>

                <div className="mt-10 grid sm:grid-cols-3 gap-4 pt-6 border-t border-white/[0.08] text-xs text-[#A1A1AA] font-light">
                  <div><strong className="text-white block font-medium">TENUE</strong> Smoking Noir / Robe de Cérémonie</div>
                  <div><strong className="text-white block font-medium">ACCÈS</strong> Navette privée depuis l’Hôtel de Paris</div>
                  <div><strong className="text-white block font-medium">SÉCRÉTAIRE</strong> Pass QR Code obligatoire</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Conciergerie VIP */}
      <section id="vip-services" className="py-24 sm:py-36 px-6 sm:px-12 border-b border-white/[0.08] bg-[#000000]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs tracking-[0.3em] uppercase text-[#C5A059] font-semibold">CLUB PRIVÉ</span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-light uppercase tracking-tight" style={{ fontFamily: '"Cormorant Garamond", "Cinzel", serif' }}>
              SERVICES CONCIERGERIE VIP
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#A1A1AA] font-light">
              Chaque invité dispose d'une loge dédiée et d'un accompagnement personnalisé dès l'arrivée en Provence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between hover:border-[#C5A059]/40 transition">
              <div>
                <span className="text-xs font-mono text-[#C5A059]">01 // BERLINE & HÉLIPORT</span>
                <h3 className="text-xl font-light uppercase mt-3" style={{ fontFamily: '"Cinzel", serif' }}>CHAUFFEUR ATTITRÉ</h3>
                <p className="mt-3 text-sm text-[#A1A1AA] leading-relaxed font-light">
                  Prise en charge à l'aéroport Marseille Provence ou à la gare TGV d'Avignon en berline noire blindée.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/[0.08] text-xs text-[#C5A059] tracking-wider uppercase font-medium">
                Coordination 24h/24
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between hover:border-[#C5A059]/40 transition">
              <div>
                <span className="text-xs font-mono text-[#C5A059]">02 // SALON PRIVÉ FITTING</span>
                <h3 className="text-xl font-light uppercase mt-3" style={{ fontFamily: '"Cinzel", serif' }}>FITTING HAUTE COUTURE</h3>
                <p className="mt-3 text-sm text-[#A1A1AA] leading-relaxed font-light">
                  Une équipe de stylistes et couturiers parisiens à disposition pour votre mise en beauté et vos essayages.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/[0.08] text-xs text-[#C5A059] tracking-wider uppercase font-medium">
                Réservation au créneau
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between hover:border-[#C5A059]/40 transition">
              <div>
                <span className="text-xs font-mono text-[#C5A059]">03 // SUITE HÔTELIÈRE</span>
                <h3 className="text-xl font-light uppercase mt-3" style={{ fontFamily: '"Cinzel", serif' }}>PRIVATISATION HÔTEL PARTICULIER</h3>
                <p className="mt-3 text-sm text-[#A1A1AA] leading-relaxed font-light">
                  L’Hôtel Jules César entièrement réservé pour l'ensemble des convives. Clé d’or remise à l’accueil.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/[0.08] text-xs text-[#C5A059] tracking-wider uppercase font-medium">
                Du 03 au 05 Juillet
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Espace Privé Invités Sécurisé */}
      <section id="acces-prive" className="py-24 sm:py-36 px-6 sm:px-12 bg-[#050505]">
        <div className="max-w-2xl mx-auto p-8 sm:p-14 rounded-3xl bg-white/[0.04] border border-[#C5A059]/40 backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] text-center">
          <div className="w-14 h-14 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center mx-auto text-[#C5A059]">
            {isUnlocked ? <Unlock size={24} /> : <Lock size={24} />}
          </div>

          <h2 className="mt-5 text-3xl sm:text-4xl font-light uppercase tracking-tight" style={{ fontFamily: '"Cormorant Garamond", "Cinzel", serif' }}>
            {isUnlocked ? 'ESPACE INVITÉ DÉVERROUILLÉ' : 'ESPACE CONFIDENTIEL INVITÉS'}
          </h2>
          <p className="mt-2 text-sm text-[#A1A1AA] font-light">
            {isUnlocked ? 'Bienvenue Solal & Althéa vous accueillent au sein du cercle.' : 'Saisissez le code d’accès inscrit sur le cachet de cire noire de votre invitation.'}
          </p>

          {!isUnlocked ? (
            <form onSubmit={handleUnlock} className="mt-8 space-y-4 max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Code d’accès (ex: ORBITE)"
                  className="w-full px-5 py-4 rounded-full bg-white/[0.05] border border-white/20 text-center tracking-[0.3em] font-mono text-sm uppercase text-white outline-none focus:border-[#C5A059] transition"
                />
              </div>

              {unlockError && <p className="text-xs text-red-400 font-light">{unlockError}</p>}

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-[#C5A059] text-black text-xs font-semibold tracking-[0.25em] uppercase hover:bg-white transition shadow-xl"
              >
                Déverrouiller le sésame
              </button>
              <p className="text-[11px] text-[#666] tracking-wide mt-2">Astuce démo : tapez « ORBITE »</p>
            </form>
          ) : (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mt-8 text-left space-y-5">
              <div className="p-6 rounded-2xl bg-white/[0.05] border border-white/10 text-sm leading-relaxed text-white/90 font-light">
                <span className="text-[#C5A059] font-mono text-xs block mb-1 uppercase tracking-widest">CONFIRMATION DU PASS</span>
                Vos loges sont attribuées à la chambre 204. Votre chauffeur vous contactera 48h avant votre voyage.
              </div>

              {rsvpSent ? (
                <div className="p-5 rounded-2xl bg-[#C5A059]/20 border border-[#C5A059] text-center text-sm font-medium text-[#C5A059]">
                  <Check size={20} className="mx-auto mb-1" />
                  Votre confirmation VIP est enregistrée.
                </div>
              ) : (
                <button
                  onClick={() => setRsvpSent(true)}
                  className="w-full py-4 rounded-full bg-white text-black text-xs tracking-[0.25em] uppercase font-semibold hover:bg-[#C5A059] transition shadow-lg"
                >
                  Valider ma présence aux 3 Actes
                </button>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-xs tracking-[0.25em] uppercase text-[#666] border-t border-white/[0.08] bg-[#000000]">
        SOLAL & ALTHÉA — 03 AU 05 JUILLET 2027 // HAUTE COUTURE : ORBITE & INCARTADE PAR LE MONDE AIME
      </footer>
    </div>
  );
}
