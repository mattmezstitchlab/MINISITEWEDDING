import {
  GROUPES_DU_TICKET,
  LIGNES_DU_TICKET,
  catégorieDeLaLigne,
  type CatégorieDuTicket,
  type LigneDuTicket,
} from './categoriesDuTicket';
/* L'agent écrit sur **ce papier-ci** : le tri du ticket le lie aussi. */
import { LIGNES_DU_SITE, estAdministrative } from './triDuTicket';

/* L'AGENT DU TICKET — ELLE PASSE LES CHOSES À L'ÉCRAN, ON VALIDE OU NON
 *
 * Il n'y a plus de liste à parcourir, plus de page à faire défiler : **tout ce
 * qui se coche arrive par l'écran de la machine**. Deux façons de le faire
 * venir :
 *
 * 1. **on appuie sur une famille** — le jour J, votre site, les documents — et
 *    l'agent fait passer ses lignes, une par une ;
 * 2. **on écrit ce qu'on veut** dans le champ — « un dîner pour vingt », « la
 *    cérémonie », « des photos » — et l'agent ne fait passer que ce qui répond.
 *
 * Dans les deux cas, la même chose se passe en face : **une proposition à
 * l'écran, et deux touches — ✓ on valide, ✗ on passe.** Rien d'autre.
 *
 * Quand aucun mot ne répond, l'agent **ne fait pas défiler tout le magasin**
 * (c'est bête, et ça décourage) : il le dit, et il propose **les familles** —
 * les trois boutons ronds qui sont juste sous l'écran.
 *
 * L'agent ne décide de rien et n'invente rien : il lit le catalogue du ticket
 * (`CATÉGORIES_DU_TICKET`) et il le range par mots. Les mots qu'il ne connaît
 * pas, il les cherche tels quels ; ceux qu'il connaît, il les traduit par ce
 * qu'ils évoquent dans ce magasin-là.
 */

/** Un mot, ramené à sa forme comparable : sans accent, sans ponctuation. */
export function sansAccent(texte: string): string {
  return texte
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/** Les mots vides : ils ne disent rien de ce qu'on veut. */
const MOTS_VIDES = new Set([
  'les', 'des', 'une', 'uns', 'unes', 'pour', 'avec', 'dans', 'sur', 'aux', 'que', 'qui',
  'mais', 'donc', 'alors', 'aussi', 'plus', 'moins', 'tres', 'bien', 'tout', 'tous', 'toute',
  'nous', 'vous', 'ils', 'elles', 'mon', 'ton', 'son', 'mes', 'tes', 'ses', 'notre', 'votre',
  'je', 'tu', 'il', 'elle', 'on', 'veux', 'voudrais', 'faut', 'aimerais', 'cherche', 'avoir',
  'etre', 'faire', 'par', 'a', 'au', 'du', 'de', 'la', 'le', 'en', 'et', 'ou', 'un', 'ce',
  'cette', 'cet', 'est', 'sont', 'pas', 'oui', 'non', 'merci', 'svp', 'stp', 'avec', 'sans',
  'chez', 'vers', 'puis', 'aussi', 'meme', 'genre', 'truc', 'chose', 'besoin', 'envie',
]);

/**
 * **Les mots d'une demande** : écrits **comme on les a écrits** (l'écran les
 * montre tels quels), mais comparés sans accent et sans majuscules.
 */
export function motsDeLaDemande(demande: string): string[] {
  return demande
    .split(/[^A-Za-z0-9À-ÿ'’-]+/)
    .map((mot) => mot.replace(/^['’-]+|['’-]+$/g, ''))
    .filter((mot) => mot.length >= 3 && !MOTS_VIDES.has(sansAccent(mot)));
}

/**
 * **Ce que les mots veulent dire, dans ce magasin.** Une table écrite à la
 * main : le vocabulaire des mariages, traduit dans celui du supermarché. C'est
 * elle qui fait qu'on ne repart pas les mains vides en demandant une robe.
 */
const ÉVOCATIONS: Record<string, string[]> = {
  /* Manger, boire */
  diner: ['menu', 'repas', 'table', 'traiteur', 'chef', 'plat'],
  dejeuner: ['menu', 'repas', 'table', 'brunch'],
  repas: ['menu', 'repas', 'table', 'traiteur', 'chef', 'plat', 'banquet'],
  banquet: ['menu', 'repas', 'table', 'chef', 'traiteur'],
  buffet: ['menu', 'repas', 'table', 'traiteur'],
  menu: ['menu', 'repas', 'table', 'traiteur'],
  traiteur: ['traiteur', 'chef', 'cuisine', 'menu'],
  cuisine: ['chef', 'cuisine', 'traiteur', 'menu'],
  brunch: ['brunch', 'menu', 'repas'],
  cocktail: ['cocktail', 'bar', 'boisson', 'mixologue', 'bulles'],
  boisson: ['boisson', 'bar', 'cocktail', 'bière', 'mixologue', 'bulles'],
  vin: ['vin', 'boisson', 'bar', 'bulles', 'cocktail'],
  champagne: ['bulles', 'vin', 'cocktail', 'bar', 'boisson'],
  biere: ['bière', 'bar', 'boisson'],
  bar: ['bar', 'cocktail', 'mixologue', 'bulles', 'bière'],
  gateau: ['gateau', 'dessert', 'patisserie', 'pièce'],
  dessert: ['dessert', 'gateau', 'patisserie', 'pièce'],
  dragees: ['dragée', 'bonbon', 'candy', 'petits prix'],
  bonbon: ['bonbon', 'candy', 'dragée'],

  /* La cérémonie */
  ceremonie: ['ceremonie', 'célébrant', 'rituel', 'mairie', 'horaire', 'coordination'],
  mairie: ['mairie', 'célébrant', 'rituel', 'ceremonie', 'elopement'],
  maire: ['mairie', 'célébrant', 'rituel', 'elopement'],
  civil: ['mairie', 'célébrant', 'rituel'],
  eglise: ['célébrant', 'rituel', 'ceremonie', 'laïque'],
  messe: ['messe', 'rituel', 'célébrant'],
  benediction: ['rituel', 'célébrant', 'laïque'],
  officiant: ['célébrant', 'rituel', 'elopement'],
  celebrant: ['célébrant', 'rituel', 'laïque'],
  rituel: ['rituel', 'célébrant', 'laïque', 'païen'],
  elopement: ['elopement', 'rituel', 'désert', 'célébrant'],
  discours: ['discours', 'allocution', 'témoin', 'horaire'],
  temoin: ['témoin', 'discours', 'horaire'],
  allocution: ['allocution', 'discours', 'horaire'],
  vœux: ['rituel', 'célébrant', 'ceremonie'],
  voeux: ['rituel', 'célébrant', 'ceremonie'],

  /* Les images et les sons */
  photo: ['photo', 'image', 'galerie', 'album', 'cinéaste', 'vidéo'],
  photographe: ['photographe', 'photo', 'image'],
  photobooth: ['photo', 'image', 'pop-flash', 'cabine'],
  portrait: ['photo', 'image', 'portrait', 'album'],
  image: ['image', 'photo', 'galerie', 'album'],
  video: ['vidéo', 'cinéaste', 'film', 'galerie', 'super 8'],
  film: ['cinéaste', 'vidéo', 'film'],
  drone: ['cinéaste', 'vidéo', 'image'],
  album: ['album', 'photo', 'galerie', 'souvenir'],
  musique: ['musique', 'dj', 'playlist', 'orchestre', 'groupe', 'acoustique', 'accordéon'],
  chanson: ['musique', 'playlist', 'groupe', 'accordéon'],
  orchestre: ['orchestre', 'groupe', 'musique', 'jazz'],
  groupe: ['groupe', 'musique', 'orchestre', 'rock'],
  dj: ['dj', 'musique', 'playlist', 'son'],
  playlist: ['playlist', 'musique', 'dj'],
  sono: ['acousticien', 'régie', 'son', 'technique'],
  son: ['acousticien', 'régie', 'son'],
  lumiere: ['technique', 'régie', 'logistique', 'néon'],
  eclairage: ['technique', 'régie', 'logistique', 'néon'],
  danse: ['musique', 'bal', 'ouverture', 'dj'],

  /* Les fleurs, la table, le décor */
  fleur: ['fleur', 'fleuriste', 'botaniste', 'jardin'],
  fleuriste: ['fleuriste', 'fleur', 'botaniste'],
  bouquet: ['bouquet', 'fleur', 'fleuriste', 'botaniste'],
  deco: ['décoration', 'scénographie', 'création', 'céramiste', 'mobilier', 'chineur'],
  decoration: ['décoration', 'scénographie', 'création', 'céramiste', 'mobilier'],
  arche: ['scénographie', 'décoration', 'création'],
  table: ['table', 'mobilier', 'chineur', 'céramiste'],
  mobilier: ['mobilier', 'chineur', 'céramiste', 'table'],
  nappe: ['mobilier', 'table', 'chineur'],
  vaisselle: ['céramiste', 'mobilier', 'table'],
  lumiere_ambiance: ['scénographie', 'décoration', 'néon'],
  robe: ['création', 'scénographie', 'chineur', 'mobilier'],
  tenue: ['création', 'scénographie', 'chineur', 'mobilier'],
  tenues: ['création', 'scénographie', 'chineur', 'mobilier'],
  costume: ['création', 'scénographie', 'chineur', 'mobilier'],
  style: ['création', 'scénographie', 'mode'],
  coiffeur: ['création', 'scénographie'],
  coiffure: ['création', 'scénographie'],
  maquillage: ['création', 'scénographie'],
  beaute: ['création', 'scénographie'],
  alliance: ['cadeau', 'souvenir', 'petit', 'gravé'],
  bague: ['cadeau', 'souvenir', 'petit', 'gravé'],
  bijou: ['cadeau', 'souvenir', 'petit', 'gravé'],

  /* Le lieu, le jour, le temps */
  lieu: ['lieu', 'salle', 'domaine', 'plan', 'itinéraire', 'adresse'],
  salle: ['salle', 'lieu', 'domaine', 'espaces'],
  domaine: ['domaine', 'salle', 'lieu'],
  plan: ['plan', 'itinéraire', 'carte', 'adresse', 'lieu'],
  itineraire: ['itinéraire', 'plan', 'carte', 'adresse'],
  adresse: ['adresse', 'plan', 'lieu', 'itinéraire'],
  carte: ['carte', 'plan', 'itinéraire'],
  horaire: ['horaire', 'heure', 'planning', 'programme'],
  heure: ['horaire', 'heure', 'planning'],
  planning: ['planning', 'horaire', 'programme'],
  programme: ['programme', 'horaire', 'planning'],
  meteo: ['météo', 'ciel', 'soleil', 'pluie'],
  temps: ['météo', 'horaire', 'ciel'],
  saison: ['météo', 'magazine', 'saison'],

  /* Les gens, les transports, la logistique */
  transport: ['navette', 'transport', 'chauffeur', 'limousine', 'affréteur', 'ferroviaire', 'pilote'],
  navette: ['navette', 'transport', 'chauffeur', 'limousine'],
  voiture: ['chauffeur', 'limousine', 'navette', 'affréteur', 'transport'],
  parking: ['parking', 'lieu', 'technique', 'logistique'],
  taxi: ['chauffeur', 'limousine', 'navette'],
  train: ['affréteur', 'ferroviaire', 'transport'],
  avion: ['avion', 'billet', 'pilote', 'voyage', 'départ'],
  voyage: ['voyage', 'avion', 'départ', 'pilote', 'canot'],
  hebergement: ['hébergement', 'attestation', 'hôtel', 'visa'],
  hotel: ['hébergement', 'attestation', 'hôtel'],
  logement: ['hébergement', 'attestation', 'hôtel'],
  visa: ['visa', 'invitation', 'attestation', 'hébergement'],
  invite: ['invité', 'convive', 'liste', 'table', 'invitation'],
  convive: ['convive', 'invité', 'liste', 'table'],
  liste: ['liste', 'invité', 'convive', 'table'],
  enfant: ['enfant', 'jeu', 'kids', 'animation', 'petit', 'cabine', 'photobooth'],
  enfants: ['enfant', 'jeu', 'kids', 'petit', 'cabine'],
  jeux: ['jeu', 'animation', 'kids', 'cabine'],
  enfantillage: ['jeu', 'kids', 'cabine'],
  menage: ['logistique', 'technique', 'régie', 'espaces'],
  nettoyage: ['logistique', 'technique', 'régie'],
  rangement: ['logistique', 'technique', 'régie'],
  securite: ['sécurité', 'assurance', 'plongée', 'secours'],
  secours: ['sécurité', 'secours', 'assurance'],
  assurance: ['assurance', 'attestation', 'responsabilité'],
  coordination: ['coordination', 'planner', 'régisseur', 'agence'],
  organisation: ['coordination', 'planner', 'régisseur', 'agence'],
  planner: ['planner', 'coordination', 'agence'],
  wedding: ['planner', 'coordination', 'agence'],
  regie: ['régie', 'régisseur', 'technique', 'logistique'],
  technique: ['technique', 'régie', 'logistique'],
  logistique: ['logistique', 'technique', 'régisseur'],
  equipement: ['technique', 'régie', 'logistique'],

  /* Le site, les papiers, l'argent */
  site: ['site', 'bloc', 'module', 'votre site'],
  page: ['site', 'bloc', 'module'],
  mini: ['site', 'bloc', 'module'],
  rsvp: ['rsvp', 'réponse', 'confirmation', 'invitation'],
  reponse: ['rsvp', 'réponse', 'confirmation'],
  invitation: ['invitation', 'faire-part', 'carton', 'papeterie', 'visa'],
  papeterie: ['papeterie', 'invitation', 'faire-part', 'menu', 'marcage'],
  fairepart: ['faire-part', 'invitation', 'papeterie', 'carton'],
  carton: ['carton', 'faire-part', 'invitation', 'papeterie'],
  document: ['document', 'attestation', 'justificatif', 'papier'],
  documents: ['document', 'attestation', 'justificatif', 'papier'],
  papier: ['papeterie', 'document', 'attestation', 'justificatif'],
  papiers: ['papeterie', 'document', 'attestation', 'justificatif'],
  administration: ['attestation', 'justificatif', 'document', 'préfecture'],
  attestation: ['attestation', 'justificatif', 'document'],
  justificatif: ['justificatif', 'attestation', 'document'],
  prix: ['prix', 'tarif', 'budget', 'total', 'choc'],
  tarif: ['tarif', 'prix', 'budget', 'devis'],
  budget: ['budget', 'prix', 'tarif', 'total'],
  cout: ['prix', 'tarif', 'budget', 'total'],
  devis: ['devis', 'tarif', 'prix', 'budget'],
  argent: ['prix', 'tarif', 'budget', 'total'],
  cadeau: ['cadeau', 'liste', 'souvenir', 'boutique', 'petit'],
  cadeaux: ['cadeau', 'liste', 'souvenir', 'boutique', 'petit'],
  souvenir: ['souvenir', 'album', 'livre', 'magazine', 'photo'],
  memoire: ['souvenir', 'album', 'livre', 'magazine'],
  livre: ['livre', 'album', 'magazine', 'souvenir'],
  magazine: ['magazine', 'album', 'souvenir', 'livre'],
  boutique: ['boutique', 'cadeau', 'souvenir', 'shop'],
};

/** La tige d'un mot : de quoi attraper les pluriels sans dictionnaire. */
function tige(mot: string): string {
  return mot.length > 5 ? mot.slice(0, 5) : mot;
}

/**
 * Les clés à chercher pour un mot : le mot lui-même, et ce qu'il évoque.
 * Le singulier est essayé aussi — « les tenues » doit trouver « tenue ».
 */
function clésDuMot(mot: string): string[] {
  const nu = sansAccent(mot);
  const simple = nu.endsWith('s') ? nu.slice(0, -1) : nu;
  const évoqués = ÉVOCATIONS[nu] ?? ÉVOCATIONS[simple] ?? [];
  return [tige(nu), ...évoqués.map((proche) => tige(sansAccent(proche)))];
}

/** Les jetons d'un texte : ses mots, ramenés à leur forme comparable. */
function jetons(texte: string): string[] {
  return sansAccent(texte).split(/[^a-z0-9]+/).filter(Boolean);
}

/** Le foin d'une ligne : ses mots, et les mots de sa catégorie. */
function foinDeLaLigne(ligne: LigneDuTicket): string[] {
  const catégorie = catégorieDeLaLigne(ligne.id);
  return jetons([ligne.label, ligne.detail, ligne.id, catégorie?.mot ?? '', catégorie?.titre ?? ''].join(' · '));
}

/**
 * Une clé est là quand un mot commence par elle — pluriels compris, sans
 * hasard. Les clés courtes (« dj », « bar », « son ») doivent tomber juste :
 * trois lettres qui traînent dans un mot, c'est du bruit, pas une réponse.
 */
function dedans(jetonsDuFoin: string[], clé: string): boolean {
  return clé.length < 4
    ? jetonsDuFoin.includes(clé)
    : jetonsDuFoin.some((jeton) => jeton.startsWith(clé));
}

/** **La réponse d'une ligne à une demande** : sa note, et les mots entendus. */
function réponseDeLaLigne(ligne: LigneDuTicket, mots: string[]): { note: number; entendus: string[] } {
  const foin = foinDeLaLigne(ligne);
  const nom = jetons(ligne.label);
  const entendus = mots.filter((mot) => clésDuMot(mot).some((clé) => dedans(foin, clé)));
  // Le mot dans le nom de la ligne compte plus que le mot dans sa phrase.
  const note = entendus.reduce((n, mot) => n + (clésDuMot(mot).some((clé) => dedans(nom, clé)) ? 3 : 1), 0);
  return { note, entendus };
}

/** Le mot de la demande qui a fait venir la ligne — c'est ce que l'écran dit. */
export function motifDeLaLigne(ligne: LigneDuTicket, mots: string[]): string | null {
  return réponseDeLaLigne(ligne, mots).entendus[0] ?? null;
}

/** Ce que l'agent fait passer à l'écran, et pourquoi. */
export interface FileDeLAgent {
  /** Les lignes, dans l'ordre où l'agent les présente : une par écran. */
  lignes: LigneDuTicket[];
  /** Les mots de la demande qu'il a vraiment entendus. */
  mots: string[];
  /** Aucun mot n'a rien évoqué : il n'y a pas de ligne à proposer. */
  àVide: boolean;
}

/**
 * **Ce que l'agent fait passer.** On lui donne une demande et ce qui est déjà
 * pris ; il rend la file des propositions — d'abord ce qui répond le mieux, et
 * jamais ce qui est déjà sur le ticket.
 *
 * Rien trouvé : la file est **vide**, et `àVide` est vrai. La machine propose
 * alors les **familles** — pas les 99 lignes.
 */
export function lAgentFaitPasser(demande: string, prises: string[] = []): FileDeLAgent {
  const mots = motsDeLaDemande(demande);
  const libres = LIGNES_DU_TICKET.filter((l) => !prises.includes(l.id));
  if (mots.length === 0) return { lignes: [], mots: [], àVide: true };

  const réponses = libres
    .map((ligne, rang) => ({ ligne, rang, ...réponseDeLaLigne(ligne, mots) }))
    .filter((r) => r.note > 0)
    .sort((a, b) => b.note - a.note || a.rang - b.rang);

  if (réponses.length === 0) return { lignes: [], mots, àVide: true };

  const entendus = mots.filter((mot) => réponses.some((r) => r.entendus.includes(mot)));
  return { lignes: réponses.map((r) => r.ligne), mots: entendus.length ? entendus : mots, àVide: false };
}

/**
 * **Ce qu'une famille fait passer** : ses lignes, dans l'ordre du catalogue, et
 * seulement celles qui ne sont pas déjà prises.
 */
export function fileDeLaFamille(groupe: CatégorieDuTicket['groupe'], prises: string[] = []): LigneDuTicket[] {
  return LIGNES_DU_TICKET.filter(
    (l) => !prises.includes(l.id) && catégorieDeLaLigne(l.id)?.groupe === groupe,
  );
}

/** Le mot d'une famille, tel qu'il s'écrit sur l'écran. */
export function motDeLaFamille(groupe: CatégorieDuTicket['groupe']): string {
  return GROUPES_DU_TICKET.find((g) => g.id === groupe)?.mot ?? 'LE JOUR J';
}

/** Ce que la famille promet, en trois mots — c'est ce que l'écran ajoute. */
export function sousDeLaFamille(groupe: CatégorieDuTicket['groupe']): string {
  return GROUPES_DU_TICKET.find((g) => g.id === groupe)?.sous ?? '';
}

/** L'ordre des familles, tel qu'on les propose : le jour J d'abord. */
export const ORDRE_DES_FAMILLES: Array<CatégorieDuTicket['groupe']> = GROUPES_DU_TICKET.map((g) => g.id);

/* ——————————————————— LA GÉNÉRATION : CE QUE L'AGENT ÉCRIT ———————————————————
 *
 * « Et au début juste un champ de saisie avec un agent agentic, et tout se
 * saisit lettre par lettre pendant la génération. »
 *
 * L'agent ne remplit plus un écran de propositions : il **écrit sur le papier**.
 * Deux règles, et elles tiennent tout :
 *
 * 1. **il n'écrit que ce que le papier imprime** — jamais une pièce
 *    administrative (elles sont hors ticket), jamais une ligne du mini-site (il
 *    n'existe plus). L'agent lit le catalogue, mais il écrit sur ce papier-ci :
 *    il ne propose donc que les 48 lignes imprimées ;
 * 2. **il écrit court** — cinq lignes par génération. On regarde ce qui arrive,
 *    et on relance : c'est plus lisible que trente lignes d'un coup.
 */

/** Combien de lignes l'agent écrit d'un coup. */
export const COMBIEN_PAR_GÉNÉRATION = 5;

/** **Ce que le papier imprime** : ni l'administratif, ni le site. */
export function lignesImprimables(): LigneDuTicket[] {
  return LIGNES_DU_TICKET.filter((l) => estImprimable(l.id));
}

/** Une ligne s'écrit-elle sur ce papier-ci ? */
export function estImprimable(id: string): boolean {
  return !estAdministrative(id) && !LIGNES_DU_SITE.includes(id);
}

/**
 * **La génération** : ce que l'agent écrit sur le ticket, dans l'ordre — les
 * cinq premières lignes qui répondent à la demande, et rien d'autre.
 */
export function laGénération(demande: string, prises: string[] = []): FileDeLAgent {
  const file = lAgentFaitPasser(demande, prises);
  const lignes = file.lignes.filter((l) => estImprimable(l.id)).slice(0, COMBIEN_PAR_GÉNÉRATION);
  return { lignes, mots: file.mots, àVide: lignes.length === 0 };
}

/* ——————————————————— LES ORDRES DE L'AGENT ———————————————————
 *
 * « Je dirais d'implémenter tout ce qui existe et possible pour juste le
 * demander à l'agent. » Un seul champ, et l'agent fait le reste : il écrit des
 * lignes du magasin, il **ouvre une opération** (devis, facture, note, import)
 * ou il **tourne le papier** (la face du client, celle de l'émetteur).
 *
 * Ce qu'il reconnaît, dans l'ordre — le plus précis d'abord :
 *
 *   1. « vue client » / « côté client »   → on regarde le papier de l'autre côté ;
 *   2. « devis 300 € pour Jean »          → une opération, avec son prix ;
 *   3. « des photos », « un dîner »       → les lignes du magasin (48 lignes).
 */

import { lOpération, type LOpération } from './lesOpérations';

export type LOrdreDeLAgent =
  | { genre: 'lignes'; lignes: LigneDuTicket[]; mots: string[] }
  | { genre: 'opération'; opération: LOpération }
  | { genre: 'face'; face: 'emetteur' | 'client' }
  | { genre: 'rien' };

/** Ce que l'agent entend quand on lui parle du papier lui-même. */
const LA_VUE = /\b(?:vue|cote|face|regarde|montre|tourne)\b[^a-z]{0,4}\b(client|emetteur)\b/;
const VERS_LE_CLIENT = /\b(?:au|pour le|chez le)\s+client\b/;
/** Les mots qui disent « ce n'est pas une ligne du magasin, c'est une pièce ». */
const UNE_PIÈCE = /\b(devis|estimation|facture|facturation|note de frais|memoire|note|import|importer|document|doc|piece jointe|recu|justificatif|pdf|capture|scan)\b/;
/** Sauf que « des photos » ou « un document » restent des lignes du magasin. */
const DU_MAGASIN = /\b(?:des|du|de la|un|une)\s+(?:photos?|documents?|pdf|videos?|musique|repas|enfants?|temoins?|dj|rsvp|decorations?|fleurs?|menus?)\b/;

/**
 * **Ce que l'agent fait d'une phrase.** Il rend **un** ordre — celui qui compte —
 * et le champ n'a plus qu'à l'exécuter.
 */
export function lesOrdresDeLAgent(demande: string, prises: string[] = [], combienDOpérations = 0): LOrdreDeLAgent {
  const doux = sansAccent(demande.toLowerCase()).trim();
  if (doux.length < 3) return { genre: 'rien' };

  // 1. On tourne le papier : la face du client, ou la nôtre.
  const vue = doux.match(LA_VUE);
  if (vue) return { genre: 'face', face: vue[1] === 'client' ? 'client' : 'emetteur' };
  if (VERS_LE_CLIENT.test(doux)) return { genre: 'face', face: 'client' };

  // 2. Une opération — quand la phrase dit de quel genre, et que ce n'est pas
  //    une ligne du magasin qu'on demande.
  if (UNE_PIÈCE.test(doux) && !DU_MAGASIN.test(doux)) {
    const opération = lOpération(demande, `op-${combienDOpérations + 1}`);
    if (opération) return { genre: 'opération', opération };
  }

  // 3. Les lignes du magasin.
  const file = laGénération(demande, prises);
  if (file.lignes.length) return { genre: 'lignes', lignes: file.lignes, mots: file.mots };
  return { genre: 'rien' };
}
