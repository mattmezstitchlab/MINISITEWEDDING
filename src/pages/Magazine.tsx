import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { MARQUE_MAGAZINE } from '../lib/aimeMagazine';
import { ALL_ARTICLES } from '../lib/magazine';
import { articlesPourRole, roleDuneAdresse } from '../lib/personaSuites';
import { usePersonaCourante } from '../lib/personaCourant';
import { composerEdition, HEURES } from '../lib/aimeMoteur';
import { couvertureDuJour, couverturesDesParts } from '../lib/couvertureDuJour';
import { niveauxDuJour } from '../lib/semaines';
import { visuelsDuJour } from '../lib/visuelsDuMagazine';
import { filRougeDuJour, jourDuMagazine, joursAutour } from '../lib/jourDuMagazine';
import { basculerTimeline, choisirMoment, publierReperes, useTempsDeLaCapsule, useMomentDeLaCapsule } from '../lib/capsuleCommande';
import { useControlesDeBande } from '../lib/personaCourant';
import { enregistrerNavVerticale } from '../lib/navVerticale';
import { NAV_MAGAZINE } from '../lib/navDesPages';
import { legendeDeLHeure } from '../components/CouvertureJour';
import CouvertureJour from '../components/CouvertureJour';
import ChapitresDuMagazine from '../components/ChapitresDuMagazine';
import GalerieCouvertures from '../components/GalerieCouvertures';
import BlocMagazine from '../components/BlocMagazine';
import EditionSemaine from '../components/EditionSemaine';
import MiseEnLumiere from '../components/MiseEnLumiere';
import ChampDuMagazine from '../components/ChampDuMagazine';
import TimelineTheaterStudio from '../components/TimelineTheaterStudio';
import type { TimelineTrackItem } from '../lib/timelineTheaterEngine';
import {
  adresseDuMagazine,
  blocsDeLaCollection,
  graduationsDeLaCollection,
  teteSurLaSemaineCourante,
} from '../lib/timelineDeLaCollection';

/**
 * LE MAGAZINE — UNE COUVERTURE, UN CADRAN, ET TOUT LE RESTE DERRIÈRE
 *
 * La page tient en **une couverture et cinq blocs**, et rien d'autre. On a
 * retiré ce qui répétait la même idée sous quatre formes (les quatre saisons,
 * les treize semaines, le mur des 365 couvertures, le profil du jour, les six
 * temps, le chiffre) : tout cela vit encore ailleurs, ou plus du tout — c'est ce
 * qu'on appelle simplifier.
 *
 * ```
 * LA COUVERTURE   l'image du magazine, le cadran à aiguilles dessus,
 *                 les trois niveaux — et, dessous, ses sept chapitres
 * 1. L'ÉDITEUR    la saisie, et le magazine qu'elle compose : 24 pages
 * 2. L'ATELIER    la timeline du site — l'année, ses 54 magazines, ses blocs
 * 3. LA COLLECTION les 54 couvertures, par saison
 * 4. LES ARTICLES ce qui se lit dans le magazine
 * 5. LA LUMIÈRE   se montrer, et élever les autres
 * ```
 *
 * ## Le cadran, et la capsule
 *
 * Le cadran de la couverture porte **deux aiguilles** : la grande montre
 * **l'heure qu'on regarde** — celle de la capsule temporelle du bas, ou l'heure
 * réelle —, et la petite montre **le chapitre** où la date entre. Un clic sur
 * « le soir » dans le dock, et l'aiguille se pose à 20 h ; les branches de
 * cette heure s'allument. La page **publie ses repères** au dock (le magazine,
 * le chapitre, le jour) : les deux parlent donc toujours du même moment.
 */

/** La bascule des trois temps : le même numéro, relu. */
const TEMPS = [
  ['passe', 'L’an dernier'],
  ['present', 'Cette semaine'],
  ['futur', 'L’an prochain'],
] as const;

export default function Magazine() {
  const [params] = useSearchParams();

  /** Le jour ouvert : aujourd'hui, tant qu'on ne choisit pas autre chose. */
  const [depart, setDepart] = useState(() => new Date());
  const [index, setIndex] = useState(0);
  const [temps, setTemps] = useState<'passe' | 'present' | 'futur'>('present');

  /** L'heure que le dock commande, et le moment choisi. */
  const capsule = useTempsDeLaCapsule();
  const moment = useMomentDeLaCapsule();

  /** Le métier de qui regarde : le magazine se range à sa place. */
  const role = roleDuneAdresse(params.get('role'));
  const moi = usePersonaCourante();
  const roleId = role?.id ?? moi.id;
  const articles = useMemo(() => (role ? articlesPourRole(role.id) : ALL_ARTICLES), [role]);

  const jours = useMemo(() => joursAutour(depart, 7).map((d) => jourDuMagazine(d)), [depart]);
  const jour = jours[Math.min(index, jours.length - 1)]!;
  const annee = jour.date.getFullYear();

  /** Les trois niveaux du jour, et ses visuels — une seule source : `semaines.ts`. */
  const niveaux = useMemo(() => niveauxDuJour(jour.date), [jour.date]);
  const visuels = useMemo(() => visuelsDuJour(jour.date), [jour.date]);
  const edition = useMemo(
    () => composerEdition({ numero: visuels.magazine.numero, temps, roleId }),
    [visuels.magazine.numero, temps, roleId],
  );
  const fil = useMemo(() => filRougeDuJour(jour.date), [jour.date]);

  /** L'atelier de l'année : les 54 magazines sur la bande. */
  const blocs = useMemo(() => blocsDeLaCollection(annee), [annee]);
  const graduations = useMemo(() => graduationsDeLaCollection(annee), [annee]);
  const tete = useMemo(() => teteSurLaSemaineCourante(), []);

  // La nav verticale de la page : la collection, l'éditeur, l'atelier.
  useEffect(() => {
    enregistrerNavVerticale(NAV_MAGAZINE);
    return () => enregistrerNavVerticale(null);
  }, []);

  // **La page dit au dock ce qu'on regarde** : le magazine, le chapitre, le jour.
  useEffect(() => {
    publierReperes({
      magazine: niveaux.magazine,
      chapitre: niveaux.chapitre,
      numeroDeChapitre: niveaux.numeroDeChapitre,
      jour: niveaux.date,
    });
    return () => publierReperes(null);
  }, [niveaux]);

  // L'adresse amène le jour, le moment, la timeline : une fois, à l'arrivée.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    const j = params.get('jour');
    if (j) {
      const [m, q] = j.split('-').map(Number);
      if (m && q) {
        setDepart(new Date(new Date().getFullYear(), m - 1, q, 12));
        setIndex(0);
      }
    }
    const mo = params.get('moment');
    if (mo) choisirMoment(mo);
    if (params.get('timeline') === '1') basculerTimeline(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** La couverture du hero : celle du magazine, éclairée à l'heure qu'on regarde. */
  const couvertureHero = useMemo(() => {
    if (!moment) return couvertureDuJour(jour.date);
    return (
      couverturesDesParts(jour.date).find((p) => p.part.id === moment)?.couverture ??
      couvertureDuJour(jour.date)
    );
  }, [moment, jour.date]);

  /** **Ouvrir un jour** — la seule façon de changer de date. Les deux navigations y mènent. */
  const ouvrirJour = (d: Date) => {
    setDepart(d);
    setIndex(0);
  };

  /** Les flèches du dock feuillettent les jours ; au bord, la fenêtre glisse. */
  const feuilleter = (pas: number) => {
    const suivant = index + pas;
    if (suivant >= 0 && suivant < jours.length) {
      setIndex(suivant);
      return;
    }
    const d = new Date(depart);
    d.setDate(d.getDate() + pas);
    setDepart(d);
    setIndex(suivant < 0 ? Math.max(jours.length - 2, 0) : Math.min(1, jours.length - 1));
  };
  const surveiller = useControlesDeBande('magazine', {
    precedent: () => feuilleter(-1),
    suivant: () => feuilleter(1),
  });

  /** Cliquer un magazine dans l'atelier : on l'ouvre au lundi de sa semaine. */
  const ouvrirMagazine = (item: TimelineTrackItem) => {
    const numero = Number(item.id.replace('magazine-', ''));
    if (!Number.isFinite(numero) || numero < 1) return;
    const [m, q] = adresseDuMagazine(numero, annee).split('jour=')[1]!.split('-').map(Number);
    ouvrirJour(new Date(annee, (m ?? 1) - 1, q ?? 1, 12));
  };

  const dateCourte = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });

  return (
    <div className="vp-env min-h-screen overflow-x-clip bg-white text-[#0B0C12]">
      {/* ═══════════════ BLOC 1 — LA COUVERTURE, LE CADRAN, LES CHAPITRES ═══════════════ */}
      <header ref={surveiller} className="relative overflow-hidden bg-[#0B0C12] pb-10 pt-20 text-white">
        <div className="vp-page flex flex-col items-center text-center">
          <span className="vp-eyebrow !text-white/60">
            {MARQUE_MAGAZINE} · 54 magazines · 7 chapitres par magazine
          </span>
          <h1 className="vp-title mt-4 text-center text-white" style={{ fontSize: 'clamp(2rem, 4.6vw, 3.2rem)', lineHeight: 1.05 }}>
            SUPER MAGAZINE
          </h1>

          {/* LES TROIS NIVEAUX — quel jour, dans quel magazine, à quel chapitre. */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em]">
            <span className="rounded-full border border-white/25 px-3 py-1.5 text-white/90">{niveaux.date}</span>
            <span className="text-white/35">→</span>
            <span className="rounded-full border border-white/25 px-3 py-1.5 text-white/75">
              {niveaux.magazine} · {niveaux.titreDuMagazine}
            </span>
            <span className="text-white/35">→</span>
            <span className="rounded-full border border-white/25 px-3 py-1.5 text-white/75">{niveaux.chapitre}</span>
          </div>

          {/* LA COUVERTURE, ENTRE LES DEUX FLÈCHES DU TEMPS — la couverture du
              magazine, avec le cadran et ses aiguilles. */}
          <div className="mt-7 flex w-full items-center justify-center gap-3 sm:gap-6">
            <button
              type="button"
              onClick={() => feuilleter(-1)}
              aria-label="Le jour précédent"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white/45 hover:text-white"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="overflow-hidden rounded-[18px] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.8)]">
              <CouvertureJour
                couverture={couvertureHero}
                visuel={visuels.couverture}
                niveaux={niveaux}
                className="h-[52svh] max-h-[540px] w-auto"
              />
            </div>

            <button
              type="button"
              onClick={() => feuilleter(1)}
              aria-label="Le jour suivant"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white/45 hover:text-white"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* LE CADRAN ET LA CAPSULE — ce que les aiguilles regardent. */}
          <p className="mt-5 max-w-[620px] font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-white/55">
            {legendeDeLHeure(capsule.heure)} · {capsule.pilote ? 'heure choisie dans la capsule' : 'heure réelle'} ·
            la petite aiguille montre le chapitre {String(niveaux.numeroDeChapitre).padStart(2, '0')} ·
            la capsule en bas pose les aiguilles
          </p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
            {jour.nom} · {dateCourte(jour.date)} · jour {index + 1} sur {jours.length}
          </p>

          {/* LES SIX TEMPS DU JOUR, EN UNE LIGNE — les mêmes que la capsule. */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5">
            {(['aube', 'matin', 'midi', 'apres-midi', 'soir'] as const).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => choisirMoment(moment === id ? null : id)}
                aria-pressed={moment === id}
                className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
                  moment === id
                    ? 'border-white bg-white text-[#0B0C12]'
                    : 'border-white/20 text-white/60 hover:border-white/50 hover:text-white'
                }`}
              >
                {id.replace('-', ' ')}
              </button>
            ))}
            <button
              type="button"
              onClick={() => basculerTimeline(true)}
              className="rounded-full border border-white/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/60 transition hover:border-white/50 hover:text-white"
            >
              l’atelier du temps
            </button>
          </div>
        </div>
      </header>

      {/* LES SEPT CHAPITRES DU MAGAZINE — la navigation éditoriale. */}
      <ChapitresDuMagazine date={jour.date} annee={annee} onChoisirChapitre={ouvrirJour} />

      <div className="vp-page mt-10 space-y-10 pb-16">
        {/* ═══════════════ BLOC 2 — L'ÉDITEUR : LES BLOCS DE SUPER RIPPLE ═══════════════ */}
        {/* L'éditeur parle la langue de la fabrique : un fond d'encre, des blocs
            `rounded-[18px] border border-white/10 bg-white/[0.03]`, un surtitre en
            monospace, une phrase d'agent — et, quand il faut écrire, **du papier**
            (`bg-[#FFFEF7]`, filet pointillé), comme dans SUPER RIPPLE. */}
        <section id="editeur" className="vp-env-dark -mx-3 rounded-[26px] bg-[#0A0A0A] p-3 text-white sm:-mx-5 sm:p-5">
          <BlocMagazine
            ton="sombre"
            surtitre="L’éditeur · les blocs de la fabrique"
            titre="Votre magazine, maintenant"
            resume={
              <>
                Trois informations sur le papier, et le magazine se compose : la couverture, ses sept
                chapitres, ses <strong className="font-semibold text-white/80">{HEURES.length} pages</strong> — une par
                heure. La saisie est ici, le résultat suit dessous, et rien ne se perd : c’est le même
                moteur que SUPER RIPPLE.
              </>
            }
            aDroite={
              <div className="flex flex-wrap items-center gap-1.5">
                {TEMPS.map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTemps(id)}
                    aria-pressed={temps === id}
                    className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold transition ${
                      temps === id
                        ? 'border-transparent bg-[#00FF88] text-black'
                        : 'border-white/15 text-white/60 hover:border-white/40 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            }
          >
            {/* Le papier : on écrit dessus. */}
            <div className="rounded-[10px] border border-dashed border-white/20 bg-[#FFFEF7] p-4 font-mono text-[11.5px] text-black sm:p-5">
              <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-black/45">
                <span>Le papier de la fabrique</span>
                <span className="h-px flex-1 bg-black/10" />
                <span>{niveaux.magazine}</span>
              </div>
              <ChampDuMagazine />
            </div>

            {/* Le résultat : les pages composées, posées à côté. */}
            <div className="mt-4">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                  {niveaux.magazine} · {niveaux.chapitre} · {HEURES.length} pages
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
                  {visuels.imageDuChapitre.origine === 'dessin' ? 'visuel à livrer' : visuels.imageDuChapitre.slot}
                </span>
              </div>
              <p className="mt-2 max-w-[720px] text-[13.5px] leading-relaxed text-white/60">
                Une page par heure, huit rubriques qui ne changent pas d’un numéro à l’autre — c’est ce
                qui fait un magazine. {fil.actionParfaite.charAt(0).toUpperCase() + fil.actionParfaite.slice(1)}.
              </p>
              <div className="mt-4">
                <EditionSemaine edition={edition} />
              </div>
            </div>
          </BlocMagazine>
        </section>

        {/* ═══════════════ BLOC 3 — L'ATELIER DU TEMPS : LA TIMELINE ═══════════════ */}
        <div id="atelier">
          <BlocMagazine
            surtitre="L’atelier du temps"
            titre="L’année, sur la bande"
            resume={
              <>
                La timeline du site — celle de l’atelier : une règle graduée, des blocs, un inspecteur, une
                tête de lecture. Ici, chaque bloc est <strong className="font-semibold text-black/70">un magazine</strong>,
                ses sept chapitres sont dessous, et la tête est posée sur la semaine où vous êtes. Cliquer un
                bloc ouvre le magazine.
              </>
            }
            aDroite={
              <button
                type="button"
                onClick={() => basculerTimeline(true)}
                className="rounded-full border border-black/12 px-3.5 py-1.5 text-[12px] font-semibold text-black/70 transition hover:border-black/40 hover:text-black"
              >
                Ouvrir en grand
              </button>
            }
          >
            <TimelineTheaterStudio
              items={blocs}
              graduations={graduations}
              titreDeLAxe="L’année en 54 magazines — un bloc par semaine, sept chapitres dedans"
              zoomInitial={2}
              teteInitiale={tete}
              onSelectMoment={ouvrirMagazine}
            />
          </BlocMagazine>
        </div>

        {/* ═══════════════ BLOC 4 — LA COLLECTION : LES 54 COUVERTURES ═══════════════ */}
        <GalerieCouvertures annee={annee} />

        {/* ═══════════════ BLOC 5 — LES ARTICLES : CE QUI SE LIT DANS LE MAGAZINE ═══════════════ */}
        <div id="articles">
          <BlocMagazine
            surtitre={role ? 'Les articles de votre métier' : 'La rédaction'}
            titre={role ? `Choisi pour ${role.nom}` : 'Les articles'}
            resume={
              role
                ? `Les articles qui parlent de ce métier, et rien d’autre : ${articles.length} sur ${ALL_ARTICLES.length}.`
                : 'Les sujets du magazine — les univers, les guides, l’insolite. Chacun s’ouvre comme un article, avec sa couverture et son temps de lecture.'
            }
            aDroite={
              role ? (
                <Link to="/magazine" className="inline-flex items-center gap-1.5 rounded-full border border-black/12 px-3.5 py-1.5 text-[12px] font-semibold text-black/70 no-underline transition hover:border-black/40 hover:text-black">
                  Tout le magazine <ArrowRight size={12} />
                </Link>
              ) : (
                <span className="rounded-full border border-black/10 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-black/50">
                  {articles.length} articles
                </span>
              )
            }
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  to={`/magazine/${article.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-black/8 bg-white no-underline transition hover:-translate-y-1 hover:shadow-[0_22px_44px_-30px_rgba(0,0,0,0.5)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#F2F0EC]">
                    <img src={article.cover} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
                      {article.kicker}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-[15px] font-bold leading-snug">{article.title}</h3>
                    <p className="mt-2 line-clamp-3 text-[12.5px] leading-relaxed text-black/55">{article.intro}</p>
                    <span className="mt-auto flex items-center gap-2 pt-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-black/45">
                      <Clock size={12} /> {article.readingMinutes} min
                      <span className="flex items-center gap-1 transition group-hover:translate-x-0.5">
                        Lire <ArrowRight size={12} />
                      </span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </BlocMagazine>
        </div>

        {/* ═══════════════ BLOC 6 — LA MISE EN LUMIÈRE : SE MONTRER, ET ÉLEVER LES AUTRES ═══════════════ */}
        <div id="lumiere">
        <BlocMagazine
          surtitre="La mise en lumière"
          titre="Se montrer, et élever les autres"
          resume="Le magazine ne demande rien : il rend ce qu’on lui donne. Plus le profil est complet, plus on est vu — et le jour de votre fête, la couverture peut être la vôtre, avec les personnes alignées autour de vous. Le même jour, ailleurs, d’autres fêtent le même prénom."
        >
          <MiseEnLumiere />
        </BlocMagazine>
        </div>

      </div>

      <footer className="border-t border-black/5 py-8">
        <div className="vp-page flex flex-col items-center justify-between gap-3 text-[12.5px] text-black/50 sm:flex-row">
          <span className="vp-title text-[16px] font-bold italic tracking-wider text-black/80">{MARQUE_MAGAZINE}</span>
          <span>54 magazines · 7 chapitres par magazine · 365 jours pour les parcourir</span>
        </div>
      </footer>
    </div>
  );
}
