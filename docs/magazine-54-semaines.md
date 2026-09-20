# AIME MAGAZINE — 54 SEMAINES, 7 CHAPITRES

> **Ce qui a changé.** Le modèle « 365 jours → 365 magazines » est abandonné.
> Le nouveau modèle est **54 magazines hebdomadaires, sept chapitres chacun**,
> et les 365 dates du calendrier deviennent la **navigation temporelle** dans
> cette collection. Ce document dit exactement comment le site calcule, où sont
> les fichiers, ce qu'on attend de la bibliothèque, et ce que deviennent les
> anciens visuels.

---

## 1. Le modèle, en une ligne

```
DATE → NUMÉRO DE SEMAINE → MAGAZINE → CHAPITRE → ASSET
```

- **365 jours** : les portes d'entrée. Le calendrier annuel et la navigation
  quotidienne sont conservés tels quels.
- **54 magazines** : 52 semaines réelles (n° 1 à 52) + deux jours de trop
  (n° 53 et 54, voir §4). Le magazine est **hebdomadaire**.
- **7 chapitres** : les mêmes chaque semaine, dans le même ordre.
- **378 images de chapitres** + **54 couvertures** = **432 visuels**.

## 2. Les sept chapitres — fixes

| N° | Titre | Fichier | Territoire |
| --- | --- | --- | --- |
| 01 | Les Amoureux | `01-amoureux.jpg` | Couple, rencontre, engagement, famille, émotions, relations humaines |
| 02 | Le Style | `02-style.jpg` | Robe, costume, beauté, coiffure, bijoux, accessoires, fleurs, mode |
| 03 | Les Lieux | `03-lieux.jpg` | Châteaux, maisons, hôtels, villes, campagnes, plages, architecture, destinations |
| 04 | L'Art de recevoir | `04-recevoir.jpg` | Tables, gastronomie, pâtisserie, fleurs, décoration, objets, art de la table |
| 05 | La Fête | `05-fete.jpg` | Musique, danse, DJ, scène, lumière, cocktails, nuit, spectacle |
| 06 | Le Monde | `06-monde.jpg` | Cultures, traditions, voyages, patrimoine, peuples, cérémonies |
| 07 | Les Souvenirs | `07-souvenirs.jpg` | Photographie, vidéo, albums, lettres, objets, archives, transmission |

Le **traitement** des sept chapitres change à chaque semaine : c'est la
**direction artistique** du numéro (`src/lib/directionsDuMagazine.ts`) — matière,
motif, lumière, palette, et un sujet écrit pour chacun des sept chapitres.

> **Le mariage reste le territoire.** Une robe, une table, une ville, une
> chanson, une architecture, un objet transmis parlent du mariage — sans jamais
> montrer l'imagerie nuptiale conventionnelle. Les 54 directions explorent :
> minimalisme nordique, documentaire d'atelier, intérieur, pop rétro, matières
> nobles, cinéma, papeterie, montagne, noir & blanc, patrimoine, Orient
> contemporain, baroque, botanique, rue, impression, design, brocante, cottage
> anglais, floral, terroir, surréalisme, Inde, art contemporain, gastronomie,
> folklore, Corse, art de recevoir, cinéma d'été, jazz, dolce vita, americana,
> table de village, Venise, Japon, Mexique, argentique, côte volcanique,
> arrière-saison, forêt, brutalisme, rentrée, cinéma 70, mode, Toscane, studio
> photo, Maroc, vins, Afrique contemporaine, château d'aujourd'hui, archives,
> fin de saison, table d'hiver, et les deux jours de trop.

## 3. Le calendrier, tel qu'il est réellement

Le site découpe l'année en **blocs de sept jours depuis le 1ᵉʳ janvier**
(`semaineDeLAnnee`, `jeuDeCartes.ts` §39) :

- semaine 1 = du 1ᵉʳ au 7 janvier, semaine 38 = du 17 au 23 septembre 2026 ;
- **52 × 7 = 364 jours** couverts, et un jour qui reste : le 31 décembre.

**Pourquoi pas la semaine ISO ?** Parce qu'elle compte **53 semaines** certaines
années : il faudrait alors une 55ᵉ couverture, que la collection n'a pas. Le
découpage maison retombe toujours sur 52 semaines pleines — et c'est celui qui
était déjà dans le produit. Aucun deuxième calendrier n'a été introduit.

### Le chapitre d'une date

C'est la **position du jour dans sa semaine** : jour 1 → chapitre 01, jour 7 →
chapitre 07. Chaque magazine présente donc **ses sept chapitres, une fois
chacun, dans l'ordre** — et la même date donne toujours le même chapitre.

Exemple réel : **21 septembre 2026** — la semaine 38 commence le **17 septembre**,
donc le 21 en est le **5ᵉ jour** → *Magazine 38 « Septembre doré »*, **chapitre
05 — La Fête**.

## 4. Les 365 jours et les 54 semaines — les 13 jours de plus

`54 × 7 = 378`, et une année compte 365 ou 366 jours : il y a **13 emplacements
de plus que de jours**. Ce sont **des emplacements d'images, pas des jours** — on
n'invente aucune date.

| | | |
| --- | --- | --- |
| 52 semaines × 7 jours | **364 jours** | chacun ouvre un chapitre de sa semaine |
| 31 décembre | **magazine 53** — le jour de trop | joker, hors calendrier |
| 29 février (bissextiles) | **magazine 54** — le jour bissextile | joker, hors calendrier |

Les deux jokers sont **des magazines comme les autres** : ils ont un titre, une
direction artistique, une couverture et **leurs sept chapitres** (c'est la
promesse de la collection). Aucun jour du calendrier ne les ouvre chapitre par
chapitre — sauf par la **règle de transition** :

> Les deux jours de trop prennent **le chapitre de leur jour de semaine** :
> lundi → 01 Les Amoureux, dimanche → 07 Les Souvenirs.

C'est la seule règle spéciale du système, elle est écrite dans
`positionDansLeMagazine()` et vérifiée par les tests. Les 14 emplacements de
chapitres des jokers (2 × 7) restent donc disponibles : ils se rempliront comme
les autres, et ne serviront qu'aux deux jours de trop.

## 5. Où le mapping vit — une seule source

| Ce que ça fait | Fichier |
| --- | --- |
| Les 7 chapitres, leurs noms de fichiers, leurs briefs | `src/lib/chapitres.ts` |
| Les 54 directions artistiques (titre, style, matière, motif, lumière, palette, sujet des 7 chapitres) | `src/lib/directionsDuMagazine.ts` |
| **L'assemblage** : 54 magazines, 7 chapitres chacun, et tout le mapping date → semaine → chapitre | `src/lib/semaines.ts` |
| **La cascade des images** : chapitre → couverture de la semaine → ancien visuel du jour → dessin | `src/lib/visuelsDuMagazine.ts` |
| L'inventaire de ce qui est livré (engendré) | `src/lib/bibliothequeMagazine.ts` |
| L'ancien système par jour (repli de transition) | `src/lib/photosDuMagazine.ts` |

Fonctions publiques utiles :

```ts
numeroDeMagazine(date)          // 1…54 (53 le 31/12, 54 le 29/02)
magazineDeLaDate(date)          // getMagazineForDate
chapitreDeLaDate(date)          // getChapterForDate
positionDansLeMagazine(date)    // 1…7 → le chapitre
joursDuMagazine(numero, annee)  // les jours du magazine, dans l'ordre des chapitres
voisinDuChapitre(date, annee, ±1) // la navigation éditoriale, sans changer de magazine
niveauxDuJour(date)             // les trois niveaux, écrits : jour, magazine, chapitre
```

## 6. La bibliothèque — structure et nommage

```
public/images/magazine/
  semaine-01/
    cover.jpg            54 couvertures attendues
    01-amoureux.jpg      378 chapitres attendus
    02-style.jpg
    03-lieux.jpg
    04-recevoir.jpg
    05-fete.jpg
    06-monde.jpg
    07-souvenirs.jpg
  semaine-02/ … semaine-54/
  manifeste.json         les 432 déclarations (plan complet, livré ou non)
```

- `semaine-53/` = le jour de trop · `semaine-54/` = le jour bissextile.
- Format demandé : **5 / 7**, 1000 × 1400 recommandé, ≤ 250 Ko.
- Après avoir déposé des images : **`npm run visuels`** relève ce qui est arrivé,
  réécrit `src/lib/bibliothequeMagazine.ts` et `manifeste.json`, compresse les
  fichiers trop lourds, et **dit ce qui manque**.
- Les prompts de production sont engendrés par **`npm run prompts:aime --
  --semaine=26`** (ou `--liste` pour l'état de la collection).

Chaque déclaration du manifeste porte : `semaine`, `chapitre`, `titre`,
`univers`, `saison`, `style`, `sujet`, `dominante_color`, `description`,
`mots_cles`, plus `livree`.

## 7. Les couvertures

La couverture appartient à **la semaine**, pas au jour : les sept jours du
magazine 38 partagent `semaine-38/cover.jpg`. C'est la porte d'entrée du numéro,
et elle doit annoncer **un univers**, pas montrer un mariage.

`CouvertureJour` (le composant) affiche une couverture par date : le visuel de
la semaine, la marque, **le numéro du magazine**, le titre du jour, **le
chapitre**, et la date. Le kiosque (`GalerieCouvertures`) affiche d'abord **les
54 magazines** de la collection, puis **les 365 jours** — les deux dimensions du
modèle, dans l'ordre.

## 8. Ce que devient l'ancien système `date → image`

Il est **refactorisé, pas conservé en parallèle** :

| Ancien | Nouveau |
| --- | --- |
| `images/magazine/09-21/couverture.jpg` — 365 fonds, un par jour | `images/magazine/semaine-38/cover.jpg` — **54 couvertures, une par semaine** |
| `images/magazine/09-21/{aube,matin,midi,apres-midi,soir}.jpg` — 1 825 scènes, cinq par jour | `images/magazine/semaine-38/0X-….jpg` — **378 chapitres**, sept par semaine |
| `couvertureDuJour(date)` portait l'identité du jour | il porte le **dessin** du jour ; l'identité vient du magazine |
| `photoDuPlan(jour, 'couverture')` était la source principale | il est le **repli de transition** (3ᵉ rang), jamais l'image d'une autre semaine |

Les fichiers déjà livrés (dossiers `MM-JJ`, `public/images/biblio/`) **restent sur
le disque** : rien n'est détruit. `npm run visuels` affiche, pour chaque ancien
visuel présent, le chemin de la bibliothèque vers lequel il serait remappé
(`09-21/couverture.jpg` → `semaine-38/cover.jpg`), et `photosDuMagazine.ts`
continue d'être relevé par `npm run photos`.

## 9. Les replis — jamais l'image d'une autre semaine

```
1. semaine-NN/0X-chapitre.jpg   l'image du chapitre        ← ce qu'on veut
2. semaine-NN/cover.jpg          la couverture du magazine  ← l'identité de la semaine
3. MM-JJ/couverture.jpg          l'ancien visuel de CE jour ← transition
4. le dessin                     le cadran, le fond de la saison
```

- Une image manquante **ne casse jamais une page** : le dessin tient, avec la
  couleur de la saison et la palette du magazine.
- Un chapitre manquant **ne prend jamais** le visuel d'une autre semaine : au
  pire, il prend la couverture de **sa** semaine, et le dit.
- L'absence est **détectable** : chaque réponse porte son `origine` et sa
  `raison`, affichées à l'écran (« à paraître », « la couverture du magazine
  reste à livrer ») et vérifiées par les tests.

## 10. L'état de la bibliothèque

`npm run prompts:aime -- --liste` donne, magazine par magazine : saison, état de
la couverture, nombre de chapitres livrés. À ce jour : **les couvertures de la
collection sont produites en premier** (elles sont les portes d'entrée), puis les
chapitres, semaine par semaine — 432 visuels sont attendus au total.

## 11. La page du magazine : une couverture, cinq blocs

L'information a été **simplifiée** : la page disait la même chose sous dix
formes (les quatre saisons, les treize semaines, le mur des 365 couvertures, les
éditions de thème, le profil du jour, les six temps, le chiffre). Elle dit
maintenant une chose, et une seule, en **un hero et cinq blocs** :

```
LA COUVERTURE      l'image du magazine, le CADRAN À AIGUILLES dessus,
                   les trois niveaux (jour → magazine → chapitre)
LES 7 CHAPITRES    la navigation éditoriale de la semaine ouverte
1. L'ÉDITEUR       la saisie, et le magazine qu'elle compose (24 pages)
2. L'ATELIER       la timeline du site, avec la collection dedans
3. LA COLLECTION   les 54 couvertures, par saison
4. LES ARTICLES    ce qui se lit — et ce qui parle d'un métier
5. LA LUMIÈRE      « Se montrer, et élever les autres »
```

### Le cadran, et la capsule

Le cadran est **le même composant partout** (`CadranDuMagazine.tsx`) :

| où | ce qu'il montre |
| --- | --- |
| la couverture | la grande aiguille : l'heure de la capsule ; la petite : le chapitre de la date |
| le dock du bas | la miniature, plus la lecture « Magazine 38 · ch. 05 · 20 h » |
| (le kiosque) | la vignette, sans les nombres |

Le dock **commande** le temps (`capsuleCommande.ts` : l'aube 6 h, le matin 9 h,
le midi 12 h, l'après-midi 15 h, le soir 20 h — ou l'heure réelle), la page
**publie ses repères** (`publierReperes` : magazine, chapitre, jour). La
couverture et le dock ne peuvent donc pas dire deux choses différentes.

### L'atelier du temps

La timeline de la page est **celle de l'atelier** (`TimelineTheaterStudio`) :
règle graduée, blocs déplaçables, inspecteur, tête de lecture. Elle reçoit sa
source de `timelineDeLaCollection.ts` :

- **un bloc par magazine** — durée `TIMELINE_TOTAL_MINUTES / 54`, sept
  chapitres dessous, la couverture livrée en vignette, le style en sous-titre ;
- **une graduation par magazine** — son numéro, et la date de son premier jour ;
- **la tête de lecture sur le magazine de la date** (`magazineDeLaDate`, la
  source unique) ;
- cliquer un bloc **ouvre le magazine** (`?jour=MM-JJ`).

Depuis le dock, la même languette propose **deux sources** : *l'année* (la
collection) et *le jour J* (les moments du mariage, l'atelier d'origine).

## 12. L'application : la scène, et la barre du bas

Le magazine ne se visite pas comme une page : il se tient **comme une
application**. Un écran, une image plein cadre, et une barre qui ne bouge
jamais.

```
┌───────────────────────────────────────────────────────┐
│ SUPER MAGAZINE                       N° 38  (cadran)  │
│                                                        │
│           L'IMAGE DU CHAPITRE, PLEIN CADRE             │
│                                                        │
│ 20 septembre → Magazine 38 → Chapitre 04               │
│ Septembre doré                                         │
│ éditorial · Davy · chapitre 04 — L'Art de recevoir     │
│ 01 02 03 04 05 06 07   ← les sept chapitres, au doigt  │
│ ‹  glisser · jour 1 sur 7  ›                           │
├───────────────────────────────────────────────────────┤
│ LES 54 SEMAINES 01 … 38 … 54            [ L'atelier ]  │  la timeline
│ [Couverture][01][02][03][04][05][06][07]               │  les visuels
│ (Point Zéro) (l'aube…le soir) (le cadran)              │  la capsule
└───────────────────────────────────────────────────────┘
```

- **La scène** (`SceneDuMagazine.tsx`) prend `100svh`, sous l'encoche et la barre
  du système (`viewport-fit=cover`). On **glisse** le visuel pour changer de
  jour (le geste a l'élasticité d'iOS), on **touche** un chapitre, ou l'on passe
  par les flèches. L'image vient de la cascade habituelle : le chapitre, puis la
  couverture de la semaine, puis **la couverture dessinée** — jamais celle d'une
  autre semaine.
- **La barre du bas** est le dock du site, qui **grandit** quand la page lui
  publie sa bande (`bandeDuMagazine.ts`) : **la règle des 54 semaines** (la
  timeline, toujours là, avec l'entrée de l'atelier) et **les huit visuels** de
  la semaine ouverte — la couverture, ses sept chapitres, celui du jour entouré.
- **Le mode immersif** : tant que la bande est publiée, `SiteChrome` retire les
  deux boutons flottants (ils se poseraient sur la barre) et la page impose la
  couleur d'application (`theme-color` = l'encre). La scène est la bande observée
  par le dock : ses flèches paraissent quand l'écran est là.
- **L'installation** : `public/manifest.webmanifest` (`display: standalone`,
  `start_url: /magazine`) — l'application s'ajoute à l'écran d'accueil et s'ouvre
  sur le magazine, sans barre de navigateur.

Une seule barre dans toute l'application : celle du site. Elle change de
contenu, jamais de place.

## 13. Refonte : la mosaïque, et rien d'autre

> **Itération précédente.** La bande décrite ici a été remplacée par la grille
> plein écran — voir §14. Ce qui compte y reste : les cases carrées bord à bord,
> la tête de lecture, la lumière des heures, et l'idée qu'une vignette est une
> porte.

L'expérience a été reprise de fond en comble. **Une seule idée est conservée :
la timeline** — son principe et son fonctionnement temporel. Tout le reste a été
refait, et ce qui restait de l'ancienne interface a été retiré.

### Ce qui a disparu

Les blocs empilés, la colonne de navigation à droite, le dock permanent sous les
yeux, le panneau du sommaire, les compteurs, les badges, les encadrés, les cartes
arrondies et leurs ombres, les phrases qui expliquaient l'interface — et **toute
la métaphore du jeu de cartes** : plus de roi, de dame, de valet, de carreau, de
pique ni de trèfle à l'écran. Le vocabulaire visible est désormais **image +
temps + mosaïque + typographie**.

### L'écran

```
┌───────────────────────────────────────────────────────┐
│ 20 SEPTEMBRE · MAGAZINE 38                 (cadran)    │
│ Septembre doré                                         │  LA SCÈNE
│ L'ART DE RECEVOIR                                      │
├───────────────────────────────────────────────────────┤
│ l'éditeur   la collection   votre profil               │  les portes
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  l'année                  │
│ ▓▓▓▓▓▓▓▓  la semaine                                   │  LA MOSAÏQUE
│ ▓▓▓▓▓▓▓▓▓▓▓▓  la journée                               │  (la timeline)
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  le numéro                            │
│ ▓▓▓▓▓▓▓▓▓▓▓▓  les articles                             │
└───────────────────────────────────────────────────────┘
```

### La mosaïque du temps

`MosaiqueDuTemps.tsx` — des vignettes **carrées, bord à bord**, sans cadre ni
ombre, chacune avec une image (ou la couleur du magazine) et **deux mots au
plus**. Elle occupe toute la largeur, en bas, et elle est **la seule surface de
navigation** :

| rangée | ce qu'elle porte | une vignette, c'est |
| --- | --- | --- |
| `l'année` | les 54 magazines | une couverture, son numéro |
| `la semaine` | les 7 jours du magazine ouvert | un chapitre, le quantième |
| `la journée` | les 24 heures | une heure, et sa lumière |
| `le numéro` | les 24 pages composées | une page, sa rubrique |
| `les articles` | ce qui se lit | un article, sa durée |

**Le zoom ouvre les rangées** (`echelleDeLaMosaique.ts`) : molette, pincement à
deux doigts, `+` / `−`, ou les quatre crans à droite de la bande. De loin, le
monde ; de près, la page ; plus près, l'article. La **tête de lecture** — le
trait blanc, en haut de la vignette de l'instant — vient de l'atelier d'origine,
et se ramène toute seule dans le champ.

**La lumière des heures** (`lumiereDuJour.ts`) fait le reste : la même
photographie, vingt-quatre fois, avec la clarté et le voile de chaque heure. On
voit la nuit tomber en glissant le doigt.

### Les feuilles

Ce qui n'est pas l'image et la mosaïque **s'ouvre à la demande**, dans une
feuille (`Feuille.tsx`) : **l'éditeur** (le composeur, l'édition, les trois temps
de lecture), **la collection** (les 54 couvertures, par saison), **votre profil**
(la mise en lumière). Elles s'ouvrent aussi par l'adresse : `?feuille=editeur`.

### L'adresse

`/magazine?jour=09-21&niveau=4&moment=soir&feuille=collection` — le jour, le cran
d'échelle, le moment de la capsule, la feuille. Tout est partageable, et lu au
premier rendu.

## 14. La grille du monde : la timeline devient tout l'écran

L'expérience a changé de nature. Il n'y a plus de bande posée en bas d'une
page : **la grille prend tout l'écran**, elle se parcourt horizontalement et
verticalement, et chaque case ouvre un monde. Ce n'est plus une page qu'on
parcourt, c'est un territoire.

```
                    ┌──┬──┬──┬──┬──┬──┬──┬──┬──┐
                    │  │  │  │  │  │  │  │  │  │   on glisse partout,
                    ├──┼──┼──┼──┼──┼──┼──┼──┼──┤   on pince pour changer
                    │  │▓▓│▓▓│  │  │  │  │  │  │   de densité, on clique
                    ├──┼──┼──┼──┼──┼──┼──┼──┼──┤   pour entrer
                    │  │  │  │  │  │  │  │  │  │
                    └──┴──┴──┴──┴──┴──┴──┴──┴──┘
```

### Une seule brique : la case

Tout ce qui existe dans le produit existe **quelque part sous forme de case**.
`src/lib/grilleDuMonde.ts` ne réécrit aucune donnée : il découpe le monde en
cases, à partir des sources du site.

**On arrive sur l'année** — trois cent soixante-cinq cases, tout le contenu en
une vue. Le premier mot du chemin, en bas à gauche, s'appelle `LE MONDE` : il
ouvre les dix grandes portes du produit.

| monde | cases | ce qu'une case est | d'où elle vient |
| --- | --- | --- | --- |
| `annee` | 365 | un jour | `semaines` · `saintsDuJour` · `visuelsDuMagazine` |
| `monde` | 10 | les grandes portes | tout le site |
| `jour-09-21` | 9 | les 8 univers, + les 24 heures | `semaines` · `jourDuMagazine` |
| `univers-musique` | 8 | un morceau du jour | `playlistDeLAnnee` |
| `heures` | 24 | une heure et sa lumière | `lumiereDuJour` · `l'édition` |
| `heure-18` | 7 | un module de la page | `l'édition` · `shopData` · la playlist |
| `magazines` | 54 | un magazine | `semaines` |
| `articles` | 34 | un article | `magazine` |
| `musique` | 365 | un morceau par jour | `playlistDeLAnnee` |
| `boutique` | 43 | un objet, son prix | `shopData` |
| `metiers` | 72 | un métier, son porteur | `metierPage` · `personas` |
| `personnes` | 27 | un rôle du mariage | `personas` |
| `galerie` | 25 | une image livrée | `bibliothequeMagazine` |
| `mini-site` | n | un bloc composé | la composition (§15) |

Une case porte un **module** (image, texte, audio, article, produit, personne,
lieu, date, météo, carte, galerie, formulaire…), une **couleur** — jamais
inventée : c'est le fond du magazine auquel elle appartient — et une
**ouverture** : `ouvre: 'chapitre-38-05'`. C'est tout.

### Les cinq densités

C'est **la taille réelle de la case** qui décide de ce qu'elle a le droit de
dire — jamais l'échelle en soi (`echelleDeLaGrille.ts`).

| densité | la case fait | elle montre |
| --- | --- | --- |
| 1 | moins de 64 px | l'image, rien d'autre |
| 2 | 64 → 96 px | l'image et la date |
| 3 | 96 → 132 px | et le titre |
| 4 | 132 → 190 px | et la ligne de contexte |
| 5 | plus de 190 px | et son détail, ligne à ligne |

Cinq crans d'échelle (`0.42 · 0.62 · 0.86 · 1.2 · 1.7`) se posent sur cette
règle : au premier, l'année entière tient à l'écran ; au dernier, la case dit
tout. Un petit monde — huit univers, un morceau — remplit l'écran de lui-même :
la grille s'ajuste, la densité suit.

### Les gestes

| geste | ce qu'il fait |
| --- | --- |
| glisser | se déplacer dans le territoire, dans les deux sens |
| molette · `Maj`+molette | descendre, monter · aller à droite, à gauche |
| pincer · `⌘`/`Ctrl`+molette · `+` `−` · `1`…`5` | changer de densité, sous le doigt |
| cliquer une case | **entrer** — la case grandit jusqu'à l'écran, son monde arrive |
| `Échap` · le chemin, en bas à gauche | remonter d'un cran |
| `+` (en haut à droite) | armer la sélection : cliquer coche, glisser encadre |
| `Maj`+clic | cocher une case sans armer la sélection |

Rien de tout cela n'ajoute d'interface : **la grille fait déjà tout**. Les
flèches du clavier déplacent, les chiffres changent l'échelle, et les cinq
crans sont cinq traits à droite de l'écran.

### Ce qui a disparu

La bande du temps, la scène pleine page, la barre de navigation, les panneaux,
les cartes arrondies, les ombres, les badges, les explications. Il reste :
**des images, des cases, du temps, de la typographie, et la scène en dessous** —
l'image de la case qu'on regarde passe derrière la grille, et ses interstices la
laissent voir. La hiérarchie ne change pas : l'image d'abord, puis la date et le
titre, puis le contenu.

## 15. Composer : les mêmes cases, un autre site

Puisque tout est une case, on peut **composer avec**. La sélection (le `+`, ou
`Maj`) marque des cases ; la barre qui monte dit ce qu'on peut en faire :

```
2 cases   composer   masquer   partager   effacer
```

**Composer** ouvre la feuille : les cases choisies y sont posées, dans l'ordre,
et l'on ajoute des **modules** — PHOTO, DATE, LIEU, PLAN, HORAIRES, MÉTÉO,
MUSIQUE, RSVP, HÉBERGEMENT, TRANSPORT, ITINÉRAIRE, GALERIE, CONTACT, PORTFOLIO,
TARIFS, DISPONIBILITÉ, SERVICES, VIDÉOS, ZONE, LOGO, PORTRAIT. On glisse un bloc
pour changer son rang ; on ouvre le mini-site pour le parcourir **comme un
monde** : une case par bloc.

Deux compositions toutes faites : **un invité** (onze blocs) et **un
professionnel** (neuf blocs). C'est le même moteur pour tout le monde.

### Les droits, sans bruit

Chaque bloc porte une **famille** — `public`, `invités`, `famille`, `privé` — et
d'un seul symbole (`○ ◔ ♥ ●`) on la fait tourner. Dans la grille, la marque
n'apparaît qu'à partir de la densité 4, et **jamais** pour une case publique :
on ne décore pas une mosaïque avec des cadenas.

### L'adresse porte tout

```
/magazine?jour=09-21&monde=univers-musique&niveau=4&moment=soir&feuille=composer&cases=jour-09-20,musique,rsvp
```

Le jour, le monde, la densité, le moment de la capsule, la feuille, et les cases
choisies. **Partager** copie cette adresse : une composition s'ouvre exactement
telle qu'on l'a laissée.
