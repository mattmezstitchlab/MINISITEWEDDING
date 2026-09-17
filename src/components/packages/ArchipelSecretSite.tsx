import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, ShieldAlert, Cpu, Box, Check, Compass, MapPin, Anchor, Sparkles } from 'lucide-react';

export default function ArchipelSecretSite() {
  const [activeZone, setActiveZone] = useState(0);
  const [badgeGenerated, setBadgeGenerated] = useState(false);
  const [guestName, setGuestName] = useState('');

  const popupZones = [
    {
      id: 'A',
      name: 'La Verrière Flottante Démontable (Zone Banquet)',
      surface: '450 m² sur pilotis',
      spec: 'Structure en acier noir modulaire et double vitrage athermique à 360° sur l’eau.',
      autonomy: 'Générateurs hybrides silencieux & climatisation invisible',
    },
    {
      id: 'B',
      name: 'Le Ponton Scénographique & Autel Fluvial',
      surface: '80 mètres de passerelle en teck brut',
      spec: 'Passerelle illuminée par un ruban LED intégré guidant les convives vers l’autel au ras des flots.',
      autonomy: 'Ancrage sur pieux d’acier sans impact sur les fonds marins',
    },
    {
      id: 'C',
      name: 'Le Bloc Cuisine Éphémère & Régie Haute Pression',
      surface: '180 m² de cuisine professionnelle mobile',
      spec: 'Fourneaux de chefs étoilés montés en 48h, chambre froide mobile et retraitement des eaux usées en circuit fermé.',
      autonomy: '100% autonome en eau douce et énergie pendant 72h',
    },
  ];

  return (
    <div className="bg-[#18181B] text-[#F4F4F5] min-h-screen selection:bg-[#D97706] selection:text-black" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      {/* Top Banner */}
      <div className="border-b border-white/10 bg-[#121214] px-4 sm:px-8 py-3 flex items-center justify-between text-xs tracking-[0.25em] uppercase font-semibold text-[#A1A1AA]">
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-[#D97706]" />
          <span className="text-white">ARCHIPEL SECRET // POP-UP ARCHITECTURE, STRUCTURES ÉPHÉMÈRES & LIEUX ISOLÉS</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[11px] text-[#A1A1AA]">
          <a href="#schema-popup" className="hover:text-white transition">Schéma 3D Éphémère</a>
          <a href="#consignes-acces" className="hover:text-white transition">Accès au Site Isolé</a>
          <a href="#badge-securite" className="hover:text-white transition">Badge Accès Sécurisé</a>
        </div>
        <div className="text-[11px] font-mono text-[#D97706] border border-[#D97706]/40 px-3 py-1 rounded-full">
          AUTONOMIE 100%
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative min-h-[92vh] flex flex-col justify-end p-6 sm:p-14 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <img
            src="/images/packages/archipel-secret.jpg"
            alt="Archipel Secret Mariage"
            className="w-full h-full object-cover filter contrast-125 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#18181B] via-[#18181B]/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D97706]/20 backdrop-blur-md border border-[#D97706]/40 text-[#D97706] text-[11px] tracking-[0.25em] uppercase font-semibold mb-6">
            <Cpu size={13} /> Architecture Éphémère & Génie Logistique
          </div>

          <h1
            className="text-white uppercase leading-[0.92] tracking-tight font-extrabold text-[clamp(3.5rem,11vw,9rem)]"
            style={{ fontFamily: '"Syne", sans-serif' }}
          >
            TANGUY <span className="text-[#D97706] font-light">&</span> ALIX
          </h1>

          <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 border-t border-white/15">
            <div>
              <p className="text-xl sm:text-2xl font-mono text-white tracking-wide">
                11 JUILLET 2026 — ÎLOT DES ROCHES NOIRES, BRETAGNE
              </p>
              <p className="text-sm text-[#A1A1AA] mt-1 font-light">
                Un palais de verre et d’acier construit sur une île vierge pour une seule nuit. L’impossible rendu réel.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a href="#schema-popup" className="px-7 py-3.5 rounded-full bg-[#D97706] text-black text-xs font-mono font-bold tracking-wider uppercase hover:bg-amber-400 transition shadow-lg">
                Le Schéma Pop-Up
              </a>
              <a href="#consignes-acces" className="px-7 py-3.5 rounded-full border border-white/30 text-white text-xs font-mono tracking-wider uppercase hover:bg-white/10 transition">
                Accès Maritime
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* MODULE 1 : PLAN TECHNIQUE ET SCHÉMA 3D DES ZONES ÉPHÉMÈRES */}
      <section id="schema-popup" className="py-24 sm:py-36 px-4 sm:px-8 border-b border-white/10 bg-[#121214]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#D97706] font-bold flex items-center gap-1.5">
                <Box size={14} /> INGÉNIERIE SCÉNIQUE
              </span>
              <h2 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-white mt-1" style={{ fontFamily: '"Syne", sans-serif' }}>
                LE COMPLEXE ÉPHÉMÈRE EN 3 ZONES
              </h2>
            </div>
            <p className="text-sm text-[#A1A1AA] max-w-sm font-light leading-relaxed font-mono">
              Aucune infrastructure préalable n'existait sur le site. Montage de 96h, célébration d'une nuit, démontage avec remise en état originel.
            </p>
          </div>

          <div className="mt-12 grid lg:grid-cols-3 gap-6">
            {popupZones.map((z, idx) => (
              <div
                key={z.id}
                onClick={() => setActiveZone(idx)}
                className={`p-8 rounded-3xl border transition cursor-pointer flex flex-col justify-between ${
                  activeZone === idx
                    ? 'bg-[#222226] border-[#D97706] shadow-2xl'
                    : 'bg-[#18181B] border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#D97706] uppercase mb-4">
                    <span>SECTEUR 0{idx + 1}</span>
                    <span>{z.surface}</span>
                  </div>
                  <h3 className="text-xl font-bold uppercase text-white mt-1 leading-snug">{z.name}</h3>
                  <p className="text-xs text-[#A1A1AA] mt-3 leading-relaxed font-light">{z.spec}</p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 text-xs font-mono text-[#D97706]">
                  {z.autonomy}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULE 2 : CONSIGNES D'ACCÈS AU SITE ISOLÉ & ROTATIONS MARITIMES */}
      <section id="consignes-acces" className="py-24 sm:py-36 px-4 sm:px-8 border-b border-white/10 bg-[#18181B]">
        <div className="max-w-5xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#121214] border border-white/15 shadow-2xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#D97706] mb-4">
              <Anchor size={16} />
              <span>PROTOCOLE DE TRAVERSÉE MARITIME</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold uppercase text-white" style={{ fontFamily: '"Syne", sans-serif' }}>
              EMBARQUEMENT AU PORT DU GUILVINEC
            </h3>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-2 font-light leading-relaxed max-w-2xl">
              L'accès à l'îlot se fait exclusivement par nos semi-rigides et vedettes rapides privatisées (15 minutes de traversée). Aucun accès terrestre n'est possible à marée haute.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10 text-xs font-mono">
              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[#D97706] block mb-1">ROTATION 01 // 15H30</span>
                Embarquement convives cérémonie
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[#D97706] block mb-1">ROTATION 02 // 16H15</span>
                Dernière navette avant début des vœux
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[#D97706] block mb-1">RETOURS // DÈS 01H00</span>
                Navettes de retour toutes les 45 min
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODULE 3 : GÉNÉRATION DU BADGE D'ACCÈS INVIOLABLE */}
      <section id="badge-securite" className="py-24 sm:py-36 px-4 sm:px-8 bg-[#121214]">
        <div className="max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl bg-[#18181B] border border-[#D97706]/40 shadow-2xl text-center">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D97706] font-bold">CONTRÔLE RÉGIE DU SITE ISOLÉ</span>
          <h3 className="text-2xl sm:text-3xl font-extrabold uppercase text-white mt-2" style={{ fontFamily: '"Syne", sans-serif' }}>
            VOTRE LAISSER-PASSER POP-UP
          </h3>
          <p className="text-xs text-[#A1A1AA] mt-2 font-mono">
            Réglementation maritime stricte : chaque passager doit être enregistré nominativement avant le 01 Juillet.
          </p>

          {badgeGenerated ? (
            <div className="mt-6 p-6 rounded-2xl bg-black/60 border border-emerald-500/40 text-center space-y-2">
              <Check size={28} className="mx-auto text-emerald-400" />
              <div className="text-xs font-mono font-bold text-white uppercase">
                PASS MARITIME ENREGISTRÉ : {guestName.toUpperCase()}
              </div>
              <div className="text-[11px] font-mono text-[#A1A1AA]">
                Embarquement autorisé • Matériel de sauvetage attribué • Vedette n°02
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              <input
                type="text"
                placeholder="VOTRE NOM & PRÉNOM (CONFORME PIÈCE D’IDENTITÉ)"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-4 py-3.5 bg-black/50 border border-white/20 rounded-xl text-xs font-mono uppercase text-white outline-none focus:border-[#D97706]"
              />
              <button
                onClick={() => guestName && setBadgeGenerated(true)}
                disabled={!guestName}
                className="w-full py-4 rounded-xl bg-[#D97706] text-black text-xs font-mono font-bold uppercase tracking-wider hover:bg-amber-400 transition disabled:opacity-40"
              >
                Générer mon laisser-passer de traversée
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-xs font-mono uppercase text-[#A1A1AA] border-t border-white/10 bg-[#18181B]">
        TANGUY & ALIX — 11.07.2026 // GÉNIE TECHNIQUE : ARCHIPEL SECRET PAR LE MONDE AIME
      </footer>
    </div>
  );
}
