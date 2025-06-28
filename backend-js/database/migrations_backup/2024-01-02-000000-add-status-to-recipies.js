'use strict';

module.exports = {
  async up(knex) {
    // Ajouter la colonne status à la table recipies
    await knex.schema.alterTable('recipies', (table) => {
      table.enum('status', [
        'draft',
        'saved', 
        'submitted',
        'approved',
        'ordered',
        'completed',
        'archived',
        'rejected'
      ]).defaultTo('draft').notNullable();
    });
  },

  async down(knex) {
    // Supprimer la colonne status
    await knex.schema.alterTable('recipies', (table) => {
      table.dropColumn('status');
    });
  }
}; 