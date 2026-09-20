import { contentFor, type UniverseContent } from './universeContent';
import { DOMAINES, domaineDe } from './weddingVendors';
import type { HumanMissionRequirement, WeddingStyle } from './weddingStyles';
import { getScenesForStyle, type ThemeTimelineScene } from './themeTimelineScenarios';

/**
 * LE VOCABULAIRE DES MÉTIERS
 *
 * Le hero ne change pas : c'est toujours le visuel de l'univers. Ce qui change
 * d'un métier à l'autre, c'est la langue des modules — un chef lit « Ce qui
 * passe en cuisine », un photographe « La lumière et les lieux », un
 * intermittent « Vos cachets, déclarés ».
 *
 * Tous lisent pourtant la même source : le programme, les régimes, les
 * informations et les chiffres que les mariés ont publiés sur leur site. C'est
 * cette source commune qui relie chaque écran au mariage — et les métiers entre
 * eux.
 */

export interface MetierLigne {
  label: string;
  valeur: string;
}

export interface MetierModule {
  id: string;
  /** Le mot du métier, tel qu'il s'affiche dans la nav du téléphone. */
  nav: string;
  eyebrow: string;
  titre: string;
  lignes: MetierLigne[];
  note?: string;
  /** Le module des artistes et des techniciens du spectacle vivant. */
  cachets?: boolean;
}

export interface MetierData {
  role: string;
  styleName: string;
  content: UniverseContent;
  scenes: ThemeTimelineScene[];
  mission?: HumanMissionRequirement;
}

/* ——————————————— ce que tous les métiers lisent ——————————————— */

export const jourDuMariage = (d: MetierData): MetierLigne[] =>
  d.scenes.slice(0, 3).map((s) => ({ label: s.time, valeur: s.title }));

export const regimesDeclares = (d: MetierData): MetierLigne[] =>
  d.content.allergens.map((a) => ({ label: a.label, valeur: a.value }));

export const accesSurPlace = (d: MetierData): MetierLigne[] => [
  { label: 'Arrivée', valeur: d.content.vendor.arrival },
  { label: 'Accès', valeur: d.content.vendor.access },
  { label: 'Contact sur place', valeur: d.content.vendor.contact },
];

export const chiffresDuMariage = (d: MetierData): MetierLigne[] => [
  { label: 'Couverts', valeur: `${d.content.couple.guests} invités` },
  {
    label: 'Réponses',
    valeur: `${d.content.rsvp.confirmed} confirmés · ${d.content.rsvp.pending} en attente`,
  },
  { label: 'Lieu', valeur: `${d.content.couple.venue} · ${d.content.couple.city}` },
  { label: 'Date', valeur: `${d.content.couple.date} · ${d.content.couple.countdown}` },
];

export const decorDuJour = (d: MetierData): MetierLigne[] => [
  { label: 'Décor', valeur: d.scenes[0]?.ambianceDetail ?? d.content.couple.season },
  { label: 'Tenue', valeur: d.content.couple.dressCode },
  { label: 'Tables', valeur: `${d.content.couple.guests} couverts` },
];

/** La fiche mission : la même pour tous les métiers, écrite par l'univers. */
export const moduleMission = (d: MetierData): MetierModule => ({
  id: 'mission',
  nav: 'Mission',
  eyebrow: `Fiche mission · ${d.styleName}`,
  titre: d.role,
  lignes: [
    {
      label: 'Ce qu’on attend de vous',
      valeur: d.mission?.mission ?? 'Le brief précis arrive avec la confirmation.',
    },
    {
      label: 'Compétence attendue',
      valeur: d.mission?.essentialSkill ?? 'À préciser avec les mariés.',
    },
  ],
  note: 'La même fiche que celle de votre carte : elle suit le programme du site.',
});

/**
 * La mission que l'univers réserve à ce rôle — celle de sa carte, donc. Si
 * l'univers ne prévoit pas ce métier, on prend sa première fiche : un mariage
 * qui n'a pas écrit de rôle peut toujours en accueillir un.
 */
export function missionPourStyle(style: WeddingStyle, role: string): HumanMissionRequirement | undefined {
  return style.humanMissions.find((m) => m.role === role) ?? style.humanMissions[0];
}

/** Les données d'un métier, montées depuis l'univers et son contenu. */
export function donneesMetier(style: WeddingStyle, role: string): MetierData {
  return {
    role,
    styleName: style.name,
    content: contentFor(style),
    scenes: getScenesForStyle(style.id),
    mission: missionPourStyle(style, role),
  };
}

/* ——————————————— la langue de chaque métier ——————————————— */

const PAR_DOMAINE: Record<string, (d: MetierData) => MetierModule[]> = {
  photographe: (d) => [
    {
      id: 'reperages',
      nav: 'Repérages',
      eyebrow: `Repérages · ${d.styleName}`,
      titre: 'La lumière et les lieux',
      lignes: [
        { label: 'Décor', valeur: d.scenes[0]?.ambianceDetail ?? d.content.couple.season },
        { label: 'Lieu', valeur: `${d.content.couple.venue} · ${d.content.couple.city}` },
        { label: 'Saison', valeur: d.content.couple.season },
      ],
      note: 'Repéré sur le programme que les mariés ont publié.',
    },
    {
      id: 'deroule',
      nav: 'Déroulé',
      eyebrow: 'Le jour J, minute par minute',
      titre: 'Les moments à couvrir',
      lignes: jourDuMariage(d),
      note: 'Chaque heure ouvre sa scène, comme sur leur site.',
    },
    {
      id: 'livraison',
      nav: 'Livraison',
      eyebrow: 'Ce qui repartira de la journée',
      titre: 'Album, tirages, film',
      lignes: [
        { label: 'Sélection', valeur: '300 images retouchées' },
        { label: 'Album', valeur: 'Livre 30×30, papier mat' },
        { label: 'Délai', valeur: 'Six semaines après le jour J' },
      ],
      note: `Le ton visuel vient de l’univers ${d.styleName}.`,
    },
  ],

  chef: (d) => [
    {
      id: 'menus',
      nav: 'Menus',
      eyebrow: `Menu · ${d.content.menu.service}`,
      titre: 'Ce qui passe en cuisine',
      lignes: d.content.menu.items.map((plat, i) => ({ label: `Service ${i + 1}`, valeur: plat })),
      note: 'Le menu du site des mariés, tel qu’ils l’ont publié.',
    },
    {
      id: 'regimes',
      nav: 'Régimes',
      eyebrow: 'Régimes à couvrir',
      titre: `${d.content.allergens.length} régimes déclarés`,
      lignes: regimesDeclares(d),
      note: 'Détail nominatif disponible depuis la fiche de table.',
    },
    {
      id: 'creneaux',
      nav: 'Créneaux',
      eyebrow: 'Le jour J',
      titre: `${d.content.couple.guests} couverts`,
      lignes: [...jourDuMariage(d), { label: 'Contact sur place', valeur: d.content.vendor.contact }],
      note: `Arrivée ${d.content.vendor.arrival.toLowerCase()}. ${d.content.vendor.access}.`,
    },
  ],

  patissier: (d) => [
    {
      id: 'pieces',
      nav: 'La pièce',
      eyebrow: `Dessert · ${d.styleName}`,
      titre: d.content.menu.items[d.content.menu.items.length - 1] ?? 'La pièce montée',
      lignes: [
        { label: 'Service', valeur: d.content.menu.service },
        { label: 'Couverts', valeur: `${d.content.couple.guests} invités` },
        { label: 'Tenue', valeur: d.content.couple.dressCode },
      ],
      note: 'Elle arrive au moment du dessert, quand la salle se lève.',
    },
    {
      id: 'regimes',
      nav: 'Régimes',
      eyebrow: 'Sans gluten, sans lactose, sans fruits à coque',
      titre: `${d.content.allergens.length} régimes déclarés`,
      lignes: regimesDeclares(d),
      note: 'À croiser avec la pièce avant de la lancer.',
    },
    {
      id: 'creneaux',
      nav: 'Service',
      eyebrow: 'Le dessert dans le déroulé',
      titre: 'Le bon moment',
      lignes: jourDuMariage(d),
    },
  ],

  fleuriste: (d) => [
    {
      id: 'compositions',
      nav: 'Compositions',
      eyebrow: `Feuillages · ${d.styleName}`,
      titre: 'Ce qui pousse dans cet univers',
      lignes: decorDuJour(d),
      note: 'Le décor suit l’univers choisi, jamais un catalogue.',
    },
    {
      id: 'installation',
      nav: 'Installation',
      eyebrow: 'Le jour J',
      titre: 'Arrivée, montage, accès',
      lignes: accesSurPlace(d),
      note: 'La veille au soir vaut mieux que le matin même.',
    },
    {
      id: 'lieux',
      nav: 'Lieux',
      eyebrow: 'Les lieux du site',
      titre: 'Là où l’on installe',
      lignes: d.content.infos.map((i) => ({ label: i.label, valeur: i.value })),
    },
  ],

  officiant: (d) => [
    {
      id: 'ceremonie',
      nav: 'Cérémonie',
      eyebrow: `Cérémonie · ${d.styleName}`,
      titre: 'Les vœux',
      lignes: decorDuJour(d),
      note: 'Le texte se relit avec les mariés avant le jour J.',
    },
    {
      id: 'deroule',
      nav: 'Déroulé',
      eyebrow: 'Le jour J, minute par minute',
      titre: 'Le fil de la cérémonie',
      lignes: jourDuMariage(d),
      note: 'Le même programme que celui affiché aux invités.',
    },
    {
      id: 'coordination',
      nav: 'Coordination',
      eyebrow: 'Qui fait quoi',
      titre: 'Le jour J, côté coulisses',
      lignes: accesSurPlace(d),
      note: 'Les métiers du mariage se répondent depuis leurs cartes.',
    },
  ],

  mixologue: (d) => [
    {
      id: 'bar',
      nav: 'Bar',
      eyebrow: `Bar · ${d.styleName}`,
      titre: 'La carte des verres',
      lignes: [
        { label: 'Service', valeur: d.content.menu.service },
        { label: 'Ambiance', valeur: d.scenes[1]?.ambianceDetail ?? d.content.couple.season },
        { label: 'Couverts', valeur: `${d.content.couple.guests} invités` },
      ],
      note: 'Le bar ouvre au cocktail et ne se referme plus.',
    },
    {
      id: 'regimes',
      nav: 'Régimes',
      eyebrow: 'Sans alcool, sans sucre, sans surprise',
      titre: 'Ce qu’il faut prévoir',
      lignes: regimesDeclares(d),
      note: 'Les régimes déclarés sur le site arrivent ici avant le jour J.',
    },
    {
      id: 'creneaux',
      nav: 'Créneaux',
      eyebrow: 'Le bar dans le déroulé',
      titre: 'Les temps forts',
      lignes: jourDuMariage(d),
    },
  ],

  musicien: (d) => [
    {
      id: 'plateau',
      nav: 'Plateau',
      eyebrow: 'Votre plateau',
      titre: 'Montage, balance, repas',
      lignes: [...accesSurPlace(d), { label: 'Repas', valeur: 'Prévu avec le traiteur' }],
      note: 'Trente minutes de balance suffisent : la salle sera prête.',
    },
    {
      id: 'set',
      nav: 'Set',
      eyebrow: 'Le déroulé',
      titre: 'Ce que vous portez',
      lignes: jourDuMariage(d),
      note: 'La playlist collaborative se remplit depuis le site des mariés.',
    },
    {
      id: 'regimes',
      nav: 'Repas',
      eyebrow: 'Le repas de l’équipe',
      titre: `${d.content.allergens.length} régimes à croiser`,
      lignes: regimesDeclares(d),
      note: 'Le repas suit les mêmes régimes que celui des invités.',
    },
  ],

  dj: (d) => [
    {
      id: 'regie',
      nav: 'Régie',
      eyebrow: 'Sono & lumière',
      titre: 'Ce que vous installez',
      lignes: [...accesSurPlace(d), { label: 'Sono', valeur: 'Fournie par vous — fiche technique à jour' }],
      note: 'Le courant et les accès se vérifient avant le montage.',
    },
    {
      id: 'set',
      nav: 'Set',
      eyebrow: 'Le déroulé',
      titre: 'Les temps forts',
      lignes: jourDuMariage(d),
      note: 'La playlist collaborative se remplit depuis le site des mariés.',
    },
    {
      id: 'regimes',
      nav: 'Repas',
      eyebrow: 'Le repas de l’équipe',
      titre: 'Ce qu’il faut prévoir',
      lignes: regimesDeclares(d),
    },
  ],

  createur: (d) => [
    {
      id: 'plan',
      nav: 'Plan',
      eyebrow: 'Plan de salle',
      titre: `${d.content.couple.guests} couverts`,
      lignes: chiffresDuMariage(d),
      note: 'Le plan se valide avec le traiteur et le maître de cérémonie.',
    },
    {
      id: 'matieres',
      nav: 'Matières',
      eyebrow: `Direction artistique · ${d.styleName}`,
      titre: 'Les matières du jour',
      lignes: [
        { label: 'Ambiance', valeur: d.scenes[0]?.ambianceDetail ?? d.content.couple.season },
        { label: 'Tenue', valeur: d.content.couple.dressCode },
        { label: 'Décor', valeur: d.scenes[0]?.title ?? d.styleName },
      ],
      note: 'Ce qui se voit d’abord, et ce qui se retient.',
    },
    {
      id: 'installation',
      nav: 'Installation',
      eyebrow: 'Le jour J',
      titre: 'Arrivée, montage, accès',
      lignes: accesSurPlace(d),
    },
  ],

  artisan: (d) => [
    {
      id: 'pieces',
      nav: 'Pièces',
      eyebrow: `Pièces à livrer · ${d.styleName}`,
      titre: 'Ce qui part de l’atelier',
      lignes: decorDuJour(d),
      note: 'Chaque pièce est nominative : rien n’est interchangeable.',
    },
    {
      id: 'installation',
      nav: 'Installation',
      eyebrow: 'Le jour J',
      titre: 'Arrivée, montage, accès',
      lignes: accesSurPlace(d),
    },
    {
      id: 'lieux',
      nav: 'Lieux',
      eyebrow: 'Les lieux du site',
      titre: 'Là où l’on installe',
      lignes: d.content.infos.map((i) => ({ label: i.label, valeur: i.value })),
    },
  ],

  regisseur: (d) => [
    {
      id: 'technique',
      nav: 'Technique',
      eyebrow: 'Sono, lumière, courant',
      titre: 'Ce que vous montez',
      lignes: [...accesSurPlace(d), { label: 'Besoins', valeur: 'Fiche technique de l’univers, à jour' }],
      note: 'La même fiche technique que celle du site, côté coulisses.',
    },
    {
      id: 'montage',
      nav: 'Montage',
      eyebrow: 'Les horaires',
      titre: 'Montage & démontage',
      lignes: [
        { label: 'Montage', valeur: 'La veille, à partir de 14h00' },
        { label: 'Jour J', valeur: `${d.scenes[0]?.time ?? '15h00'} — premier top` },
        { label: 'Démontage', valeur: 'Après 02h00, à froid' },
      ],
      note: 'Les accès véhicules se vérifient avant le chargement.',
    },
    {
      id: 'regimes',
      nav: 'Repas',
      eyebrow: 'Le repas de l’équipe',
      titre: 'Ce qu’il faut prévoir',
      lignes: regimesDeclares(d),
    },
  ],

  polyvalent: (d) => [
    {
      id: 'acces',
      nav: 'Accès',
      eyebrow: 'Le jour J',
      titre: 'Arrivée, accès, contact',
      lignes: accesSurPlace(d),
    },
    {
      id: 'regimes',
      nav: 'Régimes',
      eyebrow: 'Régimes à couvrir',
      titre: `${d.content.allergens.length} régimes déclarés`,
      lignes: regimesDeclares(d),
    },
    {
      id: 'creneaux',
      nav: 'Créneaux',
      eyebrow: 'Le mariage en chiffres',
      titre: `${d.content.couple.guests} couverts`,
      lignes: jourDuMariage(d),
    },
  ],
};

/* ——————————————— les intermittents du spectacle ——————————————— */

const DOMAINES_ARTISTES = ['musicien', 'dj', 'regisseur'];

const MOTS_ARTISTES = [
  'music', 'chanteu', 'chanson', 'violon', 'piano', 'guitar', 'saxo', 'trompett',
  'accordéon', 'accordeon', 'percussion', 'orchestre', 'ensemble', 'soliste',
  'danse', 'ballet', 'comédie', 'comedie', 'théâtre', 'theatre', 'cirque', 'clown',
  'magie', 'magicien', 'marionnett', 'conteur', 'conteuse', 'performance',
  'régie', 'regie', 'technicien', 'lumière', 'lumiere', 'sono', 'sonoris',
  'light', 'projectionn', 'acoustici',
];

/**
 * Le métier relève-t-il du spectacle vivant ? Les artistes et les techniciens
 * du spectacle ne se paient pas comme les autres : ils cumulent des cachets,
 * et ces cachets comptent pour leurs 507 heures.
 */
export function estIntermittent(role: string): boolean {
  const r = role.toLowerCase();
  if (MOTS_ARTISTES.some((mot) => r.includes(mot))) return true;
  return DOMAINES_ARTISTES.includes(domaineDe(role));
}

/**
 * LE MODULE DES INTERMITTENTS
 *
 * Le couple qui engage un artiste pour un mariage est un employeur occasionnel :
 * la déclaration passe par le GUSO, et chaque cachet compte pour les heures de
 * l'intermittent. Ce module-là ne parle pas de fleurs ni de menus — il parle
 * cachets, déclaration, droits et défraiement.
 */
export function moduleCachets(d: MetierData): MetierModule {
  const technique = domaineDe(d.role) === 'regisseur';
  return {
    id: 'cachets',
    nav: 'Cachets',
    eyebrow: 'Intermittent du spectacle',
    titre: 'Vos cachets, déclarés.',
    lignes: [
      {
        label: 'Engagement',
        valeur: technique
          ? '3 cachets — montage, jour J, démontage'
          : '2 cachets — balance, soirée',
      },
      { label: 'Déclaration', valeur: 'GUSO — le couple vous emploie en toute légalité' },
      { label: 'Heures', valeur: 'Comptées pour vos 507 heures' },
      { label: 'Droits', valeur: 'SACEM / SPRE selon la salle et le répertoire' },
      { label: 'Défraiement', valeur: 'Repas et trajet pris en charge' },
    ],
    note: 'Cachets, droits et déclarations vivent dans votre espace — jamais sur le site public.',
    cachets: true,
  };
}

/** Le domaine d'un métier, avec son libellé d'affichage. */
export function domaineDuMetier(role: string): { label: string; description: string } {
  return DOMAINES[domaineDe(role)] ?? DOMAINES.polyvalent;
}

/**
 * Les modules d'un métier : sa fiche mission, la langue de son domaine, et —
 * s'il vit du spectacle — le module des cachets.
 */
export function modulesDuMetier(d: MetierData): MetierModule[] {
  const build = PAR_DOMAINE[domaineDe(d.role)] ?? PAR_DOMAINE.polyvalent;
  const modules = [moduleMission(d), ...build(d)];
  if (estIntermittent(d.role)) modules.push(moduleCachets(d));
  return modules;
}
