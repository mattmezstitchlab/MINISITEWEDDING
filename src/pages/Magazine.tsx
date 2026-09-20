import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { MARQUE_MAGAZINE } from '../lib/aimeMagazine';
import { ALL_ARTICLES, type Article } from '../lib/magazine';
import { articlesPourRole, roleDuneAdresse } from '../lib/personaSuites';
import { usePersonaCourante } from '../lib/personaCourant';
import { composerEdition, HEURES } from '../lib/aimeMoteur';
import { couvertureDuJour } from '../lib/couvertureDuJour';
import { CHAPITRES } from '../lib/chapitres';
import { jourDuMagazine } from '../lib/jourDuMagazine';
import {
  MAGAZINES, jourDuChapitre, joursDuMagazine, magazineDeLaDate, niveauxDuJour, positionDansLeMagazine,
} from '../lib/semaines';
import { visuelDeLaCouverture, visuelDuChapitre, visuelsDuJour } from '../lib/visuelsDuMagazine';
import {
  choisirMoment, HEURE_DES_MOMENTS, heureDeLaCapsule, MOMENTS_DE_LA_CAPSULE,
} from '../lib/capsuleCommande';
import { publierImmersif } from '../lib/modeImmersif';
import { lumiereDeLHeure, teinteDeLHeure } from '../lib/lumiereDuJour';
import { partDeLHeure } from '../lib/moments';
import { MOIS_LONGS } from '../lib/calendrier';
import CadranDuMagazine from '../components/CadranDuMagazine';
import CouvertureJour from '../components/CouvertureJour';
import ChampDuMagazine from '../components/ChampDuMagazine';
import EditionSemaine from '../components/EditionSemaine';
import GalerieCouvertures from '../components/GalerieCouvertures';
import Feuille from '../components/Feuille';
import MiseEnLumiere from '../components/MiseEnLumiere';
import MosaiqueDuTemps, { type RangeeDuTemps, type TuileDuTemps } from '../components/MosaiqueDuTemps';
import SceneEditoriale from '../components/SceneEditoriale';

/**
 * AIME MAGAZINE — L'APPLICATION
 *
 * ```
 * ┌───────────────────────────────────────────────────┐
 * │ 20 SEPTEMBRE                     (cadran)          │
 * │ Septembre doré                                     │  LA SCÈNE
 * │ L'ART DE RECEVOIR                                  │
 * ├───────────────────────────────────────────────────┤
 * │ [54][51][52][53][54]…          l'année            │
 * │ [17][18][19][20][21][22][23]   la semaine         │  LA MOSAÏQUE
 * │ [00][01]…[18][19]…[23]         la journée         │  (la timeline)
 * │ [00][01]…[23]                  le numéro          │
 * │ [IMG][IMG][IMG]…               les articles       │
 * └───────────────────────────────────────────────────┘
 * ```
 *
 * **La mosaïque, c'est l'application.** Elle occupe toute la largeur, en bas, et
 * elle porte presque tout : les 54 magazines de l'année, les sept jours du
 * magazine ouvert, les vingt-quatre heures de la journée, les vingt-quatre pages
 * du numéro, les articles. On zoome — molette, pincement, clavier, ou les quatre
 * crans — et les rangées s'ouvrent : de loin le monde, de près la page.
 *
 * **La scène, c'est la lecture.** Une image, trois lignes. Rien d'autre.
 *
 * Tout le reste — l'éditeur, la collection — n'apparaît que si on le demande,
 * dans une feuille. Il n'y a plus de panneaux, plus de colonne, plus de blocs
 * empilés, plus de cartes à jouer : **image + temps + mosaïque + typographie**.
 */

/** Ce qu'on regarde : le magazine, un jour, une heure, une page, un article. */
type Selection =
  | { type: 'magazine'; numero: number }
  | { type: 'jour'; date: Date }
  | { type: 'heure'; date: Date; heure: number }
  | { type: 'page'; date: Date; heure: number }
  | { type: 'article'; article: Article };

type FeuilleOuverte = null | 'editeur' | 'collection' | 'profil';

/** **La feuille de l'adresse** : `?feuille=editeur` ouvre l'éditeur en arrivant. */
function feuilleDeLAdresse(valeur: string | null): FeuilleOuverte {
  return valeur === 'editeur' || valeur === 'collection' || valeur === 'profil' ? valeur : null;
}

/** Le mot de la vignette, pour un chapitre : « Amoureux », « Style », « Fête ». */
function motDuChapitre(titre: string): string {
  return titre.replace(/^(Les|Le|La|L’|L')\s+/i, '').split(/[\s,]/)[0]!;
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

/** **Le cran de l'adresse** : `?niveau=4`, ou le cran de départ — la semaine. */
function niveauDeLAdresse(valeur: string | null): number {
  const n = Number(valeur);
  return n >= 1 && n <= 4 ? n : 2;
}

/** L'encre lisible sur un fond : on regarde la luminance, on ne devine pas. */
function encreSur(fond: string): string {
  const hex = fond.replace('#', '').slice(0, 6).padEnd(6, '0');
  const canal = (i: number) => parseInt(hex.slice(i, i + 2), 16);
  const l = (0.2126 * canal(0) + 0.7152 * canal(2) + 0.0722 * canal(4)) / 255;
  return l > 0.55 ? '#0B0C12' : '#F4F5FB';
}

export default function Magazine() {
  const [params] = useSearchParams();
  const role = roleDuneAdresse(params.get('role'));
  const moi = usePersonaCourante();
  const roleId = role?.id ?? moi.id;

  /**
   * **Le jour, la sélection et le cran viennent de l'adresse** — on les lit au
   * premier rendu, pas dans un effet : une adresse partagée ouvre exactement ce
   * qu'elle annonce, sans passer par un état intermédiaire.
   */
  const [date, setDate] = useState(() => jourDeLAdresse(params.get('jour')));
  const [selection, setSelection] = useState<Selection>(() => ({ type: 'jour', date: jourDeLAdresse(params.get('jour')) }));
  const [niveau, setNiveau] = useState(() => niveauDeLAdresse(params.get('niveau')));
  /** La feuille ouverte, s'il y en a une — et celle que l'adresse réclame. */
  const [feuille, setFeuille] = useState<FeuilleOuverte>(() => feuilleDeLAdresse(params.get('feuille')));

  /** La page est immersive : le site s'efface derrière elle. */
  useEffect(() => {
    publierImmersif(true);
    return () => publierImmersif(false);
  }, []);

  /** Le moment de l'adresse, lui, se pose sur la capsule : `?moment=soir`. */
  useEffect(() => {
    const mo = params.get('moment');
    if (mo) choisirMoment(mo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ————————————————————————————————— TOUT VIENT DE LA DATE —————————————————————————————————

  /** Le magazine du jour, son chapitre, ses visuels — depuis la source unique. */
  const magazine = useMemo(() => magazineDeLaDate(date), [date]);
  const niveaux = useMemo(() => niveauxDuJour(date), [date]);
  const visuels = useMemo(() => visuelsDuJour(date), [date]);
  const chapitre = positionDansLeMagazine(date);
  const joursDuMagazineCourant = useMemo(() => joursDuMagazine(magazine.numero, date.getFullYear()), [magazine.numero, date]);

  /** Le temps de lecture : l'an dernier, cette semaine, l'an prochain. */
  const [temps, setTemps] = useState<'passe' | 'present' | 'futur'>('present');

  /** L'édition composée : ses vingt-quatre pages, une par heure. */
  const edition = useMemo(
    () => composerEdition({ numero: magazine.numero, temps, roleId }),
    [magazine.numero, temps, roleId],
  );

  /** Les articles — ceux du métier quand on vient par un métier. */
  const articles = useMemo(() => (role ? articlesPourRole(role.id) : ALL_ARTICLES), [role]);

  /**
   * L'heure regardée : celle d'une vignette touchée, puis celle du moment de
   * l'adresse (`?moment=midi`), puis celle de la capsule.
   */
  const heure =
    selection.type === 'heure' || selection.type === 'page'
      ? selection.heure
      : HEURE_DES_MOMENTS[params.get('moment') ?? ''] ?? heureDeLaCapsule();
  const lumiere = lumiereDeLHeure(heure);

  const accent = magazine.palette.accent;
  const encre = encreSur(magazine.palette.fond);

  // ————————————————————————————————— CE QUE MONTRE LA SCÈNE —————————————————————————————————

  const scene = useMemo(() => {
    const jour = jourDuMagazine(date);
    const surtitre = `${dateCapitale(date)} · ${niveaux.magazine}`;
    switch (selection.type) {
      case 'magazine': {
        const m = MAGAZINES.find((x) => x.numero === selection.numero) ?? magazine;
        const semaine = m.semaine ? `Semaine ${m.semaine}` : 'Hors calendrier';
        return {
          date: `${semaine} · ${m.saison.nom}`,
          titre: m.titre,
          moment: m.style.toUpperCase(),
          image: visuelDeLaCouverture(m.numero).url,
          heure,
        };
      }
      case 'heure': {
        const mot = lumiereDeLHeure(selection.heure).mot ?? HEURES[selection.heure]!.nom;
        return {
          date: surtitre,
          titre: mot.charAt(0).toUpperCase() + mot.slice(1),
          moment: `${magazine.titre.toUpperCase()} · ${CHAPITRES[chapitre - 1]!.titre.toUpperCase()}`,
          image: visuels.imageDuChapitre.url ?? visuels.couverture.url,
          heure: selection.heure,
        };
      }
      case 'page': {
        const page = edition.pages.find((p) => p.heure === selection.heure) ?? edition.pages[0]!;
        return {
          date: surtitre,
          titre: page.titre,
          moment: `${page.rubrique.toUpperCase()} · ${String(selection.heure).padStart(2, '0')}:00`,
          image: visuels.imageDuChapitre.url ?? visuels.couverture.url,
          heure: selection.heure,
        };
      }
      case 'article':
        return {
          date: surtitre,
          titre: selection.article.title,
          moment: `${selection.article.kicker.toUpperCase()} · ${selection.article.readingMinutes} MIN`,
          image: selection.article.cover,
          heure,
        };
      default:
        return {
          date: surtitre,
          titre: magazine.titre,
          moment: jour.nom
            ? `${CHAPITRES[chapitre - 1]!.titre.toUpperCase()} · ${jour.nom.toUpperCase()}`
            : CHAPITRES[chapitre - 1]!.titre.toUpperCase(),
          image: visuels.imageDuChapitre.url ?? visuels.couverture.url,
          heure,
        };
    }
  }, [selection, date, magazine, niveaux.magazine, chapitre, visuels, edition.pages, heure]);

  // ————————————————————————————————— LES RANGÉES DE LA MOSAÏQUE —————————————————————————————————

  /** Ouvrir un magazine : on entre dans sa semaine. */
  const choisirMagazine = useCallback(
    (numero: number) => {
      const debut = jourDuChapitre(numero, 1, date.getFullYear());
      setDate(debut);
      setSelection({ type: 'magazine', numero });
      setNiveau((n) => Math.max(n, 2));
    },
    [date],
  );

  /** **Le geste principal : toucher une vignette, la scène suit.** */
  const choisirJour = useCallback((d: Date) => {
    setDate(d);
    setSelection({ type: 'jour', date: d });
  }, []);

  /** Une heure : la scène prend sa lumière, et la capsule s'y pose. */
  const choisirHeure = useCallback(
    (h: number) => {
      setSelection({ type: 'heure', date, heure: h });
      // L'heure choisie pose la capsule : le cadran suit, la nuit relâche tout.
      const part = partDeLHeure(h);
      choisirMoment(MOMENTS_DE_LA_CAPSULE.includes(part.id) ? part.id : null);
      setNiveau((n) => Math.max(n, 3));
    },
    [date],
  );

  const choisirPage = useCallback(
    (h: number) => {
      setSelection({ type: 'page', date, heure: h });
      setNiveau(4);
    },
    [date],
  );

  const choisirArticle = useCallback((article: Article) => {
    setSelection({ type: 'article', article });
    setNiveau(4);
  }, []);

  /** L'image qui sert de fond aux rangées d'heures : le chapitre, ou la semaine. */
  const imageDuJour = visuels.imageDuChapitre.url ?? visuels.couverture.url;

  const rangees = useMemo<RangeeDuTemps[]>(() => {
    const annee: TuileDuTemps[] = MAGAZINES.map((m) => ({
      id: `magazine-${m.numero}`,
      url: visuelDeLaCouverture(m.numero).url,
      fond: m.palette.fond,
      encre: encreSur(m.palette.fond),
      label: String(m.numero).padStart(2, '0'),
      actif: m.numero === magazine.numero,
      onChoisir: () => choisirMagazine(m.numero),
    }));

    const semaine: TuileDuTemps[] = joursDuMagazineCourant.map((d) => {
      const numero = positionDansLeMagazine(d);
      return {
        id: `jour-${d.getDate()}-${d.getMonth()}`,
        url: visuelDuChapitre(magazine.numero, numero).url,
        fond: magazine.palette.fond,
        encre,
        label: String(d.getDate()).padStart(2, '0'),
        mot: motDuChapitre(CHAPITRES[numero - 1]!.titre).toUpperCase(),
        actif: d.getDate() === date.getDate() && d.getMonth() === date.getMonth(),
        onChoisir: () => choisirJour(d),
      };
    });

    const journee: TuileDuTemps[] = HEURES.map((h) => {
      const l = lumiereDeLHeure(h.heure);
      return {
        id: `heure-${h.heure}`,
        url: imageDuJour,
        fond: teinteDeLHeure(h.heure, magazine.palette.fond, accent),
        encre: '#F4F5FB',
        label: String(h.heure).padStart(2, '0'),
        mot: l.mot,
        clarte: l.clarte,
        voile: l.voile,
        alpha: l.alpha,
        actif: (selection.type === 'heure' || selection.type === 'page') && selection.heure === h.heure,
        onChoisir: () => choisirHeure(h.heure),
      };
    });

    const pages: TuileDuTemps[] = edition.pages.map((page) => {
      const l = lumiereDeLHeure(page.heure);
      return {
        id: `page-${page.heure}`,
        url: imageDuJour,
        fond: teinteDeLHeure(page.heure, magazine.palette.fond, accent),
        encre: '#F4F5FB',
        label: String(page.heure).padStart(2, '0'),
        mot: page.rubrique.toUpperCase(),
        clarte: l.clarte,
        voile: l.voile,
        alpha: l.alpha,
        actif: selection.type === 'page' && selection.heure === page.heure,
        onChoisir: () => choisirPage(page.heure),
      };
    });

    const lesArticles: TuileDuTemps[] = articles.map((a) => ({
      id: `article-${a.slug}`,
      url: a.cover,
      fond: '#14151A',
      encre: '#F4F5FB',
      label: a.kicker.toUpperCase().slice(0, 22),
      mot: `${a.readingMinutes} MIN`,
      large: true,
      actif: selection.type === 'article' && selection.article.slug === a.slug,
      onChoisir: () => choisirArticle(a),
    }));

    /** Le zoom ouvre les rangées : l'année, puis la semaine, puis les heures, puis le contenu. */
    const toutes: RangeeDuTemps[] = [
      { id: 'annee', quoi: 'l’année', tuiles: annee },
      { id: 'semaine', quoi: 'la semaine', tuiles: semaine },
      { id: 'journee', quoi: 'la journée', tuiles: journee },
      { id: 'numero', quoi: 'le numéro', tuiles: pages },
      { id: 'articles', quoi: 'les articles', tuiles: lesArticles },
    ];
    if (niveau <= 1) return [toutes[0]!];
    if (niveau === 2) return toutes.slice(0, 2);
    if (niveau === 3) return toutes.slice(0, 3);
    return toutes;
  }, [
    magazine, date, encre, accent, imageDuJour, edition.pages, articles, niveau, selection,
    joursDuMagazineCourant, choisirMagazine, choisirJour, choisirHeure, choisirPage, choisirArticle,
  ]);

  // ————————————————————————————————— LE REGARD —————————————————————————————————

  const composition = (
    <CouvertureJour couverture={couvertureDuJour(date)} visuel={visuels.couverture} niveaux={niveaux} className="h-full max-h-[70svh] w-auto" />
  );

  return (
    <div className="flex h-[100svh] w-full flex-col overflow-hidden bg-[#0B0C12] text-white">
      <SceneEditoriale
        className="flex-1"
        date={scene.date}
        titre={scene.titre}
        moment={scene.moment}
        image={scene.image}
        composition={composition}
        heure={scene.heure}
        clarte={lumiere.clarte}
        voile={lumiere.voile}
        alpha={lumiere.alpha}
        accent={accent}
        cadran={
          <CadranDuMagazine
            heure={heure}
            chapitre={chapitre}
            fond="#0B0C12"
            encre="#F3F1ED"
            accent={accent}
            vignette
            className="h-9 w-9"
          />
        }
        action={
          selection.type === 'article' ? (
            <Link
              to={`/magazine/${selection.article.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#0B0C12] no-underline transition hover:bg-white/88"
            >
              Lire l’article <ArrowRight size={12} />
            </Link>
          ) : undefined
        }
      />

      {/* Les deux portes contextuelles : discrètes, en haut de la mosaïque. */}
      <div className="relative z-10 flex items-center gap-4 bg-[#0B0C12] px-4 pt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35 sm:px-6">
        <button type="button" onClick={() => setFeuille('editeur')} className="transition hover:text-white/80">
          l’éditeur
        </button>
        <button type="button" onClick={() => setFeuille('collection')} className="transition hover:text-white/80">
          la collection
        </button>
        <button type="button" onClick={() => setFeuille('profil')} className="transition hover:text-white/80">
          votre profil
        </button>
        <span className="ml-auto truncate text-white/25">
          {role ? `choisi pour ${role.nom.toLowerCase()}` : '54 magazines · 7 chapitres · 365 jours'}
        </span>
      </div>

      {/* ————————————— LA MOSAÏQUE : LA TIMELINE, PLEINE LARGEUR ————————————— */}
      <MosaiqueDuTemps rangees={rangees} niveau={niveau} onNiveau={setNiveau} />

      {/* ————————————— LES FEUILLES : TOUT LE RESTE, À LA DEMANDE ————————————— */}
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
        ouverte={feuille === 'profil'}
        surtitre={MARQUE_MAGAZINE}
        titre="Se montrer, et élever les autres"
        onFermer={() => setFeuille(null)}
      >
        <MiseEnLumiere />
      </Feuille>

      <Feuille
        ouverte={feuille === 'collection'}
        surtitre={MARQUE_MAGAZINE}
        titre="La collection — les 54 magazines"
        onFermer={() => setFeuille(null)}
      >
        <GalerieCouvertures annee={date.getFullYear()} />
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            to="/le-mariage"
            className="inline-flex items-center gap-2 rounded-full bg-[#0B0C12] px-4 py-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-white no-underline"
          >
            Les univers <ArrowRight size={12} />
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/40">
            {magazine.etiquette} · {magazine.titre}
          </span>
        </div>
      </Feuille>
    </div>
  );
}
