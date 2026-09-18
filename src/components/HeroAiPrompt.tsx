import { useState, useRef, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Briefcase, Search } from 'lucide-react';
import { WEDDING_STYLES, type WeddingStyle } from '../lib/weddingStyles';
import { seedSite } from '../lib/defaults';

interface HeroAiPromptProps {
  onProposalGenerated?: (proposal: any) => void;
  externalMissionCategory?: any;
}

export default function HeroAiPrompt({ onProposalGenerated }: HeroAiPromptProps) {
  const [prompt, setPrompt] = useState('');
  const [isCreatingSite, setIsCreatingSite] = useState(false);

  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Raccourci universel : Cmd+K ou / pour focuser immédiatement le champ de recherche
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorer si l'utilisateur est déjà en train de taper dans un champ de texte
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (e.key === '/') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Recherche sémantique en temps réel
  const searchResults = useMemo(() => {
    const q = prompt.trim().toLowerCase();
    if (!q) return [];

    return WEDDING_STYLES.filter((style) => {
      const matchName = style.name.toLowerCase().includes(q);
      const matchTagline = style.tagline.toLowerCase().includes(q);
      const matchSynopsis = style.synopsis?.toLowerCase().includes(q);
      const matchMissions = style.humanMissions.some(
        (m) =>
          m.role.toLowerCase().includes(q) ||
          m.mission.toLowerCase().includes(q) ||
          m.essentialSkill.toLowerCase().includes(q)
      );
      return matchName || matchTagline || matchSynopsis || matchMissions;
    });
  }, [prompt]);

  // Si l'utilisateur saisit quelque chose d'inédit : génération dynamique à la volée !
  const generatedCustomStyle: WeddingStyle | null = useMemo(() => {
    const q = prompt.trim();
    if (q.length < 3) return null;

    const lower = q.toLowerCase();
    const hasExactMatch = searchResults.some((s) => s.name.toLowerCase() === lower);
    if (hasExactMatch) return null;

    const isVendor =
      lower.includes('dj') ||
      lower.includes('photo') ||
      lower.includes('chef') ||
      lower.includes('traiteur') ||
      lower.includes('fleuriste') ||
      lower.includes('saxo') ||
      lower.includes('light');

    const customName = q.charAt(0).toUpperCase() + q.slice(1);

    return {
      id: `custom-${q.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: customName,
      tagline: isVendor ? `Mission : ${customName}` : 'Création sur-mesure · Rendre l’impossible réel',
      category: 'concept',
      manifesto: `Une célébration inédite inspirée de votre vision : « ${q} ». Tous les prestataires nécessaires s’alignent instantanément pour concrétiser cette envie.`,
      synopsis: `Expérience sur-mesure pour « ${q} ».`,
      ink: '#FFFFFF',
      muted: '#A1A1AA',
      accent: '#10B981',
      dark: true,
      image:
        lower.includes('plage') || lower.includes('mer') || lower.includes('eau')
          ? '/images/phare-vows.jpg'
          : lower.includes('nuit') || lower.includes('club') || lower.includes('electro')
          ? '/images/club-amour.jpg'
          : lower.includes('voyage') || lower.includes('train') || lower.includes('montagne')
          ? '/images/train-vows.jpg'
          : '/images/table-noir.jpg',
      aura: ['#18181B', '#27272A', '#09090B'],
      humanMissions: [
        {
          role: isVendor ? customName : 'Scénographe Dédié',
          mission: `Coordination spécifique pour l’univers : ${q}`,
          essentialSkill: 'Adaptation créative sans limite',
        },
        {
          role: 'Artiste / Performer Associé',
          mission: 'Création d’ambiance sur-mesure adaptée à votre souhait',
          essentialSkill: 'Expérience immersive',
        },
        {
          role: 'Régisseur Général VOWS',
          mission: 'Régie terrain et logistique pour rendre ce rêve réalité',
          essentialSkill: 'Concrétisation impossible',
        },
      ],
      complementaryStyleIds: ['noir-blanc', 'brutal', 'co-mariage'],
      vendorToolkit: {
        title: 'Fiche Mission Sur-Mesure',
        description: `Dossier technique pour le souhait : ${q}`,
        badge: 'Création Immédiate',
      },
    };
  }, [prompt, searchResults]);

  const handleSelectUniverse = (style: WeddingStyle) => {
    onProposalGenerated?.({
      style,
      partner1: 'Les Mariés',
      partner2: '',
      wedding_date: '2028-06-24',
      formattedDate: 'Date à définir',
      venue: 'Lieu de votre choix',
      city: 'Destination',
      toneResponse: style.manifesto || style.synopsis,
      accentColor: style.accent,
      suggestedModules: ['Programme Jour J', 'RSVP interactif', 'Lieux & Plans', 'Galerie'],
      missingFields: { names: false, date: false, venue: false },
    });
  };

  const handleLaunch = async (styleToUse: WeddingStyle) => {
    setIsCreatingSite(true);
    handleSelectUniverse(styleToUse);

    try {
      const { site } = await seedSite({
        partner1: 'Les Mariés',
        partner2: '',
        wedding_date: '2028-06-24',
        venue: 'Lieu à définir',
        city: 'France',
        style: styleToUse.id.startsWith('custom') ? 'noir-blanc' : styleToUse.id,
      });
      navigate(`/generation?site=${site.id}`);
    } catch (e) {
      navigate('/generer');
    } finally {
      setIsCreatingSite(false);
    }
  };

  const hasTyped = prompt.trim().length > 0;
  const allResults = [
    ...searchResults,
    ...(generatedCustomStyle && !searchResults.some((s) => s.id === generatedCustomStyle.id)
      ? [generatedCustomStyle]
      : []),
  ];

  return (
    <div id="hero-ai-container" className="relative mx-auto w-full max-w-2xl px-2 text-left">
      {/* Boîtier de saisie luxueux inspiré Apple visionOS / Studio haut de gamme */}
      <div className="relative group rounded-[26px] bg-[#0C0D12]/92 backdrop-blur-2xl shadow-[0_30px_70px_rgba(0,0,0,0.7)] border border-white/10 transition-all duration-500 hover:border-white/20 p-2 sm:p-2.5">
        {/* Filet spéculaire d'un demi-pixel blanc pur en haut */}
        <div className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        {/* Champ de recherche / intention universel */}
        <div className="flex items-center gap-2.5 px-4 py-2">
          <input
            ref={inputRef}
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Décrivez votre mariage rêvé ou votre mission (lieu, ambiance, métier)…"
            className="w-full bg-transparent py-1.5 text-[14.5px] font-normal text-white placeholder:text-white/40 focus:outline-none"
          />

          {/* Raccourci clavier visuel discret quand le champ est vide */}
          {!hasTyped && (
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-white/30 bg-white/5 border border-white/10 rounded-md px-2 py-0.5 shrink-0 pointer-events-none">
              <span>⌘K</span>
            </div>
          )}

          {hasTyped && (
            <button
              type="button"
              onClick={() => setPrompt('')}
              className="text-white/40 hover:text-white p-1 text-[11px] shrink-0"
            >
              Effacer
            </button>
          )}
        </div>

        {/* RÉSULTATS IMMÉDIATS DANS LE MÊME CHAMP : Cartes univers & missions trouvées ou générées */}
        <AnimatePresence>
          {hasTyped && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-white/10 pt-2.5 mt-1 space-y-2 px-2 pb-2"
            >
              <div className="text-[11px] font-bold uppercase tracking-wider text-white/40 px-2 flex items-center justify-between">
                <span>
                  {allResults.length > 0
                    ? `${allResults.length} univers & missions en correspondance`
                    : 'Génération de votre univers sur-mesure'}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">
                  Cliquez une carte pour l'adopter
                </span>
              </div>

              {/* Défilement horizontal des petites cartes compactes */}
              <div className="no-scrollbar flex gap-2.5 overflow-x-auto pb-1.5 pt-0.5">
                {allResults.map((style) => {
                  const isCustomGenerated = style.id.startsWith('custom-');

                  return (
                    <div
                      key={style.id}
                      onClick={() => handleSelectUniverse(style)}
                      className={`cursor-pointer group relative w-[240px] sm:w-[260px] shrink-0 overflow-hidden rounded-[20px] p-2.5 transition-all duration-300 text-left ${
                        isCustomGenerated
                          ? 'bg-emerald-950/40 border border-emerald-500/40 hover:bg-emerald-900/50'
                          : 'bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/25'
                      }`}
                    >
                      {/* Vignette photographique */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[14px]">
                        <img
                          src={style.image}
                          alt={style.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          <span
                            className="h-2 w-2 rounded-full shadow-sm"
                            style={{ background: style.accent }}
                          />
                          {isCustomGenerated && (
                            <span className="rounded-full bg-emerald-400 px-2 py-0.5 text-[8.5px] font-bold text-black uppercase tracking-wider">
                              Inédit Généré
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-2 left-2 right-2 text-white">
                          <div className="text-[14px] font-bold leading-tight truncate">
                            {style.name}
                          </div>
                          <div className="text-[10px] text-white/70 truncate">
                            {style.tagline}
                          </div>
                        </div>
                      </div>

                      {/* Missions mobilisées dans cette carte */}
                      <div className="mt-2 px-1 space-y-1">
                        <div className="text-[10px] text-white/50 flex items-center gap-1 font-medium truncate">
                          <Briefcase size={10} className="shrink-0 text-white/40" />
                          <span>
                            {style.humanMissions
                              .slice(0, 2)
                              .map((m) => m.role.split('/')[0].trim())
                              .join(' · ')}
                          </span>
                        </div>

                        <div className="pt-1 flex items-center justify-between">
                          <span className="text-[9.5px] text-emerald-400 font-semibold">
                            {style.vendorToolkit.badge}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLaunch(style);
                            }}
                            className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10.5px] font-bold text-black hover:bg-neutral-200 transition shadow-sm"
                          >
                            <span>Lancer</span>
                            <ArrowRight size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
