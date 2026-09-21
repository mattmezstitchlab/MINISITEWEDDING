import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import TimelineTheaterStudio from './TimelineTheaterStudio';
import type { TimelineTrackItem } from '../lib/timelineTheaterEngine';
import { basculerTimeline, useTimelineOuverte } from '../lib/capsuleCommande';
import {
  adresseDuMagazine,
  blocsDeLaCollection,
  graduationsDeLaCollection,
  teteSurLaSemaineCourante,
} from '../lib/timelineDeLaCollection';
import { MAGAZINES } from '../lib/semaines';
import { VISUELS_LIVRES } from '../lib/bibliothequeMagazine';

/**
 * L'ATELIER DU TEMPS — LA TIMELINE, SOUS LE DOCK
 *
 * Le dock du bas a un bouton : il ouvre **l'atelier timeline**, celui du site —
 * la règle, les blocs qu'on déplace, l'inspecteur, la tête de lecture. Ce n'est
 * pas une frise décorative : c'est le même moteur que celui du jour J, avec une
 * autre source.
 *
 * Deux lectures, un seul atelier :
 *
 * - **L'année** — les 54 magazines de la collection, un bloc par semaine, ses
 *   sept chapitres dessous, et la tête de lecture posée sur la semaine où l'on
 *   est. Un clic sur un bloc **ouvre le magazine** (le jour de son lundi).
 * - **Le jour J** — les moments du mariage, heure par heure, tels quels : c'est
 *   l'atelier d'origine, avec ses modes, son audio, ses documents.
 *
 * Une seule timeline sur le site : celle-ci. La petite frise de saisons qui
 * vivait au même endroit est retirée — elle répétait ce que la collection et le
 * cadran disent mieux.
 */

type Source = 'annee' | 'jour-j';

export default function LanguetteTimeline() {
  const ouverte = useTimelineOuverte();
  const navigate = useNavigate();
  const annee = new Date().getFullYear();
  const [source, setSource] = useState<Source>('annee');

  const blocs = useMemo(() => blocsDeLaCollection(annee), [annee]);
  const graduations = useMemo(() => graduationsDeLaCollection(annee), [annee]);
  const tete = useMemo(() => teteSurLaSemaineCourante(), []);

  if (!ouverte) return null;

  /** Cliquer un magazine dans l'atelier : on l'ouvre. */
  const ouvrir = (item: TimelineTrackItem) => {
    const numero = Number(item.id.replace('magazine-', ''));
    if (!Number.isFinite(numero) || numero < 1) return;
    basculerTimeline(false);
    navigate(adresseDuMagazine(numero, annee));
  };

  return (
    <div
      data-atelier="ouverte"
      className="fixed inset-x-0 bottom-0 z-50 max-h-[86svh] overflow-y-auto border-t border-black/10 bg-white/98 shadow-[0_-30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl"
    >
      <div className="vp-page py-6">
        <div className="flex flex-wrap items-end justify-between gap-4 pb-5">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45">
              L’atelier du temps · {MAGAZINES.length} magazines · {MAGAZINES.length * 7} chapitres
            </span>
            <h2 className="vp-title mt-1.5 text-[22px] sm:text-[26px]">La timeline</h2>
            <p className="mt-1.5 max-w-[720px] text-[13px] leading-relaxed text-black/55">
              Une bande, des blocs, une tête de lecture — le moteur temporel du site. Ici, l’année :
              chaque bloc est un magazine, ses sept chapitres sont dessous, et la tête est posée sur la
              semaine où vous êtes. {VISUELS_LIVRES} visuels livrés à ce jour ; un magazine sans
              couverture garde son bloc — le dessin tient la place.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Deux sources, un seul atelier. */}
            <div className="flex items-center gap-1 rounded-full border border-black/10 bg-neutral-100/90 p-1">
              {([['annee', 'L’année'], ['jour-j', 'Le jour J']] as const).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSource(id)}
                  aria-pressed={source === id}
                  className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition ${
                    source === id ? 'bg-white text-black shadow-sm' : 'text-black/55 hover:text-black'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => basculerTimeline(false)}
              aria-label="Refermer la timeline"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/12 text-black/60 transition hover:border-black/40 hover:text-black"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {source === 'annee' ? (
          <TimelineTheaterStudio
            items={blocs}
            graduations={graduations}
            titreDeLAxe={`L’année en ${MAGAZINES.length} magazines — un bloc par semaine`}
            zoomInitial={2.5}
            teteInitiale={tete}
            onSelectMoment={ouvrir}
          />
        ) : (
          <TimelineTheaterStudio />
        )}
      </div>
    </div>
  );
}
