# Copies statiques des mini-sites

Un fichier `<slug>.json` par mini-site, servi tel quel par l’hébergeur : c’est
le repli utilisé quand Supabase ne répond pas (projet en pause, variables
d’environnement manquantes). Voir `src/lib/staticSite.ts` et la section
« Quand Supabase ne répond pas » du README.

## Produire une copie

```bash
npm run snapshot                        # tous les sites publiés, depuis Supabase
npm run snapshot -- --slug mon-site     # un seul site
npm run snapshot:demo                   # le jeu de démonstration, sans Supabase
```

ou le bouton **« Copie de secours »** du panneau *Partager* de l’éditeur.

## Forme du fichier

Celle de `PublicSiteData` (`src/lib/types.ts`) : un objet `site`, et sept
listes. Les listes absentes sont traitées comme vides au chargement.

```json
{
  "site": { "id": 1, "slug": "mon-site", "partner1": "…", "partner2": "…", "…": "…" },
  "sections": [],
  "programme": [],
  "infos": [],
  "gallery": [],
  "faqs": [],
  "rsvpEvents": [],
  "gifts": [],
  "exported_at": "2026-09-17T12:00:00.000Z"
}
```

Le nom du fichier doit être exactement le slug du site : c’est l’URL demandée
par le front (`/sites/<slug>.json`).
