import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Loader2, MapPin, CalendarDays, Heart, Palette } from 'lucide-react';
import { formatDateLong, daysUntil } from '../lib/format';
import { seedSite } from '../lib/defaults';
import StylePicker from '../components/StylePicker';

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
      const { site } = await seedSite({ partner1, partner2, wedding_date: date, venue, city, style });
      navigate(`/generer?site=${site.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue. Réessayez.');
      setCreating(false);
    }
  };

  return (
    <div className="vp-env flex min-h-screen flex-col">
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
        <div className="w-full max-w-5xl">
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
                      {partner1 || '…'} <span className="text-[var(--vp-muted-2)]">&amp;</span> {partner2 || '…'}
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
                  <div className="vp-eyebrow">Étape 4 · On casse les codes ?</div>
                  <h1 className="vp-title mt-3" style={{ fontSize: 'clamp(2rem, 5.4vw, 3.1rem)' }}>Quel mariage vous ressemble vraiment ?</h1>
                  <p className="vp-body mx-auto mt-3 max-w-2xl">
                    Fini le château + pivoines en boucle. 8 partis pris radicaux, 8 images uniques, 8 couleurs qui claquent.
                    Un mariage peut être un club à 2h17, un motel vide, un bunker en béton, un fanzine photocopié.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <span className="vp-chip !text-[11px]">Anti-château</span>
                    <span className="vp-chip !text-[11px]">Plus de bouquet.jpg en double</span>
                    <span className="vp-chip !text-[11px]">Buzz garanti</span>
                  </div>
                </div>
                <div className="mt-10">
                  <StylePicker value={style} onChange={setStyle} />
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="vp-glass vp-spec rounded-[18px] p-4">
                    <div className="text-[13px] font-semibold">Ce qui fait du buzz :</div>
                    <ul className="mt-2 list-disc pl-4 text-[12.5px] leading-relaxed text-[var(--vp-muted)]">
                      <li>Visuels ultra-distincts → chaque partage est reconnaissable</li>
                      <li>Manifeste intégré → les invités comprennent le délire</li>
                      <li>Accent qui claque → le site n’est plus beige</li>
                    </ul>
                  </div>
                  <div className="vp-glass vp-spec rounded-[18px] p-4">
                    <div className="text-[13px] font-semibold">Exemples qui cartonnent :</div>
                    <ul className="mt-2 list-disc pl-4 text-[12.5px] leading-relaxed text-[var(--vp-muted)]">
                      <li><b>Club Amour</b> : invitation = flyer rave, dress code = club kid</li>
                      <li><b>Punk Papier</b> : faire-part photocopié, coût 0€, anti-luxe</li>
                      <li><b>Desert Motel</b> : elopement Americana, piscine vide, 38°C</li>
                    </ul>
                  </div>
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
