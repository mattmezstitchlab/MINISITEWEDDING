import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import VendorSiteStudio from '../components/VendorSiteStudio';
import { previewPath } from '../lib/previewSite';
import { styleById } from '../lib/weddingStyles';
import { DOMAINES, domaineDe } from '../lib/weddingVendors';
import { slugDeRole } from '../lib/metierPage';
import BandeDuHero from '../components/BandeDuHero';
import { cartesDesMetiersDuRole } from '../lib/cartesVivantes';

/**
 * L'ESPACE DU PRESTATAIRE
 *
 * Une page courte : le métier, l'univers où il travaille, et l'éditeur. Le reste
 * se lit dans l'éditeur — la page n'ajoute rien à lire.
 */

/** Le métier montré par défaut : un traiteur, dans un château moderne. */
const ROLE_DEFAUT = 'Traiteur Haute Gastronomie';
const STYLE_DEFAUT = 'chateau-moderne';

export default function VendorStudio() {
  const [params] = useSearchParams();
  const role = params.get('role')?.trim() || ROLE_DEFAUT;
  const styleId = params.get('style')?.trim() || STYLE_DEFAUT;
  const style = styleById(styleId);
  const domaine = DOMAINES[domaineDe(role)] ?? DOMAINES.polyvalent;

  return (
    <div className="vp-env min-h-screen bg-[#FBFAF8] text-[#0B0C12]">
      {/* ——————————————————————— le hero, court ——————————————————————— */}
      <header className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
        <img src={style.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C12] via-[#0B0C12]/85 to-[#0B0C12]/40" />

        <div className="vp-page relative pb-16 pt-24">
          {/* Le retour occupe sa propre ligne : rien ne vient se poser dessus. */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.16em] text-black">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: style.accent }} />
              Espace prestataire
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
              {domaine.label}
            </span>
          </div>

          <h1 className="mt-4 max-w-[760px] text-[34px] font-semibold leading-[1.04] tracking-[-0.03em] text-white sm:text-[50px]">
            {role}
          </h1>

          <p className="mt-3 max-w-[520px] text-[14.5px] text-white/65">
            Dans l’univers {style.name}.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <a
              href="#editeur"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-[#0B0C12] no-underline transition hover:bg-white/90"
            >
              Ouvrir l’éditeur <ArrowRight size={14} />
            </a>
            <Link
              to={previewPath({ styleId: style.id })}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-[13px] font-semibold text-white no-underline backdrop-blur transition hover:bg-white/20"
            >
              Leur mini-site
            </Link>
          </div>

          {/* La bande de l'espace : les métiers de l'univers, en cartes
              vivantes — le cœur vaut pour un avis, le play montre leur Jour J. */}
          <div className="mt-10">
            <BandeDuHero
              libelle="Les métiers de cet univers"
              note={`${style.humanMissions.length} métiers · avis du public`}
              styleId={style.id}
              cartes={cartesDesMetiersDuRole(role, style.id, 12)}
            />
          </div>
        </div>
      </header>

      {/* ——————————————————————— l'éditeur ——————————————————————— */}
      <main id="editeur" className="vp-page py-10">
        {/* La clé remonte l'éditeur quand on change de métier par un lien. */}
        <VendorSiteStudio key={`${role}|${styleId}`} initialRole={role} initialStyleId={styleId} />
      </main>

      {/* ——————————————————————— les autres métiers ——————————————————————— */}
      <footer className="border-t border-black/8 py-8">
        <div className="vp-page flex flex-wrap items-center gap-x-4 gap-y-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/40">
            Autres métiers · {style.name}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {style.humanMissions
              .filter((m) => m.role !== role)
              .map((m) => (
                <Link
                  key={m.role}
                  to={`/prestataire?role=${encodeURIComponent(m.role)}&style=${style.id}`}
                  className="rounded-full bg-black/5 px-3 py-1.5 text-[11.5px] font-medium text-black/70 no-underline transition hover:bg-black/10"
                >
                  {m.role}
                </Link>
              ))}
          </div>
          <Link
            to={`/metiers/${slugDeRole(role)}`}
            className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider text-black/60 no-underline transition hover:text-black"
          >
            La page entière de ce métier <ArrowRight size={12} />
          </Link>
          <Link
            to="/prestataire"
            className="inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider text-black/50 no-underline transition hover:text-black"
          >
            Tous les métiers <ArrowRight size={12} />
          </Link>
        </div>
      </footer>
    </div>
  );
}
