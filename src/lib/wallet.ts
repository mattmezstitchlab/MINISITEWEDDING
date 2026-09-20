import { useEffect, useState } from 'react';
import { AXES_FOOTER, type AxeDeFooter, type DocumentPossible } from './superFooter';

/**
 * LE PORTEFEUILLE — TOUT CE QU'ON VALIDE SE RANGE TOUT SEUL
 *
 * Chaque pièce validée descend ici, et **se classe automatiquement** : identité,
 * domicile, revenus, travail, famille, frontières, entreprise, droits. Si une
 * pièce ne rentre dans aucune catégorie connue, **la catégorie se crée** à
 * partir de l'axe dont elle vient — c'est comme ça qu'un portefeuille apprend :
 * à force de demandes, à travers le monde, des familles de documents apparaissent
 * qui n'existaient pas encore chez nous.
 *
 * Le portefeuille ne s'invente pas : il range ce que la personne a **choisi** de
 * garder. Et il vit dans le navigateur (`vows:wallet`), comme le reste.
 */

/** Les catégories de départ, et les mots qui y mènent. */
export interface CategorieWallet {
  id: string;
  label: string;
  mots: string[];
}

export const CATEGORIES_WALLET: CategorieWallet[] = [
  { id: 'identite', label: 'Identité', mots: ['identité', 'passeport', 'carte nationale', 'titre de séjour', 'récépissé', 'naissance'] },
  { id: 'domicile', label: 'Domicile', mots: ['domicile', 'hébergement', 'loyer', 'quittance', 'bail'] },
  { id: 'revenus', label: 'Revenus & ressources', mots: ['ressources', 'revenus', 'honneur', 'bourse', 'chômage'] },
  { id: 'travail', label: 'Travail & statut', mots: ['employeur', 'contrat de travail', 'embauche', 'stage', 'alternance', 'intermittent', 'formation', 'bénévolat'] },
  { id: 'etudes', label: 'Études & diplômes', mots: ['diplôme', 'titre professionnel', 'comparabilité', 'langue', 'certification'] },
  { id: 'famille', label: 'Famille & union', mots: ['mariage', 'pacs', 'décès', 'succession', 'testament', 'naissance'] },
  { id: 'frontieres', label: 'Voyage & frontières', mots: ['visa', 'invitation', 'prise en charge', 'sortie du territoire', 'procuration'] },
  { id: 'entreprise', label: 'Entreprise & associations', mots: ['kbis', 'siren', 'statuts', 'association', 'situation'] },
  { id: 'droits', label: 'Droits & contrats', mots: ['droits', 'cession', 'contrat de prestation', 'devis', 'facture', 'assurance', 'responsabilité'] },
];

export interface PieceDeWallet {
  /** L'identifiant du document, quand il vient du catalogue. */
  id: string;
  nom: string;
  categorie: string;
  categorieLabel: string;
  /** Vrai quand la catégorie a été ouverte pour cette pièce : elle n'existait pas. */
  creee: boolean;
  quand: string;
  parQui?: string;
}

const CLE = 'vows:wallet';
const EVENEMENT = 'vows:wallet-change';

export function chargerWallet(): PieceDeWallet[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const brut = localStorage.getItem(CLE);
    const lu = brut ? (JSON.parse(brut) as PieceDeWallet[]) : [];
    return Array.isArray(lu) ? lu : [];
  } catch {
    return [];
  }
}

function ecrire(pieces: PieceDeWallet[]): void {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(CLE, JSON.stringify(pieces));
    window.dispatchEvent(new Event(EVENEMENT));
  } catch {
    /* pas de fenêtre : personne à prévenir */
  }
}

/** L'axe du footer dont vient un document : c'est lui qui nomme une catégorie neuve. */
export function axeDuDocument(doc: DocumentPossible): AxeDeFooter | null {
  return (
    AXES_FOOTER.find((axe) =>
      axe.entrees.some((entree) =>
        entree.entrees.some((sous) => doc.ouvrePar.includes(sous.id)),
      ),
    ) ?? null
  );
}

/**
 * **OÙ RANGER CETTE PIÈCE ?** On cherche d'abord dans ce qu'on connaît ; si rien
 * ne correspond, on ouvre une catégorie sur le nom de son axe — la famille
 * apparaît d'elle-même, et la prochaine pièce du même genre y tombera.
 */
export function classerDocument(doc: DocumentPossible): { id: string; label: string; creee: boolean } {
  const texte = `${doc.nom} ${doc.source} ${doc.pieces.join(' ')}`.toLowerCase();
  const connu = CATEGORIES_WALLET.find((c) => c.mots.some((mot) => texte.includes(mot)));
  if (connu) return { id: connu.id, label: connu.label, creee: false };

  const axe = axeDuDocument(doc);
  const label = axe?.label ?? 'Autres pièces';
  return { id: label.toLowerCase().replace(/[^a-z0-9]+/g, '-'), label, creee: true };
}

/** **Valider, et ranger** : la pièce descend dans le portefeuille. */
export function rangerAuWallet(doc: DocumentPossible, parQui?: string): PieceDeWallet {
  const { id, label, creee } = classerDocument(doc);
  const piece: PieceDeWallet = {
    id: doc.id,
    nom: doc.nom,
    categorie: id,
    categorieLabel: label,
    creee,
    quand: new Date().toISOString(),
    parQui,
  };
  const reste = chargerWallet().filter((p) => p.id !== doc.id);
  ecrire([piece, ...reste].slice(0, 80));
  return piece;
}

export function retirerDuWallet(id: string): void {
  ecrire(chargerWallet().filter((p) => p.id !== id));
}

export function useWallet(): PieceDeWallet[] {
  const [pieces, setPieces] = useState<PieceDeWallet[]>(() => chargerWallet());

  useEffect(() => {
    const surChangement = () => setPieces(chargerWallet());
    window.addEventListener(EVENEMENT, surChangement);
    surChangement();
    return () => window.removeEventListener(EVENEMENT, surChangement);
  }, []);

  return pieces;
}

/**
 * Le portefeuille, rangé : **une famille par catégorie**, celles qu'on a créées y
 * comprises, la plus fournie d'abord.
 */
export function walletParCategorie(pieces: PieceDeWallet[]): Array<{
  id: string;
  label: string;
  creee: boolean;
  pieces: PieceDeWallet[];
}> {
  const familles = new Map<string, { id: string; label: string; creee: boolean; pieces: PieceDeWallet[] }>();
  for (const piece of pieces) {
    const famille = familles.get(piece.categorie) ?? {
      id: piece.categorie,
      label: piece.categorieLabel,
      creee: piece.creee,
      pieces: [],
    };
    famille.pieces.push(piece);
    famille.creee = famille.creee || piece.creee;
    familles.set(piece.categorie, famille);
  }
  return Array.from(familles.values()).sort((a, b) => b.pieces.length - a.pieces.length);
}
