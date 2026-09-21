# Le tri du ticket — l'administratif a son ticket

> Relevé du 21 septembre 2026, en réponse à : « Dans le grand ticket, y'a encore
> des choses pas besoin — administratif ou juridique, donc faut trier. »

## 1. La règle

**Le ticket du mariage ne porte que le mariage.** L'état civil, les contrats, les
attestations, les assurances, les procurations — tout ce qui est **administratif
ou juridique** — ne s'imprime plus dessus : ça a son propre papier, à part, et
c'est écrit noir sur blanc **où il est parti**.

Rien n'est perdu : les pièces existent toujours au catalogue, on peut toujours
les cocher, elles comptent toujours dans le total. Elles ne sont simplement plus
**imprimées dans le grand ticket**.

## 2. Ce qui est trié, et le compte

```
  99 lignes au magasin
− 31 pièces administratives et juridiques
──────────────────────────────────────────
= 68 lignes du mariage
```

| Le morceau | Le fichier |
| --- | --- |
| les 31 identifiants (`doc-…`), les mots qui les repèrent, `estAdministrative(id)` | `src/lib/triDuTicket.ts` |
| `COMBIEN_DE_LIGNES_DU_MARIAGE` — 68, et jamais écrit en dur ailleurs | `src/lib/triDuTicket.ts` |
| la 11ᵉ univers, `papiers`, avec ses 31 lignes | `src/lib/universDuTicket.ts` |
| la section `documents` retirée des sections imprimées | `src/components/LeTicketPleinEcran.tsx` |

Le tri ne se fait pas « au feeling » sur un libellé : il se fait sur **la
catégorie** — la catégorie `documents` du catalogue du magasin (31 lignes,
toutes en `doc-…`), et `estAdministrative(id)` regarde simplement si
l'identifiant est dans cette liste. Une ligne du mariage ne peut donc pas tomber
dedans par accident, et une pièce administrative ne peut pas être oubliée.

## 3. Où le papier le dit

Le pied du grand ticket porte **une seule ligne**, et elle ne cache rien :

```
  L'ADMINISTRATIF — 31 PIÈCES, À PART          le ticket PAPIERS →
  data-ticket-administratif="31"               data-action="administratif"
```

Et le sous-total annonce d'où il vient, sans jamais compter l'administratif :

```
  SOUS-TOTAL (n LIGNES DU MARIAGE)                     …
```

`n` est le nombre de lignes **cochées**, et l'administratif n'y entre jamais :
le sous-total du mariage ne compte que le mariage.

Le bouton mène à **l'atelier, sur l'univers `papiers`** : le téléphone penché
affiche alors les 31 pièces, à cocher une par une, et le lien s'écrit tout seul —
`?ticket=papiers&lignes=…&qui=les+mariés&nom=Les+papiers`.

## 4. Ce qui se vérifie

Dans `tests/ui.test.ts`, le bloc « le tri : l'administratif et le juridique
sortent du ticket » :

- les 31 pièces administratives sont exactement celles du catalogue, et
  `estAdministrative` les reconnaît toutes ;
- **le grand ticket n'en imprime aucune** : 68 lignes, toutes du mariage ;
- le pied porte `data-ticket-administratif="31"` et le bouton
  `data-action="administratif"` ;
- l'univers `papiers` a bien ses 31 lignes, et **toutes** sont administratives ;
- le sous-total dit « LIGNES DU MARIAGE ».

## 5. La suite, si on veut aller plus loin

- **une date sur les pièces** : un état civil, ça se demande trois mois avant ;
  le ticket des papiers pourrait dire *quand* chaque pièce doit être prête ;
- **le carnet** : les 31 pièces reliées, un sommaire, et une page par pièce —
  c'est le dossier du mariage, imprimé ;
- **les yeux** : toutes les pièces ne se montrent pas à tout le monde — le
  dossier de la mairie n'est pas celui des témoins.
