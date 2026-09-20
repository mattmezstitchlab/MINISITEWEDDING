# Le code du mariage — on arrive, on entre

« On arrive et on doit donner un code mariage. » Un mini-site de mariage se
**partage** : il y a un couple, une date, un lieu, et un code. On ne tombe donc
pas sur la page par hasard — on ouvre une porte.

## 1. La forme du code

```
A7K-241
└┬┘ └┬┘
 │   └── trois chiffres : les jours qui restent avant le mariage
 └────── trois signes : pris dans les noms et le lieu, mêlés
```

- **trois signes**, puis un **tiret**, puis **trois chiffres** : `^[A-Z0-9]{3}-\d{3}$` ;
- les trois signes viennent du premier, du tiers et des deux tiers de la chaîne
  `noms + lieu`, sans accents (`codeDuMariage`) ;
- les trois chiffres sont les **jours restants** avant la date du mariage ;
- la fonction est **déterministe** : le même mariage donne toujours le même code,
  sans rien stocker, sans base de données ;
- on écrit le code comme on veut (`a7k 241`, `A7K241`, minuscules, espaces) :
  `codeDepuis` le remet en forme, `codeAccepté` dit s'il ouvre.

**Ce n'est pas un mot de passe** : un code bien formé ouvre. Ce qui compte, c'est
qu'on ne puisse pas *tomber* sur la page — il faut le lien que le couple a
envoyé. Le couple partage donc une adresse : `https://…/?code=A7K-241`, et
l'invité qui l'ouvre est dedans.

## 2. La porte

| Ce qu'on voit | Ce que ça dit |
| --- | --- |
| un écran vert-de-gris, fermé | c'est une machine, pas un formulaire |
| `SUPER MARIAGE` / `LE SPÉCIALISTE DU TICKET DE CAISSE` | la marque, et le métier |
| `ENTREZ LE CODE DU MARIAGE` | ce qu'on attend, en clair |
| le champ + la touche entrée | trois signes, un tiret, trois chiffres |
| « c'est le code écrit sur le ticket — celui que le couple partage » | d'où il vient |
| le refus, si le code est mal formé | « six signes : trois, un tiret, trois » |
| un code à essayer | pour voir la page sans être invité |

La porte est `LaPorteDuMariage` (`src/components/AppareilDuMariage.tsx`) ; ses
repères de test sont `data-porte`, `data-porte-champ`, `data-porte-ouvrir`,
`data-porte-refus`, `data-porte-démo`.

Une fois entré, le code est **partout** : dans la barre (bouton « le code du
mariage » — il ramène à la porte pour changer de mariage), sur l'écran de
l'appareil, en haut du ticket, et au début de chaque ligne d'objet imprimé
(`A7K-241-AV · BILLET D'AVION · JOSHUA TREE`).

## 3. Le rêve, et le budget

Le site a **une cible** : les mariés le partagent à leurs invités pour **faire
des économies et se payer leur voyage de rêve**. Le rêve est écrit une fois, en
données (`LE_RÊVE`) : Joshua Tree, deux vols, six nuits, une voiture — **4 320 €**.

Le budget suit le ticket, il ne se saisit pas :

| La règle | Le chiffre |
| --- | --- |
| chaque ligne cochée met de côté | **180 €** (`ÉCONOMIE_PAR_LIGNE`) |
| ce qui est mis de côté | `lignes × 180`, **jamais plus que le prix du rêve** |
| ce qu'il reste à financer | `prix − mis de côté`, jamais négatif |
| la jauge | la part du rêve, de 0 % à 100 % |
| quand c'est payé | « ✓ LE VOYAGE EST PAYÉ » — et le mariage reste à payer |

Tous ces nombres sortent de `budgetDuRêve()` (`src/lib/codeDuMariage.ts`) ; le
test les vérifie : à zéro ligne rien n'est mis de côté, dix lignes valent dix
fois 180 €, et l'on ne dépasse jamais 4 320 €.

## 4. Les objets, imprimés

Six objets s'impriment, et **chacun laisse sa ligne de code** sur le papier :

| Objet | Sigle | La ligne |
| --- | --- | --- |
| le billet d'avion *(cible)* | `AV` | `A7K-241-AV · BILLET D'AVION · JOSHUA TREE` |
| la carte postale *(cible)* | `CP` | `A7K-241-CP · CARTE POSTALE · À ENVOYER` |
| le tampon | `TA` | `A7K-241-TA · TAMPON · L'ENCRE DU JOUR` |
| le timbre | `TI` | `A7K-241-TI · TIMBRE · CE QUI AFFRANCHIT` |
| le ticket spectacle | `SP` | `A7K-241-SP · TICKET SPECTACLE · VOTRE PLACE` |
| le sticker | `ST` | `A7K-241-ST · STICKER · LE REPÈRE` |

Le délire des objets est donc **dans la chaîne** : le ticket de caisse (la
liste), le billet d'avion (le départ), la carte postale (ce qu'on envoie une fois
là-bas), et le timbre qui l'affranchit.

## 5. Les stickers

Chaque objet posé, chaque ligne cochée, chaque geste **tire un sticker** : un
**carré coloré**, un mot dedans, comme les étiquettes d'une collection. Huit
couleurs, prises dans la palette des magazines (`COULEURS_DES_STICKERS`) ; même
mot, même couleur (`stickerDe`). Dix au maximum restent à l'écran — au-delà, le
premier s'en va.

## 6. Le papier sort par le dessous

L'animation est celle de la fente, pas du papier : **la fente est en bas** de
l'appareil (`data-fente-bas="vrai"`), et le papier **naît derrière elle puis
descend** (`presse-par-le-bas`, 760 ms). On ne le voit donc jamais apparaître par
le haut.

## 7. Où c'est écrit

| Le morceau | Le fichier |
| --- | --- |
| le code, le rêve, le budget, les objets, les stickers | `src/lib/codeDuMariage.ts` |
| la porte, l'écran, la jauge, la fente, les stickers, le ticket | `src/components/AppareilDuMariage.tsx` |
| le métier, la marque, les héros | `src/lib/bandesDeLAime.ts` |
| l'ordre de la page | `src/pages/LaCaisse.tsx` |
| les preuves | `tests/ui.test.ts` — « le tour : le code mariage, le rêve, les objets, les stickers, le header » |

## 8. Aller voir

| Adresse | Ce qu'on y voit |
| --- | --- |
| `/` | la porte, fermée |
| `/?code=A7K-241` | le site, ouvert |
| `/?code=A7K-241&coches=…` | le site avec un ticket déjà rempli |
| `/caisse?face=recto` | la grande page d'avant, sans porte |
