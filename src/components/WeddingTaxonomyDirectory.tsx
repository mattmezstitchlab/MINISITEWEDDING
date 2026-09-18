import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  Globe2,
  MapPin,
  PlugZap,
  Search,
  ShieldCheck,
  UsersRound,
} from 'lucide-react';
import {
  ECOSYSTEM_CONNECTORS,
  FULL_ROLES_TAXONOMY,
  WORLD_DESTINATIONS,
  type RoleCategoryType,
} from '../lib/weddingTaxonomy';

type DirectoryTab = 'roles' | 'destinations' | 'connectors';
type RoleFilter = RoleCategoryType | 'all';

const ROLE_FILTERS: { id: RoleFilter; label: string }[] = [
  { id: 'all', label: 'Tous les métiers' },
  { id: 'protagonistes', label: 'Protagonistes' },
  { id: 'reception', label: 'Réception & bouche' },
  { id: 'musique', label: 'Musique & live' },
  { id: 'image', label: 'Image & mémoire' },
  { id: 'style', label: 'Style & scénographie' },
  { id: 'logistique', label: 'Logistique & sécurité' },
  { id: 'transverse', label: 'Métiers transverses' },
];

const CONNECTOR_LABELS: Record<string, string> = {
  audio: 'Audio',
  paiement: 'Paiement',
  synchro: 'Synchronisation',
  comm: 'Communication',
};

export default function WeddingTaxonomyDirectory() {
  const [activeTab, setActiveTab] = useState<DirectoryTab>('roles');
  const [activeFilter, setActiveFilter] = useState<RoleFilter>('all');
  const [search, setSearch] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('maries');

  const filteredRoles = useMemo(() => {
    const query = search.trim().toLowerCase();
    return FULL_ROLES_TAXONOMY.filter((role) => {
      const matchesCategory = activeFilter === 'all' || role.category === activeFilter;
      const matchesSearch = !query || [
        role.title,
        role.categoryLabel,
        role.tagline,
        role.description,
        ...role.whatCanDo,
      ].join(' ').toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeFilter, search]);

  const selectedRole = filteredRoles.find((role) => role.id === selectedRoleId) || filteredRoles[0] || FULL_ROLES_TAXONOMY[0];

  return (
    <div className="overflow-hidden rounded-[32px] border border-black/10 bg-white shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
      <div className="border-b border-black/8 bg-[#FBFBFD] p-5 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-black/45">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Taxonomie active · source canonique
            </div>
            <h2 className="vp-h2 mt-3 text-[26px] sm:text-[32px]">Les bons accès, pour les bonnes personnes.</h2>
            <p className="vp-body mt-2 max-w-2xl text-[14px]">
              Chaque rôle possède son cockpit, ses permissions et son moment dans la journée. Un mariage n’est pas une liste de prestataires : c’est un réseau de responsabilités lisible.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono uppercase tracking-wider text-black/45 sm:min-w-[300px]">
            <div className="rounded-[16px] border border-black/8 bg-white px-3 py-3">
              <UsersRound className="mx-auto mb-1.5 text-black" size={16} />
              <strong className="block text-[20px] leading-none text-black">{FULL_ROLES_TAXONOMY.length}</strong>
              métiers
            </div>
            <div className="rounded-[16px] border border-black/8 bg-white px-3 py-3">
              <Globe2 className="mx-auto mb-1.5 text-black" size={16} />
              <strong className="block text-[20px] leading-none text-black">{WORLD_DESTINATIONS.length}</strong>
              destinations
            </div>
            <div className="rounded-[16px] border border-black/8 bg-white px-3 py-3">
              <PlugZap className="mx-auto mb-1.5 text-black" size={16} />
              <strong className="block text-[20px] leading-none text-black">{ECOSYSTEM_CONNECTORS.length}</strong>
              connecteurs
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 border-t border-black/8 pt-5">
          {([
            ['roles', 'Métiers & accès'],
            ['destinations', 'Destinations & rituels'],
            ['connectors', 'Connecteurs du système'],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`rounded-full px-4 py-2 text-[12px] font-semibold transition ${activeTab === id ? 'bg-black text-white' : 'border border-black/10 bg-white text-black/60 hover:border-black/25 hover:text-black'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'roles' && (
        <div className="p-5 sm:p-7">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
              {ROLE_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${activeFilter === filter.id ? 'bg-black text-white' : 'border border-black/10 text-black/55 hover:border-black/25 hover:text-black'}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <label className="flex min-w-[220px] items-center gap-2 rounded-full border border-black/10 bg-[#F7F7F8] px-3 py-2 text-black/45 focus-within:border-black/30 lg:max-w-[280px]">
              <Search size={14} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher un rôle…"
                className="w-full bg-transparent text-[12px] text-black outline-none placeholder:text-black/35"
              />
            </label>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filteredRoles.map((role) => {
              const isSelected = selectedRole?.id === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`group overflow-hidden rounded-[20px] border text-left transition ${isSelected ? 'border-black bg-[#111218] text-white shadow-xl' : 'border-black/8 bg-white hover:-translate-y-0.5 hover:border-black/20 hover:shadow-lg'}`}
                >
                  <div className="relative h-32 overflow-hidden bg-black">
                    <img src={role.heroImage} alt="" className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                    <span className="absolute bottom-3 left-3 rounded-full border border-white/25 bg-black/45 px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-wider text-white backdrop-blur-md">
                      {role.categoryLabel}
                    </span>
                  </div>
                  <div className="space-y-2 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-[15px] font-bold leading-tight">{role.title}</h3>
                      <ChevronRight size={15} className={`mt-0.5 shrink-0 transition ${isSelected ? 'text-emerald-300' : 'text-black/25 group-hover:translate-x-0.5'}`} />
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-white/65' : 'text-black/55'}`}>{role.tagline}</p>
                    <div className={`flex items-center gap-2 border-t pt-2 text-[10px] font-mono ${isSelected ? 'border-white/15 text-white/60' : 'border-black/8 text-black/45'}`}>
                      <Clock3 size={12} />
                      <span>Repère par défaut · {role.defaultTime}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedRole && (
            <div className="mt-5 grid gap-5 rounded-[24px] border border-black/8 bg-[#F7F7F8] p-5 sm:grid-cols-[1.1fr_0.9fr] sm:p-6">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-black/40">Fiche rôle · {selectedRole.categoryLabel}</div>
                <h3 className="mt-2 text-[22px] font-bold text-black">{selectedRole.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-black/65">{selectedRole.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedRole.whatCanDo.map((action) => (
                    <span key={action} className="inline-flex items-start gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[10.5px] text-emerald-900">
                      <Check size={12} className="mt-0.5 shrink-0" />
                      {action}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-3 text-[11px]">
                <div className="rounded-[16px] border border-black/8 bg-white p-4">
                  <div className="flex items-center gap-2 font-bold text-black"><ShieldCheck size={15} /> Ce que ce rôle voit</div>
                  <p className="mt-2 leading-relaxed text-black/60">{selectedRole.permissionsVisible}</p>
                </div>
                <div className="rounded-[16px] border border-rose-100 bg-rose-50 p-4">
                  <div className="font-bold text-rose-900">Ce qui reste masqué</div>
                  <p className="mt-2 leading-relaxed text-rose-900/70">{selectedRole.permissionsHidden}</p>
                </div>
              </div>
            </div>
          )}

          {filteredRoles.length === 0 && (
            <p className="mt-6 rounded-[18px] bg-[#F7F7F8] p-6 text-center text-[13px] text-black/50">Aucun rôle ne correspond à cette recherche.</p>
          )}
        </div>
      )}

      {activeTab === 'destinations' && (
        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-3">
          {WORLD_DESTINATIONS.map((destination) => (
            <article key={destination.id} className="overflow-hidden rounded-[22px] border border-black/8 bg-white transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="relative h-40 overflow-hidden bg-black">
                <img src={destination.image} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-3 left-4 text-white">
                  <div className="text-[22px]">{destination.flag}</div>
                  <h3 className="text-[16px] font-bold">{destination.country}</h3>
                  <p className="text-[10px] text-white/70">{destination.region}</p>
                </div>
              </div>
              <div className="space-y-3 p-4">
                <p className="text-[12px] font-semibold leading-relaxed text-black/75">{destination.tagline}</p>
                <div className="flex flex-wrap gap-1.5">
                  {destination.culturalCodes.map((code) => <span key={code} className="rounded-full bg-[#F3F3F4] px-2 py-1 text-[10px] text-black/60">{code}</span>)}
                </div>
                <div className="flex items-center justify-between border-t border-black/8 pt-3 text-[10.5px] text-black/50">
                  <span className="flex items-center gap-1"><MapPin size={12} /> {destination.recommendedAcoustics}</span>
                  <span className="shrink-0 font-mono text-black">{destination.sunsetTiming}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {activeTab === 'connectors' && (
        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-3">
          {ECOSYSTEM_CONNECTORS.map((connector) => (
            <article key={connector.id} className="rounded-[22px] border border-black/8 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-black text-[20px]">{connector.icon}</span>
                  <div>
                    <h3 className="text-[14px] font-bold text-black">{connector.name}</h3>
                    <div className="mt-1 text-[10px] font-mono uppercase tracking-wider text-black/40">{CONNECTOR_LABELS[connector.category]}</div>
                  </div>
                </div>
                <span className={`h-2.5 w-2.5 rounded-full ${connector.connectedStatus ? 'bg-emerald-500' : 'bg-black/20'}`} title={connector.connectedStatus ? 'Connecté' : 'À connecter'} />
              </div>
              <p className="mt-4 text-[12px] leading-relaxed text-black/60">{connector.tagline}</p>
              <ul className="mt-4 space-y-2 border-t border-black/8 pt-4 text-[11px] text-black/65">
                {connector.features.map((feature) => <li key={feature} className="flex gap-2"><Check size={13} className="mt-0.5 shrink-0 text-emerald-600" />{feature}</li>)}
              </ul>
              <div className="mt-4 flex items-center justify-between text-[10px] font-mono">
                <span className={connector.connectedStatus ? 'text-emerald-700' : 'text-black/40'}>{connector.connectedStatus ? 'Connexion disponible' : 'Connexion à configurer'}</span>
                <ArrowRight size={13} className="text-black/35" />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
