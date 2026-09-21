import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, RotateCcw, Stamp, X } from 'lucide-react';
import { pictoDuRipple } from '../lib/ripple';
import { marqueDuTampon } from '../lib/marquesDuTicket';
import { MOMENTS_DE_LA_NUIT, papiersDeLaCouverture, type PapierÉtalé } from '../lib/archiveDuMariage';

/* LA COUVERTURE-ARCHIVE — LE PAPIER DU MARIAGE, ÉTALÉ, ET VIVANT
 *
 * ```txt
 *  ┌──────────────────────────────────────────────────────────────┐
 *  │                    le papier, en haut, petit                 │
 *  │   ▨ TIMBRE   ▭ liste    ┌────────┐  ▭ CARTE POSTALE          │
 *  │                         │polaroïd│                          │
 *  │   ┌ reçu ┐                       ▣ PAYÉ                     │
 *  │   └──────┘   ▬▬ LA NUIT ▬▬▬       ⑆ NUB-139                 │
 *  │                                                              │
 *  │                        Super                                 │
 *  │                      Mariage                                 │
 *  │                    ↓ les décors                              │
 *  └──────────────────────────────────────────────────────────────┘
 * ```
 *
 * **Trois gestes sur chaque pièce, et rien d'autre :**
 *
 * 1. **on la déplace** — le doigt (ou la souris) la prend et la pose ailleurs
 *    sur la table : elle est petite exprès, il y a de la place autour ;
 * 2. **on la retourne** — le bouton du coin la fait pivoter : au dos, c'est un
 *    vrai dos de papier, avec un champ où **l'on écrit** ;
 * 3. **on la clique** — elle **s'ouvre en grand**, et c'est là qu'elle propose
 *    d'aller voir ce qu'elle annonce. Aucun clic ne fait sauter la page.
 *
 * Ce qu'on écrit reste dans le navigateur (`supermariage:pieces`) : ça ne part
 * nulle part — c'est un brouillon sur la table.
 */

const CLE_DES_PIÈCES = 'supermariage:pieces';

/** Ce qui a été écrit au dos des papiers, et où ils ont été posés. */
function lireLesPièces(): { places: Record<string, { x: number; y: number }>; écrits: Record<string, string> } {
  const vide = { places: {}, écrits: {} };
  if (typeof window === 'undefined') return vide;
  try {
    const brut = window.localStorage.getItem(CLE_DES_PIÈCES);
    if (!brut) return vide;
    const lu = JSON.parse(brut) as { places?: Record<string, { x: number; y: number }>; écrits?: Record<string, string> };
    return { places: lu.places ?? {}, écrits: lu.écrits ?? {} };
  } catch {
    return vide;
  }
}

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

/** **Un papier de l'archive** : sa matière, son mot, sa place — et son dos. */
function Papier({
  papier,
  écrit,
  retournée,
  enGrand,
  place,
  lignes,
  total,
  code,
  dateLabel,
  surOuvrir,
  surRetourner,
  surÉcrire,
  surPrendre,
  surGlisser,
  surLâcher,
}: {
  papier: PapierÉtalé;
  écrit: string;
  retournée: boolean;
  /** `grand` : la pièce ouverte — elle prend toute la largeur de la feuille. */
  enGrand?: boolean;
  /** Où la pièce est posée, en pour cent de la table. */
  place?: { x: number; y: number };
  lignes: number;
  total: string;
  code: string;
  dateLabel: string;
  surOuvrir: () => void;
  surRetourner: () => void;
  surÉcrire: (texte: string) => void;
  surPrendre?: (e: React.PointerEvent) => void;
  surGlisser?: (e: React.PointerEvent) => void;
  surLâcher?: () => void;
}) {
  const Reçu = pictoDuRipple('recu').Icone;
  /* **Un clic, ce n'est pas un glissement.** Le doigt garde la trace : si la
     pièce a bougé de plus de trois pixels, on ne l'ouvre pas — on l'a posée. */
  const glissé = useRef(false);
  const départ = useRef({ x: 0, y: 0 });

  /* ———————————————————— LE DEVANT ———————————————————— */
  const devant = (() => {
    switch (papier.genre) {
      case 'ticket':
        return (
          <span className="block bg-[#fffef7] px-[0.6em] py-[0.5em] font-mono leading-tight shadow-[0_14px_30px_rgba(0,0,0,0.55)]">
            <span className="flex items-baseline justify-between gap-1 border-b border-dashed border-black/30 pb-[0.35em] text-[0.58rem] uppercase tracking-[0.1em]">
              <span className="inline-flex items-center gap-1">
                <Reçu size={9} /> SUPERMARIAGE
              </span>
              <span className="tabular-nums">{code}</span>
            </span>
            <span className="mt-[0.4em] flex items-baseline justify-between gap-2 text-[0.66rem]">
              <span>{lignes} lignes</span>
              <span className="tabular-nums">{total}</span>
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
            {papier.image && <img src={papier.image} alt="" className="aspect-[4/5] w-full object-cover" />}
            <span className="mt-[0.35em] block px-[0.3em] pb-[0.4em]">
              <span className="block text-[0.6rem] uppercase tracking-[0.14em] text-[color:var(--vp-ink)]">{papier.mot}</span>
              <span className="block text-[0.54rem] leading-tight text-black/55">{papier.sous}</span>
            </span>
          </span>
        );
      case 'carte':
        return (
          <span className="relative block bg-[#fffef7] p-[0.3em] shadow-[0_14px_30px_rgba(0,0,0,0.5)]">
            {papier.image && <img src={papier.image} alt="" className="aspect-[3/2] w-full object-cover" />}
            <span className="mt-[0.25em] block font-mono text-[0.5rem] uppercase tracking-[0.12em] text-black/55">
              {papier.mot} · {dateLabel}
            </span>
            <span
              aria-hidden="true"
              className="absolute right-[0.25em] top-[0.25em] flex h-[1.7em] w-[1.7em] -rotate-12 items-center justify-center rounded-full border border-black/40 font-mono text-[0.4rem] uppercase text-black/60"
            >
              {code}
            </span>
          </span>
        );
      case 'timbre':
        return (
          <span className="vp-timbre flex aspect-square flex-col items-center justify-center gap-[0.15em] text-[color:var(--vp-ink)]">
            <Stamp size={12} />
            <span className="font-mono text-[0.48rem] uppercase tracking-[0.1em]">{papier.mot}</span>
          </span>
        );
      case 'sticker':
        return (
          <span className="flex aspect-square flex-col items-center justify-center bg-[var(--vp-fluo)] text-[color:var(--vp-ink)] shadow-[0_12px_26px_rgba(0,0,0,0.5)]">
            <span className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.1em]">{papier.mot}</span>
          </span>
        );
      case 'bande':
        return (
          <span className="block bg-[#fffdf2] px-[0.45em] py-[0.4em] font-mono text-[0.48rem] leading-[1.45] text-[color:var(--vp-ink)] shadow-[0_16px_32px_rgba(0,0,0,0.5)]">
            <span className="block text-[0.5rem] uppercase tracking-[0.14em] text-black/60">{papier.mot} · LA MUSIQUE</span>
            <span className="mt-[0.15em] block">
              {MOMENTS_DE_LA_NUIT.map((m) => (
                <span key={m.id} data-papier-moment={m.id} className="mr-[0.45em] inline-block whitespace-nowrap">
                  <b className="font-normal tabular-nums text-black/50">{m.heure}</b> {m.mot}
                </span>
              ))}
            </span>
          </span>
        );
      case 'code':
      default:
        return (
          <span className="block border border-dashed border-black/30 bg-[#fffef7] px-[0.45em] py-[0.4em] text-center shadow-[0_14px_30px_rgba(0,0,0,0.5)]">
            <span className="block text-[0.46rem] uppercase tracking-[0.14em] text-black/55">{papier.sous}</span>
            <span className="block font-mono text-[0.95rem] leading-tight tracking-[0.12em] text-[color:var(--vp-ink)]">
              {papier.mot}
            </span>
          </span>
        );
    }
  })();

  /* ———————————————————— LE DOS : ON ÉCRIT ———————————————————— */
  const dos = (
    <span
      data-piece-dos={papier.id}
      className={`flex h-full flex-col bg-[#fffef7] font-mono text-[color:var(--vp-ink)] shadow-[0_14px_30px_rgba(0,0,0,0.45)] ${
        enGrand ? 'px-[1.6em] py-[1.2em]' : 'px-[0.6em] py-[0.5em]'
      }`}
    >
      <span className="flex items-baseline justify-between gap-2 border-b border-dashed border-black/25 pb-[0.3em] text-[0.5rem] uppercase tracking-[0.12em] text-black/55">
        <span>{papier.dos}</span>
        <span className="tabular-nums">{code}</span>
      </span>
      <textarea
        data-piece-champ={papier.id}
        value={écrit}
        onChange={(e) => surÉcrire(e.target.value)}
        placeholder={papier.invite}
        rows={enGrand ? 7 : 4}
        className={`mt-[0.4em] w-full flex-1 resize-none border-0 bg-transparent p-0 leading-relaxed outline-none placeholder:text-black/30 ${
          enGrand ? 'text-[0.82rem]' : 'text-[0.62rem]'
        }`}
        style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 1.05em, rgba(15,17,28,0.14) 1.05em, rgba(15,17,28,0.14) 1.1em)' }}
      />
      <span aria-hidden="true" className="mt-[0.3em] block text-right text-[0.5rem] uppercase tracking-[0.12em] text-black/35">
        {dateLabel}
      </span>
    </span>
  );

  return (
    <div
      data-papier-étalé={papier.id}
      data-papier-genre={papier.genre}
      data-piece={papier.id}
      data-piece-genre={papier.genre}
      data-piece-taille={enGrand ? 'grand' : 'collage'}
      data-piece-retournee={retournée}
      data-piece-deplacable={surPrendre ? 'vrai' : 'non'}
      style={{
        ['--r' as string]: `${papier.tour}deg`,
        ['--w' as string]: `${papier.largeur}%`,
        ['--x' as string]: `${place?.x ?? papier.x}%`,
        ['--y' as string]: `${place?.y ?? papier.y}%`,
      }}
      data-piece-x={Math.round(place?.x ?? papier.x)}
      data-piece-y={Math.round(place?.y ?? papier.y)}
      className={
        enGrand
          ? 'vp-piece vp-piece-grand w-full'
          : `vp-piece ${place ? 'vp-posé' : ''} w-[46%] sm:w-[var(--w)]`
      }
      onPointerDown={(e) => {
        glissé.current = false;
        départ.current = { x: e.clientX, y: e.clientY };
        if (!enGrand) (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
        surPrendre?.(e);
      }}
      onPointerMove={(e) => {
        if (glissé.current || Math.abs(e.clientX - départ.current.x) > 3 || Math.abs(e.clientY - départ.current.y) > 3) {
          glissé.current = true;
          surGlisser?.(e);
        }
      }}
      onPointerUp={() => {
        surLâcher?.();
      }}
      onPointerCancel={() => {
        surLâcher?.();
      }}
    >
      <div className="vp-piece-boîte">
        {/* Le devant : un bouton — il ouvre la pièce en grand. */}
        <span className="vp-piece-face">
          <button
            type="button"
            data-action="ouvrir-la-piece"
            data-papier-étalé={papier.id}
            onClick={() => {
              // Un glissement n'ouvre pas : il vient de poser la pièce.
              if (glissé.current) {
                glissé.current = false;
                return;
              }
              surOuvrir();
            }}
            aria-label={`${papier.mot} — ${papier.sous ?? ''}`}
            className="block w-full text-left"
          >
            {devant}
          </button>
        </span>

        {/* Le dos : on écrit. */}
        <span className="vp-piece-face vp-piece-derriere absolute inset-0">{dos}</span>
      </div>

      {/* Les deux gestes : retourner, et écrire. */}
      <button
        type="button"
        data-action="retourner-la-piece"
        data-piece-retournee-mot={retournée ? 'devant' : 'dos'}
        onClick={(e) => {
          e.stopPropagation();
          surRetourner();
        }}
        aria-label={retournée ? `remettre ${papier.mot} devant` : `retourner ${papier.mot}`}
        className="vp-piece-bouton"
      >
        <RotateCcw size={10} />
      </button>
    </div>
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
  const papiers = useMemo(() => papiersDeLaCouverture(visuelDuJour, code), [visuelDuJour, code]);

  /* **La table telle qu'on l'a laissée** : ce qui a été écrit, et où chaque
     papier a été posé. Rien ne part ailleurs. */
  const auDépart = useMemo(() => lireLesPièces(), []);
  const [places, setPlaces] = useState<Record<string, { x: number; y: number }>>(() => {
    const base = Object.fromEntries(papiers.map((p) => [p.id, { x: p.x, y: p.y }]));
    return { ...base, ...auDépart.places };
  });
  const [écrits, setÉcrits] = useState<Record<string, string>>(auDépart.écrits);
  const [retournées, setRetournées] = useState<string[]>([]);
  const [ouverte, setOuverte] = useState<PapierÉtalé | null>(null);

  const table = useRef<HTMLDivElement>(null);
  const saisie = useRef<{ id: string; dx: number; dy: number } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(CLE_DES_PIÈCES, JSON.stringify({ places, écrits }));
    } catch {
      /* pas de place : la table reste en mémoire */
    }
  }, [places, écrits]);

  /** **On prend un papier** : on note où le doigt l'a saisi dans la pièce. */
  const prendre = (id: string, e: React.PointerEvent) => {
    const zone = table.current;
    if (!zone || typeof window === 'undefined' || window.innerWidth < 640) return;
    const boîte = zone.getBoundingClientRect();
    const papier = papiers.find((p) => p.id === id)!;
    const place = places[id] ?? { x: papier.x, y: papier.y };
    saisie.current = {
      id,
      dx: e.clientX - (boîte.left + (place.x / 100) * boîte.width),
      dy: e.clientY - (boîte.top + (place.y / 100) * boîte.height),
    };
  };

  /** **On le pose** : la position se recalcule en pour cent de la table. */
  const poser = (e: React.PointerEvent) => {
    const prise = saisie.current;
    const zone = table.current;
    if (!prise || !zone) return;
    const boîte = zone.getBoundingClientRect();
    const papier = papiers.find((p) => p.id === prise.id)!;
    const x = Math.min(100 - papier.largeur - 1, Math.max(-1, ((e.clientX - prise.dx - boîte.left) / boîte.width) * 100));
    const y = Math.min(84, Math.max(1, ((e.clientY - prise.dy - boîte.top) / boîte.height) * 100));
    setPlaces((p) => ({ ...p, [papier.id]: { x, y } }));
  };

  const écrire = (id: string) => (texte: string) => setÉcrits((e) => ({ ...e, [id]: texte }));

  const lesProps = (papier: PapierÉtalé, enGrand = false) => ({
    papier,
    écrit: écrits[papier.id] ?? '',
    retournée: retournées.includes(papier.id),
    enGrand,
    lignes,
    total,
    code,
    dateLabel,
    surOuvrir: () => {
      setOuverte(papier);
      // **On la rouvre du côté où il y a quelque chose** : si l'on a écrit au
      // dos, c'est le dos qu'on vient relire.
      if ((écrits[papier.id] ?? '').length > 0) {
        setRetournées((r) => (r.includes(papier.id) ? r : [...r, papier.id]));
      }
    },
    surRetourner: () => setRetournées((r) => (r.includes(papier.id) ? r.filter((x) => x !== papier.id) : [...r, papier.id])),
    surÉcrire: écrire(papier.id),
  });

  return (
    <section
      id="l-archive"
      data-bande="archive"
      data-section="archive"
      className="vp-archive relative w-full overflow-hidden px-4 pb-10 pt-8 sm:px-8"
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

      {/* ——————————————— LE PAPIER ÉTALÉ : PETIT, EN HAUT, ET VIVANT ——————————————— */}
      <div
        ref={table}
        data-collage="vrai"
        className="vp-collage relative z-10 mt-6 sm:mx-auto sm:mt-2 sm:h-[46svh] sm:max-w-[1100px]"
      >
        {papiers.map((papier) => (
          <Papier
            key={papier.id}
            {...lesProps(papier)}
            place={places[papier.id] ?? { x: papier.x, y: papier.y }}
            surPrendre={(e) => prendre(papier.id, e)}
            surGlisser={poser}
            surLâcher={() => {
              saisie.current = null;
            }}
          />
        ))}

        {/* ——————————————— LE TITRE, POSÉ PAR-DESSUS LE DÉSORDRE ——————————————— */}
        <div className="pointer-events-none relative z-20 mt-6 flex flex-col items-center text-center sm:absolute sm:inset-x-0 sm:bottom-2 sm:mt-0">
          <h2
            data-archive-titre="vrai"
            className="vp-didone vp-archive-titre text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.7)]"
          >
            Super
            <span className="block">Mariage</span>
          </h2>
          <p className="mt-3 max-w-[36ch] font-mono text-[10px] uppercase leading-relaxed tracking-[0.22em] text-white/65">
            {lignes} lignes · {total} · trois gestes : déplacer, retourner, écrire
          </p>
          <button
            type="button"
            data-action="descendre-vers-les-décors"
            onClick={surDescendre}
            className="pointer-events-auto mt-4 font-mono text-[13px] text-white/60 transition hover:text-white"
          >
            ↓ les décors
          </button>
        </div>
      </div>

      {/* ——————————————— LA PIÈCE OUVERTE EN GRAND ———————————————
          On clique un papier, **il s'ouvre** — en grand, à sa taille, avec son
          dos et son champ. C'est seulement là qu'il propose d'aller voir ce
          qu'il annonce. */}
      {ouverte && (
        <div
          data-archive-feuille="vrai"
          data-archive-feuille-piece={ouverte.id}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-sm"
        >
          <div className="relative my-auto w-full max-w-[620px]">
            <button
              type="button"
              data-action="fermer-la-pièce"
              onClick={() => setOuverte(null)}
              aria-label="fermer la pièce"
              className="absolute -right-1 -top-10 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white/70 transition hover:border-white hover:text-white"
            >
              <X size={14} />
            </button>

            {/* **La pièce, à sa vraie taille** : c'est ce qui manquait. */}
            <div data-archive-feuille-grand="vrai" className="[&_.vp-piece]:!w-full">
              <Papier {...lesProps(ouverte, true)} />
            </div>

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
