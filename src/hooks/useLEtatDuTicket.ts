import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LIGNES_DU_TICKET, type LigneDuTicket } from '../lib/categoriesDuTicket';
import { PORTEFEUILLES, compteDesPortefeuilles, numeroDuTicket, totauxDuTicket } from '../lib/portefeuille';
import { budgetDuRêve, codeDepuis, CODE_DE_DÉMONSTRATION, rêveDécrit } from '../lib/codeDuMariage';
import { TICKET_COUPLE } from '../lib/superMariage';
import { formatDateLong } from '../lib/format';
import { heureDeLaCapsule } from '../lib/capsuleCommande';
import { estUnMarker, markerParId } from '../lib/lesMarkers';
import { PAS_DE_LA_FRAPPE, mettreEnFile, unPasDeLaFrappe, type LigneDeLaFile } from '../lib/laFrappe';
import {
  lApportDesOpérations,
  lesOpérationsDuCode,
  lesOpérationsEnCode,
  type LOpération,
} from '../lib/lesOpérations';
import { leCodeDuTicket } from '../lib/leCodeDuTicket';
import { estUneFace, type FaceDuTicket } from '../lib/lesFacesDuTicket';

/* L'ÉTAT DU TICKET — UN SEUL ÉTAT, POUR LA LANDING ET POUR LE PAPIER
 *
 * Le ticket ne se suffit pas d'un composant : il a un **état** — le mariage, ce
 * qui est pris, la couleur du marker, la face qu'on regarde, les opérations, la
 * file de la frappe, et les mots du mariage (les prénoms, la ville, les
 * invités). Cet état vit ici, une fois, et **les deux pages le partagent** :
 *
 * - `LaCaisse` (`/ticket`) montre le papier, et rien qu'ici ;
 * - `LaLanding` (`/`) présente le papier, et **l'éditeur** qui le configure.
 *
 * L'adresse reste la sortie, jamais l'entrée : on y écrit ce qu'on vient de
 * faire (`?code=`, `?coches=`, `?marker=`, `?reve=`, `?qui=`, `?lieu=`,
 * `?invites=`, `?op=`, `?vue=`), et le lien obtenu, c'est le ticket.
 */

/** Le caddie de l'adresse : ce qui est coché, dans l'ordre du catalogue. */
function cochesDeLAdresse(valeur: string | null): string[] {
  const demandées = (valeur ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  return LIGNES_DU_TICKET.filter((l) => demandées.includes(l.id)).map((l) => l.id);
}

/** Un mot de l'adresse, ou celui d'origine — jamais du vide. */
function motDeLAdresse(valeur: string | null, origine: string): string {
  const mot = (valeur ?? '').trim();
  return mot || origine;
}

export function useLEtatDuTicket() {
  const [params, setParams] = useSearchParams();

  /** **Le code du mariage** — une signature, pas une porte : il s'imprime en
   *  haut du ticket, et il part dans le lien (`?code=…`). L'éditeur le change. */
  const [code, setCode] = useState(() => codeDepuis(params.get('code') ?? '') ?? CODE_DE_DÉMONSTRATION);

  const [coches, setCoches] = useState<string[]>(() => cochesDeLAdresse(params.get('coches')));
  /** **Le rêve, dans les mots des mariés** (`?reve=`) — l'éditeur l'écrit. */
  const [description, setDescription] = useState(() => params.get('reve') ?? '');
  /** **Sa couleur de marker** : le réglage, et il vit dans l'adresse. */
  const [marker, setMarker] = useState(() => {
    const demandé = params.get('marker');
    return estUnMarker(demandé) ? demandé! : '';
  });
  /** **Le papier est payé** : le geste du total, et l'on peut le retirer. */
  const [payé, setPayé] = useState(() => params.get('paye') === '1');
  const [heure] = useState(() => Math.floor(heureDeLaCapsule()));
  /** **La file de la génération** : ce que l'agent a fait venir, et qu'on écrit. */
  const [file, setFile] = useState<LigneDeLaFile[]>([]);
  /** **La lettre en cours**, sur la ligne de tête : c'est la frappe. */
  const [pas, setPas] = useState(0);
  /** **De quel côté on lit le papier** : le nôtre, ou celui du client. */
  const [face, setFace] = useState<FaceDuTicket>(() =>
    estUneFace(params.get('vue') ?? '') && params.get('vue') === 'client' ? 'client' : 'emetteur',
  );
  /** **Les opérations** : ce qui est arrivé après coup, et qui se pose sur le papier. */
  const [opérations, setOpérations] = useState<LOpération[]>(() => lesOpérationsDuCode(params.get('op') ?? ''));
  /** **Les mots du mariage** : les prénoms, la ville, les invités. */
  const [noms, setNoms] = useState(() => motDeLAdresse(params.get('qui'), TICKET_COUPLE.noms));
  const [lieu, setLieu] = useState(() => motDeLAdresse(params.get('lieu'), TICKET_COUPLE.venue));
  const [invités, setInvités] = useState(() => {
    const nombre = Number(params.get('invites'));
    return Number.isFinite(nombre) && nombre > 0 ? Math.floor(nombre) : TICKET_COUPLE.convives;
  });

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
  /** **Ce que les opérations ajoutent** : ça arrive sur le papier, et ça compte. */
  const apport = lApportDesOpérations(opérations);
  const total = totaux.total + apport;
  const couple = { noms, lieu, convives: invités };

  /* **L'adresse est la sortie, jamais l'entrée.** */
  useEffect(() => {
    const suite = new URLSearchParams(params);
    suite.set('code', code);
    if (coches.length) suite.set('coches', coches.join(','));
    else suite.delete('coches');
    if (marker) suite.set('marker', marker);
    else suite.delete('marker');
    if (payé) suite.set('paye', '1');
    else suite.delete('paye');
    if (description.trim()) suite.set('reve', description);
    else suite.delete('reve');
    if (face === 'client') suite.set('vue', 'client');
    else suite.delete('vue');
    if (opérations.length) suite.set('op', lesOpérationsEnCode(opérations));
    else suite.delete('op');
    if (noms !== TICKET_COUPLE.noms) suite.set('qui', noms);
    else suite.delete('qui');
    if (lieu !== TICKET_COUPLE.venue) suite.set('lieu', lieu);
    else suite.delete('lieu');
    if (invités !== TICKET_COUPLE.convives) suite.set('invites', String(invités));
    else suite.delete('invites');
    setParams(suite, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, coches, marker, payé, description, face, opérations, noms, lieu, invités]);

  /* ————————————————— LA GÉNÉRATION : LE PAPIER ÉCRIT LETTRE PAR LETTRE —————————————————
     « Tout se saisit lettre par lettre pendant la génération. » La ligne de tête
     de la file s'écrit sur le papier ; quand elle est entière, elle entre dans le
     ticket (elle s'y coche, au marker) et la suivante prend la main. */

  const ligneEnCours = file[0] ?? null;

  useEffect(() => {
    if (!ligneEnCours) return;
    const minuteur = window.setTimeout(() => {
      const après = unPasDeLaFrappe(file, pas);
      setFile(après.file);
      setPas(après.pas);
      // La ligne est écrite en entier : elle entre sur le ticket, au marker.
      if (après.écrite) setCoches((liste) => (liste.includes(après.écrite!) ? liste : [...liste, après.écrite!]));
    }, PAS_DE_LA_FRAPPE);
    return () => window.clearTimeout(minuteur);
  }, [file, pas, ligneEnCours]);

  /** **Ce que le champ a fait venir** : on le met en file, sans doublon. */
  const recevoirLaGénération = (lignes: LigneDuTicket[]) => {
    setFile((suite) => mettreEnFile(suite, coches, lignes.map((l) => ({ id: l.id, mot: l.label }))));
  };

  /** **Une opération arrive sur le ticket** : elle s'y ajoute, et y reste. */
  const recevoirLOpération = (opération: LOpération) =>
    setOpérations((liste) => [...liste, { ...opération, id: `op-${liste.length + 1}` }]);

  /** **On coche une ligne** : elle passe au marker, et le total se refait. */
  const cocher = (id: string) =>
    setCoches((liste) => (liste.includes(id) ? liste.filter((x) => x !== id) : [...liste, id]));

  /** **On clique le total** : le papier dit `PAYÉ · MERCI` — et on peut revenir. */
  const basculerLePaiement = () => setPayé((p) => !p);

  return {
    // l'état
    code,
    coches,
    marker,
    laCouleur,
    payé,
    face,
    opérations,
    description,
    noms,
    lieu,
    invités,
    couple,
    file,
    pas,
    ligneEnCours,
    // ce qui s'en déduit
    rêve,
    totaux,
    total,
    apport,
    budget,
    portefeuilles,
    numero: numeroDuTicket(coches),
    dateLabel: formatDateLong(TICKET_COUPLE.date),
    heure,
    signature: leCodeDuTicket({ code, coches, marker: laCouleur.id, face, payé, opérations }),
    // les gestes
    setCode,
    cocher,
    basculerLePaiement,
    setMarker,
    setFace,
    setDescription,
    setNoms,
    setLieu,
    setInvités,
    recevoirLaGénération,
    recevoirLOpération,
    /** **Remplacer tout le ticket d'un coup** — l'éditeur s'en sert. */
    ajouterDesLignes: (lignes: string[]) =>
      setCoches((liste) => {
        const àVenir = lignes.filter((id) => LIGNES_DU_TICKET.some((l) => l.id === id));
        return [...liste, ...àVenir.filter((id) => !liste.includes(id))];
      }),
  };
}

export type LÉtatDuTicket = ReturnType<typeof useLEtatDuTicket>;
