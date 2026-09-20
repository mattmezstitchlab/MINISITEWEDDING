import { useCallback, useEffect, useRef, useState } from 'react';
import { apiGet, apiSend } from './http';
import { appliquerGeste, gestesDuRecu, invitesAuComptoir, type Geste } from './liveRules';
import { isRemote } from './dataSource';
import {
  chargerTerminal, decoderRecu, enregistrerTerminal, TERMINAL_VIDE, type EtatTerminal,
} from './weddingTicket';

/**
 * LE COMPTOIR EN DIRECT
 *
 * La page « le mariage, en entier » est ouverte à tout le monde : le couple y
 * prépare, les invités y prennent leurs lignes et demandent leurs morceaux. Ce
 * fichier est le lien entre les deux — il envoie les gestes au comptoir
 * partagé (`/api/wedding-live`, ou sa version dans le navigateur quand aucune
 * base n'est branchée) et relit l'état à intervalle régulier, pour que la page
 * des mariés se remplisse **sans que personne ne rafraîchisse quoi que ce soit**.
 *
 * Ce qui est écrit ici reste vrai dans les deux cas : sans base, le comptoir est
 * celui du navigateur et l'indicateur le dit (« Sur cet appareil »).
 */

/** Toutes les quinze secondes, on relit le comptoir. */
const PERIODE = 15_000;

export interface ReponseLive {
  style_id: string;
  payload: EtatTerminal;
  updated_at: string | null;
  invites?: string[];
  applique?: boolean;
}

/** Lit le comptoir partagé d'un univers. Retourne `null` si on n'y arrive pas. */
export async function chargerLive(styleId: string): Promise<EtatTerminal | null> {
  try {
    const res = await apiGet<ReponseLive>(`/api/wedding-live?style_id=${encodeURIComponent(styleId)}`);
    return res?.payload ?? TERMINAL_VIDE;
  } catch {
    return null;
  }
}

/** Envoie un geste, et retourne l'état du comptoir tel qu'il est après. */
export async function envoyerGeste(styleId: string, geste: Geste): Promise<EtatTerminal | null> {
  try {
    const res = await apiSend<ReponseLive>('/api/wedding-live', 'POST', { style_id: styleId, geste });
    return res?.payload ?? null;
  } catch {
    return null;
  }
}

/** Remet le comptoir à zéro — les mariés, depuis leur page. */
export async function remettreAZero(styleId: string): Promise<EtatTerminal | null> {
  try {
    const res = await apiSend<ReponseLive>('/api/wedding-live', 'PUT', {
      style_id: styleId,
      payload: TERMINAL_VIDE,
    });
    return res?.payload ?? null;
  } catch {
    return null;
  }
}

export interface ComptoirLive {
  etat: EtatTerminal;
  /** Le nombre d'invités passés au comptoir. */
  invites: string[];
  /** Vrai quand une base partagée répond. */
  partage: boolean;
  /** Faux tant que la première lecture n'est pas revenue. */
  pret: boolean;
  /** On applique le geste tout de suite, et on l'envoie. */
  geste: (g: Geste) => void;
  /** On relit le comptoir à la main (bouton « Rafraîchir »). */
  rafraichir: () => void;
  /** Le comptoir vidé, chez tout le monde. */
  remettreAZero: () => void;
}

/**
 * L'état du comptoir pour un univers : lu au montage, relu toutes les quinze
 * secondes, et à chaque retour sur l'onglet. Chaque geste part au serveur ; le
 * navigateur l'applique en même temps pour que le clic réponde sans attendre.
 */
export function useComptoir(styleId: string, codeRecu?: string | null): ComptoirLive {
  const [etat, setEtat] = useState<EtatTerminal>(() => chargerTerminal(styleId));
  const [invites, setInvites] = useState<string[]>([]);
  const [partage, setPartage] = useState(false);
  const [pret, setPret] = useState(false);
  const reveille = useRef(true);
  const enAttente = useRef<Geste[]>([]);

  /** Un état reçu du serveur : on l'adopte, et on le garde pour ce navigateur. */
  const adopter = useCallback(
    (recu: EtatTerminal) => {
      setEtat(recu);
      setInvites(invitesAuComptoir(recu));
      enregistrerTerminal(recu, styleId);
    },
    [styleId],
  );

  /** On relit : les gestes en souffrance repartent d'abord, dans l'ordre. */
  const rafraichir = useCallback(() => {
    reveille.current = true;
    void (async () => {
      while (enAttente.current.length > 0) {
        const geste = enAttente.current[0]!;
        const suivant = await envoyerGeste(styleId, geste);
        if (!suivant) break;
        enAttente.current.shift();
        adopter(suivant);
      }
      const etatServeur = await chargerLive(styleId);
      setPret(true);
      if (etatServeur) {
        setPartage(true);
        adopter(etatServeur);
      } else {
        setPartage(false);
      }
    })();
  }, [adopter, styleId]);

  // La première lecture, puis la relecture régulière et au retour sur l'onglet.
  // Un reçu qui arrive par son lien entre dans la file : le premier envoi le
  // dépose au comptoir (et le serveur ne le comptera jamais deux fois).
  useEffect(() => {
    if (codeRecu) {
      const recu = decoderRecu(codeRecu);
      if (recu) for (const g of gestesDuRecu(recu, codeRecu)) enAttente.current.push(g);
    }
    rafraichir();
    const minuteur = window.setInterval(() => {
      if (document.visibilityState === 'visible') rafraichir();
    }, PERIODE);
    const surReveil = () => rafraichir();
    document.addEventListener('visibilitychange', surReveil);
    window.addEventListener('focus', surReveil);
    return () => {
      window.clearInterval(minuteur);
      document.removeEventListener('visibilitychange', surReveil);
      window.removeEventListener('focus', surReveil);
    };
  }, [rafraichir, codeRecu]);

  /** Le geste : appliqué ici tout de suite, envoyé au comptoir juste après. */
  const geste = useCallback(
    (g: Geste) => {
      setEtat((prec) => {
        const suivant = appliquerGeste(prec, g) ?? prec;
        if (suivant !== prec) {
          setInvites(invitesAuComptoir(suivant));
          enregistrerTerminal(suivant, styleId);
        }
        return suivant;
      });
      enAttente.current.push(g);
      void (async () => {
        while (enAttente.current.length > 0) {
          const suivant = await envoyerGeste(styleId, enAttente.current[0]!);
          if (!suivant) return;
          enAttente.current.shift();
          setPartage(true);
          adopter(suivant);
        }
      })();
    },
    [adopter, styleId],
  );

  const vider = useCallback(() => {
    enAttente.current = [];
    setEtat(TERMINAL_VIDE);
    setInvites([]);
    enregistrerTerminal(TERMINAL_VIDE, styleId);
    void remettreAZero(styleId).then((suivant) => {
      if (suivant) adopter(suivant);
    });
  }, [adopter, styleId]);

  return { etat, invites, partage, pret, geste, rafraichir, remettreAZero: vider };
}

/** La phrase de l'indicateur : d'où vient ce qu'on lit. */
export function etatDuComptoir(partage: boolean, invites: number): string {
  if (!partage) return isRemote() ? 'Comptoir hors ligne · sur cet appareil' : 'Sur cet appareil';
  if (invites === 0) return 'En direct';
  return `En direct · ${invites} invité${invites > 1 ? 's' : ''} au comptoir`;
}
