import { useLocation, useNavigate } from 'react-router-dom';
import CadranDuMagazine from './CadranDuMagazine';
import {
  ChevronLeft, ChevronRight, Sun, SunDim, SunMedium, Sunrise, Sunset, Wand2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useControlesBande } from '../lib/personaCourant';
import {
  basculerTimeline, choisirMoment, MOMENTS_DE_LA_CAPSULE, useMomentDeLaCapsule,
  useReperesDeLaCapsule, useTimelineOuverte, useTempsDeLaCapsule,
} from '../lib/capsuleCommande';
import { chapitreDeLaDate, magazineDeLaDate } from '../lib/semaines';

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
 * **Et elle porte le cadran du magazine.** Au centre du dock, une miniature du
 * même cadran que la couverture : ses aiguilles montrent **l'heure qu'on
 * regarde** et **le chapitre où l'on est**. Un clic sur un moment pose
 * l'aiguille ; un clic sur le cadran ouvre **l'atelier du temps** (la timeline).
 * Le dock et la couverture ne disent donc jamais deux choses différentes.
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
  /** Le temps que la capsule commande, et les repères de la page ouverte. */
  const temps = useTempsDeLaCapsule();
  const reperes = useReperesDeLaCapsule();
  const ici = magazineDeLaDate(new Date());
  const chapitreCourant = reperes?.numeroDeChapitre ?? chapitreDeLaDate(new Date()).numero;
  const legendeDock = reperes ? `${reperes.magazine} · ch. ${String(chapitreCourant).padStart(2, '0')}` : ici.etiquette;

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
          onClick={() => navigate('/ripple')}
          aria-label="Le Point Zéro"
          title="Le point zéro : créer l'objet unique"
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

        {/* LE CADRAN DE LA CAPSULE : le même que la couverture, en miniature.
            Ses aiguilles suivent le moment choisi et le chapitre ouvert ; un clic
            ouvre l'atelier du temps (la timeline). */}
        <button
          type="button"
          onClick={() => basculerTimeline()}
          aria-label="L’atelier du temps — la timeline"
          aria-pressed={timeline}
          title={`${legendeDock} · ${temps.etiquette} — ouvrir l’atelier du temps`}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition sm:h-10 sm:w-10 ${
            timeline ? 'bg-white text-[#0B0C12]' : 'text-white/70 hover:bg-white/12 hover:text-white'
          }`}
        >
          <CadranDuMagazine
            heure={temps.heure}
            chapitre={chapitreCourant}
            fond="#0B0C12"
            encre="#F3F1ED"
            accent={timeline ? '#0B0C12' : '#00FF88'}
            vignette
            className="h-7 w-7 sm:h-8 sm:w-8"
          />
        </button>

        {/* Ce que la capsule commande, écrit : le magazine, le chapitre, l'heure. */}
        <span
          data-capsule-lecture="true"
          className="hidden shrink-0 items-center gap-1.5 pl-1 pr-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55 lg:flex"
        >
          {legendeDock} · {temps.etiquette}
        </span>
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
