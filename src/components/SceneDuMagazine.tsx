import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Hand } from 'lucide-react';
import CouvertureJour from './CouvertureJour';
import CadranDuMagazine from './CadranDuMagazine';
import { legendeDeLHeure } from './CouvertureJour';
import { couvertureDuJour, couverturesDesParts } from '../lib/couvertureDuJour';
import { jourDuMagazine } from '../lib/jourDuMagazine';
import { CHAPITRES } from '../lib/chapitres';
import { magazineDeLaDate, niveauxDuJour, positionDansLeMagazine } from '../lib/semaines';
import { visuelsDuJour } from '../lib/visuelsDuMagazine';
import { useMomentDeLaCapsule, useTempsDeLaCapsule } from '../lib/capsuleCommande';

/**
 * LA SCÈNE — LE MAGAZINE, PLEIN ÉCRAN
 *
 * Un seul écran, et l'on n'en sort pas : **l'image du chapitre** remplit la
 * fenêtre, la barre du bas porte la navigation, et tout le reste se lit en
 * glissant. C'est le geste d'une application, pas d'une page :
 *
 * ```
 * ┌──────────────────────────────────────────┐
 * │ AIME MAGAZINE            N° 38   (cadran)│  la marque, le numéro, l'heure
 * │                                          │
 * │             L'IMAGE, PLEIN CADRE         │  ← le visuel du chapitre
 * │                                          │
 * │ 17 → 23 SEPTEMBRE · SEMAINE 38 · ÉTÉ     │  les trois niveaux
 * │ Septembre doré                           │  le titre du magazine
 * │ 05 — La Fête · 21 septembre              │  le chapitre de la date
 * │ ▁▂▃▄▅▆▇  la bande des sept chapitres     │  on touche, on change de jour
 * └──────────────────────────────────────────┘
 * ```
 *
 * **Trois façons de tourner les pages**, comme sur un téléphone : on **glisse**
 * le visuel (le doigt, la souris — avec l'élasticité d'iOS), on **touche** la
 * bande des chapitres, ou l'on passe par les **flèches**. La scène ne descend
 * jamais sous le chapitre : elle prend l'image de la bibliothèque, puis la
 * couverture de la semaine, puis — s'il n'y a rien — **la couverture dessinée**,
 * qui porte le cadran. Une image manquante ne casse donc jamais l'écran.
 */

const GLISSER = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 32,
  mass: 0.9,
};

export default function SceneDuMagazine({
  date,
  index,
  total,
  onPrecedent,
  onSuivant,
  onChapitre,
  ref,
}: {
  /** Le jour regardé. */
  date: Date;
  /** Sa place dans la fenêtre de sept jours, et combien ils sont. */
  index: number;
  total: number;
  onPrecedent: () => void;
  onSuivant: () => void;
  /** Ouvrir un chapitre du magazine — le jour qui l'ouvre. */
  onChapitre: (date: Date) => void;
  /**
   * La scène est **la bande du magazine** : c'est elle que le dock observe pour
   * savoir s'il doit montrer ses flèches (« la bande à l'écran mène »). On lui
   * passe donc la référence, et elle la pose sur son propre cadre.
   */
  ref?: React.Ref<HTMLElement>;
}) {
  const niveaux = useMemo(() => niveauxDuJour(date), [date]);
  const visuels = useMemo(() => visuelsDuJour(date), [date]);
  const magazine = useMemo(() => magazineDeLaDate(date), [date]);
  const jour = useMemo(() => jourDuMagazine(date), [date]);
  const temps = useTempsDeLaCapsule();
  const moment = useMomentDeLaCapsule();

  /** L'image du chapitre, pleine page ; sinon la couverture de la semaine. */
  const scene = visuels.imageDuChapitre.url ?? visuels.couverture.url;
  const couverture = useMemo(() => {
    if (!moment) return couvertureDuJour(date);
    return couverturesDesParts(date).find((p) => p.part.id === moment)?.couverture ?? couvertureDuJour(date);
  }, [moment, date]);

  const chapitreActif = positionDansLeMagazine(date);
  const cle = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  /** Le geste : un glissement franc change de jour, sinon on revient en place. */
  const surGlissement = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const x = info.offset.x;
    const v = info.velocity.x;
    if (x < -60 || v < -420) onSuivant();
    else if (x > 60 || v > 420) onPrecedent();
  };

  return (
    <header
      ref={ref}
      data-scene="magazine"
      className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-[#0B0C12] text-white"
    >
      {/* ————————————— LA SCÈNE : L'IMAGE, ET LE GLISSEMENT ————————————— */}
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={cle}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.015 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          {scene ? (
            <img src={scene} alt="" className="h-full w-full object-cover" />
          ) : (
            /* Le repli, et il est beau : la couverture dessinée du jour, avec
               son cadran. Aucune image d'une autre semaine n'est jamais prise. */
            <div className="flex h-full w-full items-center justify-center bg-black">
              <CouvertureJour couverture={couverture} visuel={visuels.couverture} niveaux={niveaux} className="h-[86svh] w-auto opacity-90" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Le voile : il tient le texte lisible sans éteindre la photographie. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/5 to-black/85" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {/* ————————————— LE GESTE : ON GLISSE POUR TOURNER LA PAGE ————————————— */}
      <motion.div
        className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.14}
        dragMomentum={false}
        onDragEnd={surGlissement}
        /* Le retour élastique : c'est ce ressort qui donne le geste d'iOS. */
        transition={GLISSER}
        aria-label="Glisser pour changer de jour"
        data-geste="glisser"
      />

      {/* ————————————— LE CONTENU, PAR-DESSUS ————————————— */}
      <div className="pointer-events-none relative z-20 flex h-full flex-col justify-between">
        {/* En haut : la marque, le numéro, le cadran. */}
        <div className="vp-page flex items-start justify-between pt-[calc(env(safe-area-inset-top)+5.5rem)]">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/60">SUPER MAGAZINE</span>
            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              AIME MAGAZINE · {magazine.etiquette} · semaine {magazine.semaine ?? '—'} · {magazine.saison.nom}
            </p>
          </div>
          {/* Le cadran, en grand : l'heure de la capsule, et le chapitre. */}
          <div className="flex flex-col items-end gap-2">
            <CadranDuMagazine
              heure={temps.heure}
              chapitre={chapitreActif}
              fond="transparent"
              encre="#F3F1ED"
              accent={magazine.palette.accent}
              legende={legendeDeLHeure(temps.heure)}
              className="h-[92px] w-[92px] drop-shadow-[0_6px_20px_rgba(0,0,0,0.5)]"
            />
            <span className="hidden font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/45 sm:block">
              {temps.pilote ? 'la capsule' : 'l’heure réelle'}
            </span>
          </div>
        </div>

        {/* En bas : les trois niveaux, le titre, et la bande des chapitres. */}
        {/* Le bas de scène laisse la place à la barre : la zone sûre, plus la
            hauteur des deux rangées (les visuels, la règle) et du dock. */}
        <div className="vp-page pb-[calc(env(safe-area-inset-bottom)+14.5rem)] text-center sm:pb-[13rem]">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/65">
            {niveaux.date} → {niveaux.magazine} → {niveaux.chapitre}
          </span>

          <h1
            className="vp-title mx-auto mt-3 max-w-[16ch] text-white"
            style={{ fontSize: 'clamp(2.1rem, 8vw, 4.2rem)', lineHeight: 0.98, letterSpacing: '-0.03em' }}
          >
            {magazine.titre}
          </h1>

          <p className="mx-auto mt-2.5 max-w-[46ch] text-[13px] leading-relaxed text-white/60">
            {magazine.style} · {jour.nom || 'un joker'} · chapitre {String(chapitreActif).padStart(2, '0')} —{' '}
            {CHAPITRES[chapitreActif - 1]!.titre} · {magazine.carte.nom}
          </p>

          {/* La bande des sept chapitres : on touche, on change de jour. */}
          <div className="pointer-events-auto mx-auto mt-5 flex max-w-[520px] items-center justify-center gap-1.5">
            {CHAPITRES.map((c) => {
              const actif = c.numero === chapitreActif;
              return (
                <button
                  key={c.id}
                  type="button"
                  data-chapitre={c.numero}
                  data-actif={actif ? 'true' : 'false'}
                  aria-label={`Chapitre ${String(c.numero).padStart(2, '0')} — ${c.titre}`}
                  aria-pressed={actif}
                  onClick={() => onChapitre(new Date(date.getFullYear(), date.getMonth(), date.getDate() + (c.numero - chapitreActif)))}
                  className="group flex flex-1 flex-col items-center gap-1.5"
                >
                  <span
                    className={`block h-[3px] w-full rounded-full transition-all duration-500 ${
                      actif ? 'bg-[#00FF88]' : 'bg-white/20 group-hover:bg-white/50'
                    }`}
                  />
                  <span
                    className={`font-mono text-[9px] uppercase tracking-[0.12em] transition ${
                      actif ? 'text-white' : 'text-white/35 group-hover:text-white/70'
                    }`}
                  >
                    {String(c.numero).padStart(2, '0')}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Les deux flèches, et le compte : la même navigation, au clic. */}
          <div className="pointer-events-auto mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onPrecedent}
              aria-label="Le jour précédent"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white/80 backdrop-blur-md transition hover:border-white/60 hover:text-white active:scale-95"
            >
              <ChevronLeft size={17} />
            </button>
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
              <Hand size={12} /> glisser · jour {index + 1} sur {total}
            </span>
            <button
              type="button"
              onClick={onSuivant}
              aria-label="Le jour suivant"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white/80 backdrop-blur-md transition hover:border-white/60 hover:text-white active:scale-95"
            >
              <ChevronRight size={17} />
            </button>
          </div>

          <p className="mt-3 font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/40">
            {legendeDeLHeure(temps.heure)} · {temps.pilote ? 'heure choisie dans la capsule' : 'heure réelle'} · la
            capsule en bas pose les aiguilles
          </p>
          <p className="mt-1.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/30">
            {temps.etiquette} · la barre du bas porte les visuels et la timeline
          </p>
        </div>
      </div>
    </header>
  );
}
