import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { formatDateLong } from '../lib/format';
import { Sceau, Timbre } from './Timbre';

/**
 * LA CARTE POSTALE D'INVITATION
 *
 * Un lien d'invitation ne montrait qu'un bandeau. Il montre maintenant une
 * carte postale : le visuel du mariage d'un côté, et de l'autre le mot des
 * mariés, l'adresse — et deux timbres, celui du marié et celui de la mariée,
 * chacun avec sa photo, sous le sceau rond du site.
 *
 * Les timbres et le sceau sont dessinés : aucun n'est une image à téléverser.
 */

interface Props {
  partner1: string;
  partner2: string;
  date: string;
  venue: string;
  city: string;
  /** L'univers du mariage : son nom, sa couleur, son visuel. */
  univers: string;
  accent: string;
  visuel: string;
  /** Les deux photos des timbres : celle du mariage et celle du couple. */
  photoMariage: string;
  photoCouple: string;
  /** Le mot des mariés, et l'adresse du jour J. */
  mot: string;
}

/** La date, écrite court : « 12.06.2027 », comme sur un timbre. */
function dateCourte(date: string): string {
  const [a, m, j] = date.split('-');
  return a && m && j ? `${j}.${m}.${a}` : date;
}

export default function CartePostale({
  partner1,
  partner2,
  date,
  venue,
  city,
  univers,
  accent,
  visuel,
  photoMariage,
  photoCouple,
  mot,
}: Props) {
  const [retournee, setRetournee] = useState(false);
  const reduire = useReducedMotion();
  const noms = [partner1, partner2].filter(Boolean).join(' & ');
  const adresse = [venue, city].filter(Boolean).join(', ');
  const jour = date ? formatDateLong(date) : '';
  const cercle = `${noms.toUpperCase()} · ${jour.toUpperCase()} · ${adresse.toUpperCase()} · `;

  return (
    <div>
      <div className="relative mx-auto w-full max-w-[860px]" style={{ perspective: '1600px' }}>
        <div
          role="button"
          tabIndex={0}
          aria-label={retournee ? 'Voir le recto de la carte postale' : 'Voir le verso de la carte postale'}
          onClick={() => setRetournee((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setRetournee((v) => !v);
            }
          }}
          className="relative h-[560px] cursor-pointer rounded-[18px] outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:h-[470px]"
        >
          <motion.div
            animate={{ rotateY: retournee ? 180 : 0 }}
            transition={reduire ? { duration: 0 } : { duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformStyle: 'preserve-3d' }}
            className="absolute inset-0"
          >
            {/* ————————————————————————— LE RECTO ————————————————————————— */}
            <div
              aria-hidden={retournee}
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
              className="absolute inset-0 overflow-hidden rounded-[18px] bg-[#0B0C12] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/10"
            >
              <img src={visuel} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/45 to-black/25" />

              {/* La marque d'une carte postale */}
              <div className="absolute left-0 top-5 flex items-center gap-2 bg-white/95 px-3.5 py-1.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.22em] text-black">
                Carte postale · {univers}
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-9">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
                  Vous êtes invité
                </div>
                <h1 className="vp-title mt-3 text-white" style={{ fontSize: 'clamp(2rem, 6vw, 3.6rem)', lineHeight: 1.02 }}>
                  {noms}
                </h1>
                <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14.5px] text-white/75">
                  {jour && <span className="capitalize">{jour}</span>}
                  {adresse && <span>{adresse}</span>}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
                  <RotateCcw size={12} /> Retournez la carte : le mot est au dos
                </span>
              </div>
            </div>

            {/* ————————————————————————— LE VERSO ————————————————————————— */}
            <div
              aria-hidden={!retournee}
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              className="no-scrollbar absolute inset-0 overflow-y-auto rounded-[18px] bg-[#FFFEF7] text-[#14130F] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.6)] ring-1 ring-black/10"
            >
              <div className="flex items-center justify-between border-b border-dashed border-black/20 px-5 py-3">
                <span className="font-mono text-[9.5px] font-bold uppercase tracking-[0.22em] text-black/55">
                  Carte postale · {univers}
                </span>
                <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-black/40">
                  Affranchi par {noms}
                </span>
              </div>

              <div className="grid gap-6 p-5 sm:grid-cols-2 sm:gap-0">
                {/* À gauche : le mot */}
                <div className="sm:border-r sm:border-dashed sm:border-black/20 sm:pr-6">
                  <span className="font-mono text-[9.5px] font-bold uppercase tracking-[0.2em] text-black/45">
                    Le mot des mariés
                  </span>
                  <p className="vp-title mt-3 text-[19px] leading-snug">{noms}</p>
                  <p className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-black/75">{mot}</p>
                  <p className="mt-4 text-[14px] italic text-black/70">
                    {partner1} &amp; {partner2}
                  </p>
                  <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-black/45">
                    {jour}
                    {adresse ? ` · ${adresse}` : ''}
                  </p>
                </div>

                {/* À droite : l'adresse, les deux timbres, et le sceau */}
                <div className="relative sm:pl-6 sm:pt-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-mono text-[9.5px] font-bold uppercase tracking-[0.2em] text-black/45">
                        Adresse
                      </span>
                      <p className="mt-2 text-[15px] font-semibold leading-snug">{noms}</p>
                      <p className="text-[13.5px] leading-snug text-black/70">
                        {venue}
                        <br />
                        {city}
                      </p>
                    </div>
                  </div>

                  <div className="relative mt-5 flex items-start gap-3 pr-2">
                    <Timbre
                      photo={photoMariage}
                      nom={partner1}
                      label="Le marié"
                      date={dateCourte(date)}
                      accent={accent}
                      penche={-3}
                    />
                    <Timbre
                      photo={photoCouple}
                      nom={partner2}
                      label="La mariée"
                      date={dateCourte(date)}
                      accent={accent}
                      penche={2.5}
                    />
                  </div>

                  {/* Le sceau du site, posé par-dessus les deux timbres */}
                  <div className="pointer-events-none absolute -bottom-10 left-2 opacity-90 sm:left-6">
                    <Sceau texte={cercle} centre={dateCourte(date)} accent={accent} />
                  </div>
                </div>
              </div>

              <div className="mt-14 flex items-center justify-between border-t border-dashed border-black/20 px-5 py-3 font-mono text-[9.5px] uppercase tracking-[0.16em] text-black/45 sm:mt-8">
                <span className="flex items-center gap-1.5">
                  <RotateCcw size={11} /> Le visuel est au recto
                </span>
                <span>Merci de répondre avant le jour J</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <button type="button" onClick={() => setRetournee((v) => !v)} className="vp-btn vp-btn-glass vp-press">
          <RotateCcw size={15} />
          {retournee ? 'Voir le recto' : 'Lire le mot au dos'}
        </button>
      </div>
    </div>
  );
}
