import { crud } from '../server/crud.js';

export default crud({ table: 'faqs', label: 'faqs', read: 'published-or-owner', write: 'owner' });
