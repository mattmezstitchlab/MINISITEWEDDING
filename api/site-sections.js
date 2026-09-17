import { crud } from '../server/crud.js';

// Lecture publique seulement une fois le site publié ; écritures réservées à la clé.
export default crud({ table: 'site_sections', label: 'site-sections', read: 'published-or-owner', write: 'owner' });
