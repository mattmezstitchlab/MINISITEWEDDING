import { motion } from 'framer-motion';
import { CalendarDays, MailCheck, Music2 } from 'lucide-react';
import { WEDDING_STYLES } from '../lib/weddingStyles';
import { formatDateLong } from '../lib/format';
import VisionImage from './vision/VisionImage';

/**
 * L'ÉCRAN DU COUPLE
 *
 * Un seul téléphone, posé sous le hero. Il montre ce que les mariés ont sous
 * les yeux : leur site, leur compte à rebours, leurs réponses, leur programme,
 * leurs morceaux, et le partage du lien.
 */

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
};

export default function HomePhoneShowcase() {
  const style = WEDDING_STYLES.find((s) => s.id === 'chateau-moderne') || WEDDING_STYLES[0];
  const weddingDate = '2027-06-12';

  return (
    <section className="relative z-20 bg-[#FAFAFC] px-5 pb-20 sm:px-8 sm:pb-28">
      <div className="relative mx-auto max-w-6xl">
        <div className="flex justify-center pt-16 sm:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="w-[265px] shrink-0 sm:w-[285px]"
          >
            <div className="relative w-full rounded-[48px] bg-[#0E0F14] p-[9px] shadow-[0_45px_100px_rgba(0,0,0,0.32)] ring-1 ring-black/10">
              <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[40px] bg-white">
                {/* Dynamic Island */}
                <div className="absolute left-1/2 top-2.5 z-20 h-[19px] w-[80px] -translate-x-1/2 rounded-full bg-black" />

                <div className="flex h-full w-full flex-col overflow-hidden bg-white text-left text-[#111116]">
                  {/* Le visuel du site */}
                  <div className="relative h-[46%] w-full shrink-0 overflow-hidden">
                    <VisionImage src={style.image} alt={style.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full shadow-sm" style={{ background: style.accent }} />
                      <span className="rounded-full bg-white/95 px-2 py-0.5 text-[8.5px] font-mono font-bold uppercase tracking-wider text-[#111116] shadow-sm">
                        Votre site
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                      <div className="text-[8px] font-mono uppercase tracking-[0.2em] text-white/70">
                        {style.name}
                      </div>
                      <div className="vp-title mt-1 text-[21px] leading-none">
                        Sarah &amp; Gabriel
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[9.5px] text-white/80">
                        <span className="font-mono">{formatDateLong(weddingDate)}</span>
                        <span className="font-semibold text-white/90">J-267</span>
                      </div>
                    </div>
                  </div>

                  {/* Ce que le couple suit */}
                  <div className="flex flex-1 flex-col justify-center gap-2 bg-[#FAFAFC] p-3.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-[12px] border border-black/5 bg-white p-2 text-center shadow-sm">
                        <div className="text-[14px] font-bold text-black">84 / 92</div>
                        <div className="text-[8px] font-mono uppercase text-black/40">RSVP reçus</div>
                      </div>
                      <div className="rounded-[12px] border border-black/5 bg-white p-2 text-center shadow-sm">
                        <div className="text-[14px] font-bold text-black">14</div>
                        <div className="text-[8px] font-mono uppercase text-black/40">Métiers alignés</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-[12px] border border-black/5 bg-white p-2 shadow-sm">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] bg-black text-white">
                        <CalendarDays size={12} />
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-[9.5px] font-bold text-black">16h30 · Cérémonie &amp; vœux</div>
                        <div className="truncate text-[8.5px] font-mono text-black/45">Château des Tilleuls</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-[12px] border border-black/5 bg-white p-2 shadow-sm">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] bg-black text-white">
                        <Music2 size={12} />
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-[9.5px] font-bold text-black">Ouverture de bal</div>
                        <div className="truncate text-[8.5px] font-mono text-black/45">Le morceau, à l’écoute</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-[12px] bg-[#111116] p-2 text-white shadow-sm">
                      <MailCheck size={12} className="shrink-0" />
                      <span className="text-[9.5px] font-bold">Partager le lien &amp; le QR code</span>
                    </div>
                  </div>

                </div>

                {/* Home bar */}
                <div className="pointer-events-none absolute inset-x-0 bottom-1.5 z-20 flex justify-center">
                  <span className="h-1 w-24 rounded-full bg-black/20" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Le texte, sous le téléphone */}
        <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.25 }} className="mx-auto mt-12 max-w-3xl text-center">
          <h2 className="vp-title text-[#0B0C12]" style={{ fontSize: 'clamp(2.4rem, 5.2vw, 4.2rem)', lineHeight: 1.05 }}>
            Votre mariage,
            <br />
            <span className="text-[#0B0C12]/40">tenu d’une main.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-relaxed text-[#0B0C12]/60 sm:text-[17.5px]">
            Le site, les réponses des invités, le programme, les morceaux, et chaque
            métier qui confirme son créneau. Tout tient dans un seul écran — le vôtre.
          </p>

        </motion.div>
      </div>
    </section>
  );
}
