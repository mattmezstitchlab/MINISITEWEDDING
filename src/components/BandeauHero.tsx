import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAvis } from '../lib/avis';
import type { CarteVivante } from '../lib/cartesVivantes';
import CarteVivanteUI from './CarteVivante';

/**
 * LA BANDE DE NAVIGATION
 *
 * Sous le hero, sur fond blanc : la même bande que la playlist — les cartes
 * qu'on fait défiler, qui grossissent au centre, avec leur bouton de lecture et
 * l'avis du public — et **la carte de la page est centrée**, comme la carte
 * dominante de la playlist. On sait où l'on est sans qu'on ait à l'écrire.
 *
 * Ce que fait un clic dépend de la page, jamais de la bande : changer l'univers
 * montré, ouvrir un article, passer d'un produit ou d'un métier à l'autre.
 *
 * Elle ne pose aucun contenant : la page l'installe dans le sien (`.vp-page`).
 */

/** La bande : ce que la page lui donne, et rien de plus. */
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
}

export default function BandeauHero({
  libelle,
  cartes,
  styleId,
  enLectureId = null,
  onJouer,
  onChoisir,
}: BandeauHeroProps) {
  const navigate = useNavigate();
  const { compte, aime, basculer } = useAvis(styleId);
  const piste = useRef<HTMLDivElement | null>(null);
  /** La place de chaque carte dans la bande : 0 au bord, 1 au centre. */
  const [facteurs, setFacteurs] = useState<number[]>([]);
  /** La carte de la page : c'est elle qu'on centre. */
  const actifId = cartes.find((c) => c.actif)?.id ?? cartes[0]?.id ?? '';
  /** La première mise en place se fait sans glisser : la bande s'ouvre déjà là. */
  const premier = useRef(true);

  /** Le grossissement : la carte la plus proche du centre est la plus grande. */
  useEffect(() => {
    const conteneur = piste.current;
    if (!conteneur) return;
    const mesurer = () => {
      const cadre = conteneur.getBoundingClientRect();
      const centre = cadre.left + cadre.width / 2;
      const enfants = Array.from(conteneur.children) as HTMLElement[];
      setFacteurs(
        enfants.map((el) => {
          const r = el.getBoundingClientRect();
          const distance = Math.abs(r.left + r.width / 2 - centre);
          const portee = cadre.width / 2 + r.width / 2;
          return Math.max(0, Math.min(1, 1 - distance / portee));
        }),
      );
    };
    const centrer = (doux: boolean) => {
      const cible = conteneur.querySelector<HTMLElement>('[data-actif="true"]') ?? conteneur.children[0];
      if (!(cible instanceof HTMLElement)) return;
      conteneur.scrollTo({
        left: cible.offsetLeft - conteneur.clientWidth / 2 + cible.clientWidth / 2,
        behavior: doux ? 'smooth' : 'auto',
      });
    };
    const doux = !premier.current;
    premier.current = false;
    mesurer();
    centrer(doux);
    const frame = requestAnimationFrame(() => {
      centrer(doux);
      mesurer();
    });
    conteneur.addEventListener('scroll', mesurer, { passive: true });
    window.addEventListener('resize', mesurer);
    return () => {
      cancelAnimationFrame(frame);
      conteneur.removeEventListener('scroll', mesurer);
      window.removeEventListener('resize', mesurer);
    };
  }, [cartes.length, actifId]);

  if (cartes.length === 0) return null;

  const choisir = (carte: CarteVivante) => {
    if (onChoisir) onChoisir(carte);
    else if (carte.to) navigate(carte.to);
  };

  return (
    <div className="w-full">
      <div className="mb-2.5 font-mono text-[9.5px] uppercase tracking-[0.22em] text-black/40">{libelle}</div>

      <div ref={piste} className="no-scrollbar -mx-1 flex items-center gap-4 overflow-x-auto px-1 py-3">
        {cartes.map((carte, i) => (
          <CarteVivanteUI
            key={carte.id}
            carte={carte}
            facteur={facteurs[i] ?? 0.5}
            aime={aime(carte.cle)}
            avis={compte(carte.cle)}
            joue={enLectureId === carte.id}
            onClic={() => choisir(carte)}
            onAimer={() => basculer(carte.cle)}
            onJouer={() => onJouer?.(carte)}
          />
        ))}
      </div>
    </div>
  );
}
