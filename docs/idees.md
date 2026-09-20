# Les idées — ce que le site peut déjà faire, et ce qu'il peut devenir

> Relevé fait le 20 septembre 2026, à partir de ce qui **existe déjà** dans le
> code : chaque idée dit sur quoi elle s'appuie. Rien n'est promis : on liste ce
> qui est possible, pour choisir.

## 1. Le point d'état et la fente — le système nerveux

- **Six paliers de couleur** (vert, bleu, mauve, fuchsia, orangé, rouge) : posé.
  Le point s'allume au palier le plus haut de ce qui reste à voir.
- **Tout passe par la fente** : documents, messages, notifications — posé.
  On pourra y ajouter les **rappels** (une date approche), les **alertes
  juridiques** (une règle change), les **retours d'un prestataire**.
- **Le ticket porte toujours vos droits** : « vous n'êtes pas obligé d'ouvrir, ni
  d'imprimer ; votre choix est horodaté » — posé.
- **Trois gestes** : ne pas ouvrir, valider, négocier — posé.
- **Ce qui reste à construire** : le **journal** de toutes les décisions (qui a
  vu quoi, et quand), la **notification à l'autre personne** quand on valide, et
  la **négociation à plusieurs tours** (offre, contre-offre, accord).
- **À faire valider** : ce que cette trace vaut réellement. Le site n'affirme
  aucune valeur probante : il dit ce qu'il enregistre, et les juristes tranchent.

## 2. Le Wallet — le portefeuille qui apprend

- **Classement automatique** : chaque pièce validée descend dans une famille
  (identité, domicile, revenus, travail, études, famille, frontières, entreprise,
  droits) — posé.
- **Familles créées d'elles-mêmes** : quand aucune ne correspond, la famille
  naît du nom de l'axe dont la pièce vient, et porte la mention « créée » — posé.
- **Ce qui reste** : les **familles reconnues** (celles que plusieurs personnes
  créent finissent par devenir communes), les **dates d'expiration** avec rappel
  par le point d'état, le **partage sélectif** (donner une pièce à quelqu'un pour
  un temps donné), et l'**export** (dossier PDF, lien temporaire).
- **Le vrai pari** : à force de demandes à travers le monde, des familles de
  documents apparaissent — et c'est ainsi qu'un portefeuille devient une
  référence.

## 3. Les vingt SUPER HÉROS — les agents

Vingt spécialistes (`src/lib/superHeros.ts`), chacun avec son palier. Ils ne
décident pas : ils **voient**, et allument le point.

| Palier | Héros | Ce qu'il surveille |
|---|---|---|
| 🟥 Critique | LE GARDIEN | Qui peut voir quoi |
| 🟧 Urgent | LA BOUSSOLE | Visas, frontières, expatriation |
| 🟧 Urgent | LE VEILLEUR | Ce qui change dans les règles |
| 🟪 Important | LA BALANCE | Les négociations en cours |
| 🟪 Important | LE CHIFFREUR | Les budgets, les écarts |
| 🟣 À faire | L'ARCHIVISTE | Les pièces manquantes, périmées |
| 🟣 À faire | LE CHRONOMÈTRE | Les heures, les trajets, les retards |
| 🟣 À faire | LE CŒUR | Les affinités (jamais les secrets) |
| 🟣 À faire | L'INTENDANT | Les prestataires, les doublons |
| 🟣 À faire | L'ORFÈVRE | Les métiers rares |
| 🟣 À faire | LE PASSEUR DE LIEN | Ce qui manque d'un côté, existe de l'autre |
| 🔵 À savoir | LE TÉMOIN | Ce qui a été lu, refusé, accepté |
| 🔵 À savoir | LE MÉTRONOME | L'énergie, les moments, les morceaux |
| 🔵 À savoir | L'ÉCHO | Les réponses des invités |
| 🔵 À savoir | LA MÉMOIRE | Ce qui a été photographié, et ce qui manque |
| 🔵 À savoir | LE SOUFFLEUR | Les discours et les mots |
| 🔵 À savoir | LE CONCIERGE | Les arrivées, les nuits, les langues |
| 🟢 Routine | LE PASSEUR | Passé, présent, futur : faire parler les anciens |
| 🟢 Routine | LE SEMEUR | Louer, prêter, donner plutôt qu'acheter |
| 🟢 Routine | LE CARTOGRAPHE | Ce qui existe près de chez vous, et ailleurs |

**Ce qui reste** : brancher chaque héros sur une **fonction réelle** (aujourd'hui
ce sont leurs fiches), leur donner un **droit de parole** limité (une phrase, une
source), et n'en activer que trois ou quatre au début — un site qui prévient de
tout ne prévient plus de rien.

## 4. SUPER MATCH — des rencontres, pas des scores

- Ce qui existe : les **cartes** (qui vous êtes), les **univers** (où vous le
  vivez), les **métiers** (qui le rend possible), les **moments** du jour J.
- L'idée : mettre en face ce que l'un apporte et ce que l'autre attend, et
  **expliquer le match** (« Marc photographie en 35 mm ; vous avez coché lumière
  naturelle et pellicule »). Jamais un pourcentage sans raison.
- Où ça s'écrit : la fente, avec un ticket de type `match` et les trois gestes
  habituels (ne pas ouvrir, valider, négocier).

## 5. Le magazine et le shop qui suivent le rôle

- Un rôle survolé transforme le nom du site, ses deux portes, son shop et son
  magazine — posé.
- À pousser : **des numéros de magazine par rôle** (« le magazine des témoins »),
  les **guides qui manquent** dans chaque famille, et le **shop d'occasion**
  (location, prêt, don : le Semeur s'en occupe).

## 6. La playlist qui fait travailler des gens

- Des **pochettes de catégories**, puis l'énergie, le mood, les instruments, les
  moments de la journée — l'idée est posée, rien n'est construit.
- Le résultat visé : **des musiciens, DJ, groupes de reprises** qui rejouent, et
  jamais la copie des originaux.
- **La chaîne directe** : les artistes qui détiennent les droits (ou leurs
  représentants) sont mis en avant — c'est un argument, pas une contrainte.
- À faire valider : la diffusion d'extraits, les crédits, et le régime des
  sociétés d'auteurs.

## 7. Harmonies & Affinités — le test par l'émotion

- Cocher des **aspects** : apparence, lumière, émotion, paysage, atmosphère — et
  obtenir une sélection **resserrée**, avec « Revendiquer » sur les cartes.
- Puis **l'atelier de citation** : on choisit des mots, la phrase se forme, et
  **changer un mot change le sens** — jusqu'à trouver la sienne.
- Attention, et c'est important : ces aspects sont **sensibles**. Ils décrivent
  des personnes. Consentement explicite, et jamais utilisés pour trier des gens
  sans qu'ils le sachent.

## 8. Le footer, sur la page profil et dans la carte

- Le footer se configure une fois (`/footer`) et se pose partout : page profil,
  carte, mini-site — modèles prêts, il reste à les poser.
- À pousser : le footer **par rôle** (celui des mariés, celui d'un prestataire,
  celui d'un invité), et le **footer vivant** (il change quand un document se
  valide).

## 9. Ce qui n'est pas au programme

- Pas de vente de données, jamais.
- Pas de robot qui décide à la place d'une personne (les héros proposent).
- Pas de conseil juridique : des sources, des pièces, et une validation humaine.

## 10. Ce qu'il faudra trancher, un jour

1. **Le serveur** : aujourd'hui tout vit dans le navigateur. Le jour où deux
   personnes doivent vraiment se parler (une demande, une réponse), il faut une
   base, un journal, et une politique de conservation.
2. **Les langues** : allemand, anglais, espagnol — et la question des pays dont
   les règles diffèrent.
3. **La marraine du projet** : quand son nom apparaît, et sous quelle forme.
4. **Le contrôle** : ce que Sandrine Sarroche et Me Cannu-Bernad valident, et ce
   qu'elles refusent. C'est elles qui décident du moment où l'on ouvre grand.
