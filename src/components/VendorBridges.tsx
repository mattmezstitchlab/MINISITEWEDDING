import { Link } from 'react-router-dom';
import { ArrowUpRight, Handshake } from 'lucide-react';
import type { WeddingStyle } from '../lib/weddingStyles';
import { DOMAINES, domaineDe } from '../lib/weddingVendors';
import { estIntermittent } from '../lib/vendorModules';

/**
 * LA PONT DES MÉTIERS
 *
 * Dans l'espace des mariés, la liste des métiers que leur univers attend — et
 * pour chacun, la porte de son éditeur. C'est la même page des deux côtés : les
 * mariés écrivent leur site, les prestataires le leur, et tout le monde lit le
 * même programme.
 */
export default function VendorBridges({ style }: { style: WeddingStyle }) {
  const metiers = style.humanMissions;

  return (
    <div className="mt-6 px-1">
      <div className="vp-eyebrow mb-2.5">Les métiers du mariage</div>

      {metiers.length === 0 ? (
        <Link
          to="/prestataire"
          className="flex items-center justify-between gap-2 rounded-[12px] bg-black/[0.03] px-3 py-2.5 text-[12px] font-medium text-[var(--vp-muted)] no-underline transition hover:bg-black/[0.06]"
        >
          Aucun métier attendu — voir l’annuaire
          <ArrowUpRight size={13} />
        </Link>
      ) : (
        <div className="space-y-1.5">
          {metiers.map((mission) => {
            const domaine = DOMAINES[domaineDe(mission.role)] ?? DOMAINES.polyvalent;
            return (
              <Link
                key={mission.role}
                to={`/prestataire?role=${encodeURIComponent(mission.role)}&style=${style.id}`}
                className="flex items-start justify-between gap-2 rounded-[12px] bg-black/[0.03] px-3 py-2.5 no-underline transition hover:bg-black/[0.06]"
              >
                <span>
                  <span className="block text-[12px] font-medium text-[var(--vp-ink)]">{mission.role}</span>
                  <span className="mt-0.5 block font-mono text-[9.5px] uppercase tracking-wider text-[var(--vp-muted)]">
                    {domaine.label}
                    {estIntermittent(mission.role) ? ' · cachets' : ''}
                  </span>
                </span>
                <ArrowUpRight size={13} className="mt-0.5 shrink-0 text-[var(--vp-muted)]" />
              </Link>
            );
          })}
        </div>
      )}

      <p className="vp-caption mt-2.5 flex items-start gap-1.5 !text-[11.5px] leading-relaxed">
        <Handshake size={13} className="mt-0.5 shrink-0" />
        <span>Chaque métier écrit sa page depuis son éditeur : ils lisent votre site, vous gardez la
        main.</span>
      </p>
    </div>
  );
}
