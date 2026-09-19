import { BriefcaseBusiness, MapPin, Wheat, Clock } from 'lucide-react';
import PhoneShell, { PhoneHero, type PhoneModuleDef } from './PhoneShell';
import { PhoneModule } from './PhoneFrame';
import type { UniverseContent } from '../../lib/universeContent';
import { euros } from '../../lib/universeContent';
import type { WeddingStyle, HumanMissionRequirement } from '../../lib/weddingStyles';
import { getScenesForStyle } from '../../lib/themeTimelineScenarios';
import { formatDateLong } from '../../lib/format';

/**
 * L'ÉCRAN PRESTATAIRE
 *
 * Le métier missionné ouvre son téléphone : sa fiche, son arrivée et son accès,
 * les régimes qu'il doit couvrir et ses créneaux. Quatre catégories, rien de
 * plus.
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
  const scenes = getScenesForStyle(style.id);
  const role = mission?.role ?? style.humanMissions[0]?.role ?? 'Prestataire';

  const modules: PhoneModuleDef[] = [
    {
      id: 'mission',
      label: 'Mission',
      icon: BriefcaseBusiness,
      content: (
        <PhoneModule eyebrow={`Fiche mission · ${style.name}`}>
          <div className="text-[13px] font-bold leading-tight text-black">{role}</div>
          <div className="mt-1.5 text-[10.5px] leading-snug text-black/70">{mission?.mission}</div>
          <div className="mt-2.5 rounded-[10px] bg-black/[0.03] px-2 py-1.5 text-[9.5px] text-black/60">
            Compétence attendue · <span className="font-semibold text-black">{mission?.essentialSkill}</span>
          </div>
          <button
            type="button"
            className="mt-2.5 w-full rounded-full bg-black py-1.5 text-[10px] font-bold text-white transition hover:bg-neutral-800"
          >
            Confirmer ma mission
          </button>
        </PhoneModule>
      ),
    },
    {
      id: 'logistique',
      label: 'Accès',
      icon: MapPin,
      content: (
        <PhoneModule eyebrow="Le jour J">
          <div className="space-y-2.5">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-black/40">Arrivée</div>
              <div className="text-[10.5px] leading-snug text-black">{content.vendor.arrival}</div>
            </div>
            <div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-black/40">Accès</div>
              <div className="text-[10.5px] leading-snug text-black">{content.vendor.access}</div>
            </div>
            <div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-black/40">Contact sur place</div>
              <div className="text-[10.5px] font-semibold leading-snug text-black">{content.vendor.contact}</div>
            </div>
          </div>
        </PhoneModule>
      ),
    },
    {
      id: 'regimes',
      label: 'Régimes',
      icon: Wheat,
      content: (
        <PhoneModule eyebrow="Régimes à couvrir">
          <div className="space-y-1.5">
            {content.allergens.map((a) => (
              <div key={a.label} className="flex items-center justify-between text-[10.5px]">
                <span className="text-black/70">{a.label}</span>
                <span className="font-semibold text-black">{a.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-[9px] leading-snug text-black/45">
            Détail nominatif disponible depuis la fiche de table.
          </div>
        </PhoneModule>
      ),
    },
    {
      id: 'creneaux',
      label: 'Créneaux',
      icon: Clock,
      content: (
        <>
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
          </PhoneModule>

          <PhoneModule eyebrow="Vos créneaux" className="mt-2.5">
            <div className="space-y-1">
              {scenes.slice(0, 3).map((scene) => (
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
        </>
      ),
    },
  ];

  return (
    <PhoneShell
      style={style}
      modules={modules}
      hero={
        <PhoneHero
          image={scenes[0]?.image ?? style.image}
          badge="Écran prestataire"
          title={role}
          date={content.couple.countdown}
          venue={content.couple.venue}
        />
      }
    />
  );
}
