import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Unlock, Moon, Shield, Sparkles, Key, Check, Compass, 
  Layers, MapPin, Eye, Flame, QrCode, ArrowRight, UserCheck
} from 'lucide-react';

interface SpatialZone {
  id: string;
  name: string;
  code: string;
  capacity: string;
  lighting: string;
  desc: string;
  accessLevel: string;
  coords: { x: number; y: number };
}

export default function OrbiteIncartadeSite() {
  const [activeDay, setActiveDay] = useState<1 | 2 | 3 | 4>(1);
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockError, setUnlockError] = useState('');
  const [guestName, setGuestName] = useState('ÉLÉONORE & MAXIME');
  const [selectedZoneId, setSelectedZoneId] = useState('amphi');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim().toUpperCase() === 'ORBITE' || passcode.trim().length >= 4) {
      setIsUnlocked(true);
      setUnlockError('');
    } else {
      setUnlockError('Code confidentiel invalide. Indice démo : tapez « ORBITE ».');
    }
  };

  const daysSchedule = [
    {
      day: 1,
      tag: 'JOUR 1 — VENDREDI 03 JUILLET',
      title: 'ACTE I : LE SOUPER CLANDESTIN',
      place: 'Les Cryptoportiques Romains d’Arles',
      hours: '19:30 — 02:00',
      desc: 'Accueil sous les voûtes antiques éclairées aux flambeaux de cire d’abeille. Vins millésimés rares, accords gastronomiques secrets et musique acoustique minimale.',
      dressCode: 'Noir intégrale & Bijoux d’argent brut'
    },
    {
      day: 2,
      tag: 'JOUR 2 — SAMEDI 04 JUILLET',
      title: 'ACTE II : LA NUIT SACRÉE & LE BAL D’OMBRES',
      place: 'L’Amphithéâtre Antique Privatisé',
      hours: '21:00 — 05:00',
      desc: 'Cérémonie nocturne monumentale sous la brume et 2000 cierges. Échange des anneaux forgés de météorite, performance lyrique immersive et bal masqué haute couture.',
      dressCode: 'Haute Couture Noire ou Robe de Cérémonie Céleste'
    },
    {
      day: 3,
      tag: 'JOUR 3 — DIMANCHE 05 JUILLET',
      title: 'ACTE III : LE BRUNCH DES OMBRES & BAINS',
      place: 'Les Thermes Romains & Solarium Privé',
      hours: '13:00 — 20:00',
      desc: 'Bains tièdes sous la pinède centenaire, harpe électrique aquatique, fruits d’or et repos absolu dans les pavillons de gaze blanche.',
      dressCode: 'Lin blanc, soie fluide & lunettes de soleil'
    },
    {
      day: 4,
      tag: 'JOUR 4 — LUNDI 06 JUILLET',
      title: 'ÉPILOGUE : L’ENVOL & DÉPARTS VIP',
      place: 'Héliport Sud & Salons Privés de la Gare',
      hours: '10:00 — 14:00',
      desc: 'Dernier espresso et départs cadencés en hélicoptère ou berlines avec chauffeur attitré.',
      dressCode: 'Tenue de voyage élégante'
    }
  ];

  const spatialZones: SpatialZone[] = [
    {
      id: 'amphi',
      name: 'L’Amphithéâtre Antique (Zone Cérémonie)',
      code: 'SECTEUR ALPHA // PIERRE MILLÉNAIRE',
      capacity: '120 Invités VIP',
      lighting: '2 000 cierges de cire noire & brume basse',
      desc: 'L’épicentre du sacrement. Une scène circulaire en pierre brute entourée de gradins antiques tendus de velours noir.',
      accessLevel: 'Accès Badge Or • Nuit du Samedi',
      coords: { x: 50, y: 35 }
    },
    {
      id: 'crypte',
      name: 'La Crypte Souterraine & Caviar Bar',
      code: 'SECTEUR BÊTA // SOUND-SYSTEM CLANDESTIN',
      capacity: '80 Personnes',
      lighting: 'Stroboscopes ambre & néons dissimulés',
      desc: 'Le sanctuaire de la fête nocturne. Acoustique de cathédrale, bar à champagne Dom Pérignon et sound-system immersif Funktion-One.',
      accessLevel: 'Accès Bracelet Noir • De minuit à l’aube',
      coords: { x: 30, y: 65 }
    },
    {
      id: 'thermes',
      name: 'Les Thermes & Solarium Aquatique',
      code: 'SECTEUR GAMMA // EAUX SUSPENDUES',
      capacity: '120 Invités VIP',
      lighting: 'Lumière zénithale & bassins chauffés à 34°C',
      desc: 'Trois bassins d’eau thermale, hammam de marbre sculpté et cabines de massage aromatique aux huiles de pin de Provence.',
      accessLevel: 'Pass Détente • Tout le week-end',
      coords: { x: 75, y: 55 }
    },
    {
      id: 'heliport',
      name: 'Héliport Privé & Embarcadère',
      code: 'SECTEUR DELTA // HUB PROTOCOLE',
      capacity: '4 Aéronefs simultanés',
      lighting: 'Balisage lumineux infra-rouge',
      desc: 'Zone de rotation pour navettes héliportées vers Nice, Cannes et Marseille. Salon d’attente privé climatisé.',
      accessLevel: 'Accès Régie Conciergerie 24h/24',
      coords: { x: 20, y: 25 }
    }
  ];

  const currentZone = spatialZones.find(z => z.id === selectedZoneId) || spatialZones[0];

  return (
    <div className="bg-[#000000] text-[#FFFFFF] min-h-screen selection:bg-[#C5A059] selection:text-black" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      {/* Top Secret Bar */}
      <div className="border-b border-white/[0.08] bg-[#000000]/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between text-xs tracking-[0.3em] uppercase text-[#A1A1AA] sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Moon size={14} className="text-[#C5A059]" />
          <span className="text-white font-medium">ORBITE & INCARTADE // IMMERSIF 4 JOURS & VIP ACCESS</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[11px]">
          <a href="#vip-pass" className="hover:text-[#C5A059] transition">VIP Pass Sécurisé</a>
          <a href="#planning-multiday" className="hover:text-[#C5A059] transition">Planning 4 Jours</a>
          <a href="#spatial-3d" className="hover:text-[#C5A059] transition">Plan Spatial 3D</a>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-[#C5A059] font-mono px-3 py-1 bg-white/[0.04] border border-[#C5A059]/30 rounded-full">
          <Shield size={12} /> {isUnlocked ? 'PASS VIP ACTIVÉ' : 'ACCÈS PROTÉGÉ'}
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-md border border-[#C5A059]/40 text-xs tracking-[0.3em] uppercase text-[#C5A059] mb-8">
            <Flame size={13} /> Célébration Clandestine Haute Couture
          </div>

          <h1
            className="text-[clamp(3.4rem,11vw,8.5rem)] font-light tracking-tight leading-[0.95] text-white uppercase"
            style={{ fontFamily: '"Cormorant Garamond", "Cinzel", serif' }}
          >
            SOLAL <span className="text-[#C5A059] italic font-normal">&</span> ALTHÉA
          </h1>

          <p className="mt-6 text-base sm:text-xl font-light text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed">
            Une expérience immersive en quatre actes secrets dans les pierres d’Arles. Architecture nocturne sacrée, loges privées et conciergerie totale.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="#vip-pass" className="px-8 sm:px-10 py-4 rounded-full bg-[#C5A059] text-black text-xs tracking-[0.25em] uppercase font-semibold hover:bg-white transition shadow-2xl">
              Déverrouiller mon VIP Pass
            </a>
            <a href="#spatial-3d" className="px-8 sm:px-10 py-4 rounded-full bg-white/[0.06] border border-white/20 text-white text-xs tracking-[0.25em] uppercase font-semibold hover:bg-white/10 transition backdrop-blur-md">
              Plan Spatial des Lieux
            </a>
          </div>
        </div>
      </header>

      {/* MODULE 1 : ACCÈS SÉCURISÉ VIP PASS NOMINATIF GLASSMORPHIC */}
      <section id="vip-pass" className="py-24 sm:py-36 px-4 sm:px-8 border-b border-white/[0.08] bg-[#050505]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs tracking-[0.3em] uppercase text-[#C5A059] font-semibold flex items-center justify-center gap-1.5">
              <Key size={14} /> PROTOCOLE D'ACCÈS SÉCURISÉ
            </span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-light uppercase tracking-tight text-white" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              ESPACE PRIVÉ & VIP PASS
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#A1A1AA] font-light">
              L'accès aux quatre journées nécessite le code gravé sur votre sachet d'invitation de cire d'or.
            </p>
          </div>

          {!isUnlocked ? (
            <div className="max-w-md mx-auto p-8 rounded-3xl bg-white/[0.04] border border-[#C5A059]/40 backdrop-blur-2xl text-center shadow-2xl">
              <div className="w-14 h-14 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center mx-auto text-[#C5A059] mb-4">
                <Lock size={24} />
              </div>

              <h3 className="text-xl font-light uppercase text-white" style={{ fontFamily: '"Cinzel", serif' }}>
                SAISISSEZ VOTRE CODE SÉCRET
              </h3>
              <p className="text-xs text-[#A1A1AA] mt-1 font-light">
                Indice démo immédiat : écrivez simplement « ORBITE »
              </p>

              <form onSubmit={handleUnlock} className="mt-6 space-y-4">
                <input
                  type="text"
                  placeholder="CODE D’ACCÈS (ex: ORBITE)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-5 py-4 rounded-full bg-white/[0.05] border border-white/20 text-center tracking-[0.3em] font-mono text-sm uppercase text-white outline-none focus:border-[#C5A059]"
                />

                {unlockError && <div className="text-xs text-red-400 font-mono">{unlockError}</div>}

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#C5A059] text-black text-xs font-semibold tracking-[0.25em] uppercase hover:bg-white transition shadow-xl"
                >
                  Valider et révéler mon Pass VIP
                </button>
              </form>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
              {/* Glassmorphic VIP Pass Card */}
              <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-white/[0.01] border border-[#C5A059] backdrop-blur-3xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden">
                {/* Gold watermarks */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#C5A059]/10 blur-3xl pointer-events-none" />

                <div className="flex items-start justify-between border-b border-white/10 pb-6 mb-8">
                  <div>
                    <span className="text-[10px] font-mono text-[#C5A059] tracking-[0.3em] uppercase block">
                      LE MONDE AIME • ORBITE & INCARTADE
                    </span>
                    <h4 className="text-3xl font-light text-white uppercase mt-1" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                      PASS VIP OFFICIEL // MEMBRE DU CERCLE
                    </h4>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                    <QrCode size={48} className="text-[#C5A059]" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 text-xs font-mono">
                  <div>
                    <span className="text-[#A1A1AA] block text-[10px] uppercase">TITULAIRES DU PASS</span>
                    <strong className="text-white text-sm block mt-0.5">{guestName}</strong>
                  </div>
                  <div>
                    <span className="text-[#A1A1AA] block text-[10px] uppercase">STATUT PROTOCOLE</span>
                    <strong className="text-emerald-400 text-sm block mt-0.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      ACCRÉDITÉ TOUTES ZONES (4 JOURS)
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#A1A1AA] block text-[10px] uppercase">SUITE ATTRIBUÉE</span>
                    <strong className="text-white text-sm block mt-0.5">Pavillon 204 • Hôtel Jules César</strong>
                  </div>
                  <div>
                    <span className="text-[#A1A1AA] block text-[10px] uppercase">CHAUFFEUR ASSIGNÉ</span>
                    <strong className="text-white text-sm block mt-0.5">Berline #07 • Prise en charge 24h/24</strong>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#A1A1AA]">
                  <span>CODE DU PASS : #OI-2027-ARLES-889</span>
                  <span className="text-[#C5A059] flex items-center gap-1"><Shield size={12} /> CRYPTÉ DE BOUT EN BOUT</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* MODULE 2 : PLANNING IMMERSIF SUR 3 À 4 JOURS */}
      <section id="planning-multiday" className="py-24 sm:py-36 px-4 sm:px-8 border-b border-white/[0.08] bg-[#000000]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs tracking-[0.3em] uppercase text-[#C5A059] font-semibold">LE TEMPS SUSPENDU</span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-light uppercase tracking-tight text-white" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              LE PLANNING SUR 4 JOURS
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#A1A1AA] font-light">
              Chaque jour est un acte autonome doté de son ambiance sonore, lumineuse et vestimentaire.
            </p>
          </div>

          {/* Days Tabs */}
          <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
            {[1, 2, 3, 4].map((d) => (
              <button
                key={d}
                onClick={() => setActiveDay(d as any)}
                className={`px-6 py-3 rounded-full text-xs tracking-[0.2em] uppercase font-semibold transition ${
                  activeDay === d
                    ? 'bg-[#C5A059] text-black shadow-lg shadow-[#C5A059]/20'
                    : 'bg-white/[0.04] border border-white/10 text-[#A1A1AA] hover:text-white'
                }`}
              >
                Jour 0{d}
              </button>
            ))}
          </div>

          {/* Active Day Detail Card */}
          {daysSchedule.filter(s => s.day === activeDay).map((item) => (
            <div
              key={item.day}
              className="p-8 sm:p-14 rounded-3xl bg-white/[0.03] border border-[#C5A059]/30 backdrop-blur-2xl shadow-2xl"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
                <div>
                  <span className="text-xs font-mono text-[#C5A059] uppercase tracking-widest">{item.tag}</span>
                  <h3 className="text-3xl sm:text-4xl font-light text-white tracking-tight mt-1" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                    {item.title}
                  </h3>
                </div>
                <div className="text-xs font-mono text-white/80 px-4 py-2 bg-white/5 border border-white/10 rounded-full w-fit">
                  {item.hours}
                </div>
              </div>

              <p className="text-base sm:text-lg text-white/80 leading-relaxed font-light max-w-3xl">
                {item.desc}
              </p>

              <div className="mt-10 grid sm:grid-cols-2 gap-4 pt-6 border-t border-white/10 text-xs text-[#A1A1AA] font-light">
                <div>
                  <strong className="text-white block font-medium uppercase font-mono text-[11px] mb-1">LIEU SECRET</strong>
                  {item.place}
                </div>
                <div>
                  <strong className="text-white block font-medium uppercase font-mono text-[11px] mb-1">DRESS CODE DE L’ACTE</strong>
                  {item.dressCode}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODULE 3 : APERÇU 3D & PLAN SPATIAL INTERACTIF DES ZONES PRIVATISÉES */}
      <section id="spatial-3d" className="py-24 sm:py-36 px-4 sm:px-8 border-b border-white/[0.08] bg-[#050505]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/[0.08]">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-[#C5A059] font-semibold flex items-center gap-1.5">
                <Compass size={14} /> SCÉNOGRAPHIE DE L'ESPACE
              </span>
              <h2 className="text-4xl sm:text-6xl font-light uppercase tracking-tight text-white mt-1" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                PLAN SPATIAL DES LIEUX
              </h2>
            </div>
            <p className="text-sm text-[#A1A1AA] max-w-md font-light leading-relaxed">
              Explorez les quatre zones privatisées pour guider vos déplacements nocturnes. Cliquez sur un point pour afficher son protocole d’accès.
            </p>
          </div>

          <div className="mt-12 grid lg:grid-cols-[1fr_380px] gap-8 items-start">
            {/* Interactive Spatial Map Canvas Representation */}
            <div className="relative aspect-[16/10] rounded-3xl bg-[#09090D] border border-white/10 overflow-hidden p-6 flex items-center justify-center shadow-2xl">
              {/* Isometric grid overlay */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: `radial-gradient(circle, #C5A059 1px, transparent 1px)`,
                  backgroundSize: '28px 28px'
                }}
              />

              {/* Architectural contours SVG */}
              <svg className="absolute inset-0 w-full h-full stroke-white/10 fill-none" preserveAspectRatio="none">
                <circle cx="50%" cy="35%" r="22%" strokeDasharray="4 4" />
                <path d="M 30% 65% L 50% 35% L 75% 55% Z" />
                <path d="M 20% 25% L 50% 35%" strokeDasharray="2 2" />
              </svg>

              {/* Interactive Zone Pins */}
              {spatialZones.map((zone) => {
                const isSelected = zone.id === selectedZoneId;
                return (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedZoneId(zone.id)}
                    style={{ left: `${zone.coords.x}%`, top: `${zone.coords.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-20"
                  >
                    <div className="relative flex items-center justify-center">
                      <span className={`w-8 h-8 rounded-full border flex items-center justify-center transition ${
                        isSelected
                          ? 'bg-[#C5A059] text-black border-[#C5A059] scale-125 shadow-[0_0_25px_#C5A059]'
                          : 'bg-black/80 text-white/80 border-white/30 group-hover:border-[#C5A059]'
                      }`}>
                        <Compass size={14} />
                      </span>
                      <span className={`absolute top-9 whitespace-nowrap text-[10px] font-mono px-2 py-0.5 rounded border transition ${
                        isSelected
                          ? 'bg-black text-[#C5A059] border-[#C5A059]'
                          : 'bg-black/60 text-[#A1A1AA] border-white/10 group-hover:text-white'
                      }`}>
                        {zone.name.split(' ')[0]}
                      </span>
                    </div>
                  </button>
                );
              })}

              <div className="absolute bottom-4 left-4 text-[10px] font-mono text-[#666] uppercase">
                ÉCHELLE PROTOCOLE 1:500 // ARLES PRIVATISÉ
              </div>
            </div>

            {/* Active Zone Detail Card */}
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-[#C5A059]/40 backdrop-blur-xl shadow-2xl">
              <span className="text-[10px] font-mono text-[#C5A059] tracking-widest uppercase block">
                {currentZone.code}
              </span>
              <h3 className="text-2xl font-light text-white uppercase mt-1" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                {currentZone.name}
              </h3>

              <p className="text-xs text-[#A1A1AA] mt-4 leading-relaxed font-light">
                {currentZone.desc}
              </p>

              <div className="mt-6 space-y-3 pt-6 border-t border-white/10 text-xs font-mono">
                <div>
                  <span className="text-[#666] block text-[10px]">CAPACITÉ MAXIMUM</span>
                  <span className="text-white">{currentZone.capacity}</span>
                </div>
                <div>
                  <span className="text-[#666] block text-[10px]">SCÉNOGRAPHIE LUMIÈRE</span>
                  <span className="text-white">{currentZone.lighting}</span>
                </div>
                <div>
                  <span className="text-[#666] block text-[10px]">CONDITIONS D'ACCÈS</span>
                  <span className="text-[#C5A059]">{currentZone.accessLevel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-xs tracking-[0.25em] uppercase text-[#666] border-t border-white/[0.08] bg-[#000000]">
        SOLAL & ALTHÉA — 03 AU 06 JUILLET 2027 // HAUTE COUTURE : ORBITE & INCARTADE PAR LE MONDE AIME
      </footer>
    </div>
  );
}
