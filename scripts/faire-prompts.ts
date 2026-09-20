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
