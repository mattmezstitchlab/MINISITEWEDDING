import { useEffect, useState } from 'react';

/**
 * LES ANNONCES, LE POINT D'ÉTAT, ET LA FENTE
 *
 * Une seule chose circule ici : **ce qui vient d'arriver**. Un document prêt, un
 * message, une notification — tout passe par le même point d'état, en bas à
 * droite, qui **s'allume par ordre d'importance** : vert, bleu, mauve, fuchsia,
 * orangé, rouge. On clique : **la fente sort**, et le ticket annonce ce dont il
 * s'agit.
 *
 * **Le ticket dit aussi vos droits** : on n'est pas obligé de l'ouvrir, ne pas
 * l'ouvrir est un choix, et ce choix est **horodaté ici**. Ce que cela vaut
 * devant un juge, ce sont les juristes qui le diront — le site, lui, se contente
 * d'être fidèle.
 *
 * Rien ne quitte le navigateur tant qu'il n'y a pas de serveur pour le porter.
 */

export type TypeAnnonce = 'document' | 'message' | 'notification';

/** Où en est l'annonce — « écarté » veut dire : non ouverte, et c'est un droit. */
export type EtatAnnonce = 'nouveau' | 'lu' | 'valide' | 'negocie' | 'ecarte';

/**
 * LES SIX PALIERS — du plus calme au plus grave. C'est la couleur du point.
 */
export const PALIERS: Array<{ id: string; label: string; hex: string }> = [
  { id: 'vert', label: 'Routine', hex: '#22C55E' },
  { id: 'bleu', label: 'À savoir', hex: '#3B82F6' },
  { id: 'mauve', label: 'À faire', hex: '#8B5CF6' },
  { id: 'fuchsia', label: 'Important', hex: '#D946EF' },
  { id: 'orange', label: 'Urgent', hex: '#F97316' },
  { id: 'rouge', label: 'Critique', hex: '#EF4444' },
];

export interface Annonce {
  id: string;
  type: TypeAnnonce;
  /** Ce qui s'écrit en gras sur le ticket. */
  titre: string;
  /** La ligne de contexte : qui, pour qui, quoi. */
  detail: string;
  /** 1 à 6 : plus le chiffre est haut, plus la couleur monte. */
  palier: number;
  etat: EtatAnnonce;
  quand: string;
  parQui?: string;
  pourQui?: string;
  /** L'identifiant du document, quand il y en a un : c'est lui qui ira au wallet. */
  documentId?: string;
  /**
   * **Le mot des droits.** Il s'écrit sur le ticket : ce qu'on peut faire, ce
   * qu'on n'est pas obligé de faire, et ce qui est enregistré.
   */
  droits: string;
}

/** Ce que tout ticket rappelle : on n'est jamais obligé d'ouvrir, ni d'imprimer. */
export const MENTION_DROITS =
  'Vous n’êtes pas obligé d’ouvrir ce ticket, ni de l’imprimer. Ne pas l’ouvrir est un droit : ' +
  'votre choix et son heure sont enregistrés ici, pour que personne ne puisse dire le contraire.';

const CLE = 'vows:annonces';
const EVENEMENT = 'vows:annonces-change';

export function chargerAnnonces(): Annonce[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const brut = localStorage.getItem(CLE);
    const lu = brut ? (JSON.parse(brut) as Annonce[]) : [];
    return Array.isArray(lu) ? lu : [];
  } catch {
    return [];
  }
}

function ecrire(annonces: Annonce[]): void {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(CLE, JSON.stringify(annonces));
    window.dispatchEvent(new Event(EVENEMENT));
  } catch {
    /* pas de fenêtre : personne à prévenir */
  }
}

/** Poser une annonce : elle s'allume, et la fente s'ouvre sur elle. */
export function publierAnnonce(annonce: Omit<Annonce, 'id' | 'quand' | 'etat'> & { etat?: EtatAnnonce }): Annonce {
  const complete: Annonce = {
    etat: 'nouveau',
    ...annonce,
    id: `annonce-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    quand: new Date().toISOString(),
  };
  ecrire([complete, ...chargerAnnonces()].slice(0, 40));
  ouvrirFente();
  return complete;
}

/** **Un document est prêt** : c'est le ticket qui sort de la fente. */
export function annoncerDocument(nom: string, parQui: string, pourQui?: string, documentId?: string): Annonce {
  return publierAnnonce({
    type: 'document',
    titre: `Document disponible concernant « ${nom} »`,
    detail: `demandé par ${parQui}${pourQui ? ` · pour ${pourQui}` : ''}`,
    palier: documentId ? 3 : 2,
    parQui,
    pourQui,
    documentId,
    droits: MENTION_DROITS,
  });
}

/** Un message de quelqu'un : il s'annonce comme le reste. */
export function annoncerMessage(parQui: string, sujet: string, palier = 2): Annonce {
  return publierAnnonce({
    type: 'message',
    titre: `Message de ${parQui}`,
    detail: sujet,
    palier,
    parQui,
    droits: MENTION_DROITS,
  });
}

/** Une notification du site : les habitudes, les rappels, les occasions. */
export function annoncerNotification(titre: string, detail: string, palier = 1): Annonce {
  return publierAnnonce({ type: 'notification', titre, detail, palier, droits: MENTION_DROITS });
}

/** Changer l'état d'une annonce : lu, validé, négocié, écarté. */
export function changerEtatAnnonce(id: string, etat: EtatAnnonce): void {
  ecrire(chargerAnnonces().map((a) => (a.id === id ? { ...a, etat } : a)));
}

/** On retire l'annonce de la pile — elle reste dans l'historique. */
export function retirerAnnonce(id: string): void {
  ecrire(chargerAnnonces().filter((a) => a.id !== id));
}

/** Les annonces, telles qu'un composant les suit. */
export function useAnnonces(): Annonce[] {
  const [annonces, setAnnonces] = useState<Annonce[]>(() => chargerAnnonces());

  useEffect(() => {
    const surChangement = () => setAnnonces(chargerAnnonces());
    window.addEventListener(EVENEMENT, surChangement);
    surChangement();
    return () => window.removeEventListener(EVENEMENT, surChangement);
  }, []);

  return annonces;
}

/** Celles qui n'ont pas encore été vues : c'est ce qui allume le point. */
export function annoncesNouvelles(annonces: Annonce[]): Annonce[] {
  return annonces.filter((a) => a.etat === 'nouveau' || a.etat === 'lu');
}

/**
 * **LA COULEUR DU POINT** : le palier le plus haut parmi les annonces à voir.
 * Aucune annonce : le point s'éteint.
 */
export function palierDuPoint(annonces: Annonce[]): number {
  const aVoir = annoncesNouvelles(annonces);
  return aVoir.length === 0 ? 0 : Math.max(...aVoir.map((a) => a.palier));
}

/** La couleur et le nom d'un palier, ou l'éteint. */
export function palierDuPointInfo(palier: number): { label: string; hex: string } {
  if (palier <= 0) return { label: 'Rien à voir', hex: '#3F3F46' };
  return PALIERS[Math.min(palier, PALIERS.length) - 1]!;
}

/** **L'annonce du moment** : la plus grave, et la plus récente à gravité égale. */
export function annonceCourante(annonces: Annonce[]): Annonce | null {
  const aVoir = annoncesNouvelles(annonces);
  if (aVoir.length === 0) return null;
  return [...aVoir].sort((a, b) => b.palier - a.palier)[0] ?? null;
}

/* ————————————————— la fente : ouverte sur clic, ou sur une annonce ————————————————— */

let fenteOuverte = false;
const EVENEMENT_FENTE = 'vows:fente';

/** On ouvre la fente : c'est ce que fait le point d'état quand on clique. */
export function ouvrirFente(): void {
  fenteOuverte = true;
  annoncerLeChangement();
}

/** On la referme — les annonces, elles, restent. */
export function fermerFente(): void {
  fenteOuverte = false;
  annoncerLeChangement();
}

function annoncerLeChangement(): void {
  try {
    window.dispatchEvent(new Event(EVENEMENT_FENTE));
  } catch {
    /* pas de fenêtre : personne à prévenir */
  }
}

export function useFenteOuverte(): boolean {
  const [ouvert, setOuvert] = useState(fenteOuverte);

  useEffect(() => {
    const surChangement = () => setOuvert(fenteOuverte);
    window.addEventListener(EVENEMENT_FENTE, surChangement);
    return () => window.removeEventListener(EVENEMENT_FENTE, surChangement);
  }, []);

  return ouvert;
}

/** Le titre du ticket, selon ce qui arrive. */
export function titreDuType(type: TypeAnnonce): string {
  if (type === 'document') return 'Document disponible';
  if (type === 'message') return 'Message reçu';
  return 'Notification';
}

/** Ce que le ticket propose à la personne : garder, valider, négocier. */
export function actionsPossibles(annonce: Annonce): Array<{ id: EtatAnnonce; label: string; aide: string }> {
  const base = [
    { id: 'ecarte' as EtatAnnonce, label: 'Ne pas ouvrir', aide: 'Votre choix est enregistré, et rien ne s’imprime.' },
    { id: 'valide' as EtatAnnonce, label: 'Valider', aide: 'Ça se range dans votre portefeuille, et l’autre est prévenu.' },
  ];
  if (annonce.type === 'notification') return [base[0]!];
  return [...base, { id: 'negocie' as EtatAnnonce, label: 'Négocier', aide: 'Un retour part ; la négociation reste écrite sur le ticket.' }];
}
