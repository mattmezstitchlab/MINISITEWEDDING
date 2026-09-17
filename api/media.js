import { crud } from '../server/crud.js';

// Bibliothèque partagée, sans rattachement à un site : lecture publique,
// écritures réservées à un propriétaire de site (n’importe lequel).
export default crud({
  table: 'media_assets',
  label: 'media',
  order: 'id',
  filters: ['category', 'collection'],
  methods: ['GET', 'POST', 'DELETE'],
  read: 'public',
  write: 'any-owner',
});
