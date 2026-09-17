import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Loader2, MapPin, CalendarDays, Heart, Palette } from 'lucide-react';
import { apiSend, slugify, formatDateLong, daysUntil } from '../lib/api';
import { WEDDING_STYLES } from '../lib/weddingStyles';
import type { WeddingSite } from '../lib/types';
import VisionImage from '../components/vision/VisionImage';

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
    { icon: Palette, label: 'L’environnement' },
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
        typography: 'spatial', accent_color: theme.accent, button_style: 'pill',
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

  return (
    <div className="vp-env flex min-h-screen flex-col">
      {/* Navigation : capsule de verre + progression */}
      <nav className="sticky top-3 z-40 mx-auto w-[calc(100%-1rem)] max-w-5xl sm:top-4">
        <div className="vp-glass vp-spec flex flex-wrap items-center justify-between gap-3 rounded-[26px] px-4 py-2.5 sm:px-5">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="vp-glyph h-8 w-8 rounded-full text-[12px] font-semibold">W</span>
            <span className="vp-title hidden text-[14px] sm:inline">Wedding Site</span>
          </Link>
          <div className="flex items-center gap-1 sm:gap-1.5">
            {steps.map((s, i) => (
              <div key={s.label} className="flex items-center gap-1 sm:gap-1.5">
                <div
                  className={`flex items-center gap-2 rounded-full px-2.5 py-1.5 text-[12px] font-medium transition-all duration-500 sm:px-3.5 ${
                    i === step
                      ? 'bg-[var(--vp-ink)] text-white'
                      : i < step
                        ? 'bg-[var(--vp-green)]/90 text-white'
                        : 'bg-black/[0.05] text-[var(--vp-muted)]'
                  }`}
                >
                  {i < step ? <Check size={14} /> : <s.icon size={14} />}
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < steps.length - 1 && <span className="h-px w-1.5 bg-black/15 sm:w-5" />}
              </div>
            ))}
          </div>
          <div className="vp-num hidden text-[13px] text-[var(--vp-muted)] md:block">{step + 1} / 4</div>
        </div>
      </nav>

      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, y: 26, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.985 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                <div className="text-center">
                  <div className="vp-eyebrow">Étape 1 · Les mariés</div>
                  <h1 className="vp-title mt-3" style={{ fontSize: 'clamp(2rem, 5.4vw, 3.1rem)' }}>Qui se marie ?</h1>
                  <p className="vp-body mx-auto mt-3 max-w-md">Vos prénoms, tels que vous voulez les voir en grand.</p>
                </div>
                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="vp-label ml-1">Premier prénom</label>
                    <input value={partner1} onChange={(e) => setPartner1(e.target.value)} placeholder="Marie" autoFocus className="vp-field !py-5 !text-[1.7rem] !font-semibold" />
                  </div>
                  <div>
                    <label className="vp-label ml-1">Second prénom</label>
                    <input value={partner2} onChange={(e) => setPartner2(e.target.value)} placeholder="Matt" className="vp-field !py-5 !text-[1.7rem] !font-semibold" />
                  </div>
                </div>
                {(partner1 || partner2) && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="vp-glass vp-spec mt-8 rounded-[26px] px-6 py-8 text-center">
                    <div className="vp-eyebrow">Aperçu</div>
                    <div className="vp-title mt-2" style={{ fontSize: 'clamp(2.2rem, 6.4vw, 3.6rem)' }}>
                      {partner1 || '…'}{' '}
                      <span className="text-[var(--vp-muted-2)]">&amp;</span>{' '}
                      {partner2 || '…'}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, y: 26, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.985 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="text-center">
                <div className="vp-eyebrow">Étape 2 · La date</div>
                <h1 className="vp-title mt-3" style={{ fontSize: 'clamp(2rem, 5.4vw, 3.1rem)' }}>Quelle est la date ?</h1>
                <p className="vp-body mx-auto mt-3 max-w-md">Le compte à rebours démarre dès aujourd’hui.</p>
                <div className="mx-auto mt-10 max-w-md">
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="vp-field vp-num !py-5 !text-center !text-[1.35rem] !font-semibold" />
                  {date && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="vp-glass vp-spec mt-6 rounded-[26px] p-6">
                      <div className="vp-h2 text-[19px] capitalize">{formatDateLong(date)}</div>
                      <div className="vp-chip mt-3 !text-[var(--vp-accent)]">
                        <CalendarDays size={15} /> <span className="vp-num">J-{daysUntil(date)}</span> avant le grand jour
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, y: 26, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.985 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                <div className="text-center">
                  <div className="vp-eyebrow">Étape 3 · Le lieu</div>
                  <h1 className="vp-title mt-3" style={{ fontSize: 'clamp(2rem, 5.4vw, 3.1rem)' }}>Où cela se passe ?</h1>
                  <p className="vp-body mx-auto mt-3 max-w-md">Le lieu qui accueillera votre histoire.</p>
                </div>
                <div className="mx-auto mt-10 max-w-xl space-y-4">
                  <div>
                    <label className="vp-label ml-1">Lieu de réception</label>
                    <input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Château de Chantilly" autoFocus className="vp-field" />
                  </div>
                  <div>
                    <label className="vp-label ml-1">Ville</label>
                    <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Chantilly, Oise" className="vp-field" />
                  </div>
                  {venue && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="vp-glass vp-spec flex items-center gap-3.5 rounded-[22px] p-5">
                      <span className="vp-glyph h-10 w-10 shrink-0 rounded-[14px]">
                        <MapPin size={17} />
                      </span>
                      <div>
                        <div className="text-[15px] font-semibold">{venue}</div>
                        <div className="vp-caption">{city || 'France'}</div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, y: 26, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.985 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                <div className="text-center">
                  <div className="vp-eyebrow">Étape 4 · L’environnement</div>
                  <h1 className="vp-title mt-3" style={{ fontSize: 'clamp(2rem, 5.4vw, 3.1rem)' }}>Quel espace vous ressemble ?</h1>
                  <p className="vp-body mx-auto mt-3 max-w-md">Huit environnements spatiaux. Une seule évidence.</p>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {WEDDING_STYLES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStyle(s.id)}
                      className={`vp-press text-left transition-all duration-500 ${
                        style === s.id ? 'scale-[1.01] ring-2 ring-[var(--vp-accent)] ring-offset-4 ring-offset-transparent' : 'hover:scale-[1.01]'
                      }`}
                      style={{ borderRadius: 14 }}
                    >
                      <span className="relative block overflow-hidden rounded-[14px]">
                        <VisionImage src={s.image} alt={s.name} fallbackLabel={s.name} aura={s.aura} className="aspect-[3/4] w-full object-cover" />
                        {style === s.id && (
                          <span className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white">
                            <Check size={15} className="text-[var(--vp-accent)]" strokeWidth={2.6} />
                          </span>
                        )}
                      </span>
                      <span className="block px-0.5 pt-2.5">
                        <span className="vp-title block text-[16px]">{s.name}</span>
                        <span className="vp-caption mt-0.5 block !text-[11.5px]">{s.tagline}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <p className="mt-6 rounded-[16px] bg-[color-mix(in_srgb,var(--vp-red)_12%,transparent)] px-4 py-3 text-center text-sm font-medium text-[#B3261E]">{error}</p>
          )}

          <div className="mt-10 flex items-center justify-between gap-4">
            {step > 0 ? (
              <button onClick={() => setStep(step - 1)} disabled={creating} className="vp-btn vp-btn-glass vp-press disabled:opacity-40">
                <ArrowLeft size={16} /> Retour
              </button>
            ) : (
              <Link to="/" className="vp-btn vp-btn-glass vp-press">
                <ArrowLeft size={16} /> Accueil
              </Link>
            )}
            {step < 3 ? (
              <button onClick={() => canNext() && setStep(step + 1)} disabled={!canNext()} className="vp-btn vp-press !px-7">
                Continuer <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={create} disabled={!canNext() || creating} className="vp-btn vp-press !px-7">
                {creating ? <><Loader2 size={16} className="animate-spin" /> Création…</> : <>Créer mon site <ArrowRight size={16} /></>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
