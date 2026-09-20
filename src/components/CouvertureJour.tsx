import type { CouvertureJour } from '../lib/couvertureDuJour';
import { visuelsDuJour, type Visuel } from '../lib/visuelsDuMagazine';
import { niveauxDuJour, type NiveauxDuJour } from '../lib/semaines';
import { CHAPITRES } from '../lib/chapitres';
import { partDeLHeure } from '../lib/moments';
import { useTempsDeLaCapsule } from '../lib/capsuleCommande';
import CadranDuMagazine from './CadranDuMagazine';

/**
 * LA COUVERTURE D'UN JOUR — LE MAGAZINE DE SA SEMAINE, ET SON CHAPITRE
 *
 * Un fond uni ou la photo, la marque en haut, **la création au centre** — le
 * cadran —, le nom du jour, et la date en bas. Rien d'autre : la couverture a
 * été nettoyée, tout ce qui faisait bordél est parti. Rien ne passe jamais sur
 * la création.
 *
 * **Ce qui a changé avec la collection** : la couverture n'appartient plus au
 * jour, elle appartient à **la semaine**. Les sept jours de la semaine 38
 * portent donc le même visuel — `semaine-38/cover.jpg` —, et chacun écrit
 * **son** chapitre : le 21 septembre est *Magazine 38, chapitre 04*. C'est la
 * règle du nouveau modèle, et elle se voit sur la couverture elle-même :
 * la marque, le numéro du magazine, le titre du jour, le chapitre, la date.
 *
 * **Le cadran, au centre, porte les aiguilles** : la grande montre **l'heure
 * qu'on regarde** — celle de la capsule temporelle du bas, ou l'heure réelle —,
 * et la petite montre **le chapitre** par lequel la date entre dans le magazine.
 * Un clic sur « le soir » dans le dock, et l'aiguille se pose à 20 h.
 *
 * Les typos sont **celles du site** : la police spatiale pour les titres, la
 * mono pour les petites capitales — jamais une police que le site ne connaît pas.
 *
 * Tout est en **SVG**, dessiné ici : rien à téléverser, rien à installer, et
 * **la même date donne toujours la même couverture**. Ce dessin n'est pas une
 * illustration posée sur une page : c'est la couverture par défaut — celle qui
 * tient tant qu'aucune photo n'est livrée. Dès qu'une image arrive (le chapitre,
 * puis la couverture de la semaine), elle prend le fond, voilée de la couleur du
 * jour pour que la palette et le texte tiennent.
 */

interface CouvertureJourProps {
  couverture: CouvertureJour;
  /** La largeur en pixels : la hauteur suit (rapport 5 / 7). */
  largeur?: number;
  /** Vrai pour une vignette : moins de texte, plus de dessin. */
  vignette?: boolean;
  className?: string;
  /**
   * **L'image du fond**, déjà résolue. Si elle n'est pas donnée, le composant
   * interroge la cascade du magazine (`visuelsDuMagazine.ts`) : le chapitre du
   * jour, puis la couverture de sa semaine, puis l'ancien visuel du jour — et
   * sinon, il dessine.
   */
  visuel?: Visuel | null;
  /**
   * Quelle image chercher quand on n'en donne pas : **la couverture de la
   * semaine** (l'identité du magazine, partagée par ses sept jours) ou **l'image
   * du chapitre** (ce qui distingue un jour de ses voisins). Par défaut : la
   * couverture de la semaine.
   */
  fond?: 'semaine' | 'chapitre';
  /** Par compatibilité : une adresse d'image forcée (`null` = dessiner). */
  photo?: string | null;
  /** Les trois niveaux — jour, magazine, chapitre — écrits sur la couverture. */
  niveaux?: NiveauxDuJour;
  /**
   * L'heure que montre la grande aiguille. Par défaut, **celle de la capsule** :
   * le moment choisi dans le dock (l'aube 6 h, le midi 12 h, le soir 20 h), ou
   * l'heure réelle quand aucun moment n'est choisi.
   */
  heure?: number;
}

/**
 * **L'HEURE, DITE COMME ON LA LIT** : « 20 H — LE SOIR ». C'est la légende du
 * cadran, et c'est le lien visible avec la capsule du bas : on clique « le
 * soir », la légende dit « 20 H — LE SOIR », et l'aiguille s'y pose.
 */
export function legendeDeLHeure(heure: number): string {
  const h = Math.floor(heure) % 24;
  const minutes = Math.round((heure - Math.floor(heure)) * 60);
  const part = partDeLHeure(h);
  const heureEcr = minutes === 0 ? `${h} H` : `${h} H ${String(minutes).padStart(2, '0')}`;
  return `${heureEcr} — ${part.nom.toUpperCase()}`;
}

/** La date d'une couverture, à midi — jamais décalée d'un jour. */
function dateDeLaCouverture(couverture: CouvertureJour): Date {
  return new Date(couverture.annee, couverture.mois - 1, couverture.quantieme, 12);
}

export default function CouvertureJour({
  couverture,
  largeur = 300,
  vignette = false,
  className = '',
  visuel,
  fond = 'semaine',
  photo,
  niveaux,
  heure,
}: CouvertureJourProps) {
  const hauteur = Math.round((largeur * 7) / 5);
  const { fond: fondDuJour, encre, branches } = couverture;
  const date = dateDeLaCouverture(couverture);
  const etages = niveaux ?? niveauxDuJour(date);
  /** Le temps de la capsule : l'aiguille s'y pose, et la légende le dit. */
  const capsule = useTempsDeLaCapsule();
  const heureAffichee = heure ?? capsule.heure;
  const duJour = visuel === undefined ? visuelsDuJour(date) : null;
  /** L'image du fond : celle qu'on nous donne, ou celle que la cascade a trouvée. */
  const image =
    photo !== undefined
      ? photo
      : duJour
        ? (fond === 'chapitre' ? duJour.imageDuChapitre : duJour.couverture).url
        : null;
  const centreX = 50;
  const centreY = 47;
  const titreLong = couverture.titre.length > 16;
  const chapitre = CHAPITRES[etages.numeroDeChapitre - 1]!;
  const accentDuMagazine = visuelsDuJour(date).magazine.palette.accent;


  return (
    <svg
      viewBox="0 0 100 140"
      width={largeur}
      height={hauteur}
      role="img"
      aria-label={`${couverture.titre} — ${couverture.dateLongue}, ${couverture.figure} · ${etages.magazine} · ${etages.chapitre} · ${etages.titreDuMagazine}`}
      className={className}
      style={{ display: 'block' }}
    >
      {/* LA PHOTO DU JOUR, QUAND ELLE EST LÀ : elle prend le fond, et la couleur du
          jour passe dessus en voile — la palette tient, le texte reste lisible. */}
      {image && (
        <>
          <image
            href={image}
            x="0"
            y="0"
            width="100"
            height="140"
            preserveAspectRatio="xMidYMid slice"
          />
          <rect x="0" y="0" width="100" height="140" fill={fondDuJour} opacity="0.42" />
        </>
      )}

      {/* LE FOND UNI : la couleur de la saison, ou le noir des jours qui ne sont pas comme les autres. */}
      {!image && <rect x="0" y="0" width="100" height="140" fill={fondDuJour} />}

      {/* LA MARQUE EN HAUT, et le numéro du magazine — la couverture appartient à
          la semaine, pas au jour : c'est le même visuel pour ses sept jours. */}
      <text
        x="50"
        y="9"
        textAnchor="middle"
        fill={encre}
        opacity="0.85"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize="3.1"
        letterSpacing="0.9"
      >
        AIME MAGAZINE
      </text>
      {!vignette && (
        <>
          <text
            x="4"
            y="9"
            fill={encre}
            opacity="0.75"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            fontSize="2.5"
            letterSpacing="0.5"
          >
            {etages.magazine.toUpperCase()}
          </text>
          <text
            x="96"
            y="9"
            textAnchor="end"
            fill={encre}
            opacity="0.75"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            fontSize="2.5"
            letterSpacing="0.5"
          >
            {etages.jourDeTrop ? 'HORS CALENDRIER' : etages.semaine.toUpperCase()}
          </text>
        </>
      )}

      {/* LA CRÉATION, AU CENTRE : LE CADRAN, AVEC SES AIGUILLES.
          Le tour = les sept chapitres du magazine ; les branches = les heures du
          jour ; la grande aiguille = l'heure de la capsule temporelle ; la petite
          = le chapitre où la date entre. */}
      <svg x={centreX - 30} y={centreY - 30} width="60" height="60" viewBox="0 0 100 100">
        <CadranDuMagazine
          heure={heureAffichee}
          chapitre={etages.numeroDeChapitre}
          fond={fondDuJour}
          encre={encre}
          accent={accentDuMagazine}
          branches={branches}
          legende={legendeDeLHeure(heureAffichee)}
          vignette={vignette}
        />
      </svg>

      {/* LE TITRE : le nom du jour, écrit au centre, sous la création. */}
      <text
        x="50"
        y="88"
        textAnchor="middle"
        fill={encre}
        fontFamily="-apple-system, BlinkMacSystemFont, 'Inter', 'Manrope', system-ui, sans-serif"
        fontWeight="650"
        fontSize={titreLong ? 6.2 : 7.6}
        letterSpacing="-0.1"
      >
        {couverture.titre}
      </text>
      {couverture.fete && (
        <text
          x="50"
          y="93.4"
          textAnchor="middle"
          fill={encre}
          opacity="0.72"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Inter', 'Manrope', system-ui, sans-serif"
          fontWeight="500"
          fontSize="3.2"
          fontStyle="italic"
        >
          en ce jour de {couverture.fete}
        </text>
      )}

      {/* LE CHAPITRE DU JOUR — la porte par laquelle cette date entre dans le
          magazine. C'est lui qui distingue le 21 septembre du 22. */}
      {!vignette && (
        <text
          x="50"
          y="102"
          textAnchor="middle"
          fill={encre}
          opacity="0.92"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize="2.7"
          letterSpacing="0.6"
        >
          {`CHAPITRE ${String(chapitre.numero).padStart(2, '0')} — ${chapitre.titre.toUpperCase()}`}
        </text>
      )}
      {!vignette && (
        <text
          x="50"
          y="107"
          textAnchor="middle"
          fill={encre}
          opacity="0.68"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Inter', 'Manrope', system-ui, sans-serif"
          fontSize="2.6"
          fontStyle="italic"
        >
          {etages.titreDuMagazine}
        </text>
      )}

      {/* LA DATE EN BAS — et ce que le jour porte, quand on la regarde de près. */}
      <line x1="14" y1="112" x2="86" y2="112" stroke={encre} strokeWidth="0.25" opacity="0.35" />
      <text
        x="50"
        y="119"
        textAnchor="middle"
        fill={encre}
        opacity="0.9"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize="3"
        letterSpacing="0.8"
      >
        {couverture.dateLongue.toUpperCase()}
      </text>
    </svg>
  );
}
