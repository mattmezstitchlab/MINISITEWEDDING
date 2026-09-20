# Audit — la page SUPER SECRET, le temps, le cadran et l'atelier

> Relevé fait le 20 septembre 2026, à partir des cinq références envoyées et de
> ce qui existe **déjà** dans le dépôt. **Aucune ligne de code n'a été touchée** :
> ce document est là pour être lu, corrigé, et validé — dans l'ordre ou pas.

---

## 1. Les références, une par une

### 1.1 `rhythm-of-food.net` — le cadran de l'année

**Ce que c'est, exactement.** Une collaboration **Google News Lab × Truth & Beauty**
(direction créative et dataviz : Moritz Stefaner ; design et développement :
Yuri Vishnevsky ; illustration : Stefanie Weigele ; textes : Simon Rogers et
Alberto Cairo). **201 sujets, 155 705 points de données**, à partir des données
hebdomadaires de Google Trends sur **15 ans (2004-2018)**, États-Unis.

**La mécanique du « year clock »** — c'est ça qu'il faut retenir, et c'est très
précis :

| Élément du dessin | Ce qu'il porte |
|---|---|
| **l'angle** | la semaine de l'année : JAN en haut à droite → DEC en haut à gauche, sens horaire |
| **le rayon** | le volume de recherche (l'intensité) |
| **la couleur** | l'année — dégradé 2004 (jaune-vert) → 2018 (violet) |
| **un anneau** | une année ; ils s'empilent du centre vers l'extérieur |
| **un point** | une semaine |

**Les annotations sont posées sur la figure**, pas dans une légende : « Radius =
Number of Google searches », « Color = Year », « Peaks at holidays », « Natural
season » — avec New Year, Thanksgiving, Halloween, Easter/Passover marqués à
leur place. L'infobulle dit : « Google Trends score : 67/100 — Week of August 26,
2018 ».

**Les entrées du site** : « It's September! What's asked for right now? »
(onglets de mois), « What are the most common patterns? » (saison naturelle /
pics de fête / variations régionales — le chou frisé aux États-Unis, en
Allemagne, au Japon), puis un explorateur : TYPE (All, Confectioneries, Dishes,
Herbs & spices, Vegetables, Cocktails, Fruit, Beverages), POPULAR IN (Winter,
Spring, Summer, Fall, Before New Year, After New Year), SPECIAL CATEGORIES
(Strong season, All year, Special occasion, Trending, Annotated, Charts that
look the food), SORT BY (A-Z, **Position of peaks**, **Consistency**), et un
champ « Find a food ». Bandeau vert illustré au trait.

**Ce qu'on prend** :

1. **L'année comme cadran.** C'est exactement notre socle, déjà en données :
   24 heures (`HEURES`), 364 jours nommés (`JOURS_NOMMES`), 54 semaines
   (`JEU_DE_54`), les normales météo (`NORMALES`), les temps clos (`PAS_DE_TEMPS`).
   Un cadran se dessine **en SVG, sans aucune dépendance**.
2. **Les annotations dans la figure** — notre règle `source-dite` rendue visible :
   chaque page dit ce qui l'a décidée, et ici, chaque axe dit ce qu'il mesure.
3. **Le tri par « position des pics » et par « régularité »** — pour nous :
   *fort en saison* / *toute l'année* / *occasion spéciale*. On a la donnée
   (`PAS_DE_TEMPS`) sans en avoir l'usage : le cadran le lui donne.
4. **« What's asked for right now? »** — c'est **le SUPER SAINT DU JOUR + l'heure
   réelle** : le magazine pose déjà la question (`heureCourante`, `superSaintDuJour`),
   le cadran la rend lisible d'un regard.
5. **La comparaison régionale** (États-Unis / Allemagne / Japon) = **l'alignement
   à l'autre bout du monde**, déjà promis dans le socle.

**Le retournement, et c'est le cœur de l'idée.** Chez eux : 201 aliments, 155 705
points, **le monde**. Chez nous : **une personne**, et ses points à elle. Le
cadran n'est pas une dataviz de marché — c'est **un portrait** : un anneau par
année, une direction par jour, une couleur par couleur choisie. Le même dessin
sert **le magazine** (la page du jour), **le profil** (la vie de la personne) et
**le journal secret** (l'horodatage).

**Ce qu'on ne prend pas** : la donnée Google Trends. On ne dépend d'aucun tiers,
et on ne prétend pas mesurer le monde.

### 1.2 Le tétragramme **YHWH** — ce qui est vérifié, et ce qui est une lecture

Tu demandais la vérification. Voilà, sans arrondir.

**Ce qui est exact :**

- **YHWH est le tétragramme** : quatre lettres hébraïques, **Yod · Hé · Vav · Hé**,
  le nom propre de Dieu révélé à Moïse (Ex 3,14-15), présent près de 6 800 fois
  dans le texte hébreu.
- **Il ne se prononce pas.** La tradition juive ne le lit pas : on dit *Adonaï*
  (« Seigneur ») ou *HaShem* (« le Nom »), par respect du troisième commandement.
  Depuis 2001, l'Église catholique demande de ne plus le vocaliser en « Yahvé »
  dans la liturgie, et de traduire par « le Seigneur ».
- **Le lien au souffle existe, et il est ancien.** Le Vav et le Hé sont des
  **matres lectionis** — des consonnes employées comme voyelles, d'où
  l'impression de souffle plutôt que de consonne dure. La liturgie juive chante
  « *Nishmat kol haï tivarekh et shimkha* » — « le souffle de tout vivant bénit
  Ton Nom ». Et la tradition contemplative lit le Nom comme **une respiration** :
  on l'inspire, on l'expire. Cette lecture a des auteurs : Jean-Gaston Bardet
  écrit que « ce n'est pas un nom comme les autres, formé de syllabes… c'est un
  souffle pur qui se module selon quatre sons », qui « ne se lit pas linéairement,
  mais se respire circulairement, d'un seul souffle ».

**Ce qui est une lecture, et non une grammaire** — et qu'il faut dire comme tel :

- **« ce ne sont pas des consonnes »** : en hébreu biblique, **ce sont des
  consonnes**. Le Yod est palatal, le Vav labio-vélaire ; ce sont des
  **semi-voyelles** (matres lectionis), pas de purs souffles sans articulation.
  La lecture « souffle pur » est **mystique et praticable** — elle n'est pas
  fausse comme pratique, elle est fausse comme fait de langue. Un linguiste nous
  reprendrait, et c'est précisément le genre de phrase que tu ne veux pas avoir à
  corriger devant quelqu'un.
- **« YHWH (Yeshua) »** : **Yeshua** (יֵשׁוּעַ) est le nom hébraïque de **Jésus**,
  et **ce n'est pas le tétragramme**. Les deux mots doivent rester séparés —
  c'est la première chose que vérifierait un lecteur attentif.

**Ce que j'en propose pour le site** (à valider) — c'est la règle `source-dite`
qui l'exige, et c'est aussi ce qui rend le propos **plus fort**, pas plus tiède :

> « **Le Nom s'écrit, et ne se dit pas.** Quatre lettres : Yod, Hé, Vav, Hé.
> La tradition contemplative les respire — on inspire, on expire. Ici, on ne
> tranche rien : on tient la lettre, et on laisse la lecture libre. »

Trois conséquences concrètes, dans le code et dans l'usage :

1. **Le Nom n'est jamais prononcé par le site** : il ne se met ni dans un
   `aria-label`, ni dans une phrase destinée à la synthèse vocale, ni dans un
   titre qui se lit à voix haute. On peut le montrer **comme dessin** et dire
   « les quatre lettres » à l'oral — jamais le lire.
2. **La lettre est un cadre, pas un mot** : on ne l'écrit pas dans un titre.
3. **Yeshua n'est pas le tétragramme** : si un jour on parle de Yeshua, c'est
   dans une phrase à part, et dite pour ce qu'elle est.

### 1.3 `sbs.com.au/margarete` — le fil rouge et la broderie

**Ce que la page fait** : un chapitre numéroté (« CHAPTER II — The visitors »), un
titre calligraphié à l'encre rouge, un **sceau/monogramme** au-dessus, une
**photo polaroïd inclinée** posée de travers sur une **texture de papier tissé**,
une mention date-lieu en capitales espacées (« VIENNA, AUSTRIA, MARCH 1938 »), un
paragraphe court, puis une **ligne de couture pointillée** qui traverse la page
et **« CLICK TO REVEAL MORE »** : au clic, **le fil tire et le coin de la page se
plie** — on tourne la page comme un drap.

**Ce qu'on en prend** :

- **la révélation au clic** : c'est **exactement** notre règle du journal — rien
  n'est publié sans validation, et ce qui se déplie se déplie **par le geste de
  la personne** ;
- **la couture** = notre **fil rouge** (déjà nommé : `filRougeDuJour`) : le fil
  devient **le trait qui relie les entrées dans le temps** — c'est là que la
  timeline revient, **en couture, pas en widget** ;
- **le monogramme** = le sceau du journal (la signature et la charte existent) ;
- **le chapitre numéroté** = nos numéros (54, 24 pages, 364 jours — déjà là) ;
- la **texture papier** existe déjà en CSS (`.vp-env`).

### 1.4 `climate-history` + `kalso` — la timeline, et la mémoire

**`climate-history`** : une **colonne de graduation** à gauche (« 00 — 14 », un
point par chapitre, un curseur qui marque où l'on est), un hero sombre avec un
« SCROLL » discret au milieu et un compteur « 02 — 14 », puis **un chapitre par
année en très grand** (1830, 1850, 1910), un mot-clé en petites capitales
(REVOLUTION, GROWTH, TECHNOLOGY), un titre, un paragraphe, une image qui déborde.
C'est la référence que tu cites pour **l'horodatage**, et elle est très proche de
ce qu'on a : une **position dans un ensemble fini**, un **numéro**, un **repère
visuel**.

**`kalso`** : deux dates en très grand (1905 / 1957), des **photos inclinées**,
une **ligne pointillée** qui mène d'une photo à l'autre, des **cercles de couleur
qui grandissent** et qui **changent la couleur du fond** d'une section à l'autre,
des **silhouettes noires** (la carte des Féroé) posées **à cheval** entre deux
sections. C'est **la mémoire** : le passé est un objet qu'on pose sur la page
présente — pour nous, c'est le passé du journal (rêves, notes, formes, photos).

### 1.5 `web-design-trends-2022`, et les polices couleur

**`web-design-trends-2022`** : hero noir dense, **cartes photographiées à plat**
(une pile, légèrement tournées, ombres portées), puis **un chapitre par tendance**
— numéro en petites capitales (« TRENDING 01 »), très gros titre dont un mot en
**contour**, un texte court, et une **liste numérotée « SPOTTED »** (01 NIKELAND,
02 MUSÉE D'ORSAY, 03 WENDY'S). Traduction pour nous : **une carte par tendance /
univers, numérotée, avec son fond** — et une **matière** que nos cartes n'ont pas
encore : l'objet qu'on **pose**, qu'on **empile**, qu'on **incline**.

**Les polices couleur** (ta capture BirdFont / Gilbert : *standard vector font*,
*color vector font*, *color bitmap font*) — point de charte **important** : ta
consigne est **« ne pas changer la police »**. Ma proposition : **on n'y touche
pas**. La couleur et la fonte ne servent **que dans l'atelier** — les quatre
lettres qu'on colorie sont **un dessin**, pas du texte — et **éventuellement dans
le logo personnel**, qui est une **image** (SVG ou PNG exporté, un tampon), jamais
une fonte du site. Comme ça, la règle tient et l'atelier garde toute sa liberté.

---

## 2. L'audit du dépôt : ce qui existe déjà

| Brique de l'idée | Ce qui existe déjà | Où |
|---|---|---|
| Le temps qui décide | 24 heures, 364 jours nommés, la lune, les portes (solstices/équinoxes), l'interstice, le chiffre, le signe caché | `aimeMoteur.ts`, `jourDuMagazine.ts`, `saintsDuJour.ts`, `jeuDeCartes.ts` |
| Le cadran (angle/rayon/couleur) | **les données**, pas le dessin | — |
| La timeline | **un moteur complet et fini** : trois modes (jour J / calendrier / archives), heures, durées, chapitres, visibilité par rôle, note du couple, confirmation prestataire, zoom, lecture | `lib/timelineTheaterEngine.ts`, `pages/Theater.tsx` (routes **`/theater`**, **`/timeline`**, aujourd'hui débranchées) |
| Les pièces de timeline | **déjà écrites, aujourd'hui inutilisées** | `FloatingTimelineDrawer.tsx`, `IntegratedMirrorTimelineBar.tsx`, `TimelineTheaterStudio.tsx`, `CompactZeroScrollStudio.tsx`, `UniversalInteractiveCardViewer.tsx` |
| Le journal (structure identique pour tous) | **11 sections écrites**, la confidentialité à trois cibles, le défaut privé, le rangement de Jumo, la validation | `lib/journal.ts` |
| L'agent | **Jumo** (écrit), et un **catalogue opérationnel de 14 héros** déjà utilisé chaque jour | `journal.ts`, `jourDuMagazine.ts` |
| Le sceau / le tampon | le **timbre dentelé** et le **sceau rond** (noms, date, lieu), le **tampon « validé »** du ticket, les **31 documents** du footer, la **fente** | `Timbre.tsx`, `TicketCaisse.tsx`, `RsvpTicket.tsx`, `superFooter.ts`, `FenteDocuments.tsx` |
| Le studio (fond blanc / fond noir) | le portrait engendré par une **graine** (peau, cheveux, étoffe, pose, lumière) — **un dessin SVG paramétré** | `PortraitStudio.tsx` |
| La création au centre, fond uni | les **règles de la charte** (`creation-centre`, `fond-uni`, `portrait-studio`, `source-dite`) | `charte.ts` |
| Le geste qui enregistre | **des dates éparpillées** : `choisiLe` (la sélection), `quand` (les annonces), `savedAt`, `joined_at`… | partout |

### 2 bis. Ce que le moteur de timeline sait **déjà** faire

C'est la découverte de cet audit, et elle change l'ordre des choses : le moteur
n'est pas un brouillon, c'est une brique finie, **débranchée**.

- **Trois modes** : `'jour-j' | 'calendar' | 'archives'` — le jour du mariage
  (de 6 h à 4 h du matin, 22 heures : `TIMELINE_START_HOUR = 6`,
  `TIMELINE_TOTAL_HOURS = 22`), **le calendrier**, et **les archives**.
- Chaque élément porte : un **chapitre**, un titre, un sous-titre, une **heure**,
  une **durée**, une **catégorie**, un **rôle aligné** (`alignedRole`), un
  **média**, une **description**, une **visibilité** (`['couple', 'vendor']` — donc
  ce que chacun a le droit de voir), une **note du couple** et une
  **confirmation du prestataire**.
- La page l'affiche avec **zoom, lecture, pause, navigation** — et les trois
  modes sont des boutons (jour J / calendrier / archives).

Autrement dit : **l'horodatage existe déjà, avec qui-voit-quoi**, et il sait déjà
parler d'un jour comme d'une année. Ce qui lui manque, c'est **d'être nourri par
les gestes du site** et **d'être relié visuellement** (la couture, le cadran).
La page est aujourd'hui **débranchée** : rien ne mène à `/theater` ni à
`/timeline` depuis le parcours — seuls `SiteChrome` (qui connaît la route) et un
tiroir inutilisé la nomment.

**Ce qui manque, en une phrase : le temps commun.** Chaque brique date ses
choses dans son coin, et **aucune ne parle à l'autre**. C'est la brique qui fait
tenir tout le reste — le cadran, la couture du journal, l'horodatage, et « la
source pour d'autres endroits » que tu décris.

---

## 3. Trois points de vigilance (là où je ne veux pas te faire dire de travers)

1. **« Art-thérapie » est un titre protégé en France.** On ne peut pas promettre
   un soin. Donc on écrit : **« un atelier de création, sans un mot »** — libre à
   un professionnel d'en faire ce qu'il veut avec ses patients. On décrit **ce que
   ça fait** (on choisit, on pose, on garde), jamais ce que ça **soigne**.
2. **Le glisser-déposer n'est pas accessible.** Aucune bibliothèque n'est
   installée aujourd'hui, et le glisser à la souris est difficile au doigt et
   **impossible** pour quelqu'un qui ne bouge qu'un doigt ou un contacteur.
   Donc : **le geste principal est le clic (choisir, puis poser)**, le
   glisser-déposer est **un confort en plus**, et **tout se fait au clavier**.
   C'est ce qui rend l'idée tenable pour Charcot, pour les enfants, et pour tout
   le monde.
3. **La couleur reste dans la création.** Ta consigne est claire (« ne pas ajouter
   de couleur ») : elle vaut pour **l'interface**. L'atelier est l'endroit où la
   couleur vit — il faut l'écrire dans la charte, sinon on se contredit.

---

## 4. La page SUPER SECRET, telle qu'elle se tient

Dans l'ordre que tu as donné (le journal et l'agent **à la fin**, quand la
structure est parfaite) :

1. **Le hero = les quatre lettres.** Yod · Hé · Vav · Hé, comme un **cadre à
   quatre directions**, pas comme un mot. Le fond se remplit au rythme du
   souffle (l'inspiration, l'expiration) — jamais lu à voix haute.
2. **L'atelier.** Des formes géométriques à poser dans le cadre, une couleur,
   un son associé. Rien d'obligatoire, rien à écrire : **la première page du
   site qui marche sans un seul mot**.
3. **La conversation avec Jumo.** On parle de tout et de rien ; il **propose**
   de ranger (rêve, note, mood, agenda, lien, photo, forme) ; **la personne
   valide** — et la cible de confidentialité (public, le cercle, privé) décide
   qui le verra.
4. **Le SUPER JOURNAL.** Les 11 sections déjà écrites deviennent des pages, avec
   la **couture** : les entrées reliées par leur date, comme un fil.
5. **Le sceau.** Quand un motif revient, Jumo le reconnaît : il devient **le logo
   de la personne** — et le tampon existe déjà, il n'y a qu'à lui donner cette
   encre-là, sur les documents, la fente, le wallet.
6. **Le cadran.** Le même temps, vu de l'année : un anneau par année, un angle par
   jour, une couleur par couleur choisie.

---

## 5. Les passes proposées (à valider, dans cet ordre ou dans un autre)

| Passe | Ce qu'elle construit | Ce qu'elle ne touche pas |
|---|---|---|
| **49 — Le temps commun** | un seul journal du temps (`vows:temps`) : chaque geste existant (une carte complétée, une sélection, un avis, un document validé, une annonce) écrit **une ligne datée** — qui, quoi, quand, où | aucune page : c'est une brique |
| **50 — Le cadran** | le dessin SVG (angle = jour/heure, rayon = intensité, couleur = année ou couleur choisie), les annotations dans la figure, d'abord sur le magazine | les pages existantes ne bougent pas |
| **51 — L'atelier** | les quatre lettres en cadre, les formes, les couleurs, les sons, le clic-pour-poser **et** le glisser, le clavier, l'enregistrement des gestes | une route neuve, aucune dépendance ajoutée |
| **52 — Le sceau** | du motif qui revient au **logo**, puis le logo posé sur les documents | la mécanique du tampon reste la même |
| **53 — Le journal, puis Jumo** | les sections en pages, la validation, la confidentialité, la couture du temps ; puis la conversation et le rangement | les 11 sections sont déjà écrites |

---

## 6. Les questions à valider

1. **YHWH** : je tiens la formulation « le Nom s'écrit et ne se dit pas ; la
   tradition contemplative le respire », je **sépare Yeshua du tétragramme**, et
   **le site ne le prononce jamais** (ni `aria-label`, ni synthèse vocale) — tu
   valides ?
2. **Le cadre** : les quatre lettres en **cadre à quatre directions**, ou un
   **cercle central** avec les lettres en filigrane ?
3. **La couleur** : on écrit dans la charte que **la couleur reste dans la
   création** (jamais dans l'interface) — d'accord ?
4. **Le logo** : on part du **sceau rond existant**, ou d'un **tampon carré**
   neuf pour les documents ?
5. **L'atelier** : le geste principal = **clic pour poser** (accessible partout),
   le glisser-déposer en plus — d'accord ?
6. **L'ordre** : on commence par **le temps commun** (passe 49), parce que tout
   le reste s'y accroche ?
