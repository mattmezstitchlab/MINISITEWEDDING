import { PhoneModule } from './PhoneFrame';
import type { UniverseContent } from '../../lib/universeContent';
import { euros } from '../../lib/universeContent';
import type { WeddingStyle, HumanMissionRequirement } from '../../lib/weddingStyles';
import { getScenesForStyle } from '../../lib/themeTimelineScenarios';
import { formatDateLong } from '../../lib/format';

/**
 * L'ÉCRAN PRESTATAIRE
 *
 * Ce que reçoit un métier missionné : sa fiche, l'heure et l'accès pour
 * s'installer, les régimes alimentaires qu'il doit couvrir, et le cadre du
 * jour — sans avoir à appeler personne.
 */

export default function VendorPhoneScreen({
  style,
  content,
  mission,
}: {
  style: WeddingStyle;
  content: UniverseContent;
  mission?: HumanMissionRequirement;
}) {
  const scenes = getScenesForStyle(style.id).slice(0, 2);
  const role = mission?.role ?? style.humanMissions[0]?.role ?? 'Prestataire';

  return (
    <div className="no-scrollbar h-full w-full overflow-y-auto bg-[#FAFAFC] pb-8 text-left">
      <div className="space-y-2.5 p-3.5 pt-10">
        {/* La mission */}
        <div className="rounded-[14px] border border-black/6 bg-black p-3 text-white shadow-sm">
          <div className="font-mono text-[8.5px] uppercase tracking-wider text-white/50">
            Fiche mission · {style.name}
          </div>
          <div className="mt-1 text-[13px] font-bold leading-tight">{role}</div>
          <div className="mt-1 text-[10px] leading-snug text-white/70">{mission?.mission}</div>
          <div className="mt-2 rounded-[10px] bg-white/10 px-2 py-1.5 text-[9.5px] text-white/85">
            Compétence attendue · {mission?.essentialSkill}
          </div>
        </div>

        {/* Le jour J, côté logistique */}
        <PhoneModule eyebrow="Le jour J">
          <div className="space-y-2">
            <div>
              <div className="text-[9px] font-mono uppercase tracking-wider text-black/40">Arrivée</div>
              <div className="text-[10.5px] leading-snug text-black">{content.vendor.arrival}</div>
            </div>
            <div>
              <div className="text-[9px] font-mono uppercase tracking-wider text-black/40">Accès</div>
              <div className="text-[10.5px] leading-snug text-black">{content.vendor.access}</div>
            </div>
            <div>
              <div className="text-[9px] font-mono uppercase tracking-wider text-black/40">Contact sur place</div>
              <div className="text-[10.5px] font-semibold leading-snug text-black">{content.vendor.contact}</div>
            </div>
          </div>
        </PhoneModule>

        {/* Les régimes à couvrir */}
        <PhoneModule eyebrow="Régimes à couvrir">
          <div className="space-y-1">
            {content.allergens.map((a) => (
              <div key={a.label} className="flex items-center justify-between text-[10.5px]">
                <span className="text-black/70">{a.label}</span>
                <span className="font-semibold text-black">{a.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-1.5 text-[9px] text-black/45">
            Détail nominatif disponible depuis la fiche de table.
          </div>
        </PhoneModule>

        {/* Le cadre du jour */}
        <PhoneModule eyebrow="Le mariage en chiffres">
          <div className="grid grid-cols-2 gap-1.5">
            <div className="rounded-[10px] bg-black/[0.03] p-2 text-center">
              <div className="text-[14px] font-bold text-black">{content.couple.guests}</div>
              <div className="font-mono text-[8px] uppercase text-black/45">Couverts</div>
            </div>
            <div className="rounded-[10px] bg-black/[0.03] p-2 text-center">
              <div className="text-[14px] font-bold text-black">{content.rsvp.confirmed}</div>
              <div className="font-mono text-[8px] uppercase text-black/45">Confirmés</div>
            </div>
            <div className="rounded-[10px] bg-black/[0.03] p-2 text-center">
              <div className="text-[14px] font-bold text-black">{euros(content.cagnotte.raised)}</div>
              <div className="font-mono text-[8px] uppercase text-black/45">Cagnotte</div>
            </div>
            <div className="rounded-[10px] bg-black/[0.03] p-2 text-center">
              <div className="text-[11px] font-bold leading-tight text-black">{content.couple.countdown}</div>
              <div className="font-mono text-[8px] uppercase text-black/45">
                {formatDateLong(content.couple.date)}
              </div>
            </div>
          </div>
          <div className="mt-1.5 text-[9px] leading-snug text-black/50">{content.cagnotte.purpose}</div>
        </PhoneModule>

        {/* Le déroulé */}
        <PhoneModule eyebrow="Vos créneaux">
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

        <button
          type="button"
          className="w-full rounded-full bg-black py-2 text-[10.5px] font-bold text-white shadow-sm"
        >
          Confirmer ma mission
        </button>
      </div>
    </div>
  );
}
