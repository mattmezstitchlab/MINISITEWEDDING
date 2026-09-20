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

## 6. Les questions du premier tour

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


---

# Deuxième lecture — le canevas, LE MONDE AIME, l'alphabet, le footer

> Ce que tu as tranché le 20 septembre, et ce que ça change dans l'audit.
> Toujours **aucune ligne de code touchée** : on vérifie avant de poser.

## 7.1 Ce que tu as décidé

| Décision | Ce qu'elle remplace |
|---|---|
| **La page secrète est un canevas** : notes, gribouillis, moodboard, post-it, écriture — **tout est privé avec Jumo**, et **tout existe déjà sur le site** | une page de conversation avec l'agent |
| **Jumo veille, sans juger** : un bienveillant, un confident ; il **rectifie** s'il est autorisé, il **remonte des cartes**, des magazines, des pages du magazine **en expliquant** | l'agent qui « range » seulement |
| **LE MONDE AIME** : au fil du temps, le journal d'une personne devient un journal, et **tous les journaux du monde fusionnent** en un seul, **passé dans toutes les langues** — et ce journal s'appelle **LE MONDE AIME** | un espace personnel |
| **L'alphabet remplace YHWH** : une **grille de toutes les lettres**, sur laquelle chacun fait ce qu'il veut ; une **mosaïque de l'alphabet** sur l'accueil, **fruit de la fusion de tous les utilisateurs**, avec son texte descriptif et sa musique | les quatre lettres |
| **La timeline est validée** — et elle **descend au footer**, au plus bas, **peut-être le footer lui-même** | — |

## 7.2 « Il faut que tout existe déjà » — ce qui existe, bloc par bloc

C'est la bonne exigence, et elle est presque tenue. Voici l'état exact, canevas
par canevas :

| Le bloc du canevas | Ce qui existe **déjà** | Ce qui manque |
|---|---|---|
| **Écrire une note** | le champ de texte du site (`editor/Row.tsx`, `textarea` partout) et **le texte privé du journal** (`journal.ts`) | la **surface libre** : on écrit là où on veut, pas dans un formulaire |
| **Le post-it** | le **papier** : `CartePostale`, `Timbre`, `RsvpTicket`, `TicketCaisse` — le site sait fabriquer des **objets de papier** (dentelure, tampon, ombre, inclinaison) | le post-it **déplaçable** sur un canevas |
| **Le gribouilli** | `PortraitStudio` **dessine déjà en SVG** à partir d'une graine ; `Timbre` et `TicketCaisse` aussi | la **capture du geste** (le trait qui suit le doigt) |
| **Le moodboard** | la **bibliothèque d'images** (`localStore.media`, `MEDIA_SEED`), l'import d'images (recompressé), les visuels d'univers | le **mur d'images** qu'on compose |
| **La couleur** | la palette du jeu (`accent` par univers), les deux fonds du studio (blanc / noir) | la couleur **libre** choisie par la personne (voir la charte, §3) |
| **La musique** | `trackForText` (les **mots** donnent le morceau), `composerEdition` (FNV-1a : une **clé** donne une édition), le catalogue sonore | la musique **des couleurs** ; l'association forme → son |
| **Jumo remonte une carte** | `cartesVivantes` (les mêmes cartes partout), `superHeros` (20 héros par palier), `HEROS` (14, opérationnels chaque jour) | le lien **carte → explication** dans le canevas |
| **Jumo remonte une page du magazine** | `editionDuJour`, `pageFor`, `EditionSemaine` (24 pages), `aimeMagazine` (les couvertures), `magazine.ts` (34 articles), **`ouEstLeMot`** (le mot qu'on ouvre) | le fait de **citer une page** dans le canevas, avec sa raison |
| **Le privé** | **la confidentialité à trois cibles** (`public` / `cercle` / `prive`), **le défaut privé**, la validation (`valider`, `pagesPubliques`) | — **rien** : c'est déjà écrit, et c'est le point le plus important |
| **Le sceau** | le **timbre dentelé** et le **sceau rond**, le tampon « validé », les 31 documents, la fente | le **logo personnel** (voir §7.4) |

**La seule vraie surprise, et elle est bonne** : l'architecture du journal est
**déjà** celle d'un canevas — des blocs datés, une source, une cible de
confidentialité, une validation. Le canevas n'est pas un autre objet : c'est la
**surface** de ces blocs.

## 7.3 LE MONDE AIME — le journal fusionné

**Ce qui existe déjà, et c'est beaucoup** :

- **Le comptoir partagé** : `terminalLive.ts` (`chargerLive`, `envoyerGeste`),
  `liveRules.ts` (`Geste`, `appliquerGeste`, `gestesDuRecu`, `invitesAuComptoir`,
  `gesteDepuis`), `server/live.js`, `api/wedding-live.js`, et la table `live`
  dans `supabase/schema.sql`. **Le site sait déjà faire converger les gestes de
  plusieurs personnes au même endroit** — c'est la mécanique exacte d'une fusion.
- **Le journal** (`journal.ts`) : 11 sections, la date, la source, la cible.
- **La règle** : `pagesPubliques()` — seul ce qui est **public** sort.

**Ce qui manque, et qu'il faut regarder en face** :

1. **Aucune langue étrangère n'existe dans le site.** Pas d'i18n, pas de fichier
   de traduction : tout est écrit en français, en dur. C'est la plus grosse
   brique de ton idée, et elle ne s'improvise pas. **Ma proposition** : le
   journal s'écrit **dans la langue de la personne**, et c'est **Jumo qui
   restitue** dans la langue du lecteur — **avec la mention « restitué par
   l'agent »**, jamais en faisant passer une traduction pour l'original. La règle
   `source-dite` l'exige, et c'est aussi ce qui protège le texte de quelqu'un.
2. **Le consentement.** Une fusion mondiale ne peut prendre **que** ce qui est
   `public` et **validé** — jamais le `cercle`, jamais le `prive`. Le canevas est
   privé avec Jumo : **il n'entre dans LE MONDE AIME que s'il est publié**.
3. **L'échelle.** Le comptoir tient aujourd'hui des compteurs par univers. Un
   journal mondial demande un entrepôt (Supabase est là, `schema.sql` aussi) et
   des **règles de conservation** (ce que la `revue-juridique.md` demande déjà).
4. **Le rythme.** 24 pages par jour × 364 jours = **8 736 pages par personne et
   par an**. On ne les stocke pas : on stocke **les gestes** (une sélection, une
   forme, un mot), et **les pages se rejouent** — c'est déjà comme ça que
   `composerEdition` fonctionne (une clé, une édition, la même à l'identique).
   C'est la règle `meme-edition` qui rend le journal mondial possible.

**Et le texte descriptif de l'œuvre**, « émotionnel mais vrai, réel, profond » :
l'émotion ne se fabrique pas, elle se lit dans les faits. La description de la
mosaïque dira **ce qui s'est réellement passé** : *« 4 128 lettres, 973 mains,
19 langues, du 1ᵉʳ janvier à aujourd'hui — la couleur la plus posée est le bleu
des jours de pluie. »* C'est vrai, c'est vérifiable, et c'est bouleversant
**précisément parce que c'est vrai**.

## 7.4 L'alphabet — et pourquoi c'est mieux que le tétragramme

Tu as raison de changer. L'alphabet :

- **n'a besoin d'aucune mise au point théologique** : il n'y a rien à vérifier,
  rien à expliquer, personne qui puisse dire « ce n'est pas ça ». Le risque tombe
  de lui-même, et le propos devient plus large ;
- **marche pour toutes les langues** — ce qui est exactement la promesse de LE
  MONDE AIME (un alphabet, plusieurs alphabets, une seule œuvre) ;
- **est déjà graphique** : une grille de lettres est une **matrice** — on la
  reconnaît avant de la lire, comme nos couvertures.

**Comment je le tiens techniquement** : la grille et les lettres sont **un
dessin** (SVG, comme `PortraitStudio`), pas du texte — donc **aucune police n'est
touchée** (ta règle tient), et chaque lettre peut porter **la couleur, la forme
et le son** de celui qui l'a travaillée. La mosaïque de l'accueil est la
**somme** de ces lettres : au début, elle est faite de quelques-unes (les
tiennes, celles de la maison) ; au fil du temps, du monde.

**Deux questions** : **quels alphabets d'abord** (latin, puis grec, cyrillique,
hébreu, arabe, chinois…), et la grille de l'accueil est-elle **le résultat de la
fusion** (donc elle change à chaque visite) ou **une œuvre figée à une date** —
je penche pour la seconde : **une œuvre datée**, qu'on peut citer, photographier,
et dont on dit la source.

## 7.5 La musique — ce qu'on peut dire, et ce qu'on ne dira pas

Ce qui existe : `trackForText` (**les mots** donnent le morceau, dans une
bibliothèque choisie) et `composerEdition` (une **clé** — les couleurs, la date,
le prénom — donne une édition stable). Donc « musique basée sur les couleurs, les
mots, le texte » est **déjà faisable**.

Ce que je n'écrirai pas : « **vibrations** » au sens de mesure physique. On ne
mesure aucune vibration : on **choisit** une musique à partir des couleurs et des
mots, et **on le dit** (`source-dite`). La formulation juste : *« la musique est
composée des couleurs et des mots de l'œuvre — un choix, assumé comme un choix. »*

## 7.6 La timeline, dans le footer

Le **SUPER FOOTER** existe déjà (`/footer`) : `#axes` (« Qui vous êtes » — les
situations de vie), `#footer` (les 54 coches), `#wallet`, `#documents` (31). Deux
façons de faire, et ce n'est pas la même chose :

| Option | Ce que ça fait | Ce que ça touche |
|---|---|---|
| **A — une section `#temps` en bas du footer** | la timeline de la personne (ses gestes datés, ses cartes, ses pages, ses formes) posée **sous** `#documents` | rien de validé ne bouge : on ajoute un bloc |
| **B — le footer devient la timeline** | les axes du footer deviennent **les chapitres du temps** (les situations de vie sont déjà, en soi, une chronologie : on arrive, on travaille, on se marie, on transmet) | on réécrit la structure du SUPER FOOTER (validé en passe 41) — c'est un choix fort, et il faut le vouloir |

Je penche pour **A d'abord** (on ajoute le temps en bas), puis **B si l'axe se
révèle juste** — parce que B est une décision de composition, pas de fonction.

## 7.7 L'ordre des passes, révisé

| Passe | Ce qu'elle construit | Pourquoi dans cet ordre |
|---|---|---|
| **49 — Le temps commun** | un seul journal du temps (`vows:temps`) : chaque geste **déjà** existant écrit une ligne datée (qui, quoi, quand, où) ; la timeline existante le lit | tout le reste s'y accroche : le canevas, le footer, la mosaïque, la fusion |
| **50 — La timeline au footer** | l'option A : la section `#temps` en bas du SUPER FOOTER, nourrie par la passe 49 | la timeline existe déjà ; on la **rebranche** au lieu de la refaire |
| **51 — Le canevas** | la page secrète : notes, post-it, gribouillis, moodboard, images, sons — **privé par défaut**, Jumo à côté qui propose (et ne juge pas) | c'est **la** page qui manque ; tout le reste lui donne sa matière |
| **52 — Jumo** | la conversation, le rangement, la citation des cartes et des pages (« voici pourquoi celle-ci ») | il a besoin du canevas pour écrire, et du temps pour se souvenir |
| **53 — L'alphabet et la mosaïque** | la grille des lettres, la lettre qu'on travaille, la mosaïque datée sur l'accueil, son texte et sa musique | il faut des lettres **avant** de faire une œuvre : elle vient après le canevas |
| **54 — LE MONDE AIME** | la fusion (comptoir + entrepôt), la restitution en langue par Jumo, la page de l'œuvre | c'est le bout du chemin : ça demande des gens, des langues, et des règles |

---

# Troisième lecture — la numérologie, après vérification

> Le texte reçu (numérologie comme mécanique UX invisible) : voici ce que la
> vérification donne, dans le code et dans les sources. Toujours **aucune ligne
> touchée**.

## 8.1 Ce qui existe déjà — et c'est plus qu'on ne croit

| L'idée du texte | Ce qui existe **déjà**, et où |
|---|---|
| « le chiffre » d'une personne | **le chiffre du jour** est déjà calculé : `clesDuJour(date).chiffre = { nombre, sens }` (jour + mois, réduit de 1 à 9) — `jourDuMagazine.ts` |
| la table des 9 sens | **`SENS_DES_CHIFFRES`** : les neuf sens sont **déjà écrits** |
| les autres couches symboliques | la **lune** (`phaseDeLune`), les **quatre portes** (solstices, équinoxes), l'**interstice** alpha-omega (26/12 → 5/1), le **signe caché** (le Serpentaire, 30/11 → 17/12) |
| « une clé personnalise tout le site » | **`composerEdition`** (FNV-1a) : **une clé donne une édition stable** — 24 pages, mêmes choix, même résultat |
| « une composition graphique générée automatiquement » | **`PortraitStudio`** : une **graine** engendre un portrait SVG (peau, cheveux, étoffe, pose, lumière) — le précédent exact d'une « DNA » |
| « la playlist des nombres » | **`trackForText`** (les mots donnent le morceau) et **`MUSIC_MOODS`** — **six ambiances** existent (disco, jazz, pop, électro, musiques du monde, classique) : neuf nombres, six ambiances |
| « le casting / la constellation » | les **27 rôles**, les **5 titres**, les **cartes vivantes**, les **4 moments** du Jour J (`DAY_EVENTS` : cérémonie 15 h, cocktail 17 h 30, dîner 20 h, soirée 23 h), et les **alignés autour** (passe 47) |
| « la date du mariage est une donnée » | elle l'est **déjà** : `editionDuJour`, `superSaintDuJour`, la carte de la semaine, la lune, la météo |
| « la carte a deux couches » | `CardData` a déjà un **recto** et un **verso**, et `people.card` est un **`jsonb` libre** : une date de naissance s'y ajoute **sans migration** |

**La conclusion de cette colonne** : la numérologie **n'est pas à importer** dans
ce site. C'est **la clé personnelle d'un mécanisme qui calcule déjà une clé pour
le jour**. Le travail n'est pas de la créer : il est de **la brancher au bon
endroit**, et de **dire sa règle**.

## 8.2 Ce que la vérification dit des calculs

- **La réduction théosophique** : on additionne, on réduit à 1-9, **sauf 11, 22 et
  33** — les nombres maîtres, jamais réduits (certaines écoles ajoutent 44, très
  minoritaire en francophonie).
- **Deux méthodes pour le chemin de vie**, et elles **ne donnent pas toujours le
  même résultat** : *globale* (tous les chiffres d'un coup) ou *par composant*
  (jour, mois, année réduits séparément) — la seconde **révèle des maîtres
  intermédiaires** que la première masque. Exemple cité partout : 29/11/1985 →
  9 dans les deux cas, mais en passant par 11 dans la seconde. **On doit donc
  écrire laquelle on utilise.**
- **Le nombre d'expression** vient du **nom complet de naissance** (table
  pythagoricienne : A=1 … I=9, J=1 … R=9, S=1 … Z=8), **le nombre intime** des
  **voyelles**, **le nombre de personnalité** des **consonnes**.
- **Les accents sont retirés** avant le calcul (É=E, À=A, Ç=C, Ü=U) — la pratique
  sérieuse le fait ; beaucoup de sites ne le font pas.
- **Le nom de naissance, pas le nom d'épouse** : la question est posée dans tous
  les calculateurs (« nom de naissance vs nom marital »), et la réponse
  traditionnelle est **le nom de naissance**. **Pour un site de mariage, c'est un
  cadeau** : ce qui ne change pas, c'est le nom de naissance — le reste, on
  l'écrit, on le choisit.
- **L'année personnelle** = jour + mois de naissance + l'année en cours : elle
  **change chaque année** (donc elle bouge, alors que le chemin de vie ne bouge
  pas).
- **Et le point décisif, vérifié** : **tout dépend de l'alphabet**. La table
  pythagoricienne ne couvre que **l'alphabet latin** ; le **système chaldéen**
  va de **1 à 8** (le 9 était sacré) avec une répartition différente, et il
  **donne d'autres résultats pour le même nom** ; l'hébreu (gematria) et l'arabe
  (abjad) ont les leurs. **La mosaïque d'un alphabet est universelle ; le nombre,
  lui, ne l'est pas.** Il devra dire *quel système* — sinon LE MONDE AIME
  additionnerait des lettres qui n'ont pas la même valeur.

## 8.3 Ce que la vérification dit du droit (France)

- **La voyance n'est pas une profession réglementée** : aucun texte ne la régit
  directement — mais elle est soumise au **Code de la consommation** et au
  **Code pénal**.
- **Pratiques commerciales trompeuses** (art. L121-1 et L121-8) : **interdiction
  de promettre des résultats**. Sanctions : jusqu'à **300 000 € et 2 ans**
  d'emprisonnement (art. L132-2).
- **Cour de cassation, 2020** : « *le caractère divinatoire d'une prestation
  n'exonère pas son prestataire des obligations légales en matière d'information
  du consommateur et de loyauté des pratiques commerciales* ».
- **Escroquerie** (art. 313-1), **charlatanisme**, **abus de faiblesse**,
  **exercice illégal d'une profession réglementée** — visés dès qu'on glisse vers
  la promesse ou le soin.
- La **DGCCRF** contrôle : en 2020, sur **78 sites contrôlés, 55 présentaient des
  anomalies** (informations légales absentes, pratiques trompeuses).
- Ce que le secteur lui-même propose comme garde-fous : **rappeler le caractère
  ludique et non scientifique**, **ne jamais prédire la santé ni la mort**,
  limiter les consultations, prévoir une médiation.
- **RGPD** : la date de naissance est une **donnée personnelle** ; l'heure et le
  lieu de naissance en disent encore plus. **La numérologie du couple exige les
  données de l'autre personne** — donc son accord, et pas le nôtre.

## 8.4 Mon avis, en clair

**L'idée est bonne, et le texte a raison sur l'essentiel** : la numérologie n'est
pas une page, c'est une **couche** ; une information → beaucoup de conséquences
visuelles ; le site **ne prétend rien** sur les gens. Je le garde tel quel.

**Ce que je ferais autrement, en cinq points :**

1. **Le mot.** « Signature » est **déjà pris** dans le code : `themeSignatures.ts`
   (`signatureFor`, `signatureLabel`) désigne **la signature d'un univers** — son
   fond, son accent, son geste. Si on appelle « signature » le nombre d'une
   personne, les deux se confondront dans le code **et dans la tête des gens**.
   Je propose **« le chiffre »** : *le chiffre du jour* (il existe), *le chiffre
   de la personne*, *le chiffre du mariage*. **Un seul mot, trois échelles.**
2. **Pas de distance dans la constellation.** « La distance peut représenter le
   rôle » : une distance **a l'air d'une mesure**. Je préfère **des couronnes** —
   une couronne par famille de rôle (les cinq titres), les personnes posées
   dessus, la **taille** = ce qu'elles apportent (les modules de leur fiche), la
   **teinte** = leur chiffre. Ça se lit d'un regard, et ça ne prétend rien
   mesurer.
3. **Jamais de verdict sur un couple.** Additionner deux nombres, c'est **déjà**
   porter un jugement si on l'écrit comme un résultat (« 5 + 6 = 11, vous êtes
   faits l'un pour l'autre »). Chez nous : on **révèle les deux chiffres** et,
   **seulement si les deux l'ont donné**, leur somme — **jamais** un score, un
   classement, une « compatibilité ». Un site qui a vu mille mariages ne dit pas
   qui va ensemble.
4. **Jamais « dette karmique » ni « nombre supérieur ».** Les dettes 13/14/16/19
   et la hiérarchie des maîtres (11 « Illuminé », 22 « Bâtisseur ») sont des
   **jugements déguisés en arithmétique**, et ils tombent toujours sur quelqu'un.
   Chez nous : **neuf mots de la même famille**, aucun numéro au-dessus d'un
   autre, et **les mêmes mots pour tout le monde** — c'est déjà la règle de la
   mise en lumière (« ce qui manque », jamais « ce que vous valez »).
5. **Le moins de données possible.** Le texte demande **date, heure et lieu de
   naissance**. L'heure et le lieu servent à l'astrologie (thème natal), **pas à
   la numérologie** : on ne les demandera pas. **La date suffit** — et pour le
   nom, le nom de naissance, comme le veut la tradition. Moins on demande, plus
   on est crédible : c'est exactement le raisonnement de la charte.

Et deux remarques de forme : **pas d'emojis** dans l'interface (on les a sortis
du hero, on ne les remet pas — le site a ses pictos), et **on n'écrit pas
« vibrations »** comme une mesure : on **choisit** une musique à partir des
couleurs et des mots, et on le dit.

## 8.5 Les trois règles à inscrire dans la charte

1. **Le chiffre dit sa règle.** Un clic sur le nombre ouvre **le calcul** :
   *système pythagoricien · alphabet latin · accents retirés · nom de naissance ·
   méthode par composant · 11 non réduit*. C'est la règle `source-dite`, et c'est
   ce qui nous met à l'abri — personne ne pourra dire qu'on a fait semblant.
2. **Le chiffre ne juge personne.** Ni compatibilité, ni dette, ni supériorité,
   ni prédiction de santé ou de mort. Neuf mots, les mêmes pour tous.
3. **Le chiffre est facultatif, et privé par défaut.** La carte porte la date de
   naissance **seulement si la personne la donne** ; elle reste `prive` tant que
   la personne n'a pas choisi autre chose. Aucune donnée de naissance ne part
   sans décision explicite.

## 8.6 Où ça s'accroche, et combien ça coûte

**Une passe, petite et isolée** — **55 — Le chiffre** :

| Ce qu'elle fait | Réutilise |
|---|---|
| un module pur `chiffre.ts` (réduction, maîtres, systèmes, accents, nom de naissance, année personnelle) | rien à installer |
| l'affichage : **le nombre + ses mots**, et le calcul en un clic | la façon d'`ouEstLeMot` |
| la propagation : sa carte → son profil → son hero → la constellation → la playlist | `cartesVivantes`, `PortraitStudio` (graine → dessin), `composerEdition` |
| la constellation du mariage (couronnes + moments du Jour J) | `DAY_EVENTS`, les 27 rôles, les 5 titres |

C'est **indépendant** des passes 49 → 54 : on peut la faire **avant** (elle est
petite et elle rend le profil plus riche tout de suite) ou **après** le temps
commun et le canevas. À toi de dire.
