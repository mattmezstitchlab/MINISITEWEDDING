# La composition de la page d'entrée — la référence étudiée, et ce qu'on en a pris

Le 20 septembre 2026, la référence **Tapdaa** (une solution de labels NFC pour
restaurants) a été étudiée comme **direction artistique et composition**, puis
transposée dans le système AIME. Cette page dit exactement ce qui a été pris,
ce qui n'a pas été pris, et où cela se voit.

## 1. Ce que la référence fait, et pourquoi ça marche

La page est **une suite de bandes**, toutes construites sur le même patron :

| Le patron | Ce que ça produit |
| --- | --- |
| une **barre** collante : la marque, des portes, une pastille sombre | on sait toujours où l'on est, et par où l'on entre |
| un **titre** unique, en gros, suivi d'**une seule phrase** | on comprend en trois secondes |
| une **suite numérotée** (1 → 6) qui va jusqu'au bout | on voit le chemin, pas seulement la promesse |
| **trois colonnes égales**, chacune avec un titre, une phrase, un lien | on compare sans lire un tableau |
| une **bande d'image pleine largeur**, sans texte dessus | on respire, et l'image fait le travail |
| **trois formules de même poids** | le prix ne se cache pas, et ne crie pas |
| des **questions** en clair | les objections tombent avant l'appel |
| un **pied** qui répète la marque | la page se referme |

Trois principes plus fins tiennent l'ensemble :

1. **presque rien** : pas de badge, pas de compteur, pas de « cliquez ici ». La
   hiérarchie est portée par la taille du texte et par l'espace ;
2. **la répétition** : le même nom de marque, à la même place, à chaque bande.
   C'est ce qui donne l'impression d'une page tenue, et non d'un assemblage ;
3. **un seul objet par bande** : on ne mélange jamais deux idées dans un écran.

## 2. Ce qui a été pris — et où c'est écrit

| Le principe | Chez nous | Où |
| --- | --- | --- |
| la barre collante | marque `AIME`, quatre portes, pastille d'encre « Ouvrir le ticket » | `BarreDeLAime` |
| le titre unique et sa phrase | « Tout le mariage, sur un seul ticket. » | `LeTitre` |
| la suite numérotée | **quatre gestes** 01→04 : on coche, le ticket calcule, il sort de la fente, chacun a son papier | `LesGestes` |
| trois colonnes égales | **les trois familles** : LE JOUR J (48), VOTRE SITE (20), LES DOCUMENTS (31), chacune avec sa porte | `LesTroisFamilles` |
| la bande d'image calme | le **visuel du jour**, pleine largeur, les infos dessus | `data-section="visuel"` |
| trois formules de même poids | **les trois menus du magasin** : Essentiel, Caddie, Légende | `LesFormules` |
| les questions | **cinq** : celles du thème, plus « est-ce que je paie ? » et « et si je ne sais pas quoi cocher ? » | `LesQuestions` |
| le pied qui répète la marque | marque, portes, « ouvert quand tout est fermé » | `LePied` |

Et les trois principes fins : les bandes sont réglées par `src/index.css`
(`.vp-bande`, `.vp-bande-nom`, `.vp-colonnes`, `.vp-pastille`), le nom de la
bande s'écrit **toujours au même endroit**, et **une bande = une idée**.

Le contenu des bandes est un fichier à part, sans composant ni couleur :
`src/lib/bandesDeLAime.ts`.

## 3. Ce qui n'a pas été copié — et pourquoi

| Ce qu'on a laissé | Pourquoi |
| --- | --- |
| la marque, son nom, son logo | ce n'est pas nous |
| le vert menthe, les fonds pastel, les cartes arrondies teintées | notre matériel est le blanc, l'encre, le filet de 1 px, et **la palette du magazine** de la semaine |
| les visuels produits (téléphone, boîtier, étiquettes) | nos images sont celles du magazine — 54 semaines, 7 chapitres |
| les mots (« Delighting your customers… », « Our Process », « Get started ») | nos mots sont ceux du ticket : cocher, la fente, les portefeuilles, le papier |
| la structure commerciale (essai gratuit, abonnement mensuel, 7/24) | nous ne vendons pas un abonnement : on coche un mariage, et le ticket chiffre un projet |
| les icônes de marque, les tailles de titre, le ton | notre ton est tabulaire et mono, nos titres sont réglés par `clamp()` et `letter-spacing` |

Ce sont des **vérifications**, pas des intentions : le test
« aucune trace de la référence dans la page » refuse `Tapdaa`, `NFC`, `HoReCa`,
`Get started`, `per month`, `Order Now` dans le rendu, et
« sa marque n'est pas devenue la nôtre » exige `SUPER MARIAGE` et `AIME`.

## 4. Le matériel d'AIME, réutilisé tel quel

Rien de la page n'est inventé pour la page :

- **les chiffres** — 48 / 20 / 31 lignes viennent de `categoriesDuTicket` ;
- **les formules** — Essentiel, Caddie, Légende et leurs prix viennent de
  `superMariage.PACKAGES` (donc de `themeConfigs.supermarche`) ;
- **les questions** — trois viennent de `THEME_CONFIGS.supermarche.faq` ;
- **les cinq papiers** — viennent de `portefeuille.PORTEFEUILLES` ;
- **les images** — la couverture du jour et l'image de son chapitre, par
  `visuelsDuJour(date)` : `semaine-38/cover.jpg` et `semaine-38/01-amoureux.jpg` ;
- **le ticket** — celui de la machine, déjà construit.

## 5. L'ordre de la page, aujourd'hui

```
barre                AIME · le ticket · le magazine · les métiers · Super Ripple
la machine           seule, sur fond blanc — elle propose, on valide, le papier sort
titre                « Tout le mariage, sur un seul ticket. » + la couverture du jour
le visuel du jour    la bande d'image calme, les infos dessus
le programme         quatre gestes numérotés, et les cinq papiers
ce qu'on coche       les trois familles, chacune avec sa porte vers sa section
on coche             17 catégories, 99 lignes — cochables d'un clic
le ticket            le papier entier, qui se remplit
les portefeuilles    là où le ticket arrive
l'addition           les trois menus, au même poids
questions            cinq réponses
le pied              la marque, les portes
```

## 6. Aller voir

| Adresse | Ce qu'on y voit |
| --- | --- |
| `/` | la page entière : la machine, puis les bandes, puis le ticket |
| `/#la-machine` | la machine (la barre et les pastilles y mènent) |
| `/` puis `#groupe-site` | une famille, ouverte depuis sa colonne |
| `/caisse?face=recto` | la grande page d'avant, entière |

## 7. Ce que la référence ne donne pas, et qu'on garde à nous

La composition est une **charpente**, pas un produit. Ce qui reste proprement
AIME, et que la référence n'a pas :

- **la machine** : un écran, deux touches, une fente — et l'agent qui fait
  passer les lignes une par une ;
- **le ticket** : le seul objet que le couple, l'invité, le DJ et le métier
  tiennent en main, et le seul endroit qui calcule ;
- **les portefeuilles** : cinq papiers, cinq adresses, le lien qui est le reçu ;
- **le magazine** : 54 semaines, 7 chapitres, et des images qui ne se répètent
  jamais d'une semaine à l'autre.
