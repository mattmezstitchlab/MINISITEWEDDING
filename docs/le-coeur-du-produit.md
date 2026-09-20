# LE CŒUR DU PRODUIT — L'INVENTAIRE, ET LA PAGE QUI RÉUNIFIE

> Question posée : **le ticket de caisse est-il le cœur du produit ?** Et que
> faut-il ressortir de meilleur pour réunifier tout ça dans **une page simple,
> propre et innovante** ?

Réponse courte : **oui, le ticket est le cœur** — mais pas seul. Le produit a
trois organes, et un seul d'entre eux est un *objet* :

| L'organe | Ce qu'il fait | Où il vit |
| --- | --- | --- |
| **La grille** | l'espace : on s'y déplace, on y entre | `grilleDuMonde.ts` · `GrilleDuMonde.tsx` |
| **Le cadran** | le temps : l'heure, la lumière, les sept chapitres | `CadranDuMagazine.tsx` · `lumiereDuJour.ts` |
| **Le ticket** | l'objet : ce qu'on prend, ce qu'on emporte, ce qu'on donne | `superMariage.ts` · `TicketCaisse.tsx` |

La grille est la carte, le cadran est l'horloge, **le ticket est la monnaie**.

---

## 1. Pourquoi le ticket est le cœur — cinq preuves

**1. C'est le seul objet que les quatre personnes du mariage tiennent en main.**
Un seul composant, `src/components/TicketCaisse.tsx`, quatre variantes :

```
le couple   → ce qui est prévu, coché, chiffré     (RécapCourses)
l'invité    → ce qu'il prend, et son reçu à envoyer (RsvpTicket, PublicSiteView)
le DJ       → la playlist complète, dans l'ordre    (planDj)
le métier   → son bon de commande                   (PageMetier)
```

Le papier, le code-barres et le tampon ne changent pas : **seul l'en-tête
change**. Aucun autre objet du produit ne traverse les quatre rôles.

**2. C'est le seul endroit où le produit calcule quelque chose de vrai.**
`superMariage.ts` tient un vrai moteur : 45 articles, 12 rayons, 3 menus,
**64 convives**, et le calcul complet — `sousTotal`, remise fidélité 10 %,
TVA 20 % incluse, total. Les quantités par personne viennent du nombre de
convives : deux petits-déjeuners à 22 € font 1 408 €, et c'est écrit.

**3. C'est l'unité de compte de tout le reste.**
Une heure (`horaire-22:17`), un métier (`metier-Chef Tapas`), un petit prix
(`sup-caddie`), un menu — **tout devient un article à un prix**. Le mariage
entier devient une liste qu'on coche. C'est ce qui permet à *tout* le site
d'entrer dans le même objet : il n'y a pas besoin d'inventer une interface pour
les lieux, les gens, les musiques — ils sont déjà des lignes.

**4. C'est un objet, pas une interface.**
L'imprimante, le papier déchiré, les barres du code-barres, le tampon
« PAYÉ · MERCI », le numéro dérivé de ce qui a été coché (`SM-03-DMD9` — deux
tickets différents n'ont jamais le même numéro), le pied qui dit que les tarifs
sont indicatifs. On peut l'**imprimer**, on peut **l'envoyer** : le reçu tient
dans le lien.

**5. Il est déjà à l'échelle de la mosaïque.**
Un article est une case. Un caddie est une sélection. Le numéro est une fonction
pure de la sélection. **Le ticket n'a pas besoin d'une page : il a besoin d'être
posé à côté de la grille.** C'est exactement ce qui vient d'être construit.

**Ce qu'il n'est pas :** le ticket ne remplace pas la grille (on ne *parcourt*
pas un ticket) ni le cadran (il ne dit pas l'heure). Il les complète : on
parcourt le monde, on coche, et l'objet se compose.

---

## 2. L'inventaire : ce qu'il y a de meilleur dans le produit

Tout ce qui suit existe déjà dans le dépôt. La colonne « état » dit si c'est
**monté** (visible dans une page), **orphelin** (le composant existe, personne
ne le monte) ou **au repos** (il vit dans une lib, sans interface).

### A. Les objets — ce qu'on tient

| Le morceau | Fichier | Pourquoi c'est bon | État |
| --- | --- | --- | --- |
| **Le ticket de caisse** | `TicketCaisse.tsx` (342 l.) | 4 rôles, 1 papier ; calcul réel ; imprimable ; voyage dans le lien | monté (caisse, métier, univers) |
| **Le magasin** | `superMariage.ts` (374 l.) | 45 articles, 12 rayons, 3 menus, prix par convive, TVA, remise | monté depuis `/caisse` |
| **Le terminal du DJ** | `weddingTicket.ts` (398 l.) | la **prise** (« c'est moi qui l'offre »), la **demande**, le **reçu** — un article = un invité | orphelin en partie |
| **Le billet du RSVP** | `RsvpTicket.tsx` | répondre = recevoir son billet nominatif, numéroté | monté (formulaire) |
| **La carte postale et le timbre** | `CartePostale.tsx` · `Timbre.tsx` | le lien d'invitation devient un objet postal, qu'on retourne | monté (`/rejoindre`) |
| **Le magasin d'univers** | `weddingPage.magasinFor` | **le même ticket** dans les 20 styles : enseigne, rayons, préfixe propres | monté (site public) |

### B. Le temps — ce qui donne l'échelle

| Le morceau | Fichier | Pourquoi c'est bon | État |
| --- | --- | --- | --- |
| **Le cadran** | `CadranDuMagazine.tsx` | deux aiguilles : l'heure sur 24, le chapitre sur 7 ; jamais de texte dans l'image | monté |
| **La lumière des 24 heures** | `lumiereDuJour.ts` | 24 clartés, 24 voiles ; la même photo, 24 fois, et la nuit qui tombe | monté |
| **La capsule de commande** | `capsuleCommande.ts` | le moment du jour, partagé par tout l'écran | monté |
| **L'édition de la semaine** | `aimeMoteur.ts` · `EditionSemaine.tsx` | 24 pages, une par heure, composées d'un vrai jeu de 54 cartes | monté (feuille) |
| **Les 364 prénoms et les 2 jokers** | `saintsDuJour.ts` · `prenoms.ts` | chaque jour porte un prénom ; deux jours n'en ont pas, exprès | au repos |
| **Le chiffre d'une personne** | `chiffre.ts` (470 l.) | sa date et son nom donnent un nombre, qui se propage partout | **orphelin** (`LeChiffre.tsx`) |

### C. L'espace — où l'on se déplace

| Le morceau | Fichier | Pourquoi c'est bon | État |
| --- | --- | --- | --- |
| **La grille du monde** | `grilleDuMonde.ts` (1 500 l.) | 1 400 mondes, 10 000 portes, zéro case morte ; chaque case ouvre un monde | monté |
| **Le verso** | `versoDuSite.ts` | le design system en clair, les ports, 18 liaisons qui se font bord à bord | monté |
| **Les trois faces** | `faceDuSite.ts` | chaque adresse : la grille, le verso, le recto — rien n'est détruit | monté |
| **Les 54 palettes** | `semaines.ts` | deux couleurs par magazine, jamais inventées | monté |
| **Le composeur de mini-site** | `grilleDuMonde.ts` | 21 modules, 11 pour un invité, 9 pour un professionnel | monté |
| **Les cinq familles** | `grilleDuMonde.FAMILLES` | `○ ◔ ♥ ●` — la grille est l'interface des droits | monté (dans la caisse) |

### D. Ce qui est orphelin — la matière première de la réunification

`ChapitresDuMagazine`, `CouvertureMagazine`, `CouvertureSemaine`, `FluxDuJour`,
`FloatingTimelineDrawer`, `IntegratedMirrorTimelineBar`, `LeChiffre`,
`MomentsDuJour`, `ProfilEditorial`, `SceneEditoriale` (la scène du magazine,
retirée quand la mosaïque a pris l'écran), `HomeCardShowcase`, `PhoneShowcase`,
`PortraitStudio`, `ThemeMixerStudio`, `ImmersiveThemes`, `CommunityFeedHub`,
`WeddingLiveStoriesFeed`, `VendorDomainMenu`.

**Dix-huit composants.** Ce ne sont pas des déchets : ce sont des morceaux
finis, privés de page. Trois d'entre eux méritent de revenir :

- **`LeChiffre`** — le chiffre d'une personne : c'est la seule chose du produit
  qui soit *personnelle*, et elle manque sur le ticket ;
- **`MomentsDuJour`** — les huit moments du jour, déjà écrits ;
- **`SceneEditoriale`** — la scène plein cadre : elle n'a plus sa place derrière
  la mosaïque, mais elle est parfaite **au recto d'une case**, quand on ouvre
  une porte.

---

## 3. La page qui réunifie — **LA CAISSE** (`/caisse`)

Construite ce tour. Un écran, deux moitiés, et rien d'autre.

```
┌───────────────────────────────────────────┬──────────────────────┐
│  ◷  SUPER MARIAGE · RAYON 7 · 64 CONVIVES │  ○ ◔ ♥ ●   le regard │
│                                           │                      │
│   ┌─────┬─────┬─────┬─────┐               │   ┌ LE TICKET ────┐  │
│   │RAYON│RAYON│RAYON│RAYON│  la grille     │   │ 22:00 · OUV. │ │
│   ├─────┼─────┼─────┼─────┤  du magasin    │   │ Caddie gravé │ │
│   │22:00│22:17│22:30│23:00│  on coche      │   │ SOUS-TOTAL   │ │
│   ├─────┼─────┼─────┼─────┤  ce qu'on prend│   │ TOTAL  1 408 │ │
│   │métier│métier│sup│menu│                 │   │ PAYÉ · MERCI │ │
│   └─────┴─────┴─────┴─────┘               │   │ ‖‖‖ SM-03-DMD9│ │
│                                           │   └──────────────┘  │
│                                           │  couple·invité·DJ·pro│
└───────────────────────────────────────────┴──────────────────────┘
```

### Ce qu'elle réunit

| L'organe | Comment il est utilisé ici |
| --- | --- |
| **Le magasin** | le monde `magasin` : 58 cases = la caisse + 12 rayons + 45 lignes, chacune à son prix |
| **La grille** | chaque rayon est une porte (il ouvre son monde), chaque ligne se **coche** d'un doigt — la grille reste la grille |
| **Le ticket** | le vrai `TicketCaisse`, à droite, qui se recalcule à chaque coche |
| **Le cadran** | en haut à gauche : il dit **l'heure du ticket**, et le bandeau suit la lumière de cette heure |
| **Les 4 papiers** | `le couple · un invité · le DJ · un métier` — le même rouleau, quatre en-têtes |
| **Les 5 familles** | `○ ◔ ♥ ●` en haut à droite : **le regard**. Les lignes invisibles pour ce regard **quittent la grille** *et* le ticket — et le numéro change |
| **L'adresse** | `?caddie=…&regard=…` : **le lien est le reçu**. « envoyer le reçu » copie l'adresse |
| **Les 3 faces** | `/caisse` (la grille), `?face=verso` (le moteur), `?face=recto` (la page SuperMariage d'avant) |

### Ce qui disparaît

- la barre de sélection générique (elle n'a pas de sens à la caisse) ;
- l'aperçu au survol (le ticket est l'aperçu) ;
- le panneau du verso au recto-grille (il reste au verso, où il sert) ;
- tout panneau permanent : **la caisse n'a que la grille et le papier**.

### Ce qui reste à faire (dans l'ordre)

1. **Le chiffre de la personne sur le papier** — ramener `LeChiffre` (orphelin)
   comme cinquième ligne d'en-tête : le ticket devient *le sien*.
2. **Les moments du jour en rayons** — `MomentsDuJour` (orphelin) donnerait un
   tri naturel : le matin, le midi, l'après-midi, le soir, la nuit.
3. **La prise et la demande** — brancher `weddingTicket` : « cette ligne, c'est
   moi qui l'offre », et le reçu de l'invité s'imprime vraiment.
4. **Le recto d'une case** — `SceneEditoriale` quand une ligne s'ouvre : la
   photo, en plein écran, avant de cocher.

---

## 4. En une phrase

**Le site est un territoire (la grille), une horloge (le cadran), et un objet
qu'on emporte (le ticket).** La caisse les met côte à côte : on parcourt le
mariage comme un magasin, on coche, et le papier s'imprime tout seul — le même
papier que le couple, l'invité, le DJ et le métier tiennent dans la main.

---

## 5. La simplification : **le spécialiste du ticket**

Le produit faisait trop de choses à la fois. Il n'en fait plus qu'une :

> **Une liste de catégories. On coche. Le ticket sort, et il part dans les
> portefeuilles.**

`/` — l'adresse d'entrée du site — est cette page. `/ticket` et `/caisse` la
servent aussi. `?face=verso` montre le moteur, `?face=recto` rend l'ancienne
page d'accueil (rien n'est détruit).

### Tout le produit est classé, et rien d'autre n'est à comprendre

`src/lib/categoriesDuTicket.ts` — **17 catégories, 99 lignes cochables**, en
trois familles :

| La famille | Ce qu'elle contient | Ce que ça donne au ticket |
| --- | --- | --- |
| **LE JOUR J** | les 12 rayons du magasin (horaires, cuisine, images, musique, fleurs, cérémonie, bar, tenues, technique, métiers rares, petits prix) et les 3 menus | un prix, un total |
| **VOTRE SITE** | les 20 blocs du mini-site (`MINI_SITE_INVITE` + `MINI_SITE_PRESTATAIRE`) | le site s'affiche tel qu'il est coché — **inclus** |
| **LES DOCUMENTS** | les 31 documents du fonds du site (`superFooter.DOCUMENTS`) | les pièces à emporter — **incluses** |

Rien n'est réinventé : les lignes viennent du magasin (`superMariage`), du
compositeur (`grilleDuMonde`) et du fonds de documents (`superFooter`). La
caisse est la **vue unifiée** de tout ce que le produit sait déjà vendre,
afficher ou délivrer.

### Le vol du ticket — où il part, quand il sort

`src/lib/portefeuille.ts` — **cinq portefeuilles**, et chaque ligne sait qui la
reçoit :

| Le portefeuille | Ce qu'il reçoit | Le papier |
| --- | --- | --- |
| **le couple** | tout ce qui le concerne, et le total | `couple` |
| **les invités** | ce qu'ils voient et ce qu'ils prennent | `invite` |
| **la famille** | ce qui reste entre vous | `invite` |
| **le DJ** | la playlist, dans l'ordre de la soirée | `dj` |
| **les métiers** | leurs bons de commande | `metier` |

`portefeuillesVisés([ligne])` dit la trajectoire : un horaire part vers *le
couple* et *les invités* ; un métier vers *le couple* et *les métiers* ; un petit
prix vers *les invités*. **Un portefeuille vide n'existe pas** : pas de ticket
pour rien.

### L'écran, en une image

```
┌──────────────────────────────────────────────┬──────────────┐
│  LE VISUEL, ET LES INFOS DESSUS              │              │
│  Nora & Adam · 6 février 2027 · 64 convives  │  LE TICKET   │
│  ◷ 22:00 · LE SOIR              TOTAL 5 472 €│  (le vrai    │
├──────────────────────────────────────────────┤  papier)     │
│  LE JOUR J · VOTRE SITE · LES DOCUMENTS      │              │
│  HORAIRES ▸ CUISINE ▸ IMAGES ▸ …             │              │
│  ☑ 22:17 · Cérémonie — rayon 7       900 €   │              │
│  ☐ 22:30 · Cocktail — surgelés     1 200 €   │              │
├──────────────────────────────────────────────┴──────────────┤
│  ● le couple 5 472 €   ◔ les invités 891 €   ✳ les métiers  │
└──────────────────────────────────────────────────────────────┘
```

Et les deux mouvements, en CSS pur (`src/index.css`), deux `transform`, aucune
mesure :

- **`presse-du-haut`** — le papier sort **par le haut de l'écran** en glissant ;
- **`vol-du-ticket`** — il repart en rétrécissant vers le portefeuille concerné,
  et le portefeuille se met à jour.

### Ce qui a disparu de cette page

La grille dans la caisse, la barre de sélection, l'aperçu au survol, le panneau
du verso, les cinq seuils de densité à comprendre. Il reste : **un visuel, une
liste de catégories, des cases à cocher, un papier, cinq portefeuilles.**
