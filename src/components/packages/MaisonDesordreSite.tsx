import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, Utensils, Clock, Check, Calendar, Ship, Building2, 
  Wine, ArrowRight, ArrowLeft, ChevronRight, AlertCircle, Compass
} from 'lucide-react';

interface EventItem {
  hour: string;
  category: 'ceremonie' | 'banquet' | 'fete' | 'detente';
  label: string;
  place: string;
  dress: string;
}

export default function MaisonDesordreSite() {
  const [selectedDay, setSelectedDay] = useState<'day1' | 'day2'>('day1');
  const [eventCategoryFilter, setEventCategoryFilter] = useState<'all' | 'ceremonie' | 'banquet' | 'fete' | 'detente'>('all');

  // Conciergerie Stepped Form State
  const [conciergeStep, setConciergeStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    arrivalPoint: 'Aéroport Marco Polo (Canot Riva Privé)',
    arrivalSlot: '14h00 - 15h30',
    hotelChoice: 'Aman Venice (Palais Privatisé)',
    roomType: 'Suite Grand Canal',
    dietPreference: 'Festin Carné Noble & Gibier (7 Services)',
    winePairing: 'Sélection Grands Crus de Vénétie & Barolo',
    allergies: 'Aucune allergie signalée',
  });

  const day1Events: EventItem[] = [
    { hour: '15:00', category: 'ceremonie', label: 'ACCUEIL SUR LA LAGUNE & GONDÔLES PRIVÉES', place: 'Grand Canal // Embarcadère Nord', dress: 'Smoking Noir & Robe de Soie' },
    { hour: '16:30', category: 'ceremonie', label: 'CÉRÉMONIE SOUS LES FRESQUES DU XVIIe', place: 'Salone dei Dogi // Palazzo del Caos', dress: 'Smoking & Masque Vénitien' },
    { hour: '18:30', category: 'banquet', label: 'COCKTAIL D’OR & HUÎTRES OUVERTES À LA VOLÉE', place: 'Terrasse sur l’eau // Quai des Soupirs', dress: 'Tenue de Cérémonie' },
    { hour: '20:30', category: 'banquet', label: 'LE GRAND BANQUET DU DÉSORDRE (7 SERVICES)', place: 'Table impériale 60 mètres en velours sombre', dress: 'Bijoux baroques' },
    { hour: '00:00', category: 'fete', label: 'SABRAGE DU CHAMPAGNE & NUIT SAUVAGE', place: 'Crypte voûtée // Sound-system immersif', dress: 'Chaussures de danse' },
    { hour: '05:30', category: 'detente', label: 'L’ESPRESSO DES SURVIVANTS & BRIOCHES CHAUDES', place: 'Quai du Palais // Premières lueurs d’aube', dress: 'Manteaux de soie' },
  ];

  const day2Events: EventItem[] = [
    { hour: '12:30', category: 'banquet', label: 'RECOVERY BRUNCH AU BORD DU GRAND CANAL', place: 'Jardin Secret du Palazzo // Ombre des orangers', dress: 'Lin Blanc & Lunettes de Soleil' },
    { hour: '15:00', category: 'detente', label: 'RÉGATE PRIVÉE EN BOIS VERNIS SUR LA LAGUNE', place: 'Embarcadère privé // Tour des îles de Murano', dress: 'Tenue décontractée chic' },
    { hour: '18:00', category: 'fete', label: 'APERITIVO DE DÉPART & PROSECCO RARE', place: 'Toit-terrasse // Coucher de soleil vénitien', dress: 'Élégance estivale' },
  ];

  const currentEvents = (selectedDay === 'day1' ? day1Events : day2Events).filter(
    e => eventCategoryFilter === 'all' || e.category === eventCategoryFilter
  );

  return (
    <div className="bg-[#18181B] text-[#F5F5F0] min-h-screen selection:bg-[#6B121C] selection:text-white" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      {/* Top Banner */}
      <div className="border-b border-white/10 bg-[#121214] px-4 sm:px-8 py-3 flex items-center justify-between text-xs tracking-[0.25em] uppercase font-semibold text-[#A1A1AA]">
        <div className="flex items-center gap-2">
          <Crown size={15} className="text-[#C5A059]" />
          <span className="text-[#F5F5F0]">MAISON DÉSORDRE // ORGANISATION COMPLÈTE & MULTI-DAY 2 JOURS</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[11px]">
          <a href="#programme-multiday" className="hover:text-[#6B121C] transition">Programme 2 Jours</a>
          <a href="#conciergerie-etapes" className="hover:text-[#6B121C] transition">Conciergerie & Réservations</a>
        </div>
        <div className="text-[11px] font-mono text-[#C5A059] border border-[#C5A059]/30 px-3 py-1">
          VENISE • 2 JOURS
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

        <div className="relative z-10 max-w-6xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#6B121C] text-white text-[11px] font-semibold tracking-[0.25em] uppercase mb-6">
            <Utensils size={13} /> Architecture Globale Multi-Day // Venise 2026
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
                19 & 20 SEPTEMBRE 2026 — PALAZZO DEL CAOS, VENISE
              </p>
              <p className="text-sm text-[#A1A1AA] mt-1 font-light">
                Une fresque baroque ininterrompue de 48 heures. Canots Riva, banquet impérial et conciergerie totale.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a href="#programme-multiday" className="px-8 py-3.5 bg-[#6B121C] text-white text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#851724] transition shadow-lg">
                Explorer les 2 Jours
              </a>
              <a href="#conciergerie-etapes" className="px-8 py-3.5 border border-white/30 text-white text-xs tracking-[0.2em] uppercase font-semibold hover:border-white transition">
                Conciergerie Invités
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* MODULE 1 : PROGRAMME MULTI-DAY SUR 2 JOURS AVEC FILTRES PAR ÉVÉNEMENT */}
      <section id="programme-multiday" className="py-24 sm:py-36 px-4 sm:px-8 border-b border-white/10 bg-[#18181B]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-[#6B121C] font-semibold">CADENCE LOGISTIQUE COMPLÈTE</span>
              <h2 className="text-4xl sm:text-6xl font-light uppercase tracking-tight mt-1" style={{ fontFamily: '"Cinzel", serif' }}>
                LE DÉROULÉ SUR 2 JOURS
              </h2>
            </div>

            {/* Day Switcher Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedDay('day1')}
                className={`px-6 py-3 rounded-none text-xs tracking-[0.2em] uppercase font-semibold transition border ${
                  selectedDay === 'day1'
                    ? 'bg-[#6B121C] text-white border-[#6B121C]'
                    : 'bg-[#121214] text-[#A1A1AA] border-white/15 hover:text-white'
                }`}
              >
                JOUR 1 : GRAND BANQUET & BAL
              </button>
              <button
                onClick={() => setSelectedDay('day2')}
                className={`px-6 py-3 rounded-none text-xs tracking-[0.2em] uppercase font-semibold transition border ${
                  selectedDay === 'day2'
                    ? 'bg-[#6B121C] text-white border-[#6B121C]'
                    : 'bg-[#121214] text-[#A1A1AA] border-white/15 hover:text-white'
                }`}
              >
                JOUR 2 : RECOVERY BRUNCH & RÉGATE
              </button>
            </div>
          </div>

          {/* Event Category Filters */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-4">
            {[
              { id: 'all', label: 'Tous les moments' },
              { id: 'ceremonie', label: 'Cérémonie' },
              { id: 'banquet', label: 'Gastronomie & Festin' },
              { id: 'fete', label: 'Fête & Nuit' },
              { id: 'detente', label: 'Détente & Bains' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setEventCategoryFilter(f.id as any)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition border ${
                  eventCategoryFilter === f.id
                    ? 'bg-[#C5A059] text-black border-[#C5A059]'
                    : 'bg-[#1E1E22] text-[#A1A1AA] border-white/10 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Events List */}
          <div className="mt-10 space-y-4">
            {currentEvents.map((item, idx) => (
              <div
                key={item.hour}
                className="grid md:grid-cols-[130px_1fr_260px] items-center p-8 bg-[#1E1E22] border border-white/10 hover:border-[#C5A059] transition group"
              >
                <div className="text-3xl font-light text-[#C5A059] tabular-nums" style={{ fontFamily: '"Cinzel", serif' }}>
                  {item.hour}
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#A1A1AA] tracking-widest">{item.category}</span>
                  <h3 className="text-lg font-semibold tracking-wide uppercase text-white mt-0.5 group-hover:text-[#C5A059] transition">
                    {item.label}
                  </h3>
                  <div className="text-xs text-[#A1A1AA] font-light mt-1 flex items-center gap-1.5">
                    <span>Tenue conseillée :</span>
                    <strong className="text-white/80">{item.dress}</strong>
                  </div>
                </div>
                <div className="text-sm text-[#A1A1AA] font-light md:text-right mt-3 md:mt-0 flex items-center md:justify-end gap-1">
                  <Compass size={14} className="text-[#C5A059]" />
                  <span>{item.place}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULE 2 : CONCIERGERIE INVITES INTERACTIVE À ÉTAPES (STEPPED FORM) */}
      <section id="conciergerie-etapes" className="py-24 sm:py-36 px-4 sm:px-8 border-b border-white/10 bg-[#121214]">
        <div className="max-w-4xl mx-auto p-8 sm:p-14 bg-[#18181B] border border-[#C5A059]/40 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs tracking-[0.3em] uppercase text-[#C5A059] font-semibold">SERVICE PRIVILÈGE CONVIÉ</span>
            <h2 className="mt-2 text-3xl sm:text-5xl font-light uppercase tracking-tight" style={{ fontFamily: '"Cinzel", serif' }}>
              CONCIERGERIE INVITES EN 3 ÉTAPES
            </h2>
            <p className="mt-3 text-sm text-[#A1A1AA] font-light">
              Notre équipe de régisseurs orchestre vos transferts Riva, votre suite privée et vos exigences gastronomiques.
            </p>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-3 gap-2 mb-10 pb-6 border-b border-white/10">
            {[
              { num: 1, title: '01. Transferts Riva' },
              { num: 2, title: '02. Hébergement Palais' },
              { num: 3, title: '03. Festin & Vins' },
            ].map((s) => (
              <div
                key={s.num}
                className={`text-center py-2 text-xs font-mono tracking-wider uppercase border-b-2 transition ${
                  conciergeStep === s.num
                    ? 'border-[#C5A059] text-[#C5A059] font-bold'
                    : conciergeStep > s.num
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-white/10 text-white/40'
                }`}
              >
                {s.title}
              </div>
            ))}
          </div>

          {/* STEP 1: SHUTTLE & RIVA */}
          {conciergeStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#C5A059]">
                <Ship size={16} />
                <span>RÉSERVATION DU BATEAU-TAXI PRIVÉ</span>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A1A1AA] mb-2 font-semibold">Votre Nom & Prénom</label>
                <input
                  type="text"
                  placeholder="ex: Alexandre & Éléonore de Lauzun"
                  value={formData.guestName}
                  onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                  className="w-full px-5 py-3.5 bg-[#1E1E22] border border-white/15 text-sm text-white outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A1A1AA] mb-2 font-semibold">Point d'Arrivée à Venise</label>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    'Aéroport Marco Polo (Canot Riva Privé)',
                    'Gare Santa Lucia (Embarcadère)',
                    'Héliport Lido di Venezia',
                  ].map((pt) => (
                    <button
                      type="button"
                      key={pt}
                      onClick={() => setFormData({ ...formData, arrivalPoint: pt })}
                      className={`p-4 border text-xs text-left transition ${
                        formData.arrivalPoint === pt
                          ? 'bg-[#6B121C] border-[#6B121C] text-white font-semibold'
                          : 'bg-[#1E1E22] border-white/10 text-[#A1A1AA] hover:border-white/30'
                      }`}
                    >
                      {pt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A1A1AA] mb-2 font-semibold">Créneau d'Arrivée Souhaité</label>
                <select
                  value={formData.arrivalSlot}
                  onChange={(e) => setFormData({ ...formData, arrivalSlot: e.target.value })}
                  className="w-full px-5 py-3.5 bg-[#1E1E22] border border-white/15 text-sm text-white outline-none focus:border-[#C5A059]"
                >
                  <option>12h00 - 13h30</option>
                  <option>14h00 - 15h30 (Recommandé)</option>
                  <option>16h00 - 17h30</option>
                  <option>Arrivée tardive après 18h00</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setConciergeStep(2)}
                className="w-full py-4 bg-[#C5A059] text-black text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#d8b56f] transition flex items-center justify-center gap-2"
              >
                <span>Continuer vers les hébergements</span>
                <ArrowRight size={15} />
              </button>
            </div>
          )}

          {/* STEP 2: HOTEL & ACCOMMODATION */}
          {conciergeStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#C5A059]">
                <Building2 size={16} />
                <span>RÉSERVATION DU PALAIS PARTENAIRE</span>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A1A1AA] mb-2 font-semibold">Établissement Partenaire Privatisé</label>
                <div className="space-y-3">
                  {[
                    { name: 'Aman Venice (Palais Privatisé)', note: 'Palazzo Papadopoli • Code VIP DÉSORDRE26 • Tarifs négociés' },
                    { name: 'Il Palazzo Experimental', note: 'Dorsoduro • Vue Canal Giudecca • Atmosphère design contemporain' },
                    { name: 'Palazzina Grassi (Design Starck)', note: 'San Samuele • Suites exclusives & champagne bar' },
                  ].map((hotel) => (
                    <button
                      type="button"
                      key={hotel.name}
                      onClick={() => setFormData({ ...formData, hotelChoice: hotel.name })}
                      className={`w-full p-4 border text-left transition ${
                        formData.hotelChoice === hotel.name
                          ? 'bg-[#6B121C] border-[#6B121C] text-white'
                          : 'bg-[#1E1E22] border-white/10 text-[#A1A1AA] hover:border-white/30'
                      }`}
                    >
                      <div className="font-semibold text-sm text-white">{hotel.name}</div>
                      <div className="text-xs text-[#A1A1AA] mt-1 font-light">{hotel.note}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setConciergeStep(1)}
                  className="px-6 py-4 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider hover:bg-white/5"
                >
                  <ArrowLeft size={14} className="inline mr-1" /> Retour
                </button>
                <button
                  type="button"
                  onClick={() => setConciergeStep(3)}
                  className="flex-1 py-4 bg-[#C5A059] text-black text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#d8b56f] transition flex items-center justify-center gap-2"
                >
                  <span>Passer aux préférences gastronomiques</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: GASTRONOMY & WINE PAIRING */}
          {conciergeStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#C5A059]">
                <Wine size={16} />
                <span>EXIGENCES DU FESTIN (7 SERVICES)</span>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A1A1AA] mb-2 font-semibold">Orientation Culinaire</label>
                <div className="space-y-2">
                  {[
                    'Festin Carné Noble & Gibier (7 Services)',
                    'Inspiration Halieutique de la Mer Adriatique (Crustacés & Poissons sauvages)',
                    'Haute Cuisine Végétale Vénitienne (Légumes rares de Sant’Erasmo)',
                  ].map((diet) => (
                    <button
                      type="button"
                      key={diet}
                      onClick={() => setFormData({ ...formData, dietPreference: diet })}
                      className={`w-full p-3.5 border text-xs text-left transition ${
                        formData.dietPreference === diet
                          ? 'bg-[#6B121C] border-[#6B121C] text-white font-semibold'
                          : 'bg-[#1E1E22] border-white/10 text-[#A1A1AA] hover:border-white/30'
                      }`}
                    >
                      {diet}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A1A1AA] mb-2 font-semibold">Allergies ou Régimes Particuliers</label>
                <input
                  type="text"
                  placeholder="ex: Sans gluten, allergie aux crustacés..."
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="w-full px-5 py-3.5 bg-[#1E1E22] border border-white/15 text-sm text-white outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setConciergeStep(2)}
                  className="px-6 py-4 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider hover:bg-white/5"
                >
                  <ArrowLeft size={14} className="inline mr-1" /> Retour
                </button>
                <button
                  type="button"
                  onClick={() => setConciergeStep(4)}
                  className="flex-1 py-4 bg-[#6B121C] text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#851724] transition flex items-center justify-center gap-2 shadow-xl"
                >
                  <span>Confirmer mon dossier conciergerie</span>
                  <Check size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: RECAP & CONFIRMATION */}
          {conciergeStep === 4 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-[#C5A059]/10 border border-[#C5A059] flex items-center justify-center mx-auto text-[#C5A059]">
                <Crown size={32} />
              </div>

              <div className="text-xs font-mono text-[#C5A059] uppercase tracking-widest font-bold">
                DOSSIER DE CONCIERGERIE #MD-2026-VCE VALIDÉ
              </div>
              <h3 className="text-3xl font-light uppercase text-white" style={{ fontFamily: '"Cinzel", serif' }}>
                VOTRE ARRIVÉE EST ORCHESTRÉE
              </h3>
              <p className="text-sm text-[#A1A1AA] max-w-lg mx-auto font-light leading-relaxed">
                Le majordome en chef de la Maison Désordre a réservé votre canot Riva ainsi que votre table d'honneur pour les deux journées de festivités.
              </p>

              <div className="p-6 bg-[#1E1E22] border border-white/10 text-left text-xs font-mono space-y-2 max-w-lg mx-auto">
                <div><span className="text-[#A1A1AA]">INVITÉ :</span> <strong className="text-white">{formData.guestName || 'Hector & Victoire Guests'}</strong></div>
                <div><span className="text-[#A1A1AA]">TRANSFERT :</span> <strong className="text-white">{formData.arrivalPoint} ({formData.arrivalSlot})</strong></div>
                <div><span className="text-[#A1A1AA]">HÔTEL :</span> <strong className="text-white">{formData.hotelChoice}</strong></div>
                <div><span className="text-[#A1A1AA]">MENU 7 SERVICES :</span> <strong className="text-white">{formData.dietPreference}</strong></div>
              </div>

              <button
                type="button"
                onClick={() => setConciergeStep(1)}
                className="px-8 py-3 border border-white/20 text-xs font-mono uppercase text-[#A1A1AA] hover:text-white hover:border-white transition"
              >
                Modifier mes choix
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-xs tracking-[0.2em] uppercase text-[#A1A1AA] border-t border-white/10 bg-[#121214]">
        HECTOR & VICTOIRE — 19 & 20 SEPTEMBRE 2026 // ORGANISATION : MAISON DÉSORDRE PAR LE MONDE AIME
      </footer>
    </div>
  );
}
