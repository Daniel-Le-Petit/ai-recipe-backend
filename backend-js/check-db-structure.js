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

async function checkDatabaseStructure() {
  const db = knex(dbConfig);
  
  try {
    console.log('🔍 Vérification de la structure de la base de données...\n');
    
    // Vérifier si la table recipies existe
    const hasTable = await db.schema.hasTable('recipies');
    if (!hasTable) {
      console.log('❌ La table recipies n\'existe pas');
      return;
    }
    console.log('✅ La table recipies existe');

    // Lister toutes les colonnes de la table recipies
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

    // Vérifier spécifiquement les colonnes status et recipe_state
    const hasStatusColumn = await db.schema.hasColumn('recipies', 'status');
    const hasRecipeStateColumn = await db.schema.hasColumn('recipies', 'recipe_state');
    
    console.log('\n🔍 Vérification des colonnes de statut:');
    console.log(`   Colonne 'status' existe: ${hasStatusColumn ? '✅' : '❌'}`);
    console.log(`   Colonne 'recipe_state' existe: ${hasRecipeStateColumn ? '✅' : '❌'}`);

    if (hasStatusColumn && !hasRecipeStateColumn) {
      console.log('\n⚠️ La colonne est encore "status" - migration nécessaire');
      console.log('💡 Exécutez: node run-rename-migration.js');
    } else if (!hasStatusColumn && hasRecipeStateColumn) {
      console.log('\n✅ La migration a été appliquée avec succès');
    } else if (hasStatusColumn && hasRecipeStateColumn) {
      console.log('\n⚠️ Les deux colonnes existent - vérifiez la migration');
    } else {
      console.log('\n❌ Aucune colonne de statut trouvée');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);
  } finally {
    await db.destroy();
  }
}

// Exécuter la vérification
checkDatabaseStructure(); 