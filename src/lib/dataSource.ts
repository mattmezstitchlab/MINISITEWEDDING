/**
 * Choix de la source de données.
 *
 * Le projet fonctionne **sans aucun service externe** : les sites vivent alors
 * dans le navigateur (`localStore.ts`) et les mini-sites partagés sont servis
 * par les fichiers `public/sites/<slug>.json`.
 *
 * Si un jour Supabase (ou toute autre base derrière les fonctions `api/`) est
 * de nouveau disponible, il suffit de renseigner `VITE_SUPABASE_URL` au build :
 * les mêmes écrans basculent sur l’API, sans autre changement.
 *
 * `VITE_DATA_SOURCE` force la main : `local` ou `api`.
 */
const forced = import.meta.env.VITE_DATA_SOURCE as string | undefined;

const configured = Boolean(
  import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL
);

let remote = forced === 'api' ? true : forced === 'local' ? false : configured;

/** Vrai quand les écrans parlent aux fonctions serverless plutôt qu’à la base locale. */
export function isRemote(): boolean {
  return remote;
}

/** Bascule réservée aux tests : un même lot vérifie les deux chemins. */
export function setRemote(value: boolean): void {
  remote = value;
}
