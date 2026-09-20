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

## 32. La nav verticale, différente sur chaque page (passe 37)

**Les deux portes passent en blanc.** Le caddie et le magazine de la barre sont
désormais **blancs, picto noir** (`border-white bg-white text-[#0B0C12]`) : on les
voit sur n'importe quel visuel, et l'encre ne se perd plus dans le hero.

**Une capsule verticale à droite, propre à chaque page.** `NavVerticale` se pose
au milieu du bord droit (`fixed right-3 top-1/2`, `hidden sm:block`) : en haut
**le Shop et le Magazine** (les deux portes, en blanc, et scopées si un rôle est
survolé), un filet, puis **ce que la page propose** — son article, son
programme, sa carte de fidélité, sa playlist, ses pièces, ses détails, de quoi
créer sa carte. Le nom de chaque action s'écrit au survol, à gauche de la
capsule ; un clic descend vers la section (ancre) ou ouvre la page.

**Chaque page déclare la sienne.** `src/lib/navDesPages.ts` tient les huit listes
(accueil, univers, métier, magazine, article, shop, produit, prestataire), et
chaque page les enregistre (`enregistrerNavVerticale`) — la capsule est montée
une seule fois, dans `SiteChrome`, et suit la page. **Aucune action ne mène dans
le vide** : chaque ancre existe réellement (`#ecran`, `#univers`, `#site`,
`#bande-son`, `#article`, `#programme`, `#carte-fidelite`, `#playlist`,
`#ticket`, `#pieces`, `#modes`, `#details`, `#similaires`, `#editeur`), et les
identifiants manquants ont été posés sur les sections qui les portent.

**Contrôles.** `npx tsc -b` 0, eslint 0 sur tout ce qui a bougé, `npm test`
178 / 55 / **459** (les deux pictos blancs de la barre ; huit navs, deux actions
minimum chacune, jamais d'ancre **et** de page à la fois ; toutes les ancres
présentes dans le rendu des pages ; la capsule qui porte le shop, le magazine et
les actions de la page, qui change avec elle et se tient à droite),
`npm run build` OK.

## 33. Les cartes des rôles, sous le titre du hero (passe 38)

**Elles étaient mal posées.** La bande des rôles flottait, en absolu, au bas du
hero (`bottom-[6.5rem]`) — et le texte du hero avait été remonté de 10vh pour
lui faire de la place. Fini : **les cartes se posent dans le flux, juste sous le
titre du personnage** (`mt-9 w-full sm:mt-11`), dans le hero, et le texte reprend
sa place (`HeroCycle` sans `contenuClassName`).

**Plus de bande blanche.** La bande des rôles passe `premiere` : la section n'a
ni fond blanc ni bord (`relative z-30`), les cartes flottent sur le visuel, et
son libellé s'écrit en blanc. La bande blanche, c'est celle des univers, sous le
hero — elle ne bouge pas.

**Plus de flèches sur les cartes.** `BandeauHero` prend `fleches` (vrai par
défaut) : les trois cartes se centrent, sans les deux boutons d'espace. Dans
`BandeDuHero`, `fleches = !premiere` — la bande posée dans le hero n'en porte
donc pas : **ce sont celles du dock qui mènent la bande**, et un seul geste n'a
qu'une paire de flèches. La bande des univers, hors du hero, garde les siennes.

**Contrôles.** `npx tsc -b` 0, eslint 0, `npm test` 178 / 55 / **461** (les
cartes des rôles entre le titre et la fin du hero ; plus de `bottom-[6.5rem]` ;
**une seule** paire de flèches de cartes dans toute la page — celle des univers —
et les deux du dock ; la bande des univers toujours sur blanc), `npm run build`
OK.

## 34. Les titres, les cartes, et le profil (passe 39)

**Le hero n'a plus de commentaire.** « Les rôles — cliquez pour voir, play pour
entrer » a disparu, et les phrases entre guillemets sous les grands titres
aussi : le titre se lit, les cartes se voient, rien ne les explique. La bande
des **univers**, elle, garde son libellé — elle n'est pas dans le hero.

**Le générique ouvre des titres, pas des rôles.** `TITRES` (dans
`src/lib/personas.ts`) tient les cinq grandes familles, dans l'ordre du
parcours : **SUPER PRESTATAIRE, SUPER MARIÉ(E), SUPER FUTUR MARIÉ(E), SUPER
FAMILLE, SUPER TÉMOIN**. Le hero prend le titre en grand, et **dessous, ses
cartes à choisir** — pas de bande blanche, pas de flèches (celles du dock mènent
la bande, comme partout).

**Deux niveaux chez les prestataires.** Les cartes du titre sont les
**domaines** — Réception & Bouche, Cérémonie & Coordination, Musique & Live,
Image & Mémoire, Style & Scénographie, Logistique & Sécurité, Métiers
Transverses — et le play les **ouvre** : le hero prend le nom du domaine, et
montre **les métiers qui le font vivre**. C'est là qu'on trouve ce qu'on n'était
pas venu chercher, et « ← Tous les domaines » ramène d'un geste.

**Une carte peut porter deux personnes.** `Personnage.places` dit combien :
« SUPER MARIÉ » est à quelqu'un, « SUPER MARIÉS » à deux. Les variantes existent
des deux côtés — marié, mariée, mariés, mariées, marié·e·s, et les mêmes au
futur. Les cartes à deux portent leur pastille (« 2 places ») ; les autres, leur
domaine.

**Le profil remplace les deux portes.** En haut à droite, plus de caddie ni de
magazine : **un bouton profil** — c'est lui qui ouvre le menu du site
(`src/lib/menuProfil.ts`) : **Voir en tant que** (tous les rôles, rangés par
titre : on en prend un, le site devient le sien, et l'on ne voit jamais les
informations de personne), puis Profil, Boîte de réception (1), Paramètres (⌘.),
Apparence, Assistance, Documentation, Communauté, Télécharger les applications,
Accueil, Se déconnecter — les entrées du menu, et les pages du site derrière.
Le Shop et le Magazine restent dans la **nav verticale**, sur chaque page.

**Contrôles.** `npx tsc -b` 0, eslint 0, `npm test` 178 / 55 / **483** (les cinq
titres dans l'ordre, chacun avec ses cartes, toutes des personnages du site ;
les sept domaines et leurs quatorze métiers, sans média à lancer ; les variantes
d'un couple — 1, 1, 2, 2, 2 places — et la pastille qui le dit ; le hero qui
ouvre sur le premier titre, sans libellé ni phrase entre guillemets, et le play
qui ouvre un domaine ; la barre sans ses deux portes, avec le profil ; le menu
et ses entrées, « voir en tant que », et **aucun rôle oublié**), `npm run build`
OK.

## 35. Le manifeste, les univers en hero, SUPER ÉDITEUR (passe 40)

**Sous le hero, le manifeste.** Trois paragraphes (`src/lib/manifeste.ts`, lus
par `Manifeste.tsx`) disent le concept avant que le site ne le montre : tout le
monde arrive par une porte différente ; une carte dit qui vous êtes, un univers
où vous le vivez, un métier qui le rend possible ; le passé raconte, le présent
prépare, le futur imagine ; et le miroir — visible pour soi, invisible pour les
autres. C'est le seul endroit de l'accueil qui parle à tout le monde de la même
façon.

**Les univers ont leur hero.** La bande volante sous le hero a disparu :
`HeroUnivers.tsx` pose **le même hero que les rôles** — le nom de l'univers en
grand, sa phrase, et **ses cartes juste en dessous** (`premiere`, pas de bande
blanche, pas de flèches). L'univers défile tout seul (5,6 s), un clic sur une
carte montre son hero, le play lance son média dans le hero.

**Les flèches du dock suivent la bande qu'on regarde.** Une page peut porter
plusieurs bandes : elles s'enregistrent **chacune sous son identifiant**
(`enregistrerControlesBande(gestes, id)`), et le dock mène **la dernière entrée à
l'écran** (`useControlesDeBande`, observateur d'intersection à 30 %). On descend
vers les univers : leurs flèches prennent le dock. On remonte : celles des rôles
reviennent. Plus aucune bande ne porte ses propres flèches.

**La carte est mise de côté.** La section « Votre carte » a quitté l'accueil
(`HomeCardShowcase` reste dans le dépôt, et toujours testé) — on la reprendra.

**SUPER ÉDITEUR a sa page, et l'accueil montre le responsive.** L'écran d'édition
est passé sur `/parametres` (`EditeurMiniSite`, l'univers se choisit par
`?univers=`), ouvert par le **bouton Paramètres en bas à gauche**, monté dans
`SiteChrome` — donc présent partout. À sa place, l'accueil montre **un
ordinateur, une tablette et un téléphone** (`Appareils.tsx`) : la même page, au
même moment, qui descend et remonte doucement (`.vp-defile-page`, éteinte en
`prefers-reduced-motion`).

**Le shop s'appelle SUPER SHOP.** `SuperMariageTeaser` prend son vrai nom — c'est
lui qui nous a menés ici —, garde son ticket de caisse, et **perd le bouton
« L'éditeur des métiers »**. La nav verticale de l'accueil suit : Les univers · Le
manifeste · Super Éditeur · Faire ses courses · La playlist, et une liste pour la
page des paramètres.

**Contrôles.** `npx tsc -b` 0, eslint 0, `npm test` 178 / 55 / **506** (le
manifeste entre les deux heros ; les univers en hero avec leurs cartes ; aucune
bande ne porte ses flèches ; les trois appareils et la même page dans chacun ;
l'éditeur qui a sa page, l'accueil qui ne l'a plus, le bouton Paramètres en bas à
gauche ; SUPER SHOP, son ticket, plus de porte des métiers ; tous les ancres de
la nav présentes dans les pages ; et **les flèches du dock qui passent d'une
bande à l'autre** selon ce qu'on regarde), `npm run build` OK.

## 36. SUPER FOOTER, et la fente (passe 41)

**Le magasin avait raison : on garde tout.** Même design que SUPER SHOP — des
**rayons** qu'on coche, un **ticket** qui se compose tout seul — mais les rayons
ici ne sont pas des objets : ce sont des **situations de vie**. `src/lib/superFooter.ts`
tient **quatre grands axes** et leurs couches : *Qui vous êtes* (travail, études,
sans activité, frontières), *Ce que vous vivez* (union, famille, logement,
création), *Ce que vous savez faire* (ce qui se prouve, votre métier, ce que vous
transmettez), *Ce que vous voulez* (le monde, accueillir, vos valeurs). 54 coches,
et l'on descend les couches une à une.

**Ce qui existe vraiment.** 31 documents — attestation d'hébergement, lettre
d'invitation pour un visa, comparabilité d'un diplôme, Kbis, relève de droits des
intermittents, quittance, cession de droits, testament, titre de séjour… Chacun
dit **qui le demande**, **au nom de qui** il est établi, **les pièces à réunir**,
sa **source**, et — quand il engage le droit — sa **validation** (`juriste` ou
`notaire`). Le ticket porte l'état : *à réunir* ou *à valider*. **Le site ne
fabrique aucun acte** : il montre la voie, la personne rassemble, un juriste
valide. Et un footer, ça se choisit ligne à ligne (mentions, statut, documents,
crédits, valeurs, langues, accessibilité, écologie).

**La fente.** En haut du site, une fente : quand une demande part, **un ticket en
sort** — « Document disponible concernant … », demandé par qui, pour qui, et le
lien pour ouvrir SUPER FOOTER (`src/lib/documents.ts`, clé `vows:documents`).
C'est le bandeau d'intégration : on apprend ici ce qui vient de se passer, sans
ouvrir une page. Chacun ne voit que ses propres demandes.

**Les routes et les entrées suivent.** `/footer` porte la page ; la
**Documentation** du menu profil y mène ; la nav verticale de la page propose
Votre situation · Les documents · Votre footer ; la barre annonce « Super
Footer ». Et parce qu'une ancre ne doit jamais mener dans le vide, la section des
documents existe toujours — avec son invitation à cocher.

**Contrôles.** `npx tsc -b` 0, eslint 0, `npm test` 178 / 55 / **538** (quatre
axes et leurs couches, aucune coche en double ; les documents qui disent tous qui
demande, au nom de qui, quoi réunir et la source, chacun ouvert par une situation
réelle ; ce qui engage le droit marqué à valider, et le testament renvoyé au
notaire ; le ticket qui se compose et se vide ; la page — ses axes, ses lignes de
footer, son invitation ; et la fente : muette sans demande, bavarde avec, qui
annonce puis se tait), `npm run build` OK.

**Et la revue juridique existe** : `docs/revue-juridique.md`, à remettre à la
marraine du projet et à l'avocate — ce qui est collecté, où c'est stocké, ce qui
touche des données sensibles, ce qui doit être validé avant de sortir du
navigateur.

## 37. Le point d'état, la fente, le Wallet, et vingt héros (passe 42)

**Un point qui s'allume, en bas à droite.** Bouton noir, picto blanc, et un point
qui prend la couleur de ce qui arrive : **vert** (routine), **bleu** (à savoir),
**mauve** (à faire), **fuchsia** (important), **orangé** (urgent), **rouge**
(critique). Le point suit **le palier le plus haut** de ce qui reste à voir, il
bat, et il porte le compte. À côté, en bas à gauche, le bouton **Paramètres** est
devenu noir à picto blanc, comme lui.

**La fente ne sort que quand il y a un ticket.** On clique le point : la fente
s'ouvre. Un document, un message, une notification arrivent : elle s'ouvre toute
seule. Le reste du temps, elle n'existe pas. C'est `src/lib/annonces.ts` — un
seul passage pour tout ce qui circule (`document`, `message`, `notification`),
avec les états *nouveau*, *lu*, *validé*, *négocié*, *écarté*.

**Le ticket dit vos droits.** « Vous n'êtes pas obligé d'ouvrir ce ticket, ni de
l'imprimer. Ne pas l'ouvrir est un droit : votre choix et son heure sont
enregistrés ici, pour que personne ne puisse dire le contraire. » Et trois gestes :
**ne pas ouvrir** (le choix est écrit, rien ne s'imprime), **valider** (la pièce
descend au portefeuille, l'autre est prévenu), **négocier** (un retour part, la
négociation reste sur le ticket). Aucune valeur probante n'est revendiquée : le
site dit ce qu'il enregistre, les juristes diront ce que cela vaut.

**Le Wallet range tout seul.** Chaque pièce validée se classe dans sa famille
(identité, domicile, revenus, travail, études, famille, frontières, entreprise,
droits) ; **si aucune ne correspond, la famille se crée** sur le nom de l'axe dont
la pièce vient, et porte la mention « créée ». C'est ainsi qu'un portefeuille
apprend : à force de demandes, à travers le monde, des familles apparaissent.
`src/lib/wallet.ts`, clé `vows:wallet`.

**Vingt SUPER HÉROS.** `src/lib/superHeros.ts` : vingt spécialistes, chacun avec
sa spécialité, ce qu'il **surveille**, ce qu'il **fait**, et son palier — de
l'ARCHIVISTE (les pièces manquantes) au GARDIEN (qui voit quoi), en passant par
la BOUSSOLE (les frontières), la BALANCE (les négociations), le PASSEUR (faire
parler les anciens mariés aux futurs). Ils ne décident pas : ils voient, et
allument le point. C'est de là que naissent les **SUPER MATCH**.

**La page est publique**, comme le reste : SUPER FOOTER se visite, coche, et
demande — et la documentation du menu profil y mène.

**Contrôles.** `npx tsc -b` 0, eslint 0, `npm test` 178 / 55 / **568** (six
paliers et leurs couleurs ; la fente muette sans ticket, et bavarde avec ; le
ticket qui dit le document, qui l'a demandé, la mention de droits et les trois
gestes ; le point qui s'allume au palier le plus haut ; les états écarté, validé,
négocié ; le classement automatique, la famille créée pour une pièce inconnue ;
vingt héros, tous les paliers couverts), `npm run build` OK.

## 38. AIME MAGAZINE, la revue par éditions (passe 43)

**Ce qui se répétait est parti.** La page du magazine portait son nom deux fois
(« SUPER MARIAGE magazine » dans la barre, « Le Magazine Super Mariage » dans le
hero), une phrase d'accroche, **quatre compteurs** puis **quatre boutons de
filtres** qui disaient la même chose, et un paragraphe de chiffres. Il reste
**un titre** et **la revue**.

**Le titre, au centre : SUPER MAGAZINE.** Le logo reste en haut à gauche
(« SUPER MARIAGE »), et la barre annonce « Magazine » à côté — la page, elle,
ne le redit plus.

**La revue s'appelle AIME MAGAZINE** (la marque est déposée à l'INPI). Elle se
feuillette **par éditions** : une couverture, un thème, et les articles dedans.
`src/lib/aimeMagazine.ts` construit les **neuf éditions** à partir des vrais
articles — *Les univers, racontés* · *Le jour J, heure par heure* · *Lumière &
Image* · *La table* · *Végétal & Fleurs* · *Les métiers du jour J* · *La nuit* ·
*Ce qu'on oublie toujours* · *Insolite* — et une édition qui ne rassemblerait pas
deux articles n'existe pas. **Un article peut appartenir à plusieurs éditions**,
quand le sujet le mérite.

**Comment une édition se compose.** Les mots du thème ouvrent l'édition, et
**l'endroit où le mot apparaît** décide de l'ordre : dans le **titre** d'abord,
puis la signature, puis le chapô. C'est ce qui met « Cinéma : Rideau rouge. 35mm.
Première » en couverture de *Lumière & Image*, « Garden Botanica » en tête de
*Végétal*, et « Les prestataires : qui fait quoi » en tête de *Les métiers*.

**La couverture est un objet.** En haut **AIME MAGAZINE** et le numéro ; au
milieu **le thème**, en grand ; en bas, sur la photo, **trois titres à la une**.
Celle du centre est l'édition ouverte, celles de côté sont les suivantes — et le
sommaire (un mot par couverture) permet d'aller droit au but. Sous la bande, les
articles de l'édition ; plus bas, **Les autres éditions**.

**Les flèches du dock feuillettent la revue** : `useControlesDeBande('magazine',
…)` — le même geste que les rôles et les univers.

**Les gestes de la capsule** (`src/lib/navVerticale.ts`) sont désormais écrits une
fois pour tout le site : **survoler** (le nom s'écrit), **cliquer** (on y va),
**clic droit** — ou appui long (ce que ça fait, et pourquoi), **Échap** (on
ferme), **molette** (la page descend). Chaque action porte son `aide`, une phrase
qui dit ce qu'elle fait ; le clic droit l'affiche, et le point d'interrogation en
bas de la capsule relit les gestes à tout moment. **Toutes les actions des huit
pages ont leur aide** : c'est testé.

**Contrôles.** `npx tsc -b` 0, eslint 0, `npm test` 178 / 55 / **595** (la marque,
les éditions numérotées, aucune couverture vide, les titres à la une qui viennent
bien de l'édition, le thème qui mène le sujet, **tous les articles du site dans au
moins une édition** ; la page sans son double titre, ses compteurs, ses filtres ni
sa phrase ; la couverture, son numéro, son thème, ses titres ; les gestes écrits
une fois et toutes les actions qui savent dire ce qu'elles font),
`npm run build` OK.

---

## §39 — Le jeu de 54, et le magazine qui suit l'année

**L'idée, dite simplement.** AIME MAGAZINE ne publie pas seulement ce qui existe :
il publie **des magazines du passé, du présent et du futur**, et **ils changent
selon nos actions, nos choix, et avec qui on travaille**. La même semaine donne
deux magazines différents à deux personnes du même mariage — et c'est normal :
elles ne vivent pas la même semaine.

**Le secret du jeu de cartes.** Il y a une histoire que personne ne raconte deux
fois de la même façon : le jeu serait un calendrier. **52 cartes comme les 52
semaines** de l'année, **4 couleurs comme les 4 saisons**, **13 cartes par
couleur comme les 13 semaines de chaque saison** (et les 13 lunaisons), **12
figures comme les 12 mois**, et, en additionnant les points, **364 — plus les
jokers, qui font les 365 ou 366 jours**. Ce n'est pas une preuve : c'est une
**symétrie**, et elle est belle. C'est exactement pour ça qu'on s'en sert — et
c'est pour ça qu'on le dit comme une histoire, pas comme un fait.

**Les quatre couvertures de base.** Un **fond uni**, et au centre une **création
digitale sur l'amour de la saison** — rien ne passe dessus. Le fond est la
couleur de la saison, la couleur est celle du jeu : été « ce qui se montre ».

| Saison | Couleur | Semaines | Fond | Sens | Visuel |
|---|---|---|---|---|---|
| Printemps | ♥ cœur | 13 → 25 | `#7FB77E` | la promesse, les fleurs, le oui | `public/images/aime/printemps.jpg` |
| Été | ♦ carreau | 26 → 38 | `#E9B44C` | la lumière, la table, les longs jours | `…/ete.jpg` |
| Automne | ♣ trèfle | 39 → 51 | `#B8574A` | la fin des travaux, la maison, le feu | `…/automne.jpg` |
| Hiver | ♠ pique | 52 → 12 | `#16233F` | le creux de l'année, l'intime, l'attente | `…/hiver.jpg` |

**Les treize figures, et leur sens pour un mariage** (`src/lib/jeuDeCartes.ts`) :
As *le commencement* · 2 *le duo* · 3 *la famille* · 4 *le lieu* · 5 *les témoins* ·
6 *le voyage* · 7 *l'épreuve* · 8 *le travail* · 9 *la table* · 10 *la fête* ·
Valet *l'annonce* · Dame *la maison* · Roi *l'engagement*. La hauteur donne le
**ton** de la semaine : le 1 « la plus haute — l'année entière tient dans cette
semaine », le 7 « basse — la semaine des choses qu'on remet », le 13 « la plus
haute de la saison — une saison se referme ».

**Les cinquante-quatre numéros.** `JEU_DE_54` = les **52 semaines** (n° 1 à 52 :
le numéro *est* le numéro de semaine) et **2 jokers** — **n° 53 le jour de trop**
(le 365ᵉ jour) et **n° 54 le jour bissextile** — qui n'appartiennent à aucune
semaine, et où tout peut arriver.

**Les habitudes de l'année.** Un mariage ne se décide pas hors du temps : chaque
semaine porte son **pas-de-temps** (`PAS_DE_TEMPS`, treize périodes qui couvrent
1 → 52 sans trou), avec **l'usage d'autrefois** (`dit`) et **le conseil
d'aujourd'hui** (`sage`) : *le creux de janvier* (le mois le plus délaissé, et
pourtant le moins cher) · *le temps des annonces* · *avant le carême* · *le
carême* (46 jours, temps clos : on ne célèbre pas) · *la saison s'ouvre* (avril
fut longtemps le mois préféré, avant juin) · *le mois de mai* (« Noce de mai, noce
de mort » — le mois de Marie) · *la haute saison* (juin → septembre) · *les
grandes chaleurs* · *le plein été* · *les moissons finies* · *l'arrière-saison* ·
*le mois des morts* (novembre) · *l'Avent* (du 4ᵉ dimanche avant Noël au 24
décembre). Les noces duraient de **deux à huit jours**, on évitait les semailles
et les moissons, et l'on se mariait sur une **lune qui monte** — jamais
décroissante. `phaseDeLune()` donne la phase du jour (nouvelle lune de référence :
6 janvier 2000, 18 h 14 UTC ; cycle de 29,530588 jours).

**Le moteur** (`src/lib/aimeMoteur.ts`) : `composerEdition({ numero, annee,
roleId, styleId, options, temps })` rend une **édition de huit pages, toujours** —
`Le temps` · `La carte` · `L'amour` · `Le passage` · `Les gens` · `Vos papiers` ·
`La musique` · `L'archive`. **Le nombre de pages ne change jamais** : c'est ce qui
fait un magazine. Ce qui change, c'est **ce qu'il y a dedans**, et chaque page
dit **ce qui l'a décidée** (`source`) : la semaine et la lune · la carte (couleur,
figure, ton) · la saison (fond et création) · le rôle (les 27 personnages) ·
l'univers (les 25 styles) · les coches de SUPER FOOTER (les 31 documents) · la
playlist (le catalogue) · l'archive (un univers du passé).

**Pas de hasard qui change à chaque affichage.** Une **signature stable**
(FNV-1a) traverse la graine : *mêmes choix, même édition*. C'est ce qui permet de
relire un numéro et de le retrouver identique — et c'est testé.

**Passé, présent, futur.** `troisTemps()` rend **la même semaine, trois fois** :
relue au passé (« la même semaine, l'an dernier »), au présent, au futur (« l'an
prochain »). Même carte, même saison, même numéro — trois contenus différents.
`editionDuMoment()` rend la semaine où l'on est ; `lesQuatreSaisons()` rend la
couverture de chacune des quatre saisons, prise dans sa saison ; et pour la
semaine 38, les quatre tombes sur 13, 38, 39 et 1 — chacune la bonne carte de sa
couleur.

**La page** (`src/pages/Magazine.tsx`) : **un hero avec le visuel et le titre au
centre** — le fond de la saison, la création adoucie en fond, **SUPER MAGAZINE**
en grand, et la création **nette** au centre comme un sceau : la saison, la carte
et le numéro. **En dessous du hero, les cartes** : les **quatre saisons** d'abord
(chacune avec les treize semaines de sa couleur en dessous), puis **le numéro du
moment** et ses huit rubriques (avec les trois temps), puis **les éditions de
thème** — les neuf couvertures AIME MAGAZINE. Les flèches du dock feuillettent
les 54 numéros.

**Contrôles.** `npx tsc -b` 0, eslint 0, `npm test` 178 / 55 / **660**
(54 numéros, 4 saisons, 13 par saison, 2 jokers, les 52 semaines couvertes une
fois, les treize pas-de-temps sans trou, le carême clos, mai évité, les quatre
créations présentes sur le disque ; huit pages et huit rubriques dans l'ordre,
mêmes choix → même édition, un autre rôle ou une coche de plus qui recomposent
tout, aucun numéro vide de 1 à 54 ; trois temps, même carte, contenus différents ;
le hero avec son visuel, son titre au centre et la création au milieu ; les
cartes en dessous du hero, les quatre saisons avant les éditions de thème),
`npm run build` OK.

---

## §40 — Un jour, une couverture : le calendrier, le studio, la météo, et le flux

**Le déplacement.** Le magazine n'avait pas une semaine : il a maintenant un
**jour**. Chaque jour de l'année a **sa couverture**, **son prénom**, **son
portrait de studio**, **sa carte** et **sa météo** — et le hero du magazine
n'est plus une image, c'est **un flux qu'on fait glisser**, comme on fait
défiler.

**364 couvertures nommées, et deux jokers.** Le calendrier français donne un
prénom par jour : `src/lib/saintsDuJour.ts` en tient **364** — du 1er janvier au
30 décembre — et laisse **deux jokers**, exactement comme le jeu de 54 : le
**31 décembre** (couverture n° 53, « le jour de trop », et la fête de Sylvestre)
et le **29 février** (couverture n° 54, « le jour bissextile », qui n'a pas de
prénom). `jourNomme()`, `nomDuJour()`, `jokerDuJour()`, `joursDuMois()`.
**La source, et sa limite** : le calendrier vient d'un **jeu ouvert** (« Les
saints et les fêtes du calendrier », repris du dépôt `theofidry/ephemeris`), relu
et corrigé — orthographes, accents, et les fêtes mobiles de la source (les
Cendres, les solstices) remplacées par le prénom du jour. La référence française
reste **Nominis** (Conférence des évêques de France) : deux calendriers ne donnent
pas la même liste, et **le nôtre s'en approche sans en être la copie**.

**Ces prénoms sont des personnages, pas des personnes.** Ils servent d'**exemples
utilisateurs fictifs** : ils habitent les couvertures, les programmes, les
articles — et ils rendent le produit réel sans rien inventer sur qui que ce soit.

**Le studio.** Chaque jour a **son portrait** (`PortraitStudio.tsx`) : **fond
blanc comme en studio**, et **fond noir** les jours qui ne sont pas des jours
comme les autres — les **dimanches**, les **temps clos** (carême, Avent), les
**portes de l'année** et les **deux jokers**. La pose, l'attribut et la lumière
se déduisent de la date par une **graine stable** : deux jours ne se ressemblent
jamais, et le même jour se retrouve à l'identique quand on le relit. Le portrait
est **rendu** — la photographie réelle prendra sa place, planche après planche,
sans que rien d'autre change.

**La météo, sur les moyennes du passé.** `meteoDuJour()` donne le minimum, le
maximum, le ciel et **ce que ça change pour un mariage** — les normales
françaises 1991-2020 (référence Paris-Montsouris, Météo-France), lissées d'un
mois à l'autre, avec un écart stable jour après jour. **Ce sont des moyennes,
pas une prévision** : « il pleut en moyenne ce jour-là » ne dit pas qu'il
pleuvra. Cette phrase-là est écrite dans l'édition, à la première page.

**Les clés du jour** (`clesDuJour()`) : la **lune** (calculée — nouvelle lune de
référence du 6 janvier 2000), les **quatre portes de l'année** (les solstices et
les équinoxes), **l'interstice** — les jours entre les deux années, du 26
décembre au 5 janvier, où rien n'est encore décidé —, le **chiffre du jour**
(1 à 9, et son sens) et **le treizième signe** : le **Serpentaire**, du 30
novembre au 17 décembre, « celui qu'on a retiré des douze », gardé pour ce qu'il
dit — **guérir**. Le chiffre, l'interstice et le signe sont des **lectures
symboliques**, écrites comme telles ; la lune et la météo sont des calculs.

**L'édition du jour** (`editionDuJour()`) : les **huit rubriques, toujours**, et
la première dit le temps qu'il fait — le prénom, la date, la météo moyenne, la
lune, la porte, l'interstice. La page « Le passage » reçoit le **chiffre du
jour** et le signe. Le nombre de pages ne bouge pas d'un jour à l'autre : c'est
la règle du magazine depuis le §39.

**Le flux** (`FluxDuJour.tsx`) : le hero du magazine est un **flux** — un écran
par jour, avec le prénom, le portrait, la carte, la semaine, la météo. On passe
au suivant **au doigt, à la molette, au clavier (← →, ↑ ↓) ou avec les flèches**.
**Vertical sur un téléphone, horizontal dès que l'écran est large** : le même
flux, décidé en `snap-y` / `md:snap-x`, sans JavaScript d'axe, donc sans rien
casser quand l'appareil tourne. Les flèches du dock feuillettent **les jours** :
au bord de la fenêtre de sept jours, la fenêtre glisse d'un jour.

**Ce que dit GenK, et ce qu'on en garde.** GenK (NOERDEN, `genk.app`, iOS) est
une application de culture générale qui reprend **la forme du fil** — « même
swipe, même dopamine » — mais **remplit chaque écran d'une connaissance** :
micro-sessions d'une à deux minutes, parcours débloqué étape par étape, **quiz
juste après la leçon** puis révisions espacées, définitions cliquables sur les
mots, « deep dive » pour approfondir, et un terme surligné qui donne sa
définition d'un tap. Leur promesse tient en une phrase : **transformer le temps
d'écran en savoir**. Ce qu'on en garde, pour un mariage :
1. **un flux, pas un catalogue** — c'est le jour qui commande, pas la liste ;
2. **la micro-dose** — un jour, une couverture, deux minutes de lecture ;
3. **la mémoire** — l'édition du jour reste relisible (mêmes choix, même
   édition), et l'archive dira « la même semaine, l'an dernier » ;
4. **les définitions cliquables** — `ouEstLeMot` (§38) fait déjà ce travail sur
   les mots du magazine ;
5. **le « deep dive »** — c'est **l'édition à huit pages** ;
6. **la progression** — c'est le **jeu de 54** : 364 jours, 52 cartes, 13 par
   couleur, et deux jokers.

**Contrôles.** `npx tsc -b` 0, eslint 0, `npm test` 178 / 55 / **705**
(364 couvertures nommées, le dernier jour de l'année étant un joker, les deux
jokers du calendrier, 364 jours nommés en 2026 ; le rang, la carte, la saison, le
rôle du jour de la semaine ; les huit pages et la météo qui remonte dans la
première ; la graine stable du studio et le même jour retrouvé ; la météo
plausible toute l'année et l'été plus chaud que l'hiver ; la lune, les quatre
portes, l'interstice, le chiffre de 1 à 9, le Serpentaire donné pour ce qu'il
est ; le flux balisé, qui glisse dans les deux sens, avec son jour ouvert
marqué et ses sept jours qui se suivent ; le portrait qui porte le prénom, son
fond et sa pose), `npm run build` OK.

---

## §41 — Vingt-quatre heures, le super saint, et le fil rouge

**Le magazine passe de huit à vingt-quatre pages : une par heure.** Ce n'est pas
une page qui s'allonge — c'est **la journée entière** qui entre dans le magazine.
`HEURES` (dans `aimeMoteur.ts`) les nomme une à une et leur donne **leur
lumière** : minuit et le creux de la nuit · cinq heures et l'avant-aube · six
heures et **l'aube** · le grand matin · **midi** · le début d'après-midi · la fin
d'après-midi · **dix-huit heures, la golden hour** · le crépuscule · la soirée ·
la nuit qui vient. Chacune dit aussi **ce qu'on y fait un jour de mariage** :
« six heures — la lumière qui monte, et le lieu qui se découvre », « onze heures
— on s'habille, et le téléphone se tait », « quatorze heures — la cérémonie
commence », « vingt-deux heures — la piste, et la première danse ».

**Les huit rubriques font trois fois le tour de la journée** (8 × 3 = 24) : la
matière reste la même, mais ce n'est plus la même page — **la lumière a changé, et
ce qu'on fait à six heures n'est pas ce qu'on fait à dix-huit**. Le nombre de
pages ne bouge pas : c'est la règle du §39, tenue. La page d'ouverture (minuit)
dit **le temps qu'il fait**, la météo des moyennes du passé, la lune, la porte,
l'interstice ; la page de onze heures reçoit **le chiffre du jour** et le signe.

**Le temps universel, comme culture.** Le magazine ne dit pas seulement l'heure :
il apprend **ce que chaque heure est** — l'aube, le midi, la golden hour, la nuit
— ce que tout le monde traverse sans jamais le regarder. C'est de la culture
utile, et c'est aussi un programme : les vingt-quatre pages **sont** la journée
d'un Jour J, heure par heure.

**Le SUPER SAINT du jour — l'architecte.** Chaque jour a son prénom : c'est lui
qui compose. **AGENT SAINT-MATTHIEU**, **AGENT SAINT-SYLVESTRE** le 31 décembre
(le jour de trop a le sien aussi). Il ne fait pas de bruit : il **regarde** (le
ciel du jour, la lune, le jour de la semaine, le pas-de-temps) puis il **décide
quels SUPER HÉROS travaillent aujourd'hui** — la météo s'il pleut, la santé s'il
gèle ou s'il fait chaud, le chronomètre le samedi, le semeur au printemps,
l'archiviste à l'automne, le veilleur en hiver, la boussole les jours de porte et
d'interstice. Chacun est choisi **en le disant** : *pourquoi lui, aujourd'hui*.

**Le fil rouge, et l'action parfaite.** L'histoire japonaise du fil rouge relie
deux personnes ; ici, il relie **les jours**. `filRougeDuJour()` donne **le fil**
— ce qui passe d'aujourd'hui à demain — et **l'action parfaite** : **une seule
chose**, celle qui compte aujourd'hui. « Lundi : ouvrir une chose — une liste, un
appel, une porte. » « Dimanche : ne rien faire, et le faire bien. » C'est le
Chemin : jour après jour, le fil se déroule, et l'on n'a jamais qu'une chose à
faire.

**Dans la page.** Cliquer la couverture du flux **ouvre le magazine du jour** —
aux **vingt-quatre heures**, et sur l'heure qu'il est (au clic : `heureCourante()`)
— puis on glisse d'une heure à l'autre, exactement comme on glisse d'un jour à
l'autre. Le même geste, une couche plus bas : **on glisse dans les jours, on
ouvre le jour, on glisse dans les heures**. Sous les heures, l'architecte et ses
héros, le fil rouge et l'action parfaite.

**Le studio, première planche.** `public/images/studio/planche-{printemps,ete,automne,hiver}.jpg`
— quatre portraits de studio, **fond blanc** avec ombre portée pour les trois
premières saisons, **fond noir** à lumière dure pour l'hiver. C'est la **direction
artistique** des 364 : le rendu (`PortraitStudio.tsx`) tient la place de chaque
jour, et les photographies réelles prennent la suite, **planche après planche**,
sans que rien d'autre change.

**Contrôles.** `npx tsc -b` 0, eslint 0, `npm test` 178 / 55 / **720** (les
vingt-quatre heures qui se suivent, chacune avec sa lumière et son moment, la
golden hour à dix-huit heures ; les huit rubriques trois fois dans l'ordre ; les
vrais textes sur toutes les pages et pour les 54 numéros ; la page d'ouverture
qui dit le temps qu'il fait ; le super saint nommé d'après le calendrier, avec
ses héros et son pourquoi ; le fil rouge qui relie le jour, et l'action parfaite
qui reste une seule chose ; le bouton qui ouvre le magazine du jour et la phrase
qui le dit), `npm run build` OK.

---

## §42 — Le socle : la charte, la mise en lumière, et l'alignement

**Ce qu'on construit ici est le socle.** Rien de ce qui suit ne tient sans lui :
un **calendrier** (364 prénoms, §40), **une journée** (24 heures, §41), **des
règles** (§42), et **une lumière** qui dit qui l'on voit.

**La charte** (`src/lib/charte.ts`) : huit règles écrites une fois, **vérifiées**,
et qui valent pour le site, pour le magazine **et pour les portraits** que les
gens envoient — fond uni par saison, création au centre et rien dessus, marque en
haut / titre au centre / date en bas, **24 pages, une par heure**, portrait de
studio (fond blanc, fond noir les jours qui ne sont pas comme les autres),
**mêmes choix = même édition**, **chaque page dit sa source**, et un cadre
constant (page 1180, lecture 820, trois tailles de titre). C'est le **prix
d'entrée** : c'est parce que la règle est tenue que des inconnus peuvent se
suivre dans les mêmes pages.

**Signé : l'éditeur.** `SIGNATURE_EDITEUR` et `QUI_EDITE` — « Mille mariages,
jamais marié, pas d'enfants : ce magazine tient ce qu'il a vu. » La crédibilité,
ici, ne vient pas de ce qu'on a vécu : elle vient de **ce qu'on a vu**, et de ce
qu'on sait refaire. Le nom reste **à donner** (constante à nommer).

**La mise en lumière** (`src/lib/miseEnLumiere.ts`) : **six paliers**, et l'on ne
saute aucune marche — 1 *le prénom* → 2 *le portrait* (conforme) → 3 *la date* →
4 *le lieu* → 5 *le rôle et l'univers* → 6 *la mise en lumière*. **Le portrait
conforme est la première marche** : sans lui, on n'est pas montrable, donc on ne
monte pas. `pourMonter` dit **ce qui manque**, en deux mots ; `opportunites` dit
**ce que la lumière ouvre**, et la liste s'allonge avec le palier (être vu,
recevoir des propositions quand la date et le lieu se répondent, entrer dans la
composition des magazines du jour, **passer en couverture le jour de sa fête**).

**Le jour de votre fête, la couverture est la vôtre.** `feteDuPrenom()` retrouve
le prénom dans les 364 jours du calendrier (sans accents, sans casse) : « Élodie »
et « elodie » tombent le 22 octobre, « Augustin » revient **deux fois** dans
l'année. `joursDuPrenom()` les liste. Quand le jour tombe, `enCouvertureAujourdHui`
passe à vrai : **votre portrait passe en couverture, avec les personnes alignées
autour de vous selon vos informations** — et le même jour, ailleurs, d'autres
fêtent le même prénom : `alignesAutour()` retrouve ceux du même nom et du même
lieu. **L'alignement est spatio-temporel, et il traverse le monde.**

**La gamification, et ce qu'elle fait.** Elle n'humilie personne : elle **élève**.
On monte en **donnant** (un portrait, une date, un lieu, un rôle, un inédit), et
ce qu'on donne profite aux autres — un inconnu du même jour, un mariage du même
lieu, un métier qui cherche exactement ce qu'on sait faire. C'est le même
mécanisme qu'une page qu'on développe : **plus on se montre, plus on est vu**, et
plus on a d'opportunités.

**Dans la page.** Sur `/magazine`, sous les éditions, la section **« Se montrer,
et élever les autres »** : les six paliers, le palier où l'on est, ce qui manque
pour monter, le jour de sa fête, les opportunités — et **la charte**, en clair,
signée. Le bloc est un composant (`MiseEnLumiere.tsx`) : il prendra le profil réel
dès que le profil sera branché.

**Ce qui reste, et qui vient après.** La **proximité géographique** (le lieu, la
date : les propositions à côté), les **données d'actions** (ce qu'on a coché,
aimé, composé, qui entre dans *son* magazine et pas dans un autre), et **le profil
réel** branché sur la mise en lumière. Chaque mariage aura sa date : le socle est
calculé pour ça — il ne dépend que d'une date, d'un lieu, d'un prénom et d'un
portrait.

**Contrôles.** `npx tsc -b` 0, eslint 0, `npm test` 178 / 55 / **742** (la charte
tenue en règles écrites, chacune avec son pourquoi, signée ; six paliers, six
marches sans saut ; le profil vide au premier, le portrait conforme qui ouvre le
deuxième, le profil complet au sixième ; la fête déduite du prénom, avec et sans
accents, les prénoms qui reviennent deux fois, et ceux qui ne sont pas au
calendrier ; la couverture le jour de sa fête, et seulement ce jour-là ; les
opportunités qui s'allongent avec le palier ; le bloc qui se rend), `npm run
build` OK.

---

## §43 — Le monde Aime : la signature, le SUPER JOURNAL, et l'agent

**La signature.** Le magazine n'est plus signé « L'ÉDITEUR » : il est signé par le
**FONDATEUR ET CRÉATEUR D'AIME®** et par l'**Association Le Monde Aime**
(`src/lib/charte.ts` : `SIGNATURE_EDITEUR`, `ASSOCIATION`, `QUI_EDITE`). La
crédibilité ne vient pas de ce qu'on a vécu : elle vient de **ce qu'on a vu**, et
de ce qu'on sait refaire.

**Le SUPER JOURNAL — la même architecture pour tout le monde.** Le magazine du
jour est public ; le journal, lui, est **à soi** — et pourtant il a **exactement
la même architecture** pour tous (`src/lib/journal.ts`, `SECTIONS`) : la
couverture (le portrait de studio, le jour de la fête, le numéro), le sommaire,
l'édito, **le jeu de cartes** (une photo par semaine qui devient la face de la
carte), les notes, l'agenda, le mood, les rêves, les liens et les fichiers, la
mémoire, la signature. **Le moindre bloc à la bonne place** : c'est ce qui permet
de lire le journal de quelqu'un qu'on ne connaît pas, et de s'y retrouver.

**JUMO, l'agent de la personne.** Le saint de son propre magazine : il connaît
tout de celui qui écrit, il **retient**, et il **propose**. `ceQueJumoRetiendrait()`
lit ce qu'on lui donne et **range** — un rêve va dans les rêves et reste privé,
un lien va dans les liens, une disponibilité va dans l'agenda et se propose au
cercle, un mood va dans le mood, une photo peut devenir la face de la carte de la
semaine, le reste va dans les notes. **Il n'écrit jamais à la place de la
personne : il propose, elle valide** (`valider()`).

**La confidentialité, choisie, jamais subie** : **public** (tout le monde — le
journal d'une personne se lit comme un magazine), **le cercle** (ceux qui sont
alignés : le même jour, le même lieu, le même rôle), **privé** (soi seul et Jumo).
**Le défaut est privé**, et rien ne devient public tout seul (`pagesPubliques()`).
La leçon des produits qui ont appris à la place des gens : un journal qu'on n'a
pas choisi de publier n'est pas un journal, c'est une fuite.

**L'app GIGI, et ce qu'on en retient.** Gigi (Clara Gold, 2024) était une
application de rencontre dont l'intelligence artificielle servait d'**entremetteuse** :
elle apprenait le contexte de la personne pour proposer des rencontres. En 2025,
la fondatrice a **arrêté le dating** et rebasculé le produit vers la mise en
relation professionnelle ; l'application de rencontre a disparu **sans annonce
formelle**, ses utilisateurs sans explication. Deux leçons, tenues ici :
1. **un agent qui apprend le contexte vaut mieux qu'un agent qui vend des gens** —
   chez nous, Jumo apprend pour **la personne elle-même**, pas pour la faire
   matcher ;
2. **ce qui se ferme doit se dire** — et ce qui se publie doit se valider. La
   confidentialité par défaut, et la validation explicite, sont la réponse
   directe à cette histoire.

**SUPER SECRET** — la page où l'on parle à l'agent de tout et de rien (des infos,
des fichiers, des liens, des moods, des confidences, des rêves) : elle garde en
mémoire, apprend un peu à la fois, et **reconnaît ce qui pourrait être noté dans
le journal**. Ce qui en sort a l'architecture du SUPER JOURNAL, et porte la cible
de confidentialité que la personne a choisie. *(Le module de rangement et de
validation est écrit et testé ; la page elle-même est le chantier suivant.)*

**La page profil — le hero enchaîné.** Le hero d'une personne sera **la suite
ordonnée de ses univers**, avec **les cartes associées aux cartes qu'elle a
sélectionnées sur l'accueil** : chaque carte retenue entre dans son hero **dans
l'ordre**, avec son visuel et sa carte de jeu. Sous le hero, **son manifeste**
(déjà écrit), puis **sa section Univers**, suite de ses choix. Et dans la section
**L'ÉDITEUR**, les **appareils** — ordinateur, iPad, iPhone — signalent **sur
quoi la personne est connectée et ce qu'elle possède** : téléphone ou pas, tablette
ou pas, donc **adresse fixe ou mobile**, ce qui dit beaucoup (et sert d'abord à
**garantir l'affichage**, puis à faire **miroir** : disponibilités, rythme,
présence). *(Chantier suivant, avec le branchement du profil réel.)*

**Contrôles.** `npx tsc -b` 0, eslint 0, `npm test` 178 / 55 / **759** (la
signature du fondateur et de l'association ; les sections du journal dans l'ordre,
chacune disant ce qu'elle contient ; les trois cibles de confidentialité et le
défaut privé ; le rangement de Jumo — rêve, lien, disponibilité, mood, photo,
notes — ; rien de public sans validation, et la publication quand la personne
valide), `npm run build` OK.

---

## §44 — Le hero enchaîné : les cartes de la personne, dans son ordre

**L'accueil ne demande pas qui on est : il pose des cartes, et on choisit.** Ce
qui manquait, c'était **la mémoire de ce choix**. Elle est là (`src/lib/selection.ts`,
clé `vows:selection`) : chaque carte **cliquée** sur l'accueil — un rôle du
premier niveau, un univers du second — entre dans la sélection **à la fin**, une
seule fois. L'ordre est **celui des clics**, et il ne bouge que si la personne le
bouge (`deplacerCarte`, `retirerCarte`, `viderSelection`) ; la sélection est un
**paquet de 54 cartes**, pas plus (`CARTES_MAX`). Le défilé automatique de
l'accueil, lui, ne retient rien : **seul un clic est un choix** (d'où le
`onCarteChoisie` posé sur l'hero des univers, à côté de son `onChoisir`).

**Le hero de la personne, c'est l'enchaînement** (`src/components/HeroEnchaine.tsx`) :
les visuels de ses cartes traversent l'écran comme partout sur le site
(`HeroCycle`, une carte toutes les 5,6 s, en silence si l'appareil préfère les
mouvements réduits, en pause dès qu'un morceau joue), le titre de la carte du
moment s'écrit sous son nom, et **les cartes associées** sont posées dans le
hero, en bande — un clic saute à la carte voulue, le play ouvre son morceau. Les
**flèches du dock mènent l'enchaînement** (`bandeId = 'enchainement'`), comme
elles mènent les rôles sur l'accueil et les univers sous le manifeste.

**La page d'une personne se lit maintenant dans cet ordre** : son **hero
enchaîné**, **son manifeste** (le même texte que l'accueil, vu de sa place : sa
porte, ses cartes retenues, les trois temps — rien n'est réinventé,
`manifesteDeLaPersonne`), **ses univers** (`UniversDeLaPersonne`) — la suite de
ses clics, chaque univers avec ses cartes associées, ses deux flèches d'ordre,
et ses rôles en bande — puis son **timbre**, ses mariages, sa carte en entier.

**Deux garde-fous.** (1) **Il y a toujours un hero** : sans un seul clic,
`enchainementDeSecours` montre l'univers de son mariage. (2) **La page existe
avant d'être publiée** : si rien n'est en ligne mais qu'une **carte locale**
existe sur cet appareil (ou seulement une sélection), la page s'ouvre quand
même — personne montée par `personneDeLaCarte`, et un mot honnête sous le hero :
« Brouillon — cette carte n'est pas encore publiée ».

**Contrôles.** `npx tsc -b` 0, eslint 0, `npm test` **178 / 55 / 805**, `npm run
build` OK. Les vérifications de la passe : la sélection dans l'ordre, le paquet
de 54, le déplacement et le retrait, l'enchaînement et ses visuels, le repli,
le groupement des univers avec leurs cartes, les rôles en cartes, le manifeste
de la personne (porte, cartes retenues, trois temps repris mot pour mot,
signature), le rendu du hero (le nom, « 1 / 3 », la carte du moment, les cartes
associées) et celui des deux sections.

**Ce qui reste, dans l'ordre annoncé** : le **SUPER JOURNAL** (la page qui se
remplit et se valide), puis **l'agent Jumo** (le rangement, déjà écrit), quand
la structure sera parfaite. Ensuite : les **appareils** (ordinateur, iPad,
iPhone — ce que la personne possède, et sur quoi elle est connectée), la
**proximité géographique**, les statistiques, et le branchement du profil réel
sur la mise en lumière.

**Précision (§44).** La page existe aussi **quand seuls les clics existent** :
sans carte remplie, mais avec une sélection, la page s'ouvre tout de même — la
carte vide tient la place, le hero tient l'enchaînement, et le mot « brouillon »
reste là jusqu'à la publication.

---

## §45 — Le chiffre : la tradition, sa règle, et ses limites

**Le site calculait déjà un chiffre pour le jour.** `clesDuJour` en tire un de la
date, et `SENS_DES_CHIFFRES` en donne les neuf sens. `src/lib/chiffre.ts` fait le
**même geste pour une personne** : sa date de naissance et son nom donnent un
nombre — **le chiffre de la personne** — quand le premier est **le chiffre du
jour**, et le troisième **le chiffre du mariage**. Un mot, trois échelles.

**Ce qui est calculé** : le **chemin de vie** (date complète), le **nombre
d'expression** (toutes les lettres du nom), le **nombre intime** (les voyelles),
le **nombre de personnalité** (les consonnes), l'**année personnelle** (la seule
qui bouge), et **le chiffre à deux** — qui ne donne **jamais** de verdict.

**Trois règles, écrites dans le module, et tenues par les tests :**

1. **Le chiffre dit sa règle.** `laRegle()` rend la règle entière : système
   **pythagoricien**, **alphabet latin sans accents** (É=E, Ç=C, Œ=OE), **nom de
   naissance**, méthode **par composant** (jour, mois, année réduits séparément —
   c'est celle qui laisse voir un maître au passage : un 29 donne 11, et l'on
   garde le 11), et **11, 22 et 33 jamais réduits**. L'affichage montre le calcul
   pas à pas (`Detail.pas`) et la règle sur un clic.
2. **Le chiffre ne juge personne.** Neuf familles (`MOTS`), **les mêmes pour tout
   le monde** ; pour les maîtres, la même phrase : *ce n'est pas mieux que deux,
   c'est le même avec ses deux chiffres visibles*. Aucun mot ne contient
   compatibilité, karma, dette, supériorité, prédiction — **le test le vérifie
   littéralement**.
3. **Il est facultatif, et privé par défaut.** `vows:chiffre` reste vide si l'on
   ne donne rien (« une case vide n'est pas une donnée »), la cible retombe
   toujours sur `prive`, et **la personne peut effacer** — le bouton est là.

**La règle du Y, écrite parce qu'elle est discutable** : il sonne « i », donc il
compte comme **voyelle** (« Yves »), sauf quand il ouvre un mot devant une
voyelle — « Yann », « yoga » — où il sonne consonne. La règle est dans le code,
donc elle peut être discutée : c'est exactement ce qu'on veut.

**Le chiffre à deux** (`chiffreAdeux`) : on montre **les deux chiffres**, et leur
somme **seulement si les deux l'ont donné**. Sans les deux dates, il n'y a pas de
somme — et jamais de « compatibilité ».

**Le droit, vérifié** (et c'est ce qui a guidé les textes) : la voyance n'est pas
une profession réglementée en France, mais elle est soumise au Code de la
consommation — **interdiction des pratiques commerciales trompeuses** (L121-1,
L121-8, jusqu'à 300 000 € et 2 ans d'emprisonnement), et la Cour de cassation a
rappelé en 2020 que **le caractère divinatoire n'exonère pas des obligations
d'information et de loyauté**. La DGCCRF contrôle, et le secteur lui-même
recommande de rappeler le caractère ludique et non scientifique, et de ne jamais
prédire la santé. `LeChiffre.tsx` écrit donc, sur la page : *« Il ne compare
personne », « ni dette, ni mieux, ni moins bien », « il ne prédit rien, et jamais
la santé »*.

**La neuvième règle de la charte** : *le chiffre dit sa règle, ne juge personne,
et ne se demande qu'à qui veut bien le donner* — « un repère qui s'explique reste
un repère ; un repère qui se tait devient une croyance ».

**Où il vit** : `LeChiffre.tsx` sur `/magazine`, entre les éditions et la mise en
lumière. Il se branchera ensuite sur la carte (le nom, le prénom) et sur le
profil — `people.card` étant un `jsonb`, **aucune migration n'est nécessaire**.

**Contrôles.** `npx tsc -b` 0, eslint 0, `npm test` **178 / 55 / 854**, `npm run
build` OK. Les vérifications de la passe : les valeurs des lettres, les accents et
les ligatures, la réduction et les maîtres, les deux méthodes, la règle du Y, les
quatre nombres, l'année personnelle, le chiffre à deux, les neuf familles et les
trois maîtres, **l'absence de tout mot qui juge**, la règle dite, le stockage
(vide → rien, donné → relu, cible inconnue → privé, effaçable), et le rendu du
bloc (le chiffre, ses mots, le calcul sur demande, ce qu'il ne fera jamais).

---

## §46 — Le temps commun, et sa place : tout en bas du footer

**Ce qui manquait, en une phrase** : chaque brique du site datait ses choses dans
son coin — la sélection son `choisiLe`, les annonces leur `quand`, les documents
leur `savedAt` — et **aucune ne parlait à l'autre**. `src/lib/temps.ts` règle ça :
**tous les gestes écrivent au même endroit**, une ligne chacun, sous `vows:temps` :
**qui, quoi, quand, où**. On ne modifie jamais une ligne, on en ajoute une — c'est
ce qui permet de **rejouer** un jour, un mois, une année.

**Huit familles de gestes** (`GESTES`), chacune avec son mot et son sens :
une carte retenue, le chiffre, le journal, un document, une annonce, un avis, le
magazine, la carte. Une famille inconnue ne rend rien : le temps n'invente pas de
gestes.

**Deux briques écrivent déjà au temps, sans qu'on ait rien à rebrancher** :
`choisirCarte` / `viderSelection` (la sélection) et `enregistrerChiffre` /
`effacerChiffre` (le chiffre). Le temps **n'est pas un registre d'état civil** : la
ligne du chiffre dit *« Chiffre posé, avec la date de naissance »* — **jamais la
date elle-même**.

**Le plafond** : `LIGNES_MAX = 2000`. Le temps ne grossit pas sans fin ; ce qui
dépasse est taillé, et le plus récent reste.

**La lecture** : `lignesDuJour`, `lignesDeLAnnee`, `moisDeLAnnee` (l'année en
douze parts, première lecture du cadran), `anneesDuTemps`, `resumeDuTemps` (le
total, le premier, le dernier, la famille la plus active), et l'écriture courte
d'une heure (`14 h 05`), d'une date, d'un jour (`20.09`).

**`LeTemps.tsx` — tout en bas du SUPER FOOTER.** Trois échelles : **aujourd'hui**
(ce qui vient de se passer, avec son heure), **l'année en douze parts** (la
première lecture du cadran : l'angle pour le jour, le rayon pour ce qui s'est
passé), et **depuis le début** (les années, et leurs gestes). Le bloc dit son
état — *« N gestes, depuis le … , le plus souvent : … »* — et il **ouvre la
timeline complète** (`/timeline`), qui existait déjà et **n'était branchée nulle
part** : c'est la première fois que la page du défilé a une porte d'entrée.

**Contrôles.** `npx tsc -b` 0, eslint 0, `npm test` **178 / 55 / 892**, `npm run
build` OK. Les vérifications de la passe : le temps vide, les familles, une
famille inconnue, une ligne écrite et datée, le plus récent en tête, les filtres
du jour et de l'année, les douze mois et leur compte, les années ordonnées, le
résumé, l'heure, la date et le jour courts, **le plafond** (on écrit au-delà,
puis ça se taille en gardant le plus récent), **l'écriture par la sélection et
par le chiffre**, le bloc rendu (les lignes, les familles, les douze mois, le
lien), le bloc vide qui dit ce qui l'écrira, et **le footer qui porte le temps
désormais**.

## §47 — Les 365 couvertures : voir enfin le magazine, et trois boutons qui se ressemblent

**Ce qui manquait, en une phrase** : le magazine était **écrit** — 24 pages, un
jour une heure, un saint, une carte, une météo, une lumière — mais il ne se
**voyait** nulle part. On pouvait en parler, pas le regarder. `src/lib/
couvertureDuJour.ts` et `CouvertureJour.tsx` règlent ça : **une couverture par
jour de l'année**, dessinée, **le même dessin pour tout le monde le même jour**,
et **le même dessin à chaque fois qu'on la regarde**.

**Jamais de hasard qui change.** `graine(texte)` (FNV-1a) et `tirage(graine, rang)`
donnent des nombres **stables** : la couverture du 14 juin 2026 est la même
aujourd'hui qu'en 2030, et deux jours différents ne se ressemblent pas. C'est ce
qui permet de **décider sur du vrai** au lieu de discuter sur une idée.

**Ce qu'une couverture porte** (`couvertureDuJour(date)`) : son `id`
(`2026-09-21`), son `numero` (le jour dans l'année), son **`titre`** — le nom du
saint, ou la fête, ou **« Le jour de trop — Sylvestre »** le 31 décembre, et
**« Le jour de trop »** le 29 février, qui n'a pas de prénom —, sa `saison` (le
fond, l'encre et le symbole du jeu de 54), sa `figure` (`carteDuNumero`), son
`fond`, sa `raison` quand elle n'est pas comme les autres, ses `cles` (le ciel,
la lune, le chiffre, la porte, l'interstice, le signe caché) et ses `branches`.

**Vingt-quatre branches, pour vingt-quatre heures.** Une couverture n'est pas une
photo, c'est un **cadran** : chaque branche est une heure du magazine, avec sa
longueur et son éclat. `HEURES_DE_LUMIERE` marque les huit heures plus franches
(cinq, six, sept, midi, treize, dix-huit, dix-neuf, vingt) : la lumière de la
journée se lit d'un coup d'œil.

**Le fond noir — `FOND_NOIR` `#0B0B0F`.** Un jour « pas comme les autres » passe
au noir : le **studio du jour** décide (le jour de trop, le dimanche, un temps
clos, la porte), et la couverture **dit pourquoi**. En 2026 : **136 jours sur
365**, dont les 52 dimanches. Le rythme se voit au kiosque, sans qu'on ait rien à
expliquer.

**Rien sur la création.** La couverture dit le jour, la saison et la lumière —
**jamais ce que la personne a fait ce jour-là**. Elle est publique sans rien
livrer.

**`CouvertureJour.tsx`** : un SVG `0 0 100 140`, sans dépendance — la marque
`AIME MAGAZINE`, le numéro et la semaine, le cadran au centre, le titre, la date
écrite en bas, quatre clés. L'image **dit ce qu'elle est** pour qui ne la voit
pas (`aria-label`), et la variante `vignette` enlève les détails dans une grille.

**`GalerieCouvertures.tsx` — le kiosque.** Les **douze mois**, les filtres
(quatre saisons, jours noirs), la grille, le compte de ce qui est affiché, et
**la porte vers l'univers** de la couverture. Il est posé dans `/magazine`,
**juste avant `Le chiffre`** : on regarde l'année, puis on lit le jour.

**Trois correctifs de la même passe.** Le bouton des paramètres (en bas à
gauche) devient un **picto seul**, `h-11 w-11`, comme le bouton d'état : deux
boutons qui se ressemblent parce qu'ils font la même chose. Dans la nav
verticale, **Shop et Magazine prennent le dessin commun** — plus de rond blanc,
qui donnait l'impression d'être **sélectionnés** alors qu'ils ne l'étaient pas.
Et `SiteFooter.tsx` donne **un pied commun à tout le site** : la marque, la
signature (`SIGNATURE_EDITEUR`, `ASSOCIATION`) et les portes de sortie. Les pages
intimes — le site des mariés, l'invitation, les éditeurs, l'atelier — **n'en ont
pas** : on y entre pour faire, pas pour visiter.

**Contrôles.** `npx tsc -b` 0, eslint 0, `npm test` **178 / 55 / 933**, `npm run
build` OK. Les vérifications de la passe : une couverture par jour (**365 en
2026, 366 en 2028**), l'identifiant, les 24 branches et leurs longueurs, les
heures de lumière marquées, les quatre saisons et leurs quatre fonds, les jours
noirs et leur raison, le titre, la figure, la date écrite, le numéro, les clés,
le 31 décembre et le 29 février, la stabilité de la graine et la différence entre
deux jours, les mois entiers, la couverture rendue (la marque, le fond, le nom,
la date, le cadran, ce que l'image dit), la vignette, le kiosque (son titre, ses
douze mois, ses saisons, son compte), **et le pied commun** (la barre qui ne se
double pas sur l'accueil, le pied sur toutes les pages, la signature et les
portes).

## §48 — Les 365 profils éditoriaux : la personne qui ouvre le jour

**L'idée, en une phrase.** La couverture ne dit plus seulement *quel jour* on est :
elle dit **qui ouvre le jour**. Chaque date a une personne, et cette personne a
une fiche — origine, époque, lieu, métier, savoir-faire, culture —, puis des
**ponts vers le mariage**. Ce n'est pas une illustration posée sur une couverture :
c'est une **porte d'entrée éditoriale**, et c'est ce qui fera qu'un mini-site, une
carte ou une recherche n'auront plus à reposer la même question.

```
DATE → SAINT / PRÉNOM → PERSONNAGE → ORIGINE → ÉPOQUE → LIEU
     → MÉTIER → SAVOIR-FAIRE → CULTURE → MARIAGE
```

**La règle stricte — dixième règle de la charte.** *« Un fait se cite, une
interprétation se signe : les deux ne se mélangent jamais. »* Chaque pont porte
donc **son niveau**, et le niveau s'écrit à côté du pont :

| Niveau | Ce que ça veut dire | Exemple |
| --- | --- | --- |
| `directe` | documentée : la personne est liée à la chose | Éloi, orfèvre → **les alliances** |
| `culturelle` | documentée, mais plus large | Sax → **le jazz**, Patrick → **l'Irlande** |
| `editoriale` | une association créative, **assumée** | Matthieu, percepteur → **les comptes du budget** |
| `inspiration` | une création : on imagine, on ne raconte pas | « un grand livre ouvert à la place du livre d'or » |

**Ce que ces personnes ne sont pas.** Ce ne sont **pas des inscrits** : ce sont
les personnages du magazine. Aucun profil ne se présente comme un utilisateur du
site — c'est écrit dans le bloc, et vérifié.

**Ce qui est construit.** `src/lib/profilsEditoriaux.ts` : seize journées ont leur
fiche documentée (Valentin, Patrick, Honoré, Jean-Baptiste, Véronique, Marthe,
Fiacre, Matthieu, Côme et Damien, Luc, Adolphe Sax, Cécile, Éloi, Barbe, Nicolas,
Noël), chacune avec sa source citée et ses ponts. Un jour sans fiche **le dit** :
il garde son nom du calendrier, sa couverture et sa lumière, et **rien d'autre
n'est écrit**. `ProfilEditorial.tsx` pose le bloc dans `/magazine`, juste après le
kiosque : la fiche, les ponts par niveau, la source, la règle.

**Le titre de la couverture suit le personnage.** Le 21 septembre, Matthieu est
le saint du jour : la couverture dit *« Saint Matthieu »*. Le 6 novembre, le
personnage est Adolphe Sax : la couverture dit **« Adolphe Sax »**, et la Sainte
Bertille, qui est la fête du calendrier, **reste écrite dessous** — *« en ce jour
de Sainte Bertille »*. Le calendrier ne se perd pas : il passe au second plan.

**`chercherProfils(mots)` — le début du moteur.** Tous les mots doivent se
retrouver dans le profil (nom, fiche, ponts, index) : la recherche ne peut donc
pas inventer un résultat. *« saxophone »* → Adolphe Sax ; *« alliances »* → Éloi ;
*« musique »* → Sax, Cécile et Jean-Baptiste ; *« japon »* → **rien**, et c'est le
but. C'est le germe de ce qui, plus tard, composera une édition sur mesure à
partir du monde réel.

**Ce qui reste ouvert.** Les 349 fiches à documenter (une par une, avec source) ;
la page publique du personnage (`aime.fr/matthieu`, ou la date) ; l'index du
graphe (lieux, objets, savoir-faire, traditions, logistique) ; et la piste
artistique des couvertures — voir les trois études illustrées.

**Contrôles.** `npx tsc -b` 0, eslint 0, `npm test` **178 / 55 / 989**, `npm run
build` OK. Les vérifications de la passe : les quatre niveaux et leur sens, les
seize fiches, la source de chacune, au moins trois ponts par fiche, les quatre
niveaux réellement servis, les clés de date, les personnages du 14 février, du
21 septembre, du 6 novembre, du 1ᵉʳ et du 25 décembre, la fiche de Matthieu et ses
quatre ponts, les alliances d'Éloi, le brevet de Sax, le jour sans fiche, la
recherche (dont le résultat vide), le rangement des ponts par niveau, le titre de
couverture mené par le personnage, et le bloc rendu — règle, avertissement, source,
et **aucun astérisque affiché**.

## §49 — Les six temps du jour, et la chaîne qui va de la carte au contenu

**L'idée, en une phrase.** Une journée de mariage ne se lit pas heure par heure :
elle se lit en **temps**. `src/lib/moments.ts` en fixe **six** — cinq pour le
jour, et la nuit, qui est la queue de la veille :

```
LA NUIT       0 h → 4 h    ce qui se dit à voix basse
L’AUBE        5 h → 7 h    la lumière qui monte, le lieu qui se découvre
LE MATIN      8 h → 11 h   on dresse, on répète, on s’habille
LE MIDI      12 h → 13 h   le plein jour, le dernier moment tranquille
L’APRÈS-MIDI 14 h → 17 h   la cérémonie, les vœux, le verre
LE SOIR      18 h → 23 h   la golden hour, la table, la piste
```

Six temps, **vingt-quatre heures** : les bornes se suivent sans trou et sans
recouvrement, et c'est vérifié.

**La couverture ne change pas de dessin : elle s'éclaire autrement.**
`couvertureDeLaPart(date, part)` reprend la couverture du jour et n'allume que
**les branches du temps qu'on regarde**. Le fond, le titre, la carte et la date ne
bougent pas — c'est la règle *« la création est au centre, rien ne passe dessus »*
tenue autrement : le cadran se lit maintenant à l'heure qu'il est, et l'on passe
d'un temps à l'autre sans perdre le jour.

**`MomentsDuJour.tsx`** pose le bloc dans `/magazine`, après le profil du jour :
les six couvertures côte à côte, celle de l'heure marquée **« maintenant »**,
chacune avec ses bornes, son nombre de pages, ce qui s'y passe, et **la page que
l'édition lui consacre**. Et la règle éditoriale est écrite en haut, en trois
questions : **QUI** ouvre le numéro (le personnage), **QUAND** on le regarde (le
temps, l'heure), **QUOI** s'y passe (la page de cette heure).

**Le bouton magique.** Sous les six temps : *« Créer ce mariage »* (`/creer`).
Ce qu'on vient de regarder devient la première matière du projet — on ne repart
pas de zéro.

**La chaîne du monde** — `src/lib/chaineDuMonde.ts`. Elle n'ajoute rien : elle
**enchaîne ce qui existait déjà**, et chaque maillon dit sa question, où il vit, et
combien il y en a :

```
LA CARTE (54) → LA PERSONNE → LE RÔLE → LE MARIAGE
→ LE JOUR (365) → LE MOMENT (6) → L’HEURE (24) → LE CONTENU
```

Les nombres sont **vérifiés contre la brique qui les porte** (le jeu de 54, les 365
couvertures de l'année, les six temps, les vingt-quatre heures de l'édition) : si
l'une bouge sans l'autre, le test casse. C'est ce qui permet à la timeline d'être
la colonne vertébrale — elle remonte la chaîne dans l'autre sens, du contenu à la
personne.

**Ce qui est décidé, et ce qui reste ouvert.** Acquis : **six temps** (et non cinq)
pour que les vingt-quatre heures soient toutes rangées ; **la couverture qui
s'éclaire** plutôt que cinq couvertures différentes ; **la note en tête de liste**
(une reprise se dit, elle ne se cache pas). Ouvert : les **1 825 scènes illustrées**
(365 × 5 interprétations, une par temps) — c'est le chiffre de la matière visuelle,
pas un plan de production ; les 349 fiches à documenter ; la page publique du
personnage ; l'index du graphe. Les illustrations, elles, se produisent **hors du
dépôt** (poids, stockage) : le dessin SVG est là pour les 365 jours, et
l'illustration vient là où elle est décidée.

**Contrôles.** `npx tsc -b` 0, eslint 0, `npm test` **178 / 55 / 1035**, `npm run
build` OK. Les vérifications de la passe : les six temps et leurs bornes (sans trou
ni recouvrement), les vingt-quatre heures rangées, le temps d'une heure (dont
l'heure hors bornes), les trois questions de la règle, la couverture lue à un
temps (vingt-quatre branches, seules celles du temps allumées, fond, titre et date
inchangés, longueurs inchangées), les six lumières différentes, le bloc rendu
(ses temps, ses bornes, le personnage, le bouton), et **la chaîne du monde**, avec
ses nombres vérifiés contre les briques qui les portent.

## §50 — Le noir redevient rare, et les 365 prompts maîtres sont engendrés

**Décision — le noir.** Il ne tombe plus que sur **trois cas**, et il veut dire
quelque chose : **le joker** (le jour n'appartient à aucune semaine), **le
dimanche** (on célèbre, la lumière tombe de côté) et **les portes de l'année**
(la lumière change). En 2026 : **63 jours sur 365**, dont 52 dimanches, 10 portes
et le joker. Le mois le plus noir n'en compte plus que huit.

**Les temps clos ne sont pas noirs : ils assombrissent leur saison.** Le carême,
l'avent et l'avant-carême — **73 jours** — gardent la couleur de leur saison,
plus dense, plus sourde, avec l'encre claire. `src/lib/couleurs.ts` en fait une
seule fonction — `assombrir(hex, taux)`, **bornée à 0,75** (au-delà, la saison ne
se reconnaît plus, et c'est exactement ce qu'on ne veut pas) ; `studioDuJour`
rend désormais `blanc`, `dense` ou `noir` ; `PortraitStudio` et la couverture
suivent, et le kiosque a **son filtre** (« Les temps clos »), à côté de « Les
jours noirs ».

**Le système de prompts — `src/lib/promptsVisuels.ts`.** La direction artistique
est **écrite une fois** (onze points : photographie éditoriale de mode, véritable
direction de casting, stylisme contemporain, mise en scène cinématographique,
aucun kitsch religieux, aucune représentation générique, pas de cartoon, pas de
cliché touristique…), avec **ses interdits** et **son cadre** (portrait 5:7,
85 mm, mi-corps). Chaque fiche produit un **prompt maître** en quatre blocs —
**IDENTITÉ** (ce qui est documenté, et sa source), **INTERPRÉTATION** (le
personnage contemporain, sa garde-robe, ses ponts, chacun avec son niveau),
**DIRECTION ARTISTIQUE** (la collection), **IDENTITÉ DU JOUR** (la date, la fête,
la saison et sa couleur, le moment) —, plus une **version courte** pour l'outil
d'image, et une **direction de casting** qui tient les cinq scènes : silhouette,
âge, garde-robe, **signes tenus**.

**Cinq images, une seule personne.** `MOMENTS_VISUELS` définit les cinq moments —
aube, matin, midi, après-midi, soir — chacun par sa lumière, sa posture, son
décor, son énergie, son stylisme et sa **narration**. La nuit n'a pas de scène :
c'est la queue de la veille, et la couverture y garde son dessin. `scenesDuPersonnage`
engendre les cinq prompts : le maître **plus** le moment — donc **le même
personnage cinq fois**, jamais cinq personnes.

**Le document de production.** `docs/prompts-maitres.md` est **engendré** par
`npm run prompts` : il ne s'écrit pas à la main, donc il ne diverge pas du site.
Il porte le tableau de production, la direction artistique, les cinq moments,
**les seize fiches prêtes** (fiche structurée, prompt maître, cinq scènes, version
courte) et **les 349 fiches à documenter**, avec ce qui manque à chacune.

**Une seule règle tient le tout** : *on n'illustre pas ce qu'on n'a pas
documenté*. Un jour sans fiche n'a **pas** de prompt — il a la liste de ce qui lui
manque. C'est ce qui empêche la série de se remplir d'associations inventées.

**Contrôles.** `npx tsc -b` 0, eslint 0, `npm test` **178 / 55 / 1220**, `npm run
prompts` reproductible. Les vérifications de la passe : les trois raisons du noir
et leur compte exact (52 / 10 / 1, et 63 en tout), les 73 jours assombris par
famille (27 / 28 / 18), l'encre claire des temps clos, `studioDuJour` sur les
trois fonds, les canaux et l'assombrissement d'une couleur (dont le taux borné et
l'écriture illisible), la direction artistique et ses interdits, le cadre, les
cinq moments (leurs champs, leur ordre, l'absence de la nuit), le prompt maître
d'un personnage (ses quatre blocs, la source, la signification, les ponts
nivelés, la direction de casting), les cinq scènes (le maître conservé, cinq
lumières, cinq narrations), le tableau de production (365 entrées, 16 prêtes,
80 scènes), les jours sans fiche, et **le profil qui dit désormais le sens du
prénom et ses cinq lumières**.

---

## §51 — Les 365 fiches de l'année : ce qui couvre l'année entière, et ce qui manque encore

**La demande.** « Documente tout, même toute l'année, au moins on sera tranquille —
puis après on aura plus qu'à mettre les visuels en fond. » Donc plus de travail par
passes de vingt journées : **les 365 journées sont décrites d'un coup**, avec, pour
chacune, tout ce qu'on sait déjà d'elle et **la liste nommée de ce qui lui manque**.

**Quatre sources, un seul assemblage.** Trois tables nouvelles et une fiche.

**Les prénoms** (`src/lib/prenoms.ts`) — la table des prénoms du calendrier et de
ce qu'ils veulent dire : **329 entrées**, écrites au format `Nom | sens.` Le sens
reste une phrase courte et **la source est citée** : *les dictionnaires de prénoms
courants*. `significationDe` cherche le nom, puis le premier mot (pour que
« Thomas d'Aquin » trouve Thomas), traverse les composés, et **renvoie `null` quand
le prénom n'est pas documenté — jamais une invention**. C'est une table, pas une
IA : elle ne devine rien.

**Les patronages** (`src/lib/patronages.ts`) — la tradition du métier : **54
entrées** `métier → saint → porte du mariage + ce qu'il apporte`. Cécile pour les
musiciens, Éloi pour les orfèvres, Honoré pour les boulangers, Fiacre pour les
jardiniers, Barbe pour les mineurs et les pompiers, Marthe pour les hôteliers,
Isidore pour les informaticiens, Matthieu pour les comptables : le métier entre
dans le mariage par **une porte concrète** — les alliances, le pain, les fleurs, la
musique, le feu d'artifice, le budget, le site. `patronagesDe` et `portesDuJour`
rendent la liste ; la table ne force jamais un métier sur un jour qui n'en a pas.

**Les profils éditoriaux** (`profilsEditoriaux.ts`) — sa **base de seize personnes
documentées** et ses `ADDENDA` (signification, inspirations, casting), avec les
fêtes **réalignées sur le calendrier du magazine** pour que la couverture dise bien
« en ce jour de… ». C'est la seule couche où une personne est **écrite** : origine,
époque, lieu, métier, savoir-faire, culture, ponts vers le mariage.

**La fiche** (`src/lib/fichesAnnee.ts`) — `ficheDuJour(date)` assemble tout :
fête du calendrier, personnage (le profil s'il existe, sinon la fête), `categorie`
(**personne | fete | joker**), saison, fond, `dense`, `pasCommeLesAutres` et **la
raison** du noir, carte, semaine, numéro, ciel, lune, chiffre, signification du
prénom, métiers, portes, puis — **seulement si la personne est documentée** —
origine, époque, lieu, historique, ponts, casting, inspirations, source. `etat` vaut
**`prete` | `amorcee` | `a-documenter`**, et `manquant` nomme explicitement les
champs absents.

**Le bilan, vérifié.** Sur 2026 : **16 fiches documentées, 330 amorcées, 19 sans
rien** — et les dix-neuf sans rien sont **toutes des fêtes** (jour de l'An,
Toussaint, Assomption, les armistices, Notre-Dame…). D'où **l'invariant** : *toute
journée qui porte un prénom a au moins le sens de ce prénom*. En tout : **346
étymologies, 29 métiers, 41 portes, 20 fêtes** ; aucune journée portant un prénom
n'est vide.

**Le document.** `npm run prompts` engendre **deux** documents, tous deux issus du
site et jamais écrits à la main : `docs/prompts-maitres.md` (la production visuelle)
et **`docs/fiches-de-l-annee.md`** — **6 537 lignes**, en **douze chapitres
mensuels**, journée par journée : ce qu'elle est, ce qu'elle porte, ce qui lui
manque. C'est l'état des lieux complet de l'année, lisible d'un bout à l'autre.

**À l'écran, rien n'est caché.** Un jour sans fiche documentée **n'est pas vide pour
autant** : le profil éditorial affiche désormais **ce que le prénom veut dire**
(avec sa source), **le métier tel que la tradition le donne**, **la porte qu'il
ouvre**, puis la phrase qui dit que rien d'autre n'est inventé et **la liste de ce
qui manque, nommé**. Le kiosque affiche l'état de la production : combien de
journées ont le sens de leur prénom, combien de fiches sont documentées.

**La règle de la maison, encore.** *On n'illustre pas ce qu'on n'a pas documenté, et
on n'écrit pas ce qu'on n'a pas vérifié.* Une journée sans source n'a pas de prompt
maître : elle a la liste de ce qui lui manque. Les seize documentées sont la tête de
pont ; les autres journées deviendront « prêtes » une par une, quand origine,
époque, lieu, métier, savoir-faire et culture seront écrits — mai, juin, juillet et
septembre en premier. **Ensuite seulement**, on remplace le fond des couvertures par
les visuels, sans toucher à la mise en page.

**Contrôles.** `npx tsc -b` 0, eslint 0 sur les fichiers touchés, `npm run prompts`
reproductible (deux documents, mêmes comptes), `npm test` **178 / 55 / 1220**,
`npx vite build` OK. Les vérifications ajoutées couvrent : le sens des prénoms (une
phrase, jamais vide, jamais inventée), l'absence de prénom sans signification, les
patronages (métier → saint → porte) et les portes du jour, la catégorie d'un jour
(personne, fête, joker), les trois états d'une fiche et leurs comptes, **l'invariant
des journées nommées**, la liste des manquants, et **l'écran** : le jour sans fiche
qui montre quand même le sens de son prénom, sa source, ses métiers, ses portes, et
qui nomme ce qui manque.

---

## §52 — Le champ du magazine : une seule question dans la première vue, et la revue avant de valider

**La demande.** « Au-dessus du hero de l'accueil, en première vue, juste un champ
de saisie pour générer notre magazine sur base d'infos à demander — ensuite on
peaufine avec ce qu'on a déjà dans l'accueil. Ou alors en bas de la page d'accueil
pour compléter les infos et générer un magazine qui permettrait de cocher ce qu'on
garde et ce qu'on ne garde pas, et ce qu'on souhaite modifier, avant de le valider,
pour que **la page profil soit la couverture d'un magazine et que chacun ait ses
24 pages**. »

**Ce qu'on en fait : deux entrées, un seul objet.** Le champ du haut et le
formulaire du bas ne sont pas deux choses — c'est le même magazine, abordé deux
fois. **En haut, une seule question**, parce qu'un visiteur qui arrive ne donnera
pas vingt réponses ; **en bas, la finition**, pour celui qui a tout regardé et
veut maintenant compléter. On ne remplit pas un formulaire à l'entrée du site : on
**prend la seule information que le site ne peut pas deviner**, et le reste existe
déjà.

**Ce qui est construit (le haut).** `ChampDuMagazine` est désormais **la première
chose du hero**, avant la question « Qui êtes-vous dans ce mariage ? ». Il demande
**deux prénoms et une date** — et rien d'autre. Il accepte ce que les gens
écrivent : l'esperluette, le « et », le « + », la virgule, le point médian, le
slash (`prenomsDuChamp`, dans `lib/champDuMagazine.ts`). Un seul prénom passe
aussi : le second sera demandé, **jamais inventé**.

**Il n'y a pas de cul-de-sac.** Sans une seule réponse, le bouton devient « Voir
le magazine du jour » : **365 magazines, un par jour**, celui d'aujourd'hui
toujours ouvert. Le champ dit lui-même ce qui va se passer ensuite — *une question
à la fois, puis on coche ce qu'on garde, ce qu'on modifie, ce qu'on retire*.

**Pourquoi dans le hero, et pas dans une bande blanche au-dessus.** L'accueil
s'ouvre par le générique (`OuvertureSite`), puis la barre du site, puis l'image
plein cadre. Une bande blanche au-dessus du hero couperait cet enchaînement pour
gagner trois centimètres. Le champ est donc **le premier élément du hero**, sur le
verre : première vue, sans casser l'ouverture. **S'il faut le déplacer** — au-dessus
du hero, ou en bas de page pour la finition — c'est **un bloc, une ligne**.

**La passation, déjà en place.** Le champ envoie les réponses à la création avec
l'état de route : l'onboarding reprend **prénoms et date déjà écrits** (« Déjà
répondu dans l'accueil : Paul & Emma · 2027-06-12 »), la carte se remplit à droite,
et **les cinq questions continuent une à une** — l'accès, les mariés, le jour, les
événements, la musique. Ce qui est déjà répondu ne se redemande pas ; rien n'est
déduit d'un prénom.

**Ce qui reste à construire : la revue.** Entre la génération et l'éditeur, l'écran
qui manque — **le magazine proposé, bloc par bloc**, avec trois gestes par bloc :
**je garde**, **je modifie**, **je retire**. Puis **valider**. Trois règles :

1. **Rien n'est publié avant la validation.** Ce qui sort de la revue est privé
   jusque-là ; le profil ne devient public que validé (RGPD : on demande, on
   n'expose pas).
2. **Ce qui est proposé est déjà dans le site** — les 365 journées, les
   couvertures, les cartes, les personnages, les métiers, les portes, les univers,
   la playlist, les 24 pages. La revue n'invente rien : elle **assemble**, et
   chaque bloc porte son **niveau de correspondance** (🟢 directe, 🔵 culturelle,
   🟣 éditoriale assumée, ⚪ inspiration), donc ce qu'on garde reste **signé**.
3. **Jumo explique.** La revue est le canevas : l'IA bienveillante qui **propose,
   rectifie sans jugement et dit pourquoi** — et qui **demande l'autorisation**
   avant d'aller chercher une carte, un magazine ou une page ailleurs.

**Après la validation : le profil est la couverture.** La page d'une personne
**est** la couverture de son magazine — et **chacun a ses 24 pages**. Ce n'est pas
une promesse neuve : c'est la règle depuis le §39 et le §46 — **`PAGES_EDITION` =
24**, une page par heure, **8 rubriques × 3**, même sommaire chaque jour, et la
composition qui suit **vos** choix. La couverture suit l'heure : elle ouvre sur la
page du moment, pas sur la une figée.

**Ce qu'on ne fait pas.** Pas de génération qui invente (rien n'est écrit sans
source) ; pas de formulaire à l'entrée qui décourage ; pas de second téléphone sur
l'accueil ; pas de timeline en bas de l'accueil ; la charte ne bouge pas — le champ
est en verre, dans les couleurs de la maison, sans emoji.

**Contrôles.** `npx tsc -b` 0, eslint 0, `npx vite build` OK, `npm test` **178 /
55 / 1194**. Les vérifications ajoutées : les six façons d'écrire deux prénoms et
leurs résultats, **l'absence de fabrication** (un seul prénom n'en donne pas deux,
un champ vide ne donne rien), le champ à l'écran (les deux champs, la date, le
bouton du jour quand rien n'est répondu, la phrase des 365 magazines), et **sa
place** : dans le hero, avant la question du hero.

---

## §53 — Le champ après l'intro, la SUPER COMPOSITION, et le magazine qui se retient

**Les précisions de l'auteur.** « Oui mais sans modifier les pages. Le but c'est de
générer une page profil sur laquelle on pourrait même mettre le magazine de la
personne : la page verticale afficherait l'essentiel, et si on veut en savoir plus,
ça amène dans le magazine — au moins ça permet de tout aligner grâce au magazine et
sa structure. Donc sur le hero, **après l'intro**, faire apparaître ce champ **avec
un titre au-dessus**, et pas la phrase « Aucune réponse n'est nécessaire… » dans le
bloc, **mais un bouton “Générer mon magazine”**. Puis un *loaded* en plein milieu
genre **SUPER COMPOSITION**, et **chaque page indiquée** pour voir en vrai que ça
tourne et compose — et c'est ça qui mettrait à jour les choix des cartes dans
l'accueil pour compléter. »

**Sans modifier les pages.** Aucune page n'est réécrite : ni la page d'une personne,
ni le magazine, ni le kiosque. On touche **le hero de l'accueil** (l'emplacement du
champ) et **l'écran de composition** — les deux endroits demandés. Le reste suit par
la route, pas par la refonte.

**Le champ, à sa place finale.** Il vient **après l'intro du hero** — la question
« Qui êtes-vous dans ce mariage ? », le titre du moment, son picto — et **avant les
cartes**. Il porte **son titre au-dessus du champ** (« Votre magazine », avec la
structure annoncée : 24 pages, une par heure), puis les deux champs et **un seul
bouton : « Générer mon magazine »**. La phrase « aucune réponse n'est nécessaire »
disparaît du bloc : ce qui reste, c'est ce qui se fait.

**La SUPER COMPOSITION.** L'écran de génération ne tourne plus à vide : il **compose
sous les yeux**. L'anneau de progression, et **les vingt-quatre pages qui arrivent
l'une après l'autre** — leur numéro, **leur heure** (*06 · l'aube*, *12 · midi*),
**leur rubrique** (*Le temps*, *La carte*, *L'amour*, *Le passage*, *Les gens*, *Vos
papiers*, *La musique*, *L'archive*), la page en cours mise en avant, les pages
faites cochées, et la ligne du moment : *« 07 / 24 · Le passage »*. Ce n'est pas une
animation inventée : c'est **le sommaire réel du magazine composé** — chaque page
listée existe à l'arrivée. À la fin, la couverture apparaît, et **« Votre magazine
est composé »**.

**Deux provenances, un seul écran.** Du **champ de l'accueil** on revient à
l'accueil : le magazine est retenu sur l'appareil. De **la création** (`?site=`) on
ouvre l'éditeur, exactement comme avant — le parcours des cinq questions n'est pas
touché.

**Ce qui se retient : la réponse, jamais le magazine.** `src/lib/composition.ts` ne
garde que les deux prénoms et la date ; **le magazine se recompose à l'identique à
la lecture** (le numéro de la semaine, sa carte, sa saison, la couverture du jour, la
fiche du jour, les 24 pages). Il ne peut donc pas vieillir, ni diverger. Sans date,
c'est aujourd'hui ; sans prénoms, c'est **le magazine du jour** — on n'invente jamais
un prénom, ni un métier, ni une histoire.

**Et l'accueil se met à jour.** Quand le magazine existe, le bloc du hero **devient
sa couverture** : la couverture du jour, « Paul & Emma · 12 juin 2027 », le numéro et
les 24 pages, puis trois gestes — **Ouvrir le magazine**, **Compléter les questions**
(la carte repart avec les réponses déjà données : rôle, univers, événements,
musique), **Refaire**. C'est la boucle : le champ répond, la composition travaille,
l'accueil reprend la main pour compléter.

**Ce qui vient ensuite, tel que l'auteur l'a fixé.** La **page d'une personne** (la
verticale) dit **l'essentiel** ; « en savoir plus » **amène dans le magazine** — et
c'est le magazine, avec sa structure de 24 pages et ses 8 rubriques, qui **aligne
tout**. Elle n'est pas touchée dans cette passe, par décision : on ne réécrit pas une
page pour y mettre un magazine qui n'existe pas encore pour elle.

**Contrôles.** `npx tsc -b` 0, eslint 0, `npx vite build` OK, `npm test` **178 / 55 /
1220**. Vérifications ajoutées : les 24 pages et leur heure, **les 8 rubriques dans
l'ordre**, la couverture et la fiche du jour demandé, la phrase qui nomme les deux
prénoms, **l'absence d'invention** (sans réponse : le magazine du jour, aucun prénom),
**la mémoire qui ne garde que la réponse** (et le magazine relu identique), le
`Refaire`, l'écran de composition (son titre, la phrase, l'heure des pages, le
compteur, la rubrique en cours, la couverture qui n'arrive qu'à la fin), et le bloc
de l'accueil **dans ses deux états** — le champ vide, puis la couverture.

---

## §54 — Le composeur : des personnes, puis ce qui devient possible

**La demande.** « Le mieux, c'est comme dans Claude, Manus ou Gemini : **un bloc
simple**, juste le champ pour **le nom, la date de naissance et la ville de
naissance**. Puis au début de ce champ **un bouton +**, grisé au départ si on ne
remplit pas ces infos ; il se déclenche, et en cliquant sur + on a **un menu pour
ajouter une personne** — et on peut en ajouter plusieurs à la suite. **Au bout de
deux personnes, dans le menu on verrait “Nous sommes des futurs mariés”** : ça
c'est énorme, parce que c'est **une fois après avoir rempli les premières infos**
que la liste se met à jour et qu'on voit **ce qui est possible** — suivant le site,
et suivant les infos essentielles pour générer le magazine. »

**Le bloc.** Un titre, **le + à gauche du champ**, et **trois informations par
personne** : le prénom, la date de naissance, la ville de naissance. Pas de
formulaire, pas de questionnaire à l'entrée : **on écrit des personnes**, l'une
après l'autre. Les personnes ajoutées deviennent des **pastilles** au-dessus du
champ — prénom, date, ville, et un retrait possible d'un clic.

**Le + est éteint au départ — et il dit pourquoi.** Il ne s'allume que lorsque
**les trois informations sont écrites** (`personneComplete`) : sans l'une des
trois, il reste gris et inerte, et la ligne sous le champ l'explique — *« Le + s'allume
quand le prénom, la naissance et la ville sont écrits. »* Une fois allumé, il ouvre
**le menu**.

**Le menu : ce qui est possible, maintenant.** Et surtout **il se met à jour tout
seul** avec le nombre de personnes :

| personnes | ce qui s'ouvre |
| --- | --- |
| **1** | La date du mariage · Le lieu · Je suis témoin · Je suis prestataire |
| **2** | **Nous sommes des futurs mariés** · Nous sommes déjà mariés |
| **3** | Nous venons en famille |

Ce qui n'est pas encore possible **reste dans le menu, grisé, avec sa condition
écrite** — *« Nous venons en famille — à partir de trois personnes »* (`PROPOSITIONS`,
`motDeLaCondition`). On ne cache pas la suite : on dit quand elle s'ouvre. Et le
menu ne montre **jamais** une proposition qu'on ne peut pas prendre.

**Le rôle choisi entre vraiment dans le magazine.** « Nous sommes des futurs
mariés » ne pose pas qu'une étiquette : le rôle part dans `composerEdition({ roleId })`
et **les pages changent** — vérifié : la rubrique « Les gens » ne dit pas la même
chose avec et sans le rôle (*SUPER PLANNER et SUPER OFFICIANT* d'un côté,
*SUPER FLEURISTE et SUPER NOTAIRE* de l'autre). C'est la règle du moteur : *mêmes
choix, même édition ; un rôle différent, et tout se recompose.*

**La date de naissance n'est pas décorative.** Une date de naissance est **un jour
de l'année**, et l'année en a trois cent soixante-cinq : chaque pastille dit donc
**le jour de naissance de la personne** — *« le jour de Guy »* (12 juin). C'est la
seule chose qu'on rend en retour, et elle **existe déjà** : on ne déduit rien d'un
prénom, jamais.

**Les deux informations essentielles sont dans le menu, pas à la porte.** La date
du mariage et le lieu se demandent **quand on en a besoin**, depuis le + — le bloc
reste simple. Sans date, le magazine se compose **au jour d'aujourd'hui**.

**Ce qui se retient : la réponse, jamais le magazine.** `composerLeMagazine({ personnes,
date, roleId })` assemble (le numéro de la semaine, la carte, la saison, la
couverture du jour, la fiche du jour, les 24 pages) ; la mémoire du site ne garde
que **les personnes, la date et le rôle**, et le magazine **se recompose à
l'identique** à la lecture. La liste voyage aussi dans l'adresse
(`?p=Paul,1990-06-12,Provins;Emma,…&jour=&role=`), donc l'écran de composition
fonctionne même rouvert.

**La boucle est fermée.** Une fois le magazine composé, **le bloc devient sa
couverture** : la couverture du jour, les prénoms, la date, le numéro et les 24
pages — puis **Ouvrir le magazine**, **Compléter les questions** (le site repart
avec ce qui est répondu : prénoms, date, lieu) et **Refaire**, qui rend le
composeur **avec la liste déjà écrite**.

**Aucune page n'est modifiée** : le composeur vit dans le hero, l'écran de
composition est celui du §53, et le reste du site n'a pas bougé.

**Contrôles.** `npx tsc -b` 0, eslint 0 sur les fichiers touchés, `npx vite build`
OK, `npm test` **178 / 55 / 1242**. Vérifications ajoutées : les trois informations
d'une personne (complète, et incomplète de chacune), la date écrite court,
**le jour de naissance** (et l'absence d'invention sans date), l'aller-retour de la
liste dans l'adresse, **ce qui s'ouvre et ce qui reste fermé selon le nombre de
personnes** (4 à une, 6 à deux, 7 à trois), la condition écrite des lignes grisées,
les deux informations essentielles, **le bloc à l'écran** (titre, trois champs, +
éteint, bouton, la phrase qui explique le +), **le rôle qui change réellement les
pages**, la mémoire qui ne garde que la réponse (et le magazine relu identique), le
`Refaire`, la couverture du bloc quand le magazine existe, et l'écran de composition.

---

## §55 — Ce qu'un prénom dit, ce qu'un âge ouvre : le menu qui se resserre

**La demande.** « Ça manque de possibilités comme **invité**, non ? Et **à plusieurs
ça peut être un groupe**, ou autres — c'est là le but du jeu. Et **être précis :
juste après le nom, on va pouvoir capter si femme ou homme, et aussi l'âge, et
aussi la ville de naissance** — donc ça va logiquement générer **un menu synthétique
par rapport au magazine, mais surtout par rapport aux 365 magazines**, parce que ça
va resserrer tout ça pour composer l'essentiel. »

**Des possibilités en plus, et une en moins.** Le menu passe de sept à onze
propositions : **Je suis invité / invitée** (demandé), **Je suis l'un des mariés**,
**Je viens avec mes parents**, **Nous sommes un groupe** (trois personnes et plus),
**Nous venons en famille**. Et les essentielles restent à part — la date du mariage,
le lieu. Ce qui change tout, c'est que **la liste se resserre avec ce qu'on sait** :

| ce qu'on sait | ce qui s'ouvre |
| --- | --- |
| **1 personne** | 6 propositions — invité, témoin, l'un des mariés, prestataire, et les deux essentielles |
| **1 personne, 10 ans** | 7 — « Je viens avec mes parents » s'ouvre |
| **2 personnes** | 8 — **« Nous sommes des futurs mariés »**, « Nous sommes déjà mariés » |
| **3 personnes** | 10 — « Nous sommes un groupe », « Nous venons en famille » |

**Le prénom dit son genre — et rien d'autre.** Deux sources, dans cet ordre :

1. **le calendrier des 365** — la source de la maison. « Emma » est un jour, c'est
   une sainte : féminin. Et **on ne prend jamais un mot de complément pour un
   prénom** : « Rose de Lima » donne Rose, « Thérèse de l'Enfant Jésus » donne
   Thérèse, « Vincent de Paul » donne Vincent — **pas** Paul.
2. **la liste courte des prénoms courants** — pour ce que le calendrier ne porte
   pas : Hugo, Chloé, Jade, Nathan, Sarah, Paul, Mathieu…

Et quand les deux se taisent, ou quand **le prénom se porte des deux façons** —
Camille, Claude, Dominique, Maxime, Alix… — **on ne devine pas : on demande**. Un
petit bouton à côté du champ montre ce qui a été lu (« Femme », « Homme », « À
préciser »), d'où ça vient, et **se corrige d'un clic**. Au total, **542 prénoms
sont lus** sans qu'on ait inventé une ligne.

**Le prénom dit aussi son jour.** « Emma » a son jour : **le 19 avril, n° 109 des
365** ; « Élodie », le 22 octobre, n° 295. Le bloc le dit à voix haute quand on
écrit un prénom — et quand le prénom **n'est pas** au calendrier, il le dit aussi :
*« n'est pas au calendrier des 365 : rien n'est décidé pour lui. »*

**La date de naissance dit l'âge — au jour près.** Vérifié : né le 12 juin 1990, on
a **37 ans le 12 juin 2027**, et **36 ans la veille**. L'âge affiché ouvre ou ferme
des propositions (« Je viens avec mes parents — jusqu'à 17 ans »), et le menu dit
toujours **le plus jeune de la liste**.

**Le jour de naissance a son magazine.** La date de naissance est un jour de
l'année : chaque pastille dit donc **« né(e) un 12 juin 1990 — le jour de Guy »**,
en plus de **son jour de prénom**. Deux choses différentes, deux fois vraies : une
personne née le 12 juin s'appelle rarement Guy, et le magazine sait dire les deux.

**Et le menu devient synthétique.** Son en-tête dit ce qu'on a : *« Ce qui devient
possible — 2 personnes · le plus jeune a 12 ans »*. Les titres **suivent la langue
de la personne** : « Je suis invité » devient « Je suis invitée », et le rôle part
avec — `mariee` au lieu de `marie`. Ce qui est fermé **dit pourquoi** : *« à partir
de trois personnes »*, *« jusqu'à 17 ans »*.

**Ce qui n'est jamais déduit.** Un prénom donne **un genre et un jour**, une date
donne **un âge et un jour**, une ville donne **un lieu**. Rien de plus : **jamais un
rôle, jamais un métier, jamais une histoire**. Le rôle se choisit dans le menu, ou
reste vide.

**Ce qui se retient, et ce qui voyage.** La mémoire du site et l'adresse gardent la
réponse — `prenom,naissance,ville,genre` par personne, la date du mariage, le rôle —
et **le magazine se recompose à l'identique**. Une liste enregistrée avant cette
passe (sans genre) se relit quand même : on ne casse pas ce qui existe.

**Contrôles.** `npx tsc -b` 0, eslint 0 sur les fichiers touchés, `npx vite build`
OK, `npm test` **178 / 55 / 1274**. Vérifications ajoutées : le genre lu (calendrier,
prénoms courants, mixte, inconnu), **et le jour du prénom** (Emma 109, Élodie 295,
« Pierre et Paul » ne donnant pas Paul), l'âge **au jour près** (37 ans le jour de
l'anniversaire, 36 la veille), le jour de naissance, l'écriture courte des dates,
**les comptes de propositions selon le nombre et l'âge** (6 / 7 / 8 / 10), la
présence d'« invité », les rôles au féminin, **les raisons de fermeture** (le
nombre, l'âge), l'aller-retour de la liste avec le genre, la relecture d'une liste
sans genre, le bloc à l'écran, et la mémoire qui ne garde que la réponse.

---

## §56 — Le casting des visuels : 365 fonds, 1 825 scènes, et le choix expliqué

**Le retour.** « J'avais testé, mais le **loading est trop rapide** — et ce serait
mieux **dans le hero**, parce que ça claque. Pourquoi pas aussi l'ajouter **dans
une section plus bas** ? Et le plus important, c'est de **terminer les magazines,
donc les couvertures**, pour que ça puisse **chercher le meilleur résultat et
définir le visuel qui se rapproche le plus** — et même s'il y en a plusieurs, ce
serait fort, parce que ensuite ça permet d'avoir **cinq visuels, les moments de la
journée**. Je vais vraiment trouver un site et un serveur pour faire ces **plus de
1 800 images**. »

**La composition se regarde, et on peut passer.** Une page toutes les **190 ms** au
lieu de 110 : la composition dure un peu moins de cinq secondes, on a le temps de
lire les heures et les rubriques qui défilent. Et un lien discret, **« Passer la
composition »**, emmène directement au magazine — une animation ne retient
personne.

**Le composeur est aux deux endroits.** Dans le hero, après l'intro (il y est
depuis le §54), **et plus bas dans la page**, dans une section à lui —
`#votre-magazine`, *« Votre magazine, maintenant »*. C'est **le même bloc**, pas une
copie : il retrouve tout seul ce qui a déjà été répondu.

**Deux familles d'images, et elles ne sont pas au même point** :

| | combien | de quoi ça dépend | disponible |
| --- | --- | --- | --- |
| **les fonds de couverture** | **365** | de rien : la couverture sait déjà sa couleur, sa saison, son titre | **tout de suite** |
| **les scènes** | **1 825** | de la fiche du jour — et **on n'illustre pas ce qu'on n'a pas documenté** | 80 ont leur brief, 1 745 attendent leur fiche |

**Le nom des fichiers ne se discute pas.** Un dossier par jour, `MM-JJ`, sous
`public/images/magazine/` : `couverture.jpg`, puis `aube.jpg`, `matin.jpg`,
`midi.jpg`, `apres-midi.jpg`, `soir.jpg` — et **`-2`, `-3`** quand il y a plusieurs
candidates pour le même plan. Le site prend **la photo** là où elle est, et **le
dessin** partout ailleurs : une image manquante ne casse jamais une page.

**Et quand il y a plusieurs candidates, on choisit — en le disant.**
`choisirLeMeilleurVisuel` note chaque image sur **cinq critères** :

| critère | poids | ce qu'on regarde |
| --- | --- | --- |
| le moment | 3 | l'image montre-t-elle bien l'aube, le midi, le soir ? |
| la lumière | 2 | la lumière décrite est-elle celle du moment ? |
| la couleur | 2 | la dominante est-elle proche de la couleur du jour (distance en canaux) ? |
| le cadrage | 1 | est-ce bien du 5 / 7 ? |
| le sujet | 1 | voit-on ce que la scène demande ? |

On ne choisit **jamais « la plus belle »** — ça ne veut rien dire. On choisit **celle
qui répond au brief**, et **la décision est signée** : *« midi-2.jpg — 8 points :
c'est bien le midi ; la lumière y est (studio, dure) ; la couleur du jour est là (à
7 canaux) ; le cadrage est celui demandé (5 / 7). »* À égalité, **c'est le premier
rang qui reste** : l'ordre des fichiers est un ordre.

**Ce que la production doit déclarer par candidate** : le moment, la lumière, la
couleur dominante, les dimensions, et ce qu'on y voit. C'est tout ce qu'il faut
pour noter — et ça tient dans le nom du fichier ou dans une ligne de tableur.

**Le document de production.** `npm run prompts` engendre désormais **trois**
documents, tous issus du site : `docs/prompts-maitres.md`, `docs/fiches-de-l-annee.md`
et **`docs/casting-des-couvertures.md`** — **2 309 lignes**, avec **les 365 fonds
(un par jour, avec sa couleur et son fichier attendu)** et **les 1 825 scènes**
(jour, personnage, moment, état, fichier attendu), plus la direction artistique,
les cinq critères et les interdits. **C'est la liste de courses de la production** —
rien à écrire à la main, rien à retrouver.

**La photo prend le fond, la grille ne bouge pas.** `CouvertureJour` accepte
désormais la photo du jour : elle **remplace le fond uni**, la **couleur du jour
passe dessus en voile** (42 %) pour que la palette tienne et que le texte reste
lisible — et **la marque, la création, le titre, la date ne bougent pas d'un
pixel**. C'est exactement la promesse des planches d'aperçu : *la photo remplace le
fond, la mise en page ne bouge pas.*

**Et la liste des images livrées est relevée sur le disque** : `npm run photos`
regarde `public/images/magazine/`, écrit `src/lib/photosDuMagazine.ts`, et le site
sait ce qui est arrivé — **sans jamais demander une image par erreur**. Aujourd'hui :
**0 plan livré**, et le dessin tient les 365 couvertures.

**La nuit n'a pas d'image** — la règle ne change pas : cinq moments de lumière, et
la nuit garde son dessin. Si un jour on veut une sixième image de nuit, c'est **une
ligne** dans `MOMENTS_VISUELS` (et 1 825 deviendrait 2 190).

**Contrôles.** `npx tsc -b` 0, eslint 0 sur les fichiers touchés, `npx vite build`
OK, `npm test` **178 / 55 / 1317**. Vérifications ajoutées : les **365 fonds** et
les **1 825 scènes**, les scènes qui ont un brief et celles qui attendent leur fiche
(80 / 1 745), les **363 personnages distincts** de l'année, le nom des fichiers (les
trois rangs), la distance des couleurs (0 pour deux fois la même, 442 entre le noir
et le blanc, `null` pour une couleur illisible), **la note d'une candidate** (et ses
raisons écrites), **le classement** (la bonne d'abord, la mauvaise dernière), **la
décision signée**, le cas sans candidate (« le dessin prend le relais »), **la
couverture avec et sans photo**, le lien « Passer la composition », et **le
composeur aux deux endroits** de l'accueil.

---

## §57 — Rassembler plusieurs jours, puis éliminer — et les deux prompts de production

**Le retour.** « Oui, mais le casting doit prendre en compte les autres infos du
magazine — des éléments, des sujets, des détails — qui se trouvent **dans un autre
jour, ou dans plusieurs autres jours**. En gros, **ça rassemble plusieurs
magazines en les filtrant, puis on refiltre, et ainsi de suite : on procède par
élimination.** » Et pour la production : **un prompt pour ChatGPT** qui construise
les journées du reste de l'année, avec **la structure déjà écrite** ; et **un
prompt pour Gemini, Leonardo, Arena Studio ou une autre conversation Arena** :
**une bibliothèque d'images, à part sur GitHub, qui servira de serveur et de
liens.**

**Un jour en tient d'autres — et maintenant, c'est écrit.**
`joursLiesAuJour(annee, jour)` rend les jours qui tiennent avec un jour, chacun
avec **sa raison** : **le même personnage** fêté ailleurs dans l'année, **la même
porte** qui s'ouvre, **le même métier** qui se patronne, **la même famille
visuelle** (même saison, même densité, même part d'exception). Le 21 septembre
2026 tient **15 jours** — tous par la famille visuelle des jours à part de l'été ;
un jour ordinaire de mai en tient **69**. On ne rassemble jamais des jours sans
savoir pourquoi.

**Le casting devient un entonnoir.** `eliminerEntreJours(candidats, attendus)`
prend **les candidats de plusieurs jours et les briefs de ces jours**, puis procède
**par élimination**, un tour après l'autre :

1. **le moment** — le moment déclaré doit être demandé par l'un des jours ;
2. **le cadrage** — les dimensions doivent répondre au 5 / 7 ;
3. **la couleur** — la dominante doit approcher l'un des jours rassemblés (160 canaux) ;
4. **la lumière** — une scène qui ne la déclare pas sort ;
5. **le sujet** — ce qu'on voit doit répondre à l'un des jours rassemblés.

Chaque tour **écrit qui il sort, et pourquoi**. Ce qui reste est noté contre le
brief auquel il répond le mieux, et **l'on garde tous les premiers** — *même s'il
y en a plusieurs*. Sur six candidats rassemblés pour deux jours, l'entonnoir sort
la scène du soir, le paysage, le rouge et la voiture, et **retient deux images à
9 points, chacune répondant à son jour**. C'est exactement ce que demandait le
message : plusieurs magazines rassemblés, filtrés, refiltrés, jusqu'aux plus
proches.

**Les deux prompts de production sont écrits, prêts à coller** :

- **`docs/prompt-journees-pour-chatgpt.md`** — pour ChatGPT : la mission, la
  chaîne DATE → … → MARIAGE, la règle (*un fait se cite, une interprétation se
  signe*), ce qui est déjà fait (16 journées, 346 étymologies, 54 métiers),
  **la structure exacte attendue par jour** (le bloc JOUR / PERSONNAGE / ORIGINE /
  … / ARTICLE / SOURCE), les contraintes d'écriture des quatre niveaux, et
  **l'exemple complet et validé du 21 septembre**. On travaille par lots de dix
  jours, en lui passant les blocs de `docs/fiches-de-l-annee.md`.
- **`docs/prompt-bibliotheque-images.md`** — pour Gemini, Leonardo, Arena Studio
  ou une autre conversation Arena : **la bibliothèque d'images comme un dépôt
  GitHub à part, qui servira de serveur et de liens**. Les noms de fichiers exacts
  (le dossier `MM-JJ`, les six plans, les trois rangs), les deux familles
  d'images, **le format du `manifeste.json`** (la déclaration de chaque image :
  moment, lumière, couleur, dimensions, contenu), les cinq critères du casting, la
  direction artistique, les interdits, l'ordre de production (les 365 fonds
  d'abord, puis les scènes par journées documentées) — et la règle de service :
  **les liens bruts du dépôt sont les URLs du site, aucun serveur intermédiaire**.

**Le site, lui, est déjà prêt à consommer la bibliothèque** : `npm run photos`
relève ce qui est arrivé, `photoDuPlan` prend la photo là où elle est, et
`CouvertureJour` la pose sous la grille. Quand le dépôt existera, il suffira d'y
pointer — la mécanique d'élimination fera le reste.

**Contrôles.** `npx tsc -b` 0, eslint 0 sur les fichiers touchés, `npm test`
**178 / 55 / 1337**. Vérifications ajoutées : les jours liés (leur nombre, leurs
raisons, la famille visuelle, jamais le jour lui-même), les cinq tours de
l'entonnoir **dans l'ordre**, chaque tour sortant exactement le candidat qu'il doit
(le soir, le paysage, le rouge, la voiture), chaque élimination avec sa raison,
**les deux images retenues à égalité, chacune répondant à son jour**, la décision
qui raconte les tours, et le cas à vide (*le dessin garde sa place*).
