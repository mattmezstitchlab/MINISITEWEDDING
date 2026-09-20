import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { JourDuMagazine } from '../lib/jourDuMagazine';
import PortraitStudio from './PortraitStudio';

/**
 * LE FLUX DES JOURS — ON GLISSE D'UN JOUR À L'AUTRE
 *
 * Le hero du magazine est **un flux** : chaque écran est un jour, avec sa
 * couverture, son prénom, sa carte et sa météo. On passe au suivant **comme on
 * fait défiler** — au doigt, à la molette, ou avec les flèches.
 *
 * **Dans les deux sens, et dans les deux formats** : sur un téléphone tenu à la
 * verticale, le flux descend (le geste naturel) ; dès que l'écran est large — ou
 * tenu à l'horizontale — le flux va de gauche à droite. C'est le même flux, la
 * même page, et ça se décide en CSS (`snap-y` puis `md:snap-x`), sans rien
 * casser au clavier.
 *
 * Le composant ne devine rien : il reçoit les jours et dit lequel est ouvert.
 */
export default function FluxDuJour({
  jours,
  index,
  onIndex,
  onOuvrir,
  titreDuJour,
}: {
  jours: JourDuMagazine[];
  index: number;
  onIndex: (i: number) => void;
  /** Cliquer la couverture : on ouvre le magazine du jour, à l'heure qu'il est. */
  onOuvrir: (jour: JourDuMagazine) => void;
  /** Ce qui s'écrit en haut de chaque écran : le jour, la carte, la semaine. */
  titreDuJour: (j: JourDuMagazine) => string;
}) {
  const pistes = useRef<Array<HTMLElement | null>>([]);
  const piste = useRef<HTMLDivElement | null>(null);

  /** On amène le jour ouvert au centre — au doigt comme aux flèches. */
  useEffect(() => {
    pistes.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }, [index]);

  /** Le clavier : ← et → d'un côté, ↑ et ↓ de l'autre. */
  const clavier = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      onIndex(Math.min(index + 1, jours.length - 1));
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      onIndex(Math.max(index - 1, 0));
    }
  };

  return (
    <div className="relative w-full">
      <div
        ref={piste}
        role="list"
        aria-label="Le flux des jours"
        tabIndex={0}
        onKeyDown={clavier}
        className="no-scrollbar flex h-[62svh] w-full snap-y snap-mandatory flex-col overflow-y-auto overscroll-y-contain outline-none md:h-[420px] md:snap-x md:flex-row md:overflow-y-hidden md:overflow-x-auto"
        onScroll={(e) => {
          const el = e.currentTarget;
          const horizontal = el.scrollWidth > el.clientWidth + 8;
          const taille = horizontal ? el.clientWidth : el.clientHeight;
          const i = Math.round((horizontal ? el.scrollLeft : el.scrollTop) / taille);
          if (i !== index && i >= 0 && i < jours.length) onIndex(i);
        }}
      >
        {jours.map((jour, i) => (
          <section
            key={jour.date.toISOString()}
            ref={(el) => {
              pistes.current[i] = el;
            }}
            role="listitem"
            aria-label={`${jour.nom} — le jour ${jour.ordinal}`}
            data-jour={jour.ordinal}
            data-ouvert={i === index ? 'true' : 'false'}
            className="flex h-full w-full shrink-0 snap-start snap-always items-center justify-center px-4 md:w-[360px] md:px-3"
          >
            <div className="flex w-full max-w-[320px] flex-col items-center gap-3">
              <p className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
                {titreDuJour(jour)}
              </p>
              <button
                type="button"
                onClick={() => onOuvrir(jour)}
                aria-label={`Ouvrir le magazine du jour — ${jour.nom}`}
                className="rounded-[20px] transition hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <PortraitStudio
                  nom={jour.nom}
                  date={jour.date}
                  studio={jour.studio}
                  saison={jour.saison}
                />
              </button>
              <p className="text-center text-[12px] leading-relaxed text-white/75">
                {jour.meteo.resume}
                {jour.cles.signeCache ? ` · ${jour.cles.signeCache.nom}` : ''}
              </p>
            </div>
          </section>
        ))}
      </div>

      {/* Les deux flèches du flux : elles sont là où le geste n'arrive pas. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between md:flex">
        <button
          type="button"
          onClick={() => onIndex(Math.max(index - 1, 0))}
          aria-label="Le jour d’avant"
          className="pointer-events-auto ml-2 rounded-full bg-white/12 p-2.5 text-white backdrop-blur transition hover:bg-white/25 disabled:opacity-30"
          disabled={index === 0}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => onIndex(Math.min(index + 1, jours.length - 1))}
          aria-label="Le jour d’après"
          className="pointer-events-auto mr-2 rounded-full bg-white/12 p-2.5 text-white backdrop-blur transition hover:bg-white/25 disabled:opacity-30"
          disabled={index === jours.length - 1}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
        glisser · molette · ← → · jour {index + 1} sur {jours.length} · cliquer la couverture ouvre les 24 heures
      </p>
    </div>
  );
}
