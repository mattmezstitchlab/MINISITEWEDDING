import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Loader2, MapPin, CalendarDays, Heart, Palette } from 'lucide-react';
import { apiSend, slugify, formatDateLong, daysUntil } from '../lib/api';
import { WEDDING_STYLES } from '../lib/weddingStyles';
import type { WeddingSite } from '../lib/types';

const neoFont = '"Space Grotesk", "Hanken Grotesk", system-ui, sans-serif';

const SECTION_DEFAULTS = [
  { key: 'hero', title: 'Accueil' },
  { key: 'histoire', title: 'Notre histoire' },
  { key: 'programme', title: 'Programme' },
  { key: 'lieux', title: 'Lieux' },
  { key: 'infos', title: 'Infos pratiques' },
  { key: 'rsvp', title: 'RSVP' },
  { key: 'cagnotte', title: 'Cagnotte' },
  { key: 'galerie', title: 'Galerie' },
  { key: 'faq', title: 'FAQ' },
  { key: 'contact', title: 'Contact' },
  { key: 'footer', title: 'Pied de page' },
];

const PROGRAMME_DEFAULTS = [
  { time: '14:30', title: 'Cérémonie', desc: 'Échange des vœux et des alliances.', place: '' },
  { time: '16:00', title: 'Cocktail', desc: 'Coupe de champagne et photos de groupe.', place: '' },
  { time: '18:30', title: 'Dîner', desc: 'Dîner assis, discours et surprises.', place: '' },
  { time: '21:00', title: 'Ouverture du bal', desc: 'La première danse, puis à vous.', place: '' },
  { time: '23:30', title: 'Soirée', desc: 'Dansez jusqu’au bout de la nuit.', place: '' },
];

const FAQ_DEFAULTS = [
  { q: 'Comment venir ?', a: 'Toutes les adresses et itinéraires sont indiqués dans la rubrique Lieux. Un parking est prévu à proximité.' },
  { q: 'Où dormir ?', a: 'Plusieurs hôtels et chambres d’hôtes autour du lieu. Réservez tôt et mentionnez notre mariage.' },
  { q: 'Y a-t-il un parking ?', a: 'Oui, un parking privé est réservé aux invités juste à côté du lieu de réception.' },
  { q: 'Les enfants sont-ils invités ?', a: 'Nous adorons vos enfants, mais la soirée est réservée aux adultes — sauf mention sur votre invitation.' },
  { q: 'Quel est le dress code ?', a: 'Tenue de cocktail. Mesdames, prévoyez des chaussures adaptées aux jardins.' },
  { q: 'À quelle heure arriver ?', a: 'Merci d’arriver 30 minutes avant la cérémonie pour vous installer sereinement.' },
];

const RSVP_EVENTS_DEFAULTS = [
  { name: 'Cérémonie', desc: '14:30' },
  { name: 'Cocktail', desc: '16:00' },
  { name: 'Dîner', desc: '18:30' },
  { name: 'Brunch', desc: 'Lendemain, 11:00' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [partner1, setPartner1] = useState('');
  const [partner2, setPartner2] = useState('');
  const [date, setDate] = useState('2027-07-18');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('');
  const [style, setStyle] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const steps = [
    { icon: Heart, label: 'Les mariés' },
    { icon: CalendarDays, label: 'La date' },
    { icon: MapPin, label: 'Le lieu' },
    { icon: Palette, label: 'Le style' },
  ];

  const canNext = () => {
    if (step === 0) return partner1.trim().length > 0 && partner2.trim().length > 0;
    if (step === 1) return date.length > 0;
    if (step === 2) return venue.trim().length > 0;
    if (step === 3) return style.length > 0;
    return false;
  };

  const create = async () => {
    setError('');
    setCreating(true);
    try {
      const theme = WEDDING_STYLES.find((s) => s.id === style) ?? WEDDING_STYLES[0];
      const base = slugify(`${partner1}-${partner2}`) || 'notre-mariage';
      const slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
      const site = await apiSend<WeddingSite>('/api/wedding-sites', 'POST', {
        slug, partner1: partner1.trim(), partner2: partner2.trim(), wedding_date: date,
        venue: venue.trim(), city: city.trim(), style, phase: 'avant',
        typography: 'neo-grotesk', accent_color: theme.accent, button_style: 'pill',
        shape: 'soft', layout: 'magazine', animation_level: 'fluide',
        hero_photo: theme.image, hero_title: `${partner1.trim()} & ${partner2.trim()}`,
        hero_subtitle: 'Nous nous marions',
        story_title: 'Tout a commencé par un regard',
        story_text: `C’est une histoire comme on les aime : une rencontre, un éclat de rire, puis l’évidence.\n\nDepuis ce jour, ${partner1.trim()} et ${partner2.trim()} ne se quittent plus. Et aujourd’hui, ils veulent écrire la suite avec vous, entourés de celles et ceux qu’ils aiment.`,
        story_photo: '/images/couple-paris.jpg',
        announcement: 'Nous avons hâte de vous retrouver.',
        contact_email: '', contact_phone: '', published: false,
      });
      const siteId = site.id;
      for (let i = 0; i < SECTION_DEFAULTS.length; i++) {
        await apiSend('/api/site-sections', 'POST', { site_id: siteId, section_key: SECTION_DEFAULTS[i].key, title: SECTION_DEFAULTS[i].title, visible: true, position: i });
      }
      for (let i = 0; i < PROGRAMME_DEFAULTS.length; i++) {
        const p = PROGRAMME_DEFAULTS[i];
        await apiSend('/api/programme', 'POST', { site_id: siteId, event_time: p.time, title: p.title, description: p.desc, place: venue.trim(), icon: 'clock', position: i });
      }
      const infosDefaults = [
        { category: 'Cérémonie', title: venue.trim() || 'Le lieu de cérémonie', detail: city.trim() || 'Adresse à préciser', time: '14:30', link: 'Voir l’itinéraire' },
        { category: 'Réception', title: venue.trim() || 'Le lieu de réception', detail: city.trim() || 'Adresse à préciser', time: '18:30', link: 'Voir l’itinéraire' },
        { category: 'Parking', title: 'Parking privé', detail: 'Un parking est réservé aux invités à côté du lieu.', time: '', link: '' },
        { category: 'Hébergements', title: 'Où dormir ?', detail: 'Hôtels et chambres d’hôtes à proximité — réservez tôt.', time: '', link: '' },
        { category: 'Dress code', title: 'Tenue de cocktail', detail: 'Élégance estivale. Prévoyez des chaussures adaptées aux jardins.', time: '', link: '' },
        { category: 'Contacts', title: 'Une question ?', detail: 'Écrivez-nous, nous répondons à tout, vite.', time: '', link: '' },
      ];
      for (let i = 0; i < infosDefaults.length; i++) {
        const inf = infosDefaults[i];
        await apiSend('/api/infos', 'POST', { site_id: siteId, category: inf.category, title: inf.title, detail: inf.detail, event_time: inf.time, link_label: inf.link, position: i });
      }
      const galleryDefaults = [
        { url: theme.image, caption: 'Nous deux' },
        { url: '/images/alliances.jpg', caption: 'Les alliances' },
        { url: '/images/bouquet.jpg', caption: 'Le bouquet' },
        { url: '/images/champagne.jpg', caption: 'À la vie' },
      ];
      for (let i = 0; i < galleryDefaults.length; i++) {
        await apiSend('/api/gallery', 'POST', { site_id: siteId, url: galleryDefaults[i].url, caption: galleryDefaults[i].caption, position: i, is_private: false });
      }
      for (let i = 0; i < FAQ_DEFAULTS.length; i++) {
        await apiSend('/api/faqs', 'POST', { site_id: siteId, question: FAQ_DEFAULTS[i].q, answer: FAQ_DEFAULTS[i].a, position: i });
      }
      for (let i = 0; i < RSVP_EVENTS_DEFAULTS.length; i++) {
        await apiSend('/api/rsvp-events', 'POST', { site_id: siteId, name: RSVP_EVENTS_DEFAULTS[i].name, description: RSVP_EVENTS_DEFAULTS[i].desc, position: i });
      }
      await apiSend('/api/gifts', 'POST', { site_id: siteId, gift_type: 'Voyage de noces', title: 'Notre lune de miel', description: 'Aidez-nous à créer des souvenirs inoubliables.', goal_amount: 5000, current_amount: 0, position: 0 });
      await apiSend('/api/gifts', 'POST', { site_id: siteId, gift_type: 'Participation libre', title: 'Cagnotte des mariés', description: 'Chaque attention nous touche, quel qu’en soit le montant.', goal_amount: 0, current_amount: 0, position: 1 });
      navigate(`/generer?site=${siteId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue. Réessayez.');
      setCreating(false);
    }
  };

  const inputCls = 'w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-white border border-black/10 text-base sm:text-lg outline-none focus:border-black/40 transition placeholder:text-neutral-300';

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A] flex flex-col overflow-x-hidden" style={{ fontFamily: neoFont }}>
      <nav className="min-h-[64px] sm:min-h-[68px] flex items-center justify-between gap-2 px-3 sm:px-8 py-2.5 border-b border-black/5 bg-[#FAF8F5]/85 backdrop-blur-xl sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[13px] font-semibold" style={{ fontFamily: neoFont }}>W</span>
          <span className="text-[12px] sm:text-[13px] tracking-[0.25em] uppercase font-semibold hidden md:inline">Wedding Site</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center gap-1 sm:gap-2">
              <div className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-[13px] font-medium transition ${i === step ? 'bg-neutral-900 text-white' : i < step ? 'bg-emerald-600 text-white' : 'bg-black/5 text-neutral-400'}`}>
                {i < step ? <Check size={13} /> : <s.icon size={13} />}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className="w-1.5 sm:w-6 h-px bg-black/10" />}
            </div>
          ))}
        </div>
        <div className="text-[12px] sm:text-[13px] text-neutral-400 tabular-nums font-medium shrink-0">{step + 1} / 4</div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8 sm:py-12">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
                <h1 className="text-center font-medium tracking-tight" style={{ fontFamily: neoFont, fontSize: 'clamp(1.9rem, 6vw, 3.2rem)' }}>Qui se marie ?</h1>
                <p className="mt-2 text-center text-neutral-500 text-sm sm:text-base">Vos prénoms, tels que vous voulez les voir en grand.</p>
                <div className="mt-8 sm:mt-10 grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-semibold mb-2 ml-1">Premier prénom</label>
                    <input value={partner1} onChange={(e) => setPartner1(e.target.value)} placeholder="Marie" autoFocus className={inputCls} style={{ fontFamily: neoFont, fontSize: '1.4rem' }} />
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-semibold mb-2 ml-1">Second prénom</label>
                    <input value={partner2} onChange={(e) => setPartner2(e.target.value)} placeholder="Matt" className={inputCls} style={{ fontFamily: neoFont, fontSize: '1.4rem' }} />
                  </div>
                </div>
                {(partner1 || partner2) && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 text-center p-6 rounded-3xl bg-white border border-black/5 shadow-sm">
                    <div className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-neutral-400 font-semibold">Aperçu du titre</div>
                    <div className="mt-2 font-medium tracking-tight" style={{ fontFamily: neoFont, fontSize: 'clamp(2rem, 6vw, 3.6rem)' }}>{partner1 || '…'} <span className="font-light text-[#8A6D4B]">&</span> {partner2 || '…'}</div>
                  </motion.div>
                )}
              </motion.div>
            )}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }} className="text-center">
                <h1 className="font-medium tracking-tight" style={{ fontFamily: neoFont, fontSize: 'clamp(1.9rem, 6vw, 3.2rem)' }}>Quelle est la date ?</h1>
                <p className="mt-2 text-neutral-500 text-sm sm:text-base">Le compte à rebours démarre dès aujourd’hui.</p>
                <div className="mt-8 sm:mt-10 max-w-md mx-auto">
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-5 sm:px-6 py-4 sm:py-5 rounded-2xl bg-white border border-black/10 text-lg sm:text-xl outline-none focus:border-black/40 transition text-center font-medium" style={{ fontFamily: neoFont }} />
                  {date && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-5 sm:p-6 rounded-3xl bg-white border border-black/10 shadow-sm">
                      <div className="capitalize text-lg sm:text-xl font-medium tracking-tight" style={{ fontFamily: neoFont }}>{formatDateLong(date)}</div>
                      <div className="mt-2 inline-flex items-center gap-2 text-sm text-[#8A6D4B] font-medium"><CalendarDays size={15} /> J-{daysUntil(date)} avant le grand jour</div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
                <h1 className="text-center font-medium tracking-tight" style={{ fontFamily: neoFont, fontSize: 'clamp(1.9rem, 6vw, 3.2rem)' }}>Où cela se passe ?</h1>
                <p className="mt-2 text-center text-neutral-500 text-sm sm:text-base">Le lieu qui accueillera votre histoire.</p>
                <div className="mt-8 sm:mt-10 max-w-xl mx-auto space-y-4">
                  <div>
                    <label className="block text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-semibold mb-2 ml-1">Lieu de réception</label>
                    <input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Château de Chantilly" autoFocus className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-semibold mb-2 ml-1">Ville</label>
                    <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Chantilly, Oise" className={inputCls} />
                  </div>
                  {venue && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-4 sm:p-5 rounded-2xl bg-white border border-black/10 shadow-sm">
                      <span className="w-10 h-10 rounded-full bg-[#8A6D4B]/10 text-[#8A6D4B] flex items-center justify-center shrink-0"><MapPin size={18} /></span>
                      <div className="min-w-0"><div className="font-semibold truncate">{venue}</div><div className="text-sm text-neutral-400 truncate">{city || 'France'}</div></div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
                <h1 className="text-center font-medium tracking-tight" style={{ fontFamily: neoFont, fontSize: 'clamp(1.9rem, 6vw, 3.2rem)' }}>Quel style vous ressemble ?</h1>
                <p className="mt-2 text-center text-neutral-500 text-sm sm:text-base">Huit directions artistiques. Une seule évidence.</p>
                <div className="mt-6 sm:mt-8 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                  {WEDDING_STYLES.map((s) => (
                    <button key={s.id} onClick={() => setStyle(s.id)} className={`relative aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden text-left transition ring-offset-2 ring-offset-[#FAF8F5] ${style === s.id ? 'ring-[3px] ring-neutral-900 scale-[1.01]' : 'hover:scale-[1.01]'}`}>
                      <img src={s.image} alt={s.name} className="absolute inset-0 w-full h-full object-cover" />
                      <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      {style === s.id && (
                        <span className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center shadow"><Check size={16} className="text-neutral-900" /></span>
                      )}
                      <span className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
                        <span className="block text-base sm:text-lg font-medium tracking-tight" style={{ fontFamily: neoFont }}>{s.name}</span>
                        <span className="block text-[11px] text-white/80 mt-0.5 line-clamp-1">{s.tagline}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && <p className="mt-6 text-center text-sm text-red-500">{error}</p>}

          <div className="mt-8 sm:mt-10 flex items-center justify-between gap-3">
            {step > 0 ? (
              <button onClick={() => setStep(step - 1)} disabled={creating} className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-3.5 rounded-full border border-black/15 text-sm font-medium hover:border-black/40 transition disabled:opacity-50"><ArrowLeft size={15} /> Retour</button>
            ) : <Link to="/" className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-3.5 rounded-full border border-black/15 text-sm font-medium hover:border-black/40 transition"><ArrowLeft size={15} /> Accueil</Link>}
            {step < 3 ? (
              <button onClick={() => canNext() && setStep(step + 1)} disabled={!canNext()} className="inline-flex items-center gap-1.5 px-6 sm:px-8 py-3.5 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 transition disabled:opacity-30 disabled:cursor-not-allowed">Continuer <ArrowRight size={15} /></button>
            ) : (
              <button onClick={create} disabled={!canNext() || creating} className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-full bg-[#8A6D4B] text-white text-sm font-semibold hover:bg-[#75593C] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
                {creating ? <><Loader2 size={16} className="animate-spin" /> Création…</> : <>Créer mon site <ArrowRight size={16} /></>}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
