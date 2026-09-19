import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { articleBySlug, badgeDUnivers, relatedArticles, UNIVERSE_ARTICLES } from '../lib/magazine';
import { styleById } from '../lib/weddingStyles';
import BandeDuHero from '../components/BandeDuHero';
import { cartesDesMoments, morceauDUneUnivers } from '../lib/cartesVivantes';
import RichText from '../components/RichText';

/**
 * UN ARTICLE DU MAGAZINE
 *
 * Un article d'univers se termine toujours par le même appel : ouvrir la page
 * de l'univers dont il parle, dans le site.
 */

export default function MagazineArticle() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? articleBySlug(slug) : undefined;

  if (!article) return <Navigate to="/magazine" replace />;

  const univers = article.universeId ? styleById(article.universeId) : null;
  const suivants = relatedArticles(article);
  /** L'article d'un univers : sa bande est celle des moments du Jour J. */
  const estUnivers = article.category === 'univers' && Boolean(article.universeId);
  const moments = estUnivers ? cartesDesMoments(article.universeId!) : [];
  const universTour = UNIVERSE_ARTICLES[0]?.universeId ?? null;
  const cartesDArticles = UNIVERSE_ARTICLES.map((un) => {
    const style = styleById(un.universeId ?? '');
    const track = morceauDUneUnivers();
    return {
      id: un.slug,
      cle: `article|${un.slug}`,
      titre: style?.name ?? un.title,
      sousTitre: un.kicker,
      badge: un.universeId ? badgeDUnivers(un.universeId) : un.kicker,
      accent: style?.accent,
      media: {
        image: un.cover,
        audio: track?.src,
        legende: un.intro,
      },
      actif: un.universeId === article.universeId,
      to: `/magazine/${un.slug}`,
    };
  });

  return (
    <div className="vp-env min-h-screen overflow-x-clip bg-white text-[#0B0C12]">
      {/* La couverture : la même hauteur que le hero de l'accueil, et la bande
          des univers en bas — on passe d'un article à l'autre d'un geste. */}
      <header className="relative flex min-h-[100svh] w-full flex-col justify-end overflow-hidden">
        <img src={article.cover} alt={article.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/40 to-black/30" />
        <div className="relative pb-10 pt-28">
          <div className="vp-page vp-page-read">
            <span className="rounded-full bg-white/95 px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-black">
              {article.kicker}
            </span>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="vp-title mt-4 text-white"
              style={{ fontSize: 'clamp(2rem, 4.6vw, 3.4rem)', lineHeight: 1.08 }}
            >
              {article.title}
            </motion.h1>
            <div className="mt-3 flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-white/70">
              <span className="flex items-center gap-1">
                <Clock size={12} /> {article.readingMinutes} min de lecture
              </span>
              {univers && <span>· Univers {univers.name}</span>}
            </div>
          </div>
        </div>

      </header>

      {/* La bande, sous le hero. Sur l'article d'un univers, ce sont **les
          moments du Jour J** — l'heure sur la carte, le morceau du moment, le
          cœur du public. Sur un guide, ce sont les univers, et l'on change
          d'article d'un clic. */}
      <BandeDuHero
        libelle={estUnivers ? 'Les moments du Jour J' : 'Changer d’univers'}
        styleId={article.universeId ?? universTour ?? 'traditionnel'}
        cartes={estUnivers ? moments : cartesDArticles}
      />

      <main className="py-12">
        <div className="vp-page vp-page-read">
          {/* L'essentiel de l'article, en chiffres — le réflexe magazine */}
          <div className="grid gap-px overflow-hidden rounded-[20px] border border-black/8 bg-black/8 sm:grid-cols-2 lg:grid-cols-4">
            {article.essentiel.map((bloc) => (
              <div key={bloc.label} className="bg-white p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/40">{bloc.label}</div>
                <div className="mt-1.5 text-[15px] font-bold leading-snug text-[#0B0C12]">{bloc.value}</div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-[18px] leading-relaxed text-black/75">{article.intro}</p>

          <div className="mt-10 space-y-10">
            {article.sections.map((section, i) => (
              <section key={section.heading}>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/35">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="vp-title mt-2 text-[24px] leading-tight sm:text-[28px]">{section.heading}</h2>
                <div className="mt-3 space-y-3">
                  {section.body.map((paragraphe) => (
                    <RichText
                      key={paragraphe}
                      text={paragraphe}
                      className="text-[15.5px] leading-relaxed text-black/70"
                    />
                  ))}
                </div>

                {/* Le déroulé horaire, traité comme une page de magazine */}
                {section.schedule && (
                  <div className="mt-5 border-y border-black/8">
                    {section.schedule.map((etape) => (
                      <div
                        key={`${etape.time}-${etape.title}`}
                        className="grid grid-cols-[72px_1fr] gap-4 border-b border-black/6 py-4 last:border-none"
                      >
                        <span className="font-mono text-[12.5px] font-bold tracking-wide text-[#0B0C12]">
                          {etape.time}
                        </span>
                        <div>
                          <div className="text-[15.5px] font-bold leading-snug text-[#0B0C12]">{etape.title}</div>
                          <p className="mt-1 text-[14px] leading-relaxed text-black/60">{etape.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {section.bullets && (
                  <ul className="mt-4 space-y-2 rounded-[18px] bg-[#FAFAFC] p-4">
                    {section.bullets.map((point) => (
                      <li key={point} className="flex items-start gap-2 text-[14px] leading-relaxed text-black/70">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-black/30" />
                        <span><RichText text={point} className="text-[14px] leading-relaxed text-black/70" /></span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* L'appel vers l'univers, quand l'article en parle */}
          {univers && (
            <Link
              to={`/?univers=${univers.id}`}
              className="group mt-12 flex items-center justify-between gap-4 rounded-[24px] border border-black/10 bg-white p-5 ring-1 ring-black/5 transition hover:border-black/25 hover:shadow-lg"
            >
              <span className="flex items-center gap-4">
                <img
                  src={univers.image}
                  alt={univers.name}
                  className="h-14 w-14 shrink-0 rounded-[16px] object-cover"
                />
                <span>
                  <span className="block text-[11px] font-mono uppercase tracking-wider text-black/40">
                    Passer à la pratique
                  </span>
                  <span className="block text-[16px] font-bold text-[#0B0C12]">
                    Voir la page de l’univers {univers.name}
                  </span>
                  <span className="block text-[13px] text-black/55">
                    Les trois écrans, la playlist, les prestataires et les informations pratiques.
                  </span>
                </span>
              </span>
              <ArrowRight size={18} className="shrink-0 text-black/50 transition group-hover:translate-x-1" />
            </Link>
          )}

          {/* À lire ensuite */}
          <section className="mt-14 border-t border-black/8 pt-8">
            <h2 className="vp-title text-[20px]">À lire ensuite</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {suivants.map((suivant) => (
                <Link
                  key={suivant.slug}
                  to={`/magazine/${suivant.slug}`}
                  className="group overflow-hidden rounded-[20px] border border-black/8 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={suivant.cover}
                      alt={suivant.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="p-3">
                    <div className="text-[13.5px] font-bold leading-snug text-[#0B0C12]">{suivant.title}</div>
                    <div className="mt-1 font-mono text-[10.5px] uppercase tracking-wider text-black/40">
                      {suivant.kicker}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-black/5 py-10">
        <div className="vp-page vp-page-read flex items-center justify-between text-[12.5px] text-black/50">
          <Link to="/magazine" className="underline transition hover:text-black">
            Tous les articles
          </Link>
          <Link to="/" className="underline transition hover:text-black">
            Revenir au site
          </Link>
        </div>
      </footer>
    </div>
  );
}
