import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  CATÉGORIES_DU_TICKET,
  GROUPES_DU_TICKET,
  LIGNES_DU_TICKET,
  compteParCatégorie,
  euros,
  lignesDuneCatégorie,
  marqueDeLaFamille,
} from '../lib/categoriesDuTicket';
import { portefeuillesDesCoches, portefeuillesVisés, totauxDuTicket } from '../lib/portefeuille';
import { MAGASIN, TICKET_COUPLE } from '../lib/superMariage';
import { OBJETS_DE_LA_FABRIQUE } from '../lib/ripple';
import { heureDeLaCapsule } from '../lib/capsuleCommande';
import { lumiereDeLHeure } from '../lib/lumiereDuJour';
import { magazineDeLaDate } from '../lib/semaines';
import { visuelsDuJour } from '../lib/visuelsDuMagazine';
import { formatDateLong } from '../lib/format';
import CadranDuMagazine from '../components/CadranDuMagazine';
import MachineDeRipple, { type SortieDeLaFente } from '../components/MachineDeRipple';
import TicketCaisse from '../components/TicketCaisse';

/* LE SPÉCIALISTE DU TICKET — UNE LANDING, LA MACHINE AU CENTRE
 *
 * La page défile **verticalement**, comme une landing, et elle tient en quatre
 * temps :
 *
 * 1. **le héros** — le visuel, les infos dessus, et au centre **la machine de
 *    Ripple** : le petit écran, les boutons ronds — les objets (reçu, carte,
 *    timbre, tampon, ticket, avion, sticker) et les catégories — et **la fente**,
 *    par laquelle le ticket sort ;
 * 2. **on coche** — les catégories, en sections : le jour J, votre site, les
 *    documents. 99 lignes, et rien d'autre à comprendre ;
 * 3. **le ticket** — le papier entier, qui se calcule au fur et à mesure ;
 * 4. **les portefeuilles** — là où le ticket part : le couple, les invités, la
 *    famille, le DJ, les métiers.
 *
 * Le caddie tient dans l'adresse (`?coches=…`) : **le lien est le reçu**.
 *
 * ```txt
 * ┌──────────────────────────────────────────────────────────┐
 * │            Nora & Adam · 6 février 2027 · 64 convives     │
 * │                    ┌──────────────────┐                   │
 * │                    │  SUPER MARIAGE   │  l'écran          │
 * │                    │  64 CONVIVES     │                   │
 * │                    │  > CÉRÉMONIE 900 │                   │
 * │                    │  7 LIGNES 5 472 €│                   │
 * │                    ├──────────────────┤                   │
 * │                    │ ▬▬▬ LA FENTE ▬▬▬ │                   │
 * │                    │  ┌────────────┐  │  le ticket sort   │
 * │                    └──┴────────────┴──┘                   │
 * │               (●)(✉)(♦)(◉)(▤)(✈)(★)   les objets ronds     │
 * │               (LE JOUR J)(LE SITE)(LES DOCUMENTS)         │
 * │               (HORAIRES)(CUISINE)(IMAGES)…                │
 * └──────────────────────────────────────────────────────────┘
 *                         ↓ on défile
 *      ON COCHE — LE JOUR J / VOTRE SITE / LES DOCUMENTS
 *      LE TICKET — le papier entier
 *      LES PORTEFEUILLES — où il part
 * ```
 */

/** Le caddie de l'adresse : ce qui est coché, dans l'ordre du catalogue. */
function cochesDeLAdresse(valeur: string | null): string[] {
  const demandées = (valeur ?? '').split(',').map((id) => id.trim()).filter(Boolean);
  return LIGNES_DU_TICKET.filter((l) => demandées.includes(l.id)).map((l) => l.id);
}

/** Les portefeuilles, par leur mot — et leur rang, pour la trajectoire du vol. */
const PORTEFEUILLES_MOTS: Record<string, string> = {
  couple: 'le couple',
  invites: 'les invités',
  famille: 'la famille',
  dj: 'le DJ',
  metier: 'les métiers',
};

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
  const [catégorie, setCatégorie] = useState<string>(() => CATÉGORIES_DU_TICKET[0]!.id);
  const [marques, setMarques] = useState<string[]>([]);
  const [mot, setMot] = useState<string | null>(null);
  const [vols, setVols] = useState<Vol[]>([]);
  const [presse, setPresse] = useState<{ cle: string; ligne: string } | null>(null);
  const [avis, setAvis] = useState<string | null>(null);
  const [heure] = useState(() => Math.floor(heureDeLaCapsule()));
  const passage = useRef(0);

  /* ————————————————————— LE CALCUL, ET L'ADRESSE ————————————————————— */

  const lignesCochées = useMemo(() => LIGNES_DU_TICKET.filter((l) => coches.includes(l.id)), [coches]);
  const totaux = totauxDuTicket(lignesCochées);
  const portefeuilles = portefeuillesDesCoches(coches);
  const compte = compteParCatégorie(coches);

  useEffect(() => {
    const suite = new URLSearchParams(params);
    if (coches.length) suite.set('coches', coches.join(','));
    else suite.delete('coches');
    setParams(suite, { replace: true });
    // On ne suit que ce qui est coché : l'adresse est la sortie, jamais l'entrée.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coches]);

  /* ——————————————— LA LUMIÈRE, LE MAGAZINE, LE VISUEL ——————————————— */

  const date = new Date(`${TICKET_COUPLE.date}T12:00:00`);
  const lumiere = lumiereDeLHeure(heure);
  const magazine = magazineDeLaDate(date);
  const visuel = visuelsDuJour(date).couverture.url;

  /* ——————————————— COCHER : LE TICKET SORT DE LA FENTE ——————————————— */

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
    setMot(texte);
    window.setTimeout(() => setMot((m) => (m === texte ? null : m)), 2600);
  };

  const cocher = (id: string) => {
    const déjà = coches.includes(id);
    setCoches(déjà ? coches.filter((c) => c !== id) : [...coches, id]);
    if (!déjà) faireSortir(id);
  };

  const cocherLaCatégorie = (id: string) => {
    const ids = lignesDuneCatégorie(id);
    const toutes = ids.every((l) => coches.includes(l));
    setCoches(toutes ? coches.filter((c) => !ids.includes(c)) : [...new Set([...coches, ...ids])]);
    if (!toutes && ids[0]) faireSortir(ids[0]);
    unMot(toutes ? 'rayon vidé' : 'rayon pris en entier');
  };

  /** Les boutons ronds de la machine : ils marquent le ticket, et le disent. */
  const poserUnObjet = (id: string) => {
    const objet = OBJETS_DE_LA_FABRIQUE.find((o) => o.id === id);
    if (!objet) return;
    const posée = marques.includes(id);
    setMarques(posée ? marques.filter((m) => m !== id) : [...marques, id]);
    unMot(posée ? `${objet.nom} — retiré` : `${objet.nom} — ${objet.sens}`);
  };

  const choisirLaCatégorie = (id: string) => {
    setCatégorie(id);
    document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const ligneSortie = presse ? lignesCochées.find((l) => l.id === presse.ligne) ?? LIGNES_DU_TICKET.find((l) => l.id === presse.ligne) : undefined;
  const sortie: SortieDeLaFente | null = ligneSortie
    ? {
        label: ligneSortie.label,
        prix: ligneSortie.incluse ? 'inclus' : euros(ligneSortie.prix * (ligneSortie.quantite ?? 1)),
        vers: ligneSortie.vers.map((p) => PORTEFEUILLES_MOTS[p]).join(' · '),
      }
    : null;

  const adresseDuReçu = () => `${window.location.origin}${window.location.pathname}?coches=${coches.join(',')}`;
  const avisUnMot = (texte: string) => {
    setAvis(texte);
    window.setTimeout(() => setAvis(null), 2400);
  };

  const papierDuCouple = portefeuilles.find((p) => p.portefeuille === 'couple') ?? portefeuilles[0] ?? null;

  return (
    <div data-page="ticket" data-cochees={coches.length} data-total={totaux.total} data-catégorie-ouverte={catégorie} className="min-h-svh bg-[#0B0C12] text-white">
      {/* ═════════════════════ LE HÉROS : LA MACHINE, AU CENTRE ═════════════════════ */}
      <header
        data-hero="ticket"
        className="relative flex min-h-svh flex-col items-center justify-center gap-5 overflow-hidden px-4 py-10 text-center"
      >
        {/* Le visuel du jour, derrière — les infos sont dessus. */}
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

        {/* Les infos — sur le visuel, et rien d'autre. */}
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
            <span>{MAGASIN.nom} · {MAGASIN.rayon}</span>
            <span data-hero-heure="vrai">
              {String(heure).padStart(2, '0')}:00 · {lumiere.mot ?? 'LE JOUR'}
            </span>
            <span>{TICKET_COUPLE.convives} convives</span>
            <span data-hero-compte="vrai">
              {coches.length} ligne{coches.length > 1 ? 's' : ''} cochée{coches.length > 1 ? 's' : ''}
            </span>
          </span>
        </div>

        {/* LA MACHINE. */}
        <div className="relative flex w-full flex-col items-center">
          <MachineDeRipple
            heure={heure}
            lumiere={lumiere.mot ?? `${heure} H`}
            lignes={coches.length}
            total={totaux.total}
            convives={TICKET_COUPLE.convives}
            catégorie={catégorie}
            compte={compte}
            mot={mot}
            sortie={sortie}
            marques={marques}
            onCatégorie={choisirLaCatégorie}
            onObjet={poserUnObjet}
          />

          {/* Les vols : le papier part de la fente vers les portefeuilles. */}
          {vols.map((vol) => (
            <span
              key={vol.cle}
              data-vol={vol.portefeuille}
              className="vol-du-ticket pointer-events-none absolute left-1/2 top-[46%] z-30 h-14 w-[200px] -translate-x-1/2 border border-black/15 bg-[#FFFEF7]"
              style={{ ['--vol' as string]: String(vol.rang) }}
            />
          ))}
        </div>

        <p className="relative font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
          <span data-hero-total="vrai">total {euros(totaux.total)}</span> · cochez dessous, le ticket sort de la fente
        </p>
      </header>

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
                            onClick={() => cocher(ligne.id)}
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
                                {ligne.vers.map((p) => PORTEFEUILLES_MOTS[p]).join(' · ')}
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
            {totaux.articles} ligne{totaux.articles > 1 ? 's' : ''} · {totaux.incluses} incluse{totaux.incluses > 1 ? 's' : ''}
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
                  void navigator.clipboard?.writeText(adresseDuReçu());
                  avisUnMot(`${coches.length} lignes · le reçu est dans le lien`);
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
                onClick={() => setCoches([])}
                className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40 transition hover:border-white/50 hover:text-white"
              >
                vider
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

        {portefeuilles.length === 0 ? (
          <p data-portefeuilles="vides" className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-white/35">
            les portefeuilles attendent — cochez une ligne, le ticket sort et part
          </p>
        ) : (
          <div data-portefeuilles="pleins" className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {portefeuilles.map((ticket) => (
              <span
                key={ticket.portefeuille}
                data-portefeuille={ticket.portefeuille}
                data-lignes={ticket.lignes.length}
                data-total={ticket.total}
                data-papier={ticket.papier}
                className="flex flex-col gap-1 rounded-[16px] border border-white/10 bg-white/[0.03] p-4"
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-[14px] font-semibold">{PORTEFEUILLES_MOTS[ticket.portefeuille]}</span>
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
          className="fixed left-1/2 bottom-6 z-40 -translate-x-1/2 rounded-full border border-white/15 bg-black/85 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/80 backdrop-blur-md"
        >
          {avis}
        </span>
      )}
    </div>
  );
}
