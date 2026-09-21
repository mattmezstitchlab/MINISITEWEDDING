import { sansAccent } from './agentDuTicket';

/* LES OPÉRATIONS — CE QUI ARRIVE SUR LE TICKET APRÈS COUP
 *
 * « Faudrait un champ avec option et un + pour créer une opération ou autre. »
 * Et l'idée qui va avec : **le ticket est évolutif** — quelqu'un paie, ça arrive
 * sur le ticket ; et de son côté, c'est rangé en facture et en reçu. Un devis,
 * pareil. Rien à préparer : les clients se le procurent tout seuls.
 *
 * Une opération, c'est donc **une ligne qui n'était pas au magasin** : elle
 * vient de la vie (un devis, une facture, un mot, un papier qu'on importe), et
 * elle se pose sur le papier avec les autres. Elle peut porter :
 *
 *   - un **prix** (trois cents euros) ;
 *   - un **qui** (pour Jean) ;
 *   - une **note** — et la note est **privée par défaut** : sur un ticket
 *     groupé, tout le monde ne voit pas tout. C'est la règle neuf du tri
 *     (« ce qui est à part se met à part ») appliquée à la ligne, pas au site.
 *
 * L'agent sait aussi les écrire tout seul : « devis 300 € pour Jean » fabrique
 * l'opération, sans passer par le +.
 */

/** Les cinq opérations du +. */
export type GenreDopération = 'ligne' | 'devis' | 'facture' | 'note' | 'import';

export interface LOpération {
  /** Son identifiant : stable, jamais deux fois le même sur un ticket. */
  id: string;
  genre: GenreDopération;
  /** Ce qui s'écrit sur la ligne. */
  mot: string;
  /** Le prix — zéro quand il n'y en a pas. */
  prix: number;
  /** Pour qui c'est — vide quand ce n'est pour personne en particulier. */
  qui: string;
  /** **La note ne se montre qu'à l'émetteur** quand elle est privée. */
  privée: boolean;
}

/** **Le + et ses options** : ce qu'on peut faire arriver sur le ticket. */
export const LES_OPÉRATIONS: Array<{
  id: GenreDopération;
  mot: string;
  glyphe: string;
  indication: string;
  /** Ce que le + écrit dans le champ — l'agent continue tout seul après. */
  début: string;
}> = [
  { id: 'ligne', mot: 'OPÉRATION', glyphe: '＋', indication: 'une ligne de plus sur le ticket', début: 'opération ' },
  { id: 'devis', mot: 'DEVIS', glyphe: '≈', indication: 'un prix proposé, à accepter', début: 'devis ' },
  { id: 'facture', mot: 'FACTURE', glyphe: '€', indication: 'ce qui est dû, et par qui', début: 'facture ' },
  { id: 'note', mot: 'NOTE', glyphe: '✎', indication: 'un mot pour soi — ou pour tous', début: 'note ' },
  { id: 'import', mot: 'IMPORT', glyphe: '↧', indication: 'un doc, une photo, une capture, un PDF', début: 'import ' },
];

export const estUneOpération = (id: string): boolean =>
  LES_OPÉRATIONS.some((o) => o.id === id);

/* —————————————————————— CE QUE LA PHRASE DEMANDE —————————————————————— */

/** Les mots qui disent le genre — du plus précis au plus vague. */
const GENRES: Array<{ genre: GenreDopération; mots: string[] }> = [
  { genre: 'devis', mots: ['devis', 'estimation', 'proposition'] },
  { genre: 'facture', mots: ['facture', 'facturation', 'note de frais', 'memoire'] },
  { genre: 'import', mots: ['import', 'importer', 'doc', 'document', 'photo', 'capture', 'pdf', 'piece jointe', 'recu', 'justificatif'] },
  { genre: 'note', mots: ['note', 'noter', 'mot', 'pense-bete', 'memo'] },
  { genre: 'ligne', mots: ['operation', 'ligne', 'ajouter', 'ajoute', 'plus'] },
];

/** Ce que la phrase a de l'argent : un nombre suivi de sa monnaie. */
const LARGENT = /(\d+(?:[.,]\d{1,2})?)\s*(?:€|euros?|eur\b|e\b)/;

/** Ce que la phrase dit de la note : est-elle pour tout le monde ? */
const POUR_TOUS = /partag|pour tous|visible|tout le monde|public/;

/** Ce que la phrase dit du destinataire — l'article ne fait pas partie du nom. */
const DESTINATAIRE =
  /\b(?:pour|a|de)\s+(?:(?:le|la|les|l|un|une|des|du|mon|ma|mes|notre|nos|son|sa|ses)\s+)?([a-zA-ZÀ-ÿ][\w'’-]*(?:\s+[A-ZÀ-ÿ][\w'’-]*)?)/;

/** Ce qu'on enlève pour ne garder que le mot de la ligne. */
const À_ENLEVER = [
  /\b(?:operation|ligne|devis|estimation|proposition|facture|facturation|note de frais|memoire|import|importer|document|doc|piece jointe|recu|justificatif|note|noter|pense-bete|memo|ajouter|ajoute|cree|creer|c'est|ceci|ca|s'il te plait|svp)\b/g,
  /\b(?:pour|a|de)\s+[a-zA-ZÀ-ÿ][\w'’-]*(?:\s+[A-ZÀ-ÿ][\w'’-]*)?/g,
  /(\d+(?:[.,]\d{1,2})?)\s*(?:€|euros?|eur\b|e\b)/g,
];

/**
 * **Une opération, écrite à la main.** Le genre se lit au premier mot qui le
 * dit ; l'argent ne se lit que quand la monnaie est écrite (`300 €`, `300e`) —
 * « un dîner pour vingt » ne fait donc pas vingt euros ; le destinataire se lit
 * après « pour » ou « à » ; et **la note est privée par défaut** — elle ne
 * devient publique que si la phrase le dit.
 */
export function lOpération(demande: string, id: string): LOpération | null {
  const texte = demande.trim();
  if (texte.length < 3) return null;

  const doux = sansAccent(texte.toLowerCase());

  let genre: GenreDopération | null = null;
  for (const { genre: g, mots } of GENRES) {
    if (mots.some((m) => new RegExp(`(^|[^a-z])${m}($|[^a-z])`).test(doux))) {
      genre = g;
      break;
    }
  }
  if (!genre) return null;

  const argent = texte.match(LARGENT);
  const prix = argent ? Number(argent[1]!.replace(',', '.')) : 0;

  const destinataire = texte.match(DESTINATAIRE);
  const qui = destinataire ? destinataire[1]!.trim() : '';

  /** Le mot : la phrase, épluchée de tout ce qui n'est pas elle. */
  const mot = À_ENLEVER.reduce((reste, règle) => reste.replace(règle, ' '), doux)
    .replace(/\s+/g, ' ')
    .trim();

  return {
    id,
    genre,
    mot: mot || (LES_OPÉRATIONS.find((o) => o.id === genre)?.mot.toLowerCase() ?? 'opération'),
    prix,
    qui,
    // Une note est à celui qui l'écrit : elle ne se partage que si on le dit.
    privée: genre === 'note' ? !POUR_TOUS.test(doux) : POUR_TOUS.test(doux) || false,
  };
}

/* ————————————————————— LE CODE : TOUT DEDANS —————————————————————
 *
 * Un ticket, ça se passe de main en main. Le code le porte donc **en entier** :
 * le genre, le prix, pour qui, si c'est privé, et le mot. Rien d'autre n'est
 * nécessaire pour que l'autre côté le lise — et le voye comme **sa** facture ou
 * **son** reçu.
 */

// Le point sépare les morceaux du code complet : il ne doit pas passer.
const ÉCHAPPE = (texte: string) => encodeURIComponent(texte).replace(/~/g, '%7E').replace(/\./g, '%2E');

export function lesOpérationsEnCode(liste: LOpération[]): string {
  return liste
    .map((o) => [o.genre, String(o.prix), ÉCHAPPE(o.qui), o.privée ? '1' : '0', ÉCHAPPE(o.mot)].join(':'))
    .join('~');
}

export function lesOpérationsDuCode(code: string): LOpération[] {
  if (!code.trim()) return [];
  return code
    .split('~')
    .map((bloc, rang) => {
      const [genre, prix, qui, privée, mot] = bloc.split(':');
      if (!genre || !estUneOpération(genre)) return null;
      return {
        id: `op-${rang + 1}`,
        genre: genre as GenreDopération,
        mot: decodeURIComponent(mot ?? ''),
        prix: Number(prix ?? 0) || 0,
        qui: decodeURIComponent(qui ?? ''),
        privée: privée === '1',
      };
    })
    .filter((o): o is LOpération => o !== null);
}

/**
 * **Ce que les opérations apportent au total.** Un devis accepté, une facture,
 * une ligne ajoutée : ça compte dans l'addition — c'est tout l'intérêt du
 * ticket évolutif. Une note, ou un papier sans prix, n'ajoute rien.
 */
export function lApportDesOpérations(liste: LOpération[]): number {
  return liste.reduce((somme, o) => somme + (o.prix || 0), 0);
}

/** **Ce que l'opération dit d'elle-même**, sur le papier. */
export function leMotDeLOpération(o: LOpération): string {
  return LES_OPÉRATIONS.find((x) => x.id === o.genre)?.mot ?? 'OPÉRATION';
}
