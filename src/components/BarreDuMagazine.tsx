import { useEffect, useRef } from 'react';
import { ArrowUpRight, Layers } from 'lucide-react';
import type { BandeDuMagazine } from '../lib/bandeDuMagazine';
import { basculerTimeline } from '../lib/capsuleCommande';

/**
 * LA BARRE DU MAGAZINE — LES VISUELS ET LA TIMELINE, TOUJOURS EN BAS
 *
 * Deux rangées, et c'est tout ce qu'il faut pour ne jamais quitter le visuel :
 *
 * ```
 * ┌───────────────────────────────────────────────┐
 * │ N°01 … N°38 … N°54      la règle des 54 semaines│  ← la timeline
 * ├───────────────────────────────────────────────┤
 * │ [cover][01][02][03][04][05][06][07]   les visuels│  ← les images
 * └───────────────────────────────────────────────┘
 * ```
 *
 * - **La règle** est la même idée que l'atelier, en miniature : un cran par
 *   magazine, le magazine ouvert allumé, et l'on glisse le long de l'année. À
 *   droite, **l'atelier** s'ouvre en grand (la timeline complète, avec ses
 *   blocs et sa tête de lecture).
 * - **Les visuels** sont la couverture de la semaine et ses **sept chapitres** :
 *   une vignette par chapitre, l'actif entouré. On touche, on y est — un jour
 *   du calendrier, dans le chapitre voulu.
 *
 * La barre ne décide rien : elle affiche la bande que la page publie, et lui
 * rend ses gestes. C'est ce qui fait qu'elle marche aussi bien sur la couverture
 * que dans les blocs, en bas de page, sans jamais se répéter.
 */

/** L'écart entre deux crans de la règle : la largeur d'un cran sur la bande. */
const LARGEUR_DU_CRAN = 44;

export default function BarreDuMagazine({ bande }: { bande: BandeDuMagazine }) {
  const regle = useRef<HTMLDivElement>(null);
  const semaineActive = useRef<HTMLButtonElement>(null);

  /** La règle suit le magazine ouvert : son cran reste au centre. */
  useEffect(() => {
    semaineActive.current?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [bande.semaine]);

  return (
    <div
      data-bande-du-magazine="true"
      className="pointer-events-auto w-full max-w-[min(96vw,980px)] overflow-hidden rounded-[26px] border border-white/12 bg-[#0B0C12]/92 shadow-[0_24px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
    >
      {/* ————— LA TIMELINE : LES 54 SEMAINES, EN UNE RÈGLE ————— */}
      <div className="flex items-center gap-2 border-b border-white/8 px-2.5 py-2">
        <span className="hidden shrink-0 pl-1 font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/40 sm:block">
          54 semaines
        </span>
        <div
          ref={regle}
          className="no-scrollbar min-w-0 flex-1 overflow-x-auto"
          data-regle-de-lannee="true"
          aria-label="La règle de l’année — 54 semaines"
        >
          <div className="flex items-stretch gap-0.5" style={{ minWidth: bande.semaines.length * (LARGEUR_DU_CRAN - 20) }}>
            {bande.semaines.map((s) => {
              const active = s.numero === bande.semaine;
              return (
                <button
                  key={s.numero}
                  ref={active ? semaineActive : undefined}
                  type="button"
                  data-semaine={s.numero}
                  data-actif={active ? 'true' : 'false'}
                  onClick={() => bande.ouvrirSemaine(s.numero)}
                  aria-label={`Semaine ${String(s.numero).padStart(2, '0')} — ${s.titre}`}
                  aria-pressed={active}
                  className="group flex shrink-0 flex-col items-center gap-1"
                  style={{ width: `${LARGEUR_DU_CRAN - 20}px` }}
                  title={`${String(s.numero).padStart(2, '0')} · ${s.titre}`}
                >
                  <span
                    className={`font-mono text-[9px] tabular-nums transition ${
                      active ? 'font-bold text-white' : 'text-white/35 group-hover:text-white/70'
                    }`}
                  >
                    {String(s.numero).padStart(2, '0')}
                  </span>
                  <span
                    className={`block w-full rounded-full transition-all ${
                      active ? 'h-[3px] bg-[#00FF88]' : 'h-[2px] bg-white/15 group-hover:bg-white/40'
                    }`}
                  />
                  {/* La couverture, en tout petit : la couleur du magazine. */}
                  {s.url ? (
                    <img src={s.url} alt="" loading="lazy" className={`h-4 w-3 rounded-[3px] object-cover transition ${active ? 'opacity-100' : 'opacity-45 group-hover:opacity-80'}`} />
                  ) : (
                    <span className={`h-4 w-3 rounded-[3px] transition ${active ? 'opacity-100' : 'opacity-45'}`} style={{ background: 'rgba(255,255,255,0.14)' }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <button
          type="button"
          onClick={() => basculerTimeline(true)}
          aria-label="Ouvrir l’atelier du temps"
          title="L’atelier du temps — la timeline en grand"
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/12 px-2.5 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/60 transition hover:border-white/40 hover:text-white"
        >
          <Layers size={12} />
          <span className="hidden sm:inline">L’atelier</span>
        </button>
      </div>

      {/* ————— LES VISUELS : LA COUVERTURE, ET LES SEPT CHAPITRES ————— */}
      <div
        className="no-scrollbar flex items-end gap-2 overflow-x-auto px-3 py-2.5"
        data-visuels-de-la-bande="true"
        aria-label={`Les visuels du ${bande.magazine}`}
      >
        {bande.visuels.map((v) => (
          <button
            key={v.chapitre}
            type="button"
            data-visuel={v.chapitre}
            data-actif={v.actif ? 'true' : 'false'}
            onClick={() => bande.ouvrirVisuel(v.chapitre)}
            aria-label={v.chapitre === 0 ? `La couverture — ${bande.titreDuMagazine}` : `Chapitre ${String(v.chapitre).padStart(2, '0')} — ${v.label}`}
            aria-pressed={v.actif}
            className={`group relative shrink-0 overflow-hidden rounded-[10px] border transition-all duration-300 ${
              v.actif ? 'h-[68px] w-[48px] border-white/80 shadow-[0_10px_24px_rgba(0,0,0,0.5)]' : 'h-[58px] w-[41px] border-white/12 hover:border-white/45'
            }`}
            style={{ background: v.fond }}
          >
            {v.url ? (
              <img src={v.url} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <span
                aria-hidden="true"
                className="absolute inset-0"
                style={{ background: `linear-gradient(160deg, ${v.fond} 0%, rgba(0,0,0,0.55) 100%)` }}
              />
            )}
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-1 pb-1 pt-3 text-center font-mono text-[8.5px] uppercase tracking-[0.08em] text-white/90">
              {v.chapitre === 0 ? 'Couverture' : String(v.chapitre).padStart(2, '0')}
            </span>
            {v.actif && <span className="absolute inset-x-1 top-1 h-[2px] rounded-full bg-[#00FF88]" />}
          </button>
        ))}

        {/* Ce qu'on regarde, écrit à droite des vignettes. */}
        <span className="mb-1 ml-1 hidden shrink-0 font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/45 lg:flex lg:flex-col">
          <span className="text-white/70">{bande.magazine}</span>
          <span>{bande.jour}</span>
        </span>
        <span className="mb-1 ml-auto hidden shrink-0 items-center gap-1 pr-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/35 xl:flex">
          Glisser pour parcourir l’année <ArrowUpRight size={11} />
        </span>
      </div>
    </div>
  );
}
