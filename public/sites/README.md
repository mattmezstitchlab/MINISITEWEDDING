# Les mini-sites publiés

Un fichier `<slug>.json` par mini-site, servi tel quel par l’hébergeur : c’est
ce que voient les invités, depuis n’importe quel appareil. C’est aussi le repli
utilisé quand une base distante ne répond pas.

En mode autonome (le mode par défaut, sans Supabase), **déposer un fichier ici
est la publication** : le panneau *Partager* de l’éditeur le produit, il suffit
de le ranger dans ce dossier et de redéployer.

## Produire un fichier

- le bouton **« Télécharger »** du panneau *Partager* de l’éditeur — le fichier
  est nommé comme il faut, `<slug>.json` ;
- ou, si une base distante répond :

```bash
npm run snapshot                        # tous les sites publiés
npm run snapshot -- --slug mon-site     # un seul site
npm run snapshot:demo                   # le jeu de démonstration, sans base
```

Le nom du fichier doit être exactement le slug du site : c’est l’URL demandée
par le front (`/sites/<slug>.json`).

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

Un fichier est un **instantané** : après une modification dans l’éditeur,
retéléchargez-le et remplacez-le, sinon le lien partagé affichera l’ancienne
version. Voir la section « Fonctionner sans base de données » du README.
