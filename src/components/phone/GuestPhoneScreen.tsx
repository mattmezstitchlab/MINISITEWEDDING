import type { ReactNode } from 'react';
import { MailCheck, Gift, Wheat, Clock, MapPin, CalendarCheck, PartyPopper, Shirt } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import PhoneShell, { PhoneHero, PhoneHeroActions, PhoneHeroButton, type PhoneModuleDef } from './PhoneShell';
import { usePhoneTheme } from './phoneTheme';
import { PhoneModule } from './PhoneFrame';
import type { UniverseContent } from '../../lib/universeContent';
import { euros } from '../../lib/universeContent';
import type { WeddingStyle } from '../../lib/weddingStyles';
import { getScenesForStyle } from '../../lib/themeTimelineScenarios';
import { formatDateLong } from '../../lib/format';

/**
 * L'ÉCRAN INVITÉ
 *
 * Le mini-site dans la poche d'un invité : le hero de l'univers, puis les cinq
 * écrans qui comptent — répondre, le programme, la cagnotte, son régime, les
 * informations pratiques. Même grammaire que le site : cartes au matériau du
 * thème, heure dans la couleur d'accent, titre dans la typographie de l'univers,
 * et pas une seule couleur qui ne vienne du thème.
 */

export default function GuestPhoneScreen({ style, content }: { style: WeddingStyle; content: UniverseContent }) {
  const scenes = getScenesForStyle(style.id);

  const modules: PhoneModuleDef[] = [
    {
      id: 'rsvp',
      label: 'Répondre',
      icon: MailCheck,
      content: (
        <PhoneModule eyebrow="Réponse à l’invitation">
          <p className="text-[11px] leading-snug text-black/70">{content.rsvp.invitation}</p>
          <div className="mt-2 flex items-center gap-2 text-[9.5px] text-black/45">
            <span>{content.rsvp.confirmed} présents</span>
            <span className="h-1 w-1 rounded-full bg-black/20" />
            <span>{content.rsvp.pending} en attente</span>
            <span className="h-1 w-1 rounded-full bg-black/20" />
            <span>{content.couple.guests} invités</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <Bouton primaire icone={CalendarCheck}>Je viens</Bouton>
            <Bouton icone={PartyPopper}>Je ne peux pas</Bouton>
          </div>
          <Note>Votre réponse prévient les mariés et met à jour le plan de table.</Note>
        </PhoneModule>
      ),
    },
    {
      id: 'programme',
      label: 'Programme',
      icon: Clock,
      content: (
        <div className="space-y-2">
          <SousTitre>Programme du jour J</SousTitre>
          {scenes.map((scene) => (
            <PhoneModule key={scene.time} className="p-2.5">
              <div className="flex items-baseline justify-between gap-2">
                <Heure>{scene.time}</Heure>
                <MapPin size={11} className="shrink-0 text-black/25" />
              </div>
              <Titre>{scene.title}</Titre>
              {scene.narrativeScript && (
                <p className="mt-1 line-clamp-3 text-[10px] leading-snug text-black/55">{scene.narrativeScript}</p>
              )}
            </PhoneModule>
          ))}
        </div>
      ),
    },
    {
      id: 'cagnotte',
      label: 'Cagnotte',
      icon: Gift,
      content: (
        <PhoneModule eyebrow="Cagnotte des invités">
          <Titre>{content.cagnotte.purpose}</Titre>
          <Barre valeur={content.cagnotte.raised} objectif={content.cagnotte.goal} />
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-[13px] font-bold text-black">{euros(content.cagnotte.raised)}</span>
            <span className="font-mono text-[9px] text-black/45">
              sur {euros(content.cagnotte.goal)} · {content.cagnotte.contributors} participants
            </span>
          </div>
          <Note>Plus gros don : {content.cagnotte.top}</Note>
          <div className="mt-3">
            <Bouton primaire>Participer à la cagnotte</Bouton>
          </div>
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
              <Rangee key={a.label} label={a.label} value={a.value} />
            ))}
          </div>
          <div className="mt-3">
            <Bouton>Déclarer mon régime</Bouton>
          </div>
          <Note>Transmis au traiteur du mariage. Jamais public.</Note>
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
                <div className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-black/40">{info.label}</div>
                <div className="text-[10.5px] leading-snug text-black">{info.value}</div>
              </div>
            ))}
            <div>
              <div className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-black/40">Tenue</div>
              <div className="flex items-center gap-1.5 text-[10.5px] leading-snug text-black">
                <Shirt size={11} className="shrink-0 text-black/30" />
                {content.couple.dressCode}
              </div>
            </div>
          </div>
        </PhoneModule>
      ),
    },
  ];

  return (
    <PhoneShell
      style={style}
      modules={modules}
      hero={
        <PhoneHero
          image={style.image}
          badge="Invitation privée"
          kicker="Nous nous marions"
          title={content.couple.names}
          date={formatDateLong(content.couple.date)}
          venue={`${content.couple.venue} · ${content.couple.city}`}
        >
          <PhoneHeroActions>
            <PhoneHeroButton primary>Répondre à l’invitation</PhoneHeroButton>
            <PhoneHeroButton>Programme</PhoneHeroButton>
          </PhoneHeroActions>
          <div className="mt-2 font-mono text-[8.5px] uppercase tracking-[0.16em] text-white/70">
            {content.couple.countdown} · {content.couple.season}
          </div>
        </PhoneHero>
      }
    />
  );
}

/* -------------------------------------------------------- les mêmes briques */

/** Le titre des modules : la typographie de l'univers, jamais une autre. */
function Titre({ children }: { children: ReactNode }) {
  const theme = usePhoneTheme();
  return (
    <div
      className="mt-1 text-[13px] leading-tight text-black"
      style={{ fontFamily: theme.heading, fontWeight: theme.weight, letterSpacing: '-0.02em' }}
    >
      {children}
    </div>
  );
}

function SousTitre({ children }: { children: string }) {
  return (
    <div className="flex justify-center pb-0.5">
      <span className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-black/60 backdrop-blur-sm">
        {children}
      </span>
    </div>
  );
}

function Bouton({
  children,
  primaire = false,
  icone: Icone,
}: {
  children: ReactNode;
  primaire?: boolean;
  icone?: LucideIcon;
}) {
  const theme = usePhoneTheme();
  return (
    <button
      type="button"
      className="inline-flex flex-1 items-center justify-center gap-1.5 px-3 py-2 text-[10.5px] font-semibold transition"
      style={
        primaire
          ? {
              background: theme.accent,
              color: '#fff',
              borderRadius: theme.btnR,
              boxShadow: `0 12px 26px -16px ${theme.accent}`,
            }
          : {
              border: '1px solid rgba(12,14,24,0.14)',
              background: 'rgba(255,255,255,0.7)',
              color: '#0B0C12',
              borderRadius: theme.btnR,
            }
      }
    >
      {Icone && <Icone size={12} />}
      {children}
    </button>
  );
}

function Heure({ children }: { children: string }) {
  const theme = usePhoneTheme();
  return (
    <span className="font-mono text-[9.5px] font-semibold tracking-[0.14em]" style={{ color: theme.accent }}>
      {children}
    </span>
  );
}

function Note({ children }: { children: ReactNode }) {
  return <p className="mt-2 text-[9px] leading-snug text-black/40">{children}</p>;
}

function Rangee({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[10.5px]">
      <span className="text-black/60">{label}</span>
      <span className="font-semibold text-black">{value}</span>
    </div>
  );
}

function Barre({ valeur, objectif }: { valeur: number; objectif: number }) {
  const theme = usePhoneTheme();
  const pct = objectif > 0 ? Math.min(100, Math.round((valeur / objectif) * 100)) : 0;
  return (
    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/8">
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: theme.accent }} />
    </div>
  );
}
