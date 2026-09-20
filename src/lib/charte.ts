/**
 * LA CHARTE — LES RÈGLES DU MAGAZINE, ÉCRITES UNE FOIS
 *
 * Un magazine, ce n'est pas une suite de belles pages : c'est **une règle**, tenue
 * d'un bout à l'autre. C'est ce qui permet de reconnaître une couverture avant de
 * la lire, de feuilleter cinquante numéros sans se perdre, et de dire à quelqu'un
 * qui veut paraître dedans **ce qu'on attend de lui**.
 *
 * Ces règles ne sont pas des conseils : elles sont **vérifiées** (voir
 * `tests/ui.test.ts`). Elles valent pour le site, pour le magazine, et pour
 * **les portraits de studio** que les gens envoient : c'est le prix d'entrée, et
 * c'est aussi ce qui fait qu'un portrait envoyé par un inconnu peut passer en
 * couverture à côté de ceux d'un photographe.
 *
 * **Signé : le fondateur.** Le fondateur et créateur d'AIME®, et l'Association Le Monde
 * Aime — mille mariages, jamais marié, pas d'enfants —
 * la crédibilité, ici, ne vient pas de ce qu'on a vécu : elle vient de
 * **ce qu'on a vu**, et de ce qu'on sait refaire. C'est écrit noir sur blanc, et
 * c'est le sens de ces règles : montrer qui l'on est par ce qu'on tient.
 */

/** La signature du magazine. */
export const SIGNATURE_EDITEUR = 'LE FONDATEUR ET CRÉATEUR D’AIME®';

/** L'association qui porte le monde : elle signe avec lui. */
export const ASSOCIATION = 'Association Le Monde Aime';

/** Ce qu'on appelle « l'éditeur », en une phrase, pour le pied de page. */
export const QUI_EDITE = `${SIGNATURE_EDITEUR} et l’${ASSOCIATION} — mille mariages, jamais marié, pas d’enfants : ce magazine tient ce qu’il a vu.`;

export interface Regle {
  id: string;
  /** La règle, telle qu'on la dirait à quelqu'un qui veut paraître. */
  regle: string;
  /** Pourquoi elle existe. */
  pourquoi: string;
}

export const CHARTE: Regle[] = [
  {
    id: 'fond-uni',
    regle: 'Une saison, un fond uni — et sa couleur est celle du jeu.',
    pourquoi: 'on reconnaît une couverture avant de savoir lire ce qu’elle dit.',
  },
  {
    id: 'creation-centre',
    regle: 'La création est au centre ; rien ne passe jamais dessus.',
    pourquoi: 'l’image respire, et le texte reste lisible — sur les 364 couvertures comme sur la vôtre.',
  },
  {
    id: 'marque-haut',
    regle: 'La marque en haut, le titre au centre, la date en bas.',
    pourquoi: 'la hiérarchie ne bouge pas d’un numéro à l’autre : c’est ça, un magazine.',
  },
  {
    id: 'page-par-heure',
    regle: 'Vingt-quatre pages, une par heure — jamais une de plus, jamais une de moins.',
    pourquoi: 'un nombre fixe fait un magazine ; un nombre variable fait un blog.',
  },
  {
    id: 'portrait-studio',
    regle: 'Le portrait est pris en studio : fond blanc, ou fond noir les jours qui ne sont pas comme les autres.',
    pourquoi: 'la même lumière pour tout le monde — c’est la seule façon d’aligner des inconnus côte à côte.',
  },
  {
    id: 'meme-edition',
    regle: 'Mêmes choix, même édition : ce qui a été publié ne change plus.',
    pourquoi: 'un magazine qu’on relit doit se retrouver à l’identique.',
  },
  {
    id: 'source-dite',
    regle: 'Chaque page dit ce qui l’a décidée.',
    pourquoi: 'la crédibilité ne tient pas à l’assurance, mais à la source.',
  },
  {
    id: 'cadre-constant',
    regle: 'Le cadre est constant : page 1180, lecture 820, trois tailles de titre, pas quatre.',
    pourquoi: 'c’est ce qui permet de tout aligner — les jours, les heures, les gens, et l’autre bout du monde.',
  },
  {
    id: 'profils-editoriaux',
    regle: 'Un fait se cite, une interprétation se signe : les deux ne se mélangent jamais.',
    pourquoi: 'un profil qui mélange l’histoire et l’imagination ne vaut rien ni pour l’une ni pour l’autre.',
  },
  {
    id: 'le-chiffre',
    regle: 'Le chiffre dit sa règle, ne juge personne, et ne se demande qu’à qui veut bien le donner.',
    pourquoi: 'un repère symbolique qui s’explique reste un repère ; un repère qui se tait devient une croyance.',
  },
];


/** La charte, en une ligne, pour la tête de page. */
export const CHARTE_RESUME = `${CHARTE.length} règles, tenues et vérifiées — signées ${SIGNATURE_EDITEUR}.`;
