# Le noyau du réseau — modèle, permissions, flux

> Ce document ne code rien. Il fixe ce sur quoi on ne reviendra pas.
> Il répond à la consigne des deux cahiers des charges : *« avant de coder,
> définis le modèle de données, les relations, les permissions et les flux »*.

**État — les comptes sont ouverts, la première brique est posée.**

La carte recto-verso existe : `/carte` (`src/pages/CardStudio.tsx`), le composant
`src/components/WeddingCard.tsx`, le modèle `src/lib/weddingCard.ts`. Elle porte
le rôle, la disponibilité, le repas, la mobilité, les prestations et les
documents — **et elle n'affiche que ce qui concerne le rôle tenu**.

Elle est devenue **une personne du réseau** : `people` + `person_secrets` +
`wedding_members` sont en base (`supabase/schema.sql`), servis par
`api/people.js` et `api/wedding-members.js`, avec le miroir navigateur dans
`src/lib/localApi.ts`. La clé personnelle suit exactement le modèle des clés
d'édition — jeton aléatoire, empreinte SHA-256 en base, clair renvoyé une seule
fois, saisissable à la main pour retrouver sa carte ailleurs. Les permissions
sont appliquées **côté serveur** (`server/people.js`) et vérifiées par 141
contrôles d'API : `maries` / `participants` / `carte` pour les coordonnées,
IBAN et pièces réservés à la personne et aux mariés du mariage concerné.

**La carte a désormais sa page.** `/carte` (CardStudio) la compose, la retourne,
la publie et la relie aux mariages : photo, rôle, disponibilité, repas, mobilité,
prestations, pièces — chaque bloc n'apparaît que s'il concerne le rôle tenu. Le
recto est un grand visuel : le visuel de l'univers (ou la photo), et l'identité
par-dessus, comme les cartes de prestataires du site. **L'univers ne se choisit
plus à la création** : on le découvre sur le mini-site, et il se change dans
l'éditeur. Voir §9.

**L'invitation, ensuite.** Le lien et le QR code du panneau de partage sont
l'invitation : `/rejoindre/<slug>` pose deux questions — « qui êtes-vous dans ce
mariage ? » puis « comment vous appelle-t-on ? » — crée la carte, donne la clé
une fois, et la place est prise. La porte est aussi dans le pied du mini-site et
dans son menu. Un mariage en brouillon ne s'ouvre pas : on ne rejoint qu'un
mariage publié, ou le sien.

Reste à faire : les médias collectifs et leur rangement par moment, le fil, le
film. Et la fusion des réponses RSVP (`rsvp_responses`) dans `people` — deux
systèmes côte à côte aujourd'hui, un seul demain.

## 1. Le renversement

Aujourd'hui, **tout pend au site**. `supabase/schema.sql` le montre : dix tables,
et chacune porte une clé `site_id`. Le site est l'objet ; les personnes y
apparaissent sous forme de réponses à un formulaire — `rsvp_responses` a des
`first_name`, `last_name`, `email`, et rien d'autre : pas d'identité, pas de
rôle, pas de photos, pas de lien vers quoi que ce soit.

Les deux cahiers demandent l'inverse : **les personnes et le mariage sont les
objets, le site en est un rendu.** C'est le seul changement structurant de tout
le projet, et il faut le faire une fois, proprement.

```
Aujourd'hui   site ──> sections, programme, galerie, rsvp
Demain        mariage ──> personnes ──> contributions (médias, messages, musique)
                             │
                             └─────────> le site public est une PROJECTION du mariage
```

Conséquence : on ne crée pas un deuxième système à côté. On **déplace le centre
de gravité** et on réutilise les tables existantes là où elles disent déjà la
bonne chose.

## 2. Modèle de données

| Entité | Aujourd'hui | Décision |
|---|---|---|
| `wedding_sites` | existe | **Devient le mariage.** Elle porte déjà prénoms, date, lieu, slug, style. On ajoute `privacy`, `qr_token`. On cesse de la penser comme « un site ». |
| `site_sections`, `infos_pratiques`, `faqs`, `gift_options` | existent | Inchangées. Ce sont des contenus de la face publique. |
| `programme_events` | existe | **Devient la charpente du temps.** On ajoute `starts_at` / `ends_at` (timestamptz), `kind` (`avant` / `pendant` / `apres`). C'est ce qui permet le rangement automatique des médias. |
| `people` | **à créer** | La personne, indépendante d'un mariage. `display_name`, `photo`, `city`, `trade`, `bio`, `links`, `contact`, `visibility`. La carte du navigateur (`src/lib/weddingCard.ts`) est sa version locale — même forme, à aligner. |
| `wedding_members` | **à créer** | Le lien personne ↔ mariage : `role`, `status`, `joined_at`, `table`, `group`. **C'est ici que vivent le rôle et la permission**, jamais dans `people`. |
| `roles` | **à créer** | Taxonomie **en données**, jamais codée en dur : `key`, `label`, `category`, `position`. Ajouter un métier = une ligne, pas un déploiement. `src/lib/weddingTaxonomy.ts` reste la source d'affichage côté front. |
| `media` | `gallery_photos` existe | **Remplace `gallery_photos`** : `wedding_id`, `author_member_id`, `url`, `kind` (photo/vidéo/audio), `taken_at`, `received_at`, `place`, `bytes`, `visible_site`. |
| `posts` | **à créer** | Le fil : `wedding_id`, `author_member_id`, `kind` (post, annonce, album, sondage), `text`, `media_id?`, `moment_id?`, `expires_at?` (une story n'est qu'un post qui expire). |
| `comments`, `reactions` | **à créer** | Table simple, une ligne par couple (auteur, cible). |
| `locations` | **à créer** | Mairie, cérémonie, réception, hôtels, parkings, transports. Coordonnées, horaires. Rien d'autre. |
| `documents` | **à créer** | Devis, contrats, factures, IBAN. **Bucket privé**, URL signées. Voir §4. |
| `notifications` | **à créer** | Une ligne par destinataire et par événement. |
| `messages`, `conversations`, `stories`, `groups` | — | **Non construites** (voir §6). Un groupe n'est pas un objet : « Les témoins » est un **filtre** sur `wedding_members.role`. |

**Deux règles qui tiennent tout l'édifice :**

- **Le temps est la clé de voûte.** Un média n'est pas rangé par un humain : il
  est rangé par comparaison entre son instant et les intervalles de
  `programme_events`. Un média hors de tout intervalle va dans **« hors
  programme »** — jamais placé au hasard, jamais dans le silence.
- **La Mémoire n'est pas une fonctionnalité.** C'est une **requête** : les médias
  et les publications d'un mariage, groupés par année. Il n'y a pas de table
  « souvenir » — le jour où on en crée une, on duplique tout.

## 3. Permissions

Cinq rôles, trois niveaux de confidentialité du mariage
(`private`, `sur invitation`, `lien public`).

| Rôle | Peut |
|---|---|
| `owner` (mariés) | tout, y compris retirer un membre et tout supprimer |
| `admin` (témoins, wedding planner) | inviter, modérer, publier des annonces |
| `member` (famille, amis) | publier, commenter, réagir, voir les personnes |
| `guest` | voir le programme, répondre, publier ses médias |
| `vendor` | voir strictement ce qui concerne son intervention |

**Règles non négociables :**

1. **Aucune décision d'autorisation côté navigateur.** Le contrôle vit dans
   chaque endpoint, à partir de `wedding_members`. Un bouton caché n'est pas une
   permission.
2. **Ce qui est sensible ne sort jamais du serveur sans nécessité** : IBAN,
   documents, coordonnées, allergies. Un champ n'est lisible que par les rôles
   qui en ont besoin — décidé par le **rôle**, pas par le champ.
3. **Le bucket actuel (`wedding-media`) est public** : il ne recevra jamais un
   IBAN, un contrat ni une pièce d'identité. Les documents vivent dans un bucket
   privé, servis par URL signée à durée courte.
4. La clé d'édition d'un site (mécanisme existant) devient le cas particulier
   « le couple propriétaire ». Elle ne remplace pas les comptes, elle coexiste.

## 4. Les quatre flux

**Rejoindre.** Un lien (`/p/<slug>` — le slug existe déjà) ou un QR code →
« Qui êtes-vous dans ce mariage ? » → sept choix, pas dix-sept → prénom + photo
→ membre créé → le fil. *Aucun formulaire de plus de trois champs à l'entrée.*

**Publier.** Bouton central → photo ou vidéo → compression dans le navigateur →
envoi → **horodatage serveur** → placement par intervalle → visible au bon
endroit. Le média est attribué à son auteur, toujours.

**Le jour J.** Voir §5. Rien ne part tout de suite ; tout finit par partir.

**Après.** La Mémoire : les médias groupés par année, l'album des mariés, et le
film — qui reste **une maquette honnête** tant qu'aucun moteur réel n'est
branché.

## 5. Le jour J — l'ingénierie que les deux cahiers oublient

À 16 h, cent personnes photographient le même cocktail, sur un réseau saturé.
C'est là que ces produits meurent, et aucun des deux documents n'en parle.

- **File d'attente locale** (IndexedDB) : la photo part au réseau, pas au
  serveur. L'application doit être pleinement utilisable **sans réseau**.
- **Compression avant envoi** : une photo de 12 Mpx pèse ~4 Mo ; cent personnes
  font 400 Mo. On envoie une version utile, l'original attend le wifi.
- **Clé d'idempotence** par envoi : un renvoi après coupure ne crée jamais de
  doublon.
- **Horodatage fiable** : `taken_at` vient de l'EXIF s'il est plausible, sinon de
  l'heure serveur. `received_at` vient **toujours** du serveur. Une horloge de
  téléphone mal réglée ne doit jamais déplacer une photo dans la journée.
- **Reprise** : un envoi interrompu repart où il s'est arrêté.

## 6. Ce qu'on refuse, et pourquoi

1. **La reconnaissance faciale et l'identification automatique des personnes.**
   Des visages d'invités qui n'ont rien demandé sont des données biométriques
   (RGPD, art. 9) : consentement explicite, analyse d'impact, et un mariage n'est
   pas le lieu. L'identification est **manuelle et déclarative** : celui qui
   publie nomme qui il veut.
2. **« Qui est ici ? » (position en temps réel des invités).** On affiche les
   lieux, jamais les personnes. Diffuser où sont les gens, pendant une soirée
   arrosée, à quiconque a le lien, est un problème de sécurité, pas une
   fonctionnalité.
3. **La messagerie et les Stories.** WhatsApp existe déjà, dans chaque mariage,
   avant nous. On ne gagne pas sur leur terrain. Ce qui manque réellement à
   WhatsApp est **un canal d'annonces à sens unique** — le message important ne
   se perd pas dans 300 messages. Le reste viendra si le réseau vit.
4. **Un algorithme de fil « hybride ».** Sur soixante personnes et une journée,
   un classement opaque est du théâtre, et il coûte la confiance. **Chronologique,
   plus une seule chose : le moment en cours.**

## 7. Le MVP que je défends

Quatre choses, et rien d'autre :

1. **Le lien** — `/p/<slug>` + QR code. C'est la boucle de croissance et c'est
   presque déjà là.
2. **Le fil chronologique** — les publications, avec leur auteur.
3. **Les médias rangés au bon moment** — et le repli « hors programme ».
4. **La Mémoire** — la même donnée, relue après.

Plus une : **l'annonce** du couple, une seule, en haut.

## 8. Décisions prises

1. **Les comptes sont ouverts.** `people` + `person_secrets` + `wedding_members`
   sont en base, servis par `api/people.js` et `api/wedding-members.js` : une clé
   personnelle par personne (empreinte SHA-256 en base, clair montré une fois),
   les permissions décidées **côté serveur**, et le miroir navigateur dans
   `src/lib/localApi.ts`. Sans lui, chaque écran retombait sur un formulaire.
2. **Le mini-site est la face publique du mariage** — une projection de
   `wedding_sites`, jamais un objet séparé. C'est ce qui interdit de dupliquer.
3. **On a commencé par la carte**, visible et immédiate : `/carte` la compose,
   la publie, la relie aux mariages. Le noyau de données suit, section par
   section (§2), sans jamais recréer ce qui existe.

## 9. Ce que la refonte a tranché

- **L'univers ne se choisit pas à la création.** On compose sa carte, on
  découvre le mini-site dans son univers par défaut, et l'univers se change dans
  l'éditeur (panneau Apparence, section « Univers »). Une question de moins à
  l'entrée : le choix devient une découverte, pas un examen.
  Conséquence technique : `src/lib/spaceDraft.ts` ne porte plus que les rôles
  (`SpaceDraft`, `EMPTY_DRAFT` et `STEPS` supprimés, `SpaceBuilder` retiré) ;
  l'accueil n'a plus de formulaire — un bouton, « Créer ma carte ».
- **La carte est un grand visuel.** Recto : le visuel de l'univers (ou la photo
  de la personne) plein cadre, puis le nom, le rôle, la ville et le métier
  par-dessus — la grammaire des cartes de prestataires du site. Verso : les
  sections du rôle (`cardSections`), un IBAN toujours masqué, des pièces jamais
  publiques. Une seule carte par personne, jamais deux.
- **Les écrans de téléphone parlent la langue du site.** La capsule blanche du
  site en haut, le hero plein cadre, les cartes au matériau du thème, l'accent de
  l'univers — jamais une couleur qui ne vienne de lui. `PhoneShell` publie le
  thème (`src/components/phone/phoneTheme.ts`) et les modules le lisent : un
  écran ne ressemble pas à un autre.

## 10. Ce que « la carte d'abord » a tranché

- **L'univers vierge existe.** Personne n'est obligé de choisir un univers : le
  socle `Sans univers` (`BLANK_STYLE_ID` dans `src/lib/weddingStyles.ts`) porte
  les sections classiques, un visuel floral sans personne (`bouquet.jpg`),
  aucune mission de métier. Il vit dans `ALL_STYLES`, à côté des vingt-quatre
  univers — et il est le point de départ d'une carte neuve (`EMPTY_CARD`).
- **La carte passe avant le site.** Sous le hero, l'accueil montre la carte —
  pas un téléphone : « Votre nom », « Votre ville », l'univers vierge en grand
  visuel — et son bouton mène à `/creer`. Le hero, lui, dit « Découvrir ».
- **Le mini-site se découvre sous l'éditeur.** Un défilé de téléphones
  (`MiniSiteRail`) ouvre le **vrai** aperçu du mini-site d'un univers — le même
  que celui de l'éditeur, monté à la largeur d'un téléphone et réduit dans le
  châssis — avec le visuel plein écran et le titre de l'univers en grand
  (`/apercu?style=…&titre=…&sans=…`). Trois téléphones passent de l'autre côté
  du comptoir : l'écran prestataire. Les cartes de prestataires suivent, dans la
  section « Harmonies & Affinités ».
- **Ce que la carte dit, le mini-site l'écrit.** Le parcours est carte → mini-site :
  les informations composées sur la carte sont celles que le site affiche, on ne
  les demande pas deux fois.

## 11. L'éditeur des métiers

- **Un éditeur par métier, pas un par prestataire.** `/prestataire?role=…&style=…`
  monte le même éditeur que celui des mariés
  (`src/components/VendorSiteStudio.tsx`, page `src/pages/VendorStudio.tsx`) :
  l'aperçu en vrai dans le châssis du téléphone, les champs de l'autre côté.
  Le hero ne bouge pas — c'est le visuel de l'univers — ce sont les modules qui
  changent de langue.
- **La langue du métier vit dans un seul fichier.** `src/lib/vendorModules.ts`
  écrit les modules des douze domaines (`PAR_DOMAINE`) : un chef lit « Ce qui
  passe en cuisine », un photographe « La lumière et les lieux », un fleuriste
  « Ce qui pousse dans cet univers ». Le domaine vient de `domaineDe()` — le
  même découpage que le menu Métiers de l'accueil. Le premier module est toujours
  la fiche mission de la carte (`moduleMission`), donc ce que le prestataire a
  lu sur sa carte, il le retrouve dans sa page.
- **Intermittent du Spectacle.** `estIntermittent(role)` reconnaît les artistes
  et les techniciens du spectacle (musiciens, DJ, régie, lumière, son — plus
  quelques mots-métiers). Pour eux, un module de plus (`moduleCachets`) et un
  volet privé dans l'éditeur : cachets prévus, heures par cachet, GUSO, SACEM /
  SPRE, défraiement, et le compteur des 507 heures (`src/lib/vendorDraft.ts`).
  Rien de tout cela ne part sur le site public, ni dans le bucket média.
- **Les deux éditeurs sont branchés l'un sur l'autre.** Ce que le prestataire ne
  ressaisit jamais — le programme, les régimes, les accès, les chiffres, le
  décor — s'affiche chez lui comme « Ce qui vient des mariés »
  (`partageAvecLesMaries`), lu dans le même `contentFor` / `getScenesForStyle`
  que le site. Côté mariés, l'espace d'édition ouvre l'éditeur de chacun de leurs
  métiers (`src/components/VendorBridges.tsx`), et l'accueil les présente par
  domaine (`src/components/VendorEditorsShowcase.tsx`, ancre `#metiers`).
- **Le brouillon reste sur l'appareil.** `vows:vendor-draft:<role>` dans le
  navigateur, comme le reste de la base locale : on écrit, on recharge, on
  retrouve ses textes. Publier un site de prestataire est une étape à part,
  encore à écrire.

## 12. SuperMariage : les courses, et le ticket

- **Une page, `/supermarriage`.** Le mini-site du Supermarché 22H avait son ticket
  de caisse ; SuperMariage en fait un magasin : on coche des horaires, on prend
  des métiers, on ajoute des petits prix, on choisit un menu — et on passe à la
  caisse. Le ticket, en face, se calcule en direct.
- **Le catalogue est dérivé, jamais inventé.** `src/lib/superMariage.ts` monte
  ses rayons sur ce qui existe déjà : les horaires viennent du programme de
  `THEME_CONFIGS.supermarche`, les métiers de `metiersParDomaine()` (les rôles du
  Supermarché 22H sont servis en premier, marqués « Promo rayon 7 »), les trois
  menus des `packages` du thème, et les quantités par personne du nombre de
  convives du contenu. Seuls les prix sont indicatifs.
- **La caisse calcule pour de vrai** — sous-total, carte de fidélité (-10 % dès
  qu'un menu est pris), TVA 20 % **incluse** (montrée, jamais ajoutée), total,
  nombre de lignes. `totalCaisse()` et `numeroDeTicket()` sont pures : le numéro
  du ticket ne dépend pas de l'ordre des coches, et le code-barres se lit dans ce
  numéro — donc rien ne change d'un rendu à l'autre.
- **Le ticket est le composant** (`src/components/TicketCaisse.tsx`) : papier
  thermique, article principal (le couple), une ligne par article coché avec sa
  quantité, le tampon « Payé » après la caisse, et la mention « Tarifs
  indicatifs — aucun paiement réel ». Rien n'est facturé, rien n'est réservé.
- **Une fois payé, le ticket devient un plan** : les coches renvoient au
  programme, aux métiers et aux formules — d'où les portes vers `/creer`,
  l'aperçu du Supermarché 22H et l'éditeur des métiers. Le bandeau de l'accueil
  (`src/components/SuperMariageTeaser.tsx`, ancre `#supermarriage`) et le pied de
  page y mènent.

## 13. Les signatures d'univers

- **Chaque univers a un geste que les autres n'ont pas.** Le Supermarché 22H a
  son ticket de caisse — sa page entière ; les vingt-trois autres ont désormais
  leur signature (`src/lib/themeSignatures.ts`) : Las Vegas sa chapelle rose et
  ses néons, la laverie son hublot qui tourne, New York son plan de ligne, le
  traditionnel son faire-part, le brutal son plan d'architecte, le phare ses
  marées. L'univers vierge n'en a aucune : c'est exactement sa promesse.
- **Huit gestes, vingt-trois univers.** Les gestes sont des mises en page
  (`src/components/themes/ThemeSignature.tsx`) : enseigne, affiche, faire-part,
  étiquettes, ligne, plan, hublot, marée. Ce qui change d'un univers à l'autre,
  ce sont les mots — horaires, lieu, tenue — tirés des scènes et du contenu.
- **La signature repeint le mini-site.** `signatureStyle()` pose le fond et
  l'encre du geste, et remplace `--vp-accent` : les boutons, les sur-titres et
  le module prennent la couleur du lieu. Quand la signature est un néon
  (`lueur`), les titres s'allument (`.vp-sg-lueur`). Le module se pose juste
  après le hero, dans le flux des sections.
- **Le défilé montre les gestes.** La bande d'iPhones (accueil jusqu'à la passe
  20, désormais dans `/le-mariage`) ouvre les univers les plus reconnaissables
  et nomme le geste sous chaque écran. Les aperçus se montent
  avec `entete=0` : la capsule de navigation du site disparaît, parce que la
  Dynamic Island occupe déjà le haut du châssis (`hideHeader` dans
  `PublicSiteView` et `sections/Hero.tsx`).
- **Les écrans des métiers suivent l'univers.** `VendorPhoneScreen` reçoit la
  signature : l'accent du téléphone devient celui du geste, l'étiquette du hero
  dit où l'on travaille, et un onglet « L'univers » rappelle le lieu — c'est ce
  qui manquait aux écrans prestataires pour représenter leur univers.
- **Ce qui a été allégé.** Le hero de l'accueil ne porte plus qu'un bouton ; la
  section « Votre carte » tient en une phrase et un bouton ; les cartes des
  métiers de l'accueil sont devenues des visuels avec le titre par-dessus ; la
  carte (recto) est un visuel plein cadre avec le nom et le rôle, et la page
  prestataire a perdu son jargon (« Onglet · », « Titre au-dessus », « Phrase du
  bas »). Le pied de page garde les trois portes : carte, espace prestataire,
  SuperMariage.

## 14. Alléger l'accueil, rassembler le mariage sur une page (passe 20)

- **Deux bandes en moins sur l'accueil.** La bande d'iPhones (`MiniSiteRail`) et
  la bande des éditeurs prestataire (`VendorEditorsShowcase`, fichier supprimé)
  quittent `/`. L'accueil va désormais : hero → la carte → le mini-site complet →
  le Supermarché 22H → les métiers (`ComplementaryThemes`) → « Zéro contrainte »
  → la playlist. Les étapes `metiers` et `direction` disparaissent de
  `BottomCapsuleNav`, qui ne pointe plus que vers des ancres existantes.
- **Harmonies & Affinités, en une bande.** La section devient **une seule ligne**
  de cartes de prestataires qui **défile lentement** toute seule
  (`requestAnimationFrame`, 0,4 px/image, boucle en fin de bande, pause au
  survol et au toucher, bouton pause/reprise, respect de
  `prefers-reduced-motion`). Le portrait animé, la pastille live, la localisation
  et « Revendiquer » sont conservés.
- **La playlist ne s'embarque plus dans Spotify.** `DjPlaylistStudio` perd
  l'iframe et l'état `activeSpotifyTrack` : le bouton lit le **vrai extrait**
  (`previewUrl`, fichiers de `public/audio/`), affiche une barre de progression
  réelle, coupe le morceau précédent et s'arrête au démontage. L'original reste
  joignable par un simple lien `open.spotify.com/track/<id>` — un lien, jamais
  un cadre.
- **`/le-mariage` — le mariage, en entier.** Une seule page verticale, très
  espacée, montée sur l'univers **Supermarché 22H** (celui qui porte le ticket) :
  1. le hero — univers, noms, date, lieu, invités, trois portes (article,
     playlist, récap) ;
  2. **l'article de magazine** — manchette, lettrine, chapô, photo légendée,
     encadré « En bref », colonne latérale « L'univers choisi » et « Les univers
     voisins » (liens vers `/apercu?style=…`) ; le texte vient de
     `THEME_CONFIGS[id].editorial` et de `contentFor(style)` — rien n'est inventé ;
  3. **le programme** — les scènes de `getScenesForStyle`, chaque moment avec sa
     carte musicale réelle (`trackForText` + `MusicCard`) ;
  4. **la playlist collaborative** — champ de recherche + catalogue
     (`src/lib/weddingPlaylist.ts`) : ajout/retrait, playlist en cartes musicales
     de la même forme que partout ailleurs, répartition par moment, persistance
     dans `localStorage` (`vows:playlist`), lien Spotify sur les extraits ;
  5. **les métiers** — `ComplementaryThemes`, la bande qui défile ;
  6. **le récap** — la checklist de `superMariage.ts` (rayons cochables + menu)
     et le ticket de caisse qui se recalcule, « Valider » pour le tampon PAYÉ ;
  7. **les autres univers** — `MiniSiteRail`, le vrai site écran par écran.
- **`MusicCard` accepte les morceaux sans extrait.** Un morceau du catalogue sans
  fichier local (`src` vide) ne ment pas : la carte affiche « Suggéré » au lieu
  d'un bouton de lecture. Le catalogue sépare donc les **extraits réels**
  (`GLOBAL_WEDDING_PLAYLIST_FULL`, 11 morceaux) des **suggestions** (20 titres de
  mariage, sans audio libre), et la recherche (`chercherMorceaux`) cherche dans
  le titre, l'artiste, le moment et l'humeur, sans accent ni casse.
- **Contrôles.** `npx tsc -b` 0, eslint 0 sur les fichiers touchés, `npm test`
  143 / 55 / 135 (les checks de l'accueil portent désormais « la bande d'iPhones
  a quitté l'accueil », « la bande des éditeurs a quitté l'accueil » et
  « la playlist n'embarque plus le lecteur Spotify »), `npm run build` OK.

## 15. Une page entière par univers (passe 21)

Le concept change de camp : la page n'est plus un mini-site à admirer, c'est
**l'espace de travail partagé du mariage**. On ouvre une page déjà prête, on
coche, on ajoute, on partage — et les invités font leurs courses.

- **La bande d'iPhones horizontale a quitté `/le-mariage`.** À sa place,
  `UniversPagesGrid` : les vingt-cinq pages en cartes (image, nom, geste de
  l'univers, « dès X € », « Vous êtes ici »), chacune menant à sa page.
  `MiniSiteRail.tsx` est supprimé : le vrai mini-site reste accessible depuis le
  pied de chaque page (`/apercu?style=…`).
- **Un seul moteur, vingt-cinq pages.** `src/pages/PageUnivers.tsx` monte la page
  complète à partir de `styleId` (hero, article, programme, playlist, métiers,
  récap en ticket, autres univers). `/le-mariage` ouvre le Supermarché 22H ;
  `/le-mariage/<univers>` ouvre exactement la même page pour n'importe lequel des
  vingt-quatre autres.
- **`src/lib/weddingPage.ts` : le magasin de chaque univers.** Tout y dérive du
  contenu de l'univers, rien n'est inventé :
  - **l'enseigne** — nom, slogan, rayon, caisse, ville ; le Supermarché 22H garde
    son enseigne d'origine (`MAGASIN`), chaque autre univers la sienne, et le
    préfixe du ticket vient de son identifiant (`SUP`, `LAS`, `COR`…) ;
  - **trois registres** — `magasin` (on fait ses courses), `table` (on passe à
    table), `billet` (on prend un billet), assignés univers par univers ; ils
    changent le papier, la typographie, les petits suppléments et le titre du
    récap (« Les invités font leurs courses / dressent la table / prennent leurs
    billets ») ;
  - **quatre rayons** — Horaires (les moments du jour J), Métiers (les trois
    métiers de l'univers, tarifés par domaine), Table (le service et les plats
    du menu), Petits prix (sept suppléments selon le registre) ;
  - **trois formules** — un menu complet, un plus, un grand, composés avec les
    plats de l'univers. **Elles sont offertes** : la formule choisie ouvre la
    carte de fidélité, la remise passe donc à 0 € et le ticket l'affiche.
  - Un univers vierge n'a aucun métier : son rayon Métiers emprunte ceux de son
    premier univers voisin, et le rayon le dit.
- **Tout est paramétrable côté caisse.** `totalCaisse`, `lignesDuTicket`,
  `articlesDuPanier`, `sousTotal` et `numeroDeTicket` reçoivent le catalogue et
  les formules (`articles`, `packages`, `prefixe`) ; `TicketCaisse` reçoit son
  `magasin` et son `couple` — l'enseigne, la ville, la caisse, les convives. Le
  Supermarché 22H, lui, continue de passer `MAGASIN` et `TICKET_COUPLE`.
- **Collaboratif, explicitement.** Le hero porte un bouton « Envoyer aux
  invités » (copie du lien), le récap dit que chacun coche ce qu'il offre, et la
  playlist se souvient **univers par univers** (`vows:playlist:<univers>`).
- **Contrôles.** `npx tsc -b` 0, eslint 0 sur les fichiers touchés, `npm test`
  143 / 55 / **156** — la sonde du moteur vérifie les 25 magasins (rayons pleins,
  trois formules, panier de départ, ticket non vide, préfixes uniques, registres,
  univers vierge) et le rendu réel d'une page non-supermarché (Las Vegas) — ,
  `npm run build` OK.

## 16. Le terminal : l'invité prend, le couple reçoit, le DJ récupère (passe 22)

La page entière était un espace de travail ; elle devient un **comptoir**. Le
ticket n'est plus un récapitulatif, c'est la monnaie du mariage : chacun y prend
sa part, repart avec son reçu, et le DJ emporte la playlist.

- **`src/lib/weddingTicket.ts` : le terminal.** Trois objets, aucune horloge —
  l'ordre d'arrivée (`rang`) suffit :
  - la **prise** : « cet article, c'est moi qui l'offre ». Un article = un
    invité : le premier arrivé le garde (`prendre`, `lacher`, `preneurDe`,
    `prisesParInvite`, `articlesLibres`, `avancement`) ;
  - la **demande** : un morceau du catalogue ou un titre proposé
    (`demander`, `retirerDemande`, `demandeursDe`) — plusieurs invités peuvent
    demander le même, c'est le meilleur signe ;
  - le **reçu** : tout l'invité tient dans un code (`encoderRecu`,
    `decoderRecu` — base64url du nom, des lignes, des morceaux, des titres).
    `entrerRecu` pose le reçu sur le terminal : les lignes non prises passent au
    nom de l'invité, le reçu entre au journal, et **rouvrir le lien ne compte
    jamais double** (idempotent par code). Un morceau importé reprend son titre,
    son artiste et son moment depuis le catalogue — jamais un identifiant.
- **`planDj(morceaux, demandes)`** rend le ticket du DJ : les blocs suivent
  `DJ_CHRONOLOGICAL_PHASES`, le socle du couple d'abord, les demandes ensuite,
  chaque ligne portant qui l'a demandée (`demandeurs`). Les blocs vides ne
  s'impriment pas.
- **`TicketCaisse` a trois variantes** — `couple` (inchangée), `invite` (le reçu,
  tampon « Réservé · merci »), `dj` (le terminal, tampon « Prêt pour la piste »,
  résumé en morceaux au lieu de l'argent). Même papier, même code-barres, même
  imprimante.
- **Le récap a deux points de vue** (`RecapCourses`) : **côté invités** — la
  carte de fidélité nomme l'invité, chaque ligne a « Je prends », et le reçu
  s'imprime à droite avec WhatsApp / e-mail / copie du lien ; **côté mariés** —
  le comptoir (prises par invité, lignes libres, journal des reçus), le QR à
  scanner, le ticket du couple et le terminal DJ.
- **La playlist a deux gestes** (`PlaylistCollaborative`) : **Ajouter** (la
  playlist du mariage) et **Demander** (le ticket du DJ), plus **Proposer un
  titre** avec son moment — il monte sur le ticket comme les autres.
- **Le lien du reçu** : `/le-mariage/<univers>?recu=<code>` pose le reçu au
  terminal pendant le rendu (pas dans un effet), et `vows:terminal:<univers>`
  garde l'état du comptoir sur l'appareil.
- **Contrôles.** `npx tsc -b` 0, eslint 0 sur les fichiers touchés, `npm test`
  143 / 55 / **189** — la boucle complète est testée en pur (prise, conflit,
  lâcher, reçu encodé/décodé, import idempotent, plan du DJ, deux invités sur le
  même morceau) et le récap est rendu dans les deux vues — `npm run build` OK.
