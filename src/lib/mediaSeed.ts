import type { MediaAsset } from './types';

/**
 * La bibliothèque d’images livrée avec le projet (`public/images/`).
 *
 * Module volontairement sans aucun import : il est lu à la fois par la démo de
 * développement et par la base locale, ce qui éviterait un cycle
 * `demo → defaults → http → localApi → localStore → demo`.
 */
export const MEDIA_SEED: MediaAsset[] = [
  { id: 1, category: 'Couple', title: 'Couple à Paris', url: '/images/couple-paris.jpg', collection: 'Editorial Paris', kind: 'photo', orientation: 'portrait' },
  { id: 2, category: 'Alliances', title: 'Les alliances', url: '/images/alliances.jpg', collection: 'Editorial Paris', kind: 'photo', orientation: 'carre' },
  { id: 3, category: 'Bouquet', title: 'Bouquet pivoines', url: '/images/bouquet.jpg', collection: 'Garden Wedding', kind: 'photo', orientation: 'portrait' },
  { id: 4, category: 'Château', title: 'Château de Chantilly', url: '/images/chateau.jpg', collection: 'Château', kind: 'photo', orientation: 'paysage' },
  { id: 5, category: 'Table', title: 'Table black tie', url: '/images/table-noir.jpg', collection: 'Black Tie', kind: 'photo', orientation: 'paysage' },
  { id: 6, category: 'Danse', title: 'Première danse', url: '/images/danse.jpg', collection: 'Modern Romance', kind: 'photo', orientation: 'paysage' },
  { id: 7, category: 'Nature', title: 'Jardin anglais', url: '/images/garden.jpg', collection: 'Garden Wedding', kind: 'photo', orientation: 'paysage' },
  { id: 8, category: 'Décoration', title: 'Terrasse au soleil', url: '/images/terrasse.jpg', collection: "Côte d'Azur", kind: 'photo', orientation: 'paysage' },
  { id: 9, category: 'Champagne', title: 'Coupe de champagne', url: '/images/champagne.jpg', collection: 'Black Tie', kind: 'photo', orientation: 'portrait' },
  { id: 10, category: 'Textures', title: 'Noir & blanc', url: '/images/noir-blanc.jpg', collection: 'Editorial Paris', kind: 'photo', orientation: 'carre' },
  { id: 11, category: 'Cérémonie', title: 'Hero — mariage', url: '/images/hero-wedding.jpg', collection: 'Château', kind: 'photo', orientation: 'paysage' },
  // Nouveaux univers qui cassent les codes
  { id: 12, category: 'Béton', title: 'Béton Brut — chapelle', url: '/images/brutal.jpg', collection: 'Béton Brut', kind: 'photo', orientation: 'portrait' },
  { id: 13, category: 'Club', title: 'Club Amour — 02h17', url: '/images/club-amour.jpg', collection: 'Club Amour', kind: 'photo', orientation: 'paysage' },
  { id: 14, category: 'Desert', title: 'Desert Motel — piscine', url: '/images/desert-motel.jpg', collection: 'Desert Motel', kind: 'photo', orientation: 'paysage' },
  { id: 15, category: 'Cosmic', title: 'Cosmic — verre liquide', url: '/images/cosmic.jpg', collection: 'Cosmic', kind: 'photo', orientation: 'carre' },
  { id: 16, category: 'Punk', title: 'Punk Papier — zine', url: '/images/punk-papier.jpg', collection: 'Punk Papier', kind: 'photo', orientation: 'portrait' },
  { id: 17, category: 'Forêt', title: 'Forêt Noire — rituel', url: '/images/foret-noire.jpg', collection: 'Forêt Noire', kind: 'photo', orientation: 'paysage' },
  { id: 18, category: 'Cinéma', title: 'Cinéma — rideau rouge', url: '/images/cinema.jpg', collection: 'Cinéma', kind: 'photo', orientation: 'paysage' },
  { id: 19, category: 'Brocante', title: 'Brocante Club — maximalisme', url: '/images/brocante.jpg', collection: 'Brocante Club', kind: 'photo', orientation: 'paysage' },
  { id: 20, category: 'Supermarché', title: 'Supermarché 22h — rayon 7', url: '/images/supermarche.jpg', collection: 'Supermarché 22h', kind: 'photo', orientation: 'paysage' },
  { id: 21, category: 'Laverie', title: 'Laverie Club — tambour 7', url: '/images/laverie.jpg', collection: 'Laverie Club', kind: 'photo', orientation: 'paysage' },
];
