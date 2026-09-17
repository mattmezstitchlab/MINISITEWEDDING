import { useEffect, useMemo, useState } from 'react';
import type { FormEvent, ReactNode, CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Clock, CalendarDays, ChevronDown, Menu, X, Heart, Gift, Camera,
  Check, Navigation, Mail, Phone, Shirt, BedDouble, Car, CloudSun, Baby, Accessibility, Users,
} from 'lucide-react';
import type { PublicSiteData, WeddingSite, RsvpEvent } from '../lib/types';
import { styleById, fontsFor, buttonRadius, cardRadius, envVars } from '../lib/weddingStyles';
import { mapsUrl, formatDateLong, formatDateShort, daysUntil, apiSend } from '../lib/api';
import Countdown from './Countdown';
import VisionImage, { VisionFrame } from './vision/VisionImage';

interface Props {
  data: PublicSiteData;
  preview?: boolean;
  selectedKey?: string | null;
  onSelectSection?: (key: string) => void;
}

const NAV_LINKS = [
  { key: 'histoire', label: 'Histoire' },
  { key: 'programme', label: 'Programme' },
  { key: 'lieux', label: 'Lieux' },
  { key: 'infos', label: 'Infos' },
  { key: 'galerie', label: 'Galerie' },
  { key: 'faq', label: 'FAQ' },
];

function InfoIcon({ category }: { category: string }) {
  const c = category.toLowerCase();
  if (c.includes('parking') || c.includes('transport')) return <Car size={20} strokeWidth={1.7} />;
  if (c.includes('bergement') || c.includes('hôtel') || c.includes('hotel')) return <BedDouble size={20} strokeWidth={1.7} />;
  if (c.includes('horaire') || c.includes('heure')) return <Clock size={20} strokeWidth={1.7} />;
  if (c.includes('dress') || c.includes('tenue')) return <Shirt size={20} strokeWidth={1.7} />;
  if (c.includes('météo') || c.includes('meteo')) return <CloudSun size={20} strokeWidth={1.7} />;
  if (c.includes('contact')) return <Phone size={20} strokeWidth={1.7} />;
  if (c.includes('enfant')) return <Baby size={20} strokeWidth={1.7} />;
  if (c.includes('access')) return <Accessibility size={20} strokeWidth={1.7} />;
  if (c.includes('adresse') || c.includes('lieu') || c.includes('cérémonie') || c.includes('réception')) return <MapPin size={20} strokeWidth={1.7} />;
  return <Heart size={20} strokeWidth={1.7} />;
}

function RsvpForm({ site, events, accent, headingFont, headingWeight, btnRadius }: { site: WeddingSite; events: RsvpEvent[]; accent: string; headingFont: string; headingWeight: number; btnRadius: string }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guests, setGuests] = useState(2);
  const [children, setChildren] = useState(0);
  const [diet, setDiet] = useState('');
  const [allergies, setAllergies] = useState('');
  const [housing, setHousing] = useState('');
  const [transport, setTransport] = useState('');
  const [message, setMessage] = useState('');
  const [picked, setPicked] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const toggleEvent = (name: string) => {
    setPicked((p) => (p.includes(name) ? p.filter((x) => x !== name) : [...p, name]));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!firstName.trim() || !lastName.trim()) { setError('Merci d’indiquer votre prénom et votre nom.'); return; }
    if (attending === null) { setError('Dites-nous si vous serez présent.'); return; }
    setSending(true);
    try {
      await apiSend('/api/rsvp', 'POST', {
        site_id: site.id, first_name: firstName.trim(), last_name: lastName.trim(), email: email.trim(),
        attending, guests_count: guests, children_count: children, diet, allergies, housing, transport,
        message, events: picked,
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setSending(false);
    }
  };

  const field = 'vp-field vp-field-dark !px-5 !py-3.5 !text-[15px]';

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="px-6 py-10 text-center">
        <span className="vp-glyph mx-auto flex h-16 w-16 items-center justify-center rounded-[22px]">
          <Check size={28} strokeWidth={2.4} />
        </span>
        <h3 className="mt-6 text-[28px] text-white" style={{ fontFamily: headingFont, fontWeight: headingWeight, letterSpacing: '-0.025em' }}>Merci {firstName}.</h3>
        <p className="vp-body mt-3 !text-white/70">
          {attending ? 'Votre réponse a bien été envoyée. Nous avons hâte de vous retrouver.' : 'Votre réponse a bien été envoyée. Vous nous manquerez.'}
        </p>
      </motion.div>
    );
  }

  const stepper = 'flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xl leading-none text-white transition hover:bg-white/20 vp-press';

  return (
    <form onSubmit={submit} className="space-y-5 text-left">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="vp-label !text-white/55">Prénom</label>
          <input className={field} value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Marie" />
        </div>
        <div>
          <label className="vp-label !text-white/55">Nom</label>
          <input className={field} value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Dupont" />
        </div>
      </div>
      <div>
        <label className="vp-label !text-white/55">Email</label>
        <input type="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="marie@exemple.fr" />
      </div>
      <div>
        <label className="vp-label !text-white/55">Serez-vous présent ?</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setAttending(true)}
            className="vp-press border border-white/18 px-4 py-4 text-white transition"
            style={{
              borderRadius: btnRadius,
              borderColor: attending === true ? accent : undefined,
              background: attending === true ? accent : 'rgba(255,255,255,0.06)',
              boxShadow: attending === true ? `0 12px 28px -14px ${accent}` : 'inset 0 1px 0 rgba(255,255,255,0.12)',
              opacity: attending === false ? 0.5 : 1,
            }}
          >
            <span className="block text-[15px] font-semibold">Je serai là</span>
            <span className="mt-0.5 block text-xs opacity-70">Avec joie</span>
          </button>
          <button
            type="button"
            onClick={() => setAttending(false)}
            className="vp-press border border-white/18 px-4 py-4 text-white transition"
            style={{
              borderRadius: btnRadius,
              borderColor: attending === false ? accent : undefined,
              background: attending === false ? accent : 'rgba(255,255,255,0.06)',
              boxShadow: attending === false ? `0 12px 28px -14px ${accent}` : 'inset 0 1px 0 rgba(255,255,255,0.12)',
              opacity: attending === true ? 0.5 : 1,
            }}
          >
            <span className="block text-[15px] font-semibold">Je ne peux pas</span>
            <span className="mt-0.5 block text-xs opacity-70">À regret</span>
          </button>
        </div>
      </div>
      {events.length > 0 && attending === true && (
        <div>
          <label className="vp-label !text-white/55">Je participerai à</label>
          <div className="flex flex-wrap gap-2">
            {events.map((ev) => (
              <button
                key={ev.id}
                type="button"
                onClick={() => toggleEvent(ev.name)}
                className="vp-press border border-white/18 px-4 py-2 text-sm text-white transition"
                style={{
                  borderRadius: btnRadius,
                  borderColor: picked.includes(ev.name) ? accent : undefined,
                  background: picked.includes(ev.name) ? accent : 'rgba(255,255,255,0.07)',
                }}
              >
                {ev.name}
              </button>
            ))}
          </div>
        </div>
      )}
      {attending === true && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="vp-label !text-white/55">Nombre de personnes</label>
              <div className="flex items-center gap-3 text-white">
                <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} className={stepper}>−</button>
                <span className="vp-num text-2xl" style={{ fontFamily: headingFont, fontWeight: headingWeight }}>{guests}</span>
                <button type="button" onClick={() => setGuests(Math.min(10, guests + 1))} className={stepper}>+</button>
              </div>
            </div>
            <div>
              <label className="vp-label !text-white/55">Enfants</label>
              <div className="flex items-center gap-3 text-white">
                <button type="button" onClick={() => setChildren(Math.max(0, children - 1))} className={stepper}>−</button>
                <span className="vp-num text-2xl" style={{ fontFamily: headingFont, fontWeight: headingWeight }}>{children}</span>
                <button type="button" onClick={() => setChildren(Math.min(8, children + 1))} className={stepper}>+</button>
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="vp-label !text-white/55">Régime alimentaire</label>
              <input className={field} value={diet} onChange={(e) => setDiet(e.target.value)} placeholder="Végétarien, sans porc…" />
            </div>
            <div>
              <label className="vp-label !text-white/55">Allergies</label>
              <input className={field} value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="Fruits à coque…" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="vp-label !text-white/55">Hébergement</label>
              <input className={field} value={housing} onChange={(e) => setHousing(e.target.value)} placeholder="Je dors sur place…" />
            </div>
            <div>
              <label className="vp-label !text-white/55">Transport</label>
              <input className={field} value={transport} onChange={(e) => setTransport(e.target.value)} placeholder="Voiture, train…" />
            </div>
          </div>
        </>
      )}
      <div>
        <label className="vp-label !text-white/55">Un message pour les mariés ?</label>
        <textarea rows={3} className={field} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Quelques mots doux…" />
      </div>
      {error && <p className="text-sm font-medium text-[#FF8A80]">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="vp-press w-full py-4 text-[15px] font-semibold text-white transition disabled:opacity-60"
        style={{ background: accent, borderRadius: btnRadius, boxShadow: `0 16px 34px -16px ${accent}, inset 0 1px 0 rgba(255,255,255,0.3)` }}
      >
        {sending ? 'Envoi en cours…' : 'Envoyer ma réponse'}
      </button>
    </form>
  );
}

function FaqItem({ q, a, muted, headingFont, headingWeight, dark }: { q: string; a: string; muted: string; headingFont: string; headingWeight: number; dark: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={dark ? 'vp-hr-dark' : 'vp-hr'} style={{ paddingBottom: 2 }}>
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-4 py-5 text-left vp-press">
        <span className="text-[18px]" style={{ fontFamily: headingFont, fontWeight: headingWeight, letterSpacing: '-0.02em' }}>{q}</span>
        <ChevronDown size={20} className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} style={{ color: muted }} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <p className={`pb-6 pr-8 leading-relaxed ${dark ? 'text-white/70' : 'text-[var(--vp-ink-soft)]'}`}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PublicSiteView({ data, preview, selectedKey, onSelectSection }: Props) {
  const { site, sections, programme, infos, gallery, faqs, rsvpEvents, gifts } = data;
  const theme = styleById(site.style);
  const fonts = fontsFor(site.typography);
  const accent = site.accent_color || theme.accent;
  const dark = theme.dark;
  const btnR = buttonRadius(site.button_style || 'pill');
  const cardR = cardRadius(site.shape || 'soft');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [giftThanks, setGiftThanks] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const ordered = useMemo(() => {
    const sorted = [...sections].sort((a, b) => a.position - b.position);
    return preview ? sorted : sorted.filter((s) => s.visible);
  }, [sections, preview]);

  const names = `${site.partner1} & ${site.partner2}`;
  const d = daysUntil(site.wedding_date);

  const ink = dark ? '#F2F4FB' : theme.ink;
  const muted = dark ? 'rgba(242,244,251,0.62)' : theme.muted;
  const glass = dark ? 'vp-glass-dark' : 'vp-glass';
  const glassSpec = dark ? 'vp-spec-dark' : 'vp-spec';
  const headWeight = fonts.weight ?? 620;

  const wrap = (key: string, content: ReactNode) => {
    if (!preview || !onSelectSection) return <div id={`sec-${key}`}>{content}</div>;
    const sec = sections.find((s) => s.section_key === key);
    const selected = selectedKey === key;
    return (
      <div
        id={`sec-${key}`}
        onClick={(e) => { e.stopPropagation(); onSelectSection(key); }}
        className={`relative cursor-pointer transition ${selected ? 'ring-2 ring-offset-2' : 'hover:ring-1 hover:ring-black/15'}`}
        style={selected ? ({ '--tw-ring-color': '#16171A' } as CSSProperties) : undefined}
      >
        {sec && !sec.visible && (
          <div className="absolute right-2 top-2 z-10 rounded-full bg-black/70 px-2.5 py-1 text-[11px] tracking-wide text-white">Masquée</div>
        )}
        <div className={sec && !sec.visible ? 'pointer-events-none opacity-50' : ''}>{content}</div>
      </div>
    );
  };

  const eyebrow = (text: string) => (
    <div className="flex justify-center">
      <span
        className="rounded-full border border-white/70 bg-white/60 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] backdrop-blur-xl [box-shadow:inset_0_1px_0_rgba(255,255,255,0.8)]"
        style={{ color: dark ? '#F2F4FB' : accent }}
      >
        {text}
      </span>
    </div>
  );

  const sectionTitle = (text: string, extra?: CSSProperties) => (
    <h2
      className="mt-5 text-center"
      style={{ fontFamily: fonts.heading, fontWeight: headWeight, letterSpacing: '-0.03em', lineHeight: 1.08, color: ink, fontSize: 'clamp(2rem, 4.6vw, 3.1rem)', ...extra }}
    >
      {text}
    </h2>
  );

  const renderHero = () => (
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

      {!preview && (
        <nav className={`fixed top-3 left-1/2 z-40 w-[calc(100%-1rem)] max-w-5xl -translate-x-1/2 transition-all duration-500 sm:top-4`}>
          <div className={`flex items-center justify-between gap-3 rounded-[26px] px-4 py-2.5 transition-all duration-500 ${scrolled ? 'vp-glass-dark' : ''}`}>
            <a href="#sec-hero" className="text-[15px] font-semibold tracking-tight text-white" style={{ fontFamily: fonts.heading }}>
              {names}
            </a>
            <div className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map((l) => (
                <a key={l.key} href={`#sec-${l.key}`} className="rounded-full px-3 py-2 text-[13.5px] font-medium text-white/80 transition hover:bg-white/12 hover:text-white">
                  {l.label}
                </a>
              ))}
              <a href="#sec-rsvp" className="ml-1 rounded-full px-4 py-2 text-[13.5px] font-semibold text-white" style={{ background: accent, boxShadow: `0 10px 24px -12px ${accent}` }}>
                RSVP
              </a>
            </div>
            <button onClick={() => setMenuOpen(true)} className="p-2 text-white" aria-label="Menu"><Menu size={22} /></button>
          </div>
        </nav>
      )}

      <div className="relative flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-24 text-center">
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col bg-white/88 backdrop-blur-3xl" style={{ color: ink }}>
            <div className="relative flex h-16 items-center justify-between px-5">
              <span className="text-[15px] font-semibold tracking-tight" style={{ fontFamily: fonts.heading }}>{names}</span>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );

  const renderStory = () => (
    <section className="px-5 py-20 sm:px-8 sm:py-28" style={{ color: ink }}>
      <div className="mx-auto max-w-5xl">
        {eyebrow('Notre histoire')}
        {sectionTitle(site.story_title || 'Tout a commencé par un regard')}
        <div className="mt-12 grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8 }}>
            <VisionFrame radius={cardR}>
              <VisionImage src={site.story_photo || theme.image} alt="Notre histoire" aura={theme.aura} className="aspect-[4/5] w-full object-cover" />
            </VisionFrame>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8 }}>
            <div className={`${glass} ${glassSpec} rounded-[28px] p-7 sm:p-9`}>
              {(site.story_text || '').split('\n\n').filter(Boolean).map((p, i) => (
                <p key={i} className={`text-[16px] leading-[1.75] sm:text-[17px] ${i > 0 ? 'mt-5' : ''} ${dark ? 'text-white/78' : 'text-[var(--vp-ink-soft)]'}`} style={i === 0 ? { fontSize: '1.1em' } : undefined}>
                  {p}
                </p>
              ))}
              {d > 0 && (
                <div className="mt-7 inline-flex items-center gap-3 rounded-full border px-4 py-2.5" style={{ borderColor: `${accent}33`, background: `${accent}10` }}>
                  <CalendarDays size={17} style={{ color: accent }} />
                  <span className="text-[13.5px] font-medium" style={{ color: muted }}>
                    <span className="vp-num">J-{d}</span> avant le grand jour — {formatDateLong(site.wedding_date)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );

  const renderProgramme = () => (
    <section className="px-5 py-20 sm:px-8 sm:py-28" style={{ color: ink }}>
      <div className="mx-auto max-w-3xl">
        {eyebrow('Programme du Jour J')}
        {sectionTitle('Le déroulé de la journée')}
        <div className="relative mt-14">
          <div className="absolute bottom-2 left-[19px] top-2 w-px sm:left-1/2" style={{ background: dark ? 'rgba(255,255,255,0.14)' : 'rgba(12,14,24,0.1)' }} />
          {programme.map((ev, i) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className={`relative flex gap-6 pb-6 last:pb-0 sm:gap-0 sm:pb-10 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
            >
              <div className="sm:w-1/2 sm:px-10">
                <div className={`${glass} ${glassSpec} vp-lift rounded-[24px] p-6`} style={{ textAlign: 'left' }}>
                  <div className="vp-num text-[13px] font-semibold tracking-[0.18em]" style={{ color: accent }}>{ev.event_time}</div>
                  <div className="mt-1.5 text-[22px]" style={{ fontFamily: fonts.heading, fontWeight: headWeight, letterSpacing: '-0.025em' }}>{ev.title}</div>
                  {ev.description && <p className={`mt-2 text-[14.5px] leading-relaxed ${dark ? 'text-white/65' : 'text-[var(--vp-ink-soft)]'}`}>{ev.description}</p>}
                  {ev.place && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 text-[13.5px]" style={{ color: muted }}>
                      <MapPin size={14} />{ev.place}
                    </div>
                  )}
                </div>
              </div>
              <div
                className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border"
                style={{ background: dark ? 'rgba(20,22,32,0.9)' : 'rgba(255,255,255,0.9)', borderColor: dark ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.7)', backdropFilter: 'blur(18px)', boxShadow: 'var(--vp-depth-1)' }}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: accent, boxShadow: `0 0 12px ${accent}` }} />
              </div>
              <div className="hidden sm:block sm:w-1/2" />
            </motion.div>
          ))}
          {programme.length === 0 && <p className="py-8 text-center" style={{ color: muted }}>Le programme sera dévoilé très bientôt.</p>}
        </div>
      </div>
    </section>
  );

  const renderLieux = () => {
    const ceremony = infos.find((x) => x.category.toLowerCase().includes('cérémonie'));
    const reception = infos.find((x) => x.category.toLowerCase().includes('réception'));
    const cards = [
      { label: 'Cérémonie', img: '/images/chateau.jpg', title: ceremony?.title || site.venue, detail: ceremony?.detail || site.city, time: ceremony?.event_time || '' },
      { label: 'Réception', img: '/images/table-noir.jpg', title: reception?.title || site.venue, detail: reception?.detail || site.city, time: reception?.event_time || '' },
    ];
    return (
      <section className="px-5 py-20 sm:px-8 sm:py-28" style={{ color: ink }}>
        <div className="mx-auto max-w-5xl">
          {eyebrow('Lieux')}
          {sectionTitle('Où nous retrouver')}
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {cards.map((c, i) => (
              <motion.div key={c.label} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, delay: i * 0.1 }}>
                <div className={`${glass} ${glassSpec} vp-lift overflow-hidden`} style={{ borderRadius: cardR }}>
                  <div className="relative h-64 overflow-hidden sm:h-72">
                    <VisionImage src={c.img} alt={c.label} fallbackLabel={c.label} aura={theme.aura} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                    <span
                      className="absolute left-4 top-4 bg-black/45 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-xl"
                      style={{ borderRadius: btnR }}
                    >
                      {c.label}
                    </span>
                  </div>
                  <div className="p-7 sm:p-8">
                    {c.time && <div className="vp-num text-[13px] font-semibold tracking-[0.18em]" style={{ color: accent }}>{c.time}</div>}
                    <div className="mt-1.5 text-[22px]" style={{ fontFamily: fonts.heading, fontWeight: headWeight, letterSpacing: '-0.025em' }}>{c.title}</div>
                    <div className="mt-1.5 flex items-center gap-1.5 text-[14.5px]" style={{ color: muted }}>
                      <MapPin size={15} />{c.detail}
                    </div>
                    {!preview && (
                      <a
                        href={mapsUrl(`${c.title} ${c.detail}`)}
                        target="_blank"
                        rel="noreferrer"
                        className="vp-press mt-5 inline-flex items-center gap-2 px-5 py-3 text-[13.5px] font-semibold text-white transition"
                        style={{ background: accent, borderRadius: btnR, boxShadow: `0 14px 30px -16px ${accent}` }}
                      >
                        <Navigation size={15} /> Voir l’itinéraire
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderInfos = () => (
    <section className="px-5 py-20 sm:px-8 sm:py-28" style={{ color: ink }}>
      <div className="mx-auto max-w-5xl">
        {eyebrow('Tout ce qu’il faut savoir')}
        {sectionTitle('Informations pratiques')}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {infos.map((info, i) => (
            <motion.div key={info.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}>
              <div className={`${glass} ${glassSpec} vp-lift h-full p-7`} style={{ borderRadius: cardR }}>
                <span className="vp-glyph h-11 w-11 rounded-[15px]">
                  <InfoIcon category={info.category} />
                </span>
                <div className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: accent }}>{info.category}</div>
                {info.event_time && <div className="vp-num mt-1 text-[13.5px] font-semibold">{info.event_time}</div>}
                <div className="mt-1 text-[19px]" style={{ fontFamily: fonts.heading, fontWeight: headWeight, letterSpacing: '-0.022em' }}>{info.title}</div>
                {info.detail && <p className={`mt-2 text-[14px] leading-relaxed ${dark ? 'text-white/65' : 'text-[var(--vp-ink-soft)]'}`}>{info.detail}</p>}
                {info.link_label && !preview && (
                  <a href={mapsUrl(`${info.title} ${info.detail}`)} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-medium underline underline-offset-4" style={{ color: accent }}>
                    {info.link_label}
                  </a>
                )}
              </div>
            </motion.div>
          ))}
          {infos.length === 0 && <p className="col-span-full py-8 text-center" style={{ color: muted }}>Les informations arrivent bientôt.</p>}
        </div>
      </div>
    </section>
  );

  const renderRsvp = () => (
    <section className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28" style={{ color: '#fff' }}>
      <div className="absolute inset-0">
        <VisionImage src="/images/danse.jpg" alt="" fallbackLabel="Danse" className="h-full w-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#05060C]/62 via-[#05060C]/48 to-[#05060C]/72" />
      <div className="relative mx-auto max-w-2xl text-center">
        {eyebrow('RSVP')}
        {sectionTitle('Serez-vous des nôtres ?', { color: '#fff' })}
        <p className="vp-body mt-3 !text-white/70">Merci de répondre avant le 1er juin — votre réponse nous est précieuse.</p>
        <div className="vp-glass-dark vp-spec-dark mt-10 p-7 text-white sm:p-10" style={{ borderRadius: cardR }}>
          {preview ? (
            <div className="space-y-4 text-left opacity-90">
              <div className="grid grid-cols-2 gap-4"><div className="h-12 rounded-xl bg-white/10" /><div className="h-12 rounded-xl bg-white/10" /></div>
              <div className="h-12 rounded-xl bg-white/10" />
              <div className="grid grid-cols-2 gap-4"><div className="h-16 rounded-xl bg-white/10" /><div className="h-16 rounded-xl bg-white/10" /></div>
              <div className="rounded-full py-4 text-center text-sm font-semibold uppercase tracking-[0.15em]" style={{ background: accent }}>Envoyer ma réponse</div>
              <p className="pt-1 text-center text-sm text-white/60">Le formulaire apparaîtra ici sur votre site public.</p>
            </div>
          ) : (
            <RsvpForm site={site} events={rsvpEvents} accent={accent} headingFont={fonts.heading} headingWeight={headWeight} btnRadius={btnR} />
          )}
        </div>
      </div>
    </section>
  );

  const renderCagnotte = () => (
    <section className="px-5 py-20 sm:px-8 sm:py-28" style={{ color: ink }}>
      <div className="mx-auto max-w-4xl text-center">
        <span className="vp-glyph mx-auto flex h-14 w-14 items-center justify-center rounded-[20px]">
          <Gift size={24} strokeWidth={1.8} />
        </span>
        {sectionTitle('Liste de mariage')}
        <p className="mx-auto mt-4 max-w-xl text-[17px] italic" style={{ fontFamily: fonts.heading, color: muted }}>
          « Nous préférons créer des souvenirs plutôt que recevoir des objets. »
        </p>
        <div className="mt-10 grid gap-5 text-left sm:grid-cols-2">
          {gifts.map((g) => {
            const goal = Number(g.goal_amount) || 0;
            const current = Number(g.current_amount) || 0;
            const pct = goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0;
            return (
              <motion.div key={g.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.6 }}>
                <div className={`${glass} ${glassSpec} vp-lift h-full p-7`} style={{ borderRadius: cardR }}>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: accent }}>{g.gift_type}</div>
                  <div className="mt-2 text-[22px]" style={{ fontFamily: fonts.heading, fontWeight: headWeight, letterSpacing: '-0.025em' }}>{g.title}</div>
                  {g.description && <p className={`mt-2 text-[14px] leading-relaxed ${dark ? 'text-white/65' : 'text-[var(--vp-ink-soft)]'}`}>{g.description}</p>}
                  {goal > 0 && (
                    <div className="mt-5">
                      <div className="vp-num mb-2 flex justify-between text-[13.5px]">
                        <span className="font-semibold">{current.toLocaleString('fr-FR')} €</span>
                        <span style={{ color: muted }}>sur {goal.toLocaleString('fr-FR')} €</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full" style={{ background: dark ? 'rgba(255,255,255,0.12)' : 'rgba(12,14,24,0.08)' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${accent}, ${accent}cc)`, boxShadow: `0 0 14px ${accent}88` }}
                        />
                      </div>
                    </div>
                  )}
                  {!preview && (
                    giftThanks === g.id ? (
                      <div className="mt-5 flex items-center gap-2 text-[14px] font-medium" style={{ color: accent }}><Check size={16} /> Merci infiniment pour votre attention.</div>
                    ) : (
                      <button
                        onClick={() => setGiftThanks(g.id)}
                        className="vp-press mt-5 w-full py-3.5 text-[14.5px] font-semibold text-white"
                        style={{ background: accent, borderRadius: btnR, boxShadow: `0 14px 30px -16px ${accent}, inset 0 1px 0 rgba(255,255,255,0.28)` }}
                      >
                        Participer
                      </button>
                    )
                  )}
                </div>
              </motion.div>
            );
          })}
          {gifts.length === 0 && <p className="col-span-full py-8 text-center" style={{ color: muted }}>La liste sera partagée très bientôt.</p>}
        </div>
      </div>
    </section>
  );

  const renderGalerie = () => {
    const layout = site.layout || 'magazine';
    const visible = gallery.filter((g) => !g.is_private);
    return (
      <section className="py-20 sm:py-28" style={{ color: ink }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          {eyebrow('Galerie')}
          {sectionTitle('Nos images')}
        </div>
        <div className="mx-auto mt-12 max-w-6xl px-5 sm:px-8">
          {visible.length === 0 && <p className="py-8 text-center" style={{ color: muted }}>Les premières photos arrivent bientôt.</p>}
          {layout === 'immersif' && (
            <div className="space-y-6">
              {visible.map((g) => (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.8 }}
                  onClick={() => !preview && setLightbox(g.url)}
                >
                  <VisionFrame radius={cardR}>
                    <VisionImage src={g.url} alt={g.caption || ''} aura={theme.aura} className={`max-h-[80vh] w-full object-cover ${preview ? '' : 'cursor-zoom-in'}`} />
                  </VisionFrame>
                </motion.div>
              ))}
            </div>
          )}
          {layout === 'galerie' && (
            <div className="columns-2 space-y-4 gap-4 md:columns-3">
              {visible.map((g, i) => (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                  className="break-inside-avoid"
                  onClick={() => !preview && setLightbox(g.url)}
                >
                  <VisionFrame radius={cardR}>
                    <VisionImage src={g.url} alt={g.caption || ''} aura={theme.aura} className={`w-full object-cover ${preview ? '' : 'cursor-zoom-in'}`} />
                  </VisionFrame>
                </motion.div>
              ))}
            </div>
          )}
          {layout === 'minimal' && (
            <div className="grid gap-8 sm:grid-cols-2 sm:gap-12">
              {visible.map((g) => (
                <motion.figure
                  key={g.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  onClick={() => !preview && setLightbox(g.url)}
                >
                  <VisionFrame radius={cardR}>
                    <VisionImage src={g.url} alt={g.caption || ''} aura={theme.aura} className={`aspect-[4/3] w-full object-cover ${preview ? '' : 'cursor-zoom-in'}`} />
                  </VisionFrame>
                  {g.caption && (
                    <figcaption className="mt-3 text-[14px] italic" style={{ color: muted, fontFamily: fonts.heading }}>
                      {g.caption}
                    </figcaption>
                  )}
                </motion.figure>
              ))}
            </div>
          )}
          {layout === 'magazine' && (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {visible.map((g, i) => (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: (i % 4) * 0.07 }}
                  className={i % 5 === 0 ? 'col-span-2 row-span-2' : ''}
                  onClick={() => !preview && setLightbox(g.url)}
                >
                  <VisionFrame radius={cardR} className="h-full">
                    <VisionImage src={g.url} alt={g.caption || ''} aura={theme.aura} className={`aspect-square h-full w-full object-cover ${preview ? '' : 'cursor-zoom-in'}`} />
                  </VisionFrame>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        <AnimatePresence>
          {lightbox && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightbox(null)}
              className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-[#05060C]/85 p-6 backdrop-blur-2xl"
            >
              <img src={lightbox} alt="" className="max-h-full max-w-full rounded-[16px] object-contain" />
              <button className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white" aria-label="Fermer"><X size={20} /></button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    );
  };

  const renderFaq = () => (
    <section className="px-5 py-20 sm:px-8 sm:py-28" style={{ color: ink }}>
      <div className="mx-auto max-w-2xl">
        {eyebrow('Questions fréquentes')}
        {sectionTitle('Tout vous dire')}
        <div className={`${glass} ${glassSpec} mt-10 rounded-[28px] px-7 sm:px-9`} style={{ paddingTop: 8, paddingBottom: 8 }}>
          {faqs.map((f) => (
            <FaqItem key={f.id} q={f.question} a={f.answer} muted={muted} headingFont={fonts.heading} headingWeight={headWeight} dark={dark} />
          ))}
          {faqs.length === 0 && <p className="py-8 text-center" style={{ color: muted }}>Les réponses arrivent bientôt.</p>}
        </div>
      </div>
    </section>
  );

  const renderContact = () => (
    <section className="px-5 py-20 text-center sm:px-8 sm:py-24" style={{ color: ink }}>
      <div className="mx-auto max-w-xl">
        {eyebrow('Contact')}
        {sectionTitle('Une question ? Écrivez-nous', { fontSize: 'clamp(1.8rem, 3.8vw, 2.5rem)' })}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {site.contact_email && (
            <a href={`mailto:${site.contact_email}`} className={`${glass} ${glassSpec} vp-lift inline-flex items-center gap-2 px-6 py-3.5 text-[14.5px] font-medium`} style={{ borderRadius: btnR }}>
              <Mail size={16} style={{ color: accent }} />{site.contact_email}
            </a>
          )}
          {site.contact_phone && (
            <a href={`tel:${site.contact_phone.replace(/\s/g, '')}`} className={`${glass} ${glassSpec} vp-lift inline-flex items-center gap-2 px-6 py-3.5 text-[14.5px] font-medium`} style={{ borderRadius: btnR }}>
              <Phone size={16} style={{ color: accent }} />{site.contact_phone}
            </a>
          )}
          {!site.contact_email && !site.contact_phone && (
            <p className="text-[14px]" style={{ color: muted }}>Les coordonnées seront ajoutées très bientôt.</p>
          )}
        </div>
      </div>
    </section>
  );

  const renderFooter = () => (
    <footer className="px-5 pb-8" style={{ color: ink }}>
      <div className={`${glass} ${glassSpec} mx-auto max-w-4xl rounded-[32px] px-6 py-14 text-center`}>
        <div className="text-[30px]" style={{ fontFamily: fonts.heading, fontWeight: headWeight, letterSpacing: '-0.03em' }}>{names}</div>
        <div className="vp-num mt-2 text-[13.5px] tracking-[0.24em]" style={{ color: muted }}>{formatDateShort(site.wedding_date)} — {site.city || site.venue}</div>
        <div className="mt-6 flex items-center justify-center gap-2 text-[14px]" style={{ color: muted }}>
          <Users size={15} />
          <span>{site.phase === 'apres' ? 'Merci d’avoir partagé ce jour avec nous' : site.phase === 'pendant' ? 'C’est aujourd’hui — à tout à l’heure' : 'Nous avons hâte de vous retrouver'}</span>
        </div>
        <div className="mt-8 border-t pt-7 text-[11px] uppercase tracking-[0.2em]" style={{ borderColor: dark ? 'rgba(255,255,255,0.12)' : 'rgba(12,14,24,0.08)', color: muted }}>Créé avec Wedding Site</div>
      </div>
    </footer>
  );

  const renderers: Record<string, () => ReactNode> = {
    hero: renderHero,
    histoire: renderStory,
    programme: renderProgramme,
    lieux: renderLieux,
    infos: renderInfos,
    rsvp: renderRsvp,
    cagnotte: renderCagnotte,
    galerie: renderGalerie,
    faq: renderFaq,
    contact: renderContact,
    footer: renderFooter,
  };

  return (
    <div
      className={`vp-env min-h-screen ${dark ? 'vp-env-dark' : ''}`}
      style={{ fontFamily: fonts.body, color: ink, ...envVars(theme, accent) } as CSSProperties}
    >
      {ordered.map((s) => (
        <div key={s.section_key}>{wrap(s.section_key, renderers[s.section_key]?.() ?? null)}</div>
      ))}
      {ordered.length === 0 && (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center" style={{ color: muted }}>
          <Camera size={32} strokeWidth={1.5} />
          <p>Votre site prend forme…</p>
        </div>
      )}
    </div>
  );
}
