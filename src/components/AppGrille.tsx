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
import { useFace } from '../lib/faceDuSite';
import {
  LIAISONS_POSSIBLES,
  PALETTES_DU_SYSTÈME,
  RÉGLAGES_DU_SYSTÈME,
  faceTechnique,
  liaisonsDuneCase,
  modulesAttendus,
  type Emplacement,
} from '../lib/versoDuSite';
import { publierImmersif } from '../lib/modeImmersif';
import { partDeLHeure } from '../lib/moments';
import { roleDuneAdresse } from '../lib/personaSuites';
import { usePersonaCourante } from '../lib/personaCourant';
import { magazineDeLaDate, niveauxDuJour } from '../lib/semaines';
import BasculeDeFace from './BasculeDeFace';
import CadranDuMagazine from './CadranDuMagazine';
import { legendeDeLHeure } from './CouvertureJour';
import ChampDuMagazine from './ChampDuMagazine';
import EditionSemaine from './EditionSemaine';
import Feuille from './Feuille';
import GalerieCouvertures from './GalerieCouvertures';
import GrilleDuMonde from './GrilleDuMonde';
import MiseEnLumiere from './MiseEnLumiere';

/**
 * L'APPLICATION GRILLE — LE SITE, EN CASES
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

/**
 * **Le monde de l'adresse.** Sans rien, on arrive devant **l'année entière** :
 * trois cent soixante-cinq cases, l'ensemble du contenu en une vue. Le premier
 * pas du chemin, en bas à gauche, ramène aux grandes portes — `LE MONDE`.
 */
function mondeDeLAdresse(params: URLSearchParams, defaut: string): string {
  const monde = params.get('monde');
  if (monde) return monde;
  const jour = params.get('jour');
  return jour ? `jour-${cleDuJour(jourDeLAdresse(jour))}` : defaut;
}

export default function AppGrille({
  /** Le monde par défaut quand l'adresse n'en donne pas : l'année, ou une page. */
  mondeInitial = 'annee',
  /** Le verso quand l'adresse ne le dit pas. */
  versoInitial = false,
}: {
  mondeInitial?: string;
  versoInitial?: boolean;
} = {}) {
  const [params] = useSearchParams();
  const role = roleDuneAdresse(params.get('role'));
  const moi = usePersonaCourante();
  const roleId = role?.id ?? moi.id;

  const [date] = useState(() => jourDeLAdresse(params.get('jour')));

  /** **Où l'on est** : le monde ouvert, et le chemin qui y a mené. */
  const [mondeId, setMondeId] = useState(() => mondeDeLAdresse(params, mondeInitial));
  const [chemin, setChemin] = useState<Array<{ id: string; titre: string }>>(() => {
    const depart = mondeDeLAdresse(params, mondeInitial);
    return depart === 'monde' ? [] : [{ id: depart, titre: '' }];
  });
  const [echelle, setEchelle] = useState(() => echelleDuCran(cranDeLAdresse(params.get('niveau'))));
  const [selection, setSelection] = useState<string[]>(() => casesDeLAdresse(params.get('cases')));
  const [masquees, setMasquees] = useState<string[]>([]);
  /**
   * **La face du site.** Elle vit dans l'adresse (`?face=verso`) : le verso se
   * partage, il survit à la navigation, et il se quitte d'un mot. `versoInitial`
   * sert aux pages qui l'ouvrent d'elles-mêmes.
   */
  const { face, changer } = useFace();
  const verso = versoInitial || face === 'verso';
  /** La touche `V` retourne le site — toujours par l'adresse, jamais autrement. */
  const faceSuivante = useRef<() => void>(() => {});
  useEffect(() => {
    faceSuivante.current = () => changer(face === 'verso' ? 'grille' : 'verso');
  }, [face, changer]);
  /** Les places posées à la main : au verso, une case se déplace et se lie. */
  const [places, setPlaces] = useState<Record<string, Emplacement>>({});
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
  const magazine = magazineDeLaDate(date);
  const niveaux = niveauxDuJour(date);
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
      if (e.key === 'v' || e.key === 'V') {
        faceSuivante.current();
        return;
      }
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

  /**
   * **Le monde, écrit à deux mots.** Ce n'est plus une scène derrière la
   * mosaïque : c'est une ligne, en haut à gauche, qui dit où l'on est.
   */
  const scene = {
    date: `${dateCapitale(date)} · ${niveaux.magazine}`,
    titre: niveaux.titreDuMagazine,
  };

  return (
    <div
      data-page="magazine"
      className="fixed inset-0 overflow-hidden bg-[#0B0C12] text-white"
    >
      {/* ————————— LE MONDE OÙ L'ON EST : LE CADRAN, ET DEUX MOTS ————————— */}
      <div className="pointer-events-none absolute left-3 top-3 z-20 flex items-center gap-2 sm:left-5 sm:top-4">
        <CadranDuMagazine
          heure={heure}
          chapitre={niveaux.numeroDeChapitre}
          fond="rgba(11,12,18,0.55)"
          encre="#F3F1ED"
          accent={accent}
          vignette
          className="h-9 w-9"
        />
        <span
          data-etat="monde"
          data-heure={heure}
          className="flex flex-col"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">{scene.date}</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/45">{scene.titre}</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
            {niveaux.titreDuChapitre.toUpperCase()} · {legendeDeLHeure(heure)}
          </span>
        </span>
      </div>

      {/* ————————— LE VERSO : LE MOTEUR, ET TOUT CE QUI PEUT SE LIER ————————— */}
      {verso && (
        <aside
          data-verso="ouvert"
          data-reglages={RÉGLAGES_DU_SYSTÈME.length}
          data-liaisons-possibles={LIAISONS_POSSIBLES.length}
          data-places={Object.keys(places).length}
          className="absolute left-2 top-2 z-30 max-h-[78svh] w-[30ch] overflow-y-auto overscroll-contain border-r border-white/10 bg-[#0A0B11]/85 px-3 py-2 pr-4 font-mono text-[10px] leading-relaxed tracking-[0.12em] text-white/55 backdrop-blur-md sm:left-5 sm:top-4"
        >
          <p className="uppercase text-white/85">{monde.titre}</p>
          <p className="text-white/30">
            {PALETTES_DU_SYSTÈME.length} palettes · {monde.cases.length} cases
          </p>

          {/* La case sous la main : sa face technique, et ce qu'elle attend. */}
          {apercu && (
            <p data-face="technique" className="mt-2 border-t border-white/10 pt-2">
              <span className="block uppercase text-white/75">{apercu.titre}</span>
              <span className="block text-white/35">
                {faceTechnique(apercu, liaisonsDuneCase(apercu, monde)).source} ·{' '}
                {apercu.module} · {liaisonsDuneCase(apercu, monde)} liaisons
              </span>
              <span className="block text-white/30">
                attend : {modulesAttendus(apercu.module).slice(0, 6).join(' · ') || 'rien'}
              </span>
            </p>
          )}

          <p className="mt-2 border-t border-white/10 pt-2 uppercase text-white/35">le système</p>
          {RÉGLAGES_DU_SYSTÈME.map((reglage) => (
            <p key={reglage.id} data-reglage={reglage.id} className="flex items-baseline justify-between gap-2">
              <span className="truncate text-white/30">{reglage.nom}</span>
              <span className="shrink-0 text-white/70">{reglage.valeur}</span>
            </p>
          ))}

          <p className="mt-2 border-t border-white/10 pt-2 uppercase text-white/35">
            les liaisons · {LIAISONS_POSSIBLES.length}
          </p>
          {LIAISONS_POSSIBLES.map((liaison) => (
            <p key={`${liaison.a}+${liaison.b}`} data-liaison={liaison.a + '+' + liaison.b} className="truncate">
              <span className="text-white/30">
                {liaison.a} + {liaison.b}
              </span>{' '}
              <span className="text-[#7DE2B0]/70">→ {liaison.produit}</span>
            </p>
          ))}
        </aside>
      )}

      {/* ————————— LA GRILLE : TOUT L'ÉCRAN ————————— */}
      <div
        className="absolute inset-0 z-10"
        style={{
          opacity: sortie ? 0 : 1,
          transition: 'opacity 260ms ease',
        }}
      >
        <GrilleDuMonde
          key={monde.id}
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
          verso={verso}
          places={places}
          onPoser={(id, place) =>
            setPlaces((actuelles) => {
              const suite: Record<string, Emplacement> = {};
              Object.entries(actuelles).forEach(([autre, p]) => {
                if (autre !== id && !(p.c === place.c && p.l === place.l)) suite[autre] = p;
              });
              suite[id] = place;
              return suite;
            })
          }
        />
      </div>

      {/* ————————— LES PORTES : L'ÉDITEUR, LA COLLECTION, LE PROFIL ————————— */}
      <div className="absolute right-12 top-3 z-20 flex flex-col items-end gap-1 sm:right-14 sm:top-4">
        <BasculeDeFace faces={['grille', 'verso']} />
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

      {/* ————————— LA CASE SOUS LE DOIGT : UNE LIGNE, SANS PLUS ————————— */}
      {apercu && (
        <span
          data-apercu="case"
          className="pointer-events-none absolute bottom-8 left-3 z-20 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 sm:left-5"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}
        >
          {apercu.surTitre ? `${apercu.surTitre} · ` : ''}{apercu.titre}
        </span>
      )}

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
