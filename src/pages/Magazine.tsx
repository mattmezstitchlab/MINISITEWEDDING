import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { COUVERTURES, MARQUE_MAGAZINE } from '../lib/aimeMagazine';
import { JEU_DE_54, bornesDeLaSemaine, semaineDeLAnnee } from '../lib/jeuDeCartes';
import { composerEdition, lesQuatreSaisons, numerosDeLaSaison } from '../lib/aimeMoteur';
import { filRougeDuJour, jourDuMagazine, joursAutour, lesQuatrePortes } from '../lib/jourDuMagazine';
import { HEURES, heureCourante } from '../lib/aimeMoteur';
import { articlesPourRole, roleDuneAdresse } from '../lib/personaSuites';
import { useControlesDeBande, usePersonaCourante } from '../lib/personaCourant';
import { enregistrerNavVerticale } from '../lib/navVerticale';
import { NAV_MAGAZINE } from '../lib/navDesPages';
import CouvertureMagazine from '../components/CouvertureMagazine';
import CouvertureSemaine from '../components/CouvertureSemaine';
import EditionSemaine from '../components/EditionSemaine';
import FluxDuJour from '../components/FluxDuJour';
import MiseEnLumiere from '../components/MiseEnLumiere';

/**
 * LE MAGAZINE — UN JOUR, UNE COUVERTURE, ET ON GLISSE
 *
 * Le hero est **un flux** : chaque écran est un jour de l'année, avec son
 * prénom, son portrait de studio, sa carte et sa météo. On passe au suivant
 * comme on fait défiler — au doigt, à la molette, au clavier ou avec les flèches
 * du dock. **Vers le bas sur un téléphone, vers la droite dès que l'écran est
 * large** : le même flux, décidé en CSS.
 *
 * En dessous, l'année entière :
 *
 * 1. **les quatre saisons** — fond uni, création digitale au centre, et les
 *    treize semaines de la saison ouverte ;
 * 2. **le jour ouvert** — son édition, huit rubriques, toujours les mêmes, avec
 *    la météo des moyennes du passé, la lune, les portes de l'année et le
 *    chiffre du jour ;
 * 3. **les éditions de thème** — les neuf couvertures d'AIME MAGAZINE.
 */

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
};

/** Le lundi de la semaine d'un numéro : par où le jour commence. */
function lundiDe(numero: number): Date {
  const carte = JEU_DE_54.find((c) => c.numero === numero);
  const semaine = carte?.semaine ?? semaineDeLAnnee(new Date());
  return bornesDeLaSemaine(new Date().getFullYear(), semaine)[0];
}

export default function Magazine() {
  const [params] = useSearchParams();
  const role = roleDuneAdresse(params.get('role'));
  const moi = usePersonaCourante();

  /** Le jour ouvert : aujourd'hui, tant qu'on ne choisit pas autre chose. */
  const [depart, setDepart] = useState(() => new Date());
  const [index, setIndex] = useState(0);
  /** Le temps de lecture : l'an dernier, cette semaine, l'an prochain. */
  const [temps, setTemps] = useState<'passe' | 'present' | 'futur'>('present');
  /** L'édition de thème ouverte, sous les couvertures. */
  const [themeId, setThemeId] = useState<string | null>(null);
  /** Le magazine du jour est-il ouvert, et à quelle heure ? */
  const [heureOuverte, setHeureOuverte] = useState<number | null>(null);

  const roleId = role?.id ?? moi.id;
  const jours = useMemo(
    () => joursAutour(depart, 7).map((d) => jourDuMagazine(d, { roleId, temps })),
    [depart, roleId, temps],
  );
  const jour = jours[Math.min(index, jours.length - 1)]!;
  const { carte, saison, edition } = jour;
  const semaines = useMemo(() => numerosDeLaSaison(saison.id), [saison.id]);
  const saisons = useMemo(() => lesQuatreSaisons({ roleId }), [roleId]);

  const siens = useMemo(() => (role ? articlesPourRole(role.id) : null), [role]);
  const fil = useMemo(() => filRougeDuJour(jour.date), [jour.date]);
  const superSaint = jour.superSaint;
  const theme = COUVERTURES.find((c) => c.id === themeId) ?? null;

  // La nav de droite : les saisons, le jour, les articles, et le shop.
  useEffect(() => {
    enregistrerNavVerticale(NAV_MAGAZINE);
    return () => enregistrerNavVerticale(null);
  }, []);

  /** Les flèches feuillettent les jours ; au bord, la fenêtre glisse d'un jour. */
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

  /** Choisir une semaine ramène le flux au lundi de cette semaine. */
  const ouvrirSemaine = (numero: number) => {
    setDepart(lundiDe(numero));
    setIndex(0);
  };

  const dateCourte = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });

  return (
    <div className="vp-env min-h-screen overflow-x-clip bg-white text-[#0B0C12]">
      {/* ————————— LE HERO : LE FLUX DES JOURS, ET LE TITRE AU CENTRE ————————— */}
      <header
        ref={surveiller}
        className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
        style={{ background: saison.fond }}
      >
        {/* La création de la saison : le fond du hero, adouci pour rester un fond. */}
        <img
          src={saison.visuel}
          alt=""
          className="absolute inset-0 h-full w-full scale-110 object-cover blur-[12px] brightness-[0.4] saturate-[0.9]"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/70" />

        <div className="vp-page relative flex flex-col items-center pb-6 pt-20 text-center text-white">
          <span className="vp-eyebrow !text-white/70">{MARQUE_MAGAZINE}</span>
          <h1
            className="vp-title mt-4 text-center text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
            style={{ fontSize: 'clamp(2.1rem, 5vw, 3.6rem)', lineHeight: 1.04 }}
          >
            SUPER MAGAZINE
          </h1>
          <p className="mt-3 text-[13px] text-white/70">
            Une couverture par jour — {JEU_DE_54.length} numéros dans l’année, et 364 prénoms du calendrier.
            {role ? ` Choisi pour ${role.nom}.` : ''}
          </p>

          <div className="mt-6 w-full">
            <FluxDuJour
              jours={jours}
              index={index}
              onIndex={setIndex}
              onOuvrir={(j) => {
                const i = jours.findIndex((x) => x.date.getTime() === j.date.getTime());
                if (i >= 0) setIndex(i);
                setHeureOuverte(heureCourante());
              }}
              titreDuJour={(j) =>
                `${j.nom} · ${j.carte.nom} · semaine ${j.semaine}${j.joker ? ' · joker' : ''}`
              }
            />
          </div>
        </div>
      </header>

      {/* ————————————— LE MAGAZINE DU JOUR, OUVERT À L'HEURE QU'IL EST ————————————— */}
      {heureOuverte !== null && (
        <section id="heures" className="bg-[#0B0C12] py-12 text-white">
          <div className="vp-page">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                  Le magazine du jour, ouvert
                </span>
                <h2 className="vp-title mt-2 text-[22px] sm:text-[26px]">
                  {jour.nom} — les {HEURES.length} heures du jour
                </h2>
                <p className="mt-2 max-w-[620px] text-[13px] leading-relaxed text-white/60">
                  Il est {HEURES[heureOuverte]!.nom} : le magazine s’ouvre là. On glisse d’une heure à
                  l’autre — l’aube, le matin, le midi, l’après-midi, la golden hour, la soirée, la nuit —
                  et chaque page dit la lumière de son heure, ce qu’on y fait, et ce que le ciel du jour
                  y change.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHeureOuverte(null)}
                className="rounded-full border border-white/20 px-3.5 py-1.5 text-[12px] font-semibold text-white/80 transition hover:border-white/60 hover:text-white"
              >
                Refermer
              </button>
            </div>

            {/* Les heures : ça glisse, à l'horizontale comme dans le flux. */}
            <div className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
              {jour.edition.pages.map((page) => (
                <article
                  key={page.heure}
                  data-heure={page.heure}
                  data-ouverte={page.heure === heureOuverte ? 'true' : 'false'}
                  className={`w-[280px] shrink-0 snap-start rounded-[18px] border p-4 transition ${
                    page.heure === heureOuverte ? 'border-white/45 bg-white/10' : 'border-white/12 bg-white/5'
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-mono text-[10px] tabular-nums text-white/45">
                      {String(page.heure).padStart(2, '0')} h
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/45">
                      {page.rubrique}
                    </span>
                  </div>
                  <h3 className="mt-2 text-[13px] font-bold leading-snug">{page.nomDeLHeure} — {page.lumiere}</h3>
                  <p className="mt-2 text-[12px] leading-relaxed text-white/65">{page.titre}</p>
                  <p className="mt-2 text-[11.5px] leading-relaxed text-white/50">{page.texte}</p>
                  <div className="mt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-white/35">
                    {page.source}
                  </div>
                </article>
              ))}
            </div>

            {/* Le super saint du jour : l'architecte, et ses héros. */}
            <div className="mt-8 grid gap-5 rounded-[20px] border border-white/12 bg-white/5 p-5 lg:grid-cols-2">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                  Le super saint du jour — l’architecte
                </span>
                <h3 className="vp-title mt-2 text-[20px]">{superSaint.nom}</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-white/60">
                  Il regarde d’abord : {superSaint.regard}.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {superSaint.heros.map((h) => (
                    <span key={h} className="rounded-full bg-white/10 px-3 py-1 text-[11.5px] font-semibold text-white/80">
                      {h}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-[12px] leading-relaxed text-white/50">{superSaint.pourquoi}</p>
              </div>
              <div className="border-white/12 lg:border-l lg:pl-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                  Le fil rouge, et l’action parfaite
                </span>
                <p className="mt-2 text-[12.5px] leading-relaxed text-white/65">{fil.fil}</p>
                <p className="mt-3 text-[13.5px] font-bold text-white">
                  Aujourd’hui, une seule chose : {fil.actionParfaite}.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ————————————— LES QUATRE SAISONS, PUIS LES SEMAINES ————————————— */}
      <section id="saisons" className="pb-10 pt-14">
        <div className="vp-page">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-black/10 pb-4">
            <h2 className="vp-title text-[22px] sm:text-[26px]">Les quatre saisons</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/45">
              {JEU_DE_54.length} numéros — {JEU_DE_54.filter((c) => c.joker).length} jokers
            </span>
          </div>
          <p className="mt-3 max-w-[680px] text-[13.5px] leading-relaxed text-black/55">
            Un fond uni, une création digitale sur l’amour de la saison : quatre couvertures de base, et
            sous chacune les treize semaines qui la composent — comme les treize cartes d’une couleur. Le
            flux du hero suit la même table : choisir une semaine ramène le magazine à son lundi.
          </p>

          <div className="mt-8 flex flex-wrap items-start justify-center gap-6 sm:gap-8">
            {saisons.map((editionSaison) => (
              <CouvertureSemaine
                key={editionSaison.saison.id}
                edition={editionSaison}
                facteur={editionSaison.saison.id === saison.id ? 1 : 0.4}
                active={editionSaison.saison.id === saison.id}
                onChoisir={() => ouvrirSemaine(editionSaison.numero)}
              />
            ))}
          </div>

          <div className="mt-10">
            <div className="flex flex-wrap items-baseline gap-3">
              <h3 className="text-[16px] font-bold tracking-tight">
                {saison.symbole} {saison.nom} — les treize semaines
              </h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/45">
                couleur {saison.couleur}
              </span>
            </div>
            <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-3">
              {semaines.map((c) => (
                <CouvertureSemaine
                  key={c.numero}
                  edition={composerEdition({ numero: c.numero, roleId, temps })}
                  taille="petite"
                  facteur={c.numero === carte.numero ? 1 : 0.3}
                  active={c.numero === carte.numero}
                  onChoisir={() => ouvrirSemaine(c.numero)}
                />
              ))}
            </div>
          </div>

          {/* Les quatre portes de l'année : les saisons du ciel, pas du jeu. */}
          <div className="mt-10 flex flex-wrap gap-3">
            {lesQuatrePortes().map((p) => (
              <span
                key={p.nom}
                className="rounded-full border border-black/10 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-black/55"
              >
                {p.nom} · {p.date}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ———————————————— LE JOUR OUVERT ———————————————— */}
      <section id="numero" className="bg-[#F7F6F3] py-14">
        <div className="vp-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45">
                Le jour du magazine
              </span>
              <h2 className="vp-title mt-2 text-[22px] sm:text-[26px]">
                {jour.nom || 'Un joker'} — {dateCourte(jour.date)}
              </h2>
              <p className="mt-2 text-[13px] text-black/55">
                {jour.meteo.resume} · lune {jour.cles.lune.nom} · chiffre {jour.cles.chiffre.nombre}
                {jour.cles.porte ? ` · ${jour.cles.porte}` : ''}
                {jour.cles.interstice ? ' · l’interstice' : ''}
                {jour.cles.signeCache ? ` · ${jour.cles.signeCache.nom}` : ''}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {([
                ['passe', 'L’an dernier'],
                ['present', 'Cette semaine'],
                ['futur', 'L’an prochain'],
              ] as const).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTemps(id)}
                  aria-pressed={temps === id}
                  className={`rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition ${
                    temps === id
                      ? 'border-black bg-black text-white'
                      : 'border-black/12 text-black/60 hover:border-black/40 hover:text-black'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {jours.map((j, i) => (
              <button
                key={j.date.toISOString()}
                type="button"
                onClick={() => setIndex(i)}
                aria-pressed={i === index}
                className={`rounded-full border px-3 py-1.5 text-[11.5px] transition ${
                  i === index ? 'border-black bg-black text-white' : 'border-black/12 text-black/60 hover:border-black/40'
                }`}
              >
                {j.nom} · {dateCourte(j.date)}
              </button>
            ))}
          </div>

          <p className="mt-4 text-[12.5px] text-black/50">
            La couverture {jour.numeroDeCouverture} sur 364 · {carte.joker ? 'un joker' : `semaine ${carte.semaine}`} ·
            les flèches du dock passent au jour suivant
          </p>

          <div className="mt-7">
            <EditionSemaine edition={edition} />
          </div>

          {role && (
            <div className="mt-5">
              <Link
                to="/magazine"
                className="inline-flex items-center gap-1.5 rounded-full border border-black/12 px-3 py-1.5 text-[12.5px] font-semibold text-black/70 no-underline transition hover:border-black/40 hover:text-black"
              >
                Tout le magazine <ArrowRight size={12} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ———————————————— LES ÉDITIONS DE THÈME ———————————————— */}
      <section id="editions" className="py-14">
        <div className="vp-page">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45">
            Les autres éditions
          </span>
          <h2 className="vp-title mt-2 text-[22px] sm:text-[26px]">
            {role ? `Choisi pour ${role.nom}` : 'Les éditions de thème'}
          </h2>
          <p className="mt-3 max-w-[680px] text-[13.5px] leading-relaxed text-black/55">
            {role
              ? 'Les articles qui parlent de ce métier, et rien d’autre.'
              : 'Un thème par couverture, et les articles dedans — un article peut appartenir à plusieurs, quand le sujet le mérite.'}
          </p>

          {!role && (
            <div className="mt-8 flex flex-wrap items-start justify-center gap-5 sm:gap-6">
              {COUVERTURES.map((c) => (
                <CouvertureMagazine
                  key={c.id}
                  couverture={c}
                  facteur={c.id === themeId ? 1 : 0.35}
                  active={c.id === themeId}
                  onChoisir={() => setThemeId((id) => (id === c.id ? null : c.id))}
                />
              ))}
            </div>
          )}

          <div id="articles" className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(role ? siens! : theme?.articles ?? []).map((article) => (
              <motion.div key={article.slug} {...fadeUp} transition={{ duration: 0.5 }}>
                <Link
                  to={`/magazine/${article.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-black/8 bg-white transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={article.cover}
                      alt={article.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
                      {article.kicker}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-[15.5px] font-bold leading-snug text-[#0B0C12]">{article.title}</h3>
                    <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-black/55">{article.intro}</p>
                    <span className="mt-auto flex items-center gap-2 pt-4 text-[12px] font-semibold text-black/60">
                      <Clock size={12} /> {article.readingMinutes} min
                      <span className="flex items-center gap-1 transition group-hover:translate-x-0.5">
                        Lire <ArrowRight size={12} />
                      </span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ———————————————— LA MISE EN LUMIÈRE ———————————————— */}
      <section id="lumiere" className="border-t border-black/8 py-14">
        <div className="vp-page">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45">
            La mise en lumière
          </span>
          <h2 className="vp-title mt-2 text-[22px] sm:text-[26px]">Se montrer, et élever les autres</h2>
          <p className="mt-3 max-w-[720px] text-[13.5px] leading-relaxed text-black/55">
            Le magazine ne demande rien : il rend ce qu’on lui donne. Plus le profil est complet, plus on
            est vu — et le jour de votre fête, la couverture peut être la vôtre, avec les personnes
            alignées autour de vous selon vos informations. Le même jour, ailleurs, d’autres fêtent le
            même prénom : l’alignement continue à l’autre bout du monde.
          </p>
          <div className="mt-8">
            <MiseEnLumiere />
          </div>
        </div>
      </section>

      <footer className="border-t border-black/5 py-10">
        <div className="vp-page flex flex-col items-center justify-between gap-3 text-[12.5px] text-black/50 sm:flex-row">
          <span className="vp-title text-[16px] font-bold italic tracking-wider text-black/80">
            {MARQUE_MAGAZINE}
          </span>
          <span>
            {COUVERTURES.length} éditions de thème · {JEU_DE_54.length} numéros · 364 couvertures nommées
          </span>
          <Link to="/" className="underline transition hover:text-black">
            Revenir au site
          </Link>
        </div>
      </footer>
    </div>
  );
}
