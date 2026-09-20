import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import CouvertureJour from '../components/CouvertureJour';
import { composerLeMagazine, enregistrerMagazine, phraseDuMagazine, reponseEnregistree } from '../lib/composition';
import { decoderPersonnes } from '../lib/composerPersonnes';

/**
 * SUPER COMPOSITION — LE MAGAZINE SE FAIT SOUS NOS YEUX
 *
 * On ne montre pas une barre qui tourne : on montre **les vingt-quatre pages
 * arriver l'une après l'autre**, avec leur numéro, leur heure et leur rubrique —
 * *06 · l'aube — Le temps*, *12 · midi — Le temps*, et ainsi de suite, huit
 * rubriques qui font trois fois le tour de la journée. C'est le vrai sommaire du
 * magazine, pas une animation inventée : chaque page listée est une page du
 * magazine composé, et elle existe à l'arrivée.
 *
 * Deux provenances :
 *
 * - **du composeur de l'accueil** (`?p=&jour=&role=`) : on compose le magazine du
 *   jour demandé (ou du jour), on le retient sur l'appareil, et on **revient à
 *   l'accueil** — c'est là que la couverture et la suite s'affichent.
 * - **de la création** (`?site=`) : on compose, puis on ouvre l'éditeur, comme
 *   avant.
 */

const DUREE_PAR_PAGE = 110;
const PAUSE_FINALE = 900;

export default function Generating() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const siteId = params.get('site');
  const personnesParam = params.get('p') ?? '';
  const jourParam = params.get('jour') ?? '';
  const roleParam = params.get('role') ?? '';

  // Sans réponse dans l'adresse (on a rouvert l'écran), on reprend celle qu'on a.
  const reponse = useMemo(() => {
    if (personnesParam.length > 0) {
      return { personnes: decoderPersonnes(personnesParam), date: jourParam, roleId: roleParam };
    }
    return reponseEnregistree() ?? { personnes: [], date: jourParam, roleId: roleParam };
  }, [personnesParam, jourParam, roleParam]);

  const magazine = useMemo(() => composerLeMagazine(reponse), [reponse]);
  const pages = magazine.edition.pages;
  const [composees, setComposees] = useState(0);
  const fini = composees >= pages.length;
  const progress = Math.round((composees / pages.length) * 100);
  const encours = pages[Math.min(composees, pages.length - 1)]!;

  // Une page toutes les cent-dix millisecondes : on a le temps de lire son nom.
  useEffect(() => {
    if (fini) return;
    const t = setTimeout(() => setComposees((n) => n + 1), DUREE_PAR_PAGE);
    return () => clearTimeout(t);
  }, [composees, fini]);

  // La fin : le magazine est retenu (sauf s'il vient d'un site à ouvrir), et on
  // passe la main.
  useEffect(() => {
    if (!fini) return;
    if (!siteId) enregistrerMagazine(magazine);
    const t = setTimeout(() => navigate(siteId ? `/editeur/${siteId}` : '/'), PAUSE_FINALE);
    return () => clearTimeout(t);
  }, [fini, siteId, magazine, navigate]);

  return (
    <div className="vp-env flex min-h-screen items-center justify-center px-5 py-16 text-[var(--vp-ink)]">
      <div className="w-full max-w-2xl text-center">
        <span className="vp-eyebrow">Le magazine, en une fois</span>
        <h1 className="vp-title mt-3" style={{ fontSize: 'clamp(2rem, 5.4vw, 3.2rem)' }}>
          SUPER COMPOSITION
        </h1>
        <p className="vp-body mx-auto mt-3 max-w-md">
          Vingt-quatre pages, une par heure — les huit rubriques font trois fois le tour de la journée.
        </p>

        {/* L'ANNEAU : ce qui reste à composer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-9 h-28 w-28"
        >
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(12,14,24,0.08)" strokeWidth="7" />
            <circle
              cx="60" cy="60" r="52" fill="none" stroke="url(#vpgrad)" strokeWidth="7" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 52}
              strokeDashoffset={2 * Math.PI * 52 * (1 - progress / 100)}
              style={{ transition: 'stroke-dashoffset 0.2s linear' }}
            />
            <defs>
              <linearGradient id="vpgrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#55585F" />
                <stop offset="100%" stopColor="#16171A" />
              </linearGradient>
            </defs>
          </svg>
          <div className="vp-glass vp-spec absolute inset-[16px] flex items-center justify-center rounded-full">
            <span className="vp-title vp-num text-[24px]">{progress}%</span>
          </div>
        </motion.div>

        {/* CE QUI S'ÉCRIT MAINTENANT */}
        <div className="mt-7 flex items-center justify-center gap-3">
          {fini ? (
            <span className="vp-title text-[15px]">Votre magazine est composé</span>
          ) : (
            <>
              <span className="vp-num vp-title text-[15px]">
                {String(composees + 1).padStart(2, '0')} / {pages.length}
              </span>
              <span className="h-3 w-px bg-black/15" />
              <span className="text-[14px] font-semibold">{encours.rubrique}</span>
            </>
          )}
        </div>

        {/* LES VINGT-QUATRE PAGES, DANS L'ORDRE */}
        <div className="mx-auto mt-6 grid max-h-[38vh] grid-cols-1 gap-1.5 overflow-y-auto text-left sm:grid-cols-2">
          {pages.map((page, i) => {
            const faite = i < composees;
            const enCours = i === composees;
            return (
              <div
                key={`${page.heure}-${page.rubrique}`}
                className={`flex items-center gap-2 rounded-[14px] px-3 py-2 transition-all duration-300 ${
                  enCours
                    ? 'bg-[var(--vp-ink)] text-white shadow-[0_12px_30px_-18px_rgba(11,12,18,0.8)]'
                    : faite
                      ? 'bg-white/70 text-[var(--vp-ink)]'
                      : 'bg-white/25 text-[var(--vp-muted)]'
                }`}
              >
                <span className="vp-num shrink-0 text-[11px] font-bold opacity-70">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="vp-num shrink-0 text-[11px] font-semibold">{page.nomDeLHeure}</span>
                <span className="truncate text-[12.5px]">{page.rubrique}</span>
                <span className="ml-auto flex h-4 w-4 shrink-0 items-center justify-center">
                  {faite && <Check size={13} strokeWidth={3} className="text-emerald-600" />}
                </span>
              </div>
            );
          })}
        </div>

        {/* LA COUVERTURE, À L'ARRIVÉE */}
        {fini && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <CouvertureJour couverture={magazine.couverture} largeur={132} vignette />
            <div className="text-left">
              <div className="vp-title text-[16px]">{phraseDuMagazine(magazine)}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--vp-muted)]">
                {magazine.edition.titre} · {magazine.edition.pages.length} pages · une par heure
              </div>
              <div className="mt-2 text-[13px] text-[var(--vp-muted)]">
                {magazine.fiche.enCeJourDe ? `En ce jour de ${magazine.fiche.fete}.` : magazine.fiche.personnage}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
