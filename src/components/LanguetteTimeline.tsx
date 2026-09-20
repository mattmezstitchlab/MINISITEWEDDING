import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search } from 'lucide-react';
import CouvertureJour from './CouvertureJour';
import { basculerTimeline, useTimelineOuverte } from '../lib/capsuleCommande';
import {
  angleDuJour, chercherUnJour, joursDeLaSemaine, moisDeLaSaison, saisonsDeLaTimeline,
  semainesDuMois, type JourDeLaTimeline,
} from '../lib/deroulerLannee';
import { MOIS } from '../lib/calendrier';

/**
 * LA LANGUETTE TIMELINE — L'ANNÉE EN COUVERTURES, SOUS LE DOCK
 *
 * Le dock a un picto timeline : la languette sort en bas, comme une onglet du
 * dock. Dedans, **l'année entière se déplie en couvertures** : les quatre
 * saisons d'abord ; une saison se déplie en mois, un mois en semaines, une
 * semaine en jours — et le jour ouvre le magazine, où les heures prennent le
 * relais. À gauche, **le cadran** : les quatre saisons en quartiers colorés, et
 * l'aiguille du jour qu'on regarde — la molette a son repère.
 *
 * Une recherche, en haut : on tape un nom, les jours viennent.
 */

type Niveau = 'saisons' | 'mois' | 'semaines' | 'jours';

export default function LanguetteTimeline() {
  const ouverte = useTimelineOuverte();
  const navigate = useNavigate();
  const annee = new Date().getFullYear();

  const [niveau, setNiveau] = useState<Niveau>('saisons');
  const [saisonId, setSaisonId] = useState<string | null>(null);
  const [mois, setMois] = useState<number | null>(null);
  const [semaine, setSemaine] = useState<number | null>(null);
  const [requete, setRequete] = useState('');

  const saisons = useMemo(() => saisonsDeLaTimeline(), []);
  const resultats = useMemo(() => chercherUnJour(annee, requete), [annee, requete]);

  if (!ouverte) return null;

  const ouvrirJour = (jour: JourDeLaTimeline) => {
    navigate(`/magazine?jour=${jour.jour}`);
  };

  const remonter = () => {
    if (niveau === 'jours') return setNiveau('semaines');
    if (niveau === 'semaines') return setNiveau('mois');
    if (niveau === 'mois') return setNiveau('saisons');
    return basculerTimeline(false);
  };

  const fil = [
    'Année',
    saisonId ? saisons.find((s) => s.id === saisonId)?.nom ?? '' : '',
    mois ? MOIS.find((m) => m.numero === mois)?.nom ?? '' : '',
    semaine ? `Semaine ${semaine}` : '',
  ].filter(Boolean);

  /** L'aiguille : le jour regardé, ou aujourd'hui. */
  const jourRepere = nouvelleDate();
  const angle = angleDuJour(jourRepere);

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/12 bg-[#0B0C12]/97 pb-24 text-white shadow-[0_-18px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      <div className="vp-page flex flex-col gap-3 pt-4">
        {/* ——— LE CADRAN, LE FIL, LA RECHERCHE ——— */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Le cadran : les quatre saisons en quartiers, l'aiguille du jour. */}
          <svg width="52" height="52" viewBox="0 0 40 40" role="img" aria-label="Le cadran de l'année — les quatre saisons, et l'aiguille du jour">
            {saisons.map((saison, i) => {
              const debut = (i / 4) * 360 - 90;
              const fin = ((i + 1) / 4) * 360 - 90;
              const rad = (d: number) => (d * Math.PI) / 180;
              return (
                <path
                  key={saison.id}
                  d={`M 20 20 L ${20 + 16 * Math.cos(rad(debut))} ${20 + 16 * Math.sin(rad(debut))} A 16 16 0 0 1 ${20 + 16 * Math.cos(rad(fin))} ${20 + 16 * Math.sin(rad(fin))} Z`}
                  fill={saison.fond}
                  opacity={saisonId === null || saisonId === saison.id ? 0.9 : 0.25}
                />
              );
            })}
            <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: '20px 20px', transition: 'transform 400ms' }}>
              <line x1="20" y1="20" x2="20" y2="5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
            </g>
            <circle cx="20" cy="20" r="2" fill="white" />
          </svg>

          <button
            type="button"
            onClick={remonter}
            aria-label="Replier d'un niveau"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white/50 hover:text-white"
          >
            <ChevronLeft size={15} />
          </button>

          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
            {fil.join(' › ')}
          </span>

          <div className="ml-auto flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5">
            <Search size={13} className="text-white/50" />
            <input
              value={requete}
              onChange={(e) => setRequete(e.target.value)}
              placeholder="Chercher un jour — un prénom, une fête"
              aria-label="Chercher un jour dans l'année"
              className="w-[180px] bg-transparent text-[12px] text-white placeholder:text-white/35 focus:outline-none sm:w-[240px]"
            />
          </div>
        </div>

        {/* ——— LA BANDE : LES COUVERTURES DU NIVEAU ——— */}
        <div className="no-scrollbar flex items-stretch gap-3 overflow-x-auto pb-2">
          {requete.trim().length >= 2 ? (
            resultats.length > 0 ? (
              resultats.map((jour) => (
                <CarteJour key={jour.jour} jour={jour} onOuvrir={() => ouvrirJour(jour)} />
              ))
            ) : (
              <p className="py-6 text-[12.5px] text-white/50">Aucun jour ne porte ce nom, cette année.</p>
            )
          ) : niveau === 'saisons' ? (
            saisons.map((saison) => (
              <button
                key={saison.id}
                type="button"
                onClick={() => {
                  setSaisonId(saison.id);
                  setNiveau('mois');
                }}
                className="flex h-[120px] w-[160px] shrink-0 flex-col items-center justify-center gap-1 rounded-[16px] transition hover:scale-[1.03]"
                style={{ background: saison.fond, color: saison.encre }}
                aria-label={`Déplier ${saison.nom}`}
              >
                <span className="text-[22px]">{saison.symbole}</span>
                <span className="text-[15px] font-bold tracking-tight">{saison.nom}</span>
                <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] opacity-70">
                  13 semaines
                </span>
              </button>
            ))
          ) : niveau === 'mois' ? (
            moisDeLaSaison(saisonId ?? 'printemps').map((m) => (
              <button
                key={m.numero}
                type="button"
                onClick={() => {
                  setMois(m.numero);
                  setNiveau('semaines');
                }}
                className="flex h-[120px] w-[140px] shrink-0 flex-col items-center justify-center gap-1 rounded-[16px] border border-white/12 bg-white/6 transition hover:border-white/40"
                aria-label={`Déplier ${m.nom}`}
              >
                <span className="text-[15px] font-bold">{m.nom}</span>
                <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/50">
                  {semainesDuMois(annee, m.numero).length} semaines
                </span>
              </button>
            ))
          ) : niveau === 'semaines' ? (
            semainesDuMois(annee, mois ?? 1).map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  setSemaine(num);
                  setNiveau('jours');
                }}
                className="flex h-[120px] w-[140px] shrink-0 flex-col items-center justify-center gap-1 rounded-[16px] border border-white/12 bg-white/6 transition hover:border-white/40"
                aria-label={`Déplier la semaine ${num}`}
              >
                <span className="text-[15px] font-bold">Semaine {num}</span>
                <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/50">
                  7 jours
                </span>
              </button>
            ))
          ) : (
            joursDeLaSemaine(annee, semaine ?? 1).map((jour) => (
              <CarteJour key={jour.jour} jour={jour} onOuvrir={() => ouvrirJour(jour)} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function nouvelleDate(): Date {
  return new Date();
}

/** Une carte-jour : la couverture en petit, le nom dessous. */
function CarteJour({ jour, onOuvrir }: { jour: JourDeLaTimeline; onOuvrir: () => void }) {
  return (
    <button
      type="button"
      onClick={onOuvrir}
      className="flex w-[104px] shrink-0 flex-col items-center gap-1.5 rounded-[14px] p-2 transition hover:scale-[1.04]"
      aria-label={`Ouvrir le ${jour.nom}`}
    >
      <CouvertureJour couverture={jour.couverture} largeur={88} vignette />
      <span className="w-full truncate text-center text-[10.5px] font-semibold text-white/75">
        {jour.nom} · {jour.jour}
      </span>
    </button>
  );
}
