import { useLocation, useNavigate } from 'react-router-dom';
import {
  Camera, CalendarDays, ChevronLeft, ChevronRight, Clapperboard, Lightbulb, MapPin,
  MessageCircle, Music2, ScrollText, Sparkles, Users, UtensilsCrossed,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useControlesBande, usePersonaCourante } from '../lib/personaCourant';
import { WEDDING_STYLES } from '../lib/weddingStyles';
import PictoPersonnage from './PictoPersonnage';

/**
 * LA CAPSULE DU BAS — LE DOCK DU RÔLE
 *
 * Le dock ne montre plus les mêmes pictos à tout le monde : il porte **les
 * outils du personnage** — le planning, la setlist, la galerie, les convives…
 * selon le rôle qui défile dans le hero. C'est la démonstration en bas de
 * l'écran : les outils changent avec le rôle, et l'on voit tout de suite ce que
 * chacun a dans les mains.
 *
 * De chaque côté du dock, **les deux flèches de la bande** : elles mènent le
 * rôle suivant ou précédent, exactement comme la bande du hero — et elles
 * n'apparaissent que sur une page qui montre des rôles.
 */

/** Un outil, tel que le dock le montre. */
interface Outil {
  label: string;
  icone: LucideIcon;
  route: string;
}

/** Les mots d'un outil qui disent à quoi il sert : le picto suit. */
const PICTOS: Array<[RegExp, LucideIcon]> = [
  [/playlist|setlist|demande|régie|son\b/i, Music2],
  [/photo|galerie|rush|film/i, Camera],
  [/planning|horaire|date|alerte|agenda/i, CalendarDays],
  [/invité|convive|équipe|part|famille|témoin/i, Users],
  [/menu|gâteau|dessert|service|carte\b/i, UtensilsCrossed],
  [/lieu|scène|piste|bar|stock|installation|trajet|nuit|voyage|livraison/i, MapPin],
  [/contact|texte|discours|message/i, MessageCircle],
  [/lumière|projecteur|éclairage/i, Lightbulb],
  [/contrat|pièce|document|papier/i, ScrollText],
  [/moment|souvenir|cérémonie/i, Clapperboard],
];

/** Le picto d'un outil : il vient de ce qu'il fait, jamais du hasard. */
function iconeOutil(label: string): LucideIcon {
  return PICTOS.find(([motif]) => motif.test(label))?.[1] ?? Sparkles;
}

/** Où mène un outil : la page qui porte le sujet, dans l'univers de la page. */
function routeOutil(label: string, styleId: string, roleId: string): string {
  const t = label.toLowerCase();
  if (/invitation|ma part|souvenir/.test(t)) return '/carte';
  if (/playlist|setlist|demande|régie|son\b/.test(t)) return `/le-mariage/${styleId}#bande-son`;
  if (/photo|galerie|rush|film|moment/.test(t)) return '/magazine';
  if (/contrat|pièce|document|papier/.test(t)) return '/prestataire';
  if (/menu|gâteau|convive|service|carte\b|bar|stock/.test(t)) return `/shop?role=${roleId}`;
  return `/le-mariage/${styleId}`;
}

export default function BottomCapsuleNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const persona = usePersonaCourante();
  const controles = useControlesBande();

  /** L'univers de la page, pour que les outils mènent au bon mariage. */
  const styleId = pathname.match(/^\/le-mariage\/([^/]+)/)?.[1] ?? WEDDING_STYLES[0]!.id;
  const outils: Outil[] = persona.entrees.map((label) => ({
    label,
    icone: iconeOutil(label),
    route: routeOutil(label, styleId, persona.id),
  }));

  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-1rem)] max-w-[min(96vw,980px)] -translate-x-1/2 items-center justify-center gap-2">
      {/* La flèche de gauche, à côté du dock — elle mène la bande du hero. */}
      {controles && (
        <button
          type="button"
          onClick={controles.precedent}
          aria-label="Rôle précédent"
          className="pointer-events-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/12 bg-[#0B0C12]/95 text-white/70 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl transition hover:text-white active:scale-95"
        >
          <ChevronLeft size={17} />
        </button>
      )}

      <div className="no-scrollbar pointer-events-auto flex min-w-0 items-center gap-1 overflow-x-auto rounded-full border border-white/12 bg-[#0B0C12]/95 p-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        {/* Le rôle d'abord : son picto, puis ses outils — c'est lui qui donne
            les pictos du dock, à la place de ceux du site. */}
        <button
          type="button"
          onClick={() => navigate('/creer', { state: { roleId: persona.id } })}
          aria-label={`Entrer comme ${persona.nom}`}
          title={persona.nom}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#0B0C12] shadow-[0_6px_16px_rgba(0,0,0,0.45)] transition hover:scale-105 sm:h-10 sm:w-10"
        >
          <PictoPersonnage picto={persona.picto} size={16} />
        </button>
        <span className="mx-1 h-6 w-px shrink-0 bg-white/15" aria-hidden="true" />

        {/* Les outils du personnage : ses pictos, ses pages. */}
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

      {/* La flèche de droite : le rôle suivant. */}
      {controles && (
        <button
          type="button"
          onClick={controles.suivant}
          aria-label="Rôle suivant"
          className="pointer-events-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/12 bg-[#0B0C12]/95 text-white/70 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl transition hover:text-white active:scale-95"
        >
          <ChevronRight size={17} />
        </button>
      )}
    </div>
  );
}
