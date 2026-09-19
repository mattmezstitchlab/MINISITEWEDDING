import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import {
  GUIDE_ARTICLES,
  INSOLITE_ARTICLES,
  MAGAZINE_HERO,
  MAGAZINE_HERO_REPLI,
  UNIVERSE_ARTICLES,
} from '../lib/magazine';
import { WEDDING_STYLES } from '../lib/weddingStyles';

/**
 * LE MAGAZINE
 *
 * La porte d'entrée éditoriale du site : les articles qui racontent chaque
 * univers, et les guides qui répondent aux questions de tous les mariages.
 */

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
};

export default function Magazine() {
  const [filtre, setFiltre] = useState<'tout' | 'univers' | 'guide' | 'insolite'>('tout');
  const [visuelHero, setVisuelHero] = useState(true);
  const aLaUne = UNIVERSE_ARTICLES[0];
  const total = UNIVERSE_ARTICLES.length + GUIDE_ARTICLES.length + INSOLITE_ARTICLES.length;

  return (
    <div className="vp-env min-h-screen overflow-x-clip bg-white text-[#0B0C12]">
      
      {/* Le hero : le visuel, puis ce que contient le magazine */}
      <header className="relative flex min-h-[100svh] items-end overflow-hidden bg-[#0B0C12] pt-32 text-white">
        {visuelHero && (
          <img
            src={MAGAZINE_HERO}
            alt=""
            onError={() => setVisuelHero(false)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {!visuelHero && (
          <img src={MAGAZINE_HERO_REPLI} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/55 to-black/35" />

        <div className="vp-page relative w-full pb-10 sm:pb-14">
          <span className="vp-eyebrow !text-white/70">Le Magazine VOWS</span>
          <h1
            className="vp-title mt-4 max-w-3xl text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
            style={{ fontSize: 'clamp(2.2rem, 5.4vw, 4.2rem)', lineHeight: 1.04 }}
          >
            Ce qu’il faut savoir avant de choisir.
          </h1>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-white/75">
            {UNIVERSE_ARTICLES.length} univers racontés en détail — le lieu, la journée heure par heure, les métiers
            qui la font tourner — et {GUIDE_ARTICLES.length} guides sur ce qui vaut pour tous les mariages :
            rétroplanning, budget, cagnotte, RSVP, allergènes.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {[
              { label: 'Articles', value: String(total) },
              { label: 'Univers', value: String(UNIVERSE_ARTICLES.length) },
              { label: 'Guides', value: String(GUIDE_ARTICLES.length) },
              { label: 'Insolite', value: String(INSOLITE_ARTICLES.length) },
            ].map((fait) => (
              <span
                key={fait.label}
                className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[12px] text-white backdrop-blur-sm"
              >
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/55">{fait.label}</span>
                <span className="ml-1.5 font-semibold">{fait.value}</span>
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Les filtres */}
      <section className="pb-8 pt-10 sm:pt-12">
        <div className="vp-page flex flex-wrap items-center gap-2">
          {([
            ['tout', 'Tout le magazine'],
            ['univers', `Les ${UNIVERSE_ARTICLES.length} univers`],
            ['guide', `Les ${GUIDE_ARTICLES.length} guides`],
            ['insolite', `Insolite (${INSOLITE_ARTICLES.length})`],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFiltre(id)}
              className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition ${
                filtre === id
                  ? 'border-black bg-black text-white'
                  : 'border-black/12 bg-white text-[#0B0C12] hover:border-black/40'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* L'article à la une */}
      {filtre === 'tout' && (
        <section className="pb-14">
          <div className="vp-page">
            <Link
              to={`/magazine/${aLaUne.slug}`}
              className="group grid overflow-hidden rounded-[30px] border border-black/8 bg-[#FAFAFC] lg:grid-cols-2"
            >
              <div className="relative aspect-[16/11] overflow-hidden lg:aspect-auto lg:h-full">
                <img
                  src={aLaUne.cover}
                  alt={aLaUne.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-10">
                <span className="inline-flex w-fit items-center rounded-full bg-black/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-black/55">
                  À la une · {aLaUne.kicker}
                </span>
                <h2 className="vp-title mt-4 text-[26px] leading-tight sm:text-[34px]">{aLaUne.title}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-black/60">{aLaUne.intro}</p>
                <span className="mt-5 flex items-center gap-3 text-[12.5px] font-semibold text-black/70">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {aLaUne.readingMinutes} min de lecture
                  </span>
                  <span className="flex items-center gap-1 transition group-hover:translate-x-0.5">
                    Lire l’article <ArrowRight size={13} />
                  </span>
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Les grilles d'articles */}
      {[
        { titre: 'Les univers, racontés', liste: UNIVERSE_ARTICLES, visible: filtre !== 'guide' },
        { titre: 'Les guides', liste: GUIDE_ARTICLES, visible: filtre === 'tout' || filtre === 'guide' },
        { titre: 'Insolite', liste: INSOLITE_ARTICLES, visible: filtre === 'tout' || filtre === 'insolite' },
      ]
        .filter((bloc) => bloc.visible)
        .map((bloc) => (
          <section key={bloc.titre} className="pb-16">
            <div className="vp-page">
              <h2 className="vp-title text-[22px] sm:text-[26px]">{bloc.titre}</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {bloc.liste.map((article) => (
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
        ))}

      <footer className="border-t border-black/5 py-10">
        <div className="vp-page flex flex-col items-center justify-between gap-3 text-[12.5px] text-black/50 sm:flex-row">
          <span className="vp-title text-[16px] font-bold italic tracking-wider text-black/80">VOWS</span>
          <span>
            {WEDDING_STYLES.length} univers · {UNIVERSE_ARTICLES.length + GUIDE_ARTICLES.length + INSOLITE_ARTICLES.length} articles
          </span>
          <Link to="/" className="underline transition hover:text-black">
            Revenir au site
          </Link>
        </div>
      </footer>
    </div>
  );
}
