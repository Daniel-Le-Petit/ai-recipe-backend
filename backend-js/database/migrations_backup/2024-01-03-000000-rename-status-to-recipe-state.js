'use strict';

module.exports = {
  async up(knex) {
    // Renommer la colonne status en recipe_state
    await knex.schema.alterTable('recipies', (table) => {
      table.renameColumn('status', 'recipe_state');
    });
  },

  async down(knex) {
    // Renommer la colonne recipe_state en status
    await knex.schema.alterTable('recipies', (table) => {
      table.renameColumn('recipe_state', 'status');
    });
  }
}; 