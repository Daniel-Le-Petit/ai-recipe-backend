const knex = require('knex');
const migration = require('./database/migrations/2024-01-03-000000-rename-status-to-recipe-state.js');

// Configuration de la base de données
const dbConfig = {
  client: 'postgresql',
  connection: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 5432,
    user: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'strapi'
  }
};

async function runRenameMigration() {
  const db = knex(dbConfig);
  
  try {
    console.log('🔄 Début de la migration de renommage status → recipe_state...');
    
    // Vérifier si la colonne status existe
    const hasStatusColumn = await db.schema.hasColumn('recipies', 'status');
    if (!hasStatusColumn) {
      console.log('❌ La colonne status n\'existe pas. Aucune migration nécessaire.');
      return;
    }

    // Vérifier si la colonne recipe_state existe déjà
    const hasRecipeStateColumn = await db.schema.hasColumn('recipies', 'recipe_state');
    if (hasRecipeStateColumn) {
      console.log('✅ La colonne recipe_state existe déjà. Aucune migration nécessaire.');
      return;
    }

    // Exécuter la migration
    await migration.up(db);
    
    console.log('✅ Migration terminée avec succès !');
    console.log('📋 La colonne status a été renommée en recipe_state');

    // Vérifier que la migration a bien fonctionné
    const newHasRecipeStateColumn = await db.schema.hasColumn('recipies', 'recipe_state');
    const oldHasStatusColumn = await db.schema.hasColumn('recipies', 'status');
    
    if (newHasRecipeStateColumn && !oldHasStatusColumn) {
      console.log('✅ Vérification réussie : recipe_state existe, status n\'existe plus');
    } else {
      console.log('⚠️ Vérification échouée : problème avec la migration');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await db.destroy();
  }
}

// Exécuter la migration
runRenameMigration(); 