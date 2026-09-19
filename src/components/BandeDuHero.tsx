import { useCallback, useState } from 'react';
import type { CarteVivante } from '../lib/cartesVivantes';
import BandeauHero from './BandeauHero';
import LecteurHero from './LecteurHero';

/**
 * LA BANDE, SOUS LE HERO — ET LE LECTEUR DANS LE HERO
 *
 * Les pages posent ce composant juste après leur hero. La bande, sur fond
 * blanc, **remonte à moitié sur le hero** : les trois cartes se voient à
 * cheval sur le bas du visuel — elles sont sa continuité, pas une section de
 * plus — et la carte de la page est au milieu.
 *
 * Quand on lance une carte, **le média prend le hero** : le lecteur se pose
 * juste au-dessus de la bande, sur la hauteur d'un écran. La bande, elle, reste
 * devant, pour qu'on puisse relancer une autre carte sans fermer quoi que ce
 * soit. Tout l'état tient ici — la page n'a rien à savoir du média qui joue.
 */

interface BandeDuHeroProps {
  libelle: string;
  cartes: CarteVivante[];
  styleId: string;
  onChoisir?: (carte: CarteVivante) => void;
  /**
   * Le play fait autre chose que jouer : sur la bande des personnages, il
   * **entre** avec le rôle. Quand il est là, aucun lecteur ne s'ouvre.
   */
  onAction?: (carte: CarteVivante) => void;
  /** Le mot du play quand il n'entrouvre pas un média : « Entrer ». */
  libelleAction?: string;
  /** Vrai quand un média occupe le hero : la page peut retenir son défilé. */
  onLecture?: (enLecture: boolean) => void;
  /** Vrai pour la bande collée au hero : elle remonte à moitié dessus. */
  premiere?: boolean;
}

export default function BandeDuHero({
  libelle,
  cartes,
  styleId,
  onChoisir,
  onAction,
  libelleAction,
  onLecture,
  premiere = false,
}: BandeDuHeroProps) {
  const [carte, setCarte] = useState<CarteVivante | null>(null);
  const [enLecture, setEnLecture] = useState(false);

  const jouer = useCallback(
    (c: CarteVivante) => {
      // Le play n'ouvre pas un média : il fait l'action de la page (entrer).
      if (onAction) {
        onAction(c);
        return;
      }
      // La même carte : on met en pause ou on reprend. Une autre : elle prend
      // le hero, et l'ancienne se tait.
      if (carte?.id === c.id) {
        const suivant = !enLecture;
        setEnLecture(suivant);
        onLecture?.(suivant);
        return;
      }
      setCarte(c);
      setEnLecture(true);
      onLecture?.(true);
    },
    [carte, enLecture, onLecture, onAction],
  );

  const basculer = useCallback(() => {
    const suivant = !enLecture;
    setEnLecture(suivant);
    onLecture?.(suivant);
  }, [enLecture, onLecture]);

  return (
    <section
      className={`relative z-40 border-b border-black/5 bg-white pb-6 pt-5 sm:pb-8 sm:pt-6 ${
        premiere ? '-mt-32 sm:-mt-36' : ''
      }`}
    >
      {/* Le média prend le hero : le lecteur se pose au-dessus de la bande,
          sur la hauteur d'un écran. */}
      {carte && !onAction && (
        <LecteurHero
          carte={carte}
          enLecture={enLecture}
          onBasculer={basculer}
          onFermer={() => {
            setEnLecture(false);
            setCarte(null);
            onLecture?.(false);
          }}
        />
      )}

      <div className="relative z-40 vp-page">
        <BandeauHero
          libelle={libelle}
          cartes={cartes}
          styleId={styleId}
          enLectureId={enLecture ? carte?.id ?? null : null}
          onJouer={jouer}
          onChoisir={onChoisir}
          libelleAction={libelleAction}
        />
      </div>
    </section>
  );
}
