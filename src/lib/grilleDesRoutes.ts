/* LA GRILLE DES ROUTES — TOUT LE SITE PARLE LE MÊME LANGAGE
 *
 * Une adresse ne mène plus à une page : elle mène à **un monde**. Le shop, ses
 * produits, les métiers, les personnes, les articles, la collection des
 * cinquante-quatre magazines, les invitations — chaque adresse ouvre la grille
 * sur l'ensemble qui la concerne, et l'on entre dans une case.
 *
 * Rien n'est inventé ici : chaque motif renvoie à un monde que `grilleDuMonde`
 * sait déjà construire. Un identifiant inconnu ne casse jamais rien — il ouvre
 * l'ouverture, les dix grandes portes.
 */

/** Ce qu'une adresse devient : un monde, et ce qu'on y cherche. */
export interface RouteDuMonde {
  /** Le motif, tel qu'il s'écrit dans l'adresse. */
  motif: string;
  /** Le monde ouvert, éventuellement nourri du segment de l'adresse. */
  monde: (segment?: string) => string;
  /** Ce que l'on vient y faire. */
  fait: string;
  /** Ce que le segment ne doit pas être — un numéro n'est pas un article. */
  sauf?: RegExp;
}

/** Le tableau des adresses : chacune son monde, chacune sa promesse. */
export const ROUTES_DU_MONDE: RouteDuMonde[] = [
  { motif: '/theater', monde: () => 'monde', fait: 'les dix grandes portes' },
  { motif: '/aime', monde: () => 'magazines', fait: 'la collection des 54 magazines' },
  { motif: '/taxonomie', monde: () => 'magazines', fait: 'la collection des 54 magazines' },
  { motif: '/', monde: () => 'magasin', fait: 'le ticket : on coche, et ça part dans les portefeuilles' },
  { motif: '/ticket', monde: () => 'magasin', fait: 'le ticket : on coche, et ça part dans les portefeuilles' },
  { motif: '/caisse', monde: () => 'magasin', fait: 'le mariage entier, au prix où il se fait' },
  { motif: '/shop', monde: () => 'boutique', fait: 'la boutique, en cases' },
  { motif: '/shop/:slug', monde: (s) => `produit-${s}`, fait: 'un produit, et tout ce qui va avec' },
  { motif: '/magazine', monde: () => 'annee', fait: 'l’année, jour par jour' },
  { motif: '/magazine/:slug', monde: (s) => `article-${s}`, fait: 'un article, et ses voisins', sauf: /^\d+$/ },
  { motif: '/magazine/:numero', monde: (s) => `magazine-${s}`, fait: 'un magazine, ses sept chapitres' },
  { motif: '/le-mariage', monde: () => 'monde', fait: 'le mariage, en dix mondes' },
  { motif: '/le-mariage/:styleId', monde: () => 'monde', fait: 'le mariage, en dix mondes' },
  { motif: '/metiers', monde: () => 'metiers', fait: 'les métiers, en cases' },
  { motif: '/metiers/:slug', monde: (s) => `metier-${s}`, fait: 'un métier, ses moments, son ticket' },
  { motif: '/prestataire', monde: () => 'metiers', fait: 'les métiers, en cases' },
  { motif: '/profil/:slug', monde: (s) => `personne-${s}`, fait: 'une personne, et son univers' },
  { motif: '/mariage/:slug', monde: (s) => `personne-${s}`, fait: 'un mariage, et ses personnes' },
  { motif: '/rejoindre/:slug', monde: () => 'mini-site', fait: 'l’invitation, et ce qu’on y répond' },
  { motif: '/ripple', monde: () => 'monde', fait: 'les dix grandes portes' },
];

/** Le monde d'une adresse : le premier motif qui la reconnaît, sinon l'année. */
export function mondeDUneAdresse(chemin: string): string {
  const morceaux = chemin.split('/').filter(Boolean);
  for (const route of ROUTES_DU_MONDE) {
    const parts = route.motif.split('/').filter(Boolean);
    if (parts.length !== morceaux.length) continue;
    let segment: string | undefined;
    const reconnu = parts.every((part, i) => {
      if (part.startsWith(':')) {
        segment = morceaux[i];
        return !(route.sauf && route.sauf.test(segment ?? ''));
      }
      return part === morceaux[i];
    });
    if (reconnu) return route.monde(segment);
  }
  return 'annee';
}

/** Où l'on va, et par où : la promesse d'une adresse, en un mot. */
export function promesseDUneAdresse(chemin: string): string {
  const morceaux = chemin.split('/').filter(Boolean);
  return (
    ROUTES_DU_MONDE.find((route) => {
      const parts = route.motif.split('/').filter(Boolean);
      return (
        parts.length === morceaux.length &&
        parts.every((p, i) => (p.startsWith(':') ? !(route.sauf && route.sauf.test(morceaux[i] ?? '')) : p === morceaux[i]))
      );
    })?.fait ?? 'l’année entière, et le monde à un clic'
  );
}
