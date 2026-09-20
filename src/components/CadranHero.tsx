import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import { TITRES } from '../lib/personas';
import { SAISONS } from '../lib/jeuDeCartes';

/**
 * LE CADRAN, AU CENTRE DE L'ACCUEIL — LA PORTE DU CONCEPT
 *
 * Un cadran au milieu de l'écran. Autour, **les rôles** : on fait pivoter le
 * cadran pour choisir le sien. Au centre, **le point zéro** :
 *
 * - sans rôle choisi, on clique : le cadran **se met en rotation** et la
 *   **voix du concept** se lance (l'audio se génère à part — `/audio`) ;
 * - un rôle choisi, on clique : **la vidéo de présentation de ce rôle** se
 *   lance — c'est comme ça qu'on comprend le fonctionnement, chacun chez soi.
 *
 * Derrière le cadran, **la vidéo de présentation** du site passe en fond.
 * Le hero d'hier, lui, descend d'un étage : il reste juste en dessous.
 */

export default function CadranHero() {
  /** null = le concept ; sinon, le rôle que le cadran regarde. */
  const [indexRole, setIndexRole] = useState<number | null>(null);
  /** L'angle accumulé : le cadran pivote sans jamais revenir en arrière. */
  const [rotation, setRotation] = useState(0);
  /** La vidéo d'un rôle, en grand. */
  const [videoRole, setVideoRole] = useState<string | null>(null);
  const [videoManquante, setVideoManquante] = useState(false);
  const [voixEnRoute, setVoixEnRoute] = useState(false);
  const [voixManquante, setVoixManquante] = useState(false);
  const [fondManquant, setFondManquant] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const n = TITRES.length;
  const pas = 360 / n;

  const pivoter = (sens: 1 | -1) => {
    setRotation((r) => r + sens * pas);
    setIndexRole((i) => {
      const actuel = i ?? (sens === 1 ? -1 : 0);
      return (actuel + sens + n) % n;
    });
  };

  /** Le centre : il tourne, puis il lance — la voix, ou la vidéo du rôle. */
  const lancer = () => {
    setRotation((r) => r + 360);
    if (indexRole === null) {
      setVoixManquante(false);
      setVoixEnRoute(true);
      const audio = audioRef.current;
      if (!audio) return;
      audio.currentTime = 0;
      audio.play().catch(() => {
        setVoixEnRoute(false);
        setVoixManquante(true);
      });
    } else {
      const role = TITRES[indexRole]!;
      setVideoManquante(false);
      setVideoRole(role.id);
    }
  };

  const roleActif = indexRole === null ? null : TITRES[indexRole]!;

  return (
    <section aria-label="Le cadran du concept" className="vp-env vp-env-dark relative overflow-hidden bg-[#07080C] text-white">
      {/* La vidéo de présentation, en fond — elle arrive quand elle est prête. */}
      {!fondManquant && (
        <video
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35"
          src="/videos/presentation.mp4"
          autoPlay
          muted
          loop
          playsInline
          onError={() => setFondManquant(true)}
          aria-hidden="true"
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_42%,rgba(7,8,12,0.25),rgba(7,8,12,0.92))]" aria-hidden="true" />

      <div className="vp-page relative flex min-h-[88svh] flex-col items-center justify-center py-20 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/50">
          Le concept, en un cadran
        </span>

        {/* ——— LE CADRAN ——— */}
        <div className="relative mt-8">
          <svg
            width="min(72vw, 340px)"
            height="min(72vw, 340px)"
            viewBox="0 0 100 100"
            role="img"
            aria-label="Le cadran : les quatre saisons, et les rôles autour"
          >
            {/* Les quatre saisons, en quartiers. */}
            {SAISONS.map((saison, i) => {
              const debut = (i / 4) * 360 - 90;
              const fin = ((i + 1) / 4) * 360 - 90;
              const rad = (deg: number) => (deg * Math.PI) / 180;
              return (
                <path
                  key={saison.id}
                  d={`M 50 50 L ${50 + 46 * Math.cos(rad(debut))} ${50 + 46 * Math.sin(rad(debut))} A 46 46 0 0 1 ${50 + 46 * Math.cos(rad(fin))} ${50 + 46 * Math.sin(rad(fin))} Z`}
                  fill={saison.fond}
                  opacity="0.32"
                />
              );
            })}
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />

            {/* Les encoches : une par jour de la roue. */}
            {Array.from({ length: 36 }, (_, i) => {
              const a = ((i * 10 - 90) * Math.PI) / 180;
              return (
                <line
                  key={i}
                  x1={50 + 43 * Math.cos(a)}
                  y1={50 + 43 * Math.sin(a)}
                  x2={50 + 46 * Math.cos(a)}
                  y2={50 + 46 * Math.sin(a)}
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="0.5"
                />
              );
            })}

            {/* L'aiguille : elle regarde le rôle choisi. */}
            <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '50px 50px', transition: 'transform 650ms cubic-bezier(0.22, 1, 0.36, 1)' }}>
              <line x1="50" y1="50" x2="50" y2="10" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
              <circle cx="50" cy="10" r="2.2" fill="white" />
            </g>
          </svg>

          {/* Les rôles, autour : celui que l'aiguille regarde est allumé. */}
          {TITRES.map((role, i) => {
            const angle = ((i * pas - 90) * Math.PI) / 180;
            const actif = indexRole === i;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => {
                  setIndexRole(i);
                  setRotation((r) => r + (i * pas - (((r % 360) + 360) % 360)));
                }}
                aria-pressed={actif}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] transition ${
                  actif
                    ? 'border-[#00FF88] bg-[#00FF88] text-black'
                    : 'border-white/20 bg-black/40 text-white/60 hover:border-white/50 hover:text-white'
                }`}
                style={{
                  left: `${50 + 46 * Math.cos(angle)}%`,
                  top: `${50 + 46 * Math.sin(angle)}%`,
                }}
              >
                {role.titre}
              </button>
            );
          })}

          {/* Le centre : le point zéro — il tourne, et il lance. */}
          <button
            type="button"
            onClick={lancer}
            aria-label={roleActif ? `Lancer la vidéo de présentation — ${roleActif.titre}` : 'Le centre du cadran — lancer la voix du concept'}
            className="absolute left-1/2 top-1/2 flex h-[88px] w-[88px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-full border border-white/25 bg-[#0B0C12]/85 shadow-[0_0_60px_rgba(0,255,136,0.15)] backdrop-blur transition hover:scale-105 hover:border-white/60"
          >
            <Play size={16} className="text-[#00FF88]" />
            <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/65">
              {roleActif ? 'La vidéo' : 'La voix'}
            </span>
          </button>

          {/* La voix du concept — le fichier arrive, généré à part. */}
          <audio
            ref={audioRef}
            src="/audio/explication-concept.mp3"
            onEnded={() => setVoixEnRoute(false)}
            onError={() => {
              setVoixEnRoute(false);
              setVoixManquante(true);
            }}
          />
        </div>

        {/* Les flèches : on fait pivoter le cadran d'un rôle. */}
        <div className="mt-9 flex items-center gap-3">
          <button
            type="button"
            onClick={() => pivoter(-1)}
            aria-label="Faire pivoter le cadran vers la gauche"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white/50 hover:text-white"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="min-w-[180px] text-[13px] text-white/70" aria-live="polite">
            {roleActif ? (
              <>Rôle choisi : <strong className="text-white">{roleActif.titre}</strong> — cliquez le centre</>
            ) : (
              'Cliquez le centre : la voix explique le concept'
            )}
          </span>
          <button
            type="button"
            onClick={() => pivoter(1)}
            aria-label="Faire pivoter le cadran vers la droite"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white/50 hover:text-white"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <p className="mt-3 max-w-[440px] font-mono text-[10px] leading-relaxed tracking-[0.06em] text-white/40">
          Faites pivoter le cadran pour choisir votre rôle — puis cliquez le centre : la vidéo de ce
          rôle se lance. Sans rôle, c'est la voix du concept qui parle.
        </p>

        {voixEnRoute && (
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#00FF88]">La voix du concept est en route</p>
        )}
        {voixManquante && (
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
            La voix du concept arrive bientôt — elle se génère
          </p>
        )}
      </div>

      {/* ——— LA VIDÉO DU RÔLE, EN GRAND ——— */}
      {videoRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-6" role="dialog" aria-label="La vidéo de présentation du rôle">
          <button
            type="button"
            onClick={() => setVideoRole(null)}
            aria-label="Fermer la vidéo"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition hover:text-white"
          >
            <X size={16} />
          </button>
          {videoManquante ? (
            <p className="max-w-[420px] text-center font-mono text-[12px] leading-relaxed text-white/60">
              La vidéo de présentation de ce rôle arrive bientôt — elle se prépare.
            </p>
          ) : (
            <video
              className="max-h-[80svh] w-full max-w-[920px] rounded-[14px]"
              src={`/videos/presentation-${videoRole}.mp4`}
              controls
              autoPlay
              onError={() => setVideoManquante(true)}
            />
          )}
        </div>
      )}
    </section>
  );
}
