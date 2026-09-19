import { Check, Users, Gift, Utensils, MapPin, Clock } from 'lucide-react';
import PhoneShell, { PhoneHero, type PhoneModuleDef } from './PhoneShell';
import { PhoneModule } from './PhoneFrame';
import type { UniverseContent } from '../../lib/universeContent';
import { euros } from '../../lib/universeContent';
import { getDirectionArtistiqueImage, type WeddingStyle } from '../../lib/weddingStyles';
import { getScenesForStyle } from '../../lib/themeTimelineScenarios';
import { formatDateLong } from '../../lib/format';

/**
 * L'ÉCRAN DES MARIÉS
 *
 * Leur cockpit, rangé par catégories : les réponses, la cagnotte, ce qui part
 * chez le traiteur, la logistique et le prochain top du jour J.
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
  const total = content.couple.guests;
  const cagnotteProgress = Math.round((content.cagnotte.raised / content.cagnotte.goal) * 100);
  const rsvpProgress = Math.round((content.rsvp.confirmed / total) * 100);

  const modules: PhoneModuleDef[] = [
    {
      id: 'reponses',
      label: 'Réponses',
      icon: Users,
      content: (
        <PhoneModule eyebrow="Réponses reçues">
          <div className="flex items-baseline justify-between">
            <span className="text-[19px] font-bold text-black">
              {content.rsvp.confirmed}
              <span className="text-[11px] text-black/40"> / {total}</span>
            </span>
            <span className="font-mono text-[9px] text-black/45">{content.rsvp.pending} sans réponse</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/8">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${rsvpProgress}%` }} />
          </div>
          <div className="mt-2 text-[9.5px] leading-snug text-black/55">{content.rsvp.invitation}</div>
          <button
            type="button"
            className="mt-2.5 w-full rounded-full border border-black/15 py-1.5 text-[10px] font-semibold text-black hover:bg-black hover:text-white"
          >
            Relancer les {content.rsvp.pending} invités
          </button>
        </PhoneModule>
      ),
    },
    {
      id: 'cagnotte',
      label: 'Cagnotte',
      icon: Gift,
      content: (
        <PhoneModule eyebrow="Cagnotte">
          <div className="text-[10.5px] font-semibold leading-snug text-black">{content.cagnotte.purpose}</div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-black/8">
            <div
              className="h-full rounded-full"
              style={{ width: `${cagnotteProgress}%`, background: style.accent }}
            />
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-[16px] font-bold text-black">{euros(content.cagnotte.raised)}</span>
            <span className="font-mono text-[9px] text-black/45">objectif {euros(content.cagnotte.goal)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[9.5px] text-black/55">
            <span>{content.cagnotte.contributors} participants</span>
            <span>Plus gros don : {content.cagnotte.top}</span>
          </div>
        </PhoneModule>
      ),
    },
    {
      id: 'traiteur',
      label: 'Traiteur',
      icon: Utensils,
      content: (
        <>
          <PhoneModule eyebrow="À transmettre au traiteur">
            <div className="space-y-1.5">
              {content.allergens.map((a) => (
                <div key={a.label} className="flex items-center justify-between text-[10.5px]">
                  <span className="text-black/70">{a.label}</span>
                  <span className="font-semibold text-black">{a.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 rounded-[10px] bg-emerald-50 px-2 py-1.5 text-[9.5px] text-emerald-800">
              <Check size={11} className="shrink-0" />
              <span>Envoyé au traiteur le 12 du mois · accusé reçu</span>
            </div>
          </PhoneModule>
          <PhoneModule eyebrow={`Menu · ${content.menu.service}`} className="mt-2.5">
            <div className="space-y-1">
              {content.menu.items.map((item) => (
                <div key={item} className="text-[10.5px] leading-snug text-black/75">
                  {item}
                </div>
              ))}
            </div>
          </PhoneModule>
        </>
      ),
    },
    {
      id: 'logistique',
      label: 'Logistique',
      icon: MapPin,
      content: (
        <PhoneModule eyebrow="Infos pratiques · à valider">
          <div className="space-y-2.5">
            {content.infos.map((info) => (
              <div key={info.label} className="flex items-start gap-2">
                <span className="mt-[3px] flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-black/8">
                  <Check size={9} className="text-black/50" />
                </span>
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-wider text-black/40">{info.label}</div>
                  <div className="text-[10.5px] leading-snug text-black">{info.value}</div>
                </div>
              </div>
            ))}
          </div>
        </PhoneModule>
      ),
    },
    {
      id: 'jour-j',
      label: 'Jour J',
      icon: Clock,
      content: (
        <PhoneModule eyebrow="Prochain top">
          <div className="text-[12.5px] font-bold text-black">{next?.title}</div>
          <div className="mt-0.5 font-mono text-[9.5px] text-black/45">
            {next?.time} · {content.couple.countdown}
          </div>
          <div className="mt-2.5 space-y-1">
            {scenes.slice(1).map((scene) => (
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
  ];

  return (
    <PhoneShell
      accent={style.accent}
      modules={modules}
      hero={
        <PhoneHero
          image={getDirectionArtistiqueImage(style.id)}
          badge="Cockpit des mariés"
          title={content.couple.names}
          date={`${formatDateLong(content.couple.date)} · ${content.couple.countdown}`}
          venue={content.couple.venue}
        />
      }
    />
  );
}
