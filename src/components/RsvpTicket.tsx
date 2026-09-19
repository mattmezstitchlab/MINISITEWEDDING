import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { barresTicket } from '../lib/superMariage';
import { magasinFor } from '../lib/weddingPage';
import { formatDateLong } from '../lib/format';

/**
 * LE BILLET DU RSVP
 *
 * Répondre, c'est recevoir son billet — nominatif, numéroté, comme dans
 * l'univers Cinéma. Chaque univers a son registre : le billet (Cinéma, Vegas,
 * Club…), la table (le repas), le panier (le Supermarché 22H). Le papier ne
 * change pas ; le nom du registre, la couleur et la place, si.
 *
 * C'est la réponse du RSVP qui le délivre : l'invité garde son billet, les
 * mariés reçoivent la liste.
 */

interface Props {
  /** Le nom tel qu'il figurera sur le plan de table. */
  nom: string;
  /** L'univers du mariage : c'est lui qui décide du registre et de la couleur. */
  styleId: string;
  universeName: string;
  accent: string;
  /** Les mariés, la date et le lieu. */
  noms: string;
  date: string;
  venue: string;
  /** La réponse. */
  vient: boolean;
  places: number;
  enfants: number;
  /** Les moments cochés, les régimes, et le mot laissé. */
  moments: string[];
  regime: string;
  allergies: string;
  message: string;
  /** Quand la réponse est arrivée. */
  reponduLe: Date;
}

/** Le mot du registre : on entre, on s'assoit, ou on fait ses courses. */
function motRegistre(registre: string): { titre: string; entree: string; pied: string } {
  if (registre === 'table') {
    return { titre: 'CARTE DE TABLE', entree: 'PLACE À TABLE', pied: 'Présentez cette carte à l’entrée du repas.' };
  }
  if (registre === 'magasin') {
    return { titre: 'TICKET DE CAISSE', entree: 'PANIER', pied: 'Cochez, on s’occupe du reste — caisse 3.' };
  }
  return { titre: 'BILLET', entree: 'PLACE NUMÉROTÉE', pied: 'Présentez ce billet à l’entrée.' };
}

/** Un billet de cinéma a un rang et un siège : on les calcule, sans base. */
function placeDe(nom: string, date: string): { rang: string; place: number } {
  const somme = `${nom}${date}`
    .split('')
    .reduce((total, c) => total + c.charCodeAt(0), 0);
  return { rang: 'ABCDEFGH'[somme % 8], place: (somme % 40) + 1 };
}

export default function RsvpTicket({
  nom,
  styleId,
  universeName,
  accent,
  noms,
  date,
  venue,
  vient,
  places,
  enfants,
  moments,
  regime,
  allergies,
  message,
  reponduLe,
}: Props) {
  const registre = magasinFor(styleId).registre;
  const mots = motRegistre(registre);
  const { rang, place } = placeDe(nom, date);
  const code = `VOWS-${(nom.replace(/[^a-zA-Z]/g, '').toUpperCase() || 'INVITE').slice(0, 6)}-${place}${vient ? 'O' : 'N'}`;
  const jour = reponduLe.toLocaleDateString('fr-FR');
  const heure = `${String(reponduLe.getHours()).padStart(2, '0')}h${String(reponduLe.getMinutes()).padStart(2, '0')}`;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-1 py-4">
      <div className="relative mx-auto w-full max-w-[440px] text-left">
        {/* Le papier, dentelé comme au moment où il sort de l'imprimante */}
        <div className="relative bg-[#FFFEF7] font-mono text-[12.5px] leading-[1.4] text-black shadow-[0_30px_70px_rgba(0,0,0,0.5)]">
          <div className="absolute -top-3 left-0 right-0 h-3 bg-[radial-gradient(circle_at_6px_0px,_transparent_6px,_#FFFEF7_6px)] bg-[length:12px_12px] bg-repeat-x" />

          {/* La bande de l'univers */}
          <div className="flex items-center justify-between px-5 py-2 text-white" style={{ background: accent }}>
            <span className="text-[10px] font-black uppercase tracking-[0.22em]">{universeName}</span>
            <span className="text-[10px] font-black uppercase tracking-[0.22em]">{mots.titre}</span>
          </div>

          <div className="p-5">
            <div className="text-center">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-black/45">VOWS · {noms}</div>
              <div className="mt-1.5 text-[13px] uppercase tracking-[0.14em] text-black/60">
                {formatDateLong(date)} · {venue}
              </div>
            </div>

            <div className="my-4 border-t border-dashed border-black/25" />

            {/* Le nom, en grand : le billet est nominatif */}
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-black/45">
                {vient ? 'Billet nominatif' : 'Réponse enregistrée'}
              </div>
              <div className="vp-title mt-1 text-[26px] leading-none">{nom}</div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 border-y border-dashed border-black/20 py-3">
              <div>
                <div className="text-[9px] uppercase tracking-[0.16em] text-black/45">Convives</div>
                <div className="mt-0.5 text-[16px] font-black tabular-nums">
                  {vient ? places + enfants : 0}
                </div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-[0.16em] text-black/45">{mots.entree}</div>
                <div className="mt-0.5 text-[16px] font-black tabular-nums">
                  {vient ? (registre === 'billet' ? `${rang}-${place}` : place) : '—'}
                </div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-[0.16em] text-black/45">Enfants</div>
                <div className="mt-0.5 text-[16px] font-black tabular-nums">{vient ? enfants : 0}</div>
              </div>
            </div>

            {/* Ce que la cuisine et la régie doivent savoir */}
            <div className="mt-3 space-y-1 text-[11px]">
              <div className="flex justify-between gap-3">
                <span className="uppercase tracking-[0.14em] text-black/45">Régime</span>
                <span className="text-right font-bold">{regime || 'Rien de particulier'}</span>
              </div>
              {allergies && (
                <div className="flex justify-between gap-3">
                  <span className="uppercase tracking-[0.14em] text-black/45">Allergies</span>
                  <span className="text-right font-bold">{allergies}</span>
                </div>
              )}
              {moments.length > 0 && (
                <div className="flex justify-between gap-3">
                  <span className="shrink-0 uppercase tracking-[0.14em] text-black/45">Moments</span>
                  <span className="text-right font-bold">{moments.join(' · ')}</span>
                </div>
              )}
              {!vient && (
                <div className="flex justify-between gap-3">
                  <span className="uppercase tracking-[0.14em] text-black/45">Présence</span>
                  <span className="text-right font-bold">Absent·e — vous nous manquerez</span>
                </div>
              )}
            </div>

            {message && (
              <div className="mt-3 border-t border-dashed border-black/20 pt-3">
                <div className="text-[9px] uppercase tracking-[0.2em] text-black/45">Votre mot</div>
                <div className="mt-1 text-[11.5px] leading-snug italic">« {message} »</div>
              </div>
            )}

            {/* Le tampon */}
            <div className="mt-4 text-center">
              <span
                className="inline-flex -rotate-[4deg] items-center gap-1.5 rounded border-2 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]"
                style={{ borderColor: accent, color: accent }}
              >
                <Check size={12} /> Réponse enregistrée
              </span>
            </div>

            {/* Le code-barres */}
            <div className="mt-4 flex flex-col items-center border-t border-dashed border-black/20 pt-4">
              <div className="flex h-9 items-end gap-[2px]">
                {barresTicket(code).map((largeur, i) => (
                  <span
                    key={i}
                    className="bg-black"
                    style={{ width: `${largeur}px`, height: `${55 + largeur * 13}%`, opacity: i % 7 === 0 ? 0.5 : 1 }}
                  />
                ))}
              </div>
              <div className="mt-1 text-[10px] tracking-[0.24em]">{code}</div>
            </div>

            <div className="mt-4 border-t border-black pt-3 text-center text-[9px] uppercase leading-relaxed tracking-widest text-black/40">
              {mots.pied}
              <br />
              Répondu le {jour} à {heure} · {universeName} · {noms}
              <br />
              Les mariés reçoivent la même liste — rien à renvoyer
            </div>
          </div>

          <div className="absolute -bottom-3 left-0 right-0 h-3 rotate-180 bg-[radial-gradient(circle_at_6px_0px,_transparent_6px,_#FFFEF7_6px)] bg-[length:12px_12px] bg-repeat-x" />
        </div>
      </div>
    </motion.div>
  );
}
