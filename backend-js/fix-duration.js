const { createKnex } = require('@strapi/database');
const path = require('path');

async function fixDurationColumn() {
  console.log('🔧 Correction de la colonne duration...');
  
  try {
    // Configuration de la base de données
    const config = {
      client: 'postgresql', // ou 'sqlite' selon votre configuration
      connection: {
        host: process.env.DATABASE_HOST || 'localhost',
        port: process.env.DATABASE_PORT || 5432,
        user: process.env.DATABASE_USERNAME || 'postgres',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'strapi',
      },
      // Pour SQLite, utilisez :
      // client: 'sqlite',
      // connection: {
      //   filename: process.env.DATABASE_FILENAME || '.tmp/data.db'
      // }
    };

    const knex = createKnex(config);

    console.log('📊 Vérification des données existantes...');
    
    // Vérifier les données existantes
    const recipes = await knex('recipies').select('id', 'duration');
    console.log(`📋 ${recipes.length} recettes trouvées`);
    
    // Afficher quelques exemples
    recipes.slice(0, 5).forEach(recipe => {
      console.log(`  ID ${recipe.id}: duration = "${recipe.duration}"`);
    });

    // Créer une colonne temporaire
    console.log('🔨 Création de la colonne temporaire...');
    await knex.schema.alterTable('recipies', (table) => {
      table.integer('duration_new');
    });

    // Mettre à jour les données
    console.log('🔄 Conversion des données...');
    for (const recipe of recipes) {
      let durationValue = null;
      
      if (recipe.duration) {
        // Extraire le nombre de minutes des chaînes comme "44 minutes"
        const match = recipe.duration.toString().match(/(\d+)/);
        if (match) {
          durationValue = parseInt(match[1], 10);
          console.log(`  ID ${recipe.id}: "${recipe.duration}" → ${durationValue} minutes`);
        } else {
          console.log(`  ID ${recipe.id}: Impossible de convertir "${recipe.duration}"`);
        }
      }
      
      await knex('recipies')
        .where('id', recipe.id)
        .update({ duration_new: durationValue });
    }

    // Supprimer l'ancienne colonne
    console.log('🗑️ Suppression de l\'ancienne colonne...');
    await knex.schema.alterTable('recipies', (table) => {
      table.dropColumn('duration');
    });

    // Renommer la nouvelle colonne
    console.log('🔄 Renommage de la colonne...');
    await knex.schema.alterTable('recipies', (table) => {
      table.renameColumn('duration_new', 'duration');
    });

    console.log('✅ Colonne duration corrigée avec succès!');
    
    // Vérifier le résultat
    const updatedRecipes = await knex('recipies').select('id', 'duration');
    console.log('📊 Données après correction:');
    updatedRecipes.slice(0, 5).forEach(recipe => {
      console.log(`  ID ${recipe.id}: duration = ${recipe.duration} (type: ${typeof recipe.duration})`);
    });

    await knex.destroy();
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error.message);
    process.exit(1);
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  fixDurationColumn();
}

module.exports = { fixDurationColumn }; 