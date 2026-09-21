import { useEffect, useRef, useState } from 'react';
import { lesOrdresDeLAgent } from '../lib/agentDuTicket';
import { LES_OPÉRATIONS, type GenreDopération, type LOpération } from '../lib/lesOpérations';
import { laFace, type FaceDuTicket } from '../lib/lesFacesDuTicket';
import type { LigneDuTicket } from '../lib/categoriesDuTicket';

/* LE CHAMP — LE POSTE DE COMMANDE, ET L'AGENT QUI EXÉCUTE
 *
 * « Et au début juste un champ de saisie avec un agent agentic, et tout se
 * saisit lettre par lettre pendant la génération. »
 *
 * « Je dirais d'implémenter tout ce qui existe et possible pour juste le
 * demander à l'agent. » « Faudrait un champ avec option et un + pour créer une
 * opération ou autre. »
 *
 * Il y a donc **un champ, un +, et trois choses que l'agent sait faire** :
 *
 *   1. écrire des lignes du magasin — « un dîner pour vingt », « des photos » ;
 *   2. ouvrir une opération — « devis 300 € pour Jean », « note privée : les
 *      alliances » — et le + les propose, sans qu'on ait à connaître les mots ;
 *   3. tourner le papier — « vue client » : c'est sa facture, puis son reçu.
 *
 * L'agent dit toujours ce qu'il a compris, à droite du champ : c'est la seule
 * façon de savoir s'il a bien entendu. Et rien ne part tant qu'on n'a pas fini
 * d'écrire : une demi-seconde de silence, et il exécute.
 */

export interface LeChampDuTicketProps {
  /** Ce qui est déjà sur le papier — l'agent ne le repropose pas. */
  prises: string[];
  /** Combien d'opérations y sont déjà : la suivante prend le numéro d'après. */
  combienDOpérations: number;
  surGénération: (lignes: LigneDuTicket[], mots: string[]) => void;
  surOpération: (opération: LOpération) => void;
  surFace: (face: FaceDuTicket) => void;
}

/** Ce que la dernière phrase a donné : deux mots, à gauche et à droite du champ. */
interface Lecture {
  phrase: string;
  gauche: string;
  droite: string;
}

export default function LeChampDuTicket({
  prises,
  combienDOpérations,
  surGénération,
  surOpération,
  surFace,
}: LeChampDuTicketProps) {
  const [demande, setDemande] = useState('');
  const [lecture, setLecture] = useState<Lecture | null>(null);
  /** **Le + est-il ouvert ?** Ses options s'écrivent d'elles-mêmes dans le champ. */
  const [optionsOuvertes, setOptionsOuvertes] = useState(false);
  const champ = useRef<HTMLInputElement>(null);

  const phrase = demande.trim();
  const àLire = phrase.length >= 3;
  const àJour = lecture?.phrase === phrase;

  /**
   * **On écrit, et l'agent exécute.** Une demi-seconde après la dernière lettre
   * la phrase se pose : l'agent rend **un** ordre, on l'exécute, et il dit ce
   * qu'il a compris.
   */
  useEffect(() => {
    if (phrase.length < 3) return;
    const minuteur = window.setTimeout(() => {
      const ordre = lesOrdresDeLAgent(phrase, prises, combienDOpérations);
      if (ordre.genre === 'lignes') {
        surGénération(ordre.lignes, ordre.mots);
        setLecture({
          phrase,
          gauche: `l’agent a entendu « ${ordre.mots.join(' ')} »`,
          droite: `${ordre.lignes.length} ligne${ordre.lignes.length > 1 ? 's' : ''}`,
        });
        return;
      }
      if (ordre.genre === 'opération') {
        const o = ordre.opération;
        surOpération(o);
        setLecture({
          phrase,
          gauche: `l’agent a ouvert ${o.privée ? 'une note privée' : `un ${LA_GLYPHIE(o.genre)}`}`,
          droite: o.prix ? `${o.prix} €${o.qui ? ` · ${o.qui}` : ''}` : o.qui || 'sur le ticket',
        });
        return;
      }
      if (ordre.genre === 'face') {
        surFace(ordre.face);
        setLecture({
          phrase,
          gauche: ordre.face === 'client' ? 'on tourne le papier — côté client' : 'on relit de notre côté',
          droite: laFace(ordre.face).mot.toLowerCase(),
        });
        return;
      }
      setLecture({ phrase, gauche: 'rien trouvé — dites « un dîner », « des photos »…', droite: '' });
    }, 520);
    return () => window.clearTimeout(minuteur);
    // On n'écoute que la phrase : ce qui est déjà pris change à chaque ligne écrite.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phrase]);

  /** **Le + écrit le début de l'opération** : l'agent finit le travail. */
  const commencer = (début: string) => {
    setDemande(début);
    setOptionsOuvertes(false);
    champ.current?.focus();
  };

  return (
    <div data-champ="vrai" className="w-full bg-white px-4 pt-6 sm:px-8">
      <label className="mx-auto flex w-full max-w-[560px] items-baseline gap-[0.6em] border-b border-black/20 pb-[0.45em] focus-within:border-black/60">
        {/* **Le +** : les cinq opérations qu'on peut faire arriver. */}
        <button
          type="button"
          data-champ-plus="vrai"
          data-champ-options-ouvertes={optionsOuvertes}
          aria-expanded={optionsOuvertes}
          aria-label="créer une opération : devis, facture, note, import"
          onClick={() => setOptionsOuvertes((ouvert) => !ouvert)}
          className="shrink-0 font-mono text-[1.05em] text-black/40 transition hover:text-black"
        >
          {optionsOuvertes ? '×' : '＋'}
        </button>
        <input
          ref={champ}
          data-champ-saisie="vrai"
          value={demande}
          onChange={(e) => setDemande(e.target.value)}
          placeholder="dites ce qu’il vous faut…"
          autoComplete="off"
          spellCheck={false}
          aria-label="dites ce qu’il vous faut : un dîner pour vingt, des photos, un devis pour Jean, vue client…"
          className="w-full border-0 bg-transparent p-0 font-mono text-[1.05em] text-[color:var(--vp-ink)] outline-none placeholder:text-black/30"
        />
      </label>

      {/* **Les options du +** : elles s'écrivent dans le champ, et l'agent fait le reste. */}
      {optionsOuvertes && (
        <div data-champ-options="vrai" className="mx-auto mt-[0.5em] flex w-full max-w-[560px] flex-wrap gap-x-[1.1em] gap-y-[0.25em]">
          {LES_OPÉRATIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              data-champ-option={option.id}
              title={option.indication}
              onClick={() => commencer(option.début)}
              className="flex items-baseline gap-[0.4em] font-mono text-[0.85em] uppercase tracking-[0.1em] text-black/50 transition hover:text-black"
            >
              <span aria-hidden="true">{option.glyphe}</span>
              <span>{option.mot}</span>
            </button>
          ))}
        </div>
      )}

      {/* **Ce que l'agent a compris.** C'est la seule chose qu'il dit. */}
      <p className="mx-auto mt-[0.5em] flex w-full max-w-[560px] items-baseline justify-between gap-3 font-mono text-[0.85em] uppercase tracking-[0.12em]">
        {!àLire || (àLire && !àJour) ? (
          <span data-champ-attente="vrai" className="text-black/35">
            {àLire ? 'l’agent lit…' : 'l’agent écrit sur le ticket, ligne à ligne'}
          </span>
        ) : (
          <>
            <span
              data-champ-compris={lecture!.gauche}
              className={`truncate ${lecture!.droite ? 'text-black/55' : 'text-black/45'}`}
            >
              {lecture!.gauche}
            </span>
            {lecture!.droite && (
              <span data-champ-juste={lecture!.droite} className="shrink-0 tabular-nums text-black/45">
                {lecture!.droite}
              </span>
            )}
          </>
        )}
      </p>
    </div>
  );
}

/** Comment on dit une opération, à voix haute. */
const LA_GLYPHIE = (genre: GenreDopération): string =>
  LES_OPÉRATIONS.find((o) => o.id === genre)?.mot.toLowerCase() ?? 'opération';
