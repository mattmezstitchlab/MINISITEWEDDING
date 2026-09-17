import { useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ScanBarcode, Clock, MapPin, Heart, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { PublicSiteData } from '../../lib/types';
import { publicUrl, formatDateShort, formatDateLong } from '../../lib/format';
import { getThemeConfig } from '../../lib/themeConfigs';

interface Props {
  data: PublicSiteData;
  preview?: boolean;
}

/**
 * Vue spéciale SUPERMARCHÉ 22H — ticket de caisse thermique qui s'imprime au scroll.
 * Remplace toute la page publique quand style = supermarche.
 * 
 * Concept : le site EST un ticket de caisse. Chaque section = une ligne du ticket.
 * Parallax + impression thermique + bruit de caisse (visuel).
 */
export default function SupermarcheTicket({ data, preview = false }: Props) {
  const { site, programme, infos, gifts, rsvpEvents, faqs } = data;
  const config = getThemeConfig('supermarche');
  const packages = config?.packages || [];
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const paperY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  const [showRsvp, setShowRsvp] = useState(false);

  const ticketNumber = useMemo(() => `T-${String(site.id).padStart(6, '0')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`, [site.id]);
  const dateStr = new Date().toLocaleString('fr-FR');

  return (
    <div ref={containerRef} className="min-h-[300vh] bg-[#0A0A0A] text-black selection:bg-[#00FF88]/30">
      {/* Sticky header supermarché */}
      <div className="sticky top-0 z-30 border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3 text-white sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00FF88] text-black">
              <ShoppingCart size={16} />
            </span>
            <span className="font-mono text-[13px] font-bold tracking-[0.2em]">SUPERMARCHÉ 22H</span>
            <span className="hidden rounded-full bg-white/10 px-2.5 py-1 font-mono text-[10px] tracking-widest text-white/60 sm:block">RAYON 7 • OUVERT 22H-02H</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-white/50">
            <span className="hidden sm:inline">TICKET {ticketNumber}</span>
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#00FF88]" />
          </div>
        </div>
      </div>

      {/* Receipt paper */}
      <div className="relative mx-auto max-w-[440px] px-3 py-10 sm:px-0 sm:py-16">
        {/* Printer top */}
        <div className="relative mx-auto h-8 w-[88%] rounded-t-[12px] bg-[#1A1A1A] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-x-6 top-2 h-[3px] rounded-full bg-black/50" />
          <div className="absolute left-1/2 top-1/2 h-1 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00FF88]/20" />
        </div>

        <motion.div
          style={{ y: paperY }}
          className="relative bg-[#FFFEF8] font-mono text-[13px] leading-[1.35] text-black shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(0,0,0,0.08)]"
        >
          {/* Zigzag top */}
          <div className="absolute -top-3 left-0 right-0 h-3 bg-[radial-gradient(circle_at_6px_0px,_transparent_6px,_#FFFEF8_6px)] bg-[length:12px_12px] bg-repeat-x" />

          <div className="p-6 sm:p-8">
            {/* Header ticket */}
            <div className="text-center">
              <div className="font-black tracking-[0.22em]" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)' }}>SUPERMARCHÉ 22H</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-black/50">Ouvert quand tout est fermé • Rayon 7</div>
              <div className="mt-3 border-y border-dashed border-black/15 py-2 text-[10px] leading-relaxed">
                <div>{site.venue || 'SUPERMARCHÉ — RAYON 7'} • {site.city || 'FRANCE'}</div>
                <div>{formatDateLong(site.wedding_date)} • {formatDateShort(site.wedding_date)}</div>
                <div>TICKET: {ticketNumber} • {dateStr}</div>
              </div>
            </div>

            {/* Couple = article principal */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-6 border-b border-dashed border-black/15 pb-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-black/40">ARTICLE PRINCIPAL</div>
                  <div className="mt-1 text-[22px] font-black leading-none tracking-tight">
                    {site.partner1.toUpperCase()} & {site.partner2.toUpperCase()}
                  </div>
                  <div className="mt-1 text-[11px] text-black/60">{site.hero_subtitle || 'Nous nous marions — rayon 7'}</div>
                </div>
                <Heart size={18} className="mt-1 text-black" />
              </div>
              <div className="mt-3 flex items-center gap-2 text-[11px]">
                <span className="rounded bg-black px-2 py-0.5 text-white">QTÉ 2</span>
                <span className="text-black/50">•</span>
                <span>AMOUR • 1 lot • 22h17</span>
              </div>
            </motion.div>

            {/* Programme = rayons */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em]">
                <Clock size={12} /> RAYONS • PROGRAMME
              </div>
              <div className="mt-3 space-y-2">
                {programme.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-3 border-b border-dotted border-black/10 py-2 last:border-0"
                  >
                    <span className="w-12 shrink-0 font-bold">{p.event_time}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold uppercase">{p.title}</div>
                      <div className="text-[11px] leading-snug text-black/60">{p.description}</div>
                      {p.place && <div className="mt-0.5 flex items-center gap-1 text-[10px] text-black/40"><MapPin size={10} />{p.place}</div>}
                    </div>
                    <span className="shrink-0 text-[10px] text-black/30">#{String(i + 1).padStart(2, '0')}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Lieux + Infos = allées */}
            <div className="mt-7 border-t border-dashed border-black/15 pt-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em]">ALLÉES • INFOS</div>
              <div className="mt-3 grid gap-2">
                {infos.slice(0, 6).map((info, i) => (
                  <motion.div
                    key={info.id}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="flex justify-between gap-3 text-[11px]"
                  >
                    <span className="font-bold uppercase">{info.category}:</span>
                    <span className="text-right text-black/60">{info.title} — {info.detail.slice(0, 48)}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Packages = tickets de caisse */}
            <div className="mt-7 border-y border-dashed border-black/15 py-5">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em]">TICKETS DE CAISSE • PACKAGES</div>
                <span className="rounded bg-[#00FF88] px-2 py-0.5 text-[10px] font-bold text-black">3 OFFRES</span>
              </div>
              <div className="mt-4 space-y-3">
                {packages.map((pkg, i) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className={`relative rounded-[10px] border p-3 ${pkg.popular ? 'border-black bg-black text-white' : 'border-black/15 bg-white'}`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-2 right-3 rounded-full bg-[#00FF88] px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-black">POPULAIRE</span>
                    )}
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold uppercase tracking-tight">{pkg.name}</div>
                      <div className="font-black">{pkg.price}</div>
                    </div>
                    <div className="mt-1 text-[11px] leading-snug opacity-70">{pkg.description}</div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {pkg.features.slice(0, 3).map(f => (
                        <span key={f} className={`rounded-full px-2 py-0.5 text-[9px] uppercase tracking-widest ${pkg.popular ? 'bg-white/15 text-white/80' : 'bg-black/5 text-black/60'}`}>{f}</span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-3 text-center text-[10px] uppercase tracking-widest text-black/40">Paiement 3x • Facture • Pas de frais cachés</div>
            </div>

            {/* RSVP = liste de courses */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em]">
                <ShoppingCart size={12} /> LISTE DE COURSES • RSVP
              </div>
              <div className="mt-3 rounded-[12px] border border-black/10 bg-[#FFF8E1] p-3">
                <div className="text-[11px] font-bold">Coche ce que tu prends :</div>
                <div className="mt-2 space-y-1.5">
                  {rsvpEvents.map(ev => (
                    <label key={ev.id} className="flex items-center gap-2 text-[12px]">
                      <span className="flex h-4 w-4 items-center justify-center rounded border border-black/20 bg-white"><Check size={10} className="opacity-0" /></span>
                      <span className="font-bold uppercase">{ev.name}</span>
                      <span className="text-black/40">— {ev.description}</span>
                    </label>
                  ))}
                </div>
                <button
                  onClick={() => setShowRsvp(!showRsvp)}
                  className="mt-3 w-full rounded-[8px] bg-black py-2.5 text-[12px] font-bold uppercase tracking-widest text-white"
                >
                  {showRsvp ? 'Fermer la liste' : 'Remplir ma liste de courses'}
                </button>
                <AnimatePresence>
                  {showRsvp && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="mt-3 border-t border-dashed border-black/15 pt-3 text-[11px]">
                        <div>Nom : _________________________</div>
                        <div className="mt-2">Présent ? [ ] OUI [ ] NON • Combien ? ___</div>
                        <div className="mt-2">Allergies : _____________________</div>
                        <div className="mt-3 rounded bg-black px-3 py-2 text-center text-[11px] font-bold uppercase tracking-widest text-white">Ajouter au caddie →</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Cagnotte = total */}
            <div className="mt-7 border-t-2 border-black pt-4">
              <div className="space-y-1 font-bold">
                <div className="flex justify-between text-[11px]"><span>SOUS-TOTAL</span><span>AMOUR x2</span></div>
                <div className="flex justify-between text-[11px]"><span>TVA 0% (amour non taxable)</span><span>0,00€</span></div>
                <div className="mt-2 flex justify-between border-t border-black pt-2 text-[16px]"><span>TOTAL</span><span>MERCI</span></div>
              </div>
              <div className="mt-4 text-center text-[10px] uppercase tracking-[0.18em] text-black/40">
                Merci de votre visite • {site.partner1} & {site.partner2}
                <br />
                Ticket non échangeable, amour définitif
              </div>
            </div>

            {/* QR + Barcode */}
            <div className="mt-6 flex flex-col items-center gap-4 border-t border-dashed border-black/15 pt-6">
              <div className="rounded-[12px] bg-white p-3 shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">
                <QRCodeSVG value={typeof window !== 'undefined' ? publicUrl(site.slug) : ''} size={96} level="M" />
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <span key={i} className="h-10 w-[2px] bg-black" style={{ width: i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1, opacity: i % 4 === 0 ? 1 : 0.6 }} />
                  ))}
                </div>
                <div className="mt-1 font-mono text-[10px] tracking-[0.3em]">{ticketNumber}</div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-black/30">
                <ScanBarcode size={14} /> SCAN À LA CAISSE 3
              </div>
            </div>

            {/* FAQ ticket */}
            {faqs.length > 0 && (
              <div className="mt-8 border-t border-dashed border-black/15 pt-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em]">FAQ • SERVICE CLIENTÈLE</div>
                <div className="mt-3 space-y-2">
                  {faqs.slice(0, 3).map(f => (
                    <div key={f.id} className="text-[11px]">
                      <div className="font-bold">Q: {f.question}</div>
                      <div className="text-black/60">R: {f.answer.slice(0, 120)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer ticket */}
            <div className="mt-8 border-t border-black pt-4 text-center text-[9px] uppercase leading-relaxed tracking-widest text-black/30">
              SUPERMARCHÉ 22H • {site.venue} • {site.city}
              <br />
              Ouvert 22h-02h • Fermé au public • Ouvert pour nous
              <br />
              Ticket imprimé le {dateStr} • Ne pas repasser • Conserver précieusement
            </div>
          </div>

          {/* Zigzag bottom */}
          <div className="absolute -bottom-3 left-0 right-0 h-3 rotate-180 bg-[radial-gradient(circle_at_6px_0px,_transparent_6px,_#FFFEF8_6px)] bg-[length:12px_12px] bg-repeat-x" />
        </motion.div>

        {/* Shadow under paper */}
        <div className="mx-auto mt-2 h-6 w-[80%] rounded-full bg-black/20 blur-[12px]" />

        {/* Floating caddie */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="pointer-events-none absolute -right-6 top-[20%] hidden rounded-full bg-[#00FF88] p-3 shadow-[0_10px_30px_rgba(0,255,136,0.4)] sm:flex"
        >
          <ShoppingCart size={20} className="text-black" />
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <div className="sticky bottom-0 z-20 border-t border-white/10 bg-[#0A0A0A]/90 px-5 py-4 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex max-w-[440px] items-center justify-between gap-3">
          <div className="font-mono text-[11px] leading-tight text-white/60">
            <div className="font-bold text-white">{site.partner1} & {site.partner2}</div>
            <div>{formatDateShort(site.wedding_date)} • RAYON 7</div>
          </div>
          <a href="#sec-rsvp" className="rounded-full bg-[#00FF88] px-5 py-2.5 font-mono text-[12px] font-bold uppercase tracking-widest text-black">
            Liste de courses →
          </a>
        </div>
      </div>
    </div>
  );
}
