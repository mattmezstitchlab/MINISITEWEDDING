import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Palette, Images, MailCheck, Gift, MapPin, CalendarDays, QrCode, ChevronRight } from 'lucide-react';
import { WEDDING_STYLES, PHASES } from '../lib/weddingStyles';

const STEPS = [
  { n: '01', title: 'Je crée', text: 'Prénoms, date, lieu. Trois réponses, trente secondes.' },
  { n: '02', title: 'Je choisis', text: 'Un style parmi huit directions artistiques.' },
  { n: '03', title: 'J’ajoute', text: 'Photos, programme, infos — le site se compose seul.' },
  { n: '04', title: 'Je partage', text: 'Un lien, un QR code. Vos invités sont conquis.' },
];

const MODULES = [
  { icon: MailCheck, title: 'RSVP élégant', text: 'Présences, régimes, hébergement. Des statistiques limpides, jamais de tableaux austères.' },
  { icon: Gift, title: 'Liste & cagnotte', text: 'Voyage de noces, cagnotte, liste de cadeaux. Objectifs, progression, bouton Participer.' },
  { icon: Images, title: 'Bibliothèque média', text: 'Seize univers photo, six collections cohérentes, vos propres images en un clic.' },
  { icon: MapPin, title: 'Infos pratiques', text: 'Adresses, parking, hébergements, dress code. Des cartes minimalistes, toujours claires.' },
  { icon: CalendarDays, title: 'Programme Jour J', text: 'Une timeline éditoriale : cérémonie, cocktail, dîner, bal. Heure, lieu, photo.' },
  { icon: QrCode, title: 'Partage magique', text: 'prenom-prenom.byaime.fr, QR code à imprimer, partage WhatsApp, Messages, Email.' },
];

const fadeUp = { initial: { opacity: 0, y: 32 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' } };

const studioFont = '"Wix Madefor Display", "Plus Jakarta Sans", system-ui, sans-serif';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A] overflow-x-hidden" style={{ fontFamily: studioFont }}>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F5]/85 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-[64px] sm:h-[68px] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[13px] font-normal" style={{ fontFamily: studioFont }}>W</span>
            <span className="text-[13px] tracking-[0.25em] uppercase font-medium">Wedding Site</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-[13px] tracking-[0.12em] uppercase text-neutral-500 font-medium">
            <a href="#styles" className="hover:text-black transition">Styles</a>
            <a href="#experience" className="hover:text-black transition">Expérience</a>
            <a href="#modules" className="hover:text-black transition">Modules</a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/p/matt-marie" className="hidden sm:inline-flex text-[12px] sm:text-[13px] tracking-wide px-4 sm:px-5 py-2.5 rounded-full border border-black/15 hover:border-black/40 transition">Voir un exemple</Link>
            <Link to="/creer" className="inline-flex items-center gap-1.5 text-[12px] sm:text-[13px] tracking-wide px-4 sm:px-5 py-2.5 rounded-full bg-neutral-900 text-white hover:bg-neutral-700 transition font-medium">Créer mon site <ArrowRight size={14} /></Link>
          </div>
        </div>
      </nav>

      <header className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.img initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }} src="/images/hero-wedding.jpg" alt="Mariage" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/70" />
        </div>
        <div className="relative text-center px-4 sm:px-6 pt-24 pb-16 sm:py-0 max-w-4xl mx-auto w-full">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-white font-light tracking-tight leading-[1.04]"
            style={{ fontFamily: studioFont, fontSize: 'clamp(2.5rem, 8vw, 5.5rem)' }}
          >
            Votre mariage.<br />Votre histoire. <em className="font-light italic">Un seul endroit.</em>
          </motion.h1>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto sm:max-w-none">
            <Link to="/creer" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 sm:px-9 py-4 rounded-full bg-white text-neutral-900 text-sm tracking-[0.12em] uppercase font-medium hover:bg-neutral-100 transition shadow-lg">Créer mon site <ArrowRight size={16} /></Link>
            <Link to="/p/matt-marie" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 sm:px-9 py-4 rounded-full border border-white/40 text-white text-sm tracking-[0.12em] uppercase backdrop-blur-sm hover:bg-white/10 transition">Voir un exemple</Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-10 sm:mt-12 flex items-center justify-center gap-3 sm:gap-6 text-white/75 text-[11px] sm:text-[12px] tracking-[0.18em] uppercase flex-wrap">
            <span>1 · Je crée</span><span className="w-1 h-1 rounded-full bg-white/40" /><span>2 · Je choisis</span><span className="w-1 h-1 rounded-full bg-white/40" /><span>3 · J’ajoute</span><span className="w-1 h-1 rounded-full bg-white/40" /><span>4 · Je partage</span>
          </motion.div>
        </div>
      </header>

      <section className="py-24 sm:py-36 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="text-center max-w-2xl mx-auto">
            <div className="text-[11px] tracking-[0.3em] uppercase text-[#8A6D4B] font-semibold">Compris en 10 secondes</div>
            <h2 className="mt-4 font-normal tracking-tight" style={{ fontFamily: studioFont, fontSize: 'clamp(2rem, 5vw, 3.4rem)' }}>Quatre gestes. Zéro effort.</h2>
          </motion.div>
          <div className="mt-14 sm:mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <motion.div key={s.n} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.1 }} className="p-8 sm:p-10 rounded-3xl bg-white border border-black/5 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
                <div className="text-[14px] tracking-[0.25em] text-[#8A6D4B] font-semibold" style={{ fontFamily: studioFont }}>{s.n}</div>
                <div className="mt-3 text-2xl font-semibold tracking-tight" style={{ fontFamily: studioFont }}>{s.title}</div>
                <p className="mt-3 text-sm text-neutral-500 leading-relaxed font-light">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="styles" className="py-24 sm:py-36 bg-white border-y border-black/5 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="text-[11px] tracking-[0.3em] uppercase text-[#8A6D4B] font-semibold">Huit directions artistiques</div>
              <h2 className="mt-4 font-normal tracking-tight" style={{ fontFamily: studioFont, fontSize: 'clamp(2rem, 5vw, 3.4rem)' }}>Choisissez votre style.<br />Le reste est automatique.</h2>
            </div>
            <Link to="/creer" className="shrink-0 inline-flex items-center gap-2 text-sm text-neutral-700 hover:text-black transition font-semibold">Essayer maintenant <ChevronRight size={16} /></Link>
          </motion.div>
        </div>
        <div className="mt-12 sm:mt-16 flex gap-6 overflow-x-auto px-4 sm:px-8 pb-6 touch-pan-x" style={{ scrollbarWidth: 'none' }}>
          {WEDDING_STYLES.map((s, i) => (
            <motion.div key={s.id} {...fadeUp} transition={{ duration: 0.6, delay: (i % 4) * 0.08 }} className="shrink-0 w-[240px] sm:w-[300px] group">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.06)]">
                <img src={s.image} alt={s.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7 text-white">
                  <div className="text-xl sm:text-2xl font-semibold tracking-tight" style={{ fontFamily: studioFont }}>{s.name}</div>
                  <div className="mt-1 text-[13px] text-white/80 font-light">{s.tagline}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="experience" className="py-24 sm:py-36 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }}>
            <div className="text-[11px] tracking-[0.3em] uppercase text-[#8A6D4B] font-semibold">L’éditeur</div>
            <h2 className="mt-4 font-normal tracking-tight" style={{ fontFamily: studioFont, fontSize: 'clamp(2rem, 5vw, 3.4rem)' }}>Choisir. Modifier.<br />Voir. Publier.</h2>
            <p className="mt-5 text-neutral-500 leading-relaxed max-w-md text-base font-light">Pas de panneau rempli de paramètres. Au centre, votre site en direct. Un clic sur une photo ouvre vos images, un clic sur un texte ouvre l’éditeur. Conçu pour mobile et ordinateur avec une grande clarté.</p>
            <div className="mt-8 space-y-3.5 font-light">
              {['Sections réorganisables par glisser-déposer', 'Réglages contextuels instantanés', 'Aperçu mobile et ordinateur en temps réel'].map((t) => (
                <div key={t} className="flex items-center gap-3 text-[15px]"><span className="w-6 h-6 rounded-full bg-[#8A6D4B]/10 text-[#8A6D4B] flex items-center justify-center text-[12px] font-semibold">✓</span>{t}</div>
              ))}
            </div>
            <Link to="/creer" className="mt-10 inline-flex items-center gap-2 px-8 sm:px-9 py-4 rounded-full bg-neutral-900 text-white text-sm tracking-wide hover:bg-neutral-700 transition font-semibold shadow-md"><Palette size={16} /> Personnaliser mon mariage</Link>
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.8 }} className="relative">
            <div className="rounded-[2.2rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.12)] border border-black/5 relative">
              <img src="/images/table-noir.jpg" alt="Éditeur" className="w-full aspect-[4/5] sm:aspect-square object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
                <div><div className="text-[11px] tracking-[0.25em] uppercase text-white/70">Matt & Marie</div><div className="text-xl sm:text-2xl font-semibold tracking-tight" style={{ fontFamily: studioFont }}>18.07.2027</div></div>
                <Link to="/p/matt-marie" className="px-5 py-2.5 rounded-full bg-white text-neutral-900 text-[13px] font-semibold shadow-md">Voir</Link>
              </div>
            </div>
            <div className="absolute -top-4 -right-2 sm:-right-4 px-5 py-3 rounded-2xl bg-white shadow-xl border border-black/5 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[13px] font-semibold">Site publié</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="modules" className="py-24 sm:py-36 px-4 sm:px-8 bg-[#141311] text-white">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="text-center max-w-2xl mx-auto">
            <div className="text-[11px] tracking-[0.3em] uppercase text-[#C6A15B] font-semibold">Tout est inclus</div>
            <h2 className="mt-4 font-normal tracking-tight" style={{ fontFamily: studioFont, fontSize: 'clamp(2rem, 5vw, 3.4rem)' }}>Un objet éditorial complet</h2>
            <p className="mt-4 text-white/60 leading-relaxed text-base font-light">RSVP, cagnotte, galerie, programme, FAQ — chaque module est opérationnel immédiatement. Vous personnalisez à votre rythme.</p>
          </motion.div>
          <div className="mt-14 sm:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODULES.map((m, i) => (
              <motion.div key={m.title} {...fadeUp} transition={{ duration: 0.6, delay: (i % 3) * 0.1 }} className="p-8 sm:p-9 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
                <div className="w-12 h-12 rounded-full bg-[#C6A15B]/15 text-[#C6A15B] flex items-center justify-center"><m.icon size={22} strokeWidth={1.5} /></div>
                <div className="mt-5 text-xl font-semibold tracking-tight" style={{ fontFamily: studioFont }}>{m.title}</div>
                <p className="mt-3 text-[14px] text-white/60 leading-relaxed font-light">{m.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-36 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="text-center">
            <div className="text-[11px] tracking-[0.3em] uppercase text-[#8A6D4B] font-semibold">Les trois temps</div>
            <h2 className="mt-4 font-normal tracking-tight" style={{ fontFamily: studioFont, fontSize: 'clamp(2rem, 5vw, 3.4rem)' }}>Un site qui vit avec vous</h2>
          </motion.div>
          <div className="mt-14 sm:mt-16 grid md:grid-cols-3 gap-6">
            {PHASES.map((p, i) => (
              <motion.div key={p.id} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.1 }} className="p-8 sm:p-10 rounded-3xl bg-white border border-black/5 shadow-sm text-center">
                <div className="text-[11px] tracking-[0.3em] uppercase text-neutral-400 font-semibold">Phase {i + 1}</div>
                <div className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight" style={{ fontFamily: studioFont }}>{p.name}</div>
                <p className="mt-3 text-sm text-neutral-500 leading-relaxed font-light">{p.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.p {...fadeUp} transition={{ duration: 0.7 }} className="mt-10 text-center text-neutral-500 text-sm sm:text-base italic max-w-lg mx-auto font-light" style={{ fontFamily: studioFont }}>« Après le mariage, il devient la mémoire numérique de votre grand jour. »</motion.p>
        </div>
      </section>

      <section className="py-24 sm:py-32 px-4 sm:px-8 bg-[#1A1A1A] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeUp} transition={{ duration: 0.8 }} className="relative rounded-3xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] shadow-2xl">
            <img src="/images/chateau.jpg" alt="Exemple de mariage" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white text-center">
              <div className="text-[11px] tracking-[0.3em] uppercase text-[#C6A15B] font-semibold">Voir le rendu invité</div>
              <div className="mt-3 font-medium tracking-tight text-2xl sm:text-4xl" style={{ fontFamily: studioFont }}>Marie & Matt<br /><span className="text-base sm:text-xl font-light opacity-80">18 Juillet 2027</span></div>
              <Link to="/p/matt-marie" className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-neutral-900 text-sm font-semibold hover:bg-neutral-100 transition shadow-lg">Voir l’exemple <ArrowRight size={15} /></Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 sm:py-36 px-4 sm:px-8 bg-[#FAF8F5] text-center border-t border-black/5">
        <div className="max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center mx-auto text-lg font-semibold" style={{ fontFamily: studioFont }}>W</div>
          <h2 className="mt-5 font-normal tracking-tight" style={{ fontFamily: studioFont, fontSize: 'clamp(2rem, 5vw, 3.4rem)' }}>Le site de votre mariage,<br />en quelques instants.</h2>
          <Link to="/creer" className="mt-8 inline-flex items-center gap-2 px-8 sm:px-10 py-4 rounded-full bg-neutral-900 text-white text-sm tracking-[0.12em] uppercase font-semibold hover:bg-neutral-700 transition shadow-xl">Créer mon site <ArrowRight size={16} /></Link>
        </div>
      </section>

      <footer className="py-8 px-4 sm:px-8 border-t border-black/5 text-sm text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[11px]" style={{ fontFamily: studioFont }}>W</span><span className="tracking-[0.25em] uppercase font-medium">Wedding Site</span></div>
        <div className="flex items-center gap-5 text-neutral-600"><Link to="/creer" className="hover:text-black transition">Créer</Link><Link to="/p/matt-marie" className="hover:text-black transition">Exemple</Link></div>
        <div className="text-[12px]">© {new Date().getFullYear()} Wedding Site. Tous droits réservés.</div>
      </footer>
    </div>
  );
}
