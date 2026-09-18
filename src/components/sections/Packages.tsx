import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useSiteView } from './context';
import { Eyebrow, SectionTitle } from './primitives';
import { getThemePackages, type ThemePackage } from '../../lib/themeConfigs';

export default function Packages() {
  const { data, theme, accent, ink, dark, glass, glassSpec, site } = useSiteView();
  
  // Packages depuis la config thématique, fallback sur gifts de type package
  const configPackages = getThemePackages(site.style);
  const dbPackages = data.gifts.filter(g => g.gift_type === 'package');
  
  // Si on a des packages en DB (seedés depuis config), on les utilise pour afficher prix/titre
  // Sinon on prend la config directe
  const packages: ThemePackage[] = configPackages.length > 0 ? configPackages : dbPackages.map((g, i) => ({
    id: `pkg-${g.id}`,
    name: g.title.split(' — ')[0] || g.title,
    price: g.title.split(' — ')[1] || '',
    description: g.description.split(' | ')[0] || g.description,
    features: (g.description.split(' | ')[1] || '').split(' • ').filter(Boolean),
    cta: 'Choisir ce package',
    popular: i === 1,
  }));

  if (packages.length === 0) return null;

  return (
    <section id="sec-packages" className="px-5 py-20 sm:px-8 sm:py-28" style={{ color: ink }}>
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>{`Tarifs • ${theme.name}`}</Eyebrow>
          <SectionTitle>Ce que ça inclut, vraiment</SectionTitle>
          <p className="vp-body mx-auto mt-4 max-w-xl">
            Pas de blabla. 3 packages, du plus brut au plus légende. Chaque package est pensé pour respecter l'univers <b>{theme.name}</b> — pas un copié-collé.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className={`relative flex flex-col rounded-[28px] border p-7 sm:p-8 ${
                pkg.popular ? 'border-[var(--vp-ink)] bg-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)]' : `${glass} ${glassSpec} border-white/60`
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-white shadow-md">
                  Le plus demandé
                </span>
              )}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">{theme.id} • {pkg.id}</div>
                  <div className="mt-1 text-[24px] font-semibold tracking-tight" style={{ fontFamily: 'var(--font-heading, inherit)' }}>{pkg.name}</div>
                </div>
                <span className="h-3 w-3 rounded-full" style={{ background: pkg.accent || accent }} />
              </div>

              <div className="mt-5">
                <div className="flex items-baseline gap-2">
                  <span className="text-[36px] font-bold tracking-tight">{pkg.price}</span>
                  {pkg.priceNote && <span className="text-[12px] font-medium text-black/50">{pkg.priceNote}</span>}
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-black/60">{pkg.description}</p>
              </div>

              <div className="mt-6 space-y-2.5">
                {pkg.features.map((f) => (
                  <div key={f} className="flex items-start gap-2.5 text-[13.5px] leading-snug">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black text-white">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-8">
                <a
                  href="#sec-rsvp"
                  className="vp-btn vp-press w-full justify-center !py-3.5 text-[14px]"
                  style={{ background: pkg.popular ? accent : dark ? 'rgba(255,255,255,0.12)' : 'black', color: pkg.popular ? 'white' : dark ? 'white' : 'white' }}
                >
                  {pkg.cta}
                </a>
                <p className="mt-3 text-center text-[11px] leading-relaxed text-black/40">
                  Paiement en 3x • Facture • Pas de frais cachés
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 rounded-[20px] bg-black/[0.04] p-5 text-center text-[12.5px] leading-relaxed text-black/60">
          <b>Est-ce pertinent d’afficher des tarifs ?</b> Oui. Ça évite 20 appels, ça filtre, ça rassure. Et surtout : chaque package est une extension de l’univers (ticket rave, ticket de caisse, cycle de lavage) — pas un tableau Excel beige.
        </div>
      </div>
    </section>
  );
}
