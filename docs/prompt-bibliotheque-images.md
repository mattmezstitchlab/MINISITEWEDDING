# PROMPT À DONNER À GEMINI / ARENA STUDIO / LEONARDO / UNE AUTRE CONVERSATION — LA BIBLIOTHÈQUE D'IMAGES SUR GITHUB

> **Mode d'emploi.** Copiez le bloc ci-dessous dans la conversation de votre
> choix (Gemini, Arena Studio, Leonardo, ou une autre conversation Arena) : il
> décrit **la bibliothèque d'images à construire**, comme un dépôt GitHub à part
> qui servira **de serveur et de liens** au site. Le site, lui, est déjà prêt à
> la consommer : les noms de fichiers, la déclaration de chaque image et les
> cinq critères de choix sont déjà écrits dans son code.

---

```
Tu construis la bibliothèque d'images de AIME MAGAZINE : un dépôt GitHub à part,
qui servira de SERVEUR et de LIENS au site. Le site attend des fichiers, des
noms exacts, et une déclaration par image. Tout le reste — l'outil de
génération, le rythme, les lots — est ta liberté.

## CE QUE LE SITE ATTEND, SANS NÉGOCIATION

1. UN DOSSIER PAR JOUR DE L'ANNÉE, au format MM-JJ :

   images/
     01-01/
     01-02/
     …
     12-31/

2. SIX PLANS PAR JOUR, avec des noms de fichiers EXACTS :

   MM-JJ/couverture.jpg      le fond de la couverture
   MM-JJ/aube.jpg            les cinq moments de lumière
   MM-JJ/matin.jpg
   MM-JJ/midi.jpg
   MM-JJ/apres-midi.jpg
   MM-JJ/soir.jpg

   La NUIT n'a pas d'image : elle garde le dessin du site. C'est une règle,
   pas un manque.

3. TROIS RANGS PAR PLAN, quand il y a plusieurs candidates : le premier est
   celui qu'on veut, les autres sont des candidates de casting :

   MM-JJ/couverture.jpg | couverture-2.jpg | couverture-3.jpg

4. DEUX FAMILLES D'IMAGES, PAS AU MÊME POINT :
   - 365 FONDS DE COUVERTURE : un par jour, disponibles tout de suite — une
     matière du jour, sans visage ni objet identifiable, qui tient du texte
     par-dessus ;
   - 1 825 SCÈNES : cinq moments par jour, LE MÊME PERSONNAGE CINQ FOIS. Une
     scène ne se produit que si le personnage est documenté (on n'illustre pas
     ce qu'on n'a pas documenté). L'AUBE est l'image de référence : les quatre
     autres gardent le même visage, la même silhouette, le même stylisme —
     seule la lumière change.

## LA DÉCLARATION DE CHAQUE IMAGE

Chaque image produite porte sa déclaration, dans un fichier `manifeste.json` à
la racine du dépôt — c'est elle qui permet au site de choisir sans voir :

{
  "fichier": "images/09-21/midi-2.jpg",
  "moment": "midi",                  // aube | matin | midi | apres-midi | soir | couverture
  "lumiere": "dure, studio, graphique",
  "couleur": "#86B87F",              // la dominante, en #RRGGBB
  "largeur": 1000,
  "hauteur": 1400,                   // le format demandé est 5 / 7
  "contient": ["matthieu", "portrait"],
  "note": "candidate 2 — ombre plus nette"
}

## LES CINQ CRITÈRES DE CHOIX DU SITE (le casting juge avec eux)

| critère | poids | ce qu'on regarde |
| --- | --- | --- |
| le moment | 3 | l'image montre-t-elle bien l'aube, le midi, le soir ? |
| la lumière | 2 | la lumière décrite est-elle celle du moment ? |
| la couleur | 2 | la dominante est-elle proche de la couleur du jour ? |
| le cadrage | 1 | est-ce bien du 5 / 7 ? |
| le sujet | 1 | voit-on ce que la scène demande ? |

Une image qui ne peut pas déclarer ces cinq champs ne sert à rien : la
déclaration fait partie de l'image.

## LA DIRECTION ARTISTIQUE

- photographie éditoriale de mode, pas une illustration ;
- une véritable direction de casting : un visage, un âge, une silhouette tenus ;
- stylisme contemporain, matières nobles, coupes nettes ;
- mise en scène cinématographique, une intention par image ;
- fond et lumière maîtrisés : une source décidée, une ombre assumée ;
- format 5 / 7, portrait, 85 mm ou 50 mm, ouverture ouverte ;
- grain fin, couleurs désaturées sauf la couleur de la saison.

INTERDITS : aucun kitsch religieux, aucune icône, aucune auréole, aucun vitrail ;
aucune silhouette anonyme ni foule ; pas d'illustration, pas de cartoon, pas de
rendu 3D lisse.

## CE QUE TU DOIS CONSTRUIRE, DANS CE DÉPÔT

1. `manifeste.json` — la déclaration de chaque image, au format ci-dessus.
2. `images/` — les dossiers MM-JJ et leurs fichiers, aux noms exacts.
3. `LISEZ-MOI.md` — comment produire un lot : le personnage, sa fiche, les cinq
   moments, la déclaration à remplir.
4. Les scripts ou la méthode qui produisent les images PAR LOTS de 16 journées
   (16 personnages × 5 scènes = 80 images), l'aube d'abord, puis les quatre
   autres tenues sur la même référence.
5. Le dépôt servi tel quel : les liens bruts du dépôt (ou GitHub Pages) sont les
   URLs que le site appellera — aucun serveur intermédiaire.

## L'ORDRE DE PRODUCTION

1. Les 365 FONDS DE COUVERTURE d'abord — ils n'attendent personne.
2. Puis les scènes, par journées documentées, en commençant par celles qui ont
   déjà leur brief (16 journées aujourd'hui, 80 scènes).
3. Chaque lot produit remplit le manifeste : le site prend la photo là où elle
   est, et garde son dessin partout ailleurs. Une image manquante ne casse
   jamais une page.

Commence par me proposer la structure exacte du dépôt, la méthode de production
par lots, et le format du manifeste que tu vas écrire — puis attends ma
validation avant de produire le premier lot.
```
