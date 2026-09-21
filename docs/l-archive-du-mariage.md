# L'archive du mariage — la référence « Paper Archive », et ce qu'on en a pris

Le 21 septembre 2026, une référence de composition a été montrée : le modèle
**Paper Archive** (Readymag, <https://readymag.com/>). Cette page dit ce qui a
été pris, ce qui n'a pas été pris, et où cela se voit dans le produit.

## 1. Ce que la référence fait

| La bande | Le geste |
| --- | --- |
| une **barre** minuscule en haut | quatre mots en capitales très espacées — on sait où l'on est sans qu'on nous le dise |
| la **couverture** | un fond **noir**, et **du papier posé en vrac** : une note, une enveloppe, un polaroïd, des billets, un timbre, une planche de stickers, un disque, une fleur — puis, **par-dessus le désordre**, un titre sérif immense, sur deux lignes |
| « The Locals » | fond clair, titre sérif à gauche, deux lignes de description, puis une **grille de polaroïds** — cadre blanc, image dedans, légende sur deux lignes (« Nom, Lieu / 1998 »), chaque pièce **de travers** |
| « The Settings » | la même grille, sur fond **noir**, en cartes postales |
| « About me » | le titre sérif à gauche, la description dessous, une pièce à droite, et une feuille volante |
| « Get in touch! » | un titre énorme, la colonne de contact, et **une seule pastille**, en bas à droite |

Trois principes fins : **le noir fait la galerie** (les images sont posées dessus
comme sur un mur), **le papier est toujours de travers** (rien n'est aligné, tout
est posé), et **le titre passe par-dessus** (c'est lui qui tient le désordre).

## 2. Ce qui a été pris — et où c'est écrit

| Le principe | Chez nous | Où |
| --- | --- | --- |
| la couverture noire, le papier en vrac | **le papier du mariage, étalé** : le reçu, le polaroïd du jour, la carte postale du voyage, le timbre, le sticker fluo, la note des sept objets, la bande de la nuit en musique, et le code | `LaCouvertureArchive`, bande `data-bande="archive"` |
| le titre sérif par-dessus le désordre | « **Super Mariage** », en Fraunces, sur deux lignes, avec la ligne du haut (le code, la date, AIME) | `.vp-didone`, `.vp-archive-titre` |
| la grille de polaroïds légendés | **les quatre catégories** deviennent quatre pièces : cadre blanc, image en 4/5, légende dessous (le mot, le titre, la phrase, le chemin) — chacune penchée de son côté | `LesHeros`, bande `data-bande="héros"` |
| la pastille unique en bas à droite | **« partager le mini-site »**, en pastille d'encre collée en bas à droite, avec le compte des lignes | `data-action="partager-flottant"` |
| une barre minuscule, très espacée | la ligne du haut de l'archive : `NUB-139 · 12 JUIN 2027` à gauche, `AIME · LE SPÉCIALISTE DU TICKET` à droite | `data-archive-code` |

**Et une chose que la référence ne peut pas faire, et que nous faisons : chaque
papier s'ouvre en grand, et propose ce qu'il annonce.** C'est du collage
*vivant* —

| Le papier | Où il mène |
| --- | --- |
| le reçu | **le ticket plein écran** (`#le-ticket-plein`) |
| le polaroïd du jour | le visuel du jour (`#le-visuel`) |
| la carte postale | l'appareil et le voyage (`#l-appareil`) |
| la note des sept objets | l'appareil (`#l-appareil`) |
| la bande de la musique | le ticket, où le plan de la nuit est imprimé |

Les autres pièces — le timbre, le sticker, le code — ne mènent nulle part : elles
**sont** l'archive.

## 2 bis. Les trois gestes, sur chaque pièce

> « Les cartes postales plus petites, en haut, pour pouvoir les déplacer, les
> retourner, et écrire. » — et : « au clic sur les papiers ça s'ouvre petit,
> donc y'a bug. »

Le collage ne se regarde plus : il se **touche**. Trois gestes, et rien d'autre.

```
   ①  ON LA DÉPLACE      le doigt (ou la souris) la prend, on la pose ailleurs
                         — les pièces sont petites exprès, il y a de la place
   ②  ON LA RETOURNE     le petit bouton du coin ↺ : au dos, un vrai dos de
                         papier, et un champ où l'on écrit à la main
   ③  ON L'OUVRE         un clic : la pièce s'ouvre EN GRAND, à la largeur de
                         la feuille — et c'est là qu'elle propose d'aller voir
                         ce qu'elle annonce
```

Ce qu'on écrit au dos est **gardé sur place** (`localStorage`,
`supermariage:pieces`) avec la place de chaque pièce : on retrouve sa table
comme on l'a laissée. Rien ne part nulle part — un brouillon sur la table.

Deux détails qui font que ça marche :

- **déplacer n'est pas ouvrir** : si la pièce a bougé de plus de trois pixels,
  le clic n'ouvre pas — on vient de la poser ;
- **en grand, c'est grand** : la feuille ouverte fait toute la largeur
  (`data-archive-feuille-grand="vrai"`, `.vp-piece-grand`), elle porte son dos,
  son champ et sa porte. C'était ça, le bug : la pièce s'ouvrait à sa taille de
  collage, donc « petit ».

## 3. Ce qui n'a pas été copié

| Ce qu'on a laissé | Pourquoi |
| --- | --- |
| la marque, le nom « Paper Archive », le mot « archive » comme titre | ce n'est pas nous : la nôtre s'appelle AIME, et le produit est un mariage |
| les mots (« HOME », « THE LOCALS », « THE SETTINGS », « CONTACTS », « About me », « Get in touch! ») | nos mots sont ceux du ticket : le jour J, le voyage, les objets, l'accès |
| les objets de leur collage (bracelet à lettres, disque vinyle, fleurs, mots croisés, cerises, enveloppe rose) | notre papier est celui qu'on imprime : reçu, carte postale, timbre, sticker, bande thermique |
| la vente du modèle (« Buy template for $32 ») | nous ne vendons pas un modèle ; la pastille partage le lien du mini-site |
| le fil rouge décoratif du haut | notre fil à nous, c'est la bande de papier — et elle porte la musique |
| les photos d'archive de quelqu'un d'autre | nos images sont celles du magazine (54 semaines, 7 chapitres) |

## 4. Où c'est écrit

| Le morceau | Le fichier |
| --- | --- |
| le papier étalé (genre, mot, place, inclinaison, **dos et invite**, ce qu'il ouvre) | `src/lib/archiveDuMariage.ts` |
| la couverture-archive | `src/components/LaCouvertureArchive.tsx` |
| les quatre polaroïds | `src/components/LesBandesDeLAime.tsx` (`LesHeros`) |
| la pastille flottante | `src/pages/LaCaisse.tsx` (`partagerLeMiniSite`) |
| le noir, le sérif, le collage, le polaroïd, le timbre | `src/index.css` (`.vp-archive`, `.vp-didone`, `.vp-collage`, `.vp-posé`, `.vp-piece`, `.vp-piece-grand`, `.vp-polaroïd`, `.vp-timbre`) |
| les preuves | `tests/ui.test.ts` — « l'archive : le papier étalé, et les polaroïds » |

## 5. La règle d'écran, tenue

La référence pose ses pièces **sans un mot sur elles**. Nous gardons la même
discipline : le papier ne se raconte pas, il **montre** — le code est écrit
dessus, la date est écrite dessus, et la seule phrase de la bande dit ce qu'il y
a sur la table. Les écrans (le ticket) ne récitent toujours rien.

## 6. Aller voir

| Adresse | Ce qu'on y voit |
| --- | --- |
| `/` | le ticket plein écran — **sans header** —, puis **l'archive** : le papier étalé, vivant, et les quatre polaroïds |
| `/#l-archive` | la couverture-archive (la barre et le pied y mènent) |
| `/#les-catégories` | les quatre polaroïds |
| `/?site=1` | le mini-site des invités — sans la pastille : là-bas, il n'y a rien à partager |
