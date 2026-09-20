# Le code du mariage — une signature, pas une porte

Un mini-site de mariage se **partage** : il y a un couple, une date, un lieu, et
un code. Le code est ce qui rend le mariage reconnaissable — il s'écrit **au
début du ticket** et il voyage dans le lien qu'on envoie aux invités.

**Ce n'est pas une condition d'entrée.** « Supprime le bloc avec le code, je
l'ai même pas » : la porte qui demandait le code a été retirée le 21 septembre.
On arrive sur la page, tout de suite.

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

## 2. Le code n'est plus une porte

Personne n'a de code sous la main au premier passage — et une porte fermée sur un
site de mariage, c'est un mur. Le code est donc devenu **une conséquence, jamais
une condition** :

| Où le code vit | Ce qu'il y fait |
| --- | --- |
| l'adresse (`?code=A7K-241`) | c'est le lien que le couple envoie : l'invité qui l'ouvre voit le mariage de ce couple |
| le début du ticket | juste sous la marque, à côté de `SUPER MARIAGE` — c'est ce qui identifie le papier |
| le bouton « partager aux invités » | le lien recopié part avec le code dedans |

Sans code dans l'adresse, la page prend **celui du mariage de démonstration**
(calculé depuis le couple et sa date, comme les autres). Un lien avec un autre
code (`?code=XK9-318`) imprime cet autre code sur le ticket — c'est tout.

Ce qui a été retiré : l'écran de porte (`LaPorteDuMariage`), le bouton « changer
de code », la puce du code dans la barre, et le code affiché sur l'écran de
l'appareil (il porte maintenant **la date du mariage**). L'écran de porte reste
dans l'historique git si un jour on veut le reprendre.

## 3. Les écrans : des chiffres, pas des phrases

Deux écrans, et une règle : **ils montrent le mariage, ils ne parlent pas d'eux**.
Pas de marque répétée à chaque ligne, pas de mode d'emploi, pas de phrase qui
décrit l'écran lui-même. Ce qu'on y lit, dans l'ordre :

| L'écran | Ce qu'il montre |
| --- | --- |
| **la machine** | l'en-tête (`SUPER MARIAGE`, la caisse, l'heure), la proposition en cours (`LE JOUR J`, son compte de lignes), et **le total en gros** avec le nombre de lignes |
| **l'appareil** | la catégorie en haut à gauche, le code à droite, **le rêve sur l'image**, puis le pourcentage financé, la jauge, le reste à financer et le total du mariage |

Un test le tient : l'écran de l'appareil doit porter le pourcentage, le reste et
le mariage, et **ne doit contenir ni « affiché sur l'écran » ni la marque** ;
l'écran de la machine ne doit plus réciter son mode d'emploi.

## 4. Le rêve, et le budget

Le site a **une cible** : les mariés le partagent à leurs invités pour **faire
des économies et se payer leur voyage de rêve**.

**Le rêve, ce sont les mariés qui le décrivent.** Dans l'appareil, un champ —
« décrivez votre rêve » — prend leurs mots ; l'écran les affiche en titre, le
ticket les imprime sur la ligne du voyage (`VEGAS EN JANVIER · LE VOYAGE`), et
la description part dans l'adresse (`?reve=…`), donc dans le lien envoyé aux
invités. S'ils n'écrivent rien, il reste le rêve de la maison (`LE_RÊVE` :
Joshua Tree, deux vols, six nuits, une voiture — **4 320 €**) : il y a toujours
une cible, sinon rien ne se met d'accord.

Le budget suit le ticket, il ne se saisit pas :

| La règle | Le chiffre |
| --- | --- |
| chaque ligne cochée met de côté | **180 €** (`ÉCONOMIE_PAR_LIGNE`) |
| ce qui est mis de côté | `lignes × 180`, **jamais plus que le prix du rêve** |
| ce qu'il reste à financer | `prix − mis de côté`, jamais négatif |
| la jauge | la part du rêve, de 0 % à 100 % — sur l'écran **et dans la barre**, pour la voir sans descendre |
| quand c'est payé | « ✓ LE VOYAGE EST PAYÉ » — et le mariage reste à payer |

Tous ces nombres sortent de `budgetDuRêve()` (`src/lib/codeDuMariage.ts`) ; le
test les vérifie : à zéro ligne rien n'est mis de côté, dix lignes valent dix
fois 180 €, et l'on ne dépasse jamais 4 320 €.

## 5. Les objets, imprimés

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

## 6. Les stickers

Chaque objet posé, chaque ligne cochée, chaque geste **tire un sticker** : un
**carré coloré**, un mot dedans, comme les étiquettes d'une collection. Huit
couleurs, prises dans la palette des magazines (`COULEURS_DES_STICKERS`) ; même
mot, même couleur (`stickerDe`). Dix au maximum restent à l'écran — au-delà, le
premier s'en va.

## 7. Le papier sort par le dessous

L'animation est celle de la fente, pas du papier : **la fente est en bas** de
l'appareil (`data-fente-bas="vrai"`), et le papier **naît derrière elle puis
descend** (`presse-par-le-bas`, 760 ms). On ne le voit donc jamais apparaître par
le haut.

## 8. Où c'est écrit

| Le morceau | Le fichier |
| --- | --- |
| le code, le rêve, le budget, les objets, les stickers | `src/lib/codeDuMariage.ts` |
| la porte, l'écran, la jauge, la fente, les stickers, le ticket | `src/components/AppareilDuMariage.tsx` |
| le métier, la marque, les héros | `src/lib/bandesDeLAime.ts` |
| l'ordre de la page | `src/pages/LaCaisse.tsx` |
| la page unique (les routes) | `src/App.tsx` — `/`, `/ticket`, `/caisse`, et tout le reste renvoie à `/` |
| les preuves | `tests/ui.test.ts` — « le tour : le code mariage, le rêve, les objets, les stickers, le header » |

## 9. Aller voir

| Adresse | Ce qu'on y voit |
| --- | --- |
| `/` | le site, tout de suite — une seule page (code de démonstration) |
| `/?code=A7K-241` | le même site, avec le code d'un autre mariage sur le ticket |
| `/?coches=…` | le site avec un ticket déjà rempli |
| `/?reve=…` | le site avec le rêve, dans les mots des mariés |
| `/?face=recto` | la page d'avant de l'accueil |
