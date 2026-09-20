import { CATÉGORIES_DU_TICKET, GROUPES_DU_TICKET, LIGNES_DU_TICKET } from './categoriesDuTicket';
import { PACKAGES } from './superMariage';
import { THEME_CONFIGS } from './themeConfigs';

/* LES BANDES DE LA PAGE — LA COMPOSITION, SANS LA COPIE
 *
 * La page d'entrée se lit **par bandes**, comme la référence étudiée (Tapdaa,
 * 20 septembre 2026) : une barre qui porte la marque, un titre, une suite
 * numérotée, trois colonnes égales, une bande d'image calme, trois formules,
 * des questions, un pied. Ce qui est repris, c'est **le rythme** ; ce qui est
 * écrit, c'est **le matériel d'AIME** — les trois familles du ticket, les trois
 * formules du magasin, les questions du thème, les images du magazine.
 *
 * Ce fichier ne contient **que du texte et des chiffres** : aucun composant,
 * aucune couleur. Les bandes s'écrivent ailleurs.
 */

/** Ce que la barre annonce à gauche, et le mot de la barre à droite. */
export const LA_BARRE = {
  marque: 'AIME',
  filet: 'SUPER MARIAGE',
  liens: [
    { mot: 'LE TICKET', vers: '#la-machine' },
    { mot: 'LE MAGAZINE', vers: '/magazine' },
    { mot: 'LES MÉTIERS', vers: '/metiers' },
    { mot: 'SUPER RIPPLE', vers: '/ripple' },
  ],
  pastille: { mot: 'Ouvrir le ticket', vers: '#la-machine' },
};

/** La première bande : le titre, la promesse, et la couverture du jour. */
export const LE_TITRE = {
  eyebrow: 'SUPER MARIAGE · LE SPÉCIALISTE DU TICKET',
  titre: 'Tout le mariage, sur un seul ticket.',
  sous: 'On coche. La machine affiche. Le papier sort, et il part dans les portefeuilles : le couple, les invités, la famille, le DJ, les métiers.',
  pastilles: [
    { mot: 'Ouvrir la machine', vers: '#la-machine', fort: true },
    { mot: 'Descendre : les 99 lignes', vers: '#on-coche', fort: false },
  ],
  legende: 'LA COUVERTURE DU JOUR',
};

/** Les quatre gestes — ce qui se passe, dans l'ordre, du premier au dernier. */
export const LES_GESTES: Array<{ numero: string; titre: string; texte: string }> = [
  {
    numero: '01',
    titre: 'On coche',
    texte:
      'Les horaires, les métiers, les blocs du site, les documents : 99 lignes, rangées en trois familles. Rien à chercher — on prend ce qu’on veut.',
  },
  {
    numero: '02',
    titre: 'Le ticket calcule',
    texte:
      'Sous-total, remise de fidélité, TVA, total. Le calcul est fait une fois, au même endroit, et il est juste à la ligne près.',
  },
  {
    numero: '03',
    titre: 'Il sort de la fente',
    texte:
      'Le papier sort de la machine et part vers ses portefeuilles. C’est le même geste pour tout le monde : ce qui est coché est ce qui sort.',
  },
  {
    numero: '04',
    titre: 'Chacun a son papier',
    texte:
      'Le couple, les invités, la famille, le DJ, les métiers : cinq papiers, cinq adresses. Le lien est le reçu — on peut l’envoyer tel quel.',
  },
];

/** Les trois familles : ce qu'on coche, combien, et ce que ça donne. */
export interface FamilleDeLaLanding {
  id: string;
  mot: string;
  sous: string;
  compte: number;
  /** Ce que la famille donne au ticket : un prix, ou « inclus ». */
  donne: string;
  /** L'ancre de la section, en bas de page. */
  vers: string;
}

export const LES_TROIS_FAMILLES: FamilleDeLaLanding[] = GROUPES_DU_TICKET.map((groupe) => {
  const lignes = LIGNES_DU_TICKET.filter(
    (l) => CATÉGORIES_DU_TICKET.find((c) => c.id === l.catégorie)?.groupe === groupe.id,
  );
  return {
    id: groupe.id,
    mot: groupe.mot,
    sous: groupe.sous,
    compte: lignes.length,
    donne: lignes.some((l) => !l.incluse) ? 'un prix, un total' : 'inclus',
    vers: `#groupe-${groupe.id}`,
  };
});

/** Les trois formules du magasin : les menus, tels qu'ils sont déjà écrits. */
export const LES_FORMULES = PACKAGES.map((menu) => ({
  id: menu.id,
  nom: menu.name,
  prix: menu.prix,
  note: menu.popular ? 'le plus iconique' : '',
  description: menu.description,
  lignes: menu.features,
  plusTard: 'à cocher dans le ticket',
}));

/** Les questions qu'on nous pose — celles du thème, et deux de plus. */
export const LES_QUESTIONS: Array<{ question: string; reponse: string }> = [
  ...THEME_CONFIGS.supermarche!.faq.map((q) => ({ question: q.question, reponse: q.answer })),
  {
    question: 'Est-ce que je paie quelque chose ici ?',
    reponse:
      'Non. Les prix sont indicatifs — le ticket chiffre un projet, il n’encaisse rien, et aucun paiement n’est demandé.',
  },
  {
    question: 'Et si je ne sais pas quoi cocher ?',
    reponse:
      'La machine propose. Elle fait passer une famille, puis ses lignes, une par une : ✓ on garde, ✗ on passe. On peut aussi écrire ce qu’on veut dans le champ.',
  },
];

/** Le pied : la marque, les portes, et rien de plus. */
export const LE_PIED = {
  marque: 'AIME',
  filet: 'SUPER MARIAGE · LE SPÉCIALISTE DU TICKET',
  liens: [
    { mot: 'Le ticket', vers: '#la-machine' },
    { mot: 'Le magasin, tout en cases', vers: '/magazine?monde=magasin' },
    { mot: 'Les métiers', vers: '/metiers' },
    { mot: 'AIME', vers: '/aime' },
    { mot: 'Super Ripple', vers: '/ripple' },
  ],
};
