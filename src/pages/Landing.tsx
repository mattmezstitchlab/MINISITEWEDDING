import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Palette, Images, MailCheck, Gift, MapPin, CalendarDays, QrCode, ChevronRight, Heart } from 'lucide-react';
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
  { icon: Images, title: 'Bibliothèque média', text: 'Seize univers photo, six collections cohérentes, vos propres images en un glisser-déposer.' },
  { icon: MapPin, title: 'Infos pratiques', text: 'Adresses, parking, hébergements, dress code. Des cartes minimalistes, toujours claires.' },
  { icon: CalendarDays, title: 'Programme Jour J', text: 'Une timeline éditoriale : cérémonie, cocktail, dîner, bal. Heure, lieu, photo.' },
  { icon: QrCode, title: 'Partage magique', text: 'prenom-prenom.byaime.fr, QR code à imprimer, partage WhatsApp, Messages, Email.' },
];

const fadeUp = { initial: { opacity: 0, y: 32 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' } };

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F5]/80 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[13px]" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>W</span>
            <span className="text-[13px] tracking-[0.3em] uppercase font-medium">Wedding Site</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-[13px] tracking-[0.12em] uppercase text-neutral-500">
            <a href="#styles" className="hover:text-black transition">Styles</a>
            <a href="#experience" className="hover:text-black transition">Expérience</a>
            <a href="#modules" className="hover:text-black transition">Modules</a>
          </div>
          <div className="flex items-center gap-2.5">
            <Link to="/p/matt-marie" className="hidden sm:inline-flex text-[13px] tracking-wide px-5 py-2.5 rounded-full border border-black/15 hover:border-black/40 transition">Voir un exemple</Link>
            <Link to="/creer" className="inline-flex items-center gap-1.5 text-[13px] tracking-wide px-5 py-2.5 rounded-full bg-neutral-900 text-white hover:bg-neutral-700 transition">Créer mon site <ArrowRight size={15} /></Link>
          </div>
        </div>
      </nav>

      <header className="relative min-h-[100svh] flex items-end sm:items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.img initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }} src="/images/hero-wedding.jpg" alt="Mariage" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/65" />
        </div>
        <div className="relative text-center px-6 pb-24 sm:pb-0 pt-32 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[12px] tracking-[0.2em] uppercase">
            <Sparkles size={14} /> Une nouvelle catégorie — le Wedding Site
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }} className="mt-7 text-white font-light leading-[1.05]" style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(2.6rem, 8vw, 5.5rem)' }}>
            Votre mariage.<br />Votre histoire. <em className="font-light">Un seul endroit.</em>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }} className="mt-6 text-white/80 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Le mini-site de votre mariage, composé automatiquement à partir de quelques réponses. Aucun outil à apprendre. Juste de l’émotion.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/creer" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full bg-white text-neutral-900 text-sm tracking-[0.15em] uppercase font-medium hover:bg-neutral-100 transition">Créer mon site <ArrowRight size={16} /></Link>
            <Link to="/p/matt-marie" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full border border-white/40 text-white text-sm tracking-[0.15em] uppercase backdrop-blur-sm hover:bg-white/10 transition">Voir un exemple</Link>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="mt-10 hidden sm:flex items-center justify-center gap-6 text-white/70 text-[12px] tracking-[0.2em] uppercase">
            <span>1 · Je crée</span><span className="w-1 h-1 rounded-full bg-white/50" /><span>2 · Je choisis</span><span className="w-1 h-1 rounded-full bg-white/50" /><span>3 · J’ajoute</span><span className="w-1 h-1 rounded-full bg-white/50" /><span>4 · Je partage</span>
          </motion.div>
        </div>
      </header>

      <section className="py-20 sm:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="text-center max-w-2xl mx-auto">
            <div className="text-[11px] tracking-[0.3em] uppercase text-[#8A6D4B]">Compris en 10 secondes</div>
            <h2 className="mt-4 font-light" style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>Quatre gestes. Zéro effort.</h2>
          </motion.div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((s, i) => (
              <motion.div key={s.n} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.1 }} className="p-8 rounded-3xl bg-white border border-black/5 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
                <div className="text-[13px] tracking-[0.3em] text-[#8A6D4B]" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>{s.n}</div>
                <div className="mt-3 text-2xl font-light" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>{s.title}</div>
                <p className="mt-2 text-[14px] text-neutral-500 leading-relaxed">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="styles" className="py-20 sm:py-28 bg-white border-y border-black/5 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-[11px] tracking-[0.3em] uppercase text-[#8A6D4B]">Huit directions artistiques</div>
              <h2 className="mt-4 font-light" style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>Choisissez votre style.<br />Le reste est automatique.</h2>
            </div>
            <Link to="/creer" className="shrink-0 inline-flex items-center gap-1.5 text-sm text-neutral-600 hover:text-black transition">Essayer maintenant <ChevronRight size={16} /></Link>
          </motion.div>
        </div>
        <div className="mt-10 flex gap-4 overflow-x-auto px-6 pb-4" style={{ scrollbarWidth: 'none' }}>
          {WEDDING_STYLES.map((s, i) => (
            <motion.div key={s.id} {...fadeUp} transition={{ duration: 0.6, delay: (i % 4) * 0.08 }} className="shrink-0 w-[240px] sm:w-[280px] group">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden">
                <img src={s.image} alt={s.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="text-2xl font-light" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>{s.name}</div>
                  <div className="mt-1 text-[13px] text-white/75">{s.tagline}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="experience" className="py-20 sm:py-28 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }}>
            <div className="text-[11px] tracking-[0.3em] uppercase text-[#8A6D4B]">L’éditeur</div>
            <h2 className="mt-4 font-light" style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>Choisir. Modifier.<br />Voir. Publier.</h2>
            <p className="mt-5 text-neutral-500 leading-relaxed max-w-md">Pas de panneau rempli de paramètres. Au centre, votre site en vrai. À gauche, sa structure. Un clic sur une photo ouvre vos images, un clic sur un texte ouvre la typographie. Simple comme Photos, beau comme Keynote.</p>
            <div className="mt-8 space-y-3">
              {['Sections réorganisables par glisser-déposer', 'Réglages contextuels, jamais de fouillis', 'Aperçu mobile et ordinateur instantané'].map((t) => (
                <div key={t} className="flex items-center gap-3 text-[15px]"><span className="w-6 h-6 rounded-full bg-[#8A6D4B]/10 text-[#8A6D4B] flex items-center justify-center text-[13px]">✓</span>{t}</div>
              ))}
            </div>
            <Link to="/creer" className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-neutral-900 text-white text-sm tracking-wide hover:bg-neutral-700 transition"><Palette size={16} /> Personnaliser mon mariage</Link>
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.8 }} className="relative">
            <div className="rounded-[2rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.12)] border border-black/5 relative">
              <img src="/images/table-noir.jpg" alt="Éditeur" className="w-full aspect-[4/5] sm:aspect-square object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
                <div><div className="text-[11px] tracking-[0.3em] uppercase text-white/70">Matt & Marie</div><div className="text-2xl font-light" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>18.07.2027</div></div>
                <Link to="/p/matt-marie" className="px-5 py-2.5 rounded-full bg-white text-neutral-900 text-[13px] font-medium">Voir</Link>
              </div>
            </div>
            <div className="absolute -top-5 -right-2 sm:-right-4 px-5 py-3.5 rounded-2xl bg-white shadow-xl border border-black/5 flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[13px] font-medium">Site publié</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="modules" className="py-20 sm:py-28 px-6 bg-[#141311] text-white">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="text-center max-w-2xl mx-auto">
            <div className="text-[11px] tracking-[0.3em] uppercase text-[#C6A15B]">Tout est inclus</div>
            <h2 className="mt-4 font-light" style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>Un objet éditorial complet</h2>
            <p className="mt-4 text-white/60 leading-relaxed">RSVP, cagnotte, galerie, programme, FAQ — chaque module naît déjà rempli. Vous ajustez, c’est tout.</p>
          </motion.div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODULES.map((m, i) => (
              <motion.div key={m.title} {...fadeUp} transition={{ duration: 0.6, delay: (i % 3) * 0.1 }} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                <div className="w-11 h-11 rounded-full bg-[#C6A15B]/15 text-[#C6A15B] flex items-center justify-center"><m.icon size={20} strokeWidth={1.5} /></div>
                <div className="mt-4 text-xl" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>{m.title}</div>
                <p className="mt-2 text-[14px] text-white/55 leading-relaxed">{m.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="text-center">
            <div className="text-[11px] tracking-[0.3em] uppercase text-[#8A6D4B]">Avant · Pendant · Après</div>
            <h2 className="mt-4 font-light" style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>Un site qui vit avec vous</h2>
          </motion.div>
          <div className="mt-12 grid sm:grid-cols-3 gap-4">
            {PHASES.map((p, i) => (
              <motion.div key={p.id} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.1 }} className="relative p-8 rounded-3xl bg-white border border-black/5 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#8A6D4B]" style={{ opacity: 0.25 + i * 0.25 }} />
                <div className="text-[12px] tracking-[0.3em] uppercase text-neutral-400">Phase {i + 1}</div>
                <div className="mt-2 text-3xl font-light" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>{p.name}</div>
                <p className="mt-2 text-[14px] text-neutral-500">{p.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.p {...fadeUp} transition={{ duration: 0.7 }} className="mt-8 text-center text-neutral-500 italic" style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.25rem' }}>« Après le mariage, il devient la mémoire numérique de votre jour. »</motion.p>
        </div>
      </section>

      <section className="px-6 pb-20 sm:pb-28">
        <motion.div {...fadeUp} transition={{ duration: 0.8 }} className="max-w-6xl mx-auto relative rounded-[2.5rem] overflow-hidden min-h-[480px] flex items-end">
          <img src="/images/chateau.jpg" alt="Exemple de mariage" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <div className="relative p-8 sm:p-14 text-white max-w-xl">
            <div className="text-[11px] tracking-[0.3em] uppercase text-white/70">Un vrai mariage</div>
            <div className="mt-3 font-light" style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(2.2rem, 5vw, 3.6rem)' }}>Matt & Marie<br />18.07.2027</div>
            <p className="mt-3 text-white/75">Château de Chantilly. Entrez, explorez, répondez au RSVP — comme un invité.</p>
            <Link to="/p/matt-marie" className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-neutral-900 text-sm font-medium hover:bg-neutral-100 transition">Voir l’exemple <ArrowRight size={16} /></Link>
          </div>
        </motion.div>
      </section>

      <section className="px-6 pb-24">
        <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="max-w-4xl mx-auto text-center py-16 sm:py-20 px-8 rounded-[2.5rem] bg-neutral-900 text-white">
          <Heart size={30} strokeWidth={1.25} className="mx-auto text-[#C6A15B]" />
          <h2 className="mt-5 font-light" style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>Et si c’était vraiment<br />le site de votre mariage ?</h2>
          <p className="mt-4 text-white/60">Trente secondes pour commencer. Une émotion pour longtemps.</p>
          <Link to="/creer" className="mt-8 inline-flex items-center gap-2 px-10 py-4 rounded-full bg-white text-neutral-900 text-sm tracking-[0.12em] uppercase font-medium hover:bg-neutral-100 transition">Créer mon site <ArrowRight size={16} /></Link>
        </motion.div>
      </section>

      <footer className="border-t border-black/10 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-neutral-400">
          <div className="flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[11px]" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>W</span><span className="tracking-[0.25em] uppercase">Wedding Site</span></div>
          <div>Votre mariage. Votre histoire. Un seul endroit.</div>
          <div className="flex items-center gap-5"><Link to="/creer" className="hover:text-black transition">Créer</Link><Link to="/p/matt-marie" className="hover:text-black transition">Exemple</Link></div>
        </div>
      </footer>
    </div>
  );
}
