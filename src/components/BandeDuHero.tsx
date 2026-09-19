import { useCallback, useState } from 'react';
import type { CarteVivante } from '../lib/cartesVivantes';
import BandeauHero from './BandeauHero';
import LecteurHero from './LecteurHero';

/**
 * LA BANDE ET SON LECTEUR, D'UN SEUL BLOC
 *
 * Les pages posent ce composant en bas de leur hero : la bande de cartes
 * vivantes, et le lecteur qui prend le hero quand on lance une carte. Tout
 * l'état tient ici — le reste de la page n'a rien à savoir du média qui joue.
 *
 * Le lecteur est posé en absolu : la page le laisse dans son hero, et il
 * couvre le cadre, comme un plan qui démarre.
 */

interface BandeDuHeroProps {
  libelle: string;
  cartes: CarteVivante[];
  styleId: string;
  note?: string;
  onChoisir?: (carte: CarteVivante) => void;
}

export default function BandeDuHero({ libelle, cartes, styleId, note, onChoisir }: BandeDuHeroProps) {
  const [carte, setCarte] = useState<CarteVivante | null>(null);
  const [enLecture, setEnLecture] = useState(false);

  const jouer = useCallback(
    (c: CarteVivante) => {
      // La même carte : on met en pause ou on reprend. Une autre : elle prend
      // le hero, et l'ancienne se tait.
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
      <BandeauHero
        libelle={libelle}
        cartes={cartes}
        styleId={styleId}
        note={note}
        enLectureId={enLecture ? carte?.id ?? null : null}
        onJouer={jouer}
        onChoisir={onChoisir}
      />
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
