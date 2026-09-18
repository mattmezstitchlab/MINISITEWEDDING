import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MailCheck, Gift, Images, MapPin, CalendarDays, QrCode, Heart } from 'lucide-react';
import { PHASES } from '../lib/weddingStyles';
import { TiltCard } from '../components/vision/VisionImage';
import HeroCycle from '../components/HeroCycle';
import UnifiedUniverseMenu from '../components/UnifiedUniverseMenu';
import ParallaxSection from '../components/ParallaxSection';
import HeroAiPrompt from '../components/HeroAiPrompt';
import RoleCockpitShowcase from '../components/RoleCockpitShowcase';
import ErrorBoundary from '../components/ErrorBoundary';

const HERO_ROTATING_TITLES = [
  'Votre mariage. Votre histoire.\nUn seul endroit.',
  'Une vision. Des missionnaires.\nL’impossible devient réel.',
  'Mariés, invités, prestataires.\nLe même instant, sans fausse note.',
];

const MODULES = [
  { icon: MailCheck, title: 'RSVP élégant', text: 'Présences, régimes, hébergement. Des statistiques limpides, jamais de tableaux austères.' },
  { icon: Gift, title: 'Liste & cagnotte', text: 'Voyage de noces, cagnotte, liste de cadeaux. Objectifs, progression, bouton Participer.' },
  { icon: Images, title: 'Bibliothèque média', text: 'Des collections cohérentes, vos propres images en un glisser-déposer.' },
  { icon: MapPin, title: 'Infos pratiques', text: 'Adresses, parking, hébergements, dress code. Des cartes de verre, toujours claires.' },
  { icon: CalendarDays, title: 'Programme Jour J', text: 'Une timeline spatiale : cérémonie, cocktail, dîner, bal. Heure, lieu, photo.' },
  { icon: QrCode, title: 'Partage magique', text: 'Un lien à vos prénoms, un QR code à imprimer, partage WhatsApp, Messages, Email.' },
];

const fadeUp = { initial: { opacity: 0, y: 26 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' } };

/**
 * Accueil : le visuel, le champ, un écran par rôle, ce qui est inclus.
 *
 * Tout le reste (Event OS, shows techniques, mosaïques de démonstration) a été
 * retiré du parcours : une page d'accueil doit tenir en six sections.
 */
export default function Landing() {
  const navigate = useNavigate();
  const [titleIdx, setTitleIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIdx((prev) => (prev + 1) % HERO_ROTATING_TITLES.length);
    }, 4800);
    return () => clearInterval(interval);
  }, []);

  const scrollToHero = () => {
    const el = document.getElementById('hero-ai-container');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const input = el.querySelector('input');
      input?.focus();
    }
  };

  /** Choisir un univers, c'est déjà créer : on va au questionnaire, il est pré-sélectionné. */
  const startWithStyle = (styleId: string) => {
    navigate('/creer', { state: { preselectedStyle: styleId } });
  };

  return (
    <div className="vp-env min-h-screen overflow-x-clip text-[#0B0C12] pb-16">
      {/* Barre de navigation : le logo, les univers, et l'unique bouton qui compte */}
      <nav className="fixed top-3 left-1/2 z-50 w-[calc(100%-1.25rem)] max-w-5xl -translate-x-1/2 sm:top-4">
        <div className="flex items-center justify-between gap-3 rounded-[26px] bg-white px-4 py-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] ring-1 ring-black/5 sm:px-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="vp-title text-[18px] font-bold italic tracking-wider text-[#0B0C12]">VOWS</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <UnifiedUniverseMenu
              selectedStyleId={null}
              onSelectStyle={(style) => { if (style) startWithStyle(style.id); }}
            />
            <Link
              to="/creer"
              className="flex items-center gap-1.5 rounded-full bg-[#0B0C12] px-4 py-2 text-[12.5px] font-semibold text-white shadow-sm transition hover:bg-black/80"
            >
              Créer notre site
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero plein écran : le grand visuel, et le champ au centre */}
      <HeroCycle>
        <div className="mx-auto flex flex-col items-center justify-center text-center">
          <div className="min-h-[140px] sm:min-h-[160px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.h1
                key={titleIdx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="vp-title max-w-4xl text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] whitespace-pre-line"
                style={{ fontSize: 'clamp(2.4rem, 6vw, 4.6rem)', lineHeight: 1.08 }}
              >
                {HERO_ROTATING_TITLES[titleIdx]}
              </motion.h1>
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="mt-4 w-full"
          >
            <ErrorBoundary>
              <HeroAiPrompt />
            </ErrorBoundary>
          </motion.div>
        </div>
      </HeroCycle>

      {/* L'écran : un cockpit par rôle, une seule timeline */}
      <ErrorBoundary>
        <RoleCockpitShowcase />
      </ErrorBoundary>

      {/* Modules — environnement clair */}
      <section id="modules" className="relative mx-3 overflow-hidden rounded-[40px] border border-black/6 bg-white px-5 py-20 sm:mx-6 sm:px-8 sm:py-28">
        <div className="relative mx-auto max-w-6xl">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="mx-auto max-w-2xl text-center">
            <div className="vp-eyebrow">Tout est inclus</div>
            <h2 className="vp-h2 mt-4" style={{ fontSize: 'clamp(2rem, 4.4vw, 3rem)' }}>Un objet complet, en couches</h2>
            <p className="vp-body mt-4">RSVP, cagnotte, galerie, programme, FAQ — chaque module naît déjà rempli. Vous ajustez, c’est tout.</p>
          </motion.div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((m, i) => (
              <motion.div key={m.title} {...fadeUp} transition={{ duration: 0.6, delay: (i % 3) * 0.09 }}>
                <TiltCard className="h-full">
                  <div className="vp-glass vp-spec vp-lift h-full rounded-[26px] p-7">
                    <span className="vp-glyph h-11 w-11 rounded-[15px]">
                      <m.icon size={19} strokeWidth={1.8} />
                    </span>
                    <div className="vp-h2 mt-5 text-[20px]">{m.title}</div>
                    <p className="vp-caption mt-2 leading-relaxed">{m.text}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Phases */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="text-center">
            <div className="vp-eyebrow">Avant · Pendant · Après</div>
            <h2 className="vp-h2 mt-4" style={{ fontSize: 'clamp(2rem, 4.4vw, 3rem)' }}>Un site qui vit avec vous</h2>
          </motion.div>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {PHASES.map((p, i) => (
              <motion.div key={p.id} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.09 }} className="h-full">
                <div className="vp-glass vp-spec vp-lift relative h-full overflow-hidden rounded-[26px] p-7">
                  <span className="absolute inset-x-0 top-0 h-[3px] bg-[var(--vp-ink)]" style={{ opacity: 0.1 + i * 0.14 }} />
                  <div className="vp-eyebrow">Phase {i + 1}</div>
                  <div className="vp-h2 mt-2 text-[26px]">{p.name}</div>
                  <p className="vp-caption mt-2">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.p {...fadeUp} transition={{ duration: 0.7 }} className="vp-body mx-auto mt-8 max-w-xl text-center !text-[var(--vp-muted)] italic">
            « Après le mariage, il devient la mémoire numérique de votre jour. »
          </motion.p>
        </div>
      </section>

      {/* Un seul parallax : le message de fond */}
      <ParallaxSection image="/images/zero-contrainte-wedding.jpg" overlayOpacity={0.65} heightClass="min-h-[70vh]">
        <motion.div {...fadeUp} transition={{ duration: 0.8 }} className="mx-auto max-w-3xl">
          <span className="vp-eyebrow !text-white/70">Zéro contrainte</span>
          <h2
            className="vp-title mt-4 text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
            style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)', lineHeight: 1.1 }}
          >
            Le plus beau jour se vit.<br />
            Il ne s’administre pas.
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-[16.5px] leading-relaxed text-white/80">
            Fini les tableaux Excel et les messages perdus. Tout converge naturellement au même endroit,
            avec une élégance qui impressionne vos invités dès la première seconde.
          </p>
        </motion.div>
      </ParallaxSection>

      {/* Appel final */}
      <section className="px-5 pb-24 sm:px-8">
        <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="vp-glass vp-spec mx-auto max-w-4xl overflow-hidden rounded-[38px] px-8 py-16 text-center sm:py-20">
          <div className="relative">
            <span className="vp-glyph mx-auto h-14 w-14 rounded-[20px]">
              <Heart size={24} strokeWidth={1.8} />
            </span>
            <h2 className="vp-h2 mt-6" style={{ fontSize: 'clamp(2rem, 4.4vw, 3rem)' }}>
              Et si c’était vraiment
              <br />
              le site de votre mariage ?
            </h2>
            <p className="vp-body mx-auto mt-4 max-w-md">Trente secondes pour commencer. Une émotion pour longtemps.</p>
            <Link to="/creer" className="vp-btn vp-press mt-8 !px-9 !py-4">
              Générer notre projet <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>

      <footer className="px-5 pb-10">
        <div className="vp-glass vp-spec mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 rounded-[26px] px-6 py-6 text-[13px] text-[var(--vp-muted)] sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="vp-title text-[17px] font-bold italic tracking-wider text-[var(--vp-ink)]">VOWS</span>
          </div>
          <div className="text-center">Votre mariage. Votre histoire. Un seul endroit.</div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={scrollToHero}
              className="font-medium text-[var(--vp-ink-soft)] transition hover:text-[var(--vp-accent)]"
            >
              Décrire notre mariage
            </button>
            <Link to="/creer" className="font-medium text-[var(--vp-ink-soft)] transition hover:text-[var(--vp-accent)]">
              Créer
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
