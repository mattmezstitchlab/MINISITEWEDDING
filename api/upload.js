import supabase from '../server/db-client.js';
import { ownerSiteId, unauthorized } from '../server/auth.js';
import { respondError } from '../server/errors.js';

export const config = { api: { bodyParser: { sizeLimit: '12mb' } } };

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-site-token');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    // Téléverser dans le bucket public exige une clé d’édition valide.
    if (!(await ownerSiteId(req))) return unauthorized(res, 'Clé d’édition requise');

    const { fileName, fileBase64, contentType } = parseBody(req);
    if (!fileName || !fileBase64) return res.status(400).json({ error: 'Fichier manquant' });
    const buffer = Buffer.from(fileBase64, 'base64');
    const safeName = `${Date.now()}-${String(fileName)}`.replace(/[^a-zA-Z0-9._-]/g, '_');
    const { error } = await supabase.storage.from('wedding-media').upload(safeName, buffer, { contentType: contentType || 'image/jpeg', upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('wedding-media').getPublicUrl(safeName);
    return res.status(200).json({ url: data.publicUrl });
  } catch (err) {
    return respondError(res, err, 'upload');
  }
}
