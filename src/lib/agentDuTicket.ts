import {
  GROUPES_DU_TICKET,
  LIGNES_DU_TICKET,
  catégorieDeLaLigne,
  type CatégorieDuTicket,
  type LigneDuTicket,
} from './categoriesDuTicket';

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
 * L'agent ne décide de rien et n'invente rien : il lit le catalogue du ticket
 * (`CATÉGORIES_DU_TICKET`) et il le range par mots. Les mots qu'il ne connaît
 * pas, il les cherche tels quels ; s'il ne trouve rien du tout, il fait passer
 * le magasin entier, dans l'ordre — jamais d'écran vide.
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
  'cette', 'cet', 'est', 'sont', 'pas', 'oui', 'non', 'merci', 'svp', 'stp',
]);

/** **Les mots d'une demande** : de quoi l'agent se sert pour chercher. */
export function motsDeLaDemande(demande: string): string[] {
  return sansAccent(demande)
    .split(/[^a-z0-9']+/)
    .map((mot) => mot.replace(/'+$/, ''))
    .filter((mot) => mot.length >= 3 && !MOTS_VIDES.has(mot));
}

/**
 * Ce qu'un mot évoque quand le mot exact n'est pas écrit dans le catalogue.
 * Une petite table, écrite à la main : c'est le vocabulaire des mariages.
 */
const ÉVOCATIONS: Record<string, string[]> = {
  diner: ['menu', 'repas', 'table', 'traiteur', 'food', 'plat'],
  repas: ['menu', 'repas', 'table', 'traiteur', 'plat'],
  dejeuner: ['menu', 'repas', 'table', 'brunch'],
  brunch: ['menu', 'brunch', 'repas'],
  cocktail: ['bar', 'boisson', 'cocktail', 'reception'],
  ceremonie: ['ceremonie', 'horaire', 'mairie', 'officiant', 'eglise'],
  mairie: ['mairie', 'ceremonie', 'officiant', 'maire'],
  eglise: ['eglise', 'ceremonie', 'office', 'messe'],
  messe: ['messe', 'eglise', 'ceremonie'],
  photo: ['photo', 'image', 'galerie', 'album', 'cadre', 'souvenir'],
  video: ['video', 'film', 'clip', 'galerie'],
  musique: ['musique', 'dj', 'playlist', 'chanson', 'orchestre', 'acoustique', 'concert', 'groupe'],
  chanson: ['musique', 'playlist', 'chanson', 'concert'],
  fleur: ['fleur', 'bouquet', 'deco', 'centre'],
  deco: ['deco', 'fleur', 'table', 'bougie', 'arche'],
  robe: ['robe', 'tenue', 'style', 'costume', 'look'],
  costume: ['costume', 'tenue', 'style', 'robe'],
  tenue: ['tenue', 'robe', 'costume', 'style'],
  invitation: ['invitation', 'faire-part', 'carton', 'rsvp', 'papeterie'],
  carton: ['invitation', 'faire-part', 'carton', 'papeterie'],
  transport: ['navette', 'transport', 'voiture', 'avion', 'bus', 'taxi'],
  navette: ['navette', 'transport', 'bus', 'voiture'],
  hebergement: ['hebergement', 'hotel', 'chambre', 'nuit', 'gite'],
  hotel: ['hotel', 'hebergement', 'chambre', 'nuit'],
  meteo: ['meteo', 'ciel', 'pluie', 'temps', 'soleil'],
  plan: ['plan', 'itineraire', 'carte', 'adresse', 'lieu'],
  lieu: ['lieu', 'salle', 'domaine', 'adresse', 'plan'],
  salle: ['salle', 'domaine', 'lieu'],
  gateau: ['gateau', 'dessert', 'patisserie', 'piece'],
  dessert: ['dessert', 'gateau', 'patisserie'],
  boisson: ['boisson', 'vin', 'champagne', 'bar', 'cocktail'],
  vin: ['vin', 'champagne', 'boisson', 'bar'],
  souvenir: ['souvenir', 'photo', 'album', 'livre', 'cadre'],
  cadeau: ['cadeau', 'liste', 'boutique', 'shop', 'cagnotte'],
  prestataire: ['metier', 'prestataire', 'equipe', 'pro'],
  metier: ['metier', 'prestataire', 'equipe'],
  budget: ['prix', 'budget', 'total', 'devis', 'tarif'],
  prix: ['prix', 'budget', 'total', 'tarif'],
  timing: ['horaire', 'heure', 'planning', 'minute', 'programme'],
  horaire: ['horaire', 'heure', 'planning', 'programme'],
  programme: ['horaire', 'programme', 'planning'],
  rsvp: ['rsvp', 'reponse', 'confirmation', 'invitation'],
  liste: ['liste', 'invite', 'convive', 'table', 'plan'],
  convive: ['invite', 'convive', 'table', 'liste'],
  enfant: ['enfant', 'kids', 'jeu'],
  'faire-part': ['faire-part', 'invitation', 'papeterie', 'carton'],
  papeterie: ['papeterie', 'invitation', 'faire-part', 'menu', 'marcage'],
  temoin: ['temoin', 'discours', 'allocution'],
  discours: ['discours', 'allocution', 'temoin'],
  danse: ['danse', 'musique', 'ouverture', 'bal'],
  toilette: ['toilette', 'hygiene', 'frais', 'kit'],
  securite: ['securite', 'sante', 'secours', 'kit'],
  jeu: ['jeu', 'animation', 'kids', 'enfant'],
  cadeaux: ['cadeau', 'liste', 'boutique'],
};

/** La tige d'un mot : de quoi attraper les pluriels sans dictionnaire. */
function tige(mot: string): string {
  return mot.length > 5 ? mot.slice(0, 5) : mot;
}

/** Les clés à chercher pour un mot : le mot lui-même, et ce qu'il évoque. */
function clésDuMot(mot: string): string[] {
  return [tige(mot), ...(ÉVOCATIONS[mot] ?? []).map((proche) => tige(proche))];
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
 * hasard. Les clés courtes (« dj », « son », « vin ») doivent tomber juste :
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
  /** Aucun mot n'a rien évoqué : il fait passer le magasin entier. */
  àVide: boolean;
}

/**
 * **Ce que l'agent fait passer.** On lui donne une demande et ce qui est déjà
 * pris ; il rend la file des propositions — d'abord ce qui répond le mieux, et
 * jamais ce qui est déjà sur le ticket.
 */
export function lAgentFaitPasser(demande: string, prises: string[] = []): FileDeLAgent {
  const demandés = motsDeLaDemande(demande);
  const libres = LIGNES_DU_TICKET.filter((l) => !prises.includes(l.id));
  if (demandés.length === 0) return { lignes: libres, mots: [], àVide: true };

  const réponses = libres
    .map((ligne, rang) => ({ ligne, rang, ...réponseDeLaLigne(ligne, demandés) }))
    .filter((r) => r.note > 0)
    .sort((a, b) => b.note - a.note || a.rang - b.rang);

  // Rien trouvé : on ne laisse pas l'écran muet, on fait passer tout le magasin.
  if (réponses.length === 0) return { lignes: libres, mots: demandés, àVide: true };

  const entendus = demandés.filter((mot) => réponses.some((r) => r.entendus.includes(mot)));
  return { lignes: réponses.map((r) => r.ligne), mots: entendus.length ? entendus : demandés, àVide: false };
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
