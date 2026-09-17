import { crud } from '../server/crud.js';

export default crud({ table: 'gift_options', label: 'gifts', read: 'published-or-owner', write: 'owner' });
