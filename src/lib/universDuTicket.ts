/* LES UNIVERS DE TICKET — LE TICKET N'EST PAS QU'UN MARIAGE
 *
 * « Le ticket, y'a plein de détails dessus qui n'ont rien à voir avec le
 * mariage… mais c'est ça qui est intéressant : on pourrait avoir une page
 * ticket pour plein d'autres univers. »
 *
 * Voilà la règle, et elle ouvre tout : **n'importe qui compose un ticket, et
 * décide qui le voit.** Chaque univers est un ticket de caisse comme les
 * autres — un mot, des lignes, des prix quand il y en a — mais il ne raconte
 * pas le même métier :
 *
 *   MINI-SITE     le site des invités, ligne à ligne
 *   PHOTOS        les moments à prendre en photo — la mission, puis la pellicule
 *   VIDÉOS        moins de dix secondes, un moment par clip
 *   REPAS         les recettes, ce qu'il faut acheter, qui le prépare
 *   ENFANTS       les missions des enfants, à cocher le jour J
 *   DJ            toute la playlist, et les gens qui l'enrichissent
 *   RSVP          qui vient, qui mange quoi, qui dort où
 *   TÉMOINS       le ticket des témoins : le mot, la bague, le timing
 *   DÉLIRES       le ticket des conneries — pour rire, et ça compte
 *   DEVIS         les devis, les factures, les acomptes, les soldes
 *   PAPIERS       l'administratif et le juridique, à part : les 31 pièces
 *
 * Rien n'est stocké : un ticket est **une adresse** — `?ticket=photos&lignes=…`
 * — comme le caddie du mariage l'est déjà.
 */

import { MOTS_ADMINISTRATIFS } from './triDuTicket';

export interface LigneDUnivers {
  id: string;
  /** Le mot de la ligne, tel qu'il s'imprime. */
  mot: string;
  /** Ce qu'on lit dessous : la consigne, le moment, l'ingrédient. */
  sous?: string;
  /** Le prix, quand il y en a un — et `0` quand c'est inclus. */
  prix?: number;
  /** Inclus : la ligne figure au papier sans charger la note. */
  inclus?: boolean;
  /** Le moment de la journée : `22:17`. */
  heure?: string;
}

export interface UniversDeTicket {
  id: string;
  /** Le mot du ticket, en capitales : `PHOTOS`. */
  mot: string;
  /** Ce que ce ticket fait, en une phrase. */
  sous: string;
  /** L'image qui porte le ticket. */
  image: string;
  /** **Qui le voit par défaut** — et l'on peut en changer. */
  qui: string;
  /** Ce qu'on fait de chaque ligne, dit au pupitre : `PRENDRE`, `COCHER`… */
  geste: string;
  lignes: LigneDUnivers[];
}

/** **Qui peut voir un ticket.** C'est le second réglage de l'éditeur. */
export const QUI_PEUT_VOIR = [
  'les mariés',
  'les invités',
  'la famille',
  'les témoins',
  'les enfants',
  'le DJ',
  'les métiers',
  'tout le monde',
] as const;

const MOMENTS_PHOTO = [
  { heure: '22:00', mot: 'Les néons du supermarché', sous: 'la lumière verte, les caddies alignés' },
  { heure: '22:17', mot: 'La cérémonie — rayon 7', sous: 'deux oui, un caddie, personne autour' },
  { heure: '22:30', mot: 'Le cocktail — surgelés', sous: 'les verres, les mains, les rires' },
  { heure: '23:00', mot: 'Le dîner — la table', sous: 'de haut, toute la table ensemble' },
  { heure: '23:30', mot: 'Le discours', sous: 'celui qui parle, et ceux qui écoutent' },
  { heure: '23:45', mot: 'La première danse', sous: 'les pieds, puis les visages' },
  { heure: '00:30', mot: 'La pièce montée', sous: 'avant la première part' },
  { heure: '01:00', mot: 'La piste, à hauteur de main', sous: 'ce que personne ne voit jamais' },
  { heure: '01:30', mot: 'Les mariés, de dos', sous: 'en train de regarder les autres' },
  { heure: '02:00', mot: 'La sortie — la nuit', sous: 'les lumières, la porte, le dehors' },
  { heure: '02:17', mot: 'Le dernier selfie', sous: 'ceux qui restent' },
  { heure: '04:00', mot: 'Le rangement', sous: 'les tables vides, le silence' },
];

/**
 * **Les tickets du monde** — onze univers, chacun avec ses lignes. Un ticket
 * *est* un métier : on n'y met pas les mêmes lignes si l'on demande des photos,
 * un dîner ou un devis.
 */
export const UNIVERS_DU_TICKET: UniversDeTicket[] = [
  {
    id: 'mini-site',
    mot: 'MINI-SITE',
    sous: 'le site des invités, ligne à ligne : ce qui est coché s’affiche',
    image: '/images/couple-paris.jpg',
    qui: 'les invités',
    geste: 'AFFICHER',
    lignes: [
      { id: 'site-couverture', mot: 'La couverture', sous: 'l’image du jour, les noms, la date', inclus: true },
      { id: 'site-programme', mot: 'Le programme', sous: 'les heures, dans l’ordre', inclus: true },
      { id: 'site-gens', mot: 'Les gens', sous: 'les métiers du jour, chacun sa place' },
      { id: 'site-diner', mot: 'Le dîner', sous: 'le menu, et ce qu’on sert' },
      { id: 'site-voyage', mot: 'Le voyage', sous: 'le rêve, et ce qu’il reste à financer', inclus: true },
      { id: 'site-ticket', mot: 'Le ticket', sous: 'le récapitulatif, ligne à ligne', inclus: true },
      { id: 'site-rsvp', mot: 'Les réponses', sous: 'qui vient, et ce qu’il mange', inclus: true },
      { id: 'site-hebergement', mot: 'Où dormir', sous: 'les nuits, les chambres, les navettes', inclus: true },
    ],
  },
  {
    id: 'photos',
    mot: 'PHOTOS',
    sous: 'douze moments à prendre — on prend la mission, le jour J on appuie',
    image: '/images/punk-papier.jpg',
    qui: 'les invités',
    geste: 'PRENDRE',
    lignes: MOMENTS_PHOTO.map((m, rang) => ({
      id: `photo-${String(rang + 1).padStart(2, '0')}`,
      mot: `${m.heure} · ${m.mot}`,
      sous: m.sous,
      heure: m.heure,
      inclus: true,
    })),
  },
  {
    id: 'videos',
    mot: 'VIDÉOS',
    sous: 'moins de dix secondes, un moment par clip — on ne filme que ça',
    image: '/images/brutal.jpg',
    qui: 'les invités',
    geste: 'FILMER',
    lignes: [
      { id: 'video-01', mot: '01 · L’arrivée', sous: 'la porte, les premiers pas, le bruit', inclus: true },
      { id: 'video-02', mot: '02 · Le oui', sous: 'dix secondes, pas plus — tout est dit', inclus: true },
      { id: 'video-03', mot: '03 · Les mains', sous: 'les bagues, les verres, les gestes', inclus: true },
      { id: 'video-04', mot: '04 · Le discours', sous: 'seulement la chute', inclus: true },
      { id: 'video-05', mot: '05 · La première danse', sous: 'en tournant, une seule fois', inclus: true },
      { id: 'video-06', mot: '06 · La piste', sous: 'les jambes, le sol, les lumières', inclus: true },
      { id: 'video-07', mot: '07 · Un message aux mariés', sous: 'chacun son vœu, à l’écran', inclus: true },
      { id: 'video-08', mot: '08 · La fin de nuit', sous: 'ce qui reste quand tout est fini', inclus: true },
    ],
  },
  {
    id: 'repas',
    mot: 'REPAS',
    sous: 'les recettes, tout ce qu’il faut acheter, et qui le prépare',
    image: '/images/chateau-terrasse-champagne.jpg',
    qui: 'la famille',
    geste: 'PRÉPARER',
    lignes: [
      { id: 'repas-entree', mot: 'L’entrée — tomates et burrata', sous: '20 parts · 1 h · la veille', prix: 62 },
      { id: 'repas-plat', mot: 'Le plat — épaule d’agneau sept heures', sous: '20 parts · 4 h · la veille', prix: 148 },
      { id: 'repas-vege', mot: 'Le plat végétarien — gratin de courges', sous: '6 parts · 1 h · le jour même', prix: 34 },
      { id: 'repas-fromage', mot: 'Le fromage', sous: 'à acheter au marché · le matin', prix: 78 },
      { id: 'repas-cake', mot: 'Le cake — pièce montée maison', sous: '3 étages · 2 h · l’après-midi', prix: 96 },
      { id: 'repas-pain', mot: 'Le pain', sous: '6 baguettes · à 18:00', prix: 12 },
      { id: 'repas-glace', mot: 'Les glaces des enfants', sous: '24 bâtonnets · au congélateur', prix: 19 },
      { id: 'repas-boissons', mot: 'Les boissons', sous: 'qui apporte quoi — à remplir', prix: 210 },
      { id: 'repas-glaciere', mot: 'La glacière', sous: 'empruntée à Paul · à rendre le lundi', prix: 0 },
      { id: 'repas-vaisselle', mot: 'La vaisselle', sous: '200 assiettes · 200 verres · 300 couverts', prix: 84 },
    ],
  },
  {
    id: 'enfants',
    mot: 'ENFANTS',
    sous: 'dix missions — on en prend une, et on la montre aux mariés le soir',
    image: '/images/chateau-bengale-bal.jpg',
    qui: 'les enfants',
    geste: 'RELEVER',
    lignes: [
      { id: 'enfant-01', mot: '01 · Compter les cravates', sous: 'le nombre exact, écrit ici', inclus: true },
      { id: 'enfant-02', mot: '02 · Dessiner les mariés', sous: 'au dos du ticket', inclus: true },
      { id: 'enfant-03', mot: '03 · Trouver la plus vieille chaussure', sous: 'et son propriétaire', inclus: true },
      { id: 'enfant-04', mot: '04 · Apporter un verre à Mamie', sous: 'sans le renverser — ça compte double', inclus: true },
      { id: 'enfant-05', mot: '05 · Faire danser quelqu’un qui ne danse pas', sous: 'une preuve demandée', inclus: true },
      { id: 'enfant-06', mot: '06 · Compter les enfants', sous: 'sans les compter deux fois', inclus: true },
      { id: 'enfant-07', mot: '07 · Le sandwich le plus haut', sous: 'photo à l’appui', inclus: true },
      { id: 'enfant-08', mot: '08 · Trouver le mot « merci »', sous: 'dans la salle', inclus: true },
      { id: 'enfant-09', mot: '09 · Ranger dix verres', sous: 'le bar vous remercie', inclus: true },
      { id: 'enfant-10', mot: '10 · Un vœu dans la boîte', sous: 'sans le montrer à personne', inclus: true },
    ],
  },
  {
    id: 'dj',
    mot: 'DJ',
    sous: 'toute la playlist, moment par moment — et les gens l’enrichissent',
    image: '/images/club-strobe-kiss.jpg',
    qui: 'le DJ',
    geste: 'AJOUTER',
    lignes: [
      { id: 'dj-ceremonie', mot: '1. Cérémonie — 16:00', sous: 'deux morceaux, pas un de plus', inclus: true },
      { id: 'dj-cocktail', mot: '2. Cocktail — 17:45', sous: 'ça se parle, ça s’entend sans crier', inclus: true },
      { id: 'dj-entree', mot: '3. Entrée — 20:05', sous: 'le morceau que personne n’attend', inclus: true },
      { id: 'dj-diner', mot: '4. Dîner — 21:00', sous: 'on mange, on ne danse pas encore', inclus: true },
      { id: 'dj-gateau', mot: '5. Pièce montée — 23:15', sous: 'court, fort, et tout le monde debout', inclus: true },
      { id: 'dj-premiere', mot: '6. Ouverture — 23:30', sous: 'eux deux, puis les parents', inclus: true },
      { id: 'dj-piste', mot: '7. Piste ouverte — 23:45', sous: 'les classiques, et les demandes', inclus: true },
      { id: 'dj-peak', mot: '8. Peak — 01:00', sous: 'le moment où tout lâche', inclus: true },
      { id: 'dj-closing', mot: '9. Closing — 02:17', sous: 'le morceau gagné, et la lumière qui monte', inclus: true },
    ],
  },
  {
    id: 'rsvp',
    mot: 'RSVP',
    sous: 'qui vient, qui mange quoi, qui dort où — et rien à demander deux fois',
    image: '/images/reunion.jpg',
    qui: 'les invités',
    geste: 'RÉPONDRE',
    lignes: [
      { id: 'rsvp-oui', mot: 'Je viens', sous: 'oui, non, ou oui mais pas au dîner', inclus: true },
      { id: 'rsvp-nb', mot: 'Nous sommes…', sous: 'adultes, enfants, et qui a besoin d’un lit', inclus: true },
      { id: 'rsvp-repas', mot: 'Je mange', sous: 'tout, sans viande, sans lait, sans gluten', inclus: true },
      { id: 'rsvp-allergie', mot: 'Attention à…', sous: 'allergies et traitements, dits une fois', inclus: true },
      { id: 'rsvp-transport', mot: 'J’arrive en…', sous: 'train, voiture, avion — et il me reste des places', inclus: true },
      { id: 'rsvp-nuit', mot: 'Je dors', sous: 'sur place, à l’hôtel, chez quelqu’un', inclus: true },
      { id: 'rsvp-musique', mot: 'Ma musique', sous: 'le morceau qui me fera danser', inclus: true },
      { id: 'rsvp-message', mot: 'Un mot pour eux', sous: 'lu au dessert, ou gardé', inclus: true },
    ],
  },
  {
    id: 'temoins',
    mot: 'TÉMOINS',
    sous: 'le ticket des témoins : le mot, la bague, l’heure, et les pièges',
    image: '/images/alliances.jpg',
    qui: 'les témoins',
    geste: 'COCHER',
    lignes: [
      { id: 'temoins-discours', mot: 'Le discours', sous: 'écrit, relu, chronométré — 4 minutes', inclus: true },
      { id: 'temoins-bagues', mot: 'Les alliances', sous: 'dans la poche droite. Pas dans la gauche.', inclus: true },
      { id: 'temoins-papiers', mot: 'Les papiers', sous: 'la mairie, l’église, les signatures', inclus: true },
      { id: 'temoins-tele', mot: 'Les téléphones', sous: 'les éteindre, ou les confisquer', inclus: true },
      { id: 'temoins-bouteille', mot: 'La bouteille du premier rang', sous: 'planquée pour la fin de la cérémonie', inclus: true },
      { id: 'temoins-photo', mot: 'La photo de groupe', sous: 'tout le monde, 30 secondes, avant le dîner', inclus: true },
      { id: 'temoins-reveil', mot: 'Réveiller les mariés', sous: 'et les faire partir à l’heure', inclus: true },
      { id: 'temoins-facture', mot: 'Ce qui reste à payer', sous: 'le solde : voir le ticket DEVIS', inclus: true },
    ],
  },
  {
    id: 'delires',
    mot: 'DÉLIRES',
    sous: 'le ticket des conneries — c’est le plus lu, et ça compte',
    image: '/images/laverie.jpg',
    qui: 'tout le monde',
    geste: 'CRIER',
    lignes: [
      { id: 'delire-01', mot: 'Le pari : qui tient le plus longtemps', sous: 'sans son téléphone · 10 €', prix: 10 },
      { id: 'delire-02', mot: 'La cravate la plus laide', sous: 'jugée par les enfants · 5 €', prix: 5 },
      { id: 'delire-03', mot: 'Le mot interdit dit pendant le discours', sous: 'l’amende est fixée · 2 €', prix: 2 },
      { id: 'delire-04', mot: 'Le karaoké surprise à 01:00', sous: 'pas de secours possible', inclus: true },
      { id: 'delire-05', mot: 'Le selfie obligatoire avec un inconnu', sous: 'preuve à l’appui, un seul essai', inclus: true },
      { id: 'delire-06', mot: 'Le meilleur cadeau trouvé à 2 €', sous: 'et il compte vraiment', prix: 2 },
      { id: 'delire-07', mot: 'La chanson à refaire en boucle', sous: 'trois fois maximum, loi du DJ', inclus: true },
      { id: 'delire-08', mot: 'Le classement des desserts', sous: 'notes sur vingt, le lendemain', inclus: true },
      { id: 'delire-09', mot: 'Le plat qu’on n’aurait jamais dû finir', sous: 'et qui finit par être le plat', inclus: true },
      { id: 'delire-10', mot: 'La danse de la dernière heure', sous: 'tout le monde, sans exception', inclus: true },
    ],
  },
  {
    id: 'devis',
    mot: 'DEVIS',
    sous: 'les devis, les factures, les acomptes, les soldes — et ce qui reste',
    image: '/images/supermarche-vows.jpg',
    qui: 'les mariés',
    geste: 'VALIDER',
    lignes: [
      { id: 'devis-lieu', mot: 'Le lieu — devis', sous: 'salle, extérieur, mise en place', prix: 6800 },
      { id: 'devis-traiteur', mot: 'Le traiteur — devis', sous: 'repas, service, vaisselle', prix: 7420 },
      { id: 'devis-photo', mot: 'Le photographe — devis', sous: 'la journée entière, 400 photos', prix: 2140 },
      { id: 'devis-musique', mot: 'Le DJ — devis', sous: 'son, lumière, jusqu’à 4 h', prix: 1610 },
      { id: 'devis-fleurs', mot: 'Les fleurs — devis', sous: 'bouquet, table, boutonnières', prix: 890 },
      { id: 'devis-acompte', mot: 'L’acompte versé', sous: '30 % — la date est réservée', prix: -6750 },
      { id: 'devis-solde', mot: 'Le solde, à 30 jours', sous: 'avant le 12 juin', inclus: true },
      { id: 'devis-extra', mot: 'Ce qui n’était pas prévu', sous: 'la ligne qu’on assume', prix: 412 },
    ],
  },
  {
    id: 'papiers',
    mot: 'PAPIERS',
    /* **L'administratif a son ticket.** Rien n'est supprimé : les pièces
       quittent le ticket du mariage et viennent ici — prêtes le jour où l'on
       demande l'attestation, la procuration, ou le visa du voyage. */
    sous: 'l’administratif et le juridique, à part — prêt quand on le demande',
    image: '/images/punk-papier.jpg',
    qui: 'les mariés',
    geste: 'RÉUNIR',
    lignes: MOTS_ADMINISTRATIFS.map((p) => ({ id: p.id, mot: p.mot, sous: p.sous, inclus: true })),
  },
];

/** **Les identifiants des tickets**, dans l'ordre du catalogue. */
export const IDS_DES_UNIVERS = UNIVERS_DU_TICKET.map((u) => u.id);

/** Le ticket d'un univers ; le mini-site quand on ne sait pas. */
export function universParId(id: string): UniversDeTicket {
  return UNIVERS_DU_TICKET.find((u) => u.id === id) ?? UNIVERS_DU_TICKET[0]!;
}

/** Une ligne, dans un univers — pour les vérifications et l'impression. */
export function ligneDUnivers(univers: string, id: string): LigneDUnivers | undefined {
  return universParId(univers).lignes.find((l) => l.id === id);
}

export interface TicketComposé {
  /** L'univers du ticket. */
  univers: UniversDeTicket;
  /** **Ce qui est coché** : ces lignes-là, et pas les autres. */
  lignes: LigneDUnivers[];
  /** Le compte, le total, et le total payant. */
  compte: number;
  total: number;
  /** Vraie quand tout ce que l'univers propose est coché. */
  complet: boolean;
  /** À qui ce ticket est destiné. */
  qui: string;
  /** Le nom du ticket, tel que les mariés l'ont écrit. */
  nom: string;
  /** **Le lien du ticket** : c'est lui qu'on envoie, et il porte tout. */
  adresse: string;
}

/** Combien de lignes un univers propose. */
export function compteDUnivers(id: string): number {
  return universParId(id).lignes.length;
}

/** **Le lien d'un ticket** : l'univers, les lignes cochées, et qui le voit. */
export function adresseDuTicket(
  univers: string,
  cochées: string[],
  qui?: string,
  nom?: string,
): string {
  const suite = new URLSearchParams();
  suite.set('ticket', univers);
  if (cochées.length > 0) suite.set('lignes', cochées.join(','));
  if (qui) suite.set('qui', qui);
  if (nom?.trim()) suite.set('nom', nom.trim());
  return `?${suite.toString()}`;
}

/**
 * **Composer un ticket** : on choisit l'univers, on coche ses lignes, on dit
 * qui le voit et comment il s'appelle. Le reste — le compte, le total, le lien
 * — se calcule.
 */
export function composerLeTicketDeLUnivers(
  univers: string,
  cochées: string[],
  qui = '',
  nom = '',
): TicketComposé {
  const u = universParId(univers);
  const prises = new Set(cochées);
  const lignes = u.lignes.filter((l) => prises.has(l.id));
  const payantes = lignes.filter((l) => !l.inclus && (l.prix ?? 0) !== 0);
  return {
    univers: u,
    lignes,
    compte: lignes.length,
    total: payantes.reduce((somme, l) => somme + (l.prix ?? 0), 0),
    complet: lignes.length === u.lignes.length,
    qui: qui.trim() || u.qui,
    nom: nom.trim() || u.mot,
    adresse: adresseDuTicket(u.id, cochées, qui.trim() || u.qui, nom.trim() || u.mot),
  };
}

/** **Ce que le pupitre écrit** quand un ticket sort : son compte, son nom. */
export function phraseDuTicket(ticket: TicketComposé): string {
  return `${ticket.nom} · ${ticket.compte} LIGNE${ticket.compte > 1 ? 'S' : ''} · ${ticket.qui.toUpperCase()}`;
}
