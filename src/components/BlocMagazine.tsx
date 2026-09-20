import type { ReactNode } from 'react';

/**
 * LE BLOC — LA BRIQUE D'AIME MAGAZINE
 *
 * Une seule forme pour toute la page : **le bloc**. Il vient de SUPER RIPPLE,
 * où chaque objet se présente ainsi — un cadre arrondi, un surtitre en
 * monospace, un titre, et le contenu dessous. C'est ce qui fait qu'on reconnaît
 * la page sans lire : même respiration, mêmes filets, même hiérarchie.
 *
 * Le bloc ne décide rien : il présente. Tout ce qu'il contient vient d'ailleurs
 * — la collection, l'atelier, l'éditeur.
 *
 * **Deux tons, un seul dessin.**
 *
 * - `clair` — la page du magazine : un carton blanc, un filet noir à 8 %, une
 *   ombre douce. C'est le ton des pages de lecture.
 * - `sombre` — **le ton de SUPER RIPPLE**, au mot près : `rounded-[18px]`,
 *   filet blanc à 10 %, fond blanc à 3 % sur l'encre du site, surtitre en
 *   blanc à 45 %. C'est le ton de l'éditeur, où l'on travaille : le même que
 *   les blocs de la fabrique.
 */

export type TonDuBloc = 'clair' | 'sombre';

const TONS: Record<TonDuBloc, { cadre: string; surtitre: string; resume: string }> = {
  clair: {
    cadre: 'rounded-[22px] border border-black/8 bg-white p-5 shadow-[0_18px_44px_-34px_rgba(0,0,0,0.45)] sm:p-7',
    surtitre: 'text-black/45',
    resume: 'text-black/55',
  },
  sombre: {
    cadre: 'rounded-[18px] border border-white/10 bg-white/[0.03] p-5',
    surtitre: 'text-white/45',
    resume: 'text-white/60',
  },
};

export default function BlocMagazine({
  surtitre,
  titre,
  resume,
  aDroite,
  children,
  className = '',
  ton = 'clair',
}: {
  /** Le surtitre, en petites capitales : « La collection », « L'éditeur ». */
  surtitre: string;
  /** Le titre du bloc. */
  titre: string;
  /** Une phrase, sous le titre, qui dit à quoi sert le bloc. */
  resume?: ReactNode;
  /** Ce qui se range à droite du titre : un compteur, un bouton, une bascule. */
  aDroite?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Le ton du bloc : la lecture (clair), ou la fabrique (sombre, SUPER RIPPLE). */
  ton?: TonDuBloc;
}) {
  const t = TONS[ton];
  const encre = ton === 'sombre' ? 'text-white' : '';

  return (
    <section data-bloc-magazine={surtitre} data-ton={ton} className={`${t.cadre} ${encre} ${className}`}>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-[720px]">
          <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${t.surtitre}`}>{surtitre}</span>
          <h2 className="vp-title mt-1.5 text-[21px] sm:text-[25px]">{titre}</h2>
          {resume && <p className={`mt-2 text-[13.5px] leading-relaxed ${t.resume}`}>{resume}</p>}
        </div>
        {aDroite && <div className="flex flex-wrap items-center gap-2">{aDroite}</div>}
      </header>
      <div className="mt-5">{children}</div>
    </section>
  );
}
