import { crud } from '../server/crud.js';

export default crud({ table: 'gallery_photos', label: 'gallery', read: 'published-or-owner', write: 'owner' });
