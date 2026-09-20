/**
 * LE SUPER JOURNAL — L'ARCHITECTURE IDENTIQUE POUR TOUS
 *
 * Le magazine du jour est **public** : il raconte le temps, la carte, la saison.
 * Le **journal**, lui, est **à soi** — et pourtant il a **la même architecture
 * pour tout le monde** : les mêmes blocs, dans le même ordre, sur le même papier.
 * Un journal n'est pas un fil : on y écrit, on y colle, on y garde — et si la
 * personne **valide** une page, elle devient publique, et **n'importe qui peut la
 * lire** sans que le moindre bloc bouge de place.
 *
 * **JUMO, l'agent de la personne.** Le saint de son propre magazine : il connaît
 * tout de celui qui écrit, il **retient**, et il **propose** — « ceci pourrait
 * aller dans les notes », « ceci est un rêve, je le garde », « ceci est une date,
 * je la mets dans l'agenda ». Il n'écrit jamais à la place de la personne : il
 * propose, elle valide.
 *
 * **La confidentialité, choisie, jamais subie.** Trois cibles : **public** (tout
 * le monde), **le cercle** (ceux qui sont alignés — le même jour, le même lieu,
 * le même rôle), **privé** (soi seul, et Jumo). Le défaut est **privé** : ce qui
 * n'est pas validé ne sort pas. C'est la leçon des produits qui ont appris à
 * leur place : un journal qu'on n'a pas choisi de publier n'est pas un journal,
 * c'est une fuite.
 */

/* ————————————————————————— LES SECTIONS, DANS L'ORDRE ————————————————————————— */

export interface SectionJournal {
  id: string;
  nom: string;
  /** Ce que le bloc contient. */
  role: string;
}

/**
 * **L'architecture** : elle ne bouge pas d'un journal à l'autre — c'est ce qui
 * fait qu'on peut lire le journal de quelqu'un qu'on ne connaît pas, et s'y
 * retrouver. Le moindre bloc est à sa place, comme dans un journal imprimé.
 */
export const SECTIONS: SectionJournal[] = [
  { id: 'couverture', nom: 'La couverture', role: 'le prénom, le portrait de studio, le jour de la fête, le numéro' },
  { id: 'sommaire', nom: 'Le sommaire', role: 'les sections, et ce qu’il y a dedans cette semaine' },
  { id: 'edito', nom: 'L’édito', role: 'la personne écrit trois lignes — ou Jumo les propose' },
  { id: 'jeu', nom: 'Le jeu de cartes', role: 'une photo par semaine, qui devient la face de la carte' },
  { id: 'notes', nom: 'Les notes', role: 'ce qui s’écrit sans réfléchir, et qui se garde' },
  { id: 'agenda', nom: 'L’agenda', role: 'les disponibilités que les autres peuvent voir' },
  { id: 'mood', nom: 'Le mood', role: 'où en est la personne, aujourd’hui' },
  { id: 'reves', nom: 'Les rêves', role: 'ce qui se confie, et qui n’a pas besoin d’être vrai pour être retenu' },
  { id: 'liens', nom: 'Les liens et les fichiers', role: 'ce qu’on dépose : un lien, un document, une photo' },
  { id: 'memoire', nom: 'La mémoire', role: 'ce que Jumo a retenu, et depuis quand' },
  { id: 'signature', nom: 'La signature', role: 'le sceau du journal, et sa date de dernière mise à jour' },
];

/* ————————————————————————— LA CONFIDENTIALITÉ ————————————————————————— */

export type Cible = 'public' | 'cercle' | 'prive';

export interface Confidentialite {
  id: Cible;
  nom: string;
  qui: string;
}

export const CONFIDENTIALITES: Confidentialite[] = [
  { id: 'public', nom: 'Public', qui: 'tout le monde — le journal d’une personne se lit comme un magazine' },
  { id: 'cercle', nom: 'Le cercle', qui: 'ceux qui sont alignés : le même jour, le même lieu, le même rôle' },
  { id: 'prive', nom: 'Privé', qui: 'soi seul, et Jumo — c’est le défaut, et il ne change pas tout seul' },
];

/* ————————————————————————— UNE PAGE DU JOURNAL ————————————————————————— */

export interface PageJournal {
  id: string;
  /** La section où elle se range : c’est l’architecture qui décide, pas l’ordre d’arrivée. */
  section: string;
  titre: string;
  texte: string;
  /** La cible de confidentialité. Privé tant que la personne n’a pas validé. */
  cible: Cible;
  /** Ce que Jumo en a retenu, en une phrase. */
  retenu: string;
  /** Qui a proposé : la personne, ou l’agent. */
  source: 'personne' | 'jumo';
  /** La date, en clair. */
  date: string;
}

/**
 * **Ce que Jumo retiendrait.** L'agent lit ce qu'on lui donne — un texte, un
 * lien, un fichier, un mood — et **range** : chaque chose a sa section, et
 * chaque section a sa raison. Il ne juge rien : il reconnaît.
 */
export function ceQueJumoRetiendrait(texte: string): { section: string; retenu: string; cible: Cible } {
  const t = texte.toLowerCase();
  const a = (mots: string[]) => mots.some((m) => t.includes(m));

  if (a(['rêve', 'reve', 'j’ai rêvé', 'cauchemar'])) {
    return { section: 'reves', retenu: 'un rêve — à garder tel quel, sans l’expliquer', cible: 'prive' };
  }
  if (a(['http', 'www.', '.pdf', '.doc', 'fichier', 'lien', 'pièce jointe'])) {
    return { section: 'liens', retenu: 'un lien ou un fichier — déposé, et retrouvable', cible: 'prive' };
  }
  if (a(['dispo', 'disponible', 'je peux', 'samedi', 'dimanche', 'rendez-vous', 'rdv'])) {
    return { section: 'agenda', retenu: 'une disponibilité — les autres peuvent la voir si tu la valides', cible: 'cercle' };
  }
  if (a(['je me sens', 'humeur', 'fatigué', 'heureux', 'heureuse', 'triste', 'mood'])) {
    return { section: 'mood', retenu: 'un état du jour — il se comparera aux jours d’avant', cible: 'prive' };
  }
  if (a(['photo', 'portrait', 'selfie', 'semaine'])) {
    return { section: 'jeu', retenu: 'une photo — elle peut devenir la face de la carte de la semaine', cible: 'cercle' };
  }
  if (a(['je pense', 'note', 'idée', 'souvenir', 'je me souviens'])) {
    return { section: 'notes', retenu: 'une note — gardée, et relisible dans un an', cible: 'prive' };
  }
  return { section: 'notes', retenu: 'quelque chose de dit — gardé dans les notes, et rien de plus', cible: 'prive' };
}

/** **Le journal se remplit, et la personne valide.** Rien ne devient public tout seul. */
export function valider(page: PageJournal, cible: Cible): PageJournal {
  return { ...page, cible };
}

/** Ce que le monde voit d'un journal : seulement ce qui est public. */
export function pagesPubliques(pages: PageJournal[]): PageJournal[] {
  return pages.filter((p) => p.cible === 'public');
}

/** Le journal vide : la même architecture pour tout le monde, dès la première page. */
export function journalVierge(prenom: string, date: string): PageJournal[] {
  return [
    {
      id: 'couverture',
      section: 'couverture',
      titre: prenom,
      texte: 'La couverture du journal : le portrait de studio, le jour de la fête, et le numéro.',
      cible: 'prive',
      retenu: 'le journal existe : il ne reste qu’à le remplir',
      source: 'jumo',
      date,
    },
  ];
}
