/**
 * LE DOCUMENT DE PRODUCTION DES PROMPTS
 *
 * `npm run prompts` engendre `docs/prompts-maitres.md` à partir de ce que le site
 * sait déjà : les 365 jours du calendrier, les fiches des profils, et le système
 * de prompts (`src/lib/promptsVisuels.ts`).
 *
 * **Le document ne s'écrit pas à la main.** C'est ce qui garantit qu'il ne diverge
 * jamais du site : ce que le site ne sait pas documenter, le document ne
 * l'invente pas — il liste ce qui manque.
 */

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { MOIS } from '../src/lib/calendrier';
import {
  JOURS_DOCUMENTES, NIVEAUX, PROFILS, REGLE_DES_PROFILS, SIGNIFICATION_SOURCE,
} from '../src/lib/profilsEditoriaux';
import {
  CADRAGE, DIRECTION_ARTISTIQUE, INTERDITS_VISUELS, MOMENTS_VISUELS, PAS_DIMAGE_LA_NUIT,
  SCENES_PAR_PERSONNAGE, entreesDeLAnnee, etatDeLaSerie, promptMaitre, scenesDuPersonnage,
} from '../src/lib/promptsVisuels';
import {
  FONDS_ATTENDUS, RANGS_PAR_PLAN, SCENES_ATTENDUES, etatDuCasting, fondsDeCouvertureDeLAnnee,
  scenesDeLAnnee,
} from '../src/lib/castingVisuels';

const ANNEE = 2026;

const LIEN: Record<string, string> = {
  directe: 'LIEN DIRECT',
  culturelle: 'LIEN CULTUREL',
  editoriale: 'LIEN ÉDITORIAL',
  inspiration: 'LIEN INSPIRATION',
};

function dateDuJour(jour: string): Date {
  const [mois, quantieme] = jour.split('-').map(Number);
  return new Date(ANNEE, mois! - 1, quantieme!);
}

const etat = etatDeLaSerie(ANNEE);
const entrees = entreesDeLAnnee(ANNEE);
const lignes: string[] = [];
const p = (s = '') => lignes.push(s);

/* ————————————————————————— LE CHAPEAU ————————————————————————— */

p('# Les prompts maîtres — 365 personnages, 1 825 scènes');
p();
p('> Ce fichier est **engendré** : `npm run prompts` le réécrit à partir de `src/lib/promptsVisuels.ts`.');
p('> Il n’est pas écrit à la main, donc il ne peut pas diverger du site.');
p();
p(`**${REGLE_DES_PROFILS}** — c’est la règle de cette collection comme celle du magazine.`);
p();
p('## Le tableau de production');
p();
p(`- **${etat.jours} jours**, un personnage par jour.`);
p(`- **${etat.pretes} fiches prêtes** — leur prompt maître est écrit, leurs cinq scènes sont décrites.`);
p(`- **${etat.aDocumenter} fiches à documenter** — elles n’ont **pas** de prompt : on n’illustre pas ce qu’on n’a pas documenté.`);
p(`- **${etat.scenes} scènes prêtes** sur les ${etat.jours * SCENES_PAR_PERSONNAGE} de la série complète (${etat.jours} × ${SCENES_PAR_PERSONNAGE}).`);
p();
p('| Mois | Fiches prêtes | Jours |');
p('| --- | --- | --- |');
etat.parMois.forEach((m) => p(`| ${m.nom} | ${m.pretes} | ${m.jours} |`));
p();
p('## La direction artistique de la collection');
p();
p('Elle est **écrite une fois** et ne se réinvente pas d’une image à l’autre.');
p();
DIRECTION_ARTISTIQUE.forEach((l) => p(`- ${l}`));
p();
p('### Les interdits');
p();
INTERDITS_VISUELS.forEach((l) => p(`- ${l}`));
p();
p('### Le cadre');
p();
Object.entries(CADRAGE).forEach(([k, v]) => p(`- **${k}** : ${v}`));
p();
p('## Les cinq moments');
p();
p(`Une journée a six temps, et **cinq images** : l’aube, le matin, le midi, l’après-midi, le soir. ${PAS_DIMAGE_LA_NUIT}`);
p();
p('| Moment | Lumière | Posture | Énergie |');
p('| --- | --- | --- | --- |');
MOMENTS_VISUELS.forEach((m) => p(`| ${m.nom} | ${m.lumiere} | ${m.posture} | ${m.energie} |`));
p();
p('Le même personnage, cinq fois : même visage, même silhouette, même garde-robe. Ce qui change, c’est la lumière,');
p('la posture, le décor, l’énergie et la narration.');
p();
p('---');
p();
p('# Les fiches');

/* ————————————————————————— LES FICHES PRÊTES ————————————————————————— */

for (const jour of JOURS_DOCUMENTES) {
  const profil = PROFILS[jour]!;
  const date = dateDuJour(jour);
  const fiche = promptMaitre(profil, date);
  const scenes = scenesDuPersonnage(profil, date);
  const memeNom = (profil.fete ?? '').replace(/^(Saint|Sainte) /, '') === profil.personnage;

  p();
  p(`## ${profil.personnage}${profil.fete && !memeNom ? ` — en ce jour de ${profil.fete}` : ''}`);
  p();
  p(`**${fiche.dateLongue}** · ${profil.fiche.lieu} · ${profil.fiche.epoque}`);
  p();
  p('```text');
  p(`DATE                 ${fiche.dateLongue} (${jour})`);
  p(`SAINT / FÊTE         ${profil.fete ?? '—'}`);
  p(`PERSONNAGE           ${profil.personnage}`);
  p(`ORIGINE              ${profil.fiche.origine}`);
  p(`ÉPOQUE               ${profil.fiche.epoque}`);
  p(`LIEU                 ${profil.fiche.lieu}`);
  p(`MÉTIER               ${profil.fiche.metier}`);
  p(`INVENTION            ${profil.fiche.savoirFaire}`);
  p(`CULTURE              ${profil.fiche.culture}`);
  p(`SIGNIFICATION        ${profil.signification ?? 'à documenter'}`);
  p(`INSPIRATIONS         ${(profil.inspirations ?? ['à documenter']).join(' ; ')}`);
  p(`DIRECTION ARTISTIQUE ${DIRECTION_ARTISTIQUE[0]} ; ${DIRECTION_ARTISTIQUE[1]} ; ${DIRECTION_ARTISTIQUE[3]}`);
  p(`CASTING              ${profil.casting ? `${profil.casting.age}, ${profil.casting.silhouette} — ${profil.casting.gardeRobe}` : 'à documenter'}`);
  profil.ponts.forEach((pont) => p(`${(LIEN[pont.niveau] ?? 'LIEN').padEnd(20)} ${pont.mot} — ${pont.texte}`));
  p('```');
  p();
  p(`<sub>Source : ${profil.source}. Étymologies : ${SIGNIFICATION_SOURCE}.</sub>`);
  p();
  p('### Le prompt maître');
  p();
  p('```text');
  p(fiche.prompt + (fiche.casting.length ? `\n\nDIRECTION DE CASTING\n${fiche.casting.map((l) => `· ${l}`).join('\n')}` : ''));
  p('```');
  p();
  p('### Les cinq scènes — le même, cinq fois');
  p();
  scenes.forEach(({ moment, texte }) => {
    const bloc = (texte.split('MOMENT — ')[1] ?? '').trim();
    p(`**${moment.nom.toUpperCase()} — ${profil.personnage.toUpperCase()}**`);
    p();
    p('```text');
    p(`MOMENT — ${bloc}`);
    p('```');
    p();
  });
  p(`<sub>Version courte pour l’outil d’image : ${fiche.promptTechnique}</sub>`);
  p();
  p('---');
}

/* ————————————————————————— CE QUI ATTEND ————————————————————————— */

p();
p('# Les fiches à documenter');
p();
p('Elles n’ont **pas** de prompt, et c’est voulu : leur personnage n’est pas encore documenté, donc il n’y a rien à');
p('illustrer. Ce sont les journées du calendrier, avec ce qui leur manque.');
p();

for (let mois = 1; mois <= 12; mois += 1) {
  const duMois = entrees.filter((e) => e.mois === mois && e.etat === 'a-documenter');
  if (duMois.length === 0) continue;
  p(`## ${MOIS[mois - 1]!.nom} — ${duMois.length} jour(s)`);
  p();
  duMois.forEach((e) => {
    const qui = e.personnage ? ` · ${e.personnage}` : '';
    p(`- **${e.quantieme} ${MOIS[mois - 1]!.nom}** (${e.jour})${qui} — manque : ${e.manquant.join(' ; ')}.`);
  });
  p();
}

p('---');
p();
p(`**Rappel des niveaux de correspondance :** ${NIVEAUX.map((n) => `${n.nom} (${n.sens})`).join(' · ')}.`);

writeFileSync(join(process.cwd(), 'docs', 'prompts-maitres.md'), `${lignes.join('\n')}\n`, 'utf8');
console.log(`docs/prompts-maitres.md — ${lignes.length} lignes · ${etat.pretes} fiches prêtes sur ${etat.jours}`);


/* ——————————————————————————————————————————————————————————————————————————
   LE SECOND DOCUMENT : LES 365 FICHES DE L'ANNÉE
   Tout ce qu'on sait d'un jour — et ce qui manque, nommé. C'est le document
   « on sera tranquille » : rien n'y est laissé au hasard, et rien n'y est
   inventé non plus.
   —————————————————————————————————————————————————————————————————————————— */

import { etatDeLAnnee, fichesDeLAnnee, METIERS_TRANSMIS } from '../src/lib/fichesAnnee';

const anneeFiches = fichesDeLAnnee(ANNEE);
const etatAnnee = etatDeLAnnee(ANNEE);
const L: string[] = [];
const q = (s = '') => L.push(s);

q('# Les 365 fiches de l’année');
q();
q('> Document **engendré** comme l’autre : `npm run prompts` le réécrit à partir de `src/lib/fichesAnnee.ts`.');
q('> Tout ce qui est ici est vérifié par les tests du site — ce qui n’y est pas n’est pas « à peu près », c’est à documenter.');
q();
q('## Le tableau de l’année');
q();
q(`- **${etatAnnee.jours} journées**, une fiche chacune.`);
q(`- **${etatAnnee.pretes} fiches documentées** — origine, époque, lieu, métier, savoir-faire, culture, sens, ponts, casting.`);
q(`- **${etatAnnee.amorcees} fiches amorcées** — le sens du prénom, et souvent le métier par la tradition : la journée a déjà **une porte**.`);
q(`- **${etatAnnee.aDocumenter} fiches sans rien** — et ce sont **des fêtes**, pas des personnes : ${etatAnnee.fetes} journées de l’année sont des fêtes (la Toussaint, l’Assomption, les armistices), dont la fiche est un texte, pas une biographie.`);
q();
q('Autrement dit : **toutes les journées qui portent un prénom ont au moins le sens de ce prénom.** Rien n’est inventé pour combler les autres — elles disent leur nature.');
q();
q(`Ce que la tradition et les dictionnaires couvrent déjà : **${etatAnnee.avecEtymologie} journées** ont le sens de leur prénom, **${etatAnnee.avecMetier} journées** ont leur métier, et cela ouvre **${etatAnnee.portes} portes** du mariage différentes.`);
q();
q('| Mois | Documentées | Amorcées | Sans rien | Jours |');
q('| --- | --- | --- | --- | --- |');
etatAnnee.parMois.forEach((m) => q(`| ${m.nom} | ${m.pretes} | ${m.amorcees} | ${m.aDocumenter} | ${m.jours} |`));
q();
q('## Les métiers, et les portes qu’ils ouvrent');
q();
q('C’est la liste des saints patrons **telle qu’elle est transmise** : on la cite, on ne l’invente pas.');
q('Les attributions varient d’une liste à l’autre, et certaines sont multiples — c’est dit.');
q();
q('| Métier | Saint | La porte du mariage |');
q('| --- | --- | --- |');
METIERS_TRANSMIS.forEach((p) => q(`| ${p.metier} | ${p.saint} | ${p.mot} |`));
q();
q('---');

const MOIS_PLEINS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

MOIS_PLEINS.forEach((nomMois, index) => {
  const duMois = anneeFiches.filter((f) => Number(f.jour.slice(0, 2)) === index + 1);
  q();
  q(`# ${nomMois.charAt(0).toUpperCase()}${nomMois.slice(1)} — ${duMois.length} jours`);
  duMois.forEach((f) => {
    q();
    const marque = f.etat === 'prete'
      ? '**Documentée.**'
      : f.etat === 'amorcee'
        ? '**Amorcée.**'
        : f.categorie === 'fete'
          ? '**Une fête, pas une personne.**'
          : '**À documenter.**';
    q(`### ${f.dateLongue} — ${f.personnage}`);
    q();
    q(`${marque}${f.enCeJourDe ? ` Le personnage du jour ouvre le numéro — ${f.enCeJourDe}, la fête du calendrier.` : ''}`);
    q();
    q('```text');
    q(`FÊTE DU CALENDRIER   ${f.fete}`);
    q(`CARTE                ${f.carte} · semaine ${f.semaine} · n° ${f.numero}`);
    q(`SAISON               ${f.saison.nom} ${f.saison.symbole} — fond ${f.fond}${f.dense ? ' (assombri : temps clos)' : ''}${f.pasCommeLesAutres ? ` (noir : ${f.raison})` : ''}`);
    q(`CIEL ET LUNE         ${f.ciel} · ${f.lune}`);
    q(`CHIFFRE DU JOUR      ${f.chiffre}`);
    q(`SIGNIFICATION        ${f.signification ?? 'à documenter'}`);
    q(`MÉTIER (tradition)   ${f.metiers.length > 0 ? f.metiers.join(' ; ') : 'à documenter'}`);
    q(`PORTES OUVERTES      ${f.portes.length > 0 ? f.portes.join(' ; ') : '—'}`);
    if (f.historique) {
      q(`ORIGINE              ${f.historique.origine}`);
      q(`ÉPOQUE               ${f.historique.epoque}`);
      q(`LIEU                 ${f.historique.lieu}`);
      q(`MÉTIER (documenté)   ${f.historique.metier}`);
      q(`SAVOIR-FAIRE         ${f.historique.savoirFaire}`);
      q(`CULTURE              ${f.historique.culture}`);
    }
    f.ponts.forEach((pont, i) => q(`${`PONT ${i + 1}`.padEnd(20)} (${pont.niveau}) ${pont.mot} — ${pont.texte}`));
    if (f.casting) q(`CASTING              ${f.casting.age}, ${f.casting.silhouette} — ${f.casting.gardeRobe}`);
    f.inspirations.forEach((inspiration, i) => q(`${`INSPIRATION ${i + 1}`.padEnd(20)} ${inspiration}`));
    q('```');
    if (f.etat === 'prete') {
      q();
      q('<sub>Son prompt maître et ses cinq scènes sont dans `docs/prompts-maitres.md`.</sub>');
    } else if (f.categorie === 'fete') {
      q();
      q('<sub>Sa fiche s’écrit comme un texte : ce que la fête raconte, et par où elle touche un mariage. Elle ne se documente pas comme une biographie.</sub>');
    } else if (f.manquant.length > 0) {
      q();
      q(`<sub>À documenter : ${f.manquant.join(' ; ')}.</sub>`);
    }
    if (f.source) {
      q(`<sub>Source : ${f.source}.</sub>`);
    }
  });
});

q();
q('---');
q();
q(`**${etatAnnee.pretes} fiches documentées**, ${etatAnnee.amorcees} amorcées, ${etatAnnee.aDocumenter} sans rien — sur ${etatAnnee.jours}.`);
q();
q('La règle n’a pas bougé : **on n’illustre pas ce qu’on n’a pas documenté, et on n’écrit pas ce qu’on ne sait pas.**');

writeFileSync(join(process.cwd(), 'docs', 'fiches-de-l-annee.md'), `${L.join('\n')}\n`, 'utf8');
console.log(`docs/fiches-de-l-annee.md — ${L.length} lignes · ${etatAnnee.pretes} documentées, ${etatAnnee.amorcees} amorcées, ${etatAnnee.aDocumenter} sans rien`);

/* ——————————————————————— LE CASTING DES VISUELS ——————————————————————— */

const casting = etatDuCasting(ANNEE);
const fonds = fondsDeCouvertureDeLAnnee(ANNEE);
const scenes = scenesDeLAnnee(ANNEE);

const C: string[] = [];
const c = (ligne = '') => C.push(ligne);

c('# Le casting des visuels — les 365 fonds, et les 1 825 scènes');
c();
c('> **Engendré par `npm run prompts`.** Ce document ne s’écrit pas à la main : il');
c('> donne **la liste de ce qui est attendu**, avec le nom exact des fichiers, pour');
c('> que la production se fasse par lots et que le site prenne les images **dès');
c('> qu’elles arrivent**.');
c();
c(`**${casting.fonds} fonds de couverture** (un par jour) · **${casting.scenes} scènes** (cinq moments par jour, le même personnage cinq fois) · **${casting.personnages} personnages** dans l’année.`);
c();
c(`Aujourd’hui : **${casting.scenesAvecBrief} scènes ont leur brief** (les fiches documentées), **${casting.scenesSansFiche} attendent leur fiche**. Un brief ne s’invente pas : *on n’illustre pas ce qu’on n’a pas documenté*.`);
c();
c('---');
c();
c('## 1. Où l’on dépose les images, et comment elles s’appellent');
c();
c('Un dossier par jour de l’année, en `MM-JJ`, sous `public/images/magazine/` :');
c();
c('```');
c('public/images/magazine/09-21/');
c('  couverture.jpg      ← le fond de la couverture (le premier rang)');
c('  couverture-2.jpg    ← une seconde candidate (jusqu’à -3)');
c('  aube.jpg            ← le personnage, au premier des cinq moments');
c('  matin.jpg');
c('  midi.jpg');
c('  apres-midi.jpg');
c('  soir.jpg');
c('```');
c();
c(`**${RANGS_PAR_PLAN} rangs par plan** : le premier est celui qu’on veut, les autres sont`);
c('**des candidates** — c’est le **casting** qui choisit (`src/lib/castingVisuels.ts`).');
c();
c('Après avoir déposé des images : `npm run photos` relève ce qui est arrivé. Le site');
c('prend **la photo** là où elle est, et **le dessin** partout ailleurs : une image');
c('manquante ne casse jamais une page.');
c();
c('**La nuit n’a pas d’image** : ' + PAS_DIMAGE_LA_NUIT);
c();
c('---');
c();
c('## 2. Comment on choisit, quand il y a plusieurs candidates');
c();
c('On ne choisit pas « la plus belle » — ça ne veut rien dire. On choisit **celle qui');
c('répond au brief**, et **on dit pourquoi** :');
c();
c('| critère | poids | ce qu’on regarde |');
c('| --- | --- | --- |');
c('| le moment | 3 | l’image montre-t-elle bien l’aube, le midi, le soir ? |');
c('| la lumière | 2 | la lumière décrite est-elle celle du moment ? |');
c('| la couleur | 2 | la dominante est-elle proche de la couleur du jour ? |');
c('| le cadrage | 1 | est-ce bien du 5 / 7 ? |');
c('| le sujet | 1 | voit-on ce que la scène demande ? |');
c();
c('Ce que la personne qui produit l’image déclare par candidate — le moment, la');
c('lumière, la couleur dominante, les dimensions, ce qu’on y voit — suffit à noter.');
c('À égalité, **c’est le premier rang qui reste** : l’ordre des fichiers est un ordre.');
c();
c('---');
c();
c('## 3. Le format, la direction, les interdits');
c();
c('**Le cadre** :');
c();
for (const [cle, valeur] of Object.entries(CADRAGE)) c(`- **${cle}** — ${valeur}`);
c();
c('**La direction artistique** — elle ne se réinvente pas :');
c();
for (const ligne of DIRECTION_ARTISTIQUE) c(`- ${ligne}`);
c();
c('**Les interdits** — ils sont dans le prompt, et ils se vérifient sur l’image :');
c();
for (const ligne of INTERDITS_VISUELS) c(`- ${ligne}`);
c();
c('---');
c();
c('## 4. Les 365 fonds de couverture — disponibles tout de suite');
c();
c('Un fond ne dépend d’aucune fiche : la couverture sait déjà sa couleur, sa saison');
c('et son titre. Ce qu’on demande, c’est **une matière du jour** — pas une');
c('illustration : un fond qui tient sous du texte.');
c();
c('| jour | couverture | couleur | fichier attendu |');
c('| --- | --- | --- | --- |');
for (const fond of fonds) {
  c(`| ${fond.jour} | ${fond.titre} | \`${fond.palette}\` | \`${fond.fichiers[0]}\` |`);
}
c();
c('---');
c();
c('## 5. Les 1 825 scènes — cinq moments, un seul personnage');
c();
c('Cinq images par jour : **le même personnage**, cinq fois. Le premier moment sert de');
c('référence aux quatre autres (c’est la règle de la maison : on garde le même');
c('visage, la même silhouette, le même stylisme — seule la lumière change).');
c();
c('| jour | personnage | moment | état | fichier attendu |');
c('| --- | --- | --- | --- | --- |');
for (const scene of scenes) {
  c(`| ${scene.jour} | ${scene.personnage} | ${scene.moment?.nom ?? ''} | ${scene.documentee ? 'prête' : 'à documenter'} | \`${scene.fichiers[0]}\` |`);
}
c();
c('---');
c();
c(`**${FONDS_ATTENDUS} fonds · ${SCENES_ATTENDUES} scènes · ${RANGS_PAR_PLAN} rangs possibles par plan.**`);
c();
c('Le brief de chaque scène documentée est dans `docs/prompts-maitres.md` ; la fiche');
c('de chaque jour, avec ce qui lui manque, est dans `docs/fiches-de-l-annee.md`.');
c();

writeFileSync(join(process.cwd(), 'docs', 'casting-des-couvertures.md'), `${C.join('\n')}\n`, 'utf8');
console.log(
  `docs/casting-des-couvertures.md — ${C.length} lignes · ${casting.fonds} fonds · ${casting.scenes} scènes (${casting.scenesAvecBrief} avec brief)`,
);
