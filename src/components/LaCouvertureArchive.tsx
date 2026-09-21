import { useState } from 'react';
import { ArrowRight, Stamp, X } from 'lucide-react';
import { pictoDuRipple } from '../lib/ripple';
import { marqueDuTampon } from '../lib/marquesDuTicket';
import { MOMENTS_DE_LA_NUIT, papiersDeLaCouverture, type PapierÉtalé } from '../lib/archiveDuMariage';

/* LA COUVERTURE-ARCHIVE — LE PAPIER DU MARIAGE, ÉTALÉ SUR DU NOIR
 *
 * ```txt
 *  ┌──────────────────────────────────────────────────────────────┐
 *  │ NUB-139   LE 12 JUIN 2027        AIME · SUPER MARIAGE        │
 *  │                                                              │
 *  │   ▨TIMBRE      ▭ note des objets        ┌──────────┐         │
 *  │                                        │ polaroïd │  ▭ carte│
 *  │              ❦                ┌─────────┴──────────┴────┐    │
 *  │                          Super│                        │    │
 *  │                        Mariage└────────────────────────┘    │
 *  │   ┌ ticket ┐                                     ▣ PAYÉ      │
 *  │   └────────┘   ▬▬ la nuit, en musique ▬▬▬▬▬                  │
 *  │                                              ⑆ NUB-139       │
 *  │                        ↓ les décors                          │
 *  └──────────────────────────────────────────────────────────────┘
 * ```
 *
 * **Ce n'est pas une décoration : c'est l'inventaire du produit, étalé.** Le
 * ticket qu'on scrolle, le polaroïd du jour, la carte postale du voyage, le
 * timbre, le sticker fluo, la note des sept objets, la bande de la musique, et
 * le code. Chaque papier **ouvre ce qu'il annonce**.
 *
 * Le titre est posé **par-dessus le désordre** — le geste exact de la
 * référence — et ne capte aucun clic : les papiers restent cliquables.
 */

export interface LaCouvertureArchiveProps {
  code: string;
  dateLabel: string;
  visuelDuJour: string | null;
  /** Le papier du ticket, tel qu'il est sur la page : ce qu'on montre dessus. */
  lignes: number;
  total: string;
  /** Descendre : le premier geste de la page. */
  surDescendre: () => void;
  /** **Ouvrir pour de vrai** ce qu'une pièce annonce (`site`, ou une bande). */
  surOuvrir: (cible: string) => void;
}

/** **Un papier de l'archive**, quel qu'il soit : sa matière, son mot, sa place.
 *  Il se clique — et il s'ouvre en grand (voir la feuille, plus bas). */
function Papier({
  papier,
  lignes,
  total,
  code,
  dateLabel,
  surOuvrir,
}: {
  papier: PapierÉtalé;
  lignes: number;
  total: string;
  code: string;
  dateLabel: string;
  surOuvrir: (papier: PapierÉtalé) => void;
}) {
  const Reçu = pictoDuRipple('recu').Icone;
    const commun = {
      'data-papier-étalé': papier.id,
      'data-papier-genre': papier.genre,
      style: {
        ['--x' as string]: `${papier.x}%`,
        ['--y' as string]: `${papier.y}%`,
        ['--r' as string]: `${papier.tour}deg`,
        ['--w' as string]: `${papier.largeur}%`,
      } as React.CSSProperties,
      className: 'vp-papier-étalé w-[46%] sm:w-[var(--w)]',
    };
    const dedans = (() => {
      switch (papier.genre) {
        case 'ticket':
          return (
            <span className="block bg-[#fffef7] px-[0.6em] py-[0.5em] font-mono text-[0.62rem] leading-tight text-[color:var(--vp-ink)] shadow-[0_14px_30px_rgba(0,0,0,0.55)]">
              <span className="flex items-baseline justify-between gap-1 border-b border-dashed border-black/30 pb-[0.35em] text-[0.58rem] uppercase tracking-[0.1em]">
                <span className="inline-flex items-center gap-1">
                  <Reçu size={9} /> SUPERMARIAGE
                </span>
                <span className="tabular-nums">{code}</span>
              </span>
              <span className="mt-[0.4em] flex items-baseline justify-between gap-2">
                <span>{lignes} lignes</span>
                <span className="tabular-nums">{total}</span>
              </span>
              <span className="mt-[0.3em] block text-[0.55rem] uppercase tracking-[0.1em] text-black/50">
                tout est dessus — cliquez
              </span>
              <span aria-hidden="true" className="mt-[0.45em] flex items-end gap-[1px]">
                {[2, 1, 3, 2, 1, 3, 1, 2, 3, 1, 2, 1, 3, 2].map((l, i) => (
                  <i key={i} className="block bg-black/80" style={{ width: `${l}px`, height: i % 3 === 0 ? '0.9em' : '0.6em' }} />
                ))}
              </span>
            </span>
          );
        case 'photo':
          return (
            <span className="vp-polaroïd block">
              {papier.image && <img src={papier.image} alt="" className="h-[5.4em] w-full object-cover sm:h-[7em]" />}
              <span className="mt-[0.4em] block px-[0.35em] pb-[0.45em]">
                <span className="block text-[0.62rem] uppercase tracking-[0.14em] text-[color:var(--vp-ink)]">{papier.mot}</span>
                <span className="block text-[0.55rem] text-black/55">{papier.sous}</span>
              </span>
            </span>
          );
        case 'carte':
          return (
            <span className="relative block bg-[#fffef7] p-[0.35em] shadow-[0_14px_30px_rgba(0,0,0,0.5)]">
              {papier.image && <img src={papier.image} alt="" className="h-[3.6em] w-full object-cover sm:h-[4.6em]" />}
              <span className="mt-[0.3em] block font-mono text-[0.52rem] uppercase tracking-[0.14em] text-black/55">
                {papier.mot} · {dateLabel}
              </span>
              {/* La marque postale : un cercle, et le code dedans. */}
              <span
                aria-hidden="true"
                className="absolute right-[0.3em] top-[0.3em] flex h-[1.9em] w-[1.9em] -rotate-12 items-center justify-center rounded-full border border-black/40 font-mono text-[0.42rem] uppercase text-black/60"
              >
                {code}
              </span>
            </span>
          );
        case 'timbre':
          return (
            <span className="vp-timbre flex aspect-square flex-col items-center justify-center gap-[0.2em] bg-[#f2f0e6] text-[color:var(--vp-ink)]">
              <Stamp size={13} />
              <span className="font-mono text-[0.5rem] uppercase tracking-[0.12em]">{papier.mot}</span>
              <span className="font-mono text-[0.44rem] uppercase tracking-[0.1em] text-black/50">{code}</span>
            </span>
          );
        case 'sticker':
          return (
            <span className="flex aspect-square flex-col items-center justify-center bg-[var(--vp-fluo)] text-[color:var(--vp-ink)] shadow-[0_12px_26px_rgba(0,0,0,0.5)]">
              <span className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.1em]">{papier.mot}</span>
              <span className="px-1 text-center font-mono text-[0.44rem] uppercase tracking-[0.08em] text-black/60">
                {papier.sous}
              </span>
            </span>
          );
        case 'bande':
          return (
            <span className="block bg-[#fffdf2] px-[0.5em] py-[0.45em] font-mono text-[0.5rem] leading-[1.5] text-[color:var(--vp-ink)] shadow-[0_16px_32px_rgba(0,0,0,0.5)]">
              <span className="block text-[0.52rem] uppercase tracking-[0.14em] text-black/60">{papier.mot}</span>
              <span className="mt-[0.2em] block">
                {MOMENTS_DE_LA_NUIT.map((m) => (
                  <span key={m.id} data-papier-moment={m.id} className="mr-[0.5em] inline-block whitespace-nowrap">
                    <b className="font-normal tabular-nums text-black/50">{m.heure}</b> {m.mot}
                  </span>
                ))}
              </span>
            </span>
          );
        case 'code':
        default:
          return (
            <span className="block border border-dashed border-black/30 bg-[#fffef7] px-[0.5em] py-[0.45em] text-center shadow-[0_14px_30px_rgba(0,0,0,0.5)]">
              <span className="block text-[0.5rem] uppercase tracking-[0.16em] text-black/55">{papier.sous}</span>
              <span className="block font-mono text-[1.05rem] leading-tight tracking-[0.14em] text-[color:var(--vp-ink)]">
                {papier.mot}
              </span>
            </span>
          );
    }
  })();

  return (
    <button
      {...commun}
      type="button"
      aria-label={`${papier.mot} — ${papier.sous ?? ''}`}
      onClick={() => surOuvrir(papier)}
      className={`${commun.className} cursor-pointer text-left`}
    >
      {dedans}
    </button>
  );
}


export default function LaCouvertureArchive({
  code,
  dateLabel,
  visuelDuJour,
  lignes,
  total,
  surDescendre,
  surOuvrir,
}: LaCouvertureArchiveProps) {
  const papiers = papiersDeLaCouverture(visuelDuJour, code);
  /** **La pièce ouverte en grand.** Le clic ouvre le papier, jamais ailleurs :
   *  « les photos en haut, en cliquant on descend, ça perturbe ». */
  const [ouverte, setOuverte] = useState<PapierÉtalé | null>(null);
  const noteObjets = papiers.find((p) => p.genre === 'note');

  return (
    <section
      id="l-archive"
      data-bande="archive"
      data-section="archive"
      className="vp-archive relative min-h-svh w-full overflow-hidden px-4 pb-14 pt-10 sm:px-8"
    >
      {/* ——————————————— LA LIGNE DU HAUT : LE CODE, LA DATE, LA MARQUE ——————————————— */}
      <div className="relative z-20 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 font-mono text-[9.5px] uppercase tracking-[0.22em] text-white/60">
        <span className="flex items-baseline gap-3">
          <span data-archive-code={code} className="tabular-nums text-white/90">
            {code}
          </span>
          <span>{dateLabel}</span>
        </span>
        <span>
          <b className="font-normal text-white/90">AIME</b> · LE SPÉCIALISTE DU TICKET
        </span>
      </div>

      {/* ——————————————— LE PAPIER ÉTALÉ ——————————————— */}
      <div data-collage="vrai" className="vp-collage relative z-10 mt-8 sm:mt-0 sm:h-[74svh]">
        {papiers.map((papier) => (
          <Papier
            key={papier.id}
            papier={papier}
            lignes={lignes}
            total={total}
            code={code}
            dateLabel={dateLabel}
            surOuvrir={setOuverte}
          />
        ))}
      </div>

      {/* ——————————————— LE TITRE, POSÉ PAR-DESSUS LE DÉSORDRE ——————————————— */}
      <div className="pointer-events-none relative z-20 -mt-[38svh] flex flex-col items-center text-center sm:-mt-[52svh]">
        <h2 data-archive-titre="vrai" className="vp-didone vp-archive-titre text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.7)]">
          Super
          <span className="block">Mariage</span>
        </h2>
        <p className="mt-4 max-w-[34ch] font-mono text-[10px] uppercase leading-relaxed tracking-[0.24em] text-white/70">
          {noteObjets?.sous ?? 'le papier du mariage'} · {lignes} lignes · {total}
        </p>
        <p className="mt-2 max-w-[38ch] text-[12.5px] leading-snug text-white/60">
          Tout ce qu’un mariage a de papier : le ticket, la carte postale, le timbre, le sticker, le polaroïd du jour,
          la bande de la musique — étalés, et cliquables.
        </p>
        <button
          type="button"
          data-action="descendre-vers-les-décors"
          onClick={surDescendre}
          className="pointer-events-auto mt-6 font-mono text-[13px] text-white/60 transition hover:text-white"
        >
          ↓ les décors
        </button>
      </div>

      {/* ——————————————— LA PIÈCE OUVERTE EN GRAND ———————————————
          On clique un papier, **il s'ouvre** — et c'est seulement là, sur la
          pièce, qu'on propose d'aller voir ce qu'elle annonce. Aucun clic ne
          fait sauter la page ailleurs. */}
      {ouverte && (
        <div
          data-archive-feuille="vrai"
          data-archive-feuille-piece={ouverte.id}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-[420px]">
            <button
              type="button"
              data-action="fermer-la-pièce"
              onClick={() => setOuverte(null)}
              aria-label="fermer la pièce"
              className="absolute -right-1 -top-9 flex h-7 w-7 items-center justify-center rounded-full border border-white/25 text-white/70 transition hover:border-white hover:text-white"
            >
              <X size={13} />
            </button>
            <Papier
              papier={ouverte}
              lignes={lignes}
              total={total}
              code={code}
              dateLabel={dateLabel}
              surOuvrir={() => setOuverte(null)}
            />
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/60">
                {ouverte.mot}
                {ouverte.sous ? ` · ${ouverte.sous}` : ''}
              </p>
              {ouverte.ouvre && (
                <button
                  type="button"
                  data-archive-feuille-ouvre={ouverte.ouvre.cible}
                  onClick={() => {
                    const cible = ouverte.ouvre!.cible;
                    setOuverte(null);
                    surOuvrir(cible);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[color:var(--vp-ink)] transition hover:brightness-95"
                >
                  {ouverte.ouvre.mot}
                  <ArrowRight size={12} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Ce que le sticker dit vraiment : la marque du tampon, sur le noir. */}
      <p data-archive-marque="vrai" className="sr-only">
        {marqueDuTampon('tampon')} · {code} · {dateLabel}
      </p>
    </section>
  );
}
