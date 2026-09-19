import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAvis } from '../lib/avis';
import type { CarteVivante } from '../lib/cartesVivantes';
import CarteVivanteUI from './CarteVivante';

/**
 * LA BANDE DU HERO — LES CARTES VIVANTES
 *
 * Le hero de chaque page se termine par la même bande : des cartes musicales
 * qu'on fait défiler, **qui grossissent au centre** comme dans la section
 * playlist, et qui portent les deux gestes du site — le cœur (le nombre de
 * personnes qui aiment) et le play (le média qui s'enclenche dans le hero).
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
  /** Le petit mot de droite, à la place du compte par défaut. */
  note?: string;
}

export default function BandeauHero({
  libelle,
  cartes,
  styleId,
  enLectureId = null,
  onJouer,
  onChoisir,
  note,
}: BandeauHeroProps) {
  const navigate = useNavigate();
  const { compte, aime, basculer } = useAvis(styleId);
  const piste = useRef<HTMLDivElement | null>(null);
  /** La place de chaque carte dans la bande : 0 au bord, 1 au centre. */
  const [facteurs, setFacteurs] = useState<number[]>([]);

  /** Le grossissement : la carte la plus proche du centre est la plus grande. */
  useEffect(() => {
    const conteneur = piste.current;
    if (!conteneur) return;
    const mesurer = () => {
      const cadre = conteneur.getBoundingClientRect();
      const centre = cadre.left + cadre.width / 2;
      const cartes2 = Array.from(conteneur.children) as HTMLElement[];
      setFacteurs(
        cartes2.map((el) => {
          const r = el.getBoundingClientRect();
          const distance = Math.abs(r.left + r.width / 2 - centre);
          const portee = cadre.width / 2 + r.width / 2;
          return Math.max(0, Math.min(1, 1 - distance / portee));
        }),
      );
    };
    mesurer();
    const frame = requestAnimationFrame(mesurer);
    conteneur.addEventListener('scroll', mesurer, { passive: true });
    window.addEventListener('resize', mesurer);
    return () => {
      cancelAnimationFrame(frame);
      conteneur.removeEventListener('scroll', mesurer);
      window.removeEventListener('resize', mesurer);
    };
  }, [cartes.length]);

  if (cartes.length === 0) return null;

  const choisir = (carte: CarteVivante) => {
    if (onChoisir) onChoisir(carte);
    else if (carte.to) navigate(carte.to);
  };

  return (
    <div className="w-full">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-white/60">{libelle}</span>
        <span className="hidden font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/40 sm:inline">
          {note ?? `${cartes.length} · faites défiler`}
        </span>
      </div>

      <div ref={piste} className="no-scrollbar -mx-1 flex items-end gap-3.5 overflow-x-auto px-1 pb-3 pt-2">
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
