# L'appli n'est plus qu'un ticket

> Relevé du 21 septembre 2026, en réponse à : « En fait garde que le ticket du
> haut c'est suffisant, et pourquoi pas choisir sa couleur de marker, et supprime
> le visuel pour garder l'esprit ticket, et supprime les boutons y'a pas trop
> d'effet, et même le mini-site, on reste sur le ticket, et le but c'est de
> nettoyer l'appli et pouvoir configurer le ticket. […] On va revenir au mariage
> simple, mais on va même décider nous-même d'un ticket unique qui suffira à
> lui-même. »

## 1. La référence : hustla.app

Le site montré en exemple dit **une seule idée, et il la tient** :

| Ce qu'il fait | Ce qu'on en garde |
| --- | --- |
| « Tu n'as pas besoin d'un gestionnaire de projet, tu as besoin de savoir quoi faire aujourd'hui » | une phrase, une idée, et le produit la démontre |
| **Trois listes. C'est tout le système.** | **un ticket. C'est tout l'appli.** |
| « Les autres applis t'enterrent sous des dossiers, des étiquettes, des priorités, des projets — tu passes plus de temps à organiser l'appli qu'à faire le travail. Hustla fait l'inverse. » | on supprime les bandes, les portes, les ateliers, les grilles, le mini-site : tout ce qui demande d'organiser le mariage **avant** de le remplir |
| « Rends-le tien » (l'apparence, les sons, le comportement) | **sa couleur de marker** — le seul réglage, et il change vraiment le papier |
| le produit est **montré**, jamais raconté | le papier est à l'écran, et l'on clique dessus |

## 2. Ce qui est monté — et ce qui ne l'est plus

```
        AVANT                                   MAINTENANT
  ┌───────────────────────┐              ┌───────────────────────┐
  │ la machine, la fente  │              │                       │
  │ le visuel du jour     │              │      LE TICKET        │
  │ le titre, les héros   │   ────────▶  │   (et rien d'autre)   │
  │ l'appareil, le rêve   │              │                       │
  │ les 48 lignes, le pied│              │   ● ● ● ● ● ● marker  │
  │ l'archive, l'atelier  │              └───────────────────────┘
  │ le mini-site, la barre│
  └───────────────────────┘
```

| Retiré de la page | Pourquoi |
| --- | --- |
| **la grille du monde** (`AppGrille`, `FaceDuSite`) | « supprime le visuel pour garder l'esprit ticket » — `/` ne montre plus la mosaïque, il montre le papier |
| **le coupon du jour** (le visuel imprimé sur le ticket) | garder l'esprit ticket : du texte, des chiffres, un code-barres — pas une image |
| **le pupitre** (les sept pictos à tamponner) | « supprime les boutons, y'a pas trop d'effet » — il reste **un geste** : le total, qui écrit `PAYÉ` |
| **le mini-site** (`?site=1`, `MiniSiteDuMariage`) | « et même le mini-site, on reste sur le ticket » — ses 20 lignes ne s'impriment plus non plus |
| **l'archive**, **l'atelier**, **le téléphone**, **les bandes éditoriales**, **la machine**, **la pastille flottante** | l'appli redevient simple ; les fichiers restent dans le dépôt |

**Rien n'a été détruit.** Les composants, les libs, les pages, leurs styles et
leurs dessins sont là, intacts — ils ne sont simplement plus montés. Une ligne
dans `src/App.tsx` ou dans `src/pages/LaCaisse.tsx` les fait revenir.

## 3. Le champ, et l'agent — 21 septembre, au soir

> « Et au début juste un champ de saisie avec un agent agentic, et tout se saisit
> lettre par lettre pendant la génération. »

La première chose de la page n'est plus le papier : **c'est un champ**. On écrit
« un dîner pour vingt », l'agent lit, dit ce qu'il a entendu, et **le papier
écrit les lignes une à une, lettre par lettre** — chaque ligne écrite entre dans
le ticket, cochée, au marker. Cinq lignes par génération, et l'agent n'écrit que
ce que ce papier imprime (48 lignes : ni l'administratif, ni le site).

Le champ a **un seul contrôle, le +**, qui ouvre les cinq opérations (opération,
devis, facture, note, import) ; quand on écrit, l'agent rend **un ordre** —
`lesOrdresDeLAgent` — et l'exécute : des lignes, une opération, ou **la face du
papier** (« vue client » : sa facture, puis son reçu). Ce qui arrive **compte
dans le total**. Le code-barres est fait du **code complet** du ticket, qui porte
tout (`leCodeDuTicket`).

`LeChampDuTicket`, `laGénération` et `lesOrdresDeLAgent` (`agentDuTicket.ts`),
`laFrappe.ts`, `lesOpérations.ts`, `lesFacesDuTicket.ts`, `leCodeDuTicket.ts` —
et la vision complète (paiement, preuve, imports, billetterie, Shopify) dans
`docs/le-ticket-comme-objet-digital.md`.

## 4. Le ticket, et ses deux gestes

```
   ┌──────────────────────────────────┐
   │         SUPER MARIAGE            │
   │  NUB-139 · CAISSE 3 · 23:00      │
   │  LA JOURNÉE      2/5             │   on clique une ligne : elle passe
   │   22:00  les néons          45 € │   au marker, le total se refait
   │  LA MUSIQUE · LA TABLE · LES GENS│
   │  LES PETITS PRIX                 │
   │  LE VOYAGE      ▬▬▬▬░░░  32 %    │
   │  TOTAL             41 320 €      │   on clique le total : PAYÉ
   │  ▮▮▯▮▯▯▮▮▯  NUB-139               │
   │  L'ADMINISTRATIF — 31 PIÈCES     │   écrit, plus cliquable
   │                                  │
   │  ● ● ● ● ● ●   LE MARKER         │   six couleurs : sa couleur de fluo
   └──────────────────────────────────┘
```

Deux gestes, un réglage. C'est tout — et c'est le but.

## 5. Le tri, en clair

```
  99 lignes au magasin
− 31 pièces administratives et juridiques   →  hors du ticket (docs/le-tri-du-ticket.md)
− 20 lignes du mini-site                    →  le mini-site n'existe plus
──────────────────────────────────────────
= 48 lignes du mariage, imprimées
```

C'est `COMBIEN_DE_LIGNES_IMPRIMÉES` dans `src/lib/triDuTicket.ts`, et le
SOUS-TOTAL du papier dit « LIGNES DU MARIAGE ».

## 6. Le marker

| Le morceau | Où |
| --- | --- |
| les six markers, leurs couleurs, `markerParId`, `adresseAvecMarker` | `src/lib/lesMarkers.ts` |
| le choix, sous le papier (`data-ticket-marker`, `data-marker`, `data-marker-actif`) | `src/components/LeTicketPleinEcran.tsx` |
| la couleur devient `--vp-fluo` sur toute la page | `src/pages/LaCaisse.tsx` |
| elle vit dans l'adresse : `?marker=vert` | `adresseAvecMarker` |

Un marker, c'est **une couleur et un mot** : jaune (le fluo de caisse), vert
menthe, rose bonbon, orange ambre, bleu ciel, violet lavande. Ce qu'on coche
prend cette encre-là, les chiffres du rêve aussi — et le lien envoyé arrive avec
le bon marker.

## 7. Ce que ça laisse ouvert

- **la couleur du papier** : le marker change le fluo ; on pourrait aussi choisir
  le papier (ivoire, blanc, bleu de caisse) ;
- **le nom du ticket** : `SUPER MARIAGE` est imprimé ; le mariage pourrait écrire
  le sien ;
- **les 48 lignes** : elles sont le magasin entier du mariage — on peut décider
  d'un **ticket court** (les 12 lignes qui comptent) et d'un **ticket long**
  (les 48) ;
- **ce qu'on garde du nettoyage** : l'archive, l'atelier des univers et le
  mini-site sont de côté, intacts — prêts à revenir si l'on veut.
