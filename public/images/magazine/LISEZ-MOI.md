# Les visuels de la collection — 54 magazines, 7 chapitres

Un dossier par **magazine** (une semaine), et dedans **huit fichiers** :

```
semaine-01/
  cover.jpg            la couverture du magazine 1   (54 attendues)
  01-amoureux.jpg      chapitre 01 — Les Amoureux    (378 attendues)
  02-style.jpg         chapitre 02 — Le Style
  03-lieux.jpg         chapitre 03 — Les Lieux
  04-recevoir.jpg      chapitre 04 — L'Art de recevoir
  05-fete.jpg          chapitre 05 — La Fête
  06-monde.jpg         chapitre 06 — Le Monde
  07-souvenirs.jpg     chapitre 07 — Les Souvenirs
semaine-02/ … semaine-54/
```

**432 images** = 54 couvertures + 378 chapitres. `semaine-53` est le jour de
trop (31 décembre) et `semaine-54` le jour bissextile (29 février) : deux
magazines comme les autres, avec leurs sept chapitres.

- **5 / 7**, portrait. 1000 × 1400 recommandé, ≤ 250 Ko.
- Le nom des fichiers ne se discute pas : il fait le lien avec le site.
- Règles d'image : **aucun texte, aucun lettrage, aucun logo, aucun filigrane** ;
  pas d'icône religieuse ; le mariage est **suggéré** (une robe, une table, une
  ville, une chanson, un objet transmis) — jamais l'imagerie nuptiale
  conventionnelle.
- Sept images d'une même semaine forment **un seul magazine** : même palette,
  même matière, même lumière. Elles se traitent ensemble, pas séparément.

## Après avoir déposé des images

```bash
npm run visuels      # relève ce qui est arrivé, réécrit l'inventaire et le
                     # manifeste, compresse les fichiers trop lourds,
                     # et dit ce qui manque
npm run prompts:aime -- --liste            # l'état de la collection
npm run prompts:aime -- --semaine=26       # les prompts des huit images de la 26
```

Le site prend **la photo quand elle est là**, et garde **son dessin** là où il n'y
en a pas : une image manquante ne casse jamais une page, et une semaine
incomplète n'emprunte jamais le visuel d'une autre semaine.

## Les anciens visuels, par jour

Les dossiers `MM-JJ/` (un par jour : `couverture.jpg`, `aube.jpg`, `matin.jpg`,
`midi.jpg`, `apres-midi.jpg`, `soir.jpg`) appartiennent à **l'ancien modèle** —
« 365 jours, 365 magazines ». Ils ne sont **ni supprimés ni perdus** :

- ils restent lus comme **repli de transition** (troisième rang de la cascade),
  pour le jour auquel ils appartiennent ;
- `npm run visuels` affiche le remappage : `09-21/` → `semaine-38/cover.jpg`
  (couverture) + `semaine-38/05-fete.jpg` (chapitre du 21 septembre) ;
- pour les convertir, il suffit de recopier le fichier au bon nom dans le dossier
  de sa semaine — le mapping complet est dans `docs/magazine-54-semaines.md`.

Le détail du modèle — calendrier, chapitres, replis, mapping — est dans
**`docs/magazine-54-semaines.md`**.
