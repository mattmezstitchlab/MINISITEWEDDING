import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { WEDDING_STYLES, type WeddingStyle } from '../lib/weddingStyles';

function ParallaxTheme({ style, index }: { style: WeddingStyle; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Parallax : image bouge moins vite que le scroll
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1.15]);
  const titleY = useTransform(scrollYProgress, [0, 1], ['18%', '-18%']);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

  const number = String(index + 1).padStart(2, '0');

  return (
    <div ref={ref} className="group relative h-[92svh] min-h-[640px] w-full overflow-hidden bg-black">
      {/* Image parallax */}
      <motion.div style={{ y, scale }} className="absolute inset-0 -inset-y-[12%]">
        <img
          src={style.image}
          alt={style.name}
          className="h-[124%] w-full object-cover"
          loading="lazy"
        />
        {/* Gradient qui s'adapte au dark/light */}
        <div
          className="absolute inset-0"
          style={{
            background: style.dark
              ? `linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 38%, rgba(0,0,0,0.15) 72%, rgba(0,0,0,0.05) 100%)`
              : `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 42%, rgba(0,0,0,0.08) 78%, rgba(255,255,255,0.08) 100%)`,
          }}
        />
        {/* Accent wash */}
        <div
          className="absolute inset-0 opacity-[0.18] mix-blend-overlay"
          style={{ background: style.accent }}
        />
      </motion.div>

      {/* Top bar */}
      <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-6 sm:p-10">
        <div className="flex items-center gap-3">
          <span className="vp-num rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold tracking-widest text-white backdrop-blur-md">
            {number} — {style.id}
          </span>
          <span
            className="h-2.5 w-2.5 rounded-full shadow-[0_0_0_4px_rgba(255,255,255,0.15)]"
            style={{ background: style.accent }}
          />
        </div>
        <span className="hidden rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-white/70 backdrop-blur-md sm:block">
          {style.dark ? 'Nuit' : 'Jour'} • {style.tagline}
        </span>
      </div>

      {/* Big title + content */}
      <motion.div
        style={{ y: titleY, opacity }}
        className="absolute inset-0 flex flex-col justify-end p-6 pb-10 sm:p-10 sm:pb-14 lg:p-14"
      >
        {/* Huge title */}
        <h3
          className="vp-title select-none leading-[0.82] tracking-[-0.04em] text-white"
          style={{ fontSize: 'clamp(3.2rem, 11vw, 10rem)' }}
        >
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: '100%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: '-20%' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="block"
            >
              {style.name.split(' ')[0]}
            </motion.span>
          </span>
          {style.name.split(' ').slice(1).join(' ') && (
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: '100%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: '-20%' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
                className="block text-white/70"
              >
                {style.name.split(' ').slice(1).join(' ')}
              </motion.span>
            </span>
          )}
        </h3>

        {/* Bottom grid : tagline + manifesto + synopsis */}
        <div className="mt-8 grid gap-6 border-t border-white/15 pt-6 sm:grid-cols-[1.1fr_0.9fr] sm:gap-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-white/30" />
              <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-white/60">
                {style.tagline}
              </span>
            </div>
            <p className="mt-4 max-w-xl text-[17px] font-medium leading-[1.35] text-white/90 sm:text-[20px]">
              {style.manifesto}
            </p>
            <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-white/60">
              {style.synopsis}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-white/70 backdrop-blur-md">
                {style.dark ? 'Ambiance nuit' : 'Ambiance jour'}
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-black">
                {style.accent}
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-end gap-4">
            <div className="vp-glass-dark vp-spec-dark rounded-[20px] p-4 text-white">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-white/50">Pourquoi ça buzz</div>
              <div className="mt-2 text-[13px] leading-relaxed text-white/80">
                {index === 0 && 'Anti-château total. Personne n’a osé le béton brut. Photo iconique, presse archi garantie.'}
                {index === 1 && 'Mariage qui commence à 2h17. Flyer rave, stroboscope. TikTok va adorer.'}
                {index === 2 && 'Elopement Americana. Motel vide, 38°C. Très Wes Anderson, très Instagram.'}
                {index === 3 && 'Premier mariage pensé pour Vision Pro. Verre liquide, chrome. Buzz tech assuré.'}
                {index === 4 && 'Faire-part photocopié, coût 0€. Anti-industrie du mariage à 30k. Manifeste punk.'}
                {index === 5 && 'Forêt profonde, pas garden party. Rituel païen, champignons. Dark cottagecore.'}
                {index === 6 && 'Mariage = première de film. Ticket, rideau rouge, générique. Hollywood 70s.'}
                {index === 7 && '28 chaises différentes, assiettes de mamie. Maximalisme joyeux, durable, anti-Pinterest.'}
                {index === 8 && 'Supermarché vide à 22h. Néons, caddie, baiser rayon 7. Le plus anti-lieu du monde.'}
                {index === 9 && 'Laverie automatique. Tambours qui tournent, pastel. Le plus tendre des endroits banals.'}
              </div>
            </div>
            <Link
              to={`/creer`}
              state={{ preselectedStyle: style.id }}
              className="vp-btn vp-press w-full justify-center !bg-white !text-black hover:!bg-white/90 sm:w-fit"
            >
              Choisir {style.name} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Big number watermark */}
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none text-[28vw] font-black leading-none tracking-tighter text-white/[0.04] sm:right-10 sm:text-[18vw]">
        {number}
      </div>
    </div>
  );
}

export default function ImmersiveThemes() {
  return (
    <section id="styles-immersive" className="relative bg-[#0A0A0A] py-6 sm:py-10">
      {/* Header */}
      <div className="mx-auto max-w-6xl px-5 pb-10 pt-16 sm:px-8 sm:pb-16 sm:pt-24">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="h-px w-12 bg-white/20" />
            <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/50">
              10 environnements • 0 doublon • 100% buzz
            </span>
          </div>
          <h2 className="vp-title text-white" style={{ fontSize: 'clamp(2.6rem, 6vw, 5rem)', lineHeight: 0.9 }}>
            On a tué le<br />
            <span className="text-white/40">bouquet.jpg</span>
            <br />
            en boucle.
          </h2>
          <p className="max-w-2xl text-[17px] leading-relaxed text-white/60 sm:text-[19px]">
            10 partis pris radicaux. Chaque visuel est unique, chaque couleur claque, chaque concept pourrait faire un article à lui seul.
            Verticalité immersive, parallax, gros titres. Tu scroll, tu choisis ton camp.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Anti-château', 'Plus de beige', 'Fini les pivoines', 'Supermarché 22h', 'Laverie Club', 'Béton Brut'].map((t) => (
              <span key={t} className="rounded-full border border-white/15 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-widest text-white/60">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Vertical stack */}
      <div className="flex flex-col gap-6 px-3 sm:gap-8 sm:px-6">
        {WEDDING_STYLES.map((style, i) => (
          <div key={style.id} className="overflow-hidden rounded-[36px] sm:rounded-[48px]">
            <ParallaxTheme style={style} index={i} />
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="rounded-[32px] bg-white px-8 py-12 text-center sm:px-12 sm:py-16">
          <div className="vp-eyebrow">Tu as vu ?</div>
          <h3 className="vp-title mt-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Aucun ne ressemble à un mariage.
            <br />
            C’est pour ça qu’on s’en souvient.
          </h3>
          <Link to="/creer" className="vp-btn vp-press mt-8 !px-8 !py-4">
            Créer mon site avec un vrai parti pris <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
