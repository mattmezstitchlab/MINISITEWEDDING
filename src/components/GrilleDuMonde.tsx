/* LA GRILLE DU MONDE — L'ÉCRAN ENTIER, ET RIEN D'AUTRE
 *
 * Ce n'est pas une timeline posée en bas d'une page : **la grille est toute
 * l'interface**. Une mosaïque de cases carrées, bord à bord, qu'on parcourt
 * dans les deux sens — horizontalement, verticalement — et dans laquelle on
 * entre : une case qui contient quelque chose **s'ouvre sur une autre grille**.
 *
 * ```
 * monde → univers → sujet → contenu → détail
 * ```
 *
 * Trois gestes, et tout le reste en découle :
 *
 * - **glisser** : on se déplace dans le territoire (un doigt, la molette, les
 *   flèches du clavier) ;
 * - **pincer / écarter** : on change d'échelle, donc de densité — l'image
 *   seule, la date, le titre, le détail ;
 * - **choisir** : on entre dans la case, ou on la pose dans une composition.
 *
 * La grille ne décide de rien : elle montre le monde qu'on lui donne, et elle
 * rapporte ce qu'on y fait. Les mondes viennent de `grilleDuMonde`.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FAMILLES, type CaseDuMonde, type Monde } from '../lib/grilleDuMonde';
import {
  ECHELLES_DE_LA_GRILLE,
  ajustementDeRemplissage,
  borner,
  colonnesDeLaGrille,
  cranDeLEchelle,
  densiteDeLaTaille,
  echelleDuCran,
  tailleDeLaCase,
} from '../lib/echelleDeLaGrille';

export interface GrilleDuMondeProps {
  /** Le monde à montrer : ses cases, et ce qu'elles disent. */
  monde: Monde;
  /** L'échelle courante — elle appartient à la page, pour qu'on la partage. */
  echelle: number;
  onEchelle: (echelle: number) => void;
  /** On entre dans une case : la page fait le zoom, et change de monde. */
  onOuvrir?: (c: CaseDuMonde, rect: DOMRect | null) => void;
  /** La case survolée : la page en fait son aperçu. */
  onApercu?: (c: CaseDuMonde | null) => void;
  /** Les cases choisies, par leur identifiant. */
  selection?: string[];
  onSelection?: (ids: string[]) => void;
  /** Ce qu'on peut faire d'une sélection. */
  onComposer?: (ids: string[]) => void;
  onMasquer?: (ids: string[]) => void;
  onPartager?: (ids: string[]) => void;
  /** La case d'où l'on vient : la grille se centre sur elle. */
  caseActive?: string | null;
  /** Vrai pendant le retour : la grille s'efface vers le monde d'avant. */
  sortie?: boolean;
  /** Ce que la personne a masqué. */
  masquees?: string[];
  className?: string;
}

/** L'écran supposé avant la première mesure : un portable, large et bas. */
const ECRAN_SUPPOSE = { l: 1280, h: 820 };

/** Ce qu'on est en train de faire avec le doigt. */
type Geste =
  | { type: 'rien' }
  | { type: 'deplacement'; x: number; y: number; departX: number; departY: number; bouge: boolean }
  | { type: 'cadre'; departX: number; departY: number };

export default function GrilleDuMonde({
  monde,
  echelle,
  onEchelle,
  onOuvrir,
  onApercu,
  selection = [],
  onSelection,
  onComposer,
  onMasquer,
  onPartager,
  caseActive = null,
  sortie = false,
  masquees = [],
  className = '',
}: GrilleDuMondeProps) {
  const cadre = useRef<HTMLDivElement>(null);
  const refs = useRef(new Map<string, HTMLButtonElement>());
  const geste = useRef<Geste>({ type: 'rien' });
  const points = useRef(new Map<number, { x: number; y: number }>());
  const pincement = useRef<{ distance: number; echelle: number } | null>(null);
  /** La case sous le doigt : c'est elle qu'on ouvrira, si le doigt ne bouge pas. */
  const caseDuGeste = useRef<CaseDuMonde | null>(null);

  const [tailleEcran, setTailleEcran] = useState({ l: 0, h: 0 });
  /** Le déplacement voulu par la personne ; `null` = la grille se pose seule. */
  const [panVoulu, setPanVoulu] = useState<{ x: number; y: number } | null>(null);
  const [modeSelection, setModeSelection] = useState(false);
  const [cadreDeSelection, setCadreDeSelection] = useState<{ x0: number; y0: number; x1: number; y1: number } | null>(null);

  /* ————————————————————————— LA MESURE DE L'ÉCRAN ————————————————————————— */

  useLayoutEffect(() => {
    const el = cadre.current;
    if (!el) return;
    const mesurer = () => setTailleEcran({ l: el.clientWidth, h: el.clientHeight });
    mesurer();
    const observateur = new ResizeObserver(mesurer);
    observateur.observe(el);
    return () => observateur.disconnect();
  }, []);

  /* ————————————————————————— LA GÉOMÉTRIE DU MONDE ————————————————————————— */

  const cases = monde.cases.filter((c) => !masquees.includes(c.id));
  const cran = cranDeLEchelle(echelle);
  /**
   * Avant la première mesure, la grille suppose un écran : c'est ce qui la rend
   * lisible **sans navigateur**, et ce qui évite un saut au premier rendu.
   */
  const largeurEcran = tailleEcran.l || ECRAN_SUPPOSE.l;
  const hauteurEcran = tailleEcran.h || ECRAN_SUPPOSE.h;
  const colonnes = colonnesDeLaGrille(cases.length, largeurEcran, hauteurEcran);
  const lignes = Math.max(1, Math.ceil(cases.length / colonnes));
  // La taille d'une case : l'échelle, et ce qu'il faut pour couvrir l'écran.
  const taille = Math.round(
    tailleDeLaCase(echelle) * ajustementDeRemplissage(colonnes, lignes, largeurEcran, hauteurEcran),
  );
  // La densité se lit sur la taille réelle, jamais sur l'échelle.
  const densite = densiteDeLaTaille(taille);
  const largeur = colonnes * taille;
  const hauteurGrille = lignes * taille;

  /** Le déplacement est tenu dans la grille : on ne se perd jamais dehors. */
  const contenir = useCallback(
    (p: { x: number; y: number }) => {
      const margeX = Math.max(0, largeur - largeurEcran);
      const margeY = Math.max(0, hauteurGrille - hauteurEcran);
      return {
        x: largeur <= largeurEcran ? Math.round((largeurEcran - largeur) / 2) : Math.min(0, Math.max(-margeX, p.x)),
        y: hauteurGrille <= hauteurEcran ? Math.round((hauteurEcran - hauteurGrille) / 2) : Math.min(0, Math.max(-margeY, p.y)),
      };
    },
    [hauteurEcran, hauteurGrille, largeur, largeurEcran],
  );

  /**
   * **Où la grille se pose.** Si personne n'a encore touché au déplacement,
   * elle se centre : sur la case d'où l'on vient quand il y en a une, sur le
   * monde sinon. Dès qu'un doigt bouge, c'est la personne qui décide.
   */
  const rangActif = caseActive ? cases.findIndex((c) => c.id === caseActive) : -1;
  const poseParDefaut = contenir({
    x: largeurEcran / 2 - ((rangActif > 0 ? rangActif % colonnes : (colonnes - 1) / 2) + 0.5) * taille,
    y: hauteurEcran / 2 - ((rangActif > 0 ? Math.floor(rangActif / colonnes) : (lignes - 1) / 2) + 0.5) * taille,
  });
  const pan = panVoulu ? contenir(panVoulu) : poseParDefaut;

  const deplacer = useCallback(
    (suivant: { x: number; y: number } | ((p: { x: number; y: number }) => { x: number; y: number })) => {
      setPanVoulu((precedent) => {
        const base = precedent ? contenir(precedent) : poseParDefaut;
        return contenir(typeof suivant === 'function' ? suivant(base) : suivant);
      });
    },
    [contenir, poseParDefaut],
  );

  /* ——————————————————————————— LE ZOOM ——————————————————————————— */

  /** On zoome **sous le doigt** : le point touché ne bouge pas d'un pixel. */
  const zoomer = useCallback(
    (voulue: number, cx?: number, cy?: number) => {
      const nouvelle = borner(voulue);
      if (Math.abs(nouvelle - echelle) >= 0.001) {
        const x = cx ?? largeurEcran / 2;
        const y = cy ?? hauteurEcran / 2;
        const rapport = nouvelle / echelle;
        deplacer((p) => ({ x: x - (x - p.x) * rapport, y: y - (y - p.y) * rapport }));
        onEchelle(nouvelle);
      }
    },
    [deplacer, echelle, hauteurEcran, largeurEcran, onEchelle],
  );

  /* ——————————————————— LA MOLETTE, LE PINCE, LES TOUCHES ——————————————————— */

  /** Les gestes du dernier rendu : les écouteurs, eux, ne se reposent jamais. */
  const boite = useRef({ zoomer, deplacer, echelle, selection, onSelection });
  useEffect(() => {
    boite.current = { zoomer, deplacer, echelle, selection, onSelection };
  });

  useEffect(() => {
    const el = cadre.current;
    if (!el) return;
    const surMolette = (e: WheelEvent) => {
      e.preventDefault();
      const { zoomer: z, deplacer: d, echelle: é } = boite.current;
      if (e.ctrlKey || e.metaKey) {
        const rect = el.getBoundingClientRect();
        z(é * (e.deltaY < 0 ? 1.08 : 1 / 1.08), e.clientX - rect.left, e.clientY - rect.top);
        return;
      }
      // La molette déplace : verticalement, et horizontalement avec `Maj`.
      const dx = e.shiftKey ? e.deltaY : e.deltaX;
      const dy = e.shiftKey ? 0 : e.deltaY;
      d((p) => ({ x: p.x - dx, y: p.y - dy }));
    };
    el.addEventListener('wheel', surMolette, { passive: false });
    return () => el.removeEventListener('wheel', surMolette);
  }, []);

  useEffect(() => {
    const surTouche = (e: KeyboardEvent) => {
      const cible = e.target as HTMLElement | null;
      if (cible && ['INPUT', 'TEXTAREA', 'SELECT'].includes(cible.tagName)) return;
      const { zoomer: z, deplacer: d, echelle: é } = boite.current;
      const pas = 140;
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        z(é * 1.15);
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        z(é / 1.15);
      } else if (/^[1-5]$/.test(e.key)) {
        z(echelleDuCran(Number(e.key)));
      } else if (e.key.startsWith('Arrow')) {
        e.preventDefault();
        const dx = e.key === 'ArrowLeft' ? pas : e.key === 'ArrowRight' ? -pas : 0;
        const dy = e.key === 'ArrowUp' ? pas : e.key === 'ArrowDown' ? -pas : 0;
        d((p) => ({ x: p.x + dx, y: p.y + dy }));
      }
    };
    window.addEventListener('keydown', surTouche);
    return () => window.removeEventListener('keydown', surTouche);
  }, []);

  /* ——————————————————————————— LE DOIGT ——————————————————————————— */

  const surBas = (e: React.PointerEvent) => {
    points.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (points.current.size === 2) {
      const [a, b] = [...points.current.values()];
      pincement.current = { distance: Math.hypot(a!.x - b!.x, a!.y - b!.y), echelle };
      geste.current = { type: 'rien' };
      return;
    }
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const idSousLeDoigt = (e.target as HTMLElement).closest('[data-case]')?.getAttribute('data-case');
    caseDuGeste.current = cases.find((c) => c.id === idSousLeDoigt) ?? null;
    const surUneCase = (e.target as HTMLElement).closest('[data-case]');
    if (modeSelection && !surUneCase) {
      geste.current = { type: 'cadre', departX: e.clientX, departY: e.clientY };
      setCadreDeSelection({ x0: e.clientX, y0: e.clientY, x1: e.clientX, y1: e.clientY });
      return;
    }
    geste.current = { type: 'deplacement', x: e.clientX, y: e.clientY, departX: e.clientX, departY: e.clientY, bouge: false };
  };

  const surBouge = (e: React.PointerEvent) => {
    if (points.current.has(e.pointerId)) points.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // Deux doigts : c'est le pincement qui parle.
    if (points.current.size >= 2 && pincement.current) {
      const [a, b] = [...points.current.values()];
      const distance = Math.hypot(a!.x - b!.x, a!.y - b!.y);
      const rapport = distance / (pincement.current.distance || distance);
      const rect = cadre.current?.getBoundingClientRect();
      zoomer(
        pincement.current.echelle * rapport,
        (a!.x + b!.x) / 2 - (rect?.left ?? 0),
        (a!.y + b!.y) / 2 - (rect?.top ?? 0),
      );
      return;
    }

    const g = geste.current;
    if (g.type === 'deplacement') {
      const dx = e.clientX - g.x;
      const dy = e.clientY - g.y;
      if (Math.abs(e.clientX - g.departX) > 4 || Math.abs(e.clientY - g.departY) > 4) g.bouge = true;
      geste.current = { ...g, x: e.clientX, y: e.clientY };
      deplacer((p) => ({ x: p.x + dx, y: p.y + dy }));
      return;
    }
    if (g.type === 'cadre') {
      setCadreDeSelection({ x0: g.departX, y0: g.departY, x1: e.clientX, y1: e.clientY });
    }
  };

  const surHaut = (e: React.PointerEvent) => {
    points.current.delete(e.pointerId);
    if (points.current.size < 2) pincement.current = null;
    const g = geste.current;

    // **Le clic est rattrapé ici** : la capture du doigt fait passer le `click`
    // au cadre, pas à la case. Un doigt qui n'a pas bougé ouvre donc la case
    // sous lui — et c'est la même règle au doigt, à la souris et au stylet.
    if (g.type === 'deplacement' && !g.bouge && caseDuGeste.current) {
      choisir(caseDuGeste.current, e);
      caseDuGeste.current = null;
      geste.current = { type: 'rien' };
      return;
    }

    if (g.type === 'cadre' && cadreDeSelection) {
      // Le cadre devient une sélection : on prend tout ce qu'il touche.
      const rect = cadre.current?.getBoundingClientRect();
      const x0 = Math.min(cadreDeSelection.x0, cadreDeSelection.x1) - (rect?.left ?? 0);
      const x1 = Math.max(cadreDeSelection.x0, cadreDeSelection.x1) - (rect?.left ?? 0);
      const y0 = Math.min(cadreDeSelection.y0, cadreDeSelection.y1) - (rect?.top ?? 0);
      const y1 = Math.max(cadreDeSelection.y0, cadreDeSelection.y1) - (rect?.top ?? 0);
      const col0 = Math.max(0, Math.floor((x0 - pan.x) / taille));
      const col1 = Math.min(colonnes - 1, Math.floor((x1 - pan.x) / taille));
      const lig0 = Math.max(0, Math.floor((y0 - pan.y) / taille));
      const lig1 = Math.min(lignes - 1, Math.floor((y1 - pan.y) / taille));
      const pris = new Set(selection);
      for (let l = lig0; l <= lig1; l += 1) {
        for (let c = col0; c <= col1; c += 1) {
          const kase = cases[l * colonnes + c];
          if (kase) pris.add(kase.id);
        }
      }
      onSelection?.([...pris]);
      setCadreDeSelection(null);
    }

    geste.current = { type: 'rien' };
  };

  /* —————————————————————— LE CLIC : ENTRER OU CHOISIR —————————————————————— */

  const choisir = (
    c: CaseDuMonde,
    e: { shiftKey: boolean; metaKey: boolean; ctrlKey: boolean },
  ) => {
    const g = geste.current;
    if (g.type === 'deplacement' && g.bouge) return;
    const multiple = modeSelection || e.shiftKey || e.metaKey || e.ctrlKey;
    if (multiple) {
      const dedans = selection.includes(c.id);
      onSelection?.(dedans ? selection.filter((id) => id !== c.id) : [...selection, c.id]);
      return;
    }
    if (selection.length) onSelection?.([]);
    onOuvrir?.(c, refs.current.get(c.id)?.getBoundingClientRect() ?? null);
  };

  /* —————————————————————— CE QU'ON DESSINE VRAIMENT —————————————————————— */

  const col0 = Math.max(0, Math.floor(-pan.x / taille) - 1);
  const colN = Math.min(colonnes - 1, Math.ceil((-pan.x + largeurEcran) / taille));
  const lig0 = Math.max(0, Math.floor(-pan.y / taille) - 1);
  const ligN = Math.min(lignes - 1, Math.ceil((-pan.y + hauteurEcran) / taille));

  const visibles: Array<{ kase: CaseDuMonde; x: number; y: number }> = [];
  for (let l = lig0; l <= ligN; l += 1) {
    for (let c = col0; c <= colN; c += 1) {
      const kase = cases[l * colonnes + c];
      if (kase) visibles.push({ kase, x: c * taille, y: l * taille });
    }
  }

  const unite = Math.max(8, Math.round(taille * 0.072));

  return (
    <div
      ref={cadre}
      data-grille="du-monde"
      data-monde={monde.id}
      data-densite={densite}
      data-cran={cran}
      data-cases={cases.length}
      data-selection={modeSelection ? 'arme' : 'libre'}
      data-sortie={sortie ? 'true' : 'false'}
      className={`relative isolate h-full w-full touch-none select-none overflow-hidden overscroll-none ${className}`}
      onPointerDown={surBas}
      onPointerMove={surBouge}
      onPointerUp={surHaut}
      onPointerCancel={surHaut}
      onPointerLeave={() => onApercu?.(null)}
    >
      {/* ————————————— LA GRILLE, ET SON DÉPLACEMENT ————————————— */}
      <div
        data-surface="grille"
        className="absolute left-0 top-0"
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0)`,
          width: largeur,
          height: hauteurGrille,
          opacity: sortie ? 0 : 1,
          transition: 'opacity 420ms ease',
        }}
      >
        {visibles.map(({ kase, x, y }) => {
          const choisi = selection.includes(kase.id);
          const actif = caseActive === kase.id;
          const image = kase.image ?? null;
          const marque = FAMILLES.find((f) => f.id === kase.famille);
          return (
            <button
              key={kase.id}
              ref={(el) => {
                if (el) refs.current.set(kase.id, el);
                else refs.current.delete(kase.id);
              }}
              type="button"
              data-case={kase.id}
              data-densite={densite}
              data-module={kase.module}
              data-famille={kase.famille}
              data-choisi={choisi ? 'true' : 'false'}
              data-actif={actif ? 'true' : 'false'}
              data-porte={kase.ouvre ? 'true' : 'false'}
              aria-label={`${kase.surTitre ?? ''} ${kase.titre}`.trim()}
              /* Au clavier seulement : au doigt, c'est `surHaut` qui décide. */
              onClick={(e) => {
                if (e.detail === 0) choisir(kase, e);
              }}
              onMouseEnter={() => onApercu?.(kase)}
              onFocus={() => onApercu?.(kase)}
              className="absolute block overflow-hidden text-left outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              style={{
                left: x,
                top: y,
                width: taille,
                height: taille,
                background: kase.couleur,
                color: kase.encre ?? '#F4F5FB',
              }}
            >
              {image ? (
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ filter: densite >= 3 ? 'brightness(0.88)' : 'none' }}
                />
              ) : (
                <span
                  aria-hidden="true"
                  data-initiales="vrai"
                  className="absolute inset-0 flex items-center justify-center font-mono"
                  style={{ fontSize: Math.round(taille * 0.2), opacity: 0.14, letterSpacing: '0.04em' }}
                >
                  {kase.titre.slice(0, 2).toUpperCase()}
                </span>
              )}

              {densite >= 2 && (
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
              )}

              {/* La tête de lecture : un trait blanc, trois pixels, et rien d'autre. */}
              {actif && <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-white" />}

              <span className="relative flex h-full flex-col justify-end gap-1 p-1.5">
                {densite >= 2 && kase.surTitre && (
                  <span className="font-mono uppercase leading-none tracking-[0.14em] text-white/70" style={{ fontSize: Math.max(8, unite - 1) }}>
                    {kase.surTitre}
                  </span>
                )}
                {densite >= 3 && (
                  <span className="vp-title leading-[0.95] text-white" style={{ fontSize: Math.round(taille * 0.15), letterSpacing: '-0.02em' }}>
                    {kase.titre}
                  </span>
                )}
                {densite >= 4 && kase.sousTitre && (
                  <span className="line-clamp-2 text-white/65" style={{ fontSize: unite, lineHeight: 1.25 }}>
                    {kase.sousTitre}
                  </span>
                )}
                {densite >= 5 && kase.detail && kase.detail.length > 0 && (
                  <span className="mt-1 flex flex-col gap-0.5 border-t border-white/20 pt-1">
                    {kase.detail.slice(0, 3).map((ligne) => (
                      <span key={ligne.label} className="flex items-baseline gap-1.5 truncate">
                        <span className="font-mono uppercase tracking-[0.12em] text-white/40" style={{ fontSize: Math.max(7, unite - 1) }}>
                          {ligne.label}
                        </span>
                        <span className="truncate text-white/80" style={{ fontSize: unite }}>
                          {ligne.valeur}
                        </span>
                      </span>
                    ))}
                  </span>
                )}
              </span>

              {/* L'ouverture : la marque des droits, minuscule, et jamais pour tous. */}
              {densite >= 4 && kase.famille !== 'public' && (
                <span
                  aria-hidden="true"
                  title={marque?.mot}
                  className="absolute bottom-1 right-1 font-mono leading-none text-white/45"
                  style={{ fontSize: Math.max(7, unite - 1) }}
                >
                  {marque?.marque}
                </span>
              )}

              {choisi && <span aria-hidden="true" className="pointer-events-none absolute inset-0 ring-2 ring-inset ring-white" />}
            </button>
          );
        })}
      </div>

      {/* ————————————— LE CADRE DE SÉLECTION ————————————— */}
      {cadreDeSelection && (
        <span
          aria-hidden="true"
          data-cadre="selection"
          className="pointer-events-none fixed border border-white/70 bg-white/10"
          style={{
            left: Math.min(cadreDeSelection.x0, cadreDeSelection.x1),
            top: Math.min(cadreDeSelection.y0, cadreDeSelection.y1),
            width: Math.abs(cadreDeSelection.x1 - cadreDeSelection.x0),
            height: Math.abs(cadreDeSelection.y1 - cadreDeSelection.y0),
          }}
        />
      )}

      {/* ————————————— LE MONDE QU'ON PARCOURT ————————————— */}
      <div className="pointer-events-none absolute left-3 top-3 sm:left-5 sm:top-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">
          {monde.titre} · {monde.sous}
        </span>
      </div>

      {/* ————————————— LA SÉLECTION : UN BOUTON, PUIS DES GESTES ————————————— */}
      <button
        type="button"
        aria-label={modeSelection ? 'Quitter la sélection' : 'Sélectionner plusieurs cases'}
        aria-pressed={modeSelection}
        onClick={() => {
          setModeSelection((m) => !m);
          if (modeSelection) onSelection?.([]);
        }}
        className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center border font-mono text-[13px] leading-none backdrop-blur-sm transition sm:right-5 sm:top-4"
        style={
          modeSelection
            ? { background: 'rgba(255,255,255,0.92)', color: '#0B0C12', borderColor: 'rgba(255,255,255,0.9)' }
            : { background: 'rgba(11,12,18,0.45)', color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.25)' }
        }
      >
        {modeSelection ? '✓' : '+'}
      </button>

      {/* ————————————— L'ÉCHELLE : CINQ CRANS, À DROITE ————————————— */}
      <div className="absolute right-3 top-1/2 flex -translate-y-1/2 flex-col items-end gap-1.5 sm:right-5">
        {ECHELLES_DE_LA_GRILLE.map((valeur, i) => {
          const c = i + 1;
          return (
            <button
              key={valeur}
              type="button"
              data-cran-grille={c}
              data-actif={c === cran ? 'true' : 'false'}
              aria-label={`Échelle ${c} sur 5`}
              aria-pressed={c === cran}
              onClick={() => zoomer(echelleDuCran(c))}
              className="group flex h-4 items-center justify-end pr-0.5"
            >
              <span
                aria-hidden="true"
                className="block h-[2px] transition-all"
                style={{ width: c === cran ? 22 : 12, background: c === cran ? '#FFFFFF' : 'rgba(255,255,255,0.35)' }}
              />
            </button>
          );
        })}
      </div>

      {/* ————————————— LA BARRE DE SÉLECTION ————————————— */}
      {selection.length > 0 && (
        <div
          data-barre="selection"
          className="absolute bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 flex -translate-x-1/2 items-center gap-1 border border-white/15 bg-[#0B0C12]/80 px-2 py-1.5 backdrop-blur-md"
        >
          <span className="px-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
            {selection.length} case{selection.length > 1 ? 's' : ''}
          </span>
          {[
            { mot: 'composer', action: () => onComposer?.(selection) },
            { mot: 'masquer', action: () => onMasquer?.(selection) },
            { mot: 'partager', action: () => onPartager?.(selection) },
            { mot: 'effacer', action: () => onSelection?.([]) },
          ].map((bouton) => (
            <button
              key={bouton.mot}
              type="button"
              data-action={bouton.mot}
              onClick={bouton.action}
              className="px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              {bouton.mot}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
