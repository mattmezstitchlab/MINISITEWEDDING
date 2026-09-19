import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAvis } from '../lib/avis';
import type { CarteVivante } from '../lib/cartesVivantes';
import CarteVivanteUI from './CarteVivante';

/**
 * LA BANDE DE NAVIGATION — TROIS CARTES, AU CENTRE
 *
 * Sous le hero, sur fond blanc : **la carte de la page au milieu, plus grande**,
 * une carte de chaque côté, et **une flèche dans l'espace laissé libre à chaque
 * bout** — c'est la navigation.
 *
 * Le milieu est la carte liée au hero : quand le hero défile tout seul, c'est
 * elle qui change, et le titre du hero suit. Les flèches (et les cartes de
 * côté) font la même chose à la main : elles montrent l'univers suivant, qui
 * vient se mettre au milieu.
 *
 * Ce que fait un clic dépend de la page, jamais de la bande : changer l'univers
 * montré, ouvrir un article, passer d'un produit ou d'un métier à l'autre.
 */

interface BandeauHeroProps {
  /** Ce que la bande annonce : « Les univers », « Les moments du Jour J »… */
  libelle: string;
  cartes: CarteVivante[];
  /** L'univers qui compte les avis — la même clé de comptoir pour tout le monde. */
  styleId: string;
  /** L'identifiant de la carte en lecture dans le hero, s'il y en a une. */
  enLectureId?: string | null;
  /** Lancé : la page ouvre son lecteur dans le hero. */
  onJouer?: (carte: CarteVivante) => void;
  /** Choisi : la page décide (naviguer, ou changer ce que le hero montre). */
  onChoisir?: (carte: CarteVivante) => void;
  /** Ce que fait le play, quand ce n'est pas jouer : « Entrer ». */
  libelleAction?: string;
  /** On regarde une carte : la page s'accorde à elle (le nom, les portes). */
  onSurvol?: (carte: CarteVivante | null) => void;
  /** Vrai pour la bande posée dans le hero : son libellé s'écrit en blanc. */
  premiere?: boolean;
}

export default function BandeauHero({
  libelle,
  cartes,
  styleId,
  enLectureId = null,
  onJouer,
  onChoisir,
  libelleAction,
  onSurvol,
  premiere = false,
}: BandeauHeroProps) {
  const navigate = useNavigate();
  const { compte, aime, basculer } = useAvis(styleId);

  if (cartes.length === 0) return null;

  const choisir = (carte: CarteVivante) => {
    if (onChoisir) onChoisir(carte);
    else if (carte.to) navigate(carte.to);
  };

  /** Le milieu : la carte de la page, celle que le hero montre. */
  const milieu = Math.max(0, cartes.findIndex((c) => c.actif));
  const precedente = cartes[(milieu - 1 + cartes.length) % cartes.length]!;
  const suivante = cartes[(milieu + 1) % cartes.length]!;

  const rendre = (carte: CarteVivante, facteur: number, cote: boolean) => (
    <motion.div
      key={`${carte.id}-${cote ? 'cote' : 'milieu'}`}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cote ? 'hidden opacity-60 transition-opacity hover:opacity-100 sm:block' : ''}
      onMouseEnter={() => onSurvol?.(carte)}
      onMouseLeave={() => onSurvol?.(null)}
    >
      <CarteVivanteUI
        carte={carte}
        facteur={facteur}
        aime={aime(carte.cle)}
        avis={compte(carte.cle)}
        joue={enLectureId === carte.id}
        libelleAction={libelleAction}
        onClic={() => choisir(carte)}
        onAimer={() => basculer(carte.cle)}
        onJouer={() => onJouer?.(carte)}
      />
    </motion.div>
  );

  return (
    <div className="w-full">
      <div
        className={`mb-1 text-center font-mono text-[9.5px] uppercase tracking-[0.22em] ${
          premiere ? 'text-white/60' : 'text-black/40'
        }`}
      >
        {libelle}
      </div>

      {/* Trois cartes, et les flèches dans l'espace de chaque côté. */}
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <Fleche sens="gauche" onClick={() => choisir(precedente)} />

        <div className="flex min-w-0 flex-1 items-center justify-center gap-3 sm:gap-6">
          {rendre(precedente, 0.25, true)}
          {rendre(cartes[milieu]!, 1, false)}
          {rendre(suivante, 0.25, true)}
        </div>

        <Fleche sens="droite" onClick={() => choisir(suivante)} />
      </div>
    </div>
  );
}

/** La flèche de navigation, dans l'espace libre à côté des cartes. */
function Fleche({ sens, onClick }: { sens: 'gauche' | 'droite'; onClick: () => void }) {
  const Icone = sens === 'gauche' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={sens === 'gauche' ? 'Carte précédente' : 'Carte suivante'}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-[#0B0C12] shadow-sm transition hover:border-black hover:bg-[#0B0C12] hover:text-white active:scale-95"
    >
      <Icone size={17} />
    </button>
  );
}
