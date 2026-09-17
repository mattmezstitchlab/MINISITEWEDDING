import { Mail, Phone } from 'lucide-react';
import { useSiteView } from './context';
import { Eyebrow, SectionTitle } from './primitives';

/** Email et téléphone des mariés, en pastilles de verre. */
export default function Contact() {
  const { site, accent, muted, ink, glass, glassSpec, btnR } = useSiteView();

  return (
    <section className="px-5 py-20 text-center sm:px-8 sm:py-24" style={{ color: ink }}>
      <div className="mx-auto max-w-xl">
        <Eyebrow>Contact</Eyebrow>
        <SectionTitle style={{ fontSize: 'clamp(1.8rem, 3.8vw, 2.5rem)' }}>Une question ? Écrivez-nous</SectionTitle>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {site.contact_email && (
            <a href={`mailto:${site.contact_email}`} className={`${glass} ${glassSpec} vp-lift inline-flex items-center gap-2 px-6 py-3.5 text-[14.5px] font-medium`} style={{ borderRadius: btnR }}>
              <Mail size={16} style={{ color: accent }} />{site.contact_email}
            </a>
          )}
          {site.contact_phone && (
            <a href={`tel:${site.contact_phone.replace(/\s/g, '')}`} className={`${glass} ${glassSpec} vp-lift inline-flex items-center gap-2 px-6 py-3.5 text-[14.5px] font-medium`} style={{ borderRadius: btnR }}>
              <Phone size={16} style={{ color: accent }} />{site.contact_phone}
            </a>
          )}
          {!site.contact_email && !site.contact_phone && (
            <p className="text-[14px]" style={{ color: muted }}>Les coordonnées seront ajoutées très bientôt.</p>
          )}
        </div>
      </div>
    </section>
  );
}
