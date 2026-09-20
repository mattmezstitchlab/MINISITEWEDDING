import { canaux } from './couleurs';
import { couvertureDuJour } from './couvertureDuJour';
import { ficheDuJour } from './fichesAnnee';
import { MOMENTS_VISUELS, SCENES_PAR_PERSONNAGE, type MomentVisuel } from './promptsVisuels';
import { CADRAGE } from './promptsVisuels';

/**
 * LE CASTING DES VISUELS — CE QU'ON DEMANDE, ET COMMENT ON CHOISIT
 *
 * Le magazine a besoin de deux familles d'images, et **elles ne sont pas au même
 * point** :
 *
 * - **Les fonds de couverture : 365.** Une par jour. Ils ne dépendent d'aucune
 *   fiche : la couverture existe déjà (sa palette, sa saison, son titre, son
 *   dessin). **On peut les produire tout de suite.**
 * - **Les scènes : 1 825.** Cinq par jour, les cinq moments de lumière — le même
 *   personnage, cinq fois. Elles dépendent de la fiche du jour : **on n'illustre
 *   pas ce qu'on n'a pas documenté**.
 *
 * **Et quand il y a plusieurs images pour le même plan** — ce qui arrivera, parce
 * qu'une série se tourne rarement du premier coup — il faut **choisir la plus
 * proche**. C'est ce que fait `choisirLeMeilleurVisuel` : on ne choisit pas « la
 * plus belle » (ça ne veut rien dire), on choisit **celle qui répond au brief** —
 * le moment, la lumière, la couleur du jour, le cadrage — et **on dit pourquoi**.
 *
 * Le nom des fichiers ne se discute pas, il se suit :
 *
 * ```
 * /images/magazine/09-21/couverture.jpg      (fond de couverture, et -2, -3)
 * /images/magazine/09-21/aube.jpg            (les cinq moments, et -2, -3)
 * /images/magazine/09-21/matin.jpg
 * /images/magazine/09-21/midi.jpg
 * /images/magazine/09-21/apres-midi.jpg
 * /images/magazine/09-21/soir.jpg
 * ```
 *
 * `MM-JJ` est le jour de l'année : le dossier se remplit tout seul, et le site
 * prend l'image dès qu'elle est là — sinon **le dessin prend le relais** (le SVG
 * n'est pas un brouillon : c'est la couverture par défaut, et elle tient).
 */

/** Les cinq moments, puis la nuit : elle n'a pas d'image, et on dit pourquoi. */
export const MOMENTS_DU_CASTING = MOMENTS_VISUELS;

/** **Ce qu'on attend d'une image** : de quoi la juger sans l'avoir vue. */
export interface AttenduVisuel {
  /** `MM-JJ`. */
  jour: string;
  /** `couverture` pour le fond, sinon l'identifiant du moment. */
  slot: string;
  /** Le chemin attendu, sans extension… */
  chemin: string;
  /** Le premier fichier possible, et ses remplaçants. */
  fichiers: string[];
  /** Le moment de lumière attendu — `null` pour un fond de couverture. */
  moment: MomentVisuel | null;
  /** La couleur du jour : celle de la saison, ou le noir des jours à part. */
  palette: string;
  /** Le nom du jour : « Saint Matthieu », « Adolphe Sax ». */
  titre: string;
  /** Ce que l'image doit montrer, en une phrase. */
  sujet: string;
  /** Le format, tel qu'il est demandé. */
  format: string;
}

/** Ce qu'une personne qui produit l'image déclare de son image. */
export interface CandidatVisuel {
  /** Le chemin servi, par exemple `/images/magazine/09-21/midi-2.jpg`. */
  fichier: string;
  /** Le moment que l'image montre, s'il est déclaré. */
  moment?: string;
  /** La lumière : « froide », « claire », « dure », « rasante », « chaude »… */
  lumiere?: string;
  /** La couleur dominante, en `#RRGGBB`. */
  couleur?: string;
  largeur?: number;
  hauteur?: number;
  /** Ce qu'on voit : « personnage », « décor », « objet », « table », « bougies »… */
  contient?: string[];
  /** Une note de la personne qui a produit l'image, à titre indicatif. */
  note?: string;
}

export interface NoteDeCandidat {
  total: number;
  /** Pourquoi cette note — en clair, dans l'ordre des points. */
  raisons: string[];
}

/* ——————————————————————— LES CHEMINS, SANS DISCUSSION ——————————————————————— */

/** Le dossier d'un jour : `09-21`. */
export function dossierDuJour(jour: string): string {
  return jour;
}

/** L'adresse d'une image : `/images/magazine/09-21/midi-2.jpg`. */
export function adresseDuFichier(jour: string, slot: string, rang = 1): string {
  const suffixe = rang > 1 ? `-${rang}` : '';
  return `/images/magazine/${dossierDuJour(jour)}/${slot}${suffixe}.jpg`;
}

/** Les trois rangs qu'on accepte pour un même plan : le principal, et deux autres. */
export const RANGS_PAR_PLAN = 3;

/** Les trois fichiers possibles pour un plan — le premier est celui qu'on veut. */
export function fichiersDuPlan(jour: string, slot: string): string[] {
  return Array.from({ length: RANGS_PAR_PLAN }, (_, i) => adresseDuFichier(jour, slot, i + 1));
}

/* ————————————————— L'ANNÉE : 365 FONDS, ET 1 825 SCÈNES ————————————————— */

/**
 * **Les 365 fonds de couverture.** Une par jour, disponibles tout de suite : la
 * couverture sait déjà sa couleur, sa saison et son titre. Ce qu'on demande, c'est
 * **une matière du jour** — pas une illustration : un fond qui tient sous du texte.
 */
export function fondsDeCouvertureDeLAnnee(annee: number): AttenduVisuel[] {
  const attendus: AttenduVisuel[] = [];
  for (let mois = 0; mois < 12; mois += 1) {
    const joursDuMois = new Date(annee, mois + 1, 0).getDate();
    for (let quantieme = 1; quantieme <= joursDuMois; quantieme += 1) {
      const date = new Date(annee, mois, quantieme);
      const couverture = couvertureDuJour(date);
      const jour = `${String(mois + 1).padStart(2, '0')}-${String(quantieme).padStart(2, '0')}`;
      attendus.push({
        jour,
        slot: 'couverture',
        chemin: `/images/magazine/${jour}/couverture`,
        fichiers: fichiersDuPlan(jour, 'couverture'),
        moment: null,
        palette: couverture.fond,
        titre: couverture.titre,
        sujet: `Le fond de la couverture : ${couverture.saison.symbole} ${couverture.saison.nom}, la matière du jour, sans visage et sans objet identifiable — il doit tenir du texte par-dessus.`,
        format: '5 / 7',
      });
    }
  }
  return attendus;
}

/**
 * **Les 1 825 scènes** : cinq moments par jour, **le même personnage cinq fois**.
 * Une scène n'a son brief que **si la fiche du jour est documentée** : sinon elle
 * apparaît avec **ce qui lui manque**, et rien d'inventé.
 */
export interface SceneDeLAnnee extends AttenduVisuel {
  /** Le personnage qui doit être le même sur les cinq images. */
  personnage: string;
  /** Vrai quand la fiche du jour est documentée : la scène a son brief. */
  documentee: boolean;
}

export function scenesDeLAnnee(annee: number): SceneDeLAnnee[] {
  const scenes: SceneDeLAnnee[] = [];
  for (let mois = 0; mois < 12; mois += 1) {
    const joursDuMois = new Date(annee, mois + 1, 0).getDate();
    for (let quantieme = 1; quantieme <= joursDuMois; quantieme += 1) {
      const date = new Date(annee, mois, quantieme);
      const fiche = ficheDuJour(date);
      const couverture = couvertureDuJour(date);
      const jour = `${String(mois + 1).padStart(2, '0')}-${String(quantieme).padStart(2, '0')}`;
      const documentee = fiche.etat === 'prete';
      for (const moment of MOMENTS_VISUELS) {
        scenes.push({
          jour,
          slot: moment.id,
          chemin: `/images/magazine/${jour}/${moment.id}`,
          fichiers: fichiersDuPlan(jour, moment.id),
          moment,
          palette: couverture.fond,
          titre: couverture.titre,
          personnage: fiche.personnage,
          documentee,
          sujet: documentee
            ? `${fiche.personnage}, ${moment.nom.toLowerCase()} — ${moment.narration}`
            : `${fiche.personnage} : la scène attend sa fiche (${fiche.manquant[0] ?? 'origine, époque, lieu'}).`,
          format: '5 / 7',
        });
      }
    }
  }
  return scenes;
}

/** Les comptes, dits franchement. */
export const FONDS_ATTENDUS = 365;
export const SCENES_ATTENDUES = 365 * SCENES_PAR_PERSONNAGE; // 1 825

export function etatDuCasting(annee: number): {
  fonds: number;
  scenes: number;
  scenesAvecBrief: number;
  scenesSansFiche: number;
  personnages: number;
} {
  const scenes = scenesDeLAnnee(annee);
  return {
    fonds: fondsDeCouvertureDeLAnnee(annee).length,
    scenes: scenes.length,
    scenesAvecBrief: scenes.filter((s) => s.documentee).length,
    scenesSansFiche: scenes.filter((s) => !s.documentee).length,
    personnages: new Set(scenes.map((s) => s.personnage)).size,
  };
}

/* ————————————————————— CHOISIR LA PLUS PROCHE DU BRIEF ————————————————————— */

/**
 * La distance entre deux couleurs, en canaux : 0 (identiques) à 441. Une couleur
 * illisible ne se compare pas : on renvoie `null`, et la note le dira.
 */
export function distanceDesCouleurs(a: string, b: string): number | null {
  const un = canaux(a);
  const deux = canaux(b);
  if (!un || !deux) return null;
  const [r1, v1, b1] = un;
  const [r2, v2, b2] = deux;
  return Math.round(Math.sqrt((r1 - r2) ** 2 + (v1 - v2) ** 2 + (b1 - b2) ** 2));
}

/** Les mots d'une lumière, pour comparer ce qui se compare. */
function motsDeLumiere(lumiere: string): string[] {
  return lumiere
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-z]+/)
    .filter((m) => m.length >= 4);
}

/**
 * **LA NOTE D'UNE IMAGE.** Cinq critères, chacun avec son poids, et **une raison
 * écrite** pour chaque point donné ou refusé. On ne juge jamais « la beauté » :
 * on juge **la réponse au brief**.
 *
 * | critère | poids | ce qu'on regarde |
 * | --- | --- | --- |
 * | le moment | 3 | l'image montre-t-elle bien l'aube, le midi, le soir ? |
 * | la lumière | 2 | la lumière décrite est-elle celle du moment ? |
 * | la couleur | 2 | la dominante est-elle proche de la couleur du jour ? |
 * | le cadrage | 1 | est-ce bien du 5 / 7 ? |
 * | le sujet | 1 | voit-on ce que la scène demande ? |
 */
export function noterCandidat(candidat: CandidatVisuel, attendu: AttenduVisuel): NoteDeCandidat {
  const raisons: string[] = [];
  let total = 0;

  /* Le moment — le critère qui décide, et de loin. */
  if (!attendu.moment) {
    if (candidat.moment === undefined) {
      raisons.push('fond de couverture : le moment n’est pas demandé');
    } else if (candidat.moment === 'couverture') {
      total += 3;
      raisons.push('c’est bien un fond de couverture');
    } else {
      total -= 2;
      raisons.push(`c’est une scène (${candidat.moment}), pas un fond de couverture`);
    }
  } else if (candidat.moment === attendu.moment.id) {
    total += 3;
    raisons.push(`c’est bien ${attendu.moment.nom.toLowerCase()}`);
  } else if (candidat.moment === undefined) {
    raisons.push('le moment n’est pas déclaré');
  } else {
    total -= 3;
    raisons.push(`le moment déclaré est ${candidat.moment}, pas ${attendu.moment.id}`);
  }

  /* La lumière du moment. */
  if (attendu.moment && candidat.lumiere) {
    const attendues = new Set(motsDeLumiere(attendu.moment.lumiere));
    const communes = motsDeLumiere(candidat.lumiere).filter((m) => attendues.has(m));
    if (communes.length > 0) {
      total += 2;
      raisons.push(`la lumière y est (${communes.slice(0, 3).join(', ')})`);
    } else {
      raisons.push('la lumière n’est pas celle du moment');
    }
  } else if (attendu.moment) {
    raisons.push('la lumière n’est pas déclarée');
  } else if (candidat.lumiere) {
    total += 1;
    raisons.push('la lumière du fond est déclarée');
  }

  /* La couleur du jour. */
  const distance = candidat.couleur ? distanceDesCouleurs(candidat.couleur, attendu.palette) : null;
  if (distance === null) {
    raisons.push('aucune couleur dominante comparable');
  } else {
    if (distance <= 40) {
      total += 2;
      raisons.push(`la couleur du jour est là (à ${distance} canaux)`);
    } else if (distance <= 80) {
      total += 1;
      raisons.push(`la couleur approche le jour (à ${distance} canaux)`);
    } else {
      raisons.push(`couleur trop loin du jour (à ${distance} canaux)`);
    }
  }

  /* Le cadrage. */
  if (candidat.largeur && candidat.hauteur) {
    const rapport = candidat.largeur / candidat.hauteur;
    if (Math.abs(rapport - 5 / 7) <= 0.06) {
      total += 1;
      raisons.push('le cadrage est celui demandé (5 / 7)');
    } else {
      raisons.push(`le cadrage est ${rapport.toFixed(2)} pour 1, pas 0,71`);
    }
  } else {
    raisons.push('les dimensions ne sont pas déclarées');
  }

  /* Le sujet : ce que la scène demande à voir. */
  if (candidat.contient && candidat.contient.length > 0) {
    const sujet = `${attendu.sujet} ${attendu.moment?.decor ?? ''} ${attendu.moment?.stylisme ?? ''}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const trouves = candidat.contient.filter((c) =>
      sujet.includes(c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')),
    );
    if (trouves.length > 0) {
      total += 1;
      raisons.push(`on y voit ce que la scène demande (${trouves.slice(0, 3).join(', ')})`);
    } else {
      raisons.push('le sujet demandé n’est pas reconnu dans l’image');
    }
  }

  return { total, raisons };
}

export interface ClassementDesCandidats {
  /** Le candidat retenu, ou `null` si l'on n'a rien reçu. */
  choisi: CandidatVisuel | null;
  /** Tous les candidats, du meilleur au moins bon, avec leur note et leurs raisons. */
  classement: Array<{ candidat: CandidatVisuel; note: NoteDeCandidat }>;
  /** Ce qui a décidé, en une phrase — c'est ce qui se signe. */
  decision: string;
}

/**
 * **LE MEILLEUR VISUEL POUR CE PLAN** : on classe, on garde le premier, et on dit
 * pourquoi. À égalité, **c'est le premier arrivé** qui reste — l'ordre des fichiers
 * est un ordre, pas un hasard.
 */
export function choisirLeMeilleurVisuel(
  candidats: CandidatVisuel[],
  attendu: AttenduVisuel,
): ClassementDesCandidats {
  const classement = candidats
    .map((candidat) => ({ candidat, note: noterCandidat(candidat, attendu) }))
    .sort((a, b) => b.note.total - a.note.total);
  const premier = classement[0] ?? null;
  const decision = premier
    ? `${premier.candidat.fichier} — ${premier.note.total} point${premier.note.total > 1 ? 's' : ''} : ${premier.note.raisons.join(' ; ')}.`
    : `Aucune image reçue pour ${attendu.chemin}. Le dessin prend le relais.`;
  return { choisi: premier?.candidat ?? null, classement, decision };
}

/** Le rappel du format demandé, pour ne pas l'oublier en produisant. */
export const CADRAGE_DU_CASTING = CADRAGE;
