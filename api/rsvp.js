import { crud } from '../server/crud.js';

// Les réponses contiennent des données personnelles (emails, régimes,
// allergies) : la lecture est réservée à la clé d’édition du site.
// Seul l’envoi d’une réponse par un invité reste public.
export default crud({
  table: 'rsvp_responses',
  label: 'rsvp',
  order: 'created_at',
  direction: 'desc',
  limit: 500,
  read: 'owner',
  write: { POST: 'public', PUT: 'owner', DELETE: 'owner' },
});
