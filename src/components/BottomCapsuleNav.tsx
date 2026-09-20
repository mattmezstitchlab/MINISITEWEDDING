import { useLocation, useNavigate } from 'react-router-dom';
import {
  CalendarRange, ChevronLeft, ChevronRight, Sun, SunDim, SunMedium, Sunrise, Sunset, Wand2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useControlesBande } from '../lib/personaCourant';
import {
  basculerTimeline, choisirMoment, MOMENTS_DE_LA_CAPSULE, useMomentDeLaCapsule,
  useTimelineOuverte,
} from '../lib/capsuleCommande';

/**
 * LA CAPSULE DE COMMANDE — LE DOCK DU BAS
 *
 * Le dock n'est plus un porte-outils de rôle : c'est **la télécommande du
 * magazine**. De gauche à droite :
 *
 * - **les flèches** — elles feuillettent ce que la page montre (la bande du
 *   hero, ou les jours du magazine) ;
 * - **le bouton blanc** — créer sa carte, l'entrée stable ;
 * - **les cinq moments** — l'aube, le matin, le midi, l'après-midi, le soir :
 *   la couverture du hero s'éclaire au moment choisi ;
 * - **la timeline** — la languette sort en bas, et l'année se déplie en
 *   couvertures, des saisons aux jours.
 *
 * La capsule de droite, elle, reste la nav verticale de la page — rien ne
 * change.
 */

const PICTOS_DES_MOMENTS: Record<string, LucideIcon> = {
  aube: Sunrise,
  matin: SunMedium,
  midi: Sun,
  'apres-midi': SunDim,
  soir: Sunset,
};

const NOMS_DES_MOMENTS: Record<string, string> = {
  aube: 'l’aube',
  matin: 'le matin',
  midi: 'le midi',
  'apres-midi': 'l’après-midi',
  soir: 'le soir',
};

export default function BottomCapsuleNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const controles = useControlesBande();
  const moment = useMomentDeLaCapsule();
  const timeline = useTimelineOuverte();

  /** Un moment : la couverture s'y éclaire ; hors du magazine, on y va. */
  const prendreMoment = (id: string) => {
    choisirMoment(moment === id ? null : id);
    if (!pathname.startsWith('/magazine')) navigate(`/magazine?moment=${id}`);
  };

  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-1rem)] max-w-[min(96vw,980px)] -translate-x-1/2 items-center justify-center gap-2">
      {/* La flèche de gauche : elle mène ce que la page montre. */}
      {controles && (
        <button
          type="button"
          onClick={controles.precedent}
          aria-label="Précédent"
          className="pointer-events-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/12 bg-[#0B0C12]/95 text-white/70 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl transition hover:text-white active:scale-95"
        >
          <ChevronLeft size={17} />
        </button>
      )}

      <div className="no-scrollbar pointer-events-auto flex min-w-0 items-center gap-1 overflow-x-auto rounded-full border border-white/12 bg-[#0B0C12]/95 p-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        {/* L'entrée stable : créer sa carte. */}
        <button
          type="button"
          onClick={() => navigate('/creer')}
          aria-label="Créer sa carte"
          title="Créer sa carte"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#0B0C12] shadow-[0_6px_16px_rgba(0,0,0,0.45)] transition hover:scale-105 sm:h-10 sm:w-10"
        >
          <Wand2 size={16} />
        </button>
        <span className="mx-1 h-6 w-px shrink-0 bg-white/15" aria-hidden="true" />

        {/* Les cinq moments : la couverture s'éclaire au moment choisi. */}
        {MOMENTS_DE_LA_CAPSULE.map((id) => {
          const Icone = PICTOS_DES_MOMENTS[id]!;
          const actif = moment === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => prendreMoment(id)}
              aria-label={`Le moment — ${NOMS_DES_MOMENTS[id]}`}
              aria-pressed={actif}
              title={NOMS_DES_MOMENTS[id]}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition sm:h-10 sm:w-10 ${
                actif ? 'bg-white text-[#0B0C12]' : 'text-white/65 hover:bg-white/12 hover:text-white'
              }`}
            >
              <Icone size={16} />
            </button>
          );
        })}
        <span className="mx-1 h-6 w-px shrink-0 bg-white/15" aria-hidden="true" />

        {/* La timeline : la languette sort, l'année se déplie. */}
        <button
          type="button"
          onClick={() => basculerTimeline()}
          aria-label="La timeline — déplier l'année"
          aria-pressed={timeline}
          title="La timeline"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition sm:h-10 sm:w-10 ${
            timeline ? 'bg-white text-[#0B0C12]' : 'text-white/65 hover:bg-white/12 hover:text-white'
          }`}
        >
          <CalendarRange size={16} />
        </button>
      </div>

      {/* La flèche de droite. */}
      {controles && (
        <button
          type="button"
          onClick={controles.suivant}
          aria-label="Suivant"
          className="pointer-events-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/12 bg-[#0B0C12]/95 text-white/70 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl transition hover:text-white active:scale-95"
        >
          <ChevronRight size={17} />
        </button>
      )}
    </div>
  );
}
