import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Briefcase,
  CalendarDays,
  Check,
  ChevronRight,
  Compass,
  Database,
  Eye,
  Globe2,
  Grid,
  Heart,
  Layers,
  Lock,
  MapPin,
  PlugZap,
  Radio,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { WEDDING_STYLES, THEME_CATEGORIES, type WeddingStyle } from '../lib/weddingStyles';
import {
  ECOSYSTEM_CONNECTORS,
  FULL_ROLES_TAXONOMY,
  WORLD_DESTINATIONS,
  type FullTaxonomyRole,
  type RoleCategoryType,
} from '../lib/weddingTaxonomy';
import ArchitectureTruthModal from './ArchitectureTruthModal';

interface UniverseDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStyle: (style: WeddingStyle) => void;
  selectedStyleId?: string | null;
}

interface GeoNode {
  id: string;
  styleId: string;
  label: string;
  sublabel: string;
  type: 'wedding' | 'vendor';
  roleOrStyle: string;
  latRatio: number;
  lngRatio: number;
  liveStatus: string;
  isPulse: boolean;
}

type DirectoryTab = 'roles' | 'themes' | 'countries' | 'connectors' | 'reality';
type RoleFilter = RoleCategoryType | 'all';
type RoleSettings = FullTaxonomyRole['defaultSettings'];

const TABS: { id: DirectoryTab; label: string; shortLabel: string; icon: typeof Users }[] = [
  { id: 'roles', label: 'Rôles · 42 métiers & réglages', shortLabel: 'Rôles', icon: Users },
  { id: 'themes', label: 'Thèmes', shortLabel: 'Thèmes', icon: Layers },
  { id: 'countries', label: 'Pays & Rituels', shortLabel: 'Pays & rituels', icon: Globe2 },
  { id: 'connectors', label: 'Connecteurs', shortLabel: 'Connecteurs', icon: PlugZap },
  { id: 'reality', label: 'Reality Check', shortLabel: 'Reality Check', icon: ShieldCheck },
];

const ROLE_FILTERS: { id: RoleFilter; label: string }[] = [
  { id: 'all', label: 'Tous' },
  { id: 'protagonistes', label: 'Protagonistes' },
  { id: 'reception', label: 'Réception & bouche' },
  { id: 'musique', label: 'Musique & live' },
  { id: 'image', label: 'Image & mémoire' },
  { id: 'style', label: 'Style & scène' },
  { id: 'logistique', label: 'Logistique' },
  { id: 'transverse', label: 'Transverses' },
];

const ROLE_SETTING_LABELS: { key: keyof RoleSettings; label: string; description: string }[] = [
  { key: 'notifications', label: 'Notifications', description: 'Alertes liées à ce rôle' },
  { key: 'syncTimeline', label: 'Synchroniser la timeline', description: 'Recevoir les changements du Jour J' },
  { key: 'secretChannel', label: 'Canal secret', description: 'Accès aux espaces masqués' },
  { key: 'autoAlerts', label: 'Alertes automatiques', description: 'Détecter les retards et conflits' },
];

const LIVE_GEO_NODES: GeoNode[] = [
  { id: 'g1', styleId: 'noir-blanc', label: 'Sarah & Noah', sublabel: 'Hôtel Particulier · Paris 7e', type: 'wedding', roleOrStyle: 'Black & White', latRatio: 36, lngRatio: 48, liveStatus: 'En cours de validation régie', isPulse: true },
  { id: 'g2', styleId: 'desert', label: 'Léa & Maxime', sublabel: 'Motel & Piscine · Joshua Tree / Almería', type: 'wedding', roleOrStyle: 'Desert Motel', latRatio: 64, lngRatio: 26, liveStatus: '1 rôle encore ouvert (Super 8)', isPulse: true },
  { id: 'g3', styleId: 'brutal', label: 'Camille & Antoine', sublabel: 'Bunker Industriel · Berlin / Dunkerque', type: 'wedding', roleOrStyle: 'Béton Brut', latRatio: 28, lngRatio: 62, liveStatus: 'Fiche sécurité son validée', isPulse: false },
  { id: 'g4', styleId: 'club', label: 'Romy & Théo', sublabel: 'Warehouse · Lyon Confluence', type: 'wedding', roleOrStyle: 'Club Amour', latRatio: 52, lngRatio: 54, liveStatus: 'Set 02h17 en répétition', isPulse: true },
  { id: 'g5', styleId: 'chateau-moderne', label: 'Éléonore & Henri', sublabel: 'Château de Courcelles · Val de Loire', type: 'wedding', roleOrStyle: 'Château Moderne', latRatio: 42, lngRatio: 42, liveStatus: 'Navettes et tentes crystal calées', isPulse: false },
  { id: 'g6', styleId: 'co-mariage', label: 'Sonia & Julie · Marc & Théo', sublabel: 'Domaine des Deux Rives · Provence', type: 'wedding', roleOrStyle: 'Co-Mariage Festival', latRatio: 72, lngRatio: 58, liveStatus: 'Double scène en montage', isPulse: true },
  { id: 'g7', styleId: 'abyssal', label: 'Dôme Océanique', sublabel: 'Observatoire Sous-marin · Brest / Madère', type: 'wedding', roleOrStyle: 'Dôme Abyssal', latRatio: 38, lngRatio: 18, liveStatus: 'Plongée barométrique confirmée', isPulse: true },
  { id: 'g8', styleId: 'orient-express', label: 'Train de Nuit Impérial', sublabel: 'Ligne Venise Simplon · En mouvement', type: 'wedding', roleOrStyle: 'Train de Nuit', latRatio: 48, lngRatio: 70, liveStatus: 'Passage frontière 21h15', isPulse: true },
  { id: 'g9', styleId: 'phare-atlantique', label: 'Phare de Tévennec', sublabel: 'Pointe du Raz · Mer d’Iroise', type: 'wedding', roleOrStyle: 'Le Phare Isolé', latRatio: 33, lngRatio: 14, liveStatus: 'Créneau houle favorable 17h', isPulse: false },
  { id: 'v1', styleId: 'desert', label: 'Studio Pellicule 8mm', sublabel: 'Cinéaste Nomade', type: 'vendor', roleOrStyle: 'Cinéaste Super 8', latRatio: 58, lngRatio: 32, liveStatus: 'En route vers le désert', isPulse: true },
  { id: 'v2', styleId: 'brutal', label: 'Atelier Béton & Métal', sublabel: 'Designer Scénographe', type: 'vendor', roleOrStyle: 'Light Designer', latRatio: 30, lngRatio: 55, liveStatus: 'Laser sodium prêt', isPulse: true },
  { id: 'v3', styleId: 'club', label: 'Klang Klub Soundsystem', sublabel: 'Ingénieur du son & DJ', type: 'vendor', roleOrStyle: 'DJ Résident', latRatio: 50, lngRatio: 60, liveStatus: 'Jauge 130 BPM synchronisée', isPulse: false },
  { id: 'g11', styleId: 'divorce-party', label: 'Hugo · Dé-Mariage & Liberté', sublabel: 'Rooftop Montmartre · Paris', type: 'wedding', roleOrStyle: 'Fête de Divorce', latRatio: 34, lngRatio: 50, liveStatus: 'Gâteau noir servi & bague recyclée', isPulse: true },
  { id: 'g10', styleId: 'last-minute', label: 'Mariage Éclair 48H · Plan B', sublabel: 'Bordeaux Centre · Place de la Bourse', type: 'wedding', roleOrStyle: 'Mariage Improvisé', latRatio: 58, lngRatio: 40, liveStatus: 'SOS Plan B pluie : repli verrière activé', isPulse: true },
  { id: 'v4', styleId: 'last-minute', label: 'Régisseur Urgence 48H', sublabel: 'Dispatch Express', type: 'vendor', roleOrStyle: 'Régisseur Plan B', latRatio: 56, lngRatio: 42, liveStatus: 'Disponible sous 2h à proximité', isPulse: true },
];

const REALITY_LAYERS = [
  {
    id: 'real',
    label: 'REAL',
    title: 'Fonctionnel maintenant',
    tone: 'emerald',
    icon: Check,
    items: ['Base locale persistante dans le navigateur', 'Taxonomie, filtres et réglages de rôles', 'Création, édition et publication d’un mini-site'],
  },
  {
    id: 'connected',
    label: 'CONNECTED',
    title: 'Branchable à des services réels',
    tone: 'blue',
    icon: Radio,
    items: ['Supabase / PostgreSQL via les fonctions API', 'Spotify, paiement, calendrier et webhooks', 'Stockage et synchronisation multi-appareils'],
  },
  {
    id: 'simulated',
    label: 'SIMULATED',
    title: 'Démonstration interactive locale',
    tone: 'amber',
    icon: Sparkles,
    items: ['Carte géographique et nœuds live de l’Atlas', 'Cascade d’impacts et arbitrage du graphe AIME', 'Talkie, radio, stories et signaux de régie'],
  },
  {
    id: 'conceptual',
    label: 'CONCEPTUAL',
    title: 'Vision produit à connecter',
    tone: 'violet',
    icon: Eye,
    items: ['Déclencheurs DMX / Sonos physiques', 'Orchestration prédictive multi-prestataires', 'Connecteurs externes soumis à leurs autorisations'],
  },
] as const;

function themeCategoryLabel(category?: string) {
  return THEME_CATEGORIES.find((item) => item.id === category)?.label || category || 'Univers';
}

function styleCategoryToRoleCategory(category?: WeddingStyle['category']): RoleCategoryType {
  if (category === 'nature') return 'style';
  if (category === 'urbain') return 'musique';
  if (category === 'sauvage') return 'logistique';
  if (category === 'minimal') return 'image';
  return 'reception';
}

function buildRoleCatalog() {
  const themeRoles = WEDDING_STYLES.flatMap((style) =>
    style.humanMissions.map((mission, index) => ({
      id: `theme-${style.id}-${index}`,
      category: styleCategoryToRoleCategory(style.category),
      categoryLabel: `Mission · ${style.name}`,
      title: mission.role,
      badge: style.vendorToolkit.badge,
      heroImage: style.image,
      tagline: mission.mission,
      description: `${mission.mission}. Compétence clé : ${mission.essentialSkill}.`,
      defaultTime: 'Jour J',
      whatCanDo: [mission.mission, mission.essentialSkill, `Coordination de l’univers ${style.name}`],
      permissionsVisible: `Brief de mission, timeline ${style.name}, contacts d’équipe et livrables associés.`,
      permissionsHidden: 'Budgets privés, canaux secrets et informations sans rapport avec cette mission.',
      cockpitStats: [
        { label: 'Univers', value: style.name },
        { label: 'Statut', value: 'Disponible' },
      ],
      defaultSettings: {
        notifications: true,
        syncTimeline: true,
        secretChannel: false,
        autoAlerts: true,
      },
    }))
  );

  // La version produit expose 42 rôles cœur dans l’Atlas. Les missions propres
  // aux thèmes restent consultables dans l’onglet Thèmes.
  return [...FULL_ROLES_TAXONOMY, ...themeRoles].slice(0, 42);
}

const ROLE_CATALOG = buildRoleCatalog();

export default function UniverseDirectoryModal({
  isOpen,
  onClose,
  onSelectStyle,
  selectedStyleId,
}: UniverseDirectoryModalProps) {
  const [activeTab, setActiveTab] = useState<DirectoryTab>('roles');
  const [viewMode, setViewMode] = useState<'mosaic' | 'map'>('mosaic');
  const [search, setSearch] = useState('');
  const [activeThemeCategory, setActiveThemeCategory] = useState('all');
  const [activeRoleFilter, setActiveRoleFilter] = useState<RoleFilter>('all');
  const [selectedRoleId, setSelectedRoleId] = useState('maries');
  const [activeGeoNode, setActiveGeoNode] = useState<GeoNode | null>(null);
  const [isTruthDetailOpen, setIsTruthDetailOpen] = useState(false);
  const [roleSettings, setRoleSettings] = useState<Record<string, RoleSettings>>(() =>
    Object.fromEntries(ROLE_CATALOG.map((role) => [role.id, { ...role.defaultSettings }]))
  );

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleClose = () => {
    setActiveGeoNode(null);
    setIsTruthDetailOpen(false);
    onClose();
  };

  const filteredStyles = useMemo(() => {
    const query = search.trim().toLowerCase();
    return WEDDING_STYLES.filter((style) => {
      const categoryMatches = activeThemeCategory === 'all' || style.category === activeThemeCategory;
      if (!query) return categoryMatches;
      const missionText = style.humanMissions.map((mission) => `${mission.role} ${mission.mission}`).join(' ');
      return categoryMatches && `${style.name} ${style.tagline} ${style.synopsis || ''} ${missionText}`.toLowerCase().includes(query);
    });
  }, [activeThemeCategory, search]);

  const filteredRoles = useMemo(() => {
    const query = search.trim().toLowerCase();
    return ROLE_CATALOG.filter((role) => {
      const categoryMatches = activeRoleFilter === 'all' || role.category === activeRoleFilter;
      const searchMatches = !query || [role.title, role.categoryLabel, role.tagline, role.description, ...role.whatCanDo].join(' ').toLowerCase().includes(query);
      return categoryMatches && searchMatches;
    });
  }, [activeRoleFilter, search]);

  const filteredDestinations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return WORLD_DESTINATIONS;
    return WORLD_DESTINATIONS.filter((destination) => `${destination.country} ${destination.region} ${destination.tagline} ${destination.culturalCodes.join(' ')} ${destination.recommendedAcoustics}`.toLowerCase().includes(query));
  }, [search]);

  const filteredConnectors = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return ECOSYSTEM_CONNECTORS;
    return ECOSYSTEM_CONNECTORS.filter((connector) => `${connector.name} ${connector.tagline} ${connector.features.join(' ')}`.toLowerCase().includes(query));
  }, [search]);

  const selectedRole = filteredRoles.find((role) => role.id === selectedRoleId) || filteredRoles[0] || ROLE_CATALOG[0];
  const selectedSettings = roleSettings[selectedRole.id] || selectedRole.defaultSettings;

  const toggleRoleSetting = (key: keyof RoleSettings) => {
    setRoleSettings((previous) => ({
      ...previous,
      [selectedRole.id]: {
        ...(previous[selectedRole.id] || selectedRole.defaultSettings),
        [key]: !selectedSettings[key],
      },
    }));
  };

  const switchTab = (tab: DirectoryTab) => {
    setActiveTab(tab);
    setSearch('');
    setActiveGeoNode(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-[#0A0B10] text-white">
        <header className="shrink-0 border-b border-white/10 bg-[#0E0F16]/95 px-4 py-3 backdrop-blur-2xl sm:px-8">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
              <div className="min-w-0">
                <h2 className="truncate text-[14px] font-bold tracking-tight sm:text-[17px]">Atlas Global VOWS · Univers, rôles &amp; vérité produit</h2>
                <div className="mt-0.5 hidden text-[10px] font-mono uppercase tracking-wider text-white/45 sm:block">Un seul accès · cinq vues · une taxonomie canonique</div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden rounded-full bg-white/8 px-2.5 py-1 text-[10px] font-mono text-white/55 md:inline-flex">{ROLE_CATALOG.length} métiers · {WEDDING_STYLES.length} univers</span>
              <button type="button" onClick={handleClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white hover:text-black" title="Fermer l'atlas">
                <X size={18} />
              </button>
            </div>
          </div>
        </header>

        <nav className="no-scrollbar shrink-0 overflow-x-auto border-b border-white/8 bg-[#0A0B10] px-4 py-2 sm:px-8">
          <div className="mx-auto flex min-w-max max-w-[1500px] items-center gap-1.5">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => switchTab(tab.id)}
                  className={`flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-semibold transition sm:px-4 sm:text-[12px] ${isActive ? 'bg-white text-black shadow-lg' : 'text-white/55 hover:bg-white/8 hover:text-white'}`}
                >
                  <Icon size={14} />
                  <span className="sm:hidden">{tab.shortLabel}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="flex min-h-0 flex-1 flex-col">
          {activeTab === 'roles' && (
            <>
              <div className="shrink-0 border-b border-white/5 bg-[#0A0B10] px-4 py-3 sm:px-8">
                <div className="mx-auto flex max-w-[1500px] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-white/50"><Settings2 size={14} className="text-emerald-300" /> Chaque rôle garde ses propres réglages de visibilité et de synchronisation.</div>
                  <label className="relative w-full lg:w-80">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" />
                    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un métier, une mission…" className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-[12px] text-white placeholder-white/30 outline-none focus:border-white/30" />
                  </label>
                </div>
                <div className="no-scrollbar mx-auto mt-3 flex max-w-[1500px] gap-1.5 overflow-x-auto pb-1">
                  {ROLE_FILTERS.map((filter) => (
                    <button key={filter.id} type="button" onClick={() => setActiveRoleFilter(filter.id)} className={`shrink-0 rounded-full px-3 py-1.5 text-[10.5px] font-medium transition ${activeRoleFilter === filter.id ? 'bg-emerald-300 text-black font-bold' : 'bg-white/5 text-white/55 hover:bg-white/10 hover:text-white'}`}>{filter.label}</button>
                  ))}
                </div>
              </div>
              <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-8">
                <div className="mx-auto grid max-w-[1500px] gap-4 pb-8 xl:grid-cols-[minmax(0,1fr)_360px]">
                  <div className="grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredRoles.map((role) => {
                      const isSelected = selectedRole.id === role.id;
                      return (
                        <button key={role.id} type="button" onClick={() => setSelectedRoleId(role.id)} className={`group overflow-hidden rounded-[20px] border text-left transition ${isSelected ? 'border-emerald-300/80 bg-white/10 shadow-[0_0_0_1px_rgba(110,231,183,0.25)]' : 'border-white/10 bg-white/[0.035] hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.07]'}`}>
                          <div className="relative h-28 overflow-hidden bg-black">
                            <img src={role.heroImage} alt="" className="h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
                            <span className="absolute bottom-2.5 left-3 rounded-full border border-white/20 bg-black/45 px-2 py-1 text-[8px] font-mono font-bold uppercase tracking-wider text-white/75">{role.categoryLabel}</span>
                          </div>
                          <div className="space-y-2 p-3.5">
                            <div className="flex items-start justify-between gap-2"><h3 className="text-[13px] font-bold leading-tight text-white">{role.title}</h3><ChevronRight size={14} className={`mt-0.5 shrink-0 ${isSelected ? 'text-emerald-300' : 'text-white/25'}`} /></div>
                            <p className="line-clamp-2 text-[10.5px] leading-relaxed text-white/50">{role.tagline}</p>
                            <div className="flex items-center justify-between border-t border-white/8 pt-2 text-[9.5px] font-mono text-white/40"><span className="flex items-center gap-1"><CalendarDays size={11} /> {role.defaultTime}</span><span className="text-emerald-300/80">{role.badge}</span></div>
                          </div>
                        </button>
                      );
                    })}
                    {filteredRoles.length === 0 && <div className="rounded-[20px] border border-white/10 bg-white/5 p-8 text-center text-[13px] text-white/50 sm:col-span-2 lg:col-span-3">Aucun métier ne correspond à la recherche.</div>}
                  </div>

                  <aside className="h-fit rounded-[24px] border border-white/12 bg-[#11131C] p-5 xl:sticky xl:top-0">
                    <div className="flex items-start gap-3 border-b border-white/10 pb-4">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-[16px] border border-white/20 bg-black"><img src={selectedRole.heroImage} alt="" className="h-full w-full object-cover" /></div>
                      <div className="min-w-0"><div className="text-[9px] font-mono font-bold uppercase tracking-[0.18em] text-emerald-300">Fiche rôle · {selectedRole.categoryLabel}</div><h3 className="mt-1 text-[18px] font-bold leading-tight">{selectedRole.title}</h3><p className="mt-1 text-[10.5px] text-white/45">{selectedRole.tagline}</p></div>
                    </div>
                    <p className="mt-4 text-[12px] leading-relaxed text-white/65">{selectedRole.description}</p>
                    <div className="mt-4 space-y-2">{selectedRole.whatCanDo.map((action) => <div key={action} className="flex gap-2 text-[10.5px] text-white/60"><Check size={13} className="mt-0.5 shrink-0 text-emerald-300" />{action}</div>)}</div>
                    <div className="mt-5 grid grid-cols-2 gap-2">{selectedRole.cockpitStats.map((stat) => <div key={stat.label} className="rounded-[12px] bg-white/5 p-2.5"><div className="text-[8px] font-mono uppercase tracking-wider text-white/35">{stat.label}</div><div className="mt-1 text-[11px] font-semibold text-white/80">{stat.value}</div></div>)}</div>
                    <div className="mt-5 border-t border-white/10 pt-4"><div className="mb-3 flex items-center gap-2 text-[11px] font-bold"><Settings2 size={14} className="text-emerald-300" /> Réglages de ce rôle</div><div className="space-y-2">{ROLE_SETTING_LABELS.map((setting) => { const enabled = Boolean(selectedSettings[setting.key]); return <button key={setting.key} type="button" onClick={() => toggleRoleSetting(setting.key)} className="flex w-full items-center justify-between gap-3 rounded-[12px] bg-white/5 px-3 py-2 text-left transition hover:bg-white/10"><span><span className="block text-[11px] font-semibold text-white/80">{setting.label}</span><span className="block text-[9px] text-white/35">{setting.description}</span></span><span className={`relative h-5 w-9 shrink-0 rounded-full transition ${enabled ? 'bg-emerald-300' : 'bg-white/15'}`}><span className={`absolute top-1 h-3 w-3 rounded-full transition ${enabled ? 'left-5 bg-black' : 'left-1 bg-white/55'}`} /></span></button>; })}</div></div>
                    <div className="mt-5 grid gap-2 text-[10px]"><div className="rounded-[13px] border border-emerald-300/20 bg-emerald-300/5 p-3 text-emerald-100"><div className="flex items-center gap-1.5 font-bold"><Eye size={13} /> Visible pour ce rôle</div><div className="mt-1 text-emerald-100/60">{selectedRole.permissionsVisible}</div></div><div className="rounded-[13px] border border-rose-300/20 bg-rose-300/5 p-3 text-rose-100"><div className="flex items-center gap-1.5 font-bold"><Lock size={13} /> Masqué par défaut</div><div className="mt-1 text-rose-100/60">{selectedRole.permissionsHidden}</div></div></div>
                  </aside>
                </div>
              </div>
            </>
          )}

          {activeTab === 'themes' && (
            <>
              <div className="shrink-0 border-b border-white/5 bg-[#0A0B10] px-4 py-3 sm:px-8">
                <div className="mx-auto flex max-w-[1500px] flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <label className="relative w-full md:w-80"><Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" /><input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un thème, un lieu, un métier…" className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-[12px] text-white placeholder-white/30 outline-none focus:border-white/30" /></label>
                  <div className="flex items-center gap-2"><div className="flex rounded-full border border-white/10 bg-white/5 p-1"><button type="button" onClick={() => setViewMode('mosaic')} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ${viewMode === 'mosaic' ? 'bg-white text-black' : 'text-white/55'}`}><Grid size={13} /> Mosaïque</button><button type="button" onClick={() => setViewMode('map')} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ${viewMode === 'map' ? 'bg-emerald-300 text-black' : 'text-white/55'}`}><MapPin size={13} /> Carte Live</button></div></div>
                </div>
                <div className="no-scrollbar mx-auto mt-3 flex max-w-[1500px] gap-1.5 overflow-x-auto pb-1">{THEME_CATEGORIES.map((category) => <button key={category.id} type="button" onClick={() => setActiveThemeCategory(category.id)} className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-medium ${activeThemeCategory === category.id ? 'bg-white font-bold text-black' : 'bg-white/5 text-white/55 hover:bg-white/10 hover:text-white'}`}>{category.label}</button>)}</div>
              </div>
              <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
                {viewMode === 'mosaic' ? <div className="mx-auto grid max-w-[1500px] gap-4 px-4 py-5 pb-10 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 xl:grid-cols-4">{filteredStyles.map((style) => { const isSelected = selectedStyleId === style.id; return <button key={style.id} type="button" onClick={() => { onSelectStyle(style); handleClose(); }} className={`group overflow-hidden rounded-[24px] border bg-[#12131C] p-3 text-left transition hover:-translate-y-0.5 hover:border-white/30 ${isSelected ? 'border-emerald-300 ring-1 ring-emerald-300/40' : 'border-white/10'}`}><div className="relative aspect-[16/11] overflow-hidden rounded-[19px]"><img src={style.image} alt={style.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" /><div className="absolute left-3 top-3 rounded-full bg-black/60 px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-white/80">{themeCategoryLabel(style.category)}</div><div className="absolute bottom-3 left-3 right-3"><h3 className="text-[16px] font-bold text-white">{style.name}</h3><p className="truncate text-[10.5px] text-white/65">{style.tagline}</p></div></div><div className="space-y-2 px-1 pt-3"><div className="flex items-center gap-1.5 text-[10px] text-white/50"><Briefcase size={12} /> {style.humanMissions.length} métiers coordonnés</div><div className="flex items-center justify-between border-t border-white/8 pt-2 text-[10.5px]"><span className="font-semibold text-emerald-300">{style.vendorToolkit.badge}</span><span className="flex items-center gap-1 font-bold text-white">Ouvrir <ArrowRight size={12} /></span></div></div></button>; })}</div> : <div className="relative flex min-h-[580px] items-center justify-center overflow-hidden bg-[#0A0D14] p-4 sm:p-8"><div className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-40 saturate-50 contrast-125" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=2000&q=80")' }} /><div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }} /><div className="relative mx-auto aspect-[16/10] w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/15 bg-[#0B0C14]/75 p-6 shadow-2xl backdrop-blur-md"><svg className="pointer-events-none absolute inset-0 h-full w-full opacity-20" viewBox="0 0 1000 650" fill="none" stroke="currentColor"><path d="M 380 120 Q 450 140 480 180 T 560 220 T 540 320 T 600 420 T 520 540 T 420 520 T 360 480 T 320 380 T 340 280 T 380 120 Z" strokeWidth="1.5" strokeDasharray="4 4" className="text-white/60" /><path d="M 280 260 Q 320 280 340 320 T 320 380 T 260 360 Z" strokeWidth="1" strokeDasharray="3 3" className="text-emerald-400/40" /><circle cx="480" cy="220" r="140" stroke="rgba(255,255,255,0.08)" strokeWidth="1" /><circle cx="480" cy="220" r="260" stroke="rgba(255,255,255,0.05)" strokeWidth="1" /></svg><div className="absolute inset-x-8 top-1/4 h-px bg-white/[0.04]" /><div className="absolute inset-x-8 top-1/2 h-px bg-white/[0.04]" /><div className="absolute inset-x-8 top-3/4 h-px bg-white/[0.04]" /><div className="absolute inset-y-8 left-1/3 w-px bg-white/[0.04]" /><div className="absolute inset-y-8 left-2/3 w-px bg-white/[0.04]" /><div className="absolute bottom-5 left-6 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[10px] font-mono text-white/50"><Compass size={14} className="animate-spin text-emerald-400" style={{ animationDuration: '30s' }} />CARTE GÉOGRAPHIQUE LIVE · SYNCHRONISATION NATIONALE</div>{LIVE_GEO_NODES.map((node) => <button key={node.id} type="button" style={{ left: `${node.lngRatio}%`, top: `${node.latRatio}%` }} className="group absolute z-20 -translate-x-1/2 -translate-y-1/2" onClick={() => setActiveGeoNode(node)}><span className={node.isPulse ? 'absolute -inset-2.5 animate-ping rounded-full bg-emerald-400/20' : 'hidden'} /><span className={`relative flex h-7 w-7 items-center justify-center rounded-full border shadow-lg transition group-hover:scale-125 ${node.type === 'wedding' ? 'border-white/30 bg-[#181924] text-white' : 'border-emerald-400 bg-emerald-950 text-emerald-300'}`}>{node.type === 'wedding' ? <Users size={12} /> : <Briefcase size={12} />}</span><span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-black/80 px-2 py-0.5 text-[9px] text-white opacity-75 shadow-md transition group-hover:opacity-100">{node.label}</span></button>)}<AnimatePresence>{activeGeoNode && <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} className="absolute bottom-5 right-5 z-30 w-80 rounded-[22px] border border-white/15 bg-[#141520]/95 p-4 text-left text-white shadow-2xl backdrop-blur-xl"><div className="flex items-center justify-between border-b border-white/10 pb-2"><div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />{activeGeoNode.type === 'wedding' ? 'Mariage Planifié' : 'Missionnaire en Direct'}</div><button type="button" onClick={() => setActiveGeoNode(null)} className="text-white/40 hover:text-white"><X size={14} /></button></div><div className="mt-2.5 space-y-1"><div className="text-[15px] font-bold">{activeGeoNode.label}</div><div className="text-[11px] text-white/70">{activeGeoNode.sublabel}</div><div className="mt-1 rounded-md border border-emerald-500/20 bg-emerald-950/40 p-1.5 text-[10.5px] font-mono text-emerald-300">● {activeGeoNode.liveStatus}</div></div><div className="mt-3 flex justify-end border-t border-white/10 pt-2"><button type="button" onClick={() => { const targetStyle = WEDDING_STYLES.find((style) => style.id === activeGeoNode.styleId); if (targetStyle) { onSelectStyle(targetStyle); handleClose(); } }} className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-black transition hover:bg-neutral-200">Ouvrir l’univers <ArrowRight size={11} /></button></div></motion.div>}</AnimatePresence></div></div>}
              </div>
            </>
          )}

          {activeTab === 'countries' && (
            <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-8">
              <div className="mx-auto grid max-w-[1400px] gap-4 pb-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">{filteredDestinations.map((destination) => <article key={destination.id} className="overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.035] transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.07]"><div className="relative h-40 overflow-hidden bg-black"><img src={destination.image} alt="" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" /><div className="absolute bottom-3 left-4"><div className="text-[22px]">{destination.flag}</div><h3 className="text-[15px] font-bold">{destination.country}</h3><p className="text-[10px] text-white/60">{destination.region}</p></div></div><div className="space-y-3 p-4"><p className="text-[11px] font-semibold leading-relaxed text-white/75">{destination.tagline}</p><div className="flex flex-wrap gap-1.5">{destination.culturalCodes.map((code) => <span key={code} className="rounded-full bg-white/8 px-2 py-1 text-[9.5px] text-white/60">{code}</span>)}</div><div className="border-t border-white/8 pt-3 text-[10px] text-white/50"><div>{destination.recommendedAcoustics}</div><div className="mt-1 flex items-center gap-1 font-mono text-emerald-300"><MapPin size={11} /> Coucher · {destination.sunsetTiming}</div></div></div></article>)}</div>
              {filteredDestinations.length === 0 && <div className="mx-auto max-w-xl rounded-[20px] border border-white/10 bg-white/5 p-8 text-center text-[13px] text-white/50">Aucun pays ou rituel ne correspond.</div>}
            </div>
          )}

          {activeTab === 'connectors' && (
            <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-8">
              <div className="mx-auto grid max-w-[1200px] gap-4 pb-8 sm:grid-cols-2 lg:grid-cols-3">{filteredConnectors.map((connector) => <article key={connector.id} className="rounded-[22px] border border-white/10 bg-white/[0.035] p-5 transition hover:-translate-y-0.5 hover:border-white/25"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-white/10 text-[20px]">{connector.icon}</span><div><h3 className="text-[14px] font-bold">{connector.name}</h3><div className="mt-1 text-[9px] font-mono uppercase tracking-wider text-white/40">{connector.category}</div></div></div><span className={`h-2.5 w-2.5 rounded-full ${connector.connectedStatus ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]' : 'bg-white/25'}`} /></div><p className="mt-4 text-[11.5px] leading-relaxed text-white/60">{connector.tagline}</p><ul className="mt-4 space-y-2 border-t border-white/8 pt-4 text-[10.5px] text-white/60">{connector.features.map((feature) => <li key={feature} className="flex gap-2"><Check size={13} className="mt-0.5 shrink-0 text-emerald-300" />{feature}</li>)}</ul><div className="mt-4 text-[10px] font-mono text-white/40">{connector.connectedStatus ? 'Connexion disponible' : 'Connexion à configurer'}</div></article>)}</div>
              {filteredConnectors.length === 0 && <div className="mx-auto max-w-xl rounded-[20px] border border-white/10 bg-white/5 p-8 text-center text-[13px] text-white/50">Aucun connecteur ne correspond.</div>}
            </div>
          )}

          {activeTab === 'reality' && (
            <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-8">
              <div className="mx-auto max-w-[1200px] pb-10">
                <div className="rounded-[26px] border border-white/12 bg-white/[0.04] p-6 sm:p-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-emerald-300"><ShieldCheck size={14} /> Reality Check · Transparence produit</div><h3 className="mt-3 text-[clamp(1.7rem,4vw,3rem)] font-bold leading-tight">Ce qui est réel, connecté, simulé ou conceptuel.</h3><p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-white/55">Pas de faux live : chaque brique est étiquetée selon son niveau de fonctionnement. La démo locale conserve la même logique d’accès que le chemin serveur.</p></div><button type="button" onClick={() => setIsTruthDetailOpen(true)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-[11px] font-bold text-black transition hover:bg-emerald-300"><Database size={14} /> Diagnostic détaillé</button></div><div className="mt-7 grid gap-3 md:grid-cols-2">{REALITY_LAYERS.map((layer) => { const Icon = layer.icon; const toneClasses = layer.tone === 'emerald' ? 'border-emerald-300/25 bg-emerald-300/5' : layer.tone === 'blue' ? 'border-blue-300/25 bg-blue-300/5' : layer.tone === 'amber' ? 'border-amber-300/25 bg-amber-300/5' : 'border-violet-300/25 bg-violet-300/5'; return <div key={layer.id} className={`rounded-[20px] border p-5 ${toneClasses}`}><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><Icon size={16} /><span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em]">{layer.label}</span></div><span className="h-2 w-2 rounded-full bg-current opacity-70" /></div><h4 className="mt-3 text-[15px] font-bold">{layer.title}</h4><ul className="mt-3 space-y-2 text-[11px] text-white/65">{layer.items.map((item) => <li key={item} className="flex gap-2"><Check size={13} className="mt-0.5 shrink-0" />{item}</li>)}</ul></div>; })}</div></div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-[18px] border border-white/10 bg-white/[0.03] p-4"><div className="text-[10px] font-mono uppercase tracking-wider text-white/35">Source de données</div><div className="mt-2 flex items-center gap-2 text-[12px] font-semibold"><Database size={14} className="text-emerald-300" /> LocalStorage ou API</div></div><div className="rounded-[18px] border border-white/10 bg-white/[0.03] p-4"><div className="text-[10px] font-mono uppercase tracking-wider text-white/35">Identité canonique</div><div className="mt-2 flex items-center gap-2 text-[12px] font-semibold"><Heart size={14} className="text-rose-300" /> Une personne · plusieurs rôles</div></div><div className="rounded-[18px] border border-white/10 bg-white/[0.03] p-4"><div className="text-[10px] font-mono uppercase tracking-wider text-white/35">Audit</div><div className="mt-2 flex items-center gap-2 text-[12px] font-semibold"><ShieldCheck size={14} className="text-emerald-300" /> Permissions vérifiables</div></div></div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ArchitectureTruthModal isOpen={isTruthDetailOpen} onClose={() => setIsTruthDetailOpen(false)} />
    </>
  );
}
