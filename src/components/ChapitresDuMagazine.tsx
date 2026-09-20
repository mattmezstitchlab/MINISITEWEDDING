import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Visuel } from '../lib/visuelsDuMagazine';
import { visuelDuChapitre } from '../lib/visuelsDuMagazine';
import {
  jourDuChapitre,
  magazineDeLaDate,
  niveauxDuJour,
  positionDansLeMagazine,
  voisinDuChapitre,
  type ChapitreDuMagazine,
} from '../lib/semaines';

/**
 * LES SEPT CHAPITRES DU MAGAZINE — LA NAVIGATION ÉDITORIALE
 *
 * C'est la moitié du nouveau modèle, et c'est celle qui manquait : à côté de la
 * navigation **temporelle** (un jour après l'autre), il fallait la navigation
 * **éditoriale** — un chapitre après l'autre, dans le même magazine.
 *
 * Le bloc affiche **le magazine de la date** (son numéro, son titre, sa saison),
 * ses **sept chapitres** dans l'ordre, et l'état de chacun :
 *
 * - **l'image est là** → on la montre ;
 * - **l'image manque** → on ne montre pas une autre semaine : on montre la
 *   vignette de repli, dessinée avec la palette du magazine et la couleur de la
 *   saison, avec la mention « à paraître » ;
 * - **c'est le chapitre de la date** → il est marqué actif, et c'est de lui que
 *   parle le reste de la page.
 *
 * Cliquer un chapitre **ne change pas de magazine** : on reste dans la semaine,
 * et l'on passe au jour qui ouvre ce chapitre (voir `voisinDuChapitre`). Le
 * visiteur parcourt donc les jours *et* les sept univers du même numéro.
 */

interface ChapitresDuMagazineProps {
  /** La date regardée : elle donne le magazine, le chapitre actif, la saison. */
  date: Date;
  /** Où l'on va quand on choisit un chapitre — le jour qui l'ouvre. */
  onChoisirChapitre?: (date: Date) => void;
  /** La couleur de fond du bloc, quand il doit s'accorder à la page. */
  className?: string;
  /** L'année de travail, pour les bornes de la semaine. */
  annee?: number;
}

/** La vignette de repli : aucune image d'une autre semaine, jamais. */
function VignetteDeRepli({
  chapitre,
  fond,
  encre,
  accent,
  compact,
}: {
  chapitre: ChapitreDuMagazine;
  fond: string;
  encre: string;
  accent: string;
  compact: boolean;
}) {
  return (
    <div
      className={`relative flex h-full w-full flex-col justify-between ${compact ? 'p-2.5' : 'p-3'}`}
      style={{ background: fond, color: encre }}
    >
      {/* Le motif du repli : les sept marques du magazine, une par chapitre. */}
      <div className="flex items-center gap-1">
        {Array.from({ length: 7 }, (_, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="block h-[3px] flex-1 rounded-full"
            style={{ background: i + 1 === chapitre.numero ? accent : `${encre}33` }}
          />
        ))}
      </div>
      <div>
        <span
          className="block font-mono leading-none"
          style={{ fontSize: compact ? 26 : 34, color: accent, fontWeight: 700 }}
        >
          {String(chapitre.numero).padStart(2, '0')}
        </span>
        <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.12em] opacity-80">
          à paraître
        </span>
      </div>
    </div>
  );
}

export default function ChapitresDuMagazine({
  date,
  onChoisirChapitre,
  className = '',
  annee = date.getFullYear(),
}: ChapitresDuMagazineProps) {
  const magazine = magazineDeLaDate(date);
  const niveaux = niveauxDuJour(date);
  const position = positionDansLeMagazine(date);

  /** Le chapitre voisin — la navigation éditoriale, dans le même magazine. */
  const voisin = (pas: number): Date => voisinDuChapitre(date, annee, pas);

  return (
    <section id="chapitres" className={`border-t border-black/8 bg-[#F7F6F3] py-12 sm:py-16 ${className}`}>
      <div className="vp-page">
        {/* — LE MAGAZINE, EN TÊTE : ce qu'on est en train de lire — */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-black/10 pb-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45">
              {niveaux.magazine} · {niveaux.semaine}
            </span>
            <h2 className="vp-title mt-2 text-[22px] sm:text-[28px]">{magazine.titre}</h2>
            <p className="mt-1.5 max-w-[720px] text-[13.5px] leading-relaxed text-black/60">
              {magazine.style}. {magazine.terroir.charAt(0).toUpperCase() + magazine.terroir.slice(1)} —{' '}
              {magazine.lumiere}. Les sept chapitres ci-dessous sont ceux de <strong className="font-semibold text-black/75">ce magazine</strong> :
              on peut les parcourir sans quitter la semaine.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChoisirChapitre?.(voisin(-1))}
              disabled={!onChoisirChapitre}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/12 px-3 py-1.5 text-[12px] font-semibold text-black/70 transition hover:border-black/40 hover:text-black disabled:opacity-40"
              aria-label="Chapitre précédent"
            >
              <ChevronLeft size={13} /> Chapitre précédent
            </button>
            <button
              type="button"
              onClick={() => onChoisirChapitre?.(voisin(1))}
              disabled={!onChoisirChapitre}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/12 px-3 py-1.5 text-[12px] font-semibold text-black/70 transition hover:border-black/40 hover:text-black disabled:opacity-40"
              aria-label="Chapitre suivant"
            >
              Chapitre suivant <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* — LES SEPT CHAPITRES, DANS L'ORDRE, AVEC LEUR ÉTAT — */}
        <ol className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 lg:grid lg:grid-cols-4 lg:overflow-visible xl:grid-cols-7">
          {magazine.chapitres.map((chapitre) => {
            const visuel: Visuel = visuelDuChapitre(magazine.numero, chapitre.numero);
            const actif = chapitre.numero === position;
            const jour = jourDuChapitre(magazine.numero, chapitre.numero, annee);
            return (
              <li
                key={chapitre.numero}
                data-chapitre={chapitre.chapitre.id}
                data-actif={actif ? 'true' : 'false'}
                className={`w-[210px] shrink-0 snap-start lg:w-auto ${
                  actif ? '' : 'opacity-90 transition hover:opacity-100'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onChoisirChapitre?.(jour)}
                  disabled={!onChoisirChapitre}
                  aria-pressed={actif}
                  aria-label={`${chapitre.titreComplet} — ${chapitre.sujet}`}
                  className={`group block w-full overflow-hidden rounded-[16px] border bg-white text-left transition ${
                    actif
                      ? 'border-black/45 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.55)]'
                      : 'border-black/10 hover:border-black/30'
                  }`}
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    {visuel.url ? (
                      <img
                        src={visuel.url}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <VignetteDeRepli
                        chapitre={chapitre}
                        fond={magazine.saison.fond}
                        encre={magazine.saison.encre}
                        accent={magazine.palette.accent}
                        compact
                      />
                    )}
                    <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-white">
                      {String(chapitre.numero).padStart(2, '0')}
                    </span>
                    {actif && (
                      <span className="absolute right-2 top-2 rounded-full bg-white px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-black">
                        vous êtes ici
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-[13.5px] font-bold leading-snug text-[#0B0C12]">{chapitre.chapitre.titre}</h3>
                    <p className="mt-1.5 line-clamp-3 text-[12px] leading-relaxed text-black/55">{chapitre.sujet}</p>
                    <span className="mt-2 block font-mono text-[9.5px] uppercase tracking-[0.14em] text-black/35">
                      {actif ? 'chapitre du jour' : `ouvre le ${jour.getDate()} ${jour.toLocaleDateString('fr-FR', { month: 'long' })}`}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>

        {/* — CE QUE LA NAVIGATION PERMET : le dire, plutôt que le laisser deviner — */}
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-black/55">
          <span>
            <strong className="font-semibold text-black/75">Navigation temporelle</strong> — un jour après l'autre, 365 dates.
          </span>
          <span>
            <strong className="font-semibold text-black/75">Navigation éditoriale</strong> — les sept chapitres du magazine {magazine.numero}, sans changer de semaine.
          </span>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-black/40">
            {visuelDuChapitre(magazine.numero, position).origine === 'dessin'
              ? 'les images de cette semaine restent à livrer — le repli tient la page'
              : 'les images de cette semaine sont servies depuis la bibliothèque'}
          </span>
        </div>
      </div>
    </section>
  );
}
