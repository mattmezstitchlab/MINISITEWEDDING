import { MailCheck, Gift, Wheat, Clock, MapPin } from 'lucide-react';
import PhoneShell, { PhoneHero, type PhoneModuleDef } from './PhoneShell';
import { PhoneModule } from './PhoneFrame';
import type { UniverseContent } from '../../lib/universeContent';
import { euros } from '../../lib/universeContent';
import type { WeddingStyle } from '../../lib/weddingStyles';
import { getScenesForStyle } from '../../lib/themeTimelineScenarios';
import { formatDateLong } from '../../lib/format';

/**
 * L'ÉCRAN INVITÉ
 *
 * Ce que voient les invités depuis leur téléphone : le hero de l'univers qui
 * les accueille, puis cinq catégories — répondre, la cagnotte, leur régime,
 * le programme et les informations pratiques.
 */

export default function GuestPhoneScreen({
  style,
  content,
}: {
  style: WeddingStyle;
  content: UniverseContent;
}) {
  const scenes = getScenesForStyle(style.id);
  const progress = Math.round((content.cagnotte.raised / content.cagnotte.goal) * 100);

  const modules: PhoneModuleDef[] = [
    {
      id: 'rsvp',
      label: 'Répondre',
      icon: MailCheck,
      content: (
        <PhoneModule eyebrow="Réponse">
          <div className="text-[11.5px] font-bold leading-snug text-black">{content.rsvp.invitation}</div>
          <div className="mt-1 text-[9.5px] text-black/50">
            {content.rsvp.confirmed} présents · {content.couple.guests} invités
          </div>
          <div className="mt-2.5 grid grid-cols-2 gap-1.5">
            <button type="button" className="rounded-full bg-black py-1.5 text-[10px] font-bold text-white">
              Je viens
            </button>
            <button
              type="button"
              className="rounded-full border border-black/15 py-1.5 text-[10px] font-semibold text-black/70"
            >
              Je ne peux pas
            </button>
          </div>
        </PhoneModule>
      ),
    },
    {
      id: 'cagnotte',
      label: 'Cagnotte',
      icon: Gift,
      content: (
        <PhoneModule eyebrow="Cagnotte des invités">
          <div className="text-[11.5px] font-bold leading-snug text-black">{content.cagnotte.purpose}</div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-black/8">
            <div className="h-full rounded-full" style={{ width: `${progress}%`, background: style.accent }} />
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-[14px] font-bold text-black">{euros(content.cagnotte.raised)}</span>
            <span className="font-mono text-[9px] text-black/45">
              sur {euros(content.cagnotte.goal)} · {content.cagnotte.contributors} participants
            </span>
          </div>
          <div className="mt-2 rounded-[10px] bg-black/[0.03] px-2 py-1.5 text-[9.5px] text-black/60">
            Plus gros don : {content.cagnotte.top}
          </div>
          <button
            type="button"
            className="mt-2.5 w-full rounded-full border border-black/15 py-1.5 text-[10px] font-semibold text-black hover:bg-black hover:text-white"
          >
            Participer à la cagnotte
          </button>
        </PhoneModule>
      ),
    },
    {
      id: 'regimes',
      label: 'Régimes',
      icon: Wheat,
      content: (
        <PhoneModule eyebrow="Allergènes & régimes">
          <div className="space-y-1.5">
            {content.allergens.map((a) => (
              <div key={a.label} className="flex items-center justify-between text-[10.5px]">
                <span className="text-black/70">{a.label}</span>
                <span className="font-semibold text-black">{a.value}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-2.5 w-full rounded-full border border-black/15 py-1.5 text-[10px] font-semibold text-black hover:bg-black hover:text-white"
          >
            Déclarer mon régime
          </button>
        </PhoneModule>
      ),
    },
    {
      id: 'programme',
      label: 'Programme',
      icon: Clock,
      content: (
        <PhoneModule eyebrow="Programme du jour J">
          <div className="space-y-1">
            {scenes.map((scene) => (
              <div
                key={scene.time}
                className="flex items-center justify-between border-b border-black/5 py-1.5 last:border-none"
              >
                <span className="font-mono text-[9.5px] text-black/45">{scene.time}</span>
                <span className="ml-2 truncate text-[10.5px] font-medium text-black">{scene.title}</span>
              </div>
            ))}
          </div>
        </PhoneModule>
      ),
    },
    {
      id: 'infos',
      label: 'Infos',
      icon: MapPin,
      content: (
        <PhoneModule eyebrow="Infos pratiques">
          <div className="space-y-2">
            {content.infos.map((info) => (
              <div key={info.label}>
                <div className="font-mono text-[9px] uppercase tracking-wider text-black/40">{info.label}</div>
                <div className="text-[10.5px] leading-snug text-black">{info.value}</div>
              </div>
            ))}
            <div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-black/40">Tenue</div>
              <div className="text-[10.5px] leading-snug text-black">{content.couple.dressCode}</div>
            </div>
          </div>
        </PhoneModule>
      ),
    },
  ];

  return (
    <PhoneShell
      accent={style.accent}
      modules={modules}
      hero={
        <PhoneHero
          image={style.image}
          badge="Invitation privée"
          title={content.couple.names}
          date={formatDateLong(content.couple.date)}
          venue={content.couple.venue}
        />
      }
    />
  );
}
