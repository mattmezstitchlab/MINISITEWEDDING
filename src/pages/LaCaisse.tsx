import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  CATÉGORIES_DU_TICKET,
  GROUPES_DU_TICKET,
  LIGNES_DU_TICKET,
  catégorieParDéfaut,
  compteParCatégorie,
  euros,
  lignesDuneCatégorie,
  ligneParId,
  marqueDeLaFamille,
} from '../lib/categoriesDuTicket';
import { portefeuillesDesCoches, portefeuillesVisés, totauxDuTicket } from '../lib/portefeuille';
import { MAGASIN, TICKET_COUPLE } from '../lib/superMariage';
import { heureDeLaCapsule } from '../lib/capsuleCommande';
import { lumiereDeLHeure, teinteDeLHeure } from '../lib/lumiereDuJour';
import { magazineDeLaDate } from '../lib/semaines';
import { visuelsDuJour } from '../lib/visuelsDuMagazine';
import { formatDateLong } from '../lib/format';
import CadranDuMagazine from '../components/CadranDuMagazine';
import TicketCaisse from '../components/TicketCaisse';

/* LE SPÉCIALISTE DU TICKET — COCHER, ET C'EST TOUT
 *
 * Un écran, et une seule chose à faire : **cocher**. Tout le produit est rangé
 * par catégories — le jour J (ce qui a un prix), votre site (ce qui s'affiche),
 * les documents (ce qu'on emporte) — et chaque ligne cochée **sort en ticket**,
 * par le haut de l'écran, pour aller dans les portefeuilles : le couple, les
 * invités, la famille, le DJ, les métiers.
 *
 * ```
 * ┌──────────────────────────────────────────────┬──────────────┐
 * │  LE VISUEL, ET LES INFOS DESSUS              │              │
 * │  Nora & Adam · 6 février 2027 · 64 convives  │  LE TICKET   │
 * │  ◷ 22:00 · LE SOIR              TOTAL 5 472 €│  qui sort    │
 * ├──────────────────────────────────────────────┤  du haut     │
 * │  LE JOUR J · VOTRE SITE · LES DOCUMENTS      │              │
 * │  HORAIRES ▸ CUISINE ▸ IMAGES ▸ …             │              │
 * │  ☑ 22:17 · Cérémonie — rayon 7       900 €   │              │
 * │  ☐ 22:30 · Cocktail — surgelés     1 200 €   │              │
 * ├──────────────────────────────────────────────┴──────────────┤
 * │  ● le couple 5 472 €   ◔ les invités 891 €   ♪ le DJ   ✳ les métiers │
 * └──────────────────────────────────────────────────────────────┘
 * ```
 *
 * Le ticket qui sort, le vol vers les portefeuilles, et l'adresse : le caddie
 * tient dans le lien (`?coches=…`), donc **le lien est le reçu**.
 */

/** Le caddie de l'adresse : ce qui est coché, dans l'ordre du catalogue. */
function cochesDeLAdresse(valeur: string | null): string[] {
  const demandées = (valeur ?? '').split(',').map((id) => id.trim()).filter(Boolean);
  return LIGNES_DU_TICKET.filter((l) => demandées.includes(l.id)).map((l) => l.id);
}

/** Un vol : un papier qui part du haut de l'écran vers un portefeuille. */
interface Vol {
  cle: string;
  ligne: string;
  portefeuille: string;
  /** Sa place dans la file des portefeuilles : c'est sa destination. */
  rang: number;
}

export default function LaCaisse() {
  const [params, setParams] = useSearchParams();

  const [coches, setCoches] = useState<string[]>(() => cochesDeLAdresse(params.get('coches')));
  const [catégorie, setCatégorie] = useState<string>(() => catégorieParDéfaut());
  const [vols, setVols] = useState<Vol[]>([]);
  /** Le papier qui vient de sortir : sa ligne, et son numéro de passage. */
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
  const visuels = visuelsDuJour(date);
  const visuel = visuels.couverture.url;
  const fond = teinteDeLHeure(heure, '#0B0C12', magazine.palette.accent);

  /* ——————————————— COCHER : LE TICKET SORT, ET IL PART ——————————————— */

  const cocher = (id: string) => {
    const déjà = coches.includes(id);
    const suites = déjà ? coches.filter((c) => c !== id) : [...coches, id];
    setCoches(suites);

    if (déjà) return;

    /* Le papier sort du haut, puis part vers les portefeuilles concernés. */
    passage.current += 1;
    const cle = `${id}-${passage.current}`;
    setPresse({ cle, ligne: id });
    const visés = portefeuillesVisés([id]);
    const rangs = visés.map((p) => PORTEFEUILLES_RANGS[p] ?? 0);
    setVols((v) => [...v, ...visés.map((p, i) => ({ cle: `${cle}-${p}`, ligne: id, portefeuille: p, rang: rangs[i]! }))]);

    window.setTimeout(() => setPresse((p) => (p && p.cle === cle ? null : p)), 1700);
    window.setTimeout(() => {
      setVols((v) => v.filter((x) => !x.cle.startsWith(cle)));
    }, 1000);
  };

  const cocherToutLaCatégorie = () => {
    const ids = lignesDuneCatégorie(catégorie);
    const toutesPrises = ids.every((id) => coches.includes(id));
    const suites = toutesPrises ? coches.filter((c) => !ids.includes(c)) : [...new Set([...coches, ...ids])];
    setCoches(suites);
    if (!toutesPrises) {
      passage.current += 1;
      const cle = `${catégorie}-${passage.current}`;
      setPresse({ cle, ligne: ids[0]! });
      window.setTimeout(() => setPresse((p) => (p && p.cle === cle ? null : p)), 1700);
    }
  };

  const avisUnMot = (mot: string) => {
    setAvis(mot);
    window.setTimeout(() => setAvis(null), 2400);
  };

  const adresseDuReçu = () => `${window.location.origin}${window.location.pathname}?coches=${coches.join(',')}`;

  const catégorieCourante = CATÉGORIES_DU_TICKET.find((c) => c.id === catégorie) ?? CATÉGORIES_DU_TICKET[0]!;
  const papierDuCouple = portefeuilles.find((p) => p.portefeuille === 'couple') ?? portefeuilles[0] ?? null;
  const ligneSortie = presse ? ligneParId(presse.ligne) : null;

  return (
    <div
      data-page="ticket"
      data-cochees={coches.length}
      data-total={totaux.total}
      data-catégorie={catégorie}
      data-lumiere={lumiere.mot ?? `${heure} H`}
      className="fixed inset-0 overflow-hidden text-white"
      style={{ background: fond }}
    >
      {/* ————————————————— LE HÉROS : LE VISUEL, ET LES INFOS DESSUS ————————————————— */}
      <header data-hero="ticket" className="absolute inset-x-0 top-0 z-10 h-[42svh] overflow-hidden md:h-[38svh] md:right-[430px]">
        {visuel ? (
          <img
            src={visuel}
            alt=""
            data-visuel="couverture"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: `brightness(${0.55 + lumiere.clarte * 0.35})` }}
          />
        ) : (
          <span data-visuel="aucun" aria-hidden="true" className="absolute inset-0" style={{ background: magazine.palette.fond }} />
        )}
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35" />

        {/* Les infos, **sur** le visuel — et rien d'autre. */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 sm:p-6">
          <span className="flex items-center gap-3">
            <CadranDuMagazine
              heure={heure}
              chapitre={magazine.numero % 7 || 7}
              fond="rgba(11,12,18,0.45)"
              encre="#F3F1ED"
              accent={magazine.palette.accent}
              vignette
              className="h-10 w-10 shrink-0"
            />
            <span className="flex flex-col">
              <span data-hero-noms="vrai" className="vp-title text-[26px] leading-none sm:text-[34px]">
                {TICKET_COUPLE.noms}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">
                {formatDateLong(TICKET_COUPLE.date)} · {TICKET_COUPLE.venue} · {TICKET_COUPLE.convives} convives
              </span>
            </span>
          </span>

          <span className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">
            <span>{MAGASIN.nom} · {MAGASIN.rayon}</span>
            <span data-hero-heure="vrai">{String(heure).padStart(2, '0')}:00 · {lumiere.mot ?? 'LE JOUR'}</span>
            <span data-hero-compte="vrai">{coches.length} ligne{coches.length > 1 ? 's' : ''} cochée{coches.length > 1 ? 's' : ''}</span>
            <span data-hero-total="vrai" className="ml-auto text-[18px] tracking-[0.06em] text-white">
              TOTAL {euros(totaux.total)}
            </span>
          </span>
        </div>
      </header>

      {/* ————————————————— LE TICKET QUI SORT DU HAUT DE L'ÉCRAN ————————————————— */}
      {ligneSortie && (
        <div
          data-presse="sortie"
          data-presse-ligne={ligneSortie.id}
          className="pointer-events-none absolute inset-x-0 top-0 z-40 flex justify-center"
        >
          <span className="presse-du-haut flex w-full max-w-[320px] flex-col gap-1 border-b border-black/20 bg-[#FFFEF7] px-4 py-3 font-mono text-[11px] text-black shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <span className="flex items-baseline justify-between gap-3">
              <span className="truncate font-bold uppercase tracking-[0.1em]">{ligneSortie.label}</span>
              <span className="shrink-0 tabular-nums">{ligneSortie.incluse ? 'inclus' : euros(ligneSortie.prix * (ligneSortie.quantite ?? 1))}</span>
            </span>
            <span className="flex items-baseline justify-between gap-3 text-[10px] text-black/50">
              <span className="truncate">{ligneSortie.detail}</span>
              <span className="shrink-0">{portefeuillesVisés([ligneSortie.id]).map((p) => PORTEFEUILLES_MOTS[p]).join(' · ')}</span>
            </span>
          </span>
        </div>
      )}

      {/* ————————————————— LES VOLS : LE PAPIER VA DANS LES PORTEFEUILLES ————————————————— */}
      {vols.map((vol) => (
        <span
          key={vol.cle}
          data-vol={vol.portefeuille}
          className="vol-du-ticket pointer-events-none absolute left-1/2 top-[38svh] z-30 h-16 w-[220px] -translate-x-1/2 border border-black/15 bg-[#FFFEF7]"
          style={{ ['--vol' as string]: String(vol.rang) }}
        />
      ))}

      {/* ————————————————— LE CORPS : LES CATÉGORIES, ET LES LIGNES À COCHER ————————————————— */}
      <main className="absolute inset-x-0 bottom-[58px] top-[42svh] z-10 md:bottom-[54px] md:top-[38svh] md:right-[430px]">
        {/* Les trois familles de catégories — et c'est tout ce qu'il y a à comprendre. */}
        <nav data-groupes="vrai" className="flex items-center gap-3 px-4 pt-3 sm:px-6">
          {GROUPES_DU_TICKET.map((groupe) => {
            const lignesDuGroupe = CATÉGORIES_DU_TICKET.filter((c) => c.groupe === groupe.id).flatMap((c) => c.lignes);
            const prises = lignesDuGroupe.filter((l) => coches.includes(l.id)).length;
            const ici = catégorieCourante.groupe === groupe.id;
            return (
              <button
                key={groupe.id}
                type="button"
                data-groupe={groupe.id}
                data-actif={ici ? 'true' : 'false'}
                onClick={() => setCatégorie(CATÉGORIES_DU_TICKET.find((c) => c.groupe === groupe.id)!.id)}
                className={`font-mono text-[10px] uppercase tracking-[0.16em] transition ${
                  ici ? 'text-white' : 'text-white/40 hover:text-white/80'
                }`}
              >
                {groupe.mot}
                {prises > 0 && <span className="ml-1 text-[#7DE2B0]">{prises}</span>}
              </button>
            );
          })}
        </nav>

        {/* Les catégories de la famille : un mot chacune, avec son compte. */}
        <div data-categories="vrai" className="mt-2 flex gap-1.5 overflow-x-auto px-4 pb-2 sm:px-6">
          {CATÉGORIES_DU_TICKET.filter((c) => c.groupe === catégorieCourante.groupe).map((c) => (
            <button
              key={c.id}
              type="button"
              data-categorie-mot={c.id}
              data-actif={c.id === catégorie ? 'true' : 'false'}
              data-compte={compte[c.id] ?? 0}
              onClick={() => setCatégorie(c.id)}
              className={`shrink-0 border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] transition ${
                c.id === catégorie ? 'border-white/70 text-white' : 'border-white/15 text-white/50 hover:border-white/40 hover:text-white/85'
              }`}
            >
              {c.mot}
              {(compte[c.id] ?? 0) > 0 && <span className="ml-1 text-[#7DE2B0]">{compte[c.id]}</span>}
            </button>
          ))}
        </div>

        {/* Les lignes : on coche. Rien d'autre. */}
        <div className="h-[calc(100%-5.5rem)] overflow-y-auto overscroll-contain px-4 pb-6 sm:px-6">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">{catégorieCourante.sous}</span>
            <button
              type="button"
              data-action="tout-le-rayon"
              onClick={cocherToutLaCatégorie}
              className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45 transition hover:text-white"
            >
              tout prendre
            </button>
          </div>

          <ul data-lignes="vrai" className="mt-2 flex flex-col">
            {catégorieCourante.lignes.map((ligne) => {
              const prise = coches.includes(ligne.id);
              const vers = ligne.vers.map((p) => PORTEFEUILLES_MOTS[p]).join(' · ');
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
                      className={`mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center border text-[10px] leading-none ${
                        prise ? 'border-[#7DE2B0] text-[#7DE2B0]' : 'border-white/25 text-transparent'
                      }`}
                    >
                      ✓
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] leading-tight">{ligne.label}</span>
                      <span className="mt-0.5 block truncate font-mono text-[10px] uppercase tracking-[0.1em] text-white/35">
                        {vers}
                        {ligne.promo ? ' · PROMO RAYON 7' : ''}
                        {ligne.incluse ? ' · INCLUS' : ''}
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

          <p className="mt-3">
            <Link
              to="/magazine?monde=magasin"
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/35 underline decoration-white/15 underline-offset-4 transition hover:text-white"
            >
              tout voir en cases
            </Link>
          </p>
        </div>
      </main>

      {/* ————————————————— LE TICKET, À DROITE ————————————————— */}
      <aside className="absolute inset-y-0 right-0 z-20 hidden w-[430px] flex-col overflow-y-auto overscroll-contain border-l border-white/10 bg-black/45 px-5 pb-16 pt-4 backdrop-blur-md md:flex">
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

        <div className="mx-auto mt-4 flex w-full max-w-[420px] flex-wrap items-center gap-1.5">
          <button
            type="button"
            data-action="emporter"
            disabled={!coches.length}
            onClick={() => {
              void navigator.clipboard?.writeText(adresseDuReçu());
              avisUnMot(`${coches.length} lignes · le reçu est dans le lien`);
            }}
            className="border border-white/25 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/75 transition hover:border-white/60 hover:text-white disabled:opacity-30"
          >
            emporter le reçu
          </button>
          <button
            type="button"
            data-action="imprimer"
            onClick={() => window.print()}
            className="border border-white/25 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/75 transition hover:border-white/60 hover:text-white"
          >
            imprimer
          </button>
          <button
            type="button"
            data-action="vider"
            onClick={() => setCoches([])}
            className="border border-white/15 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40 transition hover:border-white/50 hover:text-white"
          >
            vider
          </button>
        </div>

        <p className="mx-auto mt-3 w-full max-w-[420px] font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-white/30">
          {totaux.incluses > 0 && `${totaux.incluses} ligne${totaux.incluses > 1 ? 's' : ''} incluses · `}
          {MAGASIN.slogan} · tarifs indicatifs, aucun paiement réel
        </p>
      </aside>

      {/* ————————————————— LES PORTEFEUILLES : LÀ OÙ LE TICKET ARRIVE ————————————————— */}
      <footer
        data-portefeuilles="vrai"
        className="absolute inset-x-0 bottom-0 z-30 flex items-stretch justify-between gap-1 border-t border-white/10 bg-black/60 px-2 py-2 backdrop-blur-md sm:px-4">
        {portefeuilles.length === 0 && (
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">
            les portefeuilles attendent — cochez une ligne, le ticket sort et part
          </span>
        )}
        {portefeuilles.length > 0 &&
          portefeuilles.map((ticket) => (
            <span
              key={ticket.portefeuille}
              data-portefeuille={ticket.portefeuille}
              data-lignes={ticket.lignes.length}
              data-total={ticket.total}
              data-papier={ticket.papier}
              className="flex min-w-0 flex-1 flex-col items-start gap-0.5 px-1"
            >
              <span className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-white/80">
                {PORTEFEUILLES_MOTS[ticket.portefeuille]}
              </span>
              <span className="truncate font-mono text-[9px] uppercase tracking-[0.12em] text-white/35">
                {ticket.lignes.length} ligne{ticket.lignes.length > 1 ? 's' : ''} · {ticket.papier}
              </span>
              <span className="font-mono text-[11px] tabular-nums text-[#7DE2B0]">
                {ticket.total > 0 ? euros(ticket.total) : 'inclus'}
              </span>
            </span>
          ))}
      </footer>

      {avis && (
        <span
          data-avis="ticket"
          className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 border border-white/15 bg-black/85 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/80 backdrop-blur-md"
        >
          {avis}
        </span>
      )}
    </div>
  );
}

/** Les portefeuilles, par leur mot — et leur rang : c'est leur place à l'écran. */
const PORTEFEUILLES_MOTS: Record<string, string> = {
  couple: 'le couple',
  invites: 'les invités',
  famille: 'la famille',
  dj: 'le DJ',
  metier: 'les métiers',
};

const PORTEFEUILLES_RANGS: Record<string, number> = {
  couple: 0,
  invites: 1,
  famille: 2,
  dj: 3,
  metier: 4,
};
