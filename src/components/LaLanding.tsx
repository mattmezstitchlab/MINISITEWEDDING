import { Link } from 'react-router-dom';
import { useLEtatDuTicket } from '../hooks/useLEtatDuTicket';
import { codeDepuis } from '../lib/codeDuMariage';
import LaCapsule from './LaCapsule';
import LIphone from './LIphone';
import LEditeurDuTicket from './LEditeurDuTicket';
import LeTicketPleinEcran from './LeTicketPleinEcran';

/* LA LANDING — LE DESIGN DE LA RÉFÉRENCE, ET LE TICKET DEDANS
 *
 * « Faudrait un vrai champ capsule, et sur une landing ? comme la capture, et
 * présentation dans un iPhone en animé, comme les grandes pages qui présentent
 * une innovation, et du coup un ticket au propre bien droit, et avec éditeur
 * propre même design que sur l'exemple. »
 *
 * La référence est un long blanc : un titre en sérif, une phrase, **un champ et
 * un bouton vert**, puis des blocs — une question, un libellé minuscule, une
 * capsule, `SUIVANT` — et un pied en tout petit. On suit ce dessin à la lettre,
 * et on y met le produit :
 *
 * 1. **L'ouverture** — le titre, la capsule (le code du mariage), le bouton ;
 * 2. **L'innovation, en vrai** — le papier **dans un iPhone animé** : le vrai
 *    ticket, à l'échelle d'une poche, qui défile tout seul ;
 * 3. **Le ticket, au propre** — droit, net, et il se manipule vraiment ;
 * 4. **L'éditeur** — huit questions, et le papier se refait à chaque réponse ;
 * 5. **Le pied** — trois lignes, comme la référence.
 *
 * Le papier est monté deux fois, et c'est voulu : **une fois dans le téléphone**
 * (pour la démonstration), **une fois au propre** (pour de vrai). C'est le même
 * objet, le même état, le même composant.
 */

export default function LaLanding() {
  const t = useLEtatDuTicket();

  /** **Le papier** — les deux fois, c'est celui-là. */
  const lePapier = () => (
    <LeTicketPleinEcran
      code={t.code}
      numero={t.numero}
      dateLabel={t.dateLabel}
      heure={t.heure}
      couple={t.couple}
      coches={t.coches}
      surCocher={t.cocher}
      totaux={t.totaux}
      portefeuilles={t.portefeuilles}
      rêve={t.rêve}
      budget={t.budget}
      payé={t.payé}
      surPayer={t.basculerLePaiement}
      marker={t.laCouleur}
      surMarker={t.setMarker}
      frappe={t.ligneEnCours ? { mot: t.ligneEnCours.mot, pas: t.pas } : null}
      face={t.face}
      surFace={t.setFace}
      opérations={t.opérations}
      signature={t.signature}
    />
  );

  return (
    <main
      data-page="landing"
      data-code={t.code}
      data-total={t.total}
      data-marker={t.laCouleur.id}
      data-face={t.face}
      data-opérations={t.opérations.length}
      style={{ ['--vp-fluo' as string]: t.laCouleur.couleur }}
      className="min-h-svh bg-white text-[#111]"
    >
      {/* ——————————————— 1. L'OUVERTURE ——————————————— */}
      <header className="vp-landing vp-landing-ouverture">
        <h1 data-landing-titre="vrai" className="vp-didone vp-landing-titre">
          Votre mariage
          <br />
          tient sur un ticket.
        </h1>
        <p className="vp-landing-chapeau">
          Un champ, un agent, et tout s’écrit dessus : les lignes, le devis, le reçu. Rien à préparer.
        </p>
        <div className="mt-[2.6em]">
          <LaCapsule
            libellé="Le code du mariage"
            indice="NUB-139"
            valeurInitiale={t.code}
            bouton="Allons-y"
            surEnvoi={(texte) => {
              const bon = codeDepuis(texte);
              if (!bon) return 'Un code, c’est trois signes, un tiret, trois chiffres — comme NUB-139.';
              t.setCode(bon);
              return `C’est le ticket ${bon} — il est à vous.`;
            }}
            surSuivant={() =>
              document.querySelector('[data-landing="iphone"]')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          />
        </div>
        <p data-landing-marques="vrai" className="vp-landing-marques">
          Le ticket <span aria-hidden="true">·</span> l’agent <span aria-hidden="true">·</span> l’éditeur{' '}
          <span aria-hidden="true">·</span> le code
        </p>
      </header>

      {/* ——————————————— 2. L'INNOVATION, EN VRAI ——————————————— */}
      <section data-landing="iphone" className="vp-landing">
        <h2 className="vp-didone vp-landing-titre-sm">Une innovation, en vrai.</h2>
        <p className="vp-petit-mot mt-[1em]">Ce n’est pas une maquette — c’est le papier</p>
        <div className="mt-[2.6em]">
          <LIphone>{lePapier()}</LIphone>
        </div>
        <p className="vp-landing-chapeau mt-[2.4em]">
          Le ticket tient dans une poche, et il défile tout seul. Il écrit ce qu’on lui demande, il compte, il
          tourne : la même feuille, des deux côtés.
        </p>
      </section>

      {/* ——————————————— 3. LE TICKET, AU PROPRE ——————————————— */}
      <section data-landing="papier" className="vp-landing">
        <h2 className="vp-didone vp-landing-titre-sm">Le ticket, au propre.</h2>
        <p className="vp-petit-mot mt-[1em]">Il se coche, il se paye, il se tourne — touchez-le</p>
        <div data-landing-papier="vrai" className="vp-landing-papier mt-[2.6em]">
          {lePapier()}
        </div>
      </section>

      {/* ——————————————— 4. L'ÉDITEUR ——————————————— */}
      <section data-landing="editeur" className="vp-landing">
        <h2 className="vp-didone vp-landing-titre-sm">Huit questions, et c’est écrit.</h2>
        <p className="vp-petit-mot mt-[1em]">Chaque réponse se pose sur le papier, juste au-dessus</p>
        <div className="mt-[3.4em]">
          <LEditeurDuTicket t={t} />
        </div>
      </section>

      {/* ——————————————— 5. LE PIED ——————————————— */}
      <footer className="vp-landing vp-landing-pied">
        <p className="vp-petit-mot">Tout se modifie ici — rien à préparer</p>
        <p className="vp-landing-petit">
          Le ticket est un objet : il se coche, il se paye, il se tourne, et il part dans un lien. Ce que vous
          écrivez ici ne quitte pas votre navigateur : l’adresse <em>est</em> le ticket.
        </p>
        <p className="vp-landing-petit">
          <Link data-landing-lien="ticket" to="/ticket" className="vp-bouton-clair inline-block">
            Ouvrir le ticket seul
          </Link>
        </p>
      </footer>
    </main>
  );
}
