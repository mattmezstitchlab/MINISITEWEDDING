import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Users, MapPin, Sparkles, MessageSquareQuote, CheckCircle2 } from 'lucide-react';
import type { WeddingStyle } from '../lib/weddingStyles';

interface CommunityFeedHubProps {
  onSelectTheme: (style: WeddingStyle) => void;
}

// 1. TÉMOIGNAGES AUTHENTIQUES DE MARIAGES INSOLITES CONCRÉTISÉS
const REAL_STORY_TESTIMONIALS = [
  {
    couple: 'Léa & Maxime',
    theme: 'Desert Motel',
    quote: 'On voulait se dire oui à 38°C au fond d’une piscine vide à Joshua Tree. Tout le monde nous prenait pour des fous jusqu’à ce que le cinéaste Super 8 et le guide d’elopement Super Mariage s’alignent en 24h. Le moment le plus vibrant de notre vie.',
    image: '/images/desert-pool-vows.jpg',
    actors: ['Cinéaste Super 8', 'Guide Elopement', 'Food truck tacos'],
  },
  {
    couple: 'Camille & Antoine',
    theme: 'Béton Brut',
    quote: 'Zéro pivoine, pas de château. Juste un bunker industriel, un cercle tracé à la craie et une régie laser monumentale. Nos invités nous parlent encore de la transition clubbing berlinois à 22h.',
    image: '/images/brutal-bunker-vows.jpg',
    actors: ['Light Designer Friche', 'Céramiste Brut', 'DJ Clubbing'],
  },
  {
    couple: 'Sonia & Julie & Marc & Théo',
    theme: 'Co-Mariage Festival',
    quote: 'On est deux couples d’amis inséparables. Pourquoi faire deux mariages séparés et payer le double ? On a mutualisé un domaine d’exception, deux scènes DJ en continu et un banquet XXL.',
    image: '/images/danse.jpg',
    actors: ['Coordinateur Festival', 'Duo DJ b2b', 'Collectif Chefs'],
  },
];

// 2. RANGÉE 1 : MARIAGES PRÉVUS & EN FORMATION
const UPCOMING_WEDDINGS = [
  { id: 'w1', title: 'Sarah & Noah', style: 'Black & White', location: 'Paris 7e', date: '14 Octobre 2026', image: '/images/noir-blanc-entree.jpg', openSlots: 2 },
  { id: 'w2', title: 'Elena & Lucas', style: 'Dôme Abyssal', location: 'Fjord Norvégien', date: '21 Mai 2027', image: '/images/submarine-vows.jpg', openSlots: 1 },
  { id: 'w3', title: 'Inès & Gabriel', style: 'Train de Nuit Impérial', location: 'Paris ➔ Venise', date: '04 Septembre 2026', image: '/images/train-vows.jpg', openSlots: 3 },
  { id: 'w4', title: 'Clara & Baptiste', style: 'Supermarché 22h', location: 'Lyon Confluence', date: '19 Juin 2026', image: '/images/supermarche-vows.jpg', openSlots: 1 },
  { id: 'w5', title: 'Maya & Liam', style: 'Le Phare Isolé', location: 'Finistère Sauvage', date: '11 Juillet 2026', image: '/images/phare-vows.jpg', openSlots: 2 },
  { id: 'w6', title: 'Co-Mariage Festival', style: 'Co-Mariage', location: 'Domaine du Perche', date: '28 Août 2026', image: '/images/chateau-tilleuls.jpg', openSlots: 4 },
];

// 3. RANGÉE 2 : PRESTATAIRES & MISSIONNAIRES INSCRITS
const REGISTERED_VENDORS = [
  { id: 'v1', name: 'Atelier Argentique 35mm', role: 'Photographe / Tirage direct', themeFav: 'Black & White', city: 'Paris / Europe', image: '/images/champagne.jpg', available: 'Disponible 2026' },
  { id: 'v2', name: 'Sound Laser Studio', role: 'Régie Lumière & Laser club', themeFav: 'Club Amour', city: 'Berlin / Lyon', image: '/images/club-strobe-kiss.jpg', available: '3 dates restantes' },
  { id: 'v3', name: 'Chef Nomad & Brasero', role: 'Street-Food & Braises', themeFav: 'Béton Brut', city: 'Marseille / Sud', image: '/images/terrasse.jpg', available: 'Disponible' },
  { id: 'v4', name: 'Vintage Keys 70s', role: 'Pianiste & Swing mobile', themeFav: 'Train de Nuit', city: 'Suisse / Italie', image: '/images/train-vows.jpg', available: 'Dispo automne' },
  { id: 'v5', name: 'Canot Tout Temps Rescue', role: 'Pilote Maritime Mer Forte', themeFav: 'Le Phare Isolé', city: 'Bretagne', image: '/images/phare-vows.jpg', available: 'Sur demande' },
  { id: 'v6', name: 'DJ Velvet Resonance', role: 'Sound Designer Techno/Soul', themeFav: 'Co-Mariage Festival', city: 'Bordeaux / Paris', image: '/images/danse.jpg', available: 'Disponible 2026' },
];

export default function CommunityFeedHub() {
  return (
    <section className="relative bg-[#07070A] text-white py-20 overflow-hidden border-t border-white/5">
      {/* 1. SECTION TÉMOIGNAGES D'IMPOSSIBLE RENDU RÉEL */}
      <div className="mx-auto max-w-6xl px-5 sm:px-8 mb-20">
        <div className="flex flex-col gap-3 mb-12">
          <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-emerald-400">
            Histoires Vécues &amp; Preuves du Réel
          </span>
          <h2 className="vp-title text-white" style={{ fontSize: 'clamp(2.3rem, 5vw, 3.8rem)', lineHeight: 1.08 }}>
            Ils ont refusé le mariage conventionnel.<br />
            <span className="text-white/40">Des missionnaires ont rendu l'impossible réel.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {REAL_STORY_TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-[26px] bg-white/[0.03] border border-white/10 p-6 flex flex-col justify-between hover:bg-white/[0.05] transition-all"
            >
              <div className="space-y-4">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[18px]">
                  <img src={t.image} alt={t.couple} className="h-full w-full object-cover" />
                  <div className="absolute top-2.5 left-2.5 rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                    {t.theme}
                  </div>
                </div>

                <p className="text-[14.5px] leading-relaxed text-white/85 italic">
                  « {t.quote} »
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[14px] font-bold text-white">{t.couple}</div>
                  <div className="text-[11px] text-white/40 truncate max-w-[200px]">
                    {t.actors.join(' · ')}
                  </div>
                </div>
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. DÉFILEMENT BORD-À-BORD 2 RANGÉES (RANGÉE 1: MARIAGES PRÉVUS / RANGÉE 2: PRESTATAIRES) */}
      <div className="space-y-8">
        {/* En-tête du flux en direct */}
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11.5px] font-bold uppercase tracking-[0.2em] text-white/40 block mb-1">
                Flux en direct de la communauté Super Mariage
              </span>
              <h3 className="vp-title text-[24px] sm:text-[32px] text-white">
                Mariages en préparation &amp; Talents disponibles
              </h3>
            </div>
          </div>
        </div>

        {/* Rangée 1 : Mariages prévus (défilement gauche) */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-2 px-6">
            Rangée 1 · Mariages prévus avec missions ouvertes
          </div>
          <div className="no-scrollbar flex gap-4 overflow-x-auto px-6 py-2">
            {UPCOMING_WEDDINGS.map((w) => (
              <div
                key={w.id}
                className="group relative w-72 sm:w-80 shrink-0 overflow-hidden rounded-[22px] bg-white/[0.03] border border-white/10 p-3 hover:bg-white/[0.08] hover:border-white/25 transition-all cursor-pointer"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[16px]">
                  <img src={w.image} alt={w.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute top-2.5 left-2.5 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                    {w.style}
                  </div>
                  <div className="absolute top-2.5 right-2.5 rounded-full bg-amber-400/90 text-black px-2 py-0.5 text-[10px] font-bold">
                    {w.openSlots} postes ouverts
                  </div>
                </div>

                <div className="mt-3 px-1">
                  <div className="text-[15px] font-bold text-white truncate">{w.title}</div>
                  <div className="text-[12px] text-white/50 flex items-center justify-between mt-1">
                    <span>{w.location}</span>
                    <span>{w.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rangée 2 : Prestataires enregistrés (défilement droite) */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-2 px-6">
            Rangée 2 · Prestataires &amp; Spécialistes inscrits sur les univers
          </div>
          <div className="no-scrollbar flex gap-4 overflow-x-auto px-6 py-2">
            {REGISTERED_VENDORS.map((v) => (
              <div
                key={v.id}
                className="group relative w-72 sm:w-80 shrink-0 overflow-hidden rounded-[22px] bg-white/[0.03] border border-white/10 p-3 hover:bg-white/[0.08] hover:border-white/25 transition-all cursor-pointer"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[16px]">
                  <img src={v.image} alt={v.name} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute top-2.5 left-2.5 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                    {v.themeFav}
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-medium backdrop-blur-md">
                    {v.available}
                  </div>
                </div>

                <div className="mt-3 px-1">
                  <div className="text-[15px] font-bold text-white truncate">{v.name}</div>
                  <div className="text-[12px] text-white/50 flex items-center justify-between mt-1">
                    <span className="truncate max-w-[150px]">{v.role}</span>
                    <span>{v.city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
