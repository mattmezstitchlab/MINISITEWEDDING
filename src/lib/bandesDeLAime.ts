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
  eyebrow: 'SUPER MARIAGE',
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
  filet: 'SUPER MARIAGE',
  liens: [
    { mot: 'Le ticket', vers: '#la-machine' },
    { mot: 'Le magasin, tout en cases', vers: '/magazine?monde=magasin' },
    { mot: 'Les métiers', vers: '/metiers' },
    { mot: 'AIME', vers: '/aime' },
    { mot: 'Super Ripple', vers: '/ripple' },
  ],
};

/* ————————————————— IL EST LE SPÉCIALISTE DU TICKET DE CAISSE ————————————————— */

/**
 * **Le spécialiste du ticket de caisse** — ce qu'on est, en une phrase, écrit
 * **au début du ticket**. C'est la direction du 20 septembre 2026 : ce n'est
 * pas un site de mariage de plus, c'est la machine qui chiffre un mariage et
 * **ce qui reste pour le voyage**.
 */
export const LE_SPÉCIALISTE = {
  marque: 'SUPER MARIAGE',
  metier: 'LE SPÉCIALISTE DU TICKET DE CAISSE',
  phrase: 'On décrit son rêve. On coche le reste. Le ticket dit le prix — et ce qu’il reste pour le voyage.',
  cible: 'Le rêve : Joshua Tree, à deux, sous les étoiles.',
};

/* ———————————————————— LES QUATRE HÉROS : L'ARBORESCENCE ———————————————————— */

/**
 * **Les quatre héros de la page d'entrée.** Chacun est **une image, un titre
 * dessus, et le chemin de ce qu'il contient** — c'est ainsi que l'arborescence
 * du produit se voit d'un coup d'œil, au lieu d'être expliquée.
 *
 * Les images viennent du fonds du site (elles ont été livrées) : aucun visuel
 * emprunté à quelqu'un d'autre, et le format est le même que partout — une
 * image, et le titre dessus.
 */
export interface HérosDeLaLanding {
  id: string;
  /** Le mot du héros : c'est aussi le mot du bouton rond quand il y en a un. */
  mot: string;
  /** Le titre, posé sur l'image. */
  titre: string;
  /** Ce qui se lit dessous, sur l'image. */
  sous: string;
  /** Le chemin : ce qu'il y a dedans, mot pour mot. */
  chemin: string[];
  image: string;
  /** Où l'on va quand on l'ouvre. */
  vers: string;
}

export const LES_HÉROS: HérosDeLaLanding[] = [
  {
    id: 'mariage',
    mot: 'LE JOUR J',
    titre: 'Un mariage qui ne coûte pas le voyage.',
    sous: 'Ce qui a un prix : les horaires, les métiers, les menus.',
    chemin: ['les horaires', 'les douze rayons', 'les trois menus', 'les petits prix'],
    image: '/images/last-minute.jpg',
    vers: '#on-coche',
  },
  {
    id: 'voyage',
    mot: 'LE VOYAGE',
    titre: 'Le désert, la nuit, les étoiles.',
    sous: 'Deux billets, six nuits, une voiture : 4 320 € à financer, ligne après ligne.',
    chemin: ['le billet d’avion', 'le budget du rêve', 'les économies', 'la date du départ'],
    image: '/images/desert-star-dance.jpg',
    vers: '#l-appareil',
  },
  {
    id: 'objets',
    mot: 'LES OBJETS',
    titre: 'Billet d’avion, carte postale, timbre.',
    sous: 'Ce qui sort de la fente : six objets, et des stickers carrés.',
    chemin: ['le billet d’avion', 'la carte postale', 'le timbre', 'le tampon', 'les stickers'],
    image: '/images/couple-paris.jpg',
    vers: '#l-appareil',
  },
  {
    id: 'acces',
    mot: 'L’ACCÈS',
    titre: 'Un code, et tout s’ouvre.',
    sous: 'Le code du mariage : c’est lui qui ouvre le site, et qui part dans le lien.',
    chemin: ['le code du mariage', 'l’adresse à partager', 'les blocs du site', 'les documents'],
    image: '/images/reunion.jpg',
    vers: '#les-trois-familles',
  },
];
