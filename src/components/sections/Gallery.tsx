import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import VisionImage, { VisionFrame } from '../vision/VisionImage';
import { useSiteView } from './context';
import { Eyebrow, SectionTitle } from './primitives';

/**
 * Galerie, mise en page selon le réglage « Layout » du site :
 * immersif (pleine largeur), galerie (colonnes), minimal (duo légendé)
 * ou magazine (grille avec une grande image).
 */
export default function Gallery() {
  const { site, data, theme, fonts, muted, ink, cardR, preview, lightbox, setLightbox } = useSiteView();
  const layout = site.layout || 'magazine';
  const visible = data.gallery.filter((g) => !g.is_private);
  const open = (url: string) => { if (!preview) setLightbox(url); };

  return (
    <section className="py-20 sm:py-28" style={{ color: ink }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Eyebrow>Galerie</Eyebrow>
        <SectionTitle>Nos images</SectionTitle>
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
                onClick={() => open(g.url)}
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
                onClick={() => open(g.url)}
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
                onClick={() => open(g.url)}
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
                onClick={() => open(g.url)}
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
}
