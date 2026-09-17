import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Palette, Images, MailCheck, Gift, MapPin, CalendarDays, QrCode, ChevronRight, Heart, Layers } from 'lucide-react';
import { WEDDING_STYLES, PHASES } from '../lib/weddingStyles';
import { publicPath } from '../lib/format';
import VisionImage, { TiltCard, VisionFrame } from '../components/vision/VisionImage';
import ImmersiveThemes from '../components/ImmersiveThemes';

const STEPS = [
  { n: '01', title: 'Je crée', text: 'Prénoms, date, lieu. Trois réponses, trente secondes.' },
  { n: '02', title: 'Je choisis', text: 'Un environnement spatial parmi dix directions qui cassent les codes.' },
  { n: '03', title: 'J’ajoute', text: 'Photos, programme, infos — le site se compose seul.' },
  { n: '04', title: 'Je partage', text: 'Un lien, un QR code. Vos invités sont conquis.' },
];

const MODULES = [
  { icon: MailCheck, title: 'RSVP élégant', text: 'Présences, régimes, hébergement. Des statistiques limpides, jamais de tableaux austères.' },
  { icon: Gift, title: 'Liste & cagnotte', text: 'Voyage de noces, cagnotte, liste de cadeaux. Objectifs, progression, bouton Participer.' },
  { icon: Images, title: 'Bibliothèque média', text: 'Onze univers photo, six collections cohérentes, vos propres images en un glisser-déposer.' },
  { icon: MapPin, title: 'Infos pratiques', text: 'Adresses, parking, hébergements, dress code. Des cartes de verre, toujours claires.' },
  { icon: CalendarDays, title: 'Programme Jour J', text: 'Une timeline spatiale : cérémonie, cocktail, dîner, bal. Heure, lieu, photo.' },
  { icon: QrCode, title: 'Partage magique', text: 'Un lien à vos prénoms, un QR code à imprimer, partage WhatsApp, Messages, Email.' },
];

const fadeUp = { initial: { opacity: 0, y: 26 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' } };

function BrandMark({ className = 'w-9 h-9 text-[14px]' }: { className?: string }) {
  return (
    <span className={`vp-glyph shrink-0 rounded-full font-semibold ${className}`}>W</span>
  );
}

export default function Landing() {
  return (
    <div className="vp-env min-h-screen overflow-x-clip text-[#0B0C12]">
      {/* Barre de navigation : capsule de verre flottante */}
      <nav className="fixed top-3 left-1/2 z-50 w-[calc(100%-1.25rem)] max-w-5xl -translate-x-1/2 sm:top-4">
        <div className="vp-glass vp-spec flex items-center justify-between gap-3 rounded-[26px] px-4 py-2.5 sm:px-5">
          <Link to="/" className="flex items-center gap-2.5">
            <BrandMark />
            <span className="vp-title text-[15px]">Wedding Site</span>
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {[{ href: '#styles', label: 'Environnements' }, { href: '#styles-immersive', label: 'Manifeste' }, { href: '#experience', label: 'Éditeur' }, { href: '#modules', label: 'Modules' }].map((l) => (
              <a key={l.href} href={l.href} className="vp-press rounded-full px-3.5 py-2 text-[13.5px] font-medium text-[var(--vp-ink-soft)] transition hover:bg-black/[0.055] hover:text-[var(--vp-ink)]">
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link to="/p/matt-marie" className="vp-btn vp-btn-glass vp-press hidden !px-4 !py-2 !text-[13.5px] sm:inline-flex">
              Voir un exemple
            </Link>
            <Link to="/creer" className="vp-btn vp-press !px-4.5 !py-2 !text-[13.5px]">
              Créer mon site <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero : environnement + fenêtre flottante */}
      <header className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 pb-20 pt-32 sm:px-8 sm:pt-36">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="vp-title mt-6"
              style={{ fontSize: 'clamp(2.7rem, 6.6vw, 5rem)' }}
            >
              Votre mariage.
              <br />
              Votre histoire.
              <br />
              Un seul endroit.
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="vp-body mx-auto mt-6 max-w-lg lg:mx-0 lg:text-[17px]">
              Le mini-site de votre mariage, composé automatiquement à partir de quelques réponses. Aucun outil à apprendre. Juste de l’émotion, en verre et en lumière.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <Link to="/creer" className="vp-btn vp-press w-full !px-8 !py-4 sm:w-auto">
                Créer mon site <ArrowRight size={16} />
              </Link>
              <Link to="/p/matt-marie" className="vp-btn vp-btn-glass vp-press w-full !px-8 !py-4 sm:w-auto">
                Voir un exemple
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05 }} className="mt-10 hidden flex-wrap items-center justify-center gap-2 lg:flex lg:justify-start">
              {STEPS.map((s) => (
                <span key={s.n} className="vp-chip !text-[12px] text-[var(--vp-muted)]">
                  <span className="vp-num font-semibold text-[var(--vp-ink)]">{s.n}</span> {s.title}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Fenêtre flottante : l’aperçu du site, comme une fenêtre visionOS */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 12 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.5, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="vp-perspective relative mx-auto w-full max-w-[440px] lg:max-w-none"
          >
            <TiltCard max={5}>
              <div className="vp-glass overflow-hidden rounded-[34px] p-2.5">
                <div className="flex items-center gap-2 px-2 pb-2.5 pt-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5EA]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5EA]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5EA]" />
                  <span className="vp-caption ml-2 truncate text-[11px]">{publicPath('matt-marie')}</span>
                </div>
                <div className="overflow-hidden rounded-[26px]">
                  <VisionImage
                    src="/images/hero-wedding.jpg"
                    alt="Mariage Matt & Marie"
                    loading="eager"
                    fallbackLabel="Matt & Marie"
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
                <div className="flex items-end justify-between gap-4 px-3 pb-2 pt-4">
                  <div>
                    <div className="vp-eyebrow">Château de Chantilly</div>
                    <div className="vp-title mt-1 text-[27px]">Matt &amp; Marie</div>
                    <div className="vp-num vp-caption mt-0.5">18.07.2027</div>
                  </div>
                  <div className="text-right">
                    <div className="vp-eyebrow">Compte à rebours</div>
                    <div className="vp-title vp-num mt-0.5 text-[22px]">J-304</div>
                  </div>
                </div>
              </div>
            </TiltCard>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.15, type: 'spring', damping: 20 }}
              className="vp-glass vp-spec absolute -bottom-6 -left-4 flex items-center gap-2.5 rounded-[20px] px-4 py-3 sm:-left-8"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--vp-green)]" />
              <span className="text-[13px] font-semibold">Site publié</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3, type: 'spring', damping: 20 }}
              className="vp-glass-dark vp-spec-dark absolute -right-3 top-8 flex items-center gap-2 rounded-[18px] px-3.5 py-2.5 text-white sm:-right-6"
            >
              <Layers size={15} />
              <span className="text-[12.5px] font-semibold">11 sections</span>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* Quatre gestes */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="mx-auto max-w-2xl text-center">
            <div className="vp-eyebrow">Compris en 10 secondes</div>
            <h2 className="vp-h2 mt-4" style={{ fontSize: 'clamp(2rem, 4.4vw, 3rem)' }}>Quatre gestes. Zéro effort.</h2>
          </motion.div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <motion.div key={s.n} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.08 }}>
                <TiltCard className="h-full">
                  <div className="vp-glass vp-spec vp-lift h-full rounded-[26px] p-7">
                    <span className="vp-glyph h-11 w-11 rounded-[15px]">
                      <span className="vp-num text-[13px] font-semibold">{s.n}</span>
                    </span>
                    <div className="vp-h2 mt-5 text-[22px]">{s.title}</div>
                    <p className="vp-caption mt-2 leading-relaxed">{s.text}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Environnements */}
      <section id="styles" className="overflow-hidden py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="vp-eyebrow">Dix environnements • 0 doublon</div>
              <h2 className="vp-h2 mt-4" style={{ fontSize: 'clamp(2rem, 4.4vw, 3rem)' }}>
                Choisissez votre espace.
                <br />
                Le reste est automatique.
              </h2>
              <p className="vp-caption mt-3 max-w-md">Avant : bouquet.jpg en double. Maintenant : 10 visuels uniques qui n’ont rien à voir avec un mariage.</p>
            </div>
            <Link to="#styles-immersive" className="vp-chip vp-press shrink-0 bg-black text-white hover:bg-black/80">
              Voir la verticale immersive <ChevronRight size={16} />
            </Link>
          </motion.div>
        </div>
        <div className="no-scrollbar mt-10 flex gap-4 overflow-x-auto px-5 pb-4 sm:px-8">
          {WEDDING_STYLES.map((s, i) => (
            <motion.div key={s.id} {...fadeUp} transition={{ duration: 0.6, delay: (i % 4) * 0.07 }} className="w-[230px] shrink-0 sm:w-[266px]">
              <TiltCard max={6} className="h-full">
                <div className="vp-lift group h-full">
                  <div className="overflow-hidden rounded-[24px]">
                    <VisionImage
                      src={s.image}
                      alt={s.name}
                      fallbackLabel={s.name}
                      aura={s.aura}
                      className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex items-start justify-between gap-3 px-1 pt-3">
                    <div>
                      <div className="vp-title text-[18px]">{s.name}</div>
                      <div className="vp-caption mt-0.5">{s.tagline}</div>
                    </div>
                    <span className="mt-1.5 h-4 w-4 shrink-0 rounded-full" style={{ background: s.accent }} />
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* GRANDE VERTICALITÉ IMMERSIVE - PARALLAX */}
      <ImmersiveThemes />

      {/* Éditeur */}
      <section id="experience" className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }}>
            <div className="vp-eyebrow">L’éditeur</div>
            <h2 className="vp-h2 mt-4" style={{ fontSize: 'clamp(2rem, 4.4vw, 3rem)' }}>
              Choisir. Modifier.
              <br />
              Voir. Publier.
            </h2>
            <p className="vp-body mt-5 max-w-md">
              Pas de panneau rempli de paramètres. Au centre, votre site en vrai. Autour, des panneaux de verre qui apparaissent quand vous en avez besoin. Un clic sur une photo ouvre vos images, un clic sur un texte ouvre la typographie.
            </p>
            <div className="mt-8 space-y-2.5">
              {['Sections réorganisables par glisser-déposer', 'Réglages contextuels, jamais de fouillis', 'Aperçu mobile et ordinateur instantané'].map((t) => (
                <div key={t} className="flex items-center gap-3 text-[15px] font-medium">
                  <span className="vp-glyph h-6 w-6 rounded-full text-[11px]">✓</span>
                  {t}
                </div>
              ))}
            </div>
            <Link to="/creer" className="vp-btn vp-press mt-8 !px-7">
              <Palette size={16} /> Personnaliser mon mariage
            </Link>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.8 }} className="vp-perspective relative">
            <TiltCard max={4}>
              <div className="vp-glass rounded-[34px] p-2.5">
                <VisionFrame radius={26}>
                  <VisionImage src="/images/table-noir.jpg" alt="Aperçu de l’éditeur" fallbackLabel="Réception" className="aspect-[4/5] w-full object-cover sm:aspect-square" />
                </VisionFrame>
                <div className="flex items-center justify-between gap-4 px-3 pb-1.5 pt-4">
                  <div>
                    <div className="vp-eyebrow">Matt &amp; Marie</div>
                    <div className="vp-title vp-num mt-0.5 text-[21px]">18.07.2027</div>
                  </div>
                  <Link to="/p/matt-marie" className="vp-btn vp-btn-glass vp-press !px-4 !py-2 !text-[13px]">Voir</Link>
                </div>
              </div>
            </TiltCard>
            <div className="vp-glass vp-spec absolute -top-5 right-0 flex items-center gap-2.5 rounded-[20px] px-4 py-3 sm:-right-4">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--vp-green)]" />
              <span className="text-[13px] font-semibold">Aperçu en direct</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modules — environnement sombre */}
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

      {/* Exemple réel */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-28">
        <motion.div {...fadeUp} transition={{ duration: 0.8 }} className="vp-perspective mx-auto max-w-6xl">
          <TiltCard max={3}>
            <div className="overflow-hidden rounded-[38px] bg-white">
              <VisionImage src="/images/chateau.jpg" alt="Château de Chantilly" fallbackLabel="Château de Chantilly" className="h-[300px] w-full object-cover sm:h-[420px]" />
              <div className="max-w-xl px-8 py-10 sm:px-12 sm:py-12">
                <div className="vp-eyebrow">Un vrai mariage</div>
                <div className="vp-title mt-3" style={{ fontSize: 'clamp(2rem, 4.4vw, 3rem)' }}>
                  Matt &amp; Marie
                  <span className="vp-num text-[var(--vp-muted)]"> · 18.07.2027</span>
                </div>
                <p className="vp-body mt-3">Château de Chantilly. Entrez, explorez, répondez au RSVP — comme un invité.</p>
                <Link to="/p/matt-marie" className="vp-btn vp-press mt-6">
                  Voir l’exemple <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </section>

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
              Créer mon site <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>

      <footer className="px-5 pb-10">
        <div className="vp-glass vp-spec mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 rounded-[26px] px-6 py-6 text-[13px] text-[var(--vp-muted)] sm:flex-row">
          <div className="flex items-center gap-2.5">
            <BrandMark className="h-7 w-7 text-[11px]" />
            <span className="vp-title text-[14px] text-[var(--vp-ink)]">Wedding Site</span>
          </div>
          <div className="text-center">Votre mariage. Votre histoire. Un seul endroit.</div>
          <div className="flex items-center gap-4">
            <Link to="/creer" className="font-medium text-[var(--vp-ink-soft)] transition hover:text-[var(--vp-accent)]">Créer</Link>
            <Link to="/p/matt-marie" className="font-medium text-[var(--vp-ink-soft)] transition hover:text-[var(--vp-accent)]">Exemple</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
