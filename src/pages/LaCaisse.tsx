import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  LIGNES_DU_TICKET,
  catégorieDeLaLigne,
  compteParFamille,
  euros,
  type CatégorieDuTicket,
  type LigneDuTicket,
} from '../lib/categoriesDuTicket';
import {
  fileDeLaFamille,
  lAgentFaitPasser,
  motifDeLaLigne,
  motDeLaFamille,
  type FileDeLAgent,
} from '../lib/agentDuTicket';
import {
  PORTEFEUILLES,
  compteDesPortefeuilles,
  motDuPortefeuille,
  portefeuillesVisés,
  totauxDuTicket,
} from '../lib/portefeuille';
import { OBJETS_DE_LA_FABRIQUE } from '../lib/ripple';
import { heureDeLaCapsule } from '../lib/capsuleCommande';
import MachineDeRipple, {
  type DemandeEntendue,
  type PropositionDeLEcran,
  type SortieDeLaFente,
} from '../components/MachineDeRipple';

/* LE SPÉCIALISTE DU TICKET — LA MACHINE, ET RIEN D'AUTRE
 *
 * La page **ne défile pas** : elle tient dans un écran, comme une machine pose
 * sur un comptoir. Autour, **un fond blanc, aucun visuel, aucun texte** — tout
 * ce qui se lit est sur la machine.
 *
 * **Tout ce qui se coche arrive par l'écran de la machine.** On appuie sur une
 * famille — le jour J, votre site, les documents — ou on écrit ce qu'on veut
 * dans le champ du bas, et l'agent fait passer les lignes **une par une** :
 *
 * ```
 *   (LE JOUR J)  ← une famille : l'agent fait passer ses lignes, une par une
 *   ┌──────────────────────┐  (→)
 *   │ un dîner pour vingt  │  ← ou une demande : l'agent entend, et il trie
 *   └──────────────────────┘
 *
 *   ✓ on valide  →  la ligne monte sur le ticket, le papier sort de la fente
 *   ✗ on passe   →  l'agent passe à la suivante
 * ```
 *
 * Le bouton rond du **reçu** ouvre le ticket entier sur l'écran : c'est là qu'on
 * relit, ligne à ligne, et qu'on retire ce qu'on ne veut plus. Les six autres
 * objets du Ripple **marquent le papier** — tampon, timbre, carte, sticker.
 *
 * L'adresse reste le reçu (`?coches=…`), et elle porte aussi la demande
 * (`?demande=diner`) et l'écran (`?ecran=ticket`) : le lien dit tout.
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

export default function LaCaisse() {
  const [params, setParams] = useSearchParams();

  const [coches, setCoches] = useState<string[]>(() => cochesDeLAdresse(params.get('coches')));
  const [demande, setDemande] = useState<string>(() => (params.get('demande') ?? '').trim());
  const [file, setFile] = useState<FileDeLAgent | null>(() => {
    const texte = (params.get('demande') ?? '').trim();
    return texte ? lAgentFaitPasser(texte, cochesDeLAdresse(params.get('coches'))) : null;
  });
  const [rang, setRang] = useState(0);
  const [écran, setÉcran] = useState<'propositions' | 'ticket'>(() =>
    params.get('ecran') === 'ticket' ? 'ticket' : 'propositions',
  );
  const [marques, setMarques] = useState<string[]>([]);
  const [marche, setMarche] = useState<string | null>(null);
  const [vols, setVols] = useState<Vol[]>([]);
  const [presse, setPresse] = useState<{ cle: string; ligne: string } | null>(null);
  const [avis, setAvis] = useState<string | null>(null);
  const [heure] = useState(() => Math.floor(heureDeLaCapsule()));
  const passage = useRef(0);

  /* ————————————————————— LE CALCUL, ET L'ADRESSE ————————————————————— */

  const lignesCochées = useMemo(() => LIGNES_DU_TICKET.filter((l) => coches.includes(l.id)), [coches]);
  const totaux = totauxDuTicket(lignesCochées);
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
    if (demande) suite.set('demande', demande);
    else suite.delete('demande');
    if (écran === 'ticket') suite.set('ecran', 'ticket');
    else suite.delete('ecran');
    setParams(suite, { replace: true });
    // L'adresse est la sortie, jamais l'entrée : on ne suit que ce qu'on coche.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coches, demande, écran]);

  /* ——————————————— LE PAPIER QUI SORT, ET LE MOT DU GESTE ——————————————— */

  const faireSortir = (ligneId: string) => {
    passage.current += 1;
    const cle = `${ligneId}-${passage.current}`;
    setPresse({ cle, ligne: ligneId });
    const visés = portefeuillesVisés([ligneId]);
    setVols((v) => [...v, ...visés.map((p) => ({ cle: `${cle}-${p}`, portefeuille: p, rang: PORTEFEUILLES_RANGS[p] ?? 0 }))]);
    window.setTimeout(() => setPresse((p) => (p && p.cle === cle ? null : p)), 2600);
    window.setTimeout(() => setVols((v) => v.filter((x) => !x.cle.startsWith(cle))), 1100);
  };

  const unMot = (texte: string) => {
    setMarche(texte);
    window.setTimeout(() => setMarche((m) => (m === texte ? null : m)), 2600);
  };

  const unAvis = (texte: string) => {
    setAvis(texte);
    window.setTimeout(() => setAvis(null), 2400);
  };

  /* ——————————————— L'AGENT : LA FILE DES PROPOSITIONS ——————————————— */

  /** On remet une file à l'écran : c'est le seul geste qui change le propos. */
  const fairePasser = (propositions: LigneDuTicket[], texte: string, entendue: FileDeLAgent | null) => {
    setFile({ lignes: propositions, mots: entendue?.mots ?? [], àVide: entendue?.àVide ?? false });
    setRang(0);
    setDemande(texte);
    setÉcran('propositions');
  };

  const parFamille = (groupe: CatégorieDuTicket['groupe']) => {
    fairePasser(fileDeLaFamille(groupe, coches), '', null);
    unMot(`${motDeLaFamille(groupe)} — l’agent fait passer`);
  };

  const parDemande = (texte: string) => {
    const entendue = lAgentFaitPasser(texte, coches);
    fairePasser(entendue.lignes, texte, entendue);
    unMot(entendue.àVide ? 'rien de tel — je fais passer tout' : `entendu : ${entendue.mots.join(' · ')}`);
  };

  /* ——————————————— VALIDER, PASSER, ET LE RESTE ——————————————— */

  const prendre = (id: string) => {
    if (coches.includes(id)) return;
    setCoches([...coches, id]);
    faireSortir(id);
  };

  const retirer = (id: string) => {
    setCoches(coches.filter((c) => c !== id));
    unMot('ligne retirée du ticket');
  };

  const surValider = () => {
    if (écran === 'ticket') {
      setÉcran('propositions');
      unMot('retour aux propositions');
      return;
    }
    const proposée = file?.lignes[rang];
    if (!proposée) return;
    prendre(proposée.id);
    unMot(`${proposée.label} — sur le ticket`);
    setRang(rang + 1);
  };

  const surPasser = () => {
    if (écran === 'ticket') {
      setCoches([]);
      unMot('ticket vidé');
      return;
    }
    const proposée = file?.lignes[rang];
    if (!proposée) return;
    unMot(`${proposée.label} — laissée de côté`);
    setRang(rang + 1);
  };

  /** Les boutons ronds : le reçu ouvre le ticket, les autres marquent le papier. */
  const poserUnObjet = (id: string) => {
    const objet = OBJETS_DE_LA_FABRIQUE.find((o) => o.id === id);
    if (!objet) return;
    if (id === 'ticket-caisse') {
      const ouvert = écran === 'ticket';
      setÉcran(ouvert ? 'propositions' : 'ticket');
      unMot(ouvert ? 'retour aux propositions' : 'le ticket, entier');
      return;
    }
    const posée = marques.includes(id);
    setMarques(posée ? marques.filter((m) => m !== id) : [...marques, id]);
    unMot(posée ? `${objet.nom} — retiré` : `${objet.nom} — ${objet.sens}`);
  };

  /* ——————————————— CE QUE L'ÉCRAN MONTRE MAINTENANT ——————————————— */

  const ligneCourante: LigneDuTicket | null = file ? (file.lignes[rang] ?? null) : null;
  const proposition: PropositionDeLEcran | null = ligneCourante
    ? {
        ligne: ligneCourante,
        motif: file && file.mots.length > 0 ? motifDeLaLigne(ligneCourante, file.mots) : null,
        rang: rang + 1,
        taille: file?.lignes.length ?? 1,
        groupe: catégorieDeLaLigne(ligneCourante.id)?.groupe ?? 'jour',
        catégorie: catégorieDeLaLigne(ligneCourante.id)?.mot ?? '',
      }
    : null;

  const demandeEntendue: DemandeEntendue | null = demande
    ? { texte: demande, mots: file?.mots ?? [], àVide: Boolean(file?.àVide) }
    : null;

  const ligneSortie = presse
    ? (lignesCochées.find((l) => l.id === presse.ligne) ?? LIGNES_DU_TICKET.find((l) => l.id === presse.ligne))
    : undefined;
  const sortie: SortieDeLaFente | null = ligneSortie
    ? {
        label: ligneSortie.label,
        prix: ligneSortie.incluse ? 'inclus' : euros(ligneSortie.prix * (ligneSortie.quantite ?? 1)),
        vers: ligneSortie.vers.map((p) => motDuPortefeuille(p)).join(' · '),
      }
    : null;

  return (
    <div
      data-page="ticket"
      data-cochees={coches.length}
      data-total={totaux.total}
      data-écran={écran}
      data-demande={demande}
      className="grid h-svh w-full place-items-center overflow-hidden bg-white px-3 py-4"
    >
      <div className="relative flex w-full flex-col items-center">
        <MachineDeRipple
          heure={heure}
          lignes={coches.length}
          total={totaux.total}
          écran={écran}
          proposition={proposition}
          finie={file !== null && rang >= file.lignes.length}
          demande={demandeEntendue}
          ticket={lignesCochées}
          portefeuilles={portefeuilles}
          prises={prises}
          marche={marche}
          sortie={sortie}
          marques={marques}
          onValider={surValider}
          onPasser={surPasser}
          onFamille={parFamille}
          onObjet={poserUnObjet}
          onDemande={parDemande}
          onRetirer={retirer}
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
