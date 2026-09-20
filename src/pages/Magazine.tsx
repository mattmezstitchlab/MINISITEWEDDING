import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { COUVERTURES, MARQUE_MAGAZINE, couvertureParId } from '../lib/aimeMagazine';
import { articlesPourRole, roleDuneAdresse } from '../lib/personaSuites';
import { useControlesDeBande } from '../lib/personaCourant';
import { enregistrerNavVerticale } from '../lib/navVerticale';
import { NAV_MAGAZINE } from '../lib/navDesPages';
import CouvertureMagazine from '../components/CouvertureMagazine';

/**
 * LE MAGAZINE — LA REVUE, ÉDITION PAR ÉDITION
 *
 * Une seule porte, et pas d'étagère : **une couverture**, et le thème qu'elle
 * ouvre. On feuillette — les flèches du dock, ou un clic sur une couverture — et
 * les articles de l'édition se lisent en dessous.
 *
 * Tout ce qui se répétait a disparu : plus de double titre (la barre dit déjà où
 * l'on est), plus de compteurs, plus de boutons de filtres. **Les couvertures
 * sont le rangement.**
 *
 * « ?role=fleuriste » reste : la revue ne montre alors que ce qui concerne ce
 * rôle, et propose de tout reprendre.
 */

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
};

export default function Magazine() {
  const [params] = useSearchParams();
  const role = roleDuneAdresse(params.get('role'));

  /** L'édition ouverte : celle dont on lit les articles. */
  const [editionId, setEditionId] = useState(COUVERTURES[0]!.id);
  const index = Math.max(0, COUVERTURES.findIndex((c) => c.id === editionId));
  const edition = COUVERTURES[index] ?? COUVERTURES[0]!;

  const siens = useMemo(() => (role ? articlesPourRole(role.id) : null), [role]);

  // La nav de droite : les articles, et de quoi faire ses courses.
  useEffect(() => {
    enregistrerNavVerticale(NAV_MAGAZINE);
    return () => enregistrerNavVerticale(null);
  }, []);

  /**
   * **Les flèches du dock feuillettent la revue** : quand ce hero est à l'écran,
   * elles passent d'une édition à la suivante — comme les rôles et les univers.
   */
  const feuilleter = (pas: number) => {
    const suivant = COUVERTURES[(index + pas + COUVERTURES.length) % COUVERTURES.length]!;
    setEditionId(suivant.id);
  };
  const surveiller = useControlesDeBande('magazine', {
    precedent: () => feuilleter(-1),
    suivant: () => feuilleter(1),
  });

  /** Ce qui se lit : l'édition ouverte, ou les articles d'un rôle. */
  const articles = role ? siens! : edition.articles;

  return (
    <div className="vp-env min-h-screen overflow-x-clip bg-white text-[#0B0C12]">
      {/* ————————————————— LA COUVERTURE : LE TITRE, PUIS LES ÉDITIONS ————————————————— */}
      <header
        ref={surveiller}
        className="relative overflow-hidden bg-[#0B0C12] pb-14 pt-28 text-white sm:pt-32"
      >
        <div className="vp-page">
          <div className="flex flex-col items-center text-center">
            <h1
              className="vp-title text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
              style={{ fontSize: 'clamp(2.2rem, 5.4vw, 4rem)', lineHeight: 1.04 }}
            >
              SUPER MAGAZINE
            </h1>
            <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-white/70">
              {role
                ? `Choisi pour ${role.nom} : ce qui parle de son métier, et rien d’autre.`
                : `${MARQUE_MAGAZINE} — ${COUVERTURES.length} éditions : un thème par couverture, et les articles dedans.`}
            </p>
          </div>

          {/* LES COUVERTURES : la précédente, l'ouverte, la suivante. */}
          <div className="mt-12 flex items-center justify-center gap-5">
            {COUVERTURES.length >= 3 && (
              <div className="hidden lg:block">
                <CouvertureMagazine
                  couverture={COUVERTURES[(index - 1 + COUVERTURES.length) % COUVERTURES.length]!}
                  facteur={0.2}
                  onChoisir={() => feuilleter(-1)}
                />
              </div>
            )}

            <CouvertureMagazine couverture={edition} active onChoisir={() => setEditionId(edition.id)} />

            {COUVERTURES.length >= 3 && (
              <div className="hidden lg:block">
                <CouvertureMagazine
                  couverture={COUVERTURES[(index + 1) % COUVERTURES.length]!}
                  facteur={0.2}
                  onChoisir={() => feuilleter(1)}
                />
              </div>
            )}
          </div>

          {/* Le sommaire des éditions : un mot par couverture, pour aller droit au but. */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {COUVERTURES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setEditionId(c.id)}
                aria-pressed={c.id === edition.id}
                className={`rounded-full border px-3 py-1.5 text-[11.5px] transition ${
                  c.id === edition.id
                    ? 'border-white bg-white font-semibold text-[#0B0C12]'
                    : 'border-white/20 text-white/70 hover:border-white/50 hover:text-white'
                }`}
              >
                <span className="font-mono text-[9.5px] text-current opacity-60">{c.numero}</span>{' '}
                {c.theme}
              </button>
            ))}
          </div>

          {role && (
            <div className="mt-6 text-center">
              <Link
                to="/magazine"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-[12.5px] font-semibold text-white/85 no-underline transition hover:border-white hover:text-white"
              >
                Tout le magazine <ArrowRight size={13} />
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* ————————————————————— L'ÉDITION OUVERTE ————————————————————— */}
      <section id="articles" className="pb-16 pt-12">
        <div className="vp-page">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-black/10 pb-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-black/45">
                {MARQUE_MAGAZINE} · N° {edition.numero}
              </span>
              <h2 className="vp-title mt-2 text-[24px] sm:text-[30px]">
                {role ? `Les articles de ${role.nom}` : edition.theme}
              </h2>
            </div>
            <span className="text-[12.5px] text-black/50">
              {articles.length} article{articles.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
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

      {/* ————————————————————— LES AUTRES ÉDITIONS ————————————————————— */}
      {!role && (
        <section id="editions" className="border-t border-black/5 bg-[#FAFAFC] py-14">
          <div className="vp-page">
            <h2 className="vp-title text-[20px] sm:text-[24px]">Les autres éditions</h2>
            <p className="mt-2 text-[13.5px] text-black/55">
              Un thème par couverture — et un article peut appartenir à plusieurs, quand le sujet
              le mérite.
            </p>
            <div className="mt-7 flex flex-wrap gap-4">
              {COUVERTURES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setEditionId(c.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`group flex items-center gap-3 rounded-[16px] border p-3 text-left transition ${
                    c.id === edition.id
                      ? 'border-black/40 bg-white'
                      : 'border-black/10 bg-white/60 hover:border-black/30 hover:bg-white'
                  }`}
                >
                  <span
                    className="block h-14 w-11 shrink-0 overflow-hidden rounded-[6px] bg-[#0B0C12]"
                    style={{ boxShadow: `inset 0 3px 0 ${c.accent}` }}
                  >
                    <img src={c.visuel} alt="" className="h-full w-full object-cover opacity-85" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-[9.5px] uppercase tracking-[0.18em] text-black/40">
                      N° {c.numero}
                    </span>
                    <span className="mt-0.5 block max-w-[190px] truncate text-[13.5px] font-semibold">
                      {c.theme}
                    </span>
                    <span className="mt-0.5 block font-mono text-[10px] text-black/45">
                      {c.articles.length} articles
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="border-t border-black/5 py-10">
        <div className="vp-page flex flex-col items-center justify-between gap-3 text-[12.5px] text-black/50 sm:flex-row">
          <span className="vp-title text-[16px] font-bold italic tracking-wider text-black/80">
            {MARQUE_MAGAZINE}
          </span>
          <span>
            {COUVERTURES.length} éditions · {couvertureParId(edition.id)?.articles.length ?? 0} articles
            dans celle-ci
          </span>
          <Link to="/" className="underline transition hover:text-black">
            Revenir au site
          </Link>
        </div>
      </footer>
    </div>
  );
}
