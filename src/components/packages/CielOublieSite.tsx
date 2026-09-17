import { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Sprout, Wind, Recycle, Check, ArrowRight, ShieldCheck, Heart, Award } from 'lucide-react';

export default function CielOublieSite() {
  const [transportMode, setTransportMode] = useState<'train' | 'covoiturage' | 'autre'>('train');
  const [treesPlanted, setTreesPlanted] = useState(140);
  const [pledgeSigned, setPledgeSigned] = useState(false);

  const ecoCommitments = [
    {
      title: 'Fleurs 100% Locales & Don d’Après-Fête',
      desc: 'Aucune fleur importée par avion. Toutes les compositions sont issues de fermes florales bio à moins de 80km, puis redistribuées en EHPAD dès le lendemain.',
      metric: '0 fleur jetée • 320 bouquets redistribués',
    },
    {
      title: 'Table Végétale & Circuits Courts Zéro Déchet',
      desc: 'Menu gastronomique 70% végétal et pêche durable locale. Aucune vaisselle jetable, eau micro-filtrée sur place, biodéchets compostés à la ferme.',
      metric: '100% produits bruts locaux • 0 plastique',
    },
    {
      title: 'Compensation Carbone Certifiée Gold Standard',
      desc: 'L’ensemble des émissions directes et des trajets invités est mesuré, audité par un cabinet indépendant et compensé à 150% via la régénération forestière.',
      metric: '-18.4 tonnes CO₂ compensées',
    },
  ];

  return (
    <div className="bg-[#F4F1EA] text-[#1E3024] min-h-screen selection:bg-[#1C3F2D] selection:text-white" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      {/* Top Banner */}
      <div className="border-b border-[#1E3024]/10 bg-[#EAE5DA] px-4 sm:px-8 py-3 flex items-center justify-between text-xs tracking-[0.25em] uppercase font-semibold text-[#1C3F2D]">
        <div className="flex items-center gap-2">
          <Leaf size={14} className="text-[#2D6A4F]" />
          <span className="text-[#1E3024]">CIEL OUBLIÉ // ÉCO-LUXE, SOURCING BOTANIQUE PUR & ZÉRO CARBO</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[11px] text-[#1E3024]/70">
          <a href="#charte-eco" className="hover:text-[#1E3024] transition">Charte Régénérative</a>
          <a href="#compteur-carbone" className="hover:text-[#1E3024] transition">Compteur Carbone Neutre</a>
          <a href="#pacte-eco" className="hover:text-[#1E3024] transition">Pacte Invités</a>
        </div>
        <div className="text-[11px] font-mono text-[#2D6A4F] border border-[#2D6A4F]/40 px-3 py-1 rounded-full">
          100% NEUTRE EN CARBONE
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative min-h-[92vh] flex flex-col justify-end p-6 sm:p-14 overflow-hidden border-b border-[#1E3024]/10">
        <div className="absolute inset-0">
          <img
            src="/images/packages/ciel-oublie.jpg"
            alt="Ciel Oublié Éco-Luxe Mariage"
            className="w-full h-full object-cover filter contrast-105 brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F4F1EA] via-[#F4F1EA]/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C3F2D]/10 backdrop-blur-md text-[#1C3F2D] text-[11px] tracking-[0.25em] uppercase font-semibold mb-6">
            <Sprout size={13} /> Sourcing Pur & Haute Botanique Régénérative
          </div>

          <h1
            className="text-[#1E3024] uppercase leading-[0.92] tracking-tight font-light text-[clamp(3.5rem,11vw,9rem)]"
            style={{ fontFamily: '"Cinzel Decorative", "Cormorant Garamond", serif' }}
          >
            JULIEN <span className="font-normal italic text-[#2D6A4F]">&</span> CLÉMENCE
          </h1>

          <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 border-t border-[#1E3024]/15">
            <div>
              <p className="text-xl sm:text-2xl font-light text-[#1E3024] tracking-wide" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                29 MAI 2026 — SERRE BIOCLIMATIQUE, DOMAINE DU VIVANT
              </p>
              <p className="text-sm text-[#1E3024]/75 mt-1 font-light">
                Le grand luxe n'a de sens que s'il protège ce qu'il célèbre. Une célébration régénérative complète.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a href="#charte-eco" className="px-7 py-3.5 rounded-full bg-[#1C3F2D] text-white text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#2D6A4F] transition shadow-lg">
                La Charte Éco-Luxe
              </a>
              <a href="#compteur-carbone" className="px-7 py-3.5 rounded-full border border-[#1E3024]/30 text-[#1E3024] text-xs tracking-[0.2em] uppercase font-semibold hover:bg-white/50 transition">
                Compteur Carbone
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* MODULE 1 : LA CHARTE ÉCO-RESPONSABLE EN ACTION */}
      <section id="charte-eco" className="py-24 sm:py-36 px-4 sm:px-8 border-b border-[#1E3024]/10 bg-[#EAE5DA]/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#2D6A4F] font-bold">
              ENGAGEMENT SANS COMPROMIS
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-light uppercase tracking-tight text-[#1E3024]" style={{ fontFamily: '"Cinzel Decorative", serif' }}>
              LA CHARTE DU LUXE CONSCIENT
            </h2>
            <p className="mt-3 text-sm text-[#1E3024]/70 font-light">
              Chaque détail du mariage est conçu pour laisser une empreinte émotionnelle indélébile et une empreinte écologique neutre.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {ecoCommitments.map((item, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white border border-[#1E3024]/10 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#1C3F2D]/10 text-[#1C3F2D] flex items-center justify-center font-mono text-sm font-bold mb-4">
                    0{i + 1}
                  </div>
                  <h3 className="text-lg font-bold text-[#1E3024] uppercase tracking-wide">{item.title}</h3>
                  <p className="text-xs text-[#1E3024]/75 mt-3 leading-relaxed font-light">{item.desc}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-[#1E3024]/10 text-xs font-mono text-[#2D6A4F] font-medium">
                  {item.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULE 2 : COMPTEUR D'EMPREINTE CARBONE INTERACTIF */}
      <section id="compteur-carbone" className="py-24 sm:py-36 px-4 sm:px-8 border-b border-[#1E3024]/10 bg-[#F4F1EA]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#2D6A4F] font-bold">
            AUDIT CERTIFIÉ EN DIRECT
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-light uppercase tracking-tight text-[#1E3024]" style={{ fontFamily: '"Cinzel Decorative", serif' }}>
            COMPTEUR D’EMPREINTE CARBONE
          </h2>
          <p className="mt-4 text-sm text-[#1E3024]/75 font-light max-w-xl mx-auto">
            Sélectionnez votre moyen de transport pour vous rendre au domaine : nous calculons et finançons immédiatement les arbres plantés pour neutraliser votre venue.
          </p>

          <div className="mt-12 p-8 sm:p-12 rounded-3xl bg-white border border-[#1E3024]/15 shadow-xl max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-wider text-[#1E3024]/70 font-semibold block mb-4">Votre Déplacement vers le Domaine</span>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'train', label: 'Train + Navette Électrique', trees: 140 },
                { id: 'covoiturage', label: 'Covoiturage Invités', trees: 165 },
                { id: 'autre', label: 'Véhicule Particulier', trees: 190 },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setTransportMode(opt.id as any);
                    setTreesPlanted(opt.trees);
                  }}
                  className={`p-4 rounded-2xl border text-xs text-center transition flex flex-col items-center justify-center gap-1 ${
                    transportMode === opt.id
                      ? 'bg-[#1C3F2D] text-white border-[#1C3F2D] font-semibold shadow-md'
                      : 'bg-[#F4F1EA] text-[#1E3024] border-[#1E3024]/10 hover:border-[#1C3F2D]/40'
                  }`}
                >
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>

            {/* Tree planting counter metric */}
            <div className="mt-8 p-6 rounded-2xl bg-[#EAE5DA] border border-[#1C3F2D]/20 text-center">
              <div className="text-4xl sm:text-5xl font-mono font-bold text-[#1C3F2D] tabular-nums">
                {treesPlanted} ARBRES PLANTÉS
              </div>
              <div className="text-xs text-[#2D6A4F] font-mono mt-2 font-medium">
                Parcelle n°14 • Forêt de Rambouillet • Partenariat Reforest'Action
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODULE 3 : PACTE INVITÉS & ENGAGEMENT */}
      <section id="pacte-eco" className="py-24 sm:py-36 px-4 sm:px-8 bg-[#EAE5DA]/60">
        <div className="max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl bg-white border border-[#1E3024]/15 shadow-xl text-center">
          <div className="w-12 h-12 rounded-full bg-[#1C3F2D]/10 text-[#1C3F2D] flex items-center justify-center mx-auto mb-4">
            <Heart size={22} />
          </div>

          <h3 className="text-2xl sm:text-3xl font-light uppercase text-[#1E3024]" style={{ fontFamily: '"Cinzel Decorative", serif' }}>
            SIGNER LE PACTE DE LA FORÊT
          </h3>
          <p className="text-xs sm:text-sm text-[#1E3024]/75 mt-2 font-light leading-relaxed">
            « En participant à cette fête, je m'engage à savourer l'instant, respecter le silence nocturne de la réserve naturelle et repartir sans laisser d'autre trace que mon affection. »
          </p>

          {pledgeSigned ? (
            <div className="mt-6 p-4 rounded-xl bg-[#1C3F2D]/10 text-xs font-semibold text-[#1C3F2D] flex items-center justify-center gap-2">
              <Check size={18} /> Merci. Votre engagement est gravé sur le registre du domaine.
            </div>
          ) : (
            <button
              onClick={() => setPledgeSigned(true)}
              className="mt-6 px-8 py-3.5 rounded-full bg-[#1C3F2D] text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#2D6A4F] transition shadow-lg"
            >
              Signer le pacte des mariés
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-xs tracking-[0.2em] uppercase text-[#1E3024]/60 border-t border-[#1E3024]/10 bg-[#F4F1EA]">
        JULIEN & CLÉMENCE — 29.05.2026 // SCÉNOGRAPHIE : CIEL OUBLIÉ PAR LE MONDE AIME
      </footer>
    </div>
  );
}
