import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LIGNES_DU_TICKET, compteParCatégorie, euros, type LigneDuTicket } from '../lib/categoriesDuTicket';
import {
  basculerLeTicket,
  étatInitial,
  type ÉtatDeLaMachine,
  type Geste,
} from '../lib/machineDuTicket';
import {
  PORTEFEUILLES,
  compteDesPortefeuilles,
  motDuPortefeuille,
  portefeuillesDesCoches,
  totauxDuTicket,
} from '../lib/portefeuille';
import { OBJETS_DE_LA_FABRIQUE, papierDeLObjet } from '../lib/ripple';
import {
  budgetDuRêve,
  codeDepuis,
  CODE_DE_DÉMONSTRATION,
  LE_RÊVE,
  ligneImprimée,
  OBJETS_IMPRIMÉS,
  rêveDécrit,
  stickerDe,
  type Sticker,
} from '../lib/codeDuMariage';
import { CATÉGORIES_DU_TICKET, GROUPES_DU_TICKET, lignesDuneCatégorie } from '../lib/categoriesDuTicket';
import { MAGASIN, TICKET_COUPLE } from '../lib/superMariage';
import { heureDeLaCapsule } from '../lib/capsuleCommande';
import { lumiereDeLHeure } from '../lib/lumiereDuJour';
import { magazineDeLaDate } from '../lib/semaines';
import { visuelsDuJour } from '../lib/visuelsDuMagazine';
import { formatDateLong } from '../lib/format';
import CadranDuMagazine from '../components/CadranDuMagazine';
import LeTicketPleinEcran from '../components/LeTicketPleinEcran';
import LaCouvertureArchive from '../components/LaCouvertureArchive';
import { marqueDuTampon } from '../lib/marquesDuTicket';
import { type SortieDeLaFente } from '../components/MachineDeRipple';
import TicketCaisse from '../components/TicketCaisse';
import AppareilDuMariage from '../components/AppareilDuMariage';
import MiniSiteDuMariage from '../components/MiniSiteDuMariage';
import {
  BarreDeLAime,
  LePied,
  LeTitre,
  LesFormules,
  LesGestes,
  LesHeros,
  LesQuestions,
  LesTroisFamilles,
} from '../components/LesBandesDeLAime';
import { LE_SPÉCIALISTE } from '../lib/bandesDeLAime';
import { composerLeMiniSiteDeMariage } from '../lib/miniSiteDuMariage';

/* LE SPÉCIALISTE DU TICKET DE CAISSE — LA PAGE D'ENTRÉE
 *
 * On arrive **directement** : plus de porte, plus rien à saisir (le 21 septembre,
 * « supprime le bloc avec le code, je l'ai même pas »). `?code=A7K-241` ne
 * demande rien — c'est la signature du mariage, celle qui part dans le lien.
 *
 * La page se lit par bandes, dans cet ordre :
 *
 * 1. **la machine de Ripple**, seule sur un fond blanc — l'entrée du produit :
 *    elle propose, on valide, le papier sort de la fente ;
 * 2. **le visuel du jour** — l'image du couple, les infos dessus ;
 * 3. **le titre** — « Tout le mariage, sur un seul ticket. », et la couverture ;
 * 4. **les quatre catégories** — quatre héros : une image, le titre dessus, et
 *    le chemin de ce qu'il y a dedans. C'est l'arborescence, en images ;
 * 5. **l'appareil** — le ticket, le budget du rêve, les objets, les stickers :
 *    « le spécialiste du ticket de caisse » écrit au début du papier ;
 * 6. **le programme**, les trois familles, les 99 lignes, le ticket entier, les
 *    portefeuilles, l'addition, les questions, le pied.
 *
 * La cible est dite une fois, et tient tout : **un mariage fait d'économies pour
 * se payer le voyage de rêve.** Le ticket dit le prix du mariage, et ce qui
 * reste pour Joshua Tree.
 *
 * **Et la machine fabrique un mini-site** : ce qui est coché est ce qui
 * s'affiche. La touche du milieu montre les blocs composés, leur compte, et
 * l'adresse ; ✗ copie le lien complet. `?code=…&site=1&coches=…&reve=…` ouvre
 * **le site que les invités reçoivent** (`MiniSiteDuMariage`) : la même page,
 * vue de l'autre côté.
 *
 * L'adresse porte tout : `?code=` le mariage, `?coches=` le caddie,
 * `?demande=` la demande faite à l'agent, `?ecran=ticket|site` l'écran de la
 * machine, `?site=1` le site des invités, `?reve=` le rêve des mariés.
 */

/** Le caddie de l'adresse : ce qui est coché, dans l'ordre du catalogue. */
function cochesDeLAdresse(valeur: string | null): string[] {
  const demandées = (valeur ?? '').split(',').map((id) => id.trim()).filter(Boolean);
  return LIGNES_DU_TICKET.filter((l) => demandées.includes(l.id)).map((l) => l.id);
}

/** Le rang d'un portefeuille — il décide de la trajectoire du vol. */
interface Papier {
  cle: string;
  sortie: SortieDeLaFente;
}

export default function LaCaisse() {
  const [params, setParams] = useSearchParams();

  /** **Le code du mariage** — plus une porte, une signature. C'est celui qui
   *  part dans le lien envoyé aux invités (`?code=…`) ; sans code dans
   *  l'adresse, c'est celui du mariage de démonstration. Il s'écrit au début
   *  du ticket, et nulle part ailleurs sur la page. */
  const code = codeDepuis(params.get('code') ?? '') ?? CODE_DE_DÉMONSTRATION;

  const [état, setÉtat] = useState<ÉtatDeLaMachine>(() =>
    étatInitial({
      coches: cochesDeLAdresse(params.get('coches')),
      demande: params.get('demande') ?? '',
      écran: params.get('ecran') === 'ticket' ? 'ticket' : params.get('ecran') === 'site' ? 'site' : 'propositions',
    }),
  );

  const [marques, setMarques] = useState<string[]>([]);
  const [marche, setMarche] = useState<string | null>(null);
  const [papier, setPapier] = useState<Papier | null>(null);
  /** **Les marques posées sur le papier** : ce que les pictos ont tamponné. */
  const [tampons, setTampons] = useState<string[]>([]);
  const [avis, setAvis] = useState<string | null>(null);
  const [cible, setCible] = useState('voyage');
  /** **Le rêve, dans les mots des mariés.** Il vit dans l'adresse (`?reve=`),
   *  comme le caddie : ce qu'on partage aux invités, c'est le mariage entier. */
  const [description, setDescription] = useState(() => params.get('reve') ?? '');
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [heure] = useState(() => Math.floor(heureDeLaCapsule()));
  const passage = useRef(0);
  const rangSticker = useRef(0);

  const rêve = useMemo(() => rêveDécrit(description), [description]);
  const coches = état.coches;
  const lignesCochées = useMemo(() => LIGNES_DU_TICKET.filter((l) => coches.includes(l.id)), [coches]);

  /* ————————————————————— LE CALCUL, ET L'ADRESSE ————————————————————— */

  const totaux = totauxDuTicket(lignesCochées);
  const compte = compteParCatégorie(coches);
  const budget = budgetDuRêve(coches, rêve);
  /** **Ce que la machine fabrique** : le mini-site des invités, composé du ticket. */
  const site = useMemo(() => composerLeMiniSiteDeMariage(code, coches, description), [code, coches, description]);
  const programme = useMemo(() => lignesCochées.filter((l) => l.catégorie === 'rayon-horaires'), [lignesCochées]);
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
    if (rêve.mot !== LE_RÊVE.mot) suite.set('reve', description);
    else suite.delete('reve');
    setParams(suite, { replace: true });
    // L'adresse est la sortie, jamais l'entrée : on ne suit que ce qu'on coche.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coches, état.demande, rêve.mot, description]);

  /* ——————————————— LA LUMIÈRE, LE MAGAZINE, LE VISUEL ——————————————— */

  const date = new Date(`${TICKET_COUPLE.date}T12:00:00`);
  const lumiere = lumiereDeLHeure(heure);
  const magazine = magazineDeLaDate(date);
  const visuels = visuelsDuJour(date);
  const couverture = visuels.couverture.url;
  const visuel = visuels.imageDuChapitre.url ?? couverture;
  const legendeDuMagazine = `MAGAZINE ${visuels.magazine.numero} · ${visuels.magazine.titre.toUpperCase()}`;

  /* ——————————————— LE PAPIER QUI SORT, ET LE MOT DU GESTE ——————————————— */

  const unMot = (texte: string) => {
    setMarche(texte);
    window.setTimeout(() => setMarche((m) => (m === texte ? null : m)), 2600);
  };

  const unAvis = (texte: string) => {
    setAvis(texte);
    window.setTimeout(() => setAvis(null), 2400);
  };

  const tirerUnSticker = (mot: string) => {
    rangSticker.current += 1;
    const sticker = stickerDe(mot.slice(0, 14), rangSticker.current);
    setStickers((liste) => [...liste, sticker].slice(-10));
  };

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
    window.setTimeout(() => setPapier((p) => (p && p.cle === cle ? null : p)), 2600);
  };

  /** Un objet du Ripple : il imprime sa ligne, et sort son papier de la fente. */
  const sortirLaMarque = (id: string) => {
    const objet = OBJETS_DE_LA_FABRIQUE.find((o) => o.id === id);
    if (!objet) return;
    passage.current += 1;
    const cle = `${id}-${passage.current}`;
    setPapier({ cle, sortie: papierDeLObjet(objet) });
    window.setTimeout(() => setPapier((p) => (p && p.cle === cle ? null : p)), 2600);
  };

  /* ——————————————— UN GESTE : L'ÉTAT CHANGE, ET LE PAPIER SUIT ——————————————— */

  const geste = (suivant: Geste) => {
    setÉtat(suivant.état);
    if (suivant.mot) unMot(suivant.mot);
    if (suivant.pris) {
      const ligne = LIGNES_DU_TICKET.find((l) => l.id === suivant.pris);
      if (ligne) {
        faireSortir(ligne);
        tirerUnSticker(ligne.label);
      }
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
      tirerUnSticker(objet.nom);
      unMot(`${objet.nom} — ${objet.sens}`);
    }
  };

  /* ——————————————— LE SITE DU DESSOUS : ON COCHE, AUSSI ——————————————— */

  const cocherDansLaListe = (id: string) => {
    if (coches.includes(id)) {
      setÉtat({ ...état, coches: coches.filter((c) => c !== id) });
      unMot('ligne retirée du ticket');
      return;
    }
    const ligne = LIGNES_DU_TICKET.find((l) => l.id === id);
    setÉtat({ ...état, coches: [...coches, id] });
    if (ligne) {
      faireSortir(ligne);
      tirerUnSticker(ligne.label);
    }
    unMot(`${ligne?.label ?? 'la ligne'} — sur le ticket`);
  };

  const cocherLaCatégorie = (id: string) => {
    const ids = lignesDuneCatégorie(id);
    const toutes = ids.every((l) => coches.includes(l));
    setÉtat({ ...état, coches: toutes ? coches.filter((c) => !ids.includes(c)) : [...new Set([...coches, ...ids])] });
    unMot(toutes ? 'rayon vidé' : 'rayon pris en entier');
  };

  /** **✗ sur le pupitre : on partage.** Le lien part complet — le code, le site,
   *  et tout ce qui est coché : l'invité ouvre le mariage tel qu'il est. */
  const partagerLeMiniSite = () => {
    const lien = `${window.location.origin}${window.location.pathname}${site.lien}`;
    void navigator.clipboard?.writeText(lien);
    unAvis(`le mini-site est copié — ${site.allumés} blocs, ${coches.length} lignes`);
  };

  /** **« le site »** : on ouvre ce que les invités verront, à la même adresse. */
  const ouvrirLeSiteDesInvités = () => {
    const suite = new URLSearchParams(params);
    suite.set('code', code);
    suite.set('site', '1');
    setParams(suite);
    window.scrollTo(0, 0);
  };

  /** **Un picto du pupitre tamponne le papier** : sa marque tombe dessus, de
   *  travers — et le tampon fait passer le ticket à `PAYÉ`. On la retire en
   *  retapant : rien n'est jamais définitif. */
  const tamponner = (id: string) => {
    const objet = OBJETS_DE_LA_FABRIQUE.find((o) => o.id === id);
    const marque = marqueDuTampon(id);
    const posée = tampons.includes(id);
    setTampons(posée ? tampons.filter((t) => t !== id) : [...tampons, id].slice(-6));
    if (!posée) tirerUnSticker(marque);
    unMot(posée ? `« ${marque} » — retiré` : `${objet?.nom ?? 'le tampon'} — « ${marque} »`);
  };

  /** **✓ sur le pupitre** : le papier du ticket entier, à l'écran. */
  const ouvrirLeTicketDeLaMachine = () => {
    geste(basculerLeTicket(état));
    document.getElementById('le-ticket')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const papierDuCouple = portefeuillesDesCoches(coches).find((p) => p.portefeuille === 'couple')
    ?? portefeuillesDesCoches(coches)[0]
    ?? null;

  /* ═════════════════════════ LE MINI-SITE, TEL QU'ON L'ENVOIE ═════════════════════════ */

  if (params.get('site') === '1') {
    return (
      <MiniSiteDuMariage
        code={code}
        avatar={{
          noms: TICKET_COUPLE.noms,
          dateLabel: formatDateLong(TICKET_COUPLE.date),
          lieu: TICKET_COUPLE.venue,
          convives: TICKET_COUPLE.convives,
        }}
        visuel={visuel ?? couverture}
        site={site}
        rêve={rêve}
        budget={budget}
        programme={programme}
        ticket={{
          variante: papierDuCouple?.papier ?? 'couple',
          magasin: MAGASIN,
          couple: TICKET_COUPLE,
          numero: papierDuCouple?.numero ?? 'SM-00-0000',
          dateLabel: formatDateLong(TICKET_COUPLE.date),
          heureLabel: `${String(heure).padStart(2, '0')}:00`,
          paye: coches.length > 0,
          lignes: papierDuCouple?.papierLignes ?? [],
          total: {
            sousTotal: totaux.sousTotal,
            remise: totaux.remise,
            tva: totaux.tva,
            total: totaux.total,
            articles: totaux.articles,
          },
        }}
        surQuitter={() => {
          const suite = new URLSearchParams(params);
          suite.delete('site');
          setParams(suite, { replace: true });
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  /* ═════════════════════════ LA PAGE ═════════════════════════ */

  return (
    <div
      data-page="ticket"
      data-code={code}
      data-cochees={coches.length}
      data-total={totaux.total}
      data-écran={état.écran}
      data-demande={état.demande}
      className="min-h-svh bg-white text-[color:var(--vp-ink)]"
    >
      <BarreDeLAime
        lignes={coches.length}
        total={totaux.total}
        part={budget.part}
      />

      {/* ═════════════════════════════════════════════════════════════════════
          LE TICKET, PLEIN ÉCRAN — L'APPLI EST LE TICKET
          Plus de machine : un papier qui prend l'écran, que l'on scrolle, où
          l'on coche (fluo), où l'on tamponne (PAYÉ), et d'où l'on partage.
          ═════════════════════════════════════════════════════════════════════ */}
      <LeTicketPleinEcran
        code={code}
        numero={papierDuCouple?.numero ?? 'SM-00-0000'}
        dateLabel={formatDateLong(TICKET_COUPLE.date)}
        heure={heure}
        visuel={visuel ?? couverture ?? null}
        couple={{ noms: TICKET_COUPLE.noms, lieu: TICKET_COUPLE.venue, convives: TICKET_COUPLE.convives }}
        coches={coches}
        surCocher={cocherDansLaListe}
        totaux={totaux}
        portefeuilles={portefeuilles}
        rêve={rêve}
        budget={budget}
        tampons={tampons}
        surTamponner={tamponner}
        mot={marche}
        adresseDuSite={site.adresse}
        surPartager={partagerLeMiniSite}
        surSite={ouvrirLeSiteDesInvités}
      />

      {/* ═════════════════════════════════════════════════════════════════════
          LA COUVERTURE-ARCHIVE — LE PAPIER DU MARIAGE, ÉTALÉ
          Le ticket reste le premier écran ; juste après, **tout le papier est
          sur la table** : le reçu, le polaroïd du jour, la carte postale du
          voyage, le timbre, le sticker fluo, la note des sept objets, la bande
          de la nuit en musique, et le code — sur du noir, sous un titre sérif.
          ═════════════════════════════════════════════════════════════════════ */}
      <LaCouvertureArchive
        code={code}
        dateLabel={formatDateLong(TICKET_COUPLE.date)}
        visuelDuJour={visuel ?? couverture ?? null}
        lignes={lignesCochées.length}
        total={euros(totaux.total)}
        surDescendre={() => document.getElementById('le-visuel')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
      />

      {/* ═════════════════════ LE VISUEL DU JOUR, LES INFOS DESSUS ═════════════════════ */}
      <section
        id="le-visuel"
        data-section="visuel"
        className="relative flex min-h-[78svh] flex-col items-center justify-center gap-3 overflow-hidden px-4 py-14 text-center"
      >
        {visuel && (
          <img
            src={visuel}
            alt=""
            data-visuel="jour"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: `brightness(${0.4 + lumiere.clarte * 0.3})` }}
          />
        )}
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black" />
        <span aria-hidden="true" className="absolute inset-0 z-10 bg-black/25" />

        <div className="relative z-20 flex flex-col items-center gap-1 text-white">
          <span className="flex items-center gap-3">
            <CadranDuMagazine
              heure={heure}
              chapitre={magazine.numero % 7 || 7}
              fond="rgba(11,12,18,0.45)"
              encre="#F3F1ED"
              accent={magazine.palette.accent}
              vignette
              className="h-10 w-10"
            />
            <span className="flex flex-col text-left">
              <span data-hero-noms="vrai" className="vp-title text-[28px] leading-none sm:text-[40px]">
                {TICKET_COUPLE.noms}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/75">
                {formatDateLong(TICKET_COUPLE.date)} · {TICKET_COUPLE.venue}
              </span>
            </span>
          </span>
          <span className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">
            <span>{MAGASIN.rayon}</span>
            <span data-hero-heure="vrai">
              {String(heure).padStart(2, '0')}:00 · {lumiere.mot ?? 'LE JOUR'}
            </span>
            <span>{TICKET_COUPLE.convives} convives</span>
            <span data-hero-compte="vrai">
              {coches.length} ligne{coches.length > 1 ? 's' : ''} cochée{coches.length > 1 ? 's' : ''}
            </span>
            <span data-hero-total="vrai">total {euros(totaux.total)}</span>
            <span data-hero-code="vrai">code {code}</span>
          </span>
        </div>
      </section>

      {/* ═════════════════════ LE TITRE, LA COUVERTURE DU JOUR ═════════════════════ */}
      <LeTitre couverture={couverture} legende={legendeDuMagazine} />

      {/* ═════════════════════ LES QUATRE CATÉGORIES : L'ARBORESCENCE ═════════════════════ */}
      <LesHeros cible={cible} surCible={setCible} />

      {/* ═════════════════════ LA PASTILLE FLOTTANTE — ON PARTAGE, D'OÙ L'ON VEUT ═════════════════════
          La référence pose une seule pastille, en bas à droite, et rien d'autre.
          La nôtre : le lien du mini-site, copié d'un pouce, depuis n'importe où
          dans la page. */}
      <button
        type="button"
        data-action="partager-flottant"
        onClick={partagerLeMiniSite}
        className="fixed bottom-4 right-3 z-40 inline-flex items-center gap-2 rounded-full bg-[color:var(--vp-ink)] px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white shadow-[0_14px_34px_rgba(11,12,18,0.35)] transition hover:brightness-125 sm:right-5"
      >
        <span data-flottant-compte={coches.length} className="tabular-nums">
          {coches.length}
        </span>
        partager le mini-site
      </button>

      {/* ═════════════════════ L'APPAREIL : LE TICKET, LE BUDGET, LES STICKERS ═════════════════════ */}
      <AppareilDuMariage
        code={code}
        avatar={{
          noms: TICKET_COUPLE.noms,
          date: formatDateLong(TICKET_COUPLE.date),
          lieu: TICKET_COUPLE.venue,
          convives: TICKET_COUPLE.convives,
          lignes: coches.length,
          total: totaux.total,
        }}
        rêve={rêve}
        description={description}
        surDécrire={setDescription}
        surPartager={() => {
          // **C'est le mini-site qui part**, pas la page : le lien ouvre
          // directement ce que les mariés ont composé, code compris.
          void navigator.clipboard?.writeText(`${window.location.origin}${window.location.pathname}${site.lien}`);
          unAvis('le lien du mini-site est copié — envoyez-le aux invités');
        }}
        budget={budget}
        cible={cible}
        surCible={setCible}
        marques={marques}
        surObjet={poserUnObjet}
        sortie={papier?.sortie ?? null}
        stickers={stickers}
        surSticker={() => {
          tirerUnSticker('SUPER MARIAGE');
          unAvis('un sticker de plus');
        }}
        ticket={lignesCochées}
      />

      {/* ═════════════════════ LE PROGRAMME, ET LES CINQ PAPIERS ═════════════════════ */}
      <LesGestes />

      {/* ═════════════════════ CE QU'ON COCHE : LES TROIS FAMILLES ═════════════════════ */}
      <LesTroisFamilles />

      {/* ═════════════════════ ON COCHE : LES CATÉGORIES ═════════════════════ */}
      <main id="on-coche" data-bande="on-coche" data-section="coche" className="vp-bande">
        <div className="vp-page">
          <p className="vp-bande-nom">
            <b>AIME</b>
            <span aria-hidden="true">·</span>
            <span>CE QU’ON COCHE</span>
          </p>
          <div className="mt-8 max-w-[52ch]">
            <h2 data-bande-titre="on-coche" className="vp-bande-titre">
              Les 99 lignes, rangées.
            </h2>
            <p className="vp-bande-sous mt-5">
              Le jour J a un prix, le site et les documents sont inclus. On coche : le ticket suit, l’écran de la
              machine suit, et le papier sort de la fente.
            </p>
          </div>

          <div className="mt-10">
            {GROUPES_DU_TICKET.map((groupe) => {
              const catégories = CATÉGORIES_DU_TICKET.filter((c) => c.groupe === groupe.id);
              return (
                <section key={groupe.id} data-section-groupe={groupe.id} className="mt-14 first:mt-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[color:var(--vp-line)] pb-2">
                    <h3 id={`groupe-${groupe.id}`} className="scroll-mt-24 text-[19px] font-bold tracking-tight">
                      {groupe.mot}
                    </h3>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--vp-muted)]">
                      {groupe.sous}
                    </span>
                  </div>

                  {catégories.map((c) => (
                    <div key={c.id} id={`cat-${c.id}`} data-catégorie={c.id} className="mt-6 scroll-mt-24">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h4 className="flex items-baseline gap-2 text-[14px] font-semibold">
                          <span
                            aria-hidden="true"
                            className="inline-block h-2.5 w-2.5 rounded-full"
                            style={{ background: c.couleur }}
                          />
                          {c.mot}
                          {(compte[c.id] ?? 0) > 0 && (
                            <span data-compte="vrai" className="font-mono text-[10px] text-[color:var(--vp-ink)]">
                              {compte[c.id]}
                            </span>
                          )}
                        </h4>
                        <span className="flex items-baseline gap-3">
                          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--vp-muted-2)]">
                            {c.sous}
                          </span>
                          <button
                            type="button"
                            data-action="tout-le-rayon"
                            data-rayon={c.id}
                            onClick={() => cocherLaCatégorie(c.id)}
                            className="font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--vp-muted)] transition hover:text-[color:var(--vp-ink)]"
                          >
                            tout prendre
                          </button>
                        </span>
                      </div>

                      <ul data-lignes="vrai" className="mt-2 grid gap-0 sm:grid-cols-2 sm:gap-x-8">
                        {c.lignes.map((ligne) => {
                          const prise = coches.includes(ligne.id);
                          return (
                            <li key={ligne.id}>
                              <button
                                type="button"
                                data-ligne={ligne.id}
                                data-cochee={prise ? 'true' : 'false'}
                                data-famille={ligne.famille}
                                data-prix={ligne.prix}
                                data-vers={ligne.vers.join(',')}
                                aria-pressed={prise}
                                onClick={() => cocherDansLaListe(ligne.id)}
                                className={`flex w-full items-baseline gap-3 border-b border-[color:var(--vp-line)] py-2.5 text-left transition ${
                                  prise
                                    ? 'text-[color:var(--vp-ink)]'
                                    : 'text-[color:var(--vp-ink-soft)] hover:text-[color:var(--vp-ink)]'
                                }`}
                              >
                                <span
                                  aria-hidden="true"
                                  className={`mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px] leading-none ${
                                    prise
                                      ? 'border-[color:var(--vp-ink)] bg-[color:var(--vp-ink)] text-white'
                                      : 'border-black/20 text-transparent'
                                  }`}
                                >
                                  ✓
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-[13.5px] leading-tight">{ligne.label}</span>
                                  <span className="mt-0.5 block truncate font-mono text-[9.5px] uppercase tracking-[0.1em] text-[color:var(--vp-muted)]">
                                    {ligne.vers.map((p) => motDuPortefeuille(p)).join(' · ')}
                                    {ligne.promo ? ' · promo rayon 7' : ''}
                                    {ligne.incluse ? ' · inclus' : ''}
                                  </span>
                                </span>
                                <span className="shrink-0 font-mono text-[12px] tabular-nums text-[color:var(--vp-ink)]">
                                  {ligne.incluse ? 'inclus' : euros(ligne.prix * (ligne.quantite ?? 1))}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </section>
              );
            })}
          </div>
        </div>
      </main>

      {/* ═════════════════════ LE TICKET, ENTIER ═════════════════════ */}
      <section id="le-ticket" data-bande="ticket" data-section="ticket" className="vp-bande vp-bande-fond">
        <div className="vp-page">
          <p className="vp-bande-nom">
            <b>AIME</b>
            <span aria-hidden="true">·</span>
            <span>LE TICKET, ENTIER</span>
          </p>

          <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,420px)_minmax(0,1fr)] md:items-start">
            <TicketCaisse
              variante={papierDuCouple?.papier ?? 'couple'}
              magasin={MAGASIN}
              couple={TICKET_COUPLE}
              numero={papierDuCouple?.numero ?? 'SM-00-0000'}
              dateLabel={formatDateLong(TICKET_COUPLE.date)}
              heureLabel={`${String(heure).padStart(2, '0')}:00`}
              paye={coches.length > 0}
              lignes={papierDuCouple?.papierLignes ?? []}
              total={{
                sousTotal: totaux.sousTotal,
                remise: totaux.remise,
                tva: totaux.tva,
                total: totaux.total,
                articles: totaux.articles,
              }}
            />

            <div className="flex flex-col gap-5">
              <p className="vp-bande-sous max-w-[42ch]">
                {totaux.articles} ligne{totaux.articles > 1 ? 's' : ''} · {totaux.incluses} incluse
                {totaux.incluses > 1 ? 's' : ''}. {LE_SPÉCIALISTE.phrase}
              </p>

              <div data-marques="vrai" className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--vp-muted)]">
                  les objets imprimés
                </span>
                {marques.length === 0 && (
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--vp-muted-2)]">
                    aucun — les boutons ronds en impriment
                  </span>
                )}
                {marques.map((id) => {
                  const objet = OBJETS_DE_LA_FABRIQUE.find((o) => o.id === id);
                  const imprimé = OBJETS_IMPRIMÉS.find((o) => o.id === id);
                  return (
                    <span
                      key={id}
                      data-marque={id}
                      className="rounded-full border border-[color:var(--vp-ink)] px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-[color:var(--vp-ink)]"
                    >
                      {imprimé ? ligneImprimée(code, imprimé) : (objet?.nom ?? id)}
                    </span>
                  );
                })}
              </div>

              <dl data-budget="vrai" className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  ['le mariage', euros(totaux.total)],
                  ['le rêve', euros(LE_RÊVE.prix)],
                  ['mis de côté', euros(budget.misDeCôté)],
                  ['reste à financer', euros(budget.reste)],
                ].map(([mot, valeur]) => (
                  <div key={mot} data-budget-mot={mot} className="border-t border-[color:var(--vp-line)] pt-2">
                    <dt className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-[color:var(--vp-muted)]">
                      {mot}
                    </dt>
                    <dd className="mt-1 text-[18px] font-semibold tracking-[-0.03em] [font-variant-numeric:tabular-nums]">
                      {valeur}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  data-action="emporter"
                  disabled={!coches.length}
                  onClick={() => {
                    const adresse = `${window.location.origin}${window.location.pathname}?code=${code}&coches=${coches.join(',')}`;
                    void navigator.clipboard?.writeText(adresse);
                    unAvis(`${coches.length} lignes · le reçu est dans le lien`);
                  }}
                  className="vp-pastille !text-[11px]"
                >
                  emporter le reçu
                </button>
                <button
                  type="button"
                  data-action="imprimer"
                  onClick={() => window.print()}
                  className="vp-pastille vp-pastille-trait !text-[11px]"
                >
                  imprimer
                </button>
                <button
                  type="button"
                  data-action="machine"
                  onClick={ouvrirLeTicketDeLaMachine}
                  className="vp-pastille vp-pastille-trait !text-[11px]"
                >
                  le ticket sur l’écran
                </button>
                <button
                  type="button"
                  data-action="vider"
                  onClick={() => setÉtat({ ...état, coches: [] })}
                  className="font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--vp-muted)] underline decoration-[color:var(--vp-line)] underline-offset-4 transition hover:text-[color:var(--vp-ink)]"
                >
                  vider
                </button>
              </div>

              <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-[color:var(--vp-muted-2)]">
                {MAGASIN.slogan} · tarifs indicatifs, aucun paiement réel
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════ LES PORTEFEUILLES ═════════════════════ */}
      <footer data-bande="portefeuilles" data-section="portefeuilles" className="vp-bande">
        <div className="vp-page">
          <p className="vp-bande-nom">
            <b>AIME</b>
            <span aria-hidden="true">·</span>
            <span>LES PORTEFEUILLES</span>
          </p>

          {portefeuillesDesCoches(coches).length === 0 ? (
            <p data-portefeuilles="vides" className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--vp-muted)]">
              les portefeuilles attendent — cochez une ligne, le ticket sort et part
            </p>
          ) : (
            <div data-portefeuilles="pleins" className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {portefeuillesDesCoches(coches).map((ticket) => (
                <span
                  key={ticket.portefeuille}
                  data-portefeuille={ticket.portefeuille}
                  data-lignes={ticket.lignes.length}
                  data-total={ticket.total}
                  data-papier={ticket.papier}
                  className="flex flex-col gap-1 rounded-[14px] border border-[color:var(--vp-line)] bg-[color:var(--vp-env-light-b)] p-4"
                >
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="text-[14px] font-semibold">{motDuPortefeuille(ticket.portefeuille)}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--vp-muted)]">
                      {ticket.papier}
                    </span>
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[color:var(--vp-muted-2)]">
                    {ticket.entête}
                  </span>
                  <span className="mt-1 font-mono text-[13px] font-semibold tabular-nums text-[color:var(--vp-ink)]">
                    {ticket.total > 0 ? euros(ticket.total) : 'inclus'}
                  </span>
                  <span className="mt-1 flex flex-col gap-0.5">
                    {ticket.lignes.slice(0, 4).map((l) => (
                      <span key={l.id} className="truncate font-mono text-[10px] text-[color:var(--vp-muted)]">
                        {l.label}
                      </span>
                    ))}
                    {ticket.lignes.length > 4 && (
                      <span className="font-mono text-[10px] text-[color:var(--vp-muted-2)]">
                        + {ticket.lignes.length - 4} autres
                      </span>
                    )}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
      </footer>

      {/* ═════════════════════ L'ADDITION, LES QUESTIONS, LE PIED ═════════════════════ */}
      <LesFormules
        onChoisir={(id) => {
          cocherDansLaListe(id);
          document.getElementById('le-ticket')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      />
      <LesQuestions />
      <LePied />

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
