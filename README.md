# WEDDING SITE

Le mini-site d’un mariage, composé automatiquement à partir de quatre réponses
(prénoms, date, lieu, environnement) puis personnalisable dans un éditeur
visuel, et partageable par lien ou QR code.

- **Page publique** `/p/:slug` — hero et compte à rebours, histoire, programme,
  lieux, infos pratiques, RSVP, cagnotte, galerie, FAQ, contact.
- **Éditeur** `/editeur/:id` — aperçu cliquable du site (desktop/mobile),
  structure réordonnable par glisser-déposer, apparence, bibliothèque média,
  suivi des RSVP, publication et partage. Protégé par une clé d’édition propre au
  site (voir [Sécurité](#sécurité)).
- **Création** `/creer` puis `/generer` — questionnaire en quatre étapes,
  amorçage d’un site complet (sections, programme, infos, FAQ, cagnottes).

## Stack

| Couche | Choix |
| --- | --- |
| Front | React 19, TypeScript, Vite 7, Tailwind CSS 4, Framer Motion, lucide-react |
| Routage | react-router-dom 7 |
| Backend | Aucun par défaut ; fonctions serverless Vercel (`api/`) en option |
| Données | Base du navigateur (`localStorage`) ; Supabase en option |
| QR code | qrcode.react |

## Démarrage

```bash
npm install
npm run dev              # http://localhost:5173 — aucune variable requise
```

```bash
npm run lint     # ESLint
npm test         # trois lots : API, front, interface
npm run build    # tsc -b puis vite build
npm run preview  # sert le build
npm run snapshot # copies statiques des sites publiés (voir plus bas)
```

**En développement uniquement** (`import.meta.env.DEV`), un slug inconnu bascule
sur le jeu de démonstration de `src/lib/demo.ts` — un mariage fictif et les
visuels de `public/images/`. En production, rien de tel : une erreur remonte
normalement.

## Fonctionner sans base de données

Par défaut, le projet n’a besoin **d’aucun service externe** : ni compte, ni
carte bancaire, ni variable d’environnement. Il tourne tel quel après
`npm install`.

| | Où vivent les données | Pour qui |
| --- | --- | --- |
| Mode autonome (défaut) | le navigateur, sous la clé `wedding-site:db` (`src/lib/localStore.ts`) | créer, modifier, prévisualiser, publier |
| Fichier publié | `public/sites/<slug>.json`, servi comme un fichier ordinaire | les invités, depuis n’importe quel appareil |
| Supabase (option) | PostgreSQL + Storage, via les fonctions de `api/` | plusieurs éditeurs, réponses centralisées |

### Créer, modifier, partager

`src/lib/localApi.ts` rejoue les fonctions de `api/` dans le navigateur — mêmes
chemins, mêmes corps de requête, mêmes codes d’erreur et **mêmes règles
d’autorisation** : une clé d’édition d’un autre site est refusée (403), un
brouillon reste invisible, un GET d’enfants sans `site_id` renvoie 400. Aucun
écran ne sait quelle source il interroge : l’aiguillage tient dans
`src/lib/dataSource.ts`.

1. **Créer** sur `/creer` : le site complet (sections, programme, infos, FAQ,
   cagnottes) est composé et rangé sur l’appareil.
2. **Modifier** dans l’éditeur : chaque changement est écrit immédiatement.
3. **Publier** depuis le panneau *Partager* → **Télécharger**, puis déposer le
   fichier dans `public/sites/`. Il doit s’appeler exactement `<slug>.json`. Le
   déploiement le sert : le lien et le QR code fonctionnent alors partout.

### Les réponses des invités

Sans base, une réponse rangée dans le navigateur de l’invité n’arriverait jamais
aux mariés. Le formulaire propose donc un envoi direct — **WhatsApp** ou
**e-mail**, message déjà rédigé à partir des coordonnées du site (sections
*Contact*). Un point de collecte central reste possible : renseignez
`VITE_RSVP_WEBHOOK` (formulaire gratuit type Formspree) et chaque réponse y est
déposée en plus.

### Ce qu’il faut savoir

- **Les modifications restent sur l’appareil** : une seule personne édite à la
  fois, et le fichier publié sert de sauvegarde. Effacer les données du
  navigateur efface le brouillon.
- **Les photos importées sont recompressées** (1600 px, JPEG 0.82) avant d’être
  rangées : le stockage d’un navigateur se compte en mégaoctets. Si la place
  manque malgré tout, un message le dit au lieu d’échouer en silence (507).
- **Un site publié reste un instantané** : après une modification, retéléchargez
  le fichier et remplacez-le.

### Repasser sur Supabase

Renseignez `VITE_SUPABASE_URL` (et les clés de `api/`) : les mêmes écrans
parlent alors aux fonctions serverless, sans autre changement.
`VITE_DATA_SOURCE=local` ou `=api` force l’un des deux chemins — utile pour
comparer.

### Les copies statiques, repli d’une base distante

Si une base est déclarée et ne répond plus — projet en pause, facture impayée,
variables manquantes — l’API renvoie **`503 supabase_unavailable`**. Le front
bascule alors sur `public/sites/<slug>.json` : l’affichage reste complet, seuls
l’édition et l’envoi des réponses sont suspendus.

```bash
npm run snapshot                        # tous les sites publiés, depuis la base
npm run snapshot -- --slug mon-site     # un seul site
npm run snapshot:demo                   # le jeu de démonstration, sans base
```

Le repli est automatique, et invisible pour l’invité :

| Réponse de l’API | Ce qui s’affiche |
| --- | --- |
| 200 | les données de la base — la copie n’est pas lue |
| 5xx, ou requête qui n’aboutit pas | la copie statique, si elle existe |
| 404 (brouillon) ou 403 (clé refusée) | l’erreur — jamais la copie, qui publierait un brouillon |

Pour ne pas faire attendre les invités pendant que la base est coupée, posez
`VITE_STATIC_SITES=1` sur l’hébergeur : l’API n’est plus interrogée du tout, les
copies font foi.

## Structure

```
api/                    fonctions serverless, une par ressource
  create-site.js        crée le site ET sa clé d’édition (seule entrée possible)
  wedding-sites.js      écrit à la main : lecture par slug ou par id, autorisations
  site-sections.js …    déclaratifs : trois lignes qui délèguent à server/crud.js
server/                 code serveur partagé, JAMAIS exposé comme route
  auth.js               clés d’édition : génération, empreinte, résolution du propriétaire
  crud.js               fabrique de handlers CRUD (GET/POST/PUT/DELETE) + autorisations
  db-client.js          client Supabase (clé de service)
  db-wake.js            réveil de la base endormie sur erreur 5xx
  errors.js             503 supabase_unavailable quand la base est coupée, 500 sinon
scripts/
  export-sites.mjs      écrit public/sites/<slug>.json (npm run snapshot)
public/sites/           copies statiques des mini-sites, servies sans Supabase
src/
  components/
    PublicSiteView.tsx  coquille du rendu : thème, ordre des sections, aperçu
    sections/           une section par fichier + contexte partagé (useSiteView)
    editor/             panneaux d’édition (SectionEditor, Row, draft, NoAccess)
  lib/
    types.ts            types alignés sur supabase/schema.sql
    auth.ts             clés d’édition : stockage navigateur + clé active
    http.ts             apiGet / apiSend (+ en-tête x-site-token, ApiError)
    dataSource.ts       base distante ou base locale : l’aiguillage
    localStore.ts       la base du navigateur (localStorage)
    localApi.ts         les fonctions de api/, rejouées côté navigateur
    mediaSeed.ts        bibliothèque d’images livrée avec le projet
    format.ts           dates, slug, liens Google Maps, liens publics
    weddingStyles.ts    environnements, typographies, options d’apparence
    defaults.ts         contenu par défaut + amorçage d’un nouveau site
    demo.ts             jeu de démonstration (composé depuis defaults.ts)
    staticSite.ts       lecture des copies statiques (repli quand la base est coupée)
    siteData.ts         loadSiteData() + useSiteData() (page publique et éditeur)
  pages/                Landing, Onboarding, Generating, Editor, PublicSite
supabase/schema.sql     schéma complet de la base (tables, index, RLS, clés)
tests/
  api.test.mjs          matrice d’autorisation des handlers, sans base réelle
  front.test.ts         clé d’édition, en-tête x-site-token, amorçage, base locale
  ui.test.ts            rendu réel des composants, sans base distante
```

Les tests remplacent `server/db-client.js` par `tests/mock-db-client.js` et
`fetch` par un enregistreur : `npm test` ne demande ni Supabase ni réseau.

### Conventions

- **Une seule source pour le contenu.** Les textes par défaut (sections,
  programme, FAQ, infos, cagnottes) vivent dans `src/lib/defaults.ts`. Ils
  alimentent à la fois l’amorçage d’un vrai site et la démo : ils ne peuvent
  donc plus diverger.
- **Une seule source pour l’API.** Ajouter une ressource = créer la table dans
  `supabase/schema.sql`, puis un fichier de trois lignes dans `api/` :
  `export default crud({ table: '…' })`. Les particularités (tri, limite,
  filtres, verbes autorisés, recherche par clé) sont des options de la fabrique.
  La même déclaration se reporte dans `TABLES` de `src/lib/localApi.ts`, pour que
  le mode autonome autorise exactement la même chose — `tests/front.test.ts`
  vérifie les deux chemins.
- **L’autorisation se déclare, elle ne s’oublie pas.** `read` vaut `public`,
  `published-or-owner` ou `owner` ; `write` vaut `public`, `owner`, `any-owner`,
  ou un objet par verbe (`{ POST: 'public', PUT: 'owner' }`). Une table enfant
  se protège donc dans la même ligne que sa déclaration — voir `api/rsvp.js`.
- **Sections = composants.** L’ordre d’affichage vient de la base
  (`site_sections.position`) ; la correspondance clé → composant est dans
  `src/components/sections/index.ts`. Une section lit ses données via
  `useSiteView()`, jamais par props en cascade.

## Déploiement

**Sans base** (le cas par défaut) — déployez le dépôt tel quel : aucune variable
n’est nécessaire. Les mini-sites partagés sont les fichiers de `public/sites/`,
produits par le bouton *Télécharger* du panneau *Partager*.

**Vercel** — `vercel.json` ne contient que la configuration du build ; les
variables d’environnement se règlent dans le dashboard Vercel (jamais dans le
dépôt).

**Supabase** (optionnel) — exécutez `supabase/schema.sql` dans l’éditeur SQL du
projet, puis renseignez :

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` / `VITE_SUPABASE_URL` | URL du projet |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `VITE_SUPABASE_ANON_KEY` | clé publique |
| `SUPABASE_SERVICE_ROLE_KEY` | clé de service (contourne RLS) — **serveur uniquement** |
| `FULLSTACK_PROJECT_REF` | référence du projet, pour le réveil de la base |
| `FULLSTACK_RESTORE_API_URL` | endpoint de réveil |
| `VITE_STATIC_SITES` | `1` pour servir les copies de `public/sites/` sans interroger l’API |

## Sécurité

### Clés d’édition

Chaque site possède une **clé d’édition** : un jeton aléatoire de 192 bits
généré par `POST /api/create-site` et renvoyé **une seule fois**, dans la réponse
de création. La base n’en conserve que l’empreinte SHA-256
(`site_secrets.edit_token`) : une fuite de la base en lecture ne livre donc pas
le contrôle des sites.

Le navigateur la range dans localStorage (`src/lib/auth.ts`), indexée par
identifiant (l’éditeur) et par slug (l’aperçu d’un brouillon), et `src/lib/http.ts`
l’envoie dans l’en-tête `x-site-token`. Côté API, `server/auth.js` résout la clé
en `site_id` et refuse tout ce qui ne correspond pas au site visé.

**En mode autonome**, la clé est vérifiée par `src/lib/localApi.ts` avec les
mêmes règles (une clé inconnue ou celle d’un autre site donne 403), mais elle
vit dans le navigateur : elle protège contre un inconnu qui devinerait l’URL de
l’éditeur, pas contre quelqu’un qui a l’appareil en main. Rien n’est envoyé
ailleurs.

| Endpoint | Lecture | Écriture |
| --- | --- | --- |
| `/api/create-site` | — | ouvert : crée le site et sa clé |
| `/api/wedding-sites?slug=…` | publique si le site est publié, sinon propriétaire | — |
| `/api/wedding-sites?id=…`, PUT, DELETE | propriétaire | propriétaire |
| sections, programme, infos, galerie, FAQ, cagnottes, événements RSVP | site publié ou propriétaire | propriétaire |
| `/api/rsvp` (réponses des invités) | **propriétaire seul** | envoi d’un invité : public ; modification : propriétaire |
| `/api/media` | publique (médiathèque partagée) | une clé valide suffit |
| `/api/upload` | — | une clé valide |

Deux verrous ajoutés au passage :

- un GET enfant sans `site_id` renvoie 400 — plus aucun chemin ne liste toutes
  les lignes d’une table ;
- `?preview=1`, qui montrait un brouillon à quiconque connaissait le lien, a
  disparu : c’est la clé qui autorise l’aperçu.

**Un mariage = deux personnes.** Pas de compte, pas d’email : la clé s’affiche
dans le panneau « Partager » de l’éditeur et se transmet par un canal privé
(WhatsApp, par exemple). Elle n’apparaît jamais sur la page publique.

### Clé perdue, ou site créé avant cette mise en place

Les sites déjà présents n’ont pas de clé : ils restent lisibles s’ils sont
publiés, mais l’édition est verrouillée. Pour attribuer ou remplacer une clé,
dans l’éditeur SQL de Supabase (mêmes extraits dans `supabase/schema.sql`,
section « Exploitation des clés d’édition ») :

```sql
insert into site_secrets (site_id, edit_token)
values (42, encode(sha256('VOTRE_CLE'::bytea), 'hex'))
on conflict (site_id) do update set edit_token = excluded.edit_token;
```

Saisissez ensuite `VOTRE_CLE` sur `/editeur/42`. Prenez une chaîne longue et
aléatoire : révoquer revient à en poser une nouvelle, l’ancienne cesse aussitôt
de fonctionner. Côté navigateur, l’écran d’accès refusé propose un champ pour
saisir une clé, et un bouton pour oublier une clé devenue invalide.

### Ce qui est déjà en place

`supabase/schema.sql` active RLS sur toutes les tables (encore faut-il
l’exécuter) et le bucket de stockage n’est pas public en écriture ; les liens
partagés sont dérivés de l’origine réelle du déploiement plutôt que d’un domaine
codé en dur.

La matrice ci-dessus est vérifiée par `npm test` : 95 contrôles sur les handlers
(lecture d’un brouillon, écriture avec la clé d’un autre site, réponses RSVP,
`GET` sans `site_id`, upload, API en 503 quand la base est coupée, intégrité des
copies statiques), 55 sur le front — dont les mêmes autorisations rejouées par
la base locale, création d’un site complet sans aucun appel réseau — et 16 sur
l’interface (rendu réel des composants, envoi RSVP autonome, panneau de
publication).

### À traiter

1. **Les secrets ne doivent jamais être commités.** `vercel.json` a contenu une
   clé de service Supabase en clair. Si ce dépôt a été public un jour,
   **révoquez et régénérez cette clé** dans le dashboard Supabase — nettoyer
   l’historique git ne suffit pas, la clé reste valable jusqu’à sa révocation.
2. **Aucune limitation de débit.** Les endpoints publics (`/api/create-site`,
   l’envoi d’une réponse RSVP) peuvent être matraqués : prévoyez une limite côté
   Vercel (WAF / rate limits) avant d’exposer le service.
3. **`Access-Control-Allow-Origin: *`.** Sans danger tant que le sésame est un
   en-tête et non un cookie, mais à restreindre au domaine si un autre mécanisme
   d’authentification est ajouté.
4. **La clé vit dans localStorage** : du JavaScript tiers injecté sur la page
   pourrait la lire. Aucune ressource externe n’est chargée aujourd’hui — à
   garder en tête avant d’ajouter une analytics ou une régie publicitaire.
