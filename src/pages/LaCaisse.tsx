import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LIGNES_DU_TICKET, compteParFamille, euros, type LigneDuTicket } from '../lib/categoriesDuTicket';
import {
  basculerLeTicket,
  demandeDeLÉtat,
  étatInitial,
  écrireLaDemande,
  ouvrirLaFamille,
  passer,
  propositionDeLÉtat,
  retirer,
  valider,
  type ÉtatDeLaMachine,
  type Geste,
} from '../lib/machineDuTicket';
import {
  PORTEFEUILLES,
  compteDesPortefeuilles,
  motDuPortefeuille,
  portefeuillesVisés,
  totauxDuTicket,
} from '../lib/portefeuille';
import { OBJETS_DE_LA_FABRIQUE, papierDeLObjet } from '../lib/ripple';
import { heureDeLaCapsule } from '../lib/capsuleCommande';
import MachineDeRipple, { type SortieDeLaFente } from '../components/MachineDeRipple';

/* LE SPÉCIALISTE DU TICKET — LA MACHINE, ET RIEN D'AUTRE
 *
 * La page **ne défile pas** : elle tient dans un écran, comme une machine posée
 * sur un comptoir. Autour, **un fond blanc, aucun visuel, aucun texte**.
 *
 * **La machine propose toujours quelque chose, et les deux touches font toujours
 * quelque chose** — c'est la règle du module `machineDuTicket` :
 *
 * 1. **elle propose une famille** — « LE JOUR J, ce qui a un prix, 48 lignes ».
 *    ✓ la passe en revue ; ✗ propose la suivante ;
 * 2. **elle passe les lignes, une par une** — ✓ la prend (le papier sort de la
 *    fente et part vers ses portefeuilles), ✗ la laisse ;
 * 3. **le reçu** ouvre le ticket entier sur l'écran : ✓ revient aux
 *    propositions, ✗ vide le ticket.
 *
 * On peut aussi **écrire ce qu'on veut** dans le champ : l'agent entend, trie le
 * catalogue par mots, et fait passer ce qui répond. S'il ne trouve rien, il ne
 * déroule pas les 99 lignes : il le dit, et il repropose les familles.
 *
 * Les **six objets du Ripple** hors le reçu ne sont pas décoratifs : chacun
 * **sort un papier de la fente** — « LE TAMPON · la marque qui valide, à l'encre
 * du jour » — et reste posé sur le ticket.
 *
 * Cette page ne fait plus que deux choses : **le calcul et les effets** — le
 * papier, le vol vers les portefeuilles, l'adresse. Le reste est dans les
 * modules, et testé sans navigateur.
 */

/** Le caddie de l'adresse : ce qui est coché, dans l'ordre du catalogue. */
function cochesDeLAdresse(valeur: string | null): string[] {
  const demandées = (valeur ?? '').split(',').map((id) => id.trim()).filter(Boolean);
  return LIGNES_DU_TICKET.filter((l) => demandées.includes(l.id)).map((l) => l.id);
}

/** Le rang d'un portefeuille — il décide de la trajectoire du vol. */
const PORTEFEUILLES_RANGS: Record<string, number> = { couple: 0, invites: 1, famille: 2, dj: 3, metier: 4 };

/** Un vol : un papier qui part de la fente vers un portefeuille. */
interface Vol {
  cle: string;
  portefeuille: string;
  rang: number;
}

/** Un papier qui sort de la fente, et ce qu'il emporte. */
interface Papier {
  cle: string;
  sortie: SortieDeLaFente;
}

export default function LaCaisse() {
  const [params, setParams] = useSearchParams();

  /** **Tout l'état de la machine** — et rien d'autre. */
  const [état, setÉtat] = useState<ÉtatDeLaMachine>(() =>
    étatInitial({
      coches: cochesDeLAdresse(params.get('coches')),
      demande: params.get('demande') ?? '',
      écran: params.get('ecran') === 'ticket' ? 'ticket' : 'propositions',
    }),
  );

  const [marques, setMarques] = useState<string[]>([]);
  const [marche, setMarche] = useState<string | null>(null);
  const [papier, setPapier] = useState<Papier | null>(null);
  const [vols, setVols] = useState<Vol[]>([]);
  const [avis, setAvis] = useState<string | null>(null);
  const [heure] = useState(() => Math.floor(heureDeLaCapsule()));
  const passage = useRef(0);

  const coches = état.coches;

  /* ————————————————————— LE CALCUL, ET L'ADRESSE ————————————————————— */

  const lignesCochées = useMemo(() => LIGNES_DU_TICKET.filter((l) => coches.includes(l.id)), [coches]);
  const totaux = totauxDuTicket(lignesCochées);
  /** Ce qui est pris, famille par famille — c'est le compte des boutons ronds. */
  const prises = compteParFamille(coches);
  const comptesDesPortefeuilles = useMemo(() => compteDesPortefeuilles(coches), [coches]);
  const portefeuilles = PORTEFEUILLES.map((p) => ({
    id: p.id,
    mot: p.mot,
    marque: p.marque,
    ...comptesDesPortefeuilles[p.id],
  }));

  useEffect(() => {
    const suite = new URLSearchParams(params);
    if (coches.length) suite.set('coches', coches.join(','));
    else suite.delete('coches');
    if (état.demande) suite.set('demande', état.demande);
    else suite.delete('demande');
    if (état.écran === 'ticket') suite.set('ecran', 'ticket');
    else suite.delete('ecran');
    setParams(suite, { replace: true });
    // L'adresse est la sortie, jamais l'entrée : on ne suit que ce qu'on coche.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coches, état.demande, état.écran]);

  /* ——————————————— LE PAPIER QUI SORT, ET LE MOT DU GESTE ——————————————— */

  const unMot = (texte: string) => {
    setMarche(texte);
    window.setTimeout(() => setMarche((m) => (m === texte ? null : m)), 2600);
  };

  const unAvis = (texte: string) => {
    setAvis(texte);
    window.setTimeout(() => setAvis(null), 2400);
  };

  /** Le papier d'une ligne : son nom, son prix, et à qui elle part. */
  const papierDuneLigne = (ligne: LigneDuTicket): SortieDeLaFente => ({
    label: ligne.label,
    prix: ligne.incluse ? 'inclus' : euros(ligne.prix * (ligne.quantite ?? 1)),
    sous: ligne.vers.map((p) => motDuPortefeuille(p)).join(' · '),
  });

  /** Une ligne validée : le papier sort de la fente, et il part vers ses portefeuilles. */
  const faireSortir = (ligne: LigneDuTicket) => {
    passage.current += 1;
    const cle = `${ligne.id}-${passage.current}`;
    setPapier({ cle, sortie: papierDuneLigne(ligne) });
    const visés = portefeuillesVisés([ligne.id]);
    setVols((v) => [...v, ...visés.map((p) => ({ cle: `${cle}-${p}`, portefeuille: p, rang: PORTEFEUILLES_RANGS[p] ?? 0 }))]);
    window.setTimeout(() => setPapier((p) => (p && p.cle === cle ? null : p)), 2600);
    window.setTimeout(() => setVols((v) => v.filter((x) => !x.cle.startsWith(cle))), 1100);
  };

  /** Un objet du Ripple : il sort son papier de la fente — c'est sa preuve. */
  const sortirLaMarque = (id: string) => {
    const objet = OBJETS_DE_LA_FABRIQUE.find((o) => o.id === id);
    if (!objet) return;
    passage.current += 1;
    const cle = `${id}-${passage.current}`;
    setPapier({ cle, sortie: papierDeLObjet(objet) });
    window.setTimeout(() => setPapier((p) => (p && p.cle === cle ? null : p)), 2600);
  };

  /* ——————————————— UN GESTE : L'ÉTAT CHANGE, ET LE PAPIER SUIT ——————————————— */

  /** Chaque geste rend un nouvel état, un mot pour l'écran, et parfois un papier. */
  const geste = (suivant: Geste) => {
    setÉtat(suivant.état);
    if (suivant.mot) unMot(suivant.mot);
    if (suivant.pris) {
      const ligne = LIGNES_DU_TICKET.find((l) => l.id === suivant.pris);
      if (ligne) faireSortir(ligne);
    }
  };

  const poserUnObjet = (id: string) => {
    const objet = OBJETS_DE_LA_FABRIQUE.find((o) => o.id === id);
    if (!objet) return;
    if (id === 'ticket-caisse') {
      geste(basculerLeTicket(état));
      return;
    }
    const posée = marques.includes(id);
    setMarques(posée ? marques.filter((m) => m !== id) : [...marques, id]);
    if (posée) unMot(`${objet.nom} — retiré`);
    else {
      sortirLaMarque(id);
      unMot(`${objet.nom} — ${objet.sens}`);
    }
  };

  return (
    <div
      data-page="ticket"
      data-cochees={coches.length}
      data-total={totaux.total}
      data-écran={état.écran}
      data-demande={état.demande}
      className="grid h-svh w-full place-items-center overflow-hidden bg-white px-3 py-4"
    >
      <div className="relative flex w-full flex-col items-center">
        <MachineDeRipple
          heure={heure}
          lignes={coches.length}
          total={totaux.total}
          écran={état.écran}
          proposition={propositionDeLÉtat(état)}
          demande={demandeDeLÉtat(état)}
          ticket={lignesCochées}
          marques={marques}
          portefeuilles={portefeuilles}
          prises={prises}
          marche={marche}
          sortie={papier?.sortie ?? null}
          onValider={() => geste(valider(état))}
          onPasser={() => geste(passer(état))}
          onFamille={(groupe) => geste(ouvrirLaFamille(état, groupe))}
          onObjet={poserUnObjet}
          onDemande={(texte) => geste(écrireLaDemande(état, texte))}
          onRetirer={(id) => geste(retirer(état, id))}
          onEmporter={() => {
            const adresse = `${window.location.origin}${window.location.pathname}?coches=${coches.join(',')}`;
            void navigator.clipboard?.writeText(adresse);
            unAvis(`${coches.length} lignes · le reçu est dans le lien`);
          }}
        />

        {/* Les vols : le papier part de la fente vers son portefeuille. */}
        {vols.map((vol) => (
          <span
            key={vol.cle}
            data-vol={vol.portefeuille}
            className="vol-du-ticket pointer-events-none absolute left-1/2 top-[58%] z-30 h-12 w-[180px] -translate-x-1/2 border border-black/15 bg-[#FFFEF7]"
            style={{ ['--vol' as string]: String(vol.rang) }}
          />
        ))}
      </div>

      {avis && (
        <span
          data-avis="ticket"
          className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full border border-black/10 bg-black/85 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/85"
        >
          {avis}
        </span>
      )}
    </div>
  );
}
