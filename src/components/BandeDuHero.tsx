import { useCallback, useState } from 'react';
import type { CarteVivante } from '../lib/cartesVivantes';
import BandeauHero from './BandeauHero';
import LecteurHero from './LecteurHero';

/**
 * LA BANDE, SOUS LE HERO
 *
 * Les pages posent ce composant juste après leur hero : la bande de navigation
 * sur fond blanc, puis le lecteur, qui prend le cadre quand on lance une carte.
 * Tout l'état tient ici — le reste de la page n'a rien à savoir du média qui
 * joue.
 */

interface BandeDuHeroProps {
  libelle: string;
  cartes: CarteVivante[];
  styleId: string;
  onChoisir?: (carte: CarteVivante) => void;
}

export default function BandeDuHero({ libelle, cartes, styleId, onChoisir }: BandeDuHeroProps) {
  const [carte, setCarte] = useState<CarteVivante | null>(null);
  const [enLecture, setEnLecture] = useState(false);

  const jouer = useCallback(
    (c: CarteVivante) => {
      // La même carte : on met en pause ou on reprend. Une autre : elle prend
      // le cadre, et l'ancienne se tait.
      if (carte?.id === c.id) {
        setEnLecture((v) => !v);
        return;
      }
      setCarte(c);
      setEnLecture(true);
    },
    [carte],
  );

  return (
    <>
      <section className="border-b border-black/5 bg-white py-6 sm:py-8">
        <div className="vp-page">
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

      {carte && (
        <LecteurHero
          carte={carte}
          enLecture={enLecture}
          onBasculer={() => setEnLecture((v) => !v)}
          onFermer={() => {
            setEnLecture(false);
            setCarte(null);
          }}
        />
      )}
    </>
  );
}
