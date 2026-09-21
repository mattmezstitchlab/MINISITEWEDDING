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
| la barre collante | marque `AIME`, quatre portes, **la cible** (la part du rêve déjà financée), **l'état du ticket** (le compte, le total), le code du mariage, pastille d'encre « Ouvrir le ticket » ; elle **se resserre quand on descend**, et sur un téléphone les portes glissent sous la marque, sans menu à ouvrir | `BarreDeLAime` |
| une **machine** qui fabrique quelque chose | la machine de Ripple : son écran, **le visuel du jour en tête**, trois touches rondes (le mini-site, on passe, on valide), la fente, et le papier qui sort — **ce qu'elle produit part chez les invités** | `MachineDeRipple` |
| une bande = une idée, jusqu'au bout | **le mini-site des invités** reprend la même charpente : la couverture plein écran, les chiffres, les blocs en **trois colonnes égales**, une bande pour le voyage, une pour le ticket | `MiniSiteDuMariage` |
| le titre unique et sa phrase | « Tout le mariage, sur un seul ticket. » | `LeTitre` |
| la suite numérotée | **quatre gestes** 01→04 : on coche, le ticket calcule, il sort de la fente, chacun a son papier | `LesGestes` |
| trois colonnes égales | **les trois familles** : LE JOUR J (48), VOTRE SITE (20), LES DOCUMENTS (31), chacune avec sa porte | `LesTroisFamilles` |
| la bande d'image calme | le **visuel du jour**, pleine largeur, les infos dessus | `data-section="visuel"` |
| des visuels qui ouvrent des rubriques | **quatre héros** — une image, un titre dessus, et le chemin de ce qu'il y a dedans : le jour J, le voyage, les objets, l'accès. C'est l'arborescence du produit, en images | `LesHeros` |
| trois formules de même poids | **les trois menus du magasin** : Essentiel, Caddie, Légende | `LesFormules` |
| les questions | **cinq** : celles du thème, plus « est-ce que je paie ? » et « et si je ne sais pas quoi cocher ? » | `LesQuestions` |
| le pied qui répète la marque | marque, portes, « ouvert quand tout est fermé » | `LePied` |

**La règle des écrans** — les deux écrans (la machine, l'appareil) ne parlent pas
d'eux-mêmes : ils portent des chiffres (le total, la part du rêve, le reste à
financer) et le rêve, jamais un mode d'emploi ni la marque répétée. C'est la
version « bande » du principe *une bande = une idée*.

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
barre                AIME · les portes · le compte et le total · le code · « Ouvrir le ticket »
le ticket            plein écran — l'appli EST le papier : on le scrolle, on coche
                     (fluo), on tamponne (PAYÉ), et tout est imprimé dessus
l'archive            le papier étalé sur du noir, sous un titre sérif — et, dans
                     chaque pièce, ce qu'elle ouvre (voir `l-archive-du-mariage.md`)
le visuel du jour    la bande d'image calme, les infos dessus
titre                « Tout le mariage, sur un seul ticket. » + la couverture du jour
les quatre héros     le jour J · le voyage · les objets · l'accès — une image, un titre, un chemin
l'appareil           le rêve sur l'écran, sa jauge de budget, les objets, la fente en bas, les stickers
le programme         quatre gestes numérotés, et les cinq papiers
ce qu'on coche       les trois familles, chacune avec sa porte vers sa section
on coche             17 catégories, 99 lignes — cochables d'un clic
le ticket            le papier entier, qui se remplit
les portefeuilles    là où le ticket arrive
l'addition           les trois menus, au même poids
questions            cinq réponses
le pied              la marque, les portes

et au bout de la chaîne, à la même adresse : le mini-site des invités
                     `?code=A7K-241&site=1` — ce que la machine a composé
```

**Deux règles tiennent cet ordre**, et le test « l'ordre des bandes » les
vérifie : la barre passe avant tout, et **le site ne commence qu'après le
ticket** — le premier écran ne contient que le papier.

## 6. La machine fabrique un mini-site

Depuis le 21 septembre 2026, la machine ne s'arrête pas au ticket : **elle
compose le site que les mariés envoient à leurs invités** (`?code=A7K-241&site=1`),
et l'écran du milieu montre ce qu'elle vient de fabriquer — les blocs allumés, et
l'adresse.

**Une seule règle : ce qui est coché est ce qui s'affiche.** Neuf blocs, dont
trois toujours là (la couverture, le voyage, le ticket) ; les six autres
s'allument avec les lignes qui les nourrissent. Le site lui-même applique la
charpente de cette page : une couverture qui prend l'écran, les chiffres du
mariage, des blocs en trois colonnes égales, une bande pour le voyage, une pour le
ticket — **une bande = une idée**, et rien qui parle du produit.

C'est le lien qui part : `?code=A7K-241&site=1&coches=…&reve=…`. Le code ouvre,
les lignes cochées remplissent, le rêve donne la cible. Sans elles, l'invité
ouvrirait un site vide — le test le refuse.

## 7. Une seule page

Depuis le 21 septembre 2026, le site **n'a plus qu'une adresse : la page
d'accueil**. Le magazine, le shop, les métiers, le mariage, le ripple, l'atelier,
les éditeurs ne sont plus montés — leurs adresses ramènent toutes ici
(`<Route path="*" element={<Navigate to="/" replace />} />`).

Ce qui a changé sur la page pour que ça tienne debout :

- la **barre** ne mène plus ailleurs : ses quatre portes descendent sur les
  bandes (`LES CATÉGORIES`, `L'APPAREIL`, `LES 99 LIGNES`, `LE TICKET`) ;
- le **pied** non plus : cinq liens, tous des ancres de la page ;
- les **héros** ouvraient déjà des bandes, rien à changer ;
- les **fichiers** des anciennes pages sont restés dans `src/pages/` : rien n'a
  été détruit, et une ligne de route suffit à en remonter une.

Trois vérifications tiennent ça : **aucun lien ne quitte la page** (le seul lien
qui n'est pas une ancre, c'est celui du mini-site — `?code=…&site=1`, la même
page vue par les invités), chaque ancre descend sur une bande qui existe, et la
table des routes ne contient plus que `/`, `/ticket`, `/caisse` et le renvoi de
tout le reste.

## 8. Aller voir

| Adresse | Ce qu'on y voit |
| --- | --- |
| `/` | la page entière : la machine, les héros, l'appareil, les bandes, le ticket |
| `/#le-ticket-plein` | **le ticket, plein écran** — le premier écran, où l'on coche et tamponne |
| `/#l-appareil` | l'appareil : le rêve, le budget, les objets, la fente |
| `/#on-coche` | les 17 catégories et leurs 99 lignes |
| `/?face=recto` | la page d'avant, telle quelle — le seul endroit où elle vit encore |
| `/?code=A7K-241` | la même page, avec le code d'un autre mariage sur le ticket |
| `/?code=A7K-241&site=1` | **le mini-site des invités** — ce que la machine fabrique ; `&coches=…&reve=…` le remplit |

## 9. Ce que la référence ne donne pas, et qu'on garde à nous

La composition est une **charpente**, pas un produit. Ce qui reste proprement
AIME, et que la référence n'a pas :

- **la machine** : un écran, **le visuel du jour dedans**, trois touches, une
  fente — et l'agent qui fait passer les lignes une par une ;
- **le mini-site** : ce que la machine compose, bloc par bloc, et que le couple
  envoie — le ticket montré aux invités, chiffré et partagé ;
- **le ticket** : le seul objet que le couple, l'invité, le DJ et le métier
  tiennent en main, et le seul endroit qui calcule ;
- **les portefeuilles** : cinq papiers, cinq adresses, le lien qui est le reçu ;
- **le magazine** : 54 semaines, 7 chapitres, et des images qui ne se répètent
  jamais d'une semaine à l'autre ;
- **le code du mariage** : trois signes, un tiret, trois chiffres, écrit au
  début du ticket et dans le lien envoyé aux invités — sans être une porte (voir
  `docs/le-code-du-mariage.md`) ;
- **l'appareil** : le rêve sur l'écran, la jauge du budget, les six objets qui
  laissent chacun leur ligne de code sur le papier, les stickers carrés — et le
  papier qui **sort par le dessous**.
