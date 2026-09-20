# Audit — les pages, les éditeurs, et le menu du profil

> Relevé fait le 20 septembre 2026, sur le dépôt tel qu'il est (commit `68ff7c8`).
> **Aucune ligne touchée** : ce document sert à décider. Les chiffres sont
> mesurés, pas estimés.

---

## 1. Ce que j'ai mesuré

| Mesure | Résultat |
|---|---|
| Fichiers `src/**/*.ts(x)` | **211** |
| Atteignables depuis l'application (`main.tsx` → `App.tsx` → …) | **190** |
| **Sans aucun chemin depuis l'application** | **21 fichiers** (2 900 lignes de code mort) |
| Routes déclarées | **34** (dont 2 redirections, 1 alias de timeline) |
| Pages (`src/pages`) | **23** |
| Pastilles dans « Voir en tant que » | **27** (14 + 5 + 5 + 2 + 1) |
| Entrées du menu du profil | **10** (4 profil + 5 aide + 1 sortie) |

---

## 2. Les écrans anciens, et les iPhones

**Il y a trois choses différentes, et elles ne se traitent pas pareil.**

### 2.1 Ce qui se voit encore

| Où | Quoi | État |
|---|---|---|
| **Accueil**, section « SUPER ÉDITEUR » | `Appareils.tsx` : un **ordinateur, une tablette, un téléphone** dessinés en CSS (bordures arrondies, encoche, socle), qui font défiler **la même page simulée** | vivant, mais **c'est la simulation qui a vieilli** : la page montrée dedans est un faux mini-site (hero, programme, carte), pas le vrai |
| **`/parametres`** | `EditorShowcase.tsx` : deux modes **Bureau / Mobile**, avec de **vrais `iframe`** de l'aperçu | vivant — et **plus honnête** que `Appareils` : c'est la vraie page, dans un vrai cadre |

### 2.2 Ce qui est mort (aucun chemin depuis l'application)

**Les iPhones, exactement** :

- `components/PhoneShowcase.tsx` (428 l.) — la vitrine d'écrans d'origine
- `components/phone/PhoneShell.tsx` (251 l.), `PhoneFrame.tsx` (84 l.), `GuestPhoneScreen.tsx` (254 l.), `CouplePhoneScreen.tsx` (176 l.), `VendorPhoneScreen.tsx` (273 l.), `phoneTheme.ts` (32 l.) — **le dossier entier** : plus personne ne l'importe
- `components/HomeCardShowcase.tsx` (52 l.) — l'ancienne carte d'accueil
- `components/WeddingLiveStoriesFeed.tsx` (632 l.) — le flux « stories », **une direction déjà écartée**

**Le reste du cimetière** (même diagnostic) :

- `components/ImmersiveThemes.tsx` (362 l.), `ThemeMixerStudio.tsx` (266 l.) — le mixeur de thèmes
- `components/CommunityFeedHub.tsx` (187 l.) — le fil communautaire
- `components/FloatingTimelineDrawer.tsx` (280 l.), `TimelineTheaterStudio.tsx` (538 l.), `IntegratedMirrorTimelineBar.tsx` (337 l.), `UniversalInteractiveCardViewer.tsx` (451 l.) — les pièces d'une **autre** timeline que celle qui existe (`/timeline`)
- `components/VendorDomainMenu.tsx` (201 l.)
- `lib/aimeKernelService.ts` (545 l.), `aimeKernelBridge.ts` (222 l.), `aimeContextualAgentService.ts` (232 l.), `aimeGraphCore.ts` (161 l.), `aimeMockData.ts` (273 l.), `weddingAgent.ts` (268 l.), `bidirectionalAlignmentEngine.ts` (202 l.), `vowsOrchestrationEngine.ts` (89 l.) — **une seconde architecture d'agent**, jamais branchée
- `lib/superHeros.ts` (222 l.) — **les 20 SUPER HÉROS**, référencés par les tests, **affichés nulle part**

**La bonne nouvelle dans ce cimetière** : il est **propre**. Rien de mort n'est importé par une page vivante (c'est vérifié par parcours du graphe d'imports). On peut donc **supprimer sans casser**, ou **réserver** — mais pas laisser en l'état, parce que c'est là que se perdent les idées.

### 2.3 Ce qui n'est pas un vieil iPhone, mais y ressemble

`Appareils.tsx` et `EditorShowcase.tsx` ne sont pas des « écrans anciens » au sens
technique : ce sont **deux façons de montrer la même chose**, et c'est ça le
problème (voir §4). À terme, **un seul** des deux doit rester — et ce sera celui
qui montre **la vraie page**, dans **les trois tailles** : l'ordinateur, la
tablette, le téléphone. C'est aussi **le sujet de la passe « appareils »** que tu
avais annoncée (savoir sur quoi la personne est connectée) : les deux sujets se
rejoignent.

### 2.4 Proposition, fichier par fichier

| Sort | Fichiers |
|---|---|
| **Supprimer** (direction écartée, jamais rebranchée) | `WeddingLiveStoriesFeed`, `CommunityFeedHub`, `ThemeMixerStudio`, `FloatingTimelineDrawer`, `TimelineTheaterStudio`, `IntegratedMirrorTimelineBar`, `UniversalInteractiveCardViewer`, `VendorDomainMenu`, `HomeCardShowcase`, `phone/*` (6), `PhoneShowcase`, `aimeMockData`, `aimeGraphCore`, `aimeKernelBridge`, `aimeKernelService`, `aimeContextualAgentService`, `bidirectionalAlignmentEngine`, `vowsOrchestrationEngine` |
| **Réserver** (l'idée tient, le code non) | `superHeros.ts` — **les 20 héros** : le catalogue est bon, il n'a pas d'écran ; `weddingAgent.ts` — **l'agent** : il sera remplacé par **Jumo**, mais ses intentions méritent d'être relues avant |
| **Réutiliser** | `Appareils` (→ les appareils du profil), `EditorShowcase` (→ l'aperçu unique du mini-site) |

---

## 3. La page « Créer ma carte » — ce qu'elle est, et ce qu'on en fait

**Ce qu'elle est** : `CardStudio.tsx`, **958 lignes**, la plus grosse page du site.
Neuf blocs : **La personne · Le mariage · Mes coordonnées · Ma disponibilité · Le
repas · Ma mobilité · Mes prestations · Mes documents · Ma musique**. À gauche la
carte se retourne (recto/verso), à droite on la remplit. Elle écrit **la carte
locale** (`vows:carte`), **la personne du réseau** (`/api/people`), et elle
renvoie **une clé personnelle** — la seule fois où elle est donnée.

**Ce qu'elle est devenue dans la direction actuelle** : **la source**. Le profil
la lit (`PageProfil`), le hero s'en sert, le chiffre y prendra sa date de
naissance, la mise en lumière s'en nourrit, et **l'agent lira tout**. Autrement
dit : cette page est **le seul formulaire du site** — et elle est aujourd'hui
rangée comme une page d'appoint, alors que **tout en dépend**.

**Ce qu'on en fait, concrètement (à valider)** :

1. **Elle devient « Ma carte », la fiche d'identité du site** — le mot « Créer »
   disparaît : on ne crée pas, on **tient à jour**. La carte n'est jamais finie,
   elle se complète — et **la mise en lumière scale dessus** (palier 2 : le
   portrait conforme).
2. **Le chiffre y prend sa place** (date de naissance, nom de naissance) —
   **facultatif, privé par défaut**, avec sa règle affichée. Une ligne de champ,
   pas une page.
3. **La carte donne la sélection** : aujourd'hui les cartes choisies sur l'accueil
   vivent à côté (`vows:selection`). C'est **le même sujet** : ce qu'on a choisi
   fait partie de ce qu'on est. La carte doit **montrer la sélection** et
   permettre de la régler — c'est déjà écrit, il reste à le poser là.
4. **Un seul bouton en bas** : « Enregistrer », qui dit **ce qui manque**
   (`cardCompletion`) — jamais « complet », toujours **ce qui reste**.

---

## 4. Les éditeurs — la carte du territoire

Il y a **quatre** choses qu'on appelle « éditeur », et elles ne font pas le même
métier. C'est là que les informations s'éparpillent.

| # | Page | Route | Ce qu'elle édite | Verdict |
|---|---|---|---|---|
| 1 | `CardStudio` | `/carte` | **la personne** (sa carte, elle) | **l'éditeur de soi** — à garder et à renforcer |
| 2 | `Editor` | `/editeur/:id` | **le mini-site du mariage** (sections, apparence, RSVP, publication) | le vrai éditeur du mariage — à garder |
| 3 | `EditeurMiniSite` + `EditorShowcase` | `/parametres` | **la mise en page d'un univers** (démonstration) | **ambigu** : ça montre plus que ça n'édite |
| 4 | `VendorStudio` + `VendorSiteStudio` | `/prestataire` | **la page d'un prestataire** | à garder, c'est son métier |

**Et l'accueil ?** Tu as raison, et c'est le point fin : **l'accueil est un
éditeur — mais un éditeur de choix, pas de texte**. On n'y écrit pas : on y
**retient des cartes** (rôles, univers), et ces clics deviennent le hero de la
personne. L'accueil ne se remplace donc pas par `CardStudio` : **les deux
s'articulent** —

> **L'accueil, c'est le choix. La carte, c'est la fiche. L'éditeur, c'est la page.**

**Les deux gestes à faire pour arrêter l'éparpillement** :

1. **`/parametres` devient « les préférences »** (l'apparence, la langue, les
   réglages de la capsule, le bouton d'état) — et **la démonstration de mise en
   page part ailleurs** : dans `/le-mariage/:styleId` (la page de l'univers), qui
   la porte déjà à moitié. Sinon on a **trois** endroits qui montrent le mini-site
   (`/parametres`, `/prestataire`, `/apercu`) et **un** qui l'édite.
2. **Une seule source par information** — c'est la règle qui servira l'agent :
   la carte se saisit **une fois** (dans `CardStudio`), elle s'écrit dans **le
   temps commun** (`vows:temps`, passe 49), et **tout le reste la lit**. Aucun
   écran ne redemande ce qui est déjà su.

### 4 bis. Les autres pages, en une ligne

- **`/creer` (Onboarding, 457 l.)** : le parcours d'entrée, avec la revendication
  d'un rôle. Il **précède** la carte : il choisit, elle remplit. À garder, en le
  reliant mieux (`/creer` → `/carte`).
- **`/rejoindre/:slug` (Invitation, 467 l.)** : l'entrée d'un invité. Trois fois
  renvoi vers `/carte`. Bonne logique.
- **`/generer` (Generating)** : l'attente. À garder.
- **`/apercu` (PreviewSite, 42 l.) et `/p/:slug` (PublicSite, 58 l.)** : deux
  façons d'ouvrir le même mini-site. **À fusionner** ou à distinguer clairement
  (aperçu = brouillon ; `/p/` = publié).
- **`/aime` et `/taxonomie`** : la même page sur deux adresses. **À fusionner**
  (une seule, avec redirection).
- **`/theater` et `/timeline`** : la même page sur deux adresses. **À trancher** :
  `/timeline` est la bonne (c'est le mot qu'on emploie), `/theater` redirige.
- **`/modules`, `/features`** : déjà des redirections. À **supprimer** purement.

---

## 5. Le menu du profil — l'audit

### 5.1 Ce qu'il est aujourd'hui

Un bouton rond (l'avatar du rôle courant) en haut à droite, qui ouvre un panneau
de **292 px**, avec :

1. **Qui est là** (visage, nom, titre) ;
2. **« Voir en tant que »** : **27 pastilles** rangées sous **5 titres** —
   SUPER PRESTATAIRE (14), SUPER MARIÉ(E) (5), SUPER FUTUR MARIÉ(E) (5),
   SUPER FAMILLE (2 : Famille, Invité), SUPER TÉMOIN (1) ;
3. **4 entrées** : Profil, Boîte de réception (badge), Paramètres (⌘ .), Apparence ;
4. **5 entrées d'aide** : Assistance, Documentation, Communauté, Télécharger les
   applications, Accueil ;
5. **Se déconnecter**.

### 5.2 Ce qui ne va pas (mesuré, pas ressenti)

1. **L'ascenseur existe déjà** — `max-h-[74vh]` + `overflow-y-auto` — mais il est
   **invisible** : rien ne dit qu'il y a une suite, et sur un écran de 800 px on
   ouvre un panneau qui contient **27 pastilles + 10 lignes**. Le premier geste
   demandé est **de faire défiler un menu**, ce qui est déjà une défaite.
2. **« Voir en tant que » n'est pas une entrée de menu : c'est un bloc.** Il est
   coincé **au milieu**, entre « qui je suis » et « les pages ». Il n'a ni picto
   d'entrée, ni flèche, ni adresse — alors que c'est **la fonction la plus
   utilisée** du site (on regarde le site en tant que photographe, témoin,
   invité…).
3. **Deux entrées mentent sur leur destination** — mesuré : « Assistance » mène à
   `/magazine`, « Communauté » mène à `/prestataire`, « Télécharger les
   applications » mène à `/supermarriage`. **La règle `source-dite` vaut aussi
   pour le menu.**
4. **Trois groupes sans titres** : « les pages », « l'aide », « sortir » — ils se
   ressemblent tous, séparés par des traits.
5. **Il n'y a pas l'agent.** Dans la direction qu'on a prise, **Jumo** doit
   répondre à n'importe quelle question ; il n'est **nulle part** dans le menu du
   profil. C'est **l'entrée qui manque**, et la plus importante.
6. **Ce qu'on voit de soi est vide** : le panneau dit *« SUPER MARIÉS »*, le nom
   d'un rôle — pas le nom de la personne, pas son palier de lumière, pas son
   chiffre. Or **c'est le seul endroit du site où l'on parle de soi**.

### 5.3 Ce que je propose

**A. Le menu devient un ascenseur — assumé.**

- En-tête **fixe** (la personne : visage, nom, son chiffre s'il est posé, son
  palier de lumière) et pied **fixe** (« Se déconnecter ») ;
- **au milieu, ce qui défile** : les entrées, groupées, avec des titres de
  section ;
- **les 27 pastilles n'y sont plus** (voir B) ;
- et un **dégradé** en bas de la zone qui défile : on **voit** qu'il y a une
  suite. C'est exactement le manque d'aujourd'hui.

**B. « Voir en tant que… » devient une entrée, et une page.**

- **Une ligne dans le menu**, avec picto et flèche : *« Voir en tant que… »*,
  qui affiche **à droite le rôle courant** (« SUPER PHOTOGRAPHE ») ;
- **une page** (`/regard` ou `/profil/regard`) qui porte **les 27 cartes**, comme
  sur l'accueil : les cartes se cherchent, se survolent, se prennent — et l'on
  voit **ce que voit** ce rôle. Une page se partage par adresse, se met en
  favori, se teste ; un bloc dans un menu, non.

**C. Le menu se range en trois sections, et quatre entrées.**

| Section | Entrées |
|---|---|
| **Vous** | Ma carte · Voir en tant que… · Apparence |
| **Le site** | Le magazine · Le shop · Le footer · La timeline |
| **L'agent** | **Parler à Jumo** (la page secrète) |
| pied | Paramètres · Se déconnecter |

*(Les entrées « Assistance », « Documentation », « Communauté » deviennent des
liens **honnêtes**, ou disparaissent : on ne garde pas un mot qui ne fait pas ce
qu'il dit.)*

**D. Le même menu, en feuille sur téléphone.** Sur mobile, un panneau de 292 px
à droite de l'écran est un compromis ; **une feuille qui monte du bas**, plein
écran, avec les mêmes sections, est ce que font les interfaces modernes — et
c'est **plus simple**, pas plus riche.

---

## 6. Lovable — ce qu'ils font, ce qu'on fait mieux

Vérifié dans leur documentation (et non deviné) :

- leurs **réglages sont rangés en trois groupes** — *Account*, *Project*,
  *Workspace* — et les réglages d'espace en quatre : *Members & access*,
  *Customization*, *Build & deploy*, *Security & compliance* ;
- **« Inbox » et « What's new » vivent dans le menu de l'avatar en haut à
  droite** (et sur mobile, **des feuilles remplacent les popovers**) ;
- le **menu d'espace** a été refait : *« des boutons pleine largeur en haut et en
  bas du menu »*, **entièrement navigable au clavier**, et *« la liste des espaces
  est masquée quand on n'en a qu'un »* ;
- leur **« Knowledge »** : des règles **écrites une fois**, appliquées **partout**
  — c'est le pendant exact de **notre charte**.

**Ce qu'on prend** : un seul endroit qui regroupe tout ; des sections nommées ;
un panneau qui assume d'être long mais qui **se voit** ; la feuille sur mobile ;
le clavier ; le profil public avec une visibilité choisie (nous l'avons déjà,
trois cibles).

**Ce qu'on fait mieux — parce que c'est plus simple** :

| Lovable | Nous |
|---|---|
| 3 groupes + 4 sous-groupes de réglages | **3 sections, et c'est tout** |
| interface en anglais par défaut, traduite en partie | **une langue, la nôtre** — et le journal restitué par Jumo, signalé comme tel |
| un workspace, des projets, des crédits | **une personne, une carte, un magazine** — rien à administrer |
| l'agent = un chat qui construit | **Jumo** = un agent qui **connaît la personne** et **ne construit pas à sa place** |
| « Knowledge » = des règles de code | **la charte** = des règles de regard (fond uni, création au centre, source dite) |

---

## 7. Les passes que ça propose

| Passe | Ce qu'elle fait | Risque |
|---|---|---|
| **N1 — Le ménage** | supprimer les 18 fichiers morts de la liste « Supprimer » (§2.4), retirer `/modules`, `/features`, fusionner `/aime` + `/taxonomie`, trancher `/theater` → `/timeline` | faible : rien de vivant n'est importé par eux (vérifié). On garde `superHeros.ts` et `weddingAgent.ts` en réserve |
| **N2 — Le menu** | ascenseur assumé (en-tête et pied fixes, dégradé), sections nommées, **« Voir en tant que… » en entrée + page dédiée**, entrée **Parler à Jumo**, feuille sur mobile | moyen : c'est la porte d'entrée du site |
| **N3 — La carte au centre** | `CardStudio` devient « **Ma carte** », le seul formulaire : + le chiffre, + la sélection, + « ce qui manque » | moyen |
| **N4 — Un seul aperçu** | `/apercu` et `/p/:slug` clarifiés ; `/parametres` = préférences ; la démonstration de mise en page rejoint la page de l'univers | faible |
| **N5 — Un seul écran d'appareils** | garder **un** des deux (`Appareils` ou `EditorShowcase`), et **le brancher sur la passe « appareils »** (savoir sur quoi la personne est connectée) | faible |

---

## 8. Les questions à valider

1. **Le ménage (N1)** : je supprime les 18 fichiers morts, ou tu veux les garder
   dans une réserve (un dossier `legacy/` hors application) ? Je penche pour la
   **suppression** — c'est du git, rien n'est perdu.
2. **« Voir en tant que… »** : **page dédiée** (`/regard`) avec les 27 cartes —
   d'accord, ou tu préfères que ça reste dans le menu sous forme d'ascenseur ?
3. **Le menu** : mes **trois sections + Jumo** — tu valides les mots, ou tu veux
   d'autres regroupements ?
4. **La carte** : je la renomme « **Ma carte** » et j'y fais entrer **le chiffre**
   et **la sélection** (N3) ?
5. **Les appareils** : on garde `EditorShowcase` (vraies `iframe`) et on
   supprime `Appareils` (faux écrans), ou l'inverse ?
