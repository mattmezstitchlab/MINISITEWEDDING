import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { formatDateShort } from '../../lib/format';
import Countdown from '../Countdown';
import VisionImage from '../vision/VisionImage';
import { useSiteView } from './context';
import { NAV_LINKS } from './navLinks';

/** Photo plein écran, navigation flottante et compte à rebours. */
export default function Hero() {
  const { site, theme, fonts, headWeight, accent, btnR, ink, names, preview, hideHeader, scrolled, menuOpen, setMenuOpen } = useSiteView();

  return (
    <header className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#05060C]">
      <div className="absolute inset-0">
        <motion.div
          initial={site.animation_level === 'calme' ? false : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: site.animation_level === 'spectaculaire' ? 2.4 : 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full"
        >
          <VisionImage src={site.hero_photo || theme.image} alt={names} loading="eager" fallbackLabel={names} aura={theme.aura} className="h-full w-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#05060C]/55 via-[#05060C]/25 to-[#05060C]/72" />
      </div>

      {/* Le header : la même capsule blanche que l'accueil du site. Dans le
          châssis d'un iPhone, la Dynamic Island prend sa place : on l'éteint. */}
      <nav
        className={`fixed top-3 left-1/2 z-40 w-[calc(100%-1.25rem)] max-w-5xl -translate-x-1/2 sm:top-4 ${
          hideHeader ? 'hidden' : ''
        }`}
      >
        <div
          className={`flex items-center justify-between gap-3 rounded-[26px] bg-white px-4 py-2.5 ring-1 ring-black/5 transition-shadow duration-500 sm:px-5 ${
            scrolled ? 'shadow-[0_10px_34px_rgb(0,0,0,0.14)]' : 'shadow-[0_8px_30px_rgb(0,0,0,0.08)]'
          }`}
        >
          <a href="#sec-hero" className="flex min-w-0 items-center gap-2">
            <span className="vp-title text-[17px] font-bold italic tracking-wider text-[#0B0C12]">SUPER MARIAGE</span>
            <span className="hidden truncate text-[12px] font-semibold uppercase tracking-[0.18em] text-black/35 sm:inline">
              {names}
            </span>
          </a>

          <div className="hidden items-center gap-1.5 md:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.key}
                href={`#sec-${l.key}`}
                className="rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-[#0B0C12] transition hover:border-black/30"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#sec-rsvp"
              className="rounded-full bg-[#0B0C12] px-4 py-1.5 text-[12.5px] font-semibold text-white transition hover:bg-neutral-800"
            >
              RSVP
            </a>
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            className="vp-press flex h-8 w-8 items-center justify-center rounded-full text-[#0B0C12] transition hover:bg-black/5 md:hidden"
            aria-label="Menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </nav>

      <div
        className={`relative flex flex-1 flex-col items-center justify-center px-6 text-center ${
          hideHeader ? 'pb-16 pt-16' : 'pb-16 pt-24'
        }`}
      >
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/75 sm:text-[13px]">
          {site.hero_subtitle || 'Nous nous marions'}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9 }}
          className="mt-6 text-white"
          style={{ fontFamily: fonts.heading, fontWeight: headWeight, letterSpacing: '-0.045em', lineHeight: 1.0, fontSize: 'clamp(3rem, 10.5vw, 7rem)', textShadow: '0 12px 60px rgba(0,0,0,0.35)' }}
        >
          {site.hero_title || names}
        </motion.h1>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-7 flex items-center gap-4">
          <span className="h-px w-10 bg-white/45 sm:w-16" />
          <span className="vp-num text-lg tracking-[0.16em] text-white sm:text-2xl" style={{ fontFamily: fonts.heading, fontWeight: headWeight }}>
            {formatDateShort(site.wedding_date)}
          </span>
          <span className="h-px w-10 bg-white/45 sm:w-16" />
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-5 max-w-xl text-[15px] text-white/80 sm:text-[17px]">
          {site.announcement || 'Nous avons hâte de vous retrouver.'}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15 }} className="mt-9">
          <Countdown target={site.wedding_date} accent={accent} light />
        </motion.div>
        {!preview && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.35 }} className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <a
              href="#sec-rsvp"
              className="vp-press px-8 py-3.5 text-[14.5px] font-semibold text-white"
              style={{ background: accent, borderRadius: btnR, boxShadow: `0 18px 40px -18px ${accent}, inset 0 1px 0 rgba(255,255,255,0.32)` }}
            >
              Répondre à l’invitation
            </a>
            <a
              href="#sec-programme"
              className="vp-press border border-white/25 px-8 py-3.5 text-[14.5px] font-semibold text-white backdrop-blur-xl [background:rgba(255,255,255,0.12)]"
              style={{ borderRadius: btnR }}
            >
              Programme
            </a>
          </motion.div>
        )}
      </div>

      <div className="relative flex flex-col items-center gap-2 pb-8 text-white/60">
        <span className="text-[10px] uppercase tracking-[0.3em]">Défiler</span>
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="block h-10 w-px bg-white/40" />
      </div>

      <AnimatePresence>
        {menuOpen && !preview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col bg-white/92 backdrop-blur-3xl" style={{ color: ink }}>
            <div className="relative flex h-16 items-center justify-between px-5">
              <span className="flex items-center gap-2">
                <span className="vp-title text-[17px] font-bold italic tracking-wider text-[#0B0C12]">SUPER MARIAGE</span>
                <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/35">{names}</span>
              </span>
              <button onClick={() => setMenuOpen(false)} className="vp-press flex h-10 w-10 items-center justify-center rounded-full bg-black/5" aria-label="Fermer"><X size={20} /></button>
            </div>
            <div className="relative flex flex-1 flex-col items-center justify-center gap-2">
              {[...NAV_LINKS, { key: 'rsvp', label: 'RSVP' }].map((l, i) => (
                <motion.a
                  key={l.key}
                  href={`#sec-${l.key}`}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="py-2 text-[32px]"
                  style={{ fontFamily: fonts.heading, fontWeight: headWeight, letterSpacing: '-0.03em' }}
                >
                  {l.label}
                </motion.a>
              ))}
              <Link
                to={`/rejoindre/${site.slug}`}
                onClick={() => setMenuOpen(false)}
                className="mt-8 rounded-full border border-black/12 px-5 py-2.5 text-[13px] font-semibold text-[#0B0C12]"
              >
                Rejoindre le mariage
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
