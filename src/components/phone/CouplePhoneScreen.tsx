import { Check } from 'lucide-react';
import { PhoneModule } from './PhoneFrame';
import type { UniverseContent } from '../../lib/universeContent';
import { euros } from '../../lib/universeContent';
import type { WeddingStyle } from '../../lib/weddingStyles';
import { getScenesForStyle } from '../../lib/themeTimelineScenarios';
import { formatDateLong } from '../../lib/format';

/**
 * L'ÉCRAN DES MARIÉS
 *
 * Leur cockpit : où en sont les réponses, où en est la cagnotte, quels régimes
 * remonter au traiteur, et ce qu'il reste à vérifier côté logistique.
 */

export default function CouplePhoneScreen({
  style,
  content,
}: {
  style: WeddingStyle;
  content: UniverseContent;
}) {
  const scenes = getScenesForStyle(style.id);
  const next = scenes[0];
  const answered = content.rsvp.confirmed;
  const total = content.couple.guests;
  const cagnotteProgress = Math.round((content.cagnotte.raised / content.cagnotte.goal) * 100);
  const rsvpProgress = Math.round((answered / total) * 100);

  return (
    <div className="no-scrollbar h-full w-full overflow-y-auto bg-[#FAFAFC] pb-8 text-left">
      <div className="space-y-2.5 p-3.5 pt-10">
        {/* En-tête du cockpit */}
        <div className="flex items-start justify-between border-b border-black/5 pb-2.5">
          <div>
            <div className="font-mono text-[8.5px] uppercase tracking-wider text-black/40">
              Cockpit · {style.name}
            </div>
            <div className="text-[14px] font-bold leading-tight text-black">{content.couple.names}</div>
            <div className="mt-0.5 font-mono text-[9px] text-black/45">
              {formatDateLong(content.couple.date)} · {content.couple.countdown}
            </div>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 font-mono text-[8px] font-bold text-emerald-800">
            En direct
          </span>
        </div>

        {/* Les réponses */}
        <PhoneModule eyebrow="Réponses reçues">
          <div className="flex items-baseline justify-between">
            <span className="text-[17px] font-bold text-black">
              {answered}
              <span className="text-[11px] text-black/40"> / {total}</span>
            </span>
            <span className="font-mono text-[9px] text-black/45">{content.rsvp.pending} sans réponse</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-black/8">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${rsvpProgress}%` }} />
          </div>
          <div className="mt-1.5 text-[9.5px] text-black/50">{content.rsvp.invitation}</div>
        </PhoneModule>

        {/* La cagnotte */}
        <PhoneModule eyebrow="Cagnotte">
          <div className="text-[10.5px] font-semibold leading-snug text-black">{content.cagnotte.purpose}</div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/8">
            <div
              className="h-full rounded-full"
              style={{ width: `${cagnotteProgress}%`, background: style.accent }}
            />
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-[15px] font-bold text-black">{euros(content.cagnotte.raised)}</span>
            <span className="font-mono text-[9px] text-black/45">
              objectif {euros(content.cagnotte.goal)}
            </span>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[9.5px] text-black/55">
            <span>{content.cagnotte.contributors} participants</span>
            <span>Plus gros don : {content.cagnotte.top}</span>
          </div>
        </PhoneModule>

        {/* Les régimes à transmettre */}
        <PhoneModule eyebrow="À transmettre au traiteur">
          <div className="space-y-1">
            {content.allergens.map((a) => (
              <div key={a.label} className="flex items-center justify-between text-[10.5px]">
                <span className="text-black/70">{a.label}</span>
                <span className="font-semibold text-black">{a.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-1.5 rounded-[10px] bg-emerald-50 px-2 py-1.5 text-[9.5px] text-emerald-800">
            <Check size={11} className="shrink-0" />
            <span>Envoyé au traiteur le 12 du mois · accusé reçu</span>
          </div>
        </PhoneModule>

        {/* Le menu */}
        <PhoneModule eyebrow={`Menu · ${content.menu.service}`}>
          <div className="space-y-1">
            {content.menu.items.map((item) => (
              <div key={item} className="text-[10.5px] leading-snug text-black/75">
                {item}
              </div>
            ))}
          </div>
        </PhoneModule>

        {/* Prochaine étape du jour J */}
        <PhoneModule eyebrow="Prochain top">
          <div className="text-[12px] font-bold text-black">{next?.title}</div>
          <div className="mt-0.5 font-mono text-[9.5px] text-black/45">{next?.time}</div>
        </PhoneModule>

        {/* Ce qui reste à vérifier */}
        <PhoneModule eyebrow="Infos pratiques · à valider">
          <div className="space-y-2">
            {content.infos.map((info) => (
              <div key={info.label} className="flex items-start gap-1.5">
                <span className="mt-[3px] flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-black/8">
                  <Check size={9} className="text-black/50" />
                </span>
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-black/40">{info.label}</div>
                  <div className="text-[10.5px] leading-snug text-black">{info.value}</div>
                </div>
              </div>
            ))}
          </div>
        </PhoneModule>
      </div>
    </div>
  );
}
