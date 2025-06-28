const knex = require('knex');

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

async function checkMigrationStatus() {
  const db = knex(dbConfig);
  
  try {
    console.log('🔍 Vérification du statut des migrations...');
    
    // Vérifier si la migration a été exécutée
    console.log('🚀 Début de la migration pour ajouter le champ recipe_state...');
    
    // Vérifier si la colonne recipe_state existe
    const hasRecipeStateColumn = await db.schema.hasColumn('recipies', 'recipe_state');
    if (hasRecipeStateColumn) {
      console.log('✅ La colonne recipe_state existe bien dans la table recipies');
    } else {
      console.log('❌ La colonne recipe_state n\'a pas été trouvée');
    }

    // Afficher la structure de la table
    const columns = await db.schema.raw(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'recipies' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Structure de la table recipies:');
    columns.rows.forEach(col => {
      console.log(`   ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await db.destroy();
  }
}

// Exécuter la vérification
checkMigrationStatus(); 