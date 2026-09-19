import { Link } from 'react-router-dom';
import { ArrowRight, BadgeEuro, Music2 } from 'lucide-react';
import { styleById } from '../lib/weddingStyles';
import { metiersParDomaine } from '../lib/weddingVendors';
import { donneesMetier, estIntermittent, modulesDuMetier } from '../lib/vendorModules';

/**
 * LES ÉDITEURS DES MÉTIERS
 *
 * Sous l'éditeur des mariés, le pendant côté prestataires : chaque domaine a son
 * éditeur, monté sur le même site et le même contenu, mais écrit dans sa langue.
 * Le catalogue est dérivé des univers — un métier n'existe ici que parce qu'un
 * mariage l'attend quelque part.
 */

interface CarteDomaine {
  key: string;
  label: string;
  description: string;
  metiers: number;
  role: string;
  styleId: string;
  univers: string;
  modules: string[];
  intermittent: boolean;
}

/** Le catalogue : un domaine, son métier d'appel, ses modules. */
const CARTES: CarteDomaine[] = metiersParDomaine().map((domaine) => {
  const metier = domaine.metiers[0];
  const styleId = metier?.universes[0]?.id ?? 'chateau-moderne';
  const role = metier?.role ?? 'Prestataire';
  const style = styleById(styleId);
  return {
    key: domaine.key,
    label: domaine.label,
    description: domaine.description,
    metiers: domaine.metiers.length,
    role,
    styleId,
    univers: style.name,
    modules: modulesDuMetier(donneesMetier(style, role)).map((m) => m.nav),
    intermittent: estIntermittent(role),
  };
});

const ARTISTES = CARTES.filter((c) => c.intermittent);

export default function VendorEditorsShowcase() {
  return (
    <section className="bg-[#F6F4F0] px-6 py-20">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="vp-eyebrow">Les prestataires</span>
            <h2 className="vp-title mt-3 max-w-[640px] text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1.08]">
              Le même éditeur, un par métier.
            </h2>
            <p className="mt-4 max-w-[620px] text-[14.5px] leading-relaxed text-black/60">
              Le hero ne change pas : c’est le visuel de l’univers où l’on travaille. Ce sont les
              modules qui parlent le métier — {CARTES.length} domaines, {CARTES.reduce((n, c) => n + c.metiers, 0)}{' '}
              rôles, et le même site des mariés en dessous.
            </p>
          </div>
          <Link
            to="/prestataire"
            className="inline-flex items-center gap-2 rounded-full bg-[#0B0C12] px-5 py-2.5 text-[13px] font-semibold text-white no-underline transition hover:bg-neutral-800"
          >
            Ouvrir l’éditeur prestataire <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARTES.map((carte) => (
            <Link
              key={carte.key}
              to={`/prestataire?role=${encodeURIComponent(carte.role)}&style=${carte.styleId}`}
              className="group flex flex-col rounded-[24px] border border-black/8 bg-white p-5 no-underline transition hover:-translate-y-0.5 hover:border-black/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[14.5px] font-semibold text-[#0B0C12]">{carte.label}</div>
                  <div className="mt-0.5 text-[11.5px] text-black/45">
                    {carte.metiers} métier{carte.metiers > 1 ? 's' : ''} · univers {carte.univers}
                  </div>
                </div>
                {carte.intermittent && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#0B0C12] px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-white">
                    <Music2 size={10} /> Intermittent
                  </span>
                )}
              </div>

              <p className="mt-3 text-[12px] leading-relaxed text-black/55">{carte.description}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {carte.modules.map((nav) => (
                  <span
                    key={nav}
                    className="rounded-full bg-black/5 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-wider text-black/50"
                  >
                    {nav}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-5 text-[12px] font-semibold text-black/70">
                <span className="inline-flex items-center gap-1.5 transition group-hover:gap-2.5">
                  Éditeur de {carte.role} <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Les artistes et les techniciens du spectacle ont un volet à part */}
        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4 rounded-[28px] bg-[#0B0C12] px-7 py-6 text-white">
          <div className="flex items-center gap-3">
            <BadgeEuro size={20} className="text-white/60" />
            <div>
              <div className="text-[15px] font-semibold">Intermittent du Spectacle</div>
              <div className="text-[12.5px] text-white/55">
                Les artistes et les techniciens du live ({ARTISTES.map((a) => a.label.toLowerCase()).join(', ')})
                ont leur volet : cachets, déclaration, droits, défraiement — et leurs heures comptées
                pour les 507.
              </div>
            </div>
          </div>
          <Link
            to="/prestataire?role=Groupe%20Polyphonique%20Corse&style=corse"
            className="ml-auto inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[12.5px] font-semibold text-[#0B0C12] no-underline transition hover:bg-white/90"
          >
            Voir le volet des cachets <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
