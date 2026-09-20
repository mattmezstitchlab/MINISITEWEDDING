import { useEffect, useState } from 'react';

/**
 * LA BIBLIOTHÈQUE DES VISUELS — L'AUTRE REPO, LUE D'ICI
 *
 * Les visuels naissent dans `BIBLIOTHEQUESUPERMAGAZINE` : posés, normalisés
 * (5:7, 1000×1400), déclarés dans son `manifeste.json`, vérifiés. Ici,
 * `scripts/importer-bibliotheque.mjs` copie ce qui est déclaré dans
 * `public/images/biblio/` — ce fichier lit la copie locale. Jamais une image
 * sans sa déclaration : le manifeste local est le contrat.
 */

export interface VisuelBiblio {
  /** `MM-JJ`. */
  jour: string;
  /** Le chemin servi par le site. */
  fichier: string;
  moment: string;
  lumiere: string;
  couleur: string;
  contient: string[];
  note: string;
}

export interface ManifesteBiblio {
  meta?: { format?: { ratio?: string; largeur?: number; hauteur?: number } };
  images: VisuelBiblio[];
}

let cache: VisuelBiblio[] | null = null;

/** Les fonds déclarés, triés par jour. */
export async function chargerBibliotheque(): Promise<VisuelBiblio[]> {
  if (cache) return cache;
  try {
    const res = await fetch('/images/biblio/manifeste.json');
    if (!res.ok) return [];
    const manifeste = (await res.json()) as ManifesteBiblio;
    cache = [...(manifeste.images ?? [])].sort((a, b) => a.jour.localeCompare(b.jour));
    return cache;
  } catch {
    return [];
  }
}

export function useBibliotheque(): VisuelBiblio[] {
  const [fonds, setFonds] = useState<VisuelBiblio[]>(cache ?? []);
  useEffect(() => {
    let vivant = true;
    chargerBibliotheque().then((liste) => {
      if (vivant) setFonds(liste);
    });
    return () => {
      vivant = false;
    };
  }, []);
  return fonds;
}

/** Le fond déclaré pour un jour, s'il existe. */
export function fondDuJour(fonds: VisuelBiblio[], jour: string): VisuelBiblio | null {
  return fonds.find((f) => f.jour === jour) ?? null;
}
