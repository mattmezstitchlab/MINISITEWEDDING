import { Link } from 'react-router-dom';
import { UserRound, Users } from 'lucide-react';
import { formatDateShort } from '../../lib/format';
import { useSiteView } from './context';

/** Signature du site : prénoms, date, lieu et mot selon la phase du mariage. */
export default function Footer() {
  const { site, fonts, headWeight, muted, ink, dark, glass, glassSpec, names } = useSiteView();

  return (
    <footer className="px-5 pb-8" style={{ color: ink }}>
      <div className={`${glass} ${glassSpec} mx-auto max-w-4xl rounded-[32px] px-6 py-14 text-center`}>
        <div className="text-[30px]" style={{ fontFamily: fonts.heading, fontWeight: headWeight, letterSpacing: '-0.03em' }}>{names}</div>
        <div className="vp-num mt-2 text-[13.5px] tracking-[0.24em]" style={{ color: muted }}>{formatDateShort(site.wedding_date)} — {site.city || site.venue}</div>
        <div className="mt-6 flex items-center justify-center gap-2 text-[14px]" style={{ color: muted }}>
          <Users size={15} />
          <span>{site.phase === 'apres' ? 'Merci d’avoir partagé ce jour avec nous' : site.phase === 'pendant' ? 'C’est aujourd’hui — à tout à l’heure' : 'Nous avons hâte de vous retrouver'}</span>
        </div>
        <div className="mt-8 border-t pt-7 text-[11px] uppercase tracking-[0.2em]" style={{ borderColor: dark ? 'rgba(255,255,255,0.12)' : 'rgba(12,14,24,0.08)', color: muted }}>Créé avec VOWS</div>
        <Link
          to="/carte"
          className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold transition-opacity hover:opacity-70"
          style={{ color: muted }}
        >
          <UserRound size={13} /> Créer ma carte
        </Link>
      </div>
    </footer>
  );
}
