'use strict';

/**
 * Migration pour corriger la colonne duration
 * Nettoie les données existantes avant de changer le type
 */

async function up(knex) {
  // Étape 1: Créer une colonne temporaire
  await knex.schema.alterTable('recipies', (table) => {
    table.integer('duration_new');
  });

  // Étape 2: Mettre à jour les données existantes
  const recipes = await knex('recipies').select('id', 'duration');
  
  for (const recipe of recipes) {
    let durationValue = null;
    
    if (recipe.duration) {
      // Extraire le nombre de minutes des chaînes comme "44 minutes"
      const match = recipe.duration.toString().match(/(\d+)/);
      if (match) {
        durationValue = parseInt(match[1], 10);
      }
    }
    
    await knex('recipies')
      .where('id', recipe.id)
      .update({ duration_new: durationValue });
  }

  // Étape 3: Supprimer l'ancienne colonne
  await knex.schema.alterTable('recipies', (table) => {
    table.dropColumn('duration');
  });

  // Étape 4: Renommer la nouvelle colonne
  await knex.schema.alterTable('recipies', (table) => {
    table.renameColumn('duration_new', 'duration');
  });
}

async function down(knex) {
  // En cas de rollback, on ne peut pas restaurer les données originales
  // mais on peut au moins remettre la colonne en string
  await knex.schema.alterTable('recipies', (table) => {
    table.string('duration_old');
  });

  await knex.schema.alterTable('recipies', (table) => {
    table.dropColumn('duration');
  });

  await knex.schema.alterTable('recipies', (table) => {
    table.renameColumn('duration_old', 'duration');
  });
}

module.exports = { up, down }; 