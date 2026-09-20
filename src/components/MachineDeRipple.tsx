import { OBJETS_DE_LA_FABRIQUE, pictoDuRipple } from '../lib/ripple';
import { CATÉGORIES_DU_TICKET, GROUPES_DU_TICKET } from '../lib/categoriesDuTicket';
import { euros } from '../lib/superMariage';

/* LA MACHINE — LE PETIT ÉCRAN, LES BOUTONS RONDS, ET LA FENTE
 *
 * C'est la machine de Ripple, au centre du héros : un petit écran qui dit où
 * l'on en est, des **boutons ronds** — les objets du Ripple (reçu, carte,
 * timbre, tampon, ticket, avion, sticker) **et les catégories** — et par-dessus
 * tout, **la fente** : c'est de là que le ticket sort.
 *
 * ```
 * ┌──────────────────────────────────┐
 * │ ┌──────────────────────────────┐ │  l'écran
 * │ │ SUPER MARIAGE      CAISSE 3  │ │
 * │ │ 22:00 · LE SOIR    64 CONVIVES│ │
 * │ │ > 22:17 · CÉRÉMONIE — RAYON 7 │ │
 * │ │ 7 LIGNES      TOTAL  5 472 €  │ │
 * │ └──────────────────────────────┘ │
 * │ ▬▬▬▬▬▬▬▬▬  LA FENTE  ▬▬▬▬▬▬▬▬▬▬ │
 * │        ┌────────────────┐        │  le ticket qui sort
 * │        │ 22:17 · CÉRÉM. │        │
 * │        └────────────────┘        │
 * │  (●)(✉)(♦)(◉)(▤)(✈)(★)           │  les boutons ronds : les objets
 * │  (LE JOUR J)(VOTRE SITE)(DOCS)   │  les boutons ronds : les familles
 * │  (HORAIRES)(CUISINE)(IMAGES)…    │  les boutons ronds : les catégories
 * └──────────────────────────────────┘
 * ```
 *
 * La machine ne décide de rien : elle montre l'état, elle rapporte les gestes.
 */

export interface SortieDeLaFente {
  label: string;
  prix: string;
  vers: string;
}

export interface MachineDeRippleProps {
  /** L'heure du ticket, et son mot : « LE SOIR », « GOLDEN HOUR ». */
  heure: number;
  lumiere: string;
  /** Ce que l'écran annonce, ligne à ligne. */
  lignes: number;
  total: number;
  convives: number;
  /** La catégorie ouverte, et ce qu'elle contient déjà. */
  catégorie: string;
  compte: Record<string, number>;
  /** Le mot du dernier geste — il s'affiche sur l'écran. */
  mot: string | null;
  /** Le papier qui sort de la fente, et les marques posées dessus. */
  sortie: SortieDeLaFente | null;
  marques: string[];
  /** Les gestes. */
  onCatégorie: (id: string) => void;
  onObjet: (id: string) => void;
}

/** Ce que la machine compte dans une famille — la somme de ses lignes cochées. */
function lignesPrisesDans(groupe: string, compte: Record<string, number>): number {
  return CATÉGORIES_DU_TICKET.filter((c) => c.groupe === groupe).reduce((n, c) => n + (compte[c.id] ?? 0), 0);
}

export default function MachineDeRipple({
  heure,
  lumiere,
  lignes,
  total,
  convives,
  catégorie,
  compte,
  mot,
  sortie,
  marques,
  onCatégorie,
  onObjet,
}: MachineDeRippleProps) {
  const ouverte = CATÉGORIES_DU_TICKET.find((c) => c.id === catégorie) ?? CATÉGORIES_DU_TICKET[0]!;
  const catégoriesDuGroupe = CATÉGORIES_DU_TICKET.filter((c) => c.groupe === ouverte.groupe);

  return (
    <div data-machine="ripple" className="relative w-full max-w-[560px]">
      <div className="relative rounded-[26px] border border-white/12 bg-gradient-to-b from-[#1B1D24] to-[#0E1015] p-3 shadow-[0_40px_90px_rgba(0,0,0,0.65)] sm:p-4">
        {/* ————————————————— LE PETIT ÉCRAN ————————————————— */}
        <div
          data-ecran="ripple"
          className="rounded-[12px] border border-white/10 bg-[#06120C] px-3 py-2.5 font-mono text-[10.5px] leading-relaxed text-[#7DE2B0] shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]"
        >
          <span className="flex items-baseline justify-between gap-3 text-[#7DE2B0]/70">
            <span className="uppercase tracking-[0.18em]">SUPER MARIAGE</span>
            <span className="uppercase tracking-[0.18em]">CAISSE 3</span>
          </span>
          <span className="mt-0.5 flex items-baseline justify-between gap-3 text-[#7DE2B0]/50">
            <span className="uppercase tracking-[0.16em]">
              {String(heure).padStart(2, '0')}:00 · {lumiere}
            </span>
            <span className="uppercase tracking-[0.16em]">{convives} CONVIVES</span>
          </span>

          {/* La dernière ligne cochée : c'est elle que la fente vient de sortir. */}
          <span className="mt-1.5 block truncate text-[11.5px] text-[#7DE2B0]">
            {'> '}
            {sortie ? `${sortie.label} — ${sortie.prix}` : `> ${ouverte.mot} — cochez une ligne`}
          </span>
          <span className="block truncate text-[10px] text-[#7DE2B0]/45">
            {sortie ? `▸ ${sortie.vers}` : `▸ ${ouverte.sous}`}
          </span>

          <span className="mt-1.5 flex items-baseline justify-between gap-3 border-t border-[#7DE2B0]/20 pt-1.5">
            <span className="uppercase tracking-[0.16em]">
              {lignes} LIGNE{lignes > 1 ? 'S' : ''}
            </span>
            <span className="text-[13px] tracking-[0.06em]">{euros(total)}</span>
          </span>

          {mot && (
            <span data-ecran-mot="vrai" className="mt-0.5 block truncate text-[10px] uppercase tracking-[0.14em] text-white/55">
              {mot}
            </span>
          )}
        </div>

        {/* ————————————————— LA FENTE, ET LE TICKET QUI EN SORT ————————————————— */}
        <div data-fente="vrai" className="relative mt-3 h-2.5 rounded-full bg-black shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)]">
          <span aria-hidden="true" className="absolute inset-x-8 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[#00FF88]/25" />
        </div>

        <div className="relative flex min-h-[62px] justify-center overflow-hidden pt-1">
          {sortie && (
            <span
              data-presse="fente"
              data-presse-label={sortie.label}
              className="presse-de-la-fente w-full max-w-[380px] rounded-b-[3px] bg-[#FFFEF7] px-3 py-2 font-mono text-[11px] text-black shadow-[0_18px_40px_rgba(0,0,0,0.5)]"
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className="truncate font-bold uppercase tracking-[0.08em]">{sortie.label}</span>
                <span className="shrink-0 tabular-nums">{sortie.prix}</span>
              </span>
              <span className="mt-0.5 block truncate text-[9.5px] uppercase tracking-[0.12em] text-black/45">
                {sortie.vers}
              </span>
            </span>
          )}
        </div>

        {/* ————————————————— LES BOUTONS RONDS : LES OBJETS ————————————————— */}
        <div data-boutons="objets" className="mt-2 flex flex-wrap items-center justify-center gap-2">
          {OBJETS_DE_LA_FABRIQUE.map((objet) => {
            const picto = pictoDuRipple(objet.pictoParDefaut);
            const Icone = picto.Icone;
            const posée = marques.includes(objet.id);
            return (
              <button
                key={objet.id}
                type="button"
                data-objet={objet.id}
                data-pose={posée ? 'true' : 'false'}
                aria-pressed={posée}
                title={objet.nom}
                aria-label={`${objet.nom} — ${objet.sens}`}
                onClick={() => onObjet(objet.id)}
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                  posée
                    ? 'border-transparent bg-[#00FF88] text-black'
                    : 'border-white/15 text-white/60 hover:border-white/45 hover:text-white'
                }`}
              >
                <Icone size={15} />
              </button>
            );
          })}
        </div>

        {/* ————————————————— LES BOUTONS RONDS : LES FAMILLES ————————————————— */}
        <div data-boutons="familles" className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {GROUPES_DU_TICKET.map((groupe) => {
            const ici = ouverte.groupe === groupe.id;
            const prises = lignesPrisesDans(groupe.id, compte);
            return (
              <button
                key={groupe.id}
                type="button"
                data-machine-famille={groupe.id}
                data-actif={ici ? 'true' : 'false'}
                onClick={() => onCatégorie(CATÉGORIES_DU_TICKET.find((c) => c.groupe === groupe.id)!.id)}
                className={`flex h-14 w-14 flex-col items-center justify-center rounded-full border text-center font-mono text-[8px] uppercase leading-[1.15] tracking-[0.08em] transition sm:h-16 sm:w-16 sm:text-[9px] ${
                  ici ? 'border-[#00FF88] text-white' : 'border-white/15 text-white/45 hover:border-white/40 hover:text-white/80'
                }`}
              >
                {groupe.mot}
                {prises > 0 && <span className="mt-0.5 text-[9px] normal-nums text-[#00FF88]">{prises}</span>}
              </button>
            );
          })}
        </div>

        {/* ————————————————— LES BOUTONS RONDS : LES CATÉGORIES ————————————————— */}
        <div
          data-boutons="catégories"
          className="mt-2 flex flex-wrap items-center justify-center gap-1.5"
        >
          {catégoriesDuGroupe.map((c) => (
            <button
              key={c.id}
              type="button"
              data-machine-catégorie={c.id}
              data-actif={c.id === catégorie ? 'true' : 'false'}
              data-compte={compte[c.id] ?? 0}
              onClick={() => onCatégorie(c.id)}
              className={`rounded-full border px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.1em] transition ${
                c.id === catégorie
                  ? 'border-white/70 bg-white/10 text-white'
                  : 'border-white/12 text-white/45 hover:border-white/40 hover:text-white/85'
              }`}
            >
              {c.mot}
              {(compte[c.id] ?? 0) > 0 && <span className="ml-1 text-[#00FF88]">{(compte[c.id] ?? 0)}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Le pied de la machine : la marque, et rien d'autre. */}
      <div className="mt-2 flex items-center justify-between px-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
        <span>RIPPLE · LA MACHINE</span>
        <span>{marques.length > 0 ? `${marques.length} marque${marques.length > 1 ? 's' : ''}` : 'aucune marque'}</span>
      </div>
    </div>
  );
}

