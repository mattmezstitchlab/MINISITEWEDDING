import { useEffect, useRef, useState } from 'react';
import { tailleVoulue } from '../lib/echelleDeLaMosaique';

/**
 * LA MOSAÏQUE DU TEMPS — LA TIMELINE, REFaITE DE FOND EN COMBLE
 *
 * C'est **la seule surface de navigation** du magazine. Une immense bande
 * horizontale, pleine largeur, faite de vignettes carrées bord à bord : de
 * l'image, du temps, et rien d'autre. Pas de carte arrondie, pas d'ombre, pas de
 * cadre, pas de badge — la mosaïque doit être belle **sans qu'on y touche**.
 *
 * ## Les rangées, et le zoom
 *
 * Chaque rangée est une dimension du temps :
 *
 * | rangée | ce qu'elle montre | une vignette, c'est |
 * | --- | --- | --- |
 * | `l'année` | les 54 magazines | une couverture |
 * | `la semaine` | les 7 jours du magazine ouvert | un chapitre |
 * | `la journée` | les 24 heures | une heure, et sa lumière |
 * | `le numéro` | les pages composées | une page, une rubrique |
 * | `les articles` | ce qui se lit | un article |
 *
 * **Le zoom ouvre les rangées.** De loin : l'année, et l'on voit le monde. Un
 * cran : la semaine. Un cran : la journée, heure par heure. Un cran : les pages
 * et les articles — on est entré dans le contenu. C'est la carte temporelle et
 * éditoriale du magazine : `ZOOM OUT → LE MONDE`, `ZOOM IN → LA JOURNÉE`, `ZOOM
 * PLUS → LA PAGE`, `ZOOM PLUS → L'ARTICLE`.
 *
 * On zoome à la molette, au pincement à deux doigts, au clavier (`+` / `−`), ou
 * par les quatre crans, à droite de la bande. Les rangées se font défiler au
 * doigt, à la molette horizontale, ou au trackpad.
 *
 * ## La tête de lecture
 *
 * L'endroit où l'on est porte un trait clair, en haut de sa vignette : c'est
 * **la tête de lecture** de l'atelier d'origine — le temps qu'on regarde, posé
 * sur la mosaïque. Elle se ramène toute seule dans le champ visible.
 */

/** Une vignette : une image, ou une couleur, et deux mots au plus. */
export interface TuileDuTemps {
  id: string;
  /** L'image de la vignette — quand elle est livrée. */
  url?: string | null;
  /** Le fond, quand il n'y a pas d'image : la couleur du magazine. */
  fond: string;
  /** L'encre lisible sur ce fond. */
  encre: string;
  /** Le repère typographique : « 18 », « 38 », « 05 ». */
  label: string;
  /** Un mot, au plus : « GOLDEN HOUR », « PARIS ». */
  mot?: string;
  /** Vrai pour la vignette de l'instant : elle porte la tête de lecture. */
  actif?: boolean;
  /** Deux cases de large : la variation d'échelle, dans la grille. */
  large?: boolean;
  /** La clarté de l'heure : la même image, vingt-quatre lumières. */
  clarte?: number;
  /** Le voile de lumière posé sur l'image. */
  voile?: string | null;
  /** Son opacité. */
  alpha?: number;
  onChoisir: () => void;
}

/** Une rangée de la mosaïque : une dimension, et ses vignettes. */
export interface RangeeDuTemps {
  id: string;
  /** Ce que la rangée est : « l'année », « la journée »… — deux mots, discrets. */
  quoi: string;
  tuiles: TuileDuTemps[];
}

export default function MosaiqueDuTemps({
  rangees,
  niveau,
  onNiveau,
}: {
  /** Les rangées ouvertes, dans l'ordre — du plus large au plus fin. */
  rangees: RangeeDuTemps[];
  /** Le cran d'échelle, 1 à 4. */
  niveau: number;
  onNiveau: (niveau: number) => void;
}) {
  const bande = useRef<HTMLDivElement>(null);
  const pincement = useRef<number | null>(null);
  const cumulMolette = useRef(0);

  /**
   * **La mosaïque tient dans la fenêtre.** L'échelle donne la taille *voulue* ;
   * la hauteur disponible donne la taille *possible* — quatre rangées ne doivent
   * jamais manger la scène. Sur un téléphone, les vignettes s'assagissent ; sur
   * un grand écran, elles prennent leur amplitude.
   */
  const [hauteur, setHauteur] = useState(() => (typeof window === 'undefined' ? 900 : window.innerHeight));
  useEffect(() => {
    const surRedimension = () => setHauteur(window.innerHeight);
    window.addEventListener('resize', surRedimension);
    return () => window.removeEventListener('resize', surRedimension);
  }, []);

  /** **La molette zoome**, et le pincement aussi : on entre dans le contenu. */
  useEffect(() => {
    const el = bande.current;
    if (!el) return;

    const surMolette = (e: WheelEvent) => {
      // Un geste horizontal (trackpad) fait défiler la rangée : on le laisse.
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) return;
      e.preventDefault();
      cumulMolette.current += e.deltaY;
      if (cumulMolette.current > 44) {
        cumulMolette.current = 0;
        onNiveau(Math.min(4, niveau + 1));
      } else if (cumulMolette.current < -44) {
        cumulMolette.current = 0;
        onNiveau(Math.max(1, niveau - 1));
      }
    };

    const distance = (t: TouchList) => Math.hypot(t[0]!.clientX - t[1]!.clientX, t[0]!.clientY - t[1]!.clientY);
    const surDebut = (e: TouchEvent) => {
      pincement.current = e.touches.length === 2 ? distance(e.touches) : null;
    };
    const surGeste = (e: TouchEvent) => {
      if (e.touches.length !== 2 || pincement.current === null) return;
      const d = distance(e.touches);
      const rapport = d / pincement.current;
      if (rapport > 1.25) {
        pincement.current = d;
        onNiveau(Math.min(4, niveau + 1));
      } else if (rapport < 0.8) {
        pincement.current = d;
        onNiveau(Math.max(1, niveau - 1));
      }
    };
    const surFin = () => {
      pincement.current = null;
    };

    el.addEventListener('wheel', surMolette, { passive: false });
    el.addEventListener('touchstart', surDebut, { passive: true });
    el.addEventListener('touchmove', surGeste, { passive: true });
    el.addEventListener('touchend', surFin, { passive: true });
    return () => {
      el.removeEventListener('wheel', surMolette);
      el.removeEventListener('touchstart', surDebut);
      el.removeEventListener('touchmove', surGeste);
      el.removeEventListener('touchend', surFin);
    };
  }, [niveau, onNiveau]);

  /** **Le clavier** : les mêmes crans, sans souris. */
  useEffect(() => {
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === '+' || e.key === '=') onNiveau(Math.min(4, niveau + 1));
      if (e.key === '-' || e.key === '_') onNiveau(Math.max(1, niveau - 1));
    };
    window.addEventListener('keydown', surTouche);
    return () => window.removeEventListener('keydown', surTouche);
  }, [niveau, onNiveau]);

  const voulue = tailleVoulue(niveau);
  const plafond = Math.round((hauteur * 0.56) / Math.max(1, rangees.length));
  const taille = Math.max(42, Math.min(voulue, plafond));

  return (
    <div
      ref={bande}
      data-mosaique="du-temps"
      data-niveau={niveau}
      className="relative w-full shrink-0 select-none bg-[#0B0C12] pb-[env(safe-area-inset-bottom)]"
      style={{ '--tuile': `${taille}px` } as React.CSSProperties}
    >
      {rangees.map((rangee) => (
        <RangeeDuTemps rangee={rangee} taille={taille} key={rangee.id} />
      ))}

      {/* **Les quatre crans**, à droite : l'échelle, sans un mot. */}
      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 flex-col items-end gap-1.5">
        {[1, 2, 3, 4].map((cran) => (
          <button
            key={cran}
            type="button"
            data-cran={cran}
            data-actif={cran === niveau ? 'true' : 'false'}
            onClick={() => onNiveau(cran)}
            aria-label={`Échelle ${cran} sur 4`}
            aria-pressed={cran === niveau}
            className="group flex h-4 items-center justify-end pr-0.5"
          >
            <span
              className="block rounded-full transition-all duration-300"
              style={{
                width: `${4 + cran * 3}px`,
                height: cran === niveau ? '3px' : '2px',
                background: cran === niveau ? '#FFFFFF' : 'rgba(255,255,255,0.28)',
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/** Une rangée : ses vignettes, bord à bord, et sa tête de lecture. */
function RangeeDuTemps({ rangee, taille }: { rangee: RangeeDuTemps; taille: number }) {
  const piste = useRef<HTMLDivElement>(null);
  const active = useRef<HTMLButtonElement>(null);

  /** La vignette de l'instant se ramène dans le champ : on ne la cherche pas. */
  useEffect(() => {
    const el = active.current;
    const piste_ = piste.current;
    if (!el || !piste_) return;
    const gauche = el.offsetLeft;
    const droite = gauche + el.offsetWidth;
    if (gauche < piste_.scrollLeft || droite > piste_.scrollLeft + piste_.clientWidth) {
      piste_.scrollTo({ left: Math.max(0, gauche - piste_.clientWidth / 2 + el.offsetWidth / 2), behavior: 'smooth' });
    }
  }, [rangee.tuiles]);

  return (
    <div className="relative">
      <div
        ref={piste}
        data-rangee={rangee.id}
        className="no-scrollbar flex w-full gap-px overflow-x-auto"
        aria-label={rangee.quoi}
      >
        {rangee.tuiles.map((tuile) => (
          <button
            key={tuile.id}
            ref={tuile.actif ? active : undefined}
            type="button"
            data-tuile={tuile.id}
            data-actif={tuile.actif ? 'true' : 'false'}
            onClick={tuile.onChoisir}
            aria-label={`${tuile.label}${tuile.mot ? ` — ${tuile.mot}` : ''}`}
            aria-pressed={Boolean(tuile.actif)}
            title={tuile.mot ? `${tuile.label} — ${tuile.mot}` : tuile.label}
            className="group relative shrink-0 overflow-hidden"
            style={{ width: taille * (tuile.large ? 2 : 1) + (tuile.large ? 1 : 0), height: taille }}
          >
            <span aria-hidden="true" className="absolute inset-0" style={{ background: tuile.fond }} />
            {tuile.url && (
              <img
                src={tuile.url}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:opacity-95"
                style={{ opacity: tuile.actif ? 1 : 0.86, filter: `brightness(${tuile.clarte ?? 1})` }}
              />
            )}
            {tuile.url && tuile.voile && (
              <span
                aria-hidden="true"
                className="absolute inset-0"
                style={{ background: tuile.voile, opacity: tuile.alpha ?? 0, mixBlendMode: 'soft-light' }}
              />
            )}

            {/* **La tête de lecture** : un trait, en haut de la vignette. */}
            {tuile.actif && <span className="absolute inset-x-0 top-0 h-[3px] bg-white" />}

            {/* Le repère typographique : un chiffre, un mot — jamais deux lignes. */}
            <span className="absolute inset-0 flex flex-col items-start justify-end p-1.5 text-left">
              <span
                className="font-mono leading-none tabular-nums transition"
                style={{
                  color: tuile.encre,
                  opacity: tuile.actif ? 1 : 0.62,
                  fontSize: taille >= 120 ? '15px' : taille >= 100 ? '13px' : '11px',
                  fontWeight: tuile.actif ? 700 : 500,
                  textShadow: tuile.url ? '0 1px 6px rgba(0,0,0,0.65)' : 'none',
                }}
              >
                {tuile.label}
              </span>
              {tuile.mot && taille >= 100 && (
                <span
                  className="mt-1 max-w-full truncate font-mono uppercase tracking-[0.1em] transition"
                  style={{
                    color: tuile.encre,
                    opacity: tuile.actif ? 0.95 : 0.5,
                    fontSize: '8.5px',
                    textShadow: tuile.url ? '0 1px 6px rgba(0,0,0,0.65)' : 'none',
                  }}
                >
                  {tuile.mot}
                </span>
              )}
            </span>
          </button>
        ))}
        {/* La fin de la rangée : un souffle, pas un bouton. */}
        <span aria-hidden="true" style={{ width: '3.5rem', height: taille }} className="shrink-0" />
      </div>
    </div>
  );
}
