import { crud } from '../server/crud.js';

export default crud({ table: 'programme_events', label: 'programme', read: 'published-or-owner', write: 'owner' });
