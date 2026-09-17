import { useEffect, useMemo, useState } from 'react';
import type { FormEvent, ReactNode, CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Clock, CalendarDays, ChevronDown, Menu, X, Heart, Gift, Camera,
  Check, Navigation, Mail, Phone, Shirt, BedDouble, Car, CloudSun, Baby, Accessibility, Users,
} from 'lucide-react';
import type { PublicSiteData, WeddingSite, RsvpEvent } from '../lib/types';
import { styleById, fontsFor, buttonRadius, cardRadius } from '../lib/weddingStyles';
import { mapsUrl, formatDateLong, formatDateShort, daysUntil, apiSend } from '../lib/api';
import Countdown from './Countdown';

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
  if (c.includes('parking') || c.includes('transport')) return <Car size={20} strokeWidth={1.5} />;
  if (c.includes('bergement') || c.includes('hôtel') || c.includes('hotel')) return <BedDouble size={20} strokeWidth={1.5} />;
  if (c.includes('horaire') || c.includes('heure')) return <Clock size={20} strokeWidth={1.5} />;
  if (c.includes('dress') || c.includes('tenue')) return <Shirt size={20} strokeWidth={1.5} />;
  if (c.includes('météo') || c.includes('meteo')) return <CloudSun size={20} strokeWidth={1.5} />;
  if (c.includes('contact')) return <Phone size={20} strokeWidth={1.5} />;
  if (c.includes('enfant')) return <Baby size={20} strokeWidth={1.5} />;
  if (c.includes('access')) return <Accessibility size={20} strokeWidth={1.5} />;
  if (c.includes('adresse') || c.includes('lieu') || c.includes('cérémonie') || c.includes('réception')) return <MapPin size={20} strokeWidth={1.5} />;
  return <Heart size={20} strokeWidth={1.5} />;
}

function RsvpForm({ site, events, accent, headingFont, btnRadius }: { site: WeddingSite; events: RsvpEvent[]; accent: string; headingFont: string; btnRadius: string }) {
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

  const field = 'w-full px-5 py-3.5 text-[15px] outline-none transition border bg-white/5 border-white/15 text-white placeholder:text-white/40 focus:border-white/40';

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 px-6">
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center" style={{ background: accent }}>
          <Check size={28} className="text-white" />
        </div>
        <h3 className="mt-6 text-3xl text-white" style={{ fontFamily: headingFont }}>Merci {firstName}.</h3>
        <p className="mt-3 text-white/70">
          {attending ? 'Votre réponse a bien été envoyée. Nous avons hâte de vous retrouver.' : 'Votre réponse a bien été envoyée. Vous nous manquerez.'}
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5 text-left">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="rsvp-label">Prénom</label>
          <input className={field} style={{ borderRadius: btnRadius }} value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Marie" />
        </div>
        <div>
          <label className="rsvp-label">Nom</label>
          <input className={field} style={{ borderRadius: btnRadius }} value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Dupont" />
        </div>
      </div>
      <div>
        <label className="rsvp-label">Email</label>
        <input type="email" className={field} style={{ borderRadius: btnRadius }} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="marie@exemple.fr" />
      </div>
      <div>
        <label className="rsvp-label">Serez-vous présent ?</label>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setAttending(true)} className="px-4 py-4 border border-white/20 text-white transition" style={{ borderRadius: btnRadius, borderColor: attending === true ? accent : undefined, background: attending === true ? accent : 'transparent', opacity: attending === false ? 0.5 : 1 }}>
            <span className="block text-[15px] font-medium">Je serai là</span>
            <span className="block text-xs opacity-70 mt-0.5">Avec joie</span>
          </button>
          <button type="button" onClick={() => setAttending(false)} className="px-4 py-4 border border-white/20 text-white transition" style={{ borderRadius: btnRadius, borderColor: attending === false ? accent : undefined, background: attending === false ? accent : 'transparent', opacity: attending === true ? 0.5 : 1 }}>
            <span className="block text-[15px] font-medium">Je ne peux pas</span>
            <span className="block text-xs opacity-70 mt-0.5">À regret</span>
          </button>
        </div>
      </div>
      {events.length > 0 && attending === true && (
        <div>
          <label className="rsvp-label">Je participerai à</label>
          <div className="flex flex-wrap gap-2">
            {events.map((ev) => (
              <button key={ev.id} type="button" onClick={() => toggleEvent(ev.name)} className="px-4 py-2 text-sm border border-white/20 text-white transition" style={{ borderRadius: btnRadius, borderColor: picked.includes(ev.name) ? accent : undefined, background: picked.includes(ev.name) ? accent : 'transparent' }}>
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
              <label className="rsvp-label">Nombre de personnes</label>
              <div className="flex items-center gap-3 text-white">
                <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} className="w-11 h-11 border border-white/20 rounded-full text-xl leading-none hover:bg-white/10">−</button>
                <span className="text-2xl tabular-nums" style={{ fontFamily: headingFont }}>{guests}</span>
                <button type="button" onClick={() => setGuests(Math.min(10, guests + 1))} className="w-11 h-11 border border-white/20 rounded-full text-xl leading-none hover:bg-white/10">+</button>
              </div>
            </div>
            <div>
              <label className="rsvp-label">Enfants</label>
              <div className="flex items-center gap-3 text-white">
                <button type="button" onClick={() => setChildren(Math.max(0, children - 1))} className="w-11 h-11 border border-white/20 rounded-full text-xl leading-none hover:bg-white/10">−</button>
                <span className="text-2xl tabular-nums" style={{ fontFamily: headingFont }}>{children}</span>
                <button type="button" onClick={() => setChildren(Math.min(8, children + 1))} className="w-11 h-11 border border-white/20 rounded-full text-xl leading-none hover:bg-white/10">+</button>
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="rsvp-label">Régime alimentaire</label>
              <input className={field} style={{ borderRadius: btnRadius }} value={diet} onChange={(e) => setDiet(e.target.value)} placeholder="Végétarien, sans porc…" />
            </div>
            <div>
              <label className="rsvp-label">Allergies</label>
              <input className={field} style={{ borderRadius: btnRadius }} value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="Fruits à coque…" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="rsvp-label">Hébergement</label>
              <input className={field} style={{ borderRadius: btnRadius }} value={housing} onChange={(e) => setHousing(e.target.value)} placeholder="Je dors sur place…" />
            </div>
            <div>
              <label className="rsvp-label">Transport</label>
              <input className={field} style={{ borderRadius: btnRadius }} value={transport} onChange={(e) => setTransport(e.target.value)} placeholder="Voiture, train…" />
            </div>
          </div>
        </>
      )}
      <div>
        <label className="rsvp-label">Un message pour les mariés ?</label>
        <textarea rows={3} className={field} style={{ borderRadius: btnRadius }} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Quelques mots doux…" />
      </div>
      {error && <p className="text-sm text-red-300">{error}</p>}
      <button type="submit" disabled={sending} className="w-full py-4 text-white text-[15px] tracking-[0.15em] uppercase font-medium transition disabled:opacity-60" style={{ background: accent, borderRadius: btnRadius }}>
        {sending ? 'Envoi en cours…' : 'Envoyer ma réponse'}
      </button>
    </form>
  );
}

function FaqItem({ q, a, dark, line, muted, headingFont }: { q: string; a: string; dark: boolean; line: string; muted: string; headingFont: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: line }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-4 py-5 text-left">
        <span className="text-lg" style={{ fontFamily: headingFont }}>{q}</span>
        <ChevronDown size={20} className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} style={{ color: muted }} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <p className={`pb-6 pr-8 leading-relaxed ${dark ? 'text-white/70' : 'text-neutral-600'}`}>{a}</p>
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

  const wrap = (key: string, content: ReactNode) => {
    if (!preview || !onSelectSection) return <div id={`sec-${key}`}>{content}</div>;
    const sec = sections.find((s) => s.section_key === key);
    const selected = selectedKey === key;
    return (
      <div
        id={`sec-${key}`}
        onClick={(e) => { e.stopPropagation(); onSelectSection(key); }}
        className={`relative cursor-pointer transition ${selected ? 'ring-2 ring-offset-2' : 'hover:ring-1 hover:ring-black/20'}`}
        style={selected ? ({ '--tw-ring-color': '#3B82F6' } as CSSProperties) : undefined}
      >
        {sec && !sec.visible && (
          <div className="absolute top-2 right-2 z-10 text-[11px] px-2.5 py-1 rounded-full bg-black/70 text-white tracking-wide">Masquée</div>
        )}
        <div className={sec && !sec.visible ? 'opacity-50 pointer-events-none' : ''}>{content}</div>
      </div>
    );
  };

  const eyebrow = (text: string) => (
    <div className="flex items-center gap-3 justify-center">
      <span className="h-px w-8" style={{ background: accent }} />
      <span className="text-[11px] tracking-[0.3em] uppercase" style={{ color: accent }}>{text}</span>
      <span className="h-px w-8" style={{ background: accent }} />
    </div>
  );

  const renderHero = () => (
    <header className="relative min-h-[100svh] flex flex-col overflow-hidden bg-black">
      <div className="absolute inset-0">
        <motion.img
          initial={site.animation_level === 'calme' ? false : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: site.animation_level === 'spectaculaire' ? 2.4 : 1.6, ease: [0.22, 1, 0.36, 1] }}
          src={site.hero_photo || theme.image}
          alt={names}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/60" />
      </div>
      {!preview && (
        <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'bg-black/35 backdrop-blur-xl border-b border-white/10' : ''}`}>
          <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
            <a href="#sec-hero" className="text-white text-sm tracking-[0.25em] uppercase" style={{ fontFamily: fonts.heading }}>{names}</a>
            <div className="hidden md:flex items-center gap-7">
              {NAV_LINKS.map((l) => (
                <a key={l.key} href={`#sec-${l.key}`} className="text-white/80 hover:text-white text-[13px] tracking-[0.12em] uppercase transition">{l.label}</a>
              ))}
              <a href="#sec-rsvp" className="text-[13px] tracking-[0.12em] uppercase px-5 py-2.5 text-white" style={{ background: accent, borderRadius: btnR }}>RSVP</a>
            </div>
            <button onClick={() => setMenuOpen(true)} className="md:hidden text-white p-2" aria-label="Menu"><Menu size={22} /></button>
          </div>
        </nav>
      )}
      <div className="relative flex-1 flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-white/80 text-xs sm:text-sm tracking-[0.4em] uppercase">
          {site.hero_subtitle || 'Nous nous marions'}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}
          className="mt-6 text-white font-light leading-[1.02]"
          style={{ fontFamily: fonts.heading, fontSize: 'clamp(3rem, 11vw, 7.5rem)' }}
        >
          {site.hero_title || names}
        </motion.h1>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-6 flex items-center gap-4">
          <span className="h-px w-10 sm:w-16 bg-white/50" />
          <span className="text-white text-lg sm:text-2xl tracking-[0.2em]" style={{ fontFamily: fonts.heading }}>{formatDateShort(site.wedding_date)}</span>
          <span className="h-px w-10 sm:w-16 bg-white/50" />
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-4 text-white/85 italic text-base sm:text-xl max-w-xl" style={{ fontFamily: fonts.heading }}>
          {site.announcement || 'Nous avons hâte de vous retrouver.'}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15 }} className="mt-8">
          <Countdown target={site.wedding_date} accent={accent} light fontFamily={fonts.heading} />
        </motion.div>
        {!preview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.35 }} className="mt-10 flex flex-col sm:flex-row items-center gap-3">
            <a href="#sec-rsvp" className="px-9 py-4 text-white text-sm tracking-[0.2em] uppercase font-medium" style={{ background: accent, borderRadius: btnR }}>Répondre à l’invitation</a>
            <a href="#sec-programme" className="px-9 py-4 text-white text-sm tracking-[0.2em] uppercase border border-white/40 backdrop-blur-sm" style={{ borderRadius: btnR }}>Programme</a>
          </motion.div>
        )}
      </div>
      <div className="relative pb-8 flex flex-col items-center gap-2 text-white/60">
        <span className="text-[10px] tracking-[0.3em] uppercase">Défiler</span>
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="block w-px h-10 bg-white/40" />
      </div>
      <AnimatePresence>
        {menuOpen && !preview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col">
            <div className="flex items-center justify-between px-5 h-16">
              <span className="text-white text-sm tracking-[0.25em] uppercase" style={{ fontFamily: fonts.heading }}>{names}</span>
              <button onClick={() => setMenuOpen(false)} className="text-white p-2" aria-label="Fermer"><X size={24} /></button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              {[...NAV_LINKS, { key: 'rsvp', label: 'RSVP' }].map((l, i) => (
                <motion.a key={l.key} href={`#sec-${l.key}`} onClick={() => setMenuOpen(false)} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }} className="text-white text-3xl py-2" style={{ fontFamily: fonts.heading }}>{l.label}</motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );

  const renderStory = () => (
    <section className="py-20 sm:py-28 px-6" style={{ background: theme.bg, color: theme.ink }}>
      <div className="max-w-5xl mx-auto">
        {eyebrow('Notre histoire')}
        <h2 className="mt-5 text-center font-light" style={{ fontFamily: fonts.heading, fontSize: 'clamp(2rem, 5vw, 3.4rem)' }}>{site.story_title || 'Tout a commencé par un regard'}</h2>
        <div className="mt-12 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8 }}>
            <img src={site.story_photo || theme.image} alt="Notre histoire" className="w-full aspect-[4/5] object-cover shadow-[0_20px_60px_rgba(0,0,0,0.10)]" style={{ borderRadius: cardR }} />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8 }}>
            {(site.story_text || '').split('\n\n').filter(Boolean).map((p, i) => (
              <p key={i} className={`leading-[1.9] text-[16px] sm:text-[17px] ${i > 0 ? 'mt-5' : ''} ${dark ? 'text-white/75' : 'text-neutral-600'}`} style={i === 0 ? { fontSize: '1.15em' } : undefined}>{p}</p>
            ))}
            {d > 0 && (
              <div className="mt-8 inline-flex items-center gap-3 px-5 py-3 border" style={{ borderColor: theme.line, borderRadius: btnR }}>
                <CalendarDays size={18} style={{ color: accent }} />
                <span className="text-sm tracking-wide" style={{ color: theme.muted }}>J-{d} avant le grand jour — {formatDateLong(site.wedding_date)}</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );

  const renderProgramme = () => (
    <section className="py-20 sm:py-28 px-6" style={{ background: theme.surface, color: theme.ink }}>
      <div className="max-w-3xl mx-auto">
        {eyebrow('Programme du Jour J')}
        <h2 className="mt-5 text-center font-light" style={{ fontFamily: fonts.heading, fontSize: 'clamp(2rem, 5vw, 3.4rem)' }}>Le déroulé de la journée</h2>
        <div className="mt-14 relative">
          <div className="absolute left-[19px] sm:left-1/2 top-2 bottom-2 w-px" style={{ background: theme.line }} />
          {programme.map((ev, i) => (
            <motion.div key={ev.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, delay: i * 0.05 }} className={`relative flex gap-6 sm:gap-0 pb-10 last:pb-0 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
              <div className="sm:w-1/2 sm:px-10" style={{ textAlign: i % 2 === 1 ? 'left' : undefined }}>
                <div className="text-left sm:text-right" style={i % 2 === 1 ? { textAlign: 'left' } : undefined}>
                  <div className="text-sm tracking-[0.25em] font-medium" style={{ color: accent }}>{ev.event_time}</div>
                  <div className="mt-1.5 text-2xl" style={{ fontFamily: fonts.heading }}>{ev.title}</div>
                  {ev.description && <p className={`mt-2 text-[15px] leading-relaxed ${dark ? 'text-white/65' : 'text-neutral-500'}`}>{ev.description}</p>}
                  {ev.place && <div className="mt-2 inline-flex items-center gap-1.5 text-sm" style={{ color: theme.muted }}><MapPin size={14} />{ev.place}</div>}
                </div>
              </div>
              <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-0 w-10 h-10 rounded-full flex items-center justify-center border" style={{ background: theme.surface, borderColor: theme.line }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: accent }} />
              </div>
              <div className="hidden sm:block sm:w-1/2" />
            </motion.div>
          ))}
          {programme.length === 0 && <p className="text-center py-8" style={{ color: theme.muted }}>Le programme sera dévoilé très bientôt.</p>}
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
      <section className="py-20 sm:py-28 px-6" style={{ background: theme.bg, color: theme.ink }}>
        <div className="max-w-5xl mx-auto">
          {eyebrow('Lieux')}
          <h2 className="mt-5 text-center font-light" style={{ fontFamily: fonts.heading, fontSize: 'clamp(2rem, 5vw, 3.4rem)' }}>Où nous retrouver</h2>
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {cards.map((c, i) => (
              <motion.div key={c.label} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, delay: i * 0.1 }} className="overflow-hidden border" style={{ borderColor: theme.line, borderRadius: cardR, background: theme.surface }}>
                <div className="relative h-64 sm:h-80 overflow-hidden">
                  <img src={c.img} alt={c.label} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  <span className="absolute top-4 left-4 text-[11px] tracking-[0.25em] uppercase px-4 py-2 bg-black/55 text-white backdrop-blur-sm" style={{ borderRadius: btnR }}>{c.label}</span>
                </div>
                <div className="p-7 sm:p-8">
                  {c.time && <div className="text-sm tracking-[0.25em] font-medium" style={{ color: accent }}>{c.time}</div>}
                  <div className="mt-1 text-2xl" style={{ fontFamily: fonts.heading }}>{c.title}</div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[15px]" style={{ color: theme.muted }}><MapPin size={15} />{c.detail}</div>
                  {!preview && (
                    <a href={mapsUrl(`${c.title} ${c.detail}`)} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 px-6 py-3 text-sm tracking-[0.12em] uppercase border transition hover:opacity-80" style={{ borderColor: accent, color: accent, borderRadius: btnR }}>
                      <Navigation size={15} /> Voir l’itinéraire
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderInfos = () => (
    <section className="py-20 sm:py-28 px-6" style={{ background: theme.surface, color: theme.ink }}>
      <div className="max-w-5xl mx-auto">
        {eyebrow('Tout ce qu’il faut savoir')}
        <h2 className="mt-5 text-center font-light" style={{ fontFamily: fonts.heading, fontSize: 'clamp(2rem, 5vw, 3.4rem)' }}>Informations pratiques</h2>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {infos.map((info, i) => (
            <motion.div key={info.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay: (i % 3) * 0.08 }} className="p-7 border" style={{ borderColor: theme.line, borderRadius: cardR, background: theme.bg }}>
              <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: `${accent}14`, color: accent }}><InfoIcon category={info.category} /></div>
              <div className="mt-4 text-[11px] tracking-[0.25em] uppercase" style={{ color: accent }}>{info.category}</div>
              {info.event_time && <div className="mt-1 text-sm font-medium tabular-nums">{info.event_time}</div>}
              <div className="mt-1 text-xl" style={{ fontFamily: fonts.heading }}>{info.title}</div>
              {info.detail && <p className={`mt-2 text-[14px] leading-relaxed ${dark ? 'text-white/65' : 'text-neutral-500'}`}>{info.detail}</p>}
              {info.link_label && !preview && (
                <a href={mapsUrl(`${info.title} ${info.detail}`)} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm underline underline-offset-4" style={{ color: accent }}>{info.link_label}</a>
              )}
            </motion.div>
          ))}
          {infos.length === 0 && <p className="col-span-full text-center py-8" style={{ color: theme.muted }}>Les informations arrivent bientôt.</p>}
        </div>
      </div>
    </section>
  );

  const renderRsvp = () => (
    <section className="relative py-20 sm:py-28 px-6 overflow-hidden" style={{ background: '#141414', color: '#fff' }}>
      <div className="absolute inset-0 opacity-25"><img src="/images/danse.jpg" alt="" className="w-full h-full object-cover" /></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      <div className="relative max-w-2xl mx-auto text-center">
        {eyebrow('RSVP')}
        <h2 className="mt-5 font-light text-white" style={{ fontFamily: fonts.heading, fontSize: 'clamp(2rem, 5vw, 3.4rem)' }}>Serez-vous des nôtres ?</h2>
        <p className="mt-3 text-white/70">Merci de répondre avant le 1er juin — votre réponse nous est précieuse.</p>
        <div className="mt-10 p-7 sm:p-10 border border-white/15 bg-white/[0.07] backdrop-blur-xl text-white" style={{ borderRadius: cardR }}>
          {preview ? (
            <div className="text-left space-y-4 opacity-90">
              <div className="grid grid-cols-2 gap-4"><div className="h-12 rounded-xl bg-white/10" /><div className="h-12 rounded-xl bg-white/10" /></div>
              <div className="h-12 rounded-xl bg-white/10" />
              <div className="grid grid-cols-2 gap-4"><div className="h-16 rounded-xl bg-white/10" /><div className="h-16 rounded-xl bg-white/10" /></div>
              <div className="py-4 rounded-xl text-center text-sm tracking-[0.2em] uppercase" style={{ background: accent }}>Envoyer ma réponse</div>
              <p className="text-center text-white/60 text-sm pt-1">Le formulaire élégant apparaîtra ici sur votre site public.</p>
            </div>
          ) : (
            <RsvpForm site={site} events={rsvpEvents} accent={accent} headingFont={fonts.heading} btnRadius={btnR} />
          )}
        </div>
      </div>
    </section>
  );

  const renderCagnotte = () => (
    <section className="py-20 sm:py-28 px-6" style={{ background: theme.bg, color: theme.ink }}>
      <div className="max-w-4xl mx-auto text-center">
        <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center" style={{ background: `${accent}14`, color: accent }}><Gift size={24} strokeWidth={1.5} /></div>
        <h2 className="mt-5 font-light" style={{ fontFamily: fonts.heading, fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>Liste de mariage</h2>
        <p className="mt-4 text-lg italic max-w-xl mx-auto" style={{ fontFamily: fonts.heading, color: theme.muted }}>« Nous préférons créer des souvenirs plutôt que recevoir des objets. »</p>
        <div className="mt-10 grid sm:grid-cols-2 gap-5 text-left">
          {gifts.map((g) => {
            const goal = Number(g.goal_amount) || 0;
            const current = Number(g.current_amount) || 0;
            const pct = goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0;
            return (
              <motion.div key={g.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.6 }} className="p-7 border" style={{ borderColor: theme.line, borderRadius: cardR, background: theme.surface }}>
                <div className="text-[11px] tracking-[0.25em] uppercase" style={{ color: accent }}>{g.gift_type}</div>
                <div className="mt-2 text-2xl" style={{ fontFamily: fonts.heading }}>{g.title}</div>
                {g.description && <p className={`mt-2 text-[14px] leading-relaxed ${dark ? 'text-white/65' : 'text-neutral-500'}`}>{g.description}</p>}
                {goal > 0 && (
                  <div className="mt-5">
                    <div className="flex justify-between text-sm mb-2"><span className="font-medium tabular-nums">{current.toLocaleString('fr-FR')} €</span><span style={{ color: theme.muted }} className="tabular-nums">sur {goal.toLocaleString('fr-FR')} €</span></div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: `${accent}1f` }}>
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} className="h-full rounded-full" style={{ background: accent }} />
                    </div>
                  </div>
                )}
                {!preview && (
                  giftThanks === g.id ? (
                    <div className="mt-5 flex items-center gap-2 text-sm" style={{ color: accent }}><Check size={16} /> Merci infiniment pour votre attention.</div>
                  ) : (
                    <button onClick={() => setGiftThanks(g.id)} className="mt-5 w-full py-3.5 text-white text-sm tracking-[0.15em] uppercase font-medium" style={{ background: accent, borderRadius: btnR }}>Participer</button>
                  )
                )}
              </motion.div>
            );
          })}
          {gifts.length === 0 && <p className="col-span-full text-center py-8" style={{ color: theme.muted }}>La liste sera partagée très bientôt.</p>}
        </div>
      </div>
    </section>
  );

  const renderGalerie = () => {
    const layout = site.layout || 'magazine';
    const visible = gallery.filter((g) => !g.is_private);
    return (
      <section className="py-20 sm:py-28" style={{ background: theme.surface, color: theme.ink }}>
        <div className="max-w-6xl mx-auto px-6">
          {eyebrow('Galerie')}
          <h2 className="mt-5 text-center font-light" style={{ fontFamily: fonts.heading, fontSize: 'clamp(2rem, 5vw, 3.4rem)' }}>Nos images</h2>
        </div>
        <div className="mt-12 max-w-6xl mx-auto px-6">
          {visible.length === 0 && <p className="text-center py-8" style={{ color: theme.muted }}>Les premières photos arrivent bientôt.</p>}
          {layout === 'immersif' && (
            <div className="space-y-6">
              {visible.map((g) => (
                <motion.img key={g.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.8 }} src={g.url} alt={g.caption || ''} onClick={() => !preview && setLightbox(g.url)} className={`w-full max-h-[80vh] object-cover ${preview ? '' : 'cursor-zoom-in'}`} style={{ borderRadius: cardR }} />
              ))}
            </div>
          )}
          {layout === 'galerie' && (
            <div className="columns-2 md:columns-3 gap-4 space-y-4">
              {visible.map((g, i) => (
                <motion.img key={g.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: (i % 3) * 0.1 }} src={g.url} alt={g.caption || ''} onClick={() => !preview && setLightbox(g.url)} className={`w-full object-cover break-inside-avoid ${preview ? '' : 'cursor-zoom-in'}`} style={{ borderRadius: cardR }} />
              ))}
            </div>
          )}
          {layout === 'minimal' && (
            <div className="grid sm:grid-cols-2 gap-8 sm:gap-12">
              {visible.map((g) => (
                <motion.figure key={g.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                  <img src={g.url} alt={g.caption || ''} onClick={() => !preview && setLightbox(g.url)} className={`w-full aspect-[4/3] object-cover ${preview ? '' : 'cursor-zoom-in'}`} style={{ borderRadius: cardR }} />
                  {g.caption && <figcaption className="mt-3 text-sm italic" style={{ color: theme.muted, fontFamily: fonts.heading }}>{g.caption}</figcaption>}
                </motion.figure>
              ))}
            </div>
          )}
          {layout === 'magazine' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {visible.map((g, i) => (
                <motion.div key={g.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: (i % 4) * 0.07 }} className={i % 5 === 0 ? 'col-span-2 row-span-2' : ''}>
                  <img src={g.url} alt={g.caption || ''} onClick={() => !preview && setLightbox(g.url)} className={`w-full h-full object-cover aspect-square ${preview ? '' : 'cursor-zoom-in'}`} style={{ borderRadius: cardR }} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
        <AnimatePresence>
          {lightbox && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)} className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 cursor-zoom-out">
              <img src={lightbox} alt="" className="max-w-full max-h-full object-contain rounded-lg" />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    );
  };

  const renderFaq = () => (
    <section className="py-20 sm:py-28 px-6" style={{ background: theme.bg, color: theme.ink }}>
      <div className="max-w-2xl mx-auto">
        {eyebrow('Questions fréquentes')}
        <h2 className="mt-5 text-center font-light" style={{ fontFamily: fonts.heading, fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>Tout vous dire</h2>
        <div className="mt-10 border-t" style={{ borderColor: theme.line }}>
          {faqs.map((f) => (
            <FaqItem key={f.id} q={f.question} a={f.answer} dark={dark} line={theme.line} muted={theme.muted} headingFont={fonts.heading} />
          ))}
          {faqs.length === 0 && <p className="text-center py-8" style={{ color: theme.muted }}>Les réponses arrivent bientôt.</p>}
        </div>
      </div>
    </section>
  );

  const renderContact = () => (
    <section className="py-20 sm:py-24 px-6 text-center" style={{ background: theme.surface, color: theme.ink }}>
      <div className="max-w-xl mx-auto">
        {eyebrow('Contact')}
        <h2 className="mt-5 font-light" style={{ fontFamily: fonts.heading, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>Une question ? Écrivez-nous</h2>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          {site.contact_email && (
            <a href={`mailto:${site.contact_email}`} className="inline-flex items-center gap-2 px-7 py-3.5 border text-sm tracking-wide" style={{ borderColor: theme.line, borderRadius: btnR }}><Mail size={16} style={{ color: accent }} />{site.contact_email}</a>
          )}
          {site.contact_phone && (
            <a href={`tel:${site.contact_phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 px-7 py-3.5 border text-sm tracking-wide" style={{ borderColor: theme.line, borderRadius: btnR }}><Phone size={16} style={{ color: accent }} />{site.contact_phone}</a>
          )}
          {!site.contact_email && !site.contact_phone && (
            <p className="text-sm" style={{ color: theme.muted }}>Les coordonnées seront ajoutées très bientôt.</p>
          )}
        </div>
      </div>
    </section>
  );

  const renderFooter = () => (
    <footer className="py-14 px-6 text-center bg-[#101010] text-white">
      <div className="text-3xl font-light" style={{ fontFamily: fonts.heading }}>{names}</div>
      <div className="mt-2 text-sm tracking-[0.3em] text-white/60">{formatDateShort(site.wedding_date)} — {site.city || site.venue}</div>
      <div className="mt-6 flex items-center justify-center gap-2 text-white/50 text-sm">
        <Users size={15} />
        <span>{site.phase === 'apres' ? 'Merci d’avoir partagé ce jour avec nous' : site.phase === 'pendant' ? 'C’est aujourd’hui — à tout à l’heure' : 'Nous avons hâte de vous retrouver'}</span>
      </div>
      <div className="mt-8 pt-8 border-t border-white/10 text-[12px] tracking-[0.2em] uppercase text-white/35">Créé avec Wedding Site</div>
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
    <div style={{ fontFamily: fonts.body, background: theme.bg }} className="min-h-screen">
      <style>{`.rsvp-label{display:block;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;opacity:0.65;margin-bottom:8px;font-weight:500;}`}</style>
      {ordered.map((s) => (
        <div key={s.section_key}>{wrap(s.section_key, renderers[s.section_key]?.() ?? null)}</div>
      ))}
      {ordered.length === 0 && (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center" style={{ color: theme.muted }}>
          <Camera size={32} strokeWidth={1.5} />
          <p>Votre site prend forme…</p>
        </div>
      )}
    </div>
  );
}
