# Le ticket comme objet digital — du reçu à la preuve, et de la preuve à la plateforme

> Relevé du 21 septembre 2026, à partir de deux pages montrées comme références
> (`hustla.app`, et la page d'app de la capture), et de la vision écrite par
> l'auteur du produit : paiement, reçu-preuve, imports, agent, billetterie,
> Shopify.

## 1. La référence, et ce qu'elle est vraiment

Les deux pages montrées — `hustla.app` et la capture (`nunu`) — ne sont pas des
produits : ce sont des **pages d'app**, faites sur le même gabarit. Le gabarit,
en sept blocs :

| Le bloc | Ce qu'il fait |
| --- | --- |
| une photo pleine largeur, un titre de deux lignes | « Track your day. Own your time. » — une idée, pas une fonction |
| les badges App Store / Google Play | on ne s'inscrit pas, on télécharge |
| une alternance texte / téléphone, quatre fois | **un écran, une phrase** : « Just talk. We'll organize. », « Prioritize what actually matters. », « Stay out of your own way. », « See your day clearly. » |
| une bande noire | « Built for privacy » : la confiance, une fois, sans argumentaire |
| des citations d'utilisateurs | la preuve sociale, en trois lignes étoilées |
| une foire aux questions | le seul endroit où il y a du texte, et il est court |
| un appel final, avec un QR code | on scanne, on installe — un seul geste à faire |

**Ce qu'on en garde :** l'appli **se montre** (on ne la raconte pas), chaque
bloc porte **une** idée, et il n'y a **qu'un seul geste** proposé à la fin. Ce
qu'on ne prend pas : le téléphone, les badges, les étoiles — nous n'avons pas
d'App Store.

## 2. Ce que la vision change dans le produit

> « Imaginons : si on enregistre une info bancaire, ça peut devenir une appli où
> il est facile de payer, et le reçu est déjà le ticket — et déjà là, en tant que
> preuve. Et si on importe doc, photo, capture d'écran, PDF, donc en mode devis,
> facture, tâche, mission payée, playlist, intermittent du spectacle, timeline,
> builder web… Et au début juste un champ de saisie avec un agent agentic, et
> tout se saisit lettre par lettre pendant la génération. Ou billetterie. Ou même
> pour remplacer Shopify, grâce au fait que c'est un véritable objet digital réel
> que personne n'aurait pensé comme ceci plutôt que en papier. »

**L'idée qui tient tout : le reçu est déjà une preuve.** Un ticket de caisse dit
*quoi*, *combien*, *quand*, *où*, et *qui* — et il est **archivé par les deux
côtés**. Aucun autre objet numérique n'est aussi bien placé pour ça :

| Ce qu'on ajoute | Ce que le ticket devient |
| --- | --- |
| **une info bancaire** | on paie, et **le ticket est le reçu** — pas une confirmation par courriel, pas un PDF à retrouver : l'objet qu'on vient de remplir *est* la preuve |
| **un import** (doc, photo, capture, PDF) | une pièce se pose sur le ticket : c'est une **ligne** (devis, facture, contrat, playlist, ordre de mission) avec sa provenance |
| **l'agent** | la ligne s'écrit **lettre par lettre** : on voit ce qui se saisit, et l'on peut l'arrêter |
| **le temps** | ce qui est coché, payé, daté, est **une timeline** : le ticket est aussi un journal |
| **un statut** (intermittent du spectacle) | ce n'est plus un mariage : c'est **un métier**, et le ticket dit les heures, les cachets, les frais — la mission, et sa preuve |
| **une billetterie** | un ticket, c'est déjà un billet : même objet, un autre mot |
| **Shopify** | la commande, le paiement et le reçu **sont le même objet** — au lieu d'un courriel de confirmation et d'un compte client |

Ce n'est pas une page de caisse : c'est **l'objet qui prouve**. Le mariage a été
le premier cas parce qu'un mariage, c'est exactement ça : des lignes, un total,
des papiers, et quelqu'un qui paie.

## 3. Ce qui est construit aujourd'hui

### 3.1 Le champ, d'abord

```
   ┌───────────────────────────────────┐
   │  › dites ce qu’il vous faut…      │   ← la première chose de la page
   └───────────────────────────────────┘
     l’agent a entendu « dîner »   5 lignes
```

Un champ, aucune touche à presser : on écrit, une demi-seconde passe (la phrase
se pose), l'agent lit, et il **dit ce qu'il a entendu** — ou qu'il n'a rien
trouvé, en donnant trois façons de le dire. `src/components/LeChampDuTicket.tsx`,
`data-champ`, `data-champ-saisie`, `data-champ-entendu`, `data-champ-compte`,
`data-champ-rien`.

### 3.2 L'agent n'écrit que ce que le papier imprime

C'est la règle neuve, et elle vient du tri : l'agent lit **tout** le magasin
(99 lignes) mais il écrit sur **ce papier-ci**. Il ne propose donc jamais :

- une pièce **administrative** (`estAdministrative`, 31 lignes) ;
- une ligne du **mini-site** (`LIGNES_DU_SITE`, 20 lignes) — il n'existe plus.

Il reste **48 lignes**, et `lignesImprimables()` le dit. Cinq lignes par
génération (`COMBIEN_PAR_GÉNÉRATION`) : on regarde arriver, et on relance.
`src/lib/agentDuTicket.ts`.

### 3.3 Et tout s'écrit lettre par lettre

```
   ┌──────────────────────────────────┐
   │  › LE MENU SUPER ESSENTIEL▌      │   la caisse écrit — 16 ms par lettre
   └──────────────────────────────────┘
```

Ce que l'agent a fait venir ne tombe pas d'un coup : **ça s'imprime**. La ligne
de tête s'écrit sur le papier, lettre à lettre (`data-ticket-frappe`,
`data-ticket-frappe-mot`, `.vp-curseur`) ; quand elle est entière, **elle entre
dans le ticket** — cochée, au marker — et la suivante prend la main. Le total
monte à chaque ligne écrite.

Et c'est **vérifiable**, pas seulement joli : la frappe est une machine pure
(`src/lib/laFrappe.ts`) — `unPasDeLaFrappe(file, pas)` rend le pas suivant, et
`mettreEnFile` refuse les doublons. Les tests la **déroulent en entier** : autant
de pas que de lettres, chaque texte est un début de son mot, le curseur repart de
zéro à chaque ligne, et les lignes écrites sortent dans l'ordre — une fois
chacune, jamais deux.

## 4. Le ticket évolutif — construit le 21 septembre au soir

> « Faudrait un champ avec option et un + pour créer une opération ou autre. »
> « Ça pourrait être un ticket évolutif : quelqu'un te paye, ça arrive sur le
> ticket, et de son côté c'est rangé en facture et en reçu. Devis, pareil. Rien à
> préparer — les clients se le procurent tout seuls. » « Ou alors implémenter un
> code puissant, tout ce qu'on peut mettre. »

### 4.1 Le + du champ, et les cinq opérations

Le champ a maintenant **un seul contrôle : le +**. Il ouvre cinq opérations, et
chacune **écrit son début dans le champ** — l'agent finit le travail.

| L'option | Ce qu'elle fait arriver |
| --- | --- |
| ＋ OPÉRATION | une ligne de plus sur le ticket |
| ≈ DEVIS | un prix proposé, à accepter |
| € FACTURE | ce qui est dû, et par qui |
| ✎ NOTE | un mot pour soi — ou pour tous |
| ↧ IMPORT | un doc, une photo, une capture, un PDF |

`LES_OPÉRATIONS`, `data-champ-plus`, `data-champ-option`.

### 4.2 L'agent exécute des ordres, il ne propose plus

`lesOrdresDeLAgent(demande, prises, combien)` rend **un** ordre, le plus précis
d'abord : `face` (« vue client »), `opération` (« devis 300 € pour Jean »),
`lignes` (« des photos »), `rien`. Le champ l'exécute et **dit ce qu'il a
compris**.

- le genre se lit au mot (`devis`, `facture`, `note`, `import`) ;
- **l'argent ne se lit que quand la monnaie est écrite** : « devis 300 € » fait
  300 €, « un dîner pour vingt » ne fait pas vingt euros ;
- le destinataire se lit après « pour » / « à » — l'article ne fait pas partie du
  nom (« pour le traiteur » → *traiteur*) ;
- **une note est privée par défaut** : elle ne se partage que si la phrase le dit.

### 4.3 Un seul objet, deux faces

Ce n'est pas deux documents à tenir : c'est **le même papier**, lu des deux
côtés — `?vue=client`, ou « vue client » à l'agent, ou la ligne du pied.

| | Émetteur (nous) | Client (lui) |
| --- | --- | --- |
| le titre | SUPER MARIAGE | **FACTURE**, puis **REÇU** une fois réglé |
| les lignes | tout le magasin (catalogue) | **seulement ce qui est pris** : son addition |
| la cagnotte, le rêve | oui | **non** |
| l'administratif | oui, « HORS TICKET » | **non** |
| les notes | toutes | **seulement celles qui sont partagées** |
| le geste | TOTAL | TOTAL — et il devient RÉGLÉ |

`lesFacesDuTicket.ts` : `LES_FACES`, `leTitreDuPapier`, `laFaceMontre`,
`laNoteSeMontre`, `lAutreFace`. Sans rien de pris, le papier du client **le dit**
(« rien à régler pour l'instant ») : jamais un papier vide.

### 4.4 Le code porte tout — et le total compte ce qui arrive

`leCodeDuTicket({ code, coches, marker, face, payé, opérations })` écrit **tout
le ticket en une ligne** (`SM1.NUB-139.c=…​.m=vert.v=client.p=1.o=…`), et
`lÉtatDuCode` le relit à l'identique — c'est la forme qui pourra voyager (lien,
QR, coin de nappe). Le code-barres du papier est fait de cette signature
complète : `data-ticket-signature`.

Et **ce qui arrive compte** : les prix des opérations s'ajoutent au total
(`lApportDesOpérations`), avec leur propre ligne dans le pied — « LES OPÉRATIONS
(n) + 300 € ». Un devis accepté, une facture, une ligne de plus : le total monte.

## 5. Ce qui reste à décider

- **le paiement** : une info bancaire, et le ticket devient le reçu — c'est un
  vrai chantier (sécurité, conformité, PSP) et il faut décider *qui* encaisse ;
  aujourd'hui le geste existe (le total), la preuve reste à brancher ;
- **l'import** : l'opération `import` s'écrit déjà sur le papier, mais la pièce
  (doc, photo, capture, PDF) n'est pas encore déposée : il faut décider où on la
  lâche, et ce qu'elle devient (une vignette sur la ligne, un papier à part) ;
- **le statut** : le ticket d'un intermittent, d'un artisan, d'un prestataire —
  c'est le même objet, avec d'autres mots et d'autres taxes ;
- **la billetterie** : un ticket vendu, scanné, et validé — la même ligne, avec
  un porteur ;
- **ce qu'on garde du mariage** : le mariage reste le premier cas, simple — 48
  lignes, un marker, un total ;
- **qui voit quoi dans un ticket groupé** : la note privée est le premier pas ; le
  reste (une ligne cachée à quelqu'un, plusieurs porteurs) reste à faire.
