import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  BadgeEuro,
  Briefcase,
  Car,
  Clock,
  FileText,
  Link2,
  Lock,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { styleById } from '../lib/weddingStyles';
import { daysUntil, formatDateLong } from '../lib/format';
import {
  accessLabel,
  cardKind,
  cardKindLabel,
  cardName,
  cardRoleLabel,
  cardSections,
  keptEvents,
  maskIban,
  musicLabel,
  visibilityLabel,
  type CardData,
  type CardSectionId,
} from '../lib/weddingCard';

/**
 * LA CARTE, RECTANGLE VIVANT
 *
 * Deux faces, un seul objet : le recto dit qui l'on est, le verso porte le
 * détail — et le détail change selon le rôle (`cardSections`). La carte se
 * retourne d'un clic, au clavier, et elle garde exactement la même hauteur
 * dans les deux sens : retourner une carte ne doit jamais faire sauter la page.
 */

interface WeddingCardProps {
  card: CardData;
  /** La version de la colonne latérale de l'onboarding. */
  compact?: boolean;
  /** Ouvre sur le verso quand on sait ce que l'on vient voir. */
  startFlipped?: boolean;
  /**
   * Ce que le serveur a masqué pour ce lecteur. La carte le dit — « réservé
   * aux participants » — au lieu d'afficher « à compléter », qui serait faux.
   */
  redacted?: { contacts: boolean; prive: boolean };
  className?: string;
}

const FACE = 'absolute inset-0 overflow-hidden rounded-[26px] backface-hidden';
/** La face cachée ne doit jamais réapparaître pendant la rotation. */
const CACHE: React.CSSProperties = { backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' };

/** Une ligne du verso : sur fond noir, la même information, plus dense. */
function LigneSombre({ icon: Icon, label, value, accent }: { icon: LucideIcon; label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon size={13} className="mt-0.5 shrink-0 text-white/35" />
      <div className="min-w-0">
        <div className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-white/45">{label}</div>
        <div className="mt-0.5 text-[12.5px] font-semibold" style={accent ? { color: 'var(--carte-accent)' } : undefined}>
          {value || <span className="font-normal text-white/25">À compléter</span>}
        </div>
      </div>
    </div>
  );
}

function Bloc({ id, label, children, premier }: { id: CardSectionId; label: string; children: React.ReactNode; premier?: boolean }) {
  return (
    <section data-section={id} className={`pb-3.5 ${premier ? '' : 'border-t border-white/10 pt-3.5'}`}>
      <h3 className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/45">{label}</h3>
      <div className="mt-2 space-y-2.5">{children}</div>
    </section>
  );
}

function Pastille({ children, actif = true }: { children: React.ReactNode; actif?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        actif ? 'bg-white/10 text-white' : 'bg-white/[0.04] text-white/45'
      }`}
    >
      {children}
    </span>
  );
}

export default function WeddingCard({
  card,
  compact = false,
  startFlipped = false,
  redacted,
  className = '',
}: WeddingCardProps) {
  const [flipped, setFlipped] = useState(startFlipped);
  const reduire = useReducedMotion();
  const style = styleById(card.styleId);
  const kind = cardKind(card);
  const nom = cardName(card);
  const sections = cardSections(card);
  const temps = keptEvents(card.events);
  const lieu = [card.venue.trim(), card.city.trim()].filter(Boolean).join(', ');
  const retourner = () => setFlipped((v) => !v);

  return (
    <div className={className}>
      <div
        className={`relative w-full ${compact ? 'h-[470px]' : 'h-[580px]'}`}
        style={{ perspective: '1500px', '--carte-accent': style.accent } as React.CSSProperties}
      >
        <motion.div
          role="button"
          tabIndex={0}
          aria-label={flipped ? 'Voir le recto de la carte' : 'Voir le verso de la carte'}
          onClick={retourner}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              retourner();
            }
          }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={reduire ? { duration: 0 } : { duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
          className="absolute inset-0 cursor-pointer rounded-[26px] outline-none focus-visible:ring-2 focus-visible:ring-[#0B0C12]/40"
        >
          {/* ————————————————————————— LE RECTO ————————————————————————— */}
          {/* Le visuel plein cadre et rien d'autre : le nom, le rôle, la
              personne. Les détails vivent au verso — c'est lui qu'on retourne. */}
          <div
            aria-hidden={flipped}
            style={CACHE}
            className={`${FACE} bg-[#0B0C12] shadow-[0_24px_60px_-30px_rgba(11,12,18,0.45)] ring-1 ring-black/8`}
          >
            {/* LE GRAND VISUEL : la personne plein cadre, l'identité par-dessus —
                la même grammaire que les cartes de prestataires du site. */}
            <div className="relative h-full w-full overflow-hidden">
              <img
                src={card.photo || style.image}
                alt=""
                className="vp-live-frame h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/25 to-black/25" />

              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3.5">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/75">Carte VOWS</span>
                {card.date && (
                  <span className="rounded-full bg-white/95 px-2.5 py-1 font-mono text-[9.5px] font-bold text-black">
                    J-{daysUntil(card.date)}
                  </span>
                )}
              </div>

              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 font-mono text-[8.5px] font-bold uppercase tracking-[0.14em] text-black">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: style.accent }} />
                  {cardKindLabel(card)}
                </span>

                <div className={`mt-3 vp-title leading-[1.02] drop-shadow-[0_6px_24px_rgba(0,0,0,0.45)] ${compact ? 'text-[27px]' : 'text-[34px]'}`}>
                  {nom || <span className="text-white/60">Votre nom</span>}
                </div>

                <div className="mt-2 text-[15px] font-semibold" style={{ color: style.accent }}>
                  {cardRoleLabel(card)}
                </div>

                {/* Une seule ligne, et c'est tout : la date et le lieu du mariage. */}
                <div className="mt-3 flex items-center gap-2 text-[12px] text-white/70">
                  <span className="truncate">
                    {card.date ? formatDateLong(card.date) : 'Votre date'}
                  </span>
                  <span className="h-1 w-1 shrink-0 rounded-full bg-white/40" />
                  <span className="truncate">{lieu || card.homeCity.trim() || 'Votre ville'}</span>
                </div>
              </div>

              {/* Le seul repère du recto : la carte se retourne. */}
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/70">Carte VOWS</span>
                <span className="flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-white/85 backdrop-blur-sm">
                  <RotateCcw size={11} /> Verso
                </span>
              </div>
            </div>
          </div>

          {/* ————————————————————————— LE VERSO ————————————————————————— */}
          <div
            aria-hidden={!flipped}
            className={`${FACE} flex flex-col bg-[#0B0C12] text-white shadow-[0_24px_60px_-30px_rgba(11,12,18,0.55)] ring-1 ring-white/10`}
            style={{ ...CACHE, transform: 'rotateY(180deg)' }}
          >
            <div className="flex shrink-0 items-center justify-between px-4 pb-3 pt-4">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/50">
                Verso · {cardKindLabel(card)}
              </span>
              <Lock size={12} className="text-white/35" />
            </div>

            <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-2">
              {sections.map((section, i) => (
                <Bloc key={section.id} id={section.id} label={section.label} premier={i === 0}>
                  {section.id === 'place' && (
                    <>
                      <div className="text-[15px] font-semibold text-white">{nom || 'Votre nom'}</div>
                      <div className="text-[12.5px] text-white/60">
                        {cardRoleLabel(card)} · {accessLabel(card.access)}
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {temps.length === 0 && <span className="text-[11.5px] text-white/35">Aucun temps retenu</span>}
                        {temps.map((t) => (
                          <Pastille key={t.id}>
                            {t.label}
                            <span className="font-mono text-[10px] text-white/50">{t.time}</span>
                          </Pastille>
                        ))}
                      </div>
                    </>
                  )}

                  {section.id === 'contact' &&
                    (redacted?.contacts ? (
                      <p className="flex items-start gap-2 text-[11.5px] leading-snug text-white/45">
                        <Lock size={12} className="mt-0.5 shrink-0" />
                        Coordonnées réservées — visibles par : {visibilityLabel(card.contactVisibility).toLowerCase()}.
                      </p>
                    ) : (
                      <>
                        <LigneSombre icon={Mail} label="E-mail" value={card.email} />
                        <LigneSombre icon={Phone} label="Téléphone" value={card.phone} />
                        <LigneSombre
                          icon={Link2}
                          label="Site & réseaux"
                          value={[card.website, card.social].filter(Boolean).join(' · ')}
                        />
                        <p className="pt-0.5 text-[10.5px] text-white/40">
                          Visible par : {visibilityLabel(card.contactVisibility).toLowerCase()}
                        </p>
                      </>
                    ))}

                  {section.id === 'dispo' && (
                    <>
                      <LigneSombre
                        icon={Clock}
                        label={kind === 'prestataire' ? 'Créneaux' : 'Disponible'}
                        value={card.from && card.to ? `${card.from} → ${card.to}` : ''}
                        accent
                      />
                      <LigneSombre icon={Car} label="Temps de déplacement" value={card.travel ? `${card.travel} min` : ''} />
                      {card.blackout && <p className="text-[11.5px] leading-snug text-white/45">{card.blackout}</p>}
                    </>
                  )}

                  {section.id === 'repas' && (
                    <>
                      <div className="flex flex-wrap gap-1.5">
                        {card.diet.length === 0 && <span className="text-[11.5px] text-white/35">Rien de particulier</span>}
                        {card.diet.map((d) => (
                          <Pastille key={d}>{d}</Pastille>
                        ))}
                      </div>
                      {card.allergens.length > 0 && (
                        <div className="rounded-[14px] border border-white/12 bg-white/[0.04] px-3 py-2">
                          <div className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-white/45">
                            Allergènes · à transmettre au traiteur
                          </div>
                          <div className="mt-1 text-[12px] font-semibold">{card.allergens.join(' · ')}</div>
                        </div>
                      )}
                    </>
                  )}

                  {section.id === 'mobilite' && (
                    <>
                      <LigneSombre icon={Car} label="Véhicule" value={card.vehicle} />
                      <LigneSombre icon={MapPin} label="Places disponibles" value={card.seats} />
                      {card.needsRide && <Pastille actif>Cherche une place</Pastille>}
                    </>
                  )}

                  {section.id === 'prestations' && (
                    <>
                      <LigneSombre icon={Briefcase} label="Prestation" value={card.service} />
                      <LigneSombre icon={BadgeEuro} label="Tarif" value={card.rate} accent />
                      <LigneSombre icon={MapPin} label="Zone d’intervention" value={card.area} />
                      <LigneSombre icon={Clock} label="Minimum de prestation" value={card.minimum} />
                    </>
                  )}

                  {section.id === 'documents' && redacted?.prive && (
                    <p className="flex items-start gap-2 text-[11.5px] leading-snug text-white/45">
                      <Lock size={12} className="mt-0.5 shrink-0" />
                      Pièces et IBAN réservés — la personne, et les mariés du mariage.
                    </p>
                  )}

                  {section.id === 'documents' && !redacted?.prive && (
                    <>
                      <ul className="space-y-1.5">
                        {card.documents.map((doc) => (
                          <li key={doc.id} className="flex items-center gap-2 text-[12px]">
                            <span
                              className={`h-1.5 w-1.5 shrink-0 rounded-full ${doc.done ? 'bg-emerald-400' : 'bg-white/25'}`}
                            />
                            <span className={doc.done ? 'text-white' : 'text-white/45'}>{doc.label}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-start gap-2.5 border-t border-white/10 pt-2.5">
                        <FileText size={13} className="mt-0.5 shrink-0 text-white/35" />
                        <div>
                          <div className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-white/45">IBAN</div>
                          <div className="mt-0.5 font-mono text-[12.5px]">{maskIban(card.iban)}</div>
                        </div>
                      </div>
                      <p className="flex items-start gap-1.5 text-[10.5px] leading-snug text-white/40">
                        <Lock size={11} className="mt-0.5 shrink-0" />
                        Jamais public : les pièces et l’IBAN ne sont lisibles que par les mariés.
                      </p>
                    </>
                  )}

                  {section.id === 'musique' && (
                    <>
                      <div className="text-[13px] font-semibold" style={{ color: 'var(--carte-accent)' }}>
                        {musicLabel(card.music)}
                      </div>
                      <p className="text-[11.5px] leading-snug text-white/50">
                        Sa contribution rejoint la playlist collaborative du mariage.
                      </p>
                    </>
                  )}
                </Bloc>
              ))}
            </div>

            <div className="flex shrink-0 items-center justify-between border-t border-white/10 px-4 py-2.5">
              <span className="flex items-center gap-1.5 text-[10.5px] text-white/40">
                <Lock size={11} /> Vos données restent les vôtres
              </span>
              <span className="flex items-center gap-1.5 text-[10.5px] text-white/40">
                <RotateCcw size={11} /> Recto
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      <button type="button" onClick={retourner} aria-pressed={flipped} className="vp-btn vp-btn-glass vp-press mt-3 w-full justify-center">
        <RotateCcw size={15} />
        {flipped ? 'Voir le recto' : 'Voir le verso'}
      </button>
    </div>
  );
}
