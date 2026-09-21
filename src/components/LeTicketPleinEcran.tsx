import { OBJETS_DE_LA_FABRIQUE, pictoDuRipple } from '../lib/ripple';
import { CATÉGORIES_DU_TICKET, type LigneDuTicket } from '../lib/categoriesDuTicket';
import type { BudgetDuRêve, Rêve } from '../lib/codeDuMariage';
import type { TotauxDuTicket } from '../lib/portefeuille';
import { DJ_CHRONOLOGICAL_PHASES, GLOBAL_WEDDING_PLAYLIST_FULL } from '../lib/weddingDjPlaylist';
import { euros } from '../lib/superMariage';
import { marqueDuTampon } from '../lib/marquesDuTicket';

/* LE TICKET PLEIN ÉCRAN — L'APPLI EST LE TICKET
 *
 * « L'appli, c'est le ticket plein écran. » Il n'y a plus de machine, plus de
 * page : il y a **un papier**, qui prend l'écran, et que l'on scrolle. Tout est
 * dessus — les heures, la musique, les métiers, la table, les documents, le
 * site, le voyage, la totale — exactement comme un ticket de caisse imprimé :
 *
 * ```
 *   ┌──────────────────────────────┐
 *   │       SUPER MARIAGE          │  l'impression, en haut
 *   │  LE SPÉCIALISTE DU TICKET    │
 *   │  NUB-139 · CAISSE 3 · 23:00  │
 *   ├──────────────────────────────┤
 *   │  LES CHIFFRES                │  4 chiffres, le reste à financer en fluo
 *   │  LA JOURNÉE   ●─── 22:00     │  la timeline descend sur le papier
 *   │               ●─── 22:17     │  …et chaque heure s'y accroche
 *   │  LA MUSIQUE   1. Cérémonie   │  le plan du DJ, morceau par morceau
 *   │  LES 99 LIGNES               │  tout le magasin, imprimé
 *   │  LE VOYAGE    ▬▬▬▬▬▬░░░     │  le rêve, et ce qu'il reste
 *   │  TOTAL          41 320 €     │
 *   │  ▮▮▯▮▯▯▮▮▯  NUB-139          │  le code-barres
 *   ├──────────────────────────────┤
 *   │ (✉)(★)(✈)(◉)(▤)(⧉)(◎)      │  le pupitre : on tamponne le papier
 *   └──────────────────────────────┘
 * ```
 *
 * **Trois gestes, et rien d'autre :**
 * 1. **on coche une ligne** — elle passe au **fluo**, et le total se refait ;
 * 2. **on tamponne** — le picto pose sa marque sur le papier (`PAYÉ`, `MERCI`,
 *    `DÉPART`…), de travers, à l'encre ;
 * 3. **on partage** — le lien du mini-site part tel quel.
 *
 * Le papier est en chasse fixe, ivoire, avec ses dents en haut et en bas : c'est
 * un objet, pas une page. Il s'imprime (`@media print`) — et sur un ordinateur,
 * il prend la hauteur de l'écran, au large.
 */

/* ——————————————— CE QUI EST DÉJÀ IMPRIMÉ SUR LE PAPIER ——————————————— */

/** Les rayons de métiers : ceux dont toutes les lignes sont des métiers. */
const RAYONS_DE_MÉTIERS = CATÉGORIES_DU_TICKET.filter(
  (c) => c.lignes.length > 0 && c.lignes.every((l) => l.id.startsWith('metier-')),
).map((c) => c.id);

/** Les trois menus du magasin. */
const MENUS = CATÉGORIES_DU_TICKET.filter((c) => c.id.startsWith('menu-')).map((c) => c.id);

/** **Les sections du ticket**, dans l'ordre où l'on imprime : le jour, ce qu'on
 *  entend, ce qu'on mange, qui travaille, les petits prix, les papiers, le site. */
const SECTIONS: Array<{ id: string; mot: string; sous: string; catégories: string[]; temps?: boolean }> = [
  { id: 'temps', mot: 'LA JOURNÉE', sous: 'les heures, dans l’ordre', catégories: ['rayon-horaires'], temps: true },
  { id: 'musique', mot: 'LA MUSIQUE', sous: 'le plan de la nuit, moment par moment', catégories: ['rayon-musicien', 'rayon-dj'] },
  { id: 'table', mot: 'LA TABLE', sous: 'ce qui se sert', catégories: MENUS },
  { id: 'gens', mot: 'LES GENS', sous: 'les métiers du jour', catégories: RAYONS_DE_MÉTIERS },
  { id: 'petits-prix', mot: 'LES PETITS PRIX', sous: 'ce qui ne change pas le mariage', catégories: ['rayon-supplements'] },
  { id: 'documents', mot: 'LES DOCUMENTS', sous: 'ce qu’on demande, ce qu’on emporte', catégories: ['documents'] },
  { id: 'site', mot: 'LE SITE', sous: 'ce que les invités voient', catégories: ['site'] },
];

/** Les lignes d'une section, dans l'ordre du catalogue. */
const lignesDe = (catégories: string[]): LigneDuTicket[] =>
  CATÉGORIES_DU_TICKET.filter((c) => catégories.includes(c.id)).flatMap((c) => c.lignes);

/**
 * **Le ticket imprime chaque ligne une seule fois.** Une ligne peut être citée
 * par plusieurs rayons ; c'est le premier qui l'imprime, et les suivants
 * gardent les leurs. C'est ainsi que le papier tombe juste : 99 lignes, pas
 * une de plus.
 */
function lignesParSection(): Map<string, LigneDuTicket[]> {
  const prises = new Set<string>();
  const parSection = new Map<string, LigneDuTicket[]>();
  for (const section of SECTIONS) {
    const siennes = lignesDe(section.catégories).filter((l) => {
      if (prises.has(l.id)) return false;
      prises.add(l.id);
      return true;
    });
    parSection.set(section.id, siennes);
  }
  return parSection;
}

/** **Les neuf moments de la nuit**, avec leurs morceaux : c'est la musique. */
const MOMENTS_DE_LA_MUSIQUE = DJ_CHRONOLOGICAL_PHASES.filter((p) => p.id !== 'all').map((phase) => {
  const horaire = phase.label.match(/\((\d{1,2})h(\d{2})\)/);
  const mot = phase.label.replace(/^\d+\.\s*/, '').replace(/\s*\([^)]*\)\s*$/, '').toUpperCase();
  return {
    id: phase.id,
    mot,
    /** L'heure du moment, quand le plan la dit. */
    heure: horaire ? `${horaire[1]}:${horaire[2]}` : '',
    pistes: GLOBAL_WEDDING_PLAYLIST_FULL.filter((t) => t.phase === phase.id),
  };
});

/** Où les marques tombent : six places, puis on recommence. */
const PLACES: Array<{ top: string; left: string; tour: number }> = [
  { top: '6%', left: '7%', tour: -11 },
  { top: '21%', left: '46%', tour: 8 },
  { top: '38%', left: '11%', tour: -7 },
  { top: '55%', left: '42%', tour: 10 },
  { top: '72%', left: '8%', tour: -9 },
  { top: '88%', left: '48%', tour: 6 },
];

/** Le code-barres : il est fait du code du mariage, et de rien d'autre. */
const barresDe = (code: string) =>
  [...code.replace(/[^A-Z0-9]/gi, '')].flatMap((signe, rang) => {
    const valeur = signe.charCodeAt(0) + rang;
    return [1 + (valeur % 3), 1 + ((valeur >> 2) % 2)];
  });

/* ——————————————————————————————— LE TICKET ——————————————————————————————— */

export interface LeTicketPleinEcranProps {
  /** Le code du mariage — c'est lui, la signature du papier. */
  code: string;
  /** Le numéro imprimé en haut du ticket. */
  numero: string;
  dateLabel: string;
  /** L'heure du ticket : c'est elle qui dit « maintenant » sur la journée. */
  heure: number;
  /** Le visuel du jour, imprimé comme un coupon. */
  visuel: string | null;
  couple: { noms: string; lieu: string; convives: number };
  /** **Ce qui est coché** : les lignes prises passent au fluo, et comptent. */
  coches: string[];
  surCocher: (id: string) => void;
  totaux: TotauxDuTicket;
  /** Les cinq papiers, et ce qu'ils portent. */
  portefeuilles: Array<{ id: string; mot: string; marque: string; lignes: number; total: number }>;
  rêve: Rêve;
  budget: BudgetDuRêve;
  /** **Les marques posées sur le papier** : les objets tamponnés, dans l'ordre. */
  tampons: string[];
  surTamponner: (id: string) => void;
  /** **Le mot du dernier geste** : ce qui vient de se passer sur le papier. */
  mot: string | null;
  /** Le lien du mini-site, et les deux gestes qui vont avec. */
  adresseDuSite: string;
  surPartager: () => void;
  surSite: () => void;
}

export default function LeTicketPleinEcran({
  code,
  numero,
  dateLabel,
  heure,
  visuel,
  couple,
  coches,
  surCocher,
  totaux,
  portefeuilles,
  rêve,
  budget,
  tampons,
  surTamponner,
  mot,
  adresseDuSite,
  surPartager,
  surSite,
}: LeTicketPleinEcranProps) {
  const prises = new Set(coches);
  const payé = tampons.includes('tampon');
  const lignesDesSections = lignesParSection();

  /** **L'heure où l'on est** : la dernière heure du jour passée. C'est elle qui
   *  porte le repère « MAINTENANT », et le fluo. */
  const maintenant = (lignesDesSections.get('temps') ?? [])
    .filter((l) => Number(l.label.slice(0, 2)) <= heure)
    .at(-1)?.id;

  const heureDuJour = `${String(heure).padStart(2, '0')}:00`;

  /** Une ligne du papier : on la coche, elle passe au fluo. */
  const Ligne = ({ ligne, temps: estTemps }: { ligne: LigneDuTicket; temps?: boolean }) => {
    const prise = prises.has(ligne.id);
    const [minute, ...reste] = estTemps ? ligne.label.split(' · ') : [null, ...ligne.label.split(' · ')];
    const mot = estTemps ? reste.join(' · ') : ligne.label;
    return (
      <button
        type="button"
        data-ticket-ligne={ligne.id}
        data-cochee={prise}
        data-prix={ligne.prix}
        data-maintenant={ligne.id === maintenant ? 'vrai' : undefined}
        onClick={() => surCocher(ligne.id)}
        className={`relative flex w-full items-baseline gap-[0.6em] border-b border-dashed border-black/[0.14] py-[0.34em] text-left transition hover:bg-black/[0.04] ${
          prise ? 'text-[color:var(--vp-ink)]' : 'text-black/55'
        }`}
      >
        {estTemps ? (
          <>
            <span className="w-[2.9em] shrink-0 tabular-nums">{minute}</span>
            {/* Le point de l'heure, posé sur le trait du temps. */}
            <span
              aria-hidden="true"
              data-point={ligne.id === maintenant ? 'maintenant' : prise ? 'prise' : 'libre'}
              className={`absolute left-[3.35em] top-[0.62em] h-[0.5em] w-[0.5em] -translate-x-1/2 rounded-full border ${
                ligne.id === maintenant
                  ? 'border-[color:var(--vp-ink)] bg-[color:var(--vp-ink)]'
                  : prise
                    ? 'border-[color:var(--vp-ink)] bg-[var(--vp-fluo)]'
                    : 'border-black/25 bg-[#fffef7]'
              }`}
            />
          </>
        ) : null}
        <span className={`min-w-0 flex-1 ${prise ? 'vp-fluo' : ''}`}>{mot}</span>
        <span className="shrink-0 tabular-nums">
          {ligne.incluse ? 'inclus' : euros(ligne.prix * (ligne.quantite ?? 1))}
        </span>
        {prise && <span className="shrink-0 text-[0.85em] text-[color:var(--vp-muted)]">✓</span>}
      </button>
    );
  };

  return (
    <section
      id="le-ticket-plein"
      data-ticket-plein="vrai"
      data-ticket-code={code}
      data-ticket-cochees={coches.length}
      data-ticket-total={totaux.total}
      data-ticket-paye={payé}
      className="vp-comptoir relative min-h-svh w-full"
    >
      <div data-ticket-papier="vrai" className="relative mx-auto w-full max-w-[430px] sm:max-w-[500px] lg:max-w-[560px]">
        <div aria-hidden="true" data-ticket-dents="haut" className="vp-dents vp-dents-haut" />

        <div className="vp-papier relative px-[1.5em] pb-[1.1em] pt-[1.4em]">
          {/* ——————————————— LES MARQUES : LES TAMPONS POSÉS SUR LE PAPIER ——————————————— */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-30">
            {tampons.map((id, rang) => {
              const place = PLACES[rang % PLACES.length]!;
              const objet = OBJETS_DE_LA_FABRIQUE.find((o) => o.id === id);
              return (
                <span
                  key={`${id}-${rang}`}
                  data-tampon-pose={id}
                  data-tampon-mot={marqueDuTampon(id)}
                  className="vp-tampon absolute px-[0.9em] py-[0.4em] text-[1.15em]"
                  style={{ top: place.top, left: place.left, transform: `rotate(${place.tour}deg)` }}
                  title={objet?.nom ?? ''}
                >
                  {marqueDuTampon(id)}
                </span>
              );
            })}
          </div>

          {/* ——————————————— L'IMPRESSION : SUPER MARIAGE, EN HAUT ——————————————— */}
          <header data-ticket-entete="vrai" className="text-center">
            <h1 data-ticket-marque="vrai" className="text-[1.9em] font-bold uppercase leading-none tracking-[0.16em]">
              SUPER MARIAGE
            </h1>
            <p className="mt-[0.5em] text-[0.95em] uppercase tracking-[0.22em] text-black/60">
              Le spécialiste du ticket de caisse
            </p>
            <p className="mt-[0.9em] text-[0.95em] uppercase tracking-[0.1em]">
              {code} · CAISSE 3 · {heureDuJour}
            </p>
            <p className="mt-[0.25em] text-[0.95em] uppercase tracking-[0.1em] text-black/60">
              {dateLabel} · {couple.lieu}
            </p>
            <p className="mt-[0.25em] text-[0.95em] text-black/60">
              N° {numero} · {couple.convives} invités · {couple.noms}
            </p>
            {payé && (
              <p data-ticket-paye-mot="vrai" className="mt-[0.7em] text-[1.05em] font-bold uppercase tracking-[0.2em]">
                ✓ PAYÉ · MERCI
              </p>
            )}
          </header>

          {/* ——————————————— LE COUPON : LE VISUEL DU JOUR, IMPRIMÉ ——————————————— */}
          {visuel && (
            <figure data-ticket-coupon="jour" className="relative mt-[1em] overflow-hidden">
              <img src={visuel} alt="" className="h-[6.4em] w-full object-cover" style={{ filter: 'saturate(0.85) contrast(1.06)' }} />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-2 bg-gradient-to-t from-black/80 to-transparent px-[0.7em] pb-[0.35em] pt-[1.6em] text-[0.85em] uppercase tracking-[0.16em] text-white">
                <span>LE JOUR</span>
                <span className="tabular-nums">{dateLabel}</span>
              </figcaption>
            </figure>
          )}

          {/* ——————————————— LES CHIFFRES DU MARIAGE ——————————————— */}
          <section data-ticket-chiffres="vrai" className="mt-[1.1em] grid grid-cols-2 gap-x-[0.8em] gap-y-[0.7em]">
            {[
              { mot: 'LIGNES', valeur: String(totaux.articles), fluo: false },
              { mot: 'LE MARIAGE', valeur: euros(totaux.total), fluo: false },
              { mot: 'MIS DE CÔTÉ', valeur: euros(budget.misDeCôté), fluo: true },
              { mot: 'RESTE À FINANCER', valeur: euros(budget.reste), fluo: true },
            ].map((chiffre) => (
              <p key={chiffre.mot} className="flex flex-col gap-[0.15em]">
                <span className="text-[0.85em] uppercase tracking-[0.16em] text-black/55">{chiffre.mot}</span>
                <span className={`text-[1.35em] leading-none tabular-nums ${chiffre.fluo ? 'vp-fluo' : ''}`}>
                  {chiffre.valeur}
                </span>
              </p>
            ))}
          </section>

          {/* ——————————————— LES SECTIONS : TOUT LE MAGASIN, IMPRIMÉ ——————————————— */}
          {SECTIONS.map((section) => {
            const àMoi = lignesDesSections.get(section.id) ?? [];
            const prisesIci = àMoi.filter((l) => prises.has(l.id)).length;
            return (
              <section key={section.id} data-ticket-section={section.id} className="mt-[1.3em]">
                <p className="flex items-baseline justify-between gap-2 border-b border-black/60 pb-[0.25em] text-[0.95em] uppercase tracking-[0.14em]">
                  <span className="font-bold">{section.mot}</span>
                  <span className="tabular-nums text-black/55">
                    {prisesIci}/{àMoi.length}
                  </span>
                </p>
                <p className="mt-[0.3em] text-[0.85em] text-black/45">{section.sous}</p>

                <div className={section.temps ? 'vp-temps mt-[0.5em]' : 'mt-[0.5em]'}>
                  {àMoi.map((ligne) => (
                    <Ligne key={ligne.id} ligne={ligne} temps={section.temps} />
                  ))}
                </div>

                {/* ——————— LA MUSIQUE : LE PLAN DE LA NUIT, EN CLAIR ——————— */}
                {section.id === 'musique' && (
                  <ol data-ticket-plan="vrai" className="mt-[0.7em] flex flex-col gap-[0.5em]">
                    {MOMENTS_DE_LA_MUSIQUE.map((moment, rang) => (
                      <li key={moment.id} data-ticket-moment={moment.id} className="flex flex-col">
                        <span className="flex items-baseline justify-between gap-2 text-[0.9em] uppercase tracking-[0.1em]">
                          <span>
                            {rang + 1}. {moment.mot}
                          </span>
                          <span className="tabular-nums text-black/50">{moment.heure}</span>
                        </span>
                        {moment.pistes.map((piste) => (
                          <span
                            key={piste.id}
                            data-ticket-morceau={piste.id}
                            className="flex items-baseline gap-[0.6em] pl-[1.2em] text-[0.9em] text-black/60"
                          >
                            <span className="min-w-0 flex-1 truncate">
                              {piste.artist} — {piste.title}
                            </span>
                            <span className="shrink-0 tabular-nums text-black/35">{piste.audioBpm}</span>
                          </span>
                        ))}
                      </li>
                    ))}
                  </ol>
                )}

                {/* ——————— LE SITE : CE QUE LES INVITÉS VOIENT ——————— */}
                {section.id === 'site' && (
                  <p className="mt-[0.7em] flex flex-col gap-[0.25em] text-[0.9em]">
                    <span className="uppercase tracking-[0.1em] text-black/55">LE LIEN QUI PART</span>
                    <span data-ticket-adresse={adresseDuSite} className="break-all">
                      {adresseDuSite}
                    </span>
                  </p>
                )}
              </section>
            );
          })}

          {/* ——————————————— LE VOYAGE : LA CIBLE ——————————————— */}
          <section data-ticket-voyage="vrai" data-ticket-reste={budget.reste} className="mt-[1.3em]">
            <p className="flex items-baseline justify-between gap-2 border-b border-black/60 pb-[0.25em] text-[0.95em] uppercase tracking-[0.14em]">
              <span className="font-bold">LE VOYAGE</span>
              <span className="tabular-nums text-black/55">{Math.round(budget.part * 100)} %</span>
            </p>
            <p className="mt-[0.5em] text-[1.15em] uppercase tracking-[0.06em]">{rêve.mot}</p>
            <p className="mt-[0.2em] text-[0.9em] text-black/55">{rêve.comprend.join(' · ')}</p>
            <p className="vp-jauge mt-[0.6em] !h-[0.55em]">
              <i style={{ width: `${Math.round(budget.part * 100)}%` }} />
            </p>
            <p className="mt-[0.4em] flex items-baseline justify-between gap-2 text-[0.9em]">
              <span className="text-black/55">MIS DE CÔTÉ</span>
              <span className="tabular-nums">{euros(budget.misDeCôté)}</span>
            </p>
            <p className="flex items-baseline justify-between gap-2 text-[1.1em]">
              <span className="uppercase tracking-[0.1em]">RESTE À FINANCER</span>
              <span className="vp-fluo tabular-nums">{euros(budget.reste)}</span>
            </p>
          </section>

          {/* ——————————————— LE PIED : LES TOTAUX, LES PAPIERS, LE CODE ——————————————— */}
          <footer data-ticket-pied="vrai" className="mt-[1.3em]">
            <p className="flex items-baseline justify-between gap-2 text-[0.9em] text-black/55">
              <span>SOUS-TOTAL ({totaux.articles} LIGNES)</span>
              <span className="tabular-nums">{euros(totaux.sousTotal)}</span>
            </p>
            <p className="flex items-baseline justify-between gap-2 text-[0.9em] text-black/55">
              <span>REMISE FIDÉLITÉ</span>
              <span className="tabular-nums">−{euros(totaux.remise)}</span>
            </p>
            <p className="flex items-baseline justify-between gap-2 text-[0.9em] text-black/55">
              <span>TVA INCLUSE</span>
              <span className="tabular-nums">{euros(totaux.tva)}</span>
            </p>
            <p className="mt-[0.4em] flex items-baseline justify-between gap-2 border-y-2 border-black/70 py-[0.35em] text-[1.5em] font-bold uppercase tracking-[0.06em]">
              <span>TOTAL</span>
              <span data-ticket-total-mot="vrai" className="tabular-nums">
                {euros(totaux.total)}
              </span>
            </p>
            <p className="mt-[0.35em] flex items-baseline justify-between gap-2 text-[0.9em]">
              <span className="uppercase tracking-[0.1em] text-black/55">{payé ? 'PAYÉ' : 'À PAYER'}</span>
              <span className="tabular-nums">{payé ? euros(totaux.total) : 'en cours'}</span>
            </p>

            <p data-ticket-portefeuilles="vrai" className="mt-[0.9em] text-[0.85em] uppercase tracking-[0.12em] text-black/55">
              LES CINQ PAPIERS
            </p>
            {portefeuilles.map((p) => (
              <p
                key={p.id}
                data-portefeuille-ticket={p.id}
                className="flex items-baseline justify-between gap-2 text-[0.9em] text-black/60"
              >
                <span className="truncate">
                  {p.mot} — {p.marque}
                </span>
                <span className="shrink-0 tabular-nums">
                  {p.lignes} l · {euros(p.total)}
                </span>
              </p>
            ))}

            <div className="mt-[0.9em] flex items-end justify-between gap-[1em]">
              <span aria-hidden="true" data-ticket-codebarres="vrai" className="vp-codebarres shrink-0">
                {barresDe(code).map((largeur, rang) => (
                  <i key={rang} style={{ width: `${largeur}px`, height: rang % 3 === 0 ? '100%' : '78%' }} />
                ))}
              </span>
              <span className="text-right text-[0.85em] uppercase tracking-[0.12em] text-black/55">
                <span className="block">{code}</span>
                <span className="block">{couple.noms}</span>
              </span>
            </div>

            <p className="mt-[1em] text-center text-[1.05em] uppercase tracking-[0.18em]">
              Merci · et bon voyage
            </p>
            <p className="mt-[0.3em] text-center text-[0.8em] uppercase tracking-[0.14em] text-black/40">
              AIME · magazine 54 semaines · ouvert quand tout est fermé
            </p>
          </footer>

          {/* ——————————————— LE PUPITRE : LES TAMPONS, TOUJOURS SOUS LE POUCE ——————————————— */}
          <div
            data-ticket-pupitre="vrai"
            className="vp-pupitre vp-non-imprimable -mx-[1.5em] mt-[1.2em] px-[1.2em] py-[0.7em]"
          >
            {mot && (
              <p data-mot-du-geste={mot} className="mb-[0.45em] truncate text-[0.85em] uppercase tracking-[0.14em] text-black/55">
                {mot}
              </p>
            )}
            <div className="flex items-center justify-between gap-[0.5em]">
              {OBJETS_DE_LA_FABRIQUE.map((objet) => {
                const Icone = pictoDuRipple(objet.pictoParDefaut).Icone;
                const posée = tampons.includes(objet.id);
                return (
                  <button
                    key={objet.id}
                    type="button"
                    data-tampon={objet.id}
                    data-tampon-marque={marqueDuTampon(objet.id)}
                    data-tampon-posee={posée}
                    title={`${objet.nom} — ${objet.sens}`}
                    aria-label={`${objet.nom} : tamponner « ${marqueDuTampon(objet.id)} »`}
                    onClick={() => surTamponner(objet.id)}
                    className={`flex h-[2.6em] w-[2.6em] shrink-0 items-center justify-center rounded-full border transition ${
                      posée
                        ? 'border-[color:var(--vp-ink)] bg-[color:var(--vp-ink)] text-[#fffef7]'
                        : 'border-black/20 text-black/60 hover:border-[color:var(--vp-ink)] hover:text-[color:var(--vp-ink)]'
                    }`}
                  >
                    <Icone size={14} />
                  </button>
                );
              })}
              <button
                type="button"
                data-action="partager-le-ticket"
                onClick={surPartager}
                className="shrink-0 font-mono text-[0.85em] uppercase tracking-[0.12em] underline decoration-black/25 underline-offset-[0.25em] hover:decoration-black"
              >
                partager
              </button>
              <button
                type="button"
                data-action="voir-le-site"
                onClick={surSite}
                className="shrink-0 font-mono text-[0.85em] uppercase tracking-[0.12em] text-black/55 underline decoration-black/20 underline-offset-[0.25em] hover:text-black"
              >
                le site
              </button>
            </div>
          </div>
        </div>

        <div aria-hidden="true" data-ticket-dents="bas" className="vp-dents vp-dents-bas" />
      </div>

      <p className="pb-[1.5em] pt-[1.2em] text-center">
        <a
          href="#le-visuel"
          data-action="descendre"
          aria-label="descendre : le site, en dessous"
          className="font-mono text-[13px] text-black/35 transition hover:text-black"
        >
          ↓
        </a>
      </p>
    </section>
  );
}
