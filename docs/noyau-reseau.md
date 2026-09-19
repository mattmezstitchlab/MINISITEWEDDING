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

## 8. Décisions à prendre avant la première ligne de code

1. **Ouvre-t-on les comptes ?** `people` + session est le préalable de tout le
   reste. Sans lui, chaque document retombe sur un formulaire RSVP. C'est
   invisible à l'écran et ça décide de tout.
2. **Le mini-site actuel devient-il la face publique du mariage** (une projection
   de `wedding_sites`), ou reste-t-il un objet séparé ? Je recommande la
   projection : c'est ce qui interdit de dupliquer.
3. **On commence par la carte (visible, immédiate, déjà à 60 % écrite) ou par le
   noyau de données (invisible, structurant) ?** Je recommande la carte : elle
   rend le renversement visible et réutilise `CardPreview` et `weddingCard.ts`.
