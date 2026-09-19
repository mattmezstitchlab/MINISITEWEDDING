import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CalendarDays, Camera, Clapperboard, Heart, Home, Layers, Lightbulb, MapPin, MessageCircle,
  Music2, ScrollText, Smartphone, Sparkles, Truck, Users, UtensilsCrossed,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { usePersonaCourante } from '../lib/personaCourant';
import { WEDDING_STYLES } from '../lib/weddingStyles';

/**
 * LA CAPSULE DU BAS — le dock du site
 *
 * Toujours là, toujours la même, sur toutes les grandes pages : l'accueil, la
 * carte, les prestataires, « zéro contrainte », la playlist. Sur l'accueil, un
 * clic fait défiler jusqu'à la section et celle qui est à l'écran s'allume ;
 * ailleurs — page d'un univers, page d'un métier, magazine, shop — le même clic
 * mène à la page qui porte la section.
 *
 * Et depuis « qui êtes-vous dans ce mariage ? », **le dock porte les outils du
 * personnage** : le planning, la setlist, la galerie… selon le rôle qui défile
 * dans le hero. La capsule défile donc, et ses outils changent avec le rôle —
 * on voit le site s'accorder à celui qui l'ouvre.
 */

interface Step {
  id: string;
  label: string;
  short: string;
  icon: LucideIcon;
  /** Où aller quand la section n'est pas sur la page courante. */
  route: string;
  /** Un morceau d'URL à rejoindre sur la route (l'ancre de l'accueil). */
  hash?: string;
  /** Le préfixe d'URL qui allume cette étape ailleurs que sur l'accueil. */
  actifSur: string[];
}

const STEPS: Step[] = [
  {
    id: 'hero',
    label: 'Le visuel plein écran et la création de l’espace',
    short: 'Accueil',
    icon: Home,
    route: '/',
    actifSur: [],
  },
  {
    id: 'ecran',
    label: 'La carte, avant le mini-site',
    short: 'La carte',
    icon: Smartphone,
    route: '/carte',
    hash: 'ecran',
    actifSur: ['/carte'],
  },
  {
    id: 'univers',
    label: 'Prestataires & univers complémentaires',
    short: 'Prestataires',
    icon: Layers,
    route: '/',
    hash: 'univers',
    actifSur: ['/prestataire', '/metiers'],
  },
  {
    id: 'contrainte',
    label: 'Le plus beau jour se vit',
    short: 'Zéro contrainte',
    icon: Heart,
    route: '/',
    hash: 'contrainte',
    actifSur: [],
  },
  {
    id: 'bande-son',
    label: 'La playlist du Jour J',
    short: 'Playlist',
    icon: Music2,
    route: '/le-mariage',
    hash: 'bande-son',
    actifSur: ['/le-mariage', '/supermarriage'],
  },
];

/** L'outil d'un rôle, tel que le dock le montre. */
interface Outil {
  label: string;
  icone: LucideIcon;
  route: string;
}

/** Les mots d'un outil qui disent à quoi il sert : le picto suit. */
const PICTOS: Array<[RegExp, LucideIcon]> = [
  [/playlist|setlist|demande|régie|son/i, Music2],
  [/photo|galerie|rush|film/i, Camera],
  [/planning|horaire|date|alerte|agenda/i, CalendarDays],
  [/invité|convive|équipe|part|famille|témoin/i, Users],
  [/menu|gâteau|dessert|service|carte/i, UtensilsCrossed],
  [/lieu|scène|piste|bar|stock|installation|trajet|nuit|voyage|transfert|livraison/i, MapPin],
  [/contact|discours|texte|message/i, MessageCircle],
  [/lumière|plan lumière/i, Lightbulb],
  [/contrat|pièce|document/i, ScrollText],
  [/souvenir|moment|cérémonie/i, Sparkles],
  [/rush|film|vidéo/i, Clapperboard],
  [/trajet|voyage|nuit|transfert/i, Truck],
];

function iconeOutil(label: string): LucideIcon {
  return PICTOS.find(([motif]) => motif.test(label))?.[1] ?? Sparkles;
}

/** Où mène un outil : la page qui porte le sujet, dans l'univers de la page. */
function routeOutil(label: string, styleId: string): string {
  const t = label.toLowerCase();
  if (/invitation|ma part/.test(t)) return '/carte';
  if (/playlist|setlist|demande|régie|son/.test(t)) return `/le-mariage/${styleId}#bande-son`;
  if (/photo|galerie|rush|film/.test(t)) return '/magazine';
  if (/contact|contrat|pièce|document/.test(t)) return '/prestataire';
  return `/le-mariage/${styleId}`;
}

export default function BottomCapsuleNav() {
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();
  const surAccueil = pathname === '/';
  const persona = usePersonaCourante();
  /** Sur l'accueil, l'étape allumée suit le défilement. */
  const [sectionVisible, setSectionVisible] = useState('hero');

  /** Sur l'accueil, l'étape allumée est celle qui traverse l'écran. */
  useEffect(() => {
    if (!surAccueil) return;
    const onScroll = () => {
      const probe = window.scrollY + window.innerHeight * 0.45;
      let current = STEPS[0].id;
      for (const step of STEPS) {
        const el = document.getElementById(step.id);
        if (el && el.offsetTop <= probe) current = step.id;
      }
      setSectionVisible(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [surAccueil]);

  /** L'étape allumée : la section traversée sur l'accueil, la page ailleurs. */
  const activeId = surAccueil
    ? sectionVisible
    : STEPS.find((step) => step.actifSur.some((prefixe) => pathname.startsWith(prefixe)))?.id ?? '';

  /** Une ancre demandée par le dock : on la rejoint dès qu'elle est montée. */
  useEffect(() => {
    if (!hash) return;
    const cible = hash.replace('#', '');
    const el = document.getElementById(cible);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash, pathname]);

  const goTo = (step: Step) => {
    const el = document.getElementById(step.id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    navigate(step.hash ? `${step.route}#${step.hash}` : step.route);
  };

  /** L'univers de la page, pour que les outils mènent au bon mariage. */
  const styleId = pathname.match(/^\/le-mariage\/([^/]+)/)?.[1] ?? WEDDING_STYLES[0]!.id;
  const outils: Outil[] = persona.entrees.map((label) => ({
    label,
    icone: iconeOutil(label),
    route: routeOutil(label, styleId),
  }));

  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-40 w-[calc(100%-1rem)] max-w-[min(96vw,880px)] -translate-x-1/2">
      <div className="no-scrollbar pointer-events-auto mx-auto flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-full border border-white/12 bg-[#0B0C12]/95 p-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isActive = activeId === step.id;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => goTo(step)}
              aria-label={step.label}
              aria-current={isActive ? 'page' : undefined}
              className={`group relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all sm:h-10 sm:w-10 ${
                isActive
                  ? 'scale-105 bg-white text-[#0B0C12] shadow-[0_6px_16px_rgba(0,0,0,0.45)]'
                  : 'text-white/60 hover:bg-white/12 hover:text-white'
              }`}
            >
              <Icon size={16} />

              {/* Le nom, au survol */}
              <span className="pointer-events-none absolute bottom-12 whitespace-nowrap rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0B0C12] opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                {step.short}
              </span>
            </button>
          );
        })}

        {/* — les outils du personnage : ils changent avec le rôle — */}
        <span className="mx-1 h-6 w-px shrink-0 bg-white/15" aria-hidden="true" />
        <span className="hidden shrink-0 pl-1 pr-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/40 sm:inline">
          Outils · {persona.nom}
        </span>
        {outils.map((outil) => {
          const Icon = outil.icone;
          return (
            <button
              key={`${persona.id}-${outil.label}`}
              type="button"
              onClick={() => navigate(outil.route)}
              aria-label={`${outil.label} — les outils de ${persona.nom}`}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/12 px-2.5 py-1.5 text-[11px] font-semibold text-white/70 transition hover:border-white/40 hover:bg-white/12 hover:text-white"
            >
              <Icon size={13} />
              {outil.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
