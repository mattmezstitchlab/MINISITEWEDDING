# VOWS — Diagnostic & plan de simplification

> Objectif : retrouver **un seul chemin clair pour organiser un mariage**, sans rien
> perdre de ce qui a réellement de la valeur.

---

## 1. Ce que je comprends du dépôt

Il y a **deux produits empilés dans le même dossier**, et c'est ça qui rend le tout
illisible.

| Étage | Ce que c'est | État |
| --- | --- | --- |
| **Étage 1 — le mariage** | `/creer` (4 questions) → `/generer` → `/editeur/:id` (aperçu, structure, apparence, RSVP, partage) → `/p/:slug` (12 sections : hero, histoire, programme, lieux, infos, RSVP, packages, cagnotte, galerie, FAQ, contact, footer) | **Solide, testé, terminé** |
| **Étage 2 — le « système »** | AIME Kernel relationnel, Event OS (orchestration, talkie-walkie, radio), Timeline Theater, Taxonomie des 28 rôles, Mosaïque des univers | **Démonstration**, branchée nulle part (ou branchée au mauvais endroit) |

L'étage 1 tient en 4 écrans et 12 sections. L'étage 2 ajoute ~19 composants de
vitrine, 6 tables SQL parallèles et un vocabulaire complet qui lui est propre
(univers, métiers, missions, propositions, cascades, audit, transmissions).

**Chiffres mesurés**

- `src/` : 23 190 lignes ; 40 composants racine + 12 sections + 4 panneaux d'éditeur.
- 6 tables métier (`wedding_sites`, `site_sections`, `programme_events`,
  `infos_pratiques`, `gallery_photos`, `faqs`, `rsvp_events`, `rsvp_responses`,
  `gift_options`, `media_assets`, `site_secrets`) **+ 6 tables `aime_*`**.
- 4 destinations de second niveau, chacune en double : `/features` = `/modules`,
  `/aime` = `/taxonomie`, `/theater` = `/timeline`.
- 166 vérifications passent (`npm test` : 95 API + 55 front + 16 UI). Le socle n'est
  pas cassé.
- 20 « univers » dans `weddingStyles.ts`, 28 « rôles » dans `weddingTaxonomy.ts`,
  7 rôles dans `bidirectionalAlignmentEngine.ts`, des rôles encore différents dans
  `UniverseDirectoryModal` : **quatre façons de dire « une personne et son rôle »**.
- 8 fichiers orphelins : `EditorShowcase`, `IntegratedMirrorTimelineBar`,
  `PhoneShowcase`, `ThemeMixerStudio`, `TimelineTheaterStudio`, `aimeMockData`,
  `bidirectionalAlignmentEngine`, `weddingAgent`.

---

## 2. Les six fuites, avec les preuves

### Fuite 1 — La démo a mangé le produit *(bloquant)*

`AimeKernelBridge.projectWorldProjectToSiteData()` est appelé à **deux endroits du
chemin réel** :

- `src/lib/siteData.ts:128` → dans `useSiteData`, donc **sur toutes les pages
  publiques ET dans l'éditeur** ;
- `src/pages/Editor.tsx:134` → à chaque sauvegarde.

Or ce pont projette toujours le projet de démonstration codé en dur
`prj-mariage-sarah-2026` (`aimeKernelBridge.ts:17`), qui est **semé par défaut**
dans le store (`aimeKernelService.ts:52`), et il écrase en dur
`partner1`, `partner2: 'Gabriel'` (ligne 58), `wedding_date`, `venue`, `city`,
`hero_title`, `hero_subtitle`, `hero_photo`, **et remplace tout le programme**.

Preuve exécutée sur le vrai code :

```
AVANT : Léa & Thomas — Domaine des Oliviers
APRÈS : Sarah & Gabriel — Château des Tilleuls (Valbonne, 2026-10-18)

PROGRAMME AVANT : Cérémonie laïque
PROGRAMME APRÈS : 16:00 Cérémonie Laïque sous l'Arche Minérale
                | 17:30 Performance Acoustique & Sunset Live
                | 20:00 Banquet Gastronomique Éclairé aux Chandelles
```

Autrement dit : **tout mariage créé aujourd'hui s'affiche « Sarah & Gabriel au
Château des Tilleuls »**, chez les invités comme dans l'éditeur. Pire : les tests
hors `npm test` (`canonical_source_test.ts`, `passe7`, `passe51`, `passe12`)
*verrouillent* ce comportement — « Le Kernel écrase la valeur Legacy ». C'est
l'innovation qui a mangé le produit, et la régression est contractualisée.

> `RsvpForm.tsx:50` fait la même chose côté invités : chaque réponse RSVP écrit
> d'abord dans le Kernel de démo, puis dans la vraie base.

### Fuite 2 — Trois navigations concurrentes

Sur la même page d'accueil : un menu **EVENT OS** (4 modules), un menu **UNIVERS &
MÉTIERS** (20 univers + mosaïque plein écran), et une **barre flottante en bas**
(Stories, Radar, Timeline, Saxo, Profil). Plus `/features`, `/aime`, `/theater`,
`/taxonomie`, `/timeline`, `/modules`. Le visiteur n'a aucun moyen de savoir que
le seul bouton qui compte est **« Créer mon site »**.

### Fuite 3 — L'innovation est en carton-pâte là où elle promet le plus

Recherche sur tout `src/` : **zéro** `getUserMedia`, `RTCPeerConnection`,
`AudioContext`, `MediaRecorder`, `WebSocket`, `EventSource`, `indexedDB`.

- Talkie-Walkie WebRTC → `useState` seulement. **Pas de voix.**
- Radio Live « Flux 320 kbps » → un `setInterval` qui fait avancer une barre.
- Orchestration prédictive → un compteur de décalage local.
- « Persistance distante PostgreSQL » → `localStorage` (`KERNEL_STORAGE_KEY`).

Les badges annoncent « Brevetable Core », « Zéro WhatsApp », « Flux 320 kbps » : à
l'écran, c'est crédible ; dans le code, il n'y a rien derrière. C'est acceptable
dans un laboratoire, mortel en page d'accueil produit.

### Fuite 4 — Le vocabulaire parallèle

« Univers » (20) vs « rôles » (28) vs « missions » vs « métiers » vs « contextes »
vs « WorldProjects ». Personne ne peut tenir ce lexique en tête, donc personne ne
sait où cliquer.

### Fuite 5 — Les bonnes idées sont écrites mais débranchées

- `bidirectionalAlignmentEngine.ts` : exactement l'idée juste (chacun entre par son
  rôle — mariés, invité, témoin, officiant, traiteur, DJ, photographe — et tout
  s'aligne sur la même timeline). **Importé nulle part.**
- `weddingAgent.ts` : sait déjà extraire « 12 juillet à Aix, 80 invités » d'une
  phrase. **Importé nulle part.**
- `TimelineTheaterStudio.tsx` (537 lignes) : **importé nulle part**.

### Fuite 6 — Ce pour quoi on organise un mariage n'existe pas encore

Le schéma ne contient **ni liste d'invités consolidée, ni plan de table, ni budget,
ni rétroplanning, ni prestataires / devis**. On a une magnifique vitrine (le
mini-site) et un RSVP — mais pas le cockpit qui remplace le tableur Excel.

Ironie : les 6 tables `aime_*` (identités, projet, relations avec rôle, timeline,
propositions, audit) décrivent **exactement** ce cockpit. La bonne idée est là,
appliquée au mauvais objet (un mariage fictif exposé en vitrine).

---

## 3. Le diagnostic en une phrase

> Le cœur mariage fonctionne, mais la couche « démonstration » s'est branchée
> **par-dessus** lui (elle réécrit les vrais sites) et **autour** de lui (trois
> navigations, quatre lexiques, zéro rétroplanning). Il ne faut pas ajouter une
> couche de simplification : il faut **débrancher, puis rebrancher la bonne idée au
> bon endroit.**

---

## 4. La solution la plus simple : **1 dossier, 3 écrans, 1 labo**

### La règle de tri

> **Est-ce qu'un marié s'en sert pour organiser son mariage ou pour le montrer à ses
> invités ?**
> Oui → dans le produit. Non → dans `/labo`. Aucune exception.

### L'architecture cible

```
/                    Accueil : une phrase, un bouton « Créer notre site »
/creer               4 questions
/mariage/:id         LE DOSSIER — 4 onglets : Organisation · Site · Invités · Partage
/p/:slug             Le site public (ne change pas)
/labo                Tout le reste, rangé sur une seule page
```

Trois écrans, un dossier, une porte. Navigation principale : **deux liens**
(« Mon mariage », « Notre site »).

### Le tableau de bord « Organisation » — l'onglet qui manque

Il ne faut rien inventer : les données existent déjà.

| Onglet | Contenu | Réutilise |
| --- | --- | --- |
| **Rétroplanning** | J-365 → Jour J, tâches cochables, assignées à un rôle | les `aime_timeline_nodes` + `programme_events` |
| **Invités** | Liste consolidée, présents/absents, régimes, enfants, **plan de table** | `rsvp_responses` + `RsvpManager` (déjà écrit) |
| **Prestataires** | Traiteur, DJ, photographe : rôle, contact, missions, ce qu'ils voient | `aime_identities` + `aime_contextual_relations` |
| **Site** | L'éditeur actuel, inchangé | `Editor.tsx` tel quel (+ panneau Publication, à ajouter) |
| **Partage** | Lien, QR, WhatsApp, clé d'édition | `SharePanel` (déjà écrit) |

**« Qui voit quoi »** devient une phrase, pas un graphe : *Le traiteur voit les
heures de repas et les allergènes. Le photographe voit le programme. Personne ne
voit les coordonnées des invités.* C'est le contenu du Kernel AIME — exprimé en
français, sur le vrai mariage, pas sur Sarah & Gabriel.

---

## 5. Plan d'exécution, dans l'ordre

### Étape 0 — Débrancher la démo *(30 min, à faire aujourd'hui)*

1. `aimeKernelBridge.ts` : la projection ne s'applique **que** si le site visé est
   explicitement le projet de démo (`import.meta.env.DEV` **et** slug `demo`).
   Supprimer le `partner2: 'Gabriel'` en dur.
2. `siteData.ts:128` et `Editor.tsx:134` : retirer l'appel (ou le conditionner).
3. `RsvpForm.tsx:50` : retirer l'écriture dans le Kernel de démo ; garder la vraie
   réponse RSVP.
4. Mettre à jour les tests « passes » qui valident le contraire, et les intégrer à
   `npm test` (aujourd'hui 4 fichiers de tests ne tournent jamais).

**Résultat vérifiable : créer un site → il garde les prénoms, la date et le lieu
qu'on lui a donnés.**

### Étape 1 — Une seule porte *(2 h)*

- Accueil ramené à : hero + agent IA (la saisie en langage naturel, qui est bonne)
  + « Créer notre site » + 6 modules + phases. On sort `CommunityFeedHub`,
  `ComplementaryThemes`, `ImmersiveThemes`, `ThemeMixerStudio`, le studio DJ, la
  barre flottante.
- Les deux menus déroulants (EVENT OS, UNIVERS & MÉTIERS) disparaissent de la nav.
- `/features`, `/aime`, `/theater`, `/taxonomie`, `/timeline`, `/modules`, `/modules`
  → redirigés vers `/labo`. **On ne supprime aucun fichier** : on les sort du chemin.

### Étape 2 — Un seul cockpit *(1–2 jours)*

- `/editeur/:id` devient `/mariage/:id` avec 4 onglets : Organisation · Site ·
  Invités · Partage.
- Ajouter les 3 tables qui manquent : `tasks` (rétroplanning), `vendors`
  (prestataires), `tables` (plan de table) — chacune en 3 lignes dans `api/`, comme
  le README le décrit déjà.

### Étape 3 — Rebrancher la seule innovation qui compte *(2–3 jours)*

Brancher `bidirectionalAlignmentEngine` + le Kernel AIME **sur le vrai mariage** :
un lien privé par rôle (`/m/:id/traiteur`, `/m/:id/photo`) qui ouvre la même
timeline filtrée. C'est la promesse tenue du produit, et elle marche sans WebRTC.

**Ce qu'on ne fait pas :** pas de Talkie-Walkie, pas de Radio, pas d'orchestration
prédictive avant que le rétroplanning soit utilisé par de vrais mariés. Une démo
audio sans voix ne se défend pas devant un client.

---

## 6. Ce qu'on garde / ce qu'on archive

| Garder (le meilleur) | Archive `/labo` | À supprimer (orphelins) |
| --- | --- | --- |
| Les 4 questions + l'agent de saisie libre (`weddingAgent`) | AIME Graph, Taxonomie, Mosaïque | `EditorShowcase`, `PhoneShowcase`, `IntegratedMirrorTimelineBar`, `ThemeMixerStudio`, `TimelineTheaterStudio` |
| L'éditeur (structure, apparence, aperçu, média) | Event OS (3 studios) | `aimeMockData`, `bidirectionalAlignmentEngine` (à rebrancher, pas à jeter) |
| Les 12 sections du site public | Timeline Theater | |
| RSVP + manager + envoi WhatsApp/mail | Stories Live, Saxo, Radar | |
| Cagnotte, galerie, programme, FAQ, infos | Univers / thèmes (20) → en garder 6 | |
| 20 univers → **6** | | |
| 28 rôles → **8** (mariés, témoins, officiant, traiteur, DJ, photo, invités, régie) | | |
| Clé d'édition, partage, QR, copie statique | | |

---

## 7. Fait dans la première passe

### Réparé

- **Le bug bloquant est corrigé.** `AimeKernelBridge.projectWorldProjectToSiteData`
  n'est plus appelé par `siteData.ts`, `Editor.tsx` ni `RsvpForm.tsx` : un mariage
  créé garde ses prénoms, sa date, son lieu et son programme. Le Kernel reste
  intact, mais il ne filtre plus les données des vrais mariés.
- **Le champ du hero ne crée plus de site fantôme.** Il menait à `/generation`
  avec un site nommé « Les Mariés » / « Lieu à définir » ; il mène désormais à
  `/creer` avec l'univers choisi pré-sélectionné.

### Supprimé (6 800 lignes)

| Lot | Fichiers |
| --- | --- |
| Event OS | `Features.tsx`, `Theater.tsx`, `UnifiedEventOsMenu`, `PredictiveOrchestrationStudio`, `TalkieWalkieStudio`, `VowsLiveRadioStudio`, `TimelineTheaterStudio` |
| Vitrines de démonstration | `WeddingLiveStoriesFeed`, `SaxophonistProfileModal`, `CommunityFeedHub`, `ThemeManifestoWhite`, `ComplementaryThemes`, `ImmersiveThemes`, `EditorShowcase`, `ThemeMixerStudio` |
| Téléphones redondants | `HomeTriplePhoneShowcase`, `ThemePhoneShowcase`, `PhoneShowcase`, `IntegratedMirrorTimelineBar` |
| Code mort | `aimeMockData`, `weddingAgent` |

Routes `/features`, `/modules`, `/theater`, `/timeline` → redirection vers
l'accueil. La barre flottante du mini-site passe de 6 pictos à un seul bouton
utile : la timeline.

### Construit

- `src/lib/roleCockpits.ts` — les 7 rôles (`UNIVERSAL_ROLES`, rebranché), filtrés
  par la `visibility` de la timeline, avec les vrais morceaux de `public/audio/`.
- `src/components/RoleCockpitShowcase.tsx` — la grande section blanche : le
  sélecteur de rôle, l'iPhone au centre, et **un seul écran** qui contient le
  visuel, le nom du rôle, les informations du rôle, la carte musicale (lecture
  réelle), la timeline en bas, et l'inspecteur au centre au clic.
- `src/lib/gestureCatalog.ts` — 40 cartes (26 métiers + 14 moments) : la
  taxonomie complète d'un mariage. Une recherche sans résultat produit malgré
  tout une carte, avec un visuel d'univers et une durée à régler.
- `src/components/TimelineGesture.tsx` — le geste : on cherche, la carte
  apparaît, on la glisse sur la timeline du Jour J (ou on la touche puis on
  touche l'heure, au doigt), on règle début et durée aux réglettes. Une carte
  « métier » notifie la personne, qui doit confirmer son créneau.
- `src/pages/Landing.tsx` — de 15 sections à 5 : hero + champ, l'écran par rôle,
  le geste, un parallax, l'appel final. Le champ du hero ne se contente plus de
  chercher : l'univers qu'on y choisit devient une carte prête à glisser.

### Mesuré

| | Avant | Après |
| --- | --- | --- |
| Lignes `src/` | 23 190 | 17 107 |
| Composants racine | 40 | 25 |
| Pages | 7 | 6 |
| Fichiers suivis | 213 | 192 |
| Sections de l'accueil | 15 | 5 |

`npm test` : 166 contrôles, 0 échec. `tsc -b` et le lint passent sur les fichiers
touchés.

### À trancher, pas encore fait

1. **Les 4 tests « passe »** (`canonical_source_test`, `passe7`, `passe51`,
   `passe12`) verrouillent la régression corrigée et ne tournent pas dans
   `npm test`. À réécrire sur les cockpits par rôle, ou à retirer.
2. **`/aime`** reste accessible par URL (plus aucun lien depuis l'accueil) :
   supprimer, ou rebrancher derrière le moteur.
3. **Les 6 tables `aime_*`** et l'adaptateur de persistance : utiles seulement si
   le cockpit devient réel (tâches, prestataires, plan de table).
4. **Le dossier `/mariage/:id`** (rétroplanning, invités, plan de table,
   prestataires) : c'est la prochaine construction, pas une suppression.

## 8. Critère de réussite

Un couple qui arrive sur le site doit pouvoir, **sans explication** :

1. créer son site en moins de 2 minutes,
2. trouver le rétroplanning et la liste d'invités en un clic,
3. envoyer le lien à ses invités,
4. ne jamais tomber sur « Sarah & Gabriel ».
