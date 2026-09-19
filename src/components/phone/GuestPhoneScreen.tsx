import { PhoneModule } from './PhoneFrame';
import type { UniverseContent } from '../../lib/universeContent';
import { euros } from '../../lib/universeContent';
import type { WeddingStyle } from '../../lib/weddingStyles';
import { getScenesForStyle } from '../../lib/themeTimelineScenarios';
import { formatDateLong } from '../../lib/format';

/**
 * L'ÉCRAN INVITÉ
 *
 * Ce que voient les invités depuis leur propre téléphone : l'invitation, le
 * oui ou non, la cagnotte à laquelle ils participent, leur régime alimentaire,
 * et tout ce qu'il faut savoir pour arriver à l'heure.
 */

export default function GuestPhoneScreen({
  style,
  content,
}: {
  style: WeddingStyle;
  content: UniverseContent;
}) {
  const scenes = getScenesForStyle(style.id).slice(0, 3);
  const progress = Math.round((content.cagnotte.raised / content.cagnotte.goal) * 100);

  return (
    <div className="no-scrollbar h-full w-full overflow-y-auto pb-8 text-left">
      {/* Le visuel de l'univers */}
      <div className="relative h-[196px] w-full shrink-0 overflow-hidden">
        <img src={style.image} alt={style.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
          <span
            className="rounded-full px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider text-black"
            style={{ background: '#fff' }}
          >
            Invitation privée
          </span>
          <div className="vp-title mt-1 text-[19px] leading-tight">{content.couple.names}</div>
          <div className="mt-0.5 font-mono text-[9.5px] text-white/80">
            {formatDateLong(content.couple.date)} · {content.couple.venue}
          </div>
        </div>
      </div>

      <div className="space-y-2.5 bg-[#FAFAFC] p-3.5">
        {/* RSVP */}
        <PhoneModule eyebrow="RSVP">
          <div className="text-[11px] font-bold text-black">{content.rsvp.invitation}</div>
          <div className="mt-1 text-[9.5px] text-black/50">
            {content.rsvp.confirmed} présents · {content.couple.guests} invités
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <button type="button" className="rounded-full bg-black py-1.5 text-[10px] font-bold text-white">
              Je viens
            </button>
            <button type="button" className="rounded-full border border-black/15 py-1.5 text-[10px] font-semibold text-black/70">
              Je ne peux pas
            </button>
          </div>
        </PhoneModule>

        {/* Cagnotte */}
        <PhoneModule eyebrow="Cagnotte des invités">
          <div className="text-[11px] font-bold leading-snug text-black">{content.cagnotte.purpose}</div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/8">
            <div
              className="h-full rounded-full"
              style={{ width: `${progress}%`, background: style.accent }}
            />
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-[13px] font-bold text-black">{euros(content.cagnotte.raised)}</span>
            <span className="font-mono text-[9px] text-black/45">
              sur {euros(content.cagnotte.goal)} · {content.cagnotte.contributors} participants
            </span>
          </div>
          <button
            type="button"
            className="mt-2 w-full rounded-full border border-black/15 py-1.5 text-[10px] font-semibold text-black hover:bg-black hover:text-white"
          >
            Participer à la cagnotte
          </button>
        </PhoneModule>

        {/* Allergènes et régimes */}
        <PhoneModule eyebrow="Allergènes & régimes">
          <div className="space-y-1">
            {content.allergens.map((a) => (
              <div key={a.label} className="flex items-center justify-between text-[10.5px]">
                <span className="text-black/70">{a.label}</span>
                <span className="font-semibold text-black">{a.value}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-2 w-full rounded-full border border-black/15 py-1.5 text-[10px] font-semibold text-black hover:bg-black hover:text-white"
          >
            Déclarer mon régime
          </button>
        </PhoneModule>

        {/* Programme */}
        <PhoneModule eyebrow="Programme du jour J">
          <div className="space-y-1">
            {scenes.map((scene) => (
              <div
                key={scene.time}
                className="flex items-center justify-between border-b border-black/5 py-1 last:border-none"
              >
                <span className="font-mono text-[9.5px] text-black/45">{scene.time}</span>
                <span className="ml-2 truncate text-[10.5px] font-medium text-black">{scene.title}</span>
              </div>
            ))}
          </div>
        </PhoneModule>

        {/* Infos pratiques */}
        <PhoneModule eyebrow="Infos pratiques">
          <div className="space-y-2">
            {content.infos.map((info) => (
              <div key={info.label}>
                <div className="text-[9px] font-mono uppercase tracking-wider text-black/40">{info.label}</div>
                <div className="text-[10.5px] leading-snug text-black">{info.value}</div>
              </div>
            ))}
            <div>
              <div className="text-[9px] font-mono uppercase tracking-wider text-black/40">Tenue</div>
              <div className="text-[10.5px] leading-snug text-black">{content.couple.dressCode}</div>
            </div>
          </div>
        </PhoneModule>
      </div>
    </div>
  );
}
