import { useEffect, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { CarteVivante } from '../lib/cartesVivantes';
import { visuelsDeLEnchainement } from '../lib/selection';
import { usePrefersReducedMotion } from '../lib/useReducedMotion';
import { useControlesDeBande } from '../lib/personaCourant';
import HeroCycle from './HeroCycle';
import BandeDuHero from './BandeDuHero';

/**
 * LE HERO ENCHAÎNÉ — LES CARTES DE LA PERSONNE, DANS SON ORDRE
 *
 * **Chaque carte choisie sur l'accueil entre ici, à sa place.** Le hero les
 * traverse comme un plateau : le visuel de la carte arrive, respire, laisse la
 * suivante — et sous le titre, **la bande des cartes associées** : c'est elle
 * qui montre où l'on en est, et un clic saute à la carte voulue.
 *
 * Il ne décide de rien tout seul : on lui donne des cartes vivantes, il les
 * enchaîne. Le défilé avance comme partout sur le site (5,6 s), s'arrête quand
 * une personne écoute un morceau, et **se tait** si l'appareil préfère les
 * mouvements réduits. Les flèches du dock mènent l'enchaînement : la bande
 * s'enregistre sous son identifiant, comme celle des rôles et des univers.
 */

interface HeroEnchaineProps {
  /** L'enchaînement, dans l'ordre. Jamais vide : la page pose un repli. */
  cartes: CarteVivante[];
  /** Ce que le hero annonce de lui-même : « Son hero », « L'enchaînement ». */
  eyebrow?: string;
  /** Le temps d'une carte à l'écran, en millisecondes. */
  intervalle?: number;
  /** Le clic sur la carte du moment, quand la page veut l'ouvrir. */
  onOuvrir?: (carte: CarteVivante) => void;
  /** Le nom, le rôle, le mariage : ce que la page écrit dans le hero. */
  children?: ReactNode;
  /** L'identifiant de la bande pour les flèches du dock. */
  bandeId?: string;
}

export default function HeroEnchaine({
  cartes,
  eyebrow = 'Son hero',
  intervalle = 5600,
  onOuvrir,
  children,
  bandeId = 'enchainement',
}: HeroEnchaineProps) {
  const [index, setIndex] = useState(0);
  const [lectureEnCours, setLectureEnCours] = useState(false);
  const reduced = usePrefersReducedMotion();

  const total = cartes.length;
  const rang = total > 0 ? index % total : 0;
  const courante = cartes[rang];

  /** Le défilé : il avance tout seul, et s'arrête dès qu'un morceau joue. */
  useEffect(() => {
    if (reduced || lectureEnCours || total < 2) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % total), intervalle);
    return () => window.clearTimeout(t);
  }, [index, reduced, lectureEnCours, total, intervalle]);

  /** Les flèches du dock mènent l'enchaînement, comme les autres bandes. */
  const surveiller = useControlesDeBande(bandeId, {
    precedent: () => setIndex((i) => (i - 1 + Math.max(1, total)) % Math.max(1, total)),
    suivant: () => setIndex((i) => (i + 1) % Math.max(1, total)),
  });

  if (!courante) return null;

  /** La carte du moment est marquée : c'est elle que la bande met au milieu. */
  const cartesAvecActif = cartes.map((carte) => ({ ...carte, actif: carte.id === courante.id }));

  return (
    <div ref={surveiller}>
      <HeroCycle
        visuels={visuelsDeLEnchainement(cartes)}
        actifId={courante.id}
        contenuClassName="mt-auto !max-w-[1180px]"
      >
        <div className="text-white">
          {/* Ce que le hero est, et où l'on en est : jamais plus d'une ligne. */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="vp-eyebrow !text-white/70">{eyebrow}</span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
              {rang + 1} / {total}
            </span>
            {total > 1 && (
              <span className="flex items-center gap-1.5" aria-hidden="true">
                {cartes.map((carte, i) => (
                  <span
                    key={`${carte.id}-${i}`}
                    className={`h-[2px] w-5 rounded-full ${i === rang ? 'bg-white/85' : 'bg-white/25'}`}
                  />
                ))}
              </span>
            )}
          </div>

          {/* Le nom, le rôle, le mariage : la page les pose ici. */}
          {children}

          {/* La carte du moment : son titre, ce qu'elle dit, et son mot. */}
          <motion.div
            key={courante.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5"
          >
            <h2 className="vp-title text-white" style={{ fontSize: 'clamp(1.5rem, 3.6vw, 2.4rem)', lineHeight: 1.06 }}>
              {courante.titre}
            </h2>
            {courante.sousTitre && (
              <p className="mt-2 max-w-[620px] text-[15px] leading-relaxed text-white/75">{courante.sousTitre}</p>
            )}
            {onOuvrir && (
              <button type="button" onClick={() => onOuvrir(courante)} className="vp-btn vp-btn-glass vp-press mt-4">
                Ouvrir la carte
              </button>
            )}
          </motion.div>

          {/* LES CARTES ASSOCIÉES : la bande de l'enchaînement, dans le hero. */}
          <div className="mt-7">
            <BandeDuHero
              premiere
              cartes={cartesAvecActif}
              styleId={courante.id}
              onChoisir={(carte) => setIndex(Math.max(0, cartes.findIndex((c) => c.id === carte.id)))}
              onLecture={setLectureEnCours}
            />
          </div>
        </div>
      </HeroCycle>
    </div>
  );
}
