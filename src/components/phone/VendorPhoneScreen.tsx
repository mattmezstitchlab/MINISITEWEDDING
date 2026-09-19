import {
  Banknote, BriefcaseBusiness, Camera, Clock, Flower2, Hammer, HeartHandshake, LayoutGrid,
  MapPin, Mic2, Music2, Palette, Sliders, Sparkles, Ticket, Truck, Users, Utensils, Wheat, Wine,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import PhoneShell, { PhoneHero, type PhoneModuleDef } from './PhoneShell';
import { PhoneModule } from './PhoneFrame';
import { usePhoneTheme } from './phoneTheme';
import type { UniverseContent } from '../../lib/universeContent';
import { euros } from '../../lib/universeContent';
import type { WeddingStyle, HumanMissionRequirement } from '../../lib/weddingStyles';
import { getScenesForStyle } from '../../lib/themeTimelineScenarios';
import { formatDateLong } from '../../lib/format';

/**
 * L'ÉCRAN PRESTATAIRE
 *
 * Le métier missionné ouvre son téléphone. Le hero ne change pas : c'est le
 * visuel de l'univers du mariage où il travaille. Ce qui change, ce sont les
 * modules — un chef lit « Ce qui passe en cuisine », un photographe « La lumière
 * et les lieux », un intermittent « Vos cachets, déclarés ».
 *
 * Sans modules fournis, l'écran garde sa version générique : fiche de mission,
 * accès, régimes, créneaux. Elle sert les aperçus (le défilé de l'accueil),
 * quand aucun métier précis n'est encore choisi.
 */

/** Un module de métier, tel que l'éditeur du prestataire l'écrit. */
export interface MetierPhoneModule {
  id: string;
  nav: string;
  eyebrow: string;
  titre: string;
  lignes: Array<{ label: string; valeur: string }>;
  note?: string;
  cachets?: boolean;
}

/** Les icônes de la nav, une par famille de module. */
const ICONES: Record<string, LucideIcon> = {
  mission: BriefcaseBusiness, reperages: Camera, deroule: Clock, livraison: Camera,
  menus: Utensils, regimes: Wheat, creneaux: Clock, pieces: Ticket, service: Clock,
  compositions: Flower2, installation: Truck, lieux: MapPin, ceremonie: HeartHandshake,
  coordination: Users, bar: Wine, plateau: Mic2, set: Music2, regie: Sliders,
  plan: LayoutGrid, matieres: Palette, technique: Hammer, montage: Hammer,
  acces: MapPin, cachets: Banknote,
};

/** Les heures comptées pour l'intermittence : ce que le module des cachets affiche. */
export interface HeuresCachets {
  declarees: number;
  seuil: number;
}

/**
 * Le corps d'un module de métier : une ligne par information, le libellé en
 * petit, la valeur en clair. Les cachets ajoutent leur compteur d'heures.
 */
function CorpsMetier({ module, heures }: { module: MetierPhoneModule; heures?: HeuresCachets }) {
  const theme = usePhoneTheme();
  const avancement = heures ? Math.min(1, heures.declarees / heures.seuil) : 0;

  return (
    <PhoneModule eyebrow={module.eyebrow}>
      <div className="text-[13px] font-bold leading-tight text-black" style={{ fontFamily: theme.heading }}>
        {module.titre}
      </div>

      <div className="mt-2 space-y-1.5">
        {module.lignes.map((ligne) => (
          <div key={ligne.label} className="border-b border-black/5 pb-1.5 last:border-none last:pb-0">
            <div className="font-mono text-[8.5px] uppercase tracking-wider text-black/40">{ligne.label}</div>
            <div className="text-[10.5px] font-medium leading-snug text-black">{ligne.valeur}</div>
          </div>
        ))}
      </div>

      {module.cachets && heures && (
        <div className="mt-2.5 rounded-[10px] bg-black/[0.03] p-2">
          <div className="flex items-baseline justify-between">
            <span className="text-[12px] font-bold text-black">{heures.declarees} h</span>
            <span className="font-mono text-[8.5px] text-black/45">sur {heures.seuil} h</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-black/8">
            <div className="h-full rounded-full" style={{ width: `${avancement * 100}%`, background: theme.accent }} />
          </div>
          <div className="mt-1 font-mono text-[8.5px] text-black/45">Heures comptées pour vos 507 heures</div>
        </div>
      )}

      {module.note && <div className="mt-2 text-[9px] leading-snug text-black/45">{module.note}</div>}
    </PhoneModule>
  );
}

export default function VendorPhoneScreen({
  style,
  content,
  mission,
  metier,
  heures,
}: {
  style: WeddingStyle;
  content: UniverseContent;
  mission?: HumanMissionRequirement;
  /** Les modules du métier : quand ils sont là, l'écran parle sa langue. */
  metier?: MetierPhoneModule[];
  /** Le compteur des intermittents, affiché dans le module des cachets. */
  heures?: HeuresCachets;
}) {
  const scenes = getScenesForStyle(style.id);
  const role = mission?.role ?? style.humanMissions[0]?.role ?? 'Prestataire';

  const modules: PhoneModuleDef[] = metier && metier.length > 0
    ? metier.map((module) => ({
        id: module.id,
        label: module.nav,
        icon: ICONES[module.id] ?? Sparkles,
        content: <CorpsMetier module={module} heures={heures} />,
      }))
    : [
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
