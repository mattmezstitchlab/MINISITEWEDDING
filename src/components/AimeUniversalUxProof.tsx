import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Plane,
  Briefcase,
  Palette,
  Users,
  Clock,
  Search,
  CheckCircle2,
  Lock,
  Eye,
  MapPin,
  Calendar,
  ArrowRight,
  ShieldCheck,
  History,
  Zap,
  UserPlus,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { AimeKernelService } from '../lib/aimeKernelService';
import type { UniverseCategory, WorldProject, ContextualRelation } from '../lib/aimeArchitectureCore';
import AimeTransmissionModal from './AimeTransmissionModal';
import AimeHumanPersonModal from './AimeHumanPersonModal';

/**
 * 5 UNIVERS CONCRETS BASÉS SUR LE MÊME KERNEL SCELLÉ :
 * 1. MARIAGE : Sarah organise sa célébration
 * 2. VOYAGE : Lucas explore Kyoto
 * 3. PROFESSION : Matt Mez en contrat saxophoniste
 * 4. ART : Exposition & Résidence d'Art
 * 5. FAMILLE : Rassemblement de Famille & Cousinade
 */
interface DemoUniverseDef {
  id: UniverseCategory;
  name: string;
  badge: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  coverImage: string;
  tagline: string;
  location: string;
  date: string;
  leadPerson: string;
  timelineSteps: { time: string; title: string; actor: string; desc: string; access: 'PUBLIC' | 'PARTAGE' | 'SECRET' }[];
}

const UNIVERSES_CONFIG: DemoUniverseDef[] = [
  {
    id: 'MARIAGE',
    name: 'Mariage',
    badge: 'Célébration d’Exception',
    icon: Heart,
    coverImage: '/images/chateau-tilleuls.jpg',
    tagline: 'Élégance minérale, acoustique live & dîner sous les tilleuls',
    location: 'Château des Tilleuls, Valbonne',
    date: '18 Octobre 2026',
    leadPerson: 'Sarah Alvès (Mariée)',
    timelineSteps: [
      { time: '16:00', title: 'Cérémonie Laïque sous l’Arche', actor: 'Officiant & Sarah', desc: 'Échange solennel des vœux et alliances', access: 'PUBLIC' },
      { time: '17:30', title: 'Cocktail Sunset & Performance Acoustique', actor: 'Matt Mez (Saxophoniste)', desc: 'Set live deep house au coucher du soleil', access: 'PUBLIC' },
      { time: '20:00', title: 'Banquet Gastronomique aux Chandelles', actor: 'Chef Traiteur & Brigade', desc: 'Dîner 4 temps synchronisé à la seconde', access: 'PARTAGE' },
      { time: '21:45', title: 'Projection Vidéo Secrète & Flashmob', actor: 'Lucas Bernard (Témoin)', desc: 'Court-métrage surprise masqué aux mariés', access: 'SECRET' },
    ],
  },
  {
    id: 'VOYAGE',
    name: 'Voyage',
    badge: 'Expédition Kyoto 2027',
    icon: Plane,
    coverImage: '/images/noir-blanc.jpg',
    tagline: 'Jardins zen moussus, rituel du thé & mont Fuji',
    location: 'Kyoto & Mont Fuji, Japon',
    date: '12 - 24 Avril 2027',
    leadPerson: 'Lucas Bernard (Co-voyageur & Reporter)',
    timelineSteps: [
      { time: '08:30', title: 'Départ & Vol Tokyo Express', actor: 'Groupe Expédition', desc: 'Vol AF274 Paris CDG -> Tokyo Haneda', access: 'PUBLIC' },
      { time: '14:00', title: 'Check-in Ryokan Traditionnel Gion', actor: 'Sarah & Lucas', desc: 'Dépôt des bagages et formalités de séjour', access: 'PARTAGE' },
      { time: '16:30', title: 'Shooting Argentique Bambouseraie d’Arashiyama', actor: 'Lucas Bernard (Reporter)', desc: 'Prises de vues 35mm lumière rasante', access: 'PUBLIC' },
      { time: '19:30', title: 'Dîner Kaiseki Secret en Maison de Thé', actor: 'Hôte Privé', desc: 'Menu dégustation 8 plats de saison', access: 'SECRET' },
    ],
  },
  {
    id: 'PROFESSION',
    name: 'Profession',
    badge: 'Tournée Live & Masterclass',
    icon: Briefcase,
    coverImage: '/images/noir-blanc.jpg',
    tagline: 'Prestations scéniques, contrats scellés & rider acoustique',
    location: 'Studio Mez Production, Bordeaux / Paris',
    date: '20 Octobre 2026',
    leadPerson: 'Matt Mez (Prestataire Saxophoniste)',
    timelineSteps: [
      { time: '10:00', title: 'Réception & Validation Devis Client', actor: 'Sarah (Client) & Matt', desc: 'Acompte scellé et validation du rider Shure HF', access: 'PARTAGE' },
      { time: '14:00', title: 'Balance Acoustique & Essai Émetteur HF', actor: 'Matt Mez & Régisseur', desc: 'Test portée 80m et égalisation du pavillon', access: 'PARTAGE' },
      { time: '17:30', title: 'Set Live Solo Sunset (Terrasse Ouest)', actor: 'Matt Mez', desc: 'Session live 120 min improvisations deep house', access: 'PUBLIC' },
      { time: '23:00', title: 'Clôture de Session & Facturation Scellée', actor: 'Matt Mez', desc: 'Émission de facture acquittée avec cachet scellé', access: 'PARTAGE' },
    ],
  },
  {
    id: 'PASSION',
    name: 'Art & Création',
    badge: 'Exposition Minérale 2027',
    icon: Palette,
    coverImage: '/images/brutal.jpg',
    tagline: 'Scénographie d’art brut, sculptures sonores & vernissage',
    location: 'Galerie Perrotin / Espace Brutaliste, Paris',
    date: '15 Mai 2027',
    leadPerson: 'Sarah Alvès (Curatrice) & Lucas (Photo)',
    timelineSteps: [
      { time: '11:00', title: 'Accrochage & Scénographie des Sculptures', actor: 'Sarah Alvès (Curatrice)', desc: 'Disposition géométrique des blocs minéraux', access: 'PARTAGE' },
      { time: '15:00', title: 'Installation Sonore & Répétition Saxo Brut', actor: 'Matt Mez (Artiste invité)', desc: 'Bande sonore continue écho saxophone live', access: 'PUBLIC' },
      { time: '18:30', title: 'Vernissage Privé Collectionneurs & Presse', actor: 'Lucas Bernard (Photo Rushes)', desc: 'Cocktail champagne et capture photo argentique', access: 'PUBLIC' },
      { time: '21:00', title: 'Vente Secrète aux Enchères Pièce Maîtresse', actor: 'Commissaire-Priseur', desc: 'Attribution de l’œuvre centrale n° 01', access: 'SECRET' },
    ],
  },
  {
    id: 'FAMILLE',
    name: 'Famille',
    badge: 'Retrouvailles & Cousinade 2026',
    icon: Users,
    coverImage: '/images/champagne.jpg',
    tagline: 'Trois générations réunies, grand banquet champêtre & souvenirs',
    location: 'Domaine Familial des Oliviers, Luberon',
    date: '05 Septembre 2026',
    leadPerson: 'Lucas Bernard & Famille Alvès',
    timelineSteps: [
      { time: '12:00', title: 'Arrivée des Familles & Verre de Bienvenue', actor: 'Lucas & Famille', desc: 'Accueil des cousins, remise des clés de chambre', access: 'PUBLIC' },
      { time: '14:30', title: 'Tournoi de Pétanque & Jeux pour Enfants', actor: 'Tous les membres', desc: 'Jeux intergénérationnels sous les oliviers', access: 'PUBLIC' },
      { time: '19:00', title: 'Grand Barbecue Champêtre & Brasero', actor: 'Grillardin du Domaine', desc: 'Dîner à table infinie partagée', access: 'PARTAGE' },
      { time: '21:30', title: 'Projection de l’Album Famille Rétro 1980-2026', actor: 'Lucas Bernard', desc: 'Archives super 8 et diapositives numérisées', access: 'PARTAGE' },
    ],
  },
];

export default function AimeUniversalUxProof() {
  const [selectedUniverseId, setSelectedUniverseId] = useState<UniverseCategory>('MARIAGE');
  const [selectedPersonId, setSelectedPersonId] = useState<'usr-sarah' | 'usr-mattmez' | 'usr-lucas'>('usr-lucas');
  const [searchQuery, setSearchQuery] = useState('');
  const [transferToast, setTransferToast] = useState<string | null>(null);

  // Modale de Fiche Personne Humaine Unifiée
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [personModalId, setPersonModalId] = useState<string>('usr-lucas');

  // Modale de Transmission & Compréhension
  const [isTransmissionOpen, setIsTransmissionOpen] = useState(false);
  const [transmissionSituation, setTransmissionSituation] = useState<'CEREMONIE_DECALEE' | 'BALANCE_SAXO' | 'SURPRISE_TEMOINS' | 'VOYAGE_RYOKAN'>('CEREMONIE_DECALEE');

  // État proactif de l'agent contextuel (Passe 9) : notification discrète d'impact détecté
  const [agentInsightDismissed, setAgentInsightDismissed] = useState(false);

  // Données canoniques lues en temps réel depuis le Kernel
  const allIdentities = useMemo(() => AimeKernelService.getAllIdentities(), []);
  const activeUniverse = useMemo(
    () => UNIVERSES_CONFIG.find((u) => u.id === selectedUniverseId) || UNIVERSES_CONFIG[0],
    [selectedUniverseId]
  );

  // La personne active dans la démo "Une personne, plusieurs mondes"
  const currentPerson = useMemo(() => {
    return AimeKernelService.getIdentity(selectedPersonId) || allIdentities[0];
  }, [selectedPersonId, allIdentities]);

  // Les rôles de cette personne à travers les différents mondes
  const personContexts = useMemo(() => {
    if (selectedPersonId === 'usr-lucas') {
      return [
        { universe: 'MARIAGE', role: 'Témoin d’Honneur & Maître des Surprises', access: 'Canal Secret Exclusif', project: 'Mariage Sarah' },
        { universe: 'VOYAGE', role: 'Co-voyageur & Reporter Photo 35mm', access: 'Budget Partagé + Itinéraire', project: 'Immersion Kyoto 2027' },
        { universe: 'PASSION', role: 'Photographe Scénographie & Rushes', access: 'Accès Presse & Vernissage', project: 'Exposition Minérale' },
        { universe: 'FAMILLE', role: 'Organisateur & Archiviste Super 8', access: 'Plan d’hébergement Luberon', project: 'Cousinade des Oliviers' },
      ];
    }
    if (selectedPersonId === 'usr-mattmez') {
      return [
        { universe: 'MARIAGE', role: 'Saxophoniste Live (Sunset Cocktail)', access: 'Rider Son HF + Créneau 17:30', project: 'Mariage Sarah' },
        { universe: 'PROFESSION', role: 'Directeur Artistique & Prestataire Scène', access: 'Devis, Contrats & Factures', project: 'Mez Studio Live' },
        { universe: 'PASSION', role: 'Artiste Invité · Création Sonore Minérale', access: 'Installation Acoustique', project: 'Exposition Minérale' },
      ];
    }
    // Sarah
    return [
      { universe: 'MARIAGE', role: 'Organisatrice & Mariée', access: 'Planning complet (hors secrets)', project: 'Mariage Sarah & Gabriel' },
      { universe: 'VOYAGE', role: 'Organisatrice de l’Expédition', access: 'Gestion Billets & Ryokan', project: 'Immersion Kyoto 2027' },
      { universe: 'PASSION', role: 'Curatrice de l’Exposition', access: 'Sélection des œuvres & Ventes', project: 'Exposition Minérale' },
    ];
  }, [selectedPersonId]);

  // Recherche universelle sans complexité
  const filteredTimeline = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return activeUniverse.timelineSteps;
    return activeUniverse.timelineSteps.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.actor.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q)
    );
  }, [searchQuery, activeUniverse]);

  // Action : Réutilisation instantanée sans duplication
  const handleReusePerson = (targetUniverseName: string) => {
    setTransferToast(
      `${currentPerson.canonicalName} a été associé à « ${targetUniverseName} ». Son contact est immédiatement disponible dans ce nouveau projet sans avoir à le recréer.`
    );
    setTimeout(() => setTransferToast(null), 4000);
  };

  return (
    <div className="space-y-12 text-left">
      
      {/* 1. HERO ÉDITORIAL UNIVERSEL */}
      <div className="rounded-[32px] bg-[#0A0B10] text-white p-7 sm:p-10 shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-[11px] font-mono text-fuchsia-400 font-bold border border-white/10">
            <Sparkles size={12} />
            <span>Un seul fil conducteur · Cinq univers</span>
          </div>

          <h2 className="vp-title text-[30px] sm:text-[42px] text-white leading-tight">
            Un fil conducteur unique.<br />
            <span className="text-white/40">Cinq moments de vie radicalement différents.</span>
          </h2>

          <p className="text-[15px] sm:text-[16px] text-white/70 leading-relaxed font-normal max-w-2xl">
            Mariage, voyage, scène, exposition ou retrouvailles familiales : la clarté reste la même.
            Le décor change, la mécanique s'efface. Vos proches et vos moments restent parfaitement synchronisés.
          </p>

          {/* SÉLECTEUR SIMPLE DES 5 UNIVERS */}
          <div className="pt-2 flex flex-wrap gap-2 sm:gap-2.5">
            {UNIVERSES_CONFIG.map((u) => {
              const IconComp = u.icon;
              const isSelected = selectedUniverseId === u.id;
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setSelectedUniverseId(u.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[12.5px] font-semibold transition ${
                    isSelected
                      ? 'bg-white text-black font-bold shadow-lg scale-[1.02]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <IconComp size={14} className={isSelected ? 'text-black' : 'text-fuchsia-400'} />
                  <span>{u.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TOAST DE FEEDBACK DE TRANSFERT */}
      {transferToast && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-4 rounded-[20px] bg-emerald-50 border border-emerald-300 text-emerald-950 text-[12.5px] font-medium flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>{transferToast}</span>
          </div>
          <button type="button" onClick={() => setTransferToast(null)} className="underline text-[11px] font-bold">
            Fermer
          </button>
        </motion.div>
      )}

      {/* BANDEAU PROACTIF DE L'AGENT CONTEXTUEL : PROPOSITION HUMAINE SANS JARGON */}
      {!agentInsightDismissed && selectedUniverseId === 'MARIAGE' && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[22px] bg-gradient-to-r from-neutral-900 to-black text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border border-white/10"
        >
          <div className="flex items-start sm:items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center shrink-0 border border-fuchsia-500/30">
              <Sparkles size={15} />
            </div>
            <div>
              <div className="text-[11px] font-mono text-fuchsia-300 font-bold uppercase tracking-wider">
                Attention utile
              </div>
              <div className="text-[13px] font-semibold text-white mt-0.5">
                L’ajustement de la cérémonie à 16:15 impacte le rôle de Lucas Bernard.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setTransmissionSituation('CEREMONIE_DECALEE');
                setIsTransmissionOpen(true);
              }}
              className="px-4 py-1.5 rounded-full bg-white text-black text-[11.5px] font-bold shadow-sm hover:bg-neutral-100 transition"
            >
              Comprendre &amp; Transmettre
            </button>
            <button
              type="button"
              onClick={() => setAgentInsightDismissed(true)}
              className="px-3 py-1.5 rounded-full text-white/50 hover:text-white text-[11.5px] transition"
            >
              Ignorer
            </button>
          </div>
        </motion.div>
      )}

      {/* 2. DÉMONSTRATION CENTRALE : « UNE PERSONNE. PLUSIEURS MONDES. » */}
      <div className="rounded-[28px] bg-[#F7F7F8] border border-black/8 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/6 pb-4">
          <div>
            <div className="text-[11px] font-mono uppercase text-black/40 font-bold">
              Continuité des proches
            </div>
            <h3 className="vp-title text-[22px] sm:text-[28px] text-black mt-0.5">
              Une Personne · Plusieurs Projets
            </h3>
            <p className="text-[13.5px] text-black/60">
              Sélectionnez un proche pour voir son rôle s'adapter naturellement à chaque projet.
            </p>
          </div>

          {/* SÉLECTEUR DE PERSONNE CANONIQUE */}
          <div className="flex items-center gap-1.5 rounded-full bg-white p-1 border border-black/8 shadow-sm">
            {[
              { id: 'usr-lucas', name: 'Lucas' },
              { id: 'usr-mattmez', name: 'Matt Mez' },
              { id: 'usr-sarah', name: 'Sarah' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPersonId(p.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition ${
                  selectedPersonId === p.id
                    ? 'bg-black text-white font-bold shadow-sm'
                    : 'text-black/60 hover:text-black'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* CARTE DE L'IDENTITÉ CANONIQUE UNIQUE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* CARTE IDENTITÉ CANONIQUE (4 COL) */}
          <div
            onClick={() => {
              setPersonModalId(currentPerson.id);
              setIsPersonModalOpen(true);
            }}
            className="cursor-pointer lg:col-span-4 rounded-[22px] bg-white p-5 border border-black/6 shadow-sm space-y-3 hover:border-black/20 hover:shadow-md transition"
            title="Cliquer pour ouvrir la Fiche Humaine Complète"
          >
            <div className="flex items-center gap-3">
              <img
                src={currentPerson.avatar}
                alt={currentPerson.canonicalName}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-black/5"
              />
              <div>
                <h4 className="text-[16px] font-bold text-black flex items-center gap-1.5">
                  <span>{currentPerson.canonicalName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 text-black/60 font-normal">Voir fiche</span>
                </h4>
                <div className="text-[11px] text-black/40">{currentPerson.homeCity}, {currentPerson.country}</div>
              </div>
            </div>

            <p className="text-[12.5px] text-black/70 leading-relaxed font-normal">
              {currentPerson.bio}
            </p>

            <div className="pt-2 border-t border-black/5 text-[11px] font-mono space-y-1 text-black/60">
              <div>Contact : <span className="text-emerald-700 font-bold">Profil partagé unique</span></div>
              <div className="text-black/40 font-sans text-[10.5px]">Une seule fiche humaine, présente dans vos projets.</div>
            </div>
          </div>

          {/* SES RÔLES CONTEXTUELS DANS CHAQUE UNIVERS (8 COL) */}
          <div className="lg:col-span-8 space-y-2.5">
            <div className="text-[11px] font-mono uppercase text-black/40 font-bold">
              Ses rôles actifs ({personContexts.length} projets) :
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {personContexts.map((ctx, idx) => (
                <div
                  key={idx}
                  className="rounded-[18px] bg-white p-4 border border-black/6 shadow-sm space-y-2 text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-black/5 font-bold text-black">
                      {ctx.universe}
                    </span>
                    <span className="text-[11px] font-mono text-black/40">{ctx.project}</span>
                  </div>

                  <div>
                    <strong className="text-[13px] text-black block">{ctx.role}</strong>
                    <div className="text-[11px] text-black/60 flex items-center gap-1 mt-0.5">
                      <Lock size={10} className="text-purple-600" />
                      <span>{ctx.access}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* BOUTON D'ACTION : UTILISER DANS UN AUTRE UNIVERS */}
            <div className="pt-2 flex items-center gap-2">
              <span className="text-[11px] font-mono text-black/40">Associer à un autre projet :</span>
              {['Voyage', 'Art', 'Famille', 'Profession']
                .filter((name) => !personContexts.some((c) => c.universe.toLowerCase().includes(name.toLowerCase())))
                .slice(0, 2)
                .map((uName) => (
                  <button
                    key={uName}
                    type="button"
                    onClick={() => handleReusePerson(uName)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-black/10 text-[11px] font-semibold text-black hover:bg-neutral-100 transition shadow-sm"
                  >
                    <UserPlus size={11} className="text-emerald-600" />
                    <span>Ajouter à {uName}</span>
                  </button>
                ))}
            </div>
          </div>

        </div>
      </div>

      {/* 3. L'UNIVERS SÉLECTIONNÉ : PROJECTION DU WORLDPROJECT ACTIF */}
      <div className="rounded-[28px] bg-white border border-black/8 overflow-hidden shadow-sm">
        
        {/* GRAND HERO DU MONDE ACTIF */}
        <div className="relative h-[260px] sm:h-[320px] w-full">
          <img
            src={activeUniverse.coverImage}
            alt={activeUniverse.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white max-w-3xl">
            <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-mono uppercase tracking-wider font-bold">
              Univers {activeUniverse.name} · {activeUniverse.badge}
            </span>
            <h3 className="vp-title text-[26px] sm:text-[34px] font-bold text-white mt-1.5 leading-tight">
              {activeUniverse.tagline}
            </h3>
            <div className="text-[12.5px] text-white/80 font-mono mt-1 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                <span>{activeUniverse.location}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{activeUniverse.date}</span>
              </span>
              <span>·</span>
              <span>Pilote : <strong>{activeUniverse.leadPerson}</strong></span>
            </div>
          </div>
        </div>

        {/* TIMELINE UNIVERSELLE DU PROJET (SYSTÈME NERVEUX) */}
        <div className="p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/6 pb-3">
            <div>
              <h4 className="text-[16px] font-bold text-black flex items-center gap-2">
                <Clock size={16} className="text-black/60" />
                <span>Déroulement du projet « {activeUniverse.name} »</span>
              </h4>
              <div className="text-[11px] text-black/50 font-mono">
                Moments clés, intervenants et synchronisation en direct
              </div>
            </div>

            {/* RECHERCHE UNIVERSELLE SANS CHARGE COGNITIVE */}
            <div className="relative w-full sm:w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrer un moment, un acteur..."
                className="w-full rounded-full border border-black/10 bg-[#FAFAFC] py-1.5 pl-8 pr-3 text-[12px] outline-none focus:border-black/30"
              />
            </div>
          </div>

          {/* LISTE DES NŒUDS DE LA TIMELINE */}
          <div className="space-y-3">
            {filteredTimeline.map((step, i) => (
              <div
                key={i}
                className={`rounded-[18px] p-4 border transition ${
                  step.access === 'SECRET'
                    ? 'bg-purple-50/60 border-purple-200'
                    : step.access === 'PUBLIC'
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-[#FAFAFC] border-black/6'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[12px] font-bold px-2 py-0.5 rounded-md bg-white border border-black/10 text-black">
                      {step.time}
                    </span>
                    <strong className="text-[14px] text-black">{step.title}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTransmissionSituation(
                          step.title.toLowerCase().includes('cérémonie') ? 'CEREMONIE_DECALEE' :
                          step.title.toLowerCase().includes('cocktail') ? 'BALANCE_SAXO' :
                          step.title.toLowerCase().includes('projection') ? 'SURPRISE_TEMOINS' : 'VOYAGE_RYOKAN'
                        );
                        setIsTransmissionOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-white border border-black/10 text-black/70 hover:bg-black hover:text-white transition shadow-xs flex items-center gap-1"
                      title="Expliquer cette situation et préparer une transmission humaine"
                    >
                      <Sparkles size={10} className="text-fuchsia-500" />
                      <span>Pourquoi ? / Transmettre</span>
                    </button>

                    <span className={`text-[9.5px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      step.access === 'SECRET'
                        ? 'bg-purple-200 text-purple-900'
                        : step.access === 'PUBLIC'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-neutral-200 text-neutral-800'
                    }`}>
                      {step.access}
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-[12px] text-black/70 flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-t border-black/5 pt-2">
                  <span>{step.desc}</span>
                  <span className="font-mono text-black/90 font-medium">
                    Acteur : <strong>{step.actor}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. TABLEAU DE PREUVE DE COHÉRENCE MULTI-PROJETS */}
      <div className="rounded-[26px] bg-[#F7F7F8] border border-black/8 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-600" />
          <h4 className="text-[15px] font-bold text-black">
            Cohérence et Synchronisation (5 Univers · Données Continues)
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px] font-mono">
            <thead>
              <tr className="border-b border-black/10 text-black/40">
                <th className="py-2">Élément de vie</th>
                <th className="py-2">Mariage</th>
                <th className="py-2">Voyage</th>
                <th className="py-2">Profession</th>
                <th className="py-2">Art</th>
                <th className="py-2">Famille</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 text-black/80">
              <tr>
                <td className="py-2 font-bold text-black">Personne</td>
                <td className="py-2 text-emerald-700">✓ Sarah Alvès</td>
                <td className="py-2 text-emerald-700">✓ Lucas Bernard</td>
                <td className="py-2 text-emerald-700">✓ Matt Mez</td>
                <td className="py-2 text-emerald-700">✓ Sarah Alvès</td>
                <td className="py-2 text-emerald-700">✓ Lucas Bernard</td>
              </tr>
              <tr>
                <td className="py-2 font-bold text-black">Rôle spécifique</td>
                <td className="py-2">Mariée / Témoin</td>
                <td className="py-2">Co-voyageur</td>
                <td className="py-2">Prestataire Live</td>
                <td className="py-2">Curatrice / Artiste</td>
                <td className="py-2">Membre Famille</td>
              </tr>
              <tr>
                <td className="py-2 font-bold text-black">Lieu &amp; Cadre</td>
                <td className="py-2">Château Tilleuls</td>
                <td className="py-2">Kyoto Ryokan</td>
                <td className="py-2">Studio Tournée</td>
                <td className="py-2">Galerie Perrotin</td>
                <td className="py-2">Domaine Luberon</td>
              </tr>
              <tr>
                <td className="py-2 font-bold text-black">Déroulement</td>
                <td className="py-2 text-emerald-700">✓ Synchronisé</td>
                <td className="py-2 text-emerald-700">✓ Synchronisé</td>
                <td className="py-2 text-emerald-700">✓ Synchronisé</td>
                <td className="py-2 text-emerald-700">✓ Synchronisé</td>
                <td className="py-2 text-emerald-700">✓ Synchronisé</td>
              </tr>
              <tr>
                <td className="py-2 font-bold text-black">Confidentialité</td>
                <td className="py-2 text-emerald-700">✓ Secrets &amp; Devis</td>
                <td className="py-2 text-emerald-700">✓ Budget partagé</td>
                <td className="py-2 text-emerald-700">✓ Factures privées</td>
                <td className="py-2 text-emerald-700">✓ Vente confidentielle</td>
                <td className="py-2 text-emerald-700">✓ Chambres privées</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALE DE TRANSMISSION & COMPRÉHENSION */}
      <AimeTransmissionModal
        isOpen={isTransmissionOpen}
        onClose={() => setIsTransmissionOpen(false)}
        projectId={selectedUniverseId === 'MARIAGE' ? 'prj-mariage-sarah-2026' : 'prj-voyage-kyoto-2027'}
        situationKey={transmissionSituation}
        defaultTargetId={selectedPersonId}
      />

      {/* FICHE PERSONNE HUMAINE UNIFIÉE (PASSE 11) */}
      <AimeHumanPersonModal
        isOpen={isPersonModalOpen}
        onClose={() => setIsPersonModalOpen(false)}
        personId={personModalId}
        projectId={selectedUniverseId === 'MARIAGE' ? 'prj-mariage-sarah-2026' : 'prj-voyage-kyoto-2027'}
        onOpenTransmission={(targetId) => {
          setSelectedPersonId(targetId as any);
          setTransmissionSituation('CEREMONIE_DECALEE');
          setIsTransmissionOpen(true);
        }}
      />

    </div>
  );
}
