import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Sparkles, Users } from 'lucide-react';
import VendorSiteStudio from '../components/VendorSiteStudio';
import { contentFor } from '../lib/universeContent';
import { styleById } from '../lib/weddingStyles';
import { DOMAINES, domaineDe } from '../lib/weddingVendors';
import { estIntermittent } from '../lib/vendorModules';

/**
 * L'ESPACE DU PRESTATAIRE
 *
 * Le même éditeur que celui des mariés, pour un métier : le visuel de l'univers
 * en haut, les modules du métier en dessous. Une page courte — l'éditeur se
 * comprend en le regardant.
 */

/** Le métier montré par défaut : un traiteur, dans un château moderne. */
const ROLE_DEFAUT = 'Traiteur Haute Gastronomie';
const STYLE_DEFAUT = 'chateau-moderne';

export default function VendorStudio() {
  const [params] = useSearchParams();
  const role = params.get('role')?.trim() || ROLE_DEFAUT;
  const styleId = params.get('style')?.trim() || STYLE_DEFAUT;
  const style = styleById(styleId);
  const content = contentFor(style);
  const domaine = DOMAINES[domaineDe(role)] ?? DOMAINES.polyvalent;

  return (
    <div className="vp-env min-h-screen bg-[#FBFAF8] text-[#0B0C12]">
      {/* ——————————————————————— le hero ——————————————————————— */}
      <header className="relative overflow-hidden">
        <img src={style.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C12] via-[#0B0C12]/85 to-[#0B0C12]/45" />

        <div className="relative mx-auto max-w-[1180px] px-6 pb-12 pt-24">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 no-underline transition hover:text-white"
          >
            ← VOWS
          </Link>

          <span className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.16em] text-black">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: style.accent }} />
            Espace prestataire
          </span>

          <h1 className="mt-5 max-w-[720px] text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-[48px]">
            {role}
          </h1>
          <p className="mt-4 max-w-[560px] text-[15px] leading-relaxed text-white/70">
            Votre page, dans la langue de votre métier — {domaine.label.toLowerCase()}, dans l’univers{' '}
            {style.name}.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            <a
              href="#editeur"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-[#0B0C12] no-underline transition hover:bg-white/90"
            >
              Ouvrir l’éditeur <ArrowRight size={14} />
            </a>
            <Link
              to="/creer"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-[13px] font-semibold text-white no-underline backdrop-blur transition hover:bg-white/20"
            >
              Créer une carte
            </Link>
            {estIntermittent(role) && (
              <span className="rounded-full bg-white/12 px-4 py-2 font-mono text-[10.5px] uppercase tracking-wider text-white/75">
                Intermittent du spectacle
              </span>
            )}
          </div>

          <p className="mt-6 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/45">
            {content.couple.venue} · {content.couple.city} · {content.couple.guests} invités
          </p>
        </div>
      </header>

      {/* ——————————————————————— l'éditeur ——————————————————————— */}
      <main id="editeur" className="mx-auto max-w-[1240px] px-6 py-12">
        {/* La clé remonte l'éditeur quand on change de métier par un lien. */}
        <VendorSiteStudio key={`${role}|${styleId}`} initialRole={role} initialStyleId={styleId} />
      </main>

      {/* ——————————————————————— le même site, trois écritures ——————————————————————— */}
      <section className="border-t border-black/8 bg-white">
        <div className="mx-auto max-w-[1240px] px-6 py-12">
          <h2 className="max-w-[640px] text-[24px] font-semibold leading-tight tracking-[-0.02em] sm:text-[30px]">
            Un seul mariage, trois façons de le lire.
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {[
              {
                titre: 'Les mariés écrivent le site',
                texte: 'Programme, régimes, accès, chiffres.',
                lien: '/creer',
                lienTexte: 'Créer leur mini-site',
              },
              {
                titre: 'Les invités le lisent',
                texte: 'La réponse, le programme, la cagnotte.',
                lien: '/apercu',
                lienTexte: 'Voir un mini-site',
              },
              {
                titre: 'Vous, vous écrivez votre page',
                texte: 'Votre mission, vos accès, vos créneaux.',
                lien: '#editeur',
                lienTexte: 'Revenir à l’éditeur',
              },
            ].map((carte) => (
              <div key={carte.titre} className="rounded-[22px] bg-[#FBFAF8] px-5 py-5">
                <div className="text-[13.5px] font-semibold">{carte.titre}</div>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-black/55">{carte.texte}</p>
                <a
                  href={carte.lien}
                  className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-black/65 no-underline transition hover:text-black"
                >
                  {carte.lienTexte} <ArrowRight size={12} />
                </a>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-[22px] bg-[#0B0C12] px-6 py-4 text-white">
            <span className="inline-flex items-center gap-2.5 text-[12.5px] font-medium">
              <Users size={15} className="text-white/55" />
              Les autres métiers de cet univers
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {style.humanMissions.map((m) => (
                <Link
                  key={m.role}
                  to={`/prestataire?role=${encodeURIComponent(m.role)}&style=${style.id}`}
                  className="rounded-full bg-white/10 px-3 py-1.5 text-[11.5px] font-medium text-white/85 no-underline transition hover:bg-white/20"
                >
                  {m.role}
                </Link>
              ))}
            </div>
            <span className="ml-auto hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-white/45 lg:inline-flex">
              <Sparkles size={12} /> Un éditeur par métier
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
