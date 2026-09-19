import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Sparkles, Users } from 'lucide-react';
import VendorSiteStudio from '../components/VendorSiteStudio';
import { contentFor } from '../lib/universeContent';
import { styleById } from '../lib/weddingStyles';
import { DOMAINES, domaineDe } from '../lib/weddingVendors';
import { estIntermittent } from '../lib/vendorModules';

/**
 * L'ESPACE DU PRESTATAIRE
 *
 * Une page par métier, montée sur le même éditeur que celui des mariés : le
 * hero vient de l'univers du mariage, les modules de la langue du métier, et
 * tout ce qui touche au jour J vient du site des mariés.
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
  const intermittent = estIntermittent(role);

  return (
    <div className="vp-env min-h-screen bg-[#FBFAF8] text-[#0B0C12]">
      {/* ——————————————————————— le hero ——————————————————————— */}
      <header className="relative overflow-hidden">
        <img src={style.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C12] via-[#0B0C12]/85 to-[#0B0C12]/45" />

        <div className="relative mx-auto max-w-[1180px] px-6 pb-14 pt-24 sm:pt-28">
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

          <h1 className="mt-5 max-w-[760px] text-[36px] font-semibold leading-[1.04] tracking-[-0.03em] text-white sm:text-[52px]">
            Votre page, dans la langue de votre métier.
          </h1>
          <p className="mt-4 max-w-[620px] text-[15px] leading-relaxed text-white/70">
            Même éditeur que les mariés, même site, autre écriture : le hero reste le visuel de leur
            univers, les modules parlent votre métier — {domaine.label.toLowerCase()}.
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
              Côté mariés, créer une carte
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3">
            {[
              { label: 'Rôle', valeur: role },
              { label: 'Domaine', valeur: domaine.label },
              { label: 'Univers', valeur: `${style.name} · ${content.couple.venue}` },
              intermittent ? { label: 'Statut', valeur: 'Intermittent du spectacle' } : null,
            ]
              .filter(Boolean)
              .map((item) => (
                <div key={item!.label}>
                  <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/45">
                    {item!.label}
                  </div>
                  <div className="mt-1 text-[12.5px] font-medium text-white/85">{item!.valeur}</div>
                </div>
              ))}
          </div>
        </div>
      </header>

      {/* ——————————————————————— l'éditeur ——————————————————————— */}
      <main id="editeur" className="mx-auto max-w-[1240px] px-6 py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
              L’éditeur du métier
            </span>
            <h2 className="mt-2 max-w-[620px] text-[26px] font-semibold leading-tight tracking-[-0.02em] sm:text-[32px]">
              Le hero ne bouge pas. Les modules, si.
            </h2>
          </div>
          <p className="max-w-[380px] text-[12.5px] leading-relaxed text-black/55">
            Vous changez de métier, de domaine, d’univers : les modules suivent. Vos textes, eux,
            restent les vôtres.
          </p>
        </div>

        {/* La clé remonte l'éditeur quand on change de métier par un lien : les
            modules et le brouillon repartent du métier choisi. */}
        <VendorSiteStudio key={`${role}|${styleId}`} initialRole={role} initialStyleId={styleId} />
      </main>

      {/* ——————————————————————— la connexion ——————————————————————— */}
      <section className="border-t border-black/8 bg-white">
        <div className="mx-auto max-w-[1240px] px-6 py-14">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
            Un site, trois écritures
          </span>
          <h2 className="mt-2 max-w-[680px] text-[26px] font-semibold leading-tight tracking-[-0.02em] sm:text-[32px]">
            Le même éditeur que celui des mariés — et le même contenu pour tout le monde.
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                titre: 'Les mariés',
                texte:
                  'Ils écrivent leur site : le programme, les régimes, les accès, les chiffres. C’est la source, et elle n’appartient qu’à eux.',
                lien: '/creer',
                lienTexte: 'Créer leur mini-site',
              },
              {
                titre: 'Les invités',
                texte:
                  'Ils lisent ce site en plus petit : la réponse, le programme, la cagnotte, les informations pratiques.',
                lien: '/apercu',
                lienTexte: 'Voir un mini-site',
              },
              {
                titre: 'Vous, le métier',
                texte:
                  'Votre page reprend la même source et n’y ajoute que votre part : fiche mission, accès, régimes, créneaux — et vos cachets si vous êtes intermittent.',
                lien: '#editeur',
                lienTexte: 'Revenir à l’éditeur',
              },
            ].map((carte) => (
              <div key={carte.titre} className="rounded-[24px] border border-black/8 bg-[#FBFAF8] p-6">
                <div className="flex items-center gap-2">
                  <BadgeCheck size={15} className="text-black/40" />
                  <span className="text-[13.5px] font-semibold">{carte.titre}</span>
                </div>
                <p className="mt-2.5 text-[12.5px] leading-relaxed text-black/60">{carte.texte}</p>
                <a
                  href={carte.lien}
                  className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-black/70 no-underline transition hover:text-black"
                >
                  {carte.lienTexte} <ArrowRight size={12} />
                </a>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-[24px] bg-[#0B0C12] px-6 py-5 text-white">
            <div className="flex items-center gap-2.5">
              <Users size={16} className="text-white/60" />
              <span className="text-[13px] font-medium">
                {style.humanMissions.length} métiers attendus sur l’univers {style.name}
              </span>
            </div>
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
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-white/45">
              <Sparkles size={12} /> Un éditeur par métier
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
