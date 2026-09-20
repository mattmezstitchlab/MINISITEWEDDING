import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  CATÉGORIES_DU_TICKET,
  GROUPES_DU_TICKET,
  LIGNES_DU_TICKET,
  compteParCatégorie,
  compteParFamille,
  euros,
  lignesDuneCatégorie,
  marqueDeLaFamille,
  type LigneDuTicket,
} from '../lib/categoriesDuTicket';
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
  portefeuillesDesCoches,
  portefeuillesVisés,
  totauxDuTicket,
} from '../lib/portefeuille';
import { OBJETS_DE_LA_FABRIQUE, papierDeLObjet } from '../lib/ripple';
import { MAGASIN, TICKET_COUPLE } from '../lib/superMariage';
import { heureDeLaCapsule } from '../lib/capsuleCommande';
import { lumiereDeLHeure } from '../lib/lumiereDuJour';
import { magazineDeLaDate } from '../lib/semaines';
import { visuelsDuJour } from '../lib/visuelsDuMagazine';
import { formatDateLong } from '../lib/format';
import CadranDuMagazine from '../components/CadranDuMagazine';
import MachineDeRipple, { type SortieDeLaFente } from '../components/MachineDeRipple';
import TicketCaisse from '../components/TicketCaisse';

/* LE SPÉCIALISTE DU TICKET — LA MACHINE EN HAUT, LE SITE DESSOUS
 *
 * La page a deux étages, et ils ne se mélangent pas :
 *
 * 1. **en haut, la machine** — seule sur un fond blanc, et elle tient dans un
 *    écran. C'est l'entrée : **tout ce qui se coche peut venir par son écran**.
 *    Elle propose toujours quelque chose — une famille, puis ses lignes, une par
 *    une — et les deux touches rondes marchent toujours : ✓ on prend, ✗ on
 *    passe. Le papier sort de la fente, et il part vers ses portefeuilles ;
 * 2. **en dessous, le site** — on descend, et l'on retrouve tout :
 *    - **le visuel du jour**, avec les infos dessus (les noms, la date, le lieu,
 *      l'heure, les convives, le total) ;
 *    - **on coche** — les 17 catégories, les 99 lignes, visibles et cochables
 *      d'un clic, sans passer par la machine ;
 *    - **le ticket entier** — le papier complet, qui se remplit au fur et à
 *      mesure, avec les marques posées par les objets ronds ;
 *    - **les portefeuilles** — là où le ticket arrive, ligne par ligne.
 *
 * Les deux étages parlent le même état : cocher dans la machine ou dans la
 * liste, c'est le même ticket. Et dans les deux cas **le papier sort de la
 * fente** — c'est le même geste, vu d'en bas.
 *
 * L'adresse est le reçu (`?coches=…`), et elle porte la demande
 * (`?demande=diner`) et l'écran (`?ecran=ticket`).
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

  /** **Tout l'état de la machine** — le site du dessous lit le même. */
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
  const lignesCochées = useMemo(() => LIGNES_DU_TICKET.filter((l) => coches.includes(l.id)), [coches]);

  /* ————————————————————— LE CALCUL, ET L'ADRESSE ————————————————————— */

  const totaux = totauxDuTicket(lignesCochées);
  const compte = compteParCatégorie(coches);
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

  /* ——————————————— LA LUMIÈRE, LE MAGAZINE, LE VISUEL ——————————————— */

  const date = new Date(`${TICKET_COUPLE.date}T12:00:00`);
  const lumiere = lumiereDeLHeure(heure);
  const magazine = magazineDeLaDate(date);
  const visuel = visuelsDuJour(date).couverture.url;

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

  /* ——————————————— LE SITE DU DESSOUS : ON COCHE, AUSSI ——————————————— */

  /** Cocher à la main dans la liste : le même geste, et le même papier. */
  const cocherDansLaListe = (id: string) => {
    if (coches.includes(id)) {
      setÉtat({ ...état, coches: coches.filter((c) => c !== id) });
      unMot('ligne retirée du ticket');
      return;
    }
    const ligne = LIGNES_DU_TICKET.find((l) => l.id === id);
    setÉtat({ ...état, coches: [...coches, id] });
    if (ligne) faireSortir(ligne);
    unMot(`${ligne?.label ?? 'la ligne'} — sur le ticket`);
  };

  /** Tout un rayon, d'un bouton : la même chose, en une fois. */
  const cocherLaCatégorie = (id: string) => {
    const ids = lignesDuneCatégorie(id);
    const toutes = ids.every((l) => coches.includes(l));
    setÉtat({ ...état, coches: toutes ? coches.filter((c) => !ids.includes(c)) : [...new Set([...coches, ...ids])] });
    unMot(toutes ? 'rayon vidé' : 'rayon pris en entier');
  };

  /** Le bouton rond du reçu, quand on est en bas de page : il ramène à la machine. */
  const ouvrirLeTicketDeLaMachine = () => {
    geste(basculerLeTicket(état));
    document.getElementById('la-machine')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const papierDuCouple = portefeuillesDesCoches(coches).find((p) => p.portefeuille === 'couple')
    ?? portefeuillesDesCoches(coches)[0]
    ?? null;

  return (
    <div
      data-page="ticket"
      data-cochees={coches.length}
      data-total={totaux.total}
      data-écran={état.écran}
      data-demande={état.demande}
      className="min-h-svh bg-[#0B0C12] text-white"
    >
      {/* ═════════════════════ EN HAUT : LA MACHINE, SEULE ═════════════════════ */}
      <header
        id="la-machine"
        data-zone="machine"
        className="relative grid min-h-svh place-items-center overflow-hidden bg-white px-3 py-10"
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

        {/* Le seul mot de cet étage : on descend. */}
        <a
          href="#le-visuel"
          data-action="descendre"
          aria-label="descendre : le site"
          className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[14px] text-black/35 transition hover:text-black"
        >
          ↓
        </a>
      </header>

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
            data-visuel="couverture"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: `brightness(${0.4 + lumiere.clarte * 0.3})` }}
          />
        )}
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-[#0B0C12]" />

        <div className="relative flex flex-col items-center gap-1">
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
            <span>
              {MAGASIN.nom} · {MAGASIN.rayon}
            </span>
            <span data-hero-heure="vrai">
              {String(heure).padStart(2, '0')}:00 · {lumiere.mot ?? 'LE JOUR'}
            </span>
            <span>{TICKET_COUPLE.convives} convives</span>
            <span data-hero-compte="vrai">
              {coches.length} ligne{coches.length > 1 ? 's' : ''} cochée{coches.length > 1 ? 's' : ''}
            </span>
            <span data-hero-total="vrai">total {euros(totaux.total)}</span>
          </span>
        </div>
      </section>

      {/* ═════════════════════ ON COCHE : LES CATÉGORIES ═════════════════════ */}
      <main data-section="coche" className="mx-auto w-full max-w-[900px] px-4 pb-16 sm:px-6">
        {GROUPES_DU_TICKET.map((groupe) => {
          const catégories = CATÉGORIES_DU_TICKET.filter((c) => c.groupe === groupe.id);
          return (
            <section key={groupe.id} data-section-groupe={groupe.id} className="mt-14 first:mt-10">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-2">
                <h2 className="text-[19px] font-bold tracking-tight">{groupe.mot}</h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">{groupe.sous}</span>
              </div>

              {catégories.map((c) => (
                <div key={c.id} id={`cat-${c.id}`} data-catégorie={c.id} className="mt-6 scroll-mt-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="flex items-baseline gap-2 text-[14px] font-semibold">
                      <span
                        aria-hidden="true"
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ background: c.couleur }}
                      />
                      {c.mot}
                      {(compte[c.id] ?? 0) > 0 && (
                        <span data-compte="vrai" className="font-mono text-[10px] text-[#00FF88]">
                          {compte[c.id]}
                        </span>
                      )}
                    </h3>
                    <span className="flex items-baseline gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">{c.sous}</span>
                      <button
                        type="button"
                        data-action="tout-le-rayon"
                        data-rayon={c.id}
                        onClick={() => cocherLaCatégorie(c.id)}
                        className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45 transition hover:text-white"
                      >
                        tout prendre
                      </button>
                    </span>
                  </div>

                  <ul data-lignes="vrai" className="mt-2 grid gap-0 sm:grid-cols-2 sm:gap-x-6">
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
                            className={`flex w-full items-baseline gap-3 border-b border-white/8 py-2.5 text-left transition ${
                              prise ? 'text-white' : 'text-white/60 hover:text-white/90'
                            }`}
                          >
                            <span
                              aria-hidden="true"
                              className={`mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px] leading-none ${
                                prise ? 'border-[#00FF88] text-[#00FF88]' : 'border-white/25 text-transparent'
                              }`}
                            >
                              ✓
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[13.5px] leading-tight">{ligne.label}</span>
                              <span className="mt-0.5 block truncate font-mono text-[9.5px] uppercase tracking-[0.1em] text-white/35">
                                {ligne.vers.map((p) => motDuPortefeuille(p)).join(' · ')}
                                {ligne.promo ? ' · promo rayon 7' : ''}
                                {ligne.incluse ? ' · inclus' : ''}
                              </span>
                            </span>
                            <span className="shrink-0 font-mono text-[12px] tabular-nums text-white/80">
                              {ligne.incluse ? marqueDeLaFamille(ligne.famille) : euros(ligne.prix * (ligne.quantite ?? 1))}
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
      </main>

      {/* ═════════════════════ LE TICKET, ENTIER ═════════════════════ */}
      <section data-section="ticket" className="mx-auto w-full max-w-[900px] px-4 pb-16 sm:px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-2">
          <h2 className="text-[19px] font-bold tracking-tight">Le ticket</h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
            {totaux.articles} ligne{totaux.articles > 1 ? 's' : ''} · {totaux.incluses} incluse
            {totaux.incluses > 1 ? 's' : ''}
          </span>
        </div>

        <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,420px)_minmax(0,1fr)] md:items-start">
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

          <div className="flex flex-col gap-4">
            {/* Les marques : ce que les boutons ronds ont posé sur le papier. */}
            <div data-marques="vrai" className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">les marques</span>
              {marques.length === 0 && (
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/25">
                  aucune — les boutons ronds de la machine en posent
                </span>
              )}
              {marques.map((id) => {
                const objet = OBJETS_DE_LA_FABRIQUE.find((o) => o.id === id);
                return (
                  <span
                    key={id}
                    data-marque={id}
                    className="rounded-full border border-[#00FF88]/50 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-[#00FF88]"
                  >
                    {objet?.nom ?? id}
                  </span>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                data-action="emporter"
                disabled={!coches.length}
                onClick={() => {
                  void navigator.clipboard?.writeText(
                    `${window.location.origin}${window.location.pathname}?coches=${coches.join(',')}`,
                  );
                  unAvis(`${coches.length} lignes · le reçu est dans le lien`);
                }}
                className="rounded-full border border-white/25 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/75 transition hover:border-white/60 hover:text-white disabled:opacity-30"
              >
                emporter le reçu
              </button>
              <button
                type="button"
                data-action="imprimer"
                onClick={() => window.print()}
                className="rounded-full border border-white/25 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/75 transition hover:border-white/60 hover:text-white"
              >
                imprimer
              </button>
              <button
                type="button"
                data-action="vider"
                onClick={() => setÉtat({ ...état, coches: [] })}
                className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40 transition hover:border-white/50 hover:text-white"
              >
                vider
              </button>
              <button
                type="button"
                data-action="machine"
                onClick={ouvrirLeTicketDeLaMachine}
                className="rounded-full border border-white/25 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/75 transition hover:border-white/60 hover:text-white"
              >
                le ticket sur l’écran
              </button>
            </div>

            <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-white/30">
              {MAGASIN.slogan} · tarifs indicatifs, aucun paiement réel
            </p>

            <p>
              <Link
                to="/magazine?monde=magasin"
                className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/35 underline decoration-white/15 underline-offset-4 transition hover:text-white"
              >
                le magasin, tout en cases
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ═════════════════════ LES PORTEFEUILLES ═════════════════════ */}
      <footer data-section="portefeuilles" className="mx-auto w-full max-w-[900px] px-4 pb-24 sm:px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-2">
          <h2 className="text-[19px] font-bold tracking-tight">Les portefeuilles</h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">là où le ticket arrive</span>
        </div>

        {portefeuillesDesCoches(coches).length === 0 ? (
          <p data-portefeuilles="vides" className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-white/35">
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
                className="flex flex-col gap-1 rounded-[16px] border border-white/10 bg-white/[0.03] p-4"
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-[14px] font-semibold">{motDuPortefeuille(ticket.portefeuille)}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">{ticket.papier}</span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/35">{ticket.entête}</span>
                <span className="mt-1 font-mono text-[13px] tabular-nums text-[#00FF88]">
                  {ticket.total > 0 ? euros(ticket.total) : 'inclus'}
                </span>
                <span className="mt-1 flex flex-col gap-0.5">
                  {ticket.lignes.slice(0, 4).map((l) => (
                    <span key={l.id} className="truncate font-mono text-[10px] text-white/45">
                      {l.label}
                    </span>
                  ))}
                  {ticket.lignes.length > 4 && (
                    <span className="font-mono text-[10px] text-white/30">+ {ticket.lignes.length - 4} autres</span>
                  )}
                </span>
              </span>
            ))}
          </div>
        )}
      </footer>

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
