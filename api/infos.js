import { crud } from '../server/crud.js';

// DELETE était absent de l’ancien handler alors que l’éditeur l’appelle :
// la fabrique le fournit, le bouton « Supprimer cette carte » fonctionne.
export default crud({ table: 'infos_pratiques', label: 'infos', read: 'published-or-owner', write: 'owner' });
