import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { COUVERTURES, MARQUE_MAGAZINE } from '../lib/aimeMagazine';
import { JEU_DE_54, carteDuNumero, semaineDeLAnnee } from '../lib/jeuDeCartes';
import { composerEdition, lesQuatreSaisons, numerosDeLaSaison } from '../lib/aimeMoteur';
import { articlesPourRole, roleDuneAdresse } from '../lib/personaSuites';
import { useControlesDeBande } from '../lib/personaCourant';
import { usePersonaCourante } from '../lib/personaCourant';
import { enregistrerNavVerticale } from '../lib/navVerticale';
import { NAV_MAGAZINE } from '../lib/navDesPages';
import CouvertureMagazine from '../components/CouvertureMagazine';
import CouvertureSemaine from '../components/CouvertureSemaine';
import EditionSemaine from '../components/EditionSemaine';

/**
 * LE MAGAZINE — UN VISUEL, UN TITRE, ET LES COUVERTURES
 *
 * Le hero porte le visuel et **SUPER MAGAZINE**, au centre. En dessous, les
 * couvertures, dans l'ordre :
 *
 * 1. **les quatre saisons** — un fond uni, une création digitale sur l'amour de
 *    la saison, et la carte de la semaine. C'est le fond du magazine ;
 * 2. **les treize semaines** de la saison ouverte, en petites couvertures ;
 * 3. **le numéro du moment** — huit rubriques, toujours les mêmes, dont le
 *    contenu suit vos choix, votre rôle et votre univers ;
 * 4. **les éditions de thème** — les neuf couvertures d'AIME MAGAZINE, qui
 *    rassemblent les articles par sujet.
 *
 * Les flèches du dock passent d'un numéro au suivant : le magazine se feuillette
 * comme les rôles et les univers.
 */

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
};

export default function Magazine() {
  const [params] = useSearchParams();
  const role = roleDuneAdresse(params.get('role'));
  const moi = usePersonaCourante();

  /** Le numéro ouvert : la semaine où l'on est, ou celui qu'on a choisi. */
  const [numero, setNumero] = useState(() => semaineDeLAnnee(new Date()));
  /** Le temps de lecture : l'an dernier, cette semaine, l'an prochain. */
  const [temps, setTemps] = useState<'passe' | 'present' | 'futur'>('present');
  /** L'édition de thème ouverte, sous les couvertures. */
  const [themeId, setThemeId] = useState<string | null>(null);

  const carte = carteDuNumero(numero);
  const saison = carte.saison;
  const semaines = useMemo(() => numerosDeLaSaison(saison.id), [saison.id]);
  const saisons = useMemo(() => lesQuatreSaisons({ roleId: role?.id, styleId: undefined }), [role?.id]);

  const edition = useMemo(
    () => composerEdition({ numero, roleId: role?.id ?? moi.id, temps }),
    [numero, role?.id, moi.id, temps],
  );

  const siens = useMemo(() => (role ? articlesPourRole(role.id) : null), [role]);
  const theme = COUVERTURES.find((c) => c.id === themeId) ?? null;

  // La nav de droite : les articles, et de quoi faire ses courses.
  useEffect(() => {
    enregistrerNavVerticale(NAV_MAGAZINE);
    return () => enregistrerNavVerticale(null);
  }, []);

  /** Les flèches du dock feuillettent les 54 numéros. */
  const feuilleter = (pas: number) => {
    const total = JEU_DE_54.length;
    setNumero(((numero - 1 + pas + total) % total) + 1);
  };
  const surveiller = useControlesDeBande('magazine', {
    precedent: () => feuilleter(-1),
    suivant: () => feuilleter(1),
  });

  return (
    <div className="vp-env min-h-screen overflow-x-clip bg-white text-[#0B0C12]">
      {/* ———————————————— LE HERO : LE VISUEL, ET LE TITRE AU CENTRE ———————————————— */}
      <header
        className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
        style={{ background: saison.fond }}
      >
        {/* La création de la saison : le fond de la couverture, adouci pour que
            le titre passe devant sans jamais se battre avec elle. */}
        <img
          src={saison.visuel}
          alt=""
          className="absolute inset-0 h-full w-full scale-110 object-cover blur-[10px] brightness-[0.42] saturate-[0.9]"
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/60" />

        <div ref={surveiller} className="vp-page relative flex flex-col items-center text-center text-white">
          <span className="vp-eyebrow !text-white/70">{MARQUE_MAGAZINE}</span>
          <h1
            className="vp-title mt-4 text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
            style={{ fontSize: 'clamp(2.3rem, 5.6vw, 4.2rem)', lineHeight: 1.04 }}
          >
            SUPER MAGAZINE
          </h1>

          {/* La création digitale, au centre : le sceau de la saison en cours. */}
          <div
            className="mt-7 overflow-hidden rounded-[20px] shadow-[0_30px_70px_-24px_rgba(0,0,0,0.8)] ring-1 ring-white/25"
            style={{ width: 'clamp(150px, 20vw, 208px)' }}
          >
            <img
              src={saison.visuel}
              alt={`${saison.nom} — la création de la saison`}
              className="block aspect-[3/4.2] w-full object-cover"
            />
          </div>

          <p className="mt-6 text-[13px] leading-relaxed text-white/80">
            <span className="font-mono uppercase tracking-[0.18em]">
              {saison.symbole} {saison.nom}
            </span>
            <span className="mx-2 opacity-40">·</span>
            {edition.carte.nom}
            <span className="mx-2 opacity-40">·</span>
            {edition.carte.joker ? 'hors calendrier' : `semaine ${edition.carte.semaine}`} — le n°{' '}
            {edition.carte.numero}
          </p>
          {role && <p className="mt-3 text-[13.5px] text-white/70">Choisi pour {role.nom}.</p>}
        </div>
      </header>

      {/* ———————————————— LES QUATRE SAISONS, PUIS LES SEMAINES ———————————————— */}
      <section id="saisons" className="pb-10 pt-14">
        <div className="vp-page">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-black/10 pb-4">
            <h2 className="vp-title text-[22px] sm:text-[26px]">Les quatre saisons</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/45">
              {JEU_DE_54.length} numéros — {JEU_DE_54.filter((c) => c.joker).length} jokers
            </span>
          </div>
          <p className="mt-3 max-w-[640px] text-[13.5px] leading-relaxed text-black/55">
            Un fond uni, une création digitale sur l’amour de la saison : quatre couvertures de base,
            et sous chacune les treize semaines qui la composent — comme les treize cartes d’une couleur.
          </p>

          <div className="mt-8 flex flex-wrap items-start justify-center gap-6 sm:gap-8">
            {saisons.map((editionSaison) => (
              <CouvertureSemaine
                key={editionSaison.saison.id}
                edition={editionSaison}
                facteur={editionSaison.saison.id === saison.id ? 1 : 0.4}
                active={editionSaison.saison.id === saison.id}
                onChoisir={() => setNumero(editionSaison.numero)}
              />
            ))}
          </div>

          {/* Les treize semaines de la saison ouverte. */}
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
                  edition={composerEdition({ numero: c.numero, roleId: role?.id ?? moi.id, temps })}
                  taille="petite"
                  facteur={c.numero === numero ? 1 : 0.3}
                  active={c.numero === numero}
                  onChoisir={() => setNumero(c.numero)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ———————————————— LE NUMÉRO DU MOMENT ———————————————— */}
      <section id="numero" className="bg-[#F7F6F3] py-14">
        <div className="vp-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45">
                Le numéro du moment
              </span>
              <h2 className="vp-title mt-2 text-[22px] sm:text-[26px]">{edition.titre}</h2>
            </div>
            {/* Les trois temps : le même numéro, relu au passé et au futur. */}
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

          <div className="mt-7">
            <EditionSemaine edition={edition} />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-[12.5px] text-black/50">
            <span>
              Numéro {carte.numero} sur {JEU_DE_54.length} · {carte.joker ? 'un joker' : `semaine ${carte.semaine}`} ·
              les flèches du dock passent au suivant
            </span>
            {role && (
              <Link
                to="/magazine"
                className="inline-flex items-center gap-1.5 rounded-full border border-black/12 px-3 py-1.5 font-semibold text-black/70 no-underline transition hover:border-black/40 hover:text-black"
              >
                Tout le magazine <ArrowRight size={12} />
              </Link>
            )}
          </div>
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

          {/* L'édition ouverte : ses articles. */}
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

      <footer className="border-t border-black/5 py-10">
        <div className="vp-page flex flex-col items-center justify-between gap-3 text-[12.5px] text-black/50 sm:flex-row">
          <span className="vp-title text-[16px] font-bold italic tracking-wider text-black/80">
            {MARQUE_MAGAZINE}
          </span>
          <span>
            {COUVERTURES.length} éditions de thème · {JEU_DE_54.length} numéros dans l’année
          </span>
          <Link to="/" className="underline transition hover:text-black">
            Revenir au site
          </Link>
        </div>
      </footer>
    </div>
  );
}
