import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Gift, Images, MailCheck, MapPin, MessageCircleQuestion } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { WEDDING_STYLES } from '../lib/weddingStyles';
import type { WeddingStyle } from '../lib/weddingStyles';
import { getThemeConfig } from '../lib/themeConfigs';
import { daysUntil, formatDateLong } from '../lib/format';
import { usePrefersReducedMotion, useTabVisible } from '../lib/useReducedMotion';
import VisionImage from './vision/VisionImage';

/**
 * Les dix mini-sites dans un téléphone.
 *
 * Le contenu affiché n’est pas décoratif : il vient de `themeConfigs.ts`, la
 * même source que celle qui amorce un vrai site. Ce que l’on voit ici — titre
 * des sections, horaires du programme, infos pratiques, cadeaux, questions —
 * est exactement ce que contiendra le mini-site de cet environnement.
 */

/** Millisecondes passées sur chaque mini-site. */
const STEP_MS = 6500;

/** Couple et date d’illustration : le contenu, lui, est celui du thème. */
const COUPLE = { p1: 'Camille', p2: 'Hugo' };
const WEDDING_DATE = '2027-06-12';

/** Trois photos pour la galerie, communes à tous les aperçus. */
const GALLERY = ['/images/alliances.jpg', '/images/champagne.jpg', '/images/danse.jpg'];

/** Progression illustrative de la cagnotte. */
const GIFT_PROGRESS = 0.42;

const fadeUp = { initial: { opacity: 0, y: 26 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' } };

/** Palette dérivée de l’environnement, pour que l’aperçu respire le même thème. */
function palette(style: WeddingStyle) {
  const dark = style.dark;
  return {
    dark,
    bg: dark ? '#0A0A0E' : '#FFFFFF',
    card: dark ? 'rgba(255,255,255,0.06)' : 'rgba(11,12,18,0.035)',
    line: dark ? 'rgba(255,255,255,0.12)' : 'rgba(11,12,18,0.08)',
    ink: dark ? '#F5F5F7' : '#14151A',
    muted: dark ? 'rgba(245,245,247,0.58)' : 'rgba(20,21,26,0.55)',
    accent: style.accent,
  };
}

function Block({ title, icon: Icon, children, p }: {
  title: string;
  icon: typeof Clock;
  children: ReactNode;
  p: ReturnType<typeof palette>;
}) {
  return (
    <div className="px-4 pt-5">
      <div className="flex items-center gap-1.5" style={{ color: p.muted }}>
        <Icon size={10} strokeWidth={2.2} />
        <span className="text-[8.5px] font-semibold uppercase tracking-[0.16em]">{title}</span>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

/** Le mini-site, tel qu’il s’affiche dans l’écran du téléphone. */
function MiniSite({ style }: { style: WeddingStyle }) {
  const config = getThemeConfig(style.id);
  const p = palette(style);
  const card: CSSProperties = { background: p.card, borderRadius: 12, border: `1px solid ${p.line}` };
  const euros = new Intl.NumberFormat('fr-FR');

  return (
    <div className="h-full w-full" style={{ background: p.bg, color: p.ink }}>
      {/* Hero du mini-site */}
      <div className="relative h-[46%] min-h-[220px] w-full overflow-hidden">
        <VisionImage src={style.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 4%, rgba(0,0,0,0.25) 46%, rgba(0,0,0,0.12) 100%)' }} />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <div className="text-[8px] font-semibold uppercase tracking-[0.22em] text-white/70">
            {config?.editorial.hero_subtitle ?? 'Nous nous marions'}
          </div>
          <div className="vp-title mt-1.5 leading-[0.95]" style={{ fontSize: 27 }}>
            {COUPLE.p1} &amp; {COUPLE.p2}
          </div>
          <div className="mt-2 flex items-center gap-2 text-[9px] font-medium text-white/85">
            <span>{formatDateLong(WEDDING_DATE)}</span>
            <span className="rounded-full px-2 py-0.5 text-[8px] font-semibold" style={{ background: p.accent, color: p.dark ? '#0A0A0E' : '#FFFFFF' }}>
              J-{daysUntil(WEDDING_DATE)}
            </span>
          </div>
        </div>
      </div>

      {/* Notre histoire */}
      <Block title={config?.sections.find((s) => s.key === 'histoire')?.title ?? 'Notre histoire'} icon={MessageCircleQuestion} p={p}>
        <div className="vp-title text-[13px] leading-tight">{config?.editorial.story_title ?? 'Notre histoire'}</div>
        <p className="mt-1 line-clamp-3 text-[9.5px] leading-[1.5]" style={{ color: p.muted }}>
          {config?.editorial.story_text(COUPLE.p1, COUPLE.p2) ?? ''}
        </p>
      </Block>

      {/* Programme */}
      <Block title={config?.sections.find((s) => s.key === 'programme')?.title ?? 'Programme'} icon={Clock} p={p}>
        <div className="space-y-1.5">
          {(config?.programme ?? []).slice(0, 3).map((row) => (
            <div key={row.time + row.title} className="flex items-center gap-2.5 rounded-[10px] px-2.5 py-2" style={card}>
              <span className="vp-num text-[9px] font-semibold" style={{ color: p.accent }}>{row.time}</span>
              <span className="text-[9.5px] font-medium">{row.title}</span>
            </div>
          ))}
        </div>
      </Block>

      {/* Lieux & infos pratiques */}
      <Block title={config?.sections.find((s) => s.key === 'infos')?.title ?? 'Infos pratiques'} icon={MapPin} p={p}>
        <div className="space-y-1.5">
          {(config?.infos ?? []).slice(0, 2).map((row) => (
            <div key={row.category + row.title} className="rounded-[10px] px-2.5 py-2" style={card}>
              <div className="text-[9.5px] font-semibold">{row.title}</div>
              <div className="mt-0.5 line-clamp-1 text-[9px]" style={{ color: p.muted }}>{row.detail}</div>
            </div>
          ))}
        </div>
      </Block>

      {/* RSVP */}
      <Block title={config?.sections.find((s) => s.key === 'rsvp')?.title ?? 'RSVP'} icon={MailCheck} p={p}>
        <div className="rounded-[12px] p-2.5" style={card}>
          <div className="flex flex-wrap gap-1">
            {(config?.rsvpEvents ?? []).slice(0, 3).map((ev) => (
              <span key={ev.name} className="rounded-full px-2 py-1 text-[8.5px] font-medium" style={{ border: `1px solid ${p.line}`, color: p.muted }}>
                {ev.name}
              </span>
            ))}
          </div>
          <div className="mt-2 rounded-full py-1.5 text-center text-[9px] font-semibold text-white" style={{ background: p.accent, color: p.dark ? '#0A0A0E' : '#FFFFFF' }}>
            Je réponds
          </div>
        </div>
      </Block>

      {/* Cagnotte */}
      <Block title={config?.sections.find((s) => s.key === 'cagnotte')?.title ?? 'Cagnotte'} icon={Gift} p={p}>
        <div className="rounded-[12px] p-2.5" style={card}>
          <div className="text-[9.5px] font-semibold">{config?.gifts[0]?.title ?? 'Notre cagnotte'}</div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full" style={{ background: p.line }}>
            <div className="h-full rounded-full" style={{ width: `${GIFT_PROGRESS * 100}%`, background: p.accent }} />
          </div>
          <div className="vp-num mt-1 text-[8.5px]" style={{ color: p.muted }}>
            {euros.format(Math.round((config?.gifts[0]?.goal_amount ?? 1000) * GIFT_PROGRESS))} € sur {euros.format(config?.gifts[0]?.goal_amount ?? 1000)} €
          </div>
        </div>
      </Block>

      {/* Galerie */}
      <Block title={config?.sections.find((s) => s.key === 'galerie')?.title ?? 'Galerie'} icon={Images} p={p}>
        <div className="grid grid-cols-3 gap-1.5">
          {GALLERY.map((src, i) => (
            <div key={src} className="overflow-hidden rounded-[9px]">
              <VisionImage src={src} alt="" className="aspect-square w-full object-cover" style={{ objectPosition: `${i * 22}% center` }} />
            </div>
          ))}
        </div>
      </Block>

      {/* FAQ */}
      <Block title={config?.sections.find((s) => s.key === 'faq')?.title ?? 'FAQ'} icon={MessageCircleQuestion} p={p}>
        <div className="space-y-1">
          {(config?.faq ?? []).slice(0, 2).map((row) => (
            <div key={row.question} className="line-clamp-1 text-[9px]" style={{ color: p.muted }}>{row.question}</div>
          ))}
        </div>
      </Block>

      <div className="px-4 pb-7 pt-6 text-center text-[8px] uppercase tracking-[0.2em]" style={{ color: p.muted }}>
        {COUPLE.p1} &amp; {COUPLE.p2} · Wedding Site
      </div>
    </div>
  );
}

export default function PhoneShowcase() {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const reduced = usePrefersReducedMotion();
  const tabVisible = useTabVisible();

  const running = !hovered && !reduced && tabVisible;
  const style = WEDDING_STYLES[index];
  const config = getThemeConfig(style.id);

  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % WEDDING_STYLES.length), STEP_MS);
    return () => clearTimeout(timer);
  }, [index, running]);

  const go = (next: number) => setIndex(((next % WEDDING_STYLES.length) + WEDDING_STYLES.length) % WEDDING_STYLES.length);

  return (
    <section id="apercus" className="px-5 pb-20 pt-6 sm:px-8 sm:pb-28">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="mx-auto max-w-2xl text-center">
          <div className="vp-eyebrow">Dix mini-sites</div>
          <h2 className="vp-h2 mt-4" style={{ fontSize: 'clamp(2rem, 4.4vw, 3rem)' }}>
            Ce que vos invités
            <br />
            ouvriront sur leur téléphone.
          </h2>
          <p className="vp-body mx-auto mt-4 max-w-lg">
            Chaque environnement compose un mini-site complet : histoire, programme, lieux, RSVP, cagnotte, galerie, FAQ.
            Faites-les défiler.
          </p>
        </motion.div>

        {/* Téléphone au centre, largement aéré */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.8 }}
          className="relative mt-16 flex justify-center sm:mt-20"
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Mini-site précédent"
            className="vp-press vp-glass vp-spec absolute -left-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full lg:flex"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="relative">
            {/* Lueur posée sous l’appareil */}
            <div
              aria-hidden="true"
              className="absolute -inset-x-10 -bottom-8 h-24 rounded-[50%] opacity-60 blur-2xl transition-colors duration-700"
              style={{ background: `radial-gradient(closest-side, ${style.accent}55, transparent)` }}
            />
            <div className="vp-perspective relative w-[286px] rounded-[46px] bg-[#0B0C12] p-[9px] shadow-[0_44px_90px_-38px_rgba(11,12,18,0.72)] ring-1 ring-black/10 sm:w-[318px]">
              <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[38px] bg-white">
                {/* Îlot dynamique */}
                <div className="absolute left-1/2 top-2 z-20 h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-[#0B0C12]" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={style.id}
                    initial={{ opacity: 0, y: reduced ? 0 : 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduced ? 0 : -12 }}
                    transition={{ duration: reduced ? 0.01 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="no-scrollbar absolute inset-0 overflow-y-auto pt-8"
                  >
                    <MiniSite style={style} />
                  </motion.div>
                </AnimatePresence>
                {/* Barre d’accueil */}
                <div className="pointer-events-none absolute inset-x-0 bottom-1.5 z-20 flex justify-center">
                  <span className="h-1 w-24 rounded-full bg-black/25" />
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Mini-site suivant"
            className="vp-press vp-glass vp-spec absolute -right-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full lg:flex"
          >
            <ChevronRight size={18} />
          </button>
        </motion.div>

        {/* Légende : l’univers, et ce que contient son mini-site */}
        <div className="mx-auto mt-14 max-w-xl text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={style.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: reduced ? 0.01 : 0.35 }}
            >
              <div className="vp-title text-[26px]">{style.name}</div>
              <p className="vp-body mt-1.5 !text-[15px]">{style.tagline}</p>
              <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                {(config?.sections ?? []).filter((s) => s.visible).map((s) => (
                  <span key={s.key} className="vp-chip !text-[11.5px] text-[var(--vp-muted)]">{s.title}</span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
          <Link to="/creer" state={{ preselectedStyle: style.id }} className="vp-btn vp-press mt-7 !px-7 !py-3.5">
            Créer mon site dans cet univers <ChevronRight size={16} />
          </Link>
        </div>

        {/* Les dix, accessibles directement */}
        <div className="mt-16 flex flex-wrap justify-center gap-3 sm:gap-4">
          {WEDDING_STYLES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Aperçu du mini-site ${s.name}`}
              aria-current={i === index}
              className={`vp-press group w-[86px] shrink-0 text-left transition sm:w-[104px] ${i === index ? '' : 'opacity-70 hover:opacity-100'}`}
            >
              <span
                className={`block overflow-hidden rounded-[14px] ring-2 transition ${i === index ? 'ring-[var(--vp-ink)]' : 'ring-transparent group-hover:ring-black/15'}`}
              >
                <VisionImage src={s.image} alt="" fallbackLabel={s.name} aura={s.aura} className="aspect-[3/4] w-full object-cover" />
              </span>
              <span className={`mt-1.5 block truncate text-[11px] font-semibold ${i === index ? 'text-[var(--vp-ink)]' : 'text-[var(--vp-muted)]'}`}>
                {s.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
