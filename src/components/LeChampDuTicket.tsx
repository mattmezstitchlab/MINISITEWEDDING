import { useEffect, useState } from 'react';
import { COMBIEN_PAR_GÉNÉRATION, laGénération, lAgentFaitPasser } from '../lib/agentDuTicket';
import type { LigneDuTicket } from '../lib/categoriesDuTicket';

/* LE CHAMP — UNE SEULE LIGNE À REMPLIR, ET UN AGENT QUI ÉCRIT
 *
 * « Et au début juste un champ de saisie avec un agent agentic, et tout se
 * saisit lettre par lettre pendant la génération. »
 *
 * Il n'y a plus de magasin à parcourir, plus de familles à cliquer, plus de
 * propositions à valider une par une : **on écrit ce qu'on veut**, à sa main —
 * « un dîner pour vingt », « des photos », « la cérémonie » — et l'agent écrit
 * les lignes sur le papier. Le mot qu'il a entendu est dit sous le champ ; s'il
 * n'a rien entendu, il le dit aussi, et il donne trois façons de le dire.
 *
 * Le champ ne décide de rien : il écoute, il attend une demi-seconde que la
 * phrase se pose, et il passe la main. **C'est le papier qui écrit** — lettre
 * par lettre (`laFrappe.ts`).
 */

export interface LeChampDuTicketProps {
  /** Ce qui est déjà sur le papier — l'agent ne le repropose pas. */
  prises: string[];
  /** **Ce que la demande a fait venir** : l'agent passe la file au papier. */
  surGénération: (lignes: LigneDuTicket[], mots: string[]) => void;
}

/** Ce qu'une phrase a donné : ses mots, et combien de lignes elle fait venir. */
interface Lecture {
  phrase: string;
  mots: string[];
  lignes: number;
  /** L'agent a-t-il trouvé des lignes — même si elles sont déjà sur le papier ? */
  déjà: boolean;
}

export default function LeChampDuTicket({ prises, surGénération }: LeChampDuTicketProps) {
  const [demande, setDemande] = useState('');
  /** La dernière phrase lue : ce qu'on en dit sous le champ. */
  const [lecture, setLecture] = useState<Lecture | null>(null);

  const phrase = demande.trim();
  /** La phrase est-elle assez longue pour qu'on la lise ? */
  const àLire = phrase.length >= 3;
  /** La lecture affichée est-elle celle de la phrase en cours d'écriture ? */
  const àJour = lecture?.phrase === phrase;

  /**
   * **On écrit, et ça part tout seul.** Une demi-seconde après la dernière
   * lettre : la phrase se pose, l'agent lit, le papier écrit. Aucune touche à
   * presser — et si l'on continue d'écrire, la lecture repart.
   */
  useEffect(() => {
    if (phrase.length < 3) return;
    const minuteur = window.setTimeout(() => {
      const lue = laGénération(phrase, prises);
      const trouvées = lAgentFaitPasser(phrase).lignes.length;
      setLecture({ phrase, mots: lue.mots, lignes: lue.lignes.length, déjà: lue.lignes.length === 0 && trouvées > 0 });
      if (lue.lignes.length) surGénération(lue.lignes, lue.mots);
    }, 520);
    return () => window.clearTimeout(minuteur);
    // On n'écoute que la phrase : ce qui est déjà pris change à chaque ligne écrite.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phrase]);

  return (
    <div data-champ="vrai" className="w-full bg-white px-4 pt-6 sm:px-8">
      <label className="mx-auto flex w-full max-w-[560px] items-baseline gap-[0.6em] border-b border-black/20 pb-[0.45em] focus-within:border-black/60">
        <span aria-hidden="true" className="shrink-0 font-mono text-[1.05em] text-black/35">
          ›
        </span>
        <input
          data-champ-saisie="vrai"
          value={demande}
          onChange={(e) => setDemande(e.target.value)}
          placeholder="dites ce qu’il vous faut…"
          autoComplete="off"
          spellCheck={false}
          aria-label="dites ce qu’il vous faut : un dîner pour vingt, des photos, la cérémonie…"
          className="w-full border-0 bg-transparent p-0 font-mono text-[1.05em] text-[color:var(--vp-ink)] outline-none placeholder:text-black/30"
        />
      </label>

      {/* Ce que l'agent a entendu — ou qu'il n'a rien entendu. Rien d'autre. */}
      <p className="mx-auto mt-[0.5em] flex w-full max-w-[560px] items-baseline justify-between gap-3 font-mono text-[0.85em] uppercase tracking-[0.12em]">
        {!àLire || (àLire && !àJour) ? (
          <span data-champ-attente="vrai" className="text-black/35">
            {àLire ? 'l’agent lit…' : 'l’agent écrit sur le ticket, ligne à ligne'}
          </span>
        ) : lecture!.lignes > 0 ? (
          <>
            <span data-champ-entendu={lecture!.mots.join(' · ')} className="truncate text-black/55">
              l’agent a entendu « {lecture!.mots.join(' ')} »
            </span>
            <span
              data-champ-compte={Math.min(lecture!.lignes, COMBIEN_PAR_GÉNÉRATION)}
              className="shrink-0 tabular-nums text-black/45"
            >
              {Math.min(lecture!.lignes, COMBIEN_PAR_GÉNÉRATION)} ligne{lecture!.lignes > 1 ? 's' : ''}
            </span>
          </>
        ) : lecture!.déjà ? (
          <span data-champ-déjà="vrai" className="text-black/45">
            c’est déjà écrit sur le ticket
          </span>
        ) : (
          <span data-champ-rien="vrai" className="text-black/45">
            rien trouvé — dites « un dîner », « des photos », « la cérémonie »…
          </span>
        )}
      </p>
    </div>
  );
}
