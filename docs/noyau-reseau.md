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

## 17. Le comptoir partagé (passe 23)

Les invités prenaient leurs lignes, mais il fallait leur envoyer le reçu pour que
les mariés le voient. Maintenant la page des mariés **se remplit toute seule**.

- **Une table, une route.** `public.wedding_live` (`style_id` en clé primaire,
  `payload` jsonb, `updated_at`) et `api/wedding-live.js` :
  `GET ?style_id=…` lit le comptoir, `POST { style_id, geste }` applique un geste
  d'invité, `PUT { style_id, payload }` remet à zéro (les mariés). RLS reste
  fermée : le navigateur ne parle qu'à `/api/*`.
- **Cinq gestes, pas un de plus.** `prendre`, `lacher`, `demander`,
  `retirerDemande`, `journaliser` — les règles vivent dans `server/live.js`, qui
  refuse tout ce qui n'est pas l'un de ces cinq : pas de reprise d'une ligne
  prise, pas de lâcher celle d'un autre, pas de doublon de reçu (idempotent par
  code). Un geste qui ne change rien n'écrit pas en base : la réponse le dit
  (`applique: false`).
- **La même règle dans le navigateur.** `src/lib/liveRules.ts` applique les
  gestes côté front — pour répondre tout de suite (affichage optimiste) et pour
  le **mode sans base** : `localApi.ts` sert `/api/wedding-live` avec les mêmes
  règles, sur `localStorage`. Aucune ligne d'écran ne sait laquelle des deux
  chemins elle emprunte.
- **`useComptoir` (`src/lib/terminalLive.ts`)** : lecture au montage, relecture
  toutes les quinze secondes et à chaque retour sur l'onglet, file d'attente des
  gestes si le réseau tombe, et un indicateur en haut de page — « En direct · 3
  invités au comptoir », « Sur cet appareil » sans base. Le bouton « Rafraîchir »
  et « Vider le comptoir » sont dans la vue des mariés.
- **Le reçu reste possible.** `?recu=…` entre dans la file comme les autres
  gestes : le lien d'un invité dépose son reçu au comptoir, où qu'il soit.
- **Contrôles.** `npx tsc -b` 0, eslint 0, `npm test` **173** / 55 / **210**
  (la route testée dans `tests/api.test.mjs` : prise, conflit, lâcher d'autrui,
  demande et doublon, reçu idempotent, cloisons entre univers, remise à zéro ; la
  route locale et les gestes testés côté interface), `npm run build` OK.

## 18. Une page entière par métier (passe 23, lot D)

Le DJ avait déjà son studio (`/prestataire?role=…&style=…`) : c'est l'éditeur
que les mariés connaissent, monté pour un métier dans un univers. Sa **page**,
c'est autre chose — c'est ce qu'il montre, lui, et à quoi son travail est relié.

- **Une page par métier, pas par univers.** `src/lib/metierPage.ts` :
  `tousLesMetiers()` (72 métiers, 10 domaines), `slugDeRole()` transforme un
  intitulé en adresse (`DJ Résident Clubbing / Sound Engineer` →
  `dj-resident-clubbing-sound-engineer`), `metierParSlug()` rend une `PageMetier`
  mémoïsée — ou `null` si l'adresse ne correspond à rien. La route est
  `/metiers/:slug`, dans `src/App.tsx`.
- **Ce que porte la page** (`src/pages/PageMetier.tsx`) : le grand visuel de
  l'univers du métier et sa signature, quatre informations (domaine, univers,
  prix de sa ligne, nombre d'univers où il exerce), le lien à copier, puis :
  « Venu des mariés » (ce qu'il reçoit, sans le ressaisir), le récit magazine de
  l'univers, ses moments du jour J et sa mission, « Sa langue » (ses modules :
  onglets, gestes, outils), son ticket, et les métiers d'à côté.
- **Le métier lit un rayon du magasin.** `RAYON_PAR_DOMAINE` range chaque
  domaine dans un rayon de l'univers (cuisine/bar → la table, musique et
  cérémonie → les moments, image et décor → la sélection) ; ses « lignes » sont
  celles du rayon, donc le métier voit exactement ce qui se vend sur le ticket
  du mariage, au même prix.
- **La musique se retrouve au même endroit.** Les métiers des domaines `dj` et
  `musicien` (un « Acousticien » en fait partie : c'est le domaine qui tranche,
  pas l'intitulé) portent en plus la section playlist : ce que les invités ont
  demandé au comptoir, le terminal DJ et l'ordre de la soirée par moments
  (`planDj`), dans le même `TicketCaisse` variante `dj`.
- **Le ticket du métier.** `TicketCaisse` accepte une variante `'metier'` et un
  `sousTitre` : en-tête « Bon de commande », « Vos lignes sur le ticket », tampon
  « Confirmé par le couple », pied « Édité depuis la page du mariage · rien à
  ressaisir ».
- **Tout est relié.** Le récap du mariage mène à la page de chaque métier engagé
  (bouton « Sa page » sur les lignes `metier-*` de `RecapCourses`), le menu des
  métiers de l'accueil ouvre sa page, et l'espace prestataire aussi (« La page
  entière de ce métier »). Depuis une page de métier, on revient au mariage
  (`/le-mariage/:styleId`) et on parcourt les métiers voisins — même univers
  d'abord, puis même domaine, douze au plus.
- **Adresse inconnue.** `/metiers/pas-un-metier` reste une page : elle le dit et
  renvoie vers la page du mariage, jamais un écran blanc.
- **Contrôles.** `npx tsc -b` 0, eslint 0, `npm test` **173** / 55 / **243**
  (72 métiers tous pourvus, adresses uniques, page du DJ : domaine, univers,
  terminal, ordre de la soirée, comptoir des invités ; page du chef sans
  playlist mais avec ses lignes du rayon Table ; adresse inconnue), `npm run
  build` OK.

## 19. Un header, un dock, un dos de carte lisible, un billet, une postale (passe 24)

Cinq demandes, une même idée : la navigation est la même partout, et le papier
du mariage se garde.

- **Le header sert de nav, et le dock suit.** `src/components/SiteHeader.tsx`
  reprend la barre de l'accueil — VOWS, Univers, Métiers, Shop, Magazine — et
  `src/components/SiteChrome.tsx` l'affiche sur les grandes pages (accueil,
  univers, métiers, magazine, shop, prestataire, SuperMariage) avec une mention
  selon la page (« Magazine », « Les métiers », « Le mariage »…). Les pages
  intimes gardent la leur ou n'en ont pas besoin : le site des mariés (`/p/…`),
  l'invitation, l'espace des personnes, les éditeurs, l'onboarding, la carte,
  le théâtre. Les heroes se libèrent donc des rappels de navigation : les liens
  « ← VOWS » et les barres locales ont disparu des pages d'univers et de métier,
  et Magazine / Shop / Article n'ont plus leur nav à elles.
- **Le dock navigue vraiment.** `BottomCapsuleNav` a maintenant deux façons de
  servir la même capsule : sur l'accueil, chaque étape fait défiler jusqu'à sa
  section et s'allume au passage ; ailleurs, la même étape mène à la page qui la
  porte (`/carte`, `/le-mariage`, ou l'ancre de l'accueil) et s'allume selon
  l'URL. Un seul dock, appris une fois.
- **La typo du site, partout.** Les pages d'univers et de métier se donnaient
  une serif d'emprunt (Georgia) : elles prennent les classes du site
  (`vp-title`), la même typographie que l'accueil et que les mini-sites. Les
  registres gardent leur papier — la table, le billet, le magasin — pas leur
  police.
- **Le dos de la carte est un ticket.** `WeddingCard` gardait un verso noir.
  Il est désormais en papier clair `#FFFEF7`, en encre, avec l'en-tête « Carte de
  fidélité · invité / prestataire / couple », les intertitres en mono, les
  séparateurs en pointillés, les mêmes informations (place, contact, créneaux,
  repas, mobilité, prestation, IBAN, musique), le tampon de confidentialité et
  un **code-barres** : `VOWS-CLA-INV-MRS`, calculé depuis le nom, le rôle et
  l'accès. Le recto ne bouge pas.
- **Le RSVP délivre un billet.** `src/components/RsvpTicket.tsx` : la réponse
  donne un billet nominatif, dans le registre de l'univers (`magasinFor` →
  billet, table, panier) — bandeau à la couleur de l'univers, nom en grand,
  convives, place (rang et numéro pour le billet), régimes, allergies, moments
  cochés, le mot laissé, le tampon « Réponse enregistrée », le code-barres et le
  pied « les mariés reçoivent la même liste ». Le papier dentelé est celui des
  tickets de caisse : c'est la monnaie du mariage.
- **L'invitation est une carte postale.** `src/components/CartePostale.tsx`,
  posée en tête de `/rejoindre/:slug` : au recto le visuel de l'univers, la
  mention « Carte postale · {univers} », les noms, la date et le lieu ; au verso,
  séparés par un pli pointillé, **le mot des mariés** à gauche, l'adresse, **les
  deux timbres** — celui du marié et celui de la mariée, chacun avec sa photo,
  son nom et la date courte — et le **sceau rond du site** par-dessus : noms,
  date et lieu écrits au cercle (`textPath` avec `textLength`), à la couleur de
  l'univers. La carte se retourne au clic, au clavier, et un bouton le dit.
  En dessous, le flux « qui êtes-vous / comment vous appelle-t-on » ne change
  pas.
- **Contrôles.** `npx tsc -b` 0, eslint 0 sur tout ce qui a bougé, `npm test`
  173 / 55 / **270** (header et mention sur une page de métier, aucun chrome sur
  le site des mariés, pas de double barre sur l'accueil, plus aucune serif
  d'emprunt sur les pages d'univers et de métier, dos de carte en papier clair
  avec son code-barres, billet nominatif du cinéma contre carte de table corse,
  postale avec le mot, les deux timbres et le sceau), `npm run build` OK.

## 20. La playlist en cartes, la page d'une personne, les métiers reliés (passe 25)

Trois volets, une même suite : ce qui était une liste devient une carte, la
carte devient une page, et les pages se répondent.

- **Les playlists prennent le papier des cartes musicales.** `MusicCard` s'ouvre
  (`sousTitre`, `pastille`, `actions`) : la carte non compacte est une pochette
  (visuel, titre, artiste, durée) posée sur un feuillet `p-2.5`, avec sa rangée
  et, sous un pointillé, son bloc d'actions. Le catalogue de
  `PlaylistCollaborative` devient une grille `sm:grid-cols-2` — « Demander »
  (qui envoie sur le ticket du DJ) et « Ajouter » (au socle du couple), la
  pastille « demandé N fois » en `ml-auto` —, les demandes déjà posées passent en
  cartes compactes avec la pastille « Proposé », et la page d'un métier de
  musique affiche les demandes des invités dans exactement le même papier
  (« Demandé par Camille »). Le socle du couple, la recherche et les phases ne
  changent pas : c'est la forme qui s'aligne, pas la règle.
- **Le réseau social commence par une page, celle de la personne.** La carte
  faite avec le formulaire ne reste pas un formulaire : elle a une adresse —
  `/profil/{id}-{nom}` (`src/lib/profil.ts` : `slugDePersonne`, `idDeProfil`,
  `chargerProfil`). Côté serveur, `publicMembershipsOf(personId)` ajoute à la
  carte lue seule la liste de ses mariages **publiés** (jamais les brouillons),
  et `GET /api/people?id=…` répond `{ person, memberships }` — même règle en
  local. `PageProfil` rend la page entière : couverture = le visuel de l'univers,
  **son timbre en photo de profil** (`Timbre`, extrait de la carte postale avec
  `Sceau`), le nom, le rôle, la ville, le mot du métier, l'univers (lien vers
  `/le-mariage/{style}`), les modules de son métier, ses mariages publiés, ses
  liens, et sa carte en `WeddingCard` masquée — adresse qui porte son numéro et
  son nom, donc partageable et citable.
- **Le timbre est la photo de profil.** `src/components/Timbre.tsx` : photo (ou
  initiales), label « Son timbre · Clara », nom, date courte, dentelure en
  pointillés, mention « VOWS · POSTE 22H », inclinaison et accent — posé à
  `-mt-14` sur la couverture de la page. `CartePostale` l'importe désormais au
  lieu de le porter : une seule définition, deux usages.
- **Après la création, la page apparaît.** L'invitation (`/rejoindre/:slug`)
  propose « Voir ma page » dès que la carte est créée, `CardStudio` l'offre à
  côté de la clé (« votre carte est publiée : elle a une clé, une page »), et la
  liste des personnes du mariage mène à la page de chacune (« La page de
  Claire »). C'est la carte universelle : faite une fois, elle sert de carte de
  visite, de billet et de page.
- **Les métiers se relient.** Tous les métiers du catalogue ont leur page (§18)
  et tout y mène : le menu des métiers d'un univers, la ligne d'un métier sur le
  récapitulatif de la page des mariés (« Sa page »), le pied de l'espace
  prestataire, et les métiers voisins en bas de page (`metiersVoisins`). Un
  métier de musique y retrouve ses demandes, un DJ son terminal.
- **Une carte porte son univers.** `cardDetail` / `withDetail` (`weddingCard`)
  gardent désormais `styleId`, `roleId` et `access` : la carte publiée dit de
  quel mariage et de quel rôle elle parle, sans quoi une page de profil ne
  saurait pas quel univers montrer.
- **Contrôles.** `npx tsc -b` 0, eslint 0 sur tout ce qui a bougé, `npm test`
  173 / 55 / **303** (cartes musicales dans la playlist et sur la page du DJ,
  tous les métiers ont une page entière, le fleuriste n'a pas de playlist, le
  comptoir du DJ reçoit la demande de l'invité, une adresse de profil se
  fabrique et se relit — accent, numéro, nom inconnu —, la page ne montre que
  les mariages publiés, le timbre annonce son propriétaire ou ses initiales),
  `npm run build` OK.

## 21. Le contenant éditorial, sur toutes les pages (passe 26)

La mise en page d'un article de magazine — une colonne centrée, une marge de
chaque côté — devient celle du site entier : c'est elle qui fait une page
propre et structurée, quelle que soit la page.

- **Deux classes, une seule règle.** `src/index.css` :
  `.vp-page` — largeur 100 %, `max-width: 1180px`, `margin-inline: auto`,
  gouttières `1.25rem` puis `2rem` à partir de 640 px ; et `.vp-page-read` —
  la même chose à `820px`, la largeur de lecture d'un article. Le fond et les
  visuels restent plein cadre : ce sont les textes et les blocs qui prennent
  la marge, pas l'image.
- **Toutes les pages y passent.** Chaque page abandonne ses largeurs à elle
  (`max-w-6xl`, `max-w-[1180px]`, `max-w-[1080px]`, `max-w-[1100px]`,
  `max-w-[1240px]`) et son `px-5 sm:px-8` : le contenant est posé une fois, à
  l'endroit où commençait le contenu. Accueil (bande son, pied), univers,
  métier, profil, magazine, article, shop, fiche produit, SuperMariage, espace
  prestataire, invitation, personnes du mariage, atelier de la carte — plus les
  blocs de l'accueil qui portaient les leurs (cartes de l'accueil, défilé des
  écrans, éditeur, thèmes complémentaires, grille des univers, onglet du
  magasin, playlist, récap). L'article de magazine garde sa colonne de lecture
  (`vp-page vp-page-read`), les autres pages prennent la large.
- **La typographie suit.** Les sous-titres de sections qui se donnaient un
  `font-semibold tracking-[-0.02em]` à la main prennent `vp-h2`, comme les
  mini-sites : une seule échelle de titres. Le hero de l'espace prestataire
  passe à `vp-title` comme partout ailleurs.
- **Les hero se libèrent.** Plus de « ← VOWS » dans le hero du SuperMariage ni
  dans celui de l'espace prestataire : le header les porte. Le bandeau du
  SuperMariage se cale sous le header (`top-[68px]`), et le chrome annonce
  aussi la page d'une personne (« Une page du réseau »).
- **Contrôles.** `npx tsc -b` 0, eslint 0 sur tout ce qui a bougé, `npm test`
  173 / 55 / **309** (l'article garde sa colonne de lecture et son tableau de
  chiffres, les pages partagent le même contenant, aucune page ne recopie ses
  largeurs à la main, aucun contenant dans un contenant), `npm run build` OK.

## 22. Le dock noir, la bande du hero, un header libéré (passe 27)

La navigation se resserre encore : ce qui était un menu déroulant devient une
bande qu'on fait défiler, au même endroit sur toutes les pages, et le dock prend
le noir du site.

- **Le dock passe en noir, pictos en blanc.** `BottomCapsuleNav` : la capsule est
  `bg-[#0B0C12]/95` avec un liseré blanc à 12 %, les pictos sont blancs
  (`text-white/60`, blanc franc au survol), l'étape courante s'inverse — pastille
  blanche, picto noir — et l'infobulle devient blanche sur texte noir. Même
  forme, même place, même comportement : seul le papier change.
- **Le header se libère du menu déroulant des univers.**
  `UnifiedUniverseMenu` disparaît du header (il reste au théâtre, qui en a
  besoin) : la barre ne garde que VOWS, les Métiers, le Shop et le Magazine, et
  elle ne change plus de rôle selon la page. Le menu Métiers sait naviguer seul
  (`onSelectStyle` devient facultatif : sans lui, il ouvre
  `/le-mariage/<univers>`).
- **La bande du hero.** `src/components/BandeauHero.tsx` : une bande
  horizontale de cartes, toujours en bas du hero, sur la page qui les montre.
  Chaque carte porte son visuel (ou son registre), son accent, et la mention
  « Ici » quand c'est celle de la page. Elle ne pose aucun contenant : la page
  l'installe dans le sien. `HeroCycle` reçoit une place pour elle (`bas`) et
  laisse la hauteur nécessaire (`pb-44`).
- **Les univers.** Sur l'accueil, la bande remplace le menu déroulant : les
  vingt-quatre univers en cartes — dont « Vue d'ensemble », qui revient au site
  entier — changent l'univers montré dans le hero d'un seul geste. Sur la page
  d'un univers, la même bande (`Passer d'un univers à l'autre`, les vingt-cinq,
  univers vierge compris) mène à la page de l'univers voisin. Le hero se cale
  sur l'univers choisi sans effet de synchronisation : l'index se déduit du
  choix.
- **Les métiers.** Sur la page d'un métier, la même bande liste les métiers
  d'à côté (`metiersVoisins`) : ceux de son univers d'abord, puis ceux du même
  domaine ailleurs — chaque carte annonce son domaine, porte l'accent de
  l'univers où l'on arriverait, et mène à `/metiers/<slug>`. On change de métier
  sans remonter la page.
- **Contrôles.** `npx tsc -b` 0, eslint 0 sur tout ce qui a bougé (et `HeroCycle`
  nettoyé de son effet de synchronisation), `npm test` 173 / 55 / **325** (dock
  noir et pictos blancs, header sans bouton Univers, bande des univers sur
  l'accueil et sur la page d'un univers avec l'univers courant marqué, bande des
  métiers sur la page d'un métier), `npm run build` OK.

## 23. La bande à la charte du site, le hero partout, découvrir par l'article (passe 28)

La bascule se fait en douceur : la même bande, la même hauteur, et « Découvrir »
qui mène enfin là où l'on découvre.

- **La bande prend la charte du site.** `BandeauHero` abandonne les petites
  vignettes pour les cartes du magazine : visuel en 16/10, **badge blanc** en
  haut à gauche (le badge d'un univers, `badgeDUnivers(styleId)` — « Urbain »,
  « Sauvage & Éphémère »…), **nom en majuscules** sous la carte, pastille
  d'accent, et la mention « Ici » sur l'élément courant. 248 px de large, 288 px
  à partir de 640 px : la même taille qu'ouvrait le menu du header. Quand il n'y
  a pas de visuel (les métiers), la carte garde le même gabarit 16/10.
- **Choisir un univers change le hero, sans les badges.** Sur l'accueil, un clic
  sur une carte montre le titre et le chapô de cet univers — le titre qui existe
  déjà dans son contenu — et rien d'autre : les pastilles Lieu, Invités et
  Programme ont disparu. « Découvrir » reste là, comme sur la première vue.
- **« Découvrir » mène à l'article.** Changement de paradigme : on ne descend
  plus dans un écran, on va là où l'univers se raconte — son article de magazine
  (`articleDUnivers(styleId)`). Sans univers choisi, c'est le magazine entier.
- **Les téléphones s'en vont.** `UniversePhoneScreens` disparaît de l'accueil :
  sous le hero il ne reste que la carte, et un univers se découvre dans son
  article.
- **Un seul hero, partout.** La même hauteur que l'accueil (`min-h-[100svh]`)
  sur la page d'un univers, d'un métier, d'un article, d'une personne, du
  magazine, du shop, d'une fiche produit, de l'espace prestataire et du
  magasin : ça respire, et le contenu respire avec. La bande du hero se pose au
  bas de ce hero, toujours au même endroit.
- **Dans l'article, la bande change d'article.** La couverture d'un article
  porte la même bande d'univers (`Changer d'univers`, les vingt-quatre articles
  d'univers) : d'un clic on passe à l'article de l'univers voisin, l'article
  courant marqué « Ici ».
- **Contrôles.** `npx tsc -b` 0, eslint 0 sur tout ce qui a bougé, `npm test`
  173 / 55 / **343** (cartes à la charte : grandes, badge blanc, majuscules ;
  le hero d'un univers montre son titre et plus aucun badge Lieu / Invités /
  Programme, avec « Découvrir » ; plus de téléphones sur l'accueil ; toutes les
  pages en `min-h-[100svh]` ; la bande de l'article mène d'un article à
  l'autre), `npm run build` OK.

## 24. La carte vivante : multi-fonction, multi-couche, multi-page (passe 29)

La carte musicale n'était pas un composant : c'était le principe du site. Elle
devient la carte de tout le monde — et deux gestes lui suffisent.

- **Une carte, quatre couches.** `src/components/CarteVivante.tsx` : le visuel,
  le badge (une heure, un domaine, un mode, un prix), le nom et sa précision —
  puis **le play** (le média s'enclenche dans le hero) et **le cœur avec son
  nombre** (la température du public). Les cartes **grossissent au centre de la
  bande**, comme dans la section playlist : la mesure du défilement donne
  l'échelle (0.92 → 1.06) et la carte du milieu est la plus grande.
- **Les cœurs sont partagés.** Les avis entrent au comptoir (`wedding_live`) :
  `avis: Record<clé, nombre>` dans l'état, un geste `aimer` (avec son sens) côté
  navigateur (`liveRules`), côté serveur (`server/live.js`) et dans la version
  locale. Le nombre est public et additif ; jamais un nom, et jamais sous zéro.
  `src/lib/avis.ts` garde seulement « j'ai déjà aimé » sur l'appareil, et
  additionne mon cœur tout de suite pour que le chiffre bouge sous le doigt.
- **Le lecteur du hero.** `src/components/LecteurHero.tsx` : le média prend le
  cadre — plan animé (`hero-plan`, un lent mouvement sur le visuel) et **le
  morceau joue**, en boucle, pendant que la carte reste allumée dans sa bande.
  Si une carte porte une **vidéo** (`media.video`), c'est elle qui tourne, avec
  son son : le site n'a pas encore de rushes, et brancher la vidéo sur la carte
  suffit à l'allumer — le lecteur, lui, ne change pas.
- **La fabrique.** `src/lib/cartesVivantes.ts` construit les cartes depuis les
  sources du site : les univers (`cartesDesUnivers`, badge du magazine), **les
  moments du Jour J** (`cartesDesMoments` — l'heure sur la carte, le morceau du
  moment, le visuel de la scène), les produits du shop (`cartesDesProduits` —
  mode, prix, le moment où la pièce se voit), et les métiers
  (`cartesDesMetiers` / `cartesDesMetiersDuRole`). Rien n'est ressaisi.
- **Quatre pages, la même bande.** L'accueil (les univers : le clic choisit
  l'univers du hero, le play l'allume), la page d'un univers (les vingt-cinq
  univers), **l'article d'un univers (les moments du Jour J ; sur un guide, les
  univers, et l'on change d'article)**, le shop et la fiche produit (« Les
  pièces, en conditions », puis « Dans le même univers »), l'espace prestataire
  et la page d'un métier (les métiers, où le cœur vaut pour un **avis** et le
  play montre leur Jour J). Le shop compte ses avis sous la clé `boutique`,
  comme un univers à part entière.
- **Contrôles.** `npx tsc -b` 0, eslint 0 sur tout ce qui a bougé, `npm test`
  173 → **178** / 55 / 343 → **370** (le cœur s'ajoute, deux personnes font deux,
  un retrait redescend, jamais sous zéro, les univers ne se mélangent pas, un
  avis sans sujet ne change rien ; un univers, un moment, un produit et un
  métier donnent bien une carte vivante avec sa clé, son badge et son morceau ;
  le shop et la fiche portent la bande, l'espace prestataire aussi ; le lecteur
  prend le cadre, joue, et se ferme), `npm run build` OK.

## 25. La bande sort du hero : la carte de la playlist, sous le hero, sur blanc (passe 30)

La bande était trop chargée, et elle mangeait le hero. Elle devient exactement
ce qu'elle doit être : **la bande de la playlist, sous le hero, sur fond blanc.**

- **Elle quitte le hero.** `HeroCycle` reperd sa place réservée (`bas`) et
  retrouve son hero plein ; `BandeDuHero` pose la bande dans une section à elle
  — `border-b border-black/5 bg-white`, juste après `</header>` — sur l'accueil,
  la page d'un univers, d'un métier, l'article, le shop, la fiche produit et
  l'espace prestataire. Le hero respire, la bande se lit.
- **La carte est celle de la playlist, au pixel.** `CarteVivante` reprend la
  carte du dock de la playlist : `w-[172px] sm:w-[188px]`, `rounded-[20px] p-2.5`,
  pochette carrée `rounded-[15px]`, pastille en haut à gauche (`bg-black/75`, la
  même que l'heure des morceaux), **bouton de lecture blanc posé au centre de la
  pochette**, titre en gras, précision en gris, barre d'extrait quand ça joue —
  et **le grossissement mesuré au défilement, `0.88 → 1.06`**, comme la bande de
  la playlist.
- **Plus rien à lire sur la carte.** La mention « Ici » disparaît, le texte
  « Avis · … » disparaît, le compte de métiers disparaît, et le sous-titre d'un
  univers redevient sa tagline. Il reste la pastille (une heure, un mode, un
  domaine), la bande du bas (l'univers, en petit sur la pochette), le titre, la
  précision, le play et le cœur avec son nombre.
- **La carte de la page est centrée.** Comme la carte dominante de la playlist :
  au montage, la bande se place d'elle-même pour que la carte de la page soit au
  centre (sans glisser, la bande s'ouvre déjà là) ; quand on en choisit une
  autre, elle glisse jusqu'au centre. C'est la position qui dit où l'on est —
  plus besoin de l'écrire.
- **Contrôles.** `npx tsc -b` 0, eslint 0 sur tout ce qui a bougé, `npm test`
  178 / 55 / **375** (la bande est sous le header sur blanc, la carte est
  marquée `data-actif` pour être centrée, aucune mention d'état, aucun texte
  d'avis, aucun compte de métiers, les cartes ont la taille et la pastille de la
  playlist), `npm run build` OK.

## 26. Le nom, la barre, et la bande qui remonte sur le hero (passe 31)

**Le site s'appelle Super Mariage.** Le nom remplace Vows partout où il
s'écrit — la barre, les pieds de page, les écrans des mini-sites, la carte, le
timbre, le ticket de caisse, le magazine, le shop, les articles d'univers, le
testament du théâtre. Les **codes** imprimés sur les billets (`VOWS-XXX-…`, le
code-barres de la carte) ne changent pas : ce sont des identifiants, pas un nom,
et les laisser tels quels garde les billets déjà émis lisibles.

**La barre devient une ligne, et rien de plus** (`SiteHeader`) : **le nom au
centre**, et deux pictos à droite — **le caddie** vers le Shop, **le magazine**
vers le Magazine. Le menu déroulant des métiers disparaît de la barre (les
métiers se parcourent dans la bande de leur page, et depuis `/prestataire`) ;
`VendorDomainMenu` reste dans le dépôt, inutilisé pour l'instant.

**La bande remonte un peu sur le hero.** Elle reste sous le hero, sur fond blanc
(`-mt-14 sm:-mt-16`, `relative z-40`), mais elle en couvre le bas : elle est la
continuité du hero, pas une section de plus.

**Le média se joue dans le hero.** `LecteurHero` ne prend plus tout l'écran : il
se pose au-dessus de la bande (`absolute inset-x-0 bottom-full h-[100svh]`), donc
exactement sur le hero — et la bande reste devant lui (`z-40` sous la section),
pour qu'on relance une autre carte sans rien fermer. Les commandes du lecteur se
posent plus haut (`pb-28 sm:pb-32`) pour ne pas passer sous la bande.

**La bande défile avec le hero.** `HeroCycle` annonce l'univers qu'il montre
(`onChange`) ; l'accueil s'aligne dessus, et la bande centre la carte de cet
univers, au même rythme que le visuel (5,6 s). On peut toujours faire défiler la
bande à la main et **cliquer une carte pour montrer son hero** — le choix arrête
le défilé, « Vue d'ensemble » le relance. Quand une carte joue, le défilé attend
(`pause`).

**Contrôles.** `npx tsc -b` 0, eslint 0 sur tout ce qui a bougé, `npm test`
178 / 55 / **384** (le nom sur la barre, les deux pictos et leurs adresses, plus
de mots dans la barre ; la bande remonte sur le hero et se pose sur blanc ; une
seule carte porte `data-actif` et c'est celle du premier univers montré ; le
lecteur prend le hero et non l'écran ; le magasin porte le nom du site),
`npm run build` OK.

## 27. Le nom par-dessus le hero, trois cartes, et le titre de l'univers (passe 32)

**La barre ne se pose plus sur un fond.** Elle est posée sur le hero : **le nom
en blanc** à gauche, **le caddie et le magazine en haut à droite** — deux
pastilles rondes, plus de capsule blanche. Un voile très doux
(`from-black/45`, 96 px, `pointer-events-none`) tient la lisibilité du blanc
quand la page défile.

**Le bouton « Découvrir » a disparu** de l'accueil. Il racontait ce que la bande
raconte mieux : c'est le hero lui-même, avec son titre, qui présente l'univers —
et la carte du milieu montre où l'on est.

**La bande ne montre que trois cartes** : celle de la page **au milieu, plus
grande**, une de chaque côté (en retrait, `opacity-60`, cachées sur téléphone), et
**une flèche dans l'espace laissé libre à chaque bout** (`ChevronLeft`,
`ChevronRight`, `aria-label` « Carte précédente / suivante »). Les flèches et les
cartes de côté font la même chose : elles mettent l'univers suivant au milieu.
La bande remonte un peu plus sur le bas du hero (`-mt-16 sm:-mt-20`).

**Le hero porte le titre de l'univers montré** — et il le porte *en direct* :
`HeroCycle` annonce l'univers qui défile, l'accueil s'aligne, et le titre change
avec le visuel, exactement au même moment que la carte du milieu. La carte
« Vue d'ensemble » a disparu : la bande ne montre que des univers, chacun ayant
son hero. Les trois phrases manifestes du hero partent avec elle (la phrase du
site vit dans le pied de page).

**Contrôles.** `npx tsc -b` 0, eslint 0 sur tout ce qui a bougé, `npm test`
178 / 55 / **390** (le nom blanc et le voile, plus de capsule, les deux pictos ;
plus de bouton « Découvrir » ; le hero de l'accueil porte le titre du premier
univers montré ; trois cartes exactement, les flèches, le milieu marqué, les
cartes de côté en retrait ; la bande remonte sur le bas du hero),
`npm run build` OK.

## 28. Les cartes à cheval sur le hero, le sous-titre qui défile (passe 33)

**Les cartes sont à moitié sur le hero.** La bande remonte de la moitié d'une
carte (`-mt-32 sm:-mt-36`) : les trois cartes se voient à cheval sur le bas du
visuel, le bas sur le blanc, le haut sur la photo. Les heros qui posaient leur
texte en bas laissent donc la place (`pb-44`, `pb-40 sm:pb-44` sur l'univers, le
métier, l'article, le shop, la fiche produit et l'espace prestataire) : rien
n'est caché. Le lecteur suit (`pb-44 sm:pb-48` pour ses commandes).

**Plus de badges d'univers sur les cartes.** Le nom de l'univers est déjà le
titre de la carte : on ne l'écrit plus deux fois. La pastille du haut ne reste
que là où elle dit **autre chose que le nom** — l'heure d'un moment, le mode
d'un produit, le domaine d'un métier — et la petite ligne d'univers en bas de la
pochette a disparu partout. Le voile de la pochette s'allège d'autant
(`from-black/40 via-transparent to-black/20`) : il n'a plus de texte à porter.

**Le sous-titre défile dans la carte**, comme le titre et l'artiste sur une
radio : deux fois le texte, un glissement de la moitié, la boucle est sans
couture (`.vp-defile`, 14 s, `prefers-reduced-motion` respecté). La carte dit
tout ce qu'elle a à dire — et le hero n'a plus à le répéter : il porte le titre
de l'univers, la carte porte le reste.

**Le picto play est un triangle noir plein** (`fill-current`), sur la pastille
blanche posée au centre de la pochette — et dans le lecteur du hero aussi.

**Contrôles.** `npx tsc -b` 0, eslint 0 sur tout ce qui a bougé, `npm test`
178 / 55 / **396** (les cartes à moitié sur le hero et leur fond blanc ; plus de
pastille d'univers, plus de ligne d'univers, le nom écrit une fois ; le triangle
plein ; le sous-titre qui défile, écrit deux fois pour boucler),
`npm run build` OK.

## 29. Le générique, puis « qui êtes-vous dans ce mariage ? » (passe 34)

**L'ouverture.** `OuvertureSite` : le nom prend tout l'écran, **une lumière le
traverse** (`.vp-lumiere`, une bande qui passe une fois), puis il se fond —
trois secondes, l'ouverture d'un film. Elle se joue **une fois par visite**
(`sessionStorage`, `supermariage:ouverture`), s'écourte au clic, à une touche ou
par « Passer », et qui a demandé moins d'animations ne la voit qu'un instant
(1,1 s, sans lumière). Un générique, jamais un péage : rien n'est bloqué, la page
est derrière.

**Le hero devient un sélecteur de personnage.** `src/lib/personas.ts` : les
personnages sont **les rôles de la taxonomie du site** (`FULL_ROLES_TAXONOMY`),
dans l'ordre du parcours — les mariés, l'invité, le témoin, puis les métiers —
chacun avec son nom court (« SUPER MARIÉS », « SUPER PHOTOGRAPHE »), sa phrase à
la première personne, **les entrées de son espace** (Invités · Planning · Lieu ·
Playlist · Photos), son visuel et son picto (au trait, jamais un emoji). Rien
n'est ressaisi : le rôle est celui que le site connaît déjà, et c'est lui qui
donne l'écran et les droits.

**On regarde les autres, on n'entre qu'avec le sien.** Le hero traverse les
personnages tout seul (5,6 s, arrêté pendant un média ou en animations
réduites), les flèches font la même chose à la main, et **tous les autres rôles
sont écrits sous le nom, en gris, non cliquables** (`aria-hidden`) : le site
entier se comprend sans jamais ouvrir l'espace de quelqu'un d'autre. Le bouton
**Entrer** ouvre `/creer` avec le rôle du milieu — la création d'une carte
commence par un personnage, plus par un formulaire.

**Le hero ne sait plus rien.** `HeroCycle` ne fait que traverser des **visuels**
(`visuels`, `actifId`) : la page décide de ce qui défile et de quand. L'accueil
lui donne les personnages ; l'univers, lui, reste le second axe, dans la bande
sous le hero (sa carte au milieu mène l'éditeur, la playlist et les sections).

**Contrôles.** `npx tsc -b` 0, eslint 0 sur tout ce qui a bougé, `npm test`
178 / 55 / **416** (le générique : le nom, la lumière, « Passer », une fois par
visite, plus court sans mouvement ; les personnages : autant que de rôles, le
premier est celui des mariés, chacun a phrase, entrées, visuel et picto, aucun
doublon, le hero traverse les mêmes ; les autres rôles visibles et non
cliquables ; le hero demande qui vous êtes, présente le premier personnage, une
seule porte « Entrer », les deux flèches, la phrase des autres rôles),
`npm run build` OK.

## 30. Le plateau : le rôle entre en scène, la carte fait entrer, le dock suit (passe 35)

**Le picto est posé nu.** Plus de rond derrière : le picto du rôle, puis son
nom, puis sa phrase — rien autour.

**Le rôle entre en scène.** `HeroCycle` ne fond plus les visuels : il les
présente comme un plateau de télévision. **Un rôle sur deux arrive par la
gauche, puis par la droite** (le sens vient de la place dans la liste, jamais
d'un état : `courant % 2`), il glisse jusqu'au centre (`x` de ±16 % vers 0), y
respire, et sort du côté opposé (`AnimatePresence`). Le sens est écrit dans la
page (`data-direction`), donc vérifiable.

**Les rôles sont des cartes, exactement comme les univers.** `cartesDesPersonas`
fabrique les mêmes cartes vivantes (visuel, famille en badge, nom, phrase qui
défile, cœur, play) et la bande sous le hero les présente : **la carte du
personnage du hero est au milieu**, un clic sur une carte montre son hero, et
**le play fait entrer** — c'est lui le bouton (`libelleAction="Entrer"`,
`onAction`). Les flèches et le bouton « Entrer » du hero ont donc disparu : la
bande porte les deux gestes. Deux bandes se suivent : **les rôles** (à moitié sur
le hero), puis **les univers**, le second axe du site.

**Le dock suit le personnage.** `src/lib/personaCourant.ts` retient « qui vous
êtes » et le propage par un événement — le hero écrit, le dock écoute, ni l'un
ni l'autre ne se connaît. Le dock montre **les outils du rôle** (« Outils ·
SUPER PHOTOGRAPHE » : Moments · Photos · Galerie · Livraison), déduits de ses
entrées, avec un picto choisi par mot-clé et une route par sujet ; la capsule
défile (`overflow-x-auto`, `no-scrollbar`) et ses outils **changent quand le
personnage défile** dans le hero. Le socle du site (Accueil, La carte,
Prestataires, Zéro contrainte, Playlist) reste à gauche, séparé par un filet.

**Contrôles.** `npx tsc -b` 0, eslint 0 sur tout ce qui a bougé, `npm test`
178 / 55 / **429** (le picto nu ; l'arrivée par un côté ; trois cartes par bande
et deux bandes ; une carte marquée par bande ; les cartes des rôles avec clé,
badge, phrase et média ; le play qui fait entrer, pour les trois cartes, et plus
de bouton à part ; le dock qui porte les outils du personnage, les mêmes que ses
entrées, qui garde la capsule du site, suit le personnage et défile),
`npm run build` OK.

## 31. Tout suit le rôle : le nom, les deux portes, le dock (passe 36)

**Le nom se transforme.** On survole « SUPER PHOTOGRAPHE » : le nom du site
devient le sien, et redevient **SUPER MARIAGE** dès qu'on ne survole plus rien
(`personaCourant` porte le survol, la barre le lit). Le nom vit maintenant dans
`src/lib/nomDuSite.ts`, écrit une fois.

**Les deux portes deviennent les siennes.** Pendant qu'un rôle est survolé, le
caddie mène à `/shop?role=…` et le magazine à `/magazine?role=…` — **son** shop,
**son** magazine, et leurs infobulles le disent. `src/lib/personaSuites.ts` sait
ce qui concerne un rôle : les catégories du shop (le fleuriste voit le décor, le
DJ voit la lumière et le mobilier) et les mots qui rattachent un article (titre
et chapô seuls — le corps cite tout le monde). Les mariés, eux, voient tout.

**Le rôle remplace les filtres.** Le Shop d'un rôle n'affiche que ses pièces
(9 pour le fleuriste), le Magazine que ses articles (10 pour le photographe) —
les catégories et les modes restent pour affiner, jamais pour trier, et « Tout le
shop » / « Tout le magazine » ramènent le catalogue entier.

**Le dock porte les outils du rôle.** Les pictos du site (Accueil, La carte,
Prestataires, Zéro contrainte, Playlist) quittent la capsule : **le rôle ouvre le
dock de son propre picto**, puis ses outils — ceux de ses entrées — avec leur
picto à chacun et leur page. Quand le rôle défile dans le hero, les outils du
dock changent avec lui.

**Les flèches encadrent le dock.** Les rôles sont des cartes vivantes, posées
**dans le hero, juste au-dessus du dock** (`bottom-[6.5rem]`), et le texte du
hero remonte (`contenuClassName="-translate-y-[10vh]"`) pour qu'elles se voient.
Les deux flèches ont quitté la bande : la page enregistre ses deux gestes
(`enregistrerControlesBande`), le dock les affiche **de chaque côté de la
capsule** — et rien quand aucune bande n'est menée.

**Contrôles.** `npx tsc -b` 0, eslint 0 sur tout ce qui a bougé, `npm test`
178 / 55 / **451**, `npm run build` OK.
