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

/* ———————————— RASSEMBLER PLUSIEURS JOURS, PUIS ÉLIMINER ———————————— */

/**
 * **Un jour en tient d'autres.** Le personnage du jour peut être fêté ailleurs dans
 * l'année ; la même porte peut s'ouvrir à une autre date ; le même métier peut se
 * patronner un autre jour ; et des jours différents partagent la même famille
 * visuelle. Le casting ne regarde donc jamais **un seul magazine** : il rassemble
 * les jours liés, puis **il filtre, il refiltre, et il procède par élimination**.
 */
export interface JourLie {
  /** `MM-JJ`. */
  jour: string;
  /** Pourquoi ce jour tient avec l'autre — en clair. */
  raison: string;
}

/** La date qui va avec `MM-JJ`, à midi pour éviter tout bord de fuseau. */
function dateDuJourMMJJ(annee: number, jour: string): Date {
  const [mois, quantieme] = jour.split('-').map(Number);
  return new Date(annee, mois - 1, quantieme, 12);
}

function sansAccentsNiCasse(texte: string): string {
  return texte.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/** Les mots qui comptent, pour comparer des sujets entre eux. */
function motsQuiComptent(texte: string): string[] {
  return sansAccentsNiCasse(texte)
    .split(/[^a-z]+/)
    .filter((m) => m.length >= 4);
}

/**
 * **Les jours liés à un jour** : le même personnage ailleurs dans l'année, la même
 * porte ouverte, le même métier patronné, la même famille visuelle. Chaque lien a
 * **sa raison écrite** — on ne rassemble jamais des jours sans savoir pourquoi.
 */
export function joursLiesAuJour(annee: number, jour: string): JourLie[] {
  const date = dateDuJourMMJJ(annee, jour);
  const fiche = ficheDuJour(date);
  const couverture = couvertureDuJour(date);
  const lies: JourLie[] = [];

  const fichesParJour = new Map<string, { portes: string[]; metiers: string[] }>();
  for (let mois = 0; mois < 12; mois += 1) {
    const joursDuMois = new Date(annee, mois + 1, 0).getDate();
    for (let quantieme = 1; quantieme <= joursDuMois; quantieme += 1) {
      const autreJour = `${String(mois + 1).padStart(2, '0')}-${String(quantieme).padStart(2, '0')}`;
      if (autreJour === jour) continue;
      const autre = ficheDuJour(new Date(annee, mois, quantieme, 12));
      fichesParJour.set(autreJour, { portes: autre.portes, metiers: autre.metiers });
    }
  }

  for (let mois = 0; mois < 12; mois += 1) {
    const joursDuMois = new Date(annee, mois + 1, 0).getDate();
    for (let quantieme = 1; quantieme <= joursDuMois; quantieme += 1) {
      const autreJour = `${String(mois + 1).padStart(2, '0')}-${String(quantieme).padStart(2, '0')}`;
      if (autreJour === jour) continue;
      const autreCouverture = couvertureDuJour(new Date(annee, mois, quantieme, 12));
      const autreFiche = fichesParJour.get(autreJour)!;
      const raisons: string[] = [];
      if (autreCouverture.titre.toLowerCase() === couverture.titre.toLowerCase()) {
        raisons.push(`le même personnage, ${couverture.titre}, y est fêté`);
      }
      const portesCommunes = fiche.portes.filter((p) => autreFiche.portes.includes(p));
      if (portesCommunes.length > 0) {
        raisons.push(`la même porte s'y ouvre (${portesCommunes.join(', ')})`);
      }
      const metiersCommuns = fiche.metiers.filter((m) => autreFiche.metiers.includes(m));
      if (metiersCommuns.length > 0) {
        raisons.push(`le même métier s'y patronne (${metiersCommuns.join(', ')})`);
      }
      if (
        autreCouverture.saison.id === couverture.saison.id &&
        autreCouverture.dense === couverture.dense &&
        autreCouverture.pasCommeLesAutres === couverture.pasCommeLesAutres
      ) {
        raisons.push(`la même famille visuelle (${couverture.saison.nom}${couverture.pasCommeLesAutres ? ', un jour à part' : ''})`);
      }
      if (raisons.length > 0) lies.push({ jour: autreJour, raison: raisons.join(' ; ') });
    }
  }
  return lies;
}

export interface TourDElimination {
  /** Le nom du filtre : « le moment », « la couleur », « le sujet »… */
  nom: string;
  /** Ceux que ce tour a sortis, et pourquoi. */
  elimines: Array<{ fichier: string; raison: string }>;
  /** Combien il en reste après ce tour. */
  restants: number;
}

export interface EliminationEntreJours {
  /** Les jours dont les briefs ont été rassemblés. */
  joursRassembles: string[];
  /** Le nombre de candidats au départ. */
  rassembles: number;
  /** Chaque tour, dans l'ordre, avec ses éliminés et leurs raisons. */
  tours: TourDElimination[];
  /** Ce qui reste : les retenus, avec leur note et le jour auquel ils répondent. */
  retenus: Array<{ candidat: CandidatVisuel; note: NoteDeCandidat; jourRepondu: string }>;
  /** Le récit complet du casting, en clair — c'est ce qui se signe. */
  decision: string;
}

/** La couleur est éliminée au-delà de cette distance aux jours rassemblés. */
export const SEUIL_ELIMINATION_COULEUR = 160;

/**
 * **LE CASTING ENTRE PLUSIEURS JOURS.** On rassemble les candidats et les briefs de
 * plusieurs jours (le jour du mariage **et** les jours qui le tiennent), puis on
 * procède **par élimination**, un tour après l'autre :
 *
 * 1. **le moment** — le moment déclaré doit être demandé par l'un des jours ;
 * 2. **le cadrage** — les dimensions doivent répondre au 5 / 7 ;
 * 3. **la couleur** — la dominante doit approcher l'un des jours rassemblés ;
 * 4. **la lumière** — une scène sans lumière déclarée sort ;
 * 5. **le sujet** — ce qu'on voit doit répondre à l'un des jours rassemblés.
 *
 * Ce qui reste est noté contre le brief auquel il répond le mieux, et **l'on garde
 * tous les premiers** — même s'il y en a plusieurs. Chaque tour écrit qui il sort,
 * et pourquoi.
 */
export function eliminerEntreJours(
  candidats: CandidatVisuel[],
  attendus: AttenduVisuel[],
): EliminationEntreJours {
  const joursRassembles = [...new Set(attendus.map((a) => a.jour))].sort();
  const rassembles = candidats.length;
  let pool = [...candidats];
  const tours: TourDElimination[] = [];

  const appliquerTour = (nom: string, passe: (c: CandidatVisuel) => boolean, raisonElimination: (c: CandidatVisuel) => string) => {
    const elimines: TourDElimination['elimines'] = [];
    const restants: CandidatVisuel[] = [];
    for (const candidat of pool) {
      if (passe(candidat)) restants.push(candidat);
      else elimines.push({ fichier: candidat.fichier, raison: raisonElimination(candidat) });
    }
    pool = restants;
    tours.push({ nom, elimines, restants: pool.length });
  };

  /* Tour 1 — le moment. */
  const momentsAttendus = new Set(
    attendus.filter((a) => a.moment).flatMap((a) => [a.moment!.id, sansAccentsNiCasse(a.moment!.nom)]),
  );
  const unFondEstAttendu = attendus.some((a) => !a.moment);
  if (momentsAttendus.size > 0) {
    appliquerTour(
      'le moment',
      (c) =>
        c.moment === undefined ||
        momentsAttendus.has(c.moment) ||
        momentsAttendus.has(sansAccentsNiCasse(c.moment)) ||
        (unFondEstAttendu && c.moment === 'couverture'),
      (c) => `le moment déclaré (${c.moment}) n'est demandé par aucun des jours rassemblés`,
    );
  }

  /* Tour 2 — le cadrage. */
  appliquerTour(
    'le cadrage',
    (c) => {
      if (!c.largeur || !c.hauteur) return true;
      return Math.abs(c.largeur / c.hauteur - 5 / 7) <= 0.1;
    },
    (c) => `le cadrage déclaré (${c.largeur} × ${c.hauteur}) s'éloigne du 5 / 7`,
  );

  /* Tour 3 — la couleur, contre n'importe lequel des jours rassemblés. */
  appliquerTour(
    'la couleur',
    (c) => {
      if (!c.couleur) return true;
      let plusProche: number | null = null;
      for (const attendu of attendus) {
        const distance = distanceDesCouleurs(c.couleur, attendu.palette);
        if (distance !== null && (plusProche === null || distance < plusProche)) plusProche = distance;
      }
      return plusProche === null || plusProche <= SEUIL_ELIMINATION_COULEUR;
    },
    (c) => `la couleur déclarée (${c.couleur}) est trop loin de tous les jours rassemblés`,
  );

  /* Tour 4 — la lumière : une scène qui ne la déclare pas sort. */
  if (attendus.some((a) => a.moment)) {
    appliquerTour(
      'la lumière',
      (c) => (c.moment === 'couverture' ? true : Boolean(c.lumiere)),
      () => 'la lumière n’est pas déclarée : impossible de juger le moment',
    );
  }

  /* Tour 5 — le sujet, contre n'importe lequel des jours rassemblés. */
  const motsAttendus = new Set(
    attendus.flatMap((a) =>
      motsQuiComptent(`${a.sujet} ${a.titre} ${a.moment?.decor ?? ''} ${a.moment?.stylisme ?? ''}`),
    ),
  );
  appliquerTour(
    'le sujet',
    (c) => {
      if (!c.contient || c.contient.length === 0) return true;
      return c.contient.some((mot) => {
        const normalise = sansAccentsNiCasse(mot);
        return [...motsAttendus].some((attendu) => normalise.includes(attendu) || attendu.includes(normalise));
      });
    },
    (c) => `ce qu'on y voit (${c.contient!.join(', ')}) ne répond à aucun des jours rassemblés`,
  );

  /* Ce qui reste : chacun répond au brief qui lui va le mieux. */
  const retenus = pool
    .map((candidat) => {
      const candidatsAttendus = attendus.filter(
        (a) =>
          (!a.moment && (candidat.moment === 'couverture' || candidat.moment === undefined)) ||
          (a.moment && a.moment.id === candidat.moment),
      );
      const contre = candidatsAttendus.length > 0 ? candidatsAttendus : attendus;
      let meilleure: { note: NoteDeCandidat; attendu: AttenduVisuel } | null = null;
      for (const attendu of contre) {
        const note = noterCandidat(candidat, attendu);
        if (!meilleure || note.total > meilleure.note.total) meilleure = { note, attendu };
      }
      return { candidat, note: meilleure!.note, jourRepondu: meilleure!.attendu.jour };
    })
    .sort((a, b) => b.note.total - a.note.total);

  const meilleurScore = retenus[0]?.note.total ?? null;
  const gardes = retenus.filter((r) => r.note.total === meilleurScore);

  const recitDesTours = tours
    .map((tour) =>
      tour.elimines.length === 0
        ? `tour « ${tour.nom} » : personne ne sort`
        : `tour « ${tour.nom} » : ${tour.elimines.length} sorti${tour.elimines.length > 1 ? 's' : ''} (${tour.elimines.map((e) => e.fichier).join(', ')})`,
    )
    .join(' ; ');

  const decision =
    gardes.length > 0
      ? `${rassembles} candidats rassemblés pour ${joursRassembles.length} jour${joursRassembles.length > 1 ? 's' : ''} (${joursRassembles.join(', ')}) ; ${recitDesTours} ; retenus : ${gardes.map((g) => g.candidat.fichier).join(', ')} à ${meilleurScore} point${meilleurScore! > 1 ? 's' : ''}.`
      : `${rassembles} candidats rassemblés pour ${joursRassembles.length} jour${joursRassembles.length > 1 ? 's' : ''} (${joursRassembles.join(', ')}) ; ${recitDesTours} ; rien ne passe les filtres — le dessin garde sa place.`;

  return { joursRassembles, rassembles, tours, retenus: gardes, decision };
}
