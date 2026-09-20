# Les visuels du magazine

Un dossier par jour de l'année, en `MM-JJ`, et dedans :

```
09-21/
  couverture.jpg     le fond de la couverture (365 attendus)
  couverture-2.jpg   une autre candidate : le casting choisira (jusqu'à -3)
  aube.jpg           le personnage, au premier des cinq moments
  matin.jpg
  midi.jpg
  apres-midi.jpg
  soir.jpg
```

**1 825 scènes** = 365 jours × 5 moments, **le même personnage cinq fois**.
**365 fonds** de couverture. Le détail des plans attendus, avec leur brief, est
dans `docs/casting-des-couvertures.md` (engendré par `npm run prompts`).

Après avoir déposé des images : `npm run photos` relève ce qui est arrivé et met à
jour `src/lib/photosDuMagazine.ts`. Le site prend alors **la photo** ; là où il n'y
en a pas, **le dessin** reste — une image manquante ne casse jamais une page.

La nuit n'a pas d'image : c'est la queue de la veille, et la couverture garde son
dessin.
