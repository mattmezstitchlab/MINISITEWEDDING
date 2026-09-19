import { Link } from 'react-router-dom';
import { ArrowRight, BadgeEuro, Music2 } from 'lucide-react';
import { styleById } from '../lib/weddingStyles';
import { FAMILIES, metiersParDomaine } from '../lib/weddingVendors';
import { donneesMetier, estIntermittent, modulesDuMetier } from '../lib/vendorModules';
import { signatureLabel } from '../lib/themeSignatures';

/**
 * LES ÉDITEURS DES MÉTIERS
 *
 * Une carte par domaine, en visuel plein cadre : le portrait, le nom du métier
 * par-dessus, et rien d'autre. On entre dans l'éditeur du métier en cliquant —
 * la carte dit seulement de quel métier il s'agit, et dans quel univers.
 */

/** Le portrait qui représente un domaine : celui de sa famille de métier. */
function portraitDuDomaine(key: string): string {
  const famille = FAMILIES.find((f) => f.key === key);
  return famille?.portraits[0] ?? '/images/prestataires/hote.jpg';
}

const CARTES = metiersParDomaine().map((domaine) => {
  const metier = domaine.metiers[0];
  const styleId = metier?.universes[0]?.id ?? 'chateau-moderne';
  const role = metier?.role ?? 'Prestataire';
  const style = styleById(styleId);
  return {
    key: domaine.key,
    label: domaine.label,
    metiers: domaine.metiers.length,
    role,
    styleId,
    portrait: portraitDuDomaine(domaine.key),
    signature: signatureLabel(styleId),
    accent: style.accent,
    modules: modulesDuMetier(donneesMetier(style, role)).map((m) => m.nav),
    intermittent: estIntermittent(role),
  };
});

const ARTISTES = CARTES.filter((c) => c.intermittent).map((c) => c.label.toLowerCase());

export default function VendorEditorsShowcase() {
  return (
    <section className="bg-[#F6F4F0] px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="vp-eyebrow">Les prestataires</span>
            <h2 className="vp-title mt-3 max-w-[620px] text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1.08]">
              Le même éditeur, un par métier.
            </h2>
            <p className="mt-3 max-w-[520px] text-[14.5px] leading-relaxed text-black/60">
              {CARTES.length} domaines, {CARTES.reduce((n, c) => n + c.metiers, 0)} rôles. Le visuel
              est celui de l’univers, les modules sont ceux du métier.
            </p>
          </div>
          <Link
            to="/prestataire"
            className="inline-flex items-center gap-2 rounded-full bg-[#0B0C12] px-5 py-2.5 text-[13px] font-semibold text-white no-underline transition hover:bg-neutral-800"
          >
            Ouvrir l’éditeur prestataire <ArrowRight size={14} />
          </Link>
        </div>

        {/* Une carte par métier, en visuel plein cadre */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {CARTES.map((carte) => (
            <Link
              key={carte.key}
              to={`/prestataire?role=${encodeURIComponent(carte.role)}&style=${carte.styleId}`}
              aria-label={`Éditeur de ${carte.role}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-[24px] border border-black/10 bg-[#0B0C12] no-underline shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <img
                src={carte.portrait}
                alt=""
                className="vp-live-frame h-full w-full object-cover object-top opacity-90 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/35 to-black/10" />

              {carte.intermittent && (
                <span
                  className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2 py-1 font-mono text-[8.5px] font-bold uppercase tracking-wider text-black"
                  style={{ background: carte.accent }}
                >
                  <Music2 size={9} /> Intermittent
                </span>
              )}

              {/* Le titre du métier, par-dessus le visuel — et rien d'autre. */}
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <div className="text-[17px] font-bold leading-[1.1] drop-shadow-[0_4px_18px_rgba(0,0,0,0.5)]">
                  {carte.label}
                </div>
                <div className="mt-1.5 text-[11px] font-semibold" style={{ color: carte.accent }}>
                  {carte.signature}
                </div>
                <div className="mt-2 flex flex-wrap gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {carte.modules.slice(0, 3).map((nav) => (
                    <span
                      key={nav}
                      className="rounded-full bg-white/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white/85 backdrop-blur-sm"
                    >
                      {nav}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Les artistes et les techniciens du spectacle ont leur volet */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 rounded-[28px] bg-[#0B0C12] px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <BadgeEuro size={18} className="text-white/60" />
            <span className="text-[13.5px] font-semibold">Intermittent du Spectacle</span>
            <span className="hidden text-[12.5px] text-white/55 lg:inline">
              — cachets, GUSO, droits, 507 heures ({ARTISTES.join(', ')}).
            </span>
          </div>
          <Link
            to="/prestataire?role=Groupe%20Polyphonique%20Corse&style=corse"
            className="ml-auto inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12.5px] font-semibold text-[#0B0C12] no-underline transition hover:bg-white/90"
          >
            Voir le volet des cachets <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
