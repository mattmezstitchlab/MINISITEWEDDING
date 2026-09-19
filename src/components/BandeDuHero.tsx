import { useCallback, useState } from 'react';
import type { CarteVivante } from '../lib/cartesVivantes';
import BandeauHero from './BandeauHero';
import LecteurHero from './LecteurHero';

/**
 * LA BANDE, SOUS LE HERO — ET LE LECTEUR DANS LE HERO
 *
 * Les pages posent ce composant juste après leur hero. La bande, sur fond
 * blanc, **remonte un peu sur le hero** — elle est sa continuité, pas une
 * section de plus — et la carte de la page y est centrée.
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
  /** Vrai quand un média occupe le hero : la page peut retenir son défilé. */
  onLecture?: (enLecture: boolean) => void;
}

export default function BandeDuHero({
  libelle,
  cartes,
  styleId,
  onChoisir,
  onLecture,
}: BandeDuHeroProps) {
  const [carte, setCarte] = useState<CarteVivante | null>(null);
  const [enLecture, setEnLecture] = useState(false);

  const jouer = useCallback(
    (c: CarteVivante) => {
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
    [carte, enLecture, onLecture],
  );

  const basculer = useCallback(() => {
    const suivant = !enLecture;
    setEnLecture(suivant);
    onLecture?.(suivant);
  }, [enLecture, onLecture]);

  return (
    <section className="relative z-40 -mt-14 border-b border-black/5 bg-white pb-6 pt-5 sm:-mt-16 sm:pb-8 sm:pt-6">
      {/* Le média prend le hero : le lecteur se pose au-dessus de la bande,
          sur la hauteur d'un écran. */}
      {carte && (
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
        />
      </div>
    </section>
  );
}
