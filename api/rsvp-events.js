import { crud } from '../server/crud.js';

export default crud({ table: 'rsvp_events', label: 'rsvp-events', read: 'published-or-owner', write: 'owner' });
