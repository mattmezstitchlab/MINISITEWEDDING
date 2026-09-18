/**
 * CATALOGUE DU GESTE — la taxonomie complète d'un mariage
 *
 * Deux familles de cartes, un seul geste : on cherche, la carte apparaît avec un
 * visuel, on la glisse sur la timeline du Jour J, on règle la durée.
 *
 *  - `métier`  : une personne (traiteur, saxophoniste, photographe…). Elle est
 *                notifiée et doit confirmer sa présence sur le créneau.
 *  - `moment`  : un temps du Jour J (cérémonie, discours, feu d'artifice…).
 *
 * Le visuel de chaque carte vient des univers (`WEDDING_STYLES`) : rien n'est
 * inventé, et une recherche sans résultat produit quand même une carte, avec un
 * visuel cohérent — c'est ce qui rend le geste utilisable pour tout.
 */

import { WEDDING_STYLES } from './weddingStyles';
import { UNIVERSAL_ROLES, type UniversalRoleType } from './bidirectionalAlignmentEngine';

export type CardKind = 'métier' | 'moment';

export interface GestureCard {
  id: string;
  title: string;
  kind: CardKind;
  mission: string;
  image: string;
  accent: string;
  durationMinutes: number;
  /** Renseigné quand la carte correspond à un rôle connu : la personne est notifiée. */
  role?: UniversalRoleType;
}

/** Retire les accents et la casse : « Traiteur », « traîteur » et « TRAITEUR » se valent. */
function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/** Visuel stable pour une carte : le même intitulé donne toujours le même univers. */
export function visualFor(seed: string): { image: string; accent: string } {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  const style = WEDDING_STYLES[hash % WEDDING_STYLES.length];
  return { image: style.image, accent: style.accent };
}

interface CatalogEntry {
  title: string;
  kind: CardKind;
  mission: string;
  durationMinutes: number;
  keywords: string[];
  image?: string;
  accent?: string;
  role?: UniversalRoleType;
}

/** Les métiers : qui fait quoi, et combien de temps ça occupe le Jour J. */
const METIERS: CatalogEntry[] = [
  { title: 'Traiteur & Salle', kind: 'métier', mission: 'Service, envoi des plats, régimes', durationMinutes: 180, keywords: ['traiteur', 'repas', 'cuisine', 'service', 'allergene', 'regime', 'buffet'], role: 'traiteur', image: '/images/table-noir.jpg' },
  { title: 'Saxophoniste Live', kind: 'métier', mission: 'Set au coucher du soleil', durationMinutes: 90, keywords: ['saxo', 'saxophone', 'live', 'musique', 'golden hour'], role: 'dj_sax', image: '/images/noir-blanc.jpg' },
  { title: 'DJ & Régie son', kind: 'métier', mission: 'Conducteur musical, micro HF, bal', durationMinutes: 240, keywords: ['dj', 'sono', 'son', 'musique', 'bal', 'playlist', 'regie', 'bpm', 'micro'], role: 'dj_sax', image: '/images/club-amour.jpg' },
  { title: 'Photographe', kind: 'métier', mission: 'Reportage, photos de groupe, golden hour', durationMinutes: 120, keywords: ['photo', 'photographe', 'shooting', 'cliche', 'reportage'], role: 'photo', image: '/images/noir-blanc-entree.jpg' },
  { title: 'Vidéaste', kind: 'métier', mission: 'Film du jour, teaser pour les proches', durationMinutes: 120, keywords: ['video', 'videaste', 'film', 'teaser', 'drone'], role: 'photo', image: '/images/cinema.jpg' },
  { title: 'Célébrant / Officiant', kind: 'métier', mission: 'Rituel, lectures, échange des alliances', durationMinutes: 60, keywords: ['officiant', 'celebrant', 'maire', 'pretre', 'pasteur', 'rituel', 'voeux', 'ceremonie'], role: 'officiant', image: '/images/bouquet.jpg' },
  { title: 'Témoins', kind: 'métier', mission: 'Discours, surprise, coordination', durationMinutes: 30, keywords: ['temoin', 'discours', 'surprise', 'allocution'], role: 'temoin', image: '/images/danse.jpg' },
  { title: 'Fleuriste', kind: 'métier', mission: 'Arche, boutonnières, centres de table', durationMinutes: 90, keywords: ['fleur', 'fleuriste', 'bouquet', 'arche', 'composition', 'decoration florale'], image: '/images/bouquet.jpg' },
  { title: 'Pâtissier · Pièce montée', kind: 'métier', mission: 'Gâteau, découpe, service', durationMinutes: 45, keywords: ['patissier', 'gateau', 'piece montee', 'dessert', 'cake', 'patisserie'], image: '/images/champagne.jpg' },
  { title: 'Coiffeur & Maquilleur', kind: 'métier', mission: 'Préparatifs, retouches avant la cérémonie', durationMinutes: 120, keywords: ['coiffeur', 'coiffure', 'maquilleur', 'maquillage', 'beaute', 'habillage'], image: '/images/alliances.jpg' },
  { title: 'Wedding planner', kind: 'métier', mission: 'Coordination générale, rétroplanning', durationMinutes: 240, keywords: ['planner', 'wedding planner', 'coordination', 'organisation', 'regie generale'], image: '/images/chateau.jpg' },
  { title: 'Quatuor à cordes', kind: 'métier', mission: 'Cérémonie et cocktail, acoustique', durationMinutes: 120, keywords: ['quatuor', 'cordes', 'orchestre', 'classique', 'violon', 'acoustique'], image: '/images/chateau-terrasse-champagne.jpg' },
  { title: 'Chorégraphe', kind: 'métier', mission: 'Ouverture de bal, répétitions', durationMinutes: 90, keywords: ['choregraphe', 'danse', 'ouverture de bal', 'valse'], image: '/images/danse.jpg' },
  { title: 'Voiturier & Chauffeur', kind: 'métier', mission: 'Arrivée, navettes, départ de nuit', durationMinutes: 120, keywords: ['voiturier', 'chauffeur', 'navette', 'voiture', 'transport', 'taxi', 'bus'], image: '/images/couple-paris.jpg' },
  { title: 'Photobooth', kind: 'métier', mission: 'Animations, tirages instantanés', durationMinutes: 180, keywords: ['photobooth', 'photocall', 'borne', 'tirages', 'animation'], image: '/images/brocante.jpg' },
  { title: 'Magicien / Mentaliste', kind: 'métier', mission: 'Close-up pendant le cocktail', durationMinutes: 60, keywords: ['magicien', 'mentaliste', 'magie', 'close-up'], image: '/images/cosmic.jpg' },
  { title: 'Feu d’artifice', kind: 'métier', mission: 'Pyrotechnie, autorisations, sécurité', durationMinutes: 20, keywords: ['feu d artifice', 'artifice', 'pyro', 'etincelles', 'feu'], image: '/images/foret-noire.jpg' },
  { title: 'Sono & Lumières', kind: 'métier', mission: 'Scène, éclairage, alimentation', durationMinutes: 180, keywords: ['lumiere', 'lumieres', 'eclairage', 'scene', 'technique', 'sono'], image: '/images/club-strobe-kiss.jpg' },
  { title: 'Bar à cocktails', kind: 'métier', mission: 'Bar, mocktails, service continu', durationMinutes: 180, keywords: ['bar', 'cocktail', 'cocktails', 'barman', 'mocktail', 'champagne'], image: '/images/champagne.jpg' },
  { title: 'Food truck', kind: 'métier', mission: 'Restauration de fin de nuit', durationMinutes: 120, keywords: ['food truck', 'street food', 'burger', 'fritures', 'fin de nuit'], image: '/images/supermarche.jpg' },
  { title: 'Garde d’enfants', kind: 'métier', mission: 'Espace enfants, animations, sieste', durationMinutes: 240, keywords: ['enfants', 'garde', 'nounou', 'animation enfants', 'kids'], image: '/images/garden.jpg' },
  { title: 'Sécurité & Régie', kind: 'métier', mission: 'Accueil, filtrage, plan B météo', durationMinutes: 240, keywords: ['securite', 'vigile', 'accueil', 'controle', 'plan b', 'meteo'], image: '/images/brutal.jpg' },
  { title: 'Papeterie & Faire-part', kind: 'métier', mission: 'Invitations, menus, marque-places', durationMinutes: 60, keywords: ['papeterie', 'faire-part', 'invitation', 'menu', 'marque-place', 'calligraphie'], image: '/images/punk-papier.jpg' },
  { title: 'Majordome / Voix off', kind: 'métier', mission: 'Annonces, transitions, protocole', durationMinutes: 240, keywords: ['majordome', 'voix off', 'annonce', 'protocole', 'maitre de ceremonie'], image: '/images/chateau-bengale-bal.jpg' },
  { title: 'Traiteur brunch', kind: 'métier', mission: 'Lendemain de fête, départ des invités', durationMinutes: 120, keywords: ['brunch', 'lendemain', 'petit dejeuner'], image: '/images/terrasse.jpg' },
  { title: 'Coach beauté & Spa', kind: 'métier', mission: 'Détente avant les préparatifs', durationMinutes: 90, keywords: ['spa', 'massage', 'detente', 'soin', 'bien-etre'], image: '/images/garden.jpg' },
];

/** Les moments : ce qui structure la journée, ceux qu'on veut placer vite. */
const MOMENTS: CatalogEntry[] = [
  { title: 'Préparatifs', kind: 'moment', mission: 'Habillage, détails, premiers clichés', durationMinutes: 90, keywords: ['preparatif', 'habillage', 'get ready'], },
  { title: 'Cérémonie civile', kind: 'moment', mission: 'Mairie, signatures, sortie', durationMinutes: 45, keywords: ['mairie', 'civil', 'signature'], },
  { title: 'Cérémonie laïque', kind: 'moment', mission: 'Vœux, lectures, échange des alliances', durationMinutes: 60, keywords: ['ceremonie', 'laique', 'voeux', 'alliances', 'rituel'] },
  { title: 'Cocktail', kind: 'moment', mission: 'Champagne, rencontres, golden hour', durationMinutes: 90, keywords: ['cocktail', 'aperitif', 'champagne', 'vin d honneur'] },
  { title: 'Séance photo', kind: 'moment', mission: 'Couple, groupes, lumière du soir', durationMinutes: 60, keywords: ['photo', 'seance', 'shooting', 'groupe'] },
  { title: 'Dîner', kind: 'moment', mission: 'Entrées, plats, service', durationMinutes: 150, keywords: ['diner', 'repas', 'menu', 'banquet'] },
  { title: 'Discours', kind: 'moment', mission: 'Témoins, familles, mots qui restent', durationMinutes: 30, keywords: ['discours', 'toast', 'allocution', 'mot'] },
  { title: 'Pièce montée', kind: 'moment', mission: 'Découpe, photos, dessert', durationMinutes: 30, keywords: ['gateau', 'piece montee', 'dessert'] },
  { title: 'Ouverture de bal', kind: 'moment', mission: 'Première danse, montée progressive', durationMinutes: 30, keywords: ['bal', 'danse', 'premiere danse', 'ouverture'] },
  { title: 'Soirée club', kind: 'moment', mission: 'DJ set, lumières, piste pleine', durationMinutes: 180, keywords: ['soiree', 'club', 'dj set', 'night', 'fete'] },
  { title: 'Feu d’artifice', kind: 'moment', mission: 'Climax, tout le monde dehors', durationMinutes: 20, keywords: ['artifice', 'climax', 'etincelles'] },
  { title: 'Soupe à l’oignon', kind: 'moment', mission: 'Le remède de fin de nuit, version maison', durationMinutes: 45, keywords: ['soupe', 'fin de nuit', 'remede', 'oignon'] },
  { title: 'Brunch du lendemain', kind: 'moment', mission: 'Départ des invités, souvenirs', durationMinutes: 150, keywords: ['brunch', 'lendemain', 'depart'] },
  { title: 'Retour de voyage', kind: 'moment', mission: 'Partage des photos, album, remerciements', durationMinutes: 120, keywords: ['voyage', 'retour', 'album', 'remerciement'] },
];

const CATALOG: CatalogEntry[] = [...METIERS, ...MOMENTS];

function toCard(entry: CatalogEntry): GestureCard {
  const fallback = visualFor(entry.title);
  return {
    id: normalize(entry.title).replace(/[^a-z0-9]+/g, '-'),
    title: entry.title,
    kind: entry.kind,
    mission: entry.mission,
    image: entry.image ?? fallback.image,
    accent: entry.accent ?? fallback.accent,
    durationMinutes: entry.durationMinutes,
    role: entry.role,
  };
}

export const CATALOG_CARDS: GestureCard[] = CATALOG.map(toCard);

/**
 * Cherche dans la taxonomie. Une recherche sans correspondance produit quand
 * même une carte : le titre saisi, un visuel d'univers, une durée à régler.
 * C'est ce qui permet d'ajouter au Jour J ce qui n'existe nulle part ailleurs.
 */
export function searchCards(query: string, limit = 6): { cards: GestureCard[]; invented: boolean } {
  const q = normalize(query);
  if (!q) return { cards: [], invented: false };

  const scored = CATALOG.map((entry) => {
    const haystack = [entry.title, entry.mission, ...entry.keywords].map(normalize);
    let score = 0;
    for (const word of haystack) {
      if (word === q) score = Math.max(score, 100);
      else if (word.startsWith(q)) score = Math.max(score, 70);
      else if (q.includes(word) && word.length > 3) score = Math.max(score, 55);
      else if (word.includes(q) && q.length > 3) score = Math.max(score, 40);
    }
    return { entry, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => toCard(r.entry));

  if (scored.length > 0) return { cards: scored, invented: false };

  // Rien trouvé : la carte existe quand même, à partir de ce qui a été écrit.
  const title = query.trim().charAt(0).toUpperCase() + query.trim().slice(1);
  const visual = visualFor(normalize(title));
  const knownRole = Object.values(UNIVERSAL_ROLES).find((r) => normalize(r.title).includes(q));
  return {
    cards: [{
      id: `custom-${normalize(title).replace(/[^a-z0-9]+/g, '-')}`,
      title,
      kind: knownRole ? 'métier' : 'moment',
      mission: knownRole ? knownRole.privateSpaceHint : 'À définir avec les mariés',
      image: visual.image,
      accent: knownRole?.colorAccent ?? visual.accent,
      durationMinutes: 60,
      role: knownRole?.id,
    }],
    invented: true,
  };
}

export const CATALOG_KINDS: CardKind[] = ['métier', 'moment'];
export { UNIVERSAL_ROLES };
