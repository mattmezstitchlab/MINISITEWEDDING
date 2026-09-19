import { styleById, WEDDING_STYLES } from './weddingStyles';
import { contentFor } from './universeContent';
import { getScenesForStyle } from './themeTimelineScenarios';
import { euros } from './universeContent';

/**
 * LE MAGAZINE
 *
 * Deux familles d'articles : ceux qui racontent chaque univers — ce qu'il est,
 * comment la journée s'y déroule, quels métiers le font tourner, et à quoi
 * ressemble son mini-site — et les guides, qui répondent aux questions qu'on se
 * pose pour n'importe quel mariage.
 */

export interface ArticleSection {
  heading: string;
  body: string[];
  /** Une liste à puces, quand le texte se lit mieux ainsi. */
  bullets?: string[];
}

export interface Article {
  slug: string;
  category: 'univers' | 'guide' | 'insolite';
  title: string;
  kicker: string;
  /** L'univers dont parle l'article, s'il y en a un. */
  universeId?: string;
  cover: string;
  readingMinutes: number;
  intro: string;
  sections: ArticleSection[];
}

/** Les mots d'ouverture, écrits pour chaque univers. */
const OUVERTURES: Record<string, string> = {
  traditionnel:
    'Il y a des mariages qu’on croit connaître par cœur et qu’on rate souvent par excès de confiance. Celui-ci est le contraire : c’est le classique, exécuté sans une approximation. Église à quinze heures, banquet à dix-neuf, bal jusqu’à l’aube : rien d’original, tout est juste.',
  corse:
    'En Corse, on ne décore pas un lieu : c’est le lieu qui décide. Une bergerie de pierre sur une crête, le maquis qui parfume tout, la mer en contrebas, et des voix qui montent du vallon quand le jour tombe. Le mariage s’adapte à la montagne, jamais l’inverse.',
  reunion:
    'La Réunion se marie dehors, sous une varangue, à l’ombre des frangipaniers. Les marmites ont démarré le matin, les tambours entrent après le dessert, et personne ne demande l’heure à personne. C’est un mariage où l’on mange beaucoup et où l’on danse encore plus.',
  'new-york':
    'Il y a une façon américaine de faire les choses : on réserve un toit à Brooklyn, on accroche des guirlandes entre deux réservoirs d’eau, et on commence à dîner exactement quand le soleil descend sur Manhattan. La ville fait la moitié du travail ; il reste à tenir le rythme.',
  vegas:
    'C’est un mariage qu’on assume totalement ou pas du tout : chapelle en néon, arche de fleurs, Elvis en costume à paillettes et cérémonie de vingt minutes. Derrière le clin d’œil, il y a une vraie logistique — créneau de chapelle, licence, limousine — et une soirée qui finit très, très tard.',
  'noir-blanc':
    'Retirer la couleur, c’est retirer tout ce qui décore pour ne garder que ce qui compte : la lumière, le grain, la coupe. Un mariage en noir et blanc ne pardonne rien — mais quand il est bien tenu, chaque photo ressemble à une page de magazine.',
  'chateau-moderne':
    'Le château moderne est un exercice d’équilibre : garder la pierre blonde et les allées de tilleuls, mais retirer les dorures, les nappes superposées et les compositions trop hautes. Ce qui reste est plus élégant et beaucoup plus facile à photographier.',
  brutal:
    'Le brutalisme en mariage, c’est un pari : pas de fleurs, une dalle de béton, des faisceaux de lumière qui découpent les arêtes, et une seule tige blanche pour tout décor. Le luxe n’est plus dans l’accumulation mais dans le vide tenu.',
  club:
    'Ce mariage commence comme une soirée et se termine comme une cérémonie — inversée, donc. On danse d’abord, on se dit oui à 02h17, et la piste est déjà pleine. La basse fait le travail que l’orgue fait ailleurs.',
  desert:
    'Un motel au bout de la route, une piscine vide, des néons qui grésillent, et trente-huit degrés à dix-neuf heures. Le désert impose son rythme : on se marie au coucher du soleil, on dîne dehors, on danse dans la poussière.',
  'garden-party':
    'Un banquet sous les arbres, une seule grande table, des herbes folles et des guirlandes de rien du tout. Le mariage champêtre rate quand il accumule : ici, tout vient du potager, du verger, et de la lumière de juillet.',
  supermarche:
    'Se marier dans un supermarché après la fermeture, entre deux rayons, c’est un choix radical qui ne pardonne pas l’improvisation : il faut un lieu qui accepte, une sécurité, et une scénographie qui transforme les gondoles en décor.',
  laverie:
    'La laverie est probablement l’idée la plus tendre de cette collection : quarante-cinq personnes entre des machines qui tournent, une sweet table pastel, un bar à bulles et une playlist douce. On danse entre les paniers.',
  'foret-noire':
    'Ici, le silence fait partie de la cérémonie. Vingt-six personnes seulement, une clairière, des lanternes, du chevreuil mariné aux baies de genièvre et un rituel qui n’a rien de religieux mais tout d’un passage.',
  cinema:
    'Louer une salle de cinéma pour la nuit, c’est s’offrir un vrai générique : fauteuils rouges, rideau, projection du film du couple, puis dîner au foyer et bar à bonbons. La salle se lève à la fin, comme au cinéma.',
  'rooftop-paris':
    'Une terrasse au septième étage, les toits de Paris à perte de vue, et un dîner servi quand la lumière devient orange. Le rooftop impose ses contraintes — jauge, ascenseur, pas de talon aiguille — et les vaut largement.',
  punk:
    'Faire-part risographiés en trois couleurs, groupes de garage, bières artisanales : le mariage punk est un atelier, pas une salle de réception. Le beau y est brut, taché, fabriqué à la main.',
  brocante:
    'Cent quatre-vingts assiettes différentes, des chaises dépareillées, des nappes chinées : le mariage brocante transforme le mélange en parti pris. Rien ne va ensemble, et c’est exactement pourquoi ça fonctionne.',
  cosmic:
    'Verre liquide, chromes et synthés : cet univers transforme une salle en station spatiale, avec projection du ciel de la nuit où les mariés se sont rencontrés et un sound designer aux manettes.',
  'co-mariage':
    'Deux couples, deux cérémonies, une seule scène et une seule billetterie : le co-mariage divise la facture par deux et multiplie l’énergie par quatre. Il exige en revanche une discipline de festival.',
  abyssal:
    'Onze mètres sous la surface, une salle immergée, et la lumière qui vient de l’eau. Le dîner abyssal se joue à quarante personnes, dans un silence que personne n’ose rompre. C’est le plus court et le plus marquant.',
  'orient-express':
    'Un wagon privé, du laiton, du velours, et la cérémonie qui se tient pendant que l’Europe défile derrière la vitre. Quatorze heures de nuit, vingt-six cabines et un dîner qui suit le rythme du train.',
  'phare-atlantique':
    'Douze personnes, une île, un phare et une marée qui décide de tout : l’accès se fait à marée basse, le bateau repart le lendemain matin, sans exception. Peu de mariages rendent aussi vite humble.',
  'last-minute':
    'Quarante-huit heures pour tout monter : mairie, six amis, dîner commandé le matin même, ville qui s’allume. Le mariage improvisé n’est pas un mariage raté — c’est un mariage qui refuse d’attendre.',
};

/** Un article par univers, construit sur son contenu réel. */
function articleDeUnivers(styleId: string): Article {
  const style = styleById(styleId);
  const content = contentFor(style);
  const scenes = getScenesForStyle(styleId);
  const missions = style.humanMissions ?? [];

  return {
    slug: `univers-${style.id}`,
    category: 'univers',
    universeId: style.id,
    title: `${style.name} : ${style.tagline}`,
    kicker: content.hero.kicker.replace('Univers · ', ''),
    cover: style.image,
    readingMinutes: 4,
    intro: OUVERTURES[style.id] ?? content.hero.subtitle,
    sections: [
      {
        heading: 'L’idée en trois lignes',
        body: [content.hero.title, content.hero.subtitle, style.manifesto ?? style.synopsis ?? ''],
        bullets: content.hero.facts.map((f) => `${f.label} : ${f.value}`),
      },
      {
        heading: 'La journée, heure par heure',
        body: scenes.map((scene) => `${scene.time} — ${scene.title}. ${scene.narrativeScript}`),
      },
      {
        heading: 'Les métiers qui la font tourner',
        body: missions.map((m) => `${m.role} — ${m.mission}. Compétence attendue : ${m.essentialSkill.toLowerCase()}.`),
      },
      {
        heading: 'Ce que le mini-site contient',
        body: [
          `Une cagnotte : ${content.cagnotte.purpose}. Objectif ${euros(content.cagnotte.goal)}, déjà ${euros(content.cagnotte.raised)} réunis par ${content.cagnotte.contributors} personnes.`,
          `Les réponses : ${content.rsvp.confirmed} confirmés sur ${content.couple.guests} invités, ${content.rsvp.pending} personnes encore sans réponse. « ${content.rsvp.invitation} »`,
          `Les régimes alimentaires remontent au traiteur : ${content.allergens.map((a) => `${a.label.toLowerCase()} ${a.value.toLowerCase()}`).join(', ')}.`,
        ],
      },
      {
        heading: 'Venir, dormir, s’habiller',
        body: [`Tenue : ${content.couple.dressCode}.`],
        bullets: content.infos.map((i) => `${i.label} : ${i.value}`),
      },
    ],
  };
}

export const UNIVERSE_ARTICLES: Article[] = WEDDING_STYLES.map((style) => articleDeUnivers(style.id));

export const GUIDE_ARTICLES: Article[] = [
  {
    slug: 'guide-choisir-son-univers',
    category: 'guide',
    title: 'Choisir son univers sans se tromper',
    kicker: 'Guide · Direction',
    cover: '/images/table-noir.jpg',
    readingMinutes: 5,
    intro:
      'La plupart des couples ne cherchent pas « un thème », ils cherchent une ambiance qu’ils sauraient reconnaître en photo. Le problème, c’est que l’ambiance se choisit en dernier alors qu’elle décide de tout : le lieu, le traiteur, les fleurs, la musique.',
    sections: [
      {
        heading: 'Commencez par ce qui ne se négocie pas',
        body: [
          'Il y a toujours trois ou quatre éléments sur lesquels l’un de vous ne cédera pas : la messe, la mer, la piste de danse, la famille au grand complet. Écrivez-les avant de regarder le moindre univers. Un univers qui contredit ces points-là ne sera jamais le bon, même s’il est magnifique.',
          'Le reste — la palette, les fleurs, la typographie — se décide très vite une fois que le cadre est posé.',
        ],
      },
      {
        heading: 'Regardez les photos, pas les noms',
        body: [
          'Un univers nommé « Élégant » n’a rien à voir avec un univers nommé « Brutal » : ce sont deux façons de photographier la lumière. Parcourez les visuels et retenez celui où vous vous projetez sans effort.',
          'Astuce utile : demandez-vous ce que donnerait votre lieu actuel dans cet univers. Si la réponse demande de tout changer, ce n’est pas votre univers.',
        ],
      },
      {
        heading: 'Comptez les métiers, c’est le vrai budget',
        body: [
          'Chaque univers mobilise des métiers différents : un mariage en noir et blanc vit de son photographe, un mariage de club vit de son sound system, un mariage champêtre vit de son traiteur et de son fleuriste.',
          'Le menu Métiers du site indique, pour chaque domaine, les univers qui les emploient. C’est la façon la plus rapide de voir où partira l’argent.',
        ],
      },
    ],
  },
  {
    slug: 'guide-retroplanning',
    category: 'guide',
    title: 'Le rétroplanning : de douze mois à J-0',
    kicker: 'Guide · Organisation',
    cover: '/images/chateau-tilleuls.jpg',
    readingMinutes: 6,
    intro:
      'Un mariage tient sur une dizaine de décisions prises au bon moment. Prises trop tard, elles coûtent plus cher et se choisissent mal ; prises trop tôt, elles se regrettent. Voici l’ordre qui fonctionne, du plus structurant au plus fin.',
    sections: [
      {
        heading: 'Douze mois avant : le lieu et la date',
        body: [
          'Le lieu décide de la date possible, de la jauge, du traiteur autorisé et du plan B en cas de pluie. C’est la première réservation, et souvent celle qui bloque tout le reste.',
          'Réservez ensuite les deux ou trois prestataires dont les bonnes dates partent le plus vite : photographe, traiteur, musique.',
        ],
      },
      {
        heading: 'Six mois avant : le contenu du jour',
        body: [
          'Le déroulé heure par heure, le menu, les tenues, les faire-part, le site et les premières invitations. C’est le moment où l’on écrit ce que les invités liront.',
          'Ouvrez aussi la cagnotte à ce moment-là : les invités qui réservent leur train n’aiment pas qu’on leur demande de participer trois semaines avant.',
        ],
      },
      {
        heading: 'Trois mois avant : les réponses',
        body: [
          'Les invitations partent, les réponses rentrent, les régimes alimentaires remontent au traiteur. Le plan de table commence à se dessiner, avec ses contraintes de famille que personne n’ose écrire.',
        ],
      },
      {
        heading: 'Le dernier mois : on arrête de décider',
        body: [
          'Confirmation des prestataires, timing de la journée envoyé à tout le monde, sacs prêts, discours écrits. La règle du dernier mois est simple : plus aucune nouvelle idée, seulement des vérifications.',
        ],
      },
    ],
  },
  {
    slug: 'guide-cagnotte',
    category: 'guide',
    title: 'La cagnotte : comment la rendre acceptable',
    kicker: 'Guide · Argent',
    cover: '/images/alliances.jpg',
    readingMinutes: 4,
    intro:
      'Demander de l’argent reste délicat dans une culture où l’on offre un objet. La cagnotte fonctionne quand elle raconte précisément à quoi elle sert : un objet qu’on n’aurait pas pu s’offrir, une expérience, un projet collectif.',
    sections: [
      {
        heading: 'Un objectif précis bat un montant vague',
        body: [
          '« Participer à notre voyage de noces » intéresse peu. « Le tirage argentique de chaque photo de famille, 40 × 60, pour chaque foyer » se comprend immédiatement, et se partage.',
          'Sur les univers du site, chaque cagnotte a son objet, son objectif et sa part déjà réunie : c’est exactement ce niveau de précision qu’il faut viser.',
        ],
      },
      {
        heading: 'Afficher la progression',
        body: [
          'Une barre de progression change tout : les gens voient que ça avance, et les derniers arrivés complètent. Affichez aussi le nombre de participants et, si le cœur vous en dit, le plus gros don.',
        ],
      },
      {
        heading: 'Dire merci, et seulement merci',
        body: [
          'Un mot personnalisé envoyé après coup vaut mieux qu’un classement des dons. Ce qui n’est jamais une bonne idée : afficher qui n’a pas donné.',
        ],
      },
    ],
  },
  {
    slug: 'guide-rsvp-plan-de-table',
    category: 'guide',
    title: 'RSVP et plan de table : la partie qu’on sous-estime',
    kicker: 'Guide · Invités',
    cover: '/images/terrasse.jpg',
    readingMinutes: 5,
    intro:
      'Entre les réponses tardives, les enfants, les conjoints qu’on découvre et les cousins fâchés, le plan de table décide de l’ambiance du dîner plus sûrement que le menu.',
    sections: [
      {
        heading: 'Une date limite, une seule',
        body: [
          'Annoncez une date de réponse et tenez-la auprès du traiteur, pas auprès des invités. Vingt pour cent des réponses arriveront en retard : prévoyez deux relances automatiques avant la fermeture.',
        ],
      },
      {
        heading: 'Les huit par table',
        body: [
          'Huit convives, c’est le format où l’on se parle tous. Au-delà de dix, la table se coupe en deux conversations. En dessous de six, les silences pèsent.',
        ],
      },
      {
        heading: 'Nommer les ouvertures, pas les clôtures',
        body: [
          'Plutôt que d’entourer les mariés de leurs témoins, répartissez les personnes extraverties une par table. Le dîner tient debout grâce à elles.',
        ],
      },
      {
        heading: 'Prévoir le placement des régimes',
        body: [
          'Un convive végan isolé au milieu de dix personnes qui partagent un plateau : c’est la première source de malaise d’un repas. Regroupez les régimes proches ou signalez les plats par un jeton discret.',
        ],
      },
    ],
  },
  {
    slug: 'guide-allergenes-regimes',
    category: 'guide',
    title: 'Allergènes et régimes : la question qu’on traite trop tard',
    kicker: 'Guide · Repas',
    cover: '/images/chateau-terrasse-champagne.jpg',
    readingMinutes: 4,
    intro:
      'Un mariage n’est pas un restaurant : le traiteur produit cent couverts en une heure, dans une cuisine de campagne. Plus tôt il connaît les contraintes, mieux il les traite.',
    sections: [
      {
        heading: 'Collecter à la source',
        body: [
          'La question doit être posée au moment du RSVP, pas une semaine avant. Un champ « allergies, régimes, intolérances » sur le formulaire, et l’information part directement à la cuisine.',
        ],
      },
      {
        heading: 'Les cinq familles à couvrir',
        body: [
          'Sans gluten, sans lactose, sans porc, végétarien et allergie aux fruits à coque couvrent la quasi-totalité des situations réelles. Ajoutez les allergies déclarées (crustacés, fruits de mer, sésame) et le tour est joué.',
        ],
      },
      {
        heading: 'Ce que le prestataire doit connaître',
        body: [
          'Le nombre exact par famille, le détail nominatif pour éviter les erreurs de service, et un signal discret sur la table — un jeton, une petite carte — pour que le serveur n’ait pas à demander à voix haute.',
        ],
      },
    ],
  },
  {
    slug: 'guide-budget',
    category: 'guide',
    title: 'Le budget : où part réellement l’argent',
    kicker: 'Guide · Budget',
    cover: '/images/brocante.jpg',
    readingMinutes: 6,
    intro:
      'Le budget d’un mariage se lit dans l’ordre inverse de celui qu’on imagine : ce qui coûte le plus, c’est ce qui se paie au couvert et à l’heure — le lieu, le repas, la boisson et la musique.',
    sections: [
      {
        heading: 'Les quatre postes qui décident de tout',
        body: [
          'Lieu : de zéro (chez soi, chez des amis) à plusieurs dizaines de milliers d’euros, selon qu’il faut louer, monter une tente, éclairer, chauffer ou privatiser.',
          'Repas et boissons : le poste le plus élastique, multiplié par le nombre de convives. Passer de 120 à 90 invités allège plus le budget que tous les arbitrages décoratifs réunis.',
          'Photo et vidéo : plus on prend un professionnel tôt, moins c’est cher. C’est aussi ce qui reste après la journée.',
          'Musique : un groupe coûte plus cher qu’un DJ, et un DJ tient plus longtemps. Les deux combinés, c’est le schéma le plus fréquent.',
        ],
      },
      {
        heading: 'Les postes qu’on oublie',
        body: [
          'La navette, l’hébergement des prestataires, le repas du lendemain, les frais de déplacement des invités, la garde d’enfants, les protections contre la pluie (tente, chauffage), et les pourboires.',
        ],
      },
      {
        heading: 'Garder dix pour cent',
        body: [
          'Une enveloppe de dix pour cent mise de côté absorbe presque toujours les imprévus. Les mariages qui dérapent ne le font pas de trente pour cent : ils dérapent de dix, en quinze petites décisions.',
        ],
      },
    ],
  },
  {
    slug: 'guide-prestataires-qui-fait-quoi',
    category: 'guide',
    title: 'Les prestataires : qui fait quoi, et quand',
    kicker: 'Guide · Équipe',
    cover: '/images/noir-blanc-entree.jpg',
    readingMinutes: 5,
    intro:
      'On confond souvent le rôle du régisseur, du coordinateur et du maître de cérémonie. Ce sont trois métiers différents, et c’est la première chose à clarifier pour ne pas avoir de trou dans la journée.',
    sections: [
      {
        heading: 'Le coordinateur du jour J',
        body: [
          'Il prend le relais trois semaines avant : il confirme les horaires, écrit le déroulé, gère les arrivées des prestataires et absorbe les imprévus. Les mariés et leurs familles ne doivent plus rien coordonner après la veille.',
        ],
      },
      {
        heading: 'Le maître de cérémonie',
        body: [
          'C’est la voix de la journée : ouverture de la cérémonie, annonces, transitions entre les plats, lancement de la piste. Il travaille sur un texte, avec les mariés, et il n’improvise jamais les moments importants.',
        ],
      },
      {
        heading: 'Le régisseur technique',
        body: [
          'Lumière, son, alimentation électrique, sécurité, accès des véhicules : c’est lui qui rend possible tout le reste. Sur un lieu brut — bunker, bergerie, supermarché, phare — il est indispensable dès la conception.',
        ],
      },
      {
        heading: 'Les métiers qu’on n’annonce jamais',
        body: [
          'Le pâtissier, l’imprimeur du faire-part, le conducteur de navette, l’agent de sécurité, le guide de montagne. Le menu Métiers du site les recense par domaine, univers par univers.',
        ],
      },
    ],
  },
];

export const INSOLITE_ARTICLES: Article[] = [
  {
    slug: 'insolite-louer-plutot-qu-acheter',
    category: 'insolite',
    title: 'Tout louer, et ne rien stocker dans un garage',
    kicker: 'Insolite · Objets',
    cover: '/images/brocante.jpg',
    readingMinutes: 5,
    intro:
      'Un mariage mobilise, en moyenne, quatre-vingts objets qui ne resserviront jamais. Le calcul est vite fait : entre l’achat, le transport, le nettoyage et le stockage, la location coûte moins cher — et surtout, elle ne laisse rien derrière.',
    sections: [
      {
        heading: 'Ce qui se loue très bien',
        body: [
          'Le mobilier : tables, chaises, mange-debout, banquettes. Ce sont les objets les plus lourds, les plus encombrants, et ceux qui n’ont aucune valeur sentimentale après coup.',
          'La vaisselle, la verrerie et les couverts : ils arrivent lavés, repartent sales, et personne ne veut de deux cents assiettes dans un appartement.',
          'La lumière : guirlandes, projecteurs, boules à facettes. On les utilise une nuit, on n’a nulle part où les ranger.',
        ],
      },
      {
        heading: 'Ce qui s’achète mieux',
        body: [
          'La papeterie, les alliances, les tenues quand elles sont ajustées à votre morphologie. Ce sont les seules pièces que vous garderez, par choix.',
          'Et les objets qui vous ressemblent : un juke-box si vous écoutez des vinyles, une enseigne néon à vos prénoms si elle finira au-dessus du canapé.',
        ],
      },
      {
        heading: 'Ce qui devrait circuler gratuitement',
        body: [
          'Les semelles de confort, les chemises en lin pour les mariages d’été, les marque-places gravés, les boutonnières séchées. Ces pièces ne s’usent presque pas : les prêter coûte moins cher que les jeter.',
        ],
      },
    ],
  },
  {
    slug: 'insolite-mariage-par-38-degres',
    category: 'insolite',
    title: 'Se marier quand il fait 38 °C',
    kicker: 'Insolite · Conditions',
    cover: '/images/desert-motel.jpg',
    readingMinutes: 4,
    intro:
      'Au-dessus de 34 °C, un mariage extérieur devient une épreuve physique : le glaçage coule, les invités s’épuisent, le photographe cherche l’ombre. Ce n’est pas une question de courage, c’est une question d’organisation.',
    sections: [
      {
        heading: 'Décaler, plutôt que résister',
        body: [
          'Cérémonie à 19h30 plutôt qu’à 15h, dîner à 21h30, piste de danse après minuit : en décalant tout d’un cran, on garde les mêmes moments et on perd la fournaise.',
        ],
      },
      {
        heading: 'L’ombre et l’eau avant la décoration',
        body: [
          'Le budget parasol passe avant le budget fleurs. Deux parasols déportés et une fontaine d’eau fraîche sauvent un cocktail ; un centre de table, non.',
        ],
      },
      {
        heading: 'Les détails qui lâchent',
        body: [
          'Le beurre, le glaçage, le chocolat, le vin blanc, les fleurs fraîches. Prévoyez le dessert en coulis, la pièce montée à l’intérieur, et les bouquets en fleurs séchées.',
        ],
      },
    ],
  },
  {
    slug: 'insolite-objets-qui-font-une-soiree',
    category: 'insolite',
    title: 'Les objets qui font une soirée',
    kicker: 'Insolite · Ambiance',
    cover: '/images/danse.jpg',
    readingMinutes: 4,
    intro:
      'Une soirée de mariage tient rarement à la playlist. Elle tient à trois ou quatre objets qui donnent aux invités quelque chose à faire — et c’est souvent là que les photos les plus drôles se prennent.',
    sections: [
      {
        heading: 'Le juke-box',
        body: [
          'Cent quarante vinyles, une mécanique de 1963 et des boutons à presser soi-même : les invités deviennent DJ et se disputent gentiment les morceaux. Bien plus efficace qu’une playlist collaborative sur téléphone.',
        ],
      },
      {
        heading: 'La cabine argentique',
        body: [
          'Pas d’écran, pas de filtre, un tirage humide qui sort en trois minutes. Les invités repartent avec une photo, et le mur se remplit jusqu’à minuit.',
        ],
      },
      {
        heading: 'Le franche-bise et la fontaine à champagne',
        body: [
          'Un objet peut transformer un bar en attraction : le franche-bise sur son billot de 90 kg, ou une fontaine à sept étages. On a longtemps trouvé ça kitsch — puis on a regardé les photos.',
        ],
      },
      {
        heading: 'La machine à fumée',
        body: [
          'Elle ne sert qu’à un moment : quand la piste est pleine et que les faisceaux se découpent. C’est ce moment-là qui finit en couverture d’album.',
        ],
      },
    ],
  },
];

export const ALL_ARTICLES: Article[] = [...UNIVERSE_ARTICLES, ...GUIDE_ARTICLES, ...INSOLITE_ARTICLES];

export function articleBySlug(slug: string): Article | undefined {
  return ALL_ARTICLES.find((a) => a.slug === slug);
}

/** Les articles à lire ensuite : même famille, univers voisins d'abord. */
export function relatedArticles(article: Article, limit = 3): Article[] {
  if (article.category === 'univers' && article.universeId) {
    const style = styleById(article.universeId);
    const voisins = style.complementaryStyleIds
      .map((id) => UNIVERSE_ARTICLES.find((a) => a.universeId === id))
      .filter((a): a is Article => Boolean(a));
    return voisins.slice(0, limit);
  }
  const famille = article.category === 'insolite' ? INSOLITE_ARTICLES : GUIDE_ARTICLES;
  return famille.filter((a) => a.slug !== article.slug).slice(0, limit);
}
