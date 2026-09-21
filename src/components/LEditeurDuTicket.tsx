import { useState } from 'react';
import { LES_MARKERS } from '../lib/lesMarkers';
import { lesOrdresDeLAgent } from '../lib/agentDuTicket';
import { laFace } from '../lib/lesFacesDuTicket';
import { LES_OPÉRATIONS } from '../lib/lesOpérations';
import { codeDepuis } from '../lib/codeDuMariage';
import type { LÉtatDuTicket } from '../hooks/useLEtatDuTicket';
import LaCapsule from './LaCapsule';

/* L'ÉDITEUR — LE MÊME DESIGN QUE LA RÉFÉRENCE
 *
 * « Avec éditeur propre, même design que sur l'exemple. » Un bloc, une question
 * en sérif, un libellé minuscule, une capsule, et un bouton clair. Rien de plus
 * — et le papier se refait à chaque réponse.
 *
 * **L'éditeur ne fabrique pas un formulaire : il configure le ticket.** Chaque
 * question écrit dans l'état du ticket (`useLEtatDuTicket`), donc :
 *
 * - ce qu'on écrit ici **apparaît dans le téléphone** (le ticket anime sa
 *   propre mise à jour) et **sur le papier** juste en dessous ;
 * - et ça part dans l'adresse : le lien obtenu, c'est le ticket.
 */

/** **Les questions de l'éditeur, dans l'ordre** — le `SUIVANT` suit cette liste. */
export const LES_QUESTIONS_DU_TICKET = [
  'code',
  'prenoms',
  'lieu',
  'invites',
  'reve',
  'prise',
  'marker',
  'face',
] as const;

const laQuestionDaprès = (id: string): string | null => {
  const rang = LES_QUESTIONS_DU_TICKET.indexOf(id as never);
  return rang >= 0 && rang + 1 < LES_QUESTIONS_DU_TICKET.length
    ? LES_QUESTIONS_DU_TICKET[rang + 1]!
    : null;
};

/** **On descend à la question suivante** — c'est le seul geste du `SUIVANT`. */
const descendre = (id: string) => {
  const suivante = laQuestionDaprès(id);
  if (!suivante) return;
  document
    .querySelector(`[data-question="${suivante}"]`)
    ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

/** **Un bloc de l'éditeur** : la question, le libellé, la capsule, et le suivant. */
export function UneQuestion({
  id,
  titre,
  sous,
  réponse,
  surSuivant,
  children,
}: {
  id: string;
  titre: string;
  sous: string;
  réponse?: string | null;
  surSuivant?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section data-question={id} className="vp-question">
      <h3 className="vp-didone vp-question-titre">{titre}</h3>
      <p data-question-sous={sous} className="vp-petit-mot mt-[0.9em]">
        {sous}
      </p>
      <div className="mt-[1.5em]">{children}</div>
      {réponse && (
        <p data-question-réponse={réponse} className="mt-[1em] text-[0.8rem] text-[#8a8a8a]">
          {réponse}
        </p>
      )}
      {surSuivant && (
        <button type="button" data-question-suivant={id} onClick={surSuivant} className="vp-bouton-clair mt-[1.6em]">
          Suivant
        </button>
      )}
    </section>
  );
}

export default function LEditeurDuTicket({ t }: { t: LÉtatDuTicket }) {
  /** Ce que l'agent a répondu à la question des lignes. */
  const [dit, setDit] = useState<string | null>(null);

  /** **La question « qu'est-ce qu'on prend ? »** : c'est l'agent qui écrit. */
  const prendre = (texte: string): string => {
    const ordre = lesOrdresDeLAgent(texte, t.coches, t.opérations.length);
    if (ordre.genre === 'lignes') {
      t.recevoirLaGénération(ordre.lignes);
      return `L’agent a entendu « ${ordre.mots.join(' ')} » — ${ordre.lignes.length} ligne(s) s’écrivent sur le papier.`;
    }
    if (ordre.genre === 'opération') {
      t.recevoirLOpération(ordre.opération);
      const o = ordre.opération;
      return `Une opération ${o.prix ? `de ${o.prix} €` : ''} ${o.qui ? `pour ${o.qui} ` : ''}vient d’arriver sur le ticket.`;
    }
    if (ordre.genre === 'face') {
      t.setFace(ordre.face);
      return ordre.face === 'client' ? 'Le papier se lit maintenant côté client.' : 'Le papier se relit de notre côté.';
    }
    return 'Il n’a rien trouvé — essayez « un dîner », « des photos », « devis 300 € pour Jean ».';
  };

  return (
    <div data-editeur="vrai" className="flex flex-col">
      {/* 1. Le code — c'est la signature du papier. */}
      <UneQuestion
        id="code"
        titre="C’est quoi, votre mariage ?"
        sous="Le code imprimé en haut du ticket"
        surSuivant={() => descendre('code')}
      >
        <LaCapsule
          libellé="Le code du mariage"
          indice="NUB-139"
          valeurInitiale={t.code}
          surEnvoi={(texte) => {
            const bon = codeDepuis(texte);
            if (!bon) return 'Un code, c’est trois signes, un tiret, trois chiffres — comme NUB-139.';
            t.setCode(bon);
            return `Le papier porte ${bon}, et ce code part dans le lien.`;
          }}
        />
      </UneQuestion>

      {/* 2. Les prénoms. */}
      <UneQuestion
        id="prenoms"
        titre="Qui se marie ?"
        sous="Les deux prénoms, comme on les écrit sur le papier"
        surSuivant={() => descendre('prenoms')}
      >
        <LaCapsule
          libellé="Les prénoms"
          indice="Nora & Adam"
          valeurInitiale={t.noms}
          surEnvoi={(texte) => {
            t.setNoms(texte);
            return `Le ticket est à ${texte}.`;
          }}
        />
      </UneQuestion>

      {/* 3. Le lieu. */}
      <UneQuestion
        id="lieu"
        titre="Où ça, alors ?"
        sous="Le lieu, en clair"
        surSuivant={() => descendre('lieu')}
      >
        <LaCapsule
          libellé="Le lieu"
          indice="Supermarché Belleville"
          valeurInitiale={t.lieu}
          surEnvoi={(texte) => {
            t.setLieu(texte);
            return `Ce sera ${texte}.`;
          }}
        />
      </UneQuestion>

      {/* 4. Les invités. */}
      <UneQuestion
        id="invites"
        titre="Combien d’invités ?"
        sous="Le nombre, écrit à la main — il n’y a pas de liste"
        surSuivant={() => descendre('invites')}
      >
        <LaCapsule
          libellé="Les invités"
          indice="64"
          valeurInitiale={String(t.invités)}
          surEnvoi={(texte) => {
            const nombre = Number(texte.replace(/[^\d]/g, ''));
            if (!nombre) return 'Un nombre, pour que le papier le compte.';
            t.setInvités(nombre);
            return `${nombre} invités sur le ticket.`;
          }}
        />
      </UneQuestion>

      {/* 5. Le rêve. */}
      <UneQuestion
        id="reve"
        titre="Vous en rêvez ?"
        sous="Le voyage, dans vos mots — c’est lui qui met la cagnotte en route"
        surSuivant={() => descendre('reve')}
      >
        <LaCapsule
          libellé="Le voyage"
          indice="Vegas en janvier"
          valeurInitiale={t.description}
          surEnvoi={(texte) => {
            t.setDescription(texte);
            return t.rêve.mot ? `Le papier écrit ${t.rêve.mot}.` : 'C’est noté sur le papier.';
          }}
        />
      </UneQuestion>

      {/* 6. Les lignes — l'agent écrit. */}
      <UneQuestion
        id="prise"
        titre="Et qu’est-ce qu’on prend ?"
        sous="Demandez-le à la voix : l’agent écrit les lignes, lettre par lettre"
        réponse={dit}
        surSuivant={() => descendre('prise')}
      >
        <LaCapsule
          libellé="Une ligne, un devis, une facture"
          indice="un dîner pour vingt · devis 300 € pour Jean"
          bouton="Écrire"
          surEnvoi={(texte) => {
            const réponse = prendre(texte);
            setDit(réponse);
            return réponse;
          }}
        />
        <p className="vp-petit-mot mt-[1.2em]">
          {LES_OPÉRATIONS.map((o) => o.mot).join(' · ')}
        </p>
      </UneQuestion>

      {/* 7. Le marker — la couleur du fluo. */}
      <UneQuestion
        id="marker"
        titre="La couleur du marker ?"
        sous="Elle surligne tout le papier, et elle part dans le lien"
        surSuivant={() => descendre('marker')}
      >
        <div data-marker-editeur={t.laCouleur.id} className="flex flex-wrap justify-center gap-[0.9em]">
          {LES_MARKERS.map((m) => (
            <button
              key={m.id}
              type="button"
              data-marker={m.id}
              data-marker-actif={m.id === t.laCouleur.id}
              aria-label={`écrire au marker ${m.mot.toLowerCase()}`}
              title={`${m.mot} — ${m.sous}`}
              onClick={() => t.setMarker(m.id)}
              className={`h-[2.1em] w-[2.1em] rounded-full border transition ${
                m.id === t.laCouleur.id ? 'scale-110 border-[#111]' : 'border-[#dcdcdc] hover:scale-105'
              }`}
              style={{ background: m.couleur }}
            />
          ))}
        </div>
      </UneQuestion>

      {/* 8. La face — qui regarde le papier. */}
      <UneQuestion
        id="face"
        titre="Qui regarde le papier ?"
        sous="Le même ticket, deux faces : la nôtre, et celle qui paie"
      >
        <div className="flex flex-wrap justify-center gap-[0.8em]">
          {(['emetteur', 'client'] as const).map((f) => (
            <button
              key={f}
              type="button"
              data-face-choix={f}
              data-face-actif={f === t.face}
              onClick={() => t.setFace(f)}
              className={`vp-bouton-clair ${f === t.face ? 'border-[#111] text-[#111]' : ''}`}
            >
              {laFace(f).mot}
            </button>
          ))}
        </div>
        <p className="vp-petit-mot mt-[1.2em]">
          {t.face === 'client' ? 'Sa facture — puis son reçu, une fois réglé.' : 'Le ticket, notes privées comprises.'}
        </p>
      </UneQuestion>
    </div>
  );
}
