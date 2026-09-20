# PROMPT À DONNER À GEMINI / ARENA STUDIO / LEONARDO / UNE AUTRE CONVERSATION — LA BIBLIOTHÈQUE DES 54 MAGAZINES

> **Mode d'emploi.** Copiez le bloc ci-dessous dans la conversation de votre
> choix : il décrit **la bibliothèque d'images à construire**, comme un dépôt
> GitHub à part qui sert de **serveur et de liens** au site. Le site, lui, est
> déjà prêt à la consommer : les noms de fichiers, les 432 déclarations et le
> plan de production sont déjà écrits dans son code
> (`npm run prompts:aime`, `npm run visuels`).
>
> **Ce qui a changé.** L'ancien modèle demandait **365 fonds + 1 825 scènes**
> (un dossier par jour, `MM-JJ`). Le nouveau demande **54 couvertures + 378
> chapitres** (un dossier par semaine, `semaine-01` … `semaine-54`). Les deux
> anciens dossiers restent lus comme repli de transition, mais la bibliothèque à
> produire est celle-ci :

---

```
Tu construis la bibliothèque d'images de AIME MAGAZINE : un dépôt GitHub à part,
qui sert de SERVEUR et de LIENS au site. Le site attend des fichiers, des noms
exacts, et une déclaration par image. Tout le reste — l'outil de génération, le
rythme, les lots — est ta liberté.

## LE MODÈLE, SANS NÉGOCIATION

UN DOSSIER PAR MAGAZINE — une semaine de l'année, 54 en tout :

   images/
     semaine-01/
     semaine-02/
     …
     semaine-54/

HUIT FICHIERS PAR MAGAZINE, aux noms EXACTS :

   semaine-NN/cover.jpg          la couverture du magazine
   semaine-NN/01-amoureux.jpg    chapitre 01 — Les Amoureux
   semaine-NN/02-style.jpg       chapitre 02 — Le Style
   semaine-NN/03-lieux.jpg       chapitre 03 — Les Lieux
   semaine-NN/04-recevoir.jpg    chapitre 04 — L'Art de recevoir
   semaine-NN/05-fete.jpg        chapitre 05 — La Fête
   semaine-NN/06-monde.jpg       chapitre 06 — Le Monde
   semaine-NN/07-souvenirs.jpg   chapitre 07 — Les Souvenirs

   semaine-53 = le 31 décembre (le jour de trop)
   semaine-54 = le 29 février (le jour bissextile)
   Les deux ont leurs sept chapitres, comme les autres.

TOTAL : 54 couvertures + 378 chapitres = 432 images.
FORMAT : 5 / 7, portrait, 1000 × 1400, ≤ 250 Ko.

LES SEPT CHAPITRES SONT TOUJOURS LES MÊMES. Ce qui change à chaque semaine,
c'est la DIRECTION ARTISTIQUE : matière, motif, lumière, palette, et le sujet
propre à chacun des sept chapitres (écrits dans le code du site, semaine par
semaine — demande-les si tu ne les as pas).

## LA RÈGLE ABSOLUE

Ne produis pas « des images de mariage ». Construis une bibliothèque éditoriale
sur l'univers du mariage : une robe, une table, une ville, une chanson, une
architecture, un objet transmis, une famille, un voyage — le mariage est le
TERRITOIRE, pas le sujet. Sors de l'imagerie conventionnelle : pas de mariés
souriants, pas d'alliances en gros plan, pas de bouquet sage, pas d'arche de
fleurs.

DIVERSITÉ : éditorial, mode, cinéma, documentaire, architecture, voyage,
gastronomie, musique, art, culture, luxe, minimalisme, noir & blanc, argentique,
rue, nature, surréalisme, pop, rétro, contemporain, brutalisme, Méditerranée,
Japon, Inde, Afrique, Amérique latine, pays nordiques, France, Italie, États-Unis.

SAISONS : hiver (neige, intérieur, lumière chaude, montagne, nuit) ;
printemps (fleurs, jardins, renaissance, lumière douce) ; été (Méditerranée, mer,
voyage, soleil, fête, extérieur) ; automne (forêt, architecture, gastronomie,
terre, cinéma, lumière dorée). Une saison ne doit pas devenir une formule.

COHÉRENCE : les sept images d'une semaine forment UN magazine — même palette,
même matière, même lumière. Chaque chapitre reste immédiatement identifiable.

## LA DÉCLARATION DE CHAQUE IMAGE

Chaque image porte sa déclaration, dans `manifeste.json` à la racine du dépôt :

{
  "fichier": "images/semaine-38/04-recevoir.jpg",
  "semaine": 38,
  "chapitre": "04-recevoir",
  "titre": "L'Art de recevoir",
  "univers": "Tables, gastronomie, pâtisserie, fleurs, décoration, objets",
  "saison": "Été",
  "style": "Lumière d'arrière-saison, éditorial",
  "sujet": "des figues, du miel et du vin blanc, table sous les arbres",
  "dominante_color": "#C98A3E",
  "description": "…une phrase qui dit ce qu'on voit…",
  "mots_cles": ["arrière-saison", "éditorial", "table", "mariage"]
}

## INTERDITS

aucun texte, aucun lettrage, aucun logo, aucun filigrane ; aucune icône
religieuse, aucun vitrail, aucune auréole ; aucune illustration, aucun rendu 3D
lisse, aucun cartoon ; aucune image empruntée à une autre semaine.

## L'ORDRE DE PRODUCTION

1. LES 54 COUVERTURES d'abord : ce sont les portes d'entrée, et elles suffisent
   à faire vivre la collection.
2. PUIS LES SEPT CHAPITRES, semaine par semaine (huit images par lot).
3. Chaque lot livré se relève d'un coup : le site prend les photos là où elles
   sont, garde ses dessins partout ailleurs, et dit ce qui manque.

Commence par me proposer la structure exacte du dépôt, la méthode de production
par lots, et le format du manifeste — puis attends ma validation avant de
produire le premier lot.
```

Le site n'attend pas la bibliothèque pour fonctionner : **le dessin tient la
place**, et le repli est visible (« à paraître »). Voir
`docs/magazine-54-semaines.md` pour le mapping complet.
