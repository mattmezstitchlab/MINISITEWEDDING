import { useState } from 'react';
import { Check, CornerDownLeft, X } from 'lucide-react';
import { OBJETS_DE_LA_FABRIQUE, pictoDuRipple } from '../lib/ripple';
import { GROUPES_DU_TICKET, type CatégorieDuTicket, type LigneDuTicket } from '../lib/categoriesDuTicket';
import { motDeLaFamille } from '../lib/agentDuTicket';
import type { DemandeEntendue, Proposition } from '../lib/machineDuTicket';
import { motDuPortefeuille } from '../lib/portefeuille';
import { euros } from '../lib/superMariage';

/* LA MACHINE — L'ÉCRAN, LA FENTE, LES BOUTONS RONDS, ET LE CHAMP
 *
 * Il n'y a plus qu'un objet sur la page, et il tient dans un écran. **La
 * machine propose toujours quelque chose, et les deux touches rondes marchent
 * toujours** : ✓ on prend, ✗ on passe. Jamais de bouton mort, jamais d'écran
 * vide, et chaque geste laisse une trace visible.
 *
 * ```
 * ┌──────────────────────────────────────────┐
 * │  SUPER MARIAGE       CAISSE 3 · 22:00    │
 * │  LA MACHINE PROPOSE             1 / 3    │  elle propose d'abord
 * │  LE JOUR J                               │  une famille…
 * │  ce qui a un prix · 48 lignes            │
 * │  7 LIGNES                      5 472 €   │
 * └──────────────────────────────────────────┘
 *        ( ✓ valider )   ( ✗ passer )            …puis les lignes, une à une
 *  ══════════════ LA FENTE ══════════════      le papier sort de là
 *        ┌──────────────────────┐               (un objet le tamponne aussi)
 *        └──────────────────────┘
 *   (●)(✉)(♦)(◉)(▤)(✈)(★)                       les objets du Ripple, gardés
 *   (LE JOUR J)(VOTRE SITE)(LES DOCUMENTS)      un mot par ligne, dans le cercle
 *   ┌────────────────────────────────┐  (→)     le champ — on dit ce qu'on veut
 *   └────────────────────────────────┘
 * ```
 *
 * Le bouton rond du **reçu** ouvre le ticket entier sur l'écran : les lignes,
 * les marques posées, les portefeuilles — et l'on retire une ligne d'un clic.
 */

export interface SortieDeLaFente {
  /** Le mot du papier : une ligne du ticket, ou un objet du Ripple. */
  label: string;
  /** Le prix, quand c'est une ligne — vide quand c'est une marque. */
  prix: string;
  /** Ce qu'on lit dessous : les portefeuilles, ou le sens de l'objet. */
  sous: string;
}

export interface MachineDeRippleProps {
  /** L'heure du ticket. */
  heure: number;
  /** Ce qui est pris, et ce que ça coûte. */
  lignes: number;
  total: number;
  /** L'écran : les propositions, ou le ticket entier. */
  écran: 'propositions' | 'ticket';
  /** Ce que la machine propose maintenant — il y a toujours quelque chose. */
  proposition: Proposition;
  /** La demande entendue, quand il y en a une. */
  demande: DemandeEntendue | null;
  /** Le ticket, pour l'écran du même nom. */
  ticket: LigneDuTicket[];
  /** Les marques posées par les objets ronds. */
  marques: string[];
  /** Les portefeuilles, comptés : ce qui part, et à qui. */
  portefeuilles: Array<{ id: string; mot: string; marque: string; lignes: number; total: number }>;
  /** Ce qui est déjà pris, famille par famille — le compte des boutons ronds. */
  prises: Record<string, number>;
  /** Le mot du dernier geste — il s'affiche sur l'écran. */
  marche: string | null;
  /** Le papier qui sort de la fente. */
  sortie: SortieDeLaFente | null;
  /** Les gestes. */
  onValider: () => void;
  onPasser: () => void;
  onFamille: (groupe: CatégorieDuTicket['groupe']) => void;
  onObjet: (id: string) => void;
  onDemande: (texte: string) => void;
  onRetirer: (id: string) => void;
  onEmporter: () => void;
}

/** Le prix d'une ligne, écrit comme sur le papier — jamais autrement. */
function prixDeLaLigne(ligne: LigneDuTicket): string {
  return ligne.incluse ? 'inclus' : euros(ligne.prix * (ligne.quantite ?? 1));
}

export default function MachineDeRipple({
  heure,
  lignes,
  total,
  écran,
  proposition,
  demande,
  ticket,
  marques,
  portefeuilles,
  prises,
  marche,
  sortie,
  onValider,
  onPasser,
  onFamille,
  onObjet,
  onDemande,
  onRetirer,
  onEmporter,
}: MachineDeRippleProps) {
  /** Ce qui est en train de s'écrire dans le champ : ça n'appartient qu'à l'écran. */
  const [texte, setTexte] = useState('');

  const auTicket = écran === 'ticket';
  const motValider = auTicket ? 'retour' : 'valider';
  const motPasser = auTicket ? 'vider' : 'passer';
  const corps = auTicket ? 'ticket' : proposition.genre;

  const envoyer = () => {
    const propre = texte.trim();
    if (!propre) return;
    onDemande(propre);
    setTexte('');
  };

  return (
    <div
      data-machine="ripple"
      className="relative w-full max-w-[420px] origin-center [@media(max-height:620px)]:scale-[0.86]"
    >
      <div className="relative rounded-[28px] border border-black/[0.06] bg-gradient-to-b from-[#1C1F27] to-[#0C0E13] p-3 shadow-[0_30px_60px_rgba(15,17,22,0.28)] sm:p-4">
        {/* ————————————————— LE PETIT ÉCRAN ————————————————— */}
        <div
          data-ecran="ripple"
          className="flex h-[196px] flex-col rounded-[14px] border border-white/10 bg-[#06120C] px-3 py-2.5 font-mono text-[10.5px] leading-relaxed text-[#7DE2B0] shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]"
        >
          <span className="flex items-baseline justify-between gap-3 text-[#7DE2B0]/60">
            <span className="uppercase tracking-[0.18em]">SUPER MARIAGE</span>
            <span className="uppercase tracking-[0.16em]">
              CAISSE 3 · {String(heure).padStart(2, '0')}:00
            </span>
          </span>

          {/* Le corps de l'écran : une seule chose à la fois. */}
          <div data-écran-corps={corps} className="mt-2 min-h-0 flex-1 overflow-hidden">
            {corps === 'famille' && proposition.genre === 'famille' && (
              <span className="block">
                <span className="flex items-baseline justify-between gap-2 text-[9.5px] uppercase tracking-[0.14em] text-[#7DE2B0]/55">
                  <span className="truncate">
                    {demande?.àVide ? 'RIEN DE TEL — PRENEZ UNE FAMILLE' : 'LA MACHINE PROPOSE'}
                  </span>
                  <span className="shrink-0 tabular-nums" data-rang={proposition.rang} data-file={proposition.taille}>
                    {proposition.rang} / {proposition.taille}
                  </span>
                </span>

                <span
                  data-famille-proposee={proposition.groupe}
                  className="mt-1.5 block text-[15px] uppercase tracking-[0.06em] text-[#9BF3C6]"
                >
                  {motDeLaFamille(proposition.groupe)}
                </span>
                <span className="mt-1 block truncate text-[9.5px] uppercase tracking-[0.12em] text-[#7DE2B0]/50">
                  {proposition.sous} · {proposition.lignes} ligne{proposition.lignes > 1 ? 's' : ''}
                </span>
                <span className="mt-2 block text-[9.5px] uppercase tracking-[0.12em] text-[#7DE2B0]/60">
                  ✓ pour la passer en revue · ✗ la suivante
                </span>
                {marche && (
                  <span data-ecran-mot="vrai" className="mt-1.5 block truncate text-[9.5px] uppercase tracking-[0.14em] text-white/45">
                    {marche}
                  </span>
                )}
              </span>
            )}

            {corps === 'ligne' && proposition.genre === 'ligne' && (
              <span className="block">
                <span className="flex items-baseline justify-between gap-2 text-[9.5px] uppercase tracking-[0.14em] text-[#7DE2B0]/55">
                  <span data-demande-mots={demande?.mots.join(',') ?? ''} className="truncate">
                    {demande ? `VOUS VOULEZ : ${demande.mots.join(' · ')}` : motDeLaFamille(proposition.groupe)}
                  </span>
                  <span className="shrink-0 tabular-nums" data-rang={proposition.rang} data-file={proposition.taille}>
                    {proposition.rang} / {proposition.taille}
                  </span>
                </span>

                <span
                  data-proposition={proposition.ligne.id}
                  data-vers={proposition.ligne.vers.join(',')}
                  data-famille={proposition.ligne.famille}
                  className="mt-1.5 line-clamp-2 block text-[13.5px] leading-[1.25] text-[#9BF3C6]"
                >
                  {proposition.ligne.label}
                </span>
                <span className="mt-0.5 block truncate text-[9px] uppercase tracking-[0.12em] text-[#7DE2B0]/45">
                  {motDeLaFamille(proposition.groupe)} · {proposition.catégorie}
                </span>
                <span className="mt-1.5 flex items-baseline justify-between gap-2">
                  <span className="text-[12px] tabular-nums">{prixDeLaLigne(proposition.ligne)}</span>
                  <span className="truncate text-[9.5px] uppercase tracking-[0.1em] text-[#7DE2B0]/60">
                    → {proposition.ligne.vers.map((p) => motDuPortefeuille(p)).join(' · ')}
                  </span>
                </span>
                {proposition.motif && (
                  <span className="mt-0.5 block truncate text-[9px] uppercase tracking-[0.12em] text-white/35">
                    entendu : « {proposition.motif} »
                  </span>
                )}
              </span>
            )}

            {corps === 'ticket' && (
              <span className="flex h-full flex-col">
                <span className="flex items-baseline justify-between gap-2 text-[9.5px] uppercase tracking-[0.14em] text-[#7DE2B0]/55">
                  <span>LE TICKET, ENTIER</span>
                  <span className="tabular-nums">
                    {lignes} LIGNE{lignes > 1 ? 'S' : ''}
                  </span>
                </span>
                <span data-écran-liste="vrai" className="mt-1 min-h-0 flex-1 overflow-y-auto pr-1">
                  {ticket.length === 0 ? (
                    <span className="block text-[10px] uppercase tracking-[0.12em] text-[#7DE2B0]/40">
                      rien encore — validez une proposition
                    </span>
                  ) : (
                    ticket.map((ligne) => (
                      <button
                        key={ligne.id}
                        type="button"
                        data-ligne={ligne.id}
                        data-cochee="true"
                        data-famille={ligne.famille}
                        data-prix={ligne.prix}
                        data-vers={ligne.vers.join(',')}
                        onClick={() => onRetirer(ligne.id)}
                        className="flex w-full items-baseline justify-between gap-2 py-[1px] text-left text-[10.5px] text-[#9BF3C6]/85 transition hover:text-white"
                      >
                        <span className="truncate">{ligne.label}</span>
                        <span className="shrink-0 tabular-nums text-[#7DE2B0]/60">{prixDeLaLigne(ligne)}</span>
                      </button>
                    ))
                  )}
                </span>
                <span className="mt-1 flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5 border-t border-[#7DE2B0]/20 pt-1">
                  {marques.map((id) => (
                    <span
                      key={id}
                      data-marque={id}
                      className="text-[9px] uppercase tracking-[0.1em] text-[#00FF88]"
                    >
                      {OBJETS_DE_LA_FABRIQUE.find((o) => o.id === id)?.nom ?? id}
                    </span>
                  ))}
                  {portefeuilles
                    .filter((p) => p.lignes > 0)
                    .map((p) => (
                      <span
                        key={p.id}
                        data-portefeuille={p.id}
                        data-lignes={p.lignes}
                        data-total={p.total}
                        className="text-[9px] uppercase tracking-[0.1em] text-[#7DE2B0]/60"
                      >
                        {p.marque} {p.mot} {p.lignes}
                      </span>
                    ))}
                  {lignes > 0 && (
                    <button
                      type="button"
                      data-action="emporter"
                      onClick={onEmporter}
                      className="ml-auto text-[9px] uppercase tracking-[0.12em] text-[#7DE2B0]/70 underline decoration-[#7DE2B0]/30 underline-offset-2 transition hover:text-white"
                    >
                      emporter
                    </button>
                  )}
                </span>
              </span>
            )}
          </div>

          <span className="mt-2 flex items-baseline justify-between gap-3 border-t border-[#7DE2B0]/20 pt-1.5">
            <span className="uppercase tracking-[0.16em]">
              {lignes} LIGNE{lignes > 1 ? 'S' : ''}
            </span>
            <span className="text-[13px] tabular-nums tracking-[0.06em]">{euros(total)}</span>
          </span>
        </div>

        {/* ——————————————— LES DEUX TOUCHES RONDES ——————————————— */}
        <div data-touches="vrai" className="mt-2.5 flex items-center justify-center gap-5">
          <button
            type="button"
            data-touche="passer"
            data-touche-mot={motPasser}
            disabled={auTicket && lignes === 0}
            onClick={onPasser}
            className="flex h-[52px] w-[52px] flex-col items-center justify-center gap-0.5 rounded-full border border-white/15 text-white/55 transition hover:border-white/50 hover:text-white disabled:opacity-25 disabled:hover:border-white/15 disabled:hover:text-white/55"
          >
            <X size={14} />
            <span className="font-mono text-[7.5px] uppercase tracking-[0.08em]">{motPasser}</span>
          </button>
          <button
            type="button"
            data-touche="valider"
            data-touche-mot={motValider}
            onClick={onValider}
            className="flex h-[52px] w-[52px] flex-col items-center justify-center gap-0.5 rounded-full border border-[#00FF88]/60 bg-[#00FF88] text-black transition hover:brightness-110"
          >
            <Check size={15} />
            <span className="font-mono text-[7.5px] uppercase tracking-[0.08em]">{motValider}</span>
          </button>
        </div>

        {/* ————————————————— LA FENTE, ET LE TICKET QUI EN SORT ————————————————— */}
        <div data-fente="vrai" className="relative mt-3 h-2.5 rounded-full bg-black shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)]">
          <span aria-hidden="true" className="absolute inset-x-8 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[#00FF88]/25" />
        </div>

        <div className="relative flex h-[66px] justify-center overflow-hidden pt-1">
          {sortie && (
            <span
              data-presse="fente"
              data-presse-label={sortie.label}
              className="presse-de-la-fente w-full max-w-[330px] rounded-b-[3px] bg-[#FFFEF7] px-3 py-2 font-mono text-[11px] text-black shadow-[0_18px_40px_rgba(0,0,0,0.5)]"
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className="truncate font-bold uppercase tracking-[0.08em]">{sortie.label}</span>
                <span className="shrink-0 tabular-nums">{sortie.prix}</span>
              </span>
              <span className="mt-0.5 block truncate text-[9.5px] uppercase tracking-[0.12em] text-black/45">
                {sortie.sous}
              </span>
            </span>
          )}
        </div>

        {/* ————————————————— LES BOUTONS RONDS : LES OBJETS ————————————————— */}
        <div data-boutons="objets" className="mt-1.5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {OBJETS_DE_LA_FABRIQUE.map((objet) => {
            const picto = pictoDuRipple(objet.pictoParDefaut);
            const Icone = picto.Icone;
            const posée = objet.id === 'ticket-caisse' ? auTicket : marques.includes(objet.id);
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
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition sm:h-10 sm:w-10 ${
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
        <div data-boutons="familles" className="mt-2.5 flex flex-wrap items-center justify-center gap-2.5">
          {GROUPES_DU_TICKET.map((groupe) => {
            const compte = prises[groupe.id] ?? 0;
            return (
              <button
                key={groupe.id}
                type="button"
                data-machine-famille={groupe.id}
                data-rond-mot={groupe.mot}
                data-actif={
                  corps === 'famille' && proposition.genre === 'famille' && proposition.groupe === groupe.id
                    ? 'true'
                    : 'false'
                }
                data-prises={compte}
                onClick={() => onFamille(groupe.id)}
                className="relative flex h-[78px] w-[78px] flex-col items-center justify-center rounded-full border border-white/15 px-2 text-center font-mono text-[8.5px] uppercase leading-[1.3] tracking-[0.05em] text-white/55 transition hover:border-white/45 hover:text-white/90"
              >
                {groupe.mot.split(' ').map((mot) => (
                  <span key={mot} className="block">
                    {mot}
                  </span>
                ))}
                {compte > 0 && (
                  <span className="absolute right-2 top-2 text-[8.5px] tabular-nums text-[#00FF88]">{compte}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* ————————————————— LE CHAMP : ON DIT CE QU'ON VEUT ————————————————— */}
        <form
          data-ia="formulaire"
          onSubmit={(evenement) => {
            evenement.preventDefault();
            envoyer();
          }}
          className="mt-3 flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 transition focus-within:border-white/45"
        >
          <input
            data-ia="champ"
            value={texte}
            onChange={(evenement) => setTexte(evenement.target.value)}
            placeholder="dites ce qu’il vous faut"
            aria-label="dites ce qu’il vous faut"
            className="min-w-0 flex-1 bg-transparent font-mono text-[11px] uppercase tracking-[0.08em] text-white outline-none placeholder:text-white/30"
          />
          <button
            type="submit"
            data-ia="envoyer"
            aria-label="faire passer"
            disabled={!texte.trim()}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00FF88] text-black transition hover:brightness-110 disabled:bg-white/10 disabled:text-white/30"
          >
            <CornerDownLeft size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
