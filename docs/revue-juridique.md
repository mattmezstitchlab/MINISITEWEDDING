# Revue juridique — à contrôler et à valider

> Document de travail pour **Sandrine Sarroche** (marraine du projet) et
> **Me Marie-Alyx Cannu-Bernad**, avocate au barreau de Paris.
> Ce que le site fait aujourd'hui, ce qu'il veut faire demain, et **la liste des
> points qui doivent être validés avant** que l'un ou l'autre ne sorte du
> navigateur de son utilisateur. Rien, ici, n'est un avis juridique.

## 1. Ce que le site est

Un mini-site de mariage. Chacun y entre par **une carte** (son rôle : mariés,
futur·e·s marié·e·s, famille, témoin, invité, prestataire), traverse **un
univers**, et se voit proposer **les métiers** qui le rendent possible. Deux
pages publiques se configurent : le **Shop** (SUPER SHOP, un ticket de caisse) et
le **Footer** (SUPER FOOTER, les documents et les mentions).

## 2. Les données personnelles (le cœur du sujet)

- **Ce qui est collecté** : prénoms, rôle, réponses d'invitation (RSVP), choix de
  menu, morceaux proposés à la playlist, avis (« cœurs »), photos déposées.
- **Où c'est stocké** : par défaut, **dans le navigateur de la personne**
  (`localStorage`, clés préfixées `vows:`) et, quand le serveur est activé, dans
  une base `wedding_live` (Supabase) — voir `supabase/schema.sql` et
  `server/*.js`. Aucune donnée n'est déposée chez un tiers par défaut.
- **Points à trancher** :
  1. **Base légale et information.** Un mariage mêle des personnes qui n'ont pas
     ouvert le site (on saisit un invité, un plat, un avis). Que doit-on leur
     dire, et à quel moment ?
  2. **Durée de conservation.** Un mariage a une date, puis un passé. Combien de
     temps garde-t-on les RSVP, les photos, les messages ?
  3. **Données sensibles.** L'attestation sur l'honneur, la situation sans
     ressource ou sans titre de séjour, le handicap, la religion : dès que
     SUPER FOOTER documente une **situation de vie**, il peut toucher des données
     sensibles (RGPD art. 9). Faut-il les traiter, et comment les cloisonner ?
  4. **Photos de personnes** : droit à l'image, mineurs, personnes décédées
     (le deuil est un axe du footer). Qui consent, et comment se retire-t-on ?
  5. **Sous-traitants** : nommer l'hébergeur, la base, le fournisseur d'e-mails,
     et vérifier les transferts hors UE (le site déploie aussi chez Vercel).

## 3. SUPER FOOTER — les documents (le plus sensible)

Le site **ne génère aucun acte**. Il affiche une **table de correspondance** :
situation → documents qui existent → qui le demande → au nom de qui → pièces à
réunir → source. Les libellés sont dans `src/lib/superFooter.ts` ; un document
dont la source dit « à valider » porte l'état **« à valider »** sur le ticket.

- **Ce qu'il faut valider** :
  1. La formulation actuelle du type « **À faire valider** par un notaire »,
     « relecture juridique conseillée » suffit-elle à écarter le risque de
     **conseil juridique** (et d'exercice illégal) ?
  2. Deux documents sont volontairement renvoyés à un **acte authentique**
     (testament/donation, procuration). Faut-il les écarter de l'outil ?
  3. Les **mentions obligatoires** listées (devis, facture, contrat, cession de
     droits) : faut-il renvoyer à un modèle officiel plutôt qu'à une liste ?
  4. Quand l'outil aidera à **préparer** un document (brouillon, aperçu de
     facture, attestation type), à quelles conditions ? Qui engage la
     responsabilité — la personne, le site, ou personne ?
  5. **Public vulnérable** : sans-papiers, sans ressources, hébergé, demande
     d'asile. Une information inexacte peut coûter cher. Faut-il un avertissement
     dédié, une version traduite, ou un renvoi humain ?
  6. **Allemand, anglais, espagnol** : une diffusion internationale change les
     obligations (le pays de destination a ses propres règles, et ses propres
     autorités).

## 4. La demande et l'annonce

Aujourd'hui, « **Demander ce document** » enregistre la demande **dans le
navigateur** et l'annonce par une fente, en haut du site (« Document disponible
concernant … »), **visible seulement par la personne**.
Demain, l'annonce pourrait concerner **deux personnes** (celui qui demande, celui
qui fournit). Points à trancher avant :

1. **Qui voit quoi** : le demandeur voit-il que l'autre a lu ? Faut-il un accusé,
   et une trace ?
2. **Consentement explicite** avant qu'une pièce (identité, domicile, revenus) ne
   soit partagée.
3. **Horodatage et valeur probante** : si l'on veut un jour faire foi, il faut
   parler **signature électronique** (eIDAS) et coffre-fort, pas navigateur.
4. **Conservation des pièces** : durée, chiffrement, suppression, journal d'accès.

## 5. Musique, images, droits voisins

- La **playlist collaborative** ne diffuse pas les œuvres originales : elle
  référence des morceaux, et met en avant **ceux qui les rejouent** (groupes de
  reprises, DJ, musiciens). Toute lecture de fichier doit rester licite.
- Le catalogue sonore du dépôt (`public/audio/`) est utilisé comme **extrait de
  démonstration** : à documenter (origine, licence).
- Les **photos** proviennent d'un dossier local, sans crédit affiché. Pour une
  mise en ligne publique : créditer, ou remplacer par des visuels produits.
- Les **prestataires** cités (noms d'usage, marques) : vérifier qu'aucun signe
  distinctif n'est utilisé sans droit.

## 6. Ce que l'on propose pour la suite

1. Un **bandeau d'information** court (une phrase) partout où une donnée
   personnelle est saisie, avec un lien vers une page « Données et droits ».
2. Une page **« Vos droits »** : accès, rectification, effacement, opposition,
   portabilité — avec un contact et un délai.
3. Un **registre des traitements** (quelques pages suffisent) et une **AIPD**
   seulement si le footer traite effectivement des données sensibles à grande
   échelle.
4. Une **validation écrite** des libellés de `superFooter.ts` par un juriste,
   document par document, avant ouverture au public.

## 7. Questions directes

1. Le site peut-il afficher « **la plus grande source de vérité** » des droits ?
   Ou faut-il écrire « une porte d'entrée vers les sources officielles » ?
2. Peut-on nommer les sources (service-public.fr, INPI, préfecture) et renvoyer
   par lien, sans reproduire les formulaires ?
3. Pour les **associations et intermittents** : qui contrôle la formulation des
   démarches — une personne morale, un·e expert·e-comptable, un syndicat ?
4. Faut-il un **âge minimum** et un accord parental pour les personnes mineures
   qui utiliseraient l'outil ?
5. La marraine du projet : à quel moment son nom apparaît-il publiquement, et
   sous quelle formulation ?
