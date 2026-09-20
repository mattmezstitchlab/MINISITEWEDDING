import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MARQUE_MAGAZINE } from '../lib/aimeMagazine';
import { composerEdition } from '../lib/aimeMoteur';
import { MOIS_LONGS } from '../lib/calendrier';
import {
  choisirMoment, HEURE_DES_MOMENTS, heureDeLaCapsule, MOMENTS_DE_LA_CAPSULE,
} from '../lib/capsuleCommande';
import {
  FAMILLES,
  MODULES_DE_COMPOSITION,
  MINI_SITE_INVITE,
  MINI_SITE_PRESTATAIRE,
  composerLeMiniSite,
  casesParIds,
  cleDuJour,
  moduleDeComposition,
  mondeDeLId,
  mondeEnCache,
  mondeDuMiniSite,
  type BlocDeMiniSite,
  type CaseDuMonde,
  type Famille,
} from '../lib/grilleDuMonde';
import { echelleDuCran } from '../lib/echelleDeLaGrille';
import { lumiereDeLHeure } from '../lib/lumiereDuJour';
import { publierImmersif } from '../lib/modeImmersif';
import { partDeLHeure } from '../lib/moments';
import { roleDuneAdresse } from '../lib/personaSuites';
import { usePersonaCourante } from '../lib/personaCourant';
import { magazineDeLaDate, niveauxDuJour } from '../lib/semaines';
import { visuelsDuJour } from '../lib/visuelsDuMagazine';
import CadranDuMagazine from '../components/CadranDuMagazine';
import ChampDuMagazine from '../components/ChampDuMagazine';
import EditionSemaine from '../components/EditionSemaine';
import Feuille from '../components/Feuille';
import GalerieCouvertures from '../components/GalerieCouvertures';
import GrilleDuMonde from '../components/GrilleDuMonde';
import MiseEnLumiere from '../components/MiseEnLumiere';
import SceneEditoriale from '../components/SceneEditoriale';

/**
 * AIME MAGAZINE — LA GRILLE COMME APPLICATION
 *
 * ```
 * ┌────────────────────────────────────────────────────────────┐
 * │ 20 SEPTEMBRE          la scène : l'image, et trois lignes   │
 * │ Septembre doré                                              │
 * │ ┌────┬────┬────┬────┬────┬────┬────┬────┐                  │
 * │ │IMG │IMG │IMG │IMG │IMG │IMG │IMG │IMG │  la grille       │
 * │ ├────┼────┼────┼────┼────┼────┼────┼────┤  du monde        │
 * │ │IMG │IMG │IMG │IMG │IMG │IMG │IMG │IMG │                  │
 * │ └────┴────┴────┴────┴────┴────┴────┴────┘                  │
 * └────────────────────────────────────────────────────────────┘
 * ```
 *
 * **Il n'y a plus de page : il y a un espace.** La grille prend tout l'écran,
 * elle se parcourt dans les deux sens, et chaque case ouvre un monde — un jour,
 * un univers, un morceau, un objet, un métier, une personne. Le zoom change la
 * densité : l'image, la date, le titre, le détail. Cliquer sur une case, c'est
 * y entrer ; la grille suivante vient de la même famille.
 *
 * La scène ne disparaît pas : elle **passe derrière**. C'est l'image de la case
 * qu'on regarde, et les interstices de la grille la laissent voir. Entre la
 * grille et la scène, rien : ni panneau, ni menu, ni dashboard.
 *
 * Tout le reste s'ouvre à la demande : l'éditeur (et ses trois temps de
 * lecture), la collection des 54 magazines, la mise en lumière, et la
 * **composition** — ce qu'on fait d'une sélection de cases.
 */

type FeuilleOuverte = null | 'editeur' | 'collection' | 'profil' | 'composer';

/** **La feuille de l'adresse** : `?feuille=editeur` ouvre l'éditeur en arrivant. */
function feuilleDeLAdresse(valeur: string | null): FeuilleOuverte {
  return valeur === 'editeur' || valeur === 'collection' || valeur === 'profil' || valeur === 'composer' ? valeur : null;
}

/** **Les cases de l'adresse** : `?cases=jour-09-20,musique` — ce qu'on a choisi. */
function casesDeLAdresse(valeur: string | null): string[] {
  return (valeur ?? '').split(',').map((id) => id.trim()).filter(Boolean);
}

/** La date, comme sur une couverture : « 20 SEPTEMBRE ». */
function dateCapitale(date: Date): string {
  return `${date.getDate()} ${MOIS_LONGS[date.getMonth()]!.toUpperCase()}`;
}

/** **Le jour de l'adresse** : `?jour=09-21`, ou aujourd'hui. */
function jourDeLAdresse(valeur: string | null): Date {
  const [m, q] = (valeur ?? '').split('-').map(Number);
  if (m && q) return new Date(new Date().getFullYear(), m - 1, q, 12);
  return new Date();
}

/** **Le cran de l'adresse** : `?niveau=3`, ou le troisième — on voit, on lit. */
function cranDeLAdresse(valeur: string | null): number {
  const n = Number(valeur);
  return n >= 1 && n <= 5 ? n : 3;
}

/** **Le monde de l'adresse** : `?monde=annee`, ou le jour qu'elle annonce. */
function mondeDeLAdresse(params: URLSearchParams): string {
  const monde = params.get('monde');
  if (monde) return monde;
  const jour = params.get('jour');
  return jour ? `jour-${cleDuJour(jourDeLAdresse(jour))}` : 'monde';
}

export default function Magazine() {
  const [params] = useSearchParams();
  const role = roleDuneAdresse(params.get('role'));
  const moi = usePersonaCourante();
  const roleId = role?.id ?? moi.id;

  const [date] = useState(() => jourDeLAdresse(params.get('jour')));

  /** **Où l'on est** : le monde ouvert, et le chemin qui y a mené. */
  const [mondeId, setMondeId] = useState(() => mondeDeLAdresse(params));
  const [chemin, setChemin] = useState<Array<{ id: string; titre: string }>>(() => {
    const depart = mondeDeLAdresse(params);
    return depart === 'monde' ? [] : [{ id: depart, titre: '' }];
  });
  const [echelle, setEchelle] = useState(() => echelleDuCran(cranDeLAdresse(params.get('niveau'))));
  const [selection, setSelection] = useState<string[]>(() => casesDeLAdresse(params.get('cases')));
  const [masquees, setMasquees] = useState<string[]>([]);
  const [feuille, setFeuille] = useState<FeuilleOuverte>(() => feuilleDeLAdresse(params.get('feuille')));
  const [apercu, setApercu] = useState<CaseDuMonde | null>(null);
  const [entree, setEntree] = useState<{ kase: CaseDuMonde; rect: DOMRect | null } | null>(null);
  const [sortie, setSortie] = useState(false);
  /** La composition : les cases que l'adresse apporte, ou celles qu'on choisit. */
  const [blocs, setBlocs] = useState<BlocDeMiniSite[]>(() => {
    const choisies = casesDeLAdresse(params.get('cases'));
    if (!choisies.length) return [];
    return composerLeMiniSite(
      choisies.filter((id) => moduleDeComposition(id)),
      casesParIds(choisies, jourDeLAdresse(params.get('jour'))),
    );
  });
  const [familles, setFamilles] = useState<Record<string, Famille>>({});
  const [avis, setAvis] = useState<string | null>(null);

  /** Le temps de lecture de l'édition, dans la feuille de l'éditeur. */
  const [temps, setTemps] = useState<'passe' | 'present' | 'futur'>('present');

  /* ——————————————————————— LA PAGE EST IMMERSIVE ——————————————————————— */

  useEffect(() => {
    publierImmersif(true);
    return () => publierImmersif(false);
  }, []);

  /** L'heure regardée : une case touchée, le moment de l'adresse, la capsule. */
  const heure =
    ((params.get('moment') ? HEURE_DES_MOMENTS[params.get('moment')!] : undefined) ?? heureDeLaCapsule()) as number;
  const lumiere = lumiereDeLHeure(heure);
  const magazine = magazineDeLaDate(date);
  const niveaux = niveauxDuJour(date);
  const visuels = visuelsDuJour(date);
  const accent = magazine.palette.accent;

  /** L'édition composée : ses vingt-quatre pages, une par heure. */
  const edition = composerEdition({ numero: magazine.numero, temps, roleId });

  /* ————————————————————————— LE MONDE COURANT ————————————————————————— */

  /**
   * Le monde se construit une fois par état : la clé porte le monde, le jour, et
   * la composition. On peut donc la recalculer à chaque image sans rien payer.
   */
  const cleDuMonde = `${mondeId}|${cleDuJour(date)}|${blocs.map((b) => `${b.id}:${b.famille}`).join(',')}`;
  const monde = mondeEnCache(cleDuMonde, () => {
    // Un mini-site sans bloc n'est pas un monde : on rouvre l'ouverture.
    if (mondeId === 'mini-site') {
      return blocs.length ? mondeDuMiniSite(blocs, titreDuMiniSite(blocs)) : mondeDeLId('monde', date);
    }
    return mondeDeLId(mondeId, date);
  });

  /** On choisit une heure : la capsule suit, et le cadran avec elle. */
  const choisirHeure = (h: number) => {
    const part = partDeLHeure(h);
    choisirMoment(MOMENTS_DE_LA_CAPSULE.includes(part.id) ? part.id : null);
  };

  /* —————————————————————————— ENTRER, SORTIR —————————————————————————— */

  const entrer = (kase: CaseDuMonde, rect: DOMRect | null) => {
    const heureDeLaCase = /^heure-(\d{1,2})$/.exec(kase.id);
    if (heureDeLaCase) choisirHeure(Number.parseInt(heureDeLaCase[1]!, 10));
    const ouvre = kase.ouvre;
    if (!ouvre) return;
    setEntree({ kase, rect });
    window.setTimeout(() => {
      setChemin((c) => [...c, { id: ouvre, titre: kase.titre }]);
      setMondeId(ouvre);
      setApercu(null);
      setEntree(null);
    }, 430);
  };

  const remonter = () => {
    if (chemin.length === 0) return;
    setSortie(true);
    const precedent = chemin.length > 1 ? chemin[chemin.length - 2]!.id : 'monde';
    window.setTimeout(() => {
      setChemin((c) => c.slice(0, -1));
      setMondeId(precedent);
      setSortie(false);
      setApercu(null);
    }, 320);
  };

  /* ——————————————————————— LES GESTES DE LA PAGE ——————————————————————— */

  /** Le retour du dernier rendu : l'écoute clavier, elle, ne se repose jamais. */
  const retour = useRef(remonter);
  useEffect(() => {
    retour.current = remonter;
  });

  useEffect(() => {
    const surTouche = (e: KeyboardEvent) => {
      const cible = e.target as HTMLElement | null;
      if (cible && ['INPUT', 'TEXTAREA', 'SELECT'].includes(cible.tagName)) return;
      if (e.key !== 'Escape') return;
      if (feuille) return; // la feuille ferme la première
      if (selection.length) {
        setSelection([]);
        return;
      }
      retour.current();
    };
    window.addEventListener('keydown', surTouche);
    return () => window.removeEventListener('keydown', surTouche);
  }, [feuille, selection.length]);

  /* —————————————————————— LA COMPOSITION —————————————————————— */

  const composer = (ids: string[]) => {
    const choisies = monde.cases.filter((c) => ids.includes(c.id));
    setBlocs((actuels) => {
      const modules = actuels.filter((b) => b.id.startsWith('module-')).map((b) => b.id.replace('module-', ''));
      return composerLeMiniSite(modules, choisies, familles);
    });
    setFeuille('composer');
  };

  /** Partager une sélection : l'adresse la porte, et rien d'autre. */
  const partager = (ids: string[]) => {
    const adresse = `${window.location.origin}/magazine?monde=${mondeId}&cases=${ids.join(',')}`;
    void navigator.clipboard?.writeText(adresse);
    setAvis(`${ids.length} cases — le lien est copié`);
    window.setTimeout(() => setAvis(null), 2600);
  };

  /* ——————————————————————————— L'ÉCRAN ——————————————————————————— */

  const scene = apercu
    ? {
        date: apercu.surTitre ?? monde.titre,
        titre: apercu.titre,
        moment: apercu.sousTitre ?? monde.sous,
        image: apercu.image ?? null,
        accent: apercu.couleur,
      }
    : {
        date: `${dateCapitale(date)} · ${niveaux.magazine}`,
        titre: niveaux.titreDuMagazine,
        moment: niveaux.titreDuChapitre.toUpperCase(),
        image: visuels.imageDuChapitre.url ?? visuels.couverture.url,
        accent,
      };

  return (
    <div data-page="magazine" className="relative h-svh w-full overflow-hidden bg-[#0B0C12] text-white">
      {/* ————————— LA SCÈNE : L'IMAGE, DERRIÈRE LA GRILLE ————————— */}
      <SceneEditoriale
        className="absolute inset-0 z-0"
        date={scene.date}
        titre={scene.titre}
        moment={scene.moment}
        image={scene.image}
        heure={heure}
        clarte={lumiere.clarte}
        voile={lumiere.voile}
        alpha={lumiere.alpha}
        accent={scene.accent}
        cadran={
          <CadranDuMagazine
            heure={heure}
            chapitre={niveaux.numeroDeChapitre}
            fond="#0B0C12"
            encre="#F3F1ED"
            accent={accent}
            vignette
            className="h-9 w-9"
          />
        }
      />
      <span aria-hidden="true" className="absolute inset-0 z-[1] bg-[#0B0C12]/78" />

      {/* ————————— LA GRILLE : TOUT L'ÉCRAN ————————— */}
      <div
        className="relative z-10 h-full w-full"
        style={{
          opacity: sortie ? 0 : 1,
          transform: sortie ? 'scale(0.94)' : 'none',
          transition: 'opacity 300ms ease, transform 340ms cubic-bezier(.22,.9,.24,1)',
        }}
      >
        <GrilleDuMonde
          monde={monde}
          echelle={echelle}
          onEchelle={(e) => setEchelle(e)}
          onOuvrir={entrer}
          onApercu={setApercu}
          selection={selection}
          onSelection={setSelection}
          onComposer={composer}
          onMasquer={(ids) => {
            setMasquees((m) => [...new Set([...m, ...ids])]);
            setSelection([]);
          }}
          onPartager={partager}
          masquees={masquees}
          sortie={sortie}
        />
      </div>

      {/* ————————— LES PORTES : L'ÉDITEUR, LA COLLECTION, LE PROFIL ————————— */}
      <div className="absolute right-12 top-3 z-20 flex flex-col items-end gap-1 sm:right-14 sm:top-4">
        {([
          ['editeur', 'l’éditeur'],
          ['collection', 'la collection'],
          ['profil', 'votre profil'],
        ] as const).map(([id, mot]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFeuille(id)}
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55 transition hover:text-white"
          >
            {mot}
          </button>
        ))}
        <span className="mt-1 max-w-[16ch] text-right font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
          {role ? `choisi pour ${role.nom.toLowerCase()}` : `${MARQUE_MAGAZINE} · 54 · 7 · 365`}
        </span>
      </div>

      {/* ————————— LE CHEMIN : OÙ L'ON EST, ET D'OÙ L'ON VIENT ————————— */}
      <div data-chemin="monde" className="absolute bottom-3 left-3 z-20 flex flex-wrap items-center gap-1.5 pr-24 sm:left-5">
        {[{ id: 'monde', titre: 'LE MONDE' }, ...chemin].map((etape, i) => (
          <span key={`${etape.id}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <span className="font-mono text-[9px] text-white/30">›</span>}
            <button
              type="button"
              onClick={() => {
                setChemin(chemin.slice(0, i));
                setMondeId(etape.id);
              }}
              className={`font-mono text-[10px] uppercase tracking-[0.18em] transition ${
                i === chemin.length ? 'text-white/80' : 'text-white/40 hover:text-white/80'
              }`}
            >
              {etape.titre || 'le monde'}
            </button>
          </span>
        ))}
        {masquees.length > 0 && (
          <button
            type="button"
            onClick={() => setMasquees([])}
            className="ml-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 transition hover:text-white"
          >
            {masquees.length} masquée{masquees.length > 1 ? 's' : ''} · tout revoir
          </button>
        )}
      </div>

      {/* ————————— L'AVIS : CE QUI VIENT DE SE PASSER ————————— */}
      {avis && (
        <span
          data-avis="magazine"
          className="absolute bottom-14 left-1/2 z-30 -translate-x-1/2 border border-white/15 bg-[#0B0C12]/85 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/75 backdrop-blur-md"
        >
          {avis}
        </span>
      )}

      {/* ————————— LE ZOOM : LA CASE DEVIENT L'ÉCRAN ————————— */}
      {entree && <ZoomDEntree kase={entree.kase} rect={entree.rect} />}

      {/* ————————— LES FEUILLES ————————— */}
      <Feuille
        ouverte={feuille === 'editeur'}
        surtitre={MARQUE_MAGAZINE}
        titre="L’éditeur — votre magazine"
        onFermer={() => setFeuille(null)}
      >
        <ChampDuMagazine />
        <div className="mt-6 flex flex-wrap items-center gap-1.5">
          {([['passe', 'L’an dernier'], ['present', 'Cette semaine'], ['futur', 'L’an prochain']] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTemps(id)}
              aria-pressed={temps === id}
              className={`rounded-full border px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] transition ${
                temps === id ? 'border-transparent bg-[#0B0C12] text-white' : 'border-black/15 text-black/55 hover:border-black/40 hover:text-black'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="mt-5">
          <EditionSemaine edition={edition} />
        </div>
      </Feuille>

      <Feuille
        ouverte={feuille === 'collection'}
        surtitre={MARQUE_MAGAZINE}
        titre="La collection — les 54 magazines"
        onFermer={() => setFeuille(null)}
      >
        <GalerieCouvertures />
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-black/45">
          <Link to="/le-mariage" className="underline decoration-black/20 underline-offset-4 hover:text-black">
            Le mariage, de fond en comble
          </Link>
        </p>
      </Feuille>

      <Feuille
        ouverte={feuille === 'profil'}
        surtitre={MARQUE_MAGAZINE}
        titre="Se montrer, et élever les autres"
        onFermer={() => setFeuille(null)}
      >
        <MiseEnLumiere />
      </Feuille>

      <Feuille
        ouverte={feuille === 'composer'}
        surtitre="Composer avec des cases"
        titre="Votre mini-site"
        onFermer={() => setFeuille(null)}
      >
        <Composition
          blocs={blocs}
          familles={familles}
          onBlocs={setBlocs}
          onFamille={(id, famille) => setFamilles((f) => ({ ...f, [id]: famille }))}
          onOuvrir={() => {
            setMondeId('mini-site');
            setChemin((c) => [...c, { id: 'mini-site', titre: 'VOTRE MINI-SITE' }]);
          }}
          onFermer={() => setFeuille(null)}
        />
      </Feuille>

    </div>
  );
}

/** Le titre d'un mini-site, selon les blocs qu'on y a posés. */
function titreDuMiniSite(blocs: BlocDeMiniSite[]): string {
  const modules = blocs.map((b) => b.module);
  if (modules.includes('prix') || modules.includes('personne')) return 'L’ESPACE DU PROFESSIONNEL';
  if (modules.includes('formulaire')) return 'L’ESPACE DES INVITÉS';
  return 'VOTRE MINI-SITE';
}

/* ——————————————————————— LE ZOOM D'ENTRÉE ——————————————————————— */

/**
 * **Entrer dans une case** : elle grandit jusqu'à l'écran, et le monde qu'elle
 * contenait arrive derrière. On ne change pas de page — on descend d'un cran
 * dans la même matière.
 */
function ZoomDEntree({ kase, rect }: { kase: CaseDuMonde; rect: DOMRect | null }) {
  const [grand, setGrand] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setGrand(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const depart = rect ?? { left: window.innerWidth / 2 - 60, top: window.innerHeight / 2 - 60, width: 120, height: 120 };

  return (
    <span
      aria-hidden="true"
      data-zoom="case"
      className="pointer-events-none fixed z-40 overflow-hidden"
      style={{
        left: grand ? 0 : depart.left,
        top: grand ? 0 : depart.top,
        width: grand ? '100vw' : depart.width,
        height: grand ? '100vh' : depart.height,
        background: kase.couleur,
        transition:
          'left 430ms cubic-bezier(.22,.9,.24,1), top 430ms cubic-bezier(.22,.9,.24,1), width 430ms cubic-bezier(.22,.9,.24,1), height 430ms cubic-bezier(.22,.9,.24,1)',
      }}
    >
      {kase.image && <img src={kase.image} alt="" className="h-full w-full object-cover" />}
    </span>
  );
}

/* ——————————————————— LA COMPOSITION : DES CASES ET DES MODULES ——————————————————— */

/**
 * **Composer un mini-site avec des cases.** Ce qu'on a choisi dans la grille est
 * en haut ; on ajoute des modules en dessous — RSVP, plan, météo, playlist ; on
 * glisse pour changer l'ordre ; et chaque bloc dit à qui il est ouvert, d'un
 * seul symbole. Rien d'autre.
 */
function Composition({
  blocs,
  familles,
  onBlocs,
  onFamille,
  onOuvrir,
  onFermer,
}: {
  blocs: BlocDeMiniSite[];
  familles: Record<string, Famille>;
  onBlocs: (blocs: BlocDeMiniSite[]) => void;
  onFamille: (id: string, famille: Famille) => void;
  onOuvrir: () => void;
  onFermer: () => void;
}) {
  const [glisse, setGlisse] = useState<number | null>(null);
  const [surIndex, setSurIndex] = useState<number | null>(null);
  const refs = useRef(new Map<number, HTMLElement>());

  /** Le glissement : on prend un bloc, on le repose ailleurs. */
  useEffect(() => {
    if (glisse === null) return;
    const surBouge = (e: PointerEvent) => {
      let cible: number | null = null;
      refs.current.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        if (e.clientY >= r.top && e.clientY <= r.bottom) cible = i;
      });
      setSurIndex(cible);
    };
    const surHaut = () => {
      if (surIndex !== null && surIndex !== glisse) {
        const suivants = [...blocs];
        const [pris] = suivants.splice(glisse, 1);
        suivants.splice(surIndex, 0, pris!);
        onBlocs(suivants);
      }
      setGlisse(null);
      setSurIndex(null);
    };
    window.addEventListener('pointermove', surBouge);
    window.addEventListener('pointerup', surHaut);
    return () => {
      window.removeEventListener('pointermove', surBouge);
      window.removeEventListener('pointerup', surHaut);
    };
  }, [blocs, glisse, onBlocs, surIndex]);

  const ajouter = (id: string) => {
    const suite = composerLeMiniSite([id], [], familles);
    onBlocs([...blocs, ...suite]);
  };

  const poserPreset = (ids: string[]) => {
    onBlocs(composerLeMiniSite(ids, [], familles));
  };

  return (
    <div data-composition="mini-site">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/45">Poser d’un coup</span>
        <button
          type="button"
          data-preset="invite"
          onClick={() => poserPreset(MINI_SITE_INVITE)}
          className="border border-black/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-black/70 transition hover:border-black/45 hover:text-black"
        >
          un invité
        </button>
        <button
          type="button"
          data-preset="prestataire"
          onClick={() => poserPreset(MINI_SITE_PRESTATAIRE)}
          className="border border-black/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-black/70 transition hover:border-black/45 hover:text-black"
        >
          un professionnel
        </button>
      </div>

      <ul data-blocs={blocs.length} className="mt-5 divide-y divide-black/8 border-y border-black/8">
        {blocs.map((bloc, i) => (
          <li
            key={`${bloc.id}-${i}`}
            ref={(el) => {
              if (el) refs.current.set(i, el);
              else refs.current.delete(i);
            }}
            data-bloc={bloc.id}
            data-survol={surIndex === i ? 'true' : 'false'}
            className={`flex items-center gap-3 px-1 py-3 ${glisse === i ? 'opacity-45' : ''} ${surIndex === i && glisse !== null && glisse !== i ? 'bg-black/4' : ''}`}
          >
            <button
              type="button"
              aria-label={`Déplacer ${bloc.mot}`}
              onPointerDown={(e) => {
                e.preventDefault();
                setGlisse(i);
              }}
              className="cursor-grab font-mono text-[11px] leading-none text-black/30 hover:text-black/70"
            >
              ⠿
            </button>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/40">{bloc.module}</span>
              <span className="truncate text-[15px] text-[#0B0C12]">{bloc.mot}</span>
            </span>
            <button
              type="button"
              aria-label={`Ouverture de ${bloc.mot} : ${bloc.famille}`}
              onClick={() => {
                const i2 = FAMILLES.findIndex((f) => f.id === bloc.famille);
                const suivant = FAMILLES[(i2 + 1) % FAMILLES.length]!.id;
                onFamille(bloc.id, suivant);
                onBlocs(blocs.map((b) => (b.id === bloc.id ? { ...b, famille: suivant } : b)));
              }}
              className="font-mono text-[11px] leading-none text-black/50 transition hover:text-black"
            >
              {FAMILLES.find((f) => f.id === bloc.famille)?.marque}
            </button>
            <button
              type="button"
              aria-label={`Retirer ${bloc.mot}`}
              onClick={() => onBlocs(blocs.filter((_, j) => j !== i))}
              className="font-mono text-[11px] leading-none text-black/30 transition hover:text-black"
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {MODULES_DE_COMPOSITION.map((module) => (
          <button
            key={module.id}
            type="button"
            data-module-ajoute={module.id}
            onClick={() => ajouter(module.id)}
            className="border border-black/12 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-black/60 transition hover:border-black/45 hover:text-black"
          >
            {module.mot}
          </button>
        ))}
      </div>

      <div className="mt-7 flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/40">
          {blocs.length} bloc{blocs.length > 1 ? 's' : ''} · {new Set(blocs.map((b) => b.module)).size} modules
        </span>
        <button
          type="button"
          data-ouvrir-mini-site="vrai"
          onClick={() => {
            onOuvrir();
            onFermer();
          }}
          className="bg-[#0B0C12] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white"
        >
          ouvrir mon mini-site
        </button>
      </div>
    </div>
  );
}
