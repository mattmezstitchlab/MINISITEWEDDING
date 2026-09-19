import { useMemo } from 'react';
import { useSiteView } from './sections/context';
import TimelineBand from './TimelineBand';
import type { BandMoment } from './TimelineBand';
import { soundtrackOf } from '../lib/weddingSoundtrack';
import { formatDateLong, parseDate } from '../lib/format';

/**
 * La bande du bas sur le site du couple : les vrais moments du programme, avec
 * leur morceau, et le calendrier du mois.
 *
 * Toute la mécanique vit dans `TimelineBand` — la même bande sert à l'accueil.
 */
export default function WeddingDayBar() {
  const { data, site, accent, dark, muted, ink, daysLeft } = useSiteView();
  const programme = data.programme;

  const moments = useMemo<BandMoment[]>(() => {
    const soundtrack = soundtrackOf(programme);
    return programme.map((ev) => ({
      id: ev.id,
      time: ev.event_time,
      title: ev.title,
      detail: ev.description,
      place: ev.place,
      track: soundtrack.get(ev.id) ?? null,
    }));
  }, [programme]);

  const weddingDate = useMemo(() => parseDate(site.wedding_date), [site.wedding_date]);

  return (
    <TimelineBand
      moments={moments}
      title={formatDateLong(site.wedding_date)}
      subtitle={
        site.venue && site.city ? `${site.venue} · ${site.city}` : site.venue || site.city || undefined
      }
      pill={`${Math.max(0, daysLeft)} jours`}
      calendar={{ date: weddingDate, daysLeft }}
      dark={dark}
      accent={accent}
      ink={ink}
      muted={muted}
    />
  );
}
