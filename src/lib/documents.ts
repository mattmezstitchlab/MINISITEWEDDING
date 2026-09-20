import { useEffect, useState } from 'react';

/**
 * LA FENTE — LE TICKET QUI SORT EN HAUT DU SITE
 *
 * Quand quelqu'un demande un document, **une fente apparaît en haut de la page**
 * et un ticket en sort : « Document disponible concernant … ». C'est le principe
 * du bandeau d'intégration continue : on n'ouvre pas une page pour savoir qu'il
 * se passe quelque chose, **on l'annonce là où l'on est**.
 *
 * Une demande vit dans le navigateur (`vows:documents`), comme les avis : rien
 * ne part ailleurs tant qu'il n'y a pas de serveur pour le porter. Chacun ne voit
 * que ce qui le concerne, et rien de ce qui appartient aux autres.
 */

export interface DemandeDeDocument {
  id: string;
  /** Le document visé. */
  document: string;
  /** Qui le demande : un nom, un rôle, un métier. */
  parQui: string;
  /** À qui il est destiné, quand on le sait. */
  pourQui?: string;
  /** « demande » tant qu'on rassemble, « disponible » quand c'est prêt. */
  etat: 'demande' | 'disponible';
  /** Quand la demande a été posée. */
  quand: string;
}

const CLE = 'vows:documents';
const EVENEMENT = 'vows:documents-change';

/** Toutes les demandes connues de ce navigateur. */
export function chargerDemandes(): DemandeDeDocument[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const brut = localStorage.getItem(CLE);
    const lu = brut ? (JSON.parse(brut) as DemandeDeDocument[]) : [];
    return Array.isArray(lu) ? lu : [];
  } catch {
    return [];
  }
}

function ecrire(demandes: DemandeDeDocument[]): void {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(CLE, JSON.stringify(demandes));
    window.dispatchEvent(new Event(EVENEMENT));
  } catch {
    /* pas de fenêtre : personne à prévenir */
  }
}

/** Poser une demande : la fente s'ouvre, et le ticket sort. */
export function demanderDocument(document: string, parQui: string, pourQui?: string): DemandeDeDocument {
  const demande: DemandeDeDocument = {
    id: `demande-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    document,
    parQui,
    pourQui,
    etat: 'demande',
    quand: new Date().toISOString(),
  };
  ecrire([demande, ...chargerDemandes()].slice(0, 12));
  return demande;
}

/** Le document est prêt : la fente annonce « disponible ». */
export function marquerDisponible(id: string): void {
  ecrire(chargerDemandes().map((d) => (d.id === id ? { ...d, etat: 'disponible' as const } : d)));
}

/** On ferme la fente : la demande reste, mais ne s'annonce plus. */
export function oublierDemande(id: string): void {
  ecrire(chargerDemandes().filter((d) => d.id !== id));
}

/** Les demandes, telles qu'un composant les suit. */
export function useDemandes(): DemandeDeDocument[] {
  const [demandes, setDemandes] = useState<DemandeDeDocument[]>(() => chargerDemandes());

  useEffect(() => {
    const surChangement = () => setDemandes(chargerDemandes());
    window.addEventListener(EVENEMENT, surChangement);
    surChangement();
    return () => window.removeEventListener(EVENEMENT, surChangement);
  }, []);

  return demandes;
}

/** La demande qui s'annonce en haut : la plus récente. */
export function annonceDuJour(demandes: DemandeDeDocument[]): DemandeDeDocument | null {
  return demandes[0] ?? null;
}
