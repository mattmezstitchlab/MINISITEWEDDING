import { FAMILLES, MODULES_DE_COMPOSITION, MINI_SITE_INVITE, MINI_SITE_PRESTATAIRE, type Famille } from './grilleDuMonde';
import { ARTICLES, PACKAGES, RAYONS, euros, prixDeLArticle } from './superMariage';
import { DOCUMENTS } from './superFooter';
import { MAGAZINES } from './semaines';
import type { Portefeuille } from './portefeuille';

/* LES CATÉGORIES DU TICKET — TOUT LE PRODUIT, CLASSÉ, ET COCHABLE
 *
 * Le produit ne propose plus qu'une seule chose à faire : **cocher**. Et tout ce
 * qu'on peut cocher est rangé dans une catégorie, elle-même rangée dans une des
 * trois familles :
 *
 * 1. **LE JOUR J** — les horaires, les métiers, les petits prix. C'est ce qui a
 *    un prix : le ticket le calcule.
 * 2. **VOTRE SITE** — les modules du mini-site, à cocher un par un. Le ticket
 *    **est** le site : ce qui est coché est ce qui s'affiche. Inclus.
 * 3. **LES DOCUMENTS** — les pièces qu'on emporte (attestation, invitation,
 *    contrat…), déjà écrites dans le produit. Incluses.
 *
 * Rien n'est inventé ici : les lignes du jour J viennent du magasin
 * (`superMariage`), celles du site du compositeur (`grilleDuMonde`), celles des
 * documents du fonds du site (`superFooter`).
 */

/** Les lignes d'une catégorie tiennent toutes dans cette forme. */
export interface LigneDuTicket {
  id: string;
  /** La catégorie qui la range. */
  catégorie: string;
  label: string;
  detail: string;
  /** Le prix unitaire — zéro quand la ligne est incluse. */
  prix: number;
  quantite?: number;
  /** Ce qu'elle ouvre dans la grille, quand elle ouvre quelque chose. */
  ouvre?: string;
  /** Qui la voit. La grille et le ticket suivent la même règle. */
  famille: Famille;
  /** Les portefeuilles qui reçoivent le ticket quand on la coche. */
  vers: Portefeuille[];
  /** Incluse : elle figure au papier, sans charger la note. */
  incluse?: boolean;
  /** En promotion : la marque du magasin. */
  promo?: boolean;
}

/** Une catégorie : un mot, une phrase, et ses lignes. */
export interface CatégorieDuTicket {
  id: string;
  mot: string;
  titre: string;
  sous: string;
  /** La famille d'où elle vient, et sa couleur : celle d'un magazine. */
  groupe: 'jour' | 'site' | 'documents';
  couleur: string;
  lignes: LigneDuTicket[];
}

const COULEURS = ['#C98A3E', '#3E6B63', '#7A4E6B', '#B0483F', '#4A6FA5', '#6B7A4A', '#8A5A3E', '#3E4B5A'];

const familleDe = (id: string): Famille =>
  id.startsWith('sup-') ? 'public' : id.startsWith('horaire-') ? 'invites' : id.startsWith('menu') ? 'famille' : 'prive';

/* ——————————————————————————— 1. LE JOUR J ——————————————————————————— */

/** Où va une ligne, quand on la coche : c'est ça, la distribution. */
function versDuneLigne(id: string): Portefeuille[] {
  if (id.startsWith('horaire-')) return ['invites', 'couple'];
  if (id.startsWith('sup-')) return ['invites'];
  if (id.startsWith('menu')) return ['couple'];
  if (id.startsWith('metier-')) return ['metier', 'couple'];
  return ['couple'];
}

/** Les rayons du magasin deviennent les catégories du jour J. */
const CATÉGORIES_DU_JOUR: CatégorieDuTicket[] = [
  ...RAYONS.map((rayon) => ({
    id: rayon.key,
    mot: rayon.label.replace(/^Rayon\s+/i, '').toUpperCase(),
    titre: rayon.label,
    sous: rayon.sousTitre,
    groupe: 'jour' as const,
    couleur: COULEURS[RAYONS.indexOf(rayon) % COULEURS.length]!,
    lignes: rayon.articles.map((article) => ({
      id: article.id,
      catégorie: rayon.key,
      label: article.label,
      detail: article.detail,
      prix: article.prix,
      quantite: article.quantite,
      famille: familleDe(article.id),
      vers: versDuneLigne(article.id),
      promo: article.promo,
    })),
  })),
  ...PACKAGES.map((menu) => ({
    id: `menu-${menu.id}`,
    mot: menu.name.toUpperCase(),
    titre: `Menu ${menu.name}`,
    sous: menu.description,
    groupe: 'jour' as const,
    couleur: COULEURS[2]!,
    lignes: [
      {
        id: `menu-${menu.id}`,
        catégorie: `menu-${menu.id}`,
        label: `Menu ${menu.name}`,
        detail: menu.features.slice(0, 3).join(' · '),
        prix: menu.prix,
        famille: 'famille' as Famille,
        vers: ['couple'] as Portefeuille[],
      },
    ],
  })),
];

/* ———————————————————————————— 2. LE SITE ———————————————————————————— */

/** Un module du site devient une ligne : ce qui est coché est ce qui s'affiche. */
function ligneDeModule(id: string, famille: Famille, vers: Portefeuille): LigneDuTicket {
  const module = MODULES_DE_COMPOSITION.find((m) => m.id === id);
  const mot = module?.mot ?? id.toUpperCase();
  return {
    id: `site-${id}`,
    catégorie: 'site',
    label: mot,
    detail: 'un bloc de votre site, que vous cochez',
    prix: 0,
    famille,
    vers: [vers],
    incluse: true,
  };
}

const CATÉGORIE_DU_SITE: CatégorieDuTicket = {
  id: 'site',
  mot: 'VOTRE SITE',
  titre: 'Votre site, en blocs',
  sous: 'ce qui est coché est ce qui s’affiche — inclus',
  groupe: 'site',
  couleur: COULEURS[1]!,
  lignes: [
    ...MINI_SITE_INVITE.map((id) => ligneDeModule(id, 'invites', 'invites')),
    ...MINI_SITE_PRESTATAIRE.map((id) => ligneDeModule(id, 'public', 'metier')),
  ],
};

/* ————————————————————————— 3. LES DOCUMENTS ————————————————————————— */

/** Les documents du fonds du site : de vraies pièces, déjà écrites. */
const CATÉGORIE_DES_DOCUMENTS: CatégorieDuTicket = {
  id: 'documents',
  mot: 'LES DOCUMENTS',
  titre: 'Les documents à emporter',
  sous: 'ce qu’on demande, et ce qu’il faut avoir sous la main — inclus',
  groupe: 'documents',
  couleur: COULEURS[4]!,
  lignes: DOCUMENTS.map((document) => ({
    id: `doc-${document.id}`,
    catégorie: 'documents',
    label: document.nom.toUpperCase(),
    detail: `${document.demandePar} · au nom de ${document.auNomDe.toLowerCase()}`,
    prix: 0,
    famille: 'prive' as Famille,
    vers: ['couple', 'invites'] as Portefeuille[],
    incluse: true,
  })),
};

/* ——————————————————————— LE CATALOGUE ENTIER ——————————————————————— */

/** **Tout ce qui se coche**, rangé par catégorie — et rien d'autre à comprendre. */
export const CATÉGORIES_DU_TICKET: CatégorieDuTicket[] = [
  ...CATÉGORIES_DU_JOUR,
  CATÉGORIE_DU_SITE,
  CATÉGORIE_DES_DOCUMENTS,
];

/** Les trois familles de catégories, dans l'ordre où on les propose. */
export const GROUPES_DU_TICKET: Array<{ id: CatégorieDuTicket['groupe']; mot: string; sous: string }> = [
  { id: 'jour', mot: 'LE JOUR J', sous: 'ce qui a un prix' },
  { id: 'site', mot: 'VOTRE SITE', sous: 'ce qui s’affiche' },
  { id: 'documents', mot: 'LES DOCUMENTS', sous: 'ce qu’on emporte' },
];

/** Toutes les lignes, à plat. */
export const LIGNES_DU_TICKET: LigneDuTicket[] = CATÉGORIES_DU_TICKET.flatMap((c) => c.lignes);

export function ligneParId(id: string): LigneDuTicket | undefined {
  return LIGNES_DU_TICKET.find((l) => l.id === id);
}

export function catégorieDeLaLigne(id: string): CatégorieDuTicket | undefined {
  return CATÉGORIES_DU_TICKET.find((c) => c.lignes.some((l) => l.id === id));
}

/** **La première catégorie ouverte** : celle qui a le plus de lignes cochables. */
export function catégorieParDéfaut(): string {
  return CATÉGORIES_DU_JOUR[0]?.id ?? CATÉGORIES_DU_TICKET[0]!.id;
}

/** **Ce qu'on peut prendre d'un coup** : tout un rayon, ou tout une famille. */
export function lignesDuneCatégorie(id: string): string[] {
  return (CATÉGORIES_DU_TICKET.find((c) => c.id === id)?.lignes ?? []).map((l) => l.id);
}

/** Les lignes cochées, dans l'ordre du catalogue — jamais dans l'ordre du clic. */
export function lignesCochées(cochées: string[]): LigneDuTicket[] {
  return LIGNES_DU_TICKET.filter((l) => cochées.includes(l.id));
}

/** Le prix d'une ligne, quantités comprises. */
export function prixDuneLigne(ligne: LigneDuTicket): number {
  return ligne.incluse ? 0 : ligne.prix * (ligne.quantite ?? 1);
}

/** Combien de lignes, par catégorie : ce que la liste affiche à droite du mot. */
export function compteParCatégorie(cochées: string[]): Record<string, number> {
  const compte: Record<string, number> = {};
  CATÉGORIES_DU_TICKET.forEach((c) => {
    compte[c.id] = c.lignes.filter((l) => cochées.includes(l.id)).length;
  });
  return compte;
}

/** L'enseigne du magasin, et son slogan — la même que partout ailleurs. */
export const ENSEIGNE = {
  nom: 'SUPER MARIAGE',
  slogan: 'Ouvert quand tout est fermé',
  rayon: 'TOUT POUR LE JOUR J',
};

/** La couleur d'un magazine, pour teinter une catégorie sans rien inventer. */
export function couleurDuMagazine(numero: number): string {
  const magazine = MAGAZINES[Math.min(MAGAZINES.length, Math.max(1, numero)) - 1]!;
  return magazine.palette.fond;
}

/** Le mot d'une famille, pour la marque minuscule des droits. */
export function marqueDeLaFamille(famille: Famille): string {
  return FAMILLES.find((f) => f.id === famille)?.marque ?? '○';
}

/** Le prix, écrit comme sur le papier — jamais autrement. */
export { euros, ARTICLES, PACKAGES, prixDeLArticle };
