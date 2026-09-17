import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Clock, MapPin, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function FugaceStudioSite() {
  const [timecode, setTimecode] = useState('18:42:10');
  const [rsvpSent, setRsvpSent] = useState(false);
  const [attendStatus, setAttendStatus] = useState<'yes' | 'no' | null>('yes');
  const [name, setName] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      const ss = String(d.getSeconds()).padStart(2, '0');
      setTimecode(`${hh}:${mm}:${ss}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeline = [
    { time: '14:00', title: 'CHECK-IN PRODUCTION & WELCOME SHOT', desc: 'Rassemblement quai nord. Espresso serré et coupes fraîches.', tag: 'ACTE I' },
    { time: '15:30', title: 'VŒUX CRUS SOUS TUBES NÉON', desc: 'Échange spontané, acoustique brute, sans micro ni protocole ampoulé.', tag: 'ACTE II' },
    { time: '17:00', title: 'COCKTAIL HAUT-VOLTAGE & FLASH PHOTO', desc: 'DJ set live, street food étoilée, prises de vue au flash direct.', tag: 'ACTE III' },
    { time: '20:00', title: 'BANQUET SAUVAGE SUR BÉTON CIRÉ', desc: 'Dîner assis, bougies courtes, vin naturel et prises de parole libres.', tag: 'ACTE IV' },
    { time: '23:30', title: 'RAVE NOCTURNE & DERNIÈRE BOBINE', desc: 'Basses profondes, fumée dense, fête libre jusqu’au lever du jour.', tag: 'FIN' },
  ];

  return (
    <div className="bg-[#0F0F0F] text-[#E5E5E5] min-h-screen selection:bg-[#FF2A00] selection:text-white" style={{ fontFamily: '"Inter", -apple-system, sans-serif' }}>
      {/* Top Technical Bar */}
      <div className="border-b border-[#262626] bg-[#0A0A0A] px-4 sm:px-8 py-2.5 text-[11px] flex items-center justify-between text-[#888] font-mono tracking-widest flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 rounded-full bg-[#FF2A00] animate-ping" />
          <span className="text-[#E5E5E5] font-bold">FUGACE STUDIO // ARCHIVE #024</span>
          <span className="hidden sm:inline text-[#555]">| RUNNING ORDER : VER. 4.2</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[#FF2A00] font-bold">TIMECODE {timecode}</span>
          <span className="hidden md:inline text-[#555]">GPS 48.8566° N, 2.3522° E</span>
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative min-h-[92vh] flex flex-col justify-end border-b border-[#262626] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/packages/fugace.jpg"
            alt="Léa et Roman Fugace Studio"
            className="w-full h-full object-cover filter grayscale contrast-125 brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/45 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </div>

        <div className="relative z-10 px-4 sm:px-12 pb-14 sm:pb-20 max-w-7xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF2A00] text-black text-[11px] font-mono font-bold tracking-widest uppercase mb-6">
            <Zap size={13} /> Coordination Jour J — Documentaire Live
          </div>

          <h1 className="text-white font-mono font-bold tracking-tighter leading-none text-[clamp(2.8rem,10vw,7.5rem)] uppercase">
            LÉA & ROMAN
          </h1>

          <div className="mt-4 flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4 border-t border-white/20">
            <div>
              <p className="text-xl sm:text-2xl font-mono text-white tracking-tight">24.10.2026 — LA FRICHE INDUSTRIELLE</p>
              <p className="text-sm text-[#888] font-mono mt-1">PARIS NORD // 200 INVITÉS // CADENCE CONTINUE SANS PAUSE</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="#retroplanning"
                className="px-6 py-3.5 bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#FF2A00] hover:text-white transition"
              >
                Rétroplanning 24h
              </a>
              <a
                href="#rsvp-fast"
                className="px-6 py-3.5 border border-white/30 text-white font-mono text-xs font-bold uppercase tracking-wider hover:border-white transition"
              >
                RSVP Express
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Concept Manifesto Banner */}
      <section className="bg-[#141414] border-b border-[#262626] py-12 px-4 sm:px-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 text-xs font-mono">
          <div className="border-l-2 border-[#FF2A00] pl-4">
            <span className="text-[#888] block text-[10px] uppercase tracking-widest">01 // LE MOOD</span>
            <p className="text-[#E5E5E5] text-sm mt-1 leading-relaxed">Sur le vif. Zéro pose figée. Une coordination d'acier invisible pour laisser place à la spontanéité totale.</p>
          </div>
          <div className="border-l-2 border-[#444] pl-4">
            <span className="text-[#888] block text-[10px] uppercase tracking-widest">02 // L’IMAGE</span>
            <p className="text-[#E5E5E5] text-sm mt-1 leading-relaxed">Flash direct nocturne, argentique à grain franc, flou de mouvement assumé, pure vérité du moment.</p>
          </div>
          <div className="border-l-2 border-[#444] pl-4">
            <span className="text-[#888] block text-[10px] uppercase tracking-widest">03 // L’ENGAGEMENT</span>
            <p className="text-[#E5E5E5] text-sm mt-1 leading-relaxed">Chaque seconde est timée au cordeau pour que les mariés n’aient qu’un seul rôle : vivre leur fête.</p>
          </div>
        </div>
      </section>

      {/* Rétroplanning Section */}
      <section id="retroplanning" className="py-20 sm:py-28 px-4 sm:px-12 border-b border-[#262626]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between border-b border-[#262626] pb-4 mb-12">
            <div>
              <span className="text-[10px] font-mono text-[#FF2A00] tracking-widest uppercase">MINUTE PAR MINUTE</span>
              <h2 className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-white uppercase mt-1">RÉTROPLANNING DU JOUR J</h2>
            </div>
            <Clock size={28} className="text-[#444]" />
          </div>

          <div className="space-y-4">
            {timeline.map((item, idx) => (
              <motion.div
                key={item.time}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="grid md:grid-cols-[140px_1fr_100px] items-center p-6 bg-[#141414] border border-[#222] hover:border-[#FF2A00] transition"
              >
                <div className="font-mono text-2xl font-bold text-[#FF2A00] tabular-nums">
                  {item.time}
                </div>
                <div>
                  <h3 className="font-mono text-base font-bold text-white uppercase tracking-tight">{item.title}</h3>
                  <p className="text-sm text-[#888] font-mono mt-1">{item.desc}</p>
                </div>
                <div className="text-right mt-3 md:mt-0 font-mono text-xs text-[#555] uppercase tracking-widest">
                  [{item.tag}]
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lieu & Carte Technique */}
      <section className="py-20 sm:py-28 px-4 sm:px-12 border-b border-[#262626] bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between border-b border-[#262626] pb-4 mb-12">
            <div>
              <span className="text-[10px] font-mono text-[#FF2A00] tracking-widest uppercase">COORDONNÉES & REPÈRES</span>
              <h2 className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-white uppercase mt-1">LA FRICHE INDUSTRIELLE</h2>
            </div>
            <MapPin size={28} className="text-[#444]" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            <div className="p-8 bg-[#141414] border border-[#222] flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs text-[#FF2A00] font-bold uppercase">POINT D’ACCÈS PRINCIPAL</span>
                <h3 className="font-mono text-xl font-bold text-white uppercase mt-2">12 RUE DES ATELIERS, 93400 SAINT-OUEN</h3>
                <p className="text-sm text-[#888] font-mono mt-3 leading-relaxed">
                  Portail métallique lourd avec code badge invité. Parking gardé 50 places à l'arrière du bâtiment B.
                  Métro Ligne 14 (Mairie de Saint-Ouen, 6 min à pied).
                </p>

                <div className="mt-6 pt-6 border-t border-[#222] space-y-2 text-xs font-mono text-[#aaa]">
                  <div className="flex justify-between"><span>ZONE A :</span> <strong className="text-white">LA NEF (Cérémonie)</strong></div>
                  <div className="flex justify-between"><span>ZONE B :</span> <strong className="text-white">LES VOUTES (Banquet)</strong></div>
                  <div className="flex justify-between"><span>ZONE C :</span> <strong className="text-white">LE SOUNDSTAGE (Dancefloor)</strong></div>
                </div>
              </div>

              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center justify-center gap-2 py-3.5 bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#FF2A00] hover:text-white transition"
              >
                Ouvrir itinéraire GPS <ArrowRight size={14} />
              </a>
            </div>

            <div className="relative min-h-[300px] border border-[#222] bg-[#141414] p-8 flex flex-col justify-between overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="relative z-10 flex items-center justify-between">
                <span className="font-mono text-xs text-white uppercase tracking-widest">RADAR SITE // TOPOGRAPHIE</span>
                <span className="font-mono text-[10px] px-2 py-0.5 bg-[#FF2A00] text-black font-bold">LIVE ACCES</span>
              </div>
              <div className="relative z-10 my-auto text-center py-10">
                <div className="font-mono text-4xl text-white font-bold">200 PAX</div>
                <div className="font-mono text-xs text-[#888] mt-1">CAPACITÉ COCKTAIL / DÎNER CALIBRÉE</div>
              </div>
              <div className="relative z-10 flex justify-between font-mono text-[11px] text-[#666]">
                <span>FLUX RÉGULÉ</span>
                <span>SÉCURITÉ DÉDIÉE</span>
                <span>NAVETTES PRIVÉES DÈS 01H00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Ultra-Rapide en 2 clics */}
      <section id="rsvp-fast" className="py-20 sm:py-28 px-4 sm:px-12 bg-[#0F0F0F]">
        <div className="max-w-2xl mx-auto p-8 sm:p-12 bg-[#141414] border-2 border-white/20 text-center">
          <span className="font-mono text-xs text-[#FF2A00] font-bold tracking-widest uppercase">EN 2 CLICS CHRONO</span>
          <h2 className="text-3xl sm:text-4xl font-mono font-bold text-white uppercase tracking-tight mt-2">RSVP INSTANTANÉ</h2>
          <p className="text-sm font-mono text-[#888] mt-2">Confirmez votre présence dans le running order des mariés.</p>

          {rsvpSent ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-8 p-6 bg-white text-black font-mono">
              <Check size={32} className="mx-auto text-[#FF2A00]" />
              <div className="text-lg font-bold uppercase mt-2">ENREGISTREMENT VALIDÉ</div>
              <p className="text-xs text-[#444] mt-1">Merci {name || 'l’ami(e)'}. Votre présence est encodée dans le planning du régisseur.</p>
            </motion.div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setRsvpSent(true); }} className="mt-8 space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-mono text-[#888] uppercase mb-1">Votre Prénom & Nom</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: Alex Mercier"
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] font-mono text-sm text-white focus:border-[#FF2A00] outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAttendStatus('yes')}
                  className={`py-3.5 font-mono text-xs font-bold uppercase tracking-wider transition ${attendStatus === 'yes' ? 'bg-[#FF2A00] text-white' : 'bg-[#0A0A0A] border border-[#333] text-[#888]'}`}
                >
                  ✓ JE SERAI LÀ
                </button>
                <button
                  type="button"
                  onClick={() => setAttendStatus('no')}
                  className={`py-3.5 font-mono text-xs font-bold uppercase tracking-wider transition ${attendStatus === 'no' ? 'bg-white text-black' : 'bg-[#0A0A0A] border border-[#333] text-[#888]'}`}
                >
                  ✕ JE SERAI ABSENT
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#FF2A00] hover:text-white transition mt-4"
              >
                Valider mon statut dans le dossier
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer Minimal */}
      <footer className="py-8 px-4 sm:px-12 border-t border-[#222] bg-[#0A0A0A] flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#666] gap-4">
        <div>LÉA & ROMAN — 24.10.2026 // PARIS</div>
        <div>COORDINATION : FUGACE STUDIO PAR LE MONDE AIME</div>
      </footer>
    </div>
  );
}
