import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LIGNES_DU_TICKET } from '../lib/categoriesDuTicket';
import { PORTEFEUILLES, compteDesPortefeuilles, numeroDuTicket, totauxDuTicket } from '../lib/portefeuille';
import { budgetDuRêve, codeDepuis, CODE_DE_DÉMONSTRATION, rêveDécrit } from '../lib/codeDuMariage';
import { TICKET_COUPLE } from '../lib/superMariage';
import { heureDeLaCapsule } from '../lib/capsuleCommande';
import { formatDateLong } from '../lib/format';
import { estUnMarker, markerParId } from '../lib/lesMarkers';
import LeTicketPleinEcran from '../components/LeTicketPleinEcran';

/* LE SPÉCIALISTE DU TICKET DE CAISSE — **UN TICKET, ET C'EST TOUT**
 *
 * « En fait garde que le ticket du haut, c'est suffisant. » La page n'a plus de
 * bandes, plus de machine, plus de grille, plus de mini-site, plus de décors :
 * **il y a un papier**, il prend l'écran, et il se suffit à lui-même.
 *
 * ```txt
 *   ┌──────────────────────────────┐
 *   │       SUPER MARIAGE          │   le papier, et tout ce qu'il porte
 *   │  NUB-139 · CAISSE 3 · 23:00  │
 *   │  LA JOURNÉE   ●─── 22:00     │   on coche une ligne : elle passe au
 *   │  LA MUSIQUE   …              │   marker, et le total se refait
 *   │  TOTAL        41 320 €       │   on clique : le papier dit PAYÉ
 *   │  ▮▮▯▮▯▯▮▮▯  NUB-139          │
 *   │  ● ● ● ● ● ●   LE MARKER     │   sa couleur de marker
 *   └──────────────────────────────┘
 * ```
 *
 * **Deux gestes, et un réglage :** cocher une ligne, cliquer le total, choisir
 * sa couleur de marker. Rien d'autre n'est monté — et rien n'est détruit : les
 * autres morceaux (l'archive, l'atelier, le téléphone, le mini-site, la machine,
 * les bandes éditoriales) restent dans le dépôt, leurs fichiers intacts.
 *
 * L'adresse porte tout : `?code=` le mariage, `?coches=` ce qui est coché,
 * `?marker=` la couleur du fluo, `?reve=` le rêve dans les mots des mariés.
 * Le lien, c'est le ticket.
 */

/** Le caddie de l'adresse : ce qui est coché, dans l'ordre du catalogue. */
function cochesDeLAdresse(valeur: string | null): string[] {
  const demandées = (valeur ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  return LIGNES_DU_TICKET.filter((l) => demandées.includes(l.id)).map((l) => l.id);
}

/** Le rêve de l'adresse, dans les mots des mariés. */
function reveDeLAdresse(valeur: string | null): string {
  return valeur ?? '';
}

export default function LaCaisse() {
  const [params, setParams] = useSearchParams();

  /** **Le code du mariage** — une signature, pas une porte : il s'imprime en
   *  haut du ticket, et il part dans le lien (`?code=…`). */
  const code = codeDepuis(params.get('code') ?? '') ?? CODE_DE_DÉMONSTRATION;

  const [coches, setCoches] = useState<string[]>(() => cochesDeLAdresse(params.get('coches')));
  /** **Le rêve, dans les mots des mariés** : il vient de l'adresse (`?reve=`) —
   *  il n'y a plus de champ pour l'écrire, mais le lien le porte encore. */
  const [description] = useState(() => reveDeLAdresse(params.get('reve')));
  /** **Sa couleur de marker** : le seul réglage, et il vit dans l'adresse. */
  const [marker, setMarker] = useState(() => {
    const demandé = params.get('marker');
    return estUnMarker(demandé) ? demandé! : '';
  });
  /** **Le papier est payé** : le geste du total, et l'on peut le retirer. */
  const [payé, setPayé] = useState(() => params.get('paye') === '1');
  const [heure] = useState(() => Math.floor(heureDeLaCapsule()));

  const rêve = useMemo(() => rêveDécrit(description), [description]);
  const lignesCochées = useMemo(() => LIGNES_DU_TICKET.filter((l) => coches.includes(l.id)), [coches]);
  const totaux = totauxDuTicket(lignesCochées);
  const budget = budgetDuRêve(coches, rêve);
  const comptesDesPortefeuilles = useMemo(() => compteDesPortefeuilles(coches), [coches]);
  const portefeuilles = PORTEFEUILLES.map((p) => ({
    id: p.id,
    mot: p.mot,
    marque: p.marque,
    ...comptesDesPortefeuilles[p.id],
  }));
  const laCouleur = markerParId(marker);

  /* **L'adresse est la sortie, jamais l'entrée** : on n'y écrit que ce qu'on
     vient de faire, et le lien obtenu est le ticket. */
  useEffect(() => {
    const suite = new URLSearchParams(params);
    if (coches.length) suite.set('coches', coches.join(','));
    else suite.delete('coches');
    if (marker) suite.set('marker', marker);
    else suite.delete('marker');
    if (payé) suite.set('paye', '1');
    else suite.delete('paye');
    if (description.trim()) suite.set('reve', description);
    else suite.delete('reve');
    setParams(suite, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coches, marker, payé, description]);

  /** **On coche une ligne** : elle passe au marker, et le total se refait. */
  const cocher = (id: string) => setCoches((liste) => (liste.includes(id) ? liste.filter((x) => x !== id) : [...liste, id]));

  /** **On clique le total** : le papier dit `PAYÉ · MERCI` — et on peut revenir. */
  const basculerLePaiement = () => setPayé((p) => !p);

  return (
    <main
      data-page="ticket"
      data-code={code}
      data-cochees={coches.length}
      data-total={totaux.total}
      data-marker={laCouleur.id}
      style={{ ['--vp-fluo' as string]: laCouleur.couleur }}
      className="min-h-svh bg-white text-[color:var(--vp-ink)]"
    >
      {/* **IL N'Y A QUE LE TICKET.** « Garde que le ticket du haut, c'est
          suffisant » : le papier est la page, et l'on scrolle dedans. */}
      <LeTicketPleinEcran
        code={code}
        numero={numeroDuTicket(coches)}
        dateLabel={formatDateLong(TICKET_COUPLE.date)}
        heure={heure}
        couple={{ noms: TICKET_COUPLE.noms, lieu: TICKET_COUPLE.venue, convives: TICKET_COUPLE.convives }}
        coches={coches}
        surCocher={cocher}
        totaux={totaux}
        portefeuilles={portefeuilles}
        rêve={rêve}
        budget={budget}
        payé={payé}
        surPayer={basculerLePaiement}
        marker={laCouleur}
        surMarker={setMarker}
      />
    </main>
  );
}
