# Les univers de ticket — et l'atelier

> Relevé du 21 septembre 2026, en réponse à : « Le ticket a plein de détails qui
> n'ont rien à voir avec le mariage… mais c'est ça qui est intéressant : on
> pourrait avoir une page ticket pour plein d'autres univers. »

## 1. La règle, en une phrase

**Le ticket n'est pas un objet de mariage : c'est un objet de métier.** Un mot, des
lignes, des prix quand il y en a, un code, un total — et **n'importe qui compose
le sien, et décide qui le voit.**

C'est ce qui ouvre les autres pages : les invités auront leur site **quand le
ticket est préparé**, les devis et les factures **quand le papier est composé**,
et chacun a son espace — parce que chacun a son ticket.

## 2. Les dix univers

| L'univers | Ce qu'il porte | Son geste | Qui le voit par défaut |
| --- | --- | --- | --- |
| **MINI-SITE** | les huit blocs du site des invités, ligne à ligne | AFFICHER | les invités |
| **PHOTOS** | douze moments à prendre — l'heure, la consigne | PRENDRE | les invités |
| **VIDÉOS** | huit clips de moins de dix secondes | FILMER | les invités |
| **REPAS** | dix lignes de recettes, d'ingrédients et de prix — **donc une économie** | PRÉPARER | la famille |
| **ENFANTS** | dix missions, à relever le jour J | RELEVER | les enfants |
| **DJ** | les neuf moments de la nuit, et ce que les gens y ajoutent | AJOUTER | le DJ |
| **RSVP** | qui vient, ce qu'il mange, où il dort, son morceau | RÉPONDRE | les invités |
| **TÉMOINS** | huit choses à ne pas oublier — le mot, la bague, l'heure | COCHER | les témoins |
| **DÉLIRES** | dix conneries, avec leurs amendes — c'est le plus lu | CRIER | tout le monde |
| **DEVIS** | les devis, l'acompte (négatif), le solde, l'imprévu | VALIDER | les mariés |

Le catalogue est dans `src/lib/universDuTicket.ts` — **pur, sans composant** :
des mots, des sous-titres, des prix, des heures. C'est ce qui le rend
vérifiable.

## 3. Les trois réglages de l'atelier

```
01 · L'UNIVERS     dix tickets — on change de métier, donc de papier
02 · LES LIGNES    on coche ce qui entre sur le ticket, ligne à ligne
03 · QUI LE VOIT   les mariés · les invités · la famille · les témoins ·
                   les enfants · le DJ · les métiers · tout le monde
04 · SON NOM       « Les photos », « Le repas », « Les conneries »
```

Et **le lien s'écrit tout seul** :

```
?ticket=photos&lignes=photo-01,photo-02&qui=les+invités&nom=Les+photos
```

Ce lien-là, c'est le ticket. Celui qui l'ouvre a **son** papier : il coche ses
lignes, il prend ses missions, et il prépare ce qu'il a promis. Rien n'est
stocké — le ticket **est** l'adresse, exactement comme le caddie du mariage.

Changer d'univers **vide les lignes** : les lignes d'un métier ne veulent rien
dire dans un autre. `composerLeTicketDeLUnivers('photos', ['repas-plat'])` rend
zéro ligne : le ticket ne prend jamais la ligne d'un autre.

## 4. Le téléphone, posé penché sur la page

```
       ╱──────────────────────╲
      │  SUPER MARIAGE NUB-139 │   ← le ticket défile dans l'écran
      │  22:00 · les néons  ✓  │
      │  22:17 · la cérémonie  │   ← on clique : la ligne se coche (fluo)
      │  …                     │
      │ ┌──────┐  ┌──────┐     │
      │ │TICKET│  │ SITE │     │   ← on bascule, et le site s'affiche
      │ └──────┘  └──────┘     │      dans le même écran
       ╲──────────────────────╱
```

Trois choses font l'objet : **la coque** (dégradé, ombre portée), **l'encoche**,
et **l'écran ivoire qui défile** (`overflow-y: auto`, barre cachée). Il est
penché de **3,5°** sur un ordinateur, et **redressé sur un téléphone** — c'est
ainsi qu'on le tient. La barre de deux touches est sous l'écran, dans la coque :
`LE TICKET` · `LE SITE`. Le site apparaît **dans le même écran** (couverture,
noms, les blocs et leurs comptes, l'adresse), et un seul geste sort du
téléphone : **« voir le site en grand »**.

Le téléphone est **le même composant dans l'atelier et sur la page** : l'atelier
le met à côté des réglages, et ce qu'on règle s'y voit aussitôt.

## 5. Ce qui a été corrigé

> « En cliquant dans le ticket de caisse, puis voir le site — ça correspond à ce
> qu'on a cliqué ?? Et les photos en haut, en cliquant on descend : ça perturbe. »

Deux corrections, et elles tiennent la même règle : **un clic fait ce qu'il dit.**

1. **L'archive ne fait plus sauter la page.** Chaque pièce (le reçu, le
   polaroïd du jour, la carte postale, le timbre, le sticker, la note, la bande,
   le code) **s'ouvre en grand** — c'est une feuille, sur le noir. Et c'est
   **là**, sur la pièce, qu'on propose d'aller voir ce qu'elle annonce
   (« voir le site des invités », « voir le voyage », « voir le visuel du
   jour »). Avant, le clic descendait : c'était le même geste pour deux choses.
2. **Le pupitre nomme ses deux gestes.** Le picto du reçu **tamponne** (`REÇU`),
   il n'emmène nulle part ; le bouton d'à côté écrit maintenant
   **« voir le site des invités »**. On ne confond plus ce qui imprime et ce qui
   ouvre.

## 6. Où c'est écrit

| Le morceau | Le fichier |
| --- | --- |
| les dix univers, leurs lignes, qui les voit, le lien | `src/lib/universDuTicket.ts` |
| le téléphone penché, l'écran qui défile, la bascule | `src/components/LeTelephoneAuTicket.tsx` |
| l'atelier : les trois réglages, et l'aperçu | `src/components/LAtelierDuTicket.tsx` |
| la pièce ouverte en grand (la feuille de l'archive) | `src/components/LaCouvertureArchive.tsx` |
| l'état, les gestes, l'adresse | `src/pages/LaCaisse.tsx` |
| la coque, l'encoche, l'écran | `src/index.css` (`.vp-tel`, `.vp-tel-coque`, `.vp-tel-écran`, `.vp-tel-barre`) |
| les preuves | `tests/ui.test.ts` — « les univers de ticket, et l'atelier » |

## 7. Ce qui reste (et qui est maintenant possible)

- **la pellicule** : la ligne PHOTOS prise ouvre l'appareil photo du téléphone,
  et la mission rendue remplit la galerie du ticket ;
- **les clips** : la même chose pour les vidéos de moins de dix secondes, avec
  le compte des secondes sur la ligne ;
- **les additions** : le ticket REPAS additionne ce que chacun apporte, et le
  ticket DEVIS recolle l'acompte et le solde sur un seul papier ;
- **l'espace de chacun** : `/t/<ticket>` — un ticket, une adresse, des yeux. La
  mécanique est déjà écrite : c'est `adresseDuTicket`.
