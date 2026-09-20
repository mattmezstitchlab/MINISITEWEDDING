import { useEffect, useState } from 'react';
import {
  CircleDot, Mail, Plane, Receipt, Stamp, Sticker, Ticket, type LucideIcon,
} from 'lucide-react';

/**
 * LE RIPPLE — UNE SEULE SAISIE, TOUT SE RÉPERCUTE
 *
 * Le cœur du concept : on entre une information **une seule fois**, au
 * **point zéro**, et elle se propage — ticket, objets de la fabrique,
 * magazine. Comme des éléments préparés une fois qui se répercutent partout
 * en une modification. Le cadran en est le symbole : le point zéro est son
 * centre.
 *
 * Le but : gagner les années perdues à re-rentrer les mêmes informations
 * partout, dans tous les organismes, toutes les recherches — tout ce qui est
 * dispersé se réunit ici, sans doublons.
 */

/* ———————————————————— LE POINT ZÉRO ———————————————————— */

export interface PointZero {
  nom: string;
  jour: string;
  ville: string;
}

const EVENEMENT = 'supermariage:point-zero';

let pointZero: PointZero = { nom: '', jour: '', ville: '' };

export function changerPointZero(partiel: Partial<PointZero>): void {
  pointZero = { ...pointZero, ...partiel };
  prevenir();
}

export function lePointZero(): PointZero {
  return pointZero;
}

export function usePointZero(): PointZero {
  const [etat, setEtat] = useState<PointZero>(pointZero);
  useEffect(() => {
    const surChangement = () => setEtat(pointZero);
    window.addEventListener(EVENEMENT, surChangement);
    return () => window.removeEventListener(EVENEMENT, surChangement);
  }, []);
  return etat;
}

/** Les trois champs du point zéro — tout le reste du site s'en nourrit. */
export const CHAMPS_DU_POINT_ZERO: Array<{ id: keyof PointZero; label: string; indice: string }> = [
  { id: 'nom', label: 'Le nom', indice: 'Prénom, ou les deux prénoms' },
  { id: 'jour', label: 'Le jour', indice: 'La date qui compte' },
  { id: 'ville', label: 'La ville', indice: 'Là où ça se passe' },
];

/** Ce qui manque encore au point zéro. */
export function ceQuiManque(point: PointZero): string[] {
  return CHAMPS_DU_POINT_ZERO.filter((c) => !point[c.id].trim()).map((c) => c.label.toLowerCase());
}

/**
 * L'agent lit le ticket et dit ce qu'il manque — c'est l'aperçu structuré sur
 * lequel il s'appuie pour guider.
 */
export function phraseDeLAgent(point: PointZero): string {
  const manques = ceQuiManque(point);
  if (manques.length === 0) {
    return 'Tout y est : le point zéro peut se propager — le ticket, les objets et le magazine sont à jour.';
  }
  if (manques.length === 1) return `Il manque encore ${manques[0]} pour que tout se propage.`;
  return `Il manque encore ${manques.slice(0, -1).join(', ')} et ${manques[manques.length - 1]} pour que tout se propage.`;
}

/** Le point zéro suffit-il à faire partir le ripple ? */
export function rippleComplet(point: PointZero): boolean {
  return ceQuiManque(point).length === 0;
}

/* ———————————————————— LA FABRIQUE ———————————————————— */

/**
 * Les objets qu'on prépare ici, comme des éléments prêts à partir dans la
 * mise en page : une modification au point zéro se répercute sur chacun.
 * Leur picto choisi sert de **repère signalétique** dans le magazine.
 */
export interface ObjetDeLaFabrique {
  id: string;
  nom: string;
  sens: string;
  pictoParDefaut: string;
}

export const OBJETS_DE_LA_FABRIQUE: ObjetDeLaFabrique[] = [
  { id: 'ticket-caisse', nom: 'Le ticket de caisse', sens: 'L’aperçu structuré de tout ce qui est à vous.', pictoParDefaut: 'recu' },
  { id: 'carte-postale', nom: 'La carte postale', sens: 'Le jour, envoyé : la date et la ville en une image.', pictoParDefaut: 'carte' },
  { id: 'timbre', nom: 'Le timbre', sens: 'Ce qui affranchit : votre nom, en petit, partout.', pictoParDefaut: 'timbre' },
  { id: 'tampon', nom: 'Le tampon', sens: 'La marque qui valide, à l’encre du jour.', pictoParDefaut: 'tampon' },
  { id: 'ticket-spectacle', nom: 'Le ticket spectacle', sens: 'L’entrée : votre place, à votre rang.', pictoParDefaut: 'ticket' },
  { id: 'billet-avion', nom: 'Le billet d’avion', sens: 'Le départ et l’arrivée, le jour dit.', pictoParDefaut: 'avion' },
  { id: 'sticker', nom: 'Le sticker', sens: 'Le picto qui colle partout et sert de repère.', pictoParDefaut: 'sticker' },
];

export interface PictoDuRipple {
  id: string;
  nom: string;
  Icone: LucideIcon;
}

/** Les pictos qu'on peut choisir — ils deviennent les repères du magazine. */
export const PICTOS_DU_RIPPLE: PictoDuRipple[] = [
  { id: 'recu', nom: 'Le reçu', Icone: Receipt },
  { id: 'carte', nom: 'La carte', Icone: Mail },
  { id: 'timbre', nom: 'Le timbre', Icone: Stamp },
  { id: 'tampon', nom: 'Le tampon', Icone: CircleDot },
  { id: 'ticket', nom: 'Le ticket', Icone: Ticket },
  { id: 'avion', nom: 'L’avion', Icone: Plane },
  { id: 'sticker', nom: 'Le sticker', Icone: Sticker },
];

export function pictoDuRipple(id: string): PictoDuRipple {
  return PICTOS_DU_RIPPLE.find((p) => p.id === id) ?? PICTOS_DU_RIPPLE[0]!;
}

/* ———————————————————— LES REPÈRES CHOISIS ———————————————————— */

const EVENEMENT_REPERES = 'supermariage:reperes';

let reperes: Record<string, string> = {};

/** Choisir le picto d'un objet : il devient son repère dans le magazine. */
export function choisirRepere(objetId: string, pictoId: string): void {
  reperes = { ...reperes, [objetId]: pictoId };
  try {
    window.dispatchEvent(new Event(EVENEMENT_REPERES));
  } catch {
    /* pas de fenêtre */
  }
}

export function repereDe(objetId: string): string {
  const objet = OBJETS_DE_LA_FABRIQUE.find((o) => o.id === objetId);
  return reperes[objetId] ?? objet?.pictoParDefaut ?? 'recu';
}

export function useReperes(): Record<string, string> {
  const [etat, setEtat] = useState<Record<string, string>>(reperes);
  useEffect(() => {
    const surChangement = () => setEtat(reperes);
    window.addEventListener(EVENEMENT_REPERES, surChangement);
    return () => window.removeEventListener(EVENEMENT_REPERES, surChangement);
  }, []);
  return etat;
}

/**
 * La preuve du ripple : un champ rempli au point zéro apparaît sur le ticket
 * et sur chaque objet de la fabrique. Un nom saisi = huit endroits mis à jour
 * en une seule saisie.
 */
export function endroitsTouches(point: PointZero): number {
  const rempli = CHAMPS_DU_POINT_ZERO.some((c) => point[c.id].trim());
  return rempli ? 1 + OBJETS_DE_LA_FABRIQUE.length : 0;
}

function prevenir(): void {
  try {
    window.dispatchEvent(new Event(EVENEMENT));
  } catch {
    /* pas de fenêtre */
  }
}
