/**
 * Réponses d’erreur des fonctions serverless.
 *
 * Deux cas, deux codes :
 *
 *  - **503 `supabase_unavailable`** — la base ne peut pas répondre (variables
 *    absentes, projet Supabase en pause, facture impayée). Le front traite ce
 *    code comme une indisponibilité et bascule sur la copie statique du site
 *    (`public/sites/<slug>.json`, voir `src/lib/staticSite.ts`) au lieu
 *    d’afficher une page d’erreur à un invité.
 *  - **500** — tout le reste : une vraie erreur du handler.
 *
 * Le fichier n’importe volontairement rien de `db-client.js` : il doit rester
 * chargeable par les tests, qui remplacent ce client par un faux.
 */

/** Vrai si l’erreur signale une base injoignable plutôt qu’un bug. */
export function isSupabaseUnavailable(err) {
  if (!err) return false;
  return err.code === 'SUPABASE_UNAVAILABLE' || err.name === 'SupabaseUnavailableError';
}

/** Code HTTP à renvoyer pour cette erreur. */
export function errorStatus(err) {
  return isSupabaseUnavailable(err) ? 503 : 500;
}

/**
 * Journalise puis répond. `label` sert uniquement à retrouver la fonction
 * concernée dans les journaux Vercel.
 */
export function respondError(res, err, label) {
  console.error(`API ${label} error:`, err);
  const message = (err && err.message) || 'Erreur interne';
  if (isSupabaseUnavailable(err)) {
    return res.status(503).json({ error: message, code: 'supabase_unavailable' });
  }
  return res.status(500).json({ error: message });
}
