import { Check } from 'lucide-react';
import { styleById } from '../lib/weddingStyles';
import {
  accessLabel,
  accessRole,
  keptEvents,
  musicLabel,
  type WeddingCard,
} from '../lib/weddingCard';
import { formatDateLong, daysUntil } from '../lib/format';

/**
 * LA CARTE
 *
 * Une identité numérique unique par personne : l'accès, le rôle, la
 * disponibilité, les événements et l'empreinte musicale. Elle se remplit au fil
 * des questions et reste visible — c'est ce qui montre que l'espace se
 * construit vraiment.
 */
export default function CardPreview({ card, compact = false }: { card: WeddingCard; compact?: boolean }) {
  const style = styleById(card.styleId);
  const evenements = keptEvents(card.events);
  const prenom1 = card.partner1.trim();
  const prenom2 = card.partner2.trim();

  return (
    <div className="relative overflow-hidden rounded-[26px] border border-black/8 bg-white shadow-[0_18px_50px_-24px_rgba(11,12,18,0.35)]">
      {/* La bande visuelle de l'univers */}
      <div className={`relative w-full overflow-hidden ${compact ? 'h-24' : 'h-36'}`}>
        <img src={style.image} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/70">
              {accessLabel(card.access)}
            </div>
            <div className="vp-title mt-1 text-[19px] leading-tight text-white">
              {prenom1 || 'Vos prénoms'}
              {prenom2 ? ` & ${prenom2}` : ' & …'}
            </div>
          </div>
          {card.date && (
            <span className="shrink-0 rounded-full bg-white/95 px-2.5 py-1 font-mono text-[9.5px] font-bold text-black">
              J-{daysUntil(card.date)}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-black/40">Rôle</div>
            <div className="mt-0.5 text-[13.5px] font-bold text-[#0B0C12]">{accessRole(card.access)}</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-black/40">Disponibilité</div>
            <div className="mt-0.5 flex items-center justify-end gap-1.5 text-[13.5px] font-bold text-[#0B0C12]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Confirmée
            </div>
          </div>
        </div>

        <div className="border-t border-black/6 pt-3">
          <div className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-black/40">
            Accès aux événements
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {evenements.length === 0 && (
              <span className="text-[12px] text-black/45">Aucun temps retenu pour l’instant</span>
            )}
            {evenements.map((evenement) => (
              <span
                key={evenement.id}
                className="inline-flex items-center gap-1 rounded-full bg-black/[0.045] px-2.5 py-1 text-[11px] font-semibold text-[#0B0C12]"
              >
                <Check size={10} className="text-emerald-600" />
                {evenement.label}
                <span className="font-mono text-[10px] text-black/40">{evenement.time}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-3 border-t border-black/6 pt-3 sm:grid-cols-2">
          <div>
            <div className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-black/40">Univers</div>
            <div className="mt-0.5 text-[13px] font-semibold text-[#0B0C12]">{style.name}</div>
          </div>
          <div>
            <div className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-black/40">Empreinte musicale</div>
            <div className="mt-0.5 text-[13px] font-semibold text-[#0B0C12]">{musicLabel(card.music)}</div>
          </div>
        </div>

        {(card.date || card.venue) && (
          <div className="border-t border-black/6 pt-3 text-[12.5px] text-black/60">
            {card.date && <span className="capitalize">{formatDateLong(card.date)}</span>}
            {card.venue && <span>{card.date ? ' · ' : ''}{card.venue}</span>}
            {card.city && <span className="text-black/45">{card.venue ? `, ${card.city}` : card.city}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
