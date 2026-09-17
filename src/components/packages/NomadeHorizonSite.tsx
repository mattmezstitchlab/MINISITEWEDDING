import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, Compass, Hotel, MapPin, Sun, Anchor, Calendar, ArrowRight, Check } from 'lucide-react';

export default function NomadeHorizonSite() {
  const [activeTab, setActiveTab] = useState<'vols' | 'hotels' | 'calanques'>('vols');
  const [guestFlightCode, setGuestFlightCode] = useState('');
  const [flightSaved, setFlightSaved] = useState(false);

  const localSecrets = [
    {
      name: 'Cala Deia & Poissons Grillés',
      desc: 'Une crique secrète d’eau turquoise accessible par un escalier de chèvres. Dégustation de gambas rouges et de sangria blanche les pieds dans l’eau.',
      type: 'Baignade & Déjeuner',
    },
    {
      name: 'Oliveraie Millénaire de Valldemossa',
      desc: 'Des oliviers tordus par les siècles où George Sand et Chopin trouvèrent l’inspiration. Dégustation d’huile d’olive pressée à froid.',
      type: 'Balade Sensorielle',
    },
    {
      name: 'Coucher de Soleil au Phare de Formentor',
      desc: 'Falaise vertigineuse de 300 mètres plongeant dans la Méditerranée. L’endroit exact où nous trinquerons au Welcome Dinner.',
      type: 'Panorama Céleste',
    },
  ];

  return (
    <div className="bg-[#FAF9F6] text-[#2D2A26] min-h-screen selection:bg-[#C2593F] selection:text-white" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      {/* Top Banner */}
      <div className="border-b border-[#2D2A26]/10 bg-[#F4EFE6] px-4 sm:px-8 py-3 flex items-center justify-between text-xs tracking-[0.25em] uppercase font-semibold text-[#C2593F]">
        <div className="flex items-center gap-2">
          <Sun size={14} />
          <span className="text-[#2D2A26]">NOMADE & HORIZON // DESTINATION WEDDING MÉDITERRANÉE 3 JOURS</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[11px] text-[#2D2A26]/70">
          <a href="#travel-guide" className="hover:text-[#C2593F] transition">Travel Guide</a>
          <a href="#calanques-secretes" className="hover:text-[#C2593F] transition">Carte des Calanques</a>
          <a href="#vols-conciergerie" className="hover:text-[#C2593F] transition">Transferts Aéroport</a>
        </div>
        <div className="text-[11px] font-mono text-[#C2593F] border border-[#C2593F]/40 px-3 py-1 rounded-full">
          MAJORQUE • 3 JOURS
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative min-h-[92vh] flex flex-col justify-end p-6 sm:p-14 overflow-hidden border-b border-[#2D2A26]/10">
        <div className="absolute inset-0">
          <img
            src="/images/packages/nomade-horizon.jpg"
            alt="Nomade et Horizon Mariage"
            className="w-full h-full object-cover filter contrast-105 brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-[#FAF9F6]/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C2593F]/10 backdrop-blur-md text-[#C2593F] text-[11px] tracking-[0.25em] uppercase font-semibold mb-6">
            <Anchor size={13} /> Destination Wedding Solaire & Parenthèse Méditerranéenne
          </div>

          <h1
            className="text-[#2D2A26] uppercase leading-[0.92] tracking-tight font-light text-[clamp(3.5rem,11vw,9rem)]"
            style={{ fontFamily: '"Italiana", serif' }}
          >
            ROMAIN <span className="font-normal italic text-[#C2593F]">&</span> PALOMA
          </h1>

          <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 border-t border-[#2D2A26]/15">
            <div>
              <p className="text-xl sm:text-2xl font-light text-[#2D2A26] tracking-wide" style={{ fontFamily: '"Italiana", serif' }}>
                18 AU 20 JUIN 2026 — FINCA BELLVER, MAJORQUE
              </p>
              <p className="text-sm text-[#2D2A26]/75 mt-1 font-light">
                Trois jours de fête sous les oliviers et les falaises dorées. Le voyage commence ici.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a href="#travel-guide" className="px-7 py-3.5 rounded-full bg-[#C2593F] text-white text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#a84730] transition shadow-lg">
                Consulter le Travel Guide
              </a>
              <a href="#calanques-secretes" className="px-7 py-3.5 rounded-full border border-[#2D2A26]/30 text-[#2D2A26] text-xs tracking-[0.2em] uppercase font-semibold hover:bg-white transition">
                Carte des Lieux
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* MODULE 1 : LE TRAVEL GUIDE COMPLET DES CONVIVES */}
      <section id="travel-guide" className="py-24 sm:py-36 px-4 sm:px-8 border-b border-[#2D2A26]/10 bg-[#F4EFE6]/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#C2593F] font-bold flex items-center justify-center gap-1.5">
              <Plane size={14} /> LOGISTIQUE VOYAGE SIMPLIFIÉE
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-light uppercase tracking-tight text-[#2D2A26]" style={{ fontFamily: '"Italiana", serif' }}>
              LE TRAVEL GUIDE DES INVITÉS
            </h2>
            <p className="mt-3 text-sm text-[#2D2A26]/75 font-light">
              Toutes les recommandations pour voyager en toute sérénité : vols réguliers, hôtels partenaires et navettes de l'agence.
            </p>
          </div>

          {/* Guide category selector */}
          <div className="flex justify-center gap-3 mb-10">
            {[
              { id: 'vols', label: '01. Liaisons Aériennes & Ferry', icon: Plane },
              { id: 'hotels', label: '02. Hébergements Privatisés', icon: Hotel },
              { id: 'calanques', label: '03. Transports & Voitures', icon: Anchor },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-[#C2593F] text-white shadow-md'
                    : 'bg-white border border-[#2D2A26]/10 text-[#2D2A26]/70 hover:text-[#2D2A26]'
                }`}
              >
                <tab.icon size={14} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Guide details cards */}
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#2D2A26]/10 shadow-xl">
            {activeTab === 'vols' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-light text-[#2D2A26] uppercase" style={{ fontFamily: '"Italiana", serif' }}>Vols Conseillés vers Palma de Majorque (PMI)</h3>
                <p className="text-xs text-[#2D2A26]/80 leading-relaxed font-light">
                  Liaisons directes quotidiennes depuis Paris (CDG & Orly), Lyon, Genève, Bordeaux et Bruxelles (1h45 de vol moyen). Nos navettes privées vous attendent à la sortie du terminal 4.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-[#2D2A26]/10 text-xs font-mono">
                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#2D2A26]/10">
                    <strong className="block text-[#C2593F] mb-1">ALLER CONSEILLÉ // JEUDI 18 JUIN</strong>
                    Vol Air France AF7410 (Dép. Orly 09h30 — Arr. Palma 11h15)
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#2D2A26]/10">
                    <strong className="block text-[#C2593F] mb-1">RETOUR CONSEILLÉ // DIMANCHE 20 JUIN</strong>
                    Vol Transavia TO4192 (Dép. Palma 18h40 — Arr. Orly 20h30)
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hotels' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-light text-[#2D2A26] uppercase" style={{ fontFamily: '"Italiana", serif' }}>Hôtels avec Tarifs Négociés</h3>
                <p className="text-xs text-[#2D2A26]/80 leading-relaxed font-light">
                  L'agence Le Monde Aime a bloqué trois établissements de charme à moins de 15 minutes de la Finca. Mentionnez le code <strong>ROMAINPALOMA26</strong> lors de votre réservation.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-[#2D2A26]/10 text-xs">
                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#2D2A26]/10">
                    <strong className="block text-sm font-semibold text-[#2D2A26]">Belmond La Residencia (Deià)</strong>
                    Hôtel 5 étoiles d'exception niché dans les collines. Service de voiture privée inclus.
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#2D2A26]/10">
                    <strong className="block text-sm font-semibold text-[#2D2A26]">Finca Ca’s Curial (Sóller)</strong>
                    Maison de maître au milieu des citronniers. Ambiance intimiste et piscine chauffée.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'calanques' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-light text-[#2D2A26] uppercase" style={{ fontFamily: '"Italiana", serif' }}>Navettes & Mobilité sur Place</h3>
                <p className="text-xs text-[#2D2A26]/80 leading-relaxed font-light">
                  Pour votre confort et votre sécurité lors des soirées festives, des vans privés Mercedes feront la navette en continu entre vos hôtels et le lieu des festivités du jeudi au dimanche soir.
                </p>
                <div className="p-4 rounded-xl bg-[#C2593F]/10 border border-[#C2593F]/30 text-xs text-[#C2593F] font-semibold">
                  Aucune voiture de location indispensable pour les événements officiels.
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MODULE 2 : CARTE D'EXPLORATION LOCALE DES ADRESSES SECRÈTES */}
      <section id="calanques-secretes" className="py-24 sm:py-36 px-4 sm:px-8 border-b border-[#2D2A26]/10 bg-[#FAF9F6]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#2D2A26]/15">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#C2593F] font-bold flex items-center gap-1.5">
                <Compass size={14} /> ADRESSES PRIVILÉGIÉES
              </span>
              <h2 className="text-4xl sm:text-5xl font-light uppercase tracking-tight text-[#2D2A26] mt-1" style={{ fontFamily: '"Italiana", serif' }}>
                LE CARNET SECRET DE MAJORQUE
              </h2>
            </div>
            <p className="text-sm text-[#2D2A26]/70 max-w-sm font-light leading-relaxed">
              Les trois escales incontournables repérées par Romain & Paloma pour vos temps libres entre deux célébrations.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {localSecrets.map((secret, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white border border-[#2D2A26]/10 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono text-[#C2593F] uppercase tracking-widest">{secret.type}</span>
                  <h3 className="text-lg font-bold text-[#2D2A26] uppercase mt-2" style={{ fontFamily: '"Italiana", serif' }}>
                    {secret.name}
                  </h3>
                  <p className="text-xs text-[#2D2A26]/75 mt-3 leading-relaxed font-light">{secret.desc}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-[#2D2A26]/10 text-xs font-mono text-[#2D2A26]/60">
                  Accès réservé • Référencé sur le carnet d'art
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULE 3 : ENREGISTREMENT VOL CONCIERGERIE */}
      <section id="vols-conciergerie" className="py-24 sm:py-36 px-4 sm:px-8 bg-[#F4EFE6]/50">
        <div className="max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl bg-white border border-[#2D2A26]/15 shadow-xl text-center">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C2593F] font-bold">CONCIERGERIE LIAISONS PRIVÉES</span>
          <h3 className="text-2xl sm:text-3xl font-light uppercase text-[#2D2A26] mt-2" style={{ fontFamily: '"Italiana", serif' }}>
            TRANSMETTRE VOS HORAIRES D'ARRIVÉE
          </h3>
          <p className="text-xs sm:text-sm text-[#2D2A26]/75 mt-2 font-light">
            Indiquez votre numéro de vol pour que notre régisseur vous accueille avec votre pancarte nominative à l'aéroport.
          </p>

          {flightSaved ? (
            <div className="mt-6 p-4 rounded-xl bg-emerald-50 text-xs font-semibold text-emerald-800 flex items-center justify-center gap-2">
              <Check size={18} /> Vos coordonnées d'arrivée sont enregistrées. Votre chauffeur vous contactera la veille.
            </div>
          ) : (
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="ex: AF7410 arrivée 11h15 à Palma"
                value={guestFlightCode}
                onChange={(e) => setGuestFlightCode(e.target.value)}
                className="flex-1 px-4 py-3 rounded-full border border-[#2D2A26]/20 text-xs outline-none focus:border-[#C2593F]"
              />
              <button
                onClick={() => guestFlightCode && setFlightSaved(true)}
                className="px-6 py-3 rounded-full bg-[#C2593F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#a84730] transition shrink-0"
              >
                Valider ma navette
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-xs tracking-[0.2em] uppercase text-[#2D2A26]/60 border-t border-[#2D2A26]/10 bg-[#FAF9F6]">
        ROMAIN & PALOMA — 18 AU 20 JUIN 2026 // DIRECTION : NOMADE & HORIZON PAR LE MONDE AIME
      </footer>
    </div>
  );
}
