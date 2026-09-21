import type { ReactNode } from 'react';

/* L'IPHONE — LE PAPIER, DANS UN TÉLÉPHONE, ET ÇA DÉFILE
 *
 * « Présentation dans un iPhone en animé, comme les grandes pages qui présentent
 * une innovation. » Le téléphone n'est pas une image : c'est **le vrai ticket**,
 * à l'échelle d'un écran de poche, qui défile lentement tout seul — pour qu'on
 * voie le papier entier sans avoir à le faire défiler soi-même.
 *
 * - le cadre est noir, l'écran est blanc, l'encoche est là ;
 * - le contenu défile en boucle, doucement, et s'arrête net si l'on demande à
 *   ne pas voir d'animation (`prefers-reduced-motion`) ;
 * - on n'y touche pas (`pointer-events: none`) : c'est une démonstration, pas
 *   l'objet — l'objet est juste en dessous, et il se manipule.
 */

export default function LIphone({ children }: { children: ReactNode }) {
  return (
    <div data-iphone="vrai" className="vp-iphone mx-auto" aria-hidden="true">
      <div data-iphone-ecran="vrai" className="vp-iphone-ecran">
        <div className="vp-iphone-flux">{children}</div>
      </div>
      <span className="vp-iphone-encoche" />
      <span className="vp-iphone-bouton" />
    </div>
  );
}
