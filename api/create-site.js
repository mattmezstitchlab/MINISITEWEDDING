import supabase from '../server/db-client.js';
import { createToken, hashToken } from '../server/auth.js';

/**
 * Création d’un site et de sa clé d’édition.
 *
 * Seul point d’entrée pour créer un site : `POST /api/wedding-sites` n’existe
 * plus, afin qu’aucun site ne puisse naître sans clé — il serait sinon
 * inadministrable, ou pire, administrable par n’importe qui.
 *
 * Réponse : `{ site, edit_token }`. Le jeton en clair n’est renvoyé **qu’ici,
 * une seule fois** ; la base n’en conserve que l’empreinte SHA-256.
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-site-token');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const payload = req.body || {};
    if (!payload.slug || !payload.partner1 || !payload.partner2) {
      return res.status(400).json({ error: 'slug, partner1 et partner2 sont requis' });
    }

    const { data: site, error } = await supabase.from('wedding_sites').insert(payload).select().single();
    if (error) throw error;

    const token = createToken();
    const { error: secretError } = await supabase
      .from('site_secrets')
      .insert({ site_id: site.id, edit_token: hashToken(token) });

    if (secretError) {
      // Sans clé, le site serait inadministrable : on ne le laisse pas orphelin.
      await supabase.from('wedding_sites').delete().eq('id', site.id);
      throw secretError;
    }

    return res.status(201).json({ site, edit_token: token });
  } catch (err) {
    console.error('API create-site error:', err);
    return res.status(500).json({ error: err.message });
  }
}
