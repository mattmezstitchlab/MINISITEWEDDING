import type { ReactNode } from 'react';

/**
 * LA SCÈNE ÉDITORIALE — UNE IMAGE, TROIS LIGNES, DU VIDE
 *
 * C'est tout ce qui reste au-dessus de la mosaïque, et c'est volontaire :
 *
 * ```
 * 20 SEPTEMBRE              ← la date
 * Septembre doré            ← le titre
 * L'ART DE RECEVOIR         ← le moment
 * ```
 *
 * Une grande image (ou la composition que la page lui donne quand la
 * photographie n'est pas livrée), et rien d'autre : ni badge, ni compteur, ni
 * panneau, ni bouton. Ce qui existe se découvre **dans la mosaïque**, en bas.
 *
 * Le cadran reste, discret, dans un coin : il dit l'heure et le chapitre, et il
 * suit la lumière choisie. Une seule action peut apparaître — « lire » — quand
 * ce qu'on regarde est un article. Elle n'est là que dans ce cas.
 */

export default function SceneEditoriale({
  date,
  titre,
  moment,
  image,
  composition,
  heure,
  clarte = 1,
  voile,
  alpha = 0,
  accent,
  cadran,
  action,
  className = '',
}: {
  /** Ce qui s'écrit en haut : la date, en petites capitales. */
  date: string;
  /** Le titre, en grand — un mot ou trois, jamais une phrase. */
  titre: string;
  /** Le moment, sous le titre : « GOLDEN HOUR », « L'ART DE RECEVOIR ». */
  moment: string;
  /** La photographie, quand elle est livrée. */
  image?: string | null;
  /** La composition de repli : la couverture dessinée, par exemple. */
  composition?: ReactNode;
  /** L'heure regardée : elle règle la lumière de l'image. */
  heure: number;
  /** Le facteur de clarté de cette heure. */
  clarte?: number;
  /** Le voile de lumière, posé en lumière douce sur la photographie. */
  voile?: string | null;
  /** Son opacité. */
  alpha?: number;
  /** Le trait d'accent du magazine — un seul, fin. */
  accent: string;
  /** Le cadran, quand la page en donne un. */
  cadran?: ReactNode;
  /** L'action contextuelle : « lire », et seulement pour un article. */
  action?: ReactNode;
  className?: string;
}) {
  return (
    <section
      data-scene="editoriale"
      className={`relative isolate min-h-0 overflow-hidden bg-[#0B0C12] text-white ${className}`}
    >
      {/* ————————————— L'IMAGE, PLEIN CADRE ————————————— */}
      {image ? (
        <>
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-700"
            style={{ filter: `brightness(${clarte})` }}
          />
          {voile && (
            <span
              aria-hidden="true"
              className="absolute inset-0 transition-colors duration-700"
              style={{ background: voile, opacity: alpha, mixBlendMode: 'soft-light' }}
            />
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          {composition ?? <span className="h-full w-full" style={{ background: accent, opacity: 0.25 }} />}
        </div>
      )}

      {/* Le bas de l'image se pose : le texte s'y lit sans l'éteindre. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
      />

      {/* ————————————— LE CADRAN, DISCRET, ET LE TITRE ————————————— */}
      <div className="relative flex h-full flex-col justify-between p-4 sm:p-7">
        <div className="flex items-start justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">AIME MAGAZINE</span>
          <span className="flex items-center gap-2">
            {cadran}
            {/* Le trait d'accent du magazine : une seule barre, fine. */}
            <span aria-hidden="true" className="block h-[2px] w-8" style={{ background: accent }} />
          </span>
        </div>

        <div className="max-w-[22ch] sm:max-w-[30ch]">
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/60">{date}</span>
          <h1
            className="vp-title mt-2 text-white"
            style={{ fontSize: 'clamp(1.9rem, 6.4vw, 3.6rem)', lineHeight: 0.98, letterSpacing: '-0.03em' }}
          >
            {titre}
          </h1>
          <span className="mt-3 block font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">
            {moment}
          </span>
          {action && <div className="mt-4">{action}</div>}
        </div>

        {/* L'heure, au coin : le seul chiffre de la scène. */}
        <span className="self-end font-mono text-[10px] tabular-nums tracking-[0.18em] text-white/40">
          {String(Math.floor(heure) % 24).padStart(2, '0')}:00
        </span>
      </div>
    </section>
  );
}
