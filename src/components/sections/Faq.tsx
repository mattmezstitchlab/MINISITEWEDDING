import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useSiteView } from './context';
import { Eyebrow, SectionTitle } from './primitives';

function FaqItem({ q, a }: { q: string; a: string }) {
  const { fonts, headWeight, muted, dark } = useSiteView();
  const [open, setOpen] = useState(false);

  return (
    <div className={dark ? 'vp-hr-dark' : 'vp-hr'} style={{ paddingBottom: 2 }}>
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-4 py-5 text-left vp-press">
        <span className="text-[18px]" style={{ fontFamily: fonts.heading, fontWeight: headWeight, letterSpacing: '-0.02em' }}>{q}</span>
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

/** Questions fréquentes, en accordéon dans un panneau de verre. */
export default function Faq() {
  const { data, muted, ink, glass, glassSpec } = useSiteView();
  const faqs = data.faqs;

  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28" style={{ color: ink }}>
      <div className="mx-auto max-w-2xl">
        <Eyebrow>Questions fréquentes</Eyebrow>
        <SectionTitle>Tout vous dire</SectionTitle>
        <div className={`${glass} ${glassSpec} mt-10 rounded-[28px] px-7 sm:px-9`} style={{ paddingTop: 8, paddingBottom: 8 }}>
          {faqs.map((f) => (
            <FaqItem key={f.id} q={f.question} a={f.answer} />
          ))}
          {faqs.length === 0 && <p className="py-8 text-center" style={{ color: muted }}>Les réponses arrivent bientôt.</p>}
        </div>
      </div>
    </section>
  );
}
